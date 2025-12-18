#!/bin/bash

echo "========================================"
echo "  Project Tracker - Backend Server"
echo "========================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo ""
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "Installing dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    echo ""
fi

# Initialize database
echo "Initializing database..."
python backend/init_db.py
echo ""

# Start backend server
echo "Starting backend server..."
echo "Backend will run at: http://localhost:8000"
echo "API documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
