import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { memories } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const prerender = false;

/**
 * GET /api/memories?status=pending|validated|rejected|all
 * List memories filtered by status
 */
export const GET: APIRoute = async ({ url, locals }) => {
    // Admin only
    if (!locals.user || locals.user.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Admin access required' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const status = url.searchParams.get('status') || 'pending';

    let results;
    if (status === 'all') {
        results = await db.select().from(memories).orderBy(desc(memories.createdAt));
    } else {
        results = await db.select().from(memories)
            .where(eq(memories.status, status))
            .orderBy(desc(memories.createdAt));
    }

    return new Response(JSON.stringify({ memories: results }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

/**
 * POST /api/memories
 * Create a new pending memory (typically called by agents)
 */
export const POST: APIRoute = async ({ request, locals }) => {
    // Must be authenticated
    if (!locals.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const { type, content, confidence, sourceAgent, evidence } = body;

        if (!type || !content) {
            return new Response(JSON.stringify({ error: 'type and content are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const id = nanoid();
        await db.insert(memories).values({
            id,
            type,
            content,
            confidence: confidence || 0.5,
            status: 'pending',
            sourceAgent: sourceAgent || null,
            evidence: evidence ? JSON.stringify(evidence) : null,
            createdAt: new Date().toISOString()
        });

        return new Response(JSON.stringify({
            success: true,
            id,
            message: 'Memory created as pending. Awaiting admin review.'
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Create memory error:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to create memory'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
