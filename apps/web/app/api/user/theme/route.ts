import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabaseServerClient';

export async function POST(request: NextRequest) {
  try {
    const { theme, previous, timestamp } = await request.json();

    const supabase = getServerSupabaseClient();

    // Get current user session if available
    const { data: { session } } = await supabase.auth.getSession();

    // Log to event_logs table
    await supabase.from('event_logs').insert({
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

    // Update user profile if logged in
    if (session?.user?.id) {
      await supabase
        .from('profiles')
        .update({ theme_preference: theme })
        .eq('id', session.user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('Failed to log theme change:', error);
    return NextResponse.json({ error: 'Failed to log theme change' }, { status: 500 });
  }
}