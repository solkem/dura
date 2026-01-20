# DeepSeek Fine-Tuning Roadmap

This document outlines the plan to fine-tune DeepSeek for Dura's curation and synthesis needs.

## Why DeepSeek?

1. **Open Weights** - Full access to model weights, can fine-tune freely
2. **Cost Effective** - No per-request API costs once self-hosted
3. **Edge-First** - Aligns with Dura's offline-first philosophy
4. **Privacy** - Papers processed locally, no external API calls
5. **Performance** - DeepSeek-V3 competes with GPT-4 on benchmarks

## Current State vs Target

| Aspect | Current (Gemini API) | Target (DeepSeek Fine-tuned) |
|--------|---------------------|------------------------------|
| Cost per paper | ~$0.001-0.01 | ~$0 (self-hosted) |
| Latency | 2-5 seconds | <1 second (local GPU) |
| Context window | 1M tokens | 64K tokens |
| Nyakupfuya knowledge | In prompt (sent every time) | Embedded in model weights |
| Offline capability | ❌ Requires internet | ✅ Fully offline |

## Prerequisites

### Hardware Requirements
- **Minimum**: 24GB VRAM GPU (RTX 3090/4090, A5000)
- **Recommended**: 48GB+ VRAM (A6000, multiple GPUs)
- **Alternative**: Cloud GPU (RunPod, Lambda Labs, ~$1-2/hour)

### Training Data Requirements
- Minimum 100-500 high-quality examples
- Format: `{paper_abstract, expected_curation_output}`
- Include both approved AND rejected papers with reasons

## Implementation Phases

### Phase 1: Data Collection (Current)
**Status**: In Progress

The memory system we built automatically collects:
- Papers processed with curation results
- Rejection reasons and patterns
- Ecosystem/domain correlations

**Goal**: Collect 500+ curated papers with human-verified outputs

### Phase 2: Training Data Preparation
**Status**: Not Started

1. Export approved memories from database
2. Format as JSONL training examples:
```json
{"messages": [
  {"role": "system", "content": "You are the Curator for Dura..."},
  {"role": "user", "content": "Curate this paper: [abstract]"},
  {"role": "assistant", "content": "{relevanceScore: 0.85, ...}"}
]}
```
3. Split into train/validation sets (80/20)

### Phase 3: Fine-Tuning
**Status**: Not Started

Options:
1. **Local Fine-Tuning** (if you have GPU)
   - Use Hugging Face + PEFT/LoRA for efficient training
   - ~4-8 hours on single GPU

2. **Cloud Fine-Tuning** (RunPod/Lambda)
   - Rent GPU for training session
   - ~$20-50 per training run

```bash
# Example using unsloth (efficient fine-tuning)
pip install unsloth
python finetune.py \
  --model deepseek-ai/deepseek-llm-7b-chat \
  --data training_data.jsonl \
  --output dura-curator-v1
```

### Phase 4: Deployment
**Status**: Not Started

Options:
1. **Local Server** (on Droplet with GPU)
   - Run model with vLLM or llama.cpp
   - Expose as API endpoint

2. **Edge Deployment** (future)
   - Quantize model (4-bit/8-bit)
   - Run on Ndani edge hardware

3. **Hybrid** (recommended)
   - Self-hosted DeepSeek for most requests
   - Fallback to Gemini API for complex cases

## Architecture Change

```
CURRENT:
┌─────────┐     ┌─────────────┐
│  Dura   │ ──→ │ Gemini API  │ (cloud, paid)
└─────────┘     └─────────────┘

FUTURE:
┌─────────┐     ┌─────────────────────┐
│  Dura   │ ──→ │ DeepSeek (local)    │ (free, offline)
└─────────┘     └─────────────────────┘
                         │
                         ↓ fallback
                ┌─────────────┐
                │ Gemini API  │ (complex cases only)
                └─────────────┘
```

## Cost Savings Projection

| Scale | Gemini API | DeepSeek Self-Hosted | Savings |
|-------|------------|---------------------|---------|
| 1,000 papers/month | ~$10 | ~$50/mo server | -$40 |
| 10,000 papers/month | ~$100 | ~$50/mo server | $50 |
| 100,000 papers/month | ~$1,000 | ~$100/mo server | $900 |

Break-even: ~5,000 papers/month

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Data Collection | Ongoing | Memory system ✅ |
| Phase 2: Data Preparation | 1-2 days | 500+ curated papers |
| Phase 3: Fine-Tuning | 1-2 days | GPU access, training data |
| Phase 4: Deployment | 2-3 days | Server with GPU or optimized model |

**Estimated Total**: 1-2 weeks of focused work (after data collection)

## Success Metrics

1. **Accuracy**: Fine-tuned model matches Gemini curation 90%+ of time
2. **Nyakupfuya Quality**: Human reviewers rate summaries as "good" 80%+ 
3. **Latency**: <1 second per paper (vs 2-5s with API)
4. **Cost**: <$0.001 per paper (vs ~$0.01 with API)

## Next Steps

1. ☐ Continue data collection via memory system
2. ☐ Monitor approved memories count (target: 500)
3. ☐ Research GPU options (local vs cloud)
4. ☐ Create training data export script
5. ☐ Set up fine-tuning environment

## Resources

- [DeepSeek Models](https://github.com/deepseek-ai/DeepSeek-LLM)
- [Unsloth - Efficient Fine-tuning](https://github.com/unslothai/unsloth)
- [vLLM - Fast Inference](https://github.com/vllm-project/vllm)
- [RunPod - GPU Rental](https://www.runpod.io/)
