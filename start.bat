@echo off
echo Starting Vaccine Early-Warning Portal...

:: Start Research Dashboard (Vite)
start cmd /k "title VEWP Research Dashboard && cd frontend && npm run dev"

:: Start Intelligence Portal (Next.js)
start cmd /k "title VEWP Intelligence Portal && cd razorpay-hero && npm run dev"

:: Start Backend API (FastAPI)
start cmd /k "title VEWP Backend API && uvicorn vewp.main:app --reload --port 8000"

echo.
echo 🛡️  VEWP Launching...
echo ------------------------------------------
echo Intelligence Portal:  http://localhost:3000
echo Research Dashboard:  http://localhost:5173
echo Backend API:         http://localhost:8000
echo API Documentation:   http://localhost:8000/docs
echo ------------------------------------------
echo.
pause
