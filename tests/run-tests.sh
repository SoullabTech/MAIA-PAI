#!/bin/bash

# Crystal Observer Test Runner
# Run various test modes for the new parallel processing architecture

echo "🔮 Crystal Observer Test Suite"
echo "=============================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to run tests with nice formatting
run_test() {
    local test_name=$1
    local test_command=$2

    echo -e "${CYAN}Running: ${test_name}${NC}"
    echo "----------------------------------------"

    if eval "$test_command"; then
        echo -e "${GREEN}✓ ${test_name} passed${NC}\n"
        return 0
    else
        echo -e "${RED}✗ ${test_name} failed${NC}\n"
        return 1
    fi
}

# Check for dependencies
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"

    if ! command -v npm &> /dev/null; then
        echo -e "${RED}npm is not installed${NC}"
        exit 1
    fi

    if ! command -v npx &> /dev/null; then
        echo -e "${RED}npx is not installed${NC}"
        exit 1
    fi

    # Check if Jest is installed
    if ! npm list jest &> /dev/null; then
        echo -e "${YELLOW}Installing Jest...${NC}"
        npm install --save-dev jest @types/jest ts-jest
    fi

    echo -e "${GREEN}Dependencies OK${NC}\n"
}

# Main menu
show_menu() {
    echo -e "${MAGENTA}Select test mode:${NC}"
    echo "1) Run unit tests (Jest)"
    echo "2) Run demonstration (all scenarios)"
    echo "3) Run interactive mode"
    echo "4) Run performance benchmark"
    echo "5) Run integration tests"
    echo "6) Run all tests"
    echo "q) Quit"
    echo ""
    read -p "Enter choice: " choice

    case $choice in
        1)
            run_unit_tests
            ;;
        2)
            run_demonstration
            ;;
        3)
            run_interactive
            ;;
        4)
            run_performance
            ;;
        5)
            run_integration
            ;;
        6)
            run_all_tests
            ;;
        q)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            show_menu
            ;;
    esac
}

# Run unit tests
run_unit_tests() {
    echo -e "\n${BLUE}=== Running Unit Tests ===${NC}\n"

    # Create Jest config if it doesn't exist
    if [ ! -f "jest.config.js" ]; then
        cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/**/*.d.ts',
  ],
};
EOF
    fi

    npx jest tests/fieldProtocol/ParallelFieldProcessor.test.ts --verbose
}

# Run demonstration
run_demonstration() {
    echo -e "\n${BLUE}=== Running Crystal Observer Demonstration ===${NC}\n"
    npx ts-node tests/demonstrations/CrystalObserverDemo.ts
}

# Run interactive mode
run_interactive() {
    echo -e "\n${BLUE}=== Starting Interactive Mode ===${NC}\n"
    echo -e "${YELLOW}You can type messages to test the system. Type 'exit' to quit.${NC}\n"
    npx ts-node tests/demonstrations/CrystalObserverDemo.ts interactive
}

# Run performance benchmarks
run_performance() {
    echo -e "\n${BLUE}=== Running Performance Benchmarks ===${NC}\n"

    # Create a simple benchmark script
    cat > /tmp/benchmark.ts << 'EOF'
import { ParallelFieldProcessor } from './lib/fieldProtocol/ParallelFieldProcessor';

async function benchmark() {
    const processor = new ParallelFieldProcessor();
    const iterations = 100;
    const userId = 'benchmark-user';

    console.log(`Running ${iterations} iterations...`);

    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
        await processor.processField(
            `Test input ${i} with various elements fire water earth air`,
            userId
        );
    }

    const totalTime = Date.now() - startTime;
    const avgTime = totalTime / iterations;

    console.log(`\nResults:`);
    console.log(`Total time: ${totalTime}ms`);
    console.log(`Average per iteration: ${avgTime.toFixed(2)}ms`);
    console.log(`Throughput: ${(1000 / avgTime).toFixed(2)} ops/sec`);

    await processor.cleanup();
}

benchmark().catch(console.error);
EOF

    npx ts-node /tmp/benchmark.ts
    rm /tmp/benchmark.ts
}

# Run integration tests
run_integration() {
    echo -e "\n${BLUE}=== Running Integration Tests ===${NC}\n"

    # Test the bridge between old and new systems
    cat > /tmp/integration.ts << 'EOF'
import { getMaiaBridge } from './lib/integration/MaiaCrystalBridge';

async function testIntegration() {
    console.log('Testing Maia Crystal Bridge integration...\n');

    const bridge = getMaiaBridge({
        mode: 'hybrid',
        crystalWeight: 0.5,
        logTransitions: true
    });

    const testCases = [
        'Hello',
        'I feel conflicted',
        'Fire and water within',
        'What is consciousness?'
    ];

    for (const input of testCases) {
        console.log(`\nInput: "${input}"`);
        const result = await bridge.process(input, 'test-user');
        console.log(`Response: "${result.message}"`);
        console.log(`Mode: ${result.processingMode}`);
        if (result.consciousness) {
            console.log(`State: ${result.consciousness.state}`);
        }
    }

    const metrics = bridge.getMetrics();
    console.log('\nMetrics:', metrics);
}

testIntegration().catch(console.error);
EOF

    npx ts-node /tmp/integration.ts
    rm /tmp/integration.ts
}

# Run all tests
run_all_tests() {
    echo -e "\n${BLUE}=== Running All Tests ===${NC}\n"

    local failed=0

    run_test "Unit Tests" "npx jest tests/fieldProtocol/ParallelFieldProcessor.test.ts" || failed=$((failed + 1))
    run_test "Performance Benchmark" "run_performance" || failed=$((failed + 1))
    run_test "Integration Tests" "run_integration" || failed=$((failed + 1))

    echo -e "\n${BLUE}=== Test Summary ===${NC}"
    if [ $failed -eq 0 ]; then
        echo -e "${GREEN}All tests passed!${NC}"
    else
        echo -e "${RED}${failed} test suite(s) failed${NC}"
        exit 1
    fi
}

# Quick test function for CI/CD
quick_test() {
    echo -e "${CYAN}Running quick validation tests...${NC}\n"

    # Just run the core unit tests
    npx jest tests/fieldProtocol/ParallelFieldProcessor.test.ts --silent --testNamePattern="should process left and right streams simultaneously"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Quick tests passed${NC}"
    else
        echo -e "${RED}✗ Quick tests failed${NC}"
        exit 1
    fi
}

# Main execution
main() {
    check_dependencies

    # Check if running in CI mode
    if [ "$1" = "--ci" ] || [ "$1" = "ci" ]; then
        quick_test
    elif [ "$1" = "--all" ] || [ "$1" = "all" ]; then
        run_all_tests
    elif [ "$1" = "--demo" ] || [ "$1" = "demo" ]; then
        run_demonstration
    elif [ "$1" = "--interactive" ] || [ "$1" = "-i" ]; then
        run_interactive
    else
        show_menu
    fi
}

# Run main function
main "$@"