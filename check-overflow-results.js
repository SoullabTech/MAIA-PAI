require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function checkOverflow() {
  const { data } = await supabase
    .from('maia_messages')
    .select('*')
    .eq('user_id', 'overflow-test-user')
    .order('created_at', { ascending: true });

  console.log(`\n📊 Overflow Test Results:`);
  console.log(`   Total messages saved: ${data.length}`);
  console.log(`   Expected: 32 (15 user + 15 maia + 2 final exchange)`);

  if (data.length >= 30) {
    console.log(`   ✅ PASS - System handled 15+ exchanges`);
  } else {
    console.log(`   ⚠️  Only ${data.length} messages saved`);
  }

  console.log(`\n   First 3 messages:`);
  data.slice(0, 3).forEach(m => {
    console.log(`   - [${m.role}] ${m.content.substring(0, 50)}...`);
  });

  console.log(`\n   Last 3 messages:`);
  data.slice(-3).forEach(m => {
    console.log(`   - [${m.role}] ${m.content.substring(0, 50)}...`);
  });
}

checkOverflow().then(() => process.exit(0));
