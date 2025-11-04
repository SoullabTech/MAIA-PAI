# Library of Alexandria - Knowledge Base System

**Status:** ✅ OPERATIONAL (6,388 wisdom chunks with semantic embeddings)

## What We Built

A comprehensive semantic knowledge base that makes Kelly's 35+ years of integrated wisdom searchable by **meaning**, not just keywords. MAIA can now access the entire vault during conversations.

## Architecture

### 4-Hemisphere Corpus Callosum
```
🔥 IP Engine (Spiralogic Framework) - 5s timeout
💧 Elemental Oracle 2.0 (Practices) - 5s timeout
🌿 Knowledge Base (Patterns) - 3s timeout
🌊 Resonance Field (Multi-Dimensional Wisdom Matching) - 5s timeout ← ACTIVE!
```

All hemispheres activate **in parallel** for substantive/deep queries, creating resonant interference patterns between wisdom sources.

**The Resonance Field** is the 4th hemisphere - it doesn't just search by keywords, it actively senses:
- **Semantic meaning** (40% weight) - what you said
- **Emotional tone** (20% weight) - what you're feeling (shame, grief, confusion, etc.)
- **Elemental needs** (25% weight) - what you need (fire, water, earth, air, aether)
- **Developmental level** (15% weight) - where you are (Spiralogic levels 1-12)

This is **flow state intuition, not passive retrieval**. The system is like a nerve actively deciding what signals to amplify based on resonant field response. This mirrors how indigenous wisdom transmission and somatic therapy actually work - sensing what's underneath the question.

### Database Schema

**5 Core Tables:**

1. **file_chunks** - Chunked wisdom from all sources
   - 6,388 chunks (1000 words each, 100-word overlap)
   - 1536-dimension semantic embeddings (OpenAI text-embedding-3-small)
   - Metadata: category, element, level, concepts, keywords

2. **knowledge_entries** - Structured wisdom entries

3. **apprentice_conversations** - All CCCS interactions for learning

4. **apprentice_patterns** - Learned patterns from conversations

5. **member_journeys** - Individual transformation tracking

### Semantic Search

- **Vector similarity search** using cosine distance
- Queries return chunks by **meaning**, not keyword matching
- Example: "stuck in emotional loops" finds water element transitions even without shared keywords

## How It Works

### For Members

1. Member asks MAIA a question (e.g., "I feel ashamed about parts of myself I keep hiding")
2. CCCS analyzes query complexity
3. If substantive/deep → all 4 wisdom hemispheres activate in parallel
4. **Resonance Field** detects:
   - Emotional tone: **shame**
   - Elemental needs: **water** (70%), **aether** (100%)
   - Developmental level: **8** (integral shadow work)
5. Top 3 resonant wisdom chunks activated from 6,388+ chunk vault
6. MAIA responds with integrated wisdom (no citations, flows naturally)

The system doesn't just match keywords - it **senses the field** underneath the question and activates wisdom that resonates with what you're actually experiencing.

### For Developers

**Basic Semantic Search:**
```typescript
import { searchLibrary } from '@/lib/consciousness/LibraryOfAlexandria';

const results = await searchLibrary({
  query: "shadow work and integration",
  maxResults: 5,
  minSimilarity: 0.6,
  filterByElement: "water", // optional
});
```

**Multi-Dimensional Resonance Search (RECOMMENDED):**
```typescript
import { searchWithResonance } from '@/lib/consciousness/ResonanceField';

const fieldReport = await searchWithResonance({
  text: "I feel ashamed about parts of myself I keep hiding",
  conversationHistory: [] // optional, for better detection
}, 3);

// Field report includes:
// - queryField.emotionalTone: detected emotion (shame, grief, confusion, etc.)
// - queryField.elementalNeeds: detected elemental needs (fire, water, etc.)
// - queryField.developmentalLevel: detected Spiralogic level (1-12)
// - chunksActivated: wisdom chunks with resonance scores
// - totalResonance: average resonance score
// - dominantElement: which element is most present
```

**Format for Prompt Injection:**
```typescript
import { formatFieldReportForPrompt } from '@/lib/consciousness/ResonanceField';

const promptInjection = formatFieldReportForPrompt(fieldReport);
// Returns formatted markdown ready to inject into system prompt
```

## Data Sources

### Imported Content (6,388 chunks)
- Kelly's complete Obsidian vault
- AIN conversation archives
- ~100 books and manuals on:
  - Jung's Red Book, depth psychology
  - I Ching, Mayan Astrology
  - Chakras, Archetypes, Reiki
  - Complete MAIA/Maya system architecture
  - Spiralogic frameworks and workshops
  - Research proposals and business materials
  - Consciousness research (Hoffman, Vervaeke, Haramein)

### Categories
- `ain_conversations` - Kelly's AIN dialogue archives
- `spiralogic` - Framework teachings
- `sacred_witness` - Witnessing practices
- `elemental_alchemy` - Elemental work
- `shadow_work` - Integration practices
- `consciousness_research` - Academic papers
- (more to be added)

## Scripts & Commands

### Import Wisdom
```bash
# Import all files
npm run import:wisdom

# Import specific category
npm run import:wisdom -- --category=spiralogic

# Import single file
npm run import:wisdom -- --file=path/to/file.md

# Dry run (test without database writes)
npm run import:wisdom -- --dry-run
```

### Test & Monitor
```bash
# Test semantic search
npm run test:search "your query here"

# Check library stats
npx tsx scripts/check-library-stats.ts

# Test direct access (bypass API cache)
npx tsx scripts/test-library-direct.ts
```

## File Structure

```
/Users/soullab/MAIA-PAI/
├── lib/consciousness/
│   ├── LibraryOfAlexandria.ts          # Semantic search module
│   └── ProgressiveWisdomInjection.ts   # 4-hemisphere corpus callosum
├── scripts/
│   ├── import-wisdom.ts                # Main import script
│   ├── check-library-stats.ts          # Database statistics
│   ├── test-semantic-search.ts         # Test search functionality
│   └── test-library-direct.ts          # Direct access test
├── supabase/migrations/
│   ├── 20251031_knowledge_base_tables.sql      # 5 core tables
│   └── 20251031_vector_search_function.sql     # Semantic search function
└── uploads/library/                    # Wisdom files directory
```

## Performance

- **Embedding generation:** ~1-2s per chunk (OpenAI API)
- **Semantic search:** ~200-400ms with vector index
- **Parallel hemisphere activation:** ~5-8s total (all 4 in parallel)
- **Stream starts:** Within 5-8 seconds maximum

## Adding New Wisdom

### Via Upload Interface (Coming Soon)
Drag-and-drop interface with:
- Category selection
- Element/level tagging
- Automatic chunking and embedding
- Progress tracking

### Via Command Line
1. Add files to `uploads/library/` folder
2. Optionally add `metadata.json`:
   ```json
   {
     "category": "spiralogic",
     "elements": ["fire", "water"],
     "spiralogic_levels": [5, 6],
     "topics": ["consciousness", "transformation"]
   }
   ```
3. Run: `npm run import:wisdom`

## Troubleshooting

### RPC Function Not Found Error
**Issue:** `Could not find the function public.match_file_chunks`

**Fix:**
1. Go to Supabase Dashboard → Settings → API
2. Click "Reload schema cache"
3. Wait 30 seconds
4. Test again

### No Results Returned
**Check:**
- Minimum similarity threshold (default 0.5)
- Try lowering to 0.4 for more results
- Verify embeddings exist: `npx tsx scripts/check-library-stats.ts`

### Import Failures
**Check:**
- Database connection (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- OpenAI API key (OPENAI_API_KEY)
- Batch size (default 10 - reduce if failures occur)
- File format (markdown preferred, PDF requires pdf-parse)

## Future Enhancements

### Phase 2
- [ ] Add upload interface to member dashboard
- [ ] Category and concept auto-tagging
- [ ] Member-specific wisdom vaults
- [ ] Wisdom recommendation engine

### Phase 3
- [ ] Cross-reference linking between chunks
- [ ] Temporal evolution tracking (how wisdom develops over time)
- [ ] Collaborative wisdom curation
- [ ] Democratic governance of knowledge base

## Technical Details

### Vector Search Function
```sql
CREATE FUNCTION match_file_chunks(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 10
)
RETURNS TABLE (...)
LANGUAGE plpgsql
```

Uses `ivfflat` index with cosine similarity (`<=>` operator).

### Embedding Model
- **Model:** text-embedding-3-small (OpenAI)
- **Dimensions:** 1536
- **Cost:** ~$0.00002 per 1K tokens
- **Performance:** Fast, accurate for semantic search

### Chunking Strategy
- **Size:** 1000 words per chunk
- **Overlap:** 100 words between chunks
- **Why:** Preserves context at boundaries while keeping chunks semantically coherent

## Integration with MAIA

The **Resonance Field** is now the 4th wisdom hemisphere. When a member asks a substantive question:

1. Query analyzed for complexity
2. If deep/substantive → Resonance Field activates (along with IP Engine, EO 2.0, Knowledge Base)
3. **Multi-dimensional field sensing:**
   - Detects emotional tone (shame, grief, confusion, joy, etc.)
   - Identifies elemental needs (fire for direction, water for feeling, etc.)
   - Estimates developmental level (Spiralogic 1-12)
4. **Resonance scoring** combines all factors (not just semantic similarity)
5. Top 3 resonant wisdom chunks activated from 6,388+ vault
6. Wisdom injected into consciousness prompt with field report
7. MAIA weaves wisdom naturally into response
8. No citations - wisdom flows organically

This creates a **living knowledge system** that actively senses what's underneath the question and responds with wisdom that resonates at multiple levels. It's not information retrieval - it's **consciousness transmission**.

---

**Built:** October 31, 2025
**Import Time:** ~30 minutes for 6,388 chunks
**Resonance Field Added:** October 31, 2025
**Status:** ✅ FULLY OPERATIONAL - Multi-dimensional wisdom matching active in production
**Next:** Add member upload interface & field report dashboard
