import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeAllMockData() {
  console.log('\n🧹 Removing ALL mock data from database...\n');

  // Remove from users table
  console.log('Checking users table...');
  const { data: usersDeleted, error: usersError } = await supabase
    .from('users')
    .delete()
    .or('name.eq.Test User,email.eq.testuser@example.com,email.eq.test@souloracle.io')
    .select();

  if (usersError) {
    console.log('ℹ️  Users table error (might not exist):', usersError.message);
  } else {
    console.log(`✅ Deleted ${usersDeleted?.length || 0} mock entries from users table`);
  }

  // Remove from explorers table (should only keep Kelly)
  console.log('\nChecking explorers table...');
  const { data: explorersDeleted, error: explorersError } = await supabase
    .from('explorers')
    .delete()
    .neq('email', 'kelly@soullab.org')
    .select();

  if (explorersError) {
    console.log('❌ Error:', explorersError.message);
  } else {
    console.log(`ℹ️  Deleted ${explorersDeleted?.length || 0} non-Kelly entries from explorers table`);
    if (explorersDeleted && explorersDeleted.length > 0) {
      explorersDeleted.forEach((e: any) => {
        console.log(`     - ${e.explorer_name} (${e.email})`);
      });
    }
  }

  // Check what's left
  console.log('\n📊 Remaining data:');

  const { data: remainingExplorers } = await supabase
    .from('explorers')
    .select('*');

  console.log(`\nExplorers table: ${remainingExplorers?.length || 0} entries`);
  remainingExplorers?.forEach((e: any) => {
    console.log(`  - ${e.explorer_name} (${e.email})`);
  });

  const { data: remainingUsers } = await supabase
    .from('users')
    .select('*');

  if (remainingUsers) {
    console.log(`\nUsers table: ${remainingUsers.length} entries`);
    remainingUsers.forEach((u: any) => {
      console.log(`  - ${u.name} (${u.email})`);
    });
  }

  console.log('\n✅ Cleanup complete!\n');
}

removeAllMockData().catch(console.error);
