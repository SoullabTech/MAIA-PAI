import { NextRequest, NextResponse } from 'next/server';

// Build-time guard to prevent client-side imports in server routes
if (typeof window !== 'undefined') {
  throw new Error('This is a server-side route');
}

// Dynamic imports to prevent build-time issues with client-side dependencies
const getJournalModules = async () => {
  const [
    { obsidianJournalExporter },
    { secureJournalStorage },
    { secureAuth }
  ] = await Promise.all([
    import('@/lib/journaling/ObsidianJournalExporter'),
    import('@/lib/storage/secure-journal-storage'),
    import('@/lib/auth/secure-auth')
  ]);

  return { obsidianJournalExporter, secureJournalStorage, secureAuth };
};

export async function POST(req: NextRequest) {
  try {
    const { entry, mode, reflection, userId, element } = await req.json();

    if (!entry || !mode || !reflection) {
      return NextResponse.json(
        { error: 'Entry, mode, and reflection are required' },
        { status: 400 }
      );
    }

    // Get modules dynamically to avoid build issues
    const { obsidianJournalExporter, secureJournalStorage, secureAuth } = await getJournalModules();

    const journalEntry = {
      id: `journal_${Date.now()}`,
      userId: userId || 'beta-user',
      mode,
      entry,
      reflection,
      timestamp: new Date(),
      element
    };

    // Verify authentication and initialize secure storage
    const authState = secureAuth.getAuthState();
    if (!authState.isAuthenticated || !authState.encryptionContext) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!secureJournalStorage.isInitialized()) {
      await secureJournalStorage.initialize(authState.encryptionContext);
    }

    await secureJournalStorage.addEntry({
      id: journalEntry.id,
      userId: journalEntry.userId,
      mode: journalEntry.mode,
      content: journalEntry.entry,
      reflection: journalEntry.reflection,
      timestamp: journalEntry.timestamp,
      element: journalEntry.element,
      wordCount: journalEntry.entry.split(/\s+/).length,
      isVoice: false
    });

    const result = await obsidianJournalExporter.exportJournalEntry(journalEntry);

    if (result.success) {
      return NextResponse.json({
        success: true,
        filePath: result.filePath,
        message: 'Journal entry exported to Obsidian and saved to storage'
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Journal entry saved to storage (Obsidian export failed)'
      });
    }

  } catch (error) {
    console.error('Journal export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}