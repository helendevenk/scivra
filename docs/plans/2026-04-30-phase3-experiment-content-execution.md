---
name: phase3-experiment-content-execution
status: backlog
created: 2026-04-30T06:01:01Z
updated: 2026-04-30T06:01:01Z
---

# Phase 3 — Experiment Content Backfill: Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Companion strategy doc:** `docs/plans/2026-04-30-phase3-experiment-content-strategy.md` — read it first for the why, the rubric, and the wave ordering rationale.

**Goal:** Backfill the 169 remaining experiment data files in `src/shared/lib/experiments/data/*.ts` with classroom-grade `contentSections` blocks (whatIsIt + parameterExplanations + misconceptions + teacherUseCases + faq), bringing all 179 experiments to the same content depth as the 10 P0 fills shipped in Phase 2.

**Architecture:** Pure data-layer change. App rendering is already wired (`src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx:244-250`). Each wave adds a TypeScript object literal `contentSections: { … }` to its experiment files; a Vitest validation test gates each wave on field presence + length floors + key alignment; a per-wave PR ships to main.

**Tech Stack:** TypeScript strict mode; Vitest unit tests; pnpm; gh CLI; codex exec (gpt-5.5) for review/research subagents; chrome-devtools MCP for production verification curl/playwright.

## Model Routing

Every task carries a `Model:` annotation. Defaults below; override only with reason.

| Job | Model | Why |
|---|---|---|
| Educational content writing (whatIsIt / FAQ / misconceptions / teacherUseCases / parameterExplanations) | **sonnet 4.6** (Claude main session) | Subject-matter accuracy + voice consistency; codex stalls on multi-file content reasoning per retrospective §4.4 |
| Vitest test design + assertion authoring | **sonnet 4.6** | TDD judgment, test boundary design |
| Pre-wave research (extract theory/formulas/params from existing data files into a writer briefing) | **gpt-5.5 + medium** via `codex exec --sandbox read-only` | Mechanical extraction within clear boundaries; medium reasoning avoids xhigh stall |
| Post-wave content review (8-dimension structured audit before commit) | **gpt-5.5 + xhigh** via `codex exec --sandbox read-only` | Structured review at fixed scope worked in Phase 2 retrospective §6 (162k tokens, 2 min, found 1 P1 + 4 P2 + 1 P3) |
| Bulk mechanical text replacement (only if Phase 3 needs any; not expected) | **gpt-5.5 + medium** via `codex exec --sandbox workspace-write` | Phase 1 NeonPhysics replacement pattern (59 files / 2 min success) |
| Production curl + playwright verification | **sonnet 4.6** + Bash + chrome-devtools MCP | Tooling orchestration, no content judgment needed |

Codex exec command template (memorize this — every codex step uses one of two variants):

```bash
# Variant A: research / mechanical (medium reasoning, fast, large context)
codex exec --sandbox read-only --skip-git-repo-check \
  -c 'model="gpt-5.5"' \
  -c 'model_reasoning_effort="medium"' \
  "<prompt>"

# Variant B: structured review (xhigh reasoning, slower, fixed-scope only)
codex exec --sandbox read-only --skip-git-repo-check \
  -c 'model="gpt-5.5"' \
  -c 'model_reasoning_effort="xhigh"' \
  "<full prompt with 8 audit dimensions>"
```

Never use Variant B on multi-file reasoning content tasks (will stall, see retrospective §5.1).

## Pre-flight checklist

Before starting Task 0:

- [ ] PR #4 (`chore: GSC verification + working tree cleanup`) is merged to main. If still open, merge it first — Task 0 branches off the new main.
- [ ] **Detect git remote** — this codebase uses `deploy` as the GitHub remote name. Fresh clones may use `origin`. Set once and reuse:
      ```bash
      REMOTE=$(git remote | grep -E '^(deploy|origin)$' | head -1)
      [ -z "$REMOTE" ] && { echo "No deploy/origin remote found"; exit 1; }
      git remote get-url "$REMOTE" | grep -q 'helendevenk/scivra' || { echo "Remote $REMOTE does not point to helendevenk/scivra"; exit 1; }
      echo "Using remote: $REMOTE"
      ```
- [ ] `git fetch $REMOTE && git checkout main && git reset --hard $REMOTE/main` — local main matches remote.
- [ ] `pnpm install` clean.
- [ ] `pnpm tsc --noEmit` passes on a clean tree.
- [ ] **Codex CLI precheck** — Task 1+ depend on `codex exec` with model `gpt-5.5`. Verify before sprint:
      ```bash
      codex --version | grep -E 'codex-cli (0\.12[5-9]|0\.1[3-9]|[1-9])' || { echo "codex CLI version too old"; exit 1; }
      codex models list 2>/dev/null | grep -q '^gpt-5\.5' || { echo "gpt-5.5 model alias not available"; exit 1; }
      # Smoke test: 10-second sandbox call
      timeout 30 codex exec -s read-only --skip-git-repo-check \
        -c 'model="gpt-5.5"' -c 'model_reasoning_effort="medium"' \
        "Print OK" < /dev/null | grep -q OK || { echo "codex smoke test failed"; exit 1; }
      ```
- [ ] **Sub-agent dispatch path** — confirm Claude Code's Agent tool can dispatch `general-purpose` subagents (or your platform's equivalent) for the parallel content drafting in Layer B (strategy §8.1). If your platform does not support multi-tool dispatch in a single message, fall back to sequential subagent calls (waves take 2-3× longer but still work).

## Cross-task patterns (apply to every wave)

These patterns are defined once and referenced from every wave Task. Do not duplicate the substance into each Task — just call out which pattern is in play.

### Pattern A — Codex research call (Layer A, every wave Step 2)

Stdout must be redirected at the shell level because `--sandbox read-only` cannot create files. The pattern:

```bash
codex exec --sandbox read-only --skip-git-repo-check \
  -c 'model="gpt-5.5"' \
  -c 'model_reasoning_effort="medium"' \
  "$RESEARCH_PROMPT" < /dev/null \
  | tee "_phase3-research/wave-${N}.md"
```

If `tee` is missing the file silently never gets written. Always include it. (This was the original Task 1 Step 2 bug surfaced by /autoplan — the pattern below replaces the original.)

### Pattern B — Compressed §6.2 rubric (every wave Step 5)

Inline this checklist into every parallel subagent prompt and into the writer's mental model. Self-contained tasks must not rely on cross-doc loading.

```
RUBRIC CHECKLIST (mirror projectile-motion.ts:120-191):
[whatIsIt]            100-150 words; concrete opener (not "In this experiment"); ends pointing at the simulation
[parameterExplanations] one entry per parameters[].id (validation enforces full coverage); 1-2 sentences each
[misconceptions]      3-5 wrong/correct pairs; "wrong" is real student-voice, not strawman; "correct" engages the wrong claim directly
[teacherUseCases]     3-5 strings ≥30 chars each; at least one references data collection (record/plot/measure); at least one references a misconception probe
[faq]                 4-6 Q/A pairs; questions in student-search voice ending in "?"; answers ≥100 chars; at least one cites standards.ap[0] or standards.ngss[0]
[total]               word count ≥800 across all five sections; target ~1100
[forbidden]           no "</script>", "<!--", "]]>", U+2028, U+2029 anywhere in FAQ strings; no NeonPhysics residue; no "In this experiment"/"Welcome to"/"This simulation" openings
```

### Pattern C — Layer B parallel subagent dispatch (every wave Step 5)

In a single multi-tool-call message, dispatch 2-5 sonnet 4.6 subagents (`general-purpose`). Each gets a slug batch + the §6.2 rubric inline + voice notes for the wave + projectile-motion canonical reference + Layer A research briefing. Subagents return contentSections blocks; main session merges into the data files.

Per-subagent prompt template (copy + customize per wave):

```
You are a senior science educator drafting contentSections blocks for Scivra's
educational experiment pages. You receive N slug briefings and produce N
TypeScript-formatted contentSections objects following the rubric exactly.

CONTEXT:
- Reference: src/shared/lib/experiments/data/projectile-motion.ts:120-191 (canonical)
- Type: src/shared/types/experiment.ts:107-119 (ExperimentContentSection)
- Render: src/shared/blocks/experiments/experiment-content-sections.tsx
- Rubric: <PASTE PATTERN B HERE VERBATIM>
- Voice notes (this wave): <PASTE wave-N voice notes from the Task>
- Research briefing: <PASTE _phase3-research/wave-N.md sections for this batch>

SLUGS (this batch): <list 5-10 slugs with their parameter ids>

OUTPUT FORMAT (one block per slug, in the order given):
=== <slug> ===
contentSections: {
  whatIsIt: "…",
  parameterExplanations: { … },
  misconceptions: [ … ],
  teacherUseCases: [ … ],
  faq: [ … ],
},
=== END <slug> ===

Do not edit any files. Do not add commentary outside the === blocks. Word
budget per block: ~1100 words.
```

Concurrency cap: 5 parallel per message. For Waves 5/6/9 (≤13 slugs), 2 subagents are enough.

### Pattern D — Codex review chunking (every wave Step 8)

Codex `xhigh` with multi-file reasoning > 10 files is the exact pattern that stalled in Phase 2 retrospective §5.1. Always chunk to 5-8 files per call. For a 33-slug wave, that means 5-7 separate codex calls (each scoped to a slug subset), then concatenate outputs.

Per-chunk codex command:

```bash
codex exec --sandbox read-only --skip-git-repo-check \
  -c 'model="gpt-5.5"' \
  -c 'model_reasoning_effort="xhigh"' \
  "$REVIEW_PROMPT" < /dev/null \
  | tee -a "_phase3-research/wave-${N}-review.md"
```

Wrap each chunk in `timeout 300` so a stall fails fast (5 min) rather than blocking 10. If 2 chunks in a row stall, fall back to medium reasoning.

### Pattern E — Gate B full-wave verification (every wave Step 11)

Replace the original "3 random samples" with a full curl loop over every wave slug. Mathematics: 3 samples on a 33-fill wave has ~91% chance of missing a single broken slug. 100% is just N HEAD requests + grep.

```bash
PREVIEW_URL="<vercel-preview-url-from-pr>"
WAVE_SLUGS="$(awk '/Wave '"$N"' (.*ap-physics-1)/{p=1;next} /^[A-Za-z]/{p=0} p && /^"/' tests/unit/content/phase3-manifest.ts | tr -d '",')"
for slug in $WAVE_SLUGS; do
  # Look up subject + standard from the experiment file
  data="src/shared/lib/experiments/data/${slug}.ts"
  subject=$(grep 'subject:' "$data" | head -1 | grep -oE '"[^"]+"' | tr -d '"')
  standard=$(grep 'primaryStandard:' "$data" | head -1 | grep -oE '"[^"]+"' | tr -d '"')
  url="${PREVIEW_URL}/labs/${subject}/${standard}/${slug}"
  out=$(curl -s "$url")
  faq=$(echo "$out" | grep -c '"FAQPage"')
  misc=$(echo "$out" | grep -c 'Common misconceptions')
  teach=$(echo "$out" | grep -c 'How teachers use this lab')
  params=$(echo "$out" | grep -c 'Parameters explained')
  if [ "$faq" -ge 1 ] && [ "$misc" -ge 1 ] && [ "$teach" -ge 1 ] && [ "$params" -ge 1 ]; then
    echo "PASS $slug"
  else
    echo "FAIL $slug faq=$faq misc=$misc teach=$teach params=$params"
  fi
done | tee "_phase3-research/wave-${N}-gate-b.log"
```

Any FAIL line blocks merge.

## Task 0: Setup — validation test infrastructure + research helper

**Model:** sonnet 4.6
**Estimated time:** 45 min
**Branch:** `feat/phase3-task0-validation-test`

**Files:**
- Create: `tests/unit/content/experiment-content-sections.test.ts`
- Create: `tests/unit/content/phase3-manifest.ts`
- Create: `_phase3-research/.gitkeep` (research scratch dir, gitignored at parent)
- Modify: `.gitignore` (add `/_phase3-research/`)

- [ ] **Step 1: Create branch**

```bash
git checkout main
git pull deploy main
git checkout -b feat/phase3-task0-validation-test
```

- [ ] **Step 2: Create the manifest file**

Create `tests/unit/content/phase3-manifest.ts` with the initial 10 P0 slugs already filled in Phase 2. Each subsequent wave appends to this file.

```typescript
/**
 * Phase 3 manifest — slugs that should pass the contentSections quality gate.
 * Append to PHASE3_FILLED_SLUGS as each wave fills its experiments.
 *
 * Update protocol: in the wave's branch, edit this file by appending the wave's
 * slugs in alphabetical order, then run the validation test.
 */

export const PHASE3_FILLED_SLUGS = new Set<string>([
  // Phase 2 P0 (already shipped, sanity-check anchor)
  "acid-base-ph",
  "cellular-respiration",
  "chemical-equilibrium",
  "dna-double-helix",
  "doppler-effect",
  "geometric-optics-lenses",
  "newtons-laws",
  "photosynthesis",
  "projectile-motion",
  "wave-interference",
  // Wave 1 (ap-physics-1) — added in Task 1
  // Wave 2 (ap-physics-2) — added in Task 2
  // Wave 3 (ap-biology) — added in Task 3
  // Wave 4 (ap-chemistry) — added in Task 4
  // Wave 5 (ap-physics-c) — added in Task 5
  // Wave 6 (ngss-hs) — added in Task 6
  // Wave 7 (ngss-ms) — added in Task 7
  // Wave 8 (elementary-k5) — added in Task 8
  // Wave 9 (general) — added in Task 9
]);
```

- [ ] **Step 3: Write the failing validation test (P0 hardened version)**

Create `tests/unit/content/experiment-content-sections.test.ts`. This version closes the gaps surfaced by /autoplan: correct registry import, full parameter coverage, total word count floor, FAQ JSON-LD injection guard, inverse-manifest assertion.

```typescript
import { describe, it, expect } from "vitest";
import { getAllExperiments } from "@/shared/lib/experiments/registry";
import { PHASE3_FILLED_SLUGS } from "./phase3-manifest";

const experiments = getAllExperiments();

const wordCount = (s: string) =>
  s.trim().split(/\s+/).filter(Boolean).length;

const FORBIDDEN_FAQ_PATTERNS: { name: string; re: RegExp }[] = [
  { name: "</script>", re: /<\/script/i },
  { name: "<!--", re: /<!--/ },
  { name: "]]>", re: /\]\]>/ },
  { name: "U+2028", re: /\u2028/ },
  { name: "U+2029", re: /\u2029/ },
];

describe("Phase 3 contentSections quality gate", () => {
  const filledExperiments = experiments.filter((e) =>
    PHASE3_FILLED_SLUGS.has(e.slug),
  );

  it("manifest matches actual filled experiments (forward)", () => {
    expect(filledExperiments.length).toBe(PHASE3_FILLED_SLUGS.size);
  });

  it("every experiment with contentSections is in manifest (inverse)", () => {
    const orphans = experiments
      .filter((e) => e.contentSections)
      .map((e) => e.slug)
      .filter((slug) => !PHASE3_FILLED_SLUGS.has(slug));
    expect(
      orphans,
      `Filled-but-unregistered slugs: ${orphans.join(", ") || "(none)"}`,
    ).toEqual([]);
  });

  describe.each(filledExperiments)("$slug", (exp) => {
    const cs = exp.contentSections;

    it("has contentSections defined", () => {
      expect(cs).toBeDefined();
    });

    it("whatIsIt has at least 100 words", () => {
      expect(cs?.whatIsIt).toBeTruthy();
      const wc = wordCount(cs!.whatIsIt!);
      expect(
        wc,
        `${exp.slug}.whatIsIt has ${wc} words (need >=100)`,
      ).toBeGreaterThanOrEqual(100);
    });

    it("parameterExplanations covers every parameter id", () => {
      const paramIds = exp.parameters.map((p) => p.id);
      const keys = Object.keys(cs?.parameterExplanations ?? {});
      const missing = paramIds.filter((id) => !keys.includes(id));
      const orphaned = keys.filter((k) => !paramIds.includes(k));
      expect(
        missing,
        `${exp.slug} missing parameterExplanations for: ${missing.join(", ") || "(none)"}`,
      ).toEqual([]);
      expect(
        orphaned,
        `${exp.slug} parameterExplanations has unmatched keys: ${orphaned.join(", ") || "(none)"}`,
      ).toEqual([]);
    });

    it("misconceptions has 3-5 non-empty entries", () => {
      expect(cs?.misconceptions).toBeDefined();
      const len = cs!.misconceptions!.length;
      expect(len, `${exp.slug} misconceptions count is ${len}`).toBeGreaterThanOrEqual(3);
      expect(len, `${exp.slug} misconceptions count is ${len}`).toBeLessThanOrEqual(5);
      for (const [i, m] of cs!.misconceptions!.entries()) {
        expect(m.wrong.trim().length, `${exp.slug} misconceptions[${i}].wrong empty`).toBeGreaterThan(0);
        expect(m.correct.trim().length, `${exp.slug} misconceptions[${i}].correct empty`).toBeGreaterThan(0);
      }
    });

    it("teacherUseCases has 3-5 entries each >=30 chars", () => {
      expect(cs?.teacherUseCases).toBeDefined();
      const len = cs!.teacherUseCases!.length;
      expect(len).toBeGreaterThanOrEqual(3);
      expect(len).toBeLessThanOrEqual(5);
      for (const [i, u] of cs!.teacherUseCases!.entries()) {
        expect(
          u.trim().length,
          `${exp.slug} teacherUseCases[${i}] has ${u.length} chars (need >=30)`,
        ).toBeGreaterThanOrEqual(30);
      }
    });

    it("faq has 4-6 Q/A pairs; questions end in ?, answers >=100 chars", () => {
      expect(cs?.faq).toBeDefined();
      const len = cs!.faq!.length;
      expect(len).toBeGreaterThanOrEqual(4);
      expect(len).toBeLessThanOrEqual(6);
      for (const [i, f] of cs!.faq!.entries()) {
        expect(
          f.question.trim().endsWith("?"),
          `${exp.slug} faq[${i}] question must end in ?`,
        ).toBe(true);
        expect(
          f.answer.trim().length,
          `${exp.slug} faq[${i}] answer has ${f.answer.length} chars (need >=100)`,
        ).toBeGreaterThanOrEqual(100);
      }
    });

    it("FAQ strings free of script-injection / JSON-LD breakers", () => {
      for (const [i, f] of (cs?.faq ?? []).entries()) {
        for (const { name, re } of FORBIDDEN_FAQ_PATTERNS) {
          expect(
            re.test(f.question),
            `${exp.slug} faq[${i}].question contains ${name}`,
          ).toBe(false);
          expect(
            re.test(f.answer),
            `${exp.slug} faq[${i}].answer contains ${name}`,
          ).toBe(false);
        }
      }
    });

    it("total word count >= 800 across all five sections", () => {
      const total =
        wordCount(cs?.whatIsIt ?? "") +
        Object.values(cs?.parameterExplanations ?? {}).reduce(
          (sum, t) => sum + wordCount(t),
          0,
        ) +
        (cs?.misconceptions ?? []).reduce(
          (sum, m) => sum + wordCount(m.wrong) + wordCount(m.correct),
          0,
        ) +
        (cs?.teacherUseCases ?? []).reduce((sum, u) => sum + wordCount(u), 0) +
        (cs?.faq ?? []).reduce(
          (sum, f) => sum + wordCount(f.question) + wordCount(f.answer),
          0,
        );
      expect(
        total,
        `${exp.slug} total contentSections word count is ${total} (need >=800)`,
      ).toBeGreaterThanOrEqual(800);
    });
  });
});
```

**P0 anchor verification note:** The 10 Phase 2 P0 fills were written before this gate existed. If any P0 fails one of these tightened assertions in Step 4, patch the offending P0 contentSections directly — do NOT loosen the gate. P0 fills carrying forward into Phase 3 must meet the same bar as new fills.

- [ ] **Step 4: Run the test to confirm baseline (10 P0 fills) pass**

```bash
pnpm test tests/unit/content/experiment-content-sections.test.ts
```

Expected: All 10 P0 experiments pass every assertion in the tightened gate (whatIsIt ≥100, full parameter coverage, FAQ free of script-injection patterns, total word count ≥800). If any fail, the P0 fill that pre-dates this gate is below bar — patch the offending P0 contentSections directly to meet the gate. Do NOT loosen the gate.

Most likely failure modes for P0 anchors:
- `parameterExplanations` missing a key for a `pro`-tier parameter that the original writer skipped — add the entry.
- `whatIsIt` written at 80-99 words — extend to 100-150 with one more example sentence.
- A FAQ answer mentioning HTML or shell snippets containing `</script>` — escape it.

Patch in place, re-run, confirm green before continuing.

- [ ] **Step 5: Add research scratch dir**

```bash
mkdir -p _phase3-research
touch _phase3-research/.gitkeep
echo "" >> .gitignore
echo "# Phase 3 writer scratch (research subagent outputs)" >> .gitignore
echo "/_phase3-research/" >> .gitignore
```

- [ ] **Step 6: Run typecheck**

```bash
pnpm tsc --noEmit
```

Expected: clean exit.

- [ ] **Step 7: Commit + push + open PR**

```bash
git add tests/unit/content/ .gitignore _phase3-research/.gitkeep
git commit -m "test(content): add Phase 3 contentSections validation gate

Adds tests/unit/content/experiment-content-sections.test.ts which asserts
field presence + length floors + parameterExplanations key alignment for
every slug in PHASE3_FILLED_SLUGS.

Initial manifest seeded with the 10 P0 slugs from Phase 2 — they all pass
the gate (sanity-check anchor for the 169-fill rollout).

Each Wave PR appends its slugs to phase3-manifest.ts and re-runs the test.
.gitignore excludes _phase3-research/ (writer scratch dir for codex
research subagent outputs)."

git push -u deploy feat/phase3-task0-validation-test

gh pr create --repo helendevenk/scivra --base main \
  --head feat/phase3-task0-validation-test \
  --title "test(content): add Phase 3 contentSections validation gate" \
  --body "Sets up the TDD harness for Phase 3 (169 experiment content fills). No content yet — just the test infrastructure that each wave will gate against. See docs/plans/2026-04-30-phase3-experiment-content-strategy.md."
```

- [ ] **Step 8: Wait for CI green; squash merge**

After merge, `git checkout main && git pull deploy main` to refresh local before Task 1.

## Task 1: Wave 1 — AP Physics 1 (29 experiments)

**Model:** sonnet 4.6 (writing) + gpt-5.5 medium (research subagent) + gpt-5.5 xhigh (review subagent)
**Estimated time:** 1.5–2 days
**Branch:** `feat/phase3-wave1-ap-physics-1`

**Slugs to fill (29):**

```
balancing-act, buoyancy, buoyancy-basics, circular-motion, density-lab,
electric-field-lines, energy-skate-park-basics, forces-motion-basics,
fourier-making-waves, friction-lab, gravity-force-lab-basics, gravity-orbits,
hookes-law, keplers-laws, kinematics-graphs, masses-springs, masses-springs-basics,
momentum-collisions, my-solar-system, normal-modes, pendulum-lab, pressure-lab,
projectile-data-lab, rotational-motion, simple-harmonic-motion, vector-addition,
wave-on-string, waves-intro, work-energy-theorem
```

**Files:**
- Modify (29): `src/shared/lib/experiments/data/<slug>.ts` for each slug above
- Modify: `tests/unit/content/phase3-manifest.ts` (append 29 slugs)

- [ ] **Step 1: Create branch**

```bash
git checkout main
git pull deploy main
git checkout -b feat/phase3-wave1-ap-physics-1
```

- [ ] **Step 2: Run research subagent (Pattern A — gpt-5.5 + medium)**

Following Pattern A (Cross-task patterns above): codex stdout must pipe to `tee` because read-only sandbox cannot create files.

```bash
codex exec --sandbox read-only --skip-git-repo-check \
  -c 'model="gpt-5.5"' \
  -c 'model_reasoning_effort="medium"' \
  "$(cat <<'EOF'
For each of these 29 experiment files in src/shared/lib/experiments/data/:
balancing-act.ts, buoyancy.ts, buoyancy-basics.ts, circular-motion.ts, density-lab.ts,
electric-field-lines.ts, energy-skate-park-basics.ts, forces-motion-basics.ts,
fourier-making-waves.ts, friction-lab.ts, gravity-force-lab-basics.ts, gravity-orbits.ts,
hookes-law.ts, keplers-laws.ts, kinematics-graphs.ts, masses-springs.ts,
masses-springs-basics.ts, momentum-collisions.ts, my-solar-system.ts, normal-modes.ts,
pendulum-lab.ts, pressure-lab.ts, projectile-data-lab.ts, rotational-motion.ts,
simple-harmonic-motion.ts, vector-addition.ts, wave-on-string.ts, waves-intro.ts,
work-energy-theorem.ts

Extract and PRINT TO STDOUT a markdown briefing per file with these fields:
  ## <slug>
  - title: <Experiment.title>
  - subtitle: <Experiment.subtitle>
  - theory: <Experiment.theory verbatim>
  - parameters: list of (id, label, unit, default, tier) tuples
  - formulas: list of (latex, description)
  - standards.ngss / standards.ap: arrays
  - challenges: list of question texts
  - 3 candidate misconceptions a 9th-12th grade student commonly holds about this topic (your judgment, but stay on safe educational consensus)
  - 1 candidate FAQ tying the topic to standards.ap[0] or standards.ngss[0]

Do not modify any source files. Print all output to stdout — the calling shell pipes it to the briefing file.
EOF
)" < /dev/null \
  | tee _phase3-research/wave-1.md
```

Expected runtime: 3–5 minutes. Output: `_phase3-research/wave-1.md` populated with 29 sections.

- [ ] **Step 3: Append Wave 1 slugs to the manifest**

Edit `tests/unit/content/phase3-manifest.ts`. Replace the `// Wave 1 (ap-physics-1) — added in Task 1` comment with:

```typescript
  // Wave 1 (ap-physics-1)
  "balancing-act",
  "buoyancy",
  "buoyancy-basics",
  "circular-motion",
  "density-lab",
  "electric-field-lines",
  "energy-skate-park-basics",
  "forces-motion-basics",
  "fourier-making-waves",
  "friction-lab",
  "gravity-force-lab-basics",
  "gravity-orbits",
  "hookes-law",
  "keplers-laws",
  "kinematics-graphs",
  "masses-springs",
  "masses-springs-basics",
  "momentum-collisions",
  "my-solar-system",
  "normal-modes",
  "pendulum-lab",
  "pressure-lab",
  "projectile-data-lab",
  "rotational-motion",
  "simple-harmonic-motion",
  "vector-addition",
  "wave-on-string",
  "waves-intro",
  "work-energy-theorem",
```

- [ ] **Step 4: Run validation test to confirm 29 NEW failures**

```bash
pnpm test tests/unit/content/experiment-content-sections.test.ts
```

Expected: 10 P0 still pass; 29 Wave 1 slugs FAIL with `expect(cs).toBeDefined()` errors. This is the red phase.

- [ ] **Step 5: Fill all 29 contentSections (Pattern C parallel dispatch — sonnet 4.6 subagents)**

Following Pattern C (Cross-task patterns above): dispatch 5 sonnet 4.6 subagents in a single multi-tool message. Split 29 slugs into 5 batches of ~6 each. Each subagent prompt MUST inline:
- Pattern B rubric checklist verbatim.
- The Wave 1 voice notes (mechanics-first openings; AP Physics 1 standards 3.A through 4.C citations preferred in FAQ).
- The relevant slice of `_phase3-research/wave-1.md` for that batch.
- The full `projectile-motion.ts:120-191` text.

Wait for all 5 subagents to return. Each returns 5-7 contentSections blocks in the `=== <slug> ===` format. Main session merges:

1. Open `src/shared/lib/experiments/data/<slug>.ts`.
2. Locate the closing `};` of the experiment object.
3. Insert the subagent's `contentSections: { … }` block immediately before the closing `};`.
4. Run `pnpm tsc --noEmit` after every 5-10 files to catch syntax errors early.

**Voice consistency review (main session, 15-20 min):** After all 29 are merged, scan for:
- Repeated openers across slugs ("Imagine…", "When you…") — vary them.
- `whatIsIt` paragraphs that read like the same template with names swapped.
- FAQ #1 questions that all use the identical phrasing pattern.

**Reference template (main-session canonical fallback):** `src/shared/lib/experiments/data/projectile-motion.ts:120-191`. The next code block is the single canonical Wave 1 sample (`circular-motion`); use it to calibrate subagent output before merging.

**Sample fill for `circular-motion` (canonical Wave 1 example — replicate this shape for the other 28):**

```typescript
contentSections: {
  whatIsIt:
    "Circular motion describes any object moving along a curved path at a constant distance from a center — a ball on a string, a satellite in orbit, a car on a banked turn. Even at constant speed, the object is constantly accelerating, because its velocity vector is constantly changing direction. That acceleration always points inward, toward the center of the circle, and we call it centripetal. The lab lets you change the radius and speed and watch the centripetal acceleration update in real time, which makes the relationship a = v² / r more concrete than any equation on a page.",
  parameterExplanations: {
    radius:
      "How far the object is from the center. Bigger radius at the same speed gives smaller centripetal acceleration — the path curves more gently. Doubling radius at constant speed halves the required force.",
    speed:
      "Tangential speed along the circle. Doubling speed quadruples the centripetal acceleration — that's why high-speed turns require so much grip on the road.",
    mass:
      "Inertial mass of the orbiting object. The required centripetal force scales linearly with mass at fixed v and r (F = mv²/r), but the acceleration the object feels does not depend on its own mass.",
  },
  misconceptions: [
    {
      wrong:
        "If something moves at constant speed in a circle, it is not accelerating because the speed is not changing.",
      correct:
        "Acceleration is the rate of change of velocity, and velocity is a vector. The direction is changing every instant, so the object is always accelerating — toward the center.",
    },
    {
      wrong:
        "Centrifugal force pushes the object outward when it's spinning.",
      correct:
        "There is no real outward force. What you feel as 'centrifugal' is your body's inertia trying to keep moving in a straight line while the seat or rope pulls you inward. Cut the rope and the ball flies off tangent to the circle, not radially outward.",
    },
    {
      wrong:
        "Doubling the speed of a turn doubles the force the road needs to apply.",
      correct:
        "Centripetal force scales with v², not v. Doubling speed quadruples the force, which is why high-speed banked turns are designed for a specific velocity.",
    },
    {
      wrong:
        "Heavier objects need more centripetal acceleration to stay in the same circle.",
      correct:
        "The acceleration depends only on v and r, not mass. Heavier objects need more centripetal force, but they accelerate at the same rate as lighter ones at the same v and r.",
    },
  ],
  teacherUseCases: [
    "Force-vs-radius scan: have students hold v constant and record the centripetal force at five radii from min to max. Plot F vs 1/r and confirm the linear relationship.",
    "Banking turn estimate: ask students to compute the bank angle a freeway needs for a 60 mph car at a 200 m radius. Compare the equation answer to a real freeway exit's bank.",
    "Misconception probe: pause the simulation mid-rotation and ask 'what direction would the ball go if the string broke right now?' Most students point inward; tangent is correct.",
    "Cross-link to gravity-orbits: after this lab, run gravity-orbits at the same v and r and ask why one needs a string and the other doesn't. Bridge to F = GMm/r² as the universal source of centripetal force.",
    "Quantitative homework: give students v and r and have them compute a, F, and the period T = 2πr/v before checking against the simulation readout.",
  ],
  faq: [
    {
      question: "Why does a ball on a string need a force to keep going in a circle?",
      answer:
        "Newton's first law says it would otherwise travel in a straight line. The string supplies a continuous inward (centripetal) force that bends the straight path into a curve. The required force is mv²/r, and it always points toward the center of the circle.",
    },
    {
      question: "Is centrifugal force real?",
      answer:
        "Not in an inertial frame. What you feel as outward push in a car turn is your body's inertia trying to continue in a straight line; the door or seatbelt then pushes you inward. Centrifugal force only exists as a fictitious force when you do calculations in the rotating frame.",
    },
    {
      question: "Why does the centripetal acceleration scale with v² and not v?",
      answer:
        "In time Δt the velocity vector rotates by an angle θ ≈ vΔt/r, and the change in velocity has magnitude v·θ ≈ v²Δt/r. Dividing by Δt gives a = v²/r. The two factors of v come from one for arc length and one for the angular rate.",
    },
    {
      question: "How does this connect to AP Physics 1 standards 3.A.1 and 3.B.1?",
      answer:
        "AP Physics 1 expects students to recognize centripetal acceleration as a special case of F = ma, identify the physical source of the centripetal force (tension, gravity, friction, normal force), and predict what happens if that source vanishes — the object continues tangent to the circle.",
    },
    {
      question: "What happens if I increase the radius while holding speed constant?",
      answer:
        "The centripetal acceleration drops linearly with 1/r. The path curves more gently, and the rope or road needs less inward force. Set radius to max and speed to default in the simulation to see the force readout drop.",
    },
  ],
},
```

Repeat the structure (not the prose — every fill is unique to its experiment) for the other 28 slugs. Stay within ~1100 words total per fill.

- [ ] **Step 6: Run validation test — expect green for Wave 1**

```bash
pnpm test tests/unit/content/experiment-content-sections.test.ts
```

Expected: all 39 slugs (10 P0 + 29 Wave 1) pass. If any fail, fix in place and re-run.

- [ ] **Step 7: Run typecheck**

```bash
pnpm tsc --noEmit
```

Expected: clean exit.

- [ ] **Step 8: Run review subagent (Pattern D — gpt-5.5 + xhigh, chunked 5-8 files per call)**

Following Pattern D (Cross-task patterns above): chunking is non-negotiable. Single 29-file xhigh call risks the retrospective §5.1 stall. Split 29 slugs into 5 chunks of ~6 files; run codex per chunk; concatenate output to `_phase3-research/wave-1-review.md`. Each chunk wrapped in `timeout 300`.

Per-chunk command (example for first chunk of 6):

```bash
CHUNK_FILES="balancing-act.ts buoyancy.ts buoyancy-basics.ts circular-motion.ts density-lab.ts electric-field-lines.ts"
timeout 300 codex exec --sandbox read-only --skip-git-repo-check \
  -c 'model="gpt-5.5"' \
  -c 'model_reasoning_effort="xhigh"' \
  "$(cat <<EOF
You are a content quality reviewer. Audit the contentSections blocks for these files only:
$CHUNK_FILES

Run \`git diff main..HEAD -- $(echo $CHUNK_FILES | sed 's# # src/shared/lib/experiments/data/#g; s#^#src/shared/lib/experiments/data/#')\` to see them.

For each experiment file, audit on these 8 dimensions:
  1. whatIsIt: 100-150 words, opens concretely (not 'In this experiment', 'Welcome to', 'This simulation'). PASS or FAIL.
  2. parameterExplanations: every key matches a parameters[].id (cross-reference the same file's parameters array). PASS or FAIL.
  3. parameterExplanations: every parameter has an entry, OR if not all parameters have entries, the missing one is justified (free-tier-only param without distinct physics meaning, etc.). PASS or QUESTION.
  4. misconceptions: 3-5 entries, each wrong/correct pair tackles a real student-voice mistake (NOT a strawman like 'students often forget to read the question'). PASS or FAIL.
  5. teacherUseCases: 3-5 entries, each ≥30 chars, at least one references data collection (verb 'record', 'plot', 'measure'), at least one references a misconception probe (verb 'ask', 'predict', 'pause'). PASS or FAIL.
  6. faq: 4-6 Q/A pairs; questions in student-search voice (not Socratic teacher voice); answers ≥100 chars. PASS or FAIL.
  7. faq: at least one entry cites standards.ap[0] or standards.ngss[0] from the same file. PASS or FAIL.
  8. NeonPhysics residue: search the new contentSections for 'NeonPhysics', 'neonphysics', 'AP Physics gamified'. PASS (none found) or FAIL.

Output: a markdown table per file with columns [dimension, verdict, fix-if-fail]. Then a summary: total experiments, total dimensions, total fails, P1/P2 categorization. Do not modify any files. The audit output will be saved to _phase3-research/wave-1-review.md by the calling shell.
EOF
)" | tee _phase3-research/wave-1-review.md
```

Expected runtime: 5–10 minutes (29 files × 8 dimensions × xhigh reasoning). Read the output. For any FAIL, patch the offending block and re-run Step 6 + Step 8 until clean.

- [ ] **Step 9: Commit**

```bash
git add src/shared/lib/experiments/data/ tests/unit/content/phase3-manifest.ts
git commit -m "feat(content): fill contentSections for Wave 1 — AP Physics 1 (29 labs)

Adds whatIsIt + parameterExplanations + misconceptions + teacherUseCases +
faq to all 29 ap-physics-1 experiment data files. Each fill targets ~1100
words across the five sections, modeled on projectile-motion.ts.

Validation:
  - tests/unit/content/experiment-content-sections.test.ts: 39/39 pass
    (10 P0 anchor + 29 Wave 1)
  - typecheck clean
  - Gate C content review via codex gpt-5.5 xhigh: 0 P1/P2 findings

Slugs covered: balancing-act, buoyancy, buoyancy-basics, circular-motion,
density-lab, electric-field-lines, energy-skate-park-basics, forces-motion-basics,
fourier-making-waves, friction-lab, gravity-force-lab-basics, gravity-orbits,
hookes-law, keplers-laws, kinematics-graphs, masses-springs, masses-springs-basics,
momentum-collisions, my-solar-system, normal-modes, pendulum-lab, pressure-lab,
projectile-data-lab, rotational-motion, simple-harmonic-motion, vector-addition,
wave-on-string, waves-intro, work-energy-theorem.

Phase 3 progress: 39/179 (22%). Next: Wave 2 ap-physics-2 (33)."
```

- [ ] **Step 10: Push + open PR (use `$REMOTE` from Pre-flight)**

```bash
git push -u "$REMOTE" feat/phase3-wave1-ap-physics-1

gh pr create --repo helendevenk/scivra --base main \
  --head feat/phase3-wave1-ap-physics-1 \
  --title "feat(content): Phase 3 Wave 1 — AP Physics 1 (29 labs)" \
  --body "Phase 3 Wave 1 of 9 — see docs/plans/2026-04-30-phase3-experiment-content-strategy.md.

## What's in this PR
- 29 contentSections fills (~31K new words of educational content)
- Manifest updated; validation test green for 39/179
- Gate C audit clean (0 P1/P2 from gpt-5.5 xhigh review, chunked)

## Verification
- Local: pnpm test tests/unit/content/experiment-content-sections.test.ts → 39/39 pass
- Local: pnpm tsc --noEmit → clean
- After merge: full Gate B curl over all 29 Wave 1 slugs on Vercel preview (Pattern E)

## Next
Wave 2 ap-physics-2 (33 labs)."
```

- [ ] **Step 11: Gate B full-wave production verification (Pattern E)**

Run the Pattern E curl loop (defined in Cross-task patterns) over ALL 29 Wave 1 slugs against the Vercel preview URL. 3-random sampling is not used — full-wave is automated, takes ~60 seconds, and catches the cases sampling misses.

Expected: every line prints `PASS <slug>`. Any `FAIL <slug> faq=… misc=… teach=… params=…` blocks merge — diagnose the failing slug first.

- [ ] **Step 12: Squash merge; refresh local main**

```bash
gh pr merge <PR-number> --squash --delete-branch
git checkout main
git pull "$REMOTE" main
```

## Task 2: Wave 2 — AP Physics 2 (33 experiments)

**Model:** sonnet 4.6 subagents x5 parallel (Pattern C drafting) + gpt-5.5 medium (Pattern A research) + gpt-5.5 xhigh chunked (Pattern D review)
**Estimated time:** ~2 hours wall-clock with parallel dispatch (was 2 days sequential)
**Branch:** `feat/phase3-wave2-ap-physics-2`

**Pattern references (every wave inherits these):** Step 2 = Pattern A. Step 5 = Pattern B rubric + Pattern C parallel dispatch (5 subagents × ~6-7 slugs each). Step 8 = Pattern D chunked review (5 chunks of ~6 files). Step 10 = `git push -u "$REMOTE"`. Step 11 = Pattern E full curl. Step 12 = `git pull "$REMOTE" main`.

**Slugs to fill (33):**

```
ac-circuits, atomic-interactions, balloons-static-electricity, bending-light,
bernoulli-fluid-dynamics, blackbody-spectrum, build-a-nucleus, circuit-ac-virtual-lab,
circuit-dc-virtual-lab, color-vision, coulombs-law, dc-circuits-basic, diffusion,
faradays-electromagnetic-lab, fluid-statics, gases-intro, generator,
geometric-optics-basics, heat-engines, ideal-gas-thermodynamics, john-travoltage,
magnets-and-electromagnets, models-hydrogen-atom, molecules-and-light,
nuclear-decay, ohms-law, photoelectric-effect, quantum-coin-toss,
quantum-measurement, resistance-wire, rutherford-scattering,
single-slit-diffraction, states-of-matter-basics
```

**Wave 2 voice notes:** This wave covers E&M, optics, modern, and thermo. Watch for the very common misconceptions: "current gets used up in a series circuit" (no — current is conserved), "voltage is the same as energy" (no — voltage is energy per charge), "photons have mass" (no — they have momentum p = h/λ but rest mass = 0). The FAQ for each modern-physics slug should connect to the AP Physics 2 modern-physics learning objectives (5.A through 6.G).

**Files:**
- Modify (33): `src/shared/lib/experiments/data/<slug>.ts` for each slug above
- Modify: `tests/unit/content/phase3-manifest.ts` (append 33 slugs)

- [ ] **Step 1: Branch from fresh main**

```bash
git checkout main
git pull deploy main
git checkout -b feat/phase3-wave2-ap-physics-2
```

- [ ] **Step 2: Run research subagent** — same codex Variant A as Task 1 Step 2, but with the 33 Wave 2 slugs. Output to `_phase3-research/wave-2.md`.

- [ ] **Step 3: Append Wave 2 slugs to manifest** — alphabetical order, replacing the `// Wave 2 (ap-physics-2) — added in Task 2` comment with the 33-slug block.

- [ ] **Step 4: Run validation test → 33 NEW failures.**

```bash
pnpm test tests/unit/content/experiment-content-sections.test.ts
```

- [ ] **Step 5: Fill all 33 contentSections (sonnet 4.6, main session).** Apply the rubric in strategy §6.2. Reference projectile-motion.ts and the Wave 1 sample (circular-motion) for shape.

  For Wave 2, pay special attention:
  - **`coulombs-law`, `electric-field-lines`, `john-travoltage`**: kids confuse charge (Coulombs) with current (Amps). FAQ #1 should distinguish them.
  - **`ohms-law`, `dc-circuits-basic`, `circuit-dc-virtual-lab`, `resistance-wire`**: misconception "current is used up by resistors" is universal — every fill must hit it.
  - **`photoelectric-effect`, `models-hydrogen-atom`, `blackbody-spectrum`**: tie FAQ to the wave-particle duality discussion in AP Physics 2 unit 6.
  - **`heat-engines`, `ideal-gas-thermodynamics`, `gases-intro`, `states-of-matter-basics`**: misconception "temperature is the same as heat" — every thermo fill addresses this.

- [ ] **Step 6: Run validation test → expect 72/179 green** (10 P0 + 29 Wave 1 + 33 Wave 2).

- [ ] **Step 7: Run typecheck.**

- [ ] **Step 8: Run review subagent** — same codex Variant B as Task 1 Step 8, scoped to the Wave 2 diff. Output to `_phase3-research/wave-2-review.md`. Patch any FAIL.

- [ ] **Step 9: Commit** with message `feat(content): fill contentSections for Wave 2 — AP Physics 2 (33 labs)` and same body structure as Task 1 Step 9. Phase 3 progress: 72/179 (40%). Next: Wave 3 ap-biology (17).

- [ ] **Step 10: Push + open PR.** Same gh template, swap Wave 1 → Wave 2.

- [ ] **Step 11: Gate B production sampling.** 3 random Wave 2 slugs across the URL pattern `/labs/physics/ap-physics-2/<slug>`. Same 4× YES check.

- [ ] **Step 12: Squash merge; refresh local main.**

## Task 3: Wave 3 — AP Biology (17 experiments)

**Model:** sonnet 4.6 (writing) + gpt-5.5 medium (research) + gpt-5.5 xhigh (review)
**Estimated time:** 1 day
**Branch:** `feat/phase3-wave3-ap-biology`

**Slugs to fill (17):**

```
cell-structure-3d, cellular-respiration-detail, dna-replication-detail,
ecological-succession, enzyme-kinetics, evidence-of-evolution, hardy-weinberg,
immune-system, meiosis, membrane-transport, mitosis, natural-selection,
neuron-action-potential, photosynthesis-light-reactions, population-dynamics,
protein-synthesis, protein-synthesis-3d
```

**Wave 3 voice notes:** AP Bio language is dense — write whatIsIt in plain English first, then layer in vocabulary. Misconceptions in this wave skew toward Lamarckism ("giraffes wanted longer necks"), purpose-driven evolution ("species evolve toward complexity"), and confusing transcription with translation. Every FAQ should reference one of the four AP Bio Big Ideas (Evolution / Energetics / Information Storage / Systems Interactions).

URL pattern: `/labs/biology/ap-biology/<slug>`.

**Files:**
- Modify (17): `src/shared/lib/experiments/data/<slug>.ts`
- Modify: `tests/unit/content/phase3-manifest.ts` (append 17 slugs)

- [ ] **Step 1:** Branch from fresh main.
- [ ] **Step 2:** Research subagent (codex Variant A) → `_phase3-research/wave-3.md`.
- [ ] **Step 3:** Append 17 slugs to manifest.
- [ ] **Step 4:** Run validation test → 17 NEW failures.
- [ ] **Step 5:** Fill all 17 contentSections (sonnet 4.6). Apply biology-specific voice notes above.

  Special calls:
  - **`mitosis`, `meiosis`**: must distinguish them in misconceptions ("mitosis and meiosis both halve the chromosome count" — only meiosis does). Pair these two fills back-to-back.
  - **`natural-selection`, `evidence-of-evolution`, `hardy-weinberg`**: address "evolution has a goal" misconception in all three.
  - **`photosynthesis-light-reactions`**: differentiate from the existing `photosynthesis` P0 fill — this one zooms into PSII / electron transport, while `photosynthesis` covers the whole process.
  - **`protein-synthesis`, `protein-synthesis-3d`**: same topic, different angle. Vary FAQ phrasings so the two pages don't read as duplicates.

- [ ] **Step 6:** Run validation test → 89/179 green.
- [ ] **Step 7:** Typecheck.
- [ ] **Step 8:** Review subagent (codex Variant B) → `_phase3-research/wave-3-review.md`. Patch any FAIL.
- [ ] **Step 9:** Commit `feat(content): fill contentSections for Wave 3 — AP Biology (17 labs)`. Phase 3 progress: 89/179 (50%).
- [ ] **Step 10:** Push + PR.
- [ ] **Step 11:** Gate B sampling on `/labs/biology/ap-biology/<slug>`.
- [ ] **Step 12:** Squash merge; refresh main.

## Task 4: Wave 4 — AP Chemistry (15 experiments)

**Model:** sonnet 4.6 (writing) + gpt-5.5 medium (research) + gpt-5.5 xhigh (review)
**Estimated time:** 1 day
**Branch:** `feat/phase3-wave4-ap-chemistry`

**Slugs to fill (15):**

```
atomic-structure, balancing-chemical-equations, beers-law-lab, build-a-molecule,
calorimetry, electrochemistry, electron-configuration, gas-properties,
lewis-structures, molecular-bonding, molecular-polarity, reaction-kinetics,
solutions-dilutions, stoichiometry, thermochemistry
```

**Wave 4 voice notes:** AP Chem misconceptions skew toward stoichiometry confusion ("more reactants always means more product" — limiting reagent matters), bonding misconceptions ("ionic bonds are stronger than covalent bonds" — depends on lattice energy and bond enthalpy comparison), and thermo confusion ("exothermic means hot to the touch" — depends on heat capacity + ambient temperature). FAQ should connect to AP Chemistry units 1–9 learning objectives.

URL pattern: `/labs/chemistry/ap-chemistry/<slug>`.

**Files:**
- Modify (15): `src/shared/lib/experiments/data/<slug>.ts`
- Modify: `tests/unit/content/phase3-manifest.ts` (append 15 slugs)

- [ ] **Step 1:** Branch from fresh main.
- [ ] **Step 2:** Research subagent → `_phase3-research/wave-4.md`.
- [ ] **Step 3:** Append 15 slugs to manifest.
- [ ] **Step 4:** Run validation test → 15 NEW failures.
- [ ] **Step 5:** Fill all 15 contentSections (sonnet 4.6).

  Special calls:
  - **`balancing-chemical-equations`**: paired with the existing `chemical-equilibrium` P0 fill — distinguish balancing (stoichiometry) from equilibrium (Le Chatelier).
  - **`molecular-bonding`, `lewis-structures`, `molecular-polarity`**: write these three together; the fills must cross-reference each other in `teacherUseCases` and FAQ for a smooth learning sequence.
  - **`thermochemistry`, `calorimetry`**: differentiate by scale — thermochemistry is the conceptual frame, calorimetry is the measurement.

- [ ] **Step 6:** Run validation test → 104/179 green.
- [ ] **Step 7:** Typecheck.
- [ ] **Step 8:** Review subagent → `_phase3-research/wave-4-review.md`. Patch FAILs.
- [ ] **Step 9:** Commit `feat(content): fill contentSections for Wave 4 — AP Chemistry (15 labs)`. Phase 3 progress: 104/179 (58%).
- [ ] **Step 10:** Push + PR.
- [ ] **Step 11:** Gate B sampling on `/labs/chemistry/ap-chemistry/<slug>`.
- [ ] **Step 12:** Squash merge; refresh main.

## Task 5: Wave 5 — AP Physics C (10 experiments)

**Model:** sonnet 4.6 (writing) + gpt-5.5 medium (research) + gpt-5.5 xhigh (review)
**Estimated time:** 0.5 day
**Branch:** `feat/phase3-wave5-ap-physics-c`

**Slugs to fill (10):**

```
amperes-law, angular-momentum-3d, capacitors-rc-circuits, electric-potential-voltage,
electromagnetic-induction, gauss-law, gravitational-fields, lorentz-force, rlc-circuit,
rotational-kinematics-advanced
```

**Wave 5 voice notes:** AP Physics C is calculus-based, but the audience landing on these pages may include AP Physics 1 students looking ahead. Lead each `whatIsIt` in algebra-friendly language and only introduce calculus in the last sentence ("…and the line integral form ∮ E · dl appears in AP Physics C"). Misconceptions skew toward dimensional analysis errors ("∮ B · dl gives a vector" — no, it's a scalar) and field/potential confusion ("E = 0 means V = 0" — wrong; V can be constant non-zero where E vanishes).

URL pattern: `/labs/physics/ap-physics-c/<slug>`.

**Files:**
- Modify (10): `src/shared/lib/experiments/data/<slug>.ts`
- Modify: `tests/unit/content/phase3-manifest.ts` (append 10 slugs)

- [ ] **Step 1:** Branch from fresh main.
- [ ] **Step 2:** Research subagent → `_phase3-research/wave-5.md`.
- [ ] **Step 3:** Append 10 slugs to manifest.
- [ ] **Step 4:** Validation test → 10 NEW failures.
- [ ] **Step 5:** Fill all 10 contentSections (sonnet 4.6). Apply calculus-friendly voice notes.
- [ ] **Step 6:** Validation test → 114/179 green.
- [ ] **Step 7:** Typecheck.
- [ ] **Step 8:** Review subagent → `_phase3-research/wave-5-review.md`. Patch FAILs.
- [ ] **Step 9:** Commit `feat(content): fill contentSections for Wave 5 — AP Physics C (10 labs)`. Phase 3 progress: 114/179 (64%).
- [ ] **Step 10:** Push + PR.
- [ ] **Step 11:** Gate B sampling on `/labs/physics/ap-physics-c/<slug>`.
- [ ] **Step 12:** Squash merge; refresh main.

## Task 6: Wave 6 — NGSS HS (13 experiments)

**Model:** sonnet 4.6 (writing) + gpt-5.5 medium (research) + gpt-5.5 xhigh (review)
**Estimated time:** 0.5 day
**Branch:** `feat/phase3-wave6-ngss-hs`

**Slugs to fill (13):**

```
atmosphere-layers, climate-change-modeling, em-spectrum, glaciers-ice-ages,
greenhouse-effect, plate-tectonics-advanced, radiometric-dating, rock-cycle,
roller-coaster, seismic-waves, solar-system-scale, star-life-cycle,
tides-lunar-gravity
```

**Wave 6 voice notes:** NGSS HS is mostly Earth & Space science with one mechanics lab (`roller-coaster`) and one physics-adjacent (`em-spectrum`). Misconceptions in earth science skew toward seasons-due-to-distance ("it's summer because Earth is closer to the sun" — no, it's axial tilt), greenhouse-effect-bad-itself ("greenhouse effect is bad" — natural greenhouse keeps Earth at +33°C), and continental drift speed ("plates are moving fast" — actually 2–10 cm/year). Every FAQ ties to a HS-PS or HS-ESS standard from `experiment.standards.ngss[]`.

URL pattern: depends on `subject` — `earth-science` slugs use `/labs/earth-science/ngss-hs/<slug>`; `roller-coaster` (physics) uses `/labs/physics/ngss-hs/<slug>`; `em-spectrum` (physics) uses `/labs/physics/ngss-hs/<slug>`. Confirm via `subject` field per file.

**Files:**
- Modify (13): `src/shared/lib/experiments/data/<slug>.ts`
- Modify: `tests/unit/content/phase3-manifest.ts` (append 13 slugs)

- [ ] **Step 1:** Branch from fresh main.
- [ ] **Step 2:** Research subagent → `_phase3-research/wave-6.md`.
- [ ] **Step 3:** Append 13 slugs to manifest.
- [ ] **Step 4:** Validation test → 13 NEW failures.
- [ ] **Step 5:** Fill all 13 contentSections (sonnet 4.6). Apply earth-science voice notes; double-check `subject` per file before writing the URL examples in any FAQ.
- [ ] **Step 6:** Validation test → 127/179 green.
- [ ] **Step 7:** Typecheck.
- [ ] **Step 8:** Review subagent → `_phase3-research/wave-6-review.md`. Patch FAILs.
- [ ] **Step 9:** Commit `feat(content): fill contentSections for Wave 6 — NGSS HS (13 labs)`. Phase 3 progress: 127/179 (71%).
- [ ] **Step 10:** Push + PR.
- [ ] **Step 11:** Gate B sampling: pick one earth-science slug and one physics slug to verify both URL patterns render.
- [ ] **Step 12:** Squash merge; refresh main.

## Task 7: Wave 7 — NGSS MS (26 experiments)

**Model:** sonnet 4.6 (writing) + gpt-5.5 medium (research) + gpt-5.5 xhigh (review)
**Estimated time:** 1.5 days
**Branch:** `feat/phase3-wave7-ngss-ms`

**Slugs to fill (26):**

```
mineral-identification, moon-geology, ms-acid-base-reactions, ms-atoms-molecules,
ms-cell-division-comparison, ms-chemical-bonding, ms-chemical-reactions,
ms-chemical-stoichiometry, ms-earthquake-epicenter, ms-ecosystems,
ms-electric-circuits-advanced, ms-energy-conservation, ms-food-web-dynamics,
ms-force-motion-graphs, ms-genetics, ms-genetics-punnett, ms-moon-phases-detailed,
ms-newtons-laws, ms-photosynthesis-respiration, ms-plate-tectonics,
ms-wave-interactions-advanced, ms-weather-systems, ocean-currents,
soil-formation, volcano-eruption-types, water-cycle-detail
```

**Wave 7 voice notes:** Middle-school audience — drop the AP-jargon-first openings entirely. `whatIsIt` should open with a concrete observation a 12-year-old has seen ("If you've watched a yo-yo come back up after you let it go, you've seen energy conversion."). FAQ phrasing should match what a middle-schooler types into Google ("how do volcanoes work?" not "what is the mechanism of effusive vs explosive volcanism?"). Misconceptions are the textbook MS-PS/MS-LS/MS-ESS list — pull from NGSS Appendix F.

URL pattern: subject-dependent per file. Mostly `/labs/<subject>/ngss-ms/<slug>` where subject ∈ {physics, chemistry, biology, earth-science}.

**Files:**
- Modify (26): `src/shared/lib/experiments/data/<slug>.ts`
- Modify: `tests/unit/content/phase3-manifest.ts` (append 26 slugs)

- [ ] **Step 1:** Branch from fresh main.
- [ ] **Step 2:** Research subagent → `_phase3-research/wave-7.md`.
- [ ] **Step 3:** Append 26 slugs to manifest.
- [ ] **Step 4:** Validation test → 26 NEW failures.
- [ ] **Step 5:** Fill all 26 contentSections (sonnet 4.6). Drop the AP-formal voice; lean on concrete observations. Cross-reference Wave 1's `forces-motion-basics` and Wave 7's `ms-newtons-laws` so the two age-band variants don't duplicate prose verbatim.
- [ ] **Step 6:** Validation test → 153/179 green.
- [ ] **Step 7:** Typecheck.
- [ ] **Step 8:** Review subagent → `_phase3-research/wave-7-review.md`. Patch FAILs. Extra dimension for this wave: reading level — flag any FAQ answer that uses 4+ syllable words without definition.
- [ ] **Step 9:** Commit `feat(content): fill contentSections for Wave 7 — NGSS MS (26 labs)`. Phase 3 progress: 153/179 (85%).
- [ ] **Step 10:** Push + PR.
- [ ] **Step 11:** Gate B sampling across at least 3 subject paths.
- [ ] **Step 12:** Squash merge; refresh main.

## Task 8: Wave 8 — Elementary K-5 (23 experiments)

**Model:** sonnet 4.6 (writing) + gpt-5.5 medium (research) + gpt-5.5 xhigh (review)
**Estimated time:** 1.5 days
**Branch:** `feat/phase3-wave8-elementary-k5`

**Slugs to fill (23):**

```
k5-animal-adaptations, k5-chemical-changes, k5-day-night-seasons, k5-energy-conversion,
k5-food-chain, k5-force-motion, k5-habitats, k5-landforms-erosion, k5-light-propagation,
k5-magnetism, k5-mixtures-solutions, k5-moon-phases, k5-plant-life-cycle,
k5-plant-needs, k5-simple-machines, k5-solar-energy, k5-sound-vibration,
k5-sound-waves, k5-stars-space, k5-states-of-matter, k5-water-cycle,
k5-weather-measurement, k5-weather-patterns
```

**Wave 8 voice notes:** Audience is K-5 students AND K-5 teachers planning lessons. The voice forks: `whatIsIt` reads at a 3rd-grade level ("Magnets pull on some metals but not all metals."); `teacherUseCases` reads at adult level (specific lesson plans for grades 1–5). `misconceptions` are well-documented in K-5 science ed: "the sun goes around the earth" / "air is empty" / "a magnet attracts everything metal" (not aluminum). FAQ phrasing matches a curious child's question to a parent.

URL pattern: `/labs/<subject>/elementary-k5/<slug>`. Subject varies — verify per file.

**Files:**
- Modify (23): `src/shared/lib/experiments/data/<slug>.ts`
- Modify: `tests/unit/content/phase3-manifest.ts` (append 23 slugs)

- [ ] **Step 1:** Branch from fresh main.
- [ ] **Step 2:** Research subagent → `_phase3-research/wave-8.md`.
- [ ] **Step 3:** Append 23 slugs to manifest.
- [ ] **Step 4:** Validation test → 23 NEW failures.
- [ ] **Step 5:** Fill all 23 contentSections (sonnet 4.6). Use the dual-voice approach.
- [ ] **Step 6:** Validation test → 176/179 green.
- [ ] **Step 7:** Typecheck.
- [ ] **Step 8:** Review subagent → `_phase3-research/wave-8-review.md`. Extra dimension: ensure `whatIsIt` Flesch-Kincaid grade level is ≤ 5 (the codex audit can estimate this — instruct the prompt to flag any whatIsIt with vocabulary clearly above 5th grade). Patch FAILs.
- [ ] **Step 9:** Commit `feat(content): fill contentSections for Wave 8 — Elementary K-5 (23 labs)`. Phase 3 progress: 176/179 (98%).
- [ ] **Step 10:** Push + PR.
- [ ] **Step 11:** Gate B sampling.
- [ ] **Step 12:** Squash merge; refresh main.

## Task 9: Wave 9 — Math + General (3 experiments)

**Model:** sonnet 4.6 (writing) + gpt-5.5 xhigh (review; skip research subagent — only 3 files)
**Estimated time:** 0.25 day
**Branch:** `feat/phase3-wave9-math-general`

**Slugs to fill (3):**

```
calculus-grapher, curve-fitting, plinko-probability
```

**Wave 9 voice notes:** These are math-tools, not physics. `calculus-grapher` is a function visualizer; misconception lean: "the derivative is the value of the function at a point" (no — derivative is the rate of change). `curve-fitting` is regression; misconception: "more parameters always fit better" (overfitting risk). `plinko-probability` is binomial distribution by Galton board; misconception: "the most likely path determines the most likely outcome" (no — the binomial distribution sums all paths). FAQ should reference AP Calculus / AP Statistics learning objectives (these slugs have `primaryStandard: 'general'` so use `standards.ap[]` directly).

URL pattern: `/labs/math/general/<slug>`.

**Files:**
- Modify (3): `src/shared/lib/experiments/data/<slug>.ts`
- Modify: `tests/unit/content/phase3-manifest.ts` (append 3 slugs)

- [ ] **Step 1:** Branch from fresh main.
- [ ] **Step 2:** Skip research subagent (only 3 files; read them directly).
- [ ] **Step 3:** Append 3 slugs to manifest.
- [ ] **Step 4:** Validation test → 3 NEW failures.
- [ ] **Step 5:** Fill all 3 contentSections (sonnet 4.6).
- [ ] **Step 6:** Validation test → 179/179 green.
- [ ] **Step 7:** Typecheck.
- [ ] **Step 8:** Review subagent → `_phase3-research/wave-9-review.md`. Patch FAILs.
- [ ] **Step 9:** Commit `feat(content): fill contentSections for Wave 9 — Math + General (3 labs) — Phase 3 complete 179/179`.
- [ ] **Step 10:** Push + PR.
- [ ] **Step 11:** Gate B sampling.
- [ ] **Step 12:** Squash merge; refresh main.

## Task 10: Final verification + KPI baseline + completion gate

**Model:** sonnet 4.6 (orchestration + KPI doc) + chrome-devtools MCP (production sampling)
**Estimated time:** 2 hours
**Branch:** `chore/phase3-completion-gate`

**Files:**
- Create: `docs/reports/<DATE>-phase3-baseline.md` (KPI day-zero snapshot)
- Create: `docs/reports/<DATE>-phase3-completion-verification.md` (final gate evidence)

- [ ] **Step 1: Branch + run full registry validation**

Define `DATE` once at the start of Task 10 — every report path below uses `$DATE`, never the literal string `<DATE>`.

```bash
DATE=$(date -u +%F)
echo "Phase 3 completion gate running on $DATE"

git checkout main
git pull "$REMOTE" main
git checkout -b chore/phase3-completion-gate

# Full registry should pass the validation test.
pnpm test tests/unit/content/experiment-content-sections.test.ts
```

Expected: 179/179 pass.

- [ ] **Step 2: Word count audit script**

Run a one-shot Node script to confirm avg word count ≥ 1000:

```bash
node -e "
const fs = require('fs');
const path = require('path');
const dir = 'src/shared/lib/experiments/data';
let total = 0, count = 0, perFile = [];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.ts'))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = src.match(/contentSections:\s*{([\s\S]*?)},\s*};/);
  if (!m) continue;
  const block = m[1];
  const text = block.replace(/[\"',{}\[\]:;]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  total += words;
  count++;
  perFile.push({ f, words });
}
const avg = total / count;
console.log('Total fills:', count);
console.log('Avg word count per fill:', avg.toFixed(0));
console.log('Min/Max:',
  Math.min(...perFile.map(x => x.words)),
  '/',
  Math.max(...perFile.map(x => x.words))
);
console.log('Below 800 words:', perFile.filter(x => x.words < 800).map(x => x.f).join('\n  ') || 'none');
"
```

Expected: Total fills = 179. Avg ≥ 1000. Below-800 list = empty. If anything fails, patch the offending file directly and re-commit before proceeding.

- [ ] **Step 3: Production sampling via chrome-devtools MCP**

Sample 30 random experiments across all 9 standards (~3 per standard). For each, fetch the experiment page and assert FAQPage + Common misconceptions + How teachers use this lab + Parameters explained sections render. Use the same fetch script pattern as Phase 2 retrospective §8.

```javascript
// Pseudocode for the chrome-devtools MCP evaluate_script call.
async function audit(samples) {
  const results = [];
  for (const { subject, standard, slug } of samples) {
    const url = `https://scivra.com/labs/${subject}/${standard}/${slug}`;
    const html = await (await fetch(url)).text();
    results.push({
      slug,
      faq: html.includes('"FAQPage"'),
      misc: html.includes('Common misconceptions'),
      teach: html.includes('How teachers use this lab'),
      params: html.includes('Parameters explained'),
    });
  }
  return results;
}
```

Expected: 30/30 with all four flags true.

- [ ] **Step 4: KPI baseline document**

Create `docs/reports/<DATE>-phase3-baseline.md` with:

- 2026-04-30 baseline snapshot from retrospective §3.3 (avg word count ~280 on 169, FAQPage 0/169).
- Phase 3 completion snapshot: avg word count from Step 2, FAQPage 179/179, sample audit results from Step 3.
- 30/60/90 day GSC KPI targets (transcribed from strategy doc §11) with date stamps for next checks.

```markdown
---
name: phase3-baseline
status: complete
created: <ISO_TIMESTAMP>
updated: <ISO_TIMESTAMP>
---

# Phase 3 KPI Baseline & Completion Snapshot

## Day-zero (Phase 1+2 ship: 2026-04-30)
- Avg word count, 10 P0 fills: ~1130
- Avg word count, 169 unfilled: ~280
- FAQPage schema: 10/169 (5.9%) on filled, 0/169 (0%) on unfilled
- GSC clicks: <CAPTURE FROM GSC ON DAY OF COMPLETION>

## Phase 3 completion (<DATE>)
- 179/179 contentSections filled
- Avg word count (script in Task 10 Step 2): <FILL FROM RUN>
- 30-experiment production audit (Task 10 Step 3): 30/30 four-flag pass
- GSC indexed experiment URLs: <CAPTURE>

## +30 day target (<DATE+30>)
- GSC clicks for /labs/* paths: ≥ 3× baseline
- GSC indexed: ≥ 175
- Rich-result-eligible FAQ pages: ≥ 150

## +60 day target (<DATE+60>)
- (transcribe strategy §11 +60 line)

## +90 day target (<DATE+90>)
- Pages per organic session on /labs/*: ≥ 1.8
- Avg position for AP/NGSS standard-code keywords: top 30
```

- [ ] **Step 5: Completion verification document**

Create `docs/reports/<DATE>-phase3-completion-verification.md` capturing:

- All 9 wave PRs (numbers + merge commits)
- Validation test green: paste output of `pnpm test tests/unit/content/experiment-content-sections.test.ts`
- Word count audit: paste output from Step 2
- Production sample audit: paste 30-row table from Step 3
- Open follow-ups (e.g., "/learn/* still on WebPage schema; revisit when content lands")

- [ ] **Step 6: Commit + PR + merge**

```bash
git add docs/reports/
git commit -m "docs(reports): Phase 3 completion baseline + verification

Final verification gate for the 169-experiment content backfill (Phase 3).
- 179/179 contentSections filled and pass the validation test
- Avg word count: <PASTE>
- Production audit: 30/30 four-section + FAQPage schema render
- KPI baseline locked for 30/60/90 day re-measurement

Closes Phase 3."

git push -u deploy chore/phase3-completion-gate
gh pr create --repo helendevenk/scivra --base main \
  --head chore/phase3-completion-gate \
  --title "docs: Phase 3 completion gate (179/179 verified)" \
  --body "Final verification + KPI baseline. See docs/reports/<DATE>-phase3-completion-verification.md."

gh pr merge <PR-number> --squash --delete-branch
```

- [ ] **Step 7: Phase 3 retrospective**

Out of plan but recommended: schedule a Phase 3 retrospective (`docs/reports/<DATE>-phase3-retrospective.md`) the same day completion ships. Capture:
- Per-wave time-to-write
- Common misconception patterns that surfaced (could feed a curriculum doc)
- Where the validation test was insufficient (issues that slipped past Gate A but were caught at Gate C)
- Codex review effectiveness per wave (P1/P2/P3 finding rate)

This becomes the input to a possible Phase 4 (schema enrichment / `/learn/*` content / new experiments).

## Cross-task references

- **Strategy doc:** `docs/plans/2026-04-30-phase3-experiment-content-strategy.md`
- **Phase 1+2 retrospective:** `docs/reports/2026-04-30-seo-remediation-retrospective.md`
- **Canonical fill template:** `src/shared/lib/experiments/data/projectile-motion.ts:120-191`
- **Type contract:** `src/shared/types/experiment.ts:107-119`
- **Render component:** `src/shared/blocks/experiments/experiment-content-sections.tsx`
- **FAQ component + schema:** `src/shared/blocks/experiments/experiment-faq.tsx`

## Total scope summary

Estimates revised for the LLM-leveraged sprint (D6 / strategy §10): wall-clock per wave is dominated by parallel sonnet 4.6 subagent compute + chunked codex review + Vercel preview turnaround, NOT by sequential single-session writing.

| Task | Wave | Standard | N | Cum. progress | Wall-clock | Subagents | Branch |
|---|---|---|---:|---:|---:|---:|---|
| 0 | — | Setup | — | 10/179 (anchor) | 45 min | 0 | feat/phase3-task0-validation-test |
| 1 | 1 | ap-physics-1 | 29 | 39/179 (22%) | ~2 h | 5 | feat/phase3-wave1-ap-physics-1 |
| 2 | 2 | ap-physics-2 | 33 | 72/179 (40%) | ~2.5 h | 5 | feat/phase3-wave2-ap-physics-2 |
| 3 | 3 | ap-biology | 17 | 89/179 (50%) | ~1.5 h | 3 | feat/phase3-wave3-ap-biology |
| 4 | 4 | ap-chemistry | 15 | 104/179 (58%) | ~1.5 h | 3 | feat/phase3-wave4-ap-chemistry |
| 5 | 5 | ap-physics-c | 10 | 114/179 (64%) | ~1 h | 2 | feat/phase3-wave5-ap-physics-c |
| 6 | 6 | ngss-hs | 13 | 127/179 (71%) | ~1.25 h | 2 | feat/phase3-wave6-ngss-hs |
| 7 | 7 | ngss-ms | 26 | 153/179 (85%) | ~2 h | 5 | feat/phase3-wave7-ngss-ms |
| 8 | 8 | elementary-k5 | 23 | 176/179 (98%) | ~2 h | 5 | feat/phase3-wave8-elementary-k5 |
| 9 | 9 | general | 3 | 179/179 (100%) | ~30 min | 1 | feat/phase3-wave9-math-general |
| 10 | — | Verification | — | 179 verified | ~1 h | 0 | chore/phase3-completion-gate |

**Total: 11 tasks, 11 PRs, ~16 hours wall-clock orchestration over 3-4 calendar days at sprint cadence.** Subagent compute runs concurrent within each wave; calendar days are bounded by Vercel preview rate-limits (≥30 min cooldown between merges) and human review turnaround between waves, not by writing time.
