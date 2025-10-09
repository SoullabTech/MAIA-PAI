/**
 * API Route: Calculate Field State
 * Run field state calculator for all channels
 * Should be called by cron job every 5 minutes
 */

import { NextRequest, NextResponse } from 'next/server';
import { fieldStateCalculator } from '@/lib/community/field-state-calculator';

export async function POST(request: NextRequest) {
  try {
    // Verify authorization (cron secret or API key)
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run calculator
    await fieldStateCalculator.calculateAllChannels();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Field state calculation failed:', error);
    return NextResponse.json(
      {
        error: 'Calculation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing (in development only)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    await fieldStateCalculator.calculateAllChannels();

    return NextResponse.json({
      success: true,
      message: 'Field state calculated (dev mode)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Field state calculation failed:', error);
    return NextResponse.json(
      {
        error: 'Calculation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
