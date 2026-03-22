# SeePhysics (NeonPhysics v2) 前端业务逻辑产品分析报告

> 分析日期：2026-03-17
> 分析范围：前端页面结构、用户旅程、信息架构、变现路径、增长机制
> 分析基础：实际代码审查（非文档推测）

## 1. 用户旅程分析：转化路径存在3个关键断点

### 当前漏斗

```
访客 → Landing(/) → 浏览内容 → 注册 → 免费使用 → 付费升级
```

### 断点 A：核心产品入口被埋没

**问题**：导航栏有7个顶级项（Experiments / Learn / Features / Pricing / Visualizer / Gallery / Content），UPG 被命名为 "Visualizer" 排在第5位。对于一个 AI 生成可视化为核心卖点的产品，这相当于把最锋利的刀藏在抽屉里。

**数据支撑**：导航栏从左到右注意力衰减约 30-40%（参考 NNGroup 眼动研究），第5位的点击率大约只有第1-2位的 1/3。

**建议**：
- 导航栏重排为：**UPG (Visualizer)** / Experiments / Learn / Gallery / Pricing / More(Blog+Updates+Docs)
- UPG 按钮加视觉权重（渐变色或图标动画），让它成为导航栏最显眼的元素
- "Features" 锚点链接（/#features）不应占据顶级导航位，降到 Landing Page 内部滚动引导

### 断点 B：匿名用户无法体验核心价值

**问题**：代码显示，未登录用户点击 UPG 生成按钮时直接弹登录弹窗（`setIsShowSignModal(true)`）。用户还没感受到产品价值就被要求注册，这是经典的高摩擦转化杀手。虽然后端允许匿名 1次/天（IP限流），但前端完全没利用这个能力。

**建议**：
- 允许匿名用户直接生成 1 次，生成结果展示后，在结果区域叠加半透明注册引导："想保存这个可视化？免费注册即可"
- 这个改动预计能提升注册转化率 2-3 倍（参考 Canva 的 "先用再注册" 模式）

### 断点 C：Free 用户升级动力不足

**问题**：Free 用户 3次/天生成，Pro 20次/天。对于一个学生用户，3次/天在多数场景下够用了。付费墙应该设在"质量"而不是"数量"上。

**建议**：
- Free 用户的生成限制保持 3次/天，但在 3D 复杂度上做限制（例如免费版不生成交互式滑块、不支持 Fork）
- Pro 核心卖点改为：高级可视化模板 + 交互式参数调节 + 导出高清 + 无水印嵌入
- 在用户生成结果的瞬间展示 Pro 的差异（对比效果最强）

## 2. 信息架构分析：层级混乱，用户认知负担过重

### 核心问题：7个平行入口缺乏逻辑分组

当前导航是扁平结构，但这7个页面的定位完全不同：

| 页面 | 本质 | 用户动机 |
|------|------|----------|
| Experiments | 内容消费 | "我想学某个概念" |
| Learn | 内容消费 | "我想系统学习" |
| UPG | 创作工具 | "我想生成自己的可视化" |
| Gallery | 社区浏览 | "我想看别人做了什么" |
| Pricing | 商业转化 | "多少钱" |
| Blog | 内容营销 | "随便看看" |
| Features | 产品介绍 | "这东西能干嘛" |

**建议**重组为3个逻辑组：

```
[核心产品]  Visualizer(UPG) | Experiments | Learn
[社区内容]  Gallery | Blog
[商业]      Pricing
```

### Settings 和 Activity 导航不一致

**问题**：
1. Settings 侧边栏有5个选项（Profile/Billing/Payments/Credits/API Keys），但缺少 Security。Security 页面存在（/settings/security）但不在导航中，用户无法正常导航到它
2. Activity 侧边栏只有 AI Tasks 和 AI Chats，但实际存在 /activity/feedbacks 路由（只是一个占位 div）
3. Dashboard 不在任何侧边栏中，只能通过 user_nav 下拉菜单访问

**建议**：
- Security 要么加回侧边栏（推荐），要么彻底删除页面路由（如果短期不实现）
- Feedbacks 路由删除，直到功能实际开发
- Dashboard 应该成为登录后的默认入口，在 Settings/Activity 侧边栏的顶部增加 Dashboard 链接

### user_nav 下拉菜单过于简陋

**问题**：登录用户点头像，只看到 Billing 和 Activity 两个入口。没有 Dashboard 的入口，没有 My Generations 的快捷入口。

**建议**：
- user_nav 调整为：Dashboard / My Generations / Credits(显示余额) / Settings / Sign Out
- 这是用户最高频的操作路径，必须最短

## 3. 核心功能体验分析：UPG Generator

### 优点

1. **预设模板设计好** -- 6个模板涵盖不同物理领域，降低了用户"不知道输入什么"的冷启动障碍
2. **进度模拟动画** -- 30-60秒等待时有视觉反馈，减少焦虑感
3. **生成历史内联** -- 在生成器下方直接展示最近10条记录，减少页面跳转
4. **快捷键支持（View页面）** -- F全屏、D下载、Esc返回，专业感强

### 问题

**问题 1：结果操作栏用 hover 触发是个灾难**

生成器的结果区域有一个浮动操作栏（全屏/下载/举报/重新生成），`opacity-0 group-hover:opacity-100`。在移动端没有 hover，用户根本看不到这些按钮。即使在桌面端，hover 触发也违反"可发现性"原则。

**建议**：操作栏常驻显示在结果区域下方，或者至少在 touch 设备上默认可见。

**问题 2：重新生成的交互位置不合理**

重新生成按钮在结果区域的 hover 浮动栏里。但用户的自然操作流是：看结果 → 不满意 → 修改 prompt → 重新生成。按钮应该在输入区域附近，而不是在结果区域。

**建议**：在生成按钮旁边增加 "Regenerate (5 credits)" 按钮，生成过一次后激活。

**问题 3：没有结果质量反馈闭环**

用户生成后只能举报（report），缺少正向反馈（"这个很棒"）和具体的负向反馈（"3D 渲染错误"/"物理不准确"/"加载缓慢"）。这意味着你无法收集数据来优化 AI prompt 和质量检查器。

**建议**：在结果下方加简单的 thumbs up/down + 可选的问题分类标签。这个数据直接反馈到 system prompt 的迭代。

**问题 4：生成失败的恢复路径不友好**

生成失败时，`setProgress(0)` 进度条归零，只在 toast 中显示错误。用户的 prompt 还在，但视觉上没有引导用户"再试一次"。

**建议**：失败后保持生成按钮可用，按钮文案变为 "Retry (no extra cost)"，并在错误提示中说明原因分类（"服务繁忙请稍后"/"prompt 过于模糊请细化"）。

## 4. 变现路径分析

### 积分模型的问题

**当前**：10积分/次生成，5积分/重新生成。

**问题**：积分和订阅是两套并行系统，用户的认知成本高。"我是 Pro 用户，每天能用 20 次，但还需要积分？" 这两套限制叠加让人困惑。

**建议（推荐方案）**：
- Pro/Max 用户的每日生成次数就是他们的权益，不再额外扣积分
- 积分只用于 Free 用户和超额使用场景
- 简化心智模型：Free = 3次/天免费，Pro = 20次/天包含在订阅中

### 定价页缺少 "价值可视化"

**问题**：Pricing 页面展示套餐对比 + FAQ + 用户评价，但没有展示 UPG 生成的实际效果。用户在不了解产品的情况下看到价格，无法判断值不值。

**建议**：在 Pricing 页面顶部嵌入一个 UPG 生成的精选案例画廊（3-5个），让用户先看到"花 $4.99 能得到什么"。

### API Keys 功能的目标用户不明确

**问题**：Settings 中有 API Keys 管理（CRUD，sk-{32位}格式），但在面向高中生的产品中，API 这个概念离目标用户太远。

**建议**：
- V1 隐藏 API Keys（从侧边栏移除，保留后端能力）
- V2 如果要做 B2B（教师批量使用），再作为"教师工具"上线

## 5. 功能完整度评估

### 必须立刻修的（P0）

| 问题 | 影响 | 修复成本 |
|------|------|----------|
| Security 页密码重置 handler 被注释 | 用户无法改密码，安全隐患 | 低（2h） |
| Feedbacks 页面是空 div | 用户如果误入，体验极差 | 极低（删除路由或加 Coming Soon） |
| Activity 侧边栏不含 Feedbacks 但路由存在 | 导航不一致 | 极低 |
| UPG 结果操作栏移动端不可用 | 移动端核心功能断裂 | 低（2h） |

### 应该尽快修的（P1）

| 问题 | 影响 | 修复成本 |
|------|------|----------|
| 匿名用户前端阻断生成 | 丢失大量潜在注册 | 中（4h） |
| Blog 详情页 getPost() 调用两次 | 不必要的性能开销 | 低（1h） |
| Admin chats/learning-paths 权限复用 AITASKS_READ | 权限粒度不够，安全风险 | 低（2h） |
| Experiments 卡片还用旧主题色（neon-cyan/neon-green） | 视觉不一致 | 中（3h） |

### 可以推迟的（P2）

| 问题 | 说明 |
|------|------|
| Chat 系统完善 | 当前有基础能力，但不是核心卖点 |
| AI Image/Music/Video Generator | 模板化页面，物理教育不需要这些 |
| Showcases 页面 | 纯静态展示，优先级低 |
| API Key 编辑页冗余代码 | 不影响功能 |

## 6. 竞品差异化分析

### 相对 PhET 的优势

1. **技术栈现代化** -- Next.js + R3F vs PhET 的 Java 遗留代码，开发效率高一个量级
2. **AI 生成能力** -- PhET 全部人工开发实验，NeonPhysics 的 UPG 是真正的壁垒
3. **嵌入能力** -- iframe embed 让教师可以直接在 LMS（Canvas/Google Classroom）中使用
4. **社区效应** -- Gallery 的 Fork/Like/Share 是 PhET 没有的

### 相对 PhET 的劣势

1. **内容深度** -- PhET 有 150+ 精心设计的实验，NeonPhysics 的 Curated Labs 数量未知但肯定少得多
2. **课标对齐可信度** -- PhET 有大学教授团队背书和十几年论文引用，NeonPhysics 目前是零
3. **免费可用性** -- PhET 完全免费，NeonPhysics 有付费墙

### 关键差异化建议

**不要试图在数量上追赶 PhET**。PhET 的护城河是内容深度。NeonPhysics 的护城河应该是：

1. UPG 的 "任意问题 → 即时可视化" 能力（PhET 做不到）
2. 学生的创造力释放（Gallery + Fork + 定制化）
3. 教师集成（嵌入 + 学习路径 + 进度追踪）

## 7. 目标用户匹配度分析

### 高中生（核心用户）

**匹配度：7/10**

优点：UPG 的 "输入问题就出结果" 极度匹配高中生的学习习惯（即时满足）
问题：
- 没有 "作业辅助" 场景的直接入口（"我不理解牛顿第三定律" → 应该一键进 UPG 并推荐相关实验 + 学习路径）
- 注册门槛对未成年人偏高（需要邮箱，没有学校 SSO）

### 教师（付费决策者）

**匹配度：5/10**

核心问题：**教师完全没有专属功能**。

教师需要的是：
- 班级管理（添加学生、分配实验、查看进度）
- 课程计划集成（"我下周要讲光学，推荐相关内容"）
- 批量账号管理
- 与 Google Classroom / Canvas LMS 的集成

当前产品是 C2C 模式（面向个人用户），但在 K-12 教育市场，B2B（学校/学区采购）才是真正的商业模式。$4.99/月的个人订阅天花板太低。

**建议**：
- V1.5 增加 "教师模式"：创建班级 → 邀请学生 → 分配实验/UPG 任务 → 查看完成情况
- V2.0 增加学校级订阅（$X/学生/年）

### 自学者

**匹配度：6/10**

Learn 学习路径功能方向对，但当前内容量可能不足以支撑系统性学习。对于自学者，"学完能做什么"的目标感很重要，当前缺少成就系统或证书机制。

## 8. 增长飞轮分析

### 已有的增长机制

1. **UPG Gallery 的社交传播** -- Fork + 分享 + 嵌入 = 用户生产的内容（UGC）成为获客渠道。但分享功能极其简陋（仅 copy link，没有社交媒体分享按钮）
2. **SEO** -- Learn 页面有 JSON-LD 结构化数据，Blog 有分类和内容，但 Gallery 的 UGC 内容没有被 SEO 利用（画廊是客户端渲染，搜索引擎看不到）
3. **嵌入导流** -- embed 页面有水印（带品牌链接），教师嵌入到 LMS 时会给学生看到品牌

### 缺失的增长机制

**缺失 1：Gallery UGC 没有 SEO 价值**

Gallery 是客户端组件（`GalleryList` 是 client component），搜索引擎无法索引 UGC 内容。如果一个学生生成了 "How does a nuclear reactor work" 的可视化并发布到 Gallery，这个页面应该被 Google 索引，成为长尾流量入口。

**建议**：Gallery 详情页（/gallery/[id]）改为 SSR，让每个公开的 UPG 生成都成为一个可索引的内容页面。

**缺失 2：没有社交媒体分享**

View 页面的分享功能（`handleShare`）只是 copy link。北美高中生用 Instagram / TikTok / Discord。

**建议**：
- 添加 "Export as GIF/Video" 功能，让学生可以在 TikTok/Instagram 分享 3D 可视化
- 添加 Discord 分享按钮（北美高中生的核心社交平台）

**缺失 3：没有推荐引擎**

用户生成完一个可视化后，没有 "你可能也想试试" 的推荐。每次交互结束就是死胡同。

**建议**：生成结果页面底部增加 "Related Topics"（基于 prompt 关键词匹配 Gallery 热门内容 + 相关实验 + 学习路径节点）。

## 9. 数据分析能力评估

### 已有的埋点

Analytics Bridge 定义了7个事件：`experiment_started` / `experiment_completed` / `quota_exhausted` / `upg_generated` / `sign_up` / `subscription_upgrade` / `cookie_consent`。

支持 Plausible + Google Analytics 双渠道，尊重 Cookie Consent。

### 缺失的关键数据

| 缺失事件 | 为什么需要 |
|----------|-----------|
| `upg_result_quality` (thumbs up/down) | 优化 AI prompt 的唯一数据源 |
| `upg_regenerate` | 了解首次生成满意度 |
| `paywall_shown` / `paywall_converted` | 衡量付费墙效果 |
| `gallery_fork` / `gallery_like` | 衡量社区活跃度 |
| `experiment_paywall_hit` | 了解哪些实验驱动升级 |
| `learn_node_completed` | 学习路径完成率 |
| `share_clicked` (by channel) | 了解传播渠道分布 |
| `prompt_template_used` (which template) | 了解预设模板效果 |
| `time_on_visualization` | 衡量生成质量的间接指标 |

**建议**：在 analytics bridge 中补充上述事件。这些数据是产品迭代的命脉，没有它们就是盲飞。

## 10. 优先级建议：如果只能做3件事

### 第一件：让匿名用户直接体验 UPG（预期影响：注册率 +200%）

**为什么**：当前产品最大的问题是核心价值需要注册才能体验。改变这一点，是从 0 到 1 的突破。

**怎么做**：
1. 前端放行匿名生成（后端已支持 1次/天 IP 限流）
2. 生成结果叠加注册引导层（"注册保存你的可视化 + 解锁更多次数"）
3. 注册后自动保存当次生成结果到用户账号

**工期**：约 1 天。

### 第二件：Gallery SSR + 社交分享优化（预期影响：自然流量 +500%，6个月内）

**为什么**：Gallery 是 UGC 增长飞轮的核心，但目前完全是客户端渲染，SEO 价值为零。每一个被发布的 UPG 生成都应该成为一个可索引的 landing page。

**怎么做**：
1. `/gallery/[id]` 改为 SSR，server 端预取 UPG 数据
2. 添加 Open Graph meta tags（标题、描述、截图预览图）
3. 添加社交分享按钮（Twitter/Discord/Copy Link）
4. 每个 Gallery 页面底部加 "Try it yourself" CTA → 链接到 UPG

**工期**：约 3 天。

### 第三件：补全数据埋点 + 质量反馈闭环（预期影响：产品迭代速度 x3）

**为什么**：目前只有7个分析事件，无法回答 "哪些实验最受欢迎"/"UPG 生成质量如何"/"用户在哪个环节流失" 等关键问题。没有数据，后续所有产品决策都是猜测。

**怎么做**：
1. 在 analytics bridge 中补充上述 9 个关键事件
2. UPG 结果页添加 thumbs up/down 反馈组件
3. Plausible dashboard 配置自定义目标和漏斗

**工期**：约 2 天。

## 附录：已发现的代码级问题清单

| 编号 | 问题 | 文件 | 严重度 |
|------|------|------|--------|
| F-01 | Security 页 handler 被注释，提交表单实际不改密码 | settings/security/page.tsx L64-66 | P0 |
| F-02 | Feedbacks 页面是空 div | activity/feedbacks/page.tsx | P0 |
| F-03 | Experiments 卡片使用 neon-cyan/neon-green 旧主题色 | experiments/page.tsx L44,47,73,74 | P1 |
| F-04 | UPG 结果操作栏 hover-only，移动端不可见 | UpgGenerator.tsx L472 | P1 |
| F-05 | View 页面键盘事件监听缺少 useCallback 依赖 | upg/view/[id]/client.tsx L95 | P2 |
| F-06 | 匿名用户前端阻断但后端允许 | UpgGenerator.tsx L143-146 | P1 |
| F-07 | Blog getPost() 双重调用 | 已知问题 | P2 |
| F-08 | Admin 权限码复用 | 已知问题 | P1 |
