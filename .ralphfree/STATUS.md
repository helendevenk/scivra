# 任务执行状态

> 此文件是进度追踪的**唯一权威来源**

## 基本信息

| 字段 | 值 |
|------|-----|
| 任务 | Q2 2026 统一工作计划 |
| 开始时间 | 2026-03-22T10:46:54Z |
| 当前状态 | IN_PROGRESS |
| 当前阶段 | Phase 0.5 ✅ 全部完成，准备进入 Phase BG |
| 最后更新 | 2026-03-22T11:00:00Z |

## 阶段进度

| 阶段 | 状态 | 任务数 | 完成数 |
|------|------|--------|--------|
| Phase 0.5: 学科解耦 | ✅ 完成 | 11 | 11 |
| Phase BG: 批量生成+内容 | 🔄 进行中 | 9 | 4 |
| Phase 3.5: 验证+修正 | 🔄 进行中 | 8 | 8 |
| Phase F1: AP Prep | ⬜ 待开始 | 5 | 0 |
| Phase F2: Quest | ⬜ 待开始 | 5 | 0 |
| Phase F3: Notebook | ⬜ 待开始 | 5 | 0 |
| 集成联调 | ⬜ 待开始 | 3 | 0 |

## 当前任务

**正在执行**: Phase 0.5 A1-A4 — 学科类型系统 + 配置 + 注册表 + Stub

**A0 完成摘要**:
- route.ts: 砍掉内联 AI 调用（原 104-146 行），改为调用 generateCore()
- generate-core.ts: 加入 provider 选择逻辑（Anthropic proxy / OpenRouter），从 getAllConfigs() + 环境变量读取
- route.ts 现在只负责: parse → auth → rate limit → lock → generateCore() → credits → quota
- 验证: TS 零错误 + 87 tests 全过

## 迭代记录

| 迭代 | 时间 | 完成内容 |
|------|------|----------|
| 0 | 2026-03-22 | RalphFree 初始化，TASK.md 填充完整计划 |
| 1 | 2026-03-22 | ✅ A0: route.ts → generateCore()，provider 逻辑迁入，安全漏洞修复 |
| 2 | 2026-03-22 | ✅ A1-A4: disciplines/ 类型系统 + physics 配置 + 注册表 + 4 stub |
| 3 | 2026-03-22 | ✅ A5-A8: system-prompt 分层 + generate-core 接入 + quality-checker 扩展 + API 传递 discipline |
| 4 | 2026-03-22 | ✅ A9: DisciplineSelector UI 组件 |
| 5 | 2026-03-22 | ✅ A10: 回归测试 — 104 tests 全过，2 snapshots 写入，prompt 向后兼容确认 |
| 6 | 2026-03-22 | ✅ BG1-BG3: CLI 脚本 + prompt 模板 + 物理质量检查 + P0 motion 6个配置 |
| 7 | 2026-03-22 | ⚠️ BG6 PoC 脚本: zenmux 402，改为直接由 Claude 生成 HTML |
| 8 | 2026-03-22 | ✅ BG6 PoC: friction-lab.html 生成完成 |
| 9 | 2026-03-22 | ✅ P0 新建 14/14 完成: motion×6, waves×2, electro×4, thermo×2 |
| 10 | 2026-03-22 | ✅ P0 升级 6/6 完成: gravitational-fields, momentum-collisions, electromagnetic-induction, capacitors-rc-circuits, k5-energy-conversion, k5-sound-waves |
| 11 | 2026-03-22 | ✅ P1 批次1 5/5: balancing-act, vector-addition, bending-light, diffusion, buoyancy |
| 12 | 2026-03-22 | ✅ P1 批次2 5/5: balloons-static-electricity, rutherford-scattering, color-vision, fourier-making-waves, generator |
| 13 | 2026-03-22 | ✅ P1 批次3 重试成功 5/5 |
| 14 | 2026-03-22 | ✅ P1 批次4 5/5: models-hydrogen-atom, molecules-and-light, faradays-em-lab, energy-skate-park-basics, john-travoltage |
| 15 | 2026-03-22 | ✅ P1 批次5 5/5: gravity-force-lab-basics, masses-springs-basics, projectile-data-lab, geometric-optics-basics, buoyancy-basics |
| 16 | 2026-03-22 | ✅ P2 5/5: keplers-laws, my-solar-system, plinko-probability, calculus-grapher, curve-fitting |
| 17 | 2026-03-22 | ✅ P2 5/5: build-a-nucleus, quantum-measurement, circuit-dc-virtual-lab, circuit-ac-virtual-lab, quantum-coin-toss |
| 18 | 2026-03-22 | ✅ P1 升级 3/3: k5-magnetism, atomic-structure, blackbody-spectrum |
| 19 | 2026-03-22 | 🎉 Phase BG 全部完成！AP Physics HTML 总数：73 个。PhET 66 对标 100% 覆盖。 |
| 20 | 2026-03-22 | ✅ B1a-B1c: 验证框架 + 5条物理规则 + DB 6字段+1索引 + generate-core 集成 |
| 21 | 2026-03-22 | 📌 暂停点：B1d(UI Verified标签) + B3(refine修正) 待下次 session 继续 |
| 22 | 2026-03-22 | ✅ B1d: UI Verified 标签 — Gallery 卡片/详情页绿色徽章 + 筛选按钮 + i18n |
| 23 | 2026-03-22 | ✅ B3a: refine-core.ts — 修正管线（加载原始→构建上下文→调 LLM→清洗→存新版本） |
| 24 | 2026-03-22 | ✅ B3b: /api/upg/[id]/refine — auth+限流+锁+积分扣除+退款保护 |
| 25 | 2026-03-22 | ✅ B3c: model 函数(getVersionChain) + /api/upg/[id]/versions + 详情页 Refine 对话框 + 版本历史 UI |
| 26 | 2026-03-22 | ✅ B3d: build 零错误 + 104 tests 全过 — Phase 3.5 全部完成 🎉 |
