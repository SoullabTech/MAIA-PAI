# Andrea Fagan - Troubleshooting Guide

## Tester Information
- **Name**: Andrea Fagan
- **Email**: andreadfagan@gmail.com
- **Passcode**: SOULLAB-ANDREAFAGAN

## Issue
Stuck after updating her platform

## Likely Causes & Solutions

### 1. Browser Cache Issue (Most Common)
After platform updates, cached data can cause conflicts.

**Solution - Clear Browser Data**:
```
1. Ask Andrea to clear her browser cache:
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Safari: Preferences → Privacy → Manage Website Data → Remove All
   - Firefox: Settings → Privacy → Clear Data → Cached Web Content

2. Close browser completely
3. Reopen and visit the platform fresh
4. Try logging in again
```

### 2. localStorage Conflicts
Old localStorage data might conflict with new database structure.

**Solution - Reset localStorage**:
```
Ask Andrea to:
1. Open browser console (F12 or Cmd+Option+I)
2. Go to Console tab
3. Type: localStorage.clear()
4. Press Enter
5. Refresh the page
6. Log in with passcode: SOULLAB-ANDREAFAGAN
```

### 3. Not in Supabase Database
She might not have been migrated to the new database system.

**Check Database**:
```sql
SELECT * FROM explorers
WHERE email = 'andreadfagan@gmail.com';
```

**If not found, add her**:
```bash
# Run this script to add Andrea to database
npx dotenv -e .env.local -- npx tsx scripts/add-andrea-fagan.ts
```

### 4. Stuck on Specific Page
Might be stuck on onboarding, login, or specific feature.

**Solutions by Location**:

**If stuck on Login**:
- Clear cache and localStorage (see above)
- Try different browser
- Use passcode: SOULLAB-ANDREAFAGAN

**If stuck on Onboarding**:
- Check if she completed signup
- Verify email in database
- Reset onboarding state: `localStorage.removeItem('onboarding_complete')`

**If stuck on Astrology Page**:
- New birth chart migration might need localStorage cleared
- Clear data and re-enter birth information
- Will now save to database permanently

**If stuck after entering birth data**:
- Migration added new fields - might need cache clear
- Try Edit Birth Data button
- Re-enter and it will save to new database structure

### 5. Session/Auth Issues
Authentication token might be expired or invalid.

**Solution**:
```javascript
// Have Andrea run in console:
localStorage.removeItem('beta_user');
localStorage.removeItem('authToken');
// Then refresh and log in again
```

## Quick Fix Script

Create a script to add Andrea to database if she's not there:

```typescript
// scripts/add-andrea-fagan.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addAndreaFagan() {
  const email = 'andreadfagan@gmail.com';
  const explorerName = 'Andrea';
  const invitationCode = 'SOULLAB-ANDREAFAGAN';

  const { data: existing } = await supabase
    .from('explorers')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    console.log('✅ Andrea already in database');
    return;
  }

  const { data, error } = await supabase
    .from('explorers')
    .insert({
      explorer_name: explorerName,
      email,
      invitation_code: invitationCode,
      agreement_accepted: false,
      signup_date: new Date().toISOString(),
      status: 'active',
      week_number: 1,
      arc_level: 1,
      session_count: 0
    })
    .select();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Andrea added to database!');
  }
}

addAndreaFagan();
```

## Step-by-Step User Instructions

**Send Andrea this message**:

---

Hi Andrea! 👋

It sounds like you might be experiencing a cache issue after the platform update. Here's how to get unstuck:

**Quick Fix (Try this first)**:

1. **Clear your browser cache**:
   - Chrome: Three dots → Settings → Privacy and security → Clear browsing data → Check "Cached images and files" → Clear data
   - Safari: Safari menu → Preferences → Privacy → Manage Website Data → Remove All

2. **Close your browser completely** (not just the tab)

3. **Reopen and go to the platform**

4. **Log in with your passcode**: `SOULLAB-ANDREAFAGAN`

**If that doesn't work**:

1. Open the browser console (Press F12, or right-click → Inspect → Console tab)
2. Type this exactly: `localStorage.clear()`
3. Press Enter
4. Refresh the page
5. Log in again with: `SOULLAB-ANDREAFAGAN`

**Still stuck?** Let me know exactly where you're stuck (what page, what you see) and I'll help you directly!

Your birth chart data (if you entered it) is now safely saved in the database, so you won't lose anything. ✨

---

## Database Check Commands

```sql
-- Check if Andrea is in database
SELECT
  explorer_id,
  explorer_name,
  email,
  invitation_code,
  status,
  signup_date,
  birth_chart_data IS NOT NULL as has_birth_chart
FROM explorers
WHERE email = 'andreadfagan@gmail.com';

-- Check her birth chart data if exists
SELECT
  explorer_name,
  birth_date,
  birth_time,
  birth_location_name,
  birth_chart_calculated_at
FROM explorers
WHERE email = 'andreadfagan@gmail.com'
  AND birth_chart_data IS NOT NULL;
```

## Prevention for Future

To prevent this for other testers:

1. Add migration notification banner
2. Add "Clear Cache" helper button
3. Add troubleshooting page at /help
4. Better error messages with recovery instructions
5. Automatic localStorage cleanup on major updates

## Next Steps

1. Check if Andrea is in database
2. Send her the user instructions above
3. If still stuck, create the add-andrea-fagan.ts script and run it
4. Verify she can access the platform
5. Confirm her birth chart data (if she had any) is intact
