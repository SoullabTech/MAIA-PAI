/**
 * Voice Latency Monitoring - Timer Utility
 *
 * High-precision timing for voice pipeline stages:
 * - voice.transcribe (ASR)
 * - voice.oracle (LLM generation)
 * - voice.tts (Speech synthesis)
 * - voice.e2e (End-to-end turn time)
 */

export interface TimedResult<T> {
  ms: number;
  value: T;
}

/**
 * Times an async operation and returns both the result and duration
 */
export async function timeIt<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<TimedResult<T>> {
  const start = performance.now();

  try {
    const value = await fn();
    const ms = performance.now() - start;

    return { ms, value };
  } catch (error) {
    const ms = performance.now() - start;
    console.error(`⏱️  ${operation} failed after ${Math.round(ms)}ms:`, error);
    throw error;
  }
}

/**
 * Synchronous version for non-async operations
 */
export function timeItSync<T>(
  operation: string,
  fn: () => T
): { ms: number; value: T } {
  const start = performance.now();

  try {
    const value = fn();
    const ms = performance.now() - start;

    return { ms, value };
  } catch (error) {
    const ms = performance.now() - start;
    console.error(`⏱️  ${operation} failed after ${Math.round(ms)}ms:`, error);
    throw error;
  }
}
