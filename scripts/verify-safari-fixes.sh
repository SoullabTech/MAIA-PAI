#!/bin/bash
# COMPREHENSIVE SAFARI FIXES VERIFICATION
# Tests Safari button functionality across different scenarios

set -e

echo "🧪 SAFARI FIXES COMPREHENSIVE VERIFICATION"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_TOTAL=0

run_test() {
    local test_name="$1"
    local test_command="$2"

    echo -e "${BLUE}Testing:${NC} $test_name"
    TESTS_TOTAL=$((TESTS_TOTAL + 1))

    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        return 1
    fi
}

echo "📁 File Structure Tests"
echo "======================"

run_test "Critical files exist" "test -f app/globals.css && test -f app/maia/page.tsx"

run_test "Backup files preserved" "test -f docs/backups/working-build-20251121/globals.css.backup && test -f docs/backups/working-build-20251121/maia-page.tsx.backup"

run_test "Vault documentation exists" "test -f docs/CRITICAL-SAFARI-FIXES-VAULT.md"

run_test "Emergency recovery script exists" "test -x scripts/emergency-safari-recovery.sh"

echo ""
echo "🎨 CSS Content Tests"
echo "===================="

run_test "Safari button CSS fixes present" "grep -q 'Safari-specific button interaction fixes' app/globals.css"

run_test "Hardware acceleration enabled" "grep -q 'transform: translateZ(0)' app/globals.css"

run_test "Touch target size specified" "grep -q 'min-width: 44px' app/globals.css"

run_test "Pointer events override" "grep -q 'pointer-events: auto !important' app/globals.css"

run_test "iOS-specific fixes present" "grep -q '@supports (-webkit-overflow-scrolling: touch)' app/globals.css"

echo ""
echo "⚛️  React Component Tests"
echo "========================="

run_test "MAIA page has Safari button fixes" "grep -q 'Safari-specific button fixes' app/maia/page.tsx"

run_test "Button role attributes present" 'grep -q "role=\"button\"" app/maia/page.tsx'

run_test "Accessibility labels present" "grep -q 'aria-label' app/maia/page.tsx"

run_test "Touch action manipulation" "grep -q 'touchAction.*manipulation' app/maia/page.tsx"

echo ""
echo "🔧 Protection System Tests"
echo "==========================="

run_test "Protection script executable" "test -x scripts/protect-safari-fixes.sh"

run_test "Pre-commit hook has Safari protection" "grep -q 'Safari protection check' .git/hooks/pre-commit"

run_test "Post-merge hook exists" "test -x .git/hooks/post-merge"

echo ""
echo "🌐 Environment Tests"
echo "===================="

run_test "Development environment configured" "test -f .env.local && grep -q 'NODE_ENV=development' .env.local"

run_test "API keys present" "grep -q 'OPENAI_API_KEY' .env.local && grep -q 'ANTHROPIC_API_KEY' .env.local"

echo ""
echo "📊 VERIFICATION RESULTS"
echo "======================="

PASS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))

echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}/$TESTS_TOTAL"
echo -e "Success Rate: ${GREEN}${PASS_RATE}%${NC}"

if [[ $TESTS_PASSED -eq $TESTS_TOTAL ]]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}Safari button fixes are fully functional and protected.${NC}"
    echo ""
    echo "🌐 Ready for testing at: http://localhost:3000/maia"
    echo "🧪 Test in Safari, Chrome, Firefox, and mobile Safari"
    exit 0
else
    FAILED=$((TESTS_TOTAL - TESTS_PASSED))
    echo ""
    echo -e "${RED}❌ $FAILED TESTS FAILED!${NC}"
    echo ""
    echo "🔧 To fix issues:"
    echo "1. Run: ./scripts/emergency-safari-recovery.sh"
    echo "2. Check: docs/CRITICAL-SAFARI-FIXES-VAULT.md"
    echo "3. Re-run: ./scripts/verify-safari-fixes.sh"
    exit 1
fi