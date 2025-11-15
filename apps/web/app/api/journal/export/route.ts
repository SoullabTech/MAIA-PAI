import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabaseServerClient';

export async function POST(req: NextRequest) {
  try {
    const { entry, mode, reflection, userId, element } = await req.json();

    if (!entry || !mode || !reflection) {
      return NextResponse.json(
        { error: 'Entry, mode, and reflection are required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Save journal entry to database directly
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        mode,
        prompt: entry,
        response: reflection,
        word_count: entry.split(/\s+/).length,
        reflection_quality: 'auto-generated'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save journal entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      entryId: data.id,
      message: 'Journal entry saved successfully'
    });

  } catch (error) {
    console.error('Journal export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}