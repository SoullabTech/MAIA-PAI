import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTables() {
  console.log('🔍 Checking for memory tables in Supabase...\n');

  // Check relational_memory table
  const { data: relData, error: relError } = await supabase
    .from('relational_memory')
    .select('*')
    .limit(1);

  console.log('📊 relational_memory table:', relError ? '❌ NOT FOUND' : '✅ EXISTS');
  if (relError) console.log('   Error:', relError.message);
  if (relData && relData.length > 0) {
    console.log('   Sample data:', relData[0]);
  }

  // Check memory_events table
  const { data: memData, error: memError } = await supabase
    .from('memory_events')
    .select('*')
    .limit(1);

  console.log('📊 memory_events table:', memError ? '❌ NOT FOUND' : '✅ EXISTS');
  if (memError) console.log('   Error:', memError.message);
  if (memData && memData.length > 0) {
    console.log('   Sample data:', memData[0]);
  }

  // Check explorers table (we know this exists)
  const { data: expData, error: expError } = await supabase
    .from('explorers')
    .select('explorer_id, explorer_name, email')
    .limit(5);

  console.log('\n👥 explorers table:', expError ? '❌ ERROR' : '✅ EXISTS');
  if (!expError && expData) {
    console.log(`   Found ${expData.length} explorers:`);
    expData.forEach(e => console.log(`   - ${e.explorer_name} (${e.explorer_id.substring(0, 8)}...)`));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY:');
  console.log('='.repeat(60));
  console.log('relational_memory:', relError ? '❌ MISSING' : '✅ READY');
  console.log('memory_events:', memError ? '❌ MISSING' : '✅ READY');
  console.log('explorers:', expError ? '❌ ERROR' : '✅ READY');

  if (relError || memError) {
    console.log('\n⚠️  Memory tables need to be created.');
    console.log('   Run: npx supabase db push');
  } else {
    console.log('\n✅ All memory tables exist! Ready to capture memories.');
  }
}

checkTables().catch(console.error);
