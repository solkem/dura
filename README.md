# Dura — The Knowledge Granary

> **Research documentation and collaboration platform for privacy-preserving technology**

A living knowledge base making complex science and technology accessible to everyone, inspired by the spirit of Dr. Alex Magaisa's Big Saturday Read.

**Live Site**: [https://dura.disruptiveiot.org](https://dura.disruptiveiot.org)

---

## 🎯 Purpose

Dura is part of the **Disruptive IoT**, exploring **The Economy of Things (EoT)**, the concept of IoT devices becoming economic participants, not just data collectors.

> *"IoT connected devices. EoT disrupts how they earn."*

When devices become economic actors—with wallets, the ability to transact, and autonomous decision-making, everything changes. Dura scientifically uses AI agents to document the convergence of:

- **Blockchain** — Economic Agency (devices with wallets)
- **AI** — Cognitive Agency (devices that think)
- **Edge** — Operational Agency (devices that process locally)
- **IoT** — Physical Reality (the hardware layer)

Dura transforms complex blockchain, cryptography, and IoT research into accessible, interactive documentation. We bridge the gap between dense academic papers and practical understanding through:

- **Simplified Explanations**: Complex concepts made accessible to everyone
- **Research Papers**: Curated collection with starring and library features
- **Progress Tracking**: Track your learning journey across content
- **Collaborative Research**: Contribute and collaborate on research documentation

### The Problem We Solve

Blockchain research documentation typically fails in three ways:

1. **Inaccessible Theory**: Dense whitepapers with no practical examples
2. **Disconnected Practice**: Code implementations divorced from conceptual foundations
3. **Static Content**: PDFs and wikis that can't keep pace with rapid research iteration

We bridge theory and practice through **interactive concept cards** that show:
- Simple analogies (e.g., "Where's Waldo" for ZKPs)
- General cryptography principles
- Project-specific implementations (actual circuits, protocols, architectures)

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

## 🤖 AI Agents & Nyakupfuya Memory System

Dura uses AI agents to curate and synthesize research papers, making them accessible to Citizen Scientists. The system learns from human feedback through the **Nyakupfuya Memory System**.

### Agent Architecture

```
PDF Upload → Extract Text → Curator Agent → Synthesizer Agent → Save to Database
                                ↓                    ↓
                          [Learns Patterns]    [Learns Patterns]
                                ↓                    ↓
                          Pending Memories → Admin Review → Validated Memories
                                                               ↓
                                                    Future Processing Uses Memories
```

### Agents

| Agent | Purpose |
|-------|---------|
| **Curator** | Evaluates papers for relevance and accessibility. Runs the "Nyakupfuya test" — can this be explained to a livestock keeper? |
| **Synthesizer** | Generates summaries, key concepts, analogies, and identifies paper relationships |

### Nyakupfuya Memory System

Named after the Shona word for a farmer bound by debt, the memory system represents liberation through accessible knowledge. It's a **human-in-the-loop learning system** where:

1. **Agents create observations** during paper processing
2. **Admins review** at `/admin/memories`
3. **Validated memories** influence future processing

#### Memory Types

| Type | Purpose | Example |
|------|---------|---------|
| **Episodic** | Specific events | "Paper X was rejected because it lacks practical applications" |
| **Semantic** | General knowledge | "Privacy papers often require explaining ZK proofs first" |
| **Procedural** | How-to patterns | "When summarizing for farmers, use livestock analogies" |
| **Reflective** | Meta-observations | "Users prefer shorter paragraphs in Nyakupfuya summaries" |

#### Memory Schema

```sql
CREATE TABLE memories (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,           -- episodic, semantic, procedural, reflective
    content TEXT NOT NULL,        -- The learned pattern
    confidence REAL DEFAULT 0.5,  -- Agent confidence score
    status TEXT DEFAULT 'pending', -- pending → validated/rejected
    source_agent TEXT,            -- curator, synthesizer
    evidence TEXT,                -- JSON: { paperIds: [], observations: [] }
    reviewed_by TEXT,
    reviewed_at TEXT,
    review_notes TEXT
);
```

### Paper Processing Flow

1. **Upload PDF** at `/admin/papers`
2. **Curator** evaluates:
   - Domain relevance (0-1)
   - Accessibility score (0-1)
   - Creates pending memories for notable patterns
3. **Synthesizer** generates:
   - One-liner summary
   - Paragraph summary
   - **Nyakupfuya** (rich, multi-paragraph explanation with village/farming analogies)
   - Key Concepts with definitions and analogies
   - Practical Implications
   - Learning Path (prerequisites, next steps, questions)
   - Creates pending memories for concept explanations
4. **Paper saved** to database
5. **View in library** at `/papers`

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
**Version**: 0.3.0
