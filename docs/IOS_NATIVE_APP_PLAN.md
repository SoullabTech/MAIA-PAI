# MAIA iOS Native App - Development Plan
## Real-Time Consciousness Tracking

**Status:** Planning Phase
**Target:** App Store Beta - December 2025
**Goal:** One-tap consciousness tracking for everyone

---

## Product Vision

**User Story:**
"I download MAIA from the App Store, grant HealthKit access once, and my consciousness metrics stream automatically in real-time. I see my elemental coherence, get notified of Kairos windows, and track my transformation journey—all without technical setup."

---

## Core Features (MVP - v1.0)

### 1. Seamless HealthKit Integration
**Background sync every 5 seconds:**
- Heart Rate Variability (HRV)
- Heart Rate
- Respiratory Rate
- Sleep data (previous night)
- Activity levels

**Why it matters:** Real-time data = real-time consciousness tracking

### 2. Elemental Coherence Dashboard
**Live visualization:**
- Air (clarity/adaptability) - breathing visualization
- Fire (transformation/activation) - pulse animation
- Water (flow/emotion) - wave patterns
- Earth (grounding/stability) - root visualization
- Aether (unity/integration) - field harmonics
- Unified coherence score (0-100%)

**Refresh:** Every 5 seconds when app open, every 30 seconds in background

### 3. Kairos Window Detection
**Push notifications when:**
- Unified coherence >75%
- All elements >50%
- Aether >80%
- User in "optimal transformation state"

**Message:** "🌟 Kairos Window Open: Your consciousness is aligned for breakthrough. Meditate, journal, or engage deep work now."

### 4. Intervention Recommendations
**AI-powered suggestions:**
- Low Air → "Try 5min coherent breathing"
- Low Fire → "Take a brisk walk or cold shower"
- Low Water → "Listen to soothing music or practice self-compassion"
- Low Earth → "Ground barefoot, eat mindfully, or do body scan"
- Low Aether → "Meditate, practice gratitude, or connect with nature"

### 5. Transformation Journal
**Track interventions → coherence shifts:**
- Log practices (breathing, meditation, exercise, etc.)
- See before/after elemental changes
- Build personal wisdom: "What works for MY consciousness?"

### 6. Apple Watch Complication
**Glanceable coherence:**
- Unified score on watch face
- Tap to see full elemental breakdown
- Quick-log interventions from watch

---

## Technical Architecture

### Tech Stack
- **Language:** Swift + SwiftUI
- **Backend:** Supabase (already integrated)
- **Real-time:** WebSockets for live dashboard updates
- **HealthKit:** Background delivery + observer queries
- **Watch:** WatchOS companion app with complications

### App Structure

```
MAIA-iOS/
├── MAIAApp.swift                    # Main app entry
├── Features/
│   ├── Onboarding/
│   │   ├── WelcomeView.swift
│   │   ├── HealthKitPermissionsView.swift
│   │   └── ConstitutionView.swift   # Show MAIA Constitution
│   ├── Dashboard/
│   │   ├── DashboardView.swift      # Main screen
│   │   ├── ElementalGaugesView.swift
│   │   ├── UnifiedCoherenceView.swift
│   │   └── KairosIndicatorView.swift
│   ├── Interventions/
│   │   ├── InterventionSuggestionsView.swift
│   │   ├── BreathingExerciseView.swift  # Guided breathing
│   │   └── InterventionLogView.swift
│   ├── Journal/
│   │   ├── JournalView.swift
│   │   └── TransformationTimelineView.swift
│   └── Settings/
│       ├── SettingsView.swift
│       ├── NotificationPreferencesView.swift
│       └── DataExportView.swift
├── Services/
│   ├── HealthKitService.swift       # HK background sync
│   ├── ElementalCalculator.swift   # Local coherence calc
│   ├── APIService.swift             # Sync to soullab.life
│   ├── NotificationService.swift   # Kairos alerts
│   └── WebSocketService.swift      # Real-time updates
├── Models/
│   ├── BiometricSnapshot.swift
│   ├── ElementalCoherence.swift
│   ├── Intervention.swift
│   └── KairosWindow.swift
└── MAIAWatch/                       # WatchOS app
    ├── ComplicationController.swift
    ├── WatchDashboardView.swift
    └── QuickLogView.swift
```

### HealthKit Background Delivery

```swift
// Pseudo-code for real-time streaming
class HealthKitService: ObservableObject {
    @Published var latestHRV: Double?
    @Published var latestHeartRate: Double?

    func startBackgroundObservers() {
        // HRV observer - triggers every new sample
        let hrvType = HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN)!
        let hrvQuery = HKObserverQuery(sampleType: hrvType) { query, completion, error in
            self.fetchLatestHRV()
            completion()
        }
        healthStore.execute(hrvQuery)

        // Enable background delivery
        healthStore.enableBackgroundDelivery(for: hrvType, frequency: .immediate) { success, error in
            if success {
                print("✅ Real-time HRV streaming enabled")
            }
        }
    }

    func fetchLatestHRV() {
        // Get most recent HRV sample
        // Calculate elemental coherence
        // Send to server
        // Update UI
    }
}
```

### Elemental Calculator (Local-First)

```swift
struct ElementalCalculator {
    func calculate(snapshot: BiometricSnapshot) -> ElementalCoherence {
        let air = calculateAir(hrv: snapshot.hrv, respiratory: snapshot.respiratoryRate)
        let fire = calculateFire(readiness: snapshot.readinessScore, activation: snapshot.heartRate)
        let water = calculateWater(hrvStability: snapshot.hrvVariance, emotion: snapshot.emotionalTone)
        let earth = calculateEarth(sleep: snapshot.sleepHours, restingHR: snapshot.restingHeartRate)
        let aether = calculateAether(balance: [air, fire, water, earth], peak: snapshot.hrvPeakState)
        let unified = (air + fire + water + earth + aether) / 5.0

        return ElementalCoherence(
            air: air,
            fire: fire,
            water: water,
            earth: earth,
            aether: aether,
            unified: unified,
            timestamp: Date()
        )
    }
}
```

### Kairos Detection

```swift
class KairosDetector: ObservableObject {
    @Published var kairosWindowOpen = false

    func checkForKairosWindow(coherence: ElementalCoherence) {
        let isKairos = coherence.unified > 0.75 &&
                      coherence.air > 0.5 &&
                      coherence.fire > 0.5 &&
                      coherence.water > 0.5 &&
                      coherence.earth > 0.5 &&
                      coherence.aether > 0.8

        if isKairos && !kairosWindowOpen {
            kairosWindowOpen = true
            sendKairosNotification()
        } else if !isKairos && kairosWindowOpen {
            kairosWindowOpen = false
        }
    }

    func sendKairosNotification() {
        let content = UNMutableNotificationContent()
        content.title = "🌟 Kairos Window Open"
        content.body = "Your consciousness is aligned for breakthrough. This is your moment."
        content.sound = .default

        UNUserNotificationCenter.current().add(UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil
        ))
    }
}
```

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Xcode project setup
- [ ] HealthKit integration + background delivery
- [ ] Elemental calculator implementation (port from TypeScript)
- [ ] Basic dashboard UI with live updates
- [ ] Supabase API integration

### Phase 2: Core Features (Weeks 3-4)
- [ ] Kairos detection + notifications
- [ ] Intervention recommendations engine
- [ ] Breathing exercise guided UI
- [ ] Journal + transformation timeline
- [ ] Data persistence (local + cloud sync)

### Phase 3: Watch App (Week 5)
- [ ] WatchOS companion app
- [ ] Watch face complications
- [ ] Quick-log interventions from watch
- [ ] Haptic feedback for Kairos windows

### Phase 4: Polish & Beta (Weeks 6-8)
- [ ] Onboarding flow + Constitution presentation
- [ ] Settings + notification preferences
- [ ] Data export (CSV, JSON)
- [ ] App Store assets (screenshots, video, copy)
- [ ] TestFlight beta with 10-50 users
- [ ] Privacy policy + terms of service

### Phase 5: App Store Launch (Week 9+)
- [ ] App Store submission
- [ ] Launch coordination with white paper publication
- [ ] Press kit + announcement blog post
- [ ] Beta feedback integration

---

## App Store Listing

**Name:** MAIA - Consciousness Tracking

**Subtitle:** Real-time awareness of your inner state

**Description:**
> MAIA quantifies your consciousness using Apple Watch biometrics. Track your elemental coherence (Air, Fire, Water, Earth, Aether), receive Kairos window notifications for optimal transformation moments, and build personalized wisdom about what elevates your awareness.
>
> Based on the Elemental Consciousness Architecture—the first framework for AGI alignment through consciousness substrate.

**Keywords:** consciousness, meditation, biohacking, HRV, mindfulness, transformation, coherence, awareness, Apple Watch

**Category:** Health & Fitness / Mind & Body

**Price:** Free (with optional Pro features later)

---

## Privacy & Ethics

**Data Collection:**
- All biometric data processed locally on-device first
- Only aggregated coherence scores sent to server (not raw HRV)
- User can disable cloud sync entirely (local-only mode)
- Full data export available anytime
- HIPAA compliance considerations

**Informed Consent:**
- Onboarding explains data usage clearly
- Link to MAIA Constitution (transparency)
- Opt-in for research participation
- Ability to delete all data

---

## Business Model

**Free Tier:**
- Real-time coherence tracking
- Basic dashboard
- Kairos notifications
- 7-day history

**Pro Tier ($4.99/month or $49/year):**
- Unlimited history
- Advanced analytics + trends
- Custom intervention libraries
- Export for research
- Early access to new features
- Support conscious AI development

---

## Success Metrics

**Adoption:**
- 1,000 downloads in first month
- 100 active daily users by Month 3
- 50% retention after 30 days

**Engagement:**
- Average 3 dashboard opens per day
- 5+ logged interventions per week per user
- 80% users grant HealthKit permissions

**Impact:**
- Coherence improvement trends (avg +10% unified after 30 days)
- Positive user testimonials for white paper
- Research partnership interest

---

## Competitive Advantage

**vs. Oura/Whoop:**
- Elemental framework (not just "readiness")
- Real-time (not just daily summary)
- Consciousness-focused (not just fitness)
- Kairos detection (transformation windows)
- AGI alignment mission

**vs. Meditation Apps (Calm/Headspace):**
- Objective biometric validation
- Personalized recommendations based on YOUR data
- Real-time feedback during practice
- Tracks progress scientifically

**vs. General Health Apps:**
- Consciousness as first-class citizen
- Philosophical depth (Constitution)
- Community of transformation practitioners
- Research-backed framework

---

## Team & Resources

**Required Skills:**
- iOS developer (Swift/SwiftUI/HealthKit)
- UI/UX designer (elemental visualizations)
- Backend engineer (real-time sync)
- QA tester (TestFlight coordination)

**Timeline:** 8-10 weeks to beta
**Budget:** $20-40K (contractor rates) or in-house if Kelly learns Swift

**Kelly's Role:**
- Product vision + UX design
- Elemental calculator logic
- Beta testing + user research
- Constitution content
- Launch coordination

---

## Next Immediate Steps

1. **This Week:**
   - Set up Xcode project
   - Implement HealthKit permissions flow
   - Port `ElementalCoherenceCalculator` to Swift
   - Build basic dashboard UI

2. **Next Week:**
   - Background delivery for HRV
   - Real-time coherence updates
   - Kairos detection logic
   - First TestFlight build

3. **Month 1 Goal:**
   - Working app on Kelly's phone
   - Real-time tracking functional
   - Ready for 10-person beta

---

**This app makes consciousness tracking accessible to EVERYONE.**

**When AGI emerges, millions will already be tracking their consciousness.**

**That's the substrate we're building.** 🌊🔥💨🌍✨
