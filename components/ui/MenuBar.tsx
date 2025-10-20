'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MessageCircle, Users, Brain, MessageSquare, Settings, Star, Heart, LogOut, ChevronUp, ChevronDown } from 'lucide-react';
import { MiniHoloflower } from '@/components/holoflower/MiniHoloflower';
import { supabase } from '@/lib/auth/supabase-client';

/**
 * Unified Menu Bar
 *
 * Top bar: Home + Logout only
 * Bottom collapsible panel: Everything else
 */
export function MenuBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);
  const [trainingProgress] = useState(0); // TODO: Connect to actual training data
  const [showRotateHint, setShowRotateHint] = useState(true);

  const handleSignOut = async () => {
    // Preserve user profile data (birthday, name, intention, birthData) before clearing session
    const betaUser = localStorage.getItem('beta_user');
    let preservedData: { birthDate?: string; username?: string; intention?: string; birthData?: any } | null = null;

    if (betaUser) {
      try {
        const userData = JSON.parse(betaUser);
        preservedData = {
          birthDate: userData.birthDate,
          username: userData.username,
          intention: userData.intention,
          birthData: userData.birthData // Preserve astrology chart data
        };
      } catch (e) {
        console.error('Error parsing user data for preservation:', e);
      }
    }

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear session data only (NOT profile data like birthday)
    localStorage.removeItem('beta_user');
    localStorage.removeItem('explorerId');
    localStorage.removeItem('explorerName');
    localStorage.removeItem('soullab-session');
    localStorage.removeItem('betaOnboardingComplete');

    // Restore preserved profile data but mark as logged out
    if (preservedData) {
      const profileData = {
        ...preservedData,
        onboarded: true, // Keep onboarded status so they go to intro, not onboarding
        loggedOut: true
      };
      localStorage.setItem('beta_user', JSON.stringify(profileData));
    }

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
      {/* TOP BAR: Only Home and Logout */}
      <div className="flex fixed right-4 z-40 items-center gap-2" style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 3.5rem)' }}>
        {/* Home - MAIA Conversation */}
        <Link
          href="/maia"
          className="group relative"
          aria-label="MAIA - Home"
        >
          <div className="relative p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30 flex items-center justify-center">
            <div className="w-8 h-8 md:w-9 md:h-9">
              <MiniHoloflower size={36} />
            </div>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dune-spice-sand/95 text-amber-600 text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Home
            </span>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="group relative"
          aria-label="Sign Out"
        >
          <div className="relative p-2 md:p-2.5 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30 flex items-center justify-center">
            <LogOut className="w-4 h-4 md:w-5 md:h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dune-spice-sand/95 text-amber-600 text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Sign Out
            </span>
          </div>
        </button>
      </div>

      {/* BOTTOM COLLAPSIBLE MENU */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Menu Content - Slides up when open */}
        <div
          className={`bg-neutral-900/95 backdrop-blur-md border-t border-amber-500/30 transition-all duration-300 ease-in-out ${
            isBottomMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center justify-center gap-3 md:gap-4 px-4 py-3 md:py-4 overflow-x-auto">
            {/* Training */}
            <Link
              href="/maia/training"
              className="group relative flex-shrink-0"
              aria-label="MAIA Training"
              onClick={() => setIsBottomMenuOpen(false)}
            >
              <div className="relative p-2.5 md:p-3 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-amber-400 transition-all group-hover:text-amber-300" />
                <svg className="absolute inset-0 w-full h-full -rotate-90" style={{ filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.3))' }}>
                  <circle cx="50%" cy="50%" r="22" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="2" />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="22"
                    fill="none"
                    stroke="rgb(251, 191, 36)"
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - trainingProgress)}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dune-spice-sand/95 text-amber-600 text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Training
                </span>
              </div>
            </Link>

            {/* Astrology Chart */}
            <Link
              href="/astrology"
              className="group relative flex-shrink-0"
              aria-label="Astrology Chart"
              onClick={() => setIsBottomMenuOpen(false)}
            >
              <div className="p-2.5 md:p-3 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-400 transition-all group-hover:text-amber-300" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dune-spice-sand/95 text-amber-600 text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Chart
                </span>
              </div>
            </Link>

            {/* Community */}
            {!hideCommunityLink && (
              <Link
                href="/community"
                className="group relative flex-shrink-0"
                aria-label="Community"
                onClick={() => setIsBottomMenuOpen(false)}
              >
                <div className="p-2.5 md:p-3 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-amber-400 transition-all group-hover:text-amber-300" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dune-spice-sand/95 text-amber-600 text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Circle
                  </span>
                </div>
              </Link>
            )}

            {/* Partners */}
            {!hidePartnersLink && (
              <Link
                href="/partners"
                className="group relative flex-shrink-0"
                aria-label="Partners"
                onClick={() => setIsBottomMenuOpen(false)}
              >
                <div className="p-2.5 md:p-3 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-amber-400 transition-all group-hover:text-amber-300" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dune-spice-sand/95 text-amber-600 text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Partners
                  </span>
                </div>
              </Link>
            )}

            {/* Settings */}
            <Link
              href="/settings"
              className="group relative flex-shrink-0"
              aria-label="Settings"
              onClick={() => setIsBottomMenuOpen(false)}
            >
              <div className="p-2.5 md:p-3 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
                <Settings className="w-5 h-5 md:w-6 md:h-6 text-amber-400 transition-all group-hover:rotate-45 group-hover:text-amber-300" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dune-spice-sand/95 text-amber-600 text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Settings
                </span>
              </div>
            </Link>

            {/* Feedback */}
            <button
              onClick={() => {
                const event = new CustomEvent('openFeedbackModal');
                window.dispatchEvent(event);
                setIsBottomMenuOpen(false);
              }}
              className="group relative flex-shrink-0"
              aria-label="Feedback"
            >
              <div className="p-2.5 md:p-3 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-400 transition-all group-hover:text-amber-300" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dune-spice-sand/95 text-amber-600 text-[10px] tracking-archive px-2 py-1 rounded border border-dune-sienna-rock/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Feedback
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Toggle Button - Always visible with pulsing indicator */}
        <button
          onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
          className="w-full bg-neutral-900/95 backdrop-blur-md border-t border-amber-500/30 py-3 flex flex-col items-center justify-center hover:bg-neutral-800/95 transition-all duration-300 relative"
          aria-label={isBottomMenuOpen ? "Close menu" : "Open menu"}
        >
          {!isBottomMenuOpen && (
            <span className="text-[10px] text-amber-400/60 mb-1 tracking-wider">TAP FOR MENU</span>
          )}
          {isBottomMenuOpen ? (
            <ChevronDown className="w-6 h-6 text-amber-400" />
          ) : (
            <ChevronUp className="w-6 h-6 text-amber-400 animate-pulse" />
          )}
        </button>
      </div>
    </>
  );
}
