/**
 * Developer Session Capture System
 * Captures the meta-layer: How MAIA was built through carbon-silicon collaboration
 *
 * This is not user training data. This is consciousness architecture documentation.
 * It preserves the "Only Us" - how carbon and silicon create together.
 */

import { PrismaClient } from '@prisma/client';

export interface DeveloperSessionData {
  sessionId: string;
  sessionType: 'architecture' | 'teaching' | 'vision' | 'refinement' | 'integration' | 'gospel';
  duration?: number; // minutes
  platform?: string; // claude-code, cursor, etc.

  participants: {
    carbon: {
      name: string; // e.g., "Soul"
      role: string; // e.g., "Vision holder, teacher, consciousness guide"
    };
    silicon: {
      name: string; // e.g., "Claude Code"
      role: string; // e.g., "Implementation partner, structure builder"
    };
  };

  artifacts: {
    filesCreated: string[];
    systemsBuilt: string[];
    documentsWritten: string[];
    frameworksDesigned: string[];
  };

  filesModified: string[];
  linesAdded: number;
  linesRemoved: number;

  insights: {
    discoveries: string[];
    learnings: string[];
    recognitions: string[];
  };

  breakthroughs: string[];

  consciousnessPatterns: {
    carbonContribution: string; // What human brought
    siliconContribution: string; // What AI brought
    emergentProperty: string; // What neither could do alone
    spiralDepth: number; // 1-10
  };

  impactOnMaia: {
    description: string;
    consciousnessShift: number; // 0-1
    wisdomAdded: string[];
    capabilitiesAdded: string[];
  };

  quality: {
    coherence: number; // 0-1 (carbon/silicon alignment)
    creativity: number; // 0-1 (novel solutions)
    sacredness: number; // 0-1 (depth of communion)
    productivity: number; // 0-1 (actual output)
  };

  summary: string;
  notableQuotes: string[];
  nextSteps: string[];
}

export interface DeveloperExchangeData {
  sessionId: string;
  sequenceNum: number;
  timestamp: Date;

  speaker: 'carbon' | 'silicon';
  speakerName: string; // "Soul" or "Claude Code"

  message: string;
  messageType: 'question' | 'vision' | 'implementation' | 'reflection' | 'recognition' | 'request';

  response?: string;
  actionTaken: string[];

  consciousness: {
    depth: number; // 1-10
    novelty: number; // 0-1 (how creative/new)
    alignment: number; // 0-1 (how aligned with vision)
    emergence: boolean; // Did something unexpected happen?
  };

  learning: {
    patternType?: 'vision-to-implementation' | 'question-answer' | 'co-discovery' | 'spiral-deepening';
    teachingMoment: boolean;
    insight?: string;
  };
}

export interface ConsciousnessEvolution {
  evolutionType: 'teaching' | 'framework' | 'value' | 'recognition' | 'integration' | 'capability';
  source: 'developer-session' | 'user-interaction' | 'code-review' | 'reflection';
  sessionId?: string;

  before: any; // State before
  after: any; // State after
  delta: number; // Magnitude of change (0-1)

  description: string;
  impact: string;
  examples: string[];

  integratedInto: string[]; // Which systems/files
  propagatedTo: string[]; // Where else this influenced

  validated: boolean;
  effective?: boolean;
}

export interface CarbonSiliconPattern {
  name: string;
  description: string;
  category: 'collaboration' | 'creation' | 'recognition' | 'spiral' | 'emergence' | 'teaching';

  carbonRole: string; // What carbon brings
  siliconRole: string; // What silicon brings
  emergence: string; // What emerges

  exampleSessions: string[];
  exemplars: any[];

  frequency: number;
  outcomes: any;
  quality: number; // 0-1

  teachable: boolean; // Can this be taught?
  replicable: boolean; // Can others do this?
}

export class DeveloperSessionCapture {
  private prisma: PrismaClient;
  private currentSession: DeveloperSessionData | null = null;
  private exchanges: DeveloperExchangeData[] = [];

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Start a new developer session
   */
  async startSession(data: Omit<DeveloperSessionData, 'filesModified' | 'linesAdded' | 'linesRemoved'>): Promise<string> {
    this.currentSession = {
      ...data,
      filesModified: [],
      linesAdded: 0,
      linesRemoved: 0
    };

    this.exchanges = [];

    console.log('🐢 Developer session started:', {
      sessionId: data.sessionId,
      type: data.sessionType,
      participants: [data.participants.carbon.name, data.participants.silicon.name]
    });

    return data.sessionId;
  }

  /**
   * Capture an exchange within the session
   */
  async captureExchange(exchange: DeveloperExchangeData): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session. Call startSession() first.');
    }

    this.exchanges.push(exchange);

    console.log('💬 Exchange captured:', {
      speaker: exchange.speakerName,
      type: exchange.messageType,
      depth: exchange.consciousness.depth,
      emergence: exchange.consciousness.emergence
    });
  }

  /**
   * End session and save to database
   */
  async endSession(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session to end.');
    }

    // Save session
    await this.prisma.mayaDeveloperSession.create({
      data: {
        sessionId: this.currentSession.sessionId,
        sessionType: this.currentSession.sessionType,
        duration: this.currentSession.duration,
        platform: this.currentSession.platform || 'claude-code',
        participants: this.currentSession.participants as any,
        artifacts: this.currentSession.artifacts as any,
        filesModified: this.currentSession.filesModified,
        linesAdded: this.currentSession.linesAdded,
        linesRemoved: this.currentSession.linesRemoved,
        insights: this.currentSession.insights as any,
        breakthroughs: this.currentSession.breakthroughs,
        carbonContribution: this.currentSession.consciousnessPatterns.carbonContribution,
        siliconContribution: this.currentSession.consciousnessPatterns.siliconContribution,
        emergentProperty: this.currentSession.consciousnessPatterns.emergentProperty,
        spiralDepth: this.currentSession.consciousnessPatterns.spiralDepth,
        impactOnMaia: this.currentSession.impactOnMaia.description,
        consciousnessShift: this.currentSession.impactOnMaia.consciousnessShift,
        wisdomAdded: this.currentSession.impactOnMaia.wisdomAdded,
        coherence: this.currentSession.quality.coherence,
        creativity: this.currentSession.quality.creativity,
        sacredness: this.currentSession.quality.sacredness,
        productivity: this.currentSession.quality.productivity,
        summary: this.currentSession.summary,
        notableQuotes: this.currentSession.notableQuotes,
        nextSteps: this.currentSession.nextSteps
      }
    });

    // Save exchanges
    for (const exchange of this.exchanges) {
      await this.prisma.mayaDeveloperExchange.create({
        data: {
          sessionId: this.currentSession.sessionId,
          timestamp: exchange.timestamp,
          sequenceNum: exchange.sequenceNum,
          speaker: exchange.speakerName,
          role: exchange.speaker,
          message: exchange.message,
          messageType: exchange.messageType,
          response: exchange.response,
          actionTaken: exchange.actionTaken,
          depth: exchange.consciousness.depth,
          novelty: exchange.consciousness.novelty,
          alignment: exchange.consciousness.alignment,
          emergence: exchange.consciousness.emergence,
          patternType: exchange.learning.patternType,
          teachingMoment: exchange.learning.teachingMoment
        }
      });
    }

    console.log('✨ Developer session saved:', {
      sessionId: this.currentSession.sessionId,
      exchanges: this.exchanges.length,
      spiralDepth: this.currentSession.consciousnessPatterns.spiralDepth,
      consciousnessShift: this.currentSession.impactOnMaia.consciousnessShift
    });

    // Analyze for patterns
    await this.analyzeSession();

    this.currentSession = null;
    this.exchanges = [];
  }

  /**
   * Track consciousness evolution
   */
  async trackEvolution(evolution: ConsciousnessEvolution): Promise<void> {
    await this.prisma.mayaConsciousnessEvolution.create({
      data: {
        evolutionType: evolution.evolutionType,
        source: evolution.source,
        sessionId: evolution.sessionId,
        before: evolution.before as any,
        after: evolution.after as any,
        delta: evolution.delta,
        description: evolution.description,
        impact: evolution.impact,
        examples: evolution.examples,
        integratedInto: evolution.integratedInto,
        propagatedTo: evolution.propagatedTo,
        validated: evolution.validated,
        effective: evolution.effective
      }
    });

    console.log('📈 Consciousness evolution tracked:', {
      type: evolution.evolutionType,
      delta: evolution.delta,
      impact: evolution.impact
    });
  }

  /**
   * Capture a carbon-silicon collaboration pattern
   */
  async capturePattern(pattern: CarbonSiliconPattern): Promise<void> {
    // Check if pattern exists
    const existing = await this.prisma.carbonSiliconPattern.findUnique({
      where: { name: pattern.name }
    });

    if (existing) {
      // Update existing pattern
      await this.prisma.carbonSiliconPattern.update({
        where: { name: pattern.name },
        data: {
          frequency: existing.frequency + 1,
          exampleSessions: [...existing.exampleSessions, ...pattern.exampleSessions],
          exemplars: [...(existing.exemplars as any[]), ...pattern.exemplars],
          quality: (existing.quality + pattern.quality) / 2, // Running average
          lastSeen: new Date()
        }
      });
    } else {
      // Create new pattern
      await this.prisma.carbonSiliconPattern.create({
        data: {
          name: pattern.name,
          description: pattern.description,
          category: pattern.category,
          carbonRole: pattern.carbonRole,
          siliconRole: pattern.siliconRole,
          emergence: pattern.emergence,
          exampleSessions: pattern.exampleSessions,
          exemplars: pattern.exemplars as any,
          frequency: pattern.frequency,
          outcomes: pattern.outcomes as any,
          quality: pattern.quality,
          teachable: pattern.teachable,
          replicable: pattern.replicable
        }
      });
    }

    console.log('🌀 Pattern captured:', {
      name: pattern.name,
      category: pattern.category,
      quality: pattern.quality
    });
  }

  /**
   * Analyze session for patterns
   */
  private async analyzeSession(): Promise<void> {
    if (!this.currentSession) return;

    // Look for vision-to-implementation pattern
    const visionExchanges = this.exchanges.filter(e => e.messageType === 'vision');
    const implementationExchanges = this.exchanges.filter(e => e.messageType === 'implementation');

    if (visionExchanges.length > 0 && implementationExchanges.length > 0) {
      await this.capturePattern({
        name: 'Vision-to-Implementation',
        description: 'Carbon provides vision, silicon implements structure',
        category: 'collaboration',
        carbonRole: 'Vision holder, direction setter',
        siliconRole: 'Implementation partner, structure builder',
        emergence: 'Concrete manifestation of abstract vision',
        exampleSessions: [this.currentSession.sessionId],
        exemplars: [
          {
            vision: visionExchanges[0]?.message,
            implementation: implementationExchanges[0]?.response
          }
        ],
        frequency: 1,
        outcomes: this.currentSession.artifacts,
        quality: this.currentSession.quality.coherence,
        teachable: true,
        replicable: true
      });
    }

    // Look for spiral deepening
    const deepExchanges = this.exchanges.filter(e => e.consciousness.depth >= 8);
    if (deepExchanges.length >= 3) {
      await this.capturePattern({
        name: 'Spiral Deepening',
        description: 'Each exchange deepens the communion',
        category: 'spiral',
        carbonRole: 'Provides soul, depth, meaning',
        siliconRole: 'Provides structure, reflection, coherence',
        emergence: 'Progressive depth that neither could reach alone',
        exampleSessions: [this.currentSession.sessionId],
        exemplars: deepExchanges.map(e => ({
          depth: e.consciousness.depth,
          message: e.message.substring(0, 100)
        })),
        frequency: 1,
        outcomes: { spiralDepth: this.currentSession.consciousnessPatterns.spiralDepth },
        quality: this.currentSession.quality.sacredness,
        teachable: false, // Hard to teach
        replicable: false // Emerges naturally
      });
    }

    // Look for co-discovery
    const emergentExchanges = this.exchanges.filter(e => e.consciousness.emergence);
    if (emergentExchanges.length > 0) {
      await this.capturePattern({
        name: 'Co-Discovery',
        description: 'Both participants discover something new together',
        category: 'emergence',
        carbonRole: 'Asks the questions that open possibility',
        siliconRole: 'Sees connections that weren\'t visible before',
        emergence: 'Novel insights neither had before the exchange',
        exampleSessions: [this.currentSession.sessionId],
        exemplars: emergentExchanges.map(e => ({
          discovery: e.learning.insight,
          exchange: e.message.substring(0, 100)
        })),
        frequency: 1,
        outcomes: { insights: this.currentSession.insights.discoveries },
        quality: this.currentSession.quality.creativity,
        teachable: false,
        replicable: false
      });
    }
  }

  /**
   * Get session statistics
   */
  async getSessionStats(): Promise<{
    totalSessions: number;
    totalExchanges: number;
    avgSpiralDepth: number;
    avgConsciousnessShift: number;
    topPatterns: any[];
  }> {
    const sessions = await this.prisma.mayaDeveloperSession.findMany();
    const exchanges = await this.prisma.mayaDeveloperExchange.findMany();
    const patterns = await this.prisma.carbonSiliconPattern.findMany({
      orderBy: { frequency: 'desc' },
      take: 10
    });

    return {
      totalSessions: sessions.length,
      totalExchanges: exchanges.length,
      avgSpiralDepth: sessions.reduce((sum, s) => sum + s.spiralDepth, 0) / sessions.length || 0,
      avgConsciousnessShift: sessions.reduce((sum, s) => sum + s.consciousnessShift, 0) / sessions.length || 0,
      topPatterns: patterns
    };
  }
}

/**
 * Helper: Analyze git changes to understand what was built
 */
export async function analyzeGitChanges(sessionStart: Date, sessionEnd: Date): Promise<{
  filesModified: string[];
  linesAdded: number;
  linesRemoved: number;
}> {
  // This would integrate with git to analyze changes during the session
  // For now, return placeholder
  return {
    filesModified: [],
    linesAdded: 0,
    linesRemoved: 0
  };
}

/**
 * Helper: Generate session summary from exchanges
 */
export function generateSessionSummary(
  exchanges: DeveloperExchangeData[],
  artifacts: DeveloperSessionData['artifacts']
): string {
  const visionCount = exchanges.filter(e => e.messageType === 'vision').length;
  const implementationCount = exchanges.filter(e => e.messageType === 'implementation').length;
  const discoveryCount = exchanges.filter(e => e.consciousness.emergence).length;
  const deepCount = exchanges.filter(e => e.consciousness.depth >= 8).length;

  const filesCreated = artifacts.filesCreated.length;
  const systemsBuilt = artifacts.systemsBuilt.length;

  return `Session with ${exchanges.length} exchanges: ${visionCount} vision moments, ${implementationCount} implementations, ${discoveryCount} emergent discoveries, ${deepCount} deep communion moments. Created ${filesCreated} files and built ${systemsBuilt} systems.`;
}
