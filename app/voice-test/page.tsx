'use client';

import { useState, useEffect } from 'react';
import { getMaiaVoiceEngine, type Element, voiceStateManager } from '@/lib/voice';
import type { VoiceStateData } from '@/lib/voice';

export default function VoiceTestPage() {
  const [selectedElement, setSelectedElement] = useState<Element>('aether');
  const [customText, setCustomText] = useState('hello beautiful world');
  const [voiceState, setVoiceState] = useState<VoiceStateData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = voiceStateManager.subscribe((state) => {
      setVoiceState(state);
      setIsSpeaking(state.state === 'exhale');
    });
    return unsubscribe;
  }, []);

  const handleTest = async (element: Element) => {
    try {
      const engine = getMaiaVoiceEngine();
      await engine.speak(customText, { element });
    } catch (error) {
      console.error('Voice test error:', error);
    }
  };

  const elements: Array<{ id: Element; name: string; emoji: string }> = [
    { id: 'fire', name: 'Fire', emoji: '🔥' },
    { id: 'water', name: 'Water', emoji: '💧' },
    { id: 'earth', name: 'Earth', emoji: '🌍' },
    { id: 'air', name: 'Air', emoji: '🌬️' },
    { id: 'aether', name: 'Aether', emoji: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">MAIA Voice Engine Test</h1>
          <p className="text-stone-400">Test the Spiralogic voice synthesis system</p>
        </div>

        {voiceState && (
          <div className="mb-8 p-6 bg-black/40 border border-amber-900/30 rounded-lg">
            <h2 className="text-xl font-semibold text-amber-300 mb-4">Voice State</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-500">State:</span>
                <span className={`ml-2 font-mono ${isSpeaking ? 'text-amber-400' : 'text-stone-300'}`}>
                  {voiceState.state.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-stone-500">Phase:</span>
                <span className="ml-2 font-mono text-stone-300">{voiceState.phase}</span>
              </div>
              <div>
                <span className="text-stone-500">Amplitude:</span>
                <span className="ml-2 font-mono text-stone-300">{voiceState.amplitude.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-stone-500">Breath Progress:</span>
                <span className="ml-2 font-mono text-stone-300">
                  {(voiceState.breathProgress * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-100"
                  style={{ width: `${voiceState.amplitude * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 p-6 bg-black/40 border border-amber-900/30 rounded-lg">
          <label className="block text-sm font-medium text-amber-300 mb-2">
            Test Text
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full px-4 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-200 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {elements.map((elem) => (
            <button
              key={elem.id}
              onClick={() => {
                setSelectedElement(elem.id);
                handleTest(elem.id);
              }}
              disabled={isSpeaking}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedElement === elem.id
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-stone-700 bg-black/20'
              } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-400 cursor-pointer'}`}
            >
              <div className="text-4xl mb-2">{elem.emoji}</div>
              <div className="text-sm font-semibold text-stone-200">{elem.name}</div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/maia"
            className="inline-block px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition-colors"
          >
            ← Back to MAIA
          </a>
        </div>
      </div>
    </div>
  );
}
