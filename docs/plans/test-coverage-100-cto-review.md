---
name: test-coverage-100-cto-review
status: in-progress
created: 2026-03-23T01:51:43Z
updated: 2026-03-23T01:53:13Z
---

# Test Coverage 100% — CTO Review Document

## 1. Current State

| Metric | Value | Risk |
|--------|-------|------|
| Line Coverage | **4.68%** | CRITICAL |
| Branch Coverage | **2.87%** | CRITICAL |
| Unit Test Files | 13 | |
| Total Tests | 175 | |
| Model Files (0% coverage) | 40 | HIGH — includes payment, credits, subscriptions |
| Service Files (0% coverage) | 10 | HIGH — includes payment service (559 lines) |
| API Routes (untested) | 72 | MEDIUM |
| E2E Tests | 12 (smoke only) | MEDIUM |

## 2. Proposal: 6-Phase Test Plan

### Phase Architecture

```
T1: Pure Functions ──→ T2: Model Layer ──→ T3: Service Layer
         │                    │                    │
         └────────────────────┴────────────────────┘
                              ↓
                    T4: API Routes
                              ↓
                    T5: Integration Tests
                              ↓
                    T6: E2E (Playwright)
```

### Phase Summary

| Phase | Tests | Effort | Mock Strategy | Coverage Impact |
|-------|-------|--------|---------------|-----------------|
| T1: Pure Functions | 128 | 1.5d | None | 4.68% → ~15% |
| T2: Model Layer | 130 | 2d | vi.mock `@/core/db` chainable | ~15% → ~40% |
| T3: Service Layer | 82 | 1.5d | vi.mock models | ~40% → ~60% |
| T4: API Routes | 90 | 2d | Import handler, mock Request | ~60% → ~75% |
| T5: Integration | 50 | 1.5d | In-memory SQLite | ~75% → ~85% |
| T6: E2E | 55 | 2d | Running app + test DB | ~85% → ~95%+ |
| **Total** | **535** | **~10d** | | **100% target** |

## 3. Key Decisions Needed

### Decision 1: DB Mock Strategy

**Option A (Recommended)**: `vi.mock('@/core/db')` with chainable Drizzle mock
- Pros: Fast, no DB dependency, works in CI
- Cons: Mock drift risk (mock doesn't match real Drizzle behavior)

**Option B**: In-memory SQLite via `better-sqlite3`
- Pros: Real SQL execution, higher fidelity
- Cons: Schema setup overhead, slower tests, SQLite vs PostgreSQL differences

**Recommendation**: Option A for T2-T4, Option B only for T5 integration tests.

### Decision 2: API Route Test Approach

**Option A (Recommended)**: Import handler functions directly, pass constructed `NextRequest`
```typescript
import { GET, POST } from '@/app/api/upg/generate/route';
const req = new NextRequest('http://localhost/api/upg/generate', { method: 'POST', body: JSON.stringify({...}) });
const res = await POST(req);
```

**Option B**: HTTP integration tests via `next/test/server`
- Higher fidelity but requires full app bootstrap

**Recommendation**: Option A for unit-level route tests.

### Decision 3: Coverage Config Change

Current vitest config **excludes** `src/app/**` from coverage. This means API route tests won't improve coverage numbers even if written.

**Recommendation**: Add `src/app/api/**/*.ts` to coverage include:
```typescript
coverage: {
  include: ['src/**/*.{ts,tsx}'],  // was: excludes src/app
  exclude: ['src/**/*.d.ts', 'src/app/**/page.tsx', 'src/app/**/layout.tsx'],
}
```

### Decision 4: CI Pipeline

Current: No CI test runner configured.

**Recommendation**:
- GitHub Actions: run `pnpm test` on every PR
- Coverage gate: fail PR if coverage drops below previous level
- Redis mock for CI (rate-limit tests currently hit real Redis)

## 4. Risk Assessment

### Highest Risk Untested Code

| File | Lines | Risk | Consequence of Bug |
|------|-------|------|--------------------|
| `services/payment.ts` | 559 | **CRITICAL** | Lost revenue, double charges, failed refunds |
| `models/credit.ts` | 404 | **CRITICAL** | Credit balance corruption, expired credits still valid |
| `models/order.ts` | 367 | **HIGH** | Order state corruption, stuck orders |
| `models/subscription.ts` | 194 | **HIGH** | Wrong tier access, billing mismatch |
| `lib/moderation/content-moderator.ts` | ~200 | **HIGH** | XSS bypass, offensive content served to students |
| `lib/upg/generate-core.ts` | ~300 | **HIGH** | Generation failures, credit loss on error |
| `services/rbac.ts` | 420 | **HIGH** | Privilege escalation, admin access leak |

### Technical Debt Items

1. **Redis rate-limit tests hit real Redis** — will fail in CI. Need mock or separate `tests/integration/` directory.
2. **`tests/moderation-test.ts` exists but not in vitest glob** — dead test file, needs moving to `tests/unit/`.
3. **No test DB setup script** — integration tests (T5) need a `tests/setup-db.ts` helper.

## 5. Parallel Execution Plan

T1 has zero dependencies — start immediately. T2-T3 can start after T1 mock patterns are established.

```
Week 1: T1 (parallel) + T2 (parallel) + T3 starts
Week 2: T3 completes + T4 + T5
Week 3: T6 + CI setup + coverage gate
```

Sub-agents can execute T1 items in parallel since they're all independent pure functions.

## 6. Success Criteria

- [ ] All 6 phases complete
- [ ] `pnpm test:coverage` shows ≥ 95% line coverage for `src/shared/`
- [ ] CI pipeline runs tests on every PR
- [ ] Zero HIGH-risk files at 0% coverage
- [ ] E2E covers auth → UPG generation → payment → access control flows

## 7. Appendix: Detailed Test Specifications

See `docs/plans/test-coverage-100-plan.md` (1684 lines) for complete per-file, per-function test specifications.

## CTO Review

**Date**: 2026-03-23
**Verdict**: APPROVED with modifications

### Overall Assessment

The plan is well-structured. The 6-phase pyramid (pure functions -> models -> services -> routes -> integration -> E2E) is the correct architecture. The test count estimates are reasonable. The priority ordering (payment/credits first, cosmetic last) is correct.

Two structural problems need fixing before execution begins.

### Decision 1: DB Mock Strategy -- MODIFIED

**Decision**: Option A (vi.mock) for T2-T4, Option B (in-memory SQLite) for T5. But with a critical constraint.

The existing `.claude/rules/testing.md` says "do not mock the database (use real test database)." The plan contradicts this rule. Here is how to reconcile:

**Update the testing rule** to read: "Model layer unit tests use Drizzle mock (vi.mock). Integration tests use real test database. Never mock the database in integration or E2E tests."

The rationale: mocking DB at the model layer is acceptable because model tests verify query construction and argument handling, not SQL correctness. That is what integration tests are for. But mock drift is real, so:

**Mandatory constraint for T2**: Every mock must replicate the exact Drizzle chainable API shape used in the source file. Create a `tests/helpers/mock-db.ts` factory that returns typed mocks matching the real `db` export. Do NOT let individual test files hand-roll their own mock shapes -- one factory, one source of truth. When the real Drizzle API changes, one file breaks, not 40.

**Reject in-memory SQLite for T5**. SQLite vs PostgreSQL differences are not a "con" -- they are a disqualifier. `text` type JSON handling, `ilike` support, timestamp arithmetic, and transaction isolation all differ. Use a real PostgreSQL test database via Docker (`docker compose` with a `postgres:16` service). The CI pipeline already needs a DB for integration tests; bite the bullet now. Add a `docker-compose.test.yml` with a throwaway Postgres instance.

### Decision 2: API Route Test Approach -- APPROVED

**Decision**: Option A. Import handlers directly, construct `NextRequest`.

This is the correct choice. HTTP-level integration tests belong in T5/T6, not T4. T4 is about testing the route handler logic: does it parse params correctly, call the right service, return the right status code? Mocking at the service boundary is clean.

One addition: the `tests/helpers/mock-request.ts` factory must also handle `NextRequest` headers (auth cookies, content-type, x-forwarded-for for rate limiting). These are not optional -- every API route checks auth or rate limits.

### Decision 3: Coverage Config -- APPROVED with narrower scope

**Decision**: Include `src/app/api/**/*.ts` in coverage, but NOT all of `src/app/`.

The proposed config `include: ['src/**/*.{ts,tsx}']` is too broad. It pulls in page components, layouts, and client components that are not meaningfully unit-testable. Keep the include focused:

```typescript
coverage: {
  include: [
    'src/shared/**/*.{ts,tsx}',
    'src/app/api/**/*.ts',
    'src/core/**/*.ts',
    'src/config/**/*.ts',
  ],
  exclude: [
    'src/**/*.d.ts',
    'src/config/locale/**',       // i18n JSON, not logic
    'src/config/style/**',        // CSS, not logic
  ],
}
```

This gives coverage visibility into API routes, core infrastructure, and config logic without polluting the metric with React component rendering code.

### Decision 4: CI Pipeline -- APPROVED with additions

**Decision**: GitHub Actions, coverage gate, Redis mock. Plus:

1. **Coverage ratchet, not threshold**. Do not set a fixed floor like "fail below 80%." Instead, store the current coverage percentage in a checked-in file (`coverage-baseline.json`), and fail the PR if coverage drops below that baseline. Ratchet up only -- never down.

2. **Redis mock**: Use `ioredis-mock` or a simple in-memory Map behind a `vi.mock('@upstash/redis')`. Rate-limit tests that verify actual Redis sliding window behavior belong in T5 integration tests with a real Redis container (add it to `docker-compose.test.yml`).

3. **Separate CI jobs**: Unit tests (T1-T4) run without Docker, fast (<60s). Integration tests (T5) run with Docker services (Postgres + Redis), slower. E2E (T6) runs only on main branch merges or manual trigger -- not on every PR. This keeps PR feedback fast.

4. **Missing from the YAML**: No `pnpm-version` specified in `pnpm/action-setup`. Pin it to the version in `package.json` `packageManager` field.

### Risks and Blind Spots

**1. `handleCheckoutSuccess` and `handlePaymentSuccess` are near-identical (lines 124-382 of payment.ts)**. This is not a testing problem -- it is a code problem. These two functions share ~80% of their logic with subtle differences (checkout sets `subscriptionNo` on updateOrder, payment does not; checkout handles FAILED/PROCESSING/CANCELED status, payment only handles SUCCESS). This duplication is a bug factory. Before writing T3-01 payment tests, **refactor these into a single function with a discriminator parameter**. Testing duplicated code means maintaining duplicated tests.

**2. The plan does not address the `extensions/` directory**. `src/extensions/payment/` contains `StripeProvider`, `PayPalProvider`, `CreemProvider` -- the actual payment provider implementations. The service layer tests (T3-01) mock these, but the providers themselves have zero test coverage. A bug in `StripeProvider.createCheckoutSession()` is just as catastrophic as a bug in `handleCheckoutSuccess()`. Add T3-07: payment provider unit tests (mock Stripe SDK, verify request construction).

**3. The 100% target is aspirational noise**. The plan itself admits coverage will plateau at ~95% after T6 with "remaining gaps filled by targeted supplemental tests." That is fine. Set the real target at 90% line coverage for `src/shared/`, 80% for `src/app/api/`, and call it done. Chasing the last 5% of coverage (deeply nested error branches, provider-specific edge cases) has diminishing returns. Time is better spent on the product roadmap.

**4. No test for the `paymentService` singleton pattern** (lines 105-119 of payment.ts). The global `let paymentService: PaymentManager | null` with lazy initialization is a classic singleton race condition in serverless. If two concurrent requests hit `getPaymentService()` before the first resolves `getAllConfigs()`, you get two instances. This is low probability but worth a test -- and potentially worth fixing with a proper lock or eager initialization.

**5. Missing: content moderation test file is orphaned**. The review doc mentions `tests/moderation-test.ts` exists outside the vitest glob. Fix this during T1 -- move it to `tests/unit/` and integrate it, do not let dead test files accumulate.

### Priority Adjustments

The execution order in section 10 of the detailed plan is mostly right, but adjust:

1. **Move T3-01 (payment service) before T2 completion**. The payment path is CRITICAL risk. Do not wait for all 10 model files to be tested before touching the payment service. After T2-01 (credit), T2-02 (order), T2-03 (subscription) are done, jump to T3-01 immediately.

2. **T1-18 (hash.ts) and T1-19 (time.ts) are Priority 3 -- defer them**. These are trivial wrappers around `uuid` and `Date`. Write them last or skip them entirely. Spend the time on payment provider tests instead.

3. **T6 E2E scope is too broad for initial delivery**. Cut T6-05 (quest), T6-06 (learning-paths), T6-08 (responsive) from the initial plan. Ship T6-01 (auth), T6-02 (experiments), T6-03 (UPG generation), T6-04 (payment) first. The other E2E tests can follow in a separate sprint.

### Architectural Concern: Mock Strategy Fragility

The plan creates three layers of mocking: mock DB for models, mock models for services, mock services for routes. This is a standard testing pyramid, but the risk is **mock fidelity decay**. When someone changes a model function signature, the mock in the service test does not break -- it silently tests against a stale interface.

**Mitigation**: Use TypeScript's type system. Every mock factory in `tests/helpers/` must be typed against the real module's exports. Example:

```typescript
// tests/helpers/mock-models.ts
import type * as CreditModel from '@/shared/models/credit';

export function mockCreditModel(): typeof CreditModel {
  return {
    findCreditsByUserId: vi.fn(),
    // TypeScript will error if the real module adds/removes/renames exports
  };
}
```

This way, when the real module changes, `tsc` catches the mock mismatch at compile time, not at runtime in a failing test that someone has to debug.

### Summary of Decisions

| Item | Decision | Key Constraint |
|------|----------|----------------|
| DB Mock Strategy | vi.mock for T2-T4, **real Postgres** for T5 | Single mock factory, typed against real module |
| API Route Approach | Import handler directly | Mock factory must handle auth headers |
| Coverage Config | Include shared + api + core + config | Exclude page components, i18n JSON, CSS |
| CI Pipeline | GitHub Actions, coverage ratchet | Unit tests no-Docker, integration with Docker, E2E on main only |
| Coverage Target | 90% shared, 80% api (not 100%) | Ratchet-only, never decrease |
| payment.ts Refactor | Required before T3-01 | Deduplicate handleCheckoutSuccess / handlePaymentSuccess |
| extensions/ Testing | Add T3-07 for payment providers | Mock Stripe/PayPal SDK, verify request construction |
| Execution Order | Payment path first, defer hash/time | T3-01 starts after T2-01/02/03, not after full T2 |
