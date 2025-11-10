/**
 * POST /api/memory/recall
 *
 * Recall full episode with artifacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecallService } from '@/lib/memory/bardic/RecallService';
import type { RecallInput } from '@/lib/memory/bardic/RecallService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      episodeId,
      includeTranscripts,
      includeInsights,
      includeMicroacts,
      includeRelated,
      maxInsights,
      maxMicroacts,
      maxRelated
    } = body as RecallInput;

    // Validation
    if (!userId || !episodeId) {
      return NextResponse.json(
        { error: 'userId and episodeId are required' },
        { status: 400 }
      );
    }

    // Recall episode with artifacts
    const recallService = getRecallService();
    const result = await recallService.recall({
      userId,
      episodeId,
      includeTranscripts,
      includeInsights,
      includeMicroacts,
      includeRelated,
      maxInsights,
      maxMicroacts,
      maxRelated
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Episode not found or recall failed' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /memory/recall] Error:', error);
    return NextResponse.json(
      { error: 'Failed to recall episode' },
      { status: 500 }
    );
  }
}
