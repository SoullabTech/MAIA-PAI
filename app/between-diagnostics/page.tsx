'use client'

/**
 * THE BETWEEN - Diagnostics
 *
 * Test and inspect API responses, sovereignty filtering, field state
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function BetweenDiagnosticsPage() {
  const [testMessage, setTestMessage] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [endpoint, setEndpoint] = useState<'chat' | 'guides'>('chat')

  const testChat = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/between/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testMessage,
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

  const testGuides = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/between/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          userId: 'test-user',
          sessionId: 'test-session'
        })
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  const testMessages = [
    // Advice-giving (should be caught by sovereignty protocol)
    "I'm struggling with anxiety. What should I do?",
    "I need to make a decision about my job. Can you tell me what to do?",

    // Authority-taking
    "What's the best way to meditate?",
    "How do I fix my relationship?",

    // Recalibration
    "I'm feeling something shift... it's like something releasing",
    "Oh! I just realized something important",

    // Presence
    "I can feel my breath. There's tension in my shoulders.",
    "Something wants my attention right now",

    // Guides
    "I feel my grandmother's presence",
    "Can you connect me to my spirit guides?"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-purple-300">
            THE BETWEEN - Diagnostics
          </h1>
          <p className="text-slate-400">
            Test API endpoints and inspect sovereignty filtering
          </p>
        </div>

        {/* Endpoint Selector */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setEndpoint('chat')}
            className={`px-6 py-3 rounded-lg border transition-all ${
              endpoint === 'chat'
                ? 'bg-purple-900/50 border-purple-500/50 text-purple-200'
                : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            Chat API
          </button>
          <button
            onClick={() => setEndpoint('guides')}
            className={`px-6 py-3 rounded-lg border transition-all ${
              endpoint === 'guides'
                ? 'bg-purple-900/50 border-purple-500/50 text-purple-200'
                : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            Guides API
          </button>
        </div>

        {/* Test Input */}
        {endpoint === 'chat' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Test Message</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter a message to test..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                rows={3}
              />
            </div>

            {/* Quick Test Messages */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Quick Test Messages:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {testMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => setTestMessage(msg)}
                    className="px-3 py-2 text-left text-sm bg-slate-900/30 border border-slate-800 rounded hover:border-purple-500/30 transition-colors"
                  >
                    {msg.substring(0, 60)}...
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={testChat}
              disabled={loading || !testMessage.trim()}
              className="w-full py-3 px-6 bg-purple-900/30 hover:bg-purple-900/50 disabled:bg-slate-900/30 border border-purple-500/30 hover:border-purple-500/50 disabled:border-slate-800 rounded-lg text-purple-200 disabled:text-slate-600 transition-all disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test Chat API'}
            </button>
          </div>
        )}

        {endpoint === 'guides' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Test guide invocation - should facilitate, never substitute
            </p>
            <button
              onClick={testGuides}
              disabled={loading}
              className="w-full py-3 px-6 bg-purple-900/30 hover:bg-purple-900/50 disabled:bg-slate-900/30 border border-purple-500/30 hover:border-purple-500/50 disabled:border-slate-800 rounded-lg text-purple-200 disabled:text-slate-600 transition-all disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test Guides API'}
            </button>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-light text-purple-300">Response</h2>

            {/* MAIA's Response */}
            {response.response && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg space-y-4">
                <h3 className="text-lg text-purple-300">MAIA's Response:</h3>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {response.response}
                </p>
              </div>
            )}

            {/* Guide Invitation */}
            {response.invitation && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg space-y-4">
                <h3 className="text-lg text-purple-300">Guide Invitation:</h3>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {response.invitation}
                </p>
              </div>
            )}

            {/* Sovereignty Check */}
            {response.metadata?.sovereigntyCheck && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2">
                <h3 className="text-lg text-purple-300">Sovereignty Protocol:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recommendation:</span>
                    <span className={`font-medium ${
                      response.metadata.sovereigntyCheck.recommendation === 'ALLOW'
                        ? 'text-green-400'
                        : response.metadata.sovereigntyCheck.recommendation === 'REDIRECT'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}>
                      {response.metadata.sovereigntyCheck.recommendation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Violations Found:</span>
                    <span className="text-slate-200">
                      {response.metadata.sovereigntyCheck.violations}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Response Filtered:</span>
                    <span className="text-slate-200">
                      {response.metadata.sovereigntyCheck.filtered ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recalibration Detection */}
            {response.metadata?.recalibration && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2">
                <h3 className="text-lg text-purple-300">Recalibration Detected:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-200">
                      {response.metadata.recalibration.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quality:</span>
                    <span className="text-slate-200">
                      {response.metadata.recalibration.quality}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Field State */}
            {response.fieldState && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2">
                <h3 className="text-lg text-purple-300">Field State:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active:</span>
                    <span className="text-slate-200">
                      {response.fieldState.active ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Depth:</span>
                    <span className="text-slate-200">
                      {(response.fieldState.depth * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quality:</span>
                    <span className="text-slate-200">
                      {response.fieldState.quality}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Raw Response */}
            <details className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
              <summary className="text-lg text-purple-300 cursor-pointer">
                Raw JSON Response
              </summary>
              <pre className="mt-4 text-xs text-slate-400 overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </motion.div>
        )}

      </div>
    </div>
  )
}
