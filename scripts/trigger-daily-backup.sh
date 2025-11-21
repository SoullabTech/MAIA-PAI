#!/bin/bash

# Manual trigger for daily backup
echo "🌸 Triggering MAIA daily backup manually..."
launchctl start com.soullab.maia.daily-backup
echo "✅ Backup job triggered. Check /tmp/maia-daily-backup.log for output"
