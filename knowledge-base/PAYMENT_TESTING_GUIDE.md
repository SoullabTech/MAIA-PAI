# PAYMENT & SUBSCRIPTION TESTING GUIDE

**Created:** 2025-10-24
**Purpose:** Test complete payment infrastructure before founding member launch

---

## SETUP CHECKLIST

### 1. Environment Variables Required

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_... # Test key for development
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe webhook setup
STRIPE_PRICE_EXPLORER_MONTHLY=price_...
STRIPE_PRICE_EXPLORER_ANNUAL=price_...
STRIPE_PRICE_PRACTITIONER_MONTHLY=price_...
STRIPE_PRICE_PRACTITIONER_ANNUAL=price_...
STRIPE_PRICE_STUDIO_MONTHLY=price_...
STRIPE_PRICE_STUDIO_ANNUAL=price_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_URL=http://localhost:3000 # or your deployment URL
```

### 2. Database Migration

Run the subscription fields migration:

```bash
# Apply migration to Supabase
# Option 1: Via Supabase CLI
supabase db push

# Option 2: Via Supabase Dashboard
# Navigate to SQL Editor and run:
# /supabase/migrations/20251024_add_subscription_fields.sql
```

**Verify migration:**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'explorers'
AND column_name LIKE '%subscription%' OR column_name LIKE '%trial%';
```

Expected columns:
- subscription_status
- subscription_tier
- stripe_customer_id
- stripe_subscription_id
- trial_start_date
- trial_end_date
- trial_converted
- is_founder
- founder_discount_percent
- conversation_count_this_month

### 3. Stripe Webhook Setup

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Add endpoint:** `https://your-domain.com/api/stripe/webhook`
3. **Select events to listen to:**
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed

4. **Get webhook secret** and add to `.env` as `STRIPE_WEBHOOK_SECRET`

**For local testing with Stripe CLI:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## TESTING SCENARIOS

### Scenario 1: Free Tier Limits ⚡ CRITICAL

**Purpose:** Verify free tier conversation limits work

**Steps:**
1. Create test user (no subscription)
2. Start 3 conversations successfully
3. Attempt 4th conversation
4. **Expected:** Blocked with upgrade message

**Verification:**
```sql
SELECT explorer_id, conversation_count_this_month, subscription_tier, subscription_status
FROM explorers
WHERE explorer_id = 'test_user_id';
```

**Expected Result:**
- First 3 conversations: Success
- 4th conversation: Blocked
- Error message includes: "You've used all 3 free conversations this month"
- Suggestions include: "Start a 14-day free trial"

---

### Scenario 2: Start Free Trial ⚡ CRITICAL

**Purpose:** Verify trial initiation works

**API Call:**
```bash
curl -X POST http://localhost:3000/api/subscription/start-trial \
  -H "Content-Type: application/json" \
  -d '{"userId": "test_user_id"}'
```

**Verification:**
```sql
SELECT subscription_status, subscription_tier, trial_start_date, trial_end_date
FROM explorers
WHERE explorer_id = 'test_user_id';
```

**Expected Result:**
- subscription_status = 'trialing'
- subscription_tier = 'explorer'
- trial_end_date = trial_start_date + 14 days
- User can now have unlimited conversations

---

### Scenario 3: Trial → Paid Conversion ⚡ CRITICAL

**Purpose:** Verify trial converts to paid subscription

**Steps:**
1. Start trial for user
2. Use Stripe test card to purchase Explorer subscription
3. Webhook fires: `checkout.session.completed`
4. Database updates

**Test Card:** `4242 4242 4242 4242` (any future expiry, any CVC)

**Verification:**
```sql
SELECT subscription_status, subscription_tier, trial_converted, stripe_customer_id
FROM explorers
WHERE explorer_id = 'test_user_id';
```

**Expected Result:**
- subscription_status = 'active'
- subscription_tier = 'explorer'
- trial_converted = true
- stripe_customer_id populated
- stripe_subscription_id populated

---

### Scenario 4: Trial Expiration ⚡ CRITICAL

**Purpose:** Verify expired trial reverts to free tier

**Steps:**
1. Manually set trial_end_date to past date:
```sql
UPDATE explorers
SET trial_end_date = NOW() - INTERVAL '1 day'
WHERE explorer_id = 'test_user_id';
```
2. Attempt conversation
3. **Expected:** Blocked with trial expired message

**Expected Result:**
- Conversation blocked
- Message: "Your 14-day trial has ended"
- Options: "Add payment to continue" OR "Use 3 free conversations"

---

### Scenario 5: Founder Discount Detection ⚡ CRITICAL

**Purpose:** Verify founder pricing is detected and saved

**Steps:**
1. Create Stripe promotion code: `FOUNDER2025` (35% off forever)
2. Go through checkout with promotion code
3. Webhook fires with discount data

**Verification:**
```sql
SELECT is_founder, founder_discount_percent, founder_badge_earned
FROM explorers
WHERE explorer_id = 'test_user_id';
```

**Expected Result:**
- is_founder = true
- founder_discount_percent = 35
- founder_badge_earned = (current timestamp)

---

### Scenario 6: Payment Failure Handling

**Purpose:** Verify failed payment grace period

**Steps:**
1. Use declining test card: `4000 0000 0000 0341`
2. Let Stripe retry (3 attempts)
3. After 3rd failure, webhook fires

**Verification:**
```sql
SELECT subscription_status
FROM explorers
WHERE stripe_customer_id = 'cus_test...';
```

**Expected Result:**
- After 1st/2nd failure: Status stays 'active' (grace period)
- After 3rd failure: Status changes to 'past_due'
- User notified (email - when implemented)

---

### Scenario 7: Subscription Cancellation

**Purpose:** Verify cancellation reverts to free tier

**Steps:**
1. Via Stripe dashboard: Cancel subscription
2. Webhook `customer.subscription.deleted` fires

**Verification:**
```sql
SELECT subscription_status, subscription_tier
FROM explorers
WHERE stripe_customer_id = 'cus_test...';
```

**Expected Result:**
- subscription_status = 'canceled'
- subscription_tier = 'free'
- User data retained (journals, chart, etc.)
- User reverts to 3 conversations/month

---

### Scenario 8: Customer Portal Access

**Purpose:** Verify users can manage subscription

**API Call:**
```bash
curl -X POST http://localhost:3000/api/subscription/portal \
  -H "Content-Type: application/json" \
  -d '{"customerId": "cus_test..."}'
```

**Expected Result:**
- Returns Stripe portal URL
- User can:
  - Update payment method
  - View invoices
  - Cancel subscription
  - Change plan (upgrade/downgrade)

---

### Scenario 9: Monthly Conversation Reset

**Purpose:** Verify free tier resets monthly

**Steps:**
1. User on free tier uses 3 conversations
2. Wait for month change (or manually trigger):
```sql
-- Manually trigger reset for testing
UPDATE explorers
SET conversation_count_last_reset = NOW() - INTERVAL '1 month'
WHERE explorer_id = 'test_user_id';
```
3. Call increment function
4. Verify counter reset

**Expected Result:**
- Counter resets to 1 (not 4)
- User can have 3 more conversations

---

## EDGE CASES TO TEST

### Edge Case 1: Webhook Failure
**What if:** Stripe webhook fails to deliver
**Protection:** Stripe retries webhooks automatically
**Manual fix:** Can replay webhooks in Stripe dashboard

### Edge Case 2: Double-Charging
**What if:** User starts trial then immediately subscribes
**Protection:** Webhook checks for existing trial, marks as converted
**Result:** No duplicate charges

### Edge Case 3: Subscription During Trial
**What if:** User subscribes before trial ends
**Protection:** `trial_converted` flag set to true
**Result:** Smooth transition to paid, no gap in service

### Edge Case 4: Expired Card
**What if:** Card expires during subscription
**Protection:** 3-attempt grace period, email notifications
**Result:** User has time to update payment method

---

## MONITORING & LOGS

### What to Watch

**Console Logs:**
```
✅ Access granted: { userId, tier, isFounder }
✅ Subscription activated: { customerId, tier }
✅ Payment recorded: { amount, currency }
⚠️  Payment failed: { attemptCount }
🚨 Subscription set to past_due
```

**Database Queries:**
```sql
-- Active subscriptions
SELECT COUNT(*) FROM explorers WHERE subscription_status = 'active';

-- Trials active
SELECT COUNT(*) FROM explorers WHERE subscription_status = 'trialing';

-- Founders
SELECT COUNT(*) FROM explorers WHERE is_founder = true;

-- Revenue tracking (when logging payments)
SELECT SUM(amount) FROM payments WHERE status = 'succeeded';
```

---

## STRIPE TEST CARDS

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
Card declined: 4000 0000 0000 0341
Requires authentication: 4000 0025 0000 3155
```

**For all test cards:**
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## PRE-LAUNCH CHECKLIST

Before opening to founding members:

### Technical
- [ ] All 9 test scenarios pass
- [ ] Webhook endpoint verified in Stripe
- [ ] Database migration applied to production
- [ ] Environment variables set in production
- [ ] Logs show clean webhook processing
- [ ] Feature gating blocks free tier at 3 conversations
- [ ] Trial correctly grants 14 days Explorer access
- [ ] Founder discount correctly detected (35%)

### User Experience
- [ ] Upgrade prompts are clear and invitational
- [ ] Error messages are friendly (not technical)
- [ ] Customer portal link works
- [ ] Cancellation is easy (builds trust)
- [ ] No confusing edge cases in flow

### Business
- [ ] Stripe account in live mode (not test)
- [ ] Pricing correct for all tiers
- [ ] Founder promotion code created (`FOUNDER2025`)
- [ ] Founder code limited to 100 uses (or chosen cohort size)
- [ ] Tax handling configured (if applicable)
- [ ] Refund policy decided

---

## TROUBLESHOOTING

### Issue: Webhook not firing
**Check:**
- Webhook URL correct in Stripe dashboard
- Endpoint returns 200 status
- Webhook secret matches .env
- Events selected in Stripe webhook settings

**Solution:**
```bash
# Test locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

### Issue: Database not updating
**Check:**
- Supabase service role key has write permissions
- Migration applied (columns exist)
- User ID matches between Stripe metadata and database

**Debug:**
```typescript
// Add to webhook handler
console.log('Updating user:', userId);
console.log('Update data:', updateData);
console.log('Error:', error);
```

### Issue: Conversation limit not working
**Check:**
- FeatureGating correctly imported in PersonalOracleAgent
- Database function `increment_monthly_conversations` exists
- User has explorer_id populated

**Debug:**
```sql
-- Check conversation count
SELECT conversation_count_this_month, conversation_count_last_reset
FROM explorers
WHERE explorer_id = 'user_id';
```

---

## SUPPORT RESOURCES

**Stripe Documentation:**
- Testing: https://stripe.com/docs/testing
- Webhooks: https://stripe.com/docs/webhooks
- Billing: https://stripe.com/docs/billing

**Supabase Documentation:**
- Functions: https://supabase.com/docs/guides/database/functions
- RLS: https://supabase.com/docs/guides/auth/row-level-security

---

## POST-LAUNCH MONITORING

### Daily Checks (First Week)
- [ ] Webhook delivery rate (should be 100%)
- [ ] Failed payment count (should be <5%)
- [ ] Trial → paid conversion rate (target: 25-40%)
- [ ] Support requests about payments
- [ ] Any error logs in Stripe or Supabase

### Weekly Metrics
- MRR (Monthly Recurring Revenue)
- Active subscriptions by tier
- Founder member count
- Churn rate
- Average time trial → paid
- Free tier → trial conversion

---

**Status:** READY FOR TESTING
**Next Step:** Run through all 9 scenarios in development environment
**Before Launch:** Run scenarios again in staging/production with test mode

🜃 **Test thoroughly. Launch confidently.**
