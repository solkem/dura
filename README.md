# Midnight Learning Platform

> **Interactive research documentation for privacy-preserving blockchain projects**

A living knowledge base where researchers, developers, and reviewers collaboratively document Midnight blockchain concepts through real-world project examples.

---

## 🎯 Purpose

The Midnight Learning Platform transforms complex blockchain and cryptography research into accessible, interactive documentation. Instead of scattered notes and PDFs, we provide:

- **Concept-to-Practice Mapping**: Learn Zero-Knowledge Proofs (ZKPs) through actual circuit implementations
- **Collaborative Research**: Non-technical researchers use a web editor; developers work directly with MDX files
- **Project Context**: See how EdgeChain, Msingi, and Ndani apply Midnight concepts to solve real problems
- **Asynchronous Learning**: Timestamp links to source videos, changelog feeds, bidirectional concept links

### The Problem We Solve

Blockchain research documentation typically fails in three ways:

1. **Inaccessible Theory**: Dense whitepapers with no practical examples
2. **Disconnected Practice**: Code implementations divorced from conceptual foundations
3. **Static Content**: PDFs and wikis that can't keep pace with rapid research iteration

We bridge theory and practice through **interactive concept cards** that show:
- Simple analogies (e.g., "Where's Waldo" for ZKPs)
- General cryptography principles
- Project-specific implementations (actual circuits, protocols, architectures)

---

## 🏗️ Projects Documented

### EdgeChain
**Privacy-preserving agricultural AI for smallholder farmers**

- **Problem**: 96% of African farmers see digital agriculture as beneficial, yet adoption remains minimal due to justified fears of data exploitation
- **Solution**: Use ZKPs to transform data from a weapon of punishment into infrastructure for cooperative empowerment
- **Key Concept**: `ProveYieldAboveThreshold` circuit — farmer proves yield > quota without revealing actual harvest amount
- **Status**: Research (legal constraints until mid-2027)
- **Constraints**: 2G network compatibility, 70% poverty rate among users, deep distrust of data collection

### Msingi
**Infrastructure layer for trustless device registration**

- **Key Concept**: BRACE protocol — device proves it's registered without revealing which device (1/N anonymity)
- **Cryptography**: Commitment `C = H(pk || r)` where pk and r remain secret
- **Status**: Development

### Ndani
**[Details to be documented]**

- **Status**: Research

---

## 🧬 Core Concepts Covered

The platform documents Midnight's technical stack across five categories:

### Cryptography
- Zero-Knowledge Proofs (ZKPs)
- Recursive SNARKs
- KACHINA framework
- SNARK stack architecture

### Identity
- Decentralized Identifiers (DIDs)
- Non-credential identity systems

### Compliance
- Disclosure regimes
- Settlement compliance
- RegTech integration
- Algorithmic regulation

### Economics
- Dual-token model
- Capacity token mechanics
- Real-World Assets (RWAs)

### Infrastructure
- Chain abstraction
- Ouroboros consensus
- Rollup architecture

Each concept includes:
- **Analogy**: Intuitive real-world comparison
- **General Examples**: Non-technical use cases (e.g., "Prove you're over 21 without showing your birthdate")
- **Project Examples**: Actual implementations in EdgeChain/Msingi/Ndani with code/circuit references
- **Related Concepts**: Bidirectional links to deepen understanding

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Astro 4.x | Static site generation with partial hydration for performance |
| **Content** | MDX | Markdown with embedded React components for interactivity |
| **Components** | React 18 | Interactive FAQ, diagrams, expandable concept cards |
| **Styling** | Tailwind CSS | Utility-first styling with project-specific color schemes |
| **CMS** | Decap CMS | Git-backed web editor for non-technical contributors |
| **Hosting** | Vercel | Auto-deploy on merge, edge functions for OAuth |
| **Auth** | GitHub OAuth | Contributor authentication for CMS access |

### Why This Stack?

- **Astro**: Fast static builds, minimal JavaScript shipped to browser, excellent for content-heavy sites
- **MDX**: Researchers write in Markdown, developers embed interactive components where needed
- **Decap CMS**: Non-technical team members edit content via web UI without touching Git
- **Vercel**: Zero-config deployment, automatic PR previews, serverless functions for OAuth

---

## 📁 Project Structure

```
midnight-learning/
├── src/
│   ├── components/
│   │   ├── ConceptCard.astro          # Static concept display
│   │   ├── InteractiveFAQ.tsx         # Expandable FAQ (React)
│   │   ├── ProjectBadge.tsx           # Color-coded project tags
│   │   ├── Analogy.tsx                # Styled analogy blocks
│   │   ├── ProjectExample.tsx         # Project-specific examples
│   │   ├── UpdateFeed.tsx             # Recent changes sidebar
│   │   └── DiagramView.tsx            # Mermaid/architecture diagrams
│   │
│   ├── content/
│   │   ├── config.ts                  # Zod schemas for type safety
│   │   │
│   │   ├── concepts/                  # Core Midnight concepts
│   │   │   ├── zkp.mdx
│   │   │   ├── recursive-snarks.mdx
│   │   │   ├── kachina.mdx
│   │   │   ├── disclosure-regime.mdx
│   │   │   ├── did.mdx
│   │   │   └── ... (15+ concepts)
│   │   │
│   │   ├── projects/                  # Project overviews
│   │   │   ├── edgechain.mdx
│   │   │   ├── msingi.mdx
│   │   │   └── ndani.mdx
│   │   │
│   │   └── updates/                   # Research changelog
│   │       └── YYYY-MM-DD-title.mdx
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro           # HTML shell, meta, navigation
│   │   ├── ConceptLayout.astro        # Single concept page template
│   │   └── ProjectLayout.astro        # Project overview template
│   │
│   ├── pages/
│   │   ├── index.astro                # Landing page with concept grid
│   │   ├── concepts/[...slug].astro   # Dynamic concept routes
│   │   ├── projects/[...slug].astro   # Dynamic project routes
│   │   ├── updates.astro              # Changelog feed
│   │   └── faq.astro                  # Full interactive FAQ
│   │
│   └── styles/
│       └── global.css                 # Tailwind imports + custom CSS
│
├── public/
│   ├── admin/
│   │   ├── index.html                 # Decap CMS entry point
│   │   └── config.yml                 # CMS field definitions
│   ├── images/                        # Project logos, diagrams
│   └── favicon.svg
│
├── astro.config.mjs                   # Astro + integrations config
├── tailwind.config.mjs                # Tailwind theme customization
├── tsconfig.json                      # TypeScript strict mode
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- GitHub account (for CMS access)

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/midnight-learning.git
cd midnight-learning

# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro ...` | Run Astro CLI commands |
| `npm run astro check` | Type-check `.astro` and `.ts` files |

---

## ✍️ Content Workflow

### For Researchers (Non-Technical)

1. Navigate to `https://edgechain-msingi-ndani.fly.dev/admin`
2. Login with GitHub credentials
3. Choose content type: Concept, Project, or Research Update
4. Fill in web form (title, category, examples, etc.)
5. Click "Save" → Creates PR automatically
6. Team reviews → Merge PR → Auto-deploys to production

### For Developers

1. Clone repository
2. Create feature branch: `git checkout -b feat/add-concept-xyz`
3. Edit MDX files directly in `src/content/`
4. Test locally: `npm run dev`
5. Commit: `git commit -m "content(concepts): add recursive-snarks concept"`
6. Push and create PR → Merge → Auto-deploys

### Adding a New Concept

Create `src/content/concepts/your-concept.mdx`:

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

### Content Guidelines

- **Reading Level**: Aim for 8th-grade comprehension (use [Hemingway Editor](http://www.hemingwayapp.com/))
- **Analogies**: One per concept, prioritize everyday experiences
- **Examples**: General first (non-technical), then project-specific (with code)
- **Links**: Always bidirectional (if A links to B, B should link to A)
- **Length**: Concepts should be scannable in <3 minutes

---

## 🎨 Design System

### Project Color Palette

```css
/* EdgeChain - Agricultural AI */
emerald-600  /* Primary */
emerald-100  /* Text on primary */

/* Msingi - Infrastructure */
amber-600    /* Primary */
amber-100    /* Text on primary */

/* Ndani - [TBD] */
cyan-600     /* Primary */
cyan-100     /* Text on primary */

/* Midnight General */
purple-500   /* Analogies, highlights */
midnight-900 /* Background (#0a0a1a) */
```

### Component Usage

```jsx
// Project badge
<ProjectBadge project="edgechain" />

// Analogy block
<Analogy>
Your analogy text here.
</Analogy>

// Project-specific example
<ProjectExample project="msingi">
BRACE protocol implementation details...
</ProjectExample>

// Link to another concept
<ConceptLink slug="zkp">Zero-Knowledge Proofs</ConceptLink>
```

---

## 🔐 Deployment

### Fly.io Deployment

**Live Site**: https://edgechain-msingi-ndani.fly.dev/

The application is deployed on Fly.io with auto-deploy configured on push to `main` branch.

**Environment Variables** (if using Decap CMS):
```
OAUTH_GITHUB_CLIENT_ID=your_github_oauth_client_id
OAUTH_GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

**GitHub OAuth Configuration**:
- Authorization callback URL: `https://edgechain-msingi-ndani.fly.dev/api/auth/callback`

### Deployment Checklist

- [ ] All MDX files have valid frontmatter (check with `npm run astro check`)
- [ ] No broken `<ConceptLink>` references
- [ ] Images optimized (<100KB per image) and in `public/images/`
- [ ] Decap CMS config (`public/admin/config.yml`) matches content schemas
- [ ] Environment variables set in Vercel dashboard
- [ ] OAuth callback URL configured in GitHub app settings

---

## 🤝 Contributing

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/add-concept-xyz

# Commit convention: type(scope): description
# Types: feat, fix, docs, refactor, content, style

git commit -m "content(concepts): add recursive-snarks concept"
git commit -m "feat(components): add search functionality"
git commit -m "docs(readme): update setup instructions"
```

### Code Conventions

**TypeScript**
- Strict mode enabled (`tsconfig.json`)
- Prefer `type` over `interface` for object shapes
- Use discriminated unions for Result types

**Components**
- `.astro` files for static content (no JavaScript shipped)
- `.tsx` files for interactivity (use `client:load` or `client:visible`)
- Keep interactive components minimal to preserve performance

**Styling**
- Tailwind utilities in components (avoid custom CSS)
- Custom CSS only in `src/styles/global.css` for global styles
- Use design system colors (no arbitrary values like `bg-[#abc123]`)

---

## 📊 Architecture Decisions

### Why Astro over Next.js/Gatsby?

- **Performance**: Ships zero JavaScript by default (Lighthouse scores 95-100)
- **Content-First**: Built for documentation/blogs, not webapps
- **Flexibility**: Use React only where needed (FAQ, diagrams), not everywhere

### Why Decap CMS over Contentful/Sanity?

- **Git-Backed**: Content lives in repo, not external database
- **No Vendor Lock-In**: Content is portable MDX files
- **Free**: No per-user or API call pricing

### Why MDX over Plain Markdown?

- **Component Embedding**: `<Analogy>`, `<ProjectExample>` provide structure
- **Type Safety**: Frontmatter validated by Zod schemas
- **Flexibility**: Can add interactive elements (quizzes, diagrams) later

---

## 🗺️ Roadmap

### Phase 1: Core Platform (Current)
- [x] Concept/Project/Update content types
- [x] Interactive FAQ component
- [x] Decap CMS integration
- [x] Vercel deployment
- [ ] Initial 15+ concept pages
- [ ] Project overview pages (EdgeChain, Msingi, Ndani)

### Phase 2: Enhanced Learning
- [ ] Full-text search (Pagefind or Algolia)
- [ ] Interactive quizzes per concept
- [ ] Progress tracking (localStorage or Supabase)
- [ ] Mermaid diagram support
- [ ] Video timestamp deep-linking

### Phase 3: Collaboration
- [ ] GitHub Discussions integration (comments per concept)
- [ ] Contributor profiles
- [ ] Research changelog RSS feed
- [ ] PDF export for offline study guides

### Phase 4: Accessibility
- [ ] i18n support (Shona translation for Zimbabwe pilot)
- [ ] SMS-based content delivery (for 2G users)
- [ ] Audio descriptions for diagrams
- [ ] Dark/light theme toggle

---

## 👥 Team

**Project Lead**: Solomon Kembo
**Contributors**: Shankar Rao Mata, Lokesh Yadav, [Your Name Here]

### How to Join

We welcome contributions from:
- **Researchers**: Add concepts, write analogies, document discoveries
- **Developers**: Build interactive components, improve performance, add features
- **Designers**: Improve accessibility, create diagrams, refine UX
- **Writers**: Simplify explanations, proofread, maintain consistency

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📚 Resources

- **Midnight Docs**: [docs.midnight.network](https://docs.midnight.network)
- **Astro Docs**: [docs.astro.build](https://docs.astro.build)
- **Decap CMS Docs**: [decapcms.org](https://decapcms.org)
- **CLAUDE.md**: Full technical specification (this repo)

---

## 📜 License

[Choose License: MIT, Apache 2.0, or Custom Research License]

---

## 🙏 Acknowledgments

Built on the Midnight blockchain platform and inspired by the need to make privacy-preserving technology accessible to communities most vulnerable to data exploitation.

Special thanks to the farmers, researchers, and developers who contributed their time and insights to make this platform possible.

---

**Last Updated**: December 2024
**Status**: Initial Implementation
**Version**: 0.1.0

---

## Quick Links

- [Live Site](https://edgechain-msingi-ndani.fly.dev/)
- [CMS Admin](https://edgechain-msingi-ndani.fly.dev/admin)
- [Issue Tracker](https://github.com/solkem/edgechain-msingi-ndani/issues)
- [Discussions](https://github.com/solkem/edgechain-msingi-ndani/discussions)
