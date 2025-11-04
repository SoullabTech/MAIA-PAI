// Force Supabase schema cache refresh
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function refreshSchema() {
  console.log('🔄 Refreshing Supabase schema cache...\n');

  try {
    // Method 1: Try to insert a test row to force schema detection
    const testEssence = {
      user_id: 'test_refresh',
      soul_signature: 'test_' + Date.now(),
      presence_quality: 'Testing schema refresh',
      archetypal_resonances: [],
      spiral_position: { stage: null, dynamics: 'testing', emergingAwareness: [] },
      relationship_field: { coCreatedInsights: [], breakthroughs: [], quality: 'test', depth: 0.5 },
      first_encounter: new Date().toISOString(),
      last_encounter: new Date().toISOString(),
      encounter_count: 1,
      morphic_resonance: 0.1
    };

    const { data: insertData, error: insertError } = await supabase
      .from('relationship_essence')
      .insert([testEssence])
      .select();

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
      console.log('   This might mean schema cache is still stale.\n');
    } else {
      console.log('✅ Test row inserted successfully!');
      console.log('   Schema cache is now active.\n');

      // Clean up test row
      const { error: deleteError } = await supabase
        .from('relationship_essence')
        .delete()
        .eq('user_id', 'test_refresh');

      if (!deleteError) {
        console.log('🧹 Test row cleaned up.\n');
      }
    }

    // Now test a simple select
    console.log('🔍 Testing table access...\n');

    const { data: selectData, error: selectError } = await supabase
      .from('relationship_essence')
      .select('count')
      .limit(1);

    if (selectError) {
      console.log('❌ Select still failing:', selectError.message);
      console.log('   Wait 30 seconds and try again.\n');
    } else {
      console.log('✅ relationship_essence table is accessible!');
    }

    const { data: convData, error: convError } = await supabase
      .from('maia_conversations')
      .select('count')
      .limit(1);

    if (convError) {
      console.log('❌ maia_conversations access failed:', convError.message);
    } else {
      console.log('✅ maia_conversations table is accessible!\n');
    }

    console.log('✨ Schema refresh complete!\n');

  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

refreshSchema();
