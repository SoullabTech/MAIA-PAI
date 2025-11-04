// Check tables using direct SQL query (bypasses schema cache)
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTablesDirectly() {
  console.log('📡 Checking tables with direct SQL query...\n');

  try {
    // Query information_schema to see all tables
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    });

    if (error) {
      console.log('⚠️  RPC not available, trying alternative method...');

      // Try selecting from pg_catalog
      const { data: altData, error: altError } = await supabase
        .from('pg_catalog.pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');

      if (altError) {
        console.log('❌ Alternative method failed:', altError.message);
        console.log('\n💡 Tables might exist but schema cache needs refresh.');
        console.log('   Try refreshing the Supabase project or waiting a few seconds.');
      } else {
        console.log('✅ Tables found:', altData);
      }
    } else {
      console.log('✅ Tables in database:', data);
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
    console.log('\n💡 The policy error suggests tables exist.');
    console.log('   The schema cache may just need to refresh (can take 30-60 seconds).');
  }
}

checkTablesDirectly();
