/**
 * Lightweight Memory API Route
 * Server-side handler for memory operations with proper Supabase authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const soulSignature = searchParams.get('soulSignature');

    if (!soulSignature) {
      return NextResponse.json(
        { error: 'Missing soulSignature parameter' },
        { status: 400 }
      );
    }

    console.log('🌊 [API] Loading lightweight memory for:', soulSignature);

    // Load relationship essence
    const { data: essenceData, error: essenceError } = await supabaseAdmin
      .from('relationship_essence')
      .select('*')
      .eq('soul_signature', soulSignature)
      .maybeSingle();

    if (essenceError) {
      console.error('❌ [API] Error loading essence:', essenceError);
      return NextResponse.json(
        { error: 'Failed to load essence', details: essenceError.message },
        { status: 500 }
      );
    }

    if (!essenceData) {
      console.log('💫 [API] No essence found (first encounter)');
      return NextResponse.json({
        essence: null,
        archetypalThreads: [],
        recentBreakthrough: null
      });
    }

    const essence = {
      userId: essenceData.user_id,
      soulSignature: essenceData.soul_signature,
      userName: essenceData.user_name || undefined,
      presenceQuality: essenceData.presence_quality,
      archetypalResonances: essenceData.archetypal_resonances || [],
      spiralPosition: essenceData.spiral_position,
      relationshipField: essenceData.relationship_field,
      firstEncounter: essenceData.first_encounter,
      lastEncounter: essenceData.last_encounter,
      encounterCount: essenceData.encounter_count,
      morphicResonance: parseFloat(essenceData.morphic_resonance)
    };

    // Check if we should load additional memory
    const shouldLoadMemory =
      essence.encounterCount >= 3 &&
      essence.morphicResonance >= 0.3;

    if (!shouldLoadMemory) {
      console.log('💫 [API] Essence only (encounters < 3 or resonance < 0.3)');
      return NextResponse.json({
        essence,
        archetypalThreads: [],
        recentBreakthrough: null
      });
    }

    console.log('🌊 [API] Loading threads + breakthrough');

    // Load archetypal threads
    const { data: threadsData } = await supabaseAdmin
      .from('archetypal_threads')
      .select('*')
      .eq('soul_signature', soulSignature)
      .in('status', ['active', 'integrating'])
      .order('intensity', { ascending: false })
      .limit(2);

    // Load recent breakthrough
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: breakthroughData } = await supabaseAdmin
      .from('breakthrough_moments')
      .select('*')
      .eq('soul_signature', soulSignature)
      .gte('intensity', 0.8)
      .gte('timestamp', thirtyDaysAgo.toISOString())
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    const archetypalThreads = (threadsData || []).map((thread: any) => ({
      id: thread.id,
      theme: thread.theme,
      firstEmergence: new Date(thread.first_emergence),
      lastEmergence: new Date(thread.last_emergence),
      intensity: parseFloat(thread.intensity),
      status: thread.status,
      evolutionNotes: thread.evolution_notes || []
    }));

    const recentBreakthrough = breakthroughData ? {
      id: breakthroughData.id,
      content: breakthroughData.content,
      intensity: parseFloat(breakthroughData.intensity),
      archetypalTheme: breakthroughData.archetypal_theme,
      timestamp: new Date(breakthroughData.timestamp)
    } : null;

    return NextResponse.json({
      essence,
      archetypalThreads,
      recentBreakthrough
    });

  } catch (error: any) {
    console.error('❌ [API] Error in lightweight memory:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      soulSignature,
      userId,
      userName,
      conversationData
    } = body;

    if (!soulSignature || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('💾 [API] Updating memory for:', soulSignature);

    // Update or insert relationship essence
    const now = new Date().toISOString();

    const { data: existing } = await supabaseAdmin
      .from('relationship_essence')
      .select('encounter_count, morphic_resonance')
      .eq('soul_signature', soulSignature)
      .maybeSingle();

    const encounterCount = (existing?.encounter_count || 0) + 1;
    const morphicResonance = existing?.morphic_resonance || 0;

    const { error: upsertError } = await supabaseAdmin
      .from('relationship_essence')
      .upsert({
        soul_signature: soulSignature,
        user_id: userId,
        user_name: userName,
        last_encounter: now,
        encounter_count: encounterCount,
        morphic_resonance: morphicResonance,
        ...(existing ? {} : {
          first_encounter: now,
          presence_quality: 'open',
          archetypal_resonances: [],
          spiral_position: 'awareness',
          relationship_field: 'forming'
        })
      }, {
        onConflict: 'soul_signature'
      });

    if (upsertError) {
      console.error('❌ [API] Error upserting essence:', upsertError);
      return NextResponse.json(
        { error: 'Failed to update essence', details: upsertError.message },
        { status: 500 }
      );
    }

    // Save conversation messages if provided
    if (conversationData?.messages) {
      const { error: messagesError } = await supabaseAdmin
        .from('conversation_messages')
        .insert(conversationData.messages.map((msg: any) => ({
          session_id: conversationData.sessionId,
          user_id: userId,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp || now,
          metadata: msg.metadata || {}
        })));

      if (messagesError) {
        console.error('❌ [API] Error saving messages:', messagesError);
        // Don't fail the whole request if messages fail
      } else {
        console.log('✅ [API] Saved', conversationData.messages.length, 'messages');
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ [API] Error updating memory:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
