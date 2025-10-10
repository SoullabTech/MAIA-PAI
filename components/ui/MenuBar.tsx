'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Users, Brain, MessageSquare, Settings } from 'lucide-react';

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

      {/* Mobile-First: Full Menu Bar - Positioned left of sign out button */}
      <div className="flex fixed right-16 z-50 items-center gap-2 md:gap-3" style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 0.75rem)' }}>
      {/* MAIA Training Progress Icon */}
      <Link
        href="/maya/training"
        className="group relative"
        aria-label="MAIA Training Progress"
      >
        <div className="relative p-2 md:p-3 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 hover:bg-amber-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-amber-500/40 animate-pulse-subtle">
          <Brain className="w-4 h-4 md:w-5 md:h-5 text-amber-400 transition-transform group-active:rotate-12" />

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

          {/* Tooltip */}
          <span className="absolute -bottom-10 right-0 bg-black/80 backdrop-blur-sm text-amber-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            MAIA Training {Math.round(trainingProgress * 100)}%
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
          <div className="p-2 md:p-3 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 hover:bg-indigo-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-indigo-500/40">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 transition-transform group-active:scale-110" />

            {/* Tooltip */}
            <span className="absolute -bottom-10 right-0 bg-black/80 backdrop-blur-sm text-indigo-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Soul-Building Circle
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
        <div className="p-2 md:p-3 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 hover:bg-cyan-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-cyan-500/40">
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 transition-all group-active:rotate-[-10deg]" />

          {/* Tooltip */}
          <span className="absolute -bottom-10 right-0 bg-black/80 backdrop-blur-sm text-cyan-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Conversation Mode
          </span>
        </div>
      </Link>

      {/* Settings */}
      <Link
        href="/settings"
        className="group relative"
        aria-label="Settings"
      >
        <div className="p-2 md:p-3 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 hover:bg-amber-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-amber-500/40">
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-amber-400 transition-all group-active:rotate-90" />

          {/* Tooltip */}
          <span className="absolute -bottom-10 right-0 bg-black/80 backdrop-blur-sm text-amber-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
        <div className="p-2 md:p-3 rounded-full bg-neutral-400/20 backdrop-blur-md border border-neutral-400/30 hover:bg-neutral-400/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-neutral-400/40">
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-neutral-300 transition-all group-active:scale-110 group-active:rotate-12" />

          {/* Tooltip */}
          <span className="absolute -bottom-10 right-0 bg-black/80 backdrop-blur-sm text-neutral-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Beta Feedback
          </span>
        </div>
      </button>
      </div>
    </>
  );
}
