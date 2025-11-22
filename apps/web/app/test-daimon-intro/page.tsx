'use client';

import React from 'react';
import { MAIADaimonIntroduction } from '@/components/onboarding/MAIADaimonIntroduction';
import { useRouter } from 'next/navigation';

export default function TestDaimonIntroPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <MAIADaimonIntroduction
      userName="Kelly"
      onComplete={handleComplete}
    />
  );
}