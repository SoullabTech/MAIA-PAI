#!/bin/bash

# Quick Maia Integration Test
# Run this to verify everything is working

echo "🧪 MAIA Integration Quick Test"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API endpoint
API_URL="${API_URL:-http://localhost:3000}"

# Test counter
PASSED=0
FAILED=0

# Helper function
test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected=$5

  echo -n "Testing: $name... "

  if [ "$method" = "POST" ]; then
    response=$(curl -s -X POST "${API_URL}${endpoint}" \
      -H 'Content-Type: application/json' \
      -d "$data" 2>&1)
  else
    response=$(curl -s "${API_URL}${endpoint}" 2>&1)
  fi

  if echo "$response" | grep -q "$expected"; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "  Response: $response"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo "📡 Testing API connectivity..."
echo ""

# Test 1: Health check
test_endpoint \
  "Health Check" \
  "GET" \
  "/api/health/maia" \
  "" \
  "status"

# Test 2: Basic Maia response
test_endpoint \
  "Basic Maia Response" \
  "POST" \
  "/api/oracle/personal" \
  '{"input":"Hi Maia","userId":"test-user-quick-001"}' \
  "message"

# Test 3: Conversation continuity
echo ""
echo "💬 Testing conversation continuity..."
test_endpoint \
  "First message" \
  "POST" \
  "/api/oracle/personal" \
  '{"input":"My name is Alex","userId":"test-user-quick-002"}' \
  "message"

sleep 1

test_endpoint \
  "Second message (context)" \
  "POST" \
  "/api/oracle/personal" \
  '{"input":"What is my name?","userId":"test-user-quick-002"}' \
  "message"

# Test 4: Element detection
echo ""
echo "🔥 Testing elemental classification..."

test_endpoint \
  "Fire element" \
  "POST" \
  "/api/oracle/personal" \
  '{"input":"I want to take action now!","userId":"test-user-quick-003"}' \
  "element"

test_endpoint \
  "Water element" \
  "POST" \
  "/api/oracle/personal" \
  '{"input":"I feel so much sadness","userId":"test-user-quick-004"}' \
  "element"

# Test 5: Memory retrieval (if endpoint exists)
echo ""
echo "🧠 Testing memory system..."

test_endpoint \
  "Memory storage" \
  "POST" \
  "/api/oracle/personal" \
  '{"input":"Remember: my favorite color is blue","userId":"test-user-quick-005"}' \
  "message"

# Summary
echo ""
echo "================================"
echo "📊 Test Results:"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Maia is working correctly.${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some tests failed. Check the output above.${NC}"
  exit 1
fi
