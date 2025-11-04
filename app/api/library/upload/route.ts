import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Library of Alexandria - File Upload API
 *
 * Handles file uploads and queues them for processing
 */

const UPLOAD_DIR = process.env.LIBRARY_OF_ALEXANDRIA_PATH ||
  join(process.cwd(), 'uploads/library');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const topicsJson = formData.get('topics') as string;
    const author = formData.get('author') as string || undefined;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse topics
    const topics = topicsJson ? JSON.parse(topicsJson) : [];

    // Create category folder if it doesn't exist
    const categoryPath = join(UPLOAD_DIR, category || 'uncategorized');
    if (!existsSync(categoryPath)) {
      await mkdir(categoryPath, { recursive: true });
    }

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = join(categoryPath, file.name);
    await writeFile(filePath, buffer);

    // Create/update metadata.json for this category
    const metadataPath = join(categoryPath, 'metadata.json');
    const metadata = {
      category,
      author,
      topics,
      uploaded_at: new Date().toISOString(),
      uploaded_via: 'web_interface'
    };

    if (!existsSync(metadataPath)) {
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    }

    // TODO: Queue for background processing
    // For now, we'll process synchronously (simple approach)
    // Later: Add to job queue (Bull, BullMQ, etc.)

    console.log(`📚 [Library] Uploaded: ${file.name}`);
    console.log(`   Category: ${category}`);
    console.log(`   Author: ${author || 'Unknown'}`);
    console.log(`   Topics: ${topics.join(', ')}`);
    console.log(`   Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        size: file.size,
        category,
        author,
        topics,
        path: filePath,
      },
      message: 'File uploaded successfully. Processing will begin shortly.'
    });

  } catch (error) {
    console.error('[Library Upload] Error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Get upload statistics
export async function GET() {
  try {
    // TODO: Query Supabase for upload stats
    // For now, return placeholder
    return NextResponse.json({
      total_files: 0,
      total_chunks: 0,
      categories: {},
      recent_uploads: []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
