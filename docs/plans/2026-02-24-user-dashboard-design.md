---
name: user-dashboard-design
status: historical-plan
snapshot_date: '2026-02-24'
created: '2026-02-24T00:00:00Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-02-24. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# 用户 Dashboard 设计文档

> 日期：2026-02-24
> 状态：待实现
> 预估开发量：2 天

## 1. 定位与核心价值

目前用户登录后没有"家"，信息散落在 `/upg/my`、`/settings/credits`、`/activity/ai-tasks` 各处。Dashboard 解决三个问题：

- **留存锚点**：展示"你的资产"（积分、作品数、获赞数），数字在涨用户就有回来的动力。
- **行为引导**：根据用户状态推荐下一步动作，降低决策成本。
- **信息聚合**：一屏看到所有关键信息，不用跳来跳去。

**不做什么**：不做数据分析图表、不做社交 feed 流、不做通知中心。

## 2. 路由

```
/dashboard    登录后默认跳转页，放在 (landing) layout group 下
```

登录回调从 `/sign-in` 默认跳转到 `/dashboard` 而非首页。Header 导航登录后显示 "Dashboard" 入口。

## 3. 页面布局

一屏搞定，不做多 tab：

```
├── 欢迎栏        "Welcome back, {name}" + 当前订阅等级徽章
├── 数据卡片行     4 张统计卡片横排
├── 快捷操作区     2-3 个上下文感知的 CTA 按钮
├── 最近作品       最近 6 个 UPG 生成，横向卡片滚动
└── 最近活动       最近 5 条活动记录
```

### 4 张数据卡片

| 卡片 | 数据 | 点击跳转 |
|---|---|---|
| 积分余额 | 剩余 credits | /settings/credits |
| 作品总数 | 已生成 UPG 数量 | /upg/my |
| 获赞总数 | 所有公开作品 like_count 之和 | /upg/my |
| 本月用量 | 如 "3 / 20" | 无 |

### 快捷操作区（上下文感知）

| 用户状态 | 显示内容 |
|---|---|
| 新用户（0 个作品） | "生成你的第一个可视化" 大按钮 |
| 有作品未发布 | "你有 N 个作品可以发布到 Gallery" |
| 积分不足 | "升级获取更多额度" |
| 正常状态 | "新建可视化" + "浏览 Gallery" 双按钮 |

最多显示 2 个按钮，主 CTA 复用 UPG 渐变发光按钮样式。

### 最近作品

- 横向滚动，`scroll-snap-type` 原生滚动
- 复用 GalleryCard mini 变体（高度 180px）
- 每张卡片显示状态标签：草稿 / 已公开 / 精选
- 末尾 "+" 新建卡片（虚线边框 + 加号图标）

### 最近活动

- 简洁时间线列表，每行：圆形图标 + 一句话 + 相对时间
- MVP 只展示两类事件：心形（被点赞）、分叉（被 Fork）
- generated / published 不纳入活动流（用户自己的操作不需要"通知自己"）
- 无活动时显示空状态 + "开始创作吧"

## 4. API 设计

### GET /api/dashboard（需登录）

一个聚合接口，一次 round trip，服务端并行查询后返回：

```json
{
  "stats": {
    "credits": 150,
    "totalGenerations": 23,
    "totalLikes": 87,
    "monthlyUsage": 3,
    "monthlyQuota": 20
  },
  "recentWorks": [
    { "id": "...", "prompt": "...", "is_public": true, "like_count": 12, "created_at": "..." }
  ],
  "recentActivity": [
    { "type": "liked", "actor_name": "Alice", "generation_title": "电磁波谱", "created_at": "..." },
    { "type": "forked", "actor_name": "Bob", "generation_title": "牛顿第三定律", "created_at": "..." }
  ],  // MVP 仅 liked + forked 两类
  "actionHints": ["has_unpublished", "low_credits"]
}
```

### 服务端查询策略

- `stats.credits`：复用 `getUserCredits()`
- `stats.totalGenerations`：`COUNT(*) FROM upg_generation WHERE user_id = ?`
- `stats.totalLikes`：`SUM(like_count) FROM upg_generation WHERE user_id = ? AND is_public = true`
- `stats.monthlyUsage`：复用 `upg_daily_quota` 表按月聚合
- `recentWorks`：`ORDER BY created_at DESC LIMIT 6`
- `recentActivity`：MVP 仅两类事件
  - **liked**：`SELECT * FROM upg_like JOIN upg_generation ON ... WHERE upg_generation.user_id = ? ORDER BY upg_like.created_at DESC`
  - **forked**：`SELECT * FROM upg_generation WHERE forked_from IN (SELECT id FROM upg_generation WHERE user_id = ?) ORDER BY created_at DESC`
  - 两类合并后按时间排序，`LIMIT 5`
- `actionHints`：根据以上数据服务端计算，不额外查询

### 缓存策略

客户端 `useSWR`，`revalidateOnFocus` 切回 tab 自动刷新。不做服务端缓存。

## 5. 前端组件架构

```
src/shared/blocks/dashboard/
├── DashboardPage.tsx      主容器，调用聚合 API，分发数据
├── StatsCards.tsx          4 张数据卡片行
├── ActionHints.tsx         上下文感知快捷操作区
├── RecentWorks.tsx         最近作品横向滚动
└── RecentActivity.tsx      最近活动时间线
```

### 响应式

- 数据卡片：桌面 4 列，移动 2x2
- 最近作品：横向滚动，所有尺寸通用
- 最近活动：列表布局，天然响应式

### 动效

- 数据卡片数字 countUp 动画（`requestAnimationFrame` 手写，不引入库）
- 积分不足时积分卡片边框变警告色

## 6. 不新增数据库表

全部从现有数据聚合：`upg_generation`、`upg_like`（Gallery 新增）、`upg_daily_quota`、`credit`。
