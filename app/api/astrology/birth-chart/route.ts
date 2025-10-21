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

      // Return mock birth chart data when backend is unavailable
      // This allows the app to function without the backend running
      const mockChartData = {
        sun: { sign: 'Sagittarius', degree: 17.23, house: 4 },
        moon: { sign: 'Pisces', degree: 23.45, house: 7 },
        mercury: { sign: 'Sagittarius', degree: 5.12, house: 4 },
        venus: { sign: 'Capricorn', degree: 12.34, house: 5 },
        mars: { sign: 'Aquarius', degree: 8.76, house: 6 },
        jupiter: { sign: 'Cancer', degree: 26.43, house: 11 },
        saturn: { sign: 'Pisces', degree: 24.12, house: 7 },
        uranus: { sign: 'Virgo', degree: 19.87, house: 1 },
        neptune: { sign: 'Scorpio', degree: 21.54, house: 3 },
        pluto: { sign: 'Virgo', degree: 18.32, house: 1 },
        chiron: { sign: 'Pisces', degree: 29.15, house: 7 },
        northNode: { sign: 'Gemini', degree: 14.56, house: 10 },
        southNode: { sign: 'Sagittarius', degree: 14.56, house: 4 },
        ascendant: { sign: 'Leo', degree: 28.12 },
        midheaven: { sign: 'Taurus', degree: 15.67 },
        houses: [28.12, 22.45, 18.33, 15.67, 17.89, 24.12, 28.12, 22.45, 18.33, 15.67, 17.89, 24.12],
        aspects: [
          { planet1: 'Sun', planet2: 'Saturn', type: 'square', orb: 5.89 },
          { planet1: 'Moon', planet2: 'Saturn', type: 'conjunction', orb: 0.33 },
          { planet1: 'Sun', planet2: 'Jupiter', type: 'quincunx', orb: 9.2 },
          { planet1: 'Moon', planet2: 'Neptune', type: 'trine', orb: 0.56 }
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
