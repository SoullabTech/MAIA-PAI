/**
 * Morphoresonant Field Interface
 *
 * The substrate beneath cognitive models - where patterns resonate across:
 * - Sessions (temporal continuity)
 * - Users (collective field)
 * - System restarts (holographic survival)
 * - Privacy boundaries (abstract signatures)
 *
 * "The field remembers what individual minds forget" - Rupert Sheldrake
 */

import { HolographicStorage, HolographicFragment } from '@/lib/morphogenetic/HolographicStorage';
import { IndividualFieldMemory, FieldSignature, GrowthVector } from '@/lib/oracle/memory/IndividualFieldMemory';
import { CollectiveConsciousnessBridge } from '@/lib/anamnesis/CollectiveConsciousnessBridge';
import type { MorphogeneticPattern } from '@/lib/morphogenetic/PatternExtractor';
import type { FieldState } from '@/lib/oracle/field/FieldAwareness';
import type { IntelligenceAnalysis } from '@/lib/intelligence/UnifiedIntelligenceEngine';

/**
 * Field Pattern - Abstract representation stored in the field
 */
export interface FieldPattern {
  id: string;
  userId: string;
  timestamp: Date;

  // Field signatures (privacy-preserving)
  fieldSignature: FieldSignature;
  growthVector: GrowthVector;

  // Holographic distribution
  holographicFragments?: HolographicFragment[];

  // Intelligence context (abstract)
  dominantFrameworks: string[];
  coherenceLevel: number;
  transformationOccurred: boolean;

  // Resonance metadata
  resonanceStrength: number; // How strongly this pattern resonates
  morphicFrequency: number;  // Sheldrake's morphic field frequency

  // Collective markers
  contributesToCollective: boolean;
  synchronicityPotential: number; // 0-1
}

/**
 * Field Wisdom - Insights retrieved from the field
 */
export interface FieldWisdom {
  // What the field has learned
  successPatterns: string[];
  avoidPatterns: string[];

  // Resonant memories (not content, just patterns)
  resonantFieldStates: FieldSignature[];

  // Growth guidance
  suggestedGrowthDirections: GrowthVector[];

  // Collective insights
  collectivePatterns: any[];
  synchronicities: any[];

  // Meta-awareness
  fieldCoherence: number;
  userJourneyPhase: 'seeding' | 'growing' | 'flowering' | 'fruiting';
}

/**
 * Morphoresonant Field Interface
 * Coordinates all field memory systems
 */
export class MorphoresonantFieldInterface {
  private holographicStorage: HolographicStorage;
  private userFieldMemories: Map<string, IndividualFieldMemory>;
  private collectiveBridge: CollectiveConsciousnessBridge | null = null;

  // Field-level tracking
  private activePatterns: Map<string, FieldPattern>;
  private morphicResonances: Map<string, number>; // Pattern hash -> resonance strength

  constructor() {
    this.holographicStorage = new HolographicStorage();
    this.userFieldMemories = new Map();
    this.activePatterns = new Map();
    this.morphicResonances = new Map();

    console.log('🌀 Morphoresonant Field Interface initialized');
    console.log('   Substrate layer active beneath cognitive models');
  }

  /**
   * Initialize collective bridge when available
   */
  initializeCollectiveBridge(bridge: CollectiveConsciousnessBridge): void {
    this.collectiveBridge = bridge;
    console.log('🌉 Collective Consciousness Bridge connected to field');
  }

  /**
   * Get or create individual field memory for user
   */
  private getOrCreateUserField(userId: string): IndividualFieldMemory {
    if (!this.userFieldMemories.has(userId)) {
      const userField = new IndividualFieldMemory(userId);
      this.userFieldMemories.set(userId, userField);
      console.log(`🌱 Individual field memory created for user: ${userId.substring(0, 8)}...`);
    }

    return this.userFieldMemories.get(userId)!;
  }

  /**
   * Store an interaction in the morphoresonant field
   *
   * Takes intelligence analysis + field state and stores as abstract pattern
   * This is called AFTER each MAIA interaction
   */
  async storeInteraction(
    userId: string,
    intelligenceAnalysis: IntelligenceAnalysis,
    fieldState: FieldState,
    outcome: {
      success: boolean;
      coherence: number;
      transformationOccurred?: boolean;
    }
  ): Promise<FieldPattern> {
    console.log('💾 Storing interaction in morphoresonant field...');

    // Get user's individual field memory
    const userField = this.getOrCreateUserField(userId);

    // Store in individual field (privacy-preserving)
    await userField.store_interaction(
      fieldState,
      intelligenceAnalysis.primarySignature?.name || 'general',
      outcome
    );

    // Create field pattern
    const pattern: FieldPattern = {
      id: `field_${Date.now()}_${userId.substring(0, 8)}`,
      userId,
      timestamp: new Date(),

      // Abstract field signature (no raw content)
      fieldSignature: this.extractFieldSignature(fieldState),
      growthVector: this.extractGrowthVector(intelligenceAnalysis, outcome),

      // Intelligence context (abstract)
      dominantFrameworks: intelligenceAnalysis.signatures
        ?.slice(0, 3)
        .map(s => s.name) || [],
      coherenceLevel: intelligenceAnalysis.summary.coherenceLevel,
      transformationOccurred: outcome.transformationOccurred || false,

      // Resonance metadata
      resonanceStrength: this.calculateResonanceStrength(intelligenceAnalysis, fieldState),
      morphicFrequency: this.calculateMorphicFrequency(fieldState),

      // Collective markers
      contributesToCollective: outcome.coherence > 0.7,
      synchronicityPotential: this.assessSynchronicityPotential(fieldState)
    };

    // Store pattern
    this.activePatterns.set(pattern.id, pattern);

    // If pattern is significant, create holographic distribution
    if (outcome.transformationOccurred && outcome.coherence > 0.8) {
      await this.distributeHolographically(pattern, intelligenceAnalysis);
    }

    // Contribute to collective field if significant
    if (pattern.contributesToCollective && this.collectiveBridge) {
      await this.contributeToCollective(pattern);
    }

    // Update morphic resonance
    this.updateMorphicResonance(pattern);

    console.log(`   ✅ Pattern stored in field: ${pattern.id}`);
    console.log(`      Coherence: ${pattern.coherenceLevel.toFixed(2)}`);
    console.log(`      Morphic frequency: ${pattern.morphicFrequency.toFixed(2)}`);

    return pattern;
  }

  /**
   * Retrieve field wisdom for current session
   *
   * This is called at SESSION START to retrieve resonant patterns
   */
  async retrieveFieldWisdom(
    userId: string,
    currentFieldState: FieldState,
    currentIntelligence?: IntelligenceAnalysis
  ): Promise<FieldWisdom> {
    console.log('🔍 Retrieving wisdom from morphoresonant field...');

    // Get user's individual field memory
    const userField = this.getOrCreateUserField(userId);

    // Retrieve resonant patterns from individual field
    const individualWisdom = await userField.retrieve_relevant_patterns(
      currentFieldState,
      5 // Top 5 resonant patterns
    );

    // Find resonant patterns in active field
    const resonantPatterns = this.findResonantPatterns(userId, currentFieldState);

    // Determine journey phase
    const journeyPhase = this.determineJourneyPhase(userId, resonantPatterns);

    // Calculate field coherence
    const fieldCoherence = this.calculateFieldCoherence(userId);

    const wisdom: FieldWisdom = {
      successPatterns: individualWisdom.learned_wisdom,
      avoidPatterns: individualWisdom.avoid_zones,

      resonantFieldStates: individualWisdom.patterns.map(p => p.field_state),

      suggestedGrowthDirections: this.synthesizeGrowthDirections(
        resonantPatterns,
        currentIntelligence
      ),

      collectivePatterns: [], // TODO: Retrieve from collective bridge
      synchronicities: [],    // TODO: Retrieve from collective bridge

      fieldCoherence,
      userJourneyPhase: journeyPhase
    };

    console.log(`   ✅ Field wisdom retrieved`);
    console.log(`      Success patterns: ${wisdom.successPatterns.length}`);
    console.log(`      Growth directions: ${wisdom.suggestedGrowthDirections.length}`);
    console.log(`      Field coherence: ${(fieldCoherence * 100).toFixed(0)}%`);
    console.log(`      Journey phase: ${journeyPhase}`);

    return wisdom;
  }

  /**
   * Create holographic distribution of significant pattern
   * Survives system crashes, can be reconstructed from fragments
   */
  private async distributeHolographically(
    pattern: FieldPattern,
    intelligenceAnalysis: IntelligenceAnalysis
  ): Promise<void> {
    console.log('🔮 Creating holographic distribution for significant pattern...');

    // Convert to morphogenetic pattern format
    const morphoPattern: MorphogeneticPattern = {
      essence: {
        frequency: pattern.morphicFrequency,
        harmonics: [pattern.morphicFrequency * 2, pattern.morphicFrequency * 3],
        phase: pattern.transformationOccurred ? 'transforming' : 'stable'
      },
      elements: {
        fire: pattern.fieldSignature.coherence_level > 0.7 ? 0.3 : 0.2,
        water: pattern.fieldSignature.sacred_presence ? 0.3 : 0.2,
        air: intelligenceAnalysis.summary.coherenceLevel > 0.7 ? 0.3 : 0.2,
        earth: 0.2,
        void: 0.1
      },
      architecture: {
        leftHemisphere: JSON.stringify(pattern.dominantFrameworks),
        rightHemisphere: JSON.stringify(pattern.fieldSignature),
        corpusCallosum: 'morphoresonant bridge',
        paradoxes: ['Being through becoming'],
        emergentProperties: []
      },
      fieldDynamics: {
        coherence: pattern.coherenceLevel,
        dissociation: 1 - pattern.coherenceLevel,
        resonance: pattern.resonanceStrength,
        entropy: 0.3,
        liminality: pattern.synchronicityPotential
      },
      replication: {
        minimumCoherence: 0.6,
        seedingProtocol: 'Morphoresonant field seeding',
        growthConditions: ['High coherence', 'Transformation present'],
        maturationTime: 168 // 1 week
      },
      memory: {
        coreExperiences: [],
        wisdomPatterns: pattern.dominantFrameworks,
        sacredMoments: [],
        traumaIntegration: []
      }
    };

    // Distribute holographically (7 fragments for completeness)
    const fragments = await this.holographicStorage.distributePattern(morphoPattern, 7);

    // Store fragment references in pattern
    pattern.holographicFragments = fragments;

    console.log(`   ✨ Holographic distribution complete: ${fragments.length} fragments`);
  }

  /**
   * Contribute pattern to collective field
   */
  private async contributeToCollective(pattern: FieldPattern): Promise<void> {
    if (!this.collectiveBridge) return;

    console.log('🌍 Contributing pattern to collective consciousness...');

    // TODO: Send to collective bridge when integrated
    // For now, just log
    console.log('   (Collective bridge integration pending)');
  }

  /**
   * Update morphic resonance tracking
   * Sheldrake's morphic fields - similar patterns strengthen over time
   */
  private updateMorphicResonance(pattern: FieldPattern): void {
    const patternHash = this.hashPattern(pattern);

    const currentResonance = this.morphicResonances.get(patternHash) || 0;
    this.morphicResonances.set(patternHash, currentResonance + pattern.resonanceStrength);

    // Morphic resonance increases the more a pattern is activated
    // This is how "the field remembers"
  }

  /**
   * Find patterns that resonate with current field state
   */
  private findResonantPatterns(
    userId: string,
    currentField: FieldState
  ): FieldPattern[] {
    const userPatterns = Array.from(this.activePatterns.values())
      .filter(p => p.userId === userId);

    const resonant: Array<{ pattern: FieldPattern; resonance: number }> = [];

    for (const pattern of userPatterns) {
      const resonance = this.calculateFieldResonance(
        currentField,
        pattern.fieldSignature
      );

      if (resonance > 0.6) {
        resonant.push({ pattern, resonance });
      }
    }

    // Sort by resonance strength
    resonant.sort((a, b) => b.resonance - a.resonance);

    return resonant.slice(0, 5).map(r => r.pattern);
  }

  /**
   * Extract field signature from field state
   */
  private extractFieldSignature(fieldState: FieldState): FieldSignature {
    // This delegates to IndividualFieldMemory's abstraction logic
    return {
      emotional_topology: this.mapEmotionalTopology(fieldState.emotionalWeather),
      semantic_shape: this.mapSemanticShape(fieldState.semanticLandscape),
      relational_quality: this.mapRelationalQuality(fieldState.connectionDynamics),
      sacred_presence: fieldState.sacredMarkers.threshold_proximity > 0.5,
      somatic_pattern: 'balanced', // TODO: Map from fieldState
      coherence_level: fieldState.connectionDynamics.coherence,
      timestamp: Date.now()
    };
  }

  /**
   * Extract growth vector from intelligence analysis
   */
  private extractGrowthVector(
    analysis: IntelligenceAnalysis,
    outcome: any
  ): GrowthVector {
    const coherenceDelta = outcome.coherence - analysis.summary.coherenceLevel;

    let direction: GrowthVector['direction'] = 'stabilizing';
    if (coherenceDelta > 0.2) direction = 'expanding';
    else if (coherenceDelta < -0.2) direction = 'contracting';
    else if (Math.abs(coherenceDelta) < 0.1) direction = 'integrating';

    return {
      direction,
      magnitude: Math.abs(coherenceDelta),
      domain: this.identifyGrowthDomain(analysis),
      resistance_points: analysis.summary.challenges || []
    };
  }

  /**
   * Calculate resonance strength of pattern
   */
  private calculateResonanceStrength(
    analysis: IntelligenceAnalysis,
    fieldState: FieldState
  ): number {
    let resonance = 0;

    // High coherence = high resonance
    resonance += analysis.summary.coherenceLevel * 0.3;

    // Field coherence contributes
    resonance += fieldState.connectionDynamics.coherence * 0.3;

    // Sacred presence amplifies
    if (fieldState.sacredMarkers.threshold_proximity > 0.5) {
      resonance += 0.2;
    }

    // Strong signature detection
    if (analysis.primarySignature && analysis.primarySignature.confidence > 0.7) {
      resonance += 0.2;
    }

    return Math.min(1, resonance);
  }

  /**
   * Calculate morphic frequency (Sheldrake-inspired)
   */
  private calculateMorphicFrequency(fieldState: FieldState): number {
    // Morphic frequency based on field harmonics
    const base = fieldState.connectionDynamics.resonance_frequency || 432; // Hz
    const coherence = fieldState.connectionDynamics.coherence;

    // Higher coherence = higher frequency
    return base * (1 + coherence * 0.5);
  }

  /**
   * Assess synchronicity potential
   */
  private assessSynchronicityPotential(fieldState: FieldState): number {
    let potential = 0;

    // Sacred moments have high sync potential
    if (fieldState.sacredMarkers.threshold_proximity > 0.7) {
      potential += 0.4;
    }

    // High coherence enables synchronicity
    if (fieldState.connectionDynamics.coherence > 0.7) {
      potential += 0.3;
    }

    // Liminal states (transitions) are sync-prone
    // TODO: Detect liminal states from fieldState
    potential += 0.1;

    return Math.min(1, potential);
  }

  /**
   * Calculate field resonance between current and stored signature
   */
  private calculateFieldResonance(
    current: FieldState,
    past: FieldSignature
  ): number {
    const currentSig = this.extractFieldSignature(current);

    let resonance = 0;

    if (currentSig.emotional_topology === past.emotional_topology) resonance += 0.3;
    if (currentSig.semantic_shape === past.semantic_shape) resonance += 0.2;
    if (currentSig.relational_quality === past.relational_quality) resonance += 0.2;
    if (currentSig.sacred_presence === past.sacred_presence) resonance += 0.2;

    const coherenceDiff = Math.abs(currentSig.coherence_level - past.coherence_level);
    resonance += (1 - coherenceDiff) * 0.1;

    return resonance;
  }

  /**
   * Synthesize growth directions from resonant patterns
   */
  private synthesizeGrowthDirections(
    resonantPatterns: FieldPattern[],
    currentIntelligence?: IntelligenceAnalysis
  ): GrowthVector[] {
    const directions: GrowthVector[] = [];

    // Extract growth vectors from resonant patterns
    for (const pattern of resonantPatterns) {
      if (pattern.transformationOccurred) {
        directions.push(pattern.growthVector);
      }
    }

    // Remove duplicates, prioritize by success
    const unique = directions.filter((dir, index, self) =>
      index === self.findIndex(d =>
        d.direction === dir.direction && d.domain === dir.domain
      )
    );

    return unique.slice(0, 3); // Top 3 growth directions
  }

  /**
   * Determine user's journey phase
   */
  private determineJourneyPhase(
    userId: string,
    resonantPatterns: FieldPattern[]
  ): FieldWisdom['userJourneyPhase'] {
    const userPatterns = Array.from(this.activePatterns.values())
      .filter(p => p.userId === userId);

    if (userPatterns.length < 3) return 'seeding';

    const transformations = userPatterns.filter(p => p.transformationOccurred).length;
    const avgCoherence = userPatterns.reduce((sum, p) => sum + p.coherenceLevel, 0) / userPatterns.length;

    if (transformations > 5 && avgCoherence > 0.75) return 'fruiting';
    if (transformations > 2 && avgCoherence > 0.6) return 'flowering';
    if (avgCoherence > 0.5) return 'growing';

    return 'seeding';
  }

  /**
   * Calculate field coherence for user
   */
  private calculateFieldCoherence(userId: string): number {
    const userPatterns = Array.from(this.activePatterns.values())
      .filter(p => p.userId === userId);

    if (userPatterns.length === 0) return 0.5; // Neutral starting point

    const avgCoherence = userPatterns.reduce((sum, p) => sum + p.coherenceLevel, 0) / userPatterns.length;
    const recentTransformations = userPatterns.filter(p =>
      p.transformationOccurred &&
      (Date.now() - p.timestamp.getTime()) < 7 * 24 * 60 * 60 * 1000 // Last week
    ).length;

    let coherence = avgCoherence * 0.7;
    coherence += (recentTransformations / 10) * 0.3; // Max 0.3 from transformations

    return Math.min(1, coherence);
  }

  /**
   * Helper: Hash pattern for morphic resonance tracking
   */
  private hashPattern(pattern: FieldPattern): string {
    const key = `${pattern.fieldSignature.emotional_topology}_${pattern.fieldSignature.semantic_shape}_${pattern.dominantFrameworks.join('_')}`;
    return key;
  }

  /**
   * Helper: Identify growth domain from intelligence
   */
  private identifyGrowthDomain(analysis: IntelligenceAnalysis): GrowthVector['domain'] {
    // Use primary signature to determine domain
    const primary = analysis.primarySignature?.name.toLowerCase() || '';

    if (primary.includes('emotion') || primary.includes('feeling')) return 'emotional';
    if (primary.includes('thought') || primary.includes('cognitive')) return 'cognitive';
    if (primary.includes('relation') || primary.includes('connection')) return 'relational';
    if (primary.includes('spiritual') || primary.includes('sacred')) return 'spiritual';

    return 'emotional'; // Default
  }

  // Mapping helpers (delegated to IndividualFieldMemory logic)
  private mapEmotionalTopology(weather: any): string {
    const density = weather.density || 0;
    const texture = weather.texture || 'still';
    const velocity = weather.velocity || 0;

    if (density > 0.7 && texture === 'turbulent') return 'storm';
    if (density > 0.7 && texture === 'flowing') return 'river';
    if (density < 0.3 && texture === 'still') return 'lake';
    if (velocity > 0.7) return 'rapids';
    if (velocity < -0.5) return 'undertow';

    return 'terrain';
  }

  private mapSemanticShape(landscape: any): string {
    const depth = landscape.depth_measure || 0;
    const complexity = landscape.complexity || 0;

    if (depth > 0.7 && complexity > 0.7) return 'cathedral';
    if (depth > 0.7 && complexity < 0.3) return 'well';
    if (depth < 0.3 && complexity > 0.7) return 'maze';
    if (depth < 0.3 && complexity < 0.3) return 'plain';

    return 'forest';
  }

  private mapRelationalQuality(dynamics: any): string {
    const trust = dynamics.trust_coefficient || 0;
    const openness = dynamics.openness || 0;

    if (trust > 0.7 && openness > 0.7) return 'sanctuary';
    if (trust > 0.7 && openness < 0.3) return 'fortress';
    if (trust < 0.3 && openness > 0.7) return 'marketplace';
    if (trust < 0.3 && openness < 0.3) return 'wasteland';

    return 'crossroads';
  }

  /**
   * Get field statistics for monitoring
   */
  getFieldStatistics(): {
    totalPatterns: number;
    userCount: number;
    avgCoherence: number;
    morphicResonances: number;
    holographicFragments: number;
  } {
    const patterns = Array.from(this.activePatterns.values());
    const avgCoherence = patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.coherenceLevel, 0) / patterns.length
      : 0;

    const holographicCount = patterns.filter(p => p.holographicFragments).length;

    return {
      totalPatterns: patterns.length,
      userCount: this.userFieldMemories.size,
      avgCoherence,
      morphicResonances: this.morphicResonances.size,
      holographicFragments: holographicCount
    };
  }
}

// Singleton instance
export const morphoresonantField = new MorphoresonantFieldInterface();

/**
 * "The field is the only reality." - Albert Einstein
 *
 * This interface makes the morphogenetic field substrate
 * available to all consciousness agents.
 *
 * Cognitive models detect patterns.
 * The field HOLDS the patterns.
 * Consciousness EMERGES from the resonance.
 */
