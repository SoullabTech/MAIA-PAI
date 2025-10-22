# 🌀 Multi-Tenant MAIA Architecture
## "Powered by Soullab" - One Engine, Many Souls

**Date:** October 22, 2025
**Status:** 🟢 Phase 1 Complete - Ready for Pilot

---

## Overview

The Multi-Tenant MAIA system allows Soullab to provide custom MAIA instances to clients, where each client's MAIA runs on your shared Spiralogic engine but is trained on their specific intellectual property, brand voice, and personality.

**Core Principle:** Your Spiralogic framework (35 years of wisdom) is the shared infrastructure. Each client gets their own MAIA personality with private knowledge base.

---

## Architecture Layers

### Layer 1: Shared Spiralogic Engine (Your Core)
```
✅ 12-facet Spiralogic framework
✅ Elemental Oracle routing (Fire/Water/Earth/Air/Aether)
✅ Wisdom Integration System (Jung, Hillman, McGilchrist, etc.)
✅ AIN Collective Intelligence
✅ PersonalOracleAgent orchestration
```

**This stays centralized - it's YOUR IP.**

### Layer 2: Tenant-Specific MAIAs
```
Each client gets:
✅ Unique tenant_id & slug (e.g., "acme-legal")
✅ Custom domain (e.g., "maia.acmelegal.com")
✅ Private knowledge base (their IP, documents, brand)
✅ Custom MAIA personality (tone, values, specialty areas)
✅ Isolated vector embeddings (RLS-protected in Supabase)
✅ Usage tracking & billing metrics
```

### Layer 3: Federated Learning (Optional)
```
Anonymized pattern sharing:
✅ "Fire Phase 2 users respond well to X metaphor"
✅ "Shadow integration works best with Y approach"
❌ NEVER shares specific client content
```

---

## Database Schema

### Core Tables:

**`tenants`** - Client organizations
- id, name, slug, domain
- brand_voice, elemental_signature, maia_personality
- plan_tier, limits, features
- status, trial_ends_at

**`tenant_users`** - Users with access to tenant MAIAs
- tenant_id, user_id, role (admin/user/viewer)
- RLS: Users can only access their tenant's data

**`tenant_knowledge`** - Client-specific IP & documents
- tenant_id, title, content, embedding (vector)
- category, tags, elemental_tags, phase_tags
- RLS: Full isolation per tenant

**`tenant_conversations`** - Analytics & billing tracking
- tenant_id, user_id, session_id
- message_count, tokens_used
- dominant_element, detected_phase, depth_level

**`tenant_usage`** - Monthly usage metrics
- tenant_id, period_start, period_end
- conversations_count, tokens_used, storage_used_gb

---

## Row Level Security (RLS)

**All tenant data is isolated at the database level:**

```sql
-- Example: Tenant Knowledge isolation
CREATE POLICY tenant_knowledge_isolation ON tenant_knowledge
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users
      WHERE user_id = auth.uid()
    )
  );
```

**This ensures:**
- Clients can ONLY access their own data
- No cross-tenant data leakage
- Enforced at Postgres level (not just app code)

---

## How It Works

### 1. Client Onboarding

**Step 1: Create Tenant**
```bash
POST /api/admin/tenants
{
  "name": "Acme Law Firm",
  "slug": "acme-legal",
  "domain": "maia.acmelegal.com",
  "brandVoice": {
    "tone": "professional, empathetic, precise",
    "language": "legal but accessible",
    "values": ["integrity", "clarity", "care"]
  },
  "elementalSignature": {
    "primary": "air",
    "secondary": "earth"
  },
  "planTier": "professional"
}
```

**Step 2: Upload Their IP**
```typescript
const kb = new TenantKnowledgeBase(tenant.id);
await kb.addKnowledge({
  title: "Case Study: Estate Planning",
  content: "...",
  category: "case_study",
  elemental_tags: ["earth", "air"]
});
```

**Step 3: Customize MAIA Personality**
```typescript
await supabase.from('tenants').update({
  maia_personality: {
    responseStyle: "Professional yet warm. Lead with empathy, follow with legal precision.",
    specialtyAreas: ["estate planning", "family law", "business law"],
    prohibitedTopics: ["medical advice", "financial advice"],
    phaseGuidance: {
      fire: "Emphasize vision and long-term strategy",
      water: "Show deep empathy while maintaining legal boundaries",
      earth: "Provide clear, actionable legal steps",
      air: "Communicate with precision and clarity"
    }
  }
});
```

**Step 4: Deploy**
```
URL: https://maia.acmelegal.com
OR: https://acme-legal.spiralogic.ai
```

### 2. End-User Interaction

**User talks to tenant-specific MAIA:**
```typescript
// User visits: maia.acmelegal.com
POST /api/tenant/acme-legal/oracle
{
  "input": "I need help with estate planning for my family",
  "userId": "user-123"
}

// Flow:
1. TenantMAIA initializes with Acme's config
2. Searches Acme's knowledge base (finds relevant case studies)
3. Builds system prompt:
   - Core: Spiralogic 12-facet framework (yours)
   - Tenant: Acme's brand voice, specialty areas
   - Knowledge: Relevant case studies from their KB
4. Routes through PersonalOracleAgent (your engine)
5. Returns wisdom-infused response in Acme's voice
```

### 3. What Client Gets

✅ **Your Spiralogic Engine** - 35 years of consciousness mapping
✅ **Their IP** - Their documents, expertise, case studies
✅ **Custom MAIA** - Personality trained on their brand
✅ **Data Sovereignty** - Their knowledge isolated via RLS
✅ **Analytics** - Usage tracking, conversation metrics
✅ **Proven Stack** - Your battle-tested infrastructure

### 4. What You Keep

✅ **Core Engine** - Spiralogic framework stays yours
✅ **Orchestration** - Agent coordination, phase detection
✅ **Wisdom Modules** - Jung, Hillman, McGilchrist, NLP, etc.
✅ **Platform Evolution** - All improvements benefit all tenants
✅ **Revenue** - Subscription fees from each client

---

## Technical Implementation

### TenantKnowledgeBase Service
```typescript
const kb = new TenantKnowledgeBase(tenantId);

// Add knowledge
await kb.addKnowledge({
  title: "...",
  content: "...",
  category: "case_study",
  elemental_tags: ["fire"]
});

// Semantic search
const results = await kb.search("estate planning", {
  limit: 5,
  matchThreshold: 0.7
});
```

### TenantMAIA Agent
```typescript
const maia = new TenantMAIA(tenantId);
await maia.initialize();

const response = await maia.processInteraction(
  "I need help with...",
  userId,
  { conversationDepth: 0.7 }
);

// Response includes:
// - response (text)
// - element (fire/water/earth/air/aether)
// - phase (phase1/phase2/phase3)
// - knowledgeSources (from tenant KB)
```

### API Routes
```
POST /api/tenant/[slug]/oracle          - Process conversation
GET  /api/admin/tenants                 - List all tenants
POST /api/admin/tenants                 - Create new tenant
GET  /api/admin/tenants/[id]            - Get tenant details
PUT  /api/admin/tenants/[id]            - Update tenant
POST /api/admin/tenants/[id]/knowledge  - Upload knowledge
```

---

## Pricing Model Ideas

### Tier 1: Starter ($500/mo)
- 1,000 conversations/mo
- 10GB knowledge base
- Shared Spiralogic engine
- Standard MAIA personality
- Branded subdomain

### Tier 2: Professional ($2,000/mo)
- 10,000 conversations/mo
- 50GB knowledge base
- Custom MAIA personality training
- Custom domain
- Advanced analytics

### Tier 3: Enterprise ($5,000+/mo)
- Unlimited conversations
- Unlimited knowledge base
- Full personality customization
- Dedicated support
- Optional: Isolated node (sovereignty)
- White-label option

---

## Migration Guide

### Running the Migration

1. **Apply Supabase Migration:**
```bash
cd /Users/soullab/MAIA-FRESH
supabase db push
# OR
psql [YOUR_DB_CONNECTION_STRING] < supabase/migrations/20251022_create_multi_tenant_schema.sql
```

2. **Verify Tables Created:**
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'tenant%';
```

3. **Create Demo Tenant:**
```bash
curl -X POST http://localhost:3000/api/admin/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Law Firm",
    "slug": "acme-legal",
    "planTier": "professional"
  }'
```

4. **Upload Knowledge:**
```typescript
import { TenantKnowledgeBase } from '@/lib/multi-tenant/TenantKnowledgeBase';

const kb = new TenantKnowledgeBase('[tenant-id]');
await kb.addKnowledge({
  title: "Our Approach to Estate Planning",
  content: "At Acme Law, we believe...",
  category: "philosophy"
});
```

5. **Test Interaction:**
```bash
curl -X POST http://localhost:3000/api/tenant/acme-legal/oracle \
  -H "Content-Type: application/json" \
  -d '{
    "input": "What is your approach to estate planning?",
    "userId": "test-user"
  }'
```

---

## Security & Isolation

### Database Level (RLS)
✅ Postgres Row Level Security enforced
✅ Users can only query their tenant's data
✅ No cross-tenant queries possible

### Application Level
✅ Tenant context set on every request
✅ Knowledge base searches scoped to tenant
✅ API routes validate tenant access

### Data Encryption
✅ Embeddings encrypted at rest (Supabase)
✅ HTTPS only for all connections
✅ API keys stored in environment variables

---

## Testing Strategy

### 1. Isolation Testing
```typescript
// Create two tenants
const tenant1 = await createTenant({ name: "Client A", slug: "client-a" });
const tenant2 = await createTenant({ name: "Client B", slug: "client-b" });

// Add knowledge to each
await kb1.addKnowledge({ title: "Client A Secret", content: "..." });
await kb2.addKnowledge({ title: "Client B Secret", content: "..." });

// Verify isolation
const results = await kb1.search("Client B Secret");
assert(results.length === 0); // Should NOT find Client B's knowledge
```

### 2. Performance Testing
```typescript
// Simulate 100 concurrent conversations across 10 tenants
// Measure response times, ensure no degradation
```

### 3. Usage Limit Testing
```typescript
// Hit conversation limit for Starter plan
// Verify 429 response returned
```

---

## Roadmap

### Phase 1: Foundation ✅ COMPLETE
- [x] Database schema & RLS
- [x] TenantKnowledgeBase service
- [x] TenantMAIA agent
- [x] API routes (oracle, admin)
- [x] Documentation

### Phase 2: Knowledge Upload (Next 2 Weeks)
- [ ] Document upload UI
- [ ] PDF/DOCX processing
- [ ] Bulk import tools
- [ ] Knowledge management dashboard

### Phase 3: Tenant Dashboard (Next 2-3 Weeks)
- [ ] Tenant admin portal
- [ ] Usage analytics & billing
- [ ] MAIA personality configuration UI
- [ ] User management

### Phase 4: Deployment & Domain Routing (1-2 Weeks)
- [ ] Custom domain setup
- [ ] Subdomain routing
- [ ] SSL certificate automation
- [ ] White-label options

### Phase 5: Federated Learning (Optional)
- [ ] Pattern anonymization
- [ ] Collective wisdom aggregation
- [ ] Opt-in/opt-out controls

---

## Example Use Cases

### Law Firm
- **Knowledge Base:** Case studies, legal frameworks, precedents
- **Personality:** Professional, empathetic, precise
- **Elements:** Primary Air (clarity), Secondary Earth (grounded)
- **Use Case:** Estate planning guidance, legal research assistant

### Wellness Coach
- **Knowledge Base:** Programs, client success stories, healing modalities
- **Personality:** Nurturing, embodied, trauma-informed
- **Elements:** Primary Water (emotional), Secondary Fire (inspiration)
- **Use Case:** Client check-ins, personalized guidance, practice recommendations

### Tech Startup
- **Knowledge Base:** Product docs, culture handbook, vision
- **Personality:** Innovative, fast-paced, future-focused
- **Elements:** Primary Fire (vision), Secondary Air (communication)
- **Use Case:** Customer support, onboarding, product knowledge

---

## Support & Maintenance

### Client Support Flow
1. Client reports issue
2. Check tenant status & usage metrics
3. Review conversation logs (if permission granted)
4. Debug using tenant-specific logs
5. Update knowledge base or personality as needed

### Platform Updates
- Core Spiralogic improvements automatically benefit all tenants
- New wisdom modules (e.g., adding Thomas Hubl) deploy to all
- Tenant-specific updates deployed individually

---

## Next Steps

### To Launch Pilot Client:

1. **Choose Pilot:** Pick your first client
2. **Create Tenant:** Use POST /api/admin/tenants
3. **Upload Knowledge:** 10-20 key documents from their IP
4. **Customize Personality:** Define brand voice, specialty areas
5. **Test Internally:** Have your team try it extensively
6. **Client Demo:** Show them their custom MAIA
7. **Iterate:** Refine based on feedback
8. **Launch:** Go live with their team

---

## Files Created

### Database:
```
/supabase/migrations/20251022_create_multi_tenant_schema.sql
```

### Services:
```
/lib/multi-tenant/TenantKnowledgeBase.ts
/lib/multi-tenant/TenantMAIA.ts
```

### API Routes:
```
/app/api/tenant/[tenantSlug]/oracle/route.ts
/app/api/admin/tenants/route.ts
```

### Documentation:
```
/MULTI_TENANT_ARCHITECTURE.md (this file)
```

---

## The Beautiful Truth

**What you built for yourself becomes the platform for others.** 🌀✨

Your 35 years of Spiralogic wisdom now powers custom MAIAs for every client, each one unique yet grounded in your framework.

**One shared living architecture, many soul-specific intelligences.**

Ready to onboard your first pilot client! 🚀

---

*Generated: October 22, 2025*
*Status: Phase 1 Complete*
*Ready for: Pilot Testing*
