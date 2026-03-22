# 16 个 3D Skills 对 NeonPhysics v2 项目的价值分析

**创建日期：** 2026-03-16
**关联方案：** `docs/plans/3d-visualization-plan.md`
**结论：** 从 16 个 skill 中筛选出 6 个直接可用，整理出项目各阶段的具体参考点

## 一、对本项目的最终评级

> 本项目技术栈：**React Three Fiber (R3F) v9.5.0 + Drei v10.7.7 + postprocessing v3.0.4**
> 这是关键前提——R3F 项目和纯 Three.js 写法有本质差异（JSX vs 命令式），评分以「在 R3F 项目中的可用性」为准

### S 级 — 直接用，逐段参考

| Skill | 对本项目的价值 | 具体用途 |
|-------|-------------|---------|
| **threejs-materials** | ⭐⭐⭐⭐⭐ | Phase 0：`materials.ts` 设计磨砂玻璃 + 金边材质，MeshPhysicalMaterial 参数速查表 |
| **threejs-shaders** | ⭐⭐⭐⭐⭐ | Wave 场景顶点位移、粒子颜色渐变、UPG 加载动画发光爆发效果 |
| **threejs-interaction** | ⭐⭐⭐⭐ | `useMouseParallax` 实现：鼠标坐标归一化公式直接复用；FeatureMiniCanvas hover 检测 |
| **3d-visualizer** | ⭐⭐⭐⭐ | 唯一以 R3F 为主的 skill，InstancedMesh 粒子系统代码直接移植到 HeroParticleField |
| **threejs-animation** | ⭐⭐⭐ | UPG 加载场景进度驱动动画参考；ColorKeyframeTrack 用于原子爆发颜色变化 |
| **threejs-geometry** | ⭐⭐⭐ | Feature mini scenes 中各几何体参数速查（Torus、Cylinder、Cone 参数） |

### A 级 — 特定问题时查阅

| Skill | 对本项目的价值 | 具体用途 |
|-------|-------------|---------|
| **threejs-fundamentals** | ⭐⭐ | 和已有 threejs-builder 高度重叠，仅在调试 Camera frustum 问题时参考 |
| **threejs-webgl** | ⭐⭐ | WebGPU 未来方向参考；Canvas 性能监控部分有用 |
| **webgl-expert** | ⭐ | 纯 WebGL（无 R3F），理解 R3F 底层原理时参考，不直接用于编码 |
| **3d-web-experience** | ⭐ | 技术选型阶段已过，本项目已确定用 R3F |
| **spline-interactive** | ⭐ | Spline 是设计工具，本项目代码直接写 3D，不用 Spline |
| **spline-3d-integration** | ⭐ | 同上 |

### 不适用 — 场景完全不同

| Skill | 原因 |
|-------|------|
| **3d-modeling** | 离线建模工具（Blender/Maya），不是 Web 3D |
| **3d-graphics** | 索引型 skill，实体在 references 文件里，需另行展开才有用 |
| **threejs-3d-graphics** | 角色扮演式，内容是已有 skill 的子集 |
| **webgl** | 为 JARVIS 项目高度定制，通用性差 |

## 二、各 Phase 参考 Skill 速查表

### Phase 0：基础设施

**AcademicCanvas + 质量系统 + Hooks**

| 任务 | 参考 Skill | 具体章节 |
|------|-----------|---------|
| `materials.ts` 磨砂玻璃材质 | **threejs-materials** | `MeshPhysicalMaterial (Advanced PBR)` + `Glass Material Example` |
| `materials.ts` 金边材质 | **threejs-materials** | `MeshStandardMaterial (PBR)` 的 metalness/roughness/emissive 参数 |
| `useMouseParallax` 鼠标归一化 | **threejs-interaction** | `Mouse Position Conversion` → `updateMouse()` 函数的坐标转换公式 |
| 材质性能优化 | **threejs-materials** | `Performance Tips` → Material pooling / materialCache 模式 |

**直接可用代码片段（threejs-materials）：**
```javascript
// 磨砂玻璃 - 直接来自 threejs-materials Glass Material Example
const frostedGlass = new THREE.MeshPhysicalMaterial({
  color: 0x2563eb,      // 学术蓝
  metalness: 0,
  roughness: 0.3,       // 轻微磨砂（改为 0.3，非完全透明玻璃）
  transmission: 0.6,    // 60% 透射
  thickness: 0.5,
  ior: 1.5,
})

// 金边 - 改编自 Car Paint Example（clearcoat 替换为 emissive）
const goldEdge = new THREE.MeshStandardMaterial({
  color: '#C4A35A',
  metalness: 0.9,
  roughness: 0.2,
  emissive: '#6B4F1A',
  emissiveIntensity: 0.3,
})
```

### Phase 1：Hero 3D 背景

**HeroAtomModel + HeroParticleField + HeroFormulaFragments**

| 任务 | 参考 Skill | 具体章节 |
|------|-----------|---------|
| `HeroParticleField` InstancedMesh 粒子 | **3d-visualizer** | `Instanced Mesh (Many Objects)` → `Particles` 完整组件 |
| 鼠标视差 group 偏移 | **threejs-interaction** | `Mouse Position Conversion` → `updateMouseCanvas()` |
| 粒子 useFrame 动画 | **3d-visualizer** | `Animated 3D` 的 useFrame + delta 模式 |
| 轨道线性能 | **threejs-materials** | `LineBasicMaterial` 参数 |

**直接可用代码片段（3d-visualizer InstancedMesh）：**

> 这是 3d-visualizer 里最有价值的代码，比 Drei Points 更灵活，直接移植：

```typescript
// 来自 3d-visualizer Particles 组件，改造为 HeroParticleField
export function HeroParticleField({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      t: Math.random() * 100,
      factor: 8 + Math.random() * 15,    // 半径控制
      speed: 0.0002 + Math.random() / 3000, // 更慢的漂移速度
    }))
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    particles.forEach(({ t, factor, speed }, i) => {
      const time = state.clock.elapsedTime
      const a = Math.cos(time * speed + t)
      const b = Math.sin(time * speed + t)
      dummy.position.set(
        a * factor + Math.cos(time * speed / 2) * factor / 3,
        b * factor + Math.sin(time * speed / 2) * factor / 3,
        (a + b) * factor / 2,
      )
      dummy.scale.setScalar(0.05 + Math.abs(Math.sin(time * speed + t)) * 0.03)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />  {/* 低面数 */}
      <meshStandardMaterial color="#3B82F6" emissive="#1D4ED8" emissiveIntensity={0.2} />
    </instancedMesh>
  )
}
```

### Phase 2：Feature Mini Scenes

**MoleculeScene + WaveScene + CircuitScene + TelescopeScene**

| 任务 | 参考 Skill | 具体章节 |
|------|-----------|---------|
| `WaveScene` 顶点位移 | **threejs-shaders** | `Vertex Shader` 的 sin 波纹位移 pattern（ShaderMaterial + uniform time） |
| 几何体参数选择 | **threejs-geometry** | 各 Primitive 参数速查 |
| Hover 亮度增加 | **threejs-interaction** | `Hover Effects` → `material.emissive.set()` 模式 |
| MeshToonMaterial（可选风格） | **threejs-materials** | `MeshToonMaterial` + gradientMap 三段阶梯着色 |

**WaveScene 的 shader 参考（来自 threejs-shaders）：**
```glsl
// 来自 threejs-shaders ShaderMaterial 示例改造
vertexShader: `
  varying vec2 vUv;
  uniform float time;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // 波函数位移
    pos.z += sin(pos.x * 3.0 + time) * cos(pos.y * 2.0 + time * 0.7) * 0.3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,
fragmentShader: `
  varying vec2 vUv;
  uniform vec3 colorA;
  uniform vec3 colorB;

  void main() {
    // 基于 UV 的蓝色渐变
    gl_FragColor = vec4(mix(colorA, colorB, vUv.y), 0.8);
  }
`,
uniforms: {
  time: { value: 0 },
  colorA: { value: new THREE.Color('#1D4ED8') },  // 深学术蓝
  colorB: { value: new THREE.Color('#93C5FD') },  // 浅学术蓝
}
// 每帧更新: material.uniforms.time.value = clock.getElapsedTime()
```

### Phase 3 + 4：Stats + CTA 区域

| 任务 | 参考 Skill | 具体章节 |
|------|-----------|---------|
| 粒子位置插值（CTA 聚合效果） | **threejs-animation** | `VectorKeyframeTrack` + `InterpolateSmooth` 缓动模式 |
| Stats 轨道粒子 | **3d-visualizer** + **threejs-animation** | 轨道参数化运动 (sin/cos) |

### Phase 5：UPG 加载动画

| 任务 | 参考 Skill | 具体章节 |
|------|-----------|---------|
| 进度驱动颜色变化 | **threejs-animation** | `ColorKeyframeTrack` |
| 爆发时 emissive 爆闪 | **threejs-shaders** | uniforms 动态更新模式：`material.uniforms.intensity.value = progress / 100` |
| 爆发后淡出 | **threejs-materials** | `transparent + opacity` + `needsUpdate` 时机 |

## 三、threejs-interaction 对 useMouseParallax 的直接价值

这是 `threejs-interaction` 对本项目最具体的贡献——以下是直接转化为 R3F hook 的代码：

```typescript
// 来自 threejs-interaction Mouse Position Conversion，改写为 R3F hook
// src/shared/hooks/useMouseParallax.ts

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useIsMobile } from './use-mobile'

export function useMouseParallax(dampingFactor = 0.05) {
  const isMobile = useIsMobile()
  const mouse = useRef({ x: 0, y: 0 })
  const smoothed = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (isMobile) return  // 移动端不追踪，省 CPU

    const onMouseMove = (e: MouseEvent) => {
      // 来自 threejs-interaction updateMouse() 的归一化公式
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [isMobile])

  // 返回一个每帧更新平滑值的回调，在 useFrame 中调用
  const getSmoothed = () => {
    // lerp 平滑
    smoothed.current.x += (mouse.current.x - smoothed.current.x) * dampingFactor
    smoothed.current.y += (mouse.current.y - smoothed.current.y) * dampingFactor
    return smoothed.current
  }

  return getSmoothed
}

// 使用方式（在 HeroBackground 组件的 useFrame 中）：
// const getParallax = useMouseParallax()
// useFrame(() => {
//   const { x, y } = getParallax()
//   groupRef.current.rotation.x = y * 0.15
//   groupRef.current.rotation.y = x * 0.2
// })
```

## 四、MeshPhysicalMaterial 完整参数速查（来自 threejs-materials）

这是 `materials.ts` 设计时的核心参考，汇总到这里方便实施时查阅：

```typescript
// 磨砂玻璃（学术蓝调，用于原子核、轨道球等主要几何体）
const academicFrostedGlass = {
  color: '#2563EB',        // 学术蓝
  metalness: 0,
  roughness: 0.25,
  transmission: 0.55,      // 55% 透射，有玻璃感但不全透
  thickness: 0.3,
  ior: 1.45,
  transparent: true,
}

// 学术金（用于发光边缘、电子轨迹、强调元素）
const academicGold = {
  color: '#C4A35A',        // oklch(0.75 0.15 75) 转 hex
  metalness: 0.85,
  roughness: 0.25,
  emissive: '#6B4F1A',
  emissiveIntensity: 0.4,
}

// 轨道线（低透明度蓝色线条）
const orbitLine = {
  color: '#3B82F6',        // 学术蓝
  transparent: true,
  opacity: 0.25,
  // 使用 Drei <Line> 或 THREE.LineBasicMaterial
}

// 暗色主题调整（在 dark 模式下 emissiveIntensity 提高 1.5x）
const darkModeMultiplier = 1.5
```

## 五、不值得在本项目中使用的 Skill（及原因）

### spline-interactive / spline-3d-integration

Spline 是 GUI 可视化 3D 设计工具（类似 Figma 的 3D 版），设计师用来做 3D 资产，然后嵌入到网页。

本项目的 3D 元素是**程序化生成**（原子轨道、粒子场、波函数），不需要 Spline 这类工具。这两个 skill 对本项目价值接近零。

### webgl-expert

纯 WebGL（无 Three.js / R3F），需要手写 VAO、UBO、GLSL 全套底层代码。本项目用 R3F + Drei，已经高度抽象。

除非：a) 需要实现极致性能优化（比如 10 万以上粒子）b) 需要自定义后处理 pass。当前方案不涉及这两种情况。

### 3d-modeling

完全是离线 3D 建模（Blender/Maya/ZBrush）的工作流。和 Web 3D 编码没有关系。被误放入"3D skills"分类。

### threejs-fundamentals + threejs-webgl

与已有的 `threejs-builder` skill 重叠度 60% 以上，差异主要是代码风格（命令式 vs 声明式）。项目已用 R3F，这两个主要是纯 Three.js 写法，转换成本高于直接用 R3F 文档。

## 六、最终推荐：按实施阶段的 Skill 索引

```
Phase 0 (基础设施)
  ├── 磨砂玻璃材质    → threejs-materials: MeshPhysicalMaterial + Glass Example
  ├── 金边材质        → threejs-materials: MeshStandardMaterial PBR 参数
  ├── 鼠标视差 hook   → threejs-interaction: Mouse Position Conversion
  └── 材质缓存优化    → threejs-materials: Performance Tips / materialCache

Phase 1 (Hero 背景)
  ├── 粒子系统        → 3d-visualizer: Instanced Mesh / Particles 组件 ← 最直接可用
  ├── useFrame 动画   → 3d-visualizer: Animated 3D
  └── 公式文字效果    → Drei <Text>（直接用库，无需参考 skill）

Phase 2 (Feature mini)
  ├── Wave 顶点 shader → threejs-shaders: ShaderMaterial + sin 位移
  ├── Hover 发光      → threejs-interaction: Hover Effects / emissive
  └── 几何体参数      → threejs-geometry: Primitives 速查

Phase 3-4 (Stats + CTA)
  └── 粒子插值动画    → threejs-animation: VectorKeyframeTrack + InterpolateSmooth

Phase 5 (UPG 加载)
  ├── 颜色动画        → threejs-animation: ColorKeyframeTrack
  └── 爆发 shader     → threejs-shaders: uniforms 动态更新
```

## 七、总结

**16 个 skill 中，对本项目真正有价值的是 6 个：**

1. **threejs-materials** — 磨砂玻璃材质的参数基础，Phase 0 必读
2. **threejs-shaders** — WaveScene + UPG 爆发动画的 GLSL 参考
3. **threejs-interaction** — useMouseParallax 的坐标归一化公式
4. **3d-visualizer** — 唯一的 R3F 导向 skill，粒子系统代码最直接可用
5. **threejs-animation** — CTA 粒子聚合 + UPG 加载颜色动画
6. **threejs-geometry** — Feature scene 几何体参数速查

**其他 10 个不推荐在本项目中主动使用**，原因：场景不匹配（Spline/建模）、与 R3F 模式不兼容（纯 Three.js 命令式）、内容与已有 `threejs-builder` 重叠（fundamentals/webgl）。
