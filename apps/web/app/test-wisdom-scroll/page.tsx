'use client';

import React from 'react';
import { ScrollingWisdomIntro } from '@/components/onboarding/ScrollingWisdomIntro';
import { useRouter } from 'next/navigation';

export default function TestWisdomScrollPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/maia');
  };

  return (
    <ScrollingWisdomIntro
      onComplete={handleComplete}
    />
  );
}