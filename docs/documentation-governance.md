---
name: documentation-governance
status: current-state
verified_at: 2026-04-23
updated: 2026-04-23T00:00:00Z
---

# Documentation Governance

本文件定义 Scivra 仓库里“什么是当前事实源、什么只是历史记录”的边界。

## SSOT 优先级

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

## 文档类型

### `current-state`

只能声称当前仓库、当前配置、当前公开路由、当前测试约束里已经能验证的事实。不能把规划、历史里程碑、禁用配置、遗留内容文件写成已上线能力。

### `plan`

可以声称目标态、拟议改动、待实现范围和预期收益。不能把未落地方案写成当前事实，也不能在没有 `as of YYYY-MM-DD` 或 `verified_at` 的情况下把高漂移数字写成长期恒真。

### `report`

可以声称某个时间点的执行结果、核查结论、复盘观察和阶段输出。不能默认这些结论仍与当前仓库一致；凡依赖当前状态的判断，都要回到 SSOT 重新核验。

### `archive`

只保留历史语境、旧方案、旧判断和归档材料，供回溯使用。不能作为当前产品能力、当前架构或当前运营状态的事实源。

## 根目录默认规则

- 仓库根的 `.md` 默认属于 `current-state`。
- `docs/archive/` 永不做当前事实源。
- `docs/plans/` 是目标态，不默认等于已实现。
- `docs/reports/` 是某时点结果，不默认等于当前仍成立。

## 高漂移数据写法规则

- 测试数、API route 数、schema 表数、实验数这类数字，如果没有自动验证脚本或 `verified_at` 字段，不要写成硬数字。
- 如果必须写硬数字，必须显式标注 `as of YYYY-MM-DD`。
- 同一个主题存在两套真实口径时，必须把口径差异写清楚，不能只保留一个裸数字。

## 本次对齐核心口径快照

`verified_at: 2026-04-23`

- English-only
- 175 public HTML
- 179 registry (= 175 + 4 Wave 1 R3F)
- physics-only UPG
- 75 API routes
- 53 pgTable
- 无 cron
- `(ai)/` 只 `upg`

## 历史文档 frontmatter 标准字段

```yaml
---
name: <id>
status: historical-plan | historical-report | current-state
snapshot_date: YYYY-MM-DD   # 历史态必填
verified_at: YYYY-MM-DD     # 当前态必填
---
```

## `content/**/*.zh.mdx` 归属

- 当前站点是 English-only。
- 仓库中的 `content/**/*.zh.mdx` 文件保留在仓库，但统一标记为 `draft: true`。
- 这些文件的存在不代表站点当前已上线双语能力。
- 以后如果恢复中文发布，需要同时恢复 `src/config/locale/index.ts` 和 `src/core/docs/source.ts` 里的双语开关，并移除对应 `.zh.mdx` 文件上的 `draft` 标记。
