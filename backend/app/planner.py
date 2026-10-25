"""Prerequisite-aware, time-constrained learning path (ordering comes from the NetworkX skill graph)."""
import math

from . import data, skill_graph


def build_path(gaps: list, scores: dict, courses_ranked: list, hours_per_week: float = 6.0) -> dict:
    hours_per_week = max(1.0, float(hours_per_week))
    skill_db = data.skills()
    gap_items = [g for g in gaps if g["gap"] > 0]
    priority = {g["skill_id"]: g["priority"] for g in gap_items}
    needed = skill_graph.with_weak_prerequisites(list(priority), scores)
    ordered = skill_graph.learning_order(needed, priority)

    steps, used, covered, week_cursor = [], set(), set(), 0.0
    for sid in ordered:
        if sid in covered:
            continue  # an earlier multi-skill course already teaches this
        course = next((c for c in courses_ranked if sid in c["skills"] and c["id"] not in used), None)
        if course is None:
            steps.append({"skill_id": sid, "skill": skill_db[sid]["name"], "course": None,
                          "note": "No catalogued course yet: practise with a small hands-on task and ask a mentor to review it.",
                          "start_week": None, "end_week": None, "hours": 0})
            continue
        used.add(course["id"])
        covered.update(course["skills"])
        start = week_cursor
        week_cursor += course["hours"] / hours_per_week
        steps.append({"skill_id": sid, "skill": skill_db[sid]["name"], "covers": course.get("covers", [sid]),
                      "course": {k: course[k] for k in ("id", "title", "provider", "level", "hours", "cost_inr", "languages", "url", "verified")},
                      "start_week": int(math.floor(start)) + 1, "end_week": int(math.ceil(week_cursor)),
                      "hours": course["hours"]})
    return {"hours_per_week": hours_per_week, "total_hours": sum(s["hours"] for s in steps),
            "total_weeks": int(math.ceil(week_cursor)) if steps else 0, "steps": steps}
