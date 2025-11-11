/**
 * Bardic Blessing Offer - Sacred Gifting of Memory Features
 *
 * Displays Bardic offerings as blessings at key moments
 * Not hidden, not intrusive - offered as gifts
 *
 * @module components/Bardic/BlessingOffer
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Wind, Heart, Sparkles, X } from 'lucide-react';
import type { BlessingMoment, BardicOffering } from '@/lib/bardic/blessing-moments';

interface BlessingOfferProps {
  blessing: BlessingMoment;
  onAccept: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}

export function BlessingOffer({ blessing, onAccept, onDismiss, isVisible }: BlessingOfferProps) {
  const offeringConfig = getOfferingConfig(blessing.suggestedOffering);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="my-4 relative"
        >
          {/* Blessing Card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 border-2 border-amber-200/50 dark:border-amber-800/50 shadow-lg overflow-hidden">

            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

            <div className="relative p-6">
              {/* Icon and moment type */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${offeringConfig.bgColor} shrink-0`}>
                  {offeringConfig.icon}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Blessing type label */}
                  <div className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                    {getBlessingTypeLabel(blessing.type)}
                  </div>

                  {/* Blessing message */}
                  <p className="text-gray-800 dark:text-gray-100 leading-relaxed mb-4">
                    {blessing.blessingText}
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <motion.button
                      onClick={onAccept}
                      className={`px-5 py-2.5 rounded-xl font-medium text-white ${offeringConfig.buttonColor} shadow-sm hover:shadow-md transition-shadow flex items-center gap-2`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{offeringConfig.icon}</span>
                      <span>{offeringConfig.buttonText}</span>
                    </motion.button>

                    <button
                      onClick={onDismiss}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      Not right now
                    </button>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={onDismiss}
                  className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                  aria-label="Dismiss blessing"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Confidence indicator (subtle) */}
              {blessing.confidence >= 0.9 && (
                <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                    <Sparkles className="w-3 h-3" />
                    <span className="italic">This moment feels significant</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// OFFERING CONFIGURATIONS
// ============================================================================

interface OfferingConfig {
  icon: React.ReactNode;
  buttonText: string;
  buttonColor: string;
  bgColor: string;
}

function getOfferingConfig(offering: BardicOffering): OfferingConfig {
  const configs: Record<BardicOffering, OfferingConfig> = {
    'thread': {
      icon: <Wind className="w-5 h-5" />,
      buttonText: 'Show me the thread',
      buttonColor: 'bg-sky-600 hover:bg-sky-700',
      bgColor: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
    },
    'fire-query': {
      icon: <Flame className="w-5 h-5" />,
      buttonText: 'Let the Bard speak',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    },
    'virtue-ledger': {
      icon: <Heart className="w-5 h-5" />,
      buttonText: 'Show my practice',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      bgColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    },
    'crystallization': {
      icon: <Sparkles className="w-5 h-5" />,
      buttonText: "See what's crystallizing",
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    },
    'sacred-witness': {
      icon: <Sparkles className="w-5 h-5" />,
      buttonText: 'Witness this moment',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    },
  };

  return configs[offering];
}

// ============================================================================
// BLESSING TYPE LABELS
// ============================================================================

function getBlessingTypeLabel(type: BlessingMoment['type']): string {
  const labels: Record<BlessingMoment['type'], string> = {
    'conversation-end': 'Before you go',
    'breakthrough': 'Breakthrough moment',
    'threshold': 'Threshold crossing',
    'pattern-detected': 'Pattern emerging',
    'milestone': 'Milestone reached',
    'user-seeking': 'Bardic offering',
  };

  return labels[type];
}

// ============================================================================
// SHIMMER ANIMATION (for subtle magic effect)
// ============================================================================

// Add to globals.css:
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 3s infinite;
// }
