import { NextRequest, NextResponse } from 'next/server';
import { calculateBirthChart } from '@/lib/astrology/ephemerisCalculator';
import { saveAstrologyToAkashic } from '@/lib/saveUnifiedAkashic';
import { createClient } from '@supabase/supabase-js';

/**
 * Birth Chart API Route - Now with Persistent Storage! ✨
 *
 * Calculates comprehensive birth chart using real-time ephemeris calculations
 * Powered by astronomy-engine for professional-grade accuracy
 *
 * NEW: Birth charts are now saved to Supabase for persistent storage
 * across devices and sessions - your cosmic blueprint is always available!
 *
 * Supports:
 * - Multiple house systems (Porphyry, Whole Sign, Equal, Placidus)
 * - Precise planetary positions (arc-second accuracy)
 * - Aspect calculations with orbs
 * - Retrograde detection
 * - Real-time calculations for any birth date/time/location
 * - Persistent database storage linked to your explorer account
 */

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, location, houseSystem, explorerId, email } = body;

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

    // ✨ Save birth chart to Supabase database for persistent storage
    if (explorerId || email) {
      try {
        console.log('[Birth Chart] 💾 Saving to database...');

        // Build the update object
        const updateData = {
          birth_date: date,
          birth_time: time,
          birth_location_name: location.name,
          birth_latitude: location.lat,
          birth_longitude: location.lng,
          birth_timezone: location.timezone || 'UTC',
          birth_chart_data: chartData,
          birth_chart_calculated_at: new Date().toISOString()
        };

        // Update explorer by ID or email
        const query = explorerId
          ? supabase.from('explorers').update(updateData).eq('explorer_id', explorerId)
          : supabase.from('explorers').update(updateData).eq('email', email);

        const { data: savedExplorer, error: saveError } = await query.select().single();

        if (saveError) {
          console.error('[Birth Chart] ⚠️ Failed to save to database:', saveError.message);
          // Don't fail the request - chart is still calculated
        } else {
          console.log('[Birth Chart] ✅ Saved to database for explorer:', savedExplorer?.explorer_name);
        }
      } catch (dbError) {
        console.error('[Birth Chart] Database save error:', dbError);
        // Continue - the chart calculation succeeded
      }
    } else {
      console.log('[Birth Chart] ℹ️ No explorerId or email provided - skipping database save');
    }

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
    // Get explorer identifier from query params
    const { searchParams } = new URL(request.url);
    const explorerId = searchParams.get('explorerId');
    const email = searchParams.get('email');

    if (!explorerId && !email) {
      return NextResponse.json({
        success: false,
        error: 'Explorer ID or email required',
        message: 'Provide ?explorerId=xxx or ?email=xxx to fetch your birth chart',
      }, { status: 400 });
    }

    console.log(`[Birth Chart] 🔍 Fetching chart for explorer:`, explorerId || email);

    // Fetch birth chart from Supabase
    const query = explorerId
      ? supabase.from('explorers').select('*').eq('explorer_id', explorerId)
      : supabase.from('explorers').select('*').eq('email', email);

    const { data: explorer, error: fetchError } = await query.single();

    if (fetchError || !explorer) {
      console.log('[Birth Chart] ℹ️ No explorer found');
      return NextResponse.json({
        success: false,
        error: 'Explorer not found',
      }, { status: 404 });
    }

    // Check if birth chart data exists
    if (!explorer.birth_chart_data) {
      console.log('[Birth Chart] ℹ️ Explorer has no birth chart data yet');
      return NextResponse.json({
        success: false,
        error: 'No birth chart data found',
        message: 'This explorer has not entered their birth data yet. Please use POST to calculate.',
      }, { status: 404 });
    }

    console.log(`[Birth Chart] ✅ Found chart for ${explorer.explorer_name}, calculated on ${explorer.birth_chart_calculated_at}`);

    // Return the stored chart data
    return NextResponse.json({
      success: true,
      data: explorer.birth_chart_data,
      birthData: {
        date: explorer.birth_date,
        time: explorer.birth_time,
        location: {
          name: explorer.birth_location_name,
          lat: explorer.birth_latitude,
          lng: explorer.birth_longitude,
          timezone: explorer.birth_timezone,
        },
      },
      meta: {
        calculatedAt: explorer.birth_chart_calculated_at,
        explorerName: explorer.explorer_name,
      }
    });

  } catch (error) {
    console.error('[Birth Chart] Fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch birth chart',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
