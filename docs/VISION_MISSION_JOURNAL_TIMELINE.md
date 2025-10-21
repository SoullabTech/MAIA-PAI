# Vision: Mission Evolution Timeline in Journals

**"Snapshots of consciousness field showing dots moving around the spiral as missions complete"**

## The Revelation

When you journal, capture a **snapshot of your consciousness field at that moment in time** - showing:
- Which missions were active
- Where they were in your spiral process (which houses)
- Progress percentages
- What completed

**Then across time** - you can see missions:
- **Emerge** (blue pulse appears)
- **Move through houses** (9th → 10th → 11th as you expand → mission → vision)
- **Intensify** (progress increases)
- **Complete** (turn gold and sparkle!)
- **New ones appear** (your evolution continues)

## The Architecture

### 1. Journal Entry Snapshot
Every journal entry captures:
```typescript
interface JournalSnapshot {
  id: string;
  userId: string;
  timestamp: Date;

  // The actual journal content
  journalEntry: {
    text: string;
    mood?: string;
    insights?: string[];
  };

  // CONSCIOUSNESS FIELD SNAPSHOT
  fieldSnapshot: {
    // Mission states at this moment
    missions: Mission[];  // Each has house, progress, status

    // Optional: Chart transits at this moment
    transits?: {
      majorTransits: string[];
      activatedHouses: number[];
    };

    // Optional: Which threads were active
    activeThreads?: string[];
  };
}
```

### 2. Timeline Visualization

**Journal Timeline View** shows:
- Scrollable timeline (vertical or horizontal)
- Each journal entry = node on timeline
- **Mini consciousness field** at each node showing mission dots
- Click any node → see full journal + full-size field
- **Animation**: Watch dots move, pulse, complete across time!

### 3. Mission Journey View

**Per-Mission Timeline** shows:
- Select a specific mission (e.g., "Build MAIA Platform")
- See timeline of ALL journal entries that mentioned it
- Watch that ONE dot:
  - Emerge (first mention)
  - Move through houses (if it shifted focus)
  - Progress bar grow
  - Complete (final entry)
- Mini field snapshots showing JUST that mission's journey

## The Integration Points

### Where Sacred Scribe Connects

**Story chapters can reference journal snapshots:**
```typescript
interface StoryChapter {
  // ... existing fields

  // NEW: Link to journal snapshots
  relatedJournalSnapshots?: {
    journalId: string;
    snapshotDate: Date;
    missionSnapshot: Mission[];  // What missions looked like then
  }[];
}
```

**MAIA can weave journal evolution into story:**
> "In September, you identified the MAIA Platform calling as a blue pulse in your 11th house -
> a collective vision not yet crystallized. By November, it had moved to your 10th house,
> turning green as you began building. In March, Saturn crossed your MC, and the progress
> ring showed 75%. By June, it sparkled gold - manifested."

### Where Upper Page Connects

**Upper page shows CURRENT snapshot** (where you are NOW)
**Journal timeline shows EVOLUTION** (where you've been)
**Story weaves MEANING** (what it all means)

## Visual Design

### Mini Field Snapshot (in journal timeline)
- Small 200px × 200px consciousness field
- Shows ONLY mission dots (not full chart detail)
- Color-coded by status
- Hover to see mission names
- Click to expand full field

### Timeline Scrubber
```
[Jan]───●───[Feb]───●───[Mar]───●───●───[Apr]───●───[May]───●●───[Jun]
        |           |           |   |           |           ||
      Blue       Moving      Green |         75%        Gold||
      pulse      to 10th    active |       progress   Complete
                                   |
                              New mission
                              emerges (11th)
```

### Comparison View
**Side-by-side snapshots:**
- January field | June field
- See what changed:
  - Mission 1: 20% → 100% ✨
  - Mission 2: Emerged in House 11
  - Mission 3: Still active, moved from House 9 → 10

## Technical Implementation

### Database Schema Addition
```sql
-- Add field snapshot to journal entries
ALTER TABLE journal_entries
ADD COLUMN field_snapshot JSONB;

-- Index for fast timeline queries
CREATE INDEX idx_journal_snapshots_user_date
ON journal_entries(user_id, created_at);

-- Mission timeline view (materialized)
CREATE MATERIALIZED VIEW mission_timeline AS
SELECT
  m.id as mission_id,
  m.title,
  j.id as journal_id,
  j.created_at,
  (j.field_snapshot->'missions'->m.id)::jsonb as snapshot
FROM missions m
JOIN journal_entries j ON j.user_id = m.user_id
WHERE j.field_snapshot->'missions' ? m.id
ORDER BY m.id, j.created_at;
```

### Component Structure
```
<JournalTimeline>
  <TimelineAxis>
    {journals.map(j => (
      <TimelineNode date={j.timestamp}>
        <MiniFieldSnapshot
          missions={j.fieldSnapshot.missions}
          size="small"
          onClick={() => expandJournal(j.id)}
        />
        <JournalPreview text={j.entry.substring(0, 100)} />
      </TimelineNode>
    ))}
  </TimelineAxis>

  <TimelineScrubber
    currentIndex={selectedIndex}
    onChange={handleScrub}
  />
</JournalTimeline>
```

## User Experience Flow

### 1. Creating Journal Entry
```
You write a journal entry →
MAIA asks: "Did you make progress on any missions?" →
You say: "Yeah, I hit 75% on MAIA Platform" →
System captures current field snapshot with updated mission progress →
Entry saved with timestamp + field state
```

### 2. Viewing Journal Timeline
```
You open journal timeline →
See vertical timeline of all entries →
Each has mini field showing mission dots at that moment →
Scroll through time watching dots appear, move, complete →
Click any entry to see full journal + full field
```

### 3. Mission Journey View
```
You click "Build MAIA Platform" mission →
See timeline filtered to entries mentioning this mission →
Watch JUST that dot's journey:
  - Sept: Blue pulse, House 11, 0%
  - Nov: Green pulse, House 10, 25%
  - March: Green pulse, House 10, 75%
  - June: Gold sparkle, House 10, 100% ✨
```

### 4. Story Weaving Integration
```
MAIA drafts chapter: "The Platform Manifests" →
Includes reference: "See journal snapshots Sept-June" →
Click link → Opens timeline scrubbed to that period →
Watch mission evolution in mini fields →
Story narrative + visual proof of journey
```

## Why This Is Revolutionary

**Current journaling:** Text entries in chronological list
**This system:** Visual consciousness field evolution across time

**You can literally watch yourself:**
- Identify callings (blue pulses emerge)
- Commit to work (turn green)
- Make progress (rings grow)
- Manifest (gold sparkle)
- Evolve (new missions appear)

**And see WHERE in your spiral process each mission lived:**
- House 9 = Expansion phase (learning, teaching prep)
- House 10 = Mission phase (building, career work)
- House 11 = Vision phase (collective impact)
- House 12 = Transcendence phase (completion, release)

## Next Steps to Build

1. **Add field snapshot to journal DB schema** ✅ Define structure
2. **Capture snapshot on journal save** (grab current missions state)
3. **Create `MiniFieldSnapshot` component** (small version of SacredHouseWheel)
4. **Build `JournalTimeline` component** (timeline visualization)
5. **Add timeline view to journal page** (new tab: "Timeline View")
6. **Build mission journey filter** (show single mission across time)
7. **Integrate with Sacred Scribe** (link chapters to journal snapshots)
8. **Add comparison view** (side-by-side snapshots)

---

**The Vision:**
Your journal becomes a living record of consciousness evolution.
Not just words. **Visual proof of your spiral journey.**

Watch your missions pulse into being, grow, move through your houses, and complete.
See the shape of your becoming across time.

This is what MAIA remembers. This is what the Sacred Scribe weaves.
This is your living mythology made visible.
