import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getSupabaseAdmin } from '@/lib/supabaseAdminClient';

// Force dynamic rendering since we use session/headers
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user from NextAuth session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = session.user.email;

    // Get file counts by status
    const supabase = getSupabaseAdmin();
    const { data: files, error: filesError } = await supabase
      .from('user_files')
      .select('status, category')
      .eq('user_id', userId);

    if (filesError) {
      console.error('Files query error:', filesError);
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }

    // Get embedding counts
    const { count: totalChunks, error: chunksError } = await supabase
      .from('file_embeddings')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (chunksError) {
      console.error('Chunks query error:', chunksError);
    }

    // Get citation counts
    const { count: totalCitations, error: citationsError } = await supabase
      .from('file_citations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (citationsError) {
      console.error('Citations query error:', citationsError);
    }

    // Process stats
    const totalFiles = files?.length || 0;
    const readyFiles = files?.filter(f => f.status === 'ready' || f.status === 'completed').length || 0;
    const processingFiles = files?.filter(f => f.status === 'processing' || f.status === 'uploading').length || 0;

    // Category breakdown
    const categories = files?.reduce((acc, file) => {
      acc[file.category] = (acc[file.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const stats = {
      totalFiles,
      readyFiles,
      processingFiles,
      totalChunks: totalChunks || 0,
      totalCitations: totalCitations || 0,
      categories,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}