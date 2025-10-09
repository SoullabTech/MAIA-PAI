'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ArrivalBreathProps {
  onComplete?: () => void;
  duration?: number;
}

export function ArrivalBreath({ onComplete, duration = 2000 }: ArrivalBreathProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="w-16 h-16 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212, 184, 150, 0.4), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}