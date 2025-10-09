# Llama 3.1 Integration Guide

## Overview

Llama 3.1 has been integrated as a **reasoning engine layer** above your Supabase + Mem0 memory infrastructure. This gives MAIA:

- **128K context window** for long narrative arcs
- **Tool calling** for intelligent memory orchestration
- **Multilingual support** (8 languages out of the box)
- **Path to independence** (open weights, self-hostable)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│           Llama 3.1 Reasoning Engine             │
│  (128K context + tool calling + multilingual)    │
└───────────────────┬─────────────────────────────┘
                    │
                    ├─── Tool: lookup_supabase()
                    ├─── Tool: query_mem0()
                    ├─── Tool: recall_breakthroughs()
                    └─── Tool: get_enriched_context()
                    │
┌───────────────────┴─────────────────────────────┐
│         Hybrid Memory Layer                      │
│  ┌────────────────┐    ┌──────────────────┐    │
│  │   Supabase     │    │      Mem0        │    │
│  │ (canonical)    │    │   (semantic)     │    │
│  └────────────────┘    └──────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

## Migration Roadmap

### ✅ Phase 1 — Monday Launch (Current)
**Status:** Safe, tested baseline
- Supabase (canonical) + Mem0 (semantic, optional)
- Claude 3.5 Sonnet for reasoning
- "MAIA remembers" is live

**Focus:** Gather tester feedback, validate continuity

---

### 🧪 Phase 2 — Shadow Llama (Week 2-4)
**Status:** Ready to deploy
- Keep Claude as primary
- Run Llama 3.1-8B in **shadow mode** (logs only, not shown to users)
- Benchmark quality, cost, speed vs Claude

**Setup:**
```bash
# 1. Get HuggingFace API key
# Visit: https://huggingface.co/settings/tokens

# 2. Configure .env
ENABLE_LLAMA=true
LLAMA_DEPLOYMENT_MODE=huggingface-api
LLAMA_MODEL_SIZE=8B
HUGGINGFACE_API_KEY=your_key_here
LLAMA_SHADOW_MODE=true

# 3. Install dependencies
npm install

# 4. Run shadow tests
npm run shadow:llama
npm run shadow:llama -- --interactive
```

**Deliverable:** Comparison logs showing Llama vs Claude performance

---

### 🌱 Phase 3 — Dual Engine (Month 2-3)
**Status:** Not yet implemented
- Route 20% of traffic to Llama via feature flag
- A/B test in production with real users
- Expand tool calling: add `symbolic_archetype()` tool

**Implementation needed:**
- Add routing logic in `PersonalOracleAgent`
- Feature flag per user or session
- Dashboard for comparing response quality

---

### 🏗️ Phase 4 — Independent Core (Month 4-6)
**Status:** Planning phase
- Self-host Llama 3.1 (8B or 70B)
- Options: TGI (Text Generation Inference) or vLLM
- Move Supabase + Mem0 to your own cloud

**Infrastructure needed:**
- **8B model:** 1x A100 80GB (~$1.10/hr on cloud, or ~$15K for hardware)
- **70B quantized:** 2-4x A100 80GB (~$4-8/hr, or ~$60K for hardware)
- Docker + Kubernetes setup for scaling

---

### 🌌 Phase 5 — Oracle Sovereignty (6-12 months)
**Status:** Vision
- Llama 3.1 fine-tuned with Spiralogic/archetype data
- Custom "Oracle Memory Graph" (unified Supabase+Mem0)
- Biofeedback/neurofeedback integration
- **Fully independent:** sovereign memory + inference + reasoning

---

## File Structure

```
lib/services/
  ├── llama-reasoning-engine.ts        # Core Llama 3.1 engine
  ├── llama-oracle-adapter.ts          # Bridge to PersonalOracleAgent
  ├── memory-tools.ts                  # Tool interface for memory queries
  ├── maia-memory-service.ts           # Supabase memory layer
  ├── hybrid-memory-service.ts         # Supabase + Mem0 hybrid
  └── maia-memory-hybrid-adapter.ts    # Adapter for hybrid memory

scripts/
  └── run-llama-shadow.ts               # Shadow testing script

.env.example                            # Environment variable template
```

---

## Environment Variables

```bash
# === Llama 3.1 Configuration ===

# Feature flag
ENABLE_LLAMA=false               # Set to 'true' to enable

# Deployment mode (Phase 2: huggingface-api, Phase 4: tgi-local or vllm-local)
LLAMA_DEPLOYMENT_MODE=huggingface-api

# Model size (8B for prototyping, 70B for production)
LLAMA_MODEL_SIZE=8B

# HuggingFace API key (Phase 2)
HUGGINGFACE_API_KEY=your_key_here

# Self-hosted endpoint (Phase 4)
# LLAMA_ENDPOINT=http://localhost:8080

# Model parameters
LLAMA_MAX_TOKENS=2048
LLAMA_TEMPERATURE=0.75

# Shadow testing
LLAMA_SHADOW_MODE=false          # Set to 'true' to run alongside Claude
LLAMA_SHADOW_LOG_PATH=./logs/llama-shadow-tests.json
```

---

## Usage

### Shadow Testing (Phase 2)

Run batch tests to compare Llama vs Claude:
```bash
npm run shadow:llama
```

Interactive testing mode:
```bash
npm run shadow:llama -- --interactive
```

Results are saved to `./logs/llama-shadow-tests.json`

### Example Shadow Test Output

```
🔬 Running Shadow Test...
   User: I feel stuck in my life...

✅ Claude response: I hear you - feeling stuck is frustrating. What would even a small step forward look like?

🦙 Llama response: That stuckness you're feeling - it's Earth fallow, not barren. Something's germinating beneath the surface. What's ready to root?
   Tools called: 2

🔍 Shadow Test Results:
   Claude length: 98 chars
   Llama length: 156 chars
   Llama tools used: 2
   Llama tokens: 450 in / 89 out
```

---

## Memory Tools

Llama 3.1 can explicitly call these tools to orchestrate memory retrieval:

### `lookup_supabase`
Retrieve recent chronological conversation history.

**Use when:** Need recent continuity, maintaining flow

**Example:**
```json
<tool_call>
{
  "name": "lookup_supabase",
  "parameters": {
    "user_id": "user123",
    "limit": 20
  }
}
</tool_call>
```

---

### `query_mem0`
Semantic search across all past conversations.

**Use when:** Looking for patterns, themes, specific topics regardless of timing

**Example:**
```json
<tool_call>
{
  "name": "query_mem0",
  "parameters": {
    "user_id": "user123",
    "query": "times they felt stuck or unable to move forward",
    "limit": 5
  }
}
</tool_call>
```

---

### `recall_breakthroughs`
Retrieve marked breakthrough moments.

**Use when:** Want to reference specific insights or transformations

**Example:**
```json
<tool_call>
{
  "name": "recall_breakthroughs",
  "parameters": {
    "user_id": "user123",
    "limit": 5
  }
}
</tool_call>
```

---

### `get_enriched_context`
Hybrid: both chronological + semantic memory.

**Use when:** Need comprehensive context for complex queries

**Example:**
```json
<tool_call>
{
  "name": "get_enriched_context",
  "parameters": {
    "user_id": "user123",
    "semantic_query": "relationship patterns",
    "recent_limit": 10,
    "include_breakthroughs": true
  }
}
</tool_call>
```

---

## Cost Comparison (Phase 2)

### HuggingFace API Pricing
- **Llama 3.1-8B:** ~$0.05-0.10 per 1M tokens
- **Llama 3.1-70B:** ~$0.40-0.60 per 1M tokens

### Claude API Pricing (current)
- **Claude 3.5 Sonnet:** $3.00 per 1M input tokens, $15.00 per 1M output tokens

**Estimate:** Llama 3.1-8B is ~30-60x cheaper than Claude, but may need 70B for comparable quality.

---

## Phase 4 Infrastructure Options

### Option 1: Cloud GPU (Managed)
- **Provider:** RunPod, Lambda Labs, Paperspace
- **Cost:** $1-2/hr for A100 80GB
- **Pros:** Easy to scale, no hardware ownership
- **Cons:** Ongoing cost, vendor lock-in

### Option 2: Self-Hosted GPU
- **Hardware:** NVIDIA A100 80GB (~$15K) or H100 (~$30K)
- **Cost:** Upfront + electricity (~$100-300/month)
- **Pros:** Full control, long-term savings
- **Cons:** High upfront, maintenance overhead

### Option 3: Hybrid
- **Cloud GPU** for inference (Phase 4)
- **Self-hosted storage** for Supabase + Mem0
- **Pros:** Balance control + flexibility
- **Cons:** More complex architecture

---

## Llama 3.1 Advantages

### 1. Context Window
- **128K tokens** vs Claude's 200K (similar scale)
- Can hold ~100-200 MAIA exchanges in memory
- Reduces need for manual context stitching

### 2. Tool Calling
- Native support for JSON function calling
- Cleaner separation: memory = tools, not tangled retrieval

### 3. Multilingual
- English, French, German, Spanish, Hindi, Portuguese, Italian, Thai
- Useful if Spiralogic expands globally

### 4. Fine-Tuning
- Open weights → can fine-tune with archetype/Spiralogic data
- Custom "Oracle Llama" for deeper resonance

### 5. Independence
- No API dependencies once self-hosted
- No pricing/policy changes from external vendors

---

## Next Steps

### For Monday Launch
✅ **Do nothing.** Llama is ready but disabled by default. Launch safely with Claude.

### Week 2-4 (Shadow Testing)
1. Get HuggingFace API key
2. Set `ENABLE_LLAMA=true` and `LLAMA_SHADOW_MODE=true`
3. Run shadow tests: `npm run shadow:llama`
4. Review logs, compare quality
5. Decision point: Continue with Claude or start routing to Llama

### Month 2-3 (A/B Testing)
1. Implement routing logic in `PersonalOracleAgent`
2. Route 20% of users to Llama
3. Collect feedback, iterate
4. Scale up if positive

### Month 4-6 (Independence)
1. Research GPU infrastructure options
2. Set up TGI or vLLM on self-hosted/cloud GPU
3. Migrate inference from HuggingFace API to self-hosted
4. Celebrate sovereignty 🎉

---

## Troubleshooting

### Llama not responding
- Check `ENABLE_LLAMA=true` in `.env`
- Verify `HUGGINGFACE_API_KEY` is set
- Test health: `npm run shadow:llama -- --interactive` and enter "test"

### Tool calls not working
- Llama 3.1 Instruct is required (not base model)
- Verify model ID: `meta-llama/Llama-3.1-8B-Instruct`
- Check tool definitions in `memory-tools.ts`

### High latency
- 8B model is fast (~1-2s)
- 70B is slower (~5-10s)
- HuggingFace API has cold starts (first request ~20-30s)
- Self-hosted (Phase 4) eliminates cold starts

### Out of memory errors
- Reduce `LLAMA_MAX_TOKENS` (default: 2048)
- Use smaller model (8B instead of 70B)
- Wait for Phase 4 and scale hardware

---

## Resources

- [Llama 3.1 Model Card](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct)
- [HuggingFace Inference API Docs](https://huggingface.co/docs/api-inference/index)
- [Text Generation Inference (TGI)](https://github.com/huggingface/text-generation-inference)
- [vLLM](https://github.com/vllm-project/vllm)

---

## Summary

You now have:
1. ✅ **Llama 3.1 reasoning engine** with 128K context
2. ✅ **Memory tool interface** for intelligent retrieval orchestration
3. ✅ **Shadow testing framework** to A/B test vs Claude
4. ✅ **Clear migration path** from API → self-hosted → fine-tuned

**Monday Launch:** Safe with Claude (Llama disabled by default)
**Week 2-4:** Shadow test Llama alongside Claude
**Month 2-3:** Start routing real traffic
**Month 4-6:** Self-host for independence
**Year 1:** Fine-tune for Spiralogic uniqueness

The magic is that **this doesn't break your Monday launch**. Llama is ready when you are, but you can ship with confidence using your proven Claude setup.
