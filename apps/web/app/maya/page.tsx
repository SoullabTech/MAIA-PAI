'use client';
import dynamicImport from 'next/dynamic';

const MayaVoiceChat = dynamicImport(
  () => import('@/components/chat/MayaVoiceChat'),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading Maya...</div>
  }
);

export default function MayaPage() {
  return <MayaVoiceChat />;
}