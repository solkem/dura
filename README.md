# Dura — The Knowledge Granary

> **Research documentation and collaboration platform for privacy-preserving technology**

A living knowledge base making complex science and technology accessible to everyone — inspired by the spirit of Dr. Alex Magaisa's Big Saturday Read.

**Live Site**: [https://dura.disruptiveiot.org](https://dura.disruptiveiot.org)

---

## 🎯 Purpose

Dura transforms complex blockchain, cryptography, and IoT research into accessible, interactive documentation. We bridge the gap between dense academic papers and practical understanding through:

- **Simplified Explanations**: Complex concepts made accessible to everyone
- **Research Papers**: Curated collection with starring and library features
- **Progress Tracking**: Track your learning journey across content
- **Collaborative Research**: Contribute and collaborate on research documentation

### The Two Sides of Dura

| Side | Audience | Content |
|------|----------|---------|
| **Public ("Citizen Scientist")** | General public, curious minds | Simplified explainers, analogies, practical implications |
| **Research Layer** | Researchers, collaborators | Primary papers, technical specs, protocols, peer notes |

---

## 🏗️ Projects Documented

### EdgeChain
**Privacy-preserving agricultural AI for smallholder farmers**

- Uses ZKPs to transform data from a weapon of exploitation into infrastructure for cooperative empowerment
- Key Concept: Farmer proves yield > quota without revealing actual harvest amount

### Msingi
**Infrastructure layer for trustless device registration**

- BRACE protocol — device proves registration without revealing identity (1/N anonymity)

### Ndani
**Privacy-preserving identity and compliance**

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Astro 4.x | Hybrid SSR/SSG with partial hydration |
| **Content** | MDX | Markdown with embedded React components |
| **Database** | SQLite + Drizzle ORM | User progress, starred papers, sessions |
| **Auth** | Lucia | Session-based authentication |
| **Search** | Pagefind | Static search indexing |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Hosting** | DigitalOcean (Docker) | Self-hosted with Nginx reverse proxy |

---

## 📁 Project Structure

```
dura/
├── src/
│   ├── components/          # React + Astro components
│   ├── content/             # MDX content (learn, papers, projects)
│   ├── db/                  # Database schema & connection
│   ├── layouts/             # Page layouts
│   ├── pages/               # Routes (including API)
│   └── auth.ts              # Lucia authentication
├── drizzle/                 # Database migrations
├── public/                  # Static assets
├── Dockerfile               # Production container
└── .github/workflows/       # CI/CD (deploy.yml)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/solkem/dura.git
cd dura

# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build
```

---

## 🔐 Deployment

**Production**: Deployed on DigitalOcean Droplet via Docker + Nginx.

### Auto-Deploy (GitHub Actions)

Push to `main` → GitHub Action builds Docker image → Pushes to GHCR → SSHs to server → Pulls and restarts container.

### Environment Variables (Production)

- `DB_URL=/app/data/dura.db` — Persistent SQLite database
- `NODE_ENV=production`

### SSL Configuration

Uses Let's Encrypt certificates with Nginx. See `.dura-migration/ssl_sni_case_study.md` for SNI configuration details.

---

## ✨ Features

- **User Authentication**: Sign up, login, logout with secure sessions
- **Progress Tracking**: Mark articles as read, track learning progress
- **Paper Library**: Star and save research papers
- **Search**: Full-text search across all content (Pagefind)
- **Responsive Design**: Works on mobile and desktop

---

## 📊 Architecture Decisions

- **Astro**: Ships minimal JavaScript, excellent for content-heavy sites
- **SQLite**: Simple, file-based database perfect for self-hosted deployment
- **Lucia**: Modern session-based auth (no JWT complexity)
- **Docker**: Consistent deployments with volume persistence

---

## 👥 Team

**Project Lead**: Solomon Kembo

---

## 📚 Resources

- **Live Site**: [dura.disruptiveiot.org](https://dura.disruptiveiot.org)
- **GitHub**: [github.com/solkem/dura](https://github.com/solkem/dura)

---

**Last Updated**: January 2026
**Version**: 0.2.0
