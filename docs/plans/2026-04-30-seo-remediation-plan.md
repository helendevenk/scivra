---
name: seo-remediation-plan
status: backlog
created: 2026-04-30T04:24:51Z
updated: 2026-04-30T04:24:51Z
---

# Scivra SEO 修复计划（基于实测数据）

## 数据来源

- **核实方式**：Chrome DevTools MCP，逐页 `fetch` 同源抓取 HTML
- **核实日期**：2026-04-30
- **覆盖范围**：sitemap.xml 收录的全部 219 个 URL
  - 179 个实验页（depth 4：`/labs/{subject}/{band}/{slug}`）— 全部扫描，0 失败
  - 40 个 hub / landing / legal / blog / learn 页 — 全部扫描，0 失败
- **未在本计划处理的**：i18n 多语言、www→apex 301、`/zh` 残留 — 实测已经处理完毕（见末尾"已确认无需再做"）

## 一句话结论

实测发现 **8 类问题**。NeonPhysics 数据残留是**确定的 59 页**（不是抽样估算），实验页正文**全部 <500 词**（179/179），所有 hub 页 **0 schema 覆盖**（除首页只有最简 WebSite），3 个 `/learn/*` 页面声明了 Course schema 但内容只有 ~100 词（schema 错配）。报告指控的多语言、`/chat`、www 多版本、hreflang 等问题已经修过了，不在本计划范围。

## 问题分级

| 等级 | 定义 |
|------|------|
| 🔴 P0 | 影响品牌信号或搜索理解；本周必修 |
| 🟡 P1 | 影响排名上限；2-4 周内分批做 |
| 🟢 P2 | 增益型；模板验证通过后批量铺 |

---

## 问题 1 — NeonPhysics 数据残留（🔴 P0）

### 实测事实

- **可见 `<title>`**：179/179 全部已渲染为 Scivra（无残留）
- **序列化的 `seoTitle` JSON 字段**：**59/179 页面**仍写着 `NeonPhysics`
- 残留分布按学段：
  - AP Physics 1：9 页
  - AP Physics 2：8 页
  - AP Physics C：5 页
  - AP Biology：10 页
  - AP Chemistry：7 页
  - Elementary K-5：11 页（physics 6 / chem 1 / bio 1 / earth 3）
  - NGSS MS：9 页（physics 2 / chem 2 / bio 3 / earth 2）

### 影响

- HTML 源码包含 NeonPhysics 字符串 → 部分爬虫（Bing / 百度 / 国内站长工具）可能仍抓取到
- 数据未清理 → 未来某个组件改用 `seoTitle` 字段时会回归
- 不影响当前 Google 渲染的 `<title>`

### 修法

源头是数据库 `experimentRegistry` 或 `src/shared/lib/experiments/` 下的 `seoTitle` 字段。**全局 search & replace** 一次性清掉：

```bash
# 定位源文件
rg -l 'NeonPhysics' src/
# 替换
rg -l 'NeonPhysics' src/ | xargs sed -i '' 's/NeonPhysics/Scivra/g'
```

修完后回归验证：

```bash
# 跑下面这段在浏览器里，期望返回 0
fetch('/sitemap.xml').then(r=>r.text()).then(t=>{
  const urls=[...t.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]).filter(u=>u.split('/').filter(Boolean).length>=4);
  return Promise.all(urls.map(u=>fetch(u).then(r=>r.text()))).then(htmls=>htmls.filter(h=>/NeonPhysics/i.test(h)).length)
})
```

### 完整 59 页 URL 清单（按学段分组）

#### AP Physics 1（9）

- /labs/physics/ap-physics-1/simple-harmonic-motion
- /labs/physics/ap-physics-1/momentum-collisions
- /labs/physics/ap-physics-1/electric-field-lines
- /labs/physics/ap-physics-1/wave-interference
- /labs/physics/ap-physics-1/circular-motion
- /labs/physics/ap-physics-1/rotational-motion
- /labs/physics/ap-physics-1/work-energy-theorem-power
- /labs/physics/ap-physics-1/kinematics-position-velocity-time-graphs
- /labs/physics/ap-physics-1/doppler-effect-sound-waves

#### AP Physics 2（8）

- /labs/physics/ap-physics-2/fluid-statics
- /labs/physics/ap-physics-2/geometric-optics-lenses-mirrors-ray-tracing
- /labs/physics/ap-physics-2/photoelectric-effect-photon-energy-work-function
- /labs/physics/ap-physics-2/ideal-gas-law-pv-diagrams
- /labs/physics/ap-physics-2/bernoulli-equation-venturi-airfoil
- /labs/physics/ap-physics-2/nuclear-decay-alpha-beta-gamma-half-life
- /labs/physics/ap-physics-2/single-slit-diffraction-pattern
- /labs/physics/ap-physics-2/heat-engines-carnot-cycle-efficiency

#### AP Physics C（5）

- /labs/physics/ap-physics-c/lorentz-force
- /labs/physics/ap-physics-c/gravitational-fields
- /labs/physics/ap-physics-c/electromagnetic-induction-faradays-law-lenz
- /labs/physics/ap-physics-c/electric-potential-voltage-equipotential-lines
- /labs/physics/ap-physics-c/capacitors-charging-discharging-rc-circuits

#### AP Biology（10）

- /labs/biology/ap-biology/dna-double-helix
- /labs/biology/ap-biology/protein-synthesis
- /labs/biology/ap-biology/mitosis
- /labs/biology/ap-biology/meiosis
- /labs/biology/ap-biology/cellular-respiration
- /labs/biology/ap-biology/photosynthesis
- /labs/biology/ap-biology/enzyme-kinetics
- /labs/biology/ap-biology/neuron-action-potential
- /labs/biology/ap-biology/membrane-transport
- /labs/biology/ap-biology/natural-selection

#### AP Chemistry（7）

- /labs/chemistry/ap-chemistry/molecular-bonding
- /labs/chemistry/ap-chemistry/reaction-kinetics
- /labs/chemistry/ap-chemistry/thermochemistry
- /labs/chemistry/ap-chemistry/chemical-equilibrium
- /labs/chemistry/ap-chemistry/atomic-structure
- /labs/chemistry/ap-chemistry/acid-base-ph
- /labs/chemistry/ap-chemistry/electrochemistry

#### Elementary K-5（11）

- /labs/physics/elementary-k5/k5-force-motion
- /labs/physics/elementary-k5/k5-light-propagation
- /labs/physics/elementary-k5/k5-sound-waves
- /labs/physics/elementary-k5/k5-simple-machines
- /labs/physics/elementary-k5/k5-energy-conversion
- /labs/physics/elementary-k5/k5-magnetism
- /labs/chemistry/elementary-k5/k5-states-of-matter
- /labs/biology/elementary-k5/k5-food-chain
- /labs/earth-science/elementary-k5/k5-water-cycle
- /labs/earth-science/elementary-k5/k5-day-night-seasons
- /labs/earth-science/elementary-k5/k5-moon-phases

#### NGSS Middle School（9）

- /labs/physics/ngss-ms/ms-newtons-laws
- /labs/physics/ngss-ms/ms-energy-conservation
- /labs/chemistry/ngss-ms/ms-chemical-reactions
- /labs/chemistry/ngss-ms/ms-atoms-molecules
- /labs/biology/ngss-ms/ms-photosynthesis-respiration
- /labs/biology/ngss-ms/ms-genetics
- /labs/biology/ngss-ms/ms-ecosystems
- /labs/earth-science/ngss-ms/ms-plate-tectonics
- /labs/earth-science/ngss-ms/ms-weather-systems

### 工作量与负责人

- 工作量：**0.5–1 小时**（取决于源头是 DB 还是代码）
- 验证：跑回归脚本期望返回 0
- 优先级：本周内必修

---

## 问题 2 — 实验页正文极薄（🟡 P1）

### 实测事实（179 页全量）

| 字数区间 | 页面数 |
|----------|--------|
| <300 词 | **129** |
| 300-500 词 | 50 |
| 500-800 词 | 0 |
| 800-1200 词 | 0 |
| >1200 词 | 0 |

**最薄的 5 页**：
- /labs/physics/ngss-hs/projectile-motion — 186 词
- /labs/physics/ngss-hs/newtons-laws-of-motion — 211 词
- /labs/physics/ngss-hs/electromagnetic-spectrum — 211 词
- /labs/physics/ap-physics-1/momentum-collisions — 221 词
- /labs/physics/ap-physics-1/simple-harmonic-motion — 226 词

各学科平均字数：
- Physics（92 页）— 平均 261 词
- Biology（31 页）— 平均 295 词
- Chemistry（25 页）— 平均 291 词
- Earth Science（28 页）— 平均 301 词
- Math（3 页）— 平均 232 词

### 现有页面已有的（保留）

- ✅ `<title>` 正确
- ✅ `<h1>` 正确
- ✅ canonical 自指
- ✅ JSON-LD：`LearningResource` + `BreadcrumbList`（179/179）
- ✅ Open Graph 完整
- ✅ Meta description 有，但偏短

### 缺的（需补）

- ❌ FAQ 模块：**0/179** 有 FAQ
- ❌ 常见误区（misconception）模块：**0/179**
- ❌ 教师使用指引：**0/179**
- ❌ 相关实验内链稀疏（每页平均 1 条）

### 修法 — 实验页统一模板升级

每页在交互组件下方追加结构化文字（目标 700–1000 词）：

```
[现有] 标题 + 简介 + Key Equation + 交互组件
[新加] ## What is {topic}?           — 100-150 词，定义 + 公式 + 真实例子
[新加] ## Parameters explained       — 参数表，每参数 1 行说明
[新加] ## Common misconceptions      — 3-5 条常见错误（学生角度）
[新加] ## How teachers use this lab  — 3-5 条课堂引导
[新加] ## FAQ                        — 4-6 个高频问题（带 FAQPage schema）
[新加] ## Related experiments        — 3-5 条相关实验（手工挑同主题）
```

新增 schema：

- `FAQPage`（FAQ 模块）
- `LearningResource` 中补 `educationalAlignment`（NGSS / AP / GCSE 课程标准映射）
- `LearningResource` 中补 `hasPart` 串联相关实验

### 分批节奏

不要一次铺 179 页。先做 **10 个 P0 实验页**（按品牌词搜索量 + 已有内链优势挑选），验证模板效果再批量。

**10 个 P0 实验页**（建议优先升级）：

1. /labs/physics/ngss-hs/projectile-motion（首页已 hero 展示，最薄 186 词）
2. /labs/physics/ngss-hs/newtons-laws-of-motion
3. /labs/biology/ap-biology/dna-double-helix（首页已 hero 展示）
4. /labs/chemistry/ap-chemistry/chemical-equilibrium（首页已 hero 展示）
5. /labs/physics/ap-physics-1/wave-interference
6. /labs/physics/ap-physics-1/doppler-effect-sound-waves
7. /labs/physics/ap-physics-2/geometric-optics-lenses-mirrors-ray-tracing
8. /labs/biology/ap-biology/cellular-respiration
9. /labs/biology/ap-biology/photosynthesis
10. /labs/chemistry/ap-chemistry/acid-base-ph

### 工作量

- 模板组件开发：**0.5 天**（一个 React 组件 + JSON 字段约定）
- 内容写作（10 个 P0 页 × 0.5h/页）：**1 天**
- 内容写作（剩余 169 页 × 20min/页）：**6-7 天**（可分批 / 可外包 / 可 AI 辅助初稿 + 学科顾问审校）
- 总计：**约 2 周**

---

## 问题 3 — Hub / 学科 / Band 页面普遍薄（🟡 P1）

### 实测事实

#### 顶层 hub 页

| URL | Title | 字数 | H2 数 | FAQ | Schema | 评级 |
|-----|-------|------|-------|-----|--------|------|
| / | Scivra — Interactive Science Labs in 3D | 582 | 7 | ✅有但无 schema | WebSite（最简） | 🔴 H1 过窄 + schema 不足 |
| /labs | Free Interactive Science Labs \| Scivra | **137** | 5 | ❌ | **0** | 🔴 极薄 |
| /pricing | **Pricing** | 355 | 3 | ✅有但无 schema | **0** | 🔴 title 弱 + 0 schema |
| /upg | Universal Principle Generator - Interactive 3D Visualization | 211 | 3 | ✅有但无 schema | **0** | 🟡 缺 schema |
| /learn | Learning Paths - Structured Physics Education | **107** | 1 | ❌ | **0** | 🟡 极薄 |
| /gallery | Gallery - Interactive Science Visualizations | **105** | 1 | ❌ | **0** | 🟡 极薄 |
| /ap-prep | AP Exam Prep - Scivra | 176 | 1 | ❌ | **0** | 🟡 薄 |
| /showcases | **Experiment Gallery** | 132 | 2 | ❌ | **0** | 🟡 title 弱 + 薄 |
| /blog | **Blog** | 138 | 1 | ❌ | **0** | 🟡 title 弱 |
| /updates | **Update Logs** | 126 | 1 | ❌ | **0** | 🟡 仅 1 条更新内容 |

#### 学科 hub 页（5 个）

| URL | 字数 | H2 | FAQ | Schema |
|-----|------|----|----|--------|
| /labs/physics | 595 | 6 | ❌ | 0 |
| /labs/biology | 348 | 3 | ❌ | 0 |
| /labs/chemistry | 291 | 3 | ❌ | 0 |
| /labs/earth-science | 352 | 3 | ❌ | 0 |
| /labs/math | 112 | 1 | ❌ | 0 |

学科页比顶层 hub 好一点但仍单薄；都缺 BreadcrumbList + CollectionPage schema。

#### Band 页（16 个，全部 0 H2 / 0 FAQ / 0 schema）

| URL | 字数 |
|-----|------|
| /labs/physics/ngss-hs | 120 |
| /labs/physics/ap-physics-1 | 473 |
| /labs/physics/ap-physics-c | 225 |
| /labs/physics/ap-physics-2 | 560 |
| /labs/physics/elementary-k5 | 177 |
| /labs/physics/ngss-ms | 145 |
| /labs/biology/ap-biology | 356 |
| /labs/biology/elementary-k5 | 146 |
| /labs/biology/ngss-ms | 158 |
| /labs/chemistry/ap-chemistry | 295 |
| /labs/chemistry/elementary-k5 | 120 |
| /labs/chemistry/ngss-ms | 145 |
| /labs/earth-science/elementary-k5 | 172 |
| /labs/earth-science/ngss-ms | 214 |
| /labs/earth-science/ngss-hs | 234 |
| /labs/math/general | 105 |

### 修法

#### 首页（🔴 P0）

- 保留现有 hero 文案（AP Physics 卖点不丢）
- 在 hero 下方加一条副叙事条："Or pick by grade — K-5 / Middle School / High School / AP" + 4 个学段卡片
- Schema 补强：现有 `WebSite` → 加 `Organization`、`SearchAction`、`SiteNavigationElement`、`FAQPage`（首页已经有 FAQ 文本但没标）

#### /labs 顶层目录（🔴 P0）

- 正文从 137 词扩到 ~600 词
- 加 6 个 H2：What's a virtual lab / How to use Scivra labs / NGSS coverage / AP coverage / GCSE coverage / FAQ
- Schema：`BreadcrumbList` + `CollectionPage` + `ItemList`

#### /pricing（🔴 P0）

- Title 改成 `Pricing — Free, Pro, Max | Scivra`
- 已有 FAQ 文本 → 加 `FAQPage` schema
- 加 `Product` / `Offer` schema 描述三档套餐
- 补 institution / school / classroom 采购说明段（即使现在不卖 institution，至少留个 placeholder + 联系方式）

#### /upg（🟡 P1）

- 已有 FAQ 文本 → 加 `FAQPage` schema
- 加 `SoftwareApplication` schema（应用类型 = WebApplication）

#### /blog（🟡 P1）

- Title 改成 `Scivra Blog — Physics Articles & Experiment Guides`
- 加 `Blog` + `ItemList` schema
- 给现有 2 篇文章页加 `BlogPosting` schema（实测 /blog/newtons-laws-with-vectors 是 801 词、/blog/projectile-motion-common-mistakes 是 1274 词，内容质量 OK，缺的只是 schema）
- 决策点：blog 是认真做（每周 1-2 篇）还是从 footer 移除入口？现在的"挂了入口但只有 2 篇"对 SEO 是负资产。

#### /updates、/showcases、/gallery、/learn、/ap-prep（🟡 P1）

- 共同问题：title 太弱、字数太少、零 schema
- /updates 决策点：只有 1 条更新就别 index 了，加 noindex 或者攒到 5 条以上再开放
- /showcases 与 /gallery 功能重叠 → 决策：合并还是各走各路？
- /learn 与 /ap-prep 是产品功能页，正文加到 400-600 词 + FAQ + 加 `WebPage` schema

#### 学科 hub（5 个）+ Band（16 个）（🟡 P1）

- 模板统一：每页 ~500 词
- H2 必有：Topic overview / Skills covered / Standards alignment（NGSS / AP / GCSE）/ How teachers use these labs / FAQ
- Schema：`BreadcrumbList` + `CollectionPage` + `ItemList`

### 工作量

- 首页改造：1 天
- /labs + /pricing：2 天
- 5 学科 hub + 16 band 页（共 21 页，模板化）：3-4 天
- 其他 hub（/upg、/learn、/blog、/gallery、/showcases、/ap-prep、/updates）：2 天
- 总计：**约 1.5-2 周**

---

## 问题 4 — Schema 错配：/learn/* 三个页面（🟡 P1）

### 实测事实

3 个 `/learn/*` 页面声明了 `Course` + `CourseInstance` schema，但正文极薄：

| URL | 字数 | Schema |
|-----|------|--------|
| /learn/energy-conservation-advanced | **95** | Course / CourseInstance |
| /learn/projectile-motion-intermediate | **92** | Course / CourseInstance |
| /learn/newton-mechanics-beginner | **113** | Course / CourseInstance |

### 影响

Google 对 `Course` schema 的内容期望是有完整学习目标、模块、时长等。**95 词的页面声明 Course schema 会被 Google 判为 schema 与内容不一致**，可能触发 manual action 或者降权。

### 修法（二选一）

**A. 内容补齐（推荐）**：把每页扩到 600-800 词，符合 Course schema 期望（学习目标、章节、所需前置知识、推荐时长、关联实验）。

**B. 暂时降级 schema**：保留 `WebPage` + `BreadcrumbList`，先去掉 `Course`/`CourseInstance`，等内容到位后再加回来。

**推荐 A**：这三个页面已经在 sitemap 里、已经被 Google 抓取，删 schema 是退步；补内容是前进。

### 工作量

- 3 页 × 0.5 天/页 = **1.5 天**

---

## 问题 5 — 法律页缺 schema（🟢 P2）

### 实测事实

| URL | 字数 | Schema |
|-----|------|--------|
| /privacy | 416 | 0 |
| /terms | 513 | 0 |
| /children-privacy | 312 | 0 |
| /cookie-policy | 309 | 0 |

法律页内容已经是合规级别，不薄。仅缺 `WebPage` schema 和 BreadcrumbList。

### 修法

- 加 `WebPage` + `BreadcrumbList`
- /children-privacy 加 `lastReviewed` 时间戳（COPPA 合规）

### 工作量

- 4 页 × 5min = **20 分钟**

---

## 问题 6 — `www.scivra.com` 没有 host 级 301（🟢 P2）

### 实测事实

- `https://www.scivra.com/` 返回 **200**（不是 301 到 apex）
- 内容与 apex 完全一致
- canonical 已指向 apex（`https://scivra.com/`）

### 影响

Google 不会把 www 当独立站点（因为 canonical 对了），但作为最佳实践应该 host 级 301 收敛。

### 修法

在 Vercel / DNS 层加 `www.scivra.com → scivra.com` 永久重定向。

### 工作量

- **10 分钟**

---

## 问题 7 — 资源中心策略未定（🟡 P1，决策题）

### 实测事实

- /blog 主页 138 词 + 2 篇文章
- 2 篇文章质量 OK：
  - /blog/newtons-laws-with-vectors — 801 词 / 6 H2
  - /blog/projectile-motion-common-mistakes — 1274 词 / 8 H2
- /updates 1 条 (2026-02-28 v1.0.0)
- /resources 是 **404**
- footer 上有 Resources / Blog / Updates 三个入口

### 决策

挂了入口但内容稀薄，对 SEO 是负资产。三选一：

- **A. 认真做**：blog 每周 2 篇高质量长文（教师/学生两类意图），3 个月内累积 24 篇
- **B. 暂时收掉**：从 footer 移除 Blog / Updates / Resources 入口、`/resources` 移出 sitemap
- **C. 折中**：保留 blog 入口但每月 1-2 篇；updates 加 noindex（直到累积 5 条以上）；resources 立刻从 footer 移除并 301 到 /blog

**推荐 C**。理由：A 需要持续投入内容写作资源，对当前阶段（产品打磨期）成本过高；B 太悲观，blog 已经有两篇高质量稿可作为基底；C 是务实路径。

---

## 问题 8 — 首页 H1 过度集中 AP Physics（🔴 P0）

### 实测事实

- H1：`Your next A in AP Physics starts with one experiment.`
- 副文案与目录页提到 "5 disciplines / 175+ labs / K-5→AP / NGSS / GCSE / AP"
- Meta description 已经覆盖 5 学科

### 影响

**不是禁止**说 AP Physics，而是把全站窄化成"AP 物理专项站"。覆盖意图：

- AP 学生（已覆盖）
- 找其他学科互动实验的学生 / 教师（被屏蔽）
- 找 K-5 / NGSS / GCSE 的教师（被屏蔽）

### 修法

H1 不动（保留品牌主张），在 H1 下方一行加副叙事条 + 4 个学段入口卡片：

```
[H1] Your next A in AP Physics starts with one experiment.
[副] Stop rereading the textbook. Launch a 3D lab, tweak the numbers, watch physics happen.
[NEW 一行] Or pick by grade →
[4 卡片] Elementary K-5 (23) | Middle School (26) | High School (53) | AP (77)
```

副叙事 + 学段卡片实测已存在于首页下方，问题只是**首屏不可见**，需要把它**提到 hero 视区内**。

### 工作量

- 首页布局调整：**0.5 天**
- 同时把首页 schema 一并补强（见问题 3）

---

## 已确认无需再做（避免误工）

下列报告里指控的"问题"实测都已经处理过：

| 报告指控 | 实测结果 |
|----------|----------|
| `/zh`、`/en` 多语言路径并存暴露 | `/zh/*`、`/en/*` 已全部 308 永久重定向到 apex；sitemap 219 URL 中 zh:0、en:0 |
| `/chat` 是薄页应该 noindex | `/chat` 已配 `noindex, nofollow`；`robots.txt` 已 `Disallow: /chat/*` |
| canonical / hreflang / robots / sitemap 未核验 | hreflang（`en` + `x-default`）、canonical、robots.txt、sitemap.xml **全部已配** |
| 实验页 `<title>` 写成 NeonPhysics | 179/179 实验页可见 `<title>` 已是 Scivra（数据层 seoTitle 字段残留另算，见问题 1） |
| 实验页缺 schema | 179/179 都已有 `LearningResource` + `BreadcrumbList`（缺 FAQPage 而已） |
| 价格页有 FAQ + 退款承诺所以可用 | 实测有 FAQ 文本但 0 schema；其他增强项都缺 |

按用户决策：**不做中文版本**，因此报告里关于 `zh-cn` 专题、双语 Geo 页、国际学校中文场景的全部建议**作废**，不进入本计划。

---

## 执行节奏

### 本周（P0，约 1.5-2 天）

1. NeonPhysics 数据全局清掉（59 页）+ 回归验证 — 0.5–1h
2. www → apex 加 host 301 — 10min
3. 首页 H1 区域加学段卡片 + 补 Organization / SearchAction / FAQPage schema — 0.5 天
4. /labs 扩内容到 600 词 + 加 BreadcrumbList + CollectionPage + ItemList schema — 0.5 天
5. /pricing 扩 title + 加 Product/Offer/FAQPage schema — 0.5 天
6. /learn/* 三页降级 schema 或补内容（推荐补内容）— 1 天

### 第 2-3 周（P1，约 1.5-2 周）

7. 实验页模板组件 + 10 个 P0 实验页内容升级（验证模板）— 1.5 天
8. 5 学科 hub + 16 band 页模板化升级 — 3-4 天
9. /upg、/blog、/blog/*（2 篇）、/gallery、/showcases、/ap-prep schema 补强 — 2 天
10. /updates、/showcases 决策（noindex / 合并 / 收掉）— 0.5 天
11. /resources 入口处理（301 到 /blog 或从 footer 移除）— 10min

### 第 4 周起（P2，分批）

12. 实验页内容批量铺（剩余 169 页）— 6-7 天，可 AI 辅助初稿 + 学科顾问审校
13. 法律页 4 个加 schema — 20min
14. blog 内容产出策略落地（如果选问题 7 的 A 或 C 路径）

---

## KPI（基于实测基线）

| 指标 | 当前基线（2026-04-30 实测） | 30 天目标 | 90 天目标 |
|------|------------------------------|-----------|-----------|
| 实验页 NeonPhysics 残留数 | 59/179 | **0/179** | 0/179 |
| 实验页平均字数 | ~280 | 10 个 P0 页 ≥ 700 词 | 全部 179 页 ≥ 600 词 |
| 实验页有 FAQ schema | 0/179 | 10/179 | 179/179 |
| Hub 页有 schema | 1/40（首页 WebSite） | 主要 hub（10 个）有完整 schema | 所有 40 hub 页有 schema |
| /learn/* schema-内容一致 | 0/3 | 3/3 | 3/3 |
| Google Search Console 接入 | 未接入 | 已接入 | 第一批数据反馈 |

GSC 必须接入，否则上面所有 organic 指标都没法 measure。这件事也加进本周。

---

## 附：本计划未覆盖的事

- **AI 平台收录优化（Generative Engine Optimization）**：报告原计划里有这一节，本计划暂不展开，因为现阶段更重要的是把基础打牢；实验页加完 FAQ + Misconceptions 后会自然受益。
- **外链建设 / EDU 资源页 outreach**：等问题 1-3 完成后再启动，否则没东西可链接。
- **多区域 SEO（en-us / en-gb 拆分）**：用户已确认不做中文版本。英语区的 GCSE / NGSS 差异可以靠 hub 页内容承接，不需要拆 URL。
- **付费 SEO 工具（Semrush / Ahrefs）**：仅在 GSC 数据接入 30 天后再评估是否需要。

---

## 验收清单

完成本计划后跑下列回归验证：

```javascript
// 在 scivra.com 任何页面的 console 跑
async function audit() {
  const r = await fetch('/sitemap.xml');
  const t = await r.text();
  const urls = [...t.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const exp = urls.filter(u => u.split('/').filter(Boolean).length >= 4);
  let neon = 0, lowWord = 0, noFAQ = 0;
  for (const u of exp) {
    const html = await (await fetch(u)).text();
    if (/NeonPhysics/i.test(html)) neon++;
    const txt = html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean);
    if (txt.length < 600) lowWord++;
    if (!/FAQPage/.test(html)) noFAQ++;
  }
  return { totalExp: exp.length, neon, lowWord, noFAQ };
}
audit();
```

期望返回：`{ totalExp: 179, neon: 0, lowWord: 0, noFAQ: 0 }`
