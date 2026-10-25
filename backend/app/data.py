"""Loads the seed catalogue (skills, roles, questions, courses, opportunities)."""
import json
from functools import lru_cache

from . import config


@lru_cache(maxsize=None)
def _load(name: str):
    with open(config.DATA_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def skills() -> dict:
    return {s["id"]: s for s in _load("skills.json")}


def roles() -> dict:
    return {r["id"]: r for r in _load("roles.json")}


def questions() -> dict:
    return {q["id"]: q for q in _load("questions.json")}


def questions_by_skill() -> dict:
    out: dict = {}
    for q in _load("questions.json"):
        out.setdefault(q["skill_id"], []).append(q)
    return out


def courses() -> list:
    return _load("courses.json")


def curated_opportunities() -> list:
    return _load("opportunities.json")


def snapshot_seed() -> dict:
    return _load("market_snapshot.json")


def get_role(role_id: str) -> dict:
    r = roles().get(role_id)
    if not r:
        raise KeyError(f"unknown role: {role_id}")
    return r


def skill_name(skill_id: str) -> str:
    return skills().get(skill_id, {}).get("name", skill_id)
