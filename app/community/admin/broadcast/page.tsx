'use client';

/**
 * Community Broadcast Admin
 *
 * Multi-channel notification system for beta tester communications
 * Send to Discord, Telegram, Email simultaneously
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, MessageCircle, Mail, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface BroadcastMessage {
  content: string;
  channels: {
    discord: boolean;
    telegram: boolean;
    email: boolean;
  };
  template?: string;
}

interface SendResult {
  channel: string;
  success: boolean;
  count?: number;
  error?: string;
}

const messageTemplates = [
  {
    id: 'field-note',
    label: 'New Field Note',
    content: `🌀 New Field Note Published

[TITLE]

Read it here: [LINK]

The field is holding you.
- Soullab Team`,
  },
  {
    id: 'experiment-update',
    label: 'Experiment Update',
    content: `📊 Day [X] of 21 Update

[MESSAGE]

Check the live tracker: https://soullab.com/community/experiment

- Soullab Team`,
  },
  {
    id: 'the-flip',
    label: 'The Flip Announcement',
    content: `🌀 THE FLIP IS HAPPENING

MAIA transforms into Sacred Mirror mode TODAY.

Her talkative phase ends. The minimal phase begins.

This is what we've been preparing for.

Notice what arises. Share your experience.

The field is holding you.
- Soullab Team`,
  },
  {
    id: 'chat-invite',
    label: 'Live Chat Invitation',
    content: `💬 Live Community Gathering

Join us in [CHANNEL] for a real-time discussion about [TOPIC].

Starting in 30 minutes!

See you there 🌀`,
  },
];

export default function BroadcastAdminPage() {
  const [message, setMessage] = useState<BroadcastMessage>({
    content: '',
    channels: {
      discord: true,
      telegram: true,
      email: false,
    },
  });

  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<SendResult[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find((t) => t.id === templateId);
    if (template) {
      setMessage({ ...message, content: template.content, template: templateId });
    }
  };

  const handleSend = async () => {
    if (!message.content.trim()) {
      alert('Please enter a message to send');
      return;
    }

    const enabledChannels = Object.entries(message.channels)
      .filter(([_, enabled]) => enabled)
      .map(([channel]) => channel);

    if (enabledChannels.length === 0) {
      alert('Please select at least one channel');
      return;
    }

    setIsSending(true);
    setResults([]);

    try {
      const response = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.content,
          channels: message.channels,
        }),
      });

      const data = await response.json();
      setResults(data.results || []);

      // Success notification
      if (data.success) {
        setTimeout(() => {
          // Could add toast notification here
          console.log('Broadcast sent successfully');
        }, 500);
      }
    } catch (error) {
      console.error('Broadcast error:', error);
      setResults([
        {
          channel: 'system',
          success: false,
          error: 'Failed to send broadcast. Check console for details.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-ain-soph-gold/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-ain-soph-gold hover:text-ain-soph-amber mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community Hub
          </Link>
          <h1 className="text-3xl font-light tracking-wide flex items-center gap-3">
            <Send className="w-8 h-8 text-ain-soph-amber" />
            Broadcast Center
          </h1>
          <p className="text-ain-soph-gold/70 mt-2">
            Send notifications to Discord, Telegram, and email simultaneously
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Templates */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Quick Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {messageTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`px-4 py-3 rounded-lg border transition-all text-sm ${
                  message.template === template.id
                    ? 'bg-ain-soph-amber border-ain-soph-amber'
                    : 'bg-slate-800/50 border-ain-soph-gold/30 hover:bg-slate-700/50'
                }`}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Composer */}
        <div className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-2xl p-8 mb-6">
          <h3 className="text-lg font-medium mb-4">Compose Message</h3>

          <textarea
            value={message.content}
            onChange={(e) => setMessage({ ...message, content: e.target.value })}
            placeholder="Write your message here...

Tip: Use [PLACEHOLDERS] for variable content"
            className="w-full h-64 bg-slate-900/50 border border-ain-soph-gold/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/30 resize-none focus:outline-none focus:border-ain-soph-amber"
          />

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-ain-soph-gold/70">
              {message.content.length} characters
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-ain-soph-amber hover:text-ain-soph-gold"
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          {/* Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 bg-slate-900/50 border border-ain-soph-gold/30 rounded-xl p-4"
            >
              <div className="text-sm text-ain-soph-gold/70 mb-2">Preview:</div>
              <div className="whitespace-pre-wrap text-ain-soph-amber">{message.content}</div>
            </motion.div>
          )}
        </div>

        {/* Channel Selection */}
        <div className="bg-slate-800/30 border border-ain-soph-gold/30 rounded-2xl p-8 mb-6">
          <h3 className="text-lg font-medium mb-4">Select Channels</h3>

          <div className="space-y-4">
            {/* Discord */}
            <label className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all">
              <input
                type="checkbox"
                checked={message.channels.discord}
                onChange={(e) =>
                  setMessage({
                    ...message,
                    channels: { ...message.channels, discord: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded"
              />
              <div className="flex-1 flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-ain-soph-amber" />
                <div>
                  <div className="font-medium">Discord</div>
                  <div className="text-sm text-ain-soph-gold/70">
                    #announcements channel • ~30 members
                  </div>
                </div>
              </div>
            </label>

            {/* Telegram */}
            <label className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all">
              <input
                type="checkbox"
                checked={message.channels.telegram}
                onChange={(e) =>
                  setMessage({
                    ...message,
                    channels: { ...message.channels, telegram: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded"
              />
              <div className="flex-1 flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-medium">Telegram</div>
                  <div className="text-sm text-ain-soph-gold/70">
                    Beta Testers Group • ~15 members
                  </div>
                </div>
              </div>
            </label>

            {/* Email */}
            <label className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all">
              <input
                type="checkbox"
                checked={message.channels.email}
                onChange={(e) =>
                  setMessage({
                    ...message,
                    channels: { ...message.channels, email: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded"
              />
              <div className="flex-1 flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-ain-soph-gold/70">
                    Beta tester mailing list • ~35 recipients
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Send Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSend}
            disabled={isSending || !message.content.trim()}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-ain-soph-amber to-ain-soph-gold hover:from-purple-500 hover:to-purple-400 disabled:from-slate-700 disabled:to-slate-600 rounded-xl font-medium text-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Broadcast</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setMessage({
                content: '',
                channels: { discord: true, telegram: true, email: false },
              });
              setResults([]);
            }}
            className="px-6 py-4 border border-ain-soph-gold/50 hover:bg-ain-soph-blue/20 rounded-xl transition-all"
          >
            Clear
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-slate-800/30 border border-ain-soph-gold/30 rounded-2xl p-8"
          >
            <h3 className="text-lg font-medium mb-4">Delivery Results</h3>
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-4 rounded-xl ${
                    result.success
                      ? 'bg-green-900/20 border border-green-500/30'
                      : 'bg-red-900/20 border border-red-500/30'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium capitalize">{result.channel}</div>
                    <div className="text-sm text-ain-soph-gold/70">
                      {result.success
                        ? `Delivered to ${result.count || 0} recipients`
                        : result.error || 'Failed to send'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-gradient-to-r from-blue-600/20 to-ain-soph-blue/40 border border-ain-soph-gold/30 rounded-2xl p-8"
        >
          <h3 className="text-xl font-medium mb-4">Setup Instructions</h3>
          <div className="space-y-4 text-sm text-ain-soph-gold/80">
            <div>
              <strong>Discord Webhook:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
                <li>Go to your Discord server → Server Settings → Integrations</li>
                <li>Create webhook for #announcements channel</li>
                <li>Copy webhook URL to <code className="bg-slate-900/50 px-2 py-1 rounded">.env.local</code>: <code className="bg-slate-900/50 px-2 py-1 rounded">DISCORD_WEBHOOK_URL=...</code></li>
              </ol>
            </div>

            <div>
              <strong>Telegram Bot:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
                <li>Message @BotFather on Telegram → /newbot</li>
                <li>Follow prompts to create bot and get token</li>
                <li>Add bot to your group and make it admin</li>
                <li>Add to <code className="bg-slate-900/50 px-2 py-1 rounded">.env.local</code>: <code className="bg-slate-900/50 px-2 py-1 rounded">TELEGRAM_BOT_TOKEN=...</code></li>
                <li>Get chat ID and add: <code className="bg-slate-900/50 px-2 py-1 rounded">TELEGRAM_CHAT_ID=...</code></li>
              </ol>
            </div>

            <div>
              <strong>Email:</strong>
              <p className="mt-2 ml-4">Uses your existing email service configuration. Ensure SMTP settings are in .env.local</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
