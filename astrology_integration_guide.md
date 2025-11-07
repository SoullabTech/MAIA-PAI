# Astrology & Divination Integration Guide for MAIA

## Quick Reference: Where to Add Astrology/Divination

### Integration Level: BEGINNER
**Effort**: Low | **Impact**: Medium

Add astrology context to existing divination endpoints:

```
Location: /apps/api/backend/src/routes/divination.routes.ts
Add endpoint: POST /api/divination/with-astro
```

Pass `birthData` to `astroOracleService.generateAstroOracle()`
Return unified response combining tarot/iching + astrology

---

### Integration Level: INTERMEDIATE  
**Effort**: Medium | **Impact**: High

Embed astrology into agent responses:

**Location**: `/lib/agents/elemental/FireAgent.ts` (template for all 5)

```typescript
// Add at method level:
private getAstrologicalContext(input: string): string {
  const currentPlanet = this.detectRelevantPlanet(input);
  return PLANETARY_ORACLES[currentPlanet].oracle;
}

// In process() method:
const astroContext = this.getAstrologicalContext(ctx.moment.text);
const enhancedInsight = baseResponse + ' ' + astroContext;
```

**Impact**: Each elemental agent now includes current planetary influence

---

### Integration Level: ADVANCED
**Effort**: High | **Impact**: Transformational

Full field-aware astrology:

**Location**: `/lib/field/ResonanceFieldOrchestrator.ts`

Add:
```typescript
getCurrentAstrologyState(): AstrologyState {
  // Calculate current transits
  // Determine active aspect weather
  // Map to field interference patterns
  // Return recommended modalities
}

// In updateField():
const astroState = this.getCurrentAstrologyState();
this.field.astrologicalInfluence = astroState;
this.field.recommendedWork = this.suggestWorkByAstro(astroState);
```

---

## File-by-File Integration Map

### 1. `/lib/agents/MainOracleAgent.ts`

**Where**: `generateCollectiveInsight()` method (line 330)

**Add**:
```typescript
private enrichWithAstrology(insight: any): void {
  const dailyAstro = getDailyAstroGuidance();
  
  // Update cosmic theme
  insight.cosmicTheme = dailyAstro.astrology?.cosmicTheme;
  
  // Add planetary influence
  if (dailyAstro.astrology?.planetaryInfluences) {
    insight.planetaryContext = dailyAstro.astrology.planetaryInfluences[0];
  }
  
  // Add ritual timing
  if (dailyAstro.ritual) {
    insight.suggestedRitual = dailyAstro.ritual;
  }
}
```

**Call in**: `return { ..., cosmicGuidance: enrichedInsight }`

---

### 2. `/lib/agents/PersonalOracleAgent.ts`

**Where**: `processInteraction()` or enhanced version

**Add**:
```typescript
async enrichWithAstro(input: string, birthData?: BirthData) {
  // Check if query is about timing/future
  if (input.match(/when|timing|future|cosmic|astro/i)) {
    const divination = await performDivinationReading({
      method: 'astro',
      query: input,
      birthData
    });
    return divination;
  }
}
```

**Integration**: Store birthData in PersonalOracleAgent.memory, pass to astro calls

---

### 3. `/lib/agents/elemental/FireAgent.ts` (template)

**Where**: Lines 57-92 in `process()` method

**Add BEFORE Claude enhancement**:
```typescript
// Get current astrological influence
const fireAstro = this.getFireAstroContext(ctx.moment.text);

// Create astro-aware prompt
const astroEnhancedPrompt = `${basePrompt}

Current astrological influence: ${fireAstro}
Apply this cosmic context to your response about transformation and catalysis.`;

// Pass to Claude
enhancedInsight = await this.claudeService.generateOracleResponse(
  ctx.moment.text,
  { element: 'fire', astro: fireAstro },
  astroEnhancedPrompt
);

// Helper:
private getFireAstroContext(input: string): string {
  // Mars = action, Uranus = sudden change
  const fireInfluences = ['Mars', 'Uranus', 'Sun'];
  const active = fireInfluences.filter(p => 
    PLANETARY_ORACLES[p].oracle.match(input, 'gi')
  );
  return active[0] || fireInfluences[0];
}
```

**Repeat pattern for**: AirAgent (Mercury/Uranus), WaterAgent (Moon/Neptune), 
EarthAgent (Saturn/Venus), AetherAgent (Jupiter/Pluto)

---

### 4. `/lib/biometrics/ElementalCoherenceCalculator.ts`

**Where**: New method `detectKairosAstro()`

**Add**:
```typescript
detectKairosAstroWindow(
  elemental: ElementalCoherence,
  coherence: CoherenceState,
  birthChart?: ComprehensiveBirthChart
): KairosWindow & { astroTiming: string } {
  
  const baseKairos = this.detectKairosWindow(elemental, coherence);
  
  // Enhance with astro if available
  if (birthChart) {
    const currentTransits = calculateCurrentTransits(birthChart);
    const favorableAspects = currentTransits.filter(t => 
      ['Trine', 'Sextile', 'Conjunction'].includes(t.aspect)
    );
    
    if (favorableAspects.length > 0) {
      return {
        ...baseKairos,
        strength: Math.min(1, baseKairos.strength + 0.1),
        astroTiming: `${favorableAspects[0].planet} ${favorableAspects[0].aspect}`
      };
    }
  }
  
  return { ...baseKairos, astroTiming: '' };
}
```

---

### 5. `/lib/field/ResonanceFieldOrchestrator.ts`

**Where**: Lines 80+ in field state management

**Add new interface**:
```typescript
export interface FieldAstrologyContext {
  dominantArchetype: string;
  moonPhase: string;
  activeTransits: string[];
  aspectWeather: 'harmonious' | 'tense' | 'mixed';
  recommendedElement: Element;
  ritualTiming: string;
}

// In FieldState:
astrology?: FieldAstrologyContext;

// New method:
updateAstrologyContext(): void {
  this.field.astrology = {
    dominantArchetype: this.getCollectiveArchetype(),
    moonPhase: getCurrentMoonPhase(),
    activeTransits: getActiveTransits(),
    aspectWeather: this.analyzeAspectWeather(),
    recommendedElement: this.selectElementByAstro(),
    ritualTiming: this.generateRitualTiming()
  };
}
```

---

### 6. `/lib/agents/AgentCoherenceSystem.ts`

**Where**: Line 102 in `calculateCoherence()`

**Add**:
```typescript
// After user feedback analysis:
if (params.userFeedback) {
  // Check if response resonated astrologically
  const astroResonance = this.analyzeAstroResonance(
    params.responseText,
    params.userFeedback.resonance
  );
  
  // Boost confidence if astrological timing was favorable
  if (astroResonance > 0.75) {
    confidence = Math.min(1, confidence * 1.15);
  }
}
```

---

### 7. `/components/OracleConversation.tsx`

**Where**: Response rendering section

**Add**:
```typescript
{response.astrology && (
  <div className="astro-context">
    <h4>Cosmic Timing</h4>
    <p>{response.astrology.cosmicTheme}</p>
    {response.astrology.ritual && (
      <details>
        <summary>Ritual Recommendation</summary>
        <p>{response.astrology.ritual}</p>
      </details>
    )}
  </div>
)}

{response.symbols && (
  <div className="symbols">
    <h4>Sacred Symbols</h4>
    <ul>{response.symbols.map(s => <li>{s}</li>)}</ul>
  </div>
)}
```

---

## Data Structures Already in Place

### Divination Types
```typescript
DivinationQuery {
  method: 'tarot' | 'iching' | 'yijing' | 'astro' | 'unified'
  query: string
  birthData?: BirthData
  focus?: string
  spread?: string
  depth?: 'basic' | 'detailed' | 'comprehensive'
}

DivinationInsight {
  method: DivinationMethod
  title, subtitle, message, insight, guidance, ritual
  symbols?: string[]
  keywords?: string[]
  astrology?: AstrologyReading
  archetypalTheme?: string
  energeticSignature?: string
  timestamp, confidence: 0-1, resonance: 'high'|'medium'|'low'
}
```

### Astrology Types
```typescript
AstrologyReading {
  archetype: string
  currentTransits: string[]
  timing: string
  moonPhase: string
  planetaryInfluences: string[]
  elementalBalance: Record<string, number>
  guidance: string
  cosmicTheme: string
}

BirthData {
  date?: string (YYYY-MM-DD)
  time?: string (HH:MM)
  location?: string
  timezone?: string
}
```

---

## Testing Integration Points

### Test 1: Basic Astro Enrichment
```typescript
const birthData = {
  date: '1990-03-15',
  time: '14:30',
  location: 'New York',
  timezone: 'America/New_York'
};

const result = await generateAstroOracle(birthData);
expect(result.astrology?.archetype).toBeDefined();
expect(result.astrology?.moonPhase).toBeDefined();
expect(result.confidence).toBeGreaterThan(0.8);
```

### Test 2: Agent Astro Context
```typescript
const fireAgent = new FireAgent();
const ctx = { moment: { text: 'When is the right time to start?' } };
const result = await fireAgent.process(ctx);
expect(result.insight).toMatch(/Mars|Uranus|timing/i);
```

### Test 3: Field Astro Influence
```typescript
const orchestrator = new ResonanceFieldOrchestrator();
orchestrator.updateAstrologyContext();
expect(orchestrator.field.astrology).toBeDefined();
expect(orchestrator.field.astrology?.moonPhase).toMatch(/Moon|Waxing|Full|Waning/);
```

---

## Service Integration Checklist

- [ ] Divination types imported everywhere needed
- [ ] Astrology service initialized in relevant agents
- [ ] BirthData stored in PersonalOracleAgent.memory
- [ ] Elemental agents enhanced with planet correspondences
- [ ] Kairos detection includes astro timing
- [ ] Field orchestrator tracks current astrology
- [ ] Agent coherence considers astrological resonance
- [ ] UI displays astrology symbols/timing
- [ ] Tests written for astrological calculations
- [ ] Daily astro guidance integrated into MainOracle

---

## Performance Considerations

**Astrological Calculations**: Cache for 24 hours (moon/transits don't change minute-to-minute)

```typescript
// Add to astroOracleService
private cache = new Map<string, { data: any, timestamp: Date }>();

getCachedAstro(key: string): any | null {
  const cached = this.cache.get(key);
  if (cached && Date.now() - cached.timestamp.getTime() < 86400000) {
    return cached.data;
  }
  return null;
}

setCachedAstro(key: string, data: any): void {
  this.cache.set(key, { data, timestamp: new Date() });
}
```

**Birth Chart Calculations**: Only calculate on demand or once per user

```typescript
// In PersonalOracleAgent
if (!this.memory.birthChart && birthData) {
  this.memory.birthChart = await calculateBirthChart(birthData);
  await this.saveBirthChart();
}
```

---

## References in Codebase

These are already implemented and can be used:
- `/apps/api/backend/src/services/astroOracleService.ts` - Main service
- `/apps/api/backend/src/types/astrology.ts` - Type definitions
- `/apps/api/backend/src/types/divination.ts` - Divination types
- `/lib/astrology/mayanAstrology.ts` - Maya calendar system
- `ASTROLOGICAL_ARCHETYPES` - 8 planetary archetypes
- `MOON_PHASES` - 4 phase descriptions
- `PLANETARY_ORACLES` - 8 planet oracle wisdom

---

## Quick Start: 3-Step Integration

### Step 1: Add to PersonalOracleAgent
```typescript
// In processInteraction():
if (isTiming/FutureQuery(input)) {
  const astroReading = await generateAstroOracle(this.memory.birthData);
  return { ...response, astrology: astroReading.astrology };
}
```

### Step 2: Enhance Elemental Agents
```typescript
// In FireAgent.process():
const planetaryContext = PLANETARY_ORACLES[this.detectRelevantPlanet(input)];
const enhancedInsight = `${baseResponse} ${planetaryContext.oracle}`;
```

### Step 3: Display in UI
```typescript
// In OracleConversation component:
{response.astrology && <AstrologyCard reading={response.astrology} />}
{response.symbols && <SymbolsDisplay symbols={response.symbols} />}
```

**Result**: Immediate astro context in user-facing responses

