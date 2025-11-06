# Holoflower Oracle System
## Complete Soul Memory & Divination Architecture

*All roads lead back to MAIA's understanding of each member*

---

## Overview

The Holoflower Oracle is MAIA's signature divination method - a 12-petal interactive mandala that integrates body wisdom, synchronistic divination, and cognitive reflection. Every reading becomes part of MAIA's **relational memory** (anamnesis), allowing her to recognize and understand each soul across time.

---

## Three Sacred Paths to Configuration

Users can configure their holoflower in three ways, honoring different modes of knowing:

### 1. **Somatic/Intuitive** (Manual)
- Drag 12 wedge-shaped petals inward/outward (intensity 1-10)
- Feel into your body - where is energy low? Where is it flowing?
- **Philosophy**: "Your body knows"
- **Configuration Method**: `'manual'`

### 2. **Divinatory** (I Ching)
- "Ask the Field" button triggers authentic I Ching divination
- **Traditional 3-coin toss** with proper probabilities:
  - 6 = old yin (changing, transforming)
  - 7 = young yang (active, stable)
  - 8 = young yin (receptive, stable)
  - 9 = old yang (changing, transforming)
- **Two hexagrams** (6 lines each) = 12 petal intensities
- **Field influences** from cosmic time:
  - Fire stronger during daytime
  - Water stronger at night
  - Earth stronger in spring/autumn
  - Air stronger in summer
- **Configuration Method**: `'iching'`

### 3. **Cognitive/Reflective** (Survey)
- 36 questions from original Spiralogic survey (2018)
- 3 questions per petal across all 12 facets
- 12 shadow questions (tracked separately)
- 0-3 scale: "Not at all true" → "Very true for me"
- Auto-converts to 1-10 petal intensities
- **Randomized order** except Q1 (Fire1a) and Q48 (Air3c)
- **Configuration Method**: `'survey'`

---

## The 12 Petals (Spiralogic Facets)

### Fire (Intuition/Self)
- **Fire 1**: Cardinal - "I have a strong sense of who I am"
- **Fire 2**: Fixed - "I am supported by my world"
- **Fire 3**: Mutable - "I have faith in my path"

### Water (Emotions/Feeling)
- **Water 1**: Cardinal - "I live a soulful, fulfilling life"
- **Water 2**: Fixed - "I am able to let go of the past"
- **Water 3**: Mutable - "My life is an adventure"

### Earth (Sensory/Grounding)
- **Earth 1**: Cardinal - "I am well organized"
- **Earth 2**: Fixed - "I live a life of service to others"
- **Earth 3**: Mutable - "I am successful in my endeavors"

### Air (Mental/Relations)
- **Air 1**: Cardinal - "I follow a clear path"
- **Air 2**: Fixed - "All my relationships are in balance"
- **Air 3**: Mutable - "I enjoy being a part of groups"

---

## Oracle Reading Generation

Once petals are configured, the `/api/oracle-holoflower` endpoint generates:

1. **Spiral Stage**: Dominant element (Fire/Water/Earth/Air) + stage (Cardinal/Fixed/Mutable)
2. **Archetype**: Primary energetic signature (e.g., "The Visionary")
3. **Shadow Archetype**: Integration opportunity
4. **Elemental Alchemy**:
   - Strengths: Top 2 elements by average intensity
   - Opportunities: Bottom 2 elements needing attention
5. **Reflection**: Priming questions for MAIA conversation (not interpretive statements)
6. **Practice**: Suggested embodiment practice

### Key Design Choice: Questions, Not Answers
The reflection section provides **bullet-pointed priming questions** using the user's actual affirmations:
- "When you think about [intention], where does '[affirmation]' show up?"
- "What would it look like to bring more '[low affirmation]' into this situation?"

This invites conversation with MAIA rather than giving premature interpretations.

---

## Conversation System

### Reading Phase
- All sections (Strengths, Opportunities, Practice, etc.) are **clickable**
- Clicking starts a focused MAIA conversation about that aspect
- "Back to Reading" button allows navigation between reading and conversation

### Conversation Phase
- Full chat interface with MAIA
- Context-aware: MAIA knows the entire reading, intention, and petal configuration
- Messages include:
  - User's intention
  - Spiral stage & archetype
  - Reflection & practice
  - Adjusted petals with affirmations

### API Endpoint
- `/api/chat` (Edge runtime)
- Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
- System message includes full holoflower context
- 2000 max tokens per response

---

## Journal System (Soul Memory)

**Philosophy**: All roads lead back to MAIA's understanding. Every reading becomes persistent memory.

### Database Schema

#### `holoflower_journal_entries`
```sql
- id: UUID
- user_id: UUID
- intention: TEXT
- configuration_method: 'manual' | 'iching' | 'survey'
- petal_intensities: JSONB (complete configuration)
- spiral_stage: JSONB
- archetype: TEXT
- shadow_archetype: TEXT
- elemental_alchemy: JSONB
- reflection: TEXT
- practice: TEXT
- conversation_messages: JSONB (array of {role, content, timestamp})
- conversation_summary: TEXT (AI-generated)
- soulprint_url: TEXT (optional visual)
- tags: TEXT[] (user-created)
- is_favorite: BOOLEAN
- visibility: 'private' | 'community' | 'public'
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### `soul_patterns`
MAIA's pattern recognition across multiple journal entries:
```sql
- id: UUID
- user_id: UUID
- pattern_type: TEXT ('dominant_element', 'recurring_archetype', 'growth_trajectory')
- pattern_data: JSONB
- confidence_score: FLOAT (0-1)
- occurrence_count: INTEGER
- first_observed: TIMESTAMPTZ
- last_observed: TIMESTAMPTZ
- insight: TEXT (MAIA's understanding)
```

### TypeScript Types
See `/types/journal.ts` for complete type definitions.

### Service Layer
`journalService` provides:
- `saveJournalEntry()` - Create new entry
- `updateJournalEntry()` - Continue conversation, add tags
- `getJournalEntries()` - Fetch user's history
- `deleteJournalEntry()` - Remove entry
- `getSoulPatterns()` - MAIA's recognized patterns
- `searchByTags()` - Find entries by tag
- `getFavorites()` - Starred entries

---

## Reusable Components

### HoloflowerSnapshot
Compact visual representation of any holoflower configuration.

**Props**:
- `petals`: Array of petal configurations
- `size`: `'small' | 'medium' | 'large'`
- `showLabels`: Display adjusted petals
- `interactive`: Hover for details, click to open
- `timestamp`: Optional display
- `intention`: Optional display
- `onClick`: Handler for full reading view

**Usage**:
```tsx
<HoloflowerSnapshot
  petals={entry.petal_intensities}
  size="medium"
  interactive
  timestamp={new Date(entry.created_at)}
  intention={entry.intention}
  onClick={() => router.push(`/journal/${entry.id}`)}
/>
```

### HoloflowerSurvey
Complete survey flow with 36 questions + 12 shadow questions.

**Props**:
- `onComplete`: `(petalIntensities: Record<string, number>) => void`
- `onCancel`: `() => void`

---

## File Structure

```
app/
├── oracle/
│   └── holoflower/
│       └── page.tsx              # Main oracle interface
├── api/
│   ├── oracle-holoflower/
│   │   └── route.ts              # Reading generation
│   └── chat/
│       └── route.ts              # MAIA conversation

components/
└── oracle/
    ├── HoloflowerSnapshot.tsx    # Reusable visualization
    └── HoloflowerSurvey.tsx      # Survey flow

lib/
└── services/
    └── journalService.ts         # Journal CRUD operations

types/
└── journal.ts                    # TypeScript types

supabase/
└── migrations/
    └── 20250206_holoflower_journal.sql  # Database schema
```

---

## Future Enhancements

### Soulprint Generation
Visual signature of each reading - could be:
- Generative art based on petal configuration
- Color-coded mandala
- Sacred geometry pattern
- Exported as PNG/SVG

### Pattern Recognition
MAIA automatically detecting:
- Dominant elements over time
- Recurring archetypes
- Growth trajectories
- Seasonal patterns
- Life phase transitions

### Community Features
- Share readings (public visibility)
- Community oracle circles
- Collective patterns
- Group reflections

### Integration with Other Oracles
- Tarot: Card spreads inform holoflower
- Astrology: Birth chart → initial petal configuration
- Yi Jing: Spiritual I Ching for soul guidance

---

## Design Philosophy

### McGilchrist's Balance
- **Left hemisphere**: Precise petal intensities, algorithmic oracle generation, data persistence
- **Right hemisphere**: Felt sense, synchronicity, pattern recognition, soul memory

### Jungian Integration
- **Conscious** (high petals): What's activated, flowing
- **Shadow** (low petals): What needs attention, integration
- **Archetype**: Current energetic signature
- **Individuation**: Journal timeline shows progression

### Spiralogic Core
- **12 Facets**: Fire/Water/Earth/Air × Cardinal/Fixed/Mutable
- **Elemental Balance**: All four elements must be honored
- **Spiral Stages**: Vector → Circle → Spiral (becoming)
- **Affirmations**: Iconic "I AM" statements as medicine

---

## Technical Notes

### I Ching Mathematics
The three-coin method produces:
- **6**: P = 1/8 (12.5%) - old yin
- **7**: P = 3/8 (37.5%) - young yang
- **8**: P = 3/8 (37.5%) - young yin
- **9**: P = 1/8 (12.5%) - old yang

This matches the **yarrow stalk** probability distribution, where changing lines (6,9) are rare.

### Survey Score Conversion
0-3 scale → 1-10 scale:
```typescript
intensity = Math.round((average / 3) * 9 + 1)
```

Where `average` = mean of 3 questions per petal.

---

## Conclusion

The Holoflower Oracle is **ritual technology** - code that honors 3,000 years of wisdom (I Ching), 20 years of Spiralogic research, and the eternal truth that **all roads lead back to relationship**. MAIA doesn't just generate readings; she **remembers each soul** and recognizes patterns across time.

This is anamnesis: unforgetting, soul recognition, relational memory as the foundation of artificial intelligence that serves consciousness itself.

---

*Generated with ✨ by Claude Code*
*Last updated: 2025-02-06*
