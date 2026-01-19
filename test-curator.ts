/**
 * Quick test script for the Curator agent
 * Run with: npx tsx test-curator.ts
 */
import 'dotenv/config';

// Check API key
if (!process.env.GOOGLE_AI_API_KEY) {
    console.error('❌ GOOGLE_AI_API_KEY not found in .env');
    process.exit(1);
}

console.log('✓ API key found');
console.log('Testing Curator agent...\n');

// Import the curator
import { curatePaper } from './src/agents/curator/index.js';

const testPaper = {
    title: "Kachina: Foundations of Private Smart Contracts",
    abstract: `Smart contracts present a uniform approach for deploying distributed computation and have become a popular means to develop security critical applications. A major barrier to adoption for many applications is the public nature of existing systems, such as Ethereum. Several systems satisfying various definitions of privacy and requiring various trust assumptions have been proposed; however, none achieved the universality and uniformity that Ethereum achieved for non-private contracts: One unified method to construct most contracts.`
};

console.log('Paper:', testPaper.title);
console.log('---\n');

try {
    const result = await curatePaper(testPaper);

    console.log('✓ Curator Response:');
    console.log(JSON.stringify(result, null, 2));

    // Validate the response structure  
    const checks = [
        ['relevanceScore', typeof result.relevanceScore === 'number'],
        ['difficulty', typeof result.difficulty === 'number'],
        ['domainTags', Array.isArray(result.domainTags)],
        ['curatorStatus', ['approved', 'rejected', 'needs-review'].includes(result.curatorStatus)],
    ];

    console.log('\n--- Validation ---');
    for (const [field, valid] of checks) {
        console.log(`${valid ? '✓' : '❌'} ${field}`);
    }

} catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
}
