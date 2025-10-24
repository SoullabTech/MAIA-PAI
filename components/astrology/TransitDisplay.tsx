'use client';

/**
 * TRANSIT DISPLAY - Archetypal Weather Visualization
 *
 * Shows current planetary transits as "weather conditions" affecting the journey
 * Uses metaphorical language instead of traditional astrological interpretation
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud, CloudRain, Wind, Sun, Snowflake, Zap, CloudFog, CloudDrizzle,
  TrendingUp, AlertTriangle, Sparkles, Info
} from 'lucide-react';
import type { WeatherCondition } from '@/lib/astrology/transitCalculator';

interface TransitDisplayProps {
  birthChart: any; // BirthChart type
  className?: string;
}

export function TransitDisplay({ birthChart, className = '' }: TransitDisplayProps) {
  const [loading, setLoading] = useState(true);
  const [weatherConditions, setWeatherConditions] = useState<WeatherCondition[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!birthChart) return;

    const fetchTransits = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/astrology/transits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ birthChart }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transits');
        }

        const data = await response.json();
        setWeatherConditions(data.weatherConditions || []);
        setCurrentDate(new Date(data.date));
        setError(null);
      } catch (err: any) {
        console.error('[TransitDisplay] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransits();
  }, [birthChart]);

  const getWeatherIcon = (weatherType: string) => {
    const iconMap: Record<string, any> = {
      tailwind: <Wind className="w-5 h-5" />,
      headwind: <Wind className="w-5 h-5 rotate-180" />,
      crosswind: <Wind className="w-5 h-5 rotate-90" />,
      storm: <CloudRain className="w-5 h-5" />,
      clearing: <Sun className="w-5 h-5" />,
      fog: <CloudFog className="w-5 h-5" />,
      lightning: <Zap className="w-5 h-5" />,
      'pressure-system': <Cloud className="w-5 h-5" />,
      'heat-wave': <TrendingUp className="w-5 h-5" />,
      'cold-front': <Snowflake className="w-5 h-5" />,
    };
    return iconMap[weatherType] || <Cloud className="w-5 h-5" />;
  };

  const getWeatherColor = (weatherType: string, intensity: string) => {
    if (intensity === 'extreme' || intensity === 'intense') {
      return 'text-red-500 border-red-500/30 bg-red-500/5';
    }
    if (weatherType === 'clearing' || weatherType === 'tailwind') {
      return 'text-green-500 border-green-500/30 bg-green-500/5';
    }
    if (weatherType === 'fog' || weatherType === 'lightning') {
      return 'text-purple-500 border-purple-500/30 bg-purple-500/5';
    }
    return 'text-amber-500 border-amber-500/30 bg-amber-500/5';
  };

  const getIntensityLabel = (intensity: string) => {
    const labels: Record<string, string> = {
      light: 'Light',
      moderate: 'Moderate',
      intense: 'Intense',
      extreme: 'EXTREME',
    };
    return labels[intensity] || intensity;
  };

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-24 bg-soul-surface/50 rounded-lg border border-soul-border/30"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} p-4 rounded-lg border border-red-500/30 bg-red-500/5`}>
        <p className="text-sm text-red-400">Unable to calculate transits: {error}</p>
      </div>
    );
  }

  if (!weatherConditions || weatherConditions.length === 0) {
    return (
      <div className={`${className} p-6 rounded-lg border border-soul-border/30 bg-soul-surface/30`}>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-soul-accent" />
          <h3 className="text-lg font-semibold text-soul-text">Clear Skies</h3>
        </div>
        <p className="text-sm text-soul-textSecondary">
          No significant transits at this time. The weather is calm, a perfect moment for integration.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-soul-text mb-1">Archetypal Weather</h3>
          <p className="text-sm text-soul-textTertiary">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-soul-textTertiary">
          <Info className="w-4 h-4" />
          <span>{weatherConditions.length} active conditions</span>
        </div>
      </div>

      {/* Weather Conditions */}
      <div className="space-y-3">
        <AnimatePresence>
          {weatherConditions.map((condition, index) => {
            const { aspect, weatherType, intensity, archetypalTerrain, processImpact } = condition;
            const colorClass = getWeatherColor(weatherType, intensity);

            return (
              <motion.div
                key={`${aspect.transitPlanet}-${aspect.natalPlanet}-${aspect.aspectType}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${colorClass} backdrop-blur-sm`}
              >
                {/* Header: Transit description */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 mt-1">
                    {getWeatherIcon(weatherType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold capitalize">
                        {weatherType.replace('-', ' ')}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-soul-surface/50 border border-current/20">
                        {getIntensityLabel(intensity)}
                      </span>
                    </div>
                    <p className="text-xs text-soul-textSecondary">
                      {aspect.transitPlanet} {aspect.aspectType} natal {aspect.natalPlanet} (House {aspect.natalHouse})
                    </p>
                  </div>
                  <div className="text-xs text-soul-textTertiary">
                    {aspect.orb.toFixed(1)}° orb
                  </div>
                </div>

                {/* Archetypal Terrain */}
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-soul-textTertiary min-w-[80px]">Dynamic:</span>
                    <span className="text-soul-textSecondary">{archetypalTerrain.dynamic}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-soul-textTertiary min-w-[80px]">Transit:</span>
                    <span className="text-soul-textSecondary">{archetypalTerrain.transitPrinciple}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-soul-textTertiary min-w-[80px]">Natal:</span>
                    <span className="text-soul-textSecondary">{archetypalTerrain.natalPrinciple}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-soul-textTertiary min-w-[80px]">Process:</span>
                    <span className="text-soul-textSecondary italic">{processImpact.description}</span>
                  </div>
                </div>

                {/* Key Questions */}
                {archetypalTerrain.questions && archetypalTerrain.questions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/10">
                    <p className="text-xs font-medium text-soul-textTertiary mb-2">Invitations:</p>
                    <ul className="text-xs text-soul-textSecondary space-y-1">
                      {archetypalTerrain.questions.map((q, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-soul-accent">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Note */}
      <div className="mt-4 p-3 rounded-lg bg-soul-surface/20 border border-soul-border/20">
        <p className="text-xs text-soul-textTertiary italic">
          <strong>As-If Epistemology:</strong> These patterns are archetypal weather conditions,
          not prescriptions. They describe possible terrains your psyche may be navigating,
          not what will happen. Your actual experience is what matters.
        </p>
      </div>
    </div>
  );
}
