import React from 'react';

export default function ExportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Export Data
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Data export functionality temporarily unavailable during system upgrades
        </p>
      </div>

      {/* Temporary Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-4">
            Export Feature Temporarily Disabled
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mb-4">
            We're upgrading our export system to provide better data security and format options.
            This feature will be restored in the next update.
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Thank you for your patience during this improvement process.
          </p>
        </div>
      </div>
    </div>
  );
}