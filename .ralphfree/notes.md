# Notes: v1 → v2 合并笔记

## 架构发现

### v2 的 DB 实例
- 位置: `src/core/db/index.ts`
- 导出: `db` (drizzle 实例)
- Schema: `src/config/db/schema.ts`

### v2 的 Auth 方式
- `getSignUser()` from `src/shared/models/user.ts` — 获取当前登录用户
- `getAuth()` from `src/core/auth/index.ts` — Better Auth 实例
- `getCurrentSubscription()` from `src/shared/models/subscription.ts` — 获取订阅状态

### v2 的 ID 生成
- `getUuid()` — 需要确认来源，可能在 utils 中

### v1 → v2 表名映射
- v1 `users` (复数) → v2 `user` (单数)
- v1 `consentEvents` → v2 新建 `consent_event`
- v1 `privacyRequests` → v2 新建 `privacy_request`
- v1 `dailyUsage` → v2 新建 `daily_usage`
- v1 `experimentProgress` → v2 已有 `experiment_progress`（需补字段）

### v2 实验数据是静态注册表
- `src/shared/lib/experiments/registry.ts` — 硬编码实验列表
- 配额系统的 experimentId 应该用 slug 关联，不是数据库 ID
