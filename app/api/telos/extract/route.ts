/**
 * POST /api/telos/extract
 *
 * Extract teloi (future-pull) from text
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTeleologyService } from '@/lib/memory/bardic/TeleologyService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, text, originEpisodeId } = body;

    if (!userId || !text) {
      return NextResponse.json(
        { error: 'userId and text are required' },
        { status: 400 }
      );
    }

    const teleologyService = getTeleologyService();
    const extraction = await teleologyService.extract({
      userId,
      text,
      originEpisodeId
    });

    return NextResponse.json(extraction);
  } catch (error) {
    console.error('[API /telos/extract] Error:', error);
    return NextResponse.json(
      { error: 'Failed to extract teloi' },
      { status: 500 }
    );
  }
}
