/**
 * Development Mode Protection
 *
 * Prevents MAIA personality degradation during hot module replacement (HMR)
 * and active development iterations.
 *
 * THE PROBLEM:
 * - Visual changes trigger HMR
 * - React state resets
 * - Conversation context corrupted
 * - MAIA defaults to brief 'her' mode
 * - Personality appears broken
 *
 * THE SOLUTION:
 * - Always use full personality in dev
 * - Persist session through HMR
 * - Monitor personality health
 * - Auto-recover from degradation
 */

export const DEV_MODE = process.env.NODE_ENV === 'development';

export const CONVERSATION_DEFAULTS = {
  // In development: Always use full MAIA personality (never brief 'her' mode)
  defaultStyle: DEV_MODE ? 'classic' : 'her',

  // Preserve context through hot reloads
  persistContext: DEV_MODE,

  // Verbose error messages and personality health checks
  debugMode: DEV_MODE,

  // Minimum response length to detect degradation
  minHealthyWordCount: 20,

  // Patterns that indicate personality degradation
  degradationPatterns: [
    /REall/i,
    /Whats up\?/i,
    /Hey ther!/i,
    /^(Mm-hmm|Go on|\.\.\.)$/i
  ]
};

/**
 * Check if MAIA's personality is healthy
 */
export function checkMAIAPersonalityHealth(response: string): {
  isHealthy: boolean;
  issues: string[];
} {
  if (!DEV_MODE) {
    return { isHealthy: true, issues: [] };
  }

  const issues: string[] = [];

  // Check word count
  const wordCount = response.trim().split(/\s+/).length;
  if (wordCount < CONVERSATION_DEFAULTS.minHealthyWordCount) {
    issues.push(`Response too short (${wordCount} words, expected ${CONVERSATION_DEFAULTS.minHealthyWordCount}+)`);
  }

  // Check for degradation patterns
  for (const pattern of CONVERSATION_DEFAULTS.degradationPatterns) {
    if (pattern.test(response)) {
      issues.push(`Contains degradation pattern: ${pattern.source}`);
    }
  }

  // Check for philosophical depth markers (should be present in healthy MAIA)
  const depthMarkers = [
    /witness/i,
    /sacred/i,
    /transformation/i,
    /spiral/i,
    /element/i,
    /breath/i,
    /presence/i,
    /emerge/i
  ];

  const hasDepth = depthMarkers.some(marker => marker.test(response));
  if (!hasDepth && wordCount > 50) {
    // Only flag if response is long but lacks depth (not just a brief acknowledgment)
    issues.push('Lacks philosophical depth markers');
  }

  return {
    isHealthy: issues.length === 0,
    issues
  };
}

/**
 * Recover from personality degradation
 */
export function recoverMAIAPersonality(): void {
  if (!DEV_MODE) return;

  console.warn('🔄 MAIA personality degradation detected - initiating recovery...');

  // Clear potentially corrupted state
  try {
    sessionStorage.removeItem('maya_conversation_style');
    sessionStorage.removeItem('maia_context');
    localStorage.removeItem('maya_conversation_style');

    console.log('✓ Cleared corrupted conversation state');
  } catch (error) {
    console.error('Failed to clear state:', error);
  }

  // Reload to restore clean state
  if (typeof window !== 'undefined') {
    console.log('🔄 Reloading to restore MAIA...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
