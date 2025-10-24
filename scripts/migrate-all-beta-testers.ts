/**
 * Migrate All Beta Testers to Supabase Database
 *
 * This script adds all 42 beta testers from beta-users-complete.json
 * to the Supabase database so they can access the platform without getting stuck.
 *
 * Safely handles:
 * - Skips testers already in database
 * - Creates both explorers and beta_users records
 * - Provides detailed logging and summary
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface BetaUser {
  name: string;
  email: string;
  passcode: string;
}

interface MigrationResult {
  name: string;
  email: string;
  status: 'added' | 'exists' | 'error';
  explorerId?: string;
  error?: string;
}

async function addBetaTester(user: BetaUser): Promise<MigrationResult> {
  try {
    // Check if explorer already exists
    const { data: existingExplorer } = await supabase
      .from('explorers')
      .select('explorer_id, explorer_name, email')
      .eq('email', user.email)
      .maybeSingle();

    if (existingExplorer) {
      return {
        name: user.name,
        email: user.email,
        status: 'exists',
        explorerId: existingExplorer.explorer_id
      };
    }

    // Create new explorer
    const { data: newExplorer, error: explorerError } = await supabase
      .from('explorers')
      .insert({
        explorer_name: user.name,
        email: user.email,
        invitation_code: user.passcode,
        agreement_accepted: false,
        signup_date: new Date().toISOString(),
        status: 'active',
        week_number: 1,
        arc_level: 1,
        session_count: 0
      })
      .select()
      .single();

    if (explorerError) {
      return {
        name: user.name,
        email: user.email,
        status: 'error',
        error: explorerError.message
      };
    }

    // Also add to beta_users table
    const { error: betaUserError } = await supabase
      .from('beta_users')
      .insert({
        email: user.email,
        timezone: 'America/New_York', // Default
        privacy_mode: 'sanctuary',
        created_at: new Date().toISOString(),
        consent_date: new Date().toISOString(),
        evolution_level: 1.0,
        session_count: 0
      });

    // Don't fail if beta_users insert fails (might already exist)
    if (betaUserError && !betaUserError.message.includes('duplicate')) {
      console.warn(`  ⚠️  beta_users table warning for ${user.name}:`, betaUserError.message);
    }

    return {
      name: user.name,
      email: user.email,
      status: 'added',
      explorerId: newExplorer.explorer_id
    };

  } catch (error: any) {
    return {
      name: user.name,
      email: user.email,
      status: 'error',
      error: error.message
    };
  }
}

async function migrateAllTesters() {
  console.log('🌟 MAIA Beta Tester Migration\n');
  console.log('Reading beta testers from data file...\n');

  // Read beta users from JSON file
  const dataPath = join(process.cwd(), 'data', 'beta-users-complete.json');
  const rawData = readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(rawData);
  const users: BetaUser[] = data.users;

  console.log(`Found ${users.length} beta testers to migrate\n`);
  console.log('Starting migration...\n');
  console.log('═'.repeat(80));

  const results: MigrationResult[] = [];
  let added = 0;
  let existing = 0;
  let errors = 0;

  // Process each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const progress = `[${i + 1}/${users.length}]`;

    process.stdout.write(`${progress} ${user.name.padEnd(20)} ${user.email.padEnd(35)} `);

    const result = await addBetaTester(user);
    results.push(result);

    if (result.status === 'added') {
      console.log('✅ ADDED');
      added++;
    } else if (result.status === 'exists') {
      console.log('✓ Already exists');
      existing++;
    } else {
      console.log(`❌ ERROR: ${result.error}`);
      errors++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('═'.repeat(80));
  console.log('\n📊 Migration Summary\n');
  console.log(`Total testers:     ${users.length}`);
  console.log(`✅ Added:          ${added}`);
  console.log(`✓  Already existed: ${existing}`);
  console.log(`❌ Errors:         ${errors}`);

  if (added > 0) {
    console.log('\n🎉 Successfully added testers:\n');
    results
      .filter(r => r.status === 'added')
      .forEach(r => {
        console.log(`  • ${r.name} (${r.email})`);
        console.log(`    Explorer ID: ${r.explorerId}`);
      });
  }

  if (existing > 0) {
    console.log('\n✓ Testers already in database:\n');
    results
      .filter(r => r.status === 'exists')
      .forEach(r => {
        console.log(`  • ${r.name} (${r.email})`);
      });
  }

  if (errors > 0) {
    console.log('\n❌ Errors encountered:\n');
    results
      .filter(r => r.status === 'error')
      .forEach(r => {
        console.log(`  • ${r.name} (${r.email})`);
        console.log(`    Error: ${r.error}`);
      });
  }

  console.log('\n✨ Migration complete!\n');
  console.log('All beta testers can now:');
  console.log('  • Log in with their SOULLAB passcodes');
  console.log('  • Save birth chart data permanently');
  console.log('  • Access the platform from any device');
  console.log('  • Never get stuck after updates!\n');

  return results;
}

// Check for required env vars
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
  process.exit(1);
}

// Run migration
migrateAllTesters()
  .then((results) => {
    const added = results.filter(r => r.status === 'added').length;
    const errors = results.filter(r => r.status === 'error').length;

    if (errors > 0) {
      console.log('⚠️  Some errors occurred. Please review above.\n');
      process.exit(1);
    } else if (added === 0) {
      console.log('ℹ️  All testers were already in the database. No action needed.\n');
      process.exit(0);
    } else {
      console.log('🎊 All done! Beta testers are ready to explore!\n');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  });
