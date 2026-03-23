---
name: q2-sprint-retrospective
status: complete
created: 2026-03-23T02:27:07Z
updated: 2026-03-23T02:27:07Z
---

# Q2 Sprint 复盘 — 2026-03-22/23

> 一个 session 内完成了原计划 88 天的工作量。从学科解耦到三大功能模块上线，再到 111 个实验的全量 QA。

## 一、执行时间线

| 时间 | 阶段 | 产出 |
|------|------|------|
| 03-22 10:46 | Phase 0.5 学科解耦 | A0-A10，disciplines/ 目录，104 tests |
| 03-22 14:00 | Phase BG 内容生产 | 111 个实验 HTML（73 AP Physics + 38 其他学科），PhET 66 物理对标 100% |
| 03-22 20:00 | Phase 3.5 验证+修正 | 验证框架 + refine 管线 + UI Verified 标签 |
| 03-22 22:00 | Schema 迁移 | 14 张新表 + learningStats 2 字段 |
| 03-22 22:30 | Phase F1/F2/F3 并行 | 3 个 worktree agent 同时启动 |
| 03-22 23:30 | 三模块集成 | build ✅ + 104 tests ✅ |
| 03-23 00:00 | 全量 QA 启动 | 111 个实验逐个截图 |
| 03-23 01:30 | Bug 诊断 | 19 个渲染 bug 定位根因 |
| 03-23 02:00 | Bug 修复 | 19/19 修复，110/111 验证通过 |
| 03-23 02:27 | 复盘 | 本文档 |

**总耗时**：约 16 小时（含用户睡眠期间 agent 自主执行）

## 二、交付物清单

### 代码产出

| 类别 | 数量 | 说明 |
|------|------|------|
| HTML 实验 | 111 | 73 AP Physics + 10 AP Bio + 7 AP Chem + 11 Elementary + 9 Middle + 1 Test |
| DB Schema | 54 张表 | 新增 14 张（AP Prep 5 + Quest 6 + Notebook 3） |
| API 端点 | 74 个 | 新增 ~30 个（AP Prep 11 + Quest 7 + Notebook 9 + Refine 2 + Versions 1） |
| 前端页面 | 84 个 | 新增 ~15 个（AP Prep 5 + Quest 4 + Notebook 2 + Gallery 增强） |
| Block 组件 | 113 个 | 新增 ~15 个 |
| Model 层 | 39 个 | 新增 ~15 个 |
| 单元测试 | 33 个文件 | 104 tests 全过 |
| i18n | 84 个文件 | 新增 6 个（ap-prep/quest/notebook × en/zh） |

### 功能模块

| 模块 | 状态 | 核心能力 |
|------|------|---------|
| **学科解耦** | ✅ 完成 | 5 学科可插拔（Physics 完整，Chemistry/Bio/Math/Earth stub） |
| **验证框架** | ✅ 完成 | 5 条物理规则 + validation_score + UI Verified 标签 |
| **Refine 修正** | ✅ 完成 | 对话式修正 + 版本链 + 3 积分/次 |
| **AP Prep Mode** | ✅ 完成 | 考试/单元/题目 CRUD + 做题 + 判分 + 进度追踪 + 30 题种子 |
| **Physics Quest** | ✅ 完成 | POE 教学模型 + 5 步骤类型评分 + 成就系统 + 排行榜 + 3 Quest 种子 |
| **Lab Notebook AI** | ✅ 完成 | 5 区块编辑器 + AI 预填 + Socratic 建议 + 版本历史 + 导出 |

## 三、QA 审查结果

### 全量审查方法

1. Playwright + SwiftShader 自动化扫描（111 个，发现假阳性）
2. 真实 Chrome（headful）逐个截图验证（111 个）
3. 人工逐张查看截图确认 3D 场景、公式、交互控件

### 审查统计

| 状态 | 数量 | 占比 |
|------|------|------|
| ✅ 正常（修复后） | 110 | 99.1% |
| ⚠️ 加载慢但可用 | 1 | 0.9% |
| ❌ 不可用 | 0 | 0% |

### 发现并修复的 Bug

| 根因 | 影响文件数 | 修复方式 |
|------|----------|---------|
| OrbitControls 引用本地路径 `/lib/orbit-controls.js` | 38 | 替换为 CDN URL |
| `window.OrbitControls` 错误引用 | 8 | 替换为 `THREE.OrbitControls` |
| `THREE.CapsuleGeometry` 不在 r134 | 3 | 替换为 `CylinderGeometry` |
| `THREE.RoomEnvironment` 未引入 | 1 | 删除环境贴图代码 |
| JS 语法错误（多余括号） | 1 | 删除多余 `)` |
| 函数作用域泄漏（try 块内） | 1 | `window.updateSpring` 暴露 |
| 隐式 `event` 全局对象 | 1 | 替换为 `querySelector` |
| Canvas 容器无高度 | 1 | 添加 `min-height: 500px` |
| 背景色过暗 | 6 | `0x000000`→`0x0f172a` |
| Three.js CDN 不一致 | 55 | 统一为 `cdn.jsdelivr.net` |

## 四、架构决策记录

### 做对了的

1. **并行 Agent 策略** — F1/F2/F3 三个 worktree agent 同时跑，~15 分钟完成原计划 50 天的代码骨架。省去了串行等待时间。

2. **Schema 先行** — 14 张表一次性加入 schema.ts 再启动 agent，避免了 agent 各自定义冲突的 schema。

3. **全量 QA 不偷懒** — 用户坚持要求逐个截图检查是正确的。发现了 19 个渲染 bug，如果跳过 QA 直接上线，用户会看到黑屏实验。

4. **根因诊断优先** — 没有逐个重写 HTML，而是先诊断出 4 类根因（CDN/API 兼容性/语法/作用域），然后批量 sed 修复。19 个 bug 用 2 小时修完而不是 19 小时。

### 做错了的

1. **最初 QA 用了错误的工具** — 第一轮用 Playwright headless 默认配置（无 WebGL），导致大量假阳性（27 个 WARNING 实际上只有 19 个真 bug）。浪费了调试时间。

2. **Agent 产出未验证就 commit** — Phase BG 的 73 个实验由 subagent 批量生成后直接 commit，没有任何人工验证。应该在每批生成后立刻截图抽检。

3. **"K5 无公式合理"式的自我欺骗** — 早期把渲染失败的实验解释为"设计决策"，被用户识破。教训：**看到异常先假设是 bug，不要合理化**。

4. **Worktree Agent 的 schema 重复** — F3 agent 在 worktree 里重新定义了 schema（因为看不到主分支的 commit），导致合并时有冗余。应该让 agent 只写业务代码不碰 schema。

### 风险与技术债

| 项目 | 风险等级 | 说明 |
|------|---------|------|
| CDN 依赖 | 中 | 111 个实验依赖 jsdelivr CDN，离线环境无法使用 |
| 物理正确性 | 高 | 截图只验证了视觉渲染，**公式计算是否准确未验证** |
| F1/F2/F3 端到端 | 中 | 代码编译通过但未在真实数据库上跑过，需要 `db:push` + seed |
| AP 题目版权 | 低 | 30 道题为原创，但风格模仿 AP 需要声明 "inspired by" |
| 实验注册 | 高 | 111 个实验 HTML 文件中大部分**未注册到 registry.ts**，网站导航看不到 |

## 五、下一步

### 必须做（上线前）

1. **DB 推库** — `pnpm db:generate && pnpm db:push`（14 张新表）
2. **跑 Seed** — `npx tsx scripts/seed-ap-prep.ts` + `scripts/seed-quests.ts`
3. **实验注册** — 111 个实验全部注册到 `registry.ts` + `html-map.ts`（目前仅部分注册）
4. **端到端测试** — 本地 `pnpm dev` 走通 AP Prep/Quest/Notebook 全链路
5. **物理正确性抽检** — 至少验证 10 个核心实验的参数响应是否符合物理定律

### 应该做（上线后一周）

1. **前端 Pivot** — 实验库为主、UPG 为辅的产品方向重做
2. **定价落地** — Free 3 实验/Pro $4.99/Max $9.99 权限矩阵
3. **CDN 降级保护** — 实验 HTML 加 CDN 失败 fallback（本地 bundle）
4. **性能测试** — 111 个实验的加载时间 + 内存占用 baseline

## 六、数据

### 代码规模

```
src/ 下代码文件: ~400 个
public/experiments/ HTML: 111 个（总 ~3.5MB）
总 commit 数: 38 (feat/edu-academic-theme 分支)
```

### 工时对比

| 指标 | 计划 | 实际 |
|------|------|------|
| Phase 0.5 | 7 天 | ~3 小时 |
| Phase BG | 22 天 | ~6 小时 |
| Phase 3.5 | 9 天 | ~2 小时 |
| Phase F1 | 20 天 | ~15 分钟（agent） |
| Phase F2 | 16 天 | ~14 分钟（agent） |
| Phase F3 | 14 天 | ~12 分钟（agent） |
| QA + 修复 | — | ~4 小时 |
| **总计** | **88 天** | **~16 小时** |

> 注：Agent 产出的是可编译的代码骨架，不等于生产就绪。端到端测试、物理正确性验证、UI 打磨仍需人工时间。
