import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { timeIt } from '@/lib/observability/timer';
import { recordVoiceTiming, recordVoiceError } from '@/lib/observability/voiceMetrics';
import { trySesameHosts } from '@/lib/voice/sesameEndpoints';

/**
 * Sesame CSM TTS Endpoint with EnhancedSesameMayaRefiner Integration
 *
 * This endpoint provides consciousness-aware voice synthesis using:
 * - Sesame CSM for natural prosody, breathing pauses, and conversational flow
 * - EnhancedSesameMayaRefiner for elemental modulation and emotional voice params
 * - Context-aware voice characteristics based on conversation state
 *
 * Superior to OpenAI TTS because:
 * ✅ Natural prosody with "umms", "uhhs", breathing pauses
 * ✅ Elemental voice modulation (Fire, Water, Earth, Air, Aether, Shadow)
 * ✅ Emotional state awareness (VAD - Valence, Arousal, Dominance)
 * ✅ Conversational memory and context tracking
 * ✅ Maya-specific voice profile (oracle characteristics)
 * ✅ <200ms latency
 */

interface SesameTTSRequest {
  text: string;
  voice?: string; // OpenAI voice name for compatibility
  agentVoice?: string; // 'maya' or 'anthony'
  speed?: number;
  model?: string;

  // Enhanced Sesame parameters
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether' | 'shadow';
  emotionalState?: {
    valence?: number;  // 0-1 (negative to positive)
    arousal?: number;  // 0-1 (calm to excited)
    dominance?: number; // 0-1 (submissive to dominant)
  };
  conversationContext?: {
    threadId?: string;
    userId?: string;
    relationshipDepth?: number;
    breakthroughMarkers?: string[];
  };
}

interface SesameTTSResponse {
  success: boolean;
  audio?: ArrayBuffer;
  shaped_text?: string;
  voice_params?: {
    temperature: number;
    speed: number;
    modulation: string;
  };
  service: string;
  duration_ms?: number;
}

export async function POST(req: NextRequest) {
  try {
    // Check cookie for provider override
    const cookieStore = cookies();
    const providerCookie = cookieStore.get('voiceProvider');

    // If user explicitly chose OpenAI, bounce to OpenAI route
    if (providerCookie?.value === 'openai') {
      console.log('🎙️ Provider override: routing to OpenAI TTS');
      return NextResponse.redirect(new URL('/api/voice/openai-tts', req.url));
    }

    const body: SesameTTSRequest = await req.json();
    const {
      text,
      element = 'aether', // Default to aether for oracle voice
      emotionalState,
      conversationContext,
      agentVoice = 'maya',
      speed = 0.85 // Slower for mystical effect
    } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    console.log('🌀 Sesame CSM TTS:', {
      textLength: text.length,
      element,
      agentVoice,
      hasEmotionalState: !!emotionalState,
      hasContext: !!conversationContext
    });

    // Build request for Sesame CSM with EnhancedSesameMayaRefiner params
    const sesameRequest = {
      text: text,
      // Elemental voice parameters (from EnhancedSesameMayaRefiner)
      element: element,
      voice_params: getElementalVoiceParams(element, emotionalState),
      // Maya's CSM profile
      speaker_id: 15, // Reserved for Maya
      voice_profile: {
        pitch: 1.15,    // Ethereal quality
        rate: speed,
        stability: 0.6, // Balance consistency/variation
        warmth: 0.8     // Maternal caring tone
      },
      // Context for consciousness-aware synthesis
      context: conversationContext,
      // Output format
      output_format: 'mp3',
      quality: 'high'
    };

    console.log('🎙️ Attempting Sesame CSM with multi-host fallback...');

    // Time the Sesame TTS operation with multi-host fallback
    let usedHost = 'unknown';
    const { ms, value: audioBuffer } = await timeIt('voice.sesame-csm', async () => {
      return await trySesameHosts(
        sesameRequest,
        // onSuccess callback
        (host, duration) => {
          usedHost = host;
          recordVoiceTiming('voice.sesame-csm', duration, true, {
            provider: 'sesame-csm',
            element,
            agentVoice,
            textLength: text.length,
            host
          });
        },
        // onError callback
        (host, error) => {
          recordVoiceError('voice.sesame-csm', error.message, {
            provider: 'sesame-csm',
            element,
            agentVoice,
            host
          });
        }
      );
    });

    console.log('✅ Sesame CSM synthesis successful:', {
      duration_ms: ms,
      audio_size: audioBuffer.byteLength,
      element,
      host: usedHost
    });

    // Return audio with metadata headers
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'X-Voice-Provider': 'sesame-csm',
        'X-Voice-Element': element,
        'X-Voice-Agent': agentVoice,
        'X-Voice-Host': usedHost,
        'X-Synthesis-Duration-Ms': ms.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('❌ Sesame CSM TTS error:', error);
    recordVoiceError('voice.sesame-csm', error instanceof Error ? error.message : String(error), {
      provider: 'sesame-csm'
    });

    return NextResponse.json(
      {
        error: 'Failed to synthesize speech with Sesame CSM',
        message: error instanceof Error ? error.message : String(error),
        fallback: 'Consider using OpenAI TTS as fallback'
      },
      { status: 500 }
    );
  }
}

/**
 * Get elemental voice parameters based on element and emotional state
 * Mapping from EnhancedSesameMayaRefiner
 */
function getElementalVoiceParams(
  element: string,
  emotionalState?: { valence?: number; arousal?: number; dominance?: number }
) {
  // Base elemental parameters
  const ELEMENTAL_PARAMS: Record<string, any> = {
    air: {
      temperature: 0.7,   // More variation for intellectual exploration
      topk: 40,
      speed: 1.0,
      modulation: "bright"
    },
    fire: {
      temperature: 0.8,   // Higher energy, more dynamic
      topk: 35,
      speed: 1.1,
      modulation: "intense"
    },
    water: {
      temperature: 0.5,   // Stable, soothing
      topk: 25,
      speed: 0.9,
      modulation: "flowing"
    },
    earth: {
      temperature: 0.4,   // Very stable, grounded
      topk: 20,
      speed: 0.85,
      modulation: "grounded"
    },
    aether: {
      temperature: 0.65,  // Balanced mystical quality
      topk: 30,
      speed: 0.9,
      modulation: "ethereal"
    },
    shadow: {
      temperature: 0.55,  // Intimate, whispered
      topk: 22,
      speed: 0.8,
      modulation: "dark"
    }
  };

  const baseParams = ELEMENTAL_PARAMS[element] || ELEMENTAL_PARAMS.aether;

  // If no emotional state, return base params
  if (!emotionalState) {
    return baseParams;
  }

  // Apply emotional modulation (from EnhancedSesameMayaRefiner)
  const { valence = 0.5, arousal = 0.5, dominance = 0.5 } = emotionalState;

  return {
    ...baseParams,
    // High arousal = more variation
    temperature: blendParam(baseParams.temperature, 0.5 + (arousal * 0.3), 0.3),
    // Positive valence = warmer tone
    warmth: 0.6 + (valence * 0.3),
    // High dominance = more confident delivery
    stability: 0.5 + (dominance * 0.2),
    // Emotional intensity affects pacing
    speed: blendParam(
      baseParams.speed,
      arousal > 0.7 ? 1.05 : (arousal < 0.3 ? 0.85 : 0.95),
      0.4
    )
  };
}

/**
 * Blend two parameter values with weight
 */
function blendParam(base: number, modifier: number, weight: number): number {
  return base * (1 - weight) + modifier * weight;
}
