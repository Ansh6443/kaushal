import os
import unittest

os.environ["KS_REFRESH_ENABLED"] = "0"
os.environ["PAYPAL_MODE"] = "sandbox"

from fastapi.testclient import TestClient
from app.main import app

class TestPayPalAndEscrow(unittest.TestCase):
    def test_paypal_flows(self):
        with TestClient(app) as client:
            # 1. Health
            r = client.get("/health")
            self.assertEqual(r.status_code, 200)
            data = r.json()
            self.assertIn("paypal_configured", data)

            # 2. Config
            r = client.get("/v1/paypal/config")
            self.assertEqual(r.status_code, 200)
            self.assertEqual(r.json()["mode"], "sandbox")

            # 3. Milestones
            r = client.get("/v1/escrow/milestones")
            self.assertEqual(r.status_code, 200)
            milestones = r.json()
            self.assertGreaterEqual(len(milestones), 2)

            # 4. Escrow verification & payout
            payload = {
                "milestone_id": "MS-FIN-101",
                "milestone_title": "GSTR-2B Reconciliation Audit",
                "requirements": ["Extract GSTR-2B JSON", "Flag ITC ineligible discrepancies"],
                "deliverable_text": "Completed full GSTR-2B purchase register reconciliation. Verified 150 invoices with tax discrepancies flagged under table 4B. Exported clean reconciliation report with full audit trail.",
                "code_url": "https://github.com/test/gst-reconciliation",
                "recipient_paypal_email": "worker-priya@sandbox.paypal.com",
                "stipend_amount_usd": 35.0,
                "candidate_role": "Junior GST Executive"
            }
            r = client.post("/v1/escrow/verify-and-payout", json=payload)
            self.assertEqual(r.status_code, 200)
            res = r.json()
            self.assertTrue(res["evaluation"]["approved"])
            self.assertEqual(res["payout"]["status"], "SUCCESS")

            # 5. Orders create & capture
            create_payload = {
                "course_id": "course-solar-1",
                "course_title": "Advanced Solar Inverter Diagnostics",
                "final_price_usd": 24.50,
                "currency": "USD"
            }
            r = client.post("/v1/paypal/orders/create", json=create_payload)
            self.assertEqual(r.status_code, 200)
            order = r.json()
            self.assertIn("id", order)

            order_id = order["id"]
            capture_r = client.post("/v1/paypal/orders/capture", json={"order_id": order_id})
            self.assertEqual(capture_r.status_code, 200)
            self.assertEqual(capture_r.json()["status"], "COMPLETED")

if __name__ == "__main__":
    unittest.main()
