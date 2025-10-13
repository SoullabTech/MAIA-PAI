'use client';

/**
 * MAIA Field Session Studio - DISABLED FOR BETA
 *
 * Redirects to Maya - the official beta interface
 * Telesphorus Kairos is experimental and not promoted yet
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MaiaStudioPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect beta testers to Maya instead of experimental Kairos
    console.log('🚫 MAIA Studio disabled for beta - redirecting to Maya');
    router.replace('/maia');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-amber-400">Redirecting to Maya...</div>
    </div>
  );
}
