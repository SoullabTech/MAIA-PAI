'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';

/**
 * Complete Signup Page
 *
 * This page helps users who bypassed the access code entry step
 * to complete their registration properly.
 */
export default function CompleteSignup() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user info from localStorage
    const name = localStorage.getItem('explorerName') || localStorage.getItem('userName');
    const explorerId = localStorage.getItem('explorerId');
    const existingCode = localStorage.getItem('betaAccessCode');

    if (!explorerId) {
      // No user data - redirect to signup
      router.replace('/beta-signup');
      return;
    }

    if (existingCode) {
      // Already have a code - redirect to appropriate next step
      const onboarded = localStorage.getItem('betaOnboardingComplete') === 'true';
      if (onboarded) {
        router.replace('/maia');
      } else {
        router.replace('/beta-orientation');
      }
      return;
    }

    setUserName(name || 'Explorer');
  }, [router]);

  const handleValidate = async () => {
    if (!accessCode.trim()) {
      setError('Please enter your access code');
      return;
    }

    setValidating(true);
    setError('');

    try {
      // Validate the access code
      const response = await fetch('/api/auth/validate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode.toUpperCase() })
      });

      const data = await response.json();

      if (data.valid) {
        // Store the validated code
        localStorage.setItem('betaAccessCode', accessCode.toUpperCase());
        sessionStorage.setItem('betaAccessCode', accessCode.toUpperCase());

        // Check if user needs to complete onboarding
        const onboarded = localStorage.getItem('betaOnboardingComplete') === 'true';

        if (onboarded) {
          // Already onboarded - go to Maya
          setTimeout(() => router.push('/maia'), 500);
        } else {
          // Need to complete onboarding
          setTimeout(() => router.push('/beta-orientation'), 500);
        }
      } else {
        setError('Invalid access code. Please check your invitation email.');
        setValidating(false);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('Unable to validate access code. Please try again.');
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4">
      {/* Sacred Geometry - Subtle presence */}
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
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Holoflower portal */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <Holoflower size="lg" glowIntensity="medium" />
        </motion.div>

        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl font-light text-amber-50 mb-3">
            Welcome back, {userName}
          </h2>
          <p className="text-amber-200/60 text-sm leading-relaxed">
            To complete your registration, please enter the access code from your invitation email.
          </p>
        </motion.div>

        {/* Access Code Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
            placeholder="Enter your access code (e.g., SOULLAB-NAME)"
            className="w-full bg-black/30 border border-amber-500/20 rounded-lg px-5 py-4 text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/40 text-center backdrop-blur-sm font-mono"
            disabled={validating}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400/80 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            onClick={handleValidate}
            disabled={!accessCode.trim() || validating}
            className={`w-full px-8 py-3 rounded-full transition-all ${
              accessCode.trim() && !validating
                ? 'bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white hover:from-amber-500 hover:to-amber-600 cursor-pointer'
                : 'bg-amber-500/20 text-amber-200/40 cursor-not-allowed'
            }`}
            whileHover={accessCode.trim() && !validating ? { scale: 1.02 } : {}}
            whileTap={accessCode.trim() && !validating ? { scale: 0.98 } : {}}
          >
            {validating ? 'Validating...' : 'Continue'}
          </motion.button>
        </motion.div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 1 }}
          className="text-amber-200/30 text-xs mt-8 font-light"
        >
          Can&apos;t find your code? Check your invitation email or contact support.
        </motion.p>
      </motion.div>
    </div>
  );
}