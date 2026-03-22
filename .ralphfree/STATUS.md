# Sprint 0 Status

**Status**: IN_PROGRESS
**Started**: 2026-03-22T16:30:00Z
**Current Task**: T6 (next: write experiment_access tests)
**Iteration**: 2

## Progress

### T1: CSS prefix migration ✅
- Renamed all `.edu-*` to `.np-*` in theme-education.css (replace_all)
- Renamed `--edu-*` to `--np-*` CSS variables
- Added deprecated `.edu-*` class aliases at bottom (inline styles, not @apply)
- Evidence: `grep -c "\.np-" theme-education.css` = 42 matches

### T2: TSX file migration ✅
- Zero TSX files reference `edu-` classes (only CSS + 1 comment in visual-design.ts)
- Updated visual-design.ts comment: "edu-academic" → "np-academic"
- Evidence: `grep -r "edu-" src/ --include="*.tsx"` = 0 matches

### T3: Subject color system ✅
- Added 5 `[data-subject]` CSS rules + dark mode variants to theme-education.css
- Added `.np-subject-badge` and `.np-subject-card` contextual components
- Updated theme.css: `--subject-*` CSS variables (physics/chemistry/biology/earth/math)
- Added `--np-gold/green/navy` with deprecated `--edu-*` aliases in theme.css
- Evidence: `grep -c "data-subject" theme-education.css` = 12 matches

### T4: Subject metadata ✅
- Created `src/shared/lib/experiments/subjects.ts`
- SUBJECTS const with 5 entries: physics/chemistry/biology/earth-science/math
- Each has label, labelZh, dataAttr, icon
- Exported SUBJECT_LIST array
- Type-safe: `satisfies Record<Subject, ...>`

### T5: Experiment types ✅
- Added `Subject` type to `src/shared/types/experiment.ts`
- Added `GradeLevel` type: "K-2" | "3-5" | "6-8" | "9-12" | "AP"
- Added `subject` and `gradeLevel` fields to Experiment interface

### T6-T16: PENDING
- Next: T6 — write failing test for experiment_access model (TDD)
- Tests live in `tests/unit/` (not `src/`), vitest config: `tests/**/*.test.{ts,tsx}`
- Test setup: `tests/setup.ts`

## Key Discovery
- edu-* classes only exist in CSS files, NOT in TSX components
- Migration blast radius was minimal: 3 files total (theme-education.css, theme.css, visual-design.ts comment)
- Test directory is `tests/unit/`, not `src/shared/models/__tests__/`
