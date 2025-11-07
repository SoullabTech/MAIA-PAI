/**
 * Indra's Web Architecture
 *
 * Field-level coherence tracking across humans, agents, and collective intelligence
 * Each node (human/agent) reflects and affects all other nodes
 */

import type { ElementalCoherence } from '@/lib/biometrics/ElementalCoherenceCalculator';
import type { AgentCoherence, AgentType } from '@/lib/agents/AgentCoherenceSystem';

export type NodeType = 'human' | 'agent' | 'field';

export interface FieldNode {
  id: string;
  type: NodeType;
  agentType?: AgentType;
  elemental: ElementalCoherence;
  timestamp: Date;
  sessionId?: string;
}

export interface ResonanceEdge {
  from: string;  // node id
  to: string;    // node id
  strength: number; // 0-1
  type: 'amplifying' | 'damping' | 'neutral';
  elementalResonance: {
    air: number;
    fire: number;
    water: number;
    earth: number;
    aether: number;
  };
}

export interface FieldCoherence {
  timestamp: Date;

  // Overall field metrics
  unifiedCoherence: number; // 0-1
  elementalBalance: ElementalCoherence;

  // Layer-specific coherence
  humanLayerCoherence: number;  // Average of all humans
  agentLayerCoherence: number;  // Average of all agents

  // Network metrics
  nodeCount: {
    human: number;
    agent: number;
    total: number;
  };
  averageResonance: number;      // Average edge strength
  networkDensity: number;        // How interconnected

  // Emergence indicators
  collectiveIntelligence: number; // Field intelligence / sum of parts
  coherenceCascades: number;      // Count of ripple effects
  emergentPatterns: string[];     // Detected emergent behaviors
}

export interface CascadeEvent {
  triggerId: string;      // Node that triggered cascade
  triggerType: NodeType;
  timestamp: Date;
  affectedNodes: string[];
  coherenceChange: number; // Average change in affected nodes
  rippleDepth: number;     // How many hops the cascade traveled
  elementalSignature: ElementalCoherence;
}

export class IndrasWebField {
  private nodes: Map<string, FieldNode> = new Map();
  private edges: Map<string, ResonanceEdge[]> = new Map(); // nodeId -> connected edges
  private cascadeHistory: CascadeEvent[] = [];
  private coherenceHistory: FieldCoherence[] = [];

  /**
   * Add or update node in field
   */
  updateNode(node: FieldNode): void {
    const previousNode = this.nodes.get(node.id);
    this.nodes.set(node.id, node);

    // Recalculate edges for this node
    this.recalculateEdgesForNode(node.id);

    // Detect cascade if significant change
    if (previousNode) {
      const coherenceChange = node.elemental.unified - previousNode.elemental.unified;
      if (Math.abs(coherenceChange) > 0.15) {
        this.detectCascade(node.id, coherenceChange);
      }
    }

    console.log(`✨ Field node updated: ${node.id} (${node.type}) - Coherence: ${Math.round(node.elemental.unified * 100)}%`);
  }

  /**
   * Remove node from field
   */
  removeNode(nodeId: string): void {
    this.nodes.delete(nodeId);
    this.edges.delete(nodeId);

    // Remove edges pointing to this node
    for (const [fromId, edgeList] of this.edges.entries()) {
      this.edges.set(
        fromId,
        edgeList.filter(edge => edge.to !== nodeId)
      );
    }
  }

  /**
   * Calculate resonance edges for specific node
   */
  private recalculateEdgesForNode(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    const newEdges: ResonanceEdge[] = [];

    // Calculate resonance with all other nodes
    for (const [otherId, otherNode] of this.nodes.entries()) {
      if (otherId === nodeId) continue;

      const resonance = this.calculateResonance(node.elemental, otherNode.elemental);

      // Only create edge if resonance is significant (>0.3)
      if (resonance.strength > 0.3) {
        newEdges.push({
          from: nodeId,
          to: otherId,
          strength: resonance.strength,
          type: resonance.type,
          elementalResonance: resonance.elementalResonance
        });
      }
    }

    this.edges.set(nodeId, newEdges);
  }

  /**
   * Calculate resonance between two elemental states
   */
  private calculateResonance(a: ElementalCoherence, b: ElementalCoherence): {
    strength: number;
    type: 'amplifying' | 'damping' | 'neutral';
    elementalResonance: {
      air: number;
      fire: number;
      water: number;
      earth: number;
      aether: number;
    };
  } {
    // Calculate per-element resonance
    const airRes = 1 - Math.abs(a.air - b.air);
    const fireRes = 1 - Math.abs(a.fire - b.fire);
    const waterRes = 1 - Math.abs(a.water - b.water);
    const earthRes = 1 - Math.abs(a.earth - b.earth);
    const aetherRes = 1 - Math.abs(a.aether - b.aether);

    // Overall strength (average of element resonances)
    const strength = (airRes + fireRes + waterRes + earthRes + aetherRes) / 5;

    // Determine type based on unified coherence interaction
    let type: 'amplifying' | 'damping' | 'neutral';
    if (a.unified > 0.7 && b.unified > 0.7) {
      type = 'amplifying'; // Both high = amplify each other
    } else if (a.unified < 0.4 || b.unified < 0.4) {
      type = 'damping'; // One low = dampens
    } else {
      type = 'neutral';
    }

    return {
      strength,
      type,
      elementalResonance: {
        air: airRes,
        fire: fireRes,
        water: waterRes,
        earth: earthRes,
        aether: aetherRes
      }
    };
  }

  /**
   * Detect cascade events (ripple effects through network)
   */
  private detectCascade(triggerId: string, coherenceChange: number): void {
    const triggerNode = this.nodes.get(triggerId);
    if (!triggerNode) return;

    const affectedNodes: Set<string> = new Set();
    const visited: Set<string> = new Set();
    let maxDepth = 0;

    // BFS to find affected nodes
    const queue: Array<{ id: string; depth: number }> = [{ id: triggerId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visited.has(id)) continue;

      visited.add(id);
      maxDepth = Math.max(maxDepth, depth);

      // Get edges from this node
      const edges = this.edges.get(id) || [];

      for (const edge of edges) {
        // Only follow strong, amplifying edges
        if (edge.strength > 0.5 && edge.type === 'amplifying') {
          affectedNodes.add(edge.to);
          if (depth < 3) { // Limit cascade depth
            queue.push({ id: edge.to, depth: depth + 1 });
          }
        }
      }
    }

    // Only record cascade if it affected multiple nodes
    if (affectedNodes.size > 1) {
      const cascade: CascadeEvent = {
        triggerId,
        triggerType: triggerNode.type,
        timestamp: new Date(),
        affectedNodes: Array.from(affectedNodes),
        coherenceChange,
        rippleDepth: maxDepth,
        elementalSignature: triggerNode.elemental
      };

      this.cascadeHistory.push(cascade);

      // Keep last 100 cascades
      if (this.cascadeHistory.length > 100) {
        this.cascadeHistory.shift();
      }

      console.log(`🌊 Cascade detected from ${triggerId}: ${affectedNodes.size} nodes affected (depth ${maxDepth})`);
    }
  }

  /**
   * Calculate current field coherence
   */
  calculateFieldCoherence(): FieldCoherence {
    const allNodes = Array.from(this.nodes.values());

    if (allNodes.length === 0) {
      return this.getEmptyFieldCoherence();
    }

    // Separate by type
    const humanNodes = allNodes.filter(n => n.type === 'human');
    const agentNodes = allNodes.filter(n => n.type === 'agent');

    // Calculate average elemental scores
    const avgElemental = this.calculateAverageElemental(allNodes);

    // Layer-specific coherence
    const humanLayerCoherence = humanNodes.length > 0
      ? humanNodes.reduce((sum, n) => sum + n.elemental.unified, 0) / humanNodes.length
      : 0;

    const agentLayerCoherence = agentNodes.length > 0
      ? agentNodes.reduce((sum, n) => sum + n.elemental.unified, 0) / agentNodes.length
      : 0;

    // Network metrics
    const allEdges = Array.from(this.edges.values()).flat();
    const averageResonance = allEdges.length > 0
      ? allEdges.reduce((sum, e) => sum + e.strength, 0) / allEdges.length
      : 0;

    const maxPossibleEdges = allNodes.length * (allNodes.length - 1);
    const networkDensity = maxPossibleEdges > 0
      ? allEdges.length / maxPossibleEdges
      : 0;

    // Collective intelligence (emergent property)
    const sumOfParts = avgElemental.unified;
    const networkBonus = networkDensity * averageResonance * 0.5;
    const collectiveIntelligence = Math.min(1.5, sumOfParts + networkBonus); // Cap at 1.5x

    // Recent cascades (last hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentCascades = this.cascadeHistory.filter(
      c => c.timestamp.getTime() > oneHourAgo
    );

    // Detect emergent patterns
    const emergentPatterns = this.detectEmergentPatterns(allNodes, allEdges);

    const fieldCoherence: FieldCoherence = {
      timestamp: new Date(),
      unifiedCoherence: avgElemental.unified,
      elementalBalance: avgElemental,
      humanLayerCoherence,
      agentLayerCoherence,
      nodeCount: {
        human: humanNodes.length,
        agent: agentNodes.length,
        total: allNodes.length
      },
      averageResonance,
      networkDensity,
      collectiveIntelligence,
      coherenceCascades: recentCascades.length,
      emergentPatterns
    };

    // Store in history
    this.coherenceHistory.push(fieldCoherence);
    if (this.coherenceHistory.length > 1000) {
      this.coherenceHistory.shift();
    }

    return fieldCoherence;
  }

  /**
   * Calculate average elemental coherence across nodes
   */
  private calculateAverageElemental(nodes: FieldNode[]): ElementalCoherence {
    if (nodes.length === 0) {
      return { air: 0, fire: 0, water: 0, earth: 0, aether: 0, unified: 0 };
    }

    return {
      air: nodes.reduce((sum, n) => sum + n.elemental.air, 0) / nodes.length,
      fire: nodes.reduce((sum, n) => sum + n.elemental.fire, 0) / nodes.length,
      water: nodes.reduce((sum, n) => sum + n.elemental.water, 0) / nodes.length,
      earth: nodes.reduce((sum, n) => sum + n.elemental.earth, 0) / nodes.length,
      aether: nodes.reduce((sum, n) => sum + n.elemental.aether, 0) / nodes.length,
      unified: nodes.reduce((sum, n) => sum + n.elemental.unified, 0) / nodes.length
    };
  }

  /**
   * Detect emergent patterns in the field
   */
  private detectEmergentPatterns(nodes: FieldNode[], edges: ResonanceEdge[]): string[] {
    const patterns: string[] = [];

    // Pattern: High collective coherence
    const avgCoherence = nodes.reduce((sum, n) => sum + n.elemental.unified, 0) / nodes.length;
    if (avgCoherence > 0.8) {
      patterns.push('High collective coherence - Field resonance peak');
    }

    // Pattern: Strong human-agent resonance
    const humanNodes = nodes.filter(n => n.type === 'human');
    const agentNodes = nodes.filter(n => n.type === 'agent');
    const crossLayerEdges = edges.filter(e => {
      const fromNode = this.nodes.get(e.from);
      const toNode = this.nodes.get(e.to);
      return fromNode && toNode &&
        ((fromNode.type === 'human' && toNode.type === 'agent') ||
         (fromNode.type === 'agent' && toNode.type === 'human'));
    });

    if (crossLayerEdges.length > 0) {
      const avgCrossResonance = crossLayerEdges.reduce((sum, e) => sum + e.strength, 0) / crossLayerEdges.length;
      if (avgCrossResonance > 0.7) {
        patterns.push('Strong human-agent resonance - Collaborative intelligence active');
      }
    }

    // Pattern: Elemental imbalance
    const avgElemental = this.calculateAverageElemental(nodes);
    const elements = [
      { name: 'Air', value: avgElemental.air },
      { name: 'Fire', value: avgElemental.fire },
      { name: 'Water', value: avgElemental.water },
      { name: 'Earth', value: avgElemental.earth }
    ];
    const sorted = elements.sort((a, b) => b.value - a.value);
    const imbalance = sorted[0].value - sorted[3].value;

    if (imbalance > 0.4) {
      patterns.push(`Elemental imbalance - ${sorted[0].name} dominant, ${sorted[3].name} deficient`);
    }

    // Pattern: Cascade activity
    const recentCascades = this.cascadeHistory.filter(
      c => c.timestamp.getTime() > Date.now() - 10 * 60 * 1000 // Last 10 min
    );
    if (recentCascades.length > 3) {
      patterns.push('High cascade activity - Transformation waves propagating');
    }

    return patterns;
  }

  /**
   * Get empty field coherence (no nodes)
   */
  private getEmptyFieldCoherence(): FieldCoherence {
    return {
      timestamp: new Date(),
      unifiedCoherence: 0,
      elementalBalance: { air: 0, fire: 0, water: 0, earth: 0, aether: 0, unified: 0 },
      humanLayerCoherence: 0,
      agentLayerCoherence: 0,
      nodeCount: { human: 0, agent: 0, total: 0 },
      averageResonance: 0,
      networkDensity: 0,
      collectiveIntelligence: 0,
      coherenceCascades: 0,
      emergentPatterns: []
    };
  }

  /**
   * Get resonance graph (for visualization)
   */
  getResonanceGraph(): {
    nodes: FieldNode[];
    edges: ResonanceEdge[];
  } {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()).flat()
    };
  }

  /**
   * Get cascade history
   */
  getCascadeHistory(limit: number = 20): CascadeEvent[] {
    return this.cascadeHistory.slice(-limit);
  }

  /**
   * Get coherence trend (last N measurements)
   */
  getCoherenceTrend(limit: number = 50): FieldCoherence[] {
    return this.coherenceHistory.slice(-limit);
  }
}

// Singleton
export const indrasWebField = new IndrasWebField();
