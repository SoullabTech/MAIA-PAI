/**
 * GET /api/telos - Get active teloi for user
 * POST /api/telos - Create new telos manually
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTeleologyService } from '@/lib/memory/bardic/TeleologyService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const teleologyService = getTeleologyService();
    const teloi = await teleologyService.getActive(userId);

    return NextResponse.json({
      teloi,
      count: teloi.length
    });
  } catch (error) {
    console.error('[API /telos] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teloi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, phrase, originEpisodeId, strength, horizonDays, signals } = body;

    if (!userId || !phrase) {
      return NextResponse.json(
        { error: 'userId and phrase are required' },
        { status: 400 }
      );
    }

    const teleologyService = getTeleologyService();
    const telos = await teleologyService.create({
      userId,
      phrase,
      originEpisodeId,
      strength,
      horizonDays,
      signals
    });

    if (!telos) {
      return NextResponse.json(
        { error: 'Failed to create telos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ telos });
  } catch (error) {
    console.error('[API /telos] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create telos' },
      { status: 500 }
    );
  }
}
