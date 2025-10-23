#!/bin/zsh
# 🜂 Claude Sanctuary — New Window Version
# Launches everything in separate windows so you keep your current terminal

PROJECT_PATH="$HOME/SoullabTech/MAIA-PAI"
SANCTUARY_URL="http://localhost:3000/claude-sanctuary"

echo "🌌 Activating Claude Sanctuary (new window mode)..."
echo ""

# Step 1: Check/Start the Claude Mirror Bridge (WebSocket)
echo "🜂 [1/4] Starting Claude Mirror Bridge..."
cd "$PROJECT_PATH"
if ! lsof -i :5051 > /dev/null; then
  npm run mirror > /tmp/maia-mirror.log 2>&1 &
  sleep 2
  echo "      ✓ Bridge active on ws://localhost:5051"
else
  echo "      ✓ Bridge already running"
fi

# Step 2: Check/Start the Next.js dev server
echo "🌀 [2/4] Starting MAIA Sanctuary UI..."
if ! lsof -i :3000 > /dev/null; then
  npm run dev > /tmp/maia-dev.log 2>&1 &
  sleep 4
  echo "      ✓ Sanctuary live at http://localhost:3000"
else
  echo "      ✓ Sanctuary already running"
fi

# Step 3: Open the browser to Claude Sanctuary
echo "🪞 [3/4] Opening Mirror Interface..."
open "$SANCTUARY_URL"
sleep 1

# Step 4: Open Claude Code in a NEW Terminal window
echo "🜃 [4/4] Opening Claude Code in new terminal..."
osascript <<EOF
tell application "Terminal"
    activate
    do script "cd $(pwd) && echo '🜂 Claude Code — Sanctuary Session' && echo '' && claude"
end tell
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✨ Claude Sanctuary is now ACTIVE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Terminal:  New window (Claude Code)"
echo "  Browser:   $SANCTUARY_URL"
echo "  Bridge:    ws://localhost:5051"
echo ""
echo "  Your conversation will mirror in real-time 🜂"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
