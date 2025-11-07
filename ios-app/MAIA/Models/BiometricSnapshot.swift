//
//  BiometricSnapshot.swift
//  MAIA
//
//  Biometric data structure - mirrors your TypeScript version
//

import Foundation

struct BiometricSnapshot {
    // Core vitals
    let hrv: Double                    // Heart Rate Variability (ms)
    let heartRate: Double              // BPM
    let restingHeartRate: Double       // Resting HR
    let respiratoryRate: Double        // Breaths per minute

    // Sleep data
    let sleepHours: Double             // Total sleep last night
    let deepSleepHours: Double         // Deep sleep duration

    // Derived metrics
    let hrvTrend: HRVTrend             // Rising, stable, or falling
    let hrvVariance: Double            // HRV stability measure
    let readinessScore: Double         // 0-100 composite score

    // Metadata
    let timestamp: Date

    // Computed: Is this a peak state?
    var isPeakState: Bool {
        return hrv > 60 && readinessScore > 70
    }
}

// HRV Trend enum
enum HRVTrend: String {
    case rising = "rising"
    case stable = "stable"
    case falling = "falling"
}

// Extension for creating test data
extension BiometricSnapshot {
    static func mock() -> BiometricSnapshot {
        BiometricSnapshot(
            hrv: 45.2,
            heartRate: 68.0,
            restingHeartRate: 55.0,
            respiratoryRate: 14.0,
            sleepHours: 7.5,
            deepSleepHours: 1.8,
            hrvTrend: .stable,
            hrvVariance: 120.0,
            readinessScore: 65.0,
            timestamp: Date()
        )
    }
}
