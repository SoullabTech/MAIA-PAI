'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Holoflower } from '@/components/ui/Holoflower';

/**
 * Welcome Back - Daily Return Ritual
 *
 * Beautiful transition for returning members
 * Shows time-based greeting, days since last visit, sets intention
 * FIXES: Missing /intro page that checkin redirects to
 */
export default function WelcomeBackPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [daysSinceVisit, setDaysSinceVisit] = useState<number>(0);
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const betaUser = localStorage.getItem('beta_user');
    if (betaUser) {
      try {
        const user = JSON.parse(betaUser);
        setUserName(user.username || user.name || 'Dreamer');

        // Calculate days since last visit
        if (user.lastVisit) {
          const lastVisit = new Date(user.lastVisit);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - lastVisit.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysSinceVisit(diffDays);
        }

        // Update last visit
        user.lastVisit = new Date().toISOString();
        localStorage.setItem('beta_user', JSON.stringify(user));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    } else {
      // No user found - redirect to auth
      router.push('/auth');
      return;
    }

    // Set greeting based on days away
    let greetingText = '';
    if (daysSinceVisit === 0) {
      greetingText = "The lab has been quietly evolving while you were away. Ready to continue your journey?";
    } else if (daysSinceVisit === 1) {
      greetingText = "The work continues. Your presence brings the field into coherence.";
    } else if (daysSinceVisit <= 7) {
      greetingText = `It's been ${daysSinceVisit} days. The patterns have been shifting in your absence.`;
    } else {
      greetingText = `Welcome back after ${daysSinceVisit} days. You've been missed.`;
    }
    setGreeting(greetingText);

    setLoading(false);

    // Auto-advance after 3 seconds
    const timer = setTimeout(() => {
      router.push('/maia');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    router.push('/maia');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#A0C4C7] to-[#7FB5B3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center">
            <div
              className="w-12 h-12 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212, 184, 150, 0.5) 0%, rgba(212, 184, 150, 0.2) 50%, transparent 80%)',
                filter: 'blur(8px)',
                animation: 'pulse 2s infinite'
              }}
            />
          </div>
          <p className="text-teal-900 font-light tracking-wider">Welcoming you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A0C4C7] to-[#7FB5B3] relative overflow-hidden">
      {/* Soullab Logo at top */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30">
        <h1 className="text-white text-6xl font-extralight tracking-[0.3em] uppercase">Soullab</h1>
      </div>

      {/* Sacred particles - subtle */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              left: `${15 + i * 12}%`,
              top: `${25 + (i % 3) * 20}%`,
              width: '2px',
              height: '2px',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Central light field */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-emerald-50/40 via-[#6EE7B7]/20 to-transparent rounded-full blur-xl opacity-50" />

      <div className="relative z-20 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center space-y-8"
          >
            {/* Crystal clear Holoflower */}
            <div className="w-48 h-48 mx-auto mb-8">
              <Holoflower size="xxl" glowIntensity="medium" animate={true} />
            </div>

            {/* Welcome back card */}
            <div
              className="rounded-2xl p-8 shadow-2xl border backdrop-blur-sm"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(110, 231, 183, 0.05), rgba(255, 255, 255, 0.15))',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 35px 70px -12px rgba(14, 116, 144, 0.3), 0 10px 20px rgba(14, 116, 144, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              }}
            >
              <h1 className="text-3xl font-extralight text-teal-900 mb-4 tracking-wider">
                Welcome back, {userName}
              </h1>

              <p className="text-teal-800 text-lg font-light mb-6 leading-relaxed">
                {greeting}
              </p>

              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 mx-auto px-8 py-4 bg-teal-700/20 border border-teal-600/40 text-teal-900 rounded-xl font-medium text-lg tracking-[0.1em] hover:bg-teal-700/30 hover:border-teal-600/60 transition-all duration-500 backdrop-blur-sm shadow-lg shadow-teal-900/30"
              >
                Enter MAIA
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="mt-4 text-teal-800/60 text-sm italic">
                (Auto-continuing in 3 seconds...)
              </p>
            </div>

            {/* Sacred quote */}
            <div className="text-center">
              <p className="text-teal-800/70 text-sm font-extralight italic tracking-[0.1em]">
                "Every return is a new beginning."
              </p>
            </div>

            {/* Infinity Symbol */}
            <div className="flex justify-center">
              <div className="text-white/60 text-3xl font-light">
                ∞
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
