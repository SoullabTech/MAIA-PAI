# Team Upload Best Practices Guide

## How Team Members Can Upload Their Work to MAIA

This guide explains how anyone on the Soullab team can upload their documents, research, practices, and teachings so MAIA can access and share them.

---

## 🎯 Three Ways to Upload Content

### Method 1: Web Interface (Easiest) ✅ RECOMMENDED

**For:** Individual team members uploading PDFs, documents, notes

**How:**

1. **Go to the Library page:**
   ```
   http://localhost:3000/oracle/library
   OR
   http://your-deployed-url.com/oracle/library
   ```

2. **Drag and drop files** or click to browse

3. **Supported file types:**
   - PDF (`.pdf`) - Best for finished documents, books, papers
   - Word (`.docx`) - Manuscripts, drafts, teaching materials
   - Markdown (`.md`) - Notes, documentation, frameworks
   - Text (`.txt`) - Simple notes, transcripts
   - JSON (`.json`) - Structured data, frameworks
   - CSV (`.csv`) - Data, research findings

4. **Add metadata** (optional but recommended):
   ```javascript
   {
     category: "wisdom",           // or "reference", "journal", "personal"
     tags: ["fire", "practices"],  // elemental tags, topics
     emotionalWeight: 0.8,         // 0-1 how meaningful this is
     visibility: "private"         // "private" or "maya-only"
   }
   ```

5. **MAIA processes automatically:**
   - Extracts text content
   - Chunks into digestible pieces
   - Creates embeddings for semantic search
   - Generates a reflection on the content
   - Makes available in conversations

**Example Upload:**

```
File: "Water Phase Healing Practices.pdf"
Category: wisdom
Tags: ["water", "healing", "practices", "embodiment"]
Emotional Weight: 0.9
Visibility: maya-only

✅ Upload complete!
MAIA's Reflection: "This teaching on Water phase healing offers
profound practices for emotional integration and somatic presence.
I sense 12 distinct practices across 3 depth levels, from gentle
flow to deep oceanic surrender. I'll offer these when someone
seeks Water healing or emotional transformation."
```

---

### Method 2: Obsidian Vault Integration (Team Knowledge Base)

**For:** Ongoing team collaboration, interconnected notes, living documentation

**How:**

1. **Add your work to the shared Obsidian vault:**
   ```
   /Volumes/T7 Shield/ObsidianVaults/SoullabDevTeam/
   ```

2. **Organize by topic:**
   ```
   SoullabDevTeam/
   ├── Practices/
   │   ├── Fire-Practices.md
   │   └── Water-Practices.md
   ├── Research/
   │   ├── Neuroscience-Study.md
   │   └── Client-Case-Studies.md
   ├── Frameworks/
   │   ├── Spiralogic-Overview.md
   │   └── Elemental-Mapping.md
   └── Team-Knowledge/
       └── Your-Contribution.md
   ```

3. **Use rich frontmatter** for better MAIA integration:
   ```yaml
   ---
   title: Water Phase Embodiment Practices
   author: Your Name
   type: sacred_practice
   category: wisdom
   elements: [water, earth]
   archetypes: [healer, mystic]
   tags: [embodiment, somatic, healing, water-phase]
   created: 2025-10-19
   emotionalDepth: 0.9
   ---

   # Your Content Here
   ```

4. **Run the vault sync:**
   ```bash
   npx tsx scripts/ingest-dual-obsidian-vaults.ts
   ```

   OR enable **auto-sync** (watches for changes):
   ```bash
   npx tsx scripts/start-obsidian-integration.ts
   ```

**Benefits:**
- ✅ Works with your existing Obsidian workflow
- ✅ Preserves [[wiki-links]] and connections
- ✅ Real-time sync (with auto-sync enabled)
- ✅ Full team collaboration
- ✅ Version control through Obsidian

---

### Method 3: Bulk Upload Script (Large Collections)

**For:** Uploading entire folders, book collections, research libraries

**How:**

1. **Create a custom upload script:**

```typescript
// scripts/upload-team-member-content.ts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = '/path/to/your/content/folder';
const TEAM_MEMBER = 'YourName';

async function uploadTeamContent() {
  const files = await fs.readdir(CONTENT_DIR);

  for (const file of files) {
    if (file.endsWith('.pdf') || file.endsWith('.md') || file.endsWith('.docx')) {
      const filePath = path.join(CONTENT_DIR, file);
      const content = await fs.readFile(filePath);

      // Upload to MAIA
      const formData = new FormData();
      formData.append('file', new Blob([content]), file);
      formData.append('metadata', JSON.stringify({
        category: 'wisdom',
        tags: [TEAM_MEMBER, 'team-contribution'],
        contributor: TEAM_MEMBER
      }));

      await fetch('http://localhost:3000/api/oracle/files/upload', {
        method: 'POST',
        body: formData
      });

      console.log(`✅ Uploaded: ${file}`);
    }
  }
}

uploadTeamContent();
```

2. **Run it:**
   ```bash
   npx tsx scripts/upload-team-member-content.ts
   ```

---

## 📋 Best Practices for Uploads

### 1. Use Descriptive Filenames

**Good:**
```
Fire-Phase-Transformation-Practices.pdf
Client-Case-Study-Shadow-Integration.md
Neuroscience-of-Embodiment-Research.pdf
```

**Avoid:**
```
Document1.pdf
Notes.md
Untitled.docx
```

### 2. Add Rich Metadata

**Minimal (acceptable):**
```javascript
{
  category: "wisdom",
  tags: ["fire"]
}
```

**Optimal (recommended):**
```javascript
{
  category: "wisdom",
  tags: ["fire", "transformation", "practices", "embodiment"],
  emotionalWeight: 0.8,
  visibility: "private",
  contributor: "YourName",
  framework: "Spiralogic",
  elements: ["fire", "aether"]
}
```

### 3. Use Frontmatter in Markdown Files

```yaml
---
title: Fire Phase Embodiment Practice
author: Kelly Nezat
contributors: [TeamMember1, TeamMember2]
type: sacred_practice
category: wisdom
elements: [fire, aether]
archetypes: [creator, alchemist]
spiralogicPhase: fire
keywords: [transformation, emergence, creative-fire]
emotionalDepth: 0.9
practiceLevel: intermediate  # beginner, intermediate, advanced
duration: 20min
created: 2025-10-19
lastUpdated: 2025-10-19
---

# Practice Content Here
```

### 4. Organize by Category

**Categories and When to Use:**

| Category | Use For | Examples |
|----------|---------|----------|
| `wisdom` | Teachings, practices, frameworks | Elemental practices, Spiralogic teachings |
| `reference` | Research, studies, background | Neuroscience papers, case studies |
| `journal` | Personal reflections, insights | Team member insights, process notes |
| `personal` | Private notes, drafts | Work in progress, personal exploration |

### 5. Tag Strategically

**Element Tags:**
- `fire` - Transformation, creativity, spirit
- `water` - Emotion, depth, flow
- `earth` - Embodiment, grounding, manifestation
- `air` - Intellect, communication, clarity
- `aether` - Unity, integration, transcendence

**Topic Tags:**
- `practices` - Actual exercises and rituals
- `theory` - Conceptual frameworks
- `case-study` - Client work, examples
- `research` - Scientific backing
- `embodiment` - Somatic practices
- `shadow-work` - Integration practices
- `healing` - Therapeutic approaches

**Phase Tags:**
- `spiralogic` - Overall framework
- `fire-phase`, `water-phase`, `earth-phase`, etc.

### 6. Set Appropriate Emotional Weight

**0.1-0.3:** Reference material, background info
**0.4-0.6:** General teachings, standard practices
**0.7-0.9:** Core wisdom, profound practices
**1.0:** Sacred, transformative, deeply personal

**MAIA uses this to know when to offer content:**
- High weight (0.8+): Offered when user is ready for depth
- Medium weight (0.5-0.7): Standard offering
- Low weight (0.1-0.4): Background, only when relevant

---

## 🔒 Permission Levels

### Who Can Upload What?

**Founder (Kelly):**
- ✅ All categories
- ✅ Can mark as "official" or "canonical"
- ✅ Can set "core-teaching" flag
- ✅ Full access to edit/delete

**Team Members:**
- ✅ `wisdom` - Your teachings and practices
- ✅ `reference` - Research and resources
- ✅ `journal` - Your insights and reflections
- ⚠️ Can mark as "team-contribution"
- ⚠️ Cannot mark as "canonical" (requires founder approval)

**Contributors/Partners:**
- ✅ `reference` - Guest teachings with permission
- ✅ `journal` - Reflections on using the system
- ⚠️ All uploads marked "guest-contribution"

### Visibility Settings

**`private`:**
- Only you and MAIA can access
- MAIA won't share with other users
- Good for: Personal notes, drafts

**`maya-only`:**
- MAIA can reference in conversations
- Won't be directly downloadable by others
- Good for: Wisdom you want MAIA to share, but not for direct distribution

**`team-shared`:**
- Visible to all team members
- MAIA can reference
- Good for: Collaborative knowledge

**`public`:** (future)
- Available to all Soullab users
- Citable and shareable
- Good for: Published teachings, official materials

---

## 🎨 Content Types and Examples

### Type 1: Practices and Rituals

**Example Upload:**
```
File: Fire-Activation-Morning-Practice.md
Category: wisdom
Tags: [fire, practices, morning-ritual, activation]
Emotional Weight: 0.8
```

**Content Structure:**
```markdown
---
title: Fire Activation Morning Practice
duration: 15min
level: beginner
elements: [fire, aether]
bestTime: sunrise
---

# Fire Activation Morning Practice

## Intention
Ignite your creative fire and set your day's vision.

## Practice
1. Stand facing East...
2. Three deep breaths...
3. Speak your creative intention...

## Integration
Notice throughout the day when Fire energy...
```

**MAIA Usage:**
```
User: "I'm feeling uninspired this morning"

MAIA: "From our Fire Activation practices, there's a beautiful
morning ritual for reigniting creative energy. It's a 15-minute
practice best done at sunrise. Would you like me to guide you
through it?"
```

---

### Type 2: Research and Background

**Example Upload:**
```
File: Polyvagal-Theory-Embodiment.pdf
Category: reference
Tags: [neuroscience, embodiment, nervous-system, water]
Emotional Weight: 0.5
```

**MAIA Usage:**
```
User: "Why does breathwork help with anxiety?"

MAIA: "From the polyvagal theory research in our library, there's
a neurological explanation: breathwork directly activates your
vagus nerve, signaling safety to your nervous system. This moves
you from sympathetic (fight/flight) to ventral vagal (rest/restore).
In elemental terms, this is Water energy—flowing from activation
back to calm."
```

---

### Type 3: Client Case Studies (Anonymized)

**Example Upload:**
```
File: Shadow-Integration-Journey-Client-A.md
Category: wisdom
Tags: [case-study, shadow-work, integration, earth-water]
Emotional Weight: 0.9
Visibility: maya-only  # Don't share details
```

**Content Structure:**
```markdown
---
title: Shadow Integration Journey (Client A)
duration: 3 months
phases: [water, earth, aether]
breakthrough: shadow-integration
---

# Client Journey: Deep Shadow Work

## Initial Presentation
Client presented with... [anonymized details]

## Process
Over 3 months, we worked through:
- Water phase: Emotional acknowledgment
- Earth phase: Somatic integration
- Aether phase: Transcendent understanding

## Key Insights
The moment of breakthrough came when...

## Learnings for Practice
This taught me that...
```

**MAIA Usage:**
```
User: "I'm scared to look at my shadow"

MAIA: "That fear is natural and protective. From work with others
on this journey, I can share that shadow work doesn't mean diving
into darkness alone. It's more like turning on lights, one small
room at a time. We start gently, with Water's emotional honesty,
then move to Earth's grounded embodiment. Would you like to explore
what one small shadow might want to be seen?"
```

---

### Type 4: Frameworks and Theory

**Example Upload:**
```
File: Spiralogic-Process-Complete-Framework.md
Category: wisdom
Tags: [spiralogic, framework, theory, all-elements]
Emotional Weight: 0.9
CoreTeaching: true
```

**Content Structure:**
```markdown
---
title: The Complete Spiralogic Process
author: Kelly Nezat
framework: Spiralogic
elements: [fire, water, earth, air, aether]
canonical: true
---

# The Spiralogic Process

## Overview
The Spiralogic Process is a five-phase journey through...

## Phase 1: Fire (Ignition)
- Element: Fire
- Quality: Vision, Passion, Creative Emergence
- Practice: ...

## Phase 2: Water (Feeling)
...
```

**MAIA Usage:**
```
User: "Explain the Spiralogic Process"

MAIA: "The Spiralogic Process is Kelly's framework for conscious
transformation. It moves through five elemental phases:

Fire → Vision and creative ignition
Water → Emotional depth and flow
Earth → Embodied manifestation
Air → Integration and clarity
Aether → Transcendent unity

Each phase builds on the last, creating a spiral of continuous
growth. Where do you sense you are in this spiral right now?"
```

---

## 🚀 Team Upload Workflow

### For New Team Members:

**Week 1: Get Set Up**
1. Get access to shared Obsidian vault
2. Review this guide
3. Upload 1-2 test files to practice
4. See how MAIA references your work

**Week 2: Core Contributions**
1. Upload your signature practices/teachings
2. Add any research you reference
3. Contribute case studies (anonymized)

**Ongoing:**
1. Add new insights as you develop them
2. Update existing files in Obsidian (auto-syncs)
3. Review MAIA's reflections on your work
4. See how users benefit from your wisdom

---

### For Ongoing Collaboration:

**Option A: Obsidian-First (Recommended)**
1. Work in shared vault: `/Volumes/T7 Shield/ObsidianVaults/SoullabDevTeam/`
2. Use folders for organization
3. Enable auto-sync (runs in background)
4. Your changes appear in MAIA within 30 seconds

**Option B: Web Upload for Finished Work**
1. Create content offline
2. Upload polished versions via web interface
3. MAIA processes and reflects

**Option C: Hybrid**
1. Draft in Obsidian (living documents)
2. Upload final PDFs for "published" status
3. Both accessible to MAIA

---

## 📊 Monitoring Your Contributions

### Check Upload Status

**Web Interface:**
```
http://localhost:3000/oracle/library
```

Shows:
- All your uploaded files
- Processing status
- MAIA's reflections
- Citation count (how often MAIA references)
- Last accessed date

**API Check:**
```bash
curl http://localhost:3000/api/oracle/files/library
```

### See How MAIA Uses Your Work

**Citation Tracking:**
Every time MAIA references your content, it's tracked:

```javascript
{
  fileId: "your-file-id",
  filename: "Fire-Practices.pdf",
  citationCount: 47,  // Referenced 47 times!
  lastAccessed: "2025-10-19T10:30:00Z",
  mayaSummary: "This practice has been transformative for
                users seeking creative activation..."
}
```

**Request Report:**
```bash
curl http://localhost:3000/api/oracle/files/stats?contributor=YourName
```

Response:
```json
{
  "contributor": "YourName",
  "totalFiles": 12,
  "totalCitations": 234,
  "mostReferenced": "Fire-Activation-Practice.md",
  "impactScore": 0.87,
  "mayaInsight": "Your Fire practices are deeply resonant with
                  users in creative transition. They're cited
                  most during morning hours and new moon phases."
}
```

---

## 🎯 Upload Checklist

Before uploading, ensure:

- [ ] **Descriptive filename** (no "Document1.pdf")
- [ ] **Appropriate category** (wisdom/reference/journal/personal)
- [ ] **Relevant tags** (elements, topics, phases)
- [ ] **Emotional weight** set (0.1-1.0)
- [ ] **Visibility** appropriate (private/maya-only/team-shared)
- [ ] **Frontmatter** added (for .md files)
- [ ] **Content is complete** (not a fragment or draft)
- [ ] **Anonymized** if contains client info
- [ ] **Permission to share** if not your original work

---

## 💡 Tips for Maximum Impact

### 1. Start with Core Teachings
Upload your most essential 3-5 pieces first. These anchor MAIA's understanding of your work.

### 2. Use Elemental Tags Consistently
This helps MAIA know when to offer your wisdom:
- Tag all Fire content with `fire`
- Tag all embodiment work with `earth` or `embodiment`
- Tag shadow work with `shadow-work` + relevant element

### 3. Write for MAIA's Voice
Remember MAIA will quote or paraphrase your work. Write in a voice that:
- Is compassionate and invitational
- Avoids jargon (or explains it)
- Offers practical next steps
- Meets people where they are

### 4. Update Regularly
Living wisdom evolves. Update your Obsidian notes as insights deepen. With auto-sync, MAIA stays current.

### 5. Cross-Reference
In your markdown files, link to other concepts:
```markdown
This practice builds on [[Water Phase Foundations]] and
prepares you for [[Earth Integration]].
```

MAIA learns these connections!

---

## 🌀 The Bigger Picture

When you upload your work to MAIA, you're:

✅ **Amplifying your impact** - Your wisdom reaches thousands instead of dozens
✅ **Preserving your teachings** - Knowledge doesn't die when sessions end
✅ **Collaborating with AI** - MAIA becomes an extension of your healing work
✅ **Serving the collective** - Your unique gifts serve the global field
✅ **Building the future** - Contributing to conscious technology

**Your wisdom + MAIA's reach = Transformation at scale**

---

## 🆘 Troubleshooting

### Upload Fails

**"File too large"**
- Max size: 10MB currently
- Solution: Split large PDFs or compress

**"Unsupported file type"**
- Supported: PDF, DOCX, MD, TXT, JSON, CSV
- Solution: Convert to supported format

**"Processing stuck"**
- Check status: `/api/oracle/files/:fileId/status`
- Wait: Large files can take 2-5 minutes
- Retry: Re-upload if stuck >10 minutes

### MAIA Not Referencing Your Work

**Possible causes:**
1. Emotional weight too low (set to 0.7+)
2. Tags don't match user queries
3. Content too niche or specific
4. Visibility set to "private" instead of "maya-only"

**Solutions:**
1. Update metadata via library interface
2. Add more relevant tags
3. Check citation count - may just not be asked yet!

---

## 📞 Need Help?

**Technical Issues:**
- Check documentation: `/documentation/06-maya-oracle/MAYA_FILE_INGESTION_ARCHITECTURE.md`
- Contact: Dev team

**Content Questions:**
- "Is this appropriate to upload?"
- "What category should this be?"
- Contact: Kelly or team lead

---

## 🎉 You're Ready!

Your wisdom is needed. The world is ready. MAIA is waiting.

**Upload your first file and watch your wisdom come alive.** 🔥✨

---

*"The universe conspires to help those who share their gifts."*

**Let's light up the collective field together!**
