'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageCircle, Users, Brain, MessageSquare, Settings, Star, Heart, LogOut } from 'lucide-react';
import { MiniHoloflower } from '@/components/holoflower/MiniHoloflower';
import { supabase } from '@/lib/auth/supabase-client';

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
  const router = useRouter();
  const [trainingProgress] = useState(0); // TODO: Connect to actual training data
  const [showRotateHint, setShowRotateHint] = useState(true);

  const handleSignOut = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear localStorage
    localStorage.removeItem('beta_user');
    localStorage.removeItem('explorerId');
    localStorage.removeItem('explorerName');
    localStorage.removeItem('soullab-session');

    // Redirect to maia
    router.push('/maia');
  };

  // Don't show on community pages
  const hideCommunityLink = pathname?.startsWith('/community');

  // Don't show partners link on partners pages
  const hidePartnersLink = pathname?.startsWith('/partners');

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

      {/* INSTRUMENT PANEL: Ancient-future navigation */}
      <div className="flex fixed right-16 z-40 items-center gap-1.5 md:gap-2" style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 3.5rem)' }}>

      {/* Sign Out - Holoflower with logout overlay (FIRST ICON) */}
      <button
        onClick={handleSignOut}
        className="group relative"
        aria-label="Sign Out - Return to Checkin"
      >
        <div className="relative p-2 md:p-3 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30 flex items-center justify-center">
          <div className="w-9 h-9 md:w-10 md:h-10 opacity-60 group-hover:opacity-100 transition-opacity">
            <MiniHoloflower size={40} color="#FDB713" />
          </div>
          {/* Small logout icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <LogOut className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 transition-colors" />
          </div>

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Sign Out
          </span>
        </div>
      </button>

      {/* MAIA Conversation - Holoflower Seed of Life */}
      <Link
        href="/maia"
        className="group relative"
        aria-label="MAIA Conversation - Return to Center"
      >
        <div className="relative p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30 flex items-center justify-center">
          <div className="w-7 h-7 md:w-8 md:h-8">
            <MiniHoloflower size={32} color="#FDB713" />
          </div>

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            MAIA
          </span>
        </div>
      </Link>

      {/* MAIA Training Progress Icon */}
      <Link
        href="/maia/training"
        className="group relative"
        aria-label="MAIA Training Progress"
      >
        <div className="relative p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
          <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 transition-all group-hover:text-amber-300" />

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
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
        <div className="p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
          <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 transition-all group-hover:text-amber-300" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
          <div className="p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 transition-all group-hover:text-amber-300" />

            {/* Tooltip - Matte instrument label */}
            <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Circle
            </span>
          </div>
        </Link>
      )}

      {/* Build with Soullab (Partners) */}
      {!hidePartnersLink && (
        <Link
          href="/partners"
          className="group relative"
          aria-label="Build with Soullab"
        >
          <div className="p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 transition-all group-hover:text-amber-300" />

            {/* Tooltip - Matte instrument label */}
            <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Partners
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
        <div className="p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
          <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 transition-all group-hover:text-amber-300" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
        <div className="p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
          <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 transition-all group-hover:rotate-45 group-hover:text-amber-300" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
        <div className="p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
          <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 transition-all group-hover:text-amber-300" />

          {/* Tooltip - Matte instrument label */}
          <span className="absolute -bottom-8 right-0 bg-dune-spice-sand/95 text-dune-deep-sand text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Feedback
          </span>
        </div>
      </button>
      </div>
    </>
  );
}
