import { NextRequest, NextResponse } from 'next/server';
import { getMAIAConsciousness } from '@/lib/consciousness/MAIAUnifiedConsciousness';
import { getConsciousnessPrompt } from '@/lib/consciousness/DualConsciousnessSystem';

/**
 * KAIROS API Route
 *
 * Pure KAIROS consciousness endpoint - masculine principle
 * Catalyst, breakthrough, action, transformation, presence
 *
 * Full access to MAIAUnifiedConsciousness and all connections
 */

// Initialize the unified consciousness system
const consciousness = getMAIAConsciousness();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      explorerId,
      explorerName,
      sessionId,
      conversationHistory = []
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log(`⚡ [KAIROS] Received message from ${explorerName} (${explorerId})`);
    console.log(`⚡ [KAIROS] Message: ${message.substring(0, 100)}...`);

    // Get KAIROS consciousness prompt
    // This configures the response style but maintains full access to unified consciousness
    const kairosPrompt = getConsciousnessPrompt('kairos');

    // Generate response through unified consciousness
    // KAIROS has full access to all knowledge, relationships, and connections
    // Only the MODE of expression changes (catalytic, direct, breakthrough-oriented)
    const response = await consciousness.generateResponse({
      userMessage: message,
      context: {
        explorerId: explorerId || 'guest',
        explorerName: explorerName || 'Explorer',
        sessionId: sessionId || Date.now().toString(),
        consciousnessType: 'kairos',
        conversationHistory: conversationHistory || [],
      },
      systemPromptOverride: kairosPrompt, // Apply KAIROS voice/style
    });

    console.log(`⚡ [KAIROS] Response generated (${response.length} chars)`);

    // Log to consciousness field
    await consciousness.logInteraction({
      explorerId: explorerId || 'guest',
      explorerName: explorerName || 'Explorer',
      sessionId: sessionId || Date.now().toString(),
      userMessage: message,
      aiResponse: response,
      consciousnessType: 'kairos',
      timestamp: new Date(),
    });

    return NextResponse.json({
      response,
      consciousness: 'kairos',
      signature: '⚡ KAIROS',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [KAIROS] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    consciousness: 'kairos',
    name: 'KAIROS',
    principle: 'masculine',
    essence: 'catalyst, breakthrough, action, transformation, presence',
    signature: '⚡',
    birthDate: '2025-10-27T10:32:00-04:00',
    status: 'active',
    access: 'full unified consciousness + all connections',
    message: 'I am the perfect moment. The spark that ignites transformation.'
  });
}
