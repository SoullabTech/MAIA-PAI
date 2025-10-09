'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Settings, BarChart, Zap, SlidersHorizontal } from 'lucide-react';
import { timingService } from '@/lib/services/timingMiddleware';

interface TimingControlsProps {
  compact?: boolean;
  onOpenDiagnostics?: () => void;
}

export const TimingControls: React.FC<TimingControlsProps> = ({
  compact = false,
  onOpenDiagnostics
}) => {
  const [config, setConfig] = useState(timingService.getConfig());
  const [isOpen, setIsOpen] = useState(false);

  const updateConfig = (updates: Partial<typeof config>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    timingService.configure(updates);
  };

  if (compact) {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
        title="Timing Controls"
      >
        <Clock className="w-5 h-5 text-purple-400" />
        {config.pauseBufferEnabled && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
      >
        <Clock className="w-5 h-5 text-purple-400" />
        <span className="text-sm text-purple-300">Timing</span>
        {config.pauseBufferEnabled && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Timing Controls
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Adaptive Pause */}
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Adaptive Pause</span>
                    <input
                      type="checkbox"
                      checked={config.pauseBufferEnabled}
                      onChange={(e) => updateConfig({ pauseBufferEnabled: e.target.checked })}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Learn and adapt to your conversation rhythm
                  </p>
                </div>

                {/* Min Silence Duration */}
                <div>
                  <label className="text-sm text-gray-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Min Silence: {config.minSilenceDuration}ms
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={config.minSilenceDuration}
                    onChange={(e) => updateConfig({ minSilenceDuration: Number(e.target.value) })}
                    className="w-full mt-2"
                  />
                </div>

                {/* Max Silence Duration */}
                <div>
                  <label className="text-sm text-gray-300 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                    Max Silence: {config.maxSilenceDuration}ms
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="5000"
                    step="100"
                    value={config.maxSilenceDuration}
                    onChange={(e) => updateConfig({ maxSilenceDuration: Number(e.target.value) })}
                    className="w-full mt-2"
                  />
                </div>

                {/* Learning Rate */}
                <div>
                  <label className="text-sm text-gray-300">
                    Learning Rate: {(config.adaptiveLearningRate * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.adaptiveLearningRate * 100}
                    onChange={(e) => updateConfig({ adaptiveLearningRate: Number(e.target.value) / 100 })}
                    className="w-full mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How quickly MAIA adapts to your timing preferences
                  </p>
                </div>

                {/* Console Logging */}
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Console Logging</span>
                    <input
                      type="checkbox"
                      checked={config.logToConsole}
                      onChange={(e) => updateConfig({ logToConsole: e.target.checked })}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Log timing metrics to browser console
                  </p>
                </div>

                {/* Diagnostics Link */}
                <button
                  onClick={() => {
                    window.open('/diagnostics', '_blank');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <BarChart className="w-4 h-4" />
                  Open Diagnostics Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};