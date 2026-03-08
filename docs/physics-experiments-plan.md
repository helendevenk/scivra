# NeonPhysics 物理实验全量生成计划

> 生成日期: 2025-02-25
> 项目: neonphysics-v2 (万物原理)
> 现有实验: 4个 (牛顿定律、抛体运动、电磁波谱、过山车能量守恒)

---

## 架构说明

每个实验需要 3 个产出物：

| 文件 | 路径 | 说明 |
|------|------|------|
| 数据定义 | `src/shared/lib/experiments/data/{slug}.ts` | Experiment 对象 |
| 3D 场景 | `src/shared/components/experiments/three/{Name}Scene.tsx` | React Three Fiber 场景 |
| 注册接入 | `registry.ts` + `ExperimentClient.tsx` | 导入 + switch case |

分类体系: `mechanics` / `waves` / `electricity` / `thermodynamics` / `modern`
难度体系: `beginner`(小学) / `intermediate`(初中) / `advanced`(高中)
订阅层级: `free` / `pro` / `max`

---

## 一、小学阶段 (beginner) — 12 个实验

> 核心原则：直观、可视化、趣味性强，参数简单，无复杂公式

### 力学 (mechanics)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 3D场景描述 | 难度 |
|---|-----|---------|----------|----------|-----------|------|
| 1 | `lever-balance` | 杠杆平衡 | Lever Balance | 杠杆原理、力矩 | 支点上的跷跷板，两端放置不同重量物体，观察平衡 | beginner |
| 2 | `pulley-system` | 滑轮组 | Pulley System | 定滑轮/动滑轮、省力 | 绳索穿过滑轮提升重物，对比不同滑轮组合的力 | beginner |
| 3 | `inclined-plane` | 斜面实验 | Inclined Plane | 斜面省力、摩擦力 | 物体沿斜面滑下，调节角度和摩擦系数 | beginner |
| 4 | `spring-stretch` | 弹簧拉伸 | Spring Stretch | 胡克定律(定性)、弹性 | 弹簧挂不同重物，观察伸长量变化 | beginner |
| 5 | `gravity-drop` | 自由落体 | Gravity Drop | 重力、下落速度 | 不同物体从高处落下，对比落地时间 | beginner |

### 声学/波动 (waves)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 3D场景描述 | 难度 |
|---|-----|---------|----------|----------|-----------|------|
| 6 | `sound-waves` | 声音的传播 | Sound Waves | 声波、振动、介质 | 音叉振动产生波纹，可视化声波在空气中传播 | beginner |
| 7 | `echo-reflection` | 回声实验 | Echo Reflection | 声音反射、回声 | 声波遇到墙壁反射回来，调节距离观察回声延迟 | beginner |

### 光学 (waves)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 3D场景描述 | 难度 |
|---|-----|---------|----------|----------|-----------|------|
| 8 | `light-shadow` | 光与影 | Light & Shadow | 光的直线传播、影子 | 点光源照射不同形状物体，观察影子变化 | beginner |
| 9 | `color-mixing` | 光的三原色 | Color Mixing | 光的混合、RGB | 三束彩色光交叉混合，观察叠加颜色 | beginner |

### 热学 (thermodynamics)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 3D场景描述 | 难度 |
|---|-----|---------|----------|----------|-----------|------|
| 10 | `heat-conduction` | 热传导 | Heat Conduction | 热传导、温度 | 金属棒一端加热，观察热量沿棒传递(颜色渐变) | beginner |
| 11 | `states-of-matter` | 物态变化 | States of Matter | 固液气三态、分子运动 | 粒子模拟：加热/冷却观察分子排列和运动变化 | beginner |

### 电学 (electricity)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 3D场景描述 | 难度 |
|---|-----|---------|----------|----------|-----------|------|
| 12 | `simple-circuit` | 简单电路 | Simple Circuit | 电路、开关、灯泡 | 电池+导线+灯泡+开关，闭合开关灯泡亮起 | beginner |

---

## 二、初中阶段 (intermediate) — 20 个实验

> 核心原则：定量分析、公式引入、实验操作规范、数据记录

### 力学 (mechanics)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 13 | `speed-measurement` | 速度测量 | Speed Measurement | 速度、路程、时间 | v = s/t | 小车在轨道上运动，光电门计时，计算速度 |
| 14 | `density-measurement` | 密度测量 | Density Measurement | 密度、质量、体积 | ρ = m/V | 天平称质量+量筒测体积，计算不同物质密度 |
| 15 | `friction-experiment` | 摩擦力实验 | Friction Experiment | 滑动摩擦力、影响因素 | f = μN | 弹簧测力计拉物体，改变压力和接触面粗糙度 |
| 16 | `pressure-demo` | 压强演示 | Pressure Demo | 压强、面积、力 | P = F/A | 钉板实验：同样的力，不同面积产生不同压强 |
| 17 | `liquid-pressure` | 液体压强 | Liquid Pressure | 液体压强、深度 | P = ρgh | U型管压强计探入液体不同深度，观察液面差 |
| 18 | `buoyancy` | 浮力实验 | Buoyancy | 阿基米德原理 | F浮 = ρ液gV排 | 物体浸入液体，弹簧秤示数变化，计算浮力 |
| 19 | `lever-principle` | 杠杆原理(定量) | Lever Principle | 力矩平衡 | F1×L1 = F2×L2 | 杠杆两端挂钩码，调节位置使平衡，验证力矩关系 |

### 光学 (waves)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 20 | `light-reflection` | 光的反射 | Light Reflection | 反射定律 | θ入 = θ反 | 激光射向平面镜，调节入射角观察反射角变化 |
| 21 | `light-refraction` | 光的折射 | Light Refraction | 折射定律(定性) | n₁sinθ₁ = n₂sinθ₂ | 光从空气射入水/玻璃，观察折射偏转 |
| 22 | `convex-lens` | 凸透镜成像 | Convex Lens Imaging | 凸透镜成像规律 | 1/f = 1/u + 1/v | 蜡烛+凸透镜+光屏，调节物距观察像的变化 |

### 热学 (thermodynamics)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 23 | `heat-capacity` | 比热容实验 | Heat Capacity | 比热容、热量 | Q = cmΔT | 等量水和油同时加热，温度计显示升温速度差异 |
| 24 | `thermal-expansion` | 热胀冷缩 | Thermal Expansion | 热膨胀 | ΔL = αLΔT | 金属球加热后无法通过铁环，冷却后可以 |

### 电学 (electricity)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 25 | `ohms-law` | 欧姆定律 | Ohm's Law | 电压、电流、电阻 | U = IR | 电路中调节电压/电阻，电流表/电压表实时显示 |
| 26 | `series-parallel` | 串并联电路 | Series & Parallel | 串联/并联特性 | 串:I相同 并:U相同 | 灯泡串联vs并联，对比亮度和电流分配 |
| 27 | `electrical-power` | 电功率 | Electrical Power | 电功率、电能 | P = UI | 不同功率灯泡接入电路，观察亮度和功率关系 |
| 28 | `magnetic-field` | 磁场可视化 | Magnetic Field | 磁场、磁力线 | — | 条形磁铁/蹄形磁铁周围铁粉排列，可视化磁力线 |
| 29 | `electromagnetic-induction` | 电磁感应 | EM Induction | 法拉第电磁感应 | ε = -dΦ/dt | 磁铁穿过线圈，电流表偏转，改变速度观察感应电流 |

### 声学 (waves)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 30 | `sound-frequency` | 声音的特性 | Sound Properties | 频率、振幅、音色 | f, A | 调节频率和振幅，听到不同音调和响度，波形可视化 |
| 31 | `resonance` | 共振实验 | Resonance | 共振、固有频率 | f₀ | 摆锤阵列，驱动频率匹配时振幅最大 |
| 32 | `wave-interference` | 水波干涉 | Wave Interference | 干涉、叠加原理 | — | 两个波源在水面产生波纹，观察干涉图样 |

---

## 三、高中阶段 (advanced) — 25 个实验

> 核心原则：严格定量、微积分思维、实验设计能力、误差分析

### 力学 (mechanics)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 33 | `uniform-acceleration` | 匀变速直线运动 | Uniform Acceleration | 加速度、v-t图 | s = v₀t + ½at² | 小车在气垫导轨上运动，光电门采集数据，绘制v-t图 |
| 34 | `projectile-analysis` | 抛体运动分析 | Projectile Analysis | 分运动合成 | x=v₀cosθ·t, y=v₀sinθ·t-½gt² | 频闪照片分析抛体轨迹，分解水平/竖直分运动 |
| 35 | `circular-motion` | 圆周运动 | Circular Motion | 向心力、角速度 | F = mω²r | 物体在转盘上做圆周运动，调节半径和转速 |
| 36 | `simple-harmonic` | 简谐运动 | Simple Harmonic Motion | 弹簧振子、周期 | T = 2π√(m/k) | 弹簧振子振动，实时绘制x-t图，调节质量和弹性系数 |
| 37 | `pendulum` | 单摆实验 | Pendulum | 单摆周期、重力加速度 | T = 2π√(L/g) | 单摆摆动，改变摆长测周期，计算g值 |
| 38 | `momentum-collision` | 动量守恒 | Momentum Conservation | 动量守恒、碰撞 | m₁v₁ + m₂v₂ = const | 两球碰撞(弹性/非弹性)，对比碰前碰后动量 |
| 39 | `angular-momentum` | 角动量守恒 | Angular Momentum | 角动量、转动惯量 | L = Iω = const | 旋转平台上收缩手臂加速旋转(花滑效应) |

### 电磁学 (electricity)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 40 | `coulombs-law` | 库仑定律 | Coulomb's Law | 点电荷、电场力 | F = kq₁q₂/r² | 两个带电球，调节电荷量和距离，观察力的变化 |
| 41 | `electric-field` | 电场线可视化 | Electric Field Lines | 电场、等势线 | E = F/q | 放置正负电荷，实时绘制电场线和等势面 |
| 42 | `capacitor` | 电容器充放电 | Capacitor Charge/Discharge | RC电路、时间常数 | Q = CV, τ = RC | 电容器充放电过程，电压-时间曲线实时绘制 |
| 43 | `ac-circuit` | 交流电路 | AC Circuit | 交流电、RLC | Z = √(R²+(XL-XC)²) | RLC串联电路，调节频率观察谐振现象 |
| 44 | `lorentz-force` | 洛伦兹力 | Lorentz Force | 带电粒子在磁场中运动 | F = qv×B | 带电粒子射入磁场，观察圆周/螺旋运动轨迹 |

### 光学 (waves)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 45 | `double-slit` | 双缝干涉 | Double-Slit Interference | 光的波动性、干涉 | Δx = λL/d | 激光通过双缝，屏幕上形成明暗相间条纹 |
| 46 | `diffraction-grating` | 衍射光栅 | Diffraction Grating | 衍射、光谱分析 | dsinθ = nλ | 白光通过光栅分解为彩色光谱 |
| 47 | `total-reflection` | 全反射 | Total Internal Reflection | 全反射、临界角 | sinθc = n₂/n₁ | 光从玻璃射向空气，增大入射角直到全反射 |
| 48 | `polarization` | 光的偏振 | Polarization | 偏振、马吕斯定律 | I = I₀cos²θ | 光通过两个偏振片，旋转角度观察透射光强变化 |

### 热学 (thermodynamics)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 49 | `ideal-gas-law` | 理想气体定律 | Ideal Gas Law | PVT关系 | PV = nRT | 密封容器中气体，调节温度/体积观察压强变化 |
| 50 | `carnot-engine` | 卡诺热机 | Carnot Engine | 热机效率、熵 | η = 1 - T冷/T热 | 热机工作循环动画，PV图实时绘制，计算效率 |
| 51 | `brownian-motion` | 布朗运动 | Brownian Motion | 分子热运动 | — | 显微镜视角下花粉颗粒的随机运动，粒子模拟 |

### 近代物理 (modern)

| # | ID | 实验名称 | 英文标题 | 核心概念 | 关键公式 | 3D场景描述 |
|---|-----|---------|----------|----------|---------|-----------|
| 52 | `photoelectric` | 光电效应 | Photoelectric Effect | 光量子、逸出功 | E = hf - W | 光照射金属板，调节频率和强度，观察电子逸出 |
| 53 | `bohr-atom` | 玻尔原子模型 | Bohr Atom Model | 能级跃迁、光谱 | E = -13.6/n² eV | 电子在不同能级间跃迁，发出/吸收特定频率光子 |
| 54 | `nuclear-decay` | 核衰变 | Nuclear Decay | 半衰期、放射性 | N = N₀(1/2)^(t/T) | 大量原子核随机衰变，实时统计剩余数量，绘制衰变曲线 |
| 55 | `wave-particle` | 波粒二象性 | Wave-Particle Duality | 德布罗意波 | λ = h/p | 电子双缝实验，逐个电子积累出干涉图样 |
| 56 | `special-relativity` | 狭义相对论效应 | Special Relativity | 时间膨胀、长度收缩 | γ = 1/√(1-v²/c²) | 飞船接近光速时的时钟变慢和长度收缩可视化 |
| 57 | `mass-energy` | 质能方程 | Mass-Energy Equivalence | 质能转换 | E = mc² | 核裂变/聚变过程中质量亏损转化为能量的可视化 |

---

## 四、生成批次规划 (Wave)

### Wave 1 — 基础力学 + 光学 (已完成 + 新增 8 个)
**已有**: newtons-laws, projectile-motion, roller-coaster, em-spectrum
**新增**:

| 批次 | ID | 阶段 | 优先级 |
|------|-----|------|--------|
| W1 | `lever-balance` | 小学 | P0 |
| W1 | `inclined-plane` | 小学 | P0 |
| W1 | `gravity-drop` | 小学 | P0 |
| W1 | `spring-stretch` | 小学 | P0 |
| W1 | `speed-measurement` | 初中 | P0 |
| W1 | `friction-experiment` | 初中 | P0 |
| W1 | `uniform-acceleration` | 高中 | P0 |
| W1 | `simple-harmonic` | 高中 | P0 |

### Wave 2 — 电磁学 (10 个)

| 批次 | ID | 阶段 | 优先级 |
|------|-----|------|--------|
| W2 | `simple-circuit` | 小学 | P0 |
| W2 | `ohms-law` | 初中 | P0 |
| W2 | `series-parallel` | 初中 | P0 |
| W2 | `electrical-power` | 初中 | P1 |
| W2 | `magnetic-field` | 初中 | P0 |
| W2 | `electromagnetic-induction` | 初中 | P0 |
| W2 | `coulombs-law` | 高中 | P0 |
| W2 | `electric-field` | 高中 | P0 |
| W2 | `capacitor` | 高中 | P1 |
| W2 | `lorentz-force` | 高中 | P0 |

### Wave 3 — 波动 + 光学 + 热学 (14 个)

| 批次 | ID | 阶段 | 优先级 |
|------|-----|------|--------|
| W3 | `sound-waves` | 小学 | P0 |
| W3 | `echo-reflection` | 小学 | P1 |
| W3 | `light-shadow` | 小学 | P0 |
| W3 | `color-mixing` | 小学 | P1 |
| W3 | `heat-conduction` | 小学 | P0 |
| W3 | `states-of-matter` | 小学 | P0 |
| W3 | `light-reflection` | 初中 | P0 |
| W3 | `light-refraction` | 初中 | P0 |
| W3 | `convex-lens` | 初中 | P0 |
| W3 | `sound-frequency` | 初中 | P1 |
| W3 | `double-slit` | 高中 | P0 |
| W3 | `total-reflection` | 高中 | P0 |
| W3 | `ideal-gas-law` | 高中 | P0 |
| W3 | `brownian-motion` | 高中 | P1 |

### Wave 4 — 近代物理 + 高级主题 (15 个)

| 批次 | ID | 阶段 | 优先级 |
|------|-----|------|--------|
| W4 | `pulley-system` | 小学 | P1 |
| W4 | `density-measurement` | 初中 | P0 |
| W4 | `pressure-demo` | 初中 | P1 |
| W4 | `liquid-pressure` | 初中 | P0 |
| W4 | `buoyancy` | 初中 | P0 |
| W4 | `lever-principle` | 初中 | P0 |
| W4 | `heat-capacity` | 初中 | P1 |
| W4 | `thermal-expansion` | 初中 | P1 |
| W4 | `resonance` | 初中 | P1 |
| W4 | `wave-interference` | 初中 | P0 |
| W4 | `pendulum` | 高中 | P0 |
| W4 | `momentum-collision` | 高中 | P0 |
| W4 | `circular-motion` | 高中 | P0 |
| W4 | `angular-momentum` | 高中 | P1 |
| W4 | `ac-circuit` | 高中 | P1 |
| W4 | `diffraction-grating` | 高中 | P1 |
| W4 | `polarization` | 高中 | P1 |
| W4 | `carnot-engine` | 高中 | P1 |
| W4 | `photoelectric` | 高中 | P0 |
| W4 | `bohr-atom` | 高中 | P0 |
| W4 | `nuclear-decay` | 高中 | P0 |
| W4 | `wave-particle` | 高中 | P0 |
| W4 | `special-relativity` | 高中 | P1 |
| W4 | `mass-energy` | 高中 | P1 |

---

## 五、统计总览

| 阶段 | 力学 | 波动/光学 | 电磁学 | 热学 | 近代物理 | 合计 |
|------|------|----------|--------|------|---------|------|
| 小学 (beginner) | 5 | 4 | 1 | 2 | 0 | **12** |
| 初中 (intermediate) | 7 | 5 | 5 | 3 | 0 | **20** |
| 高中 (advanced) | 7 | 4 | 5 | 3 | 6 | **25** |
| **合计** | **19** | **13** | **11** | **8** | **6** | **57** |

已有: 4 个 | 待生成: **53 个**

---

## 六、Agent Team 分工方案

### 团队结构

```
Team Lead (主控)
├── Agent-Mechanics    — 力学实验 (19个)
├── Agent-Waves        — 波动/光学实验 (13个)
├── Agent-Electricity  — 电磁学实验 (11个)
├── Agent-Thermo       — 热学实验 (8个)
├── Agent-Modern       — 近代物理实验 (6个)
└── Agent-Integration  — 注册接入 + 验证
```

### 每个 Agent 的工作流

```
1. 读取现有实验模板 (newtons-laws.ts + NewtonsLawsScene.tsx)
2. 按批次顺序生成:
   a. 创建 data/{slug}.ts — 实验数据定义
   b. 创建 three/{Name}Scene.tsx — 3D 场景组件
3. 完成后通知 Agent-Integration
```

### Agent-Integration 的工作流

```
1. 收集所有新实验的 import
2. 更新 registry.ts — 添加所有实验到数组
3. 更新 ExperimentClient.tsx — 添加 dynamic import + switch case
4. 运行 TypeScript 编译检查
5. 运行 build 验证
```

### 并行策略

- Wave 1-2: 5 个 Agent 同时工作，每个 Agent 处理自己分类下的实验
- 每完成一个 Wave，Agent-Integration 统一接入
- Wave 间可以并行：Agent 生成 Wave 2 的同时，Integration 接入 Wave 1

---

## 七、单个实验生成 Checklist

- [ ] `data/{slug}.ts` — 完整 Experiment 对象
  - [ ] id, slug, title, subtitle, description
  - [ ] standards (ngss, gcse, ap)
  - [ ] category, tags, difficulty
  - [ ] parameters (至少 2-3 个可调参数)
  - [ ] formulas (LaTeX 格式)
  - [ ] theory, instructions
  - [ ] challenges (至少 2-3 个)
  - [ ] wave, tier, estimatedTime
  - [ ] relatedExperiments
  - [ ] seoTitle, seoKeywords, jsonLd
- [ ] `three/{Name}Scene.tsx` — 3D 场景
  - [ ] React Three Fiber 组件
  - [ ] 接收参数 props + isPlaying/time/speed/onTick
  - [ ] 物理模拟逻辑 (useFrame)
  - [ ] 视觉效果 (neon 风格: cyan/magenta/green 发光)
  - [ ] 数据标签 (Text 组件显示实时数值)
  - [ ] 使用 SceneContainer 包裹
- [ ] 注册接入
  - [ ] registry.ts 添加 import + 数组项
  - [ ] ExperimentClient.tsx 添加 dynamic import + switch case
- [ ] TypeScript 编译通过
