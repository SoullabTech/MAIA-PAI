"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const OPENAI_VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Warm and expressive' },
  { id: 'fable', name: 'Fable', description: 'Storytelling voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and resonant' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle and soothing' },
];

export default function SettingsPage() {
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const router = useRouter();

  useEffect(() => {
    // Load saved voice preference
    const saved = localStorage.getItem('maia_voice');
    if (saved) {
      setSelectedVoice(saved);
    }
  }, []);

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    localStorage.setItem('maia_voice', voiceId);
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
            Voice Settings
          </h1>
          <p className="text-amber-200/60 text-sm">
            Choose MAIA's voice for your conversations
          </p>
        </div>

        {/* Voice Selection */}
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

        <p className="text-center text-xs text-amber-200/30 mt-8">
          Your voice preference is saved locally
        </p>
      </div>
    </div>
  );
}
