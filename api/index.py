import os
import sys

# Add backend directory to sys.path so app modules are discoverable
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ["VERCEL"] = "1"
os.environ["KS_REFRESH_ENABLED"] = "0"
os.environ["KS_DB_PATH"] = "/tmp/kaushal_setu.db"

from app.main import app
