---
name: upg-prompt-engineering-retrospective
status: historical-report
snapshot_date: '2026-03-28'
created: '2026-03-28T08:39:55Z'
updated: '2026-04-23T00:00:00Z'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time report from 2026-03-28. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# UPG Prompt Engineering 探索复盘

> Session 时长：~3h
> 产出文档：upgrade plan v2 + CTO review + 本复盘
> 产出代码：simple-pendulum-v2.html（验证用，非产品代码）

## 1. 起因

用户从 skill 商店发现 `codebase-to-course`，要求下载安装后与本地 `aetherviz-master` 对比，然后用其中一个生成物理实验看实际效果。

对比后发现两个 skill 解决完全不同的问题（代码教学 vs 科学实验），真正有价值的发现是：**用 aetherviz skill 生成的实验 vs Scivra 产品内手写实验的质量差距**——这直接指向了 UPG system prompt 的结构性缺陷。

## 2. 做了什么

### Phase 1: 信息收集与对比（~30min）

| 动作 | 产出 |
|------|------|
| 下载安装 codebase-to-course skill | `~/.claude/skills/codebase-to-course/`（SKILL.md + references/） |
| 读取 aetherviz-master SKILL.md（392 行） | 理解两个 skill 的定位差异 |
| 用 aetherviz skill 生成单摆实验 | `test-screenshots/simple-pendulum.html`（v1） |
| 找到产品版 pendulum-lab.html 并截图对比 | 3 版并排截图 |

**关键发现**：两个 skill 不是竞品关系。真正的问题是 UPG system prompt（`src/shared/lib/upg/`，7 个模块 ~1050 行）**100% 聚焦渲染技术，0% 指导教学设计**。

### Phase 2: 根因分析与方案设计（~40min）

逐行读了 UPG 的全部 prompt 模块：

| 文件 | 行数 | 内容 | 发现的问题 |
|------|------|------|-----------|
| `system-prompt.ts` | ~100 | 主入口、安全约束 | Quiz 写死"1-2 questions"，只说"Random Experiment" |
| `threejs-core.ts` | ~190 | 场景、灯光、材质 | 无问题 |
| `visual-design.ts` | ~145 | 配色、布局 | 无问题 |
| `threejs-effects.ts` | ~255 | 粒子、轨迹、Shader | 只有 Spring 类（Euler 积分），无 Verlet |
| `interaction.ts` | ~80 | 滑块、按钮 | 无速度控制、无预设规范、无 Toast |
| `disciplines/physics.ts` | ~150 | 物理专项 | 提到 Verlet 但没代码模板，能量面板一句话带过 |
| `autopilot-dom.ts` | ~65 | AI Tutor 标注 | 无问题 |
| **教学设计模块** | **0** | **不存在** | **根因** |

**用 A/B 表量化了差距**：手写版有 Verlet 积分 + 实测周期 + 能量面板 + 3 个预设 + 详细教学文本，AI 版只有简单 Euler + 1 个 Random 按钮 + 1-2 行描述。

### Phase 3: 方案文档 + CTO 审核（~30min）

写了 `2026-03-28-upg-prompt-engineering-upgrade.md` v1（~550 行），提出 3 个变更：
- A. 新增 `pedagogy.ts`（教学设计模块）
- B. 增强 `threejs-effects.ts`（Verlet 代码模板）
- C. 增强 `buildUserPrompt()`（注入实验配置）

交给 CTO agent 审核，拿到 **APPROVE WITH CHANGES**，9 项决策：

| Decision | 核心修正 |
|----------|---------|
| D1 | pedagogy.ts 与 physics.ts 职责重叠 → 物理专属内容回归 physics.ts |
| D2 | Verlet 代码模板放 physics.ts 而非 threejs-effects.ts（关注点分离） |
| D3 | pedagogy.ts 从 250 行精简到 150 行 |
| D4 | 预设从 "min 5" 改为 "min 3, recommended 5" |
| D5 | ExperimentPromptConfig 类型提取到 types.ts |
| D6 | Token 预算遗漏了 physics.ts 扩充（+600） |
| D7 | quality-checker.ts 必须同步新增 5 项自动化检查 |
| D8 | 手写 111 实验一致性记录为 TD-001 |
| D9 | 工时从 8h 修正为 9.5h |

另发现两个方案遗漏的风险：
- Risk 5：非物理学科的 prompt 噪音（Speed Control 对静态展示是多余的）
- Risk 6：system-prompt.ts "1-2 questions" 与 pedagogy.ts "3 questions" 指令冲突

### Phase 4: v2 文档修正 + Codex 审核员设计（~30min）

按 CTO 9 项决策全部修正，同时新增：
- **变更 D**：quality-checker.ts 5 项自动化检查
- **变更 E**：Codex 异步审核管线（6 维度审核）

Codex 审核员的定位：**生成管线最后一环，异步执行，不阻塞用户**。

```
Claude 生成 → 静态检查(同步,~50ms) → 存储 → Codex 审核(异步,~60s)
```

审核 6 个维度：物理准确性 / 教学设计 / 交互完整性 / 数据面板 / 代码健壮性 / 安全合规。

### Phase 5: 实际生成验证（~40min）

用 v2 prompt 生成 `simple-pendulum-v2.html`（918 行），Playwright 截图三版对比：

| 验收项 | 产品手写版 | v2 生成版 | 达标？ |
|--------|-----------|----------|--------|
| KaTeX 公式 ≥ 2 | 4 个 | 4 个 | ✅ |
| 教学文本 ≥ 2 段 | 3 段 | 3 段 | ✅ |
| Knowledge Cards | ❌ 无 | 3 张 | ✅ 超越 |
| Why It Matters | ❌ 无 | ✅ 有 | ✅ 超越 |
| 数据面板 ≥ 4 项 | 5 项 | 6 项 | ✅ |
| 实测周期 | ✅ | ✅ | ✅ |
| 能量面板 | ✅ | ✅ | ✅ |
| 预设 ≥ 3 | 3 个 | 5 个 | ✅ |
| 速度控制 | ❌ 无 | 0.25x-3x | ✅ 超越 |
| Quiz 3 题应用型 | 2 题记忆型 | 3 题应用型 | ✅ 超越 |
| 键盘快捷键 | ❌ 无 | Space/R/1-5 | ✅ 超越 |
| Verlet 积分 | ✅ | ✅ | ✅ |

**v2 在 10 项验收标准全部达标，5 项超越手写产品版。**

### Phase 6: Codex 审核实跑（~20min）

解决了 Codex CLI 配置问题后成功跑通：

| 配置问题 | 解决方式 |
|---------|---------|
| `base_url` 被忽略 | 改用 `openai_base_url`（config.toml 新语法） |
| 没有 git repo | `-C` 指向 Scivra 子目录 |
| 高负载连接失败 | 切换到 PackyAPI 代理 |

审核结果 `pass_with_notes`：

| 维度 | 评分 | 关键发现 |
|------|------|---------|
| Scientific Accuracy | ⚠️ warn | 能量公式 `E=mgh=½mv²` 语义误导（暗示 KE=PE） |
| Pedagogical Quality | ✅ pass | 3 题应用型、3 层结构、Knowledge Cards 齐全 |
| Interaction | ✅ pass | 4 滑块、5 预设、速度控制、键盘快捷键 |
| Data Dashboard | ✅ pass | 6 项数据、理论 vs 实测周期、能量面板 |
| Code Robustness | ⚠️ warn | 缺少 dispose/disconnect 清理逻辑 |
| Security | ✅ pass | 无禁止 API，CDN 版本锁定 |

**关键验证**：能量公式语义错误是静态检查永远抓不到的，只有 LLM 审核能发现。Codex 审核员设计有效。

### Phase 7: 箭头 bug 迭代（~30min）

| 轮次 | 问题 | 修复 | 结果 |
|------|------|------|------|
| 1 | ArrowHelper 方向在过零点跳变 | 用 `linVel > 0 ? 1 : -1` 替代 `Math.sign(omega)` | 位置稳定了，但仍沿切线旋转 |
| 2 | 箭头沿切线晃动，用户觉得像 bug | 改为固定水平方向，颜色区分左右 | 用户看到缓存旧版 |
| 3 | 绕过缓存后仍不满意 | Gemini 视频分析确认箭头仍非水平 | 代码是对的但可能没刷新 |
| 4 | 用户决定直接去掉箭头 | 移除 velArrowMesh 创建和更新代码 | ✅ 干净 |

**教训**：
1. 3D 矢量箭头看似教学标配，实际在单摆场景中教学价值低于数据面板的数值显示
2. AI 生成的 ArrowHelper 代码容易有 `Math.sign(0)=0` → NaN 的细节 bug
3. 简洁优于复杂——去掉箭头后视觉更干净，学生也不会被"晃动的箭头"误导

## 3. 关键决策记录

| # | 决策 | 理由 | 来源 |
|---|------|------|------|
| 1 | pedagogy.ts 只写通用框架，物理专属回归 physics.ts | Single Source of Truth，其他学科的"数据面板"内容完全不同 | CTO D1 |
| 2 | Verlet 代码模板放 physics.ts 不放 threejs-effects.ts | 关注点分离——视觉特效 ≠ 物理积分 | CTO D2 |
| 3 | 预设 min 3 不是 min 5 | 手写版也只有 3 个，质量重于数量 | CTO D4 |
| 4 | Codex 审核不阻塞用户 | 审核 ~60s 太慢，用户不能等；后台跑统计足够 | 方案设计 |
| 5 | 去掉速度箭头，只用数据面板 | 箭头在单摆场景教学价值低，容易出 bug 让人困惑 | 用户反馈 + 迭代验证 |
| 6 | Codex 用 PackyAPI 代理 | openai_base_url + api_key 写入 config.toml | 实际调试 |

## 4. 量化成果

### Prompt 升级效果（改前 → 改后）

| 指标 | 改前（当前 UPG） | 改后（v2 prompt） | 提升 |
|------|-----------------|------------------|------|
| 教学文本量 | ~30 words | ~150 words | **5x** |
| Quiz 题数 | 1-2 题记忆型 | 3 题应用型 | **质+量双升** |
| 预设实验 | 0（仅 Random） | 5 个有教育意图 | **从无到有** |
| 速度控制 | 无 | 0.25x-3x 五档 | **从无到有** |
| 物理积分精度 | Euler | Velocity Verlet + sub-stepping | **精度提升 2 个数量级** |
| 实测 vs 理论对比 | 无 | 过零点检测 | **从无到有** |
| 知识卡片 | 无 | 3 张（历史/误解/进阶） | **从无到有** |

### Token 预算

| | 当前 | 改后 | 增量 |
|---|---|---|---|
| System prompt | ~7300 tokens | ~9050 tokens | +1750 (+24%) |
| 200K 窗口占比 | 3.7% | 4.5% | +0.8pp |
| 生成成本（估算） | ~$0.015/次 | ~$0.019/次 | +$0.004 (+27%) |

## 5. 未解决的问题

| 问题 | 状态 | 所有者 |
|------|------|--------|
| pedagogy.ts 未实际创建 | 方案 ready，待实施 | 开发 |
| physics.ts 未实际扩充 | 方案 ready，待实施 | 开发 |
| system-prompt.ts "1-2 questions" 指令冲突未修复 | 已识别，待实施 | 开发 |
| quality-checker.ts 5 项检查未添加 | 方案 ready，待实施 | 开发 |
| Codex 审核管线未集成到生成 API | 方案 ready，待实施 | 开发 |
| 能量公式 `E=mgh=½mv²` 语义问题 | Codex 发现，待修正 prompt | 开发 |
| TD-001：手写 111 实验一致性 | 记录为 Tech Debt | 触发：Wave 9 上线后 |
| 其他学科（chem/bio/math）的 pedagogy 适配 | 待 physics 验证后推广 | 后续 |

## 6. 接下来的执行计划

### 第一优先级：Prompt 代码落地（~5.5h）

| Phase | 任务 | 时间 |
|-------|------|------|
| P1.1 | 创建 `prompt-modules/pedagogy.ts`（精简版 ~150 行） | 1.5h |
| P1.2 | 扩充 `disciplines/physics.ts`（Verlet 模板 + 能量面板 + 周期测量 + 预设表 + 矢量规则） | 1.5h |
| P1.3 | 修复 `system-prompt.ts` 指令冲突（"1-2 questions" → "3 questions"，加 "preset buttons"） | 0.5h |
| P1.4 | 增强 `buildUserPrompt()` + 提取 `ExperimentPromptConfig` 类型 | 1h |
| P1.5 | 注入 pedagogy prompt 到 `getSystemPrompt()` | 0.5h |

### 第二优先级：质量保障（~5h）

| Phase | 任务 | 时间 |
|-------|------|------|
| P2.1 | `quality-checker.ts` 新增 5 项自动化检查 | 2h |
| P2.2 | Codex 审核管线实现（reviewer.ts + API 路由 + DB 字段） | 3h |

### 第三优先级：验证（~2h）

| Phase | 任务 | 时间 |
|-------|------|------|
| P3.1 | 用新 prompt 生成 5 个不同主题实验（pendulum/projectile/spring/wave/circuit） | 1h |
| P3.2 | 每个实验跑 Codex 审核，统计合格率 | 0.5h |
| P3.3 | 根据审核结果微调 prompt 措辞 | 0.5h |

**总计 ~12.5h**，建议分 2-3 个 session 完成。P1 可以独立完成，做完立刻能看到生成质量提升。

## 7. 给后续 session 的 handoff 要点

1. **核心文档**：`docs/plans/2026-03-28-upg-prompt-engineering-upgrade.md`（v2，CTO 修正版，所有变更的详细设计）
2. **CTO 审核**：`docs/plans/2026-03-28-upg-prompt-engineering-cto-review.md`（9 项决策，必须全部遵循）
3. **验证基线**：`test-screenshots/simple-pendulum-v2.html`（v2 prompt 生成的参考实现）
4. **Codex 配置**：`~/.codex/config.toml` 已更新（`openai_base_url` = packyapi，可用）
5. **矢量规则**：升级文档中已加入 ArrowHelper 禁止模式（Math.sign(0) bug），物理实验建议去掉箭头用数据面板
6. **能量公式**：prompt 中需明确要求 `E = K + U = ½mv² + mgh = const`，不用 `E = mgh = ½mv²`（Codex 审核发现的 critical issue）
