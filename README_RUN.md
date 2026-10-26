# Kaushal Setu - How to Run

## 1. Quick Start (Double click or run batch file)
Windows par seedha `run_app.bat` double click karke ya command line se run karein:
```cmd
run_app.bat
```

---

## 2. Manual Start (Separate Terminals)

### Terminal 1 - Backend (FastAPI):
```powershell
cd backend
.\.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
- **Backend Health Check:** [http://localhost:8000/health](http://localhost:8000/health)
- **API Swagger Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Terminal 2 - Frontend (React + Vite):
```powershell
npm run dev
```
- **Frontend App:** [http://localhost:3000](http://localhost:3000)

---

## 3. Configuration (.env)
- Backend: `backend/.env` (Gemini API key, Adzuna keys optional)
- Default database: Local SQLite file (`backend/app.db`)
