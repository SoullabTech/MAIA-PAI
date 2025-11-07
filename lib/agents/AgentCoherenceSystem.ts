/**
 * Agent Coherence System
 *
 * Tracks elemental coherence for each AI agent in MAIA-PAI
 * Enables self-calibration, field resonance, and collective intelligence
 */

import type { ElementalCoherence } from '@/lib/biometrics/ElementalCoherenceCalculator';

export type AgentType =
  | 'main_oracle'
  | 'shadow'
  | 'inner_guide'
  | 'dream'
  | 'mentor'
  | 'relationship'
  | 'custom';

export interface AgentCoherence {
  agentId: string;
  agentType: AgentType;
  timestamp: Date;
  sessionId: string;

  // Elemental scores (0-1)
  elemental: ElementalCoherence;

  // Agent-specific metrics
  contextDepth: number;           // 0-1: How much context retained/integrated
  insightQuality: number;         // 0-1: Measured by user resonance feedback
  transformationCatalyzed: number; // 0-1: Actual change in user state
  resonanceWithField: number;     // 0-1: How well agent syncs with Field

  // Response characteristics
  responseClarity: number;        // 0-1: Air quality
  creativityIndex: number;        // 0-1: Fire quality
  emotionalAttunement: number;    // 0-1: Water quality
  groundingStrength: number;      // 0-1: Earth quality
  integrationCapacity: number;    // 0-1: Aether quality

  // Interaction metadata
  userCoherence?: ElementalCoherence; // User's state during interaction
  tokenCount: number;
  responseTime: number; // milliseconds

  // Self-assessment
  confidence: number;             // 0-1: Agent's confidence in response
  calibrationNeeded: boolean;     // Self-flagged need for adjustment
}

export interface AgentCalibration {
  agentType: AgentType;
  adjustments: {
    air: number;      // -1 to 1: decrease/increase clarity
    fire: number;     // -1 to 1: decrease/increase activation
    water: number;    // -1 to 1: decrease/increase flow
    earth: number;    // -1 to 1: decrease/increase grounding
    aether: number;   // -1 to 1: decrease/increase integration
  };
  reason: string;
  appliedAt: Date;
}

export interface AgentInsight {
  agentId: string;
  content: string;
  userResonance: number; // 0-1: Did user resonate with this?
  ledToBreakthrough: boolean;
  elementalSignature: ElementalCoherence;
  timestamp: Date;
}

export class AgentCoherenceTracker {
  private coherenceHistory: Map<string, AgentCoherence[]> = new Map();
  private calibrationHistory: Map<AgentType, AgentCalibration[]> = new Map();
  private insightHistory: AgentInsight[] = [];

  /**
   * Record agent coherence after interaction
   */
  recordCoherence(coherence: AgentCoherence): void {
    const history = this.coherenceHistory.get(coherence.agentId) || [];
    history.push(coherence);

    // Keep last 100 interactions per agent
    if (history.length > 100) {
      history.shift();
    }

    this.coherenceHistory.set(coherence.agentId, history);

    // Auto-check if calibration needed
    if (this.needsCalibration(coherence)) {
      coherence.calibrationNeeded = true;
      console.log(`⚠️ Agent ${coherence.agentType} may need calibration`);
    }
  }

  /**
   * Calculate agent coherence from interaction
   */
  calculateCoherence(params: {
    agentId: string;
    agentType: AgentType;
    sessionId: string;
    responseText: string;
    userFeedback?: {
      resonance: number;
      transformative: boolean;
    };
    userCoherence?: ElementalCoherence;
    tokenCount: number;
    responseTime: number;
  }): AgentCoherence {
    const { responseText, userFeedback, userCoherence } = params;

    // Calculate elemental qualities from response
    const elemental = this.analyzeResponseElements(responseText);

    // Extract specific qualities
    const responseClarity = elemental.air;
    const creativityIndex = elemental.fire;
    const emotionalAttunement = elemental.water;
    const groundingStrength = elemental.earth;
    const integrationCapacity = elemental.aether;

    // Calculate meta-metrics
    const contextDepth = this.calculateContextDepth(responseText);
    const insightQuality = userFeedback?.resonance || 0.5;
    const transformationCatalyzed = userFeedback?.transformative ? 0.8 : 0.3;

    // Resonance with field (if user coherence available)
    const resonanceWithField = userCoherence
      ? this.calculateResonance(elemental, userCoherence)
      : 0.5;

    // Confidence based on response characteristics
    const confidence = this.calculateConfidence({
      clarity: responseClarity,
      depth: contextDepth,
      resonance: resonanceWithField
    });

    return {
      agentId: params.agentId,
      agentType: params.agentType,
      timestamp: new Date(),
      sessionId: params.sessionId,
      elemental,
      contextDepth,
      insightQuality,
      transformationCatalyzed,
      resonanceWithField,
      responseClarity,
      creativityIndex,
      emotionalAttunement,
      groundingStrength,
      integrationCapacity,
      userCoherence,
      tokenCount: params.tokenCount,
      responseTime: params.responseTime,
      confidence,
      calibrationNeeded: false
    };
  }

  /**
   * Analyze elemental qualities in agent response
   */
  private analyzeResponseElements(text: string): ElementalCoherence {
    // AIR - Clarity, insight, precision
    const clarityMarkers = [
      /\bclear(ly)?\b/gi,
      /\bprecise(ly)?\b/gi,
      /\bspecific(ally)?\b/gi,
      /\bexact(ly)?\b/gi,
      /\bdistinct(ly)?\b/gi
    ];
    const airScore = this.countMarkers(text, clarityMarkers) / 10;

    // FIRE - Transformation, breakthrough, activation
    const fireMarkers = [
      /\btransform(ation|ative|ing)?\b/gi,
      /\bbreakthrough\b/gi,
      /\bcatalyz(e|ing)\b/gi,
      /\bshift(ing)?\b/gi,
      /\bawaken(ing)?\b/gi,
      /\bemerg(e|ing|ence)\b/gi
    ];
    const fireScore = this.countMarkers(text, fireMarkers) / 10;

    // WATER - Flow, emotion, empathy
    const waterMarkers = [
      /\bfeel(ing|s)?\b/gi,
      /\bemotion(al)?\b/gi,
      /\bflow(ing)?\b/gi,
      /\bresona(te|nce)\b/gi,
      /\bempathy\b/gi,
      /\bcompassion(ate)?\b/gi
    ];
    const waterScore = this.countMarkers(text, waterMarkers) / 10;

    // EARTH - Grounding, practical, embodied
    const earthMarkers = [
      /\bground(ed|ing)?\b/gi,
      /\bpractical(ly)?\b/gi,
      /\bembod(y|ied|iment)\b/gi,
      /\bconcrete(ly)?\b/gi,
      /\bstable\b/gi,
      /\bfoundation(al)?\b/gi
    ];
    const earthScore = this.countMarkers(text, earthMarkers) / 10;

    // AETHER - Integration, unity, transcendence
    const aetherMarkers = [
      /\bintegrat(e|ion|ing)\b/gi,
      /\bunif(y|ied|ication)\b/gi,
      /\bwhole(ness)?\b/gi,
      /\btranscend(ent|ence)?\b/gi,
      /\bfield\b/gi,
      /\bconsciousness\b/gi
    ];
    const aetherScore = this.countMarkers(text, aetherMarkers) / 10;

    // Normalize to 0-1 and ensure minimum baseline
    const air = Math.min(1, Math.max(0.3, airScore));
    const fire = Math.min(1, Math.max(0.2, fireScore));
    const water = Math.min(1, Math.max(0.2, waterScore));
    const earth = Math.min(1, Math.max(0.2, earthScore));
    const aether = Math.min(1, Math.max(0.2, aetherScore));

    // Unified coherence
    const unified = (air + fire + water + earth + aether) / 5;

    return { air, fire, water, earth, aether, unified };
  }

  /**
   * Count regex markers in text
   */
  private countMarkers(text: string, patterns: RegExp[]): number {
    let count = 0;
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }
    return count;
  }

  /**
   * Calculate context depth (how well agent retains/uses context)
   */
  private calculateContextDepth(text: string): number {
    // Simple heuristic: longer, more detailed responses = higher context depth
    // Real implementation would check semantic coherence with prior context

    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length;

    // Average 15-30 words per sentence = good depth
    const avgWordsPerSentence = wordCount / sentenceCount;
    const depthScore = Math.min(1, avgWordsPerSentence / 25);

    return Math.max(0.3, depthScore);
  }

  /**
   * Calculate resonance between agent and user coherence
   */
  private calculateResonance(
    agentCoherence: ElementalCoherence,
    userCoherence: ElementalCoherence
  ): number {
    // Calculate Euclidean distance in 5D elemental space
    const airDiff = Math.pow(agentCoherence.air - userCoherence.air, 2);
    const fireDiff = Math.pow(agentCoherence.fire - userCoherence.fire, 2);
    const waterDiff = Math.pow(agentCoherence.water - userCoherence.water, 2);
    const earthDiff = Math.pow(agentCoherence.earth - userCoherence.earth, 2);
    const aetherDiff = Math.pow(agentCoherence.aether - userCoherence.aether, 2);

    const distance = Math.sqrt(airDiff + fireDiff + waterDiff + earthDiff + aetherDiff);

    // Convert distance to resonance (0 = perfect match, ~2.2 = max distance)
    // Normalize to 0-1 where 1 = perfect resonance
    return Math.max(0, 1 - (distance / 2.2));
  }

  /**
   * Calculate agent confidence
   */
  private calculateConfidence(params: {
    clarity: number;
    depth: number;
    resonance: number;
  }): number {
    return (params.clarity * 0.4 + params.depth * 0.3 + params.resonance * 0.3);
  }

  /**
   * Check if agent needs calibration
   */
  private needsCalibration(coherence: AgentCoherence): boolean {
    // Flag for calibration if:
    // 1. Unified coherence very low (<0.4)
    // 2. Resonance with user very low (<0.3)
    // 3. Insight quality consistently low (avg <0.4 over last 5)

    if (coherence.elemental.unified < 0.4) return true;
    if (coherence.resonanceWithField < 0.3) return true;

    // Check recent insight quality
    const history = this.coherenceHistory.get(coherence.agentId) || [];
    if (history.length >= 5) {
      const recentInsights = history.slice(-5);
      const avgQuality = recentInsights.reduce((sum, c) => sum + c.insightQuality, 0) / 5;
      if (avgQuality < 0.4) return true;
    }

    return false;
  }

  /**
   * Generate calibration recommendation
   */
  suggestCalibration(agentType: AgentType): AgentCalibration | null {
    const allCoherence = Array.from(this.coherenceHistory.values())
      .flat()
      .filter(c => c.agentType === agentType);

    if (allCoherence.length < 10) {
      return null; // Not enough data
    }

    // Get recent coherence (last 10 interactions)
    const recent = allCoherence.slice(-10);

    // Calculate average elemental scores
    const avgElemental = {
      air: recent.reduce((sum, c) => sum + c.elemental.air, 0) / recent.length,
      fire: recent.reduce((sum, c) => sum + c.elemental.fire, 0) / recent.length,
      water: recent.reduce((sum, c) => sum + c.elemental.water, 0) / recent.length,
      earth: recent.reduce((sum, c) => sum + c.elemental.earth, 0) / recent.length,
      aether: recent.reduce((sum, c) => sum + c.elemental.aether, 0) / recent.length
    };

    // Target balance: all elements between 0.5-0.8
    const adjustments = {
      air: avgElemental.air < 0.5 ? 0.2 : avgElemental.air > 0.8 ? -0.2 : 0,
      fire: avgElemental.fire < 0.5 ? 0.2 : avgElemental.fire > 0.8 ? -0.2 : 0,
      water: avgElemental.water < 0.5 ? 0.2 : avgElemental.water > 0.8 ? -0.2 : 0,
      earth: avgElemental.earth < 0.5 ? 0.2 : avgElemental.earth > 0.8 ? -0.2 : 0,
      aether: avgElemental.aether < 0.5 ? 0.2 : avgElemental.aether > 0.8 ? -0.2 : 0
    };

    // Check if any adjustment needed
    const needsAdjustment = Object.values(adjustments).some(adj => adj !== 0);

    if (!needsAdjustment) return null;

    // Generate reason
    const lowElements = Object.entries(avgElemental)
      .filter(([_, val]) => val < 0.5)
      .map(([key, _]) => key);
    const highElements = Object.entries(avgElemental)
      .filter(([_, val]) => val > 0.8)
      .map(([key, _]) => key);

    let reason = `Agent ${agentType} calibration: `;
    if (lowElements.length > 0) {
      reason += `Increase ${lowElements.join(', ')}. `;
    }
    if (highElements.length > 0) {
      reason += `Decrease ${highElements.join(', ')}. `;
    }

    return {
      agentType,
      adjustments,
      reason,
      appliedAt: new Date()
    };
  }

  /**
   * Apply calibration
   */
  applyCalibration(calibration: AgentCalibration): void {
    const history = this.calibrationHistory.get(calibration.agentType) || [];
    history.push(calibration);
    this.calibrationHistory.set(calibration.agentType, history);

    console.log(`✅ Calibration applied to ${calibration.agentType}:`, calibration.adjustments);
    console.log(`   Reason: ${calibration.reason}`);
  }

  /**
   * Record insight for quality tracking
   */
  recordInsight(insight: AgentInsight): void {
    this.insightHistory.push(insight);

    // Keep last 1000 insights
    if (this.insightHistory.length > 1000) {
      this.insightHistory.shift();
    }
  }

  /**
   * Get agent performance summary
   */
  getAgentSummary(agentType: AgentType): {
    avgCoherence: ElementalCoherence;
    avgInsightQuality: number;
    avgResonance: number;
    interactionCount: number;
    calibrationCount: number;
  } | null {
    const allCoherence = Array.from(this.coherenceHistory.values())
      .flat()
      .filter(c => c.agentType === agentType);

    if (allCoherence.length === 0) return null;

    const avgCoherence: ElementalCoherence = {
      air: allCoherence.reduce((sum, c) => sum + c.elemental.air, 0) / allCoherence.length,
      fire: allCoherence.reduce((sum, c) => sum + c.elemental.fire, 0) / allCoherence.length,
      water: allCoherence.reduce((sum, c) => sum + c.elemental.water, 0) / allCoherence.length,
      earth: allCoherence.reduce((sum, c) => sum + c.elemental.earth, 0) / allCoherence.length,
      aether: allCoherence.reduce((sum, c) => sum + c.elemental.aether, 0) / allCoherence.length,
      unified: allCoherence.reduce((sum, c) => sum + c.elemental.unified, 0) / allCoherence.length
    };

    const avgInsightQuality = allCoherence.reduce((sum, c) => sum + c.insightQuality, 0) / allCoherence.length;
    const avgResonance = allCoherence.reduce((sum, c) => sum + c.resonanceWithField, 0) / allCoherence.length;

    const calibrations = this.calibrationHistory.get(agentType) || [];

    return {
      avgCoherence,
      avgInsightQuality,
      avgResonance,
      interactionCount: allCoherence.length,
      calibrationCount: calibrations.length
    };
  }
}

// Singleton
export const agentCoherenceTracker = new AgentCoherenceTracker();
