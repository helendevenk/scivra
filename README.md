# Scivra v2

Scivra v2 是基于 ShipAny Template Two 二次开发的教育类 AI SaaS 项目，当前包含两条业务主线：

- **Curated Labs（精选实验）**：物理实验可视化与课程化能力。
- **UPG（Universal Principle Generator）**：输入主题后生成交互式可视化内容。

## 当前状态

- 主线仓库：`/Users/sky/Desktop/sciwangzhan/scivra-v2`
- 历史副本：已归档到 `/Users/sky/Desktop/sciwangzhan/archive/scivra-v2-copy-2026-02-25`
- 统一状态看板：[`docs/WORKSPACE-STATUS.md`](./docs/WORKSPACE-STATUS.md)
- 基线文档（单一真相）：[`docs/PROJECT-BASELINE.md`](./docs/PROJECT-BASELINE.md)

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Better Auth
- Drizzle ORM + PostgreSQL
- Tailwind CSS
- Vitest + Playwright

## 关键目录

```text
src/app/[locale]/(landing)/(ai)/upg/  # UPG 页面
src/app/api/upg/                       # UPG API
src/core/compliance/                   # 合规核心服务
src/shared/lib/upg/                    # UPG 领域逻辑
src/shared/lib/usage/                  # 使用量/配额逻辑
src/shared/models/                     # 数据访问层
tests/                                 # 单测与 E2E
docs/                                  # 基线、状态、归档记录
```

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量

```bash
cp .env.example .env.local
# 按实际环境补齐 DATABASE_URL / AUTH_SECRET 等
```

### 3) 初始化数据库

```bash
npm run db:push
```

### 4) 本地启动

```bash
npm run dev
```

## 常用命令

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:coverage
npm run test:e2e
npm run db:generate
npm run db:push
```

## 文档索引

### 代码真相类（优先阅读）
- [项目基线（Single Source of Truth）](./docs/PROJECT-BASELINE.md)
- [工作区统一状态看板](./docs/WORKSPACE-STATUS.md)
- [归档记录](./docs/ARCHIVE-LOG.md)

### 产品与计划（战略输入）
- [Scivra 产品策划书](/Users/sky/Desktop/sciwangzhan/NeonPhysics-PRD.md)
- [Scivra 开发计划书](/Users/sky/Desktop/sciwangzhan/NeonPhysics-DevPlan.md)
- [UPG PRD](/Users/sky/Desktop/sciwangzhan/UPG-PRD.md)
- [UPG 开发计划](/Users/sky/Desktop/sciwangzhan/UPG-DEV-PLAN.md)
- [UPG CTO 评审](/Users/sky/Desktop/sciwangzhan/UPG-CTO-REVIEW.md)

## 说明

当前仓库仍处于持续迭代期，部分“历史任务文档”与“代码实际落地”存在差异。开发与评审时请优先以 `docs/PROJECT-BASELINE.md` 与代码目录为准。
