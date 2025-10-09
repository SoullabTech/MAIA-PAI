#!/usr/bin/env node
/**
 * Mark all existing beta users as onboarded
 * This prevents them from having to re-signup
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local', override: true });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function markAllOnboarded() {
  console.log('🔧 Marking all existing users as onboarded...\n');

  try {
    // Update explorers table - set onboarded flag
    const { data: explorers, error: explorerError } = await supabase
      .from('explorers')
      .select('explorer_id, explorer_name, email');

    if (explorerError) throw explorerError;

    console.log(`Found ${explorers?.length || 0} explorers`);

    if (explorers && explorers.length > 0) {
      for (const explorer of explorers) {
        console.log(`  Setting ${explorer.explorer_name} as onboarded...`);

        // Update explorer with onboarded flag
        const { error: updateError } = await supabase
          .from('explorers')
          .update({
            beta_onboarded: true,
            updated_at: new Date().toISOString()
          })
          .eq('explorer_id', explorer.explorer_id);

        if (updateError) {
          console.error(`    ❌ Failed for ${explorer.explorer_name}:`, updateError.message);
        } else {
          console.log(`    ✅ ${explorer.explorer_name} marked as onboarded`);
        }
      }
    }

    // Also update beta_users table if it exists
    const { data: betaUsers, error: betaError } = await supabase
      .from('beta_users')
      .select('*');

    if (!betaError && betaUsers && betaUsers.length > 0) {
      console.log(`\nFound ${betaUsers.length} beta users`);

      const { error: updateBetaError } = await supabase
        .from('beta_users')
        .update({ onboarded: true })
        .neq('email', '');

      if (updateBetaError) {
        console.error('❌ Failed to update beta_users:', updateBetaError.message);
      } else {
        console.log('✅ All beta_users marked as onboarded');
      }
    }

    console.log('\n✅ Done! All users are now marked as onboarded.');
    console.log('\n📋 Users can now:');
    console.log('   - Go directly to soullab.life');
    console.log('   - Access /maya without re-signup');
    console.log('   - Their localStorage will be checked and they\'ll be let through');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

markAllOnboarded();
