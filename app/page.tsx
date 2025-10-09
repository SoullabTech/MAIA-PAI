"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  // DEPLOYMENT VERIFICATION - Oct 2 12:45PM - Mobile fixes + direct Maya routing
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    // SIMPLIFIED: If onboarded, go to Maya. Otherwise, go to signup.
    const betaOnboarded = localStorage.getItem("betaOnboardingComplete") === "true";

    if (betaOnboarded) {
      // Already onboarded - go straight to Maya
      router.replace('/maya');
    } else {
      // Not onboarded - go to signup
      router.replace('/beta-signup');
    }
  }, [router]);

  // Show loading while checking onboarding status
  if (isOnboarded === null) {
    return (
      <div className="min-h-screen bg-ain-soph-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-ain-soph-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-ain-soph-gold text-lg font-light">Initializing Soul Technology...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-ain-soph-blue flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-thin text-ain-soph-gold mb-4 tracking-wide">Soullab</h1>
        <p className="text-ain-soph-gold/70 text-lg font-light mb-8 tracking-widest">Changing Our World To Soul</p>
        <div className="w-16 h-16 border-2 border-ain-soph-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-ain-soph-gold text-xl font-light">Connecting...</p>
        <p className="text-ain-soph-gold/60 text-sm mt-3 font-light">Soul Technology Interface</p>
      </div>
    </div>
  );
}