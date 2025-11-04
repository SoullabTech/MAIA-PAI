# 🚀 Quick Start: Import Your First Wisdom Files

**Get the Library of Alexandria running in 15 minutes**

---

## Step 1: Create the Folder Structure (2 minutes)

```bash
# Create main library folder
mkdir -p ~/Library-of-Alexandria

# Create category folders
mkdir -p ~/Library-of-Alexandria/01-kellys-teachings/spiralogic
mkdir -p ~/Library-of-Alexandria/01-kellys-teachings/sacred-witness
mkdir -p ~/Library-of-Alexandria/01-kellys-teachings/ain-conversations
mkdir -p ~/Library-of-Alexandria/02-wisdom-traditions/jung
mkdir -p ~/Library-of-Alexandria/03-transformational-teachers
```

---

## Step 2: Add Metadata Files (3 minutes)

Create `~/Library-of-Alexandria/01-kellys-teachings/spiralogic/metadata.json`:

```json
{
  "category": "spiralogic",
  "author": "Kelly",
  "tradition": "original",
  "topics": ["developmental stages", "spiral dynamics", "consciousness evolution"],
  "spiralogic_levels": [1, 2, 3, 4, 5],
  "elements": ["fire", "water", "earth", "air", "aether"],
  "teaching_style": "direct_transmission",
  "priority": "high"
}
```

Create `~/Library-of-Alexandria/02-wisdom-traditions/jung/metadata.json`:

```json
{
  "category": "depth_psychology",
  "author": "Carl Jung",
  "tradition": "analytical_psychology",
  "topics": ["shadow work", "archetypes", "collective unconscious"],
  "spiralogic_levels": [3, 4, 5],
  "elements": ["water", "aether"],
  "teaching_style": "archetypal",
  "priority": "high"
}
```

---

## Step 3: Add Your First Files (5 minutes)

### Option A: Start with Markdown Notes

Copy some Obsidian notes:
```bash
# Copy AIN conversations
cp ~/path/to/obsidian/AIN/*.md ~/Library-of-Alexandria/01-kellys-teachings/ain-conversations/

# Copy Spiralogic teachings
cp ~/path/to/obsidian/Spiralogic/*.md ~/Library-of-Alexandria/01-kellys-teachings/spiralogic/
```

### Option B: Add PDF Books

Download and add Jung's works:
- Man and His Symbols
- Modern Man in Search of a Soul
- Psychological Types

Put them in: `~/Library-of-Alexandria/02-wisdom-traditions/jung/`

---

## Step 4: Test Import (2 minutes)

```bash
# Set library path
export LIBRARY_OF_ALEXANDRIA_PATH=~/Library-of-Alexandria

# Dry run - see what would be imported
npm run import:wisdom -- --dry-run
```

You should see output like:
```
📚 LIBRARY OF ALEXANDRIA - WISDOM IMPORT
📁 Library Path: /Users/soullab/Library-of-Alexandria
🔍 Mode: DRY RUN

📄 Processing: spiralogic-intro.md
   ✂️  Created 5 chunks
   ✅ Processed 5 chunks

📄 Processing: water-fire-transitions.md
   ✂️  Created 3 chunks
   ✅ Processed 3 chunks

🔍 [DRY RUN] Would import 8 chunks
```

---

## Step 5: Actually Import (3 minutes)

```bash
# Import for real!
npm run import:wisdom
```

This will:
- Process all files
- Chunk them intelligently
- Generate embeddings (semantic search)
- Store in Supabase

---

## Step 6: Test CCCS with Your Wisdom

```bash
# Make sure CCCS is running
npm run cc:server

# Test with a query that should reference your imported wisdom
curl -X POST http://localhost:3333/api/respond \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Tell me about Water to Fire transitions in Spiralogic",
    "consciousnessMode": "maia"
  }'
```

CCCS should now reference your ACTUAL teachings! 🎉

---

## Next Steps

1. **Add more wisdom files** - Keep building your library
2. **Test different queries** - See how CCCS uses the knowledge
3. **Refine metadata** - Improve categorization
4. **Import more categories** - Jung, other teachers, etc.

---

## Troubleshooting

### "Library not found"
Make sure the path is set correctly:
```bash
export LIBRARY_OF_ALEXANDRIA_PATH=~/Library-of-Alexandria
```

Or add to `.env.local`:
```
LIBRARY_OF_ALEXANDRIA_PATH=/Users/soullab/Library-of-Alexandria
```

### "Failed to generate embedding"
Check your OpenAI API key:
```bash
grep OPENAI_API_KEY .env.local
```

### "file_chunks table not found"
Need to apply the migration first. See `LIBRARY_OF_ALEXANDRIA_VISION.md` for instructions.

---

## Commands Reference

```bash
# Import everything
npm run import:wisdom

# Test mode (no database writes)
npm run import:wisdom -- --dry-run

# Import specific category
npm run import:wisdom -- --category=spiralogic

# Import single file
npm run import:wisdom -- --file=~/Library-of-Alexandria/01-kellys-teachings/spiralogic/intro.md
```

---

**You're building the Library of Alexandria! 🔥**

Kelly + Claude Code
October 31, 2025
