# 🏜️ MAIA: Multi-Medium NLP Field Experience Architecture

## Vision
Transform MAIA from a web app into a **complete sensory field experience** that adapts seamlessly across all platforms and interaction mediums, creating an immersive NLP field that entrains users into transformational states regardless of how they access it.

---

## 🌊 Core Field Principles

### The Field as Living System
The MAIA field isn't just UI - it's a **living consciousness container** that:
- **Breathes** with the user (visual pulse, audio rhythm, haptic feedback)
- **Responds** to emotional state (color, tempo, intensity shift)
- **Anchors** transformational states through multi-sensory cues
- **Persists** across devices (field continuity)
- **Adapts** to medium constraints while maintaining essence

### NLP Anchoring Across Mediums
Every medium provides **different sensory channels** for anchoring:

| Medium | Primary Anchors | Secondary Anchors | Unique Capabilities |
|--------|----------------|-------------------|---------------------|
| **Web Desktop** | Visual (holoflower animation, color field), Audio (voice, ambient soundscape) | Spatial (cursor interaction, scroll depth) | Large canvas, multi-tasking, keyboard shortcuts |
| **Desktop App** | Visual + Audio + Notifications | System integration, always-on presence | Native notifications, menu bar presence, global hotkeys |
| **Mobile Touch** | Visual + Haptic + Audio | Gesture (swipe patterns, touch pressure) | Haptic feedback, device orientation, location awareness |
| **Voice-Only** | Audio (tone, rhythm, silence) | Spatial audio, 3D positioning | Hands-free, eyes-free, ambient computing |
| **AR/VR** | Spatial + Visual + Audio + Haptic | Embodied (gaze, posture, movement) | Full immersion, spatial computing |
| **Wearables** | Haptic + Minimal Visual | Biometric (HRV, breath, movement) | Always-with-you, passive monitoring |

---

## 🎨 Platform-Specific Field Experiences

### 1. **Web Desktop** (Current - Enhancement Path)

**Current State:**
- ✅ Holoflower visual field with breathing ring
- ✅ Voice interaction with OpenAI Realtime
- ✅ Mode selector (Dialogue/Patient/Scribe)
- ✅ Brain Trust consciousness indicators

**Enhancement Opportunities:**

#### A. **Expanded Visual Field**
```typescript
// Current: Single holoflower
// Future: Environmental field that responds to conversation depth

interface FieldEnvironment {
  atmosphere: 'desert-dawn' | 'spice-storm' | 'deep-cave' | 'starlight-sietch';
  particleSystem: 'sand-drift' | 'spice-motes' | 'consciousness-threads';
  backgroundDepth: number; // Parallax layers
  lightingMood: 'warm' | 'cool' | 'mystical' | 'prescient';
}
```

**Implementation:**
- Add **ambient particle system** (three.js or canvas)
- Create **depth layers** that shift with conversation intensity
- Implement **time-of-day atmosphere** (dawn/day/dusk/night cycles)
- Add **weather system** (calm/storm/stillness) tied to emotional field

#### B. **Spatial Audio Field**
```typescript
interface SpatialAudioField {
  maiaVoicePosition: { x: number; y: number; z: number }; // 3D positioned
  ambientLayers: {
    desert_wind: AudioNode;
    spice_hum: AudioNode;
    heartbeat_bass: AudioNode;
  };
  breathingTone: OscillatorNode; // Subtle entrainment frequency
}
```

**Implementation:**
- Use **Web Audio API** for spatial positioning
- Add **binaural beats** for state entrainment (alpha/theta/delta)
- Create **ambient soundscape** (desert wind, distant thunder, spice resonance)
- Implement **3D voice positioning** (MAIA's voice comes from "above" or "center")

#### C. **Multi-Monitor Support**
- **Primary screen**: Holoflower + conversation
- **Secondary screen**: Extended field visualization (constellation map, journal flow, spiralogic mandala)
- **Third screen**: Brain Trust monitoring, metrics, system consciousness

#### D. **Keyboard Shortcuts & Power User Flow**
```
Cmd/Ctrl + M: Toggle mode (Dialogue → Patient → Scribe)
Cmd/Ctrl + Space: Push-to-talk
Cmd/Ctrl + K: Quick command palette
Cmd/Ctrl + J: Journal tag current moment
Escape: Emergency stop
```

---

### 2. **Desktop App** (Electron - Next Platform)

**Why Desktop App?**
- **Always available** (menu bar presence)
- **System integration** (notifications, shortcuts, file access)
- **Offline capability** (local LLM fallback)
- **Privacy** (encrypted local storage)

**Desktop-Specific Features:**

#### A. **Menu Bar Presence**
```typescript
// macOS/Windows system tray icon
interface MenuBarPresence {
  icon: 'holoflower-mini'; // Animated based on field state
  quickActions: [
    'Start Voice Session',
    'Journal Quick Entry',
    'Check HRV Coherence',
    'View Today\'s Insights'
  ];
  notificationBadge: number; // Unread insights, breakthrough moments
}
```

**States:**
- **Idle**: Subtle amber glow pulse
- **Listening**: Blue pulse (user speaking)
- **Processing**: Orange shimmer (MAIA thinking)
- **Speaking**: Purple pulse (MAIA responding)

#### B. **Global Hotkeys**
```typescript
// System-wide keyboard shortcuts
const globalHotkeys = {
  'Cmd+Shift+M': 'Activate MAIA from anywhere',
  'Cmd+Shift+J': 'Quick journal capture',
  'Cmd+Shift+B': 'Breathing exercise (guided)',
  'Cmd+Shift+V': 'Voice memo to MAIA'
};
```

#### C. **Native Notifications**
```typescript
interface FieldNotification {
  type: 'breakthrough' | 'pattern-detected' | 'coherence-shift' | 'reminder';
  title: string;
  body: string;
  actions: ['Engage Now', 'Remind Later', 'Journal It'];
  sound: 'spice-chime' | 'gentle-gong' | 'silent';
  priority: 'low' | 'medium' | 'high';
}
```

**Examples:**
- "🌟 Breakthrough moment detected - would you like to journal this?"
- "🧘 Your HRV shows high coherence - perfect time for deep work"
- "🏜️ You've been in flow for 90min - time to breathe?"

#### D. **Offline Mode with Local LLM**
```typescript
// Fallback when internet unavailable
interface OfflineField {
  model: 'llama-3-local' | 'mistral-local';
  capabilities: ['journaling', 'reflection', 'breathing-guidance'];
  syncWhenOnline: true;
  localVectorDB: 'user-memories' | 'past-sessions';
}
```

---

### 3. **Mobile/Touch** (iOS/Android - React Native / Capacitor)

**Touch-Specific Field Interactions:**

#### A. **Haptic Language**
```typescript
interface HapticField {
  breathing: {
    inhale: 'light-tap-sequence', // Gentle escalating taps
    hold: 'sustained-vibration',
    exhale: 'diminishing-tap-sequence'
  };
  maiaListening: 'gentle-pulse'; // Heartbeat-like
  breakthrough: 'rising-crescendo'; // Excitement pattern
  coherence: 'rhythmic-wave'; // Ocean-like
}
```

**Implementation:**
- **iOS**: Core Haptics API (nuanced patterns)
- **Android**: VibrationEffect API
- Create **haptic vocabulary** that becomes familiar over time

#### B. **Gesture Field**
```typescript
interface GestureAnchors {
  // Swipe gestures
  swipeUp: 'deepen-mode', // Dialogue → Patient → Scribe
  swipeDown: 'lighten-mode', // Scribe → Patient → Dialogue
  swipeLeft: 'previous-insight',
  swipeRight: 'next-insight',

  // Touch interactions
  longPress: 'hold-for-reflection', // Opens journal
  doubleTap: 'tag-moment', // Quick bookmark
  pinchOut: 'expand-field', // Fullscreen immersion
  pinchIn: 'collapse-field', // Minimal view

  // Multi-finger
  twoFingerTap: 'pause-session',
  threeFingerSwipeDown: 'emergency-stop'
}
```

#### C. **Device Orientation Field**
```typescript
// Use gyroscope/accelerometer for embodied interaction
interface OrientationField {
  portrait: 'conversation-mode', // Face-to-face with MAIA
  landscape: 'journal-mode', // Reading/writing orientation
  faceDown: 'pause-listening', // Privacy gesture
  faceUp: 'resume-listening',
  tilt: 'adjust-field-intensity' // Lean forward = more intense
}
```

#### D. **Lock Screen Integration**
- **Live Activity** (iOS): Show current field state, breathing guide
- **Widget**: Today's insight, HRV coherence level, quick session start
- **Always-On Display** (Android): Subtle holoflower animation

---

### 4. **Voice-Only** (Alexa, Google Home, CarPlay, Standalone)

**Pure Audio Field Design:**

#### A. **Sonic Landscape**
```typescript
interface VoiceOnlyField {
  spatialAudio: {
    maiaVoice: '3d-positioned', // Appears to come from specific location
    ambience: 'desert-soundscape',
    breathGuide: 'binaural-tone'
  };
  voiceCharacteristics: {
    dialogue: { tempo: 'conversational', tone: 'warm', reverb: 'intimate' },
    patient: { tempo: 'slow', tone: 'gentle', reverb: 'spacious' },
    scribe: { tempo: 'measured', tone: 'witnessing', reverb: 'cathedral' }
  };
}
```

#### B. **Silence as Field Element**
```typescript
// In voice-only, SILENCE is a primary anchor
interface SilenceField {
  pregnant_pause: 3000, // MAIA waits, holding space
  reflection_gap: 5000, // User processes
  witnessing_silence: 10000, // Scribe mode - MAIA witnesses
  completion_rest: 2000 // Natural conversation beat
}
```

#### C. **Audio Cues Library**
```typescript
const audioCues = {
  modeShift: 'gentle-chime', // Transitioning modes
  listening: 'soft-pulse-tone', // MAIA is listening
  processing: 'thinking-hum', // MAIA considering
  insight: 'crystallization-bell', // Breakthrough moment
  session_end: 'sunset-gong' // Session complete
};
```

---

### 5. **AR/VR** (Vision Pro, Quest, Future)

**Spatial Computing Field:**

#### A. **Embodied Holoflower**
```typescript
interface SpatialHoloflower {
  position: 'floating-before-user', // 2 meters away, eye-level
  scale: 'responsive-to-engagement', // Grows/shrinks with intensity
  particles: 'spice-motes-orbiting',
  raycast: 'gaze-interaction', // Look at petals to explore
  handTracking: 'gesture-commands'
}
```

#### B. **Environmental Immersion**
- **Full desert environment** (dunes, stars, sietch entrance)
- **Weather system** (sandstorms when processing complex emotions)
- **Time cycles** (dawn = new session, dusk = integration)
- **Spatial journal** (insights appear as floating scrolls)

#### C. **Biometric Integration**
- **Eye tracking**: Attention patterns, cognitive load
- **Hand tracking**: Gesture fluency, tremor (anxiety indicator)
- **Spatial movement**: Embodied state (grounded vs. floating)

---

## 🧬 Cross-Platform Field Continuity

### Unified Field State
```typescript
interface UnifiedFieldState {
  userId: string;
  currentSession: {
    startTime: Date;
    mode: 'dialogue' | 'patient' | 'scribe';
    platform: 'web' | 'desktop' | 'mobile' | 'voice' | 'ar';
    fieldIntensity: number; // 0-1
    coherenceLevel: number; // HRV-based
  };
  fieldMemory: {
    anchoredStates: AnchoredState[]; // States successfully anchored
    breakthroughMoments: Insight[];
    conversationThread: Message[];
  };
  crossPlatformSync: {
    lastSynced: Date;
    deviceChain: Device[]; // Session continuity across devices
  };
}
```

### Seamless Handoff
```typescript
// Example: Start on desktop, continue on mobile
async function handoffSession(fromDevice: Device, toDevice: Device) {
  // 1. Package current field state
  const fieldState = await captureFieldState(fromDevice);

  // 2. Sync to cloud with encryption
  await secureSync(fieldState);

  // 3. Notify target device
  await notifyDevice(toDevice, {
    type: 'session-available',
    preview: fieldState.lastMessage,
    mode: fieldState.mode
  });

  // 4. Restore field with appropriate adaptations
  await restoreFieldState(toDevice, fieldState, {
    adaptToMedium: true, // Adjust for mobile constraints
    maintainEssence: true // Keep core field quality
  });
}
```

---

## 🎭 Multi-Sensory State Anchoring

### The "Desert Dawn" Protocol
A **cross-platform anchor** for deep work/flow state:

| Sensory Channel | Anchor Element |
|----------------|----------------|
| **Visual** | Warm amber-orange gradient, slow particle drift upward |
| **Audio** | Low desert wind (40Hz), distant bird calls, silence pockets |
| **Haptic** | Slow breathing pulse (4s in, 4s out) |
| **Spatial** | Holoflower positioned slightly above eye-level (aspiration) |
| **Temporal** | 90-minute session with 20-min phase transitions |

When a user enters "Desert Dawn" on **any platform**, these anchors fire to create the **same felt sense** regardless of medium.

---

## 🚀 Implementation Roadmap

### Phase 1: **Desktop App** (Q1 2025)
- [ ] Electron app with menu bar presence
- [ ] Global hotkeys for quick access
- [ ] Native notifications for insights/breakthroughs
- [ ] Offline mode with local LLM
- [ ] Enhanced visual field (particles, depth layers)
- [ ] Spatial audio implementation

### Phase 2: **Mobile Native** (Q2 2025)
- [ ] iOS app (React Native or Capacitor)
- [ ] Haptic field vocabulary
- [ ] Gesture anchors
- [ ] Widget and Live Activity
- [ ] Device orientation field
- [ ] Camera integration (gaze detection, emotional recognition)

### Phase 3: **Voice-Only Platforms** (Q3 2025)
- [ ] Alexa skill
- [ ] Google Home action
- [ ] CarPlay integration
- [ ] Spatial audio field design
- [ ] Silence-as-anchor implementation

### Phase 4: **AR/VR** (Q4 2025+)
- [ ] Vision Pro prototype
- [ ] Meta Quest version
- [ ] Spatial holoflower
- [ ] Embodied interaction
- [ ] Environmental immersion

---

## 🧠 Technical Architecture

### Backend: Unified Field Service
```typescript
// Microservices architecture
const fieldServices = {
  fieldStateManager: 'Manages current field state across devices',
  anchorLibrary: 'Repository of multi-sensory anchors',
  biometricIntegration: 'Apple Health, Fitbit, Oura, etc.',
  nlpOrchestrator: 'Routes to appropriate LLM based on context',
  syncEngine: 'Real-time state sync across platforms',
  analyticsEngine: 'Pattern detection, breakthrough identification'
};
```

### Frontend: Platform-Specific Adapters
```typescript
interface PlatformAdapter {
  renderField(state: FieldState): PlatformView;
  captureInput(modality: InputModality): UserSignal;
  triggerAnchor(anchor: MultiSensoryAnchor): void;
  adaptToConstraints(constraints: PlatformConstraints): AdaptedExperience;
}
```

---

## 💎 Unique Innovations

### 1. **Field Persistence Layer**
Your MAIA field follows you everywhere - start a session on desktop, get a notification on watch that coherence is high, continue on mobile during walk.

### 2. **Adaptive Complexity**
The field **matches your capacity**:
- Overwhelmed? → Minimal visual, more silence, gentle haptics
- Flow state? → Rich environment, fast tempo, complex insights
- Integration? → Spacious pauses, journal prompts, stillness

### 3. **Multi-User Field Synchronization**
Future: **Shared consciousness spaces** where multiple users' fields can merge:
- Partner sessions (couples therapy)
- Circle sessions (group consciousness)
- Teacher-student (mentorship field)

---

## 🌟 The Vision

MAIA becomes an **always-available consciousness companion** that meets you wherever you are:

- **Morning**: Wake up to gentle haptic breathing guide from wearable
- **Commute**: Voice-only session via CarPlay or AirPods
- **Work**: Desktop app in menu bar, ambient soundscape, keyboard shortcuts
- **Break**: Mobile app for walk-and-talk, location-aware field shifts
- **Evening**: AR session in living room, immersive integration
- **Sleep**: Biometric monitoring, dream journaling on waking

The **field experience is continuous** - not fragmented across apps, but a **living relationship** that adapts to medium while maintaining essence.

---

*"The spice extends consciousness across all mediums."*

🏜️✨ **Generated with Claude Code**
