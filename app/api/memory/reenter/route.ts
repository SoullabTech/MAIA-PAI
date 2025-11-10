/**
 * POST /api/memory/reenter
 *
 * Request re-entry to an episode (with safety gates)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getReentryService } from '@/lib/memory/bardic/ReentryService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, episodeId, currentArousal } = body;

    // Validation
    if (!userId || !episodeId) {
      return NextResponse.json(
        { error: 'userId and episodeId are required' },
        { status: 400 }
      );
    }

    // Attempt re-entry
    const reentryService = getReentryService();
    const result = await reentryService.reenter(userId, episodeId, currentArousal);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /memory/reenter] Error:', error);
    return NextResponse.json(
      { error: 'Failed to reenter episode' },
      { status: 500 }
    );
  }
}
