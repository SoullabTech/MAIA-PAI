/**
 * CURRENT TRANSITS API - Archetypal Weather Service
 *
 * Calculates current planetary transits and their aspects to natal chart
 * Returns "weather conditions" in archetypal language
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateArchetypalWeather, calculateCurrentTransits } from '@/lib/astrology/transitCalculator';
import type { BirthChart } from '@/lib/astrology/ephemerisCalculator';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { birthChart } = body;

    if (!birthChart) {
      return NextResponse.json(
        { error: 'Birth chart data required' },
        { status: 400 }
      );
    }

    // Calculate current transits
    const currentDate = new Date();
    const transitPositions = await calculateCurrentTransits(currentDate);

    // Calculate archetypal weather (significant transits only)
    const weatherConditions = await calculateArchetypalWeather(birthChart as BirthChart, currentDate);

    // Sort by intensity (most intense first)
    const intensityOrder = { extreme: 4, intense: 3, moderate: 2, light: 1 };
    const sortedConditions = weatherConditions.sort((a, b) =>
      intensityOrder[b.intensity] - intensityOrder[a.intensity]
    );

    return NextResponse.json({
      success: true,
      date: currentDate.toISOString(),
      transitPositions,
      weatherConditions: sortedConditions,
      summary: {
        totalTransits: sortedConditions.length,
        extremeIntensity: sortedConditions.filter(w => w.intensity === 'extreme').length,
        intenseCount: sortedConditions.filter(w => w.intensity === 'intense').length,
        moderateCount: sortedConditions.filter(w => w.intensity === 'moderate').length,
      }
    });

  } catch (error: any) {
    console.error('[transits] Error calculating transits:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate transits',
        details: error.message
      },
      { status: 500 }
    );
  }
}
