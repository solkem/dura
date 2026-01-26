
import 'dotenv/config';
import { extractPdfText, prepareForAnalysis } from './src/agents/utils/pdf-extract';
import { curatePaper } from './src/agents/curator';
import { synthesizePaper } from './src/agents/synthesizer';
import { db } from './src/db';
import { papers } from './src/db/schema';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

async function testPipeline() {
    console.log('🚀 Starting Full Pipeline Test...');

    // 1. Load a real PDF
    const pdfPath = './papers/26-Jan/ssrn-4499732.pdf'; // Use one of the new papers
    if (!fs.existsSync(pdfPath)) {
        console.error(`❌ PDF not found at ${pdfPath}`);
        return;
    }

    try {
        console.log(`\n📄 Processing: ${pdfPath}`);
        const buffer = fs.readFileSync(pdfPath);

        // 2. Extract Text
        console.log('   Extracting text...');
        const extractedPaper = await extractPdfText(buffer);
        console.log(`   ✓ Extracted ${extractedPaper.pageCount} pages, ${extractedPaper.wordCount} words`);

        const analysisContent = prepareForAnalysis(extractedPaper);
        const title = extractedPaper.title || "Test Pipeline Paper";

        // 3. Curator
        console.log('\n🕵️  Running Curator...');
        const curatorResult = await curatePaper({
            title,
            abstract: analysisContent.slice(0, 5000) // Simulate what we send
        });
        console.log(`   ✓ Curator Status: ${curatorResult.curatorStatus}`);

        if (curatorResult.curatorStatus === 'rejected') {
            console.log('   ⚠️ Paper rejected by curator. Stopping pipeline (this is valid behavior).');
            return;
        }

        // 4. Synthesizer
        console.log('\n🧠 Running Synthesizer...');
        const paperId = nanoid(12);
        const synthesizerResult = await synthesizePaper({
            paper: {
                id: paperId,
                title,
                abstract: analysisContent.slice(0, 5000),
                domainTags: curatorResult.domainTags
            },
            existingPapers: []
        });
        console.log('   ✓ Synthesizer finished');

        // 5. Database Save
        console.log('\n💾 Saving to Database...');
        await db.insert(papers).values({
            id: paperId,
            title,
            abstract: extractedPaper.abstract || analysisContent.slice(0, 2000),
            curatorStatus: 'approved',
            relevanceScore: curatorResult.relevanceScore,
            accessibilityScore: curatorResult.accessibilityScore,
            difficulty: curatorResult.difficulty,
            domainTags: JSON.stringify(curatorResult.domainTags),
            ecosystemTags: JSON.stringify(curatorResult.ecosystemTags),
            curatorNotes: curatorResult.curatorNotes,
            synthesizerData: JSON.stringify(synthesizerResult),
            createdAt: new Date().toISOString(),
        });
        console.log(`   ✓ Saved paper with ID: ${paperId}`);

        console.log('\n✅ Pipeline Test SUCCESS!');

    } catch (error) {
        console.error('\n❌ Pipeline FAILED:', error);
    }
}

testPipeline();
