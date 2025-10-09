"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Holoflower } from '@/components/ui/Holoflower';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true); // Default to sign-up for new users
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username || password.length < 6) {
        throw new Error(isSignUp
          ? 'Username required and password must be at least 6 characters'
          : 'Invalid credentials'
        );
      }

      // Beta authentication (localStorage for now)
      const users = JSON.parse(localStorage.getItem('beta_users') || '{}');

      if (isSignUp) {
        if (users[username]) {
          throw new Error('Username already taken');
        }

        // Everyone gets Maya as their Oracle in beta
        const agent = {
          id: 'maya-oracle',
          name: 'Maya'
        };

        const newUser = {
          id: `user_${Date.now()}`,
          username,
          agentId: agent.id,
          agentName: agent.name,
          createdAt: new Date().toISOString(),
          onboarded: false
        };

        users[username] = { ...newUser, password };
        localStorage.setItem('beta_users', JSON.stringify(users));
        localStorage.setItem('beta_user', JSON.stringify(newUser));

        console.log('✅ New user created:', { username, id: newUser.id });
        router.push('/intro');
      } else {
        // Sign in
        if (!users[username] || users[username].password !== password) {
          throw new Error('Invalid username or password');
        }

        const userWithPassword = users[username];
        const { password: _, ...userData } = userWithPassword;
        localStorage.setItem('beta_user', JSON.stringify(userData));

        console.log('🔐 User signing in:', { username, onboarded: userData.onboarded });

        // Check if user has completed onboarding
        if (userData.onboarded === true) {
          console.log('✅ Returning user - going through intro ritual');
          router.push('/intro');
        } else {
          console.log('🆕 User needs onboarding - going to /onboarding');
          router.push('/onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <Holoflower size="lg" glowIntensity="medium" />
          </motion.div>

          <h1 className="text-4xl font-extralight text-amber-50 tracking-wide mb-2">
            {isSignUp ? 'Begin Your Journey' : 'Welcome Back'}
          </h1>
          <p className="text-amber-200/60 text-sm">
            {isSignUp ? 'Choose your username' : 'Sign in to continue'}
          </p>
          {isSignUp && (
            <p className="text-amber-200/40 text-xs mt-2">
              This is how you'll check in each time
            </p>
          )}
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-amber-200/70 mb-2 font-light">
              {isSignUp ? 'Choose your username' : 'Username'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-amber-500/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isSignUp ? "Choose a username (e.g. kelly)" : "Enter your username"}
                className="w-full pl-10 pr-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                autoFocus
              />
            </div>
            {isSignUp && (
              <p className="text-xs text-amber-200/40 mt-1.5">
                Use this to check in quickly later - no email needed
              </p>
            )}
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
                placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                className="w-full pl-10 pr-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            {isSignUp && (
              <p className="text-xs text-amber-200/40 mt-1.5">
                For account security - you won't need this every time
              </p>
            )}
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

          {/* Forgot Password Link - Only show on sign-in */}
          {!isSignUp && (
            <button
              type="button"
              onClick={() => router.push('/checkin')}
              className="text-xs text-amber-500/60 hover:text-amber-500/90 transition-colors text-left"
            >
              Forgot password? Try quick check-in with just your username
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </motion.form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          className="w-full mt-6 text-sm text-amber-500/70 hover:text-amber-400/90 transition-colors font-light"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>

        <p className="text-center text-xs text-amber-200/20 mt-8">
          Beta Testing • Encrypted • Private
        </p>
      </motion.div>
    </div>
  );
}
