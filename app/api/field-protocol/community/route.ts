/**
 * Field Protocol API - Community Engagement
 *
 * Handles community interactions with Field Records:
 * - Reflections
 * - Questions & Answers
 * - Resonance Markers
 * - Commons Sharing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fieldRecordsService } from '@/lib/field-protocol/FieldRecordsService';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/field-protocol/community
 * Fetch community-shared Field Records (Commons and Public)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') as 'recent' | 'resonance' | 'completion' || 'recent';
    const elementFilter = searchParams.get('elements')?.split(',') as any[] | undefined;

    // Fetch commons records
    const records = await fieldRecordsService.getCommonsRecords({
      limit,
      sortBy,
      elementFilter
    });

    // Filter out sensitive user information for privacy
    const sanitizedRecords = records.map(record => ({
      ...record,
      userId: undefined, // Remove user ID for privacy
      userName: record.transmission?.intendedAudience === 'public'
        ? 'Anonymous Practitioner'
        : undefined
    }));

    return NextResponse.json(sanitizedRecords);
  } catch (error) {
    console.error('Error fetching commons records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commons records' },
      { status: 500 }
    );
  }
}

