"""Persistence layer. SQLite by default; PostgreSQL when DATABASE_URL is set (needs psycopg)."""
import json
import sqlite3
import time
import uuid
from contextlib import contextmanager

from . import config

IS_PG = config.DATABASE_URL.startswith(("postgres://", "postgresql://"))

_COMMON = [
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, language TEXT DEFAULT 'en', "
    "education TEXT, target_role TEXT, claimed_skills TEXT DEFAULT '[]', created_at DOUBLE PRECISION)",
    "CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT, state TEXT, updated_at DOUBLE PRECISION)",
]
_AUTO = "SERIAL PRIMARY KEY" if IS_PG else "INTEGER PRIMARY KEY AUTOINCREMENT"
SCHEMA = _COMMON + [
    f"CREATE TABLE IF NOT EXISTS snapshots (id {_AUTO}, created_at DOUBLE PRECISION, payload TEXT)",
    f"CREATE TABLE IF NOT EXISTS messages (id {_AUTO}, user_id TEXT, role TEXT, content TEXT, created_at DOUBLE PRECISION)",
]


class _Conn:
    def __init__(self, raw):
        self.raw = raw

    def execute(self, sql, params=()):
        if IS_PG:
            sql = sql.replace("?", "%s")
        return self.raw.execute(sql, params)


@contextmanager
def conn():
    if IS_PG:
        import psycopg
        from psycopg.rows import dict_row
        raw = psycopg.connect(config.DATABASE_URL, row_factory=dict_row)
    else:
        raw = sqlite3.connect(config.DB_PATH)
        raw.row_factory = sqlite3.Row
    try:
        yield _Conn(raw)
        raw.commit()
    finally:
        raw.close()


def backend() -> str:
    return "postgresql" if IS_PG else "sqlite"


def init_db() -> None:
    with conn() as c:
        for stmt in SCHEMA:
            c.execute(stmt)


def _user(row):
    if not row:
        return None
    d = dict(row)
    d["claimed_skills"] = json.loads(d.get("claimed_skills") or "[]")
    return d


def create_user(name, language="en", education=None, target_role=None) -> dict:
    uid = uuid.uuid4().hex[:12]
    with conn() as c:
        c.execute("INSERT INTO users (id,name,language,education,target_role,created_at) VALUES (?,?,?,?,?,?)",
                  (uid, name, language, education, target_role, time.time()))
    return get_user(uid)


def get_user(uid):
    with conn() as c:
        return _user(c.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone())


def update_user(uid, **fields) -> dict:
    allowed = {"name", "language", "education", "target_role", "claimed_skills"}
    sets, vals = [], []
    for k, v in fields.items():
        if k in allowed and v is not None:
            sets.append(f"{k}=?")
            vals.append(json.dumps(v) if k == "claimed_skills" else v)
    if sets:
        with conn() as c:
            c.execute(f"UPDATE users SET {', '.join(sets)} WHERE id=?", (*vals, uid))
    return get_user(uid)


def save_session(state: dict) -> None:
    with conn() as c:
        c.execute("INSERT INTO sessions (id,user_id,state,updated_at) VALUES (?,?,?,?) "
                  "ON CONFLICT (id) DO UPDATE SET user_id=excluded.user_id, state=excluded.state, updated_at=excluded.updated_at",
                  (state["id"], state["user_id"], json.dumps(state), time.time()))


def get_session(sid):
    with conn() as c:
        row = c.execute("SELECT state FROM sessions WHERE id=?", (sid,)).fetchone()
    return json.loads(row["state"]) if row else None


def latest_session(uid):
    with conn() as c:
        row = c.execute("SELECT state FROM sessions WHERE user_id=? ORDER BY updated_at DESC LIMIT 1", (uid,)).fetchone()
    return json.loads(row["state"]) if row else None


def save_snapshot(payload: dict) -> None:
    with conn() as c:
        c.execute("INSERT INTO snapshots (created_at,payload) VALUES (?,?)", (time.time(), json.dumps(payload)))


def latest_snapshot():
    with conn() as c:
        row = c.execute("SELECT payload FROM snapshots ORDER BY id DESC LIMIT 1").fetchone()
    return json.loads(row["payload"]) if row else None


def add_message(uid, role, content) -> None:
    with conn() as c:
        c.execute("INSERT INTO messages (user_id,role,content,created_at) VALUES (?,?,?,?)", (uid, role, content, time.time()))


def recent_messages(uid, limit=6) -> list:
    with conn() as c:
        rows = c.execute("SELECT role,content FROM messages WHERE user_id=? ORDER BY id DESC LIMIT ?", (uid, limit)).fetchall()
    return [dict(r) for r in reversed(rows)]
