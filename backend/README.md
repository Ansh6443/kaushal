# Kaushal Setu: Backend

FastAPI backend for PS 202608 (skills-to-employment gap): adaptive skill assessment, explainable
skill-gap report, prerequisite-aware learning path, opportunity matching, live market-demand layer
and a grounded career chatbot.

## Run
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # optional: add keys, then export them or use a process manager
uvicorn app.main:app --reload   # docs at http://localhost:8000/docs
python -m unittest discover -s tests
```

**PostgreSQL:** set `DATABASE_URL=postgresql://user:pass@host:5432/dbname` before starting; tables are created on startup.
Without it, a local SQLite file is used. (The PostgreSQL path is written but was not tested against a live server.)
**Embeddings:** `pip install -r requirements-embeddings.txt` (large, pulls PyTorch) then set `KS_USE_EMBEDDINGS=1`; `/health` shows the active matching mode.

## Endpoints (`/v1`)
| Method | Path | Purpose |
|---|---|---|
| GET | /roles | Target roles (IT, marketing, electrician, retail) |
| POST | /users | Create profile (name, language, target_role) |
| POST | /resume/parse, /resume/upload | Extract claimed skills from text / PDF |
| POST | /assessment/start | Begin adaptive assessment, returns first question |
| POST | /assessment/{session_id}/answer | Submit answer, get the next question |
| GET | /report/{user_id} | Readiness %, per-skill gaps with "why", top gaps |
| GET | /learning-path/{user_id}?hours_per_week=6 | Ordered courses with weeks |
| GET | /opportunities/{user_id} | Jobs / internships / apprenticeships with match reasons |
| GET | /skills/trending | Market demand index |
| GET | /skills/graph?role_id= | Prerequisite graph (NetworkX) as nodes and edges |
| POST | /market/refresh | Refresh demand from live postings (Adzuna) |
| POST | /chat | Career assistant (`{user_id, message}`) |

Demo flow: `POST /users` → `POST /assessment/start` → loop `/answer` until `question` is null →
`GET /report`, `/learning-path`, `/opportunities` → `POST /chat`.

## How it works
- **Assessment:** Rasch (1-parameter IRT) ability estimate per skill. Every role skill is asked once,
  then the heaviest-weighted skills again; each question's difficulty is the one closest to the
  current estimate. Resume-claimed skills only nudge the starting estimate and are still tested.
- **Gap report:** `priority = weight × gap × (1 + demand)`; readiness is the weighted share of the target level.
- **Skill graph:** NetworkX DAG of prerequisites; the learning path is a topological order of it, and weak prerequisites are added automatically.
- **Path:** ordered by prerequisites, one course per gap (multi-skill courses cover several), scheduled at `hours_per_week`.
- **Chatbot:** answers from the user's own report/path/listings. With a Gemini or Claude key it uses the LLM
  (grounded prompt, user text treated as data); without one it uses rule-based replies in English/Hindi.
- **Fallbacks:** no LLM → keyword skill extraction + rule-based chat; no jobs API → last cached snapshot;
  no embeddings → TF-IDF matching.

## State of the data (read before the demo)
- `data/courses.json`: 21 courses, every one of the 24 skills has at least one, all with a link and all free to learn.
  14 are `verified: true` (the course page itself was found online). 7 are `verified: false` because only the provider's
  main page was found (freeCodeCamp archived courses, Spoken Tutorial Python, PMKVY Electrician Domestic Solutions,
  Khan Academy): open the link, find the course, then set verified to yes.
- `hours` are planning estimates. Some NPTEL courses are university level (Basic Electrical Circuits, Management of
  Inventory Systems): they are marked `intermediate`, so beginners see them last. Replace with simpler ones if you find them.
  Confirm cost and eligibility for Tata STRIVE and PMKVY training on their own pages.
- `data/opportunities.json`: 10 entries that point to the official portals (PM Internship Scheme, NCS, NAPS) per role.
  They are search pages, not individual vacancies. Check current eligibility on each portal.
- `data/market_snapshot.json` is placeholder demand data until `/market/refresh` runs with Adzuna keys.
- The 48 quiz questions are starter content; have a subject expert review them.
- Edit everything through `data_csv/*.csv` and `python scripts/data_tool.py import`.
- pgvector is not used: embeddings (optional) are computed in memory and cached.

## Filling in real data (no JSON editing)
```bash
python scripts/data_tool.py export    # creates data_csv/courses.csv, opportunities.csv, questions.csv
# edit the CSVs in Excel or Google Sheets, save as CSV (UTF-8)
python scripts/data_tool.py import    # validates every row, then updates data/*.json
```
Columns: `skills` and `languages` use `|` (example `sql|python`, `en|hi`). Use skill ids from `data/skills.json`
and role ids from `data/roles.json`. A course marked `verified=yes` needs a url; a real listing (`sample=no`) needs a url.
If any row is wrong, nothing is changed and the tool lists the exact rows to fix. Restart the server afterwards.
