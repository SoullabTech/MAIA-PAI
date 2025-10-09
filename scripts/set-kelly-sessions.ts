import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setKellySessions() {
  console.log('\n📊 Setting Kelly\'s session count...\n');

  const { data, error } = await supabase
    .from('explorers')
    .update({ session_count: 15 })
    .eq('email', 'kelly@soullab.org')
    .select();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Updated Kelly\'s session count to 15');
    console.log('   Engagement will show as:', Math.min(100, 15 * 10), '%');
  }

  console.log('\n✅ Done!\n');
}

setKellySessions().catch(console.error);
