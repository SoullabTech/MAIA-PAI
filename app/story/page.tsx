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
import { BookOpen, Edit3, History, Sparkles, Plus, CheckCircle, MessageCircle, HelpCircle } from 'lucide-react';
// import { StoryAPI } from '@/lib/story/storyAPI'; // Commented out - not used in mock version

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

  // Guided tour state
  const [showGuidedTour, setShowGuidedTour] = useState(false);

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
    <div className="min-h-screen text-stone-900" style={{
      background: 'linear-gradient(to bottom, #2C3640 0%, #3E4A54 15%, #5A4A3A 35%, #8B6F47 55%, #B8935C 70%, #D4AF37 85%, #FFB84D 100%)',
    }}>
      {/* Sandworm Oracle atmosphere - night to blazing horizon */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Film grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }} />

        {/* Atmospheric depth layers - night sky to desert */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 5%, rgba(44, 54, 64, 0.4), transparent 50%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 85%, rgba(255, 184, 77, 0.3), transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 100%, rgba(212, 175, 55, 0.2), transparent 60%)',
        }} />

        {/* Stars in night sky (top 30% only) */}
        {[...Array(120)].map((_, i) => {
          const top = Math.random() * 30; // Only top 30% for night sky
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full"
              style={{
                background: '#E8DCC4',
                width: Math.random() > 0.8 ? '2px' : '1px',
                height: Math.random() > 0.8 ? '2px' : '1px',
                left: `${Math.random() * 100}%`,
                top: `${top}%`,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 2px rgba(232, 220, 196, 0.5)',
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Sandworm silhouette - watching from the deep desert */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[40%] overflow-hidden">
          <motion.div
            className="absolute"
            style={{
              bottom: '-10%',
              left: '30%',
              width: '500px',
              height: '300px',
              background: 'radial-gradient(ellipse at center, rgba(107, 68, 35, 0.15), transparent 70%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              transform: 'rotate(-5deg)',
              filter: 'blur(8px)',
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Floating sand particles (bottom 60% - desert zone) */}
        {[...Array(80)].map((_, i) => {
          const top = 40 + Math.random() * 60; // Bottom 60% only
          return (
            <motion.div
              key={`sand-${i}`}
              className="absolute rounded-full"
              style={{
                background: Math.random() > 0.6 ? '#D4AF37' : '#FFB84D',
                width: Math.random() > 0.7 ? '3px' : '2px',
                height: Math.random() > 0.7 ? '3px' : '2px',
                left: `${Math.random() * 100}%`,
                top: `${top}%`,
                filter: 'blur(1px)',
                opacity: 0.3,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 3, 0, -3, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <BookOpen className="w-10 h-10" style={{
                color: '#8B6F47',
                filter: 'drop-shadow(0 2px 4px rgba(107, 68, 35, 0.3))',
              }} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif" style={{
              color: '#6B4423',
              textShadow: '0 2px 8px rgba(107, 68, 35, 0.2)',
              fontWeight: 500,
            }}>
              {mockStory.title}
            </h1>
          </div>
          <p className="font-serif italic mb-2" style={{ color: '#5A4A3A' }}>
            Co-authored with MAIA, your Sacred Scribe
          </p>
          <p className="text-sm italic max-w-xl mx-auto leading-relaxed" style={{ color: '#6B5A4A' }}>
            She listens with archetypal ears. Asks questions informed by the cosmos.
            Weaves your story across time. You lived it. She saw it. Together you author it.
          </p>

          {/* Help Icon - Guided Tour */}
          <button
            onClick={() => setShowGuidedTour(true)}
            className="mt-4 mx-auto flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#6B4423',
            }}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-serif">How does this work?</span>
          </button>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <button
              onClick={() => setView('narrative')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={view === 'narrative' ? {
                background: 'rgba(184, 147, 92, 0.3)',
                border: '1px solid rgba(139, 111, 71, 0.4)',
                color: '#6B4423',
              } : {
                color: '#8B7355',
                background: 'rgba(255, 248, 240, 0.3)',
              }}
            >
              <BookOpen className="w-4 h-4" />
              Narrative View
            </button>
            <button
              onClick={() => setView('timeline')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={view === 'timeline' ? {
                background: 'rgba(184, 147, 92, 0.3)',
                border: '1px solid rgba(139, 111, 71, 0.4)',
                color: '#6B4423',
              } : {
                color: '#8B7355',
                background: 'rgba(255, 248, 240, 0.3)',
              }}
            >
              <History className="w-4 h-4" />
              Timeline View
            </button>
          </div>
        </motion.div>

        {/* Narrative View */}
        {view === 'narrative' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chapter List - Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-72 flex-shrink-0"
            >
              <div className="backdrop-blur-md border rounded-2xl p-6 shadow-lg" style={{
                background: 'rgba(255, 248, 240, 0.8)',
                borderColor: '#C9A86A',
                boxShadow: '0 4px 20px rgba(107, 68, 35, 0.15), 0 8px 40px rgba(139, 111, 71, 0.1)',
              }}>
                <h3 className="text-lg font-serif mb-4" style={{
                  color: '#6B4423',
                  textShadow: '0 1px 2px rgba(107, 68, 35, 0.2)',
                }}>Chapters</h3>
                <div className="space-y-2">
                  {mockStory.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapter(chapter)}
                      className="w-full text-left px-4 py-3 rounded-lg transition-all"
                      style={selectedChapter.id === chapter.id ? {
                        background: 'rgba(184, 147, 92, 0.25)',
                        border: '1px solid rgba(139, 111, 71, 0.5)',
                        color: '#6B4423',
                      } : {
                        color: '#8B7355',
                        background: 'rgba(201, 168, 106, 0.1)',
                      }}
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

                <button className="w-full mt-4 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2" style={{
                  background: 'rgba(168, 181, 160, 0.2)',
                  border: '1px solid rgba(168, 181, 160, 0.4)',
                  color: '#5A4A3A',
                }}>
                  <Plus className="w-4 h-4" />
                  New Chapter
                </button>
              </div>

              {/* Active Threads */}
              <div className="mt-6 backdrop-blur-md border rounded-2xl p-6 shadow-lg" style={{
                background: 'rgba(255, 248, 240, 0.8)',
                borderColor: '#A8B5A0',
                boxShadow: '0 4px 20px rgba(107, 68, 35, 0.15), 0 8px 40px rgba(168, 181, 160, 0.1)',
              }}>
                <h3 className="text-lg font-serif mb-4" style={{
                  color: '#5A4A3A',
                  textShadow: '0 1px 2px rgba(90, 74, 58, 0.2)',
                }}>Unfolding Threads</h3>
                <div className="space-y-3">
                  {mockStory.activeThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="p-3 rounded-lg border"
                      style={{
                        background: 'rgba(59, 130, 246, 0.08)',
                        borderColor: 'rgba(59, 130, 246, 0.25)',
                        boxShadow: '0 0 12px rgba(59, 130, 246, 0.15)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3" style={{
                          color: '#3B82F6',
                          filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))',
                        }} />
                        <span className="text-sm font-medium" style={{
                          color: '#1E40AF',
                          textShadow: '0 0 8px rgba(59, 130, 246, 0.3)',
                        }}>{thread.name}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#5A4A3A' }}>{thread.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Chapter Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12"
            >
              <div className="backdrop-blur-md border rounded-2xl p-8 md:p-12 shadow-xl" style={{
                background: 'rgba(255, 248, 240, 0.85)',
                borderColor: '#C9A86A',
                boxShadow: '0 6px 30px rgba(107, 68, 35, 0.2), 0 12px 50px rgba(139, 111, 71, 0.15)',
              }}>
                {/* Chapter Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-serif mb-2" style={{
                      color: '#6B4423',
                      textShadow: '0 2px 6px rgba(107, 68, 35, 0.2)',
                      fontWeight: 500,
                    }}>
                      {selectedChapter.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm" style={{ color: '#8B7355' }}>
                      <span>Chapter {selectedChapter.chapterNumber}</span>
                      <span>•</span>
                      <span className="capitalize">{selectedChapter.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                    style={{
                      background: 'rgba(184, 147, 92, 0.2)',
                      border: '1px solid rgba(139, 111, 71, 0.4)',
                      color: '#6B4423',
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                    {isEditMode ? 'Reading Mode' : 'Edit Mode'}
                  </button>
                </div>

                {/* Chapter Text - Sacred Inscription */}
                <div className="mb-8">
                  <div className="space-y-6">
                    {selectedChapter.currentDraft.split('\n\n').map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="font-serif text-lg"
                        style={{
                          color: '#2C1810',
                          lineHeight: '1.9',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          display: 'block',
                          maxWidth: 'none',
                          textShadow: '0 1px 2px rgba(212, 175, 55, 0.15)',
                          letterSpacing: '0.01em',
                          fontWeight: 400,
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

      {/* Guided Tour Modal */}
      <AnimatePresence>
        {showGuidedTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setShowGuidedTour(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-2xl w-full rounded-2xl border p-8 max-h-[90vh] overflow-y-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 248, 240, 0.98) 0%, rgba(245, 235, 220, 0.98) 100%)',
                borderColor: 'rgba(139, 111, 71, 0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212, 175, 55, 0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#8B6F47' }} />
                <h2 className="text-3xl font-serif mb-2" style={{ color: '#6B4423' }}>
                  Sacred Scribe
                </h2>
                <p className="text-sm italic" style={{ color: '#8B7355' }}>
                  Co-authoring your living mythology with MAIA
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="space-y-6 text-left">
                {/* What is this? */}
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: '#6B4423' }}>
                    📖 What is Sacred Scribe?
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5A4A3A' }}>
                    This is your <strong>living mythology</strong> - an evolving narrative that grows as you grow.
                    Not a static reading, but a co-authored story where MAIA (your Sacred Scribe) helps you
                    weave your experiences into a coherent, archetypal journey.
                  </p>
                </div>

                {/* The Process */}
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-3" style={{ color: '#6B4423' }}>
                    ✨ How it Works
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(184, 147, 92, 0.2)', color: '#6B4423' }}>
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#6B4423' }}>MAIA Listens</p>
                        <p className="text-xs" style={{ color: '#8B7355' }}>
                          In your conversations, MAIA tracks patterns, themes, and threads across time
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(184, 147, 92, 0.2)', color: '#6B4423' }}>
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#6B4423' }}>MAIA Drafts</p>
                        <p className="text-xs" style={{ color: '#8B7355' }}>
                          She synthesizes your journey into poetic chapters, informed by archetypal wisdom
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(184, 147, 92, 0.2)', color: '#6B4423' }}>
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#6B4423' }}>You Refine</p>
                        <p className="text-xs" style={{ color: '#8B7355' }}>
                          Add notes, request revisions, approve chapters - you're the final author
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(184, 147, 92, 0.2)', color: '#6B4423' }}>
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#6B4423' }}>Story Evolves</p>
                        <p className="text-xs" style={{ color: '#8B7355' }}>
                          Your mythology grows chapter by chapter, documenting your transformation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapters */}
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: '#6B4423' }}>
                    📚 Chapters
                  </h3>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: '#5A4A3A' }}>
                    Your story unfolds in chapters. Click any chapter to read, add notes, or request revisions.
                  </p>
                  <ul className="text-xs space-y-1 ml-4" style={{ color: '#8B7355' }}>
                    <li>• <strong style={{ color: '#6B4423' }}>Genesis:</strong> Generated from your birth chart (auto-approved)</li>
                    <li>• <strong style={{ color: '#6B4423' }}>Future Chapters:</strong> Co-written based on your MAIA conversations</li>
                  </ul>
                </div>

                {/* Unfolding Threads */}
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: '#6B4423' }}>
                    🧵 Unfolding Threads
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5A4A3A' }}>
                    These are <strong>patterns MAIA tracks across time</strong>. When she notices recurring themes
                    in your conversations (like "finding your voice" or "healing relationship wounds"),
                    she creates a thread. These threads become the fabric of your story.
                  </p>
                </div>

                {/* Views */}
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: '#6B4423' }}>
                    👁️ Two Views
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#6B4423' }}>
                        📖 Narrative View (Current)
                      </p>
                      <p className="text-xs" style={{ color: '#8B7355' }}>
                        Read your chapters, add feedback, approve revisions - the co-authorship space
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#6B4423' }}>
                        📅 Timeline View
                      </p>
                      <p className="text-xs" style={{ color: '#8B7355' }}>
                        See your journey chronologically - when chapters were created, major events, pattern emergence
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Mode */}
                <div>
                  <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: '#6B4423' }}>
                    ✏️ Edit Mode
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5A4A3A' }}>
                    Click "Edit Mode" to add your feedback. MAIA will incorporate your notes into the next revision.
                    You can request multiple revisions until the chapter resonates perfectly.
                  </p>
                </div>

                {/* Next Steps */}
                <div className="pt-4 border-t" style={{ borderColor: 'rgba(139, 111, 71, 0.2)' }}>
                  <h3 className="text-lg font-serif font-semibold mb-2" style={{ color: '#6B4423' }}>
                    🎯 Ready to Begin?
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#5A4A3A' }}>
                    Start by having conversations with MAIA. She'll listen, track patterns, and draft your next chapter
                    when she senses enough material has emerged.
                  </p>
                  <a
                    href="/maia"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-serif tracking-wide transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Continue with MAIA</span>
                  </a>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowGuidedTour(false)}
                className="mt-6 w-full px-6 py-3 rounded-lg text-sm font-serif tracking-wide transition-all"
                style={{
                  background: 'rgba(139, 111, 71, 0.1)',
                  border: '1px solid rgba(139, 111, 71, 0.3)',
                  color: '#6B4423',
                }}
              >
                Got it, thanks!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
