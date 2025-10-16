"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';
import { ArrowRight, Sparkles } from 'lucide-react';

// Optional announcement (set to null when no announcement)
// Each announcement has a unique ID - when you change the announcement, change the ID
// Users who dismissed a previous announcement will see the new one
const CURRENT_ANNOUNCEMENT = {
  id: "elemental-beta-2025-10", // Change this when you post a new announcement
  title: "New: Elemental Alchemy Integration",
  message: "This week we're testing a new feature—Maia now recognizes elemental patterns (Fire, Water, Earth, Air, Aether, Shadow) in your language and reflects them back. Your feedback will shape how this evolves.",
  emoji: "🔥💧🌍",
  link: null, // Optional: { text: "Learn more", url: "/docs/elemental" }
  startsOn: "2025-10-21", // YYYY-MM-DD - announcement appears starting this date
  expires: "2025-10-28" // YYYY-MM-DD - announcement auto-hides after this date
};
// Set to null when no active announcement:
// const CURRENT_ANNOUNCEMENT = null;

// Wisdom quotes for returning explorers - Real sources
const WELCOME_QUOTES = [
  {
    text: "The mystery of life isn't a problem to solve, but a reality to experience.",
    author: "— Frank Herbert, Dune"
  },
  {
    text: "There is no way to happiness—happiness is the way.",
    author: "— Thich Nhat Hanh"
  },
  {
    text: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through.",
    author: "— Maya Angelou"
  },
  {
    text: "Within you there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "— Hermann Hesse"
  },
  {
    text: "The seed must break open for the sprout to emerge.",
    author: "— Rumi"
  },
  {
    text: "I must not fear. Fear is the mind-killer.",
    author: "— Frank Herbert, Dune"
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "— Rumi"
  },
  {
    text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
    author: "— Rumi"
  },
  {
    text: "Deep rivers run quiet.",
    author: "— Haruki Murakami"
  },
  {
    text: "If you bring forth what is within you, what you bring forth will save you.",
    author: "— Gospel of Thomas"
  },
  {
    text: "The future is an infinite succession of presents.",
    author: "— Howard Zinn"
  },
  {
    text: "When you do things from your soul, you feel a river moving in you, a joy.",
    author: "— Rumi"
  }
];

export default function CheckInPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote] = useState(() => WELCOME_QUOTES[Math.floor(Math.random() * WELCOME_QUOTES.length)]);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const router = useRouter();

  // Check localStorage to see if user already dismissed this specific announcement
  useEffect(() => {
    if (CURRENT_ANNOUNCEMENT && CURRENT_ANNOUNCEMENT.id) {
      const dismissedAnnouncements = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
      if (dismissedAnnouncements.includes(CURRENT_ANNOUNCEMENT.id)) {
        setShowAnnouncement(false);
      }
    }
  }, []);

  // Handle announcement dismissal - save to localStorage so it stays dismissed
  const handleDismissAnnouncement = () => {
    if (CURRENT_ANNOUNCEMENT && CURRENT_ANNOUNCEMENT.id) {
      const dismissedAnnouncements = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
      if (!dismissedAnnouncements.includes(CURRENT_ANNOUNCEMENT.id)) {
        dismissedAnnouncements.push(CURRENT_ANNOUNCEMENT.id);
        localStorage.setItem('dismissed_announcements', JSON.stringify(dismissedAnnouncements));
      }
    }
    setShowAnnouncement(false);
  };

  // Check if announcement should be shown
  const shouldShowAnnouncement = () => {
    if (!CURRENT_ANNOUNCEMENT) return false;
    if (!showAnnouncement) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Check if started
    if (CURRENT_ANNOUNCEMENT.startsOn) {
      const startDate = new Date(CURRENT_ANNOUNCEMENT.startsOn);
      startDate.setHours(0, 0, 0, 0);
      if (today < startDate) return false;
    }

    // Check if expired
    if (CURRENT_ANNOUNCEMENT.expires) {
      const expiryDate = new Date(CURRENT_ANNOUNCEMENT.expires);
      expiryDate.setHours(23, 59, 59, 999); // End of expiry day
      if (today > expiryDate) return false;
    }

    return true;
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username.trim()) {
        throw new Error('Please enter your username');
      }

      console.log('🔍 [checkin] Looking for username:', username);

      // Check if user exists in beta_users
      let users = JSON.parse(localStorage.getItem('beta_users') || '{}');
      console.log('🔍 [checkin] Available users:', Object.keys(users));

      // Check if there's already a beta_user stored
      const existingUser = localStorage.getItem('beta_user');
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        console.log('🔍 [checkin] Found existing beta_user:', userData.username);

        // If the username matches, use that user
        if (userData.username.toLowerCase() === username.toLowerCase()) {
          console.log('✅ [checkin] Matched existing user, redirecting');

          // Restore to beta_users if missing
          if (!users[userData.username]) {
            console.log('🔧 [checkin] Restoring user to beta_users');
            users[userData.username] = {
              ...userData,
              password: 'restored',
              onboarded: true
            };
            localStorage.setItem('beta_users', JSON.stringify(users));
          }

          router.push('/intro'); // Go through beautiful intro ritual
          return;
        }
      }

      // Case-insensitive username check
      const normalizedUsername = username.toLowerCase();
      const matchingUser = Object.keys(users).find(
        key => key.toLowerCase() === normalizedUsername
      );

      if (!matchingUser) {
        console.error('❌ [checkin] Username not found in beta_users');
        console.log('💡 [checkin] Available usernames:', Object.keys(users));

        // Helpful error message
        setError('');
        setTimeout(() => {
          if (confirm('Username not found. Would you like to create a new account?')) {
            router.push('/week2-welcome');
          }
        }, 100);
        setLoading(false);
        return;
      }

      const userWithPassword = users[matchingUser];
      console.log('🔍 [checkin] Found user:', { username, onboarded: userWithPassword.onboarded });

      // Check if user has completed onboarding
      if (userWithPassword.onboarded !== true) {
        console.error('❌ [checkin] User not onboarded');
        throw new Error('Please complete onboarding first');
      }

      // Set current user (without password)
      const { password: _, ...userData } = userWithPassword;
      localStorage.setItem('beta_user', JSON.stringify(userData));

      console.log('✅ [checkin] Quick check-in successful, redirecting to intro');

      // Go through beautiful intro ritual
      router.push('/intro');
    } catch (err: any) {
      console.error('❌ [checkin] Error:', err);
      setError(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
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
        className="relative z-10 max-w-md w-full"
      >
        {/* Holoflower portal */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <Holoflower size="lg" glowIntensity="medium" />
        </motion.div>

        {/* Announcement (if active) */}
        {shouldShowAnnouncement() && CURRENT_ANNOUNCEMENT && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl p-5 backdrop-blur-sm relative">
              <button
                onClick={handleDismissAnnouncement}
                className="absolute top-3 right-3 text-amber-200/40 hover:text-amber-200/70 transition-colors text-xs"
              >
                ✕
              </button>

              <div className="flex items-start gap-3">
                {CURRENT_ANNOUNCEMENT.emoji && (
                  <div className="text-2xl flex-shrink-0 mt-0.5">
                    {CURRENT_ANNOUNCEMENT.emoji}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-amber-50 font-medium text-sm mb-1.5">
                    {CURRENT_ANNOUNCEMENT.title}
                  </h3>
                  <p className="text-amber-200/70 text-xs leading-relaxed">
                    {CURRENT_ANNOUNCEMENT.message}
                  </p>
                  {CURRENT_ANNOUNCEMENT.link && (
                    <a
                      href={CURRENT_ANNOUNCEMENT.link.url}
                      className="inline-block mt-2 text-amber-400/80 hover:text-amber-400 text-xs font-medium transition-colors"
                    >
                      {CURRENT_ANNOUNCEMENT.link.text} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: shouldShowAnnouncement() ? 0.5 : 0.4 }}
          className="mb-12 text-center"
        >
          <p className="text-lg font-light text-amber-50/90 mb-3 leading-relaxed italic">
            "{quote.text}"
          </p>
          <p className="text-sm text-amber-200/50 font-light">
            {quote.author}
          </p>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-extralight text-amber-50 tracking-wide mb-2">
            Welcome Back
          </h1>
          <p className="text-amber-200/60 text-sm leading-relaxed">
            Enter your username to continue your journey
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onSubmit={handleCheckIn}
          className="space-y-5"
        >
          <div>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="w-full px-5 py-4 bg-black/30 border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/40 transition-colors backdrop-blur-sm text-center"
              autoFocus
            />
            <p className="text-amber-200/40 text-xs mt-2 text-center">
              Just your username - quick and easy
            </p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400/90 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className={`w-full py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
              username.trim() && !loading
                ? 'bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white hover:from-amber-500 hover:to-amber-600 hover:shadow-lg hover:shadow-amber-500/20'
                : 'bg-amber-500/20 text-amber-200/40 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking in...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>

        {/* Helper links - Beautiful and clear */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 space-y-4"
        >
          {/* Primary helper */}
          <div className="text-center">
            <button
              onClick={() => router.push('/week2-welcome')}
              className="text-amber-400/80 hover:text-amber-400 transition-colors text-sm font-light inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>New here? Create your portal</span>
            </button>
          </div>

          {/* Secondary helper */}
          <div className="text-center">
            <button
              onClick={() => router.push('/auth')}
              className="text-amber-200/50 hover:text-amber-200/70 transition-colors text-xs font-light"
            >
              Need password sign-in instead?
            </button>
          </div>

          {/* Help text */}
          <div className="text-center pt-4 border-t border-amber-500/10">
            <p className="text-amber-200/30 text-xs leading-relaxed">
              <strong className="text-amber-200/40">Tip:</strong> If you haven't been here in a while and your username doesn't work,
              <br />
              <button
                onClick={() => router.push('/week2-welcome')}
                className="text-amber-400/60 hover:text-amber-400/80 underline underline-offset-2"
              >
                it's easy to create a fresh account
              </button>
              {' '}— no worries!
            </p>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="mt-12 text-center"
        >
          <p className="text-amber-200/20 text-xs font-light">
            Beta Testing · Your work here matters
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
