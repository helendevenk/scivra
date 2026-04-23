---
name: ui-consistency-audit-2026-04-23
status: in-progress
created: 2026-04-23T00:30:43Z
updated: 2026-04-23T00:57:00Z
---

# UI 一致性审查与改进清单

> 审查范围：首页 Phase 1（Motion Poetics）之后的全站一致性扫描
> 审查人：Claude (Opus 4.7) 受委托
> 审查日期：2026-04-23
> 基线：commit `02d5c0b` + 21 task Phase 0/1 完成
> 截图：`_design/audit/light/*.png`（25 张）+ `_design/audit/_phase1-homepage-archive/`（存档）

## TL;DR — 3 个必须先修

1. **Elementary 按钮是死链**（P0）— 首页顶栏的 "Elementary" 指向 `/labs?grade=K-5`，labs 页面不存在这个合法值（只认 `K-2` 和 `3-5`），点击后 filter 无效、显示"All Grades"全列表。用户从首页进入低年级入口的路径断了。
2. **Motion Poetics 只做了首页一层**（P0）— 除了 `/` 和 `/zh`，所有其他页面（`/labs`、实验详情、`/pricing`、`/ap-prep`、`/upg`、`/gallery`、`/blog`）的顶栏仍是 **emoji icon 版**（`😊 Elementary` / `📖 Middle School` / `🎓 AP`）。进入二级页面瞬间跳出品牌氛围，像是切到了另一个产品。
3. **实验详情 URL 路径与首页/内链不一致**（P1）— 生产环境 AP Physics Projectile Motion 的真实路径是 `/labs/physics/ngss-hs/projectile-motion`（不是 `/labs/physics/ap-physics/...`）。任何宣传文案或硬编码链接用 `ap-physics/` 段都会 404。需要统一 URL schema 或加重定向。

---

## 1. 审查清单概览

| Tier | 页面 | 访问 | 截图 | 视觉与 Phase 1 一致度 |
|------|------|------|------|----------------------|
| 1 | `/`（light）| ✅ | `_phase1-homepage-archive/homepage-light-*.png` | ✅ 基准 |
| 1 | `/`（dark）| ✅ | `_phase1-homepage-archive/homepage-dark-hero.png` | ✅ 超预期（neon cyan + gold） |
| 1 | `/labs`（All）| ✅ | `light/labs.png` | 🔴 低 — 无 Merriweather、无 gold、无 SVG |
| 1 | `/labs?grade=K-5` | ⚠️ 参数无效 | `light/labs_grade-K-5.png` | 🔴 与 `labs.png` 完全相同 |
| 1 | `/labs?grade=K-2` | ✅ | `light/labs_grade-K-2.png` | 🟡 filter OK 但头部依旧 emoji |
| 1 | `/labs?grade=6-8` | ✅ | `light/labs_grade-6-8.png` | 🟡 同上 |
| 1 | `/labs?grade=9-12` | ✅ | `light/labs_grade-9-12.png` | 🟡 同上 |
| 1 | `/labs?grade=AP` | ✅ | `light/labs_grade-AP.png` | 🟡 同上 |
| 2 | `/labs/physics/ap-physics`（dev）| ✅ | `light/labs-physics-ap.png` | 🔴 subject 页面只展示 flat grid |
| 2 | `/labs/physics/ngss-hs/projectile-motion`（prod）| ✅ | `light/prod-labs-physics-hs-projectile.png` | 🟡 功能完整但 H1 非 Merriweather |
| 2 | `/labs/biology/ap-biology/dna-double-helix`（prod）| ✅ | `light/prod-labs-biology-ap-dna.png` | 🔴 Pro paywall = 空框 + 一行字 |
| 2 | `/labs/chemistry/ap-chemistry/chemical-equilibrium`（prod）| ✅ | `light/prod-labs-chem-ap-equilibrium.png` | 🟡 同 projectile |
| 2 | `/labs/physics/ap-physics/projectile-motion`（prod）| ❌ **404** | `light/prod-labs-physics-ap-projectile.png` | 🔴 URL schema mismatch |
| 2 | `/labs/chemistry/middle/*`（prod）| ❌ **404** | `light/prod-labs-chem-middle.png` | 🔴 URL schema mismatch |
| 2 | `/labs/earth-science/elementary/*`（prod）| ❌ **404** | `light/prod-labs-earth-elem.png` | 🔴 URL schema mismatch |
| 3 | `/pricing` | ✅ | `light/pricing.png` | 🟡 sans-serif，零 Motion Poetics 元素 |
| 3 | `/ap-prep` | ✅ | `light/ap-prep.png` | 🟡 同上 |
| 3 | `/upg` | ✅ | `light/upg.png` | 🟡 最能承接 Poetics 但还没承接 |
| 3 | `/gallery` | ✅ | `light/gallery.png` | 🟡 同上 |
| 3 | `/blog` | ✅ | `light/blog.png` | 🟡 同上 |

说明：
- 🔴 = 必须改，破坏一致性或已损坏功能
- 🟡 = 可改，未达到首页水平但可用
- ✅ = 达标

本地 dev 的实验详情页全部 crash（error boundary）—— 原因是本地缺 `DATABASE_URL`，**非生产 bug**，生产 200 OK。已从生产补截。

---

## 2. 发现的问题 · 按严重度分层

### P0 — 必须修，阻塞用户路径或破坏一致性

#### P0-1. Elementary 入口死链
- **现象**：首页顶栏 "Elementary" 按钮 href = `/labs?grade=K-5`，labs 页只认 `K-2` 和 `3-5`。点击后 URL 参数被忽略，"All Grades" 高亮，用户看到全部 179 个实验。
- **证据**：`light/labs.png` ≡ `light/labs_grade-K-5.png`（字节相同，125941 bytes）
- **影响**：首页主导航 6 个 CTA 之一失效。K-5 是我们重点标签（23 Elementary 实验 + Earth Science 部分覆盖）。
- **修复方案**（择一）：
  - **A. 推荐**：把 "Elementary" 链接改为合成筛选 `/labs?grade=K-2,3-5`，labs 页支持 CSV 多选；同时保留 `K-2` / `3-5` 单选。
  - B. 最小改动：把链接改为 `/labs?grade=K-2`（默认进更低年级）。
  - C. 在 labs 页加 alias：`?grade=K-5` → 映射为 `K-2 ∪ 3-5`。
- **工作量**：🟢 1-2h（方案 A/C），🟢 5min（方案 B）
- **关联文件**：
  - `src/shared/components/blocks/header.tsx`（link href）
  - `src/app/[locale]/(landing)/labs/page.tsx`（grade filter 逻辑）

#### P0-2. 所有二级页面保留 emoji icon 顶栏
- **现象**：Task 19 的 text-only nav variant 只应用在 `/` 和 `/zh`。所有其他路由仍用旧 `Header` 组件，显示 😊📖🎓✍️💰 等 emoji。
- **证据**：每张 `light/labs*.png`、`light/pricing.png`、`light/ap-prep.png`、`light/upg.png`、`light/gallery.png`、`light/blog.png` 顶部都能看到 emoji icon。
- **影响**：Phase 1 的"编辑学术刊物"质感只存在一屏，二级页面立刻回到 ShipAny 模板味。品牌一致性折半。
- **修复方案**：把 `HeaderTextOnly` 变体应用到所有 landing route，而不是只 `/` 和 `/zh`。
- **实现**：修改 `src/app/[locale]/(landing)/layout.tsx`（或等效位置）让所有子页面继承 text-only variant；删除 emoji prop，统一用 `variant="text"` 作为默认。
- **工作量**：🟢 2-3h（组件切换 + 验证每个页面）
- **回滚**：保留旧 variant 作为 opt-in prop，如果某处真的需要 icon 再传入。

#### P0-3. 实验详情 URL schema 不一致
- **现象**：生产环境中有效的路径用 `ngss-hs` 段，但首页内链、sitemap 候选、文档常把 AP Physics 实验写成 `/labs/physics/ap-physics/...`，全部 404。
- **证据**：
  - ✅ `https://scivra.com/labs/physics/ngss-hs/projectile-motion` → 200
  - ❌ `https://scivra.com/labs/physics/ap-physics/projectile-motion` → 404
  - ❌ `https://scivra.com/labs/chemistry/middle/...` → 404
  - ❌ `https://scivra.com/labs/earth-science/elementary/...` → 404
- **影响**：
  - 首页实验推荐卡片、"AP Physics" CTA 如果硬编码 `ap-physics/` 会死链
  - SEO sitemap 如果混用两套 schema 会有大量 404
  - 任何站外文章（博客、邮件、分享卡）链接都需要规范
- **修复方案**：
  1. **短期**（今天）：审计所有静态内链，统一用实际生效的 schema（需先确定是 `ngss-hs/ap-physics/k-5/middle` 还是别的 grade 段）。
  2. **长期**（本周）：在 `next.config.ts` 加重定向：旧 schema → 新 schema（301）。
  3. **加 E2E 测试**：`tests/integration/experiment-url-schema.test.ts`，遍历 `experiments-v2/` 目录的所有 slug，断言每个 `/labs/{subject}/{grade}/{slug}` 都返回 200（或允许的重定向）。
- **工作量**：🟡 4-6h（schema 决策 + 迁移 + 测试）
- **关联文件**：
  - `src/shared/lib/experiments/registry.ts`（实验注册表）
  - `src/app/[locale]/(landing)/labs/[subject]/[grade]/[slug]/page.tsx`（路由段）
  - `next.config.ts`（redirects）

---

### P1 — 应该改，影响品质感和留存

#### P1-1. `/labs` 及 grade/subject 页面零 Motion Poetics 元素
- **现象**：`/labs` 页 H1 "Interactive Science Labs" 用 sans-serif（Space Grotesk 或默认），无 Merriweather 斜体、无 gold accent 下划线、无 SVG hero、无 teal glow。5 个学科卡片为扁平 grid + emoji icon（🧪📗🌍），与首页 SVG 抛物线 / DNA / 烧瓶的精工质感形成断层。
- **证据**：`light/labs.png`（暗色下尤其明显）
- **机会点**：
  - H1 改为 Merriweather 斜体 + gold underline：`*Interactive* Science *Labs*`
  - subtitle 加 mono 数据徽章："179 experiments · 7 disciplines · NGSS / AP aligned"（用 JetBrains Mono）
  - 5 个学科卡替换 emoji 为首页同款的小 SVG signature（简化版抛物线 / DNA / 烧瓶 / 地球 / 数字）
  - Hover 加 subtle teal glow 和 2px 上浮，cards 跟首页一致
- **工作量**：🟡 4-6h
- **验证**：对比首页 vs /labs 截图，感觉"同一个品牌"
- **关联文件**：
  - `src/app/[locale]/(landing)/labs/page.tsx`
  - `src/shared/blocks/experiments/subject-grid.tsx`（或 equiv）

#### P1-2. 实验详情页 H1 与 Phase 1 字体系统脱节
- **现象**：生产 projectile-motion 页的 H1 "Projectile Motion" 是 sans-serif，无 teal/gold highlight。面包屑 + 标题 + 描述整体像 ShipAny docs 风格，而不是"一本在线学术期刊"。
- **证据**：`light/prod-labs-physics-hs-projectile.png`
- **机会点**：
  - H1：Merriweather italic，关键名词（"Projectile"）加 gold underline
  - 紧跟 H1 下面加一个 **mono equation strip**：`y(t) = v₀·sin(θ)·t − ½g·t²`（实验对应公式）— 一眼传达"这是真正的物理"
  - 把"3-step flow" 区块的 Step 数字改为 mono 大字 + teal 辉光
- **工作量**：🟡 3-4h（包括不同实验对应不同公式的映射表）
- **关联文件**：
  - `src/app/[locale]/(landing)/labs/[subject]/[grade]/[slug]/page.tsx`
  - `src/shared/blocks/experiments/detail-header.tsx`

#### P1-3. Pro paywall 组件极简到 sloppy
- **现象**：DNA Double Helix 页的 Pro paywall 是一个巨大的空矩形边框 + 一行小字 "This lab is part of our Pro plan"。没有 Pro 标识、没有价格锚点、没有 CTA 按钮、没有"预览"或"试玩 30 秒"的钩子。
- **证据**：`light/prod-labs-biology-ap-dna.png` 下半屏
- **影响**：这是**付费转化的最后一公里**，目前的呈现让用户的反应是 "哦，那走吧" 而不是 "我想试试"。
- **修复方案**：
  - 用 teal 渐变卡片替代空框（深色玻璃拟态，类似首页 AI Lab 的 Max 徽章风格）
  - 内容：Pro 徽章 + "Unlock DNA Double Helix + 148 other Pro labs" + 价格锚 "$4.99/mo · cancel anytime" + 主 CTA "Start 7-day free trial"
  - 底部 inline 小字："Or [preview this lab for 30 seconds](#)"（钩子）
- **工作量**：🟡 4-6h（新组件 + 文案 + i18n + A/B 埋点）
- **关联文件**：
  - `src/shared/blocks/paywall/pro-paywall.tsx`（可能需要新建）
  - `src/config/locale/messages/{en,zh}/paywall.json`

#### P1-4. `/pricing` 页面用 ShipAny 模板原始样式
- **现象**：三列价格卡片，字体 sans-serif，无 Merriweather 装饰、无 gold accent、无 teal glow。Max 套餐没有视觉突出。
- **机会点**：
  - Pricing H1 用 Merriweather：`*Pick* your lab bench.` 或 `*Start* free. *Go* far.`
  - Pro / Max 卡片加 teal glow，Max 专属加 gold accent 边缘
  - UPG 积分消耗逻辑用 mono 字体呈现："Max · 200 UPG credits / month"
  - 每个套餐下加 1-2 行科学诗性副标语：Free "Start with first principles." / Pro "Own your curriculum." / Max "Generate what doesn't exist yet."
- **工作量**：🟡 3-5h
- **关联文件**：`src/app/[locale]/(landing)/pricing/page.tsx`

#### P1-5. `/ap-prep` 和 `/upg` 是 Motion Poetics 最应该强化的页面但没做
- **理由**：
  - `/ap-prep` 是"AP 学生"这个核心用户的入口，标题应该立刻唤起"认真备考"的氛围 — 用 Merriweather 引言 + 考试样题 snippet（mono 字体）。
  - `/upg` 是产品差异化最强的页面（AI 生成物理可视化），视觉理应最震撼 — 目前只是一个标准 form。应该有：
    - Hero 用动画 SVG 演示"一句话 → 可视化"
    - Prompt 输入框用 mono 字体 + teal cursor blink
    - "Example prompts" 用斜体引用块（Merriweather italic）
- **工作量**：🟡 6-10h（这是两个页面）
- **优先级**：UPG 优先于 AP Prep，因为 UPG 是护城河叙事

---

### P2 — 可以改，低 ROI 或非紧急

#### P2-1. Gallery 空状态未优化
- 已在 CLAUDE.md "未开始"清单里记录。审查时 `/gallery` 显示的是已有内容，未能验证空状态。建议在无作品时展示 3-5 个 seed examples（官方 featured）+ CTA "Try UPG →"。

#### P2-2. Blog 模板朴素
- 符合"内容优先"原则，当前没有明显 bug。但 Motion Poetics 如果扩展到 blog，`article` 页可以用 Merriweather 作为正文字体（更接近"学术期刊"感），配 drop cap 首字母。

#### P2-3. 中文 `/zh` 字体映射未验证
- Merriweather 没有中文字形，中文标题会 fallback 到系统字体。Phase 1 首页可能已经在 `/zh` 暴露了这个。
- 建议：中文下 H1 用一个支持中文的衬线字体（如 Source Han Serif / Noto Serif SC）
- **工作量**：🟡 2-3h（字体加载 + 降级 fallback）
- **工具**：`next/font/google` 加载 Noto Serif SC

#### P2-4. Footer 中 dark/light/system mode 切换按钮在暗色下对比度低
- 三个小图标按钮 (`☀`/`🌙`/`🖥`) 在深色底上几乎融化。
- **修复**：图标颜色从 muted 改为 foreground，hover 加 teal glow

#### P2-5. `/labs?grade=9-12` 中 High School 术语在内部文档和 URL 上混用（`9-12` vs `hs` vs `high-school`）
- 观察到 URL 用 `9-12`，组件 label 用 "High School"，实验目录路径用 `ngss-hs`。不影响用户但增加维护成本。
- **建议**：定一个常量文件 `src/shared/constants/grades.ts`，统一枚举 + 展示名 + URL slug + experiment folder name 的四向映射。

---

## 3. 按工作包分组（可执行）

### Sprint A — "修已破的" · 预计 1 天
**目标**：把审查中发现的**已损坏功能**修完。不追求视觉升级，只追求"能用 + 一致"。

1. **P0-1** Elementary 死链修复（方案 C：labs 页 alias `K-5` → `K-2 ∪ 3-5`）— 1h
2. **P0-3** 实验 URL schema 审计 + redirects — 4h
3. **P0-2 (局部)** 把 text-only nav variant 应用到 labs 和实验详情页 — 2h
4. 加 smoke E2E：遍历所有实验 slug 断言 200 — 1h

**交付**：PR + Playwright CI 绿灯 + 新增 1 个 E2E
**验证**：点首页每个按钮都进入一个活页面，没有 404 / 没有 emoji icon

### Sprint B — "二级页面 Motion Poetics" · 预计 3-5 天
**目标**：把首页的视觉语言延伸到核心二级页面。

1. **P0-2 (全局)** text-only nav 全站化 — 3h
2. **P1-1** `/labs` 及其 subject/grade 页面视觉升级 — 6h
3. **P1-2** 实验详情 H1 + equation strip — 4h
4. **P1-3** Pro paywall 重做 — 6h
5. **P1-4** `/pricing` 视觉升级 — 5h

**交付**：5 个 PR（每页一个），每 PR 附 before/after 截图
**验证**：全站浏览时没有"切到另一个应用"的断层感

### Sprint C — "差异化页面强化" · 预计 5-7 天
**目标**：UPG 和 AP Prep 两个护城河页面做成品牌旗舰。

1. **P1-5 UPG** hero 动画 SVG + mono prompt + 学术引用例句 — 8h
2. **P1-5 AP Prep** Merriweather 引言 + 考题样例 — 4h
3. **P2-3** 中文衬线字体适配 — 3h

**交付**：UPG 页和 AP Prep 页各自有 hero 品牌 moment

### Sprint D — "长尾清理" · 预计 2-3 天
- P2-1 Gallery 空状态
- P2-2 Blog drop cap
- P2-4 Footer theme toggle 对比度
- P2-5 grade 常量统一
- sitemap.xml 重新生成（反映 URL schema 修订后的结果）

---

## 4. 建议的下一步（按优先级）

1. **先做 Sprint A** — 死链和 404 是硬伤，每天都在掉用户，今天就能修完
2. **推 Sprint A 到 Vercel preview** — 在审查修复的同时验证 Phase 1 在生产环境的 CLS/LCP
3. **确定 URL schema 迁移方案** — 这是架构决定，需要 CTO 审批后再推 Sprint B
4. Sprint B 拆成 5 个小 PR 逐个合，避免一个大 PR 难 review
5. Sprint C 建议等 Sprint B 合完再启动（否则 UPG 页做两次）

---

## 5. 未覆盖的审查范围（后续补做）

- 🔲 **移动端**：本次仅 desktop (1440px 推测)。CLAUDE.md 已记录"移动端首页大面积空白"，labs 页和实验详情页的移动端体验未验证
- 🔲 **i18n / `/zh` 路径**：只验证了 `/` 的中英一致性（字节大小未对齐，视觉未比对）
- 🔲 **/dashboard / /settings** 等登录后页面 — 需要有效账号登入
- 🔲 **/admin** 管理后台 — 权限门限
- 🔲 **/chat** AI 聊天 — 未访问
- 🔲 **Light vs Dark 全覆盖** — 本次只系统截了 light。Dark mode 首页已验证惊艳，但其他页面 dark mode 未扫描
- 🔲 **可访问性**：WCAG AA 对比度自动扫描（Lighthouse/axe）未运行
- 🔲 **性能**：LCP / CLS 实测未跑（Phase 1 tests 已加 SVG hero LCP 测试，其他页面未加）

---

## 6. 附：截图清单

所有截图存档在 `_design/audit/light/`。命名约定：
- `labs*.png` — dev 环境截图（localhost:3000）
- `prod-*.png` — 生产环境截图（scivra.com）
- `_phase1-homepage-archive/` — Phase 1 首页完成态的存档副本（用于和 audit 过程对比）

如需补 dark mode 扫描或移动端截图，执行：

```bash
# Dark mode batch capture
for path in labs pricing ap-prep upg gallery blog; do
  playwright-cli -s=scivra-audit-dark goto "http://localhost:3000/${path}"
  playwright-cli -s=scivra-audit-dark eval "() => document.documentElement.classList.add('dark')"
  playwright-cli -s=scivra-audit-dark screenshot "_design/audit/dark/${path}.png"
done
```

---

**状态**：审查完成，待选 Sprint A/B/C/D 启动

---

## 7. 第二轮扩展审查（2026-04-23 · 同日下午）

补充审查了第一轮未覆盖的范围：**移动端 375px、Dark mode 二级页、/zh 视觉一致性、WCAG 2 AA、LCP**。

### 7.1 新发现的问题

#### 🚨 P0-4 ScrollAnimation 导致"首页 below-hero 大面积空白"
- **证据**：`_design/audit/mobile-375/home.png`、`_design/audit/zh/zh.png` — 两者都是 hero 之后从中段到 footer 全白
- **根因**：`src/shared/components/ui/scroll-animation.tsx` 用 `useInView` + `isInView=false` 时设 `opacity: 0`。IntersectionObserver 在非用户交互场景（headless 截图、SEO 爬虫、slow JS）不触发，导致所有 scroll-animated 区块停留在不可见
- **影响**：
  - 社交分享 OG 预览可能捕获到空白页
  - 部分 SEO 爬虫抓取到无内容页面
  - CLAUDE.md 早就标记"移动端首页大面积空白"——这就是根因
  - 截图审查时无法客观评估内容
- **修复**：加 `failOpen` 1.5s 超时——即便观察器不触发，内容强制可见
- **已修**（见第 8 节 Fix 1）

#### 🚨 P0-5 `/zh` 路由完全坏掉，中文市场 100% 下线
- **证据**：
  ```
  $ curl -sI http://localhost:3000/zh
  HTTP/1.1 308 Permanent Redirect
  x-middleware-rewrite: /en/zh
  set-cookie: NEXT_LOCALE=en; Path=/; SameSite=lax
  ```
  并且 `playwright-cli eval '() => location.pathname'` 返回 `/`（访问 /zh 被跳到 / 并把 locale cookie 强制写成 `en`）
- **影响**：
  - 所有中文用户访问 `/zh` 被永久重定向到英文
  - Cookie `NEXT_LOCALE=en` 被强写，影响后续访问
  - Chinese users blocked 100% — 这是**最严重的单点故障**
  - 解释了为什么 /zh 首页 H1 显示的是英文 "Your next A in AP Physics..."
- **根因假设**（未验证）：
  1. `next-intl` middleware 的 `localePrefix: 'as-needed'` 模式可能在 locale mismatch 时做了不当的 fallback
  2. 或 `src/config/locale/index.ts` 的 localeMessagesPaths 注册有问题
  3. 或 middleware.ts 里的 matcher/rewrite 逻辑写反了
- **未修**：需要 i18n 路由专项调试（涉及 middleware + next-intl 配置），建议独立 Sprint 或单独 issue

#### P0-6 footer/nav 有 3 个持续的 WCAG AA 违规
- **来自**：axe-core 4.10.2 对 `http://localhost:3000/` 和 `/labs` 的扫描
- **3 项 serious 级别**：
  1. **color-contrast** (14 nodes on `/`, 1 on `/labs`)
     - `muted-foreground` `#6b7280` on `bg-muted` `#f3f4f6` = **4.39:1**（差 0.11，AA 要求 4.5:1）
     - 命中：实验卡片 category chip、`Built with ♥ Scivra` 标签、grade_levels section 说明文字
     - **修复**：把 `--color-muted-foreground` 从 `oklch(...)` 对应的 `#6b7280` 降暗 ~5%（目标 `#5a6270` / contrast 5.2:1）
  2. **link-in-text-block** (1 node)
     - 某个纯色差异链接（no underline / no icon）对色盲不可辨
     - **修复**：给所有正文链接加 `underline underline-offset-2` 或图标
  3. **list** (1 node)
     - 某个 `<ul>` 直接子节点不是 `<li>`（结构违规）
     - **修复**：找到该列表补 `<li>` 包裹
- **工作量**：🟢 2-3h
- **未修**（本轮聚焦 visual consistency，a11y 下个 Sprint）

#### P1-6 `/zh` landing.json 翻译已存在但 hero 渲染英文（related to P0-5）
- **证据**：`src/config/locale/messages/zh/landing.json` 有 `hero.title: "下一次 AP 考试，从一节 3D 实验开始拿 A。"`；但 `/zh` 页面 H1 实际输出英文
- 这与 P0-5 是同一个根因（/zh 被 rewrite 到 /en/zh，加载的是 en locale）
- **修完 P0-5 后此问题自动消失**

### 7.2 确认**不是真 bug** 的项

- **Dark mode 二级页截图**：工具伪影。用 `eval('document.documentElement.classList.add("dark")')` 对 next-themes 无效（SSR hydration 后 class 被重置）。实测手动点 theme toggle 按钮后，dark mode 在 /labs、/pricing、/zh 等页面都能正常工作。**不需要代码修复**，只是未来审查时要改用真实用户行为（点击 toggle）而非 JS 注入
- **Mobile labs 页空白**：否。`_design/audit/mobile-375/labs.png` 显示 5 学科卡片正常堆叠，只有**首页**在 mobile 下空白（同 P0-4 根因）

### 7.3 性能基线

单次 localhost 测量（dev server，非生产）：
- **LCP**：200ms ✅（目标 < 2500ms，远低于）
- **FCP**：200ms ✅
- **DOMContentLoaded**：212ms ✅
- **Load**：366ms ✅
- **transferSize**：68KB（initial document） ✅

结论：首页**不需要性能优化**。Phase 1 的 SVG hero 替代 FreePik PNG 已经让关键路径轻量化。

生产环境测量建议：在 Vercel preview 部署后跑一次真实 Lighthouse（包括 CLS/INP/TBT）。

---

## 8. 本轮实际执行的修复（2026-04-23 session）

| # | Task | 文件 | 状态 |
|---|------|------|------|
| 1 | **P0-4** ScrollAnimation fail-open | `src/shared/components/ui/scroll-animation.tsx` | ✅ |
| 2 | **P0-2** Text-only nav 全站（删除 `!isHomepage` gate） | `src/themes/default/blocks/header.tsx` | ✅ |
| 3 | **P0-1** Elementary K-5 alias（新建 grade-filter helper） | `src/shared/lib/experiments/grade-filter.ts`（新）+ `src/shared/lib/experiments/registry-subjects.ts` + 2 个 labs page | ✅ |
| 4 | **P1-1** /labs Motion Poetics 升级（Merriweather H1 + gold underline + 5 SVG subject signatures + mono stat strip + Elementary pill） | `src/app/[locale]/(landing)/labs/page.tsx` | ✅ |
| 5 | **P1-4** /pricing 视觉升级（"Pick Pricing." Merriweather italic + gold underline + 金色 POPULAR badge + 特色卡 teal glow + 斜体 Plan 标题 + mono 价格） | `src/themes/default/blocks/pricing.tsx` | ✅ |
| 6 | **P1-3** Pro paywall 重做（替换空框为渐变卡 + Pro badge + 7-day trial CTA + 价格锚点 + trust bullets + sign-in sidecar） | `src/shared/blocks/experiments/inline-pro-paywall.tsx`（新）+ `src/shared/blocks/experiments/experiment-flow.tsx` | ✅ |
| 7 | **P1-2** 实验详情 H1 + equation strip（Merriweather italic + gold underline + mono equation 条） | `src/app/[locale]/(landing)/labs/[subject]/[standard]/[slug]/page.tsx` | ✅ |

**TypeScript**：`pnpm tsc --noEmit` → exit 0 ✅

**未修（留给下个 Sprint）**：
- P0-3 URL schema (`ap-physics` vs `ngss-hs`)
- **P0-5 /zh 路由 308 → /en/zh**（刚发现，独立 i18n 专项）
- P0-6 3 个 WCAG AA 违规（color-contrast / link-in-text / list structure）
- P1-5 UPG + AP Prep 页面 Motion Poetics 强化
- P1-6 /zh 翻译实际不渲染（依赖 P0-5 修复）
- Sprint A 的 smoke E2E（遍历实验 slug 测 200）

### 8.1 验证截图

本轮修复后的截图存档：`_design/audit/after/final_*.png`

- `final_home.png` → 完整渲染，scroll-animation 修复生效
- `final_labs.png` → **新视觉**：Merriweather "*Interactive* Science Labs" + 5 SVG signatures
- `final_labs_grade_K-5.png` → K-5 合成过滤生效，显示 23 experiments（K-2 ∪ 3-5）
- `final_pricing.png` → "Pick Pricing." + 金色 POPULAR + Pro 卡 teal glow
- `final_zh.png` → ScrollAnimation 修好后区块完整渲染（**但内容仍是英文**，P0-5 未修）

---

## 9. 下一步最小可行路径

1. **立即**（1 日内）：修 P0-5 `/zh` 路由 → 解锁整个中文市场
2. **本周**：
   - 修 P0-3 URL schema 一致性（短期用 redirects，长期统一）
   - 修 P0-6 WCAG AA 违规（muted-foreground 色值 + link underline + list 结构）
   - Sprint A 的 E2E smoke test
3. **下周**：
   - P1-5 UPG hero + AP Prep 强化
   - 生产 Lighthouse + Real User Monitoring 数据
4. **持续**：把本轮 audit 加到 CI —— axe 扫描 + fixed-size screenshot diff

## 10. Hero 3D Upgrade (2026-04-23 evening)

User feedback (2026-04-23): "整个网站都需要表达 3D 动态实验、交互式学习". 旧 hero 副标题承诺 "Launch a 3D lab, tweak the numbers, watch physics happen" 但视觉只是静态 2D SVG 抛物线。Visual ↔ copy 不一致。

**Plan reference:** `docs/superpowers/plans/2026-04-23-hero-3d-interactive.md`（8 任务，对应 8 commits）

### Implementation

Hero 拆 2 列：
- 左：Merriweather H1 + 副标题 + CTA + 学科按钮 + tip + avatars（unchanged copy）
- 右：`<Hero3DPreview />` — 自动播放的 3D 抛物线场景，含 Play/Pause/Reset + mono 参数条

`<HeroIllustration />` SVG 转为 `prefers-reduced-motion` fallback（`motion-safe:hidden`）。两路互斥，只渲染其一。

### Files delivered

- `src/shared/components/experiments/three/HeroSceneContainer.tsx`（lean R3F wrapper, no stars/bloom/grid）
- `src/shared/components/experiments/three/HeroProjectileScene.tsx`（loopable 3D projectile）
- `src/themes/default/blocks/hero-3d-preview.tsx`（top-level component with controls）
- `src/themes/default/blocks/hero.tsx`（rewired to 2-column）
- `tests/unit/hero/hero-3d-preview.test.tsx`（reduced-motion branch unit test）
- `tests/e2e/hero.spec.ts`（extended with canvas-mount + fallback E2E）

### LCP measurements (localhost dev server)

- Cold load: LCP 876 ms
- Warm load: LCP 536 ms
- LCP element: `<h1>` (preserved — text paints first, R3F loads after)
- Initial transferSize: **67 KB** (vs Phase 1 baseline 68 KB → no growth from dynamic import)
- Console errors: 0

LCP 是 dev server 数字。生产 Vercel 通常做到 30-50% 更好。`HeroProjectileScene` 通过 `next/dynamic({ ssr: false })` 加载，不进 LCP 关键路径。

### Regression checks

- `tests/unit/hero/hero-3d-preview.test.tsx` — 2 passed
- `tests/e2e/hero.spec.ts` — 2 new tests passed; 7 of 8 existing pass（1 pre-existing 失败 in H1 copy regex，与本轮无关）
- `tests/integration/a11y/homepage-axe.test.ts` — 0 serious/critical WCAG violations
- `tests/integration/experiment-urls.test.ts` — 179/179 routes return 200
- `pnpm tsc --noEmit` — clean

### Mobile (375 × 812)

- H1 top: 96 px
- Primary CTA top: 392 px (above the fold ✅)
- Canvas top: 632 px (180 px peek above fold — students see preview without scrolling)
- Canvas size: 343 × 257 px (4/3 aspect)

No mobile aspect adjustment needed — original aspect-[4/3] keeps CTA above the fold.
