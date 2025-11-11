"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already onboarded - skip intro if so
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
        if (userData.onboarded === true) {
          console.log('✅ Auto-redirecting onboarded user to /maia');
          router.replace('/maia');
          return;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // New users see the beautiful intro with rotating quotes and mantras
    console.log('👋 New user - showing intro');
    router.replace('/intro');
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