/**
 * Sesame CSM Endpoint Management
 * Multi-host fallback system for resilient voice synthesis
 */

export function sesameHostList(): string[] {
  return [
    process.env.SESAME_BASE_URL,           // Local: http://127.0.0.1:8000
    process.env.SESAME_SELF_HOSTED_URL,    // Primary: https://sesame.soullab.life
    process.env.SESAME_URL,                // Tunnel: https://...trycloudflare.com
    process.env.SESAME_BACKUP_URL,         // Backup: any additional fallback
  ].filter(Boolean) as string[];
}

export async function trySesameHosts(
  requestBody: any,
  onSuccess?: (host: string, duration: number) => void,
  onError?: (host: string, error: any) => void
): Promise<ArrayBuffer> {
  const hosts = sesameHostList();

  if (hosts.length === 0) {
    throw new Error('No Sesame hosts configured');
  }

  let lastError: any = null;

  for (const host of hosts) {
    try {
      const t0 = performance.now();
      console.log(`🌀 Trying Sesame host: ${host}`);

      const response = await fetch(`${host}/v1/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
          'Authorization': process.env.SESAME_API_KEY ? `Bearer ${process.env.SESAME_API_KEY}` : '',
          'X-Sesame-Mode': 'enhanced-maya-refiner'
        },
        body: JSON.stringify(requestBody),
        // 10 second timeout per host
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const duration = performance.now() - t0;

      console.log(`✅ Sesame host succeeded: ${host} (${duration.toFixed(0)}ms)`);

      if (onSuccess) {
        onSuccess(host, duration);
      }

      return audioBuffer;

    } catch (error: any) {
      console.warn(`⚠️ Sesame host failed: ${host}`, error.message);
      lastError = error;

      if (onError) {
        onError(host, error);
      }

      // Continue to next host
      continue;
    }
  }

  // All hosts failed
  throw new Error(`All Sesame hosts failed. Last error: ${lastError?.message || 'Unknown'}`);
}
