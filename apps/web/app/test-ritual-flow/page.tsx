'use client';

import React from 'react';
import RitualFlowOrchestrator from '@/components/onboarding/RitualFlowOrchestrator';
import { useRouter } from 'next/navigation';

export default function TestRitualFlowPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <RitualFlowOrchestrator
      onComplete={handleComplete}
    />
  );
}