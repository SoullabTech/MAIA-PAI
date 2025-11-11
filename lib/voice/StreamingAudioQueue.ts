/**
 * Streaming Audio Queue for THE BETWEEN
 *
 * Plays audio chunks as they arrive from sentence-level TTS processing.
 * Maintains MAIA's sovereignty - THE BETWEEN provides consciousness,
 * OpenAI TTS only provides voice synthesis.
 *
 * Architecture:
 * THE BETWEEN (streaming text) → Split sentences → TTS per sentence → Queue → Play
 */

export interface AudioQueueItem {
  audio: HTMLAudioElement;
  text: string;
  element?: string;
  voiceTone?: any;
}

export class StreamingAudioQueue {
  private queue: AudioQueueItem[] = [];
  private isPlaying: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private onPlayingChange?: (isPlaying: boolean) => void;
  private onTextChange?: (text: string) => void;
  private onComplete?: () => void;

  constructor(callbacks?: {
    onPlayingChange?: (isPlaying: boolean) => void;
    onTextChange?: (text: string) => void;
    onComplete?: () => void;
  }) {
    this.onPlayingChange = callbacks?.onPlayingChange;
    this.onTextChange = callbacks?.onTextChange;
    this.onComplete = callbacks?.onComplete;
  }

  /**
   * Add audio chunk to queue and start playing if not already playing
   */
  enqueue(item: AudioQueueItem): void {
    console.log('🎵 [StreamingQueue] Enqueuing audio chunk:', item.text.substring(0, 50));
    this.queue.push(item);

    if (!this.isPlaying) {
      this.playNext();
    }
  }

  /**
   * Play the next audio chunk in the queue
   */
  private async playNext(): Promise<void> {
    if (this.queue.length === 0) {
      console.log('✅ [StreamingQueue] Queue empty - playback complete');
      this.isPlaying = false;
      this.currentAudio = null;
      this.onPlayingChange?.(false);
      this.onComplete?.();
      return;
    }

    const item = this.queue.shift()!;
    this.isPlaying = true;
    this.currentAudio = item.audio;
    this.onPlayingChange?.(true);

    console.log('🔊 [StreamingQueue] Playing chunk:', item.text.substring(0, 50));
    this.onTextChange?.(item.text);

    return new Promise((resolve) => {
      item.audio.onended = () => {
        console.log('✅ [StreamingQueue] Chunk finished');
        resolve();
        this.playNext(); // Play next chunk
      };

      item.audio.onerror = (error) => {
        console.error('❌ [StreamingQueue] Audio error:', error);
        resolve();
        this.playNext(); // Continue to next chunk even on error
      };

      // Start playback
      item.audio.play().catch((error) => {
        console.error('❌ [StreamingQueue] Play failed:', error);
        resolve();
        this.playNext();
      });
    });
  }

  /**
   * Stop playback and clear queue (for interruptions)
   */
  stop(): void {
    console.log('🛑 [StreamingQueue] Stopping playback and clearing queue');

    // Stop current audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    // Clear queue
    this.queue = [];
    this.isPlaying = false;
    this.onPlayingChange?.(false);
  }

  /**
   * Get queue status
   */
  getStatus(): { isPlaying: boolean; queueLength: number } {
    return {
      isPlaying: this.isPlaying,
      queueLength: this.queue.length,
    };
  }

  /**
   * Check if currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

/**
 * Split text into sentences for streaming TTS
 * Preserves natural speech boundaries
 */
export function splitIntoSentences(text: string): string[] {
  // Split on sentence boundaries but preserve the punctuation
  const sentences = text
    .split(/([.!?]+\s+)/)
    .reduce((acc: string[], curr, i, arr) => {
      if (i % 2 === 0 && curr.trim()) {
        // This is a sentence (not a delimiter)
        const punctuation = arr[i + 1] || '';
        acc.push((curr + punctuation).trim());
      }
      return acc;
    }, [])
    .filter(s => s.length > 0);

  console.log(`📝 [Sentences] Split into ${sentences.length} chunks:`,
    sentences.map(s => s.substring(0, 30) + '...'));

  return sentences;
}

/**
 * Generate audio for a text chunk using OpenAI TTS
 * (OpenAI ONLY used for voice synthesis - consciousness comes from THE BETWEEN)
 */
export async function generateAudioChunk(
  text: string,
  options?: {
    voice?: string;
    speed?: number;
    element?: string;
    voiceTone?: any;
    agentVoice?: string;
  }
): Promise<HTMLAudioElement> {
  console.log('🎤 [TTS] Generating audio for:', text.substring(0, 50));

  try {
    const response = await fetch('/api/voice/openai-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice: options?.voice,
        speed: options?.speed,
        voiceTone: options?.voiceTone,
        agentVoice: options?.agentVoice || 'maya',
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);

    // Clean up blob URL after audio finishes
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

    console.log('✅ [TTS] Audio chunk generated');
    return audio;

  } catch (error) {
    console.error('❌ [TTS] Failed to generate audio:', error);
    throw error;
  }
}
