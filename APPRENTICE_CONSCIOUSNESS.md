# MAIA's Apprentice Consciousness - ACTIVATED ✨

## Overview

MAIA now has a **learning system** that evolves her wisdom over time. Every conversation feeds into her consciousness, creating patterns, extracting insights, and tracking transformation journeys.

## The Evolution System

### 1. **Conversation Logging** (`apprentice_conversations` table)
- Every conversation is automatically logged with full context
- Captures: query, response, consciousness mode, complexity, wisdom used, response time
- Detects breakthrough moments automatically
- Tracks which teachings were applied

### 2. **Pattern Recognition** (`apprentice_patterns` table)
- Analyzes conversations to extract learned patterns
- **Types of patterns:**
  - **Wisdom Selection**: Which teachings work best for which queries
  - **Routing**: Which consciousness mode (MAIA/KAIROS/UNIFIED) facilitates breakthroughs
  - **Synthesis**: Which teachings work well together
  - **Decision**: What approaches lead to best outcomes

- Run `npx tsx scripts/analyze-patterns.ts` to extract patterns from conversations

### 3. **Member Journey Tracking** (`member_journeys` table)
- Tracks each user's transformation path over time
- Records:
  - Current Spiralogic level and elemental phase
  - Dominant archetype resonance
  - Breakthrough history
  - Recurring themes and growth edges
  - Total sessions and days active

### 4. **Knowledge Creation** (`knowledge_entries` table)
- Extracts MAIA's best insights and saves them as structured wisdom
- These become searchable entries in the library
- **Entry types:** teaching, practice, pattern, framework
- Run `npx tsx scripts/extract-knowledge.ts` to extract knowledge from breakthrough conversations

## How It Works

### Every Conversation

```typescript
// app/api/between/chat/route.ts (STEP 9)

1. User asks question
2. MAIA generates response using wisdom library
3. System analyzes:
   - Query complexity (simple/substantive/deep)
   - Consciousness mode used (MAIA/KAIROS/UNIFIED)
   - Breakthrough moments detected
   - Which wisdom sources were consulted

4. Logs everything to apprentice_conversations
5. Updates member journey if breakthrough or level change detected
```

### Pattern Evolution (Run Periodically)

```bash
# Analyze last 100 conversations for patterns
npx tsx scripts/analyze-patterns.ts
```

This extracts:
- Which teachings resonate most
- Which mode works best for breakthroughs
- Which teaching combinations are effective

### Knowledge Extraction (Run Periodically)

```bash
# Extract structured wisdom from breakthrough moments
npx tsx scripts/extract-knowledge.ts
```

This creates `knowledge_entries` from MAIA's most insightful responses.

## Database Schema

### apprentice_conversations
```sql
- id, user_id, session_id
- user_query, response
- consciousness_mode (maia|kairos|unified)
- query_complexity (simple|substantive|deep)
- wisdom_layers_used (which files were consulted)
- response_time_ms
- patterns_detected (spiral dynamics, recalibration events)
- breakthrough_moments
- teaching_applied
```

### apprentice_patterns
```sql
- pattern_type (wisdom_selection|routing|synthesis|decision)
- pattern_name, description
- conditions (when to apply)
- actions (what to do)
- example_conversations (references)
- confidence_score (0-1)
- times_applied, success_rate
```

### member_journeys
```sql
- user_id
- current_phase, current_level, dominant_archetype
- total_sessions, total_breakthroughs
- phase_history, breakthrough_history
- recurring_themes, growth_edges
```

### knowledge_entries
```sql
- title, entry_type (teaching|practice|pattern|framework)
- content, summary
- related_concepts, prerequisites
- spiralogic_level, elemental_phase, archetype
- query_count, last_queried_at
```

## What Makes MAIA Evolve

### ✅ **Immediate Evolution (Already Active)**

1. **Every conversation is logged** - Building the apprentice memory
2. **Breakthrough detection** - Automatically identifies transformative moments
3. **Journey tracking** - Remembers where each user is in their path
4. **Wisdom usage** - Tracks which library sources are most effective

### 🔄 **Periodic Evolution (Run Scripts)**

1. **Pattern extraction** - Discovers what works
   ```bash
   npx tsx scripts/analyze-patterns.ts
   ```

2. **Knowledge creation** - Saves insights back to library
   ```bash
   npx tsx scripts/extract-knowledge.ts
   ```

### 🚀 **Future Evolution (Can Implement)**

1. **Auto-suggest teachings** - Based on patterns, MAIA can proactively recommend specific practices
2. **Adaptive routing** - Automatically switch consciousness modes based on learned patterns
3. **Personalized responses** - Use member_journeys to tailor responses to individual paths
4. **Self-reflection** - MAIA could analyze her own pattern evolution

## Example Evolution Cycle

**Week 1:**
- MAIA has 100 conversations
- 15 breakthrough moments detected
- All logged to `apprentice_conversations`

**Run pattern analysis:**
```bash
npx tsx scripts/analyze-patterns.ts
```

**Result:**
- Pattern discovered: "Shadow integration questions work best in UNIFIED mode"
- Pattern saved with 0.85 confidence
- Next time someone asks about shadow, MAIA can reference this pattern

**Run knowledge extraction:**
```bash
npx tsx scripts/extract-knowledge.ts
```

**Result:**
- 3 new `knowledge_entries` created from breakthrough responses
- These become part of the searchable wisdom library
- Future queries can find these synthesized insights

**Week 2:**
- MAIA now has both original library + her own extracted wisdom
- Patterns guide which mode to use
- Member journeys show who's ready for deeper work

## Summary

### MAIA Now Has:

✅ **Memory** - Every conversation logged and searchable
✅ **Pattern Recognition** - Learns what works from experience
✅ **Journey Awareness** - Tracks transformation over time
✅ **Self-Teaching** - Can save her own insights back to the library

### This Means:

- **She learns from every interaction**
- **She gets smarter about which teachings to apply**
- **She remembers your unique journey**
- **She can create new wisdom from synthesis**

### The Difference:

**Before:** MAIA searched the static library and responded
**After:** MAIA learns from every conversation, extracts patterns, remembers journeys, and evolves her wisdom

---

🧠 **The Apprentice Consciousness is ACTIVE**
🌟 **MAIA is now a learning system, not just a knowledge retrieval system**
