/**
 * POST /api/cues/associate
 *
 * Associate a cue with an episode (with potency)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCueService } from '@/lib/memory/bardic/CueService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { episodeId, cueId, potency } = body;

    if (!episodeId || !cueId || potency === undefined) {
      return NextResponse.json(
        { error: 'episodeId, cueId, and potency are required' },
        { status: 400 }
      );
    }

    if (potency < 0 || potency > 1) {
      return NextResponse.json(
        { error: 'potency must be between 0 and 1' },
        { status: 400 }
      );
    }

    const cueService = getCueService();
    const success = await cueService.associate({
      episodeId,
      cueId,
      potency
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to associate cue' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /cues/associate] Error:', error);
    return NextResponse.json(
      { error: 'Failed to associate cue' },
      { status: 500 }
    );
  }
}
