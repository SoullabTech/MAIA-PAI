#!/bin/bash

# MAIA Component Recovery Tool
# Find and restore any version of your sacred components

set -e

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 MAIA Component Recovery Tool${NC}"
echo "==============================="

COMPONENT_NAME="$1"
TARGET_DATE="$2"

if [ -z "$COMPONENT_NAME" ]; then
    echo -e "${YELLOW}Usage: $0 <component-name> [date]${NC}"
    echo ""
    echo "Examples:"
    echo "  $0 SageTealWelcome"
    echo "  $0 Welcome 2025-11-20"
    echo "  $0 Holoflower yesterday"
    echo ""
    exit 1
fi

# Function to search snapshots
search_snapshots() {
    echo -e "${BLUE}📸 Searching snapshots for: $COMPONENT_NAME${NC}"

    if [ -n "$TARGET_DATE" ] && [ "$TARGET_DATE" != "yesterday" ]; then
        find snapshots/ -name "*$COMPONENT_NAME*" -path "*$TARGET_DATE*" 2>/dev/null
    else
        find snapshots/ -name "*$COMPONENT_NAME*" 2>/dev/null | head -10
    fi
}

# Function to search git history
search_git_history() {
    echo -e "${BLUE}🌿 Searching git history for: $COMPONENT_NAME${NC}"

    git log --oneline --grep="$COMPONENT_NAME" --all | head -5
    git log --oneline --name-only --grep=".*$COMPONENT_NAME.*" --all | head -10
}

# Function to search backups
search_backups() {
    echo -e "${BLUE}📦 Searching backups for: $COMPONENT_NAME${NC}"

    find backups/ -name "*$COMPONENT_NAME*" 2>/dev/null | head -5
}

# Function to show recovery options
show_recovery_options() {
    local file_path="$1"
    local file_name=$(basename "$file_path")

    echo -e "${GREEN}✅ Found: $file_path${NC}"
    echo ""
    echo "Recovery options:"
    echo -e "${BLUE}1.${NC} View contents: cat '$file_path'"
    echo -e "${BLUE}2.${NC} Copy to working dir: cp '$file_path' apps/web/components/onboarding/"
    echo -e "${BLUE}3.${NC} Compare with current: diff apps/web/components/onboarding/$file_name '$file_path'"
    echo ""
}

# Main search
echo ""
snapshots=$(search_snapshots)
echo ""

if [ -n "$snapshots" ]; then
    echo -e "${GREEN}📸 Found in snapshots:${NC}"
    echo "$snapshots" | while read -r file; do
        if [ -n "$file" ]; then
            show_recovery_options "$file"
        fi
    done
else
    echo -e "${YELLOW}No snapshots found${NC}"
fi

echo ""
search_git_history
echo ""

backups=$(search_backups)
if [ -n "$backups" ]; then
    echo -e "${GREEN}📦 Found in backups:${NC}"
    echo "$backups"
else
    echo -e "${YELLOW}No backups found${NC}"
fi

echo ""
echo -e "${BLUE}💡 Additional recovery commands:${NC}"
echo "- Git stashes: git stash list | grep $COMPONENT_NAME"
echo "- Git tags: git tag | grep backup"
echo "- Cloud recovery: git fetch origin && git checkout backup-YYYYMMDD-HHMMSS"
echo ""