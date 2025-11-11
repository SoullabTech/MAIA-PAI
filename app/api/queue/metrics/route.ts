/**
 * Queue Metrics Endpoint
 *
 * Provides real-time metrics about the Claude API request queue
 * Access at: http://localhost:3000/api/queue/metrics
 */

import { NextResponse } from 'next/server';
import { claudeQueue } from '@/lib/api/claude-queue';

export async function GET() {
  try {
    const metrics = claudeQueue.getMetrics();
    const isHealthy = claudeQueue.isHealthy();
    const queueLength = claudeQueue.getQueueLength();

    // Calculate success rate
    const successRate = metrics.totalRequests > 0
      ? ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)
      : '0.0';

    // Log to console
    claudeQueue.logStatus();

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'warning',
      timestamp: new Date().toISOString(),
      metrics: {
        totalRequests: metrics.totalRequests,
        successful: metrics.successfulRequests,
        failed: metrics.failedRequests,
        successRate: `${successRate}%`,
        averageWaitTime: `${metrics.averageWaitTime.toFixed(0)}ms`,
        currentQueueLength: queueLength,
        lastProcessedAt: metrics.lastProcessedAt
          ? new Date(metrics.lastProcessedAt).toISOString()
          : null
      },
      health: {
        isHealthy,
        message: isHealthy
          ? 'Queue is processing normally'
          : `Queue is backing up (${queueLength} requests waiting)`,
        recommendation: isHealthy
          ? null
          : 'Consider upgrading API tier or implementing additional rate limiting'
      }
    });

  } catch (error) {
    console.error('Error fetching queue metrics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST endpoint to reset metrics (useful for testing)
export async function POST() {
  try {
    claudeQueue.resetMetrics();

    return NextResponse.json({
      success: true,
      message: 'Queue metrics have been reset',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error resetting queue metrics:', error);
    return NextResponse.json(
      {
        error: 'Failed to reset metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
