import type { APIRoute } from 'astro';

// This endpoint commits new MDX files to GitHub via the Contents API
// Requires GITHUB_TOKEN environment variable with 'repo' scope

export const prerender = false;

interface GitHubContentResponse {
    content: { sha: string };
    commit: { sha: string; html_url: string };
}

// Heuristic for extracting concepts from text
function extractConcepts(text: string): string[] {
    const concepts = new Set<string>();
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
        if (kw.pattern.test(text)) concepts.add(kw.term);
    });
    return Array.from(concepts);
}

// Generate MDX content from BibTeX entry
function generateMDX(entry: any, concepts: string[], targetProject?: string) {
    const date = new Date().toISOString().split('T')[0];
    const slug = entry.citationKey?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'untitled';
    const title = entry.entryTags?.title?.replace(/[{}]/g, '') || 'Untitled';
    const abstract = entry.entryTags?.abstract?.replace(/[{}]/g, '') || 'No abstract provided.';
    const author = entry.entryTags?.author?.replace(/[{}]/g, '') || 'Unknown';

    let category = 'infrastructure';
    if (concepts.includes('ZKP')) category = 'cryptography';
    if (concepts.includes('Wallet')) category = 'identity';

    const project = targetProject && targetProject !== 'auto'
        ? targetProject
        : concepts.includes('Agriculture') ? 'edgechain' : 'ndani';

    return {
        slug,
        content: `---
title: "${title}"
category: "${category}"
difficulty: "intermediate"
projects: ["${project}"]
relatedConcepts: []
lastUpdated: ${date}
updatedBy: "Research Import"
---

## Abstract
${abstract}

## Extracted Concepts
${concepts.map(c => `- ${c}`).join('\n')}

## Metadata
- **Author**: ${author}
- **Citation Key**: ${entry.citationKey || 'unknown'}
- **Source**: Automated Import
`
    };
}

// Simple BibTeX parser (for basic entries)
function parseBibtex(bibtex: string): any[] {
    const entries: any[] = [];
    const regex = /@(\w+)\{([^,]+),([^@]*)/g;
    let match;

    while ((match = regex.exec(bibtex)) !== null) {
        const entryType = match[1];
        const citationKey = match[2].trim();
        const fieldsStr = match[3];

        const entryTags: Record<string, string> = {};
        const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g;
        let fieldMatch;

        while ((fieldMatch = fieldRegex.exec(fieldsStr)) !== null) {
            entryTags[fieldMatch[1].toLowerCase()] = fieldMatch[2];
        }

        entries.push({ entryType, citationKey, entryTags });
    }

    return entries;
}

export const POST: APIRoute = async ({ request }) => {
    const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
    const GITHUB_OWNER = import.meta.env.GITHUB_OWNER || 'solkem';
    const GITHUB_REPO = import.meta.env.GITHUB_REPO || 'edgechain-msingi-ndani';
    const GITHUB_BRANCH = import.meta.env.GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN) {
        return new Response(JSON.stringify({
            success: false,
            error: "GITHUB_TOKEN environment variable is not set. Please add it in your Vercel dashboard."
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { bibtex, project } = await request.json();

        if (!bibtex || typeof bibtex !== 'string') {
            return new Response(JSON.stringify({
                success: false,
                error: "Please provide valid BibTeX content."
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const entries = parseBibtex(bibtex);

        if (entries.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: "No valid BibTeX entries found."
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const createdFiles: string[] = [];
        const commitUrls: string[] = [];

        for (const entry of entries) {
            const textToCheck = `${entry.entryTags?.title || ''} ${entry.entryTags?.abstract || ''}`;
            const extracted = extractConcepts(textToCheck);
            const { slug, content } = generateMDX(entry, extracted, project);

            const filePath = `src/content/concepts/${slug}.mdx`;
            const encodedContent = Buffer.from(content).toString('base64');

            // Create file via GitHub API
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json',
                        'X-GitHub-Api-Version': '2022-11-28'
                    },
                    body: JSON.stringify({
                        message: `feat(content): add research concept "${entry.entryTags?.title?.substring(0, 50) || slug}"`,
                        content: encodedContent,
                        branch: GITHUB_BRANCH
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                console.error('GitHub API Error:', error);
                // Continue with other entries even if one fails
                continue;
            }

            const result: GitHubContentResponse = await response.json();
            createdFiles.push(slug);
            if (result.commit?.html_url) {
                commitUrls.push(result.commit.html_url);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: `Created ${createdFiles.length} concept(s). Vercel will auto-deploy in ~2 minutes.`,
            files: createdFiles,
            commits: commitUrls
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Import Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'An unexpected error occurred.'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
