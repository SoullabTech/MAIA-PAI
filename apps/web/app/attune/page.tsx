'use client';
import dynamicImport from 'next/dynamic';

const AttunePanel = dynamicImport(() => import('../../components/onboarding/AttunePanel'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading...</div>
});

export default function AttunePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <AttunePanel showPreview={true} />
    </div>
  )
}