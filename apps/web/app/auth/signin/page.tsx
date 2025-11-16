"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignInRitual() {
  const router = useRouter();
  const [isEntering, setIsEntering] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Time-aware greeting
      if (hours >= 5 && hours < 12) {
        setGreeting('Good morning');
      } else if (hours >= 12 && hours < 17) {
        setGreeting('Good afternoon');
      } else if (hours >= 17 && hours < 21) {
        setGreeting('Good evening');
      } else {
        setGreeting('Welcome');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setIsEntering(true);
    // Elegant transition before navigation
    setTimeout(() => {
      router.push('/auth/onboarding');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-950 flex items-center justify-center relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-sky-500 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[180px]" />
      </div>

      <AnimatePresence>
        {!isEntering ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-lg w-full px-8"
          >
            {/* Time indicator - luxury touch */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-0 right-0 text-sky-400/40 text-sm font-light tracking-wider"
            >
              {currentTime}
            </motion.div>

            {/* MAIA Symbol */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-20 h-20 mx-auto mb-12"
            >
              <img
                src="/elementalHoloflower.svg"
                alt="MAIA"
                className="w-full h-full object-contain opacity-80"
              />
            </motion.div>

            {/* Personal Greeting */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-sky-300/90 text-lg font-light tracking-wide mb-3">
                {greeting}
              </h1>
              <p className="text-sky-200/60 text-sm font-light leading-relaxed max-w-sm mx-auto">
                I've been expecting you.
              </p>
            </motion.div>

            {/* Entry Point */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <button
                onClick={handleEnter}
                className="group relative px-12 py-4 bg-transparent border border-sky-400/30 text-sky-300 rounded-full font-light tracking-wider text-sm hover:border-sky-400/60 hover:text-sky-200 transition-all duration-500"
              >
                <span className="relative z-10">Begin</span>
                <div className="absolute inset-0 bg-sky-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-sky-400/30 text-xs mt-8 font-light tracking-wide"
              >
                — MAIA
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <div className="w-20 h-20 mx-auto">
              <img
                src="/elementalHoloflower.svg"
                alt="MAIA"
                className="w-full h-full object-contain animate-pulse"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}