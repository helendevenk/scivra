---
name: wave9-12-progress
type: project
created: 2026-03-26T09:30:00Z
updated: 2026-03-26T11:47:00Z
---

# Wave 9-12 课程开发进度

> AI 作业规则：
> 1. 读此文件，找第一个 `[ ]` 任务
> 2. 按 `docs/plans/wave9-12-experiment-quickref.md` SOP 7 步完成
> 3. 完成后改为 `[x]`，更新 `updated` 时间戳
> 4. 立即继续下一个 `[ ]` 任务，不停下来等待
> 5. 直到 context 接近上限或该 Wave 全部完成，才停下并报告进度
>
> 规范速查：`docs/plans/wave9-12-experiment-quickref.md`
> 完整方案：`docs/plans/2026-03-26-curriculum-wave9-12-cto-review.md`

## 准备 Sprint（必须在 Wave 9 前完成）

- [x] 变更 A：确认所有 `getExperimentHtmlPath` 调用使用 `slug` 字段
- [x] 变更 B：`registry.ts` 导入顺序按 Wave 编号重排
- [x] 变更 C：创建 `tests/unit/experiments/registry-integrity.test.ts`
- [x] 变更 F：`Experiment` 接口增加 `htmlPath?: string`，更新 ExperimentClient 测试
- [x] 创建 `.github/PULL_REQUEST_TEMPLATE.md`（含数据溯源格式）
- [x] 类型扩展：`Wave = 1|2|...|8|9|10|11|12`
- [x] 创建目录 `public/experiments/earth-science/`

## Wave 9 — AP Chemistry Core（目标：10 → 20，预计 +2.5 周）

- [x] C-08 `balancing-chemical-equations` | 4h | 2D Canvas 拖拽配平
- [x] C-09 `electron-configuration` | 8h | Canvas Bohr 轨道动画
- [x] C-10 `lewis-structures` | 8h | SVG 键型绘制
- [ ] C-11 `build-a-molecule` | 10h | Three.js 3D（需 OrbitControls 落地）
- [ ] C-12 `molecular-polarity` | 8h | Three.js 电荷云（需 OrbitControls 落地）
- [ ] C-13 `gas-properties` | 10h | Canvas 粒子模拟
- [x] C-14 `beers-law-lab` | 5h | Canvas 颜色插值
- [ ] C-15 `solutions-dilutions` | 4h | Canvas 溶液浓度
- [ ] C-16 `stoichiometry` | 5h | Canvas 原子计数
- [ ] C-17 `calorimetry` | 5h | Canvas 温度曲线

## Wave 10 — Earth Science NGSS（目标：+12，预计 +4 周）

- [ ] ES-06 `greenhouse-effect` | 6h | 辐射粒子动画
- [ ] ES-07 `radiometric-dating` | 5h | 指数衰减曲线
- [ ] ES-08 `rock-cycle` | 10h | Three.js 地质截面（需 OrbitControls）
- [ ] ES-10 `atmosphere-layers` | 5h | 垂直剖面图
- [ ] ES-11 `seismic-waves` | 10h | 波形动画
- [ ] ES-12 `plate-tectonics-advanced` | 12h | Three.js 板块运动（需 OrbitControls）
- [ ] ES-13 `solar-system-scale` | 6h | 比例尺可视化
- [ ] ES-14 `climate-change-modeling` | 10h | 温度历史折线
- [ ] ES-15 `star-life-cycle` | 10h | HR 图动画
- [ ] ES-16 `soil-formation` | 5h | 地层剖面图（MS，primaryStandard: ngss-ms）
- [ ] ES-17 `tides-lunar-gravity` | 5h | 月球轨道 + 潮汐
- [ ] ES-18 `glaciers-ice-ages` | 8h | 冰川进退时间轴

## Wave 11 — Biology AP + K-8 扩展（目标：+22，预计 +4.5 周）

### Biology AP 补全（6 个）
- [ ] B-11 `immune-system` | 10h | Canvas 细胞动画
- [ ] B-12 `population-dynamics` | 6h | Lotka-Volterra 图表
- [ ] B-13 `ecological-succession` | 5h | 序列化动画帧
- [ ] B-14 `evidence-of-evolution` | 6h | 进化树 SVG
- [ ] B-15 `hardy-weinberg` | 5h | 频率计算图表
- [ ] B-16 `cell-structure-3d` | 12h | Three.js 3D 细胞（需 OrbitControls）

### K-5 扩展（8 个）
- [ ] K5-12 `k5-chemical-changes` | 4h | Chemistry K5
- [ ] K5-13 `k5-mixtures-solutions` | 3h | Chemistry K5
- [ ] K5-14 `k5-weather-patterns` | 4h | Earth Science K5
- [ ] K5-15 `k5-landforms-erosion` | 4h | Earth Science K5
- [ ] K5-16 `k5-stars-space` | 4h | Earth Science K5
- [ ] K5-17 `k5-plant-life-cycle` | 3h | Biology K5
- [ ] K5-18 `k5-animal-adaptations` | 3h | Biology K5
- [ ] K5-19 `k5-solar-energy` | 3h | Physics K5

### Middle School 扩展（8 个）
- [ ] MS-10 `ms-chemical-bonding` | 8h | Chemistry MS
- [ ] MS-11 `ms-acid-base-reactions` | 5h | Chemistry MS
- [ ] MS-12 `ms-earthquake-epicenter` | 8h | Earth Science MS
- [ ] MS-13 `ms-moon-phases-detailed` | 4h | Earth Science MS
- [ ] MS-14 `ms-cell-division-comparison` | 8h | Biology MS
- [ ] MS-15 `ms-food-web-dynamics` | 5h | Biology MS
- [ ] MS-16 `ms-electric-circuits-advanced` | 8h | Physics MS
- [ ] MS-17 `ms-wave-interactions-advanced` | 8h | Physics MS

## Wave 12 — AP Physics C + P2 批次（目标：+20，预计 +6 周）

### AP Physics C（5 个，tier = "pro"）
- [ ] P-83 `gauss-law` | 14h | Three.js 向量场（需 OrbitControls）
- [ ] P-84 `amperes-law` | 14h | Three.js 向量场（需 OrbitControls）
- [ ] P-85 `rlc-circuit` | 10h | Canvas（AP-C 早期信号，Wave 11 完成后优先）
- [ ] P-86 `rotational-kinematics-advanced` | 8h | Canvas 角速度动画
- [ ] P-87 `angular-momentum-3d` | 14h | Three.js 3D（需 OrbitControls）

### P2 批次（17 个，Wave 12 后半段）
- [ ] ES-09 `ocean-currents` | 10h | Canvas 简化粒子流线（降复杂度版）
- [ ] MS-18 `ms-chemical-stoichiometry` | 6h
- [ ] MS-19 `ms-genetics-punnett` | 5h
- [ ] MS-20 `ms-force-motion-graphs` | 5h
- [ ] B-17 `photosynthesis-light-reactions` | 8h
- [ ] B-18 `cellular-respiration-detail` | 8h
- [ ] B-19 `dna-replication-detail` | 10h
- [ ] B-20 `protein-synthesis-3d` | 12h
- [ ] ES-19 `moon-geology` | 6h
- [ ] ES-20 `water-cycle-detail` | 5h
- [ ] ES-21 `mineral-identification` | 5h
- [ ] ES-22 `volcano-eruption-types` | 8h
- [ ] K5-20 `k5-simple-machines` | 3h
- [ ] K5-21 `k5-sound-vibration` | 3h
- [ ] K5-22 `k5-plant-needs` | 3h
- [ ] K5-23 `k5-weather-measurement` | 4h
- [ ] K5-24 `k5-habitats` | 3h

## 里程碑

| 里程碑 | 条件 | 状态 |
|--------|------|------|
| 准备 Sprint 完成 | 上方 7 个任务全 `[x]` | ⬜ |
| Wave 9 上线（124 个实验） | Wave 9 全 10 个 `[x]` + Vercel 验证 | ⬜ |
| M1 超越 PhET（170 个实验） | Wave 9 + Wave 10 + Wave 11 前半段 | ⬜ |
| Wave 10 上线（136 个实验） | Wave 10 全 12 个 `[x]` | ⬜ |
| Wave 11 上线（158 个实验） | Wave 11 全 22 个 `[x]` | ⬜ |
| M2（200 个实验） | Wave 12 部分完成 | ⬜ |
| Wave 12 上线（183 个实验） | Wave 12 全 20 个核心 `[x]` | ⬜ |
