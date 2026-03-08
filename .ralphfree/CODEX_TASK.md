# CODEX_TASK: Phase 1 Gallery + Embed + Dashboard 测试

## 目标
全面测试 NeonPhysics v2 Phase 1 实现的 Gallery、Embed、Dashboard 功能。

## 项目路径
- 项目根目录：/Users/sky/Desktop/sciwangzhan/neonphysics-v2
- 启动命令：pnpm dev
- 数据库：PostgreSQL

## 测试清单

### 1. 数据库验证 ✅
- [x] 确认新表和列已创建
- [x] upg_generation 新增 5 个 Gallery 字段
- [x] upg_like 表
- [x] experiment_metadata 表
- [x] 运行 `pnpm db:studio` 检查 schema

### 2. API 测试 🟡
- [x] GET /api/gallery — 列表查询
- [x] GET /api/gallery/[id] — 详情查询（需要一个已公开的 generation ID）
- [ ] POST /api/gallery/[id]/like — 点赞（需要登录）
- [ ] POST /api/gallery/publish — 发布/取消发布
- [x] GET /api/gallery/tags — 热门标签
- [ ] GET /api/dashboard — 仪表盘（需要登录）
- [ ] POST /api/gallery/[id]/fork — Fork（需要登录 + 5 credits）

### 3. 前端页面测试 ⏳
- [ ] /gallery — 列表页渲染，搜索、筛选、排序、无限滚动
- [ ] /gallery/[id] — 详情页渲染，点赞、Fork、Embed 按钮
- [ ] /embed/[id] — Embed 页面渲染 + 水印（需要先有一个公开的 generation）
- [ ] /dashboard — Dashboard 页面渲染（需要登录）
- [ ] /upg/view/[id] — Publish/Embed 按钮是否显示

### 4. i18n 测试 ⏳
- [ ] 切换 en/zh，检查 Gallery 和 Dashboard 页面文案

### 5. 导航测试 ⏳
- [ ] Header 是否有 Gallery 链接

## 完成条件
- 所有 API 返回正确数据
- 所有页面正常渲染
- i18n 切换正常
- 导航链接正常
