'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExtensionPanelProps } from '@/types/extensions';

/**
 * Weather Report Component
 *
 * Shows current archetypal weather patterns from planetary transits
 * Lives in RIGHT PANEL (→ Analytical/Framework)
 */
export function WeatherReport({ userId, settings }: ExtensionPanelProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentWeather();
  }, [userId]);

  async function fetchCurrentWeather() {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/astrology/current-weather?userId=${userId}`);
      // const data = await response.json();

      // For now, mock data
      const mockWeather = {
        date: new Date(),
        patterns: [
          {
            id: '1',
            weatherType: 'lightning',
            transitPlanet: 'Uranus',
            natalPlanet: 'Moon',
            aspect: 'opposition',
            orb: 0.78,
            intensity: 'extreme',
            archetypalTerrain: {
              transitPrinciple: 'Awakening, disruption, liberation',
              natalPrinciple: 'Emotional security, inner world, needs',
              dynamic: 'Lightning strike to the emotional foundation',
              questions: [
                'What security pattern is ready to shatter?',
                'What freedom is calling through this disruption?',
                'How might instability be a doorway rather than a threat?'
              ]
            },
            processImpact: {
              impactType: 'redirector',
              description: 'Sudden shifts in emotional terrain requiring new routes'
            }
          },
          {
            id: '2',
            weatherType: 'fog',
            transitPlanet: 'Neptune',
            natalPlanet: 'Mercury',
            aspect: 'trine',
            orb: 0.48,
            intensity: 'intense',
            archetypalTerrain: {
              transitPrinciple: 'Dissolution, transcendence, mysticism',
              natalPrinciple: 'Thinking, communication, perception',
              dynamic: 'Thought dissolves into direct knowing',
              questions: [
                'What wants to be sensed beyond words?',
                'Where does analysis need to soften into intuition?',
                'What if confusion is clarity-not-yet-formed?'
              ]
            },
            processImpact: {
              impactType: 'dissolver',
              description: 'Mental constructs softening, allowing spaciousness'
            }
          },
          {
            id: '3',
            weatherType: 'pressure-system',
            transitPlanet: 'Saturn',
            natalPlanet: 'Sun',
            aspect: 'square',
            orb: 1.67,
            intensity: 'intense',
            archetypalTerrain: {
              transitPrinciple: 'Structure, compression, refinement',
              natalPrinciple: 'Core identity, vitality, purpose',
              dynamic: 'Identity tested under pressure',
              questions: [
                'What wants to be distilled from your sense of self?',
                'Where is compression calling for deeper authenticity?',
                'What false identity falls away under this testing?'
              ]
            },
            processImpact: {
              impactType: 'inhibitor',
              description: 'Forward movement slowed for deepening and refinement'
            }
          }
        ]
      };

      setWeather(mockWeather);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-400/20 border-t-blue-400" />
        <p className="text-xs text-white/40 mt-2">Reading the sky...</p>
      </div>
    );
  }

  if (!weather || weather.patterns.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-white/40 text-sm">No significant weather patterns at this time.</p>
        <p className="text-white/30 text-xs mt-2">The sky is clear ✨</p>
      </div>
    );
  }

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'lightning': return '⚡';
      case 'fog': return '🌫️';
      case 'storm': return '🌩️';
      case 'pressure-system': return '🌀';
      case 'clearing': return '☀️';
      case 'tailwind': return '🍃';
      case 'headwind': return '💨';
      default: return '🌤️';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'extreme': return 'text-red-400';
      case 'intense': return 'text-orange-400';
      case 'moderate': return 'text-yellow-400';
      case 'light': return 'text-blue-400';
      default: return 'text-white/60';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-white/50">
        Current conditions • {new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>

      {weather.patterns.map((pattern: any, index: number) => (
        <motion.div
          key={pattern.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-white/10 rounded-lg p-4 bg-black/30 hover:bg-black/40 transition-colors"
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{getWeatherIcon(pattern.weatherType)}</span>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <h4 className="text-sm font-semibold text-white">
                  {pattern.transitPlanet} {pattern.aspect} {pattern.natalPlanet}
                </h4>
                <span className={`text-xs ${getIntensityColor(pattern.intensity)}`}>
                  {pattern.orb.toFixed(2)}° • {pattern.intensity}
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                {pattern.archetypalTerrain.dynamic}
              </p>
            </div>
          </div>

          {/* Process Impact */}
          <div className="mb-3 p-2 bg-white/5 rounded text-xs">
            <span className="text-white/50">Process Impact: </span>
            <span className="text-white/80">{pattern.processImpact.description}</span>
          </div>

          {/* Questions (As-If Invitations) */}
          {pattern.archetypalTerrain.questions.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-white/40">Questions to hold:</div>
              {pattern.archetypalTerrain.questions.map((q: string, i: number) => (
                <div key={i} className="text-xs text-white/70 pl-3 border-l-2 border-blue-400/30">
                  {q}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}

      {/* Summary */}
      <div className="pt-4 border-t border-white/10 text-xs text-white/50">
        <p>
          <span className="text-white/70">{weather.patterns.length}</span> active weather pattern
          {weather.patterns.length !== 1 ? 's' : ''} detected
        </p>
        <p className="mt-2 text-white/40">
          These patterns affect HOW you move through your current spiral phase, not WHERE you are.
        </p>
      </div>
    </div>
  );
}
