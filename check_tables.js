// Quick script to check if tables exist in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('📡 Connecting to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking for relationship_essence table...');

  try {
    const { data, error } = await supabase
      .from('relationship_essence')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ relationship_essence table ERROR:', error.message);
    } else {
      console.log('✅ relationship_essence table EXISTS');
    }
  } catch (err) {
    console.log('❌ relationship_essence table check failed:', err.message);
  }

  console.log('\n🔍 Checking for maia_conversations table...');

  try {
    const { data, error } = await supabase
      .from('maia_conversations')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ maia_conversations table ERROR:', error.message);
    } else {
      console.log('✅ maia_conversations table EXISTS');
    }
  } catch (err) {
    console.log('❌ maia_conversations table check failed:', err.message);
  }
}

checkTables();
