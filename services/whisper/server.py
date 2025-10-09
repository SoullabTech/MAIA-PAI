#!/usr/bin/env python3
"""
🎤 Soullab Whisper STT Service

Self-hosted speech-to-text using OpenAI's Whisper
100% sovereignty, $0 cost after setup

Performance targets:
- Whisper tiny: ~100ms, good quality
- Whisper base: ~200ms, better quality
- Whisper small: ~300ms, great quality
- Whisper medium: ~500ms, excellent quality

We'll use "base" for 200ms latency (competitive with Deepgram's 150ms)
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import tempfile
import os
import time
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Soullab Whisper STT")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "https://*.soullab.life"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model on startup
# Options: tiny, base, small, medium, large
MODEL_SIZE = os.getenv("WHISPER_MODEL", "base")
logger.info(f"Loading Whisper model: {MODEL_SIZE}")
model = whisper.load_model(MODEL_SIZE)
logger.info(f"✅ Whisper {MODEL_SIZE} model loaded")

@app.get("/")
async def root():
    return {
        "service": "Soullab Whisper STT",
        "model": MODEL_SIZE,
        "status": "ready",
        "sovereignty": "100%"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model": MODEL_SIZE}

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Transcribe audio file to text

    Returns:
        {
            "success": true,
            "transcript": "Hello MAIA",
            "confidence": 0.95,
            "language": "en",
            "processingTime": 187
        }
    """
    start_time = time.time()

    try:
        # Save uploaded file to temp
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(audio.filename).suffix) as tmp_file:
            content = await audio.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        logger.info(f"Transcribing: {audio.filename} ({len(content)} bytes)")

        # Transcribe with Whisper
        result = model.transcribe(
            tmp_path,
            language="en",  # Force English for faster processing
            fp16=False,     # Use FP32 for CPU (change to True if using GPU)
            verbose=False
        )

        # Clean up temp file
        os.unlink(tmp_path)

        transcript = result["text"].strip()
        language = result.get("language", "en")

        # Calculate average confidence from segments
        segments = result.get("segments", [])
        if segments:
            avg_confidence = sum(s.get("no_speech_prob", 0) for s in segments) / len(segments)
            confidence = 1.0 - avg_confidence  # Invert no_speech_prob
        else:
            confidence = 0.9  # Default

        processing_time = int((time.time() - start_time) * 1000)

        logger.info(f"✅ Transcription: '{transcript[:50]}...' ({processing_time}ms)")

        return {
            "success": True,
            "transcript": transcript,
            "confidence": round(confidence, 3),
            "language": language,
            "processingTime": processing_time,
            "model": MODEL_SIZE
        }

    except Exception as e:
        logger.error(f"❌ Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcribe-stream")
async def transcribe_stream(audio: UploadFile = File(...)):
    """
    Streaming transcription for real-time use
    Returns interim results as they become available
    """
    # TODO: Implement streaming with faster-whisper
    return {"error": "Streaming not yet implemented"}

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8001"))
    logger.info(f"🎤 Starting Soullab Whisper STT on port {port}")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
