"""Weighted, explainable skill-gap report."""
from . import assessment, config, data


def build_report(role_id: str, scores: dict, demand: dict) -> dict:
    role = data.get_role(role_id)
    target = role.get("target_level", config.TARGET_LEVEL)
    items, got, total = [], 0.0, 0.0
    for rs in role["skills"]:
        sid, w = rs["skill_id"], rs["weight"]
        sc = scores[sid]["score"]
        gap = max(0, target - sc)
        d = demand.get(sid, 0.5)
        priority = round(w * (gap / 100) * (1 + d), 4)
        got += w * min(sc / target, 1.0)
        total += w
        if gap == 0:
            why = f"Meets the target ({sc}/100)."
        else:
            why = (f"Level {sc}/100 vs {target} needed. Carries {round(w * 100)}% of this role's weighting; "
                   f"market demand index {round(d * 100)}/100.")
        if not scores[sid]["assessed"]:
            why += " Not yet assessed, so this is an estimate."
        items.append({"skill_id": sid, "name": data.skill_name(sid), "score": sc,
                      "level": assessment.level_label(sc), "target": target, "gap": gap,
                      "weight": w, "demand_index": round(d * 100), "priority": priority,
                      "assessed": scores[sid]["assessed"], "why": why})
    items.sort(key=lambda i: i["priority"], reverse=True)
    readiness = round(got / total * 100) if total else 0
    return {"role_id": role_id, "role_name": role["name"], "readiness": readiness,
            "readiness_label": "job-ready" if readiness >= 80 else ("close" if readiness >= 55 else "building foundations"),
            "skills": items, "top_gaps": [i for i in items if i["gap"] > 0][:3]}
