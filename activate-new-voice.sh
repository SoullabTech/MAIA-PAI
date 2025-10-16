#!/bin/bash

# MAIA Voice - Activation Script
# Turns on the new WebRTC parallel voice system

echo "🎤 Activating MAIA's new parallel voice system..."
echo ""

# Step 1: Update .env.local
echo "📝 Updating .env.local..."
if grep -q "NEXT_PUBLIC_USE_PARALLEL_VOICE=false" .env.local; then
    sed -i '' 's/NEXT_PUBLIC_USE_PARALLEL_VOICE=false/NEXT_PUBLIC_USE_PARALLEL_VOICE=true/g' .env.local
    echo "✅ Feature flag enabled"
else
    echo "⚠️  Flag already enabled or not found"
fi

echo ""

# Step 2: Kill old dev servers
echo "🔄 Killing old dev servers..."
killall -9 node 2>/dev/null
pkill -9 -f "npm run dev" 2>/dev/null
sleep 2
echo "✅ Old servers stopped"

echo ""

# Step 3: Start fresh dev server
echo "🚀 Starting dev server..."
echo ""
echo "Visit: http://localhost:3000/test-voice"
echo "Or open console on any page with voice and watch for [VOICE_BUS] logs"
echo ""
npm run dev
