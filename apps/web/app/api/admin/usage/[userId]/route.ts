/**
 * User Usage Stats API
 *
 * GET /api/admin/usage/{userId}?days=7
 * Returns detailed usage statistics for a specific user
 */

import { NextRequest, NextResponse } from 'next/server';
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
  // Always return static data during build
  if (!process.env.VERCEL_URL || process.env.NODE_ENV !== 'development') {
    return NextResponse.json({
      userId: params.userId || 'unknown',
      period: '7 days',
      totalRequests: 0,
      totalCost: '$0.00',
      dailyBreakdown: [],
      quotaStatus: 'ok',
      quota: 100,
      quotaMessage: 'Service temporarily unavailable'
    });
  }

  try {
    // Only load usage tracker in development to avoid build issues
    const { usageTracker } = await import('@/lib/middleware/usage-tracker');

    const userId = params.userId;
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    console.log(`📊 [ADMIN] Fetching usage for ${userId} (last ${days} days)`);

    const summary = await usageTracker.getUserSummary(userId, days);
    const quotaCheck = await usageTracker.checkQuota(userId);

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
