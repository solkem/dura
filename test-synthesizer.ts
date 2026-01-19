/**
 * Quick test script for the Synthesizer agent
 * Run with: npx tsx test-synthesizer.ts
 */
import 'dotenv/config';

// Check API key
if (!process.env.GOOGLE_AI_API_KEY) {
    console.error('❌ GOOGLE_AI_API_KEY not found in .env');
    process.exit(1);
}

console.log('✓ API key found');
console.log('Testing Synthesizer agent...\n');

import { synthesizePaper } from './src/agents/synthesizer/index.js';

const testPaper = {
    paper: {
        id: 'test-kachina-2021',
        title: "Kachina: Foundations of Private Smart Contracts",
        abstract: `Smart contracts present a uniform approach for deploying distributed computation and have become a popular means to develop security critical applications. A major barrier to adoption for many applications is the public nature of existing systems, such as Ethereum. Several systems satisfying various definitions of privacy and requiring various trust assumptions have been proposed; however, none achieved the universality and uniformity that Ethereum achieved for non-private contracts: One unified method to construct most contracts.`,
        domainTags: ["blockchain", "privacy", "zkp", "cryptography"]
    },
    existingPapers: [
        {
            id: 'gabizon-plonk',
            title: 'PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge',
            domainTags: ['zkp', 'cryptography']
        }
    ]
};

console.log('Paper:', testPaper.paper.title);
console.log('Existing papers:', testPaper.existingPapers.length);
console.log('---\n');

try {
    const result = await synthesizePaper(testPaper);

    console.log('✓ Synthesizer Response:\n');

    console.log('📝 ONE-LINER:');
    console.log(`   "${result.summaries.oneLiner}"\n`);

    console.log('📄 PARAGRAPH:');
    console.log(`   ${result.summaries.paragraph}\n`);

    console.log('🐄 NYAKUPFUYA (Livestock Keeper Test):');
    console.log(`   ${result.summaries.nyakupfuya}\n`);

    console.log('🔗 RELATED PAPERS:', result.relatedPapers.length);
    for (const rel of result.relatedPapers) {
        console.log(`   - ${rel.paperId}: ${rel.relationship} (strength: ${rel.strength})`);
    }

    console.log('\n📚 PREREQUISITES:', result.prerequisites.length);
    for (const prereq of result.prerequisites) {
        console.log(`   - ${prereq}`);
    }

} catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
}
