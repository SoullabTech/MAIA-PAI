/**
 * PATTERN ANALYSIS SCRIPT
 *
 * Analyzes apprentice_conversations to extract learned patterns.
 * Run this periodically (e.g., daily) to evolve MAIA's wisdom.
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// ═══════════════════════════════════════════════════════════════
// PATTERN ANALYSIS
// ═══════════════════════════════════════════════════════════════

async function analyzePatterns() {
  console.log('🧠 [PATTERN ANALYSIS] Starting...\n');

  // Get recent conversations (last 100)
  const { data: conversations, error } = await supabase
    .from('apprentice_conversations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error || !conversations || conversations.length === 0) {
    console.log('No conversations found to analyze');
    return;
  }

  console.log(`Found ${conversations.length} conversations to analyze\n`);

  // Group by query complexity
  const deepQueries = conversations.filter(c => c.query_complexity === 'deep');
  const substantiveQueries = conversations.filter(c => c.query_complexity === 'substantive');

  console.log(`Deep queries: ${deepQueries.length}`);
  console.log(`Substantive queries: ${substantiveQueries.length}\n`);

  // Analyze deep conversations for wisdom patterns
  if (deepQueries.length >= 5) {
    await extractWisdomPatterns(deepQueries);
  }

  // Analyze for routing patterns (which mode works best for what?)
  await extractRoutingPatterns(conversations);

  // Analyze for successful teaching applications
  await extractTeachingPatterns(conversations);

  console.log('\n✅ [PATTERN ANALYSIS] Complete!\n');
}

// ───────────────────────────────────────────────────────────────
// WISDOM PATTERNS
// ───────────────────────────────────────────────────────────────

async function extractWisdomPatterns(deepQueries: any[]) {
  console.log('📚 [WISDOM PATTERNS] Analyzing deep queries...');

  // Group by themes
  const themes = new Map<string, any[]>();

  for (const query of deepQueries) {
    const wisdom = query.teaching_applied || [];
    for (const teaching of wisdom) {
      if (!themes.has(teaching)) {
        themes.set(teaching, []);
      }
      themes.get(teaching)!.push(query);
    }
  }

  // Create patterns for frequently used teachings
  for (const [teaching, queries] of themes.entries()) {
    if (queries.length >= 3) {
      // This teaching has been successfully applied 3+ times
      const pattern = {
        pattern_type: 'wisdom_selection',
        pattern_name: `Effective use of: ${teaching}`,
        description: `This teaching resonates well when users ask about similar themes`,
        conditions: {
          teaching,
          query_complexity: 'deep',
          success_count: queries.length
        },
        actions: {
          recommend_teaching: teaching,
          confidence: queries.length / deepQueries.length
        },
        example_conversations: queries.slice(0, 3).map(q => q.id),
        confidence_score: Math.min(0.95, queries.length / 10)
      };

      await savePattern(pattern);
      console.log(`   ✓ Extracted pattern for "${teaching}" (${queries.length} uses)`);
    }
  }
}

// ───────────────────────────────────────────────────────────────
// ROUTING PATTERNS
// ───────────────────────────────────────────────────────────────

async function extractRoutingPatterns(conversations: any[]) {
  console.log('🔀 [ROUTING PATTERNS] Analyzing consciousness mode effectiveness...');

  const byMode = {
    maia: conversations.filter(c => c.consciousness_mode === 'maia'),
    kairos: conversations.filter(c => c.consciousness_mode === 'kairos'),
    unified: conversations.filter(c => c.consciousness_mode === 'unified')
  };

  for (const [mode, convos] of Object.entries(byMode)) {
    if (convos.length >= 10) {
      const avgResponseTime = convos.reduce((sum, c) => sum + c.response_time_ms, 0) / convos.length;
      const breakthroughRate = convos.filter(c =>
        c.breakthrough_moments && Object.keys(c.breakthrough_moments).length > 0
      ).length / convos.length;

      console.log(`   ${mode.toUpperCase()}: ${convos.length} conversations, ${(breakthroughRate * 100).toFixed(1)}% breakthroughs`);

      if (breakthroughRate > 0.1) {
        // This mode has good breakthrough rate
        const pattern = {
          pattern_type: 'routing',
          pattern_name: `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode for breakthroughs`,
          description: `${mode} consciousness tends to facilitate breakthroughs`,
          conditions: {
            consciousness_mode: mode,
            breakthrough_rate: breakthroughRate
          },
          actions: {
            recommend_mode: mode,
            for_query_types: ['deep', 'substantive']
          },
          example_conversations: convos.filter(c =>
            c.breakthrough_moments && Object.keys(c.breakthrough_moments).length > 0
          ).slice(0, 3).map(c => c.id),
          confidence_score: Math.min(0.9, breakthroughRate * 2)
        };

        await savePattern(pattern);
      }
    }
  }
}

// ───────────────────────────────────────────────────────────────
// TEACHING PATTERNS
// ───────────────────────────────────────────────────────────────

async function extractTeachingPatterns(conversations: any[]) {
  console.log('📖 [TEACHING PATTERNS] Analyzing effective teaching sequences...');

  // Look for conversations where multiple teachings were applied successfully
  const multiTeaching = conversations.filter(c =>
    c.teaching_applied && c.teaching_applied.length >= 2
  );

  if (multiTeaching.length >= 5) {
    // Find common teaching combinations
    const combinations = new Map<string, number>();

    for (const conv of multiTeaching) {
      const key = conv.teaching_applied.sort().join(' + ');
      combinations.set(key, (combinations.get(key) || 0) + 1);
    }

    for (const [combo, count] of combinations.entries()) {
      if (count >= 3) {
        const pattern = {
          pattern_type: 'synthesis',
          pattern_name: `Teaching synthesis: ${combo}`,
          description: `These teachings work well together`,
          conditions: {
            teaching_combination: combo.split(' + '),
            success_count: count
          },
          actions: {
            recommend_together: true,
            teachings: combo.split(' + ')
          },
          example_conversations: multiTeaching
            .filter(c => c.teaching_applied.sort().join(' + ') === combo)
            .slice(0, 3)
            .map(c => c.id),
          confidence_score: Math.min(0.85, count / 5)
        };

        await savePattern(pattern);
        console.log(`   ✓ Found effective combination: ${combo}`);
      }
    }
  }
}

// ───────────────────────────────────────────────────────────────
// SAVE PATTERN
// ───────────────────────────────────────────────────────────────

async function savePattern(pattern: any) {
  // Check if pattern exists
  const { data: existing } = await supabase
    .from('apprentice_patterns')
    .select('id, times_applied')
    .eq('pattern_name', pattern.pattern_name)
    .single();

  if (existing) {
    // Update existing
    await supabase
      .from('apprentice_patterns')
      .update({
        confidence_score: pattern.confidence_score,
        times_applied: existing.times_applied + 1,
        last_refined_at: new Date().toISOString()
      })
      .eq('id', existing.id);
  } else {
    // Create new
    await supabase
      .from('apprentice_patterns')
      .insert({
        pattern_type: pattern.pattern_type,
        pattern_name: pattern.pattern_name,
        description: pattern.description,
        conditions: pattern.conditions,
        actions: pattern.actions,
        example_conversations: pattern.example_conversations,
        confidence_score: pattern.confidence_score,
        times_applied: 1
      });
  }
}

// ═══════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════

analyzePatterns().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
