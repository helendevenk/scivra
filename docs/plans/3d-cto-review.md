# CTO 评审报告：NeonPhysics v2 3D 可视化方案

**评审日期：** 2026-03-16
**评审文档：** `docs/plans/3d-visualization-plan.md`
**总体评分：** 6/10
**结论：** 条件批准，有 3 个必须修改的严重问题

## 总体判断

技术思路正确，风格定位清晰，Phase 分解合理。但有 3 个实际会在实施中爆炸的问题没处理好，还有 1 个根本性的优先级错误。

## 批准/拒绝明细

| Phase | 结论 | 原因 |
|-------|------|------|
| Phase 0 基础设施 | ✅ 批准（需改） | materialCache 全局单例必须修改后再执行 |
| Phase 1 Hero 背景 | ✅ 批准（需改） | transmission 材质替换为轻量方案；prefers-reduced-motion 改为完全停止 |
| Phase 2 Features mini | ✅ 批准（需改） | WebGL 上下文管理改为条件渲染 |
| Phase 3 Stats 背景 | ⛔ 建议跳过 | ROI 不足，数字背后加 3D 粒子是视觉噪音 |
| Phase 4 CTA 粒子 | ✅ 批准 | 对转化有价值 |
| Phase 5 UPG 加载动画 | ⛔ 暂停 | UPG 主链路未跑通就做加载动画是视觉鸦片，先修核心功能 |
| Phase 6 集成打磨 | 📌 重组 | 不是独立 Phase，拆散到每个 Phase 的验收清单 |

## 必须修改的 3 个严重问题

### 问题 1：materialCache 全局单例（严重，必修）

**当前方案：**
```typescript
const materialCache = new Map<string, THREE.Material>(); // 模块顶层全局
```

**为什么爆炸：** WebGL 材质绑定到特定 GL 上下文。一个材质实例被两个不同的 Canvas（不同 GL 上下文）使用，会触发 `INVALID_OPERATION: useProgram: program not from this context`。这个 bug 在 Phase 1 单 Canvas 时不出现，Phase 2 加入 Feature Mini Canvas 后随机触发，极难追踪。

**修复方案：** 删掉全局 cache，工厂函数每次创建新实例；或用 R3F 的 `useThree().gl` 的 canvas ID 做 namespace。

### 问题 2：WebGL 上下文回收用"暂停 useFrame"而非条件渲染（严重，必修）

**当前方案：** IntersectionObserver 检测不可见 → 暂停 useFrame

**为什么爆炸：** 暂停 useFrame 只是暂停 CPU 计算，WebGL 上下文依然存活。10 个 Canvas 仍然占着 10 个 GL 上下文。Firefox 在 8 个时开始强制回收，Chrome 在 16 个。Phase 2 之后必然超限。

**修复方案：**
```typescript
// 不可见时完全卸载 Canvas（条件渲染）
{isVisible && (
  <Canvas>
    <FeatureScene />
  </Canvas>
)}
```

### 问题 3：prefers-reduced-motion 降质量而非停止动画（合规风险）

**当前方案：** `prefers-reduced-motion = true → low tier`（仍有 300 粒子运动）

**为什么有问题：** WCAG 2.1 AA 要求是"不要播放运动动画"，不是"减少"。北美教育平台面临 ADA 合规要求，持续运动对前庭敏感用户有害。

**修复方案：**
```typescript
if (prefersReducedMotion) {
  // 渲染静态场景，useFrame 直接 return
  // 不是降低质量，是停止运动
}
```

## 其他重要发现（非必须但建议修复）

### MeshPhysicalMaterial transmission 性能被低估

`transmission + ior` 材质需要每帧额外做 backside pass（离屏渲染），原子模型 6-7 个 mesh 全用这个材质，性能代价是数量级差异。

**建议：** 用 `opacity: 0.6 + transparent: true` 的 `MeshStandardMaterial` 模拟玻璃感。在这个小尺寸下视觉差异可忽略，性能差异显著。

### useScrollProgress 实现细节不清晰

IntersectionObserver 告诉你是否可见，不告诉精确滚动进度。精确进度需要 scroll 事件 + `getBoundingClientRect()` 计算。两种机制边界不清晰，Phase 4 的 CTA 粒子聚合效果会卡顿。

### Drei Text 字体加载在 Next.js 生产构建的 CSP 问题

`<Text>` 依赖 `troika-three-text` 运行时加载字体 URL。项目有严格 CSP 策略（html-sanitizer.ts），字体 URL 需加入 `font-src` 白名单。文档未提及。

### WaveScene ShaderMaterial 在组件外实例化导致内存泄漏

```typescript
// 错误：组件重新渲染时每次创建新材质
const waveMaterial = new THREE.ShaderMaterial({...})

// 正确：
const waveMaterial = useMemo(() => new THREE.ShaderMaterial({...}), [])
```

### InstancedMesh 粒子 useFrame 里每帧 new Object3D

```typescript
useFrame((state) => {
  const dummy = new THREE.Object3D()  // 每帧 60 次堆分配 → GC 压力
```

应该在组件级别声明 `const dummy = useMemo(() => new THREE.Object3D(), [])` 复用。

### Bundle Size 未设定阈值

Three.js (~580KB) + troika-three-text (~200KB) + Drei/postprocessing = 可能增加 800KB-1MB JS。北美高中生很多用 LTE/学校共享网络，这不是可忽略的数字。建议 Phase 0 完成后立即跑 `@next/bundle-analyzer`，Phase 2 前设定 bundle 增量上限（建议 ≤ 400KB gzipped）。

### 质量分级维度过于依赖屏幕宽度

`width < 768px → low` 在 2026 年不够准确（M2 iPad Pro 横屏 1024px 但散热有限）。建议加入 `navigator.hardwareConcurrency <= 4` 或 `devicePixelRatio > 2` 作为辅助信号。

## 优先级质疑

### Phase 5 暂停理由

根据 CLAUDE.md 当前状态：
- UPG 端到端联调**未完成**
- 付费系统**未接通**生产测试
- OrbitControls **不稳定**

给一个主链路还没跑通的功能做加载动画 = 视觉鸦片。UPG 加载动画的商业价值前提是"用户能完整地用 UPG 生成内容并付费"。在此条件满足前，Phase 5 不应出现在执行列表。

### 如果只能做一个 Phase

**Phase 1（Hero 背景）**，包含 Phase 0 作为前提。

Hero 是唯一影响 100% 访客的区域，是形成"这不是普通教育网站"第一印象的关键。其他 Phase 只影响滚动到相应区域的用户。

### ROI 排序

1. Phase 0 + Phase 1 — Hero 首屏，影响全部访客
2. Phase 4 — CTA 粒子聚合，转化节点
3. Phase 2 — Features mini，差异化展示
4. Phase 3 — Stats 背景（建议跳过，ROI 不足）
5. Phase 5 — UPG 加载（暂停，前置条件未满足）

## 执行前必做的一个测试

在 Chrome 的 `about:gpu` 里关闭硬件加速，配合 6x CPU throttle，跑一次 Hero 场景，确认帧率 > 20fps。这是最差情况的基准线，没有这个数字就不知道 Phase 1 的性能下限在哪里。
