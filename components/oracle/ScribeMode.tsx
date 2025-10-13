/**
 * Scribe Mode UI Component
 * Allows MAIA to silently observe and take notes during conversations
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mic, Music, PenTool, Send, Sparkles } from 'lucide-react';

interface WitnessSession {
  sessionId: string;
  active: boolean;
  observationCount: number;
  themes: string[];
}

interface CreativeExpressionForm {
  type: 'poetry' | 'lyrics' | 'song' | 'prose';
  content: string;
  title?: string;
}

export function ScribeMode({ userId }: { userId: string }) {
  const [isWitnessing, setIsWitnessing] = useState(false);
  const [currentSession, setCurrentSession] = useState<WitnessSession | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [observationInput, setObservationInput] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState('');
  const [showCreativeForm, setShowCreativeForm] = useState(false);
  const [creativeExpression, setCreativeExpression] = useState<CreativeExpressionForm>({
    type: 'poetry',
    content: '',
    title: ''
  });
  const [sessionReflection, setSessionReflection] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Start witness session
  const startWitnessSession = async () => {
    try {
      const response = await fetch('/api/oracle/scribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          userId,
          sessionId: `witness_${Date.now()}`,
          participants,
          metadata: {
            context: 'Silent witness mode - observing without interrupting',
            purpose: 'Deep listening and elemental awareness'
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsWitnessing(true);
        setCurrentSession({
          sessionId: data.sessionId,
          active: true,
          observationCount: 0,
          themes: []
        });
      }
    } catch (error) {
      console.error('Failed to start witness session:', error);
    }
  };

  // Add observation
  const addObservation = async () => {
    if (!currentSession || !observationInput || !currentSpeaker) return;

    try {
      await fetch('/api/oracle/scribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'observe',
          userId,
          sessionId: currentSession.sessionId,
          speaker: currentSpeaker,
          content: observationInput,
          metadata: {
            timestamp: Date.now()
          }
        })
      });

      setCurrentSession(prev => prev ? {
        ...prev,
        observationCount: prev.observationCount + 1
      } : null);
      setObservationInput('');
    } catch (error) {
      console.error('Failed to add observation:', error);
    }
  };

  // Submit creative expression
  const submitCreativeExpression = async () => {
    if (!creativeExpression.content) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/oracle/scribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'creative',
          userId,
          sessionId: currentSession?.sessionId || `creative_${Date.now()}`,
          type: creativeExpression.type,
          content: creativeExpression.content,
          title: creativeExpression.title,
          artistName: userId
        })
      });

      const data = await response.json();

      // Show MAIA's response
      if (data.maiaResponse) {
        setSessionReflection({
          type: 'creative_response',
          message: data.maiaResponse,
          element: data.analysis?.elementalResonance?.primary
        });
      }

      setShowCreativeForm(false);
      setCreativeExpression({ type: 'poetry', content: '', title: '' });
    } catch (error) {
      console.error('Failed to submit creative expression:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // End session and get reflection
  const endSessionAndReflect = async () => {
    if (!currentSession) return;

    setIsProcessing(true);
    try {
      // End session
      const endResponse = await fetch('/api/oracle/scribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end',
          userId,
          sessionId: currentSession.sessionId
        })
      });

      const endData = await endResponse.json();

      // Get reflection
      if (endData.success) {
        const reflectResponse = await fetch('/api/oracle/scribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reflect',
            userId,
            reflectSessionId: currentSession.sessionId
          })
        });

        const reflectData = await reflectResponse.json();
        setSessionReflection(reflectData.reflection);
      }

      setIsWitnessing(false);
      setCurrentSession(null);
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          MAIA's Silent Witness Mode
        </h2>
        <p className="text-gray-400">
          {isWitnessing
            ? "👁️ MAIA is silently witnessing and taking notes..."
            : "Let MAIA observe without interrupting, then receive her insights"}
        </p>
      </motion.div>

      {/* Session Controls */}
      {!isWitnessing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-purple-400">Start Witness Session</h3>

          {/* Add Participants */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Who's in the conversation?</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Participant name"
                className="flex-1 px-4 py-2 bg-black/50 rounded-lg text-white"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newParticipant) {
                    setParticipants([...participants, newParticipant]);
                    setNewParticipant('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newParticipant) {
                    setParticipants([...participants, newParticipant]);
                    setNewParticipant('');
                  }
                }}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Add
              </button>
            </div>

            {/* Show participants */}
            <div className="flex flex-wrap gap-2 mt-2">
              {participants.map((p, i) => (
                <span key={i} className="px-3 py-1 bg-purple-900/50 rounded-full text-sm">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={startWitnessSession}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Start Silent Witnessing
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Active Session Info */}
          <div className="bg-purple-900/30 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-purple-400">Session Active</p>
              <p className="text-sm text-gray-400">
                {currentSession?.observationCount || 0} observations recorded
              </p>
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Eye className="w-6 h-6 text-purple-400" />
            </motion.div>
          </div>

          {/* Observation Input */}
          <div className="bg-gray-900/50 rounded-xl p-4 space-y-3">
            <h4 className="text-purple-400">Add Observation</h4>

            <select
              value={currentSpeaker}
              onChange={(e) => setCurrentSpeaker(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 rounded-lg text-white"
            >
              <option value="">Select speaker...</option>
              {participants.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>

            <textarea
              placeholder="What was said or observed..."
              className="w-full px-4 py-3 bg-black/50 rounded-lg text-white h-24"
              value={observationInput}
              onChange={(e) => setObservationInput(e.target.value)}
            />

            <button
              onClick={addObservation}
              disabled={!currentSpeaker || !observationInput}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Record Observation
            </button>
          </div>

          {/* Creative Expression Button */}
          <button
            onClick={() => setShowCreativeForm(true)}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg hover:from-pink-700 hover:to-purple-700 flex items-center justify-center gap-2"
          >
            <Music className="w-5 h-5" />
            Share Creative Expression
          </button>

          {/* End Session */}
          <button
            onClick={endSessionAndReflect}
            className="w-full py-3 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            <EyeOff className="w-5 h-5" />
            End Session & Get MAIA's Reflection
          </button>
        </motion.div>
      )}

      {/* Creative Expression Form */}
      <AnimatePresence>
        {showCreativeForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
          >
            <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full space-y-4">
              <h3 className="text-2xl font-bold text-purple-400">Share Your Creative Expression</h3>

              <div>
                <label className="text-sm text-gray-400">Type</label>
                <select
                  value={creativeExpression.type}
                  onChange={(e) => setCreativeExpression({
                    ...creativeExpression,
                    type: e.target.value as any
                  })}
                  className="w-full mt-1 px-4 py-2 bg-black/50 rounded-lg text-white"
                >
                  <option value="poetry">Poetry</option>
                  <option value="lyrics">Lyrics</option>
                  <option value="song">Song</option>
                  <option value="prose">Prose</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400">Title (optional)</label>
                <input
                  type="text"
                  value={creativeExpression.title}
                  onChange={(e) => setCreativeExpression({
                    ...creativeExpression,
                    title: e.target.value
                  })}
                  className="w-full mt-1 px-4 py-2 bg-black/50 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Your {creativeExpression.type}</label>
                <textarea
                  value={creativeExpression.content}
                  onChange={(e) => setCreativeExpression({
                    ...creativeExpression,
                    content: e.target.value
                  })}
                  placeholder="Share your creative expression..."
                  className="w-full mt-1 px-4 py-3 bg-black/50 rounded-lg text-white h-64"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitCreativeExpression}
                  disabled={!creativeExpression.content || isProcessing}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Share with MAIA'}
                </button>
                <button
                  onClick={() => setShowCreativeForm(false)}
                  className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Reflection */}
      <AnimatePresence>
        {sessionReflection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-purple-400">MAIA's Reflection</h3>
            </div>

            {sessionReflection.type === 'creative_response' ? (
              <div className="space-y-3">
                <p className="text-white leading-relaxed">{sessionReflection.message}</p>
                {sessionReflection.element && (
                  <p className="text-sm text-purple-300">
                    Element: {sessionReflection.element.element} - {sessionReflection.element.quality}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sessionReflection.personalizedInsights?.length > 0 && (
                  <div>
                    <h4 className="text-purple-300 font-semibold mb-2">Insights for You</h4>
                    {sessionReflection.personalizedInsights.map((insight: string, i: number) => (
                      <p key={i} className="text-gray-300 mb-2">• {insight}</p>
                    ))}
                  </div>
                )}

                {sessionReflection.patternsNoticed?.length > 0 && (
                  <div>
                    <h4 className="text-purple-300 font-semibold mb-2">Patterns Witnessed</h4>
                    {sessionReflection.patternsNoticed.map((pattern: string, i: number) => (
                      <p key={i} className="text-gray-300 mb-2">• {pattern}</p>
                    ))}
                  </div>
                )}

                {sessionReflection.elementalWisdom && (
                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-purple-300 font-semibold">
                      {sessionReflection.elementalWisdom.element.toUpperCase()} WISDOM
                    </p>
                    <p className="text-white mt-1">
                      {sessionReflection.elementalWisdom.message}
                    </p>
                  </div>
                )}

                {sessionReflection.questionsForContemplation?.length > 0 && (
                  <div>
                    <h4 className="text-purple-300 font-semibold mb-2">Questions to Contemplate</h4>
                    {sessionReflection.questionsForContemplation.map((q: string, i: number) => (
                      <p key={i} className="text-gray-300 italic mb-2">"{q}"</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setSessionReflection(null)}
              className="px-4 py-2 bg-purple-600/50 rounded-lg hover:bg-purple-600/70"
            >
              Close Reflection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}