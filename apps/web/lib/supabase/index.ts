import { getServerSupabaseClient } from '../supabaseServerClient';

// Export server client by default for API routes and server components
// This prevents client-only code from being imported in server contexts
export const createClient = getServerSupabaseClient;
export { getServerSupabaseClient };

// Client components should import from '@/lib/supabaseBrowserClient'
// Server components and API routes should import from '@/lib/supabaseServerClient'

// Deprecated: Remove singleton export to prevent SSR issues
// Use createClient() or import from specific client/server files
// export const supabase = createClient();