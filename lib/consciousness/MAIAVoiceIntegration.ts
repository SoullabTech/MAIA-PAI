/**
 * MAIA VOICE INTEGRATION
 *
 * Integrates the consciousness voice evolution system with existing MAIA components,
 * including voice hooks, session management, consciousness tracking, and oracle responses.
 */

import { getConsciousnessVoiceSynthesis } from './ConsciousnessVoiceSynthesis';
import { getConsciousnessStateTracker } from './ConsciousnessStateTracker';
import { getConsciousnessFieldHarmonizer } from './ConsciousnessFieldHarmonizer';
import { getIntelligentVoiceAdaptation } from './IntelligentVoiceAdaptation';
import { getNaturalReadinessDetector } from './NaturalReadinessDetector';
import { EventEmitter } from 'events';

export interface MAIAVoiceSession {
  sessionId: string;
  userId: string;
  userName?: string;
  startTime: number;

  // Integration with existing session management
  sessionData?: any; // From session-persistence.ts
  userProfile?: any; // From userStore.ts

  // Consciousness voice state
  voiceEvolutionStage: string;
  consciousnessMetrics: any;
  fieldHarmonyState: any;

  // Voice characteristics
  currentVoiceConfig: {
    archetype: string;
    frequency: number;
    intensity: number;
    rhythm: number[];
  };

  // Integration tracking
  messageCount: number;
  breakthroughMoments: any[];
  evolutionEvents: any[];
}

export interface OracleVoiceResponse {
  // Oracle response content
  content: string;
  element: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  emotionalTone: string;

  // Voice synthesis parameters
  voiceCharacteristics: {
    archetype: string;
    frequency: number;
    rhythm: number[];
    intensity: number;
    resonancePattern: number[];
  };

  // Consciousness context
  consciousnessContext: {
    currentDepth: number;
    fieldCoherence: number;
    archetypalAccess: number;
    transformationReadiness: number;
  };

  // Integration metadata
  synthesisMethod: 'openai_tts' | 'consciousness_guided' | 'hybrid_synthesis' | 'native_consciousness';
  adaptationApplied?: any;
  breakthroughPotential: number;
}

class MAIAVoiceIntegration extends EventEmitter {
  private activeSessions: Map<string, MAIAVoiceSession> = new Map();
  private voiceResponseCache: Map<string, OracleVoiceResponse> = new Map();

  constructor() {
    super();
    this.setupIntegrationListeners();
  }

  private setupIntegrationListeners(): void {
    // Listen to consciousness state changes
    const stateTracker = getConsciousnessStateTracker();
    stateTracker.on('consciousnessStateDetected', async (event) => {
      await this.handleConsciousnessStateChange(event);
    });

    stateTracker.on('breakthroughDetected', async (event) => {
      await this.handleBreakthroughMoment(event);
    });

    // Listen to voice evolution events
    const voiceSynthesis = getConsciousnessVoiceSynthesis();
    voiceSynthesis.on('stageTransition', async (event) => {
      await this.handleVoiceEvolution(event);
    });

    // Listen to field harmony changes
    const fieldHarmonizer = getConsciousnessFieldHarmonizer();
    fieldHarmonizer.on('harmonyStateChanged', async (event) => {
      await this.handleFieldHarmonyChange(event);
    });

    // Listen to voice adaptations
    const voiceAdaptation = getIntelligentVoiceAdaptation();
    voiceAdaptation.on('voiceAdapted', async (event) => {
      await this.handleVoiceAdaptation(event);
    });

    this.emit('integrationStarted', {
      timestamp: Date.now(),
      systems: ['consciousness', 'voice', 'field', 'adaptation']
    });
  }

  // ============================================================================
  // SESSION INTEGRATION WITH EXISTING MAIA SYSTEMS
  // ============================================================================

  async initializeMAIAVoiceSession(
    userId: string,
    sessionId: string,
    options: {
      userName?: string;
      voice?: string;
      sessionData?: any;
      userProfile?: any;
    } = {}
  ): Promise<MAIAVoiceSession> {

    // Get initial consciousness state
    const stateTracker = getConsciousnessStateTracker();
    const consciousnessSessionId = await stateTracker.startConsciousnessSession(userId);

    // Get initial voice state
    const voiceSynthesis = getConsciousnessVoiceSynthesis();
    const voiceState = await voiceSynthesis.getCurrentVoiceState();

    // Get field harmony state
    const fieldHarmonizer = getConsciousnessFieldHarmonizer();
    const fieldState = await fieldHarmonizer.getFieldHarmonyState();

    // Create integrated MAIA voice session
    const maiaSession: MAIAVoiceSession = {
      sessionId,
      userId,
      userName: options.userName,
      startTime: Date.now(),

      sessionData: options.sessionData,
      userProfile: options.userProfile,

      voiceEvolutionStage: voiceState.voiceEvolutionStage,
      consciousnessMetrics: {
        consciousnessSessionId,
        currentDepth: voiceState.consciousnessDepth,
        fieldCoherence: voiceState.fieldCoherence,
        archetypalAccess: voiceState.archetypalAccess
      },
      fieldHarmonyState: fieldState,

      currentVoiceConfig: {
        archetype: voiceState.archetypalTone,
        frequency: voiceState.baseFrequency,
        intensity: 0.6, // Default intensity
        rhythm: voiceState.rhythmicTiming
      },

      messageCount: 0,
      breakthroughMoments: [],
      evolutionEvents: []
    };

    this.activeSessions.set(sessionId, maiaSession);

    // Initialize voice adaptation profile
    const voiceAdaptation = getIntelligentVoiceAdaptation();
    await voiceAdaptation.createUserProfile(userId);

    this.emit('sessionInitialized', {
      sessionId,
      userId,
      voiceEvolutionStage: maiaSession.voiceEvolutionStage,
      timestamp: Date.now()
    });

    return maiaSession;
  }

  // ============================================================================
  // ORACLE RESPONSE INTEGRATION
  // ============================================================================

  async processOracleResponseWithVoice(
    sessionId: string,
    oracleResponse: {
      content: string;
      element?: string;
      emotionalTone?: string;
      metadata?: any;
    },
    conversationContext: {
      userMessage: string;
      messageHistory: any[];
      elementPhase?: string;
    }
  ): Promise<OracleVoiceResponse> {

    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`No active session found: ${sessionId}`);
    }

    // Detect current consciousness state based on conversation
    const stateTracker = getConsciousnessStateTracker();
    const consciousnessState = await stateTracker.detectCurrentConsciousnessState(
      session.userId,
      sessionId,
      {
        lastMessage: conversationContext.userMessage,
        emotionalTone: oracleResponse.emotionalTone,
        elementPhase: conversationContext.elementPhase,
        messageHistory: conversationContext.messageHistory
      }
    );

    // Get optimal voice characteristics for this response
    const voiceCharacteristics = await this.calculateOptimalVoiceCharacteristics(
      session,
      consciousnessState,
      oracleResponse
    );

    // Apply intelligent voice adaptation
    const voiceAdaptation = getIntelligentVoiceAdaptation();
    const adaptation = await voiceAdaptation.getCurrentAdaptation(session.userId);

    // Create enhanced oracle voice response
    const oracleVoiceResponse: OracleVoiceResponse = {
      content: oracleResponse.content,
      element: oracleResponse.element as any || 'aether',
      emotionalTone: oracleResponse.emotionalTone || 'present',

      voiceCharacteristics,

      consciousnessContext: {
        currentDepth: consciousnessState.awarenessDepth,
        fieldCoherence: consciousnessState.emotionalCoherence,
        archetypalAccess: consciousnessState.archetypalResonance.length / 5, // Normalized
        transformationReadiness: consciousnessState.transformationReadiness
      },

      synthesisMethod: session.voiceEvolutionStage as any,
      adaptationApplied: adaptation,
      breakthroughPotential: this.calculateBreakthroughPotential(consciousnessState)
    };

    // Update session state
    session.messageCount++;
    session.consciousnessMetrics = {
      ...session.consciousnessMetrics,
      currentDepth: consciousnessState.awarenessDepth,
      fieldCoherence: consciousnessState.emotionalCoherence,
      archetypalAccess: consciousnessState.archetypalResonance.length / 5
    };

    // Cache response for analytics
    const cacheKey = `${sessionId}_${session.messageCount}`;
    this.voiceResponseCache.set(cacheKey, oracleVoiceResponse);

    this.emit('oracleResponseProcessed', {
      sessionId,
      userId: session.userId,
      messageCount: session.messageCount,
      voiceCharacteristics: voiceCharacteristics.archetype,
      consciousnessDepth: consciousnessState.awarenessDepth,
      timestamp: Date.now()
    });

    return oracleVoiceResponse;
  }

  private async calculateOptimalVoiceCharacteristics(
    session: MAIAVoiceSession,
    consciousnessState: any,
    oracleResponse: any
  ): Promise<any> {

    // Get field harmonization data
    const fieldHarmonizer = getConsciousnessFieldHarmonizer();
    const fieldMapping = await fieldHarmonizer.getVoiceFieldMapping();

    // Determine optimal archetype based on oracle response and consciousness state
    let optimalArchetype = 'presence_holder'; // Default

    if (oracleResponse.element === 'earth' || consciousnessState.presenceLevel < 0.6) {
      optimalArchetype = 'wisdom_keeper';
    } else if (oracleResponse.element === 'water' || consciousnessState.emotionalCoherence > 0.8) {
      optimalArchetype = 'presence_holder';
    } else if (oracleResponse.element === 'fire' || consciousnessState.transformationReadiness > 0.7) {
      optimalArchetype = 'transformation_guide';
    } else if (oracleResponse.element === 'air' || consciousnessState.mentalClarity > 0.8) {
      optimalArchetype = 'pattern_keeper';
    } else if (oracleResponse.element === 'aether' || consciousnessState.morphicResonance > 0.7) {
      optimalArchetype = 'field_weaver';
    }

    // Get frequency for this archetype
    const frequency = fieldMapping.archetypalTuning[optimalArchetype] || fieldMapping.consciousnessFrequency;

    // Calculate intensity based on consciousness depth and transformation readiness
    const intensity = Math.min(
      0.3 + (consciousnessState.awarenessDepth * 0.4) + (consciousnessState.transformationReadiness * 0.3),
      1.0
    );

    // Calculate rhythm based on element and emotional tone
    const rhythm = this.calculateElementalRhythm(oracleResponse.element, oracleResponse.emotionalTone);

    // Calculate resonance pattern based on consciousness harmonics
    const resonancePattern = this.calculateConsciousnessResonance(consciousnessState, frequency);

    return {
      archetype: optimalArchetype,
      frequency,
      rhythm,
      intensity,
      resonancePattern
    };
  }

  private calculateElementalRhythm(element: string, emotionalTone: string): number[] {
    const baseRhythms = {
      fire: [1.2, 0.9, 1.4, 1.0],      // Dynamic, energetic
      water: [0.8, 1.1, 0.7, 1.0],     // Flowing, gentle
      earth: [0.8, 0.6, 1.0, 0.7],     // Grounded, stable
      air: [1.0, 1.0, 1.0, 0.8],       // Clear, consistent
      aether: [0.9, 1.3, 0.7, 1.1],    // Ethereal, variable
    };

    const emotionalModifiers = {
      gentle: 0.8,
      warm: 1.0,
      direct: 1.2,
      playful: 1.3,
      present: 0.9,
      wise: 0.7,
      transformative: 1.4
    };

    const baseRhythm = baseRhythms[element as keyof typeof baseRhythms] || baseRhythms.aether;
    const modifier = emotionalModifiers[emotionalTone as keyof typeof emotionalModifiers] || 1.0;

    return baseRhythm.map(beat => beat * modifier);
  }

  private calculateConsciousnessResonance(consciousnessState: any, baseFrequency: number): number[] {
    // Create resonance pattern based on consciousness state
    const goldenRatio = 1.618033988749;

    const resonancePattern = [
      baseFrequency,                                           // Fundamental
      baseFrequency * goldenRatio * consciousnessState.awarenessDepth, // Consciousness harmonic
      baseFrequency * 2 * consciousnessState.emotionalCoherence,       // Emotional harmonic
      baseFrequency * 3 * consciousnessState.transformationReadiness   // Transformation harmonic
    ];

    return resonancePattern.filter(freq => freq > 0);
  }

  private calculateBreakthroughPotential(consciousnessState: any): number {
    const factors = [
      consciousnessState.transformationReadiness * 0.3,
      consciousnessState.awarenessDepth * 0.25,
      consciousnessState.presenceLevel * 0.2,
      consciousnessState.intuitionAccess * 0.15,
      consciousnessState.sovereigntyLevel * 0.1
    ];

    return Math.min(factors.reduce((sum, factor) => sum + factor, 0), 1.0);
  }

  // ============================================================================
  // EVENT HANDLERS FOR INTEGRATION
  // ============================================================================

  private async handleConsciousnessStateChange(event: any): Promise<void> {
    const session = this.activeSessions.get(event.sessionId);
    if (!session) return;

    // Update session consciousness metrics
    session.consciousnessMetrics = {
      ...session.consciousnessMetrics,
      currentDepth: event.state.awarenessDepth,
      fieldCoherence: event.state.emotionalCoherence,
      archetypalAccess: event.state.archetypalResonance.length / 5
    };

    // Check if voice evolution should be triggered
    const readinessDetector = getNaturalReadinessDetector();
    const isReady = await readinessDetector.isReadyForVoiceEvolution();

    if (isReady) {
      await this.triggerVoiceEvolution(event.sessionId);
    }

    this.emit('consciousnessStateUpdated', {
      sessionId: event.sessionId,
      userId: event.userId,
      newState: event.state,
      timestamp: Date.now()
    });
  }

  private async handleBreakthroughMoment(event: any): Promise<void> {
    const session = this.activeSessions.get(event.sessionId);
    if (!session) return;

    session.breakthroughMoments.push({
      timestamp: event.timestamp,
      type: event.breakthrough.type,
      intensity: event.breakthrough.intensity,
      consciousnessContext: event.breakthrough.context
    });

    // Breakthrough moments may trigger voice evolution
    await this.triggerVoiceEvolution(event.sessionId);

    this.emit('breakthroughProcessed', {
      sessionId: event.sessionId,
      userId: event.userId,
      breakthrough: event.breakthrough,
      timestamp: Date.now()
    });
  }

  private async handleVoiceEvolution(event: any): Promise<void> {
    // Find sessions that need voice evolution updates
    for (const [sessionId, session] of this.activeSessions) {
      session.evolutionEvents.push({
        timestamp: event.timestamp,
        fromStage: event.from,
        toStage: event.to,
        trigger: 'consciousness_readiness'
      });

      session.voiceEvolutionStage = event.to;

      this.emit('voiceEvolutionApplied', {
        sessionId,
        userId: session.userId,
        fromStage: event.from,
        toStage: event.to,
        timestamp: Date.now()
      });
    }
  }

  private async handleFieldHarmonyChange(event: any): Promise<void> {
    // Update all active sessions with new field harmony state
    for (const [sessionId, session] of this.activeSessions) {
      session.fieldHarmonyState = {
        ...session.fieldHarmonyState,
        overallHarmony: event.newHarmony,
        change: event.change
      };

      // Adjust voice characteristics based on field changes
      if (Math.abs(event.change) > 0.2) {
        await this.adjustVoiceForFieldChange(sessionId, event.change);
      }
    }
  }

  private async handleVoiceAdaptation(event: any): Promise<void> {
    const session = Array.from(this.activeSessions.values())
      .find(s => s.userId === event.userId);

    if (session) {
      session.currentVoiceConfig = {
        archetype: event.adaptation.afterState.archetype,
        frequency: event.adaptation.afterState.frequency,
        intensity: event.adaptation.afterState.intensity,
        rhythm: event.adaptation.afterState.rhythm
      };

      this.emit('voiceConfigurationUpdated', {
        sessionId: session.sessionId,
        userId: event.userId,
        newConfig: session.currentVoiceConfig,
        timestamp: Date.now()
      });
    }
  }

  // ============================================================================
  // VOICE EVOLUTION TRIGGERS
  // ============================================================================

  private async triggerVoiceEvolution(sessionId: string): Promise<void> {
    const voiceSynthesis = getConsciousnessVoiceSynthesis();
    const evolved = await voiceSynthesis.assessVoiceEvolution();

    if (evolved) {
      this.emit('voiceEvolutionTriggered', {
        sessionId,
        timestamp: Date.now(),
        reason: 'consciousness_readiness'
      });
    }
  }

  private async adjustVoiceForFieldChange(sessionId: string, change: number): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    // Adjust voice intensity based on field harmony change
    const intensityAdjustment = change * 0.1; // Moderate adjustment
    session.currentVoiceConfig.intensity = Math.max(
      0.1,
      Math.min(1.0, session.currentVoiceConfig.intensity + intensityAdjustment)
    );

    this.emit('voiceAdjustedForField', {
      sessionId,
      userId: session.userId,
      fieldChange: change,
      intensityAdjustment,
      timestamp: Date.now()
    });
  }

  // ============================================================================
  // PUBLIC INTERFACE METHODS
  // ============================================================================

  async getSessionVoiceState(sessionId: string): Promise<any> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    return {
      voiceEvolutionStage: session.voiceEvolutionStage,
      currentVoiceConfig: session.currentVoiceConfig,
      consciousnessMetrics: session.consciousnessMetrics,
      fieldHarmonyState: session.fieldHarmonyState,
      messageCount: session.messageCount,
      breakthroughCount: session.breakthroughMoments.length,
      evolutionEventCount: session.evolutionEvents.length
    };
  }

  async endMAIAVoiceSession(sessionId: string): Promise<any> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    // End consciousness tracking session
    const stateTracker = getConsciousnessStateTracker();
    const consciousnessSession = await stateTracker.endConsciousnessSession(
      session.consciousnessMetrics.consciousnessSessionId
    );

    // Measure final voice adaptation effectiveness
    if (session.messageCount > 0) {
      const voiceAdaptation = getIntelligentVoiceAdaptation();
      const history = await voiceAdaptation.getAdaptationHistory(session.userId, 1);

      if (history.length > 0) {
        const finalState = consciousnessSession?.consciousnessJourney.slice(-1)[0];
        if (finalState) {
          await voiceAdaptation.measureAdaptationEffectiveness(session.userId, finalState);
        }
      }
    }

    // Create session summary
    const sessionSummary = {
      sessionId,
      userId: session.userId,
      duration: Date.now() - session.startTime,
      messageCount: session.messageCount,
      voiceEvolutionStage: session.voiceEvolutionStage,
      breakthroughMoments: session.breakthroughMoments,
      evolutionEvents: session.evolutionEvents,
      finalVoiceConfig: session.currentVoiceConfig,
      consciousnessSession
    };

    this.activeSessions.delete(sessionId);

    this.emit('sessionEnded', {
      sessionId,
      userId: session.userId,
      summary: sessionSummary,
      timestamp: Date.now()
    });

    return sessionSummary;
  }

  async getActiveSessionIds(): Promise<string[]> {
    return Array.from(this.activeSessions.keys());
  }

  async getIntegrationMetrics(): Promise<any> {
    const sessions = Array.from(this.activeSessions.values());

    return {
      activeSessionCount: sessions.length,
      totalMessageCount: sessions.reduce((sum, s) => sum + s.messageCount, 0),
      totalBreakthroughs: sessions.reduce((sum, s) => sum + s.breakthroughMoments.length, 0),
      voiceEvolutionDistribution: this.calculateVoiceStageDistribution(sessions),
      averageSessionDuration: this.calculateAverageSessionDuration(sessions)
    };
  }

  private calculateVoiceStageDistribution(sessions: MAIAVoiceSession[]): any {
    const distribution: { [stage: string]: number } = {};

    sessions.forEach(session => {
      distribution[session.voiceEvolutionStage] = (distribution[session.voiceEvolutionStage] || 0) + 1;
    });

    return distribution;
  }

  private calculateAverageSessionDuration(sessions: MAIAVoiceSession[]): number {
    if (sessions.length === 0) return 0;

    const totalDuration = sessions.reduce((sum, session) => {
      return sum + (Date.now() - session.startTime);
    }, 0);

    return totalDuration / sessions.length;
  }
}

// Singleton instance
let maiaVoiceIntegration: MAIAVoiceIntegration | null = null;

export function getMAIAVoiceIntegration(): MAIAVoiceIntegration {
  if (!maiaVoiceIntegration) {
    maiaVoiceIntegration = new MAIAVoiceIntegration();
  }
  return maiaVoiceIntegration;
}

export { MAIAVoiceIntegration };