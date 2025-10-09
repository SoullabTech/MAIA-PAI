'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';

export default function BetaResetNotice() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Mark that user has seen the reset notice
    localStorage.setItem('betaResetAcknowledged', 'true');

    // Clear onboarding data but keep the acknowledgment
    const betaResetAcknowledged = localStorage.getItem('betaResetAcknowledged');
    localStorage.clear();
    sessionStorage.clear();
    if (betaResetAcknowledged) {
      localStorage.setItem('betaResetAcknowledged', betaResetAcknowledged);
    }
    console.log('✅ Cleared all local storage for beta reset');

    // Countdown to redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/beta-signup');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl w-full"
      >
        {/* Holoflower */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Holoflower size="lg" glowIntensity="medium" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-light text-amber-50 mb-6"
        >
          Beta System Upgrade
        </motion.h1>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-8"
        >
          <p className="text-amber-200/70 text-lg leading-relaxed">
            We've made an important upgrade to Soullab's backend infrastructure.
          </p>

          <p className="text-amber-200/60 text-base leading-relaxed">
            Unfortunately—one of the realities of beta—this update reset user registration data.
            We sincerely apologize for the inconvenience.
          </p>

          <p className="text-amber-200/70 text-lg leading-relaxed font-medium">
            The good news: We're now fully integrated with Supabase, which means your data
            will be properly tracked, your sessions monitored, and your journey with Maya
            will be seamlessly recorded moving forward.
          </p>

          <p className="text-amber-200/50 text-sm">
            You'll need to go through the signup process one more time.
            Your original access code will still work.
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <span className="text-amber-400 font-medium">{countdown}</span>
            </div>
            <span className="text-amber-200/70 text-sm">
              Redirecting to signup...
            </span>
          </div>
        </motion.div>

        {/* Manual button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => router.push('/beta-signup')}
          className="mt-6 text-amber-200/50 hover:text-amber-200/70 text-sm transition-colors"
        >
          Continue now →
        </motion.button>
      </motion.div>
    </div>
  );
}
