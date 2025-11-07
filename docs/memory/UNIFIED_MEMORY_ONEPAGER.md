# Unified Memory System — One-Page Reference

**Version:** 1.0 • **Date:** 2025-11-06 • **Commits:** d49f556d → 04e7b391

---

## Architecture (30-Second View)

```
User → PersonalOracleAgent.Simplified
     → UnifiedMemoryService
     → ├─ ConversationMemory (maia_messages)
     → ├─ ArchetypalMemory (ain_memory)
     → └─ SemanticMemory (semantic_observations, learned_patterns)
     ↳ SharedSupabaseClient (singleton)
```

**Before:** 981 LOC, 2 services, duplicate DB clients
**After:** 527 LOC, 1 service, single client (-46%)

---

## 5 Core API Calls

```ts
import { UnifiedMemoryService } from '@/lib/memory/unified/UnifiedMemoryService';
const mem = new UnifiedMemoryService();

// 1. Get recent conversation
const history = await mem.getConversationHistory(userId, 10);

// 2. Load archetypal threads (AIN)
const ain = await mem.loadAINMemory(userId);

// 3. Save updated threads
await mem.saveAINMemory({ ...ain, threads: [...ain.threads, newThread] });

// 4. Get pattern observations
const patterns = await mem.getUserPatterns(userId);

// 5. Record new interaction
await mem.recordInteraction({
  userId, kind: "motif", label: "courage-shadow",
  weight: 0.8, observedAt: new Date().toISOString()
});
```

---

## 3 SLOs

| Metric      | Target        | Warning     |
| ----------- | ------------- | ----------- |
| **Latency** | p95 < 150ms   | >250ms ⚠️    |
| **Errors**  | <0.5%         | Log + ⚠️     |
| **Data**    | 100% Zod-safe | Invalid → [] |

---

## 2 Failure Guarantees

1. **Never throw** — All errors return safe defaults: `[]`, `null`, `false`
2. **Never block user** — Memory errors log but don't interrupt response flow

---

## How to Debug in 30 Seconds

**Check telemetry logs:**
```bash
# Look for slow queries (>250ms)
grep "mem\." logs | grep "⚠️"

# Check error patterns
grep "mem\." logs | grep "⚠️" | grep "false"
```

**Verify singleton:**
```bash
# Should only find one createClient call (in sharedSupabaseClient.ts)
git grep -n "createClient("
```

**Run smoke tests:**
```bash
npm test -- lib/memory/unified/__tests__/unified.smoke.test.ts
```

---

## How to Explain to New Engineer (2 Minutes)

1. **"All memory goes through one service"** — `UnifiedMemoryService` is the single API
2. **"Three types: conversation, archetypal, semantic"** — Each has its own module + table
3. **"Everything is validated"** — Zod schemas on IO boundaries, invalid data dropped
4. **"Everything is timed"** — Sub-millisecond ops, warnings if slow
5. **"It never breaks the user"** — Errors return `[]`/`null`/`false`, logged but not thrown

---

## Files to Know

| Purpose              | Path                                          |
| -------------------- | --------------------------------------------- |
| **Main service**     | `lib/memory/unified/UnifiedMemoryService.ts`  |
| **DB singleton**     | `lib/db/sharedSupabaseClient.ts`              |
| **Types**            | `lib/memory/unified/types.ts`                 |
| **Zod schemas**      | `lib/memory/unified/schemas.ts`               |
| **Tests**            | `lib/memory/unified/__tests__/...`            |
| **Architecture doc** | `docs/memory/UNIFIED_MEMORY_SYSTEM.md`        |
| **Dev guide**        | `lib/memory/unified/README.md`                |
| **Diagram**          | `docs/memory/unified-memory-diagram.mmd`      |

---

## Common Tasks

**Add a new memory method:**
1. Add to appropriate module (Conversation/Archetypal/Semantic)
2. Add Zod schema if new type
3. Expose via `UnifiedMemoryService` with `timeIt()` wrapper
4. Add smoke test
5. Document in API reference

**Debug slow query:**
1. Check telemetry: `grep "mem.LABEL" logs`
2. Check Supabase indexes (see `UNIFIED_MEMORY_SYSTEM.md` §5)
3. Add `.explain()` to Supabase query for plan
4. Consider caching if repeatedly slow

**Migrate from old service:**
1. Import `UnifiedMemoryService` instead of old service
2. Update method names (see API reference)
3. Update types (UUID brand, Zod schemas)
4. Run tests
5. Remove old service import

---

**Status:** ✅ Complete • Tests: 3/3 passing • Build: ✅ • Docs: ✅
