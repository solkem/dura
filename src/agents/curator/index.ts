/**
 * Curator Agent
 * 
 * Evaluates papers for:
 * 1. Domain relevance to Dura's focus areas
 * 2. Accessibility to Citizen Scientists (Nyakupfuya test)
 * 
 * Uses context caching to reduce API costs by ~60-80%
 * Automatically logs observations as pending memories
 */

import { generateJSONWithCache } from '../utils/cache';
import { generateJSON } from '../utils/gemini';
import { logAgentCall, startTimer } from '../utils/logger';
import { createPendingMemory, memoryExists } from '../utils/memory';
import { CURATOR_PROMPT } from './prompt';

// Feature flag: Enable context caching
// Set to false to use traditional approach (for debugging)
const USE_CACHING = true;

// Feature flag: Enable automatic memory creation
const ENABLE_MEMORY_LEARNING = true;

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
 * Creates pending memories for notable observations
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

    // Learn from this curation (create pending memories for notable patterns)
    if (ENABLE_MEMORY_LEARNING) {
        await learnFromCuration(input, result);
    }

    return result;
}

/**
 * Extract learnings from curation results and create pending memories
 */
async function learnFromCuration(input: CuratorInput, result: CuratorOutput): Promise<void> {
    try {
        // Pattern 1: Rejected papers with specific reasons
        if (result.curatorStatus === 'rejected' && result.curatorNotes) {
            const observation = `Paper "${input.title.slice(0, 50)}..." was rejected. Reason: ${result.curatorNotes}`;

            // Only create if not already logged
            if (!(await memoryExists(result.curatorNotes))) {
                await createPendingMemory({
                    type: 'episodic',
                    content: observation,
                    confidence: 0.6,
                    sourceAgent: 'curator',
                    evidence: {
                        observations: [result.curatorNotes]
                    }
                });
            }
        }

        // Pattern 2: High relevance + low accessibility (common research paper issue)
        if (result.relevanceScore > 0.7 && result.accessibilityScore < 0.4) {
            const observation = `Paper has high relevance (${(result.relevanceScore * 100).toFixed(0)}%) but low accessibility (${(result.accessibilityScore * 100).toFixed(0)}%). Domain: ${result.domainTags.join(', ')}`;

            if (!(await memoryExists('high relevance low accessibility'))) {
                await createPendingMemory({
                    type: 'semantic',
                    content: observation,
                    confidence: 0.5,
                    sourceAgent: 'curator',
                    evidence: {
                        observations: [observation]
                    }
                });
            }
        }

        // Pattern 3: Ecosystem tag patterns
        if (result.ecosystemTags.length > 0 && result.curatorStatus === 'approved') {
            const observation = `Paper tagged with ecosystem: ${result.ecosystemTags.join(', ')}. Domain tags: ${result.domainTags.join(', ')}. This combination was approved.`;

            // Log ecosystem-domain correlations
            await createPendingMemory({
                type: 'semantic',
                content: observation,
                confidence: 0.5,
                sourceAgent: 'curator',
                evidence: {
                    observations: [`Ecosystem: ${result.ecosystemTags.join(', ')}`, `Domains: ${result.domainTags.join(', ')}`]
                }
            });
        }

    } catch (error) {
        // Don't fail curation if memory creation fails
        console.error('[Curator] Memory learning failed:', error);
    }
}

