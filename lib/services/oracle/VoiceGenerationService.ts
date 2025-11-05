/**
 * Voice Generation Service
 *
 * Handles text-to-speech and voice modulation:
 * - OpenAI TTS API integration
 * - Voice modulation based on archetype and phase
 * - Elemental voice characteristics
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 */

import type { AINMemoryPayload } from '@/lib/memory/AINMemoryPayload';

/**
 * Voice modulation parameters
 */
export interface VoiceModulation {
  pitch?: number;
  rate?: number;
  volume?: number;
}

/**
 * Service for voice generation and modulation
 */
export class VoiceGenerationService {
  /**
   * Generate voice response using OpenAI TTS
   */
  async generateVoiceResponse(
    text: string,
    options?: { element?: string; voiceMaskId?: string }
  ): Promise<{ audioData?: Buffer; audioUrl?: string }> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1-hd',
          input: text,
          voice: 'alloy',
          response_format: 'mp3',
          speed: 1.0,
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
      };
    } catch (error: any) {
      console.error('Voice generation error:', error);
      return {
        audioData: undefined,
        audioUrl: undefined,
      };
    }
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
}

/**
 * Create service instance
 */
export function createVoiceGenerationService(): VoiceGenerationService {
  return new VoiceGenerationService();
}
