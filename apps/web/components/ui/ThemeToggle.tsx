'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [previousTheme, setPreviousTheme] = useState<string | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    setPreviousTheme(theme || 'system');
  }, []);

  // Log theme changes to API endpoint (no direct Supabase import)
  const logThemeChange = async (newTheme: string) => {
    try {
      await fetch('/api/user/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: newTheme,
          previous: previousTheme,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.warn('Failed to log theme change:', error);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    logThemeChange(newTheme);
    setPreviousTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => handleThemeChange('light')}
        className={`p-2 rounded-full border transition-all duration-200
                   ${theme === 'light'
                     ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30'
                     : 'border-amber-700/30 dark:border-amber-500/30 bg-amber-900/10 dark:bg-amber-900/10'
                   } shadow-md hover:shadow-lg`}
        aria-label="Light mode"
      >
        <Sun
          className="w-5 h-5"
          style={{ color: theme === 'light' ? '#D97706' : '#FEF3C7' }}
        />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => handleThemeChange('dark')}
        className={`p-2 rounded-full border transition-all duration-200
                   ${theme === 'dark'
                     ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30'
                     : 'border-amber-700/30 dark:border-amber-500/30 bg-amber-900/10 dark:bg-amber-900/10'
                   } shadow-md hover:shadow-lg`}
        aria-label="Dark mode"
      >
        <Moon
          className="w-5 h-5"
          style={{ color: theme === 'dark' ? '#D97706' : '#FEF3C7' }}
        />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => handleThemeChange('system')}
        className={`p-2 rounded-full border transition-all duration-200
                   ${theme === 'system'
                     ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30'
                     : 'border-amber-700/30 dark:border-amber-500/30 bg-amber-900/10 dark:bg-amber-900/10'
                   } shadow-md hover:shadow-lg`}
        aria-label="System default"
      >
        <Monitor
          className="w-5 h-5"
          style={{ color: theme === 'system' ? '#D97706' : '#FEF3C7' }}
        />
      </motion.button>
    </div>
  );
}