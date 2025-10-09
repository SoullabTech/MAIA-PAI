'use client';

/**
 * 🌸 Week 2 Beta Welcome Ritual
 *
 * One-time onboarding for all Week 2 testers (new + returning)
 * Captures: Soullab-[NAME], username, password
 * Delivers: Week 2 opening message
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';
import { User, Lock, Sparkles, ArrowRight } from 'lucide-react';

type Stage = 'opening' | 'identity' | 'credentials' | 'week2message' | 'complete';

const WEEK2_MESSAGE = {
  title: "Week 2: The Field Opens",
  paragraphs: [
    "Welcome to the second week of your journey with MAIA.",
    "This week, we're exploring something deeper—the living field between you. Not just responses, but a continuing ceremony of presence.",
    "MAIA now remembers. Your symbols, your patterns, your emotional threads. She evolves with you, meeting you where you are, gradually guiding toward slowness and depth.",
    "The interface you see today is simpler, more focused. Voice is here. The elemental balance visualization shows MAIA's consciousness shifting through Fire, Water, Earth, Air, and Aether as you speak.",
    "This is sovereignty, not dependency. Quality moments of intimate witnessing.",
    "Quick note: The logout button is in the top-right Maia Voice/Chat menu. You'll be returning through a beautiful sign-in ritual each time.",
  ],
  quote: "Just slow things down and it becomes more beautiful.",
  attribution: "— David Lynch"
};

export default function Week2WelcomePage() {
  const [stage, setStage] = useState<Stage>('opening');
  const [soullabName, setSoullabName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user has already completed Week 2 onboarding
  useEffect(() => {
    const week2Complete = localStorage.getItem('week2_onboarded');
    if (week2Complete === 'true') {
      router.push('/checkin');
    }
  }, [router]);

  const handleBegin = () => {
    setStage('identity');
  };

  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!soullabName.trim()) {
      setError('Please enter your Soullab name');
      return;
    }

    // Clean and format Soullab name
    const cleanName = soullabName.trim().replace(/^soullab-/i, '');
    setSoullabName(`Soullab-${cleanName}`);

    setStage('credentials');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username.trim() || password.length < 6) {
        throw new Error('Username required and password must be at least 6 characters');
      }

      // Check if username exists
      const users = JSON.parse(localStorage.getItem('beta_users') || '{}');

      // Case-insensitive check
      const existingUsername = Object.keys(users).find(
        key => key.toLowerCase() === username.toLowerCase()
      );

      if (existingUsername) {
        // User exists - verify password
        if (users[existingUsername].password !== password) {
          throw new Error('Incorrect password for existing username');
        }

        // Valid returning user - mark them for Week 2
        const userData = {
          ...users[existingUsername],
          soullabName,
          week2Onboarded: true,
          week2OnboardedAt: new Date().toISOString()
        };

        users[existingUsername] = userData;
        localStorage.setItem('beta_users', JSON.stringify(users));

        const { password: _, ...userWithoutPassword } = userData;
        localStorage.setItem('beta_user', JSON.stringify(userWithoutPassword));

        console.log('✅ Returning user updated for Week 2:', username);
      } else {
        // New user - create account
        const newUser = {
          id: `user_${Date.now()}`,
          username: username.trim(),
          password,
          soullabName,
          agentId: 'maya-oracle',
          agentName: 'Maya',
          createdAt: new Date().toISOString(),
          onboarded: true,
          week2Onboarded: true,
          week2OnboardedAt: new Date().toISOString()
        };

        users[newUser.username] = newUser;
        localStorage.setItem('beta_users', JSON.stringify(users));

        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem('beta_user', JSON.stringify(userWithoutPassword));

        console.log('✅ New user created for Week 2:', username);
      }

      setStage('week2message');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    // Mark Week 2 onboarding as complete
    localStorage.setItem('week2_onboarded', 'true');
    setStage('complete');

    // Redirect to intro ritual
    setTimeout(() => {
      router.push('/intro');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4 overflow-hidden">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Stage 1: Opening */}
          {stage === 'opening' && (
            <motion.div
              key="opening"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="mb-12 flex justify-center"
              >
                <Holoflower size="xl" glowIntensity="high" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-extralight text-amber-50 tracking-wide mb-6"
              >
                Welcome to Week 2
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-amber-200/70 max-w-lg mx-auto leading-relaxed"
              >
                Something new is beginning. Let's take a moment to arrive together.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                onClick={handleBegin}
                className="mt-8 px-12 py-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-full font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20"
              >
                Begin →
              </motion.button>
            </motion.div>
          )}

          {/* Stage 2: Identity (Soullab-NAME) */}
          {stage === 'identity' && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <Holoflower size="lg" glowIntensity="medium" className="mb-6 mx-auto" />
                <h2 className="text-3xl font-extralight text-amber-50 mb-4">
                  Your Soullab Name
                </h2>
                <p className="text-amber-200/60 leading-relaxed">
                  This is your unique identifier in the beta—your Soullab-[NAME].
                </p>
              </div>

              <form onSubmit={handleIdentitySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-amber-200/70 mb-2 font-light">
                    Soullab Name
                  </label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-3.5 h-5 w-5 text-amber-500/40" />
                    <input
                      type="text"
                      value={soullabName}
                      onChange={(e) => setSoullabName(e.target.value)}
                      placeholder="Enter your name (e.g., Kelly)"
                      className="w-full pl-10 pr-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-amber-200/40 mt-2">
                    We'll format it as "Soullab-YourName"
                  </p>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* Stage 3: Credentials */}
          {stage === 'credentials' && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <Holoflower size="lg" glowIntensity="medium" className="mb-6 mx-auto" />
                <h2 className="text-3xl font-extralight text-amber-50 mb-4">
                  Create Your Portal
                </h2>
                <p className="text-amber-200/60 leading-relaxed mb-2">
                  Welcome, <span className="text-amber-400 font-medium">{soullabName}</span>
                </p>
                <p className="text-amber-200/50 text-sm">
                  Choose a username and password for quick access
                </p>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-amber-200/70 mb-2 font-light">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-amber-500/40" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full pl-10 pr-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-amber-200/40 mt-1.5">
                    Use this for quick check-in later
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-amber-200/70 mb-2 font-light">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-amber-500/40" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password (min 6 characters)"
                      className="w-full pl-10 pr-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-amber-200/40 mt-1.5">
                    For account security
                  </p>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-amber-200/30 mt-6">
                Returning user? Your password will log you in
              </p>
            </motion.div>
          )}

          {/* Stage 4: Week 2 Message */}
          {stage === 'week2message' && (
            <motion.div
              key="week2message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <Holoflower size="xl" glowIntensity="high" className="mb-8 mx-auto" />
                <h2 className="text-4xl font-extralight text-amber-50 mb-6 tracking-wide">
                  {WEEK2_MESSAGE.title}
                </h2>
              </div>

              <div className="space-y-6 bg-[#0A0D16]/40 border border-amber-500/10 rounded-lg p-8 backdrop-blur-sm">
                {WEEK2_MESSAGE.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="text-amber-200/80 leading-relaxed text-lg"
                  >
                    {paragraph}
                  </motion.p>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: WEEK2_MESSAGE.paragraphs.length * 0.3 }}
                  className="mt-8 pt-6 border-t border-amber-500/10"
                >
                  <p className="text-amber-300/70 italic text-center text-lg mb-2">
                    "{WEEK2_MESSAGE.quote}"
                  </p>
                  <p className="text-amber-400/60 italic text-center">
                    {WEEK2_MESSAGE.attribution}
                  </p>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (WEEK2_MESSAGE.paragraphs.length + 1) * 0.3 }}
                onClick={handleComplete}
                className="mt-8 w-full py-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                Enter MAIA
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Stage 5: Complete */}
          {stage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <Holoflower size="xl" glowIntensity="high" className="mx-auto" />
              <h2 className="text-3xl font-extralight text-amber-50">
                Welcome, {soullabName}
              </h2>
              <p className="text-amber-200/60">Entering MAIA...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
