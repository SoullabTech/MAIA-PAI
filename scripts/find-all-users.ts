#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function findAllUsers() {
  console.log('🔍 Searching for ALL beta users in database...\n');

  const tableNames = [
    'explorers',
    'beta_users',
    'users',
    'beta_access',
    'beta_testers',
    'oracle_users',
    'maia_sessions',
    'user_sessions',
    'maia_messages',
    'beta_sessions',
    'oracle_sessions'
  ];

  for (const table of tableNames) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ ${table}: doesn't exist`);
    } else {
      console.log(`✅ ${table}: ${count || 0} records`);

      if (count && count > 0) {
        // Show sample data
        const { data } = await supabase.from(table).select('*').limit(3);
        console.log(`   Sample:`, data);
      }
    }
  }
}

findAllUsers();
