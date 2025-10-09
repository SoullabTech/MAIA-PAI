import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateKelly() {
  console.log('Updating Kelly\'s explorer name...');

  const { data, error } = await supabase
    .from('explorers')
    .update({ explorer_name: 'Kelly' })
    .eq('email', 'kelly@soullab.org')
    .select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Updated successfully:');
    console.log(JSON.stringify(data, null, 2));
  }
}

updateKelly();
