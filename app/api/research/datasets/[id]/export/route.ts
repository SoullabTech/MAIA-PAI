/**
 * DATASET EXPORT API
 *
 * Export anonymized research datasets in various formats
 * Supports JSON, CSV, NDJSON for different research workflows
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getResearchDataExport, ExportFormat } from '@/lib/consciousness/ResearchDataExport';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/research/datasets/[id]/export
 * Export dataset in specified format
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') || 'json') as ExportFormat;
    const researcherId = searchParams.get('researcher_id');

    if (!researcherId) {
      return NextResponse.json(
        { error: 'researcher_id required' },
        { status: 400 }
      );
    }

    // Verify dataset access
    const { data: dataset, error: datasetError } = await supabase
      .from('research_datasets')
      .select('*')
      .eq('id', params.id)
      .single();

    if (datasetError || !dataset) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }

    // Check researcher has access
    if (!dataset.researcher_ids.includes(researcherId)) {
      return NextResponse.json(
        { error: 'Unauthorized: No access to this dataset' },
        { status: 403 }
      );
    }

    // Export dataset
    const exportService = getResearchDataExport();
    const exportedData = await exportService.exportDataset(params.id, format);

    // Update export metadata
    await supabase
      .from('research_datasets')
      .update({
        last_exported_at: new Date().toISOString(),
        export_count: dataset.export_count + 1
      })
      .eq('id', params.id);

    // Set appropriate content type and headers
    const contentTypes = {
      json: 'application/json',
      csv: 'text/csv',
      ndjson: 'application/x-ndjson',
      parquet: 'application/octet-stream'
    };

    const extensions = {
      json: 'json',
      csv: 'csv',
      ndjson: 'ndjson',
      parquet: 'parquet'
    };

    return new NextResponse(exportedData, {
      status: 200,
      headers: {
        'Content-Type': contentTypes[format],
        'Content-Disposition': `attachment; filename="${dataset.name.replace(/\s+/g, '_')}_${params.id}.${extensions[format]}"`,
        'X-Dataset-ID': params.id,
        'X-Anonymization-Level': dataset.anonymization_level,
        'X-Privacy-Risk': dataset.reidentification_risk,
        'X-Total-Participants': dataset.total_participants.toString(),
        'X-Total-Sessions': dataset.total_sessions.toString()
      }
    });
  } catch (error: any) {
    console.error('Failed to export dataset:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
