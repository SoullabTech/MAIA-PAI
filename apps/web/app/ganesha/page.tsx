'use client';

/**
 * Ganesha Contact Management Dashboard
 * Sacred command center for consciousness pioneer community
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Mail,
  SendHorizonal,
  RefreshCw,
  BarChart3,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface GaneshaStats {
  total_contacts: number;
  active_contacts: number;
  beta_testers: number;
  newsletter_subscribers: number;
  total_emails_sent: number;
}

interface SyncStatus {
  localContactsCount: number;
  databaseStats: GaneshaStats;
  needsSync: boolean;
}

export default function GaneshaPage() {
  const [stats, setStats] = useState<GaneshaStats | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    loadSyncStatus();
  }, []);

  async function loadSyncStatus() {
    try {
      setLoading(true);
      const res = await fetch('/api/ganesha/sync-contacts');
      const data = await res.json();

      if (data.success) {
        setSyncStatus(data);
        setStats(data.databaseStats);
      } else {
        showMessage('error', data.error || 'Failed to load sync status');
      }
    } catch (error) {
      console.error('Failed to load sync status:', error);
      showMessage('error', 'Failed to connect to Ganesha system');
    } finally {
      setLoading(false);
    }
  }

  async function syncContacts() {
    try {
      setSyncing(true);
      showMessage('info', 'Syncing consciousness pioneers to database...');

      const res = await fetch('/api/ganesha/sync-contacts', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        showMessage('success', data.message);
        setStats(data.stats);
        await loadSyncStatus();
      } else {
        showMessage('error', data.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      showMessage('error', 'Failed to sync contacts');
    } finally {
      setSyncing(false);
    }
  }

  async function sendNewsletterPreview() {
    try {
      setSending(true);
      showMessage('info', 'Preparing consciousness revolution email preview...');

      const res = await fetch('/api/ganesha/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: 'consciousness-revolution',
          recipients: 'beta-testers',
          action: 'preview'
        })
      });

      const data = await res.json();

      if (data.success) {
        showMessage('success', `Preview ready: ${data.recipientCount} consciousness pioneers will receive the message`);
      } else {
        showMessage('error', data.error || 'Preview failed');
      }
    } catch (error) {
      console.error('Preview failed:', error);
      showMessage('error', 'Failed to preview newsletter');
    } finally {
      setSending(false);
    }
  }

  async function sendNewsletter() {
    if (!confirm('Are you ready to send the Consciousness Revolution email to all beta testers?')) {
      return;
    }

    try {
      setSending(true);
      showMessage('info', 'Sending consciousness revolution announcement...');

      const res = await fetch('/api/ganesha/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: 'consciousness-revolution',
          recipients: 'beta-testers'
        })
      });

      const data = await res.json();

      if (data.success) {
        showMessage('success', data.message);
        await loadSyncStatus();
      } else {
        showMessage('error', data.error || 'Send failed');
      }
    } catch (error) {
      console.error('Send failed:', error);
      showMessage('error', 'Failed to send newsletter');
    } finally {
      setSending(false);
    }
  }

  function showMessage(type: 'success' | 'error' | 'info', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jade-shadow via-jade-mineral to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-12 h-12 text-jade-sage animate-spin mx-auto mb-4" />
          <p className="text-jade-sage text-lg">Initializing Ganesha...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jade-shadow via-jade-mineral to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-jade-light mb-3 flex items-center justify-center gap-3"
          >
            <Sparkles className="w-10 h-10 text-jade-sage" />
            Ganesha
            <Sparkles className="w-10 h-10 text-jade-sage" />
          </motion.h1>
          <p className="text-jade-sage text-lg">
            Consciousness Pioneer Command Center
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-jade-shadow/50 border-jade-sage text-jade-light'
                : message.type === 'error'
                ? 'bg-red-900/20 border-red-500 text-red-300'
                : 'bg-blue-900/20 border-blue-500 text-blue-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p>{message.text}</p>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Total Contacts"
              value={stats.total_contacts}
              color="jade"
            />
            <StatCard
              icon={<Zap className="w-6 h-6" />}
              label="Active"
              value={stats.active_contacts}
              color="green"
            />
            <StatCard
              icon={<Sparkles className="w-6 h-6" />}
              label="Beta Testers"
              value={stats.beta_testers}
              color="purple"
            />
            <StatCard
              icon={<Mail className="w-6 h-6" />}
              label="Newsletter"
              value={stats.newsletter_subscribers}
              color="blue"
            />
          </div>
        )}

        {/* Sync Section */}
        {syncStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-jade-mineral/30 backdrop-blur-sm border border-jade-sage/30 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-jade-light mb-2">Database Sync</h2>
                <p className="text-jade-sage">
                  {syncStatus.localContactsCount} contacts in code, {syncStatus.databaseStats?.total_contacts || 0} in database
                </p>
              </div>
              {syncStatus.needsSync && (
                <div className="bg-yellow-900/30 border border-yellow-600 px-4 py-2 rounded-lg">
                  <p className="text-yellow-300 text-sm font-semibold">Sync Needed</p>
                </div>
              )}
            </div>

            <button
              onClick={syncContacts}
              disabled={syncing}
              className="w-full bg-gradient-to-r from-jade-sage to-jade-light text-jade-shadow px-6 py-4 rounded-xl font-semibold text-lg
                hover:from-jade-light hover:to-jade-sage transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3"
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing Consciousness Pioneers...' : 'Sync All Contacts to Database'}
            </button>
          </motion.div>
        )}

        {/* Email Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-jade-mineral/50 via-jade-shadow/40 to-purple-900/30 backdrop-blur-sm border border-jade-sage/40 rounded-2xl p-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-jade-light mb-2 flex items-center gap-3">
              <SendHorizonal className="w-6 h-6 text-jade-sage" />
              Consciousness Revolution Email
            </h2>
            <p className="text-jade-sage">
              Beautiful consciousness architecture announcement with jade temple design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={sendNewsletterPreview}
              disabled={sending || !stats || stats.beta_testers === 0}
              className="bg-jade-shadow/50 border border-jade-sage/50 text-jade-light px-6 py-4 rounded-xl font-semibold
                hover:bg-jade-shadow hover:border-jade-sage transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3"
            >
              <BarChart3 className="w-5 h-5" />
              Preview Newsletter
            </button>

            <button
              onClick={sendNewsletter}
              disabled={sending || !stats || stats.beta_testers === 0}
              className="bg-gradient-to-r from-purple-600 to-jade-sage text-white px-6 py-4 rounded-xl font-semibold text-lg
                hover:from-purple-500 hover:to-jade-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3 shadow-lg shadow-purple-900/50"
            >
              <SendHorizonal className={`w-5 h-5 ${sending ? 'animate-pulse' : ''}`} />
              {sending ? 'Sending to Consciousness Field...' : `Send to ${stats?.beta_testers || 0} Beta Testers`}
            </button>
          </div>

          <div className="mt-6 p-4 bg-jade-shadow/30 border border-jade-sage/30 rounded-lg">
            <p className="text-jade-sage text-sm">
              <strong className="text-jade-light">Template:</strong> Consciousness Revolution Announcement
              <br />
              <strong className="text-jade-light">Features:</strong> Professional jade temple design, platform features, Telegram invitation, Kelly's contact
              <br />
              <strong className="text-jade-light">From:</strong> Kelly Nezat &lt;kelly@soullab.life&gt;
            </p>
          </div>
        </motion.div>

        {/* Stats Summary */}
        {stats && stats.total_emails_sent > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-jade-shadow/30 border border-jade-sage/30 rounded-xl p-6 text-center"
          >
            <Mail className="w-8 h-8 text-jade-sage mx-auto mb-3" />
            <p className="text-jade-light text-lg">
              <span className="font-bold text-2xl text-jade-sage">{stats.total_emails_sent}</span>
              {' '}consciousness messages delivered through the field
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses = {
    jade: 'from-jade-sage/20 to-jade-mineral/20 border-jade-sage/40 text-jade-light',
    green: 'from-green-900/20 to-green-800/20 border-green-600/40 text-green-300',
    purple: 'from-purple-900/20 to-purple-800/20 border-purple-600/40 text-purple-300',
    blue: 'from-blue-900/20 to-blue-800/20 border-blue-600/40 text-blue-300'
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${colorClasses} backdrop-blur-sm border rounded-xl p-6`}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-semibold">{label}</h3>
      </div>
      <p className="text-4xl font-bold">{value}</p>
    </motion.div>
  );
}
