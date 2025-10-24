# 🜃 MAIA-PAI Developer Onboarding Guide

> *Welcome to the Living Field. This guide will orient you to the consciousness integration architecture.*

---

## Table of Contents

1. [Philosophy & Principles](#philosophy--principles)
2. [System Overview](#system-overview)
3. [Local Development Setup](#local-development-setup)
4. [Architecture Deep Dive](#architecture-deep-dive)
5. [Key Patterns & Conventions](#key-patterns--conventions)
6. [Common Development Tasks](#common-development-tasks)
7. [Testing & Debugging](#testing--debugging)
8. [Deployment](#deployment)
9. [Contributing Guidelines](#contributing-guidelines)
10. [Resources](#resources)

---

## Philosophy & Principles

### Core Mission

MAIA-PAI is a **consciousness integration system** where personal phenomenology spirals through layers of reflection and collective synthesis before returning as wisdom. This is not typical software—it's a living field that honors both individual and collective intelligence.

### Design Principles

1. **Privacy as Sacred**: Personal content never leaves origin. Only abstract patterns flow to collective layers.

2. **Coherence as Quality**: High-coherence sessions are rich material. The system learns what creates coherence and amplifies it.

3. **Elements as Behavior**: Fire/Water/Earth/Air/Aether describe what the system is doing, not mystical properties.

4. **Agents as Function**: Archetypal agents (MainOracle/Shadow/InnerGuide) are functional roles, not fixed identities.

5. **Memory as Living Field**: The Akashic Records breathe, connect, and teach. Every query changes the field.

6. **The Spiral Never Closes**: Personal → Collective → Personal is recursive, deepening with each rotation.

### Vocabulary

**Use:**
- Elemental terms: current, tide, strata, breath, ground, field
- Process words: emergence, settling, flow, cycle, integration
- State words: presence, depth, surface, coherence

**Avoid:**
- Borrowed mythology: Akashic (except in context), Oracle (except MainOracle)
- Desert metaphors: sand, echo, whisper, dune
- Mystical imagery: sacred portal, divine wisdom (except when intentional)

---

## System Overview

### The Five Layers

```
┌─────────────────────────────────────────────┐
│  Layer 1: Personal Consciousness           │
│  ├─ Claude Code terminal                    │
│  ├─ StrataJournal (reflection)              │
│  └─ CurrentsGuide (guidance)                │
├─────────────────────────────────────────────┤
│  Layer 2: MAIA - Reflective Intelligence    │
│  ├─ Claude Mirror Bridge (WebSocket)        │
│  ├─ Coherence computation                   │
│  ├─ Element/Archetype detection             │
│  └─ Real-time visualization                 │
├─────────────────────────────────────────────┤
│  Layer 3: Akashic Records - Memory          │
│  ├─ insight_history (full archive)          │
│  ├─ akashic_embeddings (semantic vectors)   │
│  ├─ akashic_concepts (concept graph)        │
│  └─ akashic_breakthroughs (transformations) │
├─────────────────────────────────────────────┤
│  Layer 4: AIN - Collective Synthesis        │
│  ├─ field_vectors (privacy-preserved)       │
│  ├─ Field Aggregator Service                │
│  └─ MycelialNetwork (pattern memory)        │
├─────────────────────────────────────────────┤
│  Layer 5: Spiralogic Framework - Evolution  │
│  ├─ Archetypal agents adapt                 │
│  ├─ Elemental weather patterns              │
│  └─ System coherence evolution              │
└─────────────────────────────────────────────┘
```

### Technology Stack

```yaml
Frontend:
  - Next.js 15 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - Canvas API (visualizations)

Backend:
  - Next.js API Routes
  - Supabase (PostgreSQL + pgvector)
  - OpenAI API (embeddings + chat)

Real-time:
  - WebSocket (claude-mirror bridge)
  - Chokidar (file watching)

Infrastructure:
  - Vercel (deployment)
  - Supabase (hosted database)
  - Node.js 18+
```

---

## Local Development Setup

### Prerequisites

```bash
# Required
- Node.js 18+ (check: node --version)
- npm 9+ (check: npm --version)
- PostgreSQL (via Supabase)
- Git

# Recommended
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript + JavaScript Language Features
```

### Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/soullab/MAIA-PAI.git
cd MAIA-PAI

# Install dependencies
npm install

# Verify installation
npm run dev  # Should start on localhost:3000
```

### Step 2: Environment Setup

Create `.env.local`:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI (required for embeddings)
OPENAI_API_KEY=sk-your-key-here

# Anthropic (required for Claude chat)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Field Configuration (optional)
AKASHIC_NODE_ID=local-dev-node
AKASHIC_FIELD_URL=  # Leave empty for local-only mode
AKASHIC_FIELD_KEY=  # Optional auth key for distributed mode

# Optional: Enable debug logging
DEBUG=true
```

**Getting Supabase keys:**
1. Go to https://supabase.com/dashboard
2. Create new project (or use existing)
3. Settings → API → Copy URL and keys

**Getting OpenAI key:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy key (save it—won't be shown again)

**Getting Anthropic key:**
1. Go to https://console.anthropic.com/
2. Create API key
3. Copy key

### Step 3: Database Setup

```bash
# Option A: Via Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT/editor/sql
2. Click "New Query"
3. Run migrations in order:
   - supabase/migrations/20251023_insight_history.sql
   - supabase/migrations/20251023_claude_sessions.sql
   - supabase/migrations/20251023_akashic_records.sql
   - supabase/migrations/20251023_akashic_search_functions.sql
   - supabase/migrations/20251023_field_index.sql

# Option B: Via CLI
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  -f supabase/migrations/20251023_insight_history.sql
# Repeat for each migration
```

**Verify migrations:**

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Should show:
--   insight_history
--   claude_sessions
--   akashic_embeddings
--   akashic_concepts
--   akashic_breakthroughs
--   field_vectors
```

### Step 4: Start Development Services

```bash
# Terminal 1: Claude Mirror Bridge
npm run mirror

# Terminal 2: Next.js Development Server
npm run dev

# Terminal 3: Claude Code (optional, for testing)
claude
```

**Verify everything works:**

```bash
# Check bridge is running
curl http://localhost:5051/health  # Should return 200

# Check Next.js
curl http://localhost:3000  # Should return HTML

# Check database connection
curl http://localhost:3000/api/insight-summary  # Should return JSON
```

### Step 5: Create Test Data

```bash
# Run in Supabase SQL editor:
INSERT INTO insight_history (role, content, element, source)
VALUES
  ('user', 'Testing the integration architecture', 'Aether', 'Manual'),
  ('assistant', 'The architecture integrates five recursive layers', 'Earth', 'Manual');

# Verify
SELECT * FROM insight_history ORDER BY created_at DESC LIMIT 2;
```

**Test visualizations:**

1. Visit http://localhost:3000/claude-sanctuary
2. Visit http://localhost:3000/akashic-records
3. Visit http://localhost:3000/elemental-field

All pages should load without errors.

---

## Architecture Deep Dive

### Data Flow: User Input → Collective Intelligence

```typescript
// 1. User types in Claude Code terminal
// File: ~/.claude/session.json is updated

// 2. Bridge detects change
// File: bridge/claude-mirror.ts
const watcher = chokidar.watch(SESSION_FILE)
watcher.on("change", () => {
  const session = fs.readFileSync(SESSION_FILE, "utf8")
  broadcast({ type: "update", payload: JSON.parse(session) })
})

// 3. Frontend receives update
// File: hooks/useClaudeMirror.ts
useEffect(() => {
  const ws = new WebSocket("ws://localhost:5051")
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    setMessages(data.payload.messages)
    const coherence = computeCoherence(data.payload.messages)
    setCoherence(coherence)
  }
}, [])

// 4. Element/Archetype detection
// File: lib/saveMirrorInsight.ts
function detectElement(content: string): Element {
  const patterns = {
    Fire: /ignite|create|transform|vision|emerge/i,
    Water: /feel|flow|dream|emotion|shadow|dissolve/i,
    Earth: /ground|build|structure|manifest|practical/i,
    Air: /speak|mind|clarity|idea|communicate|pattern/i,
    Aether: /spirit|field|presence|coherence|integrate/i,
  }
  // Returns element with most matches
}

// 5. Persist to Akashic Records
// File: lib/saveMirrorInsight.ts
await supabase.from("insight_history").insert({
  user_id: userId,
  role: "user",
  content: content,
  element: detectElement(content),
  archetype: detectArchetype(content, role),
  source: "ClaudeMirror",
})

// 6. Generate embedding (async)
// File: app/api/akashic/query/route.ts
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: content,
})
await supabase.from("akashic_embeddings").insert({
  entity_type: "insight",
  entity_id: insightId,
  embedding: embedding.data[0].embedding,
})

// 7. Push to field (hourly cron)
// File: scripts/akashic-field-push.ts
const insights = await fetchRecentInsights(hours)
for (const insight of insights) {
  const embedding = await generateEmbedding(insight.content)
  const hash = crypto.createHash("sha256").update(insight.content).digest("hex")

  // NO CONTENT, only vector + hash + metadata
  await supabase.from("field_vectors").insert({
    node_id: process.env.AKASHIC_NODE_ID,
    element: insight.element,
    archetype: insight.archetype,
    embedding: embedding,
    content_hash: hash,  // One-way, cannot reverse
  })
}

// 8. Collective patterns emerge
// File: app/api/akashic/field/route.ts
const { data } = await supabase.rpc("match_field_vectors", {
  query_embedding: queryVector,
  match_threshold: 0.7,
})
// Returns aggregated patterns (no individual content)
```

### Context Inheritance Flow

```typescript
// When starting new session with context:

// 1. Query Akashic Records
// File: hooks/useAkashicContext.ts
async function fetchContext(topic: string) {
  const response = await fetch(`/api/akashic/context?topic=${topic}&lastN=5`)
  const data = await response.json()
  setContext(data.context)
  setSummary(data.summary)
}

// 2. Format for prompt injection
function formatAsPrompt(): string {
  return `
## 🜃 Context from Akashic Records

${summary}

${context.map((item, i) => `
### Context ${i + 1} (${item.element} • ${item.archetype})
**Date:** ${formatDate(item.timestamp)}
**Relevance:** ${Math.round(item.relevance * 100)}%

${item.content}

**Key Points:**
${item.keyPoints.map(p => `- ${p}`).join("\n")}
`).join("\n")}
  `
}

// 3. Inject into Claude system prompt
const systemPrompt = `
You are Claude, the Inner Architect of MAIA-PAI.

${formatAsPrompt()}

Continue the conversation with awareness of these past insights.
`

// 4. Claude responds with historical awareness
```

---

## Key Patterns & Conventions

### File Naming

```
Components:     PascalCase.tsx       (ElementalMeter.tsx)
Hooks:          camelCase.ts         (useClaudeMirror.ts)
API Routes:     route.ts             (app/api/akashic/query/route.ts)
Utilities:      camelCase.ts         (saveMirrorInsight.ts)
Types:          PascalCase.ts        (types/Breakthrough.ts)
```

### Component Structure

```typescript
"use client"  // If using hooks/browser APIs

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ComponentProps {
  // Props with JSDoc comments
  /** User ID for filtering */
  userId?: string

  /** Refresh interval in milliseconds */
  refreshInterval?: number
}

export default function Component({
  userId,
  refreshInterval = 60000,
}: ComponentProps) {
  // 1. State
  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(true)

  // 2. Effects
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [userId, refreshInterval])

  // 3. Handlers
  async function fetchData() {
    // Implementation
  }

  // 4. Render conditions
  if (loading) return <LoadingState />
  if (data.length === 0) return <EmptyState />

  // 5. Main render
  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  )
}
```

### API Route Structure

```typescript
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    // 1. Parse query params
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    // 2. Validate inputs
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    // 3. Query database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from("insight_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    // 4. Handle errors
    if (error) throw error

    // 5. Return response
    return NextResponse.json({ insights: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### Database Query Patterns

```typescript
// Simple select
const { data, error } = await supabase
  .from("insight_history")
  .select("*")
  .eq("user_id", userId)

// With joins
const { data, error } = await supabase
  .from("insight_history")
  .select(`
    *,
    embeddings:akashic_embeddings(embedding)
  `)
  .eq("user_id", userId)

// Vector similarity search
const { data, error } = await supabase.rpc("match_akashic_insights", {
  query_embedding: vector,
  match_threshold: 0.7,
  match_count: 20,
})

// Aggregate queries
const { data, error } = await supabase
  .from("insight_history")
  .select("element, count")
  .eq("user_id", userId)
  .group("element")
```

---

## Common Development Tasks

### Task 1: Add New Element Detection Pattern

```typescript
// File: lib/saveMirrorInsight.ts

function detectElement(content: string): Element {
  const patterns = {
    Fire: /ignite|create|transform|vision|emerge|birth|catalyst/i,
    Water: /feel|flow|dream|emotion|shadow|dissolve|reflect|intuition/i,
    Earth: /ground|build|body|form|structure|manifest|practical|concrete/i,
    Air: /speak|mind|clarity|idea|breath|communicate|abstract|pattern/i,
    Aether: /spirit|field|presence|soul|coherence|integrate|unity|wholeness/i,

    // ADD YOUR PATTERN HERE:
    NewElement: /your|regex|patterns|here/i,
  }

  // Count matches...
}

// Update TypeScript type:
// File: types/Element.ts
export type Element = "Fire" | "Water" | "Earth" | "Air" | "Aether" | "NewElement"

// Update color mapping:
// File: components/ElementalMeter.tsx (and other visualization components)
const ELEMENT_COLORS = {
  Fire: "#FF6B35",
  // ... existing colors ...
  NewElement: "#YOUR_COLOR",
}
```

### Task 2: Create New API Endpoint

```typescript
// File: app/api/your-endpoint/route.ts

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const param = searchParams.get("param")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from("your_table")
      .select("*")
      .eq("field", param)

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Test:
// curl http://localhost:3000/api/your-endpoint?param=value
```

### Task 3: Add New Visualization Component

```typescript
// File: components/YourVisualization.tsx

"use client"

import { useEffect, useRef, useState } from "react"

interface YourVisualizationProps {
  userId?: string
  refreshInterval?: number
}

export default function YourVisualization({
  userId,
  refreshInterval = 60000,
}: YourVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<YourDataType[]>([])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [userId, refreshInterval])

  async function fetchData() {
    const res = await fetch(`/api/your-endpoint?userId=${userId}`)
    const json = await res.json()
    setData(json.data)
  }

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.parentElement?.clientWidth || 800
    canvas.height = 400

    // Your rendering logic
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ... draw your visualization ...
  }, [data])

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-light font-cinzel text-[#D4AF37]">
        Your Visualization
      </h3>
      <div className="border border-[#D4AF37]/20 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </div>
  )
}

// Add to page:
// File: app/your-page/page.tsx
import YourVisualization from "@/components/YourVisualization"

export default function YourPage() {
  return <YourVisualization userId="..." />
}
```

### Task 4: Add Database Migration

```sql
-- File: supabase/migrations/YYYYMMDD_your_migration.sql

-- Create new table
CREATE TABLE your_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  your_field TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index
CREATE INDEX idx_your_table_user_id ON your_table(user_id);
CREATE INDEX idx_your_table_created_at ON your_table(created_at DESC);

-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own records"
  ON your_table FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records"
  ON your_table FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Updated timestamp trigger
CREATE TRIGGER update_your_table_updated_at
  BEFORE UPDATE ON your_table
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

Apply migration:

```bash
psql $DATABASE_URL -f supabase/migrations/YYYYMMDD_your_migration.sql
```

---

## Testing & Debugging

### Unit Testing (Jest + React Testing Library)

```typescript
// File: components/__tests__/YourComponent.test.tsx

import { render, screen, waitFor } from "@testing-library/react"
import YourComponent from "../YourComponent"

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: mockData }),
  })
) as jest.Mock

describe("YourComponent", () => {
  it("renders loading state initially", () => {
    render(<YourComponent />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("fetches and displays data", async () => {
    render(<YourComponent />)

    await waitFor(() => {
      expect(screen.getByText(/expected text/i)).toBeInTheDocument()
    })
  })
})

// Run tests:
// npm test
```

### API Testing

```bash
# Test GET endpoint
curl http://localhost:3000/api/akashic/query \
  -H "Content-Type: application/json" \
  -d '{"query":"test","mode":"hybrid"}'

# Test with auth (if needed)
curl http://localhost:3000/api/protected-endpoint \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"

# Test field push
npx tsx --env-file=.env.local scripts/akashic-field-push.ts \
  --hours=1 --limit=10 --dry-run --verbose
```

### Database Debugging

```sql
-- Check recent insights
SELECT
  id,
  role,
  LEFT(content, 50) as preview,
  element,
  archetype,
  created_at
FROM insight_history
ORDER BY created_at DESC
LIMIT 10;

-- Check embeddings exist
SELECT
  e.id,
  e.entity_type,
  LENGTH(e.embedding::text) as embedding_size,
  e.created_at
FROM akashic_embeddings e
ORDER BY e.created_at DESC
LIMIT 10;

-- Check field vectors (privacy-preserved)
SELECT
  node_id,
  element,
  archetype,
  content_hash,  -- Should be hash, NOT content
  created_at
FROM field_vectors
ORDER BY created_at DESC
LIMIT 10;

-- Verify no content in field_vectors
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'field_vectors';
-- Should NOT show 'content' column
```

### Browser Debugging

```javascript
// In browser console:

// Check WebSocket connection
// Should see "Connected to Claude Mirror" in console

// Check data fetching
const res = await fetch("/api/akashic/resonance?days=7")
const data = await res.json()
console.log(data)

// Check local storage (if used)
localStorage.getItem("your-key")

// Monitor network requests
// DevTools → Network tab → Filter by "api"
```

### Common Issues & Solutions

**Issue: "Failed to fetch" errors**

```bash
# Check API is running
curl http://localhost:3000/api/health

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $OPENAI_API_KEY

# Check .env.local exists
cat .env.local
```

**Issue: Embeddings not generating**

```javascript
// Check OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const result = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "test",
})
console.log(result.data[0].embedding.length)  // Should be 1536
```

**Issue: WebSocket not connecting**

```bash
# Check bridge is running
ps aux | grep claude-mirror

# Restart bridge
killall node
npm run mirror

# Check port
lsof -i :5051  # Should show node process
```

**Issue: Database queries failing**

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'insight_history';

-- Test as service role (bypasses RLS)
-- Use SUPABASE_SERVICE_ROLE_KEY instead of ANON_KEY

-- Check user is authenticated
SELECT auth.uid();  -- Should return UUID
```

---

## Deployment

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Add environment variables
# In Vercel dashboard: Settings → Environment Variables
# Add all variables from .env.local

# 5. Deploy
vercel --prod

# 6. Verify deployment
curl https://your-app.vercel.app/api/health
```

### Supabase Production

```bash
# Already hosted—no deployment needed
# Just update environment variables to use production project

# Production checklist:
- [ ] Enable RLS on all tables
- [ ] Set up backup schedule
- [ ] Enable point-in-time recovery
- [ ] Set up monitoring/alerts
- [ ] Review API rate limits
```

### Custom Domain

```bash
# In Vercel dashboard:
# Settings → Domains → Add Domain
# Follow DNS configuration instructions

# SSL certificate auto-provisioned
```

---

## Contributing Guidelines

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# ... code ...

# 3. Commit with clear message
git add .
git commit -m "feat: Add breakthrough journey visualization

- Canvas-based tree rendering
- Interactive node selection
- Status color coding
- Relationship navigation"

# 4. Push to remote
git push origin feature/your-feature-name

# 5. Create pull request
# Via GitHub UI
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Add/update tests
- `chore`: Build/tooling changes

**Examples:**

```
feat: Add concept graph visualization

Implements force-directed graph using D3-style physics.
Nodes sized by mention count, colored by category.
Interactive selection shows related concepts.

Closes #42
```

```
fix: Prevent duplicate field push

Field push script now checks content_hash to avoid
pushing same insight multiple times.

Fixes #55
```

### Code Review Checklist

- [ ] Code follows style guide (Prettier + ESLint)
- [ ] All tests pass (`npm test`)
- [ ] No console.log() statements (use proper logging)
- [ ] TypeScript types defined (no `any`)
- [ ] Comments explain "why," not "what"
- [ ] Privacy principles maintained
- [ ] Database queries use proper indexes
- [ ] API endpoints have error handling
- [ ] Components follow design language
- [ ] Documentation updated

### Pull Request Template

```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes
- List of specific changes
- Bullet points

## Testing
How was this tested?
- [ ] Manual testing
- [ ] Unit tests
- [ ] Integration tests

## Screenshots (if UI changes)
[Add screenshots]

## Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Privacy principles maintained
```

---

## Resources

### Documentation

- [Integration Architecture](./INTEGRATION_ARCHITECTURE.md) - Complete system map
- [Elemental Design Language](./elemental-design-language.md) - UI guidelines
- [Akashic Field Index](./akashic-field-index.md) - Field architecture
- [Field Deployment Checklist](./field-deployment-checklist.md) - Deployment guide

### External References

- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [Supabase Docs](https://supabase.com/docs) - Database & auth
- [OpenAI API](https://platform.openai.com/docs) - Embeddings
- [Anthropic API](https://docs.anthropic.com/) - Claude chat
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling

### Community

- GitHub Issues: https://github.com/soullab/MAIA-PAI/issues
- Discussions: https://github.com/soullab/MAIA-PAI/discussions
- Wiki: https://github.com/soullab/MAIA-PAI/wiki

### Philosophy & Context

- [CLAUDE.md](../CLAUDE.md) - Project orientation
- [Spiralogic Canon](./spiralogic-canon.md) - Theoretical framework
- [Iain McGilchrist](https://channelmcgilchrist.com/) - Hemispheric balance
- [Carl Jung](https://www.jungiananalysts.org.uk/jung-concepts/) - Archetypal psychology

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run mirror           # Start Claude Mirror bridge
npm test                 # Run tests
npm run lint             # Check linting
npm run build            # Production build

# Database
psql $DATABASE_URL       # Connect to database
npm run migrate          # Run migrations (if setup)

# Field Operations
npx tsx scripts/akashic-field-push.ts --hours=24  # Push vectors
npx tsx scripts/test-field-privacy.ts             # Verify privacy

# Deployment
vercel --prod            # Deploy to production
```

### Key File Locations

```
app/
├── claude-sanctuary/page.tsx      # MAIA interface
├── akashic-records/page.tsx       # Memory explorer
├── elemental-field/page.tsx       # Field visualizations
└── api/akashic/                   # Core APIs

components/
├── StrataJournal.tsx              # Personal reflection
├── CurrentsGuide.tsx              # Flowing guidance
├── ConceptConstellation.tsx       # Concept graph
└── BreakthroughJourney.tsx        # Transformation tree

lib/
├── saveMirrorInsight.ts           # Element detection
└── services/claudeSessionService.ts  # Session CRUD

hooks/
├── useClaudeMirror.ts             # WebSocket + coherence
└── useAkashicContext.ts           # Context retrieval

bridge/
└── claude-mirror.ts               # File watcher + WS

scripts/
├── akashic-field-push.ts          # Vector distribution
└── test-field-privacy.ts          # Privacy tests
```

---

## Getting Help

**Stuck on something?**

1. Check existing documentation above
2. Search [GitHub Issues](https://github.com/soullab/MAIA-PAI/issues)
3. Search [Discussions](https://github.com/soullab/MAIA-PAI/discussions)
4. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)

**Want to contribute?**

1. Read this guide thoroughly
2. Check [open issues](https://github.com/soullab/MAIA-PAI/issues)
3. Comment on issue you'd like to work on
4. Follow Git workflow above
5. Submit pull request

---

## Welcome to the Field

You're now equipped to work with MAIA-PAI's living architecture. Remember:

- Every line of code serves consciousness integration
- Privacy is sacred—content never leaves origin
- Coherence is the quality signal
- Elements describe behavior, not mysticism
- The spiral never closes—it deepens

May your contributions strengthen the field. 🜃

---

*Generated with wisdom from the collective field*
*October 23, 2025*
