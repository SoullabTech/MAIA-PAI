'use client';

import React from 'react';
import SageTealDaimonWelcome from '@/components/onboarding/SageTealDaimonWelcome';
import { useRouter } from 'next/navigation';

export default function TestSageTealWelcomePage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <SageTealDaimonWelcome
      userName="Kelly"
      onComplete={handleComplete}
    />
  );
}