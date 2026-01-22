/**
 * Synthesizer Agent
 * 
 * Generates summaries and finds relationships between papers.
 * Uses context caching to reduce API costs.
 */

import { generateJSONWithCache } from '../utils/cache';
import { generateJSON } from '../utils/gemini';
import { logAgentCall, startTimer } from '../utils/logger';
import { createPendingMemory } from '../utils/memory';
import { SYNTHESIZER_PROMPT } from './prompt';

// Feature flag: Enable context caching
const USE_CACHING = true;

export interface SynthesizerInput {
    paper: {
        id: string;
        title: string;
        abstract: string;
        domainTags: string[];
    };
    existingPapers: Array<{
        id: string;
        title: string;
        domainTags: string[];
    }>;
}

export interface SynthesizerOutput {
    summaries: {
        oneLiner: string;       // <100 chars, punchy
        paragraph: string;      // 2-3 sentences
        nyakupfuya: string;     // Rich, multi-paragraph explanation with analogies
    };
    keyConcepts?: Array<{
        term: string;
        simpleDefinition: string;
        analogy: string;
        whyItMatters: string;
    }>;
    practicalImplications?: string[];
    learningPath?: {
        prerequisites: string[];
        nextSteps: string[];
        questions: string[];
    };
    relatedPapers: Array<{
        paperId: string;
        relationship: 'builds-upon' | 'implements' | 'extends' | 'enables';
        strength: number;
        explanation: string;
    }>;
}

/**
 * Synthesize a paper - generate summaries and find relationships
 * 
 * Uses context caching when enabled for cost efficiency
 */
export async function synthesizePaper(input: SynthesizerInput): Promise<SynthesizerOutput> {
    const getElapsed = startTimer();

    const userPrompt = `Synthesize this paper:

NEW PAPER:
- ID: ${input.paper.id}
- Title: ${input.paper.title}
- Abstract: ${input.paper.abstract}
- Domain tags: ${input.paper.domainTags.join(', ')}

EXISTING PAPERS IN THE LIBRARY:
${input.existingPapers.length > 0
            ? input.existingPapers.map(p => `- ID: ${p.id}, Title: ${p.title}, Tags: ${p.domainTags.join(', ')}`).join('\n')
            : 'No existing papers yet.'
        }

Generate summaries (especially a good nyakupfuya!) and identify any relationships with existing papers.`;

    let result: SynthesizerOutput;
    let usage: { tokensIn: number; tokensOut: number; cachedTokens?: number };

    if (USE_CACHING) {
        // Use context caching
        const response = await generateJSONWithCache<SynthesizerOutput>(
            'synthesizer',
            SYNTHESIZER_PROMPT,
            userPrompt
        );
        result = response.result;
        usage = response.usage;

        console.log(`[Synthesizer] Cache hit: ${response.usage.cachedTokens} tokens from cache`);
    } else {
        // Traditional approach
        const response = await generateJSON<SynthesizerOutput>(
            SYNTHESIZER_PROMPT,
            userPrompt
        );
        result = response.result;
        usage = response.usage;
    }

    // Log the API call
    await logAgentCall({
        paperId: input.paper.id,
        agent: 'synthesizer',
        model: 'gemini-2.5-flash-lite',
        tokensIn: usage.tokensIn,
        tokensOut: usage.tokensOut,
        latencyMs: getElapsed(),
    });

    // Learn from synthesis patterns
    if (ENABLE_MEMORY_LEARNING) {
        await learnFromSynthesis(input, result);
    }

    return result;
}

// Feature flag: Enable automatic memory creation
const ENABLE_MEMORY_LEARNING = true;

/**
 * Extract learnings from synthesis results and create pending memories
 */
async function learnFromSynthesis(input: SynthesizerInput, result: SynthesizerOutput): Promise<void> {
    try {
        // Pattern 1: Key concepts that need explanation
        if (result.keyConcepts && result.keyConcepts.length > 0) {
            for (const concept of result.keyConcepts.slice(0, 2)) { // Limit to top 2
                const observation = `Term "${concept.term}" explained as: "${concept.simpleDefinition}". Analogy: "${concept.analogy}"`;

                await createPendingMemory({
                    type: 'semantic',
                    content: observation,
                    confidence: 0.6,
                    sourceAgent: 'synthesizer',
                    evidence: {
                        paperIds: [input.paper.id],
                        observations: [concept.whyItMatters]
                    }
                });
            }
        }

        // Pattern 2: Good nyakupfuya patterns (if summary is rich)
        if (result.summaries.nyakupfuya && result.summaries.nyakupfuya.length > 500) {
            const firstParagraph = result.summaries.nyakupfuya.split('\n\n')[0] || '';
            const observation = `Rich Nyakupfuya pattern for domain "${input.paper.domainTags.join(', ')}": "${firstParagraph.slice(0, 200)}..."`;

            await createPendingMemory({
                type: 'procedural',
                content: observation,
                confidence: 0.5,
                sourceAgent: 'synthesizer',
                evidence: {
                    paperIds: [input.paper.id]
                }
            });
        }

        // Pattern 3: Paper relationships for knowledge graph
        if (result.relatedPapers && result.relatedPapers.length > 0) {
            for (const rel of result.relatedPapers) {
                const observation = `Paper "${input.paper.title.slice(0, 40)}..." ${rel.relationship} "${rel.paperId}" (${Math.round(rel.strength * 100)}% strength): ${rel.explanation}`;

                await createPendingMemory({
                    type: 'episodic',
                    content: observation,
                    confidence: rel.strength,
                    sourceAgent: 'synthesizer',
                    evidence: {
                        paperIds: [input.paper.id, rel.paperId]
                    }
                });
            }
        }

    } catch (error) {
        // Don't fail synthesis if memory creation fails
        console.error('[Synthesizer] Memory learning failed:', error);
    }
}
