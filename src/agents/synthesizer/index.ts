import { generateJSON } from '../utils/gemini';
import { logAgentCall, startTimer } from '../utils/logger';
import { SYNTHESIZER_PROMPT } from './prompt';

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
        nyakupfuya: string;     // Simplified for rural learners
    };
    relatedPapers: Array<{
        paperId: string;
        relationship: 'builds-upon' | 'implements' | 'extends' | 'enables';
        strength: number;
        explanation: string;
    }>;
    prerequisites: string[];  // Paper IDs that should be read first
}

/**
 * Synthesize a paper - generate summaries and find relationships
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

    const { result, usage } = await generateJSON<SynthesizerOutput>(
        SYNTHESIZER_PROMPT,
        userPrompt
    );

    // Log the API call
    await logAgentCall({
        paperId: input.paper.id,
        agent: 'synthesizer',
        model: 'gemini-2.0-flash-exp',
        tokensIn: usage.tokensIn,
        tokensOut: usage.tokensOut,
        latencyMs: getElapsed(),
    });

    return result;
}
