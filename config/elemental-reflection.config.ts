/**
 * ELEMENTAL REFLECTION CONFIGURATION
 * Version: v0.9.0-alpha (Initial Public Integration - October 16, 2025)
 *
 * Toggle and configure elemental reflection behavior for Maia conversations.
 *
 * Following EO's guidance:
 * "Add a config flag: enableElementalReflection: true | false.
 *  That lets you demo safely without binding it permanently into Maia's core."
 *
 * SECURITY: All logs remain local and are NEVER transmitted off-device
 *           without explicit user consent.
 */

export interface ElementalReflectionConfig {
  // MASTER TOGGLE - Enable/disable elemental reflection system
  enableElementalReflection: boolean;

  // REFLECTION FREQUENCY
  reflectionFrequency: 'every' | 'occasional' | 'sparse';
  // 'every' = every message gets reflection
  // 'occasional' = every 2-3 messages
  // 'sparse' = only when confidence is high

  // CONFIDENCE THRESHOLD
  minimumConfidence: 'detected' | 'suggested' | 'ambiguous';
  // Only show reflections when confidence meets this threshold

  // LOGGING
  enableSilentLogging: boolean;
  logDirectory: string;

  // TESTING MODE
  testMode: boolean;
  // When true, includes _internal metadata in response for debugging
}

// DEFAULT CONFIGURATION
export const DEFAULT_CONFIG: ElementalReflectionConfig = {
  enableElementalReflection: true,
  reflectionFrequency: 'every',
  minimumConfidence: 'suggested', // Show detected and suggested, skip ambiguous
  enableSilentLogging: true,
  logDirectory: 'logs/elemental-reflections',
  testMode: false
};

// PRODUCTION CONFIGURATION
export const PRODUCTION_CONFIG: ElementalReflectionConfig = {
  enableElementalReflection: true,
  reflectionFrequency: 'every',
  minimumConfidence: 'suggested',
  enableSilentLogging: true,
  logDirectory: 'logs/elemental-reflections',
  testMode: false
};

// TESTING CONFIGURATION
export const TEST_CONFIG: ElementalReflectionConfig = {
  enableElementalReflection: true,
  reflectionFrequency: 'every',
  minimumConfidence: 'ambiguous', // Show all detections for testing
  enableSilentLogging: true,
  logDirectory: 'logs/elemental-reflections',
  testMode: true // Include internal metadata for debugging
};

// DISABLED CONFIGURATION
export const DISABLED_CONFIG: ElementalReflectionConfig = {
  enableElementalReflection: false,
  reflectionFrequency: 'every',
  minimumConfidence: 'detected',
  enableSilentLogging: false,
  logDirectory: 'logs/elemental-reflections',
  testMode: false
};

/**
 * Get current configuration based on environment
 */
export function getElementalConfig(): ElementalReflectionConfig {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return PRODUCTION_CONFIG;
    case 'test':
      return TEST_CONFIG;
    case 'development':
    default:
      return DEFAULT_CONFIG;
  }
}

/**
 * Override config with environment variables
 */
export function getConfigWithEnvOverrides(): ElementalReflectionConfig {
  const baseConfig = getElementalConfig();

  return {
    ...baseConfig,
    enableElementalReflection:
      process.env.ELEMENTAL_REFLECTION_ENABLED === 'false'
        ? false
        : baseConfig.enableElementalReflection,
    testMode:
      process.env.ELEMENTAL_REFLECTION_TEST_MODE === 'true'
        ? true
        : baseConfig.testMode
  };
}

/**
 * USAGE EXAMPLES:
 *
 * // In route.ts or other integration points:
 * import { getConfigWithEnvOverrides } from '@/config/elemental-reflection.config';
 *
 * const config = getConfigWithEnvOverrides();
 * const reflection = await processElementalReflection(message, userId, config);
 *
 * // To disable via environment variable:
 * ELEMENTAL_REFLECTION_ENABLED=false npm run dev
 *
 * // To enable test mode via environment variable:
 * ELEMENTAL_REFLECTION_TEST_MODE=true npm run dev
 */
