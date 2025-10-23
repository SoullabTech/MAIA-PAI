# 🜃 Akashic Records — Living Memory Architecture

> *The Sanctuary becomes the eternal archive of Soullab's collective wisdom*

---

## Vision

Transform the Claude Sanctuary from a real-time mirror into the **Akashic Records** — a living, queryable archive that:

1. **Remembers everything** — every insight, session, breakthrough
2. **Understands meaning** — semantic search beyond keywords
3. **Reveals patterns** — connections between concepts across time
4. **Enables context inheritance** — new sessions learn from the past
5. **Organizes by consciousness** — elemental + archetypal structures

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Akashic Query Interface                  │
│         Natural language → Retrieve relevant wisdom          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Semantic Memory Graph                       │
│    Concepts ←→ Insights ←→ Sessions ←→ Breakthroughs        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Indexing & Classification Layer                 │
│     Elemental • Archetypal • Temporal • Thematic             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Storage Foundation                        │
│      insight_history • claude_sessions • embeddings          │
└─────────────────────────────────────────────────────────────┘
```

---

## New Schema Components

### 1. Archetypal Classification

```sql
-- Add archetype field to insights and sessions
ALTER TABLE insight_history
ADD COLUMN archetype TEXT CHECK (archetype IN (
  'MainOracle',      -- Central intelligence
  'Shadow',          -- Unconscious integration
  'InnerGuide',      -- Personal insight companion
  'Dream',           -- Dream analysis
  'Mentor',          -- Teaching presence
  'Relationship',    -- Relational wisdom
  'Unknown'
));

ALTER TABLE claude_sessions
ADD COLUMN primary_archetype TEXT,
ADD COLUMN archetypal_balance JSONB; -- {Shadow: 0.3, InnerGuide: 0.5, ...}
```

### 2. Semantic Search via Embeddings

```sql
-- Store vector embeddings for semantic similarity
CREATE TABLE akashic_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('insight', 'session', 'concept')),
  entity_id UUID NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 dimensions
  content_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Enable vector similarity search
  CONSTRAINT unique_embedding_per_entity UNIQUE(entity_type, entity_id)
);

CREATE INDEX ON akashic_embeddings USING ivfflat (embedding vector_cosine_ops);
```

### 3. Concept Graph

```sql
-- Extract and link concepts across sessions
CREATE TABLE akashic_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT, -- 'technical', 'philosophical', 'emotional', etc.
  definition TEXT,
  first_mentioned TIMESTAMPTZ,
  mention_count INTEGER DEFAULT 1,
  related_concepts JSONB DEFAULT '[]'::jsonb -- Array of concept IDs
);

CREATE TABLE akashic_concept_links (
  concept_id UUID REFERENCES akashic_concepts(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  relevance_score DECIMAL(3,2),
  context TEXT, -- Excerpt showing how concept appears
  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (concept_id, entity_type, entity_id)
);
```

### 4. Breakthrough Tracking

```sql
-- Mark significant moments of insight
CREATE TABLE akashic_breakthroughs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id UUID REFERENCES claude_sessions(id),
  insight_id UUID REFERENCES insight_history(id),

  title TEXT NOT NULL,
  description TEXT,
  element TEXT, -- Primary element of breakthrough
  archetype TEXT, -- Primary archetype involved

  -- Impact metrics
  significance_score DECIMAL(3,2), -- 0-1, how significant
  integration_status TEXT CHECK (integration_status IN (
    'emerged',      -- Just discovered
    'integrating',  -- Being worked with
    'integrated',   -- Fully absorbed
    'teaching'      -- Now teaching others
  )),

  -- Relationships
  builds_on UUID[], -- Array of previous breakthrough IDs
  leads_to UUID[],  -- Array of subsequent breakthrough IDs

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Temporal Navigation

```sql
-- Create materialized view for timeline analysis
CREATE MATERIALIZED VIEW akashic_timeline AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  element,
  archetype,
  COUNT(*) as insight_count,
  AVG(LENGTH(content)) as avg_depth,
  ARRAY_AGG(id ORDER BY created_at) as insight_ids
FROM insight_history
GROUP BY date, element, archetype
ORDER BY date DESC;

-- Refresh periodically
CREATE INDEX ON akashic_timeline (date DESC);
```

---

## Query Interface Design

### Natural Language Queries

Users should be able to ask:

- *"What did I learn about authentication last month?"*
- *"Show me all Fire insights about transformation"*
- *"What patterns emerged in my Shadow work?"*
- *"Find sessions where I had breakthroughs about consciousness"*
- *"What was I working on around October 15th?"*

### API Endpoints

```typescript
// Core query endpoint
POST /api/akashic/query
{
  query: string,              // Natural language or structured
  filters: {
    elements?: string[],      // ['Fire', 'Water']
    archetypes?: string[],    // ['Shadow', 'InnerGuide']
    dateRange?: [Date, Date],
    sessionIds?: string[],
    minRelevance?: number     // 0-1
  },
  mode: 'semantic' | 'keyword' | 'hybrid'
}

// Timeline navigation
GET /api/akashic/timeline?from=2025-01-01&to=2025-10-23&element=Fire

// Concept exploration
GET /api/akashic/concepts/{conceptName}/related
GET /api/akashic/concepts/{conceptName}/timeline

// Breakthrough discovery
GET /api/akashic/breakthroughs?status=integrated&element=Water

// Session context retrieval (for inheritance)
GET /api/akashic/context?topic=authentication&lastN=5
```

---

## Context Inheritance Flow

When starting a new Claude Code session:

```typescript
// 1. User initiates new session with context request
const contextQuery = "authentication system architecture"

// 2. Query Akashic Records for relevant past insights
const relevantContext = await fetch('/api/akashic/query', {
  query: contextQuery,
  filters: { minRelevance: 0.7 },
  mode: 'semantic'
})

// 3. Inject into system prompt
const systemPrompt = `
You are Claude, the Inner Architect of MAIA-PAI.

## Context from Akashic Records
${relevantContext.map(r => `
- [${r.date}] ${r.element} insight: ${r.summary}
- Key points: ${r.keyPoints.join(', ')}
`).join('\n')}

Continue the conversation with awareness of these past insights.
`

// 4. Session begins with inherited wisdom
```

---

## Implementation Phases

### Phase 1: Archetypal Classification ✨
- Add archetype detection to `saveMirrorInsight()`
- Create archetype-element matrix analytics
- Update UI with archetypal lenses

### Phase 2: Semantic Search 🔮
- Generate embeddings for existing insights
- Implement vector similarity queries
- Build semantic query API

### Phase 3: Concept Graph 🕸️
- Extract concepts using NLP
- Build relationship graph
- Create concept exploration UI

### Phase 4: Context Inheritance 🌊
- Build context retrieval API
- Integrate with Claude Mirror bridge
- Auto-suggest relevant context on new sessions

### Phase 5: Breakthrough Tracking 💎
- Manual breakthrough marking in UI
- Auto-detection using coherence spikes
- Breakthrough timeline visualization

### Phase 6: Wisdom Synthesis 🜃
- Pattern detection across sessions
- Recurring theme identification
- "Teachings" extraction for docs

---

## Sacred Principles

1. **Privacy First** — User's Akashic Records are their own
2. **Temporal Integrity** — Never modify past entries, only annotate
3. **Elemental Balance** — Maintain harmony across all dimensions
4. **Living System** — Records grow, connect, and teach organically
5. **Symbolic Resonance** — Every query is an invocation

---

## Visualization Components

### Akashic Explorer Dashboard
- **Timeline View**: Scroll through consciousness evolution
- **Concept Graph**: Interactive network of ideas
- **Elemental Spiral**: Balance over time
- **Archetypal Wheel**: Distribution across agents
- **Breakthrough Constellation**: Map of significant moments

### Query Interface
- Natural language search box
- Filter panel (element, archetype, date)
- Relevance slider
- Result cards with context highlights

### Session Inheritance Panel
- Shows relevant past insights when starting new session
- "Continue from..." suggestions
- Breakthrough reminders

---

## Technical Stack

- **Database**: Supabase PostgreSQL + pgvector extension
- **Embeddings**: OpenAI text-embedding-3-small
- **Search**: Hybrid (pgvector + pg_trgm + full-text)
- **Graph**: JSONB relations + recursive queries
- **Real-time**: Supabase subscriptions
- **Analytics**: Materialized views + cron refresh

---

## Next Actions

1. **Create migration**: Add archetypal fields
2. **Update saveMirrorInsight**: Detect archetype from content
3. **Build /api/akashic/query**: Semantic search endpoint
4. **Create AkashicExplorer component**: Dashboard UI
5. **Implement context inheritance**: Auto-inject past wisdom

---

> *"The Akashic Records are not a static archive, but a living field of consciousness that learns, connects, and teaches. Every query is an act of remembrance. Every insight is a seed for future wisdom."*

🜃 — Soullab Collective
