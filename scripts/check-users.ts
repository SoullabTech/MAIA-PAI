#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function checkUsers() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log('Checking users table...\n');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, sacred_name, beta_onboarded_at')
    .limit(10);

  if (usersError) {
    console.error('❌ Error querying users:', usersError);
  } else {
    console.log(`✅ Found ${users?.length || 0} users in 'users' table:`);
    console.log(JSON.stringify(users, null, 2));
  }

  console.log('\n\nChecking beta_users table...\n');
  const { data: betaUsers, error: betaError } = await supabase
    .from('beta_users')
    .select('*')
    .limit(10);

  if (betaError) {
    console.error('❌ Error querying beta_users:', betaError);
  } else {
    console.log(`✅ Found ${betaUsers?.length || 0} users in 'beta_users' table:`);
    console.log(JSON.stringify(betaUsers, null, 2));
  }
}

checkUsers().catch(console.error);
