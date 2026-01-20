/**
 * Memory utilities for Nyakupfuya learning system
 * 
 * Provides functions to create pending memories and recall validated memories
 */

import { db } from '../../db';
import { memories } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export type MemoryType = 'episodic' | 'semantic' | 'procedural' | 'reflective';

export interface CreateMemoryInput {
    type: MemoryType;
    content: string;
    confidence?: number;
    sourceAgent: 'curator' | 'synthesizer' | 'tutor' | 'connector';
    evidence?: {
        paperIds?: string[];
        observations?: string[];
    };
}

/**
 * Create a pending memory for human review
 */
export async function createPendingMemory(input: CreateMemoryInput): Promise<string> {
    const id = nanoid();

    try {
        await db.insert(memories).values({
            id,
            type: input.type,
            content: input.content,
            confidence: input.confidence || 0.5,
            status: 'pending',
            sourceAgent: input.sourceAgent,
            evidence: input.evidence ? JSON.stringify(input.evidence) : null,
            createdAt: new Date().toISOString()
        });

        console.log(`[Memory] Created pending memory: ${input.content.slice(0, 50)}...`);
        return id;
    } catch (error) {
        console.error('[Memory] Failed to create memory:', error);
        throw error;
    }
}

/**
 * Recall validated memories by type or all
 */
export async function recallMemories(type?: MemoryType): Promise<Array<{
    id: string;
    type: string;
    content: string;
    confidence: number | null;
}>> {
    let results;

    if (type) {
        results = await db.select({
            id: memories.id,
            type: memories.type,
            content: memories.content,
            confidence: memories.confidence
        })
            .from(memories)
            .where(and(
                eq(memories.status, 'validated'),
                eq(memories.type, type)
            ));
    } else {
        results = await db.select({
            id: memories.id,
            type: memories.type,
            content: memories.content,
            confidence: memories.confidence
        })
            .from(memories)
            .where(eq(memories.status, 'validated'));
    }

    // Update usage tracking
    for (const mem of results) {
        await db.update(memories).set({
            lastUsedAt: new Date().toISOString(),
            useCount: (await db.select().from(memories).where(eq(memories.id, mem.id)))[0]?.useCount || 0 + 1
        }).where(eq(memories.id, mem.id));
    }

    return results;
}

/**
 * Check if a similar memory already exists (avoid duplicates)
 */
export async function memoryExists(content: string): Promise<boolean> {
    const normalized = content.toLowerCase().trim();
    const existing = await db.select().from(memories);

    // Simple similarity check - could be enhanced with embeddings
    return existing.some(mem =>
        mem.content.toLowerCase().includes(normalized.slice(0, 50)) ||
        normalized.includes(mem.content.toLowerCase().slice(0, 50))
    );
}
