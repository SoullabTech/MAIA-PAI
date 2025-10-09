'use client';

/**
 * Thread Detail Page
 * View thread with replies and reactions
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, Eye, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityChat, type Thread, type Reply, type Reaction } from '@/lib/community/chat-client';
import { ReactionBar } from '@/components/community/ReactionBar';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ThreadDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const threadId = params.id as string;

  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [threadReactions, setThreadReactions] = useState<Reaction[]>([]);
  const [replyReactions, setReplyReactions] = useState<Record<string, Reaction[]>>({});
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadThread();
    loadReplies();
  }, [threadId]);

  const loadThread = async () => {
    try {
      const data = await communityChat.getThread(threadId);
      setThread(data);

      if (data) {
        const reactions = await communityChat.getReactions(threadId, 'thread');
        setThreadReactions(reactions);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load thread:', error);
      setLoading(false);
    }
  };

  const loadReplies = async () => {
    try {
      const data = await communityChat.getReplies(threadId);
      setReplies(data);

      // Load reactions for each reply
      const reactionPromises = data.map(async (reply) => {
        const reactions = await communityChat.getReactions(reply.id, 'reply');
        return { replyId: reply.id, reactions };
      });

      const reactionResults = await Promise.all(reactionPromises);
      const reactionMap = reactionResults.reduce((acc, { replyId, reactions }) => {
        acc[replyId] = reactions;
        return acc;
      }, {} as Record<string, Reaction[]>);

      setReplyReactions(reactionMap);
    } catch (error) {
      console.error('Failed to load replies:', error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to reply');
      return;
    }
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await communityChat.createReply({
        thread_id: threadId,
        content: replyContent,
      });

      setReplyContent('');
      await loadReplies();
      // Reload thread to update reply count
      await loadThread();
    } catch (error) {
      console.error('Failed to post reply:', error);
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReactToThread = async (reactionType: Reaction['reaction_type']) => {
    if (!user) {
      alert('Please sign in to react');
      return;
    }

    try {
      await communityChat.addReaction({
        target_id: threadId,
        target_type: 'thread',
        reaction_type: reactionType,
      });

      const reactions = await communityChat.getReactions(threadId, 'thread');
      setThreadReactions(reactions);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleRemoveReactionFromThread = async (reactionType: Reaction['reaction_type']) => {
    if (!user) return;

    try {
      await communityChat.removeReaction({
        target_id: threadId,
        target_type: 'thread',
        reaction_type: reactionType,
      });

      const reactions = await communityChat.getReactions(threadId, 'thread');
      setThreadReactions(reactions);
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
  };

  const handleReactToReply = async (replyId: string, reactionType: Reaction['reaction_type']) => {
    if (!user) {
      alert('Please sign in to react');
      return;
    }

    try {
      await communityChat.addReaction({
        target_id: replyId,
        target_type: 'reply',
        reaction_type: reactionType,
      });

      const reactions = await communityChat.getReactions(replyId, 'reply');
      setReplyReactions((prev) => ({ ...prev, [replyId]: reactions }));
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleRemoveReactionFromReply = async (replyId: string, reactionType: Reaction['reaction_type']) => {
    if (!user) return;

    try {
      await communityChat.removeReaction({
        target_id: replyId,
        target_type: 'reply',
        reaction_type: reactionType,
      });

      const reactions = await communityChat.getReactions(replyId, 'reply');
      setReplyReactions((prev) => ({ ...prev, [replyId]: reactions }));
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
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
        <div className="text-ain-soph-gold">Loading thread...</div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-ain-soph-gold mb-4">Thread not found</p>
          <Link href="/community/chat" className="text-ain-soph-amber hover:underline">
            Back to chat
          </Link>
        </div>
      </div>
    );
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Thread */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-2xl p-8 mb-6"
        >
          {/* Thread Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {thread.is_pinned && (
                <span className="px-2 py-1 bg-ain-soph-amber/20 border border-ain-soph-amber/40 rounded text-xs text-ain-soph-gold">
                  Pinned
                </span>
              )}
              {thread.thread_type === 'session_share' && (
                <span className="px-2 py-1 bg-blue-500/20 border border-blue-400/40 rounded text-xs text-blue-300">
                  🌀 Session Share
                </span>
              )}
              {thread.thread_type === 'question' && (
                <span className="px-2 py-1 bg-ain-soph-blue/50 border border-ain-soph-amber/40 rounded text-xs text-ain-soph-gold">
                  ❓ Question
                </span>
              )}
            </div>

            <h1 className="text-3xl font-light text-ain-soph-gold mb-4">
              {thread.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-ain-soph-gold/60 mb-6">
              <span className="text-ain-soph-gold/80">{thread.author_name}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(thread.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {thread.view_count} views
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {thread.reply_count} replies
              </span>
            </div>
          </div>

          {/* Session Share Elements */}
          {thread.thread_type === 'session_share' && thread.session_elements && (
            <div className="mb-6 p-4 bg-slate-900/40 border border-ain-soph-gold/20 rounded-xl">
              <div className="text-xs font-medium text-ain-soph-gold/70 uppercase tracking-wide mb-3">
                Session Field Signature
              </div>
              <div className="flex items-center gap-4">
                {Object.entries(thread.session_elements).map(([element, value]) => {
                  const icons: Record<string, string> = {
                    earth: '🪨',
                    water: '💧',
                    air: '🌬️',
                    fire: '🔥',
                  };
                  return (
                    <div key={element} className="flex items-center gap-2">
                      <span className="text-2xl">{icons[element]}</span>
                      <div>
                        <div className="text-xs text-ain-soph-gold/70 capitalize">{element}</div>
                        <div className="text-sm font-medium text-ain-soph-gold">
                          {(value * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
                {thread.session_silence_rate !== undefined && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xl">🤫</span>
                    <div>
                      <div className="text-xs text-ain-soph-gold/70">Silence</div>
                      <div className="text-sm font-medium text-ain-soph-gold">
                        {(thread.session_silence_rate * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thread Content */}
          <div className="prose prose-invert prose-ain-soph max-w-none mb-6">
            <p className="text-white leading-relaxed whitespace-pre-wrap">
              {thread.content}
            </p>
          </div>

          {/* Thread Reactions */}
          <ReactionBar
            reactions={threadReactions}
            targetId={thread.id}
            targetType="thread"
            currentUserId={user?.id}
            onReact={handleReactToThread}
            onRemoveReaction={handleRemoveReactionFromThread}
          />
        </motion.div>

        {/* Replies */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-light text-ain-soph-gold mb-4">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {replies.map((reply, idx) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-xl p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-ain-soph-gold">
                      {reply.author_name}
                    </span>
                    <span className="text-xs text-ain-soph-gold/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-white leading-relaxed whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              </div>

              <ReactionBar
                reactions={replyReactions[reply.id] || []}
                targetId={reply.id}
                targetType="reply"
                currentUserId={user?.id}
                onReact={(type) => handleReactToReply(reply.id, type)}
                onRemoveReaction={(type) => handleRemoveReactionFromReply(reply.id, type)}
              />
            </motion.div>
          ))}
        </div>

        {/* Reply Form */}
        {thread.is_locked ? (
          <div className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-xl p-6 text-center">
            <p className="text-ain-soph-gold/70">This thread is locked</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-xl p-6"
          >
            <h3 className="text-lg font-medium text-ain-soph-gold mb-4">Add a Reply</h3>
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={user ? "Share your thoughts..." : "Sign in to reply"}
                disabled={!user || submitting}
                className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-ain-soph-gold/30 rounded-lg text-white placeholder-ain-soph-gold/40 focus:outline-none focus:border-ain-soph-amber resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-ain-soph-gold/60">
                  {user ? 'Be respectful and constructive' : 'Please sign in to participate'}
                </p>
                <button
                  type="submit"
                  disabled={!user || !replyContent.trim() || submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-ain-soph-amber hover:bg-ain-soph-gold rounded-lg transition-colors text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Posting...' : 'Post Reply'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
