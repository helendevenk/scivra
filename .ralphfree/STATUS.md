# Sprint 0 Status

**Status**: IN_PROGRESS
**Started**: 2026-03-22T16:30:00Z
**Current Task**: T4
**Iteration**: 1

## Progress

### T1: CSS prefix migration ✅
- Renamed all `.edu-*` to `.np-*` in theme-education.css
- Added deprecated `.edu-*` aliases at bottom
- Evidence: `grep -c "\.np-" theme-education.css` = 42 matches

### T2: TSX file migration ✅
- Zero TSX files reference `edu-` classes (only CSS files did)
- Updated visual-design.ts comment
- Evidence: `grep -r "edu-" src/ --include="*.tsx"` = 0 matches

### T3: Subject color system ✅
- Added 5 `data-subject` CSS rules + dark mode variants
- Added `.np-subject-badge` and `.np-subject-card` contextual components
- Updated `theme.css` with `--subject-*` CSS variables + deprecated aliases
- Evidence: `grep -c "data-subject" theme-education.css` = 12 matches
