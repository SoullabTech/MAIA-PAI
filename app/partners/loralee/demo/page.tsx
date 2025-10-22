"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, Heart, Star } from 'lucide-react';
import { LoraleeInteractiveChart } from '@/components/partners/loralee/LoraleeInteractiveChart';
import { LoraleeLivingCurriculum } from '@/components/partners/loralee/LoraleeLivingCurriculum';
import { LoraleeIntakeFlow } from '@/components/partners/loralee/LoraleeIntakeFlow';

/**
 * Loralee Crowder - Partnership Demo
 *
 * Shows the complete vision for "Astrology as Living Curriculum"
 * - Traditional chart wheel with interactive nodes
 * - Client portal for ongoing exploration
 * - Conversational intake flow
 */

type DemoView = 'welcome' | 'intake' | 'chart' | 'curriculum' | 'vision';

export default function LoraleeDemoPage() {
  const [currentView, setCurrentView] = useState<DemoView>('welcome');
  const [clientName, setClientName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black">
      {/* Starfield Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
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
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'welcome' && (
            <WelcomeView onStart={(name) => {
              setClientName(name);
              setCurrentView('intake');
            }} />
          )}

          {currentView === 'intake' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 py-16"
            >
              <LoraleeIntakeFlow
                onComplete={() => setCurrentView('chart')}
                clientName={clientName}
              />
            </motion.div>
          )}

          {currentView === 'chart' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 py-16"
            >
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-light text-indigo-200 mb-4">
                    Your Sacred Birth Chart
                  </h1>
                  <p className="text-indigo-300/70">
                    A living map of your soul's curriculum
                  </p>
                </div>

                <LoraleeInteractiveChart clientName={clientName} />

                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={() => setCurrentView('curriculum')}
                    className="px-6 py-3 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-full border border-indigo-500/30 transition-all flex items-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    View Living Curriculum
                  </button>
                  <button
                    onClick={() => setCurrentView('vision')}
                    className="px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-full border border-purple-500/30 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    See the Full Vision
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'curriculum' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 py-16"
            >
              <LoraleeLivingCurriculum
                clientName={clientName}
                onBack={() => setCurrentView('chart')}
              />
            </motion.div>
          )}

          {currentView === 'vision' && (
            <VisionView
              onBack={() => setCurrentView('chart')}
              onRestart={() => {
                setClientName('');
                setCurrentView('welcome');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Welcome View
function WelcomeView({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Cosmic Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 1 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              ✦
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-300 mb-6"
        >
          Astrology as Living Curriculum
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-indigo-300/80 mb-4"
        >
          A partnership demo for <span className="text-indigo-200 font-medium">Loralee Crowder</span>
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-indigo-400/70 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Experience how your birth chart can become an interactive, evolving companion—
          a sacred map you return to throughout your journey,
          where wisdom reveals itself as you're ready to receive it.
        </motion.p>

        {/* Interactive Demo Start */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20">
            <p className="text-indigo-300 mb-4 text-sm">
              Enter your name to experience a sample client journey:
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name && onStart(name)}
              placeholder="Your name..."
              className="w-full px-4 py-3 bg-indigo-950/50 border border-indigo-500/30 rounded-lg text-indigo-100 placeholder-indigo-400/40 focus:outline-none focus:border-indigo-400/50 mb-4"
            />
            <button
              onClick={() => name && onStart(name)}
              disabled={!name}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Begin the Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-indigo-400/60 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Interactive Chart</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Living Wisdom</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Soul Curriculum</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-indigo-400/40 text-sm"
        >
          <p>
            Built with{' '}
            <span className="text-indigo-300">Soullab Inside</span>
            {' '}— Technology that listens
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Vision View
function VisionView({
  onBack,
  onRestart
}: {
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-indigo-200 mb-4">
            The Complete Vision
          </h1>
          <p className="text-indigo-300/70">
            What Soullab Inside can create for your practice
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Before */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20">
            <h3 className="text-xl text-red-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">❌</span>
              Without Soullab Inside
            </h3>
            <ul className="space-y-3 text-red-200/70 text-sm">
              <li>• Manual intake forms (impersonal, draining)</li>
              <li>• Static PDF charts (don't evolve with client)</li>
              <li>• One-time readings (no ongoing relationship)</li>
              <li>• Endless admin work (scheduling, delivery, follow-ups)</li>
              <li>• Limited reach (1:1 sessions only)</li>
              <li>• Your wisdom trapped in your head</li>
            </ul>
          </div>

          {/* After */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20">
            <h3 className="text-xl text-green-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              With Soullab Inside
            </h3>
            <ul className="space-y-3 text-green-200/70 text-sm">
              <li>• Conversational intake (feels like talking to you)</li>
              <li>• Living charts (clients return over time)</li>
              <li>• Ongoing curriculum (wisdom reveals progressively)</li>
              <li>• Tech handles admin (you focus on seeing)</li>
              <li>• Scalable presence (serve many without burnout)</li>
              <li>• Your wisdom accessible to those who need it</li>
            </ul>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20 mb-12">
          <h3 className="text-2xl text-indigo-200 mb-6">What You Get</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🗺️</div>
              <h4 className="text-indigo-300 font-medium mb-2">Interactive Charts</h4>
              <p className="text-indigo-400/70 text-sm">
                Traditional wheel + clickable planets + your interpretations
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📖</div>
              <h4 className="text-indigo-300 font-medium mb-2">Living Curriculum</h4>
              <p className="text-indigo-400/70 text-sm">
                Clients journal, reflect, and track their journey over time
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🌊</div>
              <h4 className="text-indigo-300 font-medium mb-2">Transit Overlays</h4>
              <p className="text-indigo-400/70 text-sm">
                Current transits show what's activating in their chart now
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💬</div>
              <h4 className="text-indigo-300 font-medium mb-2">Conversational Intake</h4>
              <p className="text-indigo-400/70 text-sm">
                Natural dialogue, not forms. Feels like talking to you.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="text-indigo-300 font-medium mb-2">Your Aesthetic</h4>
              <p className="text-indigo-400/70 text-sm">
                Aether-themed design that matches your cosmic sensibility
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔄</div>
              <h4 className="text-indigo-300 font-medium mb-2">Ongoing Stewardship</h4>
              <p className="text-indigo-400/70 text-sm">
                We maintain, update, and evolve with your practice
              </p>
            </div>
          </div>
        </div>

        {/* Investment */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 mb-12">
          <h3 className="text-2xl text-purple-200 mb-4">Partnership Investment</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl text-purple-300 font-light">$300-800</span>
            <span className="text-purple-400/70">/month</span>
          </div>
          <ul className="space-y-2 text-purple-300/80 text-sm mb-6">
            <li>✓ Complete platform build & design</li>
            <li>✓ Hosting & technical infrastructure</li>
            <li>✓ Ongoing support & evolution</li>
            <li>✓ Monthly collaboration calls</li>
            <li>✓ 10% flows to community care</li>
          </ul>
          <p className="text-purple-400/60 text-xs italic">
            Sliding scale available based on your practice size and needs
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-full border border-indigo-500/30 transition-all"
          >
            Back to Chart
          </button>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-medium transition-all flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Experience Again
          </button>
        </div>
      </div>
    </motion.div>
  );
}
