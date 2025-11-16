'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

type CommunicationMode = 'Dialogue' | 'Patient' | 'Scribe';

export default function SimpleMaiaPage() {
  const [selectedMode, setSelectedMode] = useState<CommunicationMode>('Dialogue');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Holoflower animation states
  const [holoflowerPulse, setHoloflowerPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoloflowerPulse(prev => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-950 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-sky-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[150px]" />
      </div>

      {/* SOULLAB branding */}
      <div className="absolute top-8 left-8 z-10">
        <div className="text-sky-400/60 font-light text-sm tracking-widest">
          SOULLAB
        </div>
      </div>

      {/* Communication Mode Selection */}
      <div className="absolute top-8 right-8 z-10">
        <div className="flex gap-2">
          {(['Dialogue', 'Patient', 'Scribe'] as CommunicationMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-4 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                selectedMode === mode
                  ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50 shadow-lg'
                  : 'bg-sky-500/10 text-sky-300/70 border border-sky-400/20 hover:border-sky-400/40 hover:text-sky-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* MAIA Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-light text-sky-200 mb-4 tracking-wide">
            MAIA
          </h1>
        </motion.div>

        {/* Active Holoflower */}
        <motion.div
          className="relative w-32 h-32 mb-12"
          animate={{
            scale: holoflowerPulse === 1 ? 1.05 : holoflowerPulse === 2 ? 0.98 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="absolute inset-0">
            <img
              src="/elementalHoloflower.svg"
              alt="MAIA Holoflower"
              className="w-full h-full object-contain opacity-80"
            />
          </div>

          {/* Active pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-full h-full rounded-full border border-sky-400/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute w-3/4 h-3/4 rounded-full border border-sky-300/40"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
        </motion.div>

        {/* MAIA Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-2xl mb-12"
        >
          <div className="bg-sky-500/5 backdrop-blur-sm rounded-xl p-8 border border-sky-400/20">
            <p className="text-sky-200/90 text-lg leading-relaxed font-light">
              Welcome back, Explorer.
            </p>
            <p className="text-sky-200/90 text-lg leading-relaxed font-light mt-4">
              I'm here to listen and reflect with you.
            </p>
          </div>
        </motion.div>

        {/* Voice Activation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center space-y-6"
        >
          {/* Click to activate */}
          <div className="space-y-4">
            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`px-8 py-4 rounded-full font-light text-sm transition-all duration-300 ${
                isVoiceActive
                  ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 shadow-lg'
                  : 'bg-transparent border border-sky-400/30 text-sky-300 hover:border-sky-400/60 hover:text-sky-200'
              }`}
            >
              {isVoiceActive ? 'Voice Active' : 'Click to activate'}
            </button>

            {/* Voice controls when active */}
            <AnimatePresence>
              {isVoiceActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-6"
                >
                  {/* Microphone */}
                  <button
                    className="flex flex-col items-center gap-2 group"
                    onClick={() => {/* Handle mic toggle */}}
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                      <Mic className="w-5 h-5 text-sky-300" />
                    </div>
                    <span className="text-xs text-sky-400/60">Speak</span>
                  </button>

                  {/* Speaker */}
                  <button
                    className="flex flex-col items-center gap-2 group"
                    onClick={() => setIsSpeaking(!isSpeaking)}
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                      {isSpeaking ? (
                        <VolumeX className="w-5 h-5 text-sky-300" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-sky-300" />
                      )}
                    </div>
                    <span className="text-xs text-sky-400/60">
                      {isSpeaking ? 'Mute' : 'Listen'}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mode indicator */}
          <div className="text-center">
            <div className="text-xs text-sky-400/50 font-light">
              Mode: {selectedMode}
            </div>
          </div>
        </motion.div>

        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex items-center gap-2 text-sky-400/40 text-xs font-light">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400/60 animate-pulse" />
            <span>Ready for reflection</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}