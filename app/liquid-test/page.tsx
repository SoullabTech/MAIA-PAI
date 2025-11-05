'use client';

/**
 * 🌊 LIQUID AI TEST PAGE
 *
 * Quick test interface to verify Liquid AI integration
 * Visit: http://localhost:3000/liquid-test
 */

import { useState } from 'react';
import { liquidClient } from '@/lib/liquid/LiquidClient';
import type { LiquidResponse, LiquidHealthStatus } from '@/lib/liquid/LiquidClient';

export default function LiquidTestPage() {
  const [prompt, setPrompt] = useState('What is consciousness?');
  const [response, setResponse] = useState<LiquidResponse | null>(null);
  const [health, setHealth] = useState<LiquidHealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await liquidClient.healthCheck();
      setHealth(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await liquidClient.generate({
        text: prompt,
        max_tokens: 100,
        temperature: 0.8
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-300 mb-2">
          🌊 Liquid AI Test Interface
        </h1>
        <p className="text-amber-200/70 mb-8">
          Testing MAIA ↔ Liquid AI integration (LFM-350M model)
        </p>

        {/* Health Check */}
        <div className="bg-slate-800/50 border border-amber-400/30 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-amber-300">
              Service Health
            </h2>
            <button
              onClick={handleHealthCheck}
              disabled={loading}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded text-amber-200 disabled:opacity-50"
            >
              Check Status
            </button>
          </div>

          {health && (
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  health.status === 'ok' ? 'bg-green-500' :
                  health.status === 'unavailable' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <span className="text-amber-200">
                  Status: {health.status}
                </span>
              </div>
              {health.liquid_service && (
                <>
                  <p className="text-amber-200/80">
                    Model: {health.liquid_service.model}
                  </p>
                  <p className="text-amber-200/80">
                    Ready: {health.liquid_service.ready ? 'Yes' : 'No'}
                  </p>
                </>
              )}
              {health.api_url && (
                <p className="text-amber-200/60 text-xs">
                  API: {health.api_url}
                </p>
              )}
              {health.error && (
                <p className="text-red-400">
                  Error: {health.error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Generation Test */}
        <div className="bg-slate-800/50 border border-amber-400/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-300 mb-4">
            Generate Response
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-amber-200 mb-2">
                Prompt:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-900/50 border border-amber-400/30 rounded p-3 text-amber-100 focus:outline-none focus:border-amber-400"
                rows={3}
                placeholder="Enter your prompt..."
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 rounded text-purple-200 font-semibold disabled:opacity-50"
            >
              {loading ? 'Generating...' : '🌊 Generate with Liquid AI'}
            </button>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded p-4">
                <p className="text-red-400 font-mono text-sm">
                  Error: {error}
                </p>
              </div>
            )}

            {response && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-amber-300 font-semibold mb-2">
                    Response:
                  </h3>
                  <p className="text-amber-100 leading-relaxed">
                    {response.reply}
                  </p>
                </div>

                <div className="flex gap-4 text-xs text-amber-200/60 font-mono border-t border-amber-400/20 pt-4">
                  <span>Model: {response.model}</span>
                  <span>•</span>
                  <span>Tokens: {response.tokens_generated}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-800/30 border border-amber-400/20 rounded-lg p-6">
          <h3 className="text-amber-300 font-semibold mb-2">
            How to Use
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-amber-200/80 text-sm">
            <li>Make sure the Liquid AI server is running on port 5050</li>
            <li>Click "Check Status" to verify the service is available</li>
            <li>Enter a prompt and click "Generate" to test the model</li>
            <li>Check the browser console for detailed logs (🌊 [LIQUID] ...)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
