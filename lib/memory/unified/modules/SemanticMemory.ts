/**
 * Semantic Memory Sub-Service
 *
 * Water Phase - Memory Unification
 * Handles pattern learning and collective wisdom from semantic_observations,
 * user_patterns, and learned_patterns tables
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// ================================================================
// TYPES (Re-exported from SemanticMemoryService for compatibility)
// ================================================================

export interface PatternObservation {
  userId: string;
  sessionId: string;
  input: string;
  response: string;
  detectedElement: string;
  appliedPatterns?: string[];
  userEngagement: 'high' | 'medium' | 'low';
  breakthroughDetected: boolean;
  emotionalShift: 'positive' | 'neutral' | 'negative' | 'crisis';
  sessionContinued: boolean;
  responseTimeMs?: number;
  userFeedbackRating?: number;
  userFeedbackText?: string;
}

export interface LearnedPattern {
  patternId: string;
  type: string;
  data: any;
  confidence: number;
  effectiveness: number;
  observationCount: number;
  firstObserved: Date;
  lastReinforced: Date;
}

// ================================================================
// SEMANTIC MEMORY SUB-SERVICE
// ================================================================

export class SemanticMemory {
  constructor(
    private supabase: SupabaseClient,
    private deps?: { now?: () => number }
  ) {}

  /**
   * Get all learned patterns for a user
   */
  async getUserPatterns(userId: string): Promise<LearnedPattern[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_patterns')
        .select('*')
        .eq('user_id', userId)
        .gte('confidence_score', 0.3) // Only patterns with some confidence
        .order('effectiveness_score', { ascending: false });

      if (error) {
        console.warn('⚠️ Could not retrieve user patterns:', error.message);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(p => ({
        patternId: p.pattern_id,
        type: p.pattern_type,
        data: p.pattern_data,
        confidence: p.confidence_score,
        effectiveness: p.effectiveness_score,
        observationCount: p.observation_count,
        firstObserved: new Date(p.first_observed),
        lastReinforced: new Date(p.last_reinforced)
      }));
    } catch (err) {
      console.error('❌ Error retrieving user patterns:', err);
      return [];
    }
  }

  /**
   * Get user's elemental affinities (what resonates with them)
   */
  async getElementalAffinity(userId: string): Promise<Record<string, number>> {
    const defaultAffinity: Record<string, number> = {
      fire: 0.5,
      water: 0.5,
      earth: 0.5,
      air: 0.5,
      aether: 0.5,
      shadow: 0.5
    };

    try {
      const { data, error } = await this.supabase
        .rpc('get_user_elemental_affinity', { p_user_id: userId });

      if (error || !data || data.length === 0) {
        return defaultAffinity;
      }

      const affinity: Record<string, number> = { ...defaultAffinity };

      // Populate from learned patterns
      for (const item of data) {
        if (item.element && typeof item.affinity_score === 'number') {
          affinity[item.element] = item.affinity_score;
        }
      }

      return affinity;
    } catch (err) {
      console.error('❌ Error retrieving elemental affinity:', err);
      return defaultAffinity;
    }
  }

  /**
   * Record an interaction for pattern learning
   * Simplified version - stores observation for later analysis
   */
  async recordInteraction(observation: PatternObservation): Promise<void> {
    try {
      // Calculate basic engagement score
      const engagementScore =
        observation.userEngagement === 'high' ? 0.8 :
        observation.userEngagement === 'medium' ? 0.5 :
        0.2;

      // Calculate basic effectiveness (can be enhanced later)
      const effectivenessScore =
        observation.breakthroughDetected ? 1.0 :
        observation.emotionalShift === 'positive' ? 0.7 :
        observation.emotionalShift === 'neutral' ? 0.5 :
        observation.emotionalShift === 'negative' ? 0.3 :
        0.1; // crisis

      // Store interaction outcome
      const { error: outcomeError } = await this.supabase
        .from('response_outcomes')
        .insert({
          user_id: observation.userId,
          session_id: observation.sessionId,
          user_input: observation.input,
          maia_response: observation.response,
          detected_element: observation.detectedElement,
          applied_patterns: observation.appliedPatterns || [],
          engagement_score: engagementScore,
          breakthrough_detected: observation.breakthroughDetected,
          emotional_shift: observation.emotionalShift,
          session_length_after: observation.sessionContinued ? 1 : 0,
          response_time_ms: observation.responseTimeMs,
          user_feedback_rating: observation.userFeedbackRating,
          user_feedback_text: observation.userFeedbackText,
          effectiveness_score: effectivenessScore
        });

      if (outcomeError) {
        console.warn('⚠️ Could not save interaction outcome:', outcomeError.message);
      }

      // Store semantic observation for pattern discovery
      const { error: observationError } = await this.supabase
        .from('semantic_observations')
        .insert({
          user_id: observation.userId,
          session_id: observation.sessionId,
          observation_type: 'interaction',
          observation_data: {
            element: observation.detectedElement,
            engagement: observation.userEngagement,
            breakthrough: observation.breakthroughDetected,
            emotionalShift: observation.emotionalShift,
            patterns: observation.appliedPatterns
          }
        });

      if (observationError) {
        console.warn('⚠️ Could not save semantic observation:', observationError.message);
      }
    } catch (err) {
      console.error('❌ Error recording interaction:', err);
    }
  }
}
