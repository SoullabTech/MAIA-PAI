/**
 * OpenAI TTS Route - Maya with Alloy Voice
 * Natural, conversational voice synthesis without artificial pauses
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface MayaVoiceConfig {
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number;
  model: 'tts-1' | 'tts-1-hd';
}

interface VoiceTone {
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  context?: 'guidance' | 'exploration' | 'reassurance';
  intensity?: number;
  style?: string;
  pitch?: number;
  rate?: number;
}

/**
 * PALLAS CSM Integration: Apply consciousness-aware prosody
 */
async function applyPallasProsody(text: string, voiceTone?: VoiceTone): Promise<string> {
  try {
    const pallasEndpoint = process.env.PALLAS_CSM_ENDPOINT || 'http://localhost:8000';
    const element = voiceTone?.element || voiceTone?.style;
    const context = voiceTone?.context;

    if (!element) {
      return text; // No elemental modulation requested
    }

    console.log('🌀 [PALLAS] Applying consciousness-aware prosody...');
    console.log('   Element:', element);
    console.log('   Context:', context || 'none');

    const response = await fetch(`${pallasEndpoint}/ci/shape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        style: element,
        archetype: context || 'guide',
        meta: { intensity: voiceTone?.intensity || 0.7 }
      }),
      signal: AbortSignal.timeout(2000) // 2s timeout
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

// Maya's Serene Oracle Configuration - Tranquil wisdom meets knowing presence
// Voice Affect: Soft, gentle, soothing with Oracle-like knowing - embody peaceful wisdom
// Tone: Calm, reassuring, peaceful - genuine warmth without excessive sweetness
// Pacing: Slow, deliberate, unhurried - natural pauses for reflection and absorption
// Emotion: Deeply soothing yet grounded - serene presence with subtle knowing
// Pronunciation: Smooth, soft articulation - slightly elongated vowels for ease and flow
// Pauses: Thoughtful pauses between insights - space for wisdom to settle naturally
const MAYA_VOICE_CONFIG: MayaVoiceConfig = {
  voice: 'alloy',     // CRITICAL: Must be 'alloy' voice - warm, knowing, maternal
  speed: 0.95,        // Natural conversational pace (was too slow at 0.88)
  model: 'tts-1-hd'   // HD quality for clear, natural voice
};

/**
 * Clean text for natural speech synthesis
 * Removes artificial pauses and markup while preserving natural flow
 */
function cleanTextForSpeech(text: string): string {
  return text
    // Remove stage directions and markup
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    // Remove artificial pause markers
    .replace(/\.\.\./g, ',')     // Convert ellipses to commas for natural flow
    .replace(/—/g, ',')           // Convert em-dash to comma
    .replace(/\s*-\s*/g, ' ')     // Remove hyphens used as pauses
    // Clean up multiple punctuation
    .replace(/([.!?])\s*\1+/g, '$1')
    // Remove explicit breath or pause words
    .replace(/\b(pause|breath|hmm+|mmm+|uhh+|umm+)\b/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const { text, speed, voice: customVoice, prosody, agentVoice, voiceTone, language } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        {
          error: 'Voice synthesis unavailable',
          fallback: 'web_speech_api'
        },
        { status: 503 }
      );
    }

    // 🌀 STEP 1: Apply PALLAS CSM consciousness-aware prosody (if element specified)
    const shapedText = await applyPallasProsody(text, voiceTone);

    // STEP 2: Clean the shaped text for natural speech
    const cleanedText = cleanTextForSpeech(shapedText);

    // Voice selection: custom voice takes priority, then agent-based mapping
    // Updated default for Maya: shimmer (soft, gentle, nurturing) instead of alloy
    const voiceMapping: Record<string, string> = {
      maya: 'shimmer',    // Soft, gentle, nurturing - better for Maya's soulful presence
      anthony: 'onyx',    // Deep, authoritative male voice
      default: 'shimmer'
    };

    const selectedVoice = customVoice || (agentVoice ? voiceMapping[agentVoice] || voiceMapping.default : 'shimmer');
    console.log(`🎤 Using OpenAI voice: ${selectedVoice} ${customVoice ? '(custom)' : `(agent: ${agentVoice})`}`);

    const config = {
      ...MAYA_VOICE_CONFIG,
      voice: selectedVoice,
      ...(speed && { speed })
    };

    // 🔥 ELEMENTAL PROSODY: Apply voiceTone from adaptive-tone-engine
    // This gives Fire/Water/Earth/Air/Aether their unique voice characteristics
    if (voiceTone) {
      console.log(`🌀 Applying elemental prosody: ${voiceTone.style}`, {
        pitch: voiceTone.pitch,
        rate: voiceTone.rate
      });

      // Rate modulation (direct speed adjustment)
      if (voiceTone.rate) {
        config.speed = voiceTone.rate;
      }

      // Pitch modulation (OpenAI doesn't have pitch, so use speed as proxy)
      // Higher pitch = slightly faster, lower pitch = slightly slower
      if (voiceTone.pitch && voiceTone.pitch !== 1.0) {
        config.speed *= (0.9 + (voiceTone.pitch * 0.1));
      }
    }

    // Apply prosody adjustments if provided (legacy support)
    // Adjust pacing based on content type
    if (prosody) {
      if (prosody.speed) config.speed *= prosody.speed;
      if (prosody.pitch) {
        // OpenAI doesn't support pitch directly, but we can adjust speed slightly
        // Higher pitch = slightly faster, lower pitch = slightly slower
        config.speed *= (0.9 + (prosody.pitch * 0.2));
      }
    }

    // 🔥 ELEMENTAL PROSODY: Legacy "Serene Oracle pacing" rules have been DISABLED
    // They were overriding the elemental prosody system from adaptive-tone-engine.ts
    // Now config.speed is controlled ONLY by voiceTone (Fire/Water/Earth/Air/Aether)
    //
    // OLD CODE (interfered with elemental prosody):
    // if (text.includes('breathe') || text.includes('feel') || ...) {
    //   config.speed = 0.92;  ← This was overriding voiceTone!
    // }

    console.log('🔊 Generating speech with OpenAI TTS:', {
      voice: config.voice,
      speed: config.speed,
      language: language || 'en',
      textLength: cleanedText.length
    });

    // 🌍 MULTILINGUAL SUPPORT: OpenAI TTS automatically detects and pronounces
    // text in any language (50+ languages) without needing a language parameter.
    // It handles Spanish, French, Arabic, Chinese, etc. natively with correct pronunciation.
    // The 'language' parameter is tracked for logging but doesn't need to be passed to API.
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        input: cleanedText,
        voice: config.voice,
        speed: config.speed,
        response_format: 'mp3'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI TTS error:', response.status, error);
      throw new Error(`OpenAI TTS failed: ${response.status}`);
    }

    // Get the audio data
    const audioData = await response.arrayBuffer();

    // Return the audio with proper headers
    return new NextResponse(audioData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        'Content-Length': audioData.byteLength.toString(),
      }
    });

  } catch (error: any) {
    console.error('OpenAI TTS error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Voice synthesis failed',
        fallback: 'web_speech_api',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

// Optional GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    config: {
      voice: MAYA_VOICE_CONFIG.voice,
      speed: MAYA_VOICE_CONFIG.speed,
      model: MAYA_VOICE_CONFIG.model
    },
    description: 'Maya voice with OpenAI Alloy - natural conversational presence'
  });
}