# 测试规则

## 框架

- 单元测试：Vitest（579 tests, 48 files）
- 集成测试：Vitest（tests/integration/，5 files）
- E2E 测试：Playwright（37 tests, 5 files）
- CI：GitHub Actions（.github/workflows/ci.yml）
- 配置文件：`vitest.config.ts`、`playwright.config.ts`

## 测试目录结构

```
tests/
├── unit/              # 单元测试（纯函数 + mock DB/service）
│   ├── models/        # T2: Model 层（mock @/core/db）
│   ├── services/      # T3: Service 层（mock models）
│   └── routes/        # T4: API Route 层（mock services）
├── integration/       # T5: 集成测试（深层 mock，验证调用链）
├── helpers/           # 共享 mock 工具
│   └── mock-db.ts     # Drizzle chainable mock factory
├── e2e/               # T6: Playwright E2E
└── setup.ts           # Vitest setup
```

## Mock 策略（CTO 决策 2026-03-23）

- T1 纯函数：无 mock
- T2-T4：`vi.mock('@/core/db')` + `tests/helpers/mock-db.ts`
- T5 集成：深层 mock，真实 service+model 函数
- 所有 mock factory 必须类型化（TypeScript 编译时捕获接口漂移）

## 必须测试

- UPG 生成管线（generate-core、html-sanitizer、quality-checker）
- 支付流程（payment.ts — handleCheckoutSuccess、webhook、renewal、cancel）
- 权限控制（canAccessExperiment、canAccessTier、getAccessibleExperiments）
- 配额/限流逻辑
- API 路由的鉴权和参数校验
- 数据库 model 层的 CRUD 操作
- 内容审核（moderateInput、moderateOutput）

## 测试命名

- 文件：`*.test.ts`（tests/unit/、tests/integration/）
- E2E：`*.spec.ts`（tests/e2e/）
- 描述：`describe('模块名')` → `it('should 动作 when 条件')`

## 运行命令

```bash
pnpm test              # Vitest 全量（unit + integration）
pnpm test:coverage     # 带覆盖率
pnpm test:e2e          # Playwright E2E（需 dev server）
```

## 规则

- 改了业务逻辑就跑对应测试，不要只口头说"应该没问题"
- 新增 API 路由必须有至少 1 个 happy path + 1 个 error path 测试
- 覆盖率只升不降（ratchet 机制，CI 自动门控）
- 测试不依赖执行顺序，每个测试独立
- E2E 测试截图保存到 `test-screenshots/`
- 详细测试计划见 `docs/plans/test-coverage-100-plan.md`
