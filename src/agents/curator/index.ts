import { generateJSON } from '../utils/gemini';
import { logAgentCall, startTimer } from '../utils/logger';
import { CURATOR_PROMPT } from './prompt';

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
 * Evaluates relevance, difficulty, and ecosystem fit
 */
export async function curatePaper(input: CuratorInput): Promise<CuratorOutput> {
    const getElapsed = startTimer();

    const userPrompt = `Curate this paper:

Title: ${input.title}

Abstract: ${input.abstract || 'Not provided'}

${input.fullText ? `Full text excerpt: ${input.fullText.slice(0, 2000)}...` : ''}`;

    const { result, usage } = await generateJSON<CuratorOutput>(
        CURATOR_PROMPT,
        userPrompt
    );

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
