# NeonPhysics v2 — Q2 2026 统一工作计划

> 由 RalphFree v3.0 管理 | 2026-03-22
> 计划文档: `docs/plans/2026-03-22-unified-work-plan.md`（CTO APPROVED）
> 基于 Manus 上下文工程原则 + 4-File Pattern

## Goal

执行 CTO 批准的 Q2 2026 统一工作计划（88 人天 / 18 周），按顺序完成：
1. Phase 0.5: 学科解耦（7天）— A0 安全修复起步
2. Phase BG: 批量生成管线 + PhET 66 对标内容（22天）
3. Phase 3.5: 验证层 + 修正工具（9天）
4. Phase F1: AP Prep Mode（20天）
5. Phase F2: Physics Quest（16天）
6. Phase F3: Lab Notebook AI（14天）

## Criteria（验收标准）

> 每个 Phase 有独立验收，全部通过才算 COMPLETED

- [ ] **Phase 0.5**: route.ts 不再直接调 LLM + prompt snapshot 一致 + 64 Vitest 通过 + TS 零错误
- [ ] **Phase BG**: 66 个物理实验全部可运行 + 自动质量检查通过 + 注册到 registry
- [ ] **Phase 3.5**: Verified 标签可用 + refine API 可用 + rate limiting + moderation
- [ ] **Phase F1**: AP Physics 1 刷题链路可走通（选题→做题→判分→UPG解析→进度）
- [ ] **Phase F2**: 3 个 Quest 可完成 + 排行榜可用
- [ ] **Phase F3**: 笔记本创建→AI预填→PDF导出链路通
- [ ] **集成**: 三模块联调通过 + Free/Pro 权限生效

## 任务信息

| 字段 | 值 |
|------|-----|
| 计划文档 | `docs/plans/2026-03-22-unified-work-plan.md` |
| CTO 评审 | `docs/plans/2026-03-22-unified-work-plan-cto-review.md` |
| 最大迭代 | 50 次 |
| 项目根目录 | `/Users/sky/Desktop/sciwangzhan/neonphysics-v2` |

## 分阶段任务清单

### Phase 0.5: 学科解耦（7天）

> 实施规格: `docs/plans/2026-03-22-discipline-decoupling-implementation-spec.md`

- [x] **A0** 🔴 CRITICAL SECURITY: route.ts 迁移到 generateCore()（含 provider 选择逻辑迁移）
- [x] A1: 学科类型系统 `disciplines/types.ts`
- [x] A2: Physics 完整配置 `disciplines/physics.ts`
- [x] A3: 注册表 `disciplines/index.ts`
- [x] A4: Chemistry/Bio/Math/Earth stub ×4
- [x] A5: System Prompt 分层（拆函数 + discipline 参数）
- [x] A6: generate-core 接入 discipline
- [x] A7: quality-checker 学科扩展
- [x] A8: API route 传递 discipline
- [x] A9: UI 学科选择器 DisciplineSelector
- [x] A10: 回归测试（prompt snapshot + Vitest 104 tests 全过）

### Phase BG: 批量生成管线 + 内容（22天）

> 管线设计: `docs/plans/2026-03-22-upg-batch-generation-pipeline.md`

- [ ] BG1: CLI 批量生成脚本（callAnthropic 直连）
- [ ] BG2: 结构化 Prompt 模板系统
- [ ] BG3: 物理特定质量检查 checkPhysicsQuality
- [ ] BG4: 自动截图审核（Playwright）
- [ ] BG5: 注册集成工具
- [ ] BG6: PoC 验证（friction-lab 全流程跑通）
- [ ] P0: 14 个新实验 + 7 个升级 = 21 个生成任务
- [ ] P1/P2: 33 个新实验 + 5 个升级 = 38 个生成任务
- [ ] Schema 迁移: 14 张新表（审查SQL→本地测试→备份→推送）

### Phase 3.5: 验证 + 修正工具（9天）

- [ ] B1a: 验证框架（ValidationRule + 规则引擎）
- [ ] B1b: 物理验证规则（5 条）
- [ ] B1c: 集成到管线 + DB 字段
- [ ] B1d: UI Verified 标签
- [ ] B3a: refine-core 修正管线
- [ ] B3b: refine API + moderation + 分布式锁
- [ ] B3c: DB 字段 + 版本历史 UI
- [ ] B3d: 手动测试修正流程

### Phase F1: AP Prep Mode（20天）

> 设计文档: `docs/plans/2026-03-22-ap-prep-mode-design.md`

- [ ] F1-1: 数据基础（5 表 + seed）
- [ ] F1-2: API 层（10 端点）
- [ ] F1-3: 前端页面
- [ ] F1-4: Admin 后台
- [ ] F1-5: 测试 + 打磨

### Phase F2: Physics Quest（16天）

> 设计文档: `docs/plans/2026-03-22-physics-quest-design.md`

- [ ] F2-1: 数据基础（6 表 + 成就引擎）
- [ ] F2-2: API 层（12 端点）
- [ ] F2-3: 前端页面
- [ ] F2-4: 周度挑战（Redis 排行榜）
- [ ] F2-5: 种子内容 + 测试

### Phase F3: Lab Notebook AI（14天）

> 设计文档: `docs/plans/2026-03-22-lab-notebook-ai-design.md`

- [ ] F3-1: 数据层 + CRUD API
- [ ] F3-2: AI 辅助
- [ ] F3-3: 前端 UI
- [ ] F3-4: PDF 导出
- [ ] F3-5: 列表页 + 打磨

### 集成联调（7天）

- [ ] 三模块端到端联调
- [ ] Free/Pro 权限差异验证
- [ ] 性能测试 + 部署准备

## Manus 工作规则

1. **Read-Before-Decide** — 每次重大决策前重读本文件
2. **2-Action Rule** — 每完成 2 个操作更新 STATUS.md
3. **Never Hide Failures** — 错误立即记录到 errors.md（同类最多重试 2 次）
4. **Store Don't Stuff** — 大量输出写入文件，对话只保留摘要

## 关键参考文件

- 项目基线: `CLAUDE.md`
- 架构约束: `.claude/rules/architecture.md`
- 编码规范: `.claude/rules/coding-standards.md`
- 安全红线: `.claude/rules/safety.md`
- UPG 生成管线: `src/shared/lib/upg/generate-core.ts`
- Anthropic 客户端: `src/shared/lib/upg/anthropic-client.ts`
- DB Schema: `src/config/db/schema.ts`
- 实验注册表: `src/shared/lib/experiments/registry.ts`

## 完成信号

将 STATUS.md 状态更新为 `COMPLETED`，输出 `<promise>COMPLETE</promise>`。
