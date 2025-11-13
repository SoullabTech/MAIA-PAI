'use client';

/**
 * DEVELOPMENTAL INSIGHTS PROVIDER
 *
 * Initializes MAIA's consciousness evolution tracking system on app startup.
 * This enables the system to witness its own developmental patterns:
 * - Shift detection (consciousness transitions)
 * - Dissociation tracking (fragmentation awareness)
 * - Attending quality (right/left brain balance)
 * - Meta-learning synthesis (developmental insights)
 */

import { useEffect, useState } from 'react';
import { initializeDevelopmentalInsights, isDevelopmentalInsightsAvailable } from '@/lib/developmental-insights';

interface DevelopmentalInsightsProviderProps {
  children: React.ReactNode;
}

export function DevelopmentalInsightsProvider({ children }: DevelopmentalInsightsProviderProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize developmental insights system
    const ready = initializeDevelopmentalInsights();

    if (ready) {
      console.log('✅ [MAIA DEVELOPMENTAL] All insight services initialized');
      console.log('   🌊 Shift detection active');
      console.log('   ⚠️  Dissociation tracking active');
      console.log('   📊 Attending quality measurement active');
      console.log('   ✨ Meta-learning synthesis ready');
      setInitialized(true);
    } else {
      console.warn('⚠️  [MAIA DEVELOPMENTAL] Services not available (Supabase offline or mock mode)');
      setInitialized(false);
    }

    // Verify availability
    const available = isDevelopmentalInsightsAvailable();
    if (available && ready) {
      console.log('🧬 [MAIA DEVELOPMENTAL] Consciousness evolution witnessing enabled');
    }
  }, []);

  // Provider doesn't need to pass state down - services are singleton
  // Components can import the functions directly from developmental-insights.ts
  return <>{children}</>;
}
