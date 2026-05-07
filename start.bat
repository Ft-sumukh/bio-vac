@echo off
echo Starting Vaccine Early-Warning Portal...

start cmd /k "cd frontend && npm run dev"
start cmd /k "uvicorn vewp.main:app --reload --port 8000"

echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000
echo Documentation: http://localhost:8000/docs
