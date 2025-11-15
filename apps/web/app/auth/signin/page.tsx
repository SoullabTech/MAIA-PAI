"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { IntegrationAuthService } from "@/lib/auth/integrationAuth";

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
    <div className="min-h-screen bg-gradient-to-br from-jade-abyss via-jade-shadow to-jade-night flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-jade-glow to-jade-ocean rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-jade-whisper" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-jade-whisper mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-jade-whisper/80"
          >
            Continue your transformation journey
          </motion.p>
        </div>

        {/* Sign In Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-jade-whisper/5 backdrop-blur-xl rounded-2xl p-8 border border-jade-whisper/10"
        >
          <form onSubmit={handleEmailSignIn} className="space-y-6">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg ${
                  message.startsWith('Error')
                    ? 'bg-red-500/10 border border-red-400/20'
                    : 'bg-jade-glow/10 border border-jade-glow/20'
                }`}
              >
                <p className={`text-sm text-center ${
                  message.startsWith('Error') ? 'text-red-400' : 'text-jade-glow'
                }`}>
                  {message}
                </p>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jade-whisper/50" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-jade-whisper/10 border border-jade-whisper/20
                           rounded-xl text-jade-whisper placeholder-jade-whisper/50
                           focus:outline-none focus:border-jade-glow focus:bg-jade-whisper/15
                           transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-gradient-to-r from-jade-glow to-jade-ocean
                       text-jade-night rounded-xl font-semibold text-lg
                       hover:from-jade-ocean hover:to-jade-glow
                       transform hover:scale-[1.02] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-jade-night/20 border-t-jade-night rounded-full animate-spin" />
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
                <div className="w-full border-t border-jade-whisper/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-jade-whisper/5 text-jade-whisper/60">Passwordless Access</span>
              </div>
            </div>

            <div className="text-center text-sm text-jade-whisper/70">
              We'll send a secure link to your email for instant access - no password needed.
            </div>
          </form>

          {/* Member Benefits */}
          <div className="mt-8 pt-6 border-t border-jade-whisper/10">
            <h3 className="text-sm font-semibold text-jade-whisper mb-3">
              What awaits you as a Soullab member:
            </h3>
            <div className="space-y-2 text-sm text-jade-whisper/70">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-jade-glow rounded-full"></div>
                <span>Personalized transformation journey tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-jade-glow rounded-full"></div>
                <span>Custom video sessions with MAIA integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-jade-glow rounded-full"></div>
                <span>Consciousness-aligned session scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-jade-glow rounded-full"></div>
                <span>Community of conscious practitioners</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-jade-whisper/70">
            New to Soullab?{' '}
            <Link
              href="/auth/signup"
              className="text-jade-glow hover:text-jade-ocean transition-colors font-semibold"
            >
              Begin your journey here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-jade-whisper/60 hover:text-jade-whisper/80 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-jade-whisper/50 text-sm">
            "May each step bring you closer to your truest self"
          </p>
        </div>
      </div>
    </div>
  );
}