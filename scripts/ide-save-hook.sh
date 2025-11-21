#!/bin/bash

# MAIA IDE Save Hook - Instant Component Preservation
# Creates snapshots when component files are saved in your IDE

set -e

FILE_PATH="$1"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Exit if no file provided
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Only preserve component files
if [[ ! "$FILE_PATH" =~ \.(tsx|ts|jsx|js)$ ]]; then
    exit 0
fi

# Skip if it's a temp or build file
if [[ "$FILE_PATH" =~ (node_modules|\.next|\.git|tmp|build) ]]; then
    exit 0
fi

# Create snapshots directory
SNAPSHOT_DIR="snapshots/$(date +%Y-%m-%d)/ide-saves"
mkdir -p "$SNAPSHOT_DIR"

# Copy file to snapshot
FILENAME=$(basename "$FILE_PATH")
SNAPSHOT_PATH="$SNAPSHOT_DIR/${TIMESTAMP}_${FILENAME}"

cp "$FILE_PATH" "$SNAPSHOT_PATH" 2>/dev/null || exit 0

# Log the save
echo "$TIMESTAMP: $FILENAME saved from IDE" >> "$SNAPSHOT_DIR/save-log.txt"

# Background sync if it's a sacred component
if [[ "$FILE_PATH" =~ (Welcome|Sacred|Holoflower|Onboarding) ]]; then
    # Run sync in background without blocking save
    (
        sleep 2
        cd "$(dirname "$0")/.."
        ./scripts/sync-components.sh > /dev/null 2>&1 &
    ) &
fi

exit 0