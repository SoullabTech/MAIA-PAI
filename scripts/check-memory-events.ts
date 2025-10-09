import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkMemoryEvents() {
  console.log('🔍 Checking memory_events table...\n');

  // Check if table exists
  const { data, error } = await supabase
    .from('memory_events')
    .select('*')
    .limit(10);

  if (error) {
    console.error('❌ Error accessing memory_events:', error.message);
    return;
  }

  console.log(`✅ memory_events table exists`);
  console.log(`📊 Records found: ${data?.length || 0}\n`);

  if (data && data.length > 0) {
    console.log('Recent memories:');
    data.forEach((mem, idx) => {
      console.log(`\n${idx + 1}. ${mem.memory_type} (${mem.emotional_tone})`);
      console.log(`   User: ${mem.user_id?.substring(0, 20)}...`);
      console.log(`   Content: ${mem.content?.substring(0, 60)}...`);
      console.log(`   Significance: ${mem.significance_score}`);
      console.log(`   Created: ${new Date(mem.created_at).toLocaleString()}`);
    });
  } else {
    console.log('No memories found in database.');
    console.log('\nThis could mean:');
    console.log('1. No conversations have happened yet');
    console.log('2. Memory capture is not working');
    console.log('3. Database permissions issue');
  }
}

checkMemoryEvents().catch(console.error);
