#!/bin/bash

# MAIA Sovereign Deployment Script
# Safely deploy changes to production

set -e  # Exit on any error

echo "🚀 Starting MAIA deployment..."

# Navigate to project directory
cd /Users/soullab/MAIA-PAI/apps/web

echo "📦 Building production bundle..."
npm run build

echo "✅ Build successful! Restarting PM2..."
pm2 restart maia-sovereign

echo "💾 Saving PM2 configuration..."
pm2 save

echo "🎉 Deployment complete!"
echo ""
pm2 status
