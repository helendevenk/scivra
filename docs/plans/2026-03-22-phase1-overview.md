---
name: phase1-feature-overview
status: backlog
created: 2026-03-22T09:12:49Z
updated: 2026-03-22T09:12:49Z
---

# Phase 1 功能总览 — AP Prep + Physics Quest + Lab Notebook

## 三模块对比

| 维度 | AP Prep Mode | Physics Quest | Lab Notebook AI |
|------|-------------|---------------|-----------------|
| **核心价值** | AP考试刷题+UPG可视化解析 | 预测-验证闯关式学习 | AI辅助实验报告 |
| **目标用户** | AP Physics考生(30万/年) | K12学生(Grade 6-12) | AP学生写报告 |
| **新增表** | 5张 | 6张(+2字段修改) | 3张 |
| **新增API** | ~10端点 | ~12端点 | ~8端点 |
| **工时估算** | 22人天 | 16人天 | 14人天 |
| **复杂度** | 🟡 中等 | 🟡 中等 | 🔴 复杂(PDF+编辑器) |
| **变现路径** | Pro解锁全部题+UPG解析 | Pro专属挑战+竞赛 | Pro导出PDF |
| **最大风险** | College Board版权 | 实验组件数据通信 | PDF中文字体 |
| **设计文档** | `2026-03-22-ap-prep-mode-design.md` | `2026-03-22-physics-quest-design.md` | `2026-03-22-lab-notebook-ai-design.md` |

**总计**：14张新表 + ~30个API端点 + **52人天**

## 数据模型新增汇总

### AP Prep Mode (5张)
```
ap_exam          — 考试类型(AP Physics 1/2/C-Mech/C-E&M)
ap_unit          — 知识单元(力学/电磁学等)
ap_question      — 题目(含UPG缓存关联)
ap_attempt       — 做题记录
ap_user_progress — 用户进度(按unit统计)
```

### Physics Quest (6张 + 2字段)
```
quest              — 挑战任务
quest_step         — 挑战步骤(knowledge/predict/experiment/compare/explain)
quest_attempt      — 用户挑战记录
quest_step_response — 步骤回答
achievement        — 成就定义
user_achievement   — 用户成就记录
+ learningStats 加 questsCompleted / achievementsEarned
```

### Lab Notebook AI (3张)
```
lab_notebook         — 笔记本主表(关联experiment/UPG)
lab_notebook_version — 版本历史(乐观锁)
lab_notebook_export  — PDF导出记录
```

## 共享依赖关系

```
                    ┌─── UPG 生成管线 ───┐
                    │                     │
              AP Prep Mode          Lab Notebook AI
              (UPG可视化解析)        (引用UPG数据)
                    │                     │
                    └───── Gallery ────────┘
                           │
                    Physics Quest
                    (嵌入Curated Labs)
                           │
                    experimentProgress (现有)
```

关键共享点：
1. **UPG 管线**：AP Prep 和 Lab Notebook 都依赖 `generate-core.ts`，但用法不同（AP定向生成 vs Notebook引用已有）
2. **积分系统**：AP Prep 的 UPG 解析消耗积分，复用 `credit` + `upgDailyQuota`
3. **实验进度**：Quest 复用 `experimentProgress`，Notebook 从中提取数据
4. **认证+权限**：三个模块统一用 Better Auth session + RBAC

## 建议执行顺序

### Week 1-2：基础设施 + AP Prep MVP
**为什么先做 AP Prep**：付费转化最直接，技术依赖最少

| 天 | 任务 | 输出 |
|----|------|------|
| D1-2 | Schema 迁移：AP Prep 5张表 + Quest 6张表 + Notebook 3张表（一次性推送） | `db:push` 通过 |
| D3-5 | AP Prep API（CRUD + 判分 + 进度） | 10个端点可测 |
| D6-8 | AP Prep 前端（题库列表 + 做题 + UPG解析） | 可走通主链路 |
| D9-10 | AP Physics 1 种子数据（Unit 1-3，共~30题） | 有内容可用 |

### Week 3-4：Physics Quest
| 天 | 任务 | 输出 |
|----|------|------|
| D11-13 | Quest API（CRUD + 做题 + 评分） | 12个端点可测 |
| D14-17 | Quest 前端（地图 + 步骤组件 + 成就） | 可走通一个完整Quest |
| D18-19 | 首批Quest内容（3个牛顿力学Quest） | 有内容可用 |
| D20 | 周度竞赛 Redis排行榜 | 排行可用 |

### Week 5-6：Lab Notebook AI
| 天 | 任务 | 输出 |
|----|------|------|
| D21-23 | Notebook API（CRUD + 版本管理） | 8个端点可测 |
| D24-27 | Notebook UI（Drawer + 编辑器 + 5区块） | 可创建和编辑笔记 |
| D28-30 | AI预填 + PDF导出 | 完整链路可用 |

### Week 7：集成测试 + 联调
| 天 | 任务 | 输出 |
|----|------|------|
| D31-33 | 三模块端到端联调 | 主链路全部跑通 |
| D34-35 | 权限联调（Free/Pro差异） | 付费墙生效 |

## 技术决策记录

| 决策 | 选择 | 原因 |
|------|------|------|
| Schema 迁移策略 | 14张表一次性迁移 | 避免多次 push 风险，表间有依赖 |
| AP题UPG策略 | 混合模式（预生成+按需） | 平衡AI成本和体验 |
| Quest评分 | V1用数值容差+选择题 | 简单优先，AI评分留给Pro |
| Notebook编辑器 | textarea + Markdown | 不引入重型编辑器，降低bundle |
| PDF生成 | @react-pdf/renderer客户端 | 不占serverless资源 |
| 竞赛排行 | Redis sorted set | 不侵入PostgreSQL主库 |

## 风险清单

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| College Board 题目版权 | AP Prep 内容受限 | 自编原创题 + 标注"inspired by AP style" |
| UPG 生成质量不稳定 | AP解析体验差 | 高频题预生成+人工审核后缓存 |
| 实验组件数据通信 | Quest步骤无法获取实验数据 | onDataChange callback方案（已设计） |
| PDF中文字体 | Notebook中文导出乱码 | MVP只支持英文，中文V2再做 |
| 52人天资源 | 开发周期过长 | 严格按Week划分，每周交付可验证产出 |

## 成功指标

| 模块 | 核心指标 | 目标（上线30天） |
|------|---------|----------------|
| AP Prep | 刷题用户转化Pro率 | > 5% |
| AP Prep | 日均做题量（活跃用户） | > 10题/人 |
| Physics Quest | Quest完成率 | > 60% |
| Physics Quest | Session时长 | +40% vs 纯实验 |
| Lab Notebook | 笔记本创建数 | > 0.3个/活跃用户/周 |
| Lab Notebook | PDF导出率 | > 20%的笔记本 |

## 下一步

- [ ] 用户确认执行顺序和优先级
- [ ] AP题目版权策略法律确认
- [ ] 14张表 Schema 设计评审（CTO Review）
- [ ] Week 1 开始：Schema迁移 + AP Prep API
