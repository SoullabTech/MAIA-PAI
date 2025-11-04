import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate ephemeral client token for OpenAI Realtime API
 * Used to securely connect to Realtime API from browser
 */
export async function POST(req: NextRequest) {
  try {
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    console.log('🔑 Generating ephemeral token for Realtime API...');

    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'shimmer',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Ephemeral token generated');

    return NextResponse.json({
      token: data.value, // The ephemeral key starts with "ek_"
      expiresAt: data.expires_at,
    });

  } catch (error) {
    console.error('❌ Error generating ephemeral token:', error);
    return NextResponse.json(
      { error: 'Failed to generate ephemeral token', details: String(error) },
      { status: 500 }
    );
  }
}
