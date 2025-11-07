# Unified Memory (Developer Guide)

**Path:** `lib/memory/unified/*`
**Singleton client:** `lib/db/sharedSupabaseClient.ts`

## Quickstart
```ts
import { UnifiedMemoryService } from '@/lib/memory/unified/UnifiedMemoryService';

const mem = new UnifiedMemoryService();

const history = await mem.getConversationHistory(userId, 10);
const ain = await mem.loadAINMemory(userId);
await mem.saveAINMemory({ ...ain, threads: [...ain.threads, newThread] });
const patterns = await mem.getUserPatterns(userId);
```

## API

* `getConversationHistory(userId: string, limit = 10): Promise<ConversationMessage[]>`
* `getBreakthroughMoments(userId: string, limit = 3): Promise<ConversationMessage[]>`
* `loadAINMemory(userId: string): Promise<AINMemoryPayload | null>`
* `saveAINMemory(payload: AINMemoryPayload): Promise<boolean>`
* `updateAfterExchange(userId: string, threadSummary: string): Promise<boolean>`
* `getUserPatterns(userId: string): Promise<PatternObservation[]>`
* `getElementalAffinity(userId: string): Promise<Record<string, number> | null>`
* `recordInteraction(obs: PatternObservation): Promise<boolean>`

All IO is Zod-validated. Errors are logged + safe defaults returned.

## Telemetry

Each method auto-times and records under `mem.*` keys. >250ms logs a ⚠️.

## Failure Defaults

* Reads → `[]` or `null`
* Writes → `false` (after logging)
* **Never** throw into user path.

## Tests

See `lib/memory/unified/__tests__/unified.smoke.test.ts` (3 smokes).
Run: `npm test -- lib/memory/unified/__tests__/unified.smoke.test.ts`
