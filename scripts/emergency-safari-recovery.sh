#!/bin/bash

# 🆘 EMERGENCY SAFARI BUTTON RECOVERY SCRIPT
# Use this if MAIA buttons stop working again

echo "🚨 EMERGENCY SAFARI BUTTON RECOVERY"
echo "====================================="

# Get current date for backup
BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
echo "📅 Backup date: $BACKUP_DATE"

# Create emergency backup directory
mkdir -p docs/emergency-backups/$BACKUP_DATE
echo "📁 Created backup directory"

# Backup current broken files
echo "💾 Backing up current files..."
cp app/globals.css docs/emergency-backups/$BACKUP_DATE/globals-broken.css 2>/dev/null || echo "⚠️  globals.css not found"
cp app/maia/page.tsx docs/emergency-backups/$BACKUP_DATE/maia-page-broken.tsx 2>/dev/null || echo "⚠️  maia/page.tsx not found"

# Get the latest working backup
LATEST_BACKUP=$(ls -1 docs/backups/ | grep working-build | tail -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No working backup found!"
    echo "🔍 Looking for git commit to restore..."

    # Try to find the working commit
    WORKING_COMMIT=$(git log --oneline --grep="CRITICAL: Safari button fixes" -n 1 | cut -d' ' -f1)

    if [ -n "$WORKING_COMMIT" ]; then
        echo "✅ Found working commit: $WORKING_COMMIT"
        echo "🔄 Restoring files from git..."

        git checkout $WORKING_COMMIT -- app/globals.css app/maia/page.tsx

        if [ $? -eq 0 ]; then
            echo "✅ Files restored from git successfully!"
        else
            echo "❌ Failed to restore from git"
            exit 1
        fi
    else
        echo "❌ No working commit found either!"
        echo "📖 Please manually apply fixes from docs/CRITICAL-SAFARI-FIXES-VAULT.md"
        exit 1
    fi
else
    echo "✅ Found latest backup: $LATEST_BACKUP"
    echo "🔄 Restoring working files..."

    # Restore from backup
    cp "docs/backups/$LATEST_BACKUP/globals.css.backup" app/globals.css
    cp "docs/backups/$LATEST_BACKUP/maia-page.tsx.backup" app/maia/page.tsx

    if [ $? -eq 0 ]; then
        echo "✅ Files restored from backup successfully!"
    else
        echo "❌ Failed to restore from backup"
        exit 1
    fi
fi

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# Restart development server (if running)
echo "🔄 Checking for running dev server..."
DEV_PID=$(pgrep -f "next dev")

if [ -n "$DEV_PID" ]; then
    echo "🛑 Stopping existing dev server (PID: $DEV_PID)..."
    kill $DEV_PID
    sleep 2
fi

echo "🚀 Starting fresh development server..."
npm run dev &

echo ""
echo "✅ RECOVERY COMPLETE!"
echo "===================="
echo "📝 What was done:"
echo "   • Backed up broken files to docs/emergency-backups/$BACKUP_DATE"
echo "   • Restored working Safari fixes"
echo "   • Cleared Next.js cache"
echo "   • Restarted development server"
echo ""
echo "🌐 Test at: http://localhost:3000/maia"
echo "📖 Full documentation: docs/CRITICAL-SAFARI-FIXES-VAULT.md"
echo ""
echo "🔍 If buttons still don't work:"
echo "   1. Check browser console for errors"
echo "   2. Try hard refresh (Cmd+Shift+R)"
echo "   3. Test in Safari, Chrome, and Firefox"
echo "   4. Refer to vault documentation for manual fixes"