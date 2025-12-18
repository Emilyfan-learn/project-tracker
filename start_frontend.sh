#!/bin/bash

echo "========================================"
echo "  Project Tracker - Frontend Server"
echo "========================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo ""
fi

# Start frontend development server
echo "Starting frontend server..."
echo "Frontend will run at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
npm run dev
