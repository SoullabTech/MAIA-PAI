# Unified Memory System (Earth→Water→Fire→Air • v1.0 • 2025-11-06)

**Purpose:** One coherent flow for conversation, archetypal (AIN), and semantic memory with a single DB client, strong types, and telemetry.

## 1) Executive Summary
- **Before:** `MemoryPersistenceService` + `SemanticMemoryService` (981 LOC), duplicate clients, overlapping writes.
- **After:** `UnifiedMemoryService` + 3 submodules (527 LOC), **single** Supabase client, clean boundaries, Zod validation, telemetry on every call.

## 2) Flow (ASCII)
User → PersonalOracleAgent.Simplified
→ **UnifiedMemoryService**
→ ├─ ConversationMemory (maia_messages)
→ ├─ ArchetypalMemory (ain_memory)
→ └─ SemanticMemory (semantic_observations, learned_patterns)
↳ SharedSupabaseClient (singleton)

## 3) Public API (surface)
- `getConversationHistory(userId, limit)`
- `getBreakthroughMoments(userId, limit)`
- `loadAINMemory(userId)` / `saveAINMemory(payload)` / `updateAfterExchange(userId, threadSummary)`
- `getUserPatterns(userId)` / `getElementalAffinity(userId)` / `recordInteraction(obs)`

> All methods: Zod-validated IO + graceful defaults + telemetry.

## 4) Types (Zod)
- `ConversationMessage` (UUID userId, ISO createdAt, role/content)
- `AINMemoryPayload` (threads, elementalProfile)
- `PatternObservation` (kind, label, weight, observedAt, metadata)

## 5) DB: Tables, Indexes, RLS
**Indexes**
```sql
-- maia_messages
create index if not exists idx_maia_messages_user_time
  on maia_messages(user_id, created_at desc);
create index if not exists idx_maia_messages_user_tag_time
  on maia_messages(user_id, tags, created_at desc);

-- ain_memory
create unique index if not exists ux_ain_memory_user on ain_memory(user_id);

-- semantic_observations
create index if not exists idx_sem_obs_user_time
  on semantic_observations(user_id, observed_at desc);

-- learned_patterns
create unique index if not exists ux_learned_patterns_user on learned_patterns(user_id);
```

**RLS**: Enabled on all four. Service role key is server-only. Add an anon-canary in dev; anon should never touch these tables.

## 6) Observability & SLOs

Every method wrapped with `timeIt()` and recorded by `recordMemoryTiming()`:

* Labels: `mem.conv.history`, `mem.conv.breakthroughs`, `mem.arch.loadAIN`, `mem.arch.saveAIN`, `mem.arch.updateAfterExchange`, `mem.sem.patterns`, `mem.sem.affinity`, `mem.sem.record`
* **Warn threshold:** 250ms
* **SLO:** p95 < 150ms per call; error rate < 0.5%

## 7) Failure Modes & Defaults

On Supabase error:

* Log error (console.warn or console.error)
* Return safe default (`[]` | `null` | `false`)
* Never block user response path

## 8) CI & Lint Rails

**CI guard (no stray clients):**

```bash
! git grep -n "createClient(" -- ":!lib/db/sharedSupabaseClient.ts" || (echo "❌ createClient found outside singleton" && exit 1)
```

**ESLint:**

```js
"no-restricted-syntax": ["error",
  { "selector": "CallExpression[callee.name='createClient']",
    "message": "Use getSharedSupabase() from lib/db/sharedSupabaseClient.ts" }]
```

## 9) Migration/Adoption Notes

* Old services removed (commit 2378c813)
* Telemetry live (4a0d2509)
* Smoke tests green (6bf03c4b)

## 10) Open Questions

* Should breakthroughs move to a dedicated table?
* Do we expose per-user p95 in UI?
* Next spiral: memory health dashboard?
