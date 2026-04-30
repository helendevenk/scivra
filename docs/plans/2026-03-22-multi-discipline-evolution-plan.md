---
name: multi-discipline-evolution-plan
status: historical-plan
snapshot_date: '2026-03-22'
created: '2026-03-22T09:31:32Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-03-22. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# NeonPhysics → SciViz 多学科演进计划

> **文档版本**: v1.0
> **创建日期**: 2026-03-22
> **触发**: arXiv:2412.07482 对比分析 + 多学科扩展需求
> **决策**: UPG 升级为科学可视化生成器，每学科独立工具，三阶段上线

## 战略概要

### 三阶段路线

| 阶段 | 范围 | 目标 | 前置条件 |
|------|------|------|---------|
| **S1：物理先行** | Physics | 上线 MVP，验证 PMF | 当前 Phase 0-7 完成 |
| **S2：STEM 扩展** | Chemistry + Biology + Math + Earth Science | 学科解耦架构 + 4 个新学科模块 | S1 上线 + 用户反馈 |
| **S3：全学科** | Engineering + CS + Economics + ... | 开放学科模板系统，社区贡献 | S2 验证 + UGC 生态 |

### 品牌演进

| 阶段 | 品牌 | 域名 | 定位 |
|------|------|------|------|
| S1 | NeonPhysics | neonphysics.com | "AI-Powered Interactive Physics Lab" |
| S2 | NeonPhysics → SciViz（或保留） | 待定 | "AI Science Visualization Platform" |
| S3 | SciViz | 待定 | "Create Any Science Experiment with AI" |

> **品牌决策留到 S2 启动时**。S1 阶段不需要改品牌，但架构必须现在就支持多学科。

## 核心架构改造

### 改造原则

1. **S1 就把学科层解耦**，但只实现 Physics 模块
2. **不增加 S1 的开发量**——解耦是重构，不是新功能
3. **数据库已经 ready**——`upgGeneration.category` 字段已存在，只是没接入生成管线
4. **向后兼容**——现有生成结果不受影响

### 架构变化全景

```
当前架构（physics 硬编码）：

generateCore(prompt, language)
  → getSystemPrompt()           ← 400 行，全是物理 + Three.js
  → buildUserPrompt(topic, lang) ← "Create 3D scientific visualization..."
  → callLLM()
  → sanitizeHtml()
  → checkQuality()               ← 18 项检查，物理中性但不够
  → store(category: auto-detect)

目标架构（学科可插拔）：

generateCore(prompt, language, discipline)
  → getDisciplineConfig(discipline)     ← 新增：学科配置注册表
  → getSystemPrompt(discipline)         ← 改造：基础 prompt + 学科 prompt 模块
  → buildUserPrompt(topic, lang, disc)  ← 改造：加学科上下文
  → callLLM()
  → sanitizeHtml()
  → checkQuality(discipline)            ← 改造：基础检查 + 学科验证规则
  → validatePhysics(html)               ← 新增：学科准确性验证（论文启发）
  → store(category: discipline)
```

## S1 阶段：物理先行 + 架构解耦

> S1 = 当前路线图（Phase 0-7）+ 论文 5 个改进 + 学科解耦重构

### S1.A：学科解耦重构（插入现有 Phase 0 之后）

**目标**：把学科相关逻辑从硬编码变成可插拔模块，S1 只实现 Physics 模块。

#### A1. 学科配置注册表

新增 `src/shared/lib/upg/disciplines/` 目录：

```
src/shared/lib/upg/disciplines/
├── index.ts                    ← 注册表：导出所有学科配置
├── types.ts                    ← DisciplineConfig 接口定义
├── physics.ts                  ← 物理学科配置（S1 实现）
├── chemistry.ts                ← 化学（S2 stub）
├── biology.ts                  ← 生物（S2 stub）
├── math.ts                     ← 数学（S2 stub）
└── earth-science.ts            ← 地球科学（S2 stub）
```

**DisciplineConfig 接口**：

```typescript
interface DisciplineConfig {
  id: string;                          // 'physics' | 'chemistry' | ...
  name: { en: string; zh: string };    // 显示名
  icon: string;                        // Lucide icon name
  color: string;                       // CSS 主题色（已有 11 色 in visual-design.ts）

  // Prompt 层
  systemPromptModule: string;          // 学科专属 system prompt 片段
  visualizationHints: string;          // 可视化建议（用 Three.js 的什么模式）
  analyticalSolutions?: string;        // 已知解析解参考（论文启发）
  commonTopics: string[];              // 常见主题（用于 prompt 模板和 UI 推荐）

  // 验证层
  qualityRules?: QualityRule[];        // 学科特有的质量检查规则
  physicsValidation?: ValidationRule[]; // 物理准确性验证规则（论文启发）

  // CDN 层
  additionalCdnLibs?: CdnLib[];       // 学科需要的额外 CDN 库
                                       // 如化学: 3Dmol.js，生物: BioJS

  // 课标层
  curriculumStandards?: CurriculumAlignment[]; // AP/NGSS/IB 对齐
}
```

**开发量**：1.5 天（接口设计 + Physics 配置迁移 + 注册表）

#### A2. System Prompt 分层

当前 `system-prompt.ts` 的 `getSystemPrompt()` 返回一个 400+ 行的字符串。

改造为：

```typescript
export function getSystemPrompt(discipline?: string): string {
  const config = getDisciplineConfig(discipline || 'physics');

  return [
    // === 基础层（学科无关）===
    getOutputFormatRules(),           // 输出格式（raw HTML only）
    getTechStackRules(),              // CDN URLs, 版本号
    getSecurityRules(),               // 黑名单、sandbox
    getPerformanceRules(),            // 设备检测、quality tier

    // === 布局层（学科微调）===
    getLayoutRules(),                 // 5-zone layout（通用）
    config.systemPromptModule,        // 学科特有的布局/内容要求

    // === 可视化层（学科专属）===
    getThreejsCorePrompt(),           // Three.js 基础（通用）
    config.visualizationHints,        // 学科可视化建议
    getThreejsEffectsPrompt(),        // 粒子/轨迹/向量（通用工具箱）
    getInteractionPrompt(),           // 滑块/按钮/Quiz（通用）
    getPostProcessingPrompt(),        // Bloom 等后处理（通用）
    getSvgHybridPrompt(),             // 2D/3D 模式选择（通用）

    // === 学科专属层 ===
    config.analyticalSolutions || '', // 解析解叠加要求（论文启发）
    buildCdnIncludes(config.additionalCdnLibs), // 额外 CDN 库
  ].filter(Boolean).join('\n\n');
}
```

**Physics 模块示例**（从现有 prompt 提取）：

```typescript
// disciplines/physics.ts
export const physicsConfig: DisciplineConfig = {
  id: 'physics',
  name: { en: 'Physics', zh: '物理' },
  icon: 'Atom',
  color: 'oklch(0.50 0.20 250)',    // 学术蓝

  systemPromptModule: `
## Physics-Specific Requirements
- Visualize forces as colored ArrowHelper vectors (red=force, blue=velocity, green=acceleration)
- Always show coordinate axes with labels
- Energy bar chart: kinetic (blue), potential (red), total (green)
- Use real physical constants (g=9.8, c=3e8, etc.)
- Time step capped at 0.05s to prevent physics explosion
- Spring/pendulum: show damping option
- Collisions: show momentum conservation
- Fields: use field lines or gradient colors
`,

  visualizationHints: `
For physics topics, prefer:
- 3D mode: projectile motion, orbital mechanics, EM fields, wave propagation
- SVG mode: circuit diagrams, phase diagrams, energy level diagrams
- Hybrid mode: pendulum (3D animation + energy graph), spring (3D + position/velocity plots)
`,

  analyticalSolutions: `
## Analytical Solution Overlay (IMPORTANT)
When the physical system has a known analytical solution, you MUST:
1. Compute the analytical prediction alongside the numerical simulation
2. Plot both on the same graph with different colors and a legend
3. Label them clearly: "Numerical" vs "Analytical"

Common examples:
- Simple pendulum (small angle): θ(t) = θ₀·cos(√(g/L)·t)
- Free fall: y(t) = y₀ + v₀t - ½gt²
- SHM: x(t) = A·cos(ωt + φ)
- Projectile: parabolic trajectory x(t), y(t)
- RC circuit: V(t) = V₀·e^(-t/RC)

This overlay helps students see where approximations break down.
`,

  commonTopics: [
    'Simple Pendulum', 'Projectile Motion', 'Spring-Mass System',
    'Double Slit Interference', 'Electromagnetic Wave', 'Orbital Mechanics',
    'Lorentz Force', 'DC Circuit', 'Thermodynamic Cycle',
  ],

  // ... qualityRules, physicsValidation, curriculumStandards
};
```

**开发量**：2 天（拆分现有 prompt → 基础层 + 物理层）

#### A3. 生成管线接入 discipline 参数

修改 `generate-core.ts`：

```typescript
// 现有
export async function generateCore(params: {
  prompt: string;
  language: 'zh' | 'en';
  userId: string | null;
  // ...
})

// 改造后
export async function generateCore(params: {
  prompt: string;
  language: 'zh' | 'en';
  userId: string | null;
  discipline?: string;           // 新增，默认 'physics'
  // ...
})
```

调用链修改：
1. `generateCore()` → 接收 `discipline` 参数
2. → `getSystemPrompt(discipline)` → 组装学科 prompt
3. → `buildUserPrompt(topic, lang, discipline)` → 加学科上下文
4. → `checkQuality(html, discipline)` → 学科特有检查
5. → `store({ category: discipline })` → 写入数据库

**前端**：UPG 生成页面加学科选择器（默认 Physics，其他灰色 "Coming Soon"）。

**开发量**：1 天

#### A4. 路由规划（S1 只开 Physics，预留其他）

```
S1 路由（上线时）：
/upg                    → UPG 首页（学科选择入口）
/upg/physics            → 物理生成器（当前 /upg 的内容迁移过来）
/upg/physics/view/[id]  → 查看生成结果
/upg/physics/my         → 我的物理生成

S2 路由（扩展时）：
/upg/chemistry          → 化学生成器
/upg/biology            → 生物生成器
/upg/math               → 数学生成器
/upg/earth-science      → 地球科学生成器

Gallery（S1 就支持学科筛选）：
/gallery                → 全部学科
/gallery?category=physics → 物理筛选（已有 idx_upg_generation_gallery 索引）
```

**重定向**：S1 期间 `/upg` → `/upg/physics`（301），S2 时改为学科选择页。

**开发量**：0.5 天

### S1.B：论文 5 个改进（插入现有 Phase 3 之后）

> 这些改进增强 Physics 模块的质量，但架构设计为学科通用。

#### B1. 物理验证层（🔴 高优先级）

新增 `src/shared/lib/upg/validation/` 目录：

```
src/shared/lib/upg/validation/
├── index.ts                     ← 验证调度器
├── types.ts                     ← ValidationResult 接口
├── technical-validator.ts       ← 技术验证（现有 quality-checker 升级）
└── physics-validator.ts         ← 物理准确性验证（新增）
```

**物理验证规则**：

```typescript
interface PhysicsValidationRule {
  id: string;
  name: string;
  description: string;
  check: (html: string) => ValidationResult;
}

const physicsRules: PhysicsValidationRule[] = [
  {
    id: 'energy-conservation',
    name: 'Energy Conservation Check',
    description: 'Detect if total energy drifts beyond threshold',
    check: (html) => {
      // 检查 HTML 中是否有能量计算逻辑
      // 检查是否有 totalEnergy 变量且变化 < 5%
      // 如果检测到能量系统但无守恒检查 → warning
    }
  },
  {
    id: 'physical-constants',
    name: 'Physical Constants Accuracy',
    description: 'Verify g=9.8, c=3e8, etc. are correct',
    check: (html) => {
      // 正则匹配 g = X，检查 X 是否合理
      // 如果 g=10（近似）→ info
      // 如果 g=98 → error
    }
  },
  {
    id: 'unit-consistency',
    name: 'Unit System Consistency',
    description: 'Check SI units are used consistently',
    check: (html) => {
      // 检查是否混用 CGS 和 SI
    }
  },
  {
    id: 'analytical-overlay',
    name: 'Analytical Solution Present',
    description: 'Check if analytical solution is overlaid when applicable',
    check: (html) => {
      // 检查是否有 "analytical" 或 "theoretical" 标签的图线
    }
  },
  {
    id: 'extreme-parameters',
    name: 'Extreme Parameter Handling',
    description: 'Verify simulation handles edge values gracefully',
    check: (html) => {
      // 检查滑块 min/max 是否合理
      // 检查是否有 NaN/Infinity 防护
    }
  },
];
```

**集成到生成管线**：

```typescript
// generate-core.ts
const qualityResult = checkQuality(html, discipline);
if (!qualityResult.passed) return fail(qualityResult);

const validationResult = validateDiscipline(html, discipline);
// 验证结果不阻断生成，但作为元数据存储
// Pro 用户看到 "Physics Verified ✓" 或 "⚠ Unverified"
```

**数据库扩展**：

```sql
-- upgGeneration 新增字段
validation_score    INTEGER;        -- 0-100 验证得分
validation_details  TEXT;           -- JSON: 各项验证结果
validated_at        TIMESTAMP;      -- 验证时间
```

**UI 展示**：
- Gallery 卡片角标：✓ Verified / ⚠ Unverified
- 详情页：展开验证报告（各项通过/警告/失败）
- 筛选：Gallery 可按 "Verified Only" 筛选

**开发量**：3-4 天

#### B2. 增量式生成策略（🟡 中优先级）

**复杂度检测**：

```typescript
// src/shared/lib/upg/complexity-analyzer.ts
interface ComplexityScore {
  score: number;         // 0-10
  factors: string[];     // 什么因素导致复杂
  strategy: 'single' | 'incremental'; // 建议策略
}

export function analyzeComplexity(prompt: string, discipline: string): ComplexityScore {
  let score = 0;
  const factors: string[] = [];

  // 多物理量（2+ 独立变量）
  if (countPhysicalQuantities(prompt) > 2) { score += 2; factors.push('multiple quantities'); }
  // 3D 多粒子系统
  if (/多粒子|N.body|many.body|集群/i.test(prompt)) { score += 3; factors.push('multi-body'); }
  // 多图表要求
  if (/图表.*图表|graph.*graph|plot.*plot/i.test(prompt)) { score += 1; factors.push('multiple charts'); }
  // 相变/临界现象
  if (/相变|phase.transition|critical/i.test(prompt)) { score += 2; factors.push('phase transition'); }
  // 量子系统
  if (/量子|quantum|波函数|wavefunction/i.test(prompt)) { score += 2; factors.push('quantum'); }

  return {
    score,
    factors,
    strategy: score >= 5 ? 'incremental' : 'single',
  };
}
```

**增量生成流程**：

```
[用户 prompt] → 复杂度分析
  │
  ├── score < 5 → 单轮生成（当前流程，不变）
  │
  └── score >= 5 → 增量生成
       │
       ├── Round 1: 基础场景 + 核心物理方程
       │   → quality check → pass?
       │
       ├── Round 2: 交互控件 + 实时图表
       │   → 在 Round 1 HTML 基础上追加
       │   → quality check → pass?
       │
       └── Round 3: Quiz + 视觉效果 + 解析解叠加
           → 在 Round 2 HTML 基础上追加
           → quality check + physics validation → done
```

**UI**：进度条显示 "Step 1/3: Building core scene..." → "Step 2/3: Adding controls..." → "Step 3/3: Final polish..."

**积分消耗**：增量生成消耗同样的 10 积分（对用户透明，是内部优化）。

**开发量**：2-3 天

#### B3. 对话式迭代修正（🟡 中优先级）

新增 `src/shared/lib/upg/refine-core.ts`：

```typescript
export async function refineGeneration(params: {
  generationId: string;       // 原始生成 ID
  refinementPrompt: string;   // 用户修正指令
  userId: string;
  language: 'zh' | 'en';
}): Promise<RefineResult> {
  // 1. 读取原始 HTML
  const original = await getGeneration(params.generationId);

  // 2. 构建修正 prompt
  const systemPrompt = getRefinementSystemPrompt();
  const userPrompt = `
Here is the existing HTML visualization:

\`\`\`html
${original.htmlContent}
\`\`\`

The user wants the following modification:
"${params.refinementPrompt}"

Output the COMPLETE modified HTML file. Keep everything that works, only change what the user asked for.
`;

  // 3. 调用 LLM（用更低 temperature=0.3，减少随机性）
  // 4. 质量检查 + 物理验证
  // 5. 存储为新版本（version chain）
}
```

**数据库扩展**：

```sql
-- upgGeneration 新增字段
version           INTEGER DEFAULT 1;    -- 版本号
parent_id         TEXT;                 -- 前一版本 ID（版本链）
refinement_prompt TEXT;                 -- 本次修正指令（null = 原始生成）
```

**API**：

```
POST /api/upg/[id]/refine
Body: { prompt: "把球体变大一倍，颜色改成红色" }
Response: { newGenerationId: "xxx", version: 2 }
```

**UI**：
- 查看页底部：输入框 "Tell me what to change..." + "Refine (3 credits)" 按钮
- 版本历史：侧边栏显示 v1 → v2 → v3，可切换查看
- 积分：修正消耗 3 积分（vs 全新生成 10 积分）

**开发量**：3-4 天

#### B4. 解析解叠加（🟢 低优先级）

在 Physics DisciplineConfig 的 `analyticalSolutions` 字段中已包含（见 A2 节）。

额外实现：

```
src/shared/lib/upg/prompt-modules/analytical-solutions.ts
```

内容：常见物理系统的解析解公式表，作为 LLM 参考。LLM 看到后会自动在图表中叠加。

**验证**：在 `physics-validator.ts` 中增加 `analytical-overlay` 检查项（见 B1）。

**开发量**：1 天

#### B5. 教育定位更新（🟢 低优先级）

- Landing Page hero 文案更新（引用 arXiv:2412.07482 作为学术背书）
- SEO blog 文章："`Why AI-Generated Physics Simulations Matter`"
- Gallery 页标题从 "UPG Gallery" → "Science Visualization Gallery"
- 导航栏预留学科图标位置（S1 只亮 Physics）

**开发量**：0.5 天

### S1 修订后的完整 Phase 表

| Phase | 内容 | 工时 | 状态 |
|-------|------|------|------|
| 0 | 核心生成稳定（OrbitControls + 版本统一 + 质量检查 + 预览重试） | 2 周 | 部分完成 |
| **0.5（新增）** | **学科解耦重构（A1-A4）** | **5 天** | 未开始 |
| 1 | 用户系统完善（个人中心 + 配额积分） | 1 周 | 部分完成 |
| 2 | 画廊和社交（画廊 + 评论 + 分享 + 搜索） | 2 周 | 部分完成 |
| 3 | 高级生成选项（学科检测 + SVG 混合 + 自定义） | 2 周 | 未开始 |
| **3.5（新增）** | **论文改进（B1-B5：验证层 + 增量生成 + 对话修正 + 解析解 + 定位）** | **2 周** | 未开始 |
| 4 | 监控增强（Sentry + Analytics） | 1 周 | 未开始 |
| 5 | SEO 增强（sitemap + blog） | 1 周 | 未开始 |
| 6 | E2E 测试 | 1 周 | 未开始 |
| 7 | Vercel Cron | 0.5 周 | 未开始 |
| **总计** | | **~14-16 周** | |

> **注意**：Phase 0.5（学科解耦）必须在 Phase 3（学科检测）之前完成。
> Phase 3.5（论文改进）依赖 Phase 0.5 的架构。

## S2 阶段：STEM 扩展（S1 上线后）

> S2 不需要架构改动，只需实现新的 DisciplineConfig 模块。

### S2 新增学科模块

#### Chemistry（化学）

```typescript
const chemistryConfig: DisciplineConfig = {
  id: 'chemistry',
  name: { en: 'Chemistry', zh: '化学' },
  icon: 'FlaskConical',
  color: 'oklch(0.60 0.20 50)',     // 橙色

  systemPromptModule: `
## Chemistry-Specific Requirements
- Molecular structures: ball-and-stick or space-filling models
- Bond types: single (cylinder), double (parallel cylinders), triple
- Atom colors: CPK convention (C=gray, O=red, N=blue, H=white, S=yellow)
- Reaction animations: show bond breaking/forming with transition states
- Energy diagrams: reactants → transition state → products
- Orbitals: use transparent isosurfaces
`,

  visualizationHints: `
For chemistry topics, prefer:
- 3D mode: molecular geometry, crystal structures, orbital shapes
- SVG mode: reaction energy diagrams, phase diagrams, titration curves
- Hybrid: reaction mechanism (3D molecules + energy diagram)
`,

  additionalCdnLibs: [
    { name: '3Dmol.js', url: 'https://3dmol.org/build/3Dmol-min.js', optional: true },
  ],

  commonTopics: [
    'Water Molecule Geometry', 'Benzene Orbital Structure',
    'SN2 Reaction Mechanism', 'Galvanic Cell', 'Crystal Lattice',
    'Acid-Base Titration', 'Le Chatelier Principle',
  ],
};
```

#### Biology（生物）

```typescript
const biologyConfig: DisciplineConfig = {
  id: 'biology',
  name: { en: 'Biology', zh: '生物' },
  icon: 'Dna',
  color: 'oklch(0.55 0.20 145)',    // 绿色

  systemPromptModule: `
## Biology-Specific Requirements
- Cell structures: use semi-transparent membranes, organelles with distinct colors
- DNA/RNA: double helix with base pair colors (A=red, T=blue, G=green, C=yellow)
- Protein folding: ribbon diagrams, α-helix and β-sheet representations
- Ecosystem: population dynamics with predator-prey graphs
- Neural networks: neuron models with action potential propagation
- Use organic, flowing aesthetics (avoid sharp geometric shapes)
`,

  visualizationHints: `
For biology topics, prefer:
- 3D mode: cell structures, DNA, protein folding, anatomical models
- SVG mode: phylogenetic trees, Punnett squares, population graphs
- Hybrid: neuron (3D model + action potential voltage graph)
`,

  commonTopics: [
    'Cell Division (Mitosis)', 'DNA Replication', 'Photosynthesis',
    'Action Potential', 'Predator-Prey Dynamics', 'Hardy-Weinberg Equilibrium',
    'Enzyme Kinetics', 'Blood Circulation',
  ],
};
```

#### Math（数学）

```typescript
const mathConfig: DisciplineConfig = {
  id: 'math',
  name: { en: 'Mathematics', zh: '数学' },
  icon: 'Sigma',
  color: 'oklch(0.55 0.20 300)',    // 紫色

  systemPromptModule: `
## Mathematics-Specific Requirements
- Prefer SVG/Canvas 2D for most topics (function graphs, geometric constructions)
- Use 3D only for: surfaces, vector fields, solid geometry
- Always show coordinate axes with gridlines
- Interactive: drag points, adjust parameters, see real-time formula updates
- Proof animations: step-by-step geometric constructions
- Color-code related elements (same function = same color family)
- Show exact values where possible (fractions, π, √)
`,

  visualizationHints: `
For math topics, prefer:
- SVG mode (default): function graphs, 2D geometry, number theory
- 3D mode: surfaces (z=f(x,y)), vector calculus, polyhedra
- Hybrid: parametric curves (3D path + parameter-vs-coordinate graphs)
`,

  commonTopics: [
    'Quadratic Functions', 'Trigonometric Identities', 'Derivative Visualization',
    'Integral as Area', 'Matrix Transformations', 'Fourier Series',
    'Fractal Geometry', 'Probability Distributions',
  ],
};
```

#### Earth Science（地球科学）

```typescript
const earthScienceConfig: DisciplineConfig = {
  id: 'earth-science',
  name: { en: 'Earth Science', zh: '地球科学' },
  icon: 'Globe',
  color: 'oklch(0.50 0.15 200)',    // 青蓝色

  systemPromptModule: `
## Earth Science-Specific Requirements
- Geological layers: use cross-section views with color-coded strata
- Atmospheric: temperature/pressure profiles, wind patterns
- Plate tectonics: animate convergent/divergent/transform boundaries
- Water cycle: show evaporation/condensation/precipitation with particle systems
- Celestial: use Bloom effects for stars, emissive materials for the Sun
- Scale labels: show real distances (km, AU) alongside visualization
`,

  commonTopics: [
    'Plate Tectonics', 'Water Cycle', 'Rock Cycle',
    'Atmospheric Layers', 'Solar System Scale', 'Earthquake Waves',
    'Ocean Currents', 'Greenhouse Effect',
  ],
};
```

### S2 开发量预估

| 任务 | 工时 |
|------|------|
| Chemistry 学科模块（prompt + 验证 + 10 模板） | 3-4 天 |
| Biology 学科模块 | 3-4 天 |
| Math 学科模块 | 3-4 天 |
| Earth Science 学科模块 | 3-4 天 |
| UPG 首页学科选择 UI | 1 天 |
| Gallery 学科筛选增强 | 1 天 |
| 各学科 Curated Labs 内容（每学科 10 个起步） | 持续 |
| 学科特有验证规则 | 2 天/学科 |
| **S2 总计** | **~4-5 周** |

## S3 阶段：全学科开放（S2 验证后）

> S3 的关键是**开放学科模板系统**，让社区/教师自己创建学科配置。

### S3 核心功能

1. **学科模板编辑器**（Admin 页面）
   - 教师填写：学科名、可视化建议、常见主题、验证规则
   - 系统自动生成 DisciplineConfig
   - 审核后上线

2. **社区贡献学科**
   - 用户提交学科 prompt 模板 → 社区投票 → 审核上线
   - 参考 PhET 的 "Teacher-Contributed" 机制

3. **扩展方向**
   - Engineering（电路、结构力学、流体）
   - Computer Science（算法可视化、数据结构）
   - Economics（供需曲线、博弈论）
   - Music Theory（波形、和声）

### S3 架构需求

- 学科配置存数据库（不再是代码文件）
- 学科 prompt 模块支持 Markdown 编辑
- 验证规则支持 JSON Schema 定义
- CDN 库白名单管理

> S3 详细设计留到 S2 上线后，根据数据决定。

## 对现有文件的具体修改清单

### S1 Phase 0.5 涉及的文件

| 操作 | 文件 | 改动 |
|------|------|------|
| **新建** | `src/shared/lib/upg/disciplines/types.ts` | DisciplineConfig 接口 |
| **新建** | `src/shared/lib/upg/disciplines/index.ts` | 注册表 + getDisciplineConfig() |
| **新建** | `src/shared/lib/upg/disciplines/physics.ts` | 物理学科配置 |
| **新建** | `src/shared/lib/upg/disciplines/chemistry.ts` | 化学 stub（S2） |
| **新建** | `src/shared/lib/upg/disciplines/biology.ts` | 生物 stub（S2） |
| **新建** | `src/shared/lib/upg/disciplines/math.ts` | 数学 stub（S2） |
| **新建** | `src/shared/lib/upg/disciplines/earth-science.ts` | 地球科学 stub（S2） |
| **修改** | `src/shared/lib/upg/system-prompt.ts` | getSystemPrompt(discipline) 分层 |
| **修改** | `src/shared/lib/upg/generate-core.ts` | 接收 discipline 参数 |
| **修改** | `src/shared/lib/upg/quality-checker.ts` | checkQuality(html, discipline) |
| **修改** | `src/app/api/upg/generate/route.ts` | 传递 discipline 到 generateCore |
| **修改** | UPG 生成页面 | 学科选择器 UI |

### S1 Phase 3.5 涉及的文件

| 操作 | 文件 | 改动 |
|------|------|------|
| **新建** | `src/shared/lib/upg/validation/index.ts` | 验证调度器 |
| **新建** | `src/shared/lib/upg/validation/types.ts` | ValidationResult 接口 |
| **新建** | `src/shared/lib/upg/validation/technical-validator.ts` | 技术验证 |
| **新建** | `src/shared/lib/upg/validation/physics-validator.ts` | 物理验证 |
| **新建** | `src/shared/lib/upg/refine-core.ts` | 迭代修正核心逻辑 |
| **新建** | `src/shared/lib/upg/complexity-analyzer.ts` | 复杂度分析 |
| **新建** | `src/shared/lib/upg/prompt-modules/analytical-solutions.ts` | 解析解参考 |
| **新建** | `src/app/api/upg/[id]/refine/route.ts` | 修正 API |
| **修改** | `src/shared/lib/upg/generate-core.ts` | 增量生成分支 |
| **修改** | `src/shared/lib/upg/constants.ts` | UPG_CREDITS_PER_REFINEMENT = 3 |
| **修改** | `src/config/db/schema.ts` | upgGeneration 新增字段 |
| **修改** | UPG 查看页面 | 修正输入框 + 版本历史 |
| **修改** | Gallery 卡片组件 | Verified 标签 |

## 风险与缓解

| 风险 | 影响 | 缓解 |
|------|------|------|
| 学科解耦增加 S1 工时 | 上线推迟 1 周 | Phase 0.5 控制在 5 天内，只做接口 + physics 实现 |
| 增量生成增加 LLM 调用成本 | 3x token 消耗 | 仅 score>=5 时触发，预估 <10% 的请求 |
| 对话修正产出质量不稳定 | 用户不满意 | temperature=0.3 + 严格 quality check |
| 物理验证误报 | 合格生成被标记 ⚠ | 验证结果不阻断，只做标签展示 |
| S2 学科 prompt 需要领域专家 | 质量不够 | 参考论文方法，先出 MVP 再迭代 |

## 决策记录

| 决策 | 选择 | 替代方案 | 理由 |
|------|------|---------|------|
| S1 就做学科解耦 | ✅ | S2 再做 | 避免 S2 大规模重构，解耦成本低（5 天） |
| 每学科独立路由 | ✅ `/upg/physics` | 统一入口 `/upg?d=physics` | SEO 友好 + 学科品牌感 + 便于独立优化 |
| 物理验证不阻断生成 | ✅ 标签展示 | 不通过则拒绝 | 避免误杀，先积累数据再收紧 |
| 增量生成对用户透明 | ✅ 内部优化 | 让用户选择策略 | 降低认知负担，10 积分不变 |
| 修正消耗 3 积分 | ✅ | 免费/5积分/10积分 | 平衡成本（LLM 输入更多 token）和用户体验 |
| S1 品牌不改 | ✅ NeonPhysics | 立刻改 SciViz | 先跑通 PMF 再考虑品牌升级 |
