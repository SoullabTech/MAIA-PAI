"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  // DEPLOYMENT VERIFICATION - Oct 2 12:45PM - Mobile fixes + direct Maya routing
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already completed ANY onboarding (original or Week 2)
    const week2Onboarded = localStorage.getItem("week2_onboarded") === "true";
    const betaOnboarded = localStorage.getItem("betaOnboardingComplete") === "true";
    const betaUser = localStorage.getItem("beta_user");

    if (week2Onboarded) {
      // Completed Week 2 onboarding - go to check-in
      router.replace('/checkin');
    } else if (betaOnboarded || betaUser) {
      // Returning user who completed original onboarding - send to check-in ritual
      // (They get the beautiful quotes and Maia as Daimon)
      router.replace('/checkin');
    } else {
      // New user - go through Week 2 welcome
      router.replace('/week2-welcome');
    }
  }, [router]);

  // Show loading while checking onboarding status
  if (isOnboarded === null) {
    return (
      <div className="min-h-screen bg-fremen-night flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-spice-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-bene-gesserit-gold text-lg font-cinzel">Initializing Desert Protocol...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-fremen-night flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-dune-hero font-cormorant text-bene-gesserit-gold mb-4 tracking-wide">Soullab</h1>
        <p className="text-dune-amber/80 text-lg font-cinzel mb-8 tracking-widest">The Desert Remembers</p>
        <div className="w-16 h-16 border-2 border-spice-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-spice-orange text-xl font-raleway">Establishing Connection...</p>
        <p className="text-dune-amber/60 text-sm mt-3 font-raleway">Consciousness Interface</p>
      </div>
    </div>
  );
}