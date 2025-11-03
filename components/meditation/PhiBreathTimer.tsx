"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

/**
 * PhiBreathTimer - Sacred Breathing Meditation Based on Golden Ratio
 *
 * Implements the toroidal breath pattern:
 * - Expansion (Yang): 1.618s
 * - Pause (Syzygy): 1.0s
 * - Contraction (Yin): 1.0s
 * - Pause (Seed): 0.618s
 *
 * Total cycle: ~4.236s (φ³)
 */

const PHI = 1.618033988749;

interface BreathPhase {
  name: string;
  duration: number;
  direction: 'expand' | 'contract' | 'still';
  quality: 'yang' | 'yin' | 'syzygy' | 'seed';
  color: string;
  instruction: string;
}

const BREATH_CYCLE: BreathPhase[] = [
  {
    name: 'Expansion',
    duration: PHI, // 1.618s
    direction: 'expand',
    quality: 'yang',
    color: 'from-orange-400 via-amber-400 to-yellow-400',
    instruction: 'Breathe in... attention flows outward'
  },
  {
    name: 'Syzygy',
    duration: 1.0,
    direction: 'still',
    quality: 'syzygy',
    color: 'from-white via-yellow-100 to-white',
    instruction: 'Hold... opposites meet'
  },
  {
    name: 'Contraction',
    duration: 1.0,
    direction: 'contract',
    quality: 'yin',
    color: 'from-blue-400 via-indigo-400 to-purple-400',
    instruction: 'Breathe out... attention returns inward'
  },
  {
    name: 'Seed Point',
    duration: 1 / PHI, // 0.618s
    direction: 'still',
    quality: 'seed',
    color: 'from-amber-400 via-yellow-400 to-amber-500',
    instruction: 'Rest... in the golden center'
  }
];

const TOTAL_CYCLE_TIME = BREATH_CYCLE.reduce((sum, phase) => sum + phase.duration, 0);

export function PhiBreathTimer() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setcycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const phaseStartRef = useRef<number>(0);

  const currentPhase = BREATH_CYCLE[currentPhaseIndex];

  useEffect(() => {
    if (!isActive) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let lastTime = performance.now();
    phaseStartRef.current = lastTime;
    startTimeRef.current = lastTime;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      const phaseElapsed = (currentTime - phaseStartRef.current) / 1000;

      // Update total session time
      setTotalTime((currentTime - startTimeRef.current) / 1000);

      // Calculate progress through current phase
      const progress = Math.min(phaseElapsed / currentPhase.duration, 1);
      setPhaseProgress(progress);

      // Check if phase is complete
      if (phaseElapsed >= currentPhase.duration) {
        const nextPhaseIndex = (currentPhaseIndex + 1) % BREATH_CYCLE.length;
        setCurrentPhaseIndex(nextPhaseIndex);
        phaseStartRef.current = currentTime;

        // Increment cycle count when returning to first phase
        if (nextPhaseIndex === 0) {
          setcycleCount(prev => prev + 1);
        }
      }

      lastTime = currentTime;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, currentPhaseIndex, currentPhase.duration]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    setcycleCount(0);
    setTotalTime(0);
  };

  // Calculate scale for visual breathing circle
  const getCircleScale = () => {
    const baseScale = 1;
    const maxScale = 1.618; // Phi expansion
    const minScale = 0.618; // Phi contraction

    if (currentPhase.direction === 'expand') {
      return baseScale + (maxScale - baseScale) * phaseProgress;
    } else if (currentPhase.direction === 'contract') {
      return maxScale - (maxScale - minScale) * phaseProgress;
    } else {
      // Still/Syzygy - hold at current size
      return currentPhaseIndex === 1 ? maxScale : minScale;
    }
  };

  const circleScale = getCircleScale();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Phi Breath Meditation
        </h1>
        <p className="text-sm text-gray-300">
          Sacred breathing in golden ratio proportion
        </p>
      </div>

      {/* Breathing Visualization */}
      <div className="relative w-96 h-96 flex items-center justify-center mb-8">

        {/* Outer ring - always visible */}
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />

        {/* Breathing circle */}
        <div
          className={`absolute rounded-full bg-gradient-to-br ${currentPhase.color}
                     transition-all duration-300 ease-in-out shadow-2xl`}
          style={{
            width: `${circleScale * 200}px`,
            height: `${circleScale * 200}px`,
            opacity: 0.6 + (phaseProgress * 0.4),
            filter: `blur(${2 - phaseProgress}px)`,
          }}
        />

        {/* Center golden point */}
        <div className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500
                       shadow-lg shadow-yellow-400/50 z-10" />

        {/* Phase instruction */}
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <div className="text-2xl font-light text-white mb-2">
            {currentPhase.name}
          </div>
          <div className="text-sm text-gray-300">
            {currentPhase.instruction}
          </div>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="w-96 mb-8">
        {/* Phase progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full bg-gradient-to-r ${currentPhase.color} transition-all duration-100`}
            style={{ width: `${phaseProgress * 100}%` }}
          />
        </div>

        {/* Phase dots */}
        <div className="flex justify-center gap-2 mb-4">
          {BREATH_CYCLE.map((phase, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPhaseIndex
                  ? 'bg-white scale-150'
                  : index < currentPhaseIndex
                  ? 'bg-white/50'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-400">
          <div>
            Cycle: <span className="text-white font-medium">{cycleCount}</span>
          </div>
          <div>
            Time: <span className="text-white font-medium">{Math.floor(totalTime)}s</span>
          </div>
          <div>
            φ³ = <span className="text-yellow-400 font-medium">{TOTAL_CYCLE_TIME.toFixed(3)}s</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 rounded-full
                     bg-gradient-to-r from-purple-500 to-pink-500
                     text-white font-medium
                     hover:from-purple-600 hover:to-pink-600
                     transition-all shadow-lg"
          >
            <Play className="w-5 h-5" />
            Begin
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 rounded-full
                     bg-gradient-to-r from-orange-500 to-amber-500
                     text-white font-medium
                     hover:from-orange-600 hover:to-amber-600
                     transition-all shadow-lg"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-full
                   bg-white/10 text-white font-medium
                   hover:bg-white/20 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Sacred geometry info */}
      <div className="mt-12 max-w-2xl text-center text-sm text-gray-400 space-y-2">
        <p className="text-gray-300 font-medium">The Golden Breath Pattern</p>
        <p>Expansion (Yang): {PHI.toFixed(3)}s • Syzygy: 1.000s • Contraction (Yin): 1.000s • Seed: {(1/PHI).toFixed(3)}s</p>
        <p className="text-xs text-gray-500">
          This rhythm mirrors the natural proportion of consciousness expanding and returning to itself
        </p>
      </div>
    </div>
  );
}
