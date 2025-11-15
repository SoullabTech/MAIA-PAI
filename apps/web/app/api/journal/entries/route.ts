import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabaseServerClient';

// Mark route as dynamic since it uses searchParams or other dynamic features
export const dynamic = 'force-dynamic';



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get journal entries directly from database
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch journal entries' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      entries: entries || [],
      stats: {
        totalEntries: entries?.length || 0,
        modeDistribution: {},
        last7Days: 0,
        last30Days: 0
      }
    });

  } catch (error) {
    console.error('Entries API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}