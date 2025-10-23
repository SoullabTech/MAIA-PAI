#!/bin/zsh
# 🜂 Claude Sanctuary — Full Activation Script
# Launches Claude Code terminal + Browser Mirror UI + Bridge simultaneously

PROJECT_PATH="$HOME/SoullabTech/MAIA-PAI"
SANCTUARY_URL="http://localhost:3000/claude-sanctuary"

echo "🌌 Activating Claude Sanctuary..."
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

# Step 4: Launch Claude Code in the current directory
echo "🜃 [4/4] Launching Claude Code Terminal..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✨ Claude Sanctuary is now ACTIVE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Terminal:  Claude Code (current directory)"
echo "  Browser:   $SANCTUARY_URL"
echo "  Bridge:    ws://localhost:5051"
echo ""
echo "  Your conversation will mirror in real-time 🜂"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Launch Claude Code in the current terminal
# (This will take over the current terminal session)
claude
