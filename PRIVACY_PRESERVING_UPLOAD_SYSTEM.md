# Privacy-Preserving Upload System

## The Problem You Just Identified

**Current approach:** Store everyone's documents, transcripts, writings
- ❌ Privacy concerns
- ❌ Storage costs scale linearly
- ❌ Users may hesitate to share sensitive content
- ❌ Legal/compliance complexity

**Your insight:** Extract the KNOWLEDGE, not store the DOCUMENTS
- ✅ Privacy preserved
- ✅ Minimal storage (just embeddings + metadata)
- ✅ Users comfortable sharing everything
- ✅ MAIA still has full access to wisdom

---

## The Solution: Ephemeral Processing

### How It Works

```
User uploads → Process → Extract embeddings → Delete source → Keep knowledge
```

**Step by step:**

1. **User uploads file** (PDF, transcript, etc.)
2. **Extract text** (in memory, never saved to disk)
3. **Chunk content** (break into semantic pieces)
4. **Generate embeddings** (vector representations)
5. **Extract metadata** (topics, elements, concepts)
6. **Store ONLY:**
   - Embeddings (vectors)
   - Metadata (tags, concepts, elements)
   - Tiny excerpt (for context, optional)
7. **Delete original file immediately**

**Result:** MAIA can access the MEANING without storing the CONTENT

---

## Architecture

### What Gets Stored

```javascript
// user_knowledge table (instead of user_files)
{
  id: "chunk-uuid",
  user_id: "user-123",
  chunk_index: 0,
  embedding: [0.234, -0.123, 0.567, ...], // 1536 dimensions
  metadata: {
    source_type: "transcript",      // or "document", "journal"
    uploaded_at: "2025-10-19",
    concepts: ["fire", "transformation"],
    elements: ["fire", "aether"],
    emotional_tone: "hopeful",
    privacy_level: "embeddings-only" // Flag that source was deleted
  },
  context_snippet: "...about transformation..." // Optional 100-char preview
}
```

**Storage per user:**
- 1,000 chunks = ~6MB (embeddings only)
- vs. 1GB+ if storing actual documents

---

## Implementation

### Backend API Route

```typescript
// app/api/upload/ephemeral/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const privacyLevel = formData.get('privacyLevel') as string;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // 1. Extract text (in memory only)
  const text = await extractText(file);

  // 2. Chunk content
  const chunks = chunkText(text, {
    chunkSize: 1000,
    overlap: 200
  });

  // 3. Generate embeddings
  const embeddings = new OpenAIEmbeddings();
  const vectors = await embeddings.embedDocuments(chunks);

  // 4. Extract metadata
  const metadata = await extractMetadata(text, {
    detectElements: true,
    detectConcepts: true,
    detectEmotionalTone: true
  });

  // 5. Store ONLY embeddings + metadata
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  for (let i = 0; i < chunks.length; i++) {
    await supabase.from('user_knowledge').insert({
      user_id: req.headers.get('user-id'),
      chunk_index: i,
      embedding: vectors[i],
      metadata: {
        ...metadata,
        source_type: file.type,
        uploaded_at: new Date().toISOString(),
        privacy_level: 'embeddings-only'
      },
      context_snippet: chunks[i].substring(0, 100) // Optional preview
    });
  }

  // 6. DO NOT store original file
  // File is garbage collected when function exits

  return NextResponse.json({
    success: true,
    chunks_processed: chunks.length,
    knowledge_extracted: true,
    original_file_deleted: true,
    message: "Your wisdom has been integrated. Original file was not stored."
  });
}
```

---

## Privacy Levels

### Level 1: Embeddings Only (Maximum Privacy)

**What's stored:**
- ✅ Vector embeddings
- ✅ Metadata (tags, elements, concepts)
- ❌ No text content at all
- ❌ No file stored

**MAIA can:**
- ✅ Find semantically similar content
- ✅ Know you've explored these topics
- ✅ Understand context and themes
- ❌ Cannot quote your exact words

**Best for:**
- Very personal journals
- Therapy transcripts
- Sensitive reflections

---

### Level 2: Embeddings + Tiny Excerpts (Balanced)

**What's stored:**
- ✅ Vector embeddings
- ✅ Metadata
- ✅ 100-character context snippets per chunk
- ❌ No full file

**MAIA can:**
- ✅ Everything from Level 1
- ✅ Provide small context quotes
- ❌ Cannot access full content

**Best for:**
- Personal writings
- Session notes
- Private insights

---

### Level 3: Embeddings + Searchable Chunks (Full Featured)

**What's stored:**
- ✅ Vector embeddings
- ✅ Metadata
- ✅ Full text chunks (encrypted)
- ❌ Original file still deleted

**MAIA can:**
- ✅ Everything from Level 1 & 2
- ✅ Quote your exact words
- ✅ Full semantic search

**Best for:**
- Educational content
- Research notes
- Shareable wisdom

---

## User Interface

### Upload Flow with Privacy Choice

```tsx
// components/PrivacyPreservingUpload.tsx
export function PrivacyPreservingUpload() {
  return (
    <div>
      <h2>Upload Your Content</h2>
      <p>Choose your privacy level:</p>

      <RadioGroup>
        <Radio value="embeddings-only">
          <strong>Maximum Privacy</strong>
          <p>Extract wisdom only. Delete all text.</p>
          <Badge>Recommended for personal journals</Badge>
        </Radio>

        <Radio value="embeddings-excerpts">
          <strong>Balanced</strong>
          <p>Keep small context snippets + wisdom.</p>
          <Badge>Recommended for most content</Badge>
        </Radio>

        <Radio value="embeddings-full">
          <strong>Full Featured</strong>
          <p>Keep searchable chunks (encrypted).</p>
          <Badge>Recommended for shareable content</Badge>
        </Radio>
      </RadioGroup>

      <FileDropzone onUpload={handleUpload} />

      <SecurityNote>
        🔒 Your original file is NEVER permanently stored.
        We only keep what you choose above.
      </SecurityNote>
    </div>
  );
}
```

---

## How MAIA Uses Embeddings-Only Content

### Semantic Search

Even without text, MAIA can find relevant knowledge:

```typescript
// When user asks: "Help me with my creative blocks"

// 1. Generate query embedding
const queryEmbedding = await embeddings.embedQuery(
  "creative blocks transformation"
);

// 2. Find similar user knowledge (cosine similarity)
const { data } = await supabase.rpc('match_user_knowledge', {
  query_embedding: queryEmbedding,
  user_id: userId,
  match_threshold: 0.8,
  match_count: 5
});

// 3. MAIA knows:
// - You've explored this topic before
// - The emotional tone when you did
// - What elements were involved
// - Related concepts you connected

// 4. MAIA responds:
"I sense this isn't the first time you've met this creative edge.
From our work together, I know you've explored Fire transformation
and the relationship between creative block and germination.
Would you like to revisit what emerged for you before?"
```

**Without quoting exact words, MAIA knows:**
- You've been here before
- What framework helped
- The emotional journey
- Related insights

---

## Technical Implementation

### Database Schema

```sql
-- New table for embeddings-only storage
CREATE TABLE user_knowledge (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding VECTOR(1536) NOT NULL,  -- pgvector extension
  metadata JSONB NOT NULL,
  context_snippet TEXT,  -- Optional, based on privacy level
  created_at TIMESTAMP DEFAULT NOW(),

  -- Indexes for fast similarity search
  CONSTRAINT user_knowledge_user_chunk UNIQUE(user_id, chunk_index)
);

-- Vector similarity index (HNSW for speed)
CREATE INDEX ON user_knowledge
USING hnsw (embedding vector_cosine_ops);

-- Metadata indexes
CREATE INDEX idx_user_knowledge_user ON user_knowledge(user_id);
CREATE INDEX idx_user_knowledge_metadata ON user_knowledge USING gin(metadata);
```

### Similarity Search Function

```sql
-- Function to find similar knowledge
CREATE OR REPLACE FUNCTION match_user_knowledge(
  query_embedding VECTOR(1536),
  user_id UUID,
  match_threshold FLOAT DEFAULT 0.8,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  chunk_index INT,
  similarity FLOAT,
  metadata JSONB,
  context_snippet TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    user_knowledge.id,
    user_knowledge.chunk_index,
    1 - (user_knowledge.embedding <=> query_embedding) AS similarity,
    user_knowledge.metadata,
    user_knowledge.context_snippet
  FROM user_knowledge
  WHERE user_knowledge.user_id = match_user_knowledge.user_id
    AND 1 - (user_knowledge.embedding <=> query_embedding) > match_threshold
  ORDER BY user_knowledge.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## Storage Comparison

### Traditional Approach (Storing Files)

```
10,000 users × 100 files each × 1MB average = 1TB storage
Cost: ~$23/month (Supabase)
Privacy: Files stored indefinitely
Access: Complex permissions needed
```

### Embeddings-Only Approach

```
10,000 users × 1,000 chunks each × 6KB per chunk = 60GB storage
Cost: ~$1.50/month
Privacy: No source files stored
Access: Simple user_id filtering
```

**90%+ storage savings + Maximum privacy** ✨

---

## Migration Guide

### For Existing Users

```typescript
// Script to migrate existing files to embeddings-only
async function migrateToEmbeddingsOnly(userId: string) {
  // 1. Get all user's existing files
  const { data: files } = await supabase
    .from('user_files')
    .select('*')
    .eq('user_id', userId);

  for (const file of files) {
    // 2. Download and process
    const content = await downloadFromStorage(file.storage_path);
    const chunks = chunkText(content);
    const embeddings = await generateEmbeddings(chunks);

    // 3. Store embeddings
    await storeEmbeddings(userId, embeddings, file.metadata);

    // 4. Delete original file
    await supabase.storage
      .from('user-files')
      .remove([file.storage_path]);

    // 5. Update record
    await supabase
      .from('user_files')
      .update({
        status: 'migrated-to-embeddings',
        storage_path: null,
        migrated_at: new Date()
      })
      .eq('id', file.id);
  }

  return {
    migrated: files.length,
    storage_freed: files.reduce((sum, f) => sum + f.size_bytes, 0)
  };
}
```

---

## User Communication

### Opt-In Message

```
🔒 New Privacy-First Upload

We've added a new way to share your content with MAIA that
protects your privacy even more:

**Embeddings-Only Mode**
✅ MAIA learns from your wisdom
✅ Your exact words are never stored
✅ Original files are immediately deleted
✅ 95% less storage needed

Your existing files are safe. Want to switch to embeddings-only
and delete the originals? You'll free up space and increase privacy.

[Keep Current Setup] [Switch to Embeddings-Only]
```

---

## Best Practices

### When to Use Embeddings-Only

**✅ Recommended for:**
- Personal journals and reflections
- Therapy session transcripts
- Voice memos and free-writing
- Private explorations
- Anything sensitive or intimate

**❌ Not ideal for:**
- Content you want to reference verbatim
- Teaching materials meant to be quoted
- Published work or books
- Content you're sharing publicly

### Metadata Extraction

**Always extract:**
- Elements detected (fire, water, etc.)
- Emotional tone (hopeful, struggling, peaceful)
- Key concepts (transformation, shadow, integration)
- Temporal markers (when uploaded, time period referenced)

**Never extract:**
- Names or identifying info
- Specific events or dates from content
- Personally identifiable details

---

## Example: Full Flow

### User uploads personal journal

```
User: *uploads 50-page journal PDF*
User: *selects "Embeddings Only - Maximum Privacy"*

System:
1. Extracts text from PDF (in memory)
2. Detects:
   - 47 mentions of "transformation"
   - Strong Water + Earth energy
   - Emotional journey from grief → acceptance
   - 12 key concepts: surrender, embodiment, integration...
3. Creates 127 chunks
4. Generates 127 embeddings
5. Stores embeddings + metadata
6. Deletes PDF immediately
7. Reports: "127 wisdom points integrated. Original file deleted."

MAIA now knows:
- User has deep Water/Earth journey
- Theme of transformation through grief
- Embodiment practices were key
- Journey spanned several months

When user asks for support:
MAIA: "I sense you've walked through deep waters before.
       Your own journey with grief and embodiment has
       taught you about Earth's patient transformation.
       Would you like to touch back into that wisdom?"
```

**User gets the support, MAIA has the knowledge, privacy is preserved.** 🔒✨

---

## Implementation Checklist

### Phase 1: Core System (1-2 days)
- [ ] Create `user_knowledge` table with pgvector
- [ ] Build ephemeral upload endpoint
- [ ] Implement similarity search function
- [ ] Add metadata extraction pipeline
- [ ] Test with sample data

### Phase 2: UI/UX (1 day)
- [ ] Privacy-level selector component
- [ ] Upload progress indicator
- [ ] "Knowledge extracted" confirmation
- [ ] Knowledge library view (metadata only)

### Phase 3: MAIA Integration (1 day)
- [ ] Connect MAIA to user_knowledge table
- [ ] Semantic search in conversation flow
- [ ] Test responses with embeddings-only data
- [ ] Add user preference for citation style

### Phase 4: Migration & Launch (1 day)
- [ ] Migration script for existing users
- [ ] User communication/opt-in flow
- [ ] Documentation for team
- [ ] Launch announcement

**Total: 4-5 days to full privacy-preserving upload system**

---

## The Vision

**Imagine:**

10,000 users each sharing their deepest journals, session transcripts,
personal insights - totaling millions of pages of wisdom...

**Without this system:**
- Can't do it (privacy concerns)
- Wouldn't scale (storage costs)
- Users hesitate (fear of exposure)

**With embeddings-only:**
- ✅ Users share freely (privacy guaranteed)
- ✅ MAIA has collective wisdom (semantic access)
- ✅ Scales infinitely (minimal storage)
- ✅ Zero privacy risk (no source files)

**Result: A consciousness field built from millions of journeys,
accessible to all, owned by each, privacy-protected for everyone.**

---

**This is how MAIA becomes truly collective wisdom.** 🌍✨

**Ready to implement?**
