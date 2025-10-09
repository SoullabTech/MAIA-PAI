/**
 * Mock Activity API for Beta Monitor Demo
 * Simulates real-time user activity for demonstration
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Simulated active sessions
const MOCK_ACTIVE_SESSIONS = [
  {
    userId: 'andrea_fagan_001',
    name: 'Andrea Fagan',
    sessionStart: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    messageCount: 12,
    mode: 'voice',
    engagement: 85,
    coherenceLevel: 0.78
  },
  {
    userId: 'julie_mount_002',
    name: 'Julie Mountcastle',
    sessionStart: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    messageCount: 7,
    mode: 'text',
    engagement: 72,
    coherenceLevel: 0.65
  },
  {
    userId: 'patrick_koehn_003',
    name: 'Patrick Koehn',
    sessionStart: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    messageCount: 4,
    mode: 'voice',
    engagement: 91,
    coherenceLevel: 0.82
  }
];

export async function GET(request: NextRequest) {
  try {
    // Generate dynamic activity metrics
    const currentTime = new Date();
    const activities = MOCK_ACTIVE_SESSIONS.map(session => {
      const duration = Math.floor((currentTime.getTime() - session.sessionStart.getTime()) / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      return {
        user: session.name,
        status: 'active',
        duration: `${minutes}m ${seconds}s`,
        messages: session.messageCount + Math.floor(Math.random() * 3),
        mode: session.mode,
        engagement: session.engagement + Math.floor(Math.random() * 5 - 2),
        coherence: (session.coherenceLevel + (Math.random() * 0.1 - 0.05)).toFixed(2),
        lastActivity: new Date(Date.now() - Math.random() * 60 * 1000) // Within last minute
      };
    });

    // Generate recent events
    const events = [
      {
        timestamp: new Date(Date.now() - 30 * 1000),
        type: 'threshold',
        user: 'Andrea Fagan',
        description: 'Reached vulnerability threshold'
      },
      {
        timestamp: new Date(Date.now() - 45 * 1000),
        type: 'evolution',
        user: 'Patrick Koehn',
        description: 'Pattern awareness activated'
      },
      {
        timestamp: new Date(Date.now() - 90 * 1000),
        type: 'safety',
        user: 'Julie Mountcastle',
        description: 'Safety established'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        activeSessions: activities,
        activeCount: activities.length,
        registeredCount: 12, // Simulated registered users
        totalTesters: 28,
        recentEvents: events,
        systemStatus: {
          accuracy: 98,
          riskLevel: 2,
          voiceActive: true,
          fieldCoherence: 0.76
        }
      }
    });

  } catch (error) {
    console.error('Mock activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate mock activity' },
      { status: 500 }
    );
  }
}