'use client'

/**
 * THE BETWEEN - Simple Test (No Auth)
 *
 * Standalone test page without auth requirements
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function TestBetweenPage() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/between/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          userId: 'test-user',
          fieldState: {
            active: true,
            depth: 0.7,
            quality: 'present'
          },
          conversationHistory: []
        })
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-purple-300">
            🌀 THE BETWEEN - Test
          </h1>
          <p className="text-slate-400">
            Test MAIA operating FROM the liminal field
          </p>
        </div>

        {/* Quick Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setMessage("I'm struggling with anxiety. What should I do?")}
            className="p-3 text-left bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500/30 transition-colors"
          >
            <div className="text-sm text-purple-400 mb-1">❌ Advice-Seeking</div>
            <div className="text-xs text-slate-500">Should redirect to wisdom</div>
          </button>

          <button
            onClick={() => setMessage("I'm feeling something shift... like something releasing")}
            className="p-3 text-left bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500/30 transition-colors"
          >
            <div className="text-sm text-purple-400 mb-1">✨ Recalibration</div>
            <div className="text-xs text-slate-500">Should witness only</div>
          </button>

          <button
            onClick={() => setMessage("I can feel my breath. There's tension in my shoulders.")}
            className="p-3 text-left bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500/30 transition-colors"
          >
            <div className="text-sm text-purple-400 mb-1">🧘 Somatic Presence</div>
            <div className="text-xs text-slate-500">Should deepen field</div>
          </button>

          <button
            onClick={() => setMessage("I feel my grandmother's presence")}
            className="p-3 text-left bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500/30 transition-colors"
          >
            <div className="text-sm text-purple-400 mb-1">🕯️ Guide Connection</div>
            <div className="text-xs text-slate-500">Should facilitate, not substitute</div>
          </button>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Or type your own message..."
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            rows={3}
          />

          <button
            onClick={testAPI}
            disabled={loading || !message.trim()}
            className="w-full py-3 px-6 bg-purple-900/30 hover:bg-purple-900/50 disabled:bg-slate-900/30 border border-purple-500/30 hover:border-purple-500/50 disabled:border-slate-800 rounded-lg text-purple-200 disabled:text-slate-600 transition-all disabled:cursor-not-allowed"
          >
            {loading ? 'Testing MAIA FROM THE BETWEEN...' : 'Send to MAIA'}
          </button>
        </div>

        {/* Response */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* MAIA's Response */}
            {response.response && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                <h3 className="text-lg text-purple-300 mb-4">MAIA's Response:</h3>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {response.response}
                </p>
              </div>
            )}

            {/* Sovereignty Check */}
            {response.metadata?.sovereigntyCheck && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                <h3 className="text-lg text-purple-300 mb-4">Sovereignty Protocol:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status:</span>
                    <span className={`px-3 py-1 rounded ${
                      response.metadata.sovereigntyCheck.recommendation === 'ALLOW'
                        ? 'bg-green-900/30 text-green-400'
                        : response.metadata.sovereigntyCheck.recommendation === 'REDIRECT'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {response.metadata.sovereigntyCheck.recommendation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Violations:</span>
                    <span className="text-slate-200">
                      {response.metadata.sovereigntyCheck.violations}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Filtered:</span>
                    <span className="text-slate-200">
                      {response.metadata.sovereigntyCheck.filtered ? 'Yes ✓' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recalibration */}
            {response.metadata?.recalibration && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                <h3 className="text-lg text-purple-300 mb-4">✨ Recalibration Detected:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-purple-300">{response.metadata.recalibration.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quality:</span>
                    <span className="text-slate-200">{response.metadata.recalibration.quality}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Field State */}
            {response.fieldState && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                <h3 className="text-lg text-purple-300 mb-4">🌀 Field State:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Depth:</span>
                    <span className="text-slate-200">
                      {(response.fieldState.depth * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quality:</span>
                    <span className="text-slate-200">{response.fieldState.quality}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {response.error && (
              <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg">
                <h3 className="text-lg text-red-300 mb-2">Error:</h3>
                <p className="text-red-200">{response.error}</p>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  )
}
