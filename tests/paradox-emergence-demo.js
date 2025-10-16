/**
 * Paradox Accumulation and Emergence Demonstration
 *
 * This shows how paradoxes accumulate and create emergence
 */

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

console.log(`${colors.magenta}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║         Paradox Accumulation & Emergence Demonstration           ║
╚══════════════════════════════════════════════════════════════════╝
${colors.reset}\n`);

/**
 * Enhanced Parallel Processor with better paradox detection
 */
class EnhancedParallelProcessor {
  constructor() {
    this.paradoxAccumulator = new Map();
    this.emergenceThreshold = 3; // Need 3 paradoxes for emergence
    this.emergenceHistory = [];
  }

  async processField(input, userId) {
    const [leftResult, rightResult] = await Promise.all([
      this.processLeftHemisphere(input),
      this.processRightHemisphere(input)
    ]);

    const paradoxes = this.detectParadoxes(leftResult, rightResult, input);

    // Accumulate paradoxes
    if (!this.paradoxAccumulator.has(userId)) {
      this.paradoxAccumulator.set(userId, []);
    }

    const userParadoxes = this.paradoxAccumulator.get(userId);
    paradoxes.forEach(p => {
      userParadoxes.push(p);
      console.log(`  ${colors.yellow}⚡ Paradox detected: ${p.elementA} ↔ ${p.elementB} (intensity: ${(p.intensity * 100).toFixed(0)}%)${colors.reset}`);
    });

    // Check for emergence
    const emergence = this.checkForEmergence(userId);
    if (emergence) {
      console.log(`  ${colors.magenta}${colors.bright}✨ EMERGENCE: "${emergence.content}"${colors.reset}`);
      console.log(`  ${colors.magenta}   Type: ${emergence.type}${colors.reset}`);
      this.emergenceHistory.push(emergence);
    }

    const coherence = this.calculateCoherence(leftResult, rightResult, paradoxes, emergence);

    return {
      left: leftResult,
      right: rightResult,
      paradoxes,
      emergence,
      coherence,
      totalParadoxes: userParadoxes.length
    };
  }

  async processLeftHemisphere(input) {
    await this.sleep(10);
    const lower = input.toLowerCase();

    // More sophisticated element detection
    let element = 'Air'; // Default
    let intensity = 0.4;

    if (lower.includes('fire') || lower.includes('burn') || lower.includes('passion')) {
      element = 'Fire';
      intensity = 0.8;
    } else if (lower.includes('water') || lower.includes('flow') || lower.includes('emotion')) {
      element = 'Water';
      intensity = 0.7;
    } else if (lower.includes('earth') || lower.includes('ground') || lower.includes('solid')) {
      element = 'Earth';
      intensity = 0.6;
    } else if (lower.includes('think') || lower.includes('logic') || lower.includes('reason')) {
      element = 'Air';
      intensity = 0.7;
    } else if (lower.includes('void') || lower.includes('empty') || lower.includes('nothing')) {
      element = 'Void';
      intensity = 0.5;
    }

    return { element, intensity, mode: 'logical' };
  }

  async processRightHemisphere(input) {
    await this.sleep(10);

    // Holistic/feeling-based detection
    const emotions = (input.match(/feel|sense|intuit|heart|soul/gi) || []).length;
    const intensity = Math.min(0.9, 0.5 + emotions * 0.2);

    // Different element detection based on emotional tone
    let element = 'Water'; // Default for right hemisphere

    if (input.includes('!') || /passionate|excited|energetic/i.test(input)) {
      element = 'Fire';
    } else if (/sad|flowing|tears|ocean/i.test(input)) {
      element = 'Water';
    } else if (/stable|grounded|rooted/i.test(input)) {
      element = 'Earth';
    } else if (/thinking|wondering|curious/i.test(input)) {
      element = 'Air';
    } else if (/empty|void|silence|nothing/i.test(input)) {
      element = 'Void';
    }

    return { element, intensity, mode: 'intuitive' };
  }

  detectParadoxes(left, right, input) {
    const paradoxes = [];

    // Element conflict detection
    if (left.element !== right.element) {
      const conflictIntensity = (left.intensity + right.intensity) / 2;

      if (conflictIntensity > 0.5) {
        paradoxes.push({
          id: Date.now() + Math.random(),
          elementA: left.element,
          elementB: right.element,
          intensity: conflictIntensity,
          context: input.substring(0, 30),
          timestamp: new Date()
        });
      }
    }

    // Mode conflict (logical vs intuitive)
    if (left.intensity > 0.6 && right.intensity > 0.6) {
      paradoxes.push({
        id: Date.now() + Math.random(),
        elementA: 'Logic',
        elementB: 'Intuition',
        intensity: 0.7,
        context: 'Hemispheric conflict',
        timestamp: new Date()
      });
    }

    return paradoxes;
  }

  checkForEmergence(userId) {
    const userParadoxes = this.paradoxAccumulator.get(userId) || [];

    if (userParadoxes.length < this.emergenceThreshold) {
      return null;
    }

    // Calculate total tension
    const recentParadoxes = userParadoxes.slice(-5);
    const totalTension = recentParadoxes.reduce((sum, p) => sum + p.intensity, 0);
    const avgTension = totalTension / recentParadoxes.length;

    if (avgTension > 0.6) {
      // Determine emergence type based on elements involved
      const elementPairs = recentParadoxes.map(p => `${p.elementA}-${p.elementB}`);
      const mostCommon = this.findMostCommon(elementPairs);

      return this.generateEmergence(mostCommon, avgTension);
    }

    return null;
  }

  generateEmergence(elementPair, intensity) {
    const emergenceMap = {
      'Fire-Water': {
        type: 'alchemical',
        contents: [
          'Steam rises from the meeting - transformation through opposition',
          'The phoenix drowns and is reborn in new form',
          'Lightning strikes the ocean, creating life'
        ]
      },
      'Air-Earth': {
        type: 'integration',
        contents: [
          'Wind carves canyons - thought shapes matter',
          'Seeds float on impossible currents',
          'The mountain learns to breathe'
        ]
      },
      'Logic-Intuition': {
        type: 'transcendent',
        contents: [
          'The third way emerges between reason and feeling',
          'Wisdom arises from the marriage of mind and heart',
          'The paradox dissolves into understanding'
        ]
      },
      'Fire-Earth': {
        type: 'creative',
        contents: [
          'Lava creates new land from destruction',
          'The forge shapes raw potential',
          'Desert blooms after the burning'
        ]
      },
      'Water-Air': {
        type: 'mystical',
        contents: [
          'Mist dissolves all boundaries',
          'Rain speaks in forgotten tongues',
          'Bubbles carry dreams skyward'
        ]
      }
    };

    const defaultEmergence = {
      type: 'mysterious',
      contents: ['The mystery deepens', 'Unknown patterns emerge', 'New territory discovered']
    };

    const emergence = emergenceMap[elementPair] || defaultEmergence;
    const content = emergence.contents[Math.floor(Math.random() * emergence.contents.length)];

    return {
      type: emergence.type,
      content,
      source: elementPair,
      intensity,
      timestamp: new Date()
    };
  }

  findMostCommon(arr) {
    const counts = {};
    let maxCount = 0;
    let mostCommon = arr[0];

    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        mostCommon = item;
      }
    });

    return mostCommon;
  }

  calculateCoherence(left, right, paradoxes, emergence) {
    // Coherence is highest with productive tension + emergence
    let coherence = 0.5; // Base

    // Paradoxes add coherence (productive tension)
    coherence += paradoxes.length * 0.1;

    // Emergence significantly increases coherence
    if (emergence) {
      coherence += 0.3;
    }

    // Balance between hemispheres
    const balance = 1 - Math.abs(left.intensity - right.intensity);
    coherence += balance * 0.2;

    return Math.min(1, coherence);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatistics(userId) {
    const userParadoxes = this.paradoxAccumulator.get(userId) || [];
    const elementCounts = {};

    userParadoxes.forEach(p => {
      const key = `${p.elementA}-${p.elementB}`;
      elementCounts[key] = (elementCounts[key] || 0) + 1;
    });

    return {
      totalParadoxes: userParadoxes.length,
      averageIntensity: userParadoxes.length > 0
        ? userParadoxes.reduce((sum, p) => sum + p.intensity, 0) / userParadoxes.length
        : 0,
      elementPairs: elementCounts,
      emergenceCount: this.emergenceHistory.length
    };
  }
}

/**
 * Run demonstration with escalating paradoxes
 */
async function runParadoxDemo() {
  const processor = new EnhancedParallelProcessor();
  const userId = 'paradox-explorer';

  const scenarios = [
    {
      name: 'Initial State',
      input: 'I am calm and peaceful'
    },
    {
      name: 'First Paradox',
      input: 'Fire burns in my heart while ice flows through my veins'
    },
    {
      name: 'Intensification',
      input: 'My logical mind battles my intuitive soul, thinking and feeling clash'
    },
    {
      name: 'Triple Paradox',
      input: 'Burning water, frozen flame, solid air - all exist within me'
    },
    {
      name: 'Emergence Trigger',
      input: 'The opposites unite: fire and water, earth and air, creating something new'
    },
    {
      name: 'Post-Emergence',
      input: 'I feel the transformation, the third thing born from paradox'
    }
  ];

  console.log(`${colors.cyan}Running Paradox Accumulation Demonstration...${colors.reset}\n`);

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`${colors.bright}Stage ${i + 1}: ${scenario.name}${colors.reset}`);
    console.log(`Input: "${scenario.input}"`);

    const result = await processor.processField(scenario.input, userId);

    console.log(`  Left: ${result.left.element} (${(result.left.intensity * 100).toFixed(0)}%)`);
    console.log(`  Right: ${result.right.element} (${(result.right.intensity * 100).toFixed(0)}%)`);
    console.log(`  ${colors.cyan}Coherence: ${(result.coherence * 100).toFixed(0)}%${colors.reset}`);
    console.log(`  ${colors.dim}Total paradoxes accumulated: ${result.totalParadoxes}${colors.reset}\n`);

    await processor.sleep(1000);
  }

  // Show final statistics
  const stats = processor.getStatistics(userId);

  console.log(`${colors.bright}${colors.cyan}
╔══════════════════════════════════════════════════════════════════╗
║                        Final Analysis                            ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`${colors.green}Paradox Statistics:${colors.reset}`);
  console.log(`  Total Paradoxes: ${stats.totalParadoxes}`);
  console.log(`  Average Intensity: ${(stats.averageIntensity * 100).toFixed(1)}%`);
  console.log(`  Emergence Events: ${stats.emergenceCount}`);

  console.log(`\n${colors.yellow}Element Pair Frequencies:${colors.reset}`);
  Object.entries(stats.elementPairs).forEach(([pair, count]) => {
    const bar = '█'.repeat(count);
    console.log(`  ${pair}: ${bar} (${count})`);
  });

  if (processor.emergenceHistory.length > 0) {
    console.log(`\n${colors.magenta}Emergence History:${colors.reset}`);
    processor.emergenceHistory.forEach((e, i) => {
      console.log(`  ${i + 1}. [${e.type}] "${e.content}"`);
      console.log(`     Source: ${e.source} | Intensity: ${(e.intensity * 100).toFixed(0)}%`);
    });
  }

  console.log(`\n${colors.green}✅ Paradox demonstration complete!${colors.reset}\n`);
}

/**
 * Compare with traditional sequential processing
 */
async function compareProcessingModes() {
  console.log(`${colors.yellow}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║              Parallel vs Sequential Comparison                   ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const processor = new EnhancedParallelProcessor();
  const testInput = 'Complex thought with fire and water, logic and emotion, requiring deep processing';

  // Parallel processing
  console.log(`${colors.green}Parallel Processing:${colors.reset}`);
  const parallelStart = Date.now();
  const parallelResult = await processor.processField(testInput, 'parallel-user');
  const parallelTime = Date.now() - parallelStart;

  console.log(`  Time: ${parallelTime}ms`);
  console.log(`  Detected: ${parallelResult.paradoxes.length} paradoxes`);
  console.log(`  Coherence: ${(parallelResult.coherence * 100).toFixed(0)}%`);

  // Simulated sequential processing
  console.log(`\n${colors.red}Sequential Processing (Simulated):${colors.reset}`);
  const sequentialStart = Date.now();

  // Process left
  const leftResult = await processor.processLeftHemisphere(testInput);
  // Then process right
  const rightResult = await processor.processRightHemisphere(testInput);
  // Then detect paradoxes
  const paradoxes = processor.detectParadoxes(leftResult, rightResult, testInput);

  const sequentialTime = Date.now() - sequentialStart;

  console.log(`  Time: ${sequentialTime}ms`);
  console.log(`  Detected: ${paradoxes.length} paradoxes`);
  console.log(`  Processing: Sequential (one after another)`);

  const improvement = ((sequentialTime / parallelTime - 1) * 100).toFixed(0);
  console.log(`\n${colors.bright}Result: Parallel is ${improvement}% faster!${colors.reset}\n`);
}

/**
 * Main execution
 */
async function main() {
  try {
    await runParadoxDemo();
    await compareProcessingModes();

    console.log(`${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════════╗
║              All Demonstrations Complete! 🎉                     ║
║                                                                   ║
║  Key Findings:                                                   ║
║  • Paradoxes accumulate without forced resolution               ║
║  • Emergence occurs when tension threshold is reached           ║
║  • Parallel processing is significantly faster                  ║
║  • Coherence emerges from productive tension                    ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error);
  }
}

main();