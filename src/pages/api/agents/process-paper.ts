import type { APIRoute } from 'astro';
import { curatePaper } from '../../../agents/curator';
import { synthesizePaper } from '../../../agents/synthesizer';
import { db } from '../../../db';
import { papers, paperRelations } from '../../../db/schema';
import { eq, ne, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

/**
 * Full paper processing pipeline:
 * 1. Curate (evaluate relevance, difficulty, tags)
 * 2. Synthesize (generate summaries, find relationships)
 * 3. Save everything to the database
 */
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
        const { paperId, title, abstract, fullText, authors, year, venue, bibtex } = body;

        if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const id = paperId || nanoid();

        // Step 1: Curate
        const curatorResult = await curatePaper({ title, abstract, fullText });

        if (curatorResult.curatorStatus === 'rejected') {
            return new Response(JSON.stringify({
                status: 'rejected',
                paperId: id,
                curator: curatorResult,
                message: 'Paper rejected by curator'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Step 2: Get existing papers for synthesis
        const existingPapers = await db.select({
            id: papers.id,
            title: papers.title,
            domainTags: papers.domainTags,
        })
            .from(papers)
            .where(
                and(
                    eq(papers.curatorStatus, 'approved'),
                    ne(papers.id, id)
                )
            );

        // Step 3: Synthesize
        const synthesizerResult = await synthesizePaper({
            paper: {
                id,
                title,
                abstract: abstract || '',
                domainTags: curatorResult.domainTags
            },
            existingPapers: existingPapers.map(p => ({
                ...p,
                domainTags: JSON.parse(p.domainTags || '[]')
            })),
        });

        // Step 4: Insert or update paper record
        const existingPaper = await db.select().from(papers).where(eq(papers.id, id)).limit(1);

        const paperData = {
            id,
            title,
            authors: authors ? JSON.stringify(authors) : null,
            year: year || null,
            venue: venue || null,
            abstract: abstract || null,
            bibtex: bibtex || null,
            relevanceScore: curatorResult.relevanceScore,
            difficulty: curatorResult.difficulty,
            domainTags: JSON.stringify(curatorResult.domainTags),
            ecosystemTags: JSON.stringify(curatorResult.ecosystemTags),
            curatorStatus: curatorResult.curatorStatus,
            curatorNotes: curatorResult.curatorNotes,
            summaryOneLiner: synthesizerResult.summaries.oneLiner,
            summaryParagraph: synthesizerResult.summaries.paragraph,
            summaryNyakupfuya: synthesizerResult.summaries.nyakupfuya,
            prerequisites: JSON.stringify(synthesizerResult.learningPath?.prerequisites || []),
            synthesizerData: JSON.stringify(synthesizerResult),
            processedAt: new Date().toISOString(),
        };

        if (existingPaper.length > 0) {
            await db.update(papers).set(paperData).where(eq(papers.id, id));
        } else {
            await db.insert(papers).values({
                ...paperData,
                createdAt: new Date().toISOString(),
            });
        }

        // Step 5: Save paper relations
        for (const rel of synthesizerResult.relatedPapers) {
            // Verify target paper exists
            const targetExists = await db.select({ id: papers.id })
                .from(papers)
                .where(eq(papers.id, rel.paperId))
                .limit(1);

            if (targetExists.length > 0) {
                await db.insert(paperRelations).values({
                    id: nanoid(),
                    sourcePaperId: id,
                    targetPaperId: rel.paperId,
                    relationship: rel.relationship,
                    strength: rel.strength,
                    explanation: rel.explanation,
                    createdAt: new Date().toISOString(),
                });
            }
        }

        return new Response(JSON.stringify({
            status: 'success',
            paperId: id,
            curator: curatorResult,
            synthesizer: synthesizerResult,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Process paper error:', error);
        return new Response(JSON.stringify({
            error: 'Processing failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
