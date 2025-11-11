/**
 * Bardic Menu - Entry Point for Bardic Memory
 *
 * Provides access to all bardic memory features through MAIA's interface
 *
 * @module components/Bardic/BardicMenu
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Wind,
  Scroll,
  Heart,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface BardicMenuProps {
  onFeatureSelect: (feature: BardicFeature) => void;
  isOpen: boolean;
  onClose: () => void;
}

export type BardicFeature =
  | 'fire-query'      // What wants to emerge?
  | 'thread'          // Show narrative threads
  | 'virtue-ledger'   // Earth layer practice
  | 'recall'          // Memory search
  | 'sacred-witness'; // Witness mode

export function BardicMenu({ onFeatureSelect, isOpen, onClose }: BardicMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-gray-800 dark:to-gray-850 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Bardic Memory
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Your story, woven through time
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <BardicMenuItem
              icon={<Flame className="w-5 h-5" />}
              label="Fire Query"
              description="What wants to emerge?"
              color="orange"
              onClick={() => {
                onFeatureSelect('fire-query');
                onClose();
              }}
            />

            <BardicMenuItem
              icon={<Wind className="w-5 h-5" />}
              label="Narrative Threads"
              description="Show me the thread"
              color="sky"
              onClick={() => {
                onFeatureSelect('thread');
                onClose();
              }}
            />

            <BardicMenuItem
              icon={<Heart className="w-5 h-5" />}
              label="Virtue Ledger"
              description="The slow accrual of character"
              color="green"
              onClick={() => {
                onFeatureSelect('virtue-ledger');
                onClose();
              }}
            />

            <BardicMenuItem
              icon={<Scroll className="w-5 h-5" />}
              label="Memory Recall"
              description="Re-enter past moments"
              color="indigo"
              onClick={() => {
                onFeatureSelect('recall');
                onClose();
              }}
            />

            <div className="my-2 mx-4 border-t border-gray-200 dark:border-gray-700" />

            <BardicMenuItem
              icon={<Sparkles className="w-5 h-5" />}
              label="Sacred Witness"
              description="Hold without analysis"
              color="purple"
              onClick={() => {
                onFeatureSelect('sacred-witness');
                onClose();
              }}
            />
          </div>

          {/* Footer Hint */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              💬 Or say: "Let the Bard speak"
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// MENU ITEM
// ============================================================================

interface BardicMenuItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: 'orange' | 'sky' | 'green' | 'indigo' | 'purple';
  onClick: () => void;
}

function BardicMenuItem({ icon, label, description, color, onClick }: BardicMenuItemProps) {
  const colorClasses = {
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    sky: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20',
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  };

  return (
    <motion.button
      onClick={onClick}
      className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">
          {label}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          {description}
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// BARDIC MENU BUTTON (for MAIA nav)
// ============================================================================

interface BardicMenuButtonProps {
  onClick: () => void;
  hasNewResonance?: boolean;
}

export function BardicMenuButton({ onClick, hasNewResonance }: BardicMenuButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open Bardic Memory"
    >
      <BookOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />

      {hasNewResonance && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"
        />
      )}
    </motion.button>
  );
}

// ============================================================================
// INVOCATION HINT (appears in chat when user types trigger)
// ============================================================================

interface InvocationHintProps {
  triggerText: string;
  invocationType: BardicFeature;
  onActivate: () => void;
  onDismiss: () => void;
}

export function InvocationHint({
  triggerText,
  invocationType,
  onActivate,
  onDismiss,
}: InvocationHintProps) {
  const labels = {
    'fire-query': 'Fire Query',
    'thread': 'Narrative Threads',
    'virtue-ledger': 'Virtue Ledger',
    'recall': 'Memory Recall',
    'sacred-witness': 'Sacred Witness',
  };

  const icons = {
    'fire-query': <Flame className="w-4 h-4" />,
    'thread': <Wind className="w-4 h-4" />,
    'virtue-ledger': <Heart className="w-4 h-4" />,
    'recall': <Scroll className="w-4 h-4" />,
    'sacred-witness': <Sparkles className="w-4 h-4" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3"
    >
      <div className="text-amber-600 dark:text-amber-400">
        {icons[invocationType]}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          Bardic invocation detected: <strong>{labels[invocationType]}</strong>
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onActivate}
          className="px-3 py-1 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          Invoke
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}
