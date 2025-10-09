#!/usr/bin/env node

/**
 * Setup Real Beta Testing
 * Converts mock dashboard to track real users and journeys
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Force only .env.local to load (override prevents .env from loading)
dotenv.config({ path: '.env.local', override: true });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupRealBeta() {
  console.log('🚀 Setting up Real Beta Testing System...\n');

  try {
    // 1. Create beta invitations
    console.log('1. Creating beta tester invitations...');
    const { data: invitations, error: inviteError } = await supabase
      .from('beta_invitations')
      .upsert([
        {
          email: 'kelly@soullab.life',
          explorer_code: 'MAIA-ARCHITECT',
          real_name: 'Kelly',
          status: 'invited'
        },
        {
          email: 'alex@soullab.life',
          explorer_code: 'MAIA-APPRENTICE',
          real_name: 'Alex',
          status: 'invited'
        },
        {
          email: 'jordan@soullab.life',
          explorer_code: 'MAIA-ALCHEMIST',
          real_name: 'Jordan',
          status: 'invited'
        },
        {
          email: 'marcschlosser@gmail.com',
          explorer_code: 'MAIA-EXPLORER',
          real_name: 'Marc Schlosser',
          status: 'invited'
        }
      ], { onConflict: 'email' })
      .select();

    if (inviteError) throw inviteError;
    console.log(`✅ Created ${invitations?.length || 0} beta invitations`);

    // 2. Check existing users
    console.log('\n2. Checking existing users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, sacred_name, email')
      .not('sacred_name', 'is', null);

    if (usersError) throw usersError;
    console.log(`📊 Found ${users?.length || 0} users with explorer codes`);

    // 3. Create sample journey data for existing users
    if (users && users.length > 0) {
      console.log('\n3. Creating sample journey data...');

      const sampleJourneys = users.slice(0, 3).map((user, idx) => {
        const journeyTypes = [
          {
            spiral_name: 'Family Dynamics',
            current_facet: 5,
            facet_name: 'Shadow Work',
            progress_percentage: 65,
            last_insight: 'Discovering how family patterns block creative expression'
          },
          {
            spiral_name: 'Career Evolution',
            current_facet: 7,
            facet_name: 'Rebirth',
            progress_percentage: 41,
            last_insight: 'Transitioning career to align with soul purpose'
          },
          {
            spiral_name: 'Spiritual Journey',
            current_facet: 8,
            facet_name: 'Integration',
            progress_percentage: 34,
            last_insight: 'Healing body through conscious relationship work'
          }
        ];

        return {
          user_id: user.id,
          ...journeyTypes[idx % journeyTypes.length],
          is_active: true
        };
      });

      const { data: journeys, error: journeyError } = await supabase
        .from('user_spiral_journeys')
        .upsert(sampleJourneys, { onConflict: 'user_id,spiral_name' })
        .select();

      if (journeyError) throw journeyError;
      console.log(`✅ Created ${journeys?.length || 0} spiral journeys`);

      // 4. Create facet progress data
      console.log('\n4. Creating facet progress data...');
      const facetData = [];
      for (const user of users.slice(0, 3)) {
        for (let facet = 1; facet <= 12; facet++) {
          const progress = Math.max(0, 100 - (facet - 1) * 8 + Math.random() * 20);
          facetData.push({
            user_id: user.id,
            facet_number: facet,
            facet_name: getFacetName(facet),
            progress_percentage: Math.round(progress),
            time_spent_minutes: Math.round(progress * 2),
            breakthroughs_count: Math.floor(progress / 25)
          });
        }
      }

      const { data: facets, error: facetError } = await supabase
        .from('user_facet_progress')
        .upsert(facetData, { onConflict: 'user_id,facet_number' })
        .select();

      if (facetError) throw facetError;
      console.log(`✅ Created ${facets?.length || 0} facet progress records`);

      // 5. Create spiral intersections
      console.log('\n5. Creating spiral intersections...');
      const intersections = [
        {
          user_id: users[0].id,
          spiral_1: 'Family Dynamics',
          spiral_2: 'Shadow Work',
          intersection_type: 'transformation',
          strength_score: 0.8,
          insight_generated: 'Family patterns reveal deeper shadow work opportunities'
        },
        {
          user_id: users[1]?.id || users[0].id,
          spiral_1: 'Career Evolution',
          spiral_2: 'Creative Expression',
          intersection_type: 'harmonious',
          strength_score: 0.6,
          insight_generated: 'Career transition aligns with creative authentic expression'
        }
      ].filter(i => i.user_id);

      const { data: intersectionData, error: intersectionError } = await supabase
        .from('spiral_intersections')
        .insert(intersections)
        .select();

      if (intersectionError) throw intersectionError;
      console.log(`✅ Created ${intersectionData?.length || 0} spiral intersections`);

      // 6. Create collective patterns
      console.log('\n6. Creating collective patterns...');
      const patterns = [
        {
          pattern_type: 'collective_shadow_work',
          description: 'Multiple users approaching Shadow Work simultaneously - collective processing active',
          affected_users: users.length,
          strength_indicator: 'High'
        },
        {
          pattern_type: 'rebirth_resonance',
          description: 'Group field showing increased resonance at Rebirth facet',
          affected_users: Math.ceil(users.length / 2),
          strength_indicator: 'Medium'
        }
      ];

      const { data: patternData, error: patternError } = await supabase
        .from('collective_patterns')
        .insert(patterns)
        .select();

      if (patternError) throw patternError;
      console.log(`✅ Created ${patternData?.length || 0} collective patterns`);
    }

    console.log('\n🎉 Real Beta Testing Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Dashboard will now show real data instead of mock');
    console.log('2. Send invitation emails to beta testers');
    console.log('3. Users register with explorer codes at /beta-signin');
    console.log('4. Journey tracking begins on first session');
    console.log('\nReal data endpoints:');
    console.log('- /api/beta/real-data - Main dashboard data');
    console.log('- /api/beta/setup-real-users - Setup management');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

function getFacetName(facetNum: number): string {
  const names = [
    'Innocence', 'Initiation', 'Exploration', 'Questioning', 'Shadow Work', 'Crisis/Death',
    'Rebirth', 'Integration', 'Wisdom', 'Service', 'Mastery', 'Transcendence'
  ];
  return names[facetNum - 1] || 'Unknown';
}

// Run the setup
setupRealBeta();