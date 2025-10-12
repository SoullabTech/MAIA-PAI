'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Users, Brain, MessageSquare, Settings, Sparkles, Star } from 'lucide-react';

/**
 * Unified Menu Bar
 *
 * Contains all menu icons:
 * - MAIA Training Progress
 * - Soul-Building Circle (Community)
 * - Conversation Style Toggle
 * - Report a Problem (Feedback)
 */
export function MenuBar() {
  const pathname = usePathname();
  const [trainingProgress] = useState(0); // TODO: Connect to actual training data
  const [showRotateHint, setShowRotateHint] = useState(true);

  // Don't show on community pages
  const hideCommunityLink = pathname?.startsWith('/community');

  useEffect(() => {
    // Auto-hide rotate hint after 5 seconds, or if already dismissed
    const hintDismissed = localStorage.getItem('rotateHintDismissed');
    if (hintDismissed) {
      setShowRotateHint(false);
    } else {
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
      {/* Rotate Device Hint - Only on Mobile Portrait */}
      {showRotateHint && (
        <div className="md:hidden fixed right-4 z-40 animate-fade-in" style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 3.5rem)' }}>
          <div className="bg-gradient-to-r from-cyan-500/90 to-indigo-500/90 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-white/20">
            <span className="text-base">📱</span>
            <span>Rotate for full menu</span>
            <button
              onClick={dismissRotateHint}
              className="ml-1 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* INSTRUMENT PANEL: Ancient-future navigation - Positioned left of sign out button */}
      <div className="flex fixed right-16 z-40 items-center gap-1.5 md:gap-2" style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 0.75rem)' }}>
      {/* MAIA Training Progress Icon */}
      <Link
        href="/maya/training"
        className="group relative"
        aria-label="MAIA Training Progress"
      >
        <div className="relative p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-soul-accent/40">
          <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-soul-accent/70 transition-all group-hover:text-soul-accent" />

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
          <span className="absolute -bottom-8 right-0 bg-soul-surface/95 text-soul-textTertiary text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
          <span className="absolute -bottom-8 right-0 bg-soul-surface/95 text-soul-textTertiary text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chart
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
          <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-soul-waterWarm/40">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-soul-waterWarm/70 transition-all group-hover:text-soul-waterWarm" />

            {/* Tooltip - Matte instrument label */}
            <span className="absolute -bottom-8 right-0 bg-soul-surface/95 text-soul-textTertiary text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
        <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-soul-link/40">
          <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 text-soul-link/70 transition-all group-hover:text-soul-link" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-soul-surface/95 text-soul-textTertiary text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Mode
          </span>
        </div>
      </Link>

      {/* Settings */}
      <Link
        href="/settings"
        className="group relative"
        aria-label="Settings"
      >
        <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-soul-accent/40">
          <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-soul-accent/70 transition-all group-hover:text-soul-accent group-hover:rotate-45" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-soul-surface/95 text-soul-textTertiary text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Settings
          </span>
        </div>
      </Link>

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
        <div className="p-2 md:p-2.5 rounded-md bg-soul-surface/80 border border-soul-border/50 hover:bg-soul-surfaceHover transition-all duration-300 hover:border-soul-textTertiary/40">
          <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-soul-textTertiary/70 transition-all group-hover:text-soul-textTertiary" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-soul-surface/95 text-soul-textTertiary text-[10px] tracking-archive px-2 py-1 rounded border border-soul-borderSubtle/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Feedback
          </span>
        </div>
      </button>
      </div>
    </>
  );
}
