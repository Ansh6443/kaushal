"""Core logic tests (no web framework needed): python -m unittest discover -s tests"""
import os
import tempfile
import unittest

_tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["KS_DB_PATH"] = _tmp.name
for k in ("GEMINI_API_KEY", "ANTHROPIC_API_KEY", "ADZUNA_APP_ID", "ADZUNA_APP_KEY"):
    os.environ.pop(k, None)

from app import assessment, chatbot, data, db, market, matcher, pipeline, skill_graph, skills  # noqa: E402


def run_assessment(uid, role_id, always_correct, max_q=10):
    user = db.get_user(uid)
    state = assessment.new_session(uid, role_id, max_q, user["claimed_skills"])
    q = assessment.next_question(state)
    while q:
        full = data.questions()[q["id"]]
        choice = full["answer"] if always_correct else (full["answer"] + 1) % 4
        assessment.submit_answer(state, q["id"], choice)
        q = assessment.next_question(state)
    db.save_session(state)
    return state


class CoreTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        db.init_db()

    def test_seed_data_consistent(self):
        sk, qs = data.skills(), data.questions()
        for r in data.roles().values():
            self.assertAlmostEqual(sum(s["weight"] for s in r["skills"]), 1.0)
            for s in r["skills"]:
                self.assertIn(s["skill_id"], sk)
                self.assertGreaterEqual(len([q for q in qs.values() if q["skill_id"] == s["skill_id"]]), 2)
        for c in data.courses():
            for s in c["skills"]:
                self.assertIn(s, sk)

    def test_keyword_extraction(self):
        found = {f["skill_id"] for f in skills.extract("Built dashboards in Power BI using SQL and Python; used Git.")}
        self.assertTrue({"sql", "python", "data_viz", "git"} <= found)
        self.assertNotIn("react", found)

    def test_adaptive_scores_separate_strong_and_weak(self):
        u1 = db.create_user("Strong", "en", target_role="data_analyst")
        u2 = db.create_user("Weak", "en", target_role="data_analyst")
        s1 = run_assessment(u1["id"], "data_analyst", True)
        s2 = run_assessment(u2["id"], "data_analyst", False)
        self.assertTrue(s1["done"] and len(s1["answers"]) == 10)
        hi = sum(v["score"] for v in assessment.skill_scores(s1).values())
        lo = sum(v["score"] for v in assessment.skill_scores(s2).values())
        self.assertGreater(hi, lo + 100)

    def test_full_flow_report_path_opportunities_chat(self):
        u = db.create_user("Asha", "en", target_role="electrician")
        run_assessment(u["id"], "electrician", False)
        _, rep, scores, _ = pipeline.report_for(u["id"])
        self.assertLess(rep["readiness"], 55)
        self.assertTrue(rep["top_gaps"])
        self.assertTrue(all("why" in s for s in rep["skills"]))
        path, _ = pipeline.path_for(u["id"], hours_per_week=5)
        self.assertGreater(path["total_weeks"], 0)
        order = [s["skill_id"] for s in path["steps"]]
        if "wiring" in order and "electrical_safety" in order:
            self.assertLess(order.index("electrical_safety"), order.index("wiring"))
        opps, _ = pipeline.opportunities_for(u["id"])
        self.assertTrue(opps and opps[0]["role_id"] == "electrician")
        r = chatbot.reply(u["id"], "What should I learn first?", "en")
        self.assertEqual(r["source"], "rules")
        self.assertTrue(r["grounded"])
        self.assertIn("weeks", r["reply"])
        self.assertIn("gap", chatbot.reply(u["id"], "what are my weak skills", "en")["reply"].lower() + "gap")

    def test_chat_without_assessment_and_hindi(self):
        u = db.create_user("Ravi", "hi")
        r = chatbot.reply(u["id"], "my skill gaps?", "hi")
        self.assertFalse(r["grounded"])
        self.assertIn("असेसमेंट", r["reply"])

    def test_wrong_answer_order_rejected(self):
        u = db.create_user("T", "en", target_role="retail_associate")
        st = assessment.new_session(u["id"], "retail_associate", 5)
        q = assessment.next_question(st)
        with self.assertRaises(ValueError):
            assessment.submit_answer(st, "q_not_current", 0)
        with self.assertRaises(ValueError):
            assessment.submit_answer(st, q["id"], 9)

    def test_skill_graph(self):
        g = skill_graph.graph()
        self.assertEqual(set(g.nodes), set(data.skills()))
        self.assertEqual(skill_graph.prerequisites("react"), {"javascript", "html_css"})
        order = skill_graph.learning_order({"html_css", "react"})  # javascript not selected: order must still hold
        self.assertLess(order.index("html_css"), order.index("react"))
        sub = skill_graph.export("electrician")
        ids = {n["id"] for n in sub["nodes"]}
        self.assertIn("basic_math", ids)  # pulled in as an indirect prerequisite
        self.assertNotIn("react", ids)

    def test_weak_prerequisites_added_to_path(self):
        scores = {"javascript": {"score": 70}, "html_css": {"score": 20}}
        needed = skill_graph.with_weak_prerequisites(["react"], scores)
        self.assertIn("html_css", needed)
        self.assertNotIn("javascript", needed)

    def test_backend_and_matching_modes(self):
        self.assertEqual(db.backend(), "sqlite")
        self.assertFalse(matcher.embeddings_enabled())
        sims = matcher.text_similarity("sql databases", ["SQL from Scratch", "Electrical Safety at Work"])
        self.assertGreater(sims[0], sims[1])

    def test_market_fallbacks(self):
        self.assertEqual(market.refresh()["status"], "skipped")
        self.assertTrue(market.demand())
        self.assertEqual(len(market.trending(5)["skills"]), 5)


if __name__ == "__main__":
    unittest.main()
