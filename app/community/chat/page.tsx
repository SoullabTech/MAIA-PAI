'use client';

/**
 * Community Chat - Main View
 * Field-aware threaded discussions
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MessageCircle, Clock, Eye, MessageSquare, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityChat, type Channel, type Thread, type FieldState } from '@/lib/community/chat-client';
import { FieldAtmosphere } from '@/components/community/FieldAtmosphere';
import { useAuth } from '@/lib/hooks/useAuth';

export default function CommunityChat() {
  const router = useRouter();
  const { user } = useAuth();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [fieldState, setFieldState] = useState<FieldState | null>(null);
  const [loading, setLoading] = useState(true);

  // Load channels on mount
  useEffect(() => {
    loadChannels();
  }, []);

  // Load threads when channel changes
  useEffect(() => {
    if (selectedChannel) {
      loadThreads(selectedChannel.id);
      loadFieldState(selectedChannel.id);
      updatePresence();
    }
  }, [selectedChannel]);

  const loadChannels = async () => {
    try {
      const data = await communityChat.getChannels();
      setChannels(data);
      if (data.length > 0) {
        setSelectedChannel(data[0]); // Select first channel by default
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load channels:', error);
      setLoading(false);
    }
  };

  const loadThreads = async (channelId: string) => {
    try {
      const data = await communityChat.getThreads(channelId);
      setThreads(data);
    } catch (error) {
      console.error('Failed to load threads:', error);
    }
  };

  const loadFieldState = async (channelId: string) => {
    try {
      const data = await communityChat.getFieldState(channelId);
      setFieldState(data);
    } catch (error) {
      console.error('Failed to load field state:', error);
    }
  };

  const updatePresence = async () => {
    if (!selectedChannel) return;
    try {
      await communityChat.updatePresence({
        status: 'online',
        channel_id: selectedChannel.id,
      });
    } catch (error) {
      // Silently fail for presence updates
    }
  };

  const handleCreateThread = () => {
    if (!user) {
      alert('Please sign in to create a thread');
      return;
    }
    if (!selectedChannel) return;

    router.push(`/community/chat/create?channel=${selectedChannel.slug}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-ain-soph-gold">Loading community...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-ain-soph-gold/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-ain-soph-gold hover:text-ain-soph-amber mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community Hub
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-wide">Community Chat</h1>
              <p className="text-ain-soph-gold/70 mt-2">
                Field-aware discussions with soul-builders
              </p>
            </div>
            <button
              onClick={handleCreateThread}
              className="flex items-center gap-2 px-4 py-2 bg-ain-soph-amber hover:bg-ain-soph-gold rounded-lg transition-colors text-slate-900 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Thread</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar: Channels + Field State */}
          <div className="col-span-3 space-y-6">
            {/* Channels */}
            <div>
              <h3 className="text-sm font-medium text-ain-soph-gold/70 uppercase tracking-wide mb-3">
                Channels
              </h3>
              <div className="space-y-1">
                {channels.map((channel) => {
                  const isActive = selectedChannel?.id === channel.id;
                  return (
                    <motion.button
                      key={channel.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                        isActive
                          ? 'bg-ain-soph-amber/20 border-l-2 border-ain-soph-amber'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="text-xl">{channel.icon}</span>
                      <span className={`text-sm ${isActive ? 'text-ain-soph-gold font-medium' : 'text-white'}`}>
                        {channel.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Field State */}
            {fieldState && selectedChannel && (
              <FieldAtmosphere fieldState={fieldState} showDetailed={true} />
            )}
          </div>

          {/* Main: Thread List */}
          <div className="col-span-9 space-y-4">
            {/* Channel Header */}
            {selectedChannel && (
              <div className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{selectedChannel.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-2xl font-light text-ain-soph-gold mb-2">
                      {selectedChannel.name}
                    </h2>
                    <p className="text-ain-soph-gold/70 text-sm">
                      {selectedChannel.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Thread List */}
            {threads.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-slate-800/20 border border-ain-soph-gold/20 rounded-2xl"
              >
                <MessageCircle className="w-12 h-12 text-ain-soph-gold/40 mx-auto mb-4" />
                <p className="text-ain-soph-gold/70 mb-4">No threads yet in this channel</p>
                <button
                  onClick={handleCreateThread}
                  className="px-4 py-2 bg-ain-soph-amber hover:bg-ain-soph-gold rounded-lg transition-colors text-slate-900 font-medium"
                >
                  Start the conversation
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {threads.map((thread, idx) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/community/chat/thread/${thread.id}`}>
                      <div className={`group bg-slate-800/30 border border-ain-soph-gold/30 rounded-xl p-5 hover:border-ain-soph-amber/50 hover:bg-slate-800/50 transition-all cursor-pointer ${
                        thread.is_pinned ? 'border-ain-soph-amber' : ''
                      }`}>
                        {/* Thread Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {thread.is_pinned && (
                                <span className="px-2 py-0.5 bg-ain-soph-amber/20 border border-ain-soph-amber/40 rounded text-xs text-ain-soph-gold">
                                  Pinned
                                </span>
                              )}
                              {thread.thread_type === 'session_share' && (
                                <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-400/40 rounded text-xs text-blue-300">
                                  🌀 Session Share
                                </span>
                              )}
                              {thread.thread_type === 'question' && (
                                <span className="text-ain-soph-gold/70 text-lg">❓</span>
                              )}
                            </div>
                            <h3 className="text-lg font-medium text-white group-hover:text-ain-soph-gold transition-colors mb-1 truncate">
                              {thread.title}
                            </h3>
                            <p className="text-sm text-ain-soph-gold/70 line-clamp-2">
                              {thread.content}
                            </p>
                          </div>
                        </div>

                        {/* Session Share Elements */}
                        {thread.thread_type === 'session_share' && thread.session_elements && (
                          <div className="flex items-center gap-3 mb-3 py-2 px-3 bg-slate-900/40 rounded-lg">
                            {Object.entries(thread.session_elements).map(([element, value]) => {
                              const icons: Record<string, string> = {
                                earth: '🪨',
                                water: '💧',
                                air: '🌬️',
                                fire: '🔥',
                              };
                              return (
                                <span key={element} className="flex items-center gap-1.5 text-xs">
                                  <span>{icons[element]}</span>
                                  <span className="text-ain-soph-gold/70">{(value * 100).toFixed(0)}%</span>
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Thread Meta */}
                        <div className="flex items-center gap-4 text-xs text-ain-soph-gold/60">
                          <span className="flex items-center gap-1">
                            <span className="text-ain-soph-gold/70">{thread.author_name}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(thread.last_activity_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {thread.reply_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {thread.view_count}
                          </span>
                          {thread.reaction_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {thread.reaction_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
