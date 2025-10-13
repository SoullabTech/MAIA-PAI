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

    // Forward to backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/astrology/birth-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add auth token when implemented
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
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || 'Failed to calculate birth chart',
        },
        { status: response.status }
      );
    }

    // Store birth chart in database (Supabase)
    // TODO: Implement database storage

    return NextResponse.json({
      success: true,
      data: data.data,
    });
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
