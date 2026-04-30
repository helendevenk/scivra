---
name: documentation-realignment-plan
status: proposed
created: 2026-04-23T00:00:00Z
updated: 2026-04-23T00:00:00Z
---

# 文档对齐改造计划（以当前代码为准）

## 目标

把仓库中的“当前态文档”回写到与**当前代码、配置、测试、公开资源**一致，停止让历史计划、历史口径、未落地能力继续冒充事实。

本计划只覆盖**文档修改**，不补实现、不改 API、不改 schema、不恢复旧能力。

---

## 适用原则

### SSOT 顺序

后续所有文档回写都按以下优先级取事实：

1. **当前代码与配置**
   - `src/`
   - `package.json`
   - `public/`
   - `content/`
2. **当前测试与测试约束**
   - `tests/`
3. **当前可公开访问的路由与资源**
   - `src/app/`
   - `public/experiments/`
4. **当前态文档**
   - `README.md`
   - `ARCHITECTURE.md`
   - `CLAUDE.md`
   - `docs/tech-debt.md`
5. **历史计划 / 报告 / 归档**
   - `docs/plans/`
   - `docs/reports/`
   - `docs/archive/`

### 文档分类规则

- **当前态文档**：必须描述“现在仓库真实是什么”。
- **历史文档**：保留历史语境，不再充当当前事实源。
- **规划文档**：允许描述目标态，但必须明确“未实现”。
- **报告文档**：允许描述某个时间点的结论，但必须带时间边界。

### 非目标

- 不在本轮恢复 `zh` 双语站点。
- 不在本轮补 `/api/cron/data-retention`。
- 不在本轮补 image/music/video AI 生成页面。
- 不在本轮修正代码里的所有文案漂移，只先把文档收敛到当前事实。
- 不重写 `docs/archive/` 中的历史内容，只做边界管理。

---

## 已确认的当前事实基线

以下事实已通过代码、目录和测试读取确认，后续文档必须与之对齐。

| 主题 | 当前事实 | 依据 |
|---|---|---|
| i18n（应用层） | 当前应用是**英文单语**；`locales = ['en']`，`defaultLocale = 'en'`，`localePrefix = 'never'` | `src/config/locale/index.ts` |
| i18n（测试层） | E2E 明确按 **English-only routing** 校验；`/zh` 不应停留在中文前缀 | `tests/e2e/i18n.spec.ts` |
| i18n（文档站） | Fumadocs 当前也只配置 `languages: ['en']` | `src/core/docs/source.ts` |
| 中文内容文件 | 仓库内存在 `*.zh.mdx`，但这**不等于**站点当前支持中文 | `content/` + `src/core/docs/source.ts` |
| 实验总量（公开 HTML） | `public/experiments/` 下共有 **175** 个 HTML 实验文件 | `public/experiments/` |
| 实验总量（注册表） | `src/shared/lib/experiments/data/` 中共有 **179** 个 `Experiment` 定义 | `src/shared/lib/experiments/data/` |
| 两套实验数字关系 | `179` 包含 `4` 个 Wave 1 React/R3F 实验；面向 public HTML 的口径是 `175` | `src/shared/lib/experiments/html-map.ts`、`src/shared/components/experiments/three/*` |
| API 路由数 | 当前 `src/app/api/**/route.ts` 共 **75** 个 | `src/app/api/` |
| 数据库表数 | `schema.ts` 当前定义 **53** 个 `pgTable(...)` | `src/config/db/schema.ts` |
| UPG 学科能力 | 当前只有 `physics` 为 enabled；`chemistry / biology / math / earth-science` 都是 disabled / coming soon | `src/shared/lib/upg/disciplines/*.ts` |
| AI 工具页面 | 当前 `(ai)` 路由里实际只有 `upg` 页面，没有 image/music/video 生成器页面 | `src/app/[locale]/(landing)/(ai)/` |
| Cron 能力 | 当前没有 `src/app/api/cron`，也没有 `/api/cron/data-retention` 路由 | `src/app/api/` |
| “zero any” 说法 | 仓库当前**并非** zero `any`，源码和测试里都存在大量 `any` | `rg -n "\\bany\\b" src tests` |

---

## 本轮要解决的问题

### P0：根文档把历史状态写成当前事实

重点问题：

- `README.md` 仍把阅读顺序说对了一半，但没有明确哪些数字/能力是“当前已验证”。
- `ARCHITECTURE.md` 混入了多处当前不成立的说法，例如：
  - `en/zh, prefix: as-needed`
  - `/api/cron/data-retention` 已存在
  - `(ai)` 下包含 image/music/video generator
  - `TypeScript strict, zero any`
- `CLAUDE.md` 混入大量历史业务状态、旧数字、旧 i18n 口径、旧路由数字，且当前仍容易被误当事实源。

### P1：主 `docs/` 目录里“当前态”和“历史态”边界不清

重点问题：

- `docs/plans/` 与 `docs/reports/` 中很多文件写的是某次快照或某次计划，但文件名和位置容易让人误判为“现在仍成立”。
- 部分文档仍直接写 `175`、`179`、`en/zh`、`as-needed`、`1271 tests` 这类高漂移数字，且没有验证日期或来源边界。
- 当前仓库没有明确的“哪些文件是当前事实源、哪些只是历史记录”的规则文档。

### P2：文档内容与产品口径未统一

重点问题：

- 实验数字存在两种真实口径：`175 public HTML` vs `179 registry definitions`，但很多文档没有解释差异。
- UPG 产品文案常把“多学科支持”写成已上线，实际代码是 physics-only enabled。
- 单语英文站点与仓库内残留中文内容文件之间，没有清晰说明“现状是单语，中文内容只是遗留/未启用”。

---

## 计划产物

本轮文档改造完成后，仓库应至少具备以下产物：

1. 一组**可信的当前态文档**
2. 一组**被明确标记为历史文档**的旧计划/旧报告
3. 一套**以后更新文档时的取事实规则**

---

## 分阶段执行方案

## Phase 1：重写当前态根文档

### 目标

先把最容易误导读者的根文档拉回当前现实。

### 涉及文件

- `README.md`
- `ARCHITECTURE.md`
- `CLAUDE.md`

### 改动策略

#### `README.md`

目标：

- 明确“当前仓库以代码和测试为准”这句话对应的**具体规则**。
- 补一段“当前真实能力概览”，只写已验证能力。
- 去掉或改写模糊/会漂移的数字表述。

计划动作：

1. 保留项目定位，但把“当前状态”改成可核验表述。
2. 增加“当前事实快照”小节，至少覆盖：
   - 单语英文
   - 175 public HTML labs / 179 registry experiments
   - physics-only UPG enabled
   - 75 API routes / 53 schema tables
3. 明确说明：
   - `docs/archive/` 是历史材料
   - `docs/plans/` / `docs/reports/` 不是当前事实源

验收标准：

- 读完 `README.md` 不会再误以为当前站点支持 `zh`。
- 读完 `README.md` 不会再误以为 image/music/video AI generator 已落地。

#### `ARCHITECTURE.md`

目标：

- 只保留当前架构与当前能力。
- 把“历史目标态”与“现在真实态”分开。

计划动作：

1. 重写 Tech Stack 中的高漂移项：
   - i18n 改为当前单语英文
   - 移除 `zero any`
   - 不再写未验证的测试总数
2. 重写目录结构中的错误描述：
   - `(ai)` 只写 `upg`
   - 删除不存在的 `src/app/api/cron` 现状描述
3. 在 Experiments / UPG 章节中明确：
   - `175 public HTML` 与 `179 registry definitions` 的区别
   - 非 physics discipline 当前仅是 disabled config，不是已上线产品能力
4. 对“未落地但计划中”的能力统一改成：
   - `planned / not implemented`
   - 或直接移出当前架构正文

验收标准：

- `ARCHITECTURE.md` 中不再出现以下错误口径：
  - `en/zh`
  - `as-needed`
  - `/api/cron/data-retention` 已存在
  - AI image/music/video generator 已存在
  - `zero any`

#### `CLAUDE.md`

目标：

- 把它从“混合了当前态 + 历史业务战报 + 旧口径”的文件，收敛成**当前工作约束文档**。

计划动作：

1. 保留仍然有效的工程约定、路径约定、品牌引用规则。
2. 删除或改写所有当前已失效的状态陈述：
   - `en/zh`
   - `74 route.ts`
   - `1271 tests`
   - `AI image/music/video`
   - `/api/cron/data-retention`
3. 把历史阶段性成果迁移到“历史记录引用”而不是直接写进当前描述。
4. 对必须保留的历史数字增加时间边界：
   - “截至某日的里程碑”
   - 不再表述为当前恒真

验收标准：

- `CLAUDE.md` 只在“当前仍成立”时才使用现在时。
- 历史数字若保留，必须带明确日期。

---

## Phase 2：建立文档治理边界

### 目标

解决“什么是当前事实、什么只是历史记录”这个根问题，避免未来再次漂移。

### 涉及文件

- 新增一个治理文档，建议路径：
  - `docs/documentation-governance.md`
  - 或 `docs/CURRENT-STATE-RULES.md`
- `docs/ARCHIVE-LOG.md`

### 计划动作

1. 新增文档治理规则，至少定义：
   - `current-state`
   - `plan`
   - `report`
   - `archive`
2. 定义根规则：
   - 根目录文档默认属于 `current-state`
   - `docs/archive/` 永远不做当前事实源
   - `docs/plans/` 是目标态，不默认等于已实现
   - `docs/reports/` 是某时点结果，不默认等于当前仍成立
3. 规定高漂移数据的写法：
   - 测试数、路由数、实验数、schema 数量，如无自动生成或验证日期，则不要写成硬数字
4. 在 `docs/ARCHIVE-LOG.md` 追加本次“文档治理收敛”记录。

验收标准：

- 以后新读者能在一个地方看懂：哪些文档可信描述“现在”。

---

## Phase 3：清理主 `docs/` 下的误导性当前口径

### 目标

不重写所有历史文档内容，但要清楚地把“历史快照”与“当前事实”隔开。

### 涉及范围

- `docs/plans/*.md`
- `docs/reports/*.md`
- `docs/test-plans/*.md`
- `docs/test-reports/*.md`

### 计划动作

1. 扫描主 `docs/` 下仍在非 `archive/` 目录中的历史文档。
2. 对明显属于历史快照的文档，增加统一提示：
   - “本文件为历史计划/历史报告，不作为当前事实源”
3. 对仍需保留在主目录的文档，最少补两类元数据：
   - `status`
   - `verified_at` 或 `snapshot_date`
4. 对已经彻底不适合放在主目录的文档，评估是否迁移到 `docs/archive/`。

### 重点处理对象

优先处理这些容易被误读的文件：

- `docs/reports/2026-04-19-homepage-redesign-verification.md`
- `docs/plans/2026-04-19-homepage-redesign-spec.md`
- `docs/plans/2026-04-23-ui-consistency-audit.md`
- `docs/plans/test-coverage-100-plan.md`
- `docs/test-reports/phase-0-qa-report.md`

验收标准：

- 主 `docs/` 下不再有文件在没有时间边界的情况下声称：
  - 当前支持 `zh`
  - 当前存在 cron route
  - 当前 AI 页面矩阵完整
  - 当前测试数固定为某个旧数字

---

## Phase 4：统一产品口径与能力边界

### 目标

把当前文档中的几个核心产品口径统一掉，不再让不同文档各说各话。

### 必须统一的口径

#### 1. 实验数量口径

建议采用：

- **面向用户 / 营销 / 首页文案**：`175 public interactive labs`
- **面向架构 / 数据文档**：`179 experiment definitions, of which 175 are standalone public HTML labs and 4 are Wave 1 React/R3F scenes`

原因：

- `175` 是用户可直接访问的 public HTML 资产数。
- `179` 是开发内部注册表总量，不适合直接裸写到营销文案里。

#### 2. i18n 口径

建议采用：

- 当前站点：**English-only**
- 仓库中存在部分 `zh` 内容文件，但当前应用与 docs source 都未启用双语发布

禁止再写：

- `en/zh`
- `prefix: as-needed`
- 中文默认可访问

#### 3. UPG 能力口径

建议采用：

- 当前已上线：physics-enabled UPG
- 当前已配置但未启用：chemistry / biology / math / earth-science

禁止再写：

- 已支持任意 science topic
- chemistry / biology / math / astronomy / engineering 均已上线

#### 4. 平台能力口径

建议采用：

- 不写未落地的 cron 能力
- 不写不存在的 AI image/music/video generator 页面
- 不写 `zero any`

验收标准：

- 任何“当前态文档”中，以上 4 类口径都只有一种说法。

---

## Phase 5：文档站内容与仓库内容边界整理

### 目标

处理“仓库里有中文文件，但系统当前单语”的认知冲突。

### 涉及范围

- `content/docs/`
- `content/pages/`
- `content/logs/`
- `src/core/docs/source.ts`

### 计划动作

1. 在文档治理中明确：
   - 内容文件存在 ≠ 当前站点已启用该语言
2. 评估 `*.zh.mdx` 的归属：
   - 保留为未启用内容
   - 迁移到 archive
   - 或在文件级 frontmatter 明确 `draft / inactive`
3. 更新与 docs source 相关的当前态文档，避免误称双语 docs 已上线。

验收标准：

- 以后看到 `content/**/*.zh.mdx` 不会再误推断“站点当前支持中文”。

---

## 文件级改动清单（建议顺序）

| 优先级 | 文件/范围 | 动作 | 说明 |
|---|---|---|---|
| P0 | `README.md` | 重写 | 当前项目总览、真实能力、阅读顺序 |
| P0 | `ARCHITECTURE.md` | 重写 | 当前架构、能力边界、错误口径移除 |
| P0 | `CLAUDE.md` | 收敛 | 保留有效约束，剔除历史快照口径 |
| P1 | `docs/documentation-governance.md` | 新增 | 规定事实源、历史态、计划态边界 |
| P1 | `docs/ARCHIVE-LOG.md` | 追加 | 记录本次文档治理收敛 |
| P1 | `docs/reports/*.md` | 加边界说明 | 历史报告不再冒充当前事实 |
| P1 | `docs/plans/*.md` | 加边界说明 / 筛选迁移 | 历史计划保留但降级为历史语境 |
| P2 | `content/**/*.zh.mdx` | 标记或归档 | 解决“文件存在但未启用”冲突 |
| P2 | `docs/tech-debt.md` | 扩写 | 纳入文档漂移类技术债 |

---

## 验证方案

本轮是文档改造，不跑业务逻辑测试；验证方式以**可复现的事实核对**为主。

### 事实核对命令（建议保留在执行时逐项跑）

```bash
# API route 数量
find src/app/api -name route.ts | wc -l

# public HTML experiments
find public/experiments -name '*.html' | wc -l

# registry experiment 定义数
rg -n '^export const .*: Experiment = \\{' src/shared/lib/experiments/data | wc -l

# locale 当前真相
sed -n '1,200p' src/config/locale/index.ts
sed -n '1,200p' src/core/docs/source.ts
sed -n '1,200p' tests/e2e/i18n.spec.ts

# cron route 是否存在
find src/app/api -path '*cron*' -o -path '*data-retention*'

# UPG discipline enablement
find src/shared/lib/upg/disciplines -maxdepth 1 -type f | sort

# any 现状
rg -n '\\bany\\b' src tests
```

### 文档级验收 grep

执行文档修改后，至少检查以下误导性口径是否还残留在当前态文档中：

```bash
rg -n 'en/zh|as-needed|zero any|/api/cron/data-retention|ai-{image,music,video}|74 route.ts|1271 tests' \
  README.md ARCHITECTURE.md CLAUDE.md docs
```

说明：

- 若命中的是历史计划/历史报告，可以保留，但必须带明确历史边界。
- 若命中的是当前态文档，则视为未完成。

---

## 风险与处理

### 风险 1：历史文件被误改成“现在也成立”

处理：

- 历史文件只补边界提示，不重写历史结论本身。

### 风险 2：`CLAUDE.md` 同时承担“代理约束”和“产品说明”，收敛时容易两头混

处理：

- 把当前仍有效的工程规则留下。
- 把业务战报、阶段成果、旧数字降级为引用或迁出。

### 风险 3：实验数字口径如果不先统一，后面文档会继续打架

处理：

- 先定：
  - public 文案用 `175`
  - architecture/data 文档解释 `179 = 175 + 4 Wave 1`

### 风险 4：存在部分中文内容文件，容易让人想当然地恢复双语口径

处理：

- 明确区分“仓库存量内容”与“当前已发布能力”。

---

## 完成定义

满足以下条件，才算本轮“文档对齐”完成：

1. `README.md`、`ARCHITECTURE.md`、`CLAUDE.md` 三个根文档已回写到当前事实。
2. 主 `docs/` 目录中不再存在无时间边界的错误当前态口径。
3. 历史计划/报告与当前态文档边界清楚。
4. 实验数量、i18n 状态、UPG 能力、cron/AI 页面现状这四类核心口径已经统一。
5. 文档治理规则已写入仓库，后续维护有章可循。

---

## 建议执行顺序

1. 先改 `README.md`
2. 再改 `ARCHITECTURE.md`
3. 再收敛 `CLAUDE.md`
4. 再新增文档治理规则
5. 最后批量处理 `docs/plans/` 与 `docs/reports/` 的历史边界

这个顺序的原因很简单：

- 先把最常被看的根文档修正
- 再处理架构文档
- 再收拾会继续污染上下文的历史文件
