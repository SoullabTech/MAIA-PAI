/**
 * RESEARCH CONSENT API
 *
 * Manage user consent for research participation
 * GDPR/CCPA compliant consent tracking
 * User-controlled data sharing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getResearchDataExport, ResearchConsent } from '@/lib/consciousness/ResearchDataExport';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/research/consent
 * Get user's current research consent status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      );
    }

    // Get consent record
    const { data: consent, error } = await supabase
      .from('research_consents')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // Check if consent is active
    const isActive = consent &&
      !consent.withdrawn_at &&
      (!consent.expires_at || new Date(consent.expires_at) > new Date());

    return NextResponse.json({
      has_consent: !!consent,
      is_active: isActive,
      consent: consent ? {
        consented_at: consent.consented_at,
        expires_at: consent.expires_at,
        withdrawn_at: consent.withdrawn_at,
        consent_level: consent.consent_level,
        exclude_practices: consent.exclude_practices,
        can_withdraw: consent.can_withdraw,
        consent_version: consent.consent_version
      } : null
    });
  } catch (error: any) {
    console.error('Failed to fetch consent:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research/consent
 * Register user's consent for research participation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      consent_level = 'anonymizedIndividual',
      exclude_practices = [],
      expires_in_days = null,
      consent_version = '1.0'
    } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      );
    }

    // Validate consent level
    const validLevels = ['aggregateOnly', 'anonymizedIndividual', 'fullDataset'];
    if (!validLevels.includes(consent_level)) {
      return NextResponse.json(
        { error: `Invalid consent_level. Must be one of: ${validLevels.join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate expiration date
    let expiresAt = null;
    if (expires_in_days) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expires_in_days);
    }

    // Get client IP and user agent for audit
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');

    // Create consent record
    const { data: consent, error } = await supabase
      .from('research_consents')
      .upsert({
        user_id,
        consented_at: new Date().toISOString(),
        expires_at: expiresAt?.toISOString(),
        consent_level,
        can_withdraw: true,
        exclude_practices,
        consent_version,
        ip_address: clientIp,
        user_agent: userAgent
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Register with export service
    const exportService = getResearchDataExport();
    await exportService.registerConsent({
      userId: user_id,
      consentedAt: new Date(),
      expiresAt: expiresAt,
      level: consent_level,
      excludePractices: exclude_practices,
      canWithdraw: true
    });

    // Update qualia_states to mark as available for research
    await supabase
      .from('qualia_states')
      .update({ available_for_research: true })
      .eq('user_id', user_id)
      .not('context_practice', 'in', `(${exclude_practices.join(',')})`);

    return NextResponse.json({
      success: true,
      consent: {
        user_id,
        consented_at: consent.consented_at,
        expires_at: consent.expires_at,
        consent_level: consent.consent_level,
        can_withdraw: consent.can_withdraw
      },
      message: 'Research consent registered successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to register consent:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/research/consent
 * Withdraw research consent (right to be forgotten)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      );
    }

    // Check if consent exists and can be withdrawn
    const { data: existingConsent, error: fetchError } = await supabase
      .from('research_consents')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingConsent) {
      return NextResponse.json(
        { error: 'No consent record found' },
        { status: 404 }
      );
    }

    if (!existingConsent.can_withdraw) {
      return NextResponse.json(
        { error: 'Consent cannot be withdrawn (may be part of active study)' },
        { status: 403 }
      );
    }

    // Mark consent as withdrawn
    const { error: updateError } = await supabase
      .from('research_consents')
      .update({
        withdrawn_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    // Update qualia_states to remove from research availability
    await supabase
      .from('qualia_states')
      .update({ available_for_research: false })
      .eq('user_id', userId);

    // Withdraw in export service
    const exportService = getResearchDataExport();
    await exportService.withdrawConsent(userId);

    return NextResponse.json({
      success: true,
      message: 'Research consent withdrawn successfully. Your data will no longer be included in future research datasets.',
      note: 'Data already exported in existing datasets cannot be retroactively removed, but no new exports will include your data.'
    });
  } catch (error: any) {
    console.error('Failed to withdraw consent:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/research/consent
 * Update research consent preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, exclude_practices, consent_level } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      );
    }

    // Get existing consent
    const { data: existingConsent, error: fetchError } = await supabase
      .from('research_consents')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingConsent || existingConsent.withdrawn_at) {
      return NextResponse.json(
        { error: 'No active consent found' },
        { status: 404 }
      );
    }

    // Update consent
    const updates: any = {};
    if (exclude_practices !== undefined) {
      updates.exclude_practices = exclude_practices;
    }
    if (consent_level !== undefined) {
      updates.consent_level = consent_level;
    }

    const { data: updatedConsent, error: updateError } = await supabase
      .from('research_consents')
      .update(updates)
      .eq('user_id', user_id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Update qualia_states availability based on new exclusions
    if (exclude_practices !== undefined) {
      // Mark all as unavailable first
      await supabase
        .from('qualia_states')
        .update({ available_for_research: false })
        .eq('user_id', user_id)
        .in('context_practice', exclude_practices);

      // Mark non-excluded as available
      if (exclude_practices.length > 0) {
        await supabase
          .from('qualia_states')
          .update({ available_for_research: true })
          .eq('user_id', user_id)
          .not('context_practice', 'in', `(${exclude_practices.join(',')})`);
      } else {
        // No exclusions - all available
        await supabase
          .from('qualia_states')
          .update({ available_for_research: true })
          .eq('user_id', user_id);
      }
    }

    return NextResponse.json({
      success: true,
      consent: updatedConsent,
      message: 'Research consent preferences updated successfully'
    });
  } catch (error: any) {
    console.error('Failed to update consent:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
