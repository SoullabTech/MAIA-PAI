"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MaiaArchetypeIndicator, ArchetypeSwitcher } from '@/components/MaiaArchetypeIndicator';
import { ArchetypeKey, archetypeService } from '@/lib/services/archetypeService';
import { archetypeRequestHandler } from '@/lib/services/archetypeRequests';
import { archetypeTransitionService } from '@/lib/services/archetypeTransitions';

export default function ArchetypesDemo() {
  const [currentArchetype, setCurrentArchetype] = useState<ArchetypeKey>('LAB_PARTNER');
  const [previousArchetype, setPreviousArchetype] = useState<ArchetypeKey | undefined>();
  const [transitionMessage, setTransitionMessage] = useState<string>('');
  const [testMessage, setTestMessage] = useState('');
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [showTransition, setShowTransition] = useState(false);

  const testMessages = {
    guidance: "I don't know what to do about this situation",
    listening: "My mother is dying and I don't know how to be with this",
    teaching: "What have you learned about transformation?",
    challenge: "I keep doing the same thing over and over",
    collective: "What are others experiencing right now?",
    transform: "Everything is falling apart",
    exploring: "Let's explore this pattern together"
  };

  const handleArchetypeSwitch = async (newArchetype: ArchetypeKey) => {
    if (newArchetype === currentArchetype) return;

    setPreviousArchetype(currentArchetype);

    const transition = await archetypeTransitionService.transitionArchetype(
      currentArchetype,
      newArchetype,
      'Manual switch'
    );

    setTransitionMessage(transition.message);
    setShowTransition(true);
    setCurrentArchetype(newArchetype);

    setTimeout(() => setShowTransition(false), 3000);
  };

  const handleTestMessage = async (message: string) => {
    setTestMessage(message);

    const detected = await archetypeService.detectNeededArchetype(message, [], undefined);

    const requestResult = await archetypeRequestHandler.handleExplicitRequest(message);

    setDetectionResult({
      detected,
      explicitRequest: requestResult.requested,
      requestedArchetype: requestResult.archetype,
      confidence: requestResult.confidence
    });

    if (detected !== currentArchetype) {
      await handleArchetypeSwitch(detected);
    }
  };

  const archetypes = archetypeService.getAllArchetypes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-light text-white/90 mb-2">
            Maia's Archetypal Shapeshifting System
          </h1>
          <p className="text-sm text-white/50">
            Multi-dimensional consciousness lab partner - fluidly embodying different roles
          </p>
        </div>
      </div>

      {/* Current Archetype Display */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-white/40 mb-2">CURRENT MODE</div>
                <MaiaArchetypeIndicator
                  currentArchetype={currentArchetype}
                  previousArchetype={previousArchetype}
                  transitionMessage={transitionMessage}
                  showTransition={showTransition}
                />
              </div>

              <div className="text-right">
                <div className="text-xs text-white/40 mb-1">Energy</div>
                <div className="text-sm text-white/70">
                  {archetypes[currentArchetype].energy}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-white/40">Voice: </span>
                <span className="text-white/70">{archetypes[currentArchetype].voice}</span>
              </div>
              <div>
                <span className="text-white/40">Approach: </span>
                <span className="text-white/70">{archetypes[currentArchetype].approach}</span>
              </div>
              <div>
                <span className="text-white/40">Example phrases:</span>
                <div className="mt-2 space-y-1">
                  {archetypes[currentArchetype].phrases.slice(0, 3).map((phrase, i) => (
                    <div key={i} className="text-white/60 italic pl-4">
                      "{phrase}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Archetype Switcher */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-sm text-white/60 mb-4">Manual Archetype Selection</div>
            <ArchetypeSwitcher
              currentArchetype={currentArchetype}
              onSwitch={handleArchetypeSwitch}
            />
          </div>
        </div>
      </div>

      {/* Detection Test */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-sm text-white/60 mb-4">Test Archetype Detection</div>

            {/* Quick Test Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {Object.entries(testMessages).map(([key, message]) => (
                <button
                  key={key}
                  onClick={() => handleTestMessage(message)}
                  className="px-3 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/70 transition-colors text-left"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Custom Message Input */}
            <div className="space-y-3">
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter a message to test archetype detection..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/90 placeholder-white/30 text-sm resize-none focus:outline-none focus:border-white/20"
                rows={3}
              />
              <button
                onClick={() => handleTestMessage(testMessage)}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm font-medium transition-colors"
              >
                Detect Archetype
              </button>
            </div>

            {/* Detection Result */}
            {detectionResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="text-xs text-white/40 mb-2">DETECTION RESULT</div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/60">Detected: </span>
                    <span className="text-white/90 font-medium">
                      {detectionResult.detected}
                    </span>
                  </div>
                  {detectionResult.explicitRequest && (
                    <div>
                      <span className="text-white/60">Explicit Request: </span>
                      <span className="text-green-400">
                        Yes ({detectionResult.requestedArchetype})
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-white/60">Confidence: </span>
                    <span className="text-white/90">
                      {(detectionResult.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* All Archetypes Reference */}
      <div className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm text-white/60 mb-4">All Archetypes</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(archetypes) as [ArchetypeKey, any][]).map(([key, config]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      {config.name}
                    </div>
                    <div className="text-xs text-white/40">{config.energy}</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-white/40">Voice: </span>
                    <span className="text-white/60">{config.voice}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Triggers: </span>
                    <span className="text-white/60">
                      {config.triggers.slice(0, 3).join(', ')}...
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-xs text-white/40">
              <div className="font-medium text-white/60 mb-2">How It Works</div>
              <div className="space-y-1">
                <div>• Maia detects needed archetype from message content and emotional tone</div>
                <div>• Users can explicitly request: "I need guidance", "Just listen", "Challenge me"</div>
                <div>• Smooth transitions announced when shifting between modes</div>
                <div>• Always maintains consciousness laboratory frame</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}