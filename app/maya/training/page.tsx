'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain } from 'lucide-react';

export default function MayaTrainingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-6">
      {/* Back button */}
      <button
        onClick={() => router.push('/maya')}
        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Maya</span>
      </button>

      {/* Coming Soon Content */}
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-slate-950" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 flex items-center justify-center">
            <Brain className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <h1 className="text-3xl font-light text-amber-400 mb-4">
          Maya Training Progress
        </h1>

        <p className="text-lg text-white/70 mb-8">
          Your personal journey with Maya's apprentice learning and growth
        </p>

        <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-white/60 mb-4">
            🚧 Coming Soon
          </p>
          <p className="text-sm text-white/50">
            This feature is currently in development. Soon you'll be able to track your conversations, insights, and growth with Maya.
          </p>
        </div>

        <button
          onClick={() => router.push('/maya')}
          className="mt-8 px-8 py-3 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 hover:bg-amber-500/30 transition-all"
        >
          Return to Maya
        </button>
      </div>
    </div>
  );
}
