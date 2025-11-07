import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { timeIt } from '@/lib/observability/timer';
import { recordVoiceTiming, recordVoiceError } from '@/lib/observability/voiceMetrics';

/**
 * OpenAI TTS (Text-to-Speech) Endpoint
 *
 * ONLY uses OpenAI for voice synthesis - NOT for conversation logic
 * MAIA's consciousness (PersonalOracleAgent, MAIAUnifiedConsciousness) handles all conversation
 */
export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'shimmer' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    console.log('🔊 Synthesizing speech with OpenAI TTS:', {
      textLength: text.length,
      voice
    });

    const openai = new OpenAI({ apiKey: openaiKey });

    // Time the TTS operation
    const { ms, value: mp3 } = await timeIt('voice.tts', async () => {
      return await openai.audio.speech.create({
        model: 'tts-1',
        voice: voice as any, // alloy, echo, fable, onyx, nova, shimmer
        input: text,
        speed: 1.0
      });
    });

    // Record timing metric
    recordVoiceTiming('voice.tts', ms, true, { provider: 'openai-tts', voice, textLength: text.length });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ TTS synthesis error:', error);
    recordVoiceError('voice.tts', error instanceof Error ? error.message : String(error), { provider: 'openai-tts' });
    return NextResponse.json(
      { error: 'Failed to synthesize speech' },
      { status: 500 }
    );
  }
}
