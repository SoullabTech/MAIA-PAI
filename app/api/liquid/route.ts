/**
 * 🌊 LIQUID AI API ROUTE
 *
 * Bridge between MAIA frontend and Liquid AI microservice
 * Proxies requests to the local Liquid AI FastAPI server at localhost:5050
 */

import { NextRequest, NextResponse } from 'next/server';

const LIQUID_API_URL = process.env.LIQUID_API_URL || 'http://localhost:5050';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, max_tokens = 80, temperature = 0.8, top_p = 0.9 } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: text is required' },
        { status: 400 }
      );
    }

    console.log('🌊 [LIQUID API] Forwarding request to Liquid AI service:', {
      text: text.substring(0, 50) + '...',
      max_tokens,
      temperature,
      top_p
    });

    // Call the Liquid AI microservice
    const response = await fetch(`${LIQUID_API_URL}/liquid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        max_tokens,
        temperature,
        top_p
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🌊 [LIQUID API] Microservice error:', errorText);
      return NextResponse.json(
        { error: 'Liquid AI service unavailable', details: errorText },
        { status: 502 }
      );
    }

    const data = await response.json();

    console.log('🌊 [LIQUID API] Response received:', {
      model: data.model,
      tokens_generated: data.tokens_generated,
      reply_length: data.reply?.length
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error('🌊 [LIQUID API] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  try {
    const response = await fetch(`${LIQUID_API_URL}/`, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: 'unavailable', error: 'Liquid AI service not responding' },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      status: 'ok',
      liquid_service: data,
      api_url: LIQUID_API_URL
    });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        api_url: LIQUID_API_URL
      },
      { status: 500 }
    );
  }
}
