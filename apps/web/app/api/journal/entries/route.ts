import { NextRequest, NextResponse } from 'next/server';
import { secureJournalStorage } from '@/lib/storage/secure-journal-storage';
import { secureAuth } from '@/lib/auth/secure-auth';
// Mark route as dynamic since it uses searchParams or other dynamic features
export const dynamic = 'force-dynamic';



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'beta-user';
    const mode = searchParams.get('mode') as any;
    const symbol = searchParams.get('symbol');
    const archetype = searchParams.get('archetype');
    const emotion = searchParams.get('emotion');

    // Verify authentication and get encryption context
    const authState = secureAuth.getAuthState();
    if (!authState.isAuthenticated || !authState.encryptionContext) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Initialize secure storage if needed
    if (!secureJournalStorage.isInitialized()) {
      await secureJournalStorage.initialize(authState.encryptionContext);
    }

    const entries = await secureJournalStorage.getEntries(userId, {
      mode,
      symbol: symbol || undefined,
      archetype: archetype || undefined,
      emotion: emotion || undefined
    });

    const stats = await secureJournalStorage.getUserStats(userId);

    return NextResponse.json({
      success: true,
      entries,
      stats
    });

  } catch (error) {
    console.error('Entries API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}