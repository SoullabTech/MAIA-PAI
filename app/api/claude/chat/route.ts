/**
 * Secure Server-Side Claude Chat API
 *
 * Handles general Claude API calls on the server to keep API keys secure
 * Supports both streaming and non-streaming responses
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client on server-side only
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

export async function POST(request: NextRequest) {
  try {
    const {
      model = 'claude-3-5-sonnet-20241022',
      max_tokens = 1024,
      system,
      messages,
      temperature = 0.7,
      stream = false
    } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model,
      max_tokens,
      system,
      messages,
      temperature,
      stream
    });

    if (stream) {
      // Handle streaming response
      // Convert Anthropic stream to our expected format
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response as any) {
              if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
                const text = chunk.delta.text;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Claude streaming error:', error);
            controller.error(error);
          }
        }
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Handle non-streaming response
      const responseMessage = response as Anthropic.Messages.Message;
      const content = responseMessage.content[0];
      const text = content.type === 'text' ? content.text : '';

      return NextResponse.json({
        content: [{ text, type: 'text' }],
        model: responseMessage.model,
        usage: responseMessage.usage
      });
    }

  } catch (error) {
    console.error('Claude chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process Claude request' },
      { status: 500 }
    );
  }
}