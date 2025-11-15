import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabaseServerClient';

export async function POST(request: NextRequest) {
  try {
    const { theme, previous, timestamp } = await request.json();

    // Get server-side Supabase client
    const supabase = getServerSupabaseClient();

    // Get current user session if available
    const { data: { session } } = await supabase.auth.getSession();

    // Log to event_logs table
    const { error: logError } = await supabase.from('event_logs').insert({
      event_name: 'theme_changed',
      user_id: session?.user?.id || null,
      metadata: {
        theme,
        previous,
        timestamp,
      },
      payload: {
        new: theme,
        previous,
        session_id: session?.access_token?.substring(0, 8) || null,
      }
    });

    if (logError) {
      console.error('Failed to log theme change:', logError);
    }

    // Update user profile if logged in
    if (session?.user?.id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ theme_preference: theme })
        .eq('id', session.user.id);

      if (profileError) {
        console.error('Failed to update user theme preference:', profileError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Theme API error:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}