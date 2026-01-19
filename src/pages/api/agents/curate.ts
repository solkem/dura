import type { APIRoute } from 'astro';
import { curatePaper } from '../../../agents/curator';

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
        const { title, abstract, fullText } = body;

        if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await curatePaper({ title, abstract, fullText });

        return new Response(JSON.stringify({ success: true, result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Curator error:', error);
        return new Response(JSON.stringify({
            error: 'Curation failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
