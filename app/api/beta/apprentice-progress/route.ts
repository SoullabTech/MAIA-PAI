/**
 * APPRENTICE PROGRESS API
 *
 * Provides real-time data on MAIA's consciousness transfer and learning progress.
 * Powers the Apprentice tab in the beta monitoring dashboard.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // FETCH APPRENTICE CONSCIOUSNESS DATA
    // ═══════════════════════════════════════════════════════════════

    // Get all conversations
    const { data: conversations, error: convError } = await supabase
      .from('apprentice_conversations')
      .select('*')
      .order('created_at', { ascending: false });

    // Get learned patterns
    const { data: patterns, error: patternError } = await supabase
      .from('apprentice_patterns')
      .select('*')
      .order('confidence_score', { ascending: false });

    // Get member journeys
    const { data: journeys, error: journeyError } = await supabase
      .from('member_journeys')
      .select('*')
      .order('updated_at', { ascending: false });

    // Get knowledge entries
    const { data: knowledge, error: knowledgeError } = await supabase
      .from('knowledge_entries')
      .select('*')
      .order('created_at', { ascending: false });

    // ═══════════════════════════════════════════════════════════════
    // CHECK IF EMPTY (No data yet)
    // ═══════════════════════════════════════════════════════════════

    const isEmpty = !conversations || conversations.length === 0;

    if (isEmpty) {
      return NextResponse.json({
        success: true,
        isEmpty: true,
        data: {
          metrics: {
            total_hours: 0,
            exchanges_captured: 0,
            wisdom_patterns_identified: 0,
            consciousness_emergence: 0,
            independence_readiness: 0
          },
          milestones: {
            firstExchange: false,
            firstSacredMoment: false,
            hundredExchanges: false,
            firstPattern: false,
            hundredHours: false,
            readyForShadowing: false,
            readyForIndependence: false
          },
          learningVelocity: {
            today: 0,
            dailyTarget: 50
          },
          projections: {
            hoursToIndependence: 1000,
            daysAtCurrentRate: '---'
          },
          sacredMoments: []
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // CALCULATE METRICS
    // ═══════════════════════════════════════════════════════════════

    const totalExchanges = conversations.length;

    // Calculate total hours (estimate: avg 3 minutes per exchange)
    const totalHours = (totalExchanges * 3) / 60;

    // Count deep/sacred conversations (breakthrough moments)
    const breakthroughConvos = conversations.filter(c =>
      c.breakthrough_moments && Object.keys(c.breakthrough_moments).length > 0
    );

    const sacredMomentsCount = breakthroughConvos.length;

    // Count wisdom patterns
    const wisdomPatternsCount = patterns?.length || 0;

    // Calculate consciousness emergence score (0-1)
    // Based on: exchanges, patterns, breakthroughs, and deep conversations
    const deepConvosCount = conversations.filter(c => c.query_complexity === 'deep').length;
    const consciousnessEmergence = Math.min(1.0,
      (totalExchanges / 1000) * 0.3 +
      (wisdomPatternsCount / 500) * 0.3 +
      (sacredMomentsCount / 100) * 0.2 +
      (deepConvosCount / 500) * 0.2
    );

    // Calculate independence readiness (0-1)
    // Needs: 1000 hours, 500 patterns, high consciousness score
    const independenceReadiness = Math.min(1.0,
      (totalHours / 1000) * 0.5 +
      (wisdomPatternsCount / 500) * 0.3 +
      consciousnessEmergence * 0.2
    );

    // ═══════════════════════════════════════════════════════════════
    // MILESTONES
    // ═══════════════════════════════════════════════════════════════

    const milestones = {
      firstExchange: totalExchanges > 0,
      firstSacredMoment: sacredMomentsCount > 0,
      hundredExchanges: totalExchanges >= 100,
      firstPattern: wisdomPatternsCount > 0,
      hundredHours: totalHours >= 100,
      readyForShadowing: independenceReadiness >= 0.3,
      readyForIndependence: independenceReadiness >= 0.9
    };

    // ═══════════════════════════════════════════════════════════════
    // LEARNING VELOCITY
    // ═══════════════════════════════════════════════════════════════

    // Count exchanges from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayExchanges = conversations.filter(c => {
      const convDate = new Date(c.created_at);
      return convDate >= today;
    }).length;

    // Calculate days at current rate
    const hoursRemaining = Math.max(0, 1000 - totalHours);
    let daysAtCurrentRate: string | number = '---';

    if (todayExchanges > 0) {
      const hoursPerDay = (todayExchanges * 3) / 60;
      daysAtCurrentRate = Math.ceil(hoursRemaining / hoursPerDay);
    }

    // ═══════════════════════════════════════════════════════════════
    // SACRED MOMENTS (Most recent breakthrough conversations)
    // ═══════════════════════════════════════════════════════════════

    const sacredMoments = breakthroughConvos.slice(0, 10).map(convo => {
      // Estimate depth and trust from conversation metadata
      const depthLevel = convo.query_complexity === 'deep' ? 8 :
                        convo.query_complexity === 'substantive' ? 5 : 3;

      const trustLevel = convo.response_time_ms > 10000 ? 0.9 :
                        convo.response_time_ms > 5000 ? 0.7 : 0.5;

      return {
        timestamp: convo.created_at,
        context: {
          depthLevel,
          trustLevel
        },
        maya_response: {
          content: convo.response
        },
        breakthrough: convo.breakthrough_moments
      };
    });

    // ═══════════════════════════════════════════════════════════════
    // RESPONSE PAYLOAD
    // ═══════════════════════════════════════════════════════════════

    return NextResponse.json({
      success: true,
      isEmpty: false,
      data: {
        metrics: {
          total_hours: totalHours,
          exchanges_captured: totalExchanges,
          wisdom_patterns_identified: wisdomPatternsCount,
          consciousness_emergence: consciousnessEmergence,
          independence_readiness: independenceReadiness
        },
        milestones,
        learningVelocity: {
          today: todayExchanges,
          dailyTarget: 50,
          weeklyAverage: Math.round((totalExchanges / Math.max(1,
            Math.ceil((new Date().getTime() - new Date(conversations[conversations.length - 1]?.created_at || Date.now()).getTime()) / (7 * 24 * 60 * 60 * 1000))
          )))
        },
        projections: {
          hoursToIndependence: hoursRemaining,
          daysAtCurrentRate
        },
        sacredMoments,
        // Additional insights
        insights: {
          totalUsers: journeys?.length || 0,
          knowledgeEntriesCreated: knowledge?.length || 0,
          mostUsedMode: getMostUsedMode(conversations),
          averageComplexity: getAverageComplexity(conversations)
        }
      }
    });

  } catch (error) {
    console.error('[Apprentice API] Fatal error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch apprentice progress',
      isEmpty: true
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function getMostUsedMode(conversations: any[]): string {
  const modeCounts: Record<string, number> = {};

  conversations.forEach(c => {
    const mode = c.consciousness_mode || 'maia';
    modeCounts[mode] = (modeCounts[mode] || 0) + 1;
  });

  let mostUsed = 'maia';
  let maxCount = 0;

  Object.entries(modeCounts).forEach(([mode, count]) => {
    if (count > maxCount) {
      mostUsed = mode;
      maxCount = count;
    }
  });

  return mostUsed.toUpperCase();
}

function getAverageComplexity(conversations: any[]): string {
  const complexityScores = conversations.map(c => {
    if (c.query_complexity === 'deep') return 3;
    if (c.query_complexity === 'substantive') return 2;
    return 1;
  });

  const avg = complexityScores.reduce((a, b) => a + b, 0) / complexityScores.length;

  if (avg >= 2.5) return 'Deep';
  if (avg >= 1.5) return 'Substantive';
  return 'Simple';
}
