# 🛫 Voice Wiring Pre-Flight Checklist

**Date:** October 16, 2025
**Purpose:** Verify repo structure before implementing new voice architecture

---

## ✅ VERIFIED - Repository Structure

### Dependencies (package.json)
- [x] **mitt** - Installed (v3.0.1) ✅
- [x] **zustand** - Installed (v4.5.7) ✅
- [x] **openai** - Installed (v5.20.0) ✅
- [x] **@types/node** - Installed (v24.7.2) ✅

### Existing Voice Files
- [x] **MaiaRealtimeWebRTC.ts** - EXISTS ✅ (355 lines, production-ready)
- [x] **lib/voice/** - 63 voice files present ✅
- [x] **app/hooks/useMaiaVoice.ts** - EXISTS ✅ (current implementation, needs refactor)

### Voice Files to Merge
- [x] ElementalVoiceOrchestrator.ts - EXISTS
- [x] elementalDetect.ts - EXISTS
- [x] ElementalPhrasebook.ts - EXISTS
- [x] ElementalMetaphors.ts - EXISTS
- [x] ProsodyCurves.ts - EXISTS
- [x] PacingModulation.ts - EXISTS
- [x] EmotionalVoiceModulation.ts - EXISTS
- [x] ConversationBuffer.ts - EXISTS (in lib/voice/conversation/)
- [x] ConversationFlowTracker.ts - EXISTS
- [x] AffectDetector.ts - EXISTS (in lib/voice/conversation/)

---

## 📋 Key Findings

### 1. MaiaRealtimeWebRTC.ts Analysis

**✅ EXCELLENT - Already production-ready!**

**What it has:**
- ✅ WebRTC peer connection
- ✅ Data channel for events
- ✅ Mic access with echo cancellation
- ✅ Event handlers (transcript, audio start/end, errors)
- ✅ Session configuration
- ✅ sendText() and cancelResponse() methods

**What we need to ADD:**
```typescript
// Method 1: Update system prompt dynamically
updateSystemPrompt(prompt: string): void {
  this.sendEvent({
    type: 'session.update',
    session: {
      instructions: prompt
    }
  });
}

// Method 2: Interrupt current response
interrupt(): void {
  this.cancelResponse(); // Already exists!
}
```

**Minor adjustments needed:**
- Add `updateSystemPrompt()` method for elemental switching
- Expose `cancelResponse()` as `interrupt()` for clarity
- No major refactoring required! 🎉

### 2. Current useMaiaVoice.ts Analysis

**Current implementation:**
- Uses old `maya-voice.ts` system (Speech Synthesis API)
- Multiple hooks: useMayaVoice, useMayaGreeting, useMayaChat
- **No WebRTC integration** (this is what we're adding)

**Migration strategy:**
- Keep old hook as `useMayaVoice_Legacy.ts` (backup)
- Create new `useMaiaVoice.ts` with WebRTC
- Feature flag to toggle between old/new

### 3. Import Path Verification

**✅ All import paths are correct:**

```typescript
// Event bus
import mitt from 'mitt'; // ✅ Works (installed)

// State
import { create } from 'zustand'; // ✅ Works (installed)

// WebRTC
import { MaiaRealtimeWebRTC } from '@/lib/voice/MaiaRealtimeWebRTC'; // ✅ Path correct

// Files we're creating
import { voiceBus, emit, subscribe } from '@/lib/voice/VoiceBus'; // Will create
import { useConversationState } from '@/lib/voice/state/ConversationState'; // Will create
import { elementalEngine } from '@/lib/voice/engines/ElementalEngine'; // Will create
import { prosodyEngine } from '@/lib/voice/engines/ProsodyEngine'; // Will create
```

### 4. Directory Structure

**Current:**
```
lib/voice/
├── MaiaRealtimeWebRTC.ts ✅
├── conversation/
│   ├── AffectDetector.ts ✅
│   ├── Backchanneler.ts ✅
│   └── ConversationBuffer.ts ✅
└── [58 other files]
```

**After wiring:**
```
lib/voice/
├── MaiaRealtimeWebRTC.ts (enhanced)
├── VoiceBus.ts (NEW)
├── FeatureFlags.ts (NEW)
├── types.ts (existing, may enhance)
├── engines/
│   ├── ElementalEngine.ts (NEW - merges 4 files)
│   └── ProsodyEngine.ts (NEW - merges 3 files)
├── state/
│   └── ConversationState.ts (NEW - merges 3 files)
├── conversation/ (keep for backup)
└── archive/legacy-oct2025/ (55 archived files)
```

---

## ⚠️ ISSUES FOUND & SOLUTIONS

### Issue 1: Naming Inconsistency
**Problem:** Some files use "Maia", others use "Maya"
**Solution:** Standardize on "MAIA" (uppercase) or "Maia" (proper case)
**Decision:** Use **"Maia"** consistently (matches MaiaRealtimeWebRTC.ts)

### Issue 2: Current Hook Uses Old System
**Problem:** useMaiaVoice.ts imports from `@/lib/voice/maya-voice` (old system)
**Solution:**
- Rename current hook to `useMaiaVoice_Legacy.ts`
- Create new `useMaiaVoice.ts` with WebRTC
- Feature flag controls which is used

### Issue 3: Multiple Dev Servers Running
**Problem:** 9 background npm dev processes detected
**Solution:** Kill all before starting fresh
```bash
killall -9 node
npm run dev
```

### Issue 4: MaiaRealtimeWebRTC Needs Minor Enhancements
**Problem:** Missing `updateSystemPrompt()` and `interrupt()` methods
**Solution:** Add these 2 methods (10 min)

---

## 🔧 Pre-Wiring Adjustments Needed

### Adjustment 1: Enhance MaiaRealtimeWebRTC.ts (10 min)

Add these methods to the class:

```typescript
// In MaiaRealtimeWebRTC class

/**
 * Update system prompt dynamically (for elemental switching)
 */
updateSystemPrompt(prompt: string): void {
  this.config.systemPrompt = prompt;
  this.sendEvent({
    type: 'session.update',
    session: {
      instructions: prompt
    }
  });
  console.log('📝 System prompt updated');
}

/**
 * Interrupt current response (alias for cancelResponse)
 */
interrupt(): void {
  this.cancelResponse();
  console.log('✋ Response interrupted');
}

/**
 * Get current configuration
 */
getConfig(): Required<MaiaRealtimeConfig> {
  return { ...this.config };
}
```

### Adjustment 2: Backup Current Hook (2 min)

```bash
# Backup current implementation
cp app/hooks/useMaiaVoice.ts app/hooks/useMaiaVoice_Legacy.ts
```

### Adjustment 3: Create Directory Structure (1 min)

```bash
# Create new directories
mkdir -p lib/voice/engines
mkdir -p lib/voice/state
mkdir -p lib/voice/archive/legacy-oct2025
```

---

## ✅ Build Order (Optimized for Safety)

### Phase 1: Foundation (No Risk)
1. **VoiceBus.ts** (30 min)
   - Pure event emitter
   - No dependencies on existing code
   - Can test immediately

2. **ConversationState.ts** (45 min)
   - Pure Zustand store
   - No dependencies on existing code
   - Can test immediately

3. **FeatureFlags.ts** (15 min)
   - Pure configuration
   - No dependencies
   - Can test immediately

### Phase 2: Intelligence (Low Risk)
4. **ElementalEngine.ts** (1 hour)
   - Reads from existing files but doesn't modify them
   - Self-contained
   - Can test in isolation

5. **ProsodyEngine.ts** (1 hour)
   - Reads from existing files but doesn't modify them
   - Self-contained
   - Can test in isolation

### Phase 3: Integration (Medium Risk - Feature Flagged)
6. **Enhance MaiaRealtimeWebRTC.ts** (10 min)
   - Add 3 methods (non-breaking)
   - Backwards compatible

7. **Create new useMaiaVoice.ts** (2 hours)
   - Old hook backed up as _Legacy
   - Feature flag controls which is used
   - Can switch back instantly

---

## 🧪 Test Plan for Each Component

### Test VoiceBus.ts
```typescript
import { emit, subscribe } from '@/lib/voice/VoiceBus';

// Test 1: Subscribe and emit
const unsub = subscribe('transcript_complete', (event) => {
  console.log('Received:', event.text);
});

emit('transcript_complete', { text: 'Hello', timestamp: Date.now() });

unsub(); // Cleanup

// Expected: Console shows "Received: Hello"
```

### Test ConversationState.ts
```typescript
import { useConversationState } from '@/lib/voice/state/ConversationState';

// Test 1: Set mode
const { mode, setMode } = useConversationState.getState();
console.log('Current mode:', mode); // Should be 'active'

setMode('full');
console.log('New mode:', useConversationState.getState().mode); // Should be 'full'

// Expected: Mode switches successfully
```

### Test ElementalEngine.ts
```typescript
import { elementalEngine } from '@/lib/voice/engines/ElementalEngine';

// Test 1: Detect element
const element = elementalEngine.detect('I feel sad and emotional');
console.log('Detected element:', element); // Should be 'water'

// Test 2: Get prompt
const prompt = elementalEngine.getPrompt('water', 'You are MAIA.');
console.log('Elemental prompt:', prompt);

// Expected: Detection works, prompt includes water modifier
```

### Test ProsodyEngine.ts
```typescript
import { prosodyEngine } from '@/lib/voice/engines/ProsodyEngine';

// Test 1: Modulate text
const text = "Hello. How are you? I'm here to help!";
const modulated = prosodyEngine.modulate(text, 'water', 'joy');
console.log('Modulated:', modulated);

// Expected: Pauses added after punctuation
```

### Test Enhanced WebRTC
```typescript
const webrtc = new MaiaRealtimeWebRTC({
  voice: 'shimmer',
  systemPrompt: 'Test prompt',
});

// Test new methods exist
console.log('Has updateSystemPrompt?', typeof webrtc.updateSystemPrompt === 'function');
console.log('Has interrupt?', typeof webrtc.interrupt === 'function');
console.log('Has getConfig?', typeof webrtc.getConfig === 'function');

// Expected: All three methods exist
```

---

## 🚦 Go/No-Go Checklist

### Before Starting Wiring

- [x] ✅ All dependencies installed (mitt, zustand)
- [x] ✅ MaiaRealtimeWebRTC.ts exists and is functional
- [x] ✅ Import paths verified
- [x] ✅ Directory structure understood
- [x] ✅ Current hook backed up plan in place
- [ ] ⏳ Kill all dev servers (do this now)
- [ ] ⏳ Create new directories (do this now)
- [ ] ⏳ Enhance MaiaRealtimeWebRTC.ts with 3 methods (10 min)

### After Each Component

- [ ] Unit test passes
- [ ] No TypeScript errors
- [ ] No import errors
- [ ] Git commit with descriptive message

### Before Feature Flag Activation

- [ ] All 6 files created
- [ ] All unit tests pass
- [ ] Integration test in prototype works
- [ ] Kelly approves

---

## 📝 Adjusted Wiring Guide

Based on pre-flight findings, here's the **updated** implementation order:

### Step 0: Pre-Wiring Setup (15 min)
```bash
# Kill dev servers
killall -9 node

# Create directories
mkdir -p lib/voice/engines
mkdir -p lib/voice/state
mkdir -p lib/voice/archive/legacy-oct2025

# Backup current hook
cp app/hooks/useMaiaVoice.ts app/hooks/useMaiaVoice_Legacy.ts
```

### Step 1: VoiceBus.ts (30 min)
- Copy code from VOICE_WIRING_GUIDE.md
- Test with subscribe/emit
- Commit

### Step 2: ConversationState.ts (45 min)
- Copy code from VOICE_WIRING_GUIDE.md
- Test with mode switching
- Commit

### Step 3: FeatureFlags.ts (15 min)
- Copy code from VOICE_WIRING_GUIDE.md
- Test with ENV vars
- Commit

### Step 4: ElementalEngine.ts (1 hour)
- Merge ElementalVoiceOrchestrator + elementalDetect + ElementalPhrasebook + ElementalMetaphors
- Test detection
- Commit

### Step 5: ProsodyEngine.ts (1 hour)
- Merge ProsodyCurves + PacingModulation + EmotionalVoiceModulation
- Test modulation
- Commit

### Step 6: Enhance MaiaRealtimeWebRTC.ts (10 min)
- Add updateSystemPrompt(), interrupt(), getConfig()
- Test methods exist
- Commit

### Step 7: New useMaiaVoice.ts (2 hours)
- Wire all components together
- Feature flag controls old vs. new
- Test end-to-end
- Commit

**Total: ~6 hours** (vs. original 15h estimate)

---

## 🎯 Success Criteria

### After Wiring Complete

**Technical:**
- [ ] All 6 files compile without errors
- [ ] Feature flag toggles between old/new system
- [ ] WebRTC connects successfully
- [ ] Events flow through VoiceBus
- [ ] State updates in Zustand
- [ ] Elemental detection works
- [ ] Prosody modulation works

**Functional:**
- [ ] Can speak and hear transcript
- [ ] Can switch modes (Scribe/Active/Full)
- [ ] Can interrupt MAIA
- [ ] System prompt updates based on element
- [ ] No React hooks violations

**Safety:**
- [ ] Old system still works (with feature flag OFF)
- [ ] Can rollback instantly
- [ ] No breaking changes to existing code

---

## 🚀 Ready to Start?

**Pre-flight status:** ✅ **CLEARED FOR TAKEOFF**

**Next actions:**
1. Run Step 0 (pre-wiring setup)
2. Start Step 1 (VoiceBus.ts)
3. Test each component before moving to next
4. Commit frequently

**Estimated time:** 6 hours (with testing)
**Risk level:** LOW (feature flagged, reversible)

---

**Last check:** Do you want to proceed with Step 0 now?
