import { NextRequest, NextResponse } from 'next/server';
import { obsidianJournalExporter, JournalEntry } from '@/lib/journaling/ObsidianJournalExporter';
import { secureJournalStorage } from '@/lib/storage/secure-journal-storage';
import { secureAuth } from '@/lib/auth/secure-auth';

export async function POST(req: NextRequest) {
  try {
    const { entry, mode, reflection, userId, element } = await req.json();

    if (!entry || !mode || !reflection) {
      return NextResponse.json(
        { error: 'Entry, mode, and reflection are required' },
        { status: 400 }
      );
    }

    const journalEntry: JournalEntry = {
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