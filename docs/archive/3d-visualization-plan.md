# NeonPhysics v2 全面 3D 化实施方案

**创建日期：** 2026-03-16
**最后更新：** 2026-03-16（整合 CTO 评审意见后）
**状态：** 待实施（Phase 0-2、Phase 4 批准；Phase 3 跳过；Phase 5 暂停）
**优先级：** P1 — 核心视觉差异化
**关联文档：** `docs/plans/3d-skills-analysis.md` | `docs/plans/3d-cto-review.md`

## 背景与动机

NeonPhysics v2 是一个物理教育 SaaS 平台，核心产品是 UPG（万物原理生成器）。当前网站 Landing 页面完全是 2D HTML，与「帮用户理解 3D 物理世界」的产品定位不匹配。

项目已安装以下 3D 相关依赖（仅在实验页面使用，赛博霓虹风格）：
- React Three Fiber v9.5.0
- @react-three/drei v10.7.7
- @react-three/postprocessing v3.0.4
- three.js v0.183.1

**目标：** 在 Landing 页所有核心区域 + UPG 页面注入学术优雅风格的 3D 元素，全设备适配。

## 视觉风格定义

**风格定位：** 高端科学博物馆，而不是科幻游戏。

| 维度 | 选择 | 说明 |
|------|------|------|
| 配色 | 学术蓝 + 金色点缀 | primary: `oklch(0.50 0.20 250)` + edu-gold: `oklch(0.75 0.15 75)` |
| 几何体 | 原子轨道、分子结构、波函数 | 与物理教育内容强关联 |
| 材质 | 半透明 + 微弱发光边缘 | MeshStandardMaterial, opacity 0.6, roughness 0.3（⚠️ CTO：transmission 每 mesh 需 backside pass，代价过高） |
| 动画 | 缓慢旋转、优雅漂浮 | ~0.1 rad/s，lerp 平滑 |
| 后处理 | DepthOfField（高质量时） | 博物馆柔焦感，而非 Bloom 赛博风 |
| 交互 | 鼠标视差（Hero 区域） | 细腻，非游戏级别 |

## 架构决策

### 为什么新建 AcademicCanvas 而不是复用 SceneContainer？

现有 `SceneContainer`（实验页面用）内置：
- OrbitControls（Landing 页装饰性 3D 不需要）
- 霓虹网格地面（赛博朋克风）
- 星空背景（Stars from Drei）
- Bloom 后处理（霓虹发光效果）
- 青色/品红点光源（霓虹配色）

Landing 页需要完全不同的视觉语言。硬改 SceneContainer 会破坏实验页面，新建 AcademicCanvas 更干净。

### 为什么每个 Section 独立 Canvas？

独立 Canvas 的核心理由是：**Next.js App Router 的 RSC 架构下，全页 Canvas 的生命周期和 React 树的对应关系难以管理**，不是简单的性能问题。

独立 Canvas 的实际代价（需正视）：每个 Canvas 有独立的 GL 上下文、独立的着色器程序编译、独立的内存分配，启动开销是全页 Canvas 的 N 倍。

**上下文回收必须用条件渲染，不是"暂停 useFrame"：**

```tsx
// ❌ 错误：暂停 useFrame 只停 CPU 计算，GL 上下文仍占着
{isVisible ? <Canvas><Scene /></Canvas> : <Canvas><EmptyScene /></Canvas>}

// ✅ 正确：条件渲染完全卸载 Canvas，释放 GL 上下文
{isVisible && <Canvas><Scene /></Canvas>}
```

浏览器软限制 8-16 个活跃 WebGL 上下文（Firefox 8 个起强制回收）。通过条件渲染确保同时活跃 ≤ 5 个。

### 为什么 DepthOfField 而不是 Bloom？

Bloom = 赛博朋克霓虹发光感。
DepthOfField = 博物馆镜头柔焦感。

学术优雅路线，后者更匹配。且 DepthOfField 仅在高质量模式下启用，中低质量直接关闭，性能影响可控。

## 文件结构

```
src/shared/components/three/
  academic/
    AcademicCanvas.tsx          ← 学术风格 Canvas 容器（核心入口）
    AcademicLighting.tsx        ← 博物馆级灯光组件
    materials.ts                ← 磨砂玻璃/金边共享材质工厂
    quality.ts                  ← 质量等级定义 + 配置
    index.ts                    ← barrel export

  landing/
    HeroBackground.tsx          ← Hero 3D 合成组件（原子+粒子+公式）
    HeroAtomModel.tsx           ← 原子模型（核+电子轨道）
    HeroParticleField.tsx       ← 漂浮粒子场
    HeroFormulaFragments.tsx    ← 浮动公式文字碎片
    FeatureMiniCanvas.tsx       ← 特性卡片 mini 3D 容器
    StatsBackground.tsx         ← Stats 区域 3D 背景
    StatsOrbitVisualization.tsx ← 轨道粒子可视化
    CtaBackground.tsx           ← CTA 区域 3D 背景
    CtaParticleConvergence.tsx  ← 滚动触发粒子聚合
    feature-scenes/
      MoleculeScene.tsx         ← H2O 分子旋转
      WaveScene.tsx             ← 波函数曲面
      CircuitScene.tsx          ← 电路板/元器件
      TelescopeScene.tsx        ← 低多边形望远镜
      index.ts
    index.ts                    ← barrel export

  upg/
    UpgLoadingScene.tsx         ← UPG 生成 3D 加载动画容器
    UpgLoadingAtom.tsx          ← 进度驱动的原子动画
    index.ts                    ← barrel export

src/shared/hooks/
  useQualityTier.ts             ← 设备检测 → 质量配置
  useMouseParallax.ts           ← 鼠标视差效果
  useScrollProgress.ts          ← Section 滚动进度 (0-1)
```

## 质量分级策略

### 决策树

```
页面加载:
  SSR 阶段 → 'low'（安全默认，避免水合不匹配）

客户端水合后:
  prefers-reduced-motion = true?
    → 'static'（⚠️ CTO：WCAG 2.1 AA 要求停止运动，不是降质量）
    → useFrame 直接 return，渲染静态场景
  width < 768px? → 'low'（手机）
  navigator.hardwareConcurrency <= 4 且 devicePixelRatio > 2?
    → 'low'（高 DPR + 低性能 = 移动端信号，iPad 横屏 1024px 也会命中）
  768px ≤ width ≤ 1024px? → 'medium'（平板）
  width > 1024px:
    WebGL2 可用? → 'high'（桌面高性能）
    否则 → 'medium'（桌面低端 GPU）
```

> ⚠️ CTO 修正：原方案用 `width < 768` 判断手机不够准确。M2 iPad Pro 横屏 1024px 进入 high tier 但散热有限；加入 `hardwareConcurrency <= 4` 作辅助信号。

### 质量配置表

| 配置项 | High（桌面高性能） | Medium（平板/桌面低端） | Low（手机） | Static（prefers-reduced-motion） |
|--------|-------------------|------------------------|-------------|----------------------------------|
| DPR 范围 | [1, 2] | [1, 1.5] | [1, 1] | [1, 1] |
| 粒子数上限 | 2000 | 800 | 300 | 0（静止） |
| 后处理 | DepthOfField | 关闭 | 关闭 | 关闭 |
| 阴影 | 开启 | 关闭 | 关闭 | 关闭 |
| 抗锯齿 | 开启 | 开启 | 关闭 | 关闭 |
| 几何细分级别 | 2 | 1 | 0 | 0 |
| 公式碎片数 | 8 | 5 | 3 | 0 |
| 动画 | 全部运行 | 全部运行 | 全部运行 | 全部停止（useFrame return） |
| Feature 卡片 | 3D Canvas | 3D Canvas | 静态图标 | 静态图标 |

## 分阶段实施方案

### Phase 0: 基础设施

**依赖：** 无（其他所有 Phase 均依赖此阶段）

**创建文件（7个）：**

**`src/shared/components/three/academic/quality.ts`**
```typescript
export type QualityTier = 'high' | 'medium' | 'low';

export interface QualityConfig {
  dpr: [number, number];
  particleCount: number;
  postProcessing: boolean;
  shadows: boolean;
  antialias: boolean;
  geometryDetail: number;        // 0/1/2 细分级别
  formulaFragmentCount: number;
  enableFeatureMiniCanvas: boolean;
}

export const QUALITY_PRESETS: Record<QualityTier, QualityConfig> = {
  high:   { dpr: [1, 2],   particleCount: 2000, postProcessing: true,  shadows: true,  antialias: true,  geometryDetail: 2, formulaFragmentCount: 8, enableFeatureMiniCanvas: true },
  medium: { dpr: [1, 1.5], particleCount: 800,  postProcessing: false, shadows: false, antialias: true,  geometryDetail: 1, formulaFragmentCount: 5, enableFeatureMiniCanvas: true },
  low:    { dpr: [1, 1],   particleCount: 300,  postProcessing: false, shadows: false, antialias: false, geometryDetail: 0, formulaFragmentCount: 3, enableFeatureMiniCanvas: false },
};
```

**`src/shared/hooks/useQualityTier.ts`**
- 基于现有 `useIsMobile()` hook 扩展
- 加入 `prefers-reduced-motion` 检测
- 加入 WebGL2 能力检测
- SSR 安全：水合前默认返回 `'low'`

**`src/shared/components/three/academic/AcademicLighting.tsx`**
```
灯光配置（博物馆风格）：
- ambientLight: intensity 0.4, 暖白色 #fff5e6
- directionalLight（主光）: position [10, 15, 10], intensity 0.8, 暖色调
- pointLight（补光）: position [-8, 5, -8], intensity 0.3, 冷蓝 #c8d8ff
```

**`src/shared/components/three/academic/materials.ts`**

> 参考 Skill：**threejs-materials** → `MeshStandardMaterial (PBR)` + `Performance Tips`
>
> ⚠️ CTO 修正 1：`transmission + ior` 的 `MeshPhysicalMaterial` 每个 mesh 需额外 backside pass，原子模型 6-7 个球体全用会导致数量级性能差异。改用 `opacity + transparent` 的 `MeshStandardMaterial`，在小尺寸几何体上视觉差异可忽略。
>
> ⚠️ CTO 修正 2：全局 `materialCache` 单例是严重错误。WebGL 材质绑定到特定 GL 上下文，多 Canvas 共享同一个材质实例会触发 `INVALID_OPERATION: useProgram: program not from this context`。此 bug 在 Phase 2 加入 Feature Mini Canvas 后随机出现，极难追踪。**材质必须在各自 Canvas 上下文内创建，不能跨 Canvas 共享。**

```typescript
// ✅ 正确：纯工厂函数，每次调用在当前 Canvas 上下文内创建新实例
// 在组件内通过 useMemo 调用，生命周期绑定到所在 Canvas

// 半透明学术蓝（原子核、轨道球、主要几何体）
// 改用 MeshStandardMaterial + opacity，放弃 transmission
export function createAcademicBlueMaterial(color = '#2563EB') {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75,         // 半透明感，无 backside pass 代价
  });
}

// 学术金（发光边缘、电子轨迹、强调元素）
export function createGoldEdgeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: '#C4A35A',      // oklch(0.75 0.15 75) → hex
    metalness: 0.85,
    roughness: 0.25,
    emissive: '#6B4F1A',
    emissiveIntensity: 0.4,
  });
}

// 轨道线（低透明度，Drei <Line> 使用）
export const orbitLineConfig = {
  color: '#3B82F6',
  transparent: true,
  opacity: 0.25,
};

// 暗色主题增强（dark mode 下 emissiveIntensity 乘 1.5）
export const DARK_MODE_EMISSIVE_MULTIPLIER = 1.5;

// ❌ 已删除：全局 materialCache Map（多 Canvas 并发会触发 WebGL 上下文错误）
// 各 Canvas 内用 useMemo 管理材质生命周期：
// const mat = useMemo(() => createAcademicBlueMaterial(), [])
```

**`src/shared/components/three/academic/AcademicCanvas.tsx`**
```typescript
// Props
interface AcademicCanvasProps {
  children: ReactNode;
  className?: string;
  quality?: QualityTier;         // 可覆盖自动检测
  enablePostProcessing?: boolean; // 可覆盖配置
  style?: CSSProperties;
}

// 特性：
// - 自动调用 useQualityTier()（如无 quality prop 覆盖）
// - gl={{ antialias, alpha: true, powerPreference: 'default' }}
// - style={{ background: 'transparent' }}（始终透明，behind DOM content）
// - 条件渲染 <EffectComposer><DepthOfField /></EffectComposer>（仅 high + postProcessing）
// - 包含 <AcademicLighting />
// - 不包含 OrbitControls（Landing 页装饰性 3D 不可交互）
```

**`src/shared/hooks/useMouseParallax.ts`**

> 参考 Skill：**threejs-interaction** → `Mouse Position Conversion` 的坐标归一化公式

```typescript
// 鼠标归一化公式直接来自 threejs-interaction skill：
// mouse.x = (event.clientX / window.innerWidth) * 2 - 1
// mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

import { useRef, useEffect } from 'react'
import { useIsMobile } from './use-mobile'

export function useMouseParallax(dampingFactor = 0.05) {
  const isMobile = useIsMobile()
  const mouse = useRef({ x: 0, y: 0 })
  const smoothed = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (isMobile) return  // 移动端不追踪，省 CPU
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [isMobile])

  // 返回每帧 lerp 平滑后的值，在 HeroBackground 的 useFrame 中调用：
  // const getParallax = useMouseParallax()
  // useFrame(() => {
  //   const { x, y } = getParallax()
  //   groupRef.current.rotation.x = y * 0.15
  //   groupRef.current.rotation.y = x * 0.2
  // })
  return () => {
    smoothed.current.x += (mouse.current.x - smoothed.current.x) * dampingFactor
    smoothed.current.y += (mouse.current.y - smoothed.current.y) * dampingFactor
    return smoothed.current
  }
}
```

**`src/shared/hooks/useScrollProgress.ts`**

> ⚠️ CTO 修正：IntersectionObserver 只告诉你是否可见，不提供精确进度。精确进度需要 scroll 事件 + `getBoundingClientRect()` 计算。两种机制边界必须清晰，否则 CTA 粒子聚合会出现卡顿感。

```typescript
// 职责分工：
// - IntersectionObserver → 判断元素是否在视口内（触发条件渲染）
// - scroll 事件 + getBoundingClientRect() → 计算精确的 0-1 进度值

// 返回: { isVisible: boolean, progress: number }
// isVisible: 用于控制 Canvas 的条件渲染（释放 GL 上下文）
// progress:  0 = 元素顶部触及视口底部，1 = 元素底部触及视口顶部

// 实现要点：
// - scroll listener 使用 { passive: true } 不阻塞渲染
// - cleanup: observer.disconnect() + removeEventListener
// - 仅在 isVisible = true 时才计算 progress（不可见时跳过计算）
```

**验证方式：** 在 `/src/app/[locale]/(landing)/page.tsx` 临时插入一个使用 AcademicCanvas 的测试组件（旋转立方体），确认三种质量等级下的渲染效果。

### Phase 1: Hero 3D 背景

**依赖：** Phase 0

**创建文件（4个）：**

**`HeroAtomModel.tsx`（R3F 内部组件）**
```
结构：
- 核心：3-4 个小球（IcosahedronGeometry r=0.15）
  材质：createAcademicBlueMaterial()（MeshStandard + opacity 0.75，不用 transmission）
  金色点缀：createGoldEdgeMaterial()（各自在 useMemo 内创建，不跨 Canvas 共享）
- 轨道线：3 条椭圆线（Drei <Line>），学术蓝 opacity 0.25
  - 轨道1：XZ 平面，半径 1.2
  - 轨道2：倾斜 60°，半径 1.6
  - 轨道3：倾斜 120°，半径 2.0
- 电子：3 个小球（r=0.08），沿各自轨道运行（useFrame sin/cos 参数化）
- 整体 group 慢速 Y 轴旋转 ~0.1 rad/s
- prefers-reduced-motion = true：useFrame 直接 return，静止渲染
- low 质量：减少为 1 条轨道 + 1 个电子
```

**`HeroParticleField.tsx`**

> 参考 Skill：**3d-visualizer** → `Instanced Mesh (Many Objects)` / `Particles` 组件（唯一 R3F 导向 skill，代码直接移植）

```typescript
// 基于 3d-visualizer Particles 组件改造，改为更慢/更学术的漂移轨迹
export function HeroParticleField({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  // ✅ CTO 修正：dummy 移出 useFrame，避免每帧 60次 堆分配 → GC 压力
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => (
    Array.from({ length: count }, () => ({
      t: Math.random() * 100,
      factor: 8 + Math.random() * 15,        // 分布半径
      speed: 0.0002 + Math.random() / 3000,  // 比原版慢 10x，更优雅
    }))
  ), [count])

  useFrame((state) => {
    if (!meshRef.current) return
    // ✅ 复用 dummy 实例，不在循环内 new
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
      <sphereGeometry args={[1, 4, 4]} />   {/* 低面数（4段），性能优先 */}
      <meshStandardMaterial color="#3B82F6" emissive="#1D4ED8" emissiveIntensity={0.2} />
    </instancedMesh>
  )
}
```

**`HeroFormulaFragments.tsx`**
```
- Drei <Text>（SDF 渲染，troika-three-text，无需 Canvas 纹理）
- 公式列表：["E=mc²", "F=ma", "PV=nRT", "λ=h/p", "∇·E=ρ/ε", "ΔxΔp≥ℏ/2", "S=k·lnW", "∮B·ds=μI"]
- 数量由 qualityConfig.formulaFragmentCount 控制
- 每个: 随机位置、随机初始旋转、opacity 0.15-0.3
- 轻微浮动：position.y += sin(time * 0.3 + offset) * 0.0003
- 字体: JetBrains Mono（与项目主题统一）

⚠️ CTO 注意：Drei <Text> 依赖 troika-three-text 运行时加载字体 URL
  1. 字体文件必须放 public/fonts/JetBrainsMono-Regular.woff 并用绝对路径
  2. 项目有严格 CSP（html-sanitizer.ts），字体 URL 需加入 CSP font-src 白名单
  3. troika-three-text 本身约 200KB gzipped，纳入 bundle size 预算
```

**`HeroBackground.tsx`（lazy 加载入口）**
```typescript
// 组合 HeroAtomModel + HeroParticleField + HeroFormulaFragments
// 应用 useMouseParallax 到外层 group：
//   groupRef.current.rotation.x = mouseY * 0.15
//   groupRef.current.rotation.y = mouseX * 0.2

// 导出为:
const HeroBackground = dynamic(
  () => import('./HeroBackgroundScene').then(m => m.HeroBackgroundScene),
  { ssr: false }
);
```

**修改文件（2个）：**

**`src/themes/default/blocks/hero.tsx`**
```diff
// section 元素改为 position: relative
<section className="relative edu-hero ...">

  {/* 新增：3D 背景层 */}
  <div className="edu-3d-container">
    <HeroBackground />
  </div>

  {/* 新增：渐变遮罩，确保文字可读 */}
  <div className="edu-3d-overlay" />

  {/* 原有内容不变，自动在层叠上下文中位于前景 */}
  <div className="container ...">
    {/* title, description, buttons ... */}
  </div>
</section>
```

**`src/config/style/theme-education.css`**
```css
/* 新增：3D 容器工具类 */
.edu-3d-container {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

/* 新增：3D 背景渐变遮罩（确保文字可读） */
.edu-3d-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    var(--background) 100%
  );
}

/* 暗色主题下的遮罩 */
.dark .edu-3d-overlay {
  background: radial-gradient(
    ellipse at center,
    transparent 20%,
    var(--background) 90%
  );
}
```

**LCP 保护机制：**
- Hero 文字/按钮为 SSR 渲染的 DOM 内容，LCP 不受影响
- 3D Canvas 通过 `dynamic(ssr:false)` 异步加载，z-index: -1 位于所有内容后方
- 如果 WebGL 不可用，背景降级为现有 CSS 背景（`edu-hero` 类的 radial dot pattern）

### Phase 2: Features 区域 mini 3D

**依赖：** Phase 0

**创建文件（6个）：**

**`MoleculeScene.tsx`**
```
H2O 分子：
- 1 个氧原子（SphereGeometry r=0.4，红色磨砂玻璃）
- 2 个氢原子（r=0.25，浅色磨砂玻璃）
- 2 条键（CylinderGeometry r=0.05，金色）
- 整体绕 Y 轴旋转
```

**`WaveScene.tsx`**

> 参考 Skill：**threejs-shaders** → `ShaderMaterial` + sin 顶点位移 pattern

```typescript
// ShaderMaterial 实现波函数（来自 threejs-shaders skill 改造）
// 比 geometry.attributes.position 方案更高效（GPU 计算，无 CPU 数组修改）

// ✅ CTO 修正：ShaderMaterial 必须在 useMemo 内创建，不能在组件外实例化
// 组件外实例化 → 重新渲染时持续创建新材质不释放旧材质 → 内存泄漏
function WaveScene() {
  const waveMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time:   { value: 0 },
      colorA: { value: new THREE.Color('#1D4ED8') },  // 深学术蓝
      colorB: { value: new THREE.Color('#93C5FD') },  // 浅学术蓝
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float time;
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.z += sin(pos.x * 3.0 + time) * cos(pos.y * 2.0 + time * 0.7) * 0.3;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 colorA;
      uniform vec3 colorB;
      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.y), 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  }), [])

  useFrame(({ clock }) => {
    waveMaterial.uniforms.time.value = clock.getElapsedTime()
  })
  // ...
}
```

**`CircuitScene.tsx`**
```
PCB 电路：
- 扁平 BoxGeometry 作板面（深绿色）
- 几条 Drei <Line> 作走线（金色）
- 小方块作元件（学术蓝）
- 整体俯视角缓慢旋转
```

**`TelescopeScene.tsx`**
```
低多边形望远镜：
- CylinderGeometry（主镜筒）
- ConeGeometry（镜头前端）
- TorusGeometry 小环（镜筒装饰）
- 材质：深空蓝 + 金色环
- 绕中心轴旋转
```

**`FeatureMiniCanvas.tsx`**

> Hover 效果参考 **threejs-interaction** → `Hover Effects` / `material.emissive.set()` 模式

```typescript
interface FeatureMiniCanvasProps {
  sceneType: 'molecule' | 'wave' | 'circuit' | 'telescope' | 'atom' | 'crystal';
  className?: string;
}

// ✅ CTO 修正：IntersectionObserver 管控必须用条件渲染，不是"暂停 useFrame"
// 暂停 useFrame 只停 CPU 计算，GL 上下文依然占着（6 个卡片 = 6 个活跃上下文）
// 条件渲染在 Canvas 卸载时才真正释放 GL 上下文

// 特性：
// - 轻量 Canvas（无后处理、最简灯光）
// - 固定高度 96px，宽度随卡片自适应
// - hover 时：动画速度 ×2 + emissive.set(0x2244aa)（threejs-interaction hover pattern）
// - low / static 质量：不渲染 Canvas，显示 Lucide 图标（graceful degradation）
// - IntersectionObserver → 控制条件渲染：{isVisible && <Canvas>...</Canvas>}
// - 同时最多 2-3 个卡片可见，实际活跃上下文受控

// hover emissive 模式（来自 threejs-interaction skill）：
// onPointerOver: mesh.material.emissive.set(0x2244aa)
// onPointerOut:  mesh.material.emissive.set(0x000000)
```

**修改文件（1个）：**

**`src/themes/default/blocks/features.tsx`**
```diff
// 每个卡片增加 mini 3D 区域（在 icon 上方）
<div className="space-y-3">
+  <FeatureMiniCanvas sceneType={getSceneType(item.icon)} className="mb-2" />
   <SmartIcon name={item.icon} size={24} />
   <h3>{item.title}</h3>
   <p>{item.description}</p>
</div>

// 添加 icon → scene 映射
function getSceneType(icon: string): SceneType {
  const map: Record<string, SceneType> = {
    'Waves': 'wave', 'Atom': 'atom', 'Dna': 'molecule',
    'Telescope': 'telescope', 'Zap': 'circuit', ...
  };
  return map[icon] ?? 'atom';
}
```

### Phase 3: Stats 区域 3D 背景 ⛔ CTO 建议跳过

> **CTO：** ROI 不足。Stats 区域是用数字说话的地方，数字背后加 3D 粒子轨道是视觉噪音大于信息增益。教育用户（高中生/教师）对数字本身更感兴趣，炫技感背景会分散注意力。如果资源有限，优先级应排在 Phase 4 之后，甚至考虑永久跳过。

**依赖：** Phase 0

**创建文件（2个）：**

**`StatsOrbitVisualization.tsx`**
```
3 条轨道环（对应 3 个 stat 数值）：
- 粒子数与 stat 数值成比（取对数缩放）
- useScrollProgress 驱动：progress=0 静止，progress=1 全速运转
- 学术蓝轨道线 + 金色粒子点
```

**`StatsBackground.tsx`**
```typescript
// dynamic(() => import(...), { ssr: false })
// AcademicCanvas + StatsOrbitVisualization
// 接收 statValues: number[] prop（从 DOM section 传入）
```

**修改文件（1个）：**

**`src/themes/default/blocks/stats.tsx`**
```diff
<section ref={sectionRef} className="relative ...">
+  <div className="edu-3d-container opacity-40">
+    <StatsBackground statValues={[statCount1, statCount2, statCount3]} />
+  </div>
   {/* 原有 DOM 统计数字保持不变（SEO/无障碍） */}
   ...
</section>
```

### Phase 4: CTA 区域粒子聚合

**依赖：** Phase 0, Phase 1（复用粒子逻辑）

**创建文件（2个）：**

**`CtaParticleConvergence.tsx`**

> 参考 Skill：**threejs-animation** → `VectorKeyframeTrack` + `InterpolateSmooth` 缓动模式

```typescript
// 粒子位置插值方案（来自 threejs-animation skill 的 VectorKeyframeTrack 思路）
// 用 THREE.MathUtils.lerp() 代替 AnimationMixer，更轻量

// 粒子状态机：
// progress = 0:   分散在半径 15 球体内（scatteredPositions）
// progress = 0.5: lerp 中间态
// progress = 1:   聚合为原子形状，金色 emissive 增强

// 核心插值逻辑：
useFrame(() => {
  particles.forEach((p, i) => {
    const t = easeInOut(scrollProgress)  // 滚动驱动
    p.mesh.position.lerpVectors(p.scatteredPos, p.convergedPos, t)
    p.mesh.material.emissiveIntensity = t * 0.8  // 聚合时金色发光增强
  })
})

// easeInOut：t < 0.5 ? 2t² : -1+(4-2t)t
```

**`CtaBackground.tsx`**
```typescript
// dynamic(() => import(...), { ssr: false })
// AcademicCanvas + CtaParticleConvergence
// useScrollProgress 传入 progress
```

**修改文件（1个）：**

**`src/themes/default/blocks/cta.tsx`**
```diff
<section ref={ctaRef} className="relative ...">
+  <div className="edu-3d-container">
+    <CtaBackground />
+  </div>
+  <div className="edu-3d-overlay" />
   {/* 原有 DOM 按钮/文字 */}
   ...
</section>
```

### Phase 5: UPG 生成器 3D 加载动画 ⏸️ CTO 要求暂停

> **CTO：** 当前 UPG 端到端联调未完成（generate→view→my 主链路未跑通），付费系统未接通生产测试，OrbitControls 不稳定。给一个主链路还没跑通的功能做加载动画优化 = 视觉鸦片。UPG 加载动画的商业价值前提是"用户能完整地用 UPG 生成内容并付费"。**前置条件满足后再解除暂停。**

**依赖：** Phase 0

**创建文件（2个）：**

**`UpgLoadingAtom.tsx`（R3F 内部组件）**

> 参考 Skill：**threejs-animation** → `ColorKeyframeTrack`；**threejs-shaders** → uniforms 动态更新

```typescript
// Props: progress (0-100)
// 进度驱动行为：

// progress 0-30:  原子核形成（粒子从四面八方收拢，lerpVectors）
// progress 30-70: 电子轨道出现，转速随 progress 加快
// progress 70-90: 全速旋转，轨道线变亮（emissiveIntensity 提升）
// progress 90-100:金色爆发（emissive 骤增，然后淡出）

// 转速公式：speed = 0.5 + (progress / 100) * 2.5

// 颜色动画（来自 threejs-animation ColorKeyframeTrack 思路，用 lerp 实现）：
// 0% → 学术蓝 #2563EB
// 90-100% → 金色爆发 #C4A35A（emissiveIntensity 0 → 2 → 0）

useFrame((state) => {
  const p = progress / 100
  const speed = 0.5 + p * 2.5
  electronRef.current.rotation.y += delta * speed

  // 爆发阶段（90-100%）使用 uniforms 动态更新（threejs-shaders 模式）
  if (progress > 90) {
    const burst = (progress - 90) / 10
    goldMaterial.emissiveIntensity = burst * 2
  }
})
```

**`UpgLoadingScene.tsx`**
```typescript
// dynamic(() => import(...), { ssr: false })
// 小尺寸 AcademicCanvas（height: 180px）
// 接收 progress: number prop
// 包含 UpgLoadingAtom
// Suspense fallback：原来的 shimmer 动画（保证无闪烁）
```

**修改文件（1个）：**

**`src/shared/blocks/upg/UpgGenerator.tsx`**
```diff
// isGenerating 时的进度区域：
{isGenerating && (
-  <div className="progress-shimmer ...">
-    <Progress value={progress} />
-    ...
-  </div>
+  <div className="relative">
+    <Suspense fallback={<OriginalShimmerProgress progress={progress} />}>
+      <UpgLoadingScene progress={progress} />
+    </Suspense>
+    {/* 保留文字百分比（无障碍） */}
+    <p className="text-center text-sm text-muted-foreground mt-2">
+      {progress}% — {currentStep}
+    </p>
+  </div>
)}
```

### Phase 6: 集成 + 暗色模式 + 打磨

**任务：**
1. 统一测试 light/dark 主题下所有 3D 场景
2. 确认 `.edu-3d-overlay` 在暗色主题下渐变遮罩颜色正确
3. 创建 barrel export 文件
4. 运行 `pnpm build` + 检查 chunk 大小
5. 低端设备模拟测试（Chrome DevTools CPU 6x throttle）
6. Lighthouse LCP/CLS 验证

## 风险与缓解方案

| 风险 | 严重程度 | 缓解方案 |
|------|---------|---------|
| ~~materialCache 全局单例~~ 多 Canvas 共享材质触发 `INVALID_OPERATION` | ✅ 已修 | 删除全局 cache，各 Canvas 内 useMemo 独立创建材质 |
| ~~暂停 useFrame~~ 无法真正释放 WebGL 上下文 | ✅ 已修 | 改为条件渲染 `{isVisible && <Canvas>}` 完全卸载 |
| ~~prefers-reduced-motion 只降质量~~ 不符合 WCAG 2.1 AA | ✅ 已修 | static tier：useFrame 直接 return，渲染静态场景 |
| MeshPhysicalMaterial transmission 性能代价 | ✅ 已修 | 改用 MeshStandardMaterial + opacity，视觉差异在小尺寸可忽略 |
| ShaderMaterial 在组件外实例化 → 内存泄漏 | ✅ 已修 | 所有材质创建移入 useMemo |
| useFrame 内每帧 new Object3D → GC 压力 | ✅ 已修 | dummy 提升到 useMemo，复用实例 |
| LCP 退化（Hero 3D 阻塞首次内容绘制） | 高 | Hero 文字纯 DOM SSR，3D 通过 dynamic(ssr:false) 异步加载，z-index:-1 |
| INP 退化（DepthOfField 占用主线程影响交互延迟） | 中 | DepthOfField 仅 high tier 启用；Hero 交互区按钮不在 Canvas 上方 |
| Drei Text 字体 CSP 拦截 | 中 | 字体放 public/fonts/，加入 next.config 的 font-src 白名单 |
| Bundle size 超预算（Three.js+troika ≈ 800KB-1MB） | 中 | Phase 0 后立即跑 bundle-analyzer，设 ≤400KB gzipped 增量上限 |
| 暗色模式材质颜色不对 | 中 | mount 时 getComputedStyle 读 CSS 变量，或传 isDark prop |
| 低端手机卡顿/发烫 | 中 | low tier: DPR 1, 无后处理, Feature 用静态图标；static tier 无动画 |
| z-index 冲突（Modal/Dropdown 被遮挡） | 低 | .edu-3d-container 固定 z-index:-1，所有 UI 组件保持 z-index ≥ 0 |

## 需要安装的额外依赖

当前项目已有：R3F v9.5.0、Drei v10.7.7、postprocessing v3.0.4

**无需新增依赖。** 所有功能均可通过现有依赖实现。

## 验证清单

每个 Phase 完成后验证：

**功能验证：**
- [ ] 3D 场景在桌面浏览器正常渲染
- [ ] 3D 场景在平板（768-1024px）正常渲染，质量降级
- [ ] 3D 场景在手机（<768px）正常降级（Feature 显示静态图标）
- [ ] prefers-reduced-motion=true 时 3D 降级为最低质量
- [ ] WebGL 不可用时有正确 fallback（CSS 背景）

**性能验证：**
- [ ] `pnpm build` 成功，无 TS 错误
- [ ] Phase 0 完成后跑 `@next/bundle-analyzer`，记录 3D 相关 chunk 基准（troika + Three.js）
- [ ] Phase 2 前确认 bundle 增量 ≤ 400KB gzipped
- [ ] Lighthouse LCP 无退化（目标：与改前 ±200ms 以内）
- [ ] Lighthouse CLS = 0（3D 背景不引起布局偏移）
- [ ] Chrome DevTools：关闭硬件加速 + CPU 6x throttle 下 Hero 场景帧率 > 20fps（最差情况基准）
- [ ] 正常桌面下帧率 > 50fps

**无障碍验证：**
- [ ] `prefers-reduced-motion: reduce` 模拟：所有 Canvas 静止，无持续运动
- [ ] 键盘导航不被 Canvas 拦截（pointer-events: none 有效）
- [ ] 屏幕阅读器不读取 Canvas 内容（aria-hidden 或 role="presentation"）

**视觉验证：**
- [ ] Light 主题截图：3D 元素与背景协调
- [ ] Dark 主题截图：渐变遮罩正确，无 z-index 问题
- [ ] 各个 3D 场景风格统一（学术蓝+金色，无霓虹感）
- [ ] WebGL 不可用时有正确 fallback（CSS 背景）

## 实施时间估算

| Phase | 文件数 | 预计工时 | 状态 | 复杂度 |
|-------|-------|---------|------|--------|
| 0: 基础设施 | 7 | 6h | ✅ 批准 | 低（基础架构） |
| 1: Hero 背景 | 6 | 10h | ✅ 批准 | 中-高（视差调优 + 材质迭代，CTO：原 8h 低估） |
| 2: Features mini | 6 | 6h | ✅ 批准 | 低（场景简单） |
| 3: Stats 背景 | 3 | 3h | ⛔ 跳过 | ROI 不足 |
| 4: CTA 粒子 | 3 | 4h | ✅ 批准 | 低-中 |
| 5: UPG 加载 | 3 | 3h | ⏸️ 暂停 | 前置条件：UPG 主链路跑通 |
| 集成打磨（每 Phase 内） | — | 1-2h/Phase | 持续 | CTO：不要积累到最后 |
| **有效合计** | **~22个文件** | **~28h** | | |

## 关键参考文件

| 用途 | 路径 |
|------|------|
| 现有 3D 容器模式（参考架构，不直接复用） | `src/shared/components/experiments/three/SceneContainer.tsx` |
| Hero 组件（主要改造目标） | `src/themes/default/blocks/hero.tsx` |
| Features 组件 | `src/themes/default/blocks/features.tsx` |
| Stats 组件 | `src/themes/default/blocks/stats.tsx` |
| CTA 组件 | `src/themes/default/blocks/cta.tsx` |
| UPG 生成器（Progress bar 替换） | `src/shared/blocks/upg/UpgGenerator.tsx` |
| 移动端检测 hook（扩展基础） | `src/shared/hooks/use-mobile.ts` |
| 主题 CSS（新增工具类） | `src/config/style/theme-education.css` |
| 动态页面渲染器 | `src/themes/default/pages/dynamic-page.tsx` |
| Landing 页路由 | `src/app/[locale]/(landing)/page.tsx` |
| 现有实验场景示例 | `src/shared/components/experiments/three/ProjectileScene.tsx` |

## Skill 参考索引（按 Phase）

> 完整 Skill 路径：`/Users/sky/.agents/skills/{skill-name}/SKILL.md`
> 详细分析见：`docs/plans/3d-skills-analysis.md`

| Phase | 任务 | Skill | 具体章节 |
|-------|------|-------|---------|
| 0 | 磨砂玻璃材质参数 | **threejs-materials** | `MeshPhysicalMaterial` + `Glass Material Example` |
| 0 | 金边材质参数 | **threejs-materials** | `MeshStandardMaterial (PBR)` metalness/roughness/emissive |
| 0 | 材质缓存优化 | **threejs-materials** | `Performance Tips` → materialCache pattern |
| 0 | 鼠标坐标归一化 | **threejs-interaction** | `Mouse Position Conversion` → `updateMouse()` |
| 1 | 粒子系统实现 | **3d-visualizer** | `Instanced Mesh / Particles` — **最直接可用代码** |
| 1 | useFrame 动画模式 | **3d-visualizer** | `Animated 3D` |
| 2 | Wave 顶点 shader | **threejs-shaders** | `ShaderMaterial` + sin 位移 vertexShader |
| 2 | Hover 发光效果 | **threejs-interaction** | `Hover Effects` → `material.emissive.set()` |
| 2 | 几何体参数速查 | **threejs-geometry** | Primitives 参数表 |
| 3–4 | 粒子插值/聚合 | **threejs-animation** | `VectorKeyframeTrack` + `InterpolateSmooth` |
| 5 | 进度颜色动画 | **threejs-animation** | `ColorKeyframeTrack` |
| 5 | emissive 爆发效果 | **threejs-shaders** | uniforms 动态更新模式 |

**不适用于本项目的 Skill（原因速查）：**

| Skill | 原因 |
|-------|------|
| spline-interactive / spline-3d-integration | Spline 是 GUI 设计工具，本项目代码直接写 3D |
| 3d-modeling | 离线 Blender/Maya 建模，与 Web 3D 无关 |
| webgl-expert | 纯底层 WebGL，R3F 已封装 |
| threejs-fundamentals / threejs-webgl | 命令式写法，与 R3F 模式冲突；与 threejs-builder 重叠 60% |
