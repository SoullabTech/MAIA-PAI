# Genesis System Testing Guide

Complete guide to test all Genesis features before going live.

---

## Quick Start

### 1. Start Development Server

```bash
npm run dev
```

Server should start on `http://localhost:3000`

### 2. Run Automated Tests

```bash
./test-genesis-system.sh
```

This will test all API endpoints and pages.

---

## Manual Testing Checklist

### ✅ Phase 1: Name Availability Checker

**Test Page:** http://localhost:3000/genesis-soullab-life/onboarding.html

1. Navigate to Step 4 (Node Configuration)
2. Enter a node name in the "Node Name" field
3. Verify real-time checking:
   - ⏳ "Checking availability..." appears
   - After 500ms, see result:
     - ✅ "[name] is available!" (green)
     - OR ❌ "[name] is already taken" with suggestions (red)
4. Click a suggestion and verify it populates the field
5. Try invalid characters (uppercase, spaces, special chars)
   - Should auto-format to lowercase/hyphens only

**Expected Results:**
- Real-time feedback without page reload
- Suggestions appear for taken names
- Auto-formatting works

---

### ✅ Phase 2: Complete Onboarding Flow

**Test Page:** http://localhost:3000/genesis-soullab-life/onboarding.html

**Step 1: Welcome**
1. Click "Begin Your Journey →"

**Step 2: The Covenant**
1. Read the covenant
2. Click "I Affirm This Covenant"
3. Verify haptic feedback (if on mobile)

**Step 3: Your Story**
1. Fill in all required fields:
   - Name: "Test User"
   - Email: "test@example.com"
   - Practice: "Test Practice"
   - Story: "Test story text"
2. Click "Continue →"

**Step 4: Node Configuration**
1. Enter unique node name: "test-node-[random-number]"
2. Wait for ✅ available confirmation
3. Select tradition, theme, use case
4. Click "Complete Setup →"

**Step 5: Completion**
1. Verify confirmation page shows
2. Check that email is displayed correctly
3. Verify "Next Steps" section appears

**Database Verification:**
```sql
-- Check if node was created
SELECT * FROM genesis_nodes ORDER BY created_at DESC LIMIT 1;

-- Check profile
SELECT * FROM genesis_profiles ORDER BY created_at DESC LIMIT 1;

-- Check covenant
SELECT * FROM genesis_covenants ORDER BY created_at DESC LIMIT 1;

-- Check event log
SELECT * FROM genesis_events ORDER BY created_at DESC LIMIT 5;
```

**Expected Results:**
- All steps navigate smoothly
- Data saves to database
- Email is captured
- Progress bar updates
- Completion message displays

---

### ✅ Phase 3: Admin Dashboard

**Test Page:** http://localhost:3000/genesis-soullab-life/admin.html

**Login:**
1. Password: `genesis2025` (or your `GENESIS_ADMIN_PASSWORD`)
2. Click "Access Dashboard"

**Dashboard Features:**
1. **Statistics Cards**
   - Total Nodes
   - Pending Nodes
   - Active Nodes
   - Total Covenants
   - Verify numbers match database

2. **Filter Buttons**
   - Click "All" - shows all nodes
   - Click "Pending" - shows only pending
   - Click "Active" - shows only active
   - Click "Suspended" - shows only suspended

3. **Node Table**
   - Verify all recent submissions appear
   - Check data displays correctly (name, tradition, status, created date)

4. **Node Actions**
   - Click "View Details" on a node
   - Verify modal shows all information:
     - Node name, URL
     - Steward name, email
     - Practice, location
     - Story, exploration, quote
     - Tradition, theme, tier
     - Status, created date

5. **Approve Node**
   - Click "Approve" on a pending node
   - Confirm the action
   - Verify:
     - Status changes to "active"
     - Success message appears
     - If email configured: User receives activation email

6. **Suspend Node**
   - Click "Suspend" on an active node
   - Confirm the action
   - Verify status changes to "suspended"

**Expected Results:**
- Authentication works
- Dashboard loads with statistics
- Filters work correctly
- Modal displays all data
- Actions update database
- UI updates after actions

---

### ✅ Phase 4: Email Automation

**Prerequisites:** `RESEND_API_KEY` must be configured in `.env.local`

**Test 1: Onboarding Complete Email**
1. Complete onboarding flow with real email
2. Check email inbox within 5 minutes
3. Verify email received:
   - Subject: "🌀 Welcome to Genesis - Your Node is Being Prepared"
   - Beautiful HTML formatting
   - Contains node name and URL
   - Has next steps section

**Test 2: Admin Notification Email**
1. After completing onboarding
2. Check admin email (set in `ADMIN_EMAIL` or defaults to genesis@soullab.life)
3. Verify email received:
   - Subject: "🌱 New Genesis Node Submission: [node-name]"
   - Contains all submission details
   - Link to admin dashboard

**Test 3: Node Activation Email**
1. Approve a pending node in admin dashboard
2. Check user's email
3. Verify email received:
   - Subject: "✨ Your Genesis Node is Live!"
   - Congratulations message
   - Node URL
   - Access instructions
   - Next steps

**Database Verification:**
```sql
-- Check email was saved
SELECT email FROM genesis_profiles ORDER BY created_at DESC LIMIT 5;
```

**Expected Results:**
- All three emails send successfully
- HTML templates render beautifully
- Plain text fallbacks work
- All dynamic data populates correctly

---

### ✅ Phase 5: Checkout Flow

**Prerequisites:** Stripe must be configured (see GENESIS-STRIPE-SETUP.md)

**Test Page:** http://localhost:3000/genesis-soullab-life/checkout.html

**Test 1: Tier Selection**
1. Review three tier cards (Seed, Grove, Forest)
2. Click "Select Seed"
3. Verify:
   - Card highlights with green border
   - Checkout form appears below
   - Order summary shows correct tier and price

**Test 2: Checkout Form**
1. Fill in form:
   - Name: "Test Buyer"
   - Email: "buyer@example.com"
2. Click "Proceed to Payment →"
3. Verify redirect to Stripe Checkout

**Test 3: Stripe Checkout (Test Mode)**
1. Use test card: `4242 4242 4242 4242`
2. Expiry: Any future date
3. CVC: Any 3 digits
4. ZIP: Any 5 digits
5. Click "Pay"
6. Verify redirect to success page

**Test 4: Payment Success Page**
1. Verify success message displays
2. Check "What Happens Next" section
3. Click "Complete Onboarding →" button
4. Verify navigation works

**Database Verification:**
```sql
-- Check payment was recorded
SELECT * FROM genesis_payments ORDER BY created_at DESC LIMIT 1;

-- Check if tier was upgraded (if nodeId was provided)
SELECT tier FROM genesis_nodes WHERE id = '[node-id]';

-- Check event was logged
SELECT * FROM genesis_events
WHERE event_type = 'tier_upgraded'
ORDER BY created_at DESC LIMIT 1;
```

**Stripe Dashboard Verification:**
1. Go to Stripe Dashboard → Payments
2. Verify payment appears
3. Check Webhooks → Recent Events
4. Verify `checkout.session.completed` succeeded

**Expected Results:**
- Tier selection UI works
- Form validation works
- Redirect to Stripe works
- Test payment succeeds
- Webhook processes correctly
- Payment records in database
- Success page displays

---

### ✅ Phase 6: Complete End-to-End Flow

**Full User Journey:**

1. **Landing Page**
   - Visit: http://localhost:3000/genesis-soullab-life/index.html
   - Click "Get Started →" on a tier (e.g., Seed)

2. **Checkout**
   - Select tier if not pre-selected
   - Enter name and email
   - Click "Proceed to Payment"

3. **Stripe Payment**
   - Use test card
   - Complete payment

4. **Payment Success**
   - Land on success page
   - Click "Complete Onboarding →"

5. **Onboarding**
   - Complete all 5 steps
   - Use unique node name
   - Submit

6. **Email Verification**
   - Check inbox for onboarding email
   - Check admin inbox for notification

7. **Admin Approval**
   - Login to admin dashboard
   - Find the new submission
   - Click "Approve"

8. **Activation Email**
   - User receives activation email

9. **Database Verification**
   - Node status = "active"
   - Node tier = paid tier (seed/grove/forest)
   - Payment status = "succeeded"
   - All data persisted correctly

**Expected Results:**
- Complete journey flows smoothly
- All emails sent
- Database reflects all changes
- No errors in console
- User has clear path forward

---

## Testing Different Scenarios

### Scenario 1: Duplicate Node Name
1. Note an existing node name in database
2. Try to submit onboarding with same name
3. **Expected:** Name checker shows "❌ already taken"
4. **Expected:** API returns 409 error if bypass attempted

### Scenario 2: Invalid Email
1. Enter invalid email: "notanemail"
2. Try to submit
3. **Expected:** Browser validation catches it

### Scenario 3: Failed Payment
1. Use test card: `4000 0000 0000 0002` (decline)
2. Complete checkout
3. **Expected:** Payment fails in Stripe
4. **Expected:** No payment record in database

### Scenario 4: Webhook Failure
1. Disable webhook endpoint temporarily
2. Complete payment
3. **Expected:** Payment succeeds in Stripe but not recorded
4. **Expected:** Can manually reconcile later

### Scenario 5: Missing Required Fields
1. Try to skip required fields in onboarding
2. **Expected:** Browser validation prevents submission
3. **Expected:** API validates server-side if bypassed

---

## Performance Testing

### Load Test Name Checker
```bash
# Install Apache Bench
brew install httpd

# Test name checker API
ab -n 100 -c 10 http://localhost:3000/api/genesis/check-name?name=test-node

# Expected: All requests succeed, < 200ms average
```

### Monitor Database Queries
1. Open Supabase Dashboard
2. Go to Database → Query Performance
3. Watch for slow queries during testing
4. Optimize if any query > 500ms

---

## Browser Testing

Test on multiple browsers:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

**Focus Areas:**
- Form validation
- Responsive design
- Modal interactions
- Button clicks
- Stripe redirect/return

---

## Console Error Checking

During all tests, keep browser console open:

**Should NOT see:**
- CORS errors
- 404 errors for assets
- JavaScript errors
- Failed API calls (except expected ones)

**Should see (normal):**
- API calls logging
- Navigation events
- Form submissions

---

## Troubleshooting Common Issues

### Name Checker Not Working
- Check: API route exists at `/api/genesis/check-name/route.ts`
- Check: Database connection working
- Check: Browser console for errors
- Check: Network tab shows request succeeding

### Admin Dashboard Login Fails
- Check: Password matches `GENESIS_ADMIN_PASSWORD` or default "genesis2025"
- Check: Admin API returns 401 without auth, 200 with auth
- Check: Bearer token being sent correctly

### Emails Not Sending
- Check: `RESEND_API_KEY` in `.env.local`
- Check: Server logs for email errors
- Check: Resend dashboard for sending status
- Check: Email address is valid

### Checkout Not Working
- Check: All Stripe env vars configured
- Check: Stripe products created
- Check: Price IDs correct
- Check: Webhook endpoint configured
- Check: Webhook secret correct

### Webhook Not Processing
- Check: Webhook URL accessible
- Check: Signature verification passing
- Check: Database connection working
- Check: Stripe Dashboard shows webhook success/failure

---

## Production Readiness Checklist

Before deploying to production:

### Configuration
- [ ] Stripe live keys configured
- [ ] Resend API key active
- [ ] Admin password changed from default
- [ ] Admin email configured
- [ ] All database migrations run
- [ ] Environment variables set in production

### Testing
- [ ] All automated tests pass
- [ ] Manual end-to-end flow tested
- [ ] Email delivery confirmed
- [ ] Payment flow tested (small real payment)
- [ ] Webhook processing confirmed
- [ ] Mobile responsiveness verified
- [ ] All browsers tested

### Security
- [ ] Admin password is strong
- [ ] API keys are in env vars, not code
- [ ] Webhook signature verification working
- [ ] Database RLS policies active
- [ ] HTTPS enabled in production
- [ ] CORS configured correctly

### Monitoring
- [ ] Stripe webhook monitoring enabled
- [ ] Email sending monitored
- [ ] Database query performance checked
- [ ] Error logging configured
- [ ] Analytics tracking set up (optional)

---

## Quick Reference: Test Credentials

### Admin
- **URL:** http://localhost:3000/genesis-soullab-life/admin.html
- **Password:** `genesis2025` (default)

### Stripe Test Cards
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Auth:** `4000 0025 0000 3155`

### Test Email
- **User:** test@example.com
- **Admin:** Your configured `ADMIN_EMAIL` or genesis@soullab.life

---

## Support & Debugging

### View Logs

**Server logs:**
```bash
# Terminal where npm run dev is running
# Watch for [GENESIS] prefixed logs
```

**Database logs:**
```sql
-- Recent events
SELECT * FROM genesis_events ORDER BY created_at DESC LIMIT 20;

-- Recent nodes
SELECT * FROM genesis_nodes ORDER BY created_at DESC LIMIT 10;

-- Recent payments
SELECT * FROM genesis_payments ORDER BY created_at DESC LIMIT 10;
```

### Enable Debug Mode

Add to `.env.local`:
```bash
DEBUG=true
NODE_ENV=development
```

---

**Happy Testing!** 🧪✨

Run automated tests: `./test-genesis-system.sh`

For setup help, see: `GENESIS-STRIPE-SETUP.md`
