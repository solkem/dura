# DURA AGENTIC MIGRATION PLAN

> ## 📚 CORE DOCUMENTATION
> 
> | Document | Purpose |
> |----------|---------|
> | [CLAUDE.md](./CLAUDE.md) | Technical implementation & architecture |
> | [CLAUDE-Citizen-Scientist.md](./CLAUDE-Citizen-Scientist.md) | Philosophy, BSR inspiration, Nyakupfuya test |
> | **→ DURA_AGENTIC_MIGRATION.md** | 5-phase agentic AI roadmap |
> 
> *The migration roadmap. Agents serve the Citizen Scientist mission.*

> **Version:** 3.0 — Streamlined  
> **Date:** January 2026  
> **Philosophy:** Build on what works. Add intelligence incrementally.

---

## The Situation

**What works (don't touch):**
- Astro 4.x platform ✅
- SQLite + Drizzle ✅
- Lucia auth ✅
- Pagefind search ✅
- Progress tracking ✅
- Paper library ✅
- Docker + DigitalOcean deployment ✅
- GitHub Actions CI/CD ✅

**What we're adding:**
- 4 AI agents (Curator, Synthesizer, Tutor, Connector)
- Knowledge graph (paper relationships)
- Nyakupfuya summaries (simplified versions)
- Edge deployment (DeepSeek in Odzi/Mbare)
- disruptiveiot.org content pipeline

---

## Migration Principles

1. **No breaking changes** — existing features keep working
2. **Additive only** — new tables, new endpoints, new files
3. **Feature flags** — agents can be enabled/disabled
4. **Incremental value** — each phase delivers usable improvements
5. **Cost awareness** — track API spend from day one

---

## Phase Overview

| Phase | Weeks | Deliverable | User Value |
|-------|-------|-------------|------------|
| **1** | 1-4 | Curator + Synthesizer | Papers get auto-summaries |
| **2** | 5-8 | Knowledge graph + disruptiveiot pipeline | Related papers, blog posts |
| **3** | 9-12 | Tutor + Connector (cloud) | Adaptive explanations |
| **4** | 13-16 | Edge deployment (Odzi) | Offline learning |
| **5** | 17-20 | Expansion + graduation | Independent edge nodes |

---

## Phase 1: Paper Intelligence (Weeks 1-4)

**Goal:** Every paper gets AI-generated metadata and summaries

### 1.1 Database Extensions

Add three tables to existing SQLite (non-destructive):

```sql
-- Run via Drizzle migration

-- Extend papers with agent fields (if not already present)
ALTER TABLE papers ADD COLUMN relevance_score REAL;
ALTER TABLE papers ADD COLUMN difficulty INTEGER;
ALTER TABLE papers ADD COLUMN domain_tags TEXT;
ALTER TABLE papers ADD COLUMN ecosystem_tags TEXT;
ALTER TABLE papers ADD COLUMN curator_status TEXT DEFAULT 'pending';
ALTER TABLE papers ADD COLUMN summary_one_liner TEXT;
ALTER TABLE papers ADD COLUMN summary_paragraph TEXT;
ALTER TABLE papers ADD COLUMN summary_nyakupfuya TEXT;
ALTER TABLE papers ADD COLUMN processed_at TEXT;

-- New: Paper relationships (knowledge graph edges)
CREATE TABLE paper_relations (
  id TEXT PRIMARY KEY,
  source_paper_id TEXT REFERENCES papers(id),
  target_paper_id TEXT REFERENCES papers(id),
  relationship TEXT,
  strength REAL,
  explanation TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- New: Agent logs (cost tracking)
CREATE TABLE agent_logs (
  id TEXT PRIMARY KEY,
  paper_id TEXT,
  agent TEXT,
  model TEXT,
  tokens_in INTEGER,
  tokens_out INTEGER,
  latency_ms INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 1.2 File Structure (New Files Only)

```
src/
├── agents/                      # NEW FOLDER
│   ├── index.ts                 # Agent exports
│   ├── curator/
│   │   ├── index.ts             # curatePaper()
│   │   └── prompt.ts            # System prompt
│   ├── synthesizer/
│   │   ├── index.ts             # synthesizePaper()
│   │   └── prompt.ts            # System prompt
│   └── utils/
│       ├── anthropic.ts         # API client wrapper
│       └── logger.ts            # Cost tracking
├── pages/
│   └── api/
│       └── agents/              # NEW FOLDER
│           ├── curate.ts        # POST /api/agents/curate
│           ├── synthesize.ts    # POST /api/agents/synthesize
│           └── process-paper.ts # POST /api/agents/process-paper (full pipeline)
└── components/
    └── admin/                   # NEW FOLDER
        └── PaperProcessor.tsx   # UI for paper ingestion
```

### 1.3 Curator Agent

```typescript
// src/agents/curator/index.ts
import { anthropic } from '../utils/anthropic';
import { logAgentCall } from '../utils/logger';
import { CURATOR_PROMPT } from './prompt';

export interface CuratorInput {
  title: string;
  abstract?: string;
  fullText?: string;
  pdfUrl?: string;
}

export interface CuratorOutput {
  relevanceScore: number;      // 0-1
  difficulty: 1 | 2 | 3 | 4 | 5;
  domainTags: string[];        // ["blockchain", "ai", "edge", "iot", "privacy"]
  ecosystemTags: string[];     // ["edgechain", "msingi", "ndani"]
  keyContributions: string[];
  curatorStatus: 'approved' | 'rejected' | 'needs-review';
  curatorNotes: string;
}

export async function curatePaper(input: CuratorInput): Promise<CuratorOutput> {
  const start = Date.now();
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: CURATOR_PROMPT,
    messages: [{
      role: 'user',
      content: `Curate this paper:\n\nTitle: ${input.title}\n\nAbstract: ${input.abstract || 'Not provided'}\n\nFull text: ${input.fullText || 'Not provided'}`
    }]
  });

  const output = JSON.parse(response.content[0].type === 'text' ? response.content[0].text : '{}');
  
  await logAgentCall({
    agent: 'curator',
    model: 'claude-sonnet-4',
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
    latencyMs: Date.now() - start,
  });

  return output;
}
```

```typescript
// src/agents/curator/prompt.ts
export const CURATOR_PROMPT = `You are the Curator for Dura — "The Knowledge Granary."

TARGET AUDIENCE: Citizen Scientists — university-excluded young Zimbabweans aged 16-30 seeking locally-framed science.

EVALUATE papers for:

1. RELEVANCE (0.0-1.0)
   - Blockchain / ZK / Privacy: high relevance
   - AI / ML / Federated Learning: high relevance
   - Edge / Offline-first: high relevance
   - IoT / Agriculture / Africa: high relevance
   - Generic tech with no local angle: low relevance

2. DIFFICULTY (1-5)
   1 = No prerequisites, anyone can understand
   2 = Some technical background helps
   3 = Undergraduate level
   4 = Graduate level
   5 = Research frontier

3. ECOSYSTEM TAGS
   - "edgechain" = privacy-preserving agriculture
   - "msingi" = device identity, anonymous attestation
   - "ndani" = edge hardware, local proofs

4. DECISION
   - APPROVE: relevance ≥ 0.5, practical applicability
   - REJECT: relevance < 0.3, purely theoretical
   - NEEDS-REVIEW: borderline cases

Return JSON only:
{
  "relevanceScore": 0.0-1.0,
  "difficulty": 1-5,
  "domainTags": ["blockchain", "ai", "edge", "iot", "privacy", "agriculture"],
  "ecosystemTags": ["edgechain", "msingi", "ndani"],
  "keyContributions": ["contribution 1", "contribution 2"],
  "curatorStatus": "approved|rejected|needs-review",
  "curatorNotes": "explanation"
}`;
```

### 1.4 Synthesizer Agent

```typescript
// src/agents/synthesizer/index.ts
import { anthropic } from '../utils/anthropic';
import { SYNTHESIZER_PROMPT } from './prompt';

export interface SynthesizerInput {
  paper: {
    id: string;
    title: string;
    abstract: string;
    domainTags: string[];
  };
  existingPapers: Array<{
    id: string;
    title: string;
    domainTags: string[];
  }>;
}

export interface SynthesizerOutput {
  summaries: {
    oneLiner: string;       // <100 chars, punchy
    paragraph: string;      // 2-3 sentences
    nyakupfuya: string;     // Simplified for rural learners
  };
  relatedPapers: Array<{
    paperId: string;
    relationship: 'builds-upon' | 'implements' | 'extends' | 'enables';
    strength: number;
    explanation: string;
  }>;
  prerequisites: string[];  // Paper IDs that should be read first
}

export async function synthesizePaper(input: SynthesizerInput): Promise<SynthesizerOutput> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SYNTHESIZER_PROMPT,
    messages: [{
      role: 'user',
      content: JSON.stringify(input, null, 2)
    }]
  });

  return JSON.parse(response.content[0].type === 'text' ? response.content[0].text : '{}');
}
```

```typescript
// src/agents/synthesizer/prompt.ts
export const SYNTHESIZER_PROMPT = `You are the Synthesizer for Dura — "The Knowledge Granary."

Your job: Connect new papers to existing knowledge and generate accessible summaries.

THE NYAKUPFUYA TEST
"Nyakupfuya" (Shona) = livestock keeper. If a livestock keeper in rural Zimbabwe with intermittent connectivity would find this useful, it passes.

For the "nyakupfuya" summary:
- Use farming, cooking, family, local business analogies
- Short sentences, active voice
- No jargon without immediate explanation
- Concrete, not abstract

RELATIONSHIPS:
- "builds-upon": This paper extends ideas from another
- "implements": This paper puts another's theory into practice
- "extends": This paper adds to another's scope
- "enables": This paper makes another possible

Return JSON only:
{
  "summaries": {
    "oneLiner": "<100 chars, the hook",
    "paragraph": "2-3 sentences for quick understanding",
    "nyakupfuya": "Simplified explanation using local analogies"
  },
  "relatedPapers": [
    {
      "paperId": "existing-paper-id",
      "relationship": "builds-upon|implements|extends|enables",
      "strength": 0.0-1.0,
      "explanation": "why they're related"
    }
  ],
  "prerequisites": ["paper-id-1", "paper-id-2"]
}`;
```

### 1.5 API Endpoint

```typescript
// src/pages/api/agents/process-paper.ts
import type { APIRoute } from 'astro';
import { curatePaper } from '@/agents/curator';
import { synthesizePaper } from '@/agents/synthesizer';
import { db } from '@/db';
import { papers, paperRelations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const POST: APIRoute = async ({ request, locals }) => {
  // Admin only
  if (!locals.session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { paperId, title, abstract, fullText } = await request.json();

  // Step 1: Curate
  const curatorResult = await curatePaper({ title, abstract, fullText });
  
  if (curatorResult.curatorStatus === 'rejected') {
    return new Response(JSON.stringify({
      status: 'rejected',
      curator: curatorResult
    }));
  }

  // Step 2: Get existing papers for synthesis
  const existingPapers = await db.select({
    id: papers.id,
    title: papers.title,
    domainTags: papers.domainTags,
  }).from(papers).where(eq(papers.curatorStatus, 'approved'));

  // Step 3: Synthesize
  const synthesizerResult = await synthesizePaper({
    paper: { id: paperId, title, abstract, domainTags: curatorResult.domainTags },
    existingPapers: existingPapers.map(p => ({
      ...p,
      domainTags: JSON.parse(p.domainTags || '[]')
    })),
  });

  // Step 4: Update paper record
  await db.update(papers).set({
    relevanceScore: curatorResult.relevanceScore,
    difficulty: curatorResult.difficulty,
    domainTags: JSON.stringify(curatorResult.domainTags),
    ecosystemTags: JSON.stringify(curatorResult.ecosystemTags),
    curatorStatus: curatorResult.curatorStatus,
    summaryOneLiner: synthesizerResult.summaries.oneLiner,
    summaryParagraph: synthesizerResult.summaries.paragraph,
    summaryNyakupfuya: synthesizerResult.summaries.nyakupfuya,
    processedAt: new Date().toISOString(),
  }).where(eq(papers.id, paperId));

  // Step 5: Save relations
  for (const rel of synthesizerResult.relatedPapers) {
    await db.insert(paperRelations).values({
      id: nanoid(),
      sourcePaperId: paperId,
      targetPaperId: rel.paperId,
      relationship: rel.relationship,
      strength: rel.strength,
      explanation: rel.explanation,
    });
  }

  return new Response(JSON.stringify({
    status: 'success',
    curator: curatorResult,
    synthesizer: synthesizerResult,
  }));
};
```

### 1.6 Phase 1 Checklist

```markdown
## Week 1
- [ ] Create `src/agents/` folder structure
- [ ] Implement Anthropic client wrapper with error handling
- [ ] Implement agent logging (cost tracking)
- [ ] Write Curator agent + prompt

## Week 2  
- [ ] Write Synthesizer agent + prompt
- [ ] Create Drizzle migration for new columns/tables
- [ ] Run migration on local.db
- [ ] Test with 3 papers manually

## Week 3
- [ ] Create `/api/agents/process-paper` endpoint
- [ ] Build simple admin UI component
- [ ] Process 10 real papers
- [ ] Review quality of summaries

## Week 4
- [ ] Refine prompts based on output quality
- [ ] Add batch processing capability
- [ ] Deploy to production
- [ ] Document cost per paper
```

### 1.7 Success Criteria

| Metric | Target |
|--------|--------|
| Papers processed | 20+ |
| Curator accuracy | >80% agreement with manual review |
| Nyakupfuya quality | Passes test (human review) |
| Cost per paper | <$0.10 |
| Processing time | <30 seconds |

---

## Phase 2: Knowledge Graph + Content Pipeline (Weeks 5-8)

**Goal:** Papers connect to each other; content flows to disruptiveiot.org

### 2.1 Knowledge Graph Visualization

```typescript
// src/components/KnowledgeGraph.tsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  title: string;
  difficulty: number;
  ecosystemTags: string[];
}

interface Edge {
  source: string;
  target: string;
  relationship: string;
  strength: number;
}

export function KnowledgeGraph({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).strength((d: any) => d.strength))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Draw edges
    const link = svg.selectAll('.link')
      .data(edges)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#666')
      .attr('stroke-width', (d) => d.strength * 3);
    
    // Draw nodes
    const node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', (d) => 10 + d.difficulty * 3)
      .attr('fill', (d) => getEcosystemColor(d.ecosystemTags[0]));
    
    // ... rest of D3 code
  }, [nodes, edges]);
  
  return <svg ref={svgRef} width={800} height={600} />;
}

function getEcosystemColor(tag: string): string {
  const colors: Record<string, string> = {
    edgechain: '#059669',
    msingi: '#d97706',
    ndani: '#0891b2',
  };
  return colors[tag] || '#6b7280';
}
```

### 2.2 disruptiveiot.org Pipeline

```typescript
// src/agents/blogger/index.ts

export interface BlogPostInput {
  paper: {
    title: string;
    summaryNyakupfuya: string;
    keyContributions: string[];
    ecosystemTags: string[];
  };
}

export interface BlogPostOutput {
  title: string;
  hook: string;           // Opening that grabs attention
  body: string;           // Main content (Markdown)
  callToAction: string;   // What reader should do next
  tags: string[];
}

export async function generateBlogPost(input: BlogPostInput): Promise<BlogPostOutput> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system: BLOGGER_PROMPT,
    messages: [{
      role: 'user',
      content: JSON.stringify(input)
    }]
  });
  
  return JSON.parse(response.content[0].type === 'text' ? response.content[0].text : '{}');
}

const BLOGGER_PROMPT = `You write for disruptiveiot.org — a blog about The Economy of Things.

TARGET READER: University-excluded young Zimbabwean, age 16-30, hearing about AI everywhere but getting Silicon Valley answers.

YOUR VOICE:
- BSR-inspired: Create anticipation, spark discourse
- Local framing: Zimbabwean problems first, then science
- Accessible ≠ dumbed down: Respect intelligence, don't assume context
- AI as hook: "What does this mean for YOU?"

STRUCTURE:
1. HOOK: Why should a young person in Mbare care about this?
2. THE PROBLEM: What's broken? (locally framed)
3. THE INSIGHT: What does this paper reveal?
4. SO WHAT: How does this change things?
5. CALL TO ACTION: What can the reader do?

Return JSON:
{
  "title": "attention-grabbing title",
  "hook": "opening paragraph that creates urgency",
  "body": "main content in Markdown",
  "callToAction": "what reader should do next",
  "tags": ["economy-of-things", "ai", "zimbabwe"]
}`;
```

### 2.3 Phase 2 Checklist

```markdown
## Week 5
- [ ] Build knowledge graph API endpoint
- [ ] Create React visualization component
- [ ] Add to paper detail pages

## Week 6
- [ ] Implement Blogger agent
- [ ] Create review queue for blog posts
- [ ] Test with 5 papers → blog posts

## Week 7
- [ ] Build Ghost CMS integration (API)
- [ ] Create "Publish to disruptiveiot" flow
- [ ] Human review step before publish

## Week 8
- [ ] Refine blog post quality
- [ ] Add "Related papers" to blog posts
- [ ] Document full pipeline
```

---

## Phase 3: Tutor + Connector (Weeks 9-12)

**Goal:** Adaptive explanations that work for Citizen Scientists

### 3.1 Tutor Agent (Cloud First)

```typescript
// src/agents/tutor/index.ts

export interface TutorInput {
  userId: string;
  paperId: string;
  question: string;
  userProgress: {
    papersRead: string[];
    conceptsUnderstood: string[];
  };
}

export interface TutorOutput {
  response: string;
  prerequisiteCheck: {
    ready: boolean;
    missingPrerequisites: string[];
  };
  followUpQuestions: string[];
  suggestedNextPaper: string | null;
}

export async function askTutor(input: TutorInput): Promise<TutorOutput> {
  const paper = await getPaper(input.paperId);
  const relatedPapers = await getRelatedPapers(input.paperId);
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: TUTOR_PROMPT,
    messages: [{
      role: 'user',
      content: JSON.stringify({
        question: input.question,
        paper: {
          title: paper.title,
          summaryNyakupfuya: paper.summaryNyakupfuya,
          difficulty: paper.difficulty,
        },
        userProgress: input.userProgress,
        relatedPapers: relatedPapers.map(p => ({ id: p.id, title: p.title })),
      })
    }]
  });
  
  return JSON.parse(response.content[0].type === 'text' ? response.content[0].text : '{}');
}
```

### 3.2 Connector Contexts

```typescript
// src/agents/connector/contexts.ts

export const CONNECTOR_CONTEXTS: Record<string, string> = {
  odzi: `
LOCATION: Odzi, Manicaland Province (rural/peri-urban)
INDUSTRIES: Agriculture (maize, tobacco, cattle), small-scale mining
CONNECTIVITY: 2G primary, 3G occasional
DEVICES: Shared Android phones, 2-4 years old
POWER: Grid unreliable, solar common

EXAMPLE MAPPINGS:
- "server" → "main shop in town that everyone goes to"
- "distributed system" → "farmers sharing market prices through contacts"
- "API" → "standard way to place orders any shop understands"
- "encryption" → "speaking in code so eavesdroppers don't understand"
- "blockchain" → "community ledger that everyone can see but nobody can cheat"
`,

  mbare: `
LOCATION: Mbare, Harare (urban high-density)
INDUSTRIES: Informal trading, transport, urban agriculture
CONNECTIVITY: 3G common, WiFi at cafes
DEVICES: Personal phones more common, wider range
POWER: Grid primary, load shedding frequent

EXAMPLE MAPPINGS:
- "server" → "Mbare Musika — everyone comes there first"
- "load balancing" → "vendors spreading across market to reduce crowding"
- "caching" → "keeping popular items at front of stall"
- "smart contract" → "EcoCash — deal executes automatically"
- "consensus" → "whole kombi rank agrees on price before anyone moves"
`,

  riverside: `
LOCATION: Riverside, Odzi area (peri-urban community)
INDUSTRIES: Mixed farming, small business
CONNECTIVITY: 2G, occasional 3G from nearby tower
DEVICES: Shared family phones
POWER: Solar + occasional grid

EXAMPLE MAPPINGS:
- Uses Odzi context with more agricultural focus
- Emphasize cooperative examples (savings clubs, farming groups)
`
};
```

### 3.3 Phase 3 Checklist

```markdown
## Week 9
- [ ] Implement Tutor agent
- [ ] Add prerequisite checking logic
- [ ] Create chat UI component

## Week 10
- [ ] Implement Connector contexts
- [ ] Integrate Connector with Tutor
- [ ] Test with real users (cloud)

## Week 11
- [ ] Refine Tutor prompts based on feedback
- [ ] Add "learning path" suggestions
- [ ] Progress updates from Tutor interactions

## Week 12
- [ ] Document Tutor/Connector for edge port
- [ ] Extract prompts to standalone files
- [ ] Benchmark response quality
```

---

## Phase 4: Edge Deployment (Weeks 13-16)

**Goal:** DeepSeek R1 14B running in Odzi, serving users offline

### 4.1 Hardware Spec

| Component | Spec | Cost (USD) |
|-----------|------|------------|
| Mini PC | Intel i5/Ryzen 5, 32GB RAM, 1TB NVMe | $400 |
| GPU | NVIDIA RTX 3060 12GB | $300 |
| UPS | 2kVA, 2-hour runtime | $200 |
| Solar (optional) | 200W panel + controller | $300 |
| Network | 4G router + antenna | $150 |
| Enclosure | Ventilated, lockable | $100 |
| **Total** | | **~$1,450** |

### 4.2 Edge Software Stack

```bash
# Odzi Node Setup

# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull DeepSeek model
ollama pull deepseek-r1:14b-qwen-distill-q4_K_M

# 3. Clone edge runtime
git clone https://github.com/solkem/dura-edge.git
cd dura-edge
npm install && npm run build

# 4. Configure
cat > .env << EOF
NODE_ID=odzi-01
CONNECTOR_CONTEXT=odzi
CLOUD_SYNC_URL=https://dura.disruptiveiot.org/api/sync
OLLAMA_HOST=http://localhost:11434
EOF

# 5. Initial sync (downloads papers, summaries, knowledge graph)
npm run sync

# 6. Start
npm run start
```

### 4.3 Sync Protocol

```typescript
// Cloud: src/pages/api/sync/package.ts

export interface SyncPackage {
  version: string;
  timestamp: string;
  papers: Array<{
    id: string;
    title: string;
    summaryNyakupfuya: string;
    summaryParagraph: string;
    difficulty: number;
    prerequisites: string[];
  }>;
  relations: Array<{
    source: string;
    target: string;
    relationship: string;
  }>;
  glossary: Record<string, string>;
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const since = url.searchParams.get('since'); // ISO timestamp
  
  const papers = await getChangedPapers(since);
  const relations = await getRelations(papers.map(p => p.id));
  
  const pkg: SyncPackage = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    papers: papers.map(p => ({
      id: p.id,
      title: p.title,
      summaryNyakupfuya: p.summaryNyakupfuya,
      summaryParagraph: p.summaryParagraph,
      difficulty: p.difficulty,
      prerequisites: JSON.parse(p.prerequisites || '[]'),
    })),
    relations,
    glossary: await getGlossary(),
  };
  
  // Target: <5MB for 2G viability
  return new Response(JSON.stringify(pkg), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### 4.4 Knowledge Transfer

During Phase 4, we run both Claude (cloud) and DeepSeek (edge) in parallel:

```typescript
// Knowledge transfer: Claude teaches DeepSeek

interface TransferArtifact {
  input: string;
  claudeOutput: string;
  claudeReasoning: string;
  inputType: 'explanation' | 'localization' | 'prerequisite-check';
}

// For first 4 months, every cloud Tutor call becomes a training artifact
async function tutorWithTransfer(input: TutorInput): Promise<TutorOutput> {
  // Get Claude's response with reasoning
  const claudeResponse = await anthropic.messages.create({
    model: 'claude-opus-4-20250514', // Use Opus for quality
    max_tokens: 3000,
    system: `${TUTOR_PROMPT}\n\nInclude your reasoning in <reasoning> tags.`,
    messages: [{ role: 'user', content: JSON.stringify(input) }]
  });
  
  // Save as transfer artifact
  await saveTransferArtifact({
    input: JSON.stringify(input),
    claudeOutput: claudeResponse.content,
    inputType: 'explanation',
  });
  
  return parseOutput(claudeResponse);
}
```

### 4.5 Phase 4 Checklist

```markdown
## Week 13
- [ ] Procure hardware
- [ ] Secure installation site in Odzi
- [ ] Set up network connectivity

## Week 14
- [ ] Install software stack
- [ ] Configure Ollama + DeepSeek
- [ ] Initial sync from cloud

## Week 15
- [ ] Port Tutor/Connector to edge runtime
- [ ] Test with 5 pilot users
- [ ] Compare quality: Claude vs DeepSeek

## Week 16
- [ ] Refine edge prompts
- [ ] Implement offline progress tracking
- [ ] Document edge operations
```

---

## Phase 5: Expansion + Graduation (Weeks 17-20)

**Goal:** Mbare node operational, edge handles 95% of queries

### 5.1 Mbare Node

Same hardware, different context:
- `NODE_ID=mbare-01`
- `CONNECTOR_CONTEXT=mbare`

### 5.2 Mesh Sync

```typescript
// Edge nodes sync with each other (not just cloud)

interface MeshSync {
  sourceNode: string;
  targetNode: string;
  artifactsShared: number;
  progressPatternsShared: boolean;
}

// Odzi shares its transfer artifacts with Mbare
// Both nodes improve from each other's learnings
```

### 5.3 Graduation Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cloud fallback rate | <5% | Queries needing Claude |
| Response quality | 85% of Claude | Human evaluation |
| User satisfaction | 4/5 | Survey |
| Latency p95 | <500ms | Edge response time |

### 5.4 Phase 5 Checklist

```markdown
## Week 17
- [ ] Deploy Mbare node
- [ ] Implement mesh sync
- [ ] Share transfer artifacts between nodes

## Week 18
- [ ] 10 users per node
- [ ] Track fallback rate
- [ ] Quality comparison

## Week 19
- [ ] Refine edge prompts
- [ ] Reduce fallback rate
- [ ] User feedback collection

## Week 20
- [ ] Graduation assessment
- [ ] Document lessons learned
- [ ] Plan next expansion
```

---

## Cost Projections

### Cloud Phase (Months 1-4)

| Item | Monthly |
|------|---------|
| Claude API (Opus for transfer) | $150-200 |
| Claude API (Sonnet for agents) | $50-100 |
| DigitalOcean hosting | $20 |
| **Total** | **~$250/month** |

### Edge Phase (Month 5+)

| Item | One-time | Monthly |
|------|----------|---------|
| Odzi hardware | $1,450 | — |
| Mbare hardware | $1,450 | — |
| Electricity | — | $30 |
| Cloud fallback | — | $20 |
| Hosting | — | $20 |
| **Total** | **$2,900** | **$70/month** |

### Break-even

Cloud-only: ~$250/month × 12 = $3,000/year
Edge: $2,900 + ($70 × 12) = $3,740 year 1, $840/year after

**Break-even: ~14 months**, then savings of ~$2,160/year

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| DeepSeek quality insufficient | Maintain cloud fallback, continue transfer training |
| Hardware failure | UPS, remote monitoring, spare parts budget |
| Power outages | Solar backup, graceful state preservation |
| Low user adoption | Start with known community, demonstrate value |

---

## Quick Reference: What Goes Where

| Thing | Location |
|-------|----------|
| Agents code | `src/agents/` |
| Agent API routes | `src/pages/api/agents/` |
| Database schema | `src/db/schema.ts` |
| Tutor/Connector prompts | `src/agents/tutor/prompt.ts`, `src/agents/connector/contexts.ts` |
| Edge runtime | Separate repo: `solkem/dura-edge` |
| Sync endpoint | `src/pages/api/sync/` |

---

## Next Steps

**This week:**
1. Create `src/agents/` folder
2. Implement Curator agent
3. Test with 3 papers

**Start here:**
```bash
cd dura
mkdir -p src/agents/{curator,synthesizer,utils}
npm install @anthropic-ai/sdk nanoid
```

---

*"The granary feeds the village. The village tends the granary."*
