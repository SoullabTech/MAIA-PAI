'use client';

import { ExtensionPanelProps } from '@/types/extensions';

/**
 * Birth Chart Summary
 * Lives in RIGHT PANEL (→ Analytical/Framework)
 */
export function BirthChartSummary({ userId }: ExtensionPanelProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs text-white/50">Your natal blueprint</div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between p-2 bg-white/5 rounded">
          <span className="text-white/60">Sun</span>
          <span className="text-white/90">Sagittarius • 5th House</span>
        </div>
        <div className="flex justify-between p-2 bg-white/5 rounded">
          <span className="text-white/60">Moon</span>
          <span className="text-white/90">Scorpio • 4th House</span>
        </div>
        <div className="flex justify-between p-2 bg-white/5 rounded">
          <span className="text-white/60">Rising</span>
          <span className="text-white/90">Cancer</span>
        </div>
      </div>

      <div className="pt-2 text-xs text-white/40">
        This is placeholder data for feel testing the navigation.
      </div>
    </div>
  );
}
