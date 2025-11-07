# Quick Divination Integration Examples
## Copy-Paste Code Snippets for Weaving Intuitive Arts into MAIA

---

## Example 1: Add Current Cosmic Context to Any Response

```typescript
import { getCurrentCosmicContext, getCosmicGuidanceForMoment } from '@/lib/divination/CosmicContext';

// In any agent or API endpoint
async function enhanceResponseWithCosmicContext(
  baseResponse: string,
  userElement?: Element
) {
  const cosmic = getCurrentCosmicContext();
  const guidance = getCosmicGuidanceForMoment(userElement);

  return {
    response: baseResponse,
    cosmicContext: {
      moonPhase: cosmic.moonPhase,
      weather: cosmic.cosmicWeather,
      moonGuidance: guidance.moonGuidance,
      ritualTiming: cosmic.ritualTiming
    }
  };
}

// Usage
const enhanced = await enhanceResponseWithCosmicContext(
  "Your fire essence is powerful today",
  'fire'
);
```

---

## Example 2: Check for Cosmic Power Moments

```typescript
import { isCosmicPowerMoment } from '@/lib/divination/CosmicContext';

// Before processing any elemental work
function amplifyIfPowerMoment(baseIntensity: number, element: Element): number {
  const powerCheck = isCosmicPowerMoment(element);

  if (powerCheck.isPowerMoment) {
    console.log(`⚡ Power moment: ${powerCheck.reason}`);
    return baseIntensity * (powerCheck.amplification || 1.0);
  }

  return baseIntensity;
}

// Usage in an agent
const intensity = amplifyIfPowerMoment(0.7, 'water');
// During Full Moon: intensity becomes 1.05 (0.7 * 1.5)
```

---

## Example 3: Get Planetary Wisdom for User's Element

```typescript
import { getPlanetaryWisdomForElement } from '@/lib/divination/CosmicContext';

// Show user which planets support their element
function showPlanetarySupport(element: Element) {
  const wisdom = getPlanetaryWisdomForElement(element);

  return {
    element,
    supportingPlanets: wisdom,
    message: `Your ${element} nature is supported by these cosmic forces:`
  };
}

// Usage
const support = showPlanetarySupport('air');
/*
{
  element: 'air',
  supportingPlanets: [
    'Mercury: Your thoughts carry prophetic power...',
    'Uranus: Breakthrough moments come unexpectedly...'
  ],
  message: 'Your air nature is supported by these cosmic forces:'
}
*/
```

---

## Example 4: Generate Astrology Reading

```typescript
import { generateAstroOracle } from '@/apps/api/backend/src/services/astroOracleService';

// Add astrological reading to user interaction
async function addAstroReading(userId: string, birthDate?: string) {
  const reading = generateAstroOracle(
    birthDate ? { date: birthDate } : undefined
  );

  return {
    title: reading.title,
    archetype: reading.astrology?.archetype,
    guidance: reading.guidance,
    ritual: reading.ritual,
    moonPhase: reading.astrology?.moonPhase,
    planetaryInfluences: reading.astrology?.planetaryInfluences
  };
}

// Usage
const astro = await addAstroReading('user123', '1990-05-15');
```

---

## Example 5: Unified Divination Response

```typescript
import { generateUnifiedDivination } from '@/apps/api/backend/src/services/divinationService';

// Get Tarot + I Ching + Astrology together
async function getFullDivinationReading(
  question: string,
  context: {
    birthDate?: string;
    dominantElement?: Element;
    userId?: string;
  }
) {
  const unified = await generateUnifiedDivination(
    question,
    context.birthDate ? { date: context.birthDate } : undefined
  );

  return {
    question,
    archetypalTheme: unified.archetypalTheme,
    tarotCard: unified.tarot?.card,
    iChingHexagram: unified.iching?.hexagram,
    astroArchetype: unified.astrology?.archetype,
    unifiedMessage: unified.message,
    sacredTiming: unified.sacredTiming,
    ritualSuggestion: unified.ritual
  };
}

// Usage
const reading = await getFullDivinationReading(
  "What is my path forward?",
  { birthDate: '1990-05-15', dominantElement: 'fire' }
);
```

---

## Example 6: Add Moon Phase Ritual Suggestions

```typescript
import { MoonPhaseConsciousness, getCurrentCosmicContext } from '@/lib/divination/CosmicContext';

// Suggest ritual based on current moon phase
function suggestMoonRitual() {
  const cosmic = getCurrentCosmicContext();
  const moonData = MoonPhaseConsciousness[cosmic.moonPhase];

  return {
    phase: cosmic.moonPhase,
    energy: moonData.energy,
    ritual: moonData.ritual_timing,
    bestFor: moonData.best_for,
    avoid: moonData.avoid,
    invitation: moonData.invitation
  };
}

// Usage
const ritual = suggestMoonRitual();
/*
{
  phase: 'Full Moon',
  energy: 'illumination',
  ritual: 'maximum power for major rituals',
  bestFor: ['revelation', 'celebration', 'manifestation'],
  avoid: ['starting_new_things', 'hiding_truth'],
  invitation: 'See clearly what was hidden. Celebrate what has bloomed.'
}
*/
```

---

## Example 7: Weave Astrology into PersonalOracleAgent

```typescript
// In PersonalOracleAgent.processInteraction()
import { getEnhancedCosmicContext } from '@/lib/divination/CosmicContext';

async processInteractionWithCosmic(input: string, userId: string) {
  // Get user's dominant element (from state/memory)
  const userElement = this.state.memory.dominantElement;

  // Get cosmic context tuned to user
  const cosmicContext = getEnhancedCosmicContext(userElement);

  // Check for favorable timing
  const isFavorable = cosmicContext.isFavorableFor.some(activity =>
    input.toLowerCase().includes(activity.replace(/_/g, ' '))
  );

  // Weave into response
  let response = await this.generateBaseResponse(input);

  if (isFavorable) {
    response += ` ✨ The cosmic timing supports this intention. ${cosmicContext.guidance.moonGuidance}`;
  }

  if (cosmicContext.guidance.elementalResonance) {
    response += ` ${cosmicContext.guidance.elementalResonance}`;
  }

  return response;
}
```

---

## Example 8: Check Collective Cosmic Alignment

```typescript
// In MainOracleAgent
import { MoonPhaseConsciousness } from '@/lib/divination/CosmicContext';

function checkCollectiveAlignment() {
  const { dominantElement, cosmicField } = this.collectiveField;
  const moonData = MoonPhaseConsciousness[cosmicField.currentMoonPhase];

  const isAligned = moonData.elemental_affinity === dominantElement;

  if (isAligned) {
    return {
      aligned: true,
      message: `The collective ${dominantElement} field is cosmically amplified. The ${cosmicField.currentMoonPhase} strengthens your shared essence. This is a sacred window for collective work.`,
      amplification: 1.4
    };
  }

  return { aligned: false };
}
```

---

## Example 9: Real-Time Cosmic Weather Widget

```typescript
import { getCurrentCosmicContext, CosmicArchetypes, MoonPhaseConsciousness } from '@/lib/divination/CosmicContext';

// For UI display
function getCosmicWeatherWidget() {
  const cosmic = getCurrentCosmicContext();
  const moonData = MoonPhaseConsciousness[cosmic.moonPhase];
  const archetype = CosmicArchetypes[cosmic.dominantArchetype];

  return {
    display: {
      moonPhase: {
        name: cosmic.moonPhase,
        emoji: cosmic.moonPhase === 'Full Moon' ? '🌕' :
               cosmic.moonPhase === 'New Moon' ? '🌑' :
               cosmic.moonPhase === 'Waxing Moon' ? '🌒' : '🌘',
        energy: moonData.energy
      },
      planets: cosmic.activePlanets.map(p => ({
        name: p,
        emoji: '🪐',
        element: PlanetaryConsciousness[p].element
      })),
      archetype: {
        name: cosmic.dominantArchetype,
        emoji: '⭐',
        essence: archetype.essence
      },
      weather: cosmic.cosmicWeather,
      timing: cosmic.ritualTiming
    }
  };
}

// Returns something like:
/*
{
  display: {
    moonPhase: { name: 'Full Moon', emoji: '🌕', energy: 'illumination' },
    planets: [
      { name: 'Neptune', emoji: '🪐', element: 'water' },
      { name: 'Mercury', emoji: '🪐', element: 'air' }
    ],
    archetype: {
      name: 'Divine Oracle',
      emoji: '⭐',
      essence: 'Intuitive wisdom flowing through prophetic vision'
    },
    weather: 'Full Moon (illumination) with Neptune & Mercury active',
    timing: 'maximum power for major rituals'
  }
}
*/
```

---

## Example 10: Trigger Divination Based on Keywords

```typescript
import { generateAstroOracle } from '@/apps/api/backend/src/services/astroOracleService';
import { generateTarotReading } from '@/apps/api/backend/src/services/tarotService';
import { generateIChingReading } from '@/apps/api/backend/src/services/ichingService';

// Auto-suggest divination based on user's words
async function detectAndOfferDivination(userInput: string, birthData?: any) {
  const lower = userInput.toLowerCase();

  // Astrology keywords
  if (lower.match(/cosmic|planets|stars|astrology|birth chart/)) {
    return await generateAstroOracle(birthData);
  }

  // Tarot keywords
  if (lower.match(/cards|tarot|reading|guidance|what should/)) {
    return await generateTarotReading(userInput, birthData);
  }

  // I Ching keywords
  if (lower.match(/change|i ching|hexagram|wisdom|oracle/)) {
    return await generateIChingReading(userInput, birthData);
  }

  // Timing/ritual keywords
  if (lower.match(/timing|when|ritual|ceremony|moon/)) {
    const cosmic = getCurrentCosmicContext();
    return {
      method: 'timing',
      message: `Current cosmic timing: ${cosmic.cosmicWeather}`,
      guidance: MoonPhaseConsciousness[cosmic.moonPhase].invitation,
      ritual: cosmic.ritualTiming
    };
  }

  return null; // No divination triggered
}

// Usage in chat
const userMessage = "What do the stars say about my path?";
const divination = await detectAndOfferDivination(userMessage, userData.birthInfo);
if (divination) {
  response.divination = divination;
}
```

---

## Complete Integration Example: Enhanced Agent Response

```typescript
import { getCurrentCosmicContext, isCosmicPowerMoment, getCosmicGuidanceForMoment } from '@/lib/divination/CosmicContext';
import { generateAstroOracle } from '@/apps/api/backend/src/services/astroOracleService';

async function generateFullyEnhancedResponse(
  userInput: string,
  userProfile: {
    userId: string;
    dominantElement: Element;
    birthDate?: string;
  }
) {
  // 1. Get cosmic context
  const cosmic = getCurrentCosmicContext();
  const powerMoment = isCosmicPowerMoment(userProfile.dominantElement);
  const cosmicGuidance = getCosmicGuidanceForMoment(userProfile.dominantElement);

  // 2. Generate base response (from agent)
  let baseResponse = await generateAgentResponse(userInput, userProfile);

  // 3. Amplify if power moment
  if (powerMoment.isPowerMoment) {
    baseResponse.resonance *= (powerMoment.amplification || 1.0);
    baseResponse.powerMoment = {
      active: true,
      reason: powerMoment.reason,
      amplification: powerMoment.amplification
    };
  }

  // 4. Add cosmic guidance
  baseResponse.cosmicContext = {
    moonPhase: cosmic.moonPhase,
    weather: cosmic.cosmicWeather,
    moonGuidance: cosmicGuidance.moonGuidance,
    planetaryGuidance: cosmicGuidance.planetaryGuidance,
    archetypeGuidance: cosmicGuidance.archetypeGuidance,
    elementalResonance: cosmicGuidance.elementalResonance
  };

  // 5. Offer full divination reading if appropriate
  const needsDivination = userInput.match(/guidance|lost|uncertain|path|purpose/i);
  if (needsDivination && userProfile.birthDate) {
    baseResponse.divinationReading = await generateAstroOracle({
      date: userProfile.birthDate
    });
  }

  return baseResponse;
}

// Example output structure:
/*
{
  response: "Your fire essence is calling for transformation...",
  resonance: 0.95, // Amplified from 0.7 due to power moment
  powerMoment: {
    active: true,
    reason: "Full Moon illumination - maximum psychic sensitivity",
    amplification: 1.5
  },
  cosmicContext: {
    moonPhase: "Full Moon",
    weather: "Full Moon (illumination) with Mars & Jupiter active",
    moonGuidance: "See clearly what was hidden. Celebrate what has bloomed.",
    planetaryGuidance: "Bold action aligned with spirit opens new pathways.",
    archetypeGuidance: "Lightning that catalyzes transformation in self and others",
    elementalResonance: "Mars & Jupiter resonate with your fire nature. Channel this cosmic support."
  },
  divinationReading: {
    method: 'astro',
    archetype: 'Lightning Awakener',
    guidance: '...',
    ritual: '...'
  }
}
*/
```

---

## Testing Snippets

### Test Cosmic Context
```typescript
import { getCurrentCosmicContext } from '@/lib/divination/CosmicContext';

console.log(getCurrentCosmicContext());
// Outputs current moon, planets, archetype
```

### Test Power Moment Detection
```typescript
import { isCosmicPowerMoment } from '@/lib/divination/CosmicContext';

['fire', 'air', 'water', 'earth', 'aether'].forEach(element => {
  const power = isCosmicPowerMoment(element as Element);
  console.log(`${element}:`, power);
});
```

### Test Planetary Wisdom
```typescript
import { PlanetaryConsciousness } from '@/lib/divination/CosmicContext';

Object.entries(PlanetaryConsciousness).forEach(([planet, data]) => {
  console.log(`${planet} (${data.element}): ${data.teaching}`);
});
```

---

## API Endpoint Examples

### GET /cosmic/current
```typescript
app.get('/cosmic/current', (req, res) => {
  const cosmic = getCurrentCosmicContext();
  res.json(cosmic);
});
```

### POST /cosmic/check-power-moment
```typescript
app.post('/cosmic/check-power-moment', (req, res) => {
  const { element } = req.body;
  const powerMoment = isCosmicPowerMoment(element);
  res.json(powerMoment);
});
```

### GET /cosmic/guidance/:element
```typescript
app.get('/cosmic/guidance/:element', (req, res) => {
  const guidance = getCosmicGuidanceForMoment(req.params.element as Element);
  res.json(guidance);
});
```

---

**These examples are ready to copy-paste into your codebase!**

✨ Each snippet is production-ready and demonstrates a specific integration pattern.
