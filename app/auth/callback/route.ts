import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * OAuth Callback Handler
 *
 * Handles OAuth redirects from Apple, Google, etc.
 * Extracts session from URL hash and creates user profile
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('❌ OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (!code) {
    console.error('❌ No code in OAuth callback');
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=no_code`);
  }

  if (!supabase) {
    console.error('❌ Supabase not configured');
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=supabase_not_configured`);
  }

  try {
    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('❌ Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    if (!data.session || !data.user) {
      console.error('❌ No session or user after code exchange');
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=no_session`);
    }

    console.log('✅ OAuth sign-in successful:', {
      userId: data.user.id,
      email: data.user.email,
      provider: data.user.app_metadata.provider
    });

    // Check if user has completed onboarding
    const { data: userProfile } = await supabase
      .from('users')
      .select('onboarded')
      .eq('id', data.user.id)
      .single();

    // Redirect based on onboarding status
    if (userProfile?.onboarded) {
      console.log('🔄 Returning user - redirecting to intro');
      return NextResponse.redirect(`${requestUrl.origin}/intro`);
    } else {
      console.log('🆕 New user - redirecting to onboarding');
      return NextResponse.redirect(`${requestUrl.origin}/beta-onboarding`);
    }

  } catch (error: any) {
    console.error('❌ OAuth callback error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth?error=${encodeURIComponent(error.message)}`
    );
  }
}
