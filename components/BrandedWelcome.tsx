import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandedWelcomeProps {
  userName?: string;
  isReturning?: boolean;
  onComplete?: () => void;
}

export const BrandedWelcome: React.FC<BrandedWelcomeProps> = ({
  userName,
  isReturning = false,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-hide after 5 minutes or delayed after first interaction
  useEffect(() => {
    // Set up auto-hide timer (1 minute)
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 60000); // 1 minute

    // Set up interaction listener
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Fade out 5 seconds after first interaction
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 5000);
      }
    };

    // Listen for user interactions
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted, onComplete]);

  // Determine the welcome message - matching your branding language
  const getMessage = () => {
    if (userName) {
      if (isReturning) {
        // Returning user messages
        const messages = [
          <>
            <span className="text-amber-400">⭐</span> {userName} returns to the soul mirror
          </>,
          <>
            <span className="text-amber-400">🔥</span> Welcome back, {userName}
          </>,
          <>
            <span className="text-amber-400">✨</span> {userName}, your soul journey continues
          </>
        ];
        return messages[Math.floor(Math.random() * messages.length)];
      }
      // First time messages
      return (
        <>
          <span className="text-amber-400">🔥</span> Welcome, {userName}
        </>
      );
    }
    // Generic welcome
    return (
      <>
        <span className="text-amber-400">✨</span> Welcome to your soulful journey
      </>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
          className="fixed top-4 sm:top-[18vh] left-1/2 transform -translate-x-1/2 z-40
                     pointer-events-none select-none"
        >
          <div className="relative">
            {/* Dark amber glow effect */}
            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-amber-900/30 via-amber-700/20 to-amber-900/30
                          scale-150 animate-pulse hidden sm:block" />

            {/* Main message container - soulful dark aesthetic - COMPACT on mobile */}
            <div className="relative bg-black/80 backdrop-blur-xl border border-amber-900/40
                          rounded-2xl px-4 py-2 sm:px-10 sm:py-4 shadow-2xl"
                 style={{
                   background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(92,51,23,0.2) 50%, rgba(0,0,0,0.9) 100%)',
                   boxShadow: '0 20px 40px rgba(146,64,14,0.3), inset 0 0 20px rgba(217,119,6,0.1)'
                 }}>
              <motion.h2
                className="text-sm sm:text-xl md:text-2xl font-light tracking-wider text-amber-100
                         flex items-center gap-2"
                animate={{
                  textShadow: [
                    "0 0 15px rgba(217, 119, 6, 0.4)",
                    "0 0 30px rgba(180, 83, 9, 0.6)",
                    "0 0 15px rgba(217, 119, 6, 0.4)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {getMessage()}
              </motion.h2>

              {/* Subtitle with CHANGE OUR WORLD TO SOUL prominent - HIDDEN on mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-2 hidden sm:block"
              >
                <p className="text-sm font-medium tracking-[0.3em] text-transparent bg-clip-text
                           bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600">
                  CHANGING THE WORLD TO SOUL
                </p>
                <p className="text-xs text-amber-200/50 mt-1">
                  {isReturning
                    ? "Your soulful journey continues"
                    : "Soul Beta Experience • 31 Consciousness Pioneers"
                  }
                </p>
              </motion.div>
            </div>

            {/* Soulful geometry decoration - dark amber */}
            <svg
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 text-amber-700/60"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandedWelcome;