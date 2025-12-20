@echo off
echo ========================================
echo   Project Tracker - Frontend Server
echo ========================================
echo.

REM Navigate to frontend directory
cd frontend

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

REM Start frontend development server
echo Starting frontend server...
echo Frontend will run at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
call npm run dev
