"""HTTP-level smoke test. Needs: pip install -r requirements.txt  (skipped if FastAPI is missing)."""
import os
import tempfile
import unittest

_tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["KS_DB_PATH"] = _tmp.name
os.environ["KS_REFRESH_ENABLED"] = "0"
for k in ("GEMINI_API_KEY", "ANTHROPIC_API_KEY"):
    os.environ.pop(k, None)

try:
    from fastapi.testclient import TestClient
    from app.main import app
    from app import data
    HAVE = True
except Exception:  # pragma: no cover
    HAVE = False


@unittest.skipUnless(HAVE, "fastapi/httpx not installed")
class ApiFlow(unittest.TestCase):
    def test_end_to_end(self):
        with TestClient(app) as c:
            h = c.get("/health").json()
            self.assertEqual((h["status"], h["database"]), ("ok", "sqlite"))
            g = c.get("/v1/skills/graph", params={"role_id": "web_developer"}).json()
            self.assertTrue(g["nodes"] and g["edges"])
            u = c.post("/v1/users", json={"name": "Asha", "language": "en", "target_role": "data_analyst"}).json()
            r = c.post("/v1/resume/parse", json={"user_id": u["id"], "text": "I know Excel, SQL and some Python."})
            self.assertEqual(r.status_code, 200)
            s = c.post("/v1/assessment/start", json={"user_id": u["id"], "max_questions": 6}).json()
            q = s["question"]
            while q:
                right = data.questions()[q["id"]]["answer"]
                a = c.post(f"/v1/assessment/{s['session_id']}/answer", json={"question_id": q["id"], "choice": right}).json()
                q = a["question"]
            rep = c.get(f"/v1/report/{u['id']}").json()
            self.assertIn("readiness", rep)
            self.assertEqual(c.get(f"/v1/learning-path/{u['id']}").status_code, 200)
            self.assertEqual(c.get(f"/v1/opportunities/{u['id']}").status_code, 200)
            chat = c.post("/v1/chat", json={"user_id": u["id"], "message": "which jobs fit me?"}).json()
            self.assertTrue(chat["reply"])
            self.assertEqual(c.get("/v1/report/nope").status_code, 404)


if __name__ == "__main__":
    unittest.main()
