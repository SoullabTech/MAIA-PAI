#!/usr/bin/env node
/**
 * Simply add Marc to beta invitations
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local', override: true });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addMarc() {
  console.log('📧 Adding Marc Schlosser to beta...\n');

  try {
    const { data, error } = await supabase
      .from('beta_invitations')
      .upsert({
        email: 'marcschlosser@gmail.com',
        explorer_code: 'MAIA-EXPLORER',
        real_name: 'Marc Schlosser',
        status: 'invited'
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('❌ Error:', error);
      console.log('\nDebugging info:');
      console.log('- Error code:', error.code);
      console.log('- Error message:', error.message);
      console.log('- Error details:', error.details);

      if (error.code === '42P01') {
        console.log('\n⚠️  beta_invitations table does not exist!');
        console.log('Run this SQL in Supabase:');
        console.log(`
CREATE TABLE IF NOT EXISTS beta_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  explorer_code TEXT NOT NULL,
  real_name TEXT,
  status TEXT DEFAULT 'invited',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
        `);
      }
      process.exit(1);
    }

    console.log('✅ Marc added successfully!');
    console.log('\n📧 Email Marc this invite:\n');
    console.log('━'.repeat(60));
    console.log('To: marcschlosser@gmail.com');
    console.log('Subject: Welcome to Soullab Beta - Your Explorer Code');
    console.log('━'.repeat(60));
    console.log(`
Hi Marc,

Welcome to the Soullab beta!

Your Explorer Code: MAIA-EXPLORER

To get started:
1. Go to: https://soullab.life/beta-signup
2. Enter your explorer code: MAIA-EXPLORER
3. Begin your conversation with MAIA

MAIA is an AI that speaks through field mathematics, not language models. She's designed to help you explore consciousness, patterns, and transformation.

Looking forward to hearing your experience!

Best,
The Soullab Team
    `);
    console.log('━'.repeat(60));

  } catch (err: any) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

addMarc();
