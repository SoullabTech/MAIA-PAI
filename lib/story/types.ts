/**
 * Living Soul Story - Type Definitions
 *
 * The database schema for evolving mythologies co-authored with MAIA.
 *
 * Core Philosophy:
 * - Stories GROW (not static readings)
 * - Co-authored (MAIA drafts, member refines)
 * - Living mythology (chart as framework, life as content)
 * - Witnessed evolution (MAIA remembers across time)
 */

export type ChapterStatus = 'draft' | 'in-revision' | 'approved';
export type ThreadStatus = 'emerging' | 'active' | 'integrated' | 'completed';

/**
 * A note from the member - feedback, suggestions, memories to weave in
 */
export interface MemberNote {
  id: string;
  text: string;
  timestamp: Date;
  resolved: boolean; // Has MAIA incorporated this feedback?
  relatedSection?: string; // Which part of the narrative this refers to
}

/**
 * Revision history - how the story evolved through co-authorship
 */
export interface Revision {
  id: string;
  text: string;
  timestamp: Date;
  trigger: 'maia-initial' | 'member-feedback' | 'session-integration' | 'transit-update';
  triggerContext?: string; // Session ID, transit data, etc.
}

/**
 * An unfolding thread - patterns MAIA is tracking across the journey
 */
export interface StoryThread {
  id: string;
  name: string; // "Saturn focal point work" | "Moon emotional healing"
  description: string;
  status: ThreadStatus;

  relatedChapters: string[]; // Chapter IDs where this thread appears
  relatedSessions: string[]; // Session IDs feeding this thread
  relatedJournals: string[]; // Journal entry IDs

  chartContext: {
    planets?: string[]; // ["Saturn", "Moon"]
    houses?: number[]; // [10, 4]
    aspects?: string[]; // ["Saturn square Moon"]
    transits?: any; // Current transit data
  };

  firstDetected: Date;
  lastUpdated: Date;
}

/**
 * A chapter in the living mythology
 */
export interface StoryChapter {
  id: string;
  userId: string;

  // Chapter metadata
  title: string; // "Genesis" | "The Saturn Crossing" | "Sacred Play Emerging"
  chapterNumber: number; // 0 for Genesis, then 1, 2, 3...
  status: ChapterStatus;

  // The narrative (the actual story text)
  currentDraft: string; // MAIA's current version
  memberNotes: MemberNote[]; // Member's feedback
  revisionHistory: Revision[]; // How it evolved

  // What generated this chapter
  sourceData: {
    chartInsights?: string[]; // Archetypal patterns from birth chart
    sessionIds?: string[]; // Sessions that contributed
    journalIds?: string[]; // Journal entries that contributed
    threadIds?: string[]; // Story threads woven into this chapter
    transitData?: any; // Major transits happening during this chapter
  };

  // Timeline
  createdAt: Date;
  approvedAt?: Date; // When member approved this version
  periodStart?: Date; // When this chapter's timeframe begins
  periodEnd?: Date; // When this chapter's timeframe ends (null for current)
}

/**
 * Timeline event - visual markers in the story journey
 */
export interface TimelineEvent {
  id: string;
  userId: string;

  date: Date;
  type: 'chapter-created' | 'breakthrough-session' | 'major-transit' | 'life-event';
  title: string; // "Saturn Return Begins" | "Maestro Dragonfly Transmission"
  description?: string;

  relatedChapterId?: string;
  relatedSessionId?: string;
  relatedJournalId?: string;
}

/**
 * The complete living soul story
 */
export interface SoulStory {
  id: string;
  userId: string;

  // Story metadata
  title: string; // "Kelly Nezat · Evolutionary Journey"
  subtitle?: string; // "A Living Mythology Co-Authored with MAIA"

  // The narrative structure
  chapters: StoryChapter[];
  activeThreads: StoryThread[]; // Patterns currently being tracked
  completedThreads: StoryThread[]; // Patterns that have integrated

  // Visual journey
  timeline: TimelineEvent[];

  // Birth chart foundation (stable architecture)
  chartSummary: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    chartPattern?: string; // "Funnel/Bucket with Saturn focal point"
    dominantElement?: string;
    keyThemes?: string[]; // High-level archetypal themes
  };

  // Story settings (member preferences)
  settings: {
    narrativeVoice: 'third-person' | 'second-person'; // "Kelly discovers..." vs "You discover..."
    archetypeDepth: 'accessible' | 'deep' | 'tarnas-level';
    autoGenerateChapters: boolean; // Should MAIA propose new chapters automatically?
    includeTransits: boolean; // Weave current transits into the narrative?
  };

  createdAt: Date;
  lastUpdated: Date;
}

/**
 * MAIA's story weaving context - what MAIA knows when drafting
 */
export interface StoryWeavingContext {
  // Foundation
  birthChart: any; // Full chart data
  chartSummary: SoulStory['chartSummary'];

  // Journey so far
  existingChapters: StoryChapter[];
  activeThreads: StoryThread[];

  // Recent activity
  recentSessions: any[]; // Last 5-10 sessions
  recentJournals: any[]; // Last 5-10 journal entries
  currentTransits?: any;

  // Member preferences
  settings: SoulStory['settings'];

  // What's being requested
  intent: 'genesis' | 'new-chapter' | 'revision' | 'thread-update';
  memberPrompt?: string; // If member requested specific focus
}
