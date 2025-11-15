'use client';

export const dynamic = 'force-dynamic';

import dynamic from 'next/dynamic';

const JournalingPortal = dynamic(() => import('@/components/journaling/JournalingPortal'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

export default function JournalPage() {
  return <JournalingPortal />;
}