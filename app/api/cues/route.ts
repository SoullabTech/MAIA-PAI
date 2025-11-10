/**
 * POST /api/cues - Create new cue
 * GET /api/cues - Get user's cues
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCueService } from '@/lib/memory/bardic/CueService';
import type { CueType } from '@/lib/memory/bardic/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, userWords, mediaRef } = body;

    if (!userId || !type || !userWords) {
      return NextResponse.json(
        { error: 'userId, type, and userWords are required' },
        { status: 400 }
      );
    }

    const cueService = getCueService();
    const cue = await cueService.create({
      userId,
      type: type as CueType,
      userWords,
      mediaRef
    });

    if (!cue) {
      return NextResponse.json(
        { error: 'Failed to create cue' },
        { status: 500 }
      );
    }

    return NextResponse.json({ cue });
  } catch (error) {
    console.error('[API /cues] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create cue' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') as CueType | null;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const cueService = getCueService();
    const cues = await cueService.findUserCues(userId, type || undefined);

    return NextResponse.json({
      cues,
      count: cues.length
    });
  } catch (error) {
    console.error('[API /cues] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cues' },
      { status: 500 }
    );
  }
}
