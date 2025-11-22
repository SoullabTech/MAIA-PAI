'use client';

import React from 'react';
import SecondWelcomeInterface from '@/components/onboarding/SecondWelcomeInterface';
import { useRouter } from 'next/navigation';

export default function TestSecondWelcomePage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <SecondWelcomeInterface
      onNext={handleComplete}
    />
  );
}