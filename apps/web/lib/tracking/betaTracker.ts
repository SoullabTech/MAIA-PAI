// Minimal stub for beta tracker
export const betaTracker = {
  initBetaTester(userId: string) {
    console.log('[BetaTracker] initBetaTester', { userId });
  },

  trackPage(path: string, data: Record<string, any> = {}) {
    console.log('[BetaTracker] trackPage', { path, ...data });
  },

  trackEvent(name: string, data: Record<string, any> = {}) {
    console.log('[BetaTracker] trackEvent', { name, ...data });
  },
};
