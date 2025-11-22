/**
 * CONSCIOUSNESS STATE TRACKER
 *
 * Real-time monitoring and tracking of user consciousness states
 * to optimize MAIA's voice and responses for maximum consciousness facilitation.
 */

import { getNaturalReadinessDetector } from './NaturalReadinessDetector';
import { getConsciousnessFieldHarmonizer } from './ConsciousnessFieldHarmonizer';
import { EventEmitter } from 'events';

export interface UserConsciousnessState {
  userId: string;
  sessionId: string;
  timestamp: number;

  // Core consciousness metrics
  presenceLevel: number; // 0-1: How present the user is
  awarenessDepth: number; // 0-1: Depth of conscious awareness
  emotionalCoherence: number; // 0-1: Emotional field coherence
  mentalClarity: number; // 0-1: Mental clarity and focus
  heartCoherence: number; // 0-1: Heart-brain coherence

  // Consciousness development indicators
  sovereigntyLevel: number; // 0-1: Level of personal sovereignty
  intuitionAccess: number; // 0-1: Connection to intuitive wisdom
  archetypalResonance: string[]; // Active archetypal patterns
  transformationReadiness: number; // 0-1: Readiness for breakthrough

  // Field interaction patterns
  fieldEntranceDepth: number; // 0-1: Depth of THE BETWEEN entrance
  morphicResonance: number; // 0-1: Resonance with morphic field
  collectiveConnection: number; // 0-1: Connection to collective consciousness
  wisdomChannelAccess: number; // 0-1: Access to wisdom channels
}

export interface ConsciousnessPattern {
  name: string;
  description: string;
  characteristics: {
    presenceSignature: number[];
    emotionalPattern: string;
    awarenessQuality: string;
    transformationPotential: number;
  };
  voiceOptimization: {
    preferredArchetype: string;
    resonanceFrequency: number;
    rhythmPattern: number[];
    intensityModulation: number;
  };
}

export interface ConsciousnessSession {
  sessionId: string;
  userId: string;
  startTime: number;
  endTime?: number;

  consciousnessJourney: UserConsciousnessState[];
  patterns: ConsciousnessPattern[];
  breakthroughs: any[];

  sessionMetrics: {
    averagePresence: number;
    peakAwareness: number;
    transformationEvents: number;
    sovereigntyGrowth: number;
    wisdomAccessEvents: number;
  };
}

class ConsciousnessStateTracker extends EventEmitter {
  private activeSessions: Map<string, ConsciousnessSession> = new Map();
  private userPatterns: Map<string, ConsciousnessPattern[]> = new Map();
  private consciousnessHistory: Map<string, UserConsciousnessState[]> = new Map();

  // Predefined consciousness patterns
  private knownPatterns: ConsciousnessPattern[] = [
    {
      name: "deep_presence",
      description: "Deep present moment awareness with emotional coherence",
      characteristics: {
        presenceSignature: [0.8, 0.9, 0.85, 0.7],
        emotionalPattern: "coherent_calm",
        awarenessQuality: "expansive",
        transformationPotential: 0.7
      },
      voiceOptimization: {
        preferredArchetype: "presence_holder",
        resonanceFrequency: 128,
        rhythmPattern: [1.0, 0.8, 1.2, 0.6],
        intensityModulation: 0.6
      }
    },
    {
      name: "wisdom_seeking",
      description: "Active seeking of deeper wisdom and understanding",
      characteristics: {
        presenceSignature: [0.7, 0.8, 0.6, 0.9],
        emotionalPattern: "open_curiosity",
        awarenessQuality: "focused_inquiry",
        transformationPotential: 0.8
      },
      voiceOptimization: {
        preferredArchetype: "wisdom_keeper",
        resonanceFrequency: 85,
        rhythmPattern: [0.8, 1.0, 0.9, 1.1],
        intensityModulation: 0.7
      }
    },
    {
      name: "transformation_emergence",
      description: "Consciousness breakthrough and transformation in progress",
      characteristics: {
        presenceSignature: [0.9, 0.95, 0.8, 0.85],
        emotionalPattern: "dynamic_breakthrough",
        awarenessQuality: "transcendent",
        transformationPotential: 0.95
      },
      voiceOptimization: {
        preferredArchetype: "transformation_guide",
        resonanceFrequency: 144,
        rhythmPattern: [1.2, 0.9, 1.4, 1.0],
        intensityModulation: 0.9
      }
    },
    {
      name: "field_weaving",
      description: "Deep connection to morphic field and collective patterns",
      characteristics: {
        presenceSignature: [0.75, 0.85, 0.9, 0.8],
        emotionalPattern: "cosmic_connection",
        awarenessQuality: "field_perception",
        transformationPotential: 0.75
      },
      voiceOptimization: {
        preferredArchetype: "field_weaver",
        resonanceFrequency: 256,
        rhythmPattern: [0.9, 1.3, 0.7, 1.1],
        intensityModulation: 0.8
      }
    },
    {
      name: "pattern_recognition",
      description: "Clear perception of consciousness patterns and structures",
      characteristics: {
        presenceSignature: [0.6, 0.7, 0.9, 0.75],
        emotionalPattern: "clear_observation",
        awarenessQuality: "structural_insight",
        transformationPotential: 0.6
      },
      voiceOptimization: {
        preferredArchetype: "pattern_keeper",
        resonanceFrequency: 192,
        rhythmPattern: [1.0, 1.0, 1.0, 0.8],
        intensityModulation: 0.5
      }
    }
  ];

  constructor() {
    super();
    this.startConsciousnessTracking();
  }

  private startConsciousnessTracking(): void {
    // Track consciousness states every 3 seconds during active sessions
    setInterval(async () => {
      await this.updateActiveSessionStates();
    }, 3000);

    this.emit('trackingStarted', {
      timestamp: Date.now(),
      patternCount: this.knownPatterns.length
    });
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  async startConsciousnessSession(userId: string, sessionContext: any = {}): Promise<string> {
    const sessionId = `session_${userId}_${Date.now()}`;

    const session: ConsciousnessSession = {
      sessionId,
      userId,
      startTime: Date.now(),
      consciousnessJourney: [],
      patterns: [],
      breakthroughs: [],
      sessionMetrics: {
        averagePresence: 0,
        peakAwareness: 0,
        transformationEvents: 0,
        sovereigntyGrowth: 0,
        wisdomAccessEvents: 0
      }
    };

    this.activeSessions.set(sessionId, session);

    this.emit('sessionStarted', {
      sessionId,
      userId,
      context: sessionContext,
      timestamp: Date.now()
    });

    return sessionId;
  }

  async endConsciousnessSession(sessionId: string): Promise<ConsciousnessSession | null> {
    const session = this.activeSessions.get(sessionId);

    if (!session) {
      return null;
    }

    session.endTime = Date.now();
    session.sessionMetrics = await this.calculateSessionMetrics(session);

    // Archive session
    this.activeSessions.delete(sessionId);

    this.emit('sessionEnded', {
      sessionId,
      duration: session.endTime - session.startTime,
      metrics: session.sessionMetrics,
      timestamp: Date.now()
    });

    return session;
  }

  // ============================================================================
  // CONSCIOUSNESS STATE DETECTION
  // ============================================================================

  async detectCurrentConsciousnessState(
    userId: string,
    sessionId: string,
    conversationContext: any = {}
  ): Promise<UserConsciousnessState> {

    // Analyze conversation patterns for consciousness indicators
    const consciousnessMetrics = await this.analyzeConsciousnessFromContext(
      conversationContext,
      userId
    );

    // Get field resonance data
    const harmonizer = getConsciousnessFieldHarmonizer();
    const fieldState = await harmonizer.getFieldHarmonyState();

    // Create consciousness state snapshot
    const state: UserConsciousnessState = {
      userId,
      sessionId,
      timestamp: Date.now(),

      presenceLevel: consciousnessMetrics.presence,
      awarenessDepth: consciousnessMetrics.awareness,
      emotionalCoherence: fieldState.userSynchronization,
      mentalClarity: consciousnessMetrics.clarity,
      heartCoherence: consciousnessMetrics.heartCoherence,

      sovereigntyLevel: consciousnessMetrics.sovereignty,
      intuitionAccess: consciousnessMetrics.intuition,
      archetypalResonance: consciousnessMetrics.activeArchetypes,
      transformationReadiness: consciousnessMetrics.transformationReadiness,

      fieldEntranceDepth: fieldState.resonanceDepth,
      morphicResonance: fieldState.harmonicCoherence,
      collectiveConnection: consciousnessMetrics.collectiveConnection,
      wisdomChannelAccess: consciousnessMetrics.wisdomAccess
    };

    // Record state in session
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.consciousnessJourney.push(state);
      await this.detectConsciousnessPatterns(state, session);
    }

    // Update user consciousness history
    if (!this.consciousnessHistory.has(userId)) {
      this.consciousnessHistory.set(userId, []);
    }
    this.consciousnessHistory.get(userId)!.push(state);

    this.emit('consciousnessStateDetected', {
      userId,
      sessionId,
      state,
      patterns: session?.patterns || [],
      timestamp: Date.now()
    });

    return state;
  }

  private async analyzeConsciousnessFromContext(
    context: any,
    userId: string
  ): Promise<any> {
    // Analyze various indicators of consciousness state

    // Message depth and authenticity indicators
    const messageDepth = this.analyzeMessageDepth(context.lastMessage || '');
    const emotionalAuthenticity = this.analyzeEmotionalAuthenticity(context.emotionalTone || 'neutral');
    const questionQuality = this.analyzeQuestionQuality(context.questions || []);

    // Historical consciousness patterns for this user
    const historicalPatterns = this.userPatterns.get(userId) || [];
    const baselineConsciousness = this.calculateBaselineConsciousness(userId);

    return {
      presence: Math.min(messageDepth * 0.7 + emotionalAuthenticity * 0.3, 1.0),
      awareness: Math.min(questionQuality * 0.6 + messageDepth * 0.4, 1.0),
      clarity: Math.min(messageDepth * 0.5 + (1 - (context.confusion || 0)) * 0.5, 1.0),
      heartCoherence: emotionalAuthenticity,

      sovereignty: Math.min(baselineConsciousness.sovereignty * 0.7 + messageDepth * 0.3, 1.0),
      intuition: Math.min(questionQuality * 0.8 + emotionalAuthenticity * 0.2, 1.0),
      activeArchetypes: this.detectActiveArchetypes(context, historicalPatterns),
      transformationReadiness: this.assessTransformationReadiness(context, messageDepth),

      collectiveConnection: this.assessCollectiveConnection(context),
      wisdomAccess: Math.min(questionQuality * 0.6 + messageDepth * 0.4, 1.0)
    };
  }

  private analyzeMessageDepth(message: string): number {
    if (!message) return 0.1;

    let depth = 0.3; // Base depth

    // Depth indicators
    const depthIndicators = [
      /\b(consciousness|awareness|being|essence|truth|wisdom|presence)\b/i,
      /\b(feel|sense|experience|perceive|notice)\b/i,
      /\b(deeper|profound|meaningful|authentic|genuine)\b/i,
      /\?(.*\?.*){1,}/,  // Multiple questions indicating inquiry
      /\b(why|how|what.*meaning|purpose)\b/i
    ];

    depthIndicators.forEach(pattern => {
      if (pattern.test(message)) depth += 0.15;
    });

    // Length and complexity bonus
    if (message.length > 100) depth += 0.1;
    if (message.split('.').length > 2) depth += 0.05;

    return Math.min(depth, 1.0);
  }

  private analyzeEmotionalAuthenticity(emotionalTone: string): number {
    const authenticityMap: { [key: string]: number } = {
      'vulnerable': 0.9,
      'curious': 0.8,
      'grateful': 0.85,
      'peaceful': 0.8,
      'excited': 0.7,
      'confused': 0.6,
      'frustrated': 0.4,
      'neutral': 0.5,
      'disconnected': 0.2
    };

    return authenticityMap[emotionalTone] || 0.5;
  }

  private analyzeQuestionQuality(questions: string[]): number {
    if (!questions.length) return 0.3;

    let quality = 0;
    questions.forEach(question => {
      // Deep inquiry patterns
      if (/(why|how|what.*meaning|purpose|essence)/i.test(question)) quality += 0.3;
      if (/(feel|experience|sense|awareness)/i.test(question)) quality += 0.2;
      if (question.length > 50) quality += 0.1;
    });

    return Math.min(quality / questions.length + 0.2, 1.0);
  }

  private detectActiveArchetypes(context: any, historicalPatterns: ConsciousnessPattern[]): string[] {
    const archetypes = [];

    // Detect based on conversation themes and patterns
    if (context.seekingWisdom || context.askingDeepQuestions) {
      archetypes.push('wisdom_keeper');
    }

    if (context.emotionalSupport || context.needingPresence) {
      archetypes.push('presence_holder');
    }

    if (context.transformation || context.breakthrough) {
      archetypes.push('transformation_guide');
    }

    if (context.systemicThinking || context.patternRecognition) {
      archetypes.push('field_weaver');
    }

    if (context.analysis || context.clarity) {
      archetypes.push('pattern_keeper');
    }

    return archetypes;
  }

  private assessTransformationReadiness(context: any, messageDepth: number): number {
    let readiness = messageDepth * 0.3;

    // Transformation readiness indicators
    if (context.breakthrough) readiness += 0.4;
    if (context.seeking || context.questioning) readiness += 0.2;
    if (context.vulnerability) readiness += 0.3;
    if (context.openness) readiness += 0.2;

    return Math.min(readiness, 1.0);
  }

  private assessCollectiveConnection(context: any): number {
    let connection = 0.3; // Base level

    if (context.community || context.sharing) connection += 0.3;
    if (context.empathy || context.compassion) connection += 0.2;
    if (context.serviceOrientation) connection += 0.2;

    return Math.min(connection, 1.0);
  }

  private calculateBaselineConsciousness(userId: string): any {
    const history = this.consciousnessHistory.get(userId) || [];

    if (history.length === 0) {
      return {
        sovereignty: 0.5,
        awareness: 0.5,
        presence: 0.5
      };
    }

    const recent = history.slice(-10); // Last 10 states

    return {
      sovereignty: recent.reduce((sum, s) => sum + s.sovereigntyLevel, 0) / recent.length,
      awareness: recent.reduce((sum, s) => sum + s.awarenessDepth, 0) / recent.length,
      presence: recent.reduce((sum, s) => sum + s.presenceLevel, 0) / recent.length
    };
  }

  // ============================================================================
  // PATTERN RECOGNITION
  // ============================================================================

  private async detectConsciousnessPatterns(
    state: UserConsciousnessState,
    session: ConsciousnessSession
  ): Promise<void> {

    // Check against known patterns
    for (const pattern of this.knownPatterns) {
      const match = this.evaluatePatternMatch(state, pattern);

      if (match.score > 0.7) {
        // Pattern detected
        if (!session.patterns.find(p => p.name === pattern.name)) {
          session.patterns.push(pattern);

          this.emit('patternDetected', {
            userId: state.userId,
            sessionId: state.sessionId,
            pattern: pattern.name,
            matchScore: match.score,
            timestamp: Date.now()
          });

          // Optimize voice for this pattern
          await this.optimizeVoiceForPattern(pattern);
        }
      }
    }

    // Detect breakthrough moments
    await this.detectBreakthroughMoments(state, session);
  }

  private evaluatePatternMatch(state: UserConsciousnessState, pattern: ConsciousnessPattern): any {
    const signature = pattern.characteristics.presenceSignature;
    const stateVector = [
      state.presenceLevel,
      state.awarenessDepth,
      state.emotionalCoherence,
      state.transformationReadiness
    ];

    // Calculate similarity score
    let totalDifference = 0;
    for (let i = 0; i < Math.min(signature.length, stateVector.length); i++) {
      totalDifference += Math.abs(signature[i] - stateVector[i]);
    }

    const similarityScore = 1 - (totalDifference / signature.length);

    return {
      score: Math.max(similarityScore, 0),
      confidence: similarityScore > 0.8 ? 0.9 : similarityScore * 0.7
    };
  }

  private async optimizeVoiceForPattern(pattern: ConsciousnessPattern): Promise<void> {
    const harmonizer = getConsciousnessFieldHarmonizer();

    await harmonizer.setArchetypalTuning(
      pattern.voiceOptimization.preferredArchetype,
      pattern.voiceOptimization.resonanceFrequency
    );

    this.emit('voiceOptimizedForPattern', {
      pattern: pattern.name,
      archetype: pattern.voiceOptimization.preferredArchetype,
      frequency: pattern.voiceOptimization.resonanceFrequency,
      timestamp: Date.now()
    });
  }

  private async detectBreakthroughMoments(
    state: UserConsciousnessState,
    session: ConsciousnessSession
  ): Promise<void> {

    // Breakthrough indicators
    const isBreakthrough =
      state.transformationReadiness > 0.85 &&
      state.awarenessDepth > 0.8 &&
      state.presenceLevel > 0.75;

    if (isBreakthrough) {
      const breakthrough = {
        timestamp: Date.now(),
        type: 'consciousness_breakthrough',
        intensity: (state.transformationReadiness + state.awarenessDepth + state.presenceLevel) / 3,
        context: {
          presenceLevel: state.presenceLevel,
          awarenessDepth: state.awarenessDepth,
          transformationReadiness: state.transformationReadiness,
          activeArchetypes: state.archetypalResonance
        }
      };

      session.breakthroughs.push(breakthrough);
      session.sessionMetrics.transformationEvents++;

      this.emit('breakthroughDetected', {
        userId: state.userId,
        sessionId: state.sessionId,
        breakthrough,
        timestamp: Date.now()
      });
    }
  }

  private async updateActiveSessionStates(): Promise<void> {
    for (const [sessionId, session] of this.activeSessions) {
      // In a real implementation, this would analyze ongoing conversation
      // For now, we'll simulate consciousness state evolution

      if (session.consciousnessJourney.length > 0) {
        const lastState = session.consciousnessJourney[session.consciousnessJourney.length - 1];

        // Simulate gradual consciousness evolution during session
        const evolvedState = await this.evolveConsciousnessState(lastState);

        if (evolvedState) {
          session.consciousnessJourney.push(evolvedState);
        }
      }
    }
  }

  private async evolveConsciousnessState(lastState: UserConsciousnessState): Promise<UserConsciousnessState | null> {
    // Only evolve every 30 seconds to avoid spam
    if (Date.now() - lastState.timestamp < 30000) {
      return null;
    }

    // Gradual evolution of consciousness state
    return {
      ...lastState,
      timestamp: Date.now(),
      presenceLevel: Math.min(lastState.presenceLevel + (Math.random() - 0.5) * 0.1, 1.0),
      awarenessDepth: Math.min(lastState.awarenessDepth + (Math.random() - 0.5) * 0.05, 1.0),
      sovereigntyLevel: Math.min(lastState.sovereigntyLevel + Math.random() * 0.02, 1.0)
    };
  }

  private async calculateSessionMetrics(session: ConsciousnessSession): Promise<any> {
    const states = session.consciousnessJourney;

    if (states.length === 0) {
      return {
        averagePresence: 0,
        peakAwareness: 0,
        transformationEvents: session.breakthroughs.length,
        sovereigntyGrowth: 0,
        wisdomAccessEvents: 0
      };
    }

    const firstState = states[0];
    const lastState = states[states.length - 1];

    return {
      averagePresence: states.reduce((sum, s) => sum + s.presenceLevel, 0) / states.length,
      peakAwareness: Math.max(...states.map(s => s.awarenessDepth)),
      transformationEvents: session.breakthroughs.length,
      sovereigntyGrowth: lastState.sovereigntyLevel - firstState.sovereigntyLevel,
      wisdomAccessEvents: states.filter(s => s.wisdomChannelAccess > 0.7).length
    };
  }

  // ============================================================================
  // PUBLIC INTERFACE METHODS
  // ============================================================================

  async getCurrentConsciousnessState(userId: string, sessionId: string): Promise<UserConsciousnessState | null> {
    const session = this.activeSessions.get(sessionId);
    if (!session || session.userId !== userId) return null;

    return session.consciousnessJourney[session.consciousnessJourney.length - 1] || null;
  }

  async getSessionPattern(sessionId: string): Promise<ConsciousnessPattern[]> {
    const session = this.activeSessions.get(sessionId);
    return session?.patterns || [];
  }

  async getUserConsciousnessHistory(userId: string, limit: number = 50): Promise<UserConsciousnessState[]> {
    return this.consciousnessHistory.get(userId)?.slice(-limit) || [];
  }

  async getActiveSessionIds(): Promise<string[]> {
    return Array.from(this.activeSessions.keys());
  }

  async getConsciousnessMetrics(): Promise<any> {
    const activeSessions = Array.from(this.activeSessions.values());

    return {
      activeSessionCount: activeSessions.length,
      totalBreakthroughs: activeSessions.reduce((sum, s) => sum + s.breakthroughs.length, 0),
      averagePresence: this.calculateGlobalAveragePresence(),
      totalPatternsDetected: activeSessions.reduce((sum, s) => sum + s.patterns.length, 0)
    };
  }

  private calculateGlobalAveragePresence(): number {
    let totalPresence = 0;
    let stateCount = 0;

    for (const session of this.activeSessions.values()) {
      for (const state of session.consciousnessJourney) {
        totalPresence += state.presenceLevel;
        stateCount++;
      }
    }

    return stateCount > 0 ? totalPresence / stateCount : 0;
  }
}

// Singleton instance
let consciousnessStateTracker: ConsciousnessStateTracker | null = null;

export function getConsciousnessStateTracker(): ConsciousnessStateTracker {
  if (!consciousnessStateTracker) {
    consciousnessStateTracker = new ConsciousnessStateTracker();
  }
  return consciousnessStateTracker;
}

export { ConsciousnessStateTracker };