#!/bin/bash

echo "========================================"
echo "  Project Tracker - Stopping All Services"
echo "========================================"
echo ""

# Kill backend processes
echo "Stopping backend server..."
pkill -f "uvicorn backend.main:app"

# Kill frontend processes
echo "Stopping frontend server..."
pkill -f "vite"
pkill -f "npm run dev"

# Kill tmux session if exists
if command -v tmux &> /dev/null; then
    if tmux has-session -t projecttracker 2>/dev/null; then
        echo "Stopping tmux session..."
        tmux kill-session -t projecttracker
    fi
fi

echo ""
echo "✓ All services stopped"
echo ""
