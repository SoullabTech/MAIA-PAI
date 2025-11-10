/**
 * POST /api/memory/episodes - Create new episode
 * GET /api/memory/episodes - Get user's episodes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClientComponentClient } from '@/lib/supabase';
import { getStanzaWriter } from '@/lib/memory/bardic/StanzaWriter';
import type { StanzaInput } from '@/lib/memory/bardic/StanzaWriter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      occurredAt,
      text,
      placeCue,
      senseCues,
      people,
      affectValence,
      affectArousal,
      elementalState
    } = body;

    // Validation
    if (!userId || !occurredAt || !text) {
      return NextResponse.json(
        { error: 'userId, occurredAt, and text are required' },
        { status: 400 }
      );
    }

    // Generate stanza
    const stanzaWriter = getStanzaWriter();
    const stanzaInput: StanzaInput = {
      text,
      placeCue,
      senseCues,
      people,
      affectValence,
      affectArousal
    };
    const stanza = await stanzaWriter.write(stanzaInput);

    // Create episode
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from('episodes')
      .insert({
        user_id: userId,
        occurred_at: occurredAt,
        place_cue: placeCue,
        sense_cues: senseCues,
        people,
        affect_valence: affectValence,
        affect_arousal: affectArousal,
        elemental_state: elementalState,
        scene_stanza: stanza,
        sacred_flag: false
      })
      .select()
      .single();

    if (error) {
      console.error('[API /memory/episodes] Error creating episode:', error);
      return NextResponse.json(
        { error: 'Failed to create episode' },
        { status: 500 }
      );
    }

    // Generate and store embedding + links (async, don't wait)
    try {
      const { getEmbeddingService } = await import('@/lib/memory/bardic/EmbeddingService');
      const { getLinkingService } = await import('@/lib/memory/bardic/LinkingService');

      const embeddingService = getEmbeddingService();
      const linkingService = getLinkingService();

      // Run both in parallel
      Promise.all([
        embeddingService.embedEpisode(data.id, {
          text,
          stanza,
          placeCue,
          senseCues
        }),
        linkingService.generateLinks(data.id, userId)
      ]).catch(err => {
        console.error('[API /memory/episodes] Error in post-creation tasks:', err);
      });
    } catch (error) {
      // Non-fatal: episode is still created even if these fail
      console.error('[API /memory/episodes] Post-creation error:', error);
    }

    return NextResponse.json({
      episode: data,
      stanza
    });
  } catch (error) {
    console.error('[API /memory/episodes] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create episode' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeSacred = searchParams.get('includeSacred') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = createClientComponentClient();
    let query = supabase
      .from('episodes')
      .select('*')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false })
      .limit(limit);

    if (!includeSacred) {
      query = query.eq('sacred_flag', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API /memory/episodes] Error fetching episodes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch episodes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      episodes: data,
      count: data.length
    });
  } catch (error) {
    console.error('[API /memory/episodes] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
}
