import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabaseSchema() {
  console.log('\n🔍 Verifying Database Schema...\n');

  const requiredTables = [
    'explorers',
    'beta_users',
    'oracle_agents',
    'user_preferences'
  ];

  const results: any = {};

  for (const table of requiredTables) {
    console.log(`\n📊 Checking table: ${table}`);

    // Try to select from the table to see if it exists
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ ERROR: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      results[table] = { exists: false, error: error.message };
    } else {
      console.log(`✅ Table exists`);

      // Get sample data to see schema
      const { data: sample } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (sample && sample.length > 0) {
        console.log(`   Sample columns:`, Object.keys(sample[0]).join(', '));
        results[table] = { exists: true, columns: Object.keys(sample[0]) };
      } else {
        console.log(`   No data in table yet`);
        results[table] = { exists: true, empty: true };
      }
    }
  }

  console.log('\n\n📋 SUMMARY:');
  console.log('='.repeat(50));

  for (const [table, info] of Object.entries(results)) {
    if ((info as any).exists) {
      console.log(`✅ ${table}: EXISTS`);
      if ((info as any).columns) {
        console.log(`   Columns: ${(info as any).columns.join(', ')}`);
      }
    } else {
      console.log(`❌ ${table}: MISSING - ${(info as any).error}`);
    }
  }

  console.log('\n');
}

verifyDatabaseSchema().catch(console.error);
