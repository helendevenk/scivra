# Scivra — Project Guide for Codex

> 当前文档定位：AI 协作约束与工程约定
> 最后核对：2026-04-23

## 项目定位

Scivra 是面向北美 K12 科学教育场景的 AI SaaS。当前对外有两条主线：

- **Curated Labs**：站点当前公开提供 **175** 个 HTML 实验
- **UPG（Universal Principle Generator）**：AI 生成交互式可视化；当前路由面只有 `src/app/[locale]/(landing)/(ai)/upg/`

不要把仓库里的历史内容文件、禁用配置或规划文档当成已上线能力。

## 当前事实快照

- 应用路由当前是 **English-only**：`locales = ['en']`、`defaultLocale = 'en'`、`localePrefix = 'never'`、`localeDetection = false`
- 实验公开面是 **175** 个 `public/experiments/**/*.html`
- 实验注册表是 **179** 个 `Experiment` 定义，等于 **175** 个 public HTML 实验加 **4** 个 Wave 1 React/R3F 实验
- R3F 场景组件位于 `src/shared/components/experiments/three/`
- `src/app/api/**/route.ts` 当前共有 **75** 个
- `src/config/db/schema.ts` 当前定义 **53** 个 `pgTable(...)`
- `src/app/api/cron` 当前不存在
- `src/app/[locale]/(landing)/(ai)/` 当前只有 `upg/`
- UPG 学科当前仅 `physics` 为 enabled；`chemistry`、`biology`、`math`、`earth-science` 均为 disabled config

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 语言 | TypeScript（strict mode enabled） |
| 样式 | Tailwind CSS v4 + shadcn/ui |
| 主题 | edu-academic |
| 数据库 | PostgreSQL + Drizzle ORM（53 个 `pgTable`） |
| 认证 | Better Auth + RBAC |
| i18n | next-intl，当前 English-only |
| 3D | React Three Fiber + Drei（应用内）/ Three.js（UPG 生成 HTML） |
| AI | Anthropic-compatible client + OpenRouter-compatible provider wiring |
| 缓存 | Upstash Redis（限流 + 分布式锁） |
| 支付 | Stripe / PayPal / Creem |
| 存储 | Cloudflare R2 |
| 邮件 | Resend |
| 文档 | Fumadocs (MDX) |
| 测试 | Vitest + Playwright |
| 部署 | Vercel / Cloudflare Workers |
| 包管理 | pnpm |

## 工作区结构

```text
scivra/
├── README.md
├── ARCHITECTURE.md
├── AGENTS.md
├── docs/
│   ├── archive/
│   ├── plans/
│   ├── reports/
│   └── tech-debt.md
├── public/
│   └── experiments/
├── src/
└── tests/
```

## 目录结构（Scivra）

```text
src/
├── app/
│   ├── [locale]/                     # 路由包装层；当前对外仍是 English-only
│   │   ├── (admin)/                  # 管理后台
│   │   ├── (auth)/                   # 登录/注册
│   │   ├── (chat)/                   # AI 聊天
│   │   ├── (docs)/                   # Fumadocs 文档
│   │   └── (landing)/                # 前台
│   │       ├── (ai)/upg/             # 当前已落地的 AI 路由
│   │       ├── learn/[slug]/nodes/   # 学习路径
│   │       ├── gallery/              # UPG 画廊
│   │       ├── dashboard/            # 用户仪表盘
│   │       ├── settings/             # 用户设置
│   │       └── embed/[id]/           # 嵌入式查看器
│   └── api/                          # API Routes（当前 75 个 route.ts）
├── config/
│   ├── index.ts                      # envConfigs 全局配置
│   ├── lib-versions.ts               # CDN 版本集中管理
│   ├── db/schema.ts                  # Drizzle schema
│   ├── locale/                       # locale 配置与消息命名空间；当前路由面 English-only
│   └── style/
│       ├── theme.css                 # 主题 token
│       └── theme-education.css       # edu-academic 主题样式
├── core/                             # 基础设施（不含业务逻辑）
│   ├── auth/                         # Better Auth 配置
│   ├── compliance/                   # COPPA/GDPR 服务
│   ├── db/                           # 数据库连接
│   ├── rbac/                         # 角色权限
│   └── theme/                        # ThemeProvider
├── extensions/                       # 可插拔第三方集成
│   ├── ai/                           # AI providers
│   ├── payment/                      # Stripe/PayPal/Creem
│   ├── analytics/                    # 分析集成
│   ├── storage/                      # R2/S3
│   ├── email/                        # Resend
│   └── monitoring/                   # Sentry
├── shared/
│   ├── blocks/                       # 业务组件（按领域分目录）
│   ├── components/ui/                # 原子 UI 组件
│   ├── hooks/                        # React Hooks
│   ├── lib/
│   │   ├── upg/                      # UPG 领域
│   │   ├── usage/                    # 配额/进度
│   │   ├── physics/                  # 物理计算
│   │   └── experiments/              # 实验注册表/访问控制
│   ├── models/                       # 数据访问层
│   ├── services/                     # 服务层
│   └── types/                        # TypeScript 类型
└── themes/default/                   # Landing 页面模板
```

## 关键约定

### 路径别名

- `@/*` → `./src/*`
- `@/.source` → `./.source/index.ts`

### 数据库

- Schema 集中在 `src/config/db/schema.ts`
- Model 层位于 `src/shared/models/`，按表拆文件
- 主键约定是 `text('id')` + 应用层 `getUuid()`
- JSON 字段沿用 `text` 存储 + 应用层序列化
- 时间戳沿用不带 timezone 的 `timestamp(...)`
- 迁移流程：`pnpm db:generate` → `pnpm db:push` → `pnpm db:studio`

### 认证

- Better Auth 配置在 `src/core/auth/`
- 当前用户辅助函数是 `getSignUser()` 与 `getUserInfo()`
- RBAC 位于 `src/core/rbac/`

### i18n

- 应用当前只注册 `en`
- locale 配置位于 `src/config/locale/index.ts`
- 翻译文件根目录是 `src/config/locale/messages/`
- 新增页面如需新文案命名空间，只添加 English JSON，并在 locale 配置中注册
- 仓库中即便仍存在 `zh` 内容或历史消息文件，也不代表当前站点已支持中文

### 组件层级

- `shared/components/ui/`：原子 UI 组件，不放业务逻辑
- `shared/blocks/`：业务组件，可组合 UI 组件
- `themes/default/blocks/`：Landing 页面区块

### API 路由

- 统一响应格式使用 `src/shared/lib/resp.ts`
- 路由超时配置看 `vercel.json`
- 不要把不存在的 `src/app/api/cron` 写成已实现能力

### UPG 领域

- 生成核心：`src/shared/lib/upg/generate-core.ts`
- System Prompt：`src/shared/lib/upg/system-prompt.ts`
- HTML 安全：`src/shared/lib/upg/html-sanitizer.ts`
- 质量检查：`src/shared/lib/upg/quality-checker.ts`
- 学科配置：`src/shared/lib/upg/disciplines/`
- 当前只有 `physics` enabled；其他学科配置存在但未启用
- `179` 的实验注册表数字包含 `175` 个 public HTML 实验和 `4` 个 Wave 1 React/R3F 实验

## UI 设计方向（Brand SSOT）

品牌规范的唯一事实源：[`docs/design/brand-spec.md`](./docs/design/brand-spec.md)

任何色值、字体、face、token 改动，先更新 brand-spec，再改 `theme.css` / `theme-education.css`，不要把易漂移的视觉细节再抄一份到这里。

- Face system 与 tokens 实现：`src/config/style/theme.css` + `theme-education.css`
- CSS 前缀：`.np-*`
- 字体 stack 以 `theme.css` 为准

## 数据库 Schema 概览

当前 schema 以 `src/config/db/schema.ts` 为准，可按领域理解：

- 账户与基础能力：auth、config、post、order、subscription、credit、apikey、RBAC、chat
- 合规：`userComplianceProfile`、`dailyUsage`、`consentEvent`、`privacyRequest`
- UPG：`upgGeneration`、`upgReport`、`upgDailyQuota`、`upgLike`、`upgTag`、`contentModeration`
- 学习与实验：`experimentProgress`、learning path 相关表、`learningStats`
- 课程扩展：AP Prep、Quest、Lab Notebook 相关表

## 历史里程碑（非当前事实源）

以下内容只表示对应日期的历史快照，不代表当前仓库每一项口径都仍然成立。细节看 `docs/reports/`。

### 快照日期：2026-03-26

- 完成 v1 → v2 迁移阶段的主要建设
- UPG 管线、安全加固、学习路径、画廊和课程扩展能力进入可用阶段
- edu-academic 主题方向完成合并

### 快照日期：2026-03-31

- 继续收敛 TypeScript 类型问题
- 完成实验缩略图补齐和 UPG prompt v2 调整
- 做过一轮 UPG 端到端联调

### 快照日期：2026-04-10

- 自定义域名、生产 QA、法律页与文档清理完成一轮收口
- 文档与品牌相关遗留项做过一次集中修正

## Health Stack

- typecheck: `tsc --noEmit`
- lint: `pnpm lint`
- test: `pnpm test`

## 常用命令

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm db:generate
pnpm db:push
pnpm db:studio
pnpm rbac:init
```

## 环境变量

必需（见 `.env.example`）：

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `DATABASE_URL`
- `AUTH_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

常见可选项：

- `NEXT_PUBLIC_THEME`
- `DATABASE_PROVIDER`
- `DB_SINGLETON_ENABLED`

## 文档索引

### 当前事实源

- `README.md`
- `ARCHITECTURE.md`
- `AGENTS.md`
- `src/`、`public/`、`tests/`

### 历史与规划材料

- `docs/archive/`：历史材料
- `docs/plans/`：规划文档，不是当前事实源
- `docs/reports/`：阶段报告，不是当前事实源
- `docs/tech-debt.md`：当前技术债上下文
- `docs/design/brand-spec.md`：品牌规范 SSOT

## 开发规范

### 新增页面

1. 在 `src/app/[locale]/` 对应路由组下创建 `page.tsx`
2. AI 工具类页面放在 `(ai)/` 路由分组下；当前已落地页面只有 `upg`
3. 如需新文案命名空间，只添加 English JSON
4. 在 `src/config/locale/index.ts` 的 `localeMessagesPaths` 注册

### 新增 API

1. 在 `src/app/api/` 下创建 `route.ts`
2. 如需延长超时，在 `vercel.json` 的 `functions` 中配置
3. 使用 `src/shared/lib/resp.ts` 统一响应格式
4. AI 路由加 Redis 限流

### 新增数据表

1. 在 `src/config/db/schema.ts` 定义
2. 在 `src/shared/models/` 创建对应 model 文件
3. 运行 `pnpm db:generate && pnpm db:push`

### 新增组件

- 纯 UI → `src/shared/components/ui/`
- 业务组件 → `src/shared/blocks/{domain}/`
- Landing 区块 → `src/themes/default/blocks/`

## 已确认的技术决策

| 决策 | 当前口径 | 备注 |
|------|----------|------|
| i18n 路由 | English-only | 以 `src/config/locale/index.ts` 为准 |
| 实验数量引用 | 同时区分 `175 public HTML` 与 `179 registry` | 避免把两套数字混写 |
| UPG 学科状态 | 仅 `physics` enabled | 其余学科是 disabled config，不算已上线能力 |
| AI 路由入口 | 当前 `(ai)` 只有 `upg` | 不要再写 image/music/video generator 为现状 |
| Cron 能力 | 当前未实现 `src/app/api/cron` | 不要把计划中的 retention route 写成现状 |
| 价格/配额数字 | 需要去当前 UI 或配置核对 | 不要引用旧文档快照 |

## 历史定位记录（快照日期：2026-03-22）

竞品、novelty check 和市场定位材料保留在研究文档中，用于理解当时的产品判断，不用来声明当前已上线能力。

- 研究入口：`docs/research/`
- 这类材料默认按历史上下文处理

## Skill routing

当用户请求明显命中当前会话里可用的 skill 时，优先调用对应 skill，而不是直接自由发挥。

- 方案或架构评审：`plan-eng-review`
- 保存进度或续接会话：`handoff`
- OpenAI 产品或 API 文档：`openai-docs`
- HyperFrames 相关工作：`hyperframes` / `hyperframes-cli` / `hyperframes-registry`
- 表格或演示文稿：`Excel` / `PowerPoint`
- Skill 创建、安装或发现：`skill-creator` / `skill-installer` / `find-skills`

## Design Context

### Users

核心用户是北美中学科学学习场景中的学生、教师和自学者。

- 主场景：AP Physics / Chemistry / Biology 学习与可视化理解
- 次场景：K5 与初中阶段的科学启蒙探索、教师课堂演示
- 使用环境：学校电脑、家庭电脑、偶尔手机
- Job to be done：把抽象概念变成可观察、可操控、可理解的交互体验

### Brand Personality

三个关键词：**酷炫、好奇、自信**

- 酷炫：不是游戏皮肤，而是有辨识度的教育产品界面
- 好奇：鼓励学生主动拖动、修改、观察反馈
- 自信：数据、状态、反馈清晰可见，让用户感觉自己在掌控实验

### Aesthetic Direction

定位是“教育深度 + 现代 SaaS 视觉质量”。

- 主题：edu-academic
- 色彩：以 teal 为主色，保留学科区分色
- 字体：标题、正文、代码字体的分工以 `theme.css` 为准
- 动效：偏克制的微动效，尊重 `prefers-reduced-motion`
- 原则：不要做卡通化、不要做噪声过载、不要为了炫而牺牲可读性

### Design Principles

1. **Glow, don't shout**：用辉光引导注意力，不靠大面积刺激色。
2. **Data is visible**：关键物理量、进度、配额要可见。
3. **One click to interact**：从看到实验到开始操作，路径尽量短。
4. **Subject has color**：学科差异可以通过颜色和标签体现，但不只依赖颜色。
5. **Respect the student**：界面要像真正的学习工具，而不是幼稚化玩具。

### Accessibility

- 标准：WCAG 2.1 AA
- 键盘导航：交互元素可 Tab 到达
- 动效：尊重 `prefers-reduced-motion`
- 色盲：不要只靠颜色传达信息
- 3D 实验：核心信息应有非纯视觉补充
