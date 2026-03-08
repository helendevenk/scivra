# Notes: Phase 1 Gallery + Embed + Dashboard 测试

## 测试日期
2026-02-26

## 测试环境
- 项目：NeonPhysics v2
- 本地地址：http://localhost:3000
- 数据库：PostgreSQL

## 测试结果汇总

### ✅ 通过的测试

1. **数据库 Schema 验证**
   - `upg_generation` 表新增 5 个字段：like_count, fork_count, featured, tags, forked_from
   - `upg_like` 表已创建
   - `experiment_metadata` 表已创建
   - 索引和 FK 约束正确

2. **API 测试**
   - GET /api/gallery → 返回 `{"code":0,"list":[],"nextCursor":null,"hasMore":false}` ✅
   - GET /api/gallery/tags → 返回空标签列表 ✅
   - GET /api/dashboard → 返回登录要求（符合预期）✅

3. **i18n 配置**
   - en/gallery.json 存在且完整 ✅
   - zh/gallery.json 存在且完整 ✅
   - en/user-dashboard.json 存在 ✅

4. **导航配置**
   - landing.json 中已有 `/gallery` 导航链接 ✅

### ⏳ 待完成的测试

1. **创建测试数据**
   - 需要生成一个 UPG 作品并设置为 isPublic=true
   - 验证 Gallery 列表能显示该作品

2. **前端页面渲染测试**
   - /gallery 页面空状态显示
   - /gallery/[id] 详情页（需要有公开作品）
   - /embed/[id] 嵌入页
   - /dashboard 仪表盘页（需要登录）

3. **交互功能测试**
   - Publish/Unpublish 按钮
   - Like/Fork 功能
   - Embed 代码复制

## 问题记录

暂无重大问题发现。数据库 Schema 和 API 均正常工作。

## 下一步

1. 在浏览器中手动测试前端页面渲染
2. 创建测试作品并验证 Gallery 完整流程
3. 测试登录用户的 Dashboard 功能

---

## 旧笔记（v1 → v2 合并）

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
