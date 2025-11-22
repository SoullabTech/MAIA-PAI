'use client';

import React from 'react';
import FifthWelcomeInterface from '@/components/onboarding/FifthWelcomeInterface';
import { useRouter } from 'next/navigation';

export default function TestFifthWelcomePage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <FifthWelcomeInterface
      userName="Kelly"
      onComplete={handleComplete}
    />
  );
}