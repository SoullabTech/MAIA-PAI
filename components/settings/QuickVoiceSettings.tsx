'use client';

import { useState, useEffect } from 'react';
import { Volume2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ELEMENTAL_DSP_RECIPES } from '@/lib/services/DSPRecipes';

const OPENAI_VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Warm and expressive' },
  { id: 'fable', name: 'Fable', description: 'Storytelling voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and resonant' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle and soothing' },
];

interface QuickVoiceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickVoiceSettings({ isOpen, onClose }: QuickVoiceSettingsProps) {
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [selectedDSPPreset, setSelectedDSPPreset] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVoice = localStorage.getItem('selected_voice');
      if (savedVoice) setSelectedVoice(savedVoice);

      const savedDSP = localStorage.getItem('voice_dsp_preset');
      if (savedDSP) setSelectedDSPPreset(savedDSP);
    }
  }, [isOpen]);

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    localStorage.setItem('selected_voice', voiceId);
    window.dispatchEvent(new Event('conversationStyleChanged'));
  };

  const handleDSPPresetSelect = (presetId: string) => {
    setSelectedDSPPreset(presetId);
    localStorage.setItem('voice_dsp_preset', presetId);

    // Also update voice to match the preset
    const recipe = ELEMENTAL_DSP_RECIPES[presetId];
    if (recipe) {
      setSelectedVoice(recipe.openai.voice);
      localStorage.setItem('selected_voice', recipe.openai.voice);
    }

    window.dispatchEvent(new Event('conversationStyleChanged'));
  };

  const handleClearDSP = () => {
    setSelectedDSPPreset(null);
    localStorage.removeItem('voice_dsp_preset');
    window.dispatchEvent(new Event('conversationStyleChanged'));
  };

  const elementalPresets = [
    { id: 'element-fire', icon: '🔥', name: 'Fire', description: 'Bright, energetic' },
    { id: 'element-water', icon: '💧', name: 'Water', description: 'Deep, flowing' },
    { id: 'element-earth', icon: '🌍', name: 'Earth', description: 'Grounded, solid' },
    { id: 'element-air', icon: '💨', name: 'Air', description: 'Light, elevated' },
  ];

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-[#1a1f3a] rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#1a1f3a] border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-amber-50">Voice Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Voice Selection */}
              <div>
                <h3 className="text-sm font-medium text-amber-200 mb-3">Base Voice</h3>
                <div className="grid grid-cols-2 gap-2">
                  {OPENAI_VOICES.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => handleVoiceSelect(voice.id)}
                      className={`
                        p-3 rounded-lg border text-left transition-all
                        ${selectedVoice === voice.id
                          ? 'bg-amber-500/20 border-amber-500/50'
                          : 'bg-[#0A0D16]/40 border-amber-500/10 hover:border-amber-500/30'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-sm font-medium ${selectedVoice === voice.id ? 'text-amber-100' : 'text-gray-300'}`}>
                            {voice.name}
                          </div>
                          <div className="text-xs text-gray-500">{voice.description}</div>
                        </div>
                        {selectedVoice === voice.id && (
                          <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Elemental Presets */}
              <div>
                <h3 className="text-sm font-medium text-amber-200 mb-2">Voice Style</h3>
                <p className="text-xs text-amber-200/60 mb-3">
                  Apply elemental sound profiles
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {elementalPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleDSPPresetSelect(preset.id)}
                      className={`
                        p-3 rounded-lg border text-left transition-all
                        ${selectedDSPPreset === preset.id
                          ? 'bg-amber-500/20 border-amber-500/50'
                          : 'bg-[#0A0D16]/40 border-amber-500/10 hover:border-amber-500/30'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{preset.icon}</span>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${selectedDSPPreset === preset.id ? 'text-amber-100' : 'text-gray-300'}`}>
                            {preset.name}
                          </div>
                          <div className="text-xs text-gray-500">{preset.description}</div>
                        </div>
                        {selectedDSPPreset === preset.id && (
                          <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedDSPPreset && (
                  <button
                    onClick={handleClearDSP}
                    className="w-full mt-2 p-2 rounded-lg border border-gray-700 bg-gray-800/40 hover:bg-gray-800/60 transition-all text-center text-xs text-gray-400"
                  >
                    Clear Voice Style
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="text-xs text-amber-200/80">
                  Changes apply immediately to your next conversation. Elemental presets override base voice selection.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
