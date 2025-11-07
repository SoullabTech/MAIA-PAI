/**
 * 🔊 OpenAI TTS Synthesis Endpoint
 *
 * MAIA's consciousness (Spiralogic) speaks through OpenAI's voices
 * Target latency: ~200ms (faster & cheaper than ElevenLabs)
 *
 * Philosophy: MAIA's soul, OpenAI's voice
 * Fire Phase - Voice telemetry added
 */

import { NextRequest, NextResponse } from 'next/server';
import { recordVoiceTiming, recordVoiceError } from '@/lib/observability/voiceMetrics';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// OpenAI TTS voices - same as Realtime API
type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

const VOICE_MAP: Record<string, OpenAIVoice> = {
  'shimmer': 'shimmer', // Warm, engaging (default MAIA)
  'alloy': 'alloy',     // Neutral, balanced
  'echo': 'echo',       // Male, clear
  'fable': 'fable',     // British, expressive
  'onyx': 'onyx',       // Deep, authoritative
  'nova': 'nova',       // Upbeat, energetic
  'maia': 'shimmer'     // Alias for MAIA
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const { text, voice = 'shimmer', quality = 'standard', speed = 1.0 } = await req.json();

    if (!text) {
      return NextResponse.json({
        success: false,
        error: 'No text provided'
      }, { status: 400 });
    }

    console.log('🔊 Synthesizing with OpenAI TTS:', {
      text: text.substring(0, 50),
      voice,
      quality,
      speed
    });

    const selectedVoice = VOICE_MAP[voice] || 'shimmer';

    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: quality === 'hd' ? 'tts-1-hd' : 'tts-1', // tts-1 is faster (~200ms), tts-1-hd is higher quality
        voice: selectedVoice,
        input: text,
        speed: speed, // 0.25 to 4.0
        response_format: 'mp3' // mp3, opus, aac, flac
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ OpenAI TTS error:', error);
      return NextResponse.json({
        success: false,
        error: 'Synthesis failed'
      }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    const processingTime = Date.now() - startTime;

    recordVoiceTiming('voice.tts.openai', processingTime, true, {
      voice: selectedVoice,
      model: quality === 'hd' ? 'tts-1-hd' : 'tts-1',
      textLength: text.length,
      cost: (text.length / 1000 * 0.015).toFixed(4),
    });

    console.log(`⚡ OpenAI TTS complete: ${processingTime}ms (cost: ~$${(text.length / 1000 * 0.015).toFixed(4)})`);

    // Return audio as blob
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'X-Processing-Time': `${processingTime}ms`,
        'X-Voice': selectedVoice,
        'X-Model': quality === 'hd' ? 'tts-1-hd' : 'tts-1'
      }
    });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    recordVoiceError('voice.tts.openai', errorMsg, { voice, quality });
    console.error('❌ Synthesis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to synthesize audio'
    }, { status: 500 });
  }
}
