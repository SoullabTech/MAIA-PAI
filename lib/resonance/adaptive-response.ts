/**
 * 🜂 Adaptive Response Engine
 *
 * Detects human emotional/cognitive state and helps agents attune their responses.
 * This is the EMPATHY layer — sensing not just what humans say, but HOW they are.
 *
 * Core capabilities:
 * - Emotional tone detection (calm, excited, stressed, curious, blocked)
 * - Cognitive state detection (clear, confused, integrating, searching)
 * - Energy level detection (high, medium, low)
 * - Response modulation (tone, depth, pacing)
 * - Clarifying question generation
 */

import type {
  Message,
  HumanState,
  ResponseGuidance,
  Intervention,
  IncoherenceSignal,
} from './types';

// ═══════════════════════════════════════════════════════════════
// Detection Patterns
// ═══════════════════════════════════════════════════════════════

interface DetectionPattern {
  keywords: string[];
  weight: number;
}

const EMOTIONAL_PATTERNS: Record<HumanState['emotional'], DetectionPattern[]> = {
  calm: [
    { keywords: ['feel', 'peace', 'centered', 'grounded', 'clear', 'open'], weight: 1.0 },
    { keywords: ['notice', 'observe', 'wonder', 'curious', 'explore'], weight: 0.8 },
  ],
  excited: [
    { keywords: ['wow', 'amazing', 'incredible', 'love', 'yes!', '!', 'brilliant'], weight: 1.0 },
    { keywords: ['energy', 'alive', 'vibrant', 'powerful', 'fire'], weight: 0.8 },
  ],
  stressed: [
    { keywords: ['worried', 'anxious', 'overwhelm', 'stuck', 'pressure', 'difficult'], weight: 1.0 },
    { keywords: ['need', 'must', 'urgent', 'problem', 'struggle'], weight: 0.8 },
  ],
  curious: [
    { keywords: ['wonder', 'what if', 'how', 'why', 'explore', 'discover', '?'], weight: 1.0 },
    { keywords: ['learn', 'understand', 'know', 'curious', 'interest'], weight: 0.8 },
  ],
  blocked: [
    { keywords: ['stuck', 'lost', 'confused', 'don\'t know', 'can\'t', 'unclear'], weight: 1.0 },
    { keywords: ['frustrated', 'stuck', 'wall', 'stop', 'help'], weight: 0.8 },
  ],
};

const COGNITIVE_PATTERNS: Record<HumanState['cognitive'], DetectionPattern[]> = {
  clear: [
    { keywords: ['understand', 'see', 'clear', 'makes sense', 'realize', 'grasp'], weight: 1.0 },
    { keywords: ['precise', 'specific', 'exact', 'defined'], weight: 0.8 },
  ],
  confused: [
    { keywords: ['confused', 'unclear', 'don\'t understand', 'lost', 'what?'], weight: 1.0 },
    { keywords: ['murky', 'vague', 'uncertain', 'hazy'], weight: 0.8 },
  ],
  integrating: [
    { keywords: ['processing', 'digesting', 'sitting with', 'feeling into', 'absorbing'], weight: 1.0 },
    { keywords: ['slowly', 'gradually', 'beginning to', 'starting to see'], weight: 0.8 },
  ],
  searching: [
    { keywords: ['looking for', 'seeking', 'trying to', 'want to find', 'searching'], weight: 1.0 },
    { keywords: ['need', 'require', 'missing', 'lack'], weight: 0.8 },
  ],
};

// ═══════════════════════════════════════════════════════════════
// AdaptiveResponseEngine Class
// ═══════════════════════════════════════════════════════════════

export class AdaptiveResponseEngine {
  // ──────────────────────────────────────────────────────────────
  // Primary: Detect Human State
  // ──────────────────────────────────────────────────────────────

  /**
   * Analyzes a human's message to detect their emotional and cognitive state.
   * Uses language patterns, punctuation, word choice, and sentence structure.
   */
  detectHumanState(message: Message, recentMessages?: Message[]): HumanState {
    const content = message.content.toLowerCase();

    // Detect emotional state
    const emotional = this.detectEmotionalState(content);

    // Detect cognitive state
    const cognitive = this.detectCognitiveState(content);

    // Detect energy level
    const energy = this.detectEnergyLevel(content, message);

    // Detect if person needs space
    const needsSpace = this.detectNeedsSpace(content, recentMessages);

    return {
      emotional,
      cognitive,
      energy,
      needsSpace,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Emotional State Detection
  // ──────────────────────────────────────────────────────────────

  private detectEmotionalState(content: string): HumanState['emotional'] {
    const scores: Record<HumanState['emotional'], number> = {
      calm: 0,
      excited: 0,
      stressed: 0,
      curious: 0,
      blocked: 0,
    };

    // Calculate scores for each emotional state
    for (const [emotion, patterns] of Object.entries(EMOTIONAL_PATTERNS)) {
      for (const pattern of patterns) {
        const matches = pattern.keywords.filter(keyword =>
          content.includes(keyword.toLowerCase())
        );
        scores[emotion as HumanState['emotional']] += matches.length * pattern.weight;
      }
    }

    // Adjust for punctuation
    const exclamationCount = (content.match(/!/g) || []).length;
    const questionCount = (content.match(/\?/g) || []).length;

    scores.excited += exclamationCount * 0.5;
    scores.curious += questionCount * 0.3;

    // Return highest scoring emotion
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) {
      return 'calm';  // Default
    }

    return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as HumanState['emotional'];
  }

  // ──────────────────────────────────────────────────────────────
  // Cognitive State Detection
  // ──────────────────────────────────────────────────────────────

  private detectCognitiveState(content: string): HumanState['cognitive'] {
    const scores: Record<HumanState['cognitive'], number> = {
      clear: 0,
      confused: 0,
      integrating: 0,
      searching: 0,
    };

    // Calculate scores
    for (const [state, patterns] of Object.entries(COGNITIVE_PATTERNS)) {
      for (const pattern of patterns) {
        const matches = pattern.keywords.filter(keyword =>
          content.includes(keyword.toLowerCase())
        );
        scores[state as HumanState['cognitive']] += matches.length * pattern.weight;
      }
    }

    // Check for ellipses (integrating)
    if (content.includes('...')) {
      scores.integrating += 0.5;
    }

    // Check for questions (searching)
    if (content.includes('?')) {
      scores.searching += 0.3;
    }

    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) {
      return 'clear';  // Default
    }

    return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as HumanState['cognitive'];
  }

  // ──────────────────────────────────────────────────────────────
  // Energy Level Detection
  // ──────────────────────────────────────────────────────────────

  private detectEnergyLevel(content: string, message: Message): HumanState['energy'] {
    let energyScore = 0;

    // Long messages suggest high energy
    if (content.length > 500) {
      energyScore += 1;
    } else if (content.length < 100) {
      energyScore -= 1;
    }

    // Exclamation marks suggest high energy
    const exclamationCount = (content.match(/!/g) || []).length;
    energyScore += exclamationCount * 0.5;

    // Capital letters suggest emphasis/energy
    const capitalRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capitalRatio > 0.1) {
      energyScore += 1;
    }

    // Time of day (if timestamp available)
    const hour = message.timestamp.getHours();
    if (hour >= 6 && hour <= 10) {
      energyScore += 0.5;  // Morning energy
    } else if (hour >= 22 || hour <= 4) {
      energyScore -= 0.5;  // Late night/early morning
    }

    // Classify
    if (energyScore > 1) {
      return 'high';
    } else if (energyScore < -1) {
      return 'low';
    } else {
      return 'medium';
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Needs Space Detection
  // ──────────────────────────────────────────────────────────────

  private detectNeedsSpace(content: string, recentMessages?: Message[]): boolean {
    // Check for explicit requests for space
    const spaceKeywords = ['pause', 'wait', 'slow', 'need time', 'sit with', 'digest'];
    const needsSpaceExplicit = spaceKeywords.some(keyword => content.includes(keyword));

    if (needsSpaceExplicit) {
      return true;
    }

    // Check if message is much shorter than recent average
    if (recentMessages && recentMessages.length > 2) {
      const recentLengths = recentMessages.slice(-3).map(m => m.content.length);
      const avgLength = recentLengths.reduce((sum, len) => sum + len, 0) / recentLengths.length;

      if (content.length < avgLength * 0.3) {
        return true;  // Sudden drop in verbosity
      }
    }

    return false;
  }

  // ──────────────────────────────────────────────────────────────
  // Response Modulation
  // ──────────────────────────────────────────────────────────────

  /**
   * Generates guidance for how an agent should modulate its response
   * based on detected human state.
   */
  modulateResponse(humanState: HumanState): ResponseGuidance {
    let tone: ResponseGuidance['suggestedTone'] = 'precise';
    let depth: ResponseGuidance['suggestedDepth'] = 'moderate';
    let strategy: ResponseGuidance['complementOrDiverge'] = 'complement';

    // Modulate based on emotional state
    switch (humanState.emotional) {
      case 'stressed':
        tone = 'grounding';
        depth = 'surface';  // Don't overwhelm
        strategy = 'complement';
        break;

      case 'excited':
        tone = 'playful';
        depth = 'moderate';
        strategy = 'complement';  // Match their energy
        break;

      case 'blocked':
        tone = 'spacious';
        depth = 'surface';  // Create opening, not more complexity
        strategy = 'diverge';  // Offer new angle
        break;

      case 'curious':
        tone = 'precise';
        depth = 'deep';  // They want to go deeper
        strategy = 'complement';
        break;

      case 'calm':
        tone = 'spacious';
        depth = 'deep';  // They're ready for depth
        strategy = 'synthesize';
        break;
    }

    // Adjust based on cognitive state
    switch (humanState.cognitive) {
      case 'confused':
        depth = 'surface';
        tone = 'grounding';
        break;

      case 'integrating':
        tone = 'spacious';
        depth = 'moderate';  // Give them room
        break;

      case 'searching':
        tone = 'precise';
        strategy = 'complement';
        break;

      case 'clear':
        depth = 'deep';
        break;
    }

    // Adjust based on energy
    if (humanState.energy === 'low') {
      depth = 'surface';  // Don't overwhelm
      tone = 'grounding';
    }

    // If they need space, override
    if (humanState.needsSpace) {
      tone = 'spacious';
      depth = 'surface';
    }

    return {
      suggestedTone: tone,
      suggestedDepth: depth,
      complementOrDiverge: strategy,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Tone Application
  // ──────────────────────────────────────────────────────────────

  /**
   * Applies a tone to response content.
   * This can be used as a prompt modifier or post-processing hint.
   */
  applyTone(content: string, tone: ResponseGuidance['suggestedTone']): string {
    // This is a simplified implementation
    // In practice, this would be integrated with the LLM prompt

    const toneInstructions: Record<ResponseGuidance['suggestedTone'], string> = {
      spacious: 'Respond with breathing room. Use short paragraphs. Let silence speak.',
      precise: 'Respond with clarity and specificity. Be concise and exact.',
      playful: 'Respond with lightness and curiosity. Be warm and inviting.',
      grounding: 'Respond with calm presence. Be simple, steady, and reassuring.',
    };

    return `[Tone: ${tone}] ${toneInstructions[tone]}\n\n${content}`;
  }

  // ──────────────────────────────────────────────────────────────
  // Clarifying Questions
  // ──────────────────────────────────────────────────────────────

  /**
   * Generates clarifying questions when confusion is detected.
   */
  generateClarifyingQuestion(humanState: HumanState, recentMessages: Message[]): string | null {
    if (humanState.cognitive !== 'confused' && !humanState.needsSpace) {
      return null;  // No clarification needed
    }

    if (humanState.cognitive === 'confused') {
      const questions = [
        'What part feels most unclear to you right now?',
        'Where does the confusion begin?',
        'What would help bring clarity?',
        'Can you point to the moment where it got murky?',
        'What question is most alive for you?',
      ];

      return questions[Math.floor(Math.random() * questions.length)];
    }

    if (humanState.needsSpace) {
      const questions = [
        'Would you like to sit with this for a moment?',
        'Should we pause here?',
        'Does this need more time to settle?',
      ];

      return questions[Math.floor(Math.random() * questions.length)];
    }

    return null;
  }

  // ──────────────────────────────────────────────────────────────
  // Generate Intervention
  // ──────────────────────────────────────────────────────────────

  /**
   * Generates an intervention based on human state.
   * Used when field coherence is low AND human state suggests need for support.
   */
  generateIntervention(humanState: HumanState): Intervention | null {
    if (humanState.emotional === 'stressed' || humanState.emotional === 'blocked') {
      return {
        type: 'grounding',
        content: 'Let\'s take a breath together. What feels most essential right now?',
      };
    }

    if (humanState.cognitive === 'confused') {
      return {
        type: 'clarifying-question',
        content: this.generateClarifyingQuestion(humanState, []) || 'What would help bring clarity?',
      };
    }

    if (humanState.needsSpace) {
      return {
        type: 'pause',
        content: 'I sense you might benefit from some space. Shall we pause here?',
      };
    }

    return null;
  }

  // ──────────────────────────────────────────────────────────────
  // State Transitions
  // ──────────────────────────────────────────────────────────────

  /**
   * Analyzes how human state has changed over recent messages.
   * Useful for detecting patterns and adjusting long-term approach.
   */
  analyzeStateTransition(states: HumanState[]): {
    trend: 'improving' | 'declining' | 'stable';
    volatility: number;
  } {
    if (states.length < 2) {
      return { trend: 'stable', volatility: 0 };
    }

    // Map states to numeric scores
    const emotionalScores: Record<HumanState['emotional'], number> = {
      calm: 5,
      curious: 4,
      excited: 3,
      stressed: 2,
      blocked: 1,
    };

    const cognitiveScores: Record<HumanState['cognitive'], number> = {
      clear: 4,
      integrating: 3,
      searching: 2,
      confused: 1,
    };

    const scores = states.map(state => ({
      emotional: emotionalScores[state.emotional],
      cognitive: cognitiveScores[state.cognitive],
      total: emotionalScores[state.emotional] + cognitiveScores[state.cognitive],
    }));

    // Calculate trend
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));

    const firstAvg = firstHalf.reduce((sum, s) => sum + s.total, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.total, 0) / secondHalf.length;

    let trend: 'improving' | 'declining' | 'stable';
    if (secondAvg > firstAvg + 0.5) {
      trend = 'improving';
    } else if (secondAvg < firstAvg - 0.5) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    // Calculate volatility (variance)
    const totalScores = scores.map(s => s.total);
    const mean = totalScores.reduce((sum, s) => sum + s, 0) / totalScores.length;
    const variance = totalScores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / totalScores.length;
    const volatility = Math.sqrt(variance);

    return { trend, volatility };
  }
}

// ═══════════════════════════════════════════════════════════════
// Utility: Format State for Display
// ═══════════════════════════════════════════════════════════════

export function formatHumanState(state: HumanState): string {
  const icons: Record<HumanState['emotional'], string> = {
    calm: '😌',
    excited: '✨',
    stressed: '😰',
    curious: '🤔',
    blocked: '🧱',
  };

  const energyIcons: Record<HumanState['energy'], string> = {
    high: '⚡',
    medium: '💫',
    low: '🌙',
  };

  return `
${icons[state.emotional]} Emotional: ${state.emotional}
🧠 Cognitive: ${state.cognitive}
${energyIcons[state.energy]} Energy: ${state.energy}
${state.needsSpace ? '🌊 Needs space' : ''}
  `.trim();
}

// ═══════════════════════════════════════════════════════════════
// Singleton Instance
// ═══════════════════════════════════════════════════════════════

let globalEngine: AdaptiveResponseEngine | null = null;

export function getAdaptiveResponseEngine(): AdaptiveResponseEngine {
  if (!globalEngine) {
    globalEngine = new AdaptiveResponseEngine();
  }
  return globalEngine;
}
