'use client';

/**
 * The Blueprint - Your Cosmic Spiral
 *
 * A living map of consciousness woven through celestial rhythms.
 * Not a dashboard — a threshold into archetypal wisdom.
 *
 * Embodies the Spiral Journey philosophy:
 * - Wonder over instruction
 * - Discovery over completion
 * - Rhythm over toggle
 * - Inevitable over engineered
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Droplet, Sprout, Wind, Sparkle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ElementalBalanceDisplay } from '@/components/astrology/ElementalBalanceDisplay';
import { SacredHouseWheel } from '@/components/astrology/SacredHouseWheel';
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

// Elemental color configuration (from your design system)
const elementalColors = {
  fire: {
    day: { primary: '#C85450', accent: '#F5A362', glow: 'rgba(200, 84, 80, 0.2)' },
    night: { primary: '#F5A362', accent: '#C85450', glow: 'rgba(245, 163, 98, 0.3)' },
  },
  water: {
    day: { primary: '#6B9BD1', accent: '#8BADD6', glow: 'rgba(107, 155, 209, 0.2)' },
    night: { primary: '#8BADD6', accent: '#3D5A80', glow: 'rgba(139, 173, 214, 0.3)' },
  },
  earth: {
    day: { primary: '#7A9A65', accent: '#A8C69F', glow: 'rgba(122, 154, 101, 0.2)' },
    night: { primary: '#A8C69F', accent: '#5F7A4F', glow: 'rgba(168, 198, 159, 0.3)' },
  },
  air: {
    day: { primary: '#D4B896', accent: '#E8D4BF', glow: 'rgba(212, 184, 150, 0.2)' },
    night: { primary: '#E8D4BF', accent: '#B8997A', glow: 'rgba(232, 212, 191, 0.3)' },
  },
  aether: {
    day: { primary: '#9B8FAA', accent: '#B5A8C1', glow: 'rgba(155, 143, 170, 0.2)' },
    night: { primary: '#B5A8C1', accent: '#7D6E8F', glow: 'rgba(181, 168, 193, 0.3)' },
  },
};

export default function AstrologyPage() {
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [elementalBalance, setElementalBalance] = useState({
    fire: 0.28,
    water: 0.38,
    earth: 0.18,
    air: 0.16,
  });

  // Circadian rhythm - living color that breathes with time
  const [isDayMode, setIsDayMode] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsDayMode(hour >= 6 && hour < 20); // Day mode 6am-8pm
  }, []);

  useEffect(() => {
    // Fetch birth chart from API (using your correct placements)
    async function fetchChart() {
      try {
        const response = await fetch('/api/astrology/birth-chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: '1990-01-01', // Placeholder - will use real data when form is filled
            time: '12:00',
            location: { lat: 0, lng: 0, timezone: 'UTC' },
          }),
        });
        const result = await response.json();
        if (result.success && result.data) {
          setChartData({
            sun: result.data.sun,
            moon: result.data.moon,
            ascendant: result.data.ascendant,
            aspects: result.data.aspects,
          });
        }
      } catch (error) {
        console.error('Error fetching chart:', error);
        // Fallback to your correct placements
        setChartData({
          sun: { sign: 'Sagittarius', degree: 17.2, house: 4 },
          moon: { sign: 'Scorpio', degree: 23.4, house: 8 },
          ascendant: { sign: 'Leo', degree: 28.1 },
          aspects: [
            { planet1: 'Sun', planet2: 'Jupiter', type: 'conjunction', orb: 1.2 },
            { planet1: 'Moon', planet2: 'Venus', type: 'conjunction', orb: 0.8 },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchChart();
  }, []);

  // Threshold - The invitation unfolds
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-[3000ms]
        ${isDayMode
          ? 'bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100'
          : 'bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]'
        }`}>
        {/* Soft spiral unfurling - entry metaphor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="relative z-10"
        >
          <Sparkle
            className={`w-12 h-12 ${isDayMode ? 'text-amber-600' : 'text-amber-400'} animate-pulse`}
            style={{ filter: `drop-shadow(0 0 12px ${isDayMode ? 'rgba(217, 119, 6, 0.3)' : 'rgba(251, 191, 36, 0.4)'})` }}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={`absolute mt-24 text-sm ${isDayMode ? 'text-stone-600' : 'text-stone-400'} font-serif italic`}
        >
          The cosmos remembers you...
        </motion.p>
      </div>
    );
  }

  // Gentle invitation to begin
  if (!chartData) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-[3000ms]
        ${isDayMode
          ? 'bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100'
          : 'bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]'
        }`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center relative z-10 max-w-md px-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6"
          >
            <Sparkles
              className={`w-16 h-16 mx-auto ${isDayMode ? 'text-amber-600' : 'text-amber-400'}`}
              style={{ filter: `drop-shadow(0 0 16px ${elementalColors.aether[isDayMode ? 'day' : 'night'].glow})` }}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${isDayMode ? 'text-stone-700' : 'text-stone-300'} mb-6 font-serif text-lg leading-relaxed`}
          >
            Your blueprint awaits.
            <br />
            The field knows your breath.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/settings"
              className={`inline-block px-6 py-3 rounded-full transition-all duration-500
                ${isDayMode
                  ? 'bg-amber-100/50 text-amber-900 hover:bg-amber-200/60 border border-amber-200/40'
                  : 'bg-indigo-900/30 text-amber-400 hover:bg-indigo-800/40 border border-amber-500/20'
                } font-serif text-sm tracking-wide`}
              style={{
                boxShadow: `0 0 20px ${elementalColors.fire[isDayMode ? 'day' : 'night'].glow}`,
              }}
            >
              Step into the field
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // The living map - main blueprint interface
  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-[3000ms]
      ${isDayMode
        ? 'bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100'
        : 'bg-gradient-to-b from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]'
      }`}>

      {/* Subtle constellation field - alive but not ornate */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            className={`absolute rounded-full ${isDayMode ? 'bg-amber-400' : 'bg-amber-300'}`}
            style={{
              width: Math.random() > 0.7 ? '2px' : '1px',
              height: Math.random() > 0.7 ? '2px' : '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Ambient elemental glows - soft presence */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${elementalColors.fire[isDayMode ? 'day' : 'night'].glow}, transparent)` }}
      />
      <motion.div
        animate={{
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-32 left-32 w-72 h-72 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${elementalColors.water[isDayMode ? 'day' : 'night'].glow}, transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Threshold - Simple welcome */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className={`text-3xl md:text-4xl font-serif mb-3 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
            Your Cosmic Blueprint
          </h1>
          <p className={`text-sm ${isDayMode ? 'text-stone-600' : 'text-stone-400'} font-serif italic`}>
            The spiral of consciousness, woven through stars
          </p>
        </motion.div>

        {/* Elemental Balance - The living signature */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`rounded-2xl p-8 mb-12 backdrop-blur-md transition-all duration-500
            ${isDayMode
              ? 'bg-white/40 border border-stone-200/40'
              : 'bg-black/20 border border-stone-700/20'
            }`}
          style={{
            boxShadow: `0 8px 32px ${isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)'}`,
          }}
        >
          <ElementalBalanceDisplay balance={elementalBalance} />
        </motion.div>

        {/* Sacred House Wheel - The mandala of becoming */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={`rounded-2xl p-8 mb-12 backdrop-blur-md transition-all duration-500
            ${isDayMode
              ? 'bg-white/40 border border-stone-200/40'
              : 'bg-black/20 border border-stone-700/20'
            }`}
          style={{
            boxShadow: `0 8px 32px ${isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)'}`,
          }}
        >
          <div className="text-center mb-6">
            <h2 className={`text-xl font-serif mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
              The Twelve Pathways
            </h2>
            <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} font-serif italic`}>
              Hover to reveal sacred geometry
            </p>
          </div>
          <SacredHouseWheel
            planets={[
              { name: 'Sun', sign: chartData.sun.sign, house: chartData.sun.house, degree: chartData.sun.degree },
              { name: 'Moon', sign: chartData.moon.sign, house: chartData.moon.house, degree: chartData.moon.degree },
            ]}
            aspects={chartData.aspects}
            isDayMode={isDayMode}
            showAspects={true}
          />
        </motion.div>

        {/* The Big Three - Core trinity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Sun - Fire essence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-xl p-6 backdrop-blur-md transition-all duration-500 group cursor-pointer
              ${isDayMode
                ? 'bg-white/50 border border-stone-200/50 hover:bg-white/70'
                : 'bg-black/30 border border-stone-700/30 hover:bg-black/40'
              }`}
            style={{
              boxShadow: `0 4px 16px ${elementalColors.fire[isDayMode ? 'day' : 'night'].glow}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${elementalColors.fire[isDayMode ? 'day' : 'night'].primary}, ${elementalColors.fire[isDayMode ? 'day' : 'night'].accent})`,
                  boxShadow: `0 0 20px ${elementalColors.fire[isDayMode ? 'day' : 'night'].glow}`,
                }}
              >
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-serif font-medium ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Sun · Core
                </h3>
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                  Conscious expression
                </p>
              </div>
            </div>
            <p className="text-2xl font-serif mb-2" style={{ color: elementalColors.fire[isDayMode ? 'day' : 'night'].primary }}>
              {chartData.sun.sign}
            </p>
            <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mb-3`}>
              {chartData.sun.degree.toFixed(1)}° · House {chartData.sun.house}
            </p>
            <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'} font-serif`}>
              {getZodiacArchetype(chartData.sun.sign.toLowerCase())?.archetypes.mythological?.[0] || 'The Seeker'}
            </p>
          </motion.div>

          {/* Moon - Water essence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`rounded-xl p-6 backdrop-blur-md transition-all duration-500 group cursor-pointer
              ${isDayMode
                ? 'bg-white/50 border border-stone-200/50 hover:bg-white/70'
                : 'bg-black/30 border border-stone-700/30 hover:bg-black/40'
              }`}
            style={{
              boxShadow: `0 4px 16px ${elementalColors.water[isDayMode ? 'day' : 'night'].glow}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${elementalColors.water[isDayMode ? 'day' : 'night'].primary}, ${elementalColors.water[isDayMode ? 'day' : 'night'].accent})`,
                  boxShadow: `0 0 20px ${elementalColors.water[isDayMode ? 'day' : 'night'].glow}`,
                }}
              >
                <Droplet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-serif font-medium ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Moon · Soul
                </h3>
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                  Emotional truth
                </p>
              </div>
            </div>
            <p className="text-2xl font-serif mb-2" style={{ color: elementalColors.water[isDayMode ? 'day' : 'night'].primary }}>
              {chartData.moon.sign}
            </p>
            <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mb-3`}>
              {chartData.moon.degree.toFixed(1)}° · House {chartData.moon.house}
            </p>
            <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'} font-serif`}>
              {getZodiacArchetype(chartData.moon.sign.toLowerCase())?.archetypes.mythological?.[0] || 'The Mystic'}
            </p>
          </motion.div>

          {/* Ascendant - Aether essence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`rounded-xl p-6 backdrop-blur-md transition-all duration-500 group cursor-pointer
              ${isDayMode
                ? 'bg-white/50 border border-stone-200/50 hover:bg-white/70'
                : 'bg-black/30 border border-stone-700/30 hover:bg-black/40'
              }`}
            style={{
              boxShadow: `0 4px 16px ${elementalColors.aether[isDayMode ? 'day' : 'night'].glow}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${elementalColors.aether[isDayMode ? 'day' : 'night'].primary}, ${elementalColors.aether[isDayMode ? 'day' : 'night'].accent})`,
                  boxShadow: `0 0 20px ${elementalColors.aether[isDayMode ? 'day' : 'night'].glow}`,
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-serif font-medium ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Rising · Portal
                </h3>
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                  How you meet the world
                </p>
              </div>
            </div>
            <p className="text-2xl font-serif mb-2" style={{ color: elementalColors.aether[isDayMode ? 'day' : 'night'].primary }}>
              {chartData.ascendant.sign}
            </p>
            <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mb-3`}>
              {chartData.ascendant.degree.toFixed(1)}°
            </p>
            <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'} font-serif`}>
              {getZodiacArchetype(chartData.ascendant.sign.toLowerCase())?.archetypes.mythological?.[0] || 'The Bridge'}
            </p>
          </motion.div>
        </div>

        {/* Benediction - The return */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center py-12"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className={`text-sm ${isDayMode ? 'text-stone-600' : 'text-stone-400'} font-serif italic mb-3`}
          >
            What you attend to,
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className={`text-sm ${isDayMode ? 'text-stone-600' : 'text-stone-400'} font-serif italic`}
          >
            attends you.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
