---
name: d4-hard-cases-readme
status: complete
created: 2026-05-02T08:40:00Z
updated: 2026-05-02T08:40:00Z
---

# D4 Hard Cases — Decision Workflow

This directory holds per-slug decision packets for **🔴 hard cases**: experiments where the TypeScript metadata in `src/shared/lib/experiments/data/<slug>.ts` describes a fundamentally different educational concept than the HTML simulation in `public/experiments/**/<slug>.html`.

This is **not** the same as a parameter range or alias mismatch. Those are 🟢/🟡 fixable via the Phase C gold-standard workflow (see `docs/plans/2026-05-02-d4-ts-html-sync-plan.md` §9). Hard cases require a **product-level** decision because no amount of metadata editing will make the lesson coherent without either rewriting metadata or rebuilding the HTML.

## When does a slug land here?

Symptoms (any one is sufficient):

1. The TS subtitle/description names a teaching concept (e.g., "Punnett squares") that the HTML simulation does not actually demonstrate.
2. The TS `parameters[]` describe a model (e.g., `parent1` + `parent2` + `traitType` + `offspringCount` for Mendelian genetics) but the HTML controls implement a different model (e.g., Hardy-Weinberg sliders for `mutation rate`, `generations`, `allele frequency`).
3. The TS `contentSections.misconceptions` and `teacherUseCases` reference simulation behaviors that are mechanistically absent from the HTML.

A slug with merely missing controls or wrong ranges is **not** a hard case — it goes to Phase C1/C2/C3/C4/C5.

## The three options

For each hard case, the PM (or owner) chooses one of:

### Option A — Keep HTML, rewrite metadata (default)
- **Cost:** ~2-4 h per slug
- **Risk:** Low — metadata-only edits, no HTML/JS regression risk
- **Acceptance criteria:** TS subtitle/description/parameters/contentSections truthfully describe what the HTML simulation actually does
- **Side effect:** the slug's stated learning objective changes (e.g., ms-genetics becomes "Population genetics & Hardy-Weinberg" instead of "Punnett squares")
- **Recommended when:** the HTML simulation is pedagogically valuable as-is and there is another route (a different slug) for the originally-promised concept

### Option B — Keep metadata, rebuild HTML simulation
- **Cost:** ~6-12 h per slug (HTML+JS, requires manual QA)
- **Risk:** High — HTML files have no test coverage; new sim must be visually + interactively verified
- **Acceptance criteria:** HTML simulation implements every control listed in TS `parameters[]` + `presets[]`, with matching ranges and behavior
- **Recommended when:** the TS-described concept is the "right" lesson and the HTML is genuinely off-spec

### Option C — Split into two slugs
- **Cost:** ~6-10 h (new slug registry entry + manifest entry + duplicate HTML or new HTML + new contentSections)
- **Risk:** Medium — requires URL routing decisions, gallery/search index updates
- **Acceptance criteria:** Original slug stays for one concept; new slug ships the other
- **Recommended when:** both the metadata-described and HTML-implemented concepts are genuinely useful and shouldn't be merged

## SLA

- **Decision deadline:** 14 days from packet creation (filename ISO date `+ 14d`)
- **Default if no PM response:** Option A (rewrite metadata to match HTML), per Open Q2 resolution. The corresponding `KNOWN_DRIFT` entry's `expires` date matches the SLA deadline.
- **Auto-default trigger:** when the regression test in `tests/unit/content/params-vs-html.test.ts` flags an overdue entry, the next person to run CI sees the failure with `(expired YYYY-MM-DD, owner=<owner>)`. They open the packet, read the recommended default, apply Strategy A.

## How to open a packet

1. Copy `_template.md` to `<slug>.md` in this directory.
2. Fill in: current TS state, HTML state side-by-side, three options with cost estimate, recommended default, decision deadline (today + 14 days).
3. Add a Vercel preview link or screenshot of the actual HTML simulation.
4. In `tests/unit/content/d4-known-drift.json`, set the slug's `tier: "D"` and `expires: <deadline>` and `reason: "see docs/reports/d4-hard-cases/<slug>.md"`.
5. Notify the PM (Slack/email/Linear ticket — outside this repo's scope).
6. PM responds with their option choice + signs off the packet (mark `## Decision` section).
7. Owner executes the chosen option, removes the slug from `d4-known-drift.json` (re-run `pnpm tsx scripts/d4-generate-known-drift.ts`), and the packet is moved to `<slug>.resolved.md` for archive.

## Current packets

| Slug | Owner | Opened | Deadline | Decision |
|---|---|---|---|---|
| [ms-genetics](./ms-genetics.md) | claude | 2026-05-02 | 2026-05-16 | ⏳ awaiting PM |

## Index also tracks resolved packets

(none yet)
