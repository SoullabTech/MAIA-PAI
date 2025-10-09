'use client';

import { useState } from 'react';
import { CollectivePulse } from '@/components/collective/CollectivePulse';
import { detectBreakthrough } from '@/lib/utils/breakthroughDetection';

export default function CollectivePulseDemo() {
  const [breakthrough, setBreakthrough] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const breakthroughExamples = [
    "I finally realize I've been running from myself all this time",
    "I'm ready to let go of the pain I've been holding",
    "Tears streaming down as I accept who I truly am",
    "My shadow isn't something to fear - it's part of my wholeness",
    "I feel this infinite space opening inside me",
    "I love myself, even the parts I've rejected",
    "What if I'm already complete, already whole?",
    "I surrender to the truth of who I am"
  ];

  const regularExamples = [
    "How's the weather today?",
    "Tell me about my progress",
    "What should I do next?",
    "I'm feeling okay"
  ];

  const triggerBreakthrough = (text: string) => {
    setLastMessage(text);
    const result = detectBreakthrough(text);
    setAnalysis(result);

    if (result.isBreakthrough) {
      setBreakthrough(true);
      setTimeout(() => setBreakthrough(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-800 to-purple-900/20 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-yellow-500/80 tracking-wide">
            CollectivePulse Demo
          </h1>
          <p className="text-sm text-white/40">
            A whisper from the field
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm text-white/60 mb-3 uppercase tracking-wider">
              Breakthrough Examples (Depth &gt; 0.85)
            </h2>
            <div className="space-y-2">
              {breakthroughExamples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => triggerBreakthrough(example)}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left text-sm text-white/70 transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm text-white/60 mb-3 uppercase tracking-wider">
              Regular Messages (Won't trigger)
            </h2>
            <div className="space-y-2">
              {regularExamples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => triggerBreakthrough(example)}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left text-sm text-white/70 transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm text-white/60 mb-3 uppercase tracking-wider">
              Custom Message
            </h2>
            <textarea
              value={lastMessage}
              onChange={(e) => setLastMessage(e.target.value)}
              placeholder="Type your own message..."
              className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50 min-h-[100px]"
            />
            <button
              onClick={() => triggerBreakthrough(lastMessage)}
              className="mt-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full hover:shadow-lg active:scale-95 transition-all"
            >
              Test Detection
            </button>
          </div>
        </div>

        {analysis && (
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg space-y-3">
            <h3 className="text-sm text-white/60 uppercase tracking-wider">
              Analysis
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Breakthrough:</span>
                <span className={analysis.isBreakthrough ? 'text-green-400' : 'text-white/60'}>
                  {analysis.isBreakthrough ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Depth:</span>
                <span className="text-yellow-500">{analysis.depth.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Markers:</span>
                <span className="text-ain-soph-amber">
                  {analysis.markers.length > 0 ? analysis.markers.join(', ') : 'none'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-white/30 space-y-1">
          <p>The pulse appears at the bottom of the screen</p>
          <p>Max 3 times per day • 10 min cooldown between pulses</p>
        </div>
      </div>

      <CollectivePulse
        conversation={{
          depth: analysis?.depth || 0,
          content: lastMessage
        }}
        breakthrough={breakthrough}
      />
    </div>
  );
}