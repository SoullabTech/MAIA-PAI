/**
 * Usage Tracker Middleware
 * Tracks and monitors user usage statistics for MAIA Oracle system
 */

export interface UsageStats {
  userId: string;
  totalConversations: number;
  totalTokens: number;
  totalDuration: number;
  lastActivity: Date | null;
  conversationsPerDay: number;
  averageSessionLength: number;
  weeklyTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface SystemSummary {
  totalUsers: number;
  totalConversations: number;
  totalTokens: number;
  activeUsersToday: number;
  averageConversationsPerUser: number;
  topUsers: Array<{
    userId: string;
    conversations: number;
    tokens: number;
  }>;
  dailyStats: Array<{
    date: string;
    conversations: number;
    tokens: number;
    activeUsers: number;
  }>;
}

export interface QuotaCheck {
  allowed: boolean;
  quota: number | null;
  used: number;
  remaining: number | null;
  resetDate: Date | null;
  reason: string | null;
}

class UsageTracker {
  /**
   * Get user summary statistics
   */
  async getUserSummary(userId: string, days: number = 7): Promise<UsageStats | null> {
    try {
      console.log(`📊 [USAGE] Fetching summary for user ${userId} (${days} days)`);

      // Mock implementation - replace with actual database queries
      const mockStats: UsageStats = {
        userId,
        totalConversations: Math.floor(Math.random() * 50) + 10,
        totalTokens: Math.floor(Math.random() * 100000) + 10000,
        totalDuration: Math.floor(Math.random() * 3600000) + 600000, // milliseconds
        lastActivity: new Date(),
        conversationsPerDay: Math.floor(Math.random() * 10) + 1,
        averageSessionLength: Math.floor(Math.random() * 600) + 300, // seconds
        weeklyTrend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any
      };

      return mockStats;
    } catch (error) {
      console.error('❌ [USAGE] Error getting user summary:', error);
      return null;
    }
  }

  /**
   * Check user quota status
   */
  async checkQuota(userId: string): Promise<QuotaCheck> {
    try {
      console.log(`🚦 [USAGE] Checking quota for user ${userId}`);

      // Mock implementation - replace with actual quota logic
      const dailyQuota = 100;
      const used = Math.floor(Math.random() * 80);
      const remaining = dailyQuota - used;

      return {
        allowed: remaining > 0,
        quota: dailyQuota,
        used,
        remaining,
        resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        reason: remaining <= 0 ? 'Daily quota exceeded' : null
      };
    } catch (error) {
      console.error('❌ [USAGE] Error checking quota:', error);
      return {
        allowed: true,
        quota: null,
        used: 0,
        remaining: null,
        resetDate: null,
        reason: 'Error checking quota - allowing by default'
      };
    }
  }

  /**
   * Get system-wide summary statistics
   */
  async getSystemSummary(days: number = 7): Promise<SystemSummary | null> {
    try {
      console.log(`📊 [USAGE] Fetching system summary (${days} days)`);

      // Mock implementation - replace with actual database aggregations
      const mockSummary: SystemSummary = {
        totalUsers: Math.floor(Math.random() * 1000) + 100,
        totalConversations: Math.floor(Math.random() * 10000) + 1000,
        totalTokens: Math.floor(Math.random() * 1000000) + 100000,
        activeUsersToday: Math.floor(Math.random() * 100) + 20,
        averageConversationsPerUser: Math.floor(Math.random() * 20) + 5,
        topUsers: Array.from({ length: 5 }, (_, i) => ({
          userId: `user_${i + 1}`,
          conversations: Math.floor(Math.random() * 100) + 20,
          tokens: Math.floor(Math.random() * 50000) + 5000
        })),
        dailyStats: Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          conversations: Math.floor(Math.random() * 200) + 50,
          tokens: Math.floor(Math.random() * 20000) + 5000,
          activeUsers: Math.floor(Math.random() * 50) + 10
        }))
      };

      return mockSummary;
    } catch (error) {
      console.error('❌ [USAGE] Error getting system summary:', error);
      return null;
    }
  }

  /**
   * Track a new conversation session
   */
  async trackConversation(userId: string, metadata: {
    tokens?: number;
    duration?: number;
    mode?: string;
    success?: boolean;
  } = {}): Promise<void> {
    try {
      console.log(`📝 [USAGE] Tracking conversation for ${userId}:`, metadata);
      // In real implementation, save to database
    } catch (error) {
      console.error('❌ [USAGE] Error tracking conversation:', error);
    }
  }

  /**
   * Track API usage
   */
  async trackAPIUsage(userId: string, endpoint: string, metadata: {
    tokens?: number;
    latency?: number;
    success?: boolean;
  } = {}): Promise<void> {
    try {
      console.log(`🔌 [USAGE] Tracking API usage for ${userId} at ${endpoint}:`, metadata);
      // In real implementation, save to database
    } catch (error) {
      console.error('❌ [USAGE] Error tracking API usage:', error);
    }
  }
}

// Export singleton instance
export const usageTracker = new UsageTracker();

// Export class for testing
export { UsageTracker };