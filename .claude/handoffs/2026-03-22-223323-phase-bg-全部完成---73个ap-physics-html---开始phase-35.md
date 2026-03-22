# Handoff: Phase BG 全部完成 — 73个 AP Physics HTML — 开始 Phase 3.5

## Session Metadata
- Created: 2026-03-22 22:33:23
- Project: /Users/sky/Desktop/sciwangzhan/neonphysics-v2
- Branch: feat/edu-academic-theme
- Continues from: `2026-03-22-195817-p0-complete-start-p1p2.md`

## Current State Summary

Q2 统一工作计划执行中。**Phase 0.5 学科解耦 + Phase BG 内容生产全部完成**。73 个 AP Physics HTML 实验，PhET 66 对标 100% 覆盖。下一步是 Phase 3.5 验证+修正工具（9天），然后 Phase F1-F3 功能模块。

## Work Completed

### Phase 0.5: 学科解耦 ✅ (Session 1)
A0-A10 全部完成。104 Vitest tests 通过。

### Phase BG: 内容生产 ✅ (Session 1-2)

**73 个 AP Physics HTML 文件**（`public/experiments/ap-physics/`）：

| 类别 | 数量 | 实验列表 |
|------|------|---------|
| P0 新建 | 14 | friction-lab, forces-motion-basics, gravity-orbits, pendulum-lab, masses-springs, hookes-law, wave-on-string, waves-intro, ohms-law, coulombs-law, ac-circuits, resistance-wire, density-lab, pressure-lab |
| P0 升级 | 6 | gravitational-fields, momentum-collisions, electromagnetic-induction, capacitors-rc-circuits, k5-energy-conversion, k5-sound-waves |
| P1 新建 | 25 | balancing-act, vector-addition, bending-light, diffusion, buoyancy, balloons-static-electricity, rutherford-scattering, color-vision, fourier-making-waves, generator, gases-intro, states-of-matter-basics, magnets-and-electromagnets, normal-modes, atomic-interactions, models-hydrogen-atom, molecules-and-light, faradays-electromagnetic-lab, energy-skate-park-basics, john-travoltage, gravity-force-lab-basics, masses-springs-basics, projectile-data-lab, geometric-optics-basics, buoyancy-basics |
| P1 升级 | 3 | k5-magnetism(→magnets-and-electromagnets), atomic-structure, blackbody-spectrum(新建) |
| P2 新建 | 10 | keplers-laws, my-solar-system, plinko-probability, calculus-grapher, curve-fitting, build-a-nucleus, quantum-measurement, circuit-dc-virtual-lab, circuit-ac-virtual-lab, quantum-coin-toss |
| 原有 Wave 1-7 | 23 | (未改动) |

## Immediate Next Steps

### 1. Phase 3.5: 验证 + 修正工具（9天）

**B1: 物理验证层（4天）**
- B1a: 验证框架 `src/shared/lib/upg/validation/index.ts`（ValidationRule + 规则引擎）
- B1b: 物理验证规则 `validation/physics-validator.ts`（能量守恒/物理常数/解析解/NaN保护/SI单位）
- B1c: 集成到 generate-core + DB 字段（validation_score/details/validated_at）
- B1d: UI Verified 标签（Gallery 卡片 + 详情页 + 筛选）

**B3: 对话修正（5天）**
- B3a: refine-core `src/shared/lib/upg/refine-core.ts`
- B3b: refine API `/api/upg/[id]/refine` + moderation + 分布式锁
- B3c: DB 字段（version/parentId/refinementPrompt）+ 版本历史 UI
- B3d: 手动测试

### 2. 新实验注册（Phase BG 后续）
- 所有新建实验需添加到 `registry.ts` + `html-map.ts` + `data/*.ts`
- 约 50 个新实验需要注册

### 3. Phase F1-F3 功能模块（Phase 3.5 之后）
- F1: AP Prep Mode（20天）
- F2: Physics Quest（16天）
- F3: Lab Notebook AI（14天）

## Important Context

1. **RalphFree 状态**：`.ralphfree/STATUS.md` 是权威进度源，19 轮迭代记录
2. **生成方式**：全部由 Claude frontend-developer subagent 并行生成（5个一批），非 API 调用
3. **文件规格**：每个实验 500-1100 行，Three.js r134 + OrbitControls + KaTeX 0.16.9，背景 0x0f172a
4. **已完成的基础设施**：Phase 0.5 disciplines/ 目录，DisciplineConfig 接口，Physics 完整配置
5. **CTO 决策**：B2 增量生成已砍推 S2，总工时 88 天

## Potential Gotchas

- 新生成的 50 个实验未注册到 registry.ts/html-map.ts（文件存在但网站导航看不到）
- 部分实验 OrbitControls 引用路径可能不一致（CDN vs /lib/）
- magnets-and-electromagnets.html 被 k5-magnetism 升级覆盖（功能增强但文件名对应关系变了）
- 未做人工交互测试，仅验证文件存在和基本结构

## Related Resources

- 统一工作计划: `docs/plans/2026-03-22-unified-work-plan.md` (cto-approved)
- CTO 评审: `docs/plans/2026-03-22-unified-work-plan-cto-review.md`
- Phase 3.5 实施规格: `docs/plans/2026-03-22-discipline-decoupling-implementation-spec.md` 第二部分
- RalphFree 进度: `.ralphfree/STATUS.md`
