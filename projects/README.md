# DisruptiveIoT

> Technical blog exploring the convergence of blockchain, AI, and edge computing for IoT in Zimbabwe

![Philosophy](https://img.shields.io/badge/Philosophy-Infinite%20Ubuntu-FBBF24?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Ghost%20CMS-738a94?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)

**Live Site:** [disruptiveiot.org](https://disruptiveiot.org)

**Philosophy:** *"Infinite Ubuntu"* — I win by helping you win, forever.

---

## Table of Contents

- [Overview](#overview)
- [The baeIoT Ecosystem](#the-baeiot-ecosystem)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Development](#development)
- [Deployment](#deployment)
- [Content Series](#content-series)
- [Common Tasks](#common-tasks)

---

## Overview

DisruptiveIoT is a self-hosted Ghost blog exploring how blockchain, AI, and edge computing (collectively termed "baeIoT") can empower smallholder farmers in Zimbabwe through privacy-preserving agricultural data systems.

**Owner:** Solomon Kembo 

---

## The baeIoT Ecosystem

Four interconnected pillars forming a comprehensive IoT/EoT solution:

### 🔗 EdgeChain
**Privacy-preserving agricultural data marketplace for Zimbabwean farmers**
- Tag: `/tag/edgechain/`
- Focus: Farmer-owned data infrastructure

### ⛓️ Msingi
**Midnight Network smart contracts for IoT economic autonomy**
- Tag: `/tag/msingi/`
- Focus: Zero-knowledge proofs for private transactions

### 🔒 Ndani
**Trustless hardware architecture for edge AI computation**
- Tag: `/tag/ndani/`
- Focus: Secure hardware with ATECC608B elements

### 📚 Dura
**Research simplification app bridging scientific papers to ecosystem projects**
- Tag: `/tag/dura/`
- Focus: Making research accessible

---

## Technical Stack

### Hardware
- ESP32-S3 microcontrollers with ATECC608B secure elements
- Raspberry Pi 5 proof servers
- LoRa communication for rural connectivity

### Blockchain
- Midnight Network (Cardano partner chain)
- Zero-knowledge proofs for privacy preservation

### Platform
- Ghost CMS (self-hosted)
- Custom Casper theme
- Code injection for styling

---

## Project Structure

```
disruptiveiot-ghost/
├── CLAUDE.md                    # Project context for Claude Code
├── README.md                    # This file
├── code-injection/
│   ├── site-header.html         # All CSS styles (paste into Ghost Admin)
│   └── site-footer.html         # Footer scripts
├── theme/
│   └── casper/                  # Ghost Casper theme (customized)
│       ├── assets/
│       │   ├── css/
│       │   └── js/
│       ├── partials/
│       └── *.hbs                # Handlebars templates
├── routes.yaml                  # Custom Ghost routing
├── scripts/
│   └── deploy.sh                # Deployment script
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Actions workflow
```

---

### Color Palette

```css
/* Backgrounds */
--bg-primary: #0a0a0a;         /* Deep black - main canvas */
--bg-secondary: #111111;        /* Section backgrounds */
--bg-card: #161616;             /* Card surfaces */
--bg-card-hover: #1a1a1a;       /* Card hover state */

/* Gold Accent */
--gold: #FBBF24;                /* Primary accent - CTAs, highlights */
--gold-dim: #D4A017;            /* Hover state */
--gold-glow: rgba(251, 191, 36, 0.12);
--gold-border: rgba(251, 191, 36, 0.3);

/* Text */
--text-primary: #FFFFFF;        /* Headlines */
--text-secondary: #B0B0B0;      /* Body text */
--text-muted: #707070;          /* Captions, meta */

/* Borders */
--border: rgba(255, 255, 255, 0.08);
--border-hover: rgba(255, 255, 255, 0.15);
```

### Typography

| Element | Font | Weight |
|---------|------|--------|
| Headlines | Playfair Display | 600-700 |
| Body | Inter | 400-500 |
| Code | JetBrains Mono | 400 |

### Key Components

**Pillar Cards**
- Dark cards with gold hover accent
- 16px border-radius
- -4px lift on hover

**Buttons**
- Primary: Gold fill (#FBBF24), dark text
- Secondary: Transparent with border

**Animation**
- Orbital floating particles (8s ease-in-out)
- Gold glow pulse

---

## Development

### Prerequisites

- Node.js 18+
- Ghost CLI
- SSH access to DigitalOcean droplet

### Making Changes

#### Edit Styles
1. Edit [code-injection/site-header.html](code-injection/site-header.html)
2. Copy contents to Ghost Admin → Settings → Code injection → Site Header
3. Save

#### Edit Theme
1. Modify files in [theme/casper/](theme/casper/)
2. Deploy using instructions below

#### Edit Routes
1. Modify [routes.yaml](routes.yaml)
2. Deploy using instructions below

---

## Deployment

### Server Details
- **Host:** DigitalOcean Droplet
- **IP:** 143.110.131.196
- **OS:** Ubuntu 24.04
- **Ghost Path:** `/var/www/ghost`
- **Domain:** disruptiveiot.org (via GoDaddy)

### Manual Deployment

#### Theme Deployment
```bash
# Sync theme files
scp -r theme/casper/ root@143.110.131.196:/var/www/ghost/content/themes/casper/

# Restart Ghost
ssh root@143.110.131.196
cd /var/www/ghost && ghost restart
```

#### Routes Deployment
```bash
# Sync routes
scp routes.yaml root@143.110.131.196:/var/www/ghost/content/settings/routes.yaml

# Restart Ghost (SSH into server)
ssh root@143.110.131.196
cd /var/www/ghost && ghost restart
```

#### Code Injection Deployment
Code Injection is stored in Ghost's database, not files:
1. Copy contents of [code-injection/site-header.html](code-injection/site-header.html)
2. Go to Ghost Admin → Settings → Code injection → Site Header
3. Paste and Save

---

## Content Series

### EdgeChain Insights (Series)

1. Intelligence at the Edge: Introducing baeIoT
2. Data-Centrism VS Model-Centrism
3. The Unlikely Connection of Data, Makerspace and AI
4. From Mbare's Mesh Network to Farmer-Owned Infrastructure
5. From Ubuntu Freedom to Blockchain Privacy
6. The Helicopter That Zimbabwe Laughed At
7. When the Fields Speak in Proof, Not Fear (Top 16 Midnight Hackathon)
8. [Final article pending]

**Tags:** `edgechain`, `insights`, `blockchain`, `privacy`, `midnight`, `innovation`

---

## Common Tasks

### Make BAE Cards Clickable

The four BAE concept cards should link to their respective tag pages:

| Card | Label | Link |
|------|-------|------|
| Blockchain | Economic Agency | `/tag/blockchain/` |
| AI | Cognitive Agency | `/tag/ai/` |
| Edge | Operational Agency | `/tag/edge/` |
| IoT | Physical Reality | `/tag/iot/` |

Wrap card `<div>` elements in `<a href="/tag/tagname/">` tags.

### Change Color Scheme

Update CSS custom properties in [code-injection/site-header.html](code-injection/site-header.html).

### Add New Routes

1. Edit [routes.yaml](routes.yaml)
2. Deploy routes file
3. Restart Ghost

### Emergency Password Reset

If locked out of Ghost Admin:

```bash
cd /var/www/ghost
mysql -u root ghost_production
# See GHOST-PASSWORD-RESET-EMERGENCY.md for SQL commands
```

---

## Key Principles

When making changes, remember:

1. **Dark theme is non-negotiable** — #0a0a0a background, gold accents
2. **Preserve the orbital animation** — It's working well, don't replace
3. **Mobile-first** — Many users on limited bandwidth
4. **Accessibility** — Maintain AAA contrast ratios
5. **Ubuntu philosophy** — Welcoming, not exclusionary

---

## Resources

- **Ghost Admin:** [https://disruptiveiot.org/ghost/](https://disruptiveiot.org/ghost/)
- **Midnight Network:** [https://midnight.network/](https://midnight.network/)
- **Cardano:** [https://cardano.org/](https://cardano.org/)
- **Ghost Documentation:** [https://ghost.org/docs/](https://ghost.org/docs/)

---

## License

© 2026 Solomon Kembo. All rights reserved.

---

## Contact

**Solomon Kembo**
- Software Engineering Instructor, Severn School, Maryland
- Admin Email: admin@disruptiveiot.org

---

*Built with Ubuntu philosophy: I win by helping you win, forever.*
