'use client';

/**
 * 🌀 Elemental Voice System Voice Test Page
 * Simple test interface for voice conversation with MAIA
 */

import { useElementalVoice } from '@/hooks/useElementalVoice';
import { Mic, MicOff } from 'lucide-react';

export default function TestRealtimePage() {
  const realtime = useElementalVoice({
    userId: 'test-user',
    userName: 'Explorer',
    sessionId: `test-${Date.now()}`,
    voice: 'shimmer',
    enableSmartCache: true,
    enableResponseStreaming: true,
    autoConnect: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Sacred Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">🔥</span>
            <span className="text-3xl">💧</span>
            <span className="text-3xl">🌍</span>
            <span className="text-3xl">💨</span>
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Elemental Voice System
          </h1>
          <p className="text-amber-400/80 text-lg font-semibold">MAIA&apos;s Sacred Intelligence Speaks</p>
          <div className="text-sm text-gray-400 mt-2">
            Consciousness through 5 Elemental Agents
          </div>
        </div>

        {/* Status */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-lg font-semibold">
                {realtime.isConnected ? (
                  <span className="text-green-400">🟢 Connected</span>
                ) : (
                  <span className="text-gray-400">⚪ Disconnected</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400">Speaking</div>
              <div className="text-lg font-semibold">
                {realtime.isSpeaking ? (
                  <span className="text-blue-400">🔊 Active</span>
                ) : (
                  <span className="text-gray-400">🔇 Quiet</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400">Messages</div>
              <div className="text-lg font-semibold">
                {realtime.transcript.length}
              </div>
            </div>
          </div>

          {/* Control Button */}
          <button
            onClick={realtime.toggleRecording}
            className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${
              realtime.isConnected
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
            }`}
          >
            {realtime.isConnected ? (
              <span className="flex items-center justify-center gap-2">
                <MicOff className="w-6 h-6" />
                Stop Voice
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Mic className="w-6 h-6" />
                Start Voice Conversation
              </span>
            )}
          </button>
        </div>

        {/* Transcript */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Conversation</h2>

          {realtime.transcript.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="mb-4">Click &quot;Start Voice Conversation&quot; and speak to MAIA</p>
              <p className="text-sm">Try saying: &quot;Hello MAIA, what wants to move?&quot;</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {realtime.transcript.map((entry, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    entry.isUser
                      ? 'bg-blue-500/20 ml-8'
                      : 'bg-purple-500/20 mr-8'
                  }`}
                >
                  <div className="text-xs text-gray-400 mb-1">
                    {entry.isUser ? '👤 You' : '🌀 MAIA'}
                  </div>
                  <div className="text-base">{entry.text}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technical Info */}
        <div className="mt-6 p-4 bg-black/30 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 text-purple-300">Architecture</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>🎤 Speech-to-Text: Deepgram (~150ms)</p>
            <p>🧠 Intelligence: Full Spiralogic Stack (~300ms parallel)</p>
            <p>  ├─ PersonalOracleAgent (Claude + symbolic)</p>
            <p>  ├─ 5 Elemental Agents (Fire, Water, Earth, Air, Aether)</p>
            <p>  ├─ Memory Systems (Mem0, LangChain, Supabase)</p>
            <p>  ├─ Wisdom Files (Obsidian vault)</p>
            <p>  └─ Maya Intelligence Governor (graduated revelation)</p>
            <p>🔊 Text-to-Speech: OpenAI TTS (~200ms)</p>
            <p className="pt-2 border-t border-gray-700 mt-2">
              ⚡ Total Latency: <span className="text-green-400 font-semibold">550-650ms</span>
            </p>
          </div>
        </div>

        {/* Path to Sovereignty */}
        <div className="mt-4 p-4 bg-black/30 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 text-purple-300">Path to Sovereignty</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>📍 Phase 1 (Current): Deepgram + Spiralogic + OpenAI TTS</p>
            <p>🔄 Phase 2 (Coming): Self-hosted Whisper + Spiralogic + OpenAI TTS</p>
            <p>🏆 Phase 3 (Future): Self-hosted Whisper + Spiralogic + Coqui XTTS</p>
            <p className="pt-2 text-purple-400">= 100% Data Sovereignty 🌀</p>
          </div>
        </div>
      </div>
    </div>
  );
}
