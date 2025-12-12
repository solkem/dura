
import type { APIRoute } from 'astro';
import { Parser } from '@orcid/bibtex-parse-js';
import fs from 'node:fs/promises';
import path from 'node:path';

// Heuristic for extracting concepts from text
function extractConcepts(text: string): string[] {
    const concepts = new Set<string>();

    // Core terms mapping
    const keywords = [
        { term: 'ZKP', pattern: /zero[- ]knowledge|zkp|snark|stark/i },
        { term: 'Federated Learning', pattern: /federated learning|fl|collaborative learning/i },
        { term: 'MPC', pattern: /multi[- ]party computation|mpc/i },
        { term: 'Blockchain', pattern: /blockchain|smart contract|ledger/i },
        { term: 'IoT Security', pattern: /iot|device security|embedded/i },
        { term: 'Wallet', pattern: /wallet|key management|custody/i },
        { term: 'Agriculture', pattern: /agri|farm|crop/i }
    ];

    keywords.forEach(kw => {
        if (kw.pattern.test(text)) {
            concepts.add(kw.term);
        }
    });

    return Array.from(concepts);
}

// Generate MDX content
function generateMDX(entry: any, concepts: string[], targetProject?: string, targetSection?: string) {
    const date = new Date().toISOString();
    const slug = entry.citationKey.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const title = entry.entryTags.title ? entry.entryTags.title.replace(/[{}]/g, '') : 'Untitled';
    const abstract = entry.entryTags.abstract ? entry.entryTags.abstract.replace(/[{}]/g, '') : 'No abstract provided.';
    const author = entry.entryTags.author ? entry.entryTags.author.replace(/[{}]/g, '') : 'Unknown';

    // Auto-categorization
    let category = 'Infrastructure';
    if (concepts.includes('ZKP')) category = 'Cryptography';
    if (concepts.includes('Federated Learning')) category = 'Infrastructure';
    if (concepts.includes('Wallet')) category = 'Identity';

    // Apply project filter or auto-detect
    const projectList = targetProject && targetProject !== 'auto'
        ? `"${targetProject}"`
        : concepts.includes('Agriculture') ? '"edgechain"' : '"msingi"';

    const sectionLine = targetSection && targetSection !== 'auto'
        ? `section: "${targetSection}"`
        : '';

    return {
        slug,
        content: `---
title: "${title}"
category: "${category}"
difficulty: "intermediate"
projects: [${projectList}]
${sectionLine}
relatedConcepts: []
lastUpdated: ${date}
updatedBy: "Mendeley Import"
---

## Abstract
${abstract}

## Extracted Concepts
${concepts.map(c => `- ${c}`).join('\n')}

## Metadata
- **Author**: ${author}
- **Citation Key**: ${entry.citationKey}
- **Source**: Mendeley Import
`
    };
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const { bibtex, project, section } = await request.json();
        const entries = Parser(bibtex);

        const createdSlugs = [];
        const contentDir = path.join(process.cwd(), 'src', 'content', 'concepts');

        for (const entry of entries) {
            // Combine title and abstract for better extraction
            const textToCheck = `${entry.entryTags.title || ''} ${entry.entryTags.abstract || ''}`;
            const extracted = extractConcepts(textToCheck);

            // Generate file
            const { slug, content } = generateMDX(entry, extracted, project, section);

            // Only create if it looks relevant (has at least one concept, or force all for now?)
            // For demo: create all valid entries
            if (entry.entryTags.title) {
                const filePath = path.join(contentDir, `${slug}.mdx`);
                await fs.writeFile(filePath, content, 'utf-8');
                createdSlugs.push(slug);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            count: createdSlugs.length,
            slugs: createdSlugs
        }), { status: 200 });

    } catch (error: any) {
        console.error('Import Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), { status: 500 });
    }
}
