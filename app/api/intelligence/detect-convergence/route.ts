/**
 * Convergence Detection API
 * On-demand detection of transformation signatures across 26+ frameworks
 */

import { NextRequest, NextResponse } from 'next/server';
import { crossFrameworkSynergyEngine } from '@/lib/intelligence/CrossFrameworkSynergyEngine';
import type { ExtractionResult } from '@/lib/intelligence/SymbolExtractionEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      text,
      conversationHistory = [],
      fieldState = null,
      userId
    } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Build ExtractionResult from available data
    const extraction = buildExtractionFromText(text, conversationHistory, fieldState);

    // Detect convergence patterns
    const signatures = crossFrameworkSynergyEngine.detectSynergies(extraction);
    const topSignature = crossFrameworkSynergyEngine.getTopSignature(signatures);

    console.log('🔮 Convergence detection complete:', {
      signaturesFound: signatures.length,
      topPattern: topSignature?.name,
      frameworks: topSignature?.frameworkCount
    });

    return NextResponse.json({
      success: true,
      data: {
        signatures,
        topSignature,
        extraction: {
          confidence: extraction.confidence,
          narrativeThemes: extraction.narrativeThemes,
          emotionCount: extraction.emotions?.length || 0,
          archetypeCount: extraction.archetypes?.length || 0
        }
      }
    });
  } catch (error) {
    console.error('Convergence detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Build ExtractionResult from available text and context
 * Uses pattern matching and inference to populate framework states
 */
function buildExtractionFromText(
  text: string,
  conversationHistory: any[],
  fieldState: any
): ExtractionResult {

  const lowerText = text.toLowerCase();
  const fullContext = conversationHistory.map((m: any) => m.content).join(' ').toLowerCase() + ' ' + lowerText;

  // Detect alchemical stage from language patterns
  const alchemicalStage = detectAlchemicalStage(fullContext);

  // Detect polyvagal state from emotional/somatic indicators
  const polyvagalState = detectPolyvagalState(fullContext, fieldState);

  // Detect IFS parts from language patterns
  const ifsParts = detectIFSParts(fullContext);

  // Detect Jungian processes
  const jungianProcess = detectJungianProcess(fullContext);

  // Detect somatic states
  const somaticState = detectSomaticState(fullContext, fieldState);

  // Detect Gestalt contact disturbances
  const gestaltState = detectGestaltState(fullContext);

  // Detect hemispheric mode
  const hemisphericMode = detectHemisphericMode(fullContext);

  // Detect constellation/systemic patterns
  const constellationState = detectConstellationState(fullContext);

  // Detect existential themes
  const existentialState = detectExistentialState(fullContext);

  // Detect ACT patterns
  const actState = detectACTState(fullContext);

  // Detect CFT patterns
  const cftState = detectCFTState(fullContext);

  // Detect Schema Therapy patterns
  const schemaTherapyState = detectSchemaTherapyState(fullContext);

  // Detect DBT patterns
  const dbtState = detectDBTState(fullContext);

  // Detect Compassionate Inquiry patterns
  const compassionateInquiryState = detectCompassionateInquiryState(fullContext);

  // Detect NARM patterns
  const narmState = detectNARMState(fullContext);

  // Detect Eco-Therapy patterns
  const ecoTherapyState = detectEcoTherapyState(fullContext);

  // Detect CBT patterns
  const cbtState = detectCBTState(fullContext);

  // Extract narrative themes
  const narrativeThemes = extractNarrativeThemes(fullContext);

  return {
    symbols: [],
    archetypes: [],
    emotions: [],
    milestones: [],
    narrativeThemes,
    confidence: 0.75, // Baseline confidence for inference-based extraction

    // Framework-specific states
    alchemicalStage,
    polyvagalState,
    ifsParts,
    jungianProcess,
    somaticState,
    gestaltState,
    hemisphericMode,
    constellationState,
    existentialState,
    actState,
    cftState,
    schemaTherapyState,
    dbtState,
    compassionateInquiryState,
    narmState,
    ecoTherapyState,
    cbtState
  } as ExtractionResult;
}

// Detection functions for each framework

function detectAlchemicalStage(text: string) {
  const nigredoWords = /\b(dark|death|dissolve|chaos|breakdown|falling apart|lost|void|black|despair)\b/gi;
  const albedoWords = /\b(light|clarity|purification|cleansing|dawn|white|clear|washing away)\b/gi;
  const citrinitasWords = /\b(yellow|sun|gold|dawn|awakening|solar|breakthrough|illumination)\b/gi;
  const rubedoWords = /\b(red|completion|integration|wholeness|embodiment|gold|phoenix|rebirth)\b/gi;

  const nigredoCount = (text.match(nigredoWords) || []).length;
  const albedoCount = (text.match(albedoWords) || []).length;
  const citrinitasCount = (text.match(citrinitasWords) || []).length;
  const rubedoCount = (text.match(rubedoWords) || []).length;

  const total = nigredoCount + albedoCount + citrinitasCount + rubedoCount;

  if (total === 0) return { detected: false };

  const stages = [
    { stage: 'nigredo' as const, count: nigredoCount },
    { stage: 'albedo' as const, count: albedoCount },
    { stage: 'citrinitas' as const, count: citrinitasCount },
    { stage: 'rubedo' as const, count: rubedoCount }
  ];

  const primary = stages.sort((a, b) => b.count - a.count)[0];
  const coherence = primary.count / total;

  return {
    detected: true,
    primaryStage: primary.stage,
    coherence,
    confidence: Math.min(coherence + 0.2, 1.0)
  };
}

function detectPolyvagalState(text: string, fieldState: any) {
  // Use field state if available
  if (fieldState?.somaticIntelligence?.nervous_system_state) {
    const state = fieldState.somaticIntelligence.nervous_system_state;
    if (state === 'shutdown' || state === 'freeze') {
      return { detected: true, state: 'dorsal', safety: 0.2 };
    }
    if (state === 'activation' || state === 'fight-flight') {
      return { detected: true, state: 'sympathetic', safety: 0.5 };
    }
    if (state === 'regulated' || state === 'calm') {
      return { detected: true, state: 'ventral', safety: 0.8 };
    }
  }

  // Pattern matching fallback
  const dorsalWords = /\b(shutdown|numb|frozen|disconnected|can't feel|empty|void|collapse)\b/gi;
  const sympatheticWords = /\b(anxious|panic|racing|activated|fight|flight|tense|wired|hypervigilant)\b/gi;
  const ventralWords = /\b(calm|safe|connected|regulated|peaceful|present|grounded|settled)\b/gi;

  const dorsalCount = (text.match(dorsalWords) || []).length;
  const sympatheticCount = (text.match(sympatheticWords) || []).length;
  const ventralCount = (text.match(ventralWords) || []).length;

  if (dorsalCount > sympatheticCount && dorsalCount > ventralCount) {
    return { detected: true, state: 'dorsal', safety: 0.2 };
  }
  if (sympatheticCount > ventralCount) {
    return { detected: true, state: 'sympathetic', safety: 0.5 };
  }
  if (ventralCount > 0) {
    return { detected: true, state: 'ventral', safety: 0.8 };
  }

  return { detected: false };
}

function detectIFSParts(text: string) {
  const managerWords = /\b(control|manage|organize|plan|should|must|have to|responsible|perfect)\b/gi;
  const firefighterWords = /\b(numb|distract|escape|avoid|substance|binge|compulsion)\b/gi;
  const exileWords = /\b(abandoned|rejected|hurt|wounded|young|vulnerable|shame|unlovable)\b/gi;
  const selfWords = /\b(compassion|curiosity|calm|clarity|confidence|courage|creative|connected)\b/gi;

  const managerCount = (text.match(managerWords) || []).length;
  const firefighterCount = (text.match(firefighterWords) || []).length;
  const exileCount = (text.match(exileWords) || []).length;
  const selfCount = (text.match(selfWords) || []).length;

  const parts: any[] = [];
  if (managerCount > 0) parts.push({ type: 'manager', indicator: 'controlling language', burden: 'overwhelm' });
  if (firefighterCount > 0) parts.push({ type: 'firefighter', indicator: 'distraction patterns', burden: 'pain avoidance' });
  if (exileCount > 0) parts.push({ type: 'exile', indicator: 'wounded language', burden: 'core shame' });

  const selfEnergy = selfCount > 0 ? Math.min(selfCount / 10, 1.0) : 0;

  return {
    detected: parts.length > 0,
    parts,
    selfEnergy
  };
}

function detectJungianProcess(text: string) {
  const shadowWords = /\b(shadow|denied|repressed|projection|disowned|hidden|dark side)\b/gi;
  const individuationWords = /\b(individuation|wholeness|integration|becoming|authentic self|journey)\b/gi;
  const projectionWords = /\b(project|see in others|judge|criticize|blame)\b/gi;

  return {
    shadowWork: (text.match(shadowWords) || []).length > 0,
    individuation: (text.match(individuationWords) || []).length > 0,
    projection: (text.match(projectionWords) || []).length > 0
  };
}

function detectSomaticState(text: string, fieldState: any) {
  const freezeWords = /\b(frozen|stuck|paralyzed|can't move|immobilized)\b/gi;
  const fightWords = /\b(fight|rage|attack|clench|jaw|fist|push back)\b/gi;
  const flightWords = /\b(flee|escape|run away|get out|restless legs)\b/gi;

  const freezeDetected = (text.match(freezeWords) || []).length > 0;
  const fightDetected = (text.match(fightWords) || []).length > 0;
  const flightDetected = (text.match(flightWords) || []).length > 0;

  let type: 'freeze' | 'fight' | 'flight' | 'none' = 'none';
  if (freezeDetected) type = 'freeze';
  else if (fightDetected) type = 'fight';
  else if (flightDetected) type = 'flight';

  return {
    detected: type !== 'none',
    incompleteResponse: {
      detected: type !== 'none',
      type
    },
    arousal: {
      state: type === 'freeze' ? 'hypoarousal' : type !== 'none' ? 'hyperarousal' : 'regulated',
      windowOfTolerance: type === 'none'
    },
    discharge: {
      active: false
    }
  };
}

function detectGestaltState(text: string) {
  const retroflectionWords = /\b(turn inward|against myself|self-attack|self-harm|hold back)\b/gi;
  const introjectionWords = /\b(should|must|have to|ought to|supposed to|others say)\b/gi;
  const projectionWords = /\b(they are|people are|everyone is|others are|judge me)\b/gi;
  const deflectionWords = /\b(whatever|doesn't matter|change topic|anyway|moving on)\b/gi;
  const confluenceWords = /\b(we feel|everyone feels|lose myself|no boundaries|merge)\b/gi;

  return {
    detected: true,
    contactDisturbances: {
      retroflection: { detected: (text.match(retroflectionWords) || []).length > 0 },
      introjection: { detected: (text.match(introjectionWords) || []).length > 2 },
      projection: { detected: (text.match(projectionWords) || []).length > 0 },
      deflection: { detected: (text.match(deflectionWords) || []).length > 0 },
      confluence: { detected: (text.match(confluenceWords) || []).length > 0 }
    },
    awareness: {
      hereAndNow: 0.5
    }
  };
}

function detectHemisphericMode(text: string) {
  const leftWords = /\b(analyze|logic|structure|linear|sequential|data|facts|numbers|calculate)\b/gi;
  const rightWords = /\b(feel|sense|intuition|holistic|metaphor|image|dream|creative|flow)\b/gi;

  const leftCount = (text.match(leftWords) || []).length;
  const rightCount = (text.match(rightWords) || []).length;

  const dominant = leftCount > rightCount ? 'left' : rightCount > leftCount ? 'right' : 'balanced';
  const indicators = dominant === 'left' ? ['left-analytical', 'left-structured'] :
                    dominant === 'right' ? ['right-embodied', 'right-imaginal'] :
                    ['balanced'];

  return { dominant, indicators };
}

function detectConstellationState(text: string) {
  const systemicWords = /\b(family|mother|father|parent|sibling|ancestor|generation|inherited|carry for)\b/gi;
  const excludedWords = /\b(excluded|forgotten|unnamed|secret|hidden|never spoke of)\b/gi;
  const entanglementWords = /\b(enmeshed|entangled|not mine|belongs to|carrying for)\b/gi;

  const systemicDetected = (text.match(systemicWords) || []).length > 2;
  const excludedDetected = (text.match(excludedWords) || []).length > 0;
  const entanglementDetected = (text.match(entanglementWords) || []).length > 0;

  return {
    detected: systemicDetected,
    systemicEntanglement: {
      detected: entanglementDetected,
      confidence: entanglementDetected ? 0.6 : 0
    },
    excludedMembers: {
      detected: excludedDetected,
      names: []
    },
    movementPattern: {
      type: 'interrupted-reaching' as const
    },
    ordersOfLove: {
      violation: entanglementDetected
    },
    transgenerationalPattern: {
      detected: systemicDetected && (text.match(/\b(generation|ancestor|inherited)\b/gi) || []).length > 0
    }
  };
}

function detectExistentialState(text: string) {
  const meaninglessWords = /\b(meaningless|pointless|no purpose|why bother|what's the point)\b/gi;
  const meaningWords = /\b(meaning|purpose|calling|mission|significance|matters)\b/gi;

  return {
    existentialGivens: {
      meaninglessness: {
        detected: (text.match(meaninglessWords) || []).length > 0
      }
    },
    meaning: {
      clarity: (text.match(meaningWords) || []).length > 0 ? 0.7 : 0.3
    }
  };
}

function detectACTState(text: string) {
  const fusionWords = /\b(I am|I'm just|that's who I am|I can't|I'm not)\b/gi;
  const valuesWords = /\b(value|important|matters to me|care about|stand for)\b/gi;
  const actionWords = /\b(taking action|committed|doing|practicing|working toward)\b/gi;

  return {
    hexaflex: {
      values: {
        clarity: (text.match(valuesWords) || []).length > 0 ? 0.7 : 0.3
      },
      committedAction: {
        level: (text.match(actionWords) || []).length > 0 ? 0.6 : 0.3
      }
    },
    cognitiveFusion: {
      detected: (text.match(fusionWords) || []).length > 2,
      literality: (text.match(fusionWords) || []).length / 10
    }
  };
}

function detectCFTState(text: string) {
  const threatWords = /\b(threat|danger|attack|harsh|critical|punishing)\b/gi;
  const soothingWords = /\b(soothing|comfort|gentle|kind|compassion)\b/gi;
  const shameWords = /\b(shame|ashamed|humiliated|defective|worthless)\b/gi;

  return {
    systemBalance: {
      imbalance: (text.match(threatWords) || []).length > (text.match(soothingWords) || []).length ? 'threat-dominant' : 'balanced'
    },
    threeSystems: {
      soothing: {
        level: (text.match(soothingWords) || []).length / 10
      }
    },
    shame: {
      detected: (text.match(shameWords) || []).length > 0
    }
  };
}

function detectSchemaTherapyState(text: string) {
  const schemaWords = /\b(abandon|reject|defective|unlovable|worthless|failure)\b/gi;
  const punitiveWords = /\b(should|must|not good enough|failure|disappoint)\b/gi;

  return {
    detected: (text.match(schemaWords) || []).length > 0,
    schemas: {
      defectiveness: {
        detected: /\b(defective|broken|flawed|wrong with me)\b/gi.test(text)
      }
    },
    modes: {
      punitiveParent: (text.match(punitiveWords) || []).length > 2
    },
    shameIdentifications: {
      detected: /\b(I am|I'm just|that's who I am)\b/gi.test(text) && /\b(bad|broken|worthless)\b/gi.test(text)
    }
  };
}

function detectDBTState(text: string) {
  const crisisWords = /\b(crisis|overwhelm|can't cope|falling apart|too much)\b/gi;

  return {
    distressTolerance: {
      inCrisis: (text.match(crisisWords) || []).length > 0
    }
  };
}

function detectCompassionateInquiryState(text: string) {
  const shameWords = /\b(shame|ashamed|embarrassed|humiliated)\b/gi;

  return {
    implicitEmotion: {
      implicitEmotion: (text.match(shameWords) || []).length > 0 ? ['shame'] : []
    }
  };
}

function detectNARMState(text: string) {
  const survivalWords = /\b(survival|safe|safety|trust|connection|attunement|autonomy)\b/gi;

  return {
    survivalStyles: {
      connection: {
        detected: /\b(connection|attunement|bonding)\b/gi.test(text)
      }
    }
  };
}

function detectEcoTherapyState(text: string) {
  const ecoGriefWords = /\b(climate|extinction|species|planet|earth dying|eco|environment)\b/gi;

  return {
    ecologicalGrief: {
      detected: (text.match(ecoGriefWords) || []).length > 0,
      overwhelm: /\b(overwhelm|too much|helpless|hopeless)\b/gi.test(text)
    }
  };
}

function detectCBTState(text: string) {
  const distortionWords = /\b(always|never|everyone|no one|worst|terrible|catastrophe)\b/gi;

  return {
    cognitiveDistortions: {
      allOrNothing: /\b(always|never)\b/gi.test(text),
      catastrophizing: /\b(worst|terrible|catastrophe|disaster)\b/gi.test(text),
      overgeneralization: /\b(everyone|no one|always|never)\b/gi.test(text)
    }
  };
}

function extractNarrativeThemes(text: string): string[] {
  const themes: string[] = [];

  if (/\b(transform|change|shift|emerge|become)\b/gi.test(text)) themes.push('transformation');
  if (/\b(break|breakthrough|revelation|realize|dawn)\b/gi.test(text)) themes.push('breakthrough');
  if (/\b(whole|complete|integrate|unity|together)\b/gi.test(text)) themes.push('wholeness');
  if (/\b(dark|shadow|death|void|black)\b/gi.test(text)) themes.push('darkness');
  if (/\b(light|bright|illuminate|clarity|gold)\b/gi.test(text)) themes.push('light');
  if (/\b(rebirth|phoenix|rise|resurrect|new life)\b/gi.test(text)) themes.push('rebirth');

  return themes;
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Convergence Detection API',
    description: 'On-demand detection of transformation signatures across 26+ frameworks',
    usage: {
      method: 'POST',
      body: {
        text: 'string (required) - Text to analyze',
        conversationHistory: 'array (optional) - Previous messages for context',
        fieldState: 'object (optional) - Current field state from MAIA',
        userId: 'string (optional) - User identifier'
      }
    },
    frameworks: [
      'Alchemy', 'Jung', 'IFS', 'Polyvagal', 'Levine', 'Gestalt', 'McGilchrist',
      'Family Constellation', 'Levin', 'Existential', 'Schema Therapy', 'DBT',
      'ACT', 'CFT', 'Compassionate Inquiry', 'NARM', 'Eco-Therapy', 'CBT'
    ]
  });
}
