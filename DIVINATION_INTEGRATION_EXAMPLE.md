# 🔮 Divination Integration with Akashic Records

## Example: Tarot Reading Integration

Since the tarot service (`apps/api/backend/src/services/tarotService.ts`) is standalone, you can integrate Akashic Records by calling `saveDivinationToAkashic()` wherever tarot readings are performed.

### Example Integration

```typescript
// Example: In an API route or component that performs tarot readings
import { getTarotReading } from '@/services/tarotService';
import { saveDivinationToAkashic } from '@/lib/saveUnifiedAkashic';

export async function POST(req: Request) {
  try {
    const { query, userId, sessionId } = await req.json();

    // Perform tarot reading
    const reading = getTarotReading(query, "three-card");

    // Save to Akashic Records for semantic search
    await saveDivinationToAkashic(
      "tarot",
      reading.tarot, // The TarotReading object
      query,         // User's question
      userId,
      sessionId
    ).catch(err => console.warn('[Tarot] Akashic archival skipped:', err));

    return Response.json({
      success: true,
      reading
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### What Gets Saved to Akashic Records

**Content:**
```
Tarot Reading for "What do I need to know about this transition?":
The Tower, Death, Three of Wands.
A time of breakthrough and transformation awaits...
```

**Element:** Detected from card suits:
- Wands → Fire
- Cups → Water
- Pentacles → Earth
- Swords → Air
- Major Arcana → Aether

**Archetype:** Detected from card meanings:
- The Tower, Death → Alchemist (transformation)
- High Priestess, Hermit → InnerGuide
- The Fool, The Star → Dream
- Lovers, Two of Cups → Relationship
- The Magician, The Emperor → MainOracle
- The Devil, The Moon → Shadow

**Console Log:**
```
🔮 Divination Akashic Record saved: Fire • Alchemist • tarot
```

---

## Example: I Ching Integration

```typescript
import { getIChing Reading } from '@/services/ichingService';
import { saveDivinationToAkashic } from '@/lib/saveUnifiedAkashic';

// After getting I Ching reading
const hexagram = getIChingReading(query);

await saveDivinationToAkashic(
  "iching",
  {
    number: hexagram.number,
    name: hexagram.name,
    interpretation: hexagram.interpretation,
    guidance: hexagram.guidance
  },
  query,
  userId,
  sessionId
);
```

**Console Log:**
```
🔮 Divination Akashic Record saved: Aether • MainOracle • iching
```

---

## Example: Oracle Card Pull Integration

```typescript
import { drawOracleCard } from '@/services/oracleCardService';
import { saveDivinationToAkashic } from '@/lib/saveUnifiedAkashic';

const card = drawOracleCard();

await saveDivinationToAkashic(
  "oracle-card",
  {
    cardName: card.name,
    message: card.message,
    guidance: card.guidance
  },
  userQuery,
  userId,
  sessionId
);
```

---

## Where to Add Integration

### Option 1: Direct in Tarot Service (Best)

Modify `apps/api/backend/src/services/tarotService.ts`:

```typescript
import { saveDivinationToAkashic } from '@/lib/saveUnifiedAkashic';

export async function getTarotReading(
  query: string,
  spreadType: string = "three-card",
  userId?: string,
  sessionId?: string
): DivinationInsight {
  // ... existing code ...

  const reading = {
    method: "tarot",
    title: `${spread.name} Reading`,
    // ... rest of reading
  };

  // Save to Akashic Records
  if (userId) {
    await saveDivinationToAkashic(
      "tarot",
      reading.tarot,
      query,
      userId,
      sessionId
    ).catch(err => console.warn('[Tarot] Akashic save skipped:', err));
  }

  return reading;
}
```

### Option 2: In API Route (Alternative)

Create or modify an API route that calls the tarot service:

```typescript
// app/api/divination/tarot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTarotReading } from '@/services/tarotService';
import { saveDivinationToAkashic } from '@/lib/saveUnifiedAkashic';

export async function POST(req: NextRequest) {
  const { query, spreadType, userId, sessionId } = await req.json();

  const reading = getTarotReading(query, spreadType);

  // Save to Akashic Records
  await saveDivinationToAkashic(
    "tarot",
    reading.tarot,
    query,
    userId,
    sessionId
  );

  return NextResponse.json({ success: true, reading });
}
```

### Option 3: In Component (Client-Side)

If tarot readings are triggered from a component:

```typescript
import { saveDivinationToAkashic } from '@/lib/saveUnifiedAkashic';

const performTarotReading = async () => {
  const response = await fetch('/api/tarot', {
    method: 'POST',
    body: JSON.stringify({ query, userId, sessionId })
  });

  const { reading } = await response.json();

  // Save to Akashic Records
  await saveDivinationToAkashic(
    "tarot",
    reading.tarot,
    query,
    userId,
    sessionId
  );

  setReading(reading);
};
```

---

## Testing Divination Integration

### 1. Perform a Tarot Reading

```typescript
POST /api/divination/tarot

{
  "query": "What do I need to know about my creative work?",
  "spreadType": "three-card",
  "userId": "user_123",
  "sessionId": "session_abc"
}
```

### 2. Check Console Logs

```
🔮 Divination Akashic Record saved: Fire • Alchemist • tarot
```

### 3. Query Akashic Records

```typescript
POST /api/akashic/query

{
  "query": "creative breakthrough transformation",
  "mode": "semantic",
  "filters": {
    "sources": ["Divination"],
    "elements": ["Fire"]
  }
}
```

**Expected Result:** Your tarot reading should appear in search results!

---

## Cross-Source Search Examples

### "Show me all transformation guidance"

**Filter:** `elements: ["Fire"], archetypes: ["Alchemist"]`

**Returns:**
- 🔮 Tarot: The Tower + Death reading
- 🎙️ MAIA: "You're ready for a breakthrough..."
- 🌟 Astrology: Pluto transit conjunct Sun
- 📄 Journal: "Today I finally let go..."

### "What divination readings have I received?"

**Filter:** `sources: ["Divination"]`

**Returns:**
- Tarot readings
- I Ching hexagrams
- Oracle card pulls
- Chronologically ordered

---

## Benefits

1. **Searchable Divination History** - Find past readings semantically
2. **Cross-Source Synthesis** - Connect tarot with astrology, MAIA, journals
3. **Pattern Recognition** - "I always draw Fire cards when ready for change"
4. **Temporal Tracking** - See how guidance evolves over time
5. **Unified Wisdom Field** - All sources in one searchable space

---

**Status:** Functions ready in `lib/saveUnifiedAkashic.ts`. Just need to call them wherever divination readings are performed! 🔮✨
