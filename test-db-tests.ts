
import 'dotenv/config';
import { db } from './src/db';
import { papers } from './src/db/schema';
import { nanoid } from 'nanoid';
import { eq, desc } from 'drizzle-orm';

async function testDbOperations() {
    console.log('Testing DB operations...');

    // 1. Insert
    const id = nanoid();
    try {
        console.log('1. Attempting Insert...');
        await db.insert(papers).values({
            id: id,
            title: 'Test Paper ' + id,
            abstract: 'This is a test abstract',
            synthesizerData: JSON.stringify({ test: true }),
            curatorStatus: 'approved',
            createdAt: new Date().toISOString()
        });
        console.log('✅ Insert successful');
    } catch (e) {
        console.error('❌ Insert failed:', e);
        return; // Stop if insert fails
    }

    // 2. Select (mimic index.astro)
    try {
        console.log('2. Attempting Select...');
        const dbPapers = await db
            .select()
            .from(papers)
            .where(eq(papers.curatorStatus, "approved"))
            .orderBy(desc(papers.createdAt));

        console.log(`✅ Select successful. Found ${dbPapers.length} papers.`);
        if (dbPapers.length > 0) {
            console.log('Sample paper title:', dbPapers[0].title);
            // Verify synthesizerData is readable
            console.log('Sample synthesizerData:', dbPapers[0].synthesizerData || 'NULL');
        }

    } catch (e) {
        console.error('❌ Select failed:', e);
    }

    // Clean up
    await db.delete(papers).where(eq(papers.id, id));
    console.log('🧹 Cleaned up test record');
}

testDbOperations();
