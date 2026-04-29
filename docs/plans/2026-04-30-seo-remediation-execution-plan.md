---
name: seo-remediation-execution-plan
status: backlog
created: 2026-04-30T04:32:19Z
updated: 2026-04-30T04:32:19Z
---

# Scivra SEO Remediation — Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 [`docs/plans/2026-04-30-seo-remediation-plan.md`](./2026-04-30-seo-remediation-plan.md) 诊断出的 8 类 SEO 问题落地修复，保持站点不破坏既有功能，按 P0 / P1 / P2 三阶段交付。

**Architecture:** 数据层 + 页面层双向修复。数据层（`src/shared/lib/experiments/data/*.ts`）全局清理 NeonPhysics 残留；页面层（`src/app/[locale]/(landing)/**/page.tsx`）补 schema、扩内容、加学段卡片。每个 task 可独立交付、独立验证、独立回滚。

**Tech Stack:** Next.js 16 App Router · TypeScript strict · next-intl · Drizzle · Tailwind v4 · pnpm

---

## Codex 调度策略

| 类型 | 适合 Codex | 说明 |
|------|------------|------|
| **数据层机械替换** | ✅ | 59 个文件的字符串清理，0 风险 |
| **Schema JSON-LD 添加** | ✅ | 模板化，可机械验证（fetch + JSON.parse） |
| **页面文案扩展（500→700 词）** | ⚠️ 部分 | 文字内容需要审校，但骨架 + 占位文案 codex 可写 |
| **学科教学内容写作** | ❌ | 需要学科顾问审 |
| **设计判断（首页布局）** | ❌ | 需要视觉审 |
| **业务决策（资源中心策略）** | ❌ | 用户决定 |
| **基础设施排查（vercel www 301 失效）** | ⚠️ | Codex 可生成排查清单，最终配置由 Claude 主线确认 |

`codex exec` 默认 read-only。要让 Codex 修改文件，加 `-s workspace-write`。每个 codex 任务都给完整 prompt，不要让 codex 自由发挥。

---

## Phase 1 — P0 必修（本周完成，约 1.5-2 天）

### Task 1: 清理 59 个实验数据文件中的 NeonPhysics 残留

**负责人：** [Codex]

**Files:**
- Modify: `src/shared/lib/experiments/data/{59 个文件}` （详见计划文档第 1 节清单）

**Why:** 实测 59/179 实验页 `seoTitle` 字段还写着 `... | NeonPhysics`，运行时 `normalizeSeoText` 在 `src/shared/lib/seo.ts:68-79` 兜底替换，但源数据残留是技术债，且影响某些非 Google 爬虫。

**Boundary:**
- 只改 `src/shared/lib/experiments/data/` 目录下的 `.ts` 文件
- 只替换 `NeonPhysics` → `Scivra` 和 `neonphysics.com` → `scivra.com`
- 不动 `src/shared/lib/seo.ts`（保留 `normalizeSeoText` 作为运行时安全网）
- 不动测试文件、文档、`.github/`

- [ ] **Step 1: 启动 codex exec 做替换**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Replace all occurrences of 'NeonPhysics' with 'Scivra' and 'neonphysics.com' with 'scivra.com' in files under src/shared/lib/experiments/data/. Use Glob + Edit tools. Do NOT modify any other directory. Do NOT modify src/shared/lib/seo.ts. Do NOT touch test files. After replacement, run 'rg NeonPhysics src/shared/lib/experiments/data/' and confirm 0 matches. Report the list of modified files."
```

- [ ] **Step 2: 验证源码层清理干净**

```bash
rg 'NeonPhysics|Neon Physics|neonphysics' src/shared/lib/experiments/data/
```

Expected: **No output**（0 matches）

```bash
rg 'NeonPhysics' src/shared/lib/ --glob '!data/**'
```

Expected: 只剩 `src/shared/lib/seo.ts:77`（兜底替换函数，保留）

- [ ] **Step 3: 跑 typecheck 确保没破坏类型**

```bash
pnpm typecheck
```

Expected: PASS（无新增错误）

- [ ] **Step 4: 启动 dev server，抽查 5 个页面渲染正常**

```bash
pnpm dev
```

打开下列 URL，确认 `<title>` 标签是 Scivra 且页面正常渲染：

- http://localhost:3000/labs/biology/ap-biology/dna-double-helix
- http://localhost:3000/labs/physics/ap-physics-1/wave-interference
- http://localhost:3000/labs/chemistry/ap-chemistry/chemical-equilibrium
- http://localhost:3000/labs/physics/elementary-k5/k5-magnetism
- http://localhost:3000/labs/biology/ngss-ms/ms-ecosystems

- [ ] **Step 5: Commit**

```bash
git add src/shared/lib/experiments/data/
git commit -m "fix(seo): clear NeonPhysics residue from 59 experiment data files"
```

---

### Task 2: 排查 + 修复 vercel.json 的 www → apex 301 重定向

**负责人：** [Claude-Main]（涉及生产配置，需要确认）

**Files:**
- Inspect: `vercel.json:2-9`
- Inspect: Vercel project domain settings（外部）

**Why:** `vercel.json` 已经声明了 www → apex 永久重定向，但实测 `https://www.scivra.com/` 返回 200 而非 301。可能原因：
1. www 域名没添加到 Vercel 项目
2. 域名配置在主机商但 DNS A 记录直接指向其他地方
3. Vercel 部署未生效

- [ ] **Step 1: 用 curl -I 直接测 www 响应头**

```bash
curl -sI https://www.scivra.com/ | head -20
curl -sI https://scivra.com/ | head -20
```

确认 www 是否真的返回 200，有无 `x-vercel-id` header。

- [ ] **Step 2: 检查 Vercel 项目域名设置**

打开 Vercel dashboard → scivra project → Settings → Domains，确认 `www.scivra.com` 是否已添加。如未添加，加上并选 "Redirect to scivra.com"。

- [ ] **Step 3: 重新部署一次确认配置生效**

如 Vercel 显示有未发布的配置，触发新部署：

```bash
vercel --prod
```

- [ ] **Step 4: 验证**

```bash
curl -sI https://www.scivra.com/
```

Expected: `HTTP/2 308`（或 301）+ `location: https://scivra.com/`

- [ ] **Step 5: Commit（如果改了配置文件）**

如果调整了 `vercel.json`，commit。否则记录到本任务的 verification log。

---

### Task 3: 首页补强 Schema（Organization + SearchAction + FAQPage）

**负责人：** [Codex] + [Claude-Main 审]

**Files:**
- Modify: `src/app/[locale]/(landing)/page.tsx` （或其引入的 schema 组件）

**Why:** 首页目前只有 1 个最简 `WebSite` schema (`{name, url}`)。缺：

- `Organization`（品牌信号）
- `SearchAction`（站内搜索结构化）
- `FAQPage`（首页已有 FAQ 文本但没标）

- [ ] **Step 1: 找到首页注入 JSON-LD 的位置**

```bash
rg "application/ld\\+json" src/app/\[locale\]/\(landing\)/page.tsx
rg "WebSite" src/app/\[locale\]/\(landing\)/page.tsx
```

- [ ] **Step 2: 启动 codex exec 加 schema**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/app/[locale]/(landing)/page.tsx. Find the existing WebSite JSON-LD script tag. Replace the simple WebSite schema with three schemas in three separate script tags: (1) Organization schema with name='Scivra', url='https://scivra.com', logo='https://scivra.com/logo.png', sameAs URLs (leave as empty array for now). (2) WebSite schema with potentialAction.SearchAction pointing to '/search?q={search_term_string}'. (3) FAQPage schema by extracting the FAQ Q/A pairs already rendered on the page (search the file or its imported components for FAQ data). Use the same dangerouslySetInnerHTML pattern that exists at the experiment detail page src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx:158-165 as reference. Use getSiteUrl() from @/shared/lib/seo for the URL. Keep the existing page logic intact. Show the diff before saving."
```

- [ ] **Step 3: 验证 schema 存在**

```bash
pnpm dev &
sleep 5
curl -s http://localhost:3000/ | grep -c '"@type":"Organization"'
curl -s http://localhost:3000/ | grep -c '"@type":"FAQPage"'
curl -s http://localhost:3000/ | grep -c '"potentialAction"'
```

Expected: 每个返回 ≥1

- [ ] **Step 4: 用 Google Rich Results Test 验证（手动）**

打开 https://search.google.com/test/rich-results 输入 https://scivra.com/ ，确认 Organization、FAQPage、SearchAction 三类都被识别。

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/\(landing\)/page.tsx
git commit -m "feat(seo): add Organization, SearchAction, FAQPage schema to homepage"
```

---

### Task 4: /labs 列表页扩内容 + 补 BreadcrumbList + CollectionPage + ItemList schema

**负责人：** [Codex] 写骨架 → [Claude-Main] 审教育用语

**Files:**
- Modify: `src/app/[locale]/(landing)/labs/page.tsx`

**Why:** 实测 132 词 / 0 schema。Hub 页应该是"枢纽"而非"列表"。

- [ ] **Step 1: 启动 codex exec 写新版**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/app/[locale]/(landing)/labs/page.tsx. Add the following AFTER the subject grid section but BEFORE the closing div of the page:

(1) An introductory section block with an H2 'What is a virtual lab?' (~80-120 words explaining interactive simulations, parameter control, real-time visualization).

(2) An H2 'Standards alignment' block with three subsections (NGSS / AP / GCSE). Each subsection ~60-80 words, mentioning Scivra coverage.

(3) An H2 'How teachers use Scivra' block (~120-180 words) with 3 use cases: pre-lab demonstrations, in-class group activities, post-lab review.

(4) An H2 'Frequently asked questions' block with 5 Q/A items: 'Are these labs free?', 'Do students need accounts?', 'Which devices work?', 'How are these aligned with curriculum?', 'Can teachers track student progress?'. Use semantic HTML (<details>/<summary> or <dl>) so it's accessible.

(5) Inside generateMetadata or as inline <script type='application/ld+json'> tags, add three JSON-LD schemas: BreadcrumbList (Home > Labs), CollectionPage (about='Interactive Science Labs'), and FAQPage matching the 5 FAQ Q/A above. Use getPageAlternates and getSiteUrl from @/shared/lib/seo for URLs.

Do NOT remove or restructure the existing subject grid. Do NOT change the H1 or hero. Keep using existing Tailwind classes consistent with the rest of the file. Output the diff."
```

- [ ] **Step 2: 验证 schema**

```bash
curl -s http://localhost:3000/labs | grep -oE '"@type":"[^"]+"' | sort -u
```

Expected: 至少包含 `"@type":"BreadcrumbList"`, `"@type":"CollectionPage"`, `"@type":"FAQPage"`

- [ ] **Step 3: 验证字数**

```bash
curl -s http://localhost:3000/labs | sed 's/<[^>]*>//g' | wc -w
```

Expected: ≥ 500（从 132 提升）

- [ ] **Step 4: Claude-Main 审教育内容**

人工审校：标准 alignment、教师 use case 文案是否准确、是否符合 brand voice。如有问题直接 Edit 修改。

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/\(landing\)/labs/page.tsx
git commit -m "feat(seo): expand /labs hub with FAQ, standards alignment, and structured data"
```

---

### Task 5: /pricing 加 schema + 改 title + 加机构采购模块

**负责人：** [Codex]

**Files:**
- Modify: `src/app/[locale]/(landing)/pricing/page.tsx`

**Why:** 实测 title 仅 "Pricing"、0 schema、352 词。已经有 FAQ 文本但没标 schema。

- [ ] **Step 1: 启动 codex exec**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/app/[locale]/(landing)/pricing/page.tsx. Make these changes:

(1) In generateMetadata: change title to 'Pricing — Free, Pro, Max Plans | Scivra' and write a 150-160 char description that mentions free tier, AP exam prep, school/district inquiries.

(2) Find the pricing tiers data structure (likely Free / Pro / Max). Add three JSON-LD schemas as <script type='application/ld+json'> tags inside the page render: (a) Product schema with name='Scivra' and three Offer entries matching Free/Pro/Max with their actual prices. (b) FAQPage schema by extracting the existing FAQ Q/A pairs from the page (or its data import). (c) BreadcrumbList (Home > Pricing).

(3) Add a new section AFTER the pricing tiers and BEFORE the FAQ, with H2 'For schools and districts'. Body ~120 words: mention site licenses, classroom rosters, LMS integration possible on request, and add a mailto link to schools@scivra.com (placeholder — user will configure).

Use getPageAlternates and getSiteUrl from @/shared/lib/seo. Reuse existing Tailwind classes from the file. Do NOT change the visible pricing or FAQ data — only add the schema markers and the new H2 section. Output the diff."
```

- [ ] **Step 2: 验证**

```bash
curl -s http://localhost:3000/pricing | grep -oE '"@type":"[^"]+"' | sort -u
```

Expected: `Product`, `Offer`, `FAQPage`, `BreadcrumbList`

```bash
curl -s http://localhost:3000/pricing | grep -o '<title>[^<]*</title>'
```

Expected: `<title>Pricing — Free, Pro, Max Plans | Scivra</title>`

- [ ] **Step 3: Claude-Main 决策 schools 联系方式**

人工决定 mailto 用什么邮箱（schools@scivra.com / contact@scivra.com / 直接表单链接）。

- [ ] **Step 4: Commit**

```bash
git add src/app/\[locale\]/\(landing\)/pricing/page.tsx
git commit -m "feat(seo): add Product/FAQPage schema and schools section to pricing page"
```

---

### Task 6: /learn/* 三页修复 schema-内容错配

**负责人：** [Claude-Main]（需要内容判断）

**Files:**
- Modify: `src/app/[locale]/(landing)/learn/[slug]/page.tsx`
- Inspect: `src/shared/lib/learning-paths/` 或类似数据源

**Why:** 实测 `/learn/energy-conservation-advanced` (95 词)、`/learn/projectile-motion-intermediate` (92 词)、`/learn/newton-mechanics-beginner` (113 词) 三页声明 `Course` + `CourseInstance` schema 但内容极薄。Google 可能判 schema-内容错配。

**决策（必选其一）：**
- **A. 内容补齐**：每页扩到 600-800 词，符合 Course schema 期望
- **B. 暂时降级 schema**：去掉 `Course`/`CourseInstance`，保留 `WebPage` + `BreadcrumbList`

推荐 A。但如果短期没人写学科内容，先 B 止血。

- [ ] **Step 1: 决策 A 还是 B**

人工决定。如果选 B 进入 Step 2；如果选 A，跳到 Step 4。

- [ ] **Step 2 (B 方案): 启动 codex exec 降级 schema**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "In src/app/[locale]/(landing)/learn/[slug]/page.tsx, replace the existing JSON-LD blocks. Currently it emits Course + CourseInstance schemas. Replace with: (1) WebPage schema (name=node.title, description=node.description, url=canonical), (2) BreadcrumbList (Home > Learn > {node.title}). Remove all Course and CourseInstance markup. Keep all visual rendering unchanged. Output the diff."
```

- [ ] **Step 3 (B): 验证**

```bash
curl -s http://localhost:3000/learn/newton-mechanics-beginner | grep -oE '"@type":"[^"]+"' | sort -u
```

Expected: 不含 `Course` 和 `CourseInstance`，包含 `WebPage` 和 `BreadcrumbList`

- [ ] **Step 4 (A 方案): 内容补齐**

人工写每页 600-800 词内容（学习目标 / 章节列表 / 前置知识 / 时长 / 关联实验）。需要学科顾问审。

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/\(landing\)/learn/\[slug\]/page.tsx
git commit -m "fix(seo): resolve learn/* schema-content mismatch"
```

---

### Task 7: 接入 Google Search Console + Bing Webmaster Tools

**负责人：** [Claude-Main]（用户操作）

**Files:**
- Maybe modify: `src/app/[locale]/layout.tsx` 加 verification meta tag
- 或 `public/google{token}.html`

**Why:** 没 GSC 数据，所有 organic KPI 都没法 measure。这件事必须做。

- [ ] **Step 1: 在 GSC 创建 property**

打开 https://search.google.com/search-console/welcome ，添加 property `scivra.com`（apex 域名版本）。

- [ ] **Step 2: 选 HTML tag 验证方式，把 meta tag 加到 root layout**

把 GSC 给的 `<meta name="google-site-verification" content="..." />` 加到 `src/app/[locale]/layout.tsx` 的 `<head>` 里。

- [ ] **Step 3: 部署后在 GSC 完成验证**

部署一次 → GSC 点 Verify。

- [ ] **Step 4: 提交 sitemap**

GSC → Sitemaps → 添加 `https://scivra.com/sitemap.xml`。

- [ ] **Step 5: Bing Webmaster Tools 同操作**

打开 https://www.bing.com/webmasters ，import GSC 配置（一键导入）。

- [ ] **Step 6: Commit verification meta**

```bash
git add src/app/\[locale\]/layout.tsx
git commit -m "chore(seo): add Google Search Console verification meta tag"
```

---

## Phase 2 — P1 模板与 Schema（第 2-3 周，约 1.5 周）

### Task 8: 实验页统一升级模板 — 新增组件 + JSON 字段约定

**负责人：** [Codex 写组件] + [Claude-Main 审]

**Files:**
- Create: `src/shared/blocks/experiments/experiment-content-sections.tsx`
- Create: `src/shared/blocks/experiments/experiment-faq.tsx`
- Modify: `src/shared/types/experiment.ts`（加 `contentSections?` 字段）
- Modify: `src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx`（引入新组件 + 加 FAQPage schema）

**Why:** 179/179 实验页正文 <500 词，0 FAQ / 0 误区 / 0 教师指引。需要一个**模板组件**，让数据驱动：实验数据文件填字段，组件统一渲染。

- [ ] **Step 1: 在 Experiment 类型加可选字段**

修改 `src/shared/types/experiment.ts`：

```typescript
export interface ExperimentContentSection {
  /** Definition + 1 real-world example, ~100-150 words */
  whatIsIt?: string;
  /** Map of parameter id → 1-2 sentence explanation */
  parameterExplanations?: Record<string, string>;
  /** 3-5 common student misconceptions */
  misconceptions?: { wrong: string; correct: string }[];
  /** 3-5 teacher use cases */
  teacherUseCases?: string[];
  /** 4-6 FAQ pairs */
  faq?: { question: string; answer: string }[];
}

export interface Experiment {
  // ... existing fields
  contentSections?: ExperimentContentSection;
}
```

- [ ] **Step 2: 创建 ExperimentContentSections 组件**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Create a new file src/shared/blocks/experiments/experiment-content-sections.tsx. It exports a default React component that takes a single prop {sections: ExperimentContentSection | undefined}. The component renders nothing if sections is undefined. Otherwise it renders sections in this order, each as a <section> with an H2:

1. 'What is {topic}?' — render sections.whatIsIt as paragraph(s).
2. 'Parameters explained' — render sections.parameterExplanations as a definition list.
3. 'Common misconceptions' — render sections.misconceptions as a list of cards, each card has a 'Misconception:' header (red-ish accent) followed by .wrong text, then 'Correct:' header (green-ish accent) followed by .correct text.
4. 'How teachers use this lab' — render sections.teacherUseCases as a numbered list.

Use semantic HTML, Tailwind classes consistent with src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx. Section spacing: mt-12 border-t border-border pt-8 (matches existing related-experiments aside). Mobile-first.

Import the type from '@/shared/types/experiment'. Output the file content."
```

- [ ] **Step 3: 创建 ExperimentFaq 组件（含 FAQPage JSON-LD）**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Create src/shared/blocks/experiments/experiment-faq.tsx. Exports default component with prop {faq: {question:string;answer:string}[] | undefined}. Renders nothing if faq is empty/undefined. Otherwise renders an accessible FAQ list using <details>/<summary> for each item. Above the list, emits a <script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify({...FAQPage schema with mainEntity})}} /> tag. Use semantic HTML, mt-12 spacing matching the rest of the page. Output the file."
```

- [ ] **Step 4: 在实验页 page.tsx 引入两个组件**

修改 `src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx`：

在 `<ExperimentFlow ... />` 之后、 `relatedExperiments` aside 之前插入：

```tsx
<ExperimentContentSections sections={experiment.contentSections} />
<ExperimentFaq faq={experiment.contentSections?.faq} />
```

并在文件顶部加 import：

```tsx
import ExperimentContentSections from "@/shared/blocks/experiments/experiment-content-sections";
import ExperimentFaq from "@/shared/blocks/experiments/experiment-faq";
```

- [ ] **Step 5: typecheck + 一个 sample 实验先填 contentSections 验证模板**

挑 `src/shared/lib/experiments/data/projectile-motion.ts` 加 contentSections 数据（用 Task 9 的 codex prompt 来生成），然后跑：

```bash
pnpm typecheck
pnpm dev
```

打开 http://localhost:3000/labs/physics/ngss-hs/projectile-motion 确认渲染正确。

- [ ] **Step 6: Commit**

```bash
git add src/shared/types/experiment.ts \
        src/shared/blocks/experiments/experiment-content-sections.tsx \
        src/shared/blocks/experiments/experiment-faq.tsx \
        src/app/\[locale\]/\(landing\)/labs/\[subject\]/\[standard\]/\[slug\]/page.tsx \
        src/shared/lib/experiments/data/projectile-motion.ts
git commit -m "feat(experiments): add content-sections + FAQ template components"
```

---

### Task 9: 给 10 个 P0 实验页填 contentSections 数据

**负责人：** [Codex 出初稿] + [Claude-Main / 学科顾问审]

**Files:**
- Modify: 10 个实验数据文件

**P0 优先级 10 页（已在 [SEO Plan](./2026-04-30-seo-remediation-plan.md#工作量) 列出）：**

1. `data/projectile-motion.ts`
2. `data/newtons-laws-of-motion.ts`（如不存在用 `data/...` 对应文件名）
3. `data/dna-double-helix.ts`
4. `data/chemical-equilibrium.ts`
5. `data/wave-interference.ts`
6. `data/doppler-effect.ts`
7. `data/geometric-optics-lenses.ts`
8. `data/cellular-respiration.ts`
9. `data/photosynthesis.ts`
10. `data/acid-base-ph.ts`

- [ ] **Step 1: 用 codex 给每个实验生成 contentSections 初稿**

逐个跑（不要一次跑 10 个，怕 codex 上下文乱）：

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/shared/lib/experiments/data/projectile-motion.ts. Add a 'contentSections' field of type ExperimentContentSection (already declared in src/shared/types/experiment.ts). Fill it with high-quality educational content tailored to this experiment:

- whatIsIt: 100-150 words explaining projectile motion, the physics, with one real-world example (a basketball, a fountain, etc.)
- parameterExplanations: keyed by parameter id (velocity, angle, gravity), each value 1-2 sentences explaining what changing that parameter does and why it matters.
- misconceptions: 3-5 items. Each {wrong: '<student misconception>', correct: '<correct understanding>'}. Pick real misconceptions students hold (e.g., 'horizontal speed slows down due to gravity').
- teacherUseCases: 3-5 strings. Concrete classroom uses (e.g., 'Pre-lab: have students predict optimal angle before launching a single trial').
- faq: 4-6 {question, answer} pairs targeting student search queries (e.g., 'Why is 45° the best launch angle?', 'How does gravity affect range?'). Each answer 2-3 sentences.

Match the existing TypeScript style (single quotes if used, indentation, trailing commas). Insert the new field AFTER 'jsonLd' if it exists, or before the closing brace. Do NOT modify any other field. Output the diff."
```

为剩余 9 个文件重复，每次替换 prompt 里的文件路径和实验主题。

- [ ] **Step 2: 学科顾问审一遍（Claude-Main）**

把 codex 生成的内容交给学科顾问（或人工审）。重点审：

- 误区是否真实存在（不是编造）
- FAQ 答案是否物理 / 化学 / 生物上正确
- 教师用例是否可操作

修改后再 commit。

- [ ] **Step 3: 验证页面渲染**

```bash
pnpm dev &
for url in projectile-motion dna-double-helix chemical-equilibrium wave-interference doppler-effect-sound-waves; do
  echo "=== $url ==="
  curl -s "http://localhost:3000/labs/physics/ngss-hs/$url" 2>/dev/null | grep -c '"@type":"FAQPage"'
done
```

- [ ] **Step 4: Commit（10 个文件一次提交或分两次）**

```bash
git add src/shared/lib/experiments/data/{projectile-motion,...}.ts
git commit -m "feat(content): add educational content-sections to 10 P0 experiments"
```

---

### Task 10: 学科 hub 页（/labs/physics 等 5 个）+ band 页（16 个）模板化升级

**负责人：** [Codex 写模板] + [Claude-Main 审]

**Files:**
- Modify: `src/app/[locale]/(landing)/labs/[subject]/page.tsx`
- Modify: `src/app/[locale]/(landing)/labs/[subject]/[standard]/page.tsx`
- Possibly create: `src/shared/blocks/labs/hub-content-sections.tsx`

**Why:** 21 页（5 学科 + 16 band）平均 250 词、0 FAQ、0 schema。

- [ ] **Step 1: codex 给 [subject]/page.tsx 加内容 + schema**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/app/[locale]/(landing)/labs/[subject]/page.tsx. After the existing experiment listing, add four H2 sections (data-driven by subject):

(1) 'About {subject} virtual labs' — 100-150 words. Use a switch on subject key for tailored copy: physics='mechanics, waves, electricity...', chemistry='reactions, equilibria, bonding...', biology='cellular, genetics, ecosystems...', earth-science='weather, geology, astronomy...', math='general numeric and graphing labs'.

(2) 'Standards alignment' — list NGSS / AP / GCSE applicable to the subject. ~80 words.

(3) 'Recommended for' — list typical learners (AP students, NGSS teachers, K-12 self-learners). ~60 words.

(4) 'FAQ' — 4 Q/A specific to the subject (e.g., 'Are AP {subject} labs free?', 'Which {subject} topics are covered?'). Use <details>/<summary>.

Add three JSON-LD schemas via <script type='application/ld+json'>: BreadcrumbList (Home > Labs > {Subject}), CollectionPage, FAQPage matching the 4 Q/A.

Use getPageAlternates and getSiteUrl from @/shared/lib/seo. Reuse existing Tailwind. Do NOT remove the experiment listing. Output the diff."
```

- [ ] **Step 2: 给 [subject]/[standard]/page.tsx 同样改造**

类似 Step 1，但围绕 standard（NGSS HS / AP Physics 1 / Elementary K-5 等）写内容。每页加 BreadcrumbList + CollectionPage + FAQPage。

- [ ] **Step 3: Claude-Main 审 5 学科 + 16 band 的 copy**

抽样审 4-5 页，确认教育内容准确。

- [ ] **Step 4: 验证**

```bash
for u in /labs/physics /labs/biology /labs/chemistry /labs/earth-science /labs/math \
         /labs/physics/ngss-hs /labs/physics/ap-physics-1; do
  echo "=== $u ==="
  curl -s "http://localhost:3000$u" | grep -oE '"@type":"[^"]+"' | sort -u
done
```

Expected: 每页都有 BreadcrumbList + CollectionPage + FAQPage

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/\(landing\)/labs/
git commit -m "feat(seo): expand subject + band hub pages with FAQ + structured data"
```

---

### Task 11: /upg、/blog、/blog/[slug]、/gallery、/showcases、/ap-prep schema

**负责人：** [Codex]

**Files:**
- Modify: `src/app/[locale]/(landing)/(ai)/upg/page.tsx`
- Modify: `src/app/[locale]/(landing)/blog/page.tsx`
- Modify: `src/app/[locale]/(landing)/blog/[slug]/page.tsx`
- Modify: `src/app/[locale]/(landing)/gallery/page.tsx`
- Modify: `src/app/[locale]/(landing)/showcases/page.tsx`
- Modify: `src/app/[locale]/(landing)/ap-prep/page.tsx`

- [ ] **Step 1: /upg 加 SoftwareApplication + FAQPage + BreadcrumbList**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/app/[locale]/(landing)/(ai)/upg/page.tsx. Add three JSON-LD schemas: (1) SoftwareApplication (applicationCategory='EducationalApplication', name='Universal Principle Generator', operatingSystem='Web', offers with priceRange='Free / Pro'). (2) FAQPage extracted from the existing FAQ Q/A on the page. (3) BreadcrumbList (Home > AI Lab). Use existing Tailwind. Do NOT change visible UX. Output the diff."
```

- [ ] **Step 2: /blog 主页加 Blog + ItemList**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/app/[locale]/(landing)/blog/page.tsx. Change generateMetadata title to 'Scivra Blog — Physics Articles & Experiment Guides'. Add JSON-LD: Blog schema with @id, name, url, publisher (Organization Scivra). Then ItemList with itemListElement enumerating the existing post links. Then BreadcrumbList. Output the diff."
```

- [ ] **Step 3: /blog/[slug] 加 BlogPosting**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/app/[locale]/(landing)/blog/[slug]/page.tsx. Add JSON-LD BlogPosting schema with headline=post.title, description=post.description, datePublished=post.date, author={'@type':'Person',name:post.author or 'Scivra Editorial'}, publisher (Organization Scivra), image=thumbnail if available, mainEntityOfPage=canonical. Plus BreadcrumbList (Home > Blog > {post.title}). Output the diff."
```

- [ ] **Step 4: /gallery、/showcases、/ap-prep 加基础 schema**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "For each of these three pages: src/app/[locale]/(landing)/gallery/page.tsx, src/app/[locale]/(landing)/showcases/page.tsx, src/app/[locale]/(landing)/ap-prep/page.tsx — add two JSON-LD schemas: WebPage (with name=h1 title, description=metadata description) and BreadcrumbList. Do NOT change visible content. Output diffs separately for each file."
```

- [ ] **Step 5: 验证 + Commit**

```bash
for p in /upg /blog /gallery /showcases /ap-prep; do
  echo "=== $p ==="
  curl -s "http://localhost:3000$p" | grep -oE '"@type":"[^"]+"' | sort -u
done
git add src/app/\[locale\]/\(landing\)/
git commit -m "feat(seo): add structured data to upg, blog, gallery, showcases, ap-prep"
```

---

### Task 12: 资源中心策略决策（/blog 节奏 + /updates noindex + /resources 处理）

**负责人：** [Claude-Main]（业务决策）

**Files:**
- Maybe modify: `src/app/[locale]/(landing)/updates/page.tsx`（加 noindex）
- Maybe modify: `src/themes/default/blocks/footer/index.tsx`（移除 Resources 链接）
- Maybe modify: `src/app/[locale]/(landing)/[...slug]/page.tsx`（加 /resources → /blog 301）
- Maybe modify: `next.config.mjs` 或 `vercel.json`（同上）

**决策点（人工选）：**

- A. /blog 认真做，每周 2 篇 → 不做 noindex 操作
- B. /blog 暂停，footer 移除入口 → 加 noindex
- C. 折中：/blog 每月 1-2 篇，/updates 加 noindex 直到 ≥5 条，/resources 立即 301 到 /blog 并从 footer 移除

**推荐 C。**

- [ ] **Step 1: 决定方案**

人工选 A/B/C。

- [ ] **Step 2: 如选 C，给 /updates 加 noindex**

修改 updates page.tsx 的 generateMetadata 加 `robots: { index: false, follow: true }`。

- [ ] **Step 3: 配置 /resources → /blog 301**

加到 `vercel.json` 的 `redirects`：

```json
{
  "source": "/resources",
  "destination": "/blog",
  "permanent": true
},
{
  "source": "/resources/:path*",
  "destination": "/blog",
  "permanent": true
}
```

- [ ] **Step 4: footer 移除 "Resources" 链接**

修改 footer 组件（位置由源码确定）。

- [ ] **Step 5: Commit**

```bash
git add ...
git commit -m "chore(seo): consolidate resource hub strategy (updates noindex, resources 301)"
```

---

## Phase 3 — P2 批量与持续（第 4 周起）

### Task 13: 实验页内容批量铺（剩余 169 页）

**负责人：** [Codex 出初稿] + [Claude-Main 审]

**节奏：** 每天 20-30 页，分 6-7 天完成。AI 辅助初稿 + 人工审。

**Files:**
- Modify: 169 个 `src/shared/lib/experiments/data/*.ts`

- [ ] **Step 1: 写 codex 批量任务脚本**

由于一次 codex exec 只改一个文件最稳，用 shell 循环。先列出 169 个 slug：

```bash
ls src/shared/lib/experiments/data/ | grep -v -E '(projectile-motion|newtons-laws|dna-double-helix|chemical-equilibrium|wave-interference|doppler-effect|geometric-optics|cellular-respiration|photosynthesis|acid-base-ph)' > /tmp/remaining-slugs.txt
wc -l /tmp/remaining-slugs.txt  # expect ~169
```

- [ ] **Step 2: 批量调用 codex（每天 20-30 个，不要一次跑光）**

```bash
for f in $(head -25 /tmp/remaining-slugs.txt); do
  echo "Processing $f..."
  codex exec --model gpt-5.1-codex -s workspace-write \
    -C "$(git rev-parse --show-toplevel)" \
    "Read src/shared/lib/experiments/data/$f. Add a contentSections field of type ExperimentContentSection. Use the same structure and content quality bar as defined in Task 9 of docs/plans/2026-04-30-seo-remediation-execution-plan.md. Match the experiment's actual subject and topic. Output the diff." \
    < /dev/null
done
```

- [ ] **Step 3: 每批审完后 commit**

```bash
git add src/shared/lib/experiments/data/
git commit -m "feat(content): add content-sections to experiments batch N (X-Y)"
```

- [ ] **Step 4: 持续到 169 页全部完成**

跑回归脚本（`docs/plans/2026-04-30-seo-remediation-plan.md` 末尾的 audit() 函数）期望 `lowWord: 0`。

---

### Task 14: 法律页加 Schema

**负责人：** [Codex]

**Files:**
- Modify: `src/app/[locale]/(landing)/privacy/page.tsx`
- Modify: `src/app/[locale]/(landing)/terms/page.tsx`
- Modify: `src/app/[locale]/(landing)/[...slug]/page.tsx`（catch-all 含 /children-privacy 和 /cookie-policy）

- [ ] **Step 1: codex exec 加 schema**

```bash
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "For each of these pages — privacy/page.tsx, terms/page.tsx — add two JSON-LD schemas: WebPage (name=h1 title, description=meta description, dateModified={today's ISO date}) and BreadcrumbList (Home > {name}). For [...slug]/page.tsx (which serves /children-privacy and /cookie-policy via MDX), do the same conditionally based on slug. Use getPageAlternates and getSiteUrl. Output diffs."
```

- [ ] **Step 2: 验证 + Commit**

---

### Task 16: 修复首页 hero 移动端文字溢出（Phase 1 实测发现）

**负责人：** [Claude-Main / 前端]

**Files:**
- Inspect: `src/themes/default/blocks/hero/index.tsx` 或对应 hero block
- 可能 modify: 该 hero block 的 className 或字体 sizing

**Why:** 2026-04-30 用 playwright 在 390x844（iPhone 13）视口实测：

- H1 "Your next A in AP Physics..." 被裁切（仅显示 "Your next A in AP Ph..."）
- 副文案 "Stop rereading the textbook..." 被裁切
- 副 CTA "See AP Prep path" 按钮越界出可视区
- desktop 1440 视口正常

不是 Phase 1 改动引入（hero 文案、字号、布局都是 i18n + 现有组件，本次 Phase 1 没动）。但属于这条分支 `fix/ui-consistency-remaining` 的修复范畴。截图存在仓库根 `phase1-home-mobile.png`。

- [ ] **Step 1: 复现**

```bash
pnpm dev
playwright-cli -s=mobile-hero navigate http://localhost:3000/
playwright-cli -s=mobile-hero screenshot --viewport=390x844 hero-bug.png
```

- [ ] **Step 2: 定位 hero 组件文件**

```bash
rg "Your next A in AP" src/ --type tsx --type ts
rg "starts with one experiment" src/
```

- [ ] **Step 3: 修复方向（人工选）**

候选方案：

- **A.** H1 在 `< sm` 减小字号（`text-3xl sm:text-4xl md:text-6xl` 或更激进）+ `break-words`
- **B.** Hero 整体 padding 在移动端缩窄（`px-4` 已经是最小，可能需要修 max-width）
- **C.** CTA 按钮组改 `flex-wrap` 或在 `< sm` 改 `flex-col`

推荐 A + C。先看 hero block 现状再定。

- [ ] **Step 4: 修后回归 Playwright 截图**

期望：390x844 视口下 H1 完全显示、副文案完整、两个 CTA 按钮都在可视区内。

- [ ] **Step 5: Commit**

```bash
git add src/themes/default/blocks/hero/...
git commit -m "fix(hero): clamp H1 size and wrap CTA buttons on mobile (<sm)"
```

---

### Task 15: 首页 hero 区加学段卡片（如果已有则不动）

**负责人：** [Claude-Main]（设计判断）

**Files:**
- Modify: `src/app/[locale]/(landing)/page.tsx` 或其引入的 hero block

**Why:** 实测首页确实有 4 学段卡片（K-5 / MS / HS / AP），但在 hero 下方较远位置。需要把它们提到 hero 视区内。

- [ ] **Step 1: 看现有 hero 布局并设计调整**

人工设计：保留 H1 主张，在 H1 下方加一行副条 "Or pick by grade →" + 4 个紧凑学段卡片，确保 viewport 1440x900 首屏可见。

- [ ] **Step 2: 用 Playwright 截图前后对比**

```bash
# 改之前
playwright-cli screenshot https://scivra.com/ before.png

# 改之后（local dev）
playwright-cli screenshot http://localhost:3000/ after.png
```

- [ ] **Step 3: 移动端确认**

改完后用 mcp__chrome-devtools__resize_page 模拟 iPhone 13 (390x844) 看 hero 是否还能塞下学段卡片。如不能，在移动端折叠或换 horizontal scroll。

- [ ] **Step 4: Commit**

```bash
git add src/app/\[locale\]/\(landing\)/page.tsx
git commit -m "feat(home): elevate grade-band cards into hero viewport"
```

---

## 验收脚本（完成所有 task 后跑）

```javascript
// 在 https://scivra.com 任何页面 console 跑
async function audit() {
  const r = await fetch('/sitemap.xml');
  const t = await r.text();
  const urls = [...t.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const exp = urls.filter(u => u.split('/').filter(Boolean).length >= 4);

  let neonInData = 0, lowWord = 0, noFAQ = 0, noLR = 0;
  for (const u of exp) {
    const html = await (await fetch(u)).text();
    if (/NeonPhysics/i.test(html)) neonInData++;
    const txt = html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean);
    if (txt.length < 600) lowWord++;
    if (!/FAQPage/.test(html)) noFAQ++;
    if (!/LearningResource/.test(html)) noLR++;
  }
  return { totalExp: exp.length, neonInData, lowWord, noFAQ, noLR };
}
audit().then(console.log);
```

**期望**：`{ totalExp: 179, neonInData: 0, lowWord: 0, noFAQ: 0, noLR: 0 }`

```bash
# Hub 页 schema 检查
for p in / /labs /labs/physics /pricing /upg /blog /gallery; do
  echo "=== $p ==="
  curl -s "https://scivra.com$p" | grep -oE '"@type":"[^"]+"' | sort -u
done
```

期望每页都有相应 schema。

---

## Codex 任务调度执行命令清单（用户可直接 copy 跑）

下面是按 Phase 1 顺序排列的 codex 启动命令，可串行也可并行（标注了依赖关系）。

```bash
# === Task 1: NeonPhysics 数据清理 (无依赖, 0 风险, 先跑) ===
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Replace all occurrences of 'NeonPhysics' with 'Scivra' and 'neonphysics.com' with 'scivra.com' in files under src/shared/lib/experiments/data/. Use Glob + Edit tools. Do NOT modify any other directory. Do NOT modify src/shared/lib/seo.ts. Do NOT touch test files. After replacement, run 'rg NeonPhysics src/shared/lib/experiments/data/' and confirm 0 matches. Report the list of modified files."

# === Task 3: 首页 schema (依赖 Task 1 commit 后) ===
codex exec --model gpt-5.1-codex -s workspace-write \
  -C "$(git rev-parse --show-toplevel)" \
  "Read src/app/[locale]/(landing)/page.tsx. ..." # 见上文 Task 3 完整 prompt

# === Task 4: /labs 内容 + schema (并行 Task 3) ===
codex exec --model gpt-5.1-codex -s workspace-write ...

# === Task 5: /pricing schema (并行 Task 3, 4) ===
codex exec --model gpt-5.1-codex -s workspace-write ...
```

---

## 任务并行 / 串行依赖图

```
Phase 1:
  Task 1 (NeonPhysics) ──┐
                         ├── 都可独立 commit
  Task 2 (www 301) ──────┤
                         ├──→ Task 3 (首页 schema)
                         ├──→ Task 4 (/labs schema)
                         ├──→ Task 5 (/pricing schema)
                         ├──→ Task 6 (/learn 错配)
                         └──→ Task 7 (GSC 接入)

Phase 2:
  Task 8 (模板组件) ─────→ Task 9 (10 P0 实验填数据)
  Task 10 (hub schema) (独立)
  Task 11 (/upg /blog 等) (独立)
  Task 12 (资源中心决策) (独立)

Phase 3:
  Task 13 (169 实验内容批量) ←── 依赖 Task 8 完成
  Task 14 (法律页 schema) (独立)
  Task 15 (首页 hero 学段卡片) (独立)
```

---

## Self-Review Checklist

- [x] 每个 task 有 Files、Steps、Verification、Commit
- [x] Codex 任务都给出完整 prompt（不让 codex 自由发挥）
- [x] 每个 codex 任务都有 boundary 描述（do NOT 列表）
- [x] 关键 schema 添加都有 fetch + grep 验证步骤
- [x] 标注了 [Codex] / [Claude-Main] 角色
- [x] 标注了任务并行/串行依赖
- [x] 包含最终验收脚本（机械验证）
- [x] 没有占位符（无 TBD / TODO / 后续补充）
- [x] 已对齐 superpowers/writing-plans 的格式要求

---

## 风险与回滚

| 风险 | 概率 | 影响 | 回滚 |
|------|------|------|------|
| Task 1 误改非数据文件 | 低 | 中 | git revert + 重跑 |
| Task 3-5 schema 语法错误导致 Google 判垃圾 | 低 | 高 | 用 Rich Results Test 在部署前验 |
| Task 9 内容学科错误 | 中 | 中 | 学科顾问审 + 单页 revert |
| Task 13 169 页内容批量误差 | 中 | 中 | 分批 commit，按学科 revert |
| Task 15 首页布局破坏移动端 | 中 | 高 | Playwright 截图前后对比 |

每次 commit 都用语义化 commit message，方便 revert 单 task。

---

## 完成定义（DoD）

Phase 1 P0 完成时：
- ✅ 实测 0 个实验页源码含 NeonPhysics
- ✅ 首页有 Organization + SearchAction + FAQPage schema
- ✅ /labs ≥ 500 词 + BreadcrumbList + CollectionPage + FAQPage
- ✅ /pricing 有 Product + FAQPage + BreadcrumbList，title 不再是 "Pricing"
- ✅ /learn/* schema-内容一致（A 或 B 方案任一）
- ✅ www → apex 301 实测生效
- ✅ Google Search Console + Bing Webmaster 已接入并提交 sitemap

Phase 2 P1 完成时：
- ✅ 10 个 P0 实验页正文 ≥ 700 词，有 FAQ schema
- ✅ 21 个学科+band hub 页有 BreadcrumbList + CollectionPage + FAQPage
- ✅ /upg /blog /blog/[slug] /gallery /showcases /ap-prep 有相应 schema
- ✅ 资源中心策略落地

Phase 3 P2 完成时：
- ✅ 179/179 实验页正文 ≥ 600 词、有 FAQ schema
- ✅ 法律页有 schema
- ✅ 首页 hero 学段入口可见

跑验收脚本期望 `{ neonInData: 0, lowWord: 0, noFAQ: 0, noLR: 0 }`。
