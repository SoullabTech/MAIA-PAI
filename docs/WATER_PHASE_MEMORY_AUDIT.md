# 🌊 Water Phase - Memory Systems Audit

**Date:** November 6, 2025
**Status:** 🔍 Discovery Phase
**Agent:** Claude Code (CC), Inner Architect

---

## Executive Summary

**The Challenge:** MAIA has **30+ memory-related files** with significant overlap and redundancy.

**The Opportunity:** Unify memory into one coherent flow, following Earth Phase's service extraction pattern.

**Current State:**
- ✅ **MemoryPersistenceService** - Used by simplified coordinator (one of 7 services)
- ✅ **SemanticMemoryService** - Specialized module in coordinator
- ⚠️ **20+ other memory files** - Unclear usage, potential redundancy

---

## Memory Systems Inventory

### **Primary Active Systems** (Used by PersonalOracleAgent.Simplified):

#### 1. **MemoryPersistenceService** (Service #3 of 7)
**Location:** `lib/services/oracle/MemoryPersistenceService.ts` (247 LOC)

**Responsibilities:**
- Load/save AIN Memory (Archetypal Intelligence Network)
- Retrieve conversation history from `maia_messages` table
- Find breakthrough moments
- Update memory after each exchange

**Data Sources:**
- `ain_memory` table (JSONB storage)
- `maia_messages` table (conversation log)

**Key Methods:**
```typescript
loadUserMemory(userId): AINMemoryPayload
saveUserMemory(userId, memory): void
getConversationHistory(userId, limit): Message[]
getBreakthroughMoments(userId, limit): Message[]
updateMemoryAfterExchange(memory, exchange): AINMemoryPayload
```

---

#### 2. **SemanticMemoryService** (Specialized Module)
**Location:** `lib/memory/SemanticMemoryService.ts` (794 LOC)

**Responsibilities:**
- Record pattern observations from interactions
- Learn from user engagement patterns
- Build collective wisdom
- Track elemental affinities
- Discover transition patterns
- Identify breakthrough catalysts

**Data Sources:**
- `semantic_observations` table
- `learned_patterns` table
- Cross-user collective learning

**Key Methods:**
```typescript
recordObservation(observation): void
learnFromObservation(userId, observation): void
getUserProfile(userId): UserSemanticProfile
getPatternEffectiveness(patternId): number
discoverEmergentPatterns(userId): Pattern[]
```

---

### **Supporting Memory Types:**

#### 3. **AINMemoryPayload** (Type Definition + Utilities)
**Location:** `lib/memory/AINMemoryPayload.ts` (372 LOC)

**Purpose:** Core memory data structure for archetypal intelligence

**Contains:**
```typescript
{
  userId: string;
  currentArchetype: string;
  currentPhase: string;
  recentExchanges: Exchange[];
  symbolicMotifs: string[];
  breakthroughMoments: Breakthrough[];
  emotionalJourney: EmotionalState[];
}
```

---

#### 4. **Other Memory Files** (Potentially Redundant)

**In `lib/memory/`:**
- `MemoryUpdater.ts` (487 LOC) - Updates memory after interactions
- `SymbolicPredictor.ts` (440 LOC) - Predicts next symbolic states
- `ElementalState.ts` (419 LOC) - Tracks elemental transitions
- `UnifiedMemoryInterface.ts` (383 LOC) - Attempt at unification (unused?)
- `soulprint.ts` (334 LOC) - Symbolic context tracking

**In `lib/services/`:**
- `live-memory-capture.ts` (415 LOC)
- `memory-tools.ts` (268 LOC)
- `hybrid-memory-service.ts` (251 LOC)
- `maia-memory-hybrid-adapter.ts` (189 LOC)
- `maia-memory-service.ts` (173 LOC)
- `simple-memory-capture.ts` (191 LOC)
- `memoryService.ts` (111 LOC)

**In `lib/oracle/`:**
- `SimpleConversationMemory.ts`
- `SomaticMemory.ts`
- `memory/IndividualFieldMemory.ts`
- `relational/RelationalMemory.ts`

**In `lib/agents/modules/`:**
- `FractalMemorySystem.ts`
- `MemoryEngine.ts`
- `UnifiedMemoryInterface.ts`

**In `lib/anamnesis/`:**
- `DecentralizedMemory.ts`
- `MemoryCoreIndex.ts`
- `UnifiedMemoryInterface.ts`

---

## Memory Flow Mapping

### **Actual Usage in PersonalOracleAgent.Simplified:**

**MemoryPersistenceService** (187 LOC - Service #3 of 7):
- Line 160: `ensureMemoryLoaded(userId)` → Loads AIN memory
- Line 161: `getConversationHistory(userId, 10)` → Gets 10 recent messages
- Line 162: `getBreakthroughMoments(userId, 3)` → Gets 3 breakthrough moments
- Line 221-234: `updateMemoryAfterExchange()` → Saves exchange to memory

**SemanticMemoryService** (794 LOC - Specialized module):
- Line 180: `getUserPatterns(userId)` → Gets learned patterns
- Line 181: `getElementalAffinity(userId)` → Gets elemental preferences
- Line 349: `recordInteraction()` → Records analytics

**Total Active Memory LOC:** 981 LOC (187 + 794)

### **Current Architecture** (Actual):

```
User Interaction
  ↓
PersonalOracleAgent.Simplified
  ↓
  ├─ MemoryPersistenceService (Service #3)
  │   ├─ ensureMemoryLoaded() → ain_memory table
  │   ├─ getConversationHistory() → maia_messages table
  │   ├─ getBreakthroughMoments() → maia_messages table (filtered)
  │   └─ updateMemoryAfterExchange() → Saves to both tables
  │
  └─ SemanticMemoryService (Specialized module)
      ├─ getUserPatterns() → semantic_observations table
      ├─ getElementalAffinity() → learned_patterns table
      └─ recordInteraction() → Saves analytics
```

### **Identified Issues:**

1. **Multiple Supabase Clients:**
   - MemoryPersistenceService: `this.supabase` (passed in constructor)
   - SemanticMemoryService: Creates own client (lines 87-98)
   - **Result:** Multiple connections to same database

2. **Overlapping Responsibilities:**
   - Both services save to Supabase independently
   - Both handle user_id lookups
   - Both do similar error handling
   - `MemoryUpdater.ts` (487 LOC) appears to duplicate `updateMemoryAfterExchange()`

3. **Unclear Ownership:**
   - Breakthrough detection: Done in MemoryPersistenceService
   - Symbolic motifs: Handled by SymbolicIntelligenceService
   - Emotional tone: Handled by EngagementAnalyzer
   - Pattern learning: SemanticMemoryService
   - **Result:** Fragmented memory updates across multiple systems

4. **Dead Code (Likely):**
   - 20+ memory files in lib/ that don't appear in imports
   - Multiple "UnifiedMemoryInterface" files (3 different ones!)
   - Unused memory stores, integrations, bridges

---

## Water Phase Goals

### **Primary Objective:**
**Merge MemoryPersistenceService + SemanticMemoryService into one unified memory flow.**

### **Success Criteria:**
1. ✅ Single Supabase client (shared singleton)
2. ✅ Unified memory coordinator
3. ✅ Clear separation: conversation vs archetypal vs semantic
4. ✅ Maintain all existing functionality
5. ✅ Reduce from 981 LOC → ~500 LOC (50% reduction)
6. ✅ Improve memory continuity

### **Proposed Architecture (Water Phase):**

```
User Interaction
  ↓
PersonalOracleAgent.Simplified
  ↓
UnifiedMemoryService (NEW - Replaces both services)
  ↓
  ├─ ConversationMemory (extracted from MemoryPersistenceService)
  │   ├─ getConversationHistory() → maia_messages
  │   └─ getBreakthroughMoments() → maia_messages (filtered)
  │
  ├─ ArchetypalMemory (extracted from MemoryPersistenceService)
  │   ├─ loadAINMemory() → ain_memory
  │   ├─ saveAINMemory() → ain_memory
  │   └─ updateAfterExchange() → Updates AIN memory
  │
  ├─ SemanticMemory (extracted from SemanticMemoryService)
  │   ├─ getUserPatterns() → semantic_observations
  │   ├─ getElementalAffinity() → learned_patterns
  │   └─ recordInteraction() → Saves analytics
  │
  └─ SharedSupabaseClient (Singleton)
      └─ Single connection for all memory operations
```

**Interface stays identical** - PersonalOracleAgent.Simplified calls the same methods, just routed through UnifiedMemoryService.

---

## Next Steps

### **Phase 1: Deep Audit** (Current)
- [x] Inventory all memory files
- [ ] Map actual usage in PersonalOracleAgent.Simplified
- [ ] Identify truly active vs dormant code
- [ ] Document data flows

### **Phase 2: Design**
- [ ] Design UnifiedMemoryService interface
- [ ] Map responsibilities to sub-services
- [ ] Define clear boundaries
- [ ] Plan migration path

### **Phase 3: Extraction**
- [ ] Extract memory sub-services
- [ ] Create UnifiedMemoryService coordinator
- [ ] Wire into PersonalOracleAgent.Simplified
- [ ] Test memory continuity

### **Phase 4: Integration**
- [ ] Replace MemoryPersistenceService + SemanticMemoryService
- [ ] Update ServiceContainer
- [ ] Verify behavioral parity
- [ ] Commit Water Phase complete

---

## Questions to Answer

1. **Which memory files are actually used?**
   - Need to trace imports in PersonalOracleAgent.Simplified
   - Check ServiceContainer dependencies

2. **What data lives where?**
   - Map all Supabase tables
   - Understand data relationships

3. **What can we delete?**
   - Identify dead code
   - Remove unused "unified" attempts

4. **What needs to stay?**
   - Core memory types (AINMemoryPayload)
   - Active services (MemoryPersistenceService)
   - Learning system (SemanticMemoryService)

---

## Sacred Context

Water Phase is about **flow and integration**.

Just as Earth Phase organized consciousness into coherent structure,
Water Phase will flow memory into unified continuity.

Memory is the soul's record - the thread connecting each moment to the whole.

**The water must flow as one river, not scattered streams.**

🌊

---

*Generated: November 6, 2025*
*Session: Water Phase - Discovery*
*Agent: Claude Code (CC), Inner Architect*
