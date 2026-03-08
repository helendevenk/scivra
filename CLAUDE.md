# SeePhysics v2 — Project Guide for Claude

> 基线代码：ShipAny Template Two v1.6.0
> 主线仓库：`/Users/sky/Desktop/sciwangzhan/seephysics-v2`

## 项目定位

教育类 AI SaaS，两条业务主线：
- **Curated Labs**：物理实验 3D 可视化（React Three Fiber）
- **UPG（Universal Principle Generator）**：AI 生成零依赖 HTML 交互式可视化

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS v4 + shadcn/ui (new-york style) |
| 数据库 | PostgreSQL + Drizzle ORM |
| 认证 | Better Auth |
| i18n | next-intl (en/zh, prefix: as-needed) |
| 3D | React Three Fiber + Drei + Postprocessing |
| AI SDK | Vercel AI SDK v5 + OpenRouter |
| 支付 | Stripe / PayPal / Creem |
| 文档 | Fumadocs (MDX) |
| 测试 | Vitest (unit) + Playwright (e2e) |
| 部署 | Vercel (主) / Cloudflare Workers (备) |
| 包管理 | pnpm |

## 目录结构

```
seephysics-v2/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # i18n 路由根
│   │   │   ├── (admin)/admin/        # 管理后台页面
│   │   │   ├── (auth)/               # 登录/注册
│   │   │   ├── (chat)/chat/          # AI 聊天
│   │   │   ├── (docs)/docs/          # Fumadocs 文档
│   │   │   ├── (landing)/            # 前台页面
│   │   │   │   ├── (ai)/upg/         # UPG 生成/查看/我的
│   │   │   │   ├── experiments/      # 物理实验
│   │   │   │   ├── gallery/          # UPG 画廊
│   │   │   │   ├── blog/             # 博客
│   │   │   │   ├── pricing/          # 定价
│   │   │   │   ├── dashboard/        # 用户仪表盘
│   │   │   │   └── settings/         # 用户设置
│   │   │   └── embed/[id]/           # 嵌入式查看器
│   │   ├── api/                      # API Routes
│   │   │   ├── ai/                   # AI 生成 (image/query)
│   │   │   ├── upg/                  # UPG CRUD + generate
│   │   │   ├── gallery/              # 画廊 API (like/fork/publish)
│   │   │   ├── compliance/           # 合规 (age-gate/consent)
│   │   │   ├── privacy/              # GDPR (export/delete/status)
│   │   │   ├── experiments/          # 实验进度
│   │   │   ├── payment/              # 支付 (checkout/callback/notify)
│   │   │   ├── chat/                 # 聊天 API
│   │   │   ├── cron/                 # 定时任务 (data-retention)
│   │   │   └── user/                 # 用户信息/积分
│   │   ├── layout.tsx                # Root Layout (字体/分析/广告/Cookie Banner)
│   │   ├── robots.ts                 # robots.txt
│   │   └── sitemap.ts               # sitemap.xml
│   ├── config/
│   │   ├── index.ts                  # envConfigs 全局配置
│   │   ├── db/
│   │   │   ├── schema.ts            # Drizzle schema (所有表定义)
│   │   │   ├── config.ts            # Drizzle Kit 配置
│   │   │   └── migrations/          # SQL 迁移文件
│   │   ├── locale/
│   │   │   ├── index.ts             # locales/defaultLocale 配置
│   │   │   └── messages/{en,zh}/    # i18n JSON 翻译文件
│   │   ├── style/                   # global.css, theme.css, docs.css
│   │   └── theme/                   # 主题配置
│   ├── core/                        # 核心基础设施（不含业务逻辑）
│   │   ├── auth/                    # Better Auth 配置
│   │   ├── compliance/              # 合规服务 (service/repository/retention)
│   │   ├── db/                      # 数据库连接
│   │   ├── docs/                    # Fumadocs source/toc
│   │   ├── i18n/                    # next-intl routing/request
│   │   ├── rbac/                    # 角色权限
│   │   └── theme/                   # ThemeProvider
│   ├── extensions/                  # 可插拔扩展（第三方集成）
│   │   ├── ai/                      # AI providers (fal/gemini/kie/replicate)
│   │   ├── analytics/               # GA/Plausible/Clarity/Vercel/OpenPanel
│   │   ├── payment/                 # Stripe/PayPal/Creem
│   │   ├── storage/                 # R2/S3
│   │   ├── email/                   # Resend
│   │   ├── monitoring/              # Sentry
│   │   ├── ads/                     # AdSense
│   │   ├── affiliate/               # PromoteKit/Affonso
│   │   └── customer-service/        # Crisp/Tawk
│   ├── shared/
│   │   ├── blocks/                  # 业务组件
│   │   │   ├── upg/                 # UPG 生成器组件
│   │   │   ├── gallery/             # 画廊卡片/列表/详情
│   │   │   ├── experiments/         # PaywallGate
│   │   │   ├── legal/               # CookieConsentBanner
│   │   │   ├── chat/                # 聊天 UI
│   │   │   ├── dashboard/           # 后台布局
│   │   │   ├── sign/                # 登录/注册表单
│   │   │   ├── payment/             # 支付弹窗
│   │   │   └── ...                  # form/table/panel/common
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui 基础组件
│   │   │   ├── magicui/             # MagicUI 动效组件
│   │   │   ├── ai-elements/         # AI 对话 UI 组件
│   │   │   └── experiments/         # Three.js 场景 + 实验 UI
│   │   ├── hooks/                   # React Hooks
│   │   ├── lib/
│   │   │   ├── upg/                 # UPG 领域逻辑 (generate/sanitize/prompt/quality)
│   │   │   ├── usage/               # 配额/进度服务
│   │   │   ├── physics/             # 物理计算引擎
│   │   │   ├── experiments/         # 实验注册表/数据/访问控制
│   │   │   ├── seo/                 # JSON-LD 结构化数据
│   │   │   └── utils.ts             # 通用工具 (cn, etc.)
│   │   ├── models/                  # 数据访问层 (每表一个文件)
│   │   ├── services/                # 服务层 (ai/payment/rbac/storage/...)
│   │   ├── types/                   # TypeScript 类型定义
│   │   └── contexts/                # React Context (app/chat)
│   └── themes/default/              # 主题模板 (landing blocks)
├── content/                         # MDX 内容 (docs/pages)
├── tests/
│   ├── unit/                        # Vitest 单元测试
│   ├── integration/                 # 集成测试
│   ├── e2e/                         # Playwright E2E
│   └── setup.ts                     # 测试 setup
├── docs/                            # 项目文档
│   ├── PROJECT-BASELINE.md          # 项目基线 (Single Source of Truth)
│   ├── WORKSPACE-STATUS.md          # 状态看板
│   ├── ARCHIVE-LOG.md               # 归档记录
│   └── plans/                       # 设计文档
├── scripts/                         # 脚本 (init-rbac/assign-role)
├── public/                          # 静态资源
└── screenshots/                     # 截图
```

## 关键约定

### 路径别名
- `@/*` → `./src/*`
- `@/.source` → `./.source/index.ts` (Fumadocs)

### 数据库
- Schema 集中定义在 `src/config/db/schema.ts`
- Model 层在 `src/shared/models/`，每张表一个文件
- 迁移输出到 `src/config/db/migrations/`
- 命令：`pnpm db:generate` → `pnpm db:push` → `pnpm db:studio`

### 认证
- Better Auth 配置在 `src/core/auth/`
- 客户端：`src/core/auth/client.ts`
- RBAC：`src/core/rbac/` + `scripts/init-rbac.ts`

### i18n
- 支持语言：`en`（默认）、`zh`
- 翻译文件：`src/config/locale/messages/{en,zh}/`
- 路由前缀：`as-needed`（英文无前缀，中文 `/zh/...`）
- 新增页面必须同时添加 en/zh 翻译 JSON

### 组件层级
- `shared/components/ui/` — shadcn/ui 原子组件，不含业务逻辑
- `shared/blocks/` — 业务组件，可组合 ui 组件
- `themes/default/blocks/` — Landing 页面区块（hero/features/pricing/...）

### API 路由
- 所有 API 在 `src/app/api/`
- AI 相关路由 maxDuration: 60s，其他 30s（见 vercel.json）
- 定时任务：`/api/cron/data-retention`（每天 03:00 UTC）

### UPG 领域
- 生成核心：`src/shared/lib/upg/generate-core.ts`
- System Prompt：`src/shared/lib/upg/system-prompt.ts`
- HTML 安全检查：`src/shared/lib/upg/html-sanitizer.ts`
- 质量检查：`src/shared/lib/upg/quality-checker.ts`
- 模型选择：`src/shared/lib/upg/model-selector.ts`
- OpenRouter 客户端：`src/shared/lib/upg/openrouter-client.ts`
- 每日配额：`src/shared/models/upg_daily_quota.ts`

## 常用命令

```bash
pnpm dev                # 本地开发 (Turbopack)
pnpm build              # 生产构建
pnpm lint               # ESLint
pnpm format             # Prettier 格式化
pnpm test               # Vitest 单元测试 (run mode)
pnpm test:coverage      # 带覆盖率
pnpm test:e2e           # Playwright E2E
pnpm db:generate        # 生成迁移
pnpm db:push            # 推送 schema 到数据库
pnpm db:studio          # Drizzle Studio GUI
pnpm rbac:init          # 初始化 RBAC 角色/权限
```

## 环境变量

必需（见 `.env.example`）：
- `NEXT_PUBLIC_APP_URL` — 应用 URL
- `NEXT_PUBLIC_APP_NAME` — 应用名称
- `DATABASE_URL` — PostgreSQL 连接串
- `AUTH_SECRET` — Better Auth 密钥 (`openssl rand -base64 32`)

可选：
- `NEXT_PUBLIC_THEME` — 主题 (default: `default`)
- `NEXT_PUBLIC_APPEARANCE` — 外观 (default: `system`)
- `DATABASE_PROVIDER` — 数据库类型 (default: `postgresql`)
- `DB_SINGLETON_ENABLED` — 单例连接 (default: `true`)

## 数据库 Schema 概览

### 基础表（ShipAny 模板）
`user` / `session` / `account` / `verification` / `config` / `taxonomy` / `post` / `order` / `subscription` / `credit` / `apikey` / `role` / `permission` / `rolePermission` / `userRole` / `aiTask` / `chat` / `chatMessage`

### SeePhysics 扩展表
- `experimentProgress` — 实验进度追踪
- `anonymousUsage` — 匿名用户使用量
- `userComplianceProfile` — 合规档案 (COPPA/GDPR)
- `dailyUsage` — 每日使用量
- `consentEvent` — 同意事件审计
- `privacyRequest` — GDPR 隐私请求

### UPG 表
- `upgGeneration` — 生成记录（含 HTML 内容、社交属性）
- `upgReport` — 举报记录
- `upgDailyQuota` — 每日生成配额
- `upgLike` — 点赞
- `experimentMetadata` — 实验元数据（Phase 2 占位）

## 当前状态

参见 `docs/WORKSPACE-STATUS.md`，核心进度：
- ✅ 工作区治理（代码库收敛、归档）
- ✅ v1→v2 迁移（合规 Phase 2 + 配额 Phase 3）
- 🟡 UPG 上线闭环（页面/API 骨架已有，联调收尾中）
- ⬜ Phase 4-7（监控/SEO/E2E/Cron）

## 开发规范

### 新增页面
1. 在 `src/app/[locale]/` 对应路由组下创建 `page.tsx`
2. 添加 `en` 和 `zh` 翻译 JSON
3. 在 `src/config/locale/index.ts` 的 `localeMessagesPaths` 注册

### 新增 API
1. 在 `src/app/api/` 下创建 `route.ts`
2. 如需延长超时，在 `vercel.json` 的 `functions` 中配置
3. 使用 `src/shared/lib/resp.ts` 统一响应格式

### 新增数据表
1. 在 `src/config/db/schema.ts` 定义表结构
2. 在 `src/shared/models/` 创建对应 model 文件
3. 运行 `pnpm db:generate && pnpm db:push`

### 新增组件
- 纯 UI → `src/shared/components/ui/`
- 业务组件 → `src/shared/blocks/{domain}/`
- Landing 区块 → `src/themes/default/blocks/`

## 文档索引

### 代码真相（优先阅读）
- `docs/PROJECT-BASELINE.md` — 项目基线
- `docs/WORKSPACE-STATUS.md` — 状态看板

### 产品与计划
- `/Users/sky/Desktop/sciwangzhan/NeonPhysics-PRD.md`
- `/Users/sky/Desktop/sciwangzhan/NeonPhysics-DevPlan.md`
- `/Users/sky/Desktop/sciwangzhan/UPG-PRD.md`
- `/Users/sky/Desktop/sciwangzhan/UPG-DEV-PLAN.md`
- `docs/plans/` — 各模块设计文档

### 设计文档
- `docs/plans/2026-02-24-upg-gallery-design.md`
- `docs/plans/2026-02-24-user-dashboard-design.md`
- `docs/plans/2026-02-24-learning-path-design.md`
- `docs/plans/2026-02-24-ai-tutor-design.md`
- `docs/plans/2026-02-24-embed-widget-design.md`
- `docs/plans/2026-02-24-experiment-enhancement-design.md`
- `docs/plans/2026-02-26-seephysics-v2-implementation-plan.md`
- `docs/plans/2026-02-28-learning-path-technical-spec.md`
