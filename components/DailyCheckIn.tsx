"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGreeting, type GreetingData } from '@/lib/services/greetingService';
import { PatternRecognitionService } from '@/lib/services/patternService';

interface DailyCheckInProps {
  userName: string;
  userId: string;
  lastVisit?: Date;
  lastConversationTheme?: string;
  hasHadBreakthrough?: boolean;
  onStartConversation?: () => void;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  userName,
  userId,
  lastVisit,
  lastConversationTheme,
  hasHadBreakthrough = false,
  onStartConversation
}) => {
  const [greeting, setGreeting] = useState<GreetingData | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [daysSince, setDaysSince] = useState(0);

  useEffect(() => {
    calculateVisitContext();
    generateDailyGreeting();
  }, [userName, lastVisit]);

  const calculateVisitContext = () => {
    if (!lastVisit) {
      setIsFirstVisit(true);
      setDaysSince(0);
      return;
    }

    const now = new Date();
    const lastVisitDate = new Date(lastVisit);
    const diffMs = now.getTime() - lastVisitDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    setIsFirstVisit(false);
    setDaysSince(diffDays);
  };

  const generateDailyGreeting = () => {
    const greetingData = generateGreeting({
      userName,
      isFirstVisit,
      daysSinceLastVisit: daysSince,
      lastConversationTheme,
      hasHadBreakthrough
    });

    setGreeting(greetingData);
  };

  if (!greeting) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Greeting Header */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-light text-white/90"
          >
            {getTimeBasedGreeting()}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/60 font-light"
          >
            {greeting.greeting}
          </motion.div>
        </div>

        {/* Alchemical Phase Indicator (if present) */}
        <AnimatePresence>
          {greeting.alchemicalFraming && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 text-sm text-white/40"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <span>Current phase: {greeting.alchemicalFraming}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Start Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4"
        >
          <QuickStartCard
            title="Continue exploring"
            description="Pick up where we left off"
            icon="🔬"
            onClick={onStartConversation}
          />
          <QuickStartCard
            title="New experiment"
            description="Start fresh investigation"
            icon="✨"
            onClick={onStartConversation}
          />
        </motion.div>

        {/* Lab Stats (subtle) */}
        {!isFirstVisit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="pt-6 border-t border-white/5"
          >
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span>Lab partner since {formatDate(lastVisit)}</span>
              {daysSince > 0 && <span>• Last session {daysSince}d ago</span>}
              {hasHadBreakthrough && (
                <span className="text-amber-400/40">• Recent breakthrough</span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const QuickStartCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
}> = ({ title, description, icon, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
    >
      <span className="text-2xl">{icon}</span>
      <div className="space-y-1">
        <div className="text-sm font-medium text-white/80">{title}</div>
        <div className="text-xs text-white/40">{description}</div>
      </div>
    </motion.button>
  );
};

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good evening';
}

function formatDate(date?: Date): string {
  if (!date) return 'recently';

  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}