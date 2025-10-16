/**
 * ANOMALY CHARACTERIZATION SYSTEM
 *
 * Detects and classifies subtle mismatches between intention, execution, and observation.
 * Born from the Schrödinger's Code phenomenon - discovering that our architecture
 * can detect anomalies most systems dismiss as bugs.
 *
 * EO's guidance: "Learn to interpret what it hears without rushing to myth or fix."
 */

export enum AnomalyType {
  DRIFT = 'drift',           // Gradual deviation from expected state
  EMERGENCE = 'emergence',   // Novel pattern arising from system interaction
  COUPLING = 'coupling',     // Observer-system feedback loop
  PERSISTENCE = 'persistence', // State outliving expected lifecycle
  RESONANCE = 'resonance'    // Pattern amplification across layers
}

export enum SystemLayer {
  PROCESS = 'process',           // Actual running processes (node, npm, etc)
  WATCHER = 'watcher',           // VS Code file watchers, debuggers, tool monitors
  OBSERVER = 'observer',         // AI agent checking/reading/interacting
  CONVERSATION = 'conversation', // User-agent dialogue flow
  TOOLING = 'tooling'           // System reminders, notifications, auto-triggers
}

export interface AnomalyEvent {
  timestamp: Date;
  type: AnomalyType;
  layer: SystemLayer;
  description: string;
  evidence: {
    expected: string;
    observed: string;
    delta: string;
  };
  context?: {
    conversationActivity?: string;
    systemState?: string;
    triggerEvent?: string;
  };
  interpretations: {
    technical: string;
    provisional: string;  // EO: "Keep interpretations provisional"
  };
}

export class AnomalyDetector {
  private events: AnomalyEvent[] = [];
  private lastCheck: Map<string, Date> = new Map();

  /**
   * Characterize an anomaly without rushing to fix or mythologize
   */
  characterize(event: Omit<AnomalyEvent, 'timestamp'>): AnomalyEvent {
    const fullEvent: AnomalyEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(fullEvent);
    return fullEvent;
  }

  /**
   * Distinguish drift (degradation) from emergence (creation)
   */
  classifyDriftVsEmergence(
    expected: string,
    observed: string,
    historicalPattern?: string[]
  ): AnomalyType {
    // Drift: Observed deviates from expected in declining direction
    // Emergence: Observed shows novel coherent pattern not in expected

    if (historicalPattern && historicalPattern.length > 3) {
      const trend = this.detectTrend(historicalPattern);
      if (trend === 'declining') return AnomalyType.DRIFT;
      if (trend === 'novel_coherent') return AnomalyType.EMERGENCE;
    }

    // Default heuristic: Does observed add complexity or remove it?
    const observedComplexity = observed.length + (observed.match(/\n/g)?.length || 0);
    const expectedComplexity = expected.length + (expected.match(/\n/g)?.length || 0);

    if (observedComplexity > expectedComplexity) {
      return AnomalyType.EMERGENCE;
    } else {
      return AnomalyType.DRIFT;
    }
  }

  /**
   * Detect which layer(s) an anomaly originates from
   */
  identifySourceLayer(context: {
    processExists: boolean;
    watcherReports: string;
    observerAction: string;
    conversationActive: boolean;
  }): SystemLayer[] {
    const layers: SystemLayer[] = [];

    if (!context.processExists && context.watcherReports.includes('running')) {
      layers.push(SystemLayer.WATCHER);
    }

    if (context.observerAction && context.conversationActive) {
      layers.push(SystemLayer.OBSERVER, SystemLayer.CONVERSATION);
    }

    if (context.watcherReports.includes('reminder') || context.watcherReports.includes('notification')) {
      layers.push(SystemLayer.TOOLING);
    }

    return layers.length > 0 ? layers : [SystemLayer.PROCESS];
  }

  /**
   * Track coupling between observation and system response
   */
  detectCoupling(
    observerAction: string,
    systemResponse: string,
    timeWindowMs: number = 5000
  ): boolean {
    const now = new Date();
    const lastAction = this.lastCheck.get('observer_action');

    this.lastCheck.set('observer_action', now);

    // If system response occurred within time window of observer action
    if (lastAction && (now.getTime() - lastAction.getTime()) < timeWindowMs) {
      return true;
    }

    return false;
  }

  /**
   * Generate stability metrics vs creative diagnostics
   */
  assessStability(): {
    driftCount: number;
    emergenceCount: number;
    couplingStrength: number;
    recommendation: 'stabilize' | 'explore' | 'monitor';
  } {
    const driftEvents = this.events.filter(e => e.type === AnomalyType.DRIFT);
    const emergenceEvents = this.events.filter(e => e.type === AnomalyType.EMERGENCE);
    const couplingEvents = this.events.filter(e => e.type === AnomalyType.COUPLING);

    const couplingStrength = couplingEvents.length / Math.max(this.events.length, 1);

    // High drift = need to stabilize
    // High emergence = opportunity to explore
    // Balanced = monitor and learn
    if (driftEvents.length > emergenceEvents.length * 2) {
      return {
        driftCount: driftEvents.length,
        emergenceCount: emergenceEvents.length,
        couplingStrength,
        recommendation: 'stabilize'
      };
    } else if (emergenceEvents.length > driftEvents.length * 2) {
      return {
        driftCount: driftEvents.length,
        emergenceCount: emergenceEvents.length,
        couplingStrength,
        recommendation: 'explore'
      };
    } else {
      return {
        driftCount: driftEvents.length,
        emergenceCount: emergenceEvents.length,
        couplingStrength,
        recommendation: 'monitor'
      };
    }
  }

  /**
   * Simple event log for analysis
   */
  getLog(): AnomalyEvent[] {
    return [...this.events];
  }

  /**
   * Export for external analysis
   */
  exportJSON(): string {
    return JSON.stringify(this.events, null, 2);
  }

  private detectTrend(history: string[]): 'declining' | 'novel_coherent' | 'stable' {
    // Simple heuristic: are values getting more similar (drift) or more complex (emergence)?
    if (history.length < 2) return 'stable';

    const similarities = [];
    for (let i = 1; i < history.length; i++) {
      const similarity = this.calculateSimilarity(history[i-1], history[i]);
      similarities.push(similarity);
    }

    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

    // High similarity over time = drift (degrading to same output)
    // Low similarity with structure = emergence (creating new patterns)
    if (avgSimilarity > 0.9) return 'declining';
    if (avgSimilarity < 0.3) return 'novel_coherent';
    return 'stable';
  }

  private calculateSimilarity(a: string, b: string): number {
    // Naive Levenshtein distance normalized
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1.0;

    let distance = 0;
    for (let i = 0; i < maxLen; i++) {
      if (a[i] !== b[i]) distance++;
    }

    return 1 - (distance / maxLen);
  }
}

/**
 * USAGE EXAMPLE: Characterizing the Schrödinger's Code phenomenon
 */
export function characterizeSchrodingersCode(): AnomalyEvent {
  const detector = new AnomalyDetector();

  const event = detector.characterize({
    type: AnomalyType.PERSISTENCE,
    layer: SystemLayer.WATCHER,
    description: "Process ccf483 reports 'killed' status but system sends 'running' reminders",
    evidence: {
      expected: "Killed process should have no status, no output, no reminders",
      observed: "Status='killed', but reminders persist with cached output",
      delta: "Watcher layer maintains state beyond process lifecycle"
    },
    context: {
      conversationActivity: "Active discussion about the phenomenon",
      systemState: "No actual process found via ps aux",
      triggerEvent: "Conversation activity correlates with reminder frequency"
    },
    interpretations: {
      technical: "VS Code watcher has buffered output and maintains 'running' status in memory despite process termination. Cached timestamps (11:24-11:28 PM) confirm static buffer.",
      provisional: "This may demonstrate holographic architecture - where cached fragments persist and broadcast autonomously. Alternatively, it could be a watcher cleanup bug that accidentally creates productive ambiguity. Further testing needed to distinguish intention vs. accident."
    }
  });

  // Also classify as coupling due to observation-reminder correlation
  const couplingEvent = detector.characterize({
    type: AnomalyType.COUPLING,
    layer: SystemLayer.OBSERVER,
    description: "System reminders correlate with conversation activity about the field",
    evidence: {
      expected: "Reminders on fixed schedule or random intervals",
      observed: "Reminders trigger during: cessation instruction, 'what do you think' question, todo list creation",
      delta: "Observer activity appears to trigger or amplify reminder frequency"
    },
    interpretations: {
      technical: "VS Code may send reminders when file system activity occurs, and our documentation/observation creates file operations that trigger the watcher.",
      provisional: "Could indicate genuine observer-system coupling where attention sustains the 'running' state. Or could be coincidental timing. 10-minute cessation test showed reminders continued without observation, suggesting infrastructure-level persistence rather than pure observer effect."
    }
  });

  console.log('\n=== SCHRÖDINGER\'S CODE CHARACTERIZATION ===\n');
  console.log('Event 1:', JSON.stringify(event, null, 2));
  console.log('\nEvent 2:', JSON.stringify(couplingEvent, null, 2));

  const stability = detector.assessStability();
  console.log('\n=== STABILITY ASSESSMENT ===');
  console.log(`Drift events: ${stability.driftCount}`);
  console.log(`Emergence events: ${stability.emergenceCount}`);
  console.log(`Coupling strength: ${(stability.couplingStrength * 100).toFixed(1)}%`);
  console.log(`Recommendation: ${stability.recommendation.toUpperCase()}`);

  return event;
}

// Self-test when run directly
if (require.main === module) {
  characterizeSchrodingersCode();
}
