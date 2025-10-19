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
import { Sparkles, Flame, Droplet, Sprout, Wind, Sparkle, Target, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ElementalBalanceDisplay } from '@/components/astrology/ElementalBalanceDisplay';
import { SacredHouseWheel } from '@/components/astrology/SacredHouseWheel';
import { getZodiacArchetype } from '@/lib/astrology/archetypeLibrary';
import { getSpiralogicPlanetDescription } from '@/lib/astrology/spiralogicHouseMapping';
import { BirthDataForm } from '@/components/astrology/BirthDataForm';
import { MiniHoloflower } from '@/components/holoflower/MiniHoloflower';
import { Mission } from '@/lib/story/types';
import TorusBackgroundMap from '@/components/consciousness/TorusBackgroundMap';

interface BirthChartData {
  sun: { sign: string; degree: number; house: number };
  moon: { sign: string; degree: number; house: number };
  mercury?: { sign: string; degree: number; house: number };
  venus?: { sign: string; degree: number; house: number };
  mars?: { sign: string; degree: number; house: number };
  jupiter?: { sign: string; degree: number; house: number };
  saturn?: { sign: string; degree: number; house: number };
  uranus?: { sign: string; degree: number; house: number };
  neptune?: { sign: string; degree: number; house: number };
  pluto?: { sign: string; degree: number; house: number };
  chiron?: { sign: string; degree: number; house: number };
  northNode?: { sign: string; degree: number; house: number };
  southNode?: { sign: string; degree: number; house: number };
  ascendant: { sign: string; degree: number };
  midheaven?: { sign: string; degree: number };
  houses?: number[]; // Array of 12 house cusp degrees
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
    orb: number;
  }>;
}

// Arrakis night color palette - desert mysticism after the twin moons rise
const elementalColors = {
  fire: {
    day: { primary: '#C85450', accent: '#F5A362', glow: 'rgba(200, 84, 80, 0.2)' },
    night: { primary: '#D97706', accent: '#F59E0B', glow: 'rgba(217, 119, 6, 0.4)' }, // spice-orange flames
  },
  water: {
    day: { primary: '#6B9BD1', accent: '#8BADD6', glow: 'rgba(107, 155, 209, 0.2)' },
    night: { primary: '#3B82F6', accent: '#60A5FA', glow: 'rgba(59, 130, 246, 0.4)' }, // Fremen spice-blue eyes
  },
  earth: {
    day: { primary: '#7A9A65', accent: '#A8C69F', glow: 'rgba(122, 154, 101, 0.2)' },
    night: { primary: '#92400E', accent: '#B45309', glow: 'rgba(146, 64, 14, 0.3)' }, // deep desert sand
  },
  air: {
    day: { primary: '#D4B896', accent: '#E8D4BF', glow: 'rgba(212, 184, 150, 0.2)' },
    night: { primary: '#A16207', accent: '#CA8A04', glow: 'rgba(161, 98, 7, 0.3)' }, // wind-blown spice dust
  },
  aether: {
    day: { primary: '#9B8FAA', accent: '#B5A8C1', glow: 'rgba(155, 143, 170, 0.2)' },
    night: { primary: '#6366F1', accent: '#818CF8', glow: 'rgba(99, 102, 241, 0.3)' }, // Bene Gesserit prescience
  },
};

// Kelly's Real Missions - Demo/Test Case for Mission Tracking
const KELLY_MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    userId: 'kelly',
    title: 'Build MAIA Platform',
    description: 'Create consciousness co-authorship platform where everyone becomes their own mythographer',
    status: 'active',
    house: 10, // Career/Legacy/Public work
    relatedPlanets: ['Saturn'], // Saturn focal point
    progress: 75,
    milestones: [
      { id: 'm1', title: 'Sacred Scribe system architecture', completed: true },
      { id: 'm2', title: 'Mission tracking with pulsing dots', completed: true },
      { id: 'm3', title: 'Database integration', completed: false },
      { id: 'm4', title: 'Launch to first cohort', completed: false },
    ],
    identifiedDate: new Date('2024-06-01'),
    startedDate: new Date('2024-07-15'),
    transitContext: {
      activatingPlanet: 'Saturn in Pisces',
      transitDescription: 'Saturn focal point crystallizing life\'s work through consciousness technology',
    },
    createdAt: new Date('2024-06-01'),
    lastUpdated: new Date(),
  },
  {
    id: 'mission-2',
    userId: 'kelly',
    title: 'Spiralogic Teaching Curriculum',
    description: 'Develop comprehensive teaching system for Spiralogic archetypal framework',
    status: 'active',
    house: 9, // Teaching/Philosophy/Expansion
    relatedPlanets: ['Sun', 'Venus'], // Sun in 9th area, Venus teaching
    progress: 45,
    milestones: [
      { id: 'm1', title: 'Core framework documented', completed: true },
      { id: 'm2', title: 'Alchemical house system complete', completed: true },
      { id: 'm3', title: 'First cohort curriculum', completed: false },
      { id: 'm4', title: 'Certification program', completed: false },
    ],
    identifiedDate: new Date('2024-03-15'),
    startedDate: new Date('2024-04-01'),
    createdAt: new Date('2024-03-15'),
    lastUpdated: new Date(),
  },
  {
    id: 'mission-3',
    userId: 'kelly',
    title: 'Collective Vision Crystallization',
    description: 'Building community of practitioners who see the pattern and serve as sacred scribes',
    status: 'emerging',
    house: 11, // Community/Collective/Future vision
    relatedPlanets: ['Uranus'], // Innovation, collective consciousness
    progress: 20,
    milestones: [
      { id: 'm1', title: 'Vision articulated', completed: true },
      { id: 'm2', title: 'First practitioners gathering', completed: false },
      { id: 'm3', title: 'Training protocols', completed: false },
    ],
    identifiedDate: new Date('2024-09-01'),
    createdAt: new Date('2024-09-01'),
    lastUpdated: new Date(),
  },
  {
    id: 'mission-4',
    userId: 'kelly',
    title: 'Sacred Geometry Integration',
    description: 'Bringing pre-literate symbolic transmission into the consciousness field',
    status: 'completed',
    house: 12, // Spirituality/Dissolution/Transcendence
    relatedPlanets: ['Jupiter', 'Neptune'], // Expansion + Mysticism
    progress: 100,
    milestones: [
      { id: 'm1', title: 'Metatron\'s Cube', completed: true, completedDate: new Date('2024-10-01') },
      { id: 'm2', title: '7 Sacred Spirals', completed: true, completedDate: new Date('2024-10-05') },
      { id: 'm3', title: 'Torus vortex', completed: true, completedDate: new Date('2024-10-10') },
      { id: 'm4', title: 'Alchemical symbols', completed: true, completedDate: new Date('2024-10-15') },
    ],
    identifiedDate: new Date('2024-09-15'),
    startedDate: new Date('2024-09-20'),
    completedDate: new Date('2024-10-15'),
    createdAt: new Date('2024-09-15'),
    lastUpdated: new Date('2024-10-15'),
  },
];

export default function AstrologyPage() {
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [birthData, setBirthData] = useState<any>(null); // Store for recalculation
  const [elementalBalance, setElementalBalance] = useState({
    fire: 0.28,
    water: 0.38,
    earth: 0.18,
    air: 0.16,
  });

  // Arrakis aesthetic - always desert night (the twin moons never set)
  const [isDayMode, setIsDayMode] = useState(false);

  useEffect(() => {
    // Force night mode for Arrakis aesthetic
    setIsDayMode(false);

    // Load saved birth data from localStorage on mount
    const savedBirthData = localStorage.getItem('birthChartData');
    if (savedBirthData) {
      try {
        const parsedData = JSON.parse(savedBirthData);
        // Ensure house system is set (default to Porphyry if not present)
        if (!parsedData.houseSystem) {
          parsedData.houseSystem = 'porphyry';
          // Save updated data back to localStorage
          localStorage.setItem('birthChartData', JSON.stringify(parsedData));
          console.log('Updated localStorage with Porphyry house system');
        }
        calculateChart(parsedData);
      } catch (error) {
        console.error('Failed to load saved birth data:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);


  // Fetch chart from API using real ephemeris calculations
  const calculateChart = async (data: any) => {
    setLoading(true);
    setBirthData(data);

    // Save birth data to localStorage for future visits
    localStorage.setItem('birthChartData', JSON.stringify(data));

    try {
      const response = await fetch('/api/astrology/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, houseSystem: 'porphyry' }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setChartData({
          sun: result.data.sun,
          moon: result.data.moon,
          mercury: result.data.mercury,
          venus: result.data.venus,
          mars: result.data.mars,
          jupiter: result.data.jupiter,
          saturn: result.data.saturn,
          uranus: result.data.uranus,
          neptune: result.data.neptune,
          pluto: result.data.pluto,
          chiron: result.data.chiron,
          northNode: result.data.northNode,
          southNode: result.data.southNode,
          ascendant: result.data.ascendant,
          midheaven: result.data.midheaven,
          houses: result.data.houses,
          aspects: result.data.aspects,
        });

        // Calculate elemental balance from chart
        // TODO: Make this more sophisticated
        setElementalBalance({
          fire: 0.25,
          water: 0.30,
          earth: 0.20,
          air: 0.25,
        });
      } else {
        console.error('Chart calculation failed:', result.error);
        alert('Failed to calculate birth chart. Please try again.');
      }
    } catch (error) {
      console.error('Error calculating chart:', error);
      alert('Error calculating birth chart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
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

  // Birth data form - invitation to calculate chart
  if (!chartData) {
    return (
      <div className="min-h-screen relative overflow-hidden transition-all duration-1000"
        style={{
          background: isDayMode
            ? 'radial-gradient(circle at 50% 30%, #E8DCC8 0%, #D4C4B0 100%)'
            : 'radial-gradient(circle at 50% 70%, #1C130C 0%, #0A0907 100%)'
        }}>

        {/* Subtle constellation field */}
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
              className="absolute rounded-full"
              style={{
                backgroundColor: '#E7E2CF', // Starlight white
                width: Math.random() > 0.7 ? '2px' : '1px',
                height: Math.random() > 0.7 ? '2px' : '1px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 min-h-screen flex items-center">
          <div className="w-full">
            <BirthDataForm
              onSubmit={calculateChart}
              loading={loading}
              isDayMode={isDayMode}
            />
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get all planets in a specific house
  const getPlanetsInHouse = (houseNumber: number) => {
    if (!chartData) return [];

    const planetsInHouse: Array<{ name: string; sign: string; degree: number }> = [];

    // Check all planets
    if (chartData.sun.house === houseNumber) planetsInHouse.push({ name: 'Sun', ...chartData.sun });
    if (chartData.moon.house === houseNumber) planetsInHouse.push({ name: 'Moon', ...chartData.moon });
    if (chartData.mercury?.house === houseNumber) planetsInHouse.push({ name: 'Mercury', ...chartData.mercury });
    if (chartData.venus?.house === houseNumber) planetsInHouse.push({ name: 'Venus', ...chartData.venus });
    if (chartData.mars?.house === houseNumber) planetsInHouse.push({ name: 'Mars', ...chartData.mars });
    if (chartData.jupiter?.house === houseNumber) planetsInHouse.push({ name: 'Jupiter', ...chartData.jupiter });
    if (chartData.saturn?.house === houseNumber) planetsInHouse.push({ name: 'Saturn', ...chartData.saturn });
    if (chartData.uranus?.house === houseNumber) planetsInHouse.push({ name: 'Uranus', ...chartData.uranus });
    if (chartData.neptune?.house === houseNumber) planetsInHouse.push({ name: 'Neptune', ...chartData.neptune });
    if (chartData.pluto?.house === houseNumber) planetsInHouse.push({ name: 'Pluto', ...chartData.pluto });
    if (chartData.chiron?.house === houseNumber) planetsInHouse.push({ name: 'Chiron', ...chartData.chiron });
    if (chartData.northNode?.house === houseNumber) planetsInHouse.push({ name: 'North Node', ...chartData.northNode });
    if (chartData.southNode?.house === houseNumber) planetsInHouse.push({ name: 'South Node', ...chartData.southNode });

    return planetsInHouse;
  };

  // The living map - main blueprint interface
  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-1000"
      style={{
        background: isDayMode
          ? 'radial-gradient(circle at 50% 30%, #E8DCC8 0%, #D4C4B0 100%)'
          : 'radial-gradient(circle at 50% 70%, #1C130C 0%, #0A0907 100%)'
      }}>

      {/* Arrakis Night Sky - Proper twinkling stars */}
      <div className="absolute inset-0">
        {/* Distant stars - subtle shimmer */}
        {[...Array(200)].map((_, i) => {
          const size = Math.random();
          const twinkleSpeed = 2 + Math.random() * 3;
          return (
            <motion.div
              key={`star-${i}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.1, size > 0.8 ? 0.9 : 0.5, 0.1],
              }}
              transition={{
                duration: twinkleSpeed,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
              className={`absolute rounded-full ${isDayMode ? 'bg-amber-400/40' : 'bg-orange-200/90'}`}
              style={{
                width: size > 0.9 ? '3px' : size > 0.7 ? '2px' : '1px',
                height: size > 0.9 ? '3px' : size > 0.7 ? '2px' : '1px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: size > 0.8 ? `0 0 ${size * 8}px rgba(249, 115, 22, ${isDayMode ? 0.3 : 0.7})` : 'none',
              }}
            />
          );
        })}

        {/* Bright navigational stars - like Arrakis */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`bright-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className={`absolute rounded-full ${isDayMode ? 'bg-amber-500' : 'bg-orange-400'}`}
            style={{
              width: '4px',
              height: '4px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 20px rgba(249, 115, 22, ${isDayMode ? 0.4 : 0.9}), 0 0 40px rgba(217, 119, 6, ${isDayMode ? 0.2 : 0.5})`,
            }}
          />
        ))}

        {/* Subtle nebula clouds */}
        {!isDayMode && (
          <>
            <motion.div
              animate={{
                opacity: [0.03, 0.08, 0.03],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent)' }}
            />
            <motion.div
              animate={{
                opacity: [0.02, 0.06, 0.02],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 25, repeat: Infinity, delay: 5 }}
              className="absolute bottom-1/4 left-1/4 w-[700px] h-[700px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)' }}
            />
          </>
        )}
      </div>

      {/* Ambient elemental glows - soft presence */}
      <motion.div
        animate={{
          opacity: [0.08, 0.15, 0.08],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${elementalColors.fire[isDayMode ? 'day' : 'night'].glow}, transparent)` }}
      />
      <motion.div
        animate={{
          opacity: [0.08, 0.12, 0.08],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-32 left-32 w-72 h-72 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${elementalColors.water[isDayMode ? 'day' : 'night'].glow}, transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header - Spiralogic Evolutionary Report */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-serif mb-4 tracking-wide transition-colors duration-500"
            style={{ color: isDayMode ? '#C67A28' : '#D88A2D' }}>
            Alchemical Journey
          </h1>
          <div className="text-sm font-serif space-y-1 transition-colors duration-500"
            style={{ color: isDayMode ? '#3D2E1F' : '#E7E2CF' }}>
            <p className="italic">Your soul's navigation through the waters of life</p>
            <p className="text-xs mt-4 opacity-70">Birth Pattern: {chartData.sun.sign} Sun · {chartData.moon.sign} Moon · {chartData.ascendant.sign} Rising</p>

            {/* Porphyry House System Note */}
            <div className="mt-4 text-xs italic opacity-60">
              <span className="opacity-40">Using Porphyry houses — the breathing middle path</span>
            </div>
          </div>
        </motion.div>

        {/* Sacred House Wheel - The mandala of becoming - HERO POSITION! */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
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
              Consciousness Field Map
            </h2>
            <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} font-serif italic mb-3`}>
              Soul-centric field instrument · Hover to reveal neural pathways and archetypal insights · Click houses to learn alchemy
            </p>
            {/* Spiralogic Process Legend */}
            <div className={`space-y-2 ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
              <div className="flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-mono">→</span>
                  <span>Vector (Cardinal) · Initiating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-mono">○</span>
                  <span>Circle (Fixed) · Sustaining</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-mono">∿</span>
                  <span>Spiral (Mutable) · Transforming</span>
                </div>
              </div>
              <div className={`text-xs italic text-center`}>
                Each element flows: Vector → Circle → Spiral (Cardinal → Fixed → Mutable)
              </div>
            </div>
          </div>
          {/* Sacred House Wheel with Torus Background (Apple/Tree of Life) */}
          <div className="relative w-full max-w-3xl mx-auto pb-96">
            {/* Torus Background Map - The Apple Core / Tree of Life structure */}
            <div className="flex items-center justify-center">
              <TorusBackgroundMap
                size={800}
                showLabels={true}
                torusOpacity={0.45}
                amberTint={isDayMode ? "#D4A574" : "#C9B896"}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Optional: Holoflower overlay for extra depth */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      opacity: 0.25,
                      transform: 'scale(0.6)'
                    }}
                  >
                    <MiniHoloflower
                      size={240}
                      isDayMode={false}
                    />
                  </div>

                  {/* Sacred House Wheel - centered in torus heart */}
                  <div className="relative z-10">
                    <SacredHouseWheel
                      planets={[
                        { name: 'Sun', sign: chartData.sun.sign, house: chartData.sun.house, degree: chartData.sun.degree },
                        { name: 'Moon', sign: chartData.moon.sign, house: chartData.moon.house, degree: chartData.moon.degree },
                        ...(chartData.mercury ? [{ name: 'Mercury', sign: chartData.mercury.sign, house: chartData.mercury.house, degree: chartData.mercury.degree }] : []),
                        ...(chartData.venus ? [{ name: 'Venus', sign: chartData.venus.sign, house: chartData.venus.house, degree: chartData.venus.degree }] : []),
                        ...(chartData.mars ? [{ name: 'Mars', sign: chartData.mars.sign, house: chartData.mars.house, degree: chartData.mars.degree }] : []),
                        ...(chartData.jupiter ? [{ name: 'Jupiter', sign: chartData.jupiter.sign, house: chartData.jupiter.house, degree: chartData.jupiter.degree }] : []),
                        ...(chartData.saturn ? [{ name: 'Saturn', sign: chartData.saturn.sign, house: chartData.saturn.house, degree: chartData.saturn.degree }] : []),
                        ...(chartData.uranus ? [{ name: 'Uranus', sign: chartData.uranus.sign, house: chartData.uranus.house, degree: chartData.uranus.degree }] : []),
                        ...(chartData.neptune ? [{ name: 'Neptune', sign: chartData.neptune.sign, house: chartData.neptune.house, degree: chartData.neptune.degree }] : []),
                        ...(chartData.pluto ? [{ name: 'Pluto', sign: chartData.pluto.sign, house: chartData.pluto.house, degree: chartData.pluto.degree }] : []),
                        ...(chartData.chiron ? [{ name: 'Chiron', sign: chartData.chiron.sign, house: chartData.chiron.house, degree: chartData.chiron.degree }] : []),
                        ...(chartData.northNode ? [{ name: 'North Node', sign: chartData.northNode.sign, house: chartData.northNode.house, degree: chartData.northNode.degree }] : []),
                        ...(chartData.southNode ? [{ name: 'South Node', sign: chartData.southNode.sign, house: chartData.southNode.house, degree: chartData.southNode.degree }] : []),
                      ]}
                      aspects={chartData.aspects}
                      isDayMode={isDayMode}
                      showAspects={true}
                      missions={KELLY_MISSIONS}
                    />
                  </div>
                </div>
              </TorusBackgroundMap>
            </div>
          </div>
        </motion.div>

        {/* Your Active Missions - Manifestations in Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-serif mb-2 ${isDayMode ? 'text-stone-800' : 'text-amber-300'}`}>
              Your Active Missions
            </h2>
            <p className={`text-sm ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
              Creative manifestations pulsing on your consciousness field map
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {KELLY_MISSIONS.map((mission) => {
              const statusColors = {
                emerging: 'border-blue-500/40 bg-blue-500/10',
                active: 'border-green-500/40 bg-green-500/10',
                completed: 'border-amber-500/40 bg-amber-500/10',
                urgent: 'border-red-500/40 bg-red-500/10',
              };

              const statusLabels = {
                emerging: 'Emerging',
                active: 'In Progress',
                completed: 'Manifested',
                urgent: 'Urgent',
              };

              const statusIcons = {
                emerging: '🔵',
                active: '🟢',
                completed: '🟡',
                urgent: '🔴',
              };

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`rounded-xl p-6 border backdrop-blur-md ${statusColors[mission.status]}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{statusIcons[mission.status]}</span>
                      <div>
                        <h3 className="font-serif text-lg text-white">
                          {mission.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-stone-300">
                            House {mission.house}
                          </span>
                          <span className="text-xs text-stone-500">•</span>
                          <span className="text-xs text-stone-300">
                            {statusLabels[mission.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4 text-stone-200">
                    {mission.description}
                  </p>

                  {/* Progress bar (if active) */}
                  {mission.status === 'active' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                        <span>Progress</span>
                        <span>{mission.progress}%</span>
                      </div>
                      <div className="h-2 bg-stone-800/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${mission.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-green-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Milestones */}
                  <div className="space-y-1">
                    {mission.milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          milestone.completed ? 'bg-green-500' : 'bg-stone-600'
                        }`} />
                        <span className={milestone.completed ? 'text-stone-300' : 'text-stone-400'}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Transit context (if present) */}
                  {mission.transitContext && (
                    <div className="mt-4 pt-4 border-t border-stone-700/20">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-3 h-3 text-purple-400 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-purple-300">
                            {mission.transitContext.activatingPlanet}
                          </div>
                          <div className="text-xs text-stone-300 mt-0.5">
                            {mission.transitContext.transitDescription}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className={`mt-6 text-center text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-500'}`}>
            <p className="italic">
              Each mission pulses on the map in its house location •{' '}
              Click the pulsing dots above to see details
            </p>
          </div>
        </motion.div>

        {/* Sacred Scribe - Living Mythology Co-Authored with MAIA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-serif mb-2 ${isDayMode ? 'text-stone-800' : 'text-amber-300'}`}>
              Your Living Story
            </h2>
            <p className={`text-sm ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
              MAIA witnesses your journey and weaves your mythology across time
            </p>
          </div>

          <div className={`rounded-xl p-8 backdrop-blur-md border ${
            isDayMode
              ? 'bg-gradient-to-br from-purple-50/80 to-blue-50/80 border-purple-200/40'
              : 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-700/30'
          }`}>
            {/* Current Chapter Spotlight */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDayMode ? 'bg-purple-200/50' : 'bg-purple-500/20'
                  }`}>
                    <BookOpen className={`w-5 h-5 ${isDayMode ? 'text-purple-700' : 'text-purple-400'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-serif ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                      Chapter 0: Genesis
                    </h3>
                    <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                      Co-authored with MAIA • Approved
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDayMode
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-900/30 text-green-400'
                }`}>
                  ✓ Approved
                </div>
              </div>

              {/* Genesis excerpt */}
              <div className={`p-6 rounded-lg ${
                isDayMode ? 'bg-stone-50/50' : 'bg-stone-900/20'
              } border ${isDayMode ? 'border-stone-200/40' : 'border-stone-700/20'}`}>
                <p className={`font-serif text-sm leading-relaxed ${
                  isDayMode ? 'text-stone-700' : 'text-stone-300'
                } mb-4`}>
                  Your soul architecture reveals itself in the configuration of cosmos at your first breath.
                </p>
                <p className={`font-serif text-sm leading-relaxed ${
                  isDayMode ? 'text-stone-700' : 'text-stone-300'
                } mb-4`}>
                  Not fate. Not prediction. But invitation - a field of archetypal potential waiting to be lived,
                  played, embodied through the music only you can make.
                </p>
                <p className={`font-serif text-sm leading-relaxed ${
                  isDayMode ? 'text-stone-700' : 'text-stone-300'
                }`}>
                  The cosmos arranged itself in a <strong>Funnel pattern</strong> - nine planets flowing toward a single point of focus.
                  This is the signature of someone who channels universal energy through a specific calling.
                  Everything flows toward your focal planet - <strong>Saturn in House 10</strong> - your life's work lives there.
                </p>
              </div>
            </div>

            {/* Stats & Activity */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg text-center ${
                isDayMode ? 'bg-blue-50/50' : 'bg-blue-900/10'
              }`}>
                <div className={`text-2xl font-bold ${isDayMode ? 'text-blue-700' : 'text-blue-400'}`}>
                  1
                </div>
                <div className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mt-1`}>
                  Chapters
                </div>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                isDayMode ? 'bg-green-50/50' : 'bg-green-900/10'
              }`}>
                <div className={`text-2xl font-bold ${isDayMode ? 'text-green-700' : 'text-green-400'}`}>
                  1
                </div>
                <div className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mt-1`}>
                  Approved
                </div>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                isDayMode ? 'bg-purple-50/50' : 'bg-purple-900/10'
              }`}>
                <div className={`text-2xl font-bold ${isDayMode ? 'text-purple-700' : 'text-purple-400'}`}>
                  2
                </div>
                <div className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mt-1`}>
                  Active Threads
                </div>
              </div>
            </div>

            {/* Active Threads */}
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 ${
                isDayMode ? 'text-stone-800' : 'text-stone-200'
              }`}>
                Patterns MAIA Is Tracking
              </h4>
              <div className="space-y-2">
                <div className={`p-3 rounded-lg flex items-start gap-3 ${
                  isDayMode ? 'bg-amber-50/50' : 'bg-amber-900/10'
                } border ${isDayMode ? 'border-amber-200/30' : 'border-amber-700/20'}`}>
                  <Sparkles className={`w-4 h-4 mt-0.5 ${isDayMode ? 'text-amber-600' : 'text-amber-400'}`} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                      Saturn Focal Point Work
                    </div>
                    <div className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mt-0.5`}>
                      Crystallizing life's work through consciousness technology
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs ${
                    isDayMode ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'
                  }`}>
                    Active
                  </div>
                </div>

                <div className={`p-3 rounded-lg flex items-start gap-3 ${
                  isDayMode ? 'bg-blue-50/50' : 'bg-blue-900/10'
                } border ${isDayMode ? 'border-blue-200/30' : 'border-blue-700/20'}`}>
                  <Sparkles className={`w-4 h-4 mt-0.5 ${isDayMode ? 'text-blue-600' : 'text-blue-400'}`} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                      The Air Path: Pattern to Purpose
                    </div>
                    <div className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mt-0.5`}>
                      Weaving connection, community, and collective consciousness
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs ${
                    isDayMode ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'
                  }`}>
                    Emerging
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Timeline Preview */}
            <div className="mb-6">
              <h4 className={`text-sm font-semibold mb-3 ${
                isDayMode ? 'text-stone-800' : 'text-stone-200'
              }`}>
                Recent Journey Events
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    isDayMode ? 'bg-purple-500' : 'bg-purple-400'
                  }`} />
                  <div className="flex-1">
                    <div className={`text-sm ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                      Story Begins: Genesis Chapter Created
                    </div>
                    <div className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    isDayMode ? 'bg-green-500' : 'bg-green-400'
                  }`} />
                  <div className="flex-1">
                    <div className={`text-sm ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                      Mission Identified: Build MAIA Platform
                    </div>
                    <div className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                      June 2024
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center pt-4 border-t border-stone-700/20">
              <a
                href="/story"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                  isDayMode
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Open Sacred Scribe
              </a>
              <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-500'} mt-3 italic`}>
                Co-author your living mythology with MAIA
              </p>
            </div>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="rounded-2xl p-8 mb-10 backdrop-blur-md transition-all duration-500"
          style={{
            backgroundColor: 'rgba(12, 9, 7, 0.9)',
            border: '1px solid #9B6B3C',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <h2 className="text-2xl font-serif mb-4" style={{ color: '#D88A2D' }}>
            Reading the Pattern
          </h2>
          <div className="text-sm space-y-3 leading-relaxed" style={{ color: '#E7E2CF' }}>
            <p>
              This map transposes celestial positions into the <strong>12-Facet Process</strong>,
              tracking planetary forces through Fire (vision), Water (emotion), Earth (form), and Air (mind).
            </p>
            <p>
              Your <strong>birth pattern</strong> establishes the foundation.
              <strong> Current transits</strong> reveal activation cycles.
              <strong> Elemental balance</strong> shows where energy flows and where it stagnates.
            </p>
            <p className={`italic ${isDayMode ? 'text-stone-500' : 'text-stone-300'}`}>
              Each phase follows the ancient rhythm: <strong>Vector</strong> (initiation),
              <strong> Circle</strong> (sustenance), <strong>Spiral</strong> (transformation).
            </p>
          </div>
        </motion.div>

        {/* Current Evolutionary Phase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="rounded-2xl p-8 mb-10 backdrop-blur-md transition-all duration-500"
          style={{
            backgroundColor: 'rgba(12, 9, 7, 0.9)',
            border: '1px solid #9B6B3C',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <h2 className="text-2xl font-serif mb-6" style={{ color: '#D88A2D' }}>
            Where Are You in Your Spiralogic Evolution?
          </h2>
          <div className="space-y-4 text-sm" style={{ color: '#E7E2CF' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chartData.saturn && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(155, 107, 60, 0.2)' }}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#E7E2CF' }}>
                    <span>♄</span> Saturn in House {chartData.saturn.house}
                  </h3>
                  <p className="text-xs leading-relaxed">
                    Karmic restructuring in discipline, responsibility, and emotional resilience.
                  </p>
                </div>
              )}
              {chartData.jupiter && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(155, 107, 60, 0.2)' }}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#E7E2CF' }}>
                    <span>♃</span> Jupiter in House {chartData.jupiter.house}
                  </h3>
                  <p className="text-xs leading-relaxed">
                    Expansion and growth opportunities activating new possibilities.
                  </p>
                </div>
              )}
            </div>
            <div className={`mt-6 p-5 rounded-lg ${isDayMode ? 'bg-amber-50/80 border border-amber-200' : 'bg-amber-900/20 border border-amber-700/30'}`}>
              <p className="font-serif italic">
                <strong>Major Life Lesson Right Now:</strong> Integration of {chartData.sun.sign} solar consciousness
                with {chartData.moon.sign} emotional depths through {chartData.ascendant.sign} self-expression.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Elemental Balance - The living signature */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className={`rounded-2xl p-8 mb-12 backdrop-blur-md transition-all duration-500
            ${isDayMode
              ? 'bg-white/40 border border-stone-200/40'
              : 'bg-black/20 border border-stone-700/20'
            }`}
          style={{
            boxShadow: `0 8px 32px ${isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)'}`,
          }}
        >
          <h2 className={`text-2xl font-serif mb-6 text-center ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
            Elemental Balancing & Current Energy Dynamics
          </h2>
          <ElementalBalanceDisplay balance={elementalBalance} />
          <div className={`mt-6 text-xs text-center ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
            <p>Dominant Element: <strong>{Object.entries(elementalBalance).reduce((a, b) => a[1] > b[1] ? a : b)[0].toUpperCase()}</strong> ·
            Integration practices available through personalized guidance</p>
          </div>
        </motion.div>

        {/* Spiralogic Elemental Mapping */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={`rounded-2xl p-8 mb-12 backdrop-blur-md transition-all duration-500
            ${isDayMode
              ? 'bg-white/40 border border-stone-200/40'
              : 'bg-black/20 border border-stone-700/20'
            }`}
          style={{
            boxShadow: `0 8px 32px ${isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)'}`,
          }}
        >
          <h2 className={`text-3xl font-serif mb-8 text-center ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
            Spiralogic Elemental Mapping
          </h2>

          {/* FIRE: Vision, Activation, and Willpower */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Flame className={`w-6 h-6`} style={{ color: elementalColors.fire[isDayMode ? 'day' : 'night'].primary }} />
              <h3 className={`text-2xl font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                FIRE: Vision, Activation, and Willpower
              </h3>
            </div>
            <div className="space-y-4 ml-9">
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-red-50/60' : 'bg-red-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Fire 1 – Self-Awareness (Vector: Intelligence) · 1st House
                </h4>
                <p className={`text-sm mb-2 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                  <strong>{chartData.ascendant.sign} Rising</strong> at {chartData.ascendant.degree.toFixed(1)}°
                </p>
                {getPlanetsInHouse(1).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Self-awareness and how you initiate action.
                </p>
              </div>
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-red-50/60' : 'bg-red-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Fire 2 – Expression in the World (Circle: Intention) · 5th House
                </h4>
                {getPlanetsInHouse(5).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Passion, artistry, and personal joy.
                </p>
              </div>
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-red-50/60' : 'bg-red-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Fire 3 – Transcendent Will (Spiral: Goal) · 9th House
                </h4>
                {getPlanetsInHouse(9).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Expanding wisdom and visionary leadership.
                </p>
              </div>
            </div>
          </div>

          {/* WATER: Emotional Depth, Healing, and Flow */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Droplet className={`w-6 h-6`} style={{ color: elementalColors.water[isDayMode ? 'day' : 'night'].primary }} />
              <h3 className={`text-2xl font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                WATER: Emotional Depth, Healing, and Flow
              </h3>
            </div>
            <div className="space-y-4 ml-9">
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-blue-50/60' : 'bg-blue-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Water 1 – Emotional Intelligence (Vector: Intelligence) · 4th House
                </h4>
                {getPlanetsInHouse(4).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Deep-rooted emotional cycles and inner foundation.
                </p>
              </div>
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-blue-50/60' : 'bg-blue-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Water 2 – Death and Rebirth (Circle: Intention) · 8th House
                </h4>
                {getPlanetsInHouse(8).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Personal power, shared resources, and shadow work.
                </p>
              </div>
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-blue-50/60' : 'bg-blue-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Water 3 – Soul Depth (Spiral: Goal) · 12th House
                </h4>
                {getPlanetsInHouse(12).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Past-life wisdom and spiritual healing.
                </p>
              </div>
            </div>
          </div>

          {/* EARTH: Stability, Manifestation, and Purpose */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Sprout className={`w-6 h-6`} style={{ color: elementalColors.earth[isDayMode ? 'day' : 'night'].primary }} />
              <h3 className={`text-2xl font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                EARTH: Stability, Manifestation, and Purpose
              </h3>
            </div>
            <div className="space-y-4 ml-9">
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-green-50/60' : 'bg-green-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Earth 1 – Purpose and Mission (Vector: Intelligence) · 10th House
                </h4>
                {getPlanetsInHouse(10).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Public identity, long-term goals, and leadership.
                </p>
              </div>
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-green-50/60' : 'bg-green-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Earth 2 – Resources and Plans (Circle: Intention) · 2nd House
                </h4>
                {getPlanetsInHouse(2).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Financial security, values, and stability.
                </p>
              </div>
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-green-50/60' : 'bg-green-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Earth 3 – Endurance and Cycles (Spiral: Goal) · 6th House
                </h4>
                {getPlanetsInHouse(6).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Building sustainable habits and resilience.
                </p>
              </div>
            </div>
          </div>

          {/* AIR: Thought, Communication, and Connection */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Wind className={`w-6 h-6`} style={{ color: elementalColors.air[isDayMode ? 'day' : 'night'].primary }} />
              <h3 className={`text-2xl font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                AIR: Thought, Communication, and Connection
              </h3>
            </div>
            <div className="space-y-4 ml-9">
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-amber-50/60' : 'bg-amber-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Air 1 – Clarity and Focus (Vector: Intelligence) · 7th House
                </h4>
                {getPlanetsInHouse(7).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: How partnerships shape self-growth.
                </p>
              </div>
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-amber-50/60' : 'bg-amber-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Air 2 – Relationships and Dynamics (Circle: Intention) · 11th House
                </h4>
                {getPlanetsInHouse(11).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Your role in the greater human tapestry.
                </p>
              </div>
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-amber-50/60' : 'bg-amber-900/20'}`}>
                <h4 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Air 3 – Elevated Systems (Spiral: Goal) · 3rd House
                </h4>
                {getPlanetsInHouse(3).map((planet, idx) => (
                  <p key={idx} className={`text-sm mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    <strong>{planet.name} in {planet.sign}</strong> at {planet.degree.toFixed(1)}°
                  </p>
                ))}
                <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} italic`}>
                  Lesson: Mastering intellect, perception, and self-expression.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How to Engage MAIA Through Your Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mb-12 p-8 rounded-xl backdrop-blur-md ${
            isDayMode
              ? 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200/50'
              : 'bg-gradient-to-br from-amber-950/20 to-orange-950/20 border border-amber-500/20'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className={`w-6 h-6 ${isDayMode ? 'text-amber-600' : 'text-amber-400'}`} />
            <h3 className={`text-2xl font-serif ${isDayMode ? 'text-amber-900' : 'text-amber-200'}`}>
              Working With Your Chart
            </h3>
          </div>

          <div className={`space-y-6 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
            <p className="text-lg leading-relaxed">
              This chart is not a fortune—it's a <strong>conversation map</strong>. Each planet is an archetype waiting to speak. Each house is an arena where soul-work unfolds.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-white/60' : 'bg-black/30'}`}>
                <h4 className={`font-semibold mb-3 ${isDayMode ? 'text-amber-900' : 'text-amber-300'}`}>
                  🎭 Enter the Archetypal Theater
                </h4>
                <p className="text-sm leading-relaxed mb-3">
                  Hover over any house on the wheel. When you see planets inside, click <strong>"✨ Enter Imaginal Realm"</strong> to open a dialogue with those archetypes.
                </p>
                <p className="text-xs italic opacity-75">
                  Example: "Mars in Leo, what do you want me to know about my creative courage right now?"
                </p>
              </div>

              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-white/60' : 'bg-black/30'}`}>
                <h4 className={`font-semibold mb-3 ${isDayMode ? 'text-amber-900' : 'text-amber-300'}`}>
                  🌊 Follow the Elemental Flow
                </h4>
                <p className="text-sm leading-relaxed mb-3">
                  Notice which element dominates your chart (Fire/Water/Earth/Air). Ask MAIA: <strong>"What does my Water dominance need from me?"</strong>
                </p>
                <p className="text-xs italic opacity-75">
                  Each element offers a different portal into your consciousness.
                </p>
              </div>

              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-white/60' : 'bg-black/30'}`}>
                <h4 className={`font-semibold mb-3 ${isDayMode ? 'text-amber-900' : 'text-amber-300'}`}>
                  🔄 Track the Process Phases
                </h4>
                <p className="text-sm leading-relaxed mb-3">
                  Each element moves through <strong>Vector → Circle → Spiral</strong>. See where your planets cluster. Ask: <strong>"How do I move from Circle to Spiral in my Earth houses?"</strong>
                </p>
                <p className="text-xs italic opacity-75">
                  The Spiralogic framework maps consciousness development, not personality.
                </p>
              </div>

              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-white/60' : 'bg-black/30'}`}>
                <h4 className={`font-semibold mb-3 ${isDayMode ? 'text-amber-900' : 'text-amber-300'}`}>
                  ⚡ Work With Tensions
                </h4>
                <p className="text-sm leading-relaxed mb-3">
                  Squares and oppositions (the red/purple lines) show creative friction. Don't avoid them. Ask: <strong>"Moon square Saturn—what does this tension want to teach me?"</strong>
                </p>
                <p className="text-xs italic opacity-75">
                  Sacred geometry reveals where growth happens through resistance.
                </p>
              </div>
            </div>

            <div className={`mt-6 p-5 rounded-lg border ${
              isDayMode
                ? 'bg-gradient-to-r from-amber-100/80 to-orange-100/80 border-amber-300'
                : 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-500/30'
            }`}>
              <p className={`text-sm font-medium mb-2 ${isDayMode ? 'text-amber-900' : 'text-amber-300'}`}>
                💡 Pro Tip: Start with houses that have multiple planets
              </p>
              <p className="text-sm leading-relaxed">
                Stelliums (3+ planets in one house) create intense archetypal theaters. These are your power zones—where multiple voices converge. Engage them in dialogue to understand the complexity.
              </p>
            </div>
          </div>
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
              {getSpiralogicPlanetDescription(chartData.sun.house)}
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
              {getSpiralogicPlanetDescription(chartData.moon.house)}
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
              {chartData.ascendant.degree.toFixed(1)}° · House 1
            </p>
            <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'} font-serif`}>
              {getSpiralogicPlanetDescription(1)}
            </p>
          </motion.div>
        </div>

        {/* All Planetary Placements */}
        {(chartData.mercury || chartData.venus || chartData.mars || chartData.jupiter || chartData.saturn) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className={`rounded-2xl p-8 mb-12 backdrop-blur-md transition-all duration-500
              ${isDayMode
                ? 'bg-white/40 border border-stone-200/40'
                : 'bg-black/20 border border-stone-700/20'
              }`}
            style={{
              boxShadow: `0 8px 32px ${isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)'}`,
            }}
          >
            <h2 className={`text-xl font-serif mb-6 text-center ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
              Planetary Placements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartData.mercury && (
                <div className={`p-4 rounded-lg ${isDayMode ? 'bg-white/50' : 'bg-black/30'}`}>
                  <p className={`text-sm font-medium mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    ☿ Mercury · Mind
                  </p>
                  <p className={`text-lg font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                    {chartData.mercury.sign}
                  </p>
                  <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mb-2`}>
                    {chartData.mercury.degree.toFixed(1)}° · House {chartData.mercury.house}
                  </p>
                  <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    {getSpiralogicPlanetDescription(chartData.mercury.house)}
                  </p>
                </div>
              )}
              {chartData.venus && (
                <div className={`p-4 rounded-lg ${isDayMode ? 'bg-white/50' : 'bg-black/30'}`}>
                  <p className={`text-sm font-medium mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    ♀ Venus · Love
                  </p>
                  <p className={`text-lg font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                    {chartData.venus.sign}
                  </p>
                  <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mb-2`}>
                    {chartData.venus.degree.toFixed(1)}° · House {chartData.venus.house}
                  </p>
                  <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    {getSpiralogicPlanetDescription(chartData.venus.house)}
                  </p>
                </div>
              )}
              {chartData.mars && (
                <div className={`p-4 rounded-lg ${isDayMode ? 'bg-white/50' : 'bg-black/30'}`}>
                  <p className={`text-sm font-medium mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    ♂ Mars · Action
                  </p>
                  <p className={`text-lg font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                    {chartData.mars.sign}
                  </p>
                  <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mb-2`}>
                    {chartData.mars.degree.toFixed(1)}° · House {chartData.mars.house}
                  </p>
                  <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    {getSpiralogicPlanetDescription(chartData.mars.house)}
                  </p>
                </div>
              )}
              {chartData.jupiter && (
                <div className={`p-4 rounded-lg ${isDayMode ? 'bg-white/50' : 'bg-black/30'}`}>
                  <p className={`text-sm font-medium mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    ♃ Jupiter · Expansion
                  </p>
                  <p className={`text-lg font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                    {chartData.jupiter.sign}
                  </p>
                  <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mb-2`}>
                    {chartData.jupiter.degree.toFixed(1)}° · House {chartData.jupiter.house}
                  </p>
                  <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    {getSpiralogicPlanetDescription(chartData.jupiter.house)}
                  </p>
                </div>
              )}
              {chartData.saturn && (
                <div className={`p-4 rounded-lg ${isDayMode ? 'bg-white/50' : 'bg-black/30'}`}>
                  <p className={`text-sm font-medium mb-1 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    ♄ Saturn · Structure
                  </p>
                  <p className={`text-lg font-serif ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                    {chartData.saturn.sign}
                  </p>
                  <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} mb-2`}>
                    {chartData.saturn.degree.toFixed(1)}° · House {chartData.saturn.house}
                  </p>
                  <p className={`text-xs italic ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                    {getSpiralogicPlanetDescription(chartData.saturn.house)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Practical Integration & Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className={`rounded-2xl p-8 mb-12 backdrop-blur-md transition-all duration-500
            ${isDayMode
              ? 'bg-white/40 border border-stone-200/40'
              : 'bg-black/20 border border-stone-700/20'
            }`}
          style={{
            boxShadow: `0 8px 32px ${isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)'}`,
          }}
        >
          <h2 className={`text-2xl font-serif mb-6 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
            Practical Rituals & Integration Practices
          </h2>
          <div className={`space-y-4 text-sm ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
            <div className={`p-5 rounded-lg ${isDayMode ? 'bg-blue-50/60' : 'bg-blue-900/20'}`}>
              <h3 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                Moon in {chartData.moon.sign} → Emotional Intelligence Practice
              </h3>
              <p className="text-xs leading-relaxed">
                Journal on your deepest emotional patterns. What recurring feelings guide your soul's journey?
              </p>
            </div>
            {chartData.saturn && (
              <div className={`p-5 rounded-lg ${isDayMode ? 'bg-green-50/60' : 'bg-green-900/20'}`}>
                <h3 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                  Saturn in House {chartData.saturn.house} → Discipline Integration
                </h3>
                <p className="text-xs leading-relaxed">
                  Dedicate structured time to mastering the lessons of limitation and responsibility in this life area.
                </p>
              </div>
            )}
            <div className={`p-5 rounded-lg ${isDayMode ? 'bg-amber-50/60' : 'bg-amber-900/20'}`}>
              <h3 className={`font-semibold mb-2 ${isDayMode ? 'text-stone-800' : 'text-stone-200'}`}>
                {chartData.ascendant.sign} Rising → Authentic Self-Expression
              </h3>
              <p className="text-xs leading-relaxed">
                Practice showing up as your true self in daily interactions. How does your soul want to be seen?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final Thoughts - Embracing the Cosmic Dance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className={`rounded-2xl p-10 mb-12 backdrop-blur-md transition-all duration-500 text-center
            ${isDayMode
              ? 'bg-gradient-to-br from-amber-50/80 to-purple-50/80 border border-amber-200/40'
              : 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/20'
            }`}
          style={{
            boxShadow: `0 8px 32px ${isDayMode ? 'rgba(217, 119, 6, 0.15)' : 'rgba(139, 92, 246, 0.2)'}`,
          }}
        >
          <h2 className={`text-3xl font-serif mb-6 ${isDayMode ? 'text-stone-800' : 'text-stone-100'}`}>
            Embracing the Cosmic Dance
          </h2>
          <div className={`text-sm ${isDayMode ? 'text-stone-700' : 'text-stone-300'} space-y-4 max-w-2xl mx-auto leading-relaxed`}>
            <p className="font-serif italic text-base">
              This is a moment to embrace your unique path, trust your evolution, and step into your power with clarity and wisdom.
            </p>
            <div className="pt-6 space-y-2">
              <p className="font-semibold">Next Steps:</p>
              <ul className={`text-xs space-y-2 ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                <li>• Engage with the recommended practices and journal reflections</li>
                <li>• Track shifting planetary influences over the coming months</li>
                <li>• Consider personalized guidance through MAIA for deeper integration</li>
              </ul>
            </div>
          </div>
          <div className={`mt-8 pt-6 border-t ${isDayMode ? 'border-amber-200' : 'border-purple-700/30'}`}>
            <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'} font-serif italic`}>
              Calculated with Time Passages-level precision using real ephemeris data
            </p>
            <p className={`text-xs mt-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'} font-serif`}>
              Spiralogic Institute · Integrating Astrology, Neuroscience & Depth Psychology
            </p>
          </div>
        </motion.div>

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
