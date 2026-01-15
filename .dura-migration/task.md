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
- [x] Update `public/admin/config.yml` with new branding
- [x] Update backend repo reference
- [x] Add new collections for learn structure
- [x] Test CMS functionality

### Phase 4: Infrastructure (Complete)
- [x] Add backend dependencies (Hono, Drizzle, Lucia)
- [x] Update `astro.config.mjs` for hybrid mode
- [x] Database Setup
    - [x] `drizzle.config.ts`
    - [x] `src/db/index.ts` (SQLite connection)
    - [x] `src/db/schema.ts` (Users/Sessions/Papers)
- [x] Implement authentication (Lucia v3)
    - [x] Middleware & Types (`env.d.ts`, `middleware.ts`)
    - [x] Signup Flow (`pages/signup.astro`, `api/signup.ts`)
    - [x] Login Flow (`pages/login.astro`, `api/login.ts`)
    - [x] Logout & UI Updates
- [x] Update `Dockerfile` for native modules (better-sqlite3)

### Phase 5: Core Features (Complete)
- [x] Search implementation (Pagefind)
- [x] Progress tracking
    - [x] Update Schema (add `user_progress` table)
    - [x] API for marking read/unread
    - [x] UI indicators
- [x] Paper management
    - [x] Schema update (user_stars)
    - [x] UI for starring papers
    - [x] Library page

### Deployment (DigitalOcean Migration)
- [x] Pivot strategy: Deploy to DigitalOcean Droplet (`dura.disruptiveiot.org`) to check memory/cost
- [x] Optimize `package.json` (move devDeps, remove unused adapters)
- [x] Optimize `Dockerfile` (multi-stage, `--omit=dev` install)
- [x] Create GitHub Actions workflow (`.github/workflows/deploy.yml`) for SSH deployment
- [x] Create Deployment Guide (`deployment-guide.md`)
- [x] User: Configure Nginx & DNS (see Guide)
- [x] User: Add Secrets to GitHub (`DO_HOST`, `DO_USERNAME`, `DO_SSH_KEY`)
- [x] Verify SSL and live site access
