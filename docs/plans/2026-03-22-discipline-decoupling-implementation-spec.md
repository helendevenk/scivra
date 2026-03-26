---
name: discipline-decoupling-implementation-spec
status: complete
created: 2026-03-22T09:31:32Z
updated: 2026-03-26T03:18:04Z
---

# 学科解耦 + 论文改进 详细实施规格

> **前置文档**: `2026-03-22-multi-discipline-evolution-plan.md`（战略方案）
> **CTO 评审**: `2026-03-22-discipline-decoupling-cto-review.md`（APPROVED WITH CHANGES）
> **本文档**: 行级别实施规格，已根据 CTO 评审修订
> **影响范围**: Phase 0.5（学科解耦）+ Phase 3.5（论文 5 改进）
> **基线代码**: 截至 2026-03-22 的 neonphysics-v2 主分支
>
> **CTO 评审修订记录**:
> - C1: 新增 A0 任务 — route.ts 迁移为使用 generateCore()（消除双代码路径）
> - C2: A10 回归测试增加强制 prompt snapshot 对比
> - C3: Refine API 增加 moderation + 限流 + 分布式锁
> - 修正代码准确性：extraFields 类型、model 函数、consumeCredits API、索引声明
> - 工时从 15 天修正为 20 天（+33%）

## 第一部分：Phase 0.5 — 学科解耦重构

### 1.0 前置任务：route.ts 迁移到 generateCore()（CTO Critical #1）

**问题**: 当前 `/api/upg/generate/route.ts`（line 104-146）有独立的内联生成逻辑，直接调用 `callOpenRouter`/`callAnthropic`，**绑过 `generateCore()`**。如果只在 `generateCore()` 中接入 discipline 参数，用户实际请求走的是 route.ts 内联路径，discipline 等于没传。

**修改文件**: `src/app/api/upg/generate/route.ts`

**改造方案**: 将 route.ts 的内联 AI 调用逻辑迁移到 `generateCore()`，route.ts 只负责：
1. 请求解析 + 验证
2. 鉴权（匿名/登录）
3. Redis 限流 + 分布式锁
4. 调用 `generateCore()`
5. 积分扣除 + 配额更新
6. 错误处理 + 锁释放

```typescript
// route.ts 改造后的核心逻辑（伪代码）
export async function POST(req: NextRequest) {
  // 1. Parse & validate (保留现有)
  const { prompt, language, discipline = 'physics', isRegenerate } = body;

  // 2. Auth (保留现有)
  // 3. Rate limiting + Redis lock (保留现有)

  // 4. 调用 generateCore（替代现有内联 AI 调用）
  const result = await generateCore({
    prompt,
    language,
    discipline,
    userId: user?.id ?? null,
  });

  if (!result.success) {
    return respErr(result.error);
  }

  // 5. Credits + quota (保留现有)
  // 6. Return success
}
```

**关键点**:
- `generateCore()` 接管 AI 调用 + sanitize + quality check + output moderation + DB 写入
- route.ts 保留 auth + rate limiting + credits + lock（这些是 HTTP 层关注点，不属于核心管线）
- `generateCore()` 的 `existingGenerationId` 参数用于区分新建 vs fork
- 此迁移必须在 Phase 0.5 其他任务之前完成（其他任务依赖 discipline 通过 generateCore 传递）

**验收标准**:
- route.ts 不再直接调用 `callOpenRouter`/`callAnthropic`
- 现有 10 个主题生成质量不回归
- fork 流程正常（`/api/gallery/[id]/fork` 也使用 generateCore）
- TypeScript 编译零错误

**开发量**: 1 天

### 1.1 学科配置类型系统

**新建文件**: `src/shared/lib/upg/disciplines/types.ts`

```typescript
// ============================================================
// DisciplineConfig — 学科可插拔配置接口
// ============================================================

/** CDN 库定义 */
export interface CdnLib {
  name: string;
  url: string;
  /** 是否可选（optional=true 时生成的 HTML 可以不引用） */
  optional: boolean;
  /** 全局变量名，用于质量检查验证 */
  globalName?: string;
}

/** 学科质量检查规则 */
export interface DisciplineQualityRule {
  id: string;
  description: string;
  /** 'error' 阻断生成, 'warning' 仅标记 */
  severity: 'error' | 'warning';
  /** 正则或函数检查 */
  check: (html: string) => { passed: boolean; message?: string };
}

/** 物理准确性验证规则（Phase 3.5 使用） */
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  /** 检查函数，同步返回 0-100 分（CTO: S1 保持同步，不用 async） */
  validate: (html: string) => ValidationResult;
}
// 注意：S2 若需要异步验证（如 headless browser），另增 AsyncValidationRule 类型

export interface ValidationResult {
  score: number;           // 0-100
  passed: boolean;         // score >= threshold
  details: string;         // 人类可读的验证说明
}

/** 课标对齐 */
export interface CurriculumAlignment {
  standard: string;        // 'AP_PHYSICS_1' | 'NGSS' | 'IB' | ...
  topics: string[];        // 对齐的课标主题
}

/** 学科配置主接口 */
export interface DisciplineConfig {
  /** 唯一标识，对应 DB category 字段 */
  id: string;
  /** 显示名 */
  name: { en: string; zh: string };
  /** Lucide icon name */
  icon: string;
  /** 主题色 oklch 值（用于 badge、图表等编程场景） */
  themeColor: string;
  /** CSS 渐变（用于 UI 卡片头部等视觉场景） */
  cssGradient: string;

  // === Prompt 层 ===
  /** 学科专属 system prompt 片段，注入到基础 prompt 之后 */
  systemPromptModule: string;
  /** 可视化模式建议（3D/SVG/Hybrid 选择指导） */
  visualizationHints: string;
  /** 解析解参考（告知 LLM 常见解析解公式，要求叠加显示） */
  analyticalSolutions: string;
  /** 常见主题列表，用于 UI 推荐和 prompt 模板 */
  commonTopics: Array<{
    en: string;
    zh: string;
    complexity: 'low' | 'medium' | 'high';
  }>;

  // === 验证层 ===
  /** 学科特有质量检查规则（叠加到通用规则之上） */
  qualityRules: DisciplineQualityRule[];
  /** 物理准确性验证规则（Phase 3.5） */
  validationRules: ValidationRule[];
  /** 验证通过阈值（0-100，默认 60） */
  validationThreshold: number;

  // === CDN 层 ===
  /** 学科需要的额外 CDN 库 */
  additionalCdnLibs: CdnLib[];

  // === 课标层 ===
  /** 课标对齐（可选） */
  curriculumStandards: CurriculumAlignment[];

  // === 状态 ===
  /** 是否已启用（S1 只有 physics 为 true） */
  enabled: boolean;
  /** 上线阶段 */
  stage: 'S1' | 'S2' | 'S3';
}
```

**设计决策**:
- `systemPromptModule` 是纯字符串，不是函数 — 保持序列化简单，未来可存数据库（S3 社区贡献）
- `qualityRules` 和 `validationRules` 分离 — quality 决定生成是否通过，validation 只打标签
- `enabled` 字段控制 UI 显示，未启用的学科显示 "Coming Soon"

### 1.2 学科注册表

**新建文件**: `src/shared/lib/upg/disciplines/index.ts`

```typescript
import type { DisciplineConfig } from './types';
import { physicsConfig } from './physics';
import { chemistryConfig } from './chemistry';
import { biologyConfig } from './biology';
import { mathConfig } from './math';
import { earthScienceConfig } from './earth-science';

/** 所有学科配置注册表 */
const DISCIPLINE_REGISTRY: Record<string, DisciplineConfig> = {
  physics: physicsConfig,
  chemistry: chemistryConfig,
  biology: biologyConfig,
  math: mathConfig,
  'earth-science': earthScienceConfig,
};

/**
 * 获取学科配置，默认返回 physics
 * @throws 永远不会抛异常，未知学科回退到 physics
 */
export function getDisciplineConfig(id?: string): DisciplineConfig {
  if (!id) return DISCIPLINE_REGISTRY.physics;
  return DISCIPLINE_REGISTRY[id] ?? DISCIPLINE_REGISTRY.physics;
}

/** 获取所有已启用的学科（用于 UI 渲染） */
export function getEnabledDisciplines(): DisciplineConfig[] {
  return Object.values(DISCIPLINE_REGISTRY).filter((d) => d.enabled);
}

/** 获取所有学科（包括未启用的，用于 UI 显示 Coming Soon） */
export function getAllDisciplines(): DisciplineConfig[] {
  return Object.values(DISCIPLINE_REGISTRY);
}

/** 验证学科 ID 是否有效 */
export function isValidDiscipline(id: string): boolean {
  return id in DISCIPLINE_REGISTRY;
}

export type { DisciplineConfig } from './types';
```

### 1.3 Physics 学科配置

**新建文件**: `src/shared/lib/upg/disciplines/physics.ts`

> 这是 S1 唯一完整实现的学科模块。内容从现有 system-prompt.ts 和 prompt-modules 中提取物理特有部分。

```typescript
import type { DisciplineConfig } from './types';

export const physicsConfig: DisciplineConfig = {
  id: 'physics',
  name: { en: 'Physics', zh: '物理' },
  icon: 'Atom',
  themeColor: 'oklch(0.50 0.20 250)',  // 学术蓝
  cssGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  enabled: true,
  stage: 'S1',

  systemPromptModule: `
## Physics-Specific Visualization Requirements

### Force & Motion Visualization
- Forces: Use ArrowHelper — red for force, blue for velocity, green for acceleration
- Always show coordinate axes with SI unit labels
- Trajectories: Use trail lines (circular buffer, MAX_TRAIL=500)
- Collision: Show momentum vectors before/after, display conservation check

### Energy Visualization
- Energy bar chart: kinetic (blue), potential (red), total (green dashed line)
- Total energy should remain constant in conservative systems (visual validation)
- Show energy transfer animations (e.g., potential↔kinetic in pendulum)

### Field Visualization
- Electric/magnetic fields: Use field lines (ArrowHelper array) or color gradient
- Gravitational fields: Use gradient sphere or equipotential contours
- Wave fields: Use displaced mesh or animated sine surface

### Physical Constants
- Use SI units throughout: g=9.81 m/s², c=3×10⁸ m/s, e=1.6×10⁻¹⁹ C
- Display constants in the formula panel with labels
- If user adjusts g (e.g., for Moon/Mars), show planet label

### Numerical Methods
- Default: Velocity Verlet (good energy conservation)
- Complex systems: RK4 (Runge-Kutta 4th order)
- Time step: adaptive or capped at dt=0.02s to prevent explosion
- Tab-switch protection: if dt > 0.1s after resume, reset to 0.02s
`,

  visualizationHints: `
### Physics Visualization Mode Selection
- **3D mode** (default): projectile motion, orbital mechanics, EM fields, wave propagation,
  pendulum, spring-mass, collisions, rigid body rotation
- **SVG mode**: circuit diagrams, phase space plots, energy level diagrams,
  P-V diagrams, free body diagrams
- **Hybrid mode**: pendulum (3D + energy graph), spring (3D + x(t)/v(t) plots),
  wave (3D surface + intensity cross-section), circuits (SVG schematic + V/I graphs)
`,

  analyticalSolutions: `
## Analytical Solution Overlay (MANDATORY for Physics)

When the physical system has a known closed-form solution, you MUST:
1. Compute the analytical prediction alongside the numerical simulation
2. Plot BOTH on the same graph — "Numerical" (solid line) vs "Analytical" (dashed line)
3. Include a legend distinguishing them
4. Use different colors (numerical: primary blue, analytical: orange dashed)

### Reference Solutions (use when applicable):

| System | Analytical Solution | Valid Range |
|--------|-------------------|-------------|
| Simple Pendulum | θ(t) = θ₀·cos(√(g/L)·t) + (ω₀/√(g/L))·sin(√(g/L)·t) | Small angle (θ < 15°) |
| Free Fall | y(t) = y₀ + v₀t - ½gt² | No air resistance |
| SHM (spring) | x(t) = A·cos(ωt + φ), ω = √(k/m) | Linear spring |
| Projectile | x = v₀cos(θ)t, y = v₀sin(θ)t - ½gt² | No drag |
| RC Circuit | V(t) = V₀·(1 - e^(-t/RC)) charging, V₀·e^(-t/RC) discharging | Ideal components |
| Damped Oscillation | x(t) = A·e^(-γt)·cos(ωdt + φ) | Underdamped |
| Kepler Orbit | T² = (4π²/GM)·a³ | Two-body |

This overlay helps students discover where approximations break down
(e.g., small-angle approximation fails above ~15°).
`,

  commonTopics: [
    { en: 'Simple Pendulum', zh: '简单摆', complexity: 'low' },
    { en: 'Projectile Motion', zh: '抛体运动', complexity: 'low' },
    { en: 'Spring-Mass System', zh: '弹簧-质量系统', complexity: 'low' },
    { en: 'Inclined Plane with Friction', zh: '有摩擦力的斜面', complexity: 'low' },
    { en: 'Free Fall with Air Resistance', zh: '有空气阻力的自由落体', complexity: 'medium' },
    { en: 'Double Pendulum (Chaos)', zh: '双摆（混沌）', complexity: 'high' },
    { en: 'Electromagnetic Wave', zh: '电磁波', complexity: 'medium' },
    { en: 'Lorentz Force on Charged Particle', zh: '带电粒子洛伦兹力', complexity: 'medium' },
    { en: 'DC Circuit (Ohm\'s Law)', zh: '直流电路（欧姆定律）', complexity: 'medium' },
    { en: 'Wave Interference (Double Slit)', zh: '波的干涉（双缝）', complexity: 'medium' },
    { en: 'Orbital Mechanics', zh: '轨道力学', complexity: 'high' },
    { en: 'Ising Model Phase Transition', zh: 'Ising模型相变', complexity: 'high' },
    { en: '2D Random Walk / Brownian Motion', zh: '二维随机行走/布朗运动', complexity: 'medium' },
    { en: 'Thermodynamic Cycle (Carnot)', zh: '热力学循环（卡诺）', complexity: 'high' },
    { en: 'Standing Waves on a String', zh: '弦上驻波', complexity: 'low' },
    { en: 'Coulomb\'s Law', zh: '库仑定律', complexity: 'medium' },          // CTO: AP Physics 2 补充
    { en: 'Faraday\'s Law of Induction', zh: '法拉第电磁感应', complexity: 'medium' }, // CTO: AP Physics 2 补充
  ],

  qualityRules: [
    {
      id: 'physics-has-units',
      description: 'Physics simulation must display units (m, kg, s, N, J, etc.)',
      severity: 'warning',
      check: (html) => {
        const unitPatterns = /\b(m\/s|kg|N|J|W|Pa|Hz|rad|°|m²|m³)\b/;
        return {
          passed: unitPatterns.test(html),
          message: 'No SI unit labels detected in HTML',
        };
      },
    },
    {
      id: 'physics-has-formula',
      description: 'Must contain at least one physics formula (KaTeX rendered)',
      severity: 'warning',
      check: (html) => {
        // 检查 KaTeX 渲染调用或内联公式标记
        const hasKatex = /katex\.render|\\frac|\\vec|\\sum|\\int|\\Delta/.test(html);
        return {
          passed: hasKatex,
          message: 'No KaTeX physics formulas detected',
        };
      },
    },
  ],

  // Phase 3.5 实现，S1 先留空数组
  validationRules: [],
  validationThreshold: 60,

  additionalCdnLibs: [],

  curriculumStandards: [
    {
      standard: 'AP_PHYSICS_1',
      topics: [
        'Kinematics', 'Dynamics', 'Circular Motion', 'Energy',
        'Momentum', 'Simple Harmonic Motion', 'Torque', 'Waves',
      ],
    },
    {
      standard: 'AP_PHYSICS_2',
      topics: [
        'Fluids', 'Thermodynamics', 'Electric Force/Field/Potential',
        'DC Circuits', 'Magnetism', 'EM Induction', 'Optics',
        'Quantum/Atomic/Nuclear',
      ],
    },
    {
      standard: 'NGSS',
      topics: [
        'PS2: Motion and Stability', 'PS3: Energy',
        'PS4: Waves', 'PS1: Matter',
      ],
    },
  ],
};
```

### 1.4 其他学科 Stub 文件

**新建文件**: `src/shared/lib/upg/disciplines/chemistry.ts`（示例，其余类似）

```typescript
import type { DisciplineConfig } from './types';

export const chemistryConfig: DisciplineConfig = {
  id: 'chemistry',
  name: { en: 'Chemistry', zh: '化学' },
  icon: 'FlaskConical',
  themeColor: 'oklch(0.60 0.20 50)',   // 橙色
  cssGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  enabled: false,       // S2 启用
  stage: 'S2',

  systemPromptModule: `
## Chemistry-Specific Requirements (S2 — Not Yet Active)
- Molecular structures: ball-and-stick or space-filling models
- Atom colors: CPK convention (C=dark gray, O=red, N=blue, H=white, S=yellow, Cl=green)
- Bond visualization: single (cylinder), double (parallel), triple (three cylinders)
- Reaction animations: bond breaking/forming with transition state
- Energy diagrams: reactants → TS → products with activation energy labeled
- Orbital shapes: s/p/d as transparent isosurfaces
`,

  visualizationHints: `
- 3D mode: molecular geometry, crystal lattice, orbital shapes
- SVG mode: reaction energy diagrams, phase diagrams, titration curves
- Hybrid: reaction mechanism (3D molecules + energy profile)
`,

  analyticalSolutions: `
- Ideal gas: PV = nRT
- Arrhenius: k = A·e^(-Ea/RT)
- Beer-Lambert: A = εlc
- Nernst: E = E° - (RT/nF)·ln(Q)
`,

  commonTopics: [
    { en: 'Water Molecule Geometry', zh: '水分子几何构型', complexity: 'low' },
    { en: 'Benzene Orbital Structure', zh: '苯的轨道结构', complexity: 'medium' },
    { en: 'SN2 Reaction Mechanism', zh: 'SN2反应机理', complexity: 'high' },
  ],

  qualityRules: [],
  validationRules: [],
  validationThreshold: 60,
  additionalCdnLibs: [],
  curriculumStandards: [],
};
```

> Biology、Math、Earth-Science stub 文件结构相同，`enabled: false, stage: 'S2'`。
> 每个 stub < 50 行，只填 name/icon/gradient/systemPromptModule 骨架。

### 1.5 System Prompt 分层改造

**修改文件**: `src/shared/lib/upg/system-prompt.ts`

**当前结构**（~100 行）:
```
getSystemPrompt() → 固定基础 prompt + 6 个 prompt module 拼接
buildUserPrompt(topic, language) → "Create interactive 3D..."
```

**改造后**:

```typescript
import { getDisciplineConfig } from './disciplines';
import type { DisciplineConfig } from './disciplines/types';
// ... 现有 prompt module imports 不变

/**
 * 组装完整 System Prompt
 * @param discipline 学科 ID，默认 'physics'
 */
export function getSystemPrompt(discipline?: string): string {
  const config = getDisciplineConfig(discipline);

  return [
    // ====== 基础层（学科无关，现有内容不变）======
    buildIdentityBlock(),
    buildOutputFormatBlock(),
    buildTechStackBlock(config),        // 注入学科额外 CDN
    buildAntiBlackScreenBlock(),
    buildPerformanceBlock(),
    buildContentStructureBlock(),
    buildSecurityBlock(),
    buildCodeQualityBlock(),

    // ====== 可视化工具箱（通用，现有 prompt modules）======
    getThreejsCorePrompt(),
    getVisualDesignPrompt(),
    getThreejsEffectsPrompt(),
    getPostProcessingPrompt(),
    getSvgHybridPrompt(),
    getInteractionPrompt(),
    getAutopilotDomPrompt(),

    // ====== 学科专属层（从 DisciplineConfig 注入）======
    config.systemPromptModule,
    config.visualizationHints,
    config.analyticalSolutions,
  ].filter(Boolean).join('\n\n');
}

/**
 * 构建 tech stack 块，注入学科额外 CDN
 */
function buildTechStackBlock(config: DisciplineConfig): string {
  const baseCdns = `
## TECHNOLOGY STACK (CDN-only, ZERO npm imports)
- Three.js r134: <script src="${THREEJS_CDN_URL}"></script>
- OrbitControls: <script src="${ORBIT_CONTROLS_CDN_URL}"></script>
- KaTeX 0.16.9: <link> + <script> + auto-render
`;
  if (config.additionalCdnLibs.length === 0) return baseCdns;

  const extraCdns = config.additionalCdnLibs
    .map((lib) => `- ${lib.name}: <script src="${lib.url}"></script>${lib.optional ? ' (optional)' : ''}`)
    .join('\n');

  return `${baseCdns}\n### Additional Libraries for ${config.name.en}:\n${extraCdns}`;
}

// buildIdentityBlock, buildOutputFormatBlock 等函数
// = 把当前 getSystemPrompt() 的各段落拆成独立函数
// 内容 100% 保持不变，只是从一个大字符串拆成多个函数

// CTO 修正 1: THREEJS_CDN_URL / ORBIT_CONTROLS_CDN_URL 当前不存在为独立常量
// 需要从 @/config/lib-versions.ts 导出具体 URL 字符串（当前只导出 UPG_CDN_WHITELIST 数组）
// 实施时：在 lib-versions.ts 新增 THREEJS_CDN_URL, ORBIT_CONTROLS_CDN_URL, KATEX_CDN_URL 常量

// CTO 修正 2: getAutopilotDomPrompt() 属于通用工具（DOM 操作辅助），非物理特有
// 保持在可视化工具箱层，位于学科专属层之前，这个排序是 intentional 的

/**
 * 组装 User Prompt
 * @param topic 用户输入的主题
 * @param language 语言
 * @param discipline 学科 ID
 */
export function buildUserPrompt(
  topic: string,
  language: 'zh' | 'en',
  discipline?: string
): string {
  const config = getDisciplineConfig(discipline);
  const langInstruction = language === 'zh'
    ? 'All text content ... must be in Chinese (简体中文)'
    : 'All text content ... must be in English';

  const disciplineContext = `This is a ${config.name.en} visualization.`;

  return `
Create an interactive 3D scientific visualization about: "${topic}"

${disciplineContext}
${langInstruction}

Requirements:
- 3D scene must directly visualize the core concept using Three.js patterns
- Select appropriate render mode: pure 3D / SVG / hybrid based on the topic
- Sliders must control parameters and update 3D + vectors + formulas simultaneously
- Include ArrowHelper vectors and particle trails where applicable
- Use InstancedMesh if > 50 identical objects
`.trim();
}
```

**关键改动点**:
1. `getSystemPrompt()` 增加 `discipline` 参数
2. `buildUserPrompt()` 增加 `discipline` 参数
3. 基础 prompt 内容**零修改**，只是从大字符串拆成函数
4. 学科专属内容追加到末尾（不干扰现有生成质量）

**验收标准**:
- 不传 discipline 参数 → 行为与当前 100% 一致
- 传 `discipline='physics'` → 行为与当前一致 + 追加物理专属 prompt
- TypeScript 编译零错误

### 1.6 生成管线接入 discipline

**修改文件**: `src/shared/lib/upg/generate-core.ts`

**当前 `GenerateCoreParams` 接口**（约 line 24-41）:

```typescript
export interface GenerateCoreParams {
  prompt: string;
  language: 'zh' | 'en';
  userId: string | null;
  existingGenerationId?: string;
  extraFields?: Partial<NewUpgGeneration>;  // CTO 修正：实际类型是 Partial<NewUpgGeneration>
}
```

> **CTO 注**: 原 spec 中 `model?: string` 和 `Record<string, unknown>` 与实际代码不符。
> `model` 当前不在接口中（通过 `selectModel()` 内部决定）。
> `extraFields` 实际类型是 `Partial<NewUpgGeneration>`，不是 `Record<string, unknown>`。

**改造后**:

```typescript
export interface GenerateCoreParams {
  prompt: string;
  language: 'zh' | 'en';
  userId: string | null;
  discipline?: string;                        // 新增，默认 'physics'
  existingGenerationId?: string;
  extraFields?: Partial<NewUpgGeneration>;    // 保持原类型
}
```

**冲突处理**: 如果 `extraFields.category` 与 `discipline` 同时存在，`discipline` 优先。在 `generateCore()` 内部 spread 前剥离 `extraFields.category`:

```typescript
const { category: _ignored, ...safeExtraFields } = extraFields ?? {};
```

**`generateCore()` 函数内部改动**（3 处）:

```typescript
export async function generateCore(params: GenerateCoreParams): Promise<GenerateCoreResult> {
  const {
    prompt, language, userId,
    discipline = 'physics',     // 默认值
    model, existingGenerationId, extraFields,
  } = params;

  // ... Phase 0: Input moderation（不变）

  // Phase 1: AI Generation — 改动 1: 传递 discipline
  const selectedModel = model || selectModel();
  const systemPrompt = getSystemPrompt(discipline);                    // ← 改动
  const userPrompt = buildUserPrompt(prompt, language, discipline);    // ← 改动

  // ... callOpenRouter/callAnthropic（不变）

  // Phase 2: Post-processing — 改动 2: 传递 discipline 到质量检查
  const sanitized = sanitizeHtml(rawHtml);
  const injected = injectPerformanceCode(sanitized.sanitized);
  const quality = checkQuality(injected, discipline);                  // ← 改动

  // ... Phase 0.6: Output moderation（不变）

  // Phase 3: Success — 改动 3: 写入 category
  const successData = {
    ...baseData,
    category: discipline,                                              // ← 改动（之前是 undefined）
    htmlContent: injected,
    status: 'completed',
    // ...
  };
}
```

**总改动量**: 5 行代码变更 + 1 行 import + extraFields 冲突处理。

> **前置条件**: 1.0 节的 route.ts 迁移必须先完成。迁移后 route.ts 调用 `generateCore()`，
> discipline 参数才能实际到达 AI 调用层。

### 1.7 Quality Checker 学科扩展

**修改文件**: `src/shared/lib/upg/quality-checker.ts`

**当前签名**: `checkQuality(html: string): QualityResult`
**改造后签名**: `checkQuality(html: string, discipline?: string): QualityResult`

```typescript
import { getDisciplineConfig } from './disciplines';

export function checkQuality(html: string, discipline?: string): QualityResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // ====== 通用检查（现有 18 项，100% 保留不变）======
  // ... 所有现有检查代码不动 ...

  // ====== 学科特有检查（新增）======
  if (discipline) {
    const config = getDisciplineConfig(discipline);
    for (const rule of config.qualityRules) {
      const result = rule.check(html);
      if (!result.passed) {
        if (rule.severity === 'error') {
          issues.push(`[${discipline}] ${rule.description}: ${result.message}`);
        } else {
          warnings.push(`[${discipline}] ${rule.description}: ${result.message}`);
        }
      }
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}
```

**改动量**: 约 15 行新增，零行删除/修改。

### 1.8 API Route 传递 discipline

> **前置**: 1.0 节的 route.ts 迁移已消除双代码路径。此处只需在已迁移的 route.ts 中解析 discipline 参数。

**修改文件**: `src/app/api/upg/generate/route.ts`

**当前 request body 解析**（约 line 39-48）:
```typescript
const { prompt, language = 'en', isRegenerate = false } = body;
```

**改造后**:
```typescript
const { prompt, language = 'en', discipline = 'physics', isRegenerate = false } = body;

// 验证 discipline（CTO: 用 isValidDiscipline 拒绝无效输入）
if (discipline && !isValidDiscipline(discipline)) {
  return respErr('Invalid discipline');
}

// 检查学科是否已启用（S1 只有 physics）
const config = getDisciplineConfig(discipline);
if (!config.enabled) {
  return respErr(`${config.name.en} is coming soon`);
}
```

**传递到 generateCore**:
```typescript
const result = await generateCore({
  prompt,
  language,
  userId: user?.id ?? null,
  discipline,           // ← 新增
});
```

**改动量**: 约 8 行。

### 1.9 路由规划

**新增路由结构**:

```
src/app/[locale]/(landing)/(ai)/upg/
├── page.tsx                          ← 学科选择入口页（新增）
├── [discipline]/                     ← 动态学科路由（新增）
│   ├── page.tsx                      ← 学科生成器页面
│   ├── view/[id]/page.tsx            ← 查看生成结果
│   └── my/page.tsx                   ← 我的生成列表
```

**S1 实现方式**（最小改动）:

方案 A（推荐）：**保持现有路由不变，在 `/upg` 页面增加学科选择器 UI**
- `/upg` → 现有生成页面 + 顶部学科 Tab（Physics 选中，其余灰色）
- `/upg/view/[id]` → 不变
- `/upg/my` → 不变
- Gallery 已有 category 筛选，不需要改路由

方案 B：动态路由 `/upg/[discipline]`
- 需要迁移现有页面到动态路由
- S1 只有 physics，多此一举
- 留到 S2 有 2+ 学科时再迁移

**推荐方案 A**，理由：
1. S1 零路由变更，降低风险
2. 学科选择器是 UI 组件变更，不影响 URL 结构
3. S2 再做路由迁移，那时有多学科才值得

**开发量**: 方案 A = 0.5 天（学科选择器组件）；方案 B = 2 天（路由迁移 + 重定向）

### 1.10 学科选择器 UI 组件

**新增文件**: `src/shared/blocks/upg/DisciplineSelector.tsx`

```typescript
'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { getAllDisciplines } from '@/shared/lib/upg/disciplines';
import { cn } from '@/shared/lib/utils';
import * as LucideIcons from 'lucide-react';

interface Props {
  selected: string;
  onChange: (discipline: string) => void;
}

// CTO 修正: 静态注册表，移到组件外避免重复计算
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Atom: LucideIcons.Atom,
  FlaskConical: LucideIcons.FlaskConical,
  Dna: LucideIcons.Dna,
  Sigma: LucideIcons.Sigma,
  Globe: LucideIcons.Globe,
};

export function DisciplineSelector({ selected, onChange }: Props) {
  const locale = useLocale() as 'en' | 'zh';  // CTO 修正: 尊重 i18n locale
  const allDisciplines = useMemo(() => getAllDisciplines(), []);  // CTO 修正: useMemo

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {allDisciplines.map((d) => {
        const Icon = ICON_MAP[d.icon];  // CTO 修正: 动态 icon 渲染
        return (
          <button
            key={d.id}
            onClick={() => d.enabled && onChange(d.id)}
            disabled={!d.enabled}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
              'transition-all duration-200',
              selected === d.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : d.enabled
                  ? 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed',
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{d.name[locale]}</span>
            {!d.enabled && (
              <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                Coming Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
```

### 1.11 数据库 — 无 Schema 改动

`upgGeneration.category` 字段**已存在**（text 类型，可为 null）。
`idx_upg_generation_gallery` 复合索引**已包含 category**：`on(isPublic, category, createdAt)`。

> **CTO 修正**: `idx_upg_generation_category` 独立索引**不存在**（原 spec 声明有误）。
> 复合索引 `idx_upg_generation_gallery` 覆盖了 `WHERE is_public=true AND category=X` 查询。
> 但纯 `WHERE category=X`（如 admin 统计）不走索引。S1 数据量小不影响，S2 数据增长后考虑新增。

S1 Phase 0.5 **不需要任何数据库迁移**。

现有数据中 category 为 null 的记录 → 视为 'physics'（代码层面 fallback）。

### 1.12 Phase 0.5 开发任务分解

| 任务 | 文件 | 新增/修改 | 工时 | 依赖 |
|------|------|----------|------|------|
| **A0. route.ts 迁移** | `api/upg/generate/route.ts` + `generate-core.ts` | **修改 ~100 行** | **1 天** | **无（最先做）** |
| A1. 类型系统 | `disciplines/types.ts` | 新增 ~90 行 | 0.5 天 | A0 |
| A2. Physics 配置 | `disciplines/physics.ts` | 新增 ~160 行 | 1.5 天 | A1 |
| A3. 注册表 | `disciplines/index.ts` | 新增 ~40 行 | 0.25 天 | A1, A2 |
| A4. Stub 文件 ×4 | `disciplines/{chem,bio,math,earth}.ts` | 新增 4×50 行 | 0.5 天 | A1 |
| A5. System Prompt 分层 | `system-prompt.ts` + `lib-versions.ts` | 修改 ~120 行 | 2 天 | A2, A3 |
| A6. generate-core 接入 | `generate-core.ts` | 修改 ~10 行 | 0.5 天 | A5 |
| A7. quality-checker 扩展 | `quality-checker.ts` | 修改 ~15 行 | 0.25 天 | A3 |
| A8. API route 传递 | `api/upg/generate/route.ts` | 修改 ~8 行 | 0.5 天 | A0, A6 |
| A9. UI 学科选择器 | `blocks/upg/DisciplineSelector.tsx` | 新增 ~70 行 | 0.5 天 | A3 |
| A10. 回归测试 | Vitest snapshot + 手动 10 主题 | — | 1 天 | A5-A8 |
| **总计** | | | **7 天** | |

> **CTO 修正**: 原估 5 天 → 7 天（+40%）。A0 迁移（+1天）、A2 prompt 提取（+0.5天）、A5 拆分（+1天）、A10 snapshot 测试（+0.5天）。

**关键路径**: A0 → A1 → A2 → A3 → A5 → A6 → A8 → A10

### 1.13 回归测试方案

**核心验证**：解耦后生成质量与解耦前 100% 一致。

**CTO Critical #2: Prompt Snapshot 测试（强制，不可跳过）**

在 A5（System Prompt 分层）开始前，必须先创建 snapshot：

```typescript
// __tests__/upg/prompt-snapshot.test.ts
import { describe, it, expect } from 'vitest';
import { getSystemPrompt, buildUserPrompt } from '@/shared/lib/upg/system-prompt';

// Step 1: 重构前运行一次，保存 snapshot 文件
// Step 2: 重构后运行，assert 输出完全一致

describe('System Prompt Regression', () => {
  it('getSystemPrompt() output unchanged after refactoring', () => {
    const output = getSystemPrompt();            // 无参数 = 旧行为
    expect(output).toMatchSnapshot();
  });

  it('getSystemPrompt("physics") matches no-arg output', () => {
    const noArg = getSystemPrompt();
    const physics = getSystemPrompt('physics');
    // physics 版本 = 基础 + 物理专属，可能比 noArg 多内容
    // 但基础部分必须完全包含
    expect(physics).toContain(noArg.substring(0, 500)); // 前 500 字符一致
  });

  it('buildUserPrompt output unchanged for physics', () => {
    const output = buildUserPrompt('Simple Pendulum', 'en');
    expect(output).toMatchSnapshot();
  });

  it('checkQuality returns same result without discipline param', () => {
    // 用一个已知通过的 HTML fixture
    const html = readFixture('known-good-generation.html');
    const result = checkQuality(html);              // 无 discipline 参数
    expect(result.passed).toBe(true);
    expect(result).toMatchSnapshot();
  });
});
```

**执行流程**:
1. A5 开始前：`pnpm test -- prompt-snapshot` → 生成 `.snap` 文件
2. A5 重构完成后：再跑一次 → 必须 100% 匹配（允许 physics 版本多出学科专属内容）
3. 如果不匹配 → **阻断提交**，找到差异原因后修复

```
完整测试矩阵：
┌──────────────────────────────┬───────────────────┬──────────────┐
│ 测试用例                      │ 预期              │ 阻断/警告    │
├──────────────────────────────┼───────────────────┼──────────────┤
│ Prompt snapshot 对比          │ 100% 匹配         │ 🔴 阻断      │
│ checkQuality snapshot 对比    │ 100% 匹配         │ 🔴 阻断      │
│ 不传 discipline               │ 行为与当前一致     │ 🔴 阻断      │
│ discipline='physics'          │ 行为与当前一致     │ 🔴 阻断      │
│ discipline='chemistry'(disabled)│ 返回 coming soon │ 🔴 阻断      │
│ discipline='invalid'          │ 返回 error        │ 🔴 阻断      │
│ 现有 10 个 Physics 主题重跑   │ 全部 quality pass  │ 🔴 阻断      │
│ 前端学科选择器渲染             │ Physics 可点击      │ 🟡 警告      │
│ 前端其他学科显示 Coming Soon   │ 不可点击           │ 🟡 警告      │
│ TypeScript 编译               │ 零错误             │ 🔴 阻断      │
│ Vitest 现有 64 测试           │ 全部通过           │ 🔴 阻断      │
│ route.ts 不再直接调用 LLM     │ 无 callOpenRouter  │ 🔴 阻断      │
└──────────────────────────────┴───────────────────┴──────────────┘
```

## 第二部分：Phase 3.5 — 论文 5 改进

> 依赖 Phase 0.5 完成。

### 2.1 物理验证层（B1，🔴 高优先级，3-4 天）

**新增目录**: `src/shared/lib/upg/validation/`

#### 2.1.1 验证调度器

**新建**: `src/shared/lib/upg/validation/index.ts`

```typescript
import { getDisciplineConfig } from '../disciplines';
import { runTechnicalValidation } from './technical-validator';
import { runPhysicsValidation } from './physics-validator';

export interface FullValidationResult {
  technicalScore: number;        // 0-100
  disciplineScore: number;       // 0-100
  overallScore: number;          // 加权平均
  verified: boolean;             // overallScore >= threshold
  details: Array<{
    ruleId: string;
    ruleName: string;
    score: number;
    passed: boolean;
    message: string;
  }>;
}

/**
 * 运行完整验证（技术 + 学科）
 * 不阻断生成，结果存入 DB 作为元数据
 * CTO 修正: 同步函数，S1 所有验证规则都是正则匹配，不需要 async
 */
export function runFullValidation(
  html: string,
  discipline: string
): FullValidationResult {
  const config = getDisciplineConfig(discipline);

  // 技术验证（通用）
  const techResult = runTechnicalValidation(html);

  // 学科验证（从 config.validationRules）
  const discResults = config.validationRules.map((rule) => {
    const result = rule.validate(html);
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      score: result.score,
      passed: result.passed,
      message: result.details,
    };
  });

  const techScore = techResult.score;
  const discScore = discResults.length > 0
    ? discResults.reduce((sum, r) => sum + r.score, 0) / discResults.length
    : 100; // 无学科验证规则时默认满分

  // CTO 修正: 权重翻转，技术验证更成熟可靠，学科验证 S1 是正则近似
  const overallScore = Math.round(techScore * 0.6 + discScore * 0.4);

  return {
    technicalScore: techScore,
    disciplineScore: discScore,
    overallScore,
    verified: overallScore >= config.validationThreshold,
    details: [...techResult.details, ...discResults],
  };
}
```

#### 2.1.2 技术验证器

**新建**: `src/shared/lib/upg/validation/technical-validator.ts`

从现有 `quality-checker.ts` 的逻辑升级。quality-checker 保持不变（它决定生成是否通过），technical-validator 是打分系统（用于 Verified 标签）。

```typescript
export function runTechnicalValidation(html: string): {
  score: number;
  details: Array<{ ruleId: string; ruleName: string; score: number; passed: boolean; message: string }>;
} {
  const checks = [
    { id: 'tv-animation-loop', name: 'Animation Loop', weight: 15,
      test: () => /setAnimationLoop|requestAnimationFrame/.test(html) },
    { id: 'tv-resize-handler', name: 'Responsive Resize', weight: 10,
      test: () => /window.*resize|addEventListener.*resize/.test(html) },
    { id: 'tv-error-handling', name: 'Error Handling', weight: 10,
      test: () => /try\s*\{/.test(html) },
    { id: 'tv-lighting', name: 'Adequate Lighting', weight: 10,
      test: () => /AmbientLight|DirectionalLight|PointLight|SpotLight/.test(html) },
    { id: 'tv-orbit-controls', name: 'OrbitControls from CDN', weight: 15,
      test: () => /OrbitControls/.test(html) && !/class\s+OrbitControls/.test(html) },
    { id: 'tv-sliders', name: 'Interactive Sliders', weight: 10,
      test: () => (html.match(/<input[^>]+type=["']range["']/g) || []).length >= 1 },
    { id: 'tv-katex', name: 'KaTeX Formulas', weight: 10,
      test: () => /katex|\\frac|\\vec/.test(html) },
    { id: 'tv-quiz', name: 'Quiz Component', weight: 5,
      test: () => /quiz|选择|question|answer/i.test(html) },
    { id: 'tv-pixel-ratio', name: 'Pixel Ratio Handling', weight: 5,
      test: () => /setPixelRatio/.test(html) },
    { id: 'tv-no-blacklist', name: 'No Blacklisted Code', weight: 10,
      test: () => !/\beval\b|\bnew\s+Function\b|document\.cookie/.test(html) },
  ];

  let totalWeight = 0;
  let earnedWeight = 0;
  const details = checks.map((c) => {
    const passed = c.test();
    totalWeight += c.weight;
    if (passed) earnedWeight += c.weight;
    return {
      ruleId: c.id,
      ruleName: c.name,
      score: passed ? 100 : 0,
      passed,
      message: passed ? 'OK' : `Missing: ${c.name}`,
    };
  });

  return {
    score: Math.round((earnedWeight / totalWeight) * 100),
    details,
  };
}
```

#### 2.1.3 物理验证器

**新建**: `src/shared/lib/upg/validation/physics-validator.ts`

```typescript
import type { ValidationRule, ValidationResult } from '../disciplines/types';

/**
 * 物理学科验证规则集
 * 这些规则在 Phase 3.5 填充到 physicsConfig.validationRules
 */
export const physicsValidationRules: ValidationRule[] = [
  {
    id: 'pv-energy-conservation',
    name: 'Energy Conservation',
    description: 'Check if total energy calculation exists and doesn\'t drift',
    validate: (html: string): ValidationResult => {
      // 检测能量相关变量
      const hasEnergy = /totalEnergy|kineticEnergy|potentialEnergy|energy/i.test(html);
      const hasConservationCheck = /total.*=.*kinetic.*\+.*potential|E\s*=\s*KE\s*\+\s*PE/i.test(html);

      if (!hasEnergy) {
        return { score: 50, passed: true, details: 'No energy system detected (neutral)' };
      }
      if (hasConservationCheck) {
        return { score: 100, passed: true, details: 'Energy conservation check present' };
      }
      return { score: 30, passed: false, details: 'Energy variables exist but no conservation check' };
    },
  },
  {
    id: 'pv-physical-constants',
    name: 'Physical Constants',
    description: 'Verify physical constants are reasonable',
    validate: (html: string): ValidationResult => {
      const gMatch = html.match(/(?:const|let|var)\s+g\s*=\s*([\d.]+)/);
      if (gMatch) {
        const g = parseFloat(gMatch[1]);
        if (g >= 9.7 && g <= 9.9) {
          return { score: 100, passed: true, details: `g=${g} (correct)` };
        }
        if (g === 10) {
          return { score: 80, passed: true, details: `g=${g} (approximate, acceptable)` };
        }
        return { score: 20, passed: false, details: `g=${g} (suspicious value)` };
      }
      return { score: 70, passed: true, details: 'No gravity constant detected (may not be needed)' };
    },
  },
  {
    id: 'pv-analytical-overlay',
    name: 'Analytical Solution Overlay',
    description: 'Check if analytical/theoretical solution is displayed alongside numerical',
    validate: (html: string): ValidationResult => {
      const hasAnalytical = /analytical|theoretical|exact.solution|closed.form/i.test(html);
      const hasComparison = /numerical.*analytical|simulation.*theory|比较|对比/i.test(html);

      if (hasComparison) {
        return { score: 100, passed: true, details: 'Analytical-numerical comparison present' };
      }
      if (hasAnalytical) {
        return { score: 70, passed: true, details: 'Analytical reference mentioned but comparison unclear' };
      }
      return { score: 40, passed: false, details: 'No analytical solution overlay detected' };
    },
  },
  {
    id: 'pv-nan-protection',
    name: 'NaN/Infinity Protection',
    description: 'Check for numerical stability safeguards',
    validate: (html: string): ValidationResult => {
      const hasNanCheck = /isNaN|isFinite|Number\.isFinite/.test(html);
      const hasDtCap = /Math\.min.*dt|dt.*Math\.min|deltaTime.*cap|dt\s*>\s*[\d.]+/.test(html);

      const score = (hasNanCheck ? 50 : 0) + (hasDtCap ? 50 : 0);
      return {
        score: Math.max(score, 30), // 最低 30 分（可能不需要）
        passed: score >= 50,
        details: `NaN check: ${hasNanCheck ? '✓' : '✗'}, dt cap: ${hasDtCap ? '✓' : '✗'}`,
      };
    },
  },
  {
    id: 'pv-unit-labels',
    name: 'SI Unit Labels',
    description: 'Verify SI units are displayed in the interface',
    validate: (html: string): ValidationResult => {
      const unitPatterns = [
        /\bm\/s\b/, /\bkg\b/, /\bN\b/, /\bJ\b/, /\brad\/s\b/,
        /\bHz\b/, /\bPa\b/, /\bW\b/, /\bC\b/, /\bV\b/, /\bA\b/,
      ];
      const found = unitPatterns.filter((p) => p.test(html)).length;
      const score = Math.min(found * 20, 100);

      return {
        score: Math.max(score, 30),
        passed: found >= 2,
        details: `${found} SI unit types detected`,
      };
    },
  },
];
```

#### 2.1.4 集成到生成管线

**修改**: `generate-core.ts` 在 quality check 通过后、写入 DB 之前：

```typescript
// Phase 2.5: 学科验证（同步，不阻断生成）
let validationResult: FullValidationResult | null = null;
try {
  validationResult = runFullValidation(injected, discipline);  // CTO: 同步，无 await
} catch {
  // 验证自身崩溃不阻断生成
  console.warn('Validation failed silently');
}

// Phase 3: 写入 DB
const successData = {
  ...baseData,
  category: discipline,
  validationScore: validationResult?.overallScore ?? null,
  validationDetails: validationResult ? JSON.stringify(validationResult.details) : null,
  validatedAt: validationResult ? new Date() : null,
};
```

#### 2.1.5 数据库字段新增

**修改**: `src/config/db/schema.ts` — `upgGeneration` 表新增 3 个字段

```typescript
validationScore: integer('validation_score'),         // 0-100
validationDetails: text('validation_details'),        // JSON string
validatedAt: timestamp('validated_at'),               // 验证时间
```

需要运行 `pnpm db:generate && pnpm db:push`。

### 2.2 增量式生成（B2，🟡 中优先级，2-3 天）

#### 2.2.1 复杂度分析器

**新建**: `src/shared/lib/upg/complexity-analyzer.ts`

```typescript
export interface ComplexityAnalysis {
  score: number;              // 0-10
  factors: string[];
  strategy: 'single' | 'incremental';
  /** 增量生成时的步骤数 */
  steps: number;
}

export function analyzeComplexity(prompt: string): ComplexityAnalysis {
  let score = 0;
  const factors: string[] = [];

  // 多物理量/多变量（2+ 独立系统）
  const multiSystem = /和|与|coupled|interacting|多体|N.body|many.body|耦合/i;
  if (multiSystem.test(prompt)) { score += 2; factors.push('coupled-systems'); }

  // 3D 多粒子
  const multiParticle = /粒子|particle|分子|molecular|晶体|crystal|集群|swarm|N个|hundred|thousand/i;
  if (multiParticle.test(prompt)) { score += 2; factors.push('multi-particle'); }

  // 复杂主题关键词
  const complexTopics = /相变|phase.transition|Ising|蒙特卡罗|Monte.Carlo|量子|quantum|波函数|wavefunction|薛定谔|Schrödinger|混沌|chaos|双摆|double.pendulum|三体|three.body|流体|fluid|Navier.Stokes/i;
  if (complexTopics.test(prompt)) { score += 3; factors.push('advanced-topic'); }

  // 多图表要求
  const multiChart = /图表.*图表|graph.*graph|plot.*plot|phase.space.*energy|相图.*能量/i;
  if (multiChart.test(prompt)) { score += 1; factors.push('multiple-charts'); }

  // Prompt 长度（>200 字通常更复杂）
  if (prompt.length > 200) { score += 1; factors.push('long-prompt'); }

  // 限制最大分
  score = Math.min(score, 10);

  return {
    score,
    factors,
    strategy: score >= 5 ? 'incremental' : 'single',
    steps: score >= 7 ? 3 : score >= 5 ? 2 : 1,
  };
}
```

#### 2.2.2 增量生成逻辑

**修改**: `generate-core.ts` — 在 AI 调用前判断策略

```typescript
import { analyzeComplexity } from './complexity-analyzer';

// 在 generateCore() 内部，Phase 1 之前：
const complexity = analyzeComplexity(prompt);

let rawHtml: string;
let totalInputTokens = 0;
let totalOutputTokens = 0;

if (complexity.strategy === 'single') {
  // 现有单轮生成逻辑，不变
  const result = await callLLM(selectedModel, systemPrompt, userPrompt);
  rawHtml = result.html;
  totalInputTokens = result.inputTokens;
  totalOutputTokens = result.outputTokens;
} else {
  // 增量生成
  rawHtml = await incrementalGenerate({
    steps: complexity.steps,
    model: selectedModel,
    systemPrompt,
    userPrompt,
    language,
    discipline,
  });
  // token 统计在 incrementalGenerate 内部累加
}
```

**新增函数**: `incrementalGenerate()`

```typescript
async function incrementalGenerate(params: {
  steps: number;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  language: 'zh' | 'en';
  discipline: string;
}): Promise<string> {
  const { steps, model, systemPrompt, userPrompt, language } = params;

  // Step 1: 基础场景 + 核心物理
  const step1Prompt = `${userPrompt}

IMPORTANT: This is Step 1 of ${steps}. In this step, ONLY create:
1. The HTML skeleton with CDN imports
2. The Three.js scene with the core visualization (geometry, materials, lighting)
3. The basic animation loop
4. The OrbitControls

Do NOT add sliders, charts, quiz, or KaTeX formulas yet. Keep it simple and working.`;

  const step1Result = await callLLM(model, systemPrompt, step1Prompt);
  let html = step1Result.html;

  // 验证 Step 1 基础可用
  const step1Sanitized = sanitizeHtml(html);
  html = step1Sanitized.sanitized;

  // Step 2: 交互 + 图表
  const step2Prompt = `Here is the current HTML visualization (Step 1 complete):

\`\`\`html
${html}
\`\`\`

Now add Step 2 of ${steps}:
1. Add 3+ interactive sliders that control physics parameters
2. Add KaTeX formula panel on the left side
3. Add Play/Pause/Reset buttons
4. Ensure sliders update the 3D scene + formulas simultaneously

Output the COMPLETE updated HTML file.`;

  const step2Result = await callLLM(model, systemPrompt, step2Prompt);
  html = sanitizeHtml(step2Result.html).sanitized;

  if (steps >= 3) {
    // Step 3: Quiz + 视觉效果 + 解析解
    const step3Prompt = `Here is the current HTML visualization (Steps 1-2 complete):

\`\`\`html
${html}
\`\`\`

Now add Step 3 (final):
1. Add a collapsible Quiz panel with 1-2 multiple choice questions
2. Add visual effects (particle trails, vector arrows, bloom if appropriate)
3. If an analytical solution exists, overlay it on the graphs
4. Final polish: responsive layout, FPS counter, error handling

Output the COMPLETE final HTML file.`;

    const step3Result = await callLLM(model, systemPrompt, step3Prompt);
    html = sanitizeHtml(step3Result.html).sanitized;
  }

  return html;
}
```

**CTO 修正 — 关键改动**:

1. **Token 成本**: 实际约 **4x**（非 2-3x）。3 步增量每步发送完整 system prompt + 增长中的 HTML。
   单次生成 ~$0.28，增量 ~$0.91。10% 请求触发 → 平均成本 +22%。**已确认可接受。**

2. **`callLLM` 抽象**: 当前 `callOpenRouter` 和 `callAnthropic` 是两个独立函数，路由选择在 route.ts。
   增量生成需要统一调用入口。实施时从 `generate-core.ts` 提取内部函数：
   ```typescript
   function callLLM(model: string, systemPrompt: string, userPrompt: string) {
     // 基于配置选择 callOpenRouter 或 callAnthropic
     // 返回 { html, inputTokens, outputTokens }
   }
   ```

3. **Token 追踪**: `incrementalGenerate()` 返回类型改为：
   ```typescript
   { html: string; totalInputTokens: number; totalOutputTokens: number }
   ```
   每步累加 token 统计，写入 DB 的 `inputTokens`/`outputTokens` 为总和。

4. **失败回退策略（CTO 修正）**: 任何中间步骤失败 → **不返回半成品**（半成品无滑块/公式/Quiz，
   必然无法通过 quality check）。改为：回退到**单次全量生成**重试一次。
   ```typescript
   if (stepFailed) {
     console.warn(`Incremental step ${step} failed, falling back to single-shot`);
     return singleShotGenerate(model, systemPrompt, originalUserPrompt);
   }
   ```

5. **Context window 大小守卫（CTO 新增）**: 中间 HTML > 100KB（约 25K tokens）时中止增量，
   回退单次。防止 Step 3 的 input 超出模型上下文限制。
   ```typescript
   if (Buffer.byteLength(html) > 100 * 1024) {
     console.warn('Intermediate HTML too large for incremental, falling back');
     return singleShotGenerate(...);
   }
   ```

6. **超时**: 每步 max 2min，总 budget 5min。超时按失败处理，触发回退。

### 2.3 对话式迭代修正（B3，🟡 中优先级，3-4 天）

#### 2.3.1 修正核心

**新建**: `src/shared/lib/upg/refine-core.ts`

```typescript
import { getSystemPrompt } from './system-prompt';
import { sanitizeHtml } from './html-sanitizer';
import { checkQuality } from './quality-checker';
import { callAnthropic } from './anthropic-client';
import { callOpenRouter } from './openrouter-client';
import { selectModel } from './model-selector';
// CTO 修正: getGeneration/createGeneration 不存在，需要新增或用正确的函数名
// 实际可用: getGalleryDetail (joined query) — 不适合内部用，返回类型包含 join 字段
// 需要新增: getUpgGenerationById(id) 和 createUpgGeneration(data) 到 models/upg_generation.ts
import { getUpgGenerationById, createUpgGeneration } from '@/shared/models/upg_generation';
import { getUuid } from '@/shared/lib/utils';
import { UPG_CREDITS_PER_REFINEMENT } from './constants';

export interface RefineParams {
  generationId: string;
  refinementPrompt: string;
  userId: string;
  language: 'zh' | 'en';
}

export interface RefineResult {
  success: boolean;
  newGenerationId?: string;
  version?: number;
  htmlContent?: string;
  error?: string;
}

export async function refineGeneration(params: RefineParams): Promise<RefineResult> {
  const { generationId, refinementPrompt, userId, language } = params;

  // 1. 读取原始生成（CTO: 用正确的 model 函数）
  const original = await getUpgGenerationById(generationId);
  if (!original || !original.htmlContent) {
    return { success: false, error: 'Original generation not found' };
  }

  // 2. 权限检查
  if (original.userId !== userId) {
    return { success: false, error: 'Not authorized to refine this generation' };
  }

  // 3. 构建修正 prompt
  const model = selectModel();
  const discipline = original.category || 'physics';
  const systemPrompt = getRefineSystemPrompt(discipline);

  const userPrompt = `
Here is the existing HTML visualization:

\`\`\`html
${original.htmlContent}
\`\`\`

The user wants the following modification:
"${refinementPrompt}"

Rules:
- Output the COMPLETE modified HTML file
- Keep everything that works correctly — only change what the user asked for
- Maintain all existing CDN imports, OrbitControls, KaTeX formulas
- Do NOT remove sliders, quiz, or other interactive elements unless explicitly asked
- If the request is about visual changes (color, size, position), only modify those CSS/JS values
- Language: ${language === 'zh' ? 'Chinese' : 'English'}
`;

  // 4. 调用 LLM（lower temperature for consistency）
  const result = await callOpenRouter({
    model,
    systemPrompt,
    userPrompt,
    maxTokens: 16000,
    temperature: 0.3,         // 比正常生成（0.7）更低，减少随机性
  });

  // 5. 后处理
  const sanitized = sanitizeHtml(result.html);
  const quality = checkQuality(sanitized.sanitized, discipline);

  if (!quality.passed) {
    return { success: false, error: `Quality check failed: ${quality.issues.join(', ')}` };
  }

  // 6. 计算版本号
  const currentVersion = original.version ?? 1;
  const newVersion = currentVersion + 1;

  // 7. 创建新版本记录（CTO: 用正确的 model 函数）
  const newId = getUuid();
  await createUpgGeneration({
    id: newId,
    userId,
    prompt: original.prompt,                 // 保留原始 prompt
    promptHash: original.promptHash,
    language,
    category: discipline,
    htmlContent: sanitized.sanitized,
    htmlSize: Buffer.byteLength(sanitized.sanitized),
    model,
    provider: 'openrouter',
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    status: 'completed',
    version: newVersion,
    parentId: generationId,                  // 版本链
    refinementPrompt,                        // 记录修正指令
    isPublic: false,                         // 修正版默认私有
  });

  return {
    success: true,
    newGenerationId: newId,
    version: newVersion,
    htmlContent: sanitized.sanitized,
  };
}

function getRefineSystemPrompt(discipline: string): string {
  // 复用基础 system prompt，但追加修正专属指令
  const basePrompt = getSystemPrompt(discipline);
  return `${basePrompt}

## REFINEMENT MODE
You are modifying an existing HTML visualization based on user feedback.
- Preserve the overall structure and working functionality
- Make MINIMAL changes to address the user's request
- If the user's request is ambiguous, interpret it conservatively
- Always output the COMPLETE HTML file (not a diff/patch)
`;
}
```

#### 2.3.2 修正 API

**新建**: `src/app/api/upg/[id]/refine/route.ts`

> **CTO Critical #3**: 必须包含 input moderation + rate limiting + 分布式锁，
> 与 generate route 安全层级一致。

```typescript
import { NextRequest } from 'next/server';
import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';  // CTO: 用与 generate route 一致的 auth 函数
import { refineGeneration } from '@/shared/lib/upg/refine-core';
import { consumeCredits } from '@/shared/models/credit';
import { moderateInput } from '@/shared/lib/upg/moderation';  // CTO: 必须审核用户输入
import { UPG_CREDITS_PER_REFINEMENT } from '@/shared/lib/upg/constants';
import { acquireLock, releaseLock } from '@/shared/lib/redis-lock';  // CTO: 分布式锁

export const maxDuration = 60;  // AI 路由 60s

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Auth（必须登录）
  const user = await getUserInfo();
  if (!user) return respErr('Login required', 401);

  const body = await req.json();
  const { prompt, language = 'en' } = body;

  // 2. 输入验证
  if (!prompt || prompt.length < 2 || prompt.length > 500) {
    return respErr('Refinement prompt must be 2-500 characters');
  }

  // 3. CTO: Input moderation（防止注入攻击绕过生成时的审核）
  const moderationResult = await moderateInput(prompt);
  if (moderationResult.blocked) {
    return respErr('Refinement prompt contains prohibited content');
  }

  // 4. CTO: 分布式锁（防止并发修正同一个 generation）
  const lockKey = `refine:${user.id}:${id}`;
  const lockAcquired = await acquireLock(lockKey, 300_000); // 5min TTL
  if (!lockAcquired) {
    return respErr('A refinement is already in progress');
  }

  try {
    // 5. 积分检查（CTO: 用 options object 而非位置参数）
    // ... credit balance check ...

    // 6. Context window 大小守卫（CTO 新增）
    const original = await getUpgGenerationById(id);
    if (original?.htmlContent && Buffer.byteLength(original.htmlContent) > 100 * 1024) {
      return respErr('This visualization is too large to refine. Please regenerate instead.');
    }

    // 7. 执行修正
    const result = await refineGeneration({
      generationId: id,
      refinementPrompt: prompt,
      userId: user.id,
      language,
    });

    if (!result.success) {
      return respErr(result.error || 'Refinement failed');
    }

    // 8. 扣积分（CTO: 用 options object）
    await consumeCredits({
      userId: user.id,
      credits: UPG_CREDITS_PER_REFINEMENT,
      scene: 'upg_refine',
      description: `Refine generation ${id} → ${result.newGenerationId}`,
    });

    return respData({
      newGenerationId: result.newGenerationId,
      version: result.version,
      htmlContent: result.htmlContent,
    });
  } finally {
    // 9. CTO: 释放锁
    await releaseLock(lockKey);
  }
}
```
```

#### 2.3.3 数据库字段新增

```typescript
// upgGeneration 新增字段
version: integer('version').default(1),
parentId: text('parent_id'),                   // 前一版本 ID
refinementPrompt: text('refinement_prompt'),   // 本次修正指令（null = 原始生成）
```

新增索引：
```typescript
index('idx_upg_generation_parent').on(table.parentId),
```

#### 2.3.4 常量新增

**修改**: `constants.ts`

```typescript
export const UPG_CREDITS_PER_REFINEMENT = 3;
```

### 2.4 解析解叠加（B4，🟢 低优先级，1 天）

已在 `physicsConfig.analyticalSolutions` 中实现（见 1.3 节）。

~~额外工作：新建 `analytical-solutions.ts` 包装模块~~

> **CTO 修正**: 此包装模块已删除。它只是 `getDisciplineConfig(d).analyticalSolutions` 的
> 透传，不增加任何价值。而且用了 `require()` 而非 ES import，违反代码规范。
> 解析解内容直接存在 `DisciplineConfig.analyticalSolutions` 中，通过 `getSystemPrompt(discipline)`
> 自动注入。不需要独立模块。

### 2.5 教育定位更新（B5，🟢 低优先级，0.5 天）

- 更新 Landing Page hero 副标题：加入 "AI-Generated Interactive Science Visualizations"
- Gallery 页面标题：从 "UPG Gallery" → "Science Visualization Gallery"
- 在 footer 或 About 页引用 arXiv:2412.07482 作为学术背书
- 导航栏 UPG 图标旁加学科指示器（S1 显示 "Physics"）

### 2.6 Phase 3.5 开发任务分解

| 任务 | 文件 | 工时 | 依赖 |
|------|------|------|------|
| B1a. 验证框架 | `validation/{index,types,technical-validator}.ts` | 1.5 天 | Phase 0.5 |
| B1b. 物理验证规则 | `validation/physics-validator.ts` | 1 天 | B1a |
| B1c. 集成到管线 + DB 字段 | `generate-core.ts` + `schema.ts` | 0.5 天 | B1b |
| B1d. UI Verified 标签 | Gallery 卡片 + 详情页 + 筛选 | **1 天** | B1c |
| B2a. 复杂度分析器 | `complexity-analyzer.ts` | 0.5 天 | Phase 0.5 |
| B2b. 增量生成逻辑 | `generate-core.ts` + callLLM 抽象 | **2.5 天** | B2a |
| B2c. 测试 5 个复杂主题 | 手动测试（每次 1-3 min + debug） | **1 天** | B2b |
| B3a. refine-core | `refine-core.ts` + model 函数补充 | **2 天** | Phase 0.5 |
| B3b. refine API | route.ts + moderation + 锁 + 限流 | **1 天** | B3a |
| B3c. DB 字段 + UI | `schema.ts` + 查看页版本历史 | **1.5 天** | B3b |
| B3d. 测试修正流程 | 手动测试 | 0.5 天 | B3c |
| B4. 解析解 | ~~删除独立模块~~ 已含在 physicsConfig 中 | **0.25 天** | Phase 0.5 |
| B5. 定位更新 | Landing page + Gallery | 0.5 天 | 无 |
| **总计** | | **~13 天（2.5 周）** | |

> **CTO 修正**: 原估 10 天 → 13 天（+30%）。
> B1d Gallery UI（+0.5天）、B2b callLLM 抽象 + token 追踪 + 回退逻辑（+1天）、
> B2c 调试耗时（+0.5天）、B3a model 函数补充（+0.5天）、B3b 安全层（+0.5天）、B3c 版本历史 UI（+0.5天）。

## 第三部分：依赖图 + 集成时间线

```
Week 1-2: Phase 0（现有，继续完成）
   ├── OrbitControls 修复
   ├── 预览重试机制
   └── 质量检查增强

Week 3-4: Phase 0.5（学科解耦，7 天，CTO 修正）
   ├── A0: route.ts 迁移到 generateCore()（消除双代码路径）
   ├── A1-A4: 类型系统 + Physics 配置 + 注册表 + Stub
   ├── A5-A8: System Prompt 分层 + generate-core + quality-checker + API
   └── A9-A10: UI 选择器 + 回归测试（含 prompt snapshot）

Week 4-5: Phase 1-2（现有，用户系统 + 画廊）

Week 6-7: Phase 3（高级生成选项 — 学科检测现在已被 Phase 0.5 覆盖）

Week 9-11: Phase 3.5（论文改进，13 天，CTO 修正）
   ├── B1: 物理验证层（4 天）
   ├── B2: 增量生成（4 天）
   ├── B3: 对话修正（5 天）
   └── B4-B5: 解析解 + 定位（0.75 天）

Week 12-14: Phase 4-7（监控、SEO、E2E、Cron）

### 修订后总工时

| 阶段 | 原估 | CTO 修正 | 说明 |
|------|------|---------|------|
| Phase 0.5 | 5 天 | **7 天** | +A0 迁移, +snapshot 测试, +prompt 拆分 |
| Phase 3.5 | 10 天 | **13 天** | +安全层, +token 追踪, +UI 复杂度 |
| **新增合计** | 15 天 | **20 天** | +33%，与上次 CTO 评审校准一致 |
| **项目总计** | ~14-16 周 | **~16-18 周** | |
```

## 第四部分：内容规模规划

### 基线要求（PhET 对标）

| 学科 | PhET 数量 | NeonPhysics S1 | NeonPhysics S2 | 目标 |
|------|----------|---------------|---------------|------|
| Physics | 66 | 66（UPG 可生成） | — | 全覆盖，视觉超越 |
| Chemistry | 30+ | — | 30+ | 全覆盖 |
| Biology | 10+ | — | 10+ | 全覆盖 |
| Math | 40+ | — | 40+ | 全覆盖 |
| Earth & Space | 10+ | — | 10+ | 全覆盖 |
| **总计** | **173** | **66** | **107+** | **173+ 全覆盖** |

### UPG 与 Curated Labs 的关系

- **Curated Labs** = 人工精调的高质量实验（React Three Fiber，代码写死）
- **UPG** = AI 实时生成（零依赖 HTML，每次可能不同）
- **目标**：UPG 对 PhET 66 个物理实验的生成效果 ≥ PhET 对应模拟
- **验收方式**：每个 PhET 实验生成 3 次，取最佳结果与 PhET 截图对比

### 内容验收标准

每个 PhET 对标实验需满足：
1. 核心物理正确（参数调整后行为符合物理定律）
2. 交互完整（≥3 滑块 + Play/Pause/Reset）
3. 公式面板（KaTeX 渲染主要公式）
4. Quiz（≥1 道选择题）
5. 视觉质量（Three.js 3D 效果优于 PhET 的 2D）
6. 解析解叠加（如适用）
7. 物理验证通过（Verified 标签）
