# CLAUDE.md — Dura: The Knowledge Granary

> **TL;DR**: Research/education platform. Astro + React + Hono + PostgreSQL. Rebrand from "Midnight Learning Hub" to "Dura". Domain: dura.dev

## Quick Reference

| Key | Value |
|-----|-------|
| **Repo** | `solkem/edgechain-msingi-ndani` → rename to `solkem/dura` |
| **Live** | edgechain-msingi-ndani.fly.dev → dura.dev |
| **Stack** | Astro 4 + React 18 + TypeScript + Tailwind + Hono + PostgreSQL |
| **Lead** | Solomon Hopewell Kembo (@solkem) |
| **Ecosystem** | baeIoT (Blockchain × AI × Edge × IoT) |

## Identity

**Dura** (Shona: "Granary") — stores knowledge like a granary stores harvest. Part of Ubuntu philosophy: community resources freely shared.

```css
/* Brand Colors */
--dura-primary: #b45309;     /* amber-600 */
--dura-bg: #1c1917;          /* stone-900 */
--dura-concept: #0ea5e9;     /* sky-500 */
--dura-protocol: #8b5cf6;    /* violet-500 */
--dura-impl: #10b981;        /* emerald-500 */
--dura-case-study: #f97316;  /* orange-500 */
--dura-research: #ec4899;    /* pink-500 */
```

## Architecture

```
DURA
├── PUBLIC (/learn)
│   ├── /midnight     ← ZKP, Compact, BRACE, ACR
│   ├── /fl           ← Federated Learning (future)
│   ├── /iot          ← IoT & Edge (future)
│   └── /agents       ← Agentic AI (future)
│
├── PREMIUM (/library) — Paywall
│   └── Papers, annotations, reading lists
│
└── COLLABORATE (/workspaces) — Auth + Invite
    └── Shared drafts, reviews, research notes
```

## Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Framework | Astro 4 (hybrid) | Static + SSR islands |
| UI | React 18 + shadcn/ui | TypeScript strict |
| Styling | Tailwind CSS | Stone/amber palette |
| Content | MDX + Content Collections | Type-safe frontmatter |
| API | Hono | Lightweight, edge-ready |
| DB | PostgreSQL + Drizzle ORM | Type-safe queries |
| Cache | Redis (Upstash) | Sessions, rate limits |
| Search | Meilisearch | Full-text, typo-tolerant |
| Auth | Lucia Auth | GitHub/Google OAuth |
| Storage | Cloudflare R2 | PDFs, uploads |
| Payments | Stripe | Premium tier |
| Hosting | Fly.io | Edge deployment |
| CMS | Decap CMS | Git-backed, `/admin` |

## Directory Structure

```
dura/
├── src/
│   ├── pages/
│   │   ├── learn/[domain]/[type]/[slug].astro
│   │   ├── library/[...path].astro
│   │   ├── workspaces/[id]/[...path].astro
│   │   ├── api/[...route].ts
│   │   └── auth/*.astro
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── content/         # ContentCard, TOC, Nav
│   │   ├── papers/          # BibTexImporter, Viewer
│   │   ├── collab/          # DraftEditor, Comments
│   │   └── mdx/             # Callout, CodeBlock, Formula
│   ├── content/
│   │   └── learn/
│   │       └── midnight/
│   │           ├── concepts/
│   │           ├── protocols/
│   │           └── implementations/
│   ├── lib/
│   │   ├── db/              # Drizzle schema + queries
│   │   ├── auth/            # Lucia config
│   │   ├── api/             # Hono routes
│   │   └── search/          # Meilisearch client
│   └── layouts/
├── public/admin/config.yml  # Decap CMS
├── drizzle/                 # Migrations
└── docker-compose.yml       # Local services
```

## Data Models

```typescript
// src/lib/db/schema.ts
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['free', 'premium', 'collaborator', 'admin'] }).default('free'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const papers = pgTable('papers', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  authors: text('authors').array(),
  doi: text('doi'),
  bibtex: text('bibtex'),
  pdfUrl: text('pdf_url'),
  uploaderId: text('uploader_id').references(() => users.id),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const progress = pgTable('progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  contentSlug: text('content_slug').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
});

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## API Routes

```typescript
// src/lib/api/index.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const api = new Hono()
  .basePath('/api')
  
  // Auth
  .get('/auth/session', async (c) => { /* ... */ })
  .post('/auth/logout', async (c) => { /* ... */ })
  
  // Progress
  .get('/progress', async (c) => { /* ... */ })
  .post('/progress/:slug/complete', async (c) => { /* ... */ })
  
  // Papers
  .get('/papers', async (c) => { /* ... */ })
  .post('/papers', zValidator('json', paperSchema), async (c) => { /* ... */ })
  .post('/papers/import-bibtex', async (c) => { /* ... */ })
  
  // Search
  .get('/search', async (c) => { /* ... */ })
  
  // Workspaces
  .get('/workspaces', async (c) => { /* ... */ })
  .post('/workspaces', async (c) => { /* ... */ })
  .post('/workspaces/:id/invite', async (c) => { /* ... */ });

export default api;
export type ApiType = typeof api;
```

## Content Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const contentSchema = z.object({
  title: z.string(),
  description: z.string(),
  domain: z.enum(['midnight', 'fl', 'iot', 'agents']),
  type: z.enum(['concept', 'protocol', 'implementation', 'case-study', 'research']),
  tier: z.enum(['free', 'premium']).default('free'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  prerequisites: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  authors: z.array(z.string()),
  publishedAt: z.date(),
  updatedAt: z.date().optional(),
  estimatedTime: z.number(), // minutes
  references: z.array(z.string()).optional(),
});

export const collections = {
  learn: defineCollection({ type: 'content', schema: contentSchema }),
};
```

## MDX Components

```tsx
// Available in all MDX files
<Callout type="info|warning|danger|success">Content</Callout>
<Definition term="ZKP">Zero-Knowledge Proof explanation</Definition>
<Formula latex="E = mc^2" />
<CodePlayground language="compact" />
<Quiz questions={[...]} />
<ConceptGraph nodes={[...]} />
<Prerequisites slugs={['zkp-basics', 'commitment-schemes']} />
<References ids={['nakamoto2008', 'buterin2014']} />
```

## Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build               # Production build
pnpm preview             # Preview build

# Database
pnpm db:generate         # Generate migrations
pnpm db:migrate          # Run migrations
pnpm db:studio           # Drizzle Studio

# Search
pnpm search:index        # Rebuild Meilisearch index

# Deploy
pnpm deploy              # Deploy to Fly.io
```

## Environment Variables

```bash
# .env
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
MEILISEARCH_URL="http://localhost:7700"
MEILISEARCH_KEY="..."
AUTH_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
PUBLIC_SITE_URL="https://dura.dev"
```

## Migration Checklist (from edgechain-msingi-ndani)

### Phase 1: Rebrand (Week 1-2)
- [ ] Rename repo to `dura`
- [ ] Update `package.json` name/description
- [ ] Replace "Midnight Learning" → "Dura" in all files
- [ ] Update color scheme: purple → amber/stone
- [ ] Update favicon, OG images, logo
- [ ] Configure dura.dev domain

### Phase 2: Infrastructure (Week 3-4)
- [ ] Set up PostgreSQL on Fly.io
- [ ] Configure Drizzle ORM + migrations
- [ ] Set up Redis (Upstash)
- [ ] Implement Lucia Auth
- [ ] Configure Meilisearch

### Phase 3: Core Features (Week 5-8)
- [ ] Progress tracking system
- [ ] Full-text search
- [ ] Paper management + BibTeX import
- [ ] Premium tier gating

### Phase 4: Collaboration (Week 9-12)
- [ ] Workspaces
- [ ] Draft editor
- [ ] Comments/annotations
- [ ] Invitations

### Phase 5: Monetization (Week 13-16)
- [ ] Stripe integration
- [ ] Premium content access
- [ ] Usage analytics

## File Migration Map

```
CURRENT → TARGET
src/content/concepts/ → src/content/learn/midnight/concepts/
src/pages/concepts/[slug].astro → src/pages/learn/[domain]/[type]/[slug].astro
src/components/ConceptCard.astro → src/components/content/ContentCard.tsx

KEEP AS-IS
src/components/InteractiveFAQ.tsx
src/components/ProjectBadge.tsx
public/admin/config.yml (update collections)

DELETE
vercel.json (Fly.io only)
```

## Ecosystem Context

| Platform | Role | Audience |
|----------|------|----------|
| Disruptive IoT | Industry analysis | Investors, employers |
| EdgeChain Insights | Building in public | Funders, community |
| **Dura** | Technical education | Developers, researchers |

**Content decision**: Industry trends → Disruptive IoT | Project journey → EdgeChain Insights | **How it works → Dura**

## Code Style

```typescript
// Prefer Result types
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

// Prefer composition
const withAuth = (handler: Handler) => async (c: Context) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: 'Unauthorized' }, 401);
  return handler(c);
};

// Prefer explicit over implicit
interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

// Prefer early returns
if (!user) return null;
if (!hasAccess) return <Paywall />;
return <Content />;
```

## AI Agent Instructions

When working on Dura:

1. **TypeScript strict mode** — No `any`, explicit return types
2. **Astro hybrid mode** — Use `export const prerender = false` for dynamic pages
3. **Shadcn/ui** — Prefer existing components, extend with Tailwind
4. **Drizzle** — Use typed queries, avoid raw SQL
5. **Hono** — Zod validation on all inputs
6. **MDX** — Keep frontmatter complete, use content collections

## References

- [Astro Docs](https://docs.astro.build)
- [Hono Docs](https://hono.dev)
- [Drizzle Docs](https://orm.drizzle.team)
- [Lucia Auth](https://lucia-auth.com)
- [Midnight Docs](https://docs.midnight.network)

---

*"Let knowledge flow like grain from the granary — freely to those who need it, carefully stored for future harvests."*

**Last Updated:** January 2026
