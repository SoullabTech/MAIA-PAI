"""
LIQUID AI TEST - LFM-3B Model (Text Only)
Simpler version for initial testing
"""

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

print("🌊 [LIQUID] Loading LFM-3B model (text-only)...")
print("This may take a few minutes on first run")

model_id = "LiquidAI/LFM2-350M"  # Smallest LFM2 model (Apache 2.0)

try:
    # Load tokenizer
    print("\n1️⃣  Loading tokenizer...")
    tok = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
    print("✅ Tokenizer loaded")

    # Load model
    print("\n2️⃣  Loading model...")
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True
    )
    print("✅ Model loaded")

    # Test prompt
    prompt = "Consciousness as a field is"

    print(f"\n3️⃣  Testing with prompt: '{prompt}'")
    inputs = tok(prompt, return_tensors="pt").to(model.device)

    # Generate
    print("\n4️⃣  Generating response...")
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=80,
            temperature=0.8,
            do_sample=True,
            top_p=0.9
        )

    response = tok.decode(outputs[0], skip_special_tokens=True)

    print("\n🌊 [LIQUID] Response:")
    print("=" * 80)
    print(response)
    print("=" * 80)

    print("\n✅ SUCCESS! Liquid AI model is working.")
    print("Next: Create FastAPI endpoint at http://localhost:5050/liquid")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    print("\nTroubleshooting:")
    print("- Try smaller model: LiquidAI/LFM-350M")
    print("- Check model name on Hugging Face")
