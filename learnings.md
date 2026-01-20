# Nyakupfuya Learnings Log

> Running observations from Nyakupfuya's interactions. Approved learnings get consolidated into `nyakupfuya.skill.md`.

---

## How This Works

1. **Claude observes** patterns during curation/synthesis
2. **Claude logs** observation here with evidence
3. **Human reviews** periodically
4. **Approved items** → consolidated into skill.md
5. **Entry marked** as `[x] Consolidated` with version reference

---

## Pending Review

<!-- New observations go here -->

### 2026-01-20 | Invite-Only Auth Implementation

**Observation:** Astro pages using database queries during SSR need `export const prerender = false` to work correctly in hybrid mode.

**Evidence:** Signup page showed "Invite Required" despite valid token because it was pre-rendered at build time with mocked database.

**Proposed Action:** Add to CLAUDE.md under Astro conventions.

**Status:** [ ] Pending

---

## Approved → Consolidated

<!-- Approved learnings move here after being added to skill.md -->

*No consolidated learnings yet.*

---

## Rejected

<!-- Observations that were reviewed but not applicable -->

*No rejected observations yet.*
