---
name: ap-physics-experiment-gap-analysis
status: in-progress
created: 2026-03-22T06:03:31Z
updated: 2026-03-22T06:03:31Z
cto-reviewed: 2026-03-22T06:03:31Z
cto-status: approved-with-amendments
---

# AP Physics 实验内容缺口分析与补全规划

**文档目的**：对照 College Board AP Physics 1 / 2 完整考纲，核查现有50个实验的覆盖情况，列出所有缺口实验的详细规格，供 CTO 审核后排入开发队列。

**目标受众**：北美高中 AP Physics 学生（每年约30万 AP Physics 1 考生，约15万 AP Physics 2 考生）

---

## 一、AP Physics 1 完整考纲覆盖映射

College Board AP Physics 1 考纲共 7 大单元，加权比例如下：

| 单元 | 主题 | 考试占比 | 现有实验 | 状态 |
|------|------|---------|---------|------|
| Unit 1 | Kinematics（运动学） | 12-18% | `projectile-motion` | 🟡 部分覆盖（缺1D运动图像） |
| Unit 2 | Dynamics（牛顿动力学） | 16-20% | `newtons-laws` | ✅ 覆盖 |
| Unit 3 | Circular Motion & Gravitation（圆周运动与引力） | 6-8% | `circular-motion`, `gravitational-fields` | ✅ 覆盖 |
| Unit 4 | Energy（能量） | 20-28% | `roller-coaster` | 🟡 部分覆盖（缺功-能定理专项） |
| Unit 5 | Momentum（动量） | 12-18% | `momentum-collisions` | 🟡 部分覆盖（缺冲量专项） |
| Unit 6 | Simple Harmonic Motion（简谐运动） | 4-6% | `simple-harmonic-motion` | ✅ 覆盖 |
| Unit 7 | Torque & Rotational Motion（力矩与转动） | 12-18% | `rotational-motion` | ✅ 覆盖 |
| Unit 8 | Electric Charge, Field, Potential（静电场） | 包含在Physics 2 | `electric-field-lines` | 🟡 部分覆盖（缺库仑定律） |
| Unit 9 | DC Circuits（直流电路） | 14-20% | **无** | ❌ 完全缺失 |
| Unit 10 | Mechanical Waves & Sound（机械波与声音） | 12-16% | `wave-interference` | 🟡 部分覆盖（缺多普勒效应） |

**AP Physics 1 缺口汇总：4个实验**
1. `kinematics-graphs` — 1D运动学图像（位移-时间、速度-时间）
2. `work-energy-theorem` — 功-能定理与功率
3. `dc-circuits-basic` — 直流电路（欧姆定律、串并联）
4. `doppler-effect` — 多普勒效应与声波

---

## 二、AP Physics 2 完整考纲覆盖映射

College Board AP Physics 2 考纲共 7 大单元：

| 单元 | 主题 | 考试占比 | 现有实验 | 状态 |
|------|------|---------|---------|------|
| Unit 1 | Thermodynamics（热力学） | 12-18% | **无** | ❌ 完全缺失 |
| Unit 2 | Electric Force, Field & Potential（电场与电势） | 18-22% | `electric-field-lines`, `lorentz-force` | 🟡 部分覆盖（缺电势/电容） |
| Unit 3 | Electric Circuits（含电容的电路） | 10-14% | **无** | ❌ 完全缺失 |
| Unit 4 | Magnetism & Electromagnetic Induction（磁场与感应） | 10-14% | `lorentz-force` | 🟡 部分覆盖（缺法拉第感应） |
| Unit 5 | Geometric & Physical Optics（几何与物理光学） | 12-18% | `wave-interference`, `em-spectrum` | 🟡 部分覆盖（缺透镜/镜子） |
| Unit 6 | Quantum, Atomic & Nuclear Physics（量子与核物理） | 10-14% | **无** | ❌ 完全缺失 |
| Unit 7 | Fluid Mechanics（流体力学） | 6-8% | `fluid-statics` | 🟡 部分覆盖（缺伯努利） |

**AP Physics 2 缺口汇总：9个实验**
1. `ideal-gas-thermodynamics` — 理想气体定律与PV图
2. `heat-engines` — 热机与热力学第二定律
3. `electric-potential-voltage` — 电势与电压
4. `capacitors-electric-field` — 电容器与RC电路
5. `electromagnetic-induction` — 法拉第感应定律
6. `geometric-optics-lenses` — 透镜与平面镜成像
7. `single-slit-diffraction` — 单缝衍射
8. `photoelectric-effect` — 光电效应
9. `nuclear-decay` — 核衰变与放射性
10. `bernoulli-fluid-dynamics` — 伯努利方程与流体流动

**缺口总计：AP Physics 1缺4个 + AP Physics 2缺10个 = 14个新实验**

---

## 三、缺口实验详细规格

每个实验按统一格式规格化，字段与现有实验 TypeScript schema 对齐。

---

### EXP-001：运动学图像（Kinematics Graphs）

```
ID:           kinematics-graphs
Slug:         kinematics-position-velocity-time-graphs
Wave:         7（AP Physics 1补充）
Tier:         free（前3个免费实验候选）
Difficulty:   beginner
EstTime:      20 min
Category:     mechanics
```

**学习目标**
- 从位置-时间图读出速度（斜率）
- 从速度-时间图读出加速度（斜率）和位移（面积）
- 识别匀速、匀加速、减速三种运动的图像特征
- 理解图像斜率与物理量的对应关系

**可视化核心**
- 左侧：3D场景中一辆小车沿轨道运动，实时显示速度矢量箭头
- 右侧：两张实时绘制的图表（x-t 和 v-t），随小车运动同步更新
- 用颜色高亮显示当前时刻对应的图像斜率区域

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `initial_velocity` | Initial Velocity | m/s | -10 ~ 10 | free |
| `acceleration` | Acceleration | m/s² | -5 ~ 5 | free |
| `time_scale` | Time Scale | x | 0.25 ~ 2 | pro |
| `graph_type` | Show Graph | — | x-t / v-t / a-t | pro |

**核心公式**
```
x = x₀ + v₀t + ½at²      （位移-时间）
v = v₀ + at               （速度-时间）
Δx = area under v-t graph （v-t图面积=位移）
```

**挑战题**

| 题目 | Tier |
|------|------|
| 小车在 t=0 时速度为 4 m/s，以 -2 m/s² 减速，何时停止？ | free |
| 若 v-t 图中某段面积为负值，代表什么物理含义？ | free |
| 绘制一个先匀加速再匀速再减速的 a-t 图像 | pro |

**AP标准对齐**：AP Physics 1 Unit 1 (CHA-1.A, CHA-1.B, CHA-1.D)

---

### EXP-002：功-能定理（Work-Energy Theorem）

```
ID:           work-energy-theorem
Slug:         work-energy-theorem-power
Wave:         7
Tier:         pro
Difficulty:   intermediate
EstTime:      25 min
Category:     mechanics
```

**学习目标**
- 计算合外力做的功与动能变化量的关系
- 区分保守力做功与非保守力做功的影响
- 理解功率的概念及其与速度的关系
- 分析有摩擦情况下机械能的损失

**可视化核心**
- 3D斜面场景：一个物块从斜面顶端滑下
- 实时显示：动能（KE）、势能（PE）、摩擦热（Q）的能量条形图
- 箭头标注各力：重力、支持力、摩擦力、合外力
- 底部面板：功的累计数值实时更新

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `mass` | Mass | kg | 0.5 ~ 20 | free |
| `angle` | Incline Angle | ° | 10 ~ 75 | free |
| `friction_coeff` | Friction (μ) | — | 0 ~ 0.8 | pro |
| `applied_force` | Applied Force | N | 0 ~ 100 | pro |

**核心公式**
```
W_net = ΔKE = ½mv² - ½mv₀²
W = F·d·cos(θ)
P = W/t = F·v
ΔE_mech = W_friction = -μmgcosθ·d
```

**挑战题**

| 题目 | Tier |
|------|------|
| 质量5kg的物块从高度2m滑下，底部速度是多少（忽略摩擦）？ | free |
| 若加入μ=0.3的摩擦，底部速度减少了多少？ | free |
| 计算物块在斜面上运动10秒的平均功率 | pro |

**AP标准对齐**：AP Physics 1 Unit 4 (INT-3.A, INT-3.B, INT-3.C, INT-3.D)

---

### EXP-003：直流电路（DC Circuits — Ohm's Law & Series/Parallel）

```
ID:           dc-circuits-basic
Slug:         dc-circuits-ohms-law-series-parallel
Wave:         7
Tier:         free
Difficulty:   intermediate
EstTime:      30 min
Category:     electricity
```

**学习目标**
- 验证欧姆定律 V = IR
- 计算串联和并联电路中的等效电阻
- 理解电流在串联中保持不变、在并联中分流
- 计算电路中各元件的功率消耗

**可视化核心**
- 3D电路面板：电池、导线、电阻器以发光霓虹风格呈现
- 动画：彩色粒子（电子）沿导线流动，流速代表电流大小
- 电压表和电流表的实时数字显示
- 串联/并联切换时，电路拓扑实时重构动画

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `voltage` | Battery Voltage | V | 1 ~ 24 | free |
| `R1` | Resistor 1 | Ω | 1 ~ 100 | free |
| `R2` | Resistor 2 | Ω | 1 ~ 100 | free |
| `circuit_type` | Series / Parallel | — | series/parallel | free |
| `R3` | Resistor 3 | Ω | 1 ~ 100 | pro |
| `internal_resistance` | Internal Resistance | Ω | 0 ~ 5 | pro |

**核心公式**
```
V = IR                         （欧姆定律）
R_series = R₁ + R₂ + R₃      （串联等效电阻）
1/R_parallel = 1/R₁ + 1/R₂   （并联等效电阻）
P = IV = I²R = V²/R           （功率）
```

**挑战题**

| 题目 | Tier |
|------|------|
| 12V电池接串联10Ω+20Ω，流过的电流是多少？ | free |
| 同样的两个电阻改为并联，总电流变为多少？ | free |
| 两支路并联，R₁=10Ω，R₂=30Ω，各支路电流比是多少？ | pro |

**AP标准对齐**：AP Physics 1 Unit 9 (CHA-2.A, CHA-2.B, CHA-2.C, CHA-2.D)

---

### EXP-004：多普勒效应（Doppler Effect）

```
ID:           doppler-effect
Slug:         doppler-effect-sound-waves
Wave:         7
Tier:         pro
Difficulty:   intermediate
EstTime:      20 min
Category:     waves
```

**学习目标**
- 理解声源运动如何改变观察者接收到的频率
- 用多普勒公式计算观测频率
- 区分声源接近和远离时的频率变化
- 理解声爆（Sonic Boom）的形成

**可视化核心**
- 3D俯视场景：一辆救护车（或飞机）沿直线运动
- 波前圆圈动画：显示压缩（前方高频）和稀疏（后方低频）的波前分布
- 两个观察者（前方/后方）显示不同频率的波形
- 声速可超越时：波前叠加形成马赫锥动画

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `source_frequency` | Source Frequency | Hz | 200 ~ 1000 | free |
| `source_speed` | Source Speed | m/s | 0 ~ 400 | free |
| `observer_position` | Observer Position | m | -50 ~ 50 | pro |
| `medium` | Medium | — | air/water | pro |

**核心公式**
```
f_obs = f_source × (v_sound ± v_observer) / (v_sound ∓ v_source)
（接近时：分子+，分母-）
Mach Number = v_source / v_sound
```

**挑战题**

| 题目 | Tier |
|------|------|
| 救护车以30m/s接近，频率800Hz，观察者听到多少Hz？（v=343m/s） | free |
| 救护车驶离时，频率如何变化？计算具体值 | free |
| 当声源速度等于声速时，波前发生了什么？ | pro |

**AP标准对齐**：AP Physics 1 Unit 10 (WVS-1.B, WVS-1.C)

---

### EXP-005：理想气体与热力学（Ideal Gas Law & PV Diagrams）

```
ID:           ideal-gas-thermodynamics
Slug:         ideal-gas-law-pv-diagrams
Wave:         8（AP Physics 2补充）
Tier:         pro
Difficulty:   intermediate
EstTime:      30 min
Category:     thermodynamics
```

**学习目标**
- 验证理想气体定律 PV = nRT
- 区分等温、等压、等容、绝热四种热力学过程
- 在 PV 图上识别各过程的曲线形状
- 计算各过程中的做功（PV图面积）

**可视化核心**
- 左侧3D场景：气缸-活塞系统，气体分子（粒子系统）随温压变化改变运动速度和密度
- 右侧：实时绘制 PV 图，当前过程路径高亮
- 分子平均动能与温度的可视化关联（颜色编码）

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `temperature` | Temperature | K | 100 ~ 1000 | free |
| `pressure` | Pressure | atm | 0.1 ~ 10 | free |
| `process_type` | Process | — | isothermal/isobaric（free）/ isochoric/adiabatic（pro） | free/pro |
| `moles` | Amount of Gas | mol | 0.1 ~ 2 | pro |

**核心公式**
```
PV = nRT                      （理想气体定律，R = 8.314 J/mol·K）
W = PΔV                       （等压过程做功）
W = ∫P dV = nRT ln(V₂/V₁)    （等温过程做功）
ΔU = Q - W                    （热力学第一定律）
KE_avg = (3/2)kT              （分子平均动能）
```

**挑战题**

| 题目 | Tier |
|------|------|
| 等温压缩：体积从4L减到2L，压强如何变化？ | free |
| 等压升温：气体从300K加热到600K，体积如何变化？ | free |
| 在PV图上，哪种过程对外做功最多？ | pro |

**AP标准对齐**：AP Physics 2 Unit 1 (TUL-1.A, TUL-1.B, TUL-1.C, TUL-2.A)

---

### EXP-006：热机循环（Heat Engines & Thermodynamic Cycles）

```
ID:           heat-engines
Slug:         heat-engines-carnot-cycle-efficiency
Wave:         8
Tier:         max
Difficulty:   advanced
EstTime:      35 min
Category:     thermodynamics
```

**学习目标**
- 理解热机从高温热源吸热、对外做功、向低温热源放热的循环过程
- 在 PV 图上绘制卡诺循环
- 计算热机效率 e = W/Q_H
- 理解卡诺效率是理论上限

**可视化核心**
- 3D场景：蒸汽机模型，活塞往复运动动画
- PV图实时绘制循环路径
- 能量流桑基图：高温热源→做功→低温热源的能量分配
- 效率仪表盘

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `T_hot` | Hot Reservoir Temp | K | 400 ~ 1200 | pro |
| `T_cold` | Cold Reservoir Temp | K | 200 ~ 400 | pro |
| `cycle_type` | Cycle Type | — | Carnot/Otto/Diesel | max |

**核心公式**
```
e = W_net / Q_H = 1 - Q_C/Q_H
e_Carnot = 1 - T_C/T_H          （卡诺效率，最大理论值）
COP_refrigerator = Q_C / W
```

**挑战题**

| 题目 | Tier |
|------|------|
| 高温800K、低温400K的卡诺热机效率是多少？ | pro |
| 实际热机效率为什么低于卡诺效率？ | pro |
| 为什么降低冷端温度可以提高效率？ | max |

**AP标准对齐**：AP Physics 2 Unit 1 (TUL-3.A, TUL-3.B, TUL-3.C)

---

### EXP-007：电势与电压（Electric Potential & Voltage）

```
ID:           electric-potential-voltage
Slug:         electric-potential-voltage-equipotential-lines
Wave:         8
Tier:         pro
Difficulty:   intermediate
EstTime:      25 min
Category:     electricity
```

**学习目标**
- 理解电势（电压）与电场的关系：E = -dV/dx
- 绘制等势线并理解其与电场线垂直
- 计算点电荷产生的电势
- 理解电势能与功的关系

**可视化核心**
- 3D空间中点电荷周围的电场线（箭头）和等势面（半透明球壳）
- 颜色渐变：高电势区域（红色）→低电势区域（蓝色）
- 测试电荷在电场中释放时的运动轨迹动画
- 实时显示任意位置的电势值（鼠标悬停）

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `charge_value` | Source Charge | μC | -10 ~ 10 | free |
| `test_charge` | Test Charge Sign | — | +/- | free |
| `charge_count` | Number of Charges | — | 1 ~ 3 | pro |
| `charge2_position` | Charge 2 Position | m | -5 ~ 5 | pro |

**核心公式**
```
V = kq/r                （点电荷电势，k = 8.99×10⁹ N·m²/C²）
E = -ΔV/Δx             （电场与电势梯度的关系）
U = qV                  （电势能）
W = q(V₁ - V₂) = -ΔU  （电场力做功）
```

**挑战题**

| 题目 | Tier |
|------|------|
| 距离2μC点电荷1m处的电势是多少？ | free |
| 等势线和电场线之间是什么关系？ | free |
| 将+1μC电荷从A点(V=100V)移到B点(V=300V)，需要做多少功？ | pro |

**AP标准对齐**：AP Physics 2 Unit 2 (CHA-2.C, CHA-2.D, CHA-3.A)

---

### EXP-008：电容器（Capacitors & RC Circuits）

```
ID:           capacitors-rc-circuits
Slug:         capacitors-charging-discharging-rc-circuits
Wave:         8
Tier:         pro
Difficulty:   intermediate
EstTime:      30 min
Category:     electricity
```

**学习目标**
- 理解电容的物理意义：C = Q/V
- 分析平行板电容器的电场分布
- 观察 RC 电路充放电的指数规律
- 理解时间常数 τ = RC 的含义

**可视化核心**
- 左侧：平行板电容器3D模型，极板间均匀电场可视化，随充电进度电场线增强
- 右侧：RC电路图 + 实时绘制 V(t) 和 I(t) 充放电曲线
- τ 标注：在图上高亮显示 t=τ、t=2τ、t=5τ 时刻

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `capacitance` | Capacitance | μF | 1 ~ 1000 | free |
| `resistance` | Resistance | kΩ | 1 ~ 100 | free |
| `voltage` | Battery Voltage | V | 1 ~ 24 | free |
| `plate_area` | Plate Area | cm² | 10 ~ 500 | pro |
| `plate_separation` | Plate Separation | mm | 1 ~ 20 | pro |

**核心公式**
```
C = Q/V = ε₀A/d              （平行板电容器，d=极板间距，A=极板面积）
V(t) = V₀(1 - e^(-t/RC))    （充电过程）
V(t) = V₀e^(-t/RC)          （放电过程）
τ = RC                        （时间常数）
U = ½CV² = Q²/(2C)           （电容储能）
```

**挑战题**

| 题目 | Tier |
|------|------|
| RC=2s，t=2s时电容器充到电池电压的百分之多少？ | free |
| 增大极板间距会如何影响电容量？ | free |
| 两个相同电容并联后总电容是多少？串联呢？ | pro |

**AP标准对齐**：AP Physics 2 Unit 3 (CHA-2.E, CHA-2.F, CHA-4.A)

---

### EXP-009：电磁感应（Electromagnetic Induction）

```
ID:           electromagnetic-induction
Slug:         electromagnetic-induction-faradays-law-lenz
Wave:         8
Tier:         pro
Difficulty:   advanced
EstTime:      30 min
Category:     electricity
```

**学习目标**
- 理解法拉第定律：变化的磁通量产生感应电动势
- 用楞次定律判断感应电流方向
- 理解发电机的工作原理
- 区分运动型感应和变化型感应

**可视化核心**
- 3D场景：一个线圈在磁场中旋转（发电机模型）
- 实时显示：磁通量 Φ、感应电动势 ε、感应电流 I 的时间图像
- 磁场线穿过线圈的动画（线圈转动时磁通量变化直观可见）
- 楞次定律演示：条形磁铁插入/拔出线圈，电流表指针偏转动画

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `B_field` | Magnetic Field | T | 0.1 ~ 2.0 | free |
| `rotation_speed` | Angular Velocity | rad/s | 0.1 ~ 10 | free |
| `coil_turns` | Number of Turns (N) | — | 1 ~ 200 | pro |
| `coil_area` | Coil Area | cm² | 10 ~ 500 | pro |

**核心公式**
```
Φ_B = B·A·cos(θ)            （磁通量）
ε = -N·dΦ_B/dt              （法拉第定律）
ε = NBAω·sin(ωt)            （旋转线圈的感应电动势）
Lenz's Law: 感应电流方向使其产生的磁通量阻碍原磁通量的变化
```

**挑战题**

| 题目 | Tier |
|------|------|
| 线圈面积0.01m²，B=0.5T，以10rad/s旋转，最大感应电动势是多少？ | free |
| 楞次定律的本质是什么定律的体现？ | free |
| 增加线圈匝数N，感应电动势如何变化？ | pro |

**AP标准对齐**：AP Physics 2 Unit 4 (CHA-4.B, CHA-4.C, CHA-4.D)

---

### EXP-010：几何光学（Geometric Optics — Lenses & Mirrors）

```
ID:           geometric-optics-lenses
Slug:         geometric-optics-lenses-mirrors-ray-tracing
Wave:         8
Tier:         free
Difficulty:   beginner
EstTime:      25 min
Category:     optics
```

**学习目标**
- 用三条特殊光线（光线追踪法）作图确定像的位置和性质
- 用薄透镜公式和放大率公式进行计算
- 区分实像与虚像、正立与倒立
- 理解凸透镜和凹透镜的不同成像规律

**可视化核心**
- 3D场景（俯视光学平台）：光源、透镜/平面镜、光线路径
- 三条特殊光线以不同颜色实时绘制（平行光线→折射后过焦点；过焦点光线→折射后平行；过光心光线→不偏折）
- 像的位置自动更新，显示实像（红色）或虚像（虚线橙色）
- 物距 u 可通过拖动光源调整

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `focal_length` | Focal Length | cm | -50 ~ 50（负值=凹透镜） | free |
| `object_distance` | Object Distance | cm | 5 ~ 100 | free |
| `lens_type` | Lens / Mirror | — | convex lens / concave lens / concave mirror / convex mirror | pro |
| `object_height` | Object Height | cm | 1 ~ 20 | pro |

**核心公式**
```
1/f = 1/v + 1/u            （薄透镜公式，v=像距，u=物距，f=焦距）
m = -v/u = h_i/h_o         （横向放大率）
正v=实像（透镜异侧），负v=虚像（透镜同侧）
正m=正立，负m=倒立
```

**挑战题**

| 题目 | Tier |
|------|------|
| 物体距凸透镜30cm，f=20cm，像在哪里？是实像还是虚像？ | free |
| 物体在焦点内时，成什么像？如何用公式验证？ | free |
| 平面镜的焦距是多少？用公式解释 | pro |

**AP标准对齐**：AP Physics 2 Unit 5 (WVS-2.A, WVS-2.B, WVS-2.C)

---

### EXP-011：单缝衍射（Single-Slit Diffraction）

```
ID:           single-slit-diffraction
Slug:         single-slit-diffraction-pattern
Wave:         8
Tier:         pro
Difficulty:   advanced
EstTime:      25 min
Category:     waves
```

**学习目标**
- 理解单缝衍射与双缝干涉的本质区别
- 预测衍射极小的位置（暗纹条件）
- 理解缝宽对衍射图样的影响（缝越窄，衍射越明显）
- 区分单缝衍射包络和双缝干涉细纹的叠加

**可视化核心**
- 3D场景：激光束照射单缝，屏幕上显示衍射图样
- 实时更新衍射强度分布曲线（I vs θ）
- 缝宽改变时，图样宽度变化的动态动画（直观展示宽缝→窄缝的变化）
- 惠更斯子波来源的示意动画

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `slit_width` | Slit Width (a) | μm | 0.5 ~ 20 | free |
| `wavelength` | Wavelength (λ) | nm | 380 ~ 780（颜色变化） | free |
| `screen_distance` | Screen Distance | m | 0.5 ~ 5 | pro |
| `compare_double_slit` | Compare with Double-Slit | — | on/off | pro |

**核心公式**
```
a·sin(θ) = mλ        （单缝衍射暗纹条件，m = ±1, ±2, ...）
Δy ≈ λL/a             （相邻暗纹间距，L=缝到屏距离）
I(θ) ∝ [sin(α)/α]²   （单缝衍射强度分布，α = πa·sinθ/λ）
```

**挑战题**

| 题目 | Tier |
|------|------|
| 缝宽减半，中央亮纹宽度如何变化？ | free |
| 使用波长更长的光，衍射图样如何变化？ | free |
| 为什么单缝衍射中央亮纹比两侧亮纹宽得多？ | pro |

**AP标准对齐**：AP Physics 2 Unit 5 (WVS-1.D, WVS-1.E)

---

### EXP-012：光电效应（Photoelectric Effect）

```
ID:           photoelectric-effect
Slug:         photoelectric-effect-photon-energy-work-function
Wave:         8
Tier:         pro
Difficulty:   intermediate
EstTime:      25 min
Category:     modern-physics
```

**学习目标**
- 理解光的粒子性（光子）的实验证据
- 用爱因斯坦光电方程解释光电效应
- 理解截止电压与逸出功的关系
- 区分频率对光电效应的影响与光强的影响（光强≠能量，频率才决定）

**可视化核心**
- 3D场景：金属板在光照下，电子（粒子动画）被弹出并飞向收集极
- 两个控制面板：调光的频率（颜色变化）和光强（光子数量变化）
- 停止电压仪表：显示截止电压值
- 关键对比动画：低频率大光强→没有光电子；高频率小光强→有光电子

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `light_frequency` | Light Frequency | ×10¹⁴ Hz | 4 ~ 10 | free |
| `light_intensity` | Light Intensity | W/m² | 0.1 ~ 100 | free |
| `metal_type` | Metal (Work Function) | — | Na/Al/Cu/Pt | pro |
| `stopping_voltage` | Applied Stopping Voltage | V | 0 ~ 5 | pro |

**核心公式**
```
E_photon = hf = hc/λ            （光子能量，h = 6.626×10⁻³⁴ J·s）
KE_max = hf - φ                  （爱因斯坦光电方程，φ=逸出功）
eV_stop = KE_max                 （截止电压与最大动能的关系）
f_threshold = φ/h                （截止频率，低于此频率无光电效应）
```

**挑战题**

| 题目 | Tier |
|------|------|
| 为什么增大光强（但频率不变且低于阈值）仍然没有光电子？ | free |
| 钠的逸出功2.28eV，最小截止频率是多少？ | free |
| 用5×10¹⁴ Hz光照射铜（φ=4.5eV），会有光电子吗？ | pro |

**AP标准对齐**：AP Physics 2 Unit 6 (MOD-1.A, MOD-1.B, MOD-1.C)

---

### EXP-013：核衰变与放射性（Nuclear Decay & Radioactivity）

```
ID:           nuclear-decay
Slug:         nuclear-decay-alpha-beta-gamma-half-life
Wave:         8
Tier:         pro
Difficulty:   intermediate
EstTime:      25 min
Category:     modern-physics
```

**学习目标**
- 区分 α、β、γ 三种衰变的本质与穿透能力
- 用半衰期公式计算放射性元素的残余量
- 理解核反应方程中质量数和原子序数的守恒
- 理解放射性衰变的统计性质

**可视化核心**
- 3D场景：原子核粒子模型（质子/中子用不同颜色球体），衰变时粒子飞出动画
- 三种辐射粒子的穿透能力对比动画（α被纸挡住，β被铝挡住，γ需要铅）
- 指数衰减曲线实时绘制（N vs t）
- 粒子计数器动画：随时间显示放射性随机衰变的离散性

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `decay_type` | Decay Type | — | α/β⁻/β⁺/γ | free |
| `half_life` | Half Life | years | 0.01 ~ 10000 | free |
| `initial_amount` | Initial Amount | g | 0.001 ~ 1000 | pro |
| `time_elapsed` | Time Elapsed | half-lives | 0 ~ 10 | pro |

**核心公式**
```
N(t) = N₀ × (½)^(t/T½)     （放射性衰变方程）
N(t) = N₀e^(-λt)            （用衰变常数表示）
λ = ln2 / T½                （衰变常数与半衰期的关系）
α衰变: ᴬzX → ᴬ⁻⁴_(z-2)Y + ⁴₂He
β⁻衰变: ᴬzX → ᴬ_(z+1)Y + e⁻ + ν̄ₑ
```

**挑战题**

| 题目 | Tier |
|------|------|
| 经过3个半衰期，剩余物质是初始量的多少？ | free |
| ²³⁸₉₂U发生α衰变后，产物的质量数和原子序数是多少？ | free |
| 碳-14半衰期5730年，一个样本含碳-14是初始的25%，已过了多少年？ | pro |

**AP标准对齐**：AP Physics 2 Unit 6 (MOD-2.A, MOD-2.B, MOD-2.C)

---

### EXP-014：伯努利方程（Bernoulli's Principle & Fluid Dynamics）

```
ID:           bernoulli-fluid-dynamics
Slug:         bernoulli-equation-venturi-airfoil
Wave:         8
Tier:         pro
Difficulty:   intermediate
EstTime:      25 min
Category:     mechanics
```

**学习目标**
- 理解伯努利方程：流速快→压强小
- 用连续性方程分析变截面管道中的流速变化
- 解释飞机机翼升力的产生原理
- 分析文丘里管（Venturi tube）的工作原理

**可视化核心**
- 3D场景：变截面管道（细处和粗处），流体粒子流动动画
- 流速用粒子间距表示（间距小=流速快），压强用管壁颜色表示（蓝=低压，红=高压）
- 第二个场景：机翼截面，上下气流速度对比，升力矢量动画
- 实时显示三个测压计的压强值（直观对比）

**交互参数**

| 参数 | 标签 | 单位 | 范围 | Tier |
|------|------|------|------|------|
| `flow_velocity` | Inlet Velocity | m/s | 1 ~ 20 | free |
| `pipe_ratio` | Cross-section Ratio | — | 1:1 ~ 1:4 | free |
| `fluid_density` | Fluid Density | kg/m³ | 800 ~ 1200 | pro |
| `height_difference` | Height Difference | m | 0 ~ 5 | pro |

**核心公式**
```
P + ½ρv² + ρgh = constant   （伯努利方程）
A₁v₁ = A₂v₂                （连续性方程，不可压缩流体）
F_lift = (P_bottom - P_top) × A_wing  （机翼升力）
```

**挑战题**

| 题目 | Tier |
|------|------|
| 管道截面积减半，流速如何变化？压强如何变化？ | free |
| 飞机倒飞时为什么也能产生升力？ | free |
| 入口面积0.1m²速度2m/s，出口面积0.05m²，出口速度和压强变化是多少？ | pro |

**AP标准对齐**：AP Physics 2 Unit 7 (FLD-1.A, FLD-1.B, FLD-1.C)

---

## 四、优先级矩阵与开发顺序

### 评分标准
- **考试权重**：College Board 考纲中的占比百分比
- **复习需求**：学生报告的"最难理解"程度（基于 College Board free-response 历年失分统计）
- **可视化收益**：3D动画比文字/静态图的理解提升程度（主观评估）
- **开发难度**：技术实现复杂度

| 实验ID | 对应课程 | 考试占比 | 复习需求 | 可视化收益 | 开发难度 | **综合优先级** |
|--------|---------|---------|---------|-----------|---------|-------------|
| `dc-circuits-basic` | AP Physics 1 Unit 9 | 14-20% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 🟢 低 | **P1** |
| `electromagnetic-induction` | AP Physics 2 Unit 4 | 10-14% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🟡 中 | **P1** |
| `geometric-optics-lenses` | AP Physics 2 Unit 5 | 12-18% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🟢 低 | **P1** |
| `ideal-gas-thermodynamics` | AP Physics 2 Unit 1 | 12-18% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 🟡 中 | **P1** |
| `photoelectric-effect` | AP Physics 2 Unit 6 | 10-14% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🟢 低 | **P1** |
| `kinematics-graphs` | AP Physics 1 Unit 1 | 12-18% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 🟢 低 | **P2** |
| `capacitors-rc-circuits` | AP Physics 2 Unit 3 | 10-14% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 🟡 中 | **P2** |
| `electric-potential-voltage` | AP Physics 2 Unit 2 | 18-22% | ⭐⭐⭐ | ⭐⭐⭐ | 🟢 低 | **P2** |
| `bernoulli-fluid-dynamics` | AP Physics 2 Unit 7 | 6-8% | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🟡 中 | **P2** |
| `work-energy-theorem` | AP Physics 1 Unit 4 | 20-28% | ⭐⭐⭐ | ⭐⭐⭐ | 🟢 低 | **P2** |
| `nuclear-decay` | AP Physics 2 Unit 6 | 10-14% | ⭐⭐⭐ | ⭐⭐⭐ | 🟢 低 | **P3** |
| `doppler-effect` | AP Physics 1 Unit 10 | 12-16% | ⭐⭐⭐ | ⭐⭐⭐⭐ | 🟡 中 | **P3** |
| `single-slit-diffraction` | AP Physics 2 Unit 5 | 12-18% | ⭐⭐ | ⭐⭐⭐ | 🟡 中 | **P3** |
| `heat-engines` | AP Physics 2 Unit 1 | 12-18% | ⭐⭐⭐ | ⭐⭐⭐ | 🔴 高 | **P3** |

### 推荐开发批次

**Batch 1（立即开发，3周）**：P1的5个实验，按实现难度排序（CTO审核调整）

| 序号 | 实验 | 难度 | 估计工时 | 原因 |
|------|------|------|---------|------|
| 1 | `dc-circuits-basic` | 低 | 1.5天 | AP Physics 1最大缺口，粒子流动画是成熟模式 |
| 2 | `geometric-optics-lenses` | 低 | 1天 | 光线追踪3线逻辑，Three.js画线即可 |
| 3 | `photoelectric-effect` | 低-中 | 1.5天 | 粒子动画简单，但频率/光强双参数条件逻辑需仔细处理 |
| 4 | `ideal-gas-thermodynamics` | 中 | 2.5天 | 双场景（气缸+PV图）工作量最大 |
| 5 | `electromagnetic-induction` | 中 | 2.5天 | advanced难度，线圈旋转+3条时间图像同步，工作量最重 |

一次性技术基础建设（仅Batch 1期间做一次）：
- physics-answer-validator 模块：1天
- system prompt 增加公式校验节：0.5天

**Batch 1 总工时：约10.5天（含质控基础建设）**

**Batch 2（Batch 1发布后，2-3周）**：P2的5个实验
- `kinematics-graphs`、`capacitors-rc-circuits`、`electric-potential-voltage`、`bernoulli-fluid-dynamics`、`work-energy-theorem`

**Batch 3（可选，视付费用户增长决定）**：P3的4个实验
- `nuclear-decay`、`doppler-effect`、`single-slit-diffraction`、`heat-engines`

---

## 五、实验总数预测（完成后）

| 科目 | 当前 | Batch 1后 | Batch 1+2后 | 全部完成后 |
|------|------|-----------|------------|----------|
| AP Physics 1 | 9 | 10 | 12 | 13 |
| AP Physics 2 | 0（部分算Physics 2） | 4 | 8 | 10 |
| AP Biology | 10 | 10 | 10 | 10 |
| AP Chemistry | 7 | 7 | 7 | 7 |
| K-5 Elementary | 11 | 11 | 11 | 11 |
| Middle School | 9 | 9 | 9 | 9 |
| **总计** | **50** | **55** | **59** | **64** |

---

## 六、已有实验的UK/Canada对标标注（建议同步添加）

现有实验数据结构中已有 `standards.gcse` 字段（当前为空数组），建议在 Batch 1 开发期间同步补充，无需额外开发，只需更新数据文件：

| 实验 | AP Code | GCSE Code | A-Level Code |
|------|---------|-----------|-------------|
| `newtons-laws` | AP-1 3.A.1 | AQA P5.1 | OCR G481 |
| `projectile-motion` | AP-1 3.A.2 | AQA P5.2 | OCR G481 |
| `simple-harmonic-motion` | AP-1 7.A | AQA P7.4 | OCR G484 |
| `wave-interference` | AP-2 Unit 5 | AQA P7.2 | OCR G485 |
| `momentum-collisions` | AP-1 5.A | AQA P5.4 | OCR G481 |

（其余实验按相同逻辑补充，工作量约半天）

---

## 七、待CTO审核事项

1. **14个新实验的技术方案**：全部采用独立 Three.js HTML（Wave 2-6模式）还是部分用 React Three Fiber（Wave 1模式）？建议前者，开发速度更快，质量更稳定。

2. **Batch 1的开发优先级排序是否合理？** 当前建议以考试权重和视觉收益双重排序，但 CTO 可能有实现难度的额外考量。

3. **参数分层（free/pro/max）的划分逻辑**：文档中每个实验都已标注，请确认是否与商业目标对齐（建议：核心参数free可见、增强参数pro、高级分析参数max）。

4. **UK GCSE 标注同步**：建议在 Batch 1 期间同步更新现有50个实验的 `standards.gcse` 字段，工作量小，但能立刻解锁英国市场。

5. **内容质量风控（3层技术管线，无需外部专家）**：
   - **第1层（生成时）**：在 UPG system prompt 增加 `<physics_check>` 节，要求模型先做量纲验证再生成代码，量纲错误则阻断生成
   - **第2层（代码层）**：新增 `physics-answer-validator` 模块，对每道挑战题的数值答案做精确计算验证（如多普勒公式、薄透镜公式等），误差超1%则标记审查
   - **第3层（产品层）**：实验页右上角加"Report an error"按钮，3份以上错误报告自动触发通知；真实AP学生比外部审核更快发现问题
   - 工作量：第1层0.5天，第2层1天，第3层0.5天，合计2天
