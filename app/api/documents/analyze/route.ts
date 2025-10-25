import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    const arrayBuffer = await fileData.arrayBuffer();
    const mediaType = document.mime_type || 'application/pdf';

    console.log(`📄 Analyzing document: ${document.filename} (${mediaType}, ${document.type})`);

    let textToAnalyze = '';
    let transcription = null;

    // Handle different file types
    if (document.type === 'audio' || document.type === 'video' || mediaType.startsWith('audio/') || mediaType.startsWith('video/')) {
      // Transcribe audio/video with Whisper
      console.log('🎙️ Transcribing audio/video with Whisper...');

      // Create a temporary file for Whisper (it needs a File object)
      const blob = new Blob([arrayBuffer], { type: mediaType });
      const file = new File([blob], document.filename, { type: mediaType });

      try {
        const transcriptionResponse = await openai.audio.transcriptions.create({
          file: file,
          model: 'whisper-1',
          language: 'en', // Auto-detect if not specified
          response_format: 'verbose_json', // Get timestamps and metadata
        });

        transcription = {
          text: transcriptionResponse.text,
          duration: transcriptionResponse.duration,
          language: transcriptionResponse.language,
        };

        textToAnalyze = transcriptionResponse.text;
        console.log(`✅ Transcription complete: ${transcriptionResponse.duration}s, ${transcriptionResponse.text.length} chars`);
      } catch (transcriptionError: any) {
        console.error('Transcription error:', transcriptionError);
        await supabase
          .from('documents')
          .update({ status: 'error', error_message: `Transcription failed: ${transcriptionError.message}` })
          .eq('id', documentId);
        return NextResponse.json({ error: `Transcription failed: ${transcriptionError.message}` }, { status: 500 });
      }
    } else {
      // For PDFs and text documents, use Claude's native document reading
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      textToAnalyze = base64; // Will be sent as document type to Claude
    }

    // Analyze with Claude
    let analysisPrompt = '';
    let claudeMessages: any[] = [];

    if (transcription) {
      // For audio/video: analyze the transcript
      analysisPrompt = `You're analyzing a transcribed ${document.type} file.

${document.type === 'audio' && document.filename.toLowerCase().includes('session') ?
`This appears to be a therapy or coaching session recording. Please analyze with sensitivity and confidentiality in mind.` :
document.type === 'audio' && document.filename.toLowerCase().includes('music') ?
`This appears to be music. Focus on lyrics, themes, and artistic content.` :
`This is transcribed ${document.type} content.`}

**Transcript:**
${textToAnalyze}

Please provide:
1. **Summary**: Overview of the main content and themes
2. **Key Insights**: Most important takeaways
3. **Topics**: Main subject areas
4. **Notable Moments**: Key quotes or passages
5. **Questions**: What questions does this raise?

Format as JSON:
{
  "summary": "...",
  "key_insights": ["...", "..."],
  "topics": ["...", "..."],
  "notable_quotes": ["...", "..."],
  "questions": ["...", "..."],
  "duration": "${transcription.duration}s",
  "word_count": ${textToAnalyze.split(/\s+/).length}
}`;

      claudeMessages = [
        {
          role: 'user',
          content: [{ type: 'text', text: analysisPrompt }],
        },
      ];
    } else {
      // For PDFs: use document type
      claudeMessages = [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: textToAnalyze,
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
      ];
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: claudeMessages,
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

    // Update document with analysis (and transcription if audio/video)
    const updateData: any = {
      status: 'completed',
      analysis: analysis,
      analyzed_at: new Date().toISOString(),
    };

    if (transcription) {
      updateData.transcription = transcription;
    }

    const { error: updateError } = await supabase
      .from('documents')
      .update(updateData)
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
