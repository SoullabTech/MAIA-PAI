/**
 * Export OpenAI API Usage to CSV
 *
 * Usage: npx tsx scripts/export-openai-usage.ts
 */

interface UsageRecord {
  timestamp: number;
  model: string;
  operation: string;
  tokens?: number;
  cost?: number;
}

async function exportOpenAIUsage() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    process.exit(1);
  }

  // Calculate date range (last 7 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  console.log(`📊 Fetching OpenAI usage from ${startDateStr} to ${endDateStr}...`);

  try {
    // OpenAI Usage API endpoint
    const response = await fetch(
      `https://api.openai.com/v1/usage?start_date=${startDateStr}&end_date=${endDateStr}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);

      // Fallback: Show current MAIA voice activity from logs
      console.log('\n💡 Showing MAIA voice activity estimate instead...\n');
      showLocalEstimate();
      return;
    }

    const data = await response.json();

    // Convert to CSV
    const csv = convertToCSV(data);

    // Write to file
    const fs = await import('fs');
    const outputPath = './openai-usage-export.csv';
    fs.writeFileSync(outputPath, csv);

    console.log(`✅ Usage data exported to: ${outputPath}`);
    console.log(`📈 Total records: ${data.data?.length || 0}`);

  } catch (error: any) {
    console.error('❌ Failed to fetch usage data:', error.message);
    console.log('\n💡 Showing MAIA voice activity estimate instead...\n');
    showLocalEstimate();
  }
}

function convertToCSV(data: any): string {
  if (!data.data || data.data.length === 0) {
    return 'date,model,operation,requests,tokens,cost\n(no data available)';
  }

  // CSV header
  let csv = 'date,model,operation,requests,tokens,cost_usd\n';

  // CSV rows
  for (const record of data.data) {
    const date = new Date(record.aggregation_timestamp * 1000).toISOString().split('T')[0];
    csv += `${date},${record.snapshot_id},${record.operation || 'unknown'},${record.n_requests || 0},${record.n_tokens || 0},${record.cost || 0}\n`;
  }

  return csv;
}

function showLocalEstimate() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           MAIA Voice System - OpenAI Usage Estimate        ║
╚════════════════════════════════════════════════════════════╝

🎤 **Whisper (Speech-to-Text)**
   - Endpoint: /api/voice/transcribe
   - Model: whisper-1
   - Cost: ~$0.006 per minute of audio
   - Used for: Your voice → text transcription

🔊 **TTS (Text-to-Speech)**
   - Endpoint: /api/voice/synthesize
   - Model: tts-1-hd
   - Voice: shimmer/alloy
   - Cost: ~$15 per 1M characters (~$0.015 per 1K chars)
   - Used for: MAIA's voice output

💬 **GPT-4 (Fallback Only)**
   - Only used when Claude API fails
   - Model: gpt-4
   - Cost: $0.03/1K input tokens, $0.06/1K output tokens
   - Rarely triggered (Claude is primary)

📊 **To See Actual Usage:**
1. Visit: https://platform.openai.com/usage
2. Filter by model: whisper-1, tts-1-hd, gpt-4
3. Click "Export" to download CSV

🔍 **Check Current Costs:**
   https://platform.openai.com/account/billing/overview
  `);
}

// Run the export
exportOpenAIUsage().catch(console.error);
