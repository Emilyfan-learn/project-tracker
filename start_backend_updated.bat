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
    echo Installing dependencies from requirements-minimal-updated.txt...
    echo.
    echo NOTE: If SSL errors occur, the script will try alternative installation methods.
    echo.

    REM Try normal installation first
    pip install -r requirements-minimal-updated.txt

    REM If failed, try with trusted hosts
    if errorlevel 1 (
        echo.
        echo Normal installation failed. Trying with --trusted-host...
        echo.
        pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements-minimal-updated.txt
    )

    REM If still failed, try with Tsinghua mirror
    if errorlevel 1 (
        echo.
        echo Still failed. Trying with Tsinghua University mirror...
        echo.
        pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements-minimal-updated.txt
    )

    echo.
)

REM Check if installation was successful
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Failed to install dependencies
    echo ========================================
    echo.
    echo Please see INSTALL_TROUBLESHOOTING.md for detailed solutions.
    echo.
    echo Common issues:
    echo 1. SSL certificate error - Use --trusted-host flag
    echo 2. Python version too new - Use Python 3.12 instead of 3.14
    echo 3. Company proxy - Set HTTP_PROXY and HTTPS_PROXY environment variables
    echo.
    pause
    exit /b 1
)

REM Initialize database
echo Initializing database...
python backend/init_db.py
echo.

REM Start backend server
echo Starting backend server...
echo Backend will run at: http://localhost:8000
echo API documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
