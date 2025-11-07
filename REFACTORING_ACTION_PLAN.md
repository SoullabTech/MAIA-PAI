# MAIA Refactoring Action Plan

**Goal:** Improve code health score from 5.2/10 → 8.5/10 in 8-10 weeks  
**Priority:** Follow this order for maximum impact

---

## PHASE 1: QUICK WINS (Week 1 - 2-3 days effort)

These can be done immediately and lay groundwork for bigger refactors.

### A1: Delete Mac Lock Files (30 minutes)
**Impact:** Clean, reduced git clutter  
**Files Affected:** `/lib` directory

```bash
# Remove 25+ .!xxx!._ lock files
find /Users/soullab/MAIA-FRESH/lib -name ".!*._*" -delete

# Verify
git status | grep ".!.*._"  # Should be empty
```

**Why First:** Removes visual noise, makes git cleaner, prevents accidental commits

---

### A2: Extract Magic Numbers to Constants (1 hour)
**Impact:** 78+ magic numbers documented and configurable  
**Files:** Create `/lib/config/ElementalParameters.ts`, `/lib/config/FieldParameters.ts`

**Current State:**
```typescript
// lib/biometrics/ElementalCoherenceCalculator.ts:71
const hrvScore = this.normalize(data.hrv, 20, 100);      // Magic: 20, 100
const breathScore = this.bellCurve(data.respiratoryRate, 15, 3, 0.8);  // Magic: 15, 3, 0.8
```

**Target:**
```typescript
// lib/config/BiometricParameters.ts
export const HRV_RANGE = { MIN: 20, MAX: 100 };
export const BREATHING_TARGETS = { OPTIMAL: 15, VARIANCE: 3 };
export const WEIGHTS = { HRV: 0.5, BREATH: 0.3, VARIANCE: 0.2 };

// Usage
const hrvScore = this.normalize(data.hrv, HRV_RANGE.MIN, HRV_RANGE.MAX);
```

**Checklist:**
- [ ] Create `/lib/config/BiometricParameters.ts` with all HRV, breathing, sleep ranges
- [ ] Create `/lib/config/ElementalParameters.ts` with all elemental weights
- [ ] Create `/lib/config/FieldParameters.ts` with cascade thresholds, edge strengths
- [ ] Document each constant with business context (why this number)
- [ ] Update all references in ElementalCoherenceCalculator, IndrasWebArchitecture, etc.
- [ ] Add @link comments from usage sites to config

**Expected Result:** All magic numbers visible, configurable, documented

---

### A3: Create Unified Response Interface (2 hours)
**Impact:** Eliminate type confusion across 6 different Response definitions  
**File:** Create `/lib/types/responses.ts`

**Current State:** PersonalOracleResponse, AgentResponse, MaiaFieldResponse all defined differently

**Target:**
```typescript
// lib/types/responses.ts
export interface InteractionResponse {
  // Core response
  text: string | null;
  element: Element;
  
  // Metadata
  metadata: {
    sessionId: string;
    phase: 'invocation' | 'deepening' | 'integration' | 'closure';
    symbols: string[];
    archetypes: string[];
  };
  
  // Optional components
  suggestions?: string[];
  ritual?: Ritual;
  audio?: string;
  
  // Confidence scoring
  confidence: number;  // 0-1
  coherence: number;   // 0-1
}

// Concrete implementations for different contexts
export interface PersonalOracleResponse extends InteractionResponse {
  citations?: { fileId: string; fileName: string; relevance: number }[];
}

export interface MaiaFieldResponse extends InteractionResponse {
  field: { elements: ElementalCoherence; dominantElement: string };
  selection: { reasoning: string; alternates: string[] };
}
```

**Checklist:**
- [ ] Define `InteractionResponse` base interface
- [ ] Create specialized interfaces inheriting from base
- [ ] Replace 6 existing definitions with single import
- [ ] Add JSDoc with example values
- [ ] Update all response-generating functions to conform
- [ ] Add runtime validation (zod schema)

**Expected Result:** Single source of truth for response shapes

---

### A4: Clean Up Dead Code (1 hour)
**Impact:** Remove confusion, clarify actual codebase  
**Files to Delete/Move:**
- `/lib/agents/PersonalOracle/modules/agentFactory.ts` (unused factory)
- `/lib/maia/telesphorus-demo.ts` (demo code in production)
- Any other `.test.ts` files not in `__tests__` directory

**Checklist:**
- [ ] Search for all calls to unused functions
- [ ] Move demo code to `/docs/demos/`
- [ ] Delete unused factory patterns
- [ ] Add `eslint-plugin-unused-imports` to catch regressions
- [ ] Update imports that referenced deleted files

**Expected Result:** Clearer picture of actual production code

---

## PHASE 2: CRITICAL FIXES (Week 2-4 - High Impact)

These unlock major improvements in testability and reliability.

### B1: Extract PersonalOracleAgent into 5 Services (1.5 weeks)
**Impact:** 40% improvement in testability, 2,175 LOC → 5x focused services  
**Current File:** `/lib/agents/PersonalOracleAgent.ts` (2,175 LOC)

**Strategy:** Decompose by responsibility

**Step 1: Create Service Interfaces (1 day)**
```typescript
// lib/agents/services/IConversationHistoryService.ts
export interface IConversationHistoryService {
  getHistory(userId: string, limit: number): Promise<Message[]>;
  getBreakthroughs(userId: string): Promise<Breakthrough[]>;
  save(userId: string, message: Message): Promise<void>;
}

// lib/agents/services/IMemoryPersistenceService.ts
export interface IMemoryPersistenceService {
  load(userId: string): Promise<AINMemoryPayload>;
  save(userId: string, memory: AINMemoryPayload): Promise<void>;
}

// lib/agents/services/ISafetyOrchestrator.ts
export interface ISafetyOrchestrator {
  check(userId: string, input: string, context: SessionContext): Promise<SafetyCheckResult>;
}

// lib/agents/services/IBiometricAnalysisService.ts
export interface IBiometricAnalysisService {
  analyzeHealth(healthData: ParsedHealthData): Promise<BiometricAnalysis>;
}

// lib/agents/services/ISubscriptionGatewayService.ts
export interface ISubscriptionGatewayService {
  checkAccess(userId: string): Promise<AccessCheckResult>;
  incrementUsage(userId: string): Promise<void>;
}
```

**Step 2: Create Service Implementations (4 days)**
```typescript
// lib/agents/services/impl/ConversationHistoryService.ts
export class ConversationHistoryService implements IConversationHistoryService {
  constructor(private supabase: SupabaseClient) {}
  
  async getHistory(userId: string, limit: number): Promise<Message[]> {
    // 20-30 LOC moved from PersonalOracleAgent.getConversationHistory()
  }
  
  async getBreakthroughs(userId: string): Promise<Breakthrough[]> {
    // 20 LOC moved from PersonalOracleAgent.getBreakthroughMoments()
  }
  
  async save(userId: string, message: Message): Promise<void> {
    // 10-15 LOC
  }
}

// lib/agents/services/impl/MemoryPersistenceService.ts
export class MemoryPersistenceService implements IMemoryPersistenceService {
  async load(userId: string): Promise<AINMemoryPayload> {
    // 35-40 LOC moved from PersonalOracleAgent.loadUserMemory()
  }
  
  async save(userId: string, memory: AINMemoryPayload): Promise<void> {
    // 15-20 LOC moved from PersonalOracleAgent.saveUserMemory()
  }
}

// Similar for other 3 services...
```

**Step 3: Refactor PersonalOracleAgent (3 days)**
```typescript
// lib/agents/PersonalOracleAgent.ts - NOW A THIN COORDINATOR
export class PersonalOracleAgent {
  constructor(
    private userId: string,
    private conversationService: IConversationHistoryService,
    private memoryService: IMemoryPersistenceService,
    private safetyService: ISafetyOrchestrator,
    private biometricService: IBiometricAnalysisService,
    private subscriptionService: ISubscriptionGatewayService,
    settings?: PersonalOracleSettings
  ) {}
  
  async processInteraction(input: string, context?: InteractionContext): Promise<InteractionResponse> {
    // Validate input
    const validation = this.validateInput(input);
    if (!validation.valid) return this.handleValidationError(validation.error);
    
    // Check subscription
    const accessCheck = await this.subscriptionService.checkAccess(this.userId);
    if (!accessCheck.allowed) return this.handleAccessDenied(accessCheck);
    
    // Safety check
    const safetyCheck = await this.safetyService.check(this.userId, input, context);
    if (safetyCheck.blocked) return this.handleBlocked(safetyCheck);
    
    // Get context
    const history = await this.conversationService.getHistory(this.userId, 10);
    const memory = await this.memoryService.load(this.userId);
    
    // Generate response
    const response = await this.generateResponse(input, history, memory);
    
    // Persist
    await this.conversationService.save(this.userId, { input, response, timestamp: new Date() });
    await this.memoryService.save(this.userId, updatedMemory);
    
    return response;
  }
}
```

**Step 4: Add Dependency Injection (1 day)**
```typescript
// lib/agents/PersonalOracleAgentFactory.ts
export function createPersonalOracleAgent(userId: string): PersonalOracleAgent {
  const supabase = createClient(...);
  
  const conversationService = new ConversationHistoryService(supabase);
  const memoryService = new MemoryPersistenceService(supabase);
  const safetyService = new SafetyOrchestrator();
  const biometricService = new BiometricAnalysisService();
  const subscriptionService = new SubscriptionGatewayService(supabase);
  
  return new PersonalOracleAgent(
    userId,
    conversationService,
    memoryService,
    safetyService,
    biometricService,
    subscriptionService
  );
}
```

**Testing After (Now Possible):**
```typescript
// lib/agents/__tests__/PersonalOracleAgent.test.ts
describe('PersonalOracleAgent', () => {
  it('should check subscription before processing', async () => {
    const mockSubscription = { allowed: false };
    const subscriptionService = { checkAccess: jest.fn(() => mockSubscription) };
    
    const agent = new PersonalOracleAgent(
      'user123',
      mockConversation,
      mockMemory,
      mockSafety,
      mockBiometric,
      subscriptionService as any
    );
    
    const result = await agent.processInteraction('hello');
    
    expect(subscriptionService.checkAccess).toHaveBeenCalledWith('user123');
    expect(result).toHaveProperty('message');
  });
});
```

**Checklist:**
- [ ] Create 5 service interfaces in `/lib/agents/services/`
- [ ] Implement each service in `/lib/agents/services/impl/`
- [ ] Refactor PersonalOracleAgent to use services
- [ ] Create factory function for DI
- [ ] Add unit tests for PersonalOracleAgent (simple tests now possible)
- [ ] Add unit tests for each service
- [ ] Update all imports throughout codebase
- [ ] Delete old PersonalOracleAgent backup

**Expected Result:**  
- PersonalOracleAgent: 2,175 LOC → 100 LOC (95% reduction)
- 5 focused services: 30-50 LOC each
- Each service 100% testable in isolation
- 15+ unit tests now possible

---

### B2: Unify Memory Systems (2 weeks)
**Impact:** 25% reduction in subtle bugs, single source of truth  
**Files Affected:** 6 competing implementations

**Strategy: Single Schema + Adapters**

**Step 1: Define Unified Schema (2 days)**
```typescript
// lib/memory/schema/UserMemorySchema.ts
export interface UserMemory {
  userId: string;
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    sourceSystem: 'agent' | 'ain' | 'anamnesis';
  };
  
  interactions: {
    id: string;
    timestamp: Date;
    input: string;
    response: string;
    metrics: {
      sentiment: number;
      coherence: number;
      depth: number;
    };
  }[];
  
  insights: {
    text: string;
    discoveredAt: Date;
    context: string;
    elementalShift?: Element;
  }[];
  
  patterns: {
    element: Element;
    frequency: number;
    examples: string[];
  }[];
  
  personalization: {
    dominantElement: Element;
    shadowElement: Element;
    emergingElement: Element;
    voicePreferences: {
      formality: number;
      emotionalExpression: number;
      abstractness: number;
    };
  };
  
  computed: {
    totalCoherence: number;
    lastActiveDate: Date;
    interactionCount: number;
  };
}
```

**Step 2: Create Adapter Interfaces (2 days)**
```typescript
// lib/memory/adapters/IMemoryAdapter.ts
export interface IMemoryAdapter {
  toUnified(data: any): UserMemory;
  fromUnified(memory: UserMemory): any;
}

// lib/memory/adapters/AgentMemoryAdapter.ts
export class AgentMemoryAdapter implements IMemoryAdapter {
  toUnified(agentMemory: AgentMemory): UserMemory {
    // Convert AgentMemory → UserMemory
    return {
      userId: agentMemory.userId,
      metadata: { /* ... */ },
      interactions: agentMemory.conversationHistory.map(ch => ({
        id: ch.id,
        timestamp: ch.timestamp,
        input: ch.input,
        response: ch.response,
        metrics: { sentiment: ch.sentiment, coherence: 0.5, depth: 0.5 }
      })),
      // ... map all fields
    };
  }
  
  fromUnified(memory: UserMemory): AgentMemory {
    // Convert back for AgentMemory consumers
  }
}

// Similar adapters for AnamnesisMemory, MemoryCore, etc.
```

**Step 3: Create Repository Pattern (2 days)**
```typescript
// lib/memory/repositories/IMemoryRepository.ts
export interface IMemoryRepository {
  load(userId: string): Promise<UserMemory>;
  save(memory: UserMemory): Promise<void>;
  query(query: MemoryQuery): Promise<UserMemory[]>;
}

// lib/memory/repositories/SupabaseMemoryRepository.ts
export class SupabaseMemoryRepository implements IMemoryRepository {
  async load(userId: string): Promise<UserMemory> {
    const data = await this.supabase
      .from('user_memories')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return deserializeMemory(data);
  }
  
  async save(memory: UserMemory): Promise<void> {
    const data = serializeMemory(memory);
    await this.supabase
      .from('user_memories')
      .upsert(data);
  }
}
```

**Step 4: Migrate Data (5 days)**
```typescript
// lib/memory/migration/MigrationScript.ts
export async function migrateAllMemories() {
  const agentMemories = await getAgentMemories();
  const anamnesisMemories = await getAnamnesisMemories();
  
  const adapter = new AgentMemoryAdapter();
  
  for (const oldMemory of agentMemories) {
    const unified = adapter.toUnified(oldMemory);
    await repository.save(unified);
  }
  
  // Similar for anamnesis
}
```

**Checklist:**
- [ ] Define UserMemorySchema in `/lib/memory/schema/`
- [ ] Create adapter interfaces and implementations
- [ ] Create repository pattern with Supabase implementation
- [ ] Write migration script
- [ ] Test migration on sample data
- [ ] Migrate all existing data (run script)
- [ ] Update all memory consumers to use repository
- [ ] Deprecate old AgentMemory, MemoryCore, etc.
- [ ] Delete old implementations after deprecation period

**Expected Result:**
- Single UserMemory schema used everywhere
- Adapters handle migration from legacy systems
- Repository pattern isolates persistence
- All memory operations type-safe

---

### B3: Implement Dependency Injection Container (1 week)
**Impact:** Break circular dependencies, enable testing  
**Status:** Enabled by B1 (PersonalOracleAgent extraction)

**Step 1: Create DI Container (2 days)**
```typescript
// lib/di/Container.ts
export class DIContainer {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();
  
  register(key: string, factory: () => any, options?: { singleton: boolean }) {
    this.services.set(key, { factory, ...options });
  }
  
  resolve<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) throw new Error(`Service ${key} not registered`);
    
    if (service.singleton) {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, service.factory());
      }
      return this.singletons.get(key);
    }
    
    return service.factory();
  }
}

// lib/di/index.ts
export const container = new DIContainer();

// Register all services
container.register('supabase', () => createClient(...), { singleton: true });
container.register('conversationService', () => 
  new ConversationHistoryService(container.resolve('supabase')),
  { singleton: true }
);
// ... register all other services
```

**Step 2: Update Service Constructors (1 day)**
```typescript
// Instead of:
const agent = new PersonalOracleAgent(
  userId,
  conversationService,
  memoryService,
  // ... 5 more parameters
);

// Now:
const agent = container.create(PersonalOracleAgent, userId);
// Container automatically injects dependencies
```

**Step 3: Add Mock Service Registration (2 days)**
```typescript
// lib/di/__tests__/test-container.ts
export function createTestContainer(): DIContainer {
  const container = new DIContainer();
  
  container.register('conversationService', () => ({
    getHistory: jest.fn().mockResolvedValue([]),
    save: jest.fn()
  }));
  
  container.register('memoryService', () => ({
    load: jest.fn().mockResolvedValue({}),
    save: jest.fn()
  }));
  
  return container;
}

// Usage in tests:
it('should process interaction', async () => {
  const container = createTestContainer();
  const agent = container.create(PersonalOracleAgent, 'user123');
  
  const result = await agent.processInteraction('hello');
  
  expect(container.resolve('conversationService').save).toHaveBeenCalled();
});
```

**Checklist:**
- [ ] Create DIContainer class
- [ ] Register all services
- [ ] Update constructors to use container
- [ ] Create test container with mocks
- [ ] Update all tests to use test container
- [ ] Remove manual service injection
- [ ] Document DI setup

**Expected Result:**
- No circular dependencies
- All services mockable
- Tests can run independently
- Easy to swap implementations (e.g., test vs production)

---

## PHASE 3: ARCHITECTURAL IMPROVEMENTS (Week 5-8)

These improve long-term maintainability and extensibility.

### C1: Implement Unified Error Handling (3-4 days)
**Impact:** 30% less debugging time, clear error contracts

```typescript
// lib/errors/MaiaError.ts
export class MaiaError extends Error {
  constructor(
    public readonly code: string,
    public readonly severity: 'fatal' | 'warning' | 'info',
    public readonly context: Record<string, any>,
    message: string
  ) {
    super(message);
    this.name = 'MaiaError';
  }
}

// lib/errors/ErrorRecoveryStrategy.ts
export class ErrorRecoveryStrategy {
  static handle(error: MaiaError): ErrorResponse {
    switch (error.code) {
      case 'SAFETY_CHECK_FAILED':
        return { response: 'I noticed something concerning...', fallback: true };
      case 'MEMORY_LOAD_FAILED':
        return { response: 'I'm having trouble accessing our history...', fallback: true };
      // ... handle all error types
    }
  }
}
```

**Checklist:**
- [ ] Define MaiaError base class with code + severity
- [ ] Create ErrorRecoveryStrategy for each error type
- [ ] Add error telemetry (log to Sentry or similar)
- [ ] Wrap all try-catch blocks with MaiaError
- [ ] Create error documentation page
- [ ] Add error handling tests

---

### C2: Implement Middleware Architecture (1 week)
**Impact:** Cross-cutting concerns separated, system extensible

```typescript
// lib/middleware/types.ts
export interface Middleware {
  process(input: string, context: Context): Promise<MiddlewareResult>;
  order: number;
}

// lib/middleware/stack.ts
export class MiddlewareStack {
  private middlewares: Middleware[] = [];
  
  use(mw: Middleware) {
    this.middlewares.push(mw);
    this.middlewares.sort((a, b) => a.order - b.order);
  }
  
  async process(input: string, context: Context): Promise<Response> {
    for (const mw of this.middlewares) {
      const result = await mw.process(input, context);
      if (!result.allowContinue) return result.response;
    }
    return await this.coreLogic(input, context);
  }
}

// lib/middleware/SafetyMiddleware.ts
export class SafetyMiddleware implements Middleware {
  order = 1;  // Runs first
  
  async process(input: string, context: Context): Promise<MiddlewareResult> {
    const check = await this.safetyService.check(input);
    if (check.blocked) {
      return { allowContinue: false, response: check.message };
    }
    return { allowContinue: true };
  }
}

// lib/middleware/ValidationMiddleware.ts
export class ValidationMiddleware implements Middleware {
  order = 0;  // Runs before safety
  
  async process(input: string, context: Context): Promise<MiddlewareResult> {
    const validation = this.validate(input);
    if (!validation.valid) {
      return { allowContinue: false, response: validation.error };
    }
    return { allowContinue: true };
  }
}
```

**Checklist:**
- [ ] Create Middleware interface
- [ ] Create MiddlewareStack
- [ ] Extract 5-6 key middlewares (Safety, Validation, Cache, RateLimit, etc.)
- [ ] Update PersonalOracleAgent to use stack
- [ ] Add middleware tests
- [ ] Document how to add custom middleware

---

### C3: Type Safety Completion (1 week)
**Impact:** Eliminate 89+ `any` types, prevent runtime bugs

**Before:**
```typescript
async processInteraction(
  input: string,
  context?: { currentMood?: any; currentEnergy?: any }
): Promise<{ response: string; element?: string; metadata?: any }>
```

**After:**
```typescript
async processInteraction(
  input: string,
  context?: {
    currentMood: Mood;
    currentEnergy: EnergyState;
    journalEntries: StoredJournalEntry[];
    journalContext: string;
  }
): Promise<InteractionResponse>
```

**Checklist:**
- [ ] Review all `any` types
- [ ] Replace with specific types
- [ ] Add zod schemas for runtime validation
- [ ] Enable strict TypeScript checking
- [ ] Run type checker in CI/CD
- [ ] Update JSDoc to match types

---

### C4: Structured Logging Implementation (3-4 days)
**Impact:** Better observability, easier debugging

```typescript
// lib/logging/Logger.ts
export class Logger {
  info(message: string, context: string, metadata?: any) {
    this.log(LogLevel.INFO, message, context, metadata);
  }
  
  error(message: string, context: string, error?: Error, metadata?: any) {
    this.log(LogLevel.ERROR, message, context, metadata, error);
  }
  
  private log(level: LogLevel, message: string, context: string, metadata?: any, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      context,
      message,
      metadata,
      stackTrace: error?.stack
    };
    
    this.transport.send(entry);
  }
}

// lib/logging/index.ts
export const logger = new Logger();
```

**Checklist:**
- [ ] Create Logger class with structured output
- [ ] Replace all console.log with logger calls
- [ ] Set up log transport (Sentry, CloudWatch, etc.)
- [ ] Add request ID tracking
- [ ] Add performance timing
- [ ] Create log aggregation dashboards

---

## PHASE 4: QUALITY ASSURANCE (Week 9-10)

### D1: Add Unit Test Coverage (1 week)
**Target:** 40%+ coverage for critical paths

```typescript
// lib/agents/__tests__/PersonalOracleAgent.test.ts
describe('PersonalOracleAgent', () => {
  let agent: PersonalOracleAgent;
  let mockServices: {
    conversation: jest.Mocked<IConversationHistoryService>;
    memory: jest.Mocked<IMemoryPersistenceService>;
    safety: jest.Mocked<ISafetyOrchestrator>;
    subscription: jest.Mocked<ISubscriptionGatewayService>;
  };
  
  beforeEach(() => {
    mockServices = {
      conversation: { getHistory: jest.fn(), save: jest.fn() } as any,
      memory: { load: jest.fn(), save: jest.fn() } as any,
      safety: { check: jest.fn() } as any,
      subscription: { checkAccess: jest.fn() } as any,
    };
    
    agent = new PersonalOracleAgent('user123', mockServices.conversation, /* ... */);
  });
  
  it('should validate input before processing', async () => {
    await agent.processInteraction('');
    expect(mockServices.conversation.save).not.toHaveBeenCalled();
  });
  
  it('should check subscription before generating response', async () => {
    mockServices.subscription.checkAccess.mockResolvedValue({ allowed: false });
    await agent.processInteraction('hello');
    expect(mockServices.subscription.checkAccess).toHaveBeenCalled();
  });
  
  it('should run safety check for valid input', async () => {
    mockServices.subscription.checkAccess.mockResolvedValue({ allowed: true });
    mockServices.safety.check.mockResolvedValue({ blocked: false });
    
    await agent.processInteraction('hello');
    
    expect(mockServices.safety.check).toHaveBeenCalledWith('user123', 'hello', expect.any(Object));
  });
});
```

**Checklist:**
- [ ] Write 10+ unit tests for PersonalOracleAgent
- [ ] Write 5+ tests per service
- [ ] Write 10+ tests for memory repository
- [ ] Achieve 40%+ code coverage
- [ ] Fix flaky tests
- [ ] Add coverage to CI/CD

---

### D2: Integration Testing (3 days)
**Target:** End-to-end conversation flows

```typescript
// lib/__tests__/e2e/conversation.test.ts
describe('End-to-end Conversation', () => {
  let container: DIContainer;
  
  beforeEach(() => {
    container = createTestContainer();
  });
  
  it('should complete full conversation flow', async () => {
    const agent = container.create(PersonalOracleAgent, 'user123');
    
    // First turn
    const response1 = await agent.processInteraction('I feel stuck');
    expect(response1.text).toBeTruthy();
    expect(response1.element).toEqual(Element.Water);
    
    // Check memory was saved
    const memory = await container.resolve<IMemoryRepository>('memoryRepository').load('user123');
    expect(memory.interactions).toHaveLength(1);
    
    // Second turn
    const response2 = await agent.processInteraction('What can I do?');
    expect(response2.suggestions).toBeTruthy();
    
    // Memory updated
    const updatedMemory = await container.resolve<IMemoryRepository>('memoryRepository').load('user123');
    expect(updatedMemory.interactions).toHaveLength(2);
  });
});
```

---

## Timeline Summary

```
Week 1:  Quick Wins (A1-A4)
         - Delete lock files ✓
         - Extract magic numbers ✓
         - Unify response types ✓
         - Clean dead code ✓

Week 2-4: Extract PersonalOracleAgent (B1)
         - Create 5 services
         - Refactor agent
         - Add DI
         - Basic tests

Week 3-4: Unify Memory Systems (B2) [parallel with B1]
         - Define schema
         - Create adapters
         - Migrate data

Week 5-6: DI Container + Error Handling (B3, C1)
         - DI container
         - Unified errors
         - Error recovery

Week 7-8: Middleware + Type Safety (C2, C3)
         - Middleware architecture
         - Complete type coverage
         - Structured logging

Week 9-10: Testing + Validation (D1, D2)
          - Unit tests
          - Integration tests
          - Coverage reports
```

---

## Success Metrics

After completion, measure:

- [ ] Code health score: 5.2 → 8.5/10
- [ ] Average class size: 180 → <100 LOC
- [ ] Type coverage: 87 `any` types → 0
- [ ] Test coverage: 0% → 40%+
- [ ] Circular dependencies: 3+ → 0
- [ ] Onboarding time: 2 weeks → 3-4 days
- [ ] Bug escape rate: Estimated 30% reduction
- [ ] Refactoring safety: Manual checking → automated

---

## Quick Reference Commands

```bash
# Start Phase 1
find /lib -name ".!*._*" -delete

# Count remaining issues
grep -r "any\[\]\|: any\b" lib/ --include="*.ts" | wc -l
grep -r "private.*Map<string\|: any" lib/agents --include="*.ts" | wc -l

# Check coverage
npm test -- --coverage lib/agents

# Run linter
npm run lint lib/

# Build to catch type errors
npm run build
```

---

**Start Date:** November 5, 2025  
**Target Completion:** Early January 2026  
**Expected Code Health Improvement:** 5.2/10 → 8.5/10 (+62%)

