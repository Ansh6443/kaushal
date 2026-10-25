"""Kaushal Setu API: skills-to-employment backend (FastAPI)."""
import io
import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import APIRouter, FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import assessment, chatbot, config, data, db, i18n, market, matcher, pipeline, skill_graph, skills

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
              description="Skill assessment, skill-gap report, learning path, opportunity matching and a career chatbot.")
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


# ---------- system ----------
@app.get("/health")
def health():
    return {"status": "ok", "database": db.backend(),
            "matching": "embeddings" if matcher.embeddings_enabled() else "tfidf",
            "llm": bool(config.GEMINI_API_KEY or config.ANTHROPIC_API_KEY),
            "market_source": market.current_snapshot().get("source")}


@v1.get("/roles")
def list_roles():
    return [{"id": r["id"], "name": r["name"], "sector": r["sector"], "nsqf_level": r["nsqf_level"],
             "skills": [data.skill_name(s["skill_id"]) for s in r["skills"]]} for r in data.roles().values()]


# ---------- users + resume ----------
@v1.post("/users", status_code=201)
def create_user(body: UserIn):
    if body.target_role and body.target_role not in data.roles():
        raise HTTPException(400, "Unknown target_role")
    return db.create_user(body.name, body.language, body.education, body.target_role)


@v1.get("/users/{user_id}")
def get_user(user_id: str):
    return _user_or_404(user_id)


def _store_resume_skills(user_id, found):
    if user_id:
        _user_or_404(user_id)
        db.update_user(user_id, claimed_skills=[f["skill_id"] for f in found])


@v1.post("/resume/parse")
def parse_resume(body: ResumeIn):
    found = skills.extract(body.text)
    _store_resume_skills(body.user_id, found)
    return {"skills": found, "note": "Claimed skills are verified by the assessment, not taken at face value."}


@v1.post("/resume/upload")
async def upload_resume(user_id: Optional[str] = Query(default=None), file: UploadFile = File(...)):
    raw = await file.read()
    if len(raw) > 2_000_000:
        raise HTTPException(413, "File too large (max 2 MB)")
    if (file.filename or "").lower().endswith(".pdf"):
        try:
            from pypdf import PdfReader
            text = "\n".join(p.extract_text() or "" for p in PdfReader(io.BytesIO(raw)).pages)
        except Exception:
            raise HTTPException(400, "Could not read this PDF. Paste the text into /resume/parse instead.")
    else:
        text = raw.decode("utf-8", errors="ignore")
    if len(text.strip()) < 10:
        raise HTTPException(400, "No readable text found in the file")
    found = skills.extract(text[:20000])
    _store_resume_skills(user_id, found)
    return {"skills": found}


# ---------- assessment ----------
def _question_out(q: Optional[dict], user: dict):
    return i18n.localize_question(q, user.get("language") or "en") if q else None


@v1.post("/assessment/start")
def start_assessment(body: StartIn):
    user = _user_or_404(body.user_id)
    role_id = body.role_id or user.get("target_role")
    if not role_id:
        raise HTTPException(400, "Provide role_id (or set target_role on the user)")
    state = _lookup(assessment.new_session, user["id"], role_id, body.max_questions, user["claimed_skills"])
    db.update_user(user["id"], target_role=role_id)
    q = assessment.next_question(state)
    db.save_session(state)
    return {"session_id": state["id"], "role_id": role_id, "max_questions": state["max_questions"],
            "question": _question_out(q, user)}


@v1.post("/assessment/{session_id}/answer")
def answer(session_id: str, body: AnswerIn):
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
    """Prerequisite graph (nodes + edges), optionally limited to one role. Handy for a frontend visualisation."""
    return _lookup(skill_graph.export, role_id)


@v1.post("/market/refresh")
def refresh_market():
    return market.refresh()


# ---------- chatbot ----------
@v1.post("/chat")
def chat(body: ChatIn):
    user = _user_or_404(body.user_id)
    return chatbot.reply(user["id"], body.message, body.language or user.get("language") or "en")


app.include_router(v1)
