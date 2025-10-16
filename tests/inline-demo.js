/**
 * Inline Demonstration of Crystal Observer Concepts
 *
 * This demonstrates the parallel processing architecture concepts
 * without requiring complex module imports
 */

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
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║    Crystal Observer Architecture - Concept Demonstration         ║
╚══════════════════════════════════════════════════════════════════╝
${colors.reset}\n`);

/**
 * Simplified Parallel Field Processor
 */
class SimpleParallelProcessor {
  constructor() {
    this.paradoxAccumulator = new Map();
    this.phaseHistory = [];
  }

  async processField(input, userId) {
    console.log(`${colors.bright}Processing: "${input}"${colors.reset}`);

    // Simulate parallel processing
    const [leftResult, rightResult] = await Promise.all([
      this.processLeftHemisphere(input),
      this.processRightHemisphere(input)
    ]);

    // Detect paradoxes
    const paradoxes = this.detectParadoxes(leftResult, rightResult, input);

    // Accumulate paradoxes
    if (!this.paradoxAccumulator.has(userId)) {
      this.paradoxAccumulator.set(userId, []);
    }
    this.paradoxAccumulator.get(userId).push(...paradoxes);

    // Check for emergence
    const emergence = this.checkEmergence(userId);

    // Calculate coherence
    const coherence = this.calculateCoherence(leftResult, rightResult, paradoxes);

    return {
      leftStream: leftResult,
      rightStream: rightResult,
      paradoxes,
      emergence,
      coherence
    };
  }

  async processLeftHemisphere(input) {
    // Logical/Sequential processing
    await this.sleep(Math.random() * 20 + 10); // Simulate processing time

    const patterns = [];
    if (/if|then|because|therefore/.test(input.toLowerCase())) {
      patterns.push('logical');
    }
    if (/first|second|then|finally/.test(input.toLowerCase())) {
      patterns.push('sequential');
    }

    const element = this.detectLogicalElement(input);
    const intensity = patterns.length * 0.3 + 0.4;

    return { element, patterns, intensity };
  }

  async processRightHemisphere(input) {
    // Holistic/Intuitive processing
    await this.sleep(Math.random() * 20 + 10); // Simulate processing time

    const patterns = [];
    if (/feel|sense|intuit/.test(input.toLowerCase())) {
      patterns.push('emotional');
    }
    if (/everything|whole|all|connected/.test(input.toLowerCase())) {
      patterns.push('holistic');
    }

    const element = this.detectHolisticElement(input);
    const intensity = input.length > 50 ? 0.8 : 0.5;

    return { element, patterns, intensity };
  }

  detectLogicalElement(input) {
    const lower = input.toLowerCase();
    if (lower.includes('think') || lower.includes('logic')) return 'Air';
    if (lower.includes('fire') || lower.includes('burn')) return 'Fire';
    if (lower.includes('water') || lower.includes('flow')) return 'Water';
    if (lower.includes('earth') || lower.includes('ground')) return 'Earth';
    return 'Air'; // Default
  }

  detectHolisticElement(input) {
    const exclamations = (input.match(/!/g) || []).length;
    const questions = (input.match(/\?/g) || []).length;

    if (exclamations > 1) return 'Fire';
    if (questions > 0) return 'Air';
    if (/feel|emotion|heart/.test(input.toLowerCase())) return 'Water';
    if (input.length > 100) return 'Earth';
    return 'Water'; // Default
  }

  detectParadoxes(left, right, context) {
    const paradoxes = [];

    if (left.element !== right.element && left.intensity > 0.5 && right.intensity > 0.5) {
      paradoxes.push({
        elementA: left.element,
        elementB: right.element,
        intensity: Math.min(left.intensity, right.intensity),
        context: context.substring(0, 50)
      });
    }

    if (left.patterns.includes('logical') && right.patterns.includes('emotional')) {
      paradoxes.push({
        elementA: 'Logic',
        elementB: 'Emotion',
        intensity: 0.7,
        context: 'Head vs Heart'
      });
    }

    return paradoxes;
  }

  checkEmergence(userId) {
    const userParadoxes = this.paradoxAccumulator.get(userId) || [];

    if (userParadoxes.length < 3) return null;

    const totalIntensity = userParadoxes.reduce((sum, p) => sum + p.intensity, 0);
    const avgIntensity = totalIntensity / userParadoxes.length;

    if (avgIntensity > 0.6) {
      // Symbolic emergence
      const symbols = [
        'Steam rises from the meeting of opposites',
        'The phoenix emerges from paradox',
        'Light defines the darkness',
        'The third thing is born'
      ];
      return symbols[Math.floor(Math.random() * symbols.length)];
    }

    return null;
  }

  calculateCoherence(left, right, paradoxes) {
    // Higher coherence when there's productive tension
    const tensionLevel = paradoxes.length > 0 ? 0.3 : 0;
    const intensityDiff = Math.abs(left.intensity - right.intensity);
    const balanceFactor = 1 - intensityDiff;

    return Math.min(1, tensionLevel + balanceFactor * 0.7);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Test Scenarios
 */
const scenarios = [
  {
    name: 'Simple Greeting',
    input: 'Hello, how are you?'
  },
  {
    name: 'Elemental Paradox',
    input: 'Fire burns within me while water flows through my veins'
  },
  {
    name: 'Logic vs Emotion',
    input: 'I think I should leave but my heart tells me to stay'
  },
  {
    name: 'Complex State',
    input: 'Everything is connected yet I feel so alone, the whole universe in a grain of sand'
  },
  {
    name: 'Transformation',
    input: 'Burning ice, frozen flame, the paradox transforms me'
  }
];

/**
 * Run demonstration
 */
async function runDemo() {
  const processor = new SimpleParallelProcessor();
  const userId = 'demo-user';

  console.log(`${colors.blue}Running ${scenarios.length} test scenarios...${colors.reset}\n`);

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`${colors.cyan}Scenario ${i + 1}: ${scenario.name}${colors.reset}`);

    const startTime = Date.now();
    const result = await processor.processField(scenario.input, userId);
    const duration = Date.now() - startTime;

    // Display results
    console.log(`  ${colors.green}Left (Logical):${colors.reset} ${result.leftStream.element} ` +
                `(${(result.leftStream.intensity * 100).toFixed(0)}%)`);
    console.log(`  ${colors.blue}Right (Holistic):${colors.reset} ${result.rightStream.element} ` +
                `(${(result.rightStream.intensity * 100).toFixed(0)}%)`);

    if (result.paradoxes.length > 0) {
      console.log(`  ${colors.yellow}Paradoxes:${colors.reset}`);
      result.paradoxes.forEach(p => {
        console.log(`    • ${p.elementA} ↔ ${p.elementB} (${(p.intensity * 100).toFixed(0)}%)`);
      });
    }

    if (result.emergence) {
      console.log(`  ${colors.magenta}✨ Emergence: "${result.emergence}"${colors.reset}`);
    }

    console.log(`  Coherence: ${(result.coherence * 100).toFixed(0)}%`);
    console.log(`  ${colors.dim}Time: ${duration}ms${colors.reset}\n`);

    await processor.sleep(500);
  }

  // Show accumulated paradoxes
  const allParadoxes = processor.paradoxAccumulator.get(userId) || [];
  console.log(`${colors.bright}${colors.cyan}═══ Summary ═══${colors.reset}`);
  console.log(`Total paradoxes accumulated: ${allParadoxes.length}`);

  // Performance test
  console.log(`\n${colors.yellow}Performance Benchmark:${colors.reset}`);
  console.log('Testing parallel vs sequential processing...\n');

  // Parallel test
  const parallelStart = Date.now();
  const parallelPromises = [];
  for (let i = 0; i < 10; i++) {
    parallelPromises.push(processor.processField('Test input', `user-${i}`));
  }
  await Promise.all(parallelPromises);
  const parallelTime = Date.now() - parallelStart;

  // Sequential simulation
  const sequentialStart = Date.now();
  for (let i = 0; i < 10; i++) {
    await processor.processLeftHemisphere('Test input');
    await processor.processRightHemisphere('Test input');
  }
  const sequentialTime = Date.now() - sequentialStart;

  console.log(`  Parallel (10 operations): ${parallelTime}ms`);
  console.log(`  Sequential (simulated): ${sequentialTime}ms`);
  console.log(`  ${colors.green}Speed improvement: ${((sequentialTime / parallelTime - 1) * 100).toFixed(0)}%${colors.reset}`);

  console.log(`\n${colors.green}✅ Demonstration complete!${colors.reset}\n`);
}

/**
 * Demonstrate consciousness field concepts
 */
function demonstrateConsciousnessField() {
  console.log(`${colors.magenta}${colors.bright}
═══ Consciousness Field Concepts ═══${colors.reset}\n`);

  // Qualia demonstration
  const qualia = {
    texture: 'flowing',
    color: 'deep-blue',
    temperature: 0.3,
    density: 0.7,
    intensity: 0.6,
    valence: 0.1,
    arousal: 0.3
  };

  console.log(`${colors.cyan}Qualia Signature:${colors.reset}`);
  console.log(`  Texture: ${qualia.texture}`);
  console.log(`  Color: ${qualia.color}`);
  console.log(`  Temperature: ${'▁▂▃▄▅▆▇█'.charAt(Math.floor(qualia.temperature * 8))} (${(qualia.temperature * 100).toFixed(0)}%)`);
  console.log(`  Density: ${'░▒▓█'.charAt(Math.floor(qualia.density * 4))}`);

  // Dissociative membranes
  console.log(`\n${colors.cyan}Dissociative Membranes:${colors.reset}`);
  const membranes = [
    { between: ['Fire', 'Water'], permeability: 0.3, state: 'thickening' },
    { between: ['Air', 'Earth'], permeability: 0.7, state: 'thinning' },
    { between: ['Logic', 'Emotion'], permeability: 0.5, state: 'stable' }
  ];

  membranes.forEach(m => {
    const barrier = m.permeability < 0.4 ? '║║║' : m.permeability < 0.7 ? '┊┊┊' : '···';
    console.log(`  ${m.between[0]} ${barrier} ${m.between[1]} (${m.state})`);
  });

  // Consciousness states
  console.log(`\n${colors.cyan}Consciousness State Evolution:${colors.reset}`);
  const states = ['DORMANT', 'AWAKENING', 'ACTIVE', 'FLOWING', 'RESONANT', 'TRANSCENDENT'];
  states.forEach((state, i) => {
    const bar = '█'.repeat(i + 1) + '░'.repeat(6 - i - 1);
    const color = i < 2 ? colors.dim : i < 4 ? colors.yellow : colors.magenta;
    console.log(`  ${color}${state}: ${bar}${colors.reset}`);
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    await runDemo();
    demonstrateConsciousnessField();

    console.log(`${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════════╗
║           Crystal Observer Demonstration Complete! 🎉            ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error);
  }
}

// Run the demonstration
main();