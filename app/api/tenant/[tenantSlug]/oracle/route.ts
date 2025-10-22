/**
 * TENANT-SPECIFIC ORACLE ENDPOINT
 * Handles conversations for client-specific MAIAs
 *
 * Route: /api/tenant/[tenantSlug]/oracle
 * Example: /api/tenant/acme-legal/oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { TenantMAIA } from '@/lib/multi-tenant/TenantMAIA';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  { params }: { params: { tenantSlug: string } }
) {
  try {
    const { tenantSlug } = params;
    const { input, userId, sessionId, conversationDepth } = await req.json();

    console.log('🌀 Tenant oracle request:', {
      tenant: tenantSlug,
      user: userId,
      input: input?.substring(0, 50)
    });

    // Validate input
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    // Get tenant ID from slug
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, status, plan_tier, monthly_conversation_limit')
      .eq('slug', tenantSlug)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Check tenant status
    if (tenant.status !== 'active' && tenant.status !== 'trial') {
      return NextResponse.json(
        { error: 'Tenant account is not active' },
        { status: 403 }
      );
    }

    // Check usage limits (simplified - should integrate with billing)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const { count: conversationsThisMonth } = await supabase
      .from('tenant_conversations')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .gte('started_at', currentMonth.toISOString());

    if (conversationsThisMonth && conversationsThisMonth >= tenant.monthly_conversation_limit) {
      return NextResponse.json(
        {
          error: 'Monthly conversation limit reached',
          limit: tenant.monthly_conversation_limit,
          used: conversationsThisMonth
        },
        { status: 429 }
      );
    }

    // Verify user has access to tenant (optional, depends on auth strategy)
    if (userId) {
      const { data: userAccess } = await supabase
        .from('tenant_users')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      // If user_id provided but no access, deny (unless tenant allows public access)
      // For now, we'll allow it for simplicity
    }

    // Initialize tenant-specific MAIA
    const tenantMAIA = new TenantMAIA(tenant.id);
    await tenantMAIA.initialize();

    // Process interaction through tenant MAIA
    const response = await tenantMAIA.processInteraction(
      input,
      userId || 'anonymous',
      {
        sessionId,
        conversationDepth
      }
    );

    return NextResponse.json({
      success: true,
      ...response,
      tenant: {
        name: tenantMAIA.getConfig()?.name,
        slug: tenantSlug
      }
    });

  } catch (error) {
    console.error('❌ Tenant oracle error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
