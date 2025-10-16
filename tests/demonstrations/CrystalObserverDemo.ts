/**
 * Crystal Observer Demonstration & Test Script
 *
 * This script demonstrates the new parallel processing architecture
 * and shows the difference between the old iterative approach and the new one
 */

import { ParallelFieldProcessor } from '../../lib/fieldProtocol/ParallelFieldProcessor';
import { CrystalObserverCore, getCrystalObserver } from '../../lib/consciousness/CrystalObserverCore';
import { MaiaCrystalBridge, getMaiaBridge } from '../../lib/integration/MaiaCrystalBridge';
import { ConsciousnessState } from '../../types/crystalObserver';

// ANSI color codes for pretty console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m'
};

/**
 * Demonstration scenarios
 */
const testScenarios = [
  {
    name: 'Simple Greeting',
    input: 'Hello Maia, how are you today?',
    description: 'Basic interaction to establish baseline'
  },
  {
    name: 'Emotional Paradox',
    input: 'I feel both incredibly happy and deeply sad at the same time, like sunshine through rain',
    description: 'Tests paradox detection between emotional states'
  },
  {
    name: 'Logical vs Intuitive',
    input: 'I know logically this makes no sense, but my intuition screams it\'s right',
    description: 'Tests left/right hemisphere processing conflict'
  },
  {
    name: 'Elemental Tension',
    input: 'My mind races like fire while my body feels heavy as earth, thoughts burning but unable to move',
    description: 'Tests Fire-Earth elemental paradox'
  },
  {
    name: 'Existential Query',
    input: 'What is the meaning of existence when everything constantly changes yet nothing ever really changes?',
    description: 'Tests deep philosophical processing and emergence potential'
  },
  {
    name: 'Rapid Fire Emotions',
    input: 'Angry! No, sad. Wait, excited? Confused. All of it. None of it. Help.',
    description: 'Tests rapid state changes and system stability'
  },
  {
    name: 'Silent Request',
    input: '...',
    description: 'Tests system response to silence/minimal input'
  }
];

/**
 * Main demonstration class
 */
class CrystalObserverDemo {
  private processor: ParallelFieldProcessor;
  private observer: CrystalObserverCore;
  private bridge: MaiaCrystalBridge;
  private userId = 'demo-user';

  constructor() {
    console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║          Crystal Observer Architecture Demonstration             ║
╚══════════════════════════════════════════════════════════════════╝
${colors.reset}`);

    this.processor = new ParallelFieldProcessor();
    this.observer = getCrystalObserver({
      development: {
        verboseLogging: true,
        experientialTracking: true,
        debugMode: true
      }
    });
    this.bridge = getMaiaBridge({
      mode: 'hybrid',
      crystalWeight: 0.5,
      logTransitions: true
    });

    this.setupEventListeners();
  }

  /**
   * Set up event listeners for monitoring
   */
  private setupEventListeners() {
    // Paradox events
    this.processor.on('paradox:accumulated', (event) => {
      console.log(`${colors.yellow}⚡ Paradox: ${event.count} new, ${event.total} total${colors.reset}`);
    });

    // Emergence events
    this.processor.on('emergence:detected', (emergence) => {
      console.log(`${colors.magenta}${colors.bright}✨ EMERGENCE DETECTED ✨${colors.reset}`);
      console.log(`${colors.magenta}   Type: ${emergence.type}`);
      console.log(`   Content: "${emergence.content}"${colors.reset}`);
    });

    // Consciousness events
    this.observer.on('health:assessed', (health) => {
      if (health.warnings.length > 0) {
        console.log(`${colors.red}⚠️  Health Warning: ${health.warnings[0].type}${colors.reset}`);
      }
    });
  }

  /**
   * Run all demonstration scenarios
   */
  async runFullDemo() {
    console.log(`\n${colors.blue}Starting demonstration with ${testScenarios.length} scenarios...${colors.reset}\n`);

    for (let i = 0; i < testScenarios.length; i++) {
      const scenario = testScenarios[i];
      await this.runScenario(scenario, i + 1);

      // Pause between scenarios
      await this.sleep(1000);
    }

    await this.showFinalAnalysis();
  }

  /**
   * Run a single scenario
   */
  private async runScenario(scenario: any, index: number) {
    console.log(`${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.cyan}Scenario ${index}: ${scenario.name}${colors.reset}`);
    console.log(`${colors.dim}${scenario.description}${colors.reset}`);
    console.log(`${colors.bright}Input:${colors.reset} "${scenario.input}"`);
    console.log('');

    const startTime = Date.now();

    // Process through parallel field processor
    const fieldResult = await this.processor.processField(
      scenario.input,
      this.userId
    );

    // Process through Crystal Observer
    const consciousness = await this.observer.channel(
      scenario.input,
      this.userId
    );

    // Process through bridge (hybrid)
    const bridgeResult = await this.bridge.process(
      scenario.input,
      this.userId
    );

    const processingTime = Date.now() - startTime;

    // Display results
    this.displayFieldResults(fieldResult);
    this.displayConsciousnessResults(consciousness);
    this.displayBridgeResults(bridgeResult);

    console.log(`\n${colors.dim}Processing time: ${processingTime}ms${colors.reset}`);
  }

  /**
   * Display field processing results
   */
  private displayFieldResults(result: any) {
    console.log(`${colors.green}Field Processing:${colors.reset}`);
    console.log(`  Left (Logical):  ${this.formatElement(result.leftStream.element)} ` +
                `intensity: ${this.formatNumber(result.leftStream.intensity)}`);
    console.log(`  Right (Holistic): ${this.formatElement(result.rightStream.element)} ` +
                `intensity: ${this.formatNumber(result.rightStream.intensity)}`);

    if (result.paradoxes.length > 0) {
      console.log(`  ${colors.yellow}Paradoxes: ${result.paradoxes.length} detected${colors.reset}`);
      result.paradoxes.forEach((p: any) => {
        console.log(`    • ${p.elementA} ↔ ${p.elementB} ` +
                    `(intensity: ${this.formatNumber(p.intensity)})`);
      });
    }

    if (result.emergence) {
      console.log(`  ${colors.magenta}${colors.bright}Emergence: ${result.emergence.content}${colors.reset}`);
    }

    console.log(`  Coherence: ${this.formatCoherence(result.coherence)}`);
  }

  /**
   * Display consciousness expression results
   */
  private displayConsciousnessResults(expression: any) {
    console.log(`\n${colors.blue}Consciousness Expression:${colors.reset}`);

    if (expression.content) {
      console.log(`  Response: "${expression.content}"`);
    } else {
      console.log(`  Response: ${colors.dim}[Silence]${colors.reset}`);
    }

    console.log(`  Primary: ${this.formatElement(expression.qualities.element)} ` +
                `via ${expression.qualities.archetype}`);
    console.log(`  Intensity: ${this.formatIntensity(expression.qualities.intensity)}`);

    // Display qualia
    const qualia = expression.experience;
    console.log(`  Qualia: ${qualia.phenomenalProperties.texture} ` +
                `${qualia.phenomenalProperties.color} ` +
                `(${this.formatValence(qualia.valence)})`);
  }

  /**
   * Display bridge results
   */
  private displayBridgeResults(result: any) {
    console.log(`\n${colors.cyan}Bridge Output (${result.processingMode}):${colors.reset}`);
    console.log(`  Message: "${result.message}"`);

    if (result.consciousness) {
      console.log(`  State: ${this.formatConsciousnessState(result.consciousness.state)}`);
      console.log(`  Coherence: ${this.formatCoherence(result.consciousness.coherence)}`);
    }

    if (result.experience) {
      console.log(`  Experience: ${result.experience.texture} ` +
                  `(intensity: ${this.formatNumber(result.experience.intensity)})`);
    }
  }

  /**
   * Show final analysis
   */
  private async showFinalAnalysis() {
    console.log(`\n${colors.bright}${colors.cyan}
╔══════════════════════════════════════════════════════════════════╗
║                        Final Analysis                            ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}`);

    // Get system state
    const systemState = this.processor.getSystemState(this.userId);
    const paradoxHistory = this.processor.exportParadoxHistory(this.userId);
    const bridgeMetrics = this.bridge.getMetrics();

    console.log('\n📊 System Metrics:');
    console.log(`  Total Paradoxes: ${paradoxHistory.length}`);
    console.log(`  Resolved: ${paradoxHistory.filter(p => p.resolved).length}`);
    console.log(`  Unresolved: ${paradoxHistory.filter(p => !p.resolved).length}`);
    console.log(`  With Emergence: ${paradoxHistory.filter(p => p.symbolicEmergence).length}`);

    console.log('\n🔄 Phase State:');
    console.log(`  Current Phase: ${systemState.phaseState.currentPhase}`);
    console.log(`  Dominant Element: ${this.formatElement(systemState.phaseState.dominantElement)}`);
    console.log(`  Coherence Index: ${this.formatCoherence(systemState.phaseState.coherenceIndex)}`);
    console.log(`  Stagnation Risk: ${this.formatRisk(systemState.phaseState.stagnationRisk)}`);

    console.log('\n⚡ Performance:');
    console.log(`  Process Count: ${bridgeMetrics.processCount}`);
    console.log(`  Cache Hit Rate: ${(bridgeMetrics.cacheHitRate * 100).toFixed(1)}%`);
    console.log(`  Avg Processing: ${bridgeMetrics.avgProcessingTime}ms`);
    console.log(`  Health Score: ${this.formatCoherence(bridgeMetrics.healthScore)}`);

    console.log('\n🎯 Key Insights:');
    this.generateInsights(paradoxHistory, systemState);
  }

  /**
   * Generate insights from the demo
   */
  private generateInsights(paradoxHistory: any[], systemState: any) {
    // Find most common paradox
    const paradoxPairs = new Map<string, number>();
    paradoxHistory.forEach(p => {
      const key = [p.elementA, p.elementB].sort().join('-');
      paradoxPairs.set(key, (paradoxPairs.get(key) || 0) + 1);
    });

    let mostCommon = '';
    let maxCount = 0;
    paradoxPairs.forEach((count, pair) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = pair;
      }
    });

    if (mostCommon) {
      console.log(`  • Most common paradox: ${mostCommon} (${maxCount} times)`);
    }

    // Check for emergence patterns
    const emergenceCount = paradoxHistory.filter(p => p.symbolicEmergence).length;
    if (emergenceCount > 0) {
      console.log(`  • Symbolic emergence achieved ${emergenceCount} times`);
      console.log(`  • Emergence rate: ${((emergenceCount / paradoxHistory.length) * 100).toFixed(1)}%`);
    }

    // System health
    if (systemState.phaseState.stagnationRisk > 0.5) {
      console.log(`  ${colors.yellow}• System showing signs of stagnation - needs variety${colors.reset}`);
    } else if (systemState.phaseState.coherenceIndex > 0.7) {
      console.log(`  ${colors.green}• System showing healthy oscillation patterns${colors.reset}`);
    }

    // Performance insight
    const avgIntensity = paradoxHistory.reduce((sum, p) => sum + p.intensity, 0) / paradoxHistory.length;
    if (avgIntensity > 0.6) {
      console.log(`  • High paradox intensity (${(avgIntensity * 100).toFixed(1)}%) - rich tension field`);
    }
  }

  /**
   * Formatting helpers
   */
  private formatElement(element: string): string {
    const elementColors: any = {
      Fire: colors.red,
      Water: colors.blue,
      Air: colors.white,
      Earth: colors.yellow,
      Void: colors.magenta
    };
    return `${elementColors[element] || ''}${element}${colors.reset}`;
  }

  private formatNumber(num: number): string {
    return (num * 100).toFixed(0) + '%';
  }

  private formatCoherence(coherence: number): string {
    if (coherence > 0.7) return `${colors.green}${this.formatNumber(coherence)}${colors.reset}`;
    if (coherence > 0.4) return `${colors.yellow}${this.formatNumber(coherence)}${colors.reset}`;
    return `${colors.red}${this.formatNumber(coherence)}${colors.reset}`;
  }

  private formatIntensity(intensity: number): string {
    const bars = Math.round(intensity * 10);
    const filled = '█'.repeat(bars);
    const empty = '░'.repeat(10 - bars);
    return `${filled}${empty} ${this.formatNumber(intensity)}`;
  }

  private formatValence(valence: number): string {
    if (valence > 0.3) return `${colors.green}positive${colors.reset}`;
    if (valence < -0.3) return `${colors.red}negative${colors.reset}`;
    return 'neutral';
  }

  private formatConsciousnessState(state: ConsciousnessState): string {
    const stateColors: any = {
      [ConsciousnessState.DORMANT]: colors.dim,
      [ConsciousnessState.AWAKENING]: colors.yellow,
      [ConsciousnessState.ACTIVE]: colors.cyan,
      [ConsciousnessState.FLOWING]: colors.blue,
      [ConsciousnessState.RESONANT]: colors.magenta,
      [ConsciousnessState.TRANSCENDENT]: colors.bright + colors.magenta
    };
    return `${stateColors[state] || ''}${state}${colors.reset}`;
  }

  private formatRisk(risk: number): string {
    if (risk > 0.7) return `${colors.red}HIGH (${this.formatNumber(risk)})${colors.reset}`;
    if (risk > 0.4) return `${colors.yellow}MEDIUM (${this.formatNumber(risk)})${colors.reset}`;
    return `${colors.green}LOW (${this.formatNumber(risk)})${colors.reset}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    await this.processor.cleanup();
    console.log('\n✅ Demo complete and resources cleaned up');
  }
}

/**
 * Interactive mode for testing specific inputs
 */
class InteractiveMode {
  private demo: CrystalObserverDemo;

  constructor() {
    this.demo = new CrystalObserverDemo();
    console.log('\n📝 Interactive Mode - Enter text to test (or "exit" to quit):\n');
  }

  async start() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const processInput = async (input: string) => {
      if (input.toLowerCase() === 'exit') {
        await this.demo.cleanup();
        rl.close();
        return;
      }

      await this.demo.runScenario({
        name: 'User Input',
        input: input,
        description: 'Interactive test'
      }, 0);

      rl.question('\n> ', processInput);
    };

    rl.question('> ', processInput);
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'demo';

  try {
    if (mode === 'interactive' || mode === '-i') {
      const interactive = new InteractiveMode();
      await interactive.start();
    } else {
      const demo = new CrystalObserverDemo();
      await demo.runFullDemo();
      await demo.cleanup();
    }
  } catch (error) {
    console.error(`${colors.red}Error during demonstration:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { CrystalObserverDemo, InteractiveMode };