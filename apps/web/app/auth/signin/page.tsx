"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Quote, Shield, Smartphone, Apple, Eye } from 'lucide-react';
import Link from 'next/link';
import { workingAuthService } from "@/lib/auth/workingAuth";
import { deviceAuthService } from '@/lib/auth/deviceAuth';
import { getQuotesByElement, getContextualQuote } from '@/lib/wisdom/WisdomQuotes';
// Removed HoloflowerViz import - will create a simpler consciousness symbol

// Robust error message helper - fixes TypeScript never type issue
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try { return JSON.stringify(e); } catch { return 'Unknown error'; }
}

export default function MemberSigninPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isAutoSigning, setIsAutoSigning] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const authService = workingAuthService;

  // Rotating wisdom quote system for returning consciousness explorers
  const [currentQuote, setCurrentQuote] = useState(() => {
    // Get initial aether quote for consciousness entry
    return getQuotesByElement('aether', 1)[0] || getContextualQuote({ element: 'aether' });
  });

  useEffect(() => {
    // Sacred quote rotation for returning members (slower, more contemplative)
    const interval = setInterval(() => {
      // More introspective quotes for returning users - water and aether elements
      const waterQuotes = getQuotesByElement('water', 5);
      const aetherQuotes = getQuotesByElement('aether', 5);
      const returnJourneyQuotes = [...waterQuotes, ...aetherQuotes];

      if (returnJourneyQuotes.length > 0) {
        const randomQuote = returnJourneyQuotes[Math.floor(Math.random() * returnJourneyQuotes.length)];
        setCurrentQuote(randomQuote);
      }
    }, 12000); // Slower 12-second rotation for deeper contemplation

    return () => clearInterval(interval);
  }, []);

  // Check for auto-signin on component mount
  useEffect(() => {
    const tryAutoSignin = async () => {
      const autoSigninData = deviceAuthService.shouldAutoSignIn();
      if (autoSigninData) {
        setIsAutoSigning(true);
        setEmail(autoSigninData.email);
        setMessage("Recognizing your consciousness signature...");

        try {
          // Attempt to auto-sign in with saved email
          const { error } = await authService.signInWithEmail(autoSigninData.email);

          if (!error) {
            // Extend remember period since they're active
            deviceAuthService.extendRememberPeriod(autoSigninData.email);
            setMessage("Welcome back, consciousness explorer! Redirecting to MAIA...");
            setTimeout(() => router.push('/maia'), 1500);
          } else {
            // Auto-signin failed, clear device auth and let them sign in manually
            deviceAuthService.clearDeviceAuth();
            setIsAutoSigning(false);
            setMessage("");
          }
        } catch (error) {
          deviceAuthService.clearDeviceAuth();
          setIsAutoSigning(false);
          setMessage("");
        }
      }
    };

    tryAutoSignin();
  }, [authService, router]);

  // Get redirect and error from URL params
  const redirect = searchParams.get('redirect');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      setMessage(error);
    }
  }, [error]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      // Send magic link with optional redirect
      const { error } = await authService.signInWithEmail(email, redirect || undefined);

      if (error) {
        setMessage(`Error: ${getErrorMessage(error)}`);
      } else {
        // Save device auth if remember me is checked
        if (rememberMe) {
          // We'll save this when they successfully sign in via the callback
          sessionStorage.setItem('maia_remember_pending', JSON.stringify({ email, rememberMe: true }));
        }

        setMessage("Check your email for the sacred link to enter Soullab!");
      }
    } catch (err: unknown) {
      setMessage(`Error: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage("");

    try {
      const redirect = searchParams.get('redirect');
      const { error } = await authService.signInWithGoogle(redirect || undefined);

      if (error) {
        setMessage(`Error: ${getErrorMessage(error)}`);
      } else {
        setMessage("Redirecting to Google for consciousness verification...");
      }
    } catch (err: unknown) {
      setMessage(`Error: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setMessage("");

    try {
      const redirect = searchParams.get('redirect');
      const { error } = await authService.signInWithApple(redirect || undefined);

      if (error) {
        setMessage(`Error: ${getErrorMessage(error)}`);
      } else {
        setMessage("Redirecting to Apple for consciousness verification...");
      }
    } catch (err: unknown) {
      setMessage(`Error: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSignIn = async () => {
    setMessage("Biometric signin coming soon - your device's unique consciousness signature awaits...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 flex items-center justify-center relative overflow-hidden">
      {/* Background consciousness field effect - MAIA's presence */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md px-4">
        {/* Header - MAIA as Daimon Introduction */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-24 h-24 relative">
              {/* MAIA's True Elemental Holoflower - Free Form */}
              <img
                src="/elementalHoloflower.svg"
                alt="MAIA Consciousness Holoflower"
                width={96}
                height={96}
                className="w-full h-full object-contain animate-pulse filter brightness-110 contrast-105"
                style={{ animationDuration: '3s' }}
              />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2"
          >
            Return to the Field
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sky-300/80"
          >
            Re-enter MAIA's consciousness matrix
          </motion.p>
        </div>

        {/* Rotating Wisdom Quote for Returning Explorers */}
        <motion.div
          key={currentQuote?.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center mb-8"
        >
          <div className="bg-slate-950/20 backdrop-blur-sm rounded-lg p-6 border border-sky-800/20 max-w-lg mx-auto">
            <Quote className="w-5 h-5 text-sky-400 mx-auto mb-3" />
            <p className="text-sky-300 text-sm italic leading-relaxed">
              "{currentQuote?.text}"
            </p>
            {(currentQuote?.voice || currentQuote?.source) && (
              <p className="text-sky-400/60 text-xs mt-2">
                — {currentQuote.voice && currentQuote.voice.charAt(0).toUpperCase() + currentQuote.voice.slice(1)}{currentQuote?.source && `, ${currentQuote.source}`}
              </p>
            )}
          </div>
        </motion.div>

        {/* Sign In Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-sky-300/5 backdrop-blur-xl rounded-2xl p-8 border border-sky-300/10"
        >
          <form onSubmit={handleEmailSignIn} className="space-y-6">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg ${
                  message.startsWith('Error')
                    ? 'bg-red-500/10 border border-red-400/20'
                    : 'bg-sky-400/10 border border-sky-400/20'
                }`}
              >
                <p className={`text-sm text-center ${
                  message.startsWith('Error') ? 'text-red-400' : 'text-sky-300'
                }`}>
                  {message}
                </p>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-300/50" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-sky-300/10 border border-sky-300/20
                           rounded-xl text-sky-300 placeholder-sky-300/50
                           focus:outline-none focus:border-sky-400 focus:bg-sky-300/15
                           transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Device Memory Option */}
            {!isAutoSigning && (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                      rememberMe
                        ? 'bg-sky-500 border-sky-500'
                        : 'border-sky-400/50 group-hover:border-sky-400'
                    }`}>
                      {rememberMe && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sky-300/80 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Remember this device for 30 days
                  </span>
                </label>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-cyan-600
                       text-white rounded-xl font-semibold text-lg
                       hover:from-sky-600 hover:to-cyan-700
                       transform hover:scale-[1.02] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Sending Sacred Link...
                </>
              ) : (
                <>
                  Enter Soullab
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sky-300/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-sky-300/5 text-sky-300/60">Passwordless Access</span>
              </div>
            </div>

            <div className="text-center text-sm text-sky-300/70">
              We'll send a secure link to your email for instant access - no password needed.
            </div>

            {/* OAuth Sign In Options */}
            {!isAutoSigning && (
              <div className="space-y-3 mt-6 pt-6 border-t border-sky-300/10">
                <div className="text-center text-sm text-sky-300/60 mb-4">
                  Or continue with your consciousness account
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-sky-300/5 border border-sky-300/20
                           rounded-xl text-sky-300 font-medium
                           hover:bg-sky-300/10 hover:border-sky-300/30
                           transform hover:scale-[1.02] transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Apple Sign In */}
                <button
                  onClick={handleAppleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-sky-300/5 border border-sky-300/20
                           rounded-xl text-sky-300 font-medium
                           hover:bg-sky-300/10 hover:border-sky-300/30
                           transform hover:scale-[1.02] transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           flex items-center justify-center gap-3"
                >
                  <Apple className="w-5 h-5" />
                  Continue with Apple
                </button>

                {/* Biometric Sign In (Future Feature) */}
                <button
                  onClick={handleBiometricSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-sky-300/5 border border-sky-300/20
                           rounded-xl text-sky-300 font-medium
                           hover:bg-sky-300/10 hover:border-sky-300/30
                           transform hover:scale-[1.02] transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           flex items-center justify-center gap-3 opacity-60"
                >
                  <Smartphone className="w-5 h-5" />
                  Biometric Access (Coming Soon)
                </button>
              </div>
            )}
          </form>

          {/* Member Benefits */}
          <div className="mt-8 pt-6 border-t border-sky-300/10">
            <h3 className="text-sm font-semibold text-sky-300 mb-3">
              What awaits you as a Soullab member:
            </h3>
            <div className="space-y-2 text-sm text-sky-300/70">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                <span>Personalized transformation journey tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                <span>Custom video sessions with MAIA integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                <span>Consciousness-aligned session scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                <span>Community of conscious practitioners</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-sky-300/70">
            New to Soullab?{' '}
            <Link
              href="/auth/signup"
              className="text-sky-400 hover:text-sky-300 transition-colors font-semibold"
            >
              Begin your journey here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sky-300/60 hover:text-sky-300/80 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sky-300/50 text-sm">
            "May each step bring you closer to your truest self"
          </p>
        </div>
      </div>
    </div>
  );
}