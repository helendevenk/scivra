---
name: upg-batch-generation-pipeline
status: backlog
created: 2026-03-22T10:06:49Z
updated: 2026-03-22T10:06:49Z
---

# UPG 批量生成管线 — 对标 PhET 66 个物理模拟

## 现状与目标

**PhET 物理基线**：66 个模拟
**NeonPhysics 当前覆盖**：5 完全 + 12 部分 = 26%
**目标**：100% 覆盖，质量不低于 PhET，视觉超越

**工作量**：
- 49 个全新生成
- 12 个部分覆盖升级（需要更完整的交互和物理模型）
- 合计 **61 个生成任务**

## 架构设计

### 管线流程

```
[Prompt 模板库]
      ↓
[批量生成脚本] → callOpenRouter() → sanitizeHtml() → checkQuality()
      ↓                                                    ↓
  通过 → [写入 DB + 存 HTML 文件]              失败 → [记录 + 自动重试(max 3)]
      ↓                                                    ↓
[自动化质量评审]                              3次失败 → [人工标记]
      ↓
  通过 → [注册到 registry + html-map]
      ↓
  失败 → [人工审核队列]
```

### 核心设计决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 执行环境 | CLI 脚本（tsx 直接运行） | 绕过 API 层的 auth/限流/积分 |
| 调用方式 | 直接调 `callAnthropic()` | 复用现有 Anthropic 客户端（`anthropic-client.ts`），读取 `ANTHROPIC_API_KEY` + `ANTHROPIC_BASE_URL` 环境变量 |
| Prompt 策略 | 结构化模板（比用户 prompt 详细10倍） | 指定物理参数、公式、交互要求 |
| 并发控制 | 串行生成，每个间隔 5s | 避免 OpenRouter rate limit |
| 质量门控 | 自动检查 + 浏览器截图 + 人工审核 | 三层保障 |
| 存储 | 直接写 `public/experiments/` HTML 文件 | 与现有 Wave 2-7 一致 |
| 模型 | claude-sonnet-4-6（主）| 与现有 UPG 一致 |

## Prompt 模板设计

### 结构化 Prompt（比通用 `buildUserPrompt` 精确得多）

```typescript
interface BatchPromptConfig {
  // 基础信息
  phetId: string;           // PhET 原始名称（对照用）
  neonId: string;           // NeonPhysics 实验 ID
  title: string;            // 显示标题
  category: string;         // 主题分类

  // 物理规格
  concepts: string[];       // 核心概念（如 ["Newton's Second Law", "friction force"]）
  equations: string[];      // 必须展示的公式（KaTeX 格式）
  variables: SliderConfig[];// 必须的滑块参数

  // 交互规格
  visualElements: string[]; // 必须包含的视觉元素（如 ["force arrows", "trajectory trail"]）
  scenarios: string[];      // 预设场景（Reset 后的不同初始状态）

  // 质量基线
  phetBenchmark: string;    // PhET 对应模拟的核心能力描述
  mustExceed: string[];     // 必须超越 PhET 的方面

  // AP 对齐
  apStandards?: string[];   // AP Physics 标准代码
  gradeLevel: string;       // 适用年级
}

interface SliderConfig {
  name: string;             // 参数名
  label: string;            // 显示标签
  unit: string;             // 单位
  min: number;
  max: number;
  default: number;
  step: number;
}
```

### Prompt 构建函数

```typescript
function buildBatchPrompt(config: BatchPromptConfig, language: 'en' | 'zh'): string {
  return `Create an interactive 3D physics simulation: "${config.title}"

## PHYSICS SPECIFICATION
This simulation must demonstrate: ${config.concepts.join(', ')}

### Required Equations (render with KaTeX)
${config.equations.map(eq => `- ${eq}`).join('\n')}

### Required Interactive Parameters
${config.variables.map(v =>
  `- ${v.label} (${v.name}): ${v.min}–${v.max} ${v.unit}, default ${v.default}, step ${v.step}`
).join('\n')}

### Required Visual Elements
${config.visualElements.map(v => `- ${v}`).join('\n')}

### Preset Scenarios (for "Random Experiment" button)
${config.scenarios.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## QUALITY BENCHMARK
PhET equivalent: "${config.phetBenchmark}"
Your simulation MUST:
${config.mustExceed.map(m => `- ${m}`).join('\n')}

## AP STANDARDS ALIGNMENT
${config.apStandards?.join(', ') || 'General physics education'}
Grade level: ${config.gradeLevel}

${language === 'zh' ? '所有文本内容使用中文。' : 'All text content in English.'}

Output the complete HTML file now.`;
}
```

## 实验清单与 Prompt 配置（P0 优先）

### P0 运动与力 — 缺失 6 个

#### 1. Forces and Motion: Basics（力与运动基础）
```yaml
neonId: forces-motion-basics
concepts: ["Newton's First Law", "Newton's Second Law", "net force", "friction"]
equations: ["F_{net} = ma", "f = \\mu N", "a = \\frac{F_{net}}{m}"]
variables:
  - { name: appliedForce, label: Applied Force, unit: N, min: 0, max: 500, default: 100, step: 10 }
  - { name: mass, label: Mass, unit: kg, min: 1, max: 200, default: 50, step: 5 }
  - { name: friction, label: Friction Coefficient, unit: "", min: 0, max: 1, default: 0.3, step: 0.05 }
visualElements: ["Person pushing box", "Force arrows (applied, friction, normal, gravity)", "Motion vectors", "Velocity-time graph overlay"]
scenarios: ["Frictionless ice", "Rough sandpaper", "Tug of war (two forces)"]
phetBenchmark: "Apply force to objects, see acceleration, understand F=ma with friction"
mustExceed: ["3D perspective vs PhET's 2D", "Real-time force diagram update", "Multiple simultaneous force arrows with magnitude labels"]
apStandards: ["3.A.1", "3.B.1"]
```

#### 2. Friction（摩擦力）
```yaml
neonId: friction-lab
concepts: ["Static friction", "kinetic friction", "normal force", "friction coefficient"]
equations: ["f_s \\leq \\mu_s N", "f_k = \\mu_k N", "N = mg\\cos\\theta"]
variables:
  - { name: mass, label: Mass, unit: kg, min: 1, max: 100, default: 10, step: 1 }
  - { name: angle, label: Surface Angle, unit: °, min: 0, max: 60, default: 0, step: 1 }
  - { name: muStatic, label: μₛ (static), unit: "", min: 0.1, max: 1.5, default: 0.5, step: 0.05 }
  - { name: muKinetic, label: μₖ (kinetic), unit: "", min: 0.05, max: 1.0, default: 0.3, step: 0.05 }
visualElements: ["Block on inclined plane", "Normal force arrow (perpendicular)", "Friction force arrow", "Weight decomposition", "Friction vs applied force graph"]
scenarios: ["Flat surface + push", "Inclined plane (find critical angle)", "Ice vs rubber vs sandpaper"]
phetBenchmark: "Explore static and kinetic friction on flat and inclined surfaces"
mustExceed: ["3D tilting plane", "Real-time friction graph (static→kinetic transition)", "Material selector with visual texture change"]
```

#### 3. Gravity and Orbits（万有引力与轨道）
```yaml
neonId: gravity-orbits
concepts: ["Universal gravitation", "orbital velocity", "escape velocity", "Kepler's laws"]
equations: ["F = G\\frac{m_1 m_2}{r^2}", "v_{orbit} = \\sqrt{\\frac{GM}{r}}", "T^2 = \\frac{4\\pi^2}{GM}r^3"]
variables:
  - { name: starMass, label: Star Mass, unit: M☉, min: 0.1, max: 10, default: 1, step: 0.1 }
  - { name: planetMass, label: Planet Mass, unit: M⊕, min: 0.1, max: 100, default: 1, step: 0.5 }
  - { name: orbitalRadius, label: Orbital Radius, unit: AU, min: 0.2, max: 5, default: 1, step: 0.1 }
  - { name: initialVelocity, label: Initial Velocity, unit: km/s, min: 0, max: 50, default: 29.8, step: 0.5 }
visualElements: ["Central star (glowing)", "Orbiting planet with trail", "Gravitational field lines", "Velocity and acceleration vectors", "Orbit path prediction (dotted)"]
scenarios: ["Earth-Sun (circular)", "Comet (highly elliptical)", "Binary stars", "Escape trajectory"]
phetBenchmark: "Observe orbital paths with adjustable mass and velocity"
mustExceed: ["Full 3D orbit visualization", "Trail color gradient showing speed", "Kepler sweep area visualization"]
apStandards: ["3.C.1", "3.C.2"]
```

#### 4. Pendulum Lab（单摆）
```yaml
neonId: pendulum-lab
concepts: ["Simple harmonic motion", "period", "restoring force", "energy conservation in pendulum"]
equations: ["T = 2\\pi\\sqrt{\\frac{L}{g}}", "\\theta(t) = \\theta_0 \\cos(\\omega t)", "E = mgh = \\frac{1}{2}mv^2"]
variables:
  - { name: length, label: String Length, unit: m, min: 0.1, max: 3, default: 1, step: 0.05 }
  - { name: mass, label: Bob Mass, unit: kg, min: 0.1, max: 5, default: 1, step: 0.1 }
  - { name: gravity, label: Gravity, unit: m/s², min: 1, max: 20, default: 9.8, step: 0.1 }
  - { name: angle0, label: Initial Angle, unit: °, min: 5, max: 90, default: 30, step: 1 }
visualElements: ["3D pendulum bob on string", "Angle arc indicator", "Velocity vector at bob", "Energy bar chart (KE/PE/Total)", "Period measurement display"]
scenarios: ["Earth (g=9.8)", "Moon (g=1.6)", "Jupiter (g=24.8)", "Large angle (non-linear regime)"]
phetBenchmark: "Adjust length, mass, gravity; measure period; observe energy transfer"
mustExceed: ["3D swing visualization", "Side-by-side energy bar chart", "Multiple pendulums comparison mode"]
```

#### 5. Masses and Springs（质量弹簧系统）
```yaml
neonId: masses-springs
concepts: ["Hooke's law", "spring constant", "SHM", "natural frequency", "damping"]
equations: ["F = -kx", "T = 2\\pi\\sqrt{\\frac{m}{k}}", "x(t) = A\\cos(\\omega t + \\phi)", "\\omega = \\sqrt{\\frac{k}{m}}"]
variables:
  - { name: springK, label: Spring Constant, unit: N/m, min: 10, max: 500, default: 100, step: 10 }
  - { name: mass, label: Hanging Mass, unit: kg, min: 0.1, max: 10, default: 1, step: 0.1 }
  - { name: damping, label: Damping, unit: "", min: 0, max: 1, default: 0, step: 0.05 }
  - { name: displacement, label: Initial Displacement, unit: m, min: 0.01, max: 0.5, default: 0.1, step: 0.01 }
visualElements: ["3D coiled spring (deformable)", "Hanging mass block", "Equilibrium line", "Displacement-time graph", "Force arrows (spring + gravity)", "Energy bars (KE/PE-spring/PE-gravity)"]
scenarios: ["Soft spring + heavy mass", "Stiff spring + light mass", "Critical damping", "No damping (perpetual)"]
phetBenchmark: "Hang masses from springs, observe oscillation, measure period"
mustExceed: ["Realistic 3D coil deformation", "Damping visualization", "Dual spring comparison"]
```

#### 6. Hooke's Law（胡克定律）
```yaml
neonId: hookes-law
concepts: ["Hooke's law", "elastic limit", "spring constant", "restoring force"]
equations: ["F = kx", "PE = \\frac{1}{2}kx^2", "k = \\frac{F}{x}"]
variables:
  - { name: springK, label: Spring Constant, unit: N/m, min: 10, max: 1000, default: 200, step: 10 }
  - { name: appliedForce, label: Applied Force, unit: N, min: 0, max: 200, default: 50, step: 5 }
visualElements: ["Spring with ruler overlay", "Force vs displacement graph (real-time)", "Elastic limit marker", "PE energy bar", "Spring compression/extension animation"]
scenarios: ["Soft spring (k=50)", "Stiff spring (k=500)", "Beyond elastic limit"]
phetBenchmark: "Stretch and compress springs, see force-displacement relationship"
mustExceed: ["3D spring with realistic coil physics", "F-x graph drawn in real-time as you drag", "Material comparison (rubber/steel/copper)"]
```

### P0 波 — 缺失 2 个

#### 7. Wave on a String（弦上的波）
```yaml
neonId: wave-on-string
concepts: ["Transverse wave", "amplitude", "frequency", "wavelength", "wave speed", "standing waves", "reflection"]
equations: ["v = f\\lambda", "v = \\sqrt{\\frac{T}{\\mu}}", "f_n = \\frac{nv}{2L}"]
variables:
  - { name: frequency, label: Frequency, unit: Hz, min: 0.5, max: 5, default: 1.5, step: 0.1 }
  - { name: amplitude, label: Amplitude, unit: cm, min: 0.5, max: 5, default: 2, step: 0.25 }
  - { name: tension, label: Tension, unit: N, min: 1, max: 20, default: 5, step: 0.5 }
  - { name: damping, label: Damping, unit: "", min: 0, max: 1, default: 0.1, step: 0.05 }
visualElements: ["3D string with wave propagation", "Fixed/loose end toggle", "Standing wave nodes highlighted", "Wavelength/amplitude measurement overlay"]
scenarios: ["Fixed both ends (standing waves)", "One end free (reflection inversion)", "Pulse mode (single pulse)"]
phetBenchmark: "Generate waves on a string, observe reflection, create standing waves"
mustExceed: ["3D rope visualization", "Node/antinode glow markers", "Slow-motion replay"]
```

#### 8. Waves Intro（波动入门）
```yaml
neonId: waves-intro
concepts: ["Transverse vs longitudinal waves", "wave properties", "medium", "energy transfer"]
equations: ["v = f\\lambda", "T = \\frac{1}{f}"]
variables:
  - { name: waveType, label: Wave Type, unit: "", min: 0, max: 1, default: 0, step: 1 }
  - { name: frequency, label: Frequency, unit: Hz, min: 0.5, max: 5, default: 1, step: 0.1 }
  - { name: amplitude, label: Amplitude, unit: cm, min: 1, max: 10, default: 5, step: 0.5 }
visualElements: ["Particle chain (transverse mode)", "Particle chain (longitudinal mode)", "Wave front propagation", "Individual particle motion highlight"]
scenarios: ["Transverse wave in rope", "Longitudinal wave (sound in air)", "Water wave (combo)"]
phetBenchmark: "Compare transverse and longitudinal waves, observe particle motion"
mustExceed: ["3D particle visualization", "Side-by-side transverse vs longitudinal", "Energy flow arrows"]
```

### P0 电磁 — 缺失 4 个

#### 9. Circuit Construction Kit: AC（交流电路）
```yaml
neonId: ac-circuits
concepts: ["AC voltage", "RLC circuits", "impedance", "resonance", "phasors"]
equations: ["V(t) = V_0\\sin(\\omega t)", "Z = \\sqrt{R^2 + (X_L - X_C)^2}", "f_0 = \\frac{1}{2\\pi\\sqrt{LC}}"]
variables:
  - { name: voltage, label: AC Voltage, unit: V, min: 1, max: 240, default: 120, step: 1 }
  - { name: frequency, label: Frequency, unit: Hz, min: 10, max: 1000, default: 60, step: 5 }
  - { name: resistance, label: Resistance, unit: Ω, min: 1, max: 1000, default: 100, step: 10 }
  - { name: capacitance, label: Capacitance, unit: μF, min: 1, max: 1000, default: 100, step: 10 }
visualElements: ["Circuit schematic (R-L-C)", "V-t and I-t waveforms", "Phasor diagram", "Impedance triangle", "Brightness of bulb indicator"]
scenarios: ["Pure resistive", "RC circuit", "RL circuit", "RLC resonance"]
phetBenchmark: "Build AC circuits with R, L, C components, observe phase relationships"
mustExceed: ["Animated phasor rotation", "Real-time impedance triangle", "Resonance sweep visualization"]
```

#### 10. Ohm's Law（欧姆定律）
```yaml
neonId: ohms-law
concepts: ["Ohm's law", "voltage", "current", "resistance"]
equations: ["V = IR", "P = IV = I^2R = \\frac{V^2}{R}"]
variables:
  - { name: voltage, label: Voltage, unit: V, min: 0, max: 24, default: 9, step: 0.5 }
  - { name: resistance, label: Resistance, unit: Ω, min: 1, max: 100, default: 10, step: 1 }
visualElements: ["Battery + resistor circuit", "Ammeter display", "Voltmeter display", "V-I graph", "Electron flow animation", "Power dissipation glow"]
scenarios: ["Low resistance wire", "High resistance (dim bulb)", "Variable voltage sweep"]
phetBenchmark: "Adjust voltage and resistance, see current change, understand V=IR"
mustExceed: ["3D electron flow visualization", "Real-time V-I graph", "Power heatmap on resistor"]
```

#### 11. Coulomb's Law（库仑定律）
```yaml
neonId: coulombs-law
concepts: ["Electric charge", "Coulomb's law", "electric force", "inverse square law"]
equations: ["F = k\\frac{q_1 q_2}{r^2}", "k = 8.99 \\times 10^9 \\text{ N·m²/C²}"]
variables:
  - { name: charge1, label: Charge 1, unit: μC, min: -10, max: 10, default: 5, step: 0.5 }
  - { name: charge2, label: Charge 2, unit: μC, min: -10, max: 10, default: -3, step: 0.5 }
  - { name: distance, label: Distance, unit: cm, min: 1, max: 30, default: 10, step: 0.5 }
visualElements: ["Two charged spheres (color = sign)", "Force arrows on each charge", "Field lines between charges", "Force vs distance graph", "Inverse square falloff visualization"]
scenarios: ["Like charges (repulsion)", "Unlike charges (attraction)", "Distance sweep"]
phetBenchmark: "Move charges, observe force direction and magnitude"
mustExceed: ["3D charge spheres with glow", "Dynamic field lines", "Force magnitude comparison bar"]
```

#### 12. Resistance in a Wire（导线电阻）
```yaml
neonId: resistance-wire
concepts: ["Resistivity", "resistance factors", "cross-sectional area", "length effect"]
equations: ["R = \\rho\\frac{L}{A}", "A = \\pi r^2"]
variables:
  - { name: length, label: Wire Length, unit: cm, min: 1, max: 50, default: 10, step: 1 }
  - { name: radius, label: Wire Radius, unit: mm, min: 0.1, max: 5, default: 1, step: 0.1 }
  - { name: resistivity, label: Resistivity, unit: "Ω·m", min: 0, max: 1, default: 0.1, step: 0.01 }
visualElements: ["3D wire with adjustable dimensions", "Cross-section view", "Electron density visualization", "R value display", "Material comparison panel"]
scenarios: ["Copper wire", "Nichrome wire", "Long thin vs short thick"]
phetBenchmark: "Adjust length, area, resistivity to see resistance change"
mustExceed: ["3D wire with visible deformation", "Electron flow speed visualization", "Material library selector"]
```

### P0 热力学 — 缺失 2 个

#### 13. Density（密度）
```yaml
neonId: density-lab
concepts: ["Density", "mass", "volume", "buoyancy", "floating/sinking"]
equations: ["\\rho = \\frac{m}{V}", "F_b = \\rho_{fluid} V_{submerged} g"]
variables:
  - { name: objectMass, label: Object Mass, unit: kg, min: 0.1, max: 20, default: 1, step: 0.1 }
  - { name: objectVolume, label: Object Volume, unit: L, min: 0.1, max: 10, default: 1, step: 0.1 }
  - { name: fluidDensity, label: Fluid Density, unit: kg/L, min: 0.5, max: 13.6, default: 1, step: 0.1 }
visualElements: ["3D object in fluid tank", "Density comparison bar", "Water level rise", "Float/sink animation", "Mass vs volume scatter plot"]
scenarios: ["Wood in water (floats)", "Steel in water (sinks)", "Ice in water (barely floats)", "Gold in mercury (floats!)"]
phetBenchmark: "Compare densities, observe floating and sinking"
mustExceed: ["3D fluid tank with transparency", "Multiple objects simultaneously", "Density scale visualization"]
```

#### 14. Under Pressure（压强）
```yaml
neonId: pressure-lab
concepts: ["Pressure", "fluid pressure", "depth dependence", "Pascal's law", "atmospheric pressure"]
equations: ["P = \\frac{F}{A}", "P = P_0 + \\rho g h", "P_1 = P_2 \\text{ (Pascal's law)}"]
variables:
  - { name: fluidDensity, label: Fluid Density, unit: kg/m³, min: 500, max: 13600, default: 1000, step: 100 }
  - { name: depth, label: Depth, unit: m, min: 0, max: 100, default: 10, step: 1 }
  - { name: gravity, label: Gravity, unit: m/s², min: 1, max: 25, default: 9.8, step: 0.1 }
visualElements: ["Fluid column with depth markers", "Pressure gauge at adjustable depth", "Color gradient (pressure heatmap)", "Pressure vs depth graph"]
scenarios: ["Swimming pool", "Ocean deep dive", "Hydraulic press (Pascal's law)", "Atmosphere layers"]
phetBenchmark: "Explore pressure at different depths and with different fluids"
mustExceed: ["3D fluid column with transparency", "Pressure color gradient", "Interactive depth probe"]
```

### P0 部分覆盖升级（7 个）

| 现有实验 | PhET 对标 | 升级要求 |
|---------|----------|---------|
| gravitational-fields | Gravity Force Lab | 增加双物体交互拖拽 + 力大小数值显示 |
| roller-coaster | Energy Skate Park | 增加能量条形图(KE/PE/Thermal) + 摩擦选项 |
| k5-energy-conversion | Energy Forms | 增加能量类型标注 + 转换效率显示 |
| momentum-collisions | Collision Lab | 增加2D碰撞 + 弹性/非弹性切换 + 动量守恒图 |
| k5-sound-waves | Sound Waves | 增加频率谱 + 多普勒效应 + 3D 波前 |
| electromagnetic-induction | Faraday's Law | 增加磁通量图 + 感应电动势实时曲线 |
| capacitors-rc-circuits | Capacitor Lab | 增加电荷堆积动画 + 电容并联串联 |

## 批量生成脚本设计

### 文件结构

```
scripts/
  batch-generate/
    index.ts              — 主入口（CLI）
    prompt-configs/
      p0-motion.ts        — P0 运动与力（6个）
      p0-waves.ts         — P0 波（2个）
      p0-electro.ts       — P0 电磁（4个）
      p0-thermo.ts        — P0 热力学（2个）
      p0-upgrades.ts      — P0 部分覆盖升级（7个）
      p1-all.ts           — P1 全部（29个）
      p2-all.ts           — P2 全部（10个）
    review/
      auto-review.ts      — 自动化质量检查（扩展版）
      screenshot.ts       — 无头浏览器截图
      report.ts           — 生成审核报告
    utils/
      retry.ts            — 重试逻辑
      register.ts         — 注册到 registry + html-map
```

### CLI 用法

```bash
# 生成单个实验
pnpm tsx scripts/batch-generate/index.ts --id friction-lab --lang en

# 生成 P0 全部
pnpm tsx scripts/batch-generate/index.ts --tier p0 --lang en

# 生成 P0 + 自动截图审核
pnpm tsx scripts/batch-generate/index.ts --tier p0 --lang en --screenshot

# 重新生成失败的
pnpm tsx scripts/batch-generate/index.ts --retry-failed

# 生成审核报告
pnpm tsx scripts/batch-generate/index.ts --report
```

### 主脚本逻辑

```typescript
// scripts/batch-generate/index.ts（伪代码）
async function main() {
  const configs = loadPromptConfigs(args.tier);
  const results: GenerationResult[] = [];

  for (const config of configs) {
    console.log(`[${configs.indexOf(config) + 1}/${configs.length}] Generating: ${config.neonId}`);

    let attempt = 0;
    let success = false;

    while (attempt < MAX_RETRIES && !success) {
      attempt++;
      try {
        // 1. 构建 prompt
        const prompt = buildBatchPrompt(config, args.lang);

        // 2. 调用 Anthropic API（直接用 callAnthropic，读环境变量 ANTHROPIC_API_KEY）
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

        const aiResult = await callAnthropic(apiKey, {
          model: 'claude-sonnet-4-6',   // 直接用 Claude Sonnet
          systemPrompt: getSystemPrompt(),
          userPrompt: prompt,
          maxTokens: 16000,
          temperature: attempt === 1 ? 0.7 : 0.8, // 重试时提高随机性
          // baseUrl 读取 ANTHROPIC_BASE_URL 环境变量，默认 https://api.anthropic.com
        });

        // 3. 后处理
        let html = sanitizeHtml(aiResult.html).sanitized;
        html = injectPerformanceCode(html);
        html = injectMobileOptimization(html);
        html = injectPerformanceUI(html);

        // 4. 质量检查
        const quality = checkQuality(html);
        if (!quality.passed) {
          throw new Error(`Quality failed: ${quality.issues.join('; ')}`);
        }

        // 5. 扩展质量检查（物理特定）
        const physicsCheck = checkPhysicsQuality(html, config);
        if (!physicsCheck.passed) {
          throw new Error(`Physics check failed: ${physicsCheck.issues.join('; ')}`);
        }

        // 6. 写入文件
        const outputPath = `public/experiments/ap-physics/${config.neonId}.html`;
        await writeFile(outputPath, html);

        // 7. 记录结果
        results.push({
          id: config.neonId,
          status: 'success',
          attempt,
          tokens: aiResult.inputTokens + aiResult.outputTokens,
          size: new TextEncoder().encode(html).length,
        });
        success = true;

      } catch (err) {
        console.error(`  Attempt ${attempt} failed: ${err.message}`);
        if (attempt < MAX_RETRIES) {
          await sleep(10000); // 重试前等 10s
        }
      }
    }

    if (!success) {
      results.push({ id: config.neonId, status: 'failed', attempt: MAX_RETRIES });
    }

    // 间隔 5s 避免 rate limit
    await sleep(5000);
  }

  // 生成报告
  generateReport(results);
}
```

### 物理特定质量检查（扩展）

```typescript
function checkPhysicsQuality(html: string, config: BatchPromptConfig): QualityResult {
  const issues: string[] = [];

  // 1. 检查必须的公式是否存在
  for (const eq of config.equations) {
    const keyTerm = eq.split('=')[0].replace(/\\/g, '').trim();
    if (!html.includes(keyTerm) && !html.toLowerCase().includes(keyTerm.toLowerCase())) {
      issues.push(`Missing equation term: ${keyTerm}`);
    }
  }

  // 2. 检查必须的滑块参数
  for (const v of config.variables) {
    if (!html.includes(v.name) && !html.includes(v.label)) {
      issues.push(`Missing slider for: ${v.label}`);
    }
  }

  // 3. 检查滑块数量 >= 3
  const sliderCount = (html.match(/type\s*=\s*["']range["']/gi) || []).length;
  if (sliderCount < 3) {
    issues.push(`Only ${sliderCount} sliders (minimum 3 required)`);
  }

  return { passed: issues.length === 0, issues, warnings: [] };
}
```

## 执行计划

### 第一批（P0 核心 14 + 7 升级 = 21 个）

| 周 | 任务 | 产出 |
|----|------|------|
| W1 D1-2 | 编写批量生成脚本 + 14个P0 prompt配置 | 脚本可运行 |
| W1 D3-5 | 运行 P0 生成（14个新 + 7个升级） | 21个HTML初稿 |
| W2 D1-3 | 人工审核 + 质量不合格的重新生成 | 审核报告 |
| W2 D4-5 | 注册到 registry + html-map + 更新实验数据 | 实验可访问 |

### 第二批（P1 补充 23 个）

| 周 | 任务 | 产出 |
|----|------|------|
| W3 D1-2 | 编写 23个 P1 prompt配置 | 配置完成 |
| W3 D3-5 | 运行 P1 生成 | 23个HTML初稿 |
| W4 D1-3 | 人工审核 + 重新生成 | 审核通过 |
| W4 D4-5 | 注册 + 数据更新 | 实验可访问 |

### 第三批（P2 锦上添花 10 个 + P1 剩余 6 个）

| 周 | 任务 | 产出 |
|----|------|------|
| W5 D1-3 | P2 prompt配置 + 生成 | 16个HTML初稿 |
| W5 D4-5 | 审核 + 注册 | 全部完成 |

### 总计

- **脚本开发**：2天
- **Prompt 配置编写**：4天（61个配置）
- **AI 生成运行**：~5天（61次生成 × 1-3次重试 × ~2min/次 ≈ 6-10小时实际生成时间，加上间隔和审核）
- **人工审核**：6天
- **注册集成**：3天
- **总计**：~20天 / 4周

### 成本估算

- 每次生成：~4000 input tokens + ~12000 output tokens ≈ 16K tokens
- 61个实验 × 平均1.5次尝试 ≈ 92次调用
- Claude Sonnet 4.6 直连 Anthropic API：$3/M input + $15/M output
- 总成本：92 × (4K×$0.003 + 12K×$0.015) ≈ 92 × $0.192 ≈ **$17.7**
- 加上重试和升级：**预算 $30-50**

## 质量保证流程

### 三层门控

```
Layer 1: 自动检查（checkQuality + checkPhysicsQuality）
  → 通过率预估 60-70%（首次）
  → 失败自动重试（最多3次）

Layer 2: 无头浏览器截图
  → Playwright 加载 HTML，等 5s，截图
  → 人工肉眼检查截图（批量预览页面）

Layer 3: 人工交互测试
  → 打开 HTML，拖滑块，检查物理响应
  → 对比 PhET 原版，确认覆盖度
  → 标记：✅通过 / 🟡需调整 / ❌重新生成
```

### 审核报告格式

```markdown
# Batch Generation Report — P0

Generated: 2026-03-XX
Total: 21 | Passed: 15 | Needs Fix: 4 | Failed: 2

| ID | PhET对标 | 尝试次数 | 自动检查 | 截图 | 人工 | 状态 |
|----|---------|---------|---------|------|------|------|
| friction-lab | Friction | 1 | ✅ | ✅ | ✅ | DONE |
| gravity-orbits | Gravity and Orbits | 2 | ✅ | ✅ | 🟡 轨道颜色需调整 | FIX |
```

## 下一步

- [ ] 确认方案后开始编写批量生成脚本
- [ ] 先做 1 个 PoC（friction-lab），验证 prompt 质量和管线通畅
- [ ] PoC 通过后铺开 P0 全部 21 个
