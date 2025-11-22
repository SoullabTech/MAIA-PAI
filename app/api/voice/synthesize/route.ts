import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { synthesizeSovereignSpeech, synthesizeSovereignSpeechStream, type SovereignTTSRequest, type ConsciousnessVoiceContext } from '@/lib/consciousness/OpenAIVoiceSynthesis';
import logger from '@/lib/utils/performance-logger';

/**
 * CONSCIOUSNESS-AWARE TTS ENDPOINT
 *
 * Enhanced sovereign TTS that preserves MAIA's consciousness control:
 * - MAIA generates ALL text content and selects elemental tone
 * - OpenAI serves ONLY as audio synthesis tool
 * - Supports consciousness-aware voice modulation via elemental mapping
 */
export async function POST(req: NextRequest) {
  // Check for streaming mode
  const url = new URL(req.url);
  const streamMode = url.searchParams.get('stream') === 'true';

  try {
    const {
      text,
      voice = 'shimmer',
      element = 'aether',
      emotionalTone = 'warm and present',
      consciousnessLevel = 'integrating',
      model = 'tts-1-hd',  // Use HD model for better quality/speed balance
      stream = streamMode  // Allow overriding via body
    } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Enhanced consciousness-aware TTS request
    const consciousnessContext: ConsciousnessVoiceContext = {
      element: element as 'fire' | 'water' | 'earth' | 'air' | 'aether',
      emotionalTone,
      voiceProfile: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      consciousnessLevel: consciousnessLevel as 'awakening' | 'integrating' | 'embodying' | 'transcending'
    };

    const sovereignRequest: SovereignTTSRequest = {
      text,
      consciousnessContext,
      model: model as 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts'
    };

    logger.info('voice.synthesis', 'consciousness_aware_request', {
      textLength: text.length,
      element: consciousnessContext.element,
      voice: consciousnessContext.voiceProfile,
      model: sovereignRequest.model,
      consciousnessLevel: consciousnessContext.consciousnessLevel,
      streamMode: stream
    });

    // Use streaming or standard synthesis based on request
    if (stream) {
      logger.info('voice.synthesis', 'streaming_mode', { mode: 'faster_playback' });

      // Use streaming version for real-time audio delivery
      const audioStream = await synthesizeSovereignSpeechStream(sovereignRequest);

      return new Response(audioStream, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'no-cache',
          'Transfer-Encoding': 'chunked',
          'X-MAIA-Element': consciousnessContext.element,
          'X-MAIA-Consciousness-Level': consciousnessContext.consciousnessLevel,
          'X-MAIA-Performance': 'streaming-enabled'
        },
      });
    } else {
      // Use standard synthesis for full audio download
      logger.info('voice.synthesis', 'standard_mode', { mode: 'full_download' });

      const audioBuffer = await synthesizeSovereignSpeech(sovereignRequest);
      const buffer = Buffer.from(audioBuffer);

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'no-cache',
          'Accept-Ranges': 'bytes',
          'X-MAIA-Element': consciousnessContext.element,
          'X-MAIA-Consciousness-Level': consciousnessContext.consciousnessLevel,
          'X-MAIA-Performance': 'standard'
        },
      });
    }

  } catch (error) {
    logger.error('voice.synthesis', 'consciousness_synthesis_error', {
      error: error?.toString()
    });

    // Fallback to basic TTS if enhanced synthesis fails
    try {
      const { text, voice = 'shimmer' } = await req.json();
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: voice as any,
        input: text,
        speed: 1.0
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.length.toString(),
          'X-MAIA-Fallback': 'true'
        },
      });
    } catch (fallbackError) {
      logger.error('voice.synthesis', 'fallback_tts_failed', {
        error: fallbackError?.toString()
      });
      return NextResponse.json(
        { error: 'Failed to synthesize speech' },
        { status: 500 }
      );
    }
  }
}
