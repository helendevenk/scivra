---
name: unified-work-plan-q2-2026
status: cto-approved
created: 2026-03-22T10:29:04Z
updated: 2026-03-22T10:35:00Z
---

# NeonPhysics v2 — Q2 2026 统一工作计划

> **状态**：CTO APPROVED WITH CHANGES（2026-03-22，MF-1/2/3 已修订）
> **范围**：学科解耦 + 内容生产 + 三大功能模块
> **目标**：PhET 66 物理对标 100% 覆盖 + 化学基础就绪 + AP/Quest/Notebook 上线
> **预估总工时**：88 人天 / 18 周（CTO 修订）

## 一、战略背景

### 当前状态
- 64 个可运行实验（60 HTML + 4 R3F），物理 38 个
- PhET 66 物理模拟覆盖率：26%（5 完全 + 12 部分 + 49 缺失）
- UPG 生成管线成熟（Anthropic Claude Sonnet 4.6 + 质量检查 + 安全沙箱）
- 化学/生物/数学实验已有 27 个（Wave 3-4），但无学科专属 prompt

### 核心判断
1. **内容是王**：没有实验内容，AP Prep/Quest/Notebook 都是空壳
2. **学科解耦现在做**：化学即将启动，一次到位避免 S2 返工
3. **工具先于内容**：先建批量生成管线 + 验证层，再铺内容

### 竞争窗口
arXiv:2412.07482（2024-12）已证明 LLM 生成物理模拟可行，但尚无产品化。窗口期有限，需要加速。

## 二、执行阶段总览

```
Phase 0.5  学科解耦          7天    ← 基础设施（一次到位）
Phase BG   批量生成管线+内容  22天   ← 内容生产（PhET 对标）（CTO: +2d）
Phase 3.5  验证+修正工具      9天   ← 质量保障（CTO: B2 砍掉 -4d）
Phase F1   AP Prep Mode     20天   ← 功能模块（CTO: -2d）
Phase F2   Physics Quest    16天   ← 功能模块
Phase F3   Lab Notebook AI  14天   ← 功能模块
                            ────
                            88天（CTO 修订）
```

关键依赖链：
```
Phase 0.5 ──→ Phase BG ──→ Phase 3.5
                              ↓
              Phase F1 / F2 / F3（可与 BG/3.5 部分并行）
```

## 三、Phase 0.5 — 学科解耦（7 天）

> **来源**：`2026-03-22-discipline-decoupling-implementation-spec.md`（CTO APPROVED WITH CHANGES）
> **目的**：UPG 管线从"仅物理"升级为"可插拔多学科"，S1 只启用 Physics，Chemistry/Biology/Math/Earth-Science 为 stub

### 任务分解

| # | 任务 | 文件 | 新增/改 | 工时 | 依赖 |
|---|------|------|--------|------|------|
| A0 | **🔴 CRITICAL SECURITY: route.ts 迁移到 generateCore()** — 当前 route.ts 104-146 行绕过 generateCore() 直接调 LLM，跳过了 input/output moderation，是安全漏洞。迁移时必须同步迁移 provider 选择逻辑（zenmux/Anthropic 代理条件分支，route.ts 110-116 行） | `api/upg/generate/route.ts` + `generate-core.ts` + `model-selector.ts` | 改 ~100行 | 1d | 无（最先） |
| A1 | 学科类型系统 | `disciplines/types.ts` | 新 ~90行 | 0.5d | A0 |
| A2 | Physics 完整配置 | `disciplines/physics.ts` | 新 ~160行 | 1.5d | A1 |
| A3 | 注册表 | `disciplines/index.ts` | 新 ~40行 | 0.25d | A1,A2 |
| A4 | Chemistry/Bio/Math/Earth stub ×4 | `disciplines/*.ts` | 新 4×50行 | 0.5d | A1 |
| A5 | System Prompt 分层 | `system-prompt.ts` + `lib-versions.ts` | 改 ~120行 | 2d | A2,A3 |
| A6 | generate-core 接入 discipline | `generate-core.ts` | 改 ~10行 | 0.5d | A5 |
| A7 | quality-checker 学科扩展 | `quality-checker.ts` | 改 ~15行 | 0.25d | A3 |
| A8 | API route 传递 discipline | `api/upg/generate/route.ts` | 改 ~8行 | 0.5d | A0,A6 |
| A9 | UI 学科选择器 | `blocks/upg/DisciplineSelector.tsx` | 新 ~70行 | 0.5d | A3 |
| A10 | 回归测试（prompt snapshot + 64 tests） | Vitest | — | 1d | A5-A8 |

**关键路径**：A0 → A1 → A2 → A3 → A5 → A6 → A8 → A10

**CTO 评审要点**：
- A0 是**安全修复**（CRITICAL）：route.ts 当前绕过 generateCore() 跳过 moderation，必须最先做
- A0 迁移时必须带走 provider 选择逻辑（route.ts 110-116 行的 zenmux/Anthropic 条件分支）→ 迁入 generateCore() 或 model-selector.ts
- A10 prompt snapshot 对比为强制门控：重构前后 getSystemPrompt() 输出必须 100% 一致
- 零 DB 迁移（upgGeneration.category 字段已存在）
- 不传 discipline 参数时行为与当前 100% 一致

### 验收标准
- [ ] route.ts 不再直接调用 callOpenRouter/callAnthropic
- [ ] `getSystemPrompt()` 无参数 = 旧行为
- [ ] `getSystemPrompt('physics')` = 旧行为 + 物理专属 prompt
- [ ] `discipline='chemistry'`(disabled) → 返回 "coming soon"
- [ ] TypeScript 编译零错误
- [ ] 现有 64 Vitest 全部通过
- [ ] 10 个物理主题重新生成，质量不回归

## 四、Phase BG — 批量生成管线 + 内容生产（20 天）

> **来源**：`2026-03-22-upg-batch-generation-pipeline.md`
> **目的**：批量生成 PhET 对标的 61 个物理实验（49 新 + 12 升级），覆盖率从 26% → 100%

### 4.1 管线开发（5 天，CTO: +1d prompt 调优迭代）

| # | 任务 | 工时 |
|---|------|------|
| BG1 | CLI 批量生成脚本（直接调 `callAnthropic()`，读 `ANTHROPIC_API_KEY`） | 1d |
| BG2 | 结构化 Prompt 模板系统（BatchPromptConfig 接口 + buildBatchPrompt） | 0.5d |
| BG3 | 物理特定质量检查（checkPhysicsQuality，检查公式/滑块/视觉元素） | 0.5d |
| BG4 | 自动截图审核（Playwright 加载 HTML + 截图） | 0.5d |
| BG5 | 注册集成工具（自动更新 registry.ts + html-map.ts） | 0.5d |
| BG6 | PoC 验证（friction-lab 单个跑通全流程） | 1d |

**技术决策**：
- 直接调 `callAnthropic()` 而非 `callOpenRouter()`，读取 `ANTHROPIC_API_KEY` + `ANTHROPIC_BASE_URL` 环境变量
- 模型：`claude-sonnet-4-6`
- 串行生成，间隔 5s，避免 rate limit
- 失败自动重试（max 3 次），重试时 temperature 从 0.7 提升到 0.8
- 输出到 `public/experiments/ap-physics/`，与现有 Wave 2-7 HTML 一致

**Provider 双路径策略（MF-3）**：
- **批量 CLI 脚本**：直接用 `callAnthropic()` + `ANTHROPIC_API_KEY`，不走 OpenRouter
- **线上 generateCore()**：保持 provider 选择逻辑（A0 迁移后从 route.ts 迁入），支持 Anthropic proxy（zenmux）和 OpenRouter 两条路径
- 两条路径完全独立，互不回退

### 4.2 P0 内容生产（8 天）

14 个全新 + 7 个升级 = **21 个生成任务**

| 分类 | 数量 | 实验列表 |
|------|------|---------|
| 运动与力（新） | 6 | forces-motion-basics, friction-lab, gravity-orbits, pendulum-lab, masses-springs, hookes-law |
| 波（新） | 2 | wave-on-string, waves-intro |
| 电磁（新） | 4 | ac-circuits, ohms-law, coulombs-law, resistance-wire |
| 热力学（新） | 2 | density-lab, pressure-lab |
| 升级 | 7 | gravitational-fields, roller-coaster, k5-energy-conversion, momentum-collisions, k5-sound-waves, electromagnetic-induction, capacitors-rc-circuits |

| 周 | 任务 | 产出 |
|----|------|------|
| D1-2 | 编写 14 个 P0 新实验 prompt 配置 + 7 个升级配置 | YAML 配置完成 |
| D3-4 | 运行批量生成（~21 次 × 1-3 尝试） | 21 个 HTML 初稿 |
| D5-6 | 人工审核 + 不合格重新生成 | 审核报告 |
| D7-8 | 注册到 registry + html-map + 实验数据文件 | 实验可访问 |

### 4.3 P1/P2 内容生产（9 天，CTO: +1d 审核量更大）

23 个 P1 + 10 个 P2 = **33 个生成任务** + 5 个 P1 部分覆盖升级

| 周 | 任务 | 产出 |
|----|------|------|
| D1-2 | 编写 38 个 prompt 配置 | 配置完成 |
| D3-5 | 运行批量生成 | 38 个 HTML 初稿 |
| D6-7 | 审核 + 重新生成 | 审核通过 |
| D8 | 注册 + 数据更新 | 全部完成 |

### 成本估算

| 项目 | 数量 | 单次 tokens | 尝试次数 | 总 tokens | 成本 |
|------|------|------------|---------|----------|------|
| P0 新建 | 14 | 16K | 1.5 | 336K | ~$6.5 |
| P0 升级 | 7 | 20K | 1.5 | 210K | ~$4.0 |
| P1+P2 | 38 | 16K | 1.5 | 912K | ~$17.5 |
| **合计** | **59** | — | — | **1.46M** | **~$28** |

（Claude Sonnet 4.6：$3/M input + $15/M output）

### 验收标准

每个实验必须满足：
- [ ] 核心物理正确（参数调整后行为符合物理定律）
- [ ] 交互完整（≥3 滑块 + Play/Pause/Reset）
- [ ] KaTeX 公式面板（主要公式 + 实时计算值）
- [ ] Quiz（≥1 道选择题）
- [ ] 视觉质量不低于 PhET 对应模拟
- [ ] 通过 checkQuality + checkPhysicsQuality 自动检查
- [ ] 浏览器截图审核通过

## 五、Phase 3.5 — 验证 + 修正工具（13 天）

> **来源**：`2026-03-22-discipline-decoupling-implementation-spec.md` 第二部分（CTO APPROVED）
> **目的**：批量生成后的质量保障 + 不合格实验修复

### 5.1 物理验证层 B1（4 天）

| # | 任务 | 工时 |
|---|------|------|
| B1a | 验证框架（ValidationRule 接口 + 规则引擎） | 1.5d |
| B1b | 物理验证规则（能量守恒/物理常数/解析解叠加/NaN保护/SI单位） | 1d |
| B1c | 集成到 generate-core + DB 字段（validation_score/details/validated_at） | 0.5d |
| B1d | UI Verified 标签（Gallery 卡片 + 详情页 + 筛选） | 1d |

**DB 变更**：`upgGeneration` 新增 3 字段
```
validation_score   integer
validation_details text (JSON)
validated_at       timestamp
```

### ~~5.2 增量生成 B2~~ → 推迟到 S2（CTO 决策）

> **CTO 评审结论**：S1 不做 B2。先跑完批量生成看通过率：
> - 通过率 > 70%: 不做 B2，不合格的手动调 prompt 重跑
> - 通过率 50-70%: 考虑做 B2，阈值提高到 complexity >= 7
> - 通过率 < 50%: 问题出在 prompt 质量，B2 解决不了根本问题
>
> 省下 4 天工时用于管线 prompt 调优（+1d）和集成联调（+2d）。

### 5.2 对话修正 B3（5 天）

| # | 任务 | 工时 |
|---|------|------|
| B3a | refine-core（修正管线 + model 函数补充） | 2d |
| B3b | refine API（`/api/upg/[id]/refine` + moderation + 分布式锁） | 1d |
| B3c | DB 字段（version/parentId/refinementPrompt）+ 版本历史 UI | 1.5d |
| B3d | 手动测试修正流程 | 0.5d |

**DB 变更**：`upgGeneration` 新增 3 字段 + 1 索引
```
version             integer DEFAULT 1
parent_id           text
refinement_prompt   text
idx_upg_generation_parent ON (parent_id)
```

**常量新增**：`UPG_CREDITS_PER_REFINEMENT = 3`

### 验收标准
- [ ] runFullValidation() 对现有 60 个 HTML 实验全部跑通（不阻断）
- [ ] Verified 标签在 Gallery 正确显示
- [ ] refine API：修正后版本链完整（parentId → 可追溯）
- [ ] 所有新 API 有 rate limiting + moderation

## 六、Phase F1 — AP Prep Mode（20 天，CTO: -2d 标准 CRUD）

> **来源**：`2026-03-22-ap-prep-mode-design.md`
> **依赖**：Phase BG（AP 题目的 UPG 解析需要批量生成基础）

### 数据模型（5 张新表）

```
ap_exam           考试类型(AP Physics 1/2/C-Mech/C-E&M)
ap_unit           知识单元(力学/电磁学等)
ap_question       题目 → upgGenerationId 外键关联 UPG 缓存
ap_attempt        做题记录
ap_user_progress  用户进度(按 unit 统计)
```

### 任务分解

| 阶段 | 内容 | 工时 |
|------|------|------|
| Phase 1 | 数据基础（5 表 + seed 脚本 + AP Physics 1 Unit 1-3 共 30 题） | 3d |
| Phase 2 | API 层（10 端点：题库CRUD + 判分 + 进度 + UPG缓存） | 4d |
| Phase 3 | 前端（Landing + 题库列表 + 做题 + UPG解析 + 进度 Dashboard） | 7d |
| Phase 4 | Admin 后台（考试/单元/题目 CRUD） | 3d |
| Phase 5 | 测试 + 打磨 | 3d |

### 关键设计决策

| 决策 | 选择 | 原因 |
|------|------|------|
| UPG 集成 | 混合模式（高频题预生成缓存 + 长尾题按需生成） | 平衡成本和体验 |
| 防作弊 | 未提交答案前 API 不返回 correctAnswer | 服务端判分 |
| 限额 | 复用 upgDailyQuota（不同 scene） | 统一配额体系 |
| 内容策略 | V1 只做 AP Physics 1 | 集中验证，不铺太宽 |

### 风险

| 风险 | 影响 | 缓解 |
|------|------|------|
| College Board 题目版权 | 内容受限 | 自编原创题 + "inspired by AP style" |
| UPG 缓存一致性 | 题目更新后旧缓存失效 | 缓存带版本号，题目更新时清缓存 |

## 七、Phase F2 — Physics Quest（16 天）

> **来源**：`2026-03-22-physics-quest-design.md`
> **依赖**：软依赖 Phase BG P0（Quest Observe 步骤嵌入已注册实验，集成测试需 BG P0 完成）；可与 Phase F1 并行，共享 Schema 迁移

### 数据模型（6 张新表 + 2 字段修改）

```
quest               挑战任务
quest_step          步骤(knowledge/predict/experiment/compare/explain)
quest_attempt       用户挑战记录
quest_step_response 步骤回答
achievement         成就定义
user_achievement    用户成就记录
+ learningStats 加 questsCompleted / achievementsEarned
```

### 任务分解

| 阶段 | 内容 | 工时 |
|------|------|------|
| Phase 1 | 数据基础（6 表 + 成就引擎） | 3d |
| Phase 2 | API 层（12 端点：Quest CRUD + 做题 + 评分 + 成就触发） | 4d |
| Phase 3 | 前端（Quest 列表/地图 + 步骤组件 + 成就/徽章） | 5d |
| Phase 4 | 周度挑战（Redis sorted set 排行榜，TTL 8 天） | 2d |
| Phase 5 | 种子内容（3 个牛顿力学 Quest）+ 测试 | 2d |

### 关键设计决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 教学模型 | POE（Predict-Observe-Explain） | 研究支持概念理解提升 |
| 评分 | V1 数值容差 + 选择题 | 简单优先，AI 评分留 Pro |
| 实验嵌入 | 复用 Curated Labs（onDataChange callback） | 不重建实验场景 |
| 排行榜 | Redis sorted set | 不侵入 PostgreSQL 主库 |

## 八、Phase F3 — Lab Notebook AI（14 天）

> **来源**：`2026-03-22-lab-notebook-ai-design.md`
> **依赖**：Phase BG 完成（Notebook 需引用实验数据）

### 数据模型（3 张新表）

```
lab_notebook         笔记本主表(关联 experiment/UPG)
lab_notebook_version 版本历史(乐观锁)
lab_notebook_export  PDF 导出记录
```

### 任务分解

| 阶段 | 内容 | 工时 |
|------|------|------|
| Phase 1 | 数据层 + CRUD API（3 表 + 基本 API） | 3d |
| Phase 2 | AI 辅助（上下文提取 + LLM 调用 + Socratic method） | 3d |
| Phase 3 | 前端 UI（Drawer + 编辑器 + 5 区块：Hypothesis/Method/Data/Analysis/Conclusion） | 4d |
| Phase 4 | PDF 导出（@react-pdf/renderer 客户端） | 2d |
| Phase 5 | 笔记本列表页 + 打磨 | 2d |

### 关键设计决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 编辑器 | textarea + Markdown 预览 | 不引入 Tiptap/Plate，减少 30-50KB bundle |
| PDF 生成 | @react-pdf/renderer 客户端 | 不占 serverless 资源 |
| AI 策略 | 预填 Method/Data，Analysis 用 Socratic method | 不代写答案，给思考框架 |
| 中文 PDF | MVP 不支持 | 字体体积问题，V2 解决 |

## 九、Schema 迁移策略

所有新表**一次性迁移**（避免多次 db:push 风险）：

| 来源 | 新增表 | 字段修改 |
|------|--------|---------|
| Phase F1 AP Prep | 5 张 | — |
| Phase F2 Quest | 6 张 | learningStats +2 字段 |
| Phase F3 Notebook | 3 张 | — |
| Phase 3.5 验证 | — | upgGeneration +3 字段 |
| Phase 3.5 修正 | — | upgGeneration +3 字段 + 1 索引 |
| **合计** | **14 张新表** | **8 字段 + 1 索引** |

迁移时机：Phase BG P1/P2 开始时（Week 5 D1）。

**迁移保护措施（MF-2）**：
1. `pnpm db:generate` 生成 SQL 文件后，**人工审查**生成的 migration SQL（检查外键顺序、命名冲突、索引重复）
2. 本地测试库完整跑一遍，确认 0 error
3. 生产库迁移前创建备份 snapshot
4. 14 张全是**新增表**（不改现有表结构），风险可控但需要走流程

## 十、时间线（18 周，CTO 修订）

```
Week 1-2:    Phase 0.5 学科解耦（A0-A10，7天）
             ├─ W1: A0 route.ts 安全迁移(CRITICAL) → A1 类型 → A2 Physics 配置 → A3 注册表
             └─ W2: A4 Stub → A5 Prompt 分层 → A6-A8 管线接入 → A9 UI → A10 回归

Week 3-4:    Phase BG 管线开发 + P0 生产（13天）
             ├─ W3: BG1-BG6 脚本开发(5d) + PoC(friction-lab) → P0 prompt 配置
             └─ W4: P0 批量生成(21个) → 审核 → 注册

Week 5-6:    Phase BG P1/P2 + Schema 迁移（9天 + 1天）
             ├─ W5 D1: 14张新表 Schema 迁移（先审查SQL→本地测试→备份→推生产）
             ├─ W5: P1 prompt 配置 → 批量生成(23个)
             └─ W6: P2 生成(10个+5升级) → 审核 → 注册 → PhET 66 对标完成 ✅

Week 7-8:    Phase 3.5 验证+修正（9天，B2 已砍）
             ├─ W7: B1 物理验证层(4天)
             └─ W8: B3 对话修正(5天)

Week 9-12:   Phase F1 AP Prep Mode（20天）
             ├─ W9: 数据基础(3d) + API(4d)
             ├─ W10-11: 前端（题库+做题+UPG解析+进度 7d）
             └─ W12: Admin(3d) + 测试(3d)

Week 13-15:  Phase F2 Physics Quest（16天）
             ├─ W13: 数据+API(7d)
             ├─ W14: 前端(5d)
             └─ W15: 周度挑战 + 种子内容 + 测试(4d)

Week 16-17:  Phase F3 Lab Notebook AI（14天）
             ├─ W16: 数据+AI辅助+前端(10d)
             └─ W17: PDF导出 + 列表页 + 打磨(4d)

Week 18:     集成联调 + 上线准备（7天，CTO: +2d 权限矩阵）
             ├─ 三模块端到端联调
             ├─ Free/Pro 权限差异验证
             └─ 性能测试 + 部署
```

### 里程碑

| 里程碑 | 时间 | 验收标准 |
|--------|------|---------|
| **M1: 安全修复+学科解耦完成** | Week 2 末 | A0 安全修复上线 + A10 回归测试通过 + prompt snapshot 一致 |
| **M2: 批量管线可用** | Week 3 末 | PoC(friction-lab) 全流程跑通 |
| **M3: PhET 66 对标 100%** | Week 6 末 | 66 个物理实验全部可运行 + 审核通过 |
| **M4: 验证+修正工具就绪** | Week 8 末 | Verified 标签可用 + refine API 可用 |
| **M5: AP Prep 上线** | Week 12 末 | AP Physics 1 刷题链路可走通 |
| **M6: Quest 上线** | Week 15 末 | 3 个 Quest 可完成 + 排行榜可用 |
| **M7: Notebook 上线** | Week 17 末 | 笔记本创建→AI预填→PDF导出链路通 |
| **M8: 全部上线** | Week 18 末 | 三模块联调通过 + 权限生效 |

## 十一、成本预算

| 项目 | 金额 | 说明 |
|------|------|------|
| PhET 对标内容生成 | ~$28 | 59 个实验 × 1.5 次 × 16K tokens |
| AP Prep UPG 缓存预生成 | ~$10 | 30 题 × 1 次 |
| Prompt 调优迭代（CTO 补充） | ~$12 | PoC 阶段反复迭代 prompt 模板 |
| 日常 UPG 生成（开发测试） | ~$15 | 估算 |
| **AI 总预算** | **~$75** | （CTO 修订：+$15 prompt 调优） |

## 十二、风险矩阵

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| UPG 批量生成通过率 < 50% | 中 | P0 延期 | PoC 先验证，不够则调 prompt 或用增量生成 |
| College Board 版权 | 低 | AP Prep 内容受限 | 自编原创题，不直接使用真题 |
| Phase 0.5 prompt 分层引入回归 | 低 | 生成质量下降 | A10 snapshot 强制门控 |
| 14 张表一次性迁移出错 | 低 | 全部阻断 | 先在测试库跑，确认后推生产 |
| route.ts 安全漏洞（MF-1） | 高 | 恶意内容绕过审核 | A0 最先做，CRITICAL 优先级 |
| 化学 Prompt 质量不够 | 中 | S2 延期 | S1 只做 stub，化学启动前先做 PoC |

## 十三、与现有计划的关系

| 现有阶段 | 状态 | 本计划影响 |
|---------|------|----------|
| Phase 0（UPG 核心） | 进行中 | 无冲突，OrbitControls 修复继续 |
| Phase 1-2（用户系统+画廊） | 已完成 | 无冲突 |
| Phase 3（高级生成选项） | 未开始 | 被 Phase 0.5 + 3.5 替代（学科检测覆盖） |
| Phase 4-7（监控/SEO/E2E/Cron） | 未开始 | 推迟到 Phase F1-F3 完成后 |

## 十四、CTO 评审结果

**结论**：APPROVED WITH CHANGES（2026-03-22）
**评审文档**：`2026-03-22-unified-work-plan-cto-review.md`

### 已采纳的修订

| # | CTO 要求 | 处理 |
|---|---------|------|
| **MF-1** | A0 标注 CRITICAL SECURITY | ✅ 已标注，route.ts 跳过 moderation 是安全漏洞 |
| **MF-2** | Schema 迁移加保护 | ✅ 审查SQL→本地测试→备份→推生产 |
| **MF-3** | Provider 逻辑文档化 | ✅ 双路径策略（CLI直连 vs 线上保持选择逻辑） |
| SF-1 | 砍 B2 增量生成 | ✅ 推到 S2，先看批量通过率 |
| SF-3 | AI 预算 $60→$75 | ✅ 补充 prompt 调优成本 |
| SF-4 | F2 软依赖 BG P0 | ✅ 已修正依赖描述 |
| SF-5 | A0 迁移 provider 选择逻辑 | ✅ 已写入 A0 任务描述 |

### 工时变更

| 调整 | 原 → 新 | 原因 |
|------|---------|------|
| Phase BG 管线 | 4d → 5d | +1d prompt 调优迭代 |
| Phase BG P1/P2 | 8d → 9d | +1d 38个实验审核量更大 |
| Phase 3.5 B2 | 4d → 0d | 砍掉推 S2 |
| Phase F1 | 22d → 20d | -2d 标准 CRUD |
| 集成联调 | 5d → 7d | +2d 三模块权限矩阵 |
| **总计** | **92d → 88d** | **-4d** |

### 附件索引

- `2026-03-22-discipline-decoupling-implementation-spec.md` — Phase 0.5 + 3.5 行级别规格
- `2026-03-22-upg-batch-generation-pipeline.md` — 批量生成管线 + P0 prompt 配置
- `2026-03-22-ap-prep-mode-design.md` — AP Prep 详细设计
- `2026-03-22-physics-quest-design.md` — Quest 详细设计
- `2026-03-22-lab-notebook-ai-design.md` — Notebook 详细设计
- `2026-03-22-phase1-overview.md` — 三模块总览
- `2026-03-22-unified-work-plan-cto-review.md` — CTO 评审报告
- `IDEA_REPORT.md` — 全量创意报告
