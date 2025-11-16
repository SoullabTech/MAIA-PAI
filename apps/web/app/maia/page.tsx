"use client";

import { useEffect, useState } from "react";
import { DaimonWelcomeRitual } from "@/components/onboarding/DaimonWelcomeRitual";
import InteractiveDiamondSystem from "@/components/diamond/InteractiveDiamondSystem";

// Get user name from localStorage, defaulting to 'Explorer'
function getUserName(): string {
  if (typeof window === 'undefined') return 'Explorer';

  // Check beta_user first
  try {
    const betaUser = localStorage.getItem('beta_user');
    if (betaUser) {
      const userData = JSON.parse(betaUser);
      const userName = userData.username || userData.name || userData.displayName;
      if (userName) return userName;
    }
  } catch (e) {
    console.error('Error parsing beta_user:', e);
  }

  // Check legacy explorerName
  const storedName = localStorage.getItem('explorerName');
  if (storedName && storedName !== 'Explorer') return storedName;

  return 'Explorer';
}

export default function MAIAPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userName, setUserName] = useState('Explorer');
  const [userId] = useState('demo-user'); // TODO: Get from auth context

  useEffect(() => {
    // Set actual user name
    setUserName(getUserName());

    // Check if onboarding has been completed
    const onboardingComplete = localStorage.getItem('daimon_intro_complete');
    if (onboardingComplete === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('daimon_intro_complete', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <DaimonWelcomeRitual
        userId={userId}
        userName={userName}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 relative overflow-hidden">
      {/* Dark amber Dune background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-600 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-amber-800 rounded-full blur-[150px]" />
      </div>

      {/* SOULLAB branding */}
      <div className="absolute top-8 left-8 z-10">
        <div className="text-amber-400/60 font-light text-sm tracking-widest">
          SOULLAB
        </div>
      </div>

      {/* Main Interface */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <InteractiveDiamondSystem />
      </div>
    </div>
  );
}