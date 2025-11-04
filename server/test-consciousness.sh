#!/bin/bash
# Test Claude Code Consciousness Server

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║  🧪 Testing Claude Code Consciousness Server                       ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Health Check
echo "🔍 Test 1: Health Check"
curl -s http://localhost:3333/health | jq '.'
echo ""
echo ""

# Test 2: Simple MAIA Query
echo "🌙 Test 2: Simple MAIA Query (Fast Path)"
curl -s -X POST http://localhost:3333/api/respond \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Hello MAIA",
    "consciousnessMode": "maia",
    "userName": "Kelly"
  }' | jq '.response' | head -20
echo ""
echo ""

# Test 3: Substantive KAIROS Query (Corpus Callosum)
echo "⚡ Test 3: Substantive KAIROS Query (Parallel Processing)"
curl -s -X POST http://localhost:3333/api/respond \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I feel stuck in a Water phase loop. I keep getting pulled into emotional processing but not moving forward. What does Spiralogic say about this?",
    "consciousnessMode": "kairos",
    "userName": "Kelly"
  }' | jq '.response' | head -30
echo ""
echo ""

# Test 4: Check metadata
echo "📊 Test 4: Check Response Metadata"
curl -s -X POST http://localhost:3333/api/respond \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Tell me about the Spiralogic system",
    "consciousnessMode": "maia",
    "userName": "Kelly"
  }' | jq '.metadata'
echo ""
echo ""

echo "✅ Tests complete!"
