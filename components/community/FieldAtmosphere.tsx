/**
 * Field Atmosphere Component
 * Visualizes collective field state and adapts UI atmosphere
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Wind, Flame, Droplet } from 'lucide-react';
import type { FieldState } from '@/lib/community/chat-client';

interface FieldAtmosphereProps {
  fieldState: FieldState | null;
  showDetailed?: boolean;
}

export function FieldAtmosphere({ fieldState, showDetailed = false }: FieldAtmosphereProps) {
  if (!fieldState) return null;

  const { earth_energy, water_energy, air_energy, fire_energy, intensity_level, depth_level, coherence_level } = fieldState;

  // Determine dominant element
  const elements = [
    { name: 'earth', value: earth_energy, icon: '🪨', color: '#8B7355' },
    { name: 'water', value: water_energy, icon: '💧', color: '#4A90E2' },
    { name: 'air', value: air_energy, icon: '🌬️', color: '#A0AEC0' },
    { name: 'fire', value: fire_energy, icon: '🔥', color: '#F59E0B' },
  ];
  const dominant = elements.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));

  // Atmosphere descriptor
  const getAtmosphere = () => {
    if (intensity_level > 0.7 && depth_level > 0.7) return 'Profound & Intense';
    if (intensity_level > 0.7) return 'Energized & Active';
    if (depth_level > 0.7) return 'Deep & Contemplative';
    if (coherence_level > 0.7) return 'Unified & Harmonious';
    if (intensity_level < 0.3 && depth_level < 0.3) return 'Gentle & Surface';
    return 'Balanced & Flowing';
  };

  const atmosphere = getAtmosphere();

  if (!showDetailed) {
    // Compact version for header
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-ain-soph-gold/30 rounded-lg"
      >
        <span className="text-2xl">{dominant.icon}</span>
        <div className="flex-1">
          <div className="text-sm font-medium text-ain-soph-gold">Field Atmosphere</div>
          <div className="text-xs text-ain-soph-gold/70">{atmosphere}</div>
        </div>
        <Activity className="w-4 h-4 text-ain-soph-gold/50" />
      </motion.div>
    );
  }

  // Detailed version
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-ain-soph-gold/30 rounded-2xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-ain-soph-gold mb-1">Collective Field State</h3>
          <p className="text-sm text-ain-soph-gold/70">{atmosphere}</p>
        </div>
        <div className="text-4xl">{dominant.icon}</div>
      </div>

      {/* Elemental Balance */}
      <div className="space-y-3 mb-6">
        <div className="text-xs font-medium text-ain-soph-gold/70 uppercase tracking-wide">Elemental Balance</div>
        {elements.map((element) => (
          <div key={element.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span>{element.icon}</span>
                <span className="text-ain-soph-gold capitalize">{element.name}</span>
              </span>
              <span className="text-ain-soph-gold/70">{(element.value * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${element.value * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: element.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Atmosphere Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-ain-soph-gold/70">Intensity</span>
          </div>
          <div className="text-lg font-medium text-ain-soph-gold">
            {(intensity_level * 100).toFixed(0)}%
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-ain-soph-gold/70">Depth</span>
          </div>
          <div className="text-lg font-medium text-ain-soph-gold">
            {(depth_level * 100).toFixed(0)}%
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-ain-soph-gold/70">Coherence</span>
          </div>
          <div className="text-lg font-medium text-ain-soph-gold">
            {(coherence_level * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="mt-4 pt-4 border-t border-ain-soph-gold/20 flex items-center justify-between text-xs text-ain-soph-gold/60">
        <span>{fieldState.active_users_count} active souls</span>
        <span>{fieldState.messages_per_hour.toFixed(1)} msgs/hour</span>
        <span>Updated {new Date(fieldState.calculated_at).toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
}
