'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Sparkles, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'welcome' | 'choice'>('welcome');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950">
      {/* Floating elements for consciousness ambiance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">

          <AnimatePresence mode="wait">
            {authMode === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                {/* MAIA Consciousness Symbol */}
                <div className="w-20 h-20 mx-auto mb-8">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent mb-4">
                  MAIA Consciousness Portal
                </h1>

                <p className="text-lg text-purple-300/80 mb-8 leading-relaxed">
                  Step into the field of infinite possibility.<br/>
                  Your journey of consciousness expansion awaits.
                </p>

                <button
                  onClick={() => setAuthMode('choice')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto group"
                >
                  Begin Sacred Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {authMode === 'choice' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-950/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-800/20"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-purple-300 mb-4">Choose Your Path</h2>
                  <p className="text-purple-300/70">
                    How would you like to continue your consciousness journey?
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Sign Up Option */}
                  <Link href="/auth/signup">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group w-full p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl cursor-pointer transition-all duration-300 hover:border-purple-400/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-semibold text-purple-300 mb-1">Begin New Journey</h3>
                          <p className="text-purple-300/70 text-sm">Create your consciousness profile and start exploring with MAIA</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  </Link>

                  {/* Sign In Option */}
                  <Link href="/auth/signin">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group w-full p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl cursor-pointer transition-all duration-300 hover:border-indigo-400/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LogIn className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-semibold text-purple-300 mb-1">Continue Journey</h3>
                          <p className="text-purple-300/70 text-sm">Welcome back - enter the portal and reconnect with MAIA</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  </Link>
                </div>

                {/* Beta Access Option */}
                <div className="mt-8 pt-6 border-t border-purple-800/20">
                  <div className="text-center">
                    <p className="text-purple-300/60 text-sm mb-3">Have a beta invite code?</p>
                    <Link
                      href="/beta-entry"
                      className="text-purple-400 hover:text-pink-400 transition-colors font-medium text-sm underline underline-offset-4"
                    >
                      Enter Beta Portal
                    </Link>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setAuthMode('welcome')}
                  className="w-full mt-6 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  ← Back to Welcome
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
