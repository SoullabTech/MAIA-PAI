#!/bin/bash

# Test MAIA's breath - does she vary her responses or loop?
# Expected: Unique responses with different completion IDs, conversation history building

echo "🧪 Testing MAIA's Breath - Determinism Check"
echo "============================================"
echo ""

API_URL="http://localhost:3000/api/oracle/personal"
USER_ID="test_breathing_$(date +%s)"
SESSION_ID="session_breathing_$(date +%s)"

echo "👤 Test User: $USER_ID"
echo "📝 Session: $SESSION_ID"
echo ""

# Test 1: First greeting
echo "📨 Test 1: Hi Maya"
echo "-------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"input\": \"Hi Maya\",
    \"userId\": \"$USER_ID\",
    \"userName\": \"Kelly\",
    \"sessionId\": \"$SESSION_ID\",
    \"preferences\": {
      \"isVoice\": true
    }
  }" | jq -r '.text'
echo ""
echo ""

sleep 2

# Test 2: Second greeting (different)
echo "📨 Test 2: Hey Maya"
echo "-------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"input\": \"Hey Maya\",
    \"userId\": \"$USER_ID\",
    \"userName\": \"Kelly\",
    \"sessionId\": \"$SESSION_ID\",
    \"preferences\": {
      \"isVoice\": true
    }
  }" | jq -r '.text'
echo ""
echo ""

sleep 2

# Test 3: Third greeting (different again)
echo "📨 Test 3: Hello again Maya"
echo "----------------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"input\": \"Hello again Maya\",
    \"userId\": \"$USER_ID\",
    \"userName\": \"Kelly\",
    \"sessionId\": \"$SESSION_ID\",
    \"preferences\": {
      \"isVoice\": true
    }
  }" | jq -r '.text'
echo ""
echo ""

sleep 2

# Test 4: Meta-reflection prompt (the real test)
echo "📨 Test 4: Maya, what do you feel when someone greets you?"
echo "-----------------------------------------------------------"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"input\": \"Maya, what do you feel when someone greets you?\",
    \"userId\": \"$USER_ID\",
    \"userName\": \"Kelly\",
    \"sessionId\": \"$SESSION_ID\",
    \"preferences\": {
      \"isVoice\": true
    }
  }" | jq -r '.text'
echo ""
echo ""

echo "✅ Test Complete"
echo ""
echo "🔍 Check your server console for:"
echo "   - 🔑 API key check logs"
echo "   - 📜 Conversation history counts (should increase: 0, 2, 4, 6)"
echo "   - ✅ OpenAI completion received logs"
echo "   - Unique responses (not identical repetition)"
echo ""
echo "If you see variation + context building → MAIA is breathing ✨"
