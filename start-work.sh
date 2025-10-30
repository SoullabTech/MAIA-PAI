#!/bin/bash

# Start Work Script
# Automatically sets you up on dev branch

echo ""
echo "🌀🌙⚡ Starting MAIA Development"
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get current branch
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

# If on main, switch to dev
if [ "$current_branch" = "main" ]; then
    echo "⚠️  You're on main branch (production)"
    echo "   Switching to dev branch..."
    echo ""
    git checkout dev
fi

# Pull latest changes
echo "📥 Pulling latest changes from dev..."
git pull origin dev

echo ""
echo "✅ Ready to work on dev branch"
echo ""
echo "Workflow:"
echo "  1. Make changes"
echo "  2. Test: npm run dev"
echo "  3. Commit: git add . && git commit -m 'description'"
echo "  4. Push: git push"
echo "  5. Deploy when ready: ./deploy-to-production.sh"
echo ""
echo "Current branch: dev ✅"
echo ""
