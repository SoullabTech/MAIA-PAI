/**
 * Memory Context Endpoint for Custom GPT
 * Retrieves user's AIN (Adaptive Intelligence Network) memory for conversation continuity
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🧠 Fetching AIN memory context for user ${userId}`);

    // Fetch AIN memory from Supabase
    const { data, error } = await supabase
      .from('ain_memory')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No memory found - return empty structure
        console.log(`📝 No memory found for user ${userId}, returning empty structure`);
        return NextResponse.json({
          spiralPhase: 'initiation',
          elementBalance: {
            fire: 25,
            water: 25,
            earth: 25,
            air: 25,
            aether: 0
          },
          activeArchetypes: [],
          symbolicThreads: [],
          ritualHistory: [],
          totalSessions: 0,
          lastSession: null,
          message: 'New user - no memory context yet'
        });
      }

      console.error('❌ Error fetching AIN memory:', error);
      return NextResponse.json(
        { error: 'Failed to fetch memory context', details: error.message },
        { status: 500 }
      );
    }

    if (!data || !data.memory_data) {
      return NextResponse.json({
        spiralPhase: 'initiation',
        elementBalance: { fire: 25, water: 25, earth: 25, air: 25, aether: 0 },
        activeArchetypes: [],
        symbolicThreads: [],
        ritualHistory: [],
        totalSessions: 0,
        lastSession: null
      });
    }

    // Extract memory payload
    const memory = data.memory_data;

    // Return structured memory context for Custom GPT
    return NextResponse.json({
      spiralPhase: memory.currentPhase || 'reflection',
      elementBalance: memory.elementalBalance || { fire: 25, water: 25, earth: 25, air: 25, aether: 0 },
      activeArchetypes: memory.archetypeProgression?.map((ap: any) => ({
        archetype: ap.archetype,
        depth: ap.depth,
        lastSeen: ap.lastSeen
      })) || [],
      symbolicThreads: memory.symbolicThreads?.map((thread: any) => ({
        symbol: thread.symbol,
        occurrences: thread.occurrences,
        contexts: thread.contexts,
        emotionalValence: thread.emotionalValence
      })) || [],
      ritualHistory: memory.ritualCompletions || [],
      totalSessions: memory.totalSessions || 0,
      lastSession: memory.lastInteraction,
      consciousnessLevel: memory.consciousnessLevel,
      growthEdge: memory.developmentalEdge,
      metadata: {
        userName: memory.userName,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    });

  } catch (error: any) {
    console.error('❌ Memory context error:', error);
    return NextResponse.json(
      {
        error: 'Memory context retrieval failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Handle CORS preflight for Custom GPT
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
