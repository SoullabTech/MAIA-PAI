#!/bin/bash

# Quick preservation - run this every 30 minutes during collaborative work

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

cd /Users/soullab/MAIA-PAI

echo "🔐 Quick preserve: $TIMESTAMP"

# Stash all changes with timestamp
git add -A 2>/dev/null
git stash push -m "quick_preserve_$TIMESTAMP" --include-untracked 2>/dev/null || true

echo "✅ Work stashed as: quick_preserve_$TIMESTAMP"

# Show recent stashes
echo "📚 Recent stashes:"
git stash list | head -3 2>/dev/null || true