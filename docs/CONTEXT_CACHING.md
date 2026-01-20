# Context Caching in Dura

This document explains how Dura uses caching to reduce Gemini API costs.

## Current Implementation

Dura currently uses **Model Instance Caching** - reusing configured model objects across requests. This provides moderate efficiency gains by avoiding repeated model configuration.

### Upgrade Path: Full API Caching

For maximum cost savings (~60-80%), Dura can be upgraded to use Gemini's **Context Caching API**. This requires:

```bash
npm install @google/genai
```

Then update `src/agents/utils/cache.ts` to use the `GoogleGenAI` client with `client.caches.create()`.

See [Gemini Context Caching Docs](https://ai.google.dev/gemini-api/docs/caching) for details.

## The Problem

Every time we curate a paper, we send the full system prompt to Gemini:

```
Request 1: [800 token system prompt] + [500 token paper abstract] = 1300 input tokens
Request 2: [800 token system prompt] + [600 token paper abstract] = 1400 input tokens
Request 3: [800 token system prompt] + [450 token paper abstract] = 1250 input tokens
...
```

The system prompt (Curator instructions, Nyakupfuya test criteria, etc.) never changes, but we pay for it every single request.

## The Solution: Context Caching

With context caching, we pay for the system prompt **once** and reuse it:

```
Cache creation: [800 token system prompt] → Cached!
Request 1: [cached] + [500 token paper abstract] = 500 input tokens
Request 2: [cached] + [600 token paper abstract] = 600 input tokens
Request 3: [cached] + [450 token paper abstract] = 450 input tokens
...
```

### Cost Comparison

| Scenario | Without Caching | With Caching | Savings |
|----------|-----------------|--------------|---------|
| 10 papers | 13,000 tokens | 5,800 tokens | 55% |
| 100 papers | 130,000 tokens | 50,800 tokens | 61% |
| 1,000 papers | 1,300,000 tokens | 500,800 tokens | 61% |

## How It Works

### 1. Cache Creation (Automatic)

When the first paper is processed, we create a cache:

```typescript
const cache = await client.caches.create({
  model: 'gemini-2.0-flash-exp',
  config: {
    displayName: 'dura-curator',
    systemInstruction: CURATOR_PROMPT,
    ttl: '3600s',  // 1 hour
  }
});
```

### 2. Using the Cache

Subsequent requests reference the cache:

```typescript
const response = await client.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: paperAbstract,    // Only the new content
  config: {
    cachedContent: cache.name,  // Reference the cached system prompt
  }
});
```

### 3. Cache Expiration

Caches have a TTL (Time To Live). When they expire, they're automatically recreated on the next request.

## Implementation in Dura

### Cache Utility (`src/agents/utils/cache.ts`)

```typescript
// Get or create a cache
const cache = await getOrCreateCache('curator', CURATOR_PROMPT);

// Generate content using the cache
const { result, usage } = await generateJSONWithCache<CuratorOutput>(
  'curator',
  CURATOR_PROMPT,
  userPrompt
);

// Check cache usage
console.log(`Cached tokens used: ${usage.cachedTokens}`);
```

### Feature Flag

Each agent has a `USE_CACHING` flag for easy toggling:

```typescript
// In src/agents/curator/index.ts
const USE_CACHING = true;  // Set to false to disable caching
```

### Cache Names

| Agent | Cache Name | System Prompt |
|-------|------------|---------------|
| Curator | `curator` | CURATOR_PROMPT |
| Synthesizer | `synthesizer` | SYNTHESIZER_PROMPT |

## Cache Management

### Viewing Active Caches

```typescript
import { listCaches } from '../utils/cache';

const caches = await listCaches();
console.log(caches);
// ['dura-curator: cachedContents/abc123', 'dura-synthesizer: cachedContents/def456']
```

### Clearing Caches

When you update a system prompt, clear the cache:

```typescript
import { clearCache, clearAllCaches } from '../utils/cache';

// Clear a specific cache
await clearCache('curator');

// Clear all caches
await clearAllCaches();
```

## TTL Configuration

The default TTL is 1 hour. Adjust based on usage patterns:

```typescript
// In src/agents/utils/cache.ts
const DEFAULT_TTL_SECONDS = 3600;  // 1 hour

// For high-volume processing
const DEFAULT_TTL_SECONDS = 86400;  // 24 hours

// For development/testing
const DEFAULT_TTL_SECONDS = 300;  // 5 minutes
```

### TTL Trade-offs

| TTL | Storage Cost | Cache Hits | Best For |
|-----|--------------|------------|----------|
| Short (5m) | Low | Fewer | Development, testing |
| Medium (1h) | Medium | Moderate | Normal usage |
| Long (24h) | Higher | Many | High-volume processing |

## Billing

Context caching billing has three components:

1. **Cache token count**: Tokens cached (paid at reduced rate)
2. **Storage duration**: How long tokens are stored (based on TTL)
3. **Non-cached tokens**: New content in each request (normal rate)

See [Gemini Pricing](https://ai.google.dev/pricing) for current rates.

## Monitoring

The usage metadata includes cache-specific information:

```typescript
const response = await generateWithCache('curator', prompt, content);

console.log({
  inputTokens: response.usage.tokensIn,      // New tokens sent
  outputTokens: response.usage.tokensOut,    // Tokens generated
  cachedTokens: response.usage.cachedTokens, // Tokens from cache
});
```

## Troubleshooting

### Cache Not Being Used

Check that:
1. `USE_CACHING = true` in the agent
2. Cache TTL hasn't expired
3. System prompt matches exactly

### Cache Creation Fails

- Ensure API key has caching permissions
- Check that model supports caching
- Verify minimum token count (varies by model)

### Inconsistent Results

If results seem different after enabling caching:
1. Verify the cached system prompt is correct
2. Clear the cache: `await clearCache('curator')`
3. Check for any prompt differences

## Best Practices

1. **Use appropriate TTL**: Match TTL to your usage patterns
2. **Clear caches when updating prompts**: System prompt changes require cache refresh
3. **Monitor cache hits**: Check `cachedTokens` in usage metadata
4. **Log cache operations**: Help debug caching issues
5. **Feature flag**: Always have a way to disable caching for debugging

## References

- [Gemini Context Caching Documentation](https://ai.google.dev/gemini-api/docs/caching)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [Dura Agent Architecture](./DURA_AGENTIC_MIGRATION.md)
