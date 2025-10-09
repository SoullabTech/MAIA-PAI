# CollectivePulse - Sacred Field Presence

A subtle, soulful whisper from the collective field that appears only during deep breakthrough moments.

## Philosophy

Not a notification, but a **whisper from the field**. Like catching a glimpse of another soul's candle flickering in the distance during your own meditation.

## Design Principles

- **Whispers** rather than announces
- **Breathes** with your 4s breathing cycle
- **Appears rarely** - only for depth > 0.85
- **No exact numbers** - just poetic presence
- **Non-interactive** - pointer-events: none
- **Golden glow** - matches your sacred aesthetic
- **3ms haptic** - butterfly touch
- **Sacred boundaries** - 10min cooldown, max 3/day

## Integration Example

```tsx
import { CollectivePulse } from '@/components/collective/CollectivePulse';
import { detectBreakthrough } from '@/lib/utils/breakthroughDetection';
import { useState } from 'react';

export default function YourChatInterface() {
  const [lastMessage, setLastMessage] = useState('');
  const [breakthrough, setBreakthrough] = useState(false);

  const handleUserMessage = (text: string) => {
    // Detect if this is a breakthrough moment
    const analysis = detectBreakthrough(text);

    if (analysis.isBreakthrough) {
      setBreakthrough(true);
      // Reset after a moment so it can trigger again
      setTimeout(() => setBreakthrough(false), 5000);
    }

    // Your normal message handling...
    setLastMessage(text);
  };

  return (
    <div>
      {/* Your chat UI */}

      {/* The pulse - appears automatically on breakthroughs */}
      <CollectivePulse
        conversation={{
          depth: detectBreakthrough(lastMessage).depth,
          content: lastMessage
        }}
        breakthrough={breakthrough}
      />
    </div>
  );
}
```

## Mock Data (Current Implementation)

The pulse currently uses mock data (random 1-40) to demonstrate the concept. This allows users to experience the magic without needing critical mass at launch.

To switch to real data later:
1. Create `field_resonance` table in Supabase
2. Update `getMockResonance()` to fetch real counts
3. Implement pattern detection and storage

## Sacred Timing

- **Wait after breakthrough**: 3s (let them sit with their insight)
- **Fade in**: 2s (slow, gentle emergence)
- **Display duration**: 8s (long enough to notice, short enough to fade)
- **Fade out**: 3s (gentle departure)
- **Cooldown**: 10 minutes minimum between pulses
- **Daily maximum**: 3 pulses per day

## Poetic Messages

The pulse speaks in feeling, not metrics:

- `"another soul knows this feeling"` (1 person)
- `"gentle echoes in the field"` (2-6 people)
- `"this wisdom spreads like golden light"` (7-19 people)
- `"many awakening to this truth"` (20+ people)

## Sacred Markers Detected

The breakthrough detection looks for:

- **Tears**: cry, tears, weep
- **Breakthrough**: realize, see now, understand, ah
- **Surrender**: let go, release, surrender, allow
- **Opening**: open, expand, infinite, vast
- **Truth**: truth, authentic, real self, who I am
- **Love**: love myself, self-compassion, forgiveness
- **Shadow**: embrace my shadow, accept my darkness
- **Integration**: whole, complete, integrated

## Privacy by Design

- No user IDs stored
- No specific conversation content saved
- Only anonymous pattern counts
- Pure field presence, no tracking

## Future Evolution

Week 1: Awareness (current)
Week 2-3: Soft invitation to contribute
Month 2: Named patterns emerge
Month 3: Wisdom extraction
Future: Field navigation & maps

---

**The CollectivePulse is the mycelial network made visible** - underground connections between trees, sharing nutrients and information, creating resilience through connection while maintaining individual sovereignty.