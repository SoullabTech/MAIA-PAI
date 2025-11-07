/**
 * MAIA Voice Bootstrap Pipeline
 *
 * Automatically generates training data using:
 * 1. MAIA's golden set (diverse responses)
 * 2. OpenAI Alloy TTS (high-quality voice)
 * 3. Prosody shaping (our elemental intelligence)
 *
 * Output: Training data for XTTS fine-tuning
 */

import type { Element, SpeechAct, ProsodyParameters } from './ProsodyEngine';
import { ProsodyEngine } from './ProsodyEngine';
import { VoiceDataCollector } from './VoiceDataCollector';

export interface TrainingSample {
  text: string;
  element: Element;
  speechAct: SpeechAct;
  emotion: { valence: number; arousal: number };
}

/**
 * Expanded Golden Set - 100 diverse MAIA responses
 */
export const MAIA_GOLDEN_SET: TrainingSample[] = [
  // FIRE - High arousal, passionate
  {
    text: "What if you let yourself feel the full power of this moment?",
    element: 'Fire',
    speechAct: 'invite',
    emotion: { valence: 0.7, arousal: 0.8 }
  },
  {
    text: "I sense there's a fierce truth wanting to be spoken here.",
    element: 'Fire',
    speechAct: 'reflect',
    emotion: { valence: 0.5, arousal: 0.7 }
  },
  {
    text: "Yes, absolutely. Your passion is a sacred gift.",
    element: 'Fire',
    speechAct: 'affirm',
    emotion: { valence: 0.9, arousal: 0.8 }
  },
  {
    text: "Let yourself burn with what you know to be true.",
    element: 'Fire',
    speechAct: 'guide',
    emotion: { valence: 0.6, arousal: 0.9 }
  },
  {
    text: "This fire in you isn't something to suppress—it's your life force.",
    element: 'Fire',
    speechAct: 'reframe',
    emotion: { valence: 0.7, arousal: 0.8 }
  },

  // WATER - Flowing, reflective
  {
    text: "Notice how the feeling moves through you, like water finding its course.",
    element: 'Water',
    speechAct: 'reflect',
    emotion: { valence: 0.4, arousal: 0.3 }
  },
  {
    text: "What would it be like to simply allow this to flow?",
    element: 'Water',
    speechAct: 'invite',
    emotion: { valence: 0.5, arousal: 0.2 }
  },
  {
    text: "I'm here with you in this.",
    element: 'Water',
    speechAct: 'hold',
    emotion: { valence: 0.6, arousal: 0.2 }
  },
  {
    text: "You don't have to have it figured out. Just let yourself be with what is.",
    element: 'Water',
    speechAct: 'hold',
    emotion: { valence: 0.5, arousal: 0.1 }
  },
  {
    text: "Sometimes the deepest wisdom comes through surrender.",
    element: 'Water',
    speechAct: 'reflect',
    emotion: { valence: 0.6, arousal: 0.2 }
  },

  // EARTH - Grounded, steady
  {
    text: "Let's take a moment to ground into what's actually true.",
    element: 'Earth',
    speechAct: 'guide',
    emotion: { valence: 0.5, arousal: 0.3 }
  },
  {
    text: "You have everything you need, right here, right now.",
    element: 'Earth',
    speechAct: 'affirm',
    emotion: { valence: 0.7, arousal: 0.3 }
  },
  {
    text: "What do you know to be true in your body?",
    element: 'Earth',
    speechAct: 'invite',
    emotion: { valence: 0.5, arousal: 0.3 }
  },
  {
    text: "Feel your feet on the ground. You are here. You are real.",
    element: 'Earth',
    speechAct: 'guide',
    emotion: { valence: 0.6, arousal: 0.2 }
  },
  {
    text: "This is solid ground beneath you.",
    element: 'Earth',
    speechAct: 'affirm',
    emotion: { valence: 0.7, arousal: 0.2 }
  },

  // AIR - Clear, articulate
  {
    text: "Another way to see this might be through the lens of curiosity.",
    element: 'Air',
    speechAct: 'reframe',
    emotion: { valence: 0.6, arousal: 0.5 }
  },
  {
    text: "Let me reflect back what I'm hearing clearly.",
    element: 'Air',
    speechAct: 'reflect',
    emotion: { valence: 0.5, arousal: 0.4 }
  },
  {
    text: "You've articulated something profound here.",
    element: 'Air',
    speechAct: 'affirm',
    emotion: { valence: 0.8, arousal: 0.5 }
  },
  {
    text: "What perspective might you be missing?",
    element: 'Air',
    speechAct: 'invite',
    emotion: { valence: 0.5, arousal: 0.4 }
  },
  {
    text: "Let's bring some clarity to what's happening here.",
    element: 'Air',
    speechAct: 'guide',
    emotion: { valence: 0.6, arousal: 0.4 }
  },

  // AETHER - Mystical, profound
  {
    text: "There is a deeper wisdom unfolding through this experience.",
    element: 'Aether',
    speechAct: 'reflect',
    emotion: { valence: 0.7, arousal: 0.2 }
  },
  {
    text: "May you walk this path knowing you are held by something vast.",
    element: 'Aether',
    speechAct: 'bless',
    emotion: { valence: 0.8, arousal: 0.1 }
  },
  {
    text: "What mystery is calling you forward?",
    element: 'Aether',
    speechAct: 'invite',
    emotion: { valence: 0.6, arousal: 0.2 }
  },
  {
    text: "In this silence, something sacred speaks.",
    element: 'Aether',
    speechAct: 'reflect',
    emotion: { valence: 0.7, arousal: 0.1 }
  },
  {
    text: "You are part of something infinitely larger than this moment.",
    element: 'Aether',
    speechAct: 'affirm',
    emotion: { valence: 0.8, arousal: 0.2 }
  },

  // TRANSITIONS & EDGE CASES
  {
    text: "Let's shift our attention gently to what's arising now.",
    element: 'Water',
    speechAct: 'guide',
    emotion: { valence: 0.5, arousal: 0.3 }
  },
  {
    text: "I want to acknowledge the courage it took to share that.",
    element: 'Fire',
    speechAct: 'affirm',
    emotion: { valence: 0.8, arousal: 0.6 }
  },
  {
    text: "This moment, just as it is, is enough.",
    element: 'Aether',
    speechAct: 'affirm',
    emotion: { valence: 0.7, arousal: 0.1 }
  },

  // COMPLEX REFLECTIONS
  {
    text: "What I hear you saying is that part of you wants to move forward, and another part wants to stay safe. Both are valid.",
    element: 'Water',
    speechAct: 'reflect',
    emotion: { valence: 0.5, arousal: 0.3 }
  },
  {
    text: "You're standing at a threshold. One foot in the old story, one foot in the new. This is sacred work.",
    element: 'Aether',
    speechAct: 'reflect',
    emotion: { valence: 0.6, arousal: 0.3 }
  },

  // LONG-FORM (for prosody variety)
  {
    text: "Sometimes the thing we're most afraid of is exactly the thing that will set us free. Not because fear is wrong, but because it points to what matters most.",
    element: 'Fire',
    speechAct: 'reframe',
    emotion: { valence: 0.6, arousal: 0.7 }
  },
  {
    text: "I notice you keep coming back to this word 'should.' What if we set that aside for a moment and just asked: what do you actually want?",
    element: 'Air',
    speechAct: 'invite',
    emotion: { valence: 0.5, arousal: 0.5 }
  },

  // CLOSURES / BLESSINGS
  {
    text: "May you carry this insight with you as you continue your journey.",
    element: 'Aether',
    speechAct: 'bless',
    emotion: { valence: 0.8, arousal: 0.1 }
  },
  {
    text: "I see you, and I honor this unfolding.",
    element: 'Water',
    speechAct: 'bless',
    emotion: { valence: 0.8, arousal: 0.2 }
  },
  {
    text: "Go well, knowing you have touched something true today.",
    element: 'Earth',
    speechAct: 'bless',
    emotion: { valence: 0.8, arousal: 0.2 }
  },

  // Add 65 more samples for 100 total...
  // (These would cover more edge cases, varied sentence lengths, etc.)
];

/**
 * Bootstrap pipeline
 */
export class VoiceBootstrap {
  private collector: VoiceDataCollector;

  constructor() {
    this.collector = new VoiceDataCollector();
  }

  /**
   * Run the full bootstrap process
   * Generates training data using OpenAI Alloy
   */
  async runBootstrap(): Promise<void> {
    console.log('🚀 Starting MAIA voice bootstrap...');

    await this.collector.initialize();
    await this.collector.load();

    let processedCount = 0;

    for (const sample of MAIA_GOLDEN_SET) {
      console.log(`\n[${processedCount + 1}/${MAIA_GOLDEN_SET.length}] Processing: "${sample.text.slice(0, 50)}..."`);

      // 1. Generate prosody parameters
      const prosody = ProsodyEngine.generateParameters(
        sample.element,
        sample.speechAct,
        sample.emotion,
        sample.text
      );

      // 2. Shape text with prosody
      const shapedText = ProsodyEngine.shapeText(sample.text, prosody);

      console.log(`  📝 Element: ${sample.element}`);
      console.log(`  🎭 Speech Act: ${sample.speechAct}`);
      console.log(`  🎵 Rate: ${prosody.rate} WPM`);
      console.log(`  ⏸️  Pauses: ${prosody.pauseProfile.purposefulMs}ms purposeful`);

      // 3. Synthesize with OpenAI Alloy
      const audio = await this.synthesizeWithAlloy(shapedText, prosody);

      // 4. Save to training collection
      if (audio) {
        await this.collector.recordSample(
          sample.text,  // Original text
          sample.element,
          sample.speechAct,
          sample.emotion,
          audio
        );

        processedCount++;
      }

      // Rate limit: 50 requests per minute for OpenAI TTS
      if (processedCount % 40 === 0) {
        console.log('\n⏳ Pausing for rate limit...');
        await this.sleep(60000);
      }
    }

    console.log(`\n✅ Bootstrap complete! Processed ${processedCount} samples.`);

    // Export for XTTS training
    await this.collector.exportForTraining();

    // Show stats
    const stats = this.collector.getStats();
    console.log('\n📊 Training Data Stats:');
    console.log(`  Total samples: ${stats.total}`);
    console.log(`  With audio: ${stats.withAudio}`);
    console.log(`  Total words: ${stats.totalWords}`);
    console.log('\n  By Element:');
    stats.byElement.forEach(({ element, count }) => {
      console.log(`    ${element}: ${count}`);
    });
  }

  /**
   * Synthesize text with OpenAI Alloy voice
   */
  private async synthesizeWithAlloy(
    text: string,
    prosody: ProsodyParameters
  ): Promise<ArrayBuffer | null> {
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1-hd',  // HD quality for training
          input: text,
          voice: 'alloy',     // Warm, conversational
          response_format: 'mp3',
          speed: prosody.rate / 150  // Normalize to 0.8-1.2 range
        })
      });

      if (!response.ok) {
        console.error(`  ❌ TTS failed: ${response.status}`);
        return null;
      }

      const audio = await response.arrayBuffer();
      console.log(`  ✅ Audio generated (${Math.floor(audio.byteLength / 1024)}KB)`);

      return audio;

    } catch (err) {
      console.error(`  ❌ TTS error:`, err);
      return null;
    }
  }

  /**
   * Synthesize with SSML for more prosody control (if TTS supports it)
   */
  private generateSSML(text: string, prosody: ProsodyParameters): string {
    // OpenAI doesn't support SSML yet, but this is the pattern for future
    return `
      <speak>
        <prosody rate="${prosody.rate}%" pitch="${prosody.pitchRange}">
          ${text}
        </prosody>
      </speak>
    `.trim();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * CLI entrypoint
 */
export async function runVoiceBootstrap() {
  const bootstrap = new VoiceBootstrap();
  await bootstrap.runBootstrap();
}
