/**
 * Secure Server-Side Embeddings API
 *
 * Handles OpenAI embeddings generation on the server to keep API keys secure
 */

import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI client on server-side only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function POST(request: NextRequest) {
  try {
    const { text, model = 'text-embedding-3-small' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text parameter is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate embedding using OpenAI
    const response = await openai.embeddings.create({
      model,
      input: text.trim()
    });

    return NextResponse.json({
      embedding: response.data[0].embedding,
      model: response.model,
      usage: response.usage
    });

  } catch (error) {
    console.error('Embeddings API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate embedding' },
      { status: 500 }
    );
  }
}