'use client';

import { useState, useEffect } from 'react';
import { EntrancingChatExperience, AmbientChatAtmosphere } from './EntrancingChatExperience';
import { soulfulSounds } from '@/lib/audio/SoulfulSounds';
import '@/styles/entrancing-chat.css';

interface SoulfulChatProps {
  mayaResponse: string;
  userMessage?: string;
  onMayaComplete?: () => void;
}

/**
 * Complete soulful chat experience integration
 * Combines all entrancing elements into one sublime interface
 */
export function SoulfulChat({
  mayaResponse,
  userMessage,
  onMayaComplete
}: SoulfulChatProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check user preferences
    const savedPrefs = localStorage.getItem('soullab-sound-prefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setSoundEnabled(prefs.enabled);
      setAmbientVolume(prefs.volume);
      soulfulSounds.toggle(prefs.enabled);
      soulfulSounds.setVolume(prefs.volume);
    }
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soulfulSounds.toggle(newState);
    localStorage.setItem('soullab-sound-prefs', JSON.stringify({
      enabled: newState,
      volume: ambientVolume
    }));

    // Play a soft confirmation sound
    if (newState) {
      soulfulSounds.playResonance();
    }
  };

  const adjustVolume = (value: number) => {
    setAmbientVolume(value);
    soulfulSounds.setVolume(value);
    localStorage.setItem('soullab-sound-prefs', JSON.stringify({
      enabled: soundEnabled,
      volume: value
    }));
  };

  return (
    <AmbientChatAtmosphere>
      <div className="relative min-h-screen p-6">
        {/* Field presence layer */}
        <div className="field-presence" />

        {/* Ambient settings (subtle, top-right) */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full bg-amber-900/20 border border-amber-500/20
                     hover:bg-amber-900/30 transition-all duration-300"
            aria-label="Sound settings"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3L6 7H3v6h3l4 4V3z"
                fill="rgba(212, 184, 150, 0.6)"
              />
              {soundEnabled && (
                <>
                  <path d="M13 7c0 2-1 3-1 3s1 1 1 3" stroke="rgba(212, 184, 150, 0.4)" strokeWidth="1.5" />
                  <path d="M15 5c0 3-1.5 5-1.5 5s1.5 2 1.5 5" stroke="rgba(212, 184, 150, 0.3)" strokeWidth="1.5" />
                </>
              )}
            </svg>
          </button>

          {showSettings && (
            <div className="absolute top-12 right-0 p-4 bg-black/80 backdrop-blur
                          border border-amber-500/20 rounded-xl w-64">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={toggleSound}
                    className="sr-only"
                  />
                  <div className={`
                    w-10 h-6 rounded-full transition-colors duration-300
                    ${soundEnabled ? 'bg-amber-500/40' : 'bg-gray-700/40'}
                  `}>
                    <div className={`
                      w-4 h-4 rounded-full bg-amber-200 transition-transform duration-300
                      transform ${soundEnabled ? 'translate-x-5' : 'translate-x-1'} mt-1
                    `} />
                  </div>
                  <span className="text-amber-200/70 text-sm">Ambient sound</span>
                </label>

                {soundEnabled && (
                  <div className="space-y-2">
                    <label className="text-amber-200/50 text-xs">Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={ambientVolume}
                      onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="sound-wave justify-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat messages */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* User message (if provided) */}
          {userMessage && (
            <div className="flex justify-end">
              <div className="max-w-lg">
                <EntrancingChatExperience
                  message={userMessage}
                  isFromMaya={false}
                />
              </div>
            </div>
          )}

          {/* Maya's entrancing response */}
          <div className="flex justify-start">
            <div className="max-w-lg">
              <EntrancingChatExperience
                message={mayaResponse}
                isFromMaya={true}
                onComplete={onMayaComplete}
              />
            </div>
          </div>
        </div>

        {/* Subliminal presence orbs */}
        <div className="presence-orb" style={{ top: '20%', left: '10%' }} />
        <div className="presence-orb" style={{ top: '60%', right: '15%', animationDelay: '5s' }} />
        <div className="presence-orb" style={{ bottom: '20%', left: '20%', animationDelay: '10s' }} />
      </div>
    </AmbientChatAtmosphere>
  );
}

/**
 * Example usage in your main chat component:
 *
 * <SoulfulChat
 *   userMessage="I'm feeling lost today"
 *   mayaResponse="I hear you... Sometimes being lost is the soul's way of telling us we're ready for a new path."
 *   onMayaComplete={() => {
 *     // Enable user input
 *     // Track completion metrics
 *   }}
 * />
 */