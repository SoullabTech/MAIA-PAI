'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Library, Book, FileText, Search, Sparkles, User, Calendar, Tag, ChevronRight } from 'lucide-react';

/**
 * Library of Alexandria - User View
 *
 * Sacred knowledge vault with cinematic aesthetic
 */

interface Document {
  id: string;
  title: string;
  category: string;
  author?: string;
  topics: string[];
  createdAt: string;
  excerpt?: string;
}

const categories = [
  { value: 'all', label: 'All Wisdom', emoji: '✨', gradient: 'from-amber-700 to-amber-800' },
  { value: 'spiralogic', label: 'Spiralogic', emoji: '🌀', gradient: 'from-purple-700 to-indigo-800' },
  { value: 'sacred_witness', label: 'Sacred Witness', emoji: '👁️', gradient: 'from-blue-700 to-cyan-800' },
  { value: 'elemental_alchemy', label: 'Elemental Alchemy', emoji: '🔥', gradient: 'from-orange-700 to-red-800' },
  { value: 'ain_conversations', label: 'AIN Conversations', emoji: '🤖', gradient: 'from-emerald-700 to-teal-800' },
  { value: 'jung', label: 'Jung / Depth Psychology', emoji: '🌑', gradient: 'from-slate-700 to-gray-800' },
  { value: 'buddhism', label: 'Buddhist Teachings', emoji: '☸️', gradient: 'from-yellow-700 to-amber-800' },
  { value: 'integral', label: 'Integral Theory', emoji: '🔶', gradient: 'from-violet-700 to-purple-800' },
  { value: 'somatic', label: 'Somatic Practices', emoji: '🧘', gradient: 'from-green-700 to-emerald-800' },
  { value: 'shadow_work', label: 'Shadow Work', emoji: '🌓', gradient: 'from-indigo-700 to-purple-800' },
];

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch documents from API
    // For now, showing empty state
    setIsLoading(false);
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#1a1410] relative overflow-hidden">
      {/* Ancient library background */}
      <div className="fixed inset-0">
        {/* Deep mahogany wood texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1810] via-[#1a1410] to-[#0f0a08]" />

        {/* Subtle wood grain texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }}
        />

        {/* Warm candlelight glow */}
        <div className="absolute inset-0 bg-gradient-radial from-amber-950/20 via-transparent to-transparent" />

        {/* Vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      </div>

      {/* Header - Ornate library entrance */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b border-amber-900/30 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(180deg, rgba(45, 24, 16, 0.95) 0%, rgba(26, 20, 16, 0.90) 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Library className="w-8 h-8 text-amber-500/90" style={{ filter: 'drop-shadow(0 2px 8px rgba(217, 119, 6, 0.3))' }} />
            <div>
              <h1 className="text-3xl font-serif text-amber-200/90" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Library of Alexandria
              </h1>
              <p className="text-amber-300/60 text-sm font-serif italic">Your sacred knowledge vault</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Search Bar - Ancient scroll aesthetic */}
          <div className="mb-6">
            <div
              className="relative rounded-lg p-4"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 251, 235, 0.95) 0%, rgba(250, 245, 220, 0.98) 100%)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-900/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the archives..."
                  className="flex-1 bg-transparent border-none text-amber-950/90 placeholder-amber-900/30 focus:outline-none font-serif"
                />
              </div>
            </div>
          </div>

          {/* Category Filters - Ornate shelf labels */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-serif text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-br text-amber-50 shadow-lg'
                    : 'bg-amber-900/20 text-amber-300/80 hover:bg-amber-900/30'
                }`}
                style={selectedCategory === cat.value ? {
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                } : {}}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Documents Display */}
        {isLoading ? (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 text-amber-500/50 mx-auto mb-4 animate-pulse" />
            <p className="text-amber-300/60 font-serif">Loading ancient texts...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-20"
          >
            {/* Empty State - Closed ancient tome */}
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
                  <Library className="w-20 h-20 text-amber-500/80 mx-auto mb-6" style={{ filter: 'drop-shadow(0 2px 8px rgba(217, 119, 6, 0.3))' }} />
                  <h2 className="text-3xl font-serif text-amber-200/90 mb-2" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    The Library Awaits
                  </h2>
                  <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-amber-700/50 to-transparent mb-4" />
                  <p className="text-amber-300/70 text-lg font-serif italic">Your sacred knowledge collection</p>
                </div>

                {/* Aged parchment with invitation */}
                <div
                  className="p-8 rounded"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 251, 235, 0.95) 0%, rgba(250, 245, 220, 0.98) 100%)',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <p className="text-amber-950/80 text-center font-serif text-lg leading-relaxed mb-6">
                    This sacred library is empty.<br />
                    Begin your collection of wisdom and knowledge.
                  </p>

                  <div className="text-center">
                    <a
                      href="/admin/library"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-amber-700 to-amber-800 text-amber-50 rounded font-serif shadow-lg hover:shadow-xl transition-all"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Upload Sacred Texts
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
              >
                {/* Book spine aesthetic */}
                <div className="flex gap-2">
                  {/* Leather binding */}
                  <div
                    className="w-3 rounded-l-lg"
                    style={{
                      background: 'linear-gradient(90deg, rgba(45, 24, 16, 0.95) 0%, rgba(26, 20, 16, 0.7) 100%)',
                      boxShadow: '2px 0 6px rgba(0, 0, 0, 0.4)'
                    }}
                  />

                  {/* Document card */}
                  <div
                    className="flex-1 rounded-r-lg p-5 hover:shadow-2xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255, 251, 235, 0.97) 0%, rgba(250, 245, 220, 0.98) 50%, rgba(245, 237, 210, 0.97) 100%)',
                      boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {/* Category badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{categories.find(c => c.value === doc.category)?.emoji}</span>
                      <span className="text-xs font-serif text-amber-900/60 uppercase tracking-wider">
                        {categories.find(c => c.value === doc.category)?.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-serif text-amber-950/90 mb-2 line-clamp-2 group-hover:text-amber-900 transition-colors">
                      {doc.title}
                    </h3>

                    {/* Excerpt */}
                    {doc.excerpt && (
                      <p className="text-sm font-serif text-amber-900/70 mb-3 line-clamp-2 leading-relaxed">
                        {doc.excerpt}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-amber-900/50 font-serif pt-3 border-t border-amber-800/15">
                      {doc.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{doc.author}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Topics */}
                    {doc.topics.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {doc.topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-amber-800/10 text-amber-900/60 rounded text-xs font-serif"
                          >
                            {topic}
                          </span>
                        ))}
                        {doc.topics.length > 3 && (
                          <span className="text-xs text-amber-900/40 font-serif">
                            +{doc.topics.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
