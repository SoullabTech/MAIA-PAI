"""
LIQUID AI TEST - LFM2-VL-3B Model
Tests the Vision-Language model for MAIA integration
"""

from transformers import AutoModel, AutoProcessor
import torch

print("🌊 [LIQUID] Loading LFM2-VL-3B model...")
print("This may take a few minutes on first run (downloading ~6GB model)")

model_id = "LiquidAI/LFM2-VL-3B"

try:
    # Load processor (for vision-language models, use processor instead of tokenizer)
    print("\n1️⃣  Loading processor...")
    processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)
    print("✅ Processor loaded")

    # Load model - VL models use AutoModel not AutoModelForCausalLM
    print("\n2️⃣  Loading model (this is the slow part)...")
    model = AutoModel.from_pretrained(
        model_id,
        dtype=torch.float16,  # Updated parameter name
        device_map="auto",
        trust_remote_code=True  # LiquidAI models need this
    )
    print("✅ Model loaded")

    # Test prompt - something MAIA-relevant
    prompt = "Describe consciousness as a field of presence rather than a computational process."

    print(f"\n3️⃣  Testing with prompt: '{prompt}'")
    inputs = processor(text=prompt, return_tensors="pt").to(model.device)

    # Generate response
    print("\n4️⃣  Generating response...")
    outputs = model.generate(
        **inputs,
        max_new_tokens=100,
        temperature=0.7,
        do_sample=True
    )

    response = processor.batch_decode(outputs, skip_special_tokens=True)[0]

    print("\n🌊 [LIQUID] Response:")
    print("=" * 80)
    print(response)
    print("=" * 80)

    print("\n✅ SUCCESS! Liquid AI model is working.")
    print("Next step: Create FastAPI endpoint at http://localhost:5050/liquid")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nTroubleshooting:")
    print("- Make sure you have enough RAM (model needs ~6-8GB)")
    print("- Try the smaller model: LiquidAI/LFM-350M")
    print("- Check Hugging Face is accessible")
