'use client';

import { createClientComponentClient } from '@/lib/supabase';
import { saveMaiaToAkashic } from '@/lib/saveMaiaInsight'; // 🎙️ Dual-save to Akashic Records

export interface ConversationMemory {
  oracleAgentId: string;
  content: string;
  memoryType: 'conversation' | 'ritual' | 'dream' | 'reflection' | 'insight' | 'question';
  sourceType: 'voice' | 'text' | 'ritual' | 'dream' | 'journal';
  emotionalTone?: string;
  wisdomThemes?: string[];
  elementalResonance?: string;
  sessionId?: string;
  userId?: string; // 🆕 For Akashic Records integration
  role?: 'user' | 'assistant'; // 🆕 Who said this (user or MAIA)
  conversationMode?: string; // 🆕 MAIA mode: "dialogue" | "patient" | "scribe"
}

export async function saveConversationMemory(memory: ConversationMemory) {
  const supabase = createClientComponentClient();

  try {
    // 1️⃣ Save to memories table (existing behavior)
    const { data, error } = await supabase
      .from('memories')
      .insert({
        oracle_agent_id: memory.oracleAgentId,
        content: memory.content,
        memory_type: memory.memoryType,
        source_type: memory.sourceType,
        emotional_tone: memory.emotionalTone,
        wisdom_themes: memory.wisdomThemes,
        elemental_resonance: memory.elementalResonance,
        session_id: memory.sessionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Memory saved to memories table:', data.id);

    // 2️⃣ DUAL-SAVE: Also save to Akashic Records (insight_history)
    // This enables semantic search across MAIA conversations
    if (memory.role) {
      await saveMaiaToAkashic(
        memory.role,
        memory.content,
        memory.userId,
        memory.conversationMode,
        memory.sessionId
      );
    }

    return { success: true, memory: data };
  } catch (error) {
    console.error('Failed to save memory:', error);
    return { success: false, error };
  }
}

export async function getConversationHistory(oracleAgentId: string, limit = 20) {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('oracle_agent_id', oracleAgentId)
      .eq('memory_type', 'conversation')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    console.log(`✅ Retrieved ${data.length} memories from Supabase`);
    return { success: true, memories: data };
  } catch (error) {
    console.error('Failed to retrieve memories:', error);
    return { success: false, error, memories: [] };
  }
}

export async function getOracleAgentId(userId: string): Promise<string | null> {
  const supabase = createClientComponentClient();

  try {
    // Validate UUID format to prevent database errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.log(`[memoryService] Skipping agent lookup for non-UUID user: ${userId}`);
      return null;
    }

    const { data, error } = await supabase
      .from('oracle_agents')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data?.id || null;
  } catch (error) {
    console.error('Failed to get oracle agent ID:', error);
    return null;
  }
}
