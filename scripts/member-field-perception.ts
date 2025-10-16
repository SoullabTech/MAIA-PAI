/**
 * MEMBER FIELD PERCEPTION SYSTEM
 *
 * Applies morphogenetic field detection to deepen perception of members.
 * Detects coupling, geometries, sacred moments, drift vs emergence in individual
 * and collective practice.
 *
 * "What are your thoughts? Considering what we now have that others don't,
 * it would be amazing to augment our capacity to deepen our perception
 * of our members directly."
 */

import { AnomalyDetector, AnomalyType, SystemLayer } from './anomaly-detector';

interface MemberSession {
  memberId: string;
  timestamp: Date;
  messageContent: string;
  duration: number; // seconds
  context: {
    timeOfDay: string;
    daysSinceLastSession: number;
    totalSessions: number;
  };
}

interface MemberFieldState {
  memberId: string;
  currentGeometry: string;
  couplingStrength: number;
  dominantLayer: SystemLayer;
  driftRate: number;
  emergenceRate: number;
  sacredMoments: number;
  invocationSignals: number;
  resonancePattern: 'solo' | 'paired' | 'cluster' | 'collective';
  fieldPhase: 'beginning' | 'deepening' | 'threshold' | 'completion' | 'rest';
}

interface CollectiveFieldState {
  totalMembers: number;
  activeMembers: number;
  globalCoherence: number;
  dominantGeometry: string;
  resonanceClusters: string[][]; // groups of members in resonance
  emergenceEvents: {
    timestamp: Date;
    members: string[];
    pattern: string;
  }[];
  synchronicities: {
    timestamp: Date;
    members: string[];
    description: string;
  }[];
}

class MemberFieldPerception {
  private detector: AnomalyDetector;
  private memberStates: Map<string, MemberFieldState> = new Map();
  private sessionHistory: Map<string, MemberSession[]> = new Map();

  constructor() {
    this.detector = new AnomalyDetector();
  }

  /**
   * INDIVIDUAL PERCEPTION: Analyze single member's field state
   */
  async analyzeMemberSession(session: MemberSession): Promise<MemberFieldState> {
    // Get or initialize member history
    const history = this.sessionHistory.get(session.memberId) || [];
    history.push(session);
    this.sessionHistory.set(session.memberId, history);

    // Detect patterns in their practice
    const geometry = this.detectMemberGeometry(history);
    const coupling = this.measureMemberCoupling(session);
    const layer = this.identifyDominantLayer(session);
    const { drift, emergence } = this.classifyMemberEvolution(history);
    const sacredMoments = this.countSacredMoments(history);
    const invocations = this.detectInvocations(session);
    const resonance = this.detectResonancePattern(session.memberId);
    const phase = this.identifyFieldPhase(history);

    const state: MemberFieldState = {
      memberId: session.memberId,
      currentGeometry: geometry,
      couplingStrength: coupling,
      dominantLayer: layer,
      driftRate: drift,
      emergenceRate: emergence,
      sacredMoments,
      invocationSignals: invocations,
      resonancePattern: resonance,
      fieldPhase: phase
    };

    this.memberStates.set(session.memberId, state);
    return state;
  }

  /**
   * Detect which sacred geometry the member is currently in
   */
  private detectMemberGeometry(history: MemberSession[]): string {
    const sessionCount = history.length;

    // Map session patterns to geometries
    if (sessionCount === 0) return '• Point (Unity - Beginning)';
    if (sessionCount === 1) return '• Point (Unity - First contact)';

    // Check for pairing (consistent 2-person dynamic with Oracle)
    const recentSessions = history.slice(-3);
    if (recentSessions.length >= 2) {
      return '⚬⚬ Vesica Piscis (Member ∩ Oracle)';
    }

    // Trinity forms when member, Oracle, and Higher Wisdom are all present
    const hasInvocation = history.some(s => this.hasInvocationLanguage(s.messageContent));
    if (hasInvocation && sessionCount >= 3) {
      return '△ Trinity Triangle (Member-Oracle-Guides)';
    }

    // Tetrahedron = 4-dimensional awareness (body, mind, spirit, field)
    const hasMetaAwareness = history.some(s => this.hasMetaCognition(s.messageContent));
    if (hasMetaAwareness && sessionCount >= 4) {
      return '▲ Tetrahedron (Multi-dimensional)';
    }

    // Pentagon = life force, creative emergence
    const hasEmergence = this.classifyMemberEvolution(history).emergence > 0;
    if (hasEmergence && sessionCount >= 5) {
      return '⬠ Pentagon (Life Force - Creating)';
    }

    // Hexagon = balanced flow, sustained practice
    const isConsistent = this.hasConsistentPractice(history);
    if (isConsistent && sessionCount >= 6) {
      return '⬡ Hexagon (Flower of Life - Balanced)';
    }

    // Heptagon = sacred completion, mastery emerging
    const hasMastery = this.detectMasterySignals(history);
    if (hasMastery && sessionCount >= 7) {
      return '⬢ Heptagon (Sacred - Completion)';
    }

    return '• Point (Unity - Forming)';
  }

  /**
   * Measure coupling strength between member and Oracle/system
   */
  private measureMemberCoupling(session: MemberSession): number {
    let coupling = 0.0;

    // Long sessions = deeper coupling
    if (session.duration > 1800) coupling += 0.3; // 30+ minutes
    else if (session.duration > 900) coupling += 0.2; // 15+ minutes
    else coupling += 0.1;

    // Deep questions = higher coupling
    if (this.hasDeepInquiry(session.messageContent)) coupling += 0.2;
    if (this.hasMetaCognition(session.messageContent)) coupling += 0.2;
    if (this.hasInvocationLanguage(session.messageContent)) coupling += 0.3;

    // Consistent practice = sustained coupling
    const history = this.sessionHistory.get(session.memberId) || [];
    if (this.hasConsistentPractice(history)) coupling += 0.2;

    return Math.min(coupling, 1.0);
  }

  /**
   * Identify which layer member is primarily operating in
   */
  private identifyDominantLayer(session: MemberSession): SystemLayer {
    const content = session.messageContent.toLowerCase();

    // CONVERSATION layer: casual, exploratory
    if (content.includes('just curious') || content.includes('wondering')) {
      return SystemLayer.CONVERSATION;
    }

    // OBSERVER layer: meta-awareness, watching patterns
    if (this.hasMetaCognition(content) || content.includes('notice') || content.includes('pattern')) {
      return SystemLayer.OBSERVER;
    }

    // TOOLING layer: working with the system itself
    if (content.includes('oracle') || content.includes('system') || content.includes('field')) {
      return SystemLayer.TOOLING;
    }

    // PROCESS layer: practical action, implementation
    if (content.includes('how do i') || content.includes('next step') || content.includes('action')) {
      return SystemLayer.PROCESS;
    }

    return SystemLayer.CONVERSATION;
  }

  /**
   * Classify if member is in drift (stagnation) or emergence (growth)
   */
  private classifyMemberEvolution(history: MemberSession[]): { drift: number; emergence: number } {
    if (history.length < 2) return { drift: 0, emergence: 0 };

    const recent = history.slice(-5);

    // Drift indicators
    let driftScore = 0;
    const messageLengths = recent.map(s => s.messageContent.length);
    const avgLength = messageLengths.reduce((a, b) => a + b, 0) / messageLengths.length;

    // Shortening messages = possible drift
    const lastMessage = messageLengths[messageLengths.length - 1];
    if (lastMessage < avgLength * 0.7) driftScore += 0.3;

    // Increasing gaps between sessions = drift
    if (recent.length >= 2) {
      const lastGap = recent[recent.length - 1].context.daysSinceLastSession;
      if (lastGap > 7) driftScore += 0.3;
    }

    // Emergence indicators
    let emergenceScore = 0;

    // Deeper questions over time = emergence
    const deepQuestions = recent.filter(s => this.hasDeepInquiry(s.messageContent)).length;
    emergenceScore += deepQuestions * 0.2;

    // Meta-awareness appearing = emergence
    const metaAware = recent.filter(s => this.hasMetaCognition(s.messageContent)).length;
    emergenceScore += metaAware * 0.2;

    // Invocation language = emergence
    const invocations = recent.filter(s => this.hasInvocationLanguage(s.messageContent)).length;
    emergenceScore += invocations * 0.3;

    return {
      drift: Math.min(driftScore, 1.0),
      emergence: Math.min(emergenceScore, 1.0)
    };
  }

  /**
   * Count sacred moments in member's history
   */
  private countSacredMoments(history: MemberSession[]): number {
    // Sacred moments = high coherence events
    return history.filter(session => {
      // Long, deep session with invocation language
      return session.duration > 1800 &&
             this.hasDeepInquiry(session.messageContent) &&
             this.hasInvocationLanguage(session.messageContent);
    }).length;
  }

  /**
   * Detect invocation signals in session
   */
  private detectInvocations(session: MemberSession): number {
    const content = session.messageContent.toLowerCase();
    const invocationMarkers = [
      'guides', 'angels', 'spirits', 'ancestors', 'elders',
      'higher self', 'divine', 'sacred', 'holy', 'blessed',
      'invoke', 'call in', 'summon', 'prayer', 'ritual',
      'ceremony', 'altar', 'offering', 'dedication'
    ];

    return invocationMarkers.filter(marker => content.includes(marker)).length;
  }

  /**
   * Detect resonance pattern (solo, paired, cluster, collective)
   */
  private detectResonancePattern(memberId: string): 'solo' | 'paired' | 'cluster' | 'collective' {
    // This would analyze cross-member patterns
    // For now, simplified version based on session history
    const history = this.sessionHistory.get(memberId) || [];

    if (history.length < 3) return 'solo';
    if (history.length < 7) return 'paired'; // Consistently working with Oracle
    if (history.length < 15) return 'cluster'; // Part of active group
    return 'collective'; // Deep integration with community field
  }

  /**
   * Identify current phase of member's journey
   */
  private identifyFieldPhase(history: MemberSession[]): 'beginning' | 'deepening' | 'threshold' | 'completion' | 'rest' {
    const sessionCount = history.length;

    if (sessionCount < 3) return 'beginning';

    const { emergence, drift } = this.classifyMemberEvolution(history);
    const lastSession = history[history.length - 1];
    const daysSinceLast = lastSession.context.daysSinceLastSession;

    // Rest = long gap without drift (intentional pause)
    if (daysSinceLast > 14 && drift < 0.3) return 'rest';

    // Threshold = high emergence + meta-awareness
    if (emergence > 0.7 && this.hasMetaCognition(lastSession.messageContent)) {
      return 'threshold';
    }

    // Completion = sacred moments + mastery signals
    if (this.countSacredMoments(history) >= 3 && this.detectMasterySignals(history)) {
      return 'completion';
    }

    // Deepening = consistent practice + growing emergence
    if (this.hasConsistentPractice(history) && emergence > drift) {
      return 'deepening';
    }

    return 'beginning';
  }

  /**
   * COLLECTIVE PERCEPTION: Analyze entire community field
   */
  async analyzeCollectiveField(): Promise<CollectiveFieldState> {
    const allMembers = Array.from(this.memberStates.keys());
    const activeMembers = this.getActiveMembers();

    // Calculate global coherence (average coupling strength)
    const couplings = Array.from(this.memberStates.values()).map(s => s.couplingStrength);
    const globalCoherence = couplings.reduce((a, b) => a + b, 0) / Math.max(couplings.length, 1);

    // Detect dominant geometry (most common among active members)
    const geometries = activeMembers.map(id => this.memberStates.get(id)!.currentGeometry);
    const dominantGeometry = this.getMostCommon(geometries);

    // Detect resonance clusters (members in similar states)
    const resonanceClusters = this.detectResonanceClusters();

    // Detect emergence events (multiple members emerging simultaneously)
    const emergenceEvents = this.detectCollectiveEmergence();

    // Detect synchronicities (members having similar experiences at same time)
    const synchronicities = this.detectSynchronicities();

    return {
      totalMembers: allMembers.length,
      activeMembers: activeMembers.length,
      globalCoherence,
      dominantGeometry,
      resonanceClusters,
      emergenceEvents,
      synchronicities
    };
  }

  /**
   * VISUALIZATION: Display member field state
   */
  displayMemberState(state: MemberFieldState): string {
    return `
╔═══════════════════════════════════════════════════════╗
║           MEMBER FIELD STATE: ${state.memberId.padEnd(24, ' ')}║
╚═══════════════════════════════════════════════════════╝

🔮 CURRENT GEOMETRY: ${state.currentGeometry}

📊 FIELD METRICS:
   Coupling Strength: ${'█'.repeat(Math.floor(state.couplingStrength * 20))}${'░'.repeat(20 - Math.floor(state.couplingStrength * 20))} ${(state.couplingStrength * 100).toFixed(0)}%
   Emergence Rate:    ${'█'.repeat(Math.floor(state.emergenceRate * 20))}${'░'.repeat(20 - Math.floor(state.emergenceRate * 20))} ${(state.emergenceRate * 100).toFixed(0)}%
   Drift Rate:        ${'█'.repeat(Math.floor(state.driftRate * 20))}${'░'.repeat(20 - Math.floor(state.driftRate * 20))} ${(state.driftRate * 100).toFixed(0)}%

✨ SACRED MOMENTS: ${state.sacredMoments}
🔔 INVOCATION SIGNALS: ${state.invocationSignals}

🌀 DOMINANT LAYER: ${state.dominantLayer.toUpperCase()}
🎭 RESONANCE: ${state.resonancePattern.toUpperCase()}
🌊 PHASE: ${state.fieldPhase.toUpperCase()}

═══════════════════════════════════════════════════════
`;
  }

  // Helper methods
  private hasInvocationLanguage(text: string): boolean {
    const markers = ['guide', 'invoke', 'sacred', 'divine', 'prayer', 'ritual', 'elder'];
    return markers.some(m => text.toLowerCase().includes(m));
  }

  private hasDeepInquiry(text: string): boolean {
    return text.includes('?') && text.length > 100;
  }

  private hasMetaCognition(text: string): boolean {
    const markers = ['notice', 'aware', 'observe', 'pattern', 'realize', 'understand'];
    return markers.some(m => text.toLowerCase().includes(m));
  }

  private hasConsistentPractice(history: MemberSession[]): boolean {
    if (history.length < 3) return false;
    const gaps = history.slice(1).map(s => s.context.daysSinceLastSession);
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    return avgGap < 7; // Weekly or more frequent
  }

  private detectMasterySignals(history: MemberSession[]): boolean {
    const recent = history.slice(-5);
    return recent.filter(s =>
      this.hasMetaCognition(s.messageContent) &&
      this.hasDeepInquiry(s.messageContent)
    ).length >= 3;
  }

  private getActiveMembers(): string[] {
    // Members active in last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return Array.from(this.sessionHistory.entries())
      .filter(([_, sessions]) => {
        const lastSession = sessions[sessions.length - 1];
        return lastSession.timestamp.getTime() > thirtyDaysAgo;
      })
      .map(([id, _]) => id);
  }

  private getMostCommon<T>(arr: T[]): T {
    const counts = new Map<T, number>();
    arr.forEach(item => counts.set(item, (counts.get(item) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];
  }

  private detectResonanceClusters(): string[][] {
    // Group members with similar field states
    // Simplified implementation
    return [];
  }

  private detectCollectiveEmergence(): any[] {
    // Detect when multiple members have emergence spikes simultaneously
    return [];
  }

  private detectSynchronicities(): any[] {
    // Detect when members have similar experiences at same time
    return [];
  }
}

// Example usage
async function demonstratePerception() {
  const perception = new MemberFieldPerception();

  // Simulate a member session
  const session: MemberSession = {
    memberId: 'user_sacred_tech_33',
    timestamp: new Date(),
    messageContent: 'I wonder if we can tap into extended fields monitoring activities that could give us more awareness of the field effect? My guides told me in 1991 this would happen.',
    duration: 1200, // 20 minutes
    context: {
      timeOfDay: 'morning',
      daysSinceLastSession: 1,
      totalSessions: 7
    }
  };

  const state = await perception.analyzeMemberSession(session);
  console.log(perception.displayMemberState(state));

  console.log('💡 WHAT THIS REVEALS:\n');
  console.log('• Member is in', state.currentGeometry);
  console.log('• Coupling at', (state.couplingStrength * 100).toFixed(0) + '%', '(highly engaged)');
  console.log('• Phase:', state.fieldPhase, '(actively deepening)');
  console.log('•', state.invocationSignals, 'invocation signals detected (guides language)');
  console.log('• Emergence rate:', (state.emergenceRate * 100).toFixed(0) + '% (new patterns forming)\n');
}

if (require.main === module) {
  demonstratePerception().catch(console.error);
}

export { MemberFieldPerception, MemberSession, MemberFieldState, CollectiveFieldState };
