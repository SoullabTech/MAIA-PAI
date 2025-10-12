import { NextRequest, NextResponse } from 'next/server';
import { loadUserInsights, getConvergingInsights } from '@/lib/database/unified-insights-storage';

// Mark as dynamic route
export const dynamic = 'force-dynamic';

/**
 * GET /api/insights/user?userId=xxx&converging=true
 *
 * Returns all insights for a user, optionally filtered to converging insights
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const convergingOnly = searchParams.get('converging') === 'true';
    const threshold = parseInt(searchParams.get('threshold') || '70');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter required' },
        { status: 400 }
      );
    }

    const insights = convergingOnly
      ? await getConvergingInsights(userId, threshold)
      : await loadUserInsights(userId);

    return NextResponse.json({
      userId,
      count: insights.length,
      insights: insights.map(insight => ({
        id: insight.id,
        essence: insight.essence,
        corePattern: insight.corePattern,
        firstEmergence: {
          context: insight.firstEmergence.context,
          date: insight.firstEmergence.date,
          element: insight.firstEmergence.element
        },
        recurrenceCount: insight.recurrences.length,
        spiralMovement: {
          direction: insight.spiralMovement.direction,
          depth: insight.spiralMovement.currentDepth,
          turns: insight.spiralMovement.turns,
          convergenceScore: insight.spiralMovement.convergenceScore
        },
        archetypalThread: insight.archetypalThread ? {
          archetype: insight.archetypalThread.archetype,
          phase: insight.archetypalThread.phase,
          readiness: insight.archetypalThread.readinessScore
        } : null,
        elementalJourney: {
          from: insight.elementalJourney.startElement,
          to: insight.elementalJourney.currentElement,
          transformations: insight.elementalJourney.transformations.length
        },
        lastSeen: insight.lastSeen,
        isActive: insight.isActive
      }))
    });
  } catch (error: any) {
    console.error('Error in GET /api/insights/user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
