"""Glue between storage and the engines; used by both the REST endpoints and the chatbot."""
from . import assessment, db, gap, market, matcher, planner


class NoAssessment(LookupError):
    pass


def report_for(uid: str):
    user = db.get_user(uid)
    if not user:
        raise KeyError("user not found")
    session = db.latest_session(uid)
    if not session:
        raise NoAssessment("No assessment yet. Start one with POST /v1/assessment/start.")
    scores = assessment.skill_scores(session)
    report = gap.build_report(session["role_id"], scores, market.demand())
    report["assessment"] = {"session_id": session["id"], "answered": len(session["answers"]),
                            "max_questions": session["max_questions"], "done": session["done"]}
    snap = market.current_snapshot()
    report["market"] = {"as_of": snap.get("as_of"), "source": snap.get("source")}
    return user, report, scores, session


def path_for(uid: str, hours_per_week: float = 6.0, free_only: bool = True):
    user, report, scores, _ = report_for(uid)
    ranked = matcher.rank_courses(report["skills"], scores, user.get("language") or "en", free_only)
    return planner.build_path(report["skills"], scores, ranked, hours_per_week), report


def opportunities_for(uid: str, limit: int = 6):
    user, report, scores, session = report_for(uid)
    live = market.current_snapshot().get("listings", [])
    return matcher.match_opportunities(session["role_id"], scores, live, limit), report
