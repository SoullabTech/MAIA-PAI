'use client';

import { useState, useEffect } from 'react';
import { ConversationMode, CONVERSATION_STYLE_DESCRIPTIONS } from '@/lib/types/conversation-style';
import { ConversationStylePreference } from '@/lib/preferences/conversation-style-preference';

interface ConversationStyleSelectorProps {
  onChange?: (mode: ConversationMode) => void;
  className?: string;
}

export function ConversationStyleSelector({ onChange, className = '' }: ConversationStyleSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<ConversationMode>('her');

  useEffect(() => {
    // Load saved preference
    const saved = ConversationStylePreference.get();
    setSelectedMode(saved);
  }, []);

  const handleModeChange = (mode: ConversationMode) => {
    setSelectedMode(mode);
    ConversationStylePreference.set(mode);
    onChange?.(mode);

    // Trigger Maya acknowledgment with style-specific message
    const acknowledgments = {
      her: "Okay, natural mode. I'll keep it short and present.",
      classic: "Switching to classic style - more reflective.",
      adaptive: "Got it. I'll match your rhythm and energy."
    };

    // Emit custom event with acknowledgment message
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('maya-style-changed', {
        detail: {
          mode,
          acknowledgment: acknowledgments[mode]
        }
      }));
    }
  };

  const modes: ConversationMode[] = ['her', 'classic', 'adaptive'];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-2">
        <h3 className="text-lg font-medium text-white/90 mb-1">
          How should Maya speak with you?
        </h3>
        <p className="text-sm text-white/60">
          Choose the conversation style that feels most natural
        </p>
      </div>

      <div className="space-y-3">
        {modes.map((mode) => {
          const description = CONVERSATION_STYLE_DESCRIPTIONS[mode];
          const isSelected = selectedMode === mode;

          return (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`
                w-full text-left p-4 rounded-lg border transition-all
                ${isSelected
                  ? 'border-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{description.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white/90">{description.title}</h4>
                    {isSelected && (
                      <span className="text-xs text-cyan-400 font-medium">Selected</span>
                    )}
                  </div>
                  <p className="text-sm text-white/70 mb-2">
                    {description.description}
                  </p>
                  <p className="text-xs text-white/50 italic">
                    {description.example}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
        <p className="text-xs text-white/60">
          <strong>Tip:</strong> You can change this anytime. Most people prefer "Natural Dialogue"
          (inspired by the movie "Her") for everyday conversations.
        </p>
      </div>
    </div>
  );
}