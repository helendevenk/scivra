# NeonPhysics v2 — Project Guide for Claude

> 基线代码：ShipAny Template Two v1.6.0
> 主线仓库：`/Users/sky/Desktop/sciwangzhan/neonphysics-v2`
> UI 方向：edu-academic（教育学术风），2026-03-08 确认并合并
> 最后更新：2026-03-16

## 项目定位

教育类 AI SaaS 平台，面向北美高中生/教师/自学者。两条业务主线：

- **Curated Labs**：人工策划的物理实验 3D 可视化（React Three Fiber），课标对齐（NGSS/AP Physics）
- **UPG（Universal Principle Generator）**：AI 实时生成零依赖 HTML 交互式可视化，用户输入任意科学问题 → 30-60 秒出结果

竞争优势：PhET 有 2-3 年技术债（Java→HTML5 迁移），NeonPhysics 用赛博朋克/学术风 3D 视觉做差异化。

商业模式：Freemium 订阅（Free 4 实验/5min 每日，Pro $4.99/月，Max 更高）+ UPG 积分消耗（10 积分/次生成）

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
| AI | Vercel AI SDK v5 + OpenRouter (MiniMax GLM-5/GLM-4-plus) |
| 缓存 | Upstash Redis（限流 + 分布式锁） |
| 支付 | Stripe / PayPal / Creem |
| 存储 | Cloudflare R2 |
| 邮件 | Resend |
| 文档 | Fumadocs (MDX) |
| 测试 | Vitest (unit, 64 tests) + Playwright (e2e) |
| 部署 | Vercel (主) / Cloudflare Workers (备) |
| 包管理 | pnpm |

## 工作区结构

```
/Users/sky/Desktop/sciwangzhan/
├── neonphysics-v2/                          ← 唯一代码库
├── UPG-CTO-REVIEW.md                        ← CTO 技术评审（决策记录）
├── research-north-american-high-school-...   ← 北美高中物理课标调研
├── 建站与优化Skills完整手册.md                ← Skills 工具手册
├── docs/research/                           ← 竞品调研
│   ├── phet-analysis.md                     ← PhET 竞品深度分析
│   └── middle-school-science-experiments... ← 初中实验需求调研
├── research/                                ← 补充调研材料
├── chat/                                    ← 历史对话记录
└── .ralphfree/                              ← 品牌迁移记录 + Logo 概念
```

## 目录结构（neonphysics-v2）

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
| CSS 前缀 | `.edu-*` |
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

## 当前状态（2026-03-16）

### 已完成 ✅
- 工作区治理：代码库收敛为唯一 `neonphysics-v2`，冗余副本已删除
- v1→v2 迁移：Phase 2 合规（6 API + 组件 + 页面）+ Phase 3 配额（service + API + hook + 组件）
- UPG 核心：生成管线 + 安全加固（Redis 限流 + XSS 沙箱 + 积分事务 ACID）
- 版本统一：Three.js / KaTeX CDN 与 npm 双版本策略落地
- UI 方向：edu-academic 主题完整迁移（394 行 CSS + 组件适配）
- 学习路径：Admin CRUD + 前端 UI + 进度追踪
- 画廊 + 社交：like/fork/publish/search/tags
- 致命 bug 修复：内存限流→Redis、XSS 加固、连接池扩容、积分退款机制

### 进行中 🟡
- UPG 端到端联调（generate → view → my 主链路未完整跑通）
- OrbitControls 不稳定（方案已设计：预编译到 `public/lib/`，未落地）

### 未开始 ⬜
- Phase 4：监控增强（Sentry 集成、Analytics Bridge）
- Phase 5：SEO 增强（sitemap 优化、博客内容迁移）
- Phase 6：E2E 测试补全
- Phase 7：Vercel Cron 配置
- 付费系统对接（Stripe webhook 生产测试）
- 社交功能完善（评论、收藏）
- 移动端优化

### 下一步优先级（推荐）
1. 修复 OrbitControls → UPG 生成质量稳定
2. UPG 端到端联调 → generate/view/my 链路跑通
3. 接入 subscription 查询 → 配额系统识别 Pro/Max 用户
4. Phase 4-7 逐步推进

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

### 代码真相（优先阅读）
- `docs/PROJECT-BASELINE.md` — 项目基线
- `docs/WORKSPACE-STATUS.md` — 状态看板（需更新）

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
- `2026-03-22-ap-physics-experiment-gap-analysis.md` — AP 实验缺口分析
- `2026-03-22-arxiv-2412.07482-competitive-analysis.md` — 论文对标分析

**UPG & 3D**
- `2026-03-17-upg-3d-enhancement-plan.md` — UPG 3D 质量增强方案
- `3d-visualization-plan.md` — 3D 可视化规划
- `3d-skills-analysis.md` — 3D Skills 深度分析
- `3d-cto-review.md` — 3D 方案 CTO 评审
- `upg-transaction-flow.md` — UPG 积分事务流程

**内容 & 产品**
- `2026-03-18-curated-labs-content-priority-design.md` — Curated Labs 内容优先级
- `2026-03-18-physics-autopilot-design.md` — Physics Autopilot 智能导学
- `north-american-k12-experiments-master-plan.md` — K12 实验总规划（120+ 实验清单）

**已实施功能设计**
- `2026-02-28-learning-path-technical-spec.md` — 学习路径技术规格
- `2026-02-24-upg-gallery-design.md` — UPG 画廊设计
- `2026-02-24-user-dashboard-design.md` — 用户仪表盘设计
- `2026-02-28-seephysics-marketing-strategy.md` — 营销策略

**前端优化**
- `2026-03-17-frontend-optimization-plan.md` — 前端优化规划
- `2026-03-17-frontend-product-analysis.md` — 前端产品分析

### 完成报告（docs/reports/）
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
- `../../research/phet-analysis.md` — PhET 竞品分析（早期）
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
| UPG AI 集成 | 独立 OpenRouter 客户端 | AIProvider 接口围绕异步媒体设计，UPG 需要同步 Chat Completions | CTO Review |
| UPG 路由分组 | `/(ai)/upg` | 与其他 AI 工具一致 | CTO Review 修正 1 |
| 积分扣除时机 | 先调 AI → 成功后扣 | UPG 是同步流程，避免退还失败风险 | CTO Review 修正 2 |
| 匿名限流 | Redis rate limiter | 不入库，无持久化价值 | CTO Review |
| HTML 存储 | V0.1 存 DB text → V0.2 上 R2 | 减少早期依赖 | CTO Review |
| CDN 版本策略 | UPG 用稳定版（r134）/ npm 用最新版 | UPG HTML 需独立运行，稳定性优先 | Phase 0.2 |
| UI 方向 | edu-academic（np-one） | 契合教育定位，专业可读 | 2026-03-08 确认 |
| 限流方案 | Redis 替代内存 Map | serverless 实例隔离，内存限流无效 | Phase 1 修复 |

## 竞品定位与护城河（2026-03-22 Novelty Check）

### 核心发现

护城河不在"能造实验"，在"造得好"。任何人都可以用 ChatGPT 生成物理模拟代码。NeonPhysics 的真正护城河是：prompt engineering 质量、可视化美观度、物理准确性验证、UGC 社区/分享机制、教育场景整合——这些**产品化能力**才是壁垒。

### 定位话术

**不要说：** "我们是唯一让学生造实验的平台"（Algodoo 会打脸）

**应该说：** "NeonPhysics 是第一个让学生**用自然语言描述就能生成交互式物理可视化**的产品化平台。不需要编程、不需要拖拽搭建、不需要安装软件——描述你想探索的现象，立刻获得可交互的实验。"

### 护城河强化方向

- UGC 社区（学生分享/fork 实验）→ 网络效应
- 物理准确性验证层（其他 AI 方案没人做这个）
- 教师 dashboard（布置"造实验"作业）
- 实验模板 + remix 机制

### 竞品对照表

| 竞品 | 能造实验？ | 方式 | 与 NeonPhysics 差异 |
|------|-----------|------|-------------------|
| PhET | ❌ | 173 个预建模拟（66 物理）+ Studio 只改预设参数 | 纯消费型，Studio 2025 上线但仅限教师调参，$50-100/年 |
| Khan Academy | ❌ | 预录视频+练习 | 无交互模拟 |
| Labster | ❌ | 预建 VR 实验 | 封闭内容，无创作 |
| Algodoo | ✅ | 手动拖拽 2D 刚体 | 无 AI，无自然语言，局限 2D 力学 |
| Physion | ✅ | 手动绘制+JS 脚本 | 无 AI，门槛较高 |
| SimPHY | ✅ | 拖拽式 2D/3D | 面向教师，非学生 |
| arXiv:2412.07482 | 概念验证 | LLM 生成 HTML/JS | **最近概念**，但无产品，定位教师 |

### 最大威胁

arXiv:2412.07482（2024-12）已描述用 ChatGPT/Claude 生成 HTML/JS 物理模拟的完整概念。虽无产品化，但任何 edtech 团队读到该论文都可能快速跟进。**窗口期有限，需加速产品化。**

### UPG 基准实验要求（2026-03-22 确立）

PhET 物理 66 个模拟是 UPG 必须能生成的基线。验收标准：**UPG 生成效果必须不低于 PhET 对应模拟**，视觉上必须超越。

- P0（核心课标必备）：27 个 — 运动与力 8 + 能量 3 + 波 4 + 电磁 8 + 热力学 4
- P1（重要补充）：29 个 — 进阶课程 + 简化版变体
- P2（锦上添花）：10 个 — 量子/天文/数学工具

完整清单见 `../../docs/research/phet-competitive-analysis.md` 第四节。
