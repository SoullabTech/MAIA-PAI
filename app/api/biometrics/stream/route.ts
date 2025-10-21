/**
 * Real-Time Biometric Data Stream API
 *
 * Receives live health data from:
 * - Apple Shortcuts (webhook)
 * - iOS Companion App (future)
 * - Web Bluetooth Heart Rate Monitors
 *
 * Stores in IndexedDB for immediate use in sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { biometricStorage } from '@/lib/biometrics/BiometricStorage';

export const runtime = 'edge';

interface BiometricStreamData {
  userId: string;
  timestamp: string;
  hrv?: number;          // HRV in milliseconds
  heartRate?: number;    // BPM
  respiratoryRate?: number; // Breaths per minute
  sleepHours?: number;   // Hours of sleep last night
  source: 'apple-shortcuts' | 'ios-app' | 'web-bluetooth' | 'manual';
}

/**
 * POST /api/biometrics/stream
 *
 * Receive real-time biometric data
 */
export async function POST(request: NextRequest) {
  try {
    const data: BiometricStreamData = await request.json();

    console.log('💓 Received biometric stream:', {
      userId: data.userId,
      hrv: data.hrv,
      heartRate: data.heartRate,
      source: data.source,
      timestamp: data.timestamp
    });

    // Validate required fields
    if (!data.userId || !data.timestamp) {
      return NextResponse.json(
        { error: 'Missing userId or timestamp' },
        { status: 400 }
      );
    }

    // Validate at least one metric is provided
    if (!data.hrv && !data.heartRate && !data.respiratoryRate && !data.sleepHours) {
      return NextResponse.json(
        { error: 'At least one biometric metric required (hrv, heartRate, respiratoryRate, or sleepHours)' },
        { status: 400 }
      );
    }

    // Store in server-side storage (for sync across devices)
    // In production, this would go to Supabase
    // For now, we'll just validate and return success
    // The client will store in IndexedDB

    // Calculate coherence level from HRV
    let coherenceLevel = 0.5; // Default balanced
    if (data.hrv) {
      // HRV coherence mapping (simplified HeartMath-style)
      if (data.hrv > 60) coherenceLevel = 0.8; // High coherence
      else if (data.hrv > 40) coherenceLevel = 0.6; // Medium-high
      else if (data.hrv > 25) coherenceLevel = 0.4; // Medium-low
      else coherenceLevel = 0.2; // Low coherence (stressed)
    }

    // Determine recommended presence mode
    let recommendedMode: 'dialogue' | 'patient' | 'scribe' = 'dialogue';
    if (coherenceLevel >= 0.7) {
      recommendedMode = 'scribe'; // High coherence → witnessing mode
    } else if (coherenceLevel >= 0.4) {
      recommendedMode = 'patient'; // Medium → patient inquiry
    } else {
      recommendedMode = 'dialogue'; // Low → gentle support
    }

    return NextResponse.json({
      success: true,
      received: {
        hrv: data.hrv,
        heartRate: data.heartRate,
        respiratoryRate: data.respiratoryRate,
        sleepHours: data.sleepHours,
        source: data.source
      },
      analysis: {
        coherenceLevel,
        recommendedMode,
        status: coherenceLevel >= 0.7 ? 'optimal' : coherenceLevel >= 0.4 ? 'balanced' : 'building'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing biometric stream:', error);
    return NextResponse.json(
      { error: 'Failed to process biometric data' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/biometrics/stream
 *
 * Returns instructions for setting up real-time data streaming
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/biometrics/stream',
    methods: ['POST'],
    description: 'Receive real-time biometric data from Apple Watch and other sources',

    integrations: {
      'apple-shortcuts': {
        description: 'Use iOS Shortcuts app to auto-send health data every 5 minutes',
        setup: [
          '1. Open Shortcuts app on iPhone',
          '2. Create new Automation → Time of Day → Every 5 minutes',
          '3. Add Action: Get Health Sample → Heart Rate Variability',
          '4. Add Action: Get Contents of URL → POST to this endpoint',
          '5. In URL body, send JSON with your userId and HRV value'
        ],
        examplePayload: {
          userId: 'user_123',
          timestamp: new Date().toISOString(),
          hrv: 45.2,
          heartRate: 65,
          source: 'apple-shortcuts'
        }
      },

      'ios-companion-app': {
        description: 'Native iOS app with HealthKit for real-time streaming',
        status: 'Coming soon - provides sub-second updates'
      },

      'web-bluetooth': {
        description: 'Connect compatible heart rate monitor via Web Bluetooth API',
        status: 'Experimental - works in Chrome/Edge'
      }
    },

    responseFormat: {
      success: true,
      received: {
        hrv: 45.2,
        heartRate: 65
      },
      analysis: {
        coherenceLevel: 0.6,
        recommendedMode: 'patient',
        status: 'balanced'
      }
    }
  });
}
