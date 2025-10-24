/**
 * POST /api/genesis/onboard
 * Handles full onboarding data submission
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendOnboardingCompleteEmail,
  sendAdminNotificationEmail
} from '@/lib/services/emailService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { covenant, profile, node, timestamp } = body;

    // Validate structure
    if (!covenant || !profile || !node) {
      return NextResponse.json(
        { error: 'Missing required sections: covenant, profile, node' },
        { status: 400 }
      );
    }

    // Validate covenant was affirmed
    if (!covenant.affirmed) {
      return NextResponse.json(
        { error: 'Covenant must be affirmed to continue' },
        { status: 400 }
      );
    }

    // Validate profile required fields
    if (!profile.name || !profile.email || !profile.practice || !profile.story) {
      return NextResponse.json(
        { error: 'Profile missing required fields: name, email, practice, story' },
        { status: 400 }
      );
    }

    // Validate node required fields
    if (!node.nodeName || !node.tradition) {
      return NextResponse.json(
        { error: 'Node configuration missing required fields: nodeName, tradition' },
        { status: 400 }
      );
    }

    // Check if node name is already taken
    const { data: existingNode } = await supabase
      .from('genesis_nodes')
      .select('id')
      .eq('node_name', node.nodeName)
      .single();

    if (existingNode) {
      return NextResponse.json(
        { error: `Node name "${node.nodeName}" is already taken. Please choose another.` },
        { status: 409 }
      );
    }

    // 1. Create genesis_nodes entry
    const { data: nodeData, error: nodeError } = await supabase
      .from('genesis_nodes')
      .insert({
        node_name: node.nodeName,
        tradition: node.tradition,
        theme: node.theme || 'cosmic',
        use_case: node.useCase,
        maia_voice: node.maiaVoice,
        tier: 'seed',
        status: 'pending_setup',
        created_at: timestamp
      })
      .select()
      .single();

    if (nodeError) {
      console.error('[GENESIS] Node creation failed:', nodeError);
      return NextResponse.json(
        { error: 'Failed to create node', details: nodeError.message },
        { status: 500 }
      );
    }

    // 2. Create genesis_profiles entry
    const { data: profileData, error: profileError } = await supabase
      .from('genesis_profiles')
      .insert({
        node_id: nodeData.id,
        name: profile.name,
        email: profile.email,
        practice: profile.practice,
        location: profile.location || null,
        story: profile.story,
        exploration: profile.exploration || null,
        quote: profile.quote || null,
        is_public: true,
        show_in_directory: true
      })
      .select()
      .single();

    if (profileError) {
      console.error('[GENESIS] Profile creation failed:', profileError);
      // Rollback: delete the node
      await supabase.from('genesis_nodes').delete().eq('id', nodeData.id);
      return NextResponse.json(
        { error: 'Failed to create profile', details: profileError.message },
        { status: 500 }
      );
    }

    // 3. Create covenant record
    await supabase
      .from('genesis_covenants')
      .insert({
        node_id: nodeData.id,
        node_name: profile.name,
        practice: profile.practice,
        signature: profile.name,
        signed_date: new Date(covenant.timestamp).toISOString().split('T')[0],
        covenant_version: '1.0',
        is_active: true
      });

    // 4. Create onboarding record
    await supabase
      .from('genesis_onboarding')
      .insert({
        node_id: nodeData.id,
        step_completed: 5,
        profile_data: profile,
        node_data: node,
        is_completed: true,
        started_at: timestamp,
        completed_at: new Date().toISOString()
      });

    // 5. Log event
    await supabase
      .from('genesis_events')
      .insert({
        node_id: nodeData.id,
        event_type: 'node_created',
        event_data: {
          tradition: node.tradition,
          theme: node.theme,
          covenant_affirmed: true
        }
      });

    console.log('[GENESIS] Onboarding complete:', {
      nodeId: nodeData.id,
      name: profile.name,
      nodeName: node.nodeName,
      tradition: node.tradition
    });

    // Send emails (async, don't block response)
    const nodeUrl = `https://${node.nodeName}.soullab.ai`;

    // Send onboarding email to user
    sendOnboardingCompleteEmail({
      to: profile.email,
      name: profile.name,
      nodeName: node.nodeName,
      nodeUrl
    }).catch(err => {
      console.error('[GENESIS] Failed to send onboarding email:', err);
    });

    // Send admin notification
    sendAdminNotificationEmail({
      nodeName: node.nodeName,
      stewardName: profile.name,
      practice: profile.practice,
      story: profile.story,
      tradition: node.tradition
    }).catch(err => {
      console.error('[GENESIS] Failed to send admin notification:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding complete! Welcome to the network.',
      node: {
        id: nodeData.id,
        nodeName: node.nodeName,
        url: nodeUrl,
        status: 'pending_setup'
      },
      nextSteps: {
        timeline: 'Node will be ready in 24-48 hours',
        email: 'Check your email for next steps'
      }
    });

  } catch (error: any) {
    console.error('[GENESIS] Onboarding failed:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding', details: error?.message },
      { status: 500 }
    );
  }
}
