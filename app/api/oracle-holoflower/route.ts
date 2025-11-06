import { NextRequest, NextResponse } from 'next/server';

/**
 * Oracle Holoflower API
 *
 * Processes holoflower check-in data using the complete Spiralogic framework.
 * Returns oracle reading with spiral stage, archetype, reflection, and practice.
 */

interface Petal {
  id: string;
  name: string;
  intensity: number;
  element: string;
  affirmation: string;
}

interface PetalInfo {
  petal: string;
  essence: string;
  keywords: string[];
  shadow: string;
  blessing: string;
}

// Complete Spiralogic Framework - 12 Facets across 4 Elements
const PETAL_CHART: Record<string, PetalInfo> = {
  // FIRE - Spiritual, Intuitive Intelligence (Vision/Expression/Expansion)
  Fire1: {
    petal: 'Fire1',
    essence: 'Self-Awareness', // Vision (Cardinal/Vector)
    keywords: ['Vision', 'Intuition', 'I SEE', 'I Experience', 'Spiritual awakening'],
    shadow: 'Blind spots, spiritual bypassing',
    blessing: 'Clear inner vision'
  },
  Fire2: {
    petal: 'Fire2',
    essence: 'Self-In-World', // Expression (Fixed/Circle)
    keywords: ['Expression', 'Creation', 'I CREATE', 'I Express', 'Creative power'],
    shadow: 'Blocked expression, creative stagnation',
    blessing: 'Authentic creative flow'
  },
  Fire3: {
    petal: 'Fire3',
    essence: 'Self-In-Universe', // Expansion (Mutable/Spiral)
    keywords: ['Expansion', 'Exploration', 'I EXPAND', 'I Explore', 'Boundless growth'],
    shadow: 'Overwhelm, losing center',
    blessing: 'Infinite possibility with grounding'
  },

  // WATER - Emotional, Relational Intelligence (Heart/Healing/Holiness)
  Water1: {
    petal: 'Water1',
    essence: 'Self-In-Body', // Heart (Cardinal/Vector)
    keywords: ['Heart', 'Feeling', 'I FEEL', 'I Connect', 'Emotional truth'],
    shadow: 'Numbness, emotional flooding',
    blessing: 'Embodied emotional wisdom'
  },
  Water2: {
    petal: 'Water2',
    essence: 'Self-In-Relation', // Healing (Fixed/Circle)
    keywords: ['Healing', 'Integration', 'I HEAL', 'I Transform', 'Deep repair'],
    shadow: 'Wounds unacknowledged, victim patterns',
    blessing: 'Wholeness through integration'
  },
  Water3: {
    petal: 'Water3',
    essence: 'Self-In-Mystery', // Holiness (Mutable/Spiral)
    keywords: ['Holiness', 'Surrender', 'I TRUST', 'I Release', 'Sacred mystery'],
    shadow: 'Control patterns, spiritual rigidity',
    blessing: 'Grace through surrender'
  },

  // EARTH - Physical, Practical Intelligence (Mission/Means/Medicine)
  Earth1: {
    petal: 'Earth1',
    essence: 'Self-In-Purpose', // Mission (Cardinal/Vector)
    keywords: ['Mission', 'Purpose', 'I SERVE', 'I Commit', 'Sacred work'],
    shadow: 'Purposelessness, workaholism',
    blessing: 'Clear purposeful action'
  },
  Earth2: {
    petal: 'Earth2',
    essence: 'Self-In-Structure', // Means (Fixed/Circle)
    keywords: ['Means', 'Resources', 'I BUILD', 'I Sustain', 'Material mastery'],
    shadow: 'Scarcity, material attachment',
    blessing: 'Abundant resourcefulness'
  },
  Earth3: {
    petal: 'Earth3',
    essence: 'Self-In-Service', // Medicine (Mutable/Spiral)
    keywords: ['Medicine', 'Gift', 'I GIVE', 'I Offer', 'Unique contribution'],
    shadow: 'Martyrdom, self-abandonment',
    blessing: 'Nourishing service from overflow'
  },

  // AIR - Mental, Communicative Intelligence (Connection/Community/Consciousness)
  Air1: {
    petal: 'Air1',
    essence: 'Self-In-Other', // Connection (Cardinal/Vector)
    keywords: ['Connection', 'Relating', 'I MEET', 'I Listen', 'True dialogue'],
    shadow: 'Isolation, codependence',
    blessing: 'Authentic connection'
  },
  Air2: {
    petal: 'Air2',
    essence: 'Self-In-Group', // Community (Fixed/Circle)
    keywords: ['Community', 'Belonging', 'I GATHER', 'I Unite', 'Sacred circle'],
    shadow: 'Exclusion, groupthink',
    blessing: 'Vibrant collective field'
  },
  Air3: {
    petal: 'Air3',
    essence: 'Self-In-Field', // Consciousness (Mutable/Spiral)
    keywords: ['Consciousness', 'Awareness', 'I WITNESS', 'I Know', 'Meta-awareness'],
    shadow: 'Mental loops, spiritual intellectualism',
    blessing: 'Clear witnessing presence'
  }
};

function analyzeSpiralStage(petals: Petal[]): { element: string; stage: string; description: string } {
  // Calculate average intensity per element
  const elementIntensities: Record<string, number[]> = {
    Fire: [],
    Water: [],
    Earth: [],
    Air: []
  };

  petals.forEach(petal => {
    // Only add if element exists in our mapping
    if (elementIntensities[petal.element]) {
      elementIntensities[petal.element].push(petal.intensity);
    }
  });

  // Find dominant element
  const elementAverages = Object.entries(elementIntensities)
    .map(([element, intensities]) => ({
      element,
      average: intensities.length > 0
        ? intensities.reduce((sum, val) => sum + val, 0) / intensities.length
        : 0
    }))
    .filter(({ average }) => average > 0); // Only include elements with values

  elementAverages.sort((a, b) => b.average - a.average);
  const dominantElement = elementAverages.length > 0 ? elementAverages[0].element : 'Fire';

  // Determine stage within element (Cardinal/Fixed/Mutable → Vector/Circle/Spiral)
  const elementPetals = petals.filter(p => p.element === dominantElement);
  const stages = ['Vision/Heart/Mission/Connection', 'Expression/Healing/Means/Community', 'Expansion/Holiness/Medicine/Consciousness'];
  const stageIntensities = elementPetals.map(p => p.intensity);
  const dominantStageIndex = stageIntensities.indexOf(Math.max(...stageIntensities));
  const stage = ['Cardinal (Vector)', 'Fixed (Circle)', 'Mutable (Spiral)'][dominantStageIndex] || 'Cardinal (Vector)';

  const descriptions: Record<string, string> = {
    Fire: 'Your spiritual intelligence is awakening. You are seeing with new eyes.',
    Water: 'Your emotional intelligence is deepening. You are feeling into the truth.',
    Earth: 'Your practical intelligence is activating. You are bringing vision into form.',
    Air: 'Your mental intelligence is expanding. You are witnessing from a higher perspective.'
  };

  return {
    element: dominantElement,
    stage,
    description: descriptions[dominantElement]
  };
}

function generateArchetype(petals: Petal[], spiralStage: { element: string }): string {
  const archetypes: Record<string, string[]> = {
    Fire: ['The Seer', 'The Creator', 'The Explorer', 'The Visionary'],
    Water: ['The Healer', 'The Lover', 'The Mystic', 'The Empath'],
    Earth: ['The Builder', 'The Servant', 'The Steward', 'The Keeper'],
    Air: ['The Messenger', 'The Weaver', 'The Witness', 'The Teacher']
  };

  const elementArchetypes = archetypes[spiralStage.element] || archetypes.Fire;
  return elementArchetypes[Math.floor(Math.random() * elementArchetypes.length)];
}

function generateShadowArchetype(petals: Petal[]): string {
  // Find the weakest element (lowest average intensity)
  const sortedPetals = [...petals].sort((a, b) => a.intensity - b.intensity);
  const weakest = sortedPetals[0];

  // Shadow archetypes as invitations rather than problems
  const shadowArchetypes: Record<string, string[]> = {
    fire: ['The Seeker', 'The Questioner', 'The One Finding Their Voice'],
    water: ['The Guardian', 'The Observer', 'The One Learning to Feel'],
    earth: ['The Wanderer', 'The Dreamer', 'The One Finding Ground'],
    air: ['The Contemplative', 'The Quiet One', 'The One Finding Words']
  };

  const elementKey = weakest.element.toLowerCase();
  const elementShadows = shadowArchetypes[elementKey] || shadowArchetypes.fire;
  return elementShadows[Math.floor(Math.random() * elementShadows.length)];
}

function generateElementalAnalysis(petals: Petal[]): { strengths: string[]; opportunities: string[] } {
  // Calculate average intensity per element
  const elementIntensities: Record<string, number[]> = {
    fire: [],
    water: [],
    earth: [],
    air: []
  };

  petals.forEach(petal => {
    const elementKey = petal.element.toLowerCase();
    if (elementIntensities[elementKey]) {
      elementIntensities[elementKey].push(petal.intensity);
    }
  });

  const elementAverages = Object.entries(elementIntensities)
    .map(([element, intensities]) => ({
      element,
      average: intensities.length > 0
        ? intensities.reduce((sum, val) => sum + val, 0) / intensities.length
        : 0
    }))
    .filter(({ average }) => average > 0);

  elementAverages.sort((a, b) => b.average - a.average);

  // Natural language descriptions without element labels
  const strengthDescriptions: Record<string, string> = {
    fire: 'Your spiritual vision and creative power are flowing strongly',
    water: 'Your emotional wisdom and capacity for deep feeling are present',
    earth: 'Your grounded purpose and ability to manifest are active',
    air: 'Your mental clarity and authentic connection are available'
  };

  const opportunityDescriptions: Record<string, string> = {
    fire: 'Spiritual vision and creative expression are calling for attention',
    water: 'Emotional wisdom and relational depth want to emerge',
    earth: 'Grounded purpose and tangible action are inviting you forward',
    air: 'Mental clarity and conscious relating are seeking more space'
  };

  const strengths = elementAverages
    .slice(0, 2)
    .map(({ element }) => strengthDescriptions[element]);

  const opportunities = elementAverages
    .slice(-2)
    .reverse()
    .map(({ element }) => opportunityDescriptions[element]);

  return { strengths, opportunities };
}

function generateReflection(petals: Petal[], spiralStage: { element: string; stage: string }, intention?: string): string {
  // Identify highest and lowest intensity petals
  const sortedPetals = [...petals].sort((a, b) => b.intensity - a.intensity);
  const highest = sortedPetals[0];
  const lowest = sortedPetals[sortedPetals.length - 1];

  const highestInfo = PETAL_CHART[highest.id];
  const lowestInfo = PETAL_CHART[lowest.id];

  // Generate interpretive, personalized questions without technical labels
  // Describe what the petals mean in plain, evocative language

  // Map petal IDs to natural language descriptions
  const petalDescriptions: Record<string, { strong: string; weak: string }> = {
    Fire1: {
      strong: 'your inner vision and spiritual seeing',
      weak: 'seeing clearly what wants to emerge'
    },
    Fire2: {
      strong: 'creative expression and bringing ideas into form',
      weak: 'expressing what lives inside you'
    },
    Fire3: {
      strong: 'expansion and exploring new possibilities',
      weak: 'expanding beyond your current edges'
    },
    Water1: {
      strong: 'feeling deeply and trusting your emotional truth',
      weak: 'connecting with your feelings'
    },
    Water2: {
      strong: 'healing and integrating past wounds',
      weak: 'making space for healing'
    },
    Water3: {
      strong: 'surrender and trusting the mystery',
      weak: 'letting go and trusting what you cannot control'
    },
    Earth1: {
      strong: 'purpose and knowing your sacred work',
      weak: 'clarifying what you are here to serve'
    },
    Earth2: {
      strong: 'building and gathering resources',
      weak: 'creating solid foundations'
    },
    Earth3: {
      strong: 'offering your unique medicine to the world',
      weak: 'sharing your gifts with others'
    },
    Air1: {
      strong: 'authentic connection and relating deeply',
      weak: 'connecting authentically with others'
    },
    Air2: {
      strong: 'community and gathering with others',
      weak: 'finding your people and belonging'
    },
    Air3: {
      strong: 'witnessing consciousness and clear knowing',
      weak: 'seeing from a higher perspective'
    },
  };

  const highDesc = petalDescriptions[highest.id] || { strong: 'this aspect', weak: 'this quality' };
  const lowDesc = petalDescriptions[lowest.id] || { strong: 'this aspect', weak: 'this quality' };

  if (intention && intention.trim()) {
    // Context-aware questions based on their stated intention
    const primingQuestions = [
      `• Where do you feel ${highDesc.strong} showing up as you think about this?\n• What might shift if you brought more attention to ${lowDesc.weak}?\n• What's one small step you could take today?`,

      `• How is ${highDesc.strong} serving you right now?\n• What would it look like to explore ${lowDesc.weak} more fully?\n• What are you most curious about?`,

      `• What does ${highDesc.strong} feel like in your body when you consider this question?\n• Where might ${lowDesc.weak} want to emerge?\n• What support do you need?`,

      `• What's the gift of having ${highDesc.strong} so present for you right now?\n• What might ${lowDesc.weak} be trying to tell you?\n• What matters most to you here?`,
    ];

    return primingQuestions[Math.floor(Math.random() * primingQuestions.length)];
  }

  // General priming questions (no specific intention)
  const primingQuestions = [
    `• Where do you feel ${highDesc.strong} most alive in your life right now?\n• What would it look like to bring more attention to ${lowDesc.weak}?\n• What are you noticing?`,

    `• How is ${highDesc.strong} showing up for you these days?\n• What would it be like to lean into ${lowDesc.weak}?\n• What's alive in you right now?`,

    `• When you sense ${highDesc.strong}, what's present?\n• What does ${lowDesc.weak} need from you right now?\n• What wants to be explored?`,

    `• Where do you feel ${highDesc.strong} most strongly?\n• How might ${lowDesc.weak} support your journey?\n• What's calling for attention?`,
  ];

  return primingQuestions[Math.floor(Math.random() * primingQuestions.length)];
}

function generatePractice(petals: Petal[], spiralStage: { element: string }): string {
  const practices: Record<string, string[]> = {
    Fire: [
      'Close your eyes and ask: "What does my soul truly see?" Let the first image arise without judgment.',
      'Light a candle. Gaze into the flame for 3 minutes. What vision emerges?',
      'Create something today—anything—without worrying if it\'s good. Just express.',
    ],
    Water: [
      'Place your hand on your heart. Breathe. Ask: "What am I feeling beneath the surface?"',
      'Write a letter to a wound. Thank it for protecting you. Then ask what it needs to heal.',
      'Sit by water—real or imagined. Let yourself dissolve into its mystery.',
    ],
    Earth: [
      'Complete this sentence: "I am here to serve by..." Say it aloud three times.',
      'Touch the earth with bare hands. Plant something, even if it\'s just a seed in a cup.',
      'Make one thing today with your hands. Offer it as medicine to someone who needs it.',
    ],
    Air: [
      'Speak one truth you\'ve been holding back. Say it aloud to yourself first.',
      'Call someone you love. Just listen. Don\'t fix, advise, or redirect. Just be present.',
      'Journal this question: "What does my highest self know that I\'m not yet living?"',
    ],
  };

  const elementPractices = practices[spiralStage.element] || practices.Fire;
  return elementPractices[Math.floor(Math.random() * elementPractices.length)];
}

function generatePetalFeeling(petalId: string, intensity: number): string {
  const feelings: Record<string, string[]> = {
    Fire1: ['inner vision awakening', 'seeing with soul eyes', 'spiritual clarity emerging'],
    Fire2: ['creative expression flowing', 'authentic self emerging', 'bringing vision into form'],
    Fire3: ['expansion calling', 'exploring new horizons', 'boundless possibility opening'],
    Water1: ['heart opening gently', 'feeling deeply', 'emotional truth rising'],
    Water2: ['healing in progress', 'integrating shadows', 'transformation underway'],
    Water3: ['surrendering to mystery', 'trusting the process', 'grace descending'],
    Earth1: ['purpose clarifying', 'commitment strengthening', 'mission activating'],
    Earth2: ['building foundations', 'resources gathering', 'material world supporting'],
    Earth3: ['offering medicine', 'service flowing', 'gifts manifesting'],
    Air1: ['connection deepening', 'authentic meeting', 'true dialogue emerging'],
    Air2: ['community gathering', 'belonging felt', 'collective field strengthening'],
    Air3: ['consciousness expanding', 'witnessing clearly', 'awareness illuminating'],
  };

  const petalFeelings = feelings[petalId] || ['energy flowing'];
  const feelingBase = petalFeelings[Math.floor(Math.random() * petalFeelings.length)];

  if (intensity >= 8) return `${feelingBase} powerfully`;
  if (intensity >= 5) return `${feelingBase}`;
  if (intensity >= 3) return `${feelingBase} gently`;
  return `${feelingBase} subtly`;
}

function generatePetalRitual(petalId: string, intensity: number): string {
  const rituals: Record<string, string> = {
    Fire1: 'Close your eyes and ask: "What does my soul see?" Trust the first image that comes.',
    Fire2: 'Create something today—anything. Don\'t judge it. Just let it flow.',
    Fire3: 'Say yes to one adventure today. Step outside your comfort zone.',
    Water1: 'Place your hand on your heart. Breathe. Ask: "What am I feeling?"',
    Water2: 'Write a letter to a wound. Thank it. Ask what it needs.',
    Water3: 'Sit in stillness. Let go of one thing you\'ve been controlling.',
    Earth1: 'Complete this sentence: "I am here to serve by..." Say it three times.',
    Earth2: 'Touch the earth with bare hands. Feel its support.',
    Earth3: 'Offer your unique gift to someone who needs it today.',
    Air1: 'Call someone you love. Just listen. Don\'t fix or advise.',
    Air2: 'Gather with others. Share one authentic truth about yourself.',
    Air3: 'Journal this question: "What does my highest self know that I\'m not yet living?"',
  };

  return rituals[petalId] || 'Take three deep breaths and ask your body what it needs.';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petals, intention } = body;

    if (!petals || !Array.isArray(petals)) {
      return NextResponse.json(
        { error: 'Invalid request: petals array required' },
        { status: 400 }
      );
    }

    // Analyze spiral stage
    const spiralStage = analyzeSpiralStage(petals);

    // Generate elemental analysis (strengths and opportunities)
    const elementalAnalysis = generateElementalAnalysis(petals);

    // Generate archetypes (dominant and shadow)
    const archetype = generateArchetype(petals, spiralStage);
    const shadowArchetype = generateShadowArchetype(petals);

    // Generate reflection (with intention context if provided)
    const reflection = generateReflection(petals, spiralStage, intention);

    // Generate practice
    const practice = generatePractice(petals, spiralStage);

    // Generate petal-specific insights
    const petalInsights = petals.map(petal => ({
      petalId: petal.id,
      petalName: petal.name,
      feeling: generatePetalFeeling(petal.id, petal.intensity),
      ritual: generatePetalRitual(petal.id, petal.intensity),
      info: PETAL_CHART[petal.id]
    }));

    // Construct oracle reading
    const reading = {
      spiralStage,
      elementalAlchemy: {
        strengths: elementalAnalysis.strengths,
        opportunities: elementalAnalysis.opportunities
      },
      archetypes: {
        dominant: archetype,
        shadow: shadowArchetype
      },
      reflection,
      practice,
      petalInsights,
      rawData: petals, // Store for MAIA's longitudinal learning
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(reading);

  } catch (error) {
    console.error('Oracle Holoflower API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate oracle reading' },
      { status: 500 }
    );
  }
}
