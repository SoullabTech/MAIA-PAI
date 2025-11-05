'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, ChevronLeft, Calendar, Sparkles, Moon, Sun, Cloud, Flower, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { HoloflowerJournalViewer } from '@/components/journal/HoloflowerJournalViewer';
import { InteractiveARIAJournal } from '@/components/journal/InteractiveARIAJournal';

interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  mood?: string;
  element?: string;
  holoflowerConfig?: string;
}

// Soul journal prompts
const journalPrompts = [
  "What patterns are emerging in your inner landscape?",
  "How did today's oracle reading resonate with your current journey?",
  "What wisdom is your body holding for you right now?",
  "Where do you feel called to grow or release?",
  "What synchronicities have you noticed recently?",
  "How is your relationship with uncertainty evolving?",
  "What would your higher self say to you today?",
  "What medicine does this moment offer?"
];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'write' | 'holoflower' | 'aria'>('list');
  const router = useRouter();

  useEffect(() => {
    // Load journal entries from localStorage
    const storedEntries = localStorage.getItem('soulJournal');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }

    // Set random prompt
    setSelectedPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
  }, []);

  const saveEntry = async () => {
    if (!content.trim()) return;

    const entry: JournalEntry = {
      id: `entry_${Date.now()}`,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      mood: detectMood(content),
      element: detectElement(content),
      holoflowerConfig: sessionStorage.getItem('lastHoloflowerConfig') || undefined
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('soulJournal', JSON.stringify(updatedEntries));

    // Try to save to backend
    try {
      await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.log('Saved locally');
    }

    setContent('');
    setViewMode('list');
  };

  const detectMood = (text: string): string => {
    const words = text.toLowerCase();
    if (words.includes('grateful') || words.includes('joy') || words.includes('happy')) return 'radiant';
    if (words.includes('anxious') || words.includes('worried') || words.includes('stress')) return 'turbulent';
    if (words.includes('calm') || words.includes('peace') || words.includes('serene')) return 'tranquil';
    return 'neutral';
  };

  const detectElement = (text: string): string => {
    const words = text.toLowerCase();
    if (words.includes('think') || words.includes('idea') || words.includes('mind')) return 'air';
    if (words.includes('feel') || words.includes('emotion') || words.includes('heart')) return 'water';
    if (words.includes('ground') || words.includes('body') || words.includes('physical')) return 'earth';
    if (words.includes('passion') || words.includes('energy') || words.includes('transform')) return 'fire';
    if (words.includes('spirit') || words.includes('soul') || words.includes('divine')) return 'aether';
    return 'aether';
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'radiant': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'turbulent': return <Cloud className="w-4 h-4 text-gray-400" />;
      case 'tranquil': return <Moon className="w-4 h-4 text-blue-400" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const getElementColor = (element?: string) => {
    switch (element) {
      case 'air': return 'text-cyan-400';
      case 'water': return 'text-blue-400';
      case 'earth': return 'text-green-400';
      case 'fire': return 'text-orange-400';
      case 'aether': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1410] relative overflow-hidden">
      {/* Cinematic leather-bound book background with texture */}
      <div className="fixed inset-0">
        {/* Rich leather texture gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1810] via-[#1a1410] to-[#0f0a08]" />

        {/* Subtle leather grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Warm ambient glow from pages */}
        <div className="absolute inset-0 bg-gradient-radial from-amber-950/20 via-transparent to-transparent" />

        {/* Subtle vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Header - Embossed leather spine */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b border-amber-900/30 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(180deg, rgba(45, 24, 16, 0.95) 0%, rgba(26, 20, 16, 0.90) 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.replace('/maia')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <h1 className="text-xl font-light text-white">Soul Journal</h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('aria')}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all ${
                viewMode === 'aria'
                  ? 'bg-amber-500/30 border-amber-400/40 text-amber-300'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/20 text-amber-300'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">ARIA</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'holoflower' ? 'list' : 'holoflower')}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20 text-amber-300 rounded-lg transition-all"
            >
              <Flower className="w-4 h-4" />
              <span className="hidden sm:inline">Holoflower</span>
            </button>
            <button
              onClick={() => setViewMode('write')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          {viewMode === 'aria' ? (
            <motion.div
              key="aria"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InteractiveARIAJournal />
            </motion.div>
          ) : viewMode === 'holoflower' ? (
            <motion.div
              key="holoflower"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-light text-white mb-2 flex items-center gap-3">
                  <Flower className="w-6 h-6 text-amber-400" />
                  Holoflower Journey
                </h3>
                <p className="text-white/70 text-sm">
                  Track your energetic patterns and growth over time through visual snapshots.
                </p>
              </div>
              <HoloflowerJournalViewer entries={entries} />
            </motion.div>
          ) : viewMode === 'write' ? (
            <motion.div
              key="write"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              {/* Leather journal opened to blank page */}
              <div className="flex gap-3">
                {/* Leather binding */}
                <div
                  className="w-4 rounded-l-lg"
                  style={{
                    background: 'linear-gradient(90deg, rgba(45, 24, 16, 0.95) 0%, rgba(26, 20, 16, 0.7) 100%)',
                    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.5)'
                  }}
                />

                {/* Fresh journal page */}
                <div
                  className="flex-1 rounded-r-lg p-8"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 251, 235, 0.98) 0%, rgba(250, 245, 220, 0.99) 50%, rgba(245, 237, 210, 0.98) 100%)',
                    boxShadow: '4px 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {/* Elegant prompt at top of page */}
                  <div className="mb-6 pb-4 border-b-2 border-amber-800/20">
                    <p className="text-amber-800/70 text-xs font-serif uppercase tracking-wider mb-2">Today's Reflection</p>
                    <p className="text-amber-950/80 font-serif italic text-lg leading-relaxed">{selectedPrompt}</p>
                  </div>

                  {/* Writing area with lined paper effect */}
                  <div
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 31px,
                          rgba(139, 92, 46, 0.12) 31px,
                          rgba(139, 92, 46, 0.12) 32px
                        )
                      `
                    }}
                  >
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          saveEntry();
                        }
                      }}
                      placeholder="Let your thoughts flow onto the page..."
                      className="w-full h-96 p-0 bg-transparent border-none text-amber-950/90 placeholder-amber-900/30 resize-none focus:outline-none font-serif text-base leading-8"
                      style={{ lineHeight: '32px' }}
                      autoFocus
                    />
                  </div>

                  {/* Actions at bottom of page */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-amber-800/15">
                    <button
                      onClick={() => setViewMode('list')}
                      className="px-4 py-2 text-amber-900/50 hover:text-amber-900/70 font-serif transition-colors"
                    >
                      Close
                    </button>

                    <button
                      onClick={saveEntry}
                      disabled={!content.trim()}
                      className="px-6 py-2.5 bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 disabled:from-amber-900/30 disabled:to-amber-900/30 disabled:cursor-not-allowed text-amber-50 rounded font-serif transition-all flex items-center gap-2 shadow-lg"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Seal Entry
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {entries.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-20"
                >
                  {/* Classic leather-bound journal closed state */}
                  <div className="max-w-2xl mx-auto">
                    <div
                      className="relative p-12 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(45, 24, 16, 0.8) 0%, rgba(26, 20, 16, 0.9) 100%)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      {/* Gold embossed title */}
                      <div className="text-center mb-8">
                        <BookOpen className="w-20 h-20 text-amber-500/80 mx-auto mb-6" style={{ filter: 'drop-shadow(0 2px 8px rgba(217, 119, 6, 0.3))' }} />
                        <h2 className="text-3xl font-serif text-amber-200/90 mb-2" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                          Soul Journal
                        </h2>
                        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-700/50 to-transparent mb-4" />
                        <p className="text-amber-300/70 text-lg font-serif italic">Your soul journal awaits</p>
                      </div>

                      {/* Aged paper texture with writing invitation */}
                      <div
                        className="p-8 rounded"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255, 251, 235, 0.95) 0%, rgba(250, 245, 220, 0.98) 100%)',
                          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <p className="text-amber-950/80 text-center font-serif text-lg leading-relaxed">
                          Begin capturing your inner journey.<br />
                          Let the pages remember what your soul whispers.
                        </p>
                      </div>

                      {/* Ornamental corner decorations */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-amber-700/30" />
                      <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-amber-700/30" />
                      <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-amber-700/30" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-amber-700/30" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative max-w-3xl mx-auto"
                  >
                    {/* Aged paper page with leather binding edge */}
                    <div className="flex gap-3">
                      {/* Leather binding edge simulation */}
                      <div
                        className="w-4 rounded-l-lg"
                        style={{
                          background: 'linear-gradient(90deg, rgba(45, 24, 16, 0.95) 0%, rgba(26, 20, 16, 0.7) 100%)',
                          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.5)'
                        }}
                      />

                      {/* Journal page */}
                      <div
                        className="flex-1 rounded-r-lg p-6 hover:shadow-2xl transition-all duration-300"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255, 251, 235, 0.97) 0%, rgba(250, 245, 220, 0.98) 50%, rgba(245, 237, 210, 0.97) 100%)',
                          boxShadow: '4px 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                          backgroundImage: `
                            repeating-linear-gradient(
                              0deg,
                              transparent,
                              transparent 31px,
                              rgba(139, 92, 46, 0.08) 31px,
                              rgba(139, 92, 46, 0.08) 32px
                            )
                          `
                        }}
                      >
                        {/* Entry header with decorative elements */}
                        <div className="flex items-start justify-between mb-4 pb-3 border-b border-amber-800/20">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-amber-100/50 rounded-full">
                              {getMoodIcon(entry.mood)}
                            </div>
                            <span className={`text-sm font-serif ${getElementColor(entry.element)} opacity-70`}>
                              {entry.element}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-amber-900/60 font-serif">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(entry.timestamp).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        {/* Entry content - handwritten style */}
                        <div className="relative">
                          <p className="text-amber-950/90 leading-relaxed whitespace-pre-wrap font-serif text-base" style={{ lineHeight: '32px' }}>
                            {entry.content}
                          </p>
                        </div>

                        {/* Holoflower connection */}
                        {entry.holoflowerConfig && (
                          <div className="mt-4 pt-3 border-t border-amber-800/15">
                            <div className="flex items-center gap-2">
                              <Flower className="w-3.5 h-3.5 text-amber-700/60" />
                              <span className="text-xs text-amber-900/50 font-serif italic">
                                Holoflower snapshot preserved
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Subtle page curl effect */}
                        <div
                          className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-3xl"
                          style={{
                            background: 'linear-gradient(135deg, transparent 0%, rgba(139, 92, 46, 0.08) 100%)',
                            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating prompt button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
          setViewMode('write');
        }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-amber-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>
    </div>
  );
}