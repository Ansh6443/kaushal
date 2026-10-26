@echo off
echo ===================================================
echo Starting Kaushal Setu Backend and Frontend...
echo ===================================================

start "Kaushal Backend (FastAPI)" cmd /k "cd backend && call .venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"
start "Kaushal Frontend (Vite)" cmd /k "npm run dev"

echo.
echo Both servers have been launched!
echo - Frontend: http://localhost:3000
echo - Backend API Docs: http://localhost:8000/docs
echo ===================================================
pause
