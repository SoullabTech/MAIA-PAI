#!/usr/bin/env node
/**
 * Track when Marc (or any beta tester) completes signup
 * Run this periodically to check signup progress
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local', override: true });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function trackSignupProgress() {
  console.log('📊 Beta Tester Signup Progress\n');
  console.log('━'.repeat(80));

  // Get all invitations
  const { data: invitations, error } = await supabase
    .from('beta_invitations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching invitations:', error);
    return;
  }

  for (const invitation of invitations || []) {
    console.log(`\n👤 ${invitation.real_name || 'Unknown'} (${invitation.email})`);
    console.log(`   Code: ${invitation.explorer_code}`);
    console.log(`   Invited: ${new Date(invitation.created_at).toLocaleString()}`);

    // Check if they've registered in explorers table
    const { data: explorer } = await supabase
      .from('explorers')
      .select('*')
      .eq('email', invitation.email)
      .single();

    if (explorer) {
      console.log(`   ✅ REGISTERED: ${new Date(explorer.signup_date).toLocaleString()}`);
      console.log(`   📛 Explorer Name: ${explorer.explorer_name}`);

      // Check last activity
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('last_active')
        .eq('explorer_id', explorer.explorer_id)
        .order('last_active', { ascending: false })
        .limit(1);

      if (sessions && sessions.length > 0) {
        console.log(`   🕐 Last Active: ${new Date(sessions[0].last_active).toLocaleString()}`);
      } else {
        console.log(`   ⚠️  No session activity yet`);
      }
    } else {
      console.log(`   ⏳ NOT REGISTERED YET - Invitation pending`);

      // Calculate days since invitation
      const inviteDate = new Date(invitation.created_at);
      const now = new Date();
      const daysSince = Math.floor((now.getTime() - inviteDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSince > 3) {
        console.log(`   ⚠️  Invited ${daysSince} days ago - may need follow-up`);
      }
    }
  }

  console.log('\n' + '━'.repeat(80));

  // Summary stats
  const registered = invitations?.filter(async inv => {
    const { data } = await supabase
      .from('explorers')
      .select('explorer_id')
      .eq('email', inv.email)
      .single();
    return !!data;
  }) || [];

  console.log(`\n📈 Summary:`);
  console.log(`   Total Invitations: ${invitations?.length || 0}`);
  console.log(`   Pending Registration: Check individual statuses above`);
}

trackSignupProgress();
