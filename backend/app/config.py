import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = os.getenv("KS_DB_PATH", str(BASE_DIR / "kaushal_setu.db"))
# Set DATABASE_URL (postgres://...) to use PostgreSQL instead of the local SQLite file
DATABASE_URL = os.getenv("DATABASE_URL", "")

# LLM providers (all optional: the system falls back to rule-based logic)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5-5")
LLM_TIMEOUT = float(os.getenv("LLM_TIMEOUT", "20"))

# Live job data (optional)
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")

# Behaviour
TARGET_LEVEL = int(os.getenv("KS_TARGET_LEVEL", "65"))
REFRESH_ENABLED = os.getenv("KS_REFRESH_ENABLED", "1") == "1"
CORS_ORIGINS = [o.strip() for o in os.getenv("KS_CORS_ORIGINS", "*").split(",") if o.strip()]
