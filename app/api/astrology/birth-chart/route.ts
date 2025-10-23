import { NextRequest, NextResponse } from 'next/server';

/**
 * Birth Chart API Route
 *
 * Calculates comprehensive birth chart using the backend astrology service
 * Connects to: apps/api/backend/src/routes/astrology.routes.ts
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, location } = body;

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

    // Get user from session/auth
    // TODO: Replace with actual auth once implemented
    const userId = 'user_temp'; // Temporary until auth is wired up

    // Forward to backend API (if available)
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${backendUrl}/api/astrology/birth-chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          date,
          time,
          location: {
            lat: location.lat,
            lng: location.lng,
            timezone: location.timezone || 'UTC',
          },
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Backend calculation failed');
      }

      // Store birth chart in database (Supabase)
      // TODO: Implement database storage

      return NextResponse.json({
        success: true,
        data: data.data,
      });
    } catch (backendError) {
      console.error('Backend API unavailable, using mock data:', backendError);

      // Return Kelly's verified birth chart data when backend is unavailable
      // Source: KELLY_VERIFIED_CHART_DATA.md - Time Passages Professional Report
      // Birth: Dec 9, 1966, 10:29 PM CST, Baton Rouge, LA (30.45°N, 91.19°W)
      const mockChartData = {
        sun: { sign: 'Sagittarius', degree: 17.66, house: 4, retrograde: false },
        moon: { sign: 'Scorpio', degree: 22.55, house: 3, retrograde: false },
        mercury: { sign: 'Scorpio', degree: 28.08, house: 4, retrograde: false },
        venus: { sign: 'Sagittarius', degree: 25.3, house: 5, retrograde: false },
        mars: { sign: 'Libra', degree: 3.27, house: 2, retrograde: false },
        jupiter: { sign: 'Leo', degree: 3.9, house: 12, retrograde: true },
        saturn: { sign: 'Pisces', degree: 23.08, house: 7, retrograde: false },
        uranus: { sign: 'Virgo', degree: 24.23, house: 1, retrograde: false },
        neptune: { sign: 'Scorpio', degree: 22.83, house: 3, retrograde: false },
        pluto: { sign: 'Virgo', degree: 20.6, house: 1, retrograde: false },
        chiron: { sign: 'Pisces', degree: 21.7, house: 7, retrograde: false },
        northNode: { sign: 'Taurus', degree: 15.98, house: 9, retrograde: true },
        southNode: { sign: 'Scorpio', degree: 15.98, house: 3, retrograde: true },
        ascendant: { sign: 'Leo', degree: 29.42 },
        midheaven: { sign: 'Taurus', degree: 26.85 },
        houses: [29.42, 28.5, 25.0, 26.85, 29.0, 0.5, 29.42, 28.5, 25.0, 26.85, 29.0, 0.5],
        aspects: [
          { planet1: 'Sun', planet2: 'Saturn', type: 'square', orb: 5.42 },
          { planet1: 'Moon', planet2: 'Neptune', type: 'conjunction', orb: 0.28 },
          { planet1: 'Saturn', planet2: 'Chiron', type: 'conjunction', orb: 1.38 },
          { planet1: 'Uranus', planet2: 'Pluto', type: 'conjunction', orb: 3.63 }
        ]
      };

      return NextResponse.json({
        success: true,
        data: mockChartData,
        warning: 'Using sample chart data. For accurate calculations, ensure the backend service is running.'
      });
    }
  } catch (error) {
    console.error('Birth chart calculation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error calculating birth chart',
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

    // Fetch stored birth chart from database
    // TODO: Implement database fetch

    // For now, return mock data
    return NextResponse.json({
      success: true,
      data: {
        message: 'Birth chart retrieval not yet implemented',
        userId,
      },
    });
  } catch (error) {
    console.error('Birth chart fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch birth chart',
      },
      { status: 500 }
    );
  }
}
