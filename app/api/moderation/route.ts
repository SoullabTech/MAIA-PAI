/**
 * OpenAI Moderation API Endpoint
 * Secure server-side content moderation
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    const moderation = await openai.moderations.create({
      input: text
    });

    return NextResponse.json({
      results: moderation.results
    });

  } catch (error) {
    console.error('Moderation API error:', error);
    return NextResponse.json(
      {
        error: 'Moderation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}