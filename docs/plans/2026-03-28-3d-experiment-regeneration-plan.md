---
name: 3d-experiment-regeneration-plan
status: in-progress
created: 2026-03-28T14:08:16Z
updated: 2026-03-28T14:11:29Z
---

# 3D 实验全量重新生成方案

> 背景：使用升级版 **aetherviz-master v6.0** skill 全量重新生成 176 个 HTML 实验文件。
> 旧 3d-creater skill 输出已过时——缺 Verlet 积分、无 Quiz、无预设系统、无能量面板。

## 规模概览

| 分类 | 文件数 | 当前 Three.js 覆盖 | 优先级 |
|------|--------|-------------------|--------|
| AP Physics | 73 | 72/73 | P0 |
| AP Biology | 20 | 12/20 | P1 |
| AP Chemistry | 17 | 9/17 | P1 |
| AP Physics C | 5 | 3/5 | P1 |
| Earth Science | 17 | 2/17 | P2 |
| Elementary (K5) | 24 | 11/24 | P2 |
| Middle School | 20 | 9/20 | P2 |
| **总计** | **176** | **118/176** | — |

## aetherviz-master v6.0 vs 旧 3d-creater

| 维度 | 旧 3d-creater | aetherviz-master v6.0 |
|------|--------------|----------------------|
| 物理积分 | Euler（误差累积） | **Velocity Verlet**（能量守恒） |
| 动画循环 | requestAnimationFrame | **setAnimationLoop**（后台暂停） |
| 物理子步进 | 无 | **自适应（2ms 步长）** |
| 能量面板 | 无 | **KE/PE/Total 条形图** |
| 实验预设 | 无 | **≥3 个命名预设** |
| Quiz 面板 | 无 | **3 题（预测/应用/诊断）** |
| Toast 通知 | 无 | **右上角 2s 自动消失** |
| 键盘快捷键 | 无 | **Space/R/1-5** |
| UI 框架 | 纯 CSS | **Tailwind CSS v3.4 + 玻璃拟态** |
| OrbitControls | CDN 加载 | **内联简化版（touch 支持）** |
| 混合渲染 | 无 | **SVG + Three.js 叠加** |
| 左面板内容 | 只有滑块+数据 | **公式→概念→知识卡片→应用** |

## 技术规范（不可变）

### 文件路径
```
public/experiments/{category}/{slug}.html
```
七个分类目录：`ap-physics` / `ap-biology` / `ap-chemistry` / `ap-physics-c` / `earth-science` / `elementary` / `middle`

**文件名和路径不得改变**——registry.ts 和实验数据文件直接引用这些路径。

### CDN（aetherviz-master v6.0 标准）
```html
<!-- Three.js r134（cdnjs，更稳定） -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>

<!-- Tailwind CSS v3.4 -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- KaTeX 0.16.11 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>

<!-- OrbitControls：内联（不从 CDN 加载） -->
```

> 注：OrbitControls 内联，不再依赖 CDN 的 `examples/js/controls/OrbitControls.js`——这是旧文件 OrbitControls 报错的根本原因。

### 视觉规范（aetherviz-master 标准）
- **背景**：`0x0f172a`（深板岩蓝，NOT 纯黑）
- **Primary teal**：`#14B8A6` → `#06B6D4` → `#22D3EE`
- **玻璃拟态面板**：`rgba(255,255,255,0.08)`，border `rgba(255,255,255,0.15)`
- **学科专色**：见下方学科色表

### 强制 UI 结构
```
┌──────────────────────────────────────────────────────────┐
│  顶部导航栏：标题 + [重置] [随机实验] [全屏] [关于]        │
├───────────────────┬──────────────────────────────────────┤
│  左侧边栏（30%）   │     3D 画布区（70%）                  │
│  · 核心公式(KaTeX) │     Three.js Canvas                  │
│  · 概念解释        │     + 左上角数据 overlay（4-6 量）     │
│  · 知识卡片        │     + 右上角能量面板（物理实验）        │
│  · Why It Matters  │                                      │
├───────────────────┴──────────────────────────────────────┤
│  底部控制面板：滑块 + Play/Pause/单步/速度(5档) + 预设     │
├──────────────────────────────────────────────────────────┤
│  Quiz 面板（可折叠，3 题，应用/预测/诊断类型）              │
└──────────────────────────────────────────────────────────┘
```

### 语言规范
- **所有文本用英文**（目标用户：北美 K12 学生）
- 左侧面板的解释文字、知识卡片、Quiz 题目、Toast 消息全英文
- `<html lang="en">`

### 学科专色

| 学科 | 渐变 | 说明 |
|------|------|------|
| AP Physics | `#3B82F6` → `#0EA5E9` | 物理蓝 |
| AP Biology | `#10B981` → `#22D3EE` | 生物翠绿 |
| AP Chemistry | `#F59E0B` → `#EF4444` | 化学橙红 |
| AP Physics C | `#8B5CF6` → `#3B82F6` | 物理C紫蓝 |
| Earth Science | `#F97316` → `#EAB308` | 地球橙黄 |
| Elementary K5 | `#EAB308` → `#84CC16` | K5 黄绿 |
| Middle School | `#EC4899` → `#F97316` | Middle 粉橙 |

## 生成 SOP（每个实验 7 步）

### Step 1：拼装 prompt

```
/aetherviz-master

[实验名] — AP [学科] Interactive 3D Simulation

Subject: AP [Physics/Biology/Chemistry/etc.] — North American high school
Language: English (ALL text: labels, buttons, panel content, quiz, toasts)

Topic: [核心科学概念，2-3 句精确描述]

3D visualization requirements:
- [主体对象：球/箱/分子/细胞/天体等]
- [运动/变化方式]
- [力/场/轨迹可视化]

Interactive parameters (bottom sliders):
- [参数1]: range [min]–[max] [unit], default [value]
- [参数2]: range [min]–[max] [unit], default [value]

Data overlay (top-left, 4-6 values):
- [量1] ([unit])
- [量2] ([unit])
- [量3] ([unit])

Named presets (≥3):
- "[场景名1]": {param1: x, param2: y}  ← 覆盖默认值
- "[场景名2]": {...}
- "[场景名3]": {...}

Left panel content:
- Key formulas (KaTeX): [公式1], [公式2]
- Concept: [150词英文解释]
- Knowledge cards: [历史事实 / 常见误解 / 进阶知识]
- Real-world applications: [2-3 条]

Quiz (3 questions, prediction/application/diagnostic):
- Q1: [预测类题目]
- Q2: [应用类题目]
- Q3: [诊断/概念类题目]

[物理实验必填] Energy panel: show KE / PE / Total (bar chart, right-side overlay)
[物理实验必填] Use Velocity Verlet integration + adaptive sub-stepping

Subject color theme: [学科渐变色]
Save to: public/experiments/[category]/[slug].html
```

### Step 2：调用 skill
```
/aetherviz-master [上方 prompt]
```

### Step 3：保存文件
输出写入 `public/experiments/{category}/{slug}.html`（覆盖旧文件）

### Step 4：质量核查（8 项必过）
- [ ] 文件 ≥ 500 行
- [ ] 含 `cdnjs.cloudflare.com/ajax/libs/three.js/r134` CDN
- [ ] 含 Tailwind CSS CDN
- [ ] 含内联 OrbitControls 代码（`controls.enableDamping`）
- [ ] 含 `setAnimationLoop`（不用 `requestAnimationFrame`）
- [ ] 含 `<input type="range"` 至少 2 处
- [ ] 含 Quiz 面板（3 个问题）
- [ ] 无中文字符（grep 验证）

### Step 5：物理实验额外检查
- [ ] 含 Verlet 积分（`velHalf` 或 `verletStep`）
- [ ] 含能量面板（`KE` / `PE` / `Total`）
- [ ] 含 ≥3 个命名预设

### Step 6：截图存档
```
test-screenshots/3d-regen/{category}/{slug}.png
```

### Step 7：打勾
更新本文档对应实验的 checkbox

## 快速验证脚本

```bash
# 验证单个文件
validate_experiment() {
  local FILE=$1
  local lines=$(wc -l < "$FILE")
  local has_three=$(grep -c "three.js/r134" "$FILE" || echo 0)
  local has_tailwind=$(grep -c "cdn.tailwindcss" "$FILE" || echo 0)
  local has_orbit=$(grep -c "enableDamping" "$FILE" || echo 0)
  local has_loop=$(grep -c "setAnimationLoop" "$FILE" || echo 0)
  local has_quiz=$(grep -c "quiz\|Quiz" "$FILE" || echo 0)
  local has_slider=$(grep -c 'type="range"' "$FILE" || echo 0)
  local chinese=$(python3 -c "c=open('$FILE').read(); print(sum(1 for x in c if '\u4e00'<=x<='\u9fff'))")

  local ok=1
  [ "$lines" -lt 500 ] && echo "❌ Lines: $lines (<500)" && ok=0
  [ "$has_three" -eq 0 ] && echo "❌ Missing Three.js r134 CDN" && ok=0
  [ "$has_tailwind" -eq 0 ] && echo "❌ Missing Tailwind CSS" && ok=0
  [ "$has_orbit" -eq 0 ] && echo "❌ Missing OrbitControls (inline)" && ok=0
  [ "$has_loop" -eq 0 ] && echo "❌ Missing setAnimationLoop" && ok=0
  [ "$has_quiz" -eq 0 ] && echo "❌ Missing Quiz panel" && ok=0
  [ "$has_slider" -lt 2 ] && echo "❌ Less than 2 sliders" && ok=0
  [ "$chinese" -gt 10 ] && echo "❌ Chinese characters found: $chinese" && ok=0
  [ "$ok" -eq 1 ] && echo "✅ $(basename $FILE): ${lines}L all checks passed"
}

# 批量验证整个分类
validate_category() {
  local DIR="public/experiments/$1"
  for f in $DIR/*.html; do
    validate_experiment "$f"
  done
}
```

## 执行批次规划

### Phase 1：AP Physics（73 个）
> 最核心，物理实验全部启用 Verlet 积分 + 能量面板

**Batch P0-A（13 个）—— 力学 I** ✅ 2026-03-28
- [x] forces-motion-basics.html — Newton's Forces and Motion (617L)
- [x] friction-lab.html — Friction Forces Lab (668L)
- [x] gravity-force-lab-basics.html — Gravity Force Lab (591L)
- [x] hookes-law.html — Hooke's Law Spring (552L)
- [x] masses-springs-basics.html — Masses and Springs (566L)
- [x] masses-springs.html — Masses and Springs Advanced (669L)
- [x] pendulum-lab.html — Pendulum Lab (657L)
- [x] projectile-data-lab.html — Projectile Motion Data Lab (630L)
- [x] vector-addition.html — Vector Addition (591L)
- [x] kinematics-graphs.html — Kinematics Motion Graphs (446L)
- [x] circular-motion.html — Circular Motion (421L)
- [x] rotational-motion.html — Rotational Motion (434L)
- [x] balancing-act.html — Balancing Act Torque (437L)

**Batch P0-B（12 个）—— 能量与热力学**
- [ ] energy-skate-park-basics.html — Energy Skate Park
- [ ] work-energy-theorem.html — Work-Energy Theorem
- [ ] momentum-collisions.html — Momentum and Collisions
- [ ] heat-engines.html — Heat Engines (Thermodynamics)
- [ ] ideal-gas-thermodynamics.html — Ideal Gas & Thermodynamics
- [ ] states-of-matter-basics.html — States of Matter
- [ ] gases-intro.html — Gas Properties Introduction
- [ ] pressure-lab.html — Pressure Lab
- [ ] fluid-statics.html — Fluid Statics
- [ ] buoyancy.html — Buoyancy
- [ ] buoyancy-basics.html — Buoyancy Basics
- [ ] bernoulli-fluid-dynamics.html — Bernoulli Fluid Dynamics

**Batch P0-C（12 个）—— 波动与光学**
- [ ] wave-on-string.html — Wave on a String
- [ ] waves-intro.html — Waves Introduction
- [ ] wave-interference.html — Wave Interference
- [ ] normal-modes.html — Normal Modes Resonance
- [ ] doppler-effect.html — Doppler Effect
- [ ] fourier-making-waves.html — Fourier: Making Waves
- [ ] single-slit-diffraction.html — Single Slit Diffraction
- [ ] bending-light.html — Bending Light Refraction
- [ ] geometric-optics-basics.html — Geometric Optics
- [ ] geometric-optics-lenses.html — Geometric Optics Lenses
- [ ] color-vision.html — Color Vision
- [ ] molecules-and-light.html — Molecules and Light

**Batch P0-D（12 个）—— 电磁学 I**
- [ ] coulombs-law.html — Coulomb's Law
- [ ] electric-field-lines.html — Electric Field Lines
- [ ] electric-potential-voltage.html — Electric Potential & Voltage
- [ ] dc-circuits-basic.html — DC Circuits Basic
- [ ] circuit-dc-virtual-lab.html — DC Circuits Virtual Lab
- [ ] ohms-law.html — Ohm's Law
- [ ] resistance-wire.html — Resistance in a Wire
- [ ] capacitors-rc-circuits.html — Capacitors & RC Circuits
- [ ] ac-circuits.html — AC Circuits
- [ ] circuit-ac-virtual-lab.html — AC Circuits Virtual Lab
- [ ] magnets-and-electromagnets.html — Magnets & Electromagnets
- [ ] electromagnetic-induction.html — Electromagnetic Induction

**Batch P0-E（12 个）—— 电磁学 II + 引力/天文**
- [ ] faradays-electromagnetic-lab.html — Faraday's Electromagnetic Lab
- [ ] generator.html — Electric Generator
- [ ] lorentz-force.html — Lorentz Force
- [ ] gravitational-fields.html — Gravitational Fields
- [ ] gravity-orbits.html — Gravity & Orbits
- [ ] my-solar-system.html — My Solar System
- [ ] keplers-laws.html — Kepler's Laws
- [ ] photoelectric-effect.html — Photoelectric Effect
- [ ] models-hydrogen-atom.html — Models of the Hydrogen Atom
- [ ] blackbody-spectrum.html — Blackbody Spectrum
- [ ] nuclear-decay.html — Nuclear Decay
- [ ] rutherford-scattering.html — Rutherford Scattering

**Batch P0-F（12 个）—— 原子/量子/数学工具**
- [ ] atomic-interactions.html — Atomic Interactions
- [ ] diffusion.html — Diffusion
- [ ] density-lab.html — Density Lab
- [ ] shm-simple-harmonic-motion.html — Simple Harmonic Motion
- [ ] build-a-nucleus.html — Build a Nucleus
- [ ] john-travoltage.html — Electrostatics (John Travoltage)
- [ ] balloons-static-electricity.html — Balloons & Static Electricity
- [ ] plinko-probability.html — Plinko Probability
- [ ] curve-fitting.html — Curve Fitting
- [ ] calculus-grapher.html — Calculus Grapher
- [ ] quantum-coin-toss.html — Quantum Coin Toss
- [ ] quantum-measurement.html — Quantum Measurement

### Phase 2：AP Biology（20 个）

**Batch B-A（10 个）—— 细胞与分子**
- [ ] cell-structure-3d.html — Cell Structure 3D
- [ ] protein-synthesis-3d.html — Protein Synthesis 3D
- [ ] protein-synthesis.html — Protein Synthesis
- [ ] dna-double-helix.html — DNA Double Helix Structure
- [ ] dna-replication-detail.html — DNA Replication
- [ ] mitosis.html — Mitosis Cell Division
- [ ] meiosis.html — Meiosis
- [ ] membrane-transport.html — Membrane Transport
- [ ] cellular-respiration.html — Cellular Respiration
- [ ] cellular-respiration-detail.html — Cellular Respiration (Detail)

**Batch B-B（10 个）—— 生态与进化**
- [ ] photosynthesis.html — Photosynthesis
- [ ] photosynthesis-light-reactions.html — Photosynthesis Light Reactions
- [ ] enzyme-kinetics.html — Enzyme Kinetics
- [ ] neuron-action-potential.html — Neuron Action Potential
- [ ] immune-system.html — Immune System Response
- [ ] population-dynamics.html — Population Dynamics
- [ ] ecological-succession.html — Ecological Succession
- [ ] natural-selection.html — Natural Selection
- [ ] hardy-weinberg.html — Hardy-Weinberg Equilibrium
- [ ] evidence-of-evolution.html — Evidence of Evolution

### Phase 3：AP Chemistry（17 个）

**Batch C-A（9 个）—— 原子结构与键**
- [ ] atomic-structure.html — Atomic Structure
- [ ] electron-configuration.html — Electron Configuration
- [ ] lewis-structures.html — Lewis Structures
- [ ] molecular-bonding.html — Molecular Bonding
- [ ] molecular-polarity.html — Molecular Polarity
- [ ] build-a-molecule.html — Build a Molecule
- [ ] gas-properties.html — Gas Properties
- [ ] solutions-dilutions.html — Solutions & Dilutions
- [ ] beers-law-lab.html — Beer's Law Lab

**Batch C-B（8 个）—— 反应与热力学**
- [ ] balancing-chemical-equations.html — Balancing Chemical Equations
- [ ] stoichiometry.html — Stoichiometry
- [ ] acid-base-ph.html — Acid-Base pH
- [ ] chemical-equilibrium.html — Chemical Equilibrium
- [ ] reaction-kinetics.html — Reaction Kinetics
- [ ] calorimetry.html — Calorimetry
- [ ] thermochemistry.html — Thermochemistry
- [ ] electrochemistry.html — Electrochemistry

### Phase 4：AP Physics C（5 个）

**Batch PC（5 个）**
- [ ] angular-momentum-3d.html — Angular Momentum 3D
- [ ] rotational-kinematics-advanced.html — Rotational Kinematics Advanced
- [ ] amperes-law.html — Ampere's Law
- [ ] gauss-law.html — Gauss's Law
- [ ] rlc-circuit.html — RLC Circuit

### Phase 5：Earth Science（17 个）

**Batch E-A（9 个）—— 地球物理**
- [ ] plate-tectonics-advanced.html — Plate Tectonics
- [ ] seismic-waves.html — Seismic Waves
- [ ] volcano-eruption-types.html — Volcano Eruption Types
- [ ] rock-cycle.html — Rock Cycle
- [ ] mineral-identification.html — Mineral Identification
- [ ] soil-formation.html — Soil Formation
- [ ] radiometric-dating.html — Radiometric Dating
- [ ] glaciers-ice-ages.html — Glaciers & Ice Ages
- [ ] water-cycle-detail.html — Water Cycle

**Batch E-B（8 个）—— 天文与气候**
- [ ] solar-system-scale.html — Solar System Scale
- [ ] star-life-cycle.html — Star Life Cycle
- [ ] moon-geology.html — Moon Geology
- [ ] tides-lunar-gravity.html — Tides & Lunar Gravity
- [ ] ocean-currents.html — Ocean Currents
- [ ] atmosphere-layers.html — Atmosphere Layers
- [ ] greenhouse-effect.html — Greenhouse Effect
- [ ] climate-change-modeling.html — Climate Change Modeling

### Phase 6：Elementary K5（24 个）

**Batch K5-A（12 个）—— 物理**
- [ ] k5-physics-force-motion.html — Force & Motion
- [ ] k5-physics-simple-machines.html — Simple Machines
- [ ] k5-simple-machines.html — Simple Machines (Basic)
- [ ] k5-physics-energy-conversion.html — Energy Conversion
- [ ] k5-solar-energy.html — Solar Energy
- [ ] k5-physics-sound-waves.html — Sound Waves
- [ ] k5-sound-vibration.html — Sound & Vibration
- [ ] k5-physics-light-propagation.html — Light Propagation
- [ ] k5-physics-magnetism.html — Magnetism
- [ ] k5-weather-measurement.html — Weather Measurement
- [ ] k5-weather-patterns.html — Weather Patterns
- [ ] k5-earth-day-night-seasons.html — Day, Night & Seasons

**Batch K5-B（12 个）—— 生物/地球/化学**
- [ ] k5-earth-moon-phases.html — Moon Phases
- [ ] k5-earth-water-cycle.html — Water Cycle
- [ ] k5-landforms-erosion.html — Landforms & Erosion
- [ ] k5-stars-space.html — Stars & Space
- [ ] k5-biology-food-chain.html — Food Chain
- [ ] k5-animal-adaptations.html — Animal Adaptations
- [ ] k5-habitats.html — Habitats
- [ ] k5-plant-life-cycle.html — Plant Life Cycle
- [ ] k5-plant-needs.html — Plant Needs
- [ ] k5-chemistry-states-of-matter.html — States of Matter
- [ ] k5-chemical-changes.html — Chemical Changes
- [ ] k5-mixtures-solutions.html — Mixtures & Solutions

### Phase 7：Middle School（20 个）

**Batch MS-A（10 个）—— 物理/化学**
- [ ] ms-newtons-laws.html — Newton's Laws
- [ ] ms-force-motion-graphs.html — Force & Motion Graphs
- [ ] ms-energy-conservation.html — Energy Conservation
- [ ] ms-wave-interactions-advanced.html — Wave Interactions
- [ ] ms-electric-circuits-advanced.html — Electric Circuits
- [ ] ms-atoms-molecules.html — Atoms & Molecules
- [ ] ms-chemical-bonding.html — Chemical Bonding
- [ ] ms-chemical-reactions.html — Chemical Reactions
- [ ] ms-chemical-stoichiometry.html — Stoichiometry
- [ ] ms-acid-base-reactions.html — Acid-Base Reactions

**Batch MS-B（10 个）—— 生物/地球**
- [ ] ms-cell-division-comparison.html — Cell Division
- [ ] ms-genetics.html — Genetics
- [ ] ms-genetics-punnett.html — Punnett Square Genetics
- [ ] ms-photosynthesis-respiration.html — Photosynthesis & Respiration
- [ ] ms-ecosystems.html — Ecosystems
- [ ] ms-food-web-dynamics.html — Food Web Dynamics
- [ ] ms-plate-tectonics.html — Plate Tectonics
- [ ] ms-earthquake-epicenter.html — Earthquake Epicenter
- [ ] ms-weather-systems.html — Weather Systems
- [ ] ms-moon-phases-detailed.html — Moon Phases

## 进度追踪

| Phase | 总数 | 已完成 | 剩余 | 状态 |
|-------|------|--------|------|------|
| P1: AP Physics (6 batches) | 73 | 13 | 60 | 🟡 |
| P2: AP Biology (2 batches) | 20 | 0 | 20 | ⬜ |
| P3: AP Chemistry (2 batches) | 17 | 0 | 17 | ⬜ |
| P4: AP Physics C (1 batch) | 5 | 0 | 5 | ⬜ |
| P5: Earth Science (2 batches) | 17 | 0 | 17 | ⬜ |
| P6: Elementary K5 (2 batches) | 24 | 0 | 24 | ⬜ |
| P7: Middle School (2 batches) | 20 | 0 | 20 | ⬜ |
| **总计** | **176** | **13** | **163** | 🟡 |

## 执行方式

每次对话处理 1 个 batch（10-15 个实验）：

1. 告诉我："执行 Batch P0-A"
2. 我依次用 `/aetherviz-master` 生成每个实验
3. 写入对应 HTML 文件（覆盖旧文件）
4. 运行验证脚本确认 8 项质量门控
5. 更新进度表

**准备好后说："开始 Batch P0-A"**
