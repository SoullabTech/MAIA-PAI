'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OraclePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Maya page - the oracle page is deprecated
    router.replace('/maya');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0D16] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gray-600 border-t-[#FFD700] rounded-full animate-spin" />
    </div>
  );
}
