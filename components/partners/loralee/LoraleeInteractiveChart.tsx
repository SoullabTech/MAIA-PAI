"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Star } from 'lucide-react';

/**
 * Loralee's Interactive Birth Chart
 *
 * Traditional astrology chart wheel with interactive planetary nodes
 * Combines familiar circular chart layout with modern Field Map interactivity
 */

interface Planet {
  name: string;
  symbol: string;
  sign: string;
  house: number;
  degree: number;
  element: 'fire' | 'water' | 'earth' | 'air';
  interpretation: {
    title: string;
    essence: string;
    teaching: string;
    question: string;
  };
}

// Sample birth chart data (would come from actual calculation)
const SAMPLE_PLANETS: Planet[] = [
  {
    name: 'Sun',
    symbol: '☉',
    sign: 'Leo',
    house: 9,
    degree: 15,
    element: 'fire',
    interpretation: {
      title: 'Your Radiant Core',
      essence: 'Your Sun in Leo in the 9th house speaks to a soul that came to SHINE through wisdom and exploration.',
      teaching: 'You are here to illuminate the path for others - not through teaching what you have been told, but through embodying the truth you have discovered on your own adventures.',
      question: 'What truth have you been seeking that actually lives within you?'
    }
  },
  {
    name: 'Moon',
    symbol: '☽',
    sign: 'Pisces',
    house: 4,
    degree: 22,
    element: 'water',
    interpretation: {
      title: 'Your Emotional Home',
      essence: 'Moon in Pisces in the 4th house - you feel everything, and that sensitivity is your superpower, not your weakness.',
      teaching: 'Your emotional depths allow you to sense what others cannot. This placement asks: can you create internal safety even when the world feels overwhelming?',
      question: 'Where do you need to give yourself permission to feel without fixing?'
    }
  },
  {
    name: 'Mercury',
    symbol: '☿',
    sign: 'Virgo',
    house: 10,
    degree: 8,
    element: 'earth',
    interpretation: {
      title: 'Your Sacred Mind',
      essence: 'Mercury in Virgo in the 10th - your mind is a precision instrument for discerning truth from noise.',
      teaching: 'You are not here to absorb everyone opinions. You are here to distill wisdom and share it with clarity. Your words have healing power when you trust your discernment.',
      question: 'What wisdom are you holding back because you think it is not ready?'
    }
  },
  {
    name: 'Venus',
    symbol: '♀',
    sign: 'Libra',
    house: 11,
    degree: 19,
    element: 'air',
    interpretation: {
      title: 'Your Heart Resonance',
      essence: 'Venus in Libra in the 11th house - you experience love through beauty, harmony, and sacred communion with kindred spirits.',
      teaching: 'Your relationships are not separate from your purpose. The people you resonate with ARE part of your curriculum. Community is how you learn to love.',
      question: 'Who in your life reflects back the beauty you sometimes cannot see in yourself?'
    }
  },
  {
    name: 'Mars',
    symbol: '♂',
    sign: 'Aries',
    house: 5,
    degree: 3,
    element: 'fire',
    interpretation: {
      title: 'Your Sacred Fire',
      essence: 'Mars in Aries in the 5th - pure creative force. You came to CREATE, not to wait for permission.',
      teaching: 'Your anger, your passion, your desire to BUILD - these are not things to manage or tame. They are fuel for manifestation. What wants to be born through you?',
      question: 'What are you creating that makes you feel ALIVE, even if it scares you?'
    }
  }
];

const ELEMENT_COLORS = {
  fire: '#f59e0b',
  water: '#06b6d4',
  earth: '#84cc16',
  air: '#a78bfa'
};

export function LoraleeInteractiveChart({ clientName }: { clientName: string }) {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Chart Container */}
      <div className="relative aspect-square max-w-3xl mx-auto">
        {/* SVG Chart Wheel */}
        <svg
          className="w-full h-full"
          viewBox="0 0 800 800"
          style={{ filter: 'drop-shadow(0 0 40px rgba(99, 102, 241, 0.3))' }}
        >
          <defs>
            {/* Aether Center Glow */}
            <radialGradient id="aetherGlow">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </radialGradient>

            {/* Planet glows */}
            {Object.entries(ELEMENT_COLORS).map(([element, color]) => (
              <radialGradient key={element} id={`${element}Glow`}>
                <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* Center Aether */}
          <circle
            cx="400"
            cy="400"
            r="60"
            fill="url(#aetherGlow)"
          />

          {/* House Division Lines */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x1 = 400 + 80 * Math.cos(angle);
            const y1 = 400 + 80 * Math.sin(angle);
            const x2 = 400 + 350 * Math.cos(angle);
            const y2 = 400 + 350 * Math.sin(angle);

            return (
              <motion.line
                key={`house-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              />
            );
          })}

          {/* House Numbers */}
          {[...Array(12)].map((_, i) => {
            const houseNum = i + 1;
            const angle = ((i * 30) + 15 - 90) * Math.PI / 180; // Center of house
            const x = 400 + 320 * Math.cos(angle);
            const y = 400 + 320 * Math.sin(angle);

            return (
              <text
                key={`house-num-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255, 255, 255, 0.3)"
                fontSize="14"
                fontFamily="serif"
              >
                {houseNum}
              </text>
            );
          })}

          {/* Zodiac Circle */}
          <circle
            cx="400"
            cy="400"
            r="340"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
          />

          {/* Zodiac Signs */}
          {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((sign, i) => {
            const angle = ((i * 30) + 15 - 90) * Math.PI / 180;
            const x = 400 + 360 * Math.cos(angle);
            const y = 400 + 360 * Math.sin(angle);

            return (
              <text
                key={`sign-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255, 255, 255, 0.5)"
                fontSize="24"
              >
                {sign}
              </text>
            );
          })}

          {/* Planets - Interactive Nodes (Field Map Style) */}
          {SAMPLE_PLANETS.map((planet, i) => {
            // Calculate position based on house
            const houseAngle = ((planet.house - 1) * 30 + planet.degree - 90) * Math.PI / 180;
            const radius = 150 + (i * 20); // Vary radius slightly for visibility
            const x = 400 + radius * Math.cos(houseAngle);
            const y = 400 + radius * Math.sin(houseAngle);

            const isSelected = selectedPlanet?.name === planet.name;
            const color = ELEMENT_COLORS[planet.element];

            return (
              <motion.g
                key={planet.name}
                onClick={() => setSelectedPlanet(planet)}
                style={{ cursor: 'pointer' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * i, type: "spring" }}
              >
                {/* Outer pulsing ring */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 35 : 25}
                  fill={`url(#${planet.element}Glow)`}
                  animate={{
                    r: isSelected ? [35, 40, 35] : [25, 30, 25],
                    opacity: isSelected ? [0.4, 0.6, 0.4] : [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Middle glow */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={15}
                  fill={color}
                  opacity={0.6}
                  animate={{
                    opacity: isSelected ? [0.6, 0.9, 0.6] : [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />

                {/* Core orb */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={10}
                  fill={color}
                  animate={{
                    scale: isSelected ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                />

                {/* Planet symbol */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {planet.symbol}
                </text>

                {/* Planet name label */}
                <text
                  x={x}
                  y={y + 30}
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="11"
                  fontFamily="sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {planet.name}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Instruction overlay (first time) */}
        {!selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-lg px-6 py-3 rounded-full border border-indigo-500/30 text-indigo-200 text-sm flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Click any planet to receive Loralee's wisdom
          </motion.div>
        )}
      </div>

      {/* Planet Interpretation Panel */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-br from-black/60 to-indigo-950/40 backdrop-blur-xl rounded-3xl border border-indigo-500/30 overflow-hidden">
              {/* Header */}
              <div
                className="p-6 border-b border-indigo-500/20"
                style={{ backgroundColor: `${ELEMENT_COLORS[selectedPlanet.element]}15` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                      style={{
                        backgroundColor: ELEMENT_COLORS[selectedPlanet.element],
                        boxShadow: `0 0 30px ${ELEMENT_COLORS[selectedPlanet.element]}40`
                      }}
                    >
                      {selectedPlanet.symbol}
                    </div>
                    <div>
                      <h3 className="text-2xl text-indigo-100 font-light mb-1">
                        {selectedPlanet.name} in {selectedPlanet.sign}
                      </h3>
                      <p className="text-indigo-300/70 text-sm">
                        {selectedPlanet.house}th House • {selectedPlanet.degree}°
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPlanet(null)}
                    className="text-indigo-300/60 hover:text-indigo-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Interpretation Content */}
              <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <h4 className="text-xl text-indigo-200 font-light mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {selectedPlanet.interpretation.title}
                  </h4>
                </div>

                {/* Essence */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-indigo-400/60 mb-2">
                    Essence
                  </div>
                  <p className="text-indigo-200/90 leading-relaxed italic">
                    "{selectedPlanet.interpretation.essence}"
                  </p>
                </div>

                {/* Teaching */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-indigo-400/60 mb-2">
                    Teaching
                  </div>
                  <p className="text-indigo-200/80 leading-relaxed">
                    {selectedPlanet.interpretation.teaching}
                  </p>
                </div>

                {/* Soul Question */}
                <div className="bg-indigo-900/20 rounded-xl p-4 border border-indigo-500/20">
                  <div className="text-xs uppercase tracking-wider text-indigo-400/60 mb-2">
                    Reflection Question
                  </div>
                  <p className="text-indigo-300 font-medium">
                    {selectedPlanet.interpretation.question}
                  </p>
                </div>

                {/* Note: This is where clients would add their own reflections */}
                <div className="pt-4 border-t border-indigo-500/10">
                  <p className="text-indigo-400/50 text-sm italic text-center">
                    In your living chart, you'll be able to journal your reflections here and watch how your understanding deepens over time...
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Message */}
      {!selectedPlanet && (
        <div className="mt-8 text-center">
          <p className="text-indigo-300/70 max-w-2xl mx-auto">
            Welcome, {clientName}. This is your sacred birth chart—a map of your soul's curriculum.
            Each planet holds wisdom specific to your journey. Click to explore what the cosmos
            whispers about who you came here to be.
          </p>
        </div>
      )}
    </div>
  );
}
