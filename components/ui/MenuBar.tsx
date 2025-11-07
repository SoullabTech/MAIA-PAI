'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Users, Brain, MessageSquare, Settings, Sparkles, Star, Home, BookOpen, Gem, Zap, Layers } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * Unified Menu Bar
 *
 * Bottom navigation bar with menu icons:
 * - Home (Holoflower icon)
 * - MAIA Training Progress
 * - Astrology Chart
 * - Soul-Building Circle (Community)
 * - Conversation Mode
 * - Settings
 * - Report a Problem (Feedback)
 */
export function MenuBar() {
  // DISABLED: MenuBar functionality moved to SacredLabDrawer in OracleConversation
  // This component is being phased out in favor of the contextual drawer menu
  console.log('⚠️ MenuBar rendered but disabled - functionality moved to SacredLabDrawer');
  return null;

  const pathname = usePathname();
  const [trainingProgress] = useState(0); // TODO: Connect to actual training data
  const [showRotateHint, setShowRotateHint] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Don't show on community pages
  const hideCommunityLink = pathname?.startsWith('/community');

  useEffect(() => {
    setIsMounted(true);
    // Auto-hide rotate hint after 5 seconds, or if already dismissed
    const hintDismissed = localStorage.getItem('rotateHintDismissed');
    if (!hintDismissed) {
      setShowRotateHint(true);
      const timer = setTimeout(() => {
        setShowRotateHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissRotateHint = () => {
    setShowRotateHint(false);
    localStorage.setItem('rotateHintDismissed', 'true');
  };

  return (
    <>
      {/* REMOVED: Rotate Device Hint - no longer needed since bottom navigation is disabled */}

      {/* REMOVED: Drawer handle indicator - no longer needed since bottom navigation components are disabled */}

      {/* INSTRUMENT PANEL: Ancient-future navigation - Bottom menu bar */}
      <div className="flex fixed left-1/2 -translate-x-1/2 bottom-0 z-40 items-center gap-1.5 md:gap-3 bg-soul-surface/95 backdrop-blur-md border-t border-soul-border/50 px-4 md:px-6 py-3 md:py-4 rounded-t-2xl shadow-lg" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>

      {/* Home Icon - Holoflower */}
      <Link
        href="/maya"
        className="group relative"
        aria-label="Home"
      >
        <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-soul-accent/60">
          <div className="w-3.5 h-3.5 md:w-4 md:h-4 relative">
            <Image
              src="/holoflower.svg"
              alt="Home"
              width={16}
              height={16}
              className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soul-surface/95 text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: '#E8C99B' }}>
            Home
          </span>
        </div>
      </Link>

      {/* MAIA Training Progress Icon */}
      <Link
        href="/maia/training"
        className="group relative"
        aria-label="MAIA Training Progress"
      >
        <div className="relative p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-amber-500/40">
          <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500/70 transition-all group-hover:text-amber-500" />

          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" style={{ filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.3))' }}>
            <circle
              cx="50%"
              cy="50%"
              r="18"
              fill="none"
              stroke="rgba(251, 191, 36, 0.2)"
              strokeWidth="2"
            />
            <circle
              cx="50%"
              cy="50%"
              r="18"
              fill="none"
              stroke="rgb(251, 191, 36)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - trainingProgress)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soul-surface/95 text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: '#E8C99B' }}>
            Training {Math.round(trainingProgress * 100)}%
          </span>
        </div>
      </Link>


      {/* Astrology Chart */}
      <Link
        href="/astrology"
        className="group relative"
        aria-label="Astrology Chart"
      >
        <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-amber-500/40">
          <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500/70 transition-all group-hover:text-amber-500" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soul-surface/95 text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: '#E8C99B' }}>
            Chart
          </span>
        </div>
      </Link>

      {/* Akashic Records - Sacred Geometry */}
      <Link
        href="/akashic-records"
        className="group relative"
        aria-label="Akashic Records"
      >
        <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-cyan-500/40">
          <Gem className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500/70 transition-all group-hover:text-cyan-500" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soul-surface/95 text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: '#E8C99B' }}>
            Records
          </span>
        </div>
      </Link>

      {/* Soul-Building Circle (Community) */}
      {!hideCommunityLink && (
        <Link
          href="/community"
          className="group relative"
          aria-label="Soul-Building Circle"
        >
          <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-amber-500/40">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500/70 transition-all group-hover:text-amber-500" />

            {/* Tooltip - Matte instrument label */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soul-surface/95 text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: '#E8C99B' }}>
              Circle
            </span>
          </div>
        </Link>
      )}

      {/* Conversation Mode - Links to Settings */}
      <Link
        href="/settings"
        className="group relative"
        aria-label="Conversation Mode"
      >
        <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-amber-500/40">
          <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500/70 transition-all group-hover:text-amber-500" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soul-surface/95 text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: '#E8C99B' }}>
            Mode
          </span>
        </div>
      </Link>

      {/* Brain Trust / Settings Dropdown */}
      <div className="relative group">
        <button
          onClick={() => {
            // Toggle dropdown menu
            const dropdown = document.getElementById('brain-trust-dropdown');
            if (dropdown) {
              dropdown.classList.toggle('hidden');
            }
          }}
          className="relative"
          aria-label="Settings & Brain Trust"
        >
          <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-amber-500/40">
            <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500/70 transition-all group-hover:text-amber-500 group-hover:rotate-45" />

            {/* Brain Trust indicator dot */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-soul-surface" />

            {/* Tooltip - Matte instrument label */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soul-surface/95 text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: '#E8C99B' }}>
              Settings
            </span>
          </div>
        </button>

        {/* Dropdown Menu */}
        <div
          id="brain-trust-dropdown"
          className="hidden absolute bottom-full mb-2 right-0 bg-soul-surface/95 backdrop-blur-md border border-soul-border/50 rounded-lg shadow-lg p-2 min-w-[180px]"
        >
          <Link
            href="/whats-new"
            className="block px-3 py-2 text-sm text-soul-textSecondary hover:bg-soul-surfaceHover rounded-md transition-colors relative"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-spice-orange" />
              <span>What's New</span>
              <span className="ml-auto px-1.5 py-0.5 bg-spice-orange/20 border border-spice-orange/50 rounded text-[10px] text-spice-orange">NEW</span>
            </div>
          </Link>
          <Link
            href="/features"
            className="block px-3 py-2 text-sm text-soul-textSecondary hover:bg-soul-surfaceHover rounded-md transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>All Features</span>
            </div>
          </Link>
          <Link
            href="/learn"
            className="block px-3 py-2 text-sm text-soul-textSecondary hover:bg-soul-surfaceHover rounded-md transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-bene-gesserit-gold" />
              <span>Deep Dives</span>
            </div>
          </Link>
          <div className="my-1 h-px bg-soul-border/30" />
          <Link
            href="/settings"
            className="block px-3 py-2 text-sm text-soul-textSecondary hover:bg-soul-surfaceHover rounded-md transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </Link>
          <Link
            href="/brain-trust"
            className="block px-3 py-2 text-sm text-soul-textSecondary hover:bg-soul-surfaceHover rounded-md transition-colors"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Brain Trust</span>
            </div>
          </Link>
          <Link
            href="/consciousness/claude-code"
            className="block px-3 py-2 text-sm text-soul-textSecondary hover:bg-soul-surfaceHover rounded-md transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Claude Code</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Report a Problem (Feedback) */}
      <button
        onClick={() => {
          // Trigger feedback modal
          const event = new CustomEvent('openFeedbackModal');
          window.dispatchEvent(event);
        }}
        className="group relative"
        aria-label="Report a Problem"
      >
        <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-amber-500/40">
          <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500/70 transition-all group-hover:text-amber-500" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-soul-surface/95 text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ color: '#E8C99B' }}>
            Feedback
          </span>
        </div>
      </button>
      </div>
    </>
  );
}
