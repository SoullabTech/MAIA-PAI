'use client';

/**
 * Field Coherence Dashboard
 *
 * Mobile-optimized, glanceable view for field testing
 * Shows real-time elemental coherence + Kairos windows
 */

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { realtimeBiometricService } from '@/lib/biometrics/RealtimeBiometricService';
import { elementalCoherenceCalculator } from '@/lib/biometrics/ElementalCoherenceCalculator';
import { coherenceDetector } from '@/lib/biometrics/CoherenceDetector';
import { biometricStorage } from '@/lib/biometrics/BiometricStorage';
import type { BiometricUpdate } from '@/lib/biometrics/RealtimeBiometricService';
import type { ElementalCoherence, KairosWindow } from '@/lib/biometrics/ElementalCoherenceCalculator';
import type { CoherenceState } from '@/lib/biometrics/CoherenceDetector';

export function FieldCoherenceDashboard() {
  const [biometricUpdate, setBiometricUpdate] = useState<BiometricUpdate | null>(null);
  const [elemental, setElemental] = useState<ElementalCoherence | null>(null);
  const [kairos, setKairos] = useState<KairosWindow | null>(null);
  const [coherenceState, setCoherenceState] = useState<CoherenceState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAndSubscribe = async () => {
      try {
        // Load initial data
        const hasData = await biometricStorage.hasHealthData();

        if (hasData) {
          const healthData = await biometricStorage.getLatestHealthData();
          if (healthData && mounted) {
            // Initialize coherence detector with history
            coherenceDetector.loadHistory(healthData, 60);

            // Calculate initial coherence
            const coherence = coherenceDetector.analyzeCoherence();
            setCoherenceState(coherence);

            // Calculate elemental coherence
            const elementalCoherence = elementalCoherenceCalculator.calculateFromHealthData(
              healthData,
              coherence
            );
            setElemental(elementalCoherence);

            // Detect Kairos window
            const kairosWindow = elementalCoherenceCalculator.detectKairosWindow(
              elementalCoherence,
              coherence
            );
            setKairos(kairosWindow);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize field dashboard:', error);
        setIsLoading(false);
      }
    };

    initializeAndSubscribe();

    // Subscribe to real-time updates
    realtimeBiometricService.start(30000); // Poll every 30 seconds

    const unsubscribe = realtimeBiometricService.subscribe(async (update) => {
      if (!mounted) return;

      setBiometricUpdate(update);

      // Recalculate elemental coherence on each update
      try {
        const healthData = await biometricStorage.getLatestHealthData();
        if (healthData) {
          coherenceDetector.loadHistory(healthData, 60);
          const coherence = coherenceDetector.analyzeCoherence();
          setCoherenceState(coherence);

          const elementalCoherence = elementalCoherenceCalculator.calculateFromHealthData(
            healthData,
            coherence
          );
          setElemental(elementalCoherence);

          const kairosWindow = elementalCoherenceCalculator.detectKairosWindow(
            elementalCoherence,
            coherence
          );
          setKairos(kairosWindow);
        }
      } catch (error) {
        console.error('Failed to update elemental coherence:', error);
      }
    });

    return () => {
      mounted = false;
      realtimeBiometricService.stop();
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dune-spice-sand via-dune-desert-rose to-dune-rose-gold">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dune-heart-coral border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dune-deep-sand font-medium">Loading field coherence...</p>
        </div>
      </div>
    );
  }

  if (!elemental || !coherenceState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dune-spice-sand via-dune-desert-rose to-dune-rose-gold p-6">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 max-w-md text-center shadow-xl border-2 border-dune-rose-gold/40">
          <Activity className="w-16 h-16 text-dune-heart-coral mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dune-wellness-crimson mb-3">
            No Health Data
          </h2>
          <p className="text-dune-deep-sand mb-4">
            Import your Apple Health data to activate the field coherence dashboard.
          </p>
          <a
            href="/settings/biometrics"
            className="inline-block bg-gradient-to-r from-dune-heart-coral to-dune-bloom-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Import Health Data
          </a>
        </div>
      </div>
    );
  }

  const description = elementalCoherenceCalculator.getElementalDescription(elemental);
  const coherencePercent = Math.round(elemental.unified * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dune-spice-sand via-dune-desert-rose to-dune-rose-gold p-4">

      {/* Unified Field Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-dune-rose-gold/50">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div
                className="absolute inset-0 rounded-full blur-2xl -z-10"
                style={{
                  background: `radial-gradient(circle, rgba(212, 93, 121, ${elemental.unified * 0.6}), transparent 70%)`,
                  transform: `scale(${1 + elemental.unified * 0.3})`
                }}
              />
              <div className="text-6xl font-bold bg-gradient-to-br from-dune-wellness-crimson via-dune-heart-coral to-dune-bloom-magenta bg-clip-text text-transparent">
                {coherencePercent}%
              </div>
            </div>
            <div className="text-sm font-semibold text-dune-rose-deep mt-2 uppercase tracking-wider">
              Unified Field
            </div>
            <div className="text-xs text-dune-deep-sand mt-1">
              {description.state}
            </div>
          </div>

          {/* Elemental Bars */}
          <div className="space-y-3">
            {/* Air */}
            <ElementBar
              label="💨 Air"
              value={elemental.air}
              color="from-sky-400 to-blue-500"
            />

            {/* Fire */}
            <ElementBar
              label="🔥 Fire"
              value={elemental.fire}
              color="from-orange-400 to-red-500"
            />

            {/* Water */}
            <ElementBar
              label="🌊 Water"
              value={elemental.water}
              color="from-cyan-400 to-blue-600"
            />

            {/* Earth */}
            <ElementBar
              label="🌍 Earth"
              value={elemental.earth}
              color="from-green-600 to-emerald-700"
            />

            {/* Aether */}
            <ElementBar
              label="✨ Aether"
              value={elemental.aether}
              color="from-purple-400 to-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Current State Card */}
      {biometricUpdate && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-dune-rose-gold/40">
            <h3 className="text-lg font-bold text-dune-wellness-crimson mb-4">Current State</h3>

            <div className="grid grid-cols-2 gap-3">
              {/* HRV */}
              {biometricUpdate.hrv && (
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-xs text-dune-deep-sand mb-1">HRV</div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-dune-wellness-crimson" />
                    <span className="text-lg font-bold text-dune-deep-sand">
                      {Math.round(biometricUpdate.hrv)}ms
                    </span>
                  </div>
                </div>
              )}

              {/* Heart Rate */}
              {biometricUpdate.heartRate && (
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-xs text-dune-deep-sand mb-1">Heart Rate</div>
                  <div className="flex items-center gap-2">
                    <span className="text-dune-heart-coral">♥</span>
                    <span className="text-lg font-bold text-dune-deep-sand">
                      {Math.round(biometricUpdate.heartRate)} BPM
                    </span>
                  </div>
                </div>
              )}

              {/* Breath */}
              {biometricUpdate.respiratoryRate && (
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="text-xs text-dune-deep-sand mb-1">Breath</div>
                  <div className="text-lg font-bold text-dune-deep-sand">
                    {Math.round(biometricUpdate.respiratoryRate)}/min
                  </div>
                </div>
              )}

              {/* Trend */}
              <div className="bg-white/50 rounded-xl p-3">
                <div className="text-xs text-dune-deep-sand mb-1">Trend</div>
                <div className="flex items-center gap-2">
                  {biometricUpdate.coherenceTrend === 'rising' && (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                  {biometricUpdate.coherenceTrend === 'falling' && (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  {biometricUpdate.coherenceTrend === 'stable' && (
                    <Minus className="w-4 h-4 text-dune-deep-sand" />
                  )}
                  <span className="text-sm font-semibold text-dune-deep-sand capitalize">
                    {biometricUpdate.coherenceTrend}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Mode */}
            <div className="mt-4 bg-gradient-to-r from-dune-spice-trance-pink/30 to-dune-bloom-magenta/30 backdrop-blur-sm rounded-xl p-4 border border-dune-bloom-magenta/40">
              <div className="text-xs text-dune-deep-sand mb-1">Recommended</div>
              <div className="text-lg font-bold text-dune-wellness-crimson capitalize">
                {biometricUpdate.recommendedMode} Mode
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kairos Window */}
      {kairos && (
        <div className="max-w-md mx-auto">
          <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 ${
            kairos.isOpen
              ? 'bg-gradient-to-br from-amber-100/60 to-yellow-100/60 border-amber-400/60'
              : 'bg-white/30 border-dune-rose-gold/30'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <Zap className={`w-6 h-6 ${kairos.isOpen ? 'text-amber-600' : 'text-gray-400'}`} />
              <h3 className="text-lg font-bold text-dune-wellness-crimson">
                Kairos Window
              </h3>
              {kairos.isOpen && (
                <div className="ml-auto bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  OPEN
                </div>
              )}
            </div>

            {kairos.isOpen && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-dune-deep-sand">Strength</span>
                  <span className="text-sm font-bold text-dune-wellness-crimson">
                    {Math.round(kairos.strength * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${kairos.strength * 100}%` }}
                  />
                </div>

                <div className="text-xs text-dune-deep-sand mt-2">
                  Window closes in: <span className="font-bold">{kairos.duration}m</span>
                </div>
              </div>
            )}

            <p className="text-sm text-dune-deep-sand leading-relaxed">
              {kairos.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Element Bar Component
function ElementBar({ label, value, color }: { label: string; value: number; color: string }) {
  const percent = Math.round(value * 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-dune-deep-sand">{label}</span>
        <span className="text-sm font-bold text-dune-wellness-crimson">{percent}%</span>
      </div>
      <div className="h-2 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
