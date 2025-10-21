'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Coffee, Star } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #581c87 20%, #6d28d9 40%, #7c3aed 60%, #a855f7 80%, #c084fc 100%)',
      }}>
        <div className="text-purple-200 text-lg">Welcoming you back...</div>
      </div>
    );
  }

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="w-12 h-12 text-amber-300" />;
      case 'afternoon':
        return <Coffee className="w-12 h-12 text-orange-300" />;
      case 'evening':
        return <Star className="w-12 h-12 text-purple-300" />;
      case 'night':
        return <Moon className="w-12 h-12 text-indigo-300" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{
      background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #581c87 20%, #6d28d9 40%, #7c3aed 60%, #a855f7 80%, #c084fc 100%)',
    }}>
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(251, 191, 36, 0.15), transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.2), transparent 50%)',
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

      {/* Twinkling stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.8 ? '2px' : '1px',
              height: Math.random() > 0.8 ? '2px' : '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-purple-200 leading-relaxed">
              {greeting}
            </p>
          </motion.div>

          {/* Return Info */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="backdrop-blur-xl bg-white/10 border border-purple-300/30 rounded-2xl p-6 mb-8"
            style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)' }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-purple-200 text-sm font-semibold tracking-wide uppercase">
                The Field Recognizes You
              </span>
            </div>
            {daysSinceVisit > 0 && (
              <p className="text-purple-100">
                It's been <span className="text-amber-300 font-bold">{daysSinceVisit} {daysSinceVisit === 1 ? 'day' : 'days'}</span> since your last visit.
              </p>
            )}
            {daysSinceVisit === 0 && (
              <p className="text-purple-100">
                You were just here. The work is calling.
              </p>
            )}
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-white font-semibold shadow-2xl transition-all transform hover:scale-105"
              style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}
            >
              <span>Continue</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <p className="mt-4 text-purple-300 text-sm italic">
              (Auto-continuing in 3 seconds...)
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
