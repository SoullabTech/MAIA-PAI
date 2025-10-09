'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BetaSignin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new beta-signup page
    router.replace('/beta-signup');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}
