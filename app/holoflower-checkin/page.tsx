'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InteractiveHoloflowerCheckIn } from '@/components/holoflower/InteractiveHoloflowerCheckIn';

/**
 * Holoflower Check-In - Daily Threshold Ritual
 *
 * Right-brain, intuitive, somatic check-in that:
 * 1. Creates embodied pause before MAIA conversation
 * 2. Generates user's current "field signature"
 * 3. Informs MAIA's responses with real-time context
 *
 * Data freshness: 12 hours
 * Frequency: Optional, but encouraged daily
 */
export default function HoloflowerCheckInPage() {
  const router = useRouter();
  const [shouldCheckIn, setShouldCheckIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if there's a recent check-in (within 12 hours)
    const lastCheckInStr = localStorage.getItem('holoflower_checkin_today');

    if (lastCheckInStr) {
      try {
        const lastCheckIn = JSON.parse(lastCheckInStr);
        const timestamp = new Date(lastCheckIn.timestamp);
        const now = new Date();
        const hoursSince = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

        if (hoursSince < 12) {
          // Recent check-in exists, go straight to MAIA
          console.log(`✅ Recent holoflower check-in found (${Math.round(hoursSince)}h ago), proceeding to MAIA`);
          router.push('/maia');
          return;
        }
      } catch (e) {
        console.error('Error parsing last check-in:', e);
      }
    }

    // No recent check-in, show the form
    setShouldCheckIn(true);
  }, [router]);

  const handleCheckInComplete = (values: number[]) => {
    console.log('✅ Holoflower check-in completed:', values);

    // Data is already saved by InteractiveHoloflowerCheckIn component
    // Now navigate to MAIA
    router.push('/maia');
  };

  const handleSkip = () => {
    console.log('⏭️ User skipped holoflower check-in');
    router.push('/maia');
  };

  // Loading state
  if (shouldCheckIn === null) {
    return (
      <div className="min-h-screen bg-fremen-night flex items-center justify-center">
        <div className="text-dune-amber text-lg font-cinzel">Preparing your space...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fremen-night">
      <InteractiveHoloflowerCheckIn
        isOpen={true}
        onClose={handleSkip}
        onSubmit={handleCheckInComplete}
      />
    </div>
  );
}
