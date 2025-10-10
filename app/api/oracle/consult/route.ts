/**
 * Oracle Consultation Endpoint for Custom GPT
 * Provides archetypal wisdom from Elemental Oracle 2.0 framework
 */

import { NextRequest, NextResponse } from 'next/server';
import { PersonalOracleAgent } from '@/lib/agents/PersonalOracleAgent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userInput, conversationMode = 'classic', ainMemory } = body;

    if (!userId || !userInput) {
      return NextResponse.json(
        { error: 'userId and userInput are required' },
        { status: 400 }
      );
    }

    console.log(`🔮 Oracle consultation for user ${userId} in ${conversationMode} mode`);

    // Initialize Personal Oracle Agent
    const agent = new PersonalOracleAgent(userId, {
      conversationStyle: conversationMode,
      useVoice: false
    });

    // Process through full Oracle framework
    const response = await agent.processMessage(userInput);

    // Return Oracle wisdom + MAIA's embodied integration
    return NextResponse.json({
      oracleWisdom: {
        element: response.element,
        symbols: response.metadata.symbols || [],
        archetypes: response.metadata.archetypes || [],
        phase: response.metadata.phase || 'reflection',
        ritualSuggestions: response.suggestions || []
      },
      maiaResponse: response.response,
      element: response.element,
      metadata: {
        symbols: response.metadata.symbols || [],
        archetypes: response.metadata.archetypes || [],
        phase: response.metadata.phase,
        ainMemory: response.metadata.ainMemory,
        modelMetrics: response.metadata.modelMetrics,
        qualityMetrics: response.metadata.qualityMetrics
      }
    });

  } catch (error: any) {
    console.error('❌ Oracle consultation error:', error);
    return NextResponse.json(
      {
        error: 'Oracle consultation failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/oracle/consult',
    method: 'POST',
    description: 'Get archetypal wisdom from Elemental Oracle 2.0',
    requiredFields: ['userId', 'userInput'],
    optionalFields: ['conversationMode', 'ainMemory']
  });
}
