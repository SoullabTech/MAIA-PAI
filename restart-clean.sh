#!/bin/bash

# Clean restart script for MAIA-FRESH

echo "🧹 Killing all node processes..."
killall -9 node 2>/dev/null

echo "⏳ Waiting for ports to clear..."
sleep 3

echo "🚀 Starting fresh server on port 3003..."
cd /Users/soullab/MAIA-FRESH
PORT=3003 npm run dev
