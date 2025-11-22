'use client';

import React from 'react';
import ThirdWelcomeInterface from '@/components/onboarding/ThirdWelcomeInterface';
import { useRouter } from 'next/navigation';

export default function TestThirdWelcomePage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <ThirdWelcomeInterface
      onNext={handleComplete}
    />
  );
}