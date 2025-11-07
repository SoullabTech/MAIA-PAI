//
//  ElementalCoherenceCalculator.swift
//  MAIA
//
//  Calculates elemental coherence from biometric data
//  Ported from TypeScript - same algorithms!
//

import Foundation

class ElementalCoherenceCalculator {

    // MARK: - Main Calculation

    func calculate(from snapshot: BiometricSnapshot) -> ElementalCoherence {
        let air = calculateAir(from: snapshot)
        let fire = calculateFire(from: snapshot)
        let water = calculateWater(from: snapshot)
        let earth = calculateEarth(from: snapshot)
        let aether = calculateAether(from: snapshot, elements: (air, fire, water, earth))
        let unified = calculateUnified(air: air, fire: fire, water: water, earth: earth, aether: aether)

        return ElementalCoherence(
            air: air,
            fire: fire,
            water: water,
            earth: earth,
            aether: aether,
            unified: unified,
            timestamp: Date()
        )
    }

    // MARK: - AIR: Clarity, Adaptability, Breath

    private func calculateAir(from snapshot: BiometricSnapshot) -> Double {
        // HRV component (nervous system flexibility) - 60%
        let hrvScore = normalize(snapshot.hrv, min: 20, max: 100)

        // Respiratory rate (optimal around 12-18) - 20%
        let respDeviation = abs(snapshot.respiratoryRate - 15.0)
        let respScore = normalize(15 - respDeviation, min: 0, max: 15)

        // HRV variance (lower = more stable = better) - 20%
        let varianceScore = 1.0 - normalize(snapshot.hrvVariance, min: 50, max: 500)

        return clamp(hrvScore * 0.6 + respScore * 0.2 + varianceScore * 0.2)
    }

    // MARK: - FIRE: Transformation, Activation, Energy

    private func calculateFire(from snapshot: BiometricSnapshot) -> Double {
        // Readiness score (activation potential) - 70%
        let readinessScore = normalize(snapshot.readinessScore, min: 0, max: 100)

        // HRV trend bonus (rising = more fire) - 20%
        let trendBonus: Double = {
            switch snapshot.hrvTrend {
            case .rising: return 0.2
            case .stable: return 0.0
            case .falling: return -0.1
            }
        }()

        // Peak state bonus - 10%
        let peakBonus = snapshot.isPeakState ? 0.1 : 0.0

        return clamp(readinessScore * 0.7 + trendBonus + peakBonus)
    }

    // MARK: - WATER: Flow, Rhythm, Emotional Regulation

    private func calculateWater(from snapshot: BiometricSnapshot) -> Double {
        // HRV stability (lower variance = better flow) - 60%
        let stabilityScore = 1.0 - normalize(snapshot.hrvVariance, min: 50, max: 500)

        // Rhythm consistency (heart rate regularity) - 40%
        // Using resting HR as proxy: closer to optimal (50-65) = better
        let rhythmScore = 1.0 - normalize(abs(snapshot.restingHeartRate - 57.5), min: 0, max: 20)

        return clamp(stabilityScore * 0.6 + rhythmScore * 0.4)
    }

    // MARK: - EARTH: Grounding, Stability, Embodiment

    private func calculateEarth(from snapshot: BiometricSnapshot) -> Double {
        // Sleep quality (total + deep) - 50%
        let sleepScore = min(snapshot.sleepHours / 8.0, 1.0) * 0.7
        let deepSleepBonus = min(snapshot.deepSleepHours / 2.0, 1.0) * 0.3

        // Resting heart rate (lower = more grounded) - 30%
        let rhrScore = 1.0 - normalize(snapshot.restingHeartRate, min: 50, max: 85)

        // Embodiment baseline - 20%
        let embodimentBase = 0.5 // Default grounded state

        return clamp((sleepScore + deepSleepBonus) * 0.5 + rhrScore * 0.3 + embodimentBase * 0.2)
    }

    // MARK: - AETHER: Unity, Integration, Transcendence

    private func calculateAether(from snapshot: BiometricSnapshot, elements: (air: Double, fire: Double, water: Double, earth: Double)) -> Double {
        // Elemental balance (all elements present) - 50%
        let allElements = [elements.air, elements.fire, elements.water, elements.earth]
        let maxElement = allElements.max() ?? 0
        let minElement = allElements.min() ?? 0
        let balance = 1.0 - (maxElement - minElement)

        // Peak state HRV (very high HRV = transcendent moments) - 30%
        let peakScore = normalize(snapshot.hrv, min: 50, max: 100)

        // Integration bonus (readiness + balance) - 20%
        let integrationScore = normalize(snapshot.readinessScore, min: 0, max: 100) * balance

        return clamp(balance * 0.5 + peakScore * 0.3 + integrationScore * 0.2)
    }

    // MARK: - UNIFIED: Overall Field Coherence

    private func calculateUnified(air: Double, fire: Double, water: Double, earth: Double, aether: Double) -> Double {
        return (air + fire + water + earth + aether) / 5.0
    }

    // MARK: - Utility Functions

    /// Normalize value between 0 and 1
    private func normalize(_ value: Double, min minValue: Double, max maxValue: Double) -> Double {
        guard maxValue > minValue else { return 0.5 }
        return clamp((value - minValue) / (maxValue - minValue))
    }

    /// Clamp value between 0 and 1
    private func clamp(_ value: Double) -> Double {
        return max(0.0, min(1.0, value))
    }
}

// MARK: - Singleton

extension ElementalCoherenceCalculator {
    static let shared = ElementalCoherenceCalculator()
}
