# Dura — The Knowledge Granary

> **Research documentation and collaboration platform for privacy-preserving technology**

A living knowledge base making complex science and technology accessible to everyone — inspired by the spirit of Dr. Alex Magaisa's Big Saturday Read.

**Live Site**: [https://dura.disruptiveiot.org](https://dura.disruptiveiot.org)

---

## 🎯 Purpose

Dura is part of the **Disruptive IoT** ecosystem exploring **The Economy of Things (EoT)** — the concept of IoT devices becoming economic participants, not just data collectors.

> *"IoT connected devices. EoT disrupts how they earn."*

When devices become economic actors—with wallets, the ability to transact, and autonomous decision-making—everything changes. Dura documents the convergence of:

- **Blockchain** — Economic Agency (devices with wallets)
- **AI** — Cognitive Agency (devices that think)
- **Edge** — Operational Agency (devices that process locally)
- **IoT** — Physical Reality (the hardware layer)

### The Two Sides of Dura

| Side | Audience | Content |
|------|----------|---------|
| **Public ("Citizen Scientist")** | General public, curious minds | Simplified explainers, analogies, practical implications |
| **Research Layer** | Researchers, collaborators | Primary papers, technical specs, protocols, peer notes |

---

## 🏗️ Projects Documented

### EdgeChain
**Privacy-preserving agricultural AI for smallholder farmers**

**The Problem**: 96% of African farmers see digital agriculture as beneficial, yet adoption remains minimal due to justified fears of data exploitation. The "Nyakupfuya" (Shona: trapped farmer) faces surveillance from governments, NGOs, and agribusinesses.

**The Solution**: EdgeChain uses Zero-Knowledge Proofs and federated learning to transform data from a weapon of punishment into infrastructure for cooperative empowerment.

| Concept | Application |
|---------|-------------|
| ZKP | ProveYieldAboveThreshold circuits — farmer proves yield > quota without revealing actual harvest |
| KACHINA | Compact smart contracts |
| Disclosure Regime | Selective compliance proofs |

**Constraints**: 2G network compatibility (SMS-first), 70% of target users live in poverty, deep distrust of data collection. Currently research-only (legal constraints until mid-2027).

**Repo**: [github.com/solkem/edgechain](https://github.com/solkem/edgechain)

---

### Msingi
**Anonymous IoT device identity and autonomous wallets**

**Core Thesis**: *Anonymity requires device-held keys, and ZK-enforced spending policies make device wallets safe.* If a human wallet pays for a device's transaction, the payment links device to human identity, destroying all privacy guarantees.

**Three Pillars**:
1. **BRACE** — Blind Registration (device proves it's registered without revealing which device)
2. **IAR** — Incentivized Anonymous Relay
3. **ACR** — Anonymous Contribution Rewards

**Integration**: Msingi sensors submit anonymous attestations consumed by EdgeChain's Dual Merkle Root system to verify IoT data separately from manual farmer reports.

**Repo**: [github.com/solkem/msingi](https://github.com/solkem/msingi)

---

### Ndani
**Trustless Privacy-Preserving Infrastructure for Machine Economies**

**The Problem**: Existing IoT-blockchain systems (IOTA, Helium) allow devices to earn, but payments flow to human-controlled wallets. Privacy solutions rely on trusted gateways — if compromised, privacy is lost.

**The Solution**: Ndani (Swahili for "Inside") moves the entire trust boundary *inside* the farmer's control:
1. **Device-Held Wallets** — Keys live in the ATECC608A secure element
2. **Local Proof Server** — Farmer-owned Raspberry Pi 5 generates ZK proofs locally

**Hardware Stack (~$163.50)**:
| Component | Function | Cost |
|-----------|----------|------|
| ESP32-S3 | Sensor Microcontroller | $8 |
| ATECC608A | Identity + Wallet Keys | $2.50 |
| SX1276 | LoRa Transceiver | $6 |
| Raspberry Pi 5 | Local Proof Server | $80 |
| Sensors/Power/Infra | Environment + Solar | $57 |

**Architecture**: `[Sensor Node] <-- LoRa --> [Local Pi 5 Proof Server] <-- Internet --> [Midnight Network]`

**Repo**: [github.com/solkem/ndani](https://github.com/solkem/ndani)

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
