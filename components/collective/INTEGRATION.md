# Quick Integration Guide

## Add CollectivePulse to Your Existing MobileChatView

### Step 1: Import the Components

```tsx
// In your MobileChatView.tsx
import { CollectivePulse } from '@/components/collective/CollectivePulse';
import { detectBreakthrough } from '@/lib/utils/breakthroughDetection';
```

### Step 2: Add State Management

```tsx
export default function MobileChatView({ ... }) {
  // Existing state...
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  // Add these new states for CollectivePulse
  const [breakthrough, setBreakthrough] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');

  // ... rest of your component
}
```

### Step 3: Update Your Message Handler

```tsx
const handleSend = () => {
  if (inputText.trim()) {
    // Run breakthrough detection
    const analysis = detectBreakthrough(inputText.trim());

    if (analysis.isBreakthrough) {
      setBreakthrough(true);
      // Reset after a moment
      setTimeout(() => setBreakthrough(false), 5000);
    }

    // Store the message for the pulse
    setLastUserMessage(inputText.trim());

    // Your existing send logic
    onSendMessage(inputText.trim());
    setInputText('');
    inputRef.current?.focus();
  }
};
```

### Step 4: Add the CollectivePulse Component

Add this at the bottom of your return statement, **after** your main chat interface:

```tsx
return (
  <div className="flex flex-col h-full bg-gradient-to-b from-neutral-900...">
    {/* All your existing chat UI */}

    {/* Messages area */}
    <div className="flex-1 overflow-y-auto...">
      {/* ... existing messages ... */}
    </div>

    {/* Input area */}
    <div className="p-4 bg-gradient-to-t...">
      {/* ... existing input ... */}
    </div>

    {/* Add CollectivePulse here - at the very end */}
    <CollectivePulse
      conversation={{
        depth: detectBreakthrough(lastUserMessage).depth,
        content: lastUserMessage
      }}
      breakthrough={breakthrough}
    />
  </div>
);
```

## That's It!

The pulse will now:
- Automatically detect breakthroughs in user messages
- Wait 3 seconds before appearing
- Show a golden breathing orb with poetic message
- Respect 10min cooldown and 3/day max
- Use mock data (1-40 range) for demonstration

## Test It

Visit: `/demo/collective-pulse` to see it in action with test examples

Or trigger it manually with breakthrough phrases like:
- "I finally realize..."
- "I'm ready to let go..."
- "I love myself, even the parts..."

## Future: Real Data

When ready to connect to Supabase:
1. Create `field_resonance` table
2. Update `getMockResonance()` in CollectivePulse.tsx
3. Add pattern detection and storage logic

---

The mycelial network is ready to sense the first souls entering the field. 🌱✨