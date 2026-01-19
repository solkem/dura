import { db } from '../../db';
import { agentLogs } from '../../db/schema';
import { nanoid } from 'nanoid';

export interface AgentLogEntry {
    paperId?: string;
    agent: 'curator' | 'synthesizer' | 'tutor' | 'connector';
    model: string;
    tokensIn: number;
    tokensOut: number;
    latencyMs: number;
}

/**
 * Log an agent API call for cost tracking and debugging
 */
export async function logAgentCall(entry: AgentLogEntry): Promise<void> {
    try {
        await db.insert(agentLogs).values({
            id: nanoid(),
            paperId: entry.paperId || null,
            agent: entry.agent,
            model: entry.model,
            tokensIn: entry.tokensIn,
            tokensOut: entry.tokensOut,
            latencyMs: entry.latencyMs,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        // Log to console but don't fail the main operation
        console.error('Failed to log agent call:', error);
    }
}

/**
 * Helper to measure execution time
 */
export function startTimer(): () => number {
    const start = Date.now();
    return () => Date.now() - start;
}
