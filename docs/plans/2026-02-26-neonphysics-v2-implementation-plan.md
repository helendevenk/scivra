# NeonPhysics v2 六模块详细开发计划（可直接执行）

> 日期：2026-02-26  
> 状态：可开工  
> 范围：Gallery、Experiment Enhancement、Learning Path、AI Tutor、Embed Widget、User Dashboard

## 0. 开发约定

- 分支建议：`codex/neonphysics-v2-multi-modules`
- 任务追踪文件：
  - `STATUS.md`：阶段状态与阻塞
  - `tasks.md`：逐任务勾选
- 完成定义（DoD）：
  - 代码实现完成
  - 对应测试通过（单测/必要 E2E）
  - 关键路径手测通过
  - 文档更新（变更点、接口、回滚方式）

## 1. 里程碑与顺序

| 里程碑 | 范围 | 预计时长 | 通过标准 |
|---|---|---:|---|
| M1 | Setup + 数据层改造 | 1.5 天 | 迁移可执行，核心模型可读写 |
| M2 | Gallery + Embed | 2.5 天 | Gallery 全链路可用，嵌入可外站展示 |
| M3 | Experiment Enhancement | 1.5 天 | 管理员可升级/降级实验，前台展示正常 |
| M4 | Learning Path | 3.5 天 | 路径编排、学习、进度、付费墙可用 |
| M5 | AI Tutor + Dashboard | 2.5 天 | 导师流式对话与仪表盘聚合可用 |
| M6 | Integration + Polish | 1.5 天 | 测试通过，SEO/埋点/文档齐备 |

## 2. 详细任务清单

### 2.1 Setup（T001-T014）

- [ ] `T001` 建立执行跟踪文件
  - 文件：`STATUS.md`、`tasks.md`
  - 依赖：无
  - 验收：两个文件创建并包含任务编号映射
  - 估时：0.3h

- [ ] `T002` 建立统一枚举与常量
  - 文件：`src/shared/lib/upg/constants.ts`、`src/shared/types/*`（新增 gallery/learn/tutor 类型）
  - 依赖：无
  - 验收：`scene/category/level` 枚举统一，避免字符串散落
  - 估时：0.5h

- [ ] `T003` 扩展 `upg_generation` schema（Gallery+Experiment）
  - 文件：`src/config/db/schema.ts`
  - 依赖：T002
  - 变更：`likeCount/forkCount/featured/tags/forkedFrom/isExperiment/experimentCategory/experimentLevel/experimentOrder`
  - 验收：schema 定义完整、字段命名与设计文档一致
  - 估时：0.8h

- [ ] `T004` 扩展 `upg_daily_quota` 增加 `scene`
  - 文件：`src/config/db/schema.ts`
  - 依赖：T002
  - 变更：新增 `scene`，唯一约束改为 `(user_id, usage_date, scene)`
  - 验收：quota 可按 `generation/tutor` 独立统计
  - 估时：0.6h

- [ ] `T005` 新增 `upg_like` 表
  - 文件：`src/config/db/schema.ts`
  - 依赖：T003
  - 验收：具备外键、唯一约束 `(user_id, generation_id)` 与必要索引
  - 估时：0.5h

- [ ] `T006` 新增 Learning Path 三张表 schema
  - 文件：`src/config/db/schema.ts`
  - 依赖：T002
  - 变更：`learning_path`、`learning_path_node`、`learning_path_progress`
  - 验收：包含 `CHECK`（`generation_id` 与 `experiment_slug` 互斥且必须其一）
  - 估时：1.2h

- [ ] `T007` 生成并校验迁移
  - 文件：`src/config/db/migrations/0002_*.sql`、`src/config/db/migrations/meta/*`
  - 依赖：T003-T006
  - 命令：`pnpm db:generate`
  - 验收：迁移 SQL 可读，包含约束/索引变更
  - 估时：0.6h

- [ ] `T008` 迁移脚本补丁（手工修正）
  - 文件：`src/config/db/migrations/0002_*.sql`
  - 依赖：T007
  - 重点：确认 `upg_daily_quota` drop/recreate 约束名正确
  - 验收：本地数据库 `pnpm db:migrate` 通过
  - 估时：0.8h

- [ ] `T009` 扩展 `upg_daily_quota` model 支持 `scene`
  - 文件：`src/shared/models/upg_daily_quota.ts`
  - 依赖：T004
  - 变更：`getDailyQuotaCount/increment/getOrCreate` 全部接收 `scene`
  - 验收：默认 scene=`generation`，兼容旧调用
  - 估时：0.8h

- [ ] `T010` 新建 Gallery 数据访问层
  - 文件：`src/shared/models/upg_gallery.ts`（新增）
  - 依赖：T003、T005
  - 验收：包含列表查询、详情、like toggle、fork 来源计数等函数
  - 估时：1.2h

- [ ] `T011` 新建 Learning Path 数据访问层
  - 文件：`src/shared/models/learning_path.ts`（新增）
  - 依赖：T006
  - 验收：路径/节点/进度 CRUD 与 progress upsert
  - 估时：1.5h

- [ ] `T012` 新建 Tutor 配额助手
  - 文件：`src/shared/lib/tutor/quota.ts`（新增）
  - 依赖：T009
  - 验收：提供 `consumeTutorSession()`，每日 5 次限制可配置
  - 估时：0.8h

- [ ] `T013` 统一错误码与响应体约定
  - 文件：`src/shared/lib/resp.ts`、新增 `src/shared/lib/errors.ts`
  - 依赖：无
  - 验收：新增接口统一返回错误结构，前端可稳定识别
  - 估时：0.7h

- [ ] `T014` [P] 建立模块路由骨架（空实现）
  - 文件：`src/app/api/gallery/*`、`src/app/api/learn/*`、`src/app/api/tutor/chat/route.ts`、`src/app/[locale]/(landing)/gallery/*`、`learn/*`、`dashboard/page.tsx`、`embed/*`
  - 依赖：T013
  - 验收：路由存在并返回占位数据或占位页面
  - 估时：1.5h

### 2.2 Tests（T101-T114）

- [ ] `T101` quota scene 单测（先红）
  - 文件：`tests/unit/upg-daily-quota-scene.test.ts`（新增）
  - 依赖：T009
  - 验收：验证 generation/tutor 不串算
  - 估时：0.8h

- [ ] `T102` Gallery 列表参数解析单测
  - 文件：`tests/unit/gallery-query.test.ts`（新增）
  - 依赖：T010
  - 验收：`sort/tag/q/cursor/author` 全覆盖
  - 估时：0.7h

- [ ] `T103` Gallery like toggle 逻辑单测
  - 文件：`tests/unit/gallery-like-toggle.test.ts`（新增）
  - 依赖：T010
  - 验收：重复点赞幂等、计数一致
  - 估时：0.7h

- [ ] `T104` Learning Path 进度推进单测
  - 文件：`tests/unit/learn-progress.test.ts`（新增）
  - 依赖：T011
  - 验收：答对/答错都推进；最后节点置 `completed=true`
  - 估时：0.8h

- [ ] `T105` Learning Path 付费墙判定单测
  - 文件：`tests/unit/learn-paywall.test.ts`（新增）
  - 依赖：T011
  - 验收：第 4 节开始按登录与订阅状态拦截
  - 估时：0.8h

- [ ] `T106` Tutor session 扣配额单测
  - 文件：`tests/unit/tutor-quota.test.ts`（新增）
  - 依赖：T012
  - 验收：按“打开会话一次扣 1 次”，消息不重复扣费
  - 估时：0.8h

- [ ] `T107` Dashboard 活动聚合单测
  - 文件：`tests/unit/dashboard-activity.test.ts`（新增）
  - 依赖：T010
  - 验收：只输出 `liked/forked` 两类，按时间合并排序
  - 估时：0.8h

- [ ] `T108` [P] API contract 快照测试
  - 文件：`tests/unit/api-contract-gallery.test.ts`、`tests/unit/api-contract-learn.test.ts`、`tests/unit/api-contract-dashboard.test.ts`
  - 依赖：T102-T107
  - 验收：关键字段与文档一致
  - 估时：1.2h

- [ ] `T109` [P] Playwright 基础 E2E：Gallery 浏览
  - 文件：`tests/e2e/gallery.spec.ts`（新增）
  - 依赖：T014
  - 验收：列表加载、详情打开、标签筛选可用
  - 估时：1.0h

- [ ] `T110` [P] Playwright E2E：Embed 加载
  - 文件：`tests/e2e/embed.spec.ts`（新增）
  - 依赖：T014
  - 验收：`/embed/[id]` 公开可访问、私有返回错误页
  - 估时：0.8h

- [ ] `T111` [P] Playwright E2E：Learning Path 走通
  - 文件：`tests/e2e/learn.spec.ts`（新增）
  - 依赖：T014
  - 验收：节点学习->答题->进度推进
  - 估时：1.2h

- [ ] `T112` [P] Playwright E2E：Tutor 抽屉交互
  - 文件：`tests/e2e/tutor.spec.ts`（新增）
  - 依赖：T014
  - 验收：打开会话、发送消息、流式回包、关闭清空
  - 估时：1.0h

- [ ] `T113` [P] Playwright E2E：Dashboard 聚合展示
  - 文件：`tests/e2e/dashboard.spec.ts`（新增）
  - 依赖：T014
  - 验收：四卡片、最近作品、最近活动渲染正常
  - 估时：0.8h

- [ ] `T114` 测试基线通过（红转绿）
  - 文件：无
  - 依赖：T101-T113
  - 验收：`pnpm test && pnpm test:e2e` 通过
  - 估时：0.6h

### 2.3 Core（T201-T266）

#### Gallery

- [ ] `T201` 实现 `GET /api/gallery`
  - 文件：`src/app/api/gallery/route.ts`
  - 依赖：T010
  - 验收：支持 `sort/tag/q/cursor/author` + 游标分页
  - 估时：1.2h

- [ ] `T202` 实现 `GET /api/gallery/[id]`
  - 文件：`src/app/api/gallery/[id]/route.ts`
  - 依赖：T010
  - 验收：仅公开可读，读详情时 viewCount+1
  - 估时：0.8h

- [ ] `T203` 实现 `POST /api/gallery/[id]/like`
  - 文件：`src/app/api/gallery/[id]/like/route.ts`
  - 依赖：T010
  - 验收：toggle + likeCount 一致
  - 估时：0.8h

- [ ] `T204` 实现 `POST /api/gallery/[id]/fork`
  - 文件：`src/app/api/gallery/[id]/fork/route.ts`
  - 依赖：T010
  - 验收：消耗 credits=5，写 `forkedFrom`，原作 `forkCount+1`
  - 估时：1.2h

- [ ] `T205` 实现 `GET /api/gallery/tags`
  - 文件：`src/app/api/gallery/tags/route.ts`
  - 依赖：T010
  - 验收：返回热门标签列表
  - 估时：0.6h

- [ ] `T206` 扩展 `PATCH /api/upg/[id]/publish`
  - 文件：`src/app/api/upg/[id]/publish/route.ts`（新增）或并入现有 upg id route
  - 依赖：T003
  - 验收：作者可发布/取消发布，可编辑标签
  - 估时：1.0h

- [ ] `T207` Gallery 页面实现
  - 文件：`src/app/[locale]/(landing)/gallery/page.tsx`、`src/shared/blocks/gallery/GalleryGrid.tsx` 等
  - 依赖：T201
  - 验收：无限滚动 + 筛选 + 搜索可用
  - 估时：2.0h

- [ ] `T208` Gallery 详情页实现
  - 文件：`src/app/[locale]/(landing)/gallery/[id]/page.tsx`、`GalleryDetail.tsx`
  - 依赖：T202-T204
  - 验收：点赞/Fork/标签推荐可用
  - 估时：1.8h

- [ ] `T209` 标签页实现
  - 文件：`src/app/[locale]/(landing)/gallery/tag/[tag]/page.tsx`
  - 依赖：T201
  - 验收：按 tag 聚合，SEO metadata 正确
  - 估时：1.0h

- [ ] `T210` UPG 查看页集成 PublishToggle
  - 文件：`src/app/[locale]/(landing)/(ai)/upg/view/[id]/client.tsx`、`PublishToggle.tsx`
  - 依赖：T206
  - 验收：发布状态切换稳定，失败可回滚提示
  - 估时：1.2h

#### Embed Widget

- [ ] `T221` 实现 `/embed/[id]` 页面
  - 文件：`src/app/[locale]/(landing)/embed/[id]/page.tsx`
  - 依赖：T202
  - 验收：公开可渲染，私有返回 404/无权限
  - 估时：1.0h

- [ ] `T222` 实现 `EmbedDialog`
  - 文件：`src/shared/blocks/embed/EmbedDialog.tsx`
  - 依赖：T221
  - 验收：三尺寸模板 + 一键复制
  - 估时：0.8h

- [ ] `T223` 实现 `EmbedWatermark`
  - 文件：`src/shared/blocks/embed/EmbedWatermark.tsx`
  - 依赖：T221
  - 验收：底部品牌条与跳转链接正常
  - 估时：0.6h

- [ ] `T224` 在 Gallery 与 UPG 页面接入 Embed 按钮
  - 文件：`GalleryDetail.tsx`、`upg/view/[id]/client.tsx`
  - 依赖：T222
  - 验收：`is_public=false` 时弹“先发布”引导
  - 估时：1.0h

#### Experiment Enhancement

- [ ] `T231` 实现 `GET /api/experiments` 改造
  - 文件：`src/app/api/experiments/route.ts`（新增）或改造现有 experiments 数据源
  - 依赖：T003
  - 验收：返回 Premium + AI 实验分区数据
  - 估时：1.0h

- [ ] `T232` 实现 admin promote/demote/edit API
  - 文件：`src/app/api/admin/experiments/*`（新增）
  - 依赖：T003、T010
  - 验收：admin 鉴权、参数校验、写入字段正确
  - 估时：1.8h

- [ ] `T233` 改造 `/experiments` 前台页
  - 文件：`src/app/[locale]/(landing)/experiments/page.tsx`、相关组件
  - 依赖：T231
  - 验收：分区展示 + 学科/难度筛选 + 跳转 gallery 详情
  - 估时：1.5h

- [ ] `T234` 新增 admin 实验管理页
  - 文件：`src/app/[locale]/(admin)/admin/experiments/page.tsx`、`promote/page.tsx`
  - 依赖：T232
  - 验收：列表、编辑、升级、降级可操作
  - 估时：2.0h

#### Learning Path

- [ ] `T241` 实现 `GET /api/learn`
  - 文件：`src/app/api/learn/route.ts`
  - 依赖：T011
  - 验收：返回已发布路径 + 已登录用户进度
  - 估时：1.0h

- [ ] `T242` 实现 `GET /api/learn/[slug]`
  - 文件：`src/app/api/learn/[slug]/route.ts`
  - 依赖：T011
  - 验收：返回路径详情+节点列表+当前进度
  - 估时：1.0h

- [ ] `T243` 实现 `GET /api/learn/[slug]/[node]`
  - 文件：`src/app/api/learn/[slug]/[node]/route.ts`
  - 依赖：T011
  - 验收：包含付费墙校验（第4节起）
  - 估时：1.2h

- [ ] `T244` 实现 `POST /api/learn/[slug]/[node]/complete`
  - 文件：`src/app/api/learn/[slug]/[node]/complete/route.ts`
  - 依赖：T011
  - 验收：答错也推进进度；返回解释和正确性
  - 估时：1.0h

- [ ] `T245` 实现 Admin 路径 CRUD API
  - 文件：`src/app/api/admin/learning-paths/*`
  - 依赖：T011
  - 验收：路径/节点增删改可用，含顺序字段
  - 估时：2.0h

- [ ] `T246` 实现 `/learn` 列表页
  - 文件：`src/app/[locale]/(landing)/learn/page.tsx`、`PathList.tsx`、`PathCard.tsx`
  - 依赖：T241
  - 验收：筛选+进度条展示
  - 估时：1.5h

- [ ] `T247` 实现 `/learn/[slug]` 详情页
  - 文件：`src/app/[locale]/(landing)/learn/[slug]/page.tsx`、`PathDetail.tsx`
  - 依赖：T242
  - 验收：时间线节点状态正确
  - 估时：1.3h

- [ ] `T248` 实现 `/learn/[slug]/[node]` 节点页
  - 文件：`src/app/[locale]/(landing)/learn/[slug]/[node]/page.tsx`、`NodePage.tsx`、`NodeQuiz.tsx`
  - 依赖：T243-T244
  - 验收：答题后可前进，解释展示正常
  - 估时：2.0h

- [ ] `T249` 接入 `PaywallGate`
  - 文件：`src/shared/blocks/learn/PaywallGate.tsx`
  - 依赖：T243
  - 验收：未登录/免费/付费三态正确
  - 估时：0.8h

- [ ] `T250` 新增 Admin 路径管理页面
  - 文件：`src/app/[locale]/(admin)/admin/learning-paths/*`
  - 依赖：T245
  - 验收：路径与节点管理流程可闭环
  - 估时：2.0h

#### AI Tutor

- [ ] `T261` 实现 `POST /api/tutor/chat`
  - 文件：`src/app/api/tutor/chat/route.ts`
  - 依赖：T012
  - 验收：流式返回，不落库，权限校验通过
  - 估时：1.2h

- [ ] `T262` Tutor 上下文构建器
  - 文件：`src/shared/lib/tutor/context.ts`（新增）
  - 依赖：T010、T011
  - 验收：可按页面类型拼接 systemPrompt
  - 估时：1.0h

- [ ] `T263` Tutor 前端组件实现
  - 文件：`src/shared/blocks/tutor/*`
  - 依赖：T261
  - 验收：抽屉、消息、输入、快捷提问完整
  - 估时：1.8h

- [ ] `T264` 在三个入口页接入 TutorTrigger
  - 文件：`gallery/[id]`、`learn/[slug]/[node]`、`experiments/[slug]/ExperimentClient.tsx`
  - 依赖：T263
  - 验收：三入口都能打开导师并正确注入上下文
  - 估时：1.2h

- [ ] `T265` Tutor 计费点对齐“打开会话扣1次”
  - 文件：`src/shared/lib/tutor/quota.ts`、`TutorDrawer.tsx`
  - 依赖：T261
  - 验收：首开扣费，后续同会话消息不重复扣
  - 估时：0.8h

- [ ] `T266` Tutor 边界处理
  - 文件：`TutorDrawer.tsx`、`route.ts`
  - 依赖：T265
  - 验收：配额不足、模型错误、网络中断提示完整
  - 估时：0.8h

#### User Dashboard

- [ ] `T271` 实现 `GET /api/dashboard`
  - 文件：`src/app/api/dashboard/route.ts`
  - 依赖：T010、T009
  - 验收：返回 `stats/recentWorks/recentActivity/actionHints`
  - 估时：1.3h

- [ ] `T272` Dashboard 聚合服务层
  - 文件：`src/shared/models/dashboard.ts`（新增）
  - 依赖：T010
  - 验收：将多查询封装为单入口函数，便于测试
  - 估时：1.0h

- [ ] `T273` 实现 `/dashboard` 页面
  - 文件：`src/app/[locale]/(landing)/dashboard/page.tsx`、`src/shared/blocks/dashboard/*`（新增页面块）
  - 依赖：T271
  - 验收：四卡片 + 最近作品 + 最近活动可用
  - 估时：1.8h

- [ ] `T274` 登录默认跳转改造
  - 文件：`sign-in` 回调处理、导航组件（Header）
  - 依赖：T273
  - 验收：登录后默认进入 `/dashboard`
  - 估时：0.8h

- [ ] `T275` Dashboard 动效与空状态
  - 文件：`StatsCards.tsx`、`RecentActivity.tsx`
  - 依赖：T273
  - 验收：countUp、空状态文案、响应式布局符合设计
  - 估时：0.8h

- [ ] `T276` Dashboard 权限与 SEO
  - 文件：`dashboard/page.tsx`、`src/app/robots.ts`
  - 依赖：T273
  - 验收：未登录重定向；`/dashboard` 保持 noindex
  - 估时：0.5h

### 2.4 Integration（T301-T313）

- [ ] `T301` i18n 文案接入（en/zh）
  - 文件：`src/config/locale/messages/{en,zh}/*.json`
  - 依赖：Core 全部
  - 验收：新增页面和按钮无硬编码文案
  - 估时：1.2h

- [ ] `T302` SEO 元信息完善
  - 文件：Gallery/Tag/Learn 页面 `generateMetadata`
  - 依赖：T207-T209、T246-T248
  - 验收：title/description/canonical 一致
  - 估时：1.0h

- [ ] `T303` sitemap 动态扩展
  - 文件：`src/app/sitemap.ts`（若存在）或新增 sitemap route
  - 依赖：T302
  - 验收：包含公开 gallery 与 tag 与 learn 页面
  - 估时：0.8h

- [ ] `T304` JSON-LD 接入
  - 文件：`gallery/[id]/page.tsx`、`learn/[slug]/page.tsx`
  - 依赖：T302
  - 验收：结构化数据通过单测/快照
  - 估时：0.8h

- [ ] `T305` 埋点事件定义与发送
  - 文件：`src/shared/lib/analytics/*`、各页面动作点
  - 依赖：Core 全部
  - 事件：publish/like/fork/embed_copy/tutor_open/tutor_message/learn_complete
  - 验收：关键事件可在调试日志看到
  - 估时：1.2h

- [ ] `T306` 安全头与嵌入策略
  - 文件：`next.config.*` 或 middleware/proxy headers 配置
  - 依赖：T221
  - 验收：仅 `/embed/*` 放开 frame，其他页面保持 SAMEORIGIN
  - 估时：1.0h

- [ ] `T307` API 参数校验统一（zod）
  - 文件：各新 route
  - 依赖：Core 全部
  - 验收：非法参数返回 4xx，错误信息可读
  - 估时：1.0h

- [ ] `T308` Admin 权限统一检查
  - 文件：`/api/admin/*` 与 admin 页面 server action
  - 依赖：T232、T245
  - 验收：非 admin 全部拒绝访问
  - 估时：0.8h

- [ ] `T309` 共享组件整理与复用收敛
  - 文件：`src/shared/blocks/gallery/*`、`embed/*`、`learn/*`、`dashboard/*`
  - 依赖：Core 全部
  - 验收：重复 UI 逻辑抽取，减少复制代码
  - 估时：1.0h

- [ ] `T310` 接口文档补充
  - 文件：`docs/plans/*.md`（更新状态）+ `docs/api/*.md`（新增）
  - 依赖：T307
  - 验收：新 API 入参与返回字段可查
  - 估时：0.8h

- [ ] `T311` 数据回填脚本（可选但建议）
  - 文件：`scripts/backfill-upg-gallery-fields.ts`（新增）
  - 依赖：T003
  - 验收：老数据补默认 `tags/likeCount/forkCount`
  - 估时：0.8h

- [ ] `T312` [P] 性能基线检查
  - 文件：无（命令执行）
  - 依赖：T207、T246、T273
  - 命令：`pnpm build`
  - 验收：首页、gallery、learn、dashboard 编译通过，无致命警告
  - 估时：0.5h

- [ ] `T313` [P] 无障碍与移动端检查
  - 文件：相关页面样式
  - 依赖：Core 全部
  - 验收：主流程在移动端可操作，关键按钮有 aria 标签
  - 估时：1.0h

### 2.5 Polish（T401-T410）

- [ ] `T401` 全量 lint 修复
  - 命令：`pnpm lint`
  - 依赖：Integration 全部
  - 验收：lint 通过
  - 估时：0.8h

- [ ] `T402` 全量单测与覆盖检查
  - 命令：`pnpm test -- --runInBand`（或 `pnpm test`）
  - 依赖：Integration 全部
  - 验收：新增测试全部通过
  - 估时：0.6h

- [ ] `T403` 全量 E2E 回归
  - 命令：`pnpm test:e2e`
  - 依赖：T109-T113
  - 验收：关键流程无回归
  - 估时：0.8h

- [ ] `T404` 文档状态回填
  - 文件：6份设计文档状态改为“已实现/部分实现”
  - 依赖：T401-T403
  - 验收：文档状态与真实实现一致
  - 估时：0.5h

- [ ] `T405` 更新 `CHANGELOG`
  - 文件：`CHANGELOG.md`
  - 依赖：T404
  - 验收：记录模块、迁移、风险、回滚点
  - 估时：0.5h

- [ ] `T406` 产出上线前检查清单
  - 文件：`docs/release-checklist-neonphysics-v2.md`（新增）
  - 依赖：T405
  - 验收：包含 DB 迁移、SEO、监控、回滚步骤
  - 估时：0.6h

- [ ] `T407` 回滚脚本/说明
  - 文件：`docs/rollback-neonphysics-v2.md`（新增）
  - 依赖：T406
  - 验收：明确回滚 SQL 和功能降级顺序
  - 估时：0.6h

- [ ] `T408` 预发布 smoke 验证
  - 环境：staging
  - 依赖：T407
  - 验收：Gallery→Embed→Learn→Tutor→Dashboard 全链路跑通
  - 估时：0.8h

- [ ] `T409` 生产发布窗口执行
  - 依赖：T408
  - 验收：迁移成功、核心 API 正常、错误率无异常尖峰
  - 估时：0.6h

- [ ] `T410` 发布后 24 小时观察
  - 依赖：T409
  - 验收：关键指标稳定（错误率、接口耗时、转化漏斗）
  - 估时：0.5h

## 3. 并行策略

- 可并行批次 A：`T101-T107`（单测）+ `T014`（路由骨架）
- 可并行批次 B：Gallery（T201-T210）与 Learning Path API（T241-T245）
- 可并行批次 C：Embed（T221-T224）与 Tutor（T261-T266）
- 可并行批次 D：Dashboard（T271-T276）与 Integration 的文档/埋点任务（T305、T310）

## 4. 关键风险与化解

- 风险 1：`upg_daily_quota` 改造影响现有 UPG 生成限额
  - 化解：先上 `scene` 默认值与兼容逻辑，再切换读取条件
- 风险 2：Gallery/Embed 放开 iframe 导致安全面扩大
  - 化解：仅对 `/embed/*` 放开，其他路由保持 `SAMEORIGIN`
- 风险 3：Learning Path 付费墙与现有支付状态判断不一致
  - 化解：复用现有订阅查询函数，新增单测覆盖三态
- 风险 4：Dashboard 活动聚合查询变重
  - 化解：限制 `LIMIT 5`，必要时加组合索引

## 5. 推荐开发顺序（可直接执行）

1. 完成 `T001-T014`（基础与迁移）
2. 完成 `T101-T114`（先让测试失败再转绿）
3. 完成 `T201-T224`（Gallery + Embed）
4. 完成 `T231-T250`（Experiment + Learning Path）
5. 完成 `T261-T276`（Tutor + Dashboard）
6. 完成 `T301-T410`（集成、收尾、发布）

## 6. 启动命令清单

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

