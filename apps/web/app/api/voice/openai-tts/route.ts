import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * PALLAS CSM Integration: Consciousness-Aware Prosody + OpenAI TTS
 *
 * Flow:
 * 1. Receive text + voiceTone (elemental state)
 * 2. Call PALLAS CSM /ci/shape to add consciousness-aware prosody
 * 3. Send shaped text to OpenAI TTS "alloy"
 * 4. Return natural audio with elemental modulation
 */

interface VoiceTone {
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  context?: 'guidance' | 'exploration' | 'reassurance';
  intensity?: number;
}

async function applyPallasProsody(text: string, voiceTone?: VoiceTone): Promise<string> {
  try {
    const pallasEndpoint = process.env.PALLAS_CSM_ENDPOINT || 'http://localhost:8000';

    console.log('🌀 [PALLAS] Applying consciousness-aware prosody...');
    console.log('   Element:', voiceTone?.element || 'neutral');
    console.log('   Context:', voiceTone?.context || 'none');

    const response = await fetch(`${pallasEndpoint}/ci/shape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        style: voiceTone?.element || 'neutral',
        archetype: voiceTone?.context || 'guide',
        meta: { intensity: voiceTone?.intensity || 0.7 }
      })
    });

    if (!response.ok) {
      console.warn('⚠️ PALLAS CSM unavailable, using original text');
      return text;
    }

    const result = await response.json();
    console.log('✨ [PALLAS] Prosody applied:', result.tags?.join(', '));
    return result.shaped || text;

  } catch (error) {
    console.warn('⚠️ PALLAS CSM error, using original text:', error);
    return text;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, agentVoice, speed = 0.95, model = 'tts-1-hd', voiceTone } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    console.log('🎯 [OpenAI TTS] Request received');
    console.log('   Text length:', text.length);
    console.log('   Voice:', agentVoice);
    console.log('   VoiceTone:', voiceTone);

    // 🌀 STEP 1: Apply PALLAS CSM consciousness-aware prosody
    const shapedText = await applyPallasProsody(text, voiceTone);

    // 🎤 STEP 2: Synthesize with OpenAI TTS "alloy"
    const voice = agentVoice === 'anthony' ? 'onyx' : 'alloy';

    console.log('🎤 [OpenAI TTS] Synthesizing with', voice);
    console.log('   Shaped text:', shapedText.substring(0, 100) + '...');

    const mp3Response = await openai.audio.speech.create({
      model: model as 'tts-1' | 'tts-1-hd',
      voice: voice as 'alloy' | 'onyx',
      input: shapedText,
      speed: speed,
    });

    const audioBuffer = Buffer.from(await mp3Response.arrayBuffer());

    console.log('✅ [OpenAI TTS] Audio generated:', audioBuffer.length, 'bytes');

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('❌ [OpenAI TTS] Error:', error);
    return NextResponse.json(
      { error: 'TTS generation failed', details: error.message },
      { status: 500 }
    );
  }
}
