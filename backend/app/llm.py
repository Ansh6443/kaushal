"""Thin LLM client: Gemini first, Claude second, otherwise None (callers use rule-based fallbacks)."""
import json
import logging
import re

from . import config

log = logging.getLogger(__name__)


def available() -> bool:
    return bool(config.GEMINI_API_KEY or config.ANTHROPIC_API_KEY)


def _gemini(system: str, prompt: str, max_tokens: int):
    if not config.GEMINI_API_KEY:
        return None
    import httpx
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{config.GEMINI_MODEL}:generateContent"
    body = {
        "systemInstruction": {"parts": [{"text": system}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"maxOutputTokens": max_tokens, "temperature": 0.3},
    }
    r = httpx.post(url, json=body, headers={"x-goog-api-key": config.GEMINI_API_KEY}, timeout=config.LLM_TIMEOUT)
    r.raise_for_status()
    return r.json()["candidates"][0]["content"]["parts"][0]["text"]


def _anthropic(system: str, prompt: str, max_tokens: int):
    if not config.ANTHROPIC_API_KEY:
        return None
    import httpx
    r = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers={"x-api-key": config.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01"},
        json={"model": config.ANTHROPIC_MODEL, "max_tokens": max_tokens, "system": system,
              "messages": [{"role": "user", "content": prompt}]},
        timeout=config.LLM_TIMEOUT)
    r.raise_for_status()
    return r.json()["content"][0]["text"]


def complete(system: str, prompt: str, max_tokens: int = 700):
    """Returns text, or None if no provider is configured or all fail."""
    for fn in (_gemini, _anthropic):
        try:
            out = fn(system, prompt, max_tokens)
            if out and out.strip():
                return out.strip()
        except Exception as exc:  # network, quota, bad key, parse error
            log.warning("LLM provider %s failed: %s", fn.__name__, exc)
    return None


def complete_json(system: str, prompt: str, max_tokens: int = 700):
    out = complete(system + "\nReturn ONLY valid JSON, no prose, no code fences.", prompt, max_tokens)
    if not out:
        return None
    out = re.sub(r"^```(?:json)?|```$", "", out.strip(), flags=re.M).strip()
    try:
        return json.loads(out)
    except ValueError:
        return None
