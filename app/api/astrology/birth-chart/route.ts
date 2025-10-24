import { NextRequest, NextResponse } from 'next/server';
import { calculateBirthChart } from '@/lib/astrology/ephemerisCalculator';
import { saveAstrologyToAkashic } from '@/lib/saveUnifiedAkashic';

/**
 * Birth Chart API Route
 *
 * Calculates comprehensive birth chart using real-time ephemeris calculations
 * Powered by astronomy-engine for professional-grade accuracy
 *
 * Supports:
 * - Multiple house systems (Porphyry, Whole Sign, Equal, Placidus)
 * - Precise planetary positions (arc-second accuracy)
 * - Aspect calculations with orbs
 * - Retrograde detection
 * - Real-time calculations for any birth date/time/location
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, location, houseSystem } = body;

    // Validate inputs
    if (!date || !time || !location) {
      return NextResponse.json(
        {
          success: false,
          error: 'Birth date, time, and location are required',
        },
        { status: 400 }
      );
    }

    // Validate location has required fields
    if (!location.lat || !location.lng) {
      return NextResponse.json(
        {
          success: false,
          error: 'Location must include latitude and longitude',
        },
        { status: 400 }
      );
    }

    console.log(`[Birth Chart] Calculating for: ${date} ${time} at (${location.lat}, ${location.lng})`);

    // Calculate birth chart using real-time ephemeris
    const birthData = {
      date, // YYYY-MM-DD
      time, // HH:MM
      location: {
        lat: location.lat,
        lng: location.lng,
        timezone: location.timezone || 'UTC',
      },
      houseSystem: houseSystem || 'porphyry', // Default to Porphyry (best for Spiralogic)
    };

    const chartData = await calculateBirthChart(birthData);

    console.log(`[Birth Chart] ✓ Calculated successfully`);
    console.log(`[Birth Chart] Sun: ${chartData.sun.sign} ${chartData.sun.degree.toFixed(2)}° (House ${chartData.sun.house})`);
    console.log(`[Birth Chart] Moon: ${chartData.moon.sign} ${chartData.moon.degree.toFixed(2)}° (House ${chartData.moon.house})`);
    console.log(`[Birth Chart] Ascendant: ${chartData.ascendant.sign} ${chartData.ascendant.degree.toFixed(2)}°`);

    // Save to Akashic Records for semantic search
    const userId = body.userId; // Optional user ID from request
    const sessionId = body.sessionId; // Optional session ID

    await saveAstrologyToAkashic(
      "birth-chart",
      chartData,
      userId,
      sessionId
    ).catch(err => console.warn('[Birth Chart] Akashic archival skipped:', err));

    // Store birth chart in database (Supabase)
    // TODO: Implement database storage with user association

    return NextResponse.json({
      success: true,
      data: chartData,
      meta: {
        calculatedAt: new Date().toISOString(),
        houseSystem: birthData.houseSystem,
        timezone: birthData.location.timezone,
      }
    });

  } catch (error) {
    console.error('[Birth Chart] Calculation error:', error);

    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate birth chart',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user from session/auth
    // TODO: Replace with actual auth once implemented
    const userId = 'user_temp';

    // Fetch stored birth chart from database (Supabase)
    // TODO: Implement database fetch from user_profiles or birth_charts table
    // For now, users must POST their birth data to calculate

    console.log(`[Birth Chart] GET request for user: ${userId}`);

    return NextResponse.json({
      success: false,
      error: 'Chart retrieval not yet implemented. Please POST birth data to calculate.',
      message: 'Use POST /api/astrology/birth-chart with { date, time, location } to calculate your chart',
    }, { status: 501 }); // 501 Not Implemented

  } catch (error) {
    console.error('[Birth Chart] Fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch birth chart',
      },
      { status: 500 }
    );
  }
}
