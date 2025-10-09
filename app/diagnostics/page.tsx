'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, TrendingUp, Pause, Play, AlertCircle, Zap } from 'lucide-react';

interface TimingMetric {
  timestamp: string;
  user: string;
  session: string;
  silence_ms: number;
  latency_ms: number;
  response_ms: number;
  total_ms: number;
  transcript_preview?: string;
  response_preview?: string;
}

interface AggregateStats {
  avgSilence: number;
  avgLatency: number;
  avgResponse: number;
  avgTotal: number;
  minSilence: number;
  maxSilence: number;
  count: number;
}

export default function DiagnosticsPage() {
  const [metrics, setMetrics] = useState<TimingMetric[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aggregateStats, setAggregateStats] = useState<AggregateStats | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<TimingMetric | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (isPaused) return;

    const connectToStream = () => {
      eventSourceRef.current = new EventSource('/api/diagnostics/timing');

      eventSourceRef.current.onopen = () => {
        setIsConnected(true);
        console.log('📊 Connected to timing diagnostics stream');
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'initial') {
            // Load initial metrics
            setMetrics(data.metrics || []);
          } else {
            // Add new metric
            setMetrics(prev => [data, ...prev].slice(0, 50)); // Keep last 50
          }
        } catch (error) {
          console.error('Error parsing timing data:', error);
        }
      };

      eventSourceRef.current.onerror = () => {
        setIsConnected(false);
        console.error('❌ Lost connection to timing stream');

        // Reconnect after 5 seconds
        setTimeout(connectToStream, 5000);
      };
    };

    connectToStream();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isPaused]);

  // Calculate aggregate statistics
  useEffect(() => {
    if (metrics.length === 0) {
      setAggregateStats(null);
      return;
    }

    const stats: AggregateStats = {
      avgSilence: metrics.reduce((sum, m) => sum + m.silence_ms, 0) / metrics.length,
      avgLatency: metrics.reduce((sum, m) => sum + m.latency_ms, 0) / metrics.length,
      avgResponse: metrics.reduce((sum, m) => sum + m.response_ms, 0) / metrics.length,
      avgTotal: metrics.reduce((sum, m) => sum + m.total_ms, 0) / metrics.length,
      minSilence: Math.min(...metrics.map(m => m.silence_ms)),
      maxSilence: Math.max(...metrics.map(m => m.silence_ms)),
      count: metrics.length
    };

    setAggregateStats(stats);
  }, [metrics]);

  // Color coding for timing values
  const getTimingColor = (value: number, type: 'silence' | 'latency' | 'response' | 'total') => {
    const thresholds = {
      silence: { good: 800, warning: 1500, bad: 2500 },
      latency: { good: 500, warning: 1000, bad: 2000 },
      response: { good: 2000, warning: 4000, bad: 6000 },
      total: { good: 3000, warning: 5000, bad: 8000 }
    };

    const t = thresholds[type];
    if (value < t.good) return 'text-green-500';
    if (value < t.warning) return 'text-yellow-500';
    if (value < t.bad) return 'text-orange-500';
    return 'text-red-500';
  };

  // Format milliseconds for display
  const formatMs = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-ain-soph-amber" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MAIA Timing Diagnostics
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-4 py-2 bg-ain-soph-blue/50 border border-ain-soph-gold/50 rounded-lg hover:bg-ain-soph-gold/30 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Aggregate Stats */}
        {aggregateStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-900/20 border border-ain-soph-gold/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Avg Silence</span>
                <Clock className="w-4 h-4 text-ain-soph-amber" />
              </div>
              <div className={`text-2xl font-bold ${getTimingColor(aggregateStats.avgSilence, 'silence')}`}>
                {formatMs(aggregateStats.avgSilence)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatMs(aggregateStats.minSilence)} - {formatMs(aggregateStats.maxSilence)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Avg Latency</span>
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div className={`text-2xl font-bold ${getTimingColor(aggregateStats.avgLatency, 'latency')}`}>
                {formatMs(aggregateStats.avgLatency)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-900/20 border border-green-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Avg Response</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className={`text-2xl font-bold ${getTimingColor(aggregateStats.avgResponse, 'response')}`}>
                {formatMs(aggregateStats.avgResponse)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Sample Count</span>
                <Activity className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl font-bold text-pink-400">
                {aggregateStats.count}
              </div>
            </motion.div>
          </div>
        )}

        {/* Live Metrics Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-900/80 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400">Time</th>
                  <th className="px-4 py-3 text-left text-gray-400">User</th>
                  <th className="px-4 py-3 text-right text-gray-400">Silence</th>
                  <th className="px-4 py-3 text-right text-gray-400">Latency</th>
                  <th className="px-4 py-3 text-right text-gray-400">Response</th>
                  <th className="px-4 py-3 text-right text-gray-400">Total</th>
                  <th className="px-4 py-3 text-left text-gray-400">Preview</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {metrics.map((metric, index) => (
                    <motion.tr
                      key={`${metric.timestamp}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => setSelectedMetric(metric)}
                    >
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {metric.user?.substring(0, 8)}...
                      </td>
                      <td className={`px-4 py-3 text-right font-mono ${getTimingColor(metric.silence_ms, 'silence')}`}>
                        {formatMs(metric.silence_ms)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono ${getTimingColor(metric.latency_ms, 'latency')}`}>
                        {formatMs(metric.latency_ms)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono ${getTimingColor(metric.response_ms, 'response')}`}>
                        {formatMs(metric.response_ms)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono ${getTimingColor(metric.total_ms, 'total')}`}>
                        {formatMs(metric.total_ms)}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">
                        {metric.transcript_preview || metric.response_preview || '-'}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {metrics.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Waiting for timing data...</p>
                <p className="text-sm mt-2">Start a conversation with MAIA to see metrics</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail View Modal */}
        <AnimatePresence>
          {selectedMetric && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMetric(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">Timing Details</h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-400">Timestamp</span>
                      <p className="text-white">{new Date(selectedMetric.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Session</span>
                      <p className="text-white font-mono text-xs">{selectedMetric.session}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-400">Silence</span>
                      <p className={`text-xl font-bold ${getTimingColor(selectedMetric.silence_ms, 'silence')}`}>
                        {formatMs(selectedMetric.silence_ms)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Latency</span>
                      <p className={`text-xl font-bold ${getTimingColor(selectedMetric.latency_ms, 'latency')}`}>
                        {formatMs(selectedMetric.latency_ms)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Response</span>
                      <p className={`text-xl font-bold ${getTimingColor(selectedMetric.response_ms, 'response')}`}>
                        {formatMs(selectedMetric.response_ms)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Total</span>
                      <p className={`text-xl font-bold ${getTimingColor(selectedMetric.total_ms, 'total')}`}>
                        {formatMs(selectedMetric.total_ms)}
                      </p>
                    </div>
                  </div>

                  {selectedMetric.transcript_preview && (
                    <div>
                      <span className="text-sm text-gray-400">User Input</span>
                      <p className="text-white mt-1 p-3 bg-gray-800/50 rounded">
                        {selectedMetric.transcript_preview}
                      </p>
                    </div>
                  )}

                  {selectedMetric.response_preview && (
                    <div>
                      <span className="text-sm text-gray-400">MAIA Response</span>
                      <p className="text-white mt-1 p-3 bg-gray-800/50 rounded">
                        {selectedMetric.response_preview}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedMetric(null)}
                  className="mt-6 px-4 py-2 bg-ain-soph-blue/50 border border-ain-soph-gold/50 rounded-lg hover:bg-ain-soph-gold/30 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}