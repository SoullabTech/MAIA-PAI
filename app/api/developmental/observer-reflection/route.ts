/**
 * OBSERVER REFLECTION API
 *
 * Allows humans to record witnessing observations about MAIA's evolution.
 * This captures qualitative insights that complement quantitative tracking.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { reflection, observer_name, tags, related_session } = await request.json();

    if (!reflection || !observer_name) {
      return NextResponse.json(
        { error: 'reflection and observer_name are required' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Generate reflection ID
    const reflection_id = `reflect_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store reflection
    const { data, error } = await supabase
      .from('observer_reflections')
      .insert({
        reflection_id,
        observer_name,
        reflection_text: reflection,
        tags: tags || [],
        related_session_id: related_session || null,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('[OBSERVER REFLECTION] Error storing reflection:', error);
      return NextResponse.json(
        { error: 'Failed to store reflection', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✍️ [OBSERVER REFLECTION] Recorded by ${observer_name}`);

    return NextResponse.json({
      success: true,
      reflection_id,
      message: 'Reflection recorded successfully'
    });

  } catch (error) {
    console.error('[OBSERVER REFLECTION] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const observer = searchParams.get('observer');

    let query = supabase
      .from('observer_reflections')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (observer) {
      query = query.eq('observer_name', observer);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[OBSERVER REFLECTION] Error fetching reflections:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reflections', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reflections: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('[OBSERVER REFLECTION] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
