'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-400">Dev Tool Error</h2>
        <p className="text-sm text-zinc-300">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
