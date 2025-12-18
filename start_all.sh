#!/bin/bash

echo "========================================"
echo "  Project Tracker - Starting All Services"
echo "========================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - use separate Terminal windows
    echo "Opening backend in new Terminal window..."
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./start_backend.sh\""

    echo "Waiting for backend to start..."
    sleep 3

    echo "Opening frontend in new Terminal window..."
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./start_frontend.sh\""

    echo ""
    echo "✓ Both services are starting in separate Terminal windows"
    echo ""
    echo "To access the application:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend API: http://localhost:8000/docs"
    echo ""
    echo "To stop services: Press Ctrl+C in each Terminal window"

else
    # Linux or other - use tmux or screen if available
    if command -v tmux &> /dev/null; then
        echo "Starting services in tmux session..."

        # Create new tmux session
        tmux new-session -d -s projecttracker

        # Split window
        tmux split-window -h -t projecttracker

        # Start backend in left pane
        tmux send-keys -t projecttracker:0.0 "cd '$SCRIPT_DIR' && ./start_backend.sh" C-m

        # Start frontend in right pane
        tmux send-keys -t projecttracker:0.1 "cd '$SCRIPT_DIR' && ./start_frontend.sh" C-m

        echo ""
        echo "✓ Services started in tmux session 'projecttracker'"
        echo ""
        echo "To access the application:"
        echo "  Frontend: http://localhost:5173"
        echo "  Backend API: http://localhost:8000/docs"
        echo ""
        echo "To attach to tmux session: tmux attach -t projecttracker"
        echo "To stop services: tmux kill-session -t projecttracker"

    else
        echo "Starting backend in background..."
        ./start_backend.sh > backend.log 2>&1 &
        BACKEND_PID=$!

        echo "Waiting for backend to start..."
        sleep 3

        echo "Starting frontend..."
        ./start_frontend.sh

        # When frontend stops, also stop backend
        kill $BACKEND_PID
    fi
fi
