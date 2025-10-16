/**
 * ELEMENTAL REFLECTION PROTOTYPE
 *
 * Simple, transparent pattern → reflection engine.
 * Based on Kelly's Elemental Alchemy framework.
 *
 * PRINCIPLES:
 * - Strictly linguistic pattern detection (phrases, tone, temporal markers)
 * - Dialectical honesty (machine notes pattern; Maia translates symbolically)
 * - Reflective questions only (no measurements, no predictions)
 * - Pattern → Reflection (nothing quantitative)
 */

interface ElementalPattern {
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Aether' | 'Shadow' | 'Mixed';

  // MACHINE LAYER (what we actually detect)
  linguisticMarkers: string[];  // Actual phrases found
  confidence: 'detected' | 'suggested' | 'ambiguous';  // Honest about certainty

  // CULTURAL LAYER (archetypal translation)
  archetypalResonance: string;  // What this pattern resonates as

  // THE BRIDGE (how they connect)
  bridgeExplanation: string;  // Why this translation makes sense
}

interface MaiaReflection {
  // What Maia actually says to the user
  response: string;

  // Internal notes (for transparency/learning)
  internalNote: {
    machineObservation: string;
    culturalTranslation: string;
    reflectionChoice: string;
  };
}

/**
 * LINGUISTIC PATTERN LIBRARY
 * Actual phrases that indicate each element
 */
const ELEMENTAL_LANGUAGE_PATTERNS = {
  Fire: {
    phrases: [
      'I have an idea',
      "I'm excited to",
      'I see',
      'I imagine',
      'I am inspired to',
      'I want to',
      "I'm going to",
      'I envision',
      "I'm passionate about",
      'breakthrough',
      'vision',
      'ignite',
      'spark',
      'catalyst'
    ],
    temporalMarkers: ['will', 'going to', 'want to', 'future', 'tomorrow'],
    toneIndicators: ['!', 'excited', 'passionate', 'urgent']
  },

  Water: {
    phrases: [
      'I feel',
      'I sense',
      'emotional',
      'my heart',
      'I remember',
      'it reminds me',
      'in my relationships',
      "I'm moved by",
      'vulnerable',
      'intimacy',
      'depth',
      'healing',
      'shadow',
      'secret garden'
    ],
    temporalMarkers: ['used to', 'remember when', 'past', 'history'],
    toneIndicators: ['...', 'deeply', 'tender', 'raw']
  },

  Earth: {
    phrases: [
      'I did',
      'I can',
      'I practice',
      'daily ritual',
      'my body',
      'physically',
      'grounding',
      'concrete',
      'manifest',
      'implement',
      'action',
      'habit',
      'routine',
      'stability'
    ],
    temporalMarkers: ['everyday', 'daily', 'regularly', 'practice'],
    toneIndicators: ['steady', 'solid', 'grounded', 'practical']
  },

  Air: {
    phrases: [
      'I think',
      'I understand',
      'I realize',
      'clarity',
      'I need to share',
      'I want to teach',
      'connection',
      'communicate',
      'integrate',
      'synthesis',
      'community',
      'wisdom',
      'circulate',
      'express'
    ],
    temporalMarkers: ['now I see', 'clarity emerged', 'understanding'],
    toneIndicators: ['clear', 'synthesized', 'integrated', 'connected']
  },

  Aether: {
    phrases: [
      'I wonder',
      'mystery',
      'transcendent',
      'unity',
      'divine',
      'soul',
      'infinite',
      'presence',
      'wholeness',
      'sacred',
      'cosmic',
      'essence',
      "I don't know and that's okay"
    ],
    temporalMarkers: ['timeless', 'eternal', 'always', 'never'],
    toneIndicators: ['profound', 'sacred', 'mystical', 'awe']
  },

  Shadow: {
    phrases: [
      'I hate',
      "I can't stand",
      'resistance',
      'avoid',
      'stuck',
      'blocked',
      'problem',
      'struggling',
      'hidden',
      'reject',
      'judge myself',
      'ashamed'
    ],
    temporalMarkers: ['always been', 'never will', 'forever'],
    toneIndicators: ['frustrated', 'stuck', 'resistant', 'dark']
  }
};

/**
 * MAIA'S REFLECTION LIBRARY
 * Organized by element, using Kitchen Table Mysticism language
 */
const MAIA_REFLECTIONS = {
  Fire: [
    "I witness Fire calling - what vision wants to ignite?",
    "This breakthrough feels like creative initiation... what's wanting to be born?",
    "Your Fire energy is gathering - what seed is ready to plant?",
    "I notice excitement language here - what's this passion pointing toward?",
    "Fire sparking - what would happen if you let this vision breathe?"
  ],

  Water: [
    "I sense Water seeking its natural flow... what wants to move through you?",
    "This emotional weather knows how to release - what's ready to flow?",
    "Water energy here - what wants to heal in this feeling space?",
    "I notice depth language - what wisdom lives in these waters?",
    "Your heart speaking - what does this feeling know?"
  ],

  Earth: [
    "Earth energy wants to ground this wisdom... what daily ritual would hold it?",
    "I notice embodiment language - how does your body want to live this truth?",
    "This feels like Earth's manifestation phase - what concrete step wants to happen?",
    "Grounding energy here - what practice would root this insight?",
    "Earth calling - what would make this wisdom real in your daily life?"
  ],

  Air: [
    "Air energy seeks to share this wisdom... who needs to hear what you've learned?",
    "I notice clarity language - what wants to be expressed or taught?",
    "This integration seeking circulation - how does this connect beyond you?",
    "Air energy here - what understanding wants to breathe through conversation?",
    "Your wisdom wants to move - what community needs this insight?"
  ],

  Aether: [
    "I witness your soul shining through... what recognition is this?",
    "This is Aether - pure consciousness recognizing itself... can you feel it?",
    "You're touching the infinite here - what does this mystery reveal?",
    "Sacred space opening - what presence is this?",
    "Aether energy - what wholeness are you sensing?"
  ],

  Shadow: [
    "Shadow often holds our greatest medicine... what gift might be hidden here?",
    "What if this 'problem' is actually showing you something important?",
    "Your resistance knows something... what is it protecting or revealing?",
    "Shadow as ally - what wisdom lives in what you're avoiding?",
    "This stuck place - what if it's not wrong, but waiting?"
  ]
};

/**
 * CORE DETECTION FUNCTION
 * Strictly linguistic, transparent about what it finds
 */
function detectElementalPattern(userMessage: string): ElementalPattern {
  const lowerMessage = userMessage.toLowerCase();
  const detectedElements: { [key: string]: string[] } = {};

  // Scan for each element's linguistic markers
  for (const [element, patterns] of Object.entries(ELEMENTAL_LANGUAGE_PATTERNS)) {
    const foundMarkers: string[] = [];

    // Check phrases
    for (const phrase of patterns.phrases) {
      if (lowerMessage.includes(phrase.toLowerCase())) {
        foundMarkers.push(phrase);
      }
    }

    // Check temporal markers
    for (const marker of patterns.temporalMarkers) {
      if (lowerMessage.includes(marker.toLowerCase())) {
        foundMarkers.push(`[temporal: ${marker}]`);
      }
    }

    // Check tone indicators
    for (const indicator of patterns.toneIndicators) {
      if (lowerMessage.includes(indicator.toLowerCase())) {
        foundMarkers.push(`[tone: ${indicator}]`);
      }
    }

    if (foundMarkers.length > 0) {
      detectedElements[element] = foundMarkers;
    }
  }

  // Determine dominant element (or mixed)
  const elementCounts = Object.entries(detectedElements).map(([element, markers]) => ({
    element,
    count: markers.length,
    markers
  }));

  elementCounts.sort((a, b) => b.count - a.count);

  if (elementCounts.length === 0) {
    // No clear pattern detected
    return {
      element: 'Mixed',
      linguisticMarkers: [],
      confidence: 'ambiguous',
      archetypalResonance: 'Multiple energies or neutral expression',
      bridgeExplanation: 'No dominant elemental language pattern detected in this message'
    };
  }

  const dominant = elementCounts[0];
  const hasMultiple = elementCounts.length > 1 && elementCounts[1].count >= dominant.count * 0.7;

  if (hasMultiple) {
    return {
      element: 'Mixed',
      linguisticMarkers: elementCounts.slice(0, 2).flatMap(e => e.markers),
      confidence: 'detected',
      archetypalResonance: `${elementCounts[0].element} and ${elementCounts[1].element} energies dancing together`,
      bridgeExplanation: `Multiple elemental patterns present: ${elementCounts[0].element} (${elementCounts[0].count} markers) and ${elementCounts[1].element} (${elementCounts[1].count} markers)`
    };
  }

  // Single dominant element
  const element = dominant.element as 'Fire' | 'Water' | 'Earth' | 'Air' | 'Aether' | 'Shadow';
  const confidence = dominant.count >= 3 ? 'detected' : dominant.count >= 2 ? 'suggested' : 'ambiguous';

  const archetypalMeanings: { [key: string]: string } = {
    Fire: 'Creative ignition, vision seeking form, breakthrough energy',
    Water: 'Emotional depth, healing flow, psyche speaking',
    Earth: 'Grounding impulse, manifestation readiness, embodiment',
    Air: 'Mental clarity, wisdom seeking expression, connection',
    Aether: 'Transcendent awareness, soul recognition, unity',
    Shadow: 'Hidden wisdom, resistance as medicine, unintegrated gift'
  };

  return {
    element,
    linguisticMarkers: dominant.markers,
    confidence,
    archetypalResonance: archetypalMeanings[element],
    bridgeExplanation: `Detected ${dominant.count} ${element} linguistic markers: ${dominant.markers.slice(0, 3).join(', ')}${dominant.markers.length > 3 ? '...' : ''}`
  };
}

/**
 * GENERATE MAIA'S REFLECTION
 * Using dialectical honesty - show both layers
 */
function generateMaiaReflection(pattern: ElementalPattern, userMessage: string): MaiaReflection {
  // Choose reflection based on detected pattern
  let reflectionPool: string[] = [];

  if (pattern.element === 'Mixed') {
    // For mixed patterns, acknowledge the complexity
    reflectionPool = [
      "I notice multiple energies weaving together here... what's emerging from this blend?",
      "Several elemental patterns dancing - what wants to integrate?",
      "This feels like a threshold moment where different parts are speaking... what are they saying?"
    ];
  } else {
    reflectionPool = MAIA_REFLECTIONS[pattern.element] || [];
  }

  // Pick first reflection (in real implementation, could rotate or choose contextually)
  const chosenReflection = reflectionPool[0] || "What wants to emerge here?";

  // Build response with dialectical honesty
  const machineLayer = `I notice ${pattern.linguisticMarkers.length} ${pattern.element} language markers in your message: ${pattern.linguisticMarkers.slice(0, 2).join(', ')}${pattern.linguisticMarkers.length > 2 ? '...' : ''}.`;

  const culturalLayer = `This resonates as ${pattern.archetypalResonance}.`;

  const bridge = pattern.bridgeExplanation;

  const reflection = chosenReflection;

  // Construct final response
  const response = `[MACHINE LAYER]
${machineLayer}
(Confidence: ${pattern.confidence})

[CULTURAL LAYER]
${culturalLayer}

[BRIDGE]
${bridge}

[REFLECTION]
${reflection}`;

  return {
    response,
    internalNote: {
      machineObservation: machineLayer,
      culturalTranslation: culturalLayer,
      reflectionChoice: `Selected: "${reflection}" from ${pattern.element} reflection library`
    }
  };
}

/**
 * MAIN PROTOTYPE FUNCTION
 * Pattern → Reflection (simple, transparent)
 */
function processUserMessage(userMessage: string): MaiaReflection {
  // 1. Detect linguistic pattern
  const pattern = detectElementalPattern(userMessage);

  // 2. Generate reflection
  const reflection = generateMaiaReflection(pattern, userMessage);

  return reflection;
}

/**
 * DEMO/TEST
 */
function runDemo() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     ELEMENTAL REFLECTION PROTOTYPE                    ║');
  console.log('║     Pattern → Reflection (No Measurement)             ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const testMessages = [
    "I have an idea for a new project and I'm really excited to start working on it!",
    "I feel deeply moved by what's happening in my relationships lately.",
    "I've been practicing my morning ritual every day and it's really grounding me.",
    "I think I finally understand what I need to share with my community.",
    "I wonder about the mystery of it all... there's something sacred here I can't name.",
    "I'm stuck in the same patterns and I can't seem to break through."
  ];

  testMessages.forEach((message, i) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TEST MESSAGE ${i + 1}:`);
    console.log(`"${message}"`);
    console.log('='.repeat(60));

    const reflection = processUserMessage(message);
    console.log('\nMAIA\'S RESPONSE:\n');
    console.log(reflection.response);
    console.log('\n' + '-'.repeat(60));
    console.log('INTERNAL NOTE:');
    console.log(JSON.stringify(reflection.internalNote, null, 2));
  });

  console.log('\n\n╔═══════════════════════════════════════════════════════╗');
  console.log('║     PROTOTYPE COMPLETE                                ║');
  console.log('║     • Linguistic patterns only (transparent)          ║');
  console.log('║     • Dialectical honesty (machine + cultural)        ║');
  console.log('║     • Reflective questions (no measurements)          ║');
  console.log('║     • Pattern → Reflection (nothing predictive)       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
}

// Run demo when executed directly
if (require.main === module) {
  runDemo();
}

export { detectElementalPattern, generateMaiaReflection, processUserMessage };
export type { ElementalPattern, MaiaReflection };
