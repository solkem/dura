import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    email: text('email'),
    role: text('role').notNull().default('public'), // 'public', 'researcher', 'contributor', 'admin'
    createdAt: integer('created_at').notNull().default(Date.now())
});

export const sessions = sqliteTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: integer('expires_at').notNull()
});

export const userProgress = sqliteTable('user_progress', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => users.id),
    contentSlug: text('content_slug').notNull(),
    status: text('status').notNull(), // 'read', 'in_progress'
    updatedAt: integer('updated_at').notNull()
});

export const userStars = sqliteTable('user_stars', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => users.id),
    paperSlug: text('paper_slug').notNull(),
    createdAt: integer('created_at').notNull()
});

export const invitations = sqliteTable('invitation', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    role: text('role').notNull().default('researcher'), // 'researcher', 'contributor'
    invitedBy: text('invited_by').references(() => users.id),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at').notNull(),
    usedAt: integer('used_at') // null if unused
});

// ============================================================================
// AGENTIC AI TABLES
// ============================================================================

/**
 * Papers table - stores paper metadata + agent-generated fields
 */
export const papers = sqliteTable('papers', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    authors: text('authors'),              // JSON array of author objects
    year: integer('year'),
    venue: text('venue'),
    doi: text('doi'),
    arxivId: text('arxiv_id'),
    abstract: text('abstract'),
    bibtex: text('bibtex'),
    tags: text('tags'),                    // JSON array
    domain: text('domain'),

    // Agent-generated fields (Curator)
    relevanceScore: real('relevance_score'),
    difficulty: integer('difficulty'),      // 1-5
    domainTags: text('domain_tags'),       // JSON array
    ecosystemTags: text('ecosystem_tags'), // JSON array: edgechain, msingi, ndani
    curatorStatus: text('curator_status').default('pending'), // pending, approved, rejected, needs-review
    curatorNotes: text('curator_notes'),

    // Agent-generated fields (Synthesizer)
    summaryOneLiner: text('summary_one_liner'),
    summaryParagraph: text('summary_paragraph'),
    summaryNyakupfuya: text('summary_nyakupfuya'),
    prerequisites: text('prerequisites'),   // JSON array of paper IDs

    // Metadata
    processedAt: text('processed_at'),
    createdAt: text('created_at').default(new Date().toISOString())
});

/**
 * Paper relations - knowledge graph edges between papers
 */
export const paperRelations = sqliteTable('paper_relations', {
    id: text('id').primaryKey(),
    sourcePaperId: text('source_paper_id').references(() => papers.id),
    targetPaperId: text('target_paper_id').references(() => papers.id),
    relationship: text('relationship'),     // builds-upon, implements, extends, enables
    strength: real('strength'),
    explanation: text('explanation'),
    createdAt: text('created_at').default(new Date().toISOString())
});

/**
 * Agent logs - tracks API usage for cost monitoring
 */
export const agentLogs = sqliteTable('agent_logs', {
    id: text('id').primaryKey(),
    paperId: text('paper_id'),
    agent: text('agent'),                   // curator, synthesizer, tutor, connector
    model: text('model'),
    tokensIn: integer('tokens_in'),
    tokensOut: integer('tokens_out'),
    latencyMs: integer('latency_ms'),
    createdAt: text('created_at').default(new Date().toISOString())
});

// ============================================================================
// NYAKUPFUYA MEMORY SYSTEM
// ============================================================================

/**
 * Memories table - stores learned patterns from agent interactions
 * Human-in-the-loop: all memories start as 'pending' and require approval
 */
export const memories = sqliteTable('memories', {
    id: text('id').primaryKey(),
    type: text('type').notNull(),           // episodic, semantic, procedural, reflective
    content: text('content').notNull(),     // The learned pattern/observation
    confidence: real('confidence').notNull().default(0.5),
    status: text('status').notNull().default('pending'), // pending, validated, rejected, archived

    // Evidence chain
    sourceAgent: text('source_agent'),      // curator, synthesizer, tutor, connector
    evidence: text('evidence'),             // JSON: { paperIds: [], observations: [] }

    // Approval workflow
    reviewedBy: text('reviewed_by').references(() => users.id),
    reviewedAt: text('reviewed_at'),
    reviewNotes: text('review_notes'),

    // Metadata
    createdAt: text('created_at').default(new Date().toISOString()),
    lastUsedAt: text('last_used_at'),       // For memory decay tracking
    useCount: integer('use_count').default(0)
});

