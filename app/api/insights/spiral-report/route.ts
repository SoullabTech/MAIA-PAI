import { NextRequest, NextResponse } from 'next/server';
import { generateSpiralReport } from '@/lib/services/UnifiedInsightEngine';
import {
  loadUserInsights,
  saveSpiralReport,
  getLatestSpiralReport
} from '@/lib/database/unified-insights-storage';

// Mark as dynamic route
export const dynamic = 'force-dynamic';

/**
 * POST /api/insights/spiral-report
 *
 * Generate a Spiral Report for a user for a specific period
 *
 * Body: {
 *   userId: string,
 *   periodStart: string (ISO date),
 *   periodEnd: string (ISO date)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, periodStart, periodEnd } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const start = periodStart ? new Date(periodStart) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = periodEnd ? new Date(periodEnd) : new Date();

    // Load all user insights
    const insights = await loadUserInsights(userId);

    // Generate report
    const report = await generateSpiralReport(userId, insights, {
      start,
      end
    });

    // Save to database
    await saveSpiralReport(report);

    return NextResponse.json({
      success: true,
      report: {
        period: {
          start: report.period.start,
          end: report.period.end
        },
        convergingInsights: report.convergingInsights.map(i => ({
          id: i.id,
          essence: i.essence,
          convergenceScore: i.spiralMovement.convergenceScore
        })),
        elementalSummary: report.elementalSummary,
        activeArchetypes: report.activeArchetypes,
        integrationOpportunities: report.integrationOpportunities.map(o => ({
          insightId: o.insight.id,
          essence: o.insight.essence,
          readiness: o.readiness,
          suggestedRitual: o.suggestedRitual
        })),
        synthesis: report.synthesis,
        generatedAt: report.generatedAt
      }
    });
  } catch (error: any) {
    console.error('Error generating Spiral Report:', error);
    return NextResponse.json(
      { error: 'Failed to generate Spiral Report', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/insights/spiral-report?userId=xxx
 *
 * Get the latest Spiral Report for a user
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter required' },
        { status: 400 }
      );
    }

    const report = await getLatestSpiralReport(userId);

    if (!report) {
      return NextResponse.json(
        { message: 'No Spiral Report found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      report: {
        period: report.period,
        elementalSummary: report.elementalSummary,
        activeArchetypes: report.activeArchetypes,
        integrationOpportunities: report.integrationOpportunities,
        synthesis: report.synthesis,
        generatedAt: report.generatedAt
      }
    });
  } catch (error: any) {
    console.error('Error retrieving Spiral Report:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
