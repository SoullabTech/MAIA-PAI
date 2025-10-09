# Message to Send Beta Testers Who Bypassed Code Entry

---

## Quick Email/Text Version

```
Hi [Name],

Quick tech update - we noticed some testers were able to skip the access code step during signup (especially on iPhone).

To make sure we can properly track your feedback and monitor your experience, please visit this link and enter your access code:

https://soullab.life/complete-signup

Your access code is: SOULLAB-[YOUR-NAME]

Don't worry - all your conversations and progress are saved and will remain exactly as they are. This just helps us track everything properly on our end.

Takes 30 seconds. Thank you! 🙏

- Kelly
```

---

## Longer/More Detailed Version

```
Hey [Name],

Hope you're enjoying your time with Maya!

I wanted to reach out because we discovered a bug in our signup flow (especially affecting iPhone users) that let some beta testers skip past the access code verification step.

While everything you've done is safely saved, we need you to complete one quick step so we can:
- Track your sessions properly in our beta monitoring system
- Connect your feedback to the right account
- Ensure you're getting the full beta experience

**What to do:**
1. Visit: https://soullab.life/complete-signup
2. Enter your access code: SOULLAB-[YOUR-NAME]
3. That's it!

**Your data is safe:**
✅ All your conversations with Maya are preserved
✅ Your preferences and settings remain the same
✅ Nothing will change in your experience
✅ This is purely for our backend tracking

Takes less than a minute. Thanks for being part of this beta - your participation means everything!

Let me know if you have any questions.

- Kelly

---

PS: If you've already completed this, you can ignore this message!
```

---

## For Your Beta Tester Spreadsheet

You can also create a tracking column with their recovery links:

| Name | Email | Access Code | Recovery Link | Status |
|------|-------|-------------|---------------|--------|
| Andrea Fagan | andreadfagan@gmail.com | SOULLAB-ANDREAFAGAN | https://soullab.life/complete-signup?code=SOULLAB-ANDREAFAGAN | ⏳ Pending |
| Andrea Nezat | andreanezat@gmail.com | SOULLAB-ANDREA | https://soullab.life/complete-signup?code=SOULLAB-ANDREA | ⏳ Pending |

---

## Quick Copy-Paste for Each Tester

### Andrea Fagan
```
Hi Andrea! Quick tech update - please visit https://soullab.life/complete-signup and enter your access code: SOULLAB-ANDREAFAGAN
All your conversations are safe - this just helps us track your beta experience properly. Takes 30 seconds. Thanks! 🙏
```

### Andrea Nezat
```
Hi Andrea! Quick tech update - please visit https://soullab.life/complete-signup and enter your access code: SOULLAB-ANDREA
All your conversations are safe - this just helps us track your beta experience properly. Takes 30 seconds. Thanks! 🙏
```

### Angela Economakis
```
Hi Angela! Quick tech update - please visit https://soullab.life/complete-signup and enter your access code: SOULLAB-ANGELA
All your conversations are safe - this just helps us track your beta experience properly. Takes 30 seconds. Thanks! 🙏
```

### Augusten Nezat
```
Hi Augusten! Quick tech update - please visit https://soullab.life/complete-signup and enter your access code: SOULLAB-AUGUSTEN
All your conversations are safe - this just helps us track your beta experience properly. Takes 30 seconds. Thanks! 🙏
```

### Cece Campbell
```
Hi Cece! Quick tech update - please visit https://soullab.life/complete-signup and enter your access code: SOULLAB-CECE
All your conversations are safe - this just helps us track your beta experience properly. Takes 30 seconds. Thanks! 🙏
```

---

## For Your Client Specifically

Since you mentioned your client was the one who brought this up:

```
Hi [Client Name],

Thank you SO much for catching this! You were absolutely right - there was a bug in our signup flow.

I've just pushed a fix, and I need you to complete one quick step:

Visit: https://soullab.life/complete-signup
Enter your code: SOULLAB-[THEIR-CODE]

This will properly connect your account to our beta monitoring system so we can track your feedback and sessions correctly.

**Everything you've done is 100% safe and saved** - this is purely for our backend tracking.

Seriously, thank you for flagging this. It's helping us improve the experience for everyone!

- Kelly
```

---

## How to Check if They Completed It

After they complete the recovery flow, you can verify in your beta monitor:
1. Go to `https://soullab.life/beta/monitor`
2. Click the "Users" tab
3. Look for their name - it should now show as "Active" with their proper access code
4. Their session count and engagement metrics should be visible

---

**File locations:**
- Recovery page: `/app/complete-signup/page.tsx`
- Beta monitor: `/app/beta/monitor/page.tsx`
- User tracking API: `/app/api/beta/users/route.ts`