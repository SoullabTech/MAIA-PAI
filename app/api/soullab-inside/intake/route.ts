import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, data, timestamp } = await request.json();

    // Save to Supabase
    const { data: savedData, error } = await supabase
      .from('soullab_inside_intakes')
      .upsert({
        session_id: sessionId,
        intake_data: data,
        created_at: timestamp,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'session_id'
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data: savedData });

  } catch (error) {
    console.error('Error saving intake data:', error);
    return NextResponse.json(
      { error: 'Failed to save intake data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('soullab_inside_intakes')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Error fetching intake data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch intake data' },
      { status: 500 }
    );
  }
}
