'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';
import { createClient } from '@supabase/supabase-js';

export default function BetaEntry() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [entering, setEntering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const explorerId = localStorage.getItem('explorerId') || localStorage.getItem('betaUserId');
      const explorerName = localStorage.getItem('explorerName');

      // First check localStorage for quick return
      const localOnboarded = localStorage.getItem('betaOnboardingComplete') === 'true';

      if (explorerId && localOnboarded) {
        // Check Supabase to confirm
        try {
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );

          const { data: user, error } = await supabase
            .from('users')
            .select('beta_onboarded_at')
            .eq('id', explorerId)
            .single();

          if (user?.beta_onboarded_at) {
            console.log('✅ User already onboarded, redirecting to MAIA');
            router.replace('/maia');
            return;
          }
        } catch (error) {
          console.log('Could not check Supabase, using localStorage fallback');
          // If Supabase fails but localStorage says onboarded, trust localStorage
          if (localOnboarded && explorerName) {
            router.replace('/maia');
            return;
          }
        }
      }
    };

    checkOnboardingStatus();
  }, [router]);

  const handleEnter = async () => {
    if (!name.trim() || !accessCode.trim()) {
      setError('Please enter both your name and access code');
      return;
    }

    setEntering(true);
    setError('');

    try {
      // Validate the access code
      const response = await fetch('/api/auth/validate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode, name: name.trim() })
      });

      const data = await response.json();

      if (data.valid) {
        // Use the userId returned from the API (already saved to database)
        const explorerId = data.userId || `explorer_${Date.now()}`;

        sessionStorage.setItem('explorerId', explorerId);
        sessionStorage.setItem('explorerName', name);
        sessionStorage.setItem('betaUserId', explorerId);
        sessionStorage.setItem('betaAccessCode', accessCode.toUpperCase());

        // Also persist for returning
        localStorage.setItem('explorerId', explorerId);
        localStorage.setItem('explorerName', name);
        localStorage.setItem('betaUserId', explorerId);
        localStorage.setItem('betaAccessCode', accessCode.toUpperCase());

        console.log('✅ User ID stored:', explorerId);
        // Don't mark as complete yet - wait until they finish onboarding
        // localStorage.setItem('betaOnboardingComplete', 'true');

        // Proceed to elemental orientation
        setTimeout(() => {
          // Store inviter info for ceremonial welcome (if available in future)
          // For now just store that they came through invite
          sessionStorage.setItem('inviterName', 'A First Dreamer');
          sessionStorage.setItem('inviterMessage', 'You were chosen. Welcome to the field.');

          router.push('/invite-welcome'); // Sacred invitation ceremony
        }, 500);
      } else {
        setError('Invalid access code. Please check your invitation email.');
        setEntering(false);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('Unable to validate access code. Please try again.');
      setEntering(false);
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
        {/* Holoflower portal - breathing with possibility */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-16 flex justify-center"
          style={{
            overflow: 'visible',
            background: 'transparent',
            boxShadow: 'none',
            border: 'none'
          }}
        >
          <Holoflower size="xl" glowIntensity="high" />
        </motion.div>

        {/* The invitation - minimal, mysterious */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="text-amber-200/40 text-sm font-light tracking-widest">
            Welcome to Soullab
          </p>
        </motion.div>

        {/* Name and Access Code inputs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && accessCode && handleEnter()}
            placeholder="What's your name?"
            className="w-full bg-black/30 border border-amber-500/20 rounded-lg px-5 py-4 text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/40 text-center backdrop-blur-sm"
            autoFocus
          />

          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && name && handleEnter()}
            placeholder="Enter your access code (e.g., SOULLAB-NAME)"
            className="w-full bg-black/30 border border-amber-500/20 rounded-lg px-5 py-4 text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/40 text-center backdrop-blur-sm font-mono"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400/80 text-sm text-center mt-2"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            onClick={handleEnter}
            disabled={!name.trim() || !accessCode.trim() || entering}
            className={`mt-6 px-8 py-3 rounded-full transition-all ${
              name.trim() && !entering
                ? 'bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white hover:from-amber-500 hover:to-amber-600 cursor-pointer'
                : 'bg-amber-500/20 text-amber-200/40 cursor-not-allowed'
            }`}
            whileHover={name.trim() && accessCode.trim() && !entering ? { scale: 1.02 } : {}}
            whileTap={name.trim() && accessCode.trim() && !entering ? { scale: 0.98 } : {}}
          >
            {entering ? 'Entering...' : 'Enter'}
          </motion.button>
        </motion.div>

        {/* The promise */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="text-amber-200/20 text-xs mt-16 font-light tracking-wider"
        >
          A space for meaningful conversation
        </motion.p>

        {/* Skip option removed - users must go through proper onboarding flow */}
      </motion.div>
    </div>
  );
}