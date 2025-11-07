/**
 * Timing Utility
 * Air Phase - Observability
 */

export async function timeIt<T>(
  label: string,
  fn: () => Promise<T>
): Promise<{ ms: number; value: T }> {
  const t0 = performance.now();
  const value = await fn();
  const ms = performance.now() - t0;
  return { ms, value };
}
