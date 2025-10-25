import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get document metadata
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(document.storage_path);

    if (downloadError) {
      console.error('Download error:', downloadError);
      await supabase
        .from('documents')
        .update({ status: 'error', error_message: downloadError.message })
        .eq('id', documentId);
      return NextResponse.json({ error: downloadError.message }, { status: 500 });
    }

    // Convert to base64 for PDF support
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Determine media type
    const mediaType = document.mime_type || 'application/pdf';

    console.log(`📄 Analyzing document: ${document.filename} (${mediaType})`);

    // Analyze with Claude (supports PDF directly)
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Please analyze this document and provide:

1. **Summary**: A concise overview of the main themes and arguments
2. **Key Insights**: The most important takeaways and concepts
3. **Topics**: Main subject areas covered
4. **Quotes**: Notable quotes or passages (if applicable)
5. **Questions**: What questions does this raise for deeper exploration?

Format your response as structured JSON with these fields:
{
  "summary": "...",
  "key_insights": ["...", "..."],
  "topics": ["...", "..."],
  "notable_quotes": ["...", "..."],
  "questions": ["...", "..."]
}`,
            },
          ],
        },
      ],
    });

    const analysisText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Try to parse as JSON, fallback to plain text
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        analysis = JSON.parse(analysisText);
      }
    } catch {
      // If parsing fails, structure it manually
      analysis = {
        summary: analysisText.substring(0, 500),
        key_insights: [],
        topics: [],
        notable_quotes: [],
        questions: [],
        raw_text: analysisText,
      };
    }

    // Update document with analysis
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        status: 'completed',
        analysis: analysis,
        analyzed_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log(`✅ Document analyzed successfully: ${document.filename}`);

    return NextResponse.json({
      success: true,
      documentId,
      analysis,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}

// Mark as long-running function
export const maxDuration = 60;
