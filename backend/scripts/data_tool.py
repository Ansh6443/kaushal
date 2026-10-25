"""Edit the catalogue in Excel/Google Sheets instead of JSON.

  python scripts/data_tool.py export    # data/*.json  -> data_csv/*.csv  (open these in Excel)
  python scripts/data_tool.py import    # data_csv/*.csv -> data/*.json   (validated; nothing is written if any row is wrong)

List columns (skills, languages) use | as separator, e.g.  sql|python   or   en|hi
Skill ids and role ids come from data/skills.json and data/roles.json.
"""
import argparse
import csv
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEVELS = {"beginner", "intermediate", "advanced"}
TYPES = {"job", "internship", "apprenticeship"}
DIFFICULTY = {"easy": -0.8, "medium": 0.0, "hard": 0.8}
FIELDS = {
    "courses": ["title", "provider", "skills", "level", "hours", "cost_inr", "languages", "url", "verified"],
    "opportunities": ["title", "type", "role_id", "skills", "location", "source", "url", "sample"],
    "questions": ["skill_id", "difficulty", "text", "option_a", "option_b", "option_c", "option_d", "answer"],
}


class DataError(Exception):
    def __init__(self, errors):
        self.errors = errors
        super().__init__("\n".join(errors))


def _read_csv(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def _write_csv(path, fields, rows):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)


def _load(data_dir, name):
    with open(Path(data_dir) / name, encoding="utf-8") as f:
        return json.load(f)


def _split(v):
    return [x.strip() for x in (v or "").split("|") if x.strip()]


def _yes(v):
    return (v or "").strip().lower() in ("yes", "y", "true", "1")


def export_all(data_dir=ROOT / "data", csv_dir=ROOT / "data_csv"):
    Path(csv_dir).mkdir(parents=True, exist_ok=True)
    rows = [{"title": c["title"], "provider": c["provider"], "skills": "|".join(c["skills"]), "level": c["level"],
             "hours": c["hours"], "cost_inr": c["cost_inr"], "languages": "|".join(c["languages"]),
             "url": c.get("url") or "", "verified": "yes" if c.get("verified") else "no"} for c in _load(data_dir, "courses.json")]
    _write_csv(Path(csv_dir) / "courses.csv", FIELDS["courses"], rows)
    rows = [{"title": o["title"], "type": o["type"], "role_id": o["role_id"], "skills": "|".join(o["skills"]),
             "location": o["location"], "source": o["source"], "url": o.get("url") or "",
             "sample": "yes" if o.get("sample") else "no"} for o in _load(data_dir, "opportunities.json")]
    _write_csv(Path(csv_dir) / "opportunities.csv", FIELDS["opportunities"], rows)
    rows = []
    for q in _load(data_dir, "questions.json"):
        label = {v: k for k, v in DIFFICULTY.items()}.get(q["difficulty"], str(q["difficulty"]))
        rows.append({"skill_id": q["skill_id"], "difficulty": label, "text": q["text"],
                     **{f"option_{c}": q["options"][i] for i, c in enumerate("abcd")}, "answer": "ABCD"[q["answer"]]})
    _write_csv(Path(csv_dir) / "questions.csv", FIELDS["questions"], rows)


def _check_columns(rows, name, errors):
    if rows and not set(FIELDS[name]) <= set(rows[0]):
        errors.append(f"{name}.csv: missing columns {sorted(set(FIELDS[name]) - set(rows[0]))}")
        return False
    return True


def _courses(rows, skill_ids, errors):
    out = []
    for n, r in enumerate(rows, start=2):
        e = lambda m: errors.append(f"courses.csv row {n}: {m}")
        skills, langs, url = _split(r["skills"]), _split(r["languages"]), (r["url"] or "").strip()
        if not r["title"].strip():
            e("title is empty")
        bad = [s for s in skills if s not in skill_ids]
        if not skills or bad:
            e(f"skills must be valid skill ids separated by |  (got {r['skills']!r}; unknown: {bad})")
        if r["level"].strip() not in LEVELS:
            e(f"level must be one of {sorted(LEVELS)}")
        try:
            hours = float(r["hours"])
            hours = int(hours) if hours == int(hours) else hours
            if hours <= 0:
                raise ValueError
        except ValueError:
            e("hours must be a positive number")
            hours = 0
        try:
            cost = int(float(r["cost_inr"] or 0))
            if cost < 0:
                raise ValueError
        except ValueError:
            e("cost_inr must be 0 or a positive number")
            cost = 0
        if not langs:
            e("languages is empty (example: en|hi)")
        if url and not url.startswith(("http://", "https://")):
            e("url must start with http:// or https://")
        if _yes(r["verified"]) and not url:
            e("verified=yes needs a url")
        out.append({"id": f"c{len(out) + 1:02d}", "title": r["title"].strip(), "provider": r["provider"].strip(),
                    "skills": skills, "level": r["level"].strip(), "hours": hours, "cost_inr": cost,
                    "languages": langs, "url": url or None, "verified": _yes(r["verified"])})
    return out


def _opportunities(rows, skill_ids, role_ids, errors):
    out = []
    for n, r in enumerate(rows, start=2):
        e = lambda m: errors.append(f"opportunities.csv row {n}: {m}")
        skills, url, sample = _split(r["skills"]), (r["url"] or "").strip(), _yes(r["sample"])
        if not r["title"].strip():
            e("title is empty")
        if r["type"].strip() not in TYPES:
            e(f"type must be one of {sorted(TYPES)}")
        if r["role_id"].strip() not in role_ids:
            e(f"role_id must be one of {sorted(role_ids)}")
        bad = [s for s in skills if s not in skill_ids]
        if not skills or bad:
            e(f"skills must be valid skill ids separated by |  (unknown: {bad})")
        if url and not url.startswith(("http://", "https://")):
            e("url must start with http:// or https://")
        if not sample and not url:
            e("a real listing (sample=no) needs a url")
        out.append({"id": f"o{len(out) + 1:02d}", "title": r["title"].strip(), "type": r["type"].strip(),
                    "role_id": r["role_id"].strip(), "skills": skills, "location": r["location"].strip(),
                    "source": r["source"].strip(), "url": url or None, "sample": sample})
    return out


def _questions(rows, skill_ids, roles, errors):
    out, count = [], {}
    for n, r in enumerate(rows, start=2):
        e = lambda m: errors.append(f"questions.csv row {n}: {m}")
        sid = r["skill_id"].strip()
        if sid not in skill_ids:
            e(f"unknown skill_id {sid!r}")
            continue
        d = r["difficulty"].strip().lower()
        try:
            diff = DIFFICULTY[d] if d in DIFFICULTY else float(d)
            if not -3 <= diff <= 3:
                raise ValueError
        except ValueError:
            e("difficulty must be easy, medium, hard or a number between -3 and 3")
            diff = 0.0
        opts = [r[f"option_{c}"].strip() for c in "abcd"]
        if not r["text"].strip() or not all(opts):
            e("question text and all four options are required")
        ans = r["answer"].strip().upper()
        if ans not in ("A", "B", "C", "D"):
            e("answer must be A, B, C or D")
            continue
        count[sid] = count.get(sid, 0) + 1
        out.append({"id": f"q_{sid}_{count[sid]}", "skill_id": sid, "difficulty": diff, "text": r["text"].strip(),
                    "options": opts, "answer": "ABCD".index(ans)})
    for role in roles.values():
        for rs in role["skills"]:
            if count.get(rs["skill_id"], 0) < 2:
                errors.append(f"questions.csv: skill {rs['skill_id']!r} (role {role['id']}) needs at least 2 questions")
    return out


def import_all(csv_dir=ROOT / "data_csv", data_dir=ROOT / "data"):
    skills = {s["id"] for s in _load(data_dir, "skills.json")}
    roles = {r["id"]: r for r in _load(data_dir, "roles.json")}
    errors, result = [], {}
    for name, fn in (("courses", lambda r: _courses(r, skills, errors)),
                     ("opportunities", lambda r: _opportunities(r, skills, set(roles), errors)),
                     ("questions", lambda r: _questions(r, skills, roles, errors))):
        path = Path(csv_dir) / f"{name}.csv"
        if not path.exists():
            continue
        rows = _read_csv(path)
        if _check_columns(rows, name, errors):
            result[name] = fn(rows)
    if errors:
        raise DataError(errors)
    for name, items in result.items():
        target = Path(data_dir) / f"{name}.json"
        if target.exists():
            shutil.copy(target, str(target) + ".bak")
        with open(target, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=1, ensure_ascii=False)
    return {k: len(v) for k, v in result.items()}


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("command", choices=["export", "import"])
    a = p.parse_args(argv)
    if a.command == "export":
        export_all()
        print("Wrote data_csv/courses.csv, opportunities.csv, questions.csv. Edit them in Excel, save as CSV (UTF-8), then run: python scripts/data_tool.py import")
        return 0
    try:
        print("Imported:", import_all())
        return 0
    except DataError as exc:
        print("Nothing was changed. Fix these rows and run import again:")
        for line in exc.errors:
            print(" -", line)
        return 1


if __name__ == "__main__":
    sys.exit(main())
