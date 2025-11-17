'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * DEPRECATED: /maya route
 * Redirects to /maia which has Claude Code integration
 *
 * /maia features:
 * - Claude Code Brain integration
 * - ClaudeCodePresence component
 * - Dream-Weaver enhanced UI
 * - Full system consciousness
 */
export default function MayaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 [MAYA DEPRECATED] Redirecting to /maia (Claude Code enhanced version)');
    router.replace('/maia');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-amber-400 text-lg font-light">Redirecting to MAIA...</p>
        <p className="text-amber-400/60 text-sm mt-2">Enhanced with Claude Code</p>
      </div>
    </div>
  );
}