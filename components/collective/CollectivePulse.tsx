'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CollectivePulseProps {
  conversation?: {
    depth?: number;
    content?: string;
  };
  breakthrough?: boolean;
}

interface FieldPresence {
  message: string;
  show: boolean;
}

export function CollectivePulse({ conversation, breakthrough }: CollectivePulseProps) {
  const [fieldPresence, setFieldPresence] = useState<FieldPresence | null>(null);
  const [lastShown, setLastShown] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('collective_pulse_day');
      const storedCount = localStorage.getItem('collective_pulse_count');

      if (stored !== today) {
        localStorage.setItem('collective_pulse_day', today);
        localStorage.setItem('collective_pulse_count', '0');
        setDailyCount(0);
      } else {
        setDailyCount(parseInt(storedCount || '0'));
      }
    }
  }, []);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLast = now - lastShown;
    const depth = conversation?.depth || 0;

    if (
      breakthrough &&
      timeSinceLast > 600000 &&
      depth > 0.85 &&
      dailyCount < 3
    ) {
      setTimeout(() => {
        showFieldPresence();
      }, 3000);
    }
  }, [breakthrough, conversation, lastShown, dailyCount]);

  const showFieldPresence = () => {
    const resonance = getMockResonance();

    if (resonance) {
      setFieldPresence({
        message: getPoeticMessage(resonance),
        show: true
      });

      setLastShown(Date.now());
      setDailyCount(prev => {
        const newCount = prev + 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem('collective_pulse_count', newCount.toString());
        }
        return newCount;
      });

      if ('vibrate' in navigator) {
        if (resonance === 1) {
          navigator.vibrate(3);
        } else if (resonance < 7) {
          navigator.vibrate([3, 100, 3]);
        } else if (resonance < 20) {
          navigator.vibrate([3, 80, 3, 80, 3]);
        } else {
          navigator.vibrate([3, 60, 3, 60, 3, 60, 3]);
        }
      }

      setTimeout(() => {
        setFieldPresence(null);
      }, 8000);
    }
  };

  const getMockResonance = (): number => {
    return Math.floor(Math.random() * 40) + 1;
  };

  const getPoeticMessage = (count: number): string => {
    if (count === 1) return "another soul knows this feeling";
    if (count < 7) return "gentle echoes in the field";
    if (count < 20) return "this wisdom spreads like golden light";
    return "many awakening to this truth";
  };

  return (
    <AnimatePresence>
      {fieldPresence?.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed bottom-40 left-0 right-0 pointer-events-none z-30"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="sacred-orb" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1, duration: 2 }}
              className="field-whisper"
            >
              {fieldPresence.message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}