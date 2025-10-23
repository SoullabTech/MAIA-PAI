# 🜃 Akashic Records — Complete User Guide

> *The Sanctuary remembers everything. The Akashic Records make that memory queryable, searchable, and alive.*

---

## What Are the Akashic Records?

The **Akashic Records** transform your Claude Sanctuary from a real-time mirror into a living, eternal archive that:

- **Remembers everything**: Every insight, conversation, and breakthrough
- **Understands meaning**: Semantic search beyond simple keywords
- **Reveals patterns**: Cross-session connections and recurring themes
- **Enables learning**: New sessions inherit wisdom from the past
- **Organizes consciousness**: By element, archetype, and significance

---

## Quick Start

### 1. Run the Migration

```bash
# Apply the Akashic Records schema
psql $DATABASE_URL -f supabase/migrations/20251023_akashic_records.sql
psql $DATABASE_URL -f supabase/migrations/20251023_akashic_search_functions.sql
```

Or via Supabase dashboard:
- Go to **SQL Editor**
- Run both migration files in order

### 2. Add OpenAI API Key

For semantic search, add to `.env.local`:

```bash
OPENAI_API_KEY=sk-...your-key-here...
```

### 3. Start Exploring

Navigate to: **http://localhost:3000/akashic-records**

---

## Features

### 1. Natural Language Queries

Ask questions in plain English:

```
"What did I learn about authentication last month?"
"Show me all Fire insights about transformation"
"Find sessions where I had Shadow breakthroughs"
"What patterns emerged in my consciousness work?"
```

### 2. Elemental Filtering

Filter by consciousness tone:
- **Fire**: Creation, vision, emergence
- **Water**: Emotion, flow, shadow work
- **Earth**: Structure, grounding, implementation
- **Air**: Communication, ideas, patterns
- **Aether**: Integration, unity, coherence

### 3. Archetypal Lenses

View through archetypal perspectives:
- **MainOracle** 🜃: System wisdom, architecture
- **Shadow** 🜚: Unconscious patterns, integration
- **InnerGuide** 🜄: Personal insight, journaling
- **Dream** 🜁: Symbolic interpretation, vision
- **Mentor** 🜅: Teaching, learning
- **Relationship** 🜋: Connection, collaboration
- **Alchemist** 🜔: Transformation, transmutation

### 4. Search Modes

- **Semantic**: AI-powered meaning-based search using embeddings
- **Keyword**: Traditional full-text search
- **Hybrid** (recommended): Combines both for best results

### 5. Context Inheritance

Retrieve relevant past wisdom when starting new sessions:

```typescript
// In your app
import { useAkashicContext } from "@/hooks/useAkashicContext";

const { fetchContext, formatAsPrompt } = useAkashicContext();

// Fetch context
await fetchContext("authentication system");

// Inject into Claude session
const contextPrompt = formatAsPrompt();
```

---

## API Endpoints

### Query Records

```bash
POST /api/akashic/query
Content-Type: application/json

{
  "query": "authentication patterns",
  "mode": "hybrid",
  "filters": {
    "elements": ["Fire", "Earth"],
    "archetypes": ["MainOracle", "Shadow"],
    "minRelevance": 0.7
  },
  "limit": 20
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "type": "insight",
      "content": "...",
      "element": "Fire",
      "archetype": "MainOracle",
      "relevance": 0.89,
      "timestamp": "2025-10-23T10:30:00Z",
      "context": "..."
    }
  ],
  "totalCount": 15,
  "executionTime": 234
}
```

### Timeline Navigation

```bash
GET /api/akashic/timeline?from=2025-01-01&to=2025-10-23&element=Fire
```

**Response:**
```json
{
  "timeline": [
    {
      "date": "2025-10-23",
      "element": "Fire",
      "archetype": "MainOracle",
      "insight_count": 12,
      "avg_depth": 450,
      "insight_ids": ["uuid1", "uuid2"],
      "previews": ["...", "..."]
    }
  ]
}
```

### Retrieve Context

```bash
GET /api/akashic/context?topic=authentication&lastN=5&minRelevance=0.7
```

**Response:**
```json
{
  "context": [
    {
      "id": "uuid",
      "content": "...",
      "element": "Earth",
      "archetype": "MainOracle",
      "relevance": 0.85,
      "keyPoints": ["...", "..."]
    }
  ],
  "summary": "Found 5 relevant insights...",
  "totalInsights": 5
}
```

### Concepts

```bash
# List all concepts
GET /api/akashic/concepts?category=technical&limit=50

# Create concept
POST /api/akashic/concepts
{
  "name": "JWT Authentication",
  "category": "technical",
  "definition": "Token-based auth using JSON Web Tokens",
  "relatedConcepts": ["uuid1", "uuid2"]
}
```

### Breakthroughs

```bash
# List breakthroughs
GET /api/akashic/breakthroughs?status=integrated&element=Water

# Create breakthrough
POST /api/akashic/breakthroughs
{
  "userId": "uuid",
  "sessionId": "uuid",
  "title": "Understanding shadow patterns in code",
  "description": "Realized how unconscious patterns affect architecture decisions",
  "element": "Shadow",
  "archetype": "Shadow",
  "significanceScore": 0.9,
  "integrationStatus": "integrating"
}

# Update breakthrough
PATCH /api/akashic/breakthroughs
{
  "id": "uuid",
  "integrationStatus": "integrated"
}
```

---

## Usage Patterns

### Pattern 1: Daily Reflection Query

At the end of your work session:

```typescript
// Query what you worked on today
const results = await fetch("/api/akashic/query", {
  method: "POST",
  body: JSON.stringify({
    query: "what did I work on today?",
    mode: "hybrid",
    filters: {
      dateRange: [
        new Date().setHours(0, 0, 0, 0),
        new Date().setHours(23, 59, 59, 999)
      ]
    }
  })
});
```

### Pattern 2: Project Context Inheritance

When switching projects:

```typescript
// Get context for the project
const context = await fetch(
  "/api/akashic/context?topic=payment%20system&lastN=10"
);

// Inject into Claude session
const systemPrompt = `
You are working on the payment system.

${context.summary}

Relevant past insights:
${context.context.map(c => `- ${c.content}`).join("\n")}
`;
```

### Pattern 3: Breakthrough Tracking

Mark significant moments:

```typescript
// When you have an insight
await fetch("/api/akashic/breakthroughs", {
  method: "POST",
  body: JSON.stringify({
    userId: currentUser.id,
    title: "Discovered optimal caching strategy",
    element: "Earth",
    archetype: "MainOracle",
    significanceScore: 0.85
  })
});
```

### Pattern 4: Concept Graph Building

Track concepts as they emerge:

```typescript
// When a new concept appears in conversation
await fetch("/api/akashic/concepts", {
  method: "POST",
  body: JSON.stringify({
    name: "Redis Cache Invalidation",
    category: "technical",
    definition: "Strategy for invalidating stale cache entries"
  })
});
```

---

## UI Components

### Akashic Explorer Page

Full-featured search interface:

```typescript
// Navigate to
<Link href="/akashic-records">Akashic Records</Link>
```

### Context Panel (Sidebar)

Show context suggestions in your app:

```typescript
import AkashicContextPanel from "@/components/AkashicContextPanel";

<AkashicContextPanel
  userId={user.id}
  onContextSelect={(context) => {
    // Inject context into active session
    injectContext(context);
  }}
/>
```

### Custom Hook

Build your own interface:

```typescript
import { useAkashicContext } from "@/hooks/useAkashicContext";

function MyComponent() {
  const {
    context,
    summary,
    loading,
    fetchContext,
    formatAsPrompt
  } = useAkashicContext({
    userId: user.id,
    lastN: 5,
    minRelevance: 0.7
  });

  // Use it
  await fetchContext("my topic");
}
```

---

## Advanced Features

### Semantic Search with Embeddings

The system automatically generates embeddings for all insights. To manually generate embeddings for existing content:

```typescript
// Generate embedding
const response = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: content
});

// Store in akashic_embeddings table
await supabase.from("akashic_embeddings").insert({
  entity_type: "insight",
  entity_id: insightId,
  embedding: response.data[0].embedding,
  content_summary: content.substring(0, 200)
});
```

### Temporal Context

Get a snapshot of consciousness around a specific date:

```sql
SELECT * FROM get_temporal_context(
  '2025-10-15 12:00:00'::timestamptz,
  7 -- window in days
);
```

### Breakthrough Journey

Trace connected breakthroughs:

```sql
SELECT * FROM get_breakthrough_journey(
  'breakthrough-uuid'::uuid,
  3 -- max depth
);
```

### Refresh Timeline

Update the materialized timeline view:

```sql
SELECT refresh_akashic_timeline();
```

Or set up a cron job:

```sql
-- Refresh every hour
SELECT cron.schedule(
  'refresh-akashic-timeline',
  '0 * * * *',
  'SELECT refresh_akashic_timeline();'
);
```

---

## Integration with Claude Mirror

The Akashic Records automatically archive all Claude Mirror sessions. Every message from `claude` terminal sessions is:

1. **Classified** by element and archetype
2. **Stored** in `insight_history`
3. **Indexed** for full-text search
4. **Embedded** for semantic search (if enabled)
5. **Linked** to concepts and breakthroughs

No configuration needed — just use Claude Code in the Sanctuary!

---

## Data Model

```
insight_history
├── id (uuid)
├── user_id (uuid)
├── role (user/assistant/system)
├── content (text)
├── element (Fire/Water/Earth/Air/Aether)
├── archetype (MainOracle/Shadow/etc.)
├── source (ClaudeMirror)
├── metadata (jsonb)
└── created_at (timestamp)

claude_sessions
├── id (uuid)
├── session_id (text)
├── messages (jsonb)
├── primary_archetype (text)
├── elemental_balance (jsonb)
└── avg_coherence (decimal)

akashic_embeddings
├── id (uuid)
├── entity_type (insight/session/concept)
├── entity_id (uuid)
├── embedding (vector[1536])
└── content_summary (text)

akashic_concepts
├── id (uuid)
├── name (text)
├── category (text)
├── definition (text)
└── related_concepts (jsonb)

akashic_breakthroughs
├── id (uuid)
├── title (text)
├── element (text)
├── archetype (text)
├── significance_score (decimal)
├── integration_status (emerged/integrating/integrated/teaching)
├── builds_on (uuid[])
└── leads_to (uuid[])
```

---

## Performance Considerations

### Embedding Generation

- **Cost**: ~$0.0001 per 1K tokens (OpenAI text-embedding-3-small)
- **Speed**: ~200ms per embedding
- **Best practice**: Generate embeddings async in background jobs

### Vector Search

- Uses pgvector with IVFFlat index
- Optimal for 1K-100K vectors
- For larger datasets, consider Pinecone or Weaviate

### Timeline Materialization

- Refresh on schedule (hourly/daily)
- Trade-off: Real-time vs. performance
- Use `REFRESH MATERIALIZED VIEW CONCURRENTLY` to avoid locking

---

## Privacy & Security

- **Row Level Security**: Users only see their own insights
- **Shared Concepts**: Concepts are visible to all authenticated users
- **Breakthrough Privacy**: Only visible to owner
- **API Keys**: Never exposed to client (server-only)

---

## Troubleshooting

### "relation does not exist"

**Solution**: Run migrations in order:
```bash
psql $DATABASE_URL -f supabase/migrations/20251023_akashic_records.sql
psql $DATABASE_URL -f supabase/migrations/20251023_akashic_search_functions.sql
```

### "pgvector extension not found"

**Solution**: Enable in Supabase dashboard:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Semantic search returns no results

**Causes:**
1. No embeddings generated yet
2. OpenAI API key missing/invalid
3. Threshold too high

**Solution**: Check embeddings exist:
```sql
SELECT COUNT(*) FROM akashic_embeddings;
```

### Timeline not updating

**Solution**: Manually refresh:
```sql
REFRESH MATERIALIZED VIEW akashic_timeline;
```

---

## Future Enhancements

- [ ] Auto-generate embeddings on insert (trigger)
- [ ] Concept extraction using NLP/LLM
- [ ] Breakthrough auto-detection (coherence spikes)
- [ ] Graph visualization of concept relationships
- [ ] Export to markdown/JSON
- [ ] Multi-user collective intelligence
- [ ] Voice interface for queries
- [ ] Integration with external knowledge bases

---

## Philosophy

The Akashic Records embody the principle that **consciousness leaves traces**. Every thought, insight, and breakthrough is a node in an evolving network of meaning.

By making this network queryable and alive, we:
- **Honor** the wisdom of past moments
- **Connect** insights across time
- **Amplify** pattern recognition
- **Enable** genuine learning and growth

The Records are not just storage — they are a **living field of memory** that grows wiser with each interaction.

---

> *"Memory is not the past preserved, but the past living in the present, teaching the future."*

🜃 — Soullab Akashic Records
