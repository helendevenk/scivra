# RalphFree SDK 任务文档

> 由 RalphFree SDK v2 生成 | 2026-03-28T15:10:59Z

## 核心目标

用 **aetherviz-master v7.0** skill 为 Scivra K12 科学教育平台重新生成全部 **176 个 HTML 实验文件**，写入 `public/experiments-v2/{category}/`，不覆盖原始文件。

每个实验必须通过 8 项质量门控：Three.js r134、Tailwind、内联 OrbitControls、setAnimationLoop、≥2 滑块、Quiz 面板、≥500 行、纯英文。

## 任务信息

| 字段 | 值 |
|------|-----|
| 任务ID | TASK-1774710660 |
| 创建时间 | 2026-03-28T15:10:59Z |
| 最大迭代 | 20 次 |
| 引擎版本 | SDK v2 |

## 技术规范（每个 session 必须遵守）

### 生成工具
`aetherviz-master` skill（~/.claude/skills/aetherviz-master/SKILL.md，v7.0，含 Codex 科学核实）

### 输出路径
`/Users/sky/Desktop/Scivra/Scivra/public/experiments-v2/{category}/`

七个 category 目录：`ap-physics` / `ap-biology` / `ap-chemistry` / `ap-physics-c` / `earth-science` / `elementary` / `middle`

### 语言
全英文（北美 K12 学生）

### 技术栈
- Three.js r134（`cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js`）
- Tailwind CSS（`cdn.tailwindcss.com`）
- KaTeX 0.16.11
- OrbitControls 内联（`enableDamping = true`）
- `renderer.setAnimationLoop()` 唯一动画循环
- Velocity Verlet + 自适应子步进（物理实验）

### 学科专色
- AP Physics: `#3B82F6 → #0EA5E9`
- AP Biology: `#10B981 → #22D3EE`
- AP Chemistry: `#F59E0B → #EF4444`
- AP Physics C: `#8B5CF6 → #3B82F6`
- Earth Science: `#F97316 → #EAB308`
- Elementary K5: `#EAB308 → #84CC16`
- Middle School: `#EC4899 → #F97316`

### 每 batch 执行方式
启动 **4 个并行子代理**（dispatching-parallel-agents），每个子代理负责 3–4 个实验：
1. 子代理读取 `~/.claude/skills/aetherviz-master/SKILL.md`
2. 生成 HTML（遵循 v7.0 规范 + Codex 核实）
3. 写入 `experiments-v2/{category}/{slug}.html`
4. 运行验证命令确认 8 项质量门控

### 验证命令（每个文件）
```bash
FILE="path/to/file.html"
echo "Lines: $(wc -l < $FILE)"
grep -c "three.js/r134\|three.min.js" "$FILE" > /dev/null && echo "✅ Three.js" || echo "❌"
grep -c "tailwindcss" "$FILE" > /dev/null && echo "✅ Tailwind" || echo "❌"
grep -c "enableDamping" "$FILE" > /dev/null && echo "✅ OrbitControls" || echo "❌"
grep -c "setAnimationLoop" "$FILE" > /dev/null && echo "✅ setAnimationLoop" || echo "❌"
[ "$(grep -c 'type=\"range\"' $FILE)" -ge 2 ] && echo "✅ Sliders" || echo "❌"
grep -qi "quiz" "$FILE" && echo "✅ Quiz" || echo "❌"
[ "$(wc -l < $FILE)" -ge 500 ] && echo "✅ Lines≥500" || echo "❌"
python3 -c "c=open('$FILE').read(); print('✅ English' if sum(1 for x in c if '\u4e00'<=x<='\u9fff')<10 else '❌ Chinese found')"
```

## Design Decisions

### 选定：experiments-v2 独立目录 + dispatching-parallel-agents 并行
**理由**：不覆盖原始文件（安全），并行 4 agent 每批速度提升 4x，每个 session 独立不退化 context

### 排除：直接覆盖原始 experiments/ 目录
**理由**：用户明确要求不覆盖旧文件，需要对比新旧效果

### 排除：串行逐个生成
**理由**：176 个文件串行耗时过长，并行 4x 加速是必须的

## Atomic Plan

### Phase 1: 基础设施 + AP Physics 力学 I（已完成）

- [x] Task 0: 创建 experiments-v2 目录结构
  Files: public/experiments-v2/{7个子目录}
  Test: `ls public/experiments-v2/`
  Expected: 7 个子目录存在

- [x] Task 1: Batch P0-A — AP Physics 力学 I（13个）
  Files: public/experiments-v2/ap-physics/{forces-motion-basics,friction-lab,gravity-force-lab-basics,hookes-law,masses-springs-basics,masses-springs,pendulum-lab,projectile-data-lab,vector-addition,kinematics-graphs,circular-motion,rotational-motion,balancing-act}.html
  Test: 验证脚本 8 项
  Expected: 13/13 通过
  Note: 已用 v7.0 重新生成，4 agent 并行，后台运行中

### Phase 2: AP Physics 剩余 60 个（Batch P0-B ~ P0-F）

- [ ] Task 2: Batch P0-B — AP Physics 能量与热力学（12个）
  Files: public/experiments-v2/ap-physics/{energy-skate-park-basics,work-energy-theorem,momentum-collisions,heat-engines,ideal-gas-thermodynamics,states-of-matter-basics,gases-intro,pressure-lab,fluid-statics,buoyancy,buoyancy-basics,bernoulli-fluid-dynamics}.html
  Test: 验证脚本 8 项 × 12
  Expected: 12/12 通过

- [ ] Task 3: Batch P0-C — AP Physics 波动与光学（12个）
  Files: public/experiments-v2/ap-physics/{wave-on-string,waves-intro,wave-interference,normal-modes,doppler-effect,fourier-making-waves,single-slit-diffraction,bending-light,geometric-optics-basics,geometric-optics-lenses,color-vision,molecules-and-light}.html
  Test: 验证脚本 8 项 × 12
  Expected: 12/12 通过

- [ ] Task 4: Batch P0-D — AP Physics 电磁学 I（12个）
  Files: public/experiments-v2/ap-physics/{coulombs-law,electric-field-lines,electric-potential-voltage,dc-circuits-basic,circuit-dc-virtual-lab,ohms-law,resistance-wire,capacitors-rc-circuits,ac-circuits,circuit-ac-virtual-lab,magnets-and-electromagnets,electromagnetic-induction}.html
  Test: 验证脚本 8 项 × 12
  Expected: 12/12 通过

- [ ] Task 5: Batch P0-E — AP Physics 电磁学 II + 天文（12个）
  Files: public/experiments-v2/ap-physics/{faradays-electromagnetic-lab,generator,lorentz-force,gravitational-fields,gravity-orbits,my-solar-system,keplers-laws,photoelectric-effect,models-hydrogen-atom,blackbody-spectrum,nuclear-decay,rutherford-scattering}.html
  Test: 验证脚本 8 项 × 12
  Expected: 12/12 通过

- [ ] Task 6: Batch P0-F — AP Physics 原子/量子/数学工具（12个）
  Files: public/experiments-v2/ap-physics/{atomic-interactions,diffusion,density-lab,shm-simple-harmonic-motion,build-a-nucleus,john-travoltage,balloons-static-electricity,plinko-probability,curve-fitting,calculus-grapher,quantum-coin-toss,quantum-measurement}.html
  Test: 验证脚本 8 项 × 12
  Expected: 12/12 通过

### Phase 3: AP Biology + AP Chemistry + AP Physics C（42个）

- [ ] Task 7: Batch B-A — AP Biology 细胞与分子（10个）
  Files: public/experiments-v2/ap-biology/{cell-structure-3d,protein-synthesis-3d,protein-synthesis,dna-double-helix,dna-replication-detail,mitosis,meiosis,membrane-transport,cellular-respiration,cellular-respiration-detail}.html
  Test: 验证脚本 8 项 × 10
  Expected: 10/10 通过

- [ ] Task 8: Batch B-B — AP Biology 生态与进化（10个）
  Files: public/experiments-v2/ap-biology/{photosynthesis,photosynthesis-light-reactions,enzyme-kinetics,neuron-action-potential,immune-system,population-dynamics,ecological-succession,natural-selection,hardy-weinberg,evidence-of-evolution}.html
  Test: 验证脚本 8 项 × 10
  Expected: 10/10 通过

- [ ] Task 9: Batch C-A — AP Chemistry 原子结构与键（9个）
  Files: public/experiments-v2/ap-chemistry/{atomic-structure,electron-configuration,lewis-structures,molecular-bonding,molecular-polarity,build-a-molecule,gas-properties,solutions-dilutions,beers-law-lab}.html
  Test: 验证脚本 8 项 × 9
  Expected: 9/9 通过

- [ ] Task 10: Batch C-B — AP Chemistry 反应与热力学（8个）
  Files: public/experiments-v2/ap-chemistry/{balancing-chemical-equations,stoichiometry,acid-base-ph,chemical-equilibrium,reaction-kinetics,calorimetry,thermochemistry,electrochemistry}.html
  Test: 验证脚本 8 项 × 8
  Expected: 8/8 通过

- [ ] Task 11: Batch PC — AP Physics C（5个）
  Files: public/experiments-v2/ap-physics-c/{angular-momentum-3d,rotational-kinematics-advanced,amperes-law,gauss-law,rlc-circuit}.html
  Test: 验证脚本 8 项 × 5
  Expected: 5/5 通过

### Phase 4: Earth Science + K5 + Middle School（61个）

- [ ] Task 12: Batch E-A — Earth Science 地球物理（9个）
  Files: public/experiments-v2/earth-science/{plate-tectonics-advanced,seismic-waves,volcano-eruption-types,rock-cycle,mineral-identification,soil-formation,radiometric-dating,glaciers-ice-ages,water-cycle-detail}.html
  Test: 验证脚本 8 项 × 9
  Expected: 9/9 通过

- [ ] Task 13: Batch E-B — Earth Science 天文与气候（8个）
  Files: public/experiments-v2/earth-science/{solar-system-scale,star-life-cycle,moon-geology,tides-lunar-gravity,ocean-currents,atmosphere-layers,greenhouse-effect,climate-change-modeling}.html
  Test: 验证脚本 8 项 × 8
  Expected: 8/8 通过

- [ ] Task 14: Batch K5-A — Elementary K5 物理（12个）
  Files: public/experiments-v2/elementary/{k5-physics-force-motion,k5-physics-simple-machines,k5-simple-machines,k5-physics-energy-conversion,k5-solar-energy,k5-physics-sound-waves,k5-sound-vibration,k5-physics-light-propagation,k5-physics-magnetism,k5-weather-measurement,k5-weather-patterns,k5-earth-day-night-seasons}.html
  Test: 验证脚本 8 项 × 12
  Expected: 12/12 通过

- [ ] Task 15: Batch K5-B — Elementary K5 生物/地球/化学（12个）
  Files: public/experiments-v2/elementary/{k5-earth-moon-phases,k5-earth-water-cycle,k5-landforms-erosion,k5-stars-space,k5-biology-food-chain,k5-animal-adaptations,k5-habitats,k5-plant-life-cycle,k5-plant-needs,k5-chemistry-states-of-matter,k5-chemical-changes,k5-mixtures-solutions}.html
  Test: 验证脚本 8 项 × 12
  Expected: 12/12 通过

- [ ] Task 16: Batch MS-A — Middle School 物理/化学（10个）
  Files: public/experiments-v2/middle/{ms-newtons-laws,ms-force-motion-graphs,ms-energy-conservation,ms-wave-interactions-advanced,ms-electric-circuits-advanced,ms-atoms-molecules,ms-chemical-bonding,ms-chemical-reactions,ms-chemical-stoichiometry,ms-acid-base-reactions}.html
  Test: 验证脚本 8 项 × 10
  Expected: 10/10 通过

- [ ] Task 17: Batch MS-B — Middle School 生物/地球（10个）
  Files: public/experiments-v2/middle/{ms-cell-division-comparison,ms-genetics,ms-genetics-punnett,ms-photosynthesis-respiration,ms-ecosystems,ms-food-web-dynamics,ms-plate-tectonics,ms-earthquake-epicenter,ms-weather-systems,ms-moon-phases-detailed}.html
  Test: 验证脚本 8 项 × 10
  Expected: 10/10 通过

### Phase 5: 质量审核与收尾

- [ ] Task 18: 批量质量核查——统计所有 176 个文件通过率
  Files: public/experiments-v2/**/*.html（全部）
  Test: `find public/experiments-v2 -name "*.html" | wc -l`
  Expected: 176 个文件，≥95% 通过 8 项验证

- [ ] Task 19: 生成质量报告（写入 .ralphfree/quality-report.md）
  Files: .ralphfree/quality-report.md
  Test: 文件存在且包含各分类通过率
  Expected: 报告完整，列出所有失败文件

- [ ] Task 20: 修复质量报告中不通过的文件（如有）
  Files: 质量报告中标记 ❌ 的文件
  Test: 重跑验证脚本
  Expected: 全部 ✅

## 验收标准

- [ ] `public/experiments-v2/` 下共 176 个 HTML 文件
- [ ] 每个文件行数 ≥ 500
- [ ] 每个文件包含 Three.js r134 CDN、Tailwind、内联 OrbitControls、setAnimationLoop
- [ ] 每个文件含 Quiz 面板（3 题）和 ≥3 个命名预设
- [ ] 无中文字符（英文界面）
- [ ] Codex 科学核实通过（或附 warning 说明）

## Scope Exclusions（本次不做）

- **不修改原始 experiments/ 目录**：原文件完全不动，只写 experiments-v2/
- **不修改 registry.ts 或任何 TypeScript 代码**：这是纯内容生成任务，不改应用代码
- **不部署到 Vercel**：生成完成后用户自行决定是否替换
- **不生成缩略图**：缩略图是独立任务，不在本次范围
- **不处理 Wave 1 的 R3F 组件**：NewtonsLaws/ProjectileMotion/EMSpectrum/RollerCoaster 这4个是 React 组件，不是 HTML 文件，不在本次范围

## Manus 工作规则（必须遵守）

### 1. Read-Before-Decide 规则
每次做重大决策前，必须重读本文件

### 2. 2-Action 规则
每完成 2 个操作后，必须更新 STATUS.md

### 3. Never Hide Failures 规则
所有错误必须立即记录到 errors.md（含完整报错信息）

### 4. Store Don't Stuff 规则
大量输出写入文件，上下文只保留摘要

### 5. Agent 只收集不决策
子代理（explore/test-runner/verify）做研究和验证，方案决策在主流程完成

### 6. MCP 按需不滥用
需要时才调用，不滥用

## 完成后操作

将 STATUS.md 当前状态更新为 COMPLETED，所有阶段标记为 ✅，输出最终质量报告路径。
