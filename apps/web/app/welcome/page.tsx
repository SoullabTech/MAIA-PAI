'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeBackPage from '@/components/onboarding/WelcomeBackPage';

export default function WelcomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Get user name from localStorage
    const explorerName = localStorage.getItem('explorerName') ||
                         localStorage.getItem('betaUserName') ||
                         sessionStorage.getItem('explorerName') ||
                         'Explorer';
    setUserName(explorerName);
  }, []);

  const handleContinue = () => {
    router.push('/maia');
  };

  return (
    <WelcomeBackPage
      userName={userName}
      onContinue={handleContinue}
    />
  );
}