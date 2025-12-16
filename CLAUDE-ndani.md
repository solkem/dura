# CLAUDE.md — Ndani Learning Platform

## Project Identity

**Name**: Ndani (Swahili: "Inside")

**Purpose**: Trustless Privacy-Preserving Infrastructure for Machine Economies

**Parent**: Midnight Learning Platform

**Lead**: Solomon Kembo
**Focus**: Autonomous device wallets, trustless proof generation, and machine-to-machine economy
**Core Insight**: Trustlessness — devices hold their own keys and generate proofs locally (via farmer-owned infrastructure), eliminating gateway trust.

## Core Thesis

> **Anonymity requires device-held keys. Trustless privacy requires farmer-owned proof infrastructure.**

Unlike prior systems (IOTA, Helium) where payments flow to human wallets, Ndani enables devices to be autonomous economic agents. To prevent "compromised device" risks, we use **ZK-enforced spending policies**—mathematically bounded autonomy.

## Relationship to Main Platform

This is a **themed instance** of the Midnight Learning Platform.
- **Theme Color**: Cyan (`cyan-600` range) — Distinct from EdgeChain (Emerald) and Msingi (Amber).
- **Differentiation from Msingi**: Msingi focuses on *device privacy* using gateways. Ndani focuses on *trustless infrastructure* by removing the gateway entirely in favor of local proof servers.

## Ndani-Specific Concepts

### Priority Concepts (Core to Ndani)

| Concept | Ndani Application | Priority |
|---------|-------------------|----------|
| **Trustless Architecture** | Farmer-owned Raspberry Pi 5 Proof Server | P0 |
| **Device-Held Wallets** | ATECC608A secure element holding value | P0 |
| **ZK Spending Policies** | Constraining device autonomy via proofs | P0 |
| **BRACE** | Blind Registration via Anonymous Commitment Enrollment | P0 |
| **IAR** | Incentivized Anonymous Relay (Mesh incentives) | P1 |
| **ACR** | Anonymous Contribution Rewards (Bounties) | P1 |

### Ndani-Only Concepts

Add these to `src/content/concepts/` for Ndani instance:

```
concepts/
├── trustless-architecture.mdx   # Why gateways break privacy
├── device-autonomy.mdx          # Economic agency vs instrumentation
├── zk-policies.mdx              # Bounded autonomy
├── proof-server-rpi5.mdx        # Local proof generation specs
└── machine-economy.mdx          # EoT (Economy of Things)
```

### Example: Trustless Architecture Concept

```mdx
---
title: "Trustless Architecture"
shortTitle: "No-Gateway"
projects: ["ndani"]
category: "infrastructure"
difficulty: "advanced"
lastUpdated: 2024-12-11
updatedBy: "solomon"
relatedConcepts: ["zkp", "brace", "device-wallet"]
---

import { Analogy, ArchitectureDiagram } from '../../components';

Eliminating the "Gateway Problem" by moving ZK proof generation to infrastructure owned by the device owner (a Raspberry Pi 5), ensuring no third party ever sees raw data or identity keys.

<Analogy>
Traditional IoT Privacy: You whisper a secret to a translator (gateway) who tells the public a riddle. You have to trust the translator not to leak your secret.
Ndani Trustless: You whisper the secret to *yourself* (your own Pi 5), generate the riddle yourself, and publish only the riddle. No trusted translator needed.
</Analogy>

## The Gateway Problem

In systems like Msingi, a gateway generates proofs. This means the gateway operator sees:
- Device Identity (`pk`)
- Random blinding factors (`r`)
- Raw sensor data

This is a single point of privacy failure.

## The Ndani Solution

Every deployment includes:
1. **Sensor Node** (ESP32 + ATECC608A): ~$50
2. **Local Proof Server** (Raspberry Pi 5): ~$110

The farmer owns both. The "observer" of the secret data is the owner, who naturally already has access. Privacy holds against **all external observers** (government, corporate, network), not just chain observers.
```

## Ndani Color Scheme

```css
/* Cyan theme for Ndani */
:root {
  --nd-primary: #0891b2;      /* cyan-600 */
  --nd-primary-light: #22d3ee; /* cyan-400 */
  --nd-primary-dark: #0e7490;  /* cyan-700 */
  --nd-bg: #164e63;           /* cyan-900 */
  --nd-bg-subtle: #155e75;    /* cyan-800 */
  --nd-text: #cffafe;         /* cyan-100 */
  --nd-text-muted: #a5f3fc;   /* cyan-200 */
}
```

## Hardware Stack (Trustless)

```tsx
<HardwareStack 
  title="Trustless Node (~$163.50)"
  components={[
    { name: "ESP32-S3", function: "Sensor Microcontroller", cost: "$8.00" },
    { name: "ATECC608A", function: "Identity + Wallet Keys", cost: "$2.50" },
    { name: "SX1276", function: "LoRa Transceiver", cost: "$6.00" },
    { name: "Sensors/Power", function: "Env + Solar", cost: "$22.00" },
    { name: "Raspberry Pi 5", function: "Local Proof Server", cost: "$80.00" },
    { name: "Pi Infra", function: "Power + Case + SD", cost: "$35.00" }
  ]}
/>
```

## Economic Security Properties

| Label | Guarantee | Mechanism |
|-------|-----------|-----------|
| **EG1** | Payment Integrity | ZK verification before escrow release |
| **EG2** | Budget Compliance | ZK proof of policy satisfaction (Policy P(tx) = true) |
| **EG3** | Relay Fairness | Escrow release upon delivery confirmation |
| **EG4** | Sybil Resistance | Hardware cost barrier (ATECC608A) |

## Comparison with Other Projects

| Feature | Msingi | Ndani |
|---------|--------|-------|
| **Trust Model** | Gateway-based | Trustless (Local Proof Server) |
| **Cost** | Low (~$50) | Medium (~$160) |
| **Privacy Target** | Chain Observers | All External Observers |
| **Wallet** | Human-held | Device-held (Autonomous) |
| **Use Case** | Std. Ag-IoT | Critical/Adversarial IoT |

## Questions This File Should Answer

1.  **What does "Ndani" mean?** → Swahili for "Inside" (Inside-out trustlessness).
2.  **Why device wallets?** → Anonymity requires payment to be unlinked from human identity.
3.  **Why a Raspberry Pi 5?** → To run the Midnight Proof Server locally, eliminating gateway trust.
4.  **What prevents drained wallets?** → ZK-enforced spending policies (bounded autonomy).
5.  **How is it different from Msingi?** → Ndani removes the gateway for higher privacy/trustlessness at higher cost.

---

Last updated: December 2024
Status: Experimental / Research
Lead: Solomon Kembo
