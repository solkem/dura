# Dura Migration: Implementation Plan

Transforming **Midnight Learning Hub** → **Dura — The Knowledge Granary**

## Overview

| Attribute | Current | Target |
|-----------|---------|--------|
| **Name** | "Midnight Learning" | "Dura — The Knowledge Granary" |
| **Theme** | Purple/Midnight | Amber/Stone (warm, harvest-inspired) |
| **Repo** | `solkem/dura` (already renamed) | ✅ Done |
| **Content Structure** | Flat `/concepts/` | Nested `/learn/[domain]/[type]/` |

---

## Phase 0: Repository & Package Setup

**Timeline:** Day 1 (1-2 hours)

### Files to Modify

#### [MODIFY] [package.json](file:///Users/solomonkembo/Downloads/dura-astro/dura/package.json)

```diff
 {
-  "name": "midnight-learning",
+  "name": "@dura/web",
   "type": "module",
-  "version": "0.0.1",
+  "version": "0.2.0",
+  "description": "Dura — The Knowledge Granary. Industry-grade research platform for privacy-preserving systems.",
   "scripts": {
```

#### [DELETE] [vercel.json](file:///Users/solomonkembo/Downloads/dura-astro/dura/vercel.json)
- Remove since we're using Fly.io only

#### [MODIFY] CLAUDE Files
- Consolidate content from:
  - `CLAUDE-edgechain.md` → merge key info into `CLAUDE.md`
  - `CLAUDE-msingi.md` → merge key info into `CLAUDE.md`  
  - `CLAUDE-ndani.md` → merge key info into `CLAUDE.md`
- Replace `CLAUDE.md` with content from `CLAUDE_Dura.md`
- Delete individual project CLAUDE files after consolidation

---

## Phase 1: Visual Rebranding

**Timeline:** Week 1 (4-6 hours)

### 1.1 Color Palette Update

#### [MODIFY] [tailwind.config.mjs](file:///Users/solomonkembo/Downloads/dura-astro/dura/tailwind.config.mjs)

Replace `brand` colors with `dura` theme. Keep project colors (edgechain, msingi, cyan).

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                // NEW: Dura Primary Theme (Warm Amber/Stone)
                dura: {
                    50: '#fefdfb',
                    100: '#fdfaf5',
                    200: '#faf0e4',
                    300: '#f5e1c8',
                    400: '#f59e0b',   // amber-500 accent
                    500: '#b45309',   // amber-600 primary
                    600: '#92400e',   // amber-700 dark
                    700: '#78350f',
                    800: '#451a03',
                    900: '#1c1917',   // stone-900 background
                    950: '#0c0a09',   // stone-950 deep
                },
                // Background system
                surface: {
                    DEFAULT: '#1c1917',  // stone-900
                    subtle: '#292524',   // stone-800
                    elevated: '#44403c', // stone-700
                },
                // Content type colors
                concept: '#0ea5e9',       // sky-500
                protocol: '#8b5cf6',      // violet-500
                implementation: '#10b981', // emerald-500
                'case-study': '#f97316',  // orange-500
                research: '#ec4899',      // pink-500
                
                // KEEP: Project colors (existing)
                edgechain: {
                    // ... existing emerald scale
                },
                msingi: {
                    // ... existing amber scale
                },
                cyan: {
                    // ... existing cyan scale
                }
            }
        }
    },
    plugins: []
};
```

### 1.2 Layout Rebranding

#### [MODIFY] [BaseLayout.astro](file:///Users/solomonkembo/Downloads/dura-astro/dura/src/layouts/BaseLayout.astro)

Key changes:
- Title: "Dura — The Knowledge Granary"
- Logo: Replace "Midnight Learning" with "Dura"
- Navigation: "Concepts" → "Learn"
- Footer: Add baeIoT ecosystem reference
- Colors: `brand-*` → `dura-*` throughout

```astro
---
const { title = "Dura — The Knowledge Granary" } = Astro.props;
import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Dura — The Knowledge Granary. Industry-grade research platform for privacy-preserving systems." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body
    class="bg-white text-slate-900 font-medium min-h-screen flex flex-col selection:bg-dura-200 selection:text-dura-800"
  >
    <div
      class="fixed inset-x-0 top-0 h-96 bg-gradient-to-b from-amber-50 to-transparent -z-10 pointer-events-none"
    >
    </div>

    <header
      class="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50"
    >
      <nav
        class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"
      >
        <a
          href="/"
          class="text-xl font-bold tracking-tight text-amber-800 flex items-center gap-2"
        >
          <span class="text-2xl">🌾</span>
          <span>Dura</span>
        </a>
        <div class="flex gap-8 text-sm font-medium">
          <a
            href="/learn"
            class="text-slate-600 hover:text-amber-600 transition-colors"
            >Learn</a
          >
          <a
            href="/projects/edgechain"
            class="text-slate-600 hover:text-amber-600 transition-colors"
            >EdgeChain</a
          >
          <a
            href="/projects/msingi"
            class="text-slate-600 hover:text-amber-600 transition-colors"
            >Msingi</a
          >
          <a
            href="/projects/ndani"
            class="text-slate-600 hover:text-amber-600 transition-colors"
            >Ndani</a
          >
          <a
            href="/updates"
            class="text-slate-600 hover:text-amber-600 transition-colors"
            >Updates</a
          >
        </div>
        <a
          href="/faq"
          class="px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
        >
          Explore FAQ
        </a>
      </nav>
    </header>

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <slot />
    </main>

    <footer
      class="border-t border-slate-100 py-12 text-center text-slate-500 text-sm bg-slate-50"
    >
      <p>© {new Date().getFullYear()} Dura — The Knowledge Granary</p>
      <p class="mt-2 text-xs text-slate-400">
        Part of the <a href="https://disruptiveiot.org" class="underline hover:text-amber-600">baeIoT ecosystem</a>
      </p>
    </footer>
  </body>
</html>
```

### 1.3 Landing Page Update

#### [MODIFY] [index.astro](file:///Users/solomonkembo/Downloads/dura-astro/dura/src/pages/index.astro)

Key changes:
- Hero text: New tagline emphasizing "Knowledge Granary"
- Colors: Replace `brand-*` with `dura-*` / `amber-*`
- Section headings: Update to match Dura branding

```diff
-<BaseLayout title="Midnight Learning Hub">
+<BaseLayout title="Dura — The Knowledge Granary">
   <div class="text-center mb-20 pt-8">
-    <h1 class="text-6xl font-extrabold text-brand-950 mb-6 tracking-tight">
-      Make research <span class="italic text-brand-600 font-serif"
+    <h1 class="text-6xl font-extrabold text-stone-900 mb-6 tracking-tight">
+      The <span class="italic text-amber-600 font-serif"
-        >engaging</span
-      > with<br />
-      real-time documentation.
+        >Knowledge</span
+      > Granary<br />
+      for privacy research.
     </h1>
     <p class="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
-      Interactive research documentation for EdgeChain (Human Privacy), Msingi
-      (Device Privacy), and Ndani (Trustless Infrastructure).
+      Industry-grade learning platform for zero-knowledge proofs, blockchain privacy, 
+      and trustless IoT systems.
     </p>
   </div>
```

### 1.4 Brand Assets

#### [NEW] [public/favicon.svg](file:///Users/solomonkembo/Downloads/dura-astro/dura/public/favicon.svg)

Replace current favicon with grain/granary-themed icon:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#b45309"/>
  <text x="16" y="23" text-anchor="middle" font-size="20">🌾</text>
</svg>
```

#### [NEW] [public/images/dura-logo.svg](file:///Users/solomonkembo/Downloads/dura-astro/dura/public/images/dura-logo.svg)

Full Dura logo for OG images and larger displays.

---

## Phase 2: Content Reorganization

**Timeline:** Week 2 (4-6 hours)

### 2.1 Create New Directory Structure

```bash
# Create learn domain folders
mkdir -p src/content/learn/midnight/{concepts,protocols,implementations,case-studies}
mkdir -p src/content/learn/federated-learning/concepts
mkdir -p src/content/learn/iot-edge/{concepts,hardware}
mkdir -p src/content/papers
```

### 2.2 Move Existing Content

| Current Location | New Location |
|-----------------|--------------|
| `src/content/concepts/zkp.mdx` | `src/content/learn/midnight/concepts/zkp.mdx` |
| `src/content/concepts/brace.mdx` | `src/content/learn/midnight/protocols/brace.mdx` |
| `src/content/concepts/federated-learning.mdx` | `src/content/learn/federated-learning/concepts/federated-learning.mdx` |
| `src/content/concepts/trustless-architecture.mdx` | `src/content/learn/iot-edge/concepts/trustless-architecture.mdx` |
| `src/content/concepts/gabizon-plonk-nodate.mdx` | `src/content/papers/gabizon-plonk-nodate.json` (convert) |
| `src/content/concepts/kerber-kachina-2021.mdx` | `src/content/papers/kerber-kachina-2021.json` (convert) |

### 2.3 Update Content Schema

#### [MODIFY] [config.ts](file:///Users/solomonkembo/Downloads/dura-astro/dura/src/content/config.ts)

Add new `learn` collection with domain/type structure:

```typescript
import { defineCollection, z } from 'astro:content';

// NEW: Learn collection (replaces concepts for domain-organized content)
const learn = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        slug: z.string().optional(),
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
    })
});

// NEW: Papers collection
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
    })
});

// KEEP existing collections
const concepts = defineCollection({ /* ... existing ... */ });
const projects = defineCollection({ /* ... existing ... */ });
const updates = defineCollection({ /* ... existing ... */ });
const protocols = defineCollection({ /* ... existing ... */ });
const questions = defineCollection({ /* ... existing ... */ });
const stories = defineCollection({ /* ... existing ... */ });

export const collections = {
    learn,      // NEW
    papers,     // NEW
    concepts,   // KEEP (for backward compatibility during migration)
    projects,
    updates,
    protocols,
    questions,
    stories
};
```

### 2.4 Create New Page Routes

#### [NEW] src/pages/learn/index.astro
Learning hub landing page showing all domains.

#### [NEW] src/pages/learn/[domain]/index.astro
Domain overview page (e.g., /learn/midnight/).

#### [NEW] src/pages/learn/[domain]/[...slug].astro
Individual content pages with dynamic routing.

### 2.5 Update Frontmatter in Moved Files

Each moved MDX file needs updated frontmatter:

```yaml
---
title: "Zero-Knowledge Proofs"
type: "concept"           # NEW
domain: "midnight"        # NEW
tier: "free"              # NEW
difficulty: "intermediate"
# ... rest of existing fields
---
```

### 2.6 Set Up Redirects

Create redirect pages for old URLs:

```astro
<!-- src/pages/concepts/[slug].astro -->
---
export async function getStaticPaths() {
  return [
    { params: { slug: 'zkp' }, props: { redirect: '/learn/midnight/concepts/zkp' } },
    { params: { slug: 'brace' }, props: { redirect: '/learn/midnight/protocols/brace' } },
    // ... other redirects
  ];
}

const { redirect } = Astro.props;
return Astro.redirect(redirect, 301);
---
```

---

## Phase 3: CMS Configuration

**Timeline:** Week 2 (2-3 hours)

#### [MODIFY] [config.yml](file:///Users/solomonkembo/Downloads/dura-astro/dura/public/admin/config.yml)

```yaml
backend:
  name: github
  repo: solkem/dura  # UPDATED
  branch: main
  base_url: https://dura.dev  # UPDATED (or current Fly.io URL)
  auth_endpoint: /api/auth

local_backend: true
publish_mode: editorial_workflow
media_folder: public/images
public_folder: /images

# Add logo
logo_url: /images/dura-logo.svg

collections:
  # NEW: Learn collections by domain
  - name: learn-midnight-concepts
    label: "Midnight → Concepts"
    folder: "src/content/learn/midnight/concepts"
    create: true
    extension: mdx
    format: frontmatter
    fields:
      - { name: title, label: Title, widget: string }
      - { name: type, label: Type, widget: hidden, default: concept }
      - { name: domain, label: Domain, widget: hidden, default: midnight }
      - { name: difficulty, label: Difficulty, widget: select, options: [beginner, intermediate, advanced, expert] }
      - { name: tier, label: "Access Tier", widget: select, options: [free, premium], default: free }
      - { name: description, label: Description, widget: text }
      - { name: tags, label: Tags, widget: list }
      - { name: lastUpdated, label: "Last Updated", widget: datetime }
      - { name: updatedBy, label: "Updated By", widget: string }
      - { name: body, label: Body, widget: markdown }

  - name: learn-midnight-protocols
    label: "Midnight → Protocols"
    folder: "src/content/learn/midnight/protocols"
    # ... similar structure

  # KEEP: Existing collections for backward compatibility
  - name: concepts
    label: "Concepts (Legacy)"
    # ... existing config
```

---

## Phase 4: Infrastructure (Future Phase)

**Timeline:** Weeks 3-4

> [!NOTE]
> This phase adds backend capabilities. It can be deferred until visual rebranding and content reorganization are complete.

### Dependencies to Add

```bash
npm install hono @hono/zod-validator drizzle-orm postgres lucia @lucia-auth/adapter-drizzle arctic zod
npm install -D drizzle-kit
```

### Key Changes

- Update `astro.config.mjs` for hybrid rendering
- Create `src/db/schema.ts` with database tables
- Create `src/pages/api/[...route].ts` for API endpoints
- Implement Lucia auth for user management

---

## Phase 5: Core Features (Future Phase)

**Timeline:** Weeks 5-8

- Search implementation (Meilisearch)
- Progress tracking
- Paper management & BibTeX import
- Collaboration workspaces

---

## Verification Plan

### After Each Phase

```bash
# 1. Run development server
npm run dev

# 2. Type checking
npx astro check

# 3. Build verification
npm run build

# 4. Test CMS
# Navigate to http://localhost:4321/admin
```

### Visual Verification Checklist

- [ ] Homepage loads with new branding
- [ ] Navigation shows "Learn" instead of "Concepts"
- [ ] Colors are amber/stone theme (not purple)
- [ ] Footer shows "Dura" and baeIoT link
- [ ] Favicon displays grain emoji
- [ ] All existing pages still accessible
- [ ] CMS at `/admin` still works

---

## Execution Order

| Order | Task | Est. Time | Dependencies |
|-------|------|-----------|--------------|
| 1 | Phase 0: Package updates | 30 min | None |
| 2 | Phase 1.1: Tailwind colors | 30 min | Phase 0 |
| 3 | Phase 1.2: BaseLayout | 30 min | Phase 1.1 |
| 4 | Phase 1.3: Landing page | 45 min | Phase 1.2 |
| 5 | Phase 1.4: Favicon/logo | 15 min | None |
| 6 | Verify & Test | 30 min | Phases 1.1-1.4 |
| 7 | Phase 2.1-2.2: Create dirs & move files | 30 min | Phase 1 complete |
| 8 | Phase 2.3: Update config.ts | 30 min | Phase 2.2 |
| 9 | Phase 2.4-2.6: Routes & redirects | 1 hr | Phase 2.3 |
| 10 | Phase 3: CMS config | 30 min | Phase 2 complete |
| 11 | Final verification | 30 min | All above |

**Total Estimated Time:** 6-8 hours for Phases 0-3

---

## Risk Mitigation

> [!WARNING]
> **Content Collection Gotchas**
> - After moving MDX files, restart dev server (collections are cached)
> - Ensure frontmatter matches schema exactly
> - Check for broken import paths in MDX files

> [!IMPORTANT]
> **Backward Compatibility**
> - Keep `/concepts/` routes working via redirects
> - Maintain existing CMS collections temporarily
> - Don't delete old CLAUDE files until verified

---

## Questions for User

1. **Domain Priority:** The plan shows `/learn/midnight/` as priority. Should we also set up `/learn/federated-learning/` and `/learn/iot-edge/` now, or defer them?

2. **Brand Assets:** Should I generate a proper SVG logo, or is the emoji-based approach sufficient for now?

3. **Content Tier:** Should any existing content be marked as `premium`, or keep everything `free` for now?
