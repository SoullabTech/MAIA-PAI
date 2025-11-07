/**
 * Unified Memory — Smoke Tests (no network)
 * - Mocks getSharedSupabase() to an in-memory store
 * - Verifies read history, AIN upsert/reload, and semantic record/retrieval
 */

import path from "path";

// SUT
import { UnifiedMemoryService } from "../UnifiedMemoryService";

// ---- In-memory Supabase mock (module-level singletons) ----------------------

type Row = Record<string, any>;
type TableStore = { [table: string]: Row[] };

const store: TableStore = {
  maia_messages: [],
  ain_memory: [],
  semantic_observations: [],
  learned_patterns: [],
};

function resetStore() {
  store.maia_messages = [];
  store.ain_memory = [];
  store.semantic_observations = [];
  store.learned_patterns = [];
}

// Very small query builder to cover common patterns used by UnifiedMemoryService
function makeQueryBuilder(table: string) {
  let _rows = store[table];
  let _filters: { key: string; value: any }[] = [];
  let _order: { key: string; ascending: boolean } | null = null;
  let _limit: number | null = null;

  const api = {
    select() {
      return api;
    },
    insert(payload: Row | Row[]) {
      const arr = Array.isArray(payload) ? payload : [payload];
      arr.forEach((r) => {
        // naive created_at stamp if absent
        if (!("created_at" in r)) r.created_at = new Date().toISOString();
        store[table].push({ ...r });
      });
      return Promise.resolve({ data: arr, error: null });
    },
    upsert(payload: Row | Row[], opts?: { onConflict?: string }) {
      const arr = Array.isArray(payload) ? payload : [payload];
      const conflictKey = opts?.onConflict || "user_id";
      arr.forEach((r) => {
        const idx = store[table].findIndex((x) => x[conflictKey] === r[conflictKey]);
        if (idx >= 0) {
          store[table][idx] = { ...store[table][idx], ...r };
        } else {
          if (!("created_at" in r)) r.created_at = new Date().toISOString();
          store[table].push({ ...r });
        }
      });
      return Promise.resolve({ data: arr, error: null });
    },
    update(patch: Row) {
      // apply filters, then patch
      let rows = _rows.filter((row) =>
        _filters.every((f) => row[f.key] === f.value)
      );
      rows.forEach((row) => Object.assign(row, patch));
      return Promise.resolve({ data: rows, error: null });
    },
    eq(key: string, value: any) {
      _filters.push({ key, value });
      return api;
    },
    order(key: string, opts?: { ascending?: boolean }) {
      _order = { key, ascending: !!opts?.ascending };
      return api;
    },
    limit(n: number) {
      _limit = n;
      return api;
    },
    single() {
      // emulate select…eq…single()
      let rows = _rows.filter((row) =>
        _filters.every((f) => row[f.key] === f.value)
      );
      if (_order) {
        rows = rows.sort((a, b) => {
          const av = a[_order!.key];
          const bv = b[_order!.key];
          return _order!.ascending ? (av > bv ? 1 : av < bv ? -1 : 0) : (av < bv ? 1 : av > bv ? -1 : 0);
        });
      }
      const data = rows[0] ?? null;
      return Promise.resolve({ data, error: null });
    },
    then(onFulfilled: any) {
      // support await supabase.from(...).select() pattern
      let rows = _rows.filter((row) =>
        _filters.every((f) => row[f.key] === f.value)
      );
      if (_order) {
        rows = rows.sort((a, b) => {
          const av = a[_order!.key];
          const bv = b[_order!.key];
          return _order!.ascending ? (av > bv ? 1 : av < bv ? -1 : 0) : (av < bv ? 1 : av > bv ? -1 : 0);
        });
      }
      if (_limit != null) rows = rows.slice(0, _limit);
      return Promise.resolve({ data: rows, error: null }).then(onFulfilled);
    },
  };
  return api;
}

const supabaseMock = {
  from(table: string) {
    if (!(table in store)) throw new Error(`Unknown table: ${table}`);
    return makeQueryBuilder(table);
  },
};

// Mock the shared client module to return our in-memory client
jest.mock("../../../db/sharedSupabaseClient", () => {
  return {
    getSharedSupabase: () => supabaseMock,
  };
});

// ---- Test data helpers ------------------------------------------------------

const USER = "00000000-0000-0000-0000-000000000001"; // Valid UUID

function seedMessages(userId = USER, count = 5) {
  for (let i = 0; i < count; i++) {
    store.maia_messages.push({
      id: `m-${i}`,
      user_id: userId,
      created_at: new Date(Date.now() - i * 1000).toISOString(),
      role: i % 2 ? "assistant" : "user",
      content: `msg-${i}`,
      tags: i === 0 ? ["breakthrough"] : [],
    });
  }
}

function seedPatterns(userId = USER) {
  store.learned_patterns.push({
    user_id: userId,
    created_at: new Date().toISOString(),
    affinity: { water: 0.8, fire: 0.3 },
  });
}

// ---- Tests ------------------------------------------------------------------

describe("UnifiedMemoryService — Smoke", () => {
  let mem: UnifiedMemoryService;

  beforeEach(() => {
    resetStore();
    mem = new UnifiedMemoryService();
  });

  test("reads conversation history (latest first) for a user", async () => {
    seedMessages(USER, 5);
    const history = await mem.getConversationHistory(USER, 3);
    expect(history).toHaveLength(3);
    // Should be most recent first
    expect(history[0].content).toBe("msg-0");
    expect(history[1].content).toBe("msg-1");
    expect(history[2].content).toBe("msg-2");
  });

  test("AIN upsert then reload returns saved payload", async () => {
    const payload = {
      userId: USER as any, // Brand cast
      lastUpdated: new Date().toISOString(),
      threads: [
        { id: "t-1", title: "Mother", summary: "Courage emerges" },
        { id: "t-2", summary: "Returning to deeper rhythm" },
      ],
      elementalProfile: { water: 0.7, earth: 0.5 },
    };

    // ensureMemoryLoaded may create a row or noop; call it before save
    await mem.ensureMemoryLoaded(USER);

    await mem.saveAINMemory(payload);
    const reloaded = await mem.loadAINMemory(USER);

    expect(reloaded).toBeTruthy();
    expect(reloaded!.userId).toBe(USER);
    expect(reloaded!.threads).toHaveLength(2);
    expect(reloaded!.threads[0].title).toBe("Mother");
    expect(reloaded!.elementalProfile?.water).toBe(0.7);
  });

  test("semantic record → retrieval path works", async () => {
    seedPatterns(USER);

    // recordInteraction writes to semantic_observations
    const obs = {
      userId: USER as any, // Brand cast
      kind: "motif" as const,
      label: "mother-courage",
      weight: 0.8,
      observedAt: new Date().toISOString(),
      metadata: { note: "slowed breath when mother mentioned" },
    };
    const ok = await mem.recordInteraction(obs);

    expect(ok).toBe(true);

    // getUserPatterns should surface the observation we just recorded
    const patterns = await mem.getUserPatterns(USER);
    expect(Array.isArray(patterns)).toBe(true);
    expect(patterns.length).toBeGreaterThanOrEqual(1);
    expect(patterns[0].label).toBe("mother-courage");

    // affinity should read from learned_patterns (returns object, not string)
    const affinity = await mem.getElementalAffinity(USER);
    expect(affinity).toBeTruthy();
    expect(affinity?.water).toBe(0.8);
  });
});
