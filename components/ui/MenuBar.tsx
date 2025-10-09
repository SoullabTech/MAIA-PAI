'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Users, Brain, MessageSquare, Settings, X } from 'lucide-react';
import { ConversationMode, CONVERSATION_STYLE_DESCRIPTIONS } from '@/lib/types/conversation-style';
import { ConversationStylePreference } from '@/lib/preferences/conversation-style-preference';

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
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ConversationMode>('classic');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showRotateHint, setShowRotateHint] = useState(true);

  // Don't show on community pages
  const hideCommunityLink = pathname?.startsWith('/community');

  useEffect(() => {
    // Load saved preference
    const saved = ConversationStylePreference.get();
    setSelectedMode(saved);

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

  const handleModeChange = (mode: ConversationMode) => {
    setSelectedMode(mode);
    ConversationStylePreference.set(mode);
    setShowStyleModal(false);

    // Dispatch custom event to notify OracleConversation of the change
    const event = new CustomEvent('conversationStyleChanged');
    window.dispatchEvent(event);

    console.log('🎭 Conversation style changed to:', mode);
  };

  const modes: ConversationMode[] = ['her', 'classic', 'adaptive'];

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

      {/* Mobile-First: Full Menu Bar */}
      <div className="flex fixed right-4 z-50 items-center gap-2 md:gap-3" style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 0.75rem)' }}>
      {/* MAIA Training Progress Icon */}
      <Link
        href="/maya/training"
        className="group relative"
        aria-label="MAIA Training Progress"
      >
        <div className="relative p-2 md:p-3 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-500/30 hover:bg-amber-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-amber-500/40 animate-pulse-subtle">
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
          <div className="p-2 md:p-3 rounded-lg bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 hover:bg-indigo-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-indigo-500/40">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 transition-transform group-active:scale-110" />

            {/* Tooltip */}
            <span className="absolute -bottom-10 right-0 bg-black/80 backdrop-blur-sm text-indigo-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Soul-Building Circle
            </span>
          </div>
        </Link>
      )}

      {/* Conversation Style Toggle */}
      <button
        onClick={() => setShowStyleModal(true)}
        className="group relative"
        aria-label="Conversation Style"
      >
        <div className="p-2 md:p-3 rounded-lg bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 hover:bg-cyan-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-cyan-500/40">
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 transition-all group-active:rotate-[-10deg]" />

          {/* Tooltip */}
          <span className="absolute -bottom-10 right-0 bg-black/80 backdrop-blur-sm text-cyan-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {CONVERSATION_STYLE_DESCRIPTIONS[selectedMode].title}
          </span>
        </div>
      </button>

      {/* Settings */}
      <Link
        href="/settings"
        className="group relative"
        aria-label="Settings"
      >
        <div className="p-2 md:p-3 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-500/30 hover:bg-amber-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-amber-500/40">
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
        <div className="p-2 md:p-3 rounded-lg bg-neutral-400/20 backdrop-blur-md border border-neutral-400/30 hover:bg-neutral-400/30 transition-all hover:scale-110 active:scale-95 shadow-lg active:shadow-xl active:shadow-neutral-400/40">
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-neutral-300 transition-all group-active:scale-110 group-active:rotate-12" />

          {/* Tooltip */}
          <span className="absolute -bottom-10 right-0 bg-black/80 backdrop-blur-sm text-neutral-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Beta Feedback
          </span>
        </div>
      </button>

      {/* Mobile-First Style Selection Modal */}
      {showStyleModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onClick={() => setShowStyleModal(false)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-500/30 rounded-t-3xl shadow-2xl shadow-cyan-500/20 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="px-6 pb-8 pt-2">
              <h3 className="text-lg font-semibold text-white/90 mb-1">
                How should Maya speak?
              </h3>
              <p className="text-sm text-white/60 mb-4">
                Choose your preferred conversation style
              </p>

              <div className="space-y-3">
                {modes.map((mode) => {
                  const description = CONVERSATION_STYLE_DESCRIPTIONS[mode];
                  const isSelected = selectedMode === mode;

                  return (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`
                        w-full text-left p-4 rounded-xl border transition-all active:scale-98
                        ${isSelected
                          ? 'border-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-white/10 bg-white/5 active:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{description.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white/90 text-base">
                              {description.title}
                            </h4>
                            {isSelected && (
                              <span className="text-xs text-cyan-400 font-medium">✓</span>
                            )}
                          </div>
                          <p className="text-sm text-white/70 leading-snug mb-2">
                            {description.description}
                          </p>
                          <p className="text-xs text-white/50 italic leading-relaxed">
                            {description.example}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowStyleModal(false)}
                className="w-full mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium text-sm active:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
