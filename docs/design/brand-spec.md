---
title: Scivra Brand Spec
owner: FE lead (@user)
status: SSOT (Single Source of Truth)
update_triggers:
  - theme.css 任何 token 改动 必须同 PR 更新本文件
  - 新增 face / 新组件视觉规则 先改本文件再改代码
  - CLAUDE.md 中任何品牌色/字体描述 禁止，统一引用本文件
enforcement:
  - src/ 下新增代码禁止 hex 硬编码（CI 仅检查 PR diff）
  - font-family 新增引用必须走 CSS 变量或 Tailwind theme token
created: 2026-04-22
---

# Scivra · Brand Spec

> 采集日期：2026-04-22
> 资产来源：public/logo.svg · src/config/style/theme.css · src/config/style/theme-education.css · scivra.com 线上截图 · CLAUDE.md
> 资产完整度：**部分**（logo 有，UI 截图有，但 **brand 自身存在不一致**——见「⚠️ 品牌一致性审计」）

---

## ⚠️ 品牌一致性审计（必读）

统一视觉资产的第一步不是"抽出来"，是**承认现状自己就在打架**。

| 资产维度 | CLAUDE.md 声称 | theme.css 实际 | logo.svg 实际 | 线上渲染 | 冲突程度 |
|---|---|---|---|---|---|
| **主色** | 学术蓝 `oklch(0.50 0.20 250)` | Teal `oklch(0.45 0.12 192)` | 三色渐变（蓝+紫+珊瑚）| Teal | 🔴 三方分裂 |
| **点缀色** | 学术金 `oklch(0.75 0.15 75)` | `--np-gold` = 同 CLAUDE.md | 无（logo 无金色）| Hero 有用 gold 下划线 | 🟡 文档/代码对齐但 logo 缺席 |
| **Heading 字体** | Merriweather (serif) | `--font-heading: Space Grotesk` | wordmark 用 system-ui | Hero H1 用 `font-serif`（应用层覆盖）| 🟡 CSS 变量与应用不一致 |
| **Body 字体** | Noto Sans | Space Grotesk（同 heading）| — | Space Grotesk | 🔴 文档错了 |
| **气质** | 酷炫 · 好奇 · 自信 · edu-academic | 学术 teal + gold | 年轻活泼 K12 friendly | 学术 SaaS + 一张卡通插画 | 🔴 logo 与主题人格冲突 |

**结论**：这是 v1 最硬的问题——**logo 的"K12 活泼三色"品牌人格，与 theme 的"教材学术 teal + gold"是两个品牌**。选一个：

- **方向 A（保 logo 三色）**：整站改回三色渐变，走"年轻 K12 探索"路线。放弃 edu-academic。
- **方向 B（保 theme 学术）**：logo 降级为辅助签名（只用于 favicon / 角落），主视觉靠 teal + gold + serif 建立识别度。保持 edu-academic。**← 推荐：更专业、更贴"北美高中 AP 备考"受众**
- **方向 C（双面系统）**：marketing 面用 logo 三色招揽 + product 面用学术 teal 沉浸，切换时用户理解是"从招生宣传页进到学习工具"。有风险。

**本文档以「方向 B · 保 theme 学术」锁定规范**。3 个设计方向 Demo 都基于这个前提。logo 维持当前，但**使用场景收窄**（见下方「Logo 使用规则」）。

---

## 🎯 核心资产（一等公民）

### Logo
- 主版本：`_design/brand/logo.svg`（SVG，三色渐变，viewBox 200×200）
- 位图版本：`_design/brand/logo.png`（800KB PNG）
- **使用规则**（修订）：
  - ✅ 导航栏角落（16-24px 高）：作为身份锚点
  - ✅ favicon / social card
  - ✅ 移动端 app icon / launcher icon
  - ❌ **不得**在 hero 大图、section 分隔、装饰背景里放大使用——三色渐变会与 teal + gold 的学术色打架
  - ❌ **不得**作为 emoji 替代（如"📚"之类）——logo 不是装饰图标
- 禁用变形：不拉伸 · 不改色 · 不加描边 · 不拆分单臂单独用

### UI 截图（数字产品 · 已采集）
- 首页 hero：`_design/current/homepage-light-hero.png`
- 首页 full：`_design/current/homepage-light-full.png`
- 实验卡片区：`_design/current/homepage-scroll2.png`（**这是最强资产**——dark navy + 科学 neon 线稿）
- Grade levels + How It Works：`_design/current/homepage-scroll3.png`

**实验卡片缩略图是隐藏的品牌宝藏**：dark navy (#0b1420 左右) 背景 + 青色科学线稿（抛物运动）/ 多色粒子（DNA）/ 粉青箭头（化学平衡）——这已经是现成的"Scivra 产品签名美学"。**homepage 所有"讲科学能做什么"的展示，都应该用这个语言延伸**，不是用卡通插画破功。

### Hero 插画（⚠️ 强烈建议替换）
- 当前路径：`/imgs/hero/student-discovery.png`（1200×630）
- **问题**：FreePik / Shutterstock 式卡通——三个笑脸学生围桌、笔电屏幕画卡通行星/DNA/波形。
- **为什么是致命反 slop**：
  1. 风格与 hero 的 Merriweather 衬线 + 学术 teal 完全断层——像把「大学招生册」和「幼儿园绘本」缝在一起
  2. K12 EdTech 烂大街——PhET、Khan Academy、Brainly 都用过同款卡通，没有 Scivra 识别度
  3. 与下方实验卡片（高级 dark + neon）产生对撞——用户第一眼看到卡通，对"175 个真交互实验"的价值产生质疑
- **替换方向**：真实截图 / 3D lab 可视化 / 科学线稿 hero — 3 个方向 Demo 各做一版示范

---

## 🎨 辅助资产

### 色板（以 theme.css 为准）

```css
/* Light mode */
--primary:          oklch(0.45 0.12 192);  /* Teal · 主色（所有 CTA / link / focus）*/
--primary-foreground: oklch(0.98 0.005 192);
--background:       oklch(0.985 0.002 210); /* 近白 · 略偏冷蓝 */
--foreground:       oklch(0.20 0.02 240);   /* Near-black ink */
--muted:            oklch(0.967 0.0029 264.5);
--muted-foreground: oklch(0.551 0.0234 264.4);
--border:           oklch(0.8717 0.0093 258);

/* 品牌点缀 */
--np-gold:   oklch(0.75 0.15 75);   /* 金色 · hero 下划线、高光 */
--np-green:  oklch(0.60 0.15 145);  /* 成绩 A+ / 成功态 */
--np-navy:   oklch(0.30 0.10 250);  /* 深海军 · dark 态背景 */

/* 学科专色（5 色，每科 hue 唯一）*/
--subject-physics:     oklch(0.55 0.12 250);  /* 蓝 */
--subject-chemistry:   oklch(0.55 0.12 145);  /* 绿 */
--subject-biology:     oklch(0.60 0.10 80);   /* 黄绿 */
--subject-earth:       oklch(0.55 0.10 25);   /* 橙褐 */
--subject-math:        oklch(0.50 0.12 310);  /* 紫 */

/* Neon（Product 面专用）*/
--neon-cyan:   oklch(0.82 0.18 192);
--neon-pink:   oklch(0.65 0.30 330);
--neon-green:  oklch(0.80 0.25 145);
```

**禁用色**：激进紫渐变（`#8B5CF6 → #EC4899` 这类 AI SaaS 烂大街配色）、纯黑 `#000`、Bootstrap 蓝 `#007bff`。

### 字型

```css
--font-heading: 'Space Grotesk';   /* UI heading（但 hero H1 覆盖用 serif）*/
--font-body:    'Space Grotesk';   /* 通篇 body */
--font-serif:   'Merriweather';    /* Hero H1 · 学术引用 · 签名片刻 */
--font-mono:    'JetBrains Mono';  /* 数据值 · 公式 · chapter 编号 */
```

**修订 CLAUDE.md 的错误说法**：body 是 Space Grotesk 不是 Noto Sans。

### 签名细节（120% 做到的那些）

- Hero H1 的 **Merriweather italic 高亮 + 金色下划线 + teal 文字阴影**——这是 Scivra 现在最对的一个细节
- 实验卡片的 **dark navy 缩略图（科学线稿）**——视觉基因，不要丢
- 4 级辉光系统（`--glow-sm/md/lg/xl`）+ hover 上浮 2px
- `data-subject` 属性驱动 5 学科色切换——结构化的品牌一致性
- Dual face：`[data-face="marketing"]` 温和辉光 / `[data-face="product"]` 强辉光沉浸

### 禁区

- ❌ 卡通插画 / stock illustrations（FreePik / Shutterstock / Canva 人物）
- ❌ Emoji 作图标（theme-education.css 里 `.np-navbar-brand::before { content: '📚'; }` 和 `.np-reading-indicator::before { content: '📖'; }` **是历史债，需清理**）
- ❌ 紫色渐变 / 赛博霓虹深黑 `#0D1117`
- ❌ 圆角卡片 + 左 border accent 的 Material slop
- ❌ Logo 放大作 hero

### 气质关键词

**学术 · 克制 · 数据可见 · 科学动感 · 自信不卖萌**

---

## 品牌录入规则（执行纪律）

1. 所有 HTML / React 组件必须**引用** CSS 变量 `var(--primary)` / `var(--np-gold)`，不硬编码 hex
2. Logo 作为 `<Image src="/logo.svg">`，不重画、不放大、不改色
3. 新增 section 插画前自问："这张图去掉会让信息损失吗？"——不损失就不加
4. 动用卡通风格前走**核心资产协议**审批流：这张图的参考品牌是？哪家竞品已经用过？去掉它能否只用排版解决？
5. 任何色相偏离 `theme.css` 变量的新色，**先改 theme.css 再用**——禁止临场 hex

---

## 资产缺口（待补）

- [ ] 真实的 hero 配图（3D lab 截图 / 学生操作实拍 / 数据可视化抽象 hero——3 个方向 Demo 各示范一种）
- [ ] Social Open Graph 卡片（1200×630）替换 ShipAny 默认
- [ ] Favicon SVG 版本（当前只有 PNG 派生）
- [ ] Dark 模式下的 logo 变体（当前 logo 三色在 dark navy 背景上对比不足）
