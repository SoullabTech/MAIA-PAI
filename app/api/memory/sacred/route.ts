/**
 * POST /api/memory/sacred - Mark episode as sacred
 * DELETE /api/memory/sacred - Unmark episode as sacred
 */

import { NextRequest, NextResponse } from 'next/server';
import { getReentryService } from '@/lib/memory/bardic/ReentryService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, episodeId } = body;

    if (!userId || !episodeId) {
      return NextResponse.json(
        { error: 'userId and episodeId are required' },
        { status: 400 }
      );
    }

    const reentryService = getReentryService();
    const success = await reentryService.markSacred(userId, episodeId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark episode as sacred' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /memory/sacred] Error:', error);
    return NextResponse.json(
      { error: 'Failed to mark episode as sacred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, episodeId } = body;

    if (!userId || !episodeId) {
      return NextResponse.json(
        { error: 'userId and episodeId are required' },
        { status: 400 }
      );
    }

    const reentryService = getReentryService();
    const success = await reentryService.unmarkSacred(userId, episodeId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unmark episode as sacred' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /memory/sacred] Error:', error);
    return NextResponse.json(
      { error: 'Failed to unmark episode as sacred' },
      { status: 500 }
    );
  }
}
