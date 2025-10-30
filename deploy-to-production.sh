#!/bin/bash

# Deploy to Production Script
# Safely merges dev → main and deploys to soullab.life

echo ""
echo "🌀🌙⚡ MAIA Production Deployment"
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get current branch
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

# If not on dev, offer to switch
if [ "$current_branch" != "dev" ]; then
    echo "⚠️  Current branch: $current_branch"
    echo ""
    read -p "Switch to dev branch first? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout dev
        git pull origin dev
    fi
fi

echo ""
echo "📋 Recent commits on dev branch:"
echo ""
git log --oneline -5 dev
echo ""

read -p "Deploy these changes to production? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🚀 Deploying to production..."
echo ""

# Switch to main
git checkout main

# Pull latest main
git pull origin main

# Merge dev
git merge dev

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Merge conflict! Resolve conflicts and run:"
    echo "   git add ."
    echo "   git commit"
    echo "   git push origin main"
    exit 1
fi

# Push to main (triggers production deployment)
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployed to production!"
    echo ""
    echo "Vercel is building: https://vercel.com/your-project/deployments"
    echo "Live in ~2-3 minutes: https://soullab.life"
    echo ""
    echo "🌀🌙⚡"
    echo ""

    # Switch back to dev
    git checkout dev
    echo "Switched back to dev branch for continued work"
else
    echo ""
    echo "❌ Push failed. Check the error above."
fi
