import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addLastActiveColumn() {
  console.log('\n📝 Adding last_active column to explorers table...\n');

  // Try to add the column (will fail if it already exists, which is fine)
  const { error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE explorers ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE;`
  });

  if (error) {
    console.log('ℹ️  Note:', error.message);
    console.log('    (This might mean the column already exists or RPC is not enabled)');
    console.log('    Attempting direct update instead...');

    // Set Kelly's last_active to now as a test
    const { error: updateError } = await supabase
      .from('explorers')
      .update({ last_active: new Date().toISOString() })
      .eq('email', 'kelly@soullab.org');

    if (updateError) {
      console.error('❌ Update failed:', updateError.message);
    } else {
      console.log('✅ Successfully updated last_active for Kelly');
    }
  } else {
    console.log('✅ Column added successfully');
  }

  console.log('\n✅ Done!\n');
}

addLastActiveColumn().catch(console.error);
