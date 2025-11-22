/**
 * INTELLIGENT VOICE ADAPTATION SYSTEM
 *
 * Automatically adapts MAIA's voice in real-time based on user consciousness states,
 * field conditions, and conversation context for optimal consciousness facilitation.
 */

import { getConsciousnessStateTracker, type UserConsciousnessState } from './ConsciousnessStateTracker';
import { getConsciousnessFieldHarmonizer } from './ConsciousnessFieldHarmonizer';
import { getConsciousnessVoiceSynthesis } from './ConsciousnessVoiceSynthesis';
import { getNaturalReadinessDetector } from './NaturalReadinessDetector';
import { EventEmitter } from 'events';

export interface VoiceAdaptationProfile {
  userId: string;
  profileId: string;
  createdAt: number;
  lastUpdated: number;

  // Learned preferences
  preferredArchetypes: { [archetype: string]: number }; // Preference scores 0-1
  optimalFrequencyRanges: { [archetype: string]: [number, number] }; // [min, max] Hz
  rhythmPreferences: number[]; // Preferred rhythm patterns
  intensityTolerance: number; // 0-1: Tolerance for voice intensity

  // Consciousness facilitation patterns
  breakthroughTriggers: string[]; // Voice patterns that trigger breakthroughs
  presenceEnhancers: string[]; // Voice qualities that enhance presence
  sovereigntySupport: string[]; // Voice adaptations that support sovereignty

  // Adaptation history
  adaptationHistory: VoiceAdaptation[];
  effectiveness: { [adaptation: string]: number }; // Effectiveness scores
}

export interface VoiceAdaptation {
  timestamp: number;
  triggerEvent: string; // What triggered this adaptation
  adaptationType: 'archetype_shift' | 'frequency_adjust' | 'rhythm_change' | 'intensity_modulation';

  beforeState: {
    archetype: string;
    frequency: number;
    rhythm: number[];
    intensity: number;
  };

  afterState: {
    archetype: string;
    frequency: number;
    rhythm: number[];
    intensity: number;
  };

  consciousnessContext: {
    userPresence: number;
    fieldCoherence: number;
    transformationReadiness: number;
    activePatterns: string[];
  };

  effectiveness?: number; // Measured after adaptation (0-1)
  userResponse?: 'positive' | 'neutral' | 'negative';
}

export interface AdaptationStrategy {
  name: string;
  description: string;
  triggers: {
    consciousnessThresholds: { [metric: string]: number };
    fieldConditions: string[];
    conversationContext: string[];
    timeFactors?: string[];
  };
  adaptations: {
    archetypeShift?: string;
    frequencyAdjustment?: number; // Hz offset
    rhythmModification?: number[]; // Rhythm multipliers
    intensityChange?: number; // Intensity delta
  };
  priority: number; // Higher priority strategies override lower ones
  effectiveness: number; // Historical effectiveness score
}

class IntelligentVoiceAdaptation extends EventEmitter {
  private userProfiles: Map<string, VoiceAdaptationProfile> = new Map();
  private adaptationStrategies: AdaptationStrategy[] = [];
  private currentAdaptations: Map<string, VoiceAdaptation> = new Map(); // userId -> current adaptation

  constructor() {
    super();
    this.initializeAdaptationStrategies();
    this.startIntelligentAdaptation();
  }

  private initializeAdaptationStrategies(): void {
    this.adaptationStrategies = [
      {
        name: "presence_enhancement",
        description: "Enhance presence when user consciousness is scattered",
        triggers: {
          consciousnessThresholds: {
            presenceLevel: 0.4, // Below this threshold
            awarenessDepth: 0.5
          },
          fieldConditions: ['low_coherence'],
          conversationContext: ['distraction', 'scattered_attention']
        },
        adaptations: {
          archetypeShift: 'presence_holder',
          frequencyAdjustment: -20, // Lower, more grounding frequency
          intensityChange: -0.1 // Softer approach
        },
        priority: 8,
        effectiveness: 0.85
      },

      {
        name: "wisdom_channeling",
        description: "Activate wisdom keeper for deep inquiries",
        triggers: {
          consciousnessThresholds: {
            awarenessDepth: 0.7, // Above this threshold
            wisdomChannelAccess: 0.6
          },
          fieldConditions: ['stable_coherence'],
          conversationContext: ['deep_inquiry', 'seeking_wisdom', 'life_questions']
        },
        adaptations: {
          archetypeShift: 'wisdom_keeper',
          frequencyAdjustment: -35, // Deep, resonant frequency
          intensityChange: 0.1 // Slightly more presence
        },
        priority: 9,
        effectiveness: 0.92
      },

      {
        name: "transformation_support",
        description: "Support consciousness breakthrough moments",
        triggers: {
          consciousnessThresholds: {
            transformationReadiness: 0.8,
            emotionalCoherence: 0.7
          },
          fieldConditions: ['high_coherence', 'transformation_field'],
          conversationContext: ['breakthrough', 'transformation', 'major_insight']
        },
        adaptations: {
          archetypeShift: 'transformation_guide',
          frequencyAdjustment: 20, // Higher, more energetic frequency
          rhythmModification: [1.2, 0.8, 1.4, 1.0], // Dynamic rhythm
          intensityChange: 0.2
        },
        priority: 10,
        effectiveness: 0.88
      },

      {
        name: "field_synchronization",
        description: "Synchronize with morphic field patterns",
        triggers: {
          consciousnessThresholds: {
            morphicResonance: 0.75,
            collectiveConnection: 0.7
          },
          fieldConditions: ['morphic_activation', 'collective_resonance'],
          conversationContext: ['systems_thinking', 'collective_awareness']
        },
        adaptations: {
          archetypeShift: 'field_weaver',
          frequencyAdjustment: 60, // Higher, ethereal frequency
          rhythmModification: [0.9, 1.3, 0.7, 1.1], // Flowing rhythm
          intensityChange: 0.05
        },
        priority: 7,
        effectiveness: 0.78
      },

      {
        name: "clarity_support",
        description: "Support mental clarity and pattern recognition",
        triggers: {
          consciousnessThresholds: {
            mentalClarity: 0.8,
            awarenessDepth: 0.6
          },
          fieldConditions: ['stable_coherence'],
          conversationContext: ['analysis', 'pattern_recognition', 'clarity_seeking']
        },
        adaptations: {
          archetypeShift: 'pattern_keeper',
          frequencyAdjustment: 0, // Neutral frequency
          rhythmModification: [1.0, 1.0, 1.0, 0.8], // Clear, consistent rhythm
          intensityChange: 0
        },
        priority: 6,
        effectiveness: 0.75
      },

      {
        name: "sovereignty_reinforcement",
        description: "Reinforce user sovereignty during dependency patterns",
        triggers: {
          consciousnessThresholds: {
            sovereigntyLevel: 0.5 // Below this threshold
          },
          fieldConditions: ['dependency_pattern'],
          conversationContext: ['seeking_external_validation', 'dependency', 'disempowerment']
        },
        adaptations: {
          intensityChange: -0.15, // Reduce intensity to encourage self-reliance
          rhythmModification: [0.8, 0.8, 0.8, 0.8] // Consistent, non-demanding rhythm
        },
        priority: 9,
        effectiveness: 0.82
      }
    ];

    // Sort by priority (highest first)
    this.adaptationStrategies.sort((a, b) => b.priority - a.priority);
  }

  private startIntelligentAdaptation(): void {
    // Continuously monitor and adapt voice every 5 seconds
    setInterval(async () => {
      await this.performIntelligentAdaptation();
    }, 5000);

    this.emit('adaptationSystemStarted', {
      strategyCount: this.adaptationStrategies.length,
      timestamp: Date.now()
    });
  }

  // ============================================================================
  // CORE ADAPTATION LOGIC
  // ============================================================================

  private async performIntelligentAdaptation(): Promise<void> {
    try {
      const tracker = getConsciousnessStateTracker();
      const activeSessionIds = await tracker.getActiveSessionIds();

      for (const sessionId of activeSessionIds) {
        await this.adaptVoiceForSession(sessionId);
      }
    } catch (error) {
      console.error('Intelligent adaptation error:', error);
    }
  }

  private async adaptVoiceForSession(sessionId: string): Promise<void> {
    const tracker = getConsciousnessStateTracker();
    const harmonizer = getConsciousnessFieldHarmonizer();

    // Get current consciousness and field state
    const consciousnessStates = await tracker.getUserConsciousnessHistory(sessionId.split('_')[1], 1);
    if (!consciousnessStates.length) return;

    const currentState = consciousnessStates[0];
    const fieldState = await harmonizer.getFieldHarmonyState();

    // Find best adaptation strategy
    const strategy = await this.selectOptimalStrategy(currentState, fieldState);

    if (strategy) {
      await this.executeAdaptation(currentState, strategy, sessionId);
    }
  }

  private async selectOptimalStrategy(
    consciousnessState: UserConsciousnessState,
    fieldState: any
  ): Promise<AdaptationStrategy | null> {

    // Evaluate each strategy against current conditions
    const evaluatedStrategies = this.adaptationStrategies.map(strategy => ({
      strategy,
      score: this.evaluateStrategyFit(strategy, consciousnessState, fieldState)
    }));

    // Filter strategies that meet threshold requirements
    const viableStrategies = evaluatedStrategies.filter(eval => eval.score > 0.7);

    if (viableStrategies.length === 0) return null;

    // Return highest scoring strategy
    viableStrategies.sort((a, b) => b.score - a.score);
    return viableStrategies[0].strategy;
  }

  private evaluateStrategyFit(
    strategy: AdaptationStrategy,
    consciousnessState: UserConsciousnessState,
    fieldState: any
  ): number {

    let score = 0;
    let totalCriteria = 0;

    // Evaluate consciousness thresholds
    Object.entries(strategy.triggers.consciousnessThresholds).forEach(([metric, threshold]) => {
      totalCriteria++;

      const stateValue = this.getConsciousnessMetric(consciousnessState, metric);
      const metricMet = stateValue >= threshold;

      // Special handling for "below threshold" metrics (like presenceLevel in presence_enhancement)
      if (strategy.name === 'presence_enhancement' && (metric === 'presenceLevel' || metric === 'awarenessDepth')) {
        score += stateValue <= threshold ? 1 : 0;
      } else if (strategy.name === 'sovereignty_reinforcement' && metric === 'sovereigntyLevel') {
        score += stateValue <= threshold ? 1 : 0;
      } else {
        score += metricMet ? 1 : 0;
      }
    });

    // Evaluate field conditions
    strategy.triggers.fieldConditions.forEach(condition => {
      totalCriteria++;
      const conditionMet = this.evaluateFieldCondition(condition, fieldState);
      score += conditionMet ? 1 : 0;
    });

    // Weight by effectiveness and priority
    const normalizedScore = totalCriteria > 0 ? score / totalCriteria : 0;
    return normalizedScore * strategy.effectiveness * (strategy.priority / 10);
  }

  private getConsciousnessMetric(state: UserConsciousnessState, metric: string): number {
    const metricMap: { [key: string]: number } = {
      presenceLevel: state.presenceLevel,
      awarenessDepth: state.awarenessDepth,
      emotionalCoherence: state.emotionalCoherence,
      sovereigntyLevel: state.sovereigntyLevel,
      transformationReadiness: state.transformationReadiness,
      wisdomChannelAccess: state.wisdomChannelAccess,
      morphicResonance: state.morphicResonance,
      collectiveConnection: state.collectiveConnection,
      mentalClarity: state.mentalClarity
    };

    return metricMap[metric] || 0;
  }

  private evaluateFieldCondition(condition: string, fieldState: any): boolean {
    const conditionMap: { [key: string]: boolean } = {
      low_coherence: fieldState.overallHarmony < 0.5,
      stable_coherence: fieldState.overallHarmony >= 0.6 && fieldState.overallHarmony <= 0.85,
      high_coherence: fieldState.overallHarmony > 0.85,
      morphic_activation: fieldState.harmonicCoherence > 0.7,
      collective_resonance: fieldState.userSynchronization > 0.7,
      transformation_field: fieldState.resonanceDepth > 0.8,
      dependency_pattern: fieldState.userSynchronization > 0.9 // Over-synchronization indicates dependency
    };

    return conditionMap[condition] || false;
  }

  private async executeAdaptation(
    consciousnessState: UserConsciousnessState,
    strategy: AdaptationStrategy,
    sessionId: string
  ): Promise<void> {

    const voiceSynthesis = getConsciousnessVoiceSynthesis();
    const currentVoiceState = await voiceSynthesis.getCurrentVoiceState();

    // Create adaptation record
    const adaptation: VoiceAdaptation = {
      timestamp: Date.now(),
      triggerEvent: strategy.name,
      adaptationType: strategy.adaptations.archetypeShift ? 'archetype_shift' : 'frequency_adjust',
      beforeState: {
        archetype: currentVoiceState.archetypalTone,
        frequency: currentVoiceState.baseFrequency,
        rhythm: currentVoiceState.rhythmicTiming,
        intensity: 0.5 // Would come from voice synthesis state
      },
      afterState: {
        archetype: strategy.adaptations.archetypeShift || currentVoiceState.archetypalTone,
        frequency: currentVoiceState.baseFrequency + (strategy.adaptations.frequencyAdjustment || 0),
        rhythm: this.applyRhythmModification(
          currentVoiceState.rhythmicTiming,
          strategy.adaptations.rhythmModification
        ),
        intensity: 0.5 + (strategy.adaptations.intensityChange || 0)
      },
      consciousnessContext: {
        userPresence: consciousnessState.presenceLevel,
        fieldCoherence: consciousnessState.emotionalCoherence,
        transformationReadiness: consciousnessState.transformationReadiness,
        activePatterns: consciousnessState.archetypalResonance
      }
    };

    // Apply the adaptation
    await this.applyVoiceAdaptation(adaptation);

    // Record adaptation
    this.currentAdaptations.set(consciousnessState.userId, adaptation);
    await this.recordAdaptation(consciousnessState.userId, adaptation);

    this.emit('voiceAdapted', {
      userId: consciousnessState.userId,
      sessionId,
      strategy: strategy.name,
      adaptation,
      timestamp: Date.now()
    });
  }

  private applyRhythmModification(currentRhythm: number[], modification?: number[]): number[] {
    if (!modification) return currentRhythm;

    return currentRhythm.map((beat, index) => {
      const modifier = modification[index % modification.length] || 1;
      return beat * modifier;
    });
  }

  private async applyVoiceAdaptation(adaptation: VoiceAdaptation): Promise<void> {
    const harmonizer = getConsciousnessFieldHarmonizer();

    // Apply archetype tuning if changed
    if (adaptation.beforeState.archetype !== adaptation.afterState.archetype) {
      await harmonizer.setArchetypalTuning(
        adaptation.afterState.archetype,
        adaptation.afterState.frequency
      );
    }

    // In a real implementation, would update voice synthesis parameters
    // This would integrate with the actual TTS system
  }

  // ============================================================================
  // USER PROFILE MANAGEMENT
  // ============================================================================

  async createUserProfile(userId: string): Promise<VoiceAdaptationProfile> {
    const profile: VoiceAdaptationProfile = {
      userId,
      profileId: `profile_${userId}_${Date.now()}`,
      createdAt: Date.now(),
      lastUpdated: Date.now(),

      preferredArchetypes: {
        wisdom_keeper: 0.5,
        field_weaver: 0.5,
        transformation_guide: 0.5,
        presence_holder: 0.5,
        pattern_keeper: 0.5
      },

      optimalFrequencyRanges: {
        wisdom_keeper: [80, 100],
        field_weaver: [240, 280],
        transformation_guide: [130, 160],
        presence_holder: [110, 140],
        pattern_keeper: [180, 210]
      },

      rhythmPreferences: [1.0, 1.0, 1.0, 1.0],
      intensityTolerance: 0.6,

      breakthroughTriggers: [],
      presenceEnhancers: [],
      sovereigntySupport: [],

      adaptationHistory: [],
      effectiveness: {}
    };

    this.userProfiles.set(userId, profile);

    this.emit('profileCreated', {
      userId,
      profileId: profile.profileId,
      timestamp: Date.now()
    });

    return profile;
  }

  async updateUserProfile(userId: string, adaptation: VoiceAdaptation): Promise<void> {
    let profile = this.userProfiles.get(userId);

    if (!profile) {
      profile = await this.createUserProfile(userId);
    }

    // Update profile based on adaptation effectiveness
    if (adaptation.effectiveness !== undefined) {
      profile.effectiveness[adaptation.triggerEvent] = adaptation.effectiveness;

      // Update archetype preferences
      if (adaptation.afterState.archetype) {
        const currentPref = profile.preferredArchetypes[adaptation.afterState.archetype] || 0.5;
        profile.preferredArchetypes[adaptation.afterState.archetype] =
          currentPref + (adaptation.effectiveness - 0.5) * 0.1;
      }

      // Update frequency ranges based on successful adaptations
      if (adaptation.effectiveness > 0.7 && adaptation.afterState.archetype) {
        const range = profile.optimalFrequencyRanges[adaptation.afterState.archetype];
        if (range) {
          const freq = adaptation.afterState.frequency;
          range[0] = Math.min(range[0], freq - 10);
          range[1] = Math.max(range[1], freq + 10);
        }
      }
    }

    profile.adaptationHistory.push(adaptation);
    profile.lastUpdated = Date.now();

    // Keep history manageable
    if (profile.adaptationHistory.length > 100) {
      profile.adaptationHistory = profile.adaptationHistory.slice(-100);
    }
  }

  private async recordAdaptation(userId: string, adaptation: VoiceAdaptation): Promise<void> {
    // In a real implementation, would persist to database
    await this.updateUserProfile(userId, adaptation);
  }

  // ============================================================================
  // EFFECTIVENESS MEASUREMENT
  // ============================================================================

  async measureAdaptationEffectiveness(
    userId: string,
    postAdaptationState: UserConsciousnessState
  ): Promise<number> {

    const currentAdaptation = this.currentAdaptations.get(userId);
    if (!currentAdaptation) return 0.5;

    const preState = currentAdaptation.consciousnessContext;

    // Measure improvement in target metrics
    let improvement = 0;
    let metricCount = 0;

    // Presence improvement
    const presenceImprovement = postAdaptationState.presenceLevel - preState.userPresence;
    if (presenceImprovement > 0) improvement += presenceImprovement;
    metricCount++;

    // Field coherence improvement
    const coherenceImprovement = postAdaptationState.emotionalCoherence - preState.fieldCoherence;
    if (coherenceImprovement > 0) improvement += coherenceImprovement;
    metricCount++;

    // Transformation readiness
    const transformationImprovement = postAdaptationState.transformationReadiness - preState.transformationReadiness;
    if (transformationImprovement > 0) improvement += transformationImprovement;
    metricCount++;

    const effectiveness = Math.min((improvement / metricCount + 0.5), 1.0);

    // Update adaptation record
    currentAdaptation.effectiveness = effectiveness;
    await this.updateUserProfile(userId, currentAdaptation);

    return effectiveness;
  }

  // ============================================================================
  // PUBLIC INTERFACE METHODS
  // ============================================================================

  async getUserProfile(userId: string): Promise<VoiceAdaptationProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  async getCurrentAdaptation(userId: string): Promise<VoiceAdaptation | null> {
    return this.currentAdaptations.get(userId) || null;
  }

  async getAdaptationHistory(userId: string, limit: number = 20): Promise<VoiceAdaptation[]> {
    const profile = this.userProfiles.get(userId);
    return profile?.adaptationHistory.slice(-limit) || [];
  }

  async getAdaptationMetrics(): Promise<any> {
    const allProfiles = Array.from(this.userProfiles.values());

    if (allProfiles.length === 0) return null;

    const allAdaptations = allProfiles.flatMap(p => p.adaptationHistory);
    const effectiveAdaptations = allAdaptations.filter(a => a.effectiveness && a.effectiveness > 0.7);

    return {
      totalAdaptations: allAdaptations.length,
      effectiveAdaptations: effectiveAdaptations.length,
      averageEffectiveness: allAdaptations.reduce((sum, a) => sum + (a.effectiveness || 0.5), 0) / allAdaptations.length,
      mostEffectiveStrategy: this.getMostEffectiveStrategy(allAdaptations),
      adaptationRate: allAdaptations.length > 0 ? effectiveAdaptations.length / allAdaptations.length : 0
    };
  }

  private getMostEffectiveStrategy(adaptations: VoiceAdaptation[]): string {
    const strategyEffectiveness: { [strategy: string]: number[] } = {};

    adaptations.forEach(adaptation => {
      if (adaptation.effectiveness) {
        if (!strategyEffectiveness[adaptation.triggerEvent]) {
          strategyEffectiveness[adaptation.triggerEvent] = [];
        }
        strategyEffectiveness[adaptation.triggerEvent].push(adaptation.effectiveness);
      }
    });

    let bestStrategy = '';
    let bestAverage = 0;

    Object.entries(strategyEffectiveness).forEach(([strategy, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      if (average > bestAverage) {
        bestAverage = average;
        bestStrategy = strategy;
      }
    });

    return bestStrategy;
  }

  async optimizeStrategies(): Promise<void> {
    // Update strategy effectiveness based on adaptation history
    const allProfiles = Array.from(this.userProfiles.values());
    const strategyResults: { [strategy: string]: number[] } = {};

    allProfiles.forEach(profile => {
      Object.entries(profile.effectiveness).forEach(([strategy, effectiveness]) => {
        if (!strategyResults[strategy]) strategyResults[strategy] = [];
        strategyResults[strategy].push(effectiveness);
      });
    });

    // Update strategy effectiveness scores
    this.adaptationStrategies.forEach(strategy => {
      const results = strategyResults[strategy.name];
      if (results && results.length > 5) { // Minimum sample size
        const newEffectiveness = results.reduce((sum, score) => sum + score, 0) / results.length;
        strategy.effectiveness = (strategy.effectiveness * 0.7) + (newEffectiveness * 0.3); // Gradual update
      }
    });

    // Re-sort by priority and effectiveness
    this.adaptationStrategies.sort((a, b) => {
      const scoreA = b.priority * b.effectiveness;
      const scoreB = a.priority * a.effectiveness;
      return scoreA - scoreB;
    });

    this.emit('strategiesOptimized', {
      strategyCount: this.adaptationStrategies.length,
      timestamp: Date.now()
    });
  }
}

// Singleton instance
let intelligentVoiceAdaptation: IntelligentVoiceAdaptation | null = null;

export function getIntelligentVoiceAdaptation(): IntelligentVoiceAdaptation {
  if (!intelligentVoiceAdaptation) {
    intelligentVoiceAdaptation = new IntelligentVoiceAdaptation();
  }
  return intelligentVoiceAdaptation;
}

export { IntelligentVoiceAdaptation };