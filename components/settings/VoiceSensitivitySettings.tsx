'use client';

import { useState, useEffect } from 'react';
import { Mic, Info } from 'lucide-react';

/**
 * Voice Sensitivity Settings Component
 *
 * Allows users to configure how long MAIA waits before deciding they're done speaking.
 * This is crucial for different speaking styles - some people pause mid-thought more than others.
 */
export function VoiceSensitivitySettings() {
  const [silenceThresholds, setSilenceThresholds] = useState({
    short: 8000,   // 8s for short messages (default)
    medium: 12000, // 12s for medium messages (default)
    long: 15000,   // 15s for long messages (default)
  });

  const [showExplanation, setShowExplanation] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentMode, setCurrentMode] = useState<string>('normal');

  // Load current settings and mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load current MAIA mode
      const mode = localStorage.getItem('maia_conversation_mode') || 'normal';
      setCurrentMode(mode);

      // Load saved thresholds
      const savedSettings = localStorage.getItem('maia_voice_silence_thresholds');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSilenceThresholds(parsed);
        } catch (e) {
          console.error('Failed to load voice settings:', e);
        }
      } else if (mode === 'patient') {
        // Default to patient thresholds if in patient mode
        setSilenceThresholds({
          short: 12000,
          medium: 18000,
          long: 25000,
        });
      }
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('maia_voice_silence_thresholds', JSON.stringify(silenceThresholds));
      console.log('[VoiceSensitivitySettings] Saved:', silenceThresholds);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = () => {
    const defaults = {
      short: 8000,
      medium: 12000,
      long: 15000,
    };
    setSilenceThresholds(defaults);
    if (typeof window !== 'undefined') {
      localStorage.setItem('maia_voice_silence_thresholds', JSON.stringify(defaults));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Preset options for common speaking styles
  const applyPreset = (preset: 'quick' | 'balanced' | 'thoughtful') => {
    const presets = {
      quick: { short: 5000, medium: 8000, long: 10000 },     // Faster speakers
      balanced: { short: 8000, medium: 12000, long: 15000 },  // Default
      thoughtful: { short: 12000, medium: 18000, long: 25000 }, // Slower, more pauses
    };
    setSilenceThresholds(presets[preset]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-600/20">
            <Mic className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Voice Sensitivity</h3>
            <p className="text-sm text-stone-400">
              Adjust how MAIA detects when you're done speaking
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Info className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Current Mode Display */}
      {currentMode === 'patient' && (
        <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
          <p className="text-xs text-green-200/80 leading-relaxed">
            <strong>✓ Patient Mode Active</strong> - MAIA is already using longer silence thresholds.
            You can still fine-tune them below if needed.
          </p>
        </div>
      )}

      {/* Explanation */}
      {showExplanation && (
        <div className="p-4 rounded-lg bg-amber-600/10 border border-amber-600/20">
          <p className="text-xs text-amber-200/80 leading-relaxed">
            <strong>How it works:</strong> MAIA listens for silence to know when you're done speaking.
            If you pause to think mid-sentence, she might think you're finished and respond too early.
            These settings control how long she waits before deciding you're done.
            <br /><br />
            <strong>Tip:</strong> If MAIA interrupts you often, try switching to "Patient Mode" in the conversation
            settings, or use the "Thoughtful" preset here.
          </p>
        </div>
      )}

      {/* Quick Presets */}
      <div>
        <label className="text-sm font-medium text-stone-300 mb-3 block">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => applyPreset('quick')}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
          >
            Quick Speaker
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
          >
            Balanced (Default)
          </button>
          <button
            onClick={() => applyPreset('thoughtful')}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
          >
            Thoughtful Speaker
          </button>
        </div>
      </div>

      {/* Manual Controls */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-stone-300 block">
          Manual Adjustment (seconds of silence)
        </label>

        {/* Short Messages */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-stone-400">Short messages (1-3 words)</span>
            <span className="text-xs text-amber-400">{(silenceThresholds.short / 1000).toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="3000"
            max="20000"
            step="1000"
            value={silenceThresholds.short}
            onChange={(e) => setSilenceThresholds(prev => ({ ...prev, short: parseInt(e.target.value) }))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Medium Messages */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-stone-400">Medium messages (4-11 words)</span>
            <span className="text-xs text-amber-400">{(silenceThresholds.medium / 1000).toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="5000"
            max="30000"
            step="1000"
            value={silenceThresholds.medium}
            onChange={(e) => setSilenceThresholds(prev => ({ ...prev, medium: parseInt(e.target.value) }))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Long Messages */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-stone-400">Long messages (12+ words)</span>
            <span className="text-xs text-amber-400">{(silenceThresholds.long / 1000).toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="8000"
            max="40000"
            step="1000"
            value={silenceThresholds.long}
            onChange={(e) => setSilenceThresholds(prev => ({ ...prev, long: parseInt(e.target.value) }))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium hover:from-amber-700 hover:to-orange-700 transition-colors"
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Current Values Display */}
      <div className="p-3 rounded-lg bg-black/40 border border-white/10">
        <p className="text-xs text-stone-400 mb-2">Current settings:</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-stone-500">Short</div>
            <div className="text-sm text-amber-400 font-mono">{(silenceThresholds.short / 1000).toFixed(1)}s</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Medium</div>
            <div className="text-sm text-amber-400 font-mono">{(silenceThresholds.medium / 1000).toFixed(1)}s</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Long</div>
            <div className="text-sm text-amber-400 font-mono">{(silenceThresholds.long / 1000).toFixed(1)}s</div>
          </div>
        </div>
      </div>
    </div>
  );
}
