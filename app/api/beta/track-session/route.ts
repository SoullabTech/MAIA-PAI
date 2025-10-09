import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'No userId' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update session count and last active
    const { data: explorer, error } = await supabase
      .from('explorers')
      .select('session_count')
      .eq('explorer_id', userId)
      .single();

    if (explorer) {
      const newSessionCount = (explorer.session_count || 0) + (action === 'start' ? 1 : 0);

      await supabase
        .from('explorers')
        .update({
          session_count: newSessionCount
        })
        .eq('explorer_id', userId);

      console.log(`✅ Session tracked for ${userId}: ${newSessionCount} total sessions`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
