import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanMockUsers() {
  console.log('\n🧹 Cleaning mock users from database...\n');

  // Delete all "Test User" entries
  const { data: deletedUsers, error: deleteError } = await supabase
    .from('users')
    .delete()
    .or('name.eq.Test User,email.eq.testuser@example.com,email.eq.test@souloracle.io')
    .select();

  if (deleteError) {
    console.error('❌ Error deleting mock users:', deleteError);
  } else {
    console.log(`✅ Deleted ${deletedUsers?.length || 0} mock user entries`);
    deletedUsers?.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.name} (${u.email})`);
    });
  }

  // Verify cleanup
  const { data: remainingUsers, error: verifyError } = await supabase
    .from('users')
    .select('*');

  if (verifyError) {
    console.error('❌ Error verifying cleanup:', verifyError);
  } else {
    console.log(`\n📊 Remaining users: ${remainingUsers?.length || 0}`);
    remainingUsers?.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.name} (${u.email})`);
    });
  }

  console.log('\n✅ Cleanup complete!\n');
}

cleanMockUsers().catch(console.error);
