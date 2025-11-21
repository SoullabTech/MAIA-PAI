#!/bin/bash

# MAIA File Watcher - Automatic Component Preservation
# Monitors component files and creates snapshots when they change

set -e

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}👁️ MAIA File Watcher - Sacred Component Monitor${NC}"
echo "=============================================="
echo ""

# Configuration
WATCH_DIRS=(
    "apps/web/components"
    "shared-components"
    "apps/web/app"
)

BACKUP_INTERVAL=300  # 5 minutes minimum between backups
LAST_BACKUP_FILE="/tmp/maia-last-backup"

# Function to create a timestamped snapshot
create_snapshot() {
    local changed_file="$1"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_dir="snapshots/$(date +%Y-%m-%d)"

    mkdir -p "$backup_dir"

    # Copy the changed file to snapshot
    local rel_path=$(echo "$changed_file" | sed "s|^./||")
    local snapshot_path="$backup_dir/${timestamp}_$(basename "$changed_file")"

    cp "$changed_file" "$snapshot_path"

    echo -e "${GREEN}📸 Snapshot created: $snapshot_path${NC}"

    # Update component registry if it's a component
    if [[ "$changed_file" =~ \.(tsx|ts|jsx|js)$ ]]; then
        echo "$timestamp: $(basename "$changed_file") modified" >> "$backup_dir/changes.log"
    fi
}

# Function to check if we should backup (rate limiting)
should_backup() {
    if [ ! -f "$LAST_BACKUP_FILE" ]; then
        return 0
    fi

    local last_backup=$(cat "$LAST_BACKUP_FILE" 2>/dev/null || echo "0")
    local current_time=$(date +%s)
    local time_diff=$((current_time - last_backup))

    if [ $time_diff -gt $BACKUP_INTERVAL ]; then
        return 0
    else
        return 1
    fi
}

# Function to run backup
run_backup() {
    if should_backup; then
        echo -e "${BLUE}☁️ Running cloud backup...${NC}"
        ./scripts/auto-backup.sh > /tmp/maia-watcher-backup.log 2>&1 &
        echo $(date +%s) > "$LAST_BACKUP_FILE"
        echo -e "${GREEN}✅ Backup triggered${NC}"
    else
        echo -e "${YELLOW}⏭️ Skipping backup (too recent)${NC}"
    fi
}

# Function to handle file change
handle_change() {
    local file="$1"
    local action="$2"

    echo -e "${BLUE}📝 Detected: $action on $(basename "$file")${NC}"

    # Create snapshot for important files
    if [[ "$file" =~ \.(tsx|ts|jsx|js|json)$ ]]; then
        create_snapshot "$file"

        # Check if it's a critical component
        if [[ "$file" =~ (Welcome|Onboarding|Sacred|Holoflower) ]]; then
            echo -e "${PURPLE}✨ Sacred component modified: $(basename "$file")${NC}"
            run_backup
        fi
    fi
}

# Start watching
echo -e "${BLUE}🔍 Starting file watcher...${NC}"
echo -e "${BLUE}📁 Monitoring directories:${NC}"
for dir in "${WATCH_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "  - $dir"
    fi
done
echo ""

# Check if fswatch is available
if ! command -v fswatch >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️ fswatch not found. Installing via Homebrew...${NC}"
    if command -v brew >/dev/null 2>&1; then
        brew install fswatch
    else
        echo -e "${YELLOW}Please install fswatch: brew install fswatch${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}👁️ File watcher is now monitoring your sacred components...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Start watching with fswatch
fswatch -r "${WATCH_DIRS[@]}" | while read file; do
    # Skip temporary files and node_modules
    if [[ "$file" =~ (node_modules|\.git|\.next|\.tmp|~$|\#) ]]; then
        continue
    fi

    # Skip if file doesn't exist (deleted)
    if [ ! -f "$file" ]; then
        continue
    fi

    handle_change "$file" "modified"
done