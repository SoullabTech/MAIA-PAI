/**
 * TENANT MANAGEMENT API
 * Admin endpoints for creating and managing tenant accounts
 *
 * Route: /api/admin/tenants
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/admin/tenants
 * List all tenants
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const { data: tenants, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      tenants
    });

  } catch (error) {
    console.error('❌ Error listing tenants:', error);
    return NextResponse.json(
      { error: 'Failed to list tenants' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tenants
 * Create a new tenant
 */
export async function POST(req: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const body = await req.json();
    const {
      name,
      slug,
      domain,
      brandVoice,
      elementalSignature,
      maiaPersonality,
      planTier = 'starter',
      features
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase, alphanumeric with hyphens)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must be lowercase alphanumeric with hyphens' },
        { status: 400 }
      );
    }

    console.log('🏢 Creating new tenant:', name, slug);

    // Set default limits based on plan
    const planLimits = {
      starter: {
        monthly_conversation_limit: 1000,
        storage_limit_gb: 10
      },
      professional: {
        monthly_conversation_limit: 10000,
        storage_limit_gb: 50
      },
      enterprise: {
        monthly_conversation_limit: 100000,
        storage_limit_gb: 500
      }
    };

    const limits = planLimits[planTier as keyof typeof planLimits] || planLimits.starter;

    // Create tenant
    const { data: tenant, error } = await supabase
      .from('tenants')
      .insert({
        name,
        slug,
        domain: domain || `${slug}.spiralogic.ai`,
        brand_voice: brandVoice || {
          tone: 'warm, present, wise',
          language: 'accessible and clear',
          values: []
        },
        elemental_signature: elementalSignature || {
          primary: 'aether'
        },
        maia_personality: maiaPersonality || {},
        plan_tier: planTier,
        features: features || {
          voice: true,
          journaling: true,
          collective_field: false
        },
        monthly_conversation_limit: limits.monthly_conversation_limit,
        storage_limit_gb: limits.storage_limit_gb,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Tenant with this slug already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

    console.log('✅ Tenant created:', tenant.id);

    return NextResponse.json({
      success: true,
      tenant
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating tenant:', error);
    return NextResponse.json(
      {
        error: 'Failed to create tenant',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
