'use client';

// SCRIBE MODE - DISABLED for now, using main MAIA page instead
// ScribeModeWithVoice.tsx is disabled pending voice architecture cleanup

export default function ScribePage() {
  return (
    <div className="min-h-screen bg-[#0A0D16] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl text-amber-300 mb-4">Scribe Mode</h1>
        <p className="text-slate-400">
          Please use the main MAIA page and select "Scribe" mode instead.
        </p>
        <a
          href="/maia"
          className="mt-6 inline-block px-6 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 hover:bg-purple-900/50 transition-all"
        >
          Go to MAIA
        </a>
      </div>
    </div>
  );
}
