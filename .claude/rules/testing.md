# 测试规则

## 框架

- 单元测试：Vitest（当前 64 tests）
- E2E 测试：Playwright
- 配置文件：`vitest.config.ts`、`playwright.config.ts`

## 必须测试

- UPG 生成管线（generate-core、html-sanitizer、quality-checker）
- 配额/限流逻辑
- API 路由的鉴权和参数校验
- 数据库 model 层的 CRUD 操作

## 测试命名

- 文件：`*.test.ts`（与被测文件同目录或 `__tests__/` 下）
- 描述：`describe('模块名')` → `it('should 动作 when 条件')`

## 运行命令

```bash
pnpm test          # Vitest 全量
pnpm test:coverage # 带覆盖率
pnpm test:e2e      # Playwright E2E
```

## 规则

- 改了业务逻辑就跑对应测试，不要只口头说"应该没问题"
- 新增 API 路由必须有至少 1 个 happy path + 1 个 error path 测试
- 不 mock 数据库（用真实测试数据库）
- 测试不依赖执行顺序，每个测试独立
- E2E 测试截图保存到 `test-screenshots/`
