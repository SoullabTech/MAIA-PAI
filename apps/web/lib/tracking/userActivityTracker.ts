// Minimal stub for user activity tracking
export class UserActivityTracker {
  private userId: string | null = null;
  private sessionId: string | null = null;

  init(userId: string, sessionId: string): void {
    console.log('[UserTracker] init', { userId, sessionId });
    this.userId = userId;
    this.sessionId = sessionId;
  }

  trackEvent(event: string, data: Record<string, any> = {}): void {
    console.log('[UserTracker] trackEvent', { event, data });
  }

  trackPageView(path: string): void {
    console.log('[UserTracker] trackPageView', { path });
  }

  trackConversation(messageCount: number, totalTokens?: number): void {
    console.log('[UserTracker] trackConversation', { messageCount, totalTokens });
  }

  trackVoiceInteraction(duration: number): void {
    console.log('[UserTracker] trackVoiceInteraction', { duration });
  }

  flush(): void {
    console.log('[UserTracker] flush');
  }
}

export const userTracker = new UserActivityTracker();