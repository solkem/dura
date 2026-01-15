# Dura Migration Task List

## Current Task: Create Implementation Plan
- [x] Read CLAUDE_Dura.md migration guide
- [x] Analyze current codebase structure
- [x] Create detailed implementation plan
- [ ] Get user approval on plan

## Migration Phases

### Phase 0: Repository & Package Setup
- [x] Update `package.json` (name, description, version)
- [x] Consolidate CLAUDE files into single `CLAUDE.md`
- [x] Remove `vercel.json` (using Fly.io only)
- [x] Update `.gitignore` if needed

### Phase 1: Visual Rebranding
- [x] Update `tailwind.config.mjs` with Dura colors
- [x] Update `src/styles/global.css`
- [x] Update `src/layouts/BaseLayout.astro`
- [x] Update `src/pages/index.astro` (landing page)
- [x] Create brand assets (`dura-logo.svg`, favicon)
- [x] Update navigation links

### Phase 2: Content Reorganization
- [x] Create new directory structure (`src/content/learn/...`)
  - [x] `src/content/learn/midnight/concepts/`
  - [x] `src/content/learn/midnight/protocols/`
  - [x] `src/content/learn/federated-learning/concepts/`
  - [x] `src/content/learn/iot-edge/concepts/`
  - [x] `src/content/papers/`
- [x] Move existing concept files to new locations
  - [x] `zkp.mdx` → `learn/midnight/concepts/`
  - [x] `brace.mdx` → `learn/midnight/protocols/`
  - [x] `federated-learning.mdx` → `learn/federated-learning/concepts/`
  - [x] `trustless-architecture.mdx` → `learn/iot-edge/concepts/`
  - [x] `gabizon-plonk-nodate.mdx` → `papers/` (converted to JSON)
  - [x] `kerber-kachina-2021.mdx` → `papers/` (converted to JSON)
- [x] Update `src/content/config.ts` with new schemas
- [x] Create new page routes (`/learn/[domain]/[slug]`)
- [ ] Set up redirects from old URLs (deferred)
- [x] Update MDX frontmatter in moved files

### Phase 3: CMS Configuration
- [ ] Update `public/admin/config.yml` with new branding
- [ ] Update backend repo reference
- [ ] Add new collections for learn structure
- [ ] Test CMS functionality

### Phase 4: Infrastructure (Future)
- [ ] Add backend dependencies (Hono, Drizzle, Lucia)
- [ ] Update `astro.config.mjs` for hybrid mode
- [ ] Create database schema
- [ ] Implement authentication

### Phase 5: Core Features (Future)
- [ ] Search implementation
- [ ] Progress tracking
- [ ] Paper management
