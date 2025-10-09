/**
 * Maya V2 API Route - MaiaOrchestrator Architecture
 *
 * This route uses the new MaiaOrchestrator system where Maia routes
 * between different backends (Claude, Telesphorus, internal) while
 * maintaining consistent voice.
 */

import { NextRequest, NextResponse } from 'next/server';
import MaiaOrchestrator from '@/lib/services/MaiaOrchestrator';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { message, userId, userName, context } = await request.json();

    // Validate required fields
    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, userId' },
        { status: 400 }
      );
    }

    // Get API key
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('❌ [V2] Claude API key not found');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log(`🧪 [V2] Processing message for user ${userId}:`, message.substring(0, 50));

    // Initialize orchestrator
    const orchestrator = new MaiaOrchestrator(apiKey, 'symbolic');

    // Process message through orchestrator
    const result = await orchestrator.processMessage(message, {
      userId,
      userName,
      ...context
    });

    console.log(`✅ [V2] Response generated via ${result.source} in ${result.processingTime}ms`);

    // Return response with metadata
    return NextResponse.json({
      response: result.response,
      source: result.source,
      metadata: {
        ...result.soulMetadata,
        fieldState: result.fieldState,
        processingTime: result.processingTime,
        intentUsed: result.intentUsed
      }
    });

  } catch (error) {
    console.error('❌ [V2] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
