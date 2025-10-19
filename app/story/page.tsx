'use client';

/**
 * Living Soul Story Page
 *
 * "Everyone wants to author their story. But they need help."
 *
 * This is where MAIA helps you write your living mythology.
 * Not a static reading. A co-authored, evolving narrative that grows as you grow.
 *
 * Features:
 * - Genesis chapter (generated from birth chart)
 * - Evolving chapters (drafted by MAIA, refined by you)
 * - Story threads (patterns MAIA tracks across time)
 * - Timeline view (visual journey)
 * - Co-authorship interface (MAIA drafts, you refine)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Edit3, History, Sparkles, Plus, CheckCircle, MessageCircle } from 'lucide-react';
import { StoryAPI } from '@/lib/story/storyAPI';

// Mock data for development - will connect to real data
const mockStory = {
  title: "Your Evolutionary Journey",
  subtitle: "A Living Mythology Co-Authored with MAIA",
  chapters: [
    {
      id: '0',
      title: 'Genesis',
      chapterNumber: 0,
      status: 'approved' as const,
      currentDraft: `Your soul architecture reveals a unique pattern written in the stars at your first breath.

The cosmos arranged itself in a configuration that speaks to your essential nature - not as fate, but as invitation. Each planetary placement, each house activation, each aspect creates a field of archetypal potential waiting to be lived.

This is not who you must be. This is the instrument you were given to play the music only you can make.`,
      memberNotes: [],
      revisionHistory: [],
      sourceData: {
        chartInsights: ['Birth chart synthesis'],
      },
      createdAt: new Date(),
      approvedAt: new Date(),
    },
  ],
  activeThreads: [
    {
      id: '1',
      name: 'Finding Your Voice',
      description: 'The journey from silence to authentic expression',
      status: 'active' as const,
      relatedChapters: ['0'],
      relatedSessions: [],
      relatedJournals: [],
      chartContext: {},
      firstDetected: new Date(),
      lastUpdated: new Date(),
    },
  ],
  timeline: [
    {
      id: '1',
      date: new Date(),
      type: 'chapter-created' as const,
      title: 'Story Begins',
      description: 'Genesis chapter created from birth chart',
    },
  ],
};

export default function StoryPage() {
  const [view, setView] = useState<'narrative' | 'timeline'>('narrative');
  const [selectedChapter, setSelectedChapter] = useState(mockStory.chapters[0]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memberNote, setMemberNote] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Handler functions for co-authorship
  const handleAddNote = async () => {
    if (!memberNote.trim()) return;

    // In production: await StoryAPI.addMemberNote(selectedChapter.id, memberNote)
    console.log('Adding member note:', memberNote);

    // Clear textarea
    setMemberNote('');

    // Show confirmation (in production, update UI with new note)
    alert('Your feedback has been added! MAIA will incorporate this in the next revision.');
  };

  const handleRequestRevision = async () => {
    if (selectedChapter.memberNotes.length === 0 && !memberNote.trim()) {
      alert('Please add your feedback first before requesting a revision.');
      return;
    }

    // Add current note if exists
    if (memberNote.trim()) {
      await handleAddNote();
    }

    setIsRevising(true);

    try {
      // In production: await StoryAPI.requestRevision(selectedChapter.id)
      console.log('Requesting revision for chapter:', selectedChapter.id);

      // Simulate MAIA processing
      setTimeout(() => {
        alert('MAIA has revised the chapter based on your feedback! Review the changes.');
        setIsRevising(false);
        setIsEditMode(false);
      }, 2000);
    } catch (error) {
      console.error('Revision failed:', error);
      setIsRevising(false);
    }
  };

  const handleApproveChapter = async () => {
    setIsApproving(true);

    try {
      // In production: await StoryAPI.approveChapter(selectedChapter.id)
      console.log('Approving chapter:', selectedChapter.id);

      setTimeout(() => {
        alert(`"${selectedChapter.title}" has been approved! This chapter is now part of your permanent story.`);
        setIsApproving(false);
        setIsEditMode(false);
      }, 1000);
    } catch (error) {
      console.error('Approval failed:', error);
      setIsApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-stone-100">
      {/* Cosmic dragonfly star field - amber spice dust */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: Math.random() > 0.5 ? '#F5A362' : '#D4AF37',
              width: Math.random() > 0.8 ? '2px' : '1px',
              height: Math.random() > 0.8 ? '2px' : '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)',
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <BookOpen className="w-10 h-10 text-amber-400" style={{ filter: 'drop-shadow(0 0 8px rgba(245, 163, 98, 0.6))' }} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif text-amber-400" style={{
              textShadow: '0 0 20px rgba(245, 163, 98, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)',
            }}>
              {mockStory.title}
            </h1>
          </div>
          <p className="text-stone-300 font-serif italic mb-2">
            Co-authored with MAIA, your Sacred Scribe
          </p>
          <p className="text-stone-400 text-sm italic max-w-xl mx-auto leading-relaxed">
            She listens with archetypal ears. Asks questions informed by the cosmos.
            Weaves your story across time. You lived it. She saw it. Together you author it.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <button
              onClick={() => setView('narrative')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                view === 'narrative'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Narrative View
            </button>
            <button
              onClick={() => setView('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                view === 'timeline'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <History className="w-4 h-4" />
              Timeline View
            </button>
          </div>
        </motion.div>

        {/* Narrative View */}
        {view === 'narrative' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Chapter List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-3"
            >
              <div className="bg-stone-900/30 backdrop-blur-xl border border-amber-900/20 rounded-2xl p-6 shadow-2xl" style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(245, 163, 98, 0.1)',
              }}>
                <h3 className="text-lg font-serif mb-4 text-amber-300" style={{
                  textShadow: '0 0 10px rgba(245, 163, 98, 0.3)',
                }}>Chapters</h3>
                <div className="space-y-2">
                  {mockStory.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapter(chapter)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedChapter.id === chapter.id
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                          : 'text-stone-300 hover:bg-stone-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif">{chapter.title}</span>
                        {chapter.status === 'approved' && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button className="w-full mt-4 px-4 py-3 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Chapter
                </button>
              </div>

              {/* Active Threads */}
              <div className="mt-6 bg-stone-900/30 backdrop-blur-xl border border-purple-900/20 rounded-2xl p-6 shadow-2xl" style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.1)',
              }}>
                <h3 className="text-lg font-serif mb-4 text-purple-300" style={{
                  textShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
                }}>Unfolding Threads</h3>
                <div className="space-y-3">
                  {mockStory.activeThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="p-3 rounded-lg bg-stone-800/40 border border-stone-700/40"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span className="text-sm font-medium text-purple-200">{thread.name}</span>
                      </div>
                      <p className="text-xs text-stone-400">{thread.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Chapter Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12 lg:col-span-9"
            >
              <div className="bg-stone-900/30 backdrop-blur-xl border border-amber-900/20 rounded-2xl p-8 md:p-12 shadow-2xl" style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(245, 163, 98, 0.1)',
              }}>
                {/* Chapter Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-serif text-amber-300 mb-2" style={{
                      textShadow: '0 0 15px rgba(245, 163, 98, 0.4)',
                    }}>
                      {selectedChapter.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-stone-400">
                      <span>Chapter {selectedChapter.chapterNumber}</span>
                      <span>•</span>
                      <span className="capitalize">{selectedChapter.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    {isEditMode ? 'Reading Mode' : 'Edit Mode'}
                  </button>
                </div>

                {/* Chapter Text */}
                <div className="mb-8">
                  <div className="space-y-6">
                    {selectedChapter.currentDraft.split('\n\n').map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-stone-200 font-serif text-lg"
                        style={{
                          lineHeight: '1.8',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          display: 'block',
                          maxWidth: 'none',
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Co-Authorship Interface */}
                {isEditMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-stone-700/40 pt-8"
                  >
                    {/* Previous Member Notes */}
                    {selectedChapter.memberNotes.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-serif text-stone-400 mb-3">Your Previous Feedback:</h4>
                        <div className="space-y-2">
                          {selectedChapter.memberNotes.map((note) => (
                            <div
                              key={note.id}
                              className={`p-3 rounded-lg border ${
                                note.resolved
                                  ? 'bg-green-900/20 border-green-700/40 text-green-200'
                                  : 'bg-purple-900/20 border-purple-700/40 text-purple-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm">{note.text}</p>
                                {note.resolved && (
                                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-stone-500 mt-1">
                                {note.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-serif text-purple-300">
                        Add Your Voice
                      </h3>
                    </div>
                    <p className="text-sm text-stone-400 mb-4">
                      What would you change? What's missing? What moment should MAIA highlight?
                    </p>
                    <textarea
                      value={memberNote}
                      onChange={(e) => setMemberNote(e.target.value)}
                      placeholder="Share your feedback, suggest edits, or add memories that should be woven into the story..."
                      className="w-full px-4 py-3 bg-stone-900/60 border border-stone-700/40 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-purple-500/40 resize-none"
                      rows={4}
                    />
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={handleRequestRevision}
                        disabled={isRevising}
                        className="px-6 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isRevising && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full"
                          />
                        )}
                        {isRevising ? 'MAIA is revising...' : 'Request Revision from MAIA'}
                      </button>
                      <button
                        onClick={handleApproveChapter}
                        disabled={isApproving}
                        className="px-6 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isApproving && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-green-300 border-t-transparent rounded-full"
                          />
                        )}
                        {isApproving ? 'Approving...' : 'Approve This Chapter'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Timeline View */}
        {view === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-md border border-stone-700/40 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-serif text-amber-300 mb-8">Your Journey</h2>
            <div className="space-y-6">
              {mockStory.timeline.map((event, idx) => (
                <div key={event.id} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                    {idx < mockStory.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-stone-700/40 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="text-sm text-stone-400 mb-1">
                      {event.date.toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-serif text-amber-200 mb-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-stone-300 text-sm">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
