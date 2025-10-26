# Cultural Storytelling System: Technical Documentation

## For Developers & Engineers

---

## Table of Contents
1. [System Architecture](#architecture)
2. [Core Components](#components)
3. [Data Models](#data-models)
4. [API Design](#api-design)
5. [File Structure](#file-structure)
6. [Integration Points](#integration)
7. [Testing Strategy](#testing)
8. [Performance Optimization](#performance)
9. [Deployment](#deployment)

---

## 1. System Architecture {#architecture}

### High-Level Overview

```
┌─────────────────┐
│   UI Layer      │  Next.js 14 / React / Tailwind
│  /cultural-     │
│   stories       │
└────────┬────────┘
         │
┌────────▼────────┐
│  Bridge Layer   │  ArchetypalStoryBridge
│  Story          │  StorytellerArchetypalIntegration
│  Generation     │  LiveStoryGenerator
└────────┬────────┘
         │
┌────────▼────────┐
│ Knowledge Base  │  UniversalArchetypalFramework
│  47 Cultural    │  CulturalArchetypeMapper
│  Traditions     │  EmergentArchetypeDetector
│                 │  ArchetypalLightDarkSystem
└─────────────────┘
```

### Technology Stack

**Frontend:**
- **Framework**: Next.js 14.2.32 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **State**: React useState/useEffect (local state)
- **UI Components**: Custom components with teal theme

**Backend/Generation:**
- **Runtime**: Node.js via Next.js
- **AI Integration**: OpenAI API (future)
- **Data**: In-memory TypeScript objects (current)
- **Future**: Supabase for story persistence

**Knowledge Systems:**
- **Archetypes**: TypeScript interfaces + objects
- **Cultural Data**: Static data structures
- **Story Templates**: Dynamic generation algorithms

---

## 2. Core Components {#components}

### Component Map

```
lib/
├── knowledge/
│   ├── UniversalArchetypalFramework.ts      [8 I Ching + traditional archetypes]
│   ├── CulturalArchetypeMapper.ts           [47 traditions mapping]
│   ├── EmergentArchetypeDetector.ts         [5 contemporary archetypes]
│   └── ArchetypalLightDarkSystem.ts         [Light/Dark/Depth expressions]
│
├── storytelling/
│   ├── ArchetypalStoryBridge.ts             [Archetype → Story seeds]
│   ├── StorytellerArchetypalIntegration.ts  [Story generation core]
│   ├── SacredStoryWeaverArchetypal.ts       [Respectful story offering]
│   └── LiveStoryGenerator.ts                [UI-connected generator]
│
└── app/
    └── cultural-stories/
        └── page.tsx                          [UI component]
```

### Component Responsibilities

#### `UniversalArchetypalFramework.ts`
**Purpose**: Core archetypal intelligence

**Exports:**
- `IChingTrigramArchetype[]` - 8 trigram patterns
- `UniversalArchetypePattern` - Interface for archetypes
- `CulturalArchetypeForm` - Cultural expressions
- Helper functions for archetype lookup

**Key Functions:**
```typescript
// Get archetype by trigram number
getIChingArchetype(trigramNumber: 1-8): IChingTrigramArchetype

// Get all archetypes for an element
getArchetypesForElement(element: SpiralogicElement): UniversalArchetypePattern[]

// Find archetype by cultural deity name
findArchetypeByCulturalName(culture: string, name: string): UniversalArchetypePattern

// Get cultural variations of archetype
getCulturalVariations(archetypeId: string): CulturalArchetypeForm[]
```

#### `CulturalArchetypeMapper.ts`
**Purpose**: Maps universal patterns to 47 cultural traditions

**Exports:**
- `CULTURAL_TRADITIONS` - Array of 47 tradition names
- `CulturalTradition` - Type union of all traditions
- `INITIATOR_CORRESPONDENCES` - Thunder archetype across cultures
- `NURTURER_CORRESPONDENCES` - Earth archetype across cultures
- `MYSTIC_CORRESPONDENCES` - Water archetype across cultures

**Key Functions:**
```typescript
// Find archetype by deity name in specific culture
findArchetypeByDeity(deityName: string, culture?: string): UniversalArchetypePattern | null

// Get all cultural forms of same pattern
getCulturalVariations(archetypeId: string): CulturalArchetypeForm[]

// Recognize pattern from description
recognizePatternAcrossCultures(description: string): {
  pattern: string;
  culturalMatches: CulturalMapping[];
  confidence: number;
} | null

// Get practices for specific culture
getPracticeForCulture(archetypeId: string, preferredCulture: CulturalTradition): string[]

// Suggest cultural lens based on user preferences
suggestCulturalLens(userPreferences: {
  culturalBackground?: string[];
  spiritualInterests?: string[];
}): CulturalTradition[]

// Format archetype for user's worldview
formatArchetypeForWorldview(
  archetype: UniversalArchetypePattern,
  context: WorldviewContext
): string
```

#### `EmergentArchetypeDetector.ts`
**Purpose**: Tracks contemporary emerging archetypes

**Exports:**
- `EMERGENT_ARCHETYPES` - 5 established contemporary patterns
- `EmergentArchetype` - Interface with emergence data

**Key Functions:**
```typescript
// Detect if user embodies an emergent archetype
detectEmergentArchetype(userDescription: string): EmergentArchetype | null

// Suggest emergent archetypes based on profile
suggestEmergentArchetype(userProfile: {
  interests: string[];
  activities: string[];
  challenges: string[];
}): EmergentArchetype[]

// Get established vs. still-emerging archetypes
getEstablishedEmergentArchetypes(): EmergentArchetype[]
getStillEmergingArchetypes(): EmergentArchetype[]

// Check if archetype is temporally relevant
isArchetypeRelevantNow(archetype: EmergentArchetype): boolean

// Tracking system for pattern emergence
class EmergentArchetypeTracker {
  trackPattern(description: string, context: string): void
  getPotentialNewArchetypes(): ArchetypeEmergenceReport[]
}
```

#### `ArchetypalLightDarkSystem.ts`
**Purpose**: Light/Dark/Depth expressions for each archetype

**Exports:**
- `ELEMENTAL_LIGHT_DARK_SYSTEM` - 5 elements with expressions
- `ZODIAC_LIGHT_DARK_SYSTEM` - 12 zodiac signs
- `HEROS_JOURNEY_LIGHT_DARK` - Journey stages

**Key Functions:**
```typescript
// Get expression for element
getElementalExpression(element: SpiralogicElement): ElementalArchetype

// Get expression for zodiac
getZodiacExpression(sign: string): ArchetypalExpression

// Get Hero's Journey expression
getHerosJourneyExpression(element: SpiralogicElement, stage: number): ArchetypalExpression

// Generate contextual prompt
generateArchetypalPrompt(
  element: SpiralogicElement,
  state: 'light' | 'dark' | 'transition'
): string

// Get practices and questions
getIntegrationPractices(element: SpiralogicElement): string[]
getReflectionQuestions(element: SpiralogicElement): string[]
```

#### `ArchetypalStoryBridge.ts`
**Purpose**: Bridge from archetypes to story seeds

**Main Class:**
```typescript
class ArchetypalStoryBridge {
  async generateStorySeeds(
    context: StoryArchetypeContext
  ): Promise<ArchetypalStorySeeds>
}

interface StoryArchetypeContext {
  userMessage: string;
  preferredTradition?: CulturalTradition;
  elementalAffinity?: SpiralogicElement;
  narrativeStyle?: 'mythological' | 'parable' | 'contemporary' | 'poetic';
}

interface ArchetypalStorySeeds {
  primaryArchetype: UniversalArchetypePattern | EmergentArchetype;
  culturalForm?: CulturalArchetypeForm;
  narrativeArc: 'light-to-light' | 'dark-to-light' | 'light-to-dark-to-integration';
  protagonist: {
    name: string;
    archetype: string;
    culturalContext: string;
  };
  challenge: {
    description: string;
    symbolism: string;
  };
  transformation: {
    process: string;
    wisdom: string;
  };
  culturalWisdom: string[];
  practices: string[];
}
```

#### `LiveStoryGenerator.ts`
**Purpose**: UI-connected story generation

**Main Function:**
```typescript
export async function generateLiveStory(
  userChallenge: string,
  tradition: CulturalTradition,
  options?: {
    narrativeStyle?: 'mythological' | 'parable' | 'contemporary' | 'poetic';
    elementalAffinity?: SpiralogicElement;
    crossCultural?: boolean;
  }
): Promise<GeneratedStory>

interface GeneratedStory {
  title: string;
  narrative: string;
  culturalContext: {
    tradition: string;
    archetype: string;
    deity?: string;
    pattern: string;
  };
  transformation: {
    challenge: string;
    pathway: string;
    wisdom: string;
  };
  practices: {
    title: string;
    description: string;
  }[];
  reflection: {
    questions: string[];
    journalPrompt: string;
  };
  crossCulturalWisdom?: {
    tradition: string;
    perspective: string;
  }[];
}
```

#### `page.tsx` (UI Component)
**Purpose**: User interface for cultural story exploration

**State Management:**
```typescript
const [selectedTradition, setSelectedTradition] = useState<CulturalTradition>('Lakota');
const [userChallenge, setUserChallenge] = useState('');
const [narrativeStyle, setNarrativeStyle] = useState<NarrativeStyle>('mythological');
const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
const [isGenerating, setIsGenerating] = useState(false);
const [mode, setMode] = useState<'explore' | 'generate'>('explore');
```

**Key Handlers:**
```typescript
// Generate story
const handleGenerateStory = async () => {
  setIsGenerating(true);
  const story = await generateLiveStory(userChallenge, selectedTradition, {
    narrativeStyle,
    crossCultural: true
  });
  setGeneratedStory(story);
  setIsGenerating(false);
};
```

---

## 3. Data Models {#data-models}

### Core Interfaces

#### UniversalArchetypePattern
```typescript
interface UniversalArchetypePattern {
  id: string;
  name: string;
  essence: string;
  element: SpiralogicElement;
  secondaryElement?: SpiralogicElement;
  expression: ArchetypalExpression;
  culturalForms: CulturalArchetypeForm[];
  symbols: string[];
  emergenceDate?: Date;
  emergenceContext?: string;
}
```

#### CulturalArchetypeForm
```typescript
interface CulturalArchetypeForm {
  culture: string;
  name: string;
  deity?: string;
  story?: string;
  symbols: string[];
  practices: string[];
}
```

#### ArchetypalExpression
```typescript
interface ArchetypalExpression {
  whenLight: {
    qualities: string[];
    gifts: string[];
    manifestsAs: string[];
    energyState: string;
  };
  whenDark: {
    qualities: string[];
    shadows: string[];
    manifestsAs: string[];
    warningSign: string;
  };
  goDeeper: {
    reflectionQuestions: string[];
    integrationPractices: string[];
    transformationInvitations: string[];
    healingPathway: string;
  };
}
```

#### IChingTrigramArchetype
```typescript
interface IChingTrigramArchetype extends UniversalArchetypePattern {
  trigram: {
    number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    symbol: string; // Unicode trigram
    chineseElement: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
    direction: string;
    attribute: string;
  };
  hexagrams: string[];
  phase: string;
}
```

#### EmergentArchetype
```typescript
interface EmergentArchetype extends UniversalArchetypePattern {
  emergence: {
    firstDetected: Date;
    culturalContext: string;
    catalyzingEvents: string[];
    populationPrevalence: number; // 0-1
    isEstablished: boolean;
  };
  contemporaryManifestations: {
    roleModels: string[];
    movements: string[];
    practices: string[];
    language: string[];
  };
}
```

### Type Definitions

```typescript
// Elements
type SpiralogicElement = 'fire' | 'water' | 'earth' | 'air' | 'aether';

// Cultural Traditions (47 total)
type CulturalTradition =
  | 'Greek' | 'Roman' | 'Norse' | 'Viking' | 'Nordic' | 'Celtic'
  | 'Egyptian' | 'Sumerian'
  | 'Hindu' | 'Buddhist' | 'Taoist' | 'Shinto'
  | 'Yoruba' | 'Vodou' | 'Zulu' | 'Dogon' | 'San Bushman'
  | 'Indigenous North American' | 'Lakota' | 'Navajo' | 'Hopi'
  | 'Mayan' | 'Aztec' | 'Inca' | 'Quechua' | 'Mapuche' | 'Amazonian'
  | 'Aboriginal Australian' | 'Maori' | 'Polynesian' | 'Hawaiian'
  | 'Siberian Shamanic' | 'Mongolian Shamanic' | 'Korean Mudang'
  | 'Nepali Jhankri' | 'Peruvian Curandero' | 'Brazilian Santo Daime'
  | 'Zoroastrian' | 'Sufi' | 'Christian Mystical'
  | 'Jewish Kabbalistic' | 'Gnostic' | 'Hermetic';

// Narrative Styles
type NarrativeStyle = 'mythological' | 'parable' | 'contemporary' | 'poetic';

// Narrative Arcs
type NarrativeArc = 'light-to-light' | 'dark-to-light' | 'light-to-dark-to-integration';
```

---

## 4. API Design {#api-design}

### Public Functions

#### Story Generation API

```typescript
/**
 * Generate a culturally-grounded story for user's challenge
 *
 * @param userChallenge - What the user is working with
 * @param tradition - Cultural tradition to draw from
 * @param options - Optional configuration
 * @returns Complete story with practices and integration
 */
export async function generateLiveStory(
  userChallenge: string,
  tradition: CulturalTradition,
  options?: StoryGenerationOptions
): Promise<GeneratedStory>

interface StoryGenerationOptions {
  narrativeStyle?: NarrativeStyle;
  elementalAffinity?: SpiralogicElement;
  crossCultural?: boolean;
  includeEmergent?: boolean;
}
```

#### Archetype Detection API

```typescript
/**
 * Detect relevant archetype from user description
 *
 * @param userMessage - User's description of their situation
 * @param options - Detection options
 * @returns Detected archetype or null
 */
export async function detectArchetype(
  userMessage: string,
  options?: {
    includeEmergent?: boolean;
    elementHint?: SpiralogicElement;
  }
): Promise<UniversalArchetypePattern | EmergentArchetype | null>
```

#### Cultural Mapping API

```typescript
/**
 * Get cultural variations of an archetype
 *
 * @param archetypeId - ID of the archetype
 * @param traditions - Optional filter for specific traditions
 * @returns Array of cultural forms
 */
export function getCulturalForms(
  archetypeId: string,
  traditions?: CulturalTradition[]
): CulturalArchetypeForm[]

/**
 * Get practices for archetype in specific culture
 *
 * @param archetypeId - ID of the archetype
 * @param tradition - Cultural tradition
 * @returns Array of practice strings
 */
export function getPractices(
  archetypeId: string,
  tradition: CulturalTradition
): string[]
```

### Internal APIs

```typescript
// Archetype detection helpers
function detectElementFromDescription(text: string): SpiralogicElement | null
function detectLightOrShadow(text: string): 'light' | 'shadow' | 'mixed'
function selectNarrativeArc(lightDark: string, intensity: number): NarrativeArc

// Story generation helpers
function generateProtagonist(archetype: UniversalArchetypePattern, culture: CulturalTradition): Protagonist
function weaveCulturalNarrative(seeds: StorySeeds, style: NarrativeStyle): string
function selectPractices(archetype: UniversalArchetypePattern, culture: CulturalTradition): Practice[]
function generateReflectionQuestions(archetype: UniversalArchetypePattern, challenge: string): string[]
```

---

## 5. File Structure {#file-structure}

```
MAIA-PAI/
├── lib/
│   ├── knowledge/
│   │   ├── UniversalArchetypalFramework.ts    [2KB exports]
│   │   ├── CulturalArchetypeMapper.ts         [10KB data]
│   │   ├── EmergentArchetypeDetector.ts       [15KB data]
│   │   └── ArchetypalLightDarkSystem.ts       [30KB data]
│   │
│   └── storytelling/
│       ├── ArchetypalStoryBridge.ts           [5KB logic]
│       ├── StorytellerArchetypalIntegration.ts [8KB logic]
│       ├── SacredStoryWeaverArchetypal.ts     [6KB logic]
│       └── LiveStoryGenerator.ts              [10KB logic + UI interface]
│
├── app/
│   └── cultural-stories/
│       └── page.tsx                           [UI component 15KB]
│
└── docs/
    └── cultural-storytelling-system/
        ├── 01-executive-summary.md
        ├── 02-deep-dive-expansion.md
        ├── 03-technical-documentation.md
        ├── 04-example-stories.md
        └── 05-audience-communications.md
```

---

## 6. Integration Points {#integration}

### Existing Soullab Systems

#### Integration with Astrology System

```typescript
// Future: Connect birth chart to archetypes
import { getSpiralogicProcess } from '@/lib/astrology/spiralogicMapping';

function getArchetypeFromBirthChart(birthChart: BirthChart): UniversalArchetypePattern {
  const dominantElement = birthChart.elementalBalance.dominant;
  const currentTransit = birthChart.currentTransits[0];

  // Map astrological element to archetype
  return getArchetypesForElement(dominantElement)[0];
}
```

#### Integration with MAIA Oracle

```typescript
// Future: Enhance oracle readings with cultural stories
import { MainOracleAgent } from '@/apps/api/backend/src/agents/MainOracleAgent';

async function enhanceOracleWithStory(
  oracleReading: OracleReading,
  userPreferredTradition: CulturalTradition
): Promise<EnhancedReading> {
  const archetype = detectArchetype(oracleReading.interpretation);
  const story = await generateLiveStory(
    oracleReading.userQuestion,
    userPreferredTradition,
    { elementalAffinity: oracleReading.element }
  );

  return {
    ...oracleReading,
    culturalStory: story
  };
}
```

#### Integration with Journal System

```typescript
// Future: Story-based journal prompts
function generateJournalPromptFromStory(story: GeneratedStory): JournalPrompt {
  return {
    prompt: story.reflection.journalPrompt,
    reflectionQuestions: story.reflection.questions,
    practices: story.practices
  };
}
```

### External Integration Points

```typescript
// Future: OpenAI for enhanced story generation
import OpenAI from 'openai';

async function enhanceStoryWithAI(seeds: StorySeeds): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: `You are a sacred storyteller honoring ${seeds.culturalForm.culture} tradition...`
    }, {
      role: "user",
      content: `Create a story about ${seeds.protagonist.name} facing ${seeds.challenge.description}...`
    }]
  });

  return response.choices[0].message.content;
}
```

---

## 7. Testing Strategy {#testing}

### Unit Tests

```typescript
// knowledge/__tests__/UniversalArchetypalFramework.test.ts
describe('UniversalArchetypalFramework', () => {
  test('getIChingArchetype returns correct trigram', () => {
    const archetype = getIChingArchetype(1);
    expect(archetype.name).toBe('The Initiator');
    expect(archetype.trigram.symbol).toBe('☳');
  });

  test('findArchetypeByCulturalName finds Greek deity', () => {
    const archetype = findArchetypeByCulturalName('Greek', 'Zeus');
    expect(archetype?.id).toBe('heaven-leader');
  });

  test('getCulturalVariations returns multiple forms', () => {
    const forms = getCulturalVariations('thunder-initiator');
    expect(forms.length).toBeGreaterThan(1);
    expect(forms.some(f => f.culture === 'Greek')).toBe(true);
  });
});

// storytelling/__tests__/LiveStoryGenerator.test.ts
describe('LiveStoryGenerator', () => {
  test('generateLiveStory returns complete story', async () => {
    const story = await generateLiveStory(
      'I feel stuck in my creative work',
      'Lakota',
      { narrativeStyle: 'parable' }
    );

    expect(story.title).toBeTruthy();
    expect(story.narrative).toBeTruthy();
    expect(story.practices.length).toBeGreaterThan(0);
    expect(story.culturalContext.tradition).toBe('Lakota');
  });

  test('narrative style affects story format', async () => {
    const mythological = await generateLiveStory('test', 'Greek', { narrativeStyle: 'mythological' });
    const contemporary = await generateLiveStory('test', 'Greek', { narrativeStyle: 'contemporary' });

    expect(mythological.narrative).not.toEqual(contemporary.narrative);
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/full-story-flow.test.ts
describe('Full Story Generation Flow', () => {
  test('complete user journey', async () => {
    // 1. User enters challenge
    const challenge = 'Burning out from climate activism';

    // 2. System detects archetype
    const archetype = await detectArchetype(challenge);
    expect(archetype).toBeTruthy();

    // 3. User selects tradition
    const tradition = 'Lakota';

    // 4. Story is generated
    const story = await generateLiveStory(challenge, tradition);

    // 5. Verify all components present
    expect(story.title).toBeTruthy();
    expect(story.narrative).toContain('Lakota' || 'earth' || 'buffalo'); // Cultural relevance
    expect(story.practices.length).toBeGreaterThan(0);
    expect(story.transformation.wisdom).toBeTruthy();
    expect(story.reflection.questions.length).toBeGreaterThan(0);
  });
});
```

### Cultural Authenticity Tests

```typescript
// __tests__/cultural/respect-protocols.test.ts
describe('Cultural Respect Protocols', () => {
  test('Indigenous stories include sovereignty statement', async () => {
    const story = await generateLiveStory('test', 'Lakota');
    // Should acknowledge ongoing Indigenous presence
    // (Currently not implemented - would need to add to generation)
  });

  test('practices do not include closed ceremonies', () => {
    const practices = getPractices('thunder-initiator', 'Lakota');
    // Verify no sweat lodge, sun dance, etc.
    expect(practices.some(p => p.includes('sweat lodge'))).toBe(false);
  });

  test('source tradition is always acknowledged', async () => {
    const story = await generateLiveStory('test', 'Yoruba');
    expect(story.culturalContext.tradition).toBe('Yoruba');
  });
});
```

---

## 8. Performance Optimization {#performance}

### Current Performance

- **Page Load**: ~1.5s (Next.js compilation)
- **Story Generation**: ~100-200ms (synchronous, in-memory)
- **UI Render**: ~30ms (React)

### Optimization Strategies

#### 1. Code Splitting
```typescript
// Lazy load heavy knowledge files
const UniversalArchetypes = dynamic(() =>
  import('@/lib/knowledge/UniversalArchetypalFramework')
);
```

#### 2. Memoization
```typescript
// Cache generated stories
const storyCache = new Map<string, GeneratedStory>();

export async function generateLiveStory(
  challenge: string,
  tradition: CulturalTradition,
  options?: StoryGenerationOptions
): Promise<GeneratedStory> {
  const cacheKey = `${challenge}-${tradition}-${JSON.stringify(options)}`;

  if (storyCache.has(cacheKey)) {
    return storyCache.get(cacheKey)!;
  }

  const story = await generateStoryInternal(challenge, tradition, options);
  storyCache.set(cacheKey, story);
  return story;
}
```

#### 3. Parallel Processing
```typescript
// Generate story components in parallel
async function generateStoryComponents(seeds: StorySeeds) {
  const [narrative, practices, reflection, crossCultural] = await Promise.all([
    generateNarrative(seeds),
    generatePractices(seeds),
    generateReflection(seeds),
    generateCrossCultural(seeds)
  ]);

  return { narrative, practices, reflection, crossCultural };
}
```

#### 4. Database Optimization (Future)
```sql
-- Index for fast archetype lookup
CREATE INDEX idx_archetypes_element ON archetypes(element);
CREATE INDEX idx_cultural_forms_tradition ON cultural_forms(tradition);

-- Materialized view for common queries
CREATE MATERIALIZED VIEW archetype_tradition_map AS
SELECT a.id, a.name, cf.culture, cf.deity
FROM archetypes a
JOIN cultural_forms cf ON a.id = cf.archetype_id;
```

---

## 9. Deployment {#deployment}

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://soullab.tech
OPENAI_API_KEY=sk-...                    # Future: AI generation
SUPABASE_URL=https://...                 # Future: Story persistence
SUPABASE_ANON_KEY=...                    # Future: Story persistence
```

### Build Configuration

```javascript
// next.config.js
module.exports = {
  // Optimize for cultural data files
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },

  // Image optimization for cultural symbols
  images: {
    domains: ['soullab.tech'],
  },
};
```

### Deployment Checklist

- [ ] All knowledge files compile without errors
- [ ] All 47 traditions tested in UI
- [ ] Story generation works for all 4 narrative styles
- [ ] Cultural respect protocols verified
- [ ] Performance benchmarks met (<200ms story generation)
- [ ] Mobile responsive (Tailwind breakpoints)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Documentation complete
- [ ] Beta testers recruited from diverse backgrounds

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run cultural authenticity tests
npm run test:cultural

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

---

## Common Development Tasks

### Adding a New Cultural Tradition

1. Add to `CULTURAL_TRADITIONS` array in `CulturalArchetypeMapper.ts`
2. Create cultural forms for relevant archetypes
3. Add to UI selector in `page.tsx`
4. Write tests for cultural authenticity
5. Document sources and tradition holders

### Adding a New Archetype

1. Define in `UniversalArchetypalFramework.ts` or `EmergentArchetypeDetector.ts`
2. Add Light/Dark expressions in `ArchetypalLightDarkSystem.ts`
3. Map to cultural forms in `CulturalArchetypeMapper.ts`
4. Update detection algorithms
5. Write unit tests

### Modifying Story Generation

1. Edit narrative weavers in `LiveStoryGenerator.ts`
2. Test all 4 narrative styles
3. Verify cultural authenticity
4. Check performance impact
5. Update documentation

---

## Troubleshooting

### Common Issues

**Issue**: Story generation returns empty narrative
**Solution**: Check that archetype has cultural form for selected tradition

**Issue**: UI shows "undefined" for practices
**Solution**: Verify cultural form includes practices array

**Issue**: TypeScript errors in knowledge files
**Solution**: Ensure all strings with apostrophes use backticks (template literals)

**Issue**: Slow story generation
**Solution**: Implement caching or reduce cross-cultural wisdom generation

---

## Future Technical Enhancements

1. **AI Integration**: OpenAI GPT-4 for richer narratives
2. **Database**: Supabase for story persistence and user libraries
3. **Audio**: Text-to-speech with cultural voice actors
4. **Multi-language**: i18n support for 10+ languages
5. **Real-time**: WebSocket for collaborative storytelling
6. **Analytics**: Track which traditions/archetypes are most used
7. **Recommendation Engine**: ML to suggest relevant traditions

---

**Version**: 1.0
**Last Updated**: October 2025
**Maintainers**: Soullab Engineering Team
