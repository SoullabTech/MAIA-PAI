/**
 * Chat API Route - General purpose chat endpoint for MAIA conversations
 * Used by Holoflower Oracle and other conversational interfaces
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getMayaSystemPrompt } from '@/lib/oracle/MaiaSystemPrompt';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Missing or invalid messages array' },
        { status: 400 }
      );
    }

    // Get API key
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('❌ [Chat] Claude API key not found');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log(`💬 [Chat] Processing conversation with ${messages.length} messages`);

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Separate system messages from conversation messages
    const systemMessage = messages.find((m: any) => m.role === 'system');
    const conversationMessages = messages.filter((m: any) => m.role !== 'system');

    // Get full MAIA system prompt with complete Spiralogic framework
    const fullSystemPrompt = getMayaSystemPrompt();

    // Create message with Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemMessage?.content || fullSystemPrompt,
      messages: conversationMessages.map((m: any) => ({
        role: m.role,
        content: m.content
      }))
    });

    // Extract text response
    const textContent = response.content.find((c: any) => c.type === 'text');
    const responseText = (textContent && 'text' in textContent && textContent.text) || 'I sense something profound here. Tell me more...';

    console.log(`✅ [Chat] Response generated (${response.usage.input_tokens} in, ${response.usage.output_tokens} out)`);

    // Return response
    return NextResponse.json({
      response: responseText,
      usage: response.usage
    });

  } catch (error) {
    console.error('❌ [Chat] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process chat',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Chat API ready',
    version: '1.0.0',
    message: 'POST messages array to start conversation'
  });
}
