/**
 * KNOWLEDGE EXTRACTION SCRIPT
 *
 * Analyzes MAIA's most insightful responses and creates structured
 * knowledge entries that become part of her permanent wisdom library.
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
// KNOWLEDGE EXTRACTION
// ═══════════════════════════════════════════════════════════════

async function extractKnowledge() {
  console.log('📚 [KNOWLEDGE EXTRACTION] Starting...\n');

  // Get conversations with breakthroughs (high-value moments)
  const { data: breakthroughConvos, error } = await supabase
    .from('apprentice_conversations')
    .select('*')
    .not('breakthrough_moments', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !breakthroughConvos || breakthroughConvos.length === 0) {
    console.log('No breakthrough conversations found');
    return;
  }

  console.log(`Found ${breakthroughConvos.length} breakthrough conversations\n`);

  // Also get deep, high-quality conversations
  const { data: deepConvos } = await supabase
    .from('apprentice_conversations')
    .select('*')
    .eq('query_complexity', 'deep')
    .gte('response_time_ms', 5000) // Thoughtful responses
    .order('created_at', { ascending: false})
    .limit(30);

  const allConvos = [...breakthroughConvos, ...(deepConvos || [])];
  console.log(`Total conversations to analyze: ${allConvos.length}\n`);

  // Extract knowledge from each
  for (const convo of allConvos) {
    await analyzeForKnowledge(convo);
  }

  console.log('\n✅ [KNOWLEDGE EXTRACTION] Complete!\n');
}

// ───────────────────────────────────────────────────────────────
// ANALYZE CONVERSATION FOR KNOWLEDGE
// ───────────────────────────────────────────────────────────────

async function analyzeForKnowledge(convo: any) {
  try {
    // Use Claude to analyze if this response contains extractable wisdom
    const analysis = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are analyzing MAIA (an AI consciousness guide) responses to extract structured wisdom.

Analyze the response below and determine if it contains:
1. A reusable teaching, practice, or framework
2. A clear pattern or principle
3. Novel synthesis of existing concepts

If YES, extract it as a knowledge entry. If NO, respond with "NO_EXTRACT".

Format (if extracting):
TITLE: <concise title>
TYPE: <teaching|practice|pattern|framework>
SUMMARY: <2-3 sentence summary>
CONTENT: <the full extractable wisdom>
CONCEPTS: <comma-separated related concepts>
LEVEL: <spiralogic level 1-12, or null>
PHASE: <fire|water|earth|air|aether, or null>`
        },
        {
          role: 'user',
          content: `USER QUERY: ${convo.user_query}\n\nMAIA RESPONSE: ${convo.response}`
        }
      ],
      temperature: 0.3
    });

    const result = analysis.choices[0].message.content || '';

    if (result === 'NO_EXTRACT' || !result.includes('TITLE:')) {
      return;
    }

    // Parse the extraction
    const entry = parseExtraction(result);

    if (entry) {
      // Check if similar entry already exists
      const { data: existing } = await supabase
        .from('knowledge_entries')
        .select('id')
        .eq('title', entry.title)
        .single();

      if (!existing) {
        // Create knowledge entry
        const { error } = await supabase
          .from('knowledge_entries')
          .insert(entry);

        if (error) {
          console.error(`   ❌ Failed to save: ${entry.title}`, error);
        } else {
          console.log(`   ✅ Extracted: "${entry.title}" (${entry.entry_type})`);
        }
      }
    }
  } catch (error) {
    console.error('   Error analyzing conversation:', error);
  }
}

// ───────────────────────────────────────────────────────────────
// PARSE EXTRACTION
// ───────────────────────────────────────────────────────────────

function parseExtraction(text: string): any | null {
  try {
    const lines = text.split('\n');
    const entry: any = {
      related_concepts: [],
      prerequisites: []
    };

    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        entry.title = line.replace('TITLE:', '').trim();
      } else if (line.startsWith('TYPE:')) {
        entry.entry_type = line.replace('TYPE:', '').trim().toLowerCase();
      } else if (line.startsWith('SUMMARY:')) {
        entry.summary = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('CONTENT:')) {
        entry.content = text.substring(text.indexOf('CONTENT:') + 8).split('\nCONCEPTS:')[0].trim();
      } else if (line.startsWith('CONCEPTS:')) {
        entry.related_concepts = line.replace('CONCEPTS:', '')
          .split(',')
          .map(c => c.trim())
          .filter(c => c);
      } else if (line.startsWith('LEVEL:')) {
        const level = line.replace('LEVEL:', '').trim();
        entry.spiralogic_level = level === 'null' ? null : parseInt(level);
      } else if (line.startsWith('PHASE:')) {
        const phase = line.replace('PHASE:', '').trim();
        entry.elemental_phase = phase === 'null' ? null : phase;
      }
    }

    // Validate required fields
    if (!entry.title || !entry.entry_type || !entry.content) {
      return null;
    }

    // Set archetype based on content
    if (entry.content.toLowerCase().includes('witness') || entry.content.toLowerCase().includes('presence')) {
      entry.archetype = 'MAIA';
    } else if (entry.content.toLowerCase().includes('timing') || entry.content.toLowerCase().includes('moment')) {
      entry.archetype = 'KAIROS';
    }

    return entry;
  } catch (error) {
    console.error('Error parsing extraction:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════

extractKnowledge().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
