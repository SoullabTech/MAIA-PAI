#!/usr/bin/env node

// Check explorers table actual schema
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://jkbetmadzcpoinjogkli.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprYmV0bWFkemNwb2luam9na2xpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU2MjI0NSwiZXhwIjoyMDU4MTM4MjQ1fQ.QNvP9jEiSSfs_2-aFmtDt1xEMY_vwpU_ZT-CYRlgS98";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🔍 Checking explorers table schema...\n');

  // Query the information schema to get column details
  const { data, error } = await supabase
    .from('explorers')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error querying table:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ Table exists! Sample row columns:');
    console.log(Object.keys(data[0]).join(', '));
    console.log('\n📊 Sample row:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('⚠️  Table is empty');
  }

  // Try to describe the table
  console.log('\n🔍 Checking if increment_monthly_conversations function exists...');
  const { data: functions, error: funcError } = await supabase.rpc('increment_monthly_conversations', {
    user_id: '00000000-0000-0000-0000-000000000000' // Valid UUID format
  });

  if (funcError) {
    console.log('❌ Function doesn\'t exist or has wrong signature:');
    console.log('   ', funcError.message);
  } else {
    console.log('✅ Function exists!');
  }
}

main().catch(console.error);
