"""Kaushal Setu API: skills-to-employment backend (FastAPI).
Includes:
- Skill assessment, adaptive IRT testing, skill-gap diagnostics
- Autonomous AI Escrow & PayPal Milestone Payouts
- Agentic Course & Certification Checkout
"""
import io
import logging
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import assessment, chatbot, config, data, db, i18n, market, matcher, paypal_service, pipeline, skill_graph, skills

log = logging.getLogger("kaushal_setu")


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    scheduler = None
    if config.REFRESH_ENABLED:
        try:  # weekly market refresh; optional dependency
            from apscheduler.schedulers.background import BackgroundScheduler
            scheduler = BackgroundScheduler()
            scheduler.add_job(market.refresh, "interval", days=7, id="market_refresh")
            scheduler.start()
        except Exception as exc:
            log.info("Scheduler not started: %s", exc)
    yield
    if scheduler:
        scheduler.shutdown(wait=False)


app = FastAPI(title="Kaushal Setu API", version="1.0.0", lifespan=lifespan,
              description="Skill assessment, skill-gap report, autonomous AI escrow payouts, and agentic certification checkout.")
app.add_middleware(CORSMiddleware, allow_origins=config.CORS_ORIGINS, allow_methods=["*"], allow_headers=["*"])
v1 = APIRouter(prefix="/v1")


# ---------- schemas ----------
class UserIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    language: str = Field(default="en", max_length=5)
    education: Optional[str] = Field(default=None, max_length=80)
    target_role: Optional[str] = None


class ResumeIn(BaseModel):
    user_id: Optional[str] = None
    text: str = Field(min_length=10, max_length=20000)


class StartIn(BaseModel):
    user_id: str
    role_id: Optional[str] = None
    max_questions: int = Field(default=10, ge=3, le=24)


class AnswerIn(BaseModel):
    question_id: str
    choice: int


class ChatIn(BaseModel):
    user_id: str
    message: str = Field(min_length=1, max_length=1000)
    language: Optional[str] = None


# PayPal & Escrow Schemas
class MilestoneVerifyIn(BaseModel):
    milestone_id: str
    milestone_title: str
    requirements: List[str]
    deliverable_text: str = Field(min_length=5)
    code_url: Optional[str] = None
    recipient_paypal_email: str = Field(min_length=5)
    stipend_amount_usd: float = Field(gt=0)
    candidate_role: Optional[str] = "Trainee"


class OrderCreateIn(BaseModel):
    course_id: str
    course_title: str
    final_price_usd: float = Field(gt=0)
    currency: Optional[str] = "USD"


class OrderCaptureIn(BaseModel):
    order_id: str


# ---------- helpers ----------
def _user_or_404(uid: str) -> dict:
    u = db.get_user(uid)
    if not u:
        raise HTTPException(404, "User not found")
    return u


def _lookup(fn, *args, **kw):
    try:
        return fn(*args, **kw)
    except KeyError as e:
        raise HTTPException(404, str(e).strip("'\""))
    except pipeline.NoAssessment as e:
        raise HTTPException(409, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))


def _question_out(q: Optional[dict], user: dict) -> Optional[dict]:
    if not q:
        return None
    lang = user.get("language") or "en"
    return {
        "id": q["id"],
        "skill_id": q["skill_id"],
        "skill_name": data.skill_name(q["skill_id"]),
        "difficulty": q.get("difficulty", 50),
        "prompt": i18n.t(q, "prompt", lang),
        "choices": [i18n.t(c, "text", lang) if isinstance(c, dict) else str(c) for c in q.get("choices", [])]
    }


# ---------- system ----------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "database": db.backend(),
        "matching": "embeddings" if matcher.embeddings_enabled() else "tfidf",
        "llm": bool(config.GEMINI_API_KEY or config.ANTHROPIC_API_KEY),
        "paypal_configured": paypal_service.is_configured(),
        "paypal_mode": getattr(config, "PAYPAL_MODE", "sandbox"),
        "market_source": market.current_snapshot().get("source")
    }


@v1.get("/paypal/config")
def paypal_config():
    client_id, _ = paypal_service.get_credentials()
    return {
        "client_id": client_id if client_id != "YOUR_PAYPAL_CLIENT_ID" else "",
        "mode": getattr(config, "PAYPAL_MODE", "sandbox"),
        "configured": paypal_service.is_configured()
    }


@v1.get("/roles")
def list_roles():
    return [{"id": r["id"], "name": r["name"], "sector": r["sector"], "nsqf_level": r["nsqf_level"],
             "skills": [data.skill_name(s["skill_id"]) for s in r["skills"]]} for r in data.roles().values()]


# ---------- core candidate flows ----------
@v1.post("/users")
def create_user(body: UserIn):
    uid = db.create_user(body.name, body.language, body.education, body.target_role)
    return {"user_id": uid}


@v1.get("/users/{user_id}")
def get_user(user_id: str):
    return _user_or_404(user_id)


@v1.post("/resume/parse")
def parse_resume(body: ResumeIn):
    claims = skills.extract_claimed_skills(body.text)
    if body.user_id:
        db.save_claimed_skills(body.user_id, claims)
    return {"claimed_skills": claims}


@v1.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...), user_id: Optional[str] = None):
    content = await file.read()
    text = pipeline.extract_text_from_pdf(content) if file.filename.lower().endswith(".pdf") else content.decode("utf-8", errors="ignore")
    claims = skills.extract_claimed_skills(text)
    if user_id:
        db.save_claimed_skills(user_id, claims)
    return {"claimed_skills": claims, "characters": len(text)}


@v1.post("/assessment/start")
def start_assessment(body: StartIn):
    user = _user_or_404(body.user_id)
    role_id = body.role_id or user.get("target_role") or "electrician"
    state = assessment.init_session(body.user_id, role_id, body.max_questions)
    q = assessment.next_question(state)
    db.save_session(state)
    return {"session_id": state["id"], "question": _question_out(q, user)}


@v1.post("/assessment/{session_id}/answer")
def submit_answer(session_id: str, body: AnswerIn):
    state = db.get_session(session_id)
    if not state:
        raise HTTPException(404, "Session not found")
    user = _user_or_404(state["user_id"])
    result = _lookup(assessment.submit_answer, state, body.question_id, body.choice)
    q = assessment.next_question(state)
    db.save_session(state)
    return {"result": result, "done": state["done"], "question": _question_out(q, user),
            "progress": {"answered": len(state["answers"]), "max_questions": state["max_questions"]}}


# ---------- outputs ----------
@v1.get("/report/{user_id}")
def report(user_id: str):
    _, rep, _, _ = _lookup(pipeline.report_for, user_id)
    return rep


@v1.get("/learning-path/{user_id}")
def learning_path(user_id: str, hours_per_week: float = Query(default=6, ge=1, le=60), free_only: bool = True):
    path, _ = _lookup(pipeline.path_for, user_id, hours_per_week, free_only)
    return path


@v1.get("/opportunities/{user_id}")
def opportunities(user_id: str, limit: int = Query(default=6, ge=1, le=20)):
    items, _ = _lookup(pipeline.opportunities_for, user_id, limit)
    return {"items": items, "note": "Entries marked sample=true are demo data; replace with verified listings."}


@v1.get("/skills/trending")
def trending(limit: int = Query(default=10, ge=1, le=24)):
    return market.trending(limit)


@v1.get("/skills/graph")
def skills_graph(role_id: Optional[str] = None):
    return _lookup(skill_graph.export, role_id)


@v1.post("/market/refresh")
def refresh_market():
    return market.refresh()


# ---------- chatbot ----------
@v1.post("/chat")
def chat(body: ChatIn):
    user = _user_or_404(body.user_id)
    return chatbot.reply(user["id"], body.message, body.language or user.get("language") or "en")


# -------------------------------------------------------------
# PAYPAL FEATURE A: Autonomous AI Escrow & Milestone Payouts
# -------------------------------------------------------------

@v1.get("/escrow/milestones")
def list_escrow_milestones():
    """Provides high-priority industrial & gig milestones with escrow budget."""
    return [
        {
            "id": "MS-FIN-101",
            "title": "GSTR-2B & E-Way Bill Reconciliation Audit",
            "titleHi": "जीएसटीआर-2बी व ई-वे बिल मिलान ऑडिट",
            "employer": "Kedia Logistics & Cold Chain Pvt Ltd",
            "category": "Accounting & Finance",
            "stipendUsd": 35.00,
            "stipendInr": 2900,
            "description": "Perform invoice ledger reconciliation for 150 B2B shipments, verify tax discrepancies, and draft error-free GSTR filing sheet.",
            "descriptionHi": "150 व्यावसायिक इनवॉइस का मिलान करें, ई-वे बिल विसंगतियों की जांच करें और त्रुटि-मुक्त फाइलिंग शीट तैयार करें।",
            "requirements": [
                "Extract GSTR-2B JSON and match against purchase register",
                "Flag ITC ineligible discrepancies exceeding ₹5,000 threshold",
                "Export clean discrepancy reconciliation statement with invoice IDs"
            ],
            "defaultReceiver": "worker-priya@sandbox.paypal.com"
        },
        {
            "id": "MS-SOL-202",
            "title": "5kW Rooftop Solar PV Inverter Calibration & String Sizing",
            "titleHi": "5kW सोलर इन्वर्टर कैलिब्रेशन व लोड स्ट्रिंग साइजिंग",
            "employer": "Tata Power Solar EPC Partner (Fazalganj Hub)",
            "category": "Clean Energy & Electrical",
            "stipendUsd": 45.00,
            "stipendInr": 3750,
            "description": "Calculate Voc and Isc string arrays for a 5kW on-grid dual MPPT inverter, verify anti-islanding protection, and output single-line diagram.",
            "descriptionHi": "5 किलोवाट ग्रिड-टाई इन्वर्टर के लिए Voc व Isc स्ट्रिंग लोड गणना करें और सुरक्षा सिंगल-लाइन आरेख तैयार करें।",
            "requirements": [
                "Calculate temperature-adjusted Voc max under winter irradiance",
                "Ensure combined MPPT input current does not exceed 16A per tracker",
                "Document earthing resistance test certificate under 5 Ohms"
            ],
            "defaultReceiver": "worker-rahul@sandbox.paypal.com"
        },
        {
            "id": "MS-CSC-303",
            "title": "Gram Panchayat AePS Micro-ATM Biometric Terminal Setup",
            "titleHi": "ग्राम पंचायत माइक्रो-एटीएम बायोमेट्रिक टर्मिनल सेटअप",
            "employer": "CSC e-Governance Services India",
            "category": "Digital Financial Inclusion",
            "stipendUsd": 25.00,
            "stipendInr": 2100,
            "description": "Deploy secure RD Service biometric authentication on Android terminal, perform test cash-out transaction with zero error code.",
            "descriptionHi": "माइक्रो-एटीएम टर्मिनल पर बायोमेट्रिक आरडी सर्विस चालू करें और बिना किसी त्रुटि के परीक्षण लेनदेन पूरा करें।",
            "requirements": [
                "Configure UIDAI registered biometric scanner with encryption token",
                "Execute mock ₹100 AePS balance enquiry with simulated RRN log",
                "Submit terminal security compliance audit checklist"
            ],
            "defaultReceiver": "worker-sunita@sandbox.paypal.com"
        }
    ]


@v1.post("/escrow/verify-and-payout")
def verify_milestone_and_payout(body: MilestoneVerifyIn):
    """
    1. AI Verification Agent reviews deliverable against requirements.
    2. Computes score (0-100) and approval threshold.
    3. If approved (score >= 75), triggers PayPal Payouts API automatically.
    """
    log.info("AI Verification Agent evaluating milestone %s for %s", body.milestone_id, body.recipient_paypal_email)

    evaluation = paypal_service.evaluate_milestone_deliverable(
        milestone_title=body.milestone_title,
        requirements=body.requirements,
        deliverable_text=body.deliverable_text,
        code_url=body.code_url,
        candidate_role=body.candidate_role or "Trainee"
    )

    payout_result = None
    if evaluation.get("approved"):
        payout_result = paypal_service.trigger_paypal_payout(
            recipient_email=body.recipient_paypal_email,
            amount_usd=body.stipend_amount_usd,
            milestone_id=body.milestone_id,
            milestone_title=body.milestone_title
        )
    else:
        payout_result = {
            "status": "HELD_IN_ESCROW",
            "message": "Deliverable quality score fell below 75% threshold. Payout remains securely locked in escrow."
        }

    return {
        "milestone_id": body.milestone_id,
        "evaluation": evaluation,
        "payout": payout_result
    }


# -------------------------------------------------------------
# PAYPAL FEATURE B: Agentic Course & Certification Checkout
# -------------------------------------------------------------

@v1.post("/paypal/orders/create")
def create_paypal_order(body: OrderCreateIn):
    """Initiates an autonomous checkout order with dynamic AI scholarship pricing."""
    return paypal_service.create_checkout_order(
        course_id=body.course_id,
        course_title=body.course_title,
        final_price_usd=body.final_price_usd,
        currency=body.currency or "USD"
    )


@v1.post("/paypal/orders/capture")
def capture_paypal_order(body: OrderCaptureIn):
    """Captures the PayPal order on user confirmation and returns verified order receipt."""
    return paypal_service.capture_checkout_order(body.order_id)


app.include_router(v1)
app.include_router(v1, prefix="/api")

@app.get("/api/health")
def api_health():
    return health()
