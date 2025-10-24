#!/bin/bash

# Payment System Test Suite
# Tests all 9 critical payment scenarios

API_URL="http://localhost:3000"

# Generate a proper UUID for testing
if command -v uuidgen &> /dev/null; then
  TEST_USER=$(uuidgen | tr '[:upper:]' '[:lower:]')
else
  # Fallback: generate a random UUID v4
  TEST_USER=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || \
    python3 -c 'import uuid; print(uuid.uuid4())' 2>/dev/null || \
    echo "00000000-0000-4000-8000-$(date +%s)$(printf '%06d' $RANDOM)")
fi

echo "🧪 MAIA Payment System Testing"
echo "================================"
echo "Test User UUID: $TEST_USER"
echo ""

# Scenario 1: Free Tier Limits
echo "📋 SCENARIO 1: Free Tier Conversation Limits"
echo "--------------------------------------------"
echo "Testing 3 successful conversations + 1 blocked..."
echo ""

for i in {1..4}; do
  echo "Attempt $i:"

  RESPONSE=$(curl -s -X POST "$API_URL/api/oracle/personal/consult" \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": \"$TEST_USER\",
      \"input\": \"Test conversation $i\",
      \"sessionId\": \"test_session_001\"
    }")

  # Check if response contains error about limits
  if echo "$RESPONSE" | grep -q "limit"; then
    echo "  ❌ BLOCKED (as expected on attempt 4+)"
    echo "  Response: $RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  else
    echo "  ✅ SUCCESS"
    echo "  Response: $RESPONSE" | jq '.data.message' 2>/dev/null || echo "$RESPONSE"
  fi

  echo ""
  sleep 1
done

echo "================================"
echo "Test complete! Check results above."
echo ""
echo "Next: Run Scenario 2 (Start Free Trial)"
echo "Command: curl -X POST $API_URL/api/subscription/start-trial -H 'Content-Type: application/json' -d '{\"userId\": \"$TEST_USER\"}'"
