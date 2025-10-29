/**
 * RESEARCH DATASETS API
 *
 * Endpoints for consciousness researchers to create and access datasets
 * QRI-specific Symmetry Theory of Valence validation
 * Privacy-preserving data export
 *
 * Authentication: Requires researcher role
 * Rate limiting: Applied per organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getResearchDataExport,
  AnonymizationLevel,
  DatasetFilters,
  ExportFormat
} from '@/lib/consciousness/ResearchDataExport';
import type { QualiaState } from '@/lib/consciousness/QualiaMeasurementEngine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/research/datasets
 * List all datasets accessible to researcher
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const researcherId = searchParams.get('researcher_id');

    if (!researcherId) {
      return NextResponse.json(
        { error: 'researcher_id required' },
        { status: 400 }
      );
    }

    // Verify researcher authentication
    const isAuthorized = await verifyResearcher(researcherId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get datasets for researcher
    const { data: datasets, error } = await supabase
      .from('research_datasets')
      .select('*')
      .contains('researcher_ids', [researcherId])
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      datasets: datasets || [],
      count: datasets?.length || 0
    });
  } catch (error: any) {
    console.error('Failed to fetch datasets:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research/datasets
 * Create new research dataset with anonymization
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      researcher_id,
      organization,
      filters,
      anonymization_level = 'standard',
      require_consent = true,
      minimum_cohort_size = 5
    } = body;

    // Validate required fields
    if (!name || !researcher_id) {
      return NextResponse.json(
        { error: 'name and researcher_id required' },
        { status: 400 }
      );
    }

    // Verify researcher
    const isAuthorized = await verifyResearcher(researcher_id);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Fetch qualia states from database
    const qualiaStates = await fetchQualiaStates(filters);

    if (qualiaStates.length === 0) {
      return NextResponse.json(
        { error: 'No qualia states match filters' },
        { status: 404 }
      );
    }

    // Create dataset using ResearchDataExport
    const exportService = getResearchDataExport();
    const { dataset, metadata, privacyReport } = await exportService.createDataset(
      qualiaStates,
      filters as DatasetFilters,
      anonymization_level as AnonymizationLevel,
      {
        name,
        description,
        researcherId: researcher_id,
        requireConsent: require_consent,
        minimumCohortSize: minimum_cohort_size
      }
    );

    // Store dataset metadata in database
    const { data: storedMetadata, error: dbError } = await supabase
      .from('research_datasets')
      .insert({
        id: metadata.id,
        name: metadata.name,
        description: metadata.description,
        researcher_ids: metadata.researcherIds,
        organization: organization || null,
        anonymization_level: metadata.anonymizationLevel,
        consent_required: metadata.consentRequired,
        minimum_cohort_size: metadata.minimumCohortSize,
        total_participants: metadata.stats.totalParticipants,
        total_sessions: metadata.stats.totalSessions,
        date_range_start: metadata.stats.dateRange.start,
        date_range_end: metadata.stats.dateRange.end,
        practice_types: metadata.stats.practiceTypes,
        avg_symmetry: metadata.stats.avgSymmetry,
        avg_valence: metadata.stats.avgValence,
        filters: metadata.filters as any,
        k_anonymity: privacyReport.kAnonymity,
        reidentification_risk: privacyReport.reidentificationRisk,
        privacy_guarantees: privacyReport.privacyGuarantees
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      dataset_id: metadata.id,
      metadata: storedMetadata,
      privacy_report: privacyReport,
      preview: dataset.slice(0, 5) // First 5 records as preview
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create dataset:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Helper: Verify researcher authentication
 */
async function verifyResearcher(researcherId: string): Promise<boolean> {
  // In production, verify JWT token and check researcher role
  // For now, check if user exists and has researcher flag
  const { data: user, error } = await supabase
    .from('profiles')
    .select('is_researcher, researcher_organization')
    .eq('id', researcherId)
    .single();

  if (error || !user) {
    return false;
  }

  return user.is_researcher === true;
}

/**
 * Helper: Fetch qualia states with filters
 */
async function fetchQualiaStates(filters: any): Promise<QualiaState[]> {
  let query = supabase
    .from('qualia_states')
    .select('*')
    .eq('available_for_research', true);

  // Apply filters
  if (filters?.dateRange) {
    query = query
      .gte('timestamp', filters.dateRange.start)
      .lte('timestamp', filters.dateRange.end);
  }

  if (filters?.practiceTypes && filters.practiceTypes.length > 0) {
    query = query.in('context_practice', filters.practiceTypes);
  }

  if (filters?.minSymmetry !== undefined) {
    query = query.gte('symmetry_global', filters.minSymmetry);
  }

  if (filters?.maxSymmetry !== undefined) {
    query = query.lte('symmetry_global', filters.maxSymmetry);
  }

  if (filters?.minValence !== undefined) {
    query = query.gte('valence_value', filters.minValence);
  }

  if (filters?.maxValence !== undefined) {
    query = query.lte('valence_value', filters.maxValence);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Convert database rows to QualiaState objects
  return (data || []).map(row => convertRowToQualiaState(row));
}

/**
 * Helper: Convert database row to QualiaState
 */
function convertRowToQualiaState(row: any): QualiaState {
  return {
    timestamp: new Date(row.timestamp),
    duration: row.duration,
    dimensions: {
      clarity: row.dimension_clarity,
      energy: row.dimension_energy,
      connection: row.dimension_connection,
      expansion: row.dimension_expansion,
      presence: row.dimension_presence,
      flow: row.dimension_flow
    },
    valence: {
      value: row.valence_value,
      intensity: row.valence_intensity,
      symmetry: row.valence_symmetry
    },
    symmetry: {
      global: row.symmetry_global,
      local: row.symmetry_local || [],
      harmonics: row.symmetry_harmonics || [],
      fractality: row.symmetry_fractality || 0,
      coherence: row.symmetry_coherence || 0
    },
    texture: {
      sensory: row.texture_sensory || [],
      emotional: row.texture_emotional || [],
      cognitive: row.texture_cognitive || [],
      somatic: row.texture_somatic || []
    },
    description: row.description || '',
    insights: row.insights || [],
    symbols: row.symbols || [],
    context: {
      practice: row.context_practice,
      duration: row.duration,
      intention: row.context_intention || '',
      setting: row.context_setting,
      substances: row.context_substances || [],
      facilitator: row.context_facilitator,
      userId: row.user_id
    },
    ainSophMapping: {
      elements: {
        earth: row.element_earth || 0,
        water: row.element_water || 0,
        air: row.element_air || 0,
        fire: row.element_fire || 0
      },
      currentPhase: row.alchemical_phase || 'nigredo',
      activatedSefirot: row.activated_sefirot || []
    }
  };
}
