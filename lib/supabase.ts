// Supabase client for both server and client use
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Check for sovereign mode - but allow explicit Supabase re-enabling
const isExplicitlyDisabled = process.env.DISABLE_SUPABASE === 'true';
const isSovereignMode = isExplicitlyDisabled || (
  process.env.DISABLE_SUPABASE !== 'false' && (
    process.env.MAIA_SOVEREIGN === 'true' ||
    process.env.MAIA_STORAGE_ADAPTER === 'ipfs'
  )
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (isSovereignMode) {
  console.log('🏛️ Sovereign mode enabled - Supabase disabled, using IPFS storage');
} else if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
}

// Pre-configured singleton instance - null in sovereign mode
export const supabase = isSovereignMode ? null : createSupabaseClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Factory function that returns the configured Supabase client
 * This ensures all API routes use the same configuration
 * Returns null in sovereign mode to avoid errors
 */
export function createClient() {
  if (isSovereignMode) {
    console.warn('🏛️ Attempted Supabase access in sovereign mode - operation skipped');
    return null;
  }
  return supabase;
}

// Helper function for components that need createClientComponentClient
export function createClientComponentClient() {
  if (isSovereignMode) {
    console.warn('🏛️ Attempted Supabase access in sovereign mode - operation skipped');
    return null;
  }
  return supabase;
}

// Helper to check if sovereign mode is enabled
export function isSovereignModeEnabled() {
  return isSovereignMode;
}