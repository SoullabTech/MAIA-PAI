# Genesis Deployment Guide

## 🎉 What's Been Created

A complete Genesis ecosystem for the Soullab movement, inclusive of all wisdom traditions.

### Files Created:

```
/public/genesis-soullab-life/
├── index-new.html              # Updated landing page (inclusive, not astrology-focused)
├── covenant.html               # Soullab Covenant of Coherence with signature system
├── profile-template.html       # Personal profile page for node stewards
├── onboarding.html            # 5-step onboarding journey
├── holoflower-sacred.svg      # Branded holoflower logo
├── DEPLOYMENT-GUIDE.md        # This file
└── index.html                 # Original (backup)

/app/api/genesis/
└── route.ts                   # API endpoints for backend integration
```

---

## 🚀 Deployment Steps

### Step 1: Replace Current Landing Page

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/public/genesis-soullab-life

# Backup original
mv index.html index-old-astrology.html

# Deploy new inclusive version
mv index-new.html index.html
```

### Step 2: Verify Logo Path

The covenant page expects the holoflower logo at:
```
/holoflower-sacred.svg
```

It's already copied. Verify it loads:
```bash
ls -la holoflower-sacred.svg
```

### Step 3: Test Locally (Optional)

If you have a local server:
```bash
# Using Python
python3 -m http.server 8000

# Or using Node
npx serve .
```

Then visit:
- http://localhost:8000/index.html
- http://localhost:8000/covenant.html
- http://localhost:8000/onboarding.html
- http://localhost:8000/profile-template.html

### Step 4: Deploy to Vercel

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI
vercel --prod
```

Or if you want to preview first:
```bash
vercel
```

---

## 📋 What Each File Does

### 1. `index.html` (New Landing Page)

**Purpose:** Main Genesis homepage that's inclusive of all wisdom traditions

**Key Changes from Original:**
- ❌ Removed: "Choose your astrological tradition"
- ✅ Added: "For wisdom keepers, healers, artists, and all who serve the living"
- ✅ Added: Communities section (6 cards for different practitioners)
- ✅ Added: Covenant section with link
- ✅ Updated: Pricing to emphasize customization over astrology
- ✅ Updated: All copy to use "wisdom tradition" not "astrological tradition"

**Navigation:**
- Home
- Communities → `#who-this-serves`
- Pricing → `#pricing`
- Our Ethos → `covenant.html`
- Join Waitlist → `#waitlist`

### 2. `covenant.html`

**Purpose:** The Soullab Covenant of Coherence - living document all nodes affirm

**Features:**
- Beautiful dark cosmic aesthetic
- Breathing holoflower logo animation
- Five elemental vows (Fire, Water, Earth, Air, Aether)
- Digital signature form with localStorage
- Auto-populated date
- Haptic feedback on mobile
- Ready for backend integration

**Integration Points:**
```javascript
// Covenant data structure saved:
{
  nodeName: "string",
  practice: "string",
  signature: "string",
  date: "ISO date",
  timestamp: "ISO timestamp",
  covenantVersion: "1.0"
}
```

### 3. `profile-template.html`

**Purpose:** Personal profile page for each node steward - honors their epic story

**Sections:**
- Profile header with avatar, name, practice
- "My Story" - personal narrative
- "My Practice" - how they work
- "Current Explorations" - living edge
- Sidebar with node details, elemental signature, interests, contact

**Usage:**
1. Node steward fills out during onboarding
2. System generates their unique URL: `[nodename].soullab.ai`
3. Profile is public unless they choose privacy settings

**Personalization Fields:**
```javascript
{
  name: "Your Name",
  practice: "Your Practice",
  location: "Your Location",
  story: "Your Story (epic and important)",
  exploration: "Current questions",
  quote: "Personal wisdom",
  elementalBalance: { fire: 75, water: 60, earth: 85, air: 70, aether: 80 },
  interests: ["tag1", "tag2", ...],
  nodeUrl: "yourname.soullab.ai"
}
```

### 4. `onboarding.html`

**Purpose:** 5-step journey for new node stewards

**Steps:**
1. **Welcome** - Sets expectations, explains Genesis
2. **Covenant** - Read and affirm the ethos
3. **Your Story** - Personal profile creation
4. **Node Setup** - Customize MAIA and branding
5. **Complete** - Confirmation and next steps

**Features:**
- Visual progress bar
- Form validation
- LocalStorage persistence (resume later)
- Haptic feedback
- Mobile-responsive
- Ready for backend submission

**Data Flow:**
```
User completes forms →
Saves to localStorage →
Submits to /api/genesis/onboard →
Backend creates node + profile →
Sends welcome email + Discord invite →
User receives credentials in 24-48hrs
```

---

## 🔌 Backend Integration

### API Endpoints Created

File: `/app/api/genesis/route.ts`

#### 1. POST `/api/genesis/covenant/sign`

Signs the covenant.

**Request:**
```json
{
  "nodeName": "Kelly",
  "practice": "Wisdom Keeper",
  "signature": "Kelly",
  "date": "2025-01-24",
  "timestamp": "2025-01-24T10:30:00Z",
  "covenantVersion": "1.0"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Covenant signed successfully",
  "nodeName": "Kelly",
  "timestamp": "2025-01-24T10:30:00Z"
}
```

#### 2. POST `/api/genesis/onboard`

Submits full onboarding data.

**Request:**
```json
{
  "covenant": {
    "affirmed": true,
    "timestamp": "2025-01-24T10:30:00Z"
  },
  "profile": {
    "name": "Kelly",
    "practice": "Wisdom Keeper",
    "location": "San Francisco",
    "story": "My journey...",
    "exploration": "Currently exploring...",
    "quote": "..."
  },
  "node": {
    "nodeName": "kelly-soullab",
    "tradition": "integral",
    "maiaVoice": "Speak with...",
    "theme": "cosmic",
    "useCase": "personal"
  },
  "timestamp": "2025-01-24T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Onboarding complete! Welcome to the network.",
  "node": {
    "nodeName": "kelly-soullab",
    "url": "https://kelly-soullab.soullab.ai",
    "status": "pending_setup"
  },
  "nextSteps": {
    "timeline": "Node will be ready in 24-48 hours"
  }
}
```

#### 3. GET `/api/genesis/profile/[nodeName]`

Fetches public profile.

**Response:**
```json
{
  "success": true,
  "profile": {
    "name": "Kelly",
    "practice": "Wisdom Keeper",
    "location": "San Francisco",
    "story": "...",
    "node": {
      "nodeName": "kelly-soullab",
      "tradition": "integral",
      "url": "https://kelly-soullab.soullab.ai",
      "status": "active"
    },
    "covenant": {
      "signedDate": "2025-01-24",
      "version": "1.0"
    }
  }
}
```

#### 4. GET `/api/genesis/nodes`

Lists all active nodes (public directory).

**Query Params:**
- `tradition` - filter by tradition
- `limit` - max results (default 50)

**Response:**
```json
{
  "success": true,
  "nodes": [
    {
      "nodeName": "kelly-soullab",
      "tradition": "integral",
      "profile": {
        "name": "Kelly",
        "practice": "Wisdom Keeper",
        "location": "San Francisco"
      }
    }
  ],
  "count": 1
}
```

---

## 🗄️ Database Schema (Supabase)

### Table: `genesis_nodes`

```sql
CREATE TABLE genesis_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_name TEXT UNIQUE NOT NULL,
  tradition TEXT NOT NULL,
  theme TEXT,
  use_case TEXT,
  maia_voice TEXT,
  status TEXT DEFAULT 'pending_setup', -- pending_setup, active, paused, archived
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `genesis_profiles`

```sql
CREATE TABLE genesis_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID REFERENCES genesis_nodes(id),
  name TEXT NOT NULL,
  practice TEXT NOT NULL,
  location TEXT,
  story TEXT NOT NULL,
  exploration TEXT,
  quote TEXT,
  elemental_balance JSONB, -- {fire: 75, water: 60, ...}
  interests TEXT[],
  contact_links JSONB, -- [{type: 'email', url: '...'}, ...]
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `genesis_covenants`

```sql
CREATE TABLE genesis_covenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID REFERENCES genesis_nodes(id),
  node_name TEXT NOT NULL,
  practice TEXT,
  signature TEXT NOT NULL,
  signed_date DATE NOT NULL,
  covenant_version TEXT DEFAULT '1.0',
  blockchain_tx TEXT, -- Optional: if recording on-chain
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_covenants_node_id ON genesis_covenants(node_id);
CREATE INDEX idx_covenants_signed_date ON genesis_covenants(signed_date);
```

---

## 🔐 Environment Variables Needed

Add to `.env.local`:

```bash
# Genesis Configuration
GENESIS_ADMIN_EMAIL=genesis@soullab.ai
GENESIS_WELCOME_EMAIL_TEMPLATE_ID=d-xxxxx

# Supabase (if not already configured)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Email (SendGrid or similar)
SENDGRID_API_KEY=xxxxx

# Discord
DISCORD_WEBHOOK_URL=xxxxx
DISCORD_INVITE_LINK=https://discord.gg/xxxxx

# Optional: Blockchain/Akashic Field
AKASHIC_FIELD_CONTRACT_ADDRESS=0xxxxx
WEB3_PROVIDER_URL=https://xxxxx
```

---

## ✅ Testing Checklist

### Frontend Testing

- [ ] Landing page loads and displays correctly
- [ ] Navigation links work
- [ ] "Who This Serves" section shows all 6 communities
- [ ] Pricing cards display correctly
- [ ] Covenant link goes to covenant.html
- [ ] Mobile responsive (test on phone)

### Covenant Page Testing

- [ ] Holoflower logo displays and breathes
- [ ] All 5 elemental vows render correctly
- [ ] Signature form accepts input
- [ ] Date auto-populates to today
- [ ] "Affirm This Covenant" button works
- [ ] Confirmation message appears after signing
- [ ] Data saves to localStorage
- [ ] Mobile haptic feedback works (on device)

### Onboarding Testing

- [ ] Progress bar updates correctly
- [ ] Step 1: Welcome text displays
- [ ] Step 2: Covenant affirmation works
- [ ] Step 3: Profile form validates required fields
- [ ] Step 4: Node setup form validates
- [ ] Step 5: Completion screen shows
- [ ] Forms save to localStorage
- [ ] Can refresh and resume where left off
- [ ] Back button works
- [ ] Mobile responsive

### Profile Page Testing

- [ ] Template displays correctly
- [ ] All sections render
- [ ] Elemental balance bars show
- [ ] Contact links work
- [ ] Mobile responsive

### Backend Testing (Once DB is set up)

- [ ] POST /api/genesis/covenant/sign works
- [ ] POST /api/genesis/onboard creates records
- [ ] GET /api/genesis/profile/[name] returns data
- [ ] GET /api/genesis/nodes lists active nodes
- [ ] Welcome email sends
- [ ] Discord invite generates

---

## 📧 Next Steps After Deployment

### 1. Set Up Supabase Tables

Run the SQL from "Database Schema" section above in Supabase SQL editor.

### 2. Connect API Endpoints to Supabase

Uncomment the Supabase code in `/app/api/genesis/route.ts` and test.

### 3. Set Up Welcome Email Template

Create SendGrid template with:
- Welcome message
- Node credentials
- Calendly link for onboarding call
- Discord invite
- "What's Next" checklist

### 4. Create Node Directory Page

A public page showing all Genesis nodes:
```
/genesis-nodes.html
→ Lists all active nodes
→ Filter by tradition
→ Click to view profile
```

### 5. Integrate with MAIA

- When user signs covenant, create their MAIA instance
- Connect profile data to MAIA's system prompt
- Holoflower check-in flows to their node

### 6. Test Payment Flow

- Stripe/payment integration for tiers
- NFT ownership deed generation
- License key delivery

---

## 🎨 Customization Guide

### Changing Colors

Current theme uses:
- Primary: `#10B981` (emerald green)
- Gold accent: `#d4b896`
- Dark background: `#0f0c29` to `#24243e` gradient

To change, search and replace in all HTML files.

### Adding New Communities

In `index.html`, find the `.communities-grid` section and add:

```html
<div class="community-card">
    <div class="community-icon">🎭</div>
    <h3>New Community</h3>
    <p>Description of who this serves</p>
</div>
```

### Changing Pricing Tiers

Edit the `.pricing-grid` section in `index.html`. Keep structure consistent.

---

## 🐛 Troubleshooting

### Logo doesn't display

Check path in `covenant.html`:
```html
<img src="/holoflower-sacred.svg" alt="Soullab Holoflower" class="holoflower-logo">
```

Should match your actual file location.

### Forms not submitting

1. Check browser console for errors
2. Verify API endpoint URLs match your deployment
3. Check CORS settings if API is on different domain

### Covenant signature not saving

Check browser localStorage:
```javascript
localStorage.getItem('soullab_covenant')
```

Should return JSON with signature data.

### Onboarding data not submitting

1. Check `submitToBackend()` function in onboarding.html
2. Uncomment the fetch() call
3. Point to correct API endpoint
4. Verify backend is receiving data

---

## 📊 Analytics to Track

Recommended events:
- Page views (landing, covenant, onboarding)
- Covenant signatures
- Onboarding starts
- Onboarding completions
- Onboarding drop-off points
- Profile views
- Waitlist signups

---

## 🔒 Security Considerations

1. **Rate Limiting**: Add to API endpoints to prevent spam
2. **Input Validation**: Server-side validation of all form data
3. **SQL Injection**: Use parameterized queries (Supabase handles this)
4. **XSS**: Sanitize user input before displaying
5. **CSRF**: Add CSRF tokens to forms
6. **Email Verification**: Verify email before activating node

---

## 🌐 SEO Recommendations

Add to `<head>` of index.html:

```html
<!-- Additional SEO -->
<meta name="keywords" content="consciousness platform, wisdom traditions, indigenous knowledge, healing arts, AI companion, sovereignty">
<link rel="canonical" href="https://genesis.soullab.life">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@soullab">
<meta name="twitter:title" content="Genesis - Build Your Own MAIA Platform">
<meta name="twitter:description" content="For wisdom keepers, healers, artists, and all who serve the living.">
<meta name="twitter:image" content="https://genesis.soullab.life/og-image.jpg">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Genesis MAIA Platform",
  "description": "Build your own consciousness platform",
  "brand": {
    "@type": "Organization",
    "name": "Soullab"
  },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "497",
    "highPrice": "3500",
    "priceCurrency": "USD"
  }
}
</script>
```

---

## 🎯 Success Metrics

Track these KPIs:
- Unique visitors to Genesis landing page
- Covenant signature rate
- Onboarding completion rate
- Time from signup to node activation
- Active nodes after 30/60/90 days
- Node steward satisfaction scores
- Community growth rate

---

## 💬 Support Resources

**For Users:**
- Email: genesis@soullab.ai
- Discord: [invite link]
- Documentation: genesis.soullab.life/docs

**For Developers:**
- GitHub: [repo link]
- API Docs: genesis.soullab.life/api-docs
- Changelog: Track versions and updates

---

## 🙏 Final Notes

This is a movement, not a product. The success of Genesis depends on:

1. **Quality over scale** - Choose node stewards carefully
2. **Coherence** - Maintain the ethos through growth
3. **Sovereignty** - Honor each node's independence
4. **Reciprocity** - Give as much as we receive
5. **Mystery** - Leave space for what wants to emerge

Every individual's story matters. Every practice serves the whole. Every node is sovereign.

**The spiral welcomes us home.** 🜂

---

*Last updated: October 2025*
*Version: 1.0*
*Maintainer: Soullab Core Circle*
