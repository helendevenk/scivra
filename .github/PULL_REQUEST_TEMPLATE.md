## Summary

<!-- 1-3 bullet points describing what this PR does -->

## Data Provenance

<!-- Required for experiment PRs. Delete this section for non-experiment PRs. -->

| Field | Value |
|-------|-------|
| Experiment Slug | `{slug}` |
| Wave | {9\|10\|11\|12} |
| Subject | {physics\|chemistry\|biology\|earth-science\|math} |
| Primary Standard | {ap-chemistry\|ap-biology\|ngss-hs\|elementary-k5\|...} |
| Data Source | {PhET / College Board / NGSS / ...} |
| Parameter Ranges Source | {textbook / PhET defaults / ...} |
| Formula Verification | {verified against textbook / ...} |

## Checklist

- [ ] `body { background: #0f172a }` (not `#0a0e1a`)
- [ ] Panel border uses correct subject rgba color
- [ ] `<title>` contains "Scivra" (not "NeonPhysics")
- [ ] Layout: fullscreen canvas + UI overlay (no scroll)
- [ ] Three.js r134 / KaTeX 0.16.9 (if used)
- [ ] JS logic ≤ 600 lines (excluding static data and CSS)
- [ ] `id === slug` (lowercase kebab-case)
- [ ] `wave` field matches target wave number
- [ ] `htmlPath` field set in data file
- [ ] html-map.ts entry added
- [ ] registry.ts import + registration added (in Wave order)
- [ ] `pnpm test` passes (registry integrity)
- [ ] Thumbnail placeholder at `public/imgs/experiments/{slug}.png`

## Test Plan

<!-- How to verify this experiment works correctly -->
