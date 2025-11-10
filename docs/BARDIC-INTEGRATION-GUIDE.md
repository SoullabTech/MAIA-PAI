# Bardic Memory Integration Guide

## How to Add Bardic Memory to MAIA's Interface

---

## 🎯 Two Activation Methods

### 1. **Menu Button** (Visual UI)
Users click a "Bardic Memory" button in MAIA's navigation

### 2. **Natural Language Invocation** (Ritual)
Users say phrases like "Let the Bard speak" in chat

---

## 📝 Step-by-Step Integration

### Step 1: Add Bardic Menu Button to MAIA Navigation

In `/app/maia/page.tsx`, add the Bardic menu button next to existing controls:

```tsx
import { BardicMenuButton, BardicMenu, type BardicFeature } from '@/components/Bardic/BardicMenu';
import { FireQueryInterface } from '@/components/Bardic/FireQueryInterface';
import { BardicDrawer } from '@/components/Bardic/BardicDrawer';
import { VirtueLedger } from '@/components/Bardic/VirtueLedger'; // To be created

export default function MAIAPage() {
  const [bardicMenuOpen, setBardicMenuOpen] = useState(false);
  const [activeBardicFeature, setActiveBardicFeature] = useState<BardicFeature | null>(null);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string | null>(null);

  // Handle bardic feature selection
  function handleBardicFeatureSelect(feature: BardicFeature) {
    setActiveBardicFeature(feature);
  }

  return (
    <div className="relative">
      {/* Existing MAIA interface */}

      {/* Navigation Bar - Add Bardic button */}
      <div className="flex items-center gap-2">
        {/* Existing buttons: voice settings, etc. */}

        {/* NEW: Bardic Memory Button */}
        <div className="relative">
          <BardicMenuButton
            onClick={() => setBardicMenuOpen(!bardicMenuOpen)}
            hasNewResonance={false} // Set to true when resonance detected
          />

          <BardicMenu
            isOpen={bardicMenuOpen}
            onClose={() => setBardicMenuOpen(false)}
            onFeatureSelect={handleBardicFeatureSelect}
          />
        </div>
      </div>

      {/* Bardic Feature Modals */}
      {activeBardicFeature === 'fire-query' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
            <FireQueryInterface
              userId={explorerId}
              authToken={getAuthToken()}
              onTelosSelect={(telos) => {
                console.log('Telos selected:', telos);
              }}
            />
            <button
              onClick={() => setActiveBardicFeature(null)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeBardicFeature === 'thread' && (
        <BardicDrawer
          isOpen={true}
          onClose={() => setActiveBardicFeature(null)}
          currentEpisodeId={currentEpisodeId}
          userId={explorerId}
          authToken={getAuthToken()}
        />
      )}

      {/* Add other features as needed */}
    </div>
  );
}
```

---

### Step 2: Add Natural Language Invocation to Chat Route

In `/api/oracle/personal/route.ts` (or wherever MAIA processes messages):

```typescript
import { processBardicInvocation } from '@/lib/bardic/invocations';
import { createEpisode } from '@/lib/services/episode-service';
import { withAuthAndQuota, safeLogUsage } from '@/lib/middleware/quota-middleware';

export async function POST(request: NextRequest) {
  // Auth & quota
  const check = await withAuthAndQuota(request);
  if (!check.allowed) return check.errorResponse!;

  const { userId } = check;
  const { message, sessionId } = await request.json();

  // ========================================================================
  // CHECK FOR BARDIC INVOCATION
  // ========================================================================
  const bardicResponse = processBardicInvocation(message);

  if (bardicResponse.shouldInvoke) {
    // User said something like "Let the Bard speak"
    return NextResponse.json({
      response: bardicResponse.responseText,
      bardicInvocation: {
        type: bardicResponse.invocation!.type,
        uiTrigger: bardicResponse.uiTrigger,
      },
    });
  }

  // ========================================================================
  // NORMAL MAIA RESPONSE (existing logic)
  // ========================================================================
  const maiaResponse = await generateMAIAResponse(message, userId, sessionId);

  // ========================================================================
  // SILENT EPISODE CREATION (background)
  // ========================================================================
  createEpisode({
    userId,
    datetime: new Date(),
    sceneStanza: `${message.substring(0, 100)}...`,
    affectValence: 0.5, // Detect from message
    affectArousal: 0.5,
    dominantElement: 'air', // Detect from message
  }).catch(err => {
    console.error('Episode creation failed (non-fatal):', err);
  });

  // ========================================================================
  // LOG USAGE
  // ========================================================================
  await safeLogUsage({
    userId,
    operation: 'chat_message',
    inputTokens: estimateTokens(message),
    outputTokens: estimateTokens(maiaResponse),
  });

  return NextResponse.json({ response: maiaResponse });
}
```

---

### Step 3: Handle Bardic Invocation Responses in Frontend

In your chat component (e.g., `OracleConversation.tsx`):

```tsx
import { InvocationHint } from '@/components/Bardic/BardicMenu';

function ChatComponent() {
  const [showInvocationHint, setShowInvocationHint] = useState(false);
  const [detectedInvocation, setDetectedInvocation] = useState<any>(null);

  async function sendMessage(message: string) {
    const response = await fetch('/api/oracle/personal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });

    const data = await response.json();

    // Check if bardic invocation was detected
    if (data.bardicInvocation) {
      setDetectedInvocation(data.bardicInvocation);
      setShowInvocationHint(true);

      // Show MAIA's acknowledgment
      addMessage({
        role: 'assistant',
        content: data.response, // e.g., "The Bard speaks. Sensing what wants to emerge..."
      });
    } else {
      // Normal message
      addMessage({
        role: 'assistant',
        content: data.response,
      });
    }
  }

  return (
    <div>
      {/* Invocation Hint (appears when detected) */}
      {showInvocationHint && detectedInvocation && (
        <InvocationHint
          triggerText="Let the Bard speak"
          invocationType={detectedInvocation.type}
          onActivate={() => {
            setActiveBardicFeature(detectedInvocation.type);
            setShowInvocationHint(false);
          }}
          onDismiss={() => setShowInvocationHint(false)}
        />
      )}

      {/* Chat messages */}
      {/* ... */}
    </div>
  );
}
```

---

## 🎨 Visual Design in MAIA

### Menu Placement Options

**Option A: Top Right Navigation** (Recommended)
```
┌─────────────────────────────────────────┐
│  MAIA    [Voice] [Settings] [📖 Bardic] │
│                                         │
│  Chat messages here...                  │
└─────────────────────────────────────────┘
```

**Option B: Sidebar Tab**
```
┌──┬──────────────────────────────────────┐
│🏠│  MAIA Chat                           │
│💬│                                      │
│📖│  Messages...                         │
│  │                                      │
└──┴──────────────────────────────────────┘
```

**Option C: Bottom Action Bar** (Mobile-friendly)
```
┌─────────────────────────────────────────┐
│  MAIA Chat                              │
│                                         │
│  Messages...                            │
│                                         │
├─────────────────────────────────────────┤
│  [🔥] [🧵] [📖] [💬 Type message...]    │
└─────────────────────────────────────────┘
```

---

## 🗣️ Invocation Phrases

Users can say any of these to activate bardic features:

### Fire Query
- "Let the Bard speak"
- "What wants to emerge?"
- "What's pulling me forward?"
- "Show me what's crystallizing"

### Narrative Threads
- "Show me the thread"
- "Weave the thread"
- "How does this connect?"

### Virtue Ledger
- "Show my practice"
- "What am I cultivating?"
- "Virtue ledger"

### Memory Recall
- "Remember when..."
- "Take me back to..."
- "Recall that moment about..."

### Sacred Witness
- "Witness this"
- "Hold this sacred"
- "Don't analyze, just witness"

---

## 🎭 User Experience Flow

### Example: Fire Query Invocation

1. **User types**: "Let the Bard speak"

2. **MAIA responds**:
   ```
   The Bard speaks. I'm sensing into what wants to emerge...

   [Invocation detected: Fire Query]
   [Invoke] [Dismiss]
   ```

3. **User clicks "Invoke"**

4. **Fire Query Interface opens** showing:
   - What wants to emerge?
   - What's pulling me forward?
   - What's becoming clearer?

5. **User explores teloi** and sees crystallization patterns

---

## 🔇 Silent Background Operations

These run automatically without any UI indication:

```typescript
// After every chat message (SILENT)
createEpisode({
  userId,
  datetime: new Date(),
  sceneStanza: extractEssence(message), // 1-2 sentence summary
  // ... elemental/affect data
});

// When vulnerability detected (SILENT)
logMicroactByPhrase(userId, 'Shared vulnerability', {
  virtueCategory: 'courage',
});

// When alignment detected (SILENT)
if (telosId && deltaDetected) {
  logTelosAlignment({
    episodeId,
    telosId,
    delta: 0.15,
  });
}
```

**User sees**: Nothing. Data accumulates silently.

---

## 📱 Mobile Considerations

### Invocation on Mobile
- **Bottom action bar** with Bardic icon (📖)
- **Swipe up** from bottom to open Bardic menu
- **Voice command**: "Hey MAIA, let the Bard speak"

### Component Adaptations
- FireQueryInterface: Scrollable, full-screen modal
- BardicDrawer: Full-screen on mobile (not drawer)
- VirtueLedger: Compact card view

---

## 🎨 Icon Recommendations

- **Bardic Menu**: 📖 `BookOpen` (Lucide)
- **Fire Query**: 🔥 `Flame`
- **Narrative Threads**: 🧵 `Wind`
- **Virtue Ledger**: 💚 `Heart`
- **Memory Recall**: 📜 `Scroll`
- **Sacred Witness**: ✨ `Sparkles`

---

## ⚙️ Configuration

Add to MAIA settings:

```typescript
interface MaiaSettings {
  // ... existing settings

  bardic: {
    enabled: boolean;
    invocationsEnabled: boolean; // Natural language triggers
    menuLocation: 'top-right' | 'sidebar' | 'bottom-bar';
    autoCreateEpisodes: boolean; // Silent background
    resonanceThreshold: number; // 0-1
    showResonanceHints: boolean;
  };
}
```

---

## 🚀 Rollout Plan

### Week 1: Silent Foundation
- Deploy episode auto-creation (silent)
- Test data accumulation
- No UI changes

### Week 2: Menu Integration
- Add Bardic menu button
- Fire Query interface
- Narrative Threads drawer

### Week 3: Invocations
- Enable natural language triggers
- Add invocation hints
- User onboarding

### Week 4: Enhancement
- Virtue Ledger
- Memory Recall
- Sacred Witness mode

---

## ✨ Example User Journey

**Day 1**: User chats with MAIA normally. Episodes created silently.

**Day 7**: User notices 📖 Bardic button in nav. Clicks it. Sees menu.

**Day 14**: User says "Let the Bard speak" during conversation. MAIA responds poetically. Fire Query opens. User sees "What wants to emerge?" and discovers 3 crystallizing teloi.

**Day 30**: User regularly checks Virtue Ledger. Sees 45-day streak for "Morning practice." Feels proud.

**Day 60**: User says "Show me the thread" after profound conversation. Drawer opens revealing connections to 12 past episodes spanning 8 weeks. User sees their own story emerging.

---

## 📊 Success Metrics

- **Adoption**: % of users who open Bardic menu
- **Engagement**: Avg. invocations per week
- **Retention**: Users who return to bardic features
- **Discovery**: Most popular invocation phrases
- **Impact**: User feedback on "seeing their story"

---

**The Bardic Memory lives in the interface, waiting to be invoked.** 🎭
