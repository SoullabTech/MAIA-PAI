"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, ArrowLeft, Check, MessageCircle, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import { VoiceSensitivitySettings } from '@/components/settings/VoiceSensitivitySettings';
import { ELEMENTAL_DSP_RECIPES } from '@/lib/services/DSPRecipes';

const OPENAI_VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Warm and expressive' },
  { id: 'fable', name: 'Fable', description: 'Storytelling voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and resonant' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle and soothing' },
];

const CONVERSATION_MODES = [
  {
    id: 'classic',
    name: 'Deep Conversation',
    icon: '🏠',
    description: 'Fuller responses (2-4 sentences) for meaningful dialogue',
    voiceCommand: 'deep mode'
  },
  {
    id: 'walking',
    name: 'Walking Companion',
    icon: '🚶',
    description: 'Brief, present responses (5-8 words) for ambient connection',
    voiceCommand: 'walking mode'
  },
  {
    id: 'adaptive',
    name: 'Adaptive',
    icon: '🔄',
    description: 'Matches your communication style and context',
    voiceCommand: 'adaptive mode'
  },
];

const AI_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    icon: '⚡',
    description: 'Fast, conversational, natural voice chat',
    bestFor: 'Walking mode - casual companionship'
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    icon: '🌟',
    description: 'More depth, better reasoning, holds complexity',
    bestFor: 'All modes - balanced depth + conversation'
  },
  {
    id: 'claude',
    name: 'Claude Sonnet 4.5',
    icon: '🧠',
    description: 'Deepest understanding, holds paradox, 500hr EO framework',
    bestFor: 'Deep mode - transformational work'
  },
];

export default function SettingsPage() {
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [selectedMode, setSelectedMode] = useState('walking'); // 🚶 DEFAULT: Walking Companion mode
  const [selectedModel, setSelectedModel] = useState('gpt-4o'); // ⚡ DEFAULT: GPT-4o for conversational
  const [selectedDSPPreset, setSelectedDSPPreset] = useState<string | null>(null);
  const [showAdvancedDSP, setShowAdvancedDSP] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load saved voice preference
    const saved = localStorage.getItem('selected_voice');
    if (saved) {
      setSelectedVoice(saved);
    }

    // Load saved conversation mode (default to 'walking' if not set)
    const savedMode = localStorage.getItem('conversation_mode');
    if (savedMode && ['classic', 'walking', 'adaptive'].includes(savedMode)) {
      setSelectedMode(savedMode);
    } else {
      // No valid mode saved - set Walking as default
      setSelectedMode('walking');
      localStorage.setItem('conversation_mode', 'walking');
      window.dispatchEvent(new Event('conversationStyleChanged'));
    }

    // Load saved AI model preference (default to 'gpt-4o')
    const savedModel = localStorage.getItem('ai_model');
    if (savedModel && ['gpt-4o', 'gpt-5', 'claude'].includes(savedModel)) {
      setSelectedModel(savedModel);
    }

    // Load saved DSP preset
    const savedDSP = localStorage.getItem('voice_dsp_preset');
    if (savedDSP) {
      setSelectedDSPPreset(savedDSP);
    }
  }, []);

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    localStorage.setItem('selected_voice', voiceId);

    // Dispatch event to notify OracleConversation of the change
    window.dispatchEvent(new Event('conversationStyleChanged'));
  };

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    localStorage.setItem('conversation_mode', modeId);

    // Dispatch event to notify components
    window.dispatchEvent(new Event('conversationStyleChanged'));
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('ai_model', modelId);

    // Dispatch event to notify components
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

    // Dispatch event to notify components
    window.dispatchEvent(new Event('conversationStyleChanged'));
  };

  return (
    <div className="min-h-screen bg-[#1a1f3a] text-white px-4 py-8">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#F6AD55" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#F6AD55" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-400/70 hover:text-amber-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <h1 className="text-4xl font-extralight text-amber-50 tracking-wide mb-2">
            MAIA Settings
          </h1>
          <p className="text-amber-200/60 text-sm">
            Customize your experience with MAIA
          </p>
        </div>

        {/* AI Model Selection */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🤖</div>
            <h2 className="text-2xl font-extralight text-amber-50">
              AI Model
            </h2>
          </div>
          <p className="text-amber-200/50 text-sm mb-4">
            Choose which AI powers Maia's responses. A/B test to find what feels most genuine.
          </p>

          <div className="space-y-3">
            {AI_MODELS.map((model) => (
              <motion.button
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModelSelect(model.id)}
                className={`
                  w-full p-4 rounded-lg border transition-all text-left
                  ${selectedModel === model.id
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-[#0A0D16]/40 border-amber-500/10 hover:border-amber-500/30'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-xl
                      ${selectedModel === model.id
                        ? 'bg-amber-500/20'
                        : 'bg-gray-800'
                      }
                    `}>
                      {model.icon}
                    </div>
                    <div>
                      <h3 className={`
                        font-medium
                        ${selectedModel === model.id
                          ? 'text-amber-100'
                          : 'text-gray-300'
                        }
                      `}>
                        {model.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {model.description}
                      </p>
                      <p className="text-xs text-amber-400/60">
                        Best for: {model.bestFor}
                      </p>
                    </div>
                  </div>

                  {selectedModel === model.id && (
                    <Check className="w-5 h-5 text-amber-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Conversation Mode Selection */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-extralight text-amber-50">
              Conversation Mode
            </h2>
          </div>
          <p className="text-amber-200/50 text-sm mb-4">
            Switch modes anytime by saying "{CONVERSATION_MODES.find(m => m.id !== selectedMode)?.voiceCommand}"
          </p>

          <div className="space-y-3">
            {CONVERSATION_MODES.map((mode) => (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModeSelect(mode.id)}
                className={`
                  w-full p-4 rounded-lg border transition-all text-left
                  ${selectedMode === mode.id
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-[#0A0D16]/40 border-amber-500/10 hover:border-amber-500/30'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-xl
                      ${selectedMode === mode.id
                        ? 'bg-amber-500/20'
                        : 'bg-gray-800'
                      }
                    `}>
                      {mode.icon}
                    </div>
                    <div>
                      <h3 className={`
                        font-medium
                        ${selectedMode === mode.id
                          ? 'text-amber-100'
                          : 'text-gray-300'
                        }
                      `}>
                        {mode.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {mode.description}
                      </p>
                      <p className="text-xs text-amber-400/60">
                        Say: "{mode.voiceCommand}"
                      </p>
                    </div>
                  </div>

                  {selectedMode === mode.id && (
                    <Check className="w-5 h-5 text-amber-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Voice Selection */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-extralight text-amber-50">
              Voice
            </h2>
          </div>

          <div className="space-y-3">
            {OPENAI_VOICES.map((voice) => (
            <motion.button
              key={voice.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVoiceSelect(voice.id)}
              className={`
                w-full p-4 rounded-lg border transition-all text-left
                ${selectedVoice === voice.id
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : 'bg-[#0A0D16]/40 border-amber-500/10 hover:border-amber-500/30'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${selectedVoice === voice.id
                      ? 'bg-amber-500/20'
                      : 'bg-gray-800'
                    }
                  `}>
                    <Volume2 className={`
                      w-5 h-5
                      ${selectedVoice === voice.id
                        ? 'text-amber-400'
                        : 'text-gray-500'
                      }
                    `} />
                  </div>
                  <div>
                    <h3 className={`
                      font-medium
                      ${selectedVoice === voice.id
                        ? 'text-amber-100'
                        : 'text-gray-300'
                      }
                    `}>
                      {voice.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {voice.description}
                    </p>
                  </div>
                </div>

                {selectedVoice === voice.id && (
                  <Check className="w-5 h-5 text-amber-400" />
                )}
              </div>
            </motion.button>
          ))}
          </div>
        </div>

        {/* DSP Voice Customization */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-extralight text-amber-50">
              Voice Style Customization
            </h2>
          </div>
          <p className="text-amber-200/50 text-sm mb-4">
            Choose an elemental voice profile to shape MAIA's tone, pace, and presence
          </p>

          <div className="space-y-3">
            {/* DSP Presets - Elemental Profiles */}
            {Object.entries(ELEMENTAL_DSP_RECIPES).map(([presetId, recipe]) => {
              const icons: Record<string, string> = {
                'element-fire': '🔥',
                'element-water': '💧',
                'element-earth': '🌍',
                'element-air': '💨'
              };
              const names: Record<string, string> = {
                'element-fire': 'Fire',
                'element-water': 'Water',
                'element-earth': 'Earth',
                'element-air': 'Air'
              };

              return (
                <motion.button
                  key={presetId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDSPPresetSelect(presetId)}
                  className={`
                    w-full p-4 rounded-lg border transition-all text-left
                    ${selectedDSPPreset === presetId
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : 'bg-[#0A0D16]/40 border-amber-500/10 hover:border-amber-500/30'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-xl
                        ${selectedDSPPreset === presetId
                          ? 'bg-amber-500/20'
                          : 'bg-gray-800'
                        }
                      `}>
                        {icons[presetId]}
                      </div>
                      <div>
                        <h3 className={`
                          font-medium
                          ${selectedDSPPreset === presetId
                            ? 'text-amber-100'
                            : 'text-gray-300'
                          }
                        `}>
                          {names[presetId]}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {recipe.signature}
                        </p>
                        <p className="text-xs text-amber-400/60">
                          Voice: {recipe.openai.voice} • Speed: {recipe.openai.speed}x • Pitch: {recipe.basic.pitch > 0 ? '+' : ''}{recipe.basic.pitch} semitones
                        </p>
                      </div>
                    </div>

                    {selectedDSPPreset === presetId && (
                      <Check className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                </motion.button>
              );
            })}

            {/* Clear DSP preset */}
            {selectedDSPPreset && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDSPPreset(null);
                  localStorage.removeItem('voice_dsp_preset');
                  window.dispatchEvent(new Event('conversationStyleChanged'));
                }}
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/40 hover:bg-gray-800/60 transition-all text-center text-sm text-gray-400"
              >
                Clear Voice Style (use default)
              </motion.button>
            )}
          </div>
        </div>

        {/* Voice Sensitivity Settings */}
        <div className="mb-12">
          <VoiceSensitivitySettings />
        </div>

        <p className="text-center text-xs text-amber-200/30 mt-8">
          Your preferences are saved locally
        </p>
      </div>
    </div>
  );
}
