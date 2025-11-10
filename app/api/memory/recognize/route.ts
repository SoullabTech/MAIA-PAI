/**
 * POST /api/memory/recognize
 *
 * Recognize familiar scenes from recent text and context
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecognitionService } from '@/lib/memory/bardic/RecognitionService';
import type { RecognitionInput } from '@/lib/memory/bardic/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, recentText, affect, softCues } = body as RecognitionInput;

    // Validation
    if (!userId || !recentText) {
      return NextResponse.json(
        { error: 'userId and recentText are required' },
        { status: 400 }
      );
    }

    // Recognize familiar scenes
    const recognitionService = getRecognitionService();
    const candidates = await recognitionService.recognize({
      userId,
      recentText,
      affect,
      softCues
    });

    return NextResponse.json({
      candidates,
      count: candidates.length
    });
  } catch (error) {
    console.error('[API /memory/recognize] Error:', error);
    return NextResponse.json(
      { error: 'Failed to recognize scenes' },
      { status: 500 }
    );
  }
}
