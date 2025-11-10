/**
 * POST /api/telos/align
 *
 * Log alignment delta for an episode
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTeleologyService } from '@/lib/memory/bardic/TeleologyService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { episodeId, telosId, delta, notes } = body;

    if (!episodeId || !telosId || delta === undefined) {
      return NextResponse.json(
        { error: 'episodeId, telosId, and delta are required' },
        { status: 400 }
      );
    }

    if (delta < -1 || delta > 1) {
      return NextResponse.json(
        { error: 'delta must be between -1 and 1' },
        { status: 400 }
      );
    }

    const teleologyService = getTeleologyService();
    const success = await teleologyService.logAlignment({
      episodeId,
      telosId,
      delta,
      notes
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to log alignment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /telos/align] Error:', error);
    return NextResponse.json(
      { error: 'Failed to log alignment' },
      { status: 500 }
    );
  }
}
