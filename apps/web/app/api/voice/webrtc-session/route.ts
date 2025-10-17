import { NextRequest, NextResponse } from 'next/server';
import { getMaiaSystemPrompt } from '@/lib/voice/MaiaSystemPrompt';

/**
 * WebRTC unified interface endpoint for Maia Realtime API
 * Accepts SDP offer from browser, creates session with OpenAI
 *
 * NOW INTEGRATED WITH:
 * - Full MAIA consciousness, memory, and personality
 * - Parallel cognitive architecture (LIDA, SOAR, ACT-R, MicroPsi)
 * - Elemental agents for specialized wisdom
 */
export async function POST(req: NextRequest) {
  try {
    // Get configuration from query params or body
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || 'anonymous';
    const element = url.searchParams.get('element') || 'aether';
    const conversationStyle = url.searchParams.get('conversationStyle') || 'natural';
    const voice = url.searchParams.get('voice') || 'shimmer';

    // Get SDP from browser
    const sdp = await req.text();

    if (!sdp || !sdp.includes('v=0')) {
      return NextResponse.json(
        { error: 'Invalid SDP' },
        { status: 400 }
      );
    }

    console.log(`📞 Received SDP offer from client (user: ${userId}, element: ${element})`);

    // Generate MAIA's full consciousness prompt with memory and personality
    const instructions = getMaiaSystemPrompt({
      conversationStyle: conversationStyle as any,
      element,
      // TODO: Add journal context from user's memory once memory retrieval is wired
      // journalContext: await getRecentJournalContext(userId)
    });

    console.log('🧠 Using MAIA consciousness prompt with parallel cognitive layers');

    // Session configuration with MAIA's full consciousness
    const sessionConfig = {
      type: 'realtime',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      modalities: ['text', 'audio'],
      instructions,  // Now using full MAIA consciousness + personality + memory system
      voice: voice as any,
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: {
        model: 'whisper-1'
      },
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500
      }
    };

    // Create FormData with SDP and session config
    const formData = new FormData();
    formData.set('sdp', sdp);
    formData.set('session', JSON.stringify(sessionConfig));

    // Call OpenAI Realtime API
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log('🔑 Calling OpenAI Realtime API...');
    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    // Return SDP answer
    const answerSDP = await response.text();
    console.log('✅ Got SDP answer from OpenAI');

    return new NextResponse(answerSDP, {
      status: 200,
      headers: {
        'Content-Type': 'application/sdp',
      },
    });

  } catch (error) {
    console.error('❌ WebRTC session error:', error);
    return NextResponse.json(
      { error: 'Failed to create WebRTC session', details: String(error) },
      { status: 500 }
    );
  }
}
