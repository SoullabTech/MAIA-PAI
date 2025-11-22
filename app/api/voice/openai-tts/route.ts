/**
 * OpenAI TTS Route - Maya with Alloy Voice
 * Natural, conversational voice synthesis without artificial pauses
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/utils/performance-logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface MayaVoiceConfig {
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number;
  model: 'tts-1' | 'tts-1-hd';
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
 * Performance-Optimized Voice Configuration Cache
 * Pre-computed mappings to eliminate per-request object creation
 */
const VOICE_MAPPING = {
  maya: 'shimmer',    // Soft, gentle, nurturing - better for Maya's soulful presence
  anthony: 'onyx',    // Deep, authoritative male voice
  default: 'shimmer'
} as const;

/**
 * Elemental Prosody Lookup Table
 * Pre-calculated elemental voice characteristics for O(1) access
 */
const ELEMENTAL_PROSODY_LUT = {
  fire: {
    speedMultiplier: 0.95,   // Slightly faster, more energetic
    rateAdjustment: 1.1,     // Higher energy
    description: 'Energetic and dynamic'
  },
  water: {
    speedMultiplier: 0.92,   // Slower, more flowing
    rateAdjustment: 0.88,    // Gentle, flowing rhythm
    description: 'Flowing and emotional'
  },
  earth: {
    speedMultiplier: 0.98,   // Grounded, steady pace
    rateAdjustment: 0.95,    // Steady, reliable rhythm
    description: 'Grounded and stable'
  },
  air: {
    speedMultiplier: 1.0,    // Clear, articulate
    rateAdjustment: 1.05,    // Light, quick rhythm
    description: 'Clear and intellectual'
  },
  aether: {
    speedMultiplier: 0.95,   // Mystical, deliberate
    rateAdjustment: 0.9,     // Spacious, transcendent rhythm
    description: 'Mystical and transcendent'
  }
} as const;

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

    // Clean the text for natural speech
    const cleanedText = cleanTextForSpeech(text);

    // Voice selection: custom voice takes priority, then agent-based mapping
    // Using cached VOICE_MAPPING for performance optimization
    const selectedVoice = customVoice || (agentVoice ? VOICE_MAPPING[agentVoice as keyof typeof VOICE_MAPPING] || VOICE_MAPPING.default : VOICE_MAPPING.default);
    logger.info('voice.config', 'voice_selected', {
      selectedVoice,
      customVoice: !!customVoice,
      agentVoice,
      textLength: cleanedText.length
    });

    const config = {
      ...MAYA_VOICE_CONFIG,
      voice: selectedVoice,
      ...(speed && { speed })
    };

    // 🔥 ELEMENTAL PROSODY: Apply voiceTone from adaptive-tone-engine
    // This gives Fire/Water/Earth/Air/Aether their unique voice characteristics
    if (voiceTone) {
      // Use pre-computed lookup table for elemental characteristics
      const elementalStyle = voiceTone.style?.toLowerCase() as keyof typeof ELEMENTAL_PROSODY_LUT;
      const elementalConfig = ELEMENTAL_PROSODY_LUT[elementalStyle];

      if (elementalConfig) {
        logger.info('voice.prosody', 'elemental_applied', {
          style: voiceTone.style,
          description: elementalConfig.description,
          speedMultiplier: elementalConfig.speedMultiplier,
          rateAdjustment: elementalConfig.rateAdjustment
        });

        // Apply pre-calculated elemental adjustments
        config.speed *= elementalConfig.speedMultiplier;
      }

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

    // Add timeout and retry logic for OpenAI API
    const maxRetries = 3;
    let response: Response | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

        response = await fetch('https://api.openai.com/v1/audio/speech', {
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
          }),
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (response.ok) {
          break;
        }

        // Handle rate limiting or server errors
        if (response.status === 429 || response.status >= 500) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.warn(`⚠️  [TTS] Status ${response.status}, attempt ${attempt}/${maxRetries} - waiting ${waitTime}ms`);

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }

        const error = await response.text();
        console.error('OpenAI TTS error:', response.status, error);
        throw new Error(`OpenAI TTS failed: ${response.status}`);

      } catch (error: any) {
        // Handle timeout or network errors
        if (error.name === 'AbortError' || error.message?.includes('fetch')) {
          console.warn(`⚠️  [TTS TIMEOUT/NETWORK] Attempt ${attempt}/${maxRetries}`);

          if (attempt < maxRetries) {
            const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        throw error;
      }
    }

    if (!response || !response.ok) {
      const error = response ? await response.text() : 'No response from OpenAI';
      console.error('OpenAI TTS error:', response?.status, error);
      throw new Error(`OpenAI TTS failed: ${response?.status || 'timeout'}`);
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