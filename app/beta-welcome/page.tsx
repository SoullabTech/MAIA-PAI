'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';

export default function BetaWelcome() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/beta-entry');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-2xl w-full"
      >
        {/* Holoflower */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <Holoflower size="xl" glowIntensity="high" />
        </motion.div>

        {/* Apology Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-y-6 mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extralight text-amber-50 tracking-wide">
            Welcome Back
          </h1>

          <div className="max-w-xl mx-auto space-y-4">
            <p className="text-amber-200/70 text-lg font-light leading-relaxed">
              We've fixed the onboarding system to properly track and remember you.
            </p>

            <p className="text-amber-200/50 text-base font-light leading-relaxed">
              If you previously tried to sign up and encountered issues, we sincerely apologize.
              The system is now fully functional and will properly remember your account.
            </p>

            <p className="text-amber-200/60 text-base font-light leading-relaxed">
              You'll need your invitation code to continue. Check your email for your
              <span className="text-amber-400"> SOULLAB-</span> code.
            </p>
          </div>
        </motion.div>

        {/* Redirecting */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="space-y-4"
        >
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-amber-200/40 text-sm font-light">
            Redirecting to sign in...
          </p>
        </motion.div>

        <motion.button
          onClick={() => router.push('/beta-entry')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-amber-200/60 hover:text-amber-200/80 transition-colors text-sm font-light underline"
        >
          Continue now →
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 2 }}
          className="text-amber-200/20 text-xs mt-16 font-light tracking-wider"
        >
          Soullab Beta · October 2025
        </motion.p>
      </motion.div>
    </div>
  );
}
