#!/bin/bash
cd "/Volumes/T7 Shield/Projects/SpiralogicOracleSystem"
rm -f .git/index.lock
git add lib/types/conversation-style.ts components/ui/MenuBar.tsx
git commit -m "Fix MAIA two-word responses and add conversation style toggle"
git push
