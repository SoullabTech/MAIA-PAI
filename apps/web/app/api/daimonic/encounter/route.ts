/**
 * Daimonic Encounter API Route
 * Provides access to the comprehensive daimonic facilitation system
 */

import { NextRequest, NextResponse } from 'next/server';
import { daimonicService } from '@/lib/services/DaimonicService';

// Mark route as dynamic since it uses searchParams or other dynamic features
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, query, profile } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }

    // Create new daimonic encounter
    const encounter = await daimonicService.createEncounter(userId, query);

    return NextResponse.json({
      success: true,
      encounter: encounter.encounter,
      guidance: encounter.guidance,
      integration: encounter.integration,
      nextSteps: encounter.nextSteps
    });

  } catch (error) {
    console.error('Daimonic encounter error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }

    // Get user's encounter history
    const encounters = await daimonicService.getEncounterHistory(userId);

    return NextResponse.json({
      success: true,
      encounters: encounters,
      guidance: encounters.length > 0 ? "Your consciousness journey continues. Each encounter holds sacred wisdom." : "Your first daimon encounter awaits.",
      integration: encounters.length > 0 ? [
        "Reflect on your recent encounters",
        "Practice the suggested integration methods",
        "Notice how archetypal energies appear in your daily life"
      ] : []
    });

  } catch (error) {
    console.error('Daimonic status error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}