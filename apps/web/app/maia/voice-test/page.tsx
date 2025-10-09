'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const MaiaVoiceChat = dynamic(() => import('@/components/MaiaVoiceChat'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gradient-to-b from-purple-950/20 to-black/40 backdrop-blur-sm rounded-lg border border-gold-amber/20">
      <div className="text-gold-amber">Loading voice chat...</div>
    </div>
  ),
});

/**
 * Test page for Maia Voice Chat
 * Navigate to /maia/voice-test to try it out
 */
export default function VoiceTestPage() {
  const [element, setElement] = useState<'fire' | 'water' | 'earth' | 'air' | 'aether'>('aether');
  const [style, setStyle] = useState<'natural' | 'consciousness' | 'adaptive'>('natural');

  return (
    <div className="min-h-screen bg-black text-white p-6" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gold-divine mb-2">
            Maia Voice Chat Test
          </h1>
          <p className="text-gold-amber text-base">
            Testing OpenAI Realtime API integration with Maia's Sacred Mirror system
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="mb-6 p-4 bg-purple-950/20 rounded-lg border border-gold-amber/20">
          <h2 className="text-lg font-semibold text-gold-divine mb-4">Configuration</h2>

          {/* Element Selection */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-2 font-medium">Element:</label>
            <div className="flex gap-2 flex-wrap">
              {(['fire', 'water', 'earth', 'air', 'aether'] as const).map((el) => (
                <button
                  key={el}
                  onClick={() => setElement(el)}
                  className={`px-4 py-2 rounded-md capitalize transition-all font-medium ${
                    element === el
                      ? 'bg-gold-amber/30 text-white border border-gold-amber/60'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:border hover:border-gold-amber/40'
                  }`}
                >
                  {el}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm text-white mb-2 font-medium">Conversation Style:</label>
            <div className="flex gap-2 flex-wrap">
              {(['natural', 'consciousness', 'adaptive'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStyle(st)}
                  className={`px-4 py-2 rounded-md capitalize transition-all font-medium ${
                    style === st
                      ? 'bg-gold-amber/30 text-white border border-gold-amber/60'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:border hover:border-gold-amber/40'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Chat Component */}
        <div className="h-[600px]">
          <MaiaVoiceChat
            userId="test-user"
            element={element}
            conversationStyle={style}
            autoConnect={false}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-950/20 rounded-lg border border-blue-500/20">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-300/80 space-y-1">
            <li>1. Click "Start Voice Conversation" to connect</li>
            <li>2. Allow microphone access when prompted</li>
            <li>3. Just speak naturally - Voice Activity Detection will handle turn-taking</li>
            <li>4. Maia will respond with voice automatically</li>
            <li>5. You can interrupt Maia by clicking "Interrupt" while she's speaking</li>
            <li>6. No echo loops - audio output won't be picked up by input</li>
          </ul>
        </div>

        {/* Expected Behavior */}
        <div className="mt-4 p-4 bg-emerald-950/20 rounded-lg border border-emerald-500/20">
          <h3 className="text-sm font-semibold text-emerald-400 mb-2">Expected Behavior:</h3>
          <ul className="text-sm text-emerald-300/80 space-y-1">
            <li>✅ ~250-320ms latency (feels like real conversation)</li>
            <li>✅ Automatic turn detection (VAD knows when you pause)</li>
            <li>✅ No transcription lag - direct audio streaming</li>
            <li>✅ Can interrupt mid-response</li>
            <li>✅ Built-in echo cancellation</li>
            <li>✅ Maia's personality preserved in system prompt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
