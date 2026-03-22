# SeePhysics 前端产品优化方案书

> **文档版本**: v1.0
> **创建日期**: 2026-03-17
> **分析基础**: 全量代码审查 + PM 产品分析（非文档推测）
> **适用项目**: NeonPhysics v2 (SeePhysics)
> **产品定位**: 面向北美 K-12 的 AI 物理教育 SaaS 平台

## 执行摘要

### 一句话结论

**技术底座扎实，但"让用户看到价值"这个环节做得很差。**

核心产品入口被导航埋没、匿名用户被前端阻断、生成结果的社交传播能力约等于零。修复这三个问题的总工期约 6 天，但对增长的影响是量级性的。

### 当前状态

| 维度 | 状态 | 说明 |
|------|------|------|
| 技术架构 | ✅ 扎实 | Redis 限流、积分事务 ACID、iframe 安全沙箱、RBAC 权限 |
| AI 生成能力 | ✅ 差异化壁垒 | Claude Sonnet 4.6 + 质量检查 + HTML 消毒，PhET 做不到 |
| 用户获取 | 🔴 严重不足 | 匿名用户被阻断、Gallery 无 SEO、无社交分享 |
| 变现路径 | 🟡 需优化 | 积分+订阅双重限制增加认知成本 |
| 数据驱动 | 🔴 盲飞 | Analytics 只有 7 个事件，无法回答关键产品问题 |
| 目标用户覆盖 | 🟡 偏科 | 学生 7/10，教师 5/10，自学者 6/10 |

### 优化目标

1. **打通"价值感知→注册→付费"的转化漏斗**
2. **构建 UGC 驱动的自然增长飞轮**
3. **补全数据基础设施，让产品迭代有据可依**

### 总工期估算

**6 个优化 Phase，总计 14-18 天**（1 个全职开发者）

| Phase | 主题 | 工期 | 预期影响 |
|-------|------|------|----------|
| Phase 1 | 匿名体验 + 转化漏斗 | 2 天 | 注册率 +200% |
| Phase 2 | Gallery SSR + SEO 增长引擎 | 3 天 | 6 月内自然流量 +500% |
| Phase 3 | 导航重构 + 信息架构 | 2 天 | 核心功能曝光率 +300% |
| Phase 4 | UPG 体验精修 | 3 天 | 生成满意度 +40%，移动端可用 |
| Phase 5 | 数据埋点 + 反馈闭环 | 2 天 | 产品迭代速度 x3 |
| Phase 6 | 代码级 Bug 清理 | 2 天 | 消除体验断裂点 |

## Phase 1：匿名体验 + 转化漏斗（2 天）

### 1.1 放开匿名用户 UPG 生成

**问题**

后端已支持匿名 1次/天 IP 限流（Redis 滑动窗口），但前端 `UpgGenerator.tsx` 第 143 行直接弹登录弹窗：

```typescript
// 当前代码（阻断）
if (!user) {
  setIsShowSignModal(true);
  return;
}
```

用户还没感受到 UPG 的价值就被要求注册 — Canva、Midjourney 都验证过，"先用再注册"模式的转化率是"先注册再用"的 2-3 倍。

**方案**

```
匿名用户点击生成
  ├─ 前端不弹登录弹窗，直接发请求
  ├─ 后端正常处理（IP 限流 1次/天）
  ├─ 生成成功 → 结果正常展示
  │   └─ 结果区域叠加半透明注册引导层：
  │       "✨ 注册即可保存这个可视化 + 解锁每日 3 次生成"
  │       [免费注册] [稍后再说]
  ├─ 生成超限 → 弹窗提示："每日免费体验已用完，注册解锁更多"
  └─ 注册后 → 自动将本次匿名生成绑定到新账号
```

**改动范围**

| 文件 | 改动 |
|------|------|
| `src/shared/blocks/upg/UpgGenerator.tsx` | 移除匿名用户登录弹窗，增加结果区注册引导 |
| `src/app/api/upg/generate/route.ts` | 确认匿名逻辑无前端绕过问题 |
| 新增组件 `UpgRegistrationPrompt.tsx` | 半透明叠加层 + CTA 按钮 |

**验收标准**

- [ ] 未登录用户可以成功生成 1 次 UPG
- [ ] 生成结果正常展示，叠加注册引导
- [ ] 第 2 次生成时提示注册
- [ ] 注册后当次生成自动归属新用户

### 1.2 注册后引导到 UPG（而非首页）

**问题**

当前注册 callbackUrl 默认为 `/`（首页），用户注册后回到营销页，与"刚才在用 UPG"的上下文完全断裂。

**方案**

- 从 UPG 页面触发的注册，callbackUrl 设为 `/upg`
- 注册后回到生成器，看到自己的（匿名时生成的）结果

**改动范围**

| 文件 | 改动 |
|------|------|
| `UpgRegistrationPrompt.tsx` | 注册链接携带 `?callbackUrl=/upg` |

## Phase 2：Gallery SSR + SEO 增长引擎（3 天）

### 2.1 Gallery 详情页改 SSR

**问题**

当前 `/gallery/[id]/page.tsx` 只做了 locale 设置，所有数据加载在 `GalleryDetailClient` 客户端组件里。搜索引擎看到的是一个空页面。

每个被发布的 UPG 生成（"How does a nuclear reactor work"、"Doppler Effect simulation"）都应该是一个可被 Google 索引的长尾内容页，但目前这个增长通道完全堵死。

**方案**

```
/gallery/[id]/page.tsx（改为 SSR）
  ├─ 服务端获取 generation 数据（prompt, tags, likeCount, forkCount, createdAt, author）
  ├─ 服务端获取 HTML 内容（用于 iframe srcDoc，或从 R2 拉取）
  ├─ generateMetadata() 生成动态 SEO 元数据：
  │   ├─ title: `${prompt} - Interactive Physics Visualization | SeePhysics`
  │   ├─ description: 基于 prompt 生成的描述
  │   ├─ openGraph: 截图预览图（需要生成）
  │   └─ keywords: 从 tags 提取
  ├─ JSON-LD 结构化数据（CreativeWork schema）
  └─ 客户端 hydration：点赞/Fork/分享交互
```

**改动范围**

| 文件 | 改动 |
|------|------|
| `src/app/[locale]/(landing)/gallery/[id]/page.tsx` | 重写为 SSR，服务端取数据 + metadata |
| `src/shared/blocks/gallery/gallery-detail.tsx` | 拆分为服务端数据层 + 客户端交互层 |
| `src/shared/models/upg_generation.ts` | 确保有按 ID 获取公开生成的查询函数 |

### 2.2 添加 Open Graph 预览图

**问题**

分享 Gallery 链接到 Twitter/Discord 时，没有预览图。链接看起来就是一段纯文本 URL，点击率极低。

**方案**

- 生成时用 Puppeteer/Playwright 对 iframe 截图，保存到 R2
- 或使用 `@vercel/og` 动态生成带标题+品牌的 OG 图片
- Gallery 详情页的 `openGraph.images` 指向这个截图

**改动范围**

| 文件 | 改动 |
|------|------|
| 新增 `src/app/api/og/gallery/[id]/route.tsx` | OG 图片生成 API（@vercel/og） |
| `gallery/[id]/page.tsx` 的 metadata | 添加 openGraph.images |

### 2.3 添加社交分享按钮

**问题**

View 页面的分享功能只有 copy link。北美高中生用 Instagram / TikTok / Discord / Twitter。

**方案**

在 Gallery 详情页和 UPG View 页面底部添加分享栏：

```
[🔗 Copy Link] [𝕏 Twitter] [💬 Discord] [📱 更多...]
```

**改动范围**

| 文件 | 改动 |
|------|------|
| 新增 `src/shared/blocks/common/share-buttons.tsx` | 社交分享按钮组件 |
| `gallery/gallery-detail.tsx` | 集成分享按钮 |
| `upg/view/[id]` 的客户端组件 | 集成分享按钮 |

### 2.4 Gallery 底部增加 CTA 闭环

**方案**

每个 Gallery 详情页底部添加：

```
┌─────────────────────────────────────┐
│  💡 想创建自己的物理可视化？          │
│  [免费试试 UPG →]   [浏览更多作品]   │
└─────────────────────────────────────┘
```

**目的**：Gallery（SEO 流量入口）→ UPG（核心产品）→ 注册（转化），形成闭环。

## Phase 3：导航重构 + 信息架构（2 天）

### 3.1 导航栏重排

**问题**

UPG（产品核心卖点）被命名为 "Visualizer" 排在第 5 位。导航栏从左到右注意力衰减约 30-40%（NNGroup 眼动研究），第 5 位的点击率只有前 2 位的 1/3。

**方案**

当前导航：
```
Experiments | Learn | Features | Pricing | Visualizer | Gallery | Content
```

优化为：
```
UPG Visualizer ⚡ | Experiments | Learn | Gallery | Pricing | More ▾
                                                              └─ Blog
                                                              └─ Docs
                                                              └─ Showcases
                                                              └─ Updates
```

核心改动：
- UPG 提到第 1 位，加视觉权重（⚡ 图标或渐变色）
- Features 锚点降到 Landing 内部，不占顶级导航
- Blog/Docs/Showcases/Updates 收进 "More" 下拉

**改动范围**

| 文件 | 改动 |
|------|------|
| `src/config/locale/messages/en/landing/header.json` | 重排导航项 |
| `src/config/locale/messages/zh/landing/header.json` | 同步中文 |

### 3.2 用户下拉菜单优化

**问题**

登录用户点头像，只看到 Billing 和 Activity 两个入口。没有 Dashboard、没有 My Generations 快捷入口。

**方案**

优化 user_nav 为：

```
👤 User Name
├─ Dashboard
├─ My Generations（显示今日剩余次数）
├─ Credits: 150 ⚡
├─ ─────────────
├─ Settings
├─ Activity
├─ ─────────────
└─ Sign Out
```

**改动范围**

| 文件 | 改动 |
|------|------|
| `src/config/locale/messages/en/landing/header.json` | 更新 user_nav 结构 |
| `src/config/locale/messages/zh/landing/header.json` | 同步中文 |
| 头部导航组件 | 支持显示积分余额 |

### 3.3 Settings 侧边栏修复

**问题**

- Security 页面存在但不在侧边栏导航中，用户无法正常导航到它
- Activity 侧边栏不包含 Feedbacks，但路由存在（空 div）

**方案**

- 方案 A（推荐）：Security 加入 Settings 侧边栏
- Feedbacks 路由暂时移除（功能未实现，不应暴露空页面）

**改动范围**

| 文件 | 改动 |
|------|------|
| `src/config/locale/messages/en/settings/sidebar.json` | 添加 Security 导航项 |
| `src/config/locale/messages/zh/settings/sidebar.json` | 同步 |
| `activity/feedbacks/page.tsx` | 删除或替换为 Coming Soon 页 |

## Phase 4：UPG 体验精修（3 天）

### 4.1 结果操作栏常驻显示

**问题**

生成结果的操作栏（全屏/下载/举报/重新生成）用 `opacity-0 group-hover:opacity-100` 实现。移动端没有 hover，用户完全看不到这些按钮。即使桌面端，hover 触发也违反"可发现性"原则。

**方案**

操作栏从 hover 触发改为常驻显示在结果区域下方：

```
┌──────────────────────────────┐
│                              │
│       3D 可视化 iframe        │
│                              │
├──────────────────────────────┤
│ [⛶ 全屏] [⬇ 下载] [🔄 重新生成 5⚡] [⚑ 举报] │
└──────────────────────────────┘
```

**改动范围**

| 文件 | 改动 |
|------|------|
| `src/shared/blocks/upg/UpgGenerator.tsx` | 操作栏移出 hover 容器，改为常驻 |

### 4.2 重新生成按钮位置调整

**问题**

重新生成在结果区域的 hover 浮动栏里。但用户的自然操作流是：看结果 → 不满意 → 修改 prompt → 重新生成。按钮应该在输入区域附近。

**方案**

- 首次生成后，主按钮变为"重新生成 (5⚡)"
- 旁边新增"新话题"按钮（清空 prompt 开始新生成）
- 结果区域的操作栏保留全屏/下载/举报

### 4.3 生成失败恢复引导

**问题**

生成失败时 `setProgress(0)` 进度归零，只在 toast 显示错误。用户的 prompt 还在，但没有视觉引导"再试一次"。

**方案**

失败后的 UI 状态：

```
┌──────────────────────────────┐
│ ⚠ 生成未成功                  │
│ 原因：服务繁忙，请稍后重试      │
│                              │
│ [🔄 重试 (免费)] [✏️ 修改提示词] │
└──────────────────────────────┘
```

- 失败不扣积分（已有），在 UI 上明确告知用户"重试免费"
- 区分错误类型：服务繁忙 / prompt 过于模糊 / 质量检查未通过
- 质量未通过时建议用户换个更具体的描述

**改动范围**

| 文件 | 改动 |
|------|------|
| `src/shared/blocks/upg/UpgGenerator.tsx` | 失败状态 UI + 错误分类 + 重试引导 |
| `src/app/api/upg/generate/route.ts` | 错误响应增加 `errorType` 字段 |

### 4.4 结果质量反馈组件

**问题**

用户生成后只能举报（report），缺少正向反馈和具体的负向反馈。无法收集数据来优化 AI prompt。

**方案**

在结果下方添加简洁反馈：

```
这个可视化怎么样？ [👍] [👎]

（点击 👎 后展开）
├─ □ 3D 渲染有错误
├─ □ 物理原理不准确
├─ □ 加载太慢
├─ □ 交互不够好
└─ [提交]
```

**改动范围**

| 文件 | 改动 |
|------|------|
| 新增 `src/shared/blocks/upg/UpgFeedback.tsx` | 反馈组件 |
| 新增 `src/app/api/upg/feedback/route.ts` | 反馈 API |
| `src/config/db/schema.ts` | 新增 `upgFeedback` 表 |
| `src/shared/blocks/upg/UpgGenerator.tsx` | 集成反馈组件 |

## Phase 5：数据埋点 + 反馈闭环（2 天）

### 5.1 补全关键分析事件

**问题**

当前 Analytics Bridge 只有 7 个事件：

```
experiment_started / experiment_completed / quota_exhausted
upg_generated / sign_up / subscription_upgrade / cookie_consent
```

缺少以下关键数据：

| 缺失事件 | 为什么需要 | 优先级 |
|----------|-----------|--------|
| `upg_result_feedback` (👍/👎 + 分类) | 优化 AI prompt 的唯一数据源 | P0 |
| `upg_regenerate` | 了解首次生成满意度 | P0 |
| `paywall_shown` / `paywall_converted` | 衡量付费墙效果 | P0 |
| `gallery_fork` / `gallery_like` | 衡量社区活跃度 | P1 |
| `experiment_paywall_hit` | 了解哪些实验驱动升级 | P1 |
| `learn_node_completed` | 学习路径完成率 | P1 |
| `share_clicked` (by channel) | 了解传播渠道分布 | P1 |
| `prompt_template_used` (which template) | 了解预设模板效果 | P1 |
| `time_on_visualization` | 衡量生成质量的间接指标 | P2 |

**改动范围**

| 文件 | 改动 |
|------|------|
| Analytics Bridge 配置 | 新增上述事件定义 |
| 各相关组件 | 在关键交互点调用 analytics.track() |

### 5.2 配置 Plausible 自定义目标和漏斗

**方案**

定义 3 条核心漏斗：

**漏斗 1：访客→注册**
```
Landing Page Visit → UPG Page Visit → Generate Click → Registration → First Saved Generation
```

**漏斗 2：免费→付费**
```
Paywall Shown → Pricing Page Visit → Checkout Start → Payment Complete
```

**漏斗 3：用户→社区贡献者**
```
Generate UPG → Publish to Gallery → Receive First Like → Generate Another
```

## Phase 6：代码级 Bug 清理（2 天）

### 6.1 P0 修复清单

| 编号 | 问题 | 文件 | 修复方式 |
|------|------|------|----------|
| F-01 | Security 页 handler 被注释，提交表单不改密码 | `settings/security/page.tsx` L64-66 | 实现密码修改逻辑，调用 Better Auth 的 changePassword API |
| F-02 | Feedbacks 页面是空 div | `activity/feedbacks/page.tsx` | 替换为 Coming Soon 页面，或删除路由 |

### 6.2 P1 修复清单

| 编号 | 问题 | 文件 | 修复方式 |
|------|------|------|----------|
| F-03 | Experiments 卡片用旧主题色 neon-cyan/neon-green | `experiments/page.tsx` | 替换为 edu-academic 主题色 |
| F-04 | Blog getPost() 调用两次 | `blog/[slug]/page.tsx` | 用 React cache() 包裹 getPost，去重 |
| F-05 | Admin chats 权限复用 AITASKS_READ | `admin/chats/page.tsx` | 新增 CHATS_READ 权限码 |
| F-06 | Admin learning-paths 权限复用 POSTS_READ | `admin/learning-paths/page.tsx` | 新增 LEARNING_PATHS_READ 权限码 |
| F-07 | API Key 编辑页冗余 nonce 生成 | `settings/apikeys/[id]/edit/page.tsx` | 删除未使用的 getNonceStr 调用 |

## 变现路径优化建议（非本次 Sprint）

### 建议 A：简化积分心智模型（推荐）

**问题**：积分和订阅是两套并行限制系统。"我是 Pro 用户，每天 20 次，但还需要积分？" 用户困惑。

**建议**：
- Pro/Max 用户每日生成次数包含在订阅中，不额外扣积分
- 积分只用于 Free 用户 + Pro/Max 超额使用
- 简化心智：Free = 3次/天免费 | Pro = 20次/天（含在月费） | Max = 无限

### 建议 B：定价页增加价值可视化

在 Pricing 页面顶部嵌入 3-5 个精选 UPG 案例，让用户先看到"花 $4.99 能得到什么"。

### 建议 C：隐藏 API Keys（V1）

API Keys 对高中生用户群体认知门槛过高，建议从 Settings 侧边栏移除，保留后端能力，等 B2B 教师工具上线再暴露。

## 中长期产品方向建议（非本次 Sprint）

### 教师模式（匹配度从 5/10 提升到 8/10）

K-12 教育市场的真正付费决策者是教师和学区。当前产品是 C2C 模式，天花板低。

**建议路线图**：
- V1.5：创建班级 → 邀请学生 → 分配实验/UPG 任务 → 查看完成情况
- V2.0：学校级订阅（$X/学生/年）+ Google Classroom / Canvas LMS 集成

### 内容推荐引擎

用户生成完一个可视化后，没有"你可能也想试试"的推荐。每次交互结束就是死胡同。

**建议**：生成结果底部增加 "Related Topics"（基于 prompt 关键词匹配 Gallery 热门 + 相关实验 + 学习路径节点）。

### Export as GIF/Video

北美高中生的核心社交平台是 TikTok / Instagram / Discord。如果能把 3D 可视化导出为 GIF 或短视频，分享即获客。

## 实施路线图

```
Week 1
├─ Phase 1：匿名体验 + 转化漏斗（2天）
└─ Phase 6.1：P0 Bug 修复（0.5天）

Week 2
├─ Phase 3：导航重构 + 信息架构（2天）
└─ Phase 6.2：P1 Bug 修复（1天）

Week 3
├─ Phase 2：Gallery SSR + SEO（3天）

Week 4
├─ Phase 4：UPG 体验精修（3天）

Week 5
├─ Phase 5：数据埋点 + 反馈闭环（2天）
└─ 回归测试 + 验收（1天）
```

### 各 Phase 依赖关系

```
Phase 1（匿名体验）──→ Phase 5（埋点）   ← 匿名→注册漏斗需要数据验证
      │
      ↓
Phase 3（导航重构）──→ Phase 2（Gallery SSR）  ← 导航先调好，Gallery 入口才有意义
                            │
                            ↓
                     Phase 4（UPG 精修）  ← Gallery 导流进 UPG，体验必须好

Phase 6（Bug 清理）──→ 随时可做，不阻塞其他 Phase
```

### 验收标准总表

| Phase | 核心验收指标 |
|-------|-------------|
| Phase 1 | 未登录用户可完成 1 次 UPG 生成；注册后生成自动归属 |
| Phase 2 | Gallery 详情页 View Source 有完整 HTML 内容（非空壳）；Twitter 分享有预览图 |
| Phase 3 | UPG 在导航栏第 1 位；用户下拉菜单包含 Dashboard + My Generations + Credits |
| Phase 4 | 移动端可见操作栏；失败后显示重试引导；反馈组件可提交 |
| Phase 5 | Plausible 新增 9+ 自定义事件；3 条漏斗可查看数据 |
| Phase 6 | Security 页密码修改可用；Feedbacks 页不再是空 div |

## 风险评估

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| Gallery SSR 导致首页加载变慢 | 中 | 中 | 使用 ISR（revalidate: 60），不做全量 SSR |
| 匿名用户滥用生成（DDoS） | 低 | 高 | 已有 Redis IP 限流 1次/天，足够防御 |
| OG 图片生成拖慢部署 | 低 | 低 | 使用 @vercel/og（Edge Runtime），不影响构建 |
| 导航改动影响现有用户习惯 | 低 | 低 | 核心页面不删除，只调整位置 |
| 数据埋点增加前端包体积 | 极低 | 极低 | Analytics 事件只是字符串，忽略不计 |
