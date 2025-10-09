'use client';

/**
 * Create Thread Page
 * Post new discussions, questions, or session shares
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityChat, type Channel } from '@/lib/community/chat-client';
import { useAuth } from '@/lib/hooks/useAuth';

export default function CreateThreadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [threadType, setThreadType] = useState<'discussion' | 'question'>('discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/community/chat');
      return;
    }

    loadChannels();
  }, [user]);

  const loadChannels = async () => {
    try {
      const data = await communityChat.getChannels();
      setChannels(data);

      // Pre-select channel from query param
      const channelSlug = searchParams.get('channel');
      if (channelSlug) {
        const channel = data.find((c) => c.slug === channelSlug);
        if (channel) {
          setSelectedChannelId(channel.id);
        }
      } else if (data.length > 0) {
        setSelectedChannelId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load channels:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    if (!selectedChannelId) {
      setError('Please select a channel');
      return;
    }

    setSubmitting(true);

    try {
      const thread = await communityChat.createThread({
        channel_id: selectedChannelId,
        title: title.trim(),
        content: content.trim(),
        thread_type: threadType,
      });

      // Redirect to the new thread
      router.push(`/community/chat/thread/${thread.id}`);
    } catch (error) {
      console.error('Failed to create thread:', error);
      setError('Failed to create thread. Please try again.');
      setSubmitting(false);
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-ain-soph-gold/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/community/chat"
            className="inline-flex items-center gap-2 text-ain-soph-gold hover:text-ain-soph-amber mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Link>
          <h1 className="text-3xl font-light tracking-wide">Create New Thread</h1>
          <p className="text-ain-soph-gold/70 mt-2">
            Share a discussion, question, or field session
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-400/40 rounded-lg text-red-300"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Channel Selection */}
            <div>
              <label className="block text-sm font-medium text-ain-soph-gold mb-2">
                Channel
              </label>
              <select
                value={selectedChannelId}
                onChange={(e) => setSelectedChannelId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-ain-soph-gold/30 rounded-lg text-white focus:outline-none focus:border-ain-soph-amber"
                required
              >
                <option value="">Select a channel...</option>
                {channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.icon} {channel.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-ain-soph-gold/60 mt-2">
                Choose the most relevant channel for your post
              </p>
            </div>

            {/* Thread Type */}
            <div>
              <label className="block text-sm font-medium text-ain-soph-gold mb-2">
                Type
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setThreadType('discussion')}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    threadType === 'discussion'
                      ? 'bg-ain-soph-amber/20 border-ain-soph-amber text-ain-soph-gold font-medium'
                      : 'bg-slate-900/50 border-ain-soph-gold/30 text-ain-soph-gold/70 hover:border-ain-soph-gold/50'
                  }`}
                >
                  💬 Discussion
                </button>
                <button
                  type="button"
                  onClick={() => setThreadType('question')}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                    threadType === 'question'
                      ? 'bg-ain-soph-amber/20 border-ain-soph-amber text-ain-soph-gold font-medium'
                      : 'bg-slate-900/50 border-ain-soph-gold/30 text-ain-soph-gold/70 hover:border-ain-soph-gold/50'
                  }`}
                >
                  ❓ Question
                </button>
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
                placeholder="Give your thread a clear, descriptive title"
                maxLength={200}
                className="w-full px-4 py-3 bg-slate-900/50 border border-ain-soph-gold/30 rounded-lg text-white placeholder-ain-soph-gold/40 focus:outline-none focus:border-ain-soph-amber"
                required
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-ain-soph-gold/60">
                  Be specific and concise
                </p>
                <span className="text-xs text-ain-soph-gold/60">
                  {title.length}/200
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-ain-soph-gold mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, experience, or question in detail..."
                rows={12}
                className="w-full px-4 py-3 bg-slate-900/50 border border-ain-soph-gold/30 rounded-lg text-white placeholder-ain-soph-gold/40 focus:outline-none focus:border-ain-soph-amber resize-none"
                required
              />
              <p className="text-xs text-ain-soph-gold/60 mt-2">
                {content.length} characters
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-ain-soph-blue/20 border border-ain-soph-gold/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-ain-soph-gold mb-2">Community Guidelines</h3>
              <ul className="text-xs text-ain-soph-gold/70 space-y-1">
                <li>• Be respectful and constructive</li>
                <li>• Share authentically from your experience</li>
                <li>• Avoid promotional content or spam</li>
                <li>• Use content warnings for intense topics</li>
                <li>• Honor the sacred container we're building together</li>
              </ul>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-ain-soph-gold/50 hover:bg-slate-800/50 rounded-lg transition-colors text-ain-soph-gold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !title.trim() || !content.trim() || !selectedChannelId}
                className="flex items-center gap-2 px-6 py-3 bg-ain-soph-amber hover:bg-ain-soph-gold rounded-lg transition-colors text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Posting...' : 'Post Thread'}</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-slate-800/20 border border-ain-soph-gold/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-medium text-ain-soph-gold mb-3">Tips for Great Threads</h3>
          <ul className="space-y-2 text-sm text-ain-soph-gold/70">
            <li className="flex items-start gap-2">
              <span className="text-ain-soph-amber mt-0.5">•</span>
              <span>
                <strong className="text-ain-soph-gold">Be specific:</strong> "Week 1 Day 3 - MAIA gave me a three-word response that landed deeply" beats "MAIA is cool"
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ain-soph-amber mt-0.5">•</span>
              <span>
                <strong className="text-ain-soph-gold">Share context:</strong> What led to this moment? What were you working with?
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ain-soph-amber mt-0.5">•</span>
              <span>
                <strong className="text-ain-soph-gold">For session shares:</strong> Consider using the one-click share from MAIA Studio for full field data
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ain-soph-amber mt-0.5">•</span>
              <span>
                <strong className="text-ain-soph-gold">For questions:</strong> Share what you've already tried or considered
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
