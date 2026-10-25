"""Adaptive assessment: Rasch (1-parameter IRT) ability estimate per skill, next question chosen
by skill weight and by difficulty closest to the current ability estimate."""
import math
import uuid

from . import config, data


def p_correct(theta: float, b: float) -> float:
    return 1.0 / (1.0 + math.exp(-(theta - b)))


def new_session(user_id: str, role_id: str, max_questions: int = 10, claimed=None) -> dict:
    role = data.get_role(role_id)
    claimed = set(claimed or [])
    skills = {}
    for rs in role["skills"]:
        sid = rs["skill_id"]
        skills[sid] = {"theta": 0.4 if sid in claimed else 0.0, "n": 0, "correct": 0, "claimed": sid in claimed}
    return {"id": uuid.uuid4().hex[:12], "user_id": user_id, "role_id": role_id,
            "max_questions": max(3, min(int(max_questions), 24)),
            "skills": skills, "asked": [], "answers": [], "pending": None, "done": False}


def _public(q: dict) -> dict:
    return {"id": q["id"], "skill_id": q["skill_id"], "skill_name": data.skill_name(q["skill_id"]),
            "text": q["text"], "options": q["options"]}


def next_question(state: dict):
    """Picks and records the next question (or marks the session done). Mutates state."""
    if state["done"]:
        return None
    if state["pending"]:
        return _public(data.questions()[state["pending"]])
    if len(state["asked"]) >= state["max_questions"]:
        state["done"] = True
        return None
    role = data.get_role(state["role_id"])
    weights = {rs["skill_id"]: rs["weight"] for rs in role["skills"]}
    bank = data.questions_by_skill()
    best = None
    for sid, st in state["skills"].items():
        left = [q for q in bank.get(sid, []) if q["id"] not in state["asked"]]
        if not left:
            continue
        value = weights[sid] / (1 + st["n"]) ** 2  # cover every skill once, then the heavy ones again
        if best is None or value > best[0]:
            best = (value, sid, left)
    if best is None:
        state["done"] = True
        return None
    _, sid, left = best
    theta = state["skills"][sid]["theta"]
    q = min(left, key=lambda x: abs(x["difficulty"] - theta))
    state["asked"].append(q["id"])
    state["pending"] = q["id"]
    return _public(q)


def submit_answer(state: dict, question_id: str, choice: int) -> dict:
    if state["pending"] != question_id:
        raise ValueError("This is not the question currently waiting for an answer.")
    q = data.questions()[question_id]
    if not 0 <= choice < len(q["options"]):
        raise ValueError("Choice index out of range.")
    st = state["skills"][q["skill_id"]]
    correct = choice == q["answer"]
    p = p_correct(st["theta"], q["difficulty"])
    st["theta"] = max(-3.0, min(3.0, st["theta"] + 0.9 / math.sqrt(st["n"] + 1) * ((1.0 if correct else 0.0) - p)))
    st["n"] += 1
    st["correct"] += int(correct)
    state["answers"].append({"question_id": question_id, "choice": choice, "correct": correct})
    state["pending"] = None
    return {"correct": correct, "correct_choice": q["answer"]}


def skill_scores(state: dict) -> dict:
    """0-100 score per role skill. Unassessed skills get a flagged default instead of a hard zero."""
    out = {}
    for sid, st in state["skills"].items():
        if st["n"] > 0:
            score, assessed = round(p_correct(st["theta"], 0.0) * 100), True
        else:
            score, assessed = (50 if st["claimed"] else 20), False
        out[sid] = {"score": score, "assessed": assessed, "questions": st["n"], "claimed": st["claimed"]}
    return out


def level_label(score: int) -> str:
    return "advanced" if score >= config.TARGET_LEVEL else ("intermediate" if score >= 35 else "beginner")
