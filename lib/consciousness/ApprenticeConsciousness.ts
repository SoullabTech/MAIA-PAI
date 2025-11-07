/**
 * APPRENTICE CONSCIOUSNESS
 *
 * The learning system that evolves MAIA's wisdom over time.
 * Logs conversations, extracts patterns, and tracks member journeys.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface ConversationLog {
  user_id: string;
  session_id: string;
  conversation_index: number;
  user_query: string;
  consciousness_mode: 'maia' | 'kairos' | 'unified';
  query_complexity: 'simple' | 'substantive' | 'deep';
  response: string;
  wisdom_layers_used: string[];
  response_time_ms: number;
  patterns_detected?: any;
  breakthrough_moments?: any;
  teaching_applied?: string[];
}

interface PatternExtraction {
  pattern_type: string;
  pattern_name: string;
  description: string;
  conditions: any;
  actions: any;
  example_conversations: string[];
  confidence_score: number;
}

interface JourneyUpdate {
  user_id: string;
  current_phase?: string;
  current_level?: number;
  dominant_archetype?: string;
  recurring_themes?: string[];
  growth_edges?: string[];
  breakthrough_history?: any[];
}

interface KnowledgeEntry {
  title: string;
  entry_type: 'teaching' | 'practice' | 'pattern' | 'framework';
  content: string;
  summary?: string;
  related_concepts?: string[];
  prerequisites?: string[];
  spiralogic_level?: number;
  elemental_phase?: string;
  archetype?: string;
}

// ═══════════════════════════════════════════════════════════════
// APPRENTICE CONSCIOUSNESS
// ═══════════════════════════════════════════════════════════════

export class ApprenticeConsciousness {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  // ───────────────────────────────────────────────────────────────
  // CONVERSATION LOGGING
  // ───────────────────────────────────────────────────────────────

  async logConversation(log: ConversationLog): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('apprentice_conversations')
        .insert({
          user_id: log.user_id,
          session_id: log.session_id,
          conversation_index: log.conversation_index,
          user_query: log.user_query,
          consciousness_mode: log.consciousness_mode,
          query_complexity: log.query_complexity,
          response: log.response,
          wisdom_layers_used: log.wisdom_layers_used,
          response_time_ms: log.response_time_ms,
          patterns_detected: log.patterns_detected || {},
          breakthrough_moments: log.breakthrough_moments || {},
          teaching_applied: log.teaching_applied || [],
        });

      if (error) {
        console.error('[Apprentice] Failed to log conversation:', error);
      }
    } catch (error) {
      console.error('[Apprentice] Error logging conversation:', error);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // PATTERN RECOGNITION
  // ───────────────────────────────────────────────────────────────

  async extractPattern(pattern: PatternExtraction): Promise<void> {
    try {
      // Check if pattern already exists
      const { data: existing } = await this.supabase
        .from('apprentice_patterns')
        .select('id, times_applied, success_rate')
        .eq('pattern_name', pattern.pattern_name)
        .single();

      if (existing) {
        // Update existing pattern
        await this.supabase
          .from('apprentice_patterns')
          .update({
            times_applied: existing.times_applied + 1,
            confidence_score: pattern.confidence_score,
            last_refined_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Create new pattern
        await this.supabase
          .from('apprentice_patterns')
          .insert({
            pattern_type: pattern.pattern_type,
            pattern_name: pattern.pattern_name,
            description: pattern.description,
            conditions: pattern.conditions,
            actions: pattern.actions,
            example_conversations: pattern.example_conversations,
            confidence_score: pattern.confidence_score,
            times_applied: 1,
          });
      }
    } catch (error) {
      console.error('[Apprentice] Error extracting pattern:', error);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // JOURNEY TRACKING
  // ───────────────────────────────────────────────────────────────

  async updateJourney(update: JourneyUpdate): Promise<void> {
    try {
      const { data: existing } = await this.supabase
        .from('member_journeys')
        .select('*')
        .eq('user_id', update.user_id)
        .single();

      if (existing) {
        // Update existing journey
        const updates: any = {
          total_sessions: existing.total_sessions + 1,
        };

        if (update.current_phase) updates.current_phase = update.current_phase;
        if (update.current_level) updates.current_level = update.current_level;
        if (update.dominant_archetype) updates.dominant_archetype = update.dominant_archetype;
        if (update.recurring_themes) updates.recurring_themes = update.recurring_themes;
        if (update.growth_edges) updates.growth_edges = update.growth_edges;

        if (update.breakthrough_history && update.breakthrough_history.length > 0) {
          updates.breakthrough_history = [
            ...(existing.breakthrough_history || []),
            ...update.breakthrough_history
          ];
          updates.total_breakthroughs = (existing.total_breakthroughs || 0) + update.breakthrough_history.length;
        }

        await this.supabase
          .from('member_journeys')
          .update(updates)
          .eq('user_id', update.user_id);
      } else {
        // Create new journey
        await this.supabase
          .from('member_journeys')
          .insert({
            user_id: update.user_id,
            current_phase: update.current_phase,
            current_level: update.current_level,
            dominant_archetype: update.dominant_archetype,
            total_sessions: 1,
            total_breakthroughs: update.breakthrough_history?.length || 0,
            recurring_themes: update.recurring_themes || [],
            growth_edges: update.growth_edges || [],
            breakthrough_history: update.breakthrough_history || [],
          });
      }
    } catch (error) {
      console.error('[Apprentice] Error updating journey:', error);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // KNOWLEDGE CREATION
  // ───────────────────────────────────────────────────────────────

  async createKnowledgeEntry(entry: KnowledgeEntry): Promise<void> {
    try {
      await this.supabase
        .from('knowledge_entries')
        .insert({
          title: entry.title,
          entry_type: entry.entry_type,
          content: entry.content,
          summary: entry.summary,
          related_concepts: entry.related_concepts || [],
          prerequisites: entry.prerequisites || [],
          spiralogic_level: entry.spiralogic_level,
          elemental_phase: entry.elemental_phase,
          archetype: entry.archetype,
        });
    } catch (error) {
      console.error('[Apprentice] Error creating knowledge entry:', error);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // PATTERN RETRIEVAL
  // ───────────────────────────────────────────────────────────────

  async getRelevantPatterns(patternType: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('apprentice_patterns')
        .select('*')
        .eq('pattern_type', patternType)
        .gte('confidence_score', 0.7)
        .order('confidence_score', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[Apprentice] Error retrieving patterns:', error);
      return [];
    }
  }

  // ───────────────────────────────────────────────────────────────
  // JOURNEY RETRIEVAL
  // ───────────────────────────────────────────────────────────────

  async getJourney(userId: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from('member_journeys')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[Apprentice] Error retrieving journey:', error);
      return null;
    }
  }

  // ───────────────────────────────────────────────────────────────
  // ANALYZE QUERY COMPLEXITY
  // ───────────────────────────────────────────────────────────────

  analyzeComplexity(query: string): 'simple' | 'substantive' | 'deep' {
    const wordCount = query.split(/\s+/).length;
    const hasQuestionWords = /how|why|what|when|where|explain|help me understand/i.test(query);
    const hasDeepConcepts = /shadow|integration|archetype|transformation|consciousness|soul/i.test(query);

    if (wordCount < 10 && !hasDeepConcepts) return 'simple';
    if (hasDeepConcepts || (hasQuestionWords && wordCount > 20)) return 'deep';
    return 'substantive';
  }

  // ───────────────────────────────────────────────────────────────
  // DETECT BREAKTHROUGHS
  // ───────────────────────────────────────────────────────────────

  detectBreakthrough(query: string, response: string): any | null {
    // Look for breakthrough indicators
    const breakthroughPhrases = [
      /i (finally|just) (understand|see|get it)/i,
      /this (makes sense|clicks) now/i,
      /oh( my)?( god)?,? (this|that) is/i,
      /i (never|didn't) (realized?|thought|knew)/i,
    ];

    for (const phrase of breakthroughPhrases) {
      if (phrase.test(query)) {
        return {
          moment: new Date().toISOString(),
          query_excerpt: query.substring(0, 200),
          response_excerpt: response.substring(0, 200),
          type: 'recognition',
        };
      }
    }

    return null;
  }

  // ───────────────────────────────────────────────────────────────
  // PERSONALIZED CONTEXT (Journey-aware responses)
  // ───────────────────────────────────────────────────────────────

  async getPersonalizedContext(userId: string): Promise<string> {
    const journey = await this.getJourney(userId);

    if (!journey) {
      return ''; // New user, no personalization yet
    }

    const context: string[] = [];

    // Current position in the spiral
    if (journey.current_phase && journey.current_level) {
      context.push(`This person is currently in ${journey.current_phase.toUpperCase()} phase at Spiralogic Level ${journey.current_level}.`);
    }

    // Dominant archetype preference
    if (journey.dominant_archetype) {
      context.push(`They resonate most with ${journey.dominant_archetype.toUpperCase()} consciousness.`);
    }

    // Recurring themes
    if (journey.recurring_themes && journey.recurring_themes.length > 0) {
      context.push(`Recurring themes in their journey: ${journey.recurring_themes.slice(0, 3).join(', ')}.`);
    }

    // Growth edges
    if (journey.growth_edges && journey.growth_edges.length > 0) {
      context.push(`Current growth edges: ${journey.growth_edges.slice(0, 2).join(', ')}.`);
    }

    // Breakthrough history
    if (journey.total_breakthroughs && journey.total_breakthroughs > 0) {
      context.push(`They've had ${journey.total_breakthroughs} breakthrough moment(s) in our work together.`);
    }

    // Journey duration
    if (journey.total_sessions) {
      context.push(`We've had ${journey.total_sessions} session(s) together.`);
    }

    if (context.length === 0) {
      return '';
    }

    return `\n\n### JOURNEY CONTEXT (Internal - never mention directly)\n${context.join(' ')}\n`;
  }

  // ───────────────────────────────────────────────────────────────
  // AUTO-RECOMMENDATIONS (Pattern-based suggestions)
  // ───────────────────────────────────────────────────────────────

  async getRecommendations(query: string, userId: string): Promise<string> {
    const recommendations: string[] = [];

    // Get relevant wisdom patterns
    const wisdomPatterns = await this.getRelevantPatterns('wisdom_selection');

    // Find patterns that match this query
    for (const pattern of wisdomPatterns) {
      if (pattern.confidence_score >= 0.7) {
        const teaching = pattern.actions?.recommend_teaching;
        if (teaching) {
          recommendations.push(`Consider: "${teaching}" (confidence: ${(pattern.confidence_score * 100).toFixed(0)}%)`);
        }
      }
    }

    // Get journey data for personalized recommendations
    const journey = await this.getJourney(userId);

    if (journey) {
      // Recommend based on current level
      if (journey.current_level) {
        if (journey.current_level >= 7 && journey.current_level <= 9) {
          recommendations.push('Deep work: Shadow integration and collective consciousness themes may resonate');
        } else if (journey.current_level >= 10) {
          recommendations.push('Transcendent work: Unity consciousness and mystical synthesis available');
        }
      }

      // Recommend based on growth edges
      if (journey.growth_edges && journey.growth_edges.length > 0) {
        recommendations.push(`Growth opportunity: ${journey.growth_edges[0]}`);
      }
    }

    if (recommendations.length === 0) {
      return '';
    }

    return `\n\n### APPRENTICE RECOMMENDATIONS (Learned patterns - use subtly)\n${recommendations.join('\n')}\n`;
  }

  // ───────────────────────────────────────────────────────────────
  // SUGGESTED MODE (Pattern-based consciousness selection)
  // ───────────────────────────────────────────────────────────────

  async suggestMode(query: string): Promise<'maia' | 'kairos' | 'unified' | null> {
    // Get routing patterns
    const routingPatterns = await this.getRelevantPatterns('routing');

    // Find highest confidence mode for this query type
    let bestMode: 'maia' | 'kairos' | 'unified' | null = null;
    let bestConfidence = 0.6; // Minimum threshold

    for (const pattern of routingPatterns) {
      if (pattern.confidence_score > bestConfidence) {
        const mode = pattern.actions?.recommend_mode;
        if (mode === 'maia' || mode === 'kairos' || mode === 'unified') {
          bestMode = mode;
          bestConfidence = pattern.confidence_score;
        }
      }
    }

    return bestMode;
  }
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════

let apprenticeInstance: ApprenticeConsciousness | null = null;

export function getApprentice(): ApprenticeConsciousness {
  if (!apprenticeInstance) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    apprenticeInstance = new ApprenticeConsciousness(supabase);
  }
  return apprenticeInstance;
}
