/**
 * Biometric Parameters Configuration
 *
 * All ranges, thresholds, and weights for biometric-to-elemental calculations.
 * These values are grounded in research and empirical observation.
 *
 * References:
 * - HRV ranges: HeartMath Institute guidelines
 * - Breathing rates: Pranayama & HRV Biofeedback research
 * - Sleep parameters: NIH Sleep Quality Standards
 */

// =============================================================================
// HRV (Heart Rate Variability) Parameters
// =============================================================================

/**
 * HRV SDNN range in milliseconds
 *
 * Healthy adults: 20-100ms SDNN
 * - Below 20ms: Significantly reduced adaptability
 * - 20-50ms: Low to moderate autonomic flexibility
 * - 50-100ms: Good to excellent adaptability
 * - Above 100ms: Elite level nervous system resilience
 *
 * @see https://www.heartmath.org/research/hrv-basics/
 */
export const HRV_RANGE = {
  MIN: 20,   // Minimum healthy HRV (milliseconds)
  MAX: 100,  // Upper healthy range (milliseconds)
  OPTIMAL: 60 // Target for balanced coherence
} as const;

/**
 * HRV Variance range in milliseconds
 *
 * Measures statistical variance of RR intervals
 * - Low variance (50-150ms): Stable, grounded state
 * - Medium variance (150-300ms): Flexible, adaptive
 * - High variance (300-500ms): Highly dynamic, potentially stressed
 */
export const HRV_VARIANCE_RANGE = {
  MIN: 50,
  MAX: 500,
  STABILITY_THRESHOLD: 150, // Below = grounded, above = dynamic
} as const;

// =============================================================================
// Respiratory Parameters
// =============================================================================

/**
 * Breathing rate in breaths per minute
 *
 * Conscious breathing research:
 * - 15 bpm: Optimal for coherence (0.067Hz - coherence frequency)
 * - 12-18 bpm: General healthy range
 * - 8-12 bpm: Deep meditative states
 * - Below 8: Advanced pranayama
 * - Above 20: Stress response or physical exertion
 *
 * @see Lehrer, P. M. (2013). "How Does Heart Rate Variability Biofeedback Work?"
 */
export const BREATHING_PARAMETERS = {
  // Air Element (adaptability)
  AIR: {
    OPTIMAL: 15,      // Coherence breathing rate
    VARIANCE: 3,      // ±3 breaths acceptable range
    TOLERANCE: 0.8    // Bell curve tolerance factor
  },

  // Water Element (flow state)
  WATER: {
    OPTIMAL: 12,      // Slower, flowing breath
    VARIANCE: 3,
    TOLERANCE: 0.7    // More forgiving for flow
  },

  MIN_HEALTHY: 8,
  MAX_HEALTHY: 20,
  STRESS_THRESHOLD: 20 // Above = stress response
} as const;

// =============================================================================
// Heart Rate Parameters
// =============================================================================

/**
 * Resting Heart Rate (RHR) in beats per minute
 *
 * Athletic adults: 40-60 BPM
 * Average adults: 60-80 BPM
 * Above average: 80-100 BPM
 *
 * Lower RHR = better cardiovascular fitness = more grounded
 */
export const HEART_RATE_PARAMETERS = {
  RESTING: {
    ELITE: 50,        // Athletic/highly grounded
    NORMAL_LOW: 60,
    NORMAL_HIGH: 75,
    ELEVATED: 85,
    MIN: 50,          // Calculation range
    MAX: 85
  },

  ACTIVE: {
    BASELINE: 70,           // Threshold for fire activation
    ACTIVATION_BONUS: 0.2   // Fire score bonus when HR > 70
  }
} as const;

// =============================================================================
// Sleep Parameters
// =============================================================================

/**
 * Sleep duration and quality
 *
 * NIH recommendations:
 * - Total sleep: 7-9 hours for adults
 * - Deep sleep: 15-25% of total (roughly 1-2 hours)
 *
 * Earth element requires solid sleep foundation
 */
export const SLEEP_PARAMETERS = {
  TOTAL: {
    OPTIMAL: 7.5,     // Sweet spot for most adults
    VARIANCE: 1.5,    // ±1.5 hours acceptable (6-9 range)
    TOLERANCE: 0.8,   // Bell curve tolerance
    MIN: 4,           // Calculation floor
    MAX: 10           // Calculation ceiling
  },

  DEEP_SLEEP: {
    MIN: 0.5,         // Minimum restorative deep sleep (hours)
    MAX: 2.5,         // Maximum expected deep sleep
    OPTIMAL: 1.5,     // Target deep sleep duration
    PERCENTAGE_MIN: 15,  // % of total sleep
    PERCENTAGE_MAX: 25
  }
} as const;

// =============================================================================
// Readiness Score
// =============================================================================

/**
 * Overall readiness/recovery score (0-100)
 *
 * Typically provided by wearables (Oura, Whoop, etc.)
 * Combines HRV, RHR, sleep, and activity recovery
 *
 * Fire element uses this as baseline activation level
 */
export const READINESS_PARAMETERS = {
  SCALE: 100,               // 0-100 scale
  FIRE_BASELINE: 50,        // Threshold for moderate fire
  FIRE_HIGH: 75,            // High fire activation
  TRANSFORMATION_BONUS: 0.3 // Bonus when HRV trending up
} as const;

// =============================================================================
// Elemental Weight Distributions
// =============================================================================

/**
 * Weight distributions for elemental calculations
 *
 * These weights represent relative importance of each biometric
 * component in determining elemental coherence. Based on:
 * - Psychophysiological research
 * - Empirical testing with beta users
 * - Spiralogic phi-proportion principles
 */
export const ELEMENTAL_WEIGHTS = {
  AIR: {
    HRV: 0.5,              // Primary: Adaptability
    BREATHING: 0.3,        // Secondary: Conscious regulation
    VARIANCE: 0.2          // Supporting: Flexibility
  },

  FIRE: {
    READINESS: 0.5,        // Primary: Activation baseline
    HEART_RATE: 0.3,       // Secondary: Physical activation
    HRV_TREND: 0.2         // Supporting: Transformation trajectory
  },

  WATER: {
    RHYTHM: 0.4,           // Primary: Consistency/flow
    BREATHING: 0.3,        // Secondary: Breath flow
    TREND: 0.3             // Supporting: Flow state (stable/falling HRV)
  },

  EARTH: {
    RHR: 0.25,             // Foundation: Baseline grounding
    SLEEP: 0.3,            // Primary: Restorative capacity
    DEEP_SLEEP: 0.25,      // Primary: Quality of rest
    STABILITY: 0.2         // Supporting: Low variance = grounded
  },

  AETHER: {
    PEAK_COHERENCE: 0.4,   // Primary: System-wide harmony
    ELEMENT_BALANCE: 0.4,  // Secondary: Inter-elemental proportion
    PEAK_BONUS: 0.2,       // Supporting: HRV peak bonus
    HRV_PEAK_HIGH: 80,     // HRV threshold for high peak bonus
    HRV_PEAK_MEDIUM: 65    // HRV threshold for medium peak bonus
  },

  UNIFIED: {
    AETHER: 0.3,           // Aether weight (integration primary)
    AIR: 0.175,            // Air weight
    FIRE: 0.175,           // Fire weight
    WATER: 0.175,          // Water weight
    EARTH: 0.175           // Earth weight
  },

  BALANCE: {
    MAX_STDDEV: 0.5        // Maximum standard deviation for balance calculation
  }
} as const;

// =============================================================================
// Kairos Window Thresholds
// =============================================================================

/**
 * Thresholds for detecting optimal transformation windows
 *
 * Kairos = sacred timing, the qualitative "right moment"
 * Detected when multiple coherence factors align
 */
export const KAIROS_THRESHOLDS = {
  COHERENCE_MIN: 0.75,      // Minimum unified coherence
  AETHER_MIN: 0.8,          // Minimum aether coherence
  ELEMENT_MIN: 0.5,         // Minimum per-element threshold
  ELEMENT_BALANCE_MAX: 0.15, // Maximum deviation between elements

  DURATION_ESTIMATE: 30,    // Default window duration (minutes)
  DURATION_STABLE: 120,     // Stable trend window (minutes)
  DURATION_RISING: 90,      // Rising trend window (minutes)
  DURATION_DEFAULT: 60,     // Default window (minutes)

  STRENGTH_EXCELLENT: 0.9,  // Exceptional moment
  STRENGTH_GOOD: 0.8,       // Strong moment
  STRENGTH_MODERATE: 0.75   // Decent moment
} as const;

// =============================================================================
// Coherence Trend Parameters
// =============================================================================

/**
 * Parameters for detecting coherence trajectory
 *
 * Rising, stable, or falling HRV trends indicate different states:
 * - Rising: Active transformation (Fire)
 * - Stable: Flow state (Water)
 * - Falling: Integration/rest (Earth)
 */
export const TREND_BONUSES = {
  RISING: {
    FIRE_BONUS: 0.3,        // Fire amplification during growth
    AIR_BONUS: 0.1          // Air benefits from expansion
  },

  STABLE: {
    WATER_BONUS: 0.3,       // Water thrives in stability
    EARTH_BONUS: 0.1        // Earth appreciates consistency
  },

  FALLING: {
    WATER_BONUS: 0.2,       // Water can flow downward gracefully
    EARTH_BONUS: 0.15       // Earth integrates during descent
  }
} as const;

// =============================================================================
// Utility Constants
// =============================================================================

/**
 * Mathematical constants for calculations
 */
export const MATH_CONSTANTS = {
  PHI: 1.618034,            // Golden ratio (for future phi-scaling)
  COHERENCE_FREQUENCY: 0.1, // Hz - Heart-brain coherence resonance
  BELL_CURVE_SCALE: 2.0     // Standard deviation multiplier
} as const;

// =============================================================================
// Export All
// =============================================================================

export const BIOMETRIC_CONFIG = {
  HRV: HRV_RANGE,
  HRV_VARIANCE: HRV_VARIANCE_RANGE,
  BREATHING: BREATHING_PARAMETERS,
  HEART_RATE: HEART_RATE_PARAMETERS,
  SLEEP: SLEEP_PARAMETERS,
  READINESS: READINESS_PARAMETERS,
  WEIGHTS: ELEMENTAL_WEIGHTS,
  KAIROS: KAIROS_THRESHOLDS,
  TRENDS: TREND_BONUSES,
  MATH: MATH_CONSTANTS
} as const;

export default BIOMETRIC_CONFIG;
