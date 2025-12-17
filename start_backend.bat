@echo off
echo ========================================
echo   Project Tracker - Backend Server
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if dependencies are installed
echo Checking dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies from requirements-minimal.txt...
    pip install -r requirements-minimal.txt
    echo.
)

REM Initialize database
echo Initializing database...
python backend/init_db.py
echo.

REM Start backend server
echo Starting backend server...
echo Backend will run at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
