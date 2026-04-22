---
name: homepage-visual-overhaul
status: phase-0-complete
created: 2026-04-22T03:37:27Z
updated: 2026-04-23T03:23:00Z
---

# Scivra Homepage Visual Overhaul（v3 · 双审后最终版）

> **v3 vs v2 精修**（基于第二轮 plan-eng-review + codex）：精细化 14 条实施漏点（事件数对齐 / SVG 改 CSS animation / Lighthouse 3 次采样 / seo-audit 挂 CI / header icon scope 澄清 / archive 路径 / Phase 0 承认"微视觉变化"）。战略不变。
> Review status: **v3 = 终稿，待用户确认 → writing-plans 拆任务 → 执行**

> **v2 vs v1 核心变化**：scope 从「tri-face 系统 + kids 子面 + editorial 触点 + canvas 动画 + A/B flag」收紧成「**只做首页主视觉替换 + 埋点**」。
> 其余（Kids face / Editorial /pricing / Canvas 动画 / 流量分桶）降级为显式「**Phase F 决策点**」——由首页替换上线 14 天的真实指标决定是否做。
>
> 指导原则：Codex 原话「先做一件事：主页视觉替换，验证品牌方向和性能不回退」。

---

## 0 · v1 双审要点 + v2 响应

| v1 被质疑 | v2 响应 |
|---|---|
| **Tri-face 过度设计**，把「移除插画」升级成「四套视觉系统」 | ✂️ 砍掉 Kids face + Editorial face，回归单面 marketing。Kids/Editorial 成为 Phase F 决策点 |
| **Canvas hero 高风险低必要性**（mobile fallback / reduced-motion / cleanup / DPR / visibility pause / 伪约束 150 行）| 🔄 Phase 1 默认**静态 SVG hero**（抛物线 + 粒子散点 + glow + Merriweather italic）。Live canvas 降为 Phase 1 可选增强；若做则必须单独立项验证 |
| **Fake telemetry HUD 教育产品信任风险** | ✂️ 去掉随机抖动 HUD。保留一行小字**真实示例**参数，明确标注 `Example input · v₀ = 42 m/s / θ = 45°`，不伪装 live |
| **`NEXT_PUBLIC_HOMEPAGE_V2` 不是流量分桶** | ✂️ 去掉 A/B 分桶。采用**直接替换 + git revert 回滚**策略。加**埋点基线采集**到 Phase 0（否则连「指标是否回退」都无法判断）|
| **14 天 K12 SaaS 流量跑不出显著性** | 🔄 改为「14 天**趋势**观察」而非 A/B 显著性；设定 guardrail 回滚阈值（指标跌 >15% 触发 revert）|
| **字体新增 Fraunces + DM Sans 不必要** | ✂️ Phase 1 不加新字体。保持现有 Merriweather + Space Grotesk + JetBrains Mono。Fraunces/DM Sans 仅在 Kids face 真正立项时再加 |
| **searchParams-based face switch FOUC / Next App Router 路由状态难** | ✂️ 去掉 face 路由切换逻辑。主站单面，不需要切 |
| **Phase 0 自相矛盾**（landing.json hero.image null vs 零视觉变化）| ✅ Phase 0 明确分割：emoji 清理 + brand-spec 固化 + 埋点；**不动** landing.json。视觉变化发生在 Phase 1 合并时 |
| **CLAUDE.md 不应是品牌事实源** | 🔄 `docs/design/brand-spec.md` 成为品牌 Single Source of Truth。CLAUDE.md 引用它，不再复述。Owner: FE lead（用户）|
| **brand-spec 没有 owner/更新规则会漂移** | ✅ v2 附录 A 明确 owner + 更新触发器 + 与 theme.css tokens 的双向绑定规则 |
| **19 files 超复杂度阈值** | ✅ v2 主实施面**≤ 8 个文件**（符合 plan-eng-review 的 smell threshold）|
| **Demo 视觉 diff ≤15% 是审美伪装测试** | ✂️ 去掉 demo diff 对比。代以 Playwright **页面级快照回归** + Lighthouse CI + 人工 design review |
| **SEO 风险被低估** | ✅ Phase 1 完成前必须跑：canonical / JSON-LD / hreflang / H 层级 / OG card 5 项 audit 通过才合并 |
| **时间线 18.5 天低估** | 🔄 收紧后 v2 主线 **6-8 人日**（Phase 0-2）。Phase F 未来决定时独立估算 |

---

## 1 · v2 目标（什么算成功）

**一个首要目标**：把「FreePik 卡通插画 + iconography slop」替换成**体现 Scivra 品牌的首页**（方向 V2 Motion Poetics 的**静态版本**），14 天指标不回退。

### 验收标准

| 类别 | 标准 | 测量 |
|---|---|---|
| 视觉 | FreePik 卡通下架 · emoji icons 清理 · hero 有科学感识别度 | 人工 design review（用户 + 1 外部）|
| 品牌 | `brand-spec.md` 成为 SSOT；theme.css 与 spec 同步 | 代码 grep：hex 硬编码数 → 0 |
| 性能 | Lighthouse 性能 **不低于当前基线**（先测基线再说目标值）| Lighthouse CI on main + Vercel PR preview |
| SEO | canonical/JSON-LD/hreflang/H 层级/OG card **不回退**（只 PASS/FAIL，不承诺"改进"）| `scripts/seo-audit.mjs`（Phase 0 新建，PR CI 跑）|
| 指标 | Hero CTA CTR / scroll 50% / bounce rate **趋势不回退**（跌 >15% 触发 revert）| Vercel Analytics + 新埋点 |
| 可访问性 | WCAG 2.1 AA 通过（axe-core 自动）| CI |
| i18n | en + zh 双语首页所有 section 渲染一致 | Playwright 截图 pair |

### 非目标（显式，不要越界）

- ❌ Kids face / Elementary 子面（→ Phase F1）
- ❌ Editorial /pricing + /blog 改造（→ Phase F2）
- ❌ Canvas live 动画（→ Phase F3，可选）
- ❌ 新字体引入（Fraunces / DM Sans）
- ❌ A/B 流量分桶
- ❌ Logo 重设计
- ❌ 色相大改
- ❌ /pricing / /blog / /docs / /experiments / /upg / /gallery 任何页面

---

## 2 · 方案设计（v2 收紧）

### 2.1 · 改造原则

- **单面（marketing）主页**：复用现有 `data-face="marketing"`，不扩展 face 系统
- **静态优先**：Hero 用静态 SVG + CSS transition，不用 canvas；如需 canvas 再立 Phase F3
- **增量 props**：`landing.json` schema 用 optional field 扩展，向后兼容
- **先度量再优化**：Phase 0 前置埋点，Phase 1 替换前跑 Lighthouse baseline

### 2.2 · 路线图

```
Phase 0 · Foundation + Baseline    (1 天)    → 清理无争议 + 量化现状
Phase 1 · Homepage Replacement     (4-5 天)  → 首页主视觉替换
Phase 2 · Observation + Gate       (14 天)   → 观察指标，决定 Phase F
                                                      ▼
Phase F1 · Kids face               (TBD)     → 触发条件：首页不回退 + Elementary 流量占比 ≥10%
Phase F2 · Editorial /pricing      (TBD)     → 触发条件：/pricing 转化需要提升 + 资源可投入
Phase F3 · Canvas live hero        (TBD)     → 触发条件：静态 hero 上线且想再上一层
```

每个 Phase F 在 Phase 2 后独立评估，**不在本计划 scope 内**——避免重蹈 v1 覆辙。

---

### 2.3 · Phase 0 · Foundation + Baseline（1.5 天 · 修订）

**目标**：清理无争议的 slop + 固化品牌 SSOT + 前置埋点（方案已决定） + baseline 量化。

**对 codex v2 #1 的澄清**：删除 emoji `::before` 是**可接受的微视觉变化**（图标消失，不阻断布局）。不再承诺"零视觉变化"，改为"可接受微变 + 人工 review 过一遍"。

#### 埋点方案（v3 **决定**，不再挂 Open Question）

**方案：Vercel Analytics（custom events）+ 自建 `/api/analytics/event` fallback 双写**
- 理由：Scivra 已部署 Vercel，Analytics 免费版支持 custom events；fallback 防 ad-blocker
- Client helper: `src/shared/lib/analytics/track.ts`（统一 `track(eventName, payload)`，内部 `va.track()` + `fetch('/api/analytics/event')` 双写）
- Server: `src/app/api/analytics/event/route.ts`（POST {event, payload}，写入 Upstash Redis 24h 保留 + Sentry breadcrumb）

#### 事件清单（v3 **准确数 6 个**）

| # | Event name | Trigger | Payload |
|---|---|---|---|
| 1 | `hero_cta_click` | Hero 主 CTA `Try Your First Experiment` 点击 | `{ variant: 'primary' \| 'secondary', locale }` |
| 2 | `grade_tile_click` | Hero 下方 4 学科 pill 点击 | `{ grade: 'K-5' \| '6-8' \| ..., locale }` |
| 3 | `experiment_card_click` | Experiments section 3 张卡点击 | `{ experiment_id, subject, grade, locale }` |
| 4 | `scroll_depth_25` | 滚动到页面 25% | `{ locale }` |
| 5 | `scroll_depth_50` | 同 50% | `{ locale }` |
| 6 | `scroll_depth_75` | 同 75% | `{ locale }` |

#### 改动清单（v3 · 7 files · 含交付物）

| 文件 | 动作 | 视觉影响 |
|---|---|---|
| `docs/design/brand-spec.md` | 从 `_design/brand/` 搬入 + 加 `Owner: FE lead / Update triggers: ...` frontmatter 段 | 无 |
| `src/config/style/theme-education.css` | 删除 `.np-navbar-brand::before { content: '📚' }` + `.np-reading-indicator::before { content: '📖' }` —— **先 `grep -r 'np-navbar-brand\|np-reading-indicator' src/` 确认使用点并人工 review** | 小（emoji 消失）|
| `src/shared/lib/analytics/track.ts`（**新建**）| Vercel Analytics + fallback 双写 helper | 无 |
| `src/app/api/analytics/event/route.ts`（**新建**）| fallback 端点（已在 redis + sentry stack 复用）| 无 |
| `scripts/seo-audit.mjs`（**新建**）| 输出 PASS/FAIL：canonical 存在 / JSON-LD 校验 schema.org / hreflang 双语 pair / 单一 H1 / OG card 五元素完整 | 无 |
| `scripts/lighthouse-baseline.mjs`（**新建**）| 跑 **3 次**（固定 Vercel preview URL + 移动 + 桌面），取每指标中位数，输出 `docs/baselines/homepage-YYYY-MM-DD.json` | 无 |
| `CLAUDE.md` | UI 设计方向章节精简为 "见 `docs/design/brand-spec.md`" 指针——**可选**，不阻塞 Phase 1 | 无 |

**删除的 v2 Phase 0 项**：CLAUDE.md 修订变可选（解 codex v2 #14）。

#### 成功标准

- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` 全绿
- 线上首页人工 review 无布局破坏（emoji 图标消失是预期的视觉变化）
- `pnpm tsx scripts/lighthouse-baseline.mjs` 输出 `docs/baselines/homepage-YYYY-MM-DD.json`（3 次中位数，移动+桌面）
- 6 个埋点事件可在 Vercel Analytics Dashboard + `/api/analytics/event` log 观测
- SEO audit 输出 5 项全 PASS
- seo-audit 挂到 `.github/workflows/ci.yml` 的 `pull_request` trigger（PR 改 `src/app/**` 时自动跑）

#### 回滚（v3 明示）
- 埋点：feature flag `ANALYTICS_CUSTOM_EVENTS=0` 关掉
- emoji 删除：`git revert`
- seo-audit CI 失败：就地修，不 revert

---

### 2.4 · Phase 1 · Homepage Replacement（4-5 天）

**目标**：首页 `/` 的 4 个**关键 block** 替换成 V2 Motion Poetics **静态版本**。其他 block（testimonials / faq / footer）**保持不动**。

#### 改造清单（≤ 8 文件）

| # | 文件 | 动作 | 依据 |
|---|---|---|---|
| 1 | `src/themes/default/blocks/hero.tsx` | 替换内部实现：静态 SVG hero（下方详述）+ Merriweather italic H1 + teal primary CTA + gold underline highlight。删除 `image` / `image_invert` 支持，删除 `section.show_avatars` 渲染路径（保留 props for i18n 兼容）| V2 demo hero 的静态版 |
| 2 | `src/themes/default/blocks/hero-background.tsx` | 改为静态 SVG（取消当前 canvas 预设）| 取消 v1 的 canvas 动画 |
| 3 | `src/themes/default/blocks/header.tsx` | **仅针对首页路由（/ ）**：在 Header 内通过 `usePathname()` 判断，如果是 `/` 或 `/zh`，渲染纯文字导航变体；其他路径（dashboard / experiments / settings）保持现状 icon 版本。*不改全站 header 视觉* | Codex v2 #8：Header 共享组件，不越界 |
| 4 | `src/themes/default/blocks/experiment-showcase.tsx` | 缩略图从 PNG 换成 **inline SVG 科学线稿**（复用 V2 demo 的 3 张：抛物线 / DNA / 化学平衡）| 利用宝藏资产 |
| 5 | `src/config/locale/messages/en/landing.json` | Hero.image 设为 null（FreePik 下架）+ 小微文案调整（确认 "Try Your First Experiment" 等 CTA 文案）| 与视觉对齐 |
| 6 | `src/config/locale/messages/zh/landing.json` | 同步 en 的改动 | i18n 完整性 |
| 7 | `public/imgs/hero/student-discovery.png` + `-dark.png` | **从 public 删除**（`git rm`）——git 历史已是备份，public 目录下的 archive 仍会被部署暴露。恢复通过 `git checkout <hash> -- <path>` | Codex v2 #9 |
| 8 | `src/themes/default/blocks/hero.test.tsx`（**新建/扩展**）| 快照测试 + 埋点触发单测 + 空 props 兼容性 | Test review 要求 |

#### Hero 静态 SVG 设计规格（v3 · 用 CSS animation 替代 SVG SMIL）

**构成**（单张 inline SVG + 外层 CSS animation，可 SSR，无 JS）：
- 背景：现有 light `--bg`（暖白），hero section 内层再加一个径向 cyan glow radial gradient（透明度 0.08）
- 一条**主抛物线**：粗 3.5px stroke `oklch(var(--primary) / 0.85)`，`stroke-dasharray: 1200; stroke-dashoffset: 1200;` 初始不可见
- **用 CSS `@keyframes draw { to { stroke-dashoffset: 0; } }` + `animation: draw 600ms cubic-bezier(.4,0,.2,1) forwards;`**（不是 SVG `<animate>`——Safari 15 SMIL 有 bug；CSS animation 原生支持 `prefers-reduced-motion` 通过 `@media` 关掉）
- **12 个散点**：半径 2px，cyan，静态分布在抛物线周围，**不动**
- **45° 角标 + 速度矢量箭头**：纯静态 SVG path
- 右下角一行极小 mono caption：`Example · v₀ = 42 m/s · θ = 45° · g = 9.81 m/s²`——**明确标注 Example，不伪装 live**
- `prefers-reduced-motion`：通过 `@media (prefers-reduced-motion: reduce) { .hero-svg-path { animation: none; stroke-dashoffset: 0; } }` 直接显示终态
- 性能预算：**单文件 SVG + CSS ≤ 5KB gzip**（Phase 1 合并前脚本实测，未达标阻止合并），零 JS，LCP 元素仍是 H1 Merriweather 文字

#### 文案决策（v1 Open Question 3）

- H1：**`The Experiments Your Textbook Can't Show You`**（保留线上现版，SEO 和已有搜索流量安全；只调字体为 Merriweather italic + gold underline "Can't Show"）
- 选这个而不是 "Science, in motion." 的原因：SEO 已有排名 + 线上实测文案的 CTR 是已知量

#### 成功标准

- Lighthouse 性能 **不低于 baseline**（Phase 0 记录）
- SEO audit 5 项全 PASS
- en + zh 双语 Playwright 快照 pair 对比无 regression
- 人工 design review 确认品牌识别度提升（对比 `_design/demos/dir2/` 作为意图参考）
- 4 个新埋点在首页事件可观测
- A11y axe-core 通过

#### 风险 + 对策

| # | 风险 | 对策 |
|---|---|---|
| R-01 | Hero SVG 在 dark 模式下 color 失调 | 测试前验证 dark + light 两个截图 |
| R-02 | CTA 文案微调导致 i18n 断键 | 新增/改 key 必须 en+zh 同步 commit |
| R-03 | SEO 因 H 层级变化回退 | Phase 0 的 seo-audit 脚本在 PR CI 跑 |
| R-04 | 快照测试 baseline mismatch 阻塞 merge | Phase 0 先用 `pnpm test -u` 建立新 baseline，Phase 1 合并时 snapshot 一次性更新 |
| R-05 | Analytics 埋点在 dev 环境被 ad-blocker 挡 | 埋点用 Vercel Analytics + 自建 `/api/analytics/event` fallback（Phase 0 提供，不是 Phase 1 新增）|

---

### 2.5 · Phase 2 · Observation + Phase F Gate（14 天）

**目标**：上线后**不动手 14 天**，观察指标，决定 Phase F 走向。

#### 每日检查清单
- Vercel Analytics：Hero CTA CTR / bounce rate / scroll depth
- Sentry：新 block 是否有新报错
- Core Web Vitals：LCP / CLS / INP

#### Guardrail（v3 · 人工 review，不是自动 revert）

**codex v2 #7 澄清**：14 天 K12 流量跑不出显著性，>15% 波动可能只是样本抖动。v3 的正确做法——

- 指标**首次**触发阈值 → 触发人工 review meeting（不立即 revert），同时 2-3 天观察是否回归
- 人工评估：是样本波动 / 埋点问题 / 还是真实回退？
- 如 72h 内持续且排除埋点 bug → 执行 `git revert` 并写入 `docs/decisions/YYYY-MM-DD-revert-reason.md`
- Phase 0 的 `docs/runbooks/homepage-rollback.md` 写明 revert 标准操作

**Guardrail 阈值**（首次告警触发人工 review，非自动）：
- LCP 中位数较 baseline 增加 > 30%（3 天滑窗）
- Hero CTA CTR 跌 > 15%（7 天滑窗）
- Bounce rate 涨 > 15%（7 天滑窗）
- 新 Sentry error rate > 1% 的新首页相关 error

#### Phase F 决策门

14 天后开 review meeting（或 1 on 1），根据数据 + 业务优先级决定：

| 门 | 触发条件 | 下一步 |
|---|---|---|
| **GO F1 (Kids face)** | 主页不回退 + Elementary 路径流量占比 ≥ 10% + 有 K-5 增长业务目标 | 独立立项：`docs/plans/YYYY-MM-DD-kids-face.md` |
| **GO F2 (Editorial /pricing)** | /pricing 转化有可量化提升空间 + 当季度 OKR 包含付费提升 | 独立立项 |
| **GO F3 (Canvas live hero)** | 静态 hero 成功 + 有余力做"再上一层"的视觉升级 | 独立 spike ≤ 2 天原型验证 |
| **HOLD** | 任一 guardrail 触发或指标平平 | 保留静态版，不追加工作 |

---

## 3 · 技术决策记录（v2 修订）

| # | 决策 | v1 选定 | v2 选定 | 原因（双审后）|
|---|---|---|---|---|
| T-01 | 视觉架构 | 三面系统 | **单面 marketing** | Codex: 过度设计；plan-eng: 4 face 让 block 四合一噩梦 |
| T-02 | Hero 动画 | canvas 2D vanilla JS | **静态 inline SVG** | Codex: canvas 高风险低必要性；150 行是伪约束 |
| T-03 | 新字体 | next/font/google 加 Fraunces+DM Sans | **不加新字体** | 体积预算不现实 + Kids face 推迟 |
| T-04 | face 切换 | 路由映射（server） | **不需要**（单面）| 去掉问题本身 |
| T-05 | K-5 路径 | query string | **推迟到 Phase F1 决定** | Codex: query 不是稳定信息架构 |
| T-06 | 灰度 | env flag + 5→25→100% | **直接替换 + git revert** | Codex: NEXT_PUBLIC_ 不是流量分桶；14 天跑不出显著性 |
| T-07 | Hero 图片 | 纯 canvas | **静态 SVG** | 同 T-02 |
| T-08 | 移动端 hero | canvas → PNG fallback | **SVG 直接适配**（响应式）| SVG 天然 responsive，省 PNG 生产 |
| T-09 | brand-spec 位置 | docs/design/ | **docs/design/ + 显式 owner/更新规则** | plan-eng + Codex 都提到漂移风险 |
| T-10（新）| Telemetry HUD | fake live 数据 | **静态 `Example · v₀=42 m/s`** | Codex: 教育产品不能 fake |
| T-11（新）| A/B 基线 | 估算值 | **Phase 0 实测 Lighthouse + 埋点** | Codex: 基线不可信 |
| T-12（新）| 测试策略 | demo diff ≤ 15% | **Playwright 快照 + Lighthouse CI + 人工 review** | Codex: demo diff 是审美伪装测试 |

---

## 4 · 风险登记册（v2 focused）

| # | 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|---|
| R-01 | SVG hero 在 dark/light 切换时显示异常 | 低 | 中 | Playwright pair 测试 light + dark |
| R-02 | CTA 文案/key 不对齐断 i18n | 低 | 中 | en+zh 同 commit + type-safe `Section` 接口 |
| R-03 | 主页改版后 SEO 层级变化影响 organic | 中 | 高 | Phase 0 的 seo-audit 脚本在 PR CI |
| R-04 | Hero 快照 baseline 大规模失败 | 中 | 中 | Phase 0 先建新 baseline，合并时单次更新 |
| R-05 | 替换后指标回退 | 中 | 高 | guardrail 自动监控，跌 >15% revert |
| R-06 | Phase F 决策变成"不了了之"导致 kids 永远没做 | 中 | 低 | 14 天后显式 meeting，结论必须写入 `docs/decisions/YYYY-MM-DD-phase-f.md` |
| R-07 | FreePik PNG 移入 archive 后某处还引用 | 低 | 低 | grep `student-discovery` 确认引用点 |
| R-08 | 埋点被 ad-blocker 挡导致 14 天数据稀疏 | 中 | 中 | Vercel Analytics + 自建 fallback `/api/analytics/event` |

---

## 5 · 时间线 + 资源（v3 · codex v2 #12 修正）

| 阶段 | 人日 | 起止 | 交付 |
|---|---|---|---|
| Phase 0 | **1.5** | W1 D1-D2 | emoji 清理 + brand-spec SSOT + 埋点 spec + fallback API + baseline 3-run + seo-audit CI + runbook | 
| Phase 1 | **5-6** | W1 D3 — W2 D3 | 首页 8 文件改造 + `hero.e2e.test` + i18n + SEO audit PASS |
| Phase 2 | 观察期（非人日）| W2 D4 — W4 D3 | 14 天数据 + Phase F 决策文档 |
| **主线合计** | **6.5-7.5 人日** | **~3 周**（含 14 天观察）| |

Codex v2 #12 指出 v2 的 5-6 天过于乐观——v3 上调到 6.5-7.5。每 Phase 结束跑全 `pnpm lint + typecheck + test + build + seo-audit + a11y`，如 fail 时间顺延。

Phase F1 / F2 / F3 在 Phase 2 后独立立项估算。

**资源**：1 FE dev + Claude 协作。

---

## 6 · Brand SSOT 契约（docs/design/brand-spec.md）

**Owner**: FE lead（@user）
**更新触发**：
- theme.css 任何 token 改动 → 必须同 PR 更新 brand-spec
- 新增 face / 新组件视觉规则 → 先改 spec 再改代码
- CLAUDE.md 中任何品牌色/字体描述 → 禁止，统一引用 spec

**强制规则（v3 收窄）**：
- **新增/修改**代码禁止硬编码 `#[0-9a-fA-F]{6}` hex；已有代码不强制（避免扩大为 hex 清理工程——codex v2 #13）
- CI 检查仅应用于本次 PR 的 diff，不扫全仓
- `font-family:` 新增引用必须走 CSS 变量或 Tailwind theme token

---

## 7 · Open Questions（v3 · 只剩 2 条，由用户答）

1. **Logo 三色是否动**：v1/v2/v3 一致建议**不动**，只收窄用法（nav / favicon）——用户确认即可
2. **Phase F 决策由谁在何时拍板**：单人项目（用户 solo）建议 Phase 2 上线后第 14 天固定自查；若需多人可 Phase 0 创建 `docs/reminders/phase-f-review.md` calendar 占位文件

v2 的其他 Open Questions 已在 v3 中消解：埋点方案（Vercel + 自建 fallback，已定）/ CLAUDE.md 修订（改可选）

---

## 8 · Review 状态

- [x] v1 plan-eng-review（2026-04-22）
- [x] v1 codex review（2026-04-22）
- [x] v2 合并反馈产出（2026-04-23）
- [x] v2 plan-eng-review（2026-04-23）— 4 条 P2 已在 v3 落地
- [x] v2 codex review（2026-04-23）— 14 条精细化已在 v3 落地
- [x] **v3 最终版产出（2026-04-23）**
- [ ] **用户最终确认 ← 等这一步**
- [ ] writing-plans 拆任务 + 执行

---

## 附录 A · Brand SSOT 契约细则

（详见 `docs/design/brand-spec.md` 搬入后加的文件头 frontmatter + Owner / Update Triggers 段）

## 附录 B · v3 变更清单（统一口径）

**Phase 0（7 files）**：
- 修：`src/config/style/theme-education.css`（删 emoji）
- 修：`CLAUDE.md`（可选，UI 章节精简）
- 新：`docs/design/brand-spec.md`（从 _design/ 搬）
- 新：`src/shared/lib/analytics/track.ts`
- 新：`src/app/api/analytics/event/route.ts`
- 新：`scripts/seo-audit.mjs`
- 新：`scripts/lighthouse-baseline.mjs`

**Phase 1（9 files）**：
- 修：`src/themes/default/blocks/hero.tsx`
- 修：`src/themes/default/blocks/hero-background.tsx`
- 修：`src/themes/default/blocks/header.tsx`（仅 `/` 路由变体）
- 修：`src/themes/default/blocks/experiment-showcase.tsx`
- 修：`src/config/locale/messages/en/landing.json`
- 修：`src/config/locale/messages/zh/landing.json`
- 新：`src/themes/default/blocks/hero.test.tsx`
- 新：`src/themes/default/blocks/hero.e2e.test.ts`
- 新：`docs/runbooks/homepage-rollback.md`

**资产清理**：`git rm public/imgs/hero/student-discovery{,-dark}.png`（2 files）

**合计：16 文件变更 + 2 文件删除**。主实施面（Phase 1 代码）仍是 **4 修 + 3 新 = 7 代码文件**，符合 plan-eng-review threshold。

## 附录 C · 废弃（v1 → v3 累计砍掉）

**v2 砍掉**：
- Kids face tokens + grade-tiles-kids.tsx + kids hero variant（→ Phase F1）
- Editorial face tokens + pricing.tsx editorial + blog editorial（→ Phase F2）
- Hero canvas + 200 粒子 + COR 弹跳球 + telemetry HUD live（→ Phase F3，可选）
- Fraunces + DM Sans 字体引入（→ 仅 Phase F1 立项时）
- NEXT_PUBLIC_HOMEPAGE_V2 + 5%→25%→100% 流量分桶（永久废弃）
- Demo screenshot diff ≤ 15% 测试（永久废弃）

**v3 精修澄清**：
- Header icon 删除范围：从"全站" → 仅 `/` 路由
- PNG archive 路径：public/_archive → git rm（git 历史即备份）
- "零视觉变化" → "可接受微变 + 人工 review"
- SVG SMIL animate → CSS animation（兼容 Safari 15）
- 全仓 hex=0 CI → 仅 PR diff
- CLAUDE.md 修订：Phase 0 强制 → 可选
- 事件数：4 → 6（准确计数）
- Lighthouse baseline：1 次 → 3 次中位数
- SEO "不变或改进" → "不回退"
- Guardrail 自动 revert → 人工 review → 72h 持续才 revert
- 时间线 5-6 天 → 6.5-7.5 天
