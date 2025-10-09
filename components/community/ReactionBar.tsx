/**
 * Reaction Bar Component
 * Field-aware reactions (elemental + resonance)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reaction } from '@/lib/community/chat-client';

interface ReactionBarProps {
  reactions: Reaction[];
  targetId: string;
  targetType: 'thread' | 'reply';
  currentUserId?: string;
  onReact: (reactionType: Reaction['reaction_type']) => void;
  onRemoveReaction: (reactionType: Reaction['reaction_type']) => void;
}

const REACTION_TYPES: Array<{
  type: Reaction['reaction_type'];
  emoji: string;
  label: string;
  description: string;
}> = [
  { type: 'earth', emoji: '🪨', label: 'Earth', description: 'Grounded, practical, resonant' },
  { type: 'water', emoji: '💧', label: 'Water', description: 'Emotional depth, flowing' },
  { type: 'air', emoji: '🌬️', label: 'Air', description: 'Intellectual, clear, inspiring' },
  { type: 'fire', emoji: '🔥', label: 'Fire', description: 'Passionate, transformative' },
  { type: 'resonance', emoji: '🌀', label: 'Resonance', description: 'Deep soul recognition' },
  { type: 'witnessed', emoji: '👁️', label: 'Witnessed', description: 'I see you, I\'m with you' },
  { type: 'integration', emoji: '✨', label: 'Integration', description: 'This landed for me' },
];

export function ReactionBar({
  reactions,
  targetId,
  targetType,
  currentUserId,
  onReact,
  onRemoveReaction,
}: ReactionBarProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Group reactions by type
  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.reaction_type] = (acc[r.reaction_type] || 0) + 1;
    return acc;
  }, {} as Record<Reaction['reaction_type'], number>);

  // Check which reactions current user has added
  const userReactions = new Set(
    reactions.filter((r) => r.user_id === currentUserId).map((r) => r.reaction_type)
  );

  const handleReactionClick = (reactionType: Reaction['reaction_type']) => {
    if (userReactions.has(reactionType)) {
      onRemoveReaction(reactionType);
    } else {
      onReact(reactionType);
    }
    setShowPicker(false);
  };

  return (
    <div className="relative">
      {/* Existing Reactions */}
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(reactionCounts).map(([type, count]) => {
          const reactionDef = REACTION_TYPES.find((r) => r.type === type);
          if (!reactionDef) return null;

          const isActive = userReactions.has(type as Reaction['reaction_type']);

          return (
            <motion.button
              key={type}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReactionClick(type as Reaction['reaction_type'])}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-ain-soph-amber/20 border-2 border-ain-soph-amber'
                  : 'bg-slate-800/50 border border-ain-soph-gold/30 hover:border-ain-soph-gold/50'
              }`}
              title={reactionDef.description}
            >
              <span className="text-base">{reactionDef.emoji}</span>
              <span className={`text-sm font-medium ${isActive ? 'text-ain-soph-gold' : 'text-ain-soph-gold/70'}`}>
                {count}
              </span>
            </motion.button>
          );
        })}

        {/* Add Reaction Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/50 border border-ain-soph-gold/30 hover:border-ain-soph-gold/50 rounded-lg transition-all"
        >
          <span className="text-ain-soph-gold/70 text-sm">+</span>
        </motion.button>
      </div>

      {/* Reaction Picker */}
      <AnimatePresence>
        {showPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)}
              className="fixed inset-0 z-40"
            />

            {/* Picker */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-2 z-50 bg-slate-800 border border-ain-soph-gold/40 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-3 space-y-1 min-w-[280px]">
                {REACTION_TYPES.map((reaction) => {
                  const isActive = userReactions.has(reaction.type);
                  const count = reactionCounts[reaction.type] || 0;

                  return (
                    <motion.button
                      key={reaction.type}
                      whileHover={{ x: 4 }}
                      onClick={() => handleReactionClick(reaction.type)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                        isActive
                          ? 'bg-ain-soph-amber/20 border border-ain-soph-amber'
                          : 'hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="text-2xl">{reaction.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isActive ? 'text-ain-soph-gold' : 'text-white'}`}>
                          {reaction.label}
                          {count > 0 && (
                            <span className="ml-2 text-ain-soph-gold/60 text-xs">({count})</span>
                          )}
                        </div>
                        <div className="text-xs text-ain-soph-gold/60 truncate">
                          {reaction.description}
                        </div>
                      </div>
                      {isActive && (
                        <span className="text-ain-soph-gold text-xs">✓</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Hint */}
              <div className="px-3 py-2 bg-slate-900/50 border-t border-ain-soph-gold/20">
                <p className="text-xs text-ain-soph-gold/50 text-center">
                  React with elemental resonance
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
