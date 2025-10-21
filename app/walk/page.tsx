'use client';

/**
 * WALK-AND-TALK MODE
 *
 * Optimized for morning meditation walks with live HRV biofeedback
 * - Large, glanceable HRV/coherence display
 * - Voice-first conversation
 * - Adaptive presence modes based on real-time biometrics
 * - Outdoor-friendly UI (high contrast, large touch targets)
 */

import React, { useState, useEffect } from 'react';
import { useBiometricCoherence } from '@/hooks/useBiometricCoherence';
import { getCoherenceColor, getMotionState } from '@/hooks/useBiometricCoherence';
import { Activity, Heart, TrendingUp, TrendingDown, Minus, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WalkModePage() {
  const biometrics = useBiometricCoherence();
  const [isWalking, setIsWalking] = useState(false);
  const [walkStartTime, setWalkStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');

  // Start/stop walk tracking
  const toggleWalk = () => {
    if (!isWalking) {
      setWalkStartTime(new Date());
      setIsWalking(true);
    } else {
      setWalkStartTime(null);
      setIsWalking(false);
    }
  };

  // Update elapsed time
  useEffect(() => {
    if (!isWalking || !walkStartTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - walkStartTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWalking, walkStartTime]);

  // Get coherence status text
  const getCoherenceStatus = (level: number): string => {
    if (level >= 0.8) return 'Breakthrough';
    if (level >= 0.6) return 'Deep';
    if (level >= 0.4) return 'Building';
    if (level >= 0.2) return 'Settling';
    return 'Present';
  };

  const coherenceColor = getCoherenceColor(biometrics.coherenceLevel);
  const coherenceStatus = getCoherenceStatus(biometrics.coherenceLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dune-deep-sand via-dune-spice-sand to-dune-desert-rose flex flex-col">
      {/* Header - Minimal, glanceable */}
      <div className="p-4 flex items-center justify-between border-b border-dune-rose-gold/20">
        <Link href="/maia">
          <Button variant="ghost" size="sm" className="text-dune-deep-sand">
            ← Back
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-dune-wellness-crimson">Walk Mode</h1>
          {isWalking && (
            <p className="text-sm text-dune-deep-sand">{elapsedTime}</p>
          )}
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Main Content - Large, Touch-Friendly */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">

        {/* Live Biometric Display - HUGE for glancing */}
        {biometrics.isStreaming ? (
          <div className="w-full max-w-md space-y-6">

            {/* Heart Rate - Primary Display */}
            <div
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 transition-all duration-500"
              style={{
                borderColor: coherenceColor,
                boxShadow: `0 0 40px ${coherenceColor}40`
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Heart
                    className="w-12 h-12 animate-pulse"
                    style={{ color: coherenceColor }}
                  />
                  <div className="text-7xl font-bold" style={{ color: coherenceColor }}>
                    {biometrics.heartRate || '--'}
                  </div>
                </div>
                <p className="text-2xl text-dune-deep-sand font-semibold">BPM</p>
              </div>
            </div>

            {/* HRV Display */}
            {biometrics.hrv && (
              <div className="bg-dune-sunset-blush/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-dune-heart-coral/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-8 h-8 text-dune-wellness-crimson" />
                    <div>
                      <p className="text-sm text-dune-deep-sand uppercase tracking-wide">HRV</p>
                      <p className="text-4xl font-bold text-dune-wellness-crimson">
                        {Math.round(biometrics.hrv)}
                        <span className="text-xl ml-1">ms</span>
                      </p>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex items-center gap-2">
                    {biometrics.coherenceTrend === 'rising' && (
                      <TrendingUp className="w-8 h-8 text-dune-bloom-magenta" />
                    )}
                    {biometrics.coherenceTrend === 'falling' && (
                      <TrendingDown className="w-8 h-8 text-dune-wellness-crimson" />
                    )}
                    {biometrics.coherenceTrend === 'stable' && (
                      <Minus className="w-8 h-8 text-dune-deep-sand" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Coherence Level - Beautiful gradient ring */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-dune-rose-gold/40">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold text-dune-deep-sand">Coherence</p>
                <p className="text-3xl font-bold" style={{ color: coherenceColor }}>
                  {coherenceStatus}
                </p>
              </div>

              {/* Progress Ring */}
              <div className="relative w-full h-4 bg-dune-spice-sand/30 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${biometrics.coherenceLevel * 100}%`,
                    background: `linear-gradient(90deg, ${coherenceColor}80, ${coherenceColor})`
                  }}
                />
              </div>
              <p className="text-right text-sm text-dune-deep-sand mt-2">
                {Math.round(biometrics.coherenceLevel * 100)}%
              </p>
            </div>

            {/* Recommended Mode */}
            <div className="bg-gradient-to-r from-dune-spice-trance-pink/30 to-dune-bloom-magenta/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-dune-bloom-magenta/40">
              <p className="text-sm text-dune-deep-sand uppercase tracking-wide mb-2">MAIA Recommends</p>
              <p className="text-3xl font-bold text-dune-wellness-crimson capitalize">
                {biometrics.recommendedMode} Mode
              </p>
              <p className="text-sm text-dune-deep-sand mt-2">
                {biometrics.recommendedBreathRate}s breath rhythm
              </p>
            </div>

          </div>
        ) : (
          /* No biometric data - Setup prompt */
          <div className="max-w-md text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-dune-sunset-blush/40 rounded-full flex items-center justify-center">
              <Activity className="w-16 h-16 text-dune-wellness-crimson" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dune-wellness-crimson mb-2">
                No Biometric Data
              </h2>
              <p className="text-dune-deep-sand leading-relaxed">
                Set up Apple Shortcuts or upload health data to see live HRV feedback during your walk.
              </p>
            </div>
            <Link href="/settings/biometrics">
              <Button className="bg-dune-wellness-crimson hover:bg-dune-heart-coral text-white px-8 py-6 text-lg">
                Set Up Biometrics
              </Button>
            </Link>
          </div>
        )}

        {/* Walk Start/Stop Button */}
        <Button
          onClick={toggleWalk}
          size="lg"
          className={`
            w-full max-w-md py-8 text-2xl font-bold rounded-2xl transition-all shadow-2xl
            ${isWalking
              ? 'bg-dune-wellness-crimson hover:bg-dune-heart-coral text-white'
              : 'bg-gradient-to-r from-dune-bloom-magenta to-dune-spice-trance-pink text-white'
            }
          `}
        >
          <Navigation className={`w-8 h-8 mr-3 ${isWalking ? 'animate-pulse' : ''}`} />
          {isWalking ? 'End Walk' : 'Start Walk'}
        </Button>

      </div>

      {/* Instructions - Bottom */}
      {!biometrics.isStreaming && (
        <div className="p-6 bg-white/60 backdrop-blur-sm border-t border-dune-rose-gold/30">
          <h3 className="font-semibold text-dune-wellness-crimson mb-3">How to Use Walk Mode:</h3>
          <ol className="space-y-2 text-sm text-dune-deep-sand">
            <li className="flex gap-2">
              <span className="font-bold text-dune-wellness-crimson">1.</span>
              <span>Set up Apple Shortcuts to auto-sync HRV every 5 mins</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-dune-wellness-crimson">2.</span>
              <span>Start your outdoor walk</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-dune-wellness-crimson">3.</span>
              <span>Talk to MAIA as you walk</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-dune-wellness-crimson">4.</span>
              <span>Watch your coherence build in real-time</span>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
