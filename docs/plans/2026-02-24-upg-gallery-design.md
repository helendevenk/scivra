---
name: upg-gallery-design
status: complete
created: 2026-02-24T00:00:00Z
updated: 2026-03-26T03:18:04Z
---

# UPG Gallery 设计文档

> 日期：2026-02-24
> 状态：待实现
> 预估开发量：4-5 天

## 1. 定位与核心价值

Gallery 同时承担三个战略角色：

- **SEO 引擎**：每个公开可视化是一个长尾关键词落地页，用户搜"多普勒效应可视化"时直接命中。内容由用户生成，零运营成本。
- **社会证明**：新用户看到大量优质可视化，立刻建立信任感。
- **转化漏斗入口**：访客浏览 → 想自己生成 → 注册 → 消耗积分 → 付费。

## 2. 数据模型变更

### upg_generation 新增字段

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| is_public | BOOLEAN | false | 用户主动选择公开 |
| like_count | INTEGER | 0 | 点赞计数（冗余，避免 JOIN） |
| view_count | INTEGER | 0 | 浏览计数 |
| fork_count | INTEGER | 0 | 被 Fork 次数 |
| featured | BOOLEAN | false | 管理员精选 |
| tags | TEXT[] | [] | 标签数组，如 ["physics","optics","wave"] |
| forked_from | UUID | null | Fork 来源的 generation ID |

### 新增表：upg_like

| 字段 | 类型 | 说明 |
|---|---|---|
| id | UUID | 主键 |
| user_id | TEXT | 外键 → user |
| generation_id | UUID | 外键 → upg_generation |
| created_at | TIMESTAMP | 创建时间 |

唯一约束：`UNIQUE(user_id, generation_id)`

**设计决策**：
- 点赞即收藏，"我点赞的"就是收藏列表，不单独做收藏表（YAGNI）
- 不做评论系统，开发量大且需审核机制，上线后迭代

**标签策略**：AI 生成时自动从 prompt 提取 3-5 个标签，用户可编辑。

## 3. 路由设计

```
/gallery              Gallery 主页（公开，无需登录）
/gallery/[id]         单个可视化详情页（SEO 落地页）
/gallery/tag/[tag]    标签聚合页（SEO 长尾页）
```

`/gallery` 而非 `/upg/gallery`，路由越短 SEO 权重越高，也方便未来承载非 UPG 内容。

## 4. API 设计

| 方法 | 端点 | 权限 | 说明 |
|---|---|---|---|
| GET | /api/gallery | 公开 | Gallery 列表，支持 sort/tag/q/cursor/author 参数 |
| GET | /api/gallery/[id] | 公开 | Gallery 详情，顺带 view_count+1 |
| POST | /api/gallery/[id]/like | 需登录 | 点赞/取消点赞（toggle） |
| POST | /api/gallery/[id]/fork | 需登录 | Fork 生成，消耗 5 credits |
| GET | /api/gallery/tags | 公开 | 热门标签列表 |
| PATCH | /api/upg/[id]/publish | 需登录（作者） | 发布/取消发布到 Gallery |

### 列表接口详情

- 查询参数：`sort=latest|popular|featured`、`tag=xxx`、`q=搜索词`、`cursor=xxx`、`author=userId`（按作者筛选）
- 游标分页，每次 20 条，适配无限滚动
- 只返回 `is_public=true` 的记录
- 返回字段：id、title（prompt 截取前 60 字符）、author_name、author_avatar、like_count、view_count、tags、created_at

### Fork 逻辑

- 读取原始 generation 的 prompt，调用现有 UPG 生成流程
- 新记录 `forked_from` 指向原始 ID
- 消耗 5 credits（与重新生成相同）
- 原始记录 `fork_count + 1`

### 发布逻辑

- 只有作者本人可操作
- 发布时自动提取标签（正则从 prompt 提取关键词）
- 发布后内容不可编辑（防违规）

## 5. 前端组件架构

```
src/shared/blocks/gallery/
├── GalleryGrid.tsx        瀑布流卡片网格（主组件）
├── GalleryCard.tsx        单张卡片（缩略图+信息）
├── GalleryDetail.tsx      详情页侧边栏（点赞/Fork/标签/推荐）
├── GallerySearch.tsx      搜索栏 + 标签云
├── GalleryFilter.tsx      排序 + 学科筛选
└── PublishToggle.tsx      发布到 Gallery 的开关（嵌入现有 UPG 页面）
```

### GalleryCard

- 卡片比例 4:3，hover 上浮 + 阴影加深
- 缩略图：第一版用 CSS 渐变 + 标题文字占位（避免截图复杂度）
- 底部：左侧作者头像+名字，右侧点赞图标+数字
- `featured=true` 左上角显示精选徽章

### 无限滚动

- `IntersectionObserver` 监听底部哨兵元素
- 每次 20 条，游标分页
- 加载中显示 skeleton 卡片
- 全部加载完显示"到底了"

### PublishToggle

- 嵌入 `/upg/view/[id]` 操作栏
- 点击弹出确认框：可编辑标签、预览公开效果
- 发布成功后变为"已公开"状态，可取消

### 状态管理

- `useSWRInfinite` 做无限滚动 + 缓存
- 点赞乐观更新（先改 UI 再发请求，失败回滚）
- 不引入新的全局状态库

## 6. SEO 策略

### 详情页 `/gallery/[id]`

- title: `{prompt前50字} - Interactive 3D Visualization | NeonPhysics`
- description: 从 prompt + 标签自动拼接
- canonical: `/gallery/{id}`（避免和 `/upg/view/{id}` 重复收录）
- JSON-LD: `CreativeWork` 类型，含 author、dateCreated、interactionCount

### 标签页 `/gallery/tag/[tag]`

- title: `{Tag} Visualizations - Interactive 3D Physics Simulations | NeonPhysics`
- 标签 slug 用英文 kebab-case，中文标签自动翻译为英文 slug
- 长尾关键词主力页面

### `/upg/view/[id]` vs `/gallery/[id]`

- `/upg/view/[id]`：私有查看页，加 `noindex`
- `/gallery/[id]`：公开 SEO 页面，仅 `is_public=true` 可访问
- 共享 iframe 渲染逻辑，布局不同

### Sitemap

- 动态生成，包含所有公开 Gallery 页面 + 标签页
- Gallery 主页 daily，详情页 monthly

### Open Graph

- 第一版：Next.js `ImageResponse` API 动态生成 OG 图片（标题 + 学科图标）
- 后续：Puppeteer 截取可视化真实截图

## 7. 转化漏斗与增长飞轮

### 访客转化路径

```
Google 搜索 → /gallery/tag/[tag] → /gallery/[id] → 体验互动
  → "Create Your Own" CTA → 注册 → 免费额度 → 生成 → 付费
```

### 用户生成内容飞轮

```
用户生成 → 发布 Gallery → 搜索引擎收录 → 新访客 → 注册 → 生成 → 发布...
```

### 激励发布机制

- 生成完成后发布按钮醒目，文案："分享给全世界"
- 发布后展示实时数据（浏览数、点赞数）
- 被 Fork 时通知作者
- 后续：热门作者排行榜、"本周精选"邮件推送

### 管理员运营

- 精选管理：admin 后台标记 `featured`
- 违规处理：复用现有 `upg_report` 举报机制，admin 可强制下架
- 标签管理：后续可加标签合并/别名
