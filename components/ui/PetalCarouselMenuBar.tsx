'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MessageCircle, Users, Brain, Settings, Star, Heart, LogOut,
  ChevronUp, ChevronDown, Menu, ArrowRight, Sparkles, Eye, Zap
} from 'lucide-react';
import { MiniHoloflower } from '@/components/holoflower/MiniHoloflower';
import { supabase } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';

/**
 * Petal Carousel Menu Bar
 *
 * Top: MAIA home + Logout only (minimal & clean!)
 * Bottom: Horizontal scrolling "petal carousel" with all navigation
 *
 * Innovation: Like sliding through flower petals - swipe to explore
 */
export function PetalCarouselMenuBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [trainingProgress] = useState(0);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(true); // Open by default so navigation is visible
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    const betaUser = localStorage.getItem('beta_user');
    let preservedData: { birthDate?: string; username?: string; intention?: string; birthData?: any } | null = null;

    if (betaUser) {
      try {
        const userData = JSON.parse(betaUser);
        preservedData = {
          birthDate: userData.birthDate,
          username: userData.username,
          intention: userData.intention,
          birthData: userData.birthData
        };
      } catch (e) {
        console.error('Error parsing user data for preservation:', e);
      }
    }

    await supabase.auth.signOut();

    localStorage.removeItem('beta_user');
    localStorage.removeItem('explorerId');
    localStorage.removeItem('explorerName');
    localStorage.removeItem('soullab-session');
    localStorage.removeItem('betaOnboardingComplete');

    if (preservedData) {
      const profileData = {
        ...preservedData,
        onboarded: true,
        loggedOut: true
      };
      localStorage.setItem('beta_user', JSON.stringify(profileData));
    }

    router.push('/maia');
  };

  const hideCommunityLink = pathname?.startsWith('/community');
  const hidePartnersLink = pathname?.startsWith('/partners');

  // Petal items - all navigation in one scrollable carousel
  const petalItems = [
    // Mode toggles
    {
      type: 'mode' as const,
      icon: MessageCircle,
      label: 'Dialogue',
      subtitle: 'Natural conversation',
      href: '/maia?mode=dialogue',
      color: 'amber'
    },
    {
      type: 'mode' as const,
      icon: Sparkles,
      label: 'Dream Weaver',
      subtitle: 'Pattern synthesis',
      href: '/maia?mode=dreamweaver',
      color: 'orange'
    },
    {
      type: 'mode' as const,
      icon: Eye,
      label: 'Patient',
      subtitle: 'Reflective witness',
      href: '/maia?mode=patient',
      color: 'purple'
    },
    {
      type: 'mode' as const,
      icon: Zap,
      label: 'Scientific',
      subtitle: 'Analytical mode',
      href: '/maia?mode=scientific',
      color: 'blue'
    },

    // Journey & Access Matrix
    {
      type: 'nav' as const,
      icon: Menu,
      label: 'Journey',
      subtitle: 'Your wisdom path',
      onClick: () => {
        const event = new CustomEvent('openJourneyDashboard');
        window.dispatchEvent(event);
        setIsBottomMenuOpen(false);
      },
      color: 'amber'
    },
    {
      type: 'nav' as const,
      icon: ArrowRight,
      label: 'Access Matrix',
      subtitle: 'Living gameboard',
      onClick: () => {
        const event = new CustomEvent('openAccessMatrix');
        window.dispatchEvent(event);
        setIsBottomMenuOpen(false);
      },
      color: 'amber',
      special: true // Special styling
    },

    // Regular navigation
    {
      type: 'nav' as const,
      icon: Brain,
      label: 'Training',
      subtitle: `${trainingProgress}% complete`,
      href: '/maia/training',
      showProgress: true,
      color: 'amber'
    },
    {
      type: 'nav' as const,
      icon: Star,
      label: 'Chart',
      subtitle: 'Your star map',
      href: '/astrology',
      color: 'amber'
    },
    ...(!hideCommunityLink ? [{
      type: 'nav' as const,
      icon: Users,
      label: 'Circle',
      subtitle: 'Community',
      href: '/community',
      color: 'amber'
    }] : []),
    ...(!hidePartnersLink ? [{
      type: 'nav' as const,
      icon: Heart,
      label: 'Partners',
      subtitle: 'Sacred bonds',
      href: '/partners',
      color: 'amber'
    }] : []),
    {
      type: 'nav' as const,
      icon: Settings,
      label: 'Settings',
      subtitle: 'Customize',
      href: '/settings',
      color: 'amber'
    },
    {
      type: 'nav' as const,
      icon: MessageCircle,
      label: 'Feedback',
      subtitle: 'Share thoughts',
      onClick: () => {
        const event = new CustomEvent('openFeedbackModal');
        window.dispatchEvent(event);
        setIsBottomMenuOpen(false);
      },
      color: 'amber'
    }
  ];

  return (
    <>
      {/* TOP BAR: Minimal - Only MAIA Home + Logout */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 bg-neutral-900/10 backdrop-blur-sm border-b border-amber-500/10"
        style={{ paddingTop: 'calc(max(1.25rem, env(safe-area-inset-top)))' }}
      >
        {/* MAIA Home */}
        <Link
          href="/maia"
          className="group relative flex items-center gap-2"
          aria-label="MAIA - Home"
        >
          <div className="w-8 h-8">
            <MiniHoloflower size={32} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white/90">MAIA</h1>
            <p className="text-[9px] text-amber-400/70">Oracle Guide</p>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="group relative p-2 rounded-md bg-neutral-800/90 hover:bg-neutral-700/90 transition-all duration-300 shadow-lg border border-amber-500/30"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
        </button>
      </div>

      {/* BOTTOM PETAL CAROUSEL MENU */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Carousel Content - Slides up when open */}
        <div
          className={`bg-neutral-900/98 backdrop-blur-md border-t border-amber-500/30 transition-all duration-300 ease-in-out ${
            isBottomMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Horizontal Scrolling Petal Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 px-4 py-4 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {petalItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              // Special styling for Access Matrix
              if (item.special) {
                return (
                  <motion.button
                    key={index}
                    onClick={item.onClick}
                    className="relative group flex-shrink-0 scroll-snap-align-start"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="relative px-4 py-3 rounded-lg overflow-hidden min-w-[140px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-700/20" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-600/10 to-transparent opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="relative flex flex-col items-center gap-1 text-center">
                        <Icon className="w-5 h-5 text-amber-400" />
                        <div className="text-[10px] font-mono text-amber-400/90 tracking-wider uppercase">
                          {item.label}
                        </div>
                        <div className="text-[8px] text-amber-600/60">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              }

              // Regular petal items
              const PetalContent = (
                <div className={`
                  relative group flex-shrink-0 scroll-snap-align-start
                  px-4 py-3 rounded-lg min-w-[120px]
                  transition-all duration-300
                  ${isActive
                    ? 'bg-amber-500/20 border border-amber-500/40 shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-800/60 border border-amber-500/20 hover:bg-neutral-700/80 hover:border-amber-500/30'
                  }
                `}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <div className="relative">
                      <Icon className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-amber-300' : 'text-amber-400/80 group-hover:text-amber-300'
                      }`} />
                      {item.showProgress && (
                        <svg className="absolute -inset-1.5 -rotate-90">
                          <circle cx="50%" cy="50%" r="14" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="2" />
                          <circle
                            cx="50%"
                            cy="50%"
                            r="14"
                            fill="none"
                            stroke="rgb(251, 191, 36)"
                            strokeWidth="2"
                            strokeDasharray={`${2 * Math.PI * 14}`}
                            strokeDashoffset={`${2 * Math.PI * 14 * (1 - trainingProgress)}`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                      )}
                    </div>
                    <div className={`text-xs font-medium ${
                      isActive ? 'text-amber-100' : 'text-amber-200/90'
                    }`}>
                      {item.label}
                    </div>
                    <div className="text-[9px] text-amber-400/50">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsBottomMenuOpen(false)}
                    className="flex-shrink-0"
                  >
                    {PetalContent}
                  </Link>
                );
              }

              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex-shrink-0"
                >
                  {PetalContent}
                </button>
              );
            })}
          </div>

          {/* Scroll hint indicator */}
          <div className="flex items-center justify-center py-2 border-t border-amber-500/10">
            <motion.div
              className="flex items-center gap-2 text-[9px] text-amber-400/40"
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span>Swipe to explore petals</span>
              <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>

        {/* Toggle Button - Always visible */}
        <button
          onClick={() => setIsBottomMenuOpen(!isBottomMenuOpen)}
          className="w-full bg-neutral-900/95 backdrop-blur-md border-t border-amber-500/30 py-3 flex flex-col items-center justify-center hover:bg-neutral-800/95 transition-all duration-300"
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
