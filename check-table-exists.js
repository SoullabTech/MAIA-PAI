#!/usr/bin/env node
/**
 * Check if memories table exists in database
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

async function checkTableExists() {
  try {
    console.log('🔍 Checking database schema...\n');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Using anon key:', supabaseKey.substring(0, 20) + '...\n');

    // Try to query pg_catalog to check if table exists
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT table_name, table_schema
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'memories';
      `
    });

    if (error) {
      console.log('⚠️  Cannot query information_schema directly (expected with anon key)');
      console.log('    Error:', error.message, '\n');

      console.log('💡 Alternative: Check Supabase Dashboard');
      console.log('   1. Go to: https://supabase.com/dashboard/project/_/editor');
      console.log('   2. Look for "memories" table in the left sidebar');
      console.log('   3. If it exists, the schema cache may need refreshing\n');

      console.log('💡 To refresh schema cache:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/_/settings/api');
      console.log('   2. Click "Reload schema cache" button\n');

      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Table "memories" exists in schema:', data[0].table_schema);
    } else {
      console.log('❌ Table "memories" not found in database');
      console.log('   The SQL may not have executed successfully');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableExists();
