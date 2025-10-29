/**
 * RESEARCH STATISTICS API
 *
 * Aggregate statistics for consciousness research
 * Privacy-safe (minimum sample sizes enforced)
 * QRI Symmetry Theory of Valence validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getResearchDataExport } from '@/lib/consciousness/ResearchDataExport';
import type { QualiaState } from '@/lib/consciousness/QualiaMeasurementEngine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/research/statistics
 * Get aggregate statistics across qualia data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const filters: any = {};

    if (searchParams.get('practice')) {
      filters.practiceTypes = [searchParams.get('practice')!];
    }

    if (searchParams.get('start_date')) {
      filters.dateRange = {
        start: new Date(searchParams.get('start_date')!),
        end: searchParams.get('end_date')
          ? new Date(searchParams.get('end_date')!)
          : new Date()
      };
    }

    if (searchParams.get('min_symmetry')) {
      filters.minSymmetry = parseFloat(searchParams.get('min_symmetry')!);
    }

    if (searchParams.get('max_symmetry')) {
      filters.maxSymmetry = parseFloat(searchParams.get('max_symmetry')!);
    }

    // Fetch qualia states
    const qualiaStates = await fetchQualiaStates(filters);

    // Enforce minimum sample size for privacy
    if (qualiaStates.length < 10) {
      return NextResponse.json(
        {
          error: 'Insufficient data',
          message: 'Minimum 10 samples required for aggregate statistics',
          sample_size: qualiaStates.length
        },
        { status: 400 }
      );
    }

    // Calculate aggregate stats
    const exportService = getResearchDataExport();
    const stats = await exportService.getAggregateStats(qualiaStates, filters);

    return NextResponse.json({
      success: true,
      statistics: stats,
      privacy_compliant: true,
      minimum_sample_size: 10
    });
  } catch (error: any) {
    console.error('Failed to calculate statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research/statistics/stv-validation
 * Validate QRI's Symmetry Theory of Valence
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, confidence_level = 0.95, include_distributions = false } = body;

    // Fetch qualia states
    const qualiaStates = await fetchQualiaStates(filters || {});

    // Enforce minimum sample size
    if (qualiaStates.length < 30) {
      return NextResponse.json(
        {
          error: 'Insufficient data for STV validation',
          message: 'Minimum 30 samples required for statistical validation',
          sample_size: qualiaStates.length
        },
        { status: 400 }
      );
    }

    // Run STV validation
    const exportService = getResearchDataExport();
    const validation = await exportService.validateSTV(qualiaStates, {
      confidenceLevel: confidence_level,
      includeDistributions: include_distributions
    });

    return NextResponse.json({
      success: true,
      validation,
      hypothesis: 'Symmetry Theory of Valence: Hedonic tone is determined by symmetry of consciousness states',
      interpretation: interpretSTVResults(validation)
    });
  } catch (error: any) {
    console.error('Failed to validate STV:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
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
      .gte('timestamp', filters.dateRange.start.toISOString())
      .lte('timestamp', filters.dateRange.end.toISOString());
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

/**
 * Helper: Interpret STV validation results
 */
function interpretSTVResults(validation: any): {
  support: 'strong' | 'moderate' | 'weak' | 'none';
  explanation: string;
  implications: string[];
} {
  const { correlation, pValue, sampleSize } = validation;

  if (pValue > 0.05) {
    return {
      support: 'none',
      explanation: 'No statistically significant correlation found between symmetry and valence.',
      implications: [
        'STV hypothesis not supported by this dataset',
        'Consider larger sample size or different population',
        'May indicate measurement limitations'
      ]
    };
  }

  if (correlation > 0.5) {
    return {
      support: 'strong',
      explanation: `Strong positive correlation (R² = ${correlation.toFixed(3)}) between symmetry and valence. STV hypothesis strongly supported.`,
      implications: [
        'Hedonic tone appears to be strongly determined by consciousness symmetry',
        'Results align with QRI\'s Symmetry Theory of Valence',
        'Measurement tools successfully capture STV predictions',
        `Sample size (n=${sampleSize}) provides robust evidence`
      ]
    };
  }

  if (correlation > 0.3) {
    return {
      support: 'moderate',
      explanation: `Moderate positive correlation (R² = ${correlation.toFixed(3)}) between symmetry and valence. STV hypothesis moderately supported.`,
      implications: [
        'Some relationship between symmetry and hedonic tone',
        'Other factors may also significantly influence valence',
        'Warrants further investigation with larger samples',
        'Consider confounding variables (practice type, experience level)'
      ]
    };
  }

  return {
    support: 'weak',
    explanation: `Weak but significant correlation (R² = ${correlation.toFixed(3)}) between symmetry and valence. Limited support for STV.`,
    implications: [
      'Symmetry may be one of many factors affecting valence',
      'Effect size is small but statistically detectable',
      'May vary by population or practice type',
      'Consider moderating variables'
    ]
  };
}
