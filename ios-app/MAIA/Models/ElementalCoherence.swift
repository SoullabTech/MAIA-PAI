//
//  ElementalCoherence.swift
//  MAIA
//
//  Elemental consciousness metrics - the heart of MAIA
//

import Foundation

struct ElementalCoherence {
    // The 5 elements (0.0 - 1.0)
    let air: Double        // Clarity, adaptability, breath
    let fire: Double       // Transformation, activation, energy
    let water: Double      // Flow, rhythm, emotional regulation
    let earth: Double      // Grounding, stability, embodiment
    let aether: Double     // Unity, peak coherence, integration

    // Unified field coherence (0.0 - 1.0)
    let unified: Double

    // Metadata
    let timestamp: Date

    // Computed properties
    var unifiedPercentage: Int {
        Int(unified * 100)
    }

    var airPercentage: Int {
        Int(air * 100)
    }

    var firePercentage: Int {
        Int(fire * 100)
    }

    var waterPercentage: Int {
        Int(water * 100)
    }

    var earthPercentage: Int {
        Int(earth * 100)
    }

    var aetherPercentage: Int {
        Int(aether * 100)
    }

    // Dominant element
    var dominantElement: Element {
        let elements = [
            (Element.air, air),
            (Element.fire, fire),
            (Element.water, water),
            (Element.earth, earth),
            (Element.aether, aether)
        ]
        return elements.max(by: { $0.1 < $1.1 })?.0 ?? .air
    }

    // Deficient element
    var deficientElement: Element {
        let elements = [
            (Element.air, air),
            (Element.fire, fire),
            (Element.water, water),
            (Element.earth, earth),
            (Element.aether, aether)
        ]
        return elements.min(by: { $0.1 < $1.1 })?.0 ?? .air
    }

    // Is this a Kairos window?
    var isKairosWindow: Bool {
        unified > 0.75 &&
        air > 0.5 &&
        fire > 0.5 &&
        water > 0.5 &&
        earth > 0.5 &&
        aether > 0.8
    }
}

// Element enum with metadata
enum Element: String, CaseIterable {
    case air = "Air"
    case fire = "Fire"
    case water = "Water"
    case earth = "Earth"
    case aether = "Aether"

    var emoji: String {
        switch self {
        case .air: return "💨"
        case .fire: return "🔥"
        case .water: return "🌊"
        case .earth: return "🌍"
        case .aether: return "✨"
        }
    }

    var description: String {
        switch self {
        case .air: return "Clarity, adaptability, breath"
        case .fire: return "Transformation, activation, energy"
        case .water: return "Flow, rhythm, emotional regulation"
        case .earth: return "Grounding, stability, embodiment"
        case .aether: return "Unity, peak coherence, integration"
        }
    }
}

// Extension for creating test data
extension ElementalCoherence {
    static func mock() -> ElementalCoherence {
        ElementalCoherence(
            air: 0.65,
            fire: 0.72,
            water: 0.80,
            earth: 0.88,
            aether: 0.45,
            unified: 0.70,
            timestamp: Date()
        )
    }
}
