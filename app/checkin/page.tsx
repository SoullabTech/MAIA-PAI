"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getSeasonalTheme } from '@/lib/utils/seasonalTheme';

// Optional announcement (set to null when no announcement)
// Each announcement has a unique ID - when you change the announcement, change the ID
// Users who dismissed a previous announcement will see the new one
const CURRENT_ANNOUNCEMENT = {
  id: "maia-modes-2025-10", // Change this when you post a new announcement
  title: "New: Customize How MAIA Listens & Responds",
  message: "Two new mode systems let you personalize your MAIA experience. Voice Listening (Dialogue/Patient/Scribe) controls how long MAIA waits before responding. Conversation Personality (Walking/Classic/Adaptive) shapes her response style. Mix and match to find what serves you best.",
  emoji: "🎛️💬",
  link: { text: "See full guide", url: "https://github.com/SoullabTech/MAIA-PAI/blob/main/MAIA_MODES_ANNOUNCEMENT.md" },
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
  const seasonalTheme = getSeasonalTheme();
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

          router.push('/welcome-back'); // Go through beautiful return ritual
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

      console.log('✅ [checkin] Quick check-in successful, redirecting to welcome-back');

      // Go through beautiful return ritual
      router.push('/welcome-back');
    } catch (err: any) {
      console.error('❌ [checkin] Error:', err);
      setError(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${seasonalTheme.bgClass} text-amber-50 flex items-center justify-center px-4`}>
      {/* Film grain texture overlay */}
      <div className="fixed inset-0 pointer-events-none texture-sand opacity-[0.05]" />

      {/* Stars in night sky (top 30%) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => {
          const top = Math.random() * 30;
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full"
              style={{
                background: '#E8DCC4',
                width: Math.random() > 0.8 ? '2px' : '1px',
                height: Math.random() > 0.8 ? '2px' : '1px',
                left: `${Math.random() * 100}%`,
                top: `${top}%`,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 2px rgba(232, 220, 196, 0.5)',
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
            />
          );
        })}
      </div>

      {/* Golden sand particles (bottom 60%) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const top = 40 + Math.random() * 60;
          return (
            <motion.div
              key={`sand-${i}`}
              className="absolute rounded-full"
              style={{
                background: '#D4AF37',
                width: Math.random() > 0.7 ? '3px' : '2px',
                height: Math.random() > 0.7 ? '3px' : '2px',
                left: `${Math.random() * 100}%`,
                top: `${top}%`,
                filter: 'blur(1px)',
                opacity: 0.3,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Soullab Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-cormorant tracking-widest text-amber-100" style={{
            textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)'
          }}>
            SOULLAB
          </h2>
        </motion.div>

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
            <div className="card-sietch rounded-xl p-5 backdrop-blur-md relative bg-black/30">
              <button
                onClick={handleDismissAnnouncement}
                className="absolute top-3 right-3 transition-colors text-xs text-white/70 hover:text-white"
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
                  <h3 className="font-cormorant font-medium text-sm mb-1.5 text-white" style={{
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                  }}>
                    {CURRENT_ANNOUNCEMENT.title}
                  </h3>
                  <p className="font-cinzel text-xs leading-relaxed text-amber-100" style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.7)'
                  }}>
                    {CURRENT_ANNOUNCEMENT.message}
                  </p>
                  {CURRENT_ANNOUNCEMENT.link && (
                    <a
                      href={CURRENT_ANNOUNCEMENT.link.url}
                      className="inline-block mt-2 text-xs font-raleway font-medium transition-colors text-white hover:text-amber-100"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
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
          <p className="text-lg font-cormorant leading-relaxed italic mb-3 text-white" style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)'
          }}>
            "{quote.text}"
          </p>
          <p className="text-sm font-raleway text-amber-100" style={{
            textShadow: '0 1px 6px rgba(0,0,0,0.8)'
          }}>
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
          <h1 className="text-dune-title font-cormorant text-white" style={{
            textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.6)'
          }}>
            You Are Remembered
          </h1>
          <p className="text-xs font-raleway tracking-wider mb-4 text-amber-200 uppercase" style={{
            textShadow: '0 1px 8px rgba(0,0,0,0.8)'
          }}>
            Your Path Continues
          </p>
          <p className="text-sm font-cinzel leading-relaxed text-amber-100" style={{
            textShadow: '0 1px 6px rgba(0,0,0,0.8)'
          }}>
            Enter your name to continue
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
              placeholder="Your name..."
              className="input-water text-center"
              autoFocus
            />
            <p className="text-xs mt-2 text-center font-raleway text-amber-100" style={{
              textShadow: '0 1px 4px rgba(0,0,0,0.7)'
            }}>
              Swift passage
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
            className="btn-spice w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking...</span>
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
              className="transition-colors text-sm font-serif inline-flex items-center gap-2 text-white hover:text-amber-100"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
            >
              <Sparkles className="w-4 h-4" />
              <span>New here? Create account</span>
            </button>
          </div>

          {/* Secondary helper */}
          <div className="text-center">
            <button
              onClick={() => router.push('/auth')}
              className="transition-colors text-xs font-serif text-amber-100 hover:text-white"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
            >
              Need password sign-in instead?
            </button>
          </div>

          {/* Help text */}
          <div className="text-center pt-4 border-t border-white/20">
            <p className="text-xs font-serif leading-relaxed text-amber-100" style={{
              textShadow: '0 1px 4px rgba(0,0,0,0.7)'
            }}>
              <strong className="text-white">Tip:</strong> If you haven't been here in a while and your username doesn't work,
              <br />
              <button
                onClick={() => router.push('/week2-welcome')}
                className="font-serif underline underline-offset-2 transition-colors text-white hover:text-amber-100"
              >
                it's easy to create a fresh account
              </button>
              {' '}— no worries!
            </p>
          </div>
        </motion.div>

        {/* Footer - Birthed by Soullab */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="mt-16 text-center"
        >
          {/* Seasonal indicator */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-lg">{seasonalTheme.emoji}</span>
            <p className="text-xs font-serif text-amber-100/80" style={{
              textShadow: '0 1px 4px rgba(0,0,0,0.7)'
            }}>
              {seasonalTheme.name}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <p className="text-xs font-serif tracking-[0.12em] text-white" style={{
              textShadow: '0 1px 6px rgba(0,0,0,0.8)'
            }}>
              BIRTHED BY SOULLAB
            </p>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          <p className="text-xs font-serif italic text-amber-100/70" style={{
            textShadow: '0 1px 4px rgba(0,0,0,0.7)'
          }}>
            Technology that honors the work
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
