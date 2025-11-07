"use client";

import React, { useState, useRef, useEffect } from "react";
import { predictProsody, applyProsodyToText } from "@/lib/prosody/prosodyHead";

type VoiceSettings = {
  speed: number;        // 0-100 (maps to WPM multiplier)
  warmth: number;       // 0-100 (maps to valence)
  presence: number;     // 0-100 (maps to pause scaling)
  energy: number;       // 0-100 (maps to arousal)
  voice: string;        // OpenAI voice ID
  element: string;      // Current element
};

const DEFAULT_SETTINGS: VoiceSettings = {
  speed: 50,      // Medium speed
  warmth: 65,     // Warm and compassionate
  presence: 60,   // Present but not overwhelming
  energy: 35,     // Calm and grounded
  voice: "alloy",
  element: "water"
};

export default function LabToolsPage() {
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maia-voice-settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const [testText, setTestText] = useState(
    "Let's take one gentle breath together, and notice what softens as you exhale."
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem('maia-voice-settings', JSON.stringify(settings));
  }, [settings]);

  // Map user-friendly values to prosody parameters
  const mapToProsody = () => {
    // Speed: 0=slow (90 WPM), 50=normal (130), 100=fast (180)
    const arousal = settings.energy / 100;
    const valence = settings.warmth / 100;

    return { arousal, valence };
  };

  const synthesize = async () => {
    try {
      setIsPlaying(true);

      const { arousal, valence } = mapToProsody();

      // Generate prosody
      const controls = predictProsody({
        text: testText,
        element: settings.element as any,
        arousal,
        valence,
        intent: "invite",
      });

      // Adjust WPM based on speed slider
      const speedMultiplier = 0.7 + (settings.speed / 100) * 0.6; // 0.7x to 1.3x
      controls.wpm = Math.round(controls.wpm * speedMultiplier);

      // Adjust pauses based on presence slider
      const presenceMultiplier = 0.6 + (settings.presence / 100) * 0.8; // 0.6x to 1.4x
      controls.pauseMs.comma = Math.round(controls.pauseMs.comma * presenceMultiplier);
      controls.pauseMs.dash = Math.round(controls.pauseMs.dash * presenceMultiplier);
      controls.pauseMs.period = Math.round(controls.pauseMs.period * presenceMultiplier);
      controls.pauseMs.breath = Math.round(controls.pauseMs.breath * presenceMultiplier);

      // Shape text
      const shapedText = applyProsodyToText(testText, controls);

      // Synthesize
      const res = await fetch("/api/voice/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: shapedText,
          voice: settings.voice,
          quality: "hd",
          speed: controls.wpm / 150, // Convert WPM to OpenAI speed
        }),
      });

      if (!res.ok) throw new Error(`TTS failed: ${res.status}`);

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setIsPlaying(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-100">Voice Lab Tools</h1>
          <p className="text-zinc-400">
            Customize MAIA's voice characteristics. Your preferences are saved automatically.
          </p>
        </div>

        {/* Main Controls */}
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 space-y-6">

          {/* Speed Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Speaking Speed</label>
              <span className="text-xs text-zinc-500">
                {settings.speed < 35 ? "Slow" : settings.speed < 65 ? "Medium" : "Fast"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.speed}
              onChange={(e) => setSettings({ ...settings, speed: parseInt(e.target.value) })}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Slow & Spacious</span>
              <span>Quick & Engaged</span>
            </div>
          </div>

          {/* Warmth Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Emotional Warmth</label>
              <span className="text-xs text-zinc-500">
                {settings.warmth < 35 ? "Neutral" : settings.warmth < 65 ? "Warm" : "Very Warm"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.warmth}
              onChange={(e) => setSettings({ ...settings, warmth: parseInt(e.target.value) })}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Neutral & Clear</span>
              <span>Warm & Compassionate</span>
            </div>
          </div>

          {/* Presence Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Pause & Presence</label>
              <span className="text-xs text-zinc-500">
                {settings.presence < 35 ? "Brief" : settings.presence < 65 ? "Balanced" : "Spacious"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.presence}
              onChange={(e) => setSettings({ ...settings, presence: parseInt(e.target.value) })}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Quick Transitions</span>
              <span>Long Pauses & Breaths</span>
            </div>
          </div>

          {/* Energy Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Energy Level</label>
              <span className="text-xs text-zinc-500">
                {settings.energy < 35 ? "Calm" : settings.energy < 65 ? "Balanced" : "Energized"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.energy}
              onChange={(e) => setSettings({ ...settings, energy: parseInt(e.target.value) })}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Grounded & Still</span>
              <span>Alert & Dynamic</span>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">Voice Character</label>
            <select
              value={settings.voice}
              onChange={(e) => setSettings({ ...settings, voice: e.target.value })}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-sm text-zinc-200"
            >
              <option value="alloy">Alloy - Neutral & Balanced</option>
              <option value="shimmer">Shimmer - Warm & Engaging</option>
              <option value="nova">Nova - Upbeat & Energetic</option>
              <option value="echo">Echo - Clear & Resonant</option>
              <option value="fable">Fable - Expressive & British</option>
              <option value="onyx">Onyx - Deep & Grounded</option>
            </select>
          </div>

          {/* Element Selection (Advanced) */}
          <details className="space-y-3">
            <summary className="text-sm font-medium text-zinc-400 cursor-pointer hover:text-zinc-300">
              Advanced: Elemental Mode
            </summary>
            <select
              value={settings.element}
              onChange={(e) => setSettings({ ...settings, element: e.target.value })}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-sm text-zinc-200"
            >
              <option value="water">Water - Reflective & Flowing</option>
              <option value="fire">Fire - Passionate & Direct</option>
              <option value="earth">Earth - Grounded & Steady</option>
              <option value="air">Air - Light & Clear</option>
              <option value="aether">Aether - Mystical & Spacious</option>
              <option value="shadow">Shadow - Deep & Mysterious</option>
            </select>
          </details>
        </div>

        {/* Test Preview */}
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200">Test Your Settings</h2>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Test Text</label>
            <textarea
              className="w-full min-h-[100px] rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-sm text-zinc-200"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test voice settings..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={synthesize}
              disabled={isPlaying}
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/40 text-sm font-medium disabled:opacity-60 transition-colors"
            >
              {isPlaying ? "Synthesizing..." : "▶ Test Voice"}
            </button>
            <button
              onClick={resetToDefaults}
              className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          <audio ref={audioRef} className="w-full" controls />
        </div>

        {/* Info Panel */}
        <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 text-sm text-zinc-400 space-y-2">
          <p className="font-medium text-zinc-300">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>For contemplative sessions: Low speed, high warmth, high presence</li>
            <li>For energizing sessions: High speed, medium warmth, low presence</li>
            <li>For grounding work: Medium speed, high warmth, medium presence</li>
            <li>Your settings are saved automatically and persist across sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
