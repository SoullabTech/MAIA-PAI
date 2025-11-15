"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowRight, Quote } from 'lucide-react';
import Link from 'next/link';
import { IntegrationAuthService } from "@/lib/auth/integrationAuth";
import { WisdomQuotes } from '@/lib/wisdom/WisdomQuotes';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const authService = new IntegrationAuthService();

  // Rotating wisdom quote system for returning consciousness explorers
  const [currentQuote, setCurrentQuote] = useState(WisdomQuotes.aether[0]);

  useEffect(() => {
    // Sacred quote rotation for returning members (slower, more contemplative)
    const interval = setInterval(() => {
      const returnJourneyQuotes = [...WisdomQuotes.water, ...WisdomQuotes.aether]; // More introspective for returning users
      const randomQuote = returnJourneyQuotes[Math.floor(Math.random() * returnJourneyQuotes.length)];
      setCurrentQuote(randomQuote);
    }, 12000); // Slower 12-second rotation for deeper contemplation

    return () => clearInterval(interval);
  }, []);

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
        setMessage("Check your email for the sacred link to enter Soullab!");
      }
    } catch (err: unknown) {
      setMessage(`Error: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-2"
          >
            Return to the Field
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-purple-300/80"
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
          <div className="bg-purple-950/20 backdrop-blur-sm rounded-lg p-6 border border-purple-800/20 max-w-lg mx-auto">
            <Quote className="w-5 h-5 text-purple-400 mx-auto mb-3" />
            <p className="text-purple-300 text-sm italic leading-relaxed">
              "{currentQuote?.text}"
            </p>
            {currentQuote?.author && (
              <p className="text-purple-400/60 text-xs mt-2">
                — {currentQuote.author}
              </p>
            )}
          </div>
        </motion.div>

        {/* Sign In Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-300/5 backdrop-blur-xl rounded-2xl p-8 border border-purple-300/10"
        >
          <form onSubmit={handleEmailSignIn} className="space-y-6">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg ${
                  message.startsWith('Error')
                    ? 'bg-red-500/10 border border-red-400/20'
                    : 'bg-purple-400/10 border border-purple-400/20'
                }`}
              >
                <p className={`text-sm text-center ${
                  message.startsWith('Error') ? 'text-red-400' : 'text-purple-300'
                }`}>
                  {message}
                </p>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/50" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-purple-300/10 border border-purple-300/20
                           rounded-xl text-purple-300 placeholder-purple-300/50
                           focus:outline-none focus:border-purple-400 focus:bg-purple-300/15
                           transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600
                       text-white rounded-xl font-semibold text-lg
                       hover:from-purple-600 hover:to-indigo-700
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
                <div className="w-full border-t border-purple-300/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-purple-300/5 text-purple-300/60">Passwordless Access</span>
              </div>
            </div>

            <div className="text-center text-sm text-purple-300/70">
              We'll send a secure link to your email for instant access - no password needed.
            </div>
          </form>

          {/* Member Benefits */}
          <div className="mt-8 pt-6 border-t border-purple-300/10">
            <h3 className="text-sm font-semibold text-purple-300 mb-3">
              What awaits you as a Soullab member:
            </h3>
            <div className="space-y-2 text-sm text-purple-300/70">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Personalized transformation journey tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Custom video sessions with MAIA integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Consciousness-aligned session scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span>Community of conscious practitioners</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-purple-300/70">
            New to Soullab?{' '}
            <Link
              href="/auth/signup"
              className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
            >
              Begin your journey here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-purple-300/60 hover:text-purple-300/80 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-purple-300/50 text-sm">
            "May each step bring you closer to your truest self"
          </p>
        </div>
      </div>
    </div>
  );
}