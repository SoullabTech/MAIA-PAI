#!/bin/bash

###############################################################################
# MAIA ORGANISM VISUALIZATION VIEWER
# Starts local server and opens visualization in browser
# Works around browser security restrictions on local file access
###############################################################################

echo "🌀 Starting MAIA Organism Visualization Server..."
echo ""

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✓ Server already running on http://localhost:8000"
else
    echo "Starting local server on port 8000..."
    cd "$(dirname "$0")"
    python3 -m http.server 8000 > /dev/null 2>&1 &
    SERVER_PID=$!
    echo "✓ Server started (PID: $SERVER_PID)"
    sleep 1
fi

echo ""
echo "Opening visualization in browser..."
echo "URL: http://localhost:8000/visualizations/balance-wheel.html"
echo ""

# Try to open in default browser
if command -v open &> /dev/null; then
    # Mac
    open http://localhost:8000/visualizations/balance-wheel.html
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:8000/visualizations/balance-wheel.html
elif command -v start &> /dev/null; then
    # Windows (Git Bash)
    start http://localhost:8000/visualizations/balance-wheel.html
else
    echo "Please open this URL manually: http://localhost:8000/visualizations/balance-wheel.html"
fi

echo ""
echo "✓ Visualization opened"
echo ""
echo "To stop the server later, run:"
echo "  lsof -ti:8000 | xargs kill"
echo ""
echo "The organism breathes. 🌀"
