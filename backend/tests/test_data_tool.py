import csv
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import data_tool  # noqa: E402


class DataToolTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.data = self.tmp / "data"
        shutil.copytree(ROOT / "data", self.data)
        self.csv = self.tmp / "csv"

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_round_trip_keeps_catalogue(self):
        before = {n: json.loads((self.data / f"{n}.json").read_text(encoding="utf-8")) for n in ("courses", "opportunities", "questions")}
        data_tool.export_all(self.data, self.csv)
        counts = data_tool.import_all(self.csv, self.data)
        self.assertEqual(counts, {k: len(v) for k, v in before.items()})
        after = {n: json.loads((self.data / f"{n}.json").read_text(encoding="utf-8")) for n in before}
        self.assertEqual(before, after)

    def test_bad_rows_are_reported_and_nothing_is_written(self):
        data_tool.export_all(self.data, self.csv)
        path = self.csv / "courses.csv"
        rows = list(csv.DictReader(open(path, encoding="utf-8-sig")))
        rows[0]["skills"] = "not_a_skill"
        rows[1]["verified"], rows[1]["url"] = "yes", ""
        with open(path, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.DictWriter(f, fieldnames=data_tool.FIELDS["courses"])
            w.writeheader()
            w.writerows(rows)
        original = (self.data / "courses.json").read_text(encoding="utf-8")
        with self.assertRaises(data_tool.DataError) as ctx:
            data_tool.import_all(self.csv, self.data)
        self.assertTrue(any("row 2" in e and "not_a_skill" in e for e in ctx.exception.errors))
        self.assertTrue(any("row 3" in e and "verified=yes needs a url" in e for e in ctx.exception.errors))
        self.assertEqual(original, (self.data / "courses.json").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
