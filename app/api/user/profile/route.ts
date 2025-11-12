/**
 * User Profile API Route
 *
 * Server-side route to fetch user profile data from Supabase
 * This ensures proper data retrieval without localStorage dependency
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const domain = searchParams.get('domain');

    console.log('🔍 [User Profile API] Fetching profile for:', { userId, domain });

    // Production domain Kelly recognition
    if (domain && (domain.includes('soullab.life') || domain.includes('soullab.org'))) {
      console.log('🌟 [User Profile API] Kelly auto-recognized on production domain:', domain);
      return NextResponse.json({
        success: true,
        user: {
          id: 'kelly-nezat',
          name: 'Kelly',
          email: 'kelly@soullab.life'
        }
      });
    }

    // If no userId provided, check if we can identify from domain
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'No userId provided and domain not recognized'
      }, { status: 400 });
    }

    // Fetch from Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: userData, error: userError } = await supabase
      .from('beta_users')
      .select('id, email, timezone, referral_code, maya_instance, privacy_mode, evolution_level, onboarded')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('❌ [User Profile API] Error fetching user:', userError);
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Kelly special case
    if (userData.email === 'kelly@soullab.life' || userId === 'kelly-nezat') {
      console.log('🌟 [User Profile API] Kelly recognized by email/ID');
      return NextResponse.json({
        success: true,
        user: {
          id: userData.id,
          name: 'Kelly',
          email: userData.email,
          timezone: userData.timezone,
          onboarded: userData.onboarded
        }
      });
    }

    // For other users, extract name from email or use generic
    const nameFromEmail = userData.email?.split('@')[0] || null;
    const capitalizedName = nameFromEmail
      ? nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      : null;

    console.log('✅ [User Profile API] User profile fetched:', {
      id: userData.id,
      name: capitalizedName,
      email: userData.email
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        name: capitalizedName,
        email: userData.email,
        timezone: userData.timezone,
        onboarded: userData.onboarded
      }
    });

  } catch (error) {
    console.error('❌ [User Profile API] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
