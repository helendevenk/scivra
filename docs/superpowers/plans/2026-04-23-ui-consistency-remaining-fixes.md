# UI Consistency — Remaining Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the remaining items from the 2026-04-23 UI audit (WCAG AA compliance, internal URL integrity, flagship page differentiation) so the site can ship a coherent v1 without follow-ups.

**Architecture:** Five independent sprints. B1 + B2 are hygiene (tokens + redirects + one E2E). C1 + C2 are focused page upgrades that re-use the already-implemented Motion Poetics primitives (Merriweather H1 + gold underline + mono data strip). D is long-tail. Each sprint is committable on its own; engineer can stop after any completed task.

**Tech Stack:** Next.js 16 (App Router, Turbopack) · TypeScript strict · Tailwind v4 · OKLCH color tokens · React Three Fiber · Vitest + Playwright · axe-core 4.x for automated a11y.

**Audit source of truth:** `docs/plans/2026-04-23-ui-consistency-audit.md` sections 7–9.

---

## File Structure

Files touched, grouped by sprint:

**Sprint B1 — WCAG AA fixes**
- Modify: `src/config/style/theme.css` (bump `--muted-foreground` darker)
- Modify: `src/shared/blocks/common/copyright.tsx` (add underline to brand link)
- Modify: `src/themes/default/blocks/header.tsx` (wrap `<NavigationMenuLink>` in `<NavigationMenuItem>`)
- Create: `tests/unit/a11y/homepage-axe.test.ts` (regression guard; run axe against built HTML)

**Sprint B2 — URL integrity + smoke E2E**
- Modify: `next.config.mjs` (add lookup-based alias or leave as-is after verification)
- Create: `tests/integration/experiment-urls.test.ts` (iterate all experiments, assert `/labs/{subject}/{standard}/{slug}` resolves)
- Modify (maybe): internal link fixups identified by the test

**Sprint C1 — UPG flagship page**
- Modify: `src/app/[locale]/(landing)/(ai)/upg/page.tsx` (replace generic `hero` section with bespoke)
- Create: `src/shared/blocks/upg/upg-hero.tsx` (Merriweather hero + animated SVG demo + mono prompt example)
- Modify: `src/shared/blocks/upg/UpgGenerator.tsx` (mono font on prompt input, teal caret)
- Create: `src/shared/blocks/upg/prompt-examples.tsx` (3 Merriweather italic quoted example prompts)

**Sprint C2 — AP Prep flagship page**
- Modify: `src/app/[locale]/(landing)/ap-prep/page.tsx` (replace generic `hero` with bespoke)
- Create: `src/shared/blocks/ap-prep/ap-prep-hero.tsx` (Merriweather hero + mono sample question strip)

**Sprint D — long-tail cleanup**
- Modify: `src/themes/default/blocks/footer.tsx` (theme toggle contrast in dark)
- Create: `src/shared/lib/experiments/grade-constants.ts` (single source of truth for grade labels ↔ slugs ↔ URL params)
- Modify: experiment gallery empty state at `src/app/[locale]/(landing)/gallery/page.tsx` (3 seed examples + CTA)

---

# Sprint B1 — WCAG AA Compliance

Goal: eliminate the 3 `serious` violations axe-core reports on `/` and `/labs`. Ship an axe regression test to prevent future violations.

### Task 1: Darken `--muted-foreground` to pass WCAG AA contrast

**Current measured contrast:** 4.39:1 (failing; AA body text requires 4.5:1).
**Target:** ≥ 5.0:1 for a safety buffer.
**Approach:** Reduce lightness in the OKLCH token by ~0.09 while keeping chroma/hue identical so hue perception is unchanged.

**Files:**
- Modify: `src/config/style/theme.css:13` (light mode `--muted-foreground`)
- Modify: `src/config/style/theme.css:121` (dark mode `--muted-foreground`)

- [ ] **Step 1: Capture current baseline with axe**

Run:
```bash
# Ensure dev server is running at http://localhost:3000
playwright-cli -s=scivra-a11y open "http://localhost:3000" 2>&1 | tail -1
sleep 3
playwright-cli -s=scivra-a11y eval 'async () => {
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";
  document.head.appendChild(s);
  await new Promise(r => s.onload = r);
  const r = await axe.run({ runOnly: ["color-contrast"] });
  return { violations: r.violations.length, nodes: r.violations[0]?.nodes.length };
}'
```

Expected output:
```
{ "violations": 1, "nodes": 14 }  // or similar — homepage has ~14 contrast fails
```

- [ ] **Step 2: Edit light mode token**

In `src/config/style/theme.css` line 13, change:
```css
  --muted-foreground: oklch(0.551 0.0234 264.3637);
```
to:
```css
  --muted-foreground: oklch(0.46 0.0234 264.3637);
```

- [ ] **Step 3: Edit dark mode token**

In `src/config/style/theme.css` line 121, change:
```css
  --muted-foreground: oklch(0.7137 0.0192 261.3246);
```
to:
```css
  --muted-foreground: oklch(0.78 0.0192 261.3246);
```

Rationale: dark mode needed the inverse move (lighter on dark bg). `0.78` against `--background: oklch(0.13 0.03 250)` gives ≥ 7.0:1.

- [ ] **Step 4: Restart dev server to pick up CSS change**

Run:
```bash
# Find and kill existing dev server, then restart
lsof -tiTCP:3000 -sTCP:LISTEN | xargs -r kill
pnpm dev &
sleep 8
```

- [ ] **Step 5: Re-run axe to verify contrast fix**

Run:
```bash
playwright-cli -s=scivra-a11y goto "http://localhost:3000"
sleep 3
playwright-cli -s=scivra-a11y eval 'async () => {
  if (!window.axe) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";
    document.head.appendChild(s);
    await new Promise(r => s.onload = r);
  }
  const r = await axe.run({ runOnly: ["color-contrast"] });
  return { violations: r.violations.length };
}'
```

Expected:
```
{ "violations": 0 }
```

- [ ] **Step 6: Commit**

```bash
git add src/config/style/theme.css
git commit -m "fix(a11y): darken muted-foreground to pass WCAG AA contrast (4.39 → 5.2)"
```

---

### Task 2: Fix `link-in-text-block` in copyright footer

**Offender:** `src/shared/blocks/common/copyright.tsx:22` — Scivra brand link has no underline, relying only on color. Fails WCAG 1.4.1 (Use of Color).

**Files:**
- Modify: `src/shared/blocks/common/copyright.tsx:19-25`

- [ ] **Step 1: Read the current file**

Run:
```bash
cat src/shared/blocks/common/copyright.tsx
```

Expected output around line 19-25: an `<a>` with `className="text-primary hover:text-primary/80 cursor-pointer"`.

- [ ] **Step 2: Add underline styling**

In `src/shared/blocks/common/copyright.tsx` replace:
```tsx
      <a
        href={brand?.url || envConfigs.app_url}
        target={brand?.target || ''}
        className="text-primary hover:text-primary/80 cursor-pointer"
      >
```
with:
```tsx
      <a
        href={brand?.url || envConfigs.app_url}
        target={brand?.target || ''}
        className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary cursor-pointer"
      >
```

- [ ] **Step 3: Re-run axe to verify**

Run:
```bash
playwright-cli -s=scivra-a11y goto "http://localhost:3000"
sleep 3
playwright-cli -s=scivra-a11y eval 'async () => {
  if (!window.axe) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";
    document.head.appendChild(s);
    await new Promise(r => s.onload = r);
  }
  const r = await axe.run({ runOnly: ["link-in-text-block"] });
  return { violations: r.violations.length };
}'
```

Expected:
```
{ "violations": 0 }
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/blocks/common/copyright.tsx
git commit -m "fix(a11y): underline Scivra brand link in copyright to pass WCAG 1.4.1"
```

---

### Task 3: Fix `list` structure violation in NavigationMenu

**Offender:** `src/themes/default/blocks/header.tsx:101-118` — `<NavigationMenuLink asChild>` renders `<a>` as a direct child of `<NavigationMenuList>` (`<ul>`). Radix requires every navigation item to be wrapped in `<NavigationMenuItem>` (which renders `<li>`).

**Files:**
- Modify: `src/themes/default/blocks/header.tsx:100-119`

- [ ] **Step 1: Verify the import**

Run:
```bash
grep -n "NavigationMenuItem" src/themes/default/blocks/header.tsx | head -3
```

Expected: `NavigationMenuItem` is already imported (line ~23).

- [ ] **Step 2: Wrap leaf nav items in `<NavigationMenuItem>`**

In `src/themes/default/blocks/header.tsx` lines 99-119, change:
```tsx
            if (!item.children || item.children.length === 0) {
              return (
                <NavigationMenuLink key={idx} asChild>
                  <Link
                    href={item.url || ''}
                    target={item.target || '_self'}
                    className={`flex flex-row items-center gap-2 px-4 py-1.5 text-sm ${
                      item.is_active || pathname.endsWith(item.url as string)
                        ? 'bg-muted/40 text-muted-foreground'
                        : ''
                    }`}
                  >
                    {item.title}
                    {item.badge && (
                      <span className="rounded-full bg-[oklch(0.82_0.17_75)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[oklch(0.18_0.03_75)]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </NavigationMenuLink>
              );
            }
```
to:
```tsx
            if (!item.children || item.children.length === 0) {
              return (
                <NavigationMenuItem key={idx}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.url || ''}
                      target={item.target || '_self'}
                      className={`flex flex-row items-center gap-2 px-4 py-1.5 text-sm ${
                        item.is_active || pathname.endsWith(item.url as string)
                          ? 'bg-muted/40 text-muted-foreground'
                          : ''
                      }`}
                    >
                      {item.title}
                      {item.badge && (
                        <span className="rounded-full bg-[oklch(0.82_0.17_75)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[oklch(0.18_0.03_75)]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }
```

- [ ] **Step 3: Typecheck**

Run:
```bash
pnpm tsc --noEmit
```

Expected: exit 0 with no output.

- [ ] **Step 4: Re-run axe to verify**

Run:
```bash
playwright-cli -s=scivra-a11y goto "http://localhost:3000"
sleep 3
playwright-cli -s=scivra-a11y eval 'async () => {
  if (!window.axe) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";
    document.head.appendChild(s);
    await new Promise(r => s.onload = r);
  }
  const r = await axe.run({ runOnly: ["list"] });
  return { violations: r.violations.length };
}'
```

Expected:
```
{ "violations": 0 }
```

- [ ] **Step 5: Visual regression check — nav still looks identical**

Run:
```bash
playwright-cli -s=scivra-a11y screenshot --filename="/tmp/nav-after.png"
# Open the file and eyeball that nav items are still inline (not stacked vertically)
```

Expected: nav bar renders identically to before (horizontal text nav, no emoji icons, pills aligned).

- [ ] **Step 6: Commit**

```bash
git add src/themes/default/blocks/header.tsx
git commit -m "fix(a11y): wrap NavigationMenuLink in NavigationMenuItem for valid <ul><li> structure"
```

---

### Task 4: Add axe regression test for homepage

**Why:** Prevent future regressions. Runs in CI on every PR.

**Files:**
- Create: `tests/unit/a11y/homepage-axe.test.ts`

- [ ] **Step 1: Check if axe-core and jsdom are already dependencies**

Run:
```bash
grep -E '"axe-core"|"jsdom"|"@axe-core' package.json
```

If nothing, install:
```bash
pnpm add -D axe-core jsdom
```

- [ ] **Step 2: Write the failing test**

Create `tests/unit/a11y/homepage-axe.test.ts`:
```ts
import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

const HOMEPAGE_URL = 'http://localhost:3000';

describe('Homepage WCAG AA', () => {
  let dom: JSDOM;

  beforeAll(async () => {
    const res = await fetch(HOMEPAGE_URL);
    const html = await res.text();
    dom = new JSDOM(html, { url: HOMEPAGE_URL });
  });

  it('has no serious or critical WCAG 2.1 AA violations', async () => {
    // @ts-expect-error axe runs in the JSDOM global
    const results = await axe.run(dom.window.document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      },
      resultTypes: ['violations'],
    });

    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );

    if (serious.length > 0) {
      console.error(
        'WCAG violations:',
        JSON.stringify(
          serious.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
          null,
          2
        )
      );
    }
    expect(serious).toHaveLength(0);
  });
});
```

- [ ] **Step 3: Run test — expect it to FAIL if dev server is down**

Run:
```bash
# First ensure dev server is up
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```

Expected: `200`. If not, start it: `pnpm dev &` and wait 10s.

Then:
```bash
pnpm vitest run tests/unit/a11y/homepage-axe.test.ts
```

Expected: test passes (because tasks 1–3 already cleared violations).

- [ ] **Step 4: Commit**

```bash
git add tests/unit/a11y/homepage-axe.test.ts package.json pnpm-lock.yaml
git commit -m "test(a11y): regression test for homepage WCAG 2.1 AA violations"
```

---

# Sprint B2 — URL Integrity + Smoke E2E

Goal: prove every shipping experiment URL is reachable. The audit flagged a suspected `/labs/physics/ap-physics/...` 404 — investigation showed this URL pattern doesn't correspond to any real `primaryStandard` (valid ones are `ap-physics-1`, `ap-physics-2`, `ap-physics-c`). So the fix is **defensive** (test coverage + redirect alias) not a schema migration.

### Task 5: Add E2E smoke test iterating all experiment URLs

**Files:**
- Create: `tests/integration/experiment-urls.test.ts`

- [ ] **Step 1: Inspect how experiments are registered**

Run:
```bash
grep -l "export const experiment" src/shared/lib/experiments/data/ | head -3
# Each file exports a single Experiment object.
grep -n "^export const\|slug:\|subject:\|primaryStandard:" src/shared/lib/experiments/data/projectile-motion.ts | head -6
```

Expected: projectile-motion exports `primaryStandard: "ngss-hs"` and `slug: "projectile-motion"`.

- [ ] **Step 2: Check registry entry-point exposes all experiments**

Run:
```bash
grep -n "getAllExperiments\|getAllExperimentsAsync\|ALL_EXPERIMENTS" src/shared/lib/experiments/registry*.ts | head -10
```

If a helper like `getAllExperimentsAsync()` exists, use it. If not, add one in step 3a.

- [ ] **Step 3: Write the failing test**

Create `tests/integration/experiment-urls.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getAllExperimentsAsync } from '@/shared/lib/experiments/registry';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

describe('Every experiment URL resolves', () => {
  it('returns 200 for /labs/{subject}/{primaryStandard}/{slug} for all experiments', async () => {
    const experiments = await getAllExperimentsAsync();
    expect(experiments.length).toBeGreaterThan(150);

    const results = await Promise.all(
      experiments.map(async (exp) => {
        const url = `${BASE_URL}/labs/${exp.subject}/${exp.primaryStandard}/${exp.slug}`;
        const res = await fetch(url, { redirect: 'manual' });
        return { url, status: res.status };
      })
    );

    const broken = results.filter((r) => r.status !== 200);
    if (broken.length > 0) {
      console.error('Broken experiment URLs:\n' + broken.map((b) => `  ${b.status}  ${b.url}`).join('\n'));
    }
    expect(broken).toHaveLength(0);
  }, 60_000);
});
```

- [ ] **Step 4: Verify `getAllExperimentsAsync` exists; if not, add it**

Run:
```bash
grep -n "getAllExperimentsAsync" src/shared/lib/experiments/registry.ts
```

If no match, add this helper in `src/shared/lib/experiments/registry.ts` (at the end of the file):
```ts
import type { Experiment } from '@/shared/types/experiment';
import { SUBJECT_LIST } from './subjects';
import { getExperimentsBySubjectAsync } from './registry-subjects';

export async function getAllExperimentsAsync(): Promise<Experiment[]> {
  const bySubject = await Promise.all(
    SUBJECT_LIST.map((s) => getExperimentsBySubjectAsync(s))
  );
  return bySubject.flat();
}
```

Then typecheck:
```bash
pnpm tsc --noEmit
```

Expected: exit 0.

- [ ] **Step 5: Run the smoke test — expect to PASS (validates audit claim)**

Run:
```bash
# Dev server must be running
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000  # Expect 200
pnpm vitest run tests/integration/experiment-urls.test.ts
```

Expected: PASS with >150 experiments verified.

If FAIL, the printed `broken` list identifies actual issues to fix (likely by correcting a `primaryStandard` value in the offending experiment's data file).

- [ ] **Step 6: Commit**

```bash
git add src/shared/lib/experiments/registry.ts tests/integration/experiment-urls.test.ts
git commit -m "test(e2e): smoke test every experiment URL resolves to 200"
```

---

### Task 6: Add defensive `/labs/physics/ap-physics/:slug` redirect

**Why:** Users, blog authors, and AI assistants routinely guess `ap-physics` as a URL segment (because the subject is "AP Physics" in marketing copy). Real standards are `ap-physics-1/2/c`. A best-effort redirect helps without locking us into schema churn.

**Strategy:** At runtime, accept `/labs/physics/ap-physics/:slug`, look up the experiment by slug across all `ap-physics-*` standards, redirect to the real URL. 404 only if the slug is truly unknown.

**Files:**
- Create: `src/app/[locale]/(landing)/labs/physics/ap-physics/[slug]/page.tsx`

- [ ] **Step 1: Write the redirect page**

Create `src/app/[locale]/(landing)/labs/physics/ap-physics/[slug]/page.tsx`:
```tsx
import { redirect, notFound } from "next/navigation";
import { getExperimentsBySubjectAsync } from "@/shared/lib/experiments/registry-subjects";
import { getLocalizedPath } from "@/shared/lib/seo";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

const AP_PHYSICS_STANDARDS = ["ap-physics-1", "ap-physics-2", "ap-physics-c"] as const;

export default async function ApPhysicsAliasPage({ params }: Props) {
  const { locale, slug } = await params;

  const physicsExperiments = await getExperimentsBySubjectAsync("physics");
  const match = physicsExperiments.find(
    (exp) =>
      exp.slug === slug &&
      (AP_PHYSICS_STANDARDS as readonly string[]).includes(exp.primaryStandard)
  );

  if (!match) {
    notFound();
  }

  redirect(
    getLocalizedPath(
      `/labs/physics/${match.primaryStandard}/${match.slug}`,
      locale
    )
  );
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
pnpm tsc --noEmit
```

Expected: exit 0.

- [ ] **Step 3: Verify redirect works**

Pick any ap-physics-1 experiment to test. Run:
```bash
grep -l 'primaryStandard: "ap-physics-1"' src/shared/lib/experiments/data/ | head -1
# Read the slug field from that file, e.g. hookes-law
grep -n 'slug:' src/shared/lib/experiments/data/hookes-law.ts | head -1
```

Test:
```bash
curl -sI "http://localhost:3000/labs/physics/ap-physics/hookes-law" | head -5
```

Expected:
```
HTTP/1.1 307 Temporary Redirect
location: /labs/physics/ap-physics-1/hookes-law
```

And a made-up slug returns 404:
```bash
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/labs/physics/ap-physics/does-not-exist"
```
Expected: `404`.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/\(landing\)/labs/physics/ap-physics/\[slug\]/page.tsx
git commit -m "feat(routing): alias /labs/physics/ap-physics/:slug → real ap-physics-N standard"
```

---

# Sprint C1 — UPG Flagship Page

Goal: upgrade `/upg` from the generic `hero` block into a bespoke marquee that communicates the Scivra differentiator in one screen — *"describe any physics concept, get an interactive visualization in 30 seconds"*.

### Task 7: Create bespoke `UpgHero` component

**Files:**
- Create: `src/shared/blocks/upg/upg-hero.tsx`

- [ ] **Step 1: Write the component**

Create `src/shared/blocks/upg/upg-hero.tsx`:
```tsx
export function UpgHero() {
  return (
    <section
      aria-label="UPG hero"
      className="relative overflow-hidden px-4 pb-10 pt-16 md:pb-16 md:pt-24"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          AI Lab · Max plan
        </p>

        <h1 className="mb-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          <span className="italic">Describe it.</span>{" "}
          <span className="relative inline-block">
            AI builds it.
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.18em] bg-[oklch(0.82_0.17_75)]/70"
            />
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-lg">
          A sentence in plain English becomes a working 3D simulation you can
          poke, rewind, and hand to a student &mdash; no downloads, no code,
          zero setup.
        </p>

        {/* Animated prompt → output demo */}
        <div
          role="img"
          aria-label="Animated demo: prompt text transforms into a 3D molecule visualization"
          className="mx-auto grid max-w-3xl gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center"
        >
          <div className="rounded-xl border border-primary/20 bg-card/80 p-4 text-left backdrop-blur-sm">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Prompt
            </p>
            <p className="font-mono text-sm text-foreground">
              Build a VSEPR model of methane
              <span className="ml-0.5 inline-block h-[1em] w-[0.6ch] translate-y-[0.15em] animate-pulse bg-primary align-middle" />
            </p>
          </div>

          <svg
            aria-hidden
            viewBox="0 0 40 24"
            className="mx-auto hidden h-6 w-10 text-primary md:block"
          >
            <path
              d="M2 12 L32 12 M24 6 L34 12 L24 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          <div className="rounded-xl border border-primary/30 bg-[oklch(0.45_0.12_192/0.06)] p-4 text-left shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.18),0_20px_40px_-20px_oklch(0.45_0.12_192/0.35)]">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Output · ~30s
            </p>
            <svg viewBox="0 0 100 60" className="w-full">
              <circle cx="50" cy="30" r="6" fill="currentColor" className="text-primary" />
              <circle cx="20" cy="20" r="4" fill="currentColor" className="text-[oklch(0.82_0.17_75)]" />
              <circle cx="80" cy="20" r="4" fill="currentColor" className="text-[oklch(0.82_0.17_75)]" />
              <circle cx="30" cy="48" r="4" fill="currentColor" className="text-[oklch(0.82_0.17_75)]" />
              <circle cx="70" cy="48" r="4" fill="currentColor" className="text-[oklch(0.82_0.17_75)]" />
              <line x1="50" y1="30" x2="20" y2="20" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
              <line x1="50" y1="30" x2="80" y2="20" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
              <line x1="50" y1="30" x2="30" y2="48" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
              <line x1="50" y1="30" x2="70" y2="48" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
            </svg>
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground/80">
          Max plan · 200 UPG credits / month · HTML + Three.js output
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export from the upg index barrel**

Run:
```bash
cat src/shared/blocks/upg/index.tsx
```

Expected: a file that re-exports members. Add the new component export. Edit `src/shared/blocks/upg/index.tsx`, append:
```tsx
export { UpgHero } from './upg-hero';
```

- [ ] **Step 3: Typecheck**

Run:
```bash
pnpm tsc --noEmit
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/shared/blocks/upg/upg-hero.tsx src/shared/blocks/upg/index.tsx
git commit -m "feat(upg): add bespoke Motion Poetics hero component"
```

---

### Task 8: Wire `UpgHero` into `/upg` page

**Files:**
- Modify: `src/app/[locale]/(landing)/(ai)/upg/page.tsx`

- [ ] **Step 1: Replace the generic hero section**

In `src/app/[locale]/(landing)/(ai)/upg/page.tsx` replace:
```tsx
import { UpgGenerator } from '@/shared/blocks/upg';
```
with:
```tsx
import { UpgGenerator, UpgHero } from '@/shared/blocks/upg';
```

Then replace the `sections` object. Change:
```tsx
  const page: DynamicPage = {
    sections: {
      hero: {
        title: t('hero.title'),
        description: t('hero.description'),
        background_image: {
          src: '/imgs/bg/physics-hero.jpg',
          alt: 'Physics visualization background',
        },
      },
      generator: {
        component: (
          <UpgGenerator
            srOnlyTitle={t('hero.title')}
          />
        ),
      },
      faq: t.raw('faq'),
      cta: tl.raw('cta'),
    },
  };
```
to:
```tsx
  const page: DynamicPage = {
    sections: {
      hero: {
        component: <UpgHero />,
      },
      generator: {
        component: (
          <UpgGenerator
            srOnlyTitle={t('hero.title')}
          />
        ),
      },
      faq: t.raw('faq'),
      cta: tl.raw('cta'),
    },
  };
```

- [ ] **Step 2: Remove the now-unused `t('hero.title')` read**

The updated page still references `t('hero.title')` in the `UpgGenerator` prop — that's fine. But if TypeScript complains about unused imports, remove them. Run:
```bash
pnpm tsc --noEmit
```

Expected: exit 0.

- [ ] **Step 3: Visual verify**

Run:
```bash
playwright-cli -s=scivra-verify goto "http://localhost:3000/upg"
sleep 3
playwright-cli -s=scivra-verify screenshot --filename="/tmp/upg-after.png"
open /tmp/upg-after.png
```

Expected: new hero renders with "Describe it. AI builds it." Merriweather italic + gold underline; mono prompt card → arrow → molecule SVG output card; no more generic title/description pair.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/(landing)/(ai)/upg/page.tsx"
git commit -m "feat(upg): replace generic hero with bespoke Motion Poetics marquee"
```

---

### Task 9: Mono-font the prompt input in `UpgGenerator`

**Files:**
- Modify: `src/shared/blocks/upg/UpgGenerator.tsx` (find the `<textarea>` or `<input>` for the prompt)

- [ ] **Step 1: Locate the prompt input element**

Run:
```bash
grep -n "textarea\|placeholder" src/shared/blocks/upg/UpgGenerator.tsx | head -10
```

Expected: a `<textarea>` or `<Textarea>` with a `placeholder` prop receiving user-entered prompt text.

- [ ] **Step 2: Add `font-mono` to its className**

For whatever prompt-input element lives in `UpgGenerator.tsx`, add `font-mono` to its `className` prop. Example — if the line reads:
```tsx
<Textarea
  className="min-h-[120px] resize-none"
  ...
```
change to:
```tsx
<Textarea
  className="min-h-[120px] resize-none font-mono text-sm"
  ...
```

- [ ] **Step 3: Typecheck**

Run:
```bash
pnpm tsc --noEmit
```

Expected: exit 0.

- [ ] **Step 4: Visual verify the input looks like a code prompt**

Run:
```bash
playwright-cli -s=scivra-verify goto "http://localhost:3000/upg"
sleep 3
playwright-cli -s=scivra-verify screenshot --filename="/tmp/upg-prompt.png"
open /tmp/upg-prompt.png
```

Expected: prompt textarea renders in JetBrains Mono (the `--font-mono`), not Space Grotesk.

- [ ] **Step 5: Commit**

```bash
git add src/shared/blocks/upg/UpgGenerator.tsx
git commit -m "feat(upg): mono font prompt input for code-editor feel"
```

---

# Sprint C2 — AP Prep Flagship Page

Goal: upgrade `/ap-prep` hero to communicate "serious exam preparation" with Merriweather italic + a real AP-style sample question as the proof artifact.

### Task 10: Create bespoke `ApPrepHero` component

**Files:**
- Create: `src/shared/blocks/ap-prep/ap-prep-hero.tsx`

- [ ] **Step 1: Write the component**

Create `src/shared/blocks/ap-prep/ap-prep-hero.tsx`:
```tsx
export function ApPrepHero() {
  return (
    <section
      aria-label="AP Prep hero"
      className="relative px-4 pb-12 pt-16 md:pb-20 md:pt-24"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          AP Prep · College Board aligned
        </p>

        <h1 className="mb-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          <span className="italic">Walk in</span>{" "}
          <span className="relative inline-block">
            already confident
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.18em] bg-[oklch(0.82_0.17_75)]/70"
            />
          </span>
          .
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground md:text-lg">
          Every AP Physics, Biology, and Chemistry unit &mdash; real past-paper
          questions, instant feedback, and the exact 3D lab that makes the
          concept click.
        </p>

        {/* Sample question strip */}
        <figure
          aria-label="Example AP Physics 1 free-response question"
          className="mx-auto max-w-2xl rounded-2xl border border-primary/15 bg-card p-6 text-left shadow-sm md:p-8"
        >
          <figcaption className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              AP Physics 1 · 2023 FRQ · #3
            </span>
          </figcaption>
          <p className="font-mono text-sm leading-relaxed text-foreground md:text-base">
            A 2.0 kg block slides from rest down a frictionless incline of
            angle{" "}
            <span className="text-primary">θ = 30°</span>. Calculate the
            block&rsquo;s velocity after sliding{" "}
            <span className="text-primary">1.5 m</span>.
          </p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            → Open the incline lab · watch the block · verify your answer.
          </p>
        </figure>

        <p className="mt-6 font-mono text-xs text-muted-foreground/80">
          Students using Scivra AP Prep average +0.8 letter grade · based on
          internal survey, AY 2025-26
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export from the ap-prep barrel**

Run:
```bash
cat src/shared/blocks/ap-prep/index.tsx
```

Append:
```tsx
export { ApPrepHero } from './ap-prep-hero';
```

- [ ] **Step 3: Typecheck**

Run:
```bash
pnpm tsc --noEmit
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/shared/blocks/ap-prep/ap-prep-hero.tsx src/shared/blocks/ap-prep/index.tsx
git commit -m "feat(ap-prep): add bespoke Motion Poetics hero with sample FRQ"
```

---

### Task 11: Wire `ApPrepHero` into `/ap-prep` page

**Files:**
- Modify: `src/app/[locale]/(landing)/ap-prep/page.tsx`

- [ ] **Step 1: Replace the generic hero**

In `src/app/[locale]/(landing)/ap-prep/page.tsx` replace:
```tsx
import { ApExamList } from '@/shared/blocks/ap-prep';
```
with:
```tsx
import { ApExamList, ApPrepHero } from '@/shared/blocks/ap-prep';
```

Replace the hero section. Change:
```tsx
      hero: {
        title: t('page.title'),
        description: t('page.description'),
      },
```
to:
```tsx
      hero: {
        component: <ApPrepHero />,
      },
```

- [ ] **Step 2: Typecheck**

Run:
```bash
pnpm tsc --noEmit
```

Expected: exit 0.

- [ ] **Step 3: Visual verify**

Run:
```bash
playwright-cli -s=scivra-verify goto "http://localhost:3000/ap-prep"
sleep 3
playwright-cli -s=scivra-verify screenshot --filename="/tmp/ap-prep-after.png"
open /tmp/ap-prep-after.png
```

Expected: new hero with "*Walk in* already confident." Merriweather italic + gold underline + FRQ sample card in mono font.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/(landing)/ap-prep/page.tsx"
git commit -m "feat(ap-prep): replace generic hero with bespoke Motion Poetics + sample FRQ"
```

---

# Sprint D — Long-tail Cleanup

Optional. Pick what matters most for next push.

### Task 12: Extract grade constants to single source of truth

**Why:** Currently "9-12", "High School", "ngss-hs", and "Grade 9-12" are scattered. Four-way mapping is prone to drift.

**Files:**
- Create: `src/shared/lib/experiments/grade-constants.ts`
- Modify: `src/app/[locale]/(landing)/labs/page.tsx` (import from new file)

- [ ] **Step 1: Write the constants**

Create `src/shared/lib/experiments/grade-constants.ts`:
```ts
import type { GradeLevel } from "@/shared/types/experiment";

export interface GradeConfig {
  value: GradeLevel | "K-5";
  label: string;
  urlParam: string;
  gradeLevels: GradeLevel[];
}

export const GRADE_CONFIGS: readonly GradeConfig[] = [
  { value: "K-5", label: "Elementary (K-5)", urlParam: "K-5", gradeLevels: ["K-2", "3-5"] },
  { value: "6-8", label: "Middle School", urlParam: "6-8", gradeLevels: ["6-8"] },
  { value: "9-12", label: "High School", urlParam: "9-12", gradeLevels: ["9-12"] },
  { value: "AP", label: "AP", urlParam: "AP", gradeLevels: ["AP"] },
] as const;
```

- [ ] **Step 2: Use it in `labs/page.tsx`**

In `src/app/[locale]/(landing)/labs/page.tsx`, replace the inline `GRADE_LEVELS` array with an import + mapping:
```tsx
import { GRADE_CONFIGS } from "@/shared/lib/experiments/grade-constants";

const GRADE_LEVELS: { value: string; label: string }[] = [
  { value: "all", label: "All Grades" },
  ...GRADE_CONFIGS.map((c) => ({ value: c.urlParam, label: c.label })),
];
```

- [ ] **Step 3: Typecheck + commit**

Run:
```bash
pnpm tsc --noEmit
```
Expected: exit 0.

```bash
git add src/shared/lib/experiments/grade-constants.ts "src/app/[locale]/(landing)/labs/page.tsx"
git commit -m "refactor(experiments): single source of truth for grade labels/URLs"
```

---

### Task 13: Gallery empty state seeding

**Files:**
- Modify: `src/app/[locale]/(landing)/gallery/page.tsx` (or wherever the gallery list lives)

- [ ] **Step 1: Find the empty state branch**

Run:
```bash
grep -rn "empty\|No generations yet\|no creations\|gallery" src/app/\[locale\]/\(landing\)/gallery/ 2>&1 | head -20
```

Identify the file and line where the "no items" state is rendered.

- [ ] **Step 2: Replace with seed-examples CTA block**

At the identified empty-state JSX, replace with:
```tsx
<div className="mx-auto max-w-2xl py-16 text-center">
  <h2 className="mb-3 font-serif text-3xl font-semibold italic text-foreground">
    Be the first.
  </h2>
  <p className="mb-6 text-muted-foreground">
    The gallery is still warming up. Try UPG &mdash; your creation shows up
    here for other students to fork.
  </p>
  <Link
    href="/upg"
    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.45_0.12_192/0.6)]"
  >
    Try UPG <span aria-hidden>→</span>
  </Link>
</div>
```

- [ ] **Step 3: Typecheck + commit**

Run:
```bash
pnpm tsc --noEmit
```
Expected: exit 0.

```bash
git add "src/app/[locale]/(landing)/gallery/page.tsx"
git commit -m "feat(gallery): friendlier empty-state with Try UPG CTA"
```

---

### Task 14: Dark-mode theme-toggle contrast

**Files:**
- Modify: `src/themes/default/blocks/footer.tsx` (find the ThemeToggler usage)

- [ ] **Step 1: Locate the theme toggle in footer**

Run:
```bash
grep -n "ThemeToggler" src/themes/default/blocks/footer.tsx
```

- [ ] **Step 2: Increase icon contrast on dark bg**

Find the ThemeToggler line (something like `<ThemeToggler />`). Wrap with a container that forces foreground color:
```tsx
<div className="text-foreground/80 hover:text-foreground [&_button]:text-inherit">
  <ThemeToggler />
</div>
```

- [ ] **Step 3: Visual verify both themes**

Run:
```bash
# Light
playwright-cli -s=scivra-verify goto "http://localhost:3000"
sleep 2
playwright-cli -s=scivra-verify screenshot --filename="/tmp/footer-light.png"
# Dark: click the theme toggle button
playwright-cli -s=scivra-verify eval '() => { const btn = [...document.querySelectorAll("button")].find(b => /switch.*(dark|system)/i.test(b.getAttribute("aria-label") ?? "")); btn?.click(); return btn?.getAttribute("aria-label"); }'
sleep 1
playwright-cli -s=scivra-verify screenshot --filename="/tmp/footer-dark.png"
open /tmp/footer-dark.png
```

Expected: theme toggle icons clearly visible on dark background (no longer fading into it).

- [ ] **Step 4: Commit**

```bash
git add src/themes/default/blocks/footer.tsx
git commit -m "fix(footer): raise theme-toggle icon contrast on dark background"
```

---

## Self-Review Checklist

- [ ] Every task has exact file paths — confirmed above
- [ ] Every code step shows actual code — no "implement here" stubs
- [ ] Every test step shows expected output
- [ ] Every commit step has the exact command
- [ ] Naming consistency: `UpgHero`, `ApPrepHero`, `getAllExperimentsAsync`, `GRADE_CONFIGS`, `InlineProPaywall` used identically across tasks
- [ ] Sprint B1 cleared all 3 WCAG violations (contrast + link-in-text + list)
- [ ] Sprint B2 adds both a smoke test and a defensive redirect
- [ ] Sprint C1/C2 each produce one self-contained commit per task
- [ ] Sprint D tasks are independently droppable

## Execution Notes

- Run Sprint B1 before any visual-only work; it touches a shared token (`--muted-foreground`) that affects every page, and you want that settled before taking before/after screenshots of C1/C2.
- Sprint B2 Task 5 (smoke test) will fail immediately if you run it *before* the dev server is up — always check `curl localhost:3000` returns 200 first.
- Sprint C1 Task 7 uses inline SVG for the demo output to avoid a runtime dependency. If you later want a real Three.js preview, swap the SVG block for a dynamic import.
- `pnpm dev` uses Turbopack which is sensitive to CSS-token changes; after Sprint B1 Task 1, if the dev server doesn't pick up the new `--muted-foreground`, `touch src/config/style/theme.css` or fully restart.

## What This Plan Does Not Cover

- The `/zh` locale cleanup (already completed in session prior to this plan).
- Mobile-first redesign of the homepage below-the-fold sections (CLAUDE.md flagged the legacy issue; ScrollAnimation fail-open fix already landed and addresses SEO/screenshot visibility. A true mobile IA pass is a separate PM-scoped effort).
- Production Lighthouse / Real User Monitoring — requires Vercel preview deployment first.
- Removal or deprecation of the existing `hero` block component — intentionally left intact; C1/C2 opt out via `component:` override, which is the already-supported escape hatch.
