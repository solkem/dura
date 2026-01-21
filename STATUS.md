# Dura Development Status

**Last Updated:** 2026-01-20

## Recent Session Summary

### What Was Accomplished

#### 1. Integrated Nyakupfuya Test into Curator (Option C)
- The Curator now evaluates **both relevance AND accessibility** in a single API call
- Papers are only approved if they pass the Nyakupfuya test
- The Nyakupfuya summary is generated during curation, not after
- **Files:** `src/agents/curator/prompt.ts`, `src/agents/curator/index.ts`

#### 2. Context Caching Infrastructure
- Created `src/agents/utils/cache.ts` - Model instance caching
- Updated Curator and Synthesizer to use caching
- Added feature flag (`USE_CACHING`) for easy toggling
- **Documentation:** `docs/CONTEXT_CACHING.md`

#### 3. Enhanced Synthesizer for Deeper Translations
- Rewrote Synthesizer prompt for rich, multi-section output:
  - **Nyakupfuya:** 3-5 paragraphs with village/farming analogies
  - **Key Concepts:** Term, definition, analogy, importance
  - **Practical Implications:** What can you DO with this?
  - **Learning Path:** Prerequisites, next steps, questions
- Updated UI with new sections and styling
- **Files:** `src/agents/synthesizer/prompt.ts`, `src/agents/synthesizer/index.ts`, `src/components/admin/PaperProcessor.tsx`

#### 4. DeepSeek Fine-Tuning Roadmap
- Created future milestone documentation
- **Documentation:** `docs/DEEPSEEK_FINETUNING.md`

#### 5. Memory System (Added from other machine)
- Agents now log observations as pending memories
- Humans can approve/reject learnings
- **Files:** `src/agents/utils/memory.ts`, `src/pages/admin/memories.astro`

### Deployment Notes

#### Droplet Deployment Script (`~/.dura-secrets` + `dura-container.sh`)
```bash
# ~/.dura-secrets (chmod 600)
GITHUB_TOKEN=ghp_your_token_here
GOOGLE_AI_API_KEY=AIzaSy...your_key_here
```

```bash
# dura-container.sh
#!/bin/bash
source ~/.dura-secrets
echo "$GITHUB_TOKEN" | docker login ghcr.io -u solkem --password-stdin
docker pull ghcr.io/solkem/dura:latest
docker stop dura && docker rm dura
docker run -d --name dura \
  -p 3000:4321 \
  -v /app/data:/app/data \
  -e GOOGLE_AI_API_KEY="$GOOGLE_AI_API_KEY" \
  ghcr.io/solkem/dura:latest
```

**IMPORTANT:** Always `source ~/.dura-secrets` before running the script if running commands manually.

### Bugs Fixed

1. **403 API Key Error:** Model cache was storing models with empty API keys. Fixed by detecting key changes and clearing cache.

2. **Docker Login Denied:** GitHub token expired. Regenerated with `read:packages` and `write:packages` scopes.

---

## Next Steps / TODO

### Immediate
- [ ] Test the enhanced Synthesizer output with different paper types
- [ ] Verify Key Concepts and Learning Path sections render correctly
- [ ] Consider adding "Copy" button for Nyakupfuya summaries

### Short-Term
- [ ] Review and approve pending memories via `/admin/memories`
- [ ] Fine-tune prompts based on quality of generated content
- [ ] Add error handling UI when processing fails

### Medium-Term
- [ ] Implement full Gemini API Context Caching (`@google/genai` package)
- [ ] Begin collecting training data for DeepSeek fine-tuning
- [ ] Add paper search and filtering on admin dashboard

### Long-Term
- [ ] DeepSeek fine-tuning for offline curation
- [ ] Edge deployment of fine-tuned model
- [ ] Public paper browsing interface

---

## Key Architectural Decisions

### Why Integrated Curator (Option C)?
The Nyakupfuya test should be **central** to curation, not an afterthought. If a paper can't be explained to a livestock keeper, it shouldn't be in Dura. Single API call is also more cost-effective.

### Why Enhanced Synthesizer?
A one-paragraph summary isn't enough for Citizen Scientists. They deserve:
- Deep translations of technical concepts
- Rich analogies from their daily lives
- Clear learning paths

### Why Memory System?
To create a feedback loop:
1. AI observes patterns during curation
2. Humans review and approve/reject
3. Approved learnings improve future prompts
4. Eventually: training data for DeepSeek fine-tuning

---

## Production URLs

- **Main Site:** https://dura.disruptiveiot.org
- **Admin Papers:** https://dura.disruptiveiot.org/admin/papers
- **Admin Memories:** https://dura.disruptiveiot.org/admin/memories
