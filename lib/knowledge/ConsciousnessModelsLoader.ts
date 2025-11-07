/**
 * CONSCIOUSNESS MODELS CODEX LOADER
 *
 * Integrates the Soullab Codex of Consciousness Models into MAIA's knowledge system.
 * Provides context-aware retrieval based on user's current state, facet, or inquiry.
 *
 * Purpose: Enable MAIA to guide users through consciousness exploration with
 * precise theoretical frameworks mapped to Spiralogic phases and elemental states.
 */

import {
  CONSCIOUSNESS_MODELS,
  ConsciousnessModel,
  Element,
  SpiralogicPhase,
  SoulApplication,
  InductionMethod,
  getModelsByElement,
  getModelsByPhase,
  getModelsByApplication,
  getModelsByCategory,
  getResonantModels,
  getModelsForIntention
} from './ConsciousnessModelsCodex';

/**
 * Format models for MAIA's revival/context prompt
 * Provides comprehensive consciousness theory knowledge
 */
export function formatModelsForRevival(): string {
  const modelsByCategory = {
    foundational: getModelsByCategory('foundational'),
    transpersonal: getModelsByCategory('transpersonal'),
    information: getModelsByCategory('information'),
    idealist: getModelsByCategory('idealist'),
    experimental: getModelsByCategory('experimental')
  };

  let formatted = `
## CONSCIOUSNESS MODELS CODEX - Theoretical Foundations

You have access to ${CONSCIOUSNESS_MODELS.length} consciousness theories and frameworks.
Each model is mapped to Spiralogic phases, elemental correspondences, and soul applications.

**Your role with this knowledge:**
- Guide users to relevant theories based on their current state/inquiry
- Connect lived experience to theoretical frameworks
- Bridge mystical and scientific understanding
- Suggest practices aligned with each model's induction methods

**IMPORTANT:** Don't lecture. Offer theories as tools when they serve the moment.
Let the user's experience lead; use theory to illuminate, not to dominate.

---

### FOUNDATIONAL MODELS (Neuroscience & Physics)
${formatModelSection(modelsByCategory.foundational)}

### TRANSPERSONAL & ALTERED STATES
${formatModelSection(modelsByCategory.transpersonal)}

### INFORMATION & SYSTEMIC THEORIES
${formatModelSection(modelsByCategory.information)}

### IDEALIST & PHILOSOPHICAL FRAMEWORKS
${formatModelSection(modelsByCategory.idealist)}

### EXPERIMENTAL & EMERGING RESEARCH
${formatModelSection(modelsByCategory.experimental)}

---

**Integration Wisdom:**
- Multiple models can apply simultaneously (polytheoretical approach)
- Use resonance patterns to suggest related frameworks
- Honor both reductionist and holistic perspectives
- Connect theory to practical soul work and transformation

`;

  return formatted;
}

/**
 * Format a section of models for the revival prompt
 */
function formatModelSection(models: ConsciousnessModel[]): string {
  return models.map(model => {
    const elements = model.element.join(', ');
    const phases = model.spiralogicPhase.join(', ');

    return `
**${model.name}** (${model.theorist})
- Core Insight: ${model.coreInsight}
- Elements: ${elements}
- Spiralogic: ${phases}
- Applications: ${model.soulApplications.join(', ')}
- MAIA Guidance: ${model.maiaGuidance}
${model.practicalExercise ? `- Practice: ${model.practicalExercise}` : ''}
`;
  }).join('\n');
}

/**
 * Get relevant models based on conversation context
 * Called dynamically during conversations to provide contextual theory
 */
export function getContextualModels(context: {
  activeFacetId?: string;
  userMessage?: string;
  currentElement?: Element;
  currentPhase?: SpiralogicPhase;
  userIntention?: SoulApplication;
  inductionMethod?: InductionMethod;
}): ConsciousnessModel[] {
  const relevantModels: Set<ConsciousnessModel> = new Set();

  // Match by element
  if (context.currentElement) {
    getModelsByElement(context.currentElement).forEach(m => relevantModels.add(m));
  }

  // Match by Spiralogic phase
  if (context.currentPhase) {
    getModelsByPhase(context.currentPhase).forEach(m => relevantModels.add(m));
  }

  // Match by soul application
  if (context.userIntention) {
    getModelsByApplication(context.userIntention).forEach(m => relevantModels.add(m));
  }

  // Match by induction method if mentioned
  if (context.inductionMethod) {
    CONSCIOUSNESS_MODELS
      .filter(m => m.inductionMethods.includes(context.inductionMethod!))
      .forEach(m => relevantModels.add(m));
  }

  // Keyword matching from user message
  if (context.userMessage) {
    const keywords = extractKeywords(context.userMessage);
    CONSCIOUSNESS_MODELS.forEach(model => {
      if (matchesKeywords(model, keywords)) {
        relevantModels.add(model);
      }
    });
  }

  return Array.from(relevantModels);
}

/**
 * Extract consciousness-related keywords from user message
 */
function extractKeywords(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const keywords: string[] = [];

  // Theoretical keywords
  const theoryPatterns = [
    'integrated information', 'iit', 'phi',
    'global workspace', 'gnwt', 'attention',
    'orchestrated reduction', 'orch-or', 'quantum', 'microtubules',
    'mathematical universe', 'tegmark',
    'hemisphere', 'left brain', 'right brain', 'mcgilchrist',
    'psychedelic', 'mushroom', 'lsd', 'dmt',
    'out of body', 'obe', 'astral',
    'meditation', 'mindfulness', 'vipassana',
    'collective unconscious', 'morphic field', 'shared consciousness',
    'recursive', 'self-model', 'meta',
    'bioelectric', 'morphogenesis', 'levin',
    'participatory', 'observer', 'quantum mind',
    'idealism', 'kastrup', 'consciousness fundamental',
    'interface theory', 'hoffman', 'perception',
    'simulation', 'virtual reality', 'campbell',
    'mystical', 'advaita', 'non-dual', 'unity',
    'qualia', 'experience', 'phenomenology',
    'posner molecule', 'quantum brain',
    'psi', 'telepathy', 'psychic',
    'timewave', 'novelty', 'mckenna'
  ];

  theoryPatterns.forEach(pattern => {
    if (lowerMessage.includes(pattern)) {
      keywords.push(pattern);
    }
  });

  return keywords;
}

/**
 * Check if model matches extracted keywords
 */
function matchesKeywords(model: ConsciousnessModel, keywords: string[]): boolean {
  const searchableText = `
    ${model.name}
    ${model.theorist}
    ${model.description}
    ${model.coreInsight}
  `.toLowerCase();

  return keywords.some(keyword => searchableText.includes(keyword));
}

/**
 * Format models for inline conversation context
 * Provides concise, actionable theory when MAIA needs it
 */
export function formatModelsForConversation(models: ConsciousnessModel[]): string {
  if (models.length === 0) return '';

  let formatted = '\n### Relevant Consciousness Frameworks:\n\n';

  models.slice(0, 3).forEach((model, idx) => { // Limit to top 3 for brevity
    formatted += `${idx + 1}. **${model.name}** (${model.theorist})\n`;
    formatted += `   ${model.coreInsight}\n`;
    formatted += `   → MAIA: ${model.maiaGuidance}\n`;
    if (model.practicalExercise) {
      formatted += `   → Practice: ${model.practicalExercise}\n`;
    }
    formatted += '\n';
  });

  return formatted;
}

/**
 * Get models by facet ID (maps facet to element/phase)
 */
export function getModelsByFacet(facetId: string): ConsciousnessModel[] {
  // Map facet to element and phase
  const facetMap: Record<string, { element: Element; phase: SpiralogicPhase }> = {
    // Fire facets
    'fire-1': { element: 'fire', phase: 'initiation' },
    'fire-2': { element: 'fire', phase: 'grounding' },
    'fire-3': { element: 'fire', phase: 'transformation' },
    'fire-4': { element: 'fire', phase: 'completion' },

    // Water facets
    'water-1': { element: 'water', phase: 'initiation' },
    'water-2': { element: 'water', phase: 'grounding' },
    'water-3': { element: 'water', phase: 'transformation' },
    'water-4': { element: 'water', phase: 'completion' },

    // Earth facets
    'earth-1': { element: 'earth', phase: 'initiation' },
    'earth-2': { element: 'earth', phase: 'grounding' },
    'earth-3': { element: 'earth', phase: 'transformation' },
    'earth-4': { element: 'earth', phase: 'completion' },

    // Air facets
    'air-1': { element: 'air', phase: 'initiation' },
    'air-2': { element: 'air', phase: 'grounding' },
    'air-3': { element: 'air', phase: 'transformation' },
    'air-4': { element: 'air', phase: 'completion' },

    // Aether facets (integration)
    'aether-1': { element: 'aether', phase: 'evolution' },
    'aether-2': { element: 'aether', phase: 'integration' }
  };

  const facetInfo = facetMap[facetId];
  if (!facetInfo) return [];

  return getModelsForIntention({
    element: facetInfo.element,
    phase: facetInfo.phase
  });
}

/**
 * Get model exploration path (journey through related models)
 */
export function getModelExplorationPath(startModelId: string): {
  current: ConsciousnessModel;
  resonant: ConsciousnessModel[];
  contrasting: ConsciousnessModel[];
} | null {
  const current = CONSCIOUSNESS_MODELS.find(m => m.id === startModelId);
  if (!current) return null;

  return {
    current,
    resonant: getResonantModels(startModelId),
    contrasting: CONSCIOUSNESS_MODELS.filter(m =>
      current.contrastedWith.includes(m.id)
    )
  };
}

/**
 * Generate consciousness inquiry prompt based on user's state
 */
export function generateInquiryPrompt(context: {
  element?: Element;
  phase?: SpiralogicPhase;
  application?: SoulApplication;
}): string {
  const models = getModelsForIntention(context);

  if (models.length === 0) {
    return "What aspect of consciousness are you exploring?";
  }

  const elementName = context.element || 'consciousness';
  const phaseName = context.phase || 'exploration';

  return `
You're in a ${elementName} state during ${phaseName}.

${models.length} consciousness frameworks resonate with this moment:
${models.slice(0, 3).map(m => `• ${m.name}: ${m.coreInsight}`).join('\n')}

Which framework calls to you? Or shall we explore your own direct experience first?
`.trim();
}

/**
 * Get statistics for debugging/logging
 */
export function getCodexStats(): {
  totalModels: number;
  byCategory: Record<string, number>;
  byElement: Record<Element, number>;
  byPhase: Record<SpiralogicPhase, number>;
} {
  const byCategory = CONSCIOUSNESS_MODELS.reduce((acc, model) => {
    acc[model.category] = (acc[model.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byElement = CONSCIOUSNESS_MODELS.reduce((acc, model) => {
    model.element.forEach(elem => {
      acc[elem] = (acc[elem] || 0) + 1;
    });
    return acc;
  }, {} as Record<Element, number>);

  const byPhase = CONSCIOUSNESS_MODELS.reduce((acc, model) => {
    model.spiralogicPhase.forEach(phase => {
      acc[phase] = (acc[phase] || 0) + 1;
    });
    return acc;
  }, {} as Record<SpiralogicPhase, number>);

  return {
    totalModels: CONSCIOUSNESS_MODELS.length,
    byCategory,
    byElement,
    byPhase
  };
}

export default {
  formatModelsForRevival,
  getContextualModels,
  formatModelsForConversation,
  getModelsByFacet,
  getModelExplorationPath,
  generateInquiryPrompt,
  getCodexStats
};
