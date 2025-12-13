# CLAUDE.md — Midnight Learning Platform

## Project Identity

**Name**: Midnight Learning Platform  
**Purpose**: Interactive, real-time collaborative research documentation for Midnight-based projects  
**Initial Projects**: EdgeChain, Msingi, Ndani  
**Lead**: Solomon Kembo  
**Status**: Initial implementation

## Core Vision

A living documentation platform where researchers, developers, and reviewers can:
- Learn Midnight/blockchain concepts interactively
- See project-specific examples mapped to theory
- Collaborate asynchronously with real-time updates
- Track research progress and changelog

## Architecture (Option B: Vercel + Decap CMS)

```
┌─────────────────────────────────────────────────────────────┐
│                     ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [Researchers]              [Developers]                   │
│        │                          │                         │
│        ▼                          ▼                         │
│   ┌──────────┐             ┌───────────┐                    │
│   │ Decap    │             │  GitHub   │                    │
│   │ CMS UI   │────────────▶│   Repo    │                    │
│   └──────────┘             └─────┬─────┘                    │
│   (Web editor)                   │                          │
│   /admin                         │ push/merge               │
│                                  ▼                          │
│                          ┌─────────────┐                    │
│                          │   Vercel    │                    │
│                          │ Auto-deploy │                    │
│                          └──────┬──────┘                    │
│                                 │                           │
│                                 ▼                           │
│                          ┌─────────────┐                    │
│                          │  Live Site  │                    │
│                          └─────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | **Astro 4.x** | Static site gen with partial hydration |
| Content | **MDX** | Markdown + React components |
| Components | **React 18** | Interactive FAQ, diagrams |
| Styling | **Tailwind CSS** | Utility-first styling |
| CMS | **Decap CMS** | Git-backed web editor |
| Hosting | **Vercel** | Auto-deploy, edge functions |
| Auth | **GitHub OAuth** | Contributor authentication |

## Project Structure

```
midnight-learning/
├── src/
│   ├── components/
│   │   ├── ConceptCard.astro        # Static concept display
│   │   ├── InteractiveFAQ.tsx       # Expandable FAQ (React)
│   │   ├── ProjectBadge.tsx         # EdgeChain/Msingi/Ndani badges
│   │   ├── Analogy.tsx              # Styled analogy blocks
│   │   ├── ProjectExample.tsx       # Project-specific examples
│   │   ├── UpdateFeed.tsx           # Recent changes sidebar
│   │   └── DiagramView.tsx          # Mermaid/architecture diagrams
│   │
│   ├── content/
│   │   ├── config.ts                # Content collection schemas
│   │   │
│   │   ├── concepts/                # Core Midnight concepts
│   │   │   ├── zkp.mdx
│   │   │   ├── recursive-snarks.mdx
│   │   │   ├── kachina.mdx
│   │   │   ├── disclosure-regime.mdx
│   │   │   ├── did.mdx
│   │   │   ├── noncreds.mdx
│   │   │   ├── dual-token.mdx
│   │   │   ├── capacity-token.mdx
│   │   │   ├── settlement-compliance.mdx
│   │   │   ├── regtech.mdx
│   │   │   ├── algo-regulation.mdx
│   │   │   ├── chain-abstraction.mdx
│   │   │   ├── ouroboros.mdx
│   │   │   ├── rwa.mdx
│   │   │   ├── rollup.mdx
│   │   │   └── snark-stack.mdx
│   │   │
│   │   ├── projects/                # Project overviews
│   │   │   ├── edgechain.mdx
│   │   │   ├── msingi.mdx
│   │   │   └── ndani.mdx
│   │   │
│   │   ├── glossary/                # Quick-reference definitions
│   │   │   └── terms.yaml
│   │   │
│   │   └── updates/                 # Research changelog
│   │       ├── 2024-12-11-initial.mdx
│   │       └── ...
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro         # HTML shell, meta, nav
│   │   ├── ConceptLayout.astro      # Single concept page
│   │   └── ProjectLayout.astro      # Project overview page
│   │
│   ├── pages/
│   │   ├── index.astro              # Landing / concept grid
│   │   ├── concepts/
│   │   │   └── [...slug].astro      # Dynamic concept routes
│   │   ├── projects/
│   │   │   └── [...slug].astro      # Dynamic project routes
│   │   ├── updates.astro            # Changelog feed
│   │   └── faq.astro                # Full interactive FAQ
│   │
│   └── styles/
│       └── global.css               # Tailwind imports + custom
│
├── public/
│   ├── admin/
│   │   ├── index.html               # Decap CMS entry point
│   │   └── config.yml               # CMS field definitions
│   ├── images/
│   │   ├── edgechain-logo.svg
│   │   ├── msingi-logo.svg
│   │   └── ndani-logo.svg
│   └── favicon.svg
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

## Content Schemas

### Concept Schema (`src/content/config.ts`)

```typescript
import { defineCollection, z } from 'astro:content';

const concepts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),        // For nav/badges
    timestamp: z.string().optional(),          // Video timestamp
    projects: z.array(z.enum(['edgechain', 'msingi', 'ndani'])).default([]),
    category: z.enum([
      'cryptography',
      'economics',
      'identity',
      'compliance',
      'infrastructure'
    ]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    lastUpdated: z.coerce.date(),
    updatedBy: z.string(),
    relatedConcepts: z.array(z.string()).default([]),
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

export const collections = { concepts, projects, updates };
```

### Example Concept MDX (`src/content/concepts/zkp.mdx`)

```mdx
---
title: "Zero-Knowledge Proofs (ZKPs)"
shortTitle: "ZKPs"
timestamp: "2:33, 2:44"
projects: ["edgechain", "msingi"]
category: "cryptography"
difficulty: "intermediate"
lastUpdated: 2024-12-11
updatedBy: "solomon"
relatedConcepts: ["recursive-snarks", "snark-stack", "kachina"]
externalLinks:
  - label: "Midnight ZK Docs"
    url: "https://docs.midnight.network/zk"
---

import { Analogy, ProjectExample } from '../../components';

A cryptographic method letting you prove something is true without revealing the underlying data.

<Analogy>
The "Where's Waldo" analogy: You prove you found Waldo by showing him through a tiny hole in a large sheet covering the page. The verifier sees Waldo exists, but learns nothing about where he is or what else is on the page.
</Analogy>

## General Examples

- Prove you're over 21 to a bar without showing your birthdate or address
- Prove you have sufficient funds for a loan without revealing your total balance
- Prove you're a citizen of an approved country without revealing which one

## Project Applications

<ProjectExample project="edgechain">
**ProveYieldAboveThreshold circuit** — farmer proves yield > quota without revealing actual harvest amount. The NGO verifies compliance; the farmer keeps their data private.
</ProjectExample>

<ProjectExample project="msingi">
**BRACE protocol** — device proves it's registered without revealing which device it is (1/N anonymity). Uses commitment `C = H(pk || r)` where pk and r remain secret.
</ProjectExample>

## How It Works (Simplified)

1. **Prover** has secret data (e.g., actual yield = 450kg)
2. **Prover** generates cryptographic proof: "I know a value > 400kg"
3. **Verifier** checks proof validity without learning 450kg
4. **Result**: Statement verified, data protected
```

### Example Project MDX (`src/content/projects/edgechain.mdx`)

```mdx
---
title: "EdgeChain"
tagline: "Privacy-preserving agricultural AI for smallholder farmers"
status: "research"
repo: "https://github.com/your-org/edgechain"
team:
  - name: "Solomon Kembo"
    role: "Project Lead"
  - name: "Shankar Rao Mata"
    role: "Lead Blockchain Developer"
  - name: "Lokesh Yadav"
    role: "Frontend Developer"
lastUpdated: 2024-12-11
updatedBy: "solomon"
---

import { ConceptLink, ArchitectureDiagram } from '../../components';

## Problem

96% of African farmers see digital agriculture as beneficial, yet adoption remains minimal due to justified fears of data exploitation. The "Nyakupfuya" (Shona: trapped farmer) faces surveillance from governments, NGOs, and agribusinesses.

## Solution

EdgeChain uses <ConceptLink slug="zkp">Zero-Knowledge Proofs</ConceptLink> and federated learning to transform data from a weapon of punishment into infrastructure for cooperative empowerment.

## Core Concepts Used

| Concept | Application |
|---------|-------------|
| <ConceptLink slug="zkp" /> | ProveYieldAboveThreshold circuits |
| <ConceptLink slug="kachina" /> | Compact smart contracts |
| <ConceptLink slug="disclosure-regime" /> | Selective compliance proofs |
| <ConceptLink slug="settlement-compliance" /> | Rewards gated by valid proofs |

## Architecture

<ArchitectureDiagram src="/diagrams/edgechain-arch.mermaid" />

## Constraints

- 2G network compatibility (SMS-first)
- 70% of target users live in poverty
- Deep distrust of data collection
- Currently research-only (legal constraints until mid-2027)
```

## Decap CMS Configuration (`public/admin/config.yml`)

```yaml
backend:
  name: github
  repo: your-org/midnight-learning
  branch: main
  base_url: https://your-site.vercel.app
  auth_endpoint: /api/auth

publish_mode: editorial_workflow
media_folder: public/images
public_folder: /images

collections:
  - name: concepts
    label: "Concepts"
    folder: "src/content/concepts"
    create: true
    extension: mdx
    format: frontmatter
    fields:
      - { name: title, label: Title, widget: string }
      - { name: shortTitle, label: "Short Title", widget: string, required: false }
      - { name: timestamp, label: "Video Timestamp", widget: string, required: false }
      - name: projects
        label: Projects
        widget: select
        multiple: true
        options: ["edgechain", "msingi", "ndani"]
      - name: category
        label: Category
        widget: select
        options:
          - { label: "Cryptography", value: "cryptography" }
          - { label: "Economics", value: "economics" }
          - { label: "Identity", value: "identity" }
          - { label: "Compliance", value: "compliance" }
          - { label: "Infrastructure", value: "infrastructure" }
      - name: difficulty
        label: Difficulty
        widget: select
        options: ["beginner", "intermediate", "advanced"]
        default: "intermediate"
      - { name: lastUpdated, label: "Last Updated", widget: datetime }
      - { name: updatedBy, label: "Updated By", widget: string }
      - name: relatedConcepts
        label: "Related Concepts"
        widget: list
        field: { name: slug, label: Slug, widget: string }
      - { name: body, label: Body, widget: markdown }

  - name: projects
    label: "Projects"
    folder: "src/content/projects"
    create: true
    extension: mdx
    format: frontmatter
    fields:
      - { name: title, label: Title, widget: string }
      - { name: tagline, label: Tagline, widget: string }
      - name: status
        label: Status
        widget: select
        options: ["research", "development", "pilot", "production"]
      - { name: repo, label: "Repository URL", widget: string, required: false }
      - name: team
        label: Team
        widget: list
        fields:
          - { name: name, label: Name, widget: string }
          - { name: role, label: Role, widget: string }
      - { name: lastUpdated, label: "Last Updated", widget: datetime }
      - { name: updatedBy, label: "Updated By", widget: string }
      - { name: body, label: Body, widget: markdown }

  - name: updates
    label: "Research Updates"
    folder: "src/content/updates"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    extension: mdx
    format: frontmatter
    fields:
      - { name: title, label: Title, widget: string }
      - { name: date, label: Date, widget: datetime }
      - { name: author, label: Author, widget: string }
      - name: project
        label: Project
        widget: select
        options: ["edgechain", "msingi", "ndani", "platform", "all"]
      - name: type
        label: "Update Type"
        widget: select
        options: ["research", "implementation", "documentation", "review"]
      - { name: body, label: Body, widget: markdown }
```

## Decap CMS Entry Point (`public/admin/index.html`)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manager | Midnight Learning</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

## Key Components

### InteractiveFAQ.tsx

The main interactive component (already built). Features:
- Expandable/collapsible concept cards
- Project-specific examples with color coding
- Timestamp links to source video
- Category filtering

### ProjectBadge.tsx

```tsx
type Project = 'edgechain' | 'msingi' | 'ndani';

const colors: Record<Project, string> = {
  edgechain: 'bg-emerald-600 text-emerald-100',
  msingi: 'bg-amber-600 text-amber-100',
  ndani: 'bg-cyan-600 text-cyan-100'
};

export function ProjectBadge({ project }: { project: Project }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[project]}`}>
      {project === 'edgechain' ? 'EdgeChain' : project === 'msingi' ? 'Msingi' : 'Ndani'}
    </span>
  );
}
```

### Analogy.tsx

```tsx
export function Analogy({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 my-4">
      <span className="text-purple-400 text-xs font-semibold uppercase tracking-wide">
        Analogy
      </span>
      <p className="text-purple-200 mt-2">{children}</p>
    </div>
  );
}
```

### ProjectExample.tsx

```tsx
type Project = 'edgechain' | 'msingi' | 'ndani';

const styles: Record<Project, string> = {
  edgechain: 'bg-emerald-900/40 border-emerald-500/40 text-emerald-200',
  msingi: 'bg-amber-900/40 border-amber-500/40 text-amber-200',
  ndani: 'bg-cyan-900/40 border-cyan-500/40 text-cyan-200'
};

export function ProjectExample({ 
  project, 
  children 
}: { 
  project: Project; 
  children: React.ReactNode 
}) {
  return (
    <div className={`rounded-lg border p-4 my-3 ${styles[project]}`}>
      <ProjectBadge project={project} />
      <div className="mt-2 text-sm">{children}</div>
    </div>
  );
}
```

## Setup Instructions

### 1. Initialize Project

```bash
# Create Astro project
npm create astro@latest midnight-learning -- --template minimal --typescript strict

cd midnight-learning

# Add integrations
npx astro add react tailwind mdx

# Install dependencies
npm install @astrojs/vercel
```

### 2. Configure Astro (`astro.config.mjs`)

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    mdx()
  ],
  output: 'static',
  adapter: vercel()
});
```

### 3. Configure Tailwind (`tailwind.config.mjs`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: '#0a0a1a',
          800: '#12122a',
          700: '#1a1a3a'
        }
      }
    }
  },
  plugins: []
};
```

### 4. Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps → New
2. Set Authorization callback URL: `https://your-site.vercel.app/api/auth/callback`
3. Note Client ID and Client Secret

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - OAUTH_GITHUB_CLIENT_ID
# - OAUTH_GITHUB_CLIENT_SECRET
```

### 6. Create OAuth API Route

Create `src/pages/api/auth/[...slug].ts` for GitHub OAuth flow (or use Decap's built-in Netlify Identity alternative).

## Development Workflow

### Local Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Content Updates

**For Researchers (non-technical):**
1. Navigate to `https://your-site.vercel.app/admin`
2. Login with GitHub
3. Edit concepts/projects/updates via web UI
4. Save → Creates PR automatically
5. Merge PR → Auto-deploys

**For Developers:**
1. Clone repo
2. Edit MDX files directly
3. Push to branch → Create PR
4. Merge → Auto-deploys

### Adding a New Concept

1. Create `src/content/concepts/new-concept.mdx`
2. Add frontmatter with required fields
3. Write explanation, analogy, examples
4. Add `<ProjectExample>` blocks for EdgeChain/Msingi/Ndani
5. Update `relatedConcepts` in relevant existing files

### Adding Research Updates

1. Go to `/admin` → Research Updates → New
2. Fill in date, author, project, type
3. Write update content
4. Save → PR created → Merge

## Code Conventions

### TypeScript

- Strict mode enabled
- Prefer `type` over `interface` for object shapes
- Use discriminated unions for Result types

```typescript
type Result<T, E = Error> = 
  | { ok: true; value: T } 
  | { ok: false; error: E };
```

### Components

- Astro components (`.astro`) for static content
- React components (`.tsx`) for interactivity
- Use `client:load` sparingly, prefer `client:visible`

### Styling

- Tailwind utilities in components
- Custom CSS only in `global.css`
- Project colors: emerald (EdgeChain), amber (Msingi), cyan (Ndani), purple (Midnight general)

### Content

- One concept per MDX file
- Keep explanations concise (aim for 8th-grade reading level)
- Always include analogy + practical examples
- Link related concepts bidirectionally

## Git Workflow

```bash
# Feature branches
git checkout -b feat/add-concept-xyz

# Commit convention
type(scope): description

# Types: feat, fix, docs, refactor, content, style
# Examples:
git commit -m "content(concepts): add recursive-snarks concept"
git commit -m "feat(components): add search functionality"
git commit -m "docs(readme): update setup instructions"
```

## Deployment Checklist

- [ ] All MDX files have valid frontmatter
- [ ] No broken `<ConceptLink>` references
- [ ] Images optimized and in `public/images`
- [ ] Decap CMS config matches content schemas
- [ ] Environment variables set in Vercel
- [ ] OAuth callback URL configured

## Future Enhancements

1. **Search**: Pagefind or Algolia integration
2. **Comments**: GitHub Discussions integration per concept
3. **Quizzes**: Interactive knowledge checks
4. **Progress tracking**: User completion state (localStorage or Supabase)
5. **PDF export**: Generate study guides
6. **i18n**: Shona translation for Zimbabwe pilot users

## Questions This File Should Answer

When working on this platform:

1. **Where does content live?** → `src/content/{concepts,projects,updates}/`
2. **How do I add a concept?** → Create MDX with frontmatter, add ProjectExamples
3. **How do non-devs edit?** → `/admin` Decap CMS web interface
4. **How does deployment work?** → Push to main → Vercel auto-deploys
5. **What's the project color scheme?** → Emerald (EdgeChain), Amber (Msingi), Cyan (Ndani), Purple (Midnight)

---

Last updated: December 2024  
Status: Initial implementation  
Maintainer: Solomon Kembo
