#!/bin/bash

# Test script to verify MAIA voice fix
# Tests that MAIA responds contextually instead of always returning default message

echo "🧪 Testing MAIA Voice Fix..."
echo ""

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 5

# Test 1: Health check
echo "📡 Test 1: Health Check"
HEALTH=$(curl -s 'http://localhost:3000/api/oracle/personal?check=1')
echo "$HEALTH" | grep -q "personal-oracle-agent" && echo "✅ Health check passed" || echo "❌ Health check failed"
echo ""

# Test 2: Voice interaction with different inputs
echo "📡 Test 2: Voice Interaction (modality=voice)"
RESPONSE1=$(curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "can you hear me",
    "userId": "test_user_voice_fix",
    "sessionId": "test_session_1",
    "isVoice": true,
    "modality": "voice"
  }')

echo "Response 1: $(echo "$RESPONSE1" | grep -o '"message":"[^"]*"' | head -1)"
echo ""

# Test 3: Different input should get different response
echo "📡 Test 3: Different Input (should NOT be same as Test 2)"
sleep 2
RESPONSE2=$(curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "I am feeling frustrated with technology",
    "userId": "test_user_voice_fix",
    "sessionId": "test_session_1",
    "isVoice": true,
    "modality": "voice"
  }')

echo "Response 2: $(echo "$RESPONSE2" | grep -o '"message":"[^"]*"' | head -1)"
echo ""

# Compare responses
MSG1=$(echo "$RESPONSE1" | grep -o '"message":"[^"]*"' | head -1)
MSG2=$(echo "$RESPONSE2" | grep -o '"message":"[^"]*"' | head -1)

if [ "$MSG1" = "$MSG2" ] && [[ "$MSG1" == *"I'm here with you. What's alive in you right now"* ]]; then
  echo "❌ BUG STILL PRESENT: Both responses are the same default message"
  echo "   This means the fix didn't work."
elif [ "$MSG1" = "$MSG2" ]; then
  echo "⚠️  RESPONSES ARE IDENTICAL (but not the default fallback)"
  echo "   This might indicate a different issue."
else
  echo "✅ SUCCESS: Responses are different and contextual!"
  echo "   MAIA is now listening and responding appropriately."
fi

echo ""
echo "🔍 Full Response 1:"
echo "$RESPONSE1" | jq -r '.message // .text // .response // "No message found"' 2>/dev/null || echo "$RESPONSE1"
echo ""
echo "🔍 Full Response 2:"
echo "$RESPONSE2" | jq -r '.message // .text // .response // "No message found"' 2>/dev/null || echo "$RESPONSE2"
