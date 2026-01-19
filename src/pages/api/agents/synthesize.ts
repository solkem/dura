import type { APIRoute } from 'astro';
import { synthesizePaper } from '../../../agents/synthesizer';
import { db } from '../../../db';
import { papers } from '../../../db/schema';
import { eq, ne, and } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, locals }) => {
    // Check authentication
    if (!locals.session?.userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const { paperId, title, abstract, domainTags } = body;

        if (!paperId || !title || !abstract) {
            return new Response(JSON.stringify({
                error: 'paperId, title, and abstract are required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get existing papers for relationship analysis
        const existingPapers = await db.select({
            id: papers.id,
            title: papers.title,
            domainTags: papers.domainTags,
        })
            .from(papers)
            .where(
                and(
                    eq(papers.curatorStatus, 'approved'),
                    ne(papers.id, paperId)
                )
            );

        const result = await synthesizePaper({
            paper: {
                id: paperId,
                title,
                abstract,
                domainTags: domainTags || []
            },
            existingPapers: existingPapers.map(p => ({
                ...p,
                domainTags: JSON.parse(p.domainTags || '[]')
            })),
        });

        return new Response(JSON.stringify({ success: true, result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Synthesizer error:', error);
        return new Response(JSON.stringify({
            error: 'Synthesis failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
