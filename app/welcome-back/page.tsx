'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Coffee, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';

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
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
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

    // Determine time of day
    const hour = new Date().getHours();
    let period: 'morning' | 'afternoon' | 'evening' | 'night';
    if (hour >= 5 && hour < 12) period = 'morning';
    else if (hour >= 12 && hour < 17) period = 'afternoon';
    else if (hour >= 17 && hour < 21) period = 'evening';
    else period = 'night';
    setTimeOfDay(period);

    // Set greeting based on time and days away
    let greetingText = '';
    if (daysSinceVisit === 0) {
      greetingText = `Welcome back, ${userName || 'Dreamer'}. The field remembers you.`;
    } else if (daysSinceVisit === 1) {
      greetingText = `Good ${period}, ${userName || 'Dreamer'}. The work continues.`;
    } else if (daysSinceVisit <= 7) {
      greetingText = `It's been ${daysSinceVisit} days, ${userName || 'Dreamer'}. The patterns await.`;
    } else {
      greetingText = `Welcome back after ${daysSinceVisit} days. You've been missed.`;
    }
    setGreeting(greetingText);

    setLoading(false);
  }, [router]);

  const handleHoloflowerCheckIn = () => {
    router.push('/holoflower-checkin');
  };

  const handleContinueToMaia = () => {
    router.push('/maia');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fremen-night flex items-center justify-center">
        <div className="text-dune-amber text-lg font-cinzel">You are remembered...</div>
      </div>
    );
  }

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="w-12 h-12 text-spice-orange" />;
      case 'afternoon':
        return <Coffee className="w-12 h-12 text-spice-glow" />;
      case 'evening':
        return <Star className="w-12 h-12 text-bene-gesserit-gold" />;
      case 'night':
        return <Moon className="w-12 h-12 text-ibad-blue" />;
    }
  };

  return (
    <div className="min-h-screen bg-arrakis-sunset relative overflow-hidden flex items-center justify-center">
      {/* Animated spice gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(255, 140, 66, 0.15), transparent 50%), radial-gradient(circle at 70% 80%, rgba(212, 165, 116, 0.2), transparent 50%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Desert stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              background: 'var(--bene-gesserit-gold)',
              width: Math.random() > 0.8 ? '2px' : '1px',
              height: Math.random() > 0.8 ? '2px' : '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px rgba(184, 134, 11, 0.8)',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          {/* Time of Day Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            {getTimeIcon()}
          </motion.div>

          {/* Holoflower Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Image
                src="/holoflower-amber.png"
                alt="Holoflower"
                width={80}
                height={80}
                className="drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))' }}
              />
            </motion.div>
          </motion.div>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-dune-hero font-cormorant text-sand-white mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-dune-amber leading-relaxed font-cinzel">
              {greeting}
            </p>
          </motion.div>

          {/* Return Info */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="card-sietch backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-spice-lg"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-spice-orange" />
              <span className="text-bene-gesserit-gold text-sm font-raleway font-semibold tracking-wide uppercase">
                You Are Recognized
              </span>
            </div>
            {daysSinceVisit > 0 && (
              <p className="text-deep-sand/90 font-cinzel">
                It's been <span className="text-spice-orange font-bold">{daysSinceVisit} {daysSinceVisit === 1 ? 'day' : 'days'}</span> since your last visit.
              </p>
            )}
            {daysSinceVisit === 0 && (
              <p className="text-deep-sand/90 font-cinzel">
                You were just here. The work continues.
              </p>
            )}
          </motion.div>

          {/* Choice: Check In or Continue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleHoloflowerCheckIn}
                className="btn-spice inline-flex items-center gap-3 justify-center"
              >
                <Sparkles className="w-4 h-4" />
                <span>Check In with Holoflower</span>
              </button>
              <button
                onClick={handleContinueToMaia}
                className="px-6 py-3 rounded-lg bg-transparent border border-spice-orange/40 text-spice-orange hover:bg-spice-orange/10 transition-all inline-flex items-center gap-3 justify-center font-raleway"
              >
                <span>Continue to MAIA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-dune-amber/60 text-sm italic font-raleway text-center">
              Check in to share your current state with MAIA
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
