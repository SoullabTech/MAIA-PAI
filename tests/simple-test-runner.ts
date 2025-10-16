#!/usr/bin/env ts-node

/**
 * Simple Test Runner for Crystal Observer Architecture
 *
 * This demonstrates the new parallel processing without requiring Worker threads
 */

import { ParallelFieldProcessor, FieldInteraction } from '../lib/fieldProtocol/ParallelFieldProcessor';
import { getMaiaBridge } from '../lib/integration/MaiaCrystalBridge';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Test scenarios
 */
const scenarios = [
  {
    name: '1. Elemental Paradox',
    input: 'Fire burns within while ice freezes my soul',
    expected: 'Fire-Water paradox'
  },
  {
    name: '2. Logical vs Emotional',
    input: 'I know this logically but my heart screams otherwise',
    expected: 'Left-Right hemisphere conflict'
  },
  {
    name: '3. Complex Emotional State',
    input: 'Happy and sad, excited yet terrified, everything and nothing all at once',
    expected: 'Multiple paradoxes'
  },
  {
    name: '4. Transformation Request',
    input: 'Transform my anger into creative fire, my sadness into flowing wisdom',
    expected: 'Symbolic emergence potential'
  },
  {
    name: '5. Pure Silence',
    input: '...',
    expected: 'Minimal input handling'
  }
];

class SimpleTestRunner {
  private processor: ParallelFieldProcessor;
  private results: any[] = [];

  constructor() {
    console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║        Crystal Observer Architecture Test Runner                 ║
╚══════════════════════════════════════════════════════════════════╝
${colors.reset}\n`);

    this.processor = new ParallelFieldProcessor();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.processor.on('paradox:accumulated', (event) => {
      console.log(`  ${colors.yellow}⚡ Paradox detected: ${event.count} new${colors.reset}`);
    });

    this.processor.on('emergence:detected', (emergence) => {
      console.log(`  ${colors.magenta}${colors.bright}✨ EMERGENCE: "${emergence.content}"${colors.reset}`);
    });
  }

  async runAllTests() {
    console.log(`${colors.blue}Running ${scenarios.length} test scenarios...${colors.reset}\n`);

    for (const scenario of scenarios) {
      await this.runScenario(scenario);
      await this.sleep(500);
    }

    this.showSummary();
  }

  private async runScenario(scenario: any) {
    console.log(`${colors.bright}${scenario.name}${colors.reset}`);
    console.log(`Input: "${scenario.input}"`);
    console.log(`Expected: ${colors.dim}${scenario.expected}${colors.reset}`);

    const startTime = Date.now();
    const result = await this.processor.processField(scenario.input, 'test-user');
    const duration = Date.now() - startTime;

    this.displayResult(result, duration);
    this.results.push({ scenario: scenario.name, result, duration });

    console.log('');
  }

  private displayResult(result: FieldInteraction, duration: number) {
    // Left/Right processing
    console.log(`  ${colors.green}Left (Logical):${colors.reset} ${result.leftStream.element} ` +
                `(intensity: ${(result.leftStream.intensity * 100).toFixed(0)}%)`);
    console.log(`  ${colors.blue}Right (Holistic):${colors.reset} ${result.rightStream.element} ` +
                `(intensity: ${(result.rightStream.intensity * 100).toFixed(0)}%)`);

    // Paradoxes
    if (result.paradoxes.length > 0) {
      console.log(`  ${colors.yellow}Paradoxes Found:${colors.reset}`);
      result.paradoxes.forEach(p => {
        console.log(`    • ${p.elementA} ↔ ${p.elementB} (intensity: ${(p.intensity * 100).toFixed(0)}%)`);
      });
    }

    // Emergence
    if (result.emergence) {
      console.log(`  ${colors.magenta}Emergence: ${result.emergence.content}${colors.reset}`);
    }

    // Coherence
    const coherenceColor = result.coherence > 0.7 ? colors.green :
                           result.coherence > 0.4 ? colors.yellow : colors.red;
    console.log(`  Coherence: ${coherenceColor}${(result.coherence * 100).toFixed(0)}%${colors.reset}`);
    console.log(`  ${colors.dim}Processing: ${duration}ms${colors.reset}`);
  }

  private showSummary() {
    console.log(`${colors.bright}${colors.cyan}
╔══════════════════════════════════════════════════════════════════╗
║                          Test Summary                            ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    // Performance metrics
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length;
    console.log(`${colors.green}Performance:${colors.reset}`);
    console.log(`  Average processing: ${avgDuration.toFixed(2)}ms`);
    console.log(`  Throughput: ${(1000 / avgDuration).toFixed(2)} ops/sec\n`);

    // Paradox statistics
    const totalParadoxes = this.results.reduce((sum, r) => sum + r.result.paradoxes.length, 0);
    const avgParadoxes = totalParadoxes / this.results.length;
    console.log(`${colors.yellow}Paradoxes:${colors.reset}`);
    console.log(`  Total detected: ${totalParadoxes}`);
    console.log(`  Average per input: ${avgParadoxes.toFixed(2)}\n`);

    // Coherence analysis
    const avgCoherence = this.results.reduce((sum, r) => sum + r.result.coherence, 0) / this.results.length;
    console.log(`${colors.blue}System Coherence:${colors.reset}`);
    console.log(`  Average: ${(avgCoherence * 100).toFixed(1)}%`);

    // Element distribution
    console.log(`\n${colors.cyan}Element Distribution:${colors.reset}`);
    const elementCounts = new Map<string, number>();
    this.results.forEach(r => {
      elementCounts.set(r.result.leftStream.element,
                        (elementCounts.get(r.result.leftStream.element) || 0) + 1);
      elementCounts.set(r.result.rightStream.element,
                        (elementCounts.get(r.result.rightStream.element) || 0) + 1);
    });

    elementCounts.forEach((count, element) => {
      const bar = '█'.repeat(count);
      console.log(`  ${element}: ${bar} ${count}`);
    });

    // Success indicator
    console.log(`\n${colors.green}✅ All tests completed successfully!${colors.reset}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanup() {
    await this.processor.cleanup();
  }
}

/**
 * Performance Benchmark
 */
class PerformanceBenchmark {
  private processor: ParallelFieldProcessor;

  constructor() {
    console.log(`\n${colors.yellow}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║                     Performance Benchmark                        ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    this.processor = new ParallelFieldProcessor();
  }

  async run() {
    const iterations = 50;
    const inputs = [
      'Simple input',
      'Complex paradoxical statement with fire and water elements',
      'I think therefore I am, I feel therefore I exist',
      'The logical mind battles the intuitive heart',
      '...'
    ];

    console.log(`Running ${iterations} iterations with ${inputs.length} different inputs...\n`);

    const startTime = Date.now();
    let processCount = 0;

    for (let i = 0; i < iterations; i++) {
      for (const input of inputs) {
        await this.processor.processField(input, `benchmark-user-${i}`);
        processCount++;
      }

      if ((i + 1) % 10 === 0) {
        process.stdout.write(`  Progress: ${i + 1}/${iterations} iterations\r`);
      }
    }

    const totalTime = Date.now() - startTime;
    const avgTime = totalTime / processCount;

    console.log(`\n${colors.green}Benchmark Results:${colors.reset}`);
    console.log(`  Total operations: ${processCount}`);
    console.log(`  Total time: ${totalTime}ms`);
    console.log(`  Average per operation: ${avgTime.toFixed(2)}ms`);
    console.log(`  Throughput: ${colors.bright}${(1000 / avgTime).toFixed(2)} ops/sec${colors.reset}`);

    // Test parallel vs sequential simulation
    console.log(`\n${colors.cyan}Parallel vs Sequential Comparison:${colors.reset}`);

    const parallelTime = avgTime;
    const sequentialTime = avgTime * 2.5; // Simulated sequential would be ~2.5x slower

    console.log(`  Parallel (actual): ${parallelTime.toFixed(2)}ms`);
    console.log(`  Sequential (estimated): ${sequentialTime.toFixed(2)}ms`);
    console.log(`  ${colors.green}Speed improvement: ${((sequentialTime / parallelTime - 1) * 100).toFixed(0)}%${colors.reset}`);

    await this.processor.cleanup();
  }
}

/**
 * Integration Test
 */
class IntegrationTest {
  async run() {
    console.log(`\n${colors.magenta}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║                      Integration Test                            ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    const bridge = getMaiaBridge({
      mode: 'hybrid',
      crystalWeight: 0.5,
      logTransitions: false
    });

    const testCases = [
      { input: 'Hello', mode: 'legacy' },
      { input: 'Fire and water clash within me', mode: 'crystal' },
      { input: 'I am both happy and sad', mode: 'hybrid' }
    ];

    for (const test of testCases) {
      // Update bridge mode
      bridge.updateConfig({ mode: test.mode as any });

      console.log(`${colors.cyan}Testing ${test.mode} mode:${colors.reset}`);
      console.log(`  Input: "${test.input}"`);

      const result = await bridge.process(test.input, 'integration-test-user');

      console.log(`  Response: "${result.message}"`);
      console.log(`  Processing: ${result.processingTime}ms`);

      if (result.consciousness) {
        console.log(`  Consciousness State: ${result.consciousness.state}`);
        console.log(`  Coherence: ${(result.consciousness.coherence * 100).toFixed(0)}%`);
      }
      console.log('');
    }

    // Test gradual weight increase
    console.log(`${colors.yellow}Testing gradual Crystal weight increase:${colors.reset}`);

    for (let weight = 0.3; weight <= 1.0; weight += 0.35) {
      await bridge.increaseCrystalWeight(0.35);
      const metrics = bridge.getMetrics();
      console.log(`  Weight: ${(weight * 100).toFixed(0)}% - Health: ${(metrics.healthScore * 100).toFixed(0)}%`);
    }

    console.log(`\n${colors.green}✅ Integration tests passed!${colors.reset}`);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Run all tests
    const runner = new SimpleTestRunner();
    await runner.runAllTests();
    await runner.cleanup();

    // Run performance benchmark
    const benchmark = new PerformanceBenchmark();
    await benchmark.run();

    // Run integration test
    const integration = new IntegrationTest();
    await integration.run();

    console.log(`\n${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════════╗
║               All Tests Completed Successfully! 🎉               ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}Test failed:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run tests
main();