import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { memories } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

/**
 * POST /api/memories/[id]/reject
 * Reject a pending memory (admin only)
 */
export const POST: APIRoute = async ({ params, request, locals }) => {
    // Admin only
    if (!locals.user || locals.user.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Admin access required' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { id } = params;
    if (!id) {
        return new Response(JSON.stringify({ error: 'Memory ID required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Get optional review notes from body
        let reviewNotes = '';
        try {
            const body = await request.json();
            reviewNotes = body.notes || '';
        } catch {
            // No body is fine
        }

        // Check memory exists
        const existing = await db.select().from(memories).where(eq(memories.id, id)).limit(1);
        if (existing.length === 0) {
            return new Response(JSON.stringify({ error: 'Memory not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Update to rejected
        await db.update(memories).set({
            status: 'rejected',
            reviewedBy: locals.user.id,
            reviewedAt: new Date().toISOString(),
            reviewNotes
        }).where(eq(memories.id, id));

        return new Response(JSON.stringify({
            success: true,
            message: 'Memory rejected'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Reject memory error:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to reject memory'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
