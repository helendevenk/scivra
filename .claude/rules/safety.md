# 安全红线

## 绝不自动执行（必须确认）

### 数据库
- `db:push` 到生产环境
- DROP/TRUNCATE/DELETE without WHERE
- 修改 `src/config/db/schema.ts` 中已有字段的类型或约束

### 支付
- Stripe/PayPal/Creem webhook 配置变更
- 积分扣除逻辑修改
- 价格/套餐配置修改

### 认证与权限
- Better Auth 配置修改（`src/core/auth/`）
- RBAC 角色/权限定义修改
- COPPA/GDPR 合规逻辑修改（`src/core/compliance/`）

### 部署
- `vercel.json` 修改
- 环境变量（`.env`）修改
- GitHub Actions workflow 修改
- Docker 配置修改

### Git
- push 到 main
- force push
- amend 已推送的 commit
- rebase shared branch

## 安全编码

- 不硬编码 API key、密码、连接串
- UPG 生成的 HTML 必须走 `html-sanitizer.ts` 过滤
- iframe sandbox 属性不可删减
- CDN 白名单（`html-sanitizer.ts`）不可随意扩展
- Redis 限流逻辑不可降级为内存 Map（serverless 隔离问题）
- 用户输入必须验证（Zod schema）

## 敏感文件

- `.env` / `.env.local` — 不提交、不读取内容给用户
- `src/core/auth/` — 认证核心，改动需特别谨慎
- `src/core/compliance/` — 合规（COPPA/GDPR），法律相关
- `src/config/db/schema.ts` — 38 张表的 schema，改动影响面大
