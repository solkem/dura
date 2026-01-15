# CLAUDE.md — Ndani

> *"Bringing Decentralized Solutions to Decentralized People"*

**Last Updated**: January 2026 | **Status**: Research | **Lead**: Solomon Kembo

---

## What Is Ndani?

Ndani (Swahili: "Inside") is trustless privacy-preserving infrastructure for machine economies. The name represents "inside-out trustlessness" — privacy that starts from within the device itself, not granted by external gatekeepers.

**Core Thesis**:
> Anonymity requires device-held keys. Trustless privacy requires farmer-owned proof infrastructure.

---

## Why Ndani Exists

### The Problem We're Solving

The IoT privacy landscape has a fundamental flaw: **every existing solution requires trusting someone**.

When we analyzed systems like IOTA, Helium, and even our own earlier work (Msingi), we discovered they all share a critical weakness:

```
Traditional IoT Privacy:

  Sensor → Gateway (Trusted) → ZK Proof → Blockchain
               ↑
         PRIVACY FAILURE POINT
         
  The gateway sees everything:
  - Device identity (pk)
  - Blinding factors (r)  
  - Raw sensor data
  
  Even with ZK proofs on-chain, 
  the gateway operator knows all.
```

This isn't a bug — it's architectural. Gateway-based systems create **single points of privacy failure**. You're not really private; you're just trusting a different party.

### The Insight

The breakthrough came from asking: *Who actually needs to see the raw data?*

Answer: Only the data owner (the farmer).

If we move proof generation to hardware the farmer already owns and controls, we eliminate the trust assumption entirely:

```
Ndani Architecture:

  Sensor → Local Pi 5 (Farmer-Owned) → ZK Proof → Blockchain
               ↑
         OWNER ALREADY HAS ACCESS
         No new trust required
         
  Privacy holds against ALL external observers:
  - Government
  - Corporations  
  - Network operators
  - Chain analysts
```

The farmer's Raspberry Pi becomes the proof server. The "trusted party" is eliminated because the owner naturally has access to their own data anyway.

### Beyond Data Privacy: Economic Autonomy

But Ndani goes further than privacy. We're building toward a future where **devices are autonomous economic agents**.

In IOTA and Helium, devices generate value but payments flow to human wallets. The device is an instrument — valuable but not autonomous.

Ndani asks: What if devices could hold their own wallets? Make their own economic decisions? Participate directly in machine-to-machine markets?

This is the **Economy of Things (EoT)** — and it requires solving a hard problem: How do you give a device economic autonomy without creating catastrophic risk if it's compromised?

Our answer: **ZK-enforced spending policies**. Mathematically bounded autonomy. A device can transact freely within provable limits, but even a compromised device can't drain its wallet or act outside its policy bounds.

---

## Strategic Context

### Where Ndani Fits in the EdgeChain Ecosystem

Ndani emerged from Solomon Kembo's broader work on **EdgeChain** — a privacy-enhancing, community-owned agricultural intelligence platform.

EdgeChain's mission: *Build the backbone of the intelligent, decentralized future.*

The ecosystem addresses different layers of the agricultural IoT stack:

| Project | Layer | What It Solves |
|---------|-------|----------------|
| **EdgeChain Agricultural AI** | Intelligence | Federated learning for crop insights without centralizing data |
| **Off-Grid IoT Urban Farming** | Connectivity | Offline-first operation for infrastructure-poor environments |
| **Incentivized Internet Sharing** | Network | Economic incentives for community mesh networks |
| **Msingi** | Privacy (Gateway) | Low-cost privacy via trusted gateways (~$50/node) |
| **Ndani** | Privacy (Trustless) | Trustless privacy via local proof servers (~$160/node) |

Ndani is the **trustless infrastructure layer** — the foundation for scenarios where gateway trust isn't acceptable.

### Why Agricultural IoT?

Agriculture is the ideal proving ground for machine economy infrastructure:

1. **Real economic value**: Sensor data directly impacts crop yields, market prices, resource allocation
2. **Privacy-sensitive**: Farm data reveals business intelligence, land productivity, compliance status
3. **Adversarial context**: Farmers face surveillance from governments, corporations, competitors
4. **Resource-constrained**: Solutions must work with limited connectivity, power, and capital
5. **Global scale**: Billions of potential devices, mostly in regions with weak property rights

If we can build trustless machine economies for smallholder farmers in challenging environments, we can build them anywhere.

### Why Midnight Network?

Ndani builds on the **Midnight Network** — IOG's privacy blockchain connected to Cardano.

We chose Midnight because:

| Need | Midnight Solution |
|------|-------------------|
| ZK proofs at scale | Native ZK-SNARK support (Pluto-Eris curves) |
| Developer accessibility | Compact — TypeScript-inspired DSL for ZK contracts |
| State separation | Dual-state architecture (public + private ledgers) |
| Sustainable economics | NIGHT/DUST tokenomics (renewable transaction fuel) |
| Regulatory compatibility | Selective disclosure (prove compliance without full transparency) |
| Academic rigor | Kachina protocol (formal verification, IOG/Edinburgh research) |

Midnight launched its NIGHT token in December 2025, making production deployment feasible.

---

## Design Rationale

### Why Device-Held Wallets?

**Anonymity requires payment to be unlinked from human identity.**

If payments flow to a farmer's personal wallet, the farmer's identity is exposed through payment patterns. Device-held wallets break this link — the device transacts autonomously, and no external observer can connect transactions to a specific human.

### Why Raspberry Pi 5?

We needed hardware that:
- Runs the Midnight Proof Server (moderate compute for ZK proofs)
- Is globally available and well-understood
- Costs little enough to be farmer-owned (~$80)
- Has sufficient memory/storage for proof generation

The Pi 5's ARM Cortex-A76 cores handle ZK proof generation in reasonable time, while keeping the total node cost under $165.

### Why ATECC608A Secure Element?

Device identity and wallet keys need hardware protection:
- Tamper-resistant key storage
- Keys never leave the chip (signatures computed on-chip)
- Low cost (~$2.50) for Sybil resistance
- Widely audited, well-documented

The secure element is the root of device identity — compromise the chip, compromise the device.

### Why ZK Spending Policies?

Device autonomy creates risk: What if a device is compromised? Hacked? Malfunctioning?

ZK spending policies provide **bounded autonomy**:

```typescript
interface SpendingPolicy {
  max_daily_spend: number;        // Cap damage from compromise
  approved_recipients: Address[]; // Limit attack surface
  requires_sensor_reading: boolean; // Tie spending to real activity
  time_window: Duration;          // Rate limiting
  emergency_override: Address;    // Human recovery path
}
```

The device proves each transaction satisfies its policy *without revealing* the policy details, exact balance, or transaction history. Even a compromised device faces mathematically enforced limits.

---

## Ndani vs. Msingi: When to Use Which

Both are valid approaches. The choice depends on your threat model and constraints:

| Factor | Msingi | Ndani |
|--------|--------|-------|
| **Cost** | ~$50/node | ~$160/node |
| **Trust** | Gateway operator | Only yourself |
| **Privacy scope** | Chain observers | All external parties |
| **Compromise impact** | Gateway sees all devices | Only compromised device |
| **Deployment** | Simpler (no Pi) | More infrastructure |

**Choose Msingi when**:
- Cost is primary constraint
- Trusted gateway operator exists (cooperative, NGO, government program)
- Standard agricultural monitoring (non-adversarial)

**Choose Ndani when**:
- Operating in adversarial environments (authoritarian regimes, corporate surveillance)
- Device-level economic autonomy required
- Critical/sensitive data (medical IoT, financial IoT, legal compliance)
- No acceptable trust anchor exists

Many deployments will use **both**: Msingi for standard monitoring, Ndani for high-value or sensitive applications.

---

## Core Protocols

### BRACE — Blind Registration via Anonymous Commitment Enrollment

**Problem**: How do you register a device on-chain without revealing its identity?

**Solution**: Commit to the public key without revealing it, then prove you know the commitment's opening.

```typescript
// Device generates identity in secure element
const { sk, pk } = atecc608a.generateKeypair();

// Create commitment (pk never revealed publicly)
const r = crypto.randomBytes(32);
const commitment = commit(pk, r);

// Publish commitment to registration contract
await registry.register(commitment);

// Prove knowledge of opening via ZK
const proof = zkProve({ pk, r, commitment });
await registry.verify(proof);

// Device now registered without revealing pk
```

**Privacy Guarantee**: No observer can link device registration to subsequent transactions.

### ZK Spending Policies — Bounded Autonomy

**Problem**: How do you give devices economic agency without catastrophic failure modes?

**Solution**: Enforce spending constraints via ZK proofs.

```typescript
// Policy defined at device provisioning
const policy: SpendingPolicy = {
  max_daily_spend: 100,
  approved_recipients: [ORACLE_ADDR, RELAY_ADDR],
  requires_sensor_reading: true,
  emergency_override: FARMER_RECOVERY_ADDR
};

// For each transaction, device proves:
// "This tx satisfies my policy"
// Without revealing:
// - Exact balance
// - Policy details  
// - Transaction history
const proof = zkProve({ tx, policy, state });
```

**Economic Security**: Damage from compromise is mathematically bounded.

### IAR — Incentivized Anonymous Relay

**Problem**: How do you incentivize mesh network relaying without compromising privacy?

**Solution**: Escrow-based micropayments released on proof of delivery.

```
Device A ──▶ Relay 1 ──▶ Relay 2 ──▶ Internet Gateway
              │           │
              ▼           ▼
         Escrow claim  Escrow claim
         (delivery     (delivery
          confirmed)    confirmed)
```

Relays earn for forwarding but never learn packet contents or sender identity.

### ACR — Anonymous Contribution Rewards

**Problem**: How do you reward devices for contributing data to federated learning without identifying them?

**Solution**: ZK proofs of data quality + proportional bounty distribution.

```typescript
// Flow:
// 1. DAO posts: "Need soil moisture data from tropical regions"
// 2. Devices contribute via BRACE identity
// 3. ZK proof of data quality/validity
// 4. Bounty distributed proportionally
// 5. No individual device identifiable
```

---

## Security Model

### Who Are We Protecting Against?

| Adversary | Capability | Privacy Goal |
|-----------|------------|--------------|
| Chain Observer | Reads all on-chain data | Transaction unlinkability |
| Network Observer | Monitors LoRa/IP traffic | Communication privacy |
| State Actor | Subpoena power, legal compulsion | Plausible deniability |
| Corporate Surveillance | Bulk data collection, pattern analysis | Identity protection |
| Malicious Relay | Packet inspection, traffic analysis | Content privacy |

Note: "Compromised Gateway" is not listed because Ndani has no gateway.

### What Do We Trust?

| Trusted Component | Rationale |
|-------------------|-----------|
| ATECC608A secure element | Tamper-resistant, widely audited, hardware root of trust |
| Farmer's own Pi 5 | Owner already has physical access to raw data |
| Midnight consensus | Standard blockchain trust assumptions |
| ZK cryptographic primitives | Mathematical hardness (standard assumptions) |

### What's Out of Scope?

- **Physical device theft with lab forensics**: If someone steals your device and decaps the secure element, you've lost
- **Side-channel attacks on ATECC608A**: Possible but expensive and requires physical access
- **Farmer collusion**: The farmer is the data owner; their "collusion" is just access to their own data

### Economic Security Guarantees

| ID | Guarantee | Mechanism |
|----|-----------|-----------|
| EG1 | Payment Integrity | ZK verification before escrow release |
| EG2 | Budget Compliance | Policy satisfaction proof required |
| EG3 | Relay Fairness | Escrow release on delivery confirmation |
| EG4 | Sybil Resistance | Hardware cost barrier (~$2.50/identity) |

---

## Implementation Status

### Completed ✓

- [x] Project documentation and CLAUDE.md
- [x] Academic paper skeleton (10 sections + appendices)
- [x] Hardware specification and cost analysis
- [x] Protocol design: BRACE, ZK Spending Policies, IAR, ACR
- [x] Threat model and security analysis framework
- [x] Midnight Network integration research

### In Progress

- [ ] BRACE protocol formal specification
- [ ] ZK circuit design for spending policies
- [ ] ESP32-S3 firmware architecture
- [ ] Midnight Compact smart contracts
- [ ] Performance benchmarks (proof generation times on Pi 5)

### Planned

- [ ] Proof-of-concept implementation
- [ ] Hardware prototype (ESP32-S3 + ATECC608A + Pi 5)
- [ ] Midnight testnet deployment
- [ ] Academic paper submission
- [ ] Field trials with agricultural partners

---

## Success Criteria

Ndani succeeds if:

1. **Trustlessness is real**: No party (except the device owner) can access device identity, raw data, or transaction patterns
2. **Economic autonomy works**: Devices transact autonomously within policy bounds without human intervention
3. **Compromise is bounded**: A hacked device cannot exceed its spending policy, ever
4. **Cost is accessible**: Total node cost stays under $200 for production deployments
5. **Performance is practical**: Proof generation completes in <30 seconds on Pi 5
6. **Farmers adopt it**: Real agricultural deployments in adversarial environments

---

## Key Questions This Document Answers

| Question | Answer |
|----------|--------|
| What does "Ndani" mean? | Swahili for "Inside" — inside-out trustlessness |
| Why device wallets? | Anonymity requires unlinking payments from human identity |
| Why Raspberry Pi 5? | Runs Midnight Proof Server locally, ~$80, globally available |
| What prevents drained wallets? | ZK spending policies — mathematically bounded autonomy |
| How different from Msingi? | Ndani eliminates gateway trust entirely; higher cost, stronger privacy |
| Why Midnight? | Native ZK, Compact DSL, Cardano ecosystem, selective disclosure |
| What's the relationship to EdgeChain? | Ndani is the trustless infrastructure layer for EdgeChain's machine economy vision |
| Who benefits? | Farmers in adversarial environments, anyone needing device-level privacy + autonomy |

---

## Hardware Reference

### Trustless Node (~$163.50)

```
┌─────────────────────────────────────────────┐
│  SENSOR LAYER ($38.50)                      │
│  ├── ESP32-S3         MCU, LoRa        $8   │
│  ├── ATECC608A        Identity/Wallet  $2.50│
│  ├── SX1276           LoRa Mesh        $6   │
│  └── Sensors + Solar  Environment     $22   │
├─────────────────────────────────────────────┤
│  PROOF LAYER ($115.00)                      │
│  ├── Raspberry Pi 5   Proof Server   $80    │
│  └── Infrastructure   Power/Case/SD  $35    │
└─────────────────────────────────────────────┘
```

---

## Ecosystem & Related Work

### Prior Machine Economy Attempts

| Project | Limitation | Ndani's Improvement |
|---------|------------|---------------------|
| IOTA | Payments to human wallets | Device-held autonomous wallets |
| Helium | Gateway trust, human rewards | Trustless, device-level rewards |
| Filecoin | Storage-focused, not IoT | Sensor data + edge computation |

### Academic Context

Ndani contributes to blockchain-enabled federated learning for IoT:

- **AgriFLChain**: DIDs/VCs for agriculture, but trusted FL aggregation
- **PPFchain**: Off-chain fog nodes — still requires trust
- **Kachina Protocol**: Privacy-preserving contracts (Ndani builds on this)

**Key differentiation**: Ndani focuses on *device-level economic autonomy*, not just data privacy.

---

## Branding

**Theme**: Cyan (`cyan-600`) — Distinct from EdgeChain (Emerald) and Msingi (Amber)

```css
:root {
  --nd-primary: #0891b2;
  --nd-primary-light: #22d3ee;
  --nd-primary-dark: #0e7490;
  --nd-bg: #164e63;
  --nd-text: #cffafe;
}
```

---

## Resources

- **GitHub**: [github.com/solkem](https://github.com/solkem)
- **EdgeChain Demo**: [solkem.github.io/edgechain-agricultural-ai](https://solkem.github.io/edgechain-agricultural-ai/)
- **Midnight Network**: [midnight.network](https://midnight.network)
- **Kachina Protocol**: IOG/University of Edinburgh research

---

*"Let's build the backbone of the intelligent, decentralized future together."*
