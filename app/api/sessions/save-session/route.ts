/**
 * Save Session API Endpoint
 * Saves scribe sessions to Supabase for persistence and retrieval
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const {
      sessionId,
      userId,
      transcript,
      summary,
      reflection,
      participants,
      mode
    } = await req.json();

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'sessionId and userId are required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Save session to database
    const { data, error } = await supabase
      .from('scribe_sessions')
      .upsert({
        session_id: sessionId,
        user_id: userId,
        transcript: transcript || [],
        summary: summary || {},
        reflection: reflection || {},
        participants: participants || [],
        mode: mode || 'scribe',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'session_id'
      });

    if (error) {
      console.error('❌ Failed to save session:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Session saved successfully',
      sessionId
    });

  } catch (error: any) {
    console.error('❌ Session save error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save session',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions/save-session
 * Retrieve saved sessions for a user
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'userId or sessionId is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    let query = supabase.from('scribe_sessions').select('*');

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    } else if (userId) {
      query = query.eq('user_id', userId).order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessions: data
    });

  } catch (error: any) {
    console.error('❌ Session retrieval error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve sessions',
        details: error.message
      },
      { status: 500 }
    );
  }
}
