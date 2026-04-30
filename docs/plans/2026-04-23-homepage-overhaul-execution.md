---
name: homepage-overhaul-execution
status: historical-plan
snapshot_date: '2026-04-23'
created: '2026-04-22T19:06:04Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-04-23. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# Homepage Visual Overhaul · Execution Plan (Phase 0 + Phase 1)

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** 把 scivra.com 首页的 FreePik 卡通插画替换为静态 SVG hero（Motion Poetics 方向静态版），清理 iconography slop，前置埋点与 baseline，为 Phase 2 观察期做好准备。

**Architecture:** 单面 marketing（不新增 face）· 静态 inline SVG + CSS animation（非 canvas/SMIL）· Vercel Analytics + 自建 fallback 双写埋点 · Lighthouse 3-run 中位数 baseline · 直接替换 + git revert 回滚（不做 A/B 分桶）。

**Tech Stack:** Next.js 16 App Router · TypeScript strict · Tailwind v4 · next-intl · Vitest · Playwright · Upstash Redis · Vercel Analytics · lighthouse（npm 包，Phase 0 安装）

**参考文档（必读）：**
- 战略层：`docs/plans/2026-04-22-homepage-visual-overhaul.md` v3（决策依据）
- 品牌资产：`_design/brand/brand-spec.md`（Phase 0 Task 1 搬到 docs/design/）
- 视觉意图：`_design/demos/dir2/index.html`（本地 http://localhost:4102 运行中）

---

## 执行原则（每个 Task 都遵守）

1. **TDD**：先写失败测试 → 跑失败 → 最小实现 → 跑通 → commit
2. **Frequent commits**：每个 Task 独立 commit，不批量
3. **验证即完成**：`pnpm lint && pnpm typecheck && pnpm test` 必须全绿才 commit
4. **Task 之间 STOP**：每个 Task 完成后停下来让用户/review 过目
5. **Commit 信息格式**：`<type>(<scope>): <subject>`，例如 `chore(brand): move brand-spec to docs/design`
6. **出错即回滚**：单个 Task 失败 → `git reset --hard HEAD~1`，不硬推

---

## Phase 0 · Foundation（Task 1-11，约 1.5 人日）

### Task 1: 搬入 brand-spec 到正式文档目录

**Files:**
- Move: `_design/brand/brand-spec.md` → `docs/design/brand-spec.md`
- Modify: `docs/design/brand-spec.md`（加 Owner/Update-Triggers frontmatter）

**Step 1: 创建目标目录并移动文件**
```bash
mkdir -p /Users/smith/Desktop/scivra/docs/design
git mv /Users/smith/Desktop/scivra/_design/brand/brand-spec.md /Users/smith/Desktop/scivra/docs/design/brand-spec.md
```

**Step 2: 在文件顶部加 SSOT frontmatter**

在 `docs/design/brand-spec.md` 最顶部（现有 `# Scivra · Brand Spec` 之前）插入：

```markdown
---
title: Scivra Brand Spec
owner: FE lead (@user)
status: SSOT (Single Source of Truth)
update_triggers:
  - theme.css 任何 token 改动 必须同 PR 更新本文件
  - 新增 face / 新组件视觉规则 先改本文件再改代码
  - CLAUDE.md 中任何品牌色/字体描述 禁止，统一引用本文件
enforcement:
  - src/ 下新增代码禁止 hex 硬编码（CI 仅检查 PR diff）
  - font-family 新增引用必须走 CSS 变量或 Tailwind theme token
created: 2026-04-22
---

```

**Step 3: 验证**
```bash
test -f /Users/smith/Desktop/scivra/docs/design/brand-spec.md && echo OK
test ! -f /Users/smith/Desktop/scivra/_design/brand/brand-spec.md && echo OK
head -20 /Users/smith/Desktop/scivra/docs/design/brand-spec.md
```

**Step 4: Commit**
```bash
cd /Users/smith/Desktop/scivra
git add docs/design/brand-spec.md
git add _design/brand/  # record deletion
git commit -m "docs(brand): promote brand-spec to docs/design/ as SSOT"
```

---

### Task 2: Grep 验证 emoji pseudo-elements 安全可删

**Files:**
- Read-only: `src/**`（验证无组件依赖 emoji 伪元素的布局）

**Step 1: 搜索 `np-navbar-brand` 使用点**
```bash
cd /Users/smith/Desktop/scivra
grep -rn "np-navbar-brand" src/ | grep -v ".css:"
```

**Expected:** 空输出（css 之外无引用）→ 安全；如果有 React 组件使用 `className="np-navbar-brand"` 渲染，需要评估 emoji 消失后布局影响。

**Step 2: 搜索 `np-reading-indicator`**
```bash
grep -rn "np-reading-indicator" src/ | grep -v ".css:"
```

**Expected:** 空输出 → 安全

**Step 3: 记录验证结果**
如果两个都为空 → Task 3 直接执行；如果有使用点 → 先 review 那些组件，决定替代渲染方式。

**Step 4（无代码变更，不 commit）**

---

### Task 3: 删除 theme-education.css 的两处 emoji pseudo-elements

**Files:**
- Modify: `src/config/style/theme-education.css`

**Step 1: 写单元测试确认清理**

创建 `src/config/style/__tests__/theme-education.test.ts`（如不存在）：

```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

describe('theme-education.css · emoji slop cleanup', () => {
  const css = fs.readFileSync(
    path.join(process.cwd(), 'src/config/style/theme-education.css'),
    'utf8'
  );

  it('should not contain book emoji in ::before pseudo-elements', () => {
    expect(css).not.toMatch(/📚/);
  });

  it('should not contain book-open emoji', () => {
    expect(css).not.toMatch(/📖/);
  });
});
```

**Step 2: 跑测试验证失败**
```bash
cd /Users/smith/Desktop/scivra
pnpm vitest run src/config/style/__tests__/theme-education.test.ts
```
**Expected:** 2 tests FAIL（emoji 还在）

**Step 3: 删除 emoji `::before`**

使用 Edit 删除以下两段：

`src/config/style/theme-education.css` 里：
```css
.np-navbar-brand::before {
  content: '📚';
}
```
→ 整段删除

```css
.np-reading-indicator::before {
  content: '📖';
}
```
→ 整段删除

**Step 4: 跑测试验证通过**
```bash
pnpm vitest run src/config/style/__tests__/theme-education.test.ts
```
**Expected:** 2 tests PASS

**Step 5: Commit**
```bash
git add src/config/style/theme-education.css src/config/style/__tests__/theme-education.test.ts
git commit -m "chore(theme): remove emoji pseudo-elements from theme-education.css"
```

---

### Task 4: 新建 analytics track helper（Vercel + fallback 双写）

**Files:**
- Create: `src/shared/lib/analytics/track.ts`
- Create: `src/shared/lib/analytics/__tests__/track.test.ts`

**Step 1: 写失败测试**

`src/shared/lib/analytics/__tests__/track.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { track } from '../track';

describe('track()', () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
    (window as any).va = vi.fn();
  });
  afterEach(() => {
    global.fetch = originalFetch;
    delete (window as any).va;
  });

  it('calls window.va when Vercel Analytics is loaded', () => {
    track('hero_cta_click', { variant: 'primary', locale: 'en' });
    expect((window as any).va).toHaveBeenCalledWith('event', {
      name: 'hero_cta_click',
      data: { variant: 'primary', locale: 'en' },
    });
  });

  it('also sends to fallback /api/analytics/event', () => {
    track('hero_cta_click', { variant: 'primary', locale: 'en' });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/analytics/event',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('does not throw when window.va is absent', () => {
    delete (window as any).va;
    expect(() => track('scroll_depth_25', { locale: 'en' })).not.toThrow();
  });

  it('swallows fetch errors (fire-and-forget)', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('blocked by adblocker')));
    expect(() => track('scroll_depth_50', { locale: 'zh' })).not.toThrow();
  });
});
```

**Step 2: 跑测试验证失败**
```bash
pnpm vitest run src/shared/lib/analytics/__tests__/track.test.ts
```
**Expected:** FAIL with "Cannot find module '../track'"

**Step 3: 实现 track.ts**

`src/shared/lib/analytics/track.ts`:
```ts
export type HomepageEvent =
  | 'hero_cta_click'
  | 'grade_tile_click'
  | 'experiment_card_click'
  | 'scroll_depth_25'
  | 'scroll_depth_50'
  | 'scroll_depth_75';

export type EventPayload = Record<string, string | number | boolean | null | undefined>;

/**
 * Dual-write analytics:
 *  1. Vercel Analytics (window.va) for dashboard
 *  2. /api/analytics/event fallback for ad-blocker resilience + Sentry breadcrumbs
 * Fire-and-forget — never throws, never blocks UI.
 */
export function track(event: HomepageEvent, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return;

  // Vercel Analytics (if loaded)
  const va = (window as unknown as { va?: (cmd: string, args: unknown) => void }).va;
  if (typeof va === 'function') {
    try {
      va('event', { name: event, data: payload });
    } catch {
      // swallow — analytics must never break UI
    }
  }

  // Fallback — always try, even if va is present (double-write is by design)
  try {
    void fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload, ts: Date.now() }),
      keepalive: true,
    }).catch(() => {
      /* ad-blocker or offline — expected */
    });
  } catch {
    /* fetch throws synchronously in rare cases — ignore */
  }
}
```

**Step 4: 跑测试验证通过**
```bash
pnpm vitest run src/shared/lib/analytics/__tests__/track.test.ts
```
**Expected:** 4 tests PASS

**Step 5: Commit**
```bash
git add src/shared/lib/analytics/
git commit -m "feat(analytics): add dual-write track helper (Vercel + /api fallback)"
```

---

### Task 5: 新建 /api/analytics/event fallback endpoint

**Files:**
- Create: `src/app/api/analytics/event/route.ts`
- Create: `src/app/api/analytics/event/__tests__/route.test.ts`

**Step 1: 写失败测试**

`src/app/api/analytics/event/__tests__/route.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { POST } from '../route';

describe('POST /api/analytics/event', () => {
  it('accepts valid event and returns 204', async () => {
    const req = new Request('http://localhost/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'hero_cta_click',
        payload: { variant: 'primary', locale: 'en' },
        ts: Date.now(),
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(204);
  });

  it('rejects invalid event name', async () => {
    const req = new Request('http://localhost/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'malicious_event' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 on malformed JSON', async () => {
    const req = new Request('http://localhost/api/analytics/event', {
      method: 'POST',
      body: 'not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

**Step 2: 跑测试验证失败**
```bash
pnpm vitest run src/app/api/analytics/event/__tests__/route.test.ts
```
**Expected:** FAIL

**Step 3: 实现 route.ts**

`src/app/api/analytics/event/route.ts`:
```ts
import { NextResponse } from 'next/server';

const ALLOWED_EVENTS = new Set([
  'hero_cta_click',
  'grade_tile_click',
  'experiment_card_click',
  'scroll_depth_25',
  'scroll_depth_50',
  'scroll_depth_75',
]);

export const runtime = 'edge'; // lightweight, no DB needed in v1

/**
 * Fallback analytics endpoint for when Vercel Analytics is blocked.
 * v1: log to stderr (Vercel captures), no persistence.
 * Future: push to Upstash Redis 24h retention if volume justifies it.
 */
export async function POST(req: Request): Promise<Response> {
  let body: { event?: string; payload?: Record<string, unknown>; ts?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!body.event || !ALLOWED_EVENTS.has(body.event)) {
    return NextResponse.json({ error: 'invalid_event' }, { status: 400 });
  }

  // v1: structured log — Vercel captures and surfaces in logs
  console.log(JSON.stringify({
    kind: 'analytics_event',
    event: body.event,
    payload: body.payload ?? {},
    ts: body.ts ?? Date.now(),
  }));

  return new NextResponse(null, { status: 204 });
}
```

**Step 4: 跑测试验证通过**
```bash
pnpm vitest run src/app/api/analytics/event/__tests__/route.test.ts
```
**Expected:** 3 tests PASS

**Step 5: Commit**
```bash
git add src/app/api/analytics/event/
git commit -m "feat(analytics): add /api/analytics/event fallback endpoint"
```

---

### Task 6: 新建 seo-audit.mjs 脚本

**Files:**
- Create: `scripts/seo-audit.mjs`
- Create: `scripts/__tests__/seo-audit.test.mjs`（可选，复杂度高时可跳过）

**Step 1: 实现 seo-audit.mjs**

`scripts/seo-audit.mjs`:
```js
#!/usr/bin/env node
/**
 * SEO audit — checks 5 properties on a given URL:
 *   1. <link rel="canonical"> present + absolute URL
 *   2. <script type="application/ld+json"> present + valid JSON + has @type
 *   3. <link rel="alternate" hreflang="..."> pairs (en + zh)
 *   4. exactly one <h1>
 *   5. OG card: og:title, og:description, og:image, og:type, og:url
 *
 * Usage: node scripts/seo-audit.mjs <url>
 * Exit 0 on PASS, 1 on any FAIL
 */

const url = process.argv[2] ?? 'http://localhost:3000';

async function main() {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    console.error(`FAIL: ${url} returned ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();
  const results = [];

  // 1. Canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  results.push({
    check: 'canonical',
    pass: canonicalMatch !== null && /^https?:\/\//.test(canonicalMatch?.[1] ?? ''),
    detail: canonicalMatch?.[1] ?? 'missing',
  });

  // 2. JSON-LD
  const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let jsonLdPass = false;
  let jsonLdDetail = 'missing';
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1].trim());
      if (data['@type'] || (Array.isArray(data) && data[0]?.['@type'])) {
        jsonLdPass = true;
        jsonLdDetail = data['@type'] ?? data[0]['@type'];
        break;
      }
    } catch { /* skip invalid */ }
  }
  results.push({ check: 'json-ld', pass: jsonLdPass, detail: jsonLdDetail });

  // 3. Hreflang
  const hreflangs = [...html.matchAll(/<link[^>]+hreflang=["']([^"']+)["']/gi)].map(m => m[1]);
  results.push({
    check: 'hreflang',
    pass: hreflangs.includes('en') && hreflangs.includes('zh'),
    detail: hreflangs.join(',') || 'missing',
  });

  // 4. Single H1
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  results.push({
    check: 'single-h1',
    pass: h1Count === 1,
    detail: `found ${h1Count}`,
  });

  // 5. OG card
  const requiredOg = ['og:title', 'og:description', 'og:image', 'og:type', 'og:url'];
  const ogMissing = requiredOg.filter(prop => !new RegExp(`property=["']${prop.replace(':', '\\:')}["']`, 'i').test(html));
  results.push({
    check: 'og-card',
    pass: ogMissing.length === 0,
    detail: ogMissing.length === 0 ? 'complete' : `missing: ${ogMissing.join(',')}`,
  });

  // Output
  let failed = 0;
  for (const r of results) {
    const icon = r.pass ? '✓' : '✗';
    console.log(`${icon} ${r.check.padEnd(12)} — ${r.detail}`);
    if (!r.pass) failed++;
  }

  console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('seo-audit crashed:', err);
  process.exit(2);
});
```

**Step 2: 本地跑 baseline**
```bash
cd /Users/smith/Desktop/scivra
# 启动 dev server（另一个终端）
# pnpm dev
node scripts/seo-audit.mjs http://localhost:3000
```
**Expected:** 5 项 PASS/FAIL 可读（如果有 FAIL，记录当前 baseline，Phase 1 必须保持或改进）

**Step 3: 加 npm script**

在 `package.json` 的 `"scripts"` 下添加：
```json
"seo:audit": "node scripts/seo-audit.mjs"
```

**Step 4: Commit**
```bash
git add scripts/seo-audit.mjs package.json
git commit -m "feat(ci): add seo-audit script for homepage canonical/JSON-LD/hreflang/H1/OG check"
```

---

### Task 7: 新建 lighthouse-baseline.mjs 脚本

**Files:**
- Modify: `package.json`（加 lighthouse devDep）
- Create: `scripts/lighthouse-baseline.mjs`
- Create: `docs/baselines/` 目录

**Step 1: 安装 lighthouse**
```bash
cd /Users/smith/Desktop/scivra
pnpm add -D lighthouse chrome-launcher
```

**Step 2: 创建 baseline 目录**
```bash
mkdir -p /Users/smith/Desktop/scivra/docs/baselines
```

**Step 3: 实现 lighthouse-baseline.mjs**

`scripts/lighthouse-baseline.mjs`:
```js
#!/usr/bin/env node
/**
 * Lighthouse baseline — runs 3 times on a URL, captures median of key metrics.
 * Usage: node scripts/lighthouse-baseline.mjs <url> [--device=mobile|desktop]
 * Output: docs/baselines/homepage-YYYY-MM-DD.json
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs/promises';
import path from 'node:path';

const url = process.argv[2] ?? 'http://localhost:3000';
const device = (process.argv.find(a => a.startsWith('--device='))?.split('=')[1]) ?? 'mobile';

async function runOnce(chrome) {
  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
    formFactor: device,
    screenEmulation: device === 'mobile'
      ? { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false }
      : { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
  });
  const { lhr } = result;
  return {
    performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
    seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
    bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
    lcp: lhr.audits['largest-contentful-paint']?.numericValue,
    cls: lhr.audits['cumulative-layout-shift']?.numericValue,
    tbt: lhr.audits['total-blocking-time']?.numericValue,
    fcp: lhr.audits['first-contentful-paint']?.numericValue,
  };
}

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

async function main() {
  console.log(`Lighthouse baseline · ${url} · ${device} · 3 runs`);
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
  try {
    const runs = [];
    for (let i = 1; i <= 3; i++) {
      process.stdout.write(`  run ${i}/3... `);
      runs.push(await runOnce(chrome));
      console.log('done');
    }
    const keys = ['performance', 'accessibility', 'seo', 'bestPractices', 'lcp', 'cls', 'tbt', 'fcp'];
    const medians = Object.fromEntries(keys.map(k => [k, median(runs.map(r => r[k]))]));
    const output = {
      url,
      device,
      date: new Date().toISOString().split('T')[0],
      runs,
      median: medians,
    };
    const fname = `homepage-${output.date}-${device}.json`;
    const outPath = path.join('docs/baselines', fname);
    await fs.writeFile(outPath, JSON.stringify(output, null, 2));
    console.log(`\n✓ Saved: ${outPath}`);
    console.log(`  perf=${medians.performance}  a11y=${medians.accessibility}  seo=${medians.seo}`);
    console.log(`  lcp=${Math.round(medians.lcp)}ms  cls=${medians.cls.toFixed(3)}  tbt=${Math.round(medians.tbt)}ms`);
  } finally {
    await chrome.kill();
  }
}

main().catch(err => {
  console.error('lighthouse-baseline crashed:', err);
  process.exit(1);
});
```

**Step 4: 加 npm scripts**

在 `package.json` 的 `"scripts"` 下添加：
```json
"lighthouse:baseline": "node scripts/lighthouse-baseline.mjs",
"lighthouse:baseline:desktop": "node scripts/lighthouse-baseline.mjs http://localhost:3000 --device=desktop"
```

**Step 5: 跑一次 baseline 并提交**
```bash
# 一个终端启动 dev server:
# pnpm dev
# 另一个终端：
node scripts/lighthouse-baseline.mjs http://localhost:3000 --device=mobile
node scripts/lighthouse-baseline.mjs http://localhost:3000 --device=desktop
ls docs/baselines/
```

**Step 6: Commit**
```bash
git add package.json pnpm-lock.yaml scripts/lighthouse-baseline.mjs docs/baselines/
git commit -m "feat(ci): add lighthouse-baseline script + record pre-overhaul baseline"
```

---

### Task 8: 将 seo-audit 挂到 GitHub Actions CI

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Read 现有 ci.yml**
```bash
cat /Users/smith/Desktop/scivra/.github/workflows/ci.yml
```

**Step 2: 加 seo-audit job**

在 `ci.yml` 的 `jobs:` 下追加（保留现有 job）：

```yaml
  seo-audit:
    runs-on: ubuntu-latest
    needs: build  # 假设有 build job，如果不存在改成 lint 或 test
    if: |
      github.event_name == 'pull_request' &&
      (contains(github.event.pull_request.changed_files, 'src/app/') ||
       contains(github.event.pull_request.changed_files, 'src/themes/') ||
       contains(github.event.pull_request.changed_files, 'src/shared/lib/seo/'))
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - name: Start Next in background
        run: pnpm start &
      - name: Wait for server
        run: npx wait-on http://localhost:3000 --timeout 60000
      - name: Run SEO audit
        run: node scripts/seo-audit.mjs http://localhost:3000
```

**Step 3: 本地验证 yaml 语法**
```bash
cd /Users/smith/Desktop/scivra
# 如有 yamllint 则 yamllint .github/workflows/ci.yml，否则人工检查缩进
```

**Step 4: Commit**
```bash
git add .github/workflows/ci.yml
git commit -m "ci: add seo-audit job on PR for homepage routes"
```

---

### Task 9: 写 homepage rollback runbook

**Files:**
- Create: `docs/runbooks/homepage-rollback.md`

**Step 1: 创建目录 + 写 runbook**
```bash
mkdir -p /Users/smith/Desktop/scivra/docs/runbooks
```

`docs/runbooks/homepage-rollback.md`:
```markdown
# Homepage Rollback Runbook

> 当 Phase 2 (观察期) 任一 guardrail 触发告警且 72h 内持续 → 执行此 runbook 回滚。

## 触发条件（任一）

- LCP 中位数较 baseline 增加 > 30%（3 天滑窗）
- Hero CTA CTR 跌 > 15%（7 天滑窗）
- Bounce rate 涨 > 15%（7 天滑窗）
- 首页相关 Sentry error rate > 1%

## 回滚流程

### 1. 确认需要回滚

```bash
# 再跑一次 baseline 对比
pnpm lighthouse:baseline
diff docs/baselines/homepage-$(date +%F)-mobile.json docs/baselines/homepage-<pre-phase1-date>-mobile.json
```

### 2. 找到 Phase 1 的合并 commit

```bash
git log --oneline --grep="feat(homepage): phase 1" -n 5
```

### 3. Revert（单个 squash commit 场景）

```bash
git revert <commit-sha>
git push origin main
```

### 4. 若 Phase 1 是多个 commit

```bash
git log --oneline <start-commit>..<end-commit>
git revert <start-commit>..<end-commit>
git push origin main
```

### 5. 验证

- 等 Vercel 部署完成（约 3 min）
- 手动访问 scivra.com 确认 hero 回到 FreePik 插画
- 跑 `pnpm seo:audit https://scivra.com`
- 跑 `pnpm lighthouse:baseline https://scivra.com`

### 6. 记录

在 `docs/decisions/` 下创建 `YYYY-MM-DD-homepage-revert.md`：
- 触发哪个 guardrail
- 实际数据对比 baseline
- 假设原因（UX / 性能 / 内容）
- 下一步计划

## 紧急场景（SEV1）

如果首页完全白屏或 500 error 率 > 5%：

```bash
# Vercel CLI 立即回滚到上一部署
vercel rollback
```

不等 git revert，直接 Vercel 层面回滚。
```

**Step 2: Commit**
```bash
git add docs/runbooks/homepage-rollback.md
git commit -m "docs(runbooks): add homepage rollback procedure"
```

---

### Task 10: （可选）精简 CLAUDE.md 的 UI 设计方向章节

**Files:**
- Modify: `CLAUDE.md`（UI 设计方向章节）

**Step 1: 定位 CLAUDE.md 的 `## UI 设计方向` 或 `UI Design Direction` 章节**
```bash
grep -n "UI 设计方向\|UI Design Direction" /Users/smith/Desktop/scivra/CLAUDE.md
```

**Step 2: 替换整节为指针**

将原章节内容（色值表 / 字体表 / 学科色等）替换为：
```markdown
## UI 设计方向（Brand SSOT）

品牌规范的唯一事实源：[`docs/design/brand-spec.md`](./docs/design/brand-spec.md)

任何色值 / 字体 / face / token 改动，先更新 brand-spec，再改 theme.css，不在 CLAUDE.md 里复述（避免文档漂移）。

Face system 与 tokens 的实现在 `src/config/style/theme.css` + `theme-education.css`。
```

**Step 3: Commit**
```bash
git add CLAUDE.md
git commit -m "docs(claude): replace UI direction section with brand-spec pointer (SSOT)"
```

---

### Task 11: Phase 0 最终验证 + 标记

**Files:**
- Read-only 验证

**Step 1: 跑全套 checks**
```bash
cd /Users/smith/Desktop/scivra
pnpm lint
pnpm test
pnpm build
# 新加 scripts
pnpm seo:audit http://localhost:3000  # 需 dev server 运行
# baseline 已在 Task 7 commit
```

**Step 2: 全部绿则标记 Phase 0 完成**
```bash
git tag -a phase-0-complete -m "Homepage overhaul Phase 0: foundation + baseline complete"
```

**Step 3: 更新 plan 状态**

Edit `docs/plans/2026-04-22-homepage-visual-overhaul.md` 的 frontmatter：
```yaml
status: phase-0-complete
updated: <today ISO>
```

**Step 4: Commit**
```bash
git add docs/plans/2026-04-22-homepage-visual-overhaul.md
git commit -m "docs(plan): mark phase 0 complete"
```

---

## Phase 1 · Homepage Replacement（Task 12-21，约 5-6 人日）

### Task 12: 写 Hero 新实现的失败测试

**Files:**
- Create: `src/themes/default/blocks/__tests__/hero.test.tsx`

**Step 1: 写失败测试**

`src/themes/default/blocks/__tests__/hero.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from '../hero';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/shared/lib/analytics/track', () => ({
  track: vi.fn(),
}));

const baseSection = {
  id: 'hero',
  title: "The Experiments Your Textbook Can't Show You",
  highlight_text: "Can't Show",
  description: 'Stop memorizing formulas. Start seeing how science works.',
  buttons: [
    { title: 'Try Your First Experiment', url: '/labs', variant: 'glow' },
  ],
};

describe('Hero block · V2 Motion Poetics (static SVG)', () => {
  it('renders H1 with highlight italic', () => {
    render(<Hero section={baseSection as any} />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain("The Experiments Your Textbook Can't Show");
    // italic highlight span should exist
    const italic = h1.querySelector('em, [style*="italic"]');
    expect(italic).toBeTruthy();
  });

  it('renders inline SVG hero illustration (not img)', () => {
    const { container } = render(<Hero section={baseSection as any} />);
    const svg = container.querySelector('svg[data-hero-illustration]');
    expect(svg).toBeTruthy();
  });

  it('does NOT render FreePik hero image when section.image is null', () => {
    render(<Hero section={{ ...baseSection, image: null } as any} />);
    expect(screen.queryByAltText(/student.*discovery/i)).toBeNull();
  });

  it('renders Example parameters caption (not fake live)', () => {
    const { container } = render(<Hero section={baseSection as any} />);
    expect(container.textContent).toMatch(/Example/i);
    expect(container.textContent).toMatch(/v₀/);
  });
});
```

**Step 2: 跑测试**
```bash
pnpm vitest run src/themes/default/blocks/__tests__/hero.test.tsx
```
**Expected:** 4 tests FAIL（当前 hero.tsx 还是旧版）

**Step 3: 不 commit** — 测试合入和实现合入一起 commit（Task 13）

---

### Task 13: 重写 Hero 组件为 V2 静态 SVG 版本

**Files:**
- Modify: `src/themes/default/blocks/hero.tsx`

**Step 1: Read 现有 hero.tsx**
```bash
cat /Users/smith/Desktop/scivra/src/themes/default/blocks/hero.tsx
```

**Step 2: 重写 hero.tsx**

完整替换为：
```tsx
'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { track } from '@/shared/lib/analytics/track';
import { Section } from '@/shared/types/blocks/landing';

import { HeroBackground } from './hero-background';
import { SocialAvatars } from './social-avatars';

interface SubjectButton {
  title: string;
  icon: string;
  count: number;
  url: string;
}

export function Hero({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const highlightText = section.highlight_text ?? '';
  let texts: string[] | null = null;
  if (highlightText && section.title) {
    texts = section.title.split(highlightText, 2);
  }

  // Scroll depth tracking (Phase 2 observation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fired = new Set<number>();
    const onScroll = () => {
      const scrolled = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      const pct = (scrolled / h) * 100;
      for (const depth of [25, 50, 75] as const) {
        if (pct >= depth && !fired.has(depth)) {
          fired.add(depth);
          track(`scroll_depth_${depth}` as const, {
            locale: document.documentElement.lang || 'en',
          });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const locale =
    typeof document !== 'undefined' ? document.documentElement.lang || 'en' : 'en';

  return (
    <section
      id={section.id}
      className={cn(
        'relative overflow-hidden pt-24 pb-16 md:pt-36 md:pb-24',
        section.className,
        className
      )}
    >
      <HeroBackground />

      {/* V3 signature: subtle cyan glow radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, oklch(0.78 0.15 192 / 0.10), transparent 70%)',
        }}
      />

      {section.announcement && (
        <Link
          href={section.announcement.url || ''}
          target={section.announcement.target || '_self'}
          className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
        >
          <span className="text-foreground text-sm">{section.announcement.title}</span>
          <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />
          <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
              <span className="flex size-6"><ArrowRight className="m-auto size-3" /></span>
              <span className="flex size-6"><ArrowRight className="m-auto size-3" /></span>
            </div>
          </div>
        </Link>
      )}

      <div className="relative mx-auto max-w-full px-4 text-center md:max-w-5xl">
        {texts && texts.length > 0 ? (
          <h1 className="font-serif text-foreground text-4xl font-bold tracking-tight text-balance sm:mt-12 sm:text-6xl">
            {texts[0]}
            <em
              className="not-italic text-primary"
              style={{
                fontStyle: 'italic',
                borderBottom: '4px solid oklch(0.75 0.15 75)',
                paddingBottom: '0.08em',
                textShadow:
                  '0 0 24px oklch(0.78 0.15 192 / 0.5), 0 0 56px oklch(0.78 0.15 192 / 0.25)',
              }}
            >
              {highlightText}
            </em>
            {texts[1]}
          </h1>
        ) : (
          <h1 className="font-serif text-foreground text-4xl font-bold tracking-tight text-balance sm:mt-12 sm:text-6xl">
            {section.title}
          </h1>
        )}

        <p
          className="text-muted-foreground mt-8 mb-8 text-lg text-balance"
          dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
        />

        {/* Static SVG hero illustration (V3) */}
        <div className="my-12 flex justify-center">
          <svg
            data-hero-illustration
            viewBox="0 0 720 240"
            role="img"
            aria-label="Projectile motion illustration — parabolic arc with velocity vector"
            className="w-full max-w-3xl"
          >
            <defs>
              <style>{`
                @keyframes hero-draw {
                  to { stroke-dashoffset: 0; }
                }
                [data-hero-path] {
                  stroke-dasharray: 1200;
                  stroke-dashoffset: 1200;
                  animation: hero-draw 800ms cubic-bezier(0.4, 0, 0.2, 1) 150ms forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                  [data-hero-path] {
                    stroke-dashoffset: 0;
                    animation: none;
                  }
                }
              `}</style>
            </defs>
            {/* parabola */}
            <path
              data-hero-path
              d="M 40 200 Q 360 -40 680 200"
              stroke="oklch(0.45 0.12 192 / 0.85)"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* 12 static particles */}
            {[
              [90, 170], [150, 130], [210, 100], [270, 80],
              [330, 68], [390, 68], [450, 80], [510, 100],
              [570, 130], [630, 170], [180, 60], [540, 60],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={2}
                fill="oklch(0.82 0.18 192)"
                opacity={0.6}
              />
            ))}
            {/* 45° angle marker at left */}
            <path
              d="M 40 200 L 80 200 A 40 40 0 0 0 65.86 165.86 Z"
              fill="oklch(0.45 0.12 192 / 0.12)"
              stroke="oklch(0.45 0.12 192)"
              strokeWidth="1"
            />
            <text x="78" y="192" fontSize="11" fill="oklch(0.45 0.12 192)" fontFamily="ui-monospace, monospace">45°</text>
            {/* velocity vector at apex */}
            <line x1="360" y1="20" x2="360" y2="60" stroke="oklch(0.75 0.15 75)" strokeWidth="2" />
            <polygon points="356,58 360,66 364,58" fill="oklch(0.75 0.15 75)" />
            <text x="368" y="32" fontSize="11" fill="oklch(0.75 0.15 75)" fontFamily="ui-monospace, monospace">v(t)</text>
            {/* caption */}
            <text
              x="710"
              y="230"
              fontSize="10"
              fill="oklch(0.55 0.023 264)"
              fontFamily="ui-monospace, monospace"
              textAnchor="end"
            >
              Example · v₀ = 42 m/s · θ = 45° · g = 9.81 m/s²
            </text>
          </svg>
        </div>

        {section.buttons && (
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {section.buttons.map((button, idx) => (
              <Button
                asChild
                size={button.size || 'default'}
                variant={button.variant || 'default'}
                className="px-4 text-sm"
                key={idx}
              >
                <Link
                  href={button.url ?? ''}
                  target={button.target ?? '_self'}
                  onClick={() =>
                    track('hero_cta_click', {
                      variant: idx === 0 ? 'primary' : 'secondary',
                      locale,
                    })
                  }
                >
                  {button.icon && <SmartIcon name={button.icon as string} />}
                  <span>{button.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        )}

        {section.subjects && (section.subjects as SubjectButton[]).length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {(section.subjects as SubjectButton[]).map((subject, idx) => (
              <Link
                key={idx}
                href={subject.url}
                onClick={() =>
                  track('grade_tile_click', {
                    grade: subject.title,
                    locale,
                  })
                }
                className="border-border hover:border-primary group flex flex-col items-center gap-1 rounded-lg border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-primary/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <SmartIcon name={subject.icon} size={20} className="text-primary" />
                <span className="text-foreground text-sm font-medium">{subject.title}</span>
              </Link>
            ))}
          </div>
        )}

        {section.tip && (
          <p
            className="text-muted-foreground mt-6 block text-center text-sm"
            dangerouslySetInnerHTML={{ __html: section.tip ?? '' }}
          />
        )}

        {section.show_avatars && <SocialAvatars tip={section.avatars_tip || ''} />}
      </div>

      {/* Removed: section.image big FreePik illustration + border frame */}
      {/* (Handled via landing.json setting image to null; code path retained for future re-enable) */}
    </section>
  );
}
```

**Step 3: 跑测试验证通过**
```bash
pnpm vitest run src/themes/default/blocks/__tests__/hero.test.tsx
```
**Expected:** 4 tests PASS

**Step 4: lint + typecheck**
```bash
pnpm lint
pnpm tsc --noEmit
```

**Step 5: Commit**
```bash
git add src/themes/default/blocks/hero.tsx src/themes/default/blocks/__tests__/hero.test.tsx
git commit -m "feat(homepage): replace hero image with static SVG + CSS animation

- inline SVG projectile motion illustration (5KB gzip budget)
- Merriweather italic highlight + gold underline
- CSS keyframes (not SMIL) for Safari 15 compat
- prefers-reduced-motion respected
- analytics track on CTA + grade tile clicks
- scroll_depth 25/50/75 observation
- Example caption (not fake live)"
```

---

### Task 14: 更新 hero-background.tsx

**Files:**
- Modify: `src/themes/default/blocks/hero-background.tsx`

**Step 1: Read current file**
```bash
cat /Users/smith/Desktop/scivra/src/themes/default/blocks/hero-background.tsx
```

**Step 2: 简化为纯静态（如原本有 canvas / 动画代码，删除）**

替换为：
```tsx
export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-20 opacity-60"
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 30%, oklch(0.78 0.15 192 / 0.06) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />
  );
}
```

**Step 3: Lint**
```bash
pnpm lint
```

**Step 4: Commit**
```bash
git add src/themes/default/blocks/hero-background.tsx
git commit -m "refactor(hero-background): simplify to static dotted texture"
```

---

### Task 15: 更新 en landing.json 去 FreePik

**Files:**
- Modify: `src/config/locale/messages/en/landing.json`

**Step 1: 找到 hero.image + image_invert，改为 null**
```bash
grep -n '"image"' /Users/smith/Desktop/scivra/src/config/locale/messages/en/landing.json | head -10
```

**Step 2: Edit — 把 hero 的 `image` 和 `image_invert` 改为 null**

找到 hero section，把：
```json
"image": {
  "src": "/imgs/hero/student-discovery.png",
  "alt": "...",
  "width": 1200,
  "height": 630
},
"image_invert": {
  "src": "/imgs/hero/student-discovery-dark.png",
  ...
}
```

改为：
```json
"image": null,
"image_invert": null,
```

**Step 3: JSON 语法校验**
```bash
cd /Users/smith/Desktop/scivra
node -e "JSON.parse(require('fs').readFileSync('src/config/locale/messages/en/landing.json', 'utf8'))" && echo OK
```

**Step 4: Commit**
```bash
git add src/config/locale/messages/en/landing.json
git commit -m "content(landing): remove FreePik hero illustration (en)"
```

---

### Task 16: 同步 zh landing.json

**Files:**
- Modify: `src/config/locale/messages/zh/landing.json`

**Step 1: 同样操作 zh 版本**

```bash
grep -n '"image"' /Users/smith/Desktop/scivra/src/config/locale/messages/zh/landing.json | head -10
```
同 Task 15，把 hero.image 和 image_invert 改为 null。

**Step 2: 校验 + commit**
```bash
node -e "JSON.parse(require('fs').readFileSync('src/config/locale/messages/zh/landing.json', 'utf8'))" && echo OK
git add src/config/locale/messages/zh/landing.json
git commit -m "content(landing): remove FreePik hero illustration (zh)"
```

---

### Task 17: git rm 废弃的 FreePik PNGs

**Files:**
- Delete: `public/imgs/hero/student-discovery.png`
- Delete: `public/imgs/hero/student-discovery-dark.png`

**Step 1: 确认无其他引用**
```bash
cd /Users/smith/Desktop/scivra
grep -rn "student-discovery" src/ public/ docs/ 2>/dev/null | grep -v "\.png" || echo "No references"
```

**Step 2: git rm**
```bash
git rm public/imgs/hero/student-discovery.png
git rm public/imgs/hero/student-discovery-dark.png
```

**Step 3: 验证 build 不破**
```bash
pnpm build
```
**Expected:** build 成功，无 404 警告

**Step 4: Commit**
```bash
git commit -m "chore(assets): remove legacy FreePik hero PNGs (git history is backup)"
```

---

### Task 18: experiment-showcase 缩略图改 inline SVG

**Files:**
- Modify: `src/themes/default/blocks/experiment-showcase.tsx`
- Create: `src/themes/default/blocks/__tests__/experiment-showcase.test.tsx`

**Step 1: Read current**
```bash
cat /Users/smith/Desktop/scivra/src/themes/default/blocks/experiment-showcase.tsx
```

**Step 2: 写失败测试**

`src/themes/default/blocks/__tests__/experiment-showcase.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExperimentShowcase } from '../experiment-showcase';

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
vi.mock('@/shared/lib/analytics/track', () => ({ track: vi.fn() }));

const section = {
  id: 'experiment_showcase',
  title: 'Real labs. Running in your browser.',
  items: [
    { subject: 'physics', grade: '9-12', title: 'Projectile Motion', description: 'Launch objects...', url: '/labs/projectile' },
    { subject: 'biology', grade: 'AP', title: 'DNA Double Helix', description: 'Rotate, zoom...', url: '/labs/dna' },
    { subject: 'chemistry', grade: 'AP', title: 'Chemical Equilibrium', description: 'Adjust temperature...', url: '/labs/equilibrium' },
  ],
};

describe('ExperimentShowcase · inline SVG thumbnails', () => {
  it('renders 3 cards each with an inline SVG thumbnail', () => {
    const { container } = render(<ExperimentShowcase section={section as any} />);
    const thumbnails = container.querySelectorAll('svg[data-experiment-thumb]');
    expect(thumbnails.length).toBe(3);
  });

  it('uses subject-specific SVG per card', () => {
    const { container } = render(<ExperimentShowcase section={section as any} />);
    expect(container.querySelector('[data-experiment-thumb="physics"]')).toBeTruthy();
    expect(container.querySelector('[data-experiment-thumb="biology"]')).toBeTruthy();
    expect(container.querySelector('[data-experiment-thumb="chemistry"]')).toBeTruthy();
  });
});
```

跑测试 → FAIL（当前组件用 PNG）

**Step 3: 实现新 experiment-showcase.tsx**

完整重写，3 个 subject 各自一个 inline SVG 缩略图（复用 `_design/demos/dir2/index.html` 的 SVG 设计语言）。

提供一个参考实现：
```tsx
'use client';

import { Link } from '@/core/i18n/navigation';
import { track } from '@/shared/lib/analytics/track';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

interface ExperimentItem {
  subject: string;
  grade: string;
  title: string;
  description: string;
  url: string;
}

function ProjectileThumb() {
  return (
    <svg data-experiment-thumb="physics" viewBox="0 0 320 180" className="h-full w-full">
      <rect width="320" height="180" fill="oklch(0.13 0.03 250)" />
      <path d="M 30 150 Q 160 -10 290 150" stroke="oklch(0.82 0.18 192)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
      {[50, 90, 130, 160, 190, 230, 270].map((x, i) => {
        const t = (x - 30) / 260;
        const y = 150 - 4 * 160 * t * (1 - t);
        return <circle key={i} cx={x} cy={y} r={2.5} fill="oklch(0.82 0.18 192)" opacity={0.6} />;
      })}
      <circle cx={50} cy={120} r={5} fill="oklch(0.82 0.18 192)" />
      <text x={55} y={108} fontSize="10" fill="oklch(0.82 0.18 192)" fontFamily="monospace">45°</text>
    </svg>
  );
}

function DnaThumb() {
  return (
    <svg data-experiment-thumb="biology" viewBox="0 0 320 180" className="h-full w-full">
      <rect width="320" height="180" fill="oklch(0.13 0.03 250)" />
      {Array.from({ length: 10 }).map((_, i) => {
        const y = 20 + i * 15;
        const x1 = 120 + 40 * Math.sin(i * 0.6);
        const x2 = 200 - 40 * Math.sin(i * 0.6);
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="oklch(0.82 0.18 192)" strokeWidth="1" opacity="0.4" />
            <circle cx={x1} cy={y} r="3" fill="oklch(0.65 0.30 330)" />
            <circle cx={x2} cy={y} r="3" fill="oklch(0.80 0.25 145)" />
          </g>
        );
      })}
    </svg>
  );
}

function ChemistryThumb() {
  return (
    <svg data-experiment-thumb="chemistry" viewBox="0 0 320 180" className="h-full w-full">
      <rect width="320" height="180" fill="oklch(0.13 0.03 250)" />
      <circle cx={110} cy={90} r={28} fill="oklch(0.82 0.18 192 / 0.2)" stroke="oklch(0.82 0.18 192)" strokeWidth="1.5" />
      <text x={110} y={95} textAnchor="middle" fontSize="14" fill="oklch(0.82 0.18 192)" fontFamily="monospace">A</text>
      <circle cx={210} cy={90} r={28} fill="oklch(0.65 0.30 330 / 0.2)" stroke="oklch(0.65 0.30 330)" strokeWidth="1.5" />
      <text x={210} y={95} textAnchor="middle" fontSize="14" fill="oklch(0.65 0.30 330)" fontFamily="monospace">B</text>
      <path d="M 145 82 L 175 82 M 170 78 L 175 82 L 170 86" stroke="oklch(0.82 0.18 192)" strokeWidth="1.5" fill="none" />
      <path d="M 175 98 L 145 98 M 150 94 L 145 98 L 150 102" stroke="oklch(0.65 0.30 330)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

const THUMBS = {
  physics: ProjectileThumb,
  biology: DnaThumb,
  chemistry: ChemistryThumb,
} as const;

export function ExperimentShowcase({
  section,
  className,
}: { section: Section; className?: string }) {
  const items = (section.items as unknown as ExperimentItem[]) ?? [];
  const locale = typeof document !== 'undefined' ? document.documentElement.lang || 'en' : 'en';

  return (
    <section id={section.id} className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-4 text-balance">
          {section.title}
        </h2>
        {section.description && (
          <p className="text-muted-foreground text-center text-lg mb-12 text-balance">
            {section.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const ThumbComponent = THUMBS[item.subject as keyof typeof THUMBS] ?? ProjectileThumb;
            return (
              <Link
                key={i}
                href={item.url}
                onClick={() =>
                  track('experiment_card_click', {
                    experiment_id: item.url.split('/').pop() ?? 'unknown',
                    subject: item.subject,
                    grade: item.grade,
                    locale,
                  })
                }
                className="group block overflow-hidden rounded-lg border border-border bg-card hover:shadow-xl hover:border-primary/40 transition-all duration-200"
              >
                <div className="aspect-video overflow-hidden">
                  <ThumbComponent />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {item.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">· {item.grade}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Step 4: 跑测试**
```bash
pnpm vitest run src/themes/default/blocks/__tests__/experiment-showcase.test.tsx
pnpm lint
pnpm tsc --noEmit
```

**Step 5: Commit**
```bash
git add src/themes/default/blocks/experiment-showcase.tsx src/themes/default/blocks/__tests__/experiment-showcase.test.tsx
git commit -m "feat(homepage): replace experiment card PNG thumbs with inline SVG (dark+neon)"
```

---

### Task 19: Header 路由感知变体（仅 / 路由去 icon）

**Files:**
- Modify: `src/themes/default/blocks/header.tsx`

**Step 1: Read current**
```bash
cat /Users/smith/Desktop/scivra/src/themes/default/blocks/header.tsx
```

**Step 2: 加 pathname 检测 + 条件渲染**

找到 nav items 渲染处（`section.nav.items.map(...)`），把单一渲染改为：
```tsx
'use client';
import { usePathname } from 'next/navigation';

// 在组件内：
const pathname = usePathname();
const isHomepage = pathname === '/' || /^\/[a-z]{2}$/.test(pathname);

// 渲染 nav item 时：
{section.nav.items.map((item, idx) => (
  <Link key={idx} href={item.url}>
    {isHomepage ? (
      // homepage variant — text only, no icon
      <span className="text-sm font-medium">{item.title}</span>
    ) : (
      // dashboard / other routes — keep icon
      <>
        {item.icon && <SmartIcon name={item.icon} size={16} />}
        <span>{item.title}</span>
      </>
    )}
  </Link>
))}
```

**Step 3: lint + typecheck**
```bash
pnpm lint
pnpm tsc --noEmit
```

**Step 4: Commit**
```bash
git add src/themes/default/blocks/header.tsx
git commit -m "feat(header): text-only nav variant on homepage routes (/ and /zh)"
```

---

### Task 20: Hero E2E 测试（Playwright）

**Files:**
- Create: `tests/e2e/hero.spec.ts`

**Step 1: 写 E2E 测试**

`tests/e2e/hero.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test.describe('Homepage Hero · V3 static SVG', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('H1 is visible and serves as LCP element', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Experiments|Textbook/);
  });

  test('hero SVG illustration renders', async ({ page }) => {
    const svg = page.locator('svg[data-hero-illustration]');
    await expect(svg).toBeVisible();
  });

  test('FreePik hero image is NOT present', async ({ page }) => {
    const freepikImg = page.locator('img[src*="student-discovery"]');
    expect(await freepikImg.count()).toBe(0);
  });

  test('primary CTA is keyboard focusable and fires analytics', async ({ page }) => {
    // Intercept analytics fallback endpoint
    const analyticsCalls: Array<{ event: string; payload: any }> = [];
    await page.route('**/api/analytics/event', async (route) => {
      const body = route.request().postDataJSON() as any;
      analyticsCalls.push(body);
      await route.fulfill({ status: 204 });
    });

    await page.keyboard.press('Tab'); // skip link or first focusable
    // Find Try Your First Experiment button and click it
    const cta = page.getByRole('link', { name: /Try Your First Experiment|Start|First/i }).first();
    await expect(cta).toBeVisible();
    await cta.click();

    // Wait a tick for fetch to fire
    await page.waitForTimeout(200);
    expect(analyticsCalls.some(c => c.event === 'hero_cta_click')).toBe(true);
  });

  test('reduced motion disables animation', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const strokeOffset = await page.locator('[data-hero-path]').evaluate(
      (el) => window.getComputedStyle(el).strokeDashoffset
    );
    expect(strokeOffset).toBe('0px');
    await context.close();
  });
});
```

**Step 2: 跑测试（需 dev server）**
```bash
# 终端 1: pnpm dev
# 终端 2:
pnpm test:e2e tests/e2e/hero.spec.ts
```
**Expected:** 5 tests PASS

**Step 3: Commit**
```bash
git add tests/e2e/hero.spec.ts
git commit -m "test(e2e): hero LCP + SVG + CTA analytics + reduced-motion"
```

---

### Task 21: Phase 1 最终验证 + tag

**Step 1: 跑全套**
```bash
cd /Users/smith/Desktop/scivra
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
# dev server 起后：
pnpm seo:audit http://localhost:3000
pnpm lighthouse:baseline
```

**Step 2: 对比 baseline**

对比 `docs/baselines/homepage-<phase-0-date>-*.json` 和 Phase 1 新 baseline：
- performance：不低于 baseline（允许 -5 分容忍）
- LCP：不高于 baseline + 30%
- SEO：100（canonical/OG 齐全）

**Step 3: 人工 design review**
- 开 http://localhost:3000 看 light/dark 两版
- 开 http://localhost:3000/zh 看中文版
- 对比 `_design/demos/dir2/index.html` 是否在意图上一致
- 记录 review 结果到 `docs/decisions/2026-04-XX-phase1-review.md`

**Step 4: 打 tag**
```bash
git tag -a phase-1-complete -m "Homepage overhaul Phase 1: V3 static SVG hero deployed"
```

**Step 5: 更新 plan frontmatter**

Edit `docs/plans/2026-04-22-homepage-visual-overhaul.md` status → `phase-1-complete-in-observation`

```bash
git add docs/plans/2026-04-22-homepage-visual-overhaul.md
git commit -m "docs(plan): mark phase 1 complete, enter Phase 2 observation"
```

---

## Phase 2 · Observation（14 天，非编码）

Phase 2 不需要拆 task——每日监控，14 天后决定 Phase F。runbook 已在 Task 9 完成。

---

## 执行选择

**Plan 完成并保存到 `docs/plans/2026-04-23-homepage-overhaul-execution.md`。两种执行方式**：

**1. Subagent-Driven（本会话内）** — 我为每个 Task 派一个新的 subagent，Task 之间我 review + 确认，用户可随时介入
**2. Parallel Session（独立会话）** — 另开一个 Claude Code 会话用 `superpowers:executing-plans`，批量执行 + checkpoint

**按照用户「全部按你的建议方案来」** → 我采用 **Subagent-Driven 模式**，从 Task 1 开始逐个执行，每个 Task 完成后汇报给你 git diff + 验证结果。
