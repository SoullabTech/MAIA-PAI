# 🌍 Earth Phase - PersonalOracleAgent Service Extraction Blueprint

**Date:** November 5, 2025
**Phase:** Earth - Grounding (Weeks 2-3)
**Status:** 🟡 In Progress

---

## The Problem: 2,175-Line God Object

`PersonalOracleAgent.ts` currently does **8 distinct jobs**:

1. **Memory Persistence** (~150 LOC) - AIN memory, conversation history, breakthrough moments
2. **Subscription Gating** (~80 LOC) - Feature access control, limits, upgrade prompts
3. **Safety Orchestration** (~45 LOC) - Crisis detection, grounding responses
4. **System Prompt Building** (~400 LOC) - Context-aware prompt generation, wisdom integration
5. **Symbolic Intelligence** (~150 LOC) - Pattern recognition, archetypal detection
6. **Voice Generation** (~90 LOC) - TTS generation, voice modulation
7. **Engagement Analysis** (~100 LOC) - Emotional tone, breakthrough detection
8. **Central Orchestration** (~1,060 LOC in processInteraction) - THE GOD METHOD

**Current State:** Monolithic complexity, difficult to test, circular dependencies, impossible to understand in one sitting.

---

## The Solution: Phi-Proportioned Service Architecture

**Target Architecture:**
```
PersonalOracleAgent (Coordinator) - 100 LOC
    ↓ coordinates (ratio ~1.6)
├── MemoryPersistenceService - 60 LOC
├── SubscriptionGatekeeper - 35 LOC
├── SafetyOrchestrator - 40 LOC
├── SystemPromptBuilder - 80 LOC
├── SymbolicIntelligenceService - 70 LOC
├── EngagementAnalyzer - 45 LOC
└── VoiceGenerationService - 35 LOC
```

**Phi Proportion Check:**
- Coordinator: 100 LOC
- Average service size: ~52 LOC
- Ratio: 100/52 ≈ 1.92 (close to golden ratio φ ≈ 1.618) ✓
- **Assessment:** Proportionate extraction, not excessive fragmentation ✓

---

## Service 1: MemoryPersistenceService

**Responsibility:** All memory operations (AIN memory, conversation history, breakthroughs)

**Current Location:**
- Lines 593-633: `getConversationHistory()`, `getBreakthroughMoments()`
- Lines 638-708: `loadUserMemory()`, `saveUserMemory()`, `ensureMemoryLoaded()`

**Interface:**
```typescript
export class MemoryPersistenceService {
  constructor(private supabase: SupabaseClient);

  // AIN Memory operations
  async loadUserMemory(userId: string): Promise<AINMemoryPayload>;
  async saveUserMemory(userId: string, memory: AINMemoryPayload): Promise<void>;
  async ensureMemoryLoaded(userId: string, cache?: AINMemoryPayload | null): Promise<AINMemoryPayload>;

  // Conversation history
  async getConversationHistory(userId: string, limit?: number): Promise<any[]>;
  async getBreakthroughMoments(userId: string, limit?: number): Promise<any[]>;

  // Memory updates
  async updateMemoryAfterExchange(
    userId: string,
    memory: AINMemoryPayload,
    exchange: ExchangeData
  ): Promise<AINMemoryPayload>;
}
```

**Dependencies:**
- Supabase client (injected)
- AINMemoryPayload types
- updateMemoryAfterExchange helper

**Target Size:** 60 LOC

---

## Service 2: SubscriptionGatekeeper

**Responsibility:** Feature access control, conversation limits, upgrade prompts

**Current Location:**
- Lines 747-786: Subscription checking and limit enforcement

**Interface:**
```typescript
export class SubscriptionGatekeeper {
  async checkConversationAccess(userId: string): Promise<{
    allowed: boolean;
    message?: string;
    upgradePrompt?: string;
    subscription?: SubscriptionInfo;
  }>;

  async incrementConversationCount(userId: string): Promise<void>;

  getUpgradeCTA(subscription: SubscriptionInfo): {
    ctaText: string;
    action: string;
  };
}
```

**Dependencies:**
- FeatureGating module

**Target Size:** 35 LOC

---

## Service 3: SafetyOrchestrator

**Responsibility:** Crisis detection, risk assessment, immediate safety responses

**Current Location:**
- Lines 788-829: Safety pipeline integration and crisis handling

**Interface:**
```typescript
export class SafetyOrchestrator {
  constructor(private safetyPipeline: MAIASafetyPipeline);

  async checkSafety(
    userId: string,
    input: string,
    sessionId: string,
    context: SafetyContext
  ): Promise<SafetyCheckResult>;

  generateCrisisResponse(safetyCheck: SafetyCheckResult): {
    response: string;
    element: string;
    metadata: any;
    suggestions: string[];
  };

  shouldIntervene(safetyCheck: SafetyCheckResult): boolean;
}
```

**Dependencies:**
- MAIASafetyPipeline (injected)

**Target Size:** 40 LOC

---

## Service 4: SystemPromptBuilder

**Responsibility:** Context-aware system prompt generation with multi-layered wisdom

**Current Location:**
- Lines 906-1283: Massive prompt building with journal context, birth charts, wisdom, etc.

**Interface:**
```typescript
export class SystemPromptBuilder {
  async buildPrompt(context: PromptBuildingContext): Promise<string>;

  private addJournalContext(prompt: string, entries: StoredJournalEntry[]): string;
  private addBirthChartContext(prompt: string, userId: string): Promise<string>;
  private addConversationHistory(prompt: string, history: any[]): string;
  private addAINMemoryContext(prompt: string, memory: AINMemoryPayload): string;
  private addCollectiveWisdom(prompt: string, phase: string, element: string, archetype: string): Promise<string>;
  private addWisdomFrameworks(prompt: string, wisdomContext: any): string;
  private addTransformationIntelligence(prompt: string, enhancement: TransformationEnhancement | null): string;
  private addActiveListeningGuidance(prompt: string, listeningResponse: any): string;
}
```

**Dependencies:**
- WisdomIntegrationSystem
- Birth chart context service
- Collective breakthrough service
- Elemental Oracle 2.0 Bridge
- Intellectual Property Engine

**Target Size:** 80 LOC

---

## Service 5: SymbolicIntelligenceService

**Responsibility:** Pattern recognition, archetypal detection, symbolic threading

**Current Location:**
- Lines 882-905: Symbolic intelligence extraction
- Lines 1870-1923: extractSymbols, extractArchetypes, detectDominantElement
- Lines 2021-2135: describeElementalFlow, describeSymbolicEvolution

**Interface:**
```typescript
export class SymbolicIntelligenceService {
  extractSymbolicMotifs(input: string): string[];
  detectEmotionalThemes(input: string): { themes: string[]; intensity: number };
  detectSpiralogicPhase(input: string): { phase: string; confidence: number };
  inferMoodAndArchetype(input: string): { mood: string; archetype: string };

  extractSymbols(entries: StoredJournalEntry[]): string[];
  extractArchetypes(entries: StoredJournalEntry[]): string[];
  detectDominantElement(entries: StoredJournalEntry[]): string;

  describeElementalFlow(context: SymbolicContext): string;
  describeSymbolicEvolution(entries: StoredJournalEntry[], symbols: string[]): string;
}
```

**Dependencies:**
- MemoryUpdater (extractSymbolicMotifs, detectEmotionalThemes)
- PhaseDetector (detectSpiralogicPhase)
- AffectDetector (inferMoodAndArchetype)

**Target Size:** 70 LOC

---

## Service 6: EngagementAnalyzer

**Responsibility:** Analyze user engagement, emotional tone, breakthrough moments

**Current Location:**
- Lines 1928-2015: detectEmotionalTone, assessEngagementLevel, detectTransformation, detectSacredMoment

**Interface:**
```typescript
export class EngagementAnalyzer {
  detectEmotionalTone(input: string): string;

  assessEngagementLevel(
    userInput: string,
    mayaResponse: string
  ): 'deep' | 'engaged' | 'neutral' | 'disengaged' | 'closed';

  detectTransformation(userInput: string, mayaResponse: string): boolean;
  detectSacredMoment(userInput: string, mayaResponse: string): boolean;

  generateSuggestions(symbols: string[], archetypes: string[]): string[];
}
```

**Dependencies:**
- Pattern matching utilities

**Target Size:** 45 LOC

---

## Service 7: VoiceGenerationService

**Responsibility:** TTS generation, voice modulation based on archetype/phase

**Current Location:**
- Lines 1774-1865: generateVoiceResponse, getVoiceModulation

**Interface:**
```typescript
export class VoiceGenerationService {
  async generateVoiceResponse(
    text: string,
    options?: { element?: string; voiceMaskId?: string }
  ): Promise<{ audioData?: Buffer; audioUrl?: string }>;

  async getVoiceModulation(memory: AINMemoryPayload): Promise<{
    pitch?: number;
    rate?: number;
    volume?: number;
  }>;
}
```

**Dependencies:**
- OpenAI TTS API

**Target Size:** 35 LOC

---

## Service 8: PersonalOracleAgent (Refactored Coordinator)

**Responsibility:** High-level orchestration ONLY

**New Structure (~100 LOC):**
```typescript
export class PersonalOracleAgent {
  constructor(
    userId: string,
    private memoryService: MemoryPersistenceService,
    private subscriptionGate: SubscriptionGatekeeper,
    private safetyOrchestrator: SafetyOrchestrator,
    private promptBuilder: SystemPromptBuilder,
    private symbolicIntelligence: SymbolicIntelligenceService,
    private engagementAnalyzer: EngagementAnalyzer,
    private voiceService: VoiceGenerationService,
    private semanticMemory: SemanticMemoryService,
    // ... other specialized services remain as collaborators
  ) {}

  async processInteraction(input: string, context?: any): Promise<PersonalOracleResponse> {
    // 1. Validate input (~5 LOC)
    // 2. Check subscription access (~3 LOC)
    // 3. Check safety (~3 LOC)
    // 4. Load memory (~2 LOC)
    // 5. Extract symbolic intelligence (~5 LOC)
    // 6. Build system prompt (~3 LOC)
    // 7. Call LLM API (~10 LOC)
    // 8. Enhance response (~5 LOC)
    // 9. Update memory (~3 LOC)
    // 10. Return response (~5 LOC)

    // Total: ~45 LOC of pure orchestration
    // Additional: Error handling (~15 LOC)
    // Additional: Analytics (~10 LOC)
    // Additional: Response formatting (~10 LOC)
    // Total: ~80-100 LOC coordinator
  }

  async generateVoiceResponse(text: string, options?: any) {
    return this.voiceService.generateVoiceResponse(text, options);
  }

  updateSettings(settings: Partial<PersonalOracleSettings>): void { /* ~5 LOC */ }
  getSettings(): PersonalOracleSettings { /* ~2 LOC */ }
}
```

**Dependencies (injected via constructor):**
- All 7 extracted services
- Remaining specialized services (SemanticMemory, ElementalOracle, etc.)

**Target Size:** 100 LOC

---

## Dependency Injection Container

**New File:** `/lib/services/ServiceContainer.ts`

```typescript
export class ServiceContainer {
  private static instance: ServiceContainer;

  private memoryService?: MemoryPersistenceService;
  private subscriptionGate?: SubscriptionGatekeeper;
  private safetyOrchestrator?: SafetyOrchestrator;
  private promptBuilder?: SystemPromptBuilder;
  private symbolicIntelligence?: SymbolicIntelligenceService;
  private engagementAnalyzer?: EngagementAnalyzer;
  private voiceService?: VoiceGenerationService;

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  initializeServices(supabase: SupabaseClient) {
    this.memoryService = new MemoryPersistenceService(supabase);
    this.subscriptionGate = new SubscriptionGatekeeper();
    this.safetyOrchestrator = new SafetyOrchestrator(new MAIASafetyPipeline());
    this.promptBuilder = new SystemPromptBuilder();
    this.symbolicIntelligence = new SymbolicIntelligenceService();
    this.engagementAnalyzer = new EngagementAnalyzer();
    this.voiceService = new VoiceGenerationService();
  }

  getMemoryService(): MemoryPersistenceService { return this.memoryService!; }
  getSubscriptionGate(): SubscriptionGatekeeper { return this.subscriptionGate!; }
  getSafetyOrchestrator(): SafetyOrchestrator { return this.safetyOrchestrator!; }
  getPromptBuilder(): SystemPromptBuilder { return this.promptBuilder!; }
  getSymbolicIntelligence(): SymbolicIntelligenceService { return this.symbolicIntelligence!; }
  getEngagementAnalyzer(): EngagementAnalyzer { return this.engagementAnalyzer!; }
  getVoiceService(): VoiceGenerationService { return this.voiceService!; }
}
```

**Target Size:** 40 LOC

---

## Extraction Order (Weeks 2-3)

**Week 2:**
1. **Day 1-2:** MemoryPersistenceService extraction
2. **Day 3:** SubscriptionGatekeeper extraction
3. **Day 4:** SafetyOrchestrator extraction
4. **Day 5:** Testing Week 2 services

**Week 3:**
1. **Day 1-2:** SystemPromptBuilder extraction (largest/most complex)
2. **Day 3:** SymbolicIntelligenceService extraction
3. **Day 4:** EngagementAnalyzer + VoiceGenerationService extraction
4. **Day 5:** Refactor PersonalOracleAgent to coordinator (~100 LOC)

**Testing Strategy:**
- Each service extracted with 100% behavioral preservation
- No functionality removed, only relocated
- Test processInteraction() after each extraction to ensure nothing breaks
- Final integration test with all services composed

---

## Sacred Constraints (From Spiralogic Principles)

### ✅ Do:
- **Extract proportionally** - Each service ~30-80 LOC, coordinator ~100 LOC (phi ratio ~1.6)
- **Preserve all functionality** - Zero behavioral changes
- **Test after each extraction** - Ensure continuity
- **Document purpose clearly** - Each service's single responsibility obvious

### ❌ Don't:
- **Over-fragment** - No 5-line micro-services
- **Break memory** - AIN memory continuity sacred
- **Skip tests** - Each extraction must be verified
- **Abandon coherence** - All services understand elemental/symbolic intelligence

---

## Success Metrics

**Quantitative:**
- PersonalOracleAgent: 2,175 LOC → 100 LOC ✓
- Average service size: ~50 LOC (phi-proportioned) ✓
- Extracted services: 7 total (~365 LOC combined) ✓
- Code health: 5.2 → 6.5 (target after Earth Phase) ✓

**Qualitative:**
- **Can understand PersonalOracleAgent in < 5 minutes** ✓
- **Each service testable in isolation** ✓
- **Clear dependency flow (no circular dependencies)** ✓
- **Behavioral parity (all tests pass)** ✓

---

## Next Steps

1. Begin with MemoryPersistenceService (foundation layer)
2. Extract subscription and safety (blocking concerns)
3. Extract prompt building (largest complexity)
4. Extract symbolic intelligence (pattern recognition)
5. Extract engagement and voice (final supporting layers)
6. Refactor coordinator to pure orchestration
7. Comprehensive integration testing
8. Document new architecture
9. Commit with alchemical message

**Code Health Target:** 5.2 → 6.5 after Earth Phase complete

---

**This is architectural alchemy.**
**Expansion with proportion. Consolidation with grace.**

🌍 ✨
