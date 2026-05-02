---
name: d4-hard-case-{slug}
status: open
created: {ISO datetime}
updated: {ISO datetime}
slug: {slug}
owner: {github-handle}
opened: {YYYY-MM-DD}
deadline: {YYYY-MM-DD}  # opened + 14 days
decision: pending  # pending | option-a | option-b | option-c
---

# D4 Hard Case — {slug}

## Current TypeScript metadata

**File:** `src/shared/lib/experiments/data/{slug}.ts`

- **subtitle:** {ts.subtitle}
- **description:** {ts.description}
- **parameters[]:**
  - `{paramId1}` ({label}, {min}-{max} {unit})
  - ...
- **contentSections.whatIsIt** (first sentence): {first sentence of whatIsIt}

## Actual HTML simulation

**File:** `public/{ts.htmlPath}`
**Vercel preview:** {link to deployed preview}
**Screenshot:** {optional}

- **HTML title:** {<title>}
- **HTML controls:**
  - `{domId1}` ({kind}, {min}-{max} from `<input>` attrs, label "{label}")
  - ...
- **Preset buttons (if any):**
  - `{presetId1}` ({label})
  - ...
- **What it actually demonstrates:** {1-2 sentences describing the simulation's actual mechanism and pedagogy}

## The mismatch

{1-2 paragraphs explaining why this is a topic-level mismatch and not just a parameter alignment issue. Concretely: what concept does the metadata teach? what concept does the HTML demonstrate? why can't simple aliases bridge them?}

## Three options

### Option A — Keep HTML, rewrite metadata (default per SLA)
- **Estimated cost:** {hours} h
- **What changes:**
  - `parameters[]` rewritten to expose actual HTML controls
  - `presets[]` populated from HTML preset buttons
  - `htmlControlAliases` added for semantic↔DOM bridge
  - `contentSections.whatIsIt`, `parameterExplanations`, `misconceptions`, `teacherUseCases`, `faq` rewritten for the HTML's actual concept
  - subtitle/description updated
- **New learning concept:** {what the slug will teach after the rewrite}
- **Risk:** low (metadata only, contentSections tests catch regressions)

### Option B — Keep metadata, rebuild HTML simulation
- **Estimated cost:** {hours} h
- **What changes:**
  - HTML controls rewritten to match TS `parameters[]`
  - JS event handlers rewritten
  - Visual elements added/removed to support the metadata-described mechanism
- **Risk:** high (no test coverage on HTML; manual QA required)

### Option C — Split into two slugs
- **Estimated cost:** {hours} h
- **What changes:**
  - Original slug keeps current TS metadata; new HTML simulation built (= Option B subset)
  - New slug created with current HTML + matching TS metadata (= Option A subset)
  - Manifest, registry, html-map, gallery, SEO all updated
- **Risk:** medium (URL routing + gallery decisions)

## Recommended default

**Option A** unless the originally-metadata'd concept is uniquely valuable and not covered by another slug. Apply automatically if no PM response by deadline (per SLA).

## Decision

**Choice:** {option-a | option-b | option-c}
**Decided by:** {PM github-handle}
**Decided at:** {ISO datetime}
**Notes:** {optional rationale}

## Execution log

- {YYYY-MM-DD}: opened by {owner}
- {YYYY-MM-DD}: PM notified
- {YYYY-MM-DD}: decision recorded
- {YYYY-MM-DD}: option {X} executed; PR #{N} merged
- {YYYY-MM-DD}: packet renamed to `{slug}.resolved.md`
