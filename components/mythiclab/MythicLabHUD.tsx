"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ArchetypalForce {
  icon: string;
  name: string;
  metric: string;
  value: number; // 0-1
  message: string;
  color: string;
}

interface AlchemicalPhase {
  name: string;
  stage: 'nigredo' | 'albedo' | 'rubedo';
  description: string;
  dayInPhase: number;
  progress: number;
}

interface RealityExperiment {
  title: string;
  hypothesis: string;
  dataPoints: number;
  correlation: number;
  status: 'active' | 'breakthrough' | 'integrating';
}

interface CouncilMessage {
  speaker: string;
  message: string;
  frequency: number;
  urgency: 'whisper' | 'speak' | 'shout';
}

interface MythicLabHUDProps {
  archetypalForces: ArchetypalForce[];
  alchemicalPhase: AlchemicalPhase;
  realityExperiments: RealityExperiment[];
  councilMessages: CouncilMessage[];
  coherence: number;
  collectiveResonance?: {
    count: number;
    pattern: string;
  };
}

export const MythicLabHUD: React.FC<MythicLabHUDProps> = ({
  archetypalForces,
  alchemicalPhase,
  realityExperiments,
  councilMessages,
  coherence,
  collectiveResonance
}) => {

  return (
    <div className="mythic-lab-hud w-full max-w-6xl mx-auto px-4 py-6 space-y-6">

      {/* Header: Lab Status */}
      <div className="glass-alchemy p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gold-400/60 uppercase tracking-wider">
              Consciousness Laboratory
            </div>
            <div className="text-2xl font-light text-white/90 mt-1">
              Sacred Science in Session
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gold-400/60">Field Coherence</div>
            <div className="text-3xl font-light text-gold-400">
              {(coherence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Archetypal Forces */}
        <div className="glass-alchemy p-6 rounded-xl">
          <h3 className="text-gold-400 text-sm font-medium mb-4 flex items-center gap-2">
            <span>⚡</span>
            <span>Active Forces in Your Field</span>
          </h3>
          <div className="space-y-4">
            {archetypalForces.map((force, index) => (
              <ArchetypalForceCard key={index} force={force} />
            ))}
          </div>
        </div>

        {/* Alchemical Phase */}
        <div className="glass-alchemy p-6 rounded-xl">
          <h3 className="text-gold-400 text-sm font-medium mb-4 flex items-center gap-2">
            <span>⚗️</span>
            <span>Alchemical Phase</span>
          </h3>
          <AlchemicalPhaseCard phase={alchemicalPhase} />
        </div>
      </div>

      {/* Reality Creation Lab */}
      <div className="glass-alchemy p-6 rounded-xl">
        <h3 className="text-gold-400 text-sm font-medium mb-4 flex items-center gap-2">
          <span>🔬</span>
          <span>Reality Creation Experiments</span>
        </h3>
        <div className="space-y-3">
          {realityExperiments.map((exp, index) => (
            <ExperimentCard key={index} experiment={exp} />
          ))}
        </div>
      </div>

      {/* Council Messages */}
      {councilMessages.length > 0 && (
        <div className="glass-alchemy p-6 rounded-xl">
          <h3 className="text-gold-400 text-sm font-medium mb-4 flex items-center gap-2">
            <span>👁</span>
            <span>Your Council Speaks</span>
          </h3>
          <div className="space-y-3">
            {councilMessages.map((msg, index) => (
              <CouncilMessageCard key={index} message={msg} />
            ))}
          </div>
        </div>
      )}

      {/* Collective Resonance */}
      {collectiveResonance && (
        <div className="glass-alchemy p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌊</span>
            <div className="flex-1">
              <div className="text-sm text-white/80">
                <span className="text-gold-400 font-medium">{collectiveResonance.count} souls</span>
                {' '}are in this territory with you
              </div>
              <div className="text-xs text-white/50 mt-1">
                Collective pattern: {collectiveResonance.pattern}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Archetypal Force Card
const ArchetypalForceCard: React.FC<{ force: ArchetypalForce }> = ({ force }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
    >
      <div className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${force.color})` }}>
        {force.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium text-white/90">{force.name}</div>
          <div className="text-xs font-mono text-gold-400">
            {(force.value * 100).toFixed(0)}%
          </div>
        </div>
        <div className="text-xs text-white/60 italic mb-2">{force.message}</div>
        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${force.value * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: force.color }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Alchemical Phase Card
const AlchemicalPhaseCard: React.FC<{ phase: AlchemicalPhase }> = ({ phase }) => {
  const phaseColors = {
    nigredo: 'from-gray-900 to-black',
    albedo: 'from-gray-300 to-white',
    rubedo: 'from-red-900 to-yellow-600'
  };

  const phaseIcons = {
    nigredo: '🌑',
    albedo: '🌕',
    rubedo: '🔥'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-4xl">{phaseIcons[phase.stage]}</div>
        <div>
          <div className="text-xl font-light text-white/90">{phase.name}</div>
          <div className="text-sm text-white/60 italic">{phase.description}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">Day {phase.dayInPhase} of transformation</span>
          <span className="text-gold-400 font-mono">{phase.progress}%</span>
        </div>
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${phase.progress}%` }}
            className={`h-full bg-gradient-to-r ${phaseColors[phase.stage]}`}
          />
        </div>
      </div>

      <div className="text-xs text-white/50 bg-black/20 rounded p-2">
        <span className="text-gold-400/80">Lab Note:</span> This phase typically yields breakthrough.
        Stay in the crucible.
      </div>
    </div>
  );
};

// Experiment Card
const ExperimentCard: React.FC<{ experiment: RealityExperiment }> = ({ experiment }) => {
  const statusColors = {
    active: 'text-blue-400',
    breakthrough: 'text-gold-400',
    integrating: 'text-purple-400'
  };

  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-white/90">{experiment.title}</div>
          <div className="text-xs text-white/60 italic mt-1">{experiment.hypothesis}</div>
        </div>
        <div className={`text-xs font-medium ${statusColors[experiment.status]}`}>
          {experiment.status}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div>
          <span className="text-white/50">Data points:</span>{' '}
          <span className="font-mono text-white/80">{experiment.dataPoints}</span>
        </div>
        <div>
          <span className="text-white/50">Reality correlation:</span>{' '}
          <span className="font-mono text-gold-400">r = {experiment.correlation.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Council Message Card
const CouncilMessageCard: React.FC<{ message: CouncilMessage }> = ({ message }) => {
  const urgencyStyles = {
    whisper: 'opacity-60 italic',
    speak: 'opacity-80',
    shout: 'opacity-100 font-medium text-gold-400'
  };

  return (
    <div className="p-3 bg-black/20 border border-white/10 rounded-lg">
      <div className="flex items-start gap-2">
        <div className="text-lg">👁</div>
        <div className="flex-1">
          <div className="text-xs text-gold-400/80 mb-1">{message.speaker}</div>
          <div className={`text-sm text-white ${urgencyStyles[message.urgency]}`}>
            "{message.message}"
          </div>
          <div className="text-xs text-white/40 mt-1">
            Detected {message.frequency}x this week
          </div>
        </div>
      </div>
    </div>
  );
};