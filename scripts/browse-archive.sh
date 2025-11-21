#!/bin/bash

# MAIA Archive Browser
# Browse all preserved versions of your components

set -e

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}📚 MAIA Sacred Archive Browser${NC}"
echo "=============================="
echo ""

# Function to show snapshots by date
show_snapshots() {
    echo -e "${BLUE}📸 Recent Snapshots:${NC}"

    for date_dir in $(ls -1 snapshots/ 2>/dev/null | tail -7); do
        if [ -d "snapshots/$date_dir" ]; then
            count=$(find "snapshots/$date_dir" -name "*.tsx" -o -name "*.ts" | wc -l)
            echo -e "${GREEN}$date_dir${NC}: $count files"

            # Show recent files from this date
            find "snapshots/$date_dir" -name "*.tsx" -o -name "*.ts" | head -3 | while read -r file; do
                echo "  $(basename "$file")"
            done
        fi
    done
    echo ""
}

# Function to show git backup tags
show_backup_tags() {
    echo -e "${BLUE}☁️ Cloud Backup Tags:${NC}"

    git tag | grep backup | tail -5 | while read -r tag; do
        date_info=$(git log -1 --format="%ci" "$tag" 2>/dev/null | cut -d' ' -f1)
        echo -e "${GREEN}$tag${NC} ($date_info)"
    done
    echo ""
}

# Function to show backups
show_backups() {
    echo -e "${BLUE}📦 Component Backups:${NC}"

    if [ -d "backups" ]; then
        ls -1 backups/ | tail -5 | while read -r backup; do
            if [ -d "backups/$backup" ]; then
                echo -e "${GREEN}$backup${NC}"
            fi
        done
    else
        echo -e "${YELLOW}No backups directory found${NC}"
    fi
    echo ""
}

# Function to show recent stashes
show_stashes() {
    echo -e "${BLUE}🔄 Recent Git Stashes:${NC}"

    git stash list | head -5 | while read -r stash; do
        echo -e "${GREEN}$stash${NC}"
    done
    echo ""
}

# Function to show sacred components status
show_sacred_components() {
    echo -e "${PURPLE}✨ Sacred Components Status:${NC}"

    if [ -f "shared-components/component-registry.json" ]; then
        # Parse JSON to show component status (simplified)
        grep -A 3 -B 1 '"status"' shared-components/component-registry.json | \
        grep -E '(": {|"status"|"path")' | \
        sed 's/.*"\([^"]*\)": {/\n\1:/' | \
        sed 's/.*"status": "\([^"]*\)".*/  Status: \1/' | \
        sed 's/.*"path": "\([^"]*\)".*/  Path: \1/' | \
        head -20
    fi
    echo ""
}

# Interactive menu
show_menu() {
    echo -e "${BLUE}🔍 Browse Options:${NC}"
    echo "1. Search for specific component: ./scripts/recover-component.sh [name]"
    echo "2. View snapshot directory: ls snapshots/YYYY-MM-DD/"
    echo "3. Restore from git tag: git checkout backup-YYYYMMDD-HHMMSS"
    echo "4. View git history: git log --oneline | head -20"
    echo "5. Browse backup: ls backups/components_TIMESTAMP/"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./scripts/recover-component.sh SageTealWelcome"
    echo "  ./scripts/recover-component.sh Welcome 2025-11-20"
    echo "  cp snapshots/2025-11-20/ide-saves/20251120_143022_SageTealWelcome.tsx apps/web/components/onboarding/"
    echo ""
}

# Main display
show_sacred_components
show_snapshots
show_backup_tags
show_backups
show_stashes
show_menu

echo -e "${PURPLE}Your sacred work is preserved across multiple layers! 🌸${NC}"