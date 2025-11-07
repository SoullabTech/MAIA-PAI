/**
 * Voice Metrics Recorder
 * Earth Phase - Voice Pipeline Observability
 *
 * Thresholds based on user experience targets:
 * - Transcription: <1s good, >2s slow
 * - TTS Generation: <2s good, >4s slow
 * - Oracle API: <2s good, >5s slow
 * - End-to-end: <8s good, >12s slow
 */

type VoiceOperation =
  | "voice.transcribe"
  | "voice.tts.openai"
  | "voice.tts.elevenlabs"
  | "voice.tts.sesame"
  | "voice.oracle"
  | "voice.e2e"
  | "voice.router";

const THRESHOLDS: Record<VoiceOperation, number> = {
  "voice.transcribe": 2000,      // 2s
  "voice.tts.openai": 4000,      // 4s
  "voice.tts.elevenlabs": 4000,  // 4s
  "voice.tts.sesame": 4000,      // 4s
  "voice.oracle": 5000,          // 5s
  "voice.e2e": 12000,            // 12s
  "voice.router": 30000,         // 30s (includes all fallbacks)
};

export function recordVoiceTiming(
  operation: VoiceOperation,
  ms: number,
  ok: boolean,
  metadata?: Record<string, unknown>
) {
  const threshold = THRESHOLDS[operation];
  const lvl = ms > threshold ? "WARN" : "INFO";
  const glyph = ok ? "✅" : "⚠️";
  const slow = ms > threshold ? " (slow)" : "";
  const logFn = lvl === "WARN" ? console.warn : console.log;

  const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : "";
  logFn(`${glyph} ${operation}: ${ms.toFixed(1)}ms${slow}${metaStr}`);

  // Future: enqueue to FieldMetricsMonitor here
  // Example: fieldMetrics.record({ type: 'voice', operation, ms, ok, metadata });
}

/**
 * Helper to record voice errors with context
 */
export function recordVoiceError(
  operation: VoiceOperation,
  error: Error | string,
  metadata?: Record<string, unknown>
) {
  const errorMsg = typeof error === "string" ? error : error.message;
  console.error(`⚠️ ${operation}: FAILED - ${errorMsg}`, metadata || {});

  // Future: send to error tracking service
}
