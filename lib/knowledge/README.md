# Spiralogic Knowledge System

This directory contains the structured knowledge bases that power MAIA's wisdom and intelligence.

## Knowledge Files

### Core Conceptual Frameworks

- **`FunctionalBridgeKnowledge.ts`** - Bridges von Neumann's computational view of life with Spiralogic's communion paradigm
- **`ElementalAlchemyKnowledge.ts`** - Core elemental theory and transmutation principles
- **`SpiralogicDeepWisdom.ts`** - Deep spiral dynamics and phase transitions
- **`SpiralogicExtendedWisdom.ts`** - Extended applications of spiral theory
- **`DepthPsychologyWisdom.ts`** - Jungian and depth psychology integration
- **`EcologicalPsychologyWisdom.ts`** - Ecological and systems psychology
- **`UniversalArchetypalFramework.ts`** - Universal archetypal patterns and mappings

### Integration Systems

- **`SpiralogicOntologyGraph.ts`** - Living knowledge graph connecting all concepts
- **`WisdomIntegrationSystem.ts`** - Integration protocols for wisdom synthesis
- **`EmergentArchetypeDetector.ts`** - Detects emerging archetypal patterns
- **`CulturalArchetypeMapper.ts`** - Maps cultural variations of archetypes
- **`ArchetypalLightDarkSystem.ts`** - Light/shadow archetype balancing

### Specialized Wisdom

- **`NLPWisdom.ts`** - Neuro-linguistic programming patterns
- **`FamilyConstellationWisdom.ts`** - Family systems and constellations work

## Using the Knowledge Graph

### Basic Queries

```typescript
import { spiralogicOntology } from './SpiralogicOntologyGraph';

// Query by element
const aetherConcepts = spiralogicOntology.queryByElement('aether');

// Query by phase
const integrationConcepts = spiralogicOntology.queryByPhase('integration');

// Query by archetype
const weaverWisdom = spiralogicOntology.queryByArchetype('Weaver');

// Query by ontology tag
const emergenceConcepts = spiralogicOntology.queryByOntologyTag('emergence');
```

### Relationship Exploration

```typescript
// Get a specific concept
const concept = spiralogicOntology.getNode('communion-computing');

// Find its neighbors
const { outgoing, incoming } = spiralogicOntology.getNeighbors('communion-computing');

// Find path between concepts
const path = spiralogicOntology.findPath(
  'life-as-computation',
  'spiral-field'
);

// Get concept clusters
const clusters = spiralogicOntology.getConceptClusters(3);
```

### Wisdom Synthesis

```typescript
import { synthesizeWisdom } from './SpiralogicOntologyGraph';

// Synthesize wisdom for complex queries
const synthesis = synthesizeWisdom({
  elements: ['aether', 'water'],
  phases: ['integration', 'completion'],
  archetypes: ['Weaver', 'Alchemist']
});

console.log(synthesis);
// Returns integrated wisdom from matching concepts
```

### Visualization

```typescript
// Export as JSON for custom visualization
const graphData = spiralogicOntology.exportJSON();

// Export as Mermaid diagram
const mermaidDiagram = spiralogicOntology.exportMermaid();
console.log(mermaidDiagram);
// Copy output to Mermaid Live Editor: https://mermaid.live
```

## Concept Structure

Each concept in the knowledge graph follows this structure:

```typescript
interface OntologyNode {
  id: string;                    // Unique identifier
  label: string;                 // Display name
  type: 'concept' | 'principle' | 'practice' | 'pattern';
  description: string;           // Full explanation
  source: string;                // Which knowledge file
  attributes: {
    elements?: Element[];        // Associated elements
    phases?: SpiralPhase[];      // Associated phases
    archetypes?: string[];       // Associated archetypes
    ontologyTags?: string[];     // Semantic tags
  };
  metadata?: Record<string, any>; // Additional context
}
```

## Relationship Types

The ontology uses these semantic relationships:

- **`extends`** - Concept B extends/builds upon concept A
- **`requires`** - Concept B requires concept A as prerequisite
- **`resonates-with`** - Concepts harmonize/align conceptually
- **`synthesizes`** - Concept combines multiple concepts
- **`emerges-from`** - Concept emerges from lower-level patterns
- **`applies-to`** - Concept provides practical application
- **`contrasts-with`** - Concepts offer complementary perspectives
- **`exemplifies`** - Concrete example of abstract principle
- **`transcends`** - Concept transcends/goes beyond another
- **`grounds`** - Concept grounds/anchors another in practice
- **`enables`** - Concept enables/facilitates another

## Adding New Knowledge

To add a new knowledge domain:

1. **Create knowledge file** following the pattern in `FunctionalBridgeKnowledge.ts`
2. **Define concepts** with elements, phases, archetypes, and ontology tags
3. **Import into ontology graph** in `SpiralogicOntologyGraph.ts`
4. **Build relationships** using the edge types above
5. **Test queries** to ensure proper integration

Example:

```typescript
// In YourNewKnowledge.ts
export interface YourConcept {
  id: string;
  concept: string;
  explanation: string;
  practicalApplication: string;
  ontologyTags: string[];
  relatedConcepts: string[];
  elements: Element[];
  phases: SpiralPhase[];
  archetype: 'Sage' | 'Alchemist' | 'Weaver';
}

export const YOUR_CONCEPTS: YourConcept[] = [
  // ... your concepts
];

// In SpiralogicOntologyGraph.ts
import { YOUR_CONCEPTS } from './YourNewKnowledge';

// Add to graph initialization
YOUR_CONCEPTS.forEach(concept => {
  this.addNode({
    id: concept.id,
    label: concept.concept,
    type: 'concept',
    description: concept.explanation,
    source: 'YourNewKnowledge',
    attributes: {
      elements: concept.elements,
      phases: concept.phases,
      archetypes: [concept.archetype],
      ontologyTags: concept.ontologyTags
    }
  });
});
```

## Integration with MAIA

MAIA can access this knowledge graph during conversations:

```typescript
// In MAIA's response generation
import { spiralogicOntology, synthesizeWisdom } from '@/lib/knowledge/SpiralogicOntologyGraph';

// Detect user's dominant element/phase
const userElement = detectDominantElement(userMessage);
const userPhase = detectCurrentPhase(userContext);

// Retrieve relevant wisdom
const relevantWisdom = synthesizeWisdom({
  elements: [userElement],
  phases: [userPhase]
});

// Integrate into response
const response = generateResponse({
  userMessage,
  context: {
    ...existingContext,
    wisdom: relevantWisdom
  }
});
```

## Future Directions

- [ ] Vector embeddings for semantic similarity search
- [ ] Dynamic concept emergence from conversations
- [ ] Cross-knowledge-base pattern detection
- [ ] Automatic relationship strength calibration
- [ ] Integration with MAIA's memory system
- [ ] Visualization dashboard for knowledge exploration

---

*The knowledge graph is a living system. It grows, connects, and evolves as we add new wisdom and discover new patterns.*
