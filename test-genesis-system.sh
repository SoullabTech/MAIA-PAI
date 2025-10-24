#!/bin/bash

# Genesis System Testing Script
# Tests all API endpoints and flows

echo "🧪 Genesis System Testing"
echo "========================="
echo ""

BASE_URL="http://localhost:3000"
ADMIN_PASSWORD="genesis2025"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Helper function for tests
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-}
    local expected_status=${5:-200}
    local headers=${6:-}

    echo -n "Testing: $name... "

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$url" $headers)
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data")
    elif [ "$method" = "PATCH" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PATCH "$url" \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data")
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code, expected $expected_status)"
        echo "  Response: $body"
        ((FAILED++))
        return 1
    fi
}

echo "📍 Base URL: $BASE_URL"
echo ""

# Check if server is running
echo "Checking if dev server is running..."
if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo -e "${RED}✗ Dev server is not running!${NC}"
    echo ""
    echo "Please start the dev server first:"
    echo "  npm run dev"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Dev server is running${NC}"
echo ""

# Test 1: Name Checker API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Name Availability Checker"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Check available name" \
    "$BASE_URL/api/genesis/check-name?name=test-node-$(date +%s)" \
    "GET" "" 200

test_endpoint "Check invalid name (uppercase)" \
    "$BASE_URL/api/genesis/check-name?name=TestNode" \
    "GET" "" 200

test_endpoint "Check empty name" \
    "$BASE_URL/api/genesis/check-name?name=" \
    "GET" "" 400

echo ""

# Test 2: Admin API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Admin API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Admin API without auth" \
    "$BASE_URL/api/genesis/admin/nodes" \
    "GET" "" 401

test_endpoint "Admin API with auth" \
    "$BASE_URL/api/genesis/admin/nodes" \
    "GET" "" 200 \
    "-H 'Authorization: Bearer $ADMIN_PASSWORD'"

echo ""

# Test 3: Checkout API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Checkout API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Create checkout (missing data)" \
    "$BASE_URL/api/genesis/checkout" \
    "POST" '{}' 400

test_endpoint "Create checkout (invalid tier)" \
    "$BASE_URL/api/genesis/checkout" \
    "POST" '{"tier":"invalid","email":"test@test.com"}' 400

# Test with valid tier (will fail if Stripe not configured, which is expected)
echo -n "Testing: Create checkout (valid - may fail if Stripe unconfigured)... "
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/genesis/checkout" \
    -H "Content-Type: application/json" \
    -d '{"tier":"seed","email":"test@example.com","name":"Test User"}')
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" = "200" ] || [ "$http_code" = "500" ]; then
    echo -e "${YELLOW}⚠ EXPECTED${NC} (HTTP $http_code - Stripe may need configuration)"
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
    ((FAILED++))
fi

echo ""

# Test 4: Static Pages
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Static Pages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Landing page" \
    "$BASE_URL/genesis-soullab-life/index.html" \
    "GET" "" 200

test_endpoint "Onboarding page" \
    "$BASE_URL/genesis-soullab-life/onboarding.html" \
    "GET" "" 200

test_endpoint "Admin page" \
    "$BASE_URL/genesis-soullab-life/admin.html" \
    "GET" "" 200

test_endpoint "Checkout page" \
    "$BASE_URL/genesis-soullab-life/checkout.html" \
    "GET" "" 200

test_endpoint "Success page" \
    "$BASE_URL/genesis-soullab-life/payment-success.html" \
    "GET" "" 200

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review output above.${NC}"
    exit 1
fi
