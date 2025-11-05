"""
🌊 LIQUID AI MICROSERVICE
FastAPI bridge between MAIA and Liquid AI LFM-350M model
Runs on http://localhost:5050
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MAIA Liquid AI Bridge", version="0.1.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class PromptRequest(BaseModel):
    text: str
    max_tokens: int = 80
    temperature: float = 0.8
    top_p: float = 0.9

class LiquidResponse(BaseModel):
    reply: str
    model: str
    tokens_generated: int

# Global model cache (loaded once on startup)
MODEL_ID = "LiquidAI/LFM2-350M"
tokenizer = None
model = None

@app.on_event("startup")
async def load_model():
    """Load Liquid AI model once on startup"""
    global tokenizer, model

    logger.info(f"🌊 [LIQUID] Loading model: {MODEL_ID}")
    logger.info("This may take a few minutes on first run...")

    try:
        # Load tokenizer
        logger.info("1️⃣  Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
        logger.info("✅ Tokenizer loaded")

        # Load model
        logger.info("2️⃣  Loading model...")
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True
        )
        logger.info("✅ Model loaded and ready")
        logger.info(f"🌊 [LIQUID] Service running on http://localhost:5050")

    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "alive",
        "service": "MAIA Liquid AI Bridge",
        "model": MODEL_ID,
        "ready": model is not None
    }

@app.post("/liquid", response_model=LiquidResponse)
async def liquid_reply(prompt: PromptRequest):
    """
    Generate response using Liquid AI model

    The Liquid layer provides temporal intelligence - sensing the rhythm
    and flow of conversation rather than just processing content.
    """
    if model is None or tokenizer is None:
        return {
            "reply": "Model not loaded yet. Please wait...",
            "model": MODEL_ID,
            "tokens_generated": 0
        }

    try:
        logger.info(f"🌊 [LIQUID] Received prompt: {prompt.text[:50]}...")

        # Tokenize input
        inputs = tokenizer(prompt.text, return_tensors="pt").to(model.device)

        # Generate response
        logger.info(f"🌊 [LIQUID] Generating (max_tokens={prompt.max_tokens}, temp={prompt.temperature})...")
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=prompt.max_tokens,
                temperature=prompt.temperature,
                do_sample=True,
                top_p=prompt.top_p
            )

        # Decode response
        reply_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        tokens_generated = len(outputs[0]) - len(inputs.input_ids[0])

        logger.info(f"✅ [LIQUID] Generated {tokens_generated} tokens")

        return {
            "reply": reply_text,
            "model": MODEL_ID,
            "tokens_generated": tokens_generated
        }

    except Exception as e:
        logger.error(f"❌ [LIQUID] Generation failed: {e}")
        return {
            "reply": f"Error generating response: {str(e)}",
            "model": MODEL_ID,
            "tokens_generated": 0
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5050)
