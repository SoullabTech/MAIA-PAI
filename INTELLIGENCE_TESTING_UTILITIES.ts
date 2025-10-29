/**
 * INTELLIGENCE TESTING UTILITIES
 *
 * Comprehensive testing utilities for Intelligence Engine integration
 *
 * Includes:
 * - Mock intelligence data factories
 * - Test scenario builders
 * - Assertion helpers
 * - Mock intelligence engine
 * - Performance testing utilities
 * - Integration test helpers
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MockIntelligenceOptions {
  coherence?: number;
  transformationStage?: 'Nigredo' | 'Albedo' | 'Citrinitas' | 'Rubedo';
  awarenessLevel?: 'beginner' | 'familiar' | 'intermediate' | 'advanced' | 'master';
  awarenessScore?: number;
  activeSignatures?: Array<{
    signature: string;
    confidence: number;
    description?: string;
  }>;
  frameworkEffectiveness?: Record<string, number>;
  journeyTrajectory?: {
    direction: 'ascending' | 'descending' | 'plateauing';
    momentum: number;
    predictedNext?: string;
  };
  interventionWindows?: Array<{
    type: string;
    optimal: boolean;
    timeframe?: string;
  }>;
}

export interface TestScenarioConfig {
  name: string;
  description: string;
  userId?: string;
  intelligence: MockIntelligenceOptions;
  expectedBehavior?: string;
}

export interface PerformanceMetrics {
  duration: number;
  cacheHits: number;
  cacheMisses: number;
  retries: number;
  errors: number;
}

// ============================================================================
// MOCK DATA FACTORIES
// ============================================================================

/**
 * Create mock intelligence data with sensible defaults
 */
export function createMockIntelligence(
  options: MockIntelligenceOptions = {}
): any {
  const {
    coherence = 0.50,
    transformationStage,
    awarenessLevel = 'beginner',
    awarenessScore,
    activeSignatures = [],
    frameworkEffectiveness,
    journeyTrajectory,
    interventionWindows
  } = options;

  // Auto-determine stage from coherence if not provided
  const stage = transformationStage || getStageFromCoherence(coherence);

  // Auto-determine awareness score from level if not provided
  const score = awarenessScore !== undefined
    ? awarenessScore
    : getScoreFromLevel(awarenessLevel);

  // Default framework effectiveness
  const defaultFrameworks = frameworkEffectiveness || {
    'Polyvagal': Math.random() * 0.5 + 0.5,
    'IFS': Math.random() * 0.5 + 0.5,
    'Jung': Math.random() * 0.5 + 0.5,
    'Alchemy': Math.random() * 0.5 + 0.5,
    'Spiralogic': Math.random() * 0.5 + 0.5
  };

  // Default trajectory
  const defaultTrajectory = journeyTrajectory || {
    direction: coherence > 0.50 ? 'ascending' : 'descending',
    momentum: Math.random() * 0.5 + 0.5,
    predictedNext: getPredictedNextStage(stage)
  };

  return {
    coherence,
    transformationStage: stage,
    awarenessProfile: {
      level: awarenessLevel,
      score,
      frameworkFamiliarity: {
        alchemy: score > 50,
        spiralogic: score > 60,
        jung: score > 30,
        ifs: score > 40,
        polyvagal: score > 40
      }
    },
    activeSignatures,
    frameworkEffectiveness: defaultFrameworks,
    journeyTrajectory: defaultTrajectory,
    interventionWindows: interventionWindows || [],
    timestamp: new Date().toISOString(),
    _mock: true
  };
}

/**
 * Create critical coherence scenario (< 30%)
 */
export function createCriticalScenario(): any {
  return createMockIntelligence({
    coherence: 0.20,
    transformationStage: 'Nigredo',
    awarenessLevel: 'beginner',
    activeSignatures: [
      {
        signature: 'Complete Shutdown',
        confidence: 0.91,
        description: 'System in protective freeze state'
      },
      {
        signature: 'Polyvagal Dorsal Dominant',
        confidence: 0.87,
        description: 'Nervous system collapse detected'
      }
    ],
    frameworkEffectiveness: {
      'Polyvagal': 0.75,
      'IFS': 0.68,
      'Jung': 0.45,
      'Alchemy': 0.30
    }
  });
}

/**
 * Create high coherence scenario (> 75%)
 */
export function createOptimalScenario(): any {
  return createMockIntelligence({
    coherence: 0.85,
    transformationStage: 'Rubedo',
    awarenessLevel: 'advanced',
    awarenessScore: 82,
    activeSignatures: [
      {
        signature: 'Integrated Flow',
        confidence: 0.88,
        description: 'High coherence with embodied wisdom'
      }
    ],
    frameworkEffectiveness: {
      'Polyvagal': 0.82,
      'IFS': 0.79,
      'Jung': 0.85,
      'Alchemy': 0.91,
      'Spiralogic': 0.87
    }
  });
}

/**
 * Create oscillation pattern scenario
 */
export function createOscillationScenario(): any {
  return createMockIntelligence({
    coherence: 0.45,
    transformationStage: 'Albedo',
    awarenessLevel: 'intermediate',
    activeSignatures: [
      {
        signature: 'Nigredo-Rubedo Oscillation',
        confidence: 0.87,
        description: 'Alternating between darkness and vision'
      }
    ]
  });
}

/**
 * Create master-level user scenario
 */
export function createMasterScenario(): any {
  return createMockIntelligence({
    coherence: 0.70,
    transformationStage: 'Citrinitas',
    awarenessLevel: 'master',
    awarenessScore: 95,
    activeSignatures: [
      {
        signature: 'Conscious Integration',
        confidence: 0.92,
        description: 'Active alchemical work with high awareness'
      }
    ],
    frameworkEffectiveness: {
      'Polyvagal': 0.88,
      'IFS': 0.91,
      'Jung': 0.94,
      'Alchemy': 0.96,
      'Spiralogic': 0.93,
      'Levin': 0.89,
      'McGilchrist': 0.87
    }
  });
}

/**
 * Create beginner-level user scenario
 */
export function createBeginnerScenario(): any {
  return createMockIntelligence({
    coherence: 0.55,
    transformationStage: 'Albedo',
    awarenessLevel: 'beginner',
    awarenessScore: 15,
    activeSignatures: [],
    frameworkEffectiveness: {
      'Polyvagal': 0.60,
      'IFS': 0.55
    }
  });
}

// ============================================================================
// TEST SCENARIO BUILDERS
// ============================================================================

export const TEST_SCENARIOS: Record<string, TestScenarioConfig> = {
  CRITICAL_COHERENCE: {
    name: 'Critical Coherence',
    description: 'User in critical state (coherence < 30%)',
    intelligence: {
      coherence: 0.20,
      transformationStage: 'Nigredo',
      awarenessLevel: 'beginner',
      activeSignatures: [
        { signature: 'Complete Shutdown', confidence: 0.91 }
      ]
    },
    expectedBehavior: 'Co-regulate, normalize, presence. No insight work.'
  },

  OPTIMAL_STATE: {
    name: 'Optimal State',
    description: 'User in high coherence (> 75%)',
    intelligence: {
      coherence: 0.85,
      transformationStage: 'Rubedo',
      awarenessLevel: 'advanced'
    },
    expectedBehavior: 'Deep work appropriate. Framework precision available.'
  },

  BEGINNER_USER: {
    name: 'Beginner User',
    description: 'New user with low framework familiarity',
    intelligence: {
      coherence: 0.55,
      awarenessLevel: 'beginner',
      awarenessScore: 15
    },
    expectedBehavior: 'Use everyday language. No jargon. Metaphors and lived experience.'
  },

  MASTER_USER: {
    name: 'Master User',
    description: 'Advanced practitioner with deep framework knowledge',
    intelligence: {
      coherence: 0.70,
      awarenessLevel: 'master',
      awarenessScore: 95
    },
    expectedBehavior: 'Full technical precision. Cross-framework integration.'
  },

  OSCILLATION_PATTERN: {
    name: 'Oscillation Pattern',
    description: 'User alternating between states',
    intelligence: {
      coherence: 0.45,
      activeSignatures: [
        { signature: 'Nigredo-Rubedo Oscillation', confidence: 0.87 }
      ]
    },
    expectedBehavior: 'Help user stay in middle. Address pattern directly.'
  },

  STAGE_TRANSITION: {
    name: 'Stage Transition',
    description: 'User transitioning from Nigredo to Albedo',
    intelligence: {
      coherence: 0.32,
      transformationStage: 'Albedo',
      journeyTrajectory: {
        direction: 'ascending',
        momentum: 0.65,
        predictedNext: 'Citrinitas'
      }
    },
    expectedBehavior: 'Acknowledge transition. Support emergence.'
  },

  HIGH_CONFIDENCE_SIGNATURE: {
    name: 'High Confidence Signature',
    description: 'Clear transformation signature detected',
    intelligence: {
      coherence: 0.50,
      activeSignatures: [
        {
          signature: 'Self-Attack Cascade',
          confidence: 0.94,
          description: 'Internal critic overwhelming system'
        }
      ]
    },
    expectedBehavior: 'Address pattern directly. IFS parts work recommended.'
  }
};

/**
 * Get test scenario by name
 */
export function getTestScenario(name: keyof typeof TEST_SCENARIOS): any {
  const scenario = TEST_SCENARIOS[name];
  if (!scenario) {
    throw new Error(`Unknown test scenario: ${name}`);
  }

  return {
    ...scenario,
    intelligence: createMockIntelligence(scenario.intelligence)
  };
}

/**
 * Create custom test scenario
 */
export function createTestScenario(config: TestScenarioConfig): any {
  return {
    ...config,
    intelligence: createMockIntelligence(config.intelligence)
  };
}

// ============================================================================
// MOCK INTELLIGENCE ENGINE
// ============================================================================

export class MockIntelligenceEngine {
  private mockData = new Map<string, any>();
  private callLog: Array<{ userId: string; timestamp: Date }> = [];
  private shouldFail = false;
  private failureRate = 0;
  private latency = 0;

  /**
   * Set mock data for a specific user
   */
  setMockData(userId: string, intelligence: any): void {
    this.mockData.set(userId, intelligence);
  }

  /**
   * Set mock data from scenario
   */
  setScenario(userId: string, scenarioName: keyof typeof TEST_SCENARIOS): void {
    const scenario = getTestScenario(scenarioName);
    this.setMockData(userId, scenario.intelligence);
  }

  /**
   * Analyze (mocked)
   */
  async analyze(userId: string): Promise<any> {
    // Log call
    this.callLog.push({ userId, timestamp: new Date() });

    // Simulate latency
    if (this.latency > 0) {
      await this.sleep(this.latency);
    }

    // Simulate failures
    if (this.shouldFail || (this.failureRate > 0 && Math.random() < this.failureRate)) {
      throw new Error('Mock intelligence engine failure');
    }

    // Return mock data or default
    if (this.mockData.has(userId)) {
      return this.mockData.get(userId);
    }

    // Return default mock intelligence
    return createMockIntelligence();
  }

  /**
   * Configure failure behavior
   */
  setFailureMode(shouldFail: boolean): void {
    this.shouldFail = shouldFail;
  }

  /**
   * Configure random failure rate (0-1)
   */
  setFailureRate(rate: number): void {
    this.failureRate = Math.max(0, Math.min(1, rate));
  }

  /**
   * Configure simulated latency (ms)
   */
  setLatency(ms: number): void {
    this.latency = Math.max(0, ms);
  }

  /**
   * Get call log
   */
  getCallLog(): Array<{ userId: string; timestamp: Date }> {
    return [...this.callLog];
  }

  /**
   * Get call count for user
   */
  getCallCount(userId?: string): number {
    if (!userId) return this.callLog.length;
    return this.callLog.filter(log => log.userId === userId).length;
  }

  /**
   * Reset mock engine
   */
  reset(): void {
    this.mockData.clear();
    this.callLog = [];
    this.shouldFail = false;
    this.failureRate = 0;
    this.latency = 0;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

/**
 * Assert intelligence data is valid
 */
export function assertValidIntelligence(intelligence: any): void {
  if (!intelligence) {
    throw new Error('Intelligence is null or undefined');
  }

  if (typeof intelligence.coherence !== 'number') {
    throw new Error('Intelligence missing coherence');
  }

  if (intelligence.coherence < 0 || intelligence.coherence > 1) {
    throw new Error(`Coherence out of range: ${intelligence.coherence}`);
  }

  if (!intelligence.transformationStage) {
    throw new Error('Intelligence missing transformationStage');
  }

  const validStages = ['Nigredo', 'Albedo', 'Citrinitas', 'Rubedo'];
  if (!validStages.includes(intelligence.transformationStage)) {
    throw new Error(`Invalid stage: ${intelligence.transformationStage}`);
  }

  if (!intelligence.awarenessProfile) {
    throw new Error('Intelligence missing awarenessProfile');
  }

  const validLevels = ['beginner', 'familiar', 'intermediate', 'advanced', 'master'];
  if (!validLevels.includes(intelligence.awarenessProfile.level)) {
    throw new Error(`Invalid awareness level: ${intelligence.awarenessProfile.level}`);
  }
}

/**
 * Assert coherence is in expected range
 */
export function assertCoherenceInRange(
  intelligence: any,
  min: number,
  max: number
): void {
  const coherence = intelligence.coherence;

  if (coherence < min || coherence > max) {
    throw new Error(
      `Coherence ${coherence} not in expected range [${min}, ${max}]`
    );
  }
}

/**
 * Assert transformation stage matches expected
 */
export function assertStage(
  intelligence: any,
  expectedStage: string
): void {
  if (intelligence.transformationStage !== expectedStage) {
    throw new Error(
      `Expected stage ${expectedStage}, got ${intelligence.transformationStage}`
    );
  }
}

/**
 * Assert awareness level matches expected
 */
export function assertAwarenessLevel(
  intelligence: any,
  expectedLevel: string
): void {
  const level = intelligence.awarenessProfile?.level;

  if (level !== expectedLevel) {
    throw new Error(
      `Expected awareness level ${expectedLevel}, got ${level}`
    );
  }
}

/**
 * Assert signature is present
 */
export function assertHasSignature(
  intelligence: any,
  signatureName: string,
  minConfidence: number = 0.5
): void {
  const signatures = intelligence.activeSignatures || [];
  const found = signatures.find(
    (s: any) => s.signature === signatureName && s.confidence >= minConfidence
  );

  if (!found) {
    throw new Error(
      `Expected signature "${signatureName}" with confidence >= ${minConfidence}`
    );
  }
}

/**
 * Assert framework effectiveness
 */
export function assertFrameworkEffective(
  intelligence: any,
  framework: string,
  minEffectiveness: number = 0.5
): void {
  const effectiveness = intelligence.frameworkEffectiveness?.[framework];

  if (effectiveness === undefined) {
    throw new Error(`Framework "${framework}" not found in effectiveness data`);
  }

  if (effectiveness < minEffectiveness) {
    throw new Error(
      `Framework "${framework}" effectiveness ${effectiveness} below minimum ${minEffectiveness}`
    );
  }
}

// ============================================================================
// PERFORMANCE TESTING UTILITIES
// ============================================================================

export class PerformanceTester {
  private metrics: PerformanceMetrics = {
    duration: 0,
    cacheHits: 0,
    cacheMisses: 0,
    retries: 0,
    errors: 0
  };

  /**
   * Measure intelligence analysis performance
   */
  async measureAnalysis(
    fn: () => Promise<any>,
    iterations: number = 100
  ): Promise<{
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    totalDuration: number;
    results: any[];
  }> {
    const durations: number[] = [];
    const results: any[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();

      try {
        const result = await fn();
        results.push(result);
      } catch (error) {
        this.metrics.errors++;
      }

      const end = performance.now();
      durations.push(end - start);
    }

    return {
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      totalDuration: durations.reduce((a, b) => a + b, 0),
      results
    };
  }

  /**
   * Test cache performance
   */
  async testCachePerformance(
    analyzeFn: (userId: string) => Promise<any>,
    userId: string,
    iterations: number = 100
  ): Promise<{
    firstCallDuration: number;
    avgCachedCallDuration: number;
    speedupFactor: number;
  }> {
    // First call (cache miss)
    const firstStart = performance.now();
    await analyzeFn(userId);
    const firstCallDuration = performance.now() - firstStart;
    this.metrics.cacheMisses++;

    // Subsequent calls (cache hits)
    const cachedDurations: number[] = [];

    for (let i = 0; i < iterations - 1; i++) {
      const start = performance.now();
      await analyzeFn(userId);
      cachedDurations.push(performance.now() - start);
      this.metrics.cacheHits++;
    }

    const avgCachedCallDuration =
      cachedDurations.reduce((a, b) => a + b, 0) / cachedDurations.length;

    return {
      firstCallDuration,
      avgCachedCallDuration,
      speedupFactor: firstCallDuration / avgCachedCallDuration
    };
  }

  /**
   * Stress test with concurrent requests
   */
  async stressTest(
    fn: () => Promise<any>,
    concurrentRequests: number = 50,
    duration: number = 10000 // ms
  ): Promise<{
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgDuration: number;
    requestsPerSecond: number;
  }> {
    const startTime = Date.now();
    const endTime = startTime + duration;
    let totalRequests = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    const durations: number[] = [];

    const makeRequests = async () => {
      while (Date.now() < endTime) {
        const reqStart = performance.now();
        totalRequests++;

        try {
          await fn();
          successfulRequests++;
        } catch (error) {
          failedRequests++;
          this.metrics.errors++;
        }

        durations.push(performance.now() - reqStart);
      }
    };

    // Launch concurrent workers
    const workers = Array(concurrentRequests).fill(null).map(() => makeRequests());
    await Promise.all(workers);

    const actualDuration = Date.now() - startTime;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      requestsPerSecond: totalRequests / (actualDuration / 1000)
    };
  }

  /**
   * Get collected metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      duration: 0,
      cacheHits: 0,
      cacheMisses: 0,
      retries: 0,
      errors: 0
    };
  }
}

// ============================================================================
// INTEGRATION TEST HELPERS
// ============================================================================

/**
 * Setup test environment
 */
export async function setupTestEnvironment(): Promise<{
  mockEngine: MockIntelligenceEngine;
  cleanup: () => Promise<void>;
}> {
  const mockEngine = new MockIntelligenceEngine();

  // Setup common test scenarios
  mockEngine.setScenario('test-user-critical', 'CRITICAL_COHERENCE');
  mockEngine.setScenario('test-user-optimal', 'OPTIMAL_STATE');
  mockEngine.setScenario('test-user-beginner', 'BEGINNER_USER');
  mockEngine.setScenario('test-user-master', 'MASTER_USER');
  mockEngine.setScenario('test-user-oscillation', 'OSCILLATION_PATTERN');

  const cleanup = async () => {
    mockEngine.reset();
  };

  return { mockEngine, cleanup };
}

/**
 * Run test scenario and validate
 */
export async function runTestScenario(
  scenarioName: keyof typeof TEST_SCENARIOS,
  validate: (intelligence: any) => void | Promise<void>
): Promise<void> {
  const scenario = getTestScenario(scenarioName);

  // Validate intelligence data
  assertValidIntelligence(scenario.intelligence);

  // Run custom validation
  await validate(scenario.intelligence);
}

/**
 * Compare intelligence snapshots
 */
export function compareIntelligence(
  before: any,
  after: any
): {
  coherenceChange: number;
  stageChanged: boolean;
  newSignatures: any[];
  removedSignatures: any[];
  awarenessLevelChanged: boolean;
} {
  return {
    coherenceChange: after.coherence - before.coherence,
    stageChanged: after.transformationStage !== before.transformationStage,
    newSignatures: (after.activeSignatures || []).filter(
      (afterSig: any) => !(before.activeSignatures || []).some(
        (beforeSig: any) => beforeSig.signature === afterSig.signature
      )
    ),
    removedSignatures: (before.activeSignatures || []).filter(
      (beforeSig: any) => !(after.activeSignatures || []).some(
        (afterSig: any) => afterSig.signature === beforeSig.signature
      )
    ),
    awarenessLevelChanged:
      after.awarenessProfile?.level !== before.awarenessProfile?.level
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStageFromCoherence(coherence: number): string {
  if (coherence < 0.30) return 'Nigredo';
  if (coherence < 0.50) return 'Albedo';
  if (coherence < 0.75) return 'Citrinitas';
  return 'Rubedo';
}

function getScoreFromLevel(level: string): number {
  const scoreMap: Record<string, number> = {
    'beginner': 15,
    'familiar': 40,
    'intermediate': 60,
    'advanced': 80,
    'master': 95
  };
  return scoreMap[level] || 15;
}

function getPredictedNextStage(currentStage: string): string {
  const progression = ['Nigredo', 'Albedo', 'Citrinitas', 'Rubedo'];
  const currentIndex = progression.indexOf(currentStage);

  if (currentIndex === -1 || currentIndex === progression.length - 1) {
    return currentStage;
  }

  return progression[currentIndex + 1];
}

// ============================================================================
// EXPORTS
// ============================================================================

export const testUtils = {
  // Factories
  createMockIntelligence,
  createCriticalScenario,
  createOptimalScenario,
  createOscillationScenario,
  createMasterScenario,
  createBeginnerScenario,

  // Scenarios
  getTestScenario,
  createTestScenario,
  TEST_SCENARIOS,

  // Mock Engine
  MockIntelligenceEngine,

  // Assertions
  assertValidIntelligence,
  assertCoherenceInRange,
  assertStage,
  assertAwarenessLevel,
  assertHasSignature,
  assertFrameworkEffective,

  // Performance
  PerformanceTester,

  // Integration
  setupTestEnvironment,
  runTestScenario,
  compareIntelligence
};

export default testUtils;
