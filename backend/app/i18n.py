"""Optional question localisation via the LLM (cached). Falls back to English."""
from . import llm

_cache: dict = {}
LANG_NAMES = {"hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu", "mr": "Marathi", "gu": "Gujarati",
              "kn": "Kannada", "ml": "Malayalam", "pa": "Punjabi", "ur": "Urdu"}


def localize_question(q: dict, lang: str) -> dict:
    if lang == "en" or lang not in LANG_NAMES or not llm.available():
        return {**q, "lang": "en"}
    key = (q["id"], lang)
    if key not in _cache:
        res = llm.complete_json(
            f"Translate quiz text into {LANG_NAMES[lang]}. Keep code, numbers and currency symbols unchanged.",
            f'Return {{"text": "...", "options": ["...", "...", "...", "..."]}} for: {q["text"]} | {q["options"]}')
        ok = isinstance(res, dict) and isinstance(res.get("options"), list) and len(res["options"]) == len(q["options"])
        _cache[key] = res if ok else None
    t = _cache[key]
    if not t:
        return {**q, "lang": "en"}
    return {**q, "text": t.get("text", q["text"]), "options": t["options"], "lang": lang}
