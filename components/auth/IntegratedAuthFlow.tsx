'use client';

/**
 * INTEGRATED AUTHENTICATION FLOW
 * Spiralogic Oracle System - MAIA Sacred Gateway
 *
 * Elemental Design Principles:
 * - Fire: Vision and creation - bold onboarding flow
 * - Water: Emotional intelligence - empathetic welcome
 * - Earth: Structure - persistent session management
 * - Air: Communication - clear authentication states
 * - Aether: Integration - seamless consciousness continuity
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Apple, Heart, Sparkles, Shield } from 'lucide-react';
import { Holoflower } from '@/components/ui/Holoflower';
import { SacredHoloflower } from '@/components/sacred/SacredHoloflower';

interface UserState {
  id: string;
  username: string;
  onboarded: boolean;
  authenticatedAt?: string;
  lastSeen?: string;
  consciousnessProfile?: {
    archetypeResonance?: string[];
    wisdomFacets?: string[];
    communicationPreference?: 'voice' | 'text' | 'both';
    sessionContinuity?: boolean;
  };
}

type AuthState = 'checking' | 'new_visitor' | 'returning_user' | 'authenticated' | 'onboarding' | 'welcome_back';

export function IntegratedAuthFlow({
  onAuthComplete,
  redirectPath = '/maia'
}: {
  onAuthComplete?: (user: UserState) => void;
  redirectPath?: string;
}) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [userState, setUserState] = useState<UserState | null>(null);
  const [showSignUp, setShowSignUp] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    checkAuthenticationState();
  }, []);

  const checkAuthenticationState = () => {
    try {
      const betaUser = localStorage.getItem('beta_user');
      const lastSeen = localStorage.getItem('last_maia_session');
      const now = new Date().toISOString();

      if (betaUser) {
        const userData = JSON.parse(betaUser);

        // Update user state with enhanced consciousness profile
        const enhancedUser: UserState = {
          id: userData.id,
          username: userData.username || userData.name,
          onboarded: userData.onboarded === true,
          lastSeen: lastSeen || undefined,
          authenticatedAt: now,
          consciousnessProfile: {
            archetypeResonance: userData.archetypeResonance || [],
            wisdomFacets: userData.wisdomFacets || [],
            communicationPreference: userData.communicationPreference || 'both',
            sessionContinuity: true
          }
        };

        setUserState(enhancedUser);

        if (enhancedUser.onboarded) {
          // Check if this is a returning user (last seen > 24 hours ago)
          if (lastSeen) {
            const lastSeenDate = new Date(lastSeen);
            const hoursSinceLastSeen = (Date.now() - lastSeenDate.getTime()) / (1000 * 60 * 60);

            if (hoursSinceLastSeen > 24) {
              setAuthState('welcome_back');
              return;
            }
          }

          setAuthState('authenticated');
          if (onAuthComplete) onAuthComplete(enhancedUser);
        } else {
          setAuthState('onboarding');
        }
      } else {
        // Check for legacy system data
        const explorerName = localStorage.getItem('explorerName');
        const explorerId = localStorage.getItem('explorerId');
        const onboardingComplete = localStorage.getItem('betaOnboardingComplete') === 'true';

        if (explorerName && explorerId && onboardingComplete) {
          // Migrate legacy user to new system
          const migratedUser: UserState = {
            id: explorerId,
            username: explorerName,
            onboarded: true,
            authenticatedAt: now,
            consciousnessProfile: {
              sessionContinuity: true
            }
          };

          localStorage.setItem('beta_user', JSON.stringify(migratedUser));
          setUserState(migratedUser);
          setAuthState('welcome_back'); // Show migration welcome
          return;
        }

        setAuthState('new_visitor');
      }
    } catch (error) {
      console.error('❌ Error checking auth state:', error);
      setAuthState('new_visitor');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username || password.length < 6) {
        throw new Error(showSignUp
          ? 'Username required and password must be at least 6 characters'
          : 'Invalid credentials'
        );
      }

      const users = JSON.parse(localStorage.getItem('beta_users') || '{}');
      const now = new Date().toISOString();

      if (showSignUp) {
        // Create new user
        if (users[username]) {
          throw new Error('Username already taken');
        }

        const newUser: UserState = {
          id: `user_${Date.now()}`,
          username,
          onboarded: false,
          authenticatedAt: now,
          consciousnessProfile: {
            sessionContinuity: true
          }
        };

        users[username] = { ...newUser, password };
        localStorage.setItem('beta_users', JSON.stringify(users));
        localStorage.setItem('beta_user', JSON.stringify(newUser));

        setUserState(newUser);
        setAuthState('onboarding');

        console.log('✨ New soul created:', { username, id: newUser.id });

        // Redirect to sacred onboarding
        router.push('/beta-onboarding');

      } else {
        // Sign in existing user
        if (!users[username] || users[username].password !== password) {
          throw new Error('Invalid username or password');
        }

        const userWithPassword = users[username];
        const { password: _, ...userData } = userWithPassword;

        const authenticatedUser: UserState = {
          ...userData,
          authenticatedAt: now,
          lastSeen: localStorage.getItem('last_maia_session') || undefined
        };

        localStorage.setItem('beta_user', JSON.stringify(authenticatedUser));
        setUserState(authenticatedUser);

        if (authenticatedUser.onboarded) {
          setAuthState('authenticated');
          if (onAuthComplete) onAuthComplete(authenticatedUser);

          // Record session for consciousness continuity
          localStorage.setItem('last_maia_session', now);
          router.push(redirectPath);
        } else {
          setAuthState('onboarding');
          router.push('/beta-onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'apple' | 'google') => {
    setLoading(true);
    setError('');

    try {
      // TODO: Implement OAuth with consciousness profile integration
      setError(`${provider} sign-in coming soon. Please use username/password for now.`);
    } catch (err: any) {
      setError(err.message || `${provider} sign-in failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeBack = () => {
    if (userState) {
      const now = new Date().toISOString();
      localStorage.setItem('last_maia_session', now);

      setAuthState('authenticated');
      if (onAuthComplete) onAuthComplete(userState);
      router.push(redirectPath);
    }
  };

  const handleQuickCheckIn = () => {
    setShowSignUp(false);
    setAuthState('returning_user');
  };

  const renderCheckingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1a1f3a] flex items-center justify-center"
    >
      <div className="text-center space-y-6">
        <SacredHoloflower size="lg" glowIntensity="medium" />
        <p className="text-amber-200/60">Recognizing your consciousness...</p>
      </div>
    </motion.div>
  );

  const renderWelcomeBackState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4"
    >
      <div className="max-w-lg w-full text-center space-y-8">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <SacredHoloflower size="xl" glowIntensity="high" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-3xl font-extralight text-amber-50">
            Welcome back, {userState?.username}
          </h1>
          <p className="text-amber-200/70">
            Your consciousness continues where you left off
          </p>

          {userState?.lastSeen && (
            <p className="text-amber-200/50 text-sm">
              Last session: {new Date(userState.lastSeen).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWelcomeBack}
            className="w-full py-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-lg font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3"
          >
            <Heart className="w-5 h-5" />
            Continue Your Journey
          </motion.button>

          <button
            onClick={() => setAuthState('new_visitor')}
            className="text-amber-500/60 hover:text-amber-400/90 transition-colors text-sm"
          >
            Sign in as different user
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderNewVisitorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#1a1f3a] flex items-center justify-center px-4"
    >
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      <motion.div
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
            {showSignUp ? 'Begin Your Journey' : 'Welcome Back'}
          </h1>
          <p className="text-amber-200/60 text-sm">
            {showSignUp ? 'Choose your username' : 'Sign in to continue'}
          </p>
          {showSignUp && (
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
          onSubmit={handleAuth}
          className="space-y-5"
        >
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('apple')}
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-3"
            >
              <Apple className="w-5 h-5" />
              Continue with Apple
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-500/20"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#1a1f3a] text-amber-200/40">or use username</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-amber-200/70 mb-2 font-light">
              {showSignUp ? 'Choose your username' : 'Username'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-amber-500/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={showSignUp ? "Choose a username (e.g. kelly)" : "Enter your username"}
                className="w-full pl-10 pr-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                autoFocus
              />
            </div>
            {showSignUp && (
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
                placeholder={showSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                className="w-full pl-10 pr-4 py-3 bg-[#0A0D16] border border-amber-500/20 rounded-lg text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            {showSignUp && (
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

          {!showSignUp && (
            <button
              type="button"
              onClick={handleQuickCheckIn}
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
                {showSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </motion.form>

        <button
          onClick={() => {
            setShowSignUp(!showSignUp);
            setError('');
          }}
          className="w-full mt-6 text-sm text-amber-500/70 hover:text-amber-400/90 transition-colors font-light"
        >
          {showSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>

        <p className="text-center text-xs text-amber-200/20 mt-8">
          Beta Testing • Encrypted • Private
        </p>
      </motion.div>
    </motion.div>
  );

  // Render based on current authentication state
  switch (authState) {
    case 'checking':
      return renderCheckingState();
    case 'welcome_back':
      return renderWelcomeBackState();
    case 'new_visitor':
    case 'returning_user':
      return renderNewVisitorState();
    case 'authenticated':
      return null; // Let parent component handle authenticated state
    case 'onboarding':
      return null; // Redirect to onboarding handled in handleAuth
    default:
      return renderNewVisitorState();
  }
}