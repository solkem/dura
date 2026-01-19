# Dura Citizen Scientist Strategy

> ## 📚 CORE DOCUMENTATION
> 
> | Document | Purpose |
> |----------|---------|
> | [CLAUDE.md](./CLAUDE.md) | Technical implementation & architecture |
> | **→ CLAUDE-Citizen-Scientist.md** | Philosophy, BSR inspiration, Nyakupfuya test |
> | [DURA_AGENTIC_MIGRATION.md](./DURA_AGENTIC_MIGRATION.md) | 5-phase agentic AI roadmap |
> 
> *The philosophical foundation. Read this first to understand WHY.*

## Context

This document captures strategic decisions made during auth design discussions for Dura's public-facing "Citizen Scientist" side. Use this as foundation for subsequent technical implementation conversations.

---

## Inspiration: Big Saturday Read (BSR)

Dura's public side is modeled on Dr. Alex Magaisa's [Big Saturday Read](https://thebigsr.africa/) - a platform that made complex legal concepts accessible to ordinary Zimbabweans during political crises.

**What BSR achieved:**
- Created anticipation (people waited for Saturday)
- Sparked community discourse (WhatsApp sharing, group discussions)
- Made expert knowledge accessible without dumbing it down
- Built reputation and community without NGO funding

**Dura's challenge:** Science lacks the immediate urgency of politics. The hook must be different.

---

## Two Problems Dura Addresses

### Problem 1: Borrowed Research Agendas

Zimbabwean universities rely on research thrusts from academics who studied abroad. A researcher trained in Sweden imports Swedish priorities (e.g., space exploration) rather than asking "what problems does Zimbabwe have?" Institutions optimize for foreign challenges while local ones go unaddressed.

### Problem 2: University as Gatekeeper of Scientific Relevance

If you can't attend university, science becomes abstract and irrelevant. The practical value ("how does this help me grow food, solve problems?") disappears. Science becomes something that happens *to* people, not *for* them.

**The intersection (Dura's thesis):**
1. Model indigenous research framing - start from Zimbabwean problems, work backward to the science
2. Break the university monopoly on scientific relevance - make locally-framed science accessible to those who will never sit in a lecture hall

---

## Target User: Citizen Scientist Reader

### Primary Profile

**The university-excluded or university-disillusioned young Zimbabwean**

- **Age:** 16-30
- **Situation:** Finished O-levels or A-levels; maybe started tertiary but couldn't continue (fees, economic pressure, family obligations); or looked at what university offers and saw no relevance
- **Device:** Phone (Android), data-conscious
- **Current relationship to science:** Sees it as foreign, academic, disconnected from survival
- **Core need:** "This knowledge is *mine* - it's about *my* problems - and I can use it without a degree"

### Entry Point

**AI is the hook.** Everyone's hearing about AI but getting answers framed for Silicon Valley:
- "AI will transform knowledge work" (irrelevant to 90% informal employment)
- "AI will take your job" (fear-based, no agency)
- "AI requires cloud infrastructure" (disconnected from local reality)

Dura answers: "What does AI mean for a country with unreliable power, informal economy, and borrowed research agendas?"

### Success Metrics

1. **Anticipation:** Looking forward to the next article (the BSR mechanic)
2. **Discourse:** Discussing articles among peers, sharing in WhatsApp groups
3. **Agency:** Understanding science as relevant to their lives, not foreign abstraction

### Differentiation from YouTube

**Local framing.** Not generic explainers but science explained through Zimbabwean problems.

---

## Unresolved Tensions

### Age Spread (16-30)
Covers very different life situations:
- 17-year-old who just finished O-levels and can't afford A-levels
- 24-year-old hustling in informal economy with failed polytechnic behind them
- 29-year-old hearing about AI threatening their livelihood

*Decision needed: Same content for all, or segmented paths?*

### Excluded vs. Disillusioned
Different psychologies:
- **Excluded:** "I wanted to go but couldn't" - may carry shame, hunger to prove themselves
- **Disillusioned:** "I rejected what university offers" - more confident, skeptical of institutions

*Decision needed: Which is primary? Does tone differ?*

### Urban vs. Rural
The Nyakupfuya Test demands rural accessibility, but AI discourse lands first in urban/peri-urban spaces.

*Decision needed: Launch reader urban with rural as design constraint? Or rural-first?*

### Gender
Young Zimbabwean women face different barriers.

*Decision needed: Does Dura speak to them specifically?*

---

## Funding Tension

### The Bind

Dura's differentiation is locally-framed science that doesn't import foreign agendas. But organizations with funding for educational platforms *are* the foreign-agenda importers (NGOs, development sector). Taking their money often means adopting their frameworks and metrics.

### Possible Paths

1. **Bootstrap + audience-funded (BSR model):** Build audience first, sustain through community. Slow, fragile, ideologically clean.

2. **Find aligned funders:** African-led foundations, tech companies wanting African presence, diaspora investors, research institutions interested in indigenous knowledge.

3. **Editorial independence negotiation:** Some funders don't dictate content. Requires careful selection and willingness to walk away.

4. **Premium subsidizes public:** Revenue from collaboration tools, datasets, team features funds the free Citizen Scientist side.

*Decision needed: Which path is viable given current resources?*

---

## Content Strategy (To Be Defined)

- What topics beyond AI anchor early content?
- Content format: Long-form essays (BSR style)? Shorter pieces? Learning paths?
- Community mechanics: WhatsApp integration? On-platform comments? Both?

---

## Auth Implications (Summary)

For the public Citizen Scientist side:

| Activity | Auth Required? |
|----------|----------------|
| Read any article | No |
| Discuss in comments | Yes |
| Join community groups | Yes |
| Track reading progress | Yes |
| Star/save articles | Yes |

**Rationale:** Content is fully open (academic ethos, Nyakupfuya accessibility). Auth unlocks *community participation* and *personalization* - the features that create the BSR-like anticipation and discourse loop.

---

## Related Documents

- Dura technical migration docs (CLAUDE.md)
- baeIoT ecosystem overview
- Nyakupfuya Test definition
