# CLAUDE.md — EdgeChain Project Context

**Last Updated:** January 2026  
**Project Lead:** Solomon Hopewell Kembo (@solkem)  
**Status:** Research & Validation Phase | MVP Live  
**Codename:** Msingi (Swahili: "foundation")

---

## Quick Reference

| Item | Details |
|------|---------|
| Live Demo | https://solkem.github.io/edgechain-agricultural-ai/ |
| Fly.dev Demo | https://edgechain-midnight.fly.dev/ |
| GitHub | https://github.com/solkem/edgechain |
| LinkedIn | https://linkedin.com/in/solomonkembo |
| Location | Bethesda, Maryland, US (originally Zimbabwe) |
| Target Region | Manicaland Province, Zimbabwe |
| Blockchain | Midnight Network (Cardano ecosystem) |
| Core Tech | Edge AI + Federated Learning + ZK Proofs + Blockchain + IoT |

---

## 1. Executive Summary

EdgeChain is a **privacy-preserving agricultural data marketplace** enabling smallholder farmers in Sub-Saharan Africa to monetize their data while maintaining complete privacy and data sovereignty.

**Core Innovation:** Zero-knowledge proofs + federated learning enable farmers to prove compliance for rewards without revealing exploitable identities. Data transforms from "weapon for punishment" into "infrastructure for cooperative empowerment."

**Tagline:** "Prove Quality. Keep Privacy. Own Rewards."

---

## 2. The Problem

### The Adoption Paradox

| Metric | Value | Source |
|--------|-------|--------|
| Farmers who see digital agriculture as beneficial | 96.2% | Abdulai et al. 2023 |
| Actual digital agriculture adoption | Minimal | Same study |
| Agricultural productivity trend (2008-2019) | -3.5%/year | Wollburg et al. 2024 |
| Digital ag services lacking privacy policies | 92% | Concannon et al. 2023 |
| Communal farmers living in poverty | ~70% | Frontiers 2025 |

### Three Actors Weaponize Farmer Data

1. **Government Agencies**: Zimbabwe's Fast Track Land Reform used farm data for political targeting; surveillance infrastructure includes Chinese facial recognition (Cloudwalk)
2. **NGOs & Aid Organizations**: AGRA's 13 focus countries saw 50% hunger increase despite promises; data collection enables "surveillance capitalism"
3. **Agribusinesses**: Manicaland cannabis industry exploitation (November 2025); middlemen use market information asymmetry against farmers

### The Nyakupfuya Narrative

"Nyakupfuya" (Shona) represents farmers trapped between survival and surveillance:

> **Problem:** To access loans, seeds, or drought relief, Nyakupfuya must surrender private data—farm yields, GPS coordinates, family size. This data flows to government agencies tracking "opposition areas," NGOs optimizing their metrics, and agribusinesses calibrating exactly how much to underpay.

> **Solution:** EdgeChain lets Nyakupfuya prove he meets program requirements without revealing who he is or where he farms. He earns AgriCredits for contributing sensor data to collective AI models. His identity remains his own.

---

## 3. The Solution

EdgeChain combines three technologies:

1. **Federated Learning** - Train AI models locally, share only model updates (not raw data)
2. **Zero-Knowledge Proofs** - Verify data quality without revealing data
3. **Blockchain Smart Contracts** - Enable trustless, automated reward distribution

### Core Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FARMER'S EDGE LAYER                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │ Arduino Nano │    │ SMS Gateway  │    │ Basic Phone  │           │
│  │  BLE Sense   │    │ (2G compat)  │    │  (Feature)   │           │
│  │  + Sensors   │    └──────┬───────┘    └──────┬───────┘           │
│  └──────┬───────┘           │                   │                    │
│         │ EdDSA signed      │ Manual entry      │ Predictions        │
│         ▼                   ▼                   ▼                    │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │              CRYPTOGRAPHIC SIGNATURE LAYER                  │     │
│  │     Device signs data → Proves authenticity without ID      │     │
│  └────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        AGGREGATION LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐    │
│  │ Federated Learn  │  │   Dual Merkle    │  │   Cooperative   │    │
│  │   Coordinator    │◄─►│     Roots       │◄─►│   Governance    │    │
│  │ (FedAvg/Flower)  │  │ (IoT vs Manual)  │  │  (DAO Voting)   │    │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    MIDNIGHT BLOCKCHAIN LAYER                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐    │
│  │  Compact Smart   │  │  Zero-Knowledge  │  │  Reward Distro  │    │
│  │    Contracts     │  │     Proofs       │  │  (AgriCredits)  │    │
│  │   (TypeScript)   │  │(Selective Disc)  │  │                 │    │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Dual Merkle Roots**: Separate verification trees for automatic IoT sensor data (0.1 DUST reward) vs. manual farmer submissions (0.02 DUST)
2. **SMS-First Interface**: Compatible with 2G networks and basic phones—70% of communal farmers live in poverty
3. **Selective Disclosure**: ZK proofs allow proving statements without revealing underlying data
4. **Anonymous Set Membership**: Devices prove "I'm an approved manufacturer" without revealing which one (10,000+ device anonymity sets)
5. **Federated Learning**: AI models train on local data; only gradients leave the device

---

## 4. Technical Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Smart Contracts | Midnight Network Compact | ZK circuit definition, shielded state |
| Frontend | React 18, TypeScript, Vite, Tailwind | Web interface, Lace wallet integration |
| Backend | Node.js, Express, FastAPI | API, aggregation coordination |
| Build System | Turborepo, Yarn workspaces | Monorepo management |
| Storage | IPFS (Storacha), IndexedDB (Dexie.js) | Decentralized + local storage |
| AI/ML | TensorFlow.js, Flower | Browser-based training, FL aggregation |
| Hardware | Arduino Nano 33 BLE Sense | EdDSA-signed sensor data |
| Payments | M-Pesa integration | Mobile money for rural access |
| Wallet | Lace Midnight | Blockchain wallet integration |

### Four-Layer Data Persistence

| Layer | Technology | Data Type | Privacy Level |
|-------|------------|-----------|---------------|
| 1 | Farmer Device | Raw sensor data | Complete (never leaves) |
| 2 | IndexedDB (Dexie) | Encrypted witnesses | Local encrypted |
| 3 | IPFS (Storacha) | ZK proofs, metadata | Decentralized, immutable |
| 4 | Midnight Blockchain | Commitments, hashes | On-chain, verifiable |

### Hardware Stack

#### IoT Device (~$50)

| Component | Part Number | Function | Cost |
|-----------|-------------|----------|------|
| MCU | ESP32-S3-WROOM-1 | Processing, WiFi/BLE | $8.00 |
| Secure Element | ATECC608B (Adafruit) | Key storage, ECDSA signing | $2.50 |
| Radio | RYLR896 (SX1276) | LoRa mesh communication | $6.00 |
| Sensors | BME280 + soil capacitive | Temp/humidity/soil | $6.00 |
| Power | CN3065 + 18650 + 6V solar | Solar charging | $16.00 |
| Enclosure | IP65 polycarbonate | Weather protection | $10.00 |

#### Proof Server (~$115)

| Component | Cost |
|-----------|------|
| Raspberry Pi 5 8GB | $80 |
| Power supply | $15 |
| LoRa HAT (SX1276) | $25 |
| Enclosure | $20 |
| SD card | $15 |

**Trust Model:** Proof server is owned and physically controlled by the farmer/device owner. Privacy depends on owner not colluding against themselves.

### Wiring Diagram (ESP32-S3 DevKit)

```
ATECC608B (I2C):
  SDA → GPIO8
  SCL → GPIO9
  VIN → 3.3V
  GND → GND

RYLR896 (UART):
  TXD → GPIO18 (RX)
  RXD → GPIO17 (TX)
  VDD → 3.3V
  GND → GND
  RST → GPIO4 (optional)
```

---

## 5. Protocols

### BRACE (Blind Registration via Anonymous Commitment Enrollment)

Enables devices to register without revealing identity and later prove membership anonymously.

```typescript
// Protocol Steps
1. Device generates keypair (sk, pk) in ATECC608B secure element
2. Device creates commitment: C = Commit(pk, r) where r is random
3. Commitment C published to registration contract (no pk revealed)
4. Device proves knowledge of opening via ZK proof
5. Device registered without revealing public key to observers
```

**Privacy Guarantee:** No external observer can link device registration to subsequent transactions.

### ACR (Anonymous Contribution Rewards)

Bounty system for data contributions to federated learning.

```typescript
// Bounty Flow
1. Research DAO posts bounty: "Need soil moisture data from tropical regions"
2. Devices contribute anonymously (via BRACE identity)
3. ZK proof of data quality/validity
4. Bounty distributed proportionally
5. No individual device can be identified
```

### Epoch-Based Nullifiers

```
n = H(H(pk) || epoch)
```

- **Unlinkability:** Different epochs produce different nullifiers
- **Replay prevention:** Same device, same epoch = same nullifier = rejection
- **Rate limiting:** One attestation per device per epoch

---

## 6. Zero-Knowledge Proof Innovations

### Core Concept: "One Among Thousands"

**Traditional IoT (No ZK):**
```
Device #237 submits → Blockchain shows "Device #237 submitted"
Result: Fully traceable, zero privacy
```

**EdgeChain (With ZK):**
```
Device submits → Blockchain shows "Some authorized device submitted"
Result: Device hidden among 10,000+ others
```

### Three Unique ZK Advantages

| Approach | Anonymity Set | Privacy Level |
|----------|---------------|---------------|
| Digital Signatures | 1 device | 0% - Fully traceable |
| Ring Signatures | 10-50 devices | Weak - Limited crowd |
| EdgeChain ZK | 10,000+ devices | Strong - Massive crowd |

### O(1) Storage Efficiency

| Method | Storage (10K devices) | Cost Growth |
|--------|----------------------|-------------|
| Store all device IDs | 320 KB | Linear |
| Ring signatures | 6.4 MB | Exponential |
| ZK Merkle root | 32 bytes | Constant |

### Privacy Guarantees (PG1-PG6)

| Label | Name | Guarantee |
|-------|------|-----------|
| PG1 | Device Anonymity | Cannot identify submitting device better than 1/N + negl(λ) |
| PG2 | Unlinkability | Attestations from same device in different epochs are computationally unlinkable |
| PG3 | Data Confidentiality | ZK proofs reveal only predicate satisfaction, not underlying sensor values |
| PG4 | Replay Resistance | Each attestation can be submitted at most once per epoch |
| PG5 | Metadata Protection | Gateways learn only "attestation submitted in time window T"—not which device |
| PG6 | Key Secrecy | Device private keys cannot be extracted even with physical access (ATECC608B) |

---

## 7. Smart Contracts

### Contract Suite (~487 lines Compact)

| Contract | LOC | Function |
|----------|-----|----------|
| Registry | 89 | Device commitment Merkle tree in private state |
| Attestation | 112 | ZK proof verification, nullifier tracking |
| Wallet | 156 | Device balances in private state, ZK-policy enforcement |
| Bounty | 130 | ACR escrow, claim ticket verification, reward payout |

### Gas Costs (Testnet Estimates)

| Operation | Cost (DUST) |
|-----------|-------------|
| Registration | ~0.15 |
| Attestation | ~0.08 |
| Bounty claim | ~0.06 |

### Deployed Contracts

| Contract | Address | Network |
|----------|---------|---------|
| Arduino IoT | `02001d6243d08ba466d6a3e32d9a04dd1d283d8fe2b9714cde81a25fa9081087b30a` | Midnight Testnet |
| Federated Learning | `02002f44e466b8c8a1422e269156a6bb4e098cde1007203adf7181eb6659211dbe39` | Midnight Testnet |

---

## 8. Midnight Network Integration

### Why Midnight?

| Property | Why Required | How Midnight Provides |
|----------|--------------|----------------------|
| Anonymous Payments | Device identity protection | Shielded DUST transactions |
| Micropayments | Sub-cent attestation fees | NIGHT-generates-DUST (zero marginal cost) |
| Private Contract State | Prevent device enumeration | Encrypted Merkle tree storage |
| Programmable Enforcement | ZK-enforced spending policies | Compact smart contracts |

### NIGHT-DUST Tokenomics

| Token | Properties | Role in EdgeChain |
|-------|------------|-------------------|
| NIGHT | Unshielded, transferable, fixed supply | Held by devices, generates DUST |
| DUST | Shielded, non-transferable, decaying, renewable | Pays transaction fees |

**Key Insight:** NIGHT holders can execute unlimited transactions at zero marginal cost while DUST is available. This eliminates the micropayment paradox.

---

## 9. Project History & Milestones

### Timeline

| Date | Milestone |
|------|-----------|
| Oct 2024 | EdgeChain concept formed at intersection of blockchain/AI/IoT |
| Oct 2024 | Team assembled: Solomon (Lead), Shankar (Blockchain), Lokesh (Frontend) |
| Nov 2024 | Midnight Summit Hackathon - **Top 16 of 46 teams** (London) |
| Nov 2024 | Live demo deployed: https://edgechain-midnight.fly.dev/ |
| Dec 2024 | Comprehensive documentation created |
| Jan 2026 | Research & validation phase continues |

### Achievements

- **Midnight Summit Hackathon (November 17-19, 2025)**
  - Result: Top 16 placement
  - Judge Feedback: Praised "clear story of the problem we're solving"
  - Track: AI — Privacy-preserving intelligence and inference
  - Hardware: Arduino Nano 33 BLE Sense for edge ZK proofs

---

## 10. Builder Profile

### Solomon Hopewell Kembo (@solkem)

| Field | Details |
|-------|---------|
| Location | Bethesda, Maryland, US (originally Zimbabwe) |
| Current Role | Maker Lab Director, Severn School |
| Tagline | "Bringing Decentralized Solutions to Decentralized People" |
| Focus | Blockchain × IoT × AI × Privacy |
| Visa Status | G-4 dependent; EB-2 NIW pending (est. mid-2027) |

### Technical Expertise

- **Blockchain:** Midnight Network, Cardano, Hyperledger Fabric, Smart Contracts (Compact)
- **IoT:** Arduino, Raspberry Pi, LoRa, Web Bluetooth, Sensor Networks
- **Privacy Tech:** Zero-Knowledge Proofs, Attribute-Based Credentials, Federated Learning
- **Stack:** TypeScript, React, Node.js, FastAPI, PostgreSQL, IPFS

### Published Research

1. **"Patient and wearable device authentication utilizing attribute-based credentials and permissioned blockchains in smart homes"**
   - Published: IJIEOM, Vol. 5 No. 2, pp. 148-160 (2023)
   - DOI: 10.1108/IJIEOM-02-2023-0021

2. **"A privacy-preserving federated learning architecture implementing data ownership and portability on edge end-points"**
   - Published: IJIEOM, Vol. 5 No. 2, pp. 118-134 (2023)
   - DOI: 10.1108/IJIEOM-02-2023-0020

### Constraint

**No commercial activity until work authorization secured (est. 2027).** Current phase emphasizes research validation over commercial optimization.

---

## 11. Team Structure

| Name | Handle | Role | Focus |
|------|--------|------|-------|
| Solomon Hopewell Kembo | @solkem | Project Lead | Architecture, integration, strategy |
| Shankar Rao Mata | Evolution | Lead Full Stack Blockchain Dev | Midnight integration, Compact contracts |
| Lokesh Yadav | Loki | Frontend Developer | React UI, SMS interface |

### Communication Patterns

- Async-first across distributed timezones (US/India)
- Discord channels: #dev, #demo, #pitch, #blockers
- Weekly syncs: Saturdays 10am ET (30 min max)
- Documentation-heavy: Detailed messages, Loom videos for complex topics

---

## 12. Economic Model

### Revenue Distribution

- Farmers: 70% of data revenue
- Platform: 30% for infrastructure and development

### Reward Rates

| Data Type | Reward |
|-----------|--------|
| Automatic IoT Collection | 0.1 tDUST per verified sensor reading |
| Manual Data Entry | 0.02 tDUST per submission |
| Quality Bonuses | Additional rewards for consistent, high-quality data |

### Farmer Economics

| Revenue Source | Annual Value |
|----------------|--------------|
| Direct Data Contribution Rewards | $500-800 |
| Yield Improvements from AI Insights | $300-600 |
| **Total Annual Farmer Benefit** | **$800-1,400** |

### Financial Projections

| Year | Revenue | Self-Sustainability |
|------|---------|---------------------|
| Year 1 | ~$100,000 | 11% |
| Year 2 | ~$450,000 | 53% |
| Year 3 | ~$850,000 | 100% |

---

## 13. Development Workflow

### Repository Structure

```
edgechain/
├── packages/
│   ├── contract/          # Compact smart contracts
│   │   ├── src/
│   │   │   ├── edgechain.compact      # Main FL contract
│   │   │   └── arduino-iot.compact    # IoT ZK contract
│   │   └── deployment.json
│   ├── ui/                # React frontend
│   │   ├── src/
│   │   │   ├── providers/ # Wallet & Contract providers
│   │   │   ├── fl/        # Federated learning logic
│   │   │   └── components/
│   ├── api/               # Express backend
│   └── cli/               # SMS bot and tools
├── server/                # Node.js backend
├── arduino/               # IoT firmware
├── gateway/               # Web Bluetooth gateway
├── ipfs-service/          # IPFS integration
├── docs/                  # Documentation
├── compact/               # Contract compilation artifacts
└── CLAUDE.md              # This file
```

### Commands

```bash
# Development (Turborepo)
yarn dev                              # All packages
yarn workspace @edgechain/ui dev      # Frontend only
yarn workspace @edgechain/api dev     # Backend only

# Build
yarn build                            # All packages
yarn workspace @edgechain/contract build  # Compile Compact

# Testing
yarn test
yarn lint

# Contract compilation
yarn compact
```

### Code Conventions

```typescript
// Preferred: Result types over exceptions
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// TypeScript strict mode everywhere
// Async-first: All I/O uses async/await
// Feature branches off main, PR review required
// Commit format: type(scope): description
```

---

## 14. Implementation Status

### Completed ✅

- [x] Hardware component selection and validation
- [x] ATECC608B integration with ESP32-S3 (I2C communication)
- [x] BRACE protocol specification
- [x] Privacy guarantee formalization (PG1-PG6)
- [x] Curve separation architecture design
- [x] Arduino IoT contract deployed to Midnight Testnet
- [x] Federated Learning contract deployed to Midnight Testnet
- [x] Demo UI with Lace wallet integration
- [x] Device firmware: 12,000 lines C++ for ESP32-S3
- [x] Proof server: 4,500 lines Rust (Halo2 circuit)
- [x] Compact contracts: 487 lines across 4 contracts

### In Progress 🔄

- [ ] End-to-end attestation flow validation
- [ ] Proof generation benchmarking on Pi5
- [ ] LoRa mesh relay protocol implementation
- [ ] SMS gateway integration (Africa's Talking)

### Planned 📋

- [ ] Field deployment in Zimbabwe (50+ devices)
- [ ] Security game formalization with reductions
- [ ] Gas cost optimization
- [ ] Migration to Midnight Mainnet

### Testnet Results

| Metric | Value |
|--------|-------|
| Registration success rate | 100% |
| Attestation verification | 100% |
| Proof generation time (Pi5) | 12.4 seconds |
| ECDSA signing time (ATECC608B) | 48ms |
| End-to-end latency | ~15 seconds |

---

## 15. Guiding Principles

### 1. Privacy by Design, Not Afterthought
Zero-knowledge proofs are not a feature—they're the foundation. Every data flow starts with: "What's the minimum disclosure needed?"

### 2. The Nyakupfuya Test
Before any feature: "Does this help Nyakupfuya or expose him?" If it creates new surveillance vectors, it fails.

### 3. Infrastructure Realism
2G networks. Feature phones. Intermittent power. Solar charging. If it requires constant connectivity or smartphone apps, it won't work.

### 4. Cooperative Economics
Value should flow to farmers, not extract from them. Tokenomics must incentivize participation without creating new dependencies.

### 5. Academic Rigor First
Current phase emphasizes research validation over commercial optimization. Prove concepts work before scaling.

---

## 16. The "Five Hypes" (IoT-Blockchain Critique Responses)

### Hype 1: Micropayment Paradox
**Accusation:** "Blockchain tx fees ($0.10-$0.30) will always exceed small payment values ($0.001)."
**Response:** Midnight's NIGHT-generates-DUST model provides zero marginal cost transactions.

### Hype 2: Oracle Problem
**Accusation:** "You can't cryptographically prove a sensor is measuring reality."
**Response:** Correct—we don't solve it. We make lying expensive via spatial correlation and stake slashing.

### Hype 3: Interoperability
**Accusation:** "Your protocol won't unify IoT walled gardens."
**Response:** Out of scope. We pick a specific stack (LoRa + ESP32 + Midnight).

### Hype 4: Regulatory/Legal Vacuum
**Accusation:** "Legal systems don't recognize devices as entities."
**Response:** Device holds keys; human owner holds legal title. ZK proofs enable selective disclosure for compliance.

### Hype 5: Solution Seeking Problem
**Accusation:** "A centralized database is faster, cheaper, simpler."
**Response:** Correct for most cases. But we require properties databases can't provide: anonymous attestations, device-held wallets, censorship resistance.

---

## 17. Related Projects

| Project | Description | Status |
|---------|-------------|--------|
| Msingi | Trustless IoT economic infrastructure | Research |
| Ndani | Trustless privacy-preserving machine economies | Research |
| Off-Grid IoT Urban Farming | Solar-powered sensors for urban agriculture | Active |
| Incentivized Internet Sharing | Community mesh networks with token incentives | Completed |
| Proof of Privacy for Smart Homes | ZK proofs for IoT device attestation | Research |

---

## 18. Key Terminology

| Term | Definition |
|------|------------|
| AgriCredits | Token rewards for farmer data contributions |
| BRACE | Blind Registration via Anonymous Commitment Enrollment |
| ACR | Anonymous Contribution Rewards |
| Compact | Midnight's smart contract programming language |
| DePIN | Decentralized Physical Infrastructure Networks |
| DUST | Midnight's network fuel token (consumed, not traded) |
| FL | Federated Learning |
| NIGHT | Midnight's governance/rewards token |
| ZK-proofs | Zero-Knowledge proofs for privacy-preserving verification |
| Bounded Autonomy | Devices spending within cryptographically-enforced constraints |

---

## 19. Live Deployments

| Service | URL |
|---------|-----|
| Demo UI | https://edgechain-midnight-ui.fly.dev/ |
| API Backend | https://edgechain-api.fly.dev/ |
| IPFS Service | https://edgechain-ipfs.fly.dev/ |
| Original MVP | https://solkem.github.io/edgechain-agricultural-ai/ |

---

## 20. Notes for Claude

### Preferred Communication Style

- Compact, technical responses
- TypeScript code examples preferred
- Focus on practical implementation
- Minimal formatting unless requested

### Key Context to Remember

1. Solo developer with strong research background
2. Targeting Cardano/Midnight ecosystem
3. Zimbabwe agricultural focus with global potential
4. Privacy-preserving IoT authentication is the core innovation
5. **G-4 visa constraints**: No commercial activity until ~2027
6. Values "ugly prototypes" and iterative development

### Project Aliases

- **EdgeChain** - Primary project name
- **Msingi** - Swahili for "foundation" (alternative branding)
- **ZK-IoT** - Technical descriptor
- **SolKem** - Builder handle

### What NOT to Do

- Don't oversimplify technical explanations—Solomon values depth
- Don't suggest commercial activities (visa constraints)
- Don't assume smartphone access—target users have feature phones
- Don't suggest centralized solutions—privacy is non-negotiable

### Cultural Context

For examples, use authentic Zimbabwean Shona names instead of Alice-Bob-Charlie:
- Anesu (God is with us)
- Batsi (help)
- Chenai (clean)

---

## 21. Resources & References

### Technical Documentation

- [Midnight Network Docs](https://docs.midnight.network/)
- [Compact Language Reference](https://docs.midnight.network/develop/reference/compact/)
- [Lace Wallet Midnight Preview](https://www.lace.io/midnight)

### Academic Sources

- Abdulai et al. 2023 — Digital agriculture perception study
- Wollburg et al. 2024 — African productivity trends
- Concannon et al. 2023 — Privacy policy gaps in digital agriculture
- Sarku & Ayamga 2025 — Data extractivism in Ghana

### Contact

| Platform | Link |
|----------|------|
| GitHub | https://github.com/solkem |
| LinkedIn | https://www.linkedin.com/in/solomonkembo |
| Twitter | https://twitter.com/solkem |
| Email | solomonkembo@gmail.com |

---

*"Transform data from a tool of punishment into infrastructure for cooperative empowerment."*  
— EdgeChain Mission Statement
