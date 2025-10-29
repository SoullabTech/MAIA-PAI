import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Journey Phase Definitions
 * Based on conversation depth and wisdom moment accumulation
 */
const JOURNEY_PHASES = {
  seeker: {
    title: 'Seeker',
    description: 'Exploring the maps, discovering your patterns',
    minWisdomMoments: 0,
    minReadinessScore: 0,
    color: 'text-stone-400',
    gradient: 'bg-stone-900/50'
  },
  discoverer: {
    title: 'Discoverer',
    description: 'Recognizing your wisdom, seeing your gold',
    minWisdomMoments: 5,
    minReadinessScore: 0.4,
    color: 'text-stone-300',
    gradient: 'bg-stone-900/50'
  },
  'wisdom-keeper': {
    title: 'Wisdom Keeper',
    description: 'Your journey is teaching, ready to share',
    minWisdomMoments: 15,
    minReadinessScore: 0.7,
    color: 'text-amber-700',
    gradient: 'bg-stone-900/50'
  }
};

/**
 * GET /api/wisdom/journey?userId=xxx
 * Get user's wisdom journey state
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get user's conversation history length
    const { data: conversations, error: convError } = await supabase
      .from('maya_training_corpus')
      .select('id, user_message, maya_response, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (convError) {
      console.error('Conversation fetch error:', convError);
    }

    // Get user's detected patterns
    const { data: patterns, error: patternsError } = await supabase
      .from('maya_wisdom_patterns')
      .select('*')
      .eq('user_id', userId)
      .order('detected_at', { ascending: false });

    if (patternsError) {
      console.error('Patterns fetch error:', patternsError);
    }

    // Calculate wisdom moments (significant patterns with high strength)
    const wisdomMoments = (patterns || []).filter(p => p.strength > 0.6);
    const wisdomMomentCount = wisdomMoments.length;

    // Calculate readiness score (conversation depth + pattern diversity)
    const readinessScore = calculateReadinessScore(
      conversations || [],
      patterns || []
    );

    // Determine current phase
    const phase = determinePhase(wisdomMomentCount, readinessScore);

    // Get emerging patterns (recent high-strength patterns)
    const emergingPatterns = (patterns || [])
      .filter(p => {
        const minutesAgo = (Date.now() - new Date(p.detected_at).getTime()) / 1000 / 60;
        return minutesAgo < 60 && p.strength > 0.5;
      })
      .slice(0, 5)
      .map(p => ({
        element: p.pattern_type,
        name: p.pattern_name,
        strength: p.strength,
        lastSeen: p.detected_at
      }));

    return NextResponse.json({
      success: true,
      journeyState: {
        phase,
        wisdomMomentCount,
        readinessScore,
        emergingPatterns,
        totalConversations: conversations?.length || 0,
        totalPatterns: patterns?.length || 0
      },
      phaseInfo: JOURNEY_PHASES[phase as keyof typeof JOURNEY_PHASES]
    });

  } catch (error: any) {
    console.error('Journey state error:', error);
    return NextResponse.json(
      { error: 'Failed to get journey state', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wisdom/journey
 * Update journey milestone (called when user has breakthrough moment)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, milestone, context } = await req.json();

    if (!userId || !milestone) {
      return NextResponse.json(
        { error: 'userId and milestone are required' },
        { status: 400 }
      );
    }

    // Store milestone in maya_learning_events
    const { error: saveError } = await supabase
      .from('maya_learning_events')
      .insert({
        user_id: userId,
        event_type: 'wisdom_milestone',
        event_data: {
          milestone,
          context,
          timestamp: new Date().toISOString()
        },
        success_score: 1.0,
        created_at: new Date().toISOString()
      });

    if (saveError) {
      throw saveError;
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone recorded',
      milestone
    });

  } catch (error: any) {
    console.error('Journey update error:', error);
    return NextResponse.json(
      { error: 'Failed to update journey', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Calculate user's readiness score
 * Based on conversation depth, pattern diversity, and engagement
 */
function calculateReadinessScore(
  conversations: any[],
  patterns: any[]
): number {
  let score = 0;

  // Conversation engagement (0-0.3)
  const conversationCount = conversations.length;
  if (conversationCount > 5) score += 0.1;
  if (conversationCount > 15) score += 0.1;
  if (conversationCount > 30) score += 0.1;

  // Pattern diversity (0-0.4)
  const uniqueElements = new Set(patterns.map(p => p.pattern_type));
  const elementDiversity = uniqueElements.size / 4; // 4 main elements
  score += elementDiversity * 0.4;

  // Pattern strength (0-0.3)
  const avgStrength = patterns.length > 0
    ? patterns.reduce((sum, p) => sum + (p.strength || 0), 0) / patterns.length
    : 0;
  score += avgStrength * 0.3;

  return Math.min(score, 1.0);
}

/**
 * Determine journey phase based on wisdom moments and readiness
 */
function determinePhase(
  wisdomMomentCount: number,
  readinessScore: number
): string {
  // Wisdom Keeper: 15+ moments, 0.7+ readiness
  if (wisdomMomentCount >= 15 && readinessScore >= 0.7) {
    return 'wisdom-keeper';
  }

  // Discoverer: 5+ moments, 0.4+ readiness
  if (wisdomMomentCount >= 5 && readinessScore >= 0.4) {
    return 'discoverer';
  }

  // Seeker: Default starting phase
  return 'seeker';
}
