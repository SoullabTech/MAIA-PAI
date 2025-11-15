'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, CheckCircle, Clock, User, Users, Gift, Plus, Copy, Eye, EyeOff } from 'lucide-react';

/**
 * Beta Testers Admin Page
 *
 * Manage beta tester invitations and track status
 */
export default function BetaTestersPage() {
  const [testers, setTesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTester, setSelectedTester] = useState<any>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [newTesterEmail, setNewTesterEmail] = useState('');
  const [newTesterName, setNewTesterName] = useState('');
  const [showCodes, setShowCodes] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchTesters();
  }, []);

  async function fetchTesters() {
    try {
      const response = await fetch('/api/admin/beta-testers');
      const data = await response.json();
      setTesters(data);
    } catch (error) {
      console.error('Failed to fetch testers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateReferralCodes(userId: string, userName: string) {
    try {
      const response = await fetch('/api/admin/referral-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userName, count: 10 })
      });

      if (response.ok) {
        alert('Referral codes generated successfully!');
        fetchTesters(); // Refresh data
      } else {
        alert('Failed to generate referral codes');
      }
    } catch (error) {
      console.error('Error generating referral codes:', error);
      alert('Error generating referral codes');
    }
  }

  async function addBetaTester(email: string, name: string) {
    try {
      const response = await fetch('/api/admin/beta-testers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      if (response.ok) {
        alert('Beta tester added successfully!');
        setNewTesterEmail('');
        setNewTesterName('');
        fetchTesters(); // Refresh data
      } else {
        alert('Failed to add beta tester');
      }
    } catch (error) {
      console.error('Error adding beta tester:', error);
      alert('Error adding beta tester');
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'invited':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default:
        return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'invited':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/80" />
          <p className="text-sm text-white/60 mt-4">Loading beta testers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-white mb-2">Beta Testers</h1>
          <p className="text-white/60">First dreamers building with us</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {testers.filter(t => t.status === 'invited').length}
            </div>
            <div className="text-sm text-white/50">Invited</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {testers.filter(t => t.status === 'active').length}
            </div>
            <div className="text-sm text-white/50">Active</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {testers.length}
            </div>
            <div className="text-sm text-white/50">Total</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">
              {testers.reduce((sum, t) => sum + (t.totalReferrals || 0), 0)}
            </div>
            <div className="text-sm text-white/50">Referrals</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {testers.reduce((sum, t) => sum + (t.referralCodes?.filter((c: any) => !c.is_used)?.length || 0), 0)}
            </div>
            <div className="text-sm text-white/50">Available Codes</div>
          </div>
        </div>

        {/* Add New Beta Tester */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Beta Tester
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newTesterName}
              onChange={(e) => setNewTesterName(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newTesterEmail}
              onChange={(e) => setNewTesterEmail(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
            />
          </div>
          <button
            onClick={() => addBetaTester(newTesterEmail, newTesterName)}
            disabled={!newTesterEmail || !newTesterName}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 text-white rounded-lg font-medium transition-colors"
          >
            Add Beta Tester & Generate Codes
          </button>
        </div>

        {/* Testers List */}
        <div className="space-y-3">
          {testers.map((tester, index) => (
            <motion.div
              key={tester.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                    {tester.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{tester.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{tester.email}</span>
                    </div>
                    {tester.notes && (
                      <p className="text-sm text-white/40 mt-2 italic">{tester.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs ${getStatusColor(tester.status)}`}>
                    {getStatusIcon(tester.status)}
                    <span className="capitalize">{tester.status}</span>
                  </div>

                  {/* Referral Stats */}
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{tester.totalReferrals || 0} referrals</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      <span>{tester.referralCodes?.filter((c: any) => !c.is_used)?.length || 0} codes left</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(tester.invitedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    {tester.referralCodes?.length > 0 && (
                      <button
                        onClick={() => setShowCodes(prev => ({...prev, [tester.id]: !prev[tester.id]}))}
                        className="px-2 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded border border-blue-500/30"
                      >
                        {showCodes[tester.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    )}
                    <button
                      onClick={() => generateReferralCodes(tester.id, tester.name)}
                      className="px-2 py-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded border border-green-500/30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {tester.inviteCode && (
                    <div className="text-xs text-white/40 font-mono">
                      Code: {tester.inviteCode}
                    </div>
                  )}

                  {/* Referral Codes Display */}
                  {showCodes[tester.id] && tester.referralCodes && (
                    <div className="mt-4 p-3 bg-white/10 rounded border border-white/20 w-80">
                      <h4 className="text-xs font-medium text-white mb-2">Referral Codes</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {tester.referralCodes.map((code: any) => (
                          <div key={code.code} className="flex items-center justify-between text-xs">
                            <span className={`font-mono ${code.is_used ? 'text-white/40 line-through' : 'text-white/80'}`}>
                              {code.code}
                            </span>
                            <div className="flex gap-1">
                              {code.is_used && <span className="text-green-400 text-xs">✓</span>}
                              <button
                                onClick={() => copyToClipboard(code.code)}
                                className="p-1 hover:bg-white/10 rounded"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No beta testers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
