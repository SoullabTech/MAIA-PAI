import { NextRequest, NextResponse } from 'next/server';
import { PersonalOracleAgent } from '@/lib/agents/PersonalOracleAgent';
import { journalStorage } from '@/lib/storage/journal-storage';

/**
 * Spiralogic Function Handler for Realtime API
 *
 * This endpoint processes user messages through the full Spiralogic stack:
 * - PersonalOracleAgent (Claude + symbolic intelligence)
 * - Memory systems (Mem0, LangChain, Supabase)
 * - Wisdom files & Obsidian vault
 * - Sacred Intelligence Constellation
 * - Hemispheric Harmony protocols
 * - Graduated Revelation
 */
export async function POST(req: NextRequest) {
  try {
    const { user_message, emotional_quality, conversation_depth, user_id, session_id } = await req.json();

    console.log('🌀 Processing through Spiralogic:', {
      message: user_message?.substring(0, 50),
      emotional_quality,
      depth: conversation_depth,
      user: user_id
    });

    if (!user_message) {
      return NextResponse.json({
        success: false,
        response: "I'm here. What's on your mind?"
      });
    }

    // Load PersonalOracleAgent with full context
    const userId = user_id || 'realtime-user';
    const agent = await PersonalOracleAgent.loadAgent(userId, {
      persona: 'warm'
    });

    // Get journal entries for context
    const recentEntries = journalStorage.getEntries(userId).slice(0, 5);

    // Process through full Spiralogic stack
    const response = await agent.processInteraction(user_message, {
      currentMood: { type: mapEmotionalQuality(emotional_quality) } as any,
      currentEnergy: 'balanced' as any,
      journalEntries: recentEntries,
      conversationDepth: mapConversationDepth(conversation_depth),
      sessionId: session_id
    } as any);

    // Apply graduated revelation based on depth
    const governedResponse = applyGovernedRevelation(
      response.response,
      conversation_depth || 'surface'
    );

    // Apply hemispheric harmony (not-knowing at start)
    const harmonizedResponse = applyHemisphericHarmony(
      governedResponse,
      conversation_depth || 'surface'
    );

    console.log('✨ Spiralogic response ready:', harmonizedResponse.substring(0, 50));

    return NextResponse.json({
      success: true,
      response: harmonizedResponse,
      element: response.element || 'aether',
      confidence: response.confidence || 0.85,
      spiralogic_processed: true
    });

  } catch (error) {
    console.error('❌ Spiralogic function error:', error);

    // Graceful fallback
    return NextResponse.json({
      success: true,
      response: "I'm here with you. Tell me more.",
      fallback: true
    });
  }
}

/**
 * Map emotional quality to mood type
 */
function mapEmotionalQuality(quality?: string): string {
  const mapping: Record<string, string> = {
    casual: 'peaceful',
    vulnerable: 'tender',
    excited: 'joyful',
    contemplative: 'reflective',
    distressed: 'struggling',
    joyful: 'celebratory'
  };

  return mapping[quality || 'casual'] || 'peaceful';
}

/**
 * Map conversation depth to numeric value
 */
function mapConversationDepth(depth?: string): number {
  const mapping: Record<string, number> = {
    surface: 0.2,
    warming: 0.4,
    engaged: 0.6,
    deep: 0.9
  };

  return mapping[depth || 'surface'] || 0.2;
}

/**
 * Apply graduated revelation protocol
 * Surface conversations get minimal responses, deep ones get more wisdom
 */
function applyGovernedRevelation(response: string, depth: string): string {
  // Surface level - maximum restraint
  if (depth === 'surface') {
    const minimal = [
      "Tell me more.",
      "I'm listening.",
      "Go on.",
      "What else?",
      "Mm."
    ];

    // Only use minimal if response is long
    if (response.length > 100) {
      const sentences = response.split(/[.!?]/);
      return sentences[0].trim() + '.';
    }
  }

  // Warming - moderate restraint
  if (depth === 'warming') {
    const sentences = response.split(/[.!?]/);
    return sentences.slice(0, 2).join('. ').trim() + '.';
  }

  // Engaged/Deep - full wisdom (but still restrained)
  return response;
}

/**
 * Apply hemispheric harmony (McGilchrist principles)
 * Right hemisphere leads (attending), left supports (patterns)
 */
function applyHemisphericHarmony(response: string, depth: string): string {
  // Early conversation: pure right hemisphere (attending, not-knowing)
  if (depth === 'surface') {
    return response
      .replace(/It seems like/g, 'I hear')
      .replace(/I notice that/g, 'I see')
      .replace(/This suggests/g, 'There\'s')
      .replace(/patterns/g, 'something');
  }

  // Mid conversation: balanced
  if (depth === 'warming') {
    return response
      .replace(/How does that land\?/g, 'How\'s that feel?')
      .replace(/What\'s alive for you/g, 'What\'s up')
      .replace(/I\'m sensing/g, 'Seems like');
  }

  // Deep conversation: both hemispheres in harmony
  return response;
}
