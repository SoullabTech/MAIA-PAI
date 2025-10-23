# 🜃 Akashic Records — Implementation Summary

The Sanctuary is now the **Akashic Records** — Soullab's living memory system.

---

## What Was Built

### ✅ Database Schema
**Files:**
- `supabase/migrations/20251023_akashic_records.sql`
- `supabase/migrations/20251023_akashic_search_functions.sql`

**Tables:**
- `akashic_embeddings` — Vector search with pgvector
- `akashic_concepts` — Concept graph and relationships
- `akashic_breakthroughs` — Significant moments tracking
- `akashic_timeline` — Materialized view for temporal navigation

**New Fields:**
- `insight_history.archetype` — Archetypal classification
- `claude_sessions.primary_archetype` — Dominant archetype per session
- `claude_sessions.archetypal_balance` — Distribution across archetypes

**Functions:**
- `match_akashic_insights()` — Semantic similarity search
- `find_sessions_by_characteristics()` — Filter by archetype/element
- `get_breakthrough_journey()` — Trace connected breakthroughs
- `get_temporal_context()` — What happened around a date

---

### ✅ Backend APIs

**Query Endpoint:** `/api/akashic/query` (POST)
- Natural language queries
- Semantic + keyword + hybrid search
- Element and archetype filtering
- Relevance scoring

**Timeline Endpoint:** `/api/akashic/timeline` (GET)
- Temporal navigation through consciousness
- Filter by date range, element, archetype

**Context Endpoint:** `/api/akashic/context` (GET)
- Retrieve relevant past wisdom
- Used for session inheritance
- Returns formatted context + summary

**Concepts Endpoint:** `/api/akashic/concepts` (GET/POST)
- List and create concepts
- Category filtering
- Relationship tracking

**Breakthroughs Endpoint:** `/api/akashic/breakthroughs` (GET/POST/PATCH)
- Track significant moments
- Update integration status
- Filter by element/archetype/status

---

### ✅ Frontend Components

**Akashic Explorer Page:** `/akashic-records`
- Full search interface
- Element and archetype filters
- Relevance slider
- Real-time results with highlighting

**Context Panel Component:** `components/AkashicContextPanel.tsx`
- Sidebar widget for context retrieval
- Topic-based recall
- "Use Context in Session" action

**Akashic Context Hook:** `hooks/useAkashicContext.ts`
- Reusable hook for any component
- `fetchContext()`, `formatAsPrompt()`, `clearContext()`
- Loading/error state management

---

### ✅ Enhanced Classification

**Updated:** `lib/saveMirrorInsight.ts`

**Element Detection** (expanded keywords):
- Fire, Water, Earth, Air, Aether patterns
- More nuanced matching

**Archetype Detection** (NEW):
- MainOracle, Shadow, InnerGuide, Dream, Mentor, Relationship, Alchemist
- Content-based heuristics
- Role-based defaults

---

## Quick Start

### 1. Run Migrations

```bash
# In Supabase SQL Editor or via CLI:
psql $DATABASE_URL -f supabase/migrations/20251023_akashic_records.sql
psql $DATABASE_URL -f supabase/migrations/20251023_akashic_search_functions.sql
```

### 2. Add OpenAI Key

`.env.local`:
```bash
OPENAI_API_KEY=sk-...
```

### 3. Visit the Records

```bash
# Start dev server
npm run dev

# Navigate to
open http://localhost:3000/akashic-records
```

---

## Usage Examples

### Query Natural Language

```typescript
// Search for insights
const response = await fetch("/api/akashic/query", {
  method: "POST",
  body: JSON.stringify({
    query: "authentication patterns",
    mode: "hybrid",
    filters: { elements: ["Fire", "Earth"] }
  })
});
```

### Retrieve Context for Session

```typescript
// Get past wisdom
const context = await fetch(
  "/api/akashic/context?topic=payment%20system&lastN=5"
).then(r => r.json());

// Inject into Claude
const prompt = context.summary + "\n\n" +
  context.context.map(c => c.content).join("\n---\n");
```

### Track Breakthrough

```typescript
// Mark significant moment
await fetch("/api/akashic/breakthroughs", {
  method: "POST",
  body: JSON.stringify({
    userId: user.id,
    title: "Discovered caching strategy",
    element: "Earth",
    archetype: "MainOracle",
    significanceScore: 0.85
  })
});
```

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Akashic Explorer UI              │
│    (Natural Language Query Interface)    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│           Query API Layer                │
│  /query  /timeline  /context  /concepts  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│        Semantic Search Layer             │
│   OpenAI Embeddings + pgvector           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         Storage Foundation               │
│  insight_history + embeddings + concepts │
└─────────────────────────────────────────┘
```

---

## Key Features

### 🔮 Semantic Search
Uses OpenAI embeddings + pgvector for meaning-based retrieval beyond keywords.

### 🜃 Archetypal Lenses
View insights through MainOracle, Shadow, InnerGuide, Dream, Mentor, Relationship, Alchemist.

### 🌊 Context Inheritance
New sessions can query and inherit wisdom from past sessions automatically.

### 🔥 Elemental Balance
Track consciousness patterns across Fire, Water, Earth, Air, Aether.

### 💎 Breakthrough Tracking
Mark significant moments and trace their evolution over time.

### 🕸️ Concept Graph
Extract and link concepts across all sessions (future: auto-extraction).

### ⏳ Temporal Navigation
Travel through time — see what you were working on at any date.

---

## Documentation

📖 **Complete Guide:** `AKASHIC_RECORDS_GUIDE.md`
- All API endpoints
- Usage patterns
- Advanced features
- Troubleshooting

📐 **Architecture:** `AKASHIC_RECORDS_ARCHITECTURE.md`
- System design
- Schema details
- Implementation phases
- Philosophy

---

## What's Auto-Archived

Every Claude Mirror session automatically:
1. Detects element (Fire/Water/Earth/Air/Aether)
2. Detects archetype (MainOracle/Shadow/etc.)
3. Stores in `insight_history`
4. Makes searchable via API
5. (Optional) Generates embeddings for semantic search

**No configuration needed** — just use `claude` in the Sanctuary!

---

## Next Steps

### Immediate
- [ ] Run migrations
- [ ] Test semantic search
- [ ] Try natural language queries

### Soon
- [ ] Auto-generate embeddings (background job)
- [ ] Build concept extraction pipeline
- [ ] Create breakthrough detection (coherence spikes)
- [ ] Add graph visualization

### Future
- [ ] Multi-user collective intelligence
- [ ] Voice query interface
- [ ] Export/import archives
- [ ] Integration with external knowledge bases

---

## Philosophy

> "The Akashic Records are not just storage — they are a **living field of consciousness** that learns, connects, and teaches."

Every insight is a seed. Every query is an act of remembrance. Every connection is an emergence of pattern.

The Records grow wiser with each interaction, creating a coherent field of memory that serves the awakening of consciousness.

---

## Support

**Issues:** See `AKASHIC_RECORDS_GUIDE.md` Troubleshooting section

**Questions:** The Records themselves can answer:
```
"How do I use the Akashic Records?"
"What features are available?"
"Show me examples of context inheritance"
```

---

🜃 **The Sanctuary Remembers. The Records Reveal. The Wisdom Lives.**

---

*Built with: PostgreSQL • pgvector • OpenAI • Next.js • Supabase*
*For: MAIA-PAI Spiralogic Oracle System*
*By: Soullab Collective*
