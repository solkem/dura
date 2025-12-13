# CLAUDE.md — EdgeChain Learning Platform

## Project Identity

**Name**: EdgeChain Learning Hub  
**Purpose**: Interactive documentation for privacy-preserving agricultural AI  
**Parent**: Midnight Learning Platform  
**Lead**: Solomon Kembo  
**Focus**: Human privacy for smallholder farmers

## Relationship to Main Platform

This is a **themed instance** of the Midnight Learning Platform, filtered and customized for EdgeChain. It inherits all architecture from the main platform but:

- Defaults to showing EdgeChain examples prominently
- Uses emerald color scheme throughout
- Includes agriculture/development-specific terminology
- Supports SMS-accessibility considerations in design

## EdgeChain-Specific Concepts

### Priority Concepts (Core to EdgeChain)

| Concept | EdgeChain Application | Priority |
|---------|----------------------|----------|
| **ZKPs** | ProveYieldAboveThreshold circuits | P0 |
| **Kachina/Compact** | Smart contract DSL | P0 |
| **Disclosure Regime** | Selective compliance proofs | P0 |
| **Settlement is Compliance** | Reward gating | P0 |
| **Noncreds** | Farmer attestations | P1 |
| **Reg-Tech** | NGO compliance verification | P1 |
| **DIDs** | Farmer identity anchors | P2 |

### EdgeChain-Only Concepts

Add these to `src/content/concepts/` for EdgeChain instance:

```
concepts/
├── federated-learning.mdx      # AI training without data centralization
├── dual-merkle-roots.mdx       # IoT vs manual data verification
├── sms-first-design.mdx        # 2G compatibility patterns
├── data-minimization.mdx       # Commitment-based storage
└── nyakupfuya-principle.mdx    # "Does this protect the farmer?"
```

### Example: Federated Learning Concept

```mdx
---
title: "Federated Learning"
shortTitle: "FL"
projects: ["edgechain"]
category: "cryptography"
difficulty: "intermediate"
lastUpdated: 2024-12-11
updatedBy: "solomon"
relatedConcepts: ["zkp", "data-minimization"]
---

import { Analogy, ProjectExample } from '../../components';

A machine learning approach where AI models train on local data; only model updates (gradients) leave the device, never raw data.

<Analogy>
Instead of students sending their homework to a central teacher, each student learns locally and only shares "I improved by 5% on multiplication." The teacher aggregates improvements without seeing any homework.
</Analogy>

## Why It Matters for EdgeChain

Traditional agricultural AI requires farmers to upload sensitive data:
- Exact yields (pricing manipulation risk)
- Field locations (land grabbing risk)
- Planting schedules (political targeting risk)

Federated learning inverts this: **the model comes to the data, not data to the model.**

<ProjectExample project="edgechain">
Pest detection model trains across 1000 farms. Each farm's phone runs local training on its crop images. Only gradient updates aggregate to improve the global model. No farm's images ever leave their device.
</ProjectExample>

## Integration with ZKPs

EdgeChain adds a ZK layer: farmers can prove "my local model achieved 85% accuracy" without revealing:
- What crops they grow
- Where their farm is located
- What pests they've encountered
```

## EdgeChain Color Scheme

```css
/* Emerald theme for EdgeChain */
:root {
  --ec-primary: #059669;      /* emerald-600 */
  --ec-primary-light: #34d399; /* emerald-400 */
  --ec-primary-dark: #047857;  /* emerald-700 */
  --ec-bg: #064e3b;           /* emerald-900 */
  --ec-bg-subtle: #065f46;    /* emerald-800 */
  --ec-text: #d1fae5;         /* emerald-100 */
  --ec-text-muted: #a7f3d0;   /* emerald-200 */
}
```

## Tailwind Overrides (`tailwind.config.mjs`)

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        }
      }
    }
  }
};
```

## EdgeChain-Specific Components

### FarmerPersona.tsx

```tsx
export function FarmerPersona({ 
  name = "Nyakupfuya",
  scenario 
}: { 
  name?: string;
  scenario: string 
}) {
  return (
    <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🌾</span>
        <span className="text-emerald-400 font-medium">{name}'s Perspective</span>
      </div>
      <p className="text-emerald-200 text-sm italic">"{scenario}"</p>
    </div>
  );
}
```

### SMSPreview.tsx

```tsx
export function SMSPreview({ 
  incoming,
  outgoing 
}: { 
  incoming: string;
  outgoing: string;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 my-4 font-mono text-sm">
      <div className="text-emerald-400 mb-2">
        <span className="text-slate-500">→ </span>{incoming}
      </div>
      <div className="text-emerald-200">
        <span className="text-slate-500">← </span>{outgoing}
      </div>
    </div>
  );
}
```

Usage in MDX:

```mdx
<SMSPreview 
  incoming="YIELD 450 MAIZE"
  outgoing="Recorded. Code: 8a3f2b1c. Reply CLAIM to request payment."
/>
```

## Content Guidelines for EdgeChain

### Audience

- Primary: Developers building on EdgeChain
- Secondary: Researchers/reviewers evaluating the project
- Tertiary: NGO partners understanding the privacy model

### Tone

- Empathetic to farmer constraints (poverty, connectivity, trust)
- Technically rigorous but accessible
- Always tie back to "Does this protect Nyakupfuya?"

### Required Sections per Concept

1. **Plain English explanation** (8th grade reading level)
2. **Analogy** (preferably agriculture-related)
3. **Why it matters for farmers** (threat model context)
4. **EdgeChain implementation** (technical details)
5. **SMS interface example** (where applicable)

### Forbidden Patterns

- Don't assume smartphone access
- Don't require internet beyond SMS
- Don't store data when commitment suffices
- Don't use jargon without defining it first

## EdgeChain Learning Paths

### Path 1: Privacy Fundamentals (Researchers/Reviewers)
```
zkp → disclosure-regime → noncreds → settlement-compliance
```

### Path 2: Technical Implementation (Developers)
```
kachina → snark-stack → federated-learning → dual-merkle-roots
```

### Path 3: Development Context (NGO Partners)
```
nyakupfuya-principle → data-minimization → sms-first-design → regtech
```

## Decap CMS Customization

Add to `public/admin/config.yml`:

```yaml
collections:
  - name: edgechain-concepts
    label: "EdgeChain Concepts"
    folder: "src/content/concepts"
    filter: { field: "projects", value: "edgechain" }
    # ... same fields as main concepts
    
  - name: farmer-stories
    label: "Farmer Stories"
    folder: "src/content/stories"
    create: true
    fields:
      - { name: title, label: Title, widget: string }
      - { name: persona, label: "Farmer Persona", widget: string, default: "Nyakupfuya" }
      - { name: threat, label: "Threat Scenario", widget: text }
      - { name: protection, label: "How EdgeChain Protects", widget: text }
      - { name: body, label: Body, widget: markdown }
```

## Integration with Main Msingi Platform

EdgeChain (human privacy) and Msingi (device privacy) share:

- Same Midnight Network foundation
- Same ZKP/SNARK stack
- Same Ouroboros consensus inheritance
- Same Zimbabwe pilot deployment target

Cross-linking pattern in MDX:

```mdx
import { CrossProjectLink } from '../../components';

EdgeChain protects farmer identity while <CrossProjectLink project="msingi" concept="brace">Msingi's BRACE protocol</CrossProjectLink> protects the IoT sensors collecting field data. Together, they form a complete privacy stack.
```

## Questions This File Should Answer

1. **How is EdgeChain different from Msingi?** → Human privacy vs device privacy
2. **What color scheme?** → Emerald (green)
3. **Who is Nyakupfuya?** → Symbolic farmer persona driving design decisions
4. **What's the SMS pattern?** → `COMMAND DATA` → `Response. Code: xxx`
5. **How do concepts connect?** → Three learning paths for different audiences

---

Last updated: December 2024  
Status: Initial implementation  
Maintainer: Solomon Kembo
