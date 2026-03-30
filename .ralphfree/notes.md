# 任务研究笔记

> 按 Phase 分区，每个 session 只读当前 Phase 的区段

## 代码地图

| 文件 | 职责 |
|------|------|
| `~/.claude/skills/aetherviz-master/SKILL.md` | v7.0 生成规范（470行），含 Codex 科学核实、Verlet 积分、Quiz、预设 |
| `public/experiments-v2/{category}/` | 新版实验输出目录，不覆盖原始 experiments/ |
| `public/experiments/ap-physics/` | 原始实验（已用 git restore 恢复，不可修改）|
| `.ralphfree/TASK.md` | 176 个实验完整生成计划，20 个原子任务 |

## Phase 1: 基础设施 + AP Physics 力学 I

任务类型: content-generation
核心目标: 用 aetherviz-master v7.0 重新生成 176 个 HTML 实验，写入 experiments-v2/
代码地图:
  - `~/.claude/skills/aetherviz-master/SKILL.md`: v7.0 生成规范，包含 Codex 核实
  - `public/experiments-v2/`: 新版输出目录（与原始 experiments/ 完全隔离）
痛点分析:
  P1 [高影响/高确定性]: 176 个文件串行耗时过长 → 4 agent 并行每批
  P2 [中影响/高确定性]: OrbitControls CDN 在 file:// 协议下失效 → v7.0 已内联
  P3 [低影响/已解决]: 旧版本使用 Euler 积分精度低 → v7.0 改用 Velocity Verlet
Scope Exclusions:
  - 不修改原始 experiments/ 目录（用户明确要求保留旧文件对比）
  - 不修改 registry.ts 或任何 TypeScript 代码（纯内容生成任务）
  - 不部署到 Vercel（用户自行决定）
  - 不生成缩略图（独立任务）
历史模式命中: 是 → dispatching-parallel-agents 4x 加速

### 已完成工作
- Task 0: 创建 7 个子目录 ✅
  来源: Bash mkdir -p 命令
- Task 1: P0-A 13个文件写入 experiments-v2/ap-physics/
  来源: 4 个并行子代理生成
  文件: forces-motion-basics(617L), friction-lab(668L), gravity-force-lab-basics(591L),
        hookes-law(552L), masses-springs-basics(566L), masses-springs(669L),
        pendulum-lab(657L), projectile-data-lab(630L), vector-addition(591L),
        kinematics-graphs(446L), circular-motion(421L), rotational-motion(434L),
        balancing-act(437L)
  注: 部分文件行数略低于 500，下一批注意确保 ≥500 行

## Phase 2: AP Physics 剩余 60 个

（执行过程中记录）

## Phase 3: AP Biology + AP Chemistry + AP Physics C

（执行过程中记录）

## Phase 4: Earth Science + K5 + Middle School

（执行过程中记录）

## Phase 5: 质量审核与收尾

（执行过程中记录）
