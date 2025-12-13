# CLAUDE.md — Msingi Learning Platform

## Project Identity

**Name**: Msingi Learning Hub  
**Purpose**: Interactive documentation for IoT device privacy and autonomous wallets  
**Parent**: Midnight Learning Platform  
**Lead Author**: Solomon Kembo  
**Focus**: Device privacy, anonymous attestations, ZK-enforced spending policies

## Core Thesis (Memorize This)

> **Anonymity requires device-held keys, and ZK-enforced spending policies make device wallets safe.**

This is not a design preference—it's a logical requirement. If a human wallet pays for a device's transaction, the payment links device to human identity, destroying all privacy guarantees.

## Relationship to Main Platform

This is a **themed instance** of the Midnight Learning Platform, filtered and customized for Msingi. It inherits all architecture from the main platform but:

- Defaults to showing Msingi examples prominently
- Uses amber color scheme throughout
- Includes IoT/hardware-specific terminology
- Emphasizes the three protocols (BRACE, IAR, ACR)

## Msingi-Specific Concepts

### Priority Concepts (Core to Msingi)

| Concept | Msingi Application | Priority |
|---------|-------------------|----------|
| **ZKPs** | All three protocols | P0 |
| **Recursive SNARKs** | Halo2 on RPi5 | P0 |
| **SNARK Stack** | Full 3-layer architecture | P0 |
| **Dual Token / Capacity Token** | Device micropayments | P0 |
| **DIDs** | Device commitment C = H(pk‖r) | P0 |
| **Settlement is Compliance** | ACR bounty claims | P1 |
| **Disclosure Regime** | Spending policies | P1 |

### Msingi-Only Concepts (The Three Protocols)

Add these to `src/content/concepts/` for Msingi instance:

```
concepts/
├── brace.mdx                   # Blind Registration via Anonymous Commitment Enrollment
├── iar.mdx                     # Incentivized Anonymous Relay
├── acr.mdx                     # Anonymous Contribution Rewards
├── nullifier.mdx               # Replay prevention primitive
├── device-wallet.mdx           # Why devices need wallets
├── spending-policy.mdx         # ZK-enforced transaction constraints
├── proof-server.mdx            # RPi5 trustless proof generation
└── threat-model.mdx            # Privacy & economic adversaries
```

### Example: BRACE Protocol Concept

```mdx
---
title: "BRACE Protocol"
shortTitle: "BRACE"
projects: ["msingi"]
category: "cryptography"
difficulty: "advanced"
lastUpdated: 2024-12-11
updatedBy: "solomon"
relatedConcepts: ["zkp", "did", "nullifier"]
---

import { Analogy, ProjectExample, ProtocolDiagram } from '../../components';

**B**lind **R**egistration via **A**nonymous **C**ommitment **E**nrollment — devices register on-chain without revealing their identity to infrastructure operators.

<Analogy>
You want to join a club but don't want anyone to know your name. You put your ID card in a locked box, take a photo of the locked box, and submit only the photo. Later, you can prove "I'm the person who submitted that box" without ever opening it.
</Analogy>

## Protocol Flow

<ProtocolDiagram>
1. Device generates keypair `(pk, sk)` inside ATECC608B secure element
2. Device samples random blinding factor `r`
3. Device computes commitment `C = H(pk || r)`
4. Device transmits `C` to proof server (`pk` and `r` remain secret)
5. Proof server adds `C` to Merkle tree, publishes new root
</ProtocolDiagram>

## Attestation Phase

When the device later submits data:

1. Device sends `(data, signature, pk, r, Merkle_path)` via mesh
2. Proof server generates ZK proof:
   - "I know `(pk, r, path)` such that `H(pk||r)` is in registered tree"
   - "AND signature is valid under `pk`"
3. Chain verifies proof, records nullifier
4. **Neither chain nor proof server learns which device submitted**

## Security Property

The **hiding property** of hash function `H` ensures the proof server cannot link commitment `C` back to public key `pk`. Even if the proof server is compromised or coerced, it cannot identify devices.

<ProjectExample project="msingi">
A soil moisture sensor in Manicaland registers via BRACE. The government compels the telecom to reveal all device activity. They see commitment `C = 0x8a3f...` submitted data—but cannot determine which of 10,000 registered sensors it was.
</ProjectExample>

## Guarantees

| Label | Guarantee |
|-------|-----------|
| PG1 | Device anonymity: identification probability ≤ 1/N + negl(λ) |
| PG2 | Unlinkability: can't correlate submissions across epochs |
| PG6 | Key secrecy: can't extract key even with physical device access |
```

## Msingi Color Scheme

```css
/* Amber theme for Msingi */
:root {
  --ms-primary: #d97706;      /* amber-600 */
  --ms-primary-light: #fbbf24; /* amber-400 */
  --ms-primary-dark: #b45309;  /* amber-700 */
  --ms-bg: #78350f;           /* amber-900 */
  --ms-bg-subtle: #92400e;    /* amber-800 */
  --ms-text: #fef3c7;         /* amber-100 */
  --ms-text-muted: #fde68a;   /* amber-200 */
}
```

## Tailwind Overrides (`tailwind.config.mjs`)

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        }
      }
    }
  }
};
```

## Msingi-Specific Components

### ProtocolDiagram.tsx

```tsx
export function ProtocolDiagram({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4 my-4 font-mono text-sm">
      <span className="text-amber-400 text-xs font-semibold uppercase tracking-wide block mb-3">
        Protocol Flow
      </span>
      <div className="text-amber-200 space-y-1">{children}</div>
    </div>
  );
}
```

### GuaranteeTable.tsx

```tsx
type GuaranteeType = 'privacy' | 'economic';

const prefixes: Record<GuaranteeType, string> = {
  privacy: 'PG',
  economic: 'EG'
};

const colors: Record<GuaranteeType, string> = {
  privacy: 'bg-purple-900/30 border-purple-500/30',
  economic: 'bg-emerald-900/30 border-emerald-500/30'
};

interface Guarantee {
  id: number;
  name: string;
  description: string;
}

export function GuaranteeTable({ 
  type, 
  guarantees 
}: { 
  type: GuaranteeType;
  guarantees: Guarantee[];
}) {
  return (
    <div className={`rounded-lg border p-4 my-4 ${colors[type]}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-amber-400">
            <th className="pb-2">Label</th>
            <th className="pb-2">Name</th>
            <th className="pb-2">Meaning</th>
          </tr>
        </thead>
        <tbody className="text-amber-200">
          {guarantees.map(g => (
            <tr key={g.id} className="border-t border-amber-500/20">
              <td className="py-2 font-mono">{prefixes[type]}{g.id}</td>
              <td className="py-2">{g.name}</td>
              <td className="py-2">{g.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### HardwareStack.tsx

```tsx
interface Component {
  name: string;
  function: string;
  cost: string;
}

export function HardwareStack({ 
  title,
  components 
}: { 
  title: string;
  components: Component[];
}) {
  const total = components.reduce((sum, c) => sum + parseFloat(c.cost.replace('$', '')), 0);
  
  return (
    <div className="bg-slate-800 rounded-lg p-4 my-4">
      <h4 className="text-amber-400 font-medium mb-3">{title}</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400">
            <th className="pb-2">Component</th>
            <th className="pb-2">Function</th>
            <th className="pb-2 text-right">Cost</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {components.map((c, i) => (
            <tr key={i} className="border-t border-slate-700">
              <td className="py-2 font-mono text-amber-300">{c.name}</td>
              <td className="py-2">{c.function}</td>
              <td className="py-2 text-right">{c.cost}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-amber-500/50 font-medium">
            <td className="py-2" colSpan={2}>Total</td>
            <td className="py-2 text-right text-amber-400">${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

Usage in MDX:

```mdx
<HardwareStack 
  title="Device Stack (~$50)"
  components={[
    { name: "ESP32-S3", function: "Microcontroller", cost: "$8.00" },
    { name: "ATECC608B", function: "Secure element", cost: "$2.50" },
    { name: "SX1276", function: "LoRa radio", cost: "$6.00" },
    { name: "BME280", function: "Environmental sensor", cost: "$6.00" },
    { name: "Solar + battery", function: "Power", cost: "$16.00" },
    { name: "Enclosure", function: "Weather protection", cost: "$10.00" }
  ]}
/>
```

### ThreatActor.tsx

```tsx
type ActorType = 'privacy' | 'economic';

const icons: Record<string, string> = {
  gov: '🏛️',
  corp: '🏢',
  gw: '📡',
  free: '🆓',
  grief: '💣',
  sybil: '👥'
};

export function ThreatActor({
  id,
  name,
  type,
  capabilities,
  objective
}: {
  id: string;
  name: string;
  type: ActorType;
  capabilities: string;
  objective: string;
}) {
  const bgColor = type === 'privacy' ? 'bg-red-900/30 border-red-500/30' : 'bg-orange-900/30 border-orange-500/30';
  
  return (
    <div className={`rounded-lg border p-4 my-3 ${bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icons[id] || '⚠️'}</span>
        <span className="text-amber-300 font-medium">A_{id} ({name})</span>
      </div>
      <p className="text-slate-300 text-sm mb-1"><strong>Capabilities:</strong> {capabilities}</p>
      <p className="text-slate-300 text-sm"><strong>Objective:</strong> {objective}</p>
    </div>
  );
}
```

## Content Guidelines for Msingi

### Audience

- Primary: Academic reviewers and potential co-authors
- Secondary: Developers implementing protocols
- Tertiary: Hardware engineers building devices

### Tone

- Academically rigorous (this is a research paper)
- Precise cryptographic language
- Always tie to security guarantees (PG1-PG6, EG1-EG4)

### Required Sections per Protocol Concept

1. **One-sentence summary**
2. **Analogy** (physical world equivalent)
3. **Protocol flow** (numbered steps)
4. **Security properties** (which guarantees it provides)
5. **Threat model context** (which adversaries it defeats)
6. **Implementation notes** (hardware/software specifics)

### Cryptographic Notation Standards

```
pk, sk       — public/secret key pair
H(x)         — collision-resistant hash
C            — commitment
r            — random blinding factor
N            — nullifier
λ            — security parameter
negl(λ)      — negligible function
||           — concatenation
```

## Msingi Learning Paths

### Path 1: Protocol Deep-Dive (Reviewers)
```
zkp → nullifier → brace → iar → acr
```

### Path 2: Economic Model (Token Economists)
```
dual-token → capacity-token → spending-policy → device-wallet
```

### Path 3: Hardware Implementation (Engineers)
```
proof-server → snark-stack → recursive-snarks → threat-model
```

### Path 4: Security Analysis (Cryptographers)
```
threat-model → brace (security proof) → iar (incentive analysis) → acr (nullifier correctness)
```

## Decap CMS Customization

Add to `public/admin/config.yml`:

```yaml
collections:
  - name: msingi-concepts
    label: "Msingi Concepts"
    folder: "src/content/concepts"
    filter: { field: "projects", value: "msingi" }
    # ... same fields as main concepts
    
  - name: protocols
    label: "Protocol Specifications"
    folder: "src/content/protocols"
    create: true
    fields:
      - { name: title, label: Title, widget: string }
      - { name: acronym, label: Acronym, widget: string }
      - { name: purpose, label: "One-line Purpose", widget: string }
      - name: guarantees
        label: "Security Guarantees"
        widget: select
        multiple: true
        options: ["PG1", "PG2", "PG3", "PG4", "PG5", "PG6", "EG1", "EG2", "EG3", "EG4"]
      - name: adversaries
        label: "Adversaries Addressed"
        widget: select
        multiple: true
        options: ["A_gov", "A_corp", "A_gw", "A_free", "A_grief", "A_sybil"]
      - { name: lastUpdated, label: "Last Updated", widget: datetime }
      - { name: updatedBy, label: "Updated By", widget: string }
      - { name: body, label: Body, widget: markdown }

  - name: open-questions
    label: "Open Questions (Co-Author Input)"
    folder: "src/content/questions"
    create: true
    fields:
      - { name: title, label: Question, widget: string }
      - name: area
        label: "Research Area"
        widget: select
        options: 
          - "Incentive Design"
          - "Security Proofs"
          - "Economic Modeling"
          - "Related Work"
          - "Broader Impact"
      - { name: context, label: "Context/Background", widget: text }
      - { name: body, label: "Detailed Discussion", widget: markdown }
```

## Integration with EdgeChain Platform

Msingi (device privacy) and EdgeChain (human privacy) share:

- Same Midnight Network foundation
- Same Zimbabwe pilot deployment target
- Same threat actors (A_gov, A_corp)

**Key architectural connection**: Msingi devices collect data that EdgeChain farmers attest to.

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Msingi Device]                    [EdgeChain Farmer]      │
│       │                                    │                │
│       │ anonymous sensor data              │                │
│       ▼                                    │                │
│  [Proof Server]                            │                │
│       │                                    │                │
│       │ ZK attestation                     │ manual report  │
│       ▼                                    ▼                │
│  ┌─────────────────────────────────────────────┐            │
│  │           Midnight Network                   │            │
│  │  ┌─────────────┐    ┌─────────────────────┐ │            │
│  │  │ Msingi      │    │ EdgeChain           │ │            │
│  │  │ Contracts   │───▶│ Contracts           │ │            │
│  │  │ (487 LOC)   │    │ (Dual Merkle Roots) │ │            │
│  │  └─────────────┘    └─────────────────────┘ │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Cross-linking pattern in MDX:

```mdx
import { CrossProjectLink } from '../../components';

Msingi sensors submit anonymous attestations. These can be consumed by <CrossProjectLink project="edgechain" concept="dual-merkle-roots">EdgeChain's Dual Merkle Root system</CrossProjectLink> to verify IoT data separately from manual farmer reports.
```

## Open Questions (Seeking Co-Author Input)

These should be rendered as interactive cards that collaborators can comment on:

| Area | Open Question |
|------|---------------|
| Incentive Design | IAR relay fee calibration? Nash equilibrium proof? |
| Security Proofs | Full security games for PG1, EG1. Reductions to standard assumptions? |
| Economic Modeling | ACR market dynamics, bounty pricing, Sybil cost analysis? |
| Related Work | Positioning vs. multi-agent systems, mechanism design? |
| Broader Impact | Development economics implications? Policy considerations? |

## Questions This File Should Answer

1. **What's the core thesis?** → Anonymity requires device-held keys; ZK policies make it safe
2. **What are the three protocols?** → BRACE (registration), IAR (relay), ACR (rewards)
3. **What color scheme?** → Amber (gold/orange)
4. **What's the hardware stack?** → ESP32-S3 + ATECC608B + LoRa (~$50) + RPi5 (~$110)
5. **What guarantees matter?** → PG1-PG6 (privacy), EG1-EG4 (economic)
6. **How does it connect to EdgeChain?** → Devices feed data; humans attest; both settle on Midnight

---

Last updated: December 2024  
Status: Seeking co-authors; implementation on testnet  
Lead Author: Solomon Kembo
