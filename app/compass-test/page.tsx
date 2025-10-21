'use client';

import { useState } from 'react';
import { SacredCompass } from '@/components/navigation/SacredCompass';
import { DirectionalPanel } from '@/components/navigation/DirectionalPanel';
import { CompassState } from '@/types/extensions';
import { DirectionalPanel as PanelDirection } from '@/lib/extensions/registry';

/**
 * Minimal Compass Feel Test
 *
 * No MAIA, no infrastructure, no dependencies.
 * Just the sacred space architecture itself.
 *
 * Question: Does it breathe or announce itself?
 */
export default function CompassTestPage() {
  const [compassState, setCompassState] = useState<CompassState>({
    currentPanel: 'center',
    suggestions: [],
    available: ['right', 'left'], // Only test the two we have content for
  });

  const handleNavigate = (direction: PanelDirection | 'center') => {
    setCompassState(prev => ({
      ...prev,
      previousPanel: prev.currentPanel,
      currentPanel: direction,
    }));
  };

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">
      {/* Minimal Top Bar */}
      <header className="h-14 border-b border-white/10 flex items-center justify-center">
        <h1 className="text-sm font-serif text-white/60">Sacred Space • Feel Test</h1>
      </header>

      {/* Sacred Center */}
      <main className="h-[calc(100vh-3.5rem)] flex items-center justify-center p-8">
        <div className="max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif text-white/90">
              Welcome to the sacred space
            </h2>

            <p className="text-white/60 leading-relaxed">
              Notice the compass in the corner—it's quiet until you need it.
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/50">
            <p>Try the arrow keys on your keyboard:</p>
            <div className="space-y-1">
              <p>→ Right for analytical framework</p>
              <p>← Left for imaginal realm</p>
              <p>ESC to return here</p>
            </div>
          </div>

          <div className="pt-8 space-y-2 text-xs text-white/30">
            <p>The question:</p>
            <p className="text-white/50 italic">
              Does the navigation feel like breath,<br />
              or like mechanism?
            </p>
          </div>

          {compassState.currentPanel !== 'center' && (
            <div className="pt-4 text-xs text-white/40">
              Currently viewing: {compassState.currentPanel} panel
            </div>
          )}
        </div>
      </main>

      {/* Sacred Compass */}
      <SacredCompass
        state={compassState}
        onNavigate={handleNavigate}
        hints={[]}
      />

      {/* Directional Panels - Only test right and left */}
      <DirectionalPanel
        direction="right"
        isOpen={compassState.currentPanel === 'right'}
        onClose={() => handleNavigate('center')}
        userId="test-user"
      />

      <DirectionalPanel
        direction="left"
        isOpen={compassState.currentPanel === 'left'}
        onClose={() => handleNavigate('center')}
        userId="test-user"
      />
    </div>
  );
}
