# OrbitControls 测试指南

## 快速开始

### 方案 A: Vercel 部署测试（推荐）

1. 提交代码到 Git 仓库
2. 部署到 Vercel
3. 访问 UPG 生成页面
4. 生成测试主题并验证 OrbitControls

### 方案 B: 本地独立测试

使用 Python HTTP 服务器测试 OrbitControls 文件：

```bash
cd public
python3 -m http.server 8000
```

然后访问: http://localhost:8000/test-orbit-controls.html

### 方案 C: 修复本地开发环境

如果需要在本地开发环境测试完整的 AI 生成流程：

1. 调查 Next.js 16 + Turbopack 的 public 目录配置
2. 或使用传统的 webpack 模式：`pnpm dev --no-turbo`

## 测试主题

生成以下 3 个主题来验证 OrbitControls：

1. **物理**: "牛顿第二定律 - 力与加速度"
2. **化学**: "水分子结构"
3. **数学**: "三维坐标系与向量"

## 验证清单

### 代码检查
- [ ] 生成的 HTML 包含 `<script src="/lib/orbit-controls.js"></script>`
- [ ] 生成的 HTML 包含 `new THREE.OrbitControls(camera, renderer.domElement)`
- [ ] 生成的 HTML 包含 `controls.update()` 在动画循环中

### 功能测试（桌面）
- [ ] 左键拖拽：旋转场景
- [ ] 右键拖拽：平移场景
- [ ] 滚轮：缩放场景
- [ ] 阻尼效果：平滑停止
- [ ] 距离限制：正确限制缩放范围

### 功能测试（移动端）
- [ ] 单指拖拽：旋转场景
- [ ] 双指缩放：缩放场景
- [ ] 双指拖拽：平移场景
- [ ] 触摸操作不与页面滚动冲突

### 质量检查
- [ ] 无控制台错误
- [ ] 连续生成 10 次，OrbitControls 100% 可用
- [ ] 在 iPhone SE（2020）上测试，无卡顿

## 文件位置

- OrbitControls 文件: `/public/lib/orbit-controls.js`
- System Prompt: `/src/shared/lib/upg/system-prompt.ts`
- 测试页面: `/public/test-orbit-controls.html`
- 验证脚本: `/test-system-prompt.js`

## 验证脚本

运行以下命令验证所有修改：

```bash
node test-system-prompt.js
```

预期输出：
```
✅ OrbitControls CDN reference added
✅ 3D Scene instructions updated
✅ OrbitControls usage example added
✅ Manual implementation instruction removed
✅ orbit-controls.js exists (25.96 KB)
```

## 问题排查

### 问题: OrbitControls 文件 404
- 检查文件是否存在: `ls -la public/lib/orbit-controls.js`
- 检查服务器是否正确启动
- 如果使用 standalone 模式，确保 public 目录已复制到 `.next/standalone/`

### 问题: OrbitControls 未定义
- 检查 HTML 中是否包含 `<script src="/lib/orbit-controls.js"></script>`
- 检查脚本加载顺序（Three.js 必须在 OrbitControls 之前）
- 检查浏览器控制台是否有加载错误

### 问题: 触摸操作不工作
- 检查是否设置了 `domElement.style.touchAction = 'none'`
- 检查是否在移动设备上测试（或使用浏览器的移动模拟器）

## 联系方式

如有问题，请查看详细报告：
- `/docs/reports/2026-03-09-orbit-controls-final-delivery.md`
