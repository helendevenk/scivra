---
title: UPG 3D 生成质量增强方案 v2
date: 2026-03-17
status: 待确认
priority: P0
---

# UPG 3D 生成质量增强方案 v2

> 基于 17 个 3D Skill 深度分析 + AetherViz 对标 + 全部 Skill 源码精读

## 一、根因与对标

### 1.1 你的 system-prompt.ts（72 行）vs AetherViz SKILL.md（392 行）

| 维度 | 你的（72 行） | AetherViz（392 行） | 差距 |
|------|-------------|---------------------|------|
| 配色 | 7 个 hex 单色 | 60+ CSS 变量，渐变体系，玻璃拟态精确参数 | 10x |
| 布局 | "~60% viewport" | 左栏 30%+主区 70%，导航/侧栏/控制面板/测验 5 区精确定义 | 无结构 vs 完整蓝图 |
| Three.js | "meaningful 3D, proper lighting" | ArrowHelper 颜色映射/Points 粒子/轨迹线缓冲区/Raycaster 交互/Sprite 标签 | 只说"做好" vs 给代码 |
| 混合渲染 | 无 | SVG+Three.js 双层 + 自动检测逻辑 + 坐标同步 | 缺失整个维度 |
| 交互 | "3+ sliders" | 播放/暂停/单步/速度/重置/随机实验/可折叠测验 | 粗糙 |
| 防错 | 安全约束（不调 eval） | 无 | 你有优势 |
| 性能 | 设备自适应 + FPS | 无 | 你有优势 |

### 1.2 黑洞页面 3D 全黑的直接原因

AI 在没有代码模板参考的情况下自由发挥"引力透镜弯曲光线"，生成的 Three.js 代码有初始化 bug → Canvas 全黑，FPS `--`。

## 二、信息来源：17 个 Skill 精确映射

按 3D-skills-deep-analysis.md 的 S/A/B/C 评级，标注每个 Skill 对 UPG system prompt 的贡献：

### S 级（立即可用，核心注入）

| Skill | 评分 | 独占内容 | 注入到 system prompt 的什么 |
|-------|------|---------|--------------------------|
| **3d-graphics** | 9.5 | 后处理(Bloom/SSAO/DOF 241行)、物理引擎、VR/AR、WebGPU、节点材质、特殊加载器 | 后处理模板(Bloom参数)、灯光策略(三点光照)、LOD/Instancing 性能模式 |
| **threejs-3d-graphics** | 9.3 | ThreeScene 类、context loss 恢复、内存泄漏防护、z-fighting 修复、移动端 shader 精度 | **防黑屏核心**：try-catch 包裹、resize 监听、dispose 清理、context loss 事件、DPR 限制 |
| **threejs-shaders** | 9.0 | Fresnel/噪声/溶解/边缘光 GLSL、shader chunk 注入点、性能反模式(if→mix/step) | Fresnel 边缘光模板(能量球)、波动位移 shader(波函数)、噪声溶解(化学反应) |
| **threejs-interaction** | 9.0 | 7 种控制器对比、Raycaster 完整管线、框选、拖拽、坐标转换 | OrbitControls 精确参数、Raycaster 点击高亮模式、世界↔屏幕坐标转换 |

### A 级（高质量补充）

| Skill | 评分 | 独占内容 | 注入点 |
|-------|------|---------|--------|
| **threejs-animation** | 8.5 | 弹簧物理类、阻尼算法、振荡模式(正弦/弹跳/圆形/8字形) | 物理模拟：Spring 类模板、Clock.getDelta() 帧率无关动画 |
| **threejs-geometry** | 8.5 | InterleavedBuffer、EdgesGeometry vs WireframeGeometry | BufferGeometry 粒子系统标准、InstancedMesh 模板、morphTargets |
| **threejs-materials** | 8.5 | 材质选择决策树、MeshPhysicalMaterial 全参数(clearcoat/transmission/sheen/iridescence) | **材质选择决策树**（金属→Standard/玻璃→Physical/发光→emissive）、环境贴图(RoomEnvironment) |
| **threejs-webgl** | 8.3 | optimization_checklist(365行)、materials_guide(474行) | 性能检查清单、材质指南补充 |
| **webgl-expert** | 8.3 | 100+ WebGL 常量、扩展兼容性矩阵、draw call 预算 | 性能基准值（draw call <100 目标移动端 60fps、纹理尺寸限制） |
| **threejs-fundamentals** | 8.0 | 坐标系、Object3D 层级、数学工具 | 响应式 Canvas 标准模板 |
| **threejs-builder** | 8.0 | 游戏模式(动画状态机/慢动作/对象池)、GLTF 6 种加载模式 | 对象池模式（高频创建/销毁场景） |

### B 级（特定场景补充）

| Skill | 评分 | 是否注入 | 原因 |
|-------|------|---------|------|
| **3d-visualizer** | 7.5 | 部分 | R3F 导向，但产品配置器模式可参考 |
| **3d-web-experience** | 6.5 | 否 | 太薄，决策树已被 AetherViz 覆盖 |
| **webgl** | 6.5 | 否 | JARVIS 特化，通用性有限 |

### C 级（不适用）

| Skill | 原因 |
|-------|------|
| **3d-modeling** | 离线 Blender/Maya，与 UPG 无关 |
| **spline-interactive/spline-3d-integration** | GUI 设计工具，UPG 是代码生成 |

## 三、覆盖空白分析（来自 3D-skills-deep-analysis.md 第 4.3 节）

分析文档标注的完全缺失项，及对 UPG 的影响：

| 缺失项 | 对 UPG 的影响 | 解决方案 |
|--------|-------------|---------|
| ❌ 粒子系统专精（GPU 粒子） | 高——UPG 生成的物理效果大量需要粒子 | 从 3d-graphics + threejs-geometry 组合提取 Points+BufferGeometry 模板 |
| ❌ 音频可视化 | 低——UPG 当前不需要 | 暂不处理 |
| ❌ glTF 工具链 | 无——UPG 不加载模型 | 不需要 |
| ❌ 3D 文字排版 | 中——公式标注需要 | 用 DOM overlay 或 SVG 替代 3D 文字 |
| ⚠️ 后处理只有基础 | 中——Bloom 对发光效果很重要 | 注入 Bloom 标准参数（strength 1.5, radius 0.4, threshold 0.85） |

## 四、改造方案（精确到代码行）

### 4.1 文件结构

```
src/shared/lib/upg/
  system-prompt.ts              ← 重写（主组装文件，~100 行）
  prompt-modules/
    visual-design.ts            ← 新建（配色+布局，~80 行）
    threejs-core.ts             ← 新建（场景/灯光/材质/防错，~150 行）— 核心
    threejs-effects.ts          ← 新建（粒子/轨迹/shader/矢量，~100 行）
    svg-hybrid.ts               ← 新建（SVG 混合渲染+自动识别，~60 行）
    interaction.ts              ← 新建（交互+动画规范，~50 行）
  quality-checker.ts            ← 修改（增加 Three.js 初始化检测）
```

### 4.2 模块详细设计

#### 模块 A：threejs-core.ts（防黑屏的核心）

来源：`threejs-3d-graphics`（S 级 9.3）+ `3d-graphics`（S 级 9.5）+ `threejs-fundamentals`（A 级 8.0）

```
注入内容：

1. 场景初始化标准模板（来自 threejs-3d-graphics ThreeScene 类）
   - PerspectiveCamera(60, w/h, 0.1, 1000)
   - WebGLRenderer({ antialias:true, powerPreference:'high-performance' })
   - setPixelRatio(Math.min(devicePixelRatio, 2))  ← 防止高 DPR 爆显存
   - outputColorSpace = THREE.SRGBColorSpace      ← 正确颜色空间
   - toneMapping = THREE.ACESFilmicToneMapping     ← HDR 感

2. 三点光照系统（来自 3d-graphics/04-lights.md）
   - keyLight: DirectionalLight(0xffffff, 1.0) position(5,10,7) castShadow
   - fillLight: DirectionalLight(0xffffff, 0.4) position(-5,5,-5)
   - backLight: DirectionalLight(0xffffff, 0.3) position(0,5,-10)
   - ambientLight: AmbientLight(0xffffff, 0.3)
   - HemisphereLight 用于天文/室外场景

3. 材质选择决策树（来自 threejs-materials S 级）
   金属(导体/电路) → MeshStandardMaterial { metalness:0.8, roughness:0.2 }
   玻璃/透明(光学) → MeshPhysicalMaterial { transmission:1, ior:1.5 }
   发光体(星/能量) → MeshStandardMaterial { emissive:color, emissiveIntensity:2 }
   粒子/气体 → PointsMaterial { blending:AdditiveBlending, depthWrite:false }
   一般物体 → MeshStandardMaterial { roughness:0.5, metalness:0 }

4. 防黑屏五道防线（来自 threejs-3d-graphics sharp_edges.md）
   ① 所有 Three.js 代码包在 try-catch，catch 中显示降级文字提示
   ② 必须有 window resize 监听 → camera.aspect + renderer.setSize
   ③ WebGL context loss 事件监听 → event.preventDefault() + 恢复
   ④ 动画循环用 renderer.setAnimationLoop() 而非手动 rAF（自动暂停后台 tab）
   ⑤ 所有 new THREE.Vector3() 等临时对象在循环外创建，循环内复用

5. 环境照明（来自 threejs-materials 环境贴图方案）
   无外部 HDR 依赖版本：
   - 4 盏精心放置的灯光模拟环境
   - HemisphereLight(skyColor, groundColor, 0.6) 提供环境反射感
```

#### 模块 B：threejs-effects.ts（视觉质量提升）

来源：`threejs-shaders`（S 级 9.0）+ `threejs-geometry`（A 级 8.5）+ `threejs-animation`（A 级 8.5）

```
注入内容：

1. 粒子系统标准（来自 threejs-geometry BufferGeometry + 3d-graphics 粒子）
   - Points + BufferGeometry + PointsMaterial
   - AdditiveBlending + depthWrite:false
   - 固定 Float32Array 缓冲区，needsUpdate = true
   - 设备自适应粒子数：high 5000 / medium 2000 / low 500

2. 轨迹线标准（来自 threejs-geometry Line + BufferAttribute）
   - 固定长度缓冲区 MAX_POINTS=500
   - setDrawRange 控制可见范围
   - 每帧 shift+push 更新

3. 矢量可视化（来自 AetherViz + threejs-interaction ArrowHelper）
   - 力 → ArrowHelper #EF4444（红）
   - 速度 → ArrowHelper #3B82F6（蓝）
   - 加速度 → ArrowHelper #22C55E（绿）
   - setLength/setDirection 动态更新

4. Shader 效果模板（来自 threejs-shaders Fresnel/噪声/溶解）

   Fresnel 边缘光（适用：能量球/力场/等离子体/电场）：
   ```glsl
   vec3 viewDir = normalize(cameraPosition - vWorldPosition);
   float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
   gl_FragColor = vec4(mix(baseColor, edgeColor, fresnel), 1.0);
   ```

   波动位移（适用：波函数/水面/声波/电磁波）：
   ```glsl
   pos.z += sin(pos.x * freq + time) * amplitude;
   pos.z += cos(pos.y * freq * 0.7 + time) * amplitude * 0.5;
   ```

   噪声溶解（适用：化学反应/相变/衰变）：
   ```glsl
   float n = fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
   if(n < progress) discard;
   float edge = smoothstep(progress, progress+0.1, n);
   gl_FragColor = vec4(mix(edgeGlowColor, baseColor, edge), 1.0);
   ```

   性能规则：
   - 用 step()/mix()/smoothstep() 替代 if/else（避免 GPU 分支发散）
   - 移动端 precision 降级：#ifdef GL_FRAGMENT_PRECISION_HIGH

5. 物理模拟（来自 threejs-animation Spring 类 + AetherViz Verlet/Euler）
   - Spring { stiffness:100, damping:10 } → update(dt)
   - Clock.getDelta() 帧率无关
   - Verlet 积分用于准确轨道
   - Euler 方法用于简单近似

6. InstancedMesh（来自 threejs-geometry + 3d-graphics/12-performance）
   - 超过 50 个同类对象必须用 InstancedMesh
   - dummy Object3D 复用 + updateMatrix
   - instanceColor 支持每实例颜色
   - 目标：< 100 draw calls（移动端 60fps 基准）
```

#### 模块 C：visual-design.ts（视觉一致性）

来源：AetherViz SKILL.md 配色系统 + 布局蓝图

```
注入内容：

1. 配色系统（从 AetherViz 完整移植，适配 edu-academic）
   6 学科渐变色 + 玻璃拟态精确参数 + CSS 变量体系

2. 页面五区布局
   顶部标题栏 → 左侧信息栏(30%) + 中央画布(70%) → 底部控制面板 → 可折叠测验

3. 组件级定义
   - 导航栏：主题图标+中英文标题+按钮(重置/随机/全屏)
   - 侧栏：核心公式(KaTeX)+原理说明+知识卡片
   - 控制面板：玻璃拟态+滑块+数值+播放暂停
   - 测验：右下角悬浮按钮，360×380px，transition 0.3s ease
```

#### 模块 D：svg-hybrid.ts（新维度）

来源：AetherViz SVG+Three.js 混合方案

```
注入内容：

1. 自动识别逻辑
   运动/粒子/碰撞/天体/分子/力场 → Three.js 纯 3D
   函数/图像/曲线/统计/证明/坐标 → SVG 优先
   牛顿/波动/振动/电磁/能量 → Three.js + SVG 混合

2. 混合架构
   - SVG overlay div(pointer-events:none) 叠在 Canvas 上
   - projectToScreen() 坐标同步函数
   - 滑块变化 → 同时更新 3D 场景 + SVG 图表

3. SVG 适用场景
   函数波形 → <path>
   坐标系 → <line> + <text>
   数据图表 → <rect>/<circle>
```

#### 模块 E：interaction.ts（交互规范）

来源：`threejs-interaction`（S 级 9.0）+ AetherViz 交互规范

```
注入内容：

1. OrbitControls 精确参数
   enableDamping=true, dampingFactor=0.05
   minDistance=2, maxDistance=50
   maxPolarAngle=Math.PI/2（防穿地）

2. 滑块联动规范
   input 事件（实时）→ 同时更新 3D + 矢量 + SVG + KaTeX 公式计算

3. 必须按钮
   播放/暂停 | 重置 | 随机实验

4. 触控支持
   event.touches[0] → NDC 转换（同鼠标）
   双指缩放 OrbitControls 自带

5. Raycaster 点击交互
   点击 3D 物体 → emissive 高亮 + 侧栏弹出公式推导
   userData.onClick 回调注册模式

6. 动画标准
   60fps, requestAnimationFrame
   Clock.getDelta() 帧率无关
   spring 缓动感（stiffness:100, damping:10）
```

### 4.3 quality-checker.ts 增强

新增检测项（来自 threejs-3d-graphics validations.md）：

```
现有检测保留 +

新增 Three.js 专项：
  ✅ HTML 中包含 new THREE.Scene()
  ✅ HTML 中包含 new THREE.WebGLRenderer
  ✅ HTML 中包含 requestAnimationFrame 或 setAnimationLoop
  ✅ HTML 中包含 addEventListener('resize'
  ✅ HTML 中不包含 new THREE.Vector3() 在 animate/render 函数内部（GC 压力）
  ✅ setPixelRatio 被调用（防止模糊）
  ✅ 无 var 关键字（代码质量）
```

## 五、实施步骤

### Phase 1：编写 prompt 模块（~5h）

| 步骤 | 文件 | 主要来源 Skill |
|------|------|---------------|
| 1.1 | `prompt-modules/threejs-core.ts` | threejs-3d-graphics(9.3) + 3d-graphics(9.5) + threejs-materials(8.5) |
| 1.2 | `prompt-modules/threejs-effects.ts` | threejs-shaders(9.0) + threejs-geometry(8.5) + threejs-animation(8.5) |
| 1.3 | `prompt-modules/visual-design.ts` | AetherViz SKILL.md |
| 1.4 | `prompt-modules/svg-hybrid.ts` | AetherViz SVG+Three.js 方案 |
| 1.5 | `prompt-modules/interaction.ts` | threejs-interaction(9.0) + AetherViz |
| 1.6 | 重写 `system-prompt.ts` | 组装全部模块 |
| 1.7 | 增强 `quality-checker.ts` | threejs-3d-graphics validations.md |

### Phase 2：验证（~2h）

5 个测试主题覆盖全部渲染模式：

| 主题 | 渲染模式 | 重点验证 |
|------|---------|---------|
| 牛顿第二定律 | Three.js 纯 3D | ArrowHelper 矢量 + 滑块联动 + 轨迹线 |
| 正弦函数 | SVG 优先 | SVG 波形 + 坐标系 + 参数滑块 |
| 波动与振动 | Three.js + SVG 混合 | 3D 弹簧 + SVG 波形叠加 + 坐标同步 |
| 黑洞引力透镜 | Three.js + Shader | Fresnel 边缘光 + 粒子 + 自定义 shader |
| DNA 双螺旋 | Three.js 粒子 | InstancedMesh + 旋转动画 + 材质选择 |

每个生成结果检查：
- [ ] 3D Canvas 非空白（FPS > 30）
- [ ] 滑块实时联动 3D
- [ ] 移动端触控正常
- [ ] 布局正确（五区结构）
- [ ] 截图对比改前改后

### Phase 3：迭代（~2h）

- 失败主题单独分析，补充针对性模板
- Token 消耗评估（prompt ~4000 tokens，每次多 ~$0.01）
- 调整 prompt 各模块权重（最重要的 threejs-core 放最前面）

## 六、Token 成本

| | 改前 | 改后 |
|---|---|---|
| System Prompt | ~1200 tokens | ~4000 tokens |
| 每次额外成本 | — | ~$0.01 |
| 生成成功率 | ~50%（复杂主题经常黑屏） | 预期 >80% |
| HTML 输出大小 | ~15-25KB | ~25-40KB |

## 七、成功标准

1. 黑洞引力透镜重新生成 → 3D 渲染正常，光线弯曲可见
2. 5 个测试主题全部生成成功
3. iPhone 上能正常打开、触控旋转
4. 截图对比有明显视觉质量提升
