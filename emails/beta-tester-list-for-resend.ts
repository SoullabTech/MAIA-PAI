/**
 * Beta Tester Contact List for Re-signup Email
 * Based on BETA_USERS_LIST.md
 */

export const betaTesters = [
  // Recently Added (September 28)
  { name: 'Romeo', firstName: 'Romeo', email: 'romeo@veydrisresearch.com', code: 'SOULLAB-ROMEO' },
  { name: 'Stephen', firstName: 'Stephen', email: 'sparkles1724@gmail.com', code: 'SOULLAB-STEPHEN' },
  { name: 'Weezie', firstName: 'Weezie', email: 'weezie.delavergne@gmail.com', code: 'SOULLAB-WEEZIE' },
  { name: 'Korey', firstName: 'Korey', email: 'koreyrichey@gmail.com', code: 'SOULLAB-KOREY' },
  { name: 'Karen', firstName: 'Karen', email: 'karenmccullen@hotmail.com', code: 'SOULLAB-KAREN' },
  { name: 'Natasha', firstName: 'Natasha', email: 'tashajam@gmail.com', code: 'SOULLAB-NATASHA' },
  { name: 'Catherine', firstName: 'Catherine', email: 'catherine@atthefield.uk', code: 'SOULLAB-CATHERINE' },

  // Recently Added (September 27)
  { name: 'Thea', firstName: 'Thea', email: 'thea@theapagel.com', code: 'SOULLAB-THEA' },
  { name: 'Virginia', firstName: 'Virginia', email: 'vmiller@bmfcomms.com', code: 'SOULLAB-VIRGINIA' },
  { name: 'Jondi', firstName: 'Jondi', email: 'jondi@eft4results.com', code: 'SOULLAB-JONDI' },
  { name: 'Joseph', firstName: 'Joseph', email: 'crownhouseone@gmail.com', code: 'SOULLAB-JOSEPH' },
  { name: 'Leah Emmerich', firstName: 'Leah', email: 'LeachEmmerich@gmail.com', code: 'SOULLAB-LEAH' },

  // Kelly (already signed up successfully - exclude from re-send)
  // { name: 'Kelly', firstName: 'Kelly', email: 'kelly@soullab.org', code: 'SOULLAB-KELLY' },

  // Add the remaining 21 from the original cohort once you have their details
  // Placeholder format:
  // { name: 'FirstName', firstName: 'FirstName', email: 'email@example.com', code: 'SOULLAB-FIRSTNAME' },
];

export const emailTemplate = (firstName: string, code: string) => `
Subject: Quick Fix: MAIA Beta Signup Glitch Resolved 🔧

Hey ${firstName},

Quick heads up about a technical glitch that affected MAIA's beta signup flow.

**What happened:**
For the first few days of beta, there was a silent database issue that prevented some signups from being properly saved. This is the reality of beta testing - we catch these things early so the experience gets better for everyone.

**The fix:**
The signup system has been repaired and verified working. Your data will now be properly saved and tracked.

**What you need to do:**
Please re-complete the signup flow - it only takes 2-3 minutes:

**Step 1:** Go to **https://soullab.life/beta-signup**

**Step 2:** Enter your access code: **${code}**

**Step 3:** Create a username and password
- Choose any username you like (this is how you'll log in)
- Create a secure password (you'll use this each time you return)

**Step 4:** Complete the brief onboarding questions

That's it! Once you're through, MAIA will properly remember your conversations, preferences, and journey.

**Why this matters:**
Without re-signing up, MAIA won't be able to:
- Save your conversation history
- Track your breakthrough moments
- Personalize to your patterns
- Remember your preferences

**Apologies for the friction:**
This is exactly what beta testing is for - finding and fixing these issues before wider release. Your patience as we work out these early glitches is what makes this possible.

**Questions or issues?**
Just reply to this email. I'm here to help.

Thanks for being part of this pioneering cohort,
[Your Name]

P.S. Once you've re-signed up, you're good to go - this won't happen again. The system is now stable and verified.

---

**Technical Details (for those who want them):**
- The issue was a schema mismatch between our API and database
- It affected signups from Sept 27-30
- All new signups are now working correctly and verified
- Your original access code (${code}) remains valid
`;

// Generate all personalized emails
console.log('\n📧 MAIA Beta Re-signup Emails\n');
console.log('━'.repeat(60));
console.log(`\nTotal emails to send: ${betaTesters.length}\n`);

betaTesters.forEach((tester, index) => {
  console.log(`${index + 1}. ${tester.name} (${tester.email})`);
  console.log(`   Code: ${tester.code}`);
  console.log('');
});

console.log('━'.repeat(60));
console.log('\n💡 Copy each personalized email below:\n');
console.log('━'.repeat(60));

betaTesters.forEach((tester) => {
  console.log(`\n\n========== EMAIL FOR: ${tester.name.toUpperCase()} ==========\n`);
  console.log(`To: ${tester.email}`);
  console.log(emailTemplate(tester.firstName, tester.code));
  console.log(`\n========== END EMAIL FOR: ${tester.name.toUpperCase()} ==========\n`);
});

console.log('\n✅ All emails generated!');
console.log('\n📝 Next steps:');
console.log('1. Copy each email into your email client');
console.log('2. Send from your personal email for warmth');
console.log('3. Consider staggering sends over 30-60 minutes');
console.log('4. Track responses and re-signups\n');
