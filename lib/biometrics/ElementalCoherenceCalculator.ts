/**
 * Elemental Coherence Calculator
 *
 * Maps biometric data to Air/Fire/Water/Earth/Aether qualities
 * Provides unified field coherence scoring for MAIA-PAI system
 *
 * All parameters externalized to /lib/config/BiometricParameters.ts
 * following Spiralogic principle: clarity through explicit constants
 */

import type { ParsedHealthData, HRVReading } from './HealthDataImporter';
import type { CoherenceState } from './CoherenceDetector';
import { BIOMETRIC_CONFIG } from '../config/BiometricParameters';

export interface ElementalCoherence {
  air: number;    // 0-1 (clarity, adaptability, breath)
  fire: number;   // 0-1 (activation, transformation, energy)
  water: number;  // 0-1 (flow, rhythm, emotional regulation)
  earth: number;  // 0-1 (grounding, stability, embodiment)
  aether: number; // 0-1 (unity, peak coherence, integration)
  unified: number; // 0-1 (overall field coherence)
}

export interface BiometricSnapshot {
  hrv: number;              // milliseconds (SDNN)
  heartRate: number;        // BPM
  restingHeartRate: number; // BPM
  respiratoryRate: number;  // breaths/min
  sleepHours: number;
  deepSleepHours: number;
  hrvTrend: 'rising' | 'stable' | 'falling';
  hrvVariance: number;      // statistical variance
  readinessScore: number;   // 0-100
}

export interface KairosWindow {
  isOpen: boolean;
  strength: number; // 0-1
  duration: number; // minutes remaining
  recommendation: string;
}

export class ElementalCoherenceCalculator {

  /**
   * Calculate elemental coherence from biometric snapshot
   */
  calculate(data: BiometricSnapshot): ElementalCoherence {
    const air = this.calculateAir(data);
    const fire = this.calculateFire(data);
    const water = this.calculateWater(data);
    const earth = this.calculateEarth(data);

    // Aether requires all elements to calculate balance
    const aether = this.calculateAether(data, { air, fire, water, earth });

    // Unified field coherence
    const unified = this.calculateUnified({ air, fire, water, earth, aether });

    return { air, fire, water, earth, aether, unified };
  }

  /**
   * Calculate from parsed health data (convenience method)
   */
  calculateFromHealthData(data: ParsedHealthData, coherence: CoherenceState): ElementalCoherence {
    const snapshot = this.healthDataToSnapshot(data, coherence);
    return this.calculate(snapshot);
  }

  /**
   * AIR - Clarity, adaptability, nervous system flexibility
   */
  private calculateAir(data: BiometricSnapshot): number {
    const { HRV, HRV_VARIANCE, BREATHING, WEIGHTS } = BIOMETRIC_CONFIG;

    // Higher HRV = more adaptability
    const hrvScore = this.normalize(data.hrv, HRV.MIN, HRV.MAX);

    // Optimal breathing: coherence frequency
    const breathScore = this.bellCurve(
      data.respiratoryRate,
      BREATHING.AIR.OPTIMAL,
      BREATHING.AIR.VARIANCE,
      BREATHING.AIR.TOLERANCE
    );

    // Higher variance = more flexibility
    const varianceScore = this.normalize(data.hrvVariance, HRV_VARIANCE.MIN, HRV_VARIANCE.MAX);

    return this.weightedAverage([
      { value: hrvScore, weight: WEIGHTS.AIR.HRV },
      { value: breathScore, weight: WEIGHTS.AIR.BREATHING },
      { value: varianceScore, weight: WEIGHTS.AIR.VARIANCE }
    ]);
  }

  /**
   * FIRE - Activation, transformation, vitality
   */
  private calculateFire(data: BiometricSnapshot): number {
    const { READINESS, HEART_RATE, TRENDS } = BIOMETRIC_CONFIG;

    // Base: Readiness score
    let fireScore = data.readinessScore / READINESS.SCALE;

    // Activation bonus: Higher heart rate = more fire
    if (data.heartRate > HEART_RATE.ACTIVE.BASELINE) {
      fireScore = Math.min(1, fireScore + HEART_RATE.ACTIVE.ACTIVATION_BONUS);
    }

    // Transformation bonus: Rising HRV = active transformation
    if (data.hrvTrend === 'rising') {
      fireScore = Math.min(1, fireScore + TRENDS.RISING.FIRE_BONUS);
    }

    return this.clamp(fireScore, 0, 1);
  }

  /**
   * WATER - Flow, emotional regulation, rhythmic consistency
   */
  private calculateWater(data: BiometricSnapshot): number {
    const { HRV_VARIANCE, BREATHING, TRENDS, WEIGHTS } = BIOMETRIC_CONFIG;

    // Flow state: Stable or gently falling HRV
    const flowBonus = data.hrvTrend === 'stable' ? TRENDS.STABLE.WATER_BONUS :
                      data.hrvTrend === 'falling' ? TRENDS.FALLING.WATER_BONUS : 0;

    // Rhythm score: Low variance = steady flow (inverted)
    const rhythmScore = 1 - this.normalize(data.hrvVariance, HRV_VARIANCE.MIN, HRV_VARIANCE.MAX);

    // Slow breathing = more flow
    const breathFlow = this.bellCurve(
      data.respiratoryRate,
      BREATHING.WATER.OPTIMAL,
      BREATHING.WATER.VARIANCE,
      BREATHING.WATER.TOLERANCE
    );

    return this.weightedAverage([
      { value: rhythmScore, weight: WEIGHTS.WATER.RHYTHM },
      { value: breathFlow, weight: WEIGHTS.WATER.BREATHING },
      { value: flowBonus, weight: WEIGHTS.WATER.TREND }
    ]);
  }

  /**
   * EARTH - Grounding, stability, embodiment
   */
  private calculateEarth(data: BiometricSnapshot): number {
    const { HEART_RATE, SLEEP, HRV_VARIANCE, WEIGHTS } = BIOMETRIC_CONFIG;

    // Lower resting heart rate = more grounded (inverted)
    const rhrScore = 1 - this.normalize(
      data.restingHeartRate,
      HEART_RATE.RESTING.MIN,
      HEART_RATE.RESTING.MAX
    );

    // Optimal sleep: bell curve around 7.5 hours
    const sleepScore = this.bellCurve(
      data.sleepHours,
      SLEEP.TOTAL.OPTIMAL,
      SLEEP.TOTAL.VARIANCE,
      SLEEP.TOTAL.TOLERANCE
    );

    // Deep sleep quality
    const deepSleepScore = this.normalize(
      data.deepSleepHours,
      SLEEP.DEEP_SLEEP.MIN,
      SLEEP.DEEP_SLEEP.MAX
    );

    // Stability: Low HRV variance = grounded
    const stabilityScore = 1 - this.normalize(data.hrvVariance, HRV_VARIANCE.MIN, HRV_VARIANCE.MAX);

    return this.weightedAverage([
      { value: rhrScore, weight: WEIGHTS.EARTH.RHR },
      { value: sleepScore, weight: WEIGHTS.EARTH.SLEEP },
      { value: deepSleepScore, weight: WEIGHTS.EARTH.DEEP_SLEEP },
      { value: stabilityScore, weight: WEIGHTS.EARTH.STABILITY }
    ]);
  }

  /**
   * AETHER - Unity, transcendence, peak coherence, integration
   */
  private calculateAether(
    data: BiometricSnapshot,
    elements: { air: number; fire: number; water: number; earth: number }
  ): number {
    const { WEIGHTS, READINESS } = BIOMETRIC_CONFIG;

    // Peak HRV bonus
    const peakHrvBonus = data.hrv > WEIGHTS.AETHER.HRV_PEAK_HIGH ? 0.2 :
                        data.hrv > WEIGHTS.AETHER.HRV_PEAK_MEDIUM ? 0.1 : 0;

    // System integration (readiness)
    const integrationScore = data.readinessScore / READINESS.SCALE;

    // Elemental balance: All elements in harmony
    const balanceScore = this.calculateElementalBalance(elements);

    return this.weightedAverage([
      { value: integrationScore, weight: WEIGHTS.AETHER.PEAK_COHERENCE },
      { value: balanceScore, weight: WEIGHTS.AETHER.ELEMENT_BALANCE },
      { value: peakHrvBonus, weight: WEIGHTS.AETHER.PEAK_BONUS }
    ]);
  }

  /**
   * UNIFIED FIELD - Overall coherence
   */
  private calculateUnified(elements: ElementalCoherence): number {
    const { WEIGHTS } = BIOMETRIC_CONFIG;

    // Weight Aether highest (integration), then balance of all four elements
    return this.weightedAverage([
      { value: elements.aether, weight: WEIGHTS.UNIFIED.AETHER },
      { value: elements.air, weight: WEIGHTS.UNIFIED.AIR },
      { value: elements.fire, weight: WEIGHTS.UNIFIED.FIRE },
      { value: elements.water, weight: WEIGHTS.UNIFIED.WATER },
      { value: elements.earth, weight: WEIGHTS.UNIFIED.EARTH }
    ]);
  }

  /**
   * Calculate elemental balance (1.0 = perfect balance, 0 = extreme imbalance)
   */
  private calculateElementalBalance(elements: { air: number; fire: number; water: number; earth: number }): number {
    const { WEIGHTS } = BIOMETRIC_CONFIG;

    const values = [elements.air, elements.fire, elements.water, elements.earth];
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;

    // Calculate standard deviation
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = better balance
    // Convert to 0-1 scale using configured max stddev
    return Math.max(0, 1 - (stdDev / WEIGHTS.BALANCE.MAX_STDDEV));
  }

  /**
   * Detect Kairos windows (optimal moments for transformation)
   */
  detectKairosWindow(
    elemental: ElementalCoherence,
    coherence: CoherenceState
  ): KairosWindow {
    const { KAIROS } = BIOMETRIC_CONFIG;

    // Kairos requires:
    // 1. High unified coherence
    // 2. Aether above threshold
    // 3. All elements balanced (no single element below minimum)
    // 4. Rising or stable trend

    const isCoherenceHigh = elemental.unified > KAIROS.COHERENCE_MIN;
    const isAetherHigh = elemental.aether > KAIROS.AETHER_MIN;
    const areElementsBalanced =
      elemental.air > KAIROS.ELEMENT_MIN &&
      elemental.fire > KAIROS.ELEMENT_MIN &&
      elemental.water > KAIROS.ELEMENT_MIN &&
      elemental.earth > KAIROS.ELEMENT_MIN;
    const isTrendFavorable = coherence.trend !== 'falling';

    const isOpen = isCoherenceHigh && isAetherHigh && areElementsBalanced && isTrendFavorable;

    // Calculate strength (0-1)
    const strength = isOpen ?
      Math.min(1, elemental.unified * elemental.aether) : 0;

    // Estimate duration based on trend and coherence
    // Stable/rising = longer windows
    let duration = 0;
    if (isOpen) {
      duration = coherence.trend === 'stable' ? KAIROS.DURATION_STABLE :
                 coherence.trend === 'rising' ? KAIROS.DURATION_RISING :
                 KAIROS.DURATION_DEFAULT;

      // Adjust by strength
      duration = Math.round(duration * strength);
    }

    // Generate recommendation
    let recommendation = '';
    if (isOpen) {
      if (strength > KAIROS.STRENGTH_EXCELLENT) {
        recommendation = 'Peak coherence for deep transformational work. Enter Scribe mode.';
      } else if (strength > KAIROS.STRENGTH_GOOD) {
        recommendation = 'Strong coherence for focused creative work or shadow integration.';
      } else {
        recommendation = 'Good coherence for meditation, journaling, or contemplative practice.';
      }
    } else if (elemental.unified > 0.6) {
      recommendation = 'Building coherence. Continue with Patient mode work.';
    } else {
      recommendation = 'Rest and restoration recommended. Dialogue mode for gentle integration.';
    }

    return {
      isOpen,
      strength,
      duration,
      recommendation
    };
  }

  /**
   * Get human-readable elemental description
   */
  getElementalDescription(elemental: ElementalCoherence): {
    primary: string;
    secondary: string;
    state: string;
  } {
    // Find primary and secondary elements
    const elements = [
      { name: 'Air', value: elemental.air, emoji: '💨' },
      { name: 'Fire', value: elemental.fire, emoji: '🔥' },
      { name: 'Water', value: elemental.water, emoji: '🌊' },
      { name: 'Earth', value: elemental.earth, emoji: '🌍' }
    ];

    elements.sort((a, b) => b.value - a.value);

    const primary = `${elements[0].emoji} ${elements[0].name}`;
    const secondary = `${elements[1].emoji} ${elements[1].name}`;

    // Overall state based on unified coherence
    let state = '';
    if (elemental.unified > 0.85) {
      state = 'Peak Coherence - All elements unified';
    } else if (elemental.unified > 0.75) {
      state = 'High Coherence - Strong integration';
    } else if (elemental.unified > 0.6) {
      state = 'Good Coherence - Building';
    } else if (elemental.unified > 0.4) {
      state = 'Medium Coherence - Balancing';
    } else {
      state = 'Low Coherence - Rest needed';
    }

    return { primary, secondary, state };
  }

  // ========== UTILITY METHODS ==========

  /**
   * Normalize value to 0-1 range
   */
  private normalize(value: number, min: number, max: number): number {
    return this.clamp((value - min) / (max - min), 0, 1);
  }

  /**
   * Bell curve centered on target
   */
  private bellCurve(value: number, target: number, spread: number, peak: number = 1): number {
    const distance = Math.abs(value - target);
    const normalized = Math.exp(-Math.pow(distance / spread, 2));
    return normalized * peak;
  }

  /**
   * Clamp value between min and max
   */
  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  /**
   * Weighted average
   */
  private weightedAverage(items: Array<{ value: number; weight: number }>): number {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const weightedSum = items.reduce((sum, item) => sum + item.value * item.weight, 0);
    return weightedSum / totalWeight;
  }

  /**
   * Convert ParsedHealthData to BiometricSnapshot
   */
  private healthDataToSnapshot(data: ParsedHealthData, coherence: CoherenceState): BiometricSnapshot {
    // Get latest values
    const latestHRV = data.hrv[0]?.value || 50;
    const latestHR = data.heartRate[0]?.value || 70;
    const restingHR = data.heartRate.find(r => r.context === 'resting')?.value || 65;
    const latestResp = data.respiratory[0]?.value || 15;

    // Calculate sleep
    const totalSleep = data.sleep.reduce((sum, s) => sum + s.durationHours, 0);
    const deepSleep = data.sleep
      .filter(s => s.stage === 'deep')
      .reduce((sum, s) => sum + s.durationHours, 0);

    // Calculate HRV variance
    const hrvValues = data.hrv.slice(0, 20).map(r => r.value); // Last 20 readings
    const hrvMean = hrvValues.reduce((sum, v) => sum + v, 0) / hrvValues.length;
    const hrvVariance = hrvValues.reduce((sum, v) => sum + Math.pow(v - hrvMean, 2), 0) / hrvValues.length;

    return {
      hrv: latestHRV,
      heartRate: latestHR,
      restingHeartRate: restingHR,
      respiratoryRate: latestResp,
      sleepHours: totalSleep,
      deepSleepHours: deepSleep,
      hrvTrend: coherence.trend,
      hrvVariance,
      readinessScore: data.readinessScore
    };
  }
}

// Export singleton
export const elementalCoherenceCalculator = new ElementalCoherenceCalculator();
