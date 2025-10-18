import { NextRequest, NextResponse } from 'next/server';

/**
 * Extension Configuration API
 *
 * GET: Fetch user's extension configuration
 * PATCH: Update extension settings
 */

// Mock configuration for feel testing
const mockConfig = {
  userId: 'test-user',
  extensions: {
    astrology: {
      enabled: true,
      settings: {
        houseSystem: 'porphyry',
        showTransits: true,
      },
    },
    iching: {
      enabled: false,
      settings: {
        castingMethod: 'coin',
        dailyAutoCast: true,
      },
    },
    tarot: {
      enabled: false,
      settings: {
        deck: 'rider-waite',
        dailyDraw: true,
      },
    },
    dreamwork: {
      enabled: false,
      settings: {
        morningReminder: true,
        trackRecurring: true,
      },
    },
    somatic: {
      enabled: false,
      settings: {
        practiceReminders: false,
        trackTension: true,
      },
    },
    mythology: {
      enabled: false,
      settings: {
        traditions: ['greek'],
      },
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    );
  }

  // For feel testing, return mock config
  return NextResponse.json(mockConfig);
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, extensionId, enabled, settings } = body;

    if (!userId || !extensionId) {
      return NextResponse.json(
        { error: 'userId and extensionId are required' },
        { status: 400 }
      );
    }

    // For feel testing, update mock config and return
    if (enabled !== undefined) {
      mockConfig.extensions[extensionId as keyof typeof mockConfig.extensions].enabled = enabled;
    }

    if (settings) {
      mockConfig.extensions[extensionId as keyof typeof mockConfig.extensions].settings = {
        ...mockConfig.extensions[extensionId as keyof typeof mockConfig.extensions].settings,
        ...settings,
      };
    }

    mockConfig.updatedAt = new Date();

    return NextResponse.json(mockConfig);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update extension config' },
      { status: 500 }
    );
  }
}
