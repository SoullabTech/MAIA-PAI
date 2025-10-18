/**
 * Imaginal Session API Route
 *
 * Handles active imagination dialogue with MAIA using Anthropic Claude
 * Streams responses token-by-token for natural, breathing conversation
 */

import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage, PlanetPlacement } from '@/types/astrology';

// Use edge runtime for faster streaming
export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, placements } = body as {
      messages: ChatMessage[];
      placements: PlanetPlacement[];
    };

    console.log(`[API /imaginal/session] Received ${messages.length} messages`);
    console.log(`[API /imaginal/session] Active placements: ${placements.length}`);

    // Extract system prompt and conversation messages
    const systemMessage = messages.find((m) => m.role === 'system')?.content || '';
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemMessage,
      messages: conversationMessages,
    });

    // Create a readable stream for the client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const text = chunk.delta.text;
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error('[API /imaginal/session] Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[API /imaginal/session] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process imaginal session' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
