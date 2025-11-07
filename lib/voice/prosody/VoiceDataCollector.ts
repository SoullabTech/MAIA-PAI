/**
 * MAIA Voice Data Collection Pipeline
 *
 * Collects MAIA's responses with full context for voice training
 * Bootstraps from existing Sesame output to learn prosody patterns
 */

import fs from 'fs/promises';
import path from 'path';
import type { Element, SpeechAct, EmotionalContext } from './ProsodyEngine';

export interface VoiceSample {
  id: string;
  timestamp: string;

  // Text content
  text: string;
  wordCount: number;

  // Context
  element: Element;
  speechAct: SpeechAct;
  emotionalContext: EmotionalContext;

  // Prosody (extracted from audio)
  prosody?: {
    duration: number;      // Total duration in ms
    pauseLocations: number[]; // Pause timestamps
    pauseDurations: number[]; // Pause lengths in ms
    emphasisWords: string[];  // Words with emphasis
    averageRate: number;    // Words per minute
  };

  // Audio paths
  audioPath?: string;     // Path to audio file
  audioFormat?: string;   // mp3, wav, etc.

  // Quality ratings (for A/B testing)
  ratings?: {
    naturalness: number;  // 1-5
    warmth: number;       // 1-5
    clarity: number;      // 1-5
    presence: number;     // 1-5
    feltMet: number;      // 1-5
  };
}

export class VoiceDataCollector {
  private dataDir: string;
  private samples: VoiceSample[] = [];

  constructor(dataDir: string = '/Users/soullab/MAIA-FRESH/services/tts-xtts/training_data') {
    this.dataDir = dataDir;
  }

  /**
   * Initialize data collection directory
   */
  async initialize(): Promise<void> {
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.mkdir(path.join(this.dataDir, 'audio'), { recursive: true });
    await fs.mkdir(path.join(this.dataDir, 'manifests'), { recursive: true });

    console.log(`✅ Voice data collector initialized at ${this.dataDir}`);
  }

  /**
   * Record a MAIA response for training
   */
  async recordSample(
    text: string,
    element: Element,
    speechAct: SpeechAct,
    emotionalContext: EmotionalContext,
    audioBuffer?: ArrayBuffer  // Optional: audio from Sesame or OpenAI
  ): Promise<string> {
    const id = this.generateId();
    const timestamp = new Date().toISOString();

    const sample: VoiceSample = {
      id,
      timestamp,
      text,
      wordCount: text.split(/\s+/).length,
      element,
      speechAct,
      emotionalContext
    };

    // Save audio if provided
    if (audioBuffer) {
      const audioPath = path.join(this.dataDir, 'audio', `${id}.mp3`);
      await fs.writeFile(audioPath, Buffer.from(audioBuffer));
      sample.audioPath = audioPath;
      sample.audioFormat = 'mp3';

      // Extract prosody from audio (placeholder - needs audio analysis)
      sample.prosody = await this.extractProsody(audioBuffer, text);
    }

    // Add to collection
    this.samples.push(sample);

    // Save manifest
    await this.saveManifest();

    console.log(`📝 Recorded sample ${id}: "${text.slice(0, 50)}..." [${element}/${speechAct}]`);

    return id;
  }

  /**
   * Extract prosody patterns from audio
   * (Placeholder - would use audio analysis library in production)
   */
  private async extractProsody(audioBuffer: ArrayBuffer, text: string): Promise<VoiceSample['prosody']> {
    // In production, this would use:
    // - Web Audio API or librosa (Python) to detect pauses
    // - Pitch tracking to find emphasis
    // - Duration analysis

    // For now, return estimated values
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = wordCount * 400; // Rough estimate: 400ms per word

    return {
      duration: estimatedDuration,
      pauseLocations: [],
      pauseDurations: [],
      emphasisWords: [],
      averageRate: (wordCount / estimatedDuration) * 60000  // WPM
    };
  }

  /**
   * Save manifest file
   */
  private async saveManifest(): Promise<void> {
    const manifestPath = path.join(this.dataDir, 'manifests', 'training_manifest.json');

    await fs.writeFile(
      manifestPath,
      JSON.stringify(this.samples, null, 2),
      'utf-8'
    );
  }

  /**
   * Load existing samples
   */
  async load(): Promise<void> {
    const manifestPath = path.join(this.dataDir, 'manifests', 'training_manifest.json');

    try {
      const data = await fs.readFile(manifestPath, 'utf-8');
      this.samples = JSON.parse(data);
      console.log(`✅ Loaded ${this.samples.length} voice samples`);
    } catch (err) {
      console.log('No existing manifest found, starting fresh');
      this.samples = [];
    }
  }

  /**
   * Generate golden set for testing
   * 50 canonical lines covering all elements and speech acts
   */
  static generateGoldenSet(): Array<{text: string; element: Element; speechAct: SpeechAct}> {
    return [
      // Fire - Invitations
      { text: "What if you let yourself feel the full power of this moment?", element: 'Fire', speechAct: 'invite' },
      { text: "I sense there's a fierce truth wanting to be spoken here.", element: 'Fire', speechAct: 'reflect' },
      { text: "Yes, absolutely. Your passion is a sacred gift.", element: 'Fire', speechAct: 'affirm' },

      // Water - Reflections
      { text: "Notice how the feeling moves through you, like water finding its course.", element: 'Water', speechAct: 'reflect' },
      { text: "What would it be like to simply allow this to flow?", element: 'Water', speechAct: 'invite' },
      { text: "I'm here with you in this.", element: 'Water', speechAct: 'hold' },

      // Earth - Grounding
      { text: "Let's take a moment to ground into what's actually true.", element: 'Earth', speechAct: 'guide' },
      { text: "You have everything you need, right here, right now.", element: 'Earth', speechAct: 'affirm' },
      { text: "What do you know to be true in your body?", element: 'Earth', speechAct: 'invite' },

      // Air - Clarity
      { text: "Another way to see this might be through the lens of curiosity.", element: 'Air', speechAct: 'reframe' },
      { text: "Let me reflect back what I'm hearing clearly.", element: 'Air', speechAct: 'reflect' },
      { text: "You've articulated something profound here.", element: 'Air', speechAct: 'affirm' },

      // Aether - Mystical
      { text: "There is a deeper wisdom unfolding through this experience.", element: 'Aether', speechAct: 'reflect' },
      { text: "May you walk this path knowing you are held by something vast.", element: 'Aether', speechAct: 'bless' },
      { text: "What mystery is calling you forward?", element: 'Aether', speechAct: 'invite' },

      // Transitions
      { text: "Let's shift our attention gently to what's arising now.", element: 'Water', speechAct: 'guide' },
      { text: "I want to acknowledge the courage it took to share that.", element: 'Fire', speechAct: 'affirm' },

      // Holding Space
      { text: "You don't have to have it figured out. I'm here.", element: 'Water', speechAct: 'hold' },
      { text: "This moment, just as it is, is enough.", element: 'Aether', speechAct: 'affirm' },

      // Closures/Blessings
      { text: "May you carry this insight with you as you continue your journey.", element: 'Aether', speechAct: 'bless' },
      { text: "I see you, and I honor this unfolding.", element: 'Water', speechAct: 'bless' },

      // Add 30 more diverse samples covering edge cases...
      // (Truncated for brevity - would include 50 total)
    ];
  }

  /**
   * Export training data in format for XTTS fine-tuning
   */
  async exportForTraining(): Promise<void> {
    const exportDir = path.join(this.dataDir, 'exports', 'xtts_training');
    await fs.mkdir(exportDir, { recursive: true });

    // Create metadata.csv for XTTS
    const metadataLines = this.samples
      .filter(s => s.audioPath) // Only samples with audio
      .map(s => {
        const audioFilename = path.basename(s.audioPath!);
        // Format: audio_file|text|speaker_name
        return `${audioFilename}|${s.text}|maia_${s.element.toLowerCase()}`;
      });

    await fs.writeFile(
      path.join(exportDir, 'metadata.csv'),
      metadataLines.join('\n'),
      'utf-8'
    );

    // Create style_tokens.json for elemental voices
    const styleTokens = {
      fire: {
        description: "Passionate, energized, conviction",
        sample_ids: this.samples.filter(s => s.element === 'Fire').map(s => s.id)
      },
      water: {
        description: "Reflective, flowing, gentle",
        sample_ids: this.samples.filter(s => s.element === 'Water').map(s => s.id)
      },
      earth: {
        description: "Grounded, steady, present",
        sample_ids: this.samples.filter(s => s.element === 'Earth').map(s => s.id)
      },
      air: {
        description: "Clear, light, articulate",
        sample_ids: this.samples.filter(s => s.element === 'Air').map(s => s.id)
      },
      aether: {
        description: "Mystical, profound, sacred",
        sample_ids: this.samples.filter(s => s.element === 'Aether').map(s => s.id)
      }
    };

    await fs.writeFile(
      path.join(exportDir, 'style_tokens.json'),
      JSON.stringify(styleTokens, null, 2),
      'utf-8'
    );

    console.log(`✅ Exported ${metadataLines.length} samples for XTTS training`);
    console.log(`📁 Export location: ${exportDir}`);
  }

  /**
   * Statistics about collected data
   */
  getStats() {
    const byElement = this.groupBy(this.samples, 'element');
    const bySpeechAct = this.groupBy(this.samples, 'speechAct');

    return {
      total: this.samples.length,
      withAudio: this.samples.filter(s => s.audioPath).length,
      byElement: Object.entries(byElement).map(([el, samples]) => ({
        element: el,
        count: samples.length
      })),
      bySpeechAct: Object.entries(bySpeechAct).map(([act, samples]) => ({
        speechAct: act,
        count: samples.length
      })),
      totalWords: this.samples.reduce((sum, s) => sum + s.wordCount, 0)
    };
  }

  private groupBy<T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const value = item[key] as string;
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
