import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UploadedFile {
  file_id: string;
  filename: string;
  content_type: string;
  size: number;
  storage_path: string;
  extracted_text?: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

/**
 * Extract text from different file types
 */
async function extractText(file: File): Promise<string> {
  const fileType = file.type;

  try {
    // For text files
    if (fileType === 'text/plain' || fileType === 'text/markdown') {
      return await file.text();
    }

    // For PDF files
    if (fileType === 'application/pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer);
      return data.text;
    }

    // For DOCX files
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      const mammoth = (await import('mammoth'));
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // For images
    if (fileType.startsWith('image/')) {
      return '[Image file - visual content not extracted]';
    }

    return '[File type not supported for text extraction]';
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return '[Error extracting text from file]';
  }
}

/**
 * POST /api/files/upload
 * Handles file uploads from the chat interface
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
      'text/plain', 'text/markdown',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not supported` },
        { status: 400 }
      );
    }

    // Generate unique file ID
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const storagePath = `user-uploads/${fileId}_${file.name}`;

    // Convert File to Buffer for storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Extract text from the file
    let extractedText = '';
    try {
      extractedText = await extractText(file);
    } catch (error) {
      console.error('Text extraction error:', error);
    }

    // Save file metadata to database
    const { data: fileRecord, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        file_id: fileId,
        filename: file.name,
        content_type: file.type,
        size: file.size,
        storage_path: storagePath,
        extracted_text: extractedText,
        status: 'complete',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      await supabase.storage.from('documents').remove([storagePath]);
      return NextResponse.json(
        { error: 'Failed to save file metadata' },
        { status: 500 }
      );
    }

    const response: UploadedFile = {
      file_id: fileId,
      filename: file.name,
      content_type: file.type,
      size: file.size,
      storage_path: storagePath,
      extracted_text: extractedText,
      status: 'complete'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/files/upload?file_id=xxx
 * Retrieves file metadata and content
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const fileId = searchParams.get('file_id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'file_id parameter required' },
        { status: 400 }
      );
    }

    const { data: fileRecord, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('file_id', fileId)
      .single();

    if (error || !fileRecord) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(fileRecord);

  } catch (error) {
    console.error('Retrieve error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
