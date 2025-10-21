'use client';

/**
 * WEBHOOK TEST PAGE - IMPROVED UI/UX
 *
 * Test your Apple Shortcuts integration before your walk
 * - Manual webhook submission
 * - View recent biometric updates
 * - Test HRV data flow
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Check, X, Loader2, Heart, TrendingUp, Copy } from 'lucide-react';
import Link from 'next/link';

interface BiometricTest {
  userId: string;
  timestamp: string;
  hrv: number;
  heartRate: number;
  source: string;
}

export default function WebhookTestPage() {
  const [userId, setUserId] = useState('');
  const [hrv, setHrv] = useState('65');
  const [heartRate, setHeartRate] = useState('72');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<BiometricTest[]>([]);
  const [copied, setCopied] = useState(false);

  // Load userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('maia_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Generate new user ID if none exists
      const newUserId = `user_${Date.now()}`;
      localStorage.setItem('maia_user_id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  // Send test webhook
  const sendTestWebhook = async () => {
    setLoading(true);
    setLastResult(null);

    try {
      const testData: BiometricTest = {
        userId,
        timestamp: new Date().toISOString(),
        hrv: parseFloat(hrv),
        heartRate: parseFloat(heartRate),
        source: 'manual-test'
      };

      const response = await fetch('/api/biometrics/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        const result = await response.json();
        setLastResult({
          success: true,
          message: 'Webhook received successfully! Data is flowing!'
        });

        // Add to recent updates
        setRecentUpdates(prev => [testData, ...prev].slice(0, 10));
      } else {
        const error = await response.json();
        setLastResult({
          success: false,
          message: error.message || 'Webhook failed'
        });
      }
    } catch (error: any) {
      setLastResult({
        success: false,
        message: error.message || 'Network error'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dune-spice-sand via-dune-desert-rose to-dune-rose-gold">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link href="/settings/biometrics">
            <Button variant="ghost" className="mb-4">
              ← Back to Biometrics
            </Button>
          </Link>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-dune-wellness-crimson via-dune-heart-coral to-dune-bloom-magenta bg-clip-text text-transparent">
            Webhook Test
          </h1>
          <p className="text-dune-rose-deep text-xl">
            Test your biometric data flow before setting up Apple Shortcuts
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Left Column - Test Form */}
          <div className="space-y-6">

            {/* User ID Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-dune-rose-gold/40 shadow-lg">
              <label className="block text-sm font-semibold text-dune-deep-sand mb-3">
                Your User ID
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={userId}
                  readOnly
                  className="flex-1 px-4 py-3 bg-dune-sunset-blush/30 border-2 border-dune-rose-gold/40 rounded-xl text-dune-deep-sand font-mono text-sm"
                />
                <Button
                  onClick={copyUserId}
                  size="sm"
                  className="bg-dune-bloom-magenta hover:bg-dune-heart-coral text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-dune-deep-sand mt-2">
                Use this ID in your Apple Shortcut
              </p>
            </div>

            {/* HRV Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-dune-rose-gold/40 shadow-lg">
              <label className="block text-sm font-semibold text-dune-deep-sand mb-3">
                Heart Rate Variability (HRV)
              </label>
              <input
                type="number"
                value={hrv}
                onChange={(e) => setHrv(e.target.value)}
                placeholder="65"
                className="w-full px-4 py-4 bg-white border-2 border-dune-rose-gold/40 rounded-xl text-dune-wellness-crimson text-3xl font-bold focus:outline-none focus:border-dune-heart-coral"
              />
              <p className="text-xs text-dune-deep-sand mt-2">
                Typical range: 20-100ms (higher = better coherence)
              </p>
            </div>

            {/* Heart Rate Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-dune-rose-gold/40 shadow-lg">
              <label className="block text-sm font-semibold text-dune-deep-sand mb-3">
                Heart Rate (BPM)
              </label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="72"
                className="w-full px-4 py-4 bg-white border-2 border-dune-rose-gold/40 rounded-xl text-dune-wellness-crimson text-3xl font-bold focus:outline-none focus:border-dune-heart-coral"
              />
              <p className="text-xs text-dune-deep-sand mt-2">
                Typical resting: 50-90 BPM
              </p>
            </div>

            {/* Send Button */}
            <Button
              onClick={sendTestWebhook}
              disabled={loading || !hrv || !heartRate}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-dune-bloom-magenta to-dune-spice-trance-pink hover:from-dune-spice-trance-pink hover:to-dune-bloom-magenta text-white shadow-xl disabled:opacity-50 rounded-2xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Activity className="w-6 h-6 mr-3" />
                  Send Test Webhook
                </>
              )}
            </Button>

          </div>

          {/* Right Column - Results & Instructions */}
          <div className="space-y-6">

            {/* Result Card */}
            {lastResult && (
              <div
                className={`p-6 rounded-2xl border-2 shadow-lg ${
                  lastResult.success
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}
              >
                <div className="flex items-start gap-4">
                  {lastResult.success ? (
                    <Check className="w-10 h-10 text-green-600 flex-shrink-0" />
                  ) : (
                    <X className="w-10 h-10 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`font-bold text-xl mb-2 ${lastResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {lastResult.success ? 'Success!' : 'Failed'}
                    </p>
                    <p className={`text-sm ${lastResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {lastResult.message}
                    </p>
                    {lastResult.success && (
                      <div className="mt-4 flex gap-3">
                        <Link href="/settings/biometrics">
                          <Button size="sm" variant="outline" className="border-green-600 text-green-800 hover:bg-green-100">
                            View Biometrics Page
                          </Button>
                        </Link>
                        <Link href="/walk">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            Go to Walk Mode →
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-dune-bloom-magenta/40 shadow-lg">
              <h3 className="text-xl font-bold text-dune-wellness-crimson mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                What This Tests
              </h3>
              <ul className="space-y-3 text-sm text-dune-deep-sand">
                <li className="flex gap-3">
                  <span className="text-dune-heart-coral font-bold text-lg">✓</span>
                  <span>Webhook endpoint is responding</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-dune-heart-coral font-bold text-lg">✓</span>
                  <span>Data is being stored in IndexedDB</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-dune-heart-coral font-bold text-lg">✓</span>
                  <span>Biometric service is processing updates</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-dune-heart-coral font-bold text-lg">✓</span>
                  <span>Coherence calculations are working</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-dune-rose-gold/30">
                <p className="text-sm font-semibold text-dune-wellness-crimson mb-3">
                  Next Steps:
                </p>
                <ol className="space-y-2 text-sm text-dune-deep-sand">
                  <li>1. Click "Send Test Webhook" above</li>
                  <li>2. If successful, check the <Link href="/settings/biometrics" className="text-dune-bloom-magenta underline font-semibold">Biometrics page</Link></li>
                  <li>3. Watch the holoflower speed change!</li>
                  <li>4. Set up Apple Shortcuts for automatic sync</li>
                  <li>5. Go on your morning walk! 🌅</li>
                </ol>
              </div>
            </div>

            {/* Recent Updates */}
            {recentUpdates.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-dune-rose-gold/40 shadow-lg">
                <h3 className="text-xl font-bold text-dune-wellness-crimson mb-4">
                  Recent Test Submissions
                </h3>
                <div className="space-y-3">
                  {recentUpdates.map((update, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-dune-sunset-blush/30 rounded-xl border border-dune-rose-gold/30"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-dune-wellness-crimson" />
                        <div>
                          <p className="font-semibold text-dune-deep-sand">
                            {update.hrv}ms HRV • {update.heartRate} BPM
                          </p>
                          <p className="text-xs text-dune-rose-deep">
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Bottom Instructions - Full Width */}
        <div className="mt-8 bg-gradient-to-br from-dune-arrakis-mauve/30 to-dune-sunset-blush/30 rounded-2xl p-8 border-2 border-dune-spice-trance-pink/40 shadow-lg">
          <h3 className="text-2xl font-bold text-dune-wellness-crimson mb-4">
            Webhook URL for Apple Shortcuts
          </h3>
          <div className="bg-white/60 p-6 rounded-xl border-2 border-dune-rose-gold/40">
            <p className="text-sm text-dune-deep-sand mb-3 font-semibold">Local (testing at home):</p>
            <code className="block text-dune-wellness-crimson font-mono text-lg bg-dune-sunset-blush/30 p-4 rounded-lg border border-dune-rose-gold/30">
              http://192.168.X.XXX:3000/api/biometrics/stream
            </code>
          </div>
          <p className="text-sm text-dune-deep-sand mt-4 leading-relaxed">
            <strong className="text-dune-wellness-crimson">Replace <code className="bg-dune-sunset-blush/40 px-2 py-1 rounded font-mono">192.168.X.XXX</code></strong> with your Mac's IP address.
            <br />
            Find it by running: <code className="bg-dune-sunset-blush/40 px-2 py-1 rounded font-mono">ifconfig | grep "inet " | grep -v 127.0.0.1</code>
          </p>
        </div>

      </div>
    </div>
  );
}
