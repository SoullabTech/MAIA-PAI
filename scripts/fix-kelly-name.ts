/**
 * Fix Kelly's Name in Soul Essence Database
 *
 * Update the soul essence record to use "Kelly" instead of "Explorer"
 * while preserving the 77-encounter relationship history
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixKellyName() {
  console.log('🔍 Searching for Kelly\'s soul essence records...\n');

  try {
    // Search for records that might be Kelly's
    // Check for Explorer, Seeker, kelly-nezat, or any userId that might be Kelly
    const { data: essences, error } = await supabase
      .from('relationship_essence')
      .select('*')
      .or('user_name.eq.Explorer,user_name.eq.Seeker,user_id.ilike.%kelly%,soul_signature.ilike.%kelly%');

    if (error) {
      console.error('❌ Error querying soul_essence:', error);
      return;
    }

    if (!essences || essences.length === 0) {
      console.log('⚠️  No matching records found. Trying broader search...');

      // Try getting all records to manually inspect
      const { data: allEssences, error: allError } = await supabase
        .from('relationship_essence')
        .select('*')
        .limit(20);

      if (allError) {
        console.error('❌ Error querying all essences:', allError);
        return;
      }

      console.log(`\n📋 Found ${allEssences?.length || 0} total essence records:`);
      allEssences?.forEach((essence: any) => {
        console.log(`   - user_id: ${essence.user_id}, user_name: ${essence.user_name || '(none)'}, encounters: ${essence.encounter_count || 0}`);
      });

      return;
    }

    console.log(`\n✅ Found ${essences.length} matching record(s):\n`);

    essences.forEach((essence: any) => {
      console.log(`📝 Record:`);
      console.log(`   soul_signature: ${essence.soul_signature}`);
      console.log(`   user_id: ${essence.user_id}`);
      console.log(`   user_name: ${essence.user_name || '(not set)'}`);
      console.log(`   encounter_count: ${essence.encounter_count || 0}`);
      console.log(`   presence_quality: ${essence.presence_quality || '(not set)'}`);
      console.log(`   created_at: ${essence.created_at}`);
      console.log(``);
    });

    // Find the record with 77 encounters (Kelly's main account)
    const kellyRecord = essences.find((e: any) =>
      (e.encounter_count === 77 || e.encounter_count >= 70) &&
      (e.user_name === 'Explorer' || e.user_name === 'Seeker')
    );

    if (kellyRecord) {
      console.log(`\n🎯 Found Kelly's main record with ${kellyRecord.encounter_count} encounters!`);
      console.log(`   Current name: "${kellyRecord.user_name}"`);
      console.log(`   Updating to: "Kelly"\n`);

      // Update the record
      const { data: updated, error: updateError } = await supabase
        .from('relationship_essence')
        .update({
          user_name: 'Kelly',
          last_encounter: new Date().toISOString()
        })
        .eq('soul_signature', kellyRecord.soul_signature)
        .select();

      if (updateError) {
        console.error('❌ Error updating record:', updateError);
        return;
      }

      console.log('✅ Successfully updated Kelly\'s name in soul essence!');
      console.log(`   Soul signature: ${kellyRecord.soul_signature}`);
      console.log(`   Encounter count: ${kellyRecord.encounter_count} (preserved)`);
      console.log(`   New name: Kelly`);
      console.log(`\n💫 MAIA will now recognize you as "Kelly" instead of "${kellyRecord.user_name}"`);

    } else {
      console.log('\n⚠️  Could not find the 77-encounter record. Please check manually.');
      console.log('   Run this script again or update the database directly.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixKellyName().then(() => {
  console.log('\n✨ Script complete');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
