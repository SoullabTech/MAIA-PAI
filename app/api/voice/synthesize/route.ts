/**
 * 🔊 OpenAI TTS Synthesis Endpoint
 *
 * MAIA's consciousness (Spiralogic) speaks through OpenAI's voices
 * Target latency: ~200ms (faster & cheaper than ElevenLabs)
 *
 * Philosophy: MAIA's soul, OpenAI's voice
 */

import { NextRequest, NextResponse } from 'next/server';

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
    const { text, voice = 'shimmer', quality = 'standard', speed = 1.0, voiceTone } = await req.json();

    if (!text) {
      return NextResponse.json({
        success: false,
        error: 'No text provided'
      }, { status: 400 });
    }

    const selectedVoice = VOICE_MAP[voice] || 'shimmer';

    // 🔥 ELEMENTAL PROSODY: Apply voiceTone from adaptive-tone-engine
    // This gives Fire/Water/Earth/Air/Aether their unique voice characteristics
    let finalSpeed = speed;

    if (voiceTone) {
      console.log(`🌀 Applying elemental prosody: ${voiceTone.style}`, {
        pitch: voiceTone.pitch,
        rate: voiceTone.rate
      });

      // Rate modulation (direct speed adjustment)
      if (voiceTone.rate) {
        finalSpeed = voiceTone.rate;
      }

      // Pitch modulation (OpenAI doesn't have pitch, so use speed as proxy)
      // Higher pitch = slightly faster, lower pitch = slightly slower
      if (voiceTone.pitch && voiceTone.pitch !== 1.0) {
        finalSpeed *= (0.9 + (voiceTone.pitch * 0.1));
      }
    }

    console.log('🔊 Synthesizing with OpenAI TTS:', {
      text: text.substring(0, 50),
      voice: selectedVoice,
      quality,
      speed: finalSpeed,
      ...(voiceTone && { elementalStyle: voiceTone.style })
    });

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
        speed: finalSpeed, // 0.25 to 4.0 - now modulated by elemental prosody
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
    console.error('❌ Synthesis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to synthesize audio'
    }, { status: 500 });
  }
}
