---
name: test-coverage-100-plan
status: in-progress
created: 2026-03-23T01:42:49Z
updated: 2026-03-23T01:42:49Z
---

# Test Coverage 100% Plan

## 1. Executive Summary

**Current State**: 4.68% line coverage, 165 test cases across 13 test files (all in `tests/unit/`). One E2E smoke test exists.

**Target**: 100% line coverage for `src/shared/` (models, services, lib). API routes excluded from v8 coverage by vitest config but tested via route handler mocking.

**Codebase Size**: ~76,500 lines total src, ~51,000 lines in `src/shared/`.

**Estimated Effort**: ~525 new test cases across 6 phases. Roughly 8-10 developer-days.

**Test Infrastructure**: Vitest (unit/integration), Playwright (E2E). Both already configured.

| Phase | Scope | New Tests | Dependencies | Est. Days |
|-------|-------|-----------|-------------|-----------|
| T1 | Pure Functions | ~120 | None | 1.5 |
| T2 | Model Layer | ~130 | Mock DB | 2 |
| T3 | Service Layer | ~80 | Mock Models | 1.5 |
| T4 | API Routes | ~90 | Mock Services | 2 |
| T5 | Integration | ~50 | Test DB | 1.5 |
| T6 | E2E | ~55 | Running App | 2 |

## 2. Phase T1: Pure Functions (No DB, No Mocks)

Zero external dependencies. These are deterministic functions that take inputs and return outputs. Highest ROI, start here.

### T1-01: resp.ts

**Source**: `src/shared/lib/resp.ts`
**Test file**: `tests/unit/resp.test.ts`
**Priority**: 1
**Dependencies**: None
**Test count**: 8

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `respData` | Returns code 0, message "ok", data array |
| 2 | `respData` | Handles null/undefined data (returns empty array) |
| 3 | `respOk` | Returns code 0, message "ok", no data field |
| 4 | `respErr` | Returns code -1 with custom message |
| 5 | `respErr` | Handles empty string message |
| 6 | `respJson` | Returns Response.json with code/message/data |
| 7 | `respJson` | Omits data field when data is undefined |
| 8 | `respJson` | Includes data field when data is provided |

### T1-02: content-moderator.ts

**Source**: `src/shared/lib/moderation/content-moderator.ts`
**Test file**: `tests/unit/content-moderator.test.ts`
**Priority**: 1
**Dependencies**: Imports from `@/config/moderation/sensitive-words` (static config, no mock needed)
**Test count**: 20

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `moderateInput` | Clean prompt returns `{passed: true, status: 'pass'}` |
| 2 | `moderateInput` | High severity keyword returns `{passed: false, status: 'reject'}` |
| 3 | `moderateInput` | Medium severity keyword returns `{passed: true, status: 'pending'}` |
| 4 | `moderateInput` | Low severity keyword returns `{passed: true, status: 'pass'}` with matchedKeywords |
| 5 | `moderateInput` | Case insensitive matching |
| 6 | `moderateInput` | Multiple keywords from different severity levels (highest wins) |
| 7 | `moderateInput` | Empty string returns pass |
| 8 | `moderateInput` | Very long string performance (< 50ms) |
| 9 | `moderateOutput` | Clean HTML returns pass |
| 10 | `moderateOutput` | Non-whitelisted `<script src>` returns reject |
| 11 | `moderateOutput` | Whitelisted CDN script src returns pass |
| 12 | `moderateOutput` | Inline script with `eval()` returns reject |
| 13 | `moderateOutput` | Inline script with `fetch()` returns reject |
| 14 | `moderateOutput` | Event handler attributes (`onclick`) returns reject |
| 15 | `moderateOutput` | `javascript:` protocol returns reject |
| 16 | `moderateOutput` | `<iframe>` tag returns reject |
| 17 | `moderateOutput` | `<object>` / `<embed>` tags return reject |
| 18 | `moderateOutput` | Non-whitelisted external links return pending (not reject) |
| 19 | `moderateOutput` | `localStorage` / `document.cookie` access returns reject |
| 20 | `moderateContent` | Combined input+output: both pass, one rejects, both reject |

### T1-03: html-sanitizer.ts (basic)

**Source**: `src/shared/lib/upg/html-sanitizer.ts`
**Test file**: `tests/unit/html-sanitizer.test.ts`
**Priority**: 1
**Dependencies**: `UPG_CDN_WHITELIST` from constants (static)
**Test count**: 16

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `sanitizeHtml` | Strips markdown code fences |
| 2 | `sanitizeHtml` | Strips `<think>` blocks |
| 3 | `sanitizeHtml` | Removes `eval()` calls |
| 4 | `sanitizeHtml` | Removes `new Function()` |
| 5 | `sanitizeHtml` | Removes `setTimeout` with string arguments |
| 6 | `sanitizeHtml` | Preserves `setTimeout` with function arguments |
| 7 | `sanitizeHtml` | Blocks non-whitelisted script src |
| 8 | `sanitizeHtml` | Allows whitelisted CDN script src |
| 9 | `sanitizeHtml` | Removes `fetch()` calls |
| 10 | `sanitizeHtml` | Removes `XMLHttpRequest` |
| 11 | `sanitizeHtml` | Removes `WebSocket` |
| 12 | `sanitizeHtml` | Removes `document.cookie` |
| 13 | `sanitizeHtml` | Removes `localStorage` / `sessionStorage` |
| 14 | `sanitizeHtml` | Detects XSS vectors (event handlers, javascript: protocol) |
| 15 | `sanitizeHtml` | Reports missing DOCTYPE/html/head/body tags |
| 16 | `sanitizeHtml` | Returns clean HTML passthrough when no issues |

### T1-04: html-sanitizer-enhanced.ts

**Source**: `src/shared/lib/upg/html-sanitizer-enhanced.ts`
**Test file**: `tests/unit/html-sanitizer-enhanced.test.ts`
**Priority**: 1
**Dependencies**: `LIB_VERSIONS` from config (static)
**Test count**: 22

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `sanitizeHtml` (async) | Returns SanitizeResult with issues array and performanceMs |
| 2 | `sanitizeHtml` | Detects obfuscated eval: `window['eval']()` |
| 3 | `sanitizeHtml` | Detects `Function` constructor |
| 4 | `sanitizeHtml` | Detects `document.write()` |
| 5 | `sanitizeHtml` | Detects `innerHTML` assignment |
| 6 | `sanitizeHtml` | Detects `fetch()` / `XMLHttpRequest` / `WebSocket` |
| 7 | `sanitizeHtml` | Detects storage access (localStorage, sessionStorage, cookie) |
| 8 | `sanitizeHtml` | Detects event handler attributes |
| 9 | `sanitizeHtml` | Detects `javascript:` protocol |
| 10 | `sanitizeHtml` | Detects `data:text/html` URLs |
| 11 | `sanitizeHtml` | Detects iframe, object, embed tags |
| 12 | `sanitizeHtml` | Detects `<base>` tag |
| 13 | `sanitizeHtml` | Detects ES6 import statements |
| 14 | `sanitizeHtml` | Removes dangerous code and replaces with comments |
| 15 | `sanitizeHtml` | Injects CSP meta tag into `<head>` |
| 16 | `sanitizeHtml` | Validates HTML structure (DOCTYPE, html, head, body) |
| 17 | `sanitizeHtml` | Cache hit returns cached result |
| 18 | `sanitizeHtml` | Cache evicts oldest when full (MAX_CACHE_SIZE) |
| 19 | `sanitizeHtml` | `passed` is false when critical or high issues exist |
| 20 | `sanitizeHtml` | `passed` is true when only medium/low issues |
| 21 | `sanitizeHtml` | Version validation: allows Three.js r134, rejects r135 |
| 22 | `sanitizeHtmlSync` | Synchronous version returns string issues |

### T1-05: quality-checker.ts

**Source**: `src/shared/lib/upg/quality-checker.ts`
**Test file**: `tests/unit/quality-checker.test.ts`
**Priority**: 1
**Dependencies**: `UPG_MAX_HTML_SIZE` constant, `getDisciplineConfig` (static config)
**Test count**: 18

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `checkQuality` | Full valid HTML passes all checks |
| 2 | `checkQuality` | Missing Three.js CDN script fails |
| 3 | `checkQuality` | Missing OrbitControls CDN fails |
| 4 | `checkQuality` | Self-implemented OrbitControls class fails |
| 5 | `checkQuality` | Missing KaTeX or math formulas fails |
| 6 | `checkQuality` | Missing input[type=range] slider fails |
| 7 | `checkQuality` | HTML too small (< 5KB) fails |
| 8 | `checkQuality` | HTML too large (> 200KB) fails |
| 9 | `checkQuality` | Blacklisted patterns (eval, Function, cookie) fail |
| 10 | `checkQuality` | Missing THREE.Scene initialization fails |
| 11 | `checkQuality` | Missing WebGLRenderer fails |
| 12 | `checkQuality` | Missing animation loop fails |
| 13 | `checkQuality` | Missing resize handler fails |
| 14 | `checkQuality` | Missing setPixelRatio fails |
| 15 | `checkQuality` | Missing try-catch generates warning (not failure) |
| 16 | `checkQuality` | Excessive `var` usage generates warning |
| 17 | `checkQuality` | No lighting generates warning |
| 18 | `checkQuality` | Discipline-specific rules applied when discipline param provided |

### T1-06: validation/technical-validator.ts

**Source**: `src/shared/lib/upg/validation/technical-validator.ts`
**Test file**: `tests/unit/technical-validator.test.ts`
**Priority**: 2
**Dependencies**: None
**Test count**: 12

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `runTechnicalValidation` | Full valid HTML scores 100 |
| 2 | `runTechnicalValidation` | Missing animation loop loses 15 weight |
| 3 | `runTechnicalValidation` | Missing resize handler loses 10 weight |
| 4 | `runTechnicalValidation` | Missing error handling loses 10 weight |
| 5 | `runTechnicalValidation` | Missing lighting loses 10 weight |
| 6 | `runTechnicalValidation` | Self-implemented OrbitControls fails tv-orbit-controls |
| 7 | `runTechnicalValidation` | Missing sliders loses 10 weight |
| 8 | `runTechnicalValidation` | Missing KaTeX loses 10 weight |
| 9 | `runTechnicalValidation` | Missing quiz loses 5 weight |
| 10 | `runTechnicalValidation` | Missing pixel ratio loses 5 weight |
| 11 | `runTechnicalValidation` | Blacklisted code (eval) loses 10 weight |
| 12 | `runTechnicalValidation` | Returns details array with correct structure |

### T1-07: validation/physics-validator.ts

**Source**: `src/shared/lib/upg/validation/physics-validator.ts`
**Test file**: `tests/unit/physics-validator.test.ts`
**Priority**: 2
**Dependencies**: None (exported array of rule objects)
**Test count**: 15

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `pv-energy-conservation` | Energy conservation check present: score 100 |
| 2 | `pv-energy-conservation` | Energy variables without conservation: score 30 |
| 3 | `pv-energy-conservation` | No energy system: score 50 (neutral) |
| 4 | `pv-physical-constants` | g=9.8: score 100 |
| 5 | `pv-physical-constants` | g=10: score 80 (approximate) |
| 6 | `pv-physical-constants` | g=5: score 20 (suspicious) |
| 7 | `pv-physical-constants` | No gravity constant: score 70 |
| 8 | `pv-analytical-overlay` | Numerical-analytical comparison: score 100 |
| 9 | `pv-analytical-overlay` | Analytical mentioned: score 70 |
| 10 | `pv-analytical-overlay` | No analytical overlay: score 40 |
| 11 | `pv-nan-protection` | Both isNaN check and dt cap: score 100 |
| 12 | `pv-nan-protection` | Only isNaN check: score 50 |
| 13 | `pv-nan-protection` | Neither: score 30 |
| 14 | `pv-unit-labels` | 5+ SI units: score 100 |
| 15 | `pv-unit-labels` | 0 SI units: score 30 |

### T1-08: validation/index.ts

**Source**: `src/shared/lib/upg/validation/index.ts`
**Test file**: `tests/unit/validation-full.test.ts`
**Priority**: 2
**Dependencies**: getDisciplineConfig (static config), technical-validator (pure)
**Test count**: 6

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `runFullValidation` | Returns FullValidationResult structure |
| 2 | `runFullValidation` | Overall score = tech * 0.6 + disc * 0.4 |
| 3 | `runFullValidation` | verified=true when overallScore >= threshold |
| 4 | `runFullValidation` | verified=false when overallScore < threshold |
| 5 | `runFullValidation` | Unknown discipline falls back to physics |
| 6 | `runFullValidation` | Details array contains both tech and disc results |

### T1-09: disciplines/index.ts

**Source**: `src/shared/lib/upg/disciplines/index.ts`
**Test file**: `tests/unit/disciplines.test.ts`
**Priority**: 2
**Dependencies**: Static discipline configs
**Test count**: 8

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getDisciplineConfig` | Returns physics for `undefined` |
| 2 | `getDisciplineConfig` | Returns physics for unknown ID |
| 3 | `getDisciplineConfig` | Returns correct config for each valid ID (physics, chemistry, biology, math, earth-science) |
| 4 | `getEnabledDisciplines` | Returns array of enabled disciplines |
| 5 | `getAllDisciplines` | Returns all 5 disciplines |
| 6 | `isValidDiscipline` | Returns true for valid IDs |
| 7 | `isValidDiscipline` | Returns false for invalid IDs |
| 8 | `getDisciplineConfig` | Each config has required fields (id, name, icon, qualityRules, validationRules) |

### T1-10: model-selector.ts & constants.ts

**Source**: `src/shared/lib/upg/model-selector.ts`, `src/shared/lib/upg/constants.ts`
**Test file**: `tests/unit/upg-constants.test.ts`
**Priority**: 3
**Dependencies**: None
**Test count**: 3

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `selectModel` | Returns UPG_DEFAULT_MODEL |
| 2 | constants | All constants are defined and have correct types |
| 3 | constants | UPG_MAX_HTML_SIZE is 200 * 1024 |

### T1-11: system-prompt.ts

**Source**: `src/shared/lib/upg/system-prompt.ts`
**Test file**: `tests/unit/system-prompt.test.ts`
**Priority**: 2
**Dependencies**: Prompt modules (static string functions)
**Test count**: 6

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getSystemPrompt` | Returns non-empty string |
| 2 | `getSystemPrompt` | Contains Three.js version reference |
| 3 | `getSystemPrompt` | Without discipline param, no discipline-specific content |
| 4 | `getSystemPrompt` | With "physics" discipline, includes physics prompt module |
| 5 | `buildUserPrompt` | Chinese language includes Chinese instruction |
| 6 | `buildUserPrompt` | English language includes English instruction |

### T1-12: quota.ts

**Source**: `src/shared/lib/usage/quota.ts`
**Test file**: `tests/unit/quota.test.ts` (exists, needs expansion)
**Priority**: 1
**Dependencies**: None
**Test count**: 10

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `normalizeTrackedSeconds` | Normal value passes through |
| 2 | `normalizeTrackedSeconds` | Negative returns 0 |
| 3 | `normalizeTrackedSeconds` | NaN returns 0 |
| 4 | `normalizeTrackedSeconds` | Infinity returns 0 |
| 5 | `normalizeTrackedSeconds` | Caps at MAX_TRACKED_SECONDS_PER_REQUEST (120) |
| 6 | `normalizeTrackedSeconds` | Floors decimal values |
| 7 | `buildQuotaSnapshot` | Free tier: correct limit, remaining, exhausted=false |
| 8 | `buildQuotaSnapshot` | Free tier exhausted: remaining=0, exhausted=true |
| 9 | `buildQuotaSnapshot` | Pro tier: null limits, never exhausted |
| 10 | `buildQuotaSnapshot` | Max tier: null limits, never exhausted |

### T1-13: experiments/access.ts

**Source**: `src/shared/lib/experiments/access.ts`
**Test file**: `tests/unit/experiment-access.test.ts` (exists, needs expansion)
**Priority**: 1
**Dependencies**: `registry.ts` (static data)
**Test count**: 12

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `canAccessExperiment` | Free experiment always accessible |
| 2 | `canAccessExperiment` | Non-free experiment blocked for free tier |
| 3 | `canAccessExperiment` | Non-free experiment accessible for pro tier |
| 4 | `canAccessExperiment` | Non-free experiment accessible for max tier |
| 5 | `canAccessTier` | pro >= pro |
| 6 | `canAccessTier` | free < pro |
| 7 | `subscriptionToTier` | null returns "free" |
| 8 | `subscriptionToTier` | "pro_monthly" returns "pro" |
| 9 | `subscriptionToTier` | "max_yearly" returns "max" |
| 10 | `subscriptionToTier` | "enterprise" returns "max" |
| 11 | `getAccessibleExperiments` | Free tier gets only free experiments |
| 12 | `getAccessibleExperiments` | Filters by subject and gradeLevel |

### T1-14: experiments/registry.ts

**Source**: `src/shared/lib/experiments/registry.ts`
**Test file**: `tests/unit/experiment-registry.test.ts`
**Priority**: 2
**Dependencies**: Static data modules
**Test count**: 8

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getAllExperiments` | Returns non-empty array |
| 2 | `getAllExperiments` | All experiments have required fields (id, slug, title, subject, gradeLevel) |
| 3 | `getExperiment` | Returns experiment by id |
| 4 | `getExperiment` | Returns undefined for unknown id |
| 5 | `getExperimentBySlug` | Returns experiment by slug |
| 6 | `getExperimentsByCategory` | Filters by category |
| 7 | `getExperimentsBySubject` | Filters by subject |
| 8 | `getExperimentsByGradeLevel` | Filters by grade level |

### T1-15: experiments/html-map.ts

**Source**: `src/shared/lib/experiments/html-map.ts`
**Test file**: `tests/unit/experiment-html-map.test.ts`
**Priority**: 3
**Dependencies**: None
**Test count**: 4

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getExperimentHtmlPath` | Returns path for known experiment ID |
| 2 | `getExperimentHtmlPath` | Returns null for unknown ID |
| 3 | `EXPERIMENT_HTML_MAP` | All values are valid path strings starting with "/" |
| 4 | `EXPERIMENT_HTML_MAP` | All keys match experiment IDs from registry |

### T1-16: physics/ (mechanics, projectile, energy, waves)

**Source**: `src/shared/lib/physics/*.ts`
**Test file**: `tests/unit/physics-engine.test.ts`
**Priority**: 1
**Dependencies**: None (pure math)
**Test count**: 30

**mechanics.ts:**

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `calculateAcceleration` | F=10, m=2 returns 5 |
| 2 | `calculateAcceleration` | Mass 0 returns 0 |
| 3 | `calculateAcceleration` | NaN input returns 0 |
| 4 | `calculateVelocity` | v0=0, a=10, dt=2 returns 20 |
| 5 | `calculateDisplacement` | s0=0, v=5, dt=3 returns 15 |
| 6 | `calculateKineticEnergy` | m=2, v=3 returns 9 |
| 7 | `calculateKineticEnergy` | Negative mass returns 0 |
| 8 | `calculatePotentialEnergy` | m=1, g=9.8, h=10 returns 98 |
| 9 | `calculateMomentum` | m=5, v=4 returns 20 |

**projectile.ts:**

| # | Function | Test Scenario |
|---|----------|--------------|
| 10 | `calculateProjectilePosition` | Known angle/velocity/time |
| 11 | `calculateProjectilePosition` | y clamped to 0 (no underground) |
| 12 | `calculateProjectilePosition` | v0=0 returns origin |
| 13 | `calculateProjectileVelocity` | Correct vx/vy components |
| 14 | `calculateMaxHeight` | 45 degree angle |
| 15 | `calculateRange` | 45 degree optimal range |
| 16 | `calculateFlightTime` | Correct total time |

**energy.ts:**

| # | Function | Test Scenario |
|---|----------|--------------|
| 17 | `calculateTotalEnergy` | KE + PE sum |
| 18 | `calculateVelocityFromEnergy` | Derives velocity correctly |
| 19 | `calculateVelocityFromEnergy` | Returns 0 when KE would be negative |
| 20 | `calculateHeightFromEnergy` | Derives height correctly |
| 21 | `simulateRollerCoasterPoint` | Energy conservation maintained |
| 22 | `simulateRollerCoasterPoint` | Returns zero struct for invalid inputs |

**waves.ts:**

| # | Function | Test Scenario |
|---|----------|--------------|
| 23 | `calculateFrequency` | f = c / wavelength |
| 24 | `calculateFrequency` | wavelength=0 returns 0 |
| 25 | `calculateWavelength` | Inverse of frequency |
| 26 | `calculatePhotonEnergy` | E = hf |
| 27 | `calculatePhotonEnergyEv` | Correct eV conversion |
| 28 | `getWaveBandName` | Visible light range (380-700nm) |
| 29 | `getWaveBandName` | Radio waves (> 1m) |
| 30 | `getWaveBandName` | Invalid input returns "Unknown" |

### T1-17: quest/scoring.ts

**Source**: `src/shared/lib/quest/scoring.ts`
**Test file**: `tests/unit/quest-scoring.test.ts`
**Priority**: 1
**Dependencies**: None (pure logic)
**Test count**: 18

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `scoreStep` | knowledge: auto full points |
| 2 | `scoreStep` | predict/numeric: within tolerance = full points |
| 3 | `scoreStep` | predict/numeric: outside tolerance = partial credit |
| 4 | `scoreStep` | predict/numeric: invalid number = 0 |
| 5 | `scoreStep` | predict/multiple_choice: correct index = full |
| 6 | `scoreStep` | predict/multiple_choice: wrong index = 0 |
| 7 | `scoreStep` | predict/open_ended: auto full points |
| 8 | `scoreStep` | predict: no response = 0 |
| 9 | `scoreStep` | experiment: auto full points |
| 10 | `scoreStep` | compare: deviation < 10% = full |
| 11 | `scoreStep` | compare: deviation 10-25% = 70% |
| 12 | `scoreStep` | compare: deviation 25-50% = 40% |
| 13 | `scoreStep` | compare: deviation > 50% = 20% |
| 14 | `scoreStep` | compare: no response = 20% (participation) |
| 15 | `scoreStep` | compare: invalid JSON = 20% (participation) |
| 16 | `scoreStep` | explain/multiple_choice: correct = full |
| 17 | `scoreStep` | explain/free_text: auto full |
| 18 | `scoreStep` | unknown step type: score 0 |

### T1-18: hash.ts

**Source**: `src/shared/lib/hash.ts`
**Test file**: `tests/unit/hash.test.ts`
**Priority**: 3
**Dependencies**: `uuid`, `simple-flakeid`
**Test count**: 6

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getUuid` | Returns valid UUID v4 format |
| 2 | `getUuid` | Two calls return different values |
| 3 | `getUniSeq` | Returns string with prefix |
| 4 | `getUniSeq` | Empty prefix works |
| 5 | `getNonceStr` | Returns string of requested length |
| 6 | `getSnowId` | Returns numeric-like string |

### T1-19: time.ts

**Source**: `src/shared/lib/time.ts`
**Test file**: `tests/unit/time.test.ts`
**Priority**: 3
**Dependencies**: None
**Test count**: 4

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getIsoTimestr` | Returns ISO 8601 format |
| 2 | `getTimestamp` | Returns number (seconds since epoch) |
| 3 | `getMillisecond` | Returns number > getTimestamp * 1000 (approx) |
| 4 | `getOneYearLaterTimestr` | Year is current + 1 |

### T1-20: seo/json-ld.ts

**Source**: `src/shared/lib/seo/json-ld.ts`
**Test file**: `tests/unit/json-ld.test.ts` (exists, needs expansion)
**Priority**: 2
**Dependencies**: None (pure data transform)
**Test count**: 8

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `buildExperimentJsonLd` | Returns @type "LearningResource" |
| 2 | `buildExperimentJsonLd` | URL constructed correctly |
| 3 | `buildExperimentJsonLd` | Free tier: isAccessibleForFree = true |
| 4 | `buildExperimentJsonLd` | Pro tier: isAccessibleForFree = false |
| 5 | `buildExperimentJsonLd` | Difficulty mapping (beginner/intermediate/advanced) |
| 6 | `buildWebsiteJsonLd` | Returns @type "WebSite" |
| 7 | `buildLearningPathJsonLd` | Returns @type "Course" |
| 8 | `buildLearningPathJsonLd` | URL includes locale |

### T1-21: performance/adaptive-renderer.ts

**Source**: `src/shared/lib/performance/adaptive-renderer.ts`
**Test file**: `tests/unit/adaptive-renderer.test.ts`
**Priority**: 3
**Dependencies**: None
**Test count**: 6

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getRenderConfig` | "high" tier: antialias true, shadows true |
| 2 | `getRenderConfig` | "low" tier: antialias false, shadows false |
| 3 | `generateRendererCode` | Returns non-empty string with WebGLRenderer |
| 4 | `generateGeometryCode` | sphere type returns SphereGeometry |
| 5 | `generateGeometryCode` | Low tier reduces segment count |
| 6 | `generateFPSMonitorCode` | Returns string with FPS counter logic |

### T1-22: performance/performance-template.ts

**Source**: `src/shared/lib/performance/performance-template.ts`
**Test file**: `tests/unit/performance-template.test.ts`
**Priority**: 3
**Dependencies**: None
**Test count**: 7

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `injectPerformanceCode` | Injects performance detection into HTML with `<body>` |
| 2 | `injectPerformanceCode` | Returns unchanged HTML if no `<body>` tag |
| 3 | `injectPerformanceUI` | Injects performance control UI |
| 4 | `injectMobileOptimization` | Injects touch optimization code |
| 5 | `generatePerformanceDetectionCode` | Returns non-empty string |
| 6 | `generatePerformanceControlUI` | Returns non-empty string |
| 7 | `generateCompletePerformanceTemplate` | Combines all templates |

### T1-23: experiments/subjects.ts

**Source**: `src/shared/lib/experiments/subjects.ts`
**Test file**: `tests/unit/subjects.test.ts`
**Priority**: 3
**Dependencies**: None
**Test count**: 3

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `SUBJECTS` | Has all 5 subjects (physics, chemistry, biology, earth-science, math) |
| 2 | `SUBJECTS` | Each subject has label, labelZh, dataAttr, icon |
| 3 | `SUBJECT_LIST` | Length matches SUBJECTS keys |

### T1-24: utils.ts

**Source**: `src/shared/lib/utils.ts`
**Test file**: `tests/unit/utils.test.ts`
**Priority**: 3
**Dependencies**: clsx, tailwind-merge
**Test count**: 3

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `cn` | Merges class names |
| 2 | `cn` | Handles conditional classes |
| 3 | `cn` | Deduplicates Tailwind classes |

### T1 Summary

| Priority | Files | Tests |
|----------|-------|-------|
| P1 | resp, content-moderator, quota, access, physics, scoring | 62 |
| P2 | html-sanitizers, quality-checker, validators, disciplines, json-ld, system-prompt | 43 |
| P3 | constants, hash, time, html-map, renderer, performance, subjects, utils | 23 |
| **Total** | **24 files** | **~128** |

## 3. Phase T2: Model Layer (Mock DB)

All model files import `db()` from `@/core/db` and use Drizzle ORM. Mock strategy: `vi.mock('@/core/db')` returning a mock db object with chainable methods.

### Mock Setup

```typescript
// tests/helpers/mock-db.ts
import { vi } from 'vitest';

export function createMockDb() {
  const chain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
  };
  return vi.fn(() => chain);
}
```

### T2-01: credit.ts

**Source**: `src/shared/models/credit.ts` (405 lines)
**Test file**: `tests/unit/models/credit.test.ts`
**Priority**: 1
**Dependencies**: Mock `@/core/db`, mock schema
**Test count**: 14

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `calculateCreditExpirationTime` | Monthly subscription: 30 days from now (pure, no mock) |
| 2 | `calculateCreditExpirationTime` | Yearly subscription: 365 days from now (pure, no mock) |
| 3 | `createExpirationCondition` | Returns valid SQL condition (pure, no mock) |
| 4 | `createCredit` | Inserts and returns credit record |
| 5 | `getCredits` | Paginates with limit/offset |
| 6 | `getCreditsCount` | Returns count |
| 7 | `consumeCredits` | Deducts from available credits |
| 8 | `consumeCredits` | Returns error when insufficient credits |
| 9 | `getRemainingCredits` | Sums available credits |
| 10 | `getRemainingCredits` | Returns 0 for new user |
| 11 | `grantCreditsForNewUser` | Creates initial credit record |
| 12 | `refundCredits` | Creates refund credit record |
| 13 | `refundCredits` | Refund amount matches original |
| 14 | `consumeCredits` | Skips expired credits |

### T2-02: order.ts

**Source**: `src/shared/models/order.ts` (368 lines)
**Test file**: `tests/unit/models/order.test.ts`
**Priority**: 1
**Dependencies**: Mock `@/core/db`
**Test count**: 10

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `createOrder` | Inserts with generated fields |
| 2 | `findOrderById` | Returns order by ID |
| 3 | `findOrderByOrderNo` | Returns order by orderNo |
| 4 | `findOrderByOrderNo` | Returns undefined for unknown |
| 5 | `updateOrderByOrderNo` | Updates specified fields |
| 6 | `updateOrderByOrderId` | Updates by ID |
| 7 | `getOrders` | Paginates correctly |
| 8 | `getOrdersCount` | Returns count |
| 9 | `updateOrderInTransaction` | Transaction commit path |
| 10 | `updateSubscriptionInTransaction` | Transaction commit path |

### T2-03: subscription.ts

**Source**: `src/shared/models/subscription.ts` (195 lines)
**Test file**: `tests/unit/models/subscription.test.ts`
**Priority**: 1
**Dependencies**: Mock `@/core/db`
**Test count**: 9

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `createSubscription` | Inserts new subscription |
| 2 | `updateSubscriptionBySubscriptionNo` | Updates fields |
| 3 | `updateSubscriptionById` | Updates by ID |
| 4 | `findSubscriptionById` | Returns by ID |
| 5 | `findSubscriptionBySubscriptionNo` | Returns by subscriptionNo |
| 6 | `findSubscriptionByProviderSubscriptionId` | Returns by provider+subId |
| 7 | `getCurrentSubscription` | Returns active subscription for user |
| 8 | `getCurrentSubscription` | Returns undefined when no active sub |
| 9 | `getSubscriptions` | Pagination and count |

### T2-04: upg_generation.ts

**Source**: `src/shared/models/upg_generation.ts` (396 lines)
**Test file**: `tests/unit/models/upg-generation.test.ts`
**Priority**: 1
**Dependencies**: Mock `@/core/db`
**Test count**: 16

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `createUpgGeneration` | Inserts generation record |
| 2 | `updateUpgGeneration` | Updates by ID |
| 3 | `findUpgGenerationById` | Returns by ID |
| 4 | `findUpgGenerationById` | Returns undefined for unknown |
| 5 | `getUpgGenerationsByUserId` | Returns user's generations |
| 6 | `getUpgGenerationsCount` | Returns count |
| 7 | `softDeleteUpgGeneration` | Sets deletedAt |
| 8 | `incrementViewCount` | Increments view counter |
| 9 | `getGalleryList` | Filters public, non-deleted |
| 10 | `getGalleryDetail` | Returns with user info |
| 11 | `getPopularTags` | Returns tag aggregation |
| 12 | `togglePublish` | Toggles isPublic flag |
| 13 | `forkGeneration` | Creates new record with parentId |
| 14 | `getRecentGenerationsByUserId` | Returns recent N |
| 15 | `getVersionChain` | Returns parent-child chain |
| 16 | `getMonthlyGenerationCount` | Returns count for current month |

### T2-05: upg_daily_quota.ts

**Source**: `src/shared/models/upg_daily_quota.ts` (106 lines)
**Test file**: `tests/unit/models/upg-daily-quota.test.ts`
**Priority**: 1
**Dependencies**: Mock `@/core/db`
**Test count**: 5

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getOrCreateDailyQuota` | Creates new quota for new day |
| 2 | `getOrCreateDailyQuota` | Returns existing quota |
| 3 | `incrementDailyQuota` | Increments count |
| 4 | `getDailyQuotaCount` | Returns current count |
| 5 | `getDailyQuotaCount` | Returns 0 for no record |

### T2-06: content_moderation.ts

**Source**: `src/shared/models/content_moderation.ts` (111 lines)
**Test file**: `tests/unit/models/content-moderation.test.ts`
**Priority**: 2
**Dependencies**: Mock `@/core/db`
**Test count**: 6

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `createModerationRecord` | Inserts with generated ID |
| 2 | `getModerationRecordsByGenerationId` | Returns records for generation |
| 3 | `getPendingModerationRecords` | Filters by pending status |
| 4 | `updateModerationRecord` | Updates status |
| 5 | `getModerationStats` | Returns aggregated stats |
| 6 | `getModerationRecordById` | Returns by ID |

### T2-07: user.ts & user_credits.ts

**Source**: `src/shared/models/user.ts` (112 lines), `src/shared/models/user_credits.ts` (234 lines)
**Test file**: `tests/unit/models/user.test.ts`
**Priority**: 1
**Dependencies**: Mock `@/core/db`, mock auth
**Test count**: 14

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `findUserById` | Returns user |
| 2 | `updateUser` | Updates specified fields |
| 3 | `getUsers` | Pagination |
| 4 | `getUsersCount` | Count with email filter |
| 5 | `getUserByUserIds` | Batch lookup |
| 6 | `getOrCreateUserCredits` | Creates for new user |
| 7 | `getOrCreateUserCredits` | Returns existing for known user |
| 8 | `getUserCreditsBalance` | Returns balance breakdown |
| 9 | `addUserCredits` | Adds credits |
| 10 | `spendUserCredits` | Deducts credits |
| 11 | `spendUserCredits` | Fails on insufficient |
| 12 | `refundUserCredits` | Refunds credits |
| 13 | `resetUserCredits` | Resets to 0 |
| 14 | `appendUserToResult` | Merges user data into result object |

### T2-08: achievement.ts

**Source**: `src/shared/models/achievement.ts` (199 lines)
**Test file**: `tests/unit/models/achievement.test.ts`
**Priority**: 2
**Dependencies**: Mock `@/core/db`
**Test count**: 7

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `createAchievement` | Inserts with generated UUID |
| 2 | `getActiveAchievements` | Filters active only |
| 3 | `findAchievementBySlug` | Returns by slug |
| 4 | `getUserAchievements` | Returns user's achievements |
| 5 | `unlockAchievement` | Creates unlock record |
| 6 | `unlockAchievement` | Returns existing if already unlocked |
| 7 | `checkAndUnlockAchievements` | Evaluates criteria and unlocks |

### T2-09: learning_path.ts

**Source**: `src/shared/models/learning_path.ts` (415 lines)
**Test file**: `tests/unit/models/learning-path.test.ts`
**Priority**: 2
**Dependencies**: Mock `@/core/db`
**Test count**: 12

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `createLearningPath` | Inserts path |
| 2 | `findLearningPathById` | Returns by ID |
| 3 | `getPublishedPaths` | Filters published paths |
| 4 | `createNode` | Inserts node |
| 5 | `getNodesByPathId` | Returns ordered nodes |
| 6 | `deleteNodeWithReorder` | Deletes and reorders |
| 7 | `getUserProgressForPath` | Returns progress |
| 8 | `upsertProgress` | Creates or updates progress |
| 9 | `advanceProgress` | Moves to next node |
| 10 | `checkNodeAccess` | Validates sequential access |
| 11 | `getOrCreateProgress` | Idempotent creation |
| 12 | `getUserCompletedPathCount` | Returns count |

### T2-10: remaining models (audit_log, chat, quest, etc.)

**Source**: Various model files
**Test file**: `tests/unit/models/remaining-models.test.ts`
**Priority**: 3
**Dependencies**: Mock `@/core/db`
**Test count**: 37

Files and function counts:

| Model File | Functions | Tests |
|------------|-----------|-------|
| `audit_log.ts` | createAuditLog, queryAuditLogs, getUserAuditLogs, getResourceAuditLogs, countAuditLogsByAction | 5 |
| `chat.ts` + `chat_message.ts` | CRUD operations | 5 |
| `quest.ts` + `quest_step.ts` + `quest_attempt.ts` + `quest_step_response.ts` | CRUD + getActiveAttempt, completeAttempt, getBestAttempt | 8 |
| `config.ts` | saveConfigs, addConfig, getAllConfigs, getPublicConfigs | 4 |
| `daily_usage.ts` | getDailyUsage, upsertDailyUsage, getTotalUsedSeconds | 3 |
| `experiment_progress.ts` | getExperimentProgress, upsertExperimentProgress | 3 |
| `lab_notebook.ts` + versions + export | CRUD + softDelete, getMonthlyCount | 5 |
| `learning_stats.ts` | getOrCreate, incrementUpgGenerated, addStudyTime, updateStreak | 4 |

### T2 Summary

| Priority | Files | Tests |
|----------|-------|-------|
| P1 | credit, order, subscription, upg_generation, upg_daily_quota, user + user_credits | 68 |
| P2 | content_moderation, achievement, learning_path | 25 |
| P3 | remaining models (audit, chat, quest, config, daily_usage, etc.) | 37 |
| **Total** | **~20 source files** | **~130** |

## 4. Phase T3: Service Layer (Mock Models)

Services orchestrate models and external providers. Mock strategy: `vi.mock('@/shared/models/*')` and `vi.mock('@/extensions/*')`.

### T3-01: payment.ts

**Source**: `src/shared/services/payment.ts` (568 lines)
**Test file**: `tests/unit/services/payment.test.ts`
**Priority**: 1
**Dependencies**: Mock models (order, subscription, credit), mock payment extensions
**Test count**: 18

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getPaymentServiceWithConfigs` | Creates manager with Stripe when configured |
| 2 | `getPaymentServiceWithConfigs` | Creates manager with Creem when configured |
| 3 | `getPaymentServiceWithConfigs` | Handles missing configs gracefully |
| 4 | `getPaymentServiceWithConfigs` | Parses stripe_payment_methods JSON string |
| 5 | `getPaymentService` | Returns cached service instance |
| 6 | `handleCheckoutSuccess` | Creates order and deducts credits |
| 7 | `handleCheckoutSuccess` | Handles one-time payment |
| 8 | `handleCheckoutSuccess` | Handles subscription creation |
| 9 | `handlePaymentSuccess` | Updates order status to paid |
| 10 | `handlePaymentSuccess` | Grants credits on successful payment |
| 11 | `handlePaymentSuccess` | Skips already-processed orders |
| 12 | `handleSubscriptionRenewal` | Extends subscription period |
| 13 | `handleSubscriptionRenewal` | Grants renewal credits |
| 14 | `handleSubscriptionUpdated` | Updates plan details |
| 15 | `handleSubscriptionCanceled` | Sets subscription to canceled status |
| 16 | `handleSubscriptionCanceled` | Preserves access until period end |
| 17 | `handleCheckoutSuccess` | Rolls back on partial failure |
| 18 | `handlePaymentSuccess` | Handles duplicate webhook idempotently |

### T3-02: rbac.ts

**Source**: `src/shared/services/rbac.ts` (421 lines)
**Test file**: `tests/unit/services/rbac.test.ts`
**Priority**: 1
**Dependencies**: Mock `@/core/db`, mock schema
**Test count**: 20

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getRoles` | Returns active roles |
| 2 | `getRoleById` | Returns by ID |
| 3 | `createRole` | Inserts role |
| 4 | `updateRole` | Updates role fields |
| 5 | `deleteRole` | Soft deletes (sets DELETED status) |
| 6 | `getPermissions` | Returns all permissions |
| 7 | `getPermissionByCode` | Returns by code |
| 8 | `createPermission` | Inserts permission |
| 9 | `assignPermissionToRole` | Creates role-permission link |
| 10 | `removePermissionFromRole` | Deletes role-permission link |
| 11 | `getUserRoles` | Returns roles for user |
| 12 | `getUserPermissions` | Returns flattened permissions |
| 13 | `hasPermission` | Returns true when user has permission |
| 14 | `hasPermission` | Returns false when user lacks permission |
| 15 | `hasAnyPermission` | Any match returns true |
| 16 | `hasAllPermissions` | All must match |
| 17 | `hasRole` | Checks user role membership |
| 18 | `assignRoleToUser` | Creates user-role link |
| 19 | `removeRoleFromUser` | Deletes user-role link |
| 20 | `getUsersByRole` | Returns user IDs for a role |

### T3-03: ai.ts, storage.ts, email.ts, analytics.ts, ads.ts, affiliate.ts

**Source**: Various service files
**Test file**: `tests/unit/services/provider-services.test.ts`
**Priority**: 2
**Dependencies**: Mock `@/extensions/*`, mock config model
**Test count**: 12

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `getAIManagerWithConfigs` | Creates providers from config |
| 2 | `getAIManagerWithConfigs` | Skips providers with missing keys |
| 3 | `getStorageServiceWithConfigs` | Creates R2 provider |
| 4 | `getStorageServiceWithConfigs` | Creates S3 provider |
| 5 | `getEmailServiceWithConfigs` | Creates Resend provider |
| 6 | `getAnalyticsManagerWithConfigs` | Creates GA + Plausible providers |
| 7 | `getAdsManagerWithConfigs` | Creates AdSense provider |
| 8 | `getAffiliateManagerWithConfigs` | Creates Affonso provider |
| 9 | `getAffiliateManagerWithConfigs` | Creates PromoteKit provider |
| 10 | `getCustomerServiceWithConfigs` | Creates Crisp provider |
| 11 | `getCustomerServiceWithConfigs` | Creates Tawk provider |
| 12 | All `get*Service` | Returns cached singleton |

### T3-04: progress-service.ts

**Source**: `src/shared/lib/usage/progress-service.ts`
**Test file**: `tests/unit/services/progress-service.test.ts`
**Priority**: 1
**Dependencies**: Mock daily_usage model, mock experiment_progress model, mock quota helpers
**Test count**: 12

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `trackUsage` | Normalizes seconds and upserts |
| 2 | `trackUsage` | Skips upsert when normalized = 0 |
| 3 | `trackUsage` | Syncs to experimentProgress for logged-in users |
| 4 | `trackUsage` | Does not sync for session-based users |
| 5 | `trackUsage` | Returns correct QuotaSnapshot |
| 6 | `getQuota` | Returns snapshot for free tier |
| 7 | `getQuota` | Returns snapshot for pro tier |
| 8 | `getProgress` | Returns snapshot for existing progress |
| 9 | `getProgress` | Returns empty snapshot for new user |
| 10 | `updateProgress` | Updates completed challenges |
| 11 | `updateProgress` | Updates last parameters |
| 12 | `rowToSnapshot` | Handles null row |

### T3-05: generate-core.ts

**Source**: `src/shared/lib/upg/generate-core.ts`
**Test file**: `tests/unit/services/generate-core.test.ts`
**Priority**: 1
**Dependencies**: Mock anthropic-client, mock openrouter-client, mock models, mock content-moderator, mock quality-checker, mock performance-template
**Test count**: 12

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `generateCore` | Successful generation path: returns completed + htmlContent |
| 2 | `generateCore` | Input moderation reject: returns failed |
| 3 | `generateCore` | Input moderation pending: creates record, continues |
| 4 | `generateCore` | Quality check failure: returns failed |
| 5 | `generateCore` | Output moderation reject: returns failed |
| 6 | `generateCore` | Uses Anthropic when baseUrl contains "anthropic" |
| 7 | `generateCore` | Uses OpenRouter as fallback |
| 8 | `generateCore` | Injects performance code into HTML |
| 9 | `generateCore` | Stores validation score as metadata |
| 10 | `generateCore` | Uses existingGenerationId when provided (fork path) |
| 11 | `generateCore` | Merges extraFields into generation record |
| 12 | `generateCore` | Handles validation crash silently |

### T3-06: refine-core.ts

**Source**: `src/shared/lib/upg/refine-core.ts`
**Test file**: `tests/unit/services/refine-core.test.ts`
**Priority**: 2
**Dependencies**: Same as generate-core + mock findUpgGenerationById
**Test count**: 8

| # | Function | Test Scenario |
|---|----------|--------------|
| 1 | `refineCore` | Successful refinement: increments version |
| 2 | `refineCore` | Original not found: returns failed |
| 3 | `refineCore` | Original not completed: returns failed |
| 4 | `refineCore` | Input moderation reject on refinement prompt |
| 5 | `refineCore` | Quality check failure on refined HTML |
| 6 | `refineCore` | Output moderation reject |
| 7 | `refineCore` | parentId set to original generationId |
| 8 | `refineCore` | Truncates original HTML when too large |

### T3 Summary

| Priority | Files | Tests |
|----------|-------|-------|
| P1 | payment, rbac, progress-service, generate-core | 62 |
| P2 | provider services, refine-core | 20 |
| **Total** | **~10 source files** | **~82** |

## 5. Phase T4: API Routes (Mock Services)

Next.js App Router route handlers. Test strategy: import the route handler function and call it with mocked `NextRequest`.

### Test Setup

```typescript
// tests/helpers/mock-request.ts
export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
}) {
  return new Request(options.url ?? 'http://localhost:3000/api/test', {
    method: options.method ?? 'GET',
    headers: new Headers(options.headers ?? {}),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}
```

### T4-01: upg/generate/route.ts

**Source**: `src/app/api/upg/generate/route.ts`
**Test file**: `tests/unit/routes/upg-generate.test.ts`
**Priority**: 1
**Dependencies**: Mock auth, mock generateCore, mock quota, mock credits
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | Unauthenticated request returns 401 |
| 2 | Missing prompt returns 400 |
| 3 | Rate limit exceeded returns 429 |
| 4 | Daily quota exceeded returns 429 |
| 5 | Insufficient credits returns 402 |
| 6 | Successful generation returns 200 with id + htmlContent |
| 7 | Deducts credits on success |
| 8 | Increments daily quota on success |

### T4-02: upg/[id]/route.ts, upg/[id]/refine/route.ts, upg/[id]/report/route.ts

**Source**: UPG detail routes
**Test file**: `tests/unit/routes/upg-detail.test.ts`
**Priority**: 1
**Dependencies**: Mock auth, mock models
**Test count**: 10

| # | Test Scenario |
|---|--------------|
| 1 | GET upg/[id]: returns generation detail |
| 2 | GET upg/[id]: 404 for unknown ID |
| 3 | DELETE upg/[id]: soft-deletes own generation |
| 4 | DELETE upg/[id]: 403 for other user's generation |
| 5 | POST upg/[id]/refine: successful refinement |
| 6 | POST upg/[id]/refine: 401 unauthenticated |
| 7 | POST upg/[id]/refine: 404 original not found |
| 8 | POST upg/[id]/report: creates report |
| 9 | POST upg/[id]/report: rate limits duplicate reports |
| 10 | GET upg/[id]/versions: returns version chain |

### T4-03: payment/checkout/route.ts, payment/notify/[provider]/route.ts, payment/callback/route.ts

**Source**: Payment routes
**Test file**: `tests/unit/routes/payment.test.ts`
**Priority**: 1
**Dependencies**: Mock payment service, mock auth
**Test count**: 10

| # | Test Scenario |
|---|--------------|
| 1 | POST checkout: creates checkout session |
| 2 | POST checkout: 401 unauthenticated |
| 3 | POST checkout: 400 missing required fields |
| 4 | POST notify/stripe: processes webhook |
| 5 | POST notify/stripe: validates signature |
| 6 | POST notify/stripe: 400 invalid signature |
| 7 | POST notify/stripe: handles checkout.session.completed |
| 8 | POST notify/stripe: handles invoice.payment_succeeded |
| 9 | POST notify/stripe: handles customer.subscription.deleted |
| 10 | GET callback: redirects to success/failure page |

### T4-04: compliance routes (age-gate, consent)

**Source**: `src/app/api/compliance/age-gate/route.ts`, `src/app/api/compliance/consent/route.ts`
**Test file**: `tests/unit/routes/compliance.test.ts`
**Priority**: 1
**Dependencies**: Mock models
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | POST age-gate: valid age passes |
| 2 | POST age-gate: underage blocked |
| 3 | POST age-gate: missing birthDate returns 400 |
| 4 | POST consent: records consent event |
| 5 | POST consent: 400 missing required fields |
| 6 | GET consent: returns user's consent status |
| 7 | POST consent: updates existing consent |
| 8 | POST consent: validates consent categories |

### T4-05: privacy routes (delete, export, status)

**Source**: `src/app/api/privacy/delete/route.ts`, `export/route.ts`, `status/[id]/route.ts`
**Test file**: `tests/unit/routes/privacy.test.ts`
**Priority**: 1
**Dependencies**: Mock auth, mock privacy_request model, mock audit_log
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | POST delete: creates deletion request |
| 2 | POST delete: 401 unauthenticated |
| 3 | POST delete: prevents duplicate active requests |
| 4 | POST export: creates export request |
| 5 | POST export: 401 unauthenticated |
| 6 | GET status/[id]: returns request status |
| 7 | GET status/[id]: 404 for unknown request |
| 8 | GET status/[id]: 403 for other user's request |

### T4-06: gallery routes

**Source**: `src/app/api/gallery/route.ts`, `[id]/route.ts`, `[id]/like/route.ts`, `[id]/fork/route.ts`, `publish/route.ts`, `tags/route.ts`
**Test file**: `tests/unit/routes/gallery.test.ts`
**Priority**: 2
**Dependencies**: Mock models (upg_generation, upg_like, upg_tag)
**Test count**: 12

| # | Test Scenario |
|---|--------------|
| 1 | GET gallery: returns paginated public list |
| 2 | GET gallery: filters by tag |
| 3 | GET gallery/[id]: returns detail |
| 4 | GET gallery/[id]: 404 for private/deleted |
| 5 | POST gallery/[id]/like: toggles like |
| 6 | POST gallery/[id]/like: 401 unauthenticated |
| 7 | POST gallery/[id]/fork: creates forked generation |
| 8 | POST gallery/[id]/fork: 401 unauthenticated |
| 9 | POST gallery/[id]/fork: deducts credits |
| 10 | POST gallery/publish: toggles publish status |
| 11 | POST gallery/publish: 403 non-owner |
| 12 | GET gallery/tags: returns popular tags |

### T4-07: experiments/[id]/progress/route.ts

**Source**: `src/app/api/experiments/[id]/progress/route.ts`
**Test file**: `tests/unit/routes/experiment-progress.test.ts`
**Priority**: 2
**Dependencies**: Mock progress-service
**Test count**: 6

| # | Test Scenario |
|---|--------------|
| 1 | POST: tracks usage and returns quota |
| 2 | POST: handles session-based tracking |
| 3 | POST: handles user-based tracking |
| 4 | GET: returns current quota |
| 5 | PUT: updates progress challenges |
| 6 | POST: normalizes invalid seconds |

### T4-08: moderation routes

**Source**: `src/app/api/moderation/check-input/route.ts`, `check-output/route.ts`
**Test file**: `tests/unit/routes/moderation.test.ts`
**Priority**: 2
**Dependencies**: Mock content-moderator
**Test count**: 6

| # | Test Scenario |
|---|--------------|
| 1 | POST check-input: passes clean input |
| 2 | POST check-input: rejects dangerous input |
| 3 | POST check-input: 400 missing body |
| 4 | POST check-output: passes clean HTML |
| 5 | POST check-output: rejects unsafe HTML |
| 6 | POST check-output: 400 missing body |

### T4-09: remaining API routes

**Source**: Various API route files
**Test file**: `tests/unit/routes/remaining-routes.test.ts`
**Priority**: 3
**Dependencies**: Various mocks
**Test count**: 22

| Route Group | Tests |
|-------------|-------|
| `chat/*` (new, list, messages, info) | 5 |
| `notebooks/*` (CRUD, versions, export, AI prefill/suggest) | 6 |
| `quest/*` (list, detail, start, submit, complete, achievements, weekly) | 6 |
| `learning-paths/*` (list, detail, nodes, submit) | 5 |

### T4 Summary

| Priority | Files | Tests |
|----------|-------|-------|
| P1 | upg-generate, upg-detail, payment, compliance, privacy | 44 |
| P2 | gallery, experiment-progress, moderation | 24 |
| P3 | remaining routes | 22 |
| **Total** | **~25 route files** | **~90** |

## 6. Phase T5: Integration Tests (Test DB)

End-to-end model+service flows using a real test database (SQLite in-memory or Postgres test container).

### Infrastructure

```typescript
// tests/integration/setup.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

let testDb: ReturnType<typeof drizzle>;

beforeAll(async () => {
  const sqlite = new Database(':memory:');
  testDb = drizzle(sqlite);
  await migrate(testDb, { migrationsFolder: './drizzle' });
  // Override db() to return testDb
  vi.mock('@/core/db', () => ({ db: () => testDb }));
});

afterEach(async () => {
  // Clean tables between tests
});
```

### T5-01: Credit lifecycle

**Test file**: `tests/integration/credit-lifecycle.test.ts`
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | Grant credits to new user, verify balance |
| 2 | Spend credits, verify deduction |
| 3 | Spend more than available: error |
| 4 | Refund credits, verify balance restored |
| 5 | Expired credits excluded from balance |
| 6 | Multiple credit sources consumed in order |
| 7 | Concurrent spend requests handled correctly |
| 8 | Full purchase flow: order -> payment -> credits |

### T5-02: UPG generation lifecycle

**Test file**: `tests/integration/upg-lifecycle.test.ts`
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | Generate -> store -> retrieve |
| 2 | Generate -> publish -> appear in gallery |
| 3 | Generate -> soft delete -> hidden from list |
| 4 | Generate -> refine -> version chain intact |
| 5 | Generate -> fork -> parentId set |
| 6 | Daily quota increment and reset |
| 7 | Monthly generation count accurate |
| 8 | Like -> unlike -> toggle behavior |

### T5-03: Quest completion flow

**Test file**: `tests/integration/quest-flow.test.ts`
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | Start quest attempt |
| 2 | Submit step responses (predict, experiment, explain) |
| 3 | Complete quest, calculate total score |
| 4 | Best attempt tracked correctly |
| 5 | Achievement unlocked on completion |
| 6 | Learning stats updated |
| 7 | Multiple attempts: best score preserved |
| 8 | Weekly challenge special handling |

### T5-04: Subscription + RBAC flow

**Test file**: `tests/integration/subscription-rbac.test.ts`
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | Create subscription -> user gets pro role |
| 2 | Cancel subscription -> role downgraded |
| 3 | Pro user accesses pro-tier experiment |
| 4 | Free user blocked from pro experiment |
| 5 | Admin role has all permissions |
| 6 | Editor role has subset of permissions |
| 7 | Role assignment and removal |
| 8 | Permission check for moderation |

### T5-05: Learning path progress

**Test file**: `tests/integration/learning-path-progress.test.ts`
**Test count**: 6

| # | Test Scenario |
|---|--------------|
| 1 | Create path with nodes |
| 2 | Start progress at node 0 |
| 3 | Advance through nodes sequentially |
| 4 | Skip ahead blocked (sequential access) |
| 5 | Complete path, increment stats |
| 6 | Multiple users' progress isolated |

### T5-06: Compliance + Privacy

**Test file**: `tests/integration/compliance-privacy.test.ts`
**Test count**: 6

| # | Test Scenario |
|---|--------------|
| 1 | Age gate -> compliance profile created |
| 2 | Consent recorded -> consent event stored |
| 3 | Data export request -> audit logged |
| 4 | Data deletion request -> user data purged |
| 5 | Retention policy: old data cleaned up |
| 6 | Audit log trail complete |

### T5-07: Experiment usage tracking

**Test file**: `tests/integration/experiment-usage.test.ts`
**Test count**: 6

| # | Test Scenario |
|---|--------------|
| 1 | Track usage increments daily total |
| 2 | Free user hits quota limit |
| 3 | Pro user unlimited usage |
| 4 | Progress synced for logged-in users |
| 5 | Session-based tracking for anonymous users |
| 6 | Daily reset works correctly |

### T5 Summary

| Files | Tests |
|-------|-------|
| 7 integration test files | **~50** |

## 7. Phase T6: E2E Tests (Playwright)

### Infrastructure

Already configured in `playwright.config.ts`. Test dir: `tests/e2e/`. Dev server auto-started.

Existing file: `tests/e2e/smoke.spec.ts`.

### T6-01: Auth flow

**Test file**: `tests/e2e/auth.spec.ts`
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | Visit homepage: loads without errors |
| 2 | Sign up with email |
| 3 | Sign in with email |
| 4 | Sign out |
| 5 | Protected page redirects to login when unauthenticated |
| 6 | Dashboard accessible after login |
| 7 | Settings page loads |
| 8 | Profile update works |

### T6-02: Experiment interaction

**Test file**: `tests/e2e/experiments.spec.ts`
**Test count**: 10

| # | Test Scenario |
|---|--------------|
| 1 | Experiments list page loads |
| 2 | Filter by subject works |
| 3 | Filter by grade level works |
| 4 | Free experiment loads HTML simulation |
| 5 | Simulation iframe renders (no blank screen) |
| 6 | Slider interaction changes visualization |
| 7 | Pro experiment shows paywall for free user |
| 8 | Lab notebook opens for experiment |
| 9 | Progress tracking updates |
| 10 | Experiment page has correct meta tags |

### T6-03: UPG generation flow

**Test file**: `tests/e2e/upg-generation.spec.ts`
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | UPG page loads |
| 2 | Enter prompt and submit |
| 3 | Generation shows loading state |
| 4 | Completed generation displays HTML preview |
| 5 | Gallery page lists public generations |
| 6 | Like/unlike toggle works |
| 7 | Refine button opens refinement dialog |
| 8 | Share/download buttons visible |

### T6-04: Payment flow

**Test file**: `tests/e2e/payment.spec.ts`
**Test count**: 6

| # | Test Scenario |
|---|--------------|
| 1 | Pricing page loads with plan options |
| 2 | Free plan features visible |
| 3 | Pro plan checkout button works |
| 4 | Checkout redirects to Stripe (mock/sandbox) |
| 5 | Success callback page loads |
| 6 | User plan reflected in dashboard after payment |

### T6-05: Quest flow

**Test file**: `tests/e2e/quest.spec.ts`
**Test count**: 8

| # | Test Scenario |
|---|--------------|
| 1 | Quest list page loads |
| 2 | Quest detail page shows steps |
| 3 | Knowledge step auto-advances |
| 4 | Predict step accepts input |
| 5 | Experiment step shows simulation |
| 6 | Explain step accepts answer |
| 7 | Completion shows score |
| 8 | Achievements displayed |

### T6-06: Learning paths

**Test file**: `tests/e2e/learning-paths.spec.ts`
**Test count**: 6

| # | Test Scenario |
|---|--------------|
| 1 | Learning paths list loads |
| 2 | Path detail shows nodes |
| 3 | Node navigation works |
| 4 | Progress indicator updates |
| 5 | Node submission works |
| 6 | Path completion congratulation |

### T6-07: Admin panel

**Test file**: `tests/e2e/admin.spec.ts`
**Test count**: 6

| # | Test Scenario |
|---|--------------|
| 1 | Admin login required |
| 2 | Dashboard shows stats |
| 3 | Moderation queue loads |
| 4 | Settings page editable |
| 5 | AP Prep management works |
| 6 | Learning path editor works |

### T6-08: Responsive + accessibility

**Test file**: `tests/e2e/responsive.spec.ts`
**Test count**: 3

| # | Test Scenario |
|---|--------------|
| 1 | Mobile viewport: navigation works |
| 2 | Tablet viewport: layout correct |
| 3 | Key pages pass axe accessibility checks |

### T6 Summary

| Files | Tests |
|-------|-------|
| 8 E2E spec files | **~55** |

## 8. Infrastructure Needs

### 8.1 DB Mock Strategy

**Unit tests (T2-T4)**: Vitest module mocking via `vi.mock('@/core/db')`. Create a reusable `tests/helpers/mock-db.ts` that returns a chainable Drizzle-like mock. Each test configures return values.

**Integration tests (T5)**: Better-SQLite3 in-memory database with Drizzle migrations applied at `beforeAll`. Clean tables in `afterEach`. This validates actual SQL queries without needing Postgres.

### 8.2 API Route Test Setup

Next.js App Router handlers export `GET`/`POST`/`PUT`/`DELETE` async functions that accept `Request` and return `Response`. Test directly:

```typescript
import { POST } from '@/app/api/upg/generate/route';

const req = new Request('http://localhost/api/upg/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'test' }),
  headers: { 'Content-Type': 'application/json' },
});
const res = await POST(req);
const data = await res.json();
expect(data.code).toBe(0);
```

Mock auth via `vi.mock('@/shared/lib/auth')` or similar auth module.

### 8.3 E2E Environment

- Playwright already configured with `pnpm dev --port 4173`
- Test user credentials via `.env.test` (or seed in `globalSetup`)
- Stripe webhook testing via Stripe CLI or mock server
- Screenshot comparison for visual regression (optional, Phase 2)

### 8.4 CI Configuration

Add to `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm vitest run --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps chromium
      - run: pnpm exec playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### 8.5 Test Helper Files to Create

| File | Purpose |
|------|---------|
| `tests/helpers/mock-db.ts` | Reusable Drizzle ORM mock factory |
| `tests/helpers/mock-request.ts` | Request/Response builders for API route tests |
| `tests/helpers/mock-auth.ts` | Auth session mock (logged in / anonymous / admin) |
| `tests/helpers/fixtures.ts` | Shared test data factories (user, order, generation) |
| `tests/integration/setup.ts` | In-memory DB setup for integration tests |

## 9. Coverage Milestones

Coverage applies to `src/shared/` (models, services, lib). API routes in `src/app/` are excluded from v8 coverage by vitest config but functionally tested.

| Phase | Cumulative Tests | Expected Coverage | Key Unlocks |
|-------|-----------------|-------------------|-------------|
| Baseline | 165 | 4.68% | Existing tests |
| After T1 | ~293 | ~25% | All pure functions covered |
| After T2 | ~423 | ~50% | Model layer covered |
| After T3 | ~505 | ~70% | Service orchestration covered |
| After T4 | ~595 | ~80% | API surface tested |
| After T5 | ~645 | ~90% | Real DB flows validated |
| After T6 | ~700 | ~95%+ | User journeys validated |

To reach 100% line coverage, remaining gaps after T5 will be:
- Deeply nested error branches in models/services
- Edge cases in config parsing
- Provider-specific code paths

These will be identified via coverage reports after T5 and filled with targeted supplemental tests.

## 10. Execution Order (Recommended)

```
T1-16 (physics engine)     ← Start here: pure math, instant confidence
T1-17 (quest scoring)      ← Pure logic, high business value
T1-12 (quota)              ← Pure logic, critical path
T1-13 (experiment access)  ← Pure logic, critical path
T1-01 (resp.ts)            ← Trivial, 5 min
T1-02 (content-moderator)  ← Security critical
T1-03 (html-sanitizer)     ← Security critical
T1-04 (enhanced sanitizer) ← Security critical
T1-05 (quality-checker)    ← Core UPG quality gate
T1-06..T1-24              ← Remaining T1

T2-01 (credit)             ← Payment path
T2-02 (order)              ← Payment path
T2-03 (subscription)       ← Payment path
T2-04 (upg_generation)     ← Core feature
T2-05..T2-10              ← Remaining T2

T3-01 (payment service)    ← Revenue path
T3-05 (generate-core)      ← Core feature
T3-02 (rbac)               ← Access control
T3-04 (progress-service)   ← Core feature
T3-03, T3-06              ← Remaining T3

T4-01..T4-09              ← API routes (in priority order)

T5-01..T5-07              ← Integration flows

T6-01..T6-08              ← E2E (run last, most expensive)
```

## 11. File Index

Quick reference of all test files this plan creates:

```
tests/
├── helpers/
│   ├── mock-db.ts
│   ├── mock-request.ts
│   ├── mock-auth.ts
│   └── fixtures.ts
├── unit/
│   ├── resp.test.ts                    (T1-01)
│   ├── content-moderator.test.ts       (T1-02)
│   ├── html-sanitizer.test.ts          (T1-03)
│   ├── html-sanitizer-enhanced.test.ts (T1-04)
│   ├── quality-checker.test.ts         (T1-05)
│   ├── technical-validator.test.ts     (T1-06)
│   ├── physics-validator.test.ts       (T1-07)
│   ├── validation-full.test.ts         (T1-08)
│   ├── disciplines.test.ts            (T1-09)
│   ├── upg-constants.test.ts          (T1-10)
│   ├── system-prompt.test.ts          (T1-11)
│   ├── quota.test.ts                  (T1-12, expand existing)
│   ├── experiment-access.test.ts      (T1-13, expand existing)
│   ├── experiment-registry.test.ts    (T1-14)
│   ├── experiment-html-map.test.ts    (T1-15)
│   ├── physics-engine.test.ts         (T1-16)
│   ├── quest-scoring.test.ts          (T1-17)
│   ├── hash.test.ts                   (T1-18)
│   ├── time.test.ts                   (T1-19)
│   ├── json-ld.test.ts               (T1-20, expand existing)
│   ├── adaptive-renderer.test.ts      (T1-21)
│   ├── performance-template.test.ts   (T1-22)
│   ├── subjects.test.ts              (T1-23)
│   ├── utils.test.ts                  (T1-24)
│   ├── models/
│   │   ├── credit.test.ts             (T2-01)
│   │   ├── order.test.ts              (T2-02)
│   │   ├── subscription.test.ts       (T2-03)
│   │   ├── upg-generation.test.ts     (T2-04)
│   │   ├── upg-daily-quota.test.ts    (T2-05)
│   │   ├── content-moderation.test.ts (T2-06)
│   │   ├── user.test.ts               (T2-07)
│   │   ├── achievement.test.ts        (T2-08)
│   │   ├── learning-path.test.ts      (T2-09)
│   │   └── remaining-models.test.ts   (T2-10)
│   ├── services/
│   │   ├── payment.test.ts            (T3-01)
│   │   ├── rbac.test.ts               (T3-02)
│   │   ├── provider-services.test.ts  (T3-03)
│   │   ├── progress-service.test.ts   (T3-04)
│   │   ├── generate-core.test.ts      (T3-05)
│   │   └── refine-core.test.ts        (T3-06)
│   └── routes/
│       ├── upg-generate.test.ts       (T4-01)
│       ├── upg-detail.test.ts         (T4-02)
│       ├── payment.test.ts            (T4-03)
│       ├── compliance.test.ts         (T4-04)
│       ├── privacy.test.ts            (T4-05)
│       ├── gallery.test.ts            (T4-06)
│       ├── experiment-progress.test.ts(T4-07)
│       ├── moderation.test.ts         (T4-08)
│       └── remaining-routes.test.ts   (T4-09)
├── integration/
│   ├── setup.ts
│   ├── credit-lifecycle.test.ts       (T5-01)
│   ├── upg-lifecycle.test.ts          (T5-02)
│   ├── quest-flow.test.ts            (T5-03)
│   ├── subscription-rbac.test.ts     (T5-04)
│   ├── learning-path-progress.test.ts(T5-05)
│   ├── compliance-privacy.test.ts    (T5-06)
│   └── experiment-usage.test.ts      (T5-07)
└── e2e/
    ├── smoke.spec.ts                  (existing)
    ├── auth.spec.ts                   (T6-01)
    ├── experiments.spec.ts            (T6-02)
    ├── upg-generation.spec.ts        (T6-03)
    ├── payment.spec.ts               (T6-04)
    ├── quest.spec.ts                 (T6-05)
    ├── learning-paths.spec.ts        (T6-06)
    ├── admin.spec.ts                 (T6-07)
    └── responsive.spec.ts            (T6-08)
```
