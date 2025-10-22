'use client';

import React, { useState, useEffect } from 'react';
import { Download, BookOpen, Search, Filter, Calendar, MessageCircle, Sparkles, Loader2, Share2, FileText, FileDown } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { extractConversationEssence } from '@/lib/services/conversationEssenceExtractor';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string | Date;
}

interface ConversationEssence {
  title: string;
  coreInsight: string;
  spiralMovement?: string;
  breakthroughMoment?: string;
  elementalSignature?: {
    fire?: number;
    water?: number;
    earth?: number;
    air?: number;
  };
  synthesizedEntry?: string;
}

interface Conversation {
  id: string;
  agent: string;
  timestamp: string | Date;
  messages: Message[];
  essence?: ConversationEssence;
  element?: string;
  type: 'current' | 'journal' | 'memory';
  extracting?: boolean;
  error?: string;
}

// ============================================
// Main Component
// ============================================

export default function EnhancedConversationReview() {
  const supabase = createClientComponentClient();

  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterElement, setFilterElement] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Filter conversations when search/filter changes
  useEffect(() => {
    filterConversations();
  }, [searchQuery, filterElement, conversations]);

  // ============================================
  // Data Loading
  // ============================================

  const loadConversations = async () => {
    setLoading(true);
    try {
      // 1. Load from localStorage (current session)
      const localConvos = loadFromLocalStorage();

      // 2. Load from Supabase journal_entries
      const { data: journalEntries } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // 3. Load from Supabase memories
      const { data: memories } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Combine and transform
      const allConvos = [
        ...localConvos,
        ...transformJournalEntries(journalEntries || []),
        ...transformMemories(memories || [])
      ];

      // Deduplicate by ID and sort
      const unique = Array.from(
        new Map(allConvos.map(c => [c.id, c])).values()
      ).sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setConversations(unique);

    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = (): Conversation[] => {
    try {
      const mayaConvo = localStorage.getItem('maya_conversation');
      const oracleConvos = localStorage.getItem('oracle_conversations');

      const conversations: Conversation[] = [];

      if (mayaConvo) {
        const parsed = JSON.parse(mayaConvo);
        conversations.push({
          id: 'current-maya',
          agent: 'Maya',
          timestamp: new Date().toISOString(),
          messages: parsed,
          type: 'current'
        });
      }

      if (oracleConvos) {
        const parsed = JSON.parse(oracleConvos);
        if (Array.isArray(parsed)) {
          parsed.forEach((convo, idx) => {
            conversations.push({
              id: `current-oracle-${idx}`,
              agent: 'Oracle',
              timestamp: convo.timestamp || new Date().toISOString(),
              messages: convo.messages || [],
              type: 'current'
            });
          });
        }
      }

      return conversations;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  };

  const transformJournalEntries = (entries: any[]): Conversation[] => {
    return entries.map(entry => ({
      id: entry.id,
      agent: entry.oracle_agent_id || 'Maya',
      timestamp: entry.created_at,
      messages: typeof entry.content === 'string'
        ? JSON.parse(entry.content)
        : entry.content || [],
      essence: entry.metadata?.essence || {
        title: entry.title,
        coreInsight: entry.content?.substring(0, 200) + '...',
        spiralMovement: entry.metadata?.elemental?.join(', '),
        elementalSignature: entry.metadata?.elemental_signature
      },
      element: entry.metadata?.elemental?.[0],
      type: 'journal'
    }));
  };

  const transformMemories = (memories: any[]): Conversation[] => {
    return memories.map(memory => ({
      id: memory.id,
      agent: 'Oracle',
      timestamp: memory.created_at,
      messages: [{
        role: 'assistant',
        content: memory.content,
        timestamp: memory.created_at
      }],
      element: memory.emotional_tone,
      type: 'memory'
    }));
  };

  // ============================================
  // Filtering & Search
  // ============================================

  const filterConversations = () => {
    let filtered = [...conversations];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(convo => {
        const inAgent = convo.agent.toLowerCase().includes(query);
        const inEssence = convo.essence?.title?.toLowerCase().includes(query) ||
                         convo.essence?.coreInsight?.toLowerCase().includes(query);
        const inMessages = convo.messages.some(msg =>
          msg.content.toLowerCase().includes(query)
        );
        return inAgent || inEssence || inMessages;
      });
    }

    // Element filter
    if (filterElement !== 'all') {
      filtered = filtered.filter(convo =>
        convo.element?.toLowerCase() === filterElement.toLowerCase()
      );
    }

    setFilteredConversations(filtered);
  };

  // ============================================
  // Essence Extraction
  // ============================================

  const extractEssence = async (conversation: Conversation) => {
    setSelectedConversation({
      ...conversation,
      extracting: true
    });

    try {
      // Check if already cached in Supabase
      const { data: cached } = await supabase
        .from('journal_entries')
        .select('metadata')
        .eq('id', conversation.id)
        .single();

      if (cached?.metadata?.essence) {
        setSelectedConversation({
          ...conversation,
          essence: cached.metadata.essence,
          extracting: false
        });
        return;
      }

      // Extract new essence using your existing service
      const essence = await extractConversationEssence(
        conversation.messages,
        conversation.agent
      );

      // Save to Supabase if not current session
      if (conversation.type !== 'current') {
        const { error } = await supabase
          .from('journal_entries')
          .upsert({
            id: conversation.id,
            content: JSON.stringify(conversation.messages),
            metadata: {
              essence,
              elemental: [conversation.element],
              elemental_signature: essence.elementalSignature
            },
            entry_type: 'reflection',
            created_at: conversation.timestamp
          });

        if (error) throw error;
      }

      // Update state
      setSelectedConversation({
        ...conversation,
        essence,
        extracting: false
      });

      // Refresh conversations list
      await loadConversations();

    } catch (error) {
      console.error('Essence extraction failed:', error);
      setSelectedConversation({
        ...conversation,
        extracting: false,
        error: 'Failed to extract essence. Please try again.'
      });
    }
  };

  // ============================================
  // Export & Download
  // ============================================

  const generateMarkdown = (conversation: Conversation): string => {
    const date = new Date(conversation.timestamp).toLocaleString();
    let md = `# 🌸 Conversation with ${conversation.agent}\n\n`;

    // Metadata
    md += `**Date**: ${date}\n`;
    md += `**Messages**: ${conversation.messages.length}\n`;
    md += `**Session ID**: ${conversation.id}\n`;

    if (conversation.element) {
      md += `**Element**: ${conversation.element}\n`;
    }

    md += '\n---\n\n';

    // Essence (if extracted)
    if (conversation.essence) {
      md += `## ✨ Essence\n\n`;
      md += `### ${conversation.essence.title}\n\n`;
      md += `> ${conversation.essence.coreInsight}\n\n`;

      if (conversation.essence.breakthroughMoment) {
        md += `**Breakthrough**: ${conversation.essence.breakthroughMoment}\n\n`;
      }

      if (conversation.essence.spiralMovement) {
        md += `**Spiral Movement**: ${conversation.essence.spiralMovement}\n\n`;
      }

      if (conversation.essence.elementalSignature) {
        md += `**Elemental Signature**:\n`;
        Object.entries(conversation.essence.elementalSignature).forEach(([element, value]) => {
          md += `- ${element.charAt(0).toUpperCase() + element.slice(1)}: ${value}%\n`;
        });
        md += '\n';
      }

      md += '---\n\n';
    }

    // Full Transcript
    md += `## 📝 Full Transcript\n\n`;

    conversation.messages.forEach((msg, idx) => {
      const role = msg.role === 'user' ? 'You' : conversation.agent;
      const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString()
        : '';

      md += `### ${role}`;
      if (time) md += ` _(${time})_`;
      md += '\n\n';
      md += `${msg.content}\n\n`;
    });

    // Footer
    md += '\n---\n\n';
    md += `_Generated by MAIA - ${new Date().toLocaleDateString()}_\n`;
    md += `_Sacred conversation preserved for reflection_\n`;

    return md;
  };

  const downloadTranscript = (conversation: Conversation) => {
    const markdown = generateMarkdown(conversation);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversation.agent}-${new Date(conversation.timestamp).toLocaleDateString()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareConversation = async (conversation: Conversation) => {
    const markdown = generateMarkdown(conversation);

    if (navigator.share) {
      try {
        await navigator.share({
          title: conversation.essence?.title || `Conversation with ${conversation.agent}`,
          text: conversation.essence?.coreInsight || 'MAIA Conversation',
          files: [new File([markdown], 'conversation.md', { type: 'text/markdown' })]
        });
      } catch (error) {
        // User cancelled or error - fall back to clipboard
        await copyToClipboard(markdown);
      }
    } else {
      await copyToClipboard(markdown);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Conversation copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // ============================================
  // Render
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 font-cinzel">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Conversation Review
              </h1>
              <p className="text-sm text-purple-600 mt-1">
                {conversations.length} conversations • {filteredConversations.length} showing
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Element Filter */}
              <select
                value={filterElement}
                onChange={(e) => setFilterElement(e.target.value)}
                className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Elements</option>
                <option value="fire">🔥 Fire</option>
                <option value="water">💧 Water</option>
                <option value="earth">🌍 Earth</option>
                <option value="air">💨 Air</option>
                <option value="aether">✨ Aether</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <p className="text-purple-600 text-lg">No conversations found</p>
            <p className="text-purple-400 text-sm mt-2">
              {searchQuery || filterElement !== 'all'
                ? 'Try adjusting your filters'
                : 'Start a conversation with Maya to see it here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onSelect={() => setSelectedConversation(conversation)}
                onExtract={() => extractEssence(conversation)}
                onDownload={() => downloadTranscript(conversation)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedConversation && (
          <ConversationModal
            conversation={selectedConversation}
            onClose={() => setSelectedConversation(null)}
            onExtract={() => extractEssence(selectedConversation)}
            onDownload={() => downloadTranscript(selectedConversation)}
            onShare={() => shareConversation(selectedConversation)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Conversation Card Component
// ============================================

function ConversationCard({
  conversation,
  onSelect,
  onExtract,
  onDownload
}: {
  conversation: Conversation;
  onSelect: () => void;
  onExtract: () => void;
  onDownload: () => void;
}) {
  const elementColors = {
    fire: 'from-red-100 to-orange-100 border-red-300',
    water: 'from-blue-100 to-cyan-100 border-blue-300',
    earth: 'from-green-100 to-emerald-100 border-green-300',
    air: 'from-purple-100 to-violet-100 border-purple-300',
    aether: 'from-pink-100 to-purple-100 border-pink-300'
  };

  const bgClass = conversation.element
    ? elementColors[conversation.element as keyof typeof elementColors]
    : 'from-gray-100 to-slate-100 border-gray-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${bgClass} border rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{conversation.agent}</h3>
          <p className="text-xs text-gray-600 mt-1">
            {new Date(conversation.timestamp).toLocaleDateString()}
          </p>
        </div>
        {conversation.element && (
          <span className="text-2xl">
            {conversation.element === 'fire' && '🔥'}
            {conversation.element === 'water' && '💧'}
            {conversation.element === 'earth' && '🌍'}
            {conversation.element === 'air' && '💨'}
            {conversation.element === 'aether' && '✨'}
          </span>
        )}
      </div>

      {/* Essence or Preview */}
      {conversation.essence ? (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            {conversation.essence.title}
          </h4>
          <p className="text-xs text-gray-700 line-clamp-3">
            {conversation.essence.coreInsight}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {conversation.messages[0]?.content || 'No content'}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          className="flex-1 px-3 py-2 bg-white/80 hover:bg-white border border-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
        >
          <Download className="w-3 h-3" />
          Download
        </button>
        {!conversation.essence && (
          <button
            onClick={(e) => { e.stopPropagation(); onExtract(); }}
            className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Extract
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-gray-300/50 flex items-center justify-between text-xs text-gray-600">
        <span>{conversation.messages.length} messages</span>
        <span className="capitalize">{conversation.type}</span>
      </div>
    </motion.div>
  );
}

// ============================================
// Conversation Modal Component
// ============================================

function ConversationModal({
  conversation,
  onClose,
  onExtract,
  onDownload,
  onShare
}: {
  conversation: Conversation;
  onClose: () => void;
  onExtract: () => void;
  onDownload: () => void;
  onShare: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{conversation.agent}</h2>
              <p className="text-sm text-white/80 mt-1">
                {new Date(conversation.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {/* Essence */}
          {conversation.essence && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {conversation.essence.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {conversation.essence.coreInsight}
              </p>
              {conversation.essence.breakthroughMoment && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Breakthrough:</p>
                  <p className="text-sm text-amber-800">{conversation.essence.breakthroughMoment}</p>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {conversation.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {msg.role === 'user' ? 'You' : conversation.agent}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.timestamp && (
                    <p className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Extracting State */}
          {conversation.extracting && (
            <div className="mt-6 flex items-center justify-center gap-3 text-purple-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Extracting essence...</span>
            </div>
          )}

          {/* Error State */}
          {conversation.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {conversation.error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onShare}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
          {!conversation.essence && (
            <button
              onClick={onExtract}
              disabled={conversation.extracting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {conversation.extracting ? 'Extracting...' : 'Extract Essence'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
