#!/bin/bash
# 🎙️ Voice Sovereignty Setup Script
# One-command setup for complete voice independence

set -e  # Exit on error

echo "🎙️  MAIA Voice Sovereignty Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directories
VOICE_TRAINING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$VOICE_TRAINING_DIR")"
RECORDINGS_DIR="$VOICE_TRAINING_DIR/voice-recordings"
MODELS_CACHE_DIR="$VOICE_TRAINING_DIR/models-cache"

echo -e "${BLUE}📁 Setup directories${NC}"
mkdir -p "$RECORDINGS_DIR"/{maya,anthony}
mkdir -p "$MODELS_CACHE_DIR"
mkdir -p "$VOICE_TRAINING_DIR/processed"

# Step 1: Check Prerequisites
echo -e "\n${BLUE}1️⃣  Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker installed${NC}"

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose installed${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Python 3 not found. Installing dependencies will be skipped.${NC}"
    HAS_PYTHON=false
else
    echo -e "${GREEN}✅ Python 3 installed${NC}"
    HAS_PYTHON=true
fi

# Step 2: Install Python Dependencies
if [ "$HAS_PYTHON" = true ]; then
    echo -e "\n${BLUE}2️⃣  Installing Python dependencies...${NC}"

    # Create virtual environment
    if [ ! -d "$VOICE_TRAINING_DIR/venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv "$VOICE_TRAINING_DIR/venv"
    fi

    # Activate virtual environment
    source "$VOICE_TRAINING_DIR/venv/bin/activate"

    # Install dependencies
    echo "Installing required packages..."
    pip install --quiet --upgrade pip
    pip install --quiet \
        librosa \
        soundfile \
        pydub \
        numpy \
        TTS

    echo -e "${GREEN}✅ Python dependencies installed${NC}"
else
    echo -e "\n${YELLOW}2️⃣  Skipping Python setup (Python not found)${NC}"
fi

# Step 3: Configure XTTS Model
echo -e "\n${BLUE}3️⃣  Configuring XTTS voice model...${NC}"

# Create XTTS config
cat > "$VOICE_TRAINING_DIR/xtts-config.json" <<EOF
{
  "model_name": "tts_models/multilingual/multi-dataset/xtts_v2",
  "voices": {
    "maya": {
      "speaker_wav": "/app/voices/maya_embedding.wav",
      "language": "en",
      "description": "Matrix Oracle - Warm, maternal, knowing",
      "settings": {
        "speed": 1.0,
        "temperature": 0.75,
        "length_penalty": 1.0,
        "repetition_penalty": 2.0
      }
    },
    "anthony": {
      "speaker_wav": "/app/voices/anthony_embedding.wav",
      "language": "en",
      "description": "Alchemist - Deep, philosophical, grounded",
      "settings": {
        "speed": 0.9,
        "temperature": 0.85,
        "length_penalty": 1.0,
        "repetition_penalty": 2.0
      }
    }
  },
  "default_voice": "maya"
}
EOF

echo -e "${GREEN}✅ XTTS configuration created${NC}"

# Step 4: Check for Voice Recordings
echo -e "\n${BLUE}4️⃣  Checking for voice recordings...${NC}"

MAYA_COUNT=$(find "$RECORDINGS_DIR/maya" -name "*.wav" 2>/dev/null | wc -l | tr -d ' ')
ANTHONY_COUNT=$(find "$RECORDINGS_DIR/anthony" -name "*.wav" 2>/dev/null | wc -l | tr -d ' ')

echo "Maya recordings: $MAYA_COUNT files"
echo "Anthony recordings: $ANTHONY_COUNT files"

if [ "$MAYA_COUNT" -eq 0 ] && [ "$ANTHONY_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}"
    echo "⚠️  No voice recordings found!"
    echo ""
    echo "Next steps:"
    echo "1. Review SACRED_PHRASE_CORPUS.md for phrases to record"
    echo "2. Record audio files and place them in:"
    echo "   - $RECORDINGS_DIR/maya/"
    echo "   - $RECORDINGS_DIR/anthony/"
    echo "3. Run this script again to process recordings"
    echo -e "${NC}"
else
    echo -e "${GREEN}✅ Voice recordings found${NC}"

    # Process recordings if Python is available
    if [ "$HAS_PYTHON" = true ]; then
        echo -e "\n${BLUE}5️⃣  Processing voice recordings...${NC}"

        source "$VOICE_TRAINING_DIR/venv/bin/activate"

        if [ "$MAYA_COUNT" -gt 0 ]; then
            echo "Processing Maya voice..."
            python3 "$VOICE_TRAINING_DIR/voice-data-collector.py" maya --base-dir "$RECORDINGS_DIR"
        fi

        if [ "$ANTHONY_COUNT" -gt 0 ]; then
            echo "Processing Anthony voice..."
            python3 "$VOICE_TRAINING_DIR/voice-data-collector.py" anthony --base-dir "$RECORDINGS_DIR"
        fi

        echo -e "${GREEN}✅ Recordings processed${NC}"
    fi
fi

# Step 6: Pull Docker Image
echo -e "\n${BLUE}6️⃣  Pulling Coqui TTS Docker image...${NC}"
echo "(This may take a few minutes on first run)"

docker pull ghcr.io/coqui-ai/tts:latest

echo -e "${GREEN}✅ Docker image ready${NC}"

# Step 7: Create Environment File
echo -e "\n${BLUE}7️⃣  Creating environment configuration...${NC}"

cat > "$BASE_DIR/.env.voice" <<EOF
# 🎙️ MAIA Voice Configuration
# Generated by setup-voice-sovereignty.sh

# Voice Service Selection
VOICE_SERVICE=xtts  # Options: xtts, elevenlabs, openai
VOICE_FALLBACK=elevenlabs

# XTTS Configuration
XTTS_URL=http://localhost:8000
XTTS_ENABLED=true

# Voice Embeddings
MAYA_VOICE_EMBEDDING=/app/voices/maya_embedding.wav
ANTHONY_VOICE_EMBEDDING=/app/voices/anthony_embedding.wav

# Performance
VOICE_TIMEOUT_MS=5000
VOICE_CACHE_ENABLED=true

# Fallback to ElevenLabs (keep as backup)
ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY:-your_key_here}
ELEVENLABS_VOICE_ID_AUNT_ANNIE=${ELEVENLABS_VOICE_ID_AUNT_ANNIE:-y2TOWGCXSYEgBanvKsYJ}
ELEVENLABS_VOICE_ID_EMILY=${ELEVENLABS_VOICE_ID_EMILY:-LcfcDJNUP1GQjkzn1xUU}
EOF

echo -e "${GREEN}✅ Environment file created: $BASE_DIR/.env.voice${NC}"

# Step 8: Create Start Script
echo -e "\n${BLUE}8️⃣  Creating start script...${NC}"

cat > "$VOICE_TRAINING_DIR/start-xtts.sh" <<'STARTSCRIPT'
#!/bin/bash
# Start MAIA XTTS Voice Service

VOICE_TRAINING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🎙️  Starting MAIA Voice Service (XTTS)"
echo "======================================"
echo ""

# Check if recordings are processed
if [ ! -f "$VOICE_TRAINING_DIR/voice-recordings/maya_embedding.wav" ]; then
    echo "⚠️  Maya voice embedding not found!"
    echo "Please record voice samples and run: ./setup-voice-sovereignty.sh"
    exit 1
fi

# Stop existing container
echo "Stopping existing containers..."
docker compose -f "$VOICE_TRAINING_DIR/docker-compose.sesame-xtts.yml" down

# Start XTTS service
echo "Starting XTTS service..."
docker compose -f "$VOICE_TRAINING_DIR/docker-compose.sesame-xtts.yml" up -d

# Wait for service to be ready
echo ""
echo "Waiting for XTTS to load models (this may take 30-60 seconds)..."

MAX_WAIT=90
COUNTER=0

while [ $COUNTER -lt $MAX_WAIT ]; do
    if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
        echo ""
        echo "✅ XTTS service is ready!"
        echo ""
        echo "Test the voice service:"
        echo "  curl -X POST http://localhost:8000/api/tts \\"
        echo "    -H 'Content-Type: application/json' \\"
        echo "    -d '{\"text\": \"Welcome back, beloved soul\", \"speaker_wav\": \"maya\"}' \\"
        echo "    --output test.wav"
        echo ""
        echo "View logs:"
        echo "  docker logs -f maia-voice-xtts"
        echo ""
        exit 0
    fi

    echo -n "."
    sleep 2
    COUNTER=$((COUNTER + 2))
done

echo ""
echo "❌ Service did not start in time. Check logs:"
echo "  docker logs maia-voice-xtts"
exit 1
STARTSCRIPT

chmod +x "$VOICE_TRAINING_DIR/start-xtts.sh"

echo -e "${GREEN}✅ Start script created: start-xtts.sh${NC}"

# Step 9: Summary
echo -e "\n${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     🎉 Voice Sovereignty Setup Complete! 🎉               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""

if [ "$MAYA_COUNT" -eq 0 ] && [ "$ANTHONY_COUNT" -eq 0 ]; then
    echo "1️⃣  Record voice samples:"
    echo "   - Review: SACRED_PHRASE_CORPUS.md"
    echo "   - Record WAV files (44.1kHz, mono, 16-bit)"
    echo "   - Place in:"
    echo "     • $RECORDINGS_DIR/maya/"
    echo "     • $RECORDINGS_DIR/anthony/"
    echo ""
    echo "2️⃣  Run setup again to process recordings:"
    echo "   ./setup-voice-sovereignty.sh"
    echo ""
    echo "3️⃣  Start the voice service:"
    echo "   ./start-xtts.sh"
else
    echo "1️⃣  Start the XTTS voice service:"
    echo "   cd $VOICE_TRAINING_DIR"
    echo "   ./start-xtts.sh"
    echo ""
    echo "2️⃣  Test the voice:"
    echo "   curl -X POST http://localhost:8000/api/tts \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"text\": \"Welcome back, beloved soul\", \"speaker_wav\": \"maya\"}' \\"
    echo "     --output test.wav"
    echo ""
    echo "3️⃣  Update your app to use XTTS:"
    echo "   - Set VOICE_SERVICE=xtts in .env.voice"
    echo "   - Restart your application"
fi

echo ""
echo -e "${BLUE}📊 Resources:${NC}"
echo "   Recordings: $RECORDINGS_DIR"
echo "   Models Cache: $MODELS_CACHE_DIR"
echo "   Configuration: $VOICE_TRAINING_DIR/xtts-config.json"
echo "   Environment: $BASE_DIR/.env.voice"
echo ""
echo -e "${GREEN}✨ Path to voice sovereignty activated! ✨${NC}"
echo ""
