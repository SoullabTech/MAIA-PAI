/**
 * Voice Latency Monitoring - Metrics Recorder
 *
 * Earth stage: surgical baseline instrumentation.
 * Records timing for voice pipeline stages with thresholds.
 *
 * Stages monitored:
 * - voice.transcribe: < 2000ms target
 * - voice.oracle: < 5000ms target
 * - voice.tts: < 2000ms target
 * - voice.e2e: < 10000ms target (full turn)
 */

interface VoiceMetric {
  stage: string;
  ms: number;
  success: boolean;
  metadata?: Record<string, any>;
  timestamp: number;
}

// Thresholds for warning slow operations
const THRESHOLDS = {
  'voice.transcribe': 2000,
  'voice.oracle': 5000,
  'voice.tts': 2000,
  'voice.e2e': 10000,
};

// In-memory metrics buffer (will export to /api/metrics/field later)
const metricsBuffer: VoiceMetric[] = [];
const MAX_BUFFER_SIZE = 1000;

/**
 * Record voice timing metric
 */
export function recordVoiceTiming(
  stage: string,
  ms: number,
  success: boolean,
  metadata?: Record<string, any>
): void {
  const metric: VoiceMetric = {
    stage,
    ms,
    success,
    metadata,
    timestamp: Date.now(),
  };

  // Add to buffer
  metricsBuffer.push(metric);
  if (metricsBuffer.length > MAX_BUFFER_SIZE) {
    metricsBuffer.shift();
  }

  // Check threshold
  const threshold = THRESHOLDS[stage as keyof typeof THRESHOLDS];
  if (threshold && ms > threshold) {
    console.warn(`⚠️  Slow ${stage}: ${Math.round(ms)}ms (threshold: ${threshold}ms)`, metadata);
  } else {
    console.log(`⏱️  ${stage}: ${Math.round(ms)}ms`, metadata);
  }
}

/**
 * Record voice error
 */
export function recordVoiceError(
  stage: string,
  error: string,
  metadata?: Record<string, any>
): void {
  console.error(`❌ ${stage} error:`, error, metadata);

  const metric: VoiceMetric = {
    stage,
    ms: 0,
    success: false,
    metadata: { ...metadata, error },
    timestamp: Date.now(),
  };

  metricsBuffer.push(metric);
  if (metricsBuffer.length > MAX_BUFFER_SIZE) {
    metricsBuffer.shift();
  }
}

/**
 * Get recent metrics (for debugging/monitoring)
 */
export function getRecentMetrics(count: number = 100): VoiceMetric[] {
  return metricsBuffer.slice(-count);
}

/**
 * Clear metrics buffer
 */
export function clearMetrics(): void {
  metricsBuffer.length = 0;
}

/**
 * Get average timing for a stage
 */
export function getAverageTiming(stage: string): number | null {
  const stageMetrics = metricsBuffer.filter(m => m.stage === stage && m.success);
  if (stageMetrics.length === 0) return null;

  const sum = stageMetrics.reduce((acc, m) => acc + m.ms, 0);
  return sum / stageMetrics.length;
}

/**
 * Get P95 timing for a stage
 */
export function getP95Timing(stage: string): number | null {
  const stageMetrics = metricsBuffer
    .filter(m => m.stage === stage && m.success)
    .map(m => m.ms)
    .sort((a, b) => a - b);

  if (stageMetrics.length === 0) return null;

  const p95Index = Math.floor(stageMetrics.length * 0.95);
  return stageMetrics[p95Index];
}

/**
 * Get metrics summary
 */
export function getMetricsSummary() {
  const stages = Object.keys(THRESHOLDS);

  return stages.map(stage => ({
    stage,
    average: getAverageTiming(stage),
    p95: getP95Timing(stage),
    threshold: THRESHOLDS[stage as keyof typeof THRESHOLDS],
    count: metricsBuffer.filter(m => m.stage === stage).length,
  }));
}
