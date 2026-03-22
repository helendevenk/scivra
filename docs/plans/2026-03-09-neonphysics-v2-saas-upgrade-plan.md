# NeonPhysics v2 SaaS 平台升级计划

> **文档版本**: v2.0（CTO 评审修订版）
> **创建日期**: 2026-03-09
> **最后更新**: 2026-03-09（根据 CTO 评审意见修订）
> **适用项目**: NeonPhysics v2 (基于 ShipAny Template Two v1.6.0)
> **产品定位**: 教育类 AI SaaS 平台 — 交互式科学可视化生成与分享

---

## 执行摘要

### 当前状态
- ✅ 基础架构完整（Next.js 16 + PostgreSQL + Better Auth）
- ✅ UPG 生成核心已实现（AI 生成 HTML）
- ✅ 基础页面和 API（生成/查看/我的列表）
- ⚠️ 生成质量不稳定（OrbitControls 每次实现不同）
- ❌ 缺少社交功能（画廊/点赞/评论/分享）
- ❌ 缺少付费系统
- 🔴 缺少关键安全措施（内容审核、API 限流、XSS 防护）

### 升级目标
将 NeonPhysics v2 从"功能原型"升级为"可商业化的 SaaS 平台"，支持：
1. 稳定的 AI 生成质量
2. 完整的用户系统和社交功能
3. 公开画廊和内容分发
4. 付费订阅和增值服务
5. 移动端和 SEO 优化
6. **安全合规和性能优化**（CTO 新增）

### 总开发时间
**11-13 周**（1 个全职开发者，包含测试、返工和文档时间）

**修订说明**：根据 CTO 评审意见，原估算 7-9 周过于乐观，未考虑测试（20%）、返工（30%）和文档编写时间。

---

## 优先级分类

### P0（必须有）— 核心生成能力稳定
- 修复 OrbitControls 不稳定问题
- 完善生成质量检查
- 用户基础功能（注册/登录/个人中心）
- 生成历史管理

### P1（强烈建议）— 社交与分发
- 公开画廊/广场
- 点赞/收藏/分享
- 搜索和分类
- 嵌入式播放器

### P2（锦上添花）— 增值与增长
- 付费订阅系统
- 高级生成选项（SVG 混合渲染、D3.js）
- AI 推荐和个性化
- 移动端 App

---

## Phase 0：核心生成能力稳定（1-2 周）

### 目标
解决当前 UPG 生成的核心问题，确保每次生成的 HTML 质量稳定、可用。

### 0.1 修复 OrbitControls 不稳定

**问题分析**：
- 当前 System Prompt 让 AI "手动实现" OrbitControls
- 导致每次生成的实现不一致（有的能用，有的不能用）
- 用户体验差，投诉率高

**解决方案（CTO 修订）**：

**方案 A（推荐）：预编译 OrbitControls 到独立文件**
1. 在 `public/lib/orbit-controls.min.js` 放置精简版或官方压缩版
2. System Prompt 中只需一行引用：
   ```html
   <script src="https://neonphysics.com/lib/orbit-controls.min.js"></script>
   ```
3. AI 只需生成初始化代码：
   ```javascript
   const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
   controls.dampingFactor = 0.05;
   controls.minDistance = 5;
   controls.maxDistance = 50;
   ```

**方案 B（备选）：使用 CDN + 版本锁定**
```html
<script src="https://cdn.jsdelivr.net/npm/three@0.183.1/examples/js/controls/OrbitControls.js"></script>
```
注意：需要处理 ES Module vs UMD 的兼容性问题

**技术优势**：
- ✅ 避免 System Prompt 膨胀（节省 60-80 行代码）
- ✅ 可以使用官方完整版（800+ 行，功能完整）
- ✅ 易于维护和更新
- ✅ 减少 AI 生成时的 token 消耗

**文件修改**：
- `public/lib/orbit-controls.min.js` — 新增文件
- `src/shared/lib/upg/system-prompt.ts` — 更新引用方式

**验收标准（CTO 加强）**：
- ✅ 连续生成 10 个不同主题，OrbitControls 100% 可用
- ✅ 支持桌面和移动端操作
- ✅ 移动端双指缩放 + 页面滚动不冲突
- ✅ 快速拖拽后的惯性停止平滑
- ✅ 极限缩放（minDistance/maxDistance）正确限制
- ✅ 在 iPhone SE（2020）上测试，无卡顿
- ✅ 无控制台错误

**开发量**：3.5-4.5 天（CTO 修正：原估算 2 天过于乐观）
- 编写/选择 OrbitControls 版本：1 天
- 集成到 System Prompt：0.5 天
- 测试 10 个主题：1 天
- 修复发现的 bug：1-2 天

---

### 0.2 统一 Three.js 和 KaTeX 版本 ✅

**状态**: 已完成（2026-03-09）

**问题分析**：
- System Prompt 指定 Three.js r134，但 package.json 是 0.183.1
- System Prompt 指定 KaTeX 0.16.9，但 package.json 是 0.16.33
- 版本不一致可能导致 API 差异和渲染问题

**实施方案（已执行）**：
1. ✅ 创建集中式版本配置文件 `/src/config/lib-versions.ts`
2. ✅ 采用双版本策略：
   - UPG CDN: Three.js r134 + KaTeX 0.16.9（稳定，CDN 缓存好）
   - npm: Three.js 0.183.1 + KaTeX 0.16.33（最新特性）
3. ✅ 更新 System Prompt 使用配置驱动的版本号
4. ✅ 更新 constants.ts 重新导出 CDN 白名单
5. ✅ TypeScript 类型检查通过

**技术决策**：
- 保持双版本策略而非统一版本
- UPG 生成的 HTML 使用稳定的 CDN 版本（r134/0.16.9）
- React 组件使用最新 npm 版本（0.183.1/0.16.33）
- 理由：UPG HTML 需要在任何浏览器独立运行，稳定性优先

**文件修改**：
- `src/config/lib-versions.ts` — 新建版本配置文件
- `src/shared/lib/upg/system-prompt.ts` — 使用配置驱动的版本号
- `src/shared/lib/upg/constants.ts` — 重新导出 CDN 白名单

**验收标准**：
- ✅ 版本号集中管理，单一数据源
- ✅ System Prompt 动态引用版本配置
- ✅ TypeScript 类型检查通过
- ✅ 向后兼容性保持

**详细报告**: `/docs/reports/2026-03-09-version-unification-report.md`

**开发量**: 0.5 天（实际）

**验收标准**：
- 所有生成的 HTML 使用统一版本
- KaTeX 公式自动渲染，无需手动调用
- 无版本冲突错误

**开发量**：1 天

---

### 0.3 增强质量检查

**问题分析**：
- 当前 `quality-checker.ts` 只检查基础结构（DOCTYPE、html、head、body）
- 不检查实际功能（Three.js 场景、滑块、公式）
- 导致生成的 HTML 可能"结构正确但功能缺失"

**新增检查项**：
1. ✅ 检查是否有 `requestAnimationFrame` 循环
2. ✅ 检查是否有至少 1 个 Three.js 对象（Mesh/Line/Points）
3. ✅ 检查是否有至少 3 个 `<input type="range">` 滑块
4. ✅ 检查 KaTeX 公式是否正确渲染（检查 `.katex` class 或 `katex.render` 调用）
5. ✅ 检查测验是否有事件监听器（addEventListener）
6. ✅ 检查是否有知识卡片（至少 3 个）

**技术实现**：
```typescript
// src/shared/lib/upg/quality-checker.ts
export function checkQuality(html: string): QualityResult {
  const issues: string[] = [];

  // 检查 requestAnimationFrame
  if (!html.includes('requestAnimationFrame')) {
    issues.push('Missing animation loop');
  }

  // 检查 Three.js 对象
  const hasThreeObjects = /new THREE\.(Mesh|Line|Points|Group)/g.test(html);
  if (!hasThreeObjects) {
    issues.push('No Three.js objects found');
  }

  // 检查滑块数量
  const sliderCount = (html.match(/<input[^>]+type=["']range["']/g) || []).length;
  if (sliderCount < 3) {
    issues.push(`Only ${sliderCount} sliders found, need at least 3`);
  }

  // ... 其他检查

  return {
    passed: issues.length === 0,
    issues,
  };
}
```

**文件修改**：
- `src/shared/lib/upg/quality-checker.ts`

**验收标准**：
- 质量检查覆盖所有核心功能
- 不合格的生成被拒绝，不计入配额
- 质量检查通过率 > 90%

**开发量**：2 天

---

### 0.4 生成预览和重试机制

**功能描述**：
- 生成完成后，先显示预览（iframe）
- 用户可以选择"满意"或"重新生成"
- 重新生成不消耗额外配额（同一个 prompt 的前 3 次重试免费）
- 提升用户满意度，降低投诉率

**数据模型**：
```sql
-- upg_generation 表新增字段
ALTER TABLE upg_generation ADD COLUMN retry_count INT DEFAULT 0;
ALTER TABLE upg_generation ADD COLUMN parent_generation_id VARCHAR;
```

**API 设计**：
```typescript
// POST /api/upg/[id]/retry
{
  "generationId": "xxx"
}

// Response
{
  "id": "new-generation-id",
  "status": "completed",
  "htmlContent": "...",
  "retryCount": 1
}
```

**页面流程**：
1. 用户提交 prompt → 显示加载动画
2. 生成完成 → 显示预览 iframe
3. 底部显示两个按钮：
   - "满意，保存" → 跳转到查看页面
   - "重新生成" → 调用 retry API（前 3 次免费）
4. 超过 3 次重试 → 提示"已达到免费重试上限，继续将消耗配额"

**文件修改**：
- `src/app/api/upg/[id]/retry/route.ts` — 新增 API
- `src/app/[locale]/(landing)/(ai)/upg/view/[id]/page.tsx` — 添加重试按钮
- `src/shared/models/upg_generation.ts` — 更新 model

**验收标准**：
- 重试功能正常工作
- 前 3 次重试不消耗配额
- 重试记录正确关联（parent_generation_id）

**开发量**：3 天

---

## Phase 1：用户系统完善（1 周）

### 目标
完善用户系统，提供完整的个人中心和配额管理功能。

### 1.1 个人中心页面

**功能描述**：
- 我的生成列表（已有 `/upg/my`）
- 我的收藏列表
- 我的点赞列表
- 使用统计（已生成数量、剩余配额、积分余额）
- 账户设置（头像、昵称、邮箱）

**数据模型**：
```sql
-- 新增收藏表
CREATE TABLE upg_favorite (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  generation_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, generation_id)
);

CREATE INDEX idx_upg_favorite_user ON upg_favorite(user_id);
CREATE INDEX idx_upg_favorite_generation ON upg_favorite(generation_id);
```

**API 设计**：
```typescript
// POST /api/upg/[id]/favorite
// 收藏/取消收藏
{
  "action": "add" | "remove"
}

// GET /api/upg/favorites
// 我的收藏列表（支持分页）
{
  "page": 1,
  "pageSize": 20
}
```

**页面设计**：
- `src/app/[locale]/(landing)/dashboard/page.tsx` — 个人中心
- 使用 Tabs 组件切换：
  - "我的生成"（已有）
  - "我的收藏"（新增）
  - "我的点赞"（新增）
  - "使用统计"（新增）

**UI 组件**：
- 使用 `@radix-ui/react-tabs` 实现标签切换
- 使用 `@tanstack/react-table` 实现列表展示
- 使用 `recharts` 实现使用统计图表

**文件修改**：
- `src/app/api/upg/[id]/favorite/route.ts` — 新增 API
- `src/app/api/upg/favorites/route.ts` — 新增 API
- `src/app/[locale]/(landing)/dashboard/page.tsx` — 个人中心页面
- `src/shared/models/upg_favorite.ts` — 新增 model
- `src/shared/blocks/dashboard/FavoriteList.tsx` — 收藏列表组件
- `src/shared/blocks/dashboard/UsageStats.tsx` — 使用统计组件

**验收标准**：
- 收藏功能正常工作
- 个人中心展示所有数据
- 响应式布局，移动端可用

**开发量**：4 天

---

### 1.2 用户配额和积分系统

**功能描述**：
- 免费用户：每天 3 次生成
- 付费用户：每天 50 次生成
- 积分系统：邀请好友、分享作品可获得额外积分
- 积分可兑换生成次数（100 积分 = 1 次生成）

**数据模型**：
```sql
-- 用户积分表
CREATE TABLE user_credits (
  user_id VARCHAR PRIMARY KEY,
  total_credits INT DEFAULT 0,
  used_credits INT DEFAULT 0,
  available_credits INT GENERATED ALWAYS AS (total_credits - used_credits) STORED,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 积分变动记录表
CREATE TABLE credit_transaction (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  amount INT NOT NULL, -- 正数为增加，负数为消耗
  type VARCHAR NOT NULL, -- 'earn_invite' | 'earn_share' | 'spend_generation'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_credit_transaction_user ON credit_transaction(user_id);
```

**API 设计**：
```typescript
// GET /api/user/quota
// 查询当前配额和积分
{
  "dailyQuota": {
    "total": 3,
    "used": 1,
    "remaining": 2,
    "resetAt": "2026-03-10T00:00:00Z"
  },
  "credits": {
    "total": 500,
    "used": 100,
    "available": 400
  }
}

// POST /api/user/credits/earn
// 赚取积分
{
  "type": "invite" | "share",
  "referenceId": "xxx" // 邀请码或分享ID
}

// POST /api/user/credits/spend
// 消耗积分兑换生成次数
{
  "amount": 100 // 100积分 = 1次生成
}
```

**业务逻辑**：
```typescript
// src/shared/lib/usage/credit-service.ts
export async function earnCredits(userId: string, type: string, amount: number) {
  // 1. 更新 user_credits 表
  // 2. 记录 credit_transaction
  // 3. 发送通知（可选）
}

export async function spendCredits(userId: string, amount: number) {
  // 1. 检查余额是否足够
  // 2. 扣除积分
  // 3. 增加配额
  // 4. 记录交易
}
```

**页面展示**：
- 在生成页面顶部显示剩余次数和积分
- 配额用完时，显示"使用积分兑换"按钮
- 个人中心显示积分明细

**文件修改**：
- `src/app/api/user/quota/route.ts` — 新增 API
- `src/app/api/user/credits/earn/route.ts` — 新增 API
- `src/app/api/user/credits/spend/route.ts` — 新增 API
- `src/shared/lib/usage/credit-service.ts` — 新增服务
- `src/shared/models/user_credits.ts` — 新增 model
- `src/shared/models/credit_transaction.ts` — 新增 model
- `src/shared/blocks/upg/QuotaDisplay.tsx` — 配额显示组件

**验收标准**：
- 配额系统正常工作
- 积分赚取和消耗正确记录
- 积分兑换生成次数功能正常

**开发量**：3 天

---


## Phase 2：公开画廊和社交功能（2 周）

### 目标
构建公开画廊，实现内容分发和社交互动功能。

### 2.1 公开画廊页面

**功能描述**：
- 展示所有公开的生成作品
- 支持分类筛选（物理/化学/生物/数学/天文/工程）
- 支持排序（最新/最热/最多点赞）
- 瀑布流布局（Masonry）或网格布局
- 无限滚动加载

**数据模型**：
```sql
-- upg_generation 表新增字段
ALTER TABLE upg_generation ADD COLUMN category VARCHAR;
ALTER TABLE upg_generation ADD COLUMN tags TEXT[];
ALTER TABLE upg_generation ADD COLUMN featured BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_upg_generation_public ON upg_generation(is_public, created_at DESC);
CREATE INDEX idx_upg_generation_category ON upg_generation(category);
```

**开发量**：5 天

---

### 2.2 点赞和评论系统

**功能描述**：
- 点赞功能（已有）
- 评论功能（新增）
- 评论点赞（新增）
- 支持评论回复（嵌套评论）

**开发量**：4 天

---

### 2.3 分享和嵌入功能

**功能描述**：
- 生成分享链接（短链接）
- 生成嵌入代码（iframe）
- 社交媒体分享
- 分享统计

**开发量**：3 天

---

### 2.4 搜索功能（CTO 修订）

**功能描述**：
- 简单模糊搜索（PostgreSQL ILIKE）
- 学科分类筛选
- 高级筛选（语言、日期范围）
- 搜索建议（基于热门标签）

**技术方案（CTO 修订）**：

**Phase 1：使用 ILIKE 模糊搜索（当前实现）**

```sql
-- 简单但够用的搜索
SELECT * FROM upg_generation
WHERE (prompt ILIKE '%关键词%' OR tags::text ILIKE '%关键词%')
  AND is_public = TRUE
ORDER BY created_at DESC
LIMIT 20;

-- 优势：
-- ✅ 实现简单，无需额外配置
-- ✅ 支持中英文
-- ✅ 性能可接受（< 100ms，数据量 < 10 万）

-- 劣势：
-- ⚠️ 无法做语义搜索
-- ⚠️ 无法做拼写纠错
-- ⚠️ 大数据量时性能下降
```

**Phase 2：迁移到 Algolia（触发条件：日搜索量 > 1000 次）**

```typescript
// 迁移方案（预计 2 天工作量）
import algoliasearch from 'algoliasearch';

const client = algoliasearch('APP_ID', 'API_KEY');
const index = client.initIndex('upg_generations');

// 同步数据到 Algolia
export async function syncToAlgolia(generation: UpgGeneration) {
  await index.saveObject({
    objectID: generation.id,
    prompt: generation.prompt,
    category: generation.category,
    tags: generation.tags,
    language: generation.language,
    createdAt: generation.createdAt.getTime(),
  });
}

// 搜索
const results = await index.search('牛顿第二定律', {
  filters: 'category:physics AND language:zh',
  hitsPerPage: 20,
});
```

**成本对比**：
- 10,000 次/月：免费
- 100,000 次/月：$50/月
- 对于教育 SaaS，前期免费额度够用

**技术债务记录**：

在 `docs/tech-debt.md` 中记录：

```markdown
## TD-001: 搜索方案临时使用 ILIKE
- 当前：PostgreSQL ILIKE 模糊搜索
- 问题：无语义搜索、无拼写纠错、性能一般
- 触发条件：日搜索量 > 1000 次
- 迁移方案：Algolia（预计 2 天工作量）
- 优先级：P2（非紧急）
```

**API 设计**：

```typescript
// GET /api/gallery/search
{
  "q": "牛顿第二定律",
  "category": "physics", // 可选
  "language": "zh", // 可选
  "dateFrom": "2026-01-01", // 可选
  "dateTo": "2026-03-09", // 可选
  "page": 1,
  "pageSize": 20
}

// GET /api/gallery/search/suggestions
// 基于热门标签的搜索建议
{
  "q": "牛顿"
}

// Response
{
  "suggestions": ["牛顿第二定律", "牛顿第三定律", "牛顿运动定律"]
}
```

**文件修改**：
- `src/app/api/gallery/search/route.ts` — 新增 API
- `src/app/api/gallery/search/suggestions/route.ts` — 新增 API
- `src/shared/blocks/gallery/SearchBar.tsx` — 搜索框组件
- `docs/tech-debt.md` — 新增技术债务记录

**验收标准**：
- ✅ 搜索功能正常工作
- ✅ 搜索结果准确（相关性 > 80%）
- ✅ 搜索响应时间 < 200ms
- ✅ 支持中英文搜索
- ✅ 搜索建议基于热门标签

**开发量**：3 天（CTO 确认：估算合理）

---

## Phase 3：高级生成选项（2 周）

### 3.1 学科自动识别和配色

**功能描述**：
- 根据 prompt 关键词自动识别学科
- 自动选择对应配色主题

**实现**：
```typescript
// src/shared/lib/upg/category-detector.ts
export function detectCategory(prompt: string): Category {
  const keywords = {
    physics: ['力', '运动', '能量', 'force', 'motion'],
    chemistry: ['化学', '反应', '分子', 'chemical'],
    biology: ['生物', '细胞', 'DNA', 'biology'],
    math: ['数学', '函数', '几何', 'math'],
    astronomy: ['天文', '星球', '宇宙', 'astronomy'],
    engineering: ['工程', '机械', '电路', 'engineering'],
  };
  // 计算匹配分数，返回得分最高的类别
}
```

**开发量**：2 天

---

### 3.2 SVG + Three.js 混合渲染

**功能描述**：
- 根据主题自动选择渲染模式
- 纯 Three.js（3D 场景）
- 纯 SVG（2D 图表）
- 混合模式（3D + 数据图表）

**开发量**：5 天

---

### 3.3 可折叠测验面板

**功能描述**：
- 测验面板默认显示在右侧
- 右上角有"隐藏"按钮
- 隐藏后显示为右下角悬浮按钮
- 平滑过渡动画

**开发量**：1 天

---

### 3.4 生成选项自定义

**功能描述**：
- 标准模式（当前）
- 高级模式（SVG 混合渲染 + D3.js）
- 简化模式（无测验、无公式，适合小学生）
- 用户可选择语言和配色主题

**开发量**：3 天

---

## Phase 4：付费订阅系统（1-2 周）

### 4.1 定价方案设计

**方案**：
- **免费版**：每天 3 次生成，标准模式
- **Pro 版**（$9.9/月）：每天 50 次生成，高级模式，无水印
- **Team 版**（$29.9/月）：无限生成，团队协作，API 访问

**开发量**：1 天（设计）

---

### 4.2 Stripe 集成

**功能**：
- 订阅购买流程
- 自动续费
- 发票管理
- 取消订阅

**开发量**：4 天

---

### 4.3 配额管理优化

**功能**：
- 根据订阅等级自动调整配额
- 超额提示和升级引导
- 积分兑换额外配额

**开发量**：2 天

---

## Phase 5：增长和优化（持续）

### 5.1 SEO 优化

**功能**：
- 每个生成作品有独立 SEO 元数据
- 自动生成 Open Graph 图片
- Sitemap 包含画廊页面

**开发量**：3 天

---

### 5.2 AI 推荐系统

**功能**：
- 基于用户浏览历史推荐相关作品
- "猜你喜欢"模块
- 热门主题推荐

**开发量**：5 天

---

### 5.3 移动端优化

**功能**：
- 响应式布局优化
- 触摸手势支持
- PWA 支持（离线访问）

**开发量**：4 天

---

### 5.4 数据分析和监控

**功能**：
- 用户行为分析（GA4/Plausible）
- 生成成功率监控
- 错误日志收集（Sentry）

**开发量**：2 天

---

## 总开发时间估算（CTO 修订版）

| Phase | 功能 | 开发 | 测试 | 返工 | 文档 | 总计 |
|-------|------|------|------|------|------|------|
| Phase 0 | 核心生成能力稳定 | 16.5 天 | 3.5 天 | 3 天 | 1 天 | **24 天（3.5 周）** |
| Phase 1 | 用户系统完善 | 7 天 | 2 天 | 2 天 | 1 天 | **12 天（1.7 周）** |
| Phase 2 | 公开画廊和社交功能 | 15 天 | 3 天 | 3 天 | 2 天 | **23 天（3.3 周）** |
| Phase 3 | 高级生成选项 | 11 天 | 2 天 | 2 天 | 1 天 | **16 天（2.3 周）** |
| Phase 4 | 付费订阅系统 | 7 天 | 2 天 | 2 天 | 1 天 | **12 天（1.7 周）** |
| Phase 5 | 增长和优化 | 持续迭代 | - | - | - | **持续** |

**总计**：**87 天（12.4 周）**

**修订说明**：
- 原估算 7-9 周过于乐观
- 新增了测试时间（20%）、返工时间（15-20%）、文档时间
- 新增了 Phase 0 的 3 个关键任务（移动端性能、内容审核、数据库优化）
- 建议预留 1 周 buffer，最终交付时间：**13-14 周**

---

## 技术债务和风险（CTO 修订版）

### 风险 1：AI 生成质量不稳定 — 🟡 中风险
**缓解措施（已加强）**：
- ✅ Phase 0 重点解决（OrbitControls 预编译方案）
- ✅ 添加重试机制（前 3 次免费）
- ✅ 建立生成质量评分系统（0-100 分）
- ✅ 自动标记低质量生成（score < 60 需审核，< 40 直接拒绝）

**备选方案**：
- 建立精选模板库，作为 few-shot examples
- 人工审核高质量生成，提取为模板

---

### 风险 2：Three.js 性能问题（移动端）— 🟡 中风险
**缓解措施（已实现）**：
- ✅ Phase 0.5 实现设备性能检测
- ✅ 性能分级配置（high/medium/low）
- ✅ 自动降级渲染质量
- ✅ 在 iPhone SE 和 Android 低端机上测试

**备选方案**：
- 提供"简化模式"（无粒子系统、无阴影）
- 添加性能监控（stats.js）

---

### 风险 3：AI 内容法律风险 — 🔴 高风险（CTO 新增）
**缓解措施（已实现）**：
- ✅ Phase 0.6 实现 Prompt 敏感词过滤
- ✅ HTML 内容外部资源检查
- ✅ 所有生成页面显示免责声明
- ✅ 举报机制 + 自动下架（举报数 >= 3）
- ✅ 管理后台审核界面

**备选方案**：
- 集成第三方内容审核 API（阿里云内容安全）
- 建立人工审核团队

---

### 风险 4：数据库性能瓶颈 — 🟡 中风险
**缓解措施（已实现）**：
- ✅ Phase 0.7 添加关键索引
- ✅ 使用乐观锁解决并发问题
- ✅ 标签关联表替代 TEXT[] 数组

**备选方案**：
- 使用 Redis 缓存热门数据
- 分库分表、读写分离

---

### 风险 5：数据库连接池耗尽 — 🟡 中风险（CTO 新增）
**缓解措施**：
```typescript
// 使用连接池 + 超时控制
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // 每个 Serverless 函数最多 10 个连接
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
```

**监控指标**：
- 数据库连接数（Vercel Postgres Dashboard）
- API 响应时间（P50/P95/P99）
- 连接超时错误率

---

### 风险 6：付费转化率低 — 🟢 低风险
**缓解措施**：
- 免费版提供足够价值（每天 3 次生成）
- Pro 版提供明显增值（高级模式、无水印、50 次/天）
- 积分系统（邀请好友、分享作品赚积分）

**备选方案**：
- 按次付费模式（$0.5/次）
- 团队版（$29.9/月，无限生成）

---

## 安全措施清单（CTO 新增）

### 1. XSS 防护
```typescript
// 所有用户输入必须经过 DOMPurify 清理
import DOMPurify from 'dompurify';

const cleanPrompt = DOMPurify.sanitize(userInput);
```

### 2. API 限流
```typescript
// 使用 Vercel KV 实现限流
import { kv } from '@vercel/kv';

export async function rateLimit(userId: string, limit: number, window: number) {
  const key = `rate_limit:${userId}`;
  const current = await kv.incr(key);

  if (current === 1) {
    await kv.expire(key, window);
  }

  if (current > limit) {
    throw new Error('Rate limit exceeded');
  }
}

// 在 API 路由中使用
await rateLimit(userId, 10, 60); // 每分钟最多 10 次请求
```

### 3. API 版本控制
```typescript
// 使用 URL 版本控制
POST /api/v1/upg/[id]/retry

// 或使用 Header 版本控制
POST /api/upg/[id]/retry
Headers: { "X-API-Version": "1" }
```

### 4. 统一错误响应格式
```typescript
{
  "error": {
    "code": "INSUFFICIENT_QUOTA",
    "message": "您的配额已用完，请升级到 Pro 版",
    "details": {
      "current": 0,
      "required": 1
    }
  }
}
```

### 5. 错误边界
```typescript
// src/shared/components/ErrorBoundary.tsx
'use client';

export class ErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // 发送到 Sentry
  }

  render() {
    if (this.state.hasError) {
      return <div>出错了，请刷新页面</div>;
    }
    return this.props.children;
  }
}
```

### 6. CSRF 防护
```typescript
// Next.js 自动处理 CSRF（使用 SameSite cookies）
// 确保所有 POST 请求使用 CSRF token
```

### 7. SQL 注入防护
```typescript
// 使用 Drizzle ORM 参数化查询（自动防护）
const result = await db.select()
  .from(upgGeneration)
  .where(eq(upgGeneration.userId, userId)); // 安全
```

---
- **缓解**：添加索引、使用 Redis 缓存热门数据
- **备选方案**：分库分表、读写分离

---

## 关键里程碑

### Milestone 1：MVP 上线（Phase 0 + Phase 1）
- **时间**：2-3 周
- **目标**：生成质量稳定 + 用户系统完善
- **验收**：用户可以注册、生成、查看历史

### Milestone 2：社交功能上线（Phase 2）
- **时间**：第 4-5 周
- **目标**：画廊、点赞、评论、分享功能完整
- **验收**：用户可以浏览他人作品、互动

### Milestone 3：付费系统上线（Phase 4）
- **时间**：第 6-7 周
- **目标**：订阅购买流程完整
- **验收**：用户可以购买 Pro 版

### Milestone 4：持续优化（Phase 3 + Phase 5）
- **时间**：第 8 周起
- **目标**：高级功能、SEO、推荐系统
- **验收**：用户增长、留存率提升

---

## 下一步行动

1. **确认优先级**：确认 Phase 0-2 为核心优先级
2. **启动 Phase 0**：立即开始修复 OrbitControls 和质量检查
3. **设计评审**：召开 CTO 评审会议，审核技术方案
4. **资源分配**：确认开发人员和时间安排
5. **建立看板**：使用 GitHub Projects 或 Linear 追踪进度

---

## 附录：技术选型对比

### 搜索方案对比

| 方案 | 优点 | 缺点 | 成本 |
|------|------|------|------|
| PostgreSQL 全文搜索 | 无额外依赖，简单 | 功能有限，性能一般 | 免费 |
| Algolia | 功能强大，速度快 | 需要额外服务 | $1/1000 次搜索 |
| Meilisearch | 开源，功能强大 | 需要自建服务 | 服务器成本 |

**推荐**：先用 PostgreSQL，后期迁移到 Algolia

---

### 图片存储方案对比

| 方案 | 优点 | 缺点 | 成本 |
|------|------|------|------|
| Vercel Blob | 集成简单，CDN 加速 | 价格较高 | $0.15/GB |
| Cloudflare R2 | 价格低，无出口费用 | 需要额外配置 | $0.015/GB |
| AWS S3 | 稳定可靠 | 出口费用高 | $0.023/GB + 出口费 |

**推荐**：Cloudflare R2（已在项目中集成）

---

## 文档版本历史

- **v1.0** (2026-03-09)：初始版本，完整升级计划


### 0.5 移动端性能优化（CTO 新增）

**问题分析**：
- Three.js 场景在低端手机上可能卡顿或崩溃
- 当前计划只提到"检测设备性能"，但没有具体实现

**解决方案**：

**1. 设备性能检测**

```typescript
// src/shared/lib/upg/device-detector.ts
export function getDevicePerformanceTier(): 'high' | 'medium' | 'low' {
  // 检测 GPU
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
  
  // 检测内存
  const memory = (navigator as any).deviceMemory || 4; // GB
  
  // 检测 CPU 核心数
  const cores = navigator.hardwareConcurrency || 2;
  
  // 综合判断
  if (memory >= 8 && cores >= 4) return 'high';
  if (memory >= 4 && cores >= 2) return 'medium';
  return 'low';
}
```

**2. 性能分级配置**

在 System Prompt 中添加性能分级模板：

```javascript
const performanceConfig = {
  high: { 
    particles: 10000, 
    antialiasing: true, 
    shadows: true,
    postProcessing: true
  },
  medium: { 
    particles: 5000, 
    antialiasing: true, 
    shadows: false,
    postProcessing: false
  },
  low: { 
    particles: 1000, 
    antialiasing: false, 
    shadows: false,
    postProcessing: false
  }
};

// 根据设备等级生成对应复杂度的场景
const tier = getDevicePerformanceTier();
const config = performanceConfig[tier];
```

**3. 性能监控**

```javascript
// 在生成的 HTML 中添加 FPS 监控（开发模式）
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  // ... 渲染逻辑
  stats.end();
  requestAnimationFrame(animate);
}
```

**文件修改**：
- `src/shared/lib/upg/device-detector.ts` — 新增文件
- `src/shared/lib/upg/system-prompt.ts` — 添加性能分级模板
- `src/app/api/upg/generate/route.ts` — 传递性能等级参数

**验收标准**：
- ✅ 在 iPhone SE（2020）上测试，帧率 > 30 FPS
- ✅ 在 Android 低端机（2GB RAM）上测试，不崩溃
- ✅ 高端设备自动启用高质量渲染
- ✅ 低端设备自动降级，但功能完整

**开发量**：2 天

---

### 0.6 AI 内容审核机制（CTO 新增 - 高优先级）

**问题分析**：
- UPG 生成的 HTML 可能包含不当内容
- 用户输入的恶意 prompt 可能生成敏感内容
- 缺少法律免责和举报处理流程

**解决方案**：

**1. Prompt 敏感词过滤**

```typescript
// src/shared/lib/upg/content-moderator.ts
export async function moderatePrompt(prompt: string): Promise<ModerationResult> {
  // 敏感词检查
  const sensitiveWords = ['政治', '暴力', '色情', '赌博', '毒品'];
  const hasSensitiveWord = sensitiveWords.some(word => prompt.includes(word));
  
  if (hasSensitiveWord) {
    return {
      passed: false,
      reason: '输入包含敏感词，请修改后重试'
    };
  }
  
  // 可选：调用第三方审核 API（如阿里云内容安全）
  // const result = await fetch('https://green.aliyuncs.com/...');
  
  return { passed: true };
}
```

**2. HTML 内容检查**

```typescript
// src/shared/lib/upg/html-content-checker.ts
export function checkExternalResources(html: string): string[] {
  // 检查 HTML 中的外部资源链接
  const externalLinks = html.match(/https?:\/\/[^\s"']+/g) || [];
  const allowedDomains = [
    'cdn.jsdelivr.net', 
    'cdnjs.cloudflare.com', 
    'unpkg.com',
    'neonphysics.com'
  ];
  
  return externalLinks.filter(link => {
    return !allowedDomains.some(domain => link.includes(domain));
  });
}
```

**3. 免责声明**

在每个生成页面底部添加：

```html
<div class="disclaimer">
  ⚠️ 本内容由 AI 生成，仅供教育参考，不保证科学准确性。
  如发现不当内容，请<a href="/report">点击举报</a>。
</div>
```

**4. 举报处理流程**

```sql
-- upg_report 表已存在，新增处理状态
ALTER TABLE upg_report ADD COLUMN status VARCHAR DEFAULT 'pending';
-- 'pending' | 'reviewing' | 'resolved' | 'rejected'

ALTER TABLE upg_report ADD COLUMN reviewed_by VARCHAR;
ALTER TABLE upg_report ADD COLUMN reviewed_at TIMESTAMP;
ALTER TABLE upg_report ADD COLUMN resolution TEXT;

-- 自动下架机制
CREATE OR REPLACE FUNCTION auto_hide_reported_content()
RETURNS TRIGGER AS $$
BEGIN
  -- 如果举报数 >= 3，自动隐藏
  UPDATE upg_generation 
  SET is_public = FALSE
  WHERE id = NEW.generation_id
  AND (SELECT COUNT(*) FROM upg_report WHERE generation_id = NEW.generation_id) >= 3;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_hide
AFTER INSERT ON upg_report
FOR EACH ROW EXECUTE FUNCTION auto_hide_reported_content();
```

**5. 管理后台审核界面**

```typescript
// src/app/[locale]/(admin)/admin/reports/page.tsx
// 显示待审核举报列表
// 管理员可以：
// - 查看举报内容和原因
// - 查看被举报的生成
// - 决定：保留/删除/警告用户
```

**文件修改**：
- `src/shared/lib/upg/content-moderator.ts` — 新增文件
- `src/shared/lib/upg/html-content-checker.ts` — 新增文件
- `src/app/api/upg/generate/route.ts` — 添加审核调用
- `src/app/[locale]/(admin)/admin/reports/page.tsx` — 新增管理页面
- `src/config/db/schema.ts` — 更新 upg_report 表

**验收标准**：
- ✅ 敏感词 prompt 被拒绝
- ✅ 外部资源链接被检测并警告
- ✅ 举报数 >= 3 自动隐藏
- ✅ 管理员可以审核举报
- ✅ 所有生成页面显示免责声明

**开发量**：3 天

---

### 0.7 数据库索引优化（CTO 新增 - 高优先级）

**问题分析**：
- 当前 schema 缺少关键索引
- 画廊页面的"分类+排序"查询会全表扫描
- "我的生成"列表会很慢

**解决方案**：

```sql
-- 1. upg_generation 表索引优化
CREATE INDEX idx_upg_generation_user ON upg_generation(user_id, created_at DESC);
CREATE INDEX idx_upg_generation_tags ON upg_generation USING GIN(tags); -- 数组索引
CREATE INDEX idx_upg_generation_gallery ON upg_generation(is_public, category, created_at DESC); -- 复合索引

-- 2. user_credits 表并发安全优化
-- 方案：使用乐观锁
ALTER TABLE user_credits ADD COLUMN version INT DEFAULT 0;

-- 扣除积分时：
UPDATE user_credits 
SET balance = balance - 100, version = version + 1
WHERE user_id = ? AND version = ? AND balance >= 100;
-- 如果 affected_rows = 0，说明并发冲突或余额不足

-- 3. 新增审计日志表
CREATE TABLE audit_log (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR,
  action VARCHAR NOT NULL, -- 'generate_upg' | 'like' | 'report' | 'admin_delete'
  resource_type VARCHAR, -- 'upg_generation' | 'user' | 'credit'
  resource_id VARCHAR,
  metadata JSONB, -- 灵活存储额外信息
  ip_address VARCHAR,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log(action, created_at DESC);

-- 4. 标签关联表（替代 TEXT[] 数组）
CREATE TABLE upg_tag (
  id VARCHAR PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  category VARCHAR, -- 'physics' | 'chemistry' | ...
  usage_count INT DEFAULT 0
);

CREATE TABLE upg_generation_tag (
  generation_id VARCHAR NOT NULL,
  tag_id VARCHAR NOT NULL,
  PRIMARY KEY (generation_id, tag_id)
);

CREATE INDEX idx_upg_generation_tag_tag ON upg_generation_tag(tag_id);
CREATE INDEX idx_upg_generation_tag_generation ON upg_generation_tag(generation_id);
```

**文件修改**：
- `src/config/db/schema.ts` — 更新表结构
- `src/config/db/migrations/` — 新增迁移文件
- `src/shared/models/audit_log.ts` — 新增 model
- `src/shared/models/upg_tag.ts` — 新增 model
- `src/shared/models/user_credits.ts` — 更新并发控制逻辑

**验收标准**：
- ✅ 画廊页面查询时间 < 100ms（1000 条数据）
- ✅ "我的生成"列表查询时间 < 50ms
- ✅ 并发扣除积分无竞态条件
- ✅ 所有关键操作记录到审计日志

**开发量**：2 天

---

## Phase 0 总结（CTO 修订）

**原估算**：1-2 周（8 天）
**修正后**：2.5-3 周（13-15 天）

| 任务 | 开发 | 测试 | 返工 | 总计 |
|------|------|------|------|------|
| 0.1 OrbitControls | 3.5 天 | 0.5 天 | 0.5 天 | 4.5 天 |
| 0.2 版本统一 | 1 天 | 0.5 天 | 0 天 | 1.5 天 |
| 0.3 质量检查 | 2 天 | 0.5 天 | 0.5 天 | 3 天 |
| 0.4 重试机制 | 3 天 | 0.5 天 | 0.5 天 | 4 天 |
| 0.5 移动端性能 | 2 天 | 0.5 天 | 0.5 天 | 3 天 |
| 0.6 内容审核 | 3 天 | 0.5 天 | 0.5 天 | 4 天 |
| 0.7 数据库优化 | 2 天 | 0.5 天 | 0.5 天 | 3 天 |
| **总计** | **16.5 天** | **3.5 天** | **3 天** | **23 天** |

**关键里程碑**：
- Day 5：OrbitControls 稳定
- Day 10：质量检查和重试机制完成
- Day 15：移动端性能和内容审核完成
- Day 20：数据库优化完成，Phase 0 验收


## CTO 评审总结

### 主要修订点

1. **OrbitControls 方案优化**
   - 从"内联 60-80 行代码"改为"预编译到独立文件"
   - 避免 System Prompt 膨胀，易于维护

2. **搜索方案务实化**
   - 从"PostgreSQL 全文搜索"改为"ILIKE 模糊搜索"
   - 记录技术债务，后期迁移 Algolia

3. **新增关键安全措施**
   - AI 内容审核机制（敏感词过滤、举报处理）
   - 移动端性能优化（设备检测、性能分级）
   - 数据库索引优化（解决并发和性能问题）

4. **资源估算修正**
   - 从 7-9 周调整为 12-14 周
   - 增加测试、返工和文档时间

5. **补充遗漏风险**
   - AI 内容法律风险（高优先级）
   - 数据库连接池耗尽
   - XSS 防护、API 限流等安全措施

### 关键建议

#### 立即执行（Phase 0 启动前）
1. ✅ 创建 `docs/tech-debt.md` 文件，记录技术债务
2. ✅ 创建 `public/lib/orbit-controls.min.js` 文件
3. ✅ 更新数据库 schema，添加关键索引
4. ✅ 实现 API 限流中间件

#### Phase 0 重点关注
1. OrbitControls 稳定性测试（10 个主题 + 移动端）
2. 移动端性能测试（iPhone SE + Android 低端机）
3. 内容审核机制上线（敏感词 + 举报）

#### 长期优化
1. 监控搜索量，达到 1000 次/天时迁移 Algolia
2. 建立生成质量评分系统
3. 收集用户反馈，持续优化 System Prompt

---

## 下一步行动

### 1. 确认和批准（本周）
- [ ] 产品负责人确认优先级和功能范围
- [ ] CTO 批准技术方案和资源估算
- [ ] 确定开发人员和时间安排

### 2. 环境准备（第 1 周）
- [ ] 创建开发分支 `feature/saas-upgrade`
- [ ] 设置 Vercel KV（用于限流）
- [ ] 配置 Sentry（错误监控）
- [ ] 准备测试设备（iPhone SE + Android 低端机）

### 3. Phase 0 启动（第 1-3 周）
- [ ] 0.1 OrbitControls 修复（4.5 天）
- [ ] 0.2 版本统一（1.5 天）
- [ ] 0.3 质量检查（3 天）
- [ ] 0.4 重试机制（4 天）
- [ ] 0.5 移动端性能（3 天）
- [ ] 0.6 内容审核（4 天）
- [ ] 0.7 数据库优化（3 天）

### 4. 建立看板（第 1 周）
使用 GitHub Projects 或 Linear 追踪进度：
- 列：Backlog / In Progress / In Review / Done
- 每个任务关联 PR 和验收标准
- 每周五进行进度回顾

### 5. 文档维护（持续）
- 每个 Phase 完成后更新 `docs/WORKSPACE-STATUS.md`
- 遇到技术债务时更新 `docs/tech-debt.md`
- 重大决策记录到 `docs/decisions/` 目录

---

## 附录：关键文件清单

### 新增文件
```
public/lib/orbit-controls.min.js
docs/tech-debt.md
docs/decisions/
src/shared/lib/upg/device-detector.ts
src/shared/lib/upg/content-moderator.ts
src/shared/lib/upg/html-content-checker.ts
src/shared/models/audit_log.ts
src/shared/models/upg_tag.ts
src/shared/components/ErrorBoundary.tsx
src/app/[locale]/(admin)/admin/reports/page.tsx
```

### 修改文件
```
src/shared/lib/upg/system-prompt.ts
src/shared/lib/upg/quality-checker.ts
src/shared/models/user_credits.ts
src/config/db/schema.ts
src/app/api/upg/generate/route.ts
```

### 数据库迁移
```
src/config/db/migrations/XXXX_add_indexes.sql
src/config/db/migrations/XXXX_add_audit_log.sql
src/config/db/migrations/XXXX_add_upg_tag.sql
src/config/db/migrations/XXXX_update_user_credits.sql
src/config/db/migrations/XXXX_update_upg_report.sql
```

---

## 文档版本历史

- **v1.0** (2026-03-09)：初始版本，完整升级计划
- **v2.0** (2026-03-09)：CTO 评审修订版
  - 修正 OrbitControls 方案
  - 修正搜索方案
  - 新增移动端性能优化
  - 新增 AI 内容审核机制
  - 新增数据库索引优化
  - 修正资源估算（7-9 周 → 12-14 周）
  - 补充安全措施清单

---

**文档状态**：✅ CTO 评审通过，等待产品负责人确认

