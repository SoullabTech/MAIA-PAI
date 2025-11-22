#!/bin/bash
# SAFARI PROTECTION SYSTEM
# Prevents accidental removal of Safari button fixes

set -e

echo "🛡️ SAFARI PROTECTION SYSTEM - Checking critical files..."

# Define critical files and their required content
GLOBALS_CSS="app/globals.css"
MAIA_PAGE="app/maia/page.tsx"

# Check if globals.css contains Safari fixes
check_globals_css() {
    if [[ -f "$GLOBALS_CSS" ]]; then
        if ! grep -q "Safari-specific button interaction fixes" "$GLOBALS_CSS"; then
            echo "❌ CRITICAL: Safari CSS fixes missing from globals.css!"
            echo "🔧 Restoring from backup..."

            # Restore from backup
            if [[ -f "docs/backups/working-build-20251121/globals.css.backup" ]]; then
                cp "docs/backups/working-build-20251121/globals.css.backup" "$GLOBALS_CSS"
                echo "✅ Safari CSS fixes restored"
                return 0
            else
                echo "❌ Backup not found! Manual intervention required."
                return 1
            fi
        else
            echo "✅ Safari CSS fixes present in globals.css"
            return 0
        fi
    else
        echo "❌ globals.css not found!"
        return 1
    fi
}

# Check if MAIA page contains Safari button styles
check_maia_page() {
    if [[ -f "$MAIA_PAGE" ]]; then
        if ! grep -q "Safari-specific button fixes" "$MAIA_PAGE"; then
            echo "❌ CRITICAL: Safari button fixes missing from MAIA page!"
            echo "🔧 Restoring from backup..."

            # Restore from backup
            if [[ -f "docs/backups/working-build-20251121/maia-page.tsx.backup" ]]; then
                cp "docs/backups/working-build-20251121/maia-page.tsx.backup" "$MAIA_PAGE"
                echo "✅ Safari button fixes restored"
                return 0
            else
                echo "❌ Backup not found! Manual intervention required."
                return 1
            fi
        else
            echo "✅ Safari button fixes present in MAIA page"
            return 0
        fi
    else
        echo "❌ MAIA page not found!"
        return 1
    fi
}

# Run checks
ERRORS=0

check_globals_css || ERRORS=$((ERRORS + 1))
check_maia_page || ERRORS=$((ERRORS + 1))

if [[ $ERRORS -eq 0 ]]; then
    echo "🛡️ All Safari fixes are protected and present!"
    exit 0
else
    echo "❌ $ERRORS critical files missing Safari fixes!"
    echo "📖 See docs/CRITICAL-SAFARI-FIXES-VAULT.md for manual recovery"
    exit 1
fi