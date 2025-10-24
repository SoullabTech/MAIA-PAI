# Genesis Pre-Flight Checklist ✈️

Quick checklist before testing or launching Genesis.

---

## 🗄️ Database Setup

### Run Migrations in Supabase SQL Editor

Copy and run these in order:

#### 1. Email Support
```sql
-- File: supabase/migrations/20251024_add_email_to_profiles.sql
ALTER TABLE genesis_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE genesis_profiles ADD CONSTRAINT valid_email_format CHECK (
  email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);
CREATE INDEX IF NOT EXISTS idx_genesis_profiles_email ON genesis_profiles(email);
```

#### 2. Payment Tracking
```sql
-- File: supabase/migrations/20251024_genesis_payments.sql
-- Copy full contents of the file and run
-- Creates: genesis_payments, genesis_subscriptions tables
```

### Verify Tables Exist
```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'genesis%';

-- Should show:
-- genesis_nodes
-- genesis_profiles
-- genesis_covenants
-- genesis_onboarding
-- genesis_events
-- genesis_payments
-- genesis_subscriptions
```

---

## 🔐 Environment Variables

### Check `.env.local` has:

```bash
# Supabase (should already exist)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend (for emails)
RESEND_API_KEY=re_...

# Admin (optional, defaults to genesis2025)
GENESIS_ADMIN_PASSWORD=your-secure-password
ADMIN_EMAIL=youremail@soullab.life

# Stripe (required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_SEED=price_...
STRIPE_PRICE_ID_GROVE=price_...
STRIPE_PRICE_ID_FOREST=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Quick Check Commands

```bash
# Check if Resend key exists
grep RESEND_API_KEY .env.local

# Check if Stripe keys exist
grep STRIPE_ .env.local

# Check if Supabase keys exist
grep SUPABASE .env.local
```

---

## 📧 Resend Setup (5 minutes)

### If Not Already Configured:

1. **Sign up:** https://resend.com/signup
2. **Verify domain** (optional but recommended):
   - Go to Domains
   - Add `soullab.life`
   - Add DNS records
3. **Get API Key:**
   - Go to API Keys
   - Create key
   - Copy to `.env.local` as `RESEND_API_KEY`

**Test Email:**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "genesis@soullab.life",
    "to": "your-email@example.com",
    "subject": "Genesis Test",
    "html": "<p>It works!</p>"
  }'
```

---

## 💳 Stripe Setup (10-15 minutes)

### Quick Setup:

1. **Account:** https://dashboard.stripe.com/register
2. **Get Keys:** Developers → API keys → Copy both keys
3. **Create Products:** Products → + Add product
   - Seed: $197
   - Grove: $497
   - Forest: $997
4. **Copy Price IDs** for each product
5. **Webhook:** Developers → Webhooks → + Add endpoint
   - URL: `https://www.soullab.life/api/genesis/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret

**Detailed guide:** See `GENESIS-STRIPE-SETUP.md`

---

## 🚀 Start Dev Server

```bash
npm run dev
```

Should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

## 🧪 Quick Smoke Test

### Run Automated Tests:
```bash
chmod +x test-genesis-system.sh
./test-genesis-system.sh
```

### Or Manual Quick Test:

1. **Name Checker:**
   - Visit: http://localhost:3000/genesis-soullab-life/onboarding.html
   - Go to Step 4
   - Type a node name
   - See real-time validation ✅

2. **Admin Dashboard:**
   - Visit: http://localhost:3000/genesis-soullab-life/admin.html
   - Password: `genesis2025`
   - Should load dashboard

3. **Checkout:**
   - Visit: http://localhost:3000/genesis-soullab-life/checkout.html
   - See three tiers
   - Click "Select Seed"
   - Form should appear

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot find project ref" (Supabase)
**Fix:** You're using Supabase hosted, not local. Use Supabase Dashboard for migrations instead of CLI.

### Issue: Name checker shows error
**Fix:** Check database connection and that `genesis_nodes` table exists.

### Issue: Admin dashboard won't load
**Fix:** Check admin API works:
```bash
curl http://localhost:3000/api/genesis/admin/nodes \
  -H "Authorization: Bearer genesis2025"
```

### Issue: Emails not sending
**Fix:** Check `RESEND_API_KEY` is set and valid in Resend dashboard.

### Issue: Checkout fails
**Fix:** Check Stripe env vars are set:
```bash
grep STRIPE .env.local | grep -E "PRICE_ID|SECRET_KEY|PUBLISHABLE"
```

---

## ✅ Ready to Test Checklist

Before full testing:

- [ ] Dev server running (`npm run dev`)
- [ ] Database migrations run (check Supabase tables)
- [ ] `.env.local` has all required keys
- [ ] Resend API key configured (if testing emails)
- [ ] Stripe keys configured (if testing payments)
- [ ] Admin password known
- [ ] Test automated script passes: `./test-genesis-system.sh`

---

## 🎯 Testing Priority Order

1. **Without any external services:**
   - ✅ Name checker
   - ✅ Admin dashboard
   - ✅ Onboarding form (without submission)

2. **With database only:**
   - ✅ Complete onboarding
   - ✅ Admin approval/suspend

3. **With Resend:**
   - ✅ Email notifications

4. **With Stripe:**
   - ✅ Full payment flow

---

## 📊 System Status Dashboard

### Check System Health:

```bash
# 1. Dev server running?
curl -I http://localhost:3000

# 2. Database connected?
# Check in Supabase Dashboard → Database → Tables

# 3. APIs responding?
curl http://localhost:3000/api/genesis/check-name?name=test

# 4. Admin API secured?
curl http://localhost:3000/api/genesis/admin/nodes
# Should return 401 Unauthorized
```

---

## 🎬 Ready to Launch?

After successful testing, see:
- **Production Deployment:** (TBD - deployment guide)
- **Monitoring Setup:** (TBD - monitoring guide)
- **User Documentation:** (TBD - user guide)

---

**Current Status:**
- ✅ Name Checker - Built & Ready
- ✅ Admin Dashboard - Built & Ready
- ✅ Email Automation - Built (needs Resend)
- ✅ Payment System - Built (needs Stripe)

**Next Steps:**
1. Run database migrations
2. Configure Resend (optional)
3. Configure Stripe (for payments)
4. Run tests
5. Test end-to-end flow

---

**Questions?** See detailed guides:
- Setup: `GENESIS-STRIPE-SETUP.md`
- Testing: `GENESIS-TESTING-GUIDE.md`
- Automated tests: `./test-genesis-system.sh`
