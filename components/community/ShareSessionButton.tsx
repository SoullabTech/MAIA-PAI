/**
 * Share Session to Community Button
 * One-click share MAIA sessions with field data
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { communityChat } from '@/lib/community/chat-client';
import { useAuth } from '@/lib/hooks/useAuth';

interface ShareSessionButtonProps {
  sessionData: {
    exchanges: Array<{
      userMessage: string;
      aiResponse: string;
      timestamp: Date;
    }>;
    fieldMetrics?: {
      elements: {
        earth: number;
        water: number;
        air: number;
        fire: number;
      };
      silenceRate: number;
      averageDepth: number;
    };
  };
  className?: string;
}

export function ShareSessionButton({ sessionData, className = '' }: ShareSessionButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedChannelSlug, setSelectedChannelSlug] = useState('field-sessions');

  const channels = [
    { slug: 'field-sessions', name: 'Field Sessions', icon: '🌀' },
    { slug: 'week-1-talkative', name: 'Week 1: Talkative', icon: '💬' },
    { slug: 'sacred-mirror', name: 'Sacred Mirror', icon: '🪞' },
    { slug: 'integration', name: 'Integration & Practice', icon: '🔥' },
  ];

  const handleOpenModal = () => {
    if (!user) {
      alert('Please sign in to share sessions');
      return;
    }

    // Pre-fill with session summary
    const exchangeCount = sessionData.exchanges.length;
    const suggestedTitle = `Session with ${exchangeCount} exchanges - ${sessionData.fieldMetrics ? 'Field-aware' : 'Conversational'}`;
    setTitle(suggestedTitle);

    // Generate content preview
    const preview = sessionData.exchanges
      .slice(0, 3)
      .map((ex, idx) => `${idx + 1}. Me: "${ex.userMessage}"\nMAIA: "${ex.aiResponse}"`)
      .join('\n\n');

    const contentTemplate = `Just had a powerful session with MAIA. Here's what unfolded:\n\n${preview}\n\n${
      exchangeCount > 3 ? `[${exchangeCount - 3} more exchanges...]\n\n` : ''
    }What stood out for me:\n[Share your reflection here]`;

    setContent(contentTemplate);
    setShowModal(true);
  };

  const handleShare = async () => {
    if (!user || !title.trim() || !content.trim()) return;

    setSharing(true);

    try {
      // Get channel ID
      const allChannels = await communityChat.getChannels();
      const channel = allChannels.find((c) => c.slug === selectedChannelSlug);

      if (!channel) {
        throw new Error('Channel not found');
      }

      // Create thread with session data
      const thread = await communityChat.createThread({
        channel_id: channel.id,
        title: title.trim(),
        content: content.trim(),
        thread_type: 'session_share',
        session_data: sessionData.fieldMetrics
          ? {
              session_id: crypto.randomUUID(), // Generate temp ID
              exchange_count: sessionData.exchanges.length,
              elements: sessionData.fieldMetrics.elements,
              silence_rate: sessionData.fieldMetrics.silenceRate,
            }
          : undefined,
      });

      setShareSuccess(true);

      // Redirect to thread after a moment
      setTimeout(() => {
        router.push(`/community/chat/thread/${thread.id}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to share session:', error);
      alert('Failed to share session. Please try again.');
      setSharing(false);
    }
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={handleOpenModal}
        className={`flex items-center gap-2 px-4 py-2 bg-ain-soph-amber/20 hover:bg-ain-soph-amber/30 border border-ain-soph-gold/40 rounded-lg transition-colors text-ain-soph-gold ${className}`}
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share to Community</span>
      </button>

      {/* Share Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !sharing && setShowModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-slate-900 border border-ain-soph-gold/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Success State */}
                {shareSuccess ? (
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-8 h-8 text-green-400" />
                    </motion.div>
                    <h2 className="text-2xl font-light text-ain-soph-gold mb-2">
                      Session Shared!
                    </h2>
                    <p className="text-ain-soph-gold/70">
                      Redirecting to your thread...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="p-6 border-b border-ain-soph-gold/30">
                      <h2 className="text-2xl font-light text-ain-soph-gold mb-2">
                        Share Session to Community
                      </h2>
                      <p className="text-sm text-ain-soph-gold/70">
                        {sessionData.exchanges.length} exchanges •{' '}
                        {sessionData.fieldMetrics ? 'Field data included' : 'Conversational'}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Channel Selection */}
                      <div>
                        <label className="block text-sm font-medium text-ain-soph-gold mb-2">
                          Channel
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {channels.map((channel) => (
                            <button
                              key={channel.slug}
                              type="button"
                              onClick={() => setSelectedChannelSlug(channel.slug)}
                              className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                                selectedChannelSlug === channel.slug
                                  ? 'bg-ain-soph-amber/20 border-ain-soph-amber text-ain-soph-gold font-medium'
                                  : 'bg-slate-800/50 border-ain-soph-gold/30 text-ain-soph-gold/70 hover:border-ain-soph-gold/50'
                              }`}
                            >
                              {channel.icon} {channel.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-ain-soph-gold mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Give your session share a title"
                          className="w-full px-4 py-2 bg-slate-800/50 border border-ain-soph-gold/30 rounded-lg text-white placeholder-ain-soph-gold/40 focus:outline-none focus:border-ain-soph-amber"
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-sm font-medium text-ain-soph-gold mb-2">
                          Share your reflection
                        </label>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={10}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-ain-soph-gold/30 rounded-lg text-white placeholder-ain-soph-gold/40 focus:outline-none focus:border-ain-soph-amber resize-none"
                        />
                        <p className="text-xs text-ain-soph-gold/60 mt-2">
                          Edit the template or write your own reflection
                        </p>
                      </div>

                      {/* Field Metrics Preview */}
                      {sessionData.fieldMetrics && (
                        <div className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-lg p-4">
                          <div className="text-xs font-medium text-ain-soph-gold/70 uppercase tracking-wide mb-3">
                            Field Signature (will be shown with your post)
                          </div>
                          <div className="flex items-center gap-4">
                            {Object.entries(sessionData.fieldMetrics.elements).map(([element, value]) => {
                              const icons: Record<string, string> = {
                                earth: '🪨',
                                water: '💧',
                                air: '🌬️',
                                fire: '🔥',
                              };
                              return (
                                <span key={element} className="flex items-center gap-1.5 text-sm">
                                  <span>{icons[element]}</span>
                                  <span className="text-ain-soph-gold/70">
                                    {(value * 100).toFixed(0)}%
                                  </span>
                                </span>
                              );
                            })}
                            <span className="flex items-center gap-1.5 text-sm ml-auto">
                              <span>🤫</span>
                              <span className="text-ain-soph-gold/70">
                                {(sessionData.fieldMetrics.silenceRate * 100).toFixed(0)}%
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-ain-soph-gold/30 flex items-center justify-between">
                      <button
                        onClick={() => setShowModal(false)}
                        disabled={sharing}
                        className="px-4 py-2 border border-ain-soph-gold/50 hover:bg-slate-800/50 rounded-lg transition-colors text-ain-soph-gold disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleShare}
                        disabled={sharing || !title.trim() || !content.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-ain-soph-amber hover:bg-ain-soph-gold rounded-lg transition-colors text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{sharing ? 'Sharing...' : 'Share Session'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
