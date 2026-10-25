"""Market-demand layer: weekly snapshot of skill demand from live job postings, with a cached fallback."""
import logging
import time

from . import config, data, db, skills as skill_extract

log = logging.getLogger(__name__)


def current_snapshot() -> dict:
    return db.latest_snapshot() or data.snapshot_seed()


def demand() -> dict:
    return current_snapshot().get("demand", {})


def _fetch_adzuna(query: str, n: int = 50) -> list:
    import httpx
    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
    r = httpx.get(url, params={"app_id": config.ADZUNA_APP_ID, "app_key": config.ADZUNA_APP_KEY,
                               "what": query, "results_per_page": n, "content-type": "application/json"},
                  timeout=config.LLM_TIMEOUT)
    r.raise_for_status()
    return r.json().get("results", [])


def refresh() -> dict:
    """Pulls postings for every role, counts skill mentions, stores a new snapshot.
    On any failure the previous snapshot stays in force (cached fallback)."""
    if not (config.ADZUNA_APP_ID and config.ADZUNA_APP_KEY):
        return {"status": "skipped", "reason": "ADZUNA_APP_ID / ADZUNA_APP_KEY not set; using cached snapshot"}
    counts = {sid: 0 for sid in data.skills()}
    listings, total = [], 0
    try:
        for role in data.roles().values():
            for term in role["search_terms"][:1]:
                for p in _fetch_adzuna(term):
                    text = f"{p.get('title', '')} {p.get('description', '')}"
                    found = list(skill_extract.keyword_extract(text))
                    total += 1
                    for sid in found:
                        counts[sid] += 1
                    if len(listings) < 200:
                        listings.append({"id": f"adz_{p.get('id')}", "title": p.get("title"), "type": "job",
                                         "role_id": role["id"], "skills": found,
                                         "company": (p.get("company") or {}).get("display_name"),
                                         "location": (p.get("location") or {}).get("display_name"),
                                         "url": p.get("redirect_url"), "source": "Adzuna", "sample": False})
    except Exception as exc:
        log.warning("Market refresh failed, keeping cached snapshot: %s", exc)
        return {"status": "failed", "reason": str(exc)}
    if total < 20:
        return {"status": "skipped", "reason": f"only {total} postings fetched; keeping cached snapshot"}
    peak = max(counts.values()) or 1
    snap = {"as_of": time.strftime("%Y-%m-%d"), "source": "adzuna", "postings": total,
            "demand": {sid: round(c / peak, 3) for sid, c in counts.items()}, "listings": listings}
    db.save_snapshot(snap)
    return {"status": "ok", "postings": total, "as_of": snap["as_of"]}


def trending(limit: int = 10) -> dict:
    snap = current_snapshot()
    ranked = sorted(snap.get("demand", {}).items(), key=lambda kv: kv[1], reverse=True)[:limit]
    return {"as_of": snap.get("as_of"), "source": snap.get("source"),
            "skills": [{"skill_id": s, "name": data.skill_name(s), "demand_index": round(d * 100)} for s, d in ranked]}
