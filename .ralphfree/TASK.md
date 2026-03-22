# Sprint 0: Foundation

**Task ID**: TASK-20260322-S0
**Started**: 2026-03-22T16:30:00Z
**Quality Mode**: strict
**Max Iterations**: 10

## Objective

Execute Sprint 0 of the NeonPhysics v2 frontend redesign. This sprint lays the foundation for the experiment-centric pivot without changing any user-facing behavior.

## Criteria

- All `.edu-*` CSS classes renamed to `.np-*` with backward-compatible aliases
- `data-subject` CSS system renders correct colors for 5 subjects (Physics/Chemistry/Biology/Earth/Math)
- All 80+ experiment data files have `subject` and `gradeLevel` fields
- `experimentAccess` table exists in schema with model + tests
- `canAccessExperiment()` uses new 3-experiment lifetime limit logic
- 301 redirects configured for `/upg/*` → `/create/*`
- Layout group directories created (`(learn)`, `(create)`, `(dashboard)`)
- Dashboard/Settings moved from `(landing)` to `(dashboard)`
- `pnpm build` passes with zero errors
- `pnpm test` passes

## Design Decisions

### Selected: Incremental Migration with Deprecated Aliases

**Rationale**: CSS prefix `.edu-*` → `.np-*` done as rename + alias. Old names work for 30 days. This prevents breakage in any i18n JSON, markdown, or third-party references.

### Selected: `experiment_access` Table (Not User Field)

**Rationale**: A separate table allows querying which specific experiments were accessed, not just a count. Needed for "you've already accessed this one" logic. Unique constraint on (userId, experimentId) prevents duplicates.

### Selected: Subject Colors from CTO Review Appendix

**Rationale**: Physics=blue(250), Chemistry=green(145), Biology=amber(80), Earth=terracotta(25), Math=violet(310). These are FINAL per CTO review. Using `data-subject` CSS attribute for zero-runtime-cost contextual coloring.

### Selected: Layout Groups per CTO Architecture

**Rationale**: 5 active public groups: `(landing)` for public+experiments, `(learn)` for AP/Quest/Paths/Notebooks, `(create)` for UPG, `(dashboard)` for user panel. Experiments stay under `(landing)`.

## Atomic Plan

- [ ] T1: CSS prefix migration — rename `.edu-*` to `.np-*` in theme-education.css, add deprecated aliases
  Files: `src/config/style/theme-education.css`
  Test: `grep -c "\.np-" src/config/style/theme-education.css` returns > 0
  Expected: All `.edu-*` classes have `.np-*` equivalents + alias block

- [ ] T2: CSS prefix migration — find-replace `.edu-` to `.np-` in all TSX files
  Files: All `.tsx` files under `src/` referencing `edu-`
  Test: `grep -r "edu-" src/ --include="*.tsx" | grep -v "deprecated"` returns 0 matches
  Expected: All component references use `.np-*`

- [ ] T3: Subject color system — add `data-subject` CSS rules + dark mode variants
  Files: `src/config/style/theme-education.css`
  Test: CSS file contains `[data-subject="physics"]` through `[data-subject="math"]`
  Expected: 5 subject definitions + dark mode variants

- [ ] T4: Subject metadata — create subjects.ts constant
  Files: `src/shared/lib/experiments/subjects.ts` (NEW)
  Test: Import and assert 5 subjects with correct labels
  Expected: SUBJECTS constant with physics/chemistry/biology/earth-science/math

- [ ] T5: Experiment types — add Subject and GradeLevel to Experiment interface
  Files: `src/shared/types/experiment.ts`
  Test: TypeScript compilation passes
  Expected: `subject: Subject` and `gradeLevel: GradeLevel` in Experiment interface

- [ ] T6: Write test for experiment_access model FIRST (TDD)
  Files: `src/shared/models/__tests__/experiment_access.test.ts` (NEW)
  Test: `pnpm test src/shared/models/__tests__/experiment_access.test.ts` — should FAIL (no implementation)
  Expected: Tests defined for getAccessedExperimentCount, hasAccessedExperiment, recordExperimentAccess

- [ ] T7: Add experimentAccess table to schema
  Files: `src/config/db/schema.ts`
  Test: `pnpm db:generate` succeeds
  Expected: experimentAccess table with id, userId, experimentId, firstAccessedAt + indexes

- [ ] T8: Implement experiment_access model (pass tests from T6)
  Files: `src/shared/models/experiment_access.ts` (NEW)
  Test: `pnpm test src/shared/models/__tests__/experiment_access.test.ts` — should PASS
  Expected: All functions implemented and tests green

- [ ] T9: Update access.ts — new canAccessExperiment signature with lifetime limit
  Files: `src/shared/lib/experiments/access.ts`
  Test: Existing tests still pass + new logic verified
  Expected: canAccessExperiment(experimentId, userTier, accessedCount, alreadyAccessedThisExperiment)

- [ ] T10: Create experiment access API endpoint
  Files: `src/app/api/experiments/access/route.ts` (NEW)
  Test: Build succeeds, TypeScript compiles
  Expected: GET returns accessedCount/accessedIds/limit, POST records access

- [ ] T11: Script to add subject/gradeLevel to all experiment data files
  Files: `scripts/add-experiment-fields.ts` (NEW), 80+ data files
  Test: Run script, verify 5 random files have correct fields
  Expected: All experiment data files have subject and gradeLevel

- [ ] T12: Update registry.ts with filter functions
  Files: `src/shared/lib/experiments/registry.ts`
  Test: Import and call getExperimentsBySubject('physics') returns > 0
  Expected: getExperimentsBySubject(), getExperimentsByGradeLevel() functions added

- [ ] T13: 301 redirects for /upg/* → /create/*
  Files: `next.config.mjs`
  Test: `pnpm build` succeeds, redirect config in output
  Expected: 8 redirect rules (with/without locale prefix)

- [ ] T14: Layout group directories — create (learn), (create), (dashboard)
  Files: `src/app/[locale]/(learn)/layout.tsx`, `src/app/[locale]/(create)/layout.tsx`, `src/app/[locale]/(dashboard)/layout.tsx` (ALL NEW)
  Test: `pnpm build` succeeds
  Expected: Three new layout files, minimal wrappers

- [ ] T15: Move dashboard/settings from (landing) to (dashboard)
  Files: Move directories
  Test: `pnpm build` succeeds, all imports resolve
  Expected: Dashboard and settings pages under (dashboard) layout group

- [ ] T16: Final verification — build + test + grep audit
  Files: None
  Test: `pnpm build && pnpm test`
  Expected: Zero errors, zero warnings related to edu-/np- migration
