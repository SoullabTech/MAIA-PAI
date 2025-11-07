/**
 * Voice Generation Service
 *
 * Handles text-to-speech and voice modulation:
 * - OpenAI TTS API integration
 * - Voice modulation based on archetype and phase
 * - Elemental voice characteristics
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 * Fire Phase - Voice telemetry added
 * Water Phase - Streaming + early-TTS preview
 */

import type { AINMemoryPayload } from '@/lib/memory/AINMemoryPayload';
import { timeIt } from '@/lib/observability/timer';
import { recordVoiceTiming, recordVoiceError } from '@/lib/observability/voiceMetrics';
import { ProsodyEngine } from '@/lib/voice/prosody/ProsodyEngine';
import { TextPostProcessor } from '@/lib/voice/prosody/TextPostProcessor';
import type { Element, SpeechAct } from '@/lib/voice/prosody/ProsodyEngine';

/**
 * Voice modulation parameters
 */
export interface VoiceModulation {
  pitch?: number;
  rate?: number;
  volume?: number;
}

/**
 * Helper to synthesize audio with OpenAI TTS
 */
async function synthesizeWithOpenAI(text: string, voiceId: string): Promise<ArrayBuffer> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1', // Use fast model for preview chunks
      input: text,
      voice: voiceId || 'alloy',
      response_format: 'mp3',
      speed: 1.0,
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.status}`);
  }

  return await response.arrayBuffer();
}

/**
 * Service for voice generation and modulation
 */
export class VoiceGenerationService {
  private buffer = '';
  private readonly sentenceRegex = /(.+?[\.!\?])(\s|$)/g;
  private voiceId: string;

  constructor(voiceId?: string) {
    this.voiceId = voiceId || 'alloy';
  }
  /**
   * Generate voice response using OpenAI TTS
   * Now with prosody shaping for more natural, present delivery
   */
  async generateVoiceResponse(
    text: string,
    options?: {
      element?: Element;
      speechAct?: SpeechAct;
      arousal?: number;
      valence?: number;
      voiceMaskId?: string;
    }
  ): Promise<{ audioData?: Buffer; audioUrl?: string }> {
    const { ms, value } = await timeIt('voice.tts.openai', async () => {
      try {
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OpenAI API key not configured');
        }

        // IMMEDIATE WIN: Shape text for better prosody
        const element = (options?.element as Element) || 'Water';
        const speechAct = options?.speechAct || 'reflect';
        const arousal = options?.arousal ?? 0.5;
        const valence = options?.valence ?? 0.5;

        // Generate prosody parameters
        const prosody = ProsodyEngine.generateParameters(
          element,
          speechAct,
          { valence, arousal },
          text
        );

        // Shape text (adds pauses, breath cues, emphasis)
        const shapedText = TextPostProcessor.shape(text, {
          element,
          arousal,
          valence,
          intent: speechAct
        }, prosody);

        console.log(`🎵 [Prosody] ${element}/${speechAct} - Shaped: "${shapedText.slice(0, 60)}..."`);

        const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1-hd',
            input: shapedText,  // Use shaped text
            voice: 'alloy',
            response_format: 'mp3',
            speed: prosody.rate / 150,  // Adjust speed based on element
          }),
        });

        if (!ttsResponse.ok) {
          throw new Error(`TTS API error: ${ttsResponse.status}`);
        }

        const audioBuffer = await ttsResponse.arrayBuffer();
        const audioData = Buffer.from(audioBuffer);
        const audioUrl = `data:audio/mp3;base64,${audioData.toString('base64')}`;

        return {
          audioData,
          audioUrl,
          success: true,
        };
      } catch (error: any) {
        console.error('Voice generation error:', error);
        recordVoiceError('voice.tts.openai', error, { element: options?.element });
        return {
          audioData: undefined,
          audioUrl: undefined,
          success: false,
        };
      }
    });

    recordVoiceTiming('voice.tts.openai', ms, value.success, {
      element: options?.element,
      textLength: text.length,
    });

    return {
      audioData: value.audioData,
      audioUrl: value.audioUrl,
    };
  }

  /**
   * Get voice modulation parameters based on user's memory state
   */
  getVoiceModulation(memory: AINMemoryPayload): VoiceModulation {
    try {
      const baseRate = 1.0;
      const basePitch = 1.0;

      // Phase affects speaking rate
      const phaseRateMap: Record<string, number> = {
        'Fire': 1.1,      // Faster, energized
        'Water': 0.95,    // Slower, reflective
        'Earth': 0.9,     // Grounded, deliberate
        'Air': 1.05,      // Light, flowing
        'Aether': 1.0     // Neutral, balanced
      };

      // Archetype affects pitch and warmth
      const archetypePitchMap: Record<string, number> = {
        'Sage': 0.95,     // Lower, wiser
        'Warrior': 1.05,  // Slightly higher, energetic
        'Healer': 1.0,    // Warm, balanced
        'Lover': 1.02,    // Gentle lift
        'Magician': 0.98, // Mysterious depth
        'Aether': 1.0     // Neutral
      };

      const rate = phaseRateMap[memory.currentPhase] || baseRate;
      const pitch = archetypePitchMap[memory.currentArchetype] || basePitch;

      return {
        rate,
        pitch,
        volume: 0.8 // Constant for now
      };
    } catch (error) {
      console.error('Error getting voice modulation:', error);
      return {
        rate: 1.0,
        pitch: 1.0,
        volume: 0.8
      };
    }
  }

  /**
   * Water Phase: Handle streaming text chunk and trigger early-TTS for complete sentences
   */
  async handleChunk(text: string, onAudio: (audio: ArrayBuffer) => Promise<void>) {
    this.buffer += text;

    // Find complete sentences to "preview speak"
    let match: RegExpExecArray | null;
    while ((match = this.sentenceRegex.exec(this.buffer)) !== null) {
      const sentence = match[1].trim();
      // Fire-and-forget preview TTS
      try {
        const { ms, value: audio } = await timeIt('voice.tts.openai', () =>
          synthesizeWithOpenAI(sentence, this.voiceId)
        );
        recordVoiceTiming('voice.tts.openai', ms, true, {
          provider: 'openai-tts',
          kind: 'preview',
          textLength: sentence.length
        });
        await onAudio(audio);
      } catch (err) {
        recordVoiceError('voice.tts.openai', err instanceof Error ? err.message : String(err), {
          kind: 'preview'
        });
      }
    }

    // Keep only the trailing incomplete fragment in buffer
    const lastTerminator = Math.max(
      this.buffer.lastIndexOf('.'),
      this.buffer.lastIndexOf('!'),
      this.buffer.lastIndexOf('?')
    );
    if (lastTerminator >= 0) {
      this.buffer = this.buffer.slice(lastTerminator + 1);
    }
  }

  /**
   * Water Phase: Flush remaining text buffer as final TTS
   */
  async flushRemainder(onAudio: (audio: ArrayBuffer) => Promise<void>) {
    const tail = this.buffer.trim();
    if (!tail) return;

    try {
      const { ms, value: audio } = await timeIt('voice.tts.openai', () =>
        synthesizeWithOpenAI(tail, this.voiceId)
      );
      recordVoiceTiming('voice.tts.openai', ms, true, {
        provider: 'openai-tts',
        kind: 'final',
        textLength: tail.length
      });
      await onAudio(audio);
    } catch (err) {
      recordVoiceError('voice.tts.openai', err instanceof Error ? err.message : String(err), {
        kind: 'final'
      });
    } finally {
      this.buffer = '';
    }
  }
}

/**
 * Create service instance
 */
export function createVoiceGenerationService(voiceId?: string): VoiceGenerationService {
  return new VoiceGenerationService(voiceId);
}
