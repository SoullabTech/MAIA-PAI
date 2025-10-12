'use client';

/**
 * Spiralogic Signal Dashboard
 *
 * Shows what's ready to build next based on actual usage signals.
 * Check this weekly instead of calendar scheduling.
 *
 * The system tells you what it needs.
 */

import { useEffect, useState } from 'react';

interface Signal {
  name: string;
  description: string;
  status: 'ready' | 'in-progress' | 'waiting';
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
  nextSteps?: string[];
  daysUntilCheck?: number;
}

export default function SignalDashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API that runs actual database queries
    // For now, mock data to show the structure
    setSignals([
      {
        name: 'Typography Refresh',
        description: 'Phase 1 deployment and monitoring',
        status: 'in-progress',
        progress: {
          current: 3,
          target: 7,
          unit: 'days monitored'
        },
        nextSteps: [
          'Continue monitoring for 4 more days',
          'Check qualitative feedback',
          'Review metrics: session duration, messages/convo, return rate'
        ],
        daysUntilCheck: 4
      },
      {
        name: 'Insight Tracking Ready',
        description: 'Turn on UnifiedInsightEngine background processing',
        status: 'waiting',
        progress: {
          current: 7,
          target: 10,
          unit: 'active journalers'
        },
        nextSteps: [
          'Need 3 more active journal users',
          'Need 15 more journal entries (15/30)',
          'Need 20 more deep conversations (30/50)'
        ]
      },
      {
        name: 'Constellation View',
        description: 'Visual insight mapping',
        status: 'waiting',
        progress: {
          current: 0,
          target: 5,
          unit: 'user requests'
        },
        nextSteps: [
          'Wait for user questions about "seeing connections"',
          'Wait for 50+ insights tracked',
          'Wait for 10+ converging insights',
          'Don\'t build until signal is clear'
        ]
      },
      {
        name: 'Seasonal Palettes',
        description: 'Optional enhancement for personalization',
        status: 'waiting',
        progress: {
          current: 0,
          target: 1,
          unit: 'user request'
        },
        nextSteps: [
          'Optional: Deploy when typography is stable (1+ month)',
          'Only if users ask for color customization',
          'Low priority - nice to have'
        ]
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
        <div className="text-amber-400">Loading signals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-amber-400 mb-4">
            🜃 Spiralogic Signal Dashboard
          </h1>
          <p className="text-white/70 text-lg">
            The system tells you what it needs. Check weekly instead of calendar scheduling.
          </p>
          <p className="text-white/50 text-sm mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="space-y-6">
          {signals.map((signal, idx) => (
            <SignalCard key={idx} signal={signal} />
          ))}
        </div>

        <footer className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-amber-400 font-semibold mb-3">💎 Core Principle</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Build when the field asks. Wait when it's quiet. These aren't deadlines — they're
            <strong className="text-amber-300"> thresholds</strong>. The system will cross them
            naturally if the work is resonating. Your job isn't to schedule. Your job is to
            <strong className="text-amber-300"> notice when thresholds are crossed</strong>.
          </p>
        </footer>

        <div className="mt-8 text-center">
          <a
            href="/NEXT_MOVES.md"
            className="text-cyan-400 hover:text-cyan-300 text-sm underline"
          >
            Read full NEXT_MOVES.md documentation →
          </a>
        </div>
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  const statusColors = {
    ready: 'bg-green-500/20 border-green-500/50 text-green-300',
    'in-progress': 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300',
    waiting: 'bg-amber-500/20 border-amber-500/50 text-amber-300'
  };

  const statusIcons = {
    ready: '✅',
    'in-progress': '🔄',
    waiting: '⏳'
  };

  const progressPercent = signal.progress
    ? Math.round((signal.progress.current / signal.progress.target) * 100)
    : 0;

  return (
    <div className={`p-6 rounded-xl border-2 ${statusColors[signal.status]}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{statusIcons[signal.status]}</span>
            <h2 className="text-xl font-semibold">{signal.name}</h2>
          </div>
          <p className="text-white/70 text-sm">{signal.description}</p>
        </div>
        {signal.daysUntilCheck && (
          <div className="text-right">
            <div className="text-xs text-white/50">Check in</div>
            <div className="text-lg font-semibold">{signal.daysUntilCheck}d</div>
          </div>
        )}
      </div>

      {signal.progress && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progress</span>
            <span className="font-semibold">
              {signal.progress.current} / {signal.progress.target} {signal.progress.unit}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-current transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-white/50 mt-1">
            {progressPercent}% complete
          </div>
        </div>
      )}

      {signal.nextSteps && signal.nextSteps.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-white/80">Next Steps:</h3>
          <ul className="space-y-1">
            {signal.nextSteps.map((step, idx) => (
              <li key={idx} className="text-sm text-white/60 flex items-start gap-2">
                <span className="text-white/40">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {signal.status === 'ready' && (
        <div className="mt-4 pt-4 border-t border-current">
          <p className="text-sm font-semibold">🎯 Ready to build! Check NEXT_MOVES.md for implementation steps.</p>
        </div>
      )}
    </div>
  );
}
