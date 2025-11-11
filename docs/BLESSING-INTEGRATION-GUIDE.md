# Blessing Integration Guide

## How to Add Bardic Blessings to MAIA's Chat Flow

This guide shows you how to integrate the blessing system into your chat interface so that Bardic offerings appear at key moments.

---

## 🎯 What Are Blessings?

Blessings are **sacred offerings** of Bardic Memory features at meaningful moments:

- **Conversation endings**: "Before you go... would you like to see what you've been cultivating?"
- **Breakthrough moments**: "This clarity... it didn't come from nowhere. Would you like to see the thread that led here?"
- **Threshold crossings**: "You're crossing a threshold. Would you like to see what else wants to emerge?"
- **Pattern circling**: "You've touched this theme before. Would you like to see the thread?"
- **Milestones**: "7 day streak! 🔥 Would you like to see the full story of what you've been building?"

**Not hidden. Not intrusive. Offered as gifts.**

---

## 📝 Step-by-Step Integration

### Step 1: Add Blessing Detection to Chat API

In your chat route (e.g., `/app/api/oracle/personal/route.ts`):

```typescript
import { checkForBlessing, autoCreateEpisode } from '@/lib/bardic';
import { withAuthAndQuota, safeLogUsage } from '@/lib/middleware/quota-middleware';

export async function POST(request: NextRequest) {
  // Auth & quota
  const check = await withAuthAndQuota(request);
  if (!check.allowed) return check.errorResponse!;

  const { userId } = check;
  const { message, sessionId } = await request.json();

  // ========================================================================
  // GENERATE MAIA RESPONSE (your existing logic)
  // ========================================================================
  const maiaResponse = await generateMAIAResponse(message, userId, sessionId);

  // ========================================================================
  // SILENT EPISODE CREATION (background)
  // ========================================================================
  autoCreateEpisode({
    userId,
    message,
    // Optional: detect affect and element from message
    affectValence: detectValence(message),
    affectArousal: detectArousal(message),
    dominantElement: detectElement(message),
  }).catch(err => {
    console.error('Episode creation failed (non-fatal):', err);
  });

  // ========================================================================
  // CHECK FOR BLESSING MOMENT
  // ========================================================================
  const blessingResult = await checkForBlessing({
    userId,
    currentMessage: message,
    sessionId,
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

  // ========================================================================
  // RETURN RESPONSE WITH OPTIONAL BLESSING
  // ========================================================================
  return NextResponse.json({
    response: maiaResponse,
    blessing: blessingResult.shouldShow ? blessingResult.blessing : undefined,
  });
}
```

---

### Step 2: Add Blessing Component to Chat UI

In your chat component (e.g., `OracleConversation.tsx`):

```tsx
import { BlessingOffer } from '@/components/Bardic/BlessingOffer';
import { BardicDrawer } from '@/components/Bardic/BardicDrawer';
import { FireQueryInterface } from '@/components/Bardic/FireQueryInterface';
import { VirtueLedger } from '@/components/Bardic/VirtueLedger';
import type { BlessingMoment, BardicOffering } from '@/lib/bardic';
import { useState } from 'react';

function ChatComponent() {
  const [currentBlessing, setCurrentBlessing] = useState<BlessingMoment | null>(null);
  const [showBlessing, setShowBlessing] = useState(false);
  const [activeBardicFeature, setActiveBardicFeature] = useState<BardicOffering | null>(null);

  async function sendMessage(message: string) {
    const response = await fetch('/api/oracle/personal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });

    const data = await response.json();

    // Add MAIA's response to chat
    addMessage({
      role: 'assistant',
      content: data.response,
    });

    // Check if blessing was offered
    if (data.blessing) {
      setCurrentBlessing(data.blessing);
      setShowBlessing(true);
    }
  }

  async function handleBlessingAccept() {
    if (!currentBlessing) return;

    // Log acceptance
    await fetch('/api/bardic/blessings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'accept',
        offeringType: currentBlessing.suggestedOffering,
        blessingType: currentBlessing.type,
        confidence: currentBlessing.confidence,
      }),
    });

    // Open the appropriate Bardic feature
    setActiveBardicFeature(currentBlessing.suggestedOffering);
    setShowBlessing(false);
  }

  async function handleBlessingDismiss() {
    if (!currentBlessing) return;

    // Log dismissal
    await fetch('/api/bardic/blessings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'dismiss',
        offeringType: currentBlessing.suggestedOffering,
        blessingType: currentBlessing.type,
        confidence: currentBlessing.confidence,
      }),
    });

    setShowBlessing(false);
    setCurrentBlessing(null);
  }

  return (
    <div>
      {/* Chat messages */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Blessing offer (appears after certain messages) */}
      {currentBlessing && (
        <BlessingOffer
          blessing={currentBlessing}
          onAccept={handleBlessingAccept}
          onDismiss={handleBlessingDismiss}
          isVisible={showBlessing}
        />
      )}

      {/* Bardic Feature Modals */}
      {activeBardicFeature === 'fire-query' && (
        <div className="modal-overlay">
          <FireQueryInterface
            userId={userId}
            authToken={getAuthToken()}
            onTelosSelect={(telos) => console.log('Telos selected:', telos)}
          />
          <button onClick={() => setActiveBardicFeature(null)}>Close</button>
        </div>
      )}

      {activeBardicFeature === 'thread' && (
        <BardicDrawer
          isOpen={true}
          onClose={() => setActiveBardicFeature(null)}
          currentEpisodeId={currentEpisodeId}
          userId={userId}
          authToken={getAuthToken()}
        />
      )}

      {activeBardicFeature === 'virtue-ledger' && (
        <div className="modal-overlay">
          <VirtueLedger userId={userId} authToken={getAuthToken()} />
          <button onClick={() => setActiveBardicFeature(null)}>Close</button>
        </div>
      )}

      {/* Chat input */}
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
      />
    </div>
  );
}
```

---

### Step 3: Add Shimmer Animation to Global CSS

In `app/globals.css`:

```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 3s infinite;
}
```

---

## 🎨 Blessing Types and Offerings

### Blessing Types
- `conversation-end` - User saying goodbye, thank you, etc.
- `breakthrough` - User expressing clarity, realization
- `threshold` - User making a decision, starting something new
- `pattern-detected` - User circling a theme they've touched before
- `milestone` - User reaching a streak or count milestone
- `user-seeking` - User explicitly invoking a Bardic feature

### Offered Features
- `thread` - Show narrative threads between episodes
- `fire-query` - Ask what wants to emerge / what's crystallizing
- `virtue-ledger` - Show Earth layer practice and streaks
- `crystallization` - Show specific crystallizing telos
- `sacred-witness` - Witness mode (hold without analysis)

---

## 🔇 Silent Background Operations

These run automatically without any user-facing UI:

```typescript
// After every chat message (SILENT)
autoCreateEpisode({
  userId,
  message,
  affectValence: detectValence(message),
  affectArousal: detectArousal(message),
  dominantElement: detectElement(message),
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

**User sees**: Nothing. Data accumulates silently in the background, ready to be revealed when blessed.

---

## 📊 Blessing Analytics

The system tracks which blessings resonate with users:

```typescript
// Get user's acceptance rate
const analytics = await fetch('/api/bardic/blessings/analytics');
const { userAcceptanceRate, mostAcceptedTypes } = await analytics.json();

// userAcceptanceRate: 0.0 to 1.0
// mostAcceptedTypes: Array of blessing types sorted by acceptance rate
```

Use this to learn which offerings resonate most with your users.

---

## ⚙️ Configuration

### Dismissal Cooldown

By default, dismissed blessings won't show again for 24 hours. Adjust in `blessing-service.ts`:

```typescript
const DISMISSAL_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
```

### Blessing Confidence Threshold

Blessings have confidence scores (0.0 to 1.0). You can filter by confidence:

```typescript
if (blessingResult.shouldShow && blessingResult.blessing.confidence >= 0.9) {
  setCurrentBlessing(blessingResult.blessing);
  setShowBlessing(true);
}
```

---

## 🎭 User Experience Flow

### Example: Conversation End Blessing

1. **User types**: "Thanks, this was really helpful. I should go."

2. **System**:
   - Detects conversation end pattern
   - Checks recent episodes for pattern circling
   - Finds recurring theme about "creative practice"
   - Creates blessing moment

3. **MAIA responds**: "I'm glad this resonated with you."

4. **Blessing appears below response**:
   ```
   ╔═══════════════════════════════════════════════╗
   ║  BEFORE YOU GO                                ║
   ║                                               ║
   ║  Before you go... would you like to see the   ║
   ║  thread you've been weaving? I sense a        ║
   ║  pattern across your recent conversations.    ║
   ║                                               ║
   ║  [🧵 Show me the thread]  [Not right now]    ║
   ╚═══════════════════════════════════════════════╝
   ```

5. **User clicks "Show me the thread"**

6. **Bardic Drawer opens** revealing narrative connections across 12 episodes spanning 8 weeks, all touching themes of creative practice and resistance.

7. **User sees their own story emerging**.

---

## ✨ Philosophy

> "The Bardic Memory doesn't hide in the background. It doesn't interrupt. It offers itself as a blessing at sacred moments, when the user is ready to receive the gift of seeing their own becoming."

Blessings are:
- **Sacred**: Offered at meaningful moments, not random prompts
- **Generous**: Gifts, not features to be sold
- **Respectful**: Can be dismissed without penalty
- **Learning**: The system learns which offerings resonate

**Not**:
- Notifications
- Interruptions
- Gamification
- Engagement hacks

---

## 🚀 Testing Your Integration

1. **Test conversation endings**:
   - Send message: "Thanks, this helped a lot!"
   - Should see virtue ledger or thread offering

2. **Test breakthrough moments**:
   - Send message: "Oh wow, I get it now! That makes so much sense."
   - Should see thread offering

3. **Test thresholds**:
   - Send message: "I decided to quit my job. I'm ready for something new."
   - Should see fire query offering

4. **Test milestones**:
   - Create 7 microact logs over 7 days
   - Should see virtue ledger offering with "7 day streak! 🔥"

5. **Test dismissal cooldown**:
   - Dismiss a blessing
   - Send similar message within 24 hours
   - Blessing should NOT appear again

---

## 📱 Mobile Considerations

- Blessing cards are responsive and work on mobile
- Use full-width modals for Bardic features on small screens
- Consider swipe-to-dismiss gesture for blessings

---

**The blessing system is complete and ready to integrate.** 🎭
