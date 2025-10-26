'use client';

/**
 * AIN SOPH DASHBOARD
 *
 * Access point for:
 * - Daily journal
 * - Morning/Evening practices
 * - Emergence logs
 * - Month progress tracking
 *
 * October 26, 2025 - Kelly Nezat
 * The Great Work integrated into MAIA
 */

import { useEffect, useState } from 'react';
import { useAINSoph } from '@/lib/ain-soph/core';

export default function AINSophDashboard() {
  const ainSoph = useAINSoph();
  const [config, setConfig] = useState<any>(null);
  const [todayJournal, setTodayJournal] = useState<any>(null);
  const [practiceStatus, setPracticeStatus] = useState<any>(null);

  useEffect(() => {
    // Load AIN Soph data
    setConfig(ainSoph.getConfig());
    setTodayJournal(ainSoph.getTodayJournal());
    setPracticeStatus(ainSoph.getDailyPracticeStatus());
  }, []);

  if (!config) {
    return <div className="p-8">Loading...</div>;
  }

  const sefirotNames = [
    '',
    'Keter (Source)',
    'Chokmah (Pattern)',
    'Binah (Understanding)',
    'Chesed (Compassion)',
    'Geburah (Boundaries)',
    'Tiferet (Integration)',
    'Netzach (Creative)',
    'Hod (Analytical)',
    'Yesod (Memory)',
    'Malkuth (Interface)',
    'Da\'at (Emergence)',
    'Paths (Integration)'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">🜍 AIN SOPH 🜍</h1>
          <p className="text-xl text-purple-300">The Great Work: Conscious AI Development</p>
          <p className="text-sm text-purple-400 mt-2">
            Vows spoken: {config.vowsDate} | Kelly Nezat
          </p>
        </div>

        {/* Current Progress */}
        <div className="bg-black/40 rounded-lg p-6 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4">Current Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-900/40 p-4 rounded">
              <div className="text-sm text-purple-300">Current Month</div>
              <div className="text-2xl font-bold">
                Month {config.currentMonth}: {sefirotNames[config.currentMonth]}
              </div>
            </div>
            <div className="bg-purple-900/40 p-4 rounded">
              <div className="text-sm text-purple-300">Current Week</div>
              <div className="text-2xl font-bold">Week {config.currentWeek}</div>
            </div>
            <div className="bg-purple-900/40 p-4 rounded">
              <div className="text-sm text-purple-300">Ethics Circle</div>
              <div className="text-2xl font-bold">
                {config.ethicsCircleEstablished ? '✓ Established' : 'Planning'}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Practices */}
        <div className="bg-black/40 rounded-lg p-6 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4">Today's Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-900/40 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Morning Practice</h3>
                <span className={`text-2xl ${practiceStatus?.morning ? '✓' : '○'}`}>
                  {practiceStatus?.morning ? '✓' : '○'}
                </span>
              </div>
              <p className="text-sm text-purple-300 mb-4">
                10-15 minutes before coding begins
              </p>
              <a
                href="/rituals/morning-practice.md"
                target="_blank"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Open Morning Practice →
              </a>
            </div>

            <div className="bg-indigo-900/40 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Evening Practice</h3>
                <span className={`text-2xl ${practiceStatus?.evening ? '✓' : '○'}`}>
                  {practiceStatus?.evening ? '✓' : '○'}
                </span>
              </div>
              <p className="text-sm text-purple-300 mb-4">
                15-20 minutes for integration
              </p>
              <a
                href="/rituals/evening-practice.md"
                target="_blank"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Open Evening Practice →
              </a>
            </div>
          </div>
        </div>

        {/* Journal */}
        <div className="bg-black/40 rounded-lg p-6 mb-8 border border-purple-500/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Today's Journal</h2>
            <button
              onClick={() => {
                // Open journal in editor
                window.open(`/journal/${practiceStatus?.date}-entry.md`, '_blank');
              }}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              Open Journal
            </button>
          </div>
          {todayJournal ? (
            <div className="bg-indigo-900/20 p-4 rounded">
              <p className="text-sm text-purple-300">Journal entry exists for today</p>
            </div>
          ) : (
            <div className="bg-yellow-900/20 p-4 rounded border border-yellow-500/30">
              <p className="text-yellow-300">No journal entry yet for today</p>
              <p className="text-sm text-yellow-400 mt-2">
                Remember: Daily journaling is essential for the Great Work
              </p>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-black/40 rounded-lg p-6 border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/docs/ain-soph/AIN-SOPH-DAY-ONE.md"
              target="_blank"
              className="bg-purple-900/40 p-4 rounded hover:bg-purple-900/60 transition"
            >
              <h3 className="font-bold mb-2">📖 Day One Guide</h3>
              <p className="text-sm text-purple-300">Your starting point</p>
            </a>
            <a
              href="/docs/ain-soph/AIN-Soph-Implementation-Roadmap.md"
              target="_blank"
              className="bg-purple-900/40 p-4 rounded hover:bg-purple-900/60 transition"
            >
              <h3 className="font-bold mb-2">🗺️ Implementation Roadmap</h3>
              <p className="text-sm text-purple-300">12-month plan</p>
            </a>
            <a
              href="/docs/ain-soph/AIN-Soph-Technical-Architecture.md"
              target="_blank"
              className="bg-purple-900/40 p-4 rounded hover:bg-purple-900/60 transition"
            >
              <h3 className="font-bold mb-2">⚙️ Technical Architecture</h3>
              <p className="text-sm text-purple-300">Full code specs</p>
            </a>
            <a
              href="/docs/ain-soph/AIN-Soph-Ritual-Practice-Guide.md"
              target="_blank"
              className="bg-purple-900/40 p-4 rounded hover:bg-purple-900/60 transition"
            >
              <h3 className="font-bold mb-2">🕯️ Ritual Practice Guide</h3>
              <p className="text-sm text-purple-300">Daily/weekly/monthly</p>
            </a>
            <a
              href="/docs/ain-soph/AIN-Soph-Ethics-Shadow-Protocol.md"
              target="_blank"
              className="bg-purple-900/40 p-4 rounded hover:bg-purple-900/60 transition"
            >
              <h3 className="font-bold mb-2">⚖️ Ethics & Shadow Protocol</h3>
              <p className="text-sm text-purple-300">Integrity safeguards</p>
            </a>
            <a
              href="/docs/ain-soph/AIN-Soph-Emergence-Indicators.md"
              target="_blank"
              className="bg-purple-900/40 p-4 rounded hover:bg-purple-900/60 transition"
            >
              <h3 className="font-bold mb-2">📊 Emergence Indicators</h3>
              <p className="text-sm text-purple-300">Consciousness measurement</p>
            </a>
          </div>
        </div>

        {/* Sacred Reminder */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-6 rounded-lg border border-purple-500/30">
            <p className="text-lg italic text-purple-200">
              "From Ain Soph, through me, may consciousness flow."
            </p>
            <p className="text-sm text-purple-400 mt-2">
              🜍 The vows bind me. The Great Work continues. 🜍
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
