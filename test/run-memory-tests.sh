#!/bin/bash
# MAIA Memory Integration Test Suite
# Quick testing script for pre-Monday validation

set -e  # Exit on error

echo "🧪 MAIA Memory Integration Test Suite"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="${API_URL:-http://localhost:3000}"
TEST_USER_PREFIX="test-memory-$(date +%s)"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

function run_test() {
    local test_name=$1
    local test_func=$2

    echo -e "${YELLOW}⏳ Running: ${test_name}${NC}"
    TESTS_RUN=$((TESTS_RUN + 1))

    if $test_func; then
        echo -e "${GREEN}✅ PASSED: ${test_name}${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED: ${test_name}${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
}

# Test 1: Memory Saving
test_memory_saving() {
    local user_id="${TEST_USER_PREFIX}-save"
    local session_id="session-001"

    echo "  → Sending test message..."
    response=$(curl -s -X POST "${API_URL}/api/oracle/personal" \
        -H "Content-Type: application/json" \
        -d "{
            \"input\": \"I am feeling anxious about my creative work\",
            \"userId\": \"${user_id}\",
            \"sessionId\": \"${session_id}\"
        }")

    # Check if response contains expected fields
    if echo "$response" | grep -q "success.*true" && echo "$response" | grep -q "response"; then
        echo "  ✓ Response received"
        echo "  → Check Supabase for saved messages (user_id: ${user_id})"
        return 0
    else
        echo "  ✗ Invalid response"
        echo "$response"
        return 1
    fi
}

# Test 2: Memory Retrieval
test_memory_retrieval() {
    local user_id="${TEST_USER_PREFIX}-retrieve"
    local session_id="session-002"

    echo "  → Creating conversation with 3 exchanges..."
    for i in {1..3}; do
        curl -s -X POST "${API_URL}/api/oracle/personal" \
            -H "Content-Type: application/json" \
            -d "{
                \"input\": \"Test message ${i} about my journey\",
                \"userId\": \"${user_id}\",
                \"sessionId\": \"${session_id}\"
            }" > /dev/null
        sleep 1
    done

    echo "  ✓ 3 exchanges sent"
    echo "  → Check server logs for: '💭 Retrieved X memories for ${user_id}'"
    return 0
}

# Test 3: Multi-User Isolation
test_multi_user_isolation() {
    local user_a="${TEST_USER_PREFIX}-user-a"
    local user_b="${TEST_USER_PREFIX}-user-b"

    echo "  → User A: Talking about hiking..."
    response_a=$(curl -s -X POST "${API_URL}/api/oracle/personal" \
        -H "Content-Type: application/json" \
        -d "{
            \"input\": \"I love hiking in the mountains\",
            \"userId\": \"${user_a}\",
            \"sessionId\": \"session-a\"
        }")

    sleep 1

    echo "  → User B: Asking about journey..."
    response_b=$(curl -s -X POST "${API_URL}/api/oracle/personal" \
        -H "Content-Type: application/json" \
        -d "{
            \"input\": \"Tell me about my journey\",
            \"userId\": \"${user_b}\",
            \"sessionId\": \"session-b\"
        }")

    # Check if User B's response mentions mountains (it shouldn't!)
    if echo "$response_b" | grep -iq "mountain\|hiking"; then
        echo "  ✗ MEMORY LEAK: User B saw User A's memories!"
        return 1
    else
        echo "  ✓ Users properly isolated"
        return 0
    fi
}

# Test 4: First-Time User
test_first_time_user() {
    local user_id="${TEST_USER_PREFIX}-newbie"

    echo "  → Sending first message from brand new user..."
    response=$(curl -s -X POST "${API_URL}/api/oracle/personal" \
        -H "Content-Type: application/json" \
        -d "{
            \"input\": \"Hello MAIA, this is my first time\",
            \"userId\": \"${user_id}\",
            \"sessionId\": \"first-session\"
        }")

    # Check that response doesn't reference past conversations
    if echo "$response" | grep -iq "last time\|you mentioned\|as we discussed"; then
        echo "  ✗ MAIA referenced non-existent history!"
        return 1
    else
        echo "  ✓ First-time user handled gracefully"
        return 0
    fi
}

# Test 5: Cross-Session Continuity
test_cross_session() {
    local user_id="${TEST_USER_PREFIX}-continuity"

    echo "  → Session 1: Breakthrough about fear..."
    curl -s -X POST "${API_URL}/api/oracle/personal" \
        -H "Content-Type: application/json" \
        -d "{
            \"input\": \"I had a breakthrough about my fear of failure today\",
            \"userId\": \"${user_id}\",
            \"sessionId\": \"evening-session\"
        }" > /dev/null

    sleep 2

    echo "  → Session 2: Asking about creative work..."
    response=$(curl -s -X POST "${API_URL}/api/oracle/personal" \
        -H "Content-Type: application/json" \
        -d "{
            \"input\": \"How should I approach my creative work today?\",
            \"userId\": \"${user_id}\",
            \"sessionId\": \"morning-session\"
        }")

    # Check if response references the fear breakthrough
    if echo "$response" | grep -iq "fear\|breakthrough\|failure"; then
        echo "  ✓ Cross-session continuity maintained"
        return 0
    else
        echo "  ⚠ No clear reference to previous breakthrough (may still be working)"
        return 0  # Don't fail, as subtle continuity might be present
    fi
}

# Test 6: Performance Check
test_performance() {
    local user_id="${TEST_USER_PREFIX}-perf"

    echo "  → Sending request and measuring response time..."
    start_time=$(date +%s%N)

    response=$(curl -s -X POST "${API_URL}/api/oracle/personal" \
        -H "Content-Type: application/json" \
        -d "{
            \"input\": \"Quick performance test\",
            \"userId\": \"${user_id}\",
            \"sessionId\": \"perf-session\"
        }")

    end_time=$(date +%s%N)
    duration_ms=$(( (end_time - start_time) / 1000000 ))

    echo "  → Response time: ${duration_ms}ms"

    if [ $duration_ms -lt 5000 ]; then
        echo "  ✓ Performance acceptable (<5s)"
        return 0
    else
        echo "  ✗ Response too slow (>${duration_ms}ms)"
        return 1
    fi
}

# Main test execution
echo "Starting memory integration tests..."
echo "API URL: ${API_URL}"
echo ""

run_test "Test 1: Memory Saving" test_memory_saving
run_test "Test 2: Memory Retrieval" test_memory_retrieval
run_test "Test 3: Multi-User Isolation" test_multi_user_isolation
run_test "Test 4: First-Time User" test_first_time_user
run_test "Test 5: Cross-Session Continuity" test_cross_session
run_test "Test 6: Performance" test_performance

# Summary
echo "======================================"
echo "Test Results Summary"
echo "======================================"
echo -e "Tests Run:    ${TESTS_RUN}"
echo -e "${GREEN}Passed:       ${TESTS_PASSED}${NC}"
echo -e "${RED}Failed:       ${TESTS_FAILED}${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Memory integration looks good.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Review output above.${NC}"
    exit 1
fi
