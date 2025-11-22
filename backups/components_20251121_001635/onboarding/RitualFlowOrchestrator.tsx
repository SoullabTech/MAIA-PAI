'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SacredSoulInduction from './SacredSoulInduction';
import PlatformOrientation from './PlatformOrientation';
import SageTealDaimonWelcome from './SageTealDaimonWelcome';

interface RitualFlowOrchestratorProps {
  onComplete: () => void;
}

type RitualPhase = 'gateway' | 'orientation' | 'welcome';

interface UserData {
  name: string;
  username: string;
  password: string;
}

export default function RitualFlowOrchestrator({ onComplete }: RitualFlowOrchestratorProps) {
  const [currentPhase, setCurrentPhase] = useState<RitualPhase>('gateway');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Phase transition handlers
  const handleGatewayComplete = (data: UserData) => {
    setUserData(data);
    setCurrentPhase('orientation');
  };

  const handleOrientationComplete = () => {
    setCurrentPhase('welcome');
  };

  const handleWelcomeComplete = () => {
    // Final transition to /maia
    onComplete();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sacred background that flows throughout all phases */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]" />

      {/* Phase-specific overlays for smooth transitions */}
      <AnimatePresence mode="wait">
        {currentPhase === 'gateway' && (
          <motion.div
            key="gateway-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-tr from-[#6EE7B7]/10 via-transparent to-[#4DB6AC]/15"
          />
        )}
        {currentPhase === 'orientation' && (
          <motion.div
            key="orientation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-tr from-[#9CA3AF]/10 via-transparent to-[#6EE7B7]/15"
          />
        )}
        {currentPhase === 'welcome' && (
          <motion.div
            key="welcome-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-tr from-[#6EE7B7]/15 via-[#4DB6AC]/10 to-[#A7D8D1]/20"
          />
        )}
      </AnimatePresence>

      {/* Sacred central light that flows throughout all phases */}
      <motion.div
        animate={{
          opacity: currentPhase === 'gateway' ? [0.2, 0.4, 0.2] :
                  currentPhase === 'orientation' ? [0.3, 0.6, 0.3] :
                  [0.4, 0.8, 0.4],
          scale: currentPhase === 'gateway' ? [0.8, 1.2, 0.8] :
                 currentPhase === 'orientation' ? [0.9, 1.4, 0.9] :
                 [1.0, 1.6, 1.0]
        }}
        transition={{
          duration: currentPhase === 'gateway' ? 8 :
                   currentPhase === 'orientation' ? 10 :
                   12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-emerald-50/20 via-[#6EE7B7]/15 to-transparent rounded-full blur-2xl"
      />

      {/* Phase components with smooth transitions */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentPhase === 'gateway' && (
            <motion.div
              key="gateway"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <SacredSoulInduction onComplete={handleGatewayComplete} />
            </motion.div>
          )}

          {currentPhase === 'orientation' && (
            <motion.div
              key="orientation"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <PlatformOrientation
                userName={userData?.name || "Explorer"}
                onComplete={handleOrientationComplete}
              />
            </motion.div>
          )}

          {currentPhase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <SageTealDaimonWelcome
                userName={userData?.name || "Explorer"}
                onComplete={handleWelcomeComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sacred progress indicator that flows throughout all phases */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-4">
          {/* Phase indicators */}
          {(['gateway', 'orientation', 'welcome'] as RitualPhase[]).map((phase, index) => {
            const isActive = phase === currentPhase;
            const isCompleted =
              (phase === 'gateway' && (currentPhase === 'orientation' || currentPhase === 'welcome')) ||
              (phase === 'orientation' && currentPhase === 'welcome');

            return (
              <motion.div
                key={phase}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  isActive
                    ? 'bg-[#6EE7B7] shadow-[0_0_20px_#6EE7B7]'
                    : isCompleted
                      ? 'bg-[#4DB6AC]/80'
                      : 'bg-white/20'
                }`}
                animate={{
                  scale: isActive ? [1, 1.5, 1] : 1,
                  opacity: isActive ? [0.8, 1, 0.8] : isCompleted ? 0.8 : 0.4
                }}
                transition={{
                  duration: isActive ? 3 : 0.5,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
            );
          })}

          {/* Sacred connecting lines */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-[#6EE7B7]/30 via-[#4DB6AC]/20 to-[#6EE7B7]/30 -z-10" />
        </div>

        {/* Phase name indicator */}
        <motion.p
          key={currentPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center text-white/60 text-xs mt-3 font-light"
          style={{
            fontFamily: '"Cormorant Garamond", "EB Garamond", "Crimson Text", Georgia, serif',
          }}
        >
          {currentPhase === 'gateway' && 'Sacred Gateway'}
          {currentPhase === 'orientation' && 'Consciousness Orientation'}
          {currentPhase === 'welcome' && 'Daimon Welcome'}
        </motion.p>
      </motion.div>
    </div>
  );
}