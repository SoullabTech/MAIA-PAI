require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function checkMemory() {
  console.log('🔍 Checking memory for test-final-user...\n');

  const { data, error } = await supabase
    .from('maia_messages')
    .select('*')
    .eq('user_id', 'test-final-user')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Found ${data.length} messages:\n`);
  data.forEach((msg, i) => {
    console.log(`${i + 1}. [${msg.role}] ${msg.content.substring(0, 80)}...`);
    console.log(`   Created: ${msg.created_at}`);
    console.log('');
  });
}

checkMemory().then(() => process.exit(0));
