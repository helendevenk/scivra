# Scivra — Project Guide for Claude

> 基线代码：ShipAny Template Two v1.6.0
> UI 方向：edu-academic（教育学术风），2026-03-08 确认并合并
> 最后更新：2026-03-26

## 项目定位

K12 科学教育平台，面向北美高中生/教师/自学者。**实验库为核心**，175 个交互式实验横跨 7 个目录（Physics/Biology/Chemistry/Physics-C/Earth Science/Elementary/Middle），课标对齐 NGSS/AP。

- **实验库**：175 个 HTML 交互式实验（73 AP Physics + 5 AP Physics C + 20 Bio + 17 Chem + 17 Earth + 23 Elementary + 20 Middle），全部截图 QA 验证
- **UPG（Universal Principle Generator）**：AI 实时生成零依赖 HTML 交互式可视化，Max 套餐高级功能

竞争优势：PhET 有 2-3 年技术债（Java→HTML5 迁移），Scivra 用 edu-academic 教育学术风 + 175 个实验（超 PhET 物理 66 个）+ 7 类覆盖 + AI 生成 + 社区 UGC 做差异化。

商业模式：Freemium 订阅（Free 3 实验终身额度 / Pro $4.99/月 / Max $9.99/月）+ UPG 积分消耗（Max 专属）

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 语言 | TypeScript (strict, 零 any) |
| 样式 | Tailwind CSS v4 + shadcn/ui (new-york) |
| 主题 | edu-academic（学术蓝 250°，Merriweather 衬线字体） |
| 数据库 | PostgreSQL + Drizzle ORM（38 张表） |
| 认证 | Better Auth + RBAC |
| i18n | next-intl (en/zh, prefix: as-needed) |
| 3D | React Three Fiber + Drei（React 组件）/ Three.js r134（UPG CDN） |
| AI | Vercel AI SDK v5 + Anthropic Claude (claude-sonnet-4-6 默认, claude-haiku-4-5 备用) |
| 缓存 | Upstash Redis（限流 + 分布式锁） |
| 支付 | Stripe / PayPal / Creem |
| 存储 | Cloudflare R2 |
| 邮件 | Resend |
| 文档 | Fumadocs (MDX) |
| 测试 | Vitest (unit+integration, 579 tests) + Playwright (e2e, 37 tests) |
| 部署 | Vercel (主) / Cloudflare Workers (备) |
| 包管理 | pnpm |

## 工作区结构

```
sciwangzhan/
├── Scivra/                                  ← 唯一代码库
├── UPG-CTO-REVIEW.md                        ← CTO 技术评审（决策记录）
├── research-north-american-high-school-...   ← 北美高中物理课标调研
├── 建站与优化Skills完整手册.md                ← Skills 工具手册
├── docs/research/                           ← 竞品调研
│   ├── phet-analysis.md                     ← PhET 竞品深度分析
│   └── middle-school-science-experiments... ← 初中实验需求调研
├── research/                                ← 补充调研材料
├── chat/                                    ← 历史对话记录
└── logo-concepts/                           ← Logo 设计稿
```

## 目录结构（Scivra）

```
src/
├── app/
│   ├── [locale]/                     # i18n 路由根
│   │   ├── (admin)/admin/            # 管理后台
│   │   ├── (auth)/                   # 登录/注册
│   │   ├── (chat)/chat/              # AI 聊天
│   │   ├── (docs)/docs/              # Fumadocs 文档
│   │   └── (landing)/                # 前台
│   │       ├── (ai)/upg/             # UPG 生成/查看/我的
│   │       ├── (ai)/ai-{image,music,video}-generator/
│   │       ├── learn/[slug]/nodes/   # 学习路径
│   │       ├── gallery/              # UPG 画廊
│   │       ├── dashboard/            # 用户仪表盘
│   │       ├── settings/             # 用户设置
│   │       └── embed/[id]/           # 嵌入式查看器
│   └── api/                          # API Routes (27 端点)
│       ├── upg/                      # UPG CRUD + generate
│       ├── gallery/                  # 画廊 (like/fork/publish)
│       ├── compliance/               # 合规 (age-gate/consent)
│       ├── privacy/                  # GDPR (export/delete/status)
│       ├── experiments/              # 实验进度 + 配额
│       ├── payment/                  # 支付 (checkout/callback/notify)
│       ├── chat/                     # 聊天 API
│       ├── cron/                     # 定时任务 (data-retention)
│       └── admin/learning-paths/     # 学习路径管理
├── config/
│   ├── index.ts                      # envConfigs 全局配置
│   ├── lib-versions.ts               # CDN 版本集中管理
│   ├── db/schema.ts                  # Drizzle schema（38 张表）
│   ├── locale/messages/{en,zh}/      # i18n 翻译
│   └── style/
│       ├── global.css                # 全局样式
│       └── theme-education.css       # edu-academic 主题（394 行）
├── core/                             # 基础设施（不含业务逻辑）
│   ├── auth/                         # Better Auth 配置
│   ├── compliance/                   # 合规服务 (COPPA/GDPR)
│   ├── db/                           # 数据库连接（连接池 1-5）
│   ├── rbac/                         # 角色权限
│   └── theme/                        # ThemeProvider
├── extensions/                       # 可插拔第三方集成
│   ├── ai/                           # AI providers
│   ├── payment/                      # Stripe/PayPal/Creem
│   ├── analytics/                    # GA/Plausible/Vercel
│   ├── storage/                      # R2/S3
│   ├── email/                        # Resend
│   └── monitoring/                   # Sentry
├── shared/
│   ├── blocks/                       # 业务组件（按领域分目录）
│   ├── components/ui/                # shadcn/ui 原子组件
│   ├── hooks/                        # React Hooks
│   ├── lib/
│   │   ├── upg/                      # UPG 领域（generate/sanitize/prompt/quality）
│   │   ├── usage/                    # 配额/进度
│   │   ├── physics/                  # 物理计算
│   │   └── experiments/              # 实验注册表/访问控制
│   ├── models/                       # 数据访问层（每表一个文件）
│   ├── services/                     # 服务层 (ai/payment/rbac/storage)
│   └── types/                        # TypeScript 类型
└── themes/default/                   # Landing 页面模板
```

## 关键约定

### 路径别名
- `@/*` → `./src/*`
- `@/.source` → `./.source/index.ts` (Fumadocs)

### 数据库
- Schema 集中在 `src/config/db/schema.ts`（38 张表，40+ 复合索引）
- Model 层在 `src/shared/models/`，每张表一个文件
- 主键：`text('id')` + 应用层 `getUuid()`，不用数据库 `uuid` 类型
- JSON 字段：`text` 类型 + `JSON.parse/stringify`，不用 `jsonb`
- 时间戳：不带 `withTimezone`
- 迁移：`pnpm db:generate` → `pnpm db:push` → `pnpm db:studio`

### 认证
- Better Auth 配置在 `src/core/auth/`
- 获取当前用户：`getSignUser()`，不引入 Clerk
- RBAC：`src/core/rbac/` + `scripts/init-rbac.ts`

### i18n
- 支持语言：`en`（默认）、`zh`
- 翻译文件：`src/config/locale/messages/{en,zh}/`
- 路由前缀：`as-needed`（英文无前缀，中文 `/zh/...`）
- 新增页面必须同时添加 en/zh 翻译 JSON

### 组件层级
- `shared/components/ui/` — shadcn/ui 原子组件，不含业务逻辑
- `shared/blocks/` — 业务组件，可组合 ui 组件
- `themes/default/blocks/` — Landing 页面区块

### API 路由
- AI 相关路由 maxDuration: 60s，其他 30s（见 vercel.json）
- 统一响应格式：`src/shared/lib/resp.ts`
- 定时任务：`/api/cron/data-retention`（每天 03:00 UTC）

### UPG 领域
- 生成核心：`src/shared/lib/upg/generate-core.ts`
- System Prompt：`src/shared/lib/upg/system-prompt.ts`（400+ 行）
- HTML 安全：`src/shared/lib/upg/html-sanitizer.ts`（iframe sandbox + CDN 白名单）
- 质量检查：`src/shared/lib/upg/quality-checker.ts`
- 版本管理：`src/config/lib-versions.ts`（Three.js r134 CDN / 0.183.1 npm 双版本策略）
- 限流：Redis 滑动窗口 + 分布式锁（替代了内存 Map）
- 积分流程：**先调 AI → 成功后扣积分**（CTO 修正，非先扣后退）

## UI 设计方向（已确认）

2026-03-08 确认采用 **np-one 教育学术风**（commit `617a385`），完整迁移到 neonphysics-v2。

| 维度 | 值 |
|------|---|
| CSS 前缀 | `.np-*`（从 `.edu-*` 迁移，旧前缀有 deprecated 别名） |
| 主色调 | 学术蓝 oklch(0.50 0.20 250) |
| 点缀色 | 学术金 oklch(0.75 0.15 75) |
| 标题字体 | Merriweather (serif) |
| 正文字体 | Noto Sans |
| 代码字体 | JetBrains Mono |
| 主题文件 | `src/config/style/theme-education.css`（394 行） |

其他两个方案（np-two 游戏风 `vib-*`、np-three 终端风 `eff-*`）已淘汰删除。

## 数据库 Schema 概览

### 基础表（ShipAny 模板）
`user` / `session` / `account` / `verification` / `config` / `taxonomy` / `post` / `order` / `subscription` / `credit` / `apikey` / `role` / `permission` / `rolePermission` / `userRole` / `aiTask` / `chat` / `chatMessage`

### 业务扩展表
- `experimentProgress` — 实验进度追踪
- `anonymousUsage` — 匿名用户使用量
- `learningPath` / `learningPathNode` / `learningPathProgress` — 学习路径体系
- `learningStats` — 用户学习统计
- `contentModeration` — 内容审核记录

### 合规表（COPPA/GDPR）
- `userComplianceProfile` — 年龄组/地区/同意版本
- `dailyUsage` — 每日使用配额
- `consentEvent` — 同意事件审计日志
- `privacyRequest` — GDPR 数据导出/删除请求

### UPG 表
- `upgGeneration` — 生成记录（HTML 内容 + 社交属性 + 标签）
- `upgReport` — 举报记录
- `upgDailyQuota` — 每日生成配额
- `upgLike` — 点赞（多对多）

## 当前状态（2026-03-26）

### 已完成 ✅
- 工作区治理：代码库收敛为唯一代码库，冗余副本已删除
- v1→v2 迁移：Phase 2 合规（6 API + 组件 + 页面）+ Phase 3 配额（service + API + hook + 组件）
- UPG 核心：生成管线 + 安全加固（Redis 限流 + XSS 沙箱 + 积分事务 ACID）
- 版本统一：Three.js / KaTeX CDN 与 npm 双版本策略落地
- UI 方向：edu-academic 主题完整迁移（394 行 CSS + 组件适配）
- 学习路径：Admin CRUD + 前端 UI + 进度追踪
- 画廊 + 社交：like/fork/publish/search/tags
- 致命 bug 修复：内存限流→Redis、XSS 加固、连接池扩容、积分退款机制
- **Phase F1/F2/F3**：AP Prep + Physics Quest + Lab Notebook（14 新表 + 27 API + 14 页面）
- **学科解耦**：5 学科 Subject/GradeLevel 类型 + 64 实验数据填充
- **权限矩阵**：access control TDD（canAccessExperiment + getAccessibleExperiments + Progress API hardening）
- **实验库**：175 个 HTML 实验（73 AP Physics + 5 AP Physics C + 20 Bio + 17 Chem + 17 Earth + 23 Elementary + 20 Middle），全部逐个截图 QA 验证
- **实验缩略图**：66 张 Gemini API 生成，统一学术蓝风格（待补齐剩余 109 张）
- **payment.ts 重构**：消除 handleCheckoutSuccess/handlePaymentSuccess 80% 重复 + 修复 string→Date bug
- **测试体系**：175 → 579 tests（+231%），6 Phase 完成（T1 纯函数 → T6 E2E）
- **CI Pipeline**：GitHub Actions（lint + unit-tests + coverage ratchet + build）
- **实验 HTML 修复**：19 个实验 OrbitControls CDN + CapsuleGeometry + 语法修复
- **性能优化**：next.config AVIF/WebP formats + poweredByHeader + shiki + 死资源清理
- **品牌升级**：Scivra → Scivra，三色不可能三角 Logo，全站资源替换
- **Sprint 2026-03-22/23**：16 commits / 20 新测试文件 / 365 文件改动

### 进行中 🟡
- T3-T6 测试编写（覆盖率 ~15% → 目标 90% shared / 80% api）
- UPG v1/v2 A/B 测试（CTO 建议跑 1 周验证生产效果）

### 未开始 ⬜
- 监控增强（Sentry 集成、Analytics Bridge）
- SEO 增强（sitemap 优化、博客内容迁移）
- Vercel Cron 配置
- 付费系统对接（Stripe webhook 生产测试）
- 社交功能完善（评论、收藏）
- 移动端优化
- ISR 静态化（landing/pricing/listing 页面）
- OrbitControls 去重（175 个 HTML 内联副本 → 统一引用 `public/lib/orbit-controls.js`，代码卫生）

### 已完成（本轮 2026-03-31）
- ✅ 93 个 TS 类型错误修复（25 文件），`tsc --noEmit` 加入 CI 门控
- ✅ 52 张缺失实验缩略图生成（Gemini 2.5 Flash Image），覆盖率 100%（182 张 / 179 实验）
- ✅ UPG Prompt v2 升级（pedagogy + Verlet + review pipeline）— 2026-03-28 完成
- ✅ 实验目录统一（experiments-v2 → experiments）
- ✅ UPG 端到端联调（35 passed, 0 failed @ d53c821；pipeline test @ 33a1bc9）
- ✅ single-slit-diffraction 渲染 bug（maxAngle 动态化，中央极大从 2% → 14% 可见）

### 下一步优先级（推荐）

**当前主线：课程扩展（当前 175 个实验，目标 183+）**
- 完整方案：`docs/plans/2026-03-26-curriculum-wave9-12-cto-review.md`（v3.1，Round-2 评审通过）
- 视觉规范：同文档 Section 2.9（背景色/学科主色/布局/CDN 版本）
- 每实验 SOP：同文档 Section 3（7 步，缺一不可）

执行顺序：
1. **准备 Sprint**（本周，~6-8h）：变更 A/B/C/F + 创建 `.github/PULL_REQUEST_TEMPLATE.md`
2. **Wave 9 Sprint 9.1**：C-08/C-09/C-10（Chemistry Core，20h）；OrbitControls 预编译必须在本 Sprint 结束前落地
3. **Wave 9 Sprint 9.2**：C-11/C-12/C-13（若 OrbitControls 落地）或 C-14~C-17（未落地则先做 2D）
4. **Wave 9 上线**：10 个 Chemistry 实验，发布 + Vercel 验证

**并行维护线**（不阻塞课程开发）：
5. OrbitControls 预编译修复（截止：Sprint 9.1 结束前）
6. single-slit-diffraction.html bug 修复
7. 剩余 48 张存量缩略图补齐

## 常用命令

```bash
pnpm dev                # Turbopack 本地开发
pnpm build              # 生产构建
pnpm lint               # ESLint
pnpm format             # Prettier
pnpm test               # Vitest 单元测试
pnpm test:coverage      # 带覆盖率
pnpm test:e2e           # Playwright E2E
pnpm db:generate        # 生成迁移 SQL
pnpm db:push            # 推送 schema 到数据库
pnpm db:studio          # Drizzle Studio GUI
pnpm rbac:init          # 初始化 RBAC 角色/权限
```

## 环境变量

必需（见 `.env.example`）：
- `NEXT_PUBLIC_APP_URL` — 应用 URL
- `NEXT_PUBLIC_APP_NAME` — 应用名称
- `DATABASE_URL` — PostgreSQL 连接串
- `AUTH_SECRET` — Better Auth 密钥
- `UPSTASH_REDIS_REST_URL` — Redis URL（限流 + 分布式锁）
- `UPSTASH_REDIS_REST_TOKEN` — Redis Token

可选：
- `NEXT_PUBLIC_THEME` — 主题 (default)
- `DATABASE_PROVIDER` — 数据库类型 (postgresql)
- `DB_SINGLETON_ENABLED` — 单例连接 (true)

## 文档索引

### 技术决策
- `/Users/sky/Desktop/sciwangzhan/UPG-CTO-REVIEW.md` — UPG 架构评审（2 处修正 + 7 个决策）

### 设计文档（docs/plans/）

**总体规划**
- `2026-03-09-neonphysics-v2-saas-upgrade-plan.md` — **SaaS 升级总计划**（优先看）
- `2026-03-22-phase1-overview.md` — Phase 1 功能总览（AP Prep + Physics Quest + Lab Notebook）
- `2026-03-22-multi-discipline-evolution-plan.md` — 学科多元化演进方案（长期战略）
- `2026-03-22-discipline-decoupling-implementation-spec.md` — 学科解耦实施规格（CTO Review 版）
- `2026-03-22-discipline-decoupling-cto-review.md` — 学科解耦 CTO 评审

**Phase 1 核心功能**
- `2026-03-22-ap-prep-mode-design.md` — AP 考试备考模式
- `2026-03-22-physics-quest-design.md` — Physics Quest 游戏化学习
- `2026-03-22-lab-notebook-ai-design.md` — Lab Notebook AI 实验笔记
- `2026-03-22-ap-physics-experiment-gap-analysis.md` — AP 实验缺口分析（完成）
- `2026-03-22-arxiv-2412.07482-competitive-analysis.md` — 论文对标分析

**UPG**
- `upg-transaction-flow.md` — UPG 积分事务流程
- `2026-03-22-upg-batch-generation-pipeline.md` — UPG 批量生成管线（完成）

**内容 & 产品**
- `north-american-k12-experiments-master-plan.md` — K12 实验总规划（120+ 实验清单）

**已实施功能设计**
- `2026-02-28-learning-path-technical-spec.md` — 学习路径技术规格（完成）
- `2026-02-24-upg-gallery-design.md` — UPG 画廊设计（完成）
- `2026-02-24-user-dashboard-design.md` — 用户仪表盘设计（完成）

**测试 & 质量**
- `test-coverage-100-plan.md` — **100% 覆盖率测试计划**（1684 行，6 Phase 详细规格）
- `test-coverage-100-cto-review.md` — CTO 评审（8 决策：mock 策略/CI/覆盖率目标）

### 完成报告（docs/reports/）
- `2026-03-23-sprint-retrospective.md` — **Sprint 复盘（03-22~23，175→579 tests）**
- `2026-03-08-phase2-completion-summary.md` — Phase 2 完成总结
- `2026-03-10-final-summary.md` — **最终总结（Phase 1+2 汇总）**
- `2026-03-09-phase-0-complete-retrospective.md` — Phase 0 完整复盘
- `2026-03-10-phase1-completion.md` — Phase 1 完成报告
- `2026-03-10-phase2-day6-complete.md` — Phase 2 完成报告
- `2026-03-09-orbit-controls-final-delivery.md` — OrbitControls 最终交付
- `2026-03-10-rendering-diagnosis.md` — 渲染诊断
- `2026-03-09-phase-0.5-performance-optimization-report.md` — 性能优化报告
- `2026-03-09-phase-0.6-content-moderation-report.md` — 内容审核报告
- `2026-03-09-phase-0-qa-test-report.md` — QA 测试报告

### 市场调研（项目根目录外）
- `../../research-north-american-high-school-physics-labs.md` — 北美高中物理课标
- `../../docs/research/phet-competitive-analysis.md` — **PhET 深度竞品分析 + UPG 基准实验清单**（2026-03-22）
- `../../docs/research/k5-science-experiments-research.md` — K5 科学实验调研
- `../../research/middle-school-science-experiments-research.md` — 初中实验调研

## 开发规范

### 新增页面
1. 在 `src/app/[locale]/` 对应路由组下创建 `page.tsx`
2. AI 工具类页面放在 `(ai)/` 路由分组下
3. 添加 `en` 和 `zh` 翻译 JSON
4. 在 `src/config/locale/index.ts` 的 `localeMessagesPaths` 注册

### 新增 API
1. 在 `src/app/api/` 下创建 `route.ts`
2. 如需延长超时，在 `vercel.json` 的 `functions` 中配置
3. 使用 `src/shared/lib/resp.ts` 统一响应格式
4. AI 路由加 Redis 限流

### 新增数据表
1. 在 `src/config/db/schema.ts` 定义（遵循上述数据库约定）
2. 在 `src/shared/models/` 创建对应 model 文件
3. `pnpm db:generate && pnpm db:push`

### 新增组件
- 纯 UI → `src/shared/components/ui/`
- 业务组件 → `src/shared/blocks/{domain}/`
- Landing 区块 → `src/themes/default/blocks/`

## 已确认的技术决策

| 决策 | 选择 | 原因 | 来源 |
|------|------|------|------|
| UPG AI 集成 | Vercel AI SDK + Anthropic Claude | AIProvider 接口围绕异步媒体设计，UPG 需要同步 Chat Completions | CTO Review |
| UPG 路由分组 | `/(ai)/upg` | 与其他 AI 工具一致 | CTO Review 修正 1 |
| 积分扣除时机 | 先调 AI → 成功后扣 | UPG 是同步流程，避免退还失败风险 | CTO Review 修正 2 |
| 匿名限流 | Redis rate limiter | 不入库，无持久化价值 | CTO Review |
| HTML 存储 | V0.1 存 DB text → V0.2 上 R2 | 减少早期依赖 | CTO Review |
| CDN 版本策略 | UPG 用稳定版（r134）/ npm 用最新版 | UPG HTML 需独立运行，稳定性优先 | Phase 0.2 |
| UI 方向 | edu-academic（np-one） | 契合教育定位，专业可读 | 2026-03-08 确认 |
| 限流方案 | Redis 替代内存 Map | serverless 实例隔离，内存限流无效 | Phase 1 修复 |
| DB Mock 策略 | vi.mock T2-T4，真实 Postgres T5 | 单一 typed mock factory，避免 mock 漂移 | CTO Review 2026-03-23 |
| 覆盖率目标 | 90% shared / 80% api（ratchet） | 只升不降，CI 自动门控 | CTO Review 2026-03-23 |
| payment.ts | 提取 4 个共享函数消除重复 | 避免维护两套相同逻辑的测试 | CTO Review 2026-03-23 |

## 竞品定位与护城河（2026-03-22 Novelty Check）

### 核心发现

护城河不在"能造实验"，在"造得好"。任何人都可以用 ChatGPT 生成物理模拟代码。Scivra 的真正护城河是：prompt engineering 质量、可视化美观度、物理准确性验证、UGC 社区/分享机制、教育场景整合——这些**产品化能力**才是壁垒。

### 定位话术

**不要说：** "我们是唯一让学生造实验的平台"（Algodoo 会打脸）

**应该说：** "Scivra 是第一个让学生**用自然语言描述就能生成交互式物理可视化**的产品化平台。不需要编程、不需要拖拽搭建、不需要安装软件——描述你想探索的现象，立刻获得可交互的实验。"

### 护城河强化方向

- UGC 社区（学生分享/fork 实验）→ 网络效应
- 物理准确性验证层（其他 AI 方案没人做这个）
- 教师 dashboard（布置"造实验"作业）
- 实验模板 + remix 机制

### 竞品对照表

| 竞品 | 能造实验？ | 方式 | 与 Scivra 差异 |
|------|-----------|------|-------------------|
| PhET | ❌ | 173 个预建模拟（66 物理）+ Studio 只改预设参数 | 纯消费型，我们已有 175 个实验（超 PhET 物理数量），且覆盖 7 类学科 |
| Khan Academy | ❌ | 预录视频+练习 | 无交互模拟 |
| Labster | ❌ | 预建 VR 实验 | 封闭内容，无创作 |
| Algodoo | ✅ | 手动拖拽 2D 刚体 | 无 AI，无自然语言，局限 2D 力学 |
| Physion | ✅ | 手动绘制+JS 脚本 | 无 AI，门槛较高 |
| SimPHY | ✅ | 拖拽式 2D/3D | 面向教师，非学生 |
| arXiv:2412.07482 | 概念验证 | LLM 生成 HTML/JS | **最近概念**，但无产品，定位教师 |

### 最大威胁

arXiv:2412.07482（2024-12）已描述用 ChatGPT/Claude 生成 HTML/JS 物理模拟的完整概念。虽无产品化，但任何 edtech 团队读到该论文都可能快速跟进。**窗口期有限，需加速产品化。**

### UPG 基准实验要求（2026-03-22 确立）

PhET 物理 66 个模拟已全部对标覆盖（P0 27 + P1 29 + P2 10）。实际实验库规模更大：**175 个实验**横跨 7 类。

| 学科 | 数量 | 说明 |
|------|------|------|
| AP Physics | 73 | PhET 66 对标 100% + 7 个扩展 |
| AP Physics C | 5 | 高阶力学/电磁 |
| AP Biology | 20 | 细胞/遗传/生态 |
| AP Chemistry | 17 | 原子/反应/电化学 |
| Earth Science | 17 | 地质/气象/天文 |
| Elementary | 23 | 力/光/磁/能量/水循环 |
| Middle School | 20 | 牛顿/生态/板块/天气 |

验收标准：**UPG 生成效果必须不低于 PhET 对应模拟**，视觉上必须超越。全部 175 个已逐个截图 QA 验证。

完整清单见 `../../docs/research/phet-competitive-analysis.md` 第四节。

## Design Context

### Users

**核心用户**：北美高中生（14-18 岁）+ K-12 全年龄段学生。

- **主场景**：AP Physics/Chemistry/Biology 备考，课后自主练习，需要直观理解抽象概念
- **次场景**：K5/初中生科学启蒙探索，教师课堂演示辅助
- **使用环境**：学校 Chromebook、家庭电脑、偶尔手机；注意力有限，需要快速进入交互
- **Job to be done**：把课本上的公式和文字变成"我能看到、能操控、能理解"的东西

### Brand Personality

**三个词：酷炫 · 好奇 · 自信**

- **酷炫**：赛博学术风，暗色模式下的 teal 辉光让学生觉得"这不像作业"
- **好奇**：每个实验都是一次探索邀请，界面鼓励动手调参数、观察变化
- **自信**：清晰的数据面板、即时反馈、学习进度可视化——让学生感到自己在掌控
- **绝不是**：幼稚卡通风（Kahoot）、沉闷学术灰（传统教材）、过度花哨游戏化

### Aesthetic Direction

**定位：PhET 的教育深度 + 现代 SaaS 的视觉品质**

| 维度 | 方向 |
|------|------|
| 主题 | edu-academic，双面系统：Marketing 面（温和辉光）/ Product 面（沉浸霓虹） |
| 色彩体系 | OKLCH 全链路。Primary teal `oklch(0.45 0.12 192)` / Gold accent `oklch(0.75 0.15 75)` / 5 学科专色 |
| 辉光系统 | 4 级辉光（sm/md/lg/xl），交互元素 hover/focus 时发光，Product 面更强烈 |
| 字体 | Space Grotesk（标题+正文）/ Merriweather（学术引用/装饰）/ JetBrains Mono（代码+数据） |
| 圆角 | 基础 `0.5rem`，卡片 `rounded-xl`，标签 pill `rounded-full` |
| 动效 | 微动效为主（hover 上浮 2px + 辉光脉冲），尊重 `prefers-reduced-motion` |
| 暗/亮 | 双模式，暗色为默认体验（深海军蓝 `oklch(0.13 0.03 250)`） |
| 反例 | 不做纯黑背景、不做霓虹过载、不做渐变彩虹、不模仿 PhET 的 Java 时代 UI |

### Design Principles

1. **Glow, don't shout** — 用辉光引导注意力，不用大红大绿。交互反馈通过光效而非弹窗。teal 辉光是品牌签名。
2. **Data is visible** — 物理量、进度、配额永远可见。用 `font-mono` + 实时数值让学生感受到"科学在发生"。
3. **One click to interact** — 从看到实验到能动手操控不超过 1 次点击。减少中间页、减少弹窗、减少说明文字。
4. **Subject has color** — 5 学科各有专色（Physics 蓝 / Chemistry 绿 / Biology 黄绿 / Earth Science 橙褐 / Math 紫），通过 `data-subject` 属性自动切换，保持视觉一致性。
5. **Respect the student** — 不幼稚化，不过度游戏化。学生是来学科学的，界面要让他们觉得自己在用"真正的工具"而不是"给小孩的玩具"。

### Accessibility

- **标准**：WCAG 2.1 AA
- 对比度：文本/背景对比度 ≥ 4.5:1（正文）、≥ 3:1（大号文本/UI 组件）
- 键盘导航：所有交互元素可 Tab 到达，focus ring 使用 primary 色辉光
- 动效：全部 `.np-*` 过渡动画在 `prefers-reduced-motion: reduce` 下禁用
- 色盲：不仅依赖颜色传达信息，学科分类同时使用图标+文字标签
- 3D 实验：提供 2D 回退说明或关键数据面板，确保非视觉用户也能获取核心信息
