
import 'dotenv/config';
import { db } from './src/db';
import { papers } from './src/db/schema';
import { nanoid } from 'nanoid';

async function testInsert() {
    console.log('Testing DB insert...');
    try {
        const id = nanoid();
        await db.insert(papers).values({
            id: id,
            title: 'Test Paper ' + id,
            abstract: 'This is a test abstract',
            synthesizerData: JSON.stringify({ test: true }),
            curatorStatus: 'approved',
            createdAt: new Date().toISOString()
        });
        console.log('✅ Insert successful');

        // Clean up
        // await db.delete(papers).where(eq(papers.id, id));
    } catch (e) {
        console.error('❌ Insert failed:', e);
    }
}

testInsert();
