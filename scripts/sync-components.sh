#!/bin/bash

# MAIA Component Synchronization Script
# Preserves beautiful components across all MAIA projects

set -e

# Color output for clarity
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌸 MAIA Component Sync - Sacred Preservation System${NC}"
echo "======================================================"

# Define all MAIA project paths
MAIA_PROJECTS=(
    "/Users/soullab/MAIA-PAI"
    "/Users/soullab/MAIA-SOVEREIGN"
    "/Users/soullab/MAIA-PAI-SOVEREIGN"
    "/Users/soullab/maia-sovereign-production"
)

# Define source project (current working directory)
SOURCE_PROJECT="/Users/soullab/MAIA-PAI"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${YELLOW}Source Project:${NC} $SOURCE_PROJECT"
echo -e "${YELLOW}Timestamp:${NC} $TIMESTAMP"
echo ""

# Function to backup components before sync
backup_components() {
    local project_path="$1"
    local backup_dir="$project_path/backups/components_$TIMESTAMP"

    if [ -d "$project_path/apps/web/components/onboarding" ]; then
        echo -e "${BLUE}📦 Backing up components in:${NC} $(basename $project_path)"
        mkdir -p "$backup_dir"
        cp -r "$project_path/apps/web/components/onboarding" "$backup_dir/"
        echo -e "${GREEN}✅ Backup created:${NC} $backup_dir"
    fi
}

# Function to sync components
sync_components() {
    local target_project="$1"

    if [ "$target_project" == "$SOURCE_PROJECT" ]; then
        echo -e "${YELLOW}⏭️  Skipping source project:${NC} $(basename $target_project)"
        return
    fi

    if [ ! -d "$target_project" ]; then
        echo -e "${RED}❌ Project not found:${NC} $target_project"
        return
    fi

    echo -e "${BLUE}🔄 Syncing to:${NC} $(basename $target_project)"

    # Create target directories if they don't exist
    mkdir -p "$target_project/apps/web/components"
    mkdir -p "$target_project/apps/web/app"

    # Backup existing components in target
    backup_components "$target_project"

    # Sync onboarding components
    if [ -d "$SOURCE_PROJECT/apps/web/components/onboarding" ]; then
        cp -r "$SOURCE_PROJECT/apps/web/components/onboarding" "$target_project/apps/web/components/"
        echo -e "${GREEN}✅ Synced onboarding components${NC}"
    fi

    # Sync welcome pages
    if [ -d "$SOURCE_PROJECT/apps/web/app/test-welcome" ]; then
        cp -r "$SOURCE_PROJECT/apps/web/app/test-welcome" "$target_project/apps/web/app/"
        echo -e "${GREEN}✅ Synced test-welcome page${NC}"
    fi

    if [ -d "$SOURCE_PROJECT/apps/web/app/welcome-flow" ]; then
        cp -r "$SOURCE_PROJECT/apps/web/app/welcome-flow" "$target_project/apps/web/app/"
        echo -e "${GREEN}✅ Synced welcome-flow page${NC}"
    fi
}

# Function to commit changes in target projects
commit_changes() {
    local project_path="$1"

    if [ "$project_path" == "$SOURCE_PROJECT" ]; then
        return
    fi

    if [ ! -d "$project_path" ]; then
        return
    fi

    echo -e "${BLUE}📝 Committing changes in:${NC} $(basename $project_path)"

    cd "$project_path"

    # Check if it's a git repository
    if [ -d ".git" ]; then
        git add apps/web/components/onboarding apps/web/app/test-welcome apps/web/app/welcome-flow 2>/dev/null || true

        if git diff --staged --quiet; then
            echo -e "${YELLOW}⏭️  No changes to commit${NC}"
        else
            git commit -m "Sync beautiful welcome components from MAIA-PAI

Synced at: $TIMESTAMP
- SageTealWelcome: Working amber-tinted glass interface
- All welcome flow components and pages
- Sacred component preservation

🤖 Auto-synced via component sync system" || echo -e "${RED}❌ Commit failed${NC}"
            echo -e "${GREEN}✅ Changes committed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Not a git repository, initializing...${NC}"
        git init
        git add .
        git commit -m "Initial commit with synced MAIA components

Synced at: $TIMESTAMP

🤖 Auto-synced via component sync system" || echo -e "${RED}❌ Initial commit failed${NC}"
    fi
}

# Main sync process
echo -e "${BLUE}🚀 Starting component synchronization...${NC}"
echo ""

# Backup source components first
backup_components "$SOURCE_PROJECT"

# Sync to all target projects
for project in "${MAIA_PROJECTS[@]}"; do
    echo ""
    sync_components "$project"
done

echo ""
echo -e "${BLUE}📝 Committing changes to all projects...${NC}"
echo ""

# Commit changes in all projects
for project in "${MAIA_PROJECTS[@]}"; do
    commit_changes "$project"
    echo ""
done

echo -e "${GREEN}🌸 Component synchronization complete!${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "- Source: $(basename $SOURCE_PROJECT)"
echo "- Synced to: $(echo "${MAIA_PROJECTS[@]}" | tr ' ' '\n' | grep -v "$SOURCE_PROJECT" | xargs -I {} basename {} | tr '\n' ' ')"
echo "- Timestamp: $TIMESTAMP"
echo "- Backups created in each project's backups/ directory"
echo ""
echo -e "${BLUE}Your beautiful components are now preserved across all MAIA projects! 🎨✨${NC}"