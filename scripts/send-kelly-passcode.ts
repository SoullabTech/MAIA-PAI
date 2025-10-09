/**
 * Send passcode to Kelly
 * Run with: npx tsx scripts/send-kelly-passcode.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { sendBetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';

async function sendToKelly() {
  console.log('🚀 Sending passcode to Kelly...\n');

  // Check for environment variable
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in environment variables');
    console.log('💡 Add RESEND_API_KEY=your_key to .env.local file');
    process.exit(1);
  }

  const kelly = {
    name: "Kelly",
    email: "soullab1@gmail.com",
    passcode: "SOULLAB-KELLY"
  };

  try {
    const result = await sendBetaInviteWithPasscode(kelly, 'beta-passcode');

    if (result.success) {
      console.log('✅ Successfully sent passcode email to Kelly!');
      console.log(`📧 Email: ${kelly.email}`);
      console.log(`🔑 Passcode: ${kelly.passcode}`);
    } else {
      console.log('❌ Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Run it
sendToKelly();