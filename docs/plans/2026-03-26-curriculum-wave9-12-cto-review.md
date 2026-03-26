---
name: curriculum-wave9-12-cto-review
status: in-progress
created: 2026-03-26T03:47:02Z
updated: 2026-03-26T09:00:00Z
version: v3.1（新增 Section 2.9 HTML 实验视觉一致性规范）
---

# 课程扩展 Wave 9-12 — CTO Review Document

**背景**：当前 114 个实验（Physics 82 / Bio 14 / Chem 10 / Earth 5 / Math 3），Chemistry 和 Earth Science 存在结构性缺口。本文档提出 Wave 9-12 扩展方案，新增 69 个实验（114 → 183），对标并超越 PhET 169 总量。

**关联文档**：
- 竞品对标分析 → `../../docs/research/curriculum-roadmap-part1-analysis.md`
- 课程卡片 + 路线图 → `../../docs/research/curriculum-roadmap-part2-development.md`

## 1. Current State

| 维度 | 状态 | 评估 |
|------|------|------|
| 总实验数 | 114 | Physics 超 PhET，Chemistry/Earth 严重不足 |
| Chemistry | 10（PhET 30） | 🔴 缺口最大，付费用户第二需求 |
| Earth Science | 5（PhET 18） | 🔴 NGSS 必要标准几乎空白 |
| Biology | 14（PhET 7） | 🟢 已超竞品，AP Bio 补 6 个达全覆盖 |
| Physics | 82（PhET 66） | 🟢 已超竞品，AP-C 有 8 个扩展空间 |
| Wave 类型范围 | `1 | 2 | 3 | 4 | 5 | 6 | 7 | 8` | 需要扩展到 12 |
| Earth Science HTML 目录 | 不存在 | `public/experiments/earth-science/` 缺失 |
| 缩略图覆盖率 | 66/114（58%） | 剩余 48 张待补齐 |

## 2. 技术变更清单

### 2.1 类型扩展（必须先做）

**文件**：`src/shared/types/experiment.ts`

```typescript
// 当前
export type Wave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// 改为
export type Wave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
```

影响面：仅 `wave` 字段类型检查，无运行时影响。现有实验不受影响。

### 2.2 新增 Earth Science HTML 目录

```
Scivra/public/experiments/
├── ap-biology/          ← 已存在
├── ap-chemistry/        ← 已存在（7 个）
├── ap-physics/          ← 已存在（73+ 个）
├── elementary/          ← 已存在（11 个）
├── middle/              ← 已存在（9 个）
└── earth-science/       ← NEW：Wave 9-12 地球科学实验 HTML
```

命名规范：`{slug}.html`（与 `ap-chemistry` 目录约定一致，不加学科前缀），如 `greenhouse-effect.html`

### 2.3 html-map.ts 扩展

**文件**：`src/shared/lib/experiments/html-map.ts`

Wave 9 完成后增加 Chemistry entries（10 个）：
```typescript
// Wave 9 — AP Chemistry Core
"balancing-chemical-equations": "/experiments/ap-chemistry/balancing-chemical-equations.html",
"electron-configuration": "/experiments/ap-chemistry/electron-configuration.html",
"lewis-structures": "/experiments/ap-chemistry/lewis-structures.html",
// ... 共 10 个
```

Wave 10 增加 Earth Science entries（13 个）：
```typescript
// Wave 10 — Earth Science
"greenhouse-effect": "/experiments/earth-science/greenhouse-effect.html",
"radiometric-dating": "/experiments/earth-science/radiometric-dating.html",
// ... 共 13 个
```

### 2.4 registry.ts 扩展

每个 Wave 完成后在 `src/shared/lib/experiments/registry.ts` 增加：
```typescript
// Wave 9 — AP Chemistry Core (C-08 to C-17)
import { balancingChemicalEquations } from "./data/balancing-chemical-equations";
// ... 共 10 个 import

// 在 experiments 数组末尾增加
balancingChemicalEquations,
// ...
```

### 2.5 数据文件（每实验一个 .ts）

路径：`src/shared/lib/experiments/data/{slug}.ts`

格式完全对齐现有实验模板（`Experiment` 接口，见 `src/shared/types/experiment.ts`）。

### 2.6 i18n 翻译

**文件**：`src/config/locale/messages/en/experiments.json` + `zh/experiments.json`

每个新实验需要 en/zh 两个条目。

### 2.7 缩略图

路径：`public/imgs/experiments/{slug}.png`

生成方案：使用现有 Gemini API 批量生成脚本（与 66 张已生成缩略图同一流程），统一学术蓝风格。Placeholder 必须使用学科色块（Chemistry 橙色、Earth Science 绿色、Biology 紫色）+ 学科图标，禁止空白占位，避免实验库出现破损感。

### 2.8 CTO Round-1 补充的遗漏技术变更（必须在对应 Wave 开发前完成）

**变更 A：html-map.ts key 统一使用 slug（优先级：高，Wave 9 前完成）**

`getExperimentHtmlPath(id)` 的调用处目前传入的是 `id` 字段还是 `slug` 字段未经验证。由于现有实验 `id === slug`，两者一致未暴露问题。但 Wave 11 K5 新实验（`K5-12`、`K5-13`……大写 ID）与 slug（`k5-chemical-changes`）不同，lookup 将失败。

**修正方案**：
1. 检查所有 `getExperimentHtmlPath(...)` 调用处，确认传入 `experiment.slug` 而非 `experiment.id`
2. 在 SOP（Section 3）中明确：`html-map.ts` 的 key **始终使用 slug**（全小写 kebab-case）
3. Wave 11 K5 实验的 `id` 字段命名需与 slug 保持一致（全小写），放弃 `K5-12` 大写格式

**变更 B：registry.ts 导入顺序重排（优先级：中，Wave 9 开始前完成）**

当前 registry.ts 约 70 个 import，无结构化顺序（Wave 8 在顶部，Wave 1 注释在中间）。Wave 9-12 再加 69 个后将达 130+ import，维护困难。

**修正方案**：Wave 9 开发前，按 Wave 编号升序重排 import 和 experiments 数组注册，统一格式为：
```typescript
// Wave N — {描述}（共 X 个）
import { xxx } from "./data/xxx";
```

**变更 C：registry 完整性测试（优先级：高，Wave 9 Sprint 9.1 同步添加）**

防止大规模扩展中出现"注册但无 HTML 路径"或"重复 slug"的静默 bug。

**新增测试**（`tests/unit/experiments/registry-integrity.test.ts`）：
```typescript
describe("registry integrity", () => {
  it("no duplicate slugs", () => {
    const slugs = getAllExperiments().map(e => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("all slugs have html-map entry or are Wave-1 RTF", () => {
    const wave1Ids = ["newtons-laws", "projectile-motion", "em-spectrum", "roller-coaster"];
    getAllExperiments()
      .filter(e => !wave1Ids.includes(e.id))
      .forEach(e => {
        expect(getExperimentHtmlPath(e.slug)).not.toBeNull();
      });
  });
  it("chemistry experiments >= 20 after Wave 9", () => {
    // 添加 Wave 9 后断言
  });
});
```

**变更 D：Wave 11 K5 Earth Science 实验的 primaryStandard 决策（优先级：中，Wave 11 开发前明确）**

K5-14（`k5-weather-patterns`）、K5-15（`k5-landforms-erosion`）、K5-16（`k5-stars-space`）是 Earth Science 学科但年级是 K-5，`primaryStandard` 应为 `"elementary-k5"` 还是 `"ngss-hs"`？

**决策**：统一使用 `"elementary-k5"`。`primaryStandard` 按**年级段**路由，不按学科。`subject` 字段已携带 `"earth-science"` 信息，用于学科筛选；`primaryStandard` 用于 URL 路由和课标对齐展示。

**变更 E：slug 唯一性冲突检查（优先级：低，Wave 10 开发前跑一次）**

ES-13（`solar-system-scale`）与已有 `my-solar-system`（Wave 8）相关但不冲突。Wave 10 开发前跑一次 slug 唯一性断言（变更 C 的测试）即可验证。

**变更 F：Experiment 接口增加 `htmlPath?: string`（优先级：高，准备 Sprint 完成）**

registry 完整性测试当前用硬编码白名单区分 Wave-1 RTF 实验与 HTML 实验，随项目迭代需手动维护。消灭白名单的方案是在接口上做显式区分。

**修正方案**：
1. 在 `src/shared/types/experiment.ts` 的 `Experiment` 接口增加可选字段：`htmlPath?: string`
2. 所有非 Wave-1 实验的 `htmlPath` 设为对应 HTML 路径（与 html-map.ts 保持一致）
3. Wave-1 RTF 实验（newtons-laws / projectile-motion / em-spectrum / roller-coaster）不设置此字段（`undefined`）
4. registry 完整性测试改为：有 `htmlPath` 的实验必须在 html-map 中有对应 entry；无 `htmlPath` 的走 RTF 渲染，不需要 html-map entry
5. 白名单从测试中删除——接口本身即为事实源

**影响范围**：仅 `ExperimentClient` 单元测试需要更新（原先 mock 的 experiment 对象新增可选字段）；html-map.ts 和 registry.ts 不需要改动。

### 2.9 HTML 实验视觉一致性规范（Wave 9-12 强制执行）

**背景**：现有 114 个实验存在系统性视觉不一致，Wave 9-12 必须遵守本节规范，不得偏离。

**已发现的存量问题（不在 Wave 9-12 修复范围，仅作参照）**：
- 背景色：`#0a0e1a`（酸碱/MS）vs `#0f172a`（AP Physics/原子结构）混用
- 字体：`Segoe UI` vs `JetBrains Mono` vs `-apple-system` 混用
- Chemistry 主色：acid-base 用 teal、electrochemistry 用 yellow、atomic-structure 用 blue——三种均与 `theme.css` 定义的 `--subject-chemistry: oklch(0.55 0.12 145)` 不一致
- K5 states-of-matter：使用滚动页面布局，与其他全屏 canvas 实验完全不同
- `<title>` 品牌名：部分仍为 "NeonPhysics"，已品牌升级为 Scivra

#### A. 基础 CSS 模板（所有实验共用）

```css
/* ===== Scivra HTML Experiment Base ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #0f172a;          /* slate-900，全平台统一，不使用 #0a0e1a */
  color: #e2e8f0;               /* slate-200 */
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  height: 100vh;
  user-select: none;
}
/* 数值 readout（电压/pH/温度/频率等数字）单独使用等宽字体 */
.data-val, .readout { font-family: 'JetBrains Mono', 'Courier New', monospace; }
```

#### B. 学科主色系（权威来源：`src/config/style/theme.css`）

Wave 9-12 每个 HTML 实验根据 `subject` 字段使用对应颜色，**不得在同学科内混用不同色系**：

| 学科 | CSS 变量 | 主色 | 淡色 | Panel 边框 rgba | 按钮背景 rgba |
|------|---------|------|------|----------------|--------------|
| Physics | `--subject-physics` | `#3b82f6` | `#93c5fd` | `rgba(59,130,246,0.25)` | `rgba(59,130,246,0.12)` |
| Chemistry | `--subject-chemistry` | `#10b981` | `#6ee7b7` | `rgba(16,185,129,0.25)` | `rgba(16,185,129,0.12)` |
| Biology | `--subject-biology` | `#84cc16` | `#d9f99d` | `rgba(132,204,22,0.25)` | `rgba(132,204,22,0.12)` |
| Earth Science | `--subject-earth` | `#f97316` | `#fed7aa` | `rgba(249,115,22,0.25)` | `rgba(249,115,22,0.12)` |
| Math | `--subject-math` | `#8b5cf6` | `#c4b5fd` | `rgba(139,92,246,0.25)` | `rgba(139,92,246,0.12)` |

> 注：Wave 9 Chemistry 统一使用 `#10b981` / `#6ee7b7`，不沿用存量实验的 teal/yellow 混用。

#### C. Panel 标准样式

```css
/* 学科主色通过变量占位，写实验时替换为上表的具体 rgba 值 */
.panel {
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid {subject-border-rgba};
  border-radius: 8px;
  padding: 12px 14px;
  pointer-events: all;
  backdrop-filter: blur(10px);
}
button {
  background: {subject-btn-rgba};
  border: 1px solid {subject-border-rgba};
  color: {subject-light-color};
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.72rem;
  transition: all 0.2s;
}
input[type=range] { accent-color: {subject-main-color}; height: 4px; }
```

#### D. HTML 布局结构（全屏 Canvas + Overlay，强制）

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{实验名} — Scivra {AP Chemistry | AP Biology | Earth Science | Middle School | Elementary}</title>
  <!-- CDN 见 E 节 -->
</head>
<body>
<canvas id="canvas"></canvas>
<div id="ui">
  <div class="top-bar">
    <div class="panel title-block">
      <h1>{实验名} <span class="badge">{学科 Badge}</span></h1>
      <p>{副标题：一句话描述核心原理}</p>
    </div>
    <div class="panel controls"><!-- 按钮组 + 滑块 --></div>
  </div>
  <div class="bottom-bar">
    <div class="panel data-panel"><!-- 数值 readout --></div>
    <div class="panel formula-panel"><!-- KaTeX 公式 --></div>
  </div>
</div>
</body>
</html>
```

**禁止使用滚动布局**（K5 states-of-matter 的 `max-width: 1400px + container` 风格是历史遗留，Wave 9-12 不得复制）。

#### E. CDN 版本锁定（`src/config/lib-versions.ts` 为权威来源）

```html
<!-- Three.js r134（需要 3D 渲染时使用，2D Canvas 实验不需要） -->
<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>

<!-- OrbitControls（需要鼠标旋转 3D 时使用，须预编译落地后才可引用） -->
<script src="/lib/orbit-controls.js"></script>

<!-- KaTeX 0.16.9（有公式展示时必须包含，即使实验本身不是公式重点） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
```

CDN 禁止事项：
- 不得使用其他版本的 Three.js（只用 r134）
- 不得从 CDN 加载自定义字体（Segoe UI/JetBrains Mono 均为系统字体，无需 CDN）
- 不得引入 D3.js / Plotly / p5.js（有图表需求用 Canvas 2D 或 Chart.js via cdnjs）
- 任何新 CDN 来源必须在 `src/config/lib-versions.ts` 注册

#### F. 字体大小规范

| 元素 | 大小 | 备注 |
|------|------|------|
| h1（实验标题） | `1.0–1.1rem` | K5 实验可放大至 `1.3rem` |
| 副标题/说明文字 | `0.68–0.72rem` | |
| 标签/控件 label | `0.68–0.72rem` | |
| 大型数值显示 | `1.8–2.2rem` | 使用 monospace，主色淡色版 |
| Badge | `0.58–0.62rem` | |

#### G. 颜色语义（跨学科统一）

| 语义 | 颜色 | 用途 |
|------|------|------|
| 成功/配平正确 | `#22c55e` | 配平成功、参数合法 |
| 错误/超出范围 | `#ef4444` | 警告、失败反馈 |
| 次要文字 | `#94a3b8` | label、副标题 |
| 数值文字 | 学科淡色（见上表） | data-val monospace |
| 分割线 | `rgba(255,255,255,0.05)` | data-row 底线 |

#### H. `<title>` 格式

```
{实验名} — Scivra {学科+级别}
```

例：
- `Balancing Chemical Equations — Scivra AP Chemistry`
- `Greenhouse Effect — Scivra Earth Science`
- `States of Matter — Scivra Elementary`

禁止出现 "NeonPhysics"（品牌已升级）。

#### I. K5 & Middle School 补充规则

- K5 实验字号和 badge 可适当增大，允许用学科 emoji（`⚗️` `🌍` `🔬`）增强趣味性
- Middle School 实验遵循与 AP 完全相同的模板，仅主色按学科区分
- K5/MS 实验的 `data-testid="experiment-iframe"` 属性要求与 AP 实验相同

## 3. 每实验开发 SOP（标准作业流程）

每个实验需要完成以下 7 步，缺一不可：

```
Step 1: 数据文件        src/shared/lib/experiments/data/{slug}.ts
           ⚠ id 和 slug 必须相同（全小写 kebab-case），禁止大写 ID
Step 2: HTML 模拟       public/experiments/{dir}/{slug}.html
           ⚠ 必须遵守 Section 2.9 视觉规范（背景色/学科主色/布局/CDN/title 格式）
           ⚠ JS 逻辑行数（排除静态数据数组和 CSS）≤ 600 行；超过则降 P2
Step 3: html-map 注册   src/shared/lib/experiments/html-map.ts
           ⚠ key 必须使用 slug 字段，禁止使用 id 字段
Step 4: registry 注册   src/shared/lib/experiments/registry.ts
           ⚠ 按 Wave 编号顺序追加，不插入中间
Step 5: PR 数据溯源记录  PR description 必须列出参考数据源
           ⚠ 使用 `.github/PULL_REQUEST_TEMPLATE.md` 中的标准格式（准备 Sprint 创建），缺此项 PR 不合并
Step 6: 缩略图          public/imgs/experiments/{slug}.png
           ⚠ 可先用学科色块 placeholder（不可空白），QA 后 24h 内换正式图
Step 7: QA 截图 + 测试   test-screenshots/{slug}-qa.png + registry 完整性测试通过
```

i18n 翻译（Step 8）目前已通过代码读取实验对象的英文字段渲染，暂不需要单独翻译 JSON，但如果有中文 UI label 需求则需补充。

### 验收标准

- 实验 HTML 在 `/experiments/{slug}` 路由下正确渲染，iframe 有 `data-testid="experiment-iframe"`
- 所有参数可交互（滑块/按钮响应）
- 公式显示正确（KaTeX 渲染）
- 挑战题可读
- 缩略图存在（学科色块以上质量）
- PR description 包含数据溯源记录
- registry 完整性测试（变更 C）全部通过
- **视觉规范合规（Section 2.9）**：
  - `<body>` background 为 `#0f172a`（不得是 `#0a0e1a` 或其他值）
  - Panel 边框颜色使用正确的学科 rgba（Chemistry = emerald，非 teal/yellow）
  - `<title>` 包含 "Scivra"（不含 "NeonPhysics"）
  - 布局为全屏 canvas + ui overlay（非滚动页面）
  - CDN 版本为 Three.js r134 / KaTeX 0.16.9

## 4. Wave 9 详细实施规格（Chemistry Core，P0 批次）

### 4.1 实验清单（10 个，AP Chemistry C-08 to C-17）

| ID | Slug | 难度 | 工时 | HTML 渲染策略 |
|----|------|------|------|-------------|
| C-08 | balancing-chemical-equations | beginner | 4h | 2D Canvas + 拖拽系数 |
| C-09 | electron-configuration | intermediate | 8h | Canvas + Bohr 轨道动画 |
| C-10 | lewis-structures | intermediate | 8h | SVG + 键型绘制 |
| C-11 | build-a-molecule | intermediate | 10h | Three.js 分子 3D（CDN r134） |
| C-12 | molecular-polarity | intermediate | 8h | Three.js 电荷云 |
| C-13 | gas-properties | intermediate | 10h | Canvas 粒子模拟 |
| C-14 | beers-law-lab | beginner | 5h | Canvas 颜色插值 |
| C-15 | solutions-dilutions | beginner | 4h | Canvas 溶液浓度可视化 |
| C-16 | stoichiometry | beginner | 5h | Canvas + 原子计数 |
| C-17 | calorimetry | beginner | 5h | Canvas 温度曲线 |

**Wave 9 总工时估算**：67h（+30% QA/测试缓冲 = 87h）→ CTO 修正为 **90-100h**（C-11/C-12 Three.js 首次调试额外 20-30%）

### 4.2 Sprint 结构

| Sprint | 内容 | 预计工时 | 前置条件 |
|--------|------|---------|---------|
| 准备 Sprint | 变更 A（html-map key 统一）+ 变更 B（registry 重排）+ 变更 C（完整性测试）+ 变更 F（`htmlPath?` 接口字段）+ 创建 `PULL_REQUEST_TEMPLATE.md` | 6-8h | Wave 9 实验开发不得早于本 Sprint 完成 |
| 9.1 | C-08 Balancing + C-09 Electron Config + C-10 Lewis | 20h | 准备 Sprint 完成；**⛔ OrbitControls 预编译方案必须在本 Sprint 结束前落地**（硬性截止） |
| 9.2 | C-11 Build Molecule + C-12 Polarity + C-13 Gas Props | 28h | OrbitControls 已落地；若未落地则本 Sprint 改为先做 C-14~C-17（2D 轻量批次） |
| 9.3 | C-14 Beer's Law + C-15 Dilutions + C-16 Stoichio + C-17 Calorimetry（若 9.2 已先做则改为 C-11/C-12/C-13） | 19h | — |

### 4.3 C-08 实施样例（完整规格）

**数据文件规格**（`data/balancing-chemical-equations.ts`）：

```typescript
// id, slug, title, subtitle, description
// primaryStandard: "ap-chemistry"
// category: "chemistry", subject: "chemistry", gradeLevel: "AP"
// wave: 9, tier: "free"
// standards.ap: ["3.A.1", "3.A.2"] (AP Chem Unit 4)
// standards.ngss: ["HS-PS1-7"]
// parameters: [equation(0-4 preset), displayMode(atoms/formula), showHints]
// formulas: 质量守恒定律 LaTeX
// challenges: 3个（平衡 H2O 生成 / 铁锈 / 用户自定义）
// relatedExperiments: ["stoichiometry", "ms-chemical-reactions"]
```

**HTML 规格**（`ap-chemistry/balancing-chemical-equations.html`）：

```
布局：左侧反应物，右侧产物，顶部系数输入框
交互：点击 +/- 调整系数，原子守恒计数器实时更新
反馈：系数正确时绿色 ✓，错误时红色数字提示
动画：配平成功时分子图案动态对齐
预设方程：H2+O2→H2O / Fe+O2→Fe2O3 / N2+H2→NH3 / CH4+O2→CO2+H2O / C3H8+O2→CO2+H2O
```

## 5. Wave 10 详细实施规格（Earth Science，NGSS 批次）

### 5.1 实验清单（13 个，ES-06 to ES-18）

| ID | Slug | 年级 | 难度 | 工时 | 关键技术 |
|----|------|------|------|------|---------|
| ES-06 | greenhouse-effect | 9-12 | beginner | 6h | 辐射粒子动画 |
| ES-07 | radiometric-dating | 9-12 | beginner | 5h | 指数衰减曲线 |
| ES-08 | rock-cycle | 6-10 | intermediate | 10h | Three.js 地质截面 |
| ES-09 | ocean-currents | 9-12 | advanced | 16h | 流体粒子仿真 |
| ES-10 | atmosphere-layers | 9-12 | beginner | 5h | 垂直剖面图 |
| ES-11 | seismic-waves | 9-12 | intermediate | 10h | 波形动画 |
| ES-12 | plate-tectonics-advanced | 9-12 | intermediate | 12h | 3D 板块运动 |
| ES-13 | solar-system-scale | 9-12 | beginner | 6h | 比例尺可视化 |
| ES-14 | climate-change-modeling | 9-12 | intermediate | 10h | 温度历史折线 |
| ES-15 | star-life-cycle | 9-12 | intermediate | 10h | HR 图动画 |
| ES-16 | soil-formation | 6-8 | beginner | 5h | 地层剖面图 |
| ES-17 | tides-lunar-gravity | 9-12 | beginner | 5h | 月球轨道 + 潮汐 |
| ES-18 | glaciers-ice-ages | 9-12 | intermediate | 8h | 冰川进退时间轴 |

**Wave 10 总工时估算**：108h（+30% = 140h）→ CTO 修正为 **160-180h**（Earth Science 首目录搭建 +4h overhead；ES-08/ES-12 3D 实验各额外 +20-30%；OrbitControls 未落地则继续上浮）

**决策**：ES-09 Ocean Currents **降为 P2**，Wave 11 用简化粒子模型替代（格子玻尔兹曼简化版或纯 Canvas 流线图，JS 逻辑 ≤ 600 行）。Wave 10 从 13 个变为 **12 个**实验。

### 5.2 Earth Science 目录规范

所有 HTML 文件放入 `public/experiments/earth-science/`，slug 前缀无需加学科前缀（与 ap-chemistry 目录的约定一致）。

`primaryStandard` 全部使用 `"ngss-hs"`（高中 9-12）或 `"ngss-ms"`（初中 6-8）。

## 6. Wave 11 详细实施规格（Biology + K-8 扩展）

### 6.1 Biology AP 补全（6 个）

| ID | Slug | 关键技术 | 工时 |
|----|------|---------|------|
| B-11 | immune-system | Canvas 细胞动画 | 10h |
| B-12 | population-dynamics | Chart.js Lotka-Volterra | 6h |
| B-13 | ecological-succession | 序列化动画帧 | 5h |
| B-14 | evidence-of-evolution | 进化树 SVG | 6h |
| B-15 | hardy-weinberg | 频率计算图表 | 5h |
| B-16 | cell-structure-3d | Three.js 3D 细胞 | 12h |

### 6.2 K-5 扩展（8 个）

| ID | Slug | 学科 | 工时 |
|----|------|------|------|
| K5-12 | k5-chemical-changes | Chemistry | 4h |
| K5-13 | k5-mixtures-solutions | Chemistry | 3h |
| K5-14 | k5-weather-patterns | Earth Science | 4h |
| K5-15 | k5-landforms-erosion | Earth Science | 4h |
| K5-16 | k5-stars-space | Earth Science | 4h |
| K5-17 | k5-plant-life-cycle | Biology | 3h |
| K5-18 | k5-animal-adaptations | Biology | 3h |
| K5-19 | k5-solar-energy | Physics | 3h |

### 6.3 Middle School 扩展（8 个）

| ID | Slug | 学科 | 工时 |
|----|------|------|------|
| MS-10 | ms-chemical-bonding | Chemistry | 8h |
| MS-11 | ms-acid-base-reactions | Chemistry | 5h |
| MS-12 | ms-earthquake-epicenter | Earth Science | 8h |
| MS-13 | ms-moon-phases-detailed | Earth Science | 4h |
| MS-14 | ms-cell-division-comparison | Biology | 8h |
| MS-15 | ms-food-web-dynamics | Biology | 5h |
| MS-16 | ms-electric-circuits-advanced | Physics | 8h |
| MS-17 | ms-wave-interactions-advanced | Physics | 8h |

**Wave 11 总工时估算**：128h（+30% = 166h）

## 7. Wave 12 详细实施规格（AP Physics C + P2 批次）

### 7.1 AP Physics C（5 个）

| ID | Slug | 对标考纲 | 难度 | 工时 |
|----|------|---------|------|------|
| P-83 | gauss-law | AP C: E&M Unit 2 | advanced | 14h |
| P-84 | amperes-law | AP C: E&M Unit 3 | advanced | 14h |
| P-85 | rlc-circuit | AP C: E&M Unit 4 | advanced | 10h |
| P-86 | rotational-kinematics-advanced | AP C: Mech Unit 3 | advanced | 8h |
| P-87 | angular-momentum-3d | AP C: Mech Unit 5 | advanced | 14h |

### 7.2 Wave 12 其余（17 个）

Middle School 扩展剩余（8 个）+ Earth Science P2（4 个）+ Biology P2（5 个）

**Wave 12 总工时估算**：167h（+30% = 217h）

## 8. 总资源估算

| Wave | 实验数 | 纯开发工时 | +30% 缓冲 | 修正后（含发布工作） | 等效全职周数 |
|------|--------|----------|----------|-----------|-----------|
| 准备 Sprint | — | — | — | **6-8h** | — |
| Wave 9 | 10 | 67h | 87h | **93-104h**（含发布 3-4h） | ~2.5 周 |
| Wave 10 | 12（ES-09降P2） | 95h | 124h | **163-184h**（含发布 3-4h） | ~4 周 |
| Wave 11 | 22 | 128h | 166h | **173-194h**（含发布 3-4h） | ~4.5 周 |
| Wave 12 | 24 | 167h | 217h | **233-264h**（含发布 3-4h） | ~6 周 |
| **合计** | **68** | **457h** | **594h** | **668-754h（中值 720-750h）** | **~18-19 周** |

**修正说明**：
- v1 估算 610h / 15 周 → Round-1 CTO 修正为 690h / 17-18 周（+13%）
- Round-2 评审大会修正为 **720-750h / 18-19 周**（新增两类漏算工时）
- Three.js 3D 实验首次调试成本被系统性低估（+20-30%/实验）
- Earth Science 首目录额外搭建开销 ~4h
- AP-C 向量场可视化（P-83/P-84/P-87）各增加 30% buffer
- **新增：每 Wave 发布工作**（version bump + Vercel 部署验证 + sitemap 更新 + 缩略图批量触发）~3-4h/Wave × 4 = +14h
- **新增：准备 Sprint**（变更 A/B/C/F + PR 模板）~6-8h
- **M1（170 个）** 仍可在约 3 个月实现（Wave 9+10 完成 = 126+12=138，Wave 11 前半段 = 169+）
- **M2（200 个）** 对应调整为 +5.5 个月（原 +5 个月）

## 9. 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| **OrbitControls 技术债在 Wave 10/12 引爆** | 🔴 高 | 🔴 高 | 硬性前置：**Sprint 9.1 结束前**必须落地预编译方案；否则 Sprint 9.2 只做 2D 实验（C-14~C-17），C-11/C-12/C-13 顺延 |
| html-map + registry 不同步导致 404 | 🟡 中 | 🟡 中 | Wave 9 Sprint 9.1 同步添加 registry 完整性测试（变更 C） |
| AP-C 向量场物理准确性不足 | 🟡 中 | 🔴 高 | Wave 12 AP-C 实验 PR 必须附对照 FRQ 验证截图 |
| ES-09 Ocean Currents 流体仿真超时 | — | — | **已决策降为 P2**，不在 Wave 10 执行 |
| Wave 类型扩展影响现有查询 | 🟢 低 | 🟡 中 | 仅改 union type，不涉及 DB 字段 |
| Gemini API 缩略图批量生成失败 | 🟡 中 | 🟢 低 | 学科色块 placeholder（非空白）先行上线 |
| Chemistry HTML 化学准确性错误 | 🟡 中 | 🟡 中 | PR 必须包含数据溯源记录（D4 修正，SOP Step 5） |
| AP Chemistry P0 延误影响付费转化 | 🟡 中 | 🔴 高 | Wave 9 最高优先级，Sprint 9.1 最晚本周启动 |

## 10. 测试策略

### 10.1 数据文件单元测试

每个新实验的 `.ts` 数据文件需要类型校验测试：

```typescript
// tests/unit/experiments/wave9-chemistry.test.ts
import { balancingChemicalEquations } from "@/shared/lib/experiments/data/balancing-chemical-equations";

describe("Wave 9 Chemistry experiments", () => {
  it("balancing-chemical-equations has valid structure", () => {
    expect(balancingChemicalEquations.primaryStandard).toBe("ap-chemistry");
    expect(balancingChemicalEquations.wave).toBe(9);
    expect(balancingChemicalEquations.standards.ap.length).toBeGreaterThan(0);
  });
});
```

### 10.2 registry 完整性测试

扩展现有 registry 测试：

```typescript
// 新增断言：Wave 9 完成后 chemistry subject >= 20
const chemExpCount = getAllExperiments().filter(e => e.subject === "chemistry").length;
expect(chemExpCount).toBeGreaterThanOrEqual(20);
```

### 10.3 HTML 渲染 E2E

每个 Wave 完成后，Playwright 增加 smoke test：

```typescript
// tests/e2e/wave9-chemistry.spec.ts
test("balancing-chemical-equations renders without error", async ({ page }) => {
  await page.goto("/experiments/balancing-chemical-equations");
  await expect(page.locator('[data-testid="experiment-iframe"]')).toBeVisible();
  // 截图保存到 test-screenshots/
  await page.screenshot({ path: "test-screenshots/balancing-chemical-equations-qa.png" });
});
```

测试文件位置：`tests/e2e/wave9-chemistry.spec.ts`（每 Wave 独立文件）

## 11. CTO 决策清单

### Decision 1：Wave 类型扩展方式

**方案 A（推荐）**：Union type 扩展到 12
```typescript
export type Wave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
```
- 优点：类型安全，TS 编译报错即发现越界赋值
- 缺点：每次新 Wave 都要改类型文件

**方案 B**：改为 `number`
- 优点：不用改类型文件
- 缺点：失去类型约束，wave: 99 不报错

**推荐**：A。Wave 扩展频率低（每季度），类型安全价值高于改动成本。

### Decision 2：Earth Science HTML 目录命名

**方案 A（推荐）**：`public/experiments/earth-science/`
- 与学科名一致，直观

**方案 B**：`public/experiments/ngss-hs/`
- 按标准分类，但混用了不同命名逻辑

**推荐**：A。其他目录（ap-chemistry/ap-biology）均按学科命名，一致性优先。

### Decision 3：Wave 9 优先于 OrbitControls 修复？

**上下文**：当前 OrbitControls 不稳定问题（已有方案：预编译到 public/lib/）未落地，而 Wave 9 Chemistry 实验均不依赖 OrbitControls（2D Canvas 为主）。

**方案 A（采纳）**：Wave 9 Chemistry 先并行开发，OrbitControls 修复单独进行
- Chemistry 10 个实验全部是 2D Canvas 或简单 Three.js，不受影响
- 两条线互不阻塞

**方案 B**：先解决 OrbitControls，再开 Wave 9
- 保守，但会延误 Chemistry 进度 1-2 周

**裁决**：采纳方案 A，**附加硬性截止条件**：

> ⛔ **OrbitControls 预编译方案（预编译到 `public/lib/`）必须在 Sprint 9.1 结束前落地。**（Round-2 评审大会将截止时间从"Sprint 9.2 开始前"提前为"Sprint 9.1 结束前"，提供更保守的缓冲）
> Wave 10 Earth Science 3D 实验（ES-08 rock-cycle、ES-12 plate-tectonics-advanced）和 Wave 12 AP-C 实验均重度依赖 Three.js + OrbitControls。若未在 Sprint 9.1 结束前修复，Sprint 9.2 只允许开发非 Three.js 实验（C-14 Beer's Law / C-15 Dilutions / C-16 Stoichiometry / C-17 Calorimetry），C-11/C-12/C-13 顺延。

### Decision 4：Chemistry HTML 质量标准

新 Chemistry 实验的化学公式/数据准确性如何保证？

**方案 A（采纳，已修正）**：开发时参考 PhET 对应实验 + AP Chemistry 教科书（Zumdahl Chemistry 10th）作为数据源，以 **PR description 数据溯源记录**替代模糊的"内部 review"

**方案 B**：外包学科审核（$$）

**裁决**：采纳方案 A，但"内部 review"定义过于模糊。**修正为强制数据溯源机制**：

> 每个 Chemistry/Earth Science/AP-C 实验的 PR description 必须包含如下格式的溯源记录，缺失则 PR 不允许合并：
>
> ```
> 数据来源：
> - 公式参数范围：Zumdahl Chemistry 10th, Chapter {X}, Table {Y}
> - 对标实验：PhET "{实验名}" https://phet.colorado.edu/...（或 "无对应 PhET 实验"）
> - AP 考纲对应：AP Chemistry 2025 CED Unit {N}, Learning Objective {X}
> ```
>
> 对于 Wave 12 AP-C 实验（P-83 Gauss Law 等），PR 还需附对照 AP Physics C FRQ 真题验证截图，确认模拟输出与期望物理行为一致。

### Decision 5：缩略图生成时机

**方案 A（推荐）**：HTML 实验完成 QA 后，批量调用 Gemini API 生成缩略图（与 66 张存量同一脚本）。每 Wave 完成后批量跑一次。

**方案 B**：先用纯色 placeholder 上线，后补缩略图
- 优点：不阻塞上线
- 缺点：实验库页面颜值下降，首次印象差

**推荐**：A，但允许 24h 内 placeholder 过渡，不影响上线节奏。

### Decision 6：Wave 9 上线节点

Wave 9 完成 10 个 Chemistry 实验后，是否需要等 Wave 10 一起发布，或单独发布？

**方案 A（推荐）**：Wave 9 完成即发布（Chemistry 专项更新）
- 立即获得 AP Chemistry 学生搜索流量
- 每次发布都是营销节点

**方案 B**：Wave 9+10 合并发布
- 一次性发布更大内容包，但延迟 2-3 个月

**推荐**：A。小步快跑，持续发布。

### Decision 7：单文件行数限制与 HTML 实验复杂度

HTML 实验文件（standalone zero-dependency）不受 200 行单文件写入限制约束（它们是独立 HTML，不是 TypeScript 模块）。但复杂 3D 实验（如 Rock Cycle、Ocean Currents）可能达到 800-1200 行 HTML。

**是否需要设置 HTML 实验文件的复杂度上限？**

**方案 A（采纳，已精确化）**：设定复杂度上限，超过则分解为多个交互阶段或降为 P2。
**方案 B**：不设上限，按实验需求写。

**裁决**：采纳方案 A，**将上限精确化为 JS 逻辑行数**（不是 HTML 总行数）：

> **上限规则**：`<script>` 标签内的 JS 逻辑代码（排除静态数据数组、注释、空行）**不超过 600 行**。
> - 静态数据（顶点坐标、预设值数组、颜色映射表）不计入限额
> - CSS 样式不计入限额
> - 超过 600 行 JS 逻辑 → 必须拆分实验阶段 或 降为 P2
>
> 为什么是 JS 逻辑而非总行数：一个 800 行 HTML 里 300 行是顶点数据、实际控制逻辑只有 200 行，这样的实验可维护性完全没问题；反之，500 行全是复杂控制流的实验才是维护噩梦。

ES-09 Ocean Currents 如降为简化版，须保证 JS 逻辑 ≤ 600 行（用 Canvas 粒子流线图替代 Navier-Stokes 精确仿真）。

### Decision 8：AP-C Physics 的 tier 设置

AP Physics C（Gauss、Ampere、RLC 等）是研究生预备水平，用户群极小（每年约 3 万考生，远少于 AP Physics 1 的 30 万）。

**方案 A（推荐）**：tier = "pro"（需订阅才可用）
- 高价值内容，付费壁垒合理
- AP-C 学生通常是高付费意愿群体

**方案 B**：tier = "free"
- 扩大覆盖，但对付费转化贡献有限

**推荐**：A。AP-C 内容设为 Pro 是合理的付费壁垒，对应 AP-C 学生的付费意愿。

## 12. 执行顺序建议

```
准备 Sprint（Wave 9 实验开发前必须完成，约 6-8h）
  └── D1: Wave 类型扩展（1h，src/shared/types/experiment.ts → Wave 1-12）
  └── D2: 创建 earth-science 目录（1min，public/experiments/earth-science/）
  └── 变更 A: 确认所有 getExperimentHtmlPath 调用使用 slug（1h）
  └── 变更 B: registry.ts 导入顺序重排（2-3h）
  └── 变更 C: 添加 registry 完整性测试（2h，tests/unit/experiments/registry-integrity.test.ts）
  └── 变更 F: Experiment 接口增加 htmlPath?: string，替换白名单（1h，更新 ExperimentClient 测试）
  └── 创建 .github/PULL_REQUEST_TEMPLATE.md（含数据溯源 Section 格式，1h）
  └── 验证 data-testid="experiment-iframe" 存在（1h，检查实验详情页 iframe 组件）

Sprint 9.1（准备 Sprint 完成后启动）
  └── C-08 balancing-chemical-equations（4h）
  └── C-09 electron-configuration（8h）
  └── C-10 lewis-structures（8h）
  ⛔ OrbitControls 预编译修复必须在本 Sprint 结束前落地（硬性截止，并行进行）

Sprint 9.2（Sprint 9.1 完成后启动）
  └── 若 OrbitControls 已落地：C-11 build-a-molecule（10h）+ C-12 molecular-polarity（8h）+ C-13 gas-properties（10h）
  └── 若未落地：先做 C-14~C-17（2D 轻量批次 19h），C-11/C-12/C-13 顺延至 Sprint 9.3

Sprint 9.3
  └── C-14 ~ C-17（若未在 9.2 做）+ 正式缩略图批量生成

Wave 9 上线（"上线"定义：代码合并 main + Vercel 生产环境 10 个实验均可访问验证通过）
  └── Chem: 10→20，M1 进度：124/170
  └── 发布工作：version bump + Vercel 部署验证 + sitemap 更新 + 缩略图批量触发（3-4h）
  └── Wave 10 Earth Science 开始

并行进行（不阻塞主线）
  └── ⏰ OrbitControls 预编译修复（截止：Sprint 9.1 结束前，绝对不能拖到 Sprint 9.2）
  └── single-slit-diffraction.html bug 修复
  └── 剩余 48 张存量缩略图补齐
```

## 13. 关键里程碑与验收条件

**"上线"定义**：代码合并 main + Vercel 生产环境部署完成 + 该 Wave 所有实验均可通过 `/experiments/{slug}` 访问（Playwright smoke test 全量通过）。

| 里程碑 | 目标数量 | 触发条件 | 验收条件 | 预计时间 |
|--------|---------|---------|---------|---------|
| 准备 Sprint 完成 | — | 变更 A/B/C/F + PR 模板全部合并 CI 通过 | registry 完整性测试绿 / 无 TS 编译报错 | 本周 |
| Wave 9 上线 | 124 | 10 个 Chem 实验全部 QA 通过 | registry 完整性测试 ✓ / E2E smoke ✓ / 缩略图 ✓ / PR 数据溯源 ✓ / Vercel 生产验证 ✓ | +2.5 周 |
| **P-85 RLC Circuit 启动**（AP-C 早期探针） | — | Wave 11 E2E 全量 smoke 通过后 24h 内 | 启动 P-85 开发（Canvas，无 3D 向量场，10h，tier=pro） | Wave 11 完成后 |
| M1：超越 PhET | 170 | Wave 10 + Wave 11 前半段完成 | `getAllExperiments().length >= 170` 测试通过 | +3 个月 |
| AP Chemistry 全覆盖 | 20 AP Chem 实验 | Wave 9 + Wave 11 Chem 补充 | AP Chem Unit 1-9 覆盖率 ≥ 90% | +3 个月 |
| M2：200 个 | 200 | Wave 11 完成 + Wave 12 部分 | 5 学科各 ≥ 20 个 | **+5.5 个月**（原 +5 月，Round-2 修正后） |
| M3：300 个 | 300 | Wave 12 + UGC 贡献 | — | +10 个月 |

## CTO Review Round-1（已归档，意见已纳入 v2）

**评审人**：CTO
**评审日期**：2026-03-26
**评审范围**：Wave 9-12 课程扩展技术方案（114 → 183 个实验，+69）

### Decision 裁决

**D1: Wave 类型扩展方式**
✅ 批准

方案 A（Union type 扩展到 12）是正确的。从代码库实际看，`Wave` 类型当前是 `1 | 2 | 3 | 4 | 5 | 6 | 7 | 8`，`getExperimentsByWave` 函数的参数类型是 `Wave`，扩展后 TS 编译器会在所有调用点做穷举检查。修正一点：文档说"每次新 Wave 都要改类型文件"是缺点，但这恰恰是优点——强制开发者意识到扩展是有意行为。不需要加任何注释说明缺点。

**D2: Earth Science HTML 目录命名**
✅ 批准

`public/experiments/earth-science/` 命名正确。与 `ap-chemistry`、`ap-biology`、`elementary`、`middle` 等目录的命名逻辑一致（学科 + 层级）。`ngss-hs/` 方案混入了标准体系命名，会与 `primaryStandard` 字段的语义重叠，拒绝。

**D3: Wave 9 优先于 OrbitControls 修复**
✅ 批准，附加一个强制条件

Wave 9 Chemistry 实验均为 2D Canvas 或简单 Three.js，与 OrbitControls 无关，可以并行。但有一个强制条件：**OrbitControls 修复必须设定截止时间，不能无限期"并行"**。建议：Wave 9 Sprint 9.2 开始前，OrbitControls 预编译方案必须落地（有 19 个现有实验依赖它）。拖到 Wave 10 地球科学 3D 实验（rock-cycle、plate-tectonics-advanced）时再修复会很被动。

**D4: Chemistry HTML 质量标准**
⚠️ 修正 — 内部 review 流程需明确责任人

方案 A 方向对，但"内部 review"定义模糊。当前阶段 Scivra 是 bootstrap 团队，没有化学顾问，那"内部 review"等于没有 review。修正：每个 Chemistry 实验交付时，必须在 PR description 中列出参考数据源（具体教材章节或 PhET 对应实验的参数范围），作为可追溯的质量证据，而不是口头声称参考过 Zumdahl。这不增加工时，只是将模糊的"内部 review"替换为可验证的数据溯源记录。

**D5: 缩略图生成时机**
✅ 批准

方案 A 的节奏合理：QA 通过后批量生成，允许 24h placeholder 过渡。一个补充：placeholder 不要用空白图，用统一的学科色块（Chemistry 用橙色背景 + 学科图标），避免实验库页面出现破损感。这是 10 分钟的工作，不影响工时估算。

**D6: Wave 9 上线节点**
✅ 批准

小步快跑是对的。每次发布都是 SEO 节点（AP Chemistry 相关关键词），等 Wave 10 合并发布会浪费 2-3 个月的搜索索引时间。Wave 9 完成即发布，不等 Wave 10。

**D7: HTML 实验文件复杂度上限**
⚠️ 修正 — 上限定义需要精确化

800 行上限方向对，但需要区分"功能行"和"数据行"。一个 Three.js 实验 800 行里可能 300 行是顶点坐标数据，实际控制逻辑只有 200 行。建议将上限定义为：**JS 逻辑（排除静态数据数组、CSS）不超过 600 行**。超过则必须拆分为多个交互阶段或降为 P2。

ES-09 Ocean Currents（16h，流体粒子仿真）的定性评估是正确的：应降为 P2，Wave 11 用简化粒子模型（格子玻尔兹曼简化版或纯 Canvas 流线图，而非物理精确 Navier-Stokes）替代。

**D8: AP-C Physics 的 tier 设置**
✅ 批准

AP-C 设为 `pro` tier 是合理的付费壁垒。AP-C 学生群体（约 3 万/年 vs AP-1 的 30 万/年）虽然体量小，但付费意愿极强——能考 AP-C 的学生通常有明确的大学竞争目标，$4.99/月对他们不构成阻力。这也是一个信号：如果 AP-C 实验的 Pro 转化率低于 AP-1，说明这部分用户在别处有更好的资源，数据会告诉我们该调整。

### 遗漏的技术变更

以下变更在文档中未提及，但是必要的：

**1. `html-map.ts` key 命名一致性问题（优先级：高）**

Wave 9-11 中存在两类 K5 实验命名模式：当前 `html-map.ts` 中 K5 实验用 `k5-force-motion` 格式，但 Wave 11 数据（Section 6.2）列出的 K5 ID 是 `K5-12`、`K5-13`……这种大写 ID 与现有 slug（全小写 kebab-case）的混用，如果不明确区分 `id` 字段和 `slug` 字段，会导致 `html-map.ts` 的 key lookup 失败（因为 `getExperimentHtmlPath` 是按 `id` 查询的）。

**必须在 SOP 中明确**：`html-map.ts` 的 key 始终使用 `slug`（全小写 kebab-case），`id` 可以是大写格式（`K5-12`），但 HTML map lookup 必须用 `slug` 而不是 `id`。检查 `getExperimentHtmlPath` 的调用处，确认传入的是 slug 还是 id。

**2. `registry.ts` 的导入顺序管理（优先级：中）**

当前 registry.ts 已有 ~70 个 import 语句，无结构化排序（Wave 8 插在最前，Wave 1 注释反而在中间）。Wave 9-12 再加 69 个 import 后，文件将变为 130+ import，变更追踪困难。建议在 Wave 9 开始前，按 Wave 编号重排 import 和数组注册顺序，一次性整理，后续每个 Wave 追加到末尾。

**3. `primaryStandard` 类型不覆盖 `ngss-k5`（优先级：低但需决策）**

Wave 11 K5 新实验（K5-12 到 K5-19）的 `primaryStandard` 是什么？当前类型定义中只有 `"elementary-k5"`，Wave 10 的 Earth Science 实验使用 `"ngss-hs"` 或 `"ngss-ms"`，两者是不同的路由分组。K5-12（k5-chemical-changes）应当用 `"elementary-k5"`，但 K5-14（k5-weather-patterns）是 Earth Science 学科，如果也用 `"elementary-k5"` 作为 primaryStandard，则 `getExperimentsByStandard("ngss-hs")` 无法找到它。这个分类问题在文档中未明确，实施前需要决策。

**4. Wave 10 Earth Science 目录与 `ms-plate-tectonics`（slug 冲突检查）**

ES-12 的 slug 是 `plate-tectonics-advanced`，与现有 MS-05（`ms-plate-tectonics`）相关但不冲突。但 ES-13（`solar-system-scale`）和现有 `my-solar-system`（Wave 8，ap-physics 目录下）需要确认没有 registry 中的 slug 重复。建议在 Wave 10 开发前，跑一次 registry 的 slug 唯一性测试断言。

**5. E2E 测试中的 `data-testid` 依赖（优先级：中）**

Section 10.3 的 E2E smoke test 依赖 `[data-testid="experiment-iframe"]`，但文档未说明这个 testid 是否已经存在于实验详情页的 iframe 组件中。如果不存在，E2E 测试会静默失败（locator 找不到元素但 `toBeVisible` 不一定报错）。实施 Wave 9 E2E 测试前必须确认这个 testid 的存在。

### 工时评估意见

总体评估：**工时估算偏乐观，存在结构性低估**。

| Wave | 文档估算（+30%缓冲后） | CTO 调整意见 | 调整原因 |
|------|--------------------|------------|---------|
| Wave 9 | 87h | 90-100h | C-11 build-a-molecule（Three.js 3D）和 C-12 polarity 是 Chemistry 中复杂度最高的，10h/8h 基础估算偏低，Three.js 分子 3D 首次调试通常需要额外 20-30% |
| Wave 10 | 140h | 160-180h | ES-09 Ocean Currents 即便降为 P2，其余 3D 实验（ES-08 rock-cycle Three.js、ES-12 plate-tectonics-advanced）各 10-12h 基础估算是乐观的；Earth Science 是新目录，首个实验有框架搭建开销（约 4h overhead）；每个 Wave 的"首个"实验会额外消耗目录和工具链搭建时间 |
| Wave 11 | 166h | 170-190h | B-16 cell-structure-3d（12h Three.js 3D 细胞）是 Biology 中最复杂的，MS-16/17 的 Physics advanced 实验（各 8h）基本合理 |
| Wave 12 | 217h | 230-260h | P-83 Gauss Law 和 P-84 Ampere's Law（各 14h）是整个 Wave 9-12 中最复杂的实验，涉及 3D 向量场可视化，14h 对于首次做这类实验是乐观的；P-87 angular-momentum-3d 同样 |
| **合计** | **610h** | **650-730h** | 超出约 7-20%，按中值 690h，约 17.5 全职周 = 4.4 个月 |

建议：**将原来 15 周的计划修正为 17-18 周**，M1（超越 PhET）里程碑可以维持在约 3 个月实现，但 Wave 12 AP-C 完成可能需要推迟 2-3 周。

### Top 3 风险

**风险 1：OrbitControls 技术债在 Wave 10/12 引爆（概率：高，影响：高）**

当前 OrbitControls 不稳定是已知问题，已有 19 个实验受影响。Wave 10 的 ES-08（rock-cycle）、ES-12（plate-tectonics-advanced）、ES-09（ocean-currents）都是 3D 实验，Wave 12 的 AP-C 实验（gauss-law、angular-momentum-3d）也是 3D 重度使用者。如果 OrbitControls 预编译方案在 Wave 9 Sprint 9.2 前未落地，这些实验将在开发过程中持续踩坑，估算工时会严重失真。

**缓解措施**：将 OrbitControls 预编译修复设定为硬性前置条件——Wave 9 Sprint 9.2 开始前必须完成，否则 Sprint 9.2 只开发非 3D 实验（C-14 to C-17 轻量批次）。

**风险 2：`html-map.ts` + `registry.ts` 的维护成本随规模指数上升（概率：中，影响：中高）**

当前这两个文件的维护模式是"手动 import + 手动数组注册"，130+ 实验后会出现：遗漏注册（实验有 HTML 但没在 registry 中，导致 404）、重复注册（registry 中有两个相同 slug）、html-map 和 registry 不同步（实验在 registry 但 html-map 没有路径）。这类 bug 在大规模扩展中必然出现，且运行时才暴露。

**缓解措施**：Wave 9 开始前，添加一个 registry 完整性测试：断言所有注册实验的 slug 都能在 html-map 中找到路径（或明确没有 HTML 的实验）；断言 registry 中没有重复 slug。这是一次性 ~2h 工作，可以防止之后数十次手动错误。

**风险 3：Three.js 复杂 3D 实验（AP-C）的物理准确性（概率：中，影响：高）**

P-83 Gauss Law 和 P-84 Ampere's Law 的 3D 向量场可视化在物理教育中是出了名难以"看起来对"的——向量的长度、颜色映射、积分面的绘制都有大量约定，做错了学生会得出错误的物理直觉。PhET 的对应模拟（charges-and-fields、magnets-and-electromagnets）花了大量时间在这个问题上。当前方案 D4 的质量保证措施对于 AP-C 这个层次是不够的。

**缓解措施**：AP-C 实验（Wave 12 P-83 到 P-87）开发完成后，强制要求开发者对照 AP-C 官方考纲（College Board AP Physics C: E&M FRQ）中的典型题目验证模拟输出与期望答案一致，并在 PR description 中附上验证截图。这不增加工时，只是将质量门从"看起来能跑"升级为"和考纲对齐"。

### 总结裁决

**可以开始执行**，附以下条件：

1. Wave 9 Sprint 9.2 开始前：OrbitControls 预编译方案必须落地（硬性前置条件）
2. Wave 9 开始前（可以与 Sprint 9.1 并行）：添加 registry 完整性测试（slug 唯一性 + html-map 覆盖率断言）
3. Section 2.4 的 `html-map.ts` lookup key 必须明确使用 slug 而非 id，并检查所有 `getExperimentHtmlPath` 调用处
4. Wave 11 K5 新实验的 `primaryStandard` 分类决策需要在 Wave 11 开发前明确（`elementary-k5` vs 新增学科专属标准）
5. 工时基线从 610h 修正为 690h（17.5 周），M2（200 个实验）里程碑对应调整

8 个 Decision 中 6 个批准，2 个有条件修正（D3 附加强制截止条件，D4 要求数据溯源记录，D7 精确化上限定义）。方案整体方向正确，技术选型无重大问题。最大风险点是 OrbitControls 技术债，必须在进入 3D 密集的 Wave 10 之前清偿。

CTO Review: 2026-03-26

---

## 评审大会决议（Round-2）

**会议形式**：三专家圆桌 · 技术架构师（T）× 商业分析师 PM（B）× 工程 Lead（P）
**评审版本**：v2（已纳入 CTO Round-1 全部修正意见）
**评审范围**：7 项议题全覆盖
**日期**：2026-03-26

### 专家立场摘要

**T（技术架构师）核心观点**

方案 v2 有三处真正有价值的改进（html-map key 统一、registry 完整性测试、OrbitControls 硬性截止），但有两个新问题：
1. Section 2.3 `earth-science` 目录命名规范写的是 `{primaryStandard}-{slug}.html`，与 `ap-chemistry` 目录（无前缀）不一致，是文档内部矛盾，必须在 Wave 10 前统一；
2. registry 完整性测试的 Wave-1 白名单是硬编码的，随项目迭代需手动维护——更好的方案是在 `Experiment` 接口增加 `htmlPath?: string` 可选字段（变更 F），无此字段走 RTF 渲染，有此字段走 HTML iframe，测试和渲染逻辑都自然收敛，消灭白名单。

对 Sprint 9.1 工作量也有疑虑：变更 A/B/C 与 3 个实验开发混在一起，是两种模式的频繁切换，建议独立为"准备 Sprint"。

**B（商业分析师 PM）核心观点**

整体方向正确，Chemistry P0 优先和 Wave 9 独立发布的决策没有问题。

单点异议：Wave 12 AP-C 全部排到最后代价太大——AP-C 学生是付费意愿最强的群体，P-85 RLC Circuit（最简单 AP-C 实验，Canvas 实现，不涉及 3D 向量场，工时 10h）没有理由等到 Wave 12 才做。建议 Wave 11 E2E 全量通过后立即启动 P-85，作为 AP-C 付费信号的早期探针。M1（超越 PhET）的 3 个月目标是 tight 但可达的，需要 OrbitControls 不阻塞 Wave 9 节奏。

**P（工程 Lead）核心观点**

方案里漏了两类工时：①每 Wave 的发布工作（version bump + Vercel 部署验证 + sitemap 更新 + thumbnail 批量触发），约 3-4h/Wave，4 个 Wave 合计 +14h；②PR 数据溯源机制没有配套的 `PULL_REQUEST_TEMPLATE.md`，会产生大量格式不规范的记录，变成形式主义。

Sprint 9.1 四线并行的工作量评估：文档写 20h，实际变更 A/B/C 就要 4-5h，三个实验留 15h（C-09 电子排布 8h 已经偏紧），这个 Sprint 没有任何 buffer。

总工时应从 690h 修正为 **720-750h（约 18-19 周）**。

### 议题裁决

| 议题 | T 立场 | B 立场 | P 立场 | 大会裁决 |
|------|--------|--------|--------|---------|
| D3 OrbitControls 截止时间 | Sprint 9.1 结束（比文档更保守） | 不关心具体节点，关心不影响 M1 | 支持提前截止，Sprint 9.1 已满 | **采纳 T：截止时间改为 Sprint 9.1 结束** |
| Wave 9 Chemistry 排序 | 无异议 | 排序基本合理，C-09 电子排布有高搜索量，保持在 Sprint 9.1 对 | 支持，但 Sprint 9.1 工作量需拆分 | **采纳：排序不变，拆出准备 Sprint** |
| 工时估算 | 690h 合理，但未含变更 F 和发布工作 | 关注 M1 时间线 | 720-750h，18-19 周 | **采纳 P：修正为 720-750h / 18-19 周** |
| PR 数据溯源机制 | 支持，低成本高收益 | 支持，但需要模板防止形式化 | **必须配 PR 模板，否则形同虚设** | **采纳 P：Wave 9 准备 Sprint 中创建 PR 模板** |
| Wave 9 独立发布（D6） | 支持 | 强烈支持 + 建议配套营销内容 | 支持，但要明确"上线"定义 = main 合并 + Vercel 部署验证通过 | **一致批准，补充发布定义** |
| registry 完整性测试（变更 C） | 采纳变更 F 替换白名单 | 不涉及 | 变更 F 会影响现有测试，需要评估 | **采纳变更 F，T 确认影响面仅 ExperimentClient 单元测试** |
| 总体可执行性 | 有条件批准（6 个条件） | 有条件批准（加 P-85 早期启动） | 有条件批准（加 PR 模板 + 工时修正） | **有条件批准** |

### 保留分歧

**P-85 RLC Circuit 提前启动时机（B vs T）**

- B：Wave 11 E2E 全量通过后立即启动 P-85（付费信号价值 > 等待 buffer）
- T：必须 Wave 11 全量 E2E smoke 通过后再开新 Wave 的开发

**主持人裁决**：两者没有实质矛盾——T 的条件（"Wave 11 全量 E2E 通过"）和 B 的诉求（"通过后立即启动"）完全相容。P-85 在 Wave 11 E2E 全量通过的 **24h 内** 可以启动，不需要额外等待。**分歧消解，采纳 B+T 的合并立场。**

### 新增 v2 → v3 修正项

以下条目需要在文档 v3 中体现（本次大会决议超出原文档范围的新增部分）：

| # | 修正项 | 影响章节 | 紧急程度 |
|---|-------|---------|---------|
| F1 | earth-science 目录命名：删除 `{primaryStandard}-` 前缀规范 | Section 2.2 / 5.2 | Wave 10 前 |
| F2 | 变更 F：Experiment 接口增加 `htmlPath?: string`，替换 html-map 白名单 | Section 2.8 | 准备 Sprint |
| F3 | 新增准备 Sprint（变更 A/B/C/F + PR 模板），独立于 Sprint 9.1 | Section 4.2 / 12 | 本周 |
| F4 | 创建 `PULL_REQUEST_TEMPLATE.md`（含数据溯源格式） | Section 3 / 12 | 准备 Sprint |
| F5 | 每 Wave 发布工作计入工时（3-4h/Wave × 4 = +14h） | Section 8 | 立即修正 |
| F6 | 总工时修正：690h → 720-750h（中值 735h），18-19 周 | Section 8 | 立即修正 |
| F7 | OrbitControls 硬性截止：从"Sprint 9.2 开始前"改为"Sprint 9.1 结束前" | Section 4.2 / 9 / 12 | 本周 |
| F8 | P-85 RLC Circuit 启动条件：Wave 11 E2E 全量通过后 24h 内可启动 | Section 13 | Wave 11 后 |
| F9 | "上线"定义明确：代码合并 main + Vercel 部署验证通过（10 个实验均可访问） | Section 12 / 13 | Wave 9 前 |

### 最终决议

**🟢 方案有条件批准，可以进入执行。**

满足以下 6 个条件后，Wave 9 Sprint 9.1 可以启动：

1. ✅ **准备 Sprint 完成**：变更 A/B/C/F + PR 模板（`PULL_REQUEST_TEMPLATE.md`）全部完成，registry 完整性测试在 CI 通过
2. ✅ **earth-science 命名规范统一**：Section 2.2/5.2 中 `{primaryStandard}-` 前缀规范删除
3. ✅ **总工时修正**：Section 8 更新为 720-750h / 18-19 周
4. ⛔ **OrbitControls 截止时间**：硬性截止从"Sprint 9.2 开始前"改为"Sprint 9.1 结束前"；若未完成，Sprint 9.2 只做 2D 实验（C-14~C-17），C-11/C-12/C-13 顺延
5. ✅ **Wave 11 → AP-C 早期信号**：Wave 11 E2E 全量通过后 24h 内启动 P-85 RLC Circuit（AP-C 付费信号探针）
6. ✅ **上线定义明确**：每个 Wave "上线" = 代码合并 main + Vercel 生产环境 10 个实验均可访问验证通过

**方案核心方向（不需要修改）**：Chemistry P0 优先 ✓ / Wave 9 独立发布 ✓ / AP-C = Pro tier ✓ / Wave 类型 Union type 扩展 ✓ / earth-science 目录 ✓ / PR 数据溯源机制 ✓ / JS 逻辑 ≤ 600 行 ✓

**签署**

| 角色 | 立场 | 签署 |
|------|------|------|
| 技术架构师（T） | 有条件批准（F2/F7 为必要条件） | ✅ |
| 商业分析师 PM（B） | 有条件批准（F8 为商业必要条件） | ✅ |
| 工程 Lead（P） | 有条件批准（F3/F4/F5/F9 为执行必要条件） | ✅ |

评审大会: 2026-03-26 | 文档版本: v3（F1-F9 全部纳入主文档，2026-03-26T08:30Z）
