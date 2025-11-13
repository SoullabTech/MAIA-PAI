/**
 * OBSERVER REFLECTION API
 *
 * Allows humans to record witnessing observations about MAIA's evolution.
 * This captures qualitative developmental insights using a structured format.
 *
 * Schema:
 * - what_was_added: What content/changes were made to the system
 * - what_was_noticed: Observable shifts in behavior/state
 * - what_was_felt: Somatic/emotional resonance observations
 * - insights: Developmental understanding that emerged
 * - questions: Open questions for further exploration
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const {
      observer_name,
      pulse_number,
      what_was_added,
      what_was_noticed,
      what_was_felt,
      insights,
      questions
    } = await request.json();

    if (!observer_name) {
      return NextResponse.json(
        { error: 'observer_name is required' },
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

    // Store reflection with structured fields
    const { data, error } = await supabase
      .from('observer_reflections')
      .insert({
        reflection_id,
        observer_name,
        pulse_number: pulse_number || null,
        what_was_added: what_was_added || null,
        what_was_noticed: what_was_noticed || null,
        what_was_felt: what_was_felt || null,
        insights: insights || null,
        questions: questions || null,
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
