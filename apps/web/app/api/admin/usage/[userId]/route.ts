/**
 * User Usage Stats API
 *
 * GET /api/admin/usage/{userId}?days=7
 * Returns detailed usage statistics for a specific user
 */

import { NextRequest, NextResponse } from 'next/server';
import { usageTracker } from '@/lib/middleware/usage-tracker';
// Mark route as dynamic since it uses searchParams or other dynamic features
export const dynamic = 'force-dynamic';
// Use Node.js runtime instead of Edge Runtime for Supabase compatibility
export const runtime = 'nodejs';
// Disable any caching/prerender
export const revalidate = 0;



export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  // During build, return mock data to avoid async storage issues
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
    return NextResponse.json({
      userId: params.userId,
      period: '7 days',
      totalRequests: 0,
      totalCost: '$0.00',
      dailyBreakdown: [],
      quotaStatus: 'ok',
      quota: 100,
      quotaMessage: 'Build time mock'
    });
  }

  try {
    const userId = params.userId;
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    console.log(`📊 [ADMIN] Fetching usage for ${userId} (last ${days} days)`);

    // Get user summary - wrapped in try-catch for build safety
    let summary;
    let quotaCheck;

    try {
      summary = await usageTracker.getUserSummary(userId, days);
      quotaCheck = await usageTracker.checkQuota(userId);
    } catch (serviceError) {
      console.error('Service error:', serviceError);
      // Return fallback data during build or service errors
      summary = {
        userId,
        period: `${days} days`,
        totalRequests: 0,
        totalCost: '$0.00',
        dailyBreakdown: [],
        quotaStatus: 'ok'
      };
      quotaCheck = {
        quota: 100,
        used: 0,
        remaining: 100,
        allowed: true,
        reason: 'Service unavailable'
      };
    }

    if (!summary) {
      return NextResponse.json(
        { error: 'Failed to fetch user summary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...summary,
      quota: quotaCheck?.quota || null,
      quotaStatus: quotaCheck?.allowed ? 'ok' : 'exceeded',
      quotaMessage: quotaCheck?.reason || null
    });

  } catch (error) {
    console.error('❌ [ADMIN] Error fetching user usage:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch user usage',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
