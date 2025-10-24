# MAIA Subscription System - Complete Setup Guide

## 🎉 Overview

The MAIA subscription system is now **production-ready** with:

✅ **Tier Management** - Free, Explorer, Practitioner, Studio
✅ **Free Trial System** - 14-day trial with full Explorer access
✅ **Usage Tracking** - Monthly conversation limits for free tier
✅ **Stripe Integration** - Webhooks for subscription lifecycle
✅ **Admin Dashboard** - Real-time analytics and metrics
✅ **Email Notifications** - Automated trial expiration emails
✅ **Comprehensive Tests** - Full test coverage for all scenarios

---

## 📋 Table of Contents

1. [Environment Variables](#environment-variables)
2. [Database Setup](#database-setup)
3. [Stripe Configuration](#stripe-configuration)
4. [Email Service Setup](#email-service-setup)
5. [Cron Jobs](#cron-jobs)
6. [Admin Dashboard](#admin-dashboard)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## 🔐 Environment Variables

Add these to your `.env.local`:

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL="https://jkbetmadzcpoinjogkli.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Stripe
STRIPE_SECRET_KEY="sk_live_..." # or sk_test_... for testing
STRIPE_PUBLISHABLE_KEY="pk_live_..." # or pk_test_...
STRIPE_WEBHOOK_SECRET="whsec_..." # Get from Stripe Dashboard

# Stripe Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_EXPLORER_MONTHLY="price_..."
STRIPE_PRICE_EXPLORER_ANNUAL="price_..."
STRIPE_PRICE_PRACTITIONER_MONTHLY="price_..."
STRIPE_PRICE_PRACTITIONER_ANNUAL="price_..."
STRIPE_PRICE_STUDIO_MONTHLY="price_..."
STRIPE_PRICE_STUDIO_ANNUAL="price_..."

# Email Service (Resend)
RESEND_API_KEY="re_..." # Get from resend.com
FROM_EMAIL="MAIA <hello@genesis.soullab.life>"

# Admin Dashboard
ADMIN_API_KEY="your-secure-random-key-here"

# Cron Job Security
CRON_SECRET="your-cron-secret-key"
```

---

## 💾 Database Setup

### 1. Run the Migration

The database migration has already been applied. It includes:

- ✅ `increment_monthly_conversations(user_id UUID)` - Auto-resets monthly
- ✅ `get_monthly_conversation_count(user_id UUID)` - Returns current count
- ✅ `is_trial_active(user_id UUID)` - Checks trial status
- ✅ `get_trial_days_remaining(user_id UUID)` - Calculates days left

### 2. Verify Functions Exist

```bash
node verify-db-functions.js
```

Expected output: ✅ ALL DATABASE FUNCTIONS VERIFIED!

---

## 💳 Stripe Configuration

### 1. Create Products & Prices

In Stripe Dashboard → Products:

**Explorer Tier**
- Name: MAIA Explorer
- Price: $29/month (or $290/year with 17% savings)
- Description: Unlimited conversations, full feature access

**Practitioner Tier**
- Name: MAIA Practitioner
- Price: $149/month (or $1,490/year)
- Description: White-label + 25 client portals

**Studio Tier**
- Name: MAIA Studio
- Price: $499/month (or $4,990/year)
- Description: Unlimited everything

### 2. Configure Webhooks

Stripe Dashboard → Developers → Webhooks → Add endpoint:

**Endpoint URL:** `https://genesis.soullab.life/api/webhooks/stripe`

**Events to listen for:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `checkout.session.completed`

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

### 3. Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to localhost
./test-stripe-webhooks.sh
```

Then trigger test events:
```bash
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

### 4. Update Price ID Mapping

Edit `app/api/webhooks/stripe/route.ts` line ~280:

```typescript
const tierMap: Record<string, string> = {
  'price_YOUR_EXPLORER_MONTHLY': 'explorer',
  'price_YOUR_EXPLORER_ANNUAL': 'explorer',
  'price_YOUR_PRACTITIONER_MONTHLY': 'practitioner',
  'price_YOUR_PRACTITIONER_ANNUAL': 'practitioner',
  'price_YOUR_STUDIO_MONTHLY': 'studio',
  'price_YOUR_STUDIO_ANNUAL': 'studio'
};
```

---

## 📧 Email Service Setup

### 1. Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Create account
3. Get API key
4. Add to `RESEND_API_KEY` in env

### 2. Configure Domain

1. Add your domain in Resend dashboard
2. Add DNS records (SPF, DKIM, etc.)
3. Verify domain
4. Update `FROM_EMAIL` to use your domain

### 3. Install Resend Package

```bash
npm install resend
```

### 4. Test Email Sending

Create a test user with trial ending soon and run:

```bash
curl -X GET http://localhost:3000/api/cron/check-trials \
  -H "Authorization: Bearer your-cron-secret"
```

---

## ⏰ Cron Jobs

### 1. Vercel Cron (Recommended)

The cron job is already configured in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/check-trials",
    "schedule": "0 10 * * *"
  }]
}
```

**Schedule:** Runs daily at 10:00 AM UTC

**What it does:**
- Checks for trials expiring in 3 days → sends warning email
- Checks for trials expiring today → sends final notice + downgrades to free
- Cleans up expired trials from yesterday

### 2. Manual Testing

```bash
curl -X GET http://localhost:3000/api/cron/check-trials \
  -H "Authorization: Bearer your-cron-secret"
```

### 3. Alternative: GitHub Actions

If not using Vercel, add `.github/workflows/cron.yml`:

```yaml
name: Trial Expiration Check
on:
  schedule:
    - cron: '0 10 * * *'
jobs:
  check-trials:
    runs-on: ubuntu-latest
    steps:
      - name: Call Cron Endpoint
        run: |
          curl -X GET https://genesis.soullab.life/api/cron/check-trials \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

---

## 📊 Admin Dashboard

### 1. Access Dashboard

URL: `https://genesis.soullab.life/admin/subscriptions`

### 2. Login with Admin Key

Use the `ADMIN_API_KEY` from your environment variables.

### 3. Dashboard Features

**Overview Metrics:**
- Total users
- Active subscribers
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)

**Tier Distribution:**
- Users by tier (Free, Explorer, Practitioner, Studio)
- Visual breakdown

**Trial Performance:**
- Active trials
- Expired trials
- Conversion rate

**Revenue Breakdown:**
- Revenue by tier
- Total MRR

**User Activity:**
- Top users by conversation count
- Recent signups and upgrades

### 4. API Access

For programmatic access:

```bash
curl https://genesis.soullab.life/api/admin/analytics \
  -H "Authorization: Bearer your-admin-key"
```

---

## 🧪 Testing

### Run All Tests

```bash
# Basic payment flow test (free tier limits)
./test-payment-scenarios.sh

# Comprehensive test suite (6 scenarios)
node test-all-payment-scenarios.js

# Tier upgrade tests (9 scenarios)
node test-tier-upgrades.js

# Database function verification
node verify-db-functions.js
```

### Test Scenarios Covered

#### ✅ Basic Payment Flow
1. Free tier: 3 conversations succeed, 4th blocked
2. Start trial: Free → Trialing
3. Trial expiration: Access blocked after 14 days

#### ✅ Comprehensive Suite
1. Free tier conversation limits
2. Start free trial
3. Trial expiration handling
4. Active paid subscription
5. Past due payment (grace period)
6. Founder status (special pricing)

#### ✅ Tier Upgrades
7. Free → Explorer → Practitioner → Studio progression
8. Downgrade protection (paid → free)
9. Mid-month upgrade behavior

### Expected Results

All tests should show:
```
🎉 ALL TESTS PASSED!
```

If any fail, check:
- Database functions are deployed
- Environment variables are set
- Server is running on port 3000

---

## 🚀 Deployment

### 1. Pre-Deployment Checklist

- [ ] All environment variables added to Vercel
- [ ] Stripe products created and price IDs mapped
- [ ] Stripe webhook endpoint configured
- [ ] Resend domain verified
- [ ] Admin API key set
- [ ] Cron secret set
- [ ] Database migration applied

### 2. Deploy to Vercel

```bash
vercel --prod
```

### 3. Post-Deployment Verification

**Test the webhook endpoint:**
```bash
stripe trigger customer.subscription.created
```

**Check webhook logs:**
Stripe Dashboard → Developers → Webhooks → Your endpoint → Events

**Test cron job:**
```bash
curl -X GET https://genesis.soullab.life/api/cron/check-trials \
  -H "Authorization: Bearer your-cron-secret"
```

**Access admin dashboard:**
Visit `https://genesis.soullab.life/admin/subscriptions`

### 4. Monitor

- Stripe Dashboard → Payments (check for successful charges)
- Vercel Logs → Functions (check cron execution)
- Resend Dashboard → Emails (verify delivery)
- Supabase → Table Editor (verify subscription updates)

---

## 📁 File Structure

```
MAIA-PAI/
├── app/
│   ├── api/
│   │   ├── subscription/
│   │   │   └── start-trial/route.ts
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts
│   │   ├── cron/
│   │   │   └── check-trials/route.ts
│   │   └── admin/
│   │       └── analytics/route.ts
│   └── admin/
│       └── subscriptions/page.tsx
├── lib/
│   ├── subscription/
│   │   └── FeatureGating.ts
│   └── email/
│       └── EmailService.ts
├── tests/
│   ├── test-payment-scenarios.sh
│   ├── test-all-payment-scenarios.js
│   ├── test-tier-upgrades.js
│   ├── verify-db-functions.js
│   └── test-stripe-webhooks.sh
└── docs/
    └── SUBSCRIPTION_SYSTEM_SETUP.md (this file)
```

---

## 🆘 Troubleshooting

### Conversation counter not incrementing

**Check:**
1. Database functions deployed: `node verify-db-functions.js`
2. User exists with UUID (not text string)
3. Function signature uses UUID not TEXT

**Fix:** Run `cleanup-old-functions.sql` then `subscription-migration-clean.sql`

### Webhooks not working

**Check:**
1. Webhook secret matches Stripe dashboard
2. Endpoint is publicly accessible
3. Events are selected in Stripe

**Debug:** Check Vercel function logs for errors

### Emails not sending

**Check:**
1. `RESEND_API_KEY` is set
2. Domain is verified in Resend
3. `FROM_EMAIL` uses verified domain

**Debug:** Check Resend logs for delivery issues

### Cron not running

**Check:**
1. `vercel.json` includes crons configuration
2. Endpoint returns 200 OK
3. `CRON_SECRET` matches

**Debug:** Manually trigger endpoint and check logs

---

## 🎯 Next Steps

1. **Create Checkout Page** - Build UI for users to subscribe
2. **Add Cancel Flow** - Allow users to cancel subscriptions
3. **Usage Analytics** - Track feature usage by tier
4. **Referral Program** - Reward users for referrals
5. **Team Features** - Multi-seat subscriptions for Studio tier

---

## 📞 Support

Questions? Issues?

- **Email:** kelly@soullab.org
- **Docs:** This file
- **Tests:** Run test suite to verify everything works

---

**Last Updated:** October 24, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
