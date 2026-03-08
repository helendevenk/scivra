# 嵌入式分享（Embed Widget）设计文档

> 日期：2026-02-24
> 状态：待实现
> 预估开发量：1 天
> 依赖：UPG Gallery 模块

## 1. 定位与核心价值

每个嵌入就是一个免费广告位。物理老师在教学博客嵌入可视化，所有学生都会看到。

- **病毒传播**：嵌入博客、教学网站、论坛，每个嵌入带来新访客
- **品牌曝光**：底部 "Powered by NeonPhysics" 水印链接持续引流
- **SEO 反链**：每个嵌入页面是一个外链，提升域名权重

参考：YouTube embed、CodePen embed、Desmos embed。

## 2. 用户操作流程

```
/gallery/[id] 或 /upg/view/[id] 页面
  → 点击 "Embed" 按钮
    → 弹出对话框，显示 iframe 代码
      → 复制代码，粘贴到自己的网站
```

## 3. 路由

```
/embed/[id]    精简版可视化渲染页（公开，无需登录）
```

## 4. /embed/[id] 页面

- 无 Header、Footer、导航、侧边栏
- 纯净可视化 iframe 渲染 + 底部水印条
- 水印条 32px：左侧标题（前 30 字符），右侧 "Powered by NeonPhysics" → `/gallery/[id]`
- 响应式：宽高 100% 填满父容器，嵌入方控制尺寸
- 只渲染 `is_public = true`，私有内容返回 404

## 5. 嵌入代码

```html
<iframe
  src="https://neonphysics.com/embed/{id}"
  width="800"
  height="600"
  frameborder="0"
  allowfullscreen
  style="border-radius: 8px; border: 1px solid #e5e7eb;"
></iframe>
```

## 6. 前端组件

```
src/shared/blocks/embed/
├── EmbedDialog.tsx     弹出对话框
└── EmbedWatermark.tsx  底部水印条
```

### EmbedDialog

- 三个预设尺寸：小（560x420）、中（800x600）、大（1024x768）
- 代码区域语法高亮 + 一键复制
- 复制成功 "Copied!" 反馈
- 触发位置：`/gallery/[id]` 操作栏 + `/upg/view/[id]` 操作栏
- **未公开内容处理**：在 `/upg/view/[id]` 点击 Embed 时，若 `is_public=false`，弹窗显示"先发布到 Gallery 才能嵌入"，附带一键发布按钮（复用 PublishToggle 逻辑）

### EmbedWatermark

- 固定底部，高度 32px
- 半透明背景，不干扰可视化内容
- 左侧标题，右侧品牌链接

## 7. 安全配置

- `/embed/[id]` 路由：不设置 `X-Frame-Options`，允许被任意域名嵌入
- `/embed/[id]` 路由：CSP header 单独配置，允许跨域嵌入
- 其他页面保持 `X-Frame-Options: SAMEORIGIN`

## 8. 统计追踪

- 每次加载 `view_count + 1`（与 Gallery 详情页共享计数）
- 后续可加 `referer` 追踪嵌入来源
