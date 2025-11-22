'use client';

import React from 'react';
import FourthWelcomeInterface from '@/components/onboarding/FourthWelcomeInterface';
import { useRouter } from 'next/navigation';

export default function TestFourthWelcomePage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <FourthWelcomeInterface
      onNext={handleComplete}
    />
  );
}