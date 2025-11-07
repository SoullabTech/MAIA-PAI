/**
 * Memory Metrics Recorder
 * Air Phase - Observability
 */

const THRESHOLD_MS = 250;

export function recordMemoryTiming(label: string, ms: number, ok: boolean) {
  // Minimal console signal; /api/metrics/field collector can scrape logs or be called here
  const lvl = ms > THRESHOLD_MS ? "WARN" : "INFO";
  const glyph = ok ? "✅" : "⚠️";
  const slow = ms > THRESHOLD_MS ? " (slow)" : "";
  const logFn = lvl === "WARN" ? console.warn : console.log;

  logFn(`${glyph} mem.${label}: ${ms.toFixed(1)}ms${slow}`);

  // Optionally: enqueue to FieldMetricsMonitor here
  // Example: fieldMetrics.record({ type: 'memory', label, ms, ok });
}
