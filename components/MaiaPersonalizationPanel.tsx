'use client';

/**
 * MAIA Personalization Panel
 *
 * Allows users to truly make MAIA their own:
 * - Custom name for their companion
 * - Pronouns (she/her, he/him, they/them, custom)
 * - Relationship type (guide, friend, mentor, etc.)
 * - Personality traits
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Heart, Sparkles, Save, RotateCcw } from 'lucide-react';

interface MaiaPersonalization {
  customName: string;
  pronouns: 'she/her' | 'he/him' | 'they/them' | string;
  relationshipType: 'guide' | 'friend' | 'mentor' | 'companion' | 'teacher' | 'custom';
  customRelationship?: string;
  personalityTraits: {
    warmth: number; // 0-100: Professional <-> Warm
    formality: number; // 0-100: Casual <-> Formal
    depth: number; // 0-100: Light <-> Deep
  };
}

interface MaiaPersonalizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: MaiaPersonalization) => void;
}

const DEFAULT_PERSONALIZATION: MaiaPersonalization = {
  customName: 'MAIA',
  pronouns: 'she/her',
  relationshipType: 'guide',
  personalityTraits: {
    warmth: 75,
    formality: 40,
    depth: 70,
  },
};

const RELATIONSHIP_OPTIONS = [
  { id: 'guide', label: 'Guide', description: 'Wise pathfinder', emoji: '🧭' },
  { id: 'friend', label: 'Friend', description: 'Trusted companion', emoji: '☕' },
  { id: 'mentor', label: 'Mentor', description: 'Teacher & advisor', emoji: '📖' },
  { id: 'companion', label: 'Companion', description: 'Walking alongside', emoji: '🌟' },
  { id: 'teacher', label: 'Teacher', description: 'Wisdom keeper', emoji: '🔮' },
  { id: 'custom', label: 'Custom', description: 'Define your own', emoji: '✨' },
];

export function MaiaPersonalizationPanel({ isOpen, onClose, onSave }: MaiaPersonalizationPanelProps) {
  const [config, setConfig] = useState<MaiaPersonalization>(DEFAULT_PERSONALIZATION);
  const [hasChanges, setHasChanges] = useState(false);
  const [customPronounsInput, setCustomPronounsInput] = useState('');

  // Load saved configuration on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maia_personalization');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConfig(parsed);
          if (!['she/her', 'he/him', 'they/them'].includes(parsed.pronouns)) {
            setCustomPronounsInput(parsed.pronouns);
          }
        } catch (e) {
          console.error('Failed to load personalization:', e);
        }
      }
    }
  }, []);

  const handleSave = () => {
    // Use custom pronouns if selected
    const finalConfig = {
      ...config,
      pronouns: config.pronouns === 'custom' ? customPronounsInput : config.pronouns,
    };

    // Save to localStorage
    localStorage.setItem('maia_personalization', JSON.stringify(finalConfig));

    // Dispatch event to notify conversation system
    window.dispatchEvent(new CustomEvent('maia-personalization-changed', { detail: finalConfig }));

    // Callback
    onSave?.(finalConfig);

    setHasChanges(false);

    // Visual feedback
    const button = document.getElementById('save-personalization-btn');
    if (button) {
      button.classList.add('scale-95');
      setTimeout(() => button.classList.remove('scale-95'), 200);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_PERSONALIZATION);
    setCustomPronounsInput('');
    setHasChanges(true);
  };

  const updateConfig = (updates: Partial<MaiaPersonalization>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-stone-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 border-b border-amber-500/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Personalize Your MAIA</h2>
                    <p className="text-xs text-stone-400">Make this companion truly yours</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6 space-y-6">
              {/* Name Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <label className="text-sm font-semibold text-white">What do you want to call your companion?</label>
                </div>
                <input
                  type="text"
                  value={config.customName}
                  onChange={(e) => updateConfig({ customName: e.target.value })}
                  placeholder="e.g., MAIA, Sophia, Luna, Morgan..."
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <p className="text-xs text-stone-500">This is how your companion will be addressed throughout your journey</p>
              </div>

              {/* Pronouns Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" />
                  <label className="text-sm font-semibold text-white">Preferred Pronouns</label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['she/her', 'he/him', 'they/them', 'custom'].map((pronoun) => (
                    <button
                      key={pronoun}
                      onClick={() => updateConfig({ pronouns: pronoun as any })}
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        config.pronouns === pronoun
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-black/20 border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="text-sm font-medium capitalize">{pronoun === 'custom' ? '✨ Custom' : pronoun}</div>
                    </button>
                  ))}
                </div>
                {config.pronouns === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <input
                      type="text"
                      value={customPronounsInput}
                      onChange={(e) => setCustomPronounsInput(e.target.value)}
                      placeholder="Enter custom pronouns (e.g., ze/zir, xe/xem)"
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </motion.div>
                )}
              </div>

              {/* Relationship Type */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white">How do you see this relationship?</label>
                <div className="grid grid-cols-2 gap-2">
                  {RELATIONSHIP_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateConfig({ relationshipType: option.id as any })}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        config.relationshipType === option.id
                          ? 'bg-amber-500/20 border-amber-500/50'
                          : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{option.emoji}</span>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${
                            config.relationshipType === option.id ? 'text-amber-300' : 'text-white'
                          }`}>
                            {option.label}
                          </div>
                          <div className="text-xs text-white/50 mt-0.5">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {config.relationshipType === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <input
                      type="text"
                      value={config.customRelationship || ''}
                      onChange={(e) => updateConfig({ customRelationship: e.target.value })}
                      placeholder="Describe your relationship (e.g., creative muse, accountability partner)"
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </motion.div>
                )}
              </div>

              {/* Personality Traits */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-white">Personality & Communication Style</label>

                {/* Warmth */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Warmth</span>
                    <span className="text-xs text-amber-400 font-medium">
                      {config.personalityTraits.warmth < 33 ? 'Professional' :
                       config.personalityTraits.warmth < 66 ? 'Balanced' : 'Very Warm'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.personalityTraits.warmth}
                    onChange={(e) => updateConfig({
                      personalityTraits: { ...config.personalityTraits, warmth: parseInt(e.target.value) }
                    })}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none
                             [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:h-4
                             [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-amber-500
                             [&::-webkit-slider-thumb]:shadow-lg
                             [&::-webkit-slider-thumb]:shadow-amber-500/40"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>Professional</span>
                    <span>Warm & Personal</span>
                  </div>
                </div>

                {/* Formality */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Formality</span>
                    <span className="text-xs text-amber-400 font-medium">
                      {config.personalityTraits.formality < 33 ? 'Casual' :
                       config.personalityTraits.formality < 66 ? 'Balanced' : 'Formal'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.personalityTraits.formality}
                    onChange={(e) => updateConfig({
                      personalityTraits: { ...config.personalityTraits, formality: parseInt(e.target.value) }
                    })}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none
                             [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:h-4
                             [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-amber-500
                             [&::-webkit-slider-thumb]:shadow-lg
                             [&::-webkit-slider-thumb]:shadow-amber-500/40"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>Casual & Relaxed</span>
                    <span>Formal & Refined</span>
                  </div>
                </div>

                {/* Depth */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Conversation Depth</span>
                    <span className="text-xs text-amber-400 font-medium">
                      {config.personalityTraits.depth < 33 ? 'Light & Easy' :
                       config.personalityTraits.depth < 66 ? 'Balanced' : 'Deep & Profound'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.personalityTraits.depth}
                    onChange={(e) => updateConfig({
                      personalityTraits: { ...config.personalityTraits, depth: parseInt(e.target.value) }
                    })}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none
                             [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:h-4
                             [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-amber-500
                             [&::-webkit-slider-thumb]:shadow-lg
                             [&::-webkit-slider-thumb]:shadow-amber-500/40"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>Light & Surface</span>
                    <span>Deep & Transformational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4 bg-black/20">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Reset to Default</span>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-personalization-btn"
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
                      hasChanges
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
