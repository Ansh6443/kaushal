"""Course and opportunity matching. Skill-overlap scoring first, TF-IDF text similarity as a tiebreaker.
Optional sentence-transformers embeddings if KS_USE_EMBEDDINGS=1 and the package is installed."""
import math
import os
import re
from collections import Counter
from functools import lru_cache

from . import data

_TOKEN = re.compile(r"[a-z0-9\+\#\.]+")


def _tokens(text: str) -> list:
    return _TOKEN.findall(text.lower())


def embeddings_enabled() -> bool:
    return os.getenv("KS_USE_EMBEDDINGS") == "1" and _model() is not None


@lru_cache(maxsize=1)
def _model():
    try:
        from sentence_transformers import SentenceTransformer
        return SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
    except Exception:
        return None  # package missing or model unavailable -> TF-IDF


@lru_cache(maxsize=512)
def _encode(text: str):
    return _model().encode([text])[0]


def text_similarity(query: str, docs: list) -> list:
    """Cosine similarity of query vs each doc. Multilingual embeddings when enabled, TF-IDF otherwise."""
    if os.getenv("KS_USE_EMBEDDINGS") == "1" and _model() is not None:
        try:
            import numpy as np
            q = _encode(query)
            out = []
            for d in docs:
                v = _encode(d)
                out.append(float(np.dot(q, v) / ((np.linalg.norm(q) * np.linalg.norm(v)) or 1.0)))
            return out
        except Exception:
            pass  # fall through to TF-IDF
    corpus = [_tokens(d) for d in docs] + [_tokens(query)]
    df = Counter(t for doc in corpus for t in set(doc))
    n = len(corpus)

    def vec(doc):
        tf = Counter(doc)
        return {t: c * (math.log((1 + n) / (1 + df[t])) + 1) for t, c in tf.items()}

    qv = vec(corpus[-1])
    qn = math.sqrt(sum(v * v for v in qv.values())) or 1.0
    out = []
    for doc in corpus[:-1]:
        dv = vec(doc)
        dn = math.sqrt(sum(v * v for v in dv.values())) or 1.0
        out.append(sum(qv.get(t, 0) * v for t, v in dv.items()) / (qn * dn))
    return out


def _level_fit(course_level: str, score: int) -> float:
    want = "beginner" if score < 35 else ("intermediate" if score < 65 else "advanced")
    order = ["beginner", "intermediate", "advanced"]
    return 1.0 if course_level == want else (0.75 if abs(order.index(course_level) - order.index(want)) == 1 else 0.4)


def rank_courses(gaps: list, scores: dict, language: str = "en", free_only: bool = True) -> list:
    """gaps: report skill items with gap > 0. Returns courses with the gap skills they cover."""
    gap_by_skill = {g["skill_id"]: g for g in gaps if g["gap"] > 0}
    query = " ".join(g["name"] for g in gap_by_skill.values())
    cands = [c for c in data.courses() if (not free_only or c["cost_inr"] == 0)]
    sims = text_similarity(query, [c["title"] for c in cands]) if cands and query else [0.0] * len(cands)
    ranked = []
    for c, sim in zip(cands, sims):
        covers = [s for s in c["skills"] if s in gap_by_skill]
        if not covers:
            continue
        cover_value = sum(gap_by_skill[s]["priority"] for s in covers)
        level = _level_fit(c["level"], min(scores[s]["score"] for s in covers))
        lang = 1.0 if language in c["languages"] else 0.7
        ranked.append({**c, "covers": covers, "match_score": round(cover_value * level * lang * (1 + 0.1 * sim), 4),
                       "language_match": language in c["languages"]})
    ranked.sort(key=lambda c: c["match_score"], reverse=True)
    return ranked


def match_opportunities(role_id: str, scores: dict, live_listings=None, limit: int = 6) -> list:
    """Scores curated + live listings by how many required skills the user already has (score >= 50)."""
    have_all = {s for s, v in scores.items() if v["score"] >= 50}
    out = []
    for o in list(data.curated_opportunities()) + list(live_listings or []):
        req = o["skills"]
        if not req:
            continue
        have = [s for s in req if s in have_all]
        missing = [s for s in req if s not in have_all]
        coverage = len(have) / len(req)
        role_bonus = 0.15 if o.get("role_id") == role_id else 0.0
        if coverage == 0 and not role_bonus:
            continue
        fit = "ready to apply" if coverage >= 0.75 else ("stretch: close the gaps first" if coverage >= 0.4 else "build skills first")
        reason = (f"You meet {len(have)} of {len(req)} listed skills"
                  + (f" ({', '.join(data.skill_name(s) for s in have)})" if have else "")
                  + (f"; still missing {', '.join(data.skill_name(s) for s in missing)}." if missing else "."))
        out.append({**o, "match": round(min(coverage + role_bonus, 1.0), 3), "fit": fit, "why": reason,
                    "missing_skills": missing})
    out.sort(key=lambda o: o["match"], reverse=True)
    return out[:limit]
