'use client';

/**
 * Quick Broadcast Widget
 *
 * Fast announcement sender for admins
 * Appears on community hub homepage
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickBroadcastProps {
  isAdmin?: boolean; // Pass from auth context
}

export function QuickBroadcast({ isAdmin = true }: QuickBroadcastProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Only show to admins
  if (!isAdmin) return null;

  const handleQuickSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);

    try {
      const response = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          channels: {
            discord: true,
            telegram: true,
            email: false, // Quick send = instant channels only
          },
        }),
      });

      if (response.ok) {
        setSent(true);
        setTimeout(() => {
          setIsOpen(false);
          setMessage('');
          setSent(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Quick broadcast error:', error);
      alert('Failed to send. Use full broadcast page for more control.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Quick Send Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-20 flex items-center gap-2 px-4 py-3 bg-gold-divine/20 hover:bg-gold-divine/30 border border-gold-divine/50 rounded-full shadow-lg transition-all"
        >
          <Send className="w-4 h-4 text-gold-divine" />
          <span className="text-sm font-medium text-gold-divine">Quick Announce</span>
        </motion.button>
      )}

      {/* Quick Send Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-6 left-6 z-20 w-96 bg-neutral-darker border border-gold-divine/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gold-divine/20 border-b border-gold-divine/30 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gold-divine">
                <Send className="w-4 h-4" />
                <span className="font-medium">Quick Announcement</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gold-divine hover:text-gold-divine/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {sent ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-green-400"
                >
                  <Check className="w-12 h-12 mb-3" />
                  <p className="font-medium">Sent to Discord & Telegram!</p>
                </motion.div>
              ) : (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your announcement...

Example: '🌀 New field note just dropped! Check it out.'"
                    className="w-full h-32 bg-black/50 border border-gold-divine/30 rounded-lg px-3 py-2 text-gold-divine text-sm placeholder-gold-divine/30 resize-none focus:outline-none focus:border-gold-divine"
                    disabled={isSending}
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gold-divine/70">
                      Sends to Telegram instantly
                    </div>
                    <button
                      onClick={handleQuickSend}
                      disabled={!message.trim() || isSending}
                      className="px-4 py-2 bg-gold-divine/20 hover:bg-gold-divine/30 border border-gold-divine/50 disabled:bg-neutral-darker disabled:border-neutral-silver/30 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2 text-gold-divine"
                    >
                      {isSending ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>Send</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gold-divine/30">
                    <Link
                      href="/community/admin/broadcast"
                      className="text-xs text-gold-divine hover:text-gold-divine/80 transition-colors"
                    >
                      Need more options? Use full broadcast center →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
