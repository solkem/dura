/**
 * Curator Agent
 * 
 * Evaluates papers for:
 * 1. Domain relevance to Dura's focus areas
 * 2. Accessibility to Citizen Scientists (Nyakupfuya test)
 * 
 * Uses context caching to reduce API costs by ~60-80%
 */

import { generateJSONWithCache } from '../utils/cache';
import { generateJSON } from '../utils/gemini';
import { logAgentCall, startTimer } from '../utils/logger';
import { CURATOR_PROMPT } from './prompt';

// Feature flag: Enable context caching
// Set to false to use traditional approach (for debugging)
const USE_CACHING = true;

export interface CuratorInput {
    title: string;
    abstract?: string;
    fullText?: string;
}

export interface CuratorOutput {
    relevanceScore: number;           // 0-1: Domain relevance
    accessibilityScore: number;       // 0-1: Citizen Scientist accessibility
    difficulty: 1 | 2 | 3 | 4 | 5;
    domainTags: string[];
    ecosystemTags: string[];          // ["edgechain", "msingi", "ndani"]
    keyContributions: string[];
    curatorStatus: 'approved' | 'rejected' | 'needs-review';
    curatorNotes: string;
    nyakupfuyaSummary?: string;       // Required for approved papers
}

/**
 * Curate a paper using the Curator agent
 * 
 * Evaluates:
 * - Relevance to Dura's domains
 * - Accessibility to Citizen Scientists
 * - Nyakupfuya test (can it be explained to a livestock keeper?)
 * 
 * Uses context caching when enabled for cost efficiency
 */
export async function curatePaper(input: CuratorInput): Promise<CuratorOutput> {
    const getElapsed = startTimer();

    const userPrompt = `Curate this paper:

Title: ${input.title}

Abstract: ${input.abstract || 'Not provided'}

${input.fullText ? `Full text excerpt: ${input.fullText.slice(0, 2000)}...` : ''}`;

    let result: CuratorOutput;
    let usage: { tokensIn: number; tokensOut: number; cachedTokens?: number };

    if (USE_CACHING) {
        // Use context caching - system prompt is cached
        const response = await generateJSONWithCache<CuratorOutput>(
            'curator',           // Cache name
            CURATOR_PROMPT,      // System prompt (cached)
            userPrompt          // User prompt (sent each time)
        );
        result = response.result;
        usage = response.usage;

        console.log(`[Curator] Cache hit: ${response.usage.cachedTokens} tokens from cache`);
    } else {
        // Traditional approach - full prompt sent each time
        const response = await generateJSON<CuratorOutput>(
            CURATOR_PROMPT,
            userPrompt
        );
        result = response.result;
        usage = response.usage;
    }

    // Log the API call
    await logAgentCall({
        agent: 'curator',
        model: 'gemini-2.0-flash-exp',
        tokensIn: usage.tokensIn,
        tokensOut: usage.tokensOut,
        latencyMs: getElapsed(),
    });

    return result;
}
