'use client';

import { useState, useEffect } from 'react';
import { X, Search, Filter, Calendar, Hash, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  text: string;
  speaker?: 'user' | 'maia';
  element?: 'Earth' | 'Water' | 'Fire' | 'Air' | 'Void';
  tags?: string[];
  created_at: string;
  conversation_id?: string;
}

interface NotebookPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const elementColors = {
  Earth: 'text-green-400 bg-green-400/10',
  Water: 'text-blue-400 bg-blue-400/10',
  Fire: 'text-red-400 bg-red-400/10',
  Air: 'text-yellow-400 bg-yellow-400/10',
  Void: 'text-purple-400 bg-purple-400/10',
};

export function NotebookPanel({ isOpen, onClose }: NotebookPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen]);

  useEffect(() => {
    filterNotes();
  }, [searchTerm, selectedElement, notes]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      if (data.data) {
        setNotes(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = [...notes];

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedElement) {
      filtered = filtered.filter(note => note.element === selectedElement);
    }

    setFilteredNotes(filtered);
  };

  const groupNotesByDate = (notes: Note[]) => {
    const grouped: { [key: string]: Note[] } = {};

    notes.forEach(note => {
      const date = new Date(note.created_at);
      const dateKey = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(note);
    });

    return grouped;
  };

  const groupedNotes = groupNotesByDate(filteredNotes);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-semibold text-white">Your Notebook</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="p-4 space-y-3 border-b border-white/10">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your notes..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* Element Filters */}
                <div className="flex gap-2 flex-wrap">
                  {['Earth', 'Water', 'Fire', 'Air', 'Void'].map(element => (
                    <button
                      key={element}
                      onClick={() => setSelectedElement(
                        selectedElement === element ? null : element
                      )}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-all",
                        selectedElement === element
                          ? elementColors[element as keyof typeof elementColors]
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      )}
                    >
                      {element}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-white/40">Loading notes...</div>
                  </div>
                ) : Object.keys(groupedNotes).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(groupedNotes).map(([date, dateNotes]) => (
                      <div key={date}>
                        {/* Date Header */}
                        <div className="flex items-center gap-2 mb-3 text-white/40 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{date}</span>
                        </div>

                        {/* Notes for this date */}
                        <div className="space-y-3">
                          {dateNotes.map(note => (
                            <motion.div
                              key={note.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                            >
                              {/* Note Header */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {note.speaker && (
                                    <span className={cn(
                                      "text-xs px-2 py-1 rounded",
                                      note.speaker === 'maia'
                                        ? "bg-amber-400/10 text-amber-400"
                                        : "bg-blue-400/10 text-blue-400"
                                    )}>
                                      {note.speaker === 'maia' ? 'Maia' : 'You'}
                                    </span>
                                  )}
                                  {note.element && (
                                    <span className={cn(
                                      "text-xs px-2 py-1 rounded",
                                      elementColors[note.element as keyof typeof elementColors]
                                    )}>
                                      {note.element}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-white/30">
                                  {new Date(note.created_at).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>

                              {/* Note Text */}
                              <p className="text-white/80 text-sm leading-relaxed">
                                {note.text}
                              </p>

                              {/* Tags */}
                              {note.tags && note.tags.length > 0 && (
                                <div className="flex gap-1 mt-3 flex-wrap">
                                  {note.tags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 bg-white/5 text-white/50 rounded flex items-center gap-1"
                                    >
                                      <Hash className="w-3 h-3" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-white/40">
                    <Sparkles className="w-8 h-8 mb-2" />
                    <p>No notes yet</p>
                    <p className="text-sm mt-1">Your insights will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}