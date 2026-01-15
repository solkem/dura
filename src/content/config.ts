import { defineCollection, z } from 'astro:content';

// ============================================================================
// NEW: Learn collection (domain-organized content for Dura)
// ============================================================================
const learn = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        type: z.enum(['concept', 'protocol', 'implementation', 'case-study']),
        domain: z.enum(['midnight', 'federated-learning', 'iot-edge', 'agentic-ai']),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),
        tier: z.enum(['free', 'premium']).default('free'),
        description: z.string().optional(),
        tags: z.array(z.string()).default([]),
        prerequisites: z.array(z.string()).default([]),
        related: z.array(z.string()).default([]),
        references: z.array(z.string()).default([]),
        lastUpdated: z.coerce.date(),
        updatedBy: z.string(),
        // Keep some legacy fields for compatibility
        shortTitle: z.string().optional(),
        projects: z.array(z.enum(['edgechain', 'msingi', 'ndani'])).default([]),
        externalLinks: z.array(z.object({
            label: z.string(),
            url: z.string().url()
        })).default([])
    })
});

// ============================================================================
// NEW: Papers collection (research paper metadata as JSON)
// ============================================================================
const papers = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        authors: z.array(z.object({
            name: z.string(),
            orcid: z.string().optional(),
        })),
        year: z.number(),
        venue: z.string().optional(),
        doi: z.string().optional(),
        arxivId: z.string().optional(),
        bibtex: z.string(),
        tags: z.array(z.string()).default([]),
        domain: z.string().optional(),
        abstract: z.string().optional(),
    })
});

// ============================================================================
// LEGACY: Keep existing collections for backward compatibility
// ============================================================================
const concepts = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        shortTitle: z.string().optional(),
        timestamp: z.string().optional(),
        projects: z.array(z.enum(['edgechain', 'msingi', 'ndani'])).default([]),
        category: z.enum([
            'cryptography',
            'economics',
            'identity',
            'compliance',
            'infrastructure'
        ]),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
        section: z.enum(['background', 'methodology', 'evaluation', 'discussion', 'related_work']).optional(),
        lastUpdated: z.coerce.date(),
        updatedBy: z.string(),
        relatedConcepts: z.array(z.string()).default([]),
        // Traceability Fields
        conflictsWith: z.array(z.string()).default([]),
        evolvedFrom: z.array(z.string()).default([]),
        dependsOn: z.array(z.string()).default([]),
        externalLinks: z.array(z.object({
            label: z.string(),
            url: z.string().url()
        })).default([])
    })
});

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        tagline: z.string(),
        status: z.enum(['research', 'development', 'pilot', 'production']),
        repo: z.string().url().optional(),
        team: z.array(z.object({
            name: z.string(),
            role: z.string()
        })),
        lastUpdated: z.coerce.date(),
        updatedBy: z.string()
    })
});

const updates = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        author: z.string(),
        project: z.enum(['edgechain', 'msingi', 'ndani', 'platform', 'all']),
        type: z.enum(['research', 'implementation', 'documentation', 'review'])
    })
});

const protocols = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        acronym: z.string(),
        purpose: z.string(),
        guarantees: z.array(z.enum(["PG1", "PG2", "PG3", "PG4", "PG5", "PG6", "EG1", "EG2", "EG3", "EG4"])).optional(),
        adversaries: z.array(z.enum(["A_gov", "A_corp", "A_gw", "A_free", "A_grief", "A_sybil"])).optional(),
        lastUpdated: z.coerce.date(),
        updatedBy: z.string()
    })
});

const questions = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        area: z.enum([
            "Incentive Design",
            "Security Proofs",
            "Economic Modeling",
            "Related Work",
            "Broader Impact"
        ]),
        context: z.string()
    })
});

const stories = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        persona: z.string().default("Nyakupfuya"),
        threat: z.string(),
        protection: z.string()
    })
});

export const collections = {
    learn,      // NEW: Domain-organized learning content
    papers,     // NEW: Research paper metadata
    concepts,   // LEGACY: Keep for backward compatibility
    projects,
    updates,
    protocols,
    questions,
    stories
};
