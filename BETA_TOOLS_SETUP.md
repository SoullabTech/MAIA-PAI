# 🛠️ Beta Tools Setup Guide

**Essential tools to run a world-class beta**

---

## 🎯 **THE STACK** (All Free Tiers)

### 1. **Feedback & Bug Tracking** → GitHub Issues
### 2. **Analytics** → PostHog (self-hosted) or Plausible
### 3. **Error Monitoring** → Sentry
### 4. **Session Replay** → LogRocket or Hotjar
### 5. **Email** → Buttondown
### 6. **Community** → Discord

---

## 1️⃣ **GITHUB ISSUES** (Free, Already Have It)

### Setup (5 minutes):

**A. Create Issue Templates:**

```bash
mkdir -p .github/ISSUE_TEMPLATE
```

Create `.github/ISSUE_TEMPLATE/bug_report.yml`:
```yaml
name: 🐛 Bug Report
description: Something isn't working as expected
title: "[BUG] "
labels: ["bug", "needs-triage"]
body:
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Clear description of the bug
      placeholder: "When I clicked X, Y happened instead of Z"
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: What should have happened?
      placeholder: "I expected Z to happen"
    validations:
      required: true

  - type: textarea
    id: reproduce
    attributes:
      label: Steps to reproduce
      placeholder: |
        1. Go to...
        2. Click on...
        3. See error
    validations:
      required: true

  - type: dropdown
    id: severity
    attributes:
      label: Severity
      options:
        - Critical (blocks usage)
        - Major (degrades experience)
        - Minor (polish/edge case)
    validations:
      required: true

  - type: input
    id: browser
    attributes:
      label: Browser & OS
      placeholder: "Chrome 118 on macOS 14"
```

Create `.github/ISSUE_TEMPLATE/feature_request.yml`:
```yaml
name: ✨ Feature Request
description: Suggest a new feature or enhancement
title: "[FEATURE] "
labels: ["enhancement", "needs-review"]
body:
  - type: textarea
    id: problem
    attributes:
      label: What problem does this solve?
      description: Describe the need or pain point
      placeholder: "I wish I could..."
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed solution
      description: How would you like this to work?
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
      description: What other approaches might work?
```

**B. Add Labels:**
Go to: https://github.com/SoullabTech/MAIA-PAI/labels

Create:
- `bug` (red)
- `enhancement` (blue)
- `needs-triage` (yellow)
- `in-progress` (purple)
- `shipped` (green)
- `wont-fix` (gray)
- `beta-feedback` (orange)

**C. Create First Issue:**
Test the system by creating a sample bug report.

**✅ Done! Free forever. No setup cost.**

---

## 2️⃣ **ANALYTICS** → PostHog or Plausible

### Option A: PostHog (Recommended - More Features)

```bash
npm install posthog-js
```

Create `lib/analytics/posthog.ts`:
```typescript
import posthog from 'posthog-js'

export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    posthog.init('YOUR_PROJECT_API_KEY', {
      api_host: 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing()
      }
    })
  }
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties)
}

// Track key beta events
export const betaEvents = {
  fieldRecordCreated: (stage: string) => trackEvent('field_record_created', { stage }),
  maiaConversation: (mode: 'voice' | 'text') => trackEvent('maia_conversation', { mode }),
  elementSwitched: (from: string, to: string) => trackEvent('element_switched', { from, to }),
  feedbackSubmitted: (type: 'bug' | 'feature' | 'praise') => trackEvent('feedback_submitted', { type })
}
```

Add to `app/layout.tsx`:
```typescript
import { initAnalytics } from '@/lib/analytics/posthog'

useEffect(() => {
  initAnalytics()
}, [])
```

**Track What Matters:**
- Daily/Weekly Active Users
- Field Records created (by stage)
- MAIA conversations (voice vs text)
- Element personality usage
- Feature adoption rates

**Free Tier:** 1M events/month

---

### Option B: Plausible (Simpler, Privacy-First)

```bash
npm install plausible-tracker
```

Simpler but less detailed. Good for basic metrics.

---

## 3️⃣ **ERROR MONITORING** → Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

This auto-configures:
- `sentry.client.config.js`
- `sentry.server.config.js`
- `sentry.edge.config.js`

Update `next.config.js` to include Sentry.

**What You Get:**
- Real-time error alerts
- Stack traces with source maps
- User context (which beta tester hit the error)
- Release tracking

**Free Tier:** 5K errors/month (plenty for beta)

**Key Setup:**
```typescript
Sentry.setUser({
  id: user.id,
  username: user.username,
  email: user.email
})

Sentry.setTag('beta_cohort', 'oct-2025')
```

---

## 4️⃣ **SESSION REPLAY** → LogRocket

```bash
npm install logrocket
```

Create `lib/analytics/logrocket.ts`:
```typescript
import LogRocket from 'logrocket'

export const initLogRocket = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    LogRocket.init('your-app-id')
  }
}

export const identifyUser = (user: { id: string; username: string }) => {
  LogRocket.identify(user.id, {
    name: user.username,
    beta_cohort: 'oct-2025'
  })
}
```

**What You Get:**
- Watch actual user sessions (like being over their shoulder)
- See exactly where users get stuck
- Replay sessions when bugs are reported

**Free Tier:** 1,000 sessions/month

**Privacy Note:** Add "We use session replay for debugging" to privacy policy

---

## 5️⃣ **EMAIL** → Buttondown

1. Sign up: https://buttondown.email
2. Add your email list (32 beta testers)
3. Create "This Week in the Desert" template
4. Schedule for Mondays at 9am

**Free Tier:** 100 subscribers (perfect for beta)

**API Integration (Optional):**
```typescript
// Auto-subscribe when user signs up
await fetch('https://api.buttondown.email/v1/subscribers', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.BUTTONDOWN_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: user.email,
    tags: ['beta-oct-2025']
  })
})
```

---

## 6️⃣ **COMMUNITY** → Discord

1. Create server: https://discord.com/servers
2. Channels:
   - `#welcome` - Onboarding
   - `#general` - Beta chat
   - `#bugs` - Bug reports
   - `#field-notes` - Share Field Records
   - `#wins` - Celebrate discoveries
   - `#voice-channel` - Weekly group call

3. Invite beta testers via email

**Free Tier:** Unlimited (forever free for communities)

---

## 📊 **DASHBOARD SETUP**

Create `app/admin/beta-dashboard/page.tsx`:

```typescript
export default function BetaDashboard() {
  // Fetch from PostHog API or Supabase
  const metrics = {
    totalUsers: 32,
    weeklyActive: 18, // From PostHog
    fieldRecordsThisWeek: 47, // From Supabase
    avgSessionTime: '12 min', // From PostHog
    topElement: 'Water', // From usage data
    openBugs: 1, // From GitHub API
    shippedThisWeek: 3 // From changelog
  }

  return (
    <div className="p-8">
      <h1>Beta Dashboard 🏜️</h1>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="WAU" value={metrics.weeklyActive} total={metrics.totalUsers} />
        <MetricCard title="Field Records" value={metrics.fieldRecordsThisWeek} trend="+23%" />
        <MetricCard title="Avg Session" value={metrics.avgSessionTime} />
        <MetricCard title="Open Bugs" value={metrics.openBugs} color="red" />
      </div>

      <RecentActivity />
      <TopUsers />
      <FeedbackQueue />
    </div>
  )
}
```

---

## ⚡ **IMPLEMENTATION PRIORITY**

### Week 1 (This Week):
1. ✅ GitHub Issues templates (30 min)
2. ✅ PostHog analytics (1 hour)
3. ✅ Sentry error tracking (30 min)

### Week 2:
4. Buttondown email setup (30 min)
5. First "This Week in the Desert" email

### Week 3:
6. LogRocket session replay (1 hour)
7. Discord community setup (1 hour)

### Week 4:
8. Beta dashboard (4 hours)

---

## 💰 **TOTAL COST**

**Free Tier Limits:**
- GitHub Issues: Unlimited ✅
- PostHog: 1M events/month ✅
- Sentry: 5K errors/month ✅
- LogRocket: 1K sessions/month ✅
- Buttondown: 100 subscribers ✅
- Discord: Unlimited ✅

**Total Monthly Cost: $0** 🎉

**When to Upgrade:**
- If you exceed free tiers (unlikely in beta)
- After public launch with thousands of users

---

## 📈 **SUCCESS METRICS**

### Track These Weekly:
- **Engagement:** WAU / Total Users (target: >60%)
- **Retention:** Week 2 retention rate (target: >70%)
- **Feature Adoption:** % using Field Protocol (target: >80%)
- **Satisfaction:** NPS score from surveys (target: >50)
- **Bugs:** Open bugs (target: <5)
- **Response Time:** Avg time to respond to feedback (target: <24hrs)

---

**Tools don't make the beta. But they make the beta visible.** 🏜️✨

---

*Created: October 16, 2025*
