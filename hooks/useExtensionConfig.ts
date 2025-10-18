import { useState, useEffect } from 'react';
import { UserExtensionConfig } from '@/types/extensions';

/**
 * Hook to manage user's extension configuration
 *
 * Fetches from database and provides methods to update settings
 */
export function useExtensionConfig(userId: string) {
  const [config, setConfig] = useState<UserExtensionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConfig();
  }, [userId]);

  async function fetchConfig() {
    try {
      setLoading(true);
      const response = await fetch(`/api/extensions/config?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch extension config');
      }

      const data = await response.json();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  async function updateExtension(extensionId: string, enabled: boolean) {
    try {
      const response = await fetch('/api/extensions/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          extensionId,
          enabled,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update extension');
      }

      const updated = await response.json();
      setConfig(updated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }

  async function updateExtensionSettings(extensionId: string, settings: Record<string, any>) {
    try {
      const response = await fetch('/api/extensions/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          extensionId,
          settings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update extension settings');
      }

      const updated = await response.json();
      setConfig(updated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }

  return {
    config,
    loading,
    error,
    updateExtension,
    updateExtensionSettings,
    refresh: fetchConfig,
  };
}
