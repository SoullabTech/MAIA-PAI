"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check for existing onboarded user
    const storedUser = localStorage.getItem('beta_user');
    const week2Onboarded = localStorage.getItem('week2_onboarded') === 'true';

    if (week2Onboarded) {
      console.log('✅ Auto-redirecting week2 user to /maia');
      router.replace('/maia');
      return;
    }

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        // Returning users who are onboarded get Welcome back page first
        if (userData.onboarded === true) {
          console.log('✅ Returning user - showing Welcome back page');
          router.replace('/welcome-back');
          return;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('beta_user');
      }
    }

    // Redirect all new users to beta-orientation (elemental onboarding)
    console.log('👋 New user - redirecting to beta-orientation');
    router.replace('/beta-orientation');
  }, [router]);

  // Show loading while redirecting to MAIA
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