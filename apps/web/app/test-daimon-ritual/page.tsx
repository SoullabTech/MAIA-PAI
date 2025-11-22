'use client';

import React from 'react';
import { DaimonWelcomeRitual } from '@/components/onboarding/DaimonWelcomeRitual';
import { useRouter } from 'next/navigation';

export default function TestDaimonRitualPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <DaimonWelcomeRitual
      userName="Kelly"
      onComplete={handleComplete}
    />
  );
}