#!/usr/bin/env tsx

/**
 * Send Whitey her Soullab access code
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { sendBetaInviteWithPasscode } from '../lib/email/sendBetaInviteWithPasscode';

async function main() {
  console.log('📧 Sending access code to Whitey...\n');

  const result = await sendBetaInviteWithPasscode(
    {
      name: 'Whitey',
      email: 'whiteysart.kathleen@gmail.com',
      passcode: 'SOULLAB-WHITEY'
    },
    'beta-passcode' // Use the passcode template
  );

  if (result.success) {
    console.log('\n✅ Access code email sent successfully!');
    console.log('Email ID:', result.id);
  } else {
    console.error('\n❌ Failed to send email');
    console.error('Error:', result.error);
    process.exit(1);
  }
}

main().catch(console.error);
