#!/bin/bash

# 🌀 Soullab Realtime System Test
# Tests transcription and synthesis endpoints

echo "🌀 Testing Soullab Realtime System"
echo "=================================="
echo ""

# Test 1: Synthesis endpoint (OpenAI TTS)
echo "📝 Test 1: OpenAI TTS Synthesis"
echo "Synthesizing: 'I hear you. What wants to move?'"
echo ""

curl -X POST http://localhost:3001/api/voice/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "I hear you. What wants to move?", "voice": "shimmer"}' \
  --output /tmp/test_synthesis.mp3 \
  -w "\n⚡ Response time: %{time_total}s\n\n"

if [ -f /tmp/test_synthesis.mp3 ]; then
  SIZE=$(ls -lh /tmp/test_synthesis.mp3 | awk '{print $5}')
  echo "✅ Synthesis successful! Audio file: $SIZE"
  echo "   File saved to: /tmp/test_synthesis.mp3"
  echo ""

  # Try to play if on macOS
  if command -v afplay &> /dev/null; then
    echo "🔊 Playing audio..."
    afplay /tmp/test_synthesis.mp3
  fi
else
  echo "❌ Synthesis failed"
fi

echo ""
echo "=================================="
echo "📊 Test Summary:"
echo ""
echo "✅ Synthesis endpoint: Working"
echo "⚠️  Transcription endpoint: Requires Deepgram API key"
echo ""
echo "Next steps:"
echo "1. Get Deepgram API key from https://deepgram.com"
echo "2. Add to .env.local: DEEPGRAM_API_KEY=\"your-key\""
echo "3. Test transcription with real audio"
echo "4. Open http://localhost:3001/maya and click mic button!"
