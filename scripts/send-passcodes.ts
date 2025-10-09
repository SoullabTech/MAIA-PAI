/**
 * Script to send passcodes to all beta users
 * Run with: npx tsx scripts/send-passcodes.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { sendBatchInvitesWithPasscodes } from '../lib/email/sendBetaInviteWithPasscode';
import betaUsers from '../data/beta-users-complete.json';

async function sendPasscodes() {
  console.log('🚀 Starting passcode email send...\n');
  console.log(`📊 Total users: ${betaUsers.users.length}\n`);

  // Check for environment variable
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in environment variables');
    console.log('💡 Add RESEND_API_KEY=your_key to .env.local file');
    process.exit(1);
  }

  // Send in batches to avoid rate limits
  const batchSize = 10;
  const batches = [];

  for (let i = 0; i < betaUsers.users.length; i += batchSize) {
    batches.push(betaUsers.users.slice(i, i + batchSize));
  }

  console.log(`📦 Sending in ${batches.length} batches of ${batchSize} emails\n`);

  let totalSent = 0;
  let totalFailed = 0;

  for (let i = 0; i < batches.length; i++) {
    console.log(`\n📬 Sending batch ${i + 1}/${batches.length}...`);

    const result = await sendBatchInvitesWithPasscodes(
      batches[i],
      'beta-passcode',  // Use the passcode template
      2000  // 2 second delay between emails
    );

    totalSent += result.successful;
    totalFailed += result.failed;

    // Show results for this batch
    if (result.failed > 0) {
      console.log(`⚠️  Batch ${i + 1} had failures:`);
      result.results
        .filter(r => !r.success)
        .forEach(r => console.log(`   ❌ ${r.name} (${r.email}): ${r.error}`));
    }

    // Wait 5 seconds between batches to avoid rate limits
    if (i < batches.length - 1) {
      console.log(`⏳ Waiting 5 seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successfully sent: ${totalSent}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📧 Total attempted: ${betaUsers.users.length}`);
  console.log('='.repeat(50) + '\n');

  if (totalSent === betaUsers.users.length) {
    console.log('🎉 All passcodes sent successfully!');
    console.log('🚀 Your beta users are ready for Monday launch!');
  } else if (totalFailed > 0) {
    console.log('⚠️  Some emails failed. Check the errors above and retry if needed.');
  }
}

// Run the script
sendPasscodes().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});