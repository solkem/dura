# CLAUDE.md — Midnight Learning Platform

> **Comprehensive Development Guide for AI Assistants & Contributors**

---

## Table of Contents

1. [Project Identity](#project-identity)
2. [Core Vision & Philosophy](#core-vision--philosophy)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Project Structure](#project-structure)
5. [Content Model](#content-model)
6. [Component Library](#component-library)
7. [Development Workflow](#development-workflow)
8. [Content Guidelines](#content-guidelines)
9. [Design System](#design-system)
10. [Deployment & Operations](#deployment--operations)
11. [Project-Specific Contexts](#project-specific-contexts)
12. [Current Implementation Status](#current-implementation-status)
13. [Roadmap & Future Work](#roadmap--future-work)
14. [FAQ for AI Assistants](#faq-for-ai-assistants)

---

## Project Identity

**Name**: Midnight Learning Platform
**Repository**: `edgechain-msingi-ndani`
**Purpose**: Interactive, real-time collaborative research documentation for privacy-preserving blockchain projects
**Primary Projects**: EdgeChain, Msingi, Ndani
**Lead**: Solomon Kembo
**Current Status**: Active Development (v0.0.1)
**Node Version**: >=20.0.0
**Last Updated**: December 2024

### Core Mission

Transform dense academic blockchain research into accessible, interactive learning experiences that bridge theory and practice. Enable researchers, developers, and reviewers to collaboratively document Zero-Knowledge Proof (ZKP) applications through real-world project examples.

### Key Differentiators

1. **Theory-to-Practice Mapping**: Every concept shows both general cryptographic principles AND specific project implementations
2. **Multi-Persona Authoring**: Non-technical researchers use Decap CMS; developers edit MDX directly
3. **Living Documentation**: Git-backed content with changelog tracking and bidirectional concept linking
4. **Performance-First**: Astro's zero-JS-by-default approach ensures fast load times even in low-bandwidth environments (critical for 2G farmers)

---

## Core Vision & Philosophy

### The Problem We Solve

**Blockchain research documentation typically fails in three ways:**

1. **Inaccessible Theory**: Dense whitepapers (e.g., KACHINA, PlonK) with no intuitive analogies or practical examples
2. **Disconnected Practice**: Code implementations divorced from conceptual foundations—developers don't understand *why* they're writing certain circuits
3. **Static Content**: PDFs and wikis that can't keep pace with rapid research iteration or support collaborative editing

### Our Solution: Interactive Concept Cards

Each concept (e.g., ZKPs, BRACE, Trustless Architecture) includes:

- **Analogy**: Real-world comparison (e.g., "Where's Waldo" for ZKPs)
- **General Examples**: Non-technical use cases (e.g., "Prove you're over 21 without showing your birthdate")
- **Project Examples**: Actual implementations with code/circuit references
  - **EdgeChain**: `ProveYieldAboveThreshold` circuit
  - **Msingi**: BRACE protocol commitment scheme
  - **Ndani**: Device-held wallet spending policies
- **Related Concepts**: Bidirectional links to deepen understanding
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Video Timestamps**: Links to source research presentations

### Target Audiences

| Persona | Use Case | Interaction Method |
|---------|----------|-------------------|
| **Researchers** | Document discoveries, write concept analogies | Decap CMS web editor (`/admin`) |
| **Developers** | Implement circuits, add code examples | Direct MDX editing in IDE |
| **Reviewers** | Validate technical accuracy, suggest improvements | GitHub PR reviews |
| **Learners** | Understand ZKPs, explore project applications | Browse concepts, follow links |
| **Farmers** (EdgeChain) | Understand data privacy guarantees | Simplified concept pages (future: Shona i18n) |

---

## Architecture & Tech Stack

### High-Level Architecture

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
│                          │ (Static)    │                    │
│                          └─────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version | Purpose | Why This Choice? |
|-------|------------|---------|---------|-------------------|
| **Framework** | Astro | 4.16.10 | Static site generation | Zero-JS-by-default, partial hydration, MDX-first |
| **Content** | MDX | 3.1.9 | Markdown + React | Researchers write Markdown, devs embed components |
| **Components** | React | 18.3.1 | Interactive UI | FAQ accordions, simulators, diagrams |
| **Styling** | Tailwind CSS | 4.0.0 | Utility-first CSS | Rapid prototyping, design system tokens |
| **Build Tool** | Vite | 5.4.0 | Dev server, bundling | Fast HMR, ESM-native |
| **Hosting** | Vercel | 7.8.2 | Deployment | Auto-deploy, PR previews, edge functions |
| **CMS** | Decap CMS | (CDN) | Web editor | Git-backed, free, no vendor lock-in |
| **Auth** | GitHub OAuth | (planned) | CMS access | Leverages existing GitHub accounts |

### Architecture Decisions (ADRs)

#### Why Astro over Next.js/Gatsby?

- **Performance**: Ships zero JavaScript by default (Lighthouse scores 95-100)
- **Content-First**: Built for documentation/blogs, not web apps
- **Flexibility**: Use React only where needed (FAQ, diagrams), not everywhere
- **Islands Architecture**: Interactive components hydrate independently

#### Why Decap CMS over Contentful/Sanity?

- **Git-Backed**: Content lives in repo as MDX files, not external database
- **No Vendor Lock-In**: Can migrate to any CMS or pure Git workflows
- **Free**: No per-user or API call pricing
- **Editorial Workflow**: Built-in PR creation for content changes

#### Why MDX over Plain Markdown?

- **Component Embedding**: `<Analogy>`, `<ProjectExample>` provide semantic structure
- **Type Safety**: Frontmatter validated by Zod schemas in `src/content/config.ts`
- **Flexibility**: Can add interactive elements (quizzes, simulators) later

#### Why Tailwind v4?

- **Vite Integration**: Native `@tailwindcss/vite` plugin (faster than PostCSS)
- **Design Tokens**: Color scheme (emerald/amber/cyan) enforced via config
- **Utility-First**: Reduces CSS bundle size vs. BEM/OOCSS

---

## Project Structure

```
edgechain-msingi-ndani/
├── src/
│   ├── components/
│   │   ├── Analogy.tsx                      # Purple analogy blocks
│   │   ├── Annotation.tsx                   # Inline annotations
│   │   ├── ArchitectureDiagram.tsx          # ASCII/Mermaid diagrams
│   │   ├── Comments.tsx                     # Inline comments
│   │   ├── EdgeChainComponents.tsx          # EdgeChain-specific UI
│   │   ├── InteractiveFAQ.tsx               # ✅ BUILT - Expandable FAQ
│   │   ├── Links.tsx                        # ConceptLink, PaperLink
│   │   ├── MsingiComponents.tsx             # Msingi-specific UI
│   │   ├── ProjectBadge.tsx                 # ✅ BUILT - Color-coded badges
│   │   ├── ProjectExample.tsx               # ✅ BUILT - Project examples
│   │   ├── TraceabilityMatrix.tsx           # Requirement mapping
│   │   └── simulations/
│   │       └── KeyExchangeSimulator.tsx     # Interactive demos
│   │
│   ├── content/
│   │   ├── config.ts                        # ✅ Zod schemas for validation
│   │   │
│   │   ├── concepts/                        # Core Midnight concepts
│   │   │   ├── brace.mdx                    # ✅ BUILT - BRACE protocol
│   │   │   ├── federated-learning.mdx       # ✅ BUILT
│   │   │   ├── gabizon-plonk-nodate.mdx     # ✅ BUILT - PlonK paper
│   │   │   ├── kerber-kachina-2021.mdx      # ✅ BUILT - KACHINA paper
│   │   │   ├── trustless-architecture.mdx   # ✅ BUILT - Ndani-specific
│   │   │   └── zkp.mdx                      # ✅ BUILT - Core ZKP concept
│   │   │   # TODO: 10+ more concepts planned
│   │   │
│   │   ├── projects/                        # Project overviews
│   │   │   ├── edgechain.mdx                # ✅ BUILT
│   │   │   ├── msingi.mdx                   # ✅ BUILT
│   │   │   └── ndani.mdx                    # ✅ BUILT
│   │   │
│   │   └── updates/                         # Research changelog
│   │       └── 2024-12-11-initial.mdx       # ✅ BUILT
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro                 # ✅ BUILT - HTML shell, nav
│   │
│   ├── pages/
│   │   ├── index.astro                      # ✅ BUILT - Landing page
│   │   ├── admin.astro                      # ✅ BUILT - CMS entry
│   │   ├── faq.astro                        # ✅ BUILT - Full FAQ
│   │   ├── updates.astro                    # ✅ BUILT - Changelog
│   │   ├── concepts/[...slug].astro         # ✅ BUILT - Dynamic routes
│   │   ├── projects/[...slug].astro         # ✅ BUILT - Dynamic routes
│   │   └── admin/
│   │       └── import.astro                 # ✅ BUILT - BibTeX importer
│   │
│   └── styles/
│       └── global.css                       # Tailwind imports + customs
│
├── public/
│   ├── admin/
│   │   ├── index.html                       # TODO: Decap CMS entry
│   │   └── config.yml                       # TODO: CMS field definitions
│   └── images/                              # Logos, diagrams
│
├── astro.config.mjs                         # ✅ BUILT - Astro config
├── tailwind.config.mjs                      # ✅ BUILT - Tailwind v4 config
├── tsconfig.json                            # ✅ TypeScript strict mode
├── package.json                             # ✅ Dependencies
├── CLAUDE.md                                # This file
├── CLAUDE-ndani.md                          # ✅ Ndani-specific guide
└── README.md                                # ✅ BUILT - Updated public docs
```

---

## Content Model

### Content Collections (Zod Schemas)

#### Concepts (`src/content/config.ts`)

```typescript
const concepts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),                        // "Zero-Knowledge Proofs (ZKPs)"
    shortTitle: z.string().optional(),        // "ZKPs" (for nav/badges)
    timestamp: z.string().optional(),          // "2:33, 2:44" (video links)
    projects: z.array(z.enum(['edgechain', 'msingi', 'ndani'])).default([]),
    category: z.enum([
      'cryptography',      // ZKPs, SNARKs, KACHINA
      'economics',         // Dual-token, RWAs
      'identity',          // DIDs, non-credentials
      'compliance',        // Disclosure regimes, RegTech
      'infrastructure'     // Ouroboros, rollups, chain abstraction
    ]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    lastUpdated: z.coerce.date(),
    updatedBy: z.string(),
    relatedConcepts: z.array(z.string()).default([]),  // Slugs: ["zkp", "kachina"]
    externalLinks: z.array(z.object({
      label: z.string(),
      url: z.string().url()
    })).default([])
  })
});
```

**Example**: [zkp.mdx](src/content/concepts/zkp.mdx)

#### Projects (`src/content/config.ts`)

```typescript
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),                        // "EdgeChain"
    tagline: z.string(),                      // "Privacy-preserving agricultural AI"
    status: z.enum(['research', 'development', 'pilot', 'production']),
    repo: z.string().url().optional(),        // GitHub repo URL
    team: z.array(z.object({
      name: z.string(),
      role: z.string()
    })),
    lastUpdated: z.coerce.date(),
    updatedBy: z.string()
  })
});
```

**Example**: [edgechain.mdx](src/content/projects/edgechain.mdx)

#### Updates (`src/content/config.ts`)

```typescript
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
```

**Example**: [2024-12-11-initial.mdx](src/content/updates/2024-12-11-initial.mdx)

### Content Frontmatter Examples

#### Concept Frontmatter

```yaml
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
```

#### Project Frontmatter

```yaml
---
title: "Ndani"
tagline: "Trustless Privacy-Preserving Infrastructure for Machine Economies"
status: "research"
team:
  - name: "Solomon Kembo"
    role: "Project Lead"
lastUpdated: 2024-12-11
updatedBy: "solomon"
---
```

---

## Component Library

### Built Components (✅)

#### 1. `<Analogy>` ([Analogy.tsx](src/components/Analogy.tsx))

Purple-themed block for real-world comparisons.

```tsx
<Analogy>
The "Where's Waldo" analogy: You prove you found Waldo by showing him through
a tiny hole in a large sheet covering the page. The verifier sees Waldo exists,
but learns nothing about where he is or what else is on the page.
</Analogy>
```

**Styling**:
```css
bg-purple-900/30 border-purple-500/30 text-purple-200
```

#### 2. `<ProjectBadge>` ([ProjectBadge.tsx](src/components/ProjectBadge.tsx))

Color-coded project identifiers.

```tsx
<ProjectBadge project="edgechain" />  // Emerald badge
<ProjectBadge project="msingi" />     // Amber badge
<ProjectBadge project="ndani" />      // Cyan badge
```

#### 3. `<ProjectExample>` ([ProjectExample.tsx](src/components/ProjectExample.tsx))

Project-specific implementation examples.

```tsx
<ProjectExample project="edgechain">
**ProveYieldAboveThreshold circuit** — farmer proves yield > quota without
revealing actual harvest amount. The NGO verifies compliance; the farmer
keeps their data private.
</ProjectExample>
```

**Styling**:
- EdgeChain: `bg-emerald-900/40 border-emerald-500/40`
- Msingi: `bg-amber-900/40 border-amber-500/40`
- Ndani: `bg-cyan-900/40 border-cyan-500/40`

#### 4. `<InteractiveFAQ>` ([InteractiveFAQ.tsx](src/components/InteractiveFAQ.tsx))

React component with expandable/collapsible concept cards, category filtering, and project badges.

**Features**:
- Expandable/collapsible sections
- Category filtering (Cryptography, Economics, etc.)
- Project-specific examples with color coding
- Timestamp links to source video
- Difficulty badges

#### 5. `<ConceptLink>` ([Links.tsx](src/components/Links.tsx))

Bidirectional concept linking.

```tsx
<ConceptLink slug="zkp">Zero-Knowledge Proofs</ConceptLink>
```

#### 6. `<ArchitectureDiagram>` ([ArchitectureDiagram.tsx](src/components/ArchitectureDiagram.tsx))

ASCII art or Mermaid diagram renderer.

```tsx
<ArchitectureDiagram src="/diagrams/edgechain-arch.mermaid" />
```

### Planned Components (TODO)

- `<Quiz>` — Interactive knowledge checks
- `<ProgressTracker>` — User completion state
- `<SearchBar>` — Full-text search (Pagefind)
- `<VideoEmbed>` — Timestamp-linked video player
- `<BibliographyCard>` — Academic paper citations

---

## Development Workflow

### Local Development

```bash
# Clone repository
git clone https://github.com/your-org/edgechain-msingi-ndani.git
cd edgechain-msingi-ndani

# Install dependencies (requires Node.js 20+)
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type-check Astro/TypeScript files
npm run astro check
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/add-concept-xyz

# Commit convention: type(scope): description
# Types: feat, fix, docs, refactor, content, style

git commit -m "content(concepts): add recursive-snarks concept"
git commit -m "feat(components): add search functionality"
git commit -m "docs(readme): update setup instructions"

# Push and create PR
git push origin feat/add-concept-xyz
```

### Adding Content

#### Adding a Concept

1. Create `src/content/concepts/your-concept.mdx`
2. Add frontmatter with required fields (see [Content Model](#content-model))
3. Write:
   - Brief explanation (1-2 paragraphs)
   - `<Analogy>` block
   - General examples (3-5 bullet points)
   - `<ProjectExample>` blocks for relevant projects
   - "How It Works" section (simplified steps)
4. Update `relatedConcepts` in bidirectionally linked concepts
5. Test locally: `npm run dev`

**Template**:

```mdx
---
title: "Your Concept Name"
shortTitle: "Acronym"
projects: ["edgechain"]
category: "cryptography"
difficulty: "intermediate"
lastUpdated: 2024-12-24
updatedBy: "your-name"
relatedConcepts: ["zkp", "kachina"]
externalLinks:
  - label: "Midnight Docs"
    url: "https://docs.midnight.network/your-concept"
---

import { Analogy, ProjectExample } from '../../components';

Brief explanation in plain language.

<Analogy>
Real-world comparison that makes the concept intuitive.
</Analogy>

## General Examples

- Example 1
- Example 2

## Project Applications

<ProjectExample project="edgechain">
How EdgeChain uses this concept with specific circuit/code references.
</ProjectExample>

## How It Works (Simplified)

1. Step 1
2. Step 2
3. Result
```

#### Adding a Research Update

1. Create `src/content/updates/YYYY-MM-DD-title.mdx`
2. Add frontmatter (date, author, project, type)
3. Write update content
4. Commit and push

#### Adding a Project

1. Create `src/content/projects/project-name.mdx`
2. Add frontmatter (team, status, repo)
3. Write:
   - Problem statement
   - Solution overview
   - Core concepts table (with `<ConceptLink>`)
   - Architecture diagram
   - Constraints/trade-offs

---

## Content Guidelines

### Writing Style

- **Reading Level**: 8th-grade comprehension (use [Hemingway Editor](http://www.hemingwayapp.com/))
- **Tone**: Professional but accessible, avoid jargon without definitions
- **Length**: Concepts should be scannable in <3 minutes
- **Analogies**: One per concept, prioritize everyday experiences over technical metaphors
- **Examples**: General first (non-technical), then project-specific (with code/circuits)

### Structure Requirements

1. **Every concept MUST have**:
   - Title and category
   - At least one analogy
   - 3+ general examples
   - At least one `<ProjectExample>` if `projects` array is non-empty
   - Related concepts (bidirectional linking)

2. **Projects MUST have**:
   - Problem/Solution sections
   - Core concepts table with `<ConceptLink>` references
   - Constraints/trade-offs section

3. **Updates MUST have**:
   - Date and author
   - Project association
   - Type classification (research/implementation/documentation/review)

### Bidirectional Linking

When adding a new concept, update ALL related concepts to link back.

**Example**: If `zkp.mdx` lists `relatedConcepts: ["kachina"]`, then `kachina.mdx` should list `relatedConcepts: ["zkp"]`.

### External Links

Always provide source documentation links:

```yaml
externalLinks:
  - label: "Midnight ZK Docs"
    url: "https://docs.midnight.network/zk"
  - label: "KACHINA Paper (2021)"
    url: "https://eprint.iacr.org/2021/1143"
```

---

## Design System

### Color Palette

```css
/* Project Colors */
--edgechain-primary: #059669;      /* emerald-600 */
--edgechain-bg: #064e3b;           /* emerald-900 */
--edgechain-text: #d1fae5;         /* emerald-100 */

--msingi-primary: #d97706;         /* amber-600 */
--msingi-bg: #78350f;              /* amber-900 */
--msingi-text: #fef3c7;            /* amber-100 */

--ndani-primary: #0891b2;          /* cyan-600 */
--ndani-bg: #164e63;               /* cyan-900 */
--ndani-text: #cffafe;             /* cyan-100 */

/* Midnight General */
--midnight-purple: #a855f7;        /* purple-500 (analogies) */
--midnight-bg: #0a0a1a;            /* midnight-900 */
--midnight-bg-medium: #12122a;     /* midnight-800 */
--midnight-bg-light: #1a1a3a;      /* midnight-700 */
```

### Typography

- **Font Family**: System font stack (`ui-sans-serif, system-ui, sans-serif`)
- **Headings**: Bold, increased letter-spacing
- **Code**: Monospace (`ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace`)

### Component Patterns

1. **Cards**: `rounded-lg border p-4 my-3`
2. **Badges**: `px-2 py-0.5 rounded text-xs font-medium`
3. **Buttons**: `px-4 py-2 rounded-md font-medium hover:opacity-90`
4. **Containers**: `max-w-4xl mx-auto px-4`

### Responsive Breakpoints

```javascript
// tailwind.config.mjs
theme: {
  screens: {
    'sm': '640px',   // Mobile landscape
    'md': '768px',   // Tablet
    'lg': '1024px',  // Desktop
    'xl': '1280px',  // Wide desktop
  }
}
```

---

## Deployment & Operations

### Vercel Deployment

**Current Status**: TODO (not yet deployed)

**Setup Steps**:

1. Import repository to Vercel
2. Set environment variables:
   ```
   OAUTH_GITHUB_CLIENT_ID=your_client_id
   OAUTH_GITHUB_CLIENT_SECRET=your_client_secret
   ```
3. Configure GitHub OAuth app:
   - Authorization callback URL: `https://your-site.vercel.app/api/auth/callback`
4. Deploy: Auto-deploys on push to `main` branch

### Deployment Checklist

- [ ] All MDX files have valid frontmatter (run `npm run astro check`)
- [ ] No broken `<ConceptLink>` references
- [ ] Images optimized (<100KB per image) and in `public/images/`
- [ ] Decap CMS config (`public/admin/config.yml`) matches content schemas
- [ ] Environment variables set in Vercel dashboard
- [ ] OAuth callback URL configured in GitHub app settings

### Performance Targets

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Time to Interactive (TTI)**: <3s on 3G
- **First Contentful Paint (FCP)**: <1.5s
- **Total Bundle Size**: <100KB (excluding images)

---

## Project-Specific Contexts

### EdgeChain

**Tagline**: Privacy-preserving agricultural AI for smallholder farmers
**Color**: Emerald (`emerald-600`)
**Status**: Research (legal constraints until mid-2027)
**Key Concept**: `ProveYieldAboveThreshold` circuit

**Problem**: 96% of African farmers see digital agriculture as beneficial, yet adoption remains minimal due to justified fears of data exploitation. The "Nyakupfuya" (Shona: trapped farmer) faces surveillance from governments, NGOs, and agribusinesses.

**Solution**: Use ZKPs and federated learning to transform data from a weapon of punishment into infrastructure for cooperative empowerment.

**Constraints**:
- 2G network compatibility (SMS-first)
- 70% of target users live in poverty
- Deep distrust of data collection
- Currently research-only (legal constraints until mid-2027)

**Core Concepts**: ZKPs, KACHINA, Disclosure Regimes, Settlement Compliance, Federated Learning

**See**: [edgechain.mdx](src/content/projects/edgechain.mdx)

---

### Msingi

**Tagline**: Privacy-preserving infrastructure for agricultural IoT
**Color**: Amber (`amber-600`)
**Status**: Development
**Key Concept**: BRACE protocol (Blind Registration via Anonymous Commitment Enrollment)

**Problem**: Standard IoT-blockchain systems expose device identities on-chain, enabling surveillance.

**Solution**: BRACE protocol — device proves it's registered without revealing which device it is (1/N anonymity). Uses commitment `C = H(pk || r)` where `pk` and `r` remain secret.

**Architecture**: Gateway-based (trusted gateway generates ZK proofs on behalf of devices)

**Core Concepts**: ZKPs, BRACE, Device Registration, Gateway Architecture

**See**: [msingi.mdx](src/content/projects/msingi.mdx), [brace.mdx](src/content/concepts/brace.mdx)

---

### Ndani

**Tagline**: Trustless Privacy-Preserving Infrastructure for Machine Economies
**Color**: Cyan (`cyan-600`)
**Status**: Research (Experimental)
**Key Concept**: Trustless Architecture (no-gateway proof generation)

**Problem**: Existing IoT-blockchain systems (IOTA, Helium) allow devices to earn, but payments flow to human-controlled wallets. Furthermore, privacy solutions often rely on a trusted gateway to generate proofs.

**Solution**: **Ndani** (Swahili for "Inside") moves the entire trust boundary *inside* the farmer's control:
1. **Device-Held Wallets**: Keys live in ATECC608A secure element
2. **Local Proof Server**: Farmer-owned Raspberry Pi 5 generates ZK proofs locally

**Key Differentiator from Msingi**:
- **Msingi**: Gateway-based, lower cost (~$50), privacy against chain observers
- **Ndani**: Trustless (local proof server), higher cost (~$160), privacy against ALL external observers

**Hardware Stack**:
- ESP32-S3 (Sensor Microcontroller): $8.00
- ATECC608A (Identity + Wallet Keys): $2.50
- SX1276 (LoRa Transceiver): $6.00
- Sensors/Power (Env + Solar): $22.00
- Raspberry Pi 5 (Local Proof Server): $80.00
- Pi Infrastructure (Power + Case + SD): $35.00
- **Total**: ~$163.50

**Core Concepts**: Trustless Architecture, Device Wallets, ZK Spending Policies, BRACE

**See**: [ndani.mdx](src/content/projects/ndani.mdx), [CLAUDE-ndani.md](CLAUDE-ndani.md), [trustless-architecture.mdx](src/content/concepts/trustless-architecture.mdx)

---

## Current Implementation Status

### ✅ Completed

**Infrastructure**:
- [x] Astro 4.16.10 + React 18 + Tailwind v4 setup
- [x] MDX content collections with Zod validation
- [x] TypeScript strict mode configuration
- [x] Git repository initialized
- [x] Package.json with npm scripts
- [x] Updated README.md (comprehensive)
- [x] This CLAUDE.md guide
- [x] CLAUDE-ndani.md (Ndani-specific)

**Layouts & Pages**:
- [x] BaseLayout.astro (HTML shell, navigation)
- [x] index.astro (Landing page)
- [x] faq.astro (Interactive FAQ page)
- [x] updates.astro (Changelog feed)
- [x] concepts/[...slug].astro (Dynamic concept routes)
- [x] projects/[...slug].astro (Dynamic project routes)
- [x] admin.astro (CMS entry point)
- [x] admin/import.astro (BibTeX importer)

**Components**:
- [x] Analogy.tsx (Purple analogy blocks)
- [x] Annotation.tsx (Inline annotations)
- [x] ArchitectureDiagram.tsx (Diagram renderer)
- [x] Comments.tsx (Inline comments)
- [x] EdgeChainComponents.tsx (EdgeChain-specific UI)
- [x] InteractiveFAQ.tsx (Expandable FAQ with filtering)
- [x] Links.tsx (ConceptLink, PaperLink)
- [x] MsingiComponents.tsx (Msingi-specific UI)
- [x] ProjectBadge.tsx (Color-coded badges)
- [x] ProjectExample.tsx (Project examples)
- [x] TraceabilityMatrix.tsx (Requirement mapping)
- [x] simulations/KeyExchangeSimulator.tsx (Interactive demo)

**Content**:
- [x] 6 Concepts: zkp, brace, federated-learning, trustless-architecture, gabizon-plonk-nodate, kerber-kachina-2021
- [x] 3 Projects: edgechain, msingi, ndani
- [x] 1 Update: 2024-12-11-initial

### 🚧 In Progress

- [ ] Decap CMS configuration (`public/admin/config.yml`)
- [ ] GitHub OAuth integration
- [ ] Vercel deployment
- [ ] Additional 10+ concept pages (see [Roadmap](#roadmap--future-work))

### ⏳ Planned

**Phase 1: Core Content (Next 4 weeks)**:
- [ ] Recursive SNARKs concept
- [ ] KACHINA framework concept
- [ ] Disclosure Regimes concept
- [ ] Settlement Compliance concept
- [ ] Dual-Token Model concept
- [ ] DIDs (Decentralized Identifiers) concept
- [ ] Ouroboros Consensus concept
- [ ] Chain Abstraction concept
- [ ] Rollup Architecture concept
- [ ] RWAs (Real-World Assets) concept

**Phase 2: Enhanced Learning (Q1 2025)**:
- [ ] Full-text search (Pagefind or Algolia)
- [ ] Interactive quizzes per concept
- [ ] Progress tracking (localStorage or Supabase)
- [ ] Mermaid diagram support
- [ ] Video timestamp deep-linking

**Phase 3: Collaboration (Q2 2025)**:
- [ ] GitHub Discussions integration (comments per concept)
- [ ] Contributor profiles
- [ ] Research changelog RSS feed
- [ ] PDF export for offline study guides

**Phase 4: Accessibility (Q3 2025)**:
- [ ] i18n support (Shona translation for Zimbabwe pilot)
- [ ] SMS-based content delivery (for 2G users)
- [ ] Audio descriptions for diagrams
- [ ] Dark/light theme toggle

---

## Roadmap & Future Work

### Short-Term (Next 2 Weeks)

1. **Complete Decap CMS Setup**:
   - Finalize `public/admin/config.yml`
   - Test editorial workflow (draft → review → publish)
   - Document CMS usage for researchers

2. **Deploy to Vercel**:
   - Configure environment variables
   - Set up GitHub OAuth
   - Test auto-deploy on PR merge

3. **Add 5 More Concepts**:
   - Recursive SNARKs
   - KACHINA framework
   - Disclosure Regimes
   - Settlement Compliance
   - Dual-Token Model

### Mid-Term (Next 3 Months)

1. **Search Functionality**:
   - Integrate Pagefind (static search)
   - Add search bar to navigation
   - Enable concept/project filtering

2. **Interactive Elements**:
   - Build `<Quiz>` component
   - Add knowledge checks to concepts
   - Track user progress (localStorage)

3. **Performance Optimization**:
   - Image optimization (WebP, lazy loading)
   - Bundle size analysis
   - Lighthouse audit + fixes

### Long-Term (6+ Months)

1. **i18n Support**:
   - Shona translation for EdgeChain farmers
   - Language switcher component
   - Localized routes (`/sn/concepts/zkp`)

2. **Advanced Features**:
   - GitHub Discussions integration
   - PDF export for offline study
   - SMS-based content delivery
   - Audio descriptions for diagrams

3. **Community Building**:
   - Contributor onboarding guide
   - Monthly research updates
   - Video tutorial series

---

## FAQ for AI Assistants

### Q1: Where does content live?

**A**: `src/content/{concepts,projects,updates}/` as MDX files with frontmatter validated by Zod schemas in `src/content/config.ts`.

### Q2: How do I add a new concept?

**A**:
1. Create `src/content/concepts/your-concept.mdx`
2. Add frontmatter (title, category, difficulty, etc.)
3. Write analogy, examples, project applications
4. Update `relatedConcepts` in bidirectionally linked concepts
5. Test with `npm run dev`

### Q3: How do non-technical users edit content?

**A**: Via Decap CMS web interface at `/admin` (TODO: needs setup). Researchers login with GitHub, edit via web forms, and save creates a PR automatically.

### Q4: What's the project color scheme?

**A**:
- **EdgeChain**: Emerald (`emerald-600`, `#059669`)
- **Msingi**: Amber (`amber-600`, `#d97706`)
- **Ndani**: Cyan (`cyan-600`, `#0891b2`)
- **Midnight General**: Purple (`purple-500`, `#a855f7`)

### Q5: How does deployment work?

**A**: Push to `main` branch → Vercel auto-deploys (TODO: needs setup). PR previews are automatically generated.

### Q6: What components are available?

**A**: See [Component Library](#component-library). Key components:
- `<Analogy>` — Purple analogy blocks
- `<ProjectExample>` — Color-coded project examples
- `<ProjectBadge>` — Project identifiers
- `<ConceptLink>` — Bidirectional concept linking
- `<InteractiveFAQ>` — Expandable FAQ with filtering

### Q7: How do I add a diagram?

**A**: Use `<ArchitectureDiagram>` component:
```tsx
<ArchitectureDiagram src="/diagrams/your-diagram.mermaid" />
```
Or use ASCII art directly in MDX.

### Q8: What's the difference between Msingi and Ndani?

**A**:
- **Msingi**: Gateway-based, lower cost (~$50), privacy against chain observers
- **Ndani**: Trustless (local proof server), higher cost (~$160), privacy against ALL external observers, device-held wallets

### Q9: How do I cite an academic paper?

**A**: Add to `externalLinks` in frontmatter:
```yaml
externalLinks:
  - label: "KACHINA Paper (2021)"
    url: "https://eprint.iacr.org/2021/1143"
```
Or use BibTeX importer at `/admin/import`.

### Q10: What's the target reading level?

**A**: 8th-grade comprehension. Use simple language, avoid jargon, include analogies. Test with [Hemingway Editor](http://www.hemingwayapp.com/).

### Q11: How do I handle multi-project concepts?

**A**: List all projects in `projects` array, then add `<ProjectExample>` blocks for each:
```mdx
---
projects: ["edgechain", "msingi", "ndani"]
---

<ProjectExample project="edgechain">
EdgeChain uses this for...
</ProjectExample>

<ProjectExample project="msingi">
Msingi uses this for...
</ProjectExample>
```

### Q12: What's the file naming convention?

**A**:
- **Concepts**: `lowercase-hyphenated.mdx` (e.g., `zero-knowledge-proofs.mdx`)
- **Projects**: `lowercase-single-word.mdx` (e.g., `edgechain.mdx`)
- **Updates**: `YYYY-MM-DD-title.mdx` (e.g., `2024-12-11-initial.mdx`)

### Q13: How do I test changes locally?

**A**:
```bash
npm run dev        # Start dev server at localhost:4321
npm run build      # Build for production
npm run preview    # Preview production build
npm run astro check # Type-check
```

### Q14: What's the recommended workflow for large features?

**A**:
1. Create feature branch: `git checkout -b feat/feature-name`
2. Make changes incrementally
3. Test locally after each change
4. Commit with conventional commits: `feat(scope): description`
5. Push and create PR
6. Request review from Solomon Kembo
7. Merge after approval

### Q15: Where can I find examples?

**A**:
- **Concept Examples**: [zkp.mdx](src/content/concepts/zkp.mdx), [brace.mdx](src/content/concepts/brace.mdx)
- **Project Examples**: [edgechain.mdx](src/content/projects/edgechain.mdx), [ndani.mdx](src/content/projects/ndani.mdx)
- **Component Examples**: [InteractiveFAQ.tsx](src/components/InteractiveFAQ.tsx), [ProjectExample.tsx](src/components/ProjectExample.tsx)

---

## Questions This File Should Answer

When an AI assistant or contributor is working on this platform, this file should answer:

1. ✅ **What is this project?** → Midnight Learning Platform for privacy-preserving blockchain research
2. ✅ **What's the tech stack?** → Astro 4 + React 18 + Tailwind v4 + MDX
3. ✅ **Where does content live?** → `src/content/{concepts,projects,updates}/`
4. ✅ **How do I add a concept?** → Create MDX with frontmatter, add analogies and examples
5. ✅ **What components are available?** → See Component Library section
6. ✅ **What's the color scheme?** → Emerald (EdgeChain), Amber (Msingi), Cyan (Ndani)
7. ✅ **How do I cite papers?** → Use `externalLinks` in frontmatter or BibTeX importer
8. ✅ **What's the difference between projects?** → See Project-Specific Contexts
9. ✅ **How do I deploy?** → Push to main → Vercel auto-deploys (TODO: setup)
10. ✅ **What's the roadmap?** → See Roadmap & Future Work section

---

## Maintainers

**Project Lead**: Solomon Kembo
**Contributors**: Shankar Rao Mata, Lokesh Yadav, [Your Name Here]

**Contact**: [GitHub Discussions](https://github.com/your-org/edgechain-msingi-ndani/discussions)

---

## License

[Choose License: MIT, Apache 2.0, or Custom Research License]

---

**Last Updated**: December 24, 2024
**Status**: Active Development
**Version**: 0.0.1
**Maintainer**: Solomon Kembo

---

## Changelog

### 2024-12-24
- ✅ Created comprehensive CLAUDE.md guide
- ✅ Updated README.md with detailed project information
- ✅ Documented all existing components and content
- ✅ Added FAQ for AI Assistants section
- ✅ Outlined complete roadmap

### 2024-12-11
- ✅ Initial repository setup
- ✅ Astro + React + Tailwind v4 configuration
- ✅ First 6 concepts published
- ✅ 3 project pages created
- ✅ InteractiveFAQ component built
