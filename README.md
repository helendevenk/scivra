# Scivra v2

Scivra v2 是一个面向科学教育的 AI SaaS 项目，当前包含两条业务主线：

- **Curated Labs（精选实验）**：物理实验可视化与课程化能力。
- **UPG（Universal Principle Generator）**：输入主题后生成交互式可视化内容。

## 当前状态

仓库仍在持续迭代中。历史规划、阶段报告与当前代码实现可能存在时间差，评审和开发时请优先以代码目录、[ARCHITECTURE.md](./ARCHITECTURE.md) 和现有测试为准。

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

### 代码真相类
- [架构说明](./ARCHITECTURE.md)
- [技术债务记录](./docs/tech-debt.md)
- [归档记录](./docs/ARCHIVE-LOG.md)

### 计划与阶段资料
- [计划文档目录](./docs/plans)
- [阶段报告目录](./docs/reports)
- [测试计划与报告](./docs/test-plans), [测试结果](./docs/test-reports)

## 说明

当前仓库文档较多，且包含历史设计稿、复盘与归档材料。阅读时建议先看 `README.md`、`ARCHITECTURE.md` 和 `tests/`，再按需进入 `docs/plans/` 与 `docs/reports/`。
