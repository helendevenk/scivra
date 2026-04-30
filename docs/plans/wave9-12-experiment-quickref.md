---
name: wave9-12-experiment-quickref
status: historical-plan
snapshot_date: '2026-03-26'
created: '2026-03-26T09:15:00Z'
updated: '2026-04-23T00:00:00Z'
type: reference
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-03-26. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# Wave 9-12 单实验开发快速参考

> 完整规范见 `docs/plans/2026-03-26-curriculum-wave9-12-cto-review.md`
> 本文档是每次开发一个实验时的速查手册

## 7 步 SOP（缺一不可）

```
Step 1  src/shared/lib/experiments/data/{slug}.ts     ← 数据文件
Step 2  public/experiments/{dir}/{slug}.html          ← HTML 模拟（遵守视觉规范）
Step 3  src/shared/lib/experiments/html-map.ts        ← 添加 slug → path 映射
Step 4  src/shared/lib/experiments/registry.ts        ← 按 Wave 顺序追加 import + 注册
Step 5  PR description 数据溯源（用 PULL_REQUEST_TEMPLATE.md 格式）
Step 6  public/imgs/experiments/{slug}.png            ← 缩略图（可先用学科色块）
Step 7  pnpm test → registry 完整性测试通过 + QA 截图
```

## 验收 checklist

- [ ] `body { background: #0f172a }` — 不是 `#0a0e1a`
- [ ] 面板边框颜色使用正确学科 rgba（见下）
- [ ] `<title>` 含 "Scivra"，不含 "NeonPhysics"
- [ ] 布局：全屏 canvas + ui overlay（非滚动页面）
- [ ] Three.js r134（如使用）/ KaTeX 0.16.9
- [ ] JS 逻辑 ≤ 600 行（不含静态数据数组和 CSS）
- [ ] id === slug（全小写 kebab-case）
- [ ] wave: 9|10|11|12（已在类型中扩展）

## 学科颜色速查

| subject | 主色 | 淡色 | Panel border rgba | button bg rgba |
|---------|------|------|------------------|---------------|
| chemistry | `#10b981` | `#6ee7b7` | `rgba(16,185,129,0.25)` | `rgba(16,185,129,0.12)` |
| earth-science | `#f97316` | `#fed7aa` | `rgba(249,115,22,0.25)` | `rgba(249,115,22,0.12)` |
| biology | `#84cc16` | `#d9f99d` | `rgba(132,204,22,0.25)` | `rgba(132,204,22,0.12)` |
| physics | `#3b82f6` | `#93c5fd` | `rgba(59,130,246,0.25)` | `rgba(59,130,246,0.12)` |
| math | `#8b5cf6` | `#c4b5fd` | `rgba(139,92,246,0.25)` | `rgba(139,92,246,0.12)` |

## CDN 版本锁定

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>
<script src="/lib/orbit-controls.js"></script>  <!-- 3D 旋转时，预编译落地后才用 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
```

## 数据文件模板关键字段

```typescript
export const {camelCaseSlug}: Experiment = {
  id: "{slug}",          // 必须与 slug 相同
  slug: "{slug}",
  wave: 9,               // 9 | 10 | 11 | 12
  subject: "chemistry",  // 五选一
  gradeLevel: "AP",      // "AP" | "6-8" | "K-5" | "college"
  primaryStandard: "ap-chemistry",
  tier: "free",          // AP-C 用 "pro"
  htmlPath: "/experiments/ap-chemistry/{slug}.html",  // Change F 新增字段
  // ... parameters / formulas / challenges / standards
};
```

## Wave 9 实验列表

| ID | Slug | Sprint | 工时 | 特殊说明 |
|----|------|--------|------|---------|
| C-08 | balancing-chemical-equations | 9.1 | 4h | 2D Canvas，无 Three.js |
| C-09 | electron-configuration | 9.1 | 8h | Canvas + Bohr 轨道动画 |
| C-10 | lewis-structures | 9.1 | 8h | SVG 键型绘制 |
| C-11 | build-a-molecule | 9.2 | 10h | Three.js 3D，需 OrbitControls 落地 |
| C-12 | molecular-polarity | 9.2 | 8h | Three.js 电荷云，需 OrbitControls 落地 |
| C-13 | gas-properties | 9.2 | 10h | Canvas 粒子模拟 |
| C-14 | beers-law-lab | 9.3 | 5h | Canvas 颜色插值 |
| C-15 | solutions-dilutions | 9.3 | 4h | Canvas 溶液浓度 |
| C-16 | stoichiometry | 9.3 | 5h | Canvas + 原子计数 |
| C-17 | calorimetry | 9.3 | 5h | Canvas 温度曲线 |

## 关键文件路径

```
src/shared/types/experiment.ts          ← Experiment 接口（含 htmlPath?）
src/shared/lib/experiments/registry.ts  ← 实验注册表（按 Wave 顺序）
src/shared/lib/experiments/html-map.ts  ← slug → HTML 路径映射
public/experiments/ap-chemistry/        ← Wave 9 HTML 存放位置
tests/unit/experiments/                 ← registry 完整性测试
.github/PULL_REQUEST_TEMPLATE.md        ← PR 数据溯源模板
```
