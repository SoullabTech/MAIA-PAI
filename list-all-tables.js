#!/usr/bin/env node
/**
 * List all tables in Supabase database
 */

const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    console.log('🔍 Checking for tables in maia-consciousness database...\n');
    console.log('Database URL:', supabaseUrl, '\n');

    // Try to get a list of accessible tables by attempting to query common table names
    const commonTables = [
      'users',
      'profiles',
      'conversations',
      'messages',
      'memories',
      'sessions',
      'oracle_sessions',
      'readings',
      'rituals',
      'dreams',
      'journal_entries',
      'wisdom_insights',
      'akashic_records',
      'personal_oracle_data',
      'user_preferences'
    ];

    console.log('Checking for common table names:\n');
    const existingTables = [];

    for (const tableName of commonTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(0);

      if (!error) {
        // Table exists and is accessible
        const { count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        existingTables.push({ name: tableName, rowCount: count || 0 });
        console.log(`✅ ${tableName.padEnd(25)} - ${count || 0} rows`);
      }
    }

    if (existingTables.length === 0) {
      console.log('📭 No tables found with common names.');
      console.log('\n💡 To see all tables:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/_/editor');
      console.log('   2. Check the left sidebar for table list\n');
    } else {
      console.log(`\n✅ Found ${existingTables.length} accessible table(s)\n`);

      console.log('━'.repeat(60));
      console.log('Next steps:');
      console.log('1. Check the Spiralogic Oracle System database table editor');
      console.log('2. Export any important data');
      console.log('3. We can create migration scripts to copy data over');
      console.log('━'.repeat(60));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listTables();
