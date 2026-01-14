# CLAUDE.md — Dura: The Knowledge Granary

**Last Updated:** January 2026  
**Status:** Rebranding & Migration Phase  
**Lead:** Solomon Hopewell Kembo (@solkem)  
**Parent Ecosystem:** baeIoT (Blockchain × AI × Edge × IoT)

---

## ⚠️ MIGRATION CONTEXT

This document guides the transformation of the **existing** `edgechain-msingi-ndani` codebase into **Dura**.

### Current State (What Exists NOW)

| Attribute | Current Value |
|-----------|---------------|
| **Repo** | `solkem/edgechain-msingi-ndani` |
| **Live Site** | https://edgechain-msingi-ndani.fly.dev/ |
| **Branding** | "Midnight Learning Hub" / "🌙 Midnight Learning" |
| **Stack** | Astro 4.x + React 18 + MDX + Tailwind CSS |
| **CMS** | Decap CMS (Git-backed) at `/admin` |
| **Hosting** | Fly.io (primary), Vercel config also exists |
| **Auth** | GitHub OAuth (for CMS only) |
| **Content** | 3 concepts (zkp, federated-learning, trustless-architecture), 3 project pages |
| **Features** | Concept cards, project badges, FAQ, request-access page |

### Target State (What We're Building)

| Attribute | Target Value |
|-----------|--------------|
| **Repo** | `solkem/dura` (rename or new repo) |
| **Domain** | dura.dev |
| **Branding** | "Dura — The Knowledge Granary" |
| **Stack** | Astro 4.x + React 18 + MDX + Tailwind + **Hono API** + **PostgreSQL** |
| **CMS** | Decap CMS (keep) + Custom admin for premium |
| **Hosting** | Fly.io |
| **Auth** | Lucia Auth (full user accounts, not just CMS) |
| **Features** | Search, progress tracking, paper management, collaboration, payments |

---

## Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Dura (Shona: "Granary") |
| **Tagline** | "The Knowledge Granary" |
| **Domain** | dura.dev (target), currently edgechain-msingi-ndani.fly.dev |
| **Platform** | Astro + MDX + React + Hono |
| **Purpose** | Industry-grade resource for scientific discovery, collaboration, and publication |
| **Audience** | Researchers, developers, academics, industry practitioners |

### Why "Dura"?

- **Agricultural metaphor**: Granary stores harvest → Dura stores knowledge
- **Ubuntu philosophy**: Granaries are community resources — knowledge should be shared
- **Scalable identity**: Not tied to one project; can house any research domain
- **Memorable**: 4 letters, globally pronounceable, available as .dev domain

### Brand Colors (Replaces Current Purple/Midnight Theme)

```css
/* CURRENT (to replace) */
:root {
  /* midnight-900 background, purple-500 accents, emerald/amber/cyan project colors */
}

/* NEW Dura Theme */
:root {
  /* Dura Primary - Deep Amber/Gold (Knowledge, Harvest) */
  --dura-primary: #b45309;        /* amber-600 */
  --dura-primary-light: #f59e0b;  /* amber-500 */
  --dura-primary-dark: #92400e;   /* amber-700 */
  
  /* Dura Background - Warm Neutrals */
  --dura-bg: #1c1917;             /* stone-900 */
  --dura-bg-subtle: #292524;      /* stone-800 */
  --dura-surface: #44403c;        /* stone-700 */
  
  /* Dura Text */
  --dura-text: #fafaf9;           /* stone-50 */
  --dura-text-muted: #d6d3d1;     /* stone-300 */
  
  /* Accent Colors for Content Types */
  --dura-concept: #0ea5e9;        /* sky-500 - Concepts */
  --dura-protocol: #8b5cf6;       /* violet-500 - Protocols */
  --dura-implementation: #10b981; /* emerald-500 - Implementations */
  --dura-case-study: #f97316;     /* orange-500 - Case Studies */
  --dura-research: #ec4899;       /* pink-500 - Research */
  
  /* Keep existing project colors for continuity */
  --project-edgechain: #059669;   /* emerald-600 */
  --project-msingi: #d97706;      /* amber-600 */
  --project-ndani: #0891b2;       /* cyan-600 */
}
```

---

## Current Codebase Analysis

### Existing File Structure (from `solkem/edgechain-msingi-ndani`)

```
edgechain-msingi-ndani/           # RENAME TO: dura/
├── .vscode/                      # KEEP - VS Code settings
├── public/
│   ├── admin/
│   │   ├── index.html            # KEEP - Decap CMS entry
│   │   └── config.yml            # UPDATE - Change branding, add new collections
│   ├── images/                   # UPDATE - Add Dura logo, replace icons
│   └── favicon.svg               # REPLACE - Dura favicon
│
├── src/
│   ├── components/
│   │   ├── ConceptCard.astro     # KEEP - Rename to ContentCard.astro
│   │   ├── InteractiveFAQ.tsx    # KEEP
│   │   ├── ProjectBadge.tsx      # KEEP - Still relevant for baeIoT projects
│   │   ├── Analogy.tsx           # KEEP
│   │   ├── ProjectExample.tsx    # KEEP
│   │   ├── UpdateFeed.tsx        # KEEP - Enhance for activity feed
│   │   └── DiagramView.tsx       # KEEP
│   │
│   ├── content/
│   │   ├── config.ts             # UPDATE - Add new content types, schemas
│   │   ├── concepts/             # REORGANIZE → learn/midnight/concepts/
│   │   │   ├── zkp.mdx           # MOVE → learn/midnight/concepts/zkp.mdx
│   │   │   ├── federated-learning.mdx  # MOVE → learn/federated-learning/concepts/
│   │   │   └── trustless-architecture.mdx  # MOVE
│   │   ├── projects/             # KEEP - EdgeChain, Msingi, Ndani pages
│   │   │   ├── edgechain.mdx
│   │   │   ├── msingi.mdx
│   │   │   └── ndani.mdx
│   │   └── updates/              # KEEP - Research changelog
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro      # UPDATE - New branding, navigation
│   │   ├── ConceptLayout.astro   # RENAME → ContentLayout.astro
│   │   └── ProjectLayout.astro   # KEEP
│   │
│   ├── pages/
│   │   ├── index.astro           # REWRITE - New Dura landing page
│   │   ├── concepts/[...slug].astro  # REORGANIZE → learn/[domain]/[slug].astro
│   │   ├── projects/[...slug].astro  # KEEP
│   │   ├── updates.astro         # KEEP
│   │   ├── faq.astro             # KEEP
│   │   ├── login.astro           # ENHANCE - Full auth, not just CMS
│   │   └── request-access.astro  # REPLACE → pricing.astro (premium tier)
│   │
│   └── styles/
│       └── global.css            # UPDATE - Dura color palette
│
├── CLAUDE-edgechain.md           # CONSOLIDATE into main CLAUDE.md
├── CLAUDE-msingi.md              # CONSOLIDATE
├── CLAUDE-ndani.md               # CONSOLIDATE
├── CLAUDE.md                     # REPLACE with this document
├── README.md                     # REWRITE - Dura README
│
├── astro.config.mjs              # UPDATE - Add new integrations
├── tailwind.config.mjs           # UPDATE - Dura color palette
├── tsconfig.json                 # KEEP
├── package.json                  # UPDATE - New name, add dependencies
├── vercel.json                   # REMOVE - Using Fly.io only
└── fly.toml                      # UPDATE - New app name
```

### Key Files to Modify

#### 1. `package.json` Changes

```json
// CURRENT
{
  "name": "midnight-learning",
  "version": "0.1.0",
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/react": "...",
    "@astrojs/tailwind": "...",
    "@astrojs/mdx": "...",
    "react": "^18.x",
    "tailwindcss": "..."
  }
}

// TARGET - Add these dependencies
{
  "name": "@dura/web",
  "version": "0.2.0",
  "dependencies": {
    // EXISTING - Keep all Astro/React deps
    
    // NEW - Backend
    "hono": "^4.0.0",
    "@hono/zod-validator": "^0.2.0",
    
    // NEW - Database
    "drizzle-orm": "^0.30.0",
    "postgres": "^3.4.0",
    "@paralleldrive/cuid2": "^2.2.0",
    
    // NEW - Auth
    "lucia": "^3.0.0",
    "@lucia-auth/adapter-drizzle": "^1.0.0",
    "arctic": "^1.0.0",  // OAuth helpers
    
    // NEW - Search
    "meilisearch": "^0.37.0",
    
    // NEW - Utils
    "zod": "^3.22.0",
    "date-fns": "^3.0.0",
    
    // NEW - Payments (Phase 5)
    "stripe": "^14.0.0"
  },
  "devDependencies": {
    // NEW
    "drizzle-kit": "^0.20.0"
  }
}
```

#### 2. `tailwind.config.mjs` Changes

```javascript
// CURRENT - Purple/Midnight theme
export default {
  theme: {
    extend: {
      colors: {
        midnight: { 900: '#0a0a1a' },
        // purple, emerald, amber, cyan accents
      }
    }
  }
}

// TARGET - Dura theme
export default {
  theme: {
    extend: {
      colors: {
        dura: {
          primary: '#b45309',
          'primary-light': '#f59e0b',
          'primary-dark': '#92400e',
          bg: '#1c1917',
          'bg-subtle': '#292524',
          surface: '#44403c',
          text: '#fafaf9',
          'text-muted': '#d6d3d1',
        },
        // Keep project colors
        edgechain: '#059669',
        msingi: '#d97706',
        ndani: '#0891b2',
        // Content type colors
        concept: '#0ea5e9',
        protocol: '#8b5cf6',
        implementation: '#10b981',
        'case-study': '#f97316',
        research: '#ec4899',
      }
    }
  }
}
```

#### 3. `astro.config.mjs` Changes

```javascript
// CURRENT
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [react(), tailwind(), mdx()],
  output: 'static',  // Or 'server' for Decap CMS
});

// TARGET - Add hybrid rendering for API routes
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';  // NEW

export default defineConfig({
  integrations: [react(), tailwind(), mdx()],
  output: 'hybrid',  // CHANGE - Static by default, SSR for API
  adapter: node({ mode: 'standalone' }),  // NEW
  vite: {
    optimizeDeps: {
      exclude: ['lucia']  // NEW - Lucia auth compatibility
    }
  }
});
```

#### 4. `src/layouts/BaseLayout.astro` Branding Changes

```astro
<!-- CURRENT -->
<title>🌙 Midnight Learning</title>
<nav>
  <a href="/">🌙 Midnight Learning</a>
</nav>
<footer>© 2026 Midnight Learning.</footer>

<!-- TARGET -->
<title>Dura — The Knowledge Granary</title>
<nav>
  <a href="/">
    <img src="/images/dura-logo.svg" alt="Dura" />
    <span>Dura</span>
  </a>
</nav>
<footer>
  © 2026 Dura. Part of the baeIoT ecosystem.
  <a href="https://disruptiveiot.org">disruptiveiot.org</a>
</footer>
```

### Content Reorganization Map

```
CURRENT STRUCTURE                    TARGET STRUCTURE
──────────────────                   ────────────────
src/content/                         src/content/
├── concepts/                        ├── learn/
│   ├── zkp.mdx                      │   ├── midnight/
│   ├── federated-learning.mdx       │   │   ├── concepts/
│   └── trustless-architecture.mdx   │   │   │   ├── zkp.mdx
│                                    │   │   │   ├── nullifiers.mdx (NEW)
│                                    │   │   │   ├── commitment-schemes.mdx (NEW)
│                                    │   │   │   └── ...
│                                    │   │   ├── protocols/
│                                    │   │   │   ├── brace.mdx (NEW)
│                                    │   │   │   ├── acr.mdx (NEW)
│                                    │   │   │   └── bounded-autonomy.mdx (NEW)
│                                    │   │   ├── implementations/
│                                    │   │   │   ├── compact.mdx (NEW)
│                                    │   │   │   ├── halo2.mdx (NEW)
│                                    │   │   │   └── night-dust.mdx (NEW)
│                                    │   │   └── case-studies/
│                                    │   │       └── edgechain.mdx (MOVE from projects/)
│                                    │   │
│                                    │   ├── federated-learning/
│                                    │   │   ├── concepts/
│                                    │   │   │   └── federated-learning.mdx (MOVE)
│                                    │   │   └── ...
│                                    │   │
│                                    │   └── iot-edge/
│                                    │       ├── concepts/
│                                    │       │   └── trustless-architecture.mdx (MOVE)
│                                    │       └── hardware/
│                                    │           └── ndani.mdx (MOVE from projects/)
│                                    │
├── projects/                        ├── projects/  (KEEP for overview pages)
│   ├── edgechain.mdx                │   ├── edgechain.mdx
│   ├── msingi.mdx                   │   ├── msingi.mdx
│   └── ndani.mdx                    │   └── ndani.mdx
│                                    │
└── updates/                         ├── updates/  (KEEP)
                                     │
                                     └── papers/  (NEW - literature database)
                                         └── [papers added via BibTeX import]
```

### URL Structure Changes

```
CURRENT URLs                         TARGET URLs
────────────                         ───────────
/                                    /                          (landing page)
/concepts                            /learn                     (learning hub)
/concepts/zkp                        /learn/midnight/zkp        (domain-scoped)
/concepts/federated-learning         /learn/federated-learning/overview
/projects/edgechain                  /projects/edgechain        (KEEP)
/updates                             /updates                   (KEEP)
/login                               /auth/login                (restructure)
/request-access                      /pricing                   (premium tier)
/admin                               /admin                     (KEEP - Decap CMS)

NEW URLs
────────
/learn/midnight/protocols/brace
/learn/midnight/implementations/compact
/papers                              (literature browser)
/papers/[id]                         (paper detail + annotations)
/workspaces                          (collaboration spaces)
/workspaces/[id]                     (workspace detail)
/profile                             (user profile)
/profile/progress                    (learning progress)
/search                              (global search)
/api/*                               (backend API routes)
```

---

## Vision & Mission

### Vision
Transform Dura into the authoritative, open-access platform for privacy-preserving systems research — where practitioners learn, researchers collaborate, and knowledge compounds across the baeIoT ecosystem and beyond.

### Mission
1. **Educate**: Provide world-class learning resources for ZK, blockchain, federated learning, and edge AI
2. **Collaborate**: Enable researchers to work together on papers, experiments, and protocols
3. **Publish**: Support the full research lifecycle from literature review to peer-reviewed publication
4. **Discover**: Surface connections between concepts, papers, and implementations

### Success Metrics

| Metric | Year 1 Target | Year 3 Target |
|--------|---------------|---------------|
| Monthly Active Users | 5,000 | 50,000 |
| Learning Paths Completed | 500 | 10,000 |
| Research Collaborations | 10 | 100 |
| Papers Citing Dura | 5 | 50 |
| Premium Subscribers | 100 | 2,000 |

---

## Current State Assessment

### What Exists (edgechain-msingi-ndani.fly.dev)

```
current/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Landing page
│   │   └── learn/
│   │       └── midnight/            # Midnight Learning section
│   │           ├── concepts/        # 6 concept pages
│   │           ├── protocols/       # BRACE, ACR, bounded-autonomy
│   │           └── implementations/ # Compact, Halo2, NIGHT/DUST
│   ├── components/
│   │   └── [various React components]
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── content/
│       └── [MDX files]
├── public/
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

### What's Missing for Industry-Grade

1. **Authentication & User Management** — No login, no user profiles
2. **Collaboration Features** — No shared workspaces, annotations, or comments
3. **Literature Management** — No BibTeX import, citation tracking, or paper database
4. **Search & Discovery** — No full-text search, no concept graph
5. **Progress Tracking** — No completion status, no learning paths
6. **API Layer** — No backend for dynamic content
7. **Premium Features** — No paywall, no subscription management
8. **Mobile Experience** — Not optimized for mobile researchers
9. **Offline Support** — No PWA capabilities
10. **Analytics** — No usage tracking for content optimization

---

## Target Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DURA PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │   PUBLIC TIER   │  │  PREMIUM TIER   │  │ COLLABORATOR    │         │
│  │                 │  │                 │  │     TIER        │         │
│  │ • Learn basics  │  │ • Deep dives    │  │ • Shared spaces │         │
│  │ • Browse papers │  │ • Full courses  │  │ • Paper drafts  │         │
│  │ • View concepts │  │ • Exercises     │  │ • Annotations   │         │
│  │ • Public APIs   │  │ • Certificates  │  │ • Reviews       │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
│           │                    │                    │                   │
│           └────────────────────┼────────────────────┘                   │
│                                ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        CORE SERVICES                              │  │
│  │                                                                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │  │   Auth   │ │ Content  │ │ Search   │ │ Collab   │ │  API   │ │  │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │Gateway │ │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │  │
│  └───────┼────────────┼────────────┼────────────┼───────────┼───────┘  │
│          │            │            │            │           │          │
│          └────────────┴────────────┼────────────┴───────────┘          │
│                                    ▼                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         DATA LAYER                                │  │
│  │                                                                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │
│  │  │ PostgreSQL │  │   Redis    │  │   S3/R2    │  │ Meilisearch│  │  │
│  │  │  (Users,   │  │  (Cache,   │  │  (Files,   │  │  (Search   │  │  │
│  │  │  Content)  │  │  Sessions) │  │   PDFs)    │  │   Index)   │  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Astro 4 + React 18 + TypeScript | Static-first with islands of interactivity |
| **Styling** | Tailwind CSS + shadcn/ui | Consistent, accessible components |
| **Content** | MDX + Content Collections | Type-safe content with component embedding |
| **Backend** | Node.js + Hono (or tRPC) | Lightweight, TypeScript-native API |
| **Database** | PostgreSQL + Drizzle ORM | Type-safe queries, migrations |
| **Cache** | Redis (Upstash) | Session management, rate limiting |
| **Search** | Meilisearch (or Typesense) | Full-text search with typo tolerance |
| **Auth** | Lucia Auth + OAuth | Self-hosted, privacy-respecting |
| **Storage** | Cloudflare R2 / S3 | PDF storage, file uploads |
| **Hosting** | Fly.io + Cloudflare | Edge deployment, global CDN |
| **Analytics** | Plausible (self-hosted) | Privacy-respecting analytics |
| **Payments** | Stripe | Subscription management |

---

## Data Models

### Core Entities

```typescript
// ============================================
// USER & AUTH
// ============================================

interface User {
  id: string;                    // CUID2
  email: string;
  name: string;
  avatar_url?: string;
  role: 'free' | 'premium' | 'collaborator' | 'admin';
  created_at: Date;
  updated_at: Date;
  
  // Profile
  bio?: string;
  institution?: string;
  orcid?: string;               // ORCID identifier for researchers
  github?: string;
  twitter?: string;
  
  // Preferences
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  research_interests: string[];  // Tags for personalization
}

// ============================================
// CONTENT
// ============================================

type ContentType = 
  | 'concept'        // Foundational knowledge (e.g., "What is a ZK proof?")
  | 'protocol'       // Protocol specifications (e.g., BRACE, ACR)
  | 'implementation' // Code/tool walkthroughs (e.g., Compact contracts)
  | 'case-study'     // Real-world applications (e.g., EdgeChain)
  | 'research'       // Paper summaries, open problems
  | 'course'         // Structured learning paths
  | 'exercise';      // Hands-on challenges

interface Content {
  id: string;
  slug: string;                  // URL-friendly identifier
  type: ContentType;
  title: string;
  description: string;
  body: string;                  // MDX content
  
  // Taxonomy
  domain: string;                // e.g., 'midnight', 'federated-learning'
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Access Control
  tier: 'free' | 'premium';
  
  // Metadata
  author_id: string;
  contributors: string[];        // User IDs
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
  
  // Engagement
  view_count: number;
  bookmark_count: number;
  
  // Relations
  prerequisites: string[];       // Content IDs
  related: string[];             // Content IDs
  references: string[];          // Paper IDs
}

// ============================================
// LITERATURE / PAPERS
// ============================================

interface Paper {
  id: string;
  
  // Bibliographic
  title: string;
  authors: Author[];
  abstract: string;
  year: number;
  venue?: string;                // Conference/journal
  doi?: string;
  arxiv_id?: string;
  url?: string;
  
  // Files
  pdf_url?: string;              // Stored in R2/S3
  bibtex: string;
  
  // Taxonomy
  tags: string[];
  domain: string;
  
  // User-generated
  added_by: string;              // User ID
  created_at: Date;
  
  // Computed
  citation_count?: number;
  influence_score?: number;
}

interface Author {
  name: string;
  orcid?: string;
  affiliation?: string;
}

interface Annotation {
  id: string;
  paper_id: string;
  user_id: string;
  
  // Location
  page?: number;
  start_offset?: number;
  end_offset?: number;
  highlighted_text?: string;
  
  // Content
  note: string;
  tags: string[];
  
  // Visibility
  visibility: 'private' | 'workspace' | 'public';
  workspace_id?: string;
  
  created_at: Date;
  updated_at: Date;
}

// ============================================
// COLLABORATION
// ============================================

interface Workspace {
  id: string;
  name: string;
  description?: string;
  
  owner_id: string;
  members: WorkspaceMember[];
  
  // Settings
  visibility: 'private' | 'unlisted' | 'public';
  allow_join_requests: boolean;
  
  created_at: Date;
  updated_at: Date;
}

interface WorkspaceMember {
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joined_at: Date;
}

interface Draft {
  id: string;
  workspace_id: string;
  
  title: string;
  content: string;               // Rich text / LaTeX
  
  // Versioning
  version: number;
  parent_version?: number;
  
  // Status
  status: 'draft' | 'review' | 'submitted' | 'published';
  
  // Authorship
  created_by: string;
  contributors: string[];
  
  created_at: Date;
  updated_at: Date;
}

interface Comment {
  id: string;
  
  // Target (polymorphic)
  target_type: 'content' | 'paper' | 'draft' | 'annotation';
  target_id: string;
  
  // Threading
  parent_id?: string;            // For nested comments
  
  user_id: string;
  body: string;
  
  // Reactions
  reactions: Record<string, string[]>; // emoji -> user_ids
  
  created_at: Date;
  updated_at: Date;
}

// ============================================
// PROGRESS & GAMIFICATION
// ============================================

interface UserProgress {
  user_id: string;
  content_id: string;
  
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percent: number;      // 0-100
  
  started_at?: Date;
  completed_at?: Date;
  last_accessed_at: Date;
  
  // For exercises
  attempts?: number;
  best_score?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Criteria
  criteria_type: 'content_completed' | 'streak' | 'contribution' | 'collaboration';
  criteria_value: number;
  criteria_domain?: string;
}

interface UserAchievement {
  user_id: string;
  achievement_id: string;
  earned_at: Date;
}

// ============================================
// SEARCH & DISCOVERY
// ============================================

interface SearchIndex {
  id: string;
  type: 'content' | 'paper' | 'user' | 'workspace';
  
  title: string;
  description: string;
  body?: string;
  
  tags: string[];
  domain: string;
  
  // Facets
  difficulty?: string;
  tier?: string;
  year?: number;
  
  // Ranking signals
  popularity: number;
  recency: number;
}
```

### Database Schema (Drizzle)

```typescript
// schema.ts
import { pgTable, text, timestamp, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Enums
export const userRoleEnum = pgEnum('user_role', ['free', 'premium', 'collaborator', 'admin']);
export const contentTypeEnum = pgEnum('content_type', ['concept', 'protocol', 'implementation', 'case-study', 'research', 'course', 'exercise']);
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced', 'expert']);
export const tierEnum = pgEnum('tier', ['free', 'premium']);
export const visibilityEnum = pgEnum('visibility', ['private', 'unlisted', 'public', 'workspace']);
export const progressStatusEnum = pgEnum('progress_status', ['not_started', 'in_progress', 'completed']);

// Tables
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('free').notNull(),
  bio: text('bio'),
  institution: text('institution'),
  orcid: text('orcid'),
  github: text('github'),
  twitter: text('twitter'),
  preferences: jsonb('preferences').default({}).$type<UserPreferences>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contents = pgTable('contents', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  slug: text('slug').notNull().unique(),
  type: contentTypeEnum('type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  body: text('body').notNull(),
  domain: text('domain').notNull(),
  tags: text('tags').array().default([]),
  difficulty: difficultyEnum('difficulty').default('beginner'),
  tier: tierEnum('tier').default('free'),
  authorId: text('author_id').references(() => users.id),
  contributors: text('contributors').array().default([]),
  prerequisites: text('prerequisites').array().default([]),
  related: text('related').array().default([]),
  references: text('references').array().default([]),
  viewCount: integer('view_count').default(0),
  bookmarkCount: integer('bookmark_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

export const papers = pgTable('papers', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  authors: jsonb('authors').default([]).$type<Author[]>(),
  abstract: text('abstract'),
  year: integer('year'),
  venue: text('venue'),
  doi: text('doi'),
  arxivId: text('arxiv_id'),
  url: text('url'),
  pdfUrl: text('pdf_url'),
  bibtex: text('bibtex'),
  tags: text('tags').array().default([]),
  domain: text('domain'),
  addedBy: text('added_by').references(() => users.id),
  citationCount: integer('citation_count'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const annotations = pgTable('annotations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  paperId: text('paper_id').references(() => papers.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  page: integer('page'),
  startOffset: integer('start_offset'),
  endOffset: integer('end_offset'),
  highlightedText: text('highlighted_text'),
  note: text('note').notNull(),
  tags: text('tags').array().default([]),
  visibility: visibilityEnum('visibility').default('private'),
  workspaceId: text('workspace_id').references(() => workspaces.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: text('owner_id').references(() => users.id).notNull(),
  visibility: visibilityEnum('visibility').default('private'),
  allowJoinRequests: boolean('allow_join_requests').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workspaceMembers = pgTable('workspace_members', {
  workspaceId: text('workspace_id').references(() => workspaces.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  role: text('role').notNull(), // 'owner' | 'admin' | 'editor' | 'viewer'
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const userProgress = pgTable('user_progress', {
  userId: text('user_id').references(() => users.id).notNull(),
  contentId: text('content_id').references(() => contents.id).notNull(),
  status: progressStatusEnum('status').default('not_started'),
  progressPercent: integer('progress_percent').default(0),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow(),
  attempts: integer('attempts'),
  bestScore: integer('best_score'),
});

export const bookmarks = pgTable('bookmarks', {
  userId: text('user_id').references(() => users.id).notNull(),
  targetType: text('target_type').notNull(), // 'content' | 'paper'
  targetId: text('target_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## API Design

### API Routes Structure

```
/api
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── GET    /me
│   └── POST   /oauth/:provider
│
├── /users
│   ├── GET    /:id
│   ├── PATCH  /:id
│   ├── GET    /:id/progress
│   ├── GET    /:id/bookmarks
│   └── GET    /:id/achievements
│
├── /content
│   ├── GET    /                    # List with filters
│   ├── GET    /:slug
│   ├── POST   /                    # Admin only
│   ├── PATCH  /:slug               # Admin only
│   ├── DELETE /:slug               # Admin only
│   ├── POST   /:slug/view          # Track view
│   └── POST   /:slug/bookmark
│
├── /papers
│   ├── GET    /                    # List with filters
│   ├── GET    /:id
│   ├── POST   /                    # Add paper (BibTeX import)
│   ├── POST   /import/bibtex       # Bulk import
│   ├── GET    /:id/annotations
│   └── POST   /:id/annotations
│
├── /workspaces
│   ├── GET    /                    # User's workspaces
│   ├── POST   /
│   ├── GET    /:id
│   ├── PATCH  /:id
│   ├── DELETE /:id
│   ├── POST   /:id/members
│   ├── DELETE /:id/members/:userId
│   ├── GET    /:id/drafts
│   └── POST   /:id/drafts
│
├── /drafts
│   ├── GET    /:id
│   ├── PATCH  /:id
│   ├── DELETE /:id
│   └── GET    /:id/versions
│
├── /search
│   ├── GET    /                    # Global search
│   └── GET    /suggest             # Autocomplete
│
├── /progress
│   ├── POST   /                    # Update progress
│   └── GET    /stats               # User stats
│
└── /admin
    ├── GET    /stats
    ├── GET    /users
    └── POST   /reindex             # Rebuild search index
```

### API Implementation Pattern

```typescript
// src/api/routes/content.ts
import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db';
import { contents } from '../db/schema';
import { eq, and, ilike, inArray } from 'drizzle-orm';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

const contentRouter = new Hono();

// Schemas
const listContentSchema = z.object({
  domain: z.string().optional(),
  type: z.enum(['concept', 'protocol', 'implementation', 'case-study', 'research', 'course', 'exercise']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  tier: z.enum(['free', 'premium']).optional(),
  tags: z.string().optional(), // comma-separated
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

// GET /content - List content with filters
contentRouter.get(
  '/',
  optionalAuth,
  zValidator('query', listContentSchema),
  async (c) => {
    const { domain, type, difficulty, tier, tags, q, page, limit } = c.req.valid('query');
    const user = c.get('user');
    
    // Build query
    const conditions = [];
    
    if (domain) conditions.push(eq(contents.domain, domain));
    if (type) conditions.push(eq(contents.type, type));
    if (difficulty) conditions.push(eq(contents.difficulty, difficulty));
    
    // Filter premium content for non-premium users
    if (!user || user.role === 'free') {
      conditions.push(eq(contents.tier, 'free'));
    } else if (tier) {
      conditions.push(eq(contents.tier, tier));
    }
    
    // Only published content
    conditions.push(contents.publishedAt.isNotNull());
    
    const offset = (page - 1) * limit;
    
    const results = await db.select()
      .from(contents)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(contents.publishedAt);
    
    const total = await db.select({ count: sql`count(*)` })
      .from(contents)
      .where(and(...conditions));
    
    return c.json({
      data: results,
      pagination: {
        page,
        limit,
        total: Number(total[0].count),
        totalPages: Math.ceil(Number(total[0].count) / limit),
      },
    });
  }
);

// GET /content/:slug
contentRouter.get(
  '/:slug',
  optionalAuth,
  async (c) => {
    const slug = c.req.param('slug');
    const user = c.get('user');
    
    const [content] = await db.select()
      .from(contents)
      .where(eq(contents.slug, slug))
      .limit(1);
    
    if (!content) {
      return c.json({ error: 'Content not found' }, 404);
    }
    
    // Check premium access
    if (content.tier === 'premium' && (!user || user.role === 'free')) {
      return c.json({ 
        error: 'Premium content requires subscription',
        preview: {
          title: content.title,
          description: content.description,
          tier: content.tier,
        }
      }, 403);
    }
    
    return c.json({ data: content });
  }
);

// POST /content/:slug/view - Track view
contentRouter.post(
  '/:slug/view',
  rateLimit({ limit: 100, window: '1h' }),
  async (c) => {
    const slug = c.req.param('slug');
    
    await db.update(contents)
      .set({ viewCount: sql`view_count + 1` })
      .where(eq(contents.slug, slug));
    
    return c.json({ success: true });
  }
);

// POST /content/:slug/bookmark
contentRouter.post(
  '/:slug/bookmark',
  requireAuth,
  async (c) => {
    const slug = c.req.param('slug');
    const user = c.get('user');
    
    const [content] = await db.select({ id: contents.id })
      .from(contents)
      .where(eq(contents.slug, slug))
      .limit(1);
    
    if (!content) {
      return c.json({ error: 'Content not found' }, 404);
    }
    
    // Toggle bookmark
    const existing = await db.select()
      .from(bookmarks)
      .where(and(
        eq(bookmarks.userId, user.id),
        eq(bookmarks.targetType, 'content'),
        eq(bookmarks.targetId, content.id)
      ))
      .limit(1);
    
    if (existing.length > 0) {
      await db.delete(bookmarks)
        .where(eq(bookmarks.id, existing[0].id));
      
      await db.update(contents)
        .set({ bookmarkCount: sql`bookmark_count - 1` })
        .where(eq(contents.id, content.id));
      
      return c.json({ bookmarked: false });
    } else {
      await db.insert(bookmarks).values({
        userId: user.id,
        targetType: 'content',
        targetId: content.id,
      });
      
      await db.update(contents)
        .set({ bookmarkCount: sql`bookmark_count + 1` })
        .where(eq(contents.id, content.id));
      
      return c.json({ bookmarked: true });
    }
  }
);

export { contentRouter };
```

---

## Frontend Architecture

### Directory Structure (Target)

```
dura/
├── src/
│   ├── pages/
│   │   ├── index.astro                    # Landing page
│   │   ├── learn/
│   │   │   ├── index.astro                # Learning hub
│   │   │   └── [domain]/
│   │   │       ├── index.astro            # Domain overview
│   │   │       └── [slug].astro           # Content page
│   │   ├── papers/
│   │   │   ├── index.astro                # Paper browser
│   │   │   └── [id].astro                 # Paper detail + annotations
│   │   ├── workspaces/
│   │   │   ├── index.astro                # My workspaces
│   │   │   └── [id]/
│   │   │       ├── index.astro            # Workspace overview
│   │   │       ├── papers.astro           # Shared papers
│   │   │       └── drafts/
│   │   │           ├── index.astro        # Draft list
│   │   │           └── [draftId].astro    # Draft editor
│   │   ├── profile/
│   │   │   ├── index.astro                # User profile
│   │   │   ├── progress.astro             # Learning progress
│   │   │   └── settings.astro             # Preferences
│   │   ├── search.astro                   # Search results
│   │   ├── pricing.astro                  # Subscription plans
│   │   ├── auth/
│   │   │   ├── login.astro
│   │   │   ├── register.astro
│   │   │   └── callback.astro             # OAuth callback
│   │   └── api/
│   │       └── [...route].ts              # API routes
│   │
│   ├── components/
│   │   ├── ui/                            # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── content/
│   │   │   ├── ContentCard.tsx
│   │   │   ├── ContentNav.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── Prerequisites.tsx
│   │   │   └── RelatedContent.tsx
│   │   ├── papers/
│   │   │   ├── PaperCard.tsx
│   │   │   ├── PaperViewer.tsx
│   │   │   ├── AnnotationSidebar.tsx
│   │   │   ├── BibTexImporter.tsx
│   │   │   └── CitationFormatter.tsx
│   │   ├── collaboration/
│   │   │   ├── WorkspaceCard.tsx
│   │   │   ├── MemberList.tsx
│   │   │   ├── DraftEditor.tsx
│   │   │   └── CommentThread.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── Filters.tsx
│   │   │   └── SearchSuggestions.tsx
│   │   ├── progress/
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── LearningPath.tsx
│   │   │   ├── AchievementBadge.tsx
│   │   │   └── Streak.tsx
│   │   ├── interactive/
│   │   │   ├── CodePlayground.tsx
│   │   │   ├── QuizBlock.tsx
│   │   │   ├── DiagramViewer.tsx
│   │   │   └── ConceptGraph.tsx
│   │   └── mdx/
│   │       ├── Callout.tsx
│   │       ├── CodeBlock.tsx
│   │       ├── Definition.tsx
│   │       ├── Exercise.tsx
│   │       ├── Formula.tsx
│   │       └── Reference.tsx
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── LearnLayout.astro
│   │   ├── WorkspaceLayout.astro
│   │   └── AuthLayout.astro
│   │
│   ├── content/
│   │   ├── config.ts                      # Content collection config
│   │   ├── learn/
│   │   │   ├── midnight/
│   │   │   │   ├── concepts/
│   │   │   │   │   ├── zkp.mdx
│   │   │   │   │   ├── commitment-schemes.mdx
│   │   │   │   │   ├── nullifiers.mdx
│   │   │   │   │   └── ...
│   │   │   │   ├── protocols/
│   │   │   │   │   ├── brace.mdx
│   │   │   │   │   ├── acr.mdx
│   │   │   │   │   └── bounded-autonomy.mdx
│   │   │   │   ├── implementations/
│   │   │   │   │   ├── compact.mdx
│   │   │   │   │   ├── halo2.mdx
│   │   │   │   │   └── night-dust.mdx
│   │   │   │   └── case-studies/
│   │   │   │       └── edgechain.mdx
│   │   │   ├── federated-learning/        # Future
│   │   │   ├── iot-edge/                  # Future
│   │   │   └── agentic-ai/                # Future
│   │   └── pages/
│   │       ├── about.mdx
│   │       ├── contributing.mdx
│   │       └── privacy.mdx
│   │
│   ├── lib/
│   │   ├── api.ts                         # API client
│   │   ├── auth.ts                        # Auth utilities
│   │   ├── search.ts                      # Search client
│   │   ├── bibtex.ts                      # BibTeX parser
│   │   └── utils.ts                       # Shared utilities
│   │
│   ├── stores/
│   │   ├── auth.ts                        # Auth state (nanostores)
│   │   ├── progress.ts                    # Progress state
│   │   └── preferences.ts                 # User preferences
│   │
│   └── styles/
│       ├── global.css
│       └── typography.css
│
├── public/
│   ├── fonts/
│   ├── icons/
│   └── og/                                # Open Graph images
│
├── api/                                   # Backend (if separate)
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── db/
│   │   └── services/
│   ├── drizzle/
│   │   └── migrations/
│   └── package.json
│
├── astro.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── drizzle.config.ts
├── docker-compose.yml                     # Local dev (Postgres, Redis, Meilisearch)
└── CLAUDE.md                              # This file
```

### Key React Components

```tsx
// src/components/content/ContentCard.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Lock } from 'lucide-react';
import type { Content } from '@/types';

interface ContentCardProps {
  content: Content;
  progress?: number;
  showProgress?: boolean;
}

export function ContentCard({ content, progress, showProgress }: ContentCardProps) {
  const typeColors: Record<string, string> = {
    concept: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    protocol: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    implementation: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'case-study': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    research: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  };

  return (
    <Card className="group hover:border-dura-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className={typeColors[content.type]}>
            {content.type}
          </Badge>
          {content.tier === 'premium' && (
            <Lock className="h-4 w-4 text-amber-500" />
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-dura-primary transition-colors">
          <a href={`/learn/${content.domain}/${content.slug}`}>
            {content.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {content.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {content.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {estimateReadTime(content.body)} min
          </span>
        </div>
        {showProgress && progress !== undefined && (
          <Progress value={progress} className="mt-3 h-1" />
        )}
      </CardContent>
    </Card>
  );
}

function estimateReadTime(body: string): number {
  const words = body.split(/\s+/).length;
  return Math.ceil(words / 200);
}
```

```tsx
// src/components/papers/BibTexImporter.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, Check } from 'lucide-react';
import { parseBibTeX } from '@/lib/bibtex';
import type { Paper } from '@/types';

interface BibTexImporterProps {
  onImport: (papers: Partial<Paper>[]) => Promise<void>;
}

export function BibTexImporter({ onImport }: BibTexImporterProps) {
  const [bibtex, setBibtex] = useState('');
  const [parsed, setParsed] = useState<Partial<Paper>[]>([]);
  const [importing, setImporting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleParse = () => {
    const papers = parseBibTeX(bibtex);
    setParsed(papers);
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      await onImport(parsed);
      setOpen(false);
      setBibtex('');
      setParsed([]);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import BibTeX
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Papers from BibTeX</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your BibTeX entries here..."
            value={bibtex}
            onChange={(e) => setBibtex(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
          
          <div className="flex gap-2">
            <Button onClick={handleParse} disabled={!bibtex.trim()}>
              Parse
            </Button>
          </div>
          
          {parsed.length > 0 && (
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">
                Found {parsed.length} paper(s):
              </p>
              <ul className="space-y-1">
                {parsed.map((paper, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{paper.title}</span>
                    <span className="text-muted-foreground">({paper.year})</span>
                  </li>
                ))}
              </ul>
              <Button onClick={handleImport} disabled={importing} className="w-full mt-4">
                {importing ? 'Importing...' : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Import {parsed.length} Paper(s)
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

```tsx
// src/components/interactive/ConceptGraph.tsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Content } from '@/types';

interface Node {
  id: string;
  title: string;
  type: string;
  domain: string;
}

interface Link {
  source: string;
  target: string;
  type: 'prerequisite' | 'related';
}

interface ConceptGraphProps {
  contents: Content[];
  activeId?: string;
  onNodeClick?: (id: string) => void;
}

export function ConceptGraph({ contents, activeId, onNodeClick }: ConceptGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Build nodes and links
    const nodes: Node[] = contents.map(c => ({
      id: c.id,
      title: c.title,
      type: c.type,
      domain: c.domain,
    }));

    const links: Link[] = [];
    contents.forEach(c => {
      c.prerequisites?.forEach(prereq => {
        links.push({ source: prereq, target: c.id, type: 'prerequisite' });
      });
      c.related?.forEach(rel => {
        links.push({ source: c.id, target: rel, type: 'related' });
      });
    });

    // D3 force simulation
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => d.type === 'prerequisite' ? '#8b5cf6' : '#6b7280')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => d.type === 'prerequisite' ? 2 : 1)
      .attr('stroke-dasharray', d => d.type === 'related' ? '4,4' : 'none');

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.id === activeId ? 12 : 8)
      .attr('fill', d => getTypeColor(d.type))
      .attr('stroke', d => d.id === activeId ? '#f59e0b' : 'none')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('click', (_, d) => onNodeClick?.(d.id));

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.title)
      .attr('font-size', 10)
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('fill', '#d6d3d1');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    return () => simulation.stop();
  }, [contents, activeId]);

  return (
    <svg ref={svgRef} className="w-full h-[400px] bg-stone-900 rounded-lg" />
  );
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    concept: '#0ea5e9',
    protocol: '#8b5cf6',
    implementation: '#10b981',
    'case-study': '#f97316',
    research: '#ec4899',
  };
  return colors[type] || '#6b7280';
}
```

---

## Rebranding Checklist (Migration Steps)

### Phase 0: Repository Setup (Day 1)

- [ ] **Option A: Rename existing repo**
  ```bash
  # On GitHub: Settings → Rename to "dura"
  # Update local remote
  git remote set-url origin https://github.com/solkem/dura.git
  ```

- [ ] **Option B: Create new repo, migrate code**
  ```bash
  git clone https://github.com/solkem/edgechain-msingi-ndani.git dura
  cd dura
  rm -rf .git
  git init
  git remote add origin https://github.com/solkem/dura.git
  ```

- [ ] **Update package.json**
  ```json
  {
    "name": "@dura/web",
    "version": "0.2.0",
    "description": "Dura — The Knowledge Granary"
  }
  ```

- [ ] **Consolidate CLAUDE files**
  - Merge `CLAUDE-edgechain.md`, `CLAUDE-msingi.md`, `CLAUDE-ndani.md` into single `CLAUDE.md`
  - Delete individual project CLAUDE files

### Phase 1: Visual Rebranding (Week 1)

- [ ] **Update `tailwind.config.mjs`**
  - Add Dura color palette (amber/stone theme)
  - Keep project colors (emerald, amber, cyan)
  - Add content type colors

- [ ] **Update `src/styles/global.css`**
  - Replace midnight-900 background with stone-900
  - Update accent colors
  - Add CSS custom properties for Dura theme

- [ ] **Update `src/layouts/BaseLayout.astro`**
  - Change title: "Dura — The Knowledge Granary"
  - Replace "🌙 Midnight Learning" with Dura logo
  - Update meta tags (description, OG image)
  - Update footer with baeIoT ecosystem link

- [ ] **Create brand assets in `public/images/`**
  - [ ] `dura-logo.svg` — Primary logo
  - [ ] `dura-icon.svg` — Square icon
  - [ ] `dura-og.png` — Open Graph image (1200x630)
  - [ ] Update `favicon.svg`

- [ ] **Update `public/admin/config.yml`** (Decap CMS)
  ```yaml
  # Change branding
  site_url: https://dura.dev
  display_url: https://dura.dev
  logo_url: /images/dura-logo.svg
  ```

- [ ] **Update `src/pages/index.astro`**
  - New hero section with Dura branding
  - Update tagline: "The Knowledge Granary"
  - Keep concept grid, update styling

- [ ] **Update navigation in all layouts**
  - "Concepts" → "Learn"
  - Add "Papers" link (placeholder)
  - Add "Sign In" → actual auth (later)

### Phase 2: Content Reorganization (Week 2)

- [ ] **Create new directory structure**
  ```bash
  mkdir -p src/content/learn/midnight/{concepts,protocols,implementations,case-studies}
  mkdir -p src/content/learn/federated-learning/concepts
  mkdir -p src/content/learn/iot-edge/{concepts,hardware}
  mkdir -p src/content/papers
  ```

- [ ] **Move existing content**
  ```bash
  # Move ZKP to Midnight domain
  mv src/content/concepts/zkp.mdx src/content/learn/midnight/concepts/
  
  # Move federated learning
  mv src/content/concepts/federated-learning.mdx src/content/learn/federated-learning/concepts/
  
  # Move trustless architecture to IoT/Edge
  mv src/content/concepts/trustless-architecture.mdx src/content/learn/iot-edge/concepts/
  ```

- [ ] **Update `src/content/config.ts`**
  ```typescript
  // Add new collections
  const learnCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      type: z.enum(['concept', 'protocol', 'implementation', 'case-study']),
      domain: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
      tier: z.enum(['free', 'premium']).default('free'),
      // ... rest of schema
    }),
  });
  
  const papersCollection = defineCollection({
    type: 'data',  // JSON/YAML for paper metadata
    schema: z.object({
      title: z.string(),
      authors: z.array(z.object({
        name: z.string(),
        orcid: z.string().optional(),
      })),
      year: z.number(),
      venue: z.string().optional(),
      doi: z.string().optional(),
      bibtex: z.string(),
      tags: z.array(z.string()),
    }),
  });
  ```

- [ ] **Create new page routes**
  ```bash
  # Create learn hub page
  touch src/pages/learn/index.astro
  
  # Create domain index pages
  touch src/pages/learn/midnight/index.astro
  touch src/pages/learn/federated-learning/index.astro
  touch src/pages/learn/iot-edge/index.astro
  
  # Create dynamic content page
  touch "src/pages/learn/[domain]/[...slug].astro"
  ```

- [ ] **Update frontmatter in moved MDX files**
  ```yaml
  # Add domain field to each content file
  ---
  title: "Zero-Knowledge Proofs"
  type: "concept"
  domain: "midnight"  # NEW
  tier: "free"        # NEW
  # ... existing fields
  ---
  ```

- [ ] **Set up redirects for old URLs**
  ```typescript
  // src/pages/concepts/[slug].astro
  // Redirect old URLs to new structure
  export async function getStaticPaths() {
    return [
      { params: { slug: 'zkp' }, props: { redirect: '/learn/midnight/zkp' } },
      // ...
    ];
  }
  ```

### Phase 3: Infrastructure (Week 3-4)

- [ ] **Add backend dependencies**
  ```bash
  npm install hono @hono/zod-validator drizzle-orm postgres lucia @lucia-auth/adapter-drizzle arctic zod
  npm install -D drizzle-kit
  ```

- [ ] **Update `astro.config.mjs` for hybrid mode**
  ```javascript
  import node from '@astrojs/node';
  
  export default defineConfig({
    output: 'hybrid',
    adapter: node({ mode: 'standalone' }),
    // ...
  });
  ```

- [ ] **Create database schema**
  - Create `src/db/schema.ts` with all tables
  - Create `drizzle.config.ts`
  - Run `npx drizzle-kit generate:pg`

- [ ] **Set up database**
  ```bash
  # Create Postgres on Fly.io
  fly postgres create --name dura-db
  fly postgres attach dura-db
  
  # Run migrations
  npx drizzle-kit push:pg
  ```

- [ ] **Create API routes**
  ```bash
  mkdir -p src/pages/api
  touch src/pages/api/[...route].ts
  ```

- [ ] **Implement Lucia auth**
  - Create `src/lib/auth.ts`
  - Create login/register pages
  - Add GitHub OAuth

- [ ] **Update `fly.toml`**
  ```toml
  app = "dura"
  
  [env]
    NODE_ENV = "production"
    DATABASE_URL = "..." # Set via fly secrets
  ```

### Phase 4: Core Features (Week 5-8)

- [ ] **Search implementation**
  - Deploy Meilisearch on Fly.io
  - Create indexing script
  - Build search UI component

- [ ] **Progress tracking**
  - Create progress API endpoints
  - Build progress dashboard component
  - Add completion tracking to content pages

- [ ] **Paper management**
  - Create paper browser page
  - Implement BibTeX import
  - Add PDF viewer (pdf.js)

### Phase 5: Collaboration & Premium (Week 9-16)

- [ ] **Workspaces**
  - Workspace CRUD API
  - Member management UI
  - Shared paper collections

- [ ] **Premium tier**
  - Stripe integration
  - Pricing page
  - Content gating middleware

---

## Existing Components (What to Keep, Modify, or Replace)

### Components to KEEP (with minor updates)

These components from `src/components/` are well-designed and should be retained:

| Component | Current Purpose | Dura Updates Needed |
|-----------|-----------------|---------------------|
| `InteractiveFAQ.tsx` | Expandable FAQ sections | Update styling to Dura colors |
| `ProjectBadge.tsx` | Color-coded project tags | Keep as-is (EdgeChain/Msingi/Ndani) |
| `Analogy.tsx` | Styled analogy blocks | Update border color to amber |
| `ProjectExample.tsx` | Project-specific examples | Keep, add `tier` prop for premium |
| `UpdateFeed.tsx` | Recent changes sidebar | Enhance to show user activity |
| `DiagramView.tsx` | Mermaid/architecture diagrams | Keep as-is |

### Components to RENAME/REFACTOR

| Current | New Name | Changes |
|---------|----------|---------|
| `ConceptCard.astro` | `ContentCard.astro` | Generalize for all content types, add progress indicator |
| `ConceptLayout.astro` (layout) | `ContentLayout.astro` | Add domain breadcrumb, related content sidebar |

### Components to ADD

```
src/components/
├── ui/                          # shadcn/ui components (NEW)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   └── progress.tsx
│
├── layout/                      # Layout components (NEW)
│   ├── Header.tsx               # Site header with auth state
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── Footer.tsx               # Site footer
│   └── DomainNav.tsx            # Domain-specific navigation
│
├── content/                     # Content display (NEW)
│   ├── ContentCard.tsx          # Refactored from ConceptCard
│   ├── ContentNav.tsx           # Prev/Next navigation
│   ├── TableOfContents.tsx      # Auto-generated TOC
│   ├── Prerequisites.tsx        # Prerequisite content links
│   └── RelatedContent.tsx       # Related content suggestions
│
├── papers/                      # Paper management (NEW)
│   ├── PaperCard.tsx
│   ├── PaperViewer.tsx          # PDF.js integration
│   ├── AnnotationSidebar.tsx
│   ├── BibTexImporter.tsx
│   └── CitationFormatter.tsx
│
├── collaboration/               # Collaboration features (NEW)
│   ├── WorkspaceCard.tsx
│   ├── MemberList.tsx
│   ├── DraftEditor.tsx          # Tiptap/Lexical
│   └── CommentThread.tsx
│
├── search/                      # Search UI (NEW)
│   ├── SearchBar.tsx
│   ├── SearchResults.tsx
│   ├── Filters.tsx
│   └── SearchSuggestions.tsx
│
├── progress/                    # Progress tracking (NEW)
│   ├── ProgressRing.tsx
│   ├── LearningPath.tsx
│   ├── AchievementBadge.tsx
│   └── Streak.tsx
│
├── interactive/                 # Interactive learning (NEW)
│   ├── CodePlayground.tsx
│   ├── QuizBlock.tsx
│   └── ConceptGraph.tsx         # D3 concept visualization
│
└── mdx/                         # MDX components (NEW/ENHANCED)
    ├── Callout.tsx
    ├── CodeBlock.tsx            # Enhanced with copy button
    ├── Definition.tsx
    ├── Exercise.tsx
    ├── Formula.tsx              # KaTeX integration
    └── Reference.tsx
```

### Existing MDX Components Usage

The current codebase uses these MDX components (from `src/components/`):

```mdx
<!-- Current usage pattern in content files -->
import { Analogy, ProjectExample } from '../../components';

<Analogy>
Your analogy text here.
</Analogy>

<ProjectExample project="edgechain">
How EdgeChain uses this concept...
</ProjectExample>
```

**Migration path:** Keep these components, but also create aliased imports:

```typescript
// src/components/mdx/index.ts
export { Analogy } from '../Analogy';
export { ProjectExample } from '../ProjectExample';
export { Callout } from './Callout';
export { CodeBlock } from './CodeBlock';
// ... new components

// This allows gradual migration in MDX files:
// OLD: import { Analogy } from '../../components';
// NEW: import { Analogy, Callout } from '@/components/mdx';
```

---

## Decap CMS Configuration (Existing → Updated)

The current codebase uses Decap CMS at `/admin` for content management. This should be preserved but updated for Dura.

### Current Config (`public/admin/config.yml`)

```yaml
# CURRENT (approximate based on repo structure)
backend:
  name: github
  repo: solkem/edgechain-msingi-ndani
  branch: main

site_url: https://edgechain-msingi-ndani.fly.dev
display_url: https://edgechain-msingi-ndani.fly.dev

media_folder: public/images
public_folder: /images

collections:
  - name: concepts
    label: Concepts
    folder: src/content/concepts
    create: true
    extension: mdx
    fields:
      - { name: title, label: Title, widget: string }
      - { name: shortTitle, label: Short Title, widget: string }
      - { name: category, label: Category, widget: select, options: [cryptography, identity, compliance, economics, infrastructure] }
      - { name: difficulty, label: Difficulty, widget: select, options: [beginner, intermediate, advanced] }
      - { name: projects, label: Projects, widget: select, multiple: true, options: [edgechain, msingi, ndani] }
      - { name: body, label: Body, widget: markdown }
  
  - name: projects
    label: Projects
    folder: src/content/projects
    # ...
  
  - name: updates
    label: Research Updates
    folder: src/content/updates
    # ...
```

### Updated Config for Dura

```yaml
# TARGET: public/admin/config.yml
backend:
  name: github
  repo: solkem/dura  # UPDATED
  branch: main

site_url: https://dura.dev  # UPDATED
display_url: https://dura.dev
logo_url: /images/dura-logo.svg  # NEW

media_folder: public/images
public_folder: /images

# Slug configuration for nested paths
slug:
  encoding: ascii
  clean_accents: true

collections:
  # REORGANIZED: Learn content by domain
  - name: learn-midnight-concepts
    label: "Midnight → Concepts"
    folder: src/content/learn/midnight/concepts
    create: true
    extension: mdx
    slug: "{{slug}}"
    fields:
      - { name: title, label: Title, widget: string }
      - { name: slug, label: Slug, widget: string }
      - { name: type, label: Type, widget: hidden, default: concept }
      - { name: domain, label: Domain, widget: hidden, default: midnight }
      - { name: difficulty, label: Difficulty, widget: select, options: [beginner, intermediate, advanced, expert] }
      - { name: tier, label: Access Tier, widget: select, options: [free, premium], default: free }  # NEW
      - { name: description, label: Description, widget: text }
      - { name: tags, label: Tags, widget: list }
      - { name: prerequisites, label: Prerequisites, widget: relation, collection: learn-midnight-concepts, search_fields: [title], value_field: slug, multiple: true, required: false }
      - { name: relatedConcepts, label: Related Concepts, widget: relation, collection: learn-midnight-concepts, search_fields: [title], value_field: slug, multiple: true, required: false }
      - { name: body, label: Body, widget: markdown }

  - name: learn-midnight-protocols
    label: "Midnight → Protocols"
    folder: src/content/learn/midnight/protocols
    create: true
    extension: mdx
    fields:
      - { name: title, label: Title, widget: string }
      - { name: slug, label: Slug, widget: string }
      - { name: type, label: Type, widget: hidden, default: protocol }
      - { name: domain, label: Domain, widget: hidden, default: midnight }
      - { name: difficulty, label: Difficulty, widget: select, options: [intermediate, advanced, expert] }
      - { name: tier, label: Access Tier, widget: select, options: [free, premium], default: free }
      - { name: description, label: Description, widget: text }
      - { name: body, label: Body, widget: markdown }

  - name: learn-midnight-implementations
    label: "Midnight → Implementations"
    folder: src/content/learn/midnight/implementations
    create: true
    extension: mdx
    fields:
      - { name: title, label: Title, widget: string }
      - { name: slug, label: Slug, widget: string }
      - { name: type, label: Type, widget: hidden, default: implementation }
      - { name: domain, label: Domain, widget: hidden, default: midnight }
      - { name: tier, label: Access Tier, widget: select, options: [free, premium], default: free }
      - { name: body, label: Body, widget: markdown }

  - name: learn-federated-learning
    label: "Federated Learning"
    folder: src/content/learn/federated-learning/concepts
    create: true
    extension: mdx
    fields:
      - { name: title, label: Title, widget: string }
      - { name: type, label: Type, widget: hidden, default: concept }
      - { name: domain, label: Domain, widget: hidden, default: federated-learning }
      - { name: body, label: Body, widget: markdown }

  - name: learn-iot-edge
    label: "IoT & Edge"
    folder: src/content/learn/iot-edge/concepts
    create: true
    extension: mdx
    fields:
      - { name: title, label: Title, widget: string }
      - { name: type, label: Type, widget: hidden, default: concept }
      - { name: domain, label: Domain, widget: hidden, default: iot-edge }
      - { name: body, label: Body, widget: markdown }

  # KEEP: Projects collection
  - name: projects
    label: Projects
    folder: src/content/projects
    create: true
    extension: mdx
    fields:
      - { name: title, label: Title, widget: string }
      - { name: status, label: Status, widget: select, options: [research, development, production] }
      - { name: color, label: Theme Color, widget: select, options: [emerald, amber, cyan] }
      - { name: body, label: Body, widget: markdown }

  # KEEP: Updates collection
  - name: updates
    label: Research Updates
    folder: src/content/updates
    create: true
    extension: mdx
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { name: title, label: Title, widget: string }
      - { name: date, label: Date, widget: datetime }
      - { name: author, label: Author, widget: string }
      - { name: projects, label: Related Projects, widget: select, multiple: true, options: [edgechain, msingi, ndani] }
      - { name: body, label: Body, widget: markdown }

  # NEW: Papers collection (metadata only, PDFs stored separately)
  - name: papers
    label: Papers
    folder: src/content/papers
    create: true
    extension: json
    format: json
    fields:
      - { name: title, label: Title, widget: string }
      - { name: authors, label: Authors, widget: list, fields: [
          { name: name, label: Name, widget: string },
          { name: orcid, label: ORCID, widget: string, required: false }
        ]}
      - { name: year, label: Year, widget: number, value_type: int }
      - { name: venue, label: Venue, widget: string, required: false }
      - { name: doi, label: DOI, widget: string, required: false }
      - { name: arxivId, label: arXiv ID, widget: string, required: false }
      - { name: pdfUrl, label: PDF URL, widget: string, required: false }
      - { name: bibtex, label: BibTeX, widget: text }
      - { name: tags, label: Tags, widget: list }
      - { name: domain, label: Domain, widget: select, options: [midnight, federated-learning, iot-edge, agentic-ai] }
```

### CMS OAuth Configuration

The current setup uses GitHub OAuth. Update the callback URL when deploying to dura.dev:

```
# GitHub OAuth App Settings
Application name: Dura CMS
Homepage URL: https://dura.dev
Authorization callback URL: https://dura.dev/api/auth/callback
```

---

## Content Strategy

### Domain Structure

```
/learn
├── /midnight           ← Currently built (Priority 1)
│   ├── /concepts
│   ├── /protocols  
│   ├── /implementations
│   └── /case-studies
│
├── /federated-learning ← Priority 2
│   ├── /concepts       (gradient averaging, differential privacy, etc.)
│   ├── /frameworks     (TensorFlow Federated, Flower, PySyft)
│   ├── /implementations
│   └── /case-studies   (EdgeChain FL integration)
│
├── /iot-edge           ← Priority 3
│   ├── /concepts       (edge computing, LoRa, mesh networks)
│   ├── /hardware       (ESP32, ATECC608B, Raspberry Pi)
│   ├── /protocols      (MQTT, CoAP, Matter)
│   └── /case-studies   (Ndani hardware architecture)
│
└── /agentic-ai         ← Priority 4 (Solomon's unique angle)
    ├── /concepts       (bounded autonomy, agent coordination)
    ├── /frameworks     (LangChain, AutoGPT, etc.)
    ├── /implementations
    └── /case-studies   (baeIoT as agentic swarm)
```

### Content Template

```mdx
---
title: "Zero-Knowledge Proofs"
slug: "zkp"
type: "concept"
domain: "midnight"
difficulty: "intermediate"
tier: "free"
description: "Cryptographic proofs that reveal nothing except the truth of a statement"
tags: ["cryptography", "privacy", "proofs"]
prerequisites: ["commitment-schemes", "hash-functions"]
related: ["nullifiers", "brace-protocol"]
references: ["goldwasser-1985", "groth16"]
author: "solomon-kembo"
publishedAt: "2025-12-01"
updatedAt: "2026-01-10"
---

import { Callout, Definition, Formula, Exercise, CodeBlock } from '@/components/mdx';

<Definition term="Zero-Knowledge Proof">
A cryptographic protocol where a prover can convince a verifier that a statement 
is true without revealing any information beyond the truth of that statement.
</Definition>

## Why Zero-Knowledge?

In the baeIoT ecosystem, devices need to prove things without revealing identities:
- "I am a registered device" (without revealing *which* device)
- "My sensor reading satisfies the bounty criteria" (without revealing the actual reading)
- "This transaction complies with my spending policy" (without revealing the policy)

<Callout type="insight">
ZK proofs enable **privacy** and **verifiability** simultaneously — 
previously thought to be opposing goals.
</Callout>

## The Classic Example: Colorblind Verifier

<Exercise id="zkp-colorblind" tier="free">
Imagine proving to a colorblind person that two balls are different colors 
without them learning which is red and which is green...
</Exercise>

## Mathematical Foundation

<Formula label="ZK Properties">
$$
\text{A ZK proof system } (P, V) \text{ must satisfy:}
$$
$$
\begin{aligned}
\textbf{Completeness:} & \quad \Pr[V \text{ accepts} | \text{statement is true}] = 1 \\
\textbf{Soundness:} & \quad \Pr[V \text{ accepts} | \text{statement is false}] \leq \epsilon \\
\textbf{Zero-Knowledge:} & \quad \text{View}_V \approx \text{Simulator output}
\end{aligned}
$$
</Formula>

## In Practice: Halo2

<CodeBlock language="rust" filename="simple_circuit.rs">
{`// A Halo2 circuit proving knowledge of a preimage
impl<F: Field> Circuit<F> for PreimageCircuit<F> {
    fn synthesize(&self, cs: &mut ConstraintSystem<F>) {
        let preimage = cs.alloc_private(|| self.preimage);
        let hash = poseidon_hash(cs, preimage);
        cs.constrain_equal(hash, self.public_hash);
    }
}`}
</CodeBlock>

## Connection to Msingi Protocols

In the BRACE protocol, ZK proofs enable:
1. **Anonymous registration**: Prove membership without revealing identity
2. **Unlinkable attestations**: Different nullifiers per epoch
3. **Policy compliance**: Prove transaction satisfies spending rules

→ Continue: [BRACE Protocol](/learn/midnight/protocols/brace)

## References

<References ids={frontmatter.references} />

---

<ContentNav 
  prev={{ slug: "commitment-schemes", title: "Commitment Schemes" }}
  next={{ slug: "nullifiers", title: "Nullifiers" }}
/>
```

---

## Development Workflow

### Local Development

```bash
# Clone and setup
git clone https://github.com/solkem/dura.git
cd dura

# Install dependencies
pnpm install

# Start local services (Postgres, Redis, Meilisearch)
docker-compose up -d

# Run database migrations
pnpm db:migrate

# Seed development data
pnpm db:seed

# Start development server
pnpm dev
```

### Docker Compose (Local)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dura
      POSTGRES_PASSWORD: dura_dev
      POSTGRES_DB: dura
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  meilisearch:
    image: getmeili/meilisearch:v1.6
    environment:
      MEILI_MASTER_KEY: dura_search_dev_key
    ports:
      - "7700:7700"
    volumes:
      - meilisearch_data:/meili_data

volumes:
  postgres_data:
  meilisearch_data:
```

### Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://dura:dura_dev@localhost:5432/dura"

# Redis
REDIS_URL="redis://localhost:6379"

# Search
MEILISEARCH_URL="http://localhost:7700"
MEILISEARCH_KEY="dura_search_dev_key"

# Auth
AUTH_SECRET="generate-a-secure-random-string"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="dura-files"

# Payments (Stripe)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_PREMIUM_MONTHLY=""
STRIPE_PRICE_PREMIUM_YEARLY=""

# Analytics (Plausible)
PLAUSIBLE_DOMAIN="dura.dev"

# Environment
PUBLIC_SITE_URL="http://localhost:4321"
NODE_ENV="development"
```

### Commands Reference

```bash
# Development
pnpm dev              # Start Astro dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:generate      # Generate migrations from schema changes
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed development data
pnpm db:studio        # Open Drizzle Studio

# Search
pnpm search:index     # Rebuild search index

# Testing
pnpm test             # Run tests
pnpm test:e2e         # Run Playwright E2E tests

# Linting
pnpm lint             # ESLint + Prettier check
pnpm lint:fix         # Auto-fix issues

# Deployment
pnpm deploy           # Deploy to Fly.io
```

### Git Workflow

```bash
# Branch naming
feature/add-paper-annotations
fix/search-pagination
docs/update-api-reference
refactor/auth-middleware

# Commit messages (Conventional Commits)
feat(papers): add BibTeX import functionality
fix(auth): resolve session expiration issue
docs(api): document workspace endpoints
refactor(search): optimize indexing performance
test(progress): add unit tests for streak calculation
chore(deps): update Astro to 4.5
```

---

## Deployment

### Fly.io Configuration

```toml
# fly.toml
app = "dura"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

[[services]]
  protocol = "tcp"
  internal_port = 3000

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [services.concurrency]
    type = "connections"
    hard_limit = 100
    soft_limit = 80

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

### Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER astro
EXPOSE 3000

CMD ["node", "./dist/server/entry.mjs"]
```

---

## Integration with baeIoT Ecosystem

### Cross-Linking Strategy

Dura serves as the educational/research hub for the entire baeIoT ecosystem:

```
DURA (Research & Learning)
  │
  ├── Documents Msingi protocols
  │   └── /learn/midnight/protocols/brace → Msingi implementation
  │
  ├── Documents Ndani hardware
  │   └── /learn/iot-edge/hardware/ndani → Hardware guides
  │
  ├── Case studies from EdgeChain
  │   └── /learn/midnight/case-studies/edgechain → Live demo
  │
  └── Links to Disruptive IoT
      └── Footer: "Thought leadership at disruptiveiot.org"
```

### Shared Components

Consider extracting shared UI components to `@baeiot/ui`:

```typescript
// @baeiot/ui (future shared package)
export { Badge } from './Badge';
export { Card } from './Card';
export { Button } from './Button';
// ... used by Dura, EdgeChain UI, etc.
```

### Content Cross-Referencing

```mdx
<!-- In Dura content -->
<Callout type="demo">
See this concept in action: 
[EdgeChain Live Demo](https://edgechain-midnight-ui.fly.dev/)
</Callout>

<!-- In EdgeChain UI -->
<Callout type="learn">
Learn how BRACE works: 
[Dura — BRACE Protocol](https://dura.dev/learn/midnight/protocols/brace)
</Callout>
```

---

## Guiding Principles

### 1. Education First, Marketing Second

Content should genuinely educate. Avoid turning educational content into product marketing. Let the quality of explanations build credibility.

### 2. Open by Default, Premium by Depth

Core concepts should always be free. Premium gates advanced content, exercises, and collaboration — not foundational knowledge.

### 3. Academic Rigor

Cite sources. Link to papers. Acknowledge limitations. Dura should be trustworthy for researchers, not just enthusiasts.

### 4. The Nyakupfuya Test (Extended)

Before any feature: "Would a researcher in rural Zimbabwe with intermittent connectivity find this usable?" Optimize for slow connections and offline capability.

### 5. Community Ownership

Eventually, Dura should accept community contributions. Build toward a model where the community curates and improves content.

---

## AI Agent Development Guidelines

### When Adding Features

1. **Check this CLAUDE.md first** — understand context before coding
2. **Follow existing patterns** — consistency over cleverness
3. **Type everything** — TypeScript strict mode, no `any`
4. **Test at boundaries** — auth, payments, permissions
5. **Document decisions** — update CLAUDE.md when architecture changes

### Code Style

```typescript
// ✅ Preferred: Result types
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

async function getPaper(id: string): Promise<Result<Paper>> {
  const paper = await db.query.papers.findFirst({ where: eq(papers.id, id) });
  if (!paper) return { ok: false, error: new Error('Paper not found') };
  return { ok: true, value: paper };
}

// ❌ Avoid: Throwing exceptions for expected cases
async function getPaper(id: string): Promise<Paper> {
  const paper = await db.query.papers.findFirst({ where: eq(papers.id, id) });
  if (!paper) throw new Error('Paper not found'); // Don't do this
  return paper;
}
```

### Component Patterns

```tsx
// ✅ Preferred: Composition over configuration
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid: Props explosion
<Card 
  title="Title" 
  content="Content" 
  showHeader={true}
  headerVariant="large"
  contentPadding="md"
  // ... 20 more props
/>
```

### API Patterns

```typescript
// ✅ Preferred: Explicit request/response types
const listContentSchema = z.object({
  domain: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

type ListContentRequest = z.infer<typeof listContentSchema>;

interface ListContentResponse {
  data: Content[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Quick Reference

### Key URLs (Target)

| Resource | URL |
|----------|-----|
| Production | https://dura.dev |
| Staging | https://staging.dura.dev |
| API | https://dura.dev/api |
| Docs | https://dura.dev/docs |

### Key Files

| File | Purpose |
|------|---------|
| `src/content/config.ts` | Content collection schemas |
| `src/lib/api.ts` | API client |
| `api/src/db/schema.ts` | Database schema |
| `tailwind.config.js` | Design tokens |

### Key Decisions Log

| Decision | Rationale | Date |
|----------|-----------|------|
| Astro over Next.js | Static-first, better MDX support, islands architecture | Jan 2026 |
| Hono over Express | Lightweight, TypeScript-native, edge-compatible | Jan 2026 |
| Drizzle over Prisma | Type-safe, SQL-like, better performance | Jan 2026 |
| Meilisearch over Algolia | Self-hosted, privacy-respecting, cost-effective | Jan 2026 |
| Lucia over Auth.js | More control, cleaner API, self-hosted | Jan 2026 |

---

## Contact & Resources

| Resource | Link |
|----------|------|
| Lead | Solomon Kembo (@solkem) |
| GitHub (Current) | github.com/solkem/edgechain-msingi-ndani |
| GitHub (Target) | github.com/solkem/dura |
| baeIoT Ecosystem | See CLAUDE_md_baeIoT.pdf |
| Midnight Docs | docs.midnight.network |
| Disruptive IoT | disruptiveiot.org |

---

## 🤖 Quick Start for AI Agents

This section provides step-by-step instructions for an AI agent to begin the Dura migration.

### First Session: Repository Setup & Branding (2-3 hours)

```bash
# Step 1: Clone the existing repository
git clone https://github.com/solkem/edgechain-msingi-ndani.git dura
cd dura

# Step 2: Update package.json
# Change name from "midnight-learning" to "@dura/web"
# Update description to "Dura — The Knowledge Granary"

# Step 3: Update tailwind.config.mjs
# Replace midnight colors with Dura stone/amber palette

# Step 4: Update src/layouts/BaseLayout.astro
# - Change <title> to "Dura — The Knowledge Granary"
# - Replace "🌙 Midnight Learning" with "Dura"
# - Update footer text

# Step 5: Update src/pages/index.astro
# - Change hero heading and tagline
# - Update color classes from purple/midnight to amber/stone

# Step 6: Update public/admin/config.yml
# - Change site_url and display_url
# - Update logo_url

# Step 7: Test locally
npm install
npm run dev
# Verify site loads at http://localhost:4321 with new branding
```

### Second Session: Content Reorganization (2-3 hours)

```bash
# Step 1: Create new directory structure
mkdir -p src/content/learn/midnight/{concepts,protocols,implementations,case-studies}
mkdir -p src/content/learn/federated-learning/concepts
mkdir -p src/content/learn/iot-edge/{concepts,hardware}
mkdir -p src/content/papers

# Step 2: Move existing content
mv src/content/concepts/zkp.mdx src/content/learn/midnight/concepts/
mv src/content/concepts/federated-learning.mdx src/content/learn/federated-learning/concepts/
mv src/content/concepts/trustless-architecture.mdx src/content/learn/iot-edge/concepts/

# Step 3: Update frontmatter in moved files
# Add: type, domain, tier fields

# Step 4: Update src/content/config.ts
# Add new collection schemas for learn/* structure

# Step 5: Create new page routes
# - src/pages/learn/index.astro (hub page)
# - src/pages/learn/[domain]/index.astro (domain index)
# - src/pages/learn/[domain]/[...slug].astro (content page)

# Step 6: Set up redirects from old URLs
# /concepts/zkp → /learn/midnight/zkp

# Step 7: Update navigation
# - Change "Concepts" link to "Learn"
# - Add domain dropdowns
```

### Third Session: Backend Infrastructure (3-4 hours)

```bash
# Step 1: Add dependencies
npm install hono @hono/zod-validator drizzle-orm postgres lucia @lucia-auth/adapter-drizzle arctic zod
npm install -D drizzle-kit

# Step 2: Update astro.config.mjs for hybrid mode
# Add node adapter, change output to 'hybrid'

# Step 3: Create database schema
# Create src/db/schema.ts with users, contents, papers, etc.

# Step 4: Create drizzle.config.ts
# Configure PostgreSQL connection

# Step 5: Create API routes
# Create src/pages/api/[...route].ts with Hono router

# Step 6: Implement auth
# Create src/lib/auth.ts with Lucia setup
# Create login/register pages

# Step 7: Set up local development
# Create docker-compose.yml for Postgres
# Create .env.example with required variables
```

### Validation Checklist

After each session, verify:

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] All existing pages still render
- [ ] New pages are accessible
- [ ] Decap CMS at `/admin` still works
- [ ] TypeScript has no errors (`npm run astro check`)

### Key Files to Always Check

When making changes, always verify these files are consistent:

1. **`src/content/config.ts`** — Content schemas must match MDX frontmatter
2. **`public/admin/config.yml`** — CMS fields must match content schemas
3. **`tailwind.config.mjs`** — Color classes must exist before using
4. **`astro.config.mjs`** — Integrations must be installed before importing

### Common Pitfalls

1. **MDX import paths**: After moving content files, update relative imports
2. **Content collection names**: Must match folder structure exactly
3. **Astro hybrid mode**: API routes need `export const prerender = false`
4. **TypeScript strict**: All props must be typed, no implicit any

### Testing Content Changes

```bash
# After moving content files, verify collections work:
npm run astro check

# If you see "Unknown collection" errors:
# 1. Check src/content/config.ts exports the collection
# 2. Check folder name matches collection name
# 3. Restart dev server (collections cached)
```

---

*"Let knowledge flow like grain from the granary — freely to those who need it, carefully stored for future harvests."*

**Last Updated:** January 2026
