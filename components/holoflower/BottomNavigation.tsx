'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, Moon, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { QuickSettingsSheet } from '../QuickSettingsSheet';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  color: string;
  action?: () => void;
}

const createNavItems = (onSettingsClick: () => void): NavItem[] => [
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: '/',
    color: '#D4B896',
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: '/journal',
    color: '#4A90E2',
  },
  {
    id: 'dream',
    label: 'Dream',
    icon: <Moon className="w-4 h-4 sm:w-5 sm:h-5" />,
    path: '/dream',
    color: '#E5C9A6',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
    color: '#F59E0B',
    action: onSettingsClick,
  },
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsOpen = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    setSettingsOpen(true);
  };

  const navItems = createNavItems(handleSettingsOpen);

  const handleNavClick = (item: NavItem) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (item.action) {
      item.action();
    } else if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="flex items-center justify-around px-2 sm:px-4 py-1 sm:py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="relative flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 min-w-[50px] sm:min-w-[60px]"
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: `${item.color}20` }}
                  />
                )}

                <motion.div
                  animate={{
                    color: isActive ? item.color : '#FCD34D',
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ color: isActive ? item.color : '#FCD34D' }}
                >
                  {item.icon}
                </motion.div>

                <motion.span
                  animate={{
                    color: isActive ? item.color : '#FCD34D',
                  }}
                  className="text-[10px] sm:text-xs font-light"
                  style={{ color: isActive ? item.color : '#FCD34D' }}
                >
                  {item.label}
                </motion.span>

                {item.id === 'settings' && (
                  <motion.div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      scaleX: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <QuickSettingsSheet isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}