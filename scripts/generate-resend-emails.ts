#!/usr/bin/env tsx
/**
 * Generate personalized re-signup emails for beta testers
 * Run: npx tsx scripts/generate-resend-emails.ts > beta-resend-emails.txt
 */

import { betaTesters, emailTemplate } from '../emails/beta-tester-list-for-resend';

console.log('\n📧 MAIA BETA RE-SIGNUP EMAILS');
console.log('Generated:', new Date().toLocaleString());
console.log('═'.repeat(80));

console.log(`\n📊 Summary:`);
console.log(`   Total beta testers: ${betaTesters.length}`);
console.log(`   Excluding: Kelly (already signed up successfully)`);
console.log(`   Emails to send: ${betaTesters.length}`);

console.log('\n📋 Recipient List:');
console.log('─'.repeat(80));
betaTesters.forEach((tester, index) => {
  console.log(`${(index + 1).toString().padStart(2, ' ')}. ${tester.name.padEnd(15)} ${tester.email.padEnd(35)} ${tester.code}`);
});

console.log('\n\n🎯 PERSONALIZED EMAILS BELOW:');
console.log('─'.repeat(80));
console.log('\nℹ️  Instructions:');
console.log('   1. Copy each email block below');
console.log('   2. Paste into your email client (Gmail, Outlook, etc.)');
console.log('   3. Send from your personal email for best deliverability');
console.log('   4. Consider staggering sends over 30-60 minutes');
console.log('   5. Track who re-signs up using: npx tsx scripts/check-all-beta-activity.ts');

betaTesters.forEach((tester, index) => {
  console.log('\n\n' + '═'.repeat(80));
  console.log(`EMAIL ${index + 1} of ${betaTesters.length}: ${tester.name.toUpperCase()}`);
  console.log('═'.repeat(80));
  console.log(`\n📧 To: ${tester.email}`);
  console.log('📋 Subject: Quick Fix: MAIA Beta Signup Glitch Resolved 🔧');
  console.log('\n' + '─'.repeat(80) + '\n');
  console.log(emailTemplate(tester.firstName, tester.code));
  console.log('\n' + '─'.repeat(80));
});

console.log('\n\n' + '═'.repeat(80));
console.log('✅ ALL EMAILS GENERATED!');
console.log('═'.repeat(80));

console.log(`\n📝 Post-Send Checklist:`);
console.log(`   ☐ ${betaTesters.length} emails sent`);
console.log(`   ☐ Track opens/responses over next 24-48 hours`);
console.log(`   ☐ Monitor re-signups: npx tsx scripts/check-all-beta-activity.ts`);
console.log(`   ☐ Follow up with non-responders after 48 hours`);
console.log(`   ☐ Test that new signups are working correctly`);

console.log(`\n💡 Pro Tips:`);
console.log(`   • Send early morning (8-10am) for best open rates`);
console.log(`   • Use BCC if sending batch, or send individually`);
console.log(`   • Reply promptly to any questions/concerns`);
console.log(`   • Keep BETA_SIGNUP_VERIFICATION.md updated with re-signup status\n`);
