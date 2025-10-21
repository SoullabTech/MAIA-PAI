import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side Apple Health Import Endpoint
 *
 * Handles large Apple Health export files by:
 * 1. Accepting file uploads up to 2GB
 * 2. Streaming and filtering to extract only recent HRV data
 * 3. Returning filtered XML that's small enough for browser processing
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB
const MONTHS_TO_KEEP = 6;

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Received Apple Health import request');

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large',
          message: `File size (${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB) exceeds maximum (2 GB)`
        },
        { status: 413 }
      );
    }

    console.log(`📁 Processing file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);

    // Read file content
    const xmlContent = await file.text();

    console.log(`✅ File read successfully (${xmlContent.length} characters)`);

    // Parse XML and extract HRV data
    const filteredXML = await filterHRVData(xmlContent, MONTHS_TO_KEEP);

    console.log(`✅ Filtered XML created (${filteredXML.length} characters)`);

    // Return filtered XML
    return new NextResponse(filteredXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': 'attachment; filename="export_hrv_filtered.xml"',
      },
    });

  } catch (error) {
    console.error('❌ Import error:', error);
    return NextResponse.json(
      {
        error: 'Import failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Filter Apple Health XML to extract only recent HRV data
 */
async function filterHRVData(xmlContent: string, months: number): Promise<string> {
  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  const cutoffStr = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD

  console.log(`📅 Filtering HRV data since: ${cutoffStr}`);

  // Use regex to extract HRV records (faster than full XML parsing for large files)
  const hrvPattern = /<Record[^>]*type="[^"]*HeartRateVariability[^"]*"[^>]*>[\s\S]*?<\/Record>/g;

  let hrvRecords: string[] = [];
  let match;
  let totalRecords = 0;

  // Extract all HRV records
  while ((match = hrvPattern.exec(xmlContent)) !== null) {
    totalRecords++;
    const record = match[0];

    // Check if record is within date range
    const dateMatch = /startDate="([^"]+)"/.exec(record);
    if (dateMatch) {
      const startDate = dateMatch[1].split(' ')[0]; // Get YYYY-MM-DD part

      if (startDate >= cutoffStr) {
        hrvRecords.push(record);
      }
    }
  }

  console.log(`📊 Found ${totalRecords} total HRV records, ${hrvRecords.length} within last ${months} months`);

  if (hrvRecords.length === 0) {
    throw new Error(
      `No HRV data found in the last ${months} months. ` +
      `This usually means you don't have an Apple Watch or HRV tracking is disabled.`
    );
  }

  // Create filtered XML
  const filteredXML = `<?xml version="1.0" encoding="UTF-8"?>
<HealthData locale="en_US">
${hrvRecords.join('\n')}
</HealthData>`;

  return filteredXML;
}

// Configure route to handle large files
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout
