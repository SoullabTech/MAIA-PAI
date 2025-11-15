'use client';
import dynamicImport from 'next/dynamic';

const JournalingPortal = dynamicImport(() => import('@/components/journaling/JournalingPortal'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

export default function JournalPage() {
  return <JournalingPortal />;
}