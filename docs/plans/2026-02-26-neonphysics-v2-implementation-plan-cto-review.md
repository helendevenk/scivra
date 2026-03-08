# CTO 评审结论：NeonPhysics v2 实施计划

> 评审日期：2026-02-26  
> 评审对象：`2026-02-26-neonphysics-v2-implementation-plan.md`  
> 评审角色：CTO

## 1. 结论

**结论：GO（有条件通过）**

计划结构完整，任务颗粒度已可直接执行。  
允许进入开发，但必须先完成下述“开工前硬门禁”。

## 2. 开工前硬门禁（Must）

1. **先完成数据库迁移与兼容验证**
   - 必须先做 `T003-T009`
   - 必须证明旧 UPG 生成配额在 `scene=generation` 下行为不变

2. **先锁定 API 契约**
   - 在 `T108` 完成前，不允许并行推进大量前端页面开发
   - 避免后续 UI 因接口字段变更反复返工

3. **Tutor 计费语义必须落代码级防重**
   - “打开会话扣 1 次”必须在服务端具备幂等控制
   - 禁止仅依赖前端状态判断扣费，避免重复请求导致超扣

4. **Embed 安全策略必须白名单化**
   - 仅 `/embed/*` 放开 iframe
   - 其他路由保持 `SAMEORIGIN`，并有自动化验证

## 3. 架构评审要点

### 3.1 优点

- 采用 `Setup -> Tests -> Core -> Integration -> Polish` 分层，风险控制合理
- 模块依赖顺序清晰（Gallery 前置，Learning Path 与 Dashboard 后置）
- 明确了并行批次，能缩短总工期

### 3.2 主要风险

- `upg_generation` 字段扩展较多，若缺少回填与索引可能影响查询性能
- Dashboard 聚合查询涉及多源拼接，若无索引与 limit 容易退化
- Learning Path 引入新表后，后台编排正确性依赖管理端输入质量

### 3.3 CTO 要求的技术决策

1. 为 `upg_generation` 新增以下索引（至少）：
   - `(is_public, created_at desc)`
   - `(featured, created_at desc)`
   - `(is_experiment, experiment_order desc, created_at desc)`
2. 为 `upg_like` 增加：
   - `(generation_id, created_at desc)`
   - `(user_id, created_at desc)`
3. Learning Path 的 `order_index` 必须在 `(path_id, order_index)` 唯一约束
4. Dashboard `recentActivity` 固定 `LIMIT 5`，禁止无界查询

## 4. 里程碑门禁（Gate）

- **Gate M1（数据层）**：迁移成功 + 单测 `T101` 通过
- **Gate M2（Gallery/Embed）**：`T109/T110` E2E 通过
- **Gate M3（Learn）**：`T111` E2E 通过，付费墙判定正确
- **Gate M4（Tutor/Dashboard）**：`T112/T113` E2E 通过
- **Gate M5（上线前）**：`pnpm lint && pnpm test && pnpm test:e2e && pnpm build` 全通过

## 5. 对计划的小调整建议（Should）

1. 在 `T311` 回填任务中补“分批执行 + 断点续跑”方案
2. 在 `T305` 埋点任务中加入事件字段字典（事件名、属性、触发时机）
3. 在 `T406` 发布清单中加入“监控看板链接 + 报警阈值”

## 6. 最终意见

该计划已具备直接开发条件。  
建议按计划原顺序执行，从 `T001` 开始进入实施，并在每个里程碑 Gate 进行一次短评审再进入下一阶段。

