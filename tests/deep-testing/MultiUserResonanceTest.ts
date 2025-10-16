/**
 * Multi-User Resonance Test for Crystal Observer
 *
 * Tests collective field phenomena:
 * - Synchronicity detection across users
 * - Morphic resonance patterns
 * - Paradox intensity synchronization
 * - Collective coherence emergence
 */

import { EventEmitter } from 'events';

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

/**
 * User interaction pattern
 */
interface UserPattern {
  userId: string;
  personality: 'analytical' | 'emotional' | 'balanced' | 'chaotic';
  elementalAffinity: string[];
  interactionFrequency: number; // interactions per minute
  paradoxTendency: number; // 0-1: likelihood to generate paradoxes
}

/**
 * Resonance event between users
 */
interface ResonanceEvent {
  timestamp: Date;
  participants: string[];
  type: 'synchronicity' | 'morphic' | 'collective' | 'emergence';
  intensity: number;
  content?: string;
}

/**
 * Collective field state
 */
interface CollectiveFieldState {
  globalCoherence: number;
  dominantElements: Map<string, number>;
  activePatterns: Set<string>;
  resonanceMatrix: Map<string, Map<string, number>>; // User-to-user resonance
  synchronicityRate: number;
  fieldWeather: 'calm' | 'flowing' | 'turbulent' | 'stormy' | 'chaotic';
}

/**
 * Multi-User Resonance Test
 */
export class MultiUserResonanceTest extends EventEmitter {
  private users: Map<string, UserPattern>;
  private processors: Map<string, any>; // User-specific processors
  private collectiveField: CollectiveFieldState;
  private resonanceEvents: ResonanceEvent[];
  private isRunning: boolean = false;
  private startTime: Date;
  private interactionCount: number = 0;

  constructor() {
    super();
    this.users = new Map();
    this.processors = new Map();
    this.resonanceEvents = [];
    this.startTime = new Date();

    this.collectiveField = {
      globalCoherence: 0.5,
      dominantElements: new Map(),
      activePatterns: new Set(),
      resonanceMatrix: new Map(),
      synchronicityRate: 0,
      fieldWeather: 'calm'
    };
  }

  /**
   * Run multi-user resonance test
   */
  async run(userCount: number = 20, durationMinutes: number = 30): Promise<void> {
    console.log(`${colors.magenta}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║                 Multi-User Resonance Test                        ║
║                                                                   ║
║  Users: ${userCount}                                                    ║
║  Duration: ${durationMinutes} minutes                                         ║
║  Testing: Collective field phenomena                             ║
╚══════════════════════════════════════════════════════════════════╝
${colors.reset}\n`);

    this.isRunning = true;

    // Initialize users
    this.initializeUsers(userCount);

    // Start collective field monitoring
    this.startFieldMonitoring();

    // Run simulation
    const endTime = Date.now() + (durationMinutes * 60000);
    let minute = 0;

    while (Date.now() < endTime && this.isRunning) {
      minute++;
      console.log(`\n${colors.cyan}Minute ${minute}/${durationMinutes}${colors.reset}`);

      // Simulate user interactions
      await this.simulateMinute();

      // Check for resonance events
      this.detectResonanceEvents();

      // Update collective field
      this.updateCollectiveField();

      // Display real-time metrics
      this.displayMetrics();

      // Wait for next minute
      await this.sleep(1000); // Accelerated for testing
    }

    // Generate final report
    this.generateReport();
  }

  /**
   * Initialize user patterns
   */
  private initializeUsers(count: number): void {
    const personalities = ['analytical', 'emotional', 'balanced', 'chaotic'];
    const elements = ['Fire', 'Water', 'Air', 'Earth', 'Void'];

    for (let i = 0; i < count; i++) {
      const userId = `user-${i}`;
      const personality = personalities[i % personalities.length] as any;

      // Create user pattern
      const pattern: UserPattern = {
        userId,
        personality,
        elementalAffinity: this.generateAffinities(personality, elements),
        interactionFrequency: 0.5 + Math.random() * 2, // 0.5-2.5 per minute
        paradoxTendency: personality === 'chaotic' ? 0.8 :
                         personality === 'balanced' ? 0.5 :
                         personality === 'emotional' ? 0.6 : 0.3
      };

      this.users.set(userId, pattern);
      this.processors.set(userId, this.createProcessor(pattern));

      // Initialize resonance matrix
      this.collectiveField.resonanceMatrix.set(userId, new Map());
    }

    console.log(`Initialized ${count} users with diverse patterns`);
  }

  /**
   * Generate elemental affinities based on personality
   */
  private generateAffinities(personality: string, elements: string[]): string[] {
    const affinities = [];

    switch (personality) {
      case 'analytical':
        affinities.push('Air', 'Earth');
        break;
      case 'emotional':
        affinities.push('Water', 'Fire');
        break;
      case 'balanced':
        affinities.push('Earth', 'Water');
        break;
      case 'chaotic':
        affinities.push('Fire', 'Void');
        break;
    }

    // Add random third affinity
    const remaining = elements.filter(e => !affinities.includes(e));
    if (remaining.length > 0) {
      affinities.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }

    return affinities;
  }

  /**
   * Create processor for user pattern
   */
  private createProcessor(pattern: UserPattern): any {
    return {
      pattern,
      paradoxHistory: [],
      lastInteraction: Date.now(),

      processField: async (input: string) => {
        // Simulate processing based on user pattern
        const hasParadox = Math.random() < pattern.paradoxTendency;
        const element = pattern.elementalAffinity[
          Math.floor(Math.random() * pattern.elementalAffinity.length)
        ];

        const result = {
          userId: pattern.userId,
          element,
          coherence: 0.5 + Math.random() * 0.5,
          paradox: hasParadox ? {
            elements: [element, this.getOpposingElement(element)],
            intensity: Math.random()
          } : null,
          timestamp: new Date()
        };

        if (hasParadox) {
          this.paradoxHistory.push(result.paradox);
        }

        this.lastInteraction = Date.now();
        return result;
      }
    };
  }

  /**
   * Simulate one minute of interactions
   */
  private async simulateMinute(): Promise<void> {
    const interactions = [];

    // Generate interactions for each user
    for (const [userId, pattern] of this.users) {
      const processor = this.processors.get(userId);

      // Check if user interacts this minute
      if (Math.random() < pattern.interactionFrequency / 2) {
        const input = this.generateUserInput(pattern);
        const result = await processor.processField(input);
        interactions.push(result);
        this.interactionCount++;
      }
    }

    // Process interactions for collective effects
    await this.processCollectiveInteractions(interactions);
  }

  /**
   * Generate input based on user pattern
   */
  private generateUserInput(pattern: UserPattern): string {
    const templates = {
      analytical: [
        'I think therefore I process information',
        'Logic dictates the patterns I see',
        'Analyzing the structure of thoughts'
      ],
      emotional: [
        'Feeling deeply into the experience',
        'My heart knows what my mind cannot grasp',
        'Emotions flow like water through me'
      ],
      balanced: [
        'Thinking and feeling in harmony',
        'Mind and heart working together',
        'Balance between logic and intuition'
      ],
      chaotic: [
        'Fire and ice, order and chaos!',
        'Everything and nothing simultaneously',
        'Paradox within paradox within paradox'
      ]
    };

    const userTemplates = templates[pattern.personality];
    const base = userTemplates[Math.floor(Math.random() * userTemplates.length)];

    // Add elemental flavor
    const element = pattern.elementalAffinity[
      Math.floor(Math.random() * pattern.elementalAffinity.length)
    ];

    return `${base} [${element} resonance]`;
  }

  /**
   * Process collective interactions
   */
  private async processCollectiveInteractions(interactions: any[]): Promise<void> {
    if (interactions.length < 2) return;

    // Check for simultaneous similar patterns (synchronicity)
    for (let i = 0; i < interactions.length - 1; i++) {
      for (let j = i + 1; j < interactions.length; j++) {
        const resonance = this.calculateResonance(interactions[i], interactions[j]);

        if (resonance > 0.7) {
          this.recordResonance(
            interactions[i].userId,
            interactions[j].userId,
            resonance
          );

          // Check for synchronicity
          if (interactions[i].element === interactions[j].element &&
              Math.abs(interactions[i].timestamp.getTime() - interactions[j].timestamp.getTime()) < 1000) {
            this.resonanceEvents.push({
              timestamp: new Date(),
              participants: [interactions[i].userId, interactions[j].userId],
              type: 'synchronicity',
              intensity: resonance,
              content: `Simultaneous ${interactions[i].element} activation`
            });

            console.log(`  ${colors.magenta}✨ Synchronicity: ${interactions[i].userId} ↔ ${interactions[j].userId}${colors.reset}`);
          }
        }
      }
    }

    // Check for morphic resonance (pattern spreading)
    this.checkMorphicResonance(interactions);

    // Update element dominance
    interactions.forEach(interaction => {
      const current = this.collectiveField.dominantElements.get(interaction.element) || 0;
      this.collectiveField.dominantElements.set(interaction.element, current + 1);
    });
  }

  /**
   * Calculate resonance between two interactions
   */
  private calculateResonance(a: any, b: any): number {
    let resonance = 0;

    // Element match
    if (a.element === b.element) resonance += 0.3;

    // Coherence similarity
    const coherenceDiff = Math.abs(a.coherence - b.coherence);
    resonance += (1 - coherenceDiff) * 0.3;

    // Paradox alignment
    if (a.paradox && b.paradox) {
      const intensityDiff = Math.abs(a.paradox.intensity - b.paradox.intensity);
      resonance += (1 - intensityDiff) * 0.4;
    }

    return Math.min(1, resonance);
  }

  /**
   * Record resonance between users
   */
  private recordResonance(userA: string, userB: string, resonance: number): void {
    const matrixA = this.collectiveField.resonanceMatrix.get(userA);
    if (matrixA) {
      const current = matrixA.get(userB) || 0;
      matrixA.set(userB, current * 0.9 + resonance * 0.1); // Exponential average
    }

    const matrixB = this.collectiveField.resonanceMatrix.get(userB);
    if (matrixB) {
      const current = matrixB.get(userA) || 0;
      matrixB.set(userA, current * 0.9 + resonance * 0.1);
    }
  }

  /**
   * Check for morphic resonance patterns
   */
  private checkMorphicResonance(interactions: any[]): void {
    // Count element frequencies
    const elementCounts = new Map<string, number>();
    interactions.forEach(i => {
      elementCounts.set(i.element, (elementCounts.get(i.element) || 0) + 1);
    });

    // Check if one element dominates (morphic field forming)
    const total = interactions.length;
    elementCounts.forEach((count, element) => {
      if (count > total * 0.6) { // 60% threshold
        this.resonanceEvents.push({
          timestamp: new Date(),
          participants: interactions.filter(i => i.element === element).map(i => i.userId),
          type: 'morphic',
          intensity: count / total,
          content: `Morphic field: ${element} dominant`
        });

        console.log(`  ${colors.blue}🌀 Morphic resonance: ${element} field forming (${count}/${total} users)${colors.reset}`);

        // Add to active patterns
        this.collectiveField.activePatterns.add(`morphic-${element}`);
      }
    });
  }

  /**
   * Detect resonance events
   */
  private detectResonanceEvents(): void {
    // Check for collective coherence spike
    const avgCoherence = this.calculateGlobalCoherence();

    if (avgCoherence > 0.8) {
      this.resonanceEvents.push({
        timestamp: new Date(),
        participants: Array.from(this.users.keys()),
        type: 'collective',
        intensity: avgCoherence,
        content: 'Collective coherence spike'
      });

      console.log(`  ${colors.green}🌟 Collective coherence spike: ${(avgCoherence * 100).toFixed(1)}%${colors.reset}`);
    }

    // Check for emergence (complex pattern from simple interactions)
    if (this.collectiveField.activePatterns.size >= 3 && Math.random() > 0.7) {
      const patterns = Array.from(this.collectiveField.activePatterns).join(' + ');
      this.resonanceEvents.push({
        timestamp: new Date(),
        participants: Array.from(this.users.keys()).slice(0, 10), // First 10 users
        type: 'emergence',
        intensity: 0.9,
        content: `Emergence from: ${patterns}`
      });

      console.log(`  ${colors.magenta}${colors.bright}✨ EMERGENCE: New pattern from ${patterns}${colors.reset}`);
    }
  }

  /**
   * Calculate global coherence
   */
  private calculateGlobalCoherence(): number {
    let totalResonance = 0;
    let pairCount = 0;

    this.collectiveField.resonanceMatrix.forEach((userMap, userA) => {
      userMap.forEach((resonance, userB) => {
        totalResonance += resonance;
        pairCount++;
      });
    });

    return pairCount > 0 ? totalResonance / pairCount : 0.5;
  }

  /**
   * Update collective field state
   */
  private updateCollectiveField(): void {
    // Update global coherence
    this.collectiveField.globalCoherence = this.calculateGlobalCoherence();

    // Calculate synchronicity rate
    const recentSync = this.resonanceEvents
      .filter(e => e.type === 'synchronicity')
      .filter(e => Date.now() - e.timestamp.getTime() < 60000).length;

    this.collectiveField.synchronicityRate = recentSync;

    // Update field weather based on patterns
    this.updateFieldWeather();

    // Clean old patterns
    if (this.collectiveField.activePatterns.size > 10) {
      const patterns = Array.from(this.collectiveField.activePatterns);
      this.collectiveField.activePatterns.clear();
      patterns.slice(-5).forEach(p => this.collectiveField.activePatterns.add(p));
    }
  }

  /**
   * Update field weather state
   */
  private updateFieldWeather(): void {
    const coherence = this.collectiveField.globalCoherence;
    const syncRate = this.collectiveField.synchronicityRate;
    const patternCount = this.collectiveField.activePatterns.size;

    if (coherence > 0.8 && syncRate < 2) {
      this.collectiveField.fieldWeather = 'calm';
    } else if (coherence > 0.6 && syncRate < 5) {
      this.collectiveField.fieldWeather = 'flowing';
    } else if (coherence > 0.4 && syncRate < 10) {
      this.collectiveField.fieldWeather = 'turbulent';
    } else if (patternCount > 5) {
      this.collectiveField.fieldWeather = 'stormy';
    } else {
      this.collectiveField.fieldWeather = 'chaotic';
    }
  }

  /**
   * Start field monitoring
   */
  private startFieldMonitoring(): void {
    // Monitor field every 30 seconds
    setInterval(() => {
      if (!this.isRunning) return;

      // Check for field-wide patterns
      this.analyzeFieldPatterns();
    }, 30000);
  }

  /**
   * Analyze field-wide patterns
   */
  private analyzeFieldPatterns(): void {
    // Check for paradox synchronization
    const paradoxIntensities = [];

    this.processors.forEach(processor => {
      if (processor.paradoxHistory.length > 0) {
        const recent = processor.paradoxHistory.slice(-5);
        const avgIntensity = recent.reduce((sum, p) => sum + p.intensity, 0) / recent.length;
        paradoxIntensities.push(avgIntensity);
      }
    });

    if (paradoxIntensities.length > 5) {
      const variance = this.calculateVariance(paradoxIntensities);
      if (variance < 0.05) { // Low variance = synchronization
        console.log(`  ${colors.yellow}📊 Paradox intensity synchronization detected! Variance: ${variance.toFixed(4)}${colors.reset}`);
      }
    }
  }

  /**
   * Display real-time metrics
   */
  private displayMetrics(): void {
    const weather = this.getWeatherEmoji(this.collectiveField.fieldWeather);

    console.log(`  Field: ${weather} ${this.collectiveField.fieldWeather} | ` +
                `Coherence: ${(this.collectiveField.globalCoherence * 100).toFixed(1)}% | ` +
                `Sync: ${this.collectiveField.synchronicityRate}/min`);

    // Show dominant elements
    const topElements = Array.from(this.collectiveField.dominantElements.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topElements.length > 0) {
      const elements = topElements.map(([e, count]) => `${e}(${count})`).join(' ');
      console.log(`  Elements: ${elements}`);
    }
  }

  /**
   * Generate final report
   */
  private generateReport(): void {
    console.log(`\n${colors.bright}${colors.cyan}
╔══════════════════════════════════════════════════════════════════╗
║                  Multi-User Resonance Report                     ║
╚══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    // Overall statistics
    console.log(`${colors.green}Statistics:${colors.reset}`);
    console.log(`  Total Interactions: ${this.interactionCount}`);
    console.log(`  Resonance Events: ${this.resonanceEvents.length}`);
    console.log(`  Average Coherence: ${(this.collectiveField.globalCoherence * 100).toFixed(2)}%`);

    // Resonance event breakdown
    const eventTypes = new Map<string, number>();
    this.resonanceEvents.forEach(e => {
      eventTypes.set(e.type, (eventTypes.get(e.type) || 0) + 1);
    });

    console.log(`\n${colors.magenta}Resonance Events:${colors.reset}`);
    eventTypes.forEach((count, type) => {
      const emoji = this.getEventEmoji(type);
      console.log(`  ${emoji} ${type}: ${count} events`);
    });

    // Top resonant pairs
    console.log(`\n${colors.blue}Top Resonant User Pairs:${colors.reset}`);
    const topPairs = this.findTopResonantPairs();
    topPairs.slice(0, 5).forEach(([pair, resonance]) => {
      console.log(`  ${pair}: ${(resonance * 100).toFixed(1)}% resonance`);
    });

    // Synchronicity analysis
    this.analyzeSynchronicities();

    // Morphic field analysis
    this.analyzeMorphicFields();

    // Paradox synchronization
    this.analyzeParadoxSynchronization();

    // Final verdict
    this.generateVerdict();
  }

  /**
   * Find top resonant user pairs
   */
  private findTopResonantPairs(): Array<[string, number]> {
    const pairs: Array<[string, number]> = [];

    this.collectiveField.resonanceMatrix.forEach((userMap, userA) => {
      userMap.forEach((resonance, userB) => {
        if (userA < userB) { // Avoid duplicates
          pairs.push([`${userA} ↔ ${userB}`, resonance]);
        }
      });
    });

    return pairs.sort((a, b) => b[1] - a[1]);
  }

  /**
   * Analyze synchronicities
   */
  private analyzeSynchronicities(): void {
    const syncEvents = this.resonanceEvents.filter(e => e.type === 'synchronicity');

    if (syncEvents.length > 0) {
      console.log(`\n${colors.magenta}Synchronicity Analysis:${colors.reset}`);
      console.log(`  Total: ${syncEvents.length} events`);

      // Average intensity
      const avgIntensity = syncEvents.reduce((sum, e) => sum + e.intensity, 0) / syncEvents.length;
      console.log(`  Avg Intensity: ${(avgIntensity * 100).toFixed(1)}%`);

      // Most synchronized users
      const userCounts = new Map<string, number>();
      syncEvents.forEach(e => {
        e.participants.forEach(p => {
          userCounts.set(p, (userCounts.get(p) || 0) + 1);
        });
      });

      const topSync = Array.from(userCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      console.log(`  Most Synchronized Users:`);
      topSync.forEach(([user, count]) => {
        const pattern = this.users.get(user)?.personality || 'unknown';
        console.log(`    • ${user} (${pattern}): ${count} synchronicities`);
      });
    }
  }

  /**
   * Analyze morphic fields
   */
  private analyzeMorphicFields(): void {
    const morphicEvents = this.resonanceEvents.filter(e => e.type === 'morphic');

    if (morphicEvents.length > 0) {
      console.log(`\n${colors.blue}Morphic Field Analysis:${colors.reset}`);
      console.log(`  Field Formations: ${morphicEvents.length}`);

      // Count element dominance
      const elementCounts = new Map<string, number>();
      morphicEvents.forEach(e => {
        const match = e.content?.match(/(\w+) dominant/);
        if (match) {
          elementCounts.set(match[1], (elementCounts.get(match[1]) || 0) + 1);
        }
      });

      console.log(`  Dominant Elements:`);
      elementCounts.forEach((count, element) => {
        console.log(`    • ${element}: ${count} formations`);
      });
    }
  }

  /**
   * Analyze paradox synchronization
   */
  private analyzeParadoxSynchronization(): void {
    console.log(`\n${colors.yellow}Paradox Synchronization:${colors.reset}`);

    const paradoxData = [];
    this.processors.forEach(processor => {
      if (processor.paradoxHistory.length > 0) {
        const recent = processor.paradoxHistory.slice(-10);
        const avgIntensity = recent.reduce((sum, p) => sum + p.intensity, 0) / recent.length;
        paradoxData.push({
          userId: processor.pattern.userId,
          personality: processor.pattern.personality,
          avgIntensity
        });
      }
    });

    if (paradoxData.length > 5) {
      // Group by personality
      const byPersonality = new Map<string, number[]>();
      paradoxData.forEach(d => {
        if (!byPersonality.has(d.personality)) {
          byPersonality.set(d.personality, []);
        }
        byPersonality.get(d.personality)!.push(d.avgIntensity);
      });

      console.log(`  By Personality Type:`);
      byPersonality.forEach((intensities, personality) => {
        const avg = intensities.reduce((a, b) => a + b, 0) / intensities.length;
        const variance = this.calculateVariance(intensities);
        console.log(`    • ${personality}: ${(avg * 100).toFixed(1)}% avg, ` +
                   `variance: ${variance.toFixed(4)}`);
      });

      // Check for global synchronization
      const allIntensities = paradoxData.map(d => d.avgIntensity);
      const globalVariance = this.calculateVariance(allIntensities);

      if (globalVariance < 0.05) {
        console.log(`  ${colors.green}✅ Global paradox synchronization achieved! Variance: ${globalVariance.toFixed(4)}${colors.reset}`);
      } else {
        console.log(`  Global variance: ${globalVariance.toFixed(4)} (no synchronization)`);
      }
    }
  }

  /**
   * Generate final verdict
   */
  private generateVerdict(): void {
    console.log(`\n${colors.bright}${colors.cyan}═══ Collective Field Verdict ═══${colors.reset}\n`);

    let score = 0;
    const findings = [];

    // Evaluate synchronicities
    const syncCount = this.resonanceEvents.filter(e => e.type === 'synchronicity').length;
    if (syncCount > 10) {
      score += 2;
      findings.push(`${colors.green}✅ Rich synchronicity patterns (${syncCount} events)${colors.reset}`);
    } else if (syncCount > 5) {
      score += 1;
      findings.push(`${colors.yellow}→ Moderate synchronicity (${syncCount} events)${colors.reset}`);
    } else {
      findings.push(`${colors.red}⚠️  Limited synchronicity (${syncCount} events)${colors.reset}`);
    }

    // Evaluate morphic resonance
    const morphicCount = this.resonanceEvents.filter(e => e.type === 'morphic').length;
    if (morphicCount > 5) {
      score += 2;
      findings.push(`${colors.green}✅ Strong morphic field formation${colors.reset}`);
    } else if (morphicCount > 2) {
      score += 1;
      findings.push(`${colors.yellow}→ Some morphic resonance${colors.reset}`);
    } else {
      findings.push(`${colors.red}⚠️  Weak morphic fields${colors.reset}`);
    }

    // Evaluate collective coherence
    if (this.collectiveField.globalCoherence > 0.7) {
      score += 2;
      findings.push(`${colors.green}✅ High collective coherence${colors.reset}`);
    } else if (this.collectiveField.globalCoherence > 0.5) {
      score += 1;
      findings.push(`${colors.yellow}→ Moderate coherence${colors.reset}`);
    } else {
      findings.push(`${colors.red}⚠️  Low collective coherence${colors.reset}`);
    }

    // Evaluate emergence
    const emergenceCount = this.resonanceEvents.filter(e => e.type === 'emergence').length;
    if (emergenceCount > 3) {
      score += 2;
      findings.push(`${colors.green}✅ Complex emergence patterns${colors.reset}`);
    } else if (emergenceCount > 1) {
      score += 1;
      findings.push(`${colors.yellow}→ Some emergence${colors.reset}`);
    } else {
      findings.push(`${colors.red}⚠️  Limited emergence${colors.reset}`);
    }

    console.log('Findings:');
    findings.forEach(f => console.log(`  ${f}`));

    console.log(`\n${colors.bright}Score: ${score}/8${colors.reset}`);

    if (score >= 7) {
      console.log(`${colors.green}${colors.bright}🎉 EXCELLENT: Strong collective field with rich resonance patterns${colors.reset}`);
    } else if (score >= 5) {
      console.log(`${colors.cyan}✅ GOOD: Collective field shows healthy dynamics${colors.reset}`);
    } else if (score >= 3) {
      console.log(`${colors.yellow}→ MODERATE: Some collective phenomena observed${colors.reset}`);
    } else {
      console.log(`${colors.red}⚠️  WEAK: Limited collective field effects${colors.reset}`);
    }
  }

  // Helper methods
  private getOpposingElement(element: string): string {
    const oppositions = {
      'Fire': 'Water',
      'Water': 'Fire',
      'Air': 'Earth',
      'Earth': 'Air',
      'Void': 'Void'
    };
    return oppositions[element as keyof typeof oppositions] || 'Void';
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(x => Math.pow(x - avg, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  private getWeatherEmoji(weather: string): string {
    const emojis: any = {
      calm: '☀️',
      flowing: '🌊',
      turbulent: '🌪️',
      stormy: '⛈️',
      chaotic: '🌀'
    };
    return emojis[weather] || '❓';
  }

  private getEventEmoji(type: string): string {
    const emojis: any = {
      synchronicity: '✨',
      morphic: '🌀',
      collective: '🌟',
      emergence: '🎭'
    };
    return emojis[type] || '•';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default MultiUserResonanceTest;