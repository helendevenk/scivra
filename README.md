# Scivra v2

Scivra v2 是一个面向科学教育的 AI SaaS 项目，当前包含两条业务主线：

- **Curated Labs（精选实验）**：面向站点公开的交互式实验内容。
- **UPG（Universal Principle Generator）**：输入主题后生成交互式可视化内容。

## 当前状态

仓库仍在持续迭代中。评审和开发时请优先以当前代码、配置和测试为准；历史规划、阶段报告与当前实现之间可能存在时间差。

## 当前事实快照

- 应用当前是 **English-only**：`locales = ['en']`、`defaultLocale = 'en'`、`localePrefix = 'never'`、`localeDetection = false`
- Curated Labs 当前公开面向站点的是 **175** 个 `public/experiments/**/*.html`
- 实验注册表当前有 **179** 个 `Experiment` 定义，含 **175** 个 public HTML 实验和 **4** 个 Wave 1 React/R3F 实验
- `(ai)` 路由当前只有 `src/app/[locale]/(landing)/(ai)/upg/`
- UPG 当前仅 `physics` 为 enabled；`chemistry`、`biology`、`math`、`earth-science` 仍是存在于配置中的 disabled 状态
- 当前共有 **75** 个 `src/app/api/**/route.ts`
- `src/config/db/schema.ts` 当前定义 **53** 个 `pgTable(...)`

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Better Auth
- Drizzle ORM + PostgreSQL
- Tailwind CSS
- Vitest + Playwright

## 关键目录

```text
src/app/[locale]/(landing)/(ai)/upg/  # 当前已落地的 AI 路由
src/app/api/upg/                       # UPG API
src/core/compliance/                   # 合规核心服务
src/shared/lib/upg/                    # UPG 领域逻辑
src/shared/lib/usage/                  # 使用量/配额逻辑
src/shared/models/                     # 数据访问层
tests/                                 # 单测与 E2E
docs/                                  # 当前态文档、计划、报告与归档
```

## 快速开始

### 1) 安装依赖

```bash
pnpm install
```

### 2) 配置环境变量

```bash
cp .env.example .env.local
# 按实际环境补齐 DATABASE_URL / AUTH_SECRET 等
```

### 3) 初始化数据库

```bash
pnpm db:push
```

### 4) 本地启动

```bash
pnpm dev
```

## 常用命令

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm db:generate
pnpm db:push
```

## 文档索引

### 当前事实源
- [架构说明](./ARCHITECTURE.md)
- [AI 协作约定](./CLAUDE.md)
- [技术债务记录](./docs/tech-debt.md)

### 历史与阶段资料
- [归档入口](./docs/archive)
- [归档记录](./docs/ARCHIVE-LOG.md)
- [计划文档目录](./docs/plans)
- [阶段报告目录](./docs/reports)
- [测试计划与报告](./docs/test-plans)
- [测试结果](./docs/test-reports)

## 阅读顺序

建议先读 `README.md`、`ARCHITECTURE.md`、`CLAUDE.md`，再进入对应代码目录和 `tests/`。

`docs/archive/` 是历史材料；`docs/plans/` 与 `docs/reports/` 提供规划和阶段背景，不是当前事实源。
