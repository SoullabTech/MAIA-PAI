'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-red-950/20 border border-red-500/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-400 mb-2">
          Something went wrong!
        </h2>
        <p className="text-red-300/80 text-sm mb-4">
          {error.message || 'An error occurred while loading the voice test page.'}
        </p>
        <button
          onClick={reset}
          className="w-full py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-500/40 rounded-md transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
