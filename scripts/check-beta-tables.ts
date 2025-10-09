#!/usr/bin/env node
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local', override: true });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTables() {
  console.log('🔍 Checking beta tables...\n');

  // Check beta_invitations
  const { data: invites, error: inviteError } = await supabase
    .from('beta_invitations')
    .select('*')
    .limit(1);

  console.log('beta_invitations:', inviteError ? `❌ ${inviteError.code} - ${inviteError.message}` : '✅ exists');

  // Check explorers
  const { data: explorers, error: exploreError } = await supabase
    .from('explorers')
    .select('*')
    .limit(1);

  console.log('explorers:', exploreError ? `❌ ${exploreError.code} - ${exploreError.message}` : '✅ exists');

  // Check beta_users
  const { data: betaUsers, error: betaError } = await supabase
    .from('beta_users')
    .select('*')
    .limit(1);

  console.log('beta_users:', betaError ? `❌ ${betaError.code} - ${betaError.message}` : '✅ exists');
}

checkTables();
