'use client';

import { getBrowserSupabaseClient } from '../supabaseBrowserClient';

// Legacy compatibility wrapper - redirect to main browser client
export function createClient(forceMock = false) {
  return getBrowserSupabaseClient(forceMock);
}