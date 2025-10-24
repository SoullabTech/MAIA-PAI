/**
 * Start Free Trial API
 *
 * Initiates a 14-day free trial with full Explorer access
 * No payment required
 */

import { NextRequest, NextResponse } from 'next/server';
import { startTrial } from '@/lib/subscription/FeatureGating';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Start 14-day trial
    const result = await startTrial(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to start trial', details: result.error },
        { status: 500 }
      );
    }

    console.log(`✅ Trial started for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: '14-day free trial started',
      trialDays: 14
    });

  } catch (error: any) {
    console.error('Error starting trial:', error);
    return NextResponse.json(
      { error: 'Failed to start trial', details: error.message },
      { status: 500 }
    );
  }
}
