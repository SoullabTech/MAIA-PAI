'use client';

import React from 'react';
import CompleteWelcomeFlow from '@/components/onboarding/CompleteWelcomeFlow';
import { useRouter } from 'next/navigation';

export default function TestCompleteFlowPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <CompleteWelcomeFlow
      userName="Kelly"
      onComplete={handleComplete}
    />
  );
}