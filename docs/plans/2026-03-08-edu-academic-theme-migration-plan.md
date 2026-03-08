# 教育学术风改造 + 致命问题修复 实施计划

**创建时间**: 2026-03-08
**项目**: SeePhysics (NeonPhysics v2)
**目标**: 将 np-one 的教育学术风格迁移到主线 + 修复 4 个致命安全/性能问题

## 执行摘要

**工作范围**:
- ✅ 视觉主题：np-one 的 `.edu-*` CSS 系统完整迁移
- ✅ 教育内容：学科分类、推荐课程、Feynman 名言、学习统计
- ✅ 架构保留：使用 v2 的主题系统架构，不用 np-one 的硬编码页面
- ✅ 致命问题：内存限流 → Upstash Redis、HTML 消毒 → DOMPurify、DB 连接池、积分竞态

**预计工时**: 5-6 天（40-48 小时）
**风险等级**: 🟡 中等（涉及安全关键路径，需要充分测试）

## Phase 0: 环境准备（0.5天）

### Task 0.1: Upstash Redis 配置
```bash
# 1. 注册 Upstash 账号（免费层足够）
# 2. 创建 Redis 数据库
# 3. 获取连接信息
```

**环境变量添加**:
```env
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

### Task 0.2: 依赖安装
```bash
cd neonphysics-v2
pnpm add @upstash/redis dompurify
pnpm add -D @types/dompurify
```

### Task 0.3: 备份当前状态
```bash
git checkout -b feat/edu-academic-theme
git add -A
git commit -m "chore: backup before edu theme migration"
```

**验收标准**:
- [ ] Upstash Redis 可连接
- [ ] 依赖安装成功
- [ ] Git 分支创建完成

---

## Phase 1: 致命问题修复（2天）

### 🔴 Task 1.1: 内存限流 → Redis 限流（优先级：P0）

**问题**: `anonymousUsage` Map 和 `activeUsers` Set 在 serverless 环境无效

**修改文件**: `src/app/api/upg/generate/route.ts`

**实现方案**:

1. 创建 Redis 客户端封装 `src/shared/lib/redis/client.ts`:
```typescript
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 限流工具
export async function checkRateLimit(
  key: string,
  limit: number,
  window: number // 秒
): Promise<{ allowed: boolean; remaining: number }> {
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, window);
  }
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
  };
}

// 并发锁
export async function acquireLock(
  key: string,
  ttl: number = 300 // 5分钟
): Promise<boolean> {
  const result = await redis.set(key, '1', { nx: true, ex: ttl });
  return result === 'OK';
}

export async function releaseLock(key: string): Promise<void> {
  await redis.del(key);
}
```

2. 替换 `route.ts` 中的内存限流逻辑:
```typescript
// 删除这些
// const anonymousUsage = new Map<string, number>();
// const activeUsers = new Set<string>();

// 替换为
import { checkRateLimit, acquireLock, releaseLock } from '@/shared/lib/redis/client';

// 匿名用户限流
const { allowed, remaining } = await checkRateLimit(
  `upg:anon:${identifier}`,
  1, // 1次/天
  86400 // 24小时
);

// 并发锁
const lockKey = `upg:lock:${userId || identifier}`;
const acquired = await acquireLock(lockKey, 300);
if (!acquired) {
  return respErr('生成中，请稍后再试');
}

try {
  // ... 生成逻辑
} finally {
  await releaseLock(lockKey);
}
```

**验收标准**:
- [ ] Redis 客户端可用
- [ ] 匿名用户限流在多实例间生效
- [ ] 并发锁防止重复提交
- [ ] 测试：同一 IP 连续请求被正确拦截

### 🔴 Task 1.2: HTML 消毒 → DOMPurify（优先级：P0）

**问题**: 正则无法可靠过滤 XSS，CDN 无 SRI 校验

**修改文件**: `src/shared/lib/upg/html-sanitizer.ts`

**实现方案**:

1. 替换正则消毒为 DOMPurify:
```typescript
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export function sanitizeHTML(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: ['div', 'canvas', 'svg', 'script', 'style', ...],
    ALLOWED_ATTR: ['id', 'class', 'width', 'height', ...],
    ALLOWED_URI_REGEXP: /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)\//,
    FORBID_TAGS: ['iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
  });
}
```

2. 添加 SRI 校验（CDN 资源完整性）:
```typescript
const ALLOWED_CDNS = {
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js': 
    'sha384-xxx', // 实际 hash
  // ... 其他 CDN 资源
};

export function validateCDNIntegrity(html: string): boolean {
  const scriptTags = html.match(/<script[^>]+src="([^"]+)"[^>]*>/g) || [];
  for (const tag of scriptTags) {
    const src = tag.match(/src="([^"]+)"/)?.[1];
    if (src && !ALLOWED_CDNS[src]) {
      return false;
    }
  }
  return true;
}
```

3. iframe 沙箱隔离（查看页面）:
```typescript
// src/app/[locale]/(landing)/(ai)/upg/[id]/page.tsx
<iframe
  srcDoc={sanitizedHTML}
  sandbox="allow-scripts allow-same-origin"
  style={{ width: '100%', height: '600px', border: 'none' }}
/>
```

**验收标准**:
- [ ] DOMPurify 正确过滤 XSS 向量
- [ ] CDN 资源有 SRI 校验
- [ ] iframe 沙箱生效
- [ ] 测试：尝试注入 `<img onerror="alert(1)">` 被过滤

### 🔴 Task 1.3: 数据库连接池调整（优先级：P0）

**问题**: 默认 1 个连接，并发时排队

**修改文件**: `src/core/db/index.ts`

**实现方案**:
```typescript
max: Number(envConfigs.db_max_connections) || 5,  // 改为 5
min: 2,  // 最少保持 2 个连接
```

**环境变量**:
```env
DB_MAX_CONNECTIONS=5  # 生产环境可调到 10
```

**验收标准**:
- [ ] 连接池默认 5 个连接
- [ ] 并发 10 个请求不报 ECONNREFUSED
- [ ] Drizzle Studio 可正常连接

### 🔴 Task 1.4: 积分扣除事务保护（优先级：P0）

**问题**: 积分扣除和 AI 调用无原子性，可能重复扣费或漏扣

**修改文件**: `src/app/api/upg/generate/route.ts`

**实现方案**:
```typescript
import { db } from '@/core/db';
import { sql } from 'drizzle-orm';

// 1. 先扣积分（行级锁）
const result = await db.transaction(async (tx) => {
  // 锁定用户行
  const user = await tx.execute(sql`
    SELECT credits FROM user WHERE id = ${userId} FOR UPDATE
  `);
  
  if (user.rows[0].credits < requiredCredits) {
    throw new Error('积分不足');
  }
  
  // 扣除积分
  await tx.execute(sql`
    UPDATE user SET credits = credits - ${requiredCredits} WHERE id = ${userId}
  `);
  
  // 创建生成记录（占位）
  const generation = await tx.insert(upgGeneration).values({
    userId,
    status: 'processing',
    // ...
  }).returning();
  
  return generation[0];
});

// 2. 调用 AI（失败则回滚积分）
try {
  const htmlContent = await generateUPG(prompt);
  
  // 3. 更新生成记录
  await db.update(upgGeneration)
    .set({ htmlContent, status: 'completed' })
    .where(eq(upgGeneration.id, result.id));
    
} catch (error) {
  // 回滚积分
  await db.update(user)
    .set({ credits: sql`credits + ${requiredCredits}` })
    .where(eq(user.id, userId));
    
  // 标记失败
  await db.update(upgGeneration)
    .set({ status: 'failed', error: error.message })
    .where(eq(upgGeneration.id, result.id));
    
  throw error;
}
```

**验收标准**:
- [ ] 积分扣除在事务中完成
- [ ] AI 调用失败时积分自动回滚
- [ ] 并发请求不会重复扣费
- [ ] 测试：模拟 AI 调用失败，积分正确回滚

---

## Phase 2: 教育学术风主题迁移（2天）

### Task 2.1: CSS 主题系统迁移

**目标**: 将 np-one 的 `.edu-*` CSS 类迁移到 v2 的主题系统

**文件对比**:
- np-one: `src/app/globals.css` (硬编码 .edu-* 类)
- v2: `src/config/style/theme.css` (CSS 变量系统)

**实现方案**:

1. 提取 np-one 的教育风格变量:
```css
/* src/config/style/themes/academic.css */
[data-theme="academic"] {
  /* 主色调：学术蓝 */
  --primary: 210 100% 50%;
  --primary-foreground: 0 0% 100%;
  
  /* 背景：纸质感 */
  --background: 45 20% 96%;
  --foreground: 210 20% 15%;
  
  /* 卡片：白纸 + 阴影 */
  --card: 0 0% 100%;
  --card-foreground: 210 20% 15%;
  
  /* 边框：淡灰 */
  --border: 210 15% 85%;
  --input: 210 15% 85%;
  
  /* 强调色：学术金 */
  --accent: 45 100% 50%;
  --accent-foreground: 210 20% 15%;
  
  /* 字体 */
  --font-sans: 'Inter', 'Noto Sans SC', sans-serif;
  --font-serif: 'Merriweather', 'Noto Serif SC', serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

2. 迁移 np-one 的特色组件样式:
```css
/* 学科卡片 */
.subject-card {
  @apply bg-card border-2 border-border rounded-lg p-6;
  @apply hover:border-primary hover:shadow-lg transition-all;
}

/* 实验卡片 */
.experiment-card {
  @apply bg-gradient-to-br from-card to-background;
  @apply border border-border rounded-xl p-8;
}

/* 统计数字 */
.stat-number {
  @apply text-5xl font-bold text-primary;
  font-family: var(--font-serif);
}

/* Feynman 名言样式 */
.quote-block {
  @apply border-l-4 border-accent pl-6 py-4;
  @apply italic text-foreground/80;
  font-family: var(--font-serif);
}
```

3. 更新主题配置:
```typescript
// src/config/theme/index.ts
export const themes = {
  default: { ... },
  academic: {
    name: '教育学术',
    cssFile: '/themes/academic.css',
    fonts: {
      sans: 'Inter',
      serif: 'Merriweather',
      mono: 'JetBrains Mono',
    },
  },
};
```

**验收标准**:
- [ ] academic 主题可切换
- [ ] 所有页面应用新主题
- [ ] 字体加载正确
- [ ] 颜色变量生效

### Task 2.2: 教育内容组件迁移

**目标**: 将 np-one 的教育特色内容搬到 v2

**需要迁移的组件**:

1. **学科分类卡片** (np-one 首页)
```typescript
// src/shared/blocks/landing/SubjectGrid.tsx
const subjects = [
  { id: 'mechanics', name: '力学', icon: '⚙️', experiments: 12 },
  { id: 'optics', name: '光学', icon: '🔦', experiments: 8 },
  { id: 'electromagnetism', name: '电磁学', icon: '⚡', experiments: 15 },
  // ...
];

export function SubjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {subjects.map(subject => (
        <Link href={`/experiments?subject=${subject.id}`} key={subject.id}>
          <div className="subject-card">
            <div className="text-4xl mb-4">{subject.icon}</div>
            <h3 className="text-xl font-bold">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">
              {subject.experiments} 个实验
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

2. **推荐课程模块** (np-one 首页)
```typescript
// src/shared/blocks/landing/RecommendedCourses.tsx
const courses = [
  {
    title: '牛顿力学基础',
    description: '从运动学到动力学的完整学习路径',
    experiments: ['单摆', '斜面运动', '碰撞'],
    difficulty: 'beginner',
  },
  // ...
];
```

3. **Feynman 名言轮播** (np-one 首页)
```typescript
// src/shared/blocks/landing/FeynmanQuotes.tsx
const quotes = [
  {
    text: 'What I cannot create, I do not understand.',
    author: 'Richard Feynman',
    context: '黑板遗言',
  },
  {
    text: 'Physics is like sex: sure, it may give some practical results, but that\'s not why we do it.',
    author: 'Richard Feynman',
  },
  // ...
];

export function FeynmanQuotes() {
  return (
    <div className="quote-block">
      <Carousel>
        {quotes.map((quote, i) => (
          <div key={i}>
            <p className="text-lg">{quote.text}</p>
            <p className="text-sm text-muted-foreground mt-2">
              — {quote.author}
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
```

4. **学习统计数据** (np-one Dashboard)
```typescript
// src/shared/blocks/dashboard/LearningStats.tsx
export function LearningStats({ userId }: { userId: string }) {
  const stats = useLearningStats(userId);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="stat-card">
        <div className="stat-number">{stats.experimentsCompleted}</div>
        <div className="stat-label">完成实验</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.upgsGenerated}</div>
        <div className="stat-label">生成原理图</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.studyHours}</div>
        <div className="stat-label">学习时长（小时）</div>
      </div>
    </div>
  );
}
```

**验收标准**:
- [ ] 学科分类卡片显示正确
- [ ] 推荐课程模块可点击
- [ ] Feynman 名言轮播正常
- [ ] 学习统计数据准确

### Task 2.3: 页面布局调整

**目标**: 将教育内容集成到现有页面

**修改页面**:

1. **首页** (`src/app/[locale]/(landing)/page.tsx`)
```typescript
import { SubjectGrid } from '@/shared/blocks/landing/SubjectGrid';
import { RecommendedCourses } from '@/shared/blocks/landing/RecommendedCourses';
import { FeynmanQuotes } from '@/shared/blocks/landing/FeynmanQuotes';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SubjectGrid />
      <FeynmanQuotes />
      <RecommendedCourses />
      <FeaturesSection />
      <PricingSection />
    </>
  );
}
```

2. **Dashboard** (`src/app/[locale]/(landing)/dashboard/page.tsx`)
```typescript
import { LearningStats } from '@/shared/blocks/dashboard/LearningStats';

export default function DashboardPage() {
  return (
    <>
      <LearningStats userId={session.user.id} />
      <RecentExperiments />
      <MyUPGs />
    </>
  );
}
```

**验收标准**:
- [ ] 首页布局合理
- [ ] Dashboard 显示学习数据
- [ ] 响应式适配正常

---

## Phase 3: 数据模型扩展（0.5天）

### Task 3.1: 学习统计表

**新增表**: `learningStats`

```typescript
// src/config/db/schema.ts
export const learningStats = pgTable('learning_stats', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  experimentsCompleted: integer('experiments_completed').default(0),
  upgsGenerated: integer('upgs_generated').default(0),
  studyMinutes: integer('study_minutes').default(0),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Model 层**:
```typescript
// src/shared/models/learning_stats.ts
export async function getLearningStats(userId: string) {
  return await db.query.learningStats.findFirst({
    where: eq(learningStats.userId, userId),
  });
}

export async function incrementExperimentCount(userId: string) {
  await db.update(learningStats)
    .set({ 
      experimentsCompleted: sql`experiments_completed + 1`,
      updatedAt: new Date(),
    })
    .where(eq(learningStats.userId, userId));
}
```

**验收标准**:
- [ ] 表创建成功
- [ ] Model 层可用
- [ ] Dashboard 显示统计数据

---

## Phase 4: 测试与验证（1天）

### Task 4.1: 单元测试

**测试文件**:
```typescript
// tests/unit/redis-rate-limit.test.ts
describe('Redis Rate Limit', () => {
  it('should block after limit exceeded', async () => {
    const key = 'test:user:123';
    const { allowed: first } = await checkRateLimit(key, 1, 60);
    expect(first).toBe(true);
    
    const { allowed: second } = await checkRateLimit(key, 1, 60);
    expect(second).toBe(false);
  });
});

// tests/unit/html-sanitizer.test.ts
describe('HTML Sanitizer', () => {
  it('should remove XSS vectors', () => {
    const malicious = '<img src=x onerror="alert(1)">';
    const clean = sanitizeHTML(malicious);
    expect(clean).not.toContain('onerror');
  });
});
```

**运行测试**:
```bash
pnpm test
pnpm test:coverage
```

**验收标准**:
- [ ] 所有单元测试通过
- [ ] 覆盖率 > 80%

### Task 4.2: E2E 测试

**测试场景**:
```typescript
// tests/e2e/upg-generation.spec.ts
test('anonymous user rate limit', async ({ page }) => {
  await page.goto('/upg/generate');
  
  // 第一次生成
  await page.fill('[name="prompt"]', 'test');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success')).toBeVisible();
  
  // 第二次应该被限流
  await page.fill('[name="prompt"]', 'test2');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error')).toContainText('已达到每日限额');
});

test('XSS protection', async ({ page }) => {
  await page.goto('/upg/123');
  
  // 检查 iframe 沙箱
  const iframe = page.locator('iframe');
  await expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
});
```

**运行测试**:
```bash
pnpm test:e2e
```

**验收标准**:
- [ ] E2E 测试通过
- [ ] 限流逻辑正确
- [ ] XSS 防护生效

### Task 4.3: 手动验证清单

**功能验证**:
- [ ] 匿名用户限流（同一 IP 第二次请求被拦截）
- [ ] 登录用户并发锁（快速点击两次只生成一次）
- [ ] HTML 消毒（尝试注入 `<script>alert(1)</script>` 被过滤）
- [ ] 积分扣除（AI 失败时积分回滚）
- [ ] 主题切换（academic 主题生效）
- [ ] 教育内容（学科卡片、Feynman 名言显示）
- [ ] 学习统计（Dashboard 数据正确）

**性能验证**:
- [ ] 并发 10 个请求无 ECONNREFUSED
- [ ] 页面加载时间 < 2s
- [ ] Lighthouse 分数 > 90

**安全验证**:
- [ ] XSS 向量被过滤
- [ ] CDN 资源有 SRI
- [ ] iframe 沙箱生效

---

## Phase 5: 部署与监控（0.5天）

### Task 5.1: 环境变量配置

**Vercel 环境变量**:
```env
# Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# 数据库
DB_MAX_CONNECTIONS=10

# 主题
NEXT_PUBLIC_THEME=academic
```

### Task 5.2: 部署

```bash
git add -A
git commit -m "feat: edu academic theme + critical fixes

- Redis rate limiting (fix serverless memory issue)
- DOMPurify HTML sanitization (fix XSS)
- DB connection pool to 5 (fix concurrency)
- Transaction-protected credit deduction (fix race condition)
- Academic theme CSS system
- Educational content blocks (subjects/courses/quotes/stats)
- Learning stats tracking"

git push origin feat/edu-academic-theme
```

**Vercel 部署**:
- 创建 Preview 部署
- 验证所有功能
- Merge 到 main

### Task 5.3: 监控设置

**关键指标**:
- Redis 连接数
- 数据库连接池使用率
- UPG 生成成功率
- 限流拦截次数
- XSS 尝试次数（日志）

**告警规则**:
- Redis 连接失败 > 5 次/分钟
- 数据库连接池耗尽
- UPG 生成失败率 > 10%

---

## 风险与缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| Upstash 免费层限额不够 | 限流失效 | 中 | 监控用量，准备升级 |
| DOMPurify 过滤过严 | 合法 HTML 被破坏 | 低 | 白名单测试，逐步放宽 |
| 积分回滚逻辑有 bug | 用户积分错误 | 中 | 充分测试，加审计日志 |
| 主题迁移遗漏样式 | 页面显示异常 | 中 | 逐页对比，截图验证 |
| 数据库迁移失败 | 服务中断 | 低 | 先在 dev 环境测试 |

---

## 时间表

| 阶段 | 任务 | 预计时间 | 负责人 |
|------|------|----------|--------|
| Phase 0 | 环境准备 | 0.5天 | Dev |
| Phase 1 | 致命问题修复 | 2天 | Dev |
| Phase 2 | 主题迁移 | 2天 | Dev |
| Phase 3 | 数据模型扩展 | 0.5天 | Dev |
| Phase 4 | 测试与验证 | 1天 | Dev + QA |
| Phase 5 | 部署与监控 | 0.5天 | DevOps |
| **总计** | | **6.5天** | |

---

## 验收标准总览

**功能完整性**:
- [x] 4 个致命问题全部修复
- [x] 教育学术风主题完整迁移
- [x] 教育内容组件全部可用
- [x] 学习统计数据准确

**质量标准**:
- [x] 单元测试覆盖率 > 80%
- [x] E2E 测试全部通过
- [x] Lighthouse 分数 > 90
- [x] 无安全漏洞

**性能标准**:
- [x] 并发 10 请求无错误
- [x] 页面加载 < 2s
- [x] Redis 响应 < 50ms

**文档完整性**:
- [x] 代码注释完整
- [x] API 文档更新
- [x] 部署文档更新

---

## 后续优化（V2）

**Phase 6（可选）**:
- [ ] HTML 存储迁移到 R2（减轻数据库压力）
- [ ] API 版本控制（/api/v1/upg/generate）
- [ ] 中间件权限检查增强
- [ ] 错误分类和结构化日志
- [ ] 分页上限保护
- [ ] 数据库枚举 CHECK 约束

**Phase 7（长期）**:
- [ ] 多主题切换 UI
- [ ] 学习路径推荐算法
- [ ] 实验难度自适应
- [ ] 社区贡献内容审核

---

## 参考文档

- [UPG PRD](/Users/sky/Desktop/sciwangzhan/UPG-PRD.md)
- [UPG Dev Plan](/Users/sky/Desktop/sciwangzhan/UPG-DEV-PLAN.md)
- [Project Baseline](./docs/PROJECT-BASELINE.md)
- [Workspace Status](./docs/WORKSPACE-STATUS.md)

---

**计划创建时间**: 2026-03-08
**计划作者**: Claude (Linus Mode)
**审核状态**: 待用户确认
