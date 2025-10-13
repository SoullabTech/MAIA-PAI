'use client';

/**
 * Spiralogic Astrology Dashboard
 *
 * Combines:
 * - Birth chart data
 * - Spiralogic facet mapping (12 houses → elemental pathways)
 * - Archetypal aspect synthesis (soul-level interpretations)
 * - Visual chart representation
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Circle, Triangle } from 'lucide-react';
import { SacredNatalChart } from '@/components/sacred-tools/astrology/SacredNatalChart';
import { useUserAuth } from '@/lib/hooks/useUserAuth';
import { getZodiacArchetype } from '@/lib/astrology/archetypeLibrary';

interface BirthChartData {
  sun: { sign: string; degree: number; house: number };
  moon: { sign: string; degree: number; house: number };
  ascendant: { sign: string; degree: number };
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  }>;
}

export default function AstrologyPage() {
  const { user } = useUserAuth();
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API when authentication implemented
    // For now, use hardcoded chart data
    setChartData({
      sun: { sign: 'Sagittarius', degree: 17.23, house: 4 },
      moon: { sign: 'Pisces', degree: 23.45, house: 7 },
      ascendant: { sign: 'Leo', degree: 28.12 },
      aspects: [
        { planet1: 'Sun', planet2: 'Saturn', type: 'square', orb: 5.89 },
        { planet1: 'Moon', planet2: 'Saturn', type: 'conjunction', orb: 0.33 },
        { planet1: 'Sun', planet2: 'Jupiter', type: 'quincunx', orb: 9.2 },
        { planet1: 'Moon', planet2: 'Neptune', type: 'trine', orb: 0.56 },
      ],
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-soul-background via-soul-surface to-soul-background flex items-center justify-center">
        <div className="text-soul-textSecondary">Loading your cosmic blueprint...</div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-soul-background via-soul-surface to-soul-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-soul-textSecondary mb-4">No birth chart data available</p>
          <Link href="/settings" className="text-soul-accent hover:text-soul-accentGlow">
            Calculate your chart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-soul-background via-soul-surface to-soul-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-soul-text mb-2">Your Cosmic Blueprint</h1>
          <p className="text-soul-textSecondary">Spiralogic Astrology: Elemental Pathways of Consciousness</p>
        </div>

        {/* Sacred Natal Chart Visualization */}
        <div className="mb-12">
          <SacredNatalChart
            userId={user?.id || 'user_1760278086001'}
            birthData={{
              date: '1966-12-09',
              time: '22:29:00',
              location: { lat: 30.4515, lng: -91.1871 } // Baton Rouge, LA
            }}
            onComplete={(sessionData) => {
              console.log('Chart session completed:', sessionData);
            }}
          />
        </div>

        {/* Big Three */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Sun */}
          <div className="bg-soul-surface/60 backdrop-blur-sm border border-soul-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-2xl">☉</span>
              </div>
              <div>
                <h3 className="text-soul-text font-semibold">Sun · Core Identity</h3>
                <p className="text-sm text-soul-textSecondary">Conscious Expression</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-soul-accent">
                {chartData.sun.sign} · {getZodiacArchetype(chartData.sun.sign.toLowerCase())?.facetName || 'The Explorer'}
              </p>
              <p className="text-sm text-soul-textSecondary">
                {chartData.sun.degree.toFixed(1)}° · House {chartData.sun.house}
              </p>
              <p className="text-sm text-soul-textTertiary italic mt-2">
                {getZodiacArchetype(chartData.sun.sign.toLowerCase())?.archetypes.mythological?.[0] || 'Archetypal essence'}
              </p>
              <Link
                href={`/astrology/placements/sun`}
                className="text-sm text-soul-accentGlow hover:underline inline-flex items-center gap-1"
              >
                Explore deeper <Sparkles className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Moon */}
          <div className="bg-soul-surface/60 backdrop-blur-sm border border-soul-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <span className="text-2xl">☽</span>
              </div>
              <div>
                <h3 className="text-soul-text font-semibold">Moon · Emotional Truth</h3>
                <p className="text-sm text-soul-textSecondary">Subconscious Landscape</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-indigo-400">
                {chartData.moon.sign} · {getZodiacArchetype(chartData.moon.sign.toLowerCase())?.facetName || 'The Mystic'}
              </p>
              <p className="text-sm text-soul-textSecondary">
                {chartData.moon.degree.toFixed(1)}° · House {chartData.moon.house}
              </p>
              <p className="text-sm text-soul-textTertiary italic mt-2">
                {getZodiacArchetype(chartData.moon.sign.toLowerCase())?.archetypes.mythological?.[0] || 'Emotional archetype'}
              </p>
              <Link
                href={`/astrology/placements/moon`}
                className="text-sm text-soul-accentGlow hover:underline inline-flex items-center gap-1"
              >
                Explore deeper <Sparkles className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Ascendant */}
          <div className="bg-soul-surface/60 backdrop-blur-sm border border-soul-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">⇡</span>
              </div>
              <div>
                <h3 className="text-soul-text font-semibold">Ascendant · Life Portal</h3>
                <p className="text-sm text-soul-textSecondary">How You Meet the World</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-rose-400">
                {chartData.ascendant.sign} · {getZodiacArchetype(chartData.ascendant.sign.toLowerCase())?.facetName || 'The Sustainer'}
              </p>
              <p className="text-sm text-soul-textSecondary">
                {chartData.ascendant.degree.toFixed(1)}°
              </p>
              <p className="text-sm text-soul-textTertiary italic mt-2">
                {getZodiacArchetype(chartData.ascendant.sign.toLowerCase())?.archetypes.mythological?.[0] || 'Rising energy'}
              </p>
              <Link
                href={`/astrology/placements/ascendant`}
                className="text-sm text-soul-accentGlow hover:underline inline-flex items-center gap-1"
              >
                Explore deeper <Sparkles className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Major Aspects */}
        <div className="bg-soul-surface/60 backdrop-blur-sm border border-soul-border rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-soul-text mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-soul-accent" />
            Major Aspects
          </h2>
          <p className="text-soul-textSecondary mb-6">
            Archetypal dynamics between planetary energies in your chart
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartData.aspects.map((aspect, index) => {
              const aspectIcon = aspect.type === 'square' ? '□' :
                aspect.type === 'conjunction' ? '☌' :
                  aspect.type === 'trine' ? '△' :
                    aspect.type === 'quincunx' ? '⚻' : '○';

              const aspectColor = aspect.type === 'square' ? 'text-red-400' :
                aspect.type === 'conjunction' ? 'text-amber-400' :
                  aspect.type === 'trine' ? 'text-green-400' :
                    'text-blue-400';

              return (
                <Link
                  key={index}
                  href={`/astrology/aspects/${aspect.planet1.toLowerCase()}-${aspect.type}-${aspect.planet2.toLowerCase()}`}
                  className="group bg-soul-background/40 border border-soul-borderSubtle hover:border-soul-accent/40 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-soul-accent/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl ${aspectColor}`}>{aspectIcon}</span>
                      <span className="text-soul-text font-semibold">
                        {aspect.planet1} {aspect.type} {aspect.planet2}
                      </span>
                    </div>
                    <span className="text-xs text-soul-textTertiary">
                      {aspect.orb.toFixed(1)}° orb
                    </span>
                  </div>
                  <p className="text-sm text-soul-textSecondary group-hover:text-soul-accentGlow transition-colors">
                    Tap to explore archetypal interpretation →
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Spiralogic Pathways */}
        <div className="bg-soul-surface/60 backdrop-blur-sm border border-soul-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-soul-text mb-6">Spiralogic Pathways</h2>
          <p className="text-soul-textSecondary mb-6">
            The 12 houses organized by elemental pathways and consciousness functions
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fire Pathway */}
            <Link
              href="/astrology/pathways/fire"
              className="group bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 hover:border-orange-500/60 rounded-lg p-6 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🔥</div>
                <div>
                  <h3 className="text-xl font-bold text-soul-text">Fire Pathway</h3>
                  <p className="text-sm text-soul-textSecondary">Houses 1, 5, 9 · Vision & Projection</p>
                </div>
              </div>
              <p className="text-soul-textSecondary group-hover:text-soul-text transition-colors">
                Experience → Expression → Expansion
              </p>
            </Link>

            {/* Water Pathway */}
            <Link
              href="/astrology/pathways/water"
              className="group bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 hover:border-blue-500/60 rounded-lg p-6 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">💧</div>
                <div>
                  <h3 className="text-xl font-bold text-soul-text">Water Pathway</h3>
                  <p className="text-sm text-soul-textSecondary">Houses 4, 8, 12 · Introspection & Depth</p>
                </div>
              </div>
              <p className="text-soul-textSecondary group-hover:text-soul-text transition-colors">
                Heart → Healing → Holiness
              </p>
            </Link>

            {/* Earth Pathway */}
            <Link
              href="/astrology/pathways/earth"
              className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500/60 rounded-lg p-6 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🌍</div>
                <div>
                  <h3 className="text-xl font-bold text-soul-text">Earth Pathway</h3>
                  <p className="text-sm text-soul-textSecondary">Houses 2, 6, 10 · Manifestation & Grounding</p>
                </div>
              </div>
              <p className="text-soul-textSecondary group-hover:text-soul-text transition-colors">
                Mission → Means → Medicine
              </p>
            </Link>

            {/* Air Pathway */}
            <Link
              href="/astrology/pathways/air"
              className="group bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border border-cyan-500/30 hover:border-cyan-500/60 rounded-lg p-6 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🌬</div>
                <div>
                  <h3 className="text-xl font-bold text-soul-text">Air Pathway</h3>
                  <p className="text-sm text-soul-textSecondary">Houses 3, 7, 11 · Communication & Connection</p>
                </div>
              </div>
              <p className="text-soul-textSecondary group-hover:text-soul-text transition-colors">
                Connection → Community → Consciousness
              </p>
            </Link>
          </div>

          {/* Deep Dive Link */}
          <div className="mt-8">
            <Link
              href="/deep-dive"
              className="group block bg-gradient-to-br from-amber-900/40 to-orange-900/40 hover:from-amber-800/50 hover:to-orange-800/50 border border-amber-700/40 hover:border-amber-600/60 rounded-xl p-8 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📖</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-soul-text group-hover:text-soul-accent transition-colors mb-2">
                    The Deep Dive: Elemental Alchemy
                  </h3>
                  <p className="text-soul-textSecondary mb-3">
                    Go beyond your chart into the phenomenological journey through consciousness.
                    Kelly Beard's book as living curriculum.
                  </p>
                  <div className="flex items-center gap-2 text-soul-accentGlow text-sm">
                    <span>Begin your transformation</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Mayan Astrology Link */}
          <div className="mt-6 text-center">
            <Link
              href="/astrology/mayan"
              className="group inline-flex items-center gap-3 bg-gradient-to-br from-amber-900/30 to-orange-900/30 hover:from-amber-800/40 hover:to-orange-800/40 border border-amber-700/30 hover:border-amber-600/50 rounded-xl p-6 transition-all duration-300"
            >
              <div className="text-4xl">☀️</div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-soul-text group-hover:text-soul-accent transition-colors">
                  Mayan Astrology
                </h3>
                <p className="text-soul-textSecondary text-sm">
                  Discover your Galactic Signature in the Tzolk'in Sacred Calendar →
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
