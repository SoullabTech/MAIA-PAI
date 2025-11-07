/**
 * Shared Supabase Client Singleton
 *
 * Water Phase - Memory Unification
 * Single database connection for all memory operations
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Get the shared Supabase client (singleton)
 *
 * Creates one connection on first call, reuses thereafter.
 * Server-side only (uses SERVICE_ROLE_KEY).
 */
export function getSharedSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase credentials (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
  }

  _client = createClient(url, key, {
    auth: { persistSession: false }, // Server-side: no session persistence
  });

  console.log('✅ Shared Supabase client initialized');
  return _client;
}

/**
 * Reset client (for testing only)
 */
export function __resetSharedSupabase() {
  _client = null;
}
