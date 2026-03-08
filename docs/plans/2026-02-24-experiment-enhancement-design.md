# 实验增强设计文档（Gallery 反哺方案）

> 日期：2026-02-24
> 状态：待实现
> 预估开发量：2-3 天
> 依赖：UPG Gallery 模块

## 1. 现状与问题

- 现有 4 个手工开发的 Three.js 实验（牛顿定律、抛体运动、电磁波谱、过山车）
- 数量太少，撑不起"物理教育平台"定位
- 每个新实验手工开发需 3-5 天，独立开发者扩展不动
- UPG 生成内容和实验模块完全割裂

## 2. 核心思路

让 UPG Gallery 的精选内容反哺实验库。管理员从 Gallery 中挑选高质量可视化，标记为"官方实验"，出现在 `/experiments` 页面。零新实验开发成本。

## 3. 数据模型变更

在 Gallery 基础上继续扩展 `upg_generation`：

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| is_experiment | BOOLEAN | false | 是否为官方实验 |
| experiment_category | TEXT | null | 学科：mechanics / optics / thermodynamics / electromagnetism / modern_physics |
| experiment_level | TEXT | null | 难度：beginner / intermediate / advanced |
| experiment_order | INTEGER | 0 | 排序权重 |

不新建实验表。实验本质是高质量 UPG 生成内容 + 元数据，一张表用字段区分，避免冗余和同步问题。

## 4. 现有手工实验处理

- 保留原样，独立 Three.js 页面不变
- 在 `/experiments` 页面标记为 "Premium Experiment"
- 两类实验共存：手工精品（质量深度）+ AI 精选（数量广度）

## 5. `/experiments` 页面改造

```
├── 顶部"精品实验"区    现有 4 个手工实验，Premium 标记
└── 下方"AI 实验库"区   从 Gallery 升级的实验
    ├── 筛选栏          学科分类 + 难度等级
    └── 卡片网格        点击跳转 /gallery/[id]（复用 Gallery 详情页）
```

不需要新的实验详情页，AI 实验直接复用 Gallery 详情页。

## 6. 升级流程

```
Gallery 精选内容 → Admin 后台点击"升级为实验"
  → 填写元数据（学科、难度、排序权重）
  → 内容出现在 /experiments
```

## 7. Admin 后台

### 新增页面

```
/admin/experiments          实验管理列表
/admin/experiments/promote  从 Gallery 升级实验
```

### 实验管理列表

- 展示所有 `is_experiment = true` 的记录
- 列：缩略图、标题、学科、难度、排序权重、浏览数、操作
- 操作：编辑元数据、调整排序、降级（取消实验标记）

### 升级操作

- 从 Gallery 列表选择（`featured=true` 优先展示）
- 填写表单：学科分类、难度等级、排序权重、知识点标签（写入 `upg_generation.tags`，复用现有字段）
- 确认后立即生效

## 8. API 设计

| 方法 | 端点 | 权限 | 说明 |
|---|---|---|---|
| PATCH | /api/admin/experiments/[id]/promote | admin | 升级为实验 |
| PATCH | /api/admin/experiments/[id]/demote | admin | 取消实验标记 |
| PATCH | /api/admin/experiments/[id] | admin | 编辑实验元数据 |
| GET | /api/experiments | 公开 | 公开实验列表（改造现有） |

## 9. 运营策略

- **冷启动**：自己用 UPG 生成 20-30 个高质量可视化，发布 Gallery 后升级为实验
- **稳定期**：每周从用户 Gallery 精选 3-5 个升级，保持内容新鲜
- **成本**：每次操作 2 分钟，纯后台点击
