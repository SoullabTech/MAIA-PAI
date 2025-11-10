/**
 * GET /api/telos/balance
 *
 * Check Fire-Air balance
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTeleologyService } from '@/lib/memory/bardic/TeleologyService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const recentDays = searchParams.get('recentDays');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const teleologyService = getTeleologyService();
    const balance = await teleologyService.checkBalance({
      userId,
      recentDays: recentDays ? parseInt(recentDays) : undefined
    });

    return NextResponse.json(balance);
  } catch (error) {
    console.error('[API /telos/balance] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check balance' },
      { status: 500 }
    );
  }
}
