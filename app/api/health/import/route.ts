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

    // For very large files, use streaming instead of loading entire file
    // Convert File to buffer in chunks to avoid string size limits
    const chunks: Buffer[] = [];
    const stream = file.stream();
    const reader = stream.getReader();

    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
      totalBytes += value.length;

      // Log progress every 100MB
      if (totalBytes % (100 * 1024 * 1024) < value.length) {
        console.log(`📥 Read ${(totalBytes / (1024 * 1024)).toFixed(2)} MB...`);
      }
    }

    console.log(`✅ File read successfully (${totalBytes} bytes)`);

    // Combine chunks into single buffer
    const buffer = Buffer.concat(chunks);

    console.log(`🔍 Processing buffer directly (${buffer.length} bytes) without full string conversion`);

    // Process buffer in chunks to avoid string size limits
    const filteredXML = await filterHRVDataFromBuffer(buffer, MONTHS_TO_KEEP);

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
 * Filter Apple Health XML from buffer without converting entire file to string
 * Processes in chunks to avoid memory limits
 */
async function filterHRVDataFromBuffer(buffer: Buffer, months: number): Promise<string> {
  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  const cutoffStr = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD

  console.log(`📅 Filtering biometric data since: ${cutoffStr}`);

  const allRecords: string[] = [];

  // Process buffer in 10MB chunks to avoid string size limits
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk
  let offset = 0;

  while (offset < buffer.length) {
    const end = Math.min(offset + CHUNK_SIZE, buffer.length);
    const chunk = buffer.slice(offset, end);
    const chunkStr = chunk.toString('utf8');

    console.log(`  Processing chunk ${Math.floor(offset / CHUNK_SIZE) + 1} (${(chunk.length / (1024 * 1024)).toFixed(2)} MB)`);

    // Extract HRV from this chunk
    const hrvPattern = /<Record[^>]*type="HKQuantityTypeIdentifierHeartRateVariabilitySDNN"[^>]*\/>/g;
    extractFromChunk(chunkStr, hrvPattern, cutoffStr, allRecords, 1000);

    // Extract Heart Rate from this chunk
    const hrPattern = /<Record[^>]*type="HKQuantityTypeIdentifierHeartRate"[^>]*(?:\/>|>[\s\S]*?<\/Record>)/g;
    extractFromChunk(chunkStr, hrPattern, cutoffStr, allRecords, 2000);

    // Extract Sleep from this chunk
    const sleepPattern = /<Record[^>]*type="HKCategoryTypeIdentifierSleepAnalysis"[^>]*\/>/g;
    extractFromChunk(chunkStr, sleepPattern, cutoffStr, allRecords, 2100);

    // Extract Respiratory from this chunk
    const respPattern = /<Record[^>]*type="HKQuantityTypeIdentifierRespiratoryRate"[^>]*\/>/g;
    extractFromChunk(chunkStr, respPattern, cutoffStr, allRecords, 2600);

    offset += CHUNK_SIZE;
  }

  console.log(`📊 Total records extracted: ${allRecords.length}`);

  if (allRecords.length === 0) {
    throw new Error(
      `No biometric data found in the last ${months} months. ` +
      `This usually means you don't have an Apple Watch or health tracking is disabled.`
    );
  }

  // Create filtered XML
  const filteredXML = `<?xml version="1.0" encoding="UTF-8"?>
<HealthData locale="en_US">
  <ExportDate value="${new Date().toISOString().replace('T', ' ').substring(0, 19)} +0000"/>
${allRecords.join('\n')}
</HealthData>`;

  return filteredXML;
}

/**
 * Extract records from a chunk
 */
function extractFromChunk(
  chunk: string,
  pattern: RegExp,
  cutoffDate: string,
  allRecords: string[],
  maxTotal: number
): void {
  let match;
  while ((match = pattern.exec(chunk)) !== null && allRecords.length < maxTotal) {
    const record = match[0];

    // Check if record is within date range
    const dateMatch = /startDate="([^"]+)"/.exec(record);
    if (dateMatch) {
      const startDate = dateMatch[1].split(' ')[0]; // Get YYYY-MM-DD part

      if (startDate >= cutoffDate) {
        allRecords.push(record);
      }
    }
  }
}

/**
 * OLD: Filter Apple Health XML to extract only recent biometric data
 * Extracts: HRV, Heart Rate, Sleep, Respiratory Rate
 */
async function filterHRVDataStreaming(xmlContent: string, months: number): Promise<string> {
  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  const cutoffStr = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD

  console.log(`📅 Filtering biometric data since: ${cutoffStr}`);

  const allRecords: string[] = [];

  // HRV - limit to last 1000
  console.log('💓 Extracting HRV...');
  const hrvPattern = /<Record[^>]*type="HKQuantityTypeIdentifierHeartRateVariabilitySDNN"[^>]*\/>/g;
  const hrvRecords = extractRecordsWithLimit(xmlContent, hrvPattern, cutoffStr, 1000);
  allRecords.push(...hrvRecords);
  console.log(`  Found ${hrvRecords.length} HRV records`);

  // Heart Rate - limit to last 1000
  console.log('❤️  Extracting Heart Rate...');
  const hrPattern = /<Record[^>]*type="HKQuantityTypeIdentifierHeartRate"[^>]*(?:\/>|>[\s\S]*?<\/Record>)/g;
  const hrRecords = extractRecordsWithLimit(xmlContent, hrPattern, cutoffStr, 1000);
  allRecords.push(...hrRecords);
  console.log(`  Found ${hrRecords.length} Heart Rate records`);

  // Sleep - limit to last 100
  console.log('😴 Extracting Sleep...');
  const sleepPattern = /<Record[^>]*type="HKCategoryTypeIdentifierSleepAnalysis"[^>]*\/>/g;
  const sleepRecords = extractRecordsWithLimit(xmlContent, sleepPattern, cutoffStr, 100);
  allRecords.push(...sleepRecords);
  console.log(`  Found ${sleepRecords.length} Sleep records`);

  // Respiratory Rate - limit to last 500
  console.log('🌬️  Extracting Respiratory Rate...');
  const respPattern = /<Record[^>]*type="HKQuantityTypeIdentifierRespiratoryRate"[^>]*\/>/g;
  const respRecords = extractRecordsWithLimit(xmlContent, respPattern, cutoffStr, 500);
  allRecords.push(...respRecords);
  console.log(`  Found ${respRecords.length} Respiratory records`);

  if (allRecords.length === 0) {
    throw new Error(
      `No biometric data found in the last ${months} months. ` +
      `This usually means you don't have an Apple Watch or health tracking is disabled.`
    );
  }

  console.log(`📊 Total records extracted: ${allRecords.length}`);

  // Create filtered XML
  const filteredXML = `<?xml version="1.0" encoding="UTF-8"?>
<HealthData locale="en_US">
  <ExportDate value="${new Date().toISOString().replace('T', ' ').substring(0, 19)} +0000"/>
${allRecords.join('\n')}
</HealthData>`;

  return filteredXML;
}

/**
 * Extract records matching pattern, filtered by date, with a limit
 */
function extractRecordsWithLimit(
  xmlContent: string,
  pattern: RegExp,
  cutoffDate: string,
  limit: number
): string[] {
  const records: string[] = [];
  let match;

  while ((match = pattern.exec(xmlContent)) !== null && records.length < limit) {
    const record = match[0];

    // Check if record is within date range
    const dateMatch = /startDate="([^"]+)"/.exec(record);
    if (dateMatch) {
      const startDate = dateMatch[1].split(' ')[0]; // Get YYYY-MM-DD part

      if (startDate >= cutoffDate) {
        records.push(record);
      }
    }
  }

  return records;
}

// Configure route to handle large files
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout
