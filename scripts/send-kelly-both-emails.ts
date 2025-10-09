/**
 * Send passcode to Kelly at both email addresses
 * Run with: npx tsx scripts/send-kelly-both-emails.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { sendBetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';

async function sendToKellyBothEmails() {
  console.log('🚀 Sending passcode to Kelly at both emails...\n');

  // Check for environment variable
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in environment variables');
    console.log('💡 Add RESEND_API_KEY=your_key to .env.local file');
    process.exit(1);
  }

  const kellyEmails = [
    {
      name: "Kelly",
      email: "soullab1@gmail.com",
      passcode: "SOULLAB-KELLY"
    },
    {
      name: "Kelly",
      email: "kelly@soullab.org",
      passcode: "SOULLAB-KELLY"
    }
  ];

  for (const kelly of kellyEmails) {
    try {
      console.log(`📧 Sending to ${kelly.email}...`);
      const result = await sendBetaInviteWithPasscode(kelly, 'beta-passcode');

      if (result.success) {
        console.log(`✅ Successfully sent to ${kelly.email}!`);
      } else {
        console.log(`❌ Failed to send to ${kelly.email}:`, result.error);
      }

      // Wait 2 seconds between emails
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`💥 Error sending to ${kelly.email}:`, error);
    }
  }

  console.log('\n🎉 Done! Check both inboxes:');
  console.log('📧 soullab1@gmail.com');
  console.log('📧 kelly@soullab.org');
  console.log('🔑 Your passcode: SOULLAB-KELLY');
}

// Run it
sendToKellyBothEmails();