/**
 * Send Monday Morning Platform Update Email to All Beta Testers
 *
 * Sends personalized email about:
 * - Persistent birth chart storage
 * - Cross-device sync
 * - Complete archetypal journey features
 * - Clear instructions and support
 */

import { sendBetaInviteWithPasscode, BetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';
import { readFileSync } from 'fs';
import { join } from 'path';

interface BetaUser {
  name: string;
  email: string;
  passcode: string;
}

async function sendMondayUpdate() {
  console.log('🌟 Sending Monday Platform Update to All Beta Testers\n');

  // Read all beta users
  const dataPath = join(process.cwd(), 'data', 'beta-users-complete.json');
  const rawData = readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(rawData);
  const users: BetaUser[] = data.users;

  // Add Jamie who was added separately
  users.push({
    name: 'Jamie',
    email: 'jcordero@sacredhearthamden.org',
    passcode: 'SOULLAB-JAMIE'
  });

  console.log(`Found ${users.length} beta testers\n`);
  console.log('Sending personalized platform update emails...\n');
  console.log('═'.repeat(80));

  const results: Array<{name: string; email: string; success: boolean; error?: string}> = [];
  let sent = 0;
  let failed = 0;

  // Send email to each tester
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const progress = `[${i + 1}/${users.length}]`;

    process.stdout.write(`${progress} ${user.name.padEnd(20)} ${user.email.padEnd(40)} `);

    try {
      await sendBetaInviteWithPasscode(
        {
          name: user.name,
          email: user.email,
          passcode: user.passcode
        },
        'monday-platform-update' // New template
      );

      console.log('✅ Sent');
      results.push({ name: user.name, email: user.email, success: true });
      sent++;

      // Delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

    } catch (error: any) {
      console.log(`❌ Failed: ${error.message}`);
      results.push({
        name: user.name,
        email: user.email,
        success: false,
        error: error.message
      });
      failed++;

      // Longer delay after error
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('═'.repeat(80));
  console.log('\n📊 Email Campaign Summary\n');
  console.log(`Total recipients:  ${users.length}`);
  console.log(`✅ Successfully sent: ${sent}`);
  console.log(`❌ Failed:         ${failed}`);
  console.log(`Success rate:      ${((sent / users.length) * 100).toFixed(1)}%`);

  if (sent > 0) {
    console.log('\n✨ Successfully emailed:\n');
    results
      .filter(r => r.success)
      .forEach(r => console.log(`  ✓ ${r.name} (${r.email})`));
  }

  if (failed > 0) {
    console.log('\n❌ Failed to email:\n');
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`  • ${r.name} (${r.email}): ${r.error}`));
  }

  console.log('\n🎊 Monday morning email campaign complete!\n');
  console.log('Next steps:');
  console.log('  • Monitor email open rates');
  console.log('  • Watch for support requests');
  console.log('  • Track platform logins');
  console.log('  • Check birth chart entries\n');

  return results;
}

// Safety check
if (!process.env.RESEND_API_KEY) {
  console.error('❌ Missing RESEND_API_KEY environment variable');
  console.error('Please set RESEND_API_KEY in .env.local\n');
  process.exit(1);
}

// Confirmation before sending
console.log('⚠️  This will send emails to ALL 42 beta testers!\n');
console.log('Press Ctrl+C now to cancel, or wait 5 seconds to proceed...\n');

setTimeout(() => {
  sendMondayUpdate()
    .then((results) => {
      const sent = results.filter(r => r.success).length;
      if (sent === results.length) {
        console.log('✅ All emails sent successfully!\n');
        process.exit(0);
      } else {
        console.log('⚠️  Some emails failed. Please review above.\n');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n❌ Email campaign failed:', error);
      process.exit(1);
    });
}, 5000); // 5 second delay before starting
