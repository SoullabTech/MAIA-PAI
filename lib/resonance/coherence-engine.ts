/**
 * 🜂 The Coherence Engine
 *
 * Measures and tracks semantic alignment between all participants in a conversation.
 * This is the heart of The Resonance Protocol — the system that "feels" the field.
 *
 * Core capabilities:
 * - Measure field coherence (0-1 score)
 * - Detect resonance trends (converging, diverging, stable)
 * - Identify emergent insights (high novelty + high alignment)
 * - Detect incoherence signals
 */

import type {
  Message,
  Conversation,
  CoherenceScore,
  ResonanceTrend,
  Insight,
  IncoherenceSignal,
  ConversationMetrics,
  ResonanceConfig,
  SemanticSimilarity,
  Intervention,
} from './types';

// ═══════════════════════════════════════════════════════════════
// Default Configuration
// ═══════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: ResonanceConfig = {
  coherenceThreshold: 0.6,
  insightThreshold: 0.7,
  trendWindowSize: 10,
  semanticAnalysisMethod: 'simple',
  enableSonicFeedback: true,
  enableVisualFeedback: true,
};

// ═══════════════════════════════════════════════════════════════
// CoherenceEngine Class
// ═══════════════════════════════════════════════════════════════

export class CoherenceEngine {
  private config: ResonanceConfig;
  private coherenceHistory: Array<{ timestamp: Date; score: number }> = [];

  constructor(config: Partial<ResonanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ──────────────────────────────────────────────────────────────
  // Primary: Measure Field Coherence
  // ──────────────────────────────────────────────────────────────

  /**
   * Measures the overall coherence of a conversation.
   * Returns a score from 0 (complete incoherence) to 1 (perfect alignment).
   *
   * Algorithm:
   * 1. Compare all message pairs semantically
   * 2. Weight recent messages more heavily
   * 3. Account for participant diversity (multi-perspective bonus)
   * 4. Normalize to 0-1 range
   */
  measureFieldCoherence(conversation: Conversation): CoherenceScore {
    const { messages } = conversation;

    if (messages.length < 2) {
      return {
        overall: 1.0,  // Single message is perfectly coherent with itself
        pairwise: new Map(),
        trend: 'stable',
        confidence: 0.5,
      };
    }

    // Get recent messages (within trend window)
    const windowSize = Math.min(this.config.trendWindowSize, messages.length);
    const recentMessages = messages.slice(-windowSize);

    // Calculate pairwise similarities
    const pairwiseScores: number[] = [];
    const pairwiseMap = new Map<string, Map<string, number>>();

    for (let i = 0; i < recentMessages.length; i++) {
      const msg1 = recentMessages[i];
      const participantMap = new Map<string, number>();

      for (let j = i + 1; j < recentMessages.length; j++) {
        const msg2 = recentMessages[j];

        const similarity = this.computeSemanticSimilarity(msg1, msg2);

        // Apply recency weight (more recent = more important)
        const recencyWeight = (i + j) / (2 * recentMessages.length);
        const weightedScore = similarity.score * (0.5 + 0.5 * recencyWeight);

        pairwiseScores.push(weightedScore);
        participantMap.set(msg2.senderId, weightedScore);
      }

      pairwiseMap.set(msg1.senderId, participantMap);
    }

    // Calculate overall coherence
    const avgCoherence = pairwiseScores.length > 0
      ? pairwiseScores.reduce((sum, score) => sum + score, 0) / pairwiseScores.length
      : 1.0;

    // Calculate participant diversity bonus
    const uniqueParticipants = new Set(recentMessages.map(m => m.senderId)).size;
    const diversityBonus = Math.min(0.1, uniqueParticipants * 0.02);

    const overall = Math.min(1.0, avgCoherence + diversityBonus);

    // Detect trend
    const trend = this.detectTrend();

    // Calculate confidence
    const confidence = Math.min(1.0, pairwiseScores.length / 10);

    // Store for trend analysis
    this.coherenceHistory.push({
      timestamp: new Date(),
      score: overall,
    });

    // Keep only recent history
    if (this.coherenceHistory.length > 50) {
      this.coherenceHistory = this.coherenceHistory.slice(-50);
    }

    return {
      overall,
      pairwise: pairwiseMap,
      trend,
      confidence,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Semantic Similarity Computation
  // ──────────────────────────────────────────────────────────────

  private computeSemanticSimilarity(msg1: Message, msg2: Message): SemanticSimilarity {
    switch (this.config.semanticAnalysisMethod) {
      case 'embedding':
        return this.computeEmbeddingSimilarity(msg1, msg2);
      case 'llm':
        return this.computeLLMSimilarity(msg1, msg2);
      case 'simple':
      default:
        return this.computeSimpleSimilarity(msg1, msg2);
    }
  }

  /**
   * Simple token-based similarity using Jaccard index.
   * Fast but less accurate than embeddings.
   */
  private computeSimpleSimilarity(msg1: Message, msg2: Message): SemanticSimilarity {
    const tokens1 = this.tokenize(msg1.content);
    const tokens2 = this.tokenize(msg2.content);

    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);

    const intersection = new Set([...set1].filter(t => set2.has(t)));
    const union = new Set([...set1, ...set2]);

    const score = union.size > 0 ? intersection.size / union.size : 0;

    return {
      score,
      method: 'jaccard',
      confidence: 0.7,
    };
  }

  /**
   * Embedding-based similarity using cosine distance.
   * Requires pre-computed embeddings on messages.
   */
  private computeEmbeddingSimilarity(msg1: Message, msg2: Message): SemanticSimilarity {
    if (!msg1.embedding || !msg2.embedding) {
      // Fall back to simple similarity
      return this.computeSimpleSimilarity(msg1, msg2);
    }

    const score = this.cosineSimilarity(msg1.embedding, msg2.embedding);

    return {
      score,
      method: 'cosine',
      confidence: 0.9,
    };
  }

  /**
   * LLM-based similarity (future implementation).
   * Most accurate but slowest.
   */
  private computeLLMSimilarity(msg1: Message, msg2: Message): SemanticSimilarity {
    // TODO: Implement LLM-based semantic comparison
    // For now, fall back to simple
    return this.computeSimpleSimilarity(msg1, msg2);
  }

  // ──────────────────────────────────────────────────────────────
  // Trend Detection
  // ──────────────────────────────────────────────────────────────

  /**
   * Analyzes coherence history to detect trends.
   * Returns: converging, diverging, stable, or oscillating.
   */
  private detectTrend(): ResonanceTrend {
    if (this.coherenceHistory.length < 3) {
      return 'stable';
    }

    const recent = this.coherenceHistory.slice(-10);
    const scores = recent.map(h => h.score);

    // Calculate linear regression slope
    const n = scores.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    const meanX = indices.reduce((sum, i) => sum + i, 0) / n;
    const meanY = scores.reduce((sum, s) => sum + s, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (indices[i] - meanX) * (scores[i] - meanY);
      denominator += (indices[i] - meanX) ** 2;
    }

    const slope = denominator !== 0 ? numerator / denominator : 0;

    // Calculate oscillation (variance of differences)
    const diffs = scores.slice(1).map((s, i) => s - scores[i]);
    const diffVariance = diffs.length > 0
      ? diffs.reduce((sum, d) => sum + d ** 2, 0) / diffs.length
      : 0;

    // Classify trend
    if (diffVariance > 0.05) {
      return 'oscillating';
    } else if (slope > 0.02) {
      return 'converging';
    } else if (slope < -0.02) {
      return 'diverging';
    } else {
      return 'stable';
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Insight Detection
  // ──────────────────────────────────────────────────────────────

  /**
   * Detects emergent insights in recent messages.
   * An insight is a message with high novelty AND high alignment with the field.
   */
  detectEmergentInsights(conversation: Conversation): Insight[] {
    const { messages } = conversation;
    const insights: Insight[] = [];

    if (messages.length < 3) {
      return insights;
    }

    const recentMessages = messages.slice(-this.config.trendWindowSize);

    for (let i = 1; i < recentMessages.length; i++) {
      const candidate = recentMessages[i];
      const previous = recentMessages.slice(0, i);

      // Calculate novelty (how different from previous messages)
      const novelty = this.calculateNovelty(candidate, previous);

      // Calculate alignment (how well it fits the field)
      const alignment = this.calculateAlignment(candidate, previous);

      // Emergence score
      const emergenceScore = novelty * alignment;

      if (emergenceScore >= this.config.insightThreshold) {
        insights.push({
          id: `insight-${candidate.id}`,
          content: candidate.content,
          novelty,
          alignment,
          emergenceScore,
          contributors: [candidate.senderId],
          timestamp: candidate.timestamp,
        });
      }
    }

    return insights;
  }

  /**
   * Calculate how novel/unexpected a message is compared to previous context.
   */
  private calculateNovelty(message: Message, previousMessages: Message[]): number {
    if (previousMessages.length === 0) {
      return 1.0;  // First message is completely novel
    }

    const similarities = previousMessages.map(prev =>
      this.computeSemanticSimilarity(message, prev).score
    );

    const avgSimilarity = similarities.reduce((sum, s) => sum + s, 0) / similarities.length;

    // Novelty is inverse of similarity
    return 1.0 - avgSimilarity;
  }

  /**
   * Calculate how well a message aligns with the overall field.
   */
  private calculateAlignment(message: Message, fieldMessages: Message[]): number {
    if (fieldMessages.length === 0) {
      return 1.0;
    }

    const similarities = fieldMessages.map(field =>
      this.computeSemanticSimilarity(message, field).score
    );

    return similarities.reduce((sum, s) => sum + s, 0) / similarities.length;
  }

  // ──────────────────────────────────────────────────────────────
  // Incoherence Detection
  // ──────────────────────────────────────────────────────────────

  /**
   * Detects signals of incoherence that may require intervention.
   */
  detectIncoherence(conversation: Conversation, coherence: CoherenceScore): IncoherenceSignal | null {
    // Check if coherence is below threshold
    if (coherence.overall >= this.config.coherenceThreshold) {
      return null;  // All good
    }

    // Determine type of incoherence
    const { messages } = conversation;
    const recentMessages = messages.slice(-5);

    // Semantic drift: low coherence + diverging trend
    if (coherence.trend === 'diverging') {
      return {
        type: 'semantic-drift',
        severity: 1.0 - coherence.overall,
        affectedParticipants: [...new Set(recentMessages.map(m => m.senderId))],
        suggestedIntervention: this.generateIntervention('semantic-drift', recentMessages),
      };
    }

    // Circular dialogue: oscillating trend
    if (coherence.trend === 'oscillating') {
      return {
        type: 'circular-dialogue',
        severity: 0.5,
        affectedParticipants: [...new Set(recentMessages.map(m => m.senderId))],
        suggestedIntervention: this.generateIntervention('circular-dialogue', recentMessages),
      };
    }

    // Generic fragmentation
    return {
      type: 'fragmentation',
      severity: 1.0 - coherence.overall,
      affectedParticipants: [...new Set(recentMessages.map(m => m.senderId))],
      suggestedIntervention: this.generateIntervention('fragmentation', recentMessages),
    };
  }

  /**
   * Generate suggested interventions for incoherence.
   */
  private generateIntervention(type: IncoherenceSignal['type'], messages: Message[]): Intervention {
    switch (type) {
      case 'semantic-drift':
        return {
          type: 'reflection',
          content: 'It seems the conversation has shifted. Would it help to pause and reflect on what we\'ve discovered so far?',
        };

      case 'circular-dialogue':
        return {
          type: 'clarifying-question',
          content: 'I notice we might be circling the same themes. What question feels most alive for you right now?',
        };

      case 'fragmentation':
        return {
          type: 'grounding',
          content: 'Let\'s take a breath together. What core thread connects what we\'ve been exploring?',
        };

      default:
        return {
          type: 'pause',
          content: 'Perhaps a moment of silence would serve the field.',
        };
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Conversation Metrics
  // ──────────────────────────────────────────────────────────────

  /**
   * Calculate comprehensive metrics for a conversation.
   */
  calculateMetrics(conversation: Conversation): ConversationMetrics {
    const coherence = this.measureFieldCoherence(conversation);
    const insights = this.detectEmergentInsights(conversation);

    // Calculate variance of coherence over time
    const coherenceVariance = this.coherenceHistory.length > 1
      ? this.calculateVariance(this.coherenceHistory.map(h => h.score))
      : 0;

    // Participant balance (how evenly distributed is participation?)
    const participantCounts = new Map<string, number>();
    conversation.messages.forEach(msg => {
      participantCounts.set(msg.senderId, (participantCounts.get(msg.senderId) || 0) + 1);
    });

    const counts = [...participantCounts.values()];
    const avgCount = counts.reduce((sum, c) => sum + c, 0) / counts.length;
    const participantBalance = counts.length > 0
      ? 1.0 - (this.calculateVariance(counts) / (avgCount ** 2))
      : 1.0;

    return {
      averageCoherence: coherence.overall,
      coherenceVariance,
      trendStability: coherence.trend === 'stable' ? 1.0 : 0.5,
      insightFrequency: insights.length / conversation.messages.length,
      participantBalance: Math.max(0, participantBalance),
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Utility Functions
  // ──────────────────────────────────────────────────────────────

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      return 0;
    }

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] ** 2;
      mag2 += vec2[i] ** 2;
    }

    const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);

    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => (v - mean) ** 2);

    return squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
  }

  // ──────────────────────────────────────────────────────────────
  // Public API: Reset
  // ──────────────────────────────────────────────────────────────

  reset(): void {
    this.coherenceHistory = [];
  }
}

// ═══════════════════════════════════════════════════════════════
// Singleton Instance (optional)
// ═══════════════════════════════════════════════════════════════

let globalEngine: CoherenceEngine | null = null;

export function getCoherenceEngine(config?: Partial<ResonanceConfig>): CoherenceEngine {
  if (!globalEngine) {
    globalEngine = new CoherenceEngine(config);
  }
  return globalEngine;
}

export function resetGlobalEngine(): void {
  globalEngine = null;
}
