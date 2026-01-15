# Disruptive IoT - Project Context

> Comprehensive documentation for the Disruptive IoT Ghost publication

---

## Project Overview

**Site:** https://disruptiveiot.org  
**Platform:** Ghost CMS (self-hosted)  
**Theme:** Customized Casper  
**Owner:** Solomon Kembo

### Mission

Disruptive IoT explores **The Economy of Things (EoT)** — the concept of IoT devices becoming economic participants, not just data collectors.

**Tagline:** *"IoT connected devices. EoT disrupts how they earn."*

### Core Concept

When devices become economic actors—with wallets, the ability to transact, and autonomous decision-making—everything changes. This site documents the convergence of:

- **Blockchain** — Economic Agency (devices with wallets)
- **AI** — Cognitive Agency (devices that think)
- **Edge** — Operational Agency (devices that process locally)
- **IoT** — Physical Reality (the hardware layer)

---

## Technical Architecture

### Infrastructure

| Component | Details |
|-----------|---------|
| **Platform** | Ghost CMS |
| **Hosting** | DigitalOcean Droplet |
| **Server IP** | 143.110.131.196 |
| **Domain** | disruptiveiot.org |
| **Theme** | Custom Casper |
| **Deployment** | GitHub Actions (rsync) |

### Repository Structure

```
disruptiveiot-ghost/
├── .github/
│   └── workflows/
│       └── deploy.yaml          # GitHub Actions deployment
├── theme/
│   └── casper/
│       ├── assets/
│       │   ├── built/           # Compiled CSS/JS (gulp output)
│       │   └── css/
│       │       └── custom.css   # Custom dark theme styles
│       ├── custom-home.hbs      # Custom homepage template
│       ├── default.hbs          # Main layout template
│       ├── tag.hbs              # Tag page template
│       ├── post.hbs             # Post template
│       ├── page.hbs             # Static page template
│       ├── package.json         # Theme dependencies
│       └── gulpfile.js          # Build configuration
├── code-injection/
│   └── site-header.html         # Code injected via Ghost API
├── routes.yaml                  # Custom routing (homepage)
└── CONTEXT.md                   # This file
```

### Deployment Pipeline

**Trigger:** Push to `main` branch (paths: `theme/**`, `routes.yaml`, `code-injection/**`, `.github/workflows/deploy.yaml`)

**Steps:**
1. Checkout code
2. Setup SSH connection
3. Build theme (`npm install` + `npm run build` via gulp)
4. Deploy theme via rsync to `/var/www/ghost/content/themes/casper/`
5. Deploy routes.yaml via scp
6. Inject site-header.html via Ghost Admin API (JWT auth)
7. Fix permissions (`chown -R ghost:ghost`) and restart Ghost

### Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Offline-first** | Matches Solomon's philosophy; systems should work without cloud |
| **Dark theme** | Professional, modern aesthetic |
| **Custom homepage** | `custom-home.hbs` with four pillars (blockchain, AI, edge, IoT) |
| **Asset build in CI** | Ensures `built/` directory is always fresh |

---

## Design System

### Color Palette

```css
--dio-bg-primary: #0d1117;      /* Deep blue-black background */
--dio-bg-secondary: #161b22;    /* Card backgrounds */
--dio-bg-card: #1c2128;         /* Elevated surfaces */
--dio-text-primary: #f0f6fc;    /* High-contrast text */
--dio-text-secondary: #c9d1d9;  /* Body text */
--dio-text-muted: #8b949e;      /* Meta text */
--dio-accent: #f59e0b;          /* Amber/gold accent */
--dio-accent-light: #fbbf24;    /* Hover states */
--dio-link: #58a6ff;            /* Links */
--dio-border: #30363d;          /* Subtle borders */
```

### Typography

- **Headings:** System font stack (SF Pro, Segoe UI, etc.)
- **Body:** Serif for article content, sans-serif for UI
- **Accent headings:** Amber (#f59e0b) for brand consistency

---

## Content Architecture

### Navigation

| Label | Path | Description |
|-------|------|-------------|
| Home | / | Custom homepage with four pillars |
| Ecosystem | /tag/ecosystem/ | EoT ecosystem content |
| About | /about/ | "Why I Build" personal story |
| Insights | /tag/insights/ | EdgeChain Insights series |
| Resources | /resources/ | Learning resources |
| Newsletter | /newsletter/ | Email signup |

### Four Pillars (Homepage)

1. **Blockchain** → `/tag/blockchain/` — "Economic Agency"
2. **AI** → `/tag/ai/` — "Cognitive Agency"
3. **Edge** → `/tag/edge/` — "Operational Agency"
4. **IoT** → `/tag/iot/` — "Physical Reality"

### Content Series

- **EdgeChain Insights** — Deep dives into EoT concepts
- Examples: "From Mbare to Mainnet," "From Ubuntu Freedom to Blockchain Privacy"

---

## About Solomon Kembo

### Professional Background

- **Computer Scientist** — University of Zimbabwe lecturer
- **Community Builder** — President, Internet Society Zimbabwe Chapter (2019-2022)
- **Founder** — St Peters IoT Makerspace, Mbare (2016-2022)
- **Founding Team Member** — Golix (Zimbabwe's first Bitcoin exchange, 2017)

### Key Achievements

- Led "Freedom Makers" students to 1st place at UZ Research Expo
- 2nd place globally at Spellman HV Clean Tech Competition (NYC)
- Published in IEOM, Emerald, Africomm
- Managed $60,000+ in Internet Society grants
- 41+ open source repositories on GitHub

### Origin Story

Solomon grew up in Chitungwiza township. At 14, he presented a gift to Irish President Mary Robinson when she donated computers to his school—likely the first public school in Zimbabwe to have them. He didn't own his own computer until age 29.

This experience drives his mission: **digital sovereignty**—ensuring communities own their technological futures rather than waiting for access to trickle down.

### Technical Philosophy

> "Offline-first, not copy-paste Western cloud."

Systems should work when:
- The internet fails
- The power cuts
- The only reliable thing is the community itself

---

## Key Pages

### Work with Me (`/work-with-me/`)

**Purpose:** Invite collaboration, not showcase credentials

**Sections:**
1. Research collaborators (priority)
2. Edge AI architecture projects
3. Startup mentorship
4. Speaking/podcasts
5. Brief credentials section

**Contact:** solomonkembo@gmail.com

### Why I Build (`/about/`)

**Format:** Personal letter to Freedom Makers and younger self

**Key moments:**
- Chitungwiza, Vimbai Primary (48:1 student-teacher ratio)
- Mary Robinson computer donation at age 14
- Self-teaching QuickBasic because the UK teacher couldn't program
- First computer at age 29

**Message:** "You're not behind. You're building something the people with all the resources never had to learn: how to make something from nothing. That's not a disadvantage. That's a superpower."

---

## Known Issues & Solutions

### Issue: Pages not themed (404 for CSS)

**Cause:** Leading spaces in `default.hbs` asset paths (`{{asset " built/screen.css"}}`)

**Solution:** Remove spaces → `{{asset "built/screen.css"}}`

**Commit:** `5c661eb`

### Issue: Build failures in CI

**Cause 1:** Missing `build` script in package.json  
**Solution:** Added `"build": "gulp build"`

**Cause 2:** HTML tags in custom.css  
**Solution:** Removed `<style>` tags from CSS file

**Cause 3:** postcss version conflict  
**Solution:** Updated to `^8.2.15`

### Issue: Social sharing shows gradient (no OG image)

**Status:** Pending

**Solution:** Set Publication Cover in Ghost Admin → Settings → General

---

## Secrets & Environment

### GitHub Secrets Required

| Secret | Purpose |
|--------|---------|
| `DO_SSH_KEY` | Base64-encoded SSH key for server access |
| `GHOST_ADMIN_KEY` | Ghost Admin API key for code injection |

### Ghost Admin API

- **Endpoint:** `https://disruptiveiot.org/ghost/api/admin/`
- **Auth:** JWT signed with Admin API key
- **Used for:** Injecting `site-header.html` into Code Injection settings

---

## Future Considerations

- [ ] Set up proper OG image for social sharing
- [ ] Consider adding search functionality
- [ ] Newsletter integration (if not already set up)
- [ ] Analytics/privacy-preserving tracking
- [ ] Backup strategy for Ghost content

---

*Last updated: January 2026*
