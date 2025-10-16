/**
 * Field Protocol API - Records Management
 *
 * Handles CRUD operations for Field Records and provides
 * endpoints for the Brain Trust to access user experiences
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fieldRecordsService } from '@/lib/field-protocol/FieldRecordsService';
import type { FieldRecord, PrivacyLevel } from '@/lib/field-protocol/types';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/field-protocol/records
 * Fetch Field Records with various filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Parse query parameters
    const userId = searchParams.get('userId') || user.id;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const privacyFilter = searchParams.get('privacy')?.split(',') as PrivacyLevel[] | undefined;
    const completionStageMin = searchParams.get('completionStageMin')
      ? parseInt(searchParams.get('completionStageMin')!)
      : undefined;
    const context = searchParams.get('context') === 'true';

    // If requesting context for MAIA conversations
    if (context) {
      const fieldContext = await fieldRecordsService.getFieldRecordContext(userId);
      return NextResponse.json(fieldContext);
    }

    // Otherwise, fetch records with filters
    const records = await fieldRecordsService.getUserFieldRecords(userId, {
      limit,
      offset,
      privacyFilter,
      completionStageMin
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching field records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch field records' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/field-protocol/records
 * Create or update a Field Record
 */
export async function POST(request: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const recordData: Partial<FieldRecord> = body;

    // Save the field record
    const savedRecord = await fieldRecordsService.saveFieldRecord(
      recordData,
      user.id
    );

    // If record is substantial enough, notify MAIA's memory system
    if (savedRecord.completionStage >= 3) {
      // Import and update the unified memory
      const { unifiedMemory } = await import('@/lib/memory/UnifiedMemoryInterface');

      // Extract elements and symbols for memory logging
      const elements = savedRecord.interpretation?.primaryElement
        ? [savedRecord.interpretation.primaryElement, ...(savedRecord.interpretation.secondaryElements || [])]
        : [];

      const symbols = savedRecord.interpretation?.symbols || [];

      // Log to unified memory
      await unifiedMemory.logExperience(
        savedRecord.reflection?.coreInsight ||
        savedRecord.interpretation?.significance ||
        savedRecord.observation.phenomena,
        {
          userId: user.id,
          elements: elements as any[], // Type conversion needed
          emotionalTone: savedRecord.observation.sensoryData.emotional,
          symbolsPresent: symbols
        }
      );
    }

    return NextResponse.json(savedRecord);
  } catch (error) {
    console.error('Error saving field record:', error);
    return NextResponse.json(
      { error: 'Failed to save field record' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/field-protocol/records/[id]
 * Update a specific Field Record
 */
export async function PUT(request: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }

    // Verify user owns the record
    const { data: existingRecord, error: fetchError } = await supabase
      .from('field_records')
      .select('userId')
      .eq('id', id)
      .single();

    if (fetchError || !existingRecord) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    if (existingRecord.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update the record
    const updatedRecord = await fieldRecordsService.saveFieldRecord(
      { id, ...updateData },
      user.id
    );

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Error updating field record:', error);
    return NextResponse.json(
      { error: 'Failed to update field record' },
      { status: 500 }
    );
  }
}