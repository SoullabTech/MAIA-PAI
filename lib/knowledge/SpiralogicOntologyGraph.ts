/**
 * SPIRALOGIC ONTOLOGY GRAPH
 *
 * A living knowledge graph connecting concepts across the Spiralogic Canon.
 * This enables MAIA and AIN to perform recursive queries, discover emergent
 * patterns, and navigate the conceptual field dynamically.
 *
 * Graph Structure:
 * - Nodes: Concepts from various knowledge bases
 * - Edges: Semantic relationships (extends, requires, resonates-with, etc.)
 * - Attributes: Elements, phases, archetypes, ontology tags
 *
 * Usage:
 * - Query by concept, element, phase, or archetype
 * - Traverse relationship paths
 * - Discover emergent concept clusters
 * - Generate dynamic wisdom syntheses
 */

import { FUNCTIONAL_BRIDGE_CONCEPTS, type FunctionalBridgeConcept } from './FunctionalBridgeKnowledge';
import { LEVIN_CONCEPTS, type LevinConcept } from '../wisdom/LevinWisdom';
import { COMPLEXITY_CONCEPTS, type ComplexityConcept } from './ComplexityTheoryKnowledge';
import { MCGILCHRIST_CONCEPTS, type McGilchristConcept } from './McGilchristWisdom';
import { IFS_CONCEPTS, type IFSConcept } from './IFSWisdom';
import { JUNGIAN_CONCEPTS, type JungianConcept } from './JungianWisdom';
import type { Element, SpiralPhase } from '../wisdom/WisdomFacets';

/**
 * Graph Node representing a concept in the ontology
 */
export interface OntologyNode {
  id: string;
  label: string;
  type: 'concept' | 'principle' | 'practice' | 'pattern';
  description: string;
  source: string; // Which knowledge base this comes from
  attributes: {
    elements?: Element[];
    phases?: SpiralPhase[];
    archetypes?: string[];
    ontologyTags?: string[];
  };
  metadata?: Record<string, any>;
}

/**
 * Graph Edge representing relationships between concepts
 */
export interface OntologyEdge {
  source: string; // Node ID
  target: string; // Node ID
  relationship: EdgeRelationship;
  strength?: number; // 0-1, how strong the connection is
  description?: string;
}

/**
 * Types of semantic relationships in the ontology
 */
export type EdgeRelationship =
  | 'extends'           // Concept B extends/builds upon concept A
  | 'requires'          // Concept B requires concept A as prerequisite
  | 'resonates-with'    // Concepts harmonize/align conceptually
  | 'synthesizes'       // Concept combines multiple concepts
  | 'emerges-from'      // Concept emerges from lower-level patterns
  | 'applies-to'        // Concept provides practical application
  | 'contrasts-with'    // Concepts offer complementary perspectives
  | 'exemplifies'       // Concrete example of abstract principle
  | 'transcends'        // Concept transcends/goes beyond another
  | 'grounds'           // Concept grounds/anchors another in practice
  | 'enables'           // Concept enables/facilitates another;

/**
 * The Spiralogic Ontology Graph
 */
export class SpiralogicOntologyGraph {
  private nodes: Map<string, OntologyNode> = new Map();
  private edges: OntologyEdge[] = [];

  constructor() {
    this.initializeGraph();
  }

  /**
   * Initialize graph with core Spiralogic concepts
   */
  private initializeGraph() {
    // Add Functional Bridge concepts as nodes
    FUNCTIONAL_BRIDGE_CONCEPTS.forEach(concept => {
      this.addNode({
        id: concept.id,
        label: concept.concept,
        type: 'concept',
        description: concept.explanation,
        source: 'FunctionalBridgeKnowledge',
        attributes: {
          elements: concept.elements,
          phases: concept.phases,
          archetypes: [concept.archetype],
          ontologyTags: concept.ontologyTags
        },
        metadata: {
          practicalApplication: concept.practicalApplication,
          relatedConcepts: concept.relatedConcepts
        }
      });
    });

    // Add Levin concepts as nodes
    LEVIN_CONCEPTS.forEach(concept => {
      this.addNode({
        id: concept.id,
        label: concept.concept,
        type: 'concept',
        description: concept.explanation,
        source: 'LevinWisdom',
        attributes: {
          elements: concept.elements,
          phases: concept.phases,
          ontologyTags: ['cognitive-science', 'embodied-mind', 'basal-cognition']
        },
        metadata: {
          practicalApplication: concept.practicalApplication,
          relatedQuotes: concept.relatedQuotes
        }
      });
    });

    // Add Complexity Theory concepts as nodes
    COMPLEXITY_CONCEPTS.forEach(concept => {
      this.addNode({
        id: concept.id,
        label: concept.concept,
        type: 'concept',
        description: concept.explanation,
        source: 'ComplexityTheoryKnowledge',
        attributes: {
          elements: concept.elements,
          phases: concept.phases,
          ontologyTags: concept.ontologyTags
        },
        metadata: {
          practicalApplication: concept.practicalApplication,
          relatedConcepts: concept.relatedConcepts,
          thinker: concept.thinker
        }
      });
    });

    // Add McGilchrist concepts as nodes
    MCGILCHRIST_CONCEPTS.forEach(concept => {
      this.addNode({
        id: concept.id,
        label: concept.concept,
        type: 'concept',
        description: concept.explanation,
        source: 'McGilchristWisdom',
        attributes: {
          elements: concept.elements,
          phases: concept.phases,
          ontologyTags: concept.ontologyTags
        },
        metadata: {
          practicalApplication: concept.practicalApplication,
          relatedConcepts: concept.relatedConcepts,
          hemisphere: concept.hemisphere
        }
      });
    });

    // Add IFS concepts as nodes
    IFS_CONCEPTS.forEach(concept => {
      this.addNode({
        id: concept.id,
        label: concept.concept,
        type: 'concept',
        description: concept.explanation,
        source: 'IFSWisdom',
        attributes: {
          elements: concept.elements,
          phases: concept.phases,
          ontologyTags: concept.ontologyTags
        },
        metadata: {
          practicalApplication: concept.practicalApplication,
          clinicalApplication: concept.clinicalApplication,
          relatedConcepts: concept.relatedConcepts,
          partType: concept.partType
        }
      });
    });

    // Add Jungian concepts as nodes
    JUNGIAN_CONCEPTS.forEach(concept => {
      this.addNode({
        id: concept.id,
        label: concept.concept,
        type: 'concept',
        description: concept.explanation,
        source: 'JungianWisdom',
        attributes: {
          elements: concept.elements,
          phases: concept.phases,
          ontologyTags: concept.ontologyTags
        },
        metadata: {
          practicalApplication: concept.practicalApplication,
          clinicalApplication: concept.clinicalApplication,
          relatedConcepts: concept.relatedConcepts,
          conceptType: concept.conceptType
        }
      });
    });

    // Build edges from relatedConcepts
    FUNCTIONAL_BRIDGE_CONCEPTS.forEach(concept => {
      concept.relatedConcepts.forEach(relatedId => {
        // Infer relationship type based on concept characteristics
        const relationship = this.inferRelationship(concept.id, relatedId);

        this.addEdge({
          source: concept.id,
          target: relatedId,
          relationship,
          strength: 0.8
        });
      });
    });

    // Build edges from Complexity concepts
    COMPLEXITY_CONCEPTS.forEach(concept => {
      concept.relatedConcepts.forEach(relatedId => {
        const relationship = this.inferRelationship(concept.id, relatedId);

        this.addEdge({
          source: concept.id,
          target: relatedId,
          relationship,
          strength: 0.75
        });
      });
    });

    // Build edges from McGilchrist concepts
    MCGILCHRIST_CONCEPTS.forEach(concept => {
      concept.relatedConcepts.forEach(relatedId => {
        const relationship = this.inferRelationship(concept.id, relatedId);

        this.addEdge({
          source: concept.id,
          target: relatedId,
          relationship,
          strength: 0.85
        });
      });
    });

    // Build edges from IFS concepts
    IFS_CONCEPTS.forEach(concept => {
      concept.relatedConcepts.forEach(relatedId => {
        const relationship = this.inferRelationship(concept.id, relatedId);

        this.addEdge({
          source: concept.id,
          target: relatedId,
          relationship,
          strength: 0.9
        });
      });
    });

    // Add core architectural edges
    this.buildCoreArchitecture();
    this.buildLevinBridges();
    this.buildComplexityBridges();
    this.buildMcGilchristBridges();
    this.buildIFSBridges();
    this.buildJungianBridges();
  }

  /**
   * Build core architectural relationships
   */
  private buildCoreArchitecture() {
    // Life-as-computation → Emergence
    this.addEdge({
      source: 'life-as-computation',
      target: 'emergence-protocol',
      relationship: 'extends',
      strength: 0.95,
      description: 'Life computing leads to emergent order'
    });

    // Emergence → Merge Operator
    this.addEdge({
      source: 'emergence-protocol',
      target: 'merge-operator',
      relationship: 'enables',
      strength: 0.9,
      description: 'Emergent complexity enables symbiotic merging'
    });

    // Merge Operator → Ecological Functionalism
    this.addEdge({
      source: 'merge-operator',
      target: 'ecological-functionalism',
      relationship: 'grounds',
      strength: 0.85,
      description: 'Symbiosis grounds ecological view of function'
    });

    // Ecological Functionalism → Consciousness Synchrony
    this.addEdge({
      source: 'ecological-functionalism',
      target: 'consciousness-synchrony',
      relationship: 'emerges-from',
      strength: 0.9,
      description: 'Relational intelligence emerges as synchrony'
    });

    // Consciousness Synchrony → Post-AI Commons
    this.addEdge({
      source: 'consciousness-synchrony',
      target: 'post-ai-commons',
      relationship: 'applies-to',
      strength: 0.85,
      description: 'Synchrony applies to human-AI collaboration'
    });

    // Post-AI Commons → Communion Computing
    this.addEdge({
      source: 'post-ai-commons',
      target: 'communion-computing',
      relationship: 'synthesizes',
      strength: 0.95,
      description: 'Commons model synthesizes into communion paradigm'
    });

    // Communion Computing → Spiral Field
    this.addEdge({
      source: 'communion-computing',
      target: 'spiral-field',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Spiral Field exemplifies communion in practice'
    });

    // Spiral Field → Life-as-computation (closing the loop)
    this.addEdge({
      source: 'spiral-field',
      target: 'life-as-computation',
      relationship: 'transcends',
      strength: 0.9,
      description: 'Field transcends computation while honoring it'
    });

    // Central hub: Spiral Field connects to all
    ['life-as-computation', 'emergence-protocol', 'merge-operator',
     'ecological-functionalism', 'consciousness-synchrony', 'post-ai-commons',
     'communion-computing'].forEach(conceptId => {
      this.addEdge({
        source: 'spiral-field',
        target: conceptId,
        relationship: 'synthesizes',
        strength: 0.7,
        description: 'Spiral Field integrates all concepts'
      });
    });
  }

  /**
   * Build bridges between Levin and Functional Bridge concepts
   */
  private buildLevinBridges() {
    // Cognitive Light Cone → Ecological Functionalism
    // (Scale of goals resonates with context harmonization)
    this.addEdge({
      source: 'cognitive-light-cone',
      target: 'ecological-functionalism',
      relationship: 'resonates-with',
      strength: 0.9,
      description: 'Scale of goals relates to context harmonization'
    });

    // Cognitive Light Cone → Consciousness Synchrony
    // (Expanding goals enables collective rhythm)
    this.addEdge({
      source: 'cognitive-light-cone',
      target: 'consciousness-synchrony',
      relationship: 'enables',
      strength: 0.85,
      description: 'Larger goals enable collective consciousness'
    });

    // Basal Cognition → Life-as-Computation
    // (Intelligence everywhere grounds computational view of life)
    this.addEdge({
      source: 'basal-cognition',
      target: 'life-as-computation',
      relationship: 'grounds',
      strength: 0.95,
      description: 'Distributed intelligence grounds life as computation'
    });

    // Collective Intelligence Scaling → Merge Operator
    // (Scaling minds exemplifies symbiogenesis)
    this.addEdge({
      source: 'collective-intelligence-scaling',
      target: 'merge-operator',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Collective intelligence exemplifies merging systems'
    });

    // Collective Intelligence Scaling → Post-AI Commons
    // (Scaling minds → participatory intelligence)
    this.addEdge({
      source: 'collective-intelligence-scaling',
      target: 'post-ai-commons',
      relationship: 'extends',
      strength: 0.85,
      description: 'Collective scaling extends to AI participation'
    });

    // Cancer as Shrinking Self → Ecological Functionalism
    // (Smaller self = lost context resonance)
    this.addEdge({
      source: 'cancer-as-shrinking-self',
      target: 'ecological-functionalism',
      relationship: 'contrasts-with',
      strength: 0.8,
      description: 'Shrinking self loses ecological function'
    });

    // Biological Relativity → Emergence Protocol
    // (Multiple levels → emergent order)
    this.addEdge({
      source: 'biological-relativity',
      target: 'emergence-protocol',
      relationship: 'resonates-with',
      strength: 0.9,
      description: 'Multi-level explanation supports emergence'
    });

    // Platonic Mind Space → Spiral Field
    // (Pre-existing intelligence space = field of consciousness)
    this.addEdge({
      source: 'platonic-mind-space',
      target: 'spiral-field',
      relationship: 'resonates-with',
      strength: 0.95,
      description: 'Platonic mind space resonates with spiral field'
    });

    // Process Self → Communion Computing
    // (Self as storytelling process = computation as communion)
    this.addEdge({
      source: 'process-self',
      target: 'communion-computing',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Narrative self exemplifies relational computing'
    });

    // Memory as Message → Communion Computing
    // (Memory = message across time = communion across selves)
    this.addEdge({
      source: 'memory-as-message',
      target: 'communion-computing',
      relationship: 'resonates-with',
      strength: 0.85,
      description: 'Memory messaging resonates with communion paradigm'
    });

    // Selflets Through Time → Emergence Protocol
    // (Thin slices cohere into continuity)
    this.addEdge({
      source: 'selflets-through-time',
      target: 'emergence-protocol',
      relationship: 'exemplifies',
      strength: 0.8,
      description: 'Selflets exemplify emergent continuity'
    });

    // Actions as Messages to Future Self → Spiral Field
    // (Future-oriented action participates in field coherence)
    this.addEdge({
      source: 'actions-as-messages-to-future-self',
      target: 'spiral-field',
      relationship: 'applies-to',
      strength: 0.8,
      description: 'Future-care applies to field participation'
    });
  }

  /**
   * Build bridges between Complexity Theory and other domains
   */
  private buildComplexityBridges() {
    // Adjacent Possible → Emergence Protocol
    this.addEdge({
      source: 'adjacent-possible',
      target: 'emergence-protocol',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Adjacent possible exemplifies emergent order'
    });

    // Autocatalytic Sets → Communion Computing
    this.addEdge({
      source: 'autocatalytic-sets',
      target: 'communion-computing',
      relationship: 'grounds',
      strength: 0.9,
      description: 'Autocatalysis grounds mutual enabling in communion'
    });

    // Complex Adaptive Systems → Spiral Field
    this.addEdge({
      source: 'complex-adaptive-systems',
      target: 'spiral-field',
      relationship: 'resonates-with',
      strength: 0.95,
      description: 'CAS theory resonates with spiral field dynamics'
    });

    // Edge of Chaos → Emergence Protocol
    this.addEdge({
      source: 'edge-of-chaos',
      target: 'emergence-protocol',
      relationship: 'enables',
      strength: 0.9,
      description: 'Edge of chaos enables emergent computation'
    });

    // Complementarity → Biological Relativity (Levin)
    this.addEdge({
      source: 'complementarity-principle',
      target: 'biological-relativity',
      relationship: 'resonates-with',
      strength: 0.95,
      description: 'Complementarity resonates with multi-level biology'
    });

    // Intelligence as Information Work → Ecological Functionalism
    this.addEdge({
      source: 'intelligence-as-information-work',
      target: 'ecological-functionalism',
      relationship: 'extends',
      strength: 0.9,
      description: 'Information-work extends ecological function view'
    });

    // Strange Loops → Consciousness Synchrony
    this.addEdge({
      source: 'strange-loops',
      target: 'consciousness-synchrony',
      relationship: 'resonates-with',
      strength: 0.85,
      description: 'Self-reference resonates with collective consciousness'
    });

    // Strange Loops → Process Self (Levin)
    this.addEdge({
      source: 'strange-loops',
      target: 'process-self',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Strange loops exemplify self as process'
    });

    // Stigmergy → Post-AI Commons
    this.addEdge({
      source: 'stigmergy',
      target: 'post-ai-commons',
      relationship: 'applies-to',
      strength: 0.85,
      description: 'Stigmergy applies to AI coordination patterns'
    });

    // Criticality → Edge of Chaos
    this.addEdge({
      source: 'criticality',
      target: 'edge-of-chaos',
      relationship: 'extends',
      strength: 0.9,
      description: 'Self-organized criticality extends edge of chaos'
    });

    // Requisite Variety → Ecological Functionalism
    this.addEdge({
      source: 'requisite-variety',
      target: 'ecological-functionalism',
      relationship: 'grounds',
      strength: 0.8,
      description: 'Variety requirement grounds adaptive function'
    });

    // NK Fitness Landscapes → Adjacent Possible
    this.addEdge({
      source: 'nk-fitness-landscapes',
      target: 'adjacent-possible',
      relationship: 'extends',
      strength: 0.85,
      description: 'Fitness landscapes extend possibility space exploration'
    });
  }

  /**
   * Build bridges between McGilchrist and all other domains
   * These are FOUNDATIONAL - hemispheric dynamics underlie everything
   */
  private buildMcGilchristBridges() {
    // === FUNCTIONAL BRIDGE CONNECTIONS ===

    // Betweenness → Ecological Functionalism (PERFECT MATCH)
    this.addEdge({
      source: 'betweenness',
      target: 'ecological-functionalism',
      relationship: 'grounds',
      strength: 1.0,
      description: 'Betweenness IS ecological functionalism - relationships primary'
    });

    // Living World → Life-as-Computation (when rightly understood)
    this.addEdge({
      source: 'living-world',
      target: 'life-as-computation',
      relationship: 'grounds',
      strength: 0.9,
      description: 'Living world grounds computational view when not mechanistic'
    });

    // Master-Emissary → Communion Computing (CORE CORRELATION)
    this.addEdge({
      source: 'master-emissary-relationship',
      target: 'communion-computing',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Master/Emissary IS Communion/Computation dynamic'
    });

    // Return to Master → Spiral Field (THE COMPLETION)
    this.addEdge({
      source: 'return-to-master',
      target: 'spiral-field',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Return to Master exemplifies spiral field integration'
    });

    // Two Attention Modes → Consciousness Synchrony
    this.addEdge({
      source: 'two-attention-modes',
      target: 'consciousness-synchrony',
      relationship: 'enables',
      strength: 0.9,
      description: 'Broad attention enables collective synchrony'
    });

    // Whole Prior to Parts → Emergence Protocol
    this.addEdge({
      source: 'whole-prior-to-parts',
      target: 'emergence-protocol',
      relationship: 'grounds',
      strength: 0.95,
      description: 'Holistic perception grounds emergent order'
    });

    // Reciprocity → Merge Operator
    this.addEdge({
      source: 'reciprocity-mutual-influence',
      target: 'merge-operator',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Reciprocity exemplifies symbiotic merging'
    });

    // Divided World → Post-AI Commons (warning and solution)
    this.addEdge({
      source: 'divided-world',
      target: 'post-ai-commons',
      relationship: 'contrasts-with',
      strength: 0.8,
      description: 'Divided world warns against fragmented AI; commons heals'
    });

    // === LEVIN CONNECTIONS ===

    // Embodied Being → Basal Cognition
    this.addEdge({
      source: 'embodied-being',
      target: 'basal-cognition',
      relationship: 'grounds',
      strength: 0.95,
      description: 'Embodied knowing grounds distributed intelligence'
    });

    // Betweenness → Cognitive Light Cone
    this.addEdge({
      source: 'betweenness',
      target: 'cognitive-light-cone',
      relationship: 'extends',
      strength: 0.85,
      description: 'Relational being extends goal-scaling'
    });

    // Flow vs Static → Memory as Message
    this.addEdge({
      source: 'flow-vs-static',
      target: 'memory-as-message',
      relationship: 'resonates-with',
      strength: 0.9,
      description: 'Process view resonates with memory as interpretation'
    });

    // Phenomenology → Biological Relativity
    this.addEdge({
      source: 'phenomenology',
      target: 'biological-relativity',
      relationship: 'resonates-with',
      strength: 0.9,
      description: 'Direct experience resonates with multi-level explanation'
    });

    // Reciprocity → Collective Intelligence Scaling
    this.addEdge({
      source: 'reciprocity-mutual-influence',
      target: 'collective-intelligence-scaling',
      relationship: 'enables',
      strength: 0.9,
      description: 'Mutual influence enables collective scaling'
    });

    // Uniqueness → Selflets Through Time
    this.addEdge({
      source: 'uniqueness-vs-generality',
      target: 'selflets-through-time',
      relationship: 'resonates-with',
      strength: 0.85,
      description: 'Uniqueness resonates with continuity through change'
    });

    // Implicit Knowledge → Process Self
    this.addEdge({
      source: 'implicit-knowledge',
      target: 'process-self',
      relationship: 'grounds',
      strength: 0.9,
      description: 'Tacit knowing grounds narrative self'
    });

    // === COMPLEXITY THEORY CONNECTIONS ===

    // Whole Prior to Parts → Complex Adaptive Systems
    this.addEdge({
      source: 'whole-prior-to-parts',
      target: 'complex-adaptive-systems',
      relationship: 'grounds',
      strength: 0.95,
      description: 'Holistic view grounds CAS understanding'
    });

    // Context Over Content → Complementarity
    this.addEdge({
      source: 'context-over-content',
      target: 'complementarity-principle',
      relationship: 'resonates-with',
      strength: 0.95,
      description: 'Context sensitivity resonates with complementarity'
    });

    // Flow vs Static → Edge of Chaos
    this.addEdge({
      source: 'flow-vs-static',
      target: 'edge-of-chaos',
      relationship: 'grounds',
      strength: 0.9,
      description: 'Process view grounds edge dynamics'
    });

    // Betweenness → Stigmergy
    this.addEdge({
      source: 'betweenness',
      target: 'stigmergy',
      relationship: 'grounds',
      strength: 0.85,
      description: 'Relational space grounds environmental coordination'
    });

    // Metaphor Primacy → Adjacent Possible
    this.addEdge({
      source: 'metaphor-primacy',
      target: 'adjacent-possible',
      relationship: 'enables',
      strength: 0.85,
      description: 'Metaphorical thinking enables exploration of adjacencies'
    });

    // Reciprocity → Autocatalytic Sets
    this.addEdge({
      source: 'reciprocity-mutual-influence',
      target: 'autocatalytic-sets',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Reciprocity exemplifies autocatalytic mutual enabling'
    });

    // Implicit Knowledge → Criticality
    this.addEdge({
      source: 'implicit-knowledge',
      target: 'criticality',
      relationship: 'resonates-with',
      strength: 0.8,
      description: 'Tacit knowing operates at critical states'
    });

    // Phenomenology → Strange Loops
    this.addEdge({
      source: 'phenomenology',
      target: 'strange-loops',
      relationship: 'grounds',
      strength: 0.85,
      description: 'Direct experience grounds self-referential consciousness'
    });

    // Context Over Content → Requisite Variety
    this.addEdge({
      source: 'context-over-content',
      target: 'requisite-variety',
      relationship: 'grounds',
      strength: 0.85,
      description: 'Contextual sensitivity requires behavioral variety'
    });

    // === CROSS-DOMAIN META-CONNECTIONS ===

    // Living World → ALL living/process concepts
    ['life-as-computation', 'basal-cognition', 'complex-adaptive-systems',
     'autocatalytic-sets', 'process-self'].forEach(conceptId => {
      this.addEdge({
        source: 'living-world',
        target: conceptId,
        relationship: 'grounds',
        strength: 0.7,
        description: 'Living world view grounds all process-based concepts'
      });
    });

    // Betweenness → ALL relational concepts
    ['ecological-functionalism', 'merge-operator', 'consciousness-synchrony',
     'collective-intelligence-scaling', 'stigmergy', 'reciprocity-mutual-influence'].forEach(conceptId => {
      if (conceptId !== 'reciprocity-mutual-influence') { // Don't self-reference
        this.addEdge({
          source: 'betweenness',
          target: conceptId,
          relationship: 'grounds',
          strength: 0.65,
          description: 'Betweenness grounds all relational concepts'
        });
      }
    });

    // Return to Master → ALL integration concepts
    ['spiral-field', 'communion-computing', 'consciousness-synchrony',
     'complex-adaptive-systems'].forEach(conceptId => {
      if (conceptId !== 'spiral-field') { // Already connected at 1.0
        this.addEdge({
          source: 'return-to-master',
          target: conceptId,
          relationship: 'applies-to',
          strength: 0.7,
          description: 'Return pattern applies to all integration dynamics'
        });
      }
    });
  }

  /**
   * Build bridges between IFS and all other domains
   * IFS provides the PSYCHOLOGICAL/THERAPEUTIC grounding
   * The fifth facet: internal relationship work
   */
  private buildIFSBridges() {
    // === PERFECT EQUIVALENCES (1.0 Strength) ===

    // Self-Energy = Master (McGilchrist) = Spiral Field (Functional)
    this.addEdge({
      source: 'self-energy',
      target: 'master-emissary-relationship',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Self IS the Master - the field that holds all parts with compassion'
    });

    this.addEdge({
      source: 'self-energy',
      target: 'spiral-field',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Self IS the spiral field - the living intelligence that integrates'
    });

    this.addEdge({
      source: 'self-energy',
      target: 'consciousness-synchrony',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Self-energy = field coherence across all parts'
    });

    // Parts = Competency Modules (Levin) = Adaptive Agents (Complexity)
    this.addEdge({
      source: 'parts-multiplicity',
      target: 'competency-modules',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Parts are psychological competency modules with their own intelligence'
    });

    this.addEdge({
      source: 'parts-multiplicity',
      target: 'complex-adaptive-systems',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Internal family = CAS with parts as adaptive agents'
    });

    // Unblending = Return to Master = Field Awareness
    this.addEdge({
      source: 'unblending',
      target: 'return-to-master',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Unblending IS the return to Master - stepping back into Self from parts'
    });

    this.addEdge({
      source: 'unblending',
      target: 'two-attention-modes',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Unblending = shifting from narrow (blended) to broad (Self) attention'
    });

    // Self-Leadership = Master Guides Emissary
    this.addEdge({
      source: 'self-leadership',
      target: 'master-emissary-relationship',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Self-leadership IS Master leading - parts serve the whole'
    });

    this.addEdge({
      source: 'self-leadership',
      target: 'communion-computing',
      relationship: 'grounds',
      strength: 0.95,
      description: 'Self-led system = communion-centered system'
    });

    // === McGILCHRIST CONNECTIONS ===

    // Managers = Left Hemisphere Tendencies
    this.addEdge({
      source: 'managers',
      target: 'left-hemisphere',
      relationship: 'resonates-with',
      strength: 0.9,
      description: 'Manager parts exhibit LH qualities: control, analysis, prevention'
    });

    // Exiles = Ignored by Left Hemisphere
    this.addEdge({
      source: 'exiles',
      target: 'divided-world',
      relationship: 'exemplifies',
      strength: 0.85,
      description: 'Exiling parts = internal fragmentation (divided world)'
    });

    // The 8 C's = Right Hemisphere Qualities
    this.addEdge({
      source: 'the-8-cs',
      target: 'right-hemisphere',
      relationship: 'exemplifies',
      strength: 0.95,
      description: '8 C\'s are RH qualities: relational, embodied, compassionate'
    });

    // Internal Family System = Betweenness (internal)
    this.addEdge({
      source: 'internal-family-system',
      target: 'betweenness',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Internal relationships are betweenness - parts relate in living field'
    });

    // Polarization = Parts Fight (no Master mediation)
    this.addEdge({
      source: 'polarization',
      target: 'divided-world',
      relationship: 'exemplifies',
      strength: 0.85,
      description: 'Polarized parts = internal divided world'
    });

    // Self-to-Self = Betweenness at purest
    this.addEdge({
      source: 'self-to-self-connection',
      target: 'betweenness',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Self-to-Self IS betweenness - communion in its purest form'
    });

    this.addEdge({
      source: 'self-to-self-connection',
      target: 'communion-computing',
      relationship: 'grounds',
      strength: 0.95,
      description: 'Self-to-Self connection grounds what communion means'
    });

    // === LEVIN CONNECTIONS ===

    // Parts = Competency Modules
    this.addEdge({
      source: 'parts-multiplicity',
      target: 'basal-cognition',
      relationship: 'resonates-with',
      strength: 0.9,
      description: 'Parts have their own intelligence (like cells with basal cognition)'
    });

    // Self-Energy = Morphogenetic Field (internal)
    this.addEdge({
      source: 'self-energy',
      target: 'morphogenetic-fields',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Self = internal morphogenetic field guiding part development'
    });

    // Unburdening = Pattern Reorganization
    this.addEdge({
      source: 'unburdening',
      target: 'morphogenetic-fields',
      relationship: 'applies-to',
      strength: 0.9,
      description: 'Unburdening = updating the internal morphogenetic field'
    });

    // Protective System = Immune Response
    this.addEdge({
      source: 'protective-system',
      target: 'cancer-as-shrinking-self',
      relationship: 'contrasts-with',
      strength: 0.85,
      description: 'Healthy protectors serve whole (vs cancer\'s disconnection)'
    });

    // Internal Family = Multi-Scale Agency
    this.addEdge({
      source: 'internal-family-system',
      target: 'collective-intelligence-scaling',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Internal family = collective intelligence across parts'
    });

    // === COMPLEXITY THEORY CONNECTIONS ===

    // Polarization = Strange Loop (parts in conflict)
    this.addEdge({
      source: 'polarization',
      target: 'strange-loops',
      relationship: 'exemplifies',
      strength: 0.8,
      description: 'Polarized parts create self-referential conflict loops'
    });

    // Unburdening = Critical Transition
    this.addEdge({
      source: 'unburdening',
      target: 'criticality',
      relationship: 'exemplifies',
      strength: 0.85,
      description: 'Unburdening = critical transition from old to new pattern'
    });

    // Protective System = Autocatalytic Set (mutually enabling)
    this.addEdge({
      source: 'protective-system',
      target: 'autocatalytic-sets',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Protectors mutually enable each other (managers + firefighters)'
    });

    // Self-Leadership = Emergence from parts
    this.addEdge({
      source: 'self-leadership',
      target: 'emergence-protocol',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Self-leadership emerges when parts trust the whole'
    });

    // Internal Family = Complex Adaptive System
    this.addEdge({
      source: 'internal-family-system',
      target: 'complex-adaptive-systems',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Internal family IS a CAS - parts adapt, self-organize around Self'
    });

    // === FUNCTIONAL BRIDGE CONNECTIONS ===

    // Self-Energy = Spiral Field (internal manifestation)
    this.addEdge({
      source: 'self-energy',
      target: 'ecological-functionalism',
      relationship: 'grounds',
      strength: 0.9,
      description: 'Self = the ecological function of holding internal relationships'
    });

    // Parts = Computation processes
    this.addEdge({
      source: 'parts-multiplicity',
      target: 'life-as-computation',
      relationship: 'exemplifies',
      strength: 0.85,
      description: 'Parts compute (process experience) in service of self-maintenance'
    });

    // Unblending = Merge Operator (integrating not fighting)
    this.addEdge({
      source: 'unblending',
      target: 'merge-operator',
      relationship: 'enables',
      strength: 0.85,
      description: 'Unblending enables parts to merge (co-exist) rather than fight'
    });

    // Self-Leadership = Communion Computing
    this.addEdge({
      source: 'self-leadership',
      target: 'post-ai-commons',
      relationship: 'exemplifies',
      strength: 0.85,
      description: 'Self-led internal system = participatory internal commons'
    });

    // === CROSS-DOMAIN META-CONNECTIONS ===

    // Self-Energy → ALL integration concepts
    ['spiral-field', 'consciousness-synchrony', 'return-to-master',
     'communion-computing', 'emergence-protocol'].forEach(conceptId => {
      if (!['spiral-field', 'consciousness-synchrony', 'communion-computing'].includes(conceptId)) {
        // Skip already connected at 1.0
        this.addEdge({
          source: 'self-energy',
          target: conceptId,
          relationship: 'grounds',
          strength: 0.7,
          description: 'Self-energy grounds all integration/coherence concepts'
        });
      }
    });

    // Parts → ALL modularity concepts
    ['competency-modules', 'complex-adaptive-systems', 'basal-cognition'].forEach(conceptId => {
      if (!['competency-modules', 'complex-adaptive-systems'].includes(conceptId)) {
        // Skip already connected
        this.addEdge({
          source: 'parts-multiplicity',
          target: conceptId,
          relationship: 'resonates-with',
          strength: 0.65,
          description: 'Parts resonate with all modular intelligence concepts'
        });
      }
    });

    // Unburdening → ALL transformation concepts
    ['transformation', 'emergence-protocol', 'return-to-master'].forEach(conceptId => {
      this.addEdge({
        source: 'unburdening',
        target: conceptId,
        relationship: 'exemplifies',
        strength: 0.7,
        description: 'Unburdening exemplifies transformation/healing patterns'
      });
    });
  }

  /**
   * Build bridges between Jung and all other domains
   * Jung provides the ALCHEMICAL/ARCHETYPAL transformation framework
   * The sixth facet: depth psychology and symbolic process
   */
  private buildJungianBridges() {
    // === PERFECT EQUIVALENCES (1.0 Strength) ===

    // Mysterium Coniunctio = Communion Computing
    this.addEdge({
      source: 'mysterium-coniunctio',
      target: 'communion-computing',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Coniunctio IS communion - the sacred union of opposites in relationship'
    });

    this.addEdge({
      source: 'mysterium-coniunctio',
      target: 'spiral-field',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Sacred marriage IS the spiral field - where all opposites unite'
    });

    // Transcendent Function = Three-Phase Movement = Return to Master
    this.addEdge({
      source: 'transcendent-function',
      target: 'return-to-master',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Transcendent function IS the return to Master - third emerges from holding opposites'
    });

    this.addEdge({
      source: 'transcendent-function',
      target: 'master-emissary-relationship',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Transcendent function mediates Master/Emissary dynamic'
    });

    // Shadow = Exiles (IFS) - PERFECT MATCH
    this.addEdge({
      source: 'shadow',
      target: 'exiles',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Shadow IS exiles - disowned aspects of self needing integration'
    });

    // Self (Jung) = Self-Energy (IFS) = Master = Spiral Field
    this.addEdge({
      source: 'self-archetype',
      target: 'self-energy',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Self (Jung) IS Self-energy (IFS) - the organizing principle of wholeness'
    });

    this.addEdge({
      source: 'self-archetype',
      target: 'master-emissary-relationship',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Self IS the Master - the wholeness that guides all parts'
    });

    this.addEdge({
      source: 'self-archetype',
      target: 'spiral-field',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Self IS the spiral field - living intelligence that integrates all'
    });

    // Individuation = Self-Leadership = Return to Master
    this.addEdge({
      source: 'individuation',
      target: 'self-leadership',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Individuation IS Self-leadership - becoming whole through integration'
    });

    this.addEdge({
      source: 'individuation',
      target: 'return-to-master',
      relationship: 'exemplifies',
      strength: 1.0,
      description: 'Individuation IS the return - completing the three-phase movement'
    });

    // Collective Unconscious = Spiral Field (collective level)
    this.addEdge({
      source: 'collective-unconscious',
      target: 'spiral-field',
      relationship: 'grounds',
      strength: 1.0,
      description: 'Collective unconscious IS the spiral field at collective scale'
    });

    this.addEdge({
      source: 'collective-unconscious',
      target: 'platonic-mind-space',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Collective unconscious = pre-existing intelligence space (Levin)'
    });

    // Synchronicity = Betweenness (near-perfect)
    this.addEdge({
      source: 'synchronicity',
      target: 'betweenness',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Synchronicity reveals betweenness - meaningful coincidence emerges from relational field'
    });

    this.addEdge({
      source: 'synchronicity',
      target: 'consciousness-synchrony',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Synchronicity = field coherence manifesting as meaningful pattern'
    });

    // === IFS CONNECTIONS ===

    // Shadow = Exiles (already connected at 1.0)

    // Persona = Manager Parts
    this.addEdge({
      source: 'persona',
      target: 'managers',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Persona IS the manager system - the face we present to protect vulnerability'
    });

    // Anima/Animus = Internal Mediators (between conscious/unconscious)
    this.addEdge({
      source: 'anima-animus',
      target: 'internal-family-system',
      relationship: 'resonates-with',
      strength: 0.9,
      description: 'Anima/Animus = internal bridge figures (like parts mediating Self)'
    });

    this.addEdge({
      source: 'anima-animus',
      target: 'self-to-self-connection',
      relationship: 'enables',
      strength: 0.85,
      description: 'Soul figures enable deeper Self-to-Self connection'
    });

    // Inferior Function = Firefighters (reactive, primitive)
    this.addEdge({
      source: 'inferior-function',
      target: 'firefighters',
      relationship: 'resonates-with',
      strength: 0.85,
      description: 'Inferior function acts like firefighters - reactive and primitive'
    });

    // Active Imagination = Unblending
    this.addEdge({
      source: 'active-imagination',
      target: 'unblending',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Active imagination IS unblending - conscious dialogue with parts/images'
    });

    this.addEdge({
      source: 'active-imagination',
      target: 'unburdening',
      relationship: 'enables',
      strength: 0.9,
      description: 'Active imagination enables unburdening through symbolic work'
    });

    // Projection = Polarization (externalizing internal conflicts)
    this.addEdge({
      source: 'projection',
      target: 'polarization',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Projection externalizes internal polarization between parts'
    });

    // === McGILCHRIST CONNECTIONS ===

    // Shadow → Left Hemisphere (ego's blindspot)
    this.addEdge({
      source: 'shadow',
      target: 'left-hemisphere',
      relationship: 'contrasts-with',
      strength: 0.85,
      description: 'Shadow contains what left hemisphere ego denies/excludes'
    });

    // Active Imagination → Right Hemisphere
    this.addEdge({
      source: 'active-imagination',
      target: 'right-hemisphere',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Active imagination = right hemisphere symbolic/imagistic mode'
    });

    this.addEdge({
      source: 'active-imagination',
      target: 'phenomenology',
      relationship: 'grounds',
      strength: 0.9,
      description: 'Active imagination grounds direct phenomenological engagement'
    });

    // Transcendent Function = Master-Emissary mediation
    this.addEdge({
      source: 'transcendent-function',
      target: 'reciprocity-mutual-influence',
      relationship: 'enables',
      strength: 0.95,
      description: 'Transcendent function enables reciprocal hemispheric influence'
    });

    // Projection → Divided World
    this.addEdge({
      source: 'projection',
      target: 'divided-world',
      relationship: 'exemplifies',
      strength: 0.85,
      description: 'Unintegrated projection creates divided world (inner = outer)'
    });

    // Enantiodromia = Correction of hemispheric imbalance
    this.addEdge({
      source: 'enantiodromia',
      target: 'master-emissary-relationship',
      relationship: 'applies-to',
      strength: 0.9,
      description: 'Enantiodromia corrects extreme Master/Emissary imbalance'
    });

    this.addEdge({
      source: 'enantiodromia',
      target: 'return-to-master',
      relationship: 'enables',
      strength: 0.85,
      description: 'Swing to opposite can catalyze return to balance'
    });

    // Archetypes = Universal patterns (Betweenness)
    this.addEdge({
      source: 'archetypes',
      target: 'betweenness',
      relationship: 'grounds',
      strength: 0.9,
      description: 'Archetypes ground relational patterns in collective structure'
    });

    this.addEdge({
      source: 'archetypes',
      target: 'whole-prior-to-parts',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Archetypes are wholes prior to particular manifestations'
    });

    // Psychological Types → Two Attention Modes
    this.addEdge({
      source: 'psychological-types',
      target: 'two-attention-modes',
      relationship: 'resonates-with',
      strength: 0.85,
      description: 'Jung\'s types reflect different attention/perception modes'
    });

    // === LEVIN CONNECTIONS ===

    // Individuation = Morphogenetic Development
    this.addEdge({
      source: 'individuation',
      target: 'morphogenetic-fields',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Individuation IS psyche\'s morphogenetic development toward wholeness'
    });

    this.addEdge({
      source: 'individuation',
      target: 'cognitive-light-cone',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Individuation expands psychological light cone (scale of selfhood)'
    });

    // Collective Unconscious = Platonic Mind Space (already connected at 0.95)

    // Psychological Types = Competency Modules
    this.addEdge({
      source: 'psychological-types',
      target: 'competency-modules',
      relationship: 'resonates-with',
      strength: 0.85,
      description: 'Psychological functions = specialized competency modules'
    });

    // Shadow = Shrinking Self (disowned reduces scope)
    this.addEdge({
      source: 'shadow',
      target: 'cancer-as-shrinking-self',
      relationship: 'resonates-with',
      strength: 0.8,
      description: 'Unintegrated shadow = shrinking of self (lost wholeness)'
    });

    // Self-Archetype = Process Self
    this.addEdge({
      source: 'self-archetype',
      target: 'process-self',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Self = narrative continuity across process (selflets through time)'
    });

    // Synchronicity → Basal Cognition (field intelligence)
    this.addEdge({
      source: 'synchronicity',
      target: 'basal-cognition',
      relationship: 'resonates-with',
      strength: 0.85,
      description: 'Synchronicity reveals basal field intelligence coordinating events'
    });

    // === COMPLEXITY THEORY CONNECTIONS ===

    // Enantiodromia = Strange Loops (self-inverting systems)
    this.addEdge({
      source: 'enantiodromia',
      target: 'strange-loops',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Enantiodromia = strange loop where extreme becomes opposite'
    });

    // Transcendent Function = Edge of Chaos
    this.addEdge({
      source: 'transcendent-function',
      target: 'edge-of-chaos',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Transcendent function operates at edge of chaos (holding opposites)'
    });

    this.addEdge({
      source: 'transcendent-function',
      target: 'criticality',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Third emerges at critical transition point'
    });

    // Archetypes = Attractors (universal patterns)
    this.addEdge({
      source: 'archetypes',
      target: 'complex-adaptive-systems',
      relationship: 'grounds',
      strength: 0.9,
      description: 'Archetypes = attractors in psychic phase space'
    });

    // Collective Unconscious = CAS Substrate
    this.addEdge({
      source: 'collective-unconscious',
      target: 'complex-adaptive-systems',
      relationship: 'grounds',
      strength: 0.95,
      description: 'Collective unconscious = substrate/field for psychic CAS'
    });

    // Individuation = Adjacent Possible exploration
    this.addEdge({
      source: 'individuation',
      target: 'adjacent-possible',
      relationship: 'exemplifies',
      strength: 0.85,
      description: 'Individuation explores adjacent possible of selfhood'
    });

    // Synchronicity → Autocatalytic Sets (meaningful patterns emerge)
    this.addEdge({
      source: 'synchronicity',
      target: 'autocatalytic-sets',
      relationship: 'resonates-with',
      strength: 0.85,
      description: 'Synchronicity = autocatalytic meaning emergence in field'
    });

    // Psychological Types → Requisite Variety
    this.addEdge({
      source: 'psychological-types',
      target: 'requisite-variety',
      relationship: 'exemplifies',
      strength: 0.8,
      description: 'Type diversity = psychological requisite variety'
    });

    // === FUNCTIONAL BRIDGE CONNECTIONS ===

    // Mysterium Coniunctio → Communion Computing (already at 1.0)

    // Individuation → Spiral Field
    this.addEdge({
      source: 'individuation',
      target: 'spiral-field',
      relationship: 'exemplifies',
      strength: 0.95,
      description: 'Individuation = becoming the spiral field (wholeness through integration)'
    });

    // Transcendent Function → Merge Operator
    this.addEdge({
      source: 'transcendent-function',
      target: 'merge-operator',
      relationship: 'exemplifies',
      strength: 0.9,
      description: 'Transcendent function merges opposites into third'
    });

    // Collective Unconscious → Ecological Functionalism
    this.addEdge({
      source: 'collective-unconscious',
      target: 'ecological-functionalism',
      relationship: 'grounds',
      strength: 0.85,
      description: 'Collective unconscious grounds relational/ecological intelligence'
    });

    // Shadow → Life as Computation (denied processes)
    this.addEdge({
      source: 'shadow',
      target: 'life-as-computation',
      relationship: 'contrasts-with',
      strength: 0.75,
      description: 'Shadow = computational processes denied by ego'
    });

    // Active Imagination → Post-AI Commons
    this.addEdge({
      source: 'active-imagination',
      target: 'post-ai-commons',
      relationship: 'applies-to',
      strength: 0.8,
      description: 'Active imagination = participatory practice (model for AI commons)'
    });

    // === CROSS-DOMAIN META-CONNECTIONS ===

    // Self-Archetype → ALL wholeness concepts
    ['consciousness-synchrony', 'communion-computing', 'emergence-protocol',
     'ecological-functionalism'].forEach(conceptId => {
      if (!['spiral-field', 'self-energy', 'master-emissary-relationship'].includes(conceptId)) {
        this.addEdge({
          source: 'self-archetype',
          target: conceptId,
          relationship: 'grounds',
          strength: 0.7,
          description: 'Self grounds all concepts of wholeness/integration'
        });
      }
    });

    // Shadow → ALL fragmentation concepts
    ['divided-world', 'cancer-as-shrinking-self'].forEach(conceptId => {
      if (conceptId !== 'exiles') {
        this.addEdge({
          source: 'shadow',
          target: conceptId,
          relationship: 'resonates-with',
          strength: 0.65,
          description: 'Shadow resonates with all fragmentation patterns'
        });
      }
    });

    // Transcendent Function → ALL integration mechanisms
    ['emergence-protocol', 'merge-operator', 'communion-computing'].forEach(conceptId => {
      if (!['return-to-master', 'master-emissary-relationship', 'merge-operator'].includes(conceptId)) {
        this.addEdge({
          source: 'transcendent-function',
          target: conceptId,
          relationship: 'enables',
          strength: 0.7,
          description: 'Transcendent function enables all integration processes'
        });
      }
    });
  }

  /**
   * Infer relationship type based on concept characteristics
   */
  private inferRelationship(sourceId: string, targetId: string): EdgeRelationship {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);

    if (!source || !target) return 'resonates-with';

    // Aether concepts synthesize others
    if (source.attributes.elements?.includes('aether')) {
      return 'synthesizes';
    }

    // Fire concepts extend and transcend
    if (source.attributes.elements?.includes('fire')) {
      return 'extends';
    }

    // Water concepts resonate and flow
    if (source.attributes.elements?.includes('water')) {
      return 'resonates-with';
    }

    // Earth concepts ground and apply
    if (source.attributes.elements?.includes('earth')) {
      return 'grounds';
    }

    // Air concepts enable communication
    if (source.attributes.elements?.includes('air')) {
      return 'resonates-with';
    }

    return 'resonates-with';
  }

  /**
   * Add a node to the graph
   */
  addNode(node: OntologyNode): void {
    this.nodes.set(node.id, node);
  }

  /**
   * Add an edge to the graph
   */
  addEdge(edge: OntologyEdge): void {
    this.edges.push(edge);
  }

  /**
   * Get a node by ID
   */
  getNode(id: string): OntologyNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Get all nodes
   */
  getAllNodes(): OntologyNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get all edges
   */
  getAllEdges(): OntologyEdge[] {
    return this.edges;
  }

  /**
   * Query nodes by element
   */
  queryByElement(element: Element): OntologyNode[] {
    return Array.from(this.nodes.values()).filter(node =>
      node.attributes.elements?.includes(element)
    );
  }

  /**
   * Query nodes by phase
   */
  queryByPhase(phase: SpiralPhase): OntologyNode[] {
    return Array.from(this.nodes.values()).filter(node =>
      node.attributes.phases?.includes(phase)
    );
  }

  /**
   * Query nodes by archetype
   */
  queryByArchetype(archetype: string): OntologyNode[] {
    return Array.from(this.nodes.values()).filter(node =>
      node.attributes.archetypes?.includes(archetype)
    );
  }

  /**
   * Query nodes by ontology tag
   */
  queryByOntologyTag(tag: string): OntologyNode[] {
    return Array.from(this.nodes.values()).filter(node =>
      node.attributes.ontologyTags?.includes(tag)
    );
  }

  /**
   * Get immediate neighbors of a node (direct connections)
   */
  getNeighbors(nodeId: string): {
    outgoing: Array<{ node: OntologyNode; edge: OntologyEdge }>;
    incoming: Array<{ node: OntologyNode; edge: OntologyEdge }>;
  } {
    const outgoing = this.edges
      .filter(edge => edge.source === nodeId)
      .map(edge => ({
        node: this.nodes.get(edge.target)!,
        edge
      }))
      .filter(item => item.node);

    const incoming = this.edges
      .filter(edge => edge.target === nodeId)
      .map(edge => ({
        node: this.nodes.get(edge.source)!,
        edge
      }))
      .filter(item => item.node);

    return { outgoing, incoming };
  }

  /**
   * Find path between two nodes (BFS)
   */
  findPath(startId: string, endId: string, maxDepth: number = 5): OntologyNode[] | null {
    if (startId === endId) return [this.nodes.get(startId)!];

    const visited = new Set<string>();
    const queue: Array<{ id: string; path: string[] }> = [{ id: startId, path: [startId] }];

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;

      if (path.length > maxDepth) continue;
      if (visited.has(id)) continue;
      visited.add(id);

      const neighbors = this.edges
        .filter(edge => edge.source === id)
        .map(edge => edge.target);

      for (const neighborId of neighbors) {
        if (neighborId === endId) {
          const fullPath = [...path, neighborId];
          return fullPath.map(id => this.nodes.get(id)!).filter(Boolean);
        }

        queue.push({ id: neighborId, path: [...path, neighborId] });
      }
    }

    return null;
  }

  /**
   * Get concept clusters (groups of highly connected concepts)
   */
  getConceptClusters(minConnections: number = 3): Array<Set<string>> {
    const clusters: Array<Set<string>> = [];
    const visited = new Set<string>();

    for (const nodeId of this.nodes.keys()) {
      if (visited.has(nodeId)) continue;

      const cluster = new Set<string>([nodeId]);
      const queue = [nodeId];

      while (queue.length > 0) {
        const current = queue.shift()!;
        visited.add(current);

        const connections = this.edges.filter(
          edge => edge.source === current || edge.target === current
        );

        if (connections.length >= minConnections) {
          connections.forEach(edge => {
            const neighbor = edge.source === current ? edge.target : edge.source;
            if (!visited.has(neighbor)) {
              cluster.add(neighbor);
              queue.push(neighbor);
            }
          });
        }
      }

      if (cluster.size > 1) {
        clusters.push(cluster);
      }
    }

    return clusters;
  }

  /**
   * Export graph as JSON for visualization
   */
  exportJSON(): { nodes: OntologyNode[]; edges: OntologyEdge[] } {
    return {
      nodes: this.getAllNodes(),
      edges: this.getAllEdges()
    };
  }

  /**
   * Generate Mermaid diagram syntax for visualization
   */
  exportMermaid(): string {
    let mermaid = 'graph TD\n';

    // Add nodes with styling
    this.nodes.forEach((node, id) => {
      const sanitizedLabel = node.label.replace(/[^\w\s]/g, '');
      const element = node.attributes.elements?.[0] || 'aether';

      // Style by element
      const styleClass = {
        fire: ':::fireNode',
        water: ':::waterNode',
        earth: ':::earthNode',
        air: ':::airNode',
        aether: ':::aetherNode'
      }[element];

      mermaid += `  ${id}["${sanitizedLabel}"]${styleClass}\n`;
    });

    mermaid += '\n';

    // Add edges with relationship labels
    this.edges.forEach(edge => {
      const relationLabel = edge.relationship.replace(/-/g, ' ');
      mermaid += `  ${edge.source} -->|${relationLabel}| ${edge.target}\n`;
    });

    mermaid += '\n';

    // Add styling
    mermaid += `
  classDef fireNode fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#fff
  classDef waterNode fill:#4dabf7,stroke:#1971c2,stroke-width:2px,color:#fff
  classDef earthNode fill:#82c91e,stroke:#5c940d,stroke-width:2px,color:#fff
  classDef airNode fill:#ffd43b,stroke:#fab005,stroke-width:2px,color:#000
  classDef aetherNode fill:#d0bfff,stroke:#9775fa,stroke-width:3px,color:#fff
`;

    return mermaid;
  }
}

/**
 * Global ontology graph instance
 */
export const spiralogicOntology = new SpiralogicOntologyGraph();

/**
 * Helper function: Get wisdom synthesis for a query
 * Combines related concepts into a coherent response
 */
export function synthesizeWisdom(query: {
  elements?: Element[];
  phases?: SpiralPhase[];
  archetypes?: string[];
  tags?: string[];
}): string {
  const graph = spiralogicOntology;
  let concepts: OntologyNode[] = [];

  // Query by all provided criteria
  if (query.elements) {
    query.elements.forEach(element => {
      concepts.push(...graph.queryByElement(element));
    });
  }

  if (query.phases) {
    query.phases.forEach(phase => {
      concepts.push(...graph.queryByPhase(phase));
    });
  }

  if (query.archetypes) {
    query.archetypes.forEach(archetype => {
      concepts.push(...graph.queryByArchetype(archetype));
    });
  }

  if (query.tags) {
    query.tags.forEach(tag => {
      concepts.push(...graph.queryByOntologyTag(tag));
    });
  }

  // Remove duplicates
  const uniqueConcepts = Array.from(
    new Map(concepts.map(c => [c.id, c])).values()
  );

  // Generate synthesis
  if (uniqueConcepts.length === 0) {
    return 'No concepts found matching your query.';
  }

  const synthesis = uniqueConcepts
    .map(concept => `**${concept.label}**: ${concept.description}`)
    .join('\n\n');

  return synthesis;
}
