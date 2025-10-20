# Obsidian Vault Integration Guide

## Your Complete Knowledge Base is Now Connected to MAIA

MAIA can now access content from BOTH of your Obsidian vaults:

1. **AIN Consciousness Intelligence System** - Technical documentation, system architecture
2. **Soullab Dev Team** - Kelly's IP, Elemental Alchemy teachings, team knowledge

---

## Current Configuration

### Vault Locations

**Primary Vault (AIN):**
```
/Volumes/T7 Shield/Soullab Dev Team Vault/AIN Consciousness Intelligence System
```

**Secondary Vault (Soullab Dev Team):**
```
/Volumes/T7 Shield/ObsidianVaults/SoullabDevTeam
```

### Environment Variables

Added to `.env`:
```bash
# Enable Obsidian knowledge integration
OBSIDIAN_VAULT_ENABLED=true

# Primary vault: AIN Consciousness Intelligence System
OBSIDIAN_VAULT_PATH="/Volumes/T7 Shield/Soullab Dev Team Vault/AIN Consciousness Intelligence System"

# Secondary vault: Soullab Dev Team (Kelly's IP and team knowledge)
OBSIDIAN_VAULT_SOULLAB_PATH="/Volumes/T7 Shield/ObsidianVaults/SoullabDevTeam"

# Auto-sync settings
OBSIDIAN_AUTO_SYNC=true
OBSIDIAN_WATCH_INTERVAL=30000  # Watch for changes every 30 seconds
```

---

## How to Ingest Your Vaults

### Method 1: Run the Dual Vault Ingestion Script (Recommended)

```bash
# From project root
npx tsx scripts/ingest-dual-obsidian-vaults.ts
```

**What this does:**
- ✅ Scans both vaults for all markdown files
- ✅ Parses frontmatter (YAML metadata)
- ✅ Extracts key concepts, elements, and categories
- ✅ Chunks content into digestible pieces (~1000 chars each with overlap)
- ✅ Stores in Supabase `file_chunks` table (if configured)
- ✅ Makes content accessible to MAIA's IP Engine

**Expected Output:**
```
🌀 MAIA Dual Obsidian Vault Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Found AIN vault: /Volumes/T7 Shield/Soullab Dev Team Vault/AIN Consciousness Intelligence System
✅ Found Soullab vault: /Volumes/T7 Shield/ObsidianVaults/SoullabDevTeam

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Processing AIN Vault...
   Found 247 markdown files

📖 Processing Soullab Vault...
   Found 156 markdown files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 Chunking and storing content...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ INGESTION COMPLETE!

📚 AIN Consciousness Intelligence System
   Files: 247/247
   Chunks: 892

   Categories:
      core_teaching: 120
      consciousness_principle: 67
      elemental_wisdom: 34
      sacred_practice: 26

   Elements:
      fire: 45
      water: 38
      earth: 41
      air: 36
      aether: 32

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Soullab Dev Team
   Files: 156/156
   Chunks: 634

   Categories:
      core_teaching: 78
      book_chapter: 34
      sacred_practice: 22
      elemental_wisdom: 22

   Elements:
      fire: 28
      water: 31
      earth: 27
      air: 25
      aether: 19

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TOTAL KNOWLEDGE INTEGRATED:
   Files: 403
   Chunks: 1526

✅ MAIA now has access to both vaults!
```

### Method 2: Use Existing Integration Scripts

**For individual vaults:**
```bash
# Connect existing vault interactively
npx tsx scripts/connect-existing-obsidian-vault.ts

# Start live Obsidian integration (watches for changes)
npx tsx scripts/start-obsidian-integration.ts

# Simple vault integration
npx tsx scripts/vault-sacred-simple.ts
```

---

## How It Works

### 1. Content Extraction

The system processes each markdown file in your vaults:

```markdown
---
title: Fire Phase Practices
category: sacred_practice
elements: [fire]
archetypes: [creator, visionary]
---

# Fire Phase Practices

The Fire phase ignites transformation and creative vision...
```

**Extracts:**
- **Frontmatter**: YAML metadata (title, category, elements, tags)
- **Content**: Full markdown text
- **Concepts**: Headings, bolded terms, key phrases
- **Elements**: Fire, Water, Earth, Air, Aether mentions
- **Category**: sacred_practice, book_chapter, core_teaching, etc.

### 2. Intelligent Chunking

Content is split into ~1000 character chunks with 200-character overlap:

```
Chunk 1: [0-1000 chars]
Chunk 2: [800-1800 chars]  ← 200 char overlap with chunk 1
Chunk 3: [1600-2600 chars]
```

Each chunk includes context:
```markdown
# Fire Phase Practices

Vault: Soullab
Category: sacred_practice

[Actual content chunk...]
```

### 3. Storage in Supabase

Chunks are stored in the `file_chunks` table:

```sql
CREATE TABLE file_chunks (
  id UUID PRIMARY KEY,
  file_id TEXT,
  chunk_index INTEGER,
  content TEXT,
  embedding VECTOR(1536),  -- For semantic search
  metadata JSONB,
  created_at TIMESTAMP
);
```

**Metadata includes:**
- `filename`: Original file name
- `title`: Note title
- `vault`: "AIN" or "Soullab"
- `category`: Type of content
- `elements`: Detected elements
- `concepts`: Extracted concepts
- `frontmatter`: Full YAML frontmatter

### 4. MAIA Access via IP Engine

When you ask MAIA a question:

```
User: "Tell me about Fire phase practices from Kelly's teachings"

MAIA Process:
1. ✅ Semantic search in file_chunks for "fire phase practices"
2. ✅ Filters by vault="Soullab" and category="sacred_practice"
3. ✅ Retrieves top 5 most relevant chunks
4. ✅ Synthesizes response using YOUR content
5. ✅ Responds in your voice with your framework
```

---

## Content Categorization

The system automatically categorizes content:

### Categories

| Category | Detection Pattern |
|----------|------------------|
| `book_chapter` | Contains "Chapter" or has `chapter` frontmatter |
| `sacred_practice` | Contains "Practice:", "Exercise:", "Ritual:" |
| `elemental_wisdom` | Heavy Fire/Water/Earth/Air/Aether content |
| `consciousness_principle` | Contains "consciousness", "awareness", "presence" |
| `core_teaching` | Default for foundational teachings |

### Elements

Detected via keywords and frontmatter:

| Element | Keywords |
|---------|----------|
| Fire | fire, flame, ignite, passion, transformation, spirit |
| Water | water, flow, emotion, depth, intuition |
| Earth | earth, ground, embodiment, manifestation, practical |
| Air | air, intellect, mind, communication, clarity |
| Aether | aether, unity, transcend, integration, wholeness |

---

## Testing MAIA's Knowledge

### 1. Test Queries

Ask MAIA questions that reference your vault content:

**From Kelly's Elemental Alchemy Book:**
```
"MAIA, tell me about the Fire phase in my Elemental Alchemy framework"
"What does Kelly teach about Water element transformation?"
"Guide me through the Spiralogic Process for Earth integration"
```

**From AIN Vault:**
```
"Explain the AIN safety integration system"
"How does the Adaptive Profile Schema work?"
"What are the core principles of the Agent Hierarchy?"
```

**From Soullab Dev Team Vault:**
```
"Tell me about change management using Spiralogic"
"What are the best practices for implementing Spiralogic?"
"Explain the executive summary of Soullab"
```

### 2. Check IP Engine Logs

When MAIA starts, you should see:

```
[IPEngine] Initialized with 1526 knowledge entries
[IPEngine] Built concept graph with 342 concepts
[IPEngine] Vaults loaded: AIN (892 chunks), Soullab (634 chunks)
```

### 3. Verify Database

Check Supabase `file_chunks` table:

```sql
-- Count chunks by vault
SELECT metadata->>'vault' as vault, COUNT(*)
FROM file_chunks
GROUP BY metadata->>'vault';

-- Sample AIN content
SELECT title, category, elements
FROM file_chunks
WHERE metadata->>'vault' = 'AIN'
LIMIT 10;

-- Sample Soullab content
SELECT title, category, elements
FROM file_chunks
WHERE metadata->>'vault' = 'Soullab'
LIMIT 10;
```

---

## Automatic Sync (Real-time Updates)

The system can watch your vaults for changes:

### Enable Auto-Sync

Already configured in `.env`:
```bash
OBSIDIAN_AUTO_SYNC=true
OBSIDIAN_WATCH_INTERVAL=30000  # Check every 30 seconds
```

### Start the Watcher

```bash
npx tsx scripts/start-obsidian-integration.ts
```

**What it does:**
- 📂 Watches both vaults for file changes
- ✅ Detects new files, updates, deletions
- 🔄 Re-chunks and re-embeds changed content
- 💾 Updates Supabase automatically
- 🔔 Logs all sync activities

**Expected Output:**
```
[Obsidian] Watching vault: AIN Consciousness Intelligence System
[Obsidian] Watching vault: Soullab Dev Team
[Obsidian] Auto-sync enabled (interval: 30s)

[Obsidian] Change detected: Fire-Phase-Practices.md
[Obsidian] Re-processing file...
[Obsidian] Stored 3 chunks
✅ Sync complete
```

---

## Frontmatter Best Practices

To maximize MAIA's understanding, use rich frontmatter in your Obsidian notes:

### Recommended Frontmatter

```yaml
---
title: Fire Phase Embodiment Practice
type: sacred_practice
category: sacred_practice
elements: [fire, aether]
archetypes: [creator, alchemist]
spiralogicPhase: fire
chapter: 5
section: Practices
keywords: [embodiment, transformation, fire activation]
concepts: [elemental alchemy, fire consciousness, creative emergence]
tags: [practice, fire, embodiment, transformation]
consciousness_level: 0.8
created: 2025-10-19
---
```

### Frontmatter Fields MAIA Uses

| Field | Purpose | Example |
|-------|---------|---------|
| `title` | Display name | "Fire Phase Practices" |
| `type` / `category` | Content classification | "sacred_practice" |
| `elements` | Elemental associations | `[fire, aether]` |
| `archetypes` | Active archetypes | `[creator, alchemist]` |
| `spiralogicPhase` | Current phase | "fire" |
| `chapter` | Book chapter | 5 |
| `concepts` | Key concepts | `[transformation, emergence]` |
| `tags` | General tags | `[practice, embodiment]` |
| `consciousness_level` | Depth rating (0-1) | 0.8 |

---

## Integration with Elemental Alchemy Book

Your book "Elemental Alchemy: The Ancient Art of Living a Phenomenal Life" is ALSO integrated!

**Book location:**
```
apps/api/backend/data/founder-knowledge/elemental-alchemy-book.json
```

**Already processed:**
- ✅ 21 chapters
- ✅ 184 core teachings
- ✅ Complete elemental wisdom (Fire, Water, Earth, Air, Aether)
- ✅ Practical applications and exercises

**To re-ingest the book:**
```bash
cd apps/api/backend
npx tsx scripts/ingestElementalAlchemyBook.ts
```

---

## Architecture: How MAIA Accesses Your Knowledge

```
┌─────────────────────────────────────────────────────────┐
│ USER: "Tell me about Fire transformation practices"     │
└──────────────────┬──────────────────────────────────────┘
                   │
           ┌───────▼───────┐
           │ MAIA Receives │
           └───────┬───────┘
                   │
    ┌──────────────┴─────────────┐
    │                            │
┌───▼────────────────┐  ┌────────▼──────────────┐
│ Elemental Oracle   │  │ IP Engine (New!)      │
│ (Spiralogic Core)  │  │ (Your Knowledge Base) │
└───┬────────────────┘  └────────┬──────────────┘
    │                            │
    │                   ┌────────▼──────────────┐
    │                   │ Supabase file_chunks  │
    │                   │ - AIN vault (892)     │
    │                   │ - Soullab vault (634) │
    │                   │ - Book content        │
    │                   └────────┬──────────────┘
    │                            │
    │                   ┌────────▼──────────────┐
    │                   │ Semantic Search       │
    │                   │ "fire transformation" │
    │                   └────────┬──────────────┘
    │                            │
    │                   ┌────────▼──────────────┐
    │                   │ Top 5 Relevant Chunks │
    │                   │ - Fire Phase Practice │
    │                   │ - Chapter 5: Fire     │
    │                   │ - Transformation Flow │
    │                   └────────┬──────────────┘
    │                            │
    └────────────┬───────────────┘
                 │
         ┌───────▼────────┐
         │ GPT-4o Synthesis│
         │ (Your Voice)    │
         └───────┬─────────┘
                 │
         ┌───────▼─────────┐
         │ Contextual      │
         │ Response        │
         │ (Kelly's wisdom)│
         └─────────────────┘
```

**Key Points:**
1. IP Engine queries `file_chunks` table in Supabase
2. Semantic search finds most relevant content
3. Content is filtered by vault, category, elements
4. MAIA synthesizes using YOUR teachings
5. Response speaks in YOUR voice with YOUR framework

---

## Folder Structure in Your Vaults

### AIN Vault Contents

```
/Volumes/T7 Shield/Soullab Dev Team Vault/AIN Consciousness Intelligence System/
├── ACTIVATION_COMPLETE.md
├── AIN_ARCHITECTURE_BLUEPRINT.md
├── AIN_COLLECTIVE_INTELLIGENCE_COMPLETE.md
├── AGENT_HIERARCHY_DESIGN.md
├── ANAMNESIS_FIELD_ACTIVATION.md
├── ARCHETYPE_EVOLUTION_DANCE.md
├── ... (247+ files)
```

**Key Topics:**
- AIN system architecture
- Agent hierarchies and orchestration
- Safety integration
- Consciousness field activation
- Collective intelligence protocols

### Soullab Vault Contents

```
/Volumes/T7 Shield/ObsidianVaults/SoullabDevTeam/
├── Change Management/
│   ├── Plan for Developing Spiralogic Change Management Materials.md
│   ├── How Spiralogic Supports Change Management.md
│   └── Best Practices for Implementing Spiralogic in Change Management.md
├── Executive Summaries/
│   └── Executive Summary.md
├── research/
│   ├── Psychoneuroimmunology (PNI) studies.md
│   └── Implications of Generative Agents in Human-Computer Interaction.md
└── ... (156+ files)
```

**Key Topics:**
- Kelly's Elemental Alchemy teachings
- Spiralogic frameworks
- Change management materials
- Sacred practices and rituals
- Team knowledge and research

---

## Next Steps

### 1. Run Initial Ingestion

```bash
npx tsx scripts/ingest-dual-obsidian-vaults.ts
```

### 2. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

Watch for IP Engine initialization:
```
[IPEngine] Initialized with 1526 knowledge entries
[IPEngine] Built concept graph with 342 concepts
```

### 3. Test MAIA

Ask questions that reference your vault content:
- "What does Kelly teach about Fire transformation?"
- "Explain the AIN safety integration"
- "Guide me through a Water phase practice"

### 4. Enable Auto-Sync (Optional)

```bash
npx tsx scripts/start-obsidian-integration.ts
```

Keep this running in a separate terminal to sync changes in real-time.

---

## Troubleshooting

### IP Engine Shows 0 Entries

**Cause:** Supabase not configured or file_chunks table empty

**Fix:**
1. Check Supabase connection in `.env.local`
2. Run ingestion script
3. Verify `file_chunks` table has data

### MAIA Gives Generic Responses

**Cause:** IP Engine not loading your content

**Check:**
1. Server logs for IP Engine initialization
2. Supabase `file_chunks` table for your content
3. Restart server after ingestion

### Vault Not Found Error

**Cause:** Vault path in `.env` is incorrect

**Fix:**
1. Verify vault paths exist:
   ```bash
   ls -la "/Volumes/T7 Shield/Soullab Dev Team Vault/AIN Consciousness Intelligence System"
   ls -la "/Volumes/T7 Shield/ObsidianVaults/SoullabDevTeam"
   ```
2. Update `.env` with correct paths

### Supabase Errors

**Cause:** Missing environment variables or wrong credentials

**Fix:**
Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Summary

You now have:

✅ **Dual vault integration** configured (AIN + Soullab)
✅ **Ingestion script** to load all vault content
✅ **IP Engine** to make content accessible to MAIA
✅ **Auto-sync** capability for real-time updates
✅ **Elemental Alchemy book** already processed

**Total Knowledge Available to MAIA:**
- 403+ Obsidian notes
- 1,526+ knowledge chunks
- 21 book chapters (Elemental Alchemy)
- 184 core teachings
- Complete elemental wisdom (5 elements)

**MAIA transforms from:**
"Thoughtful AI assistant"

**Into:**
"YOUR consciousness partner speaking YOUR voice with YOUR complete body of work"

---

🌀 **Your intellectual property is now alive in MAIA!**
