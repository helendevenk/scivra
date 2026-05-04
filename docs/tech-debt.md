# 技术债务记录

> **说明**：本文档记录项目中的技术债务，包括临时方案、已知问题和未来优化方向。

---

## TD-001: 搜索方案临时使用 ILIKE

**当前方案**：PostgreSQL ILIKE 模糊搜索

**问题**：
- 无语义搜索（"牛顿第二定律" 搜不到 "F=ma"）
- 无拼写纠错（"牛顿第尔定律" 搜不到结果）
- 性能一般（大数据量时会变慢）
- 中文分词效果差

**触发条件**：日搜索量 > 1000 次

**迁移方案**：Algolia
- 预计工作量：2 天
- 成本：10,000 次/月免费，100,000 次/月 $50
- 优势：中文分词、拼写纠错、搜索建议

**优先级**：P2（非紧急）

**创建日期**：2026-03-09

**负责人**：待定

---

## TD-002: OrbitControls 使用预编译文件

**当前方案**：使用 `public/lib/orbit-controls.min.js` 预编译文件

**问题**：
- 无法利用 Three.js 官方更新
- 需要手动维护版本

**未来优化**：
- 考虑使用 Three.js 官方 CDN
- 或者使用 npm 包 + 构建时打包

**优先级**：P3（低优先级）

**创建日期**：2026-03-09

---

## TD-003: 标签系统使用 TEXT[] 数组

**当前方案**：`upg_generation.tags` 使用 TEXT[] 数组

**问题**：
- 查询效率低（即使有 GIN 索引）
- 无法统计标签使用频率
- 无法做标签推荐

**迁移方案**：标签关联表（已在 Phase 0.7 中规划）
```sql
CREATE TABLE upg_tag (
  id VARCHAR PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  usage_count INT DEFAULT 0
);

CREATE TABLE upg_generation_tag (
  generation_id VARCHAR NOT NULL,
  tag_id VARCHAR NOT NULL,
  PRIMARY KEY (generation_id, tag_id)
);
```

**触发条件**：Phase 0.7 完成后立即迁移

**优先级**：P1（高优先级，已规划）

**创建日期**：2026-03-09

---

## TD-004: 内容审核使用简单敏感词过滤

**当前方案**：本地敏感词列表

**问题**：
- 敏感词列表需要手动维护
- 无法检测变体（如"政 治"、"政@治"）
- 无法检测图片中的不当内容

**未来优化**：
- 集成第三方内容审核 API（阿里云内容安全、腾讯云天御）
- 使用 AI 模型检测语义（而非关键词匹配）

**触发条件**：举报率 > 5% 或收到法律投诉

**优先级**：P2（中优先级）

**创建日期**：2026-03-09

---

## 技术债务统计

| 优先级 | 数量 | 说明 |
|--------|------|------|
| P1（高） | 1 | 需要在近期解决 |
| P2（中） | 2 | 根据业务需求决定 |
| P3（低） | 1 | 可以长期保持现状 |

---

## D4 Phase D — 显式延后项 (2026-05-04)

D4 Phase D close-out 后，以下项已知但本周期未做：

| 项目 | 范围 | 来源 | 状态 / 推荐周期 |
|---|---|---|---|
| TD-D4-01: C5 cosmetic drift 清理（69 slugs） | `tests/unit/content/d4-known-drift.json` | Wave 7 deferral；详见 `docs/reports/d4-phase-d-closeout.md` | ✅ **RESOLVED** in Phase E (PRs #41 #43 #44 #45) — 68/69 cleared, 1 intentional kept (ms-electric-circuits-advanced W5 voltage cap) |
| TD-D4-02: WCAG 2.1 AA 修复（175 HTML） | `public/experiments/**/*.html` | Wave 9 audit `docs/reports/d4-accessibility-audit.md` | 🟡 **PARTIAL** — P1 三件套 done in Phase F (PR #42); P2/P3 (color contrast, semantic landmarks, color-only signal, canvas a11y) → Phase F2 cycle |
| TD-D4-03: HTML JS 质量修复（175 HTML） | `public/experiments/**/*.html` | Wave 10 audit `docs/reports/d4-html-js-quality-audit.md` | 🟡 **PARTIAL** — 6 critical per-file bugs done in Phase F (PRs #46 #47); systemic refactor (OrbitControls helper, innerHTML→DOM, lifecycle, frame alloc) → Phase F2 cycle |
| TD-D4-04: Tailwind CDN → 本地构建（175 HTML） | `public/experiments/**/*.html` | Tailwind 官方不推荐生产用 CDN | ⏸ 独立 infra 周期 |
| TD-D4-05: three.js r134 → r170+ 升级（175 HTML） | `public/experiments/**/*.html` | 已 pinned 但落后 36 个版本 | ⏸ 独立 infra 周期 |
| TD-D4-06: NGSS 高优先级 gap 实现（top-10） | catalog 扩展 | Wave 8 audit `docs/reports/d4-ngss-coverage-gap.md` | ⏸ catalog 路线图规划 |
| TD-D4-07: audit script 漏检 sl-speed slider | `scripts/audit-params-vs-html.ts` | 2026-05-04 Wave D codex review 发现 circular-motion.html 的 `sl-speed` 没被 parser 识别，误报 C2 drift | 🆕 audit-script repair (~1 hour)；并校对其他可能漏检的 slider |

**优先级建议（更新）**：
- TD-D4-02 P2/P3 = P1（catalog-blocking for Section 508 / WCAG procurement，剩余 audit 项）
- TD-D4-03 systemic = P1（lifecycle helper、innerHTML→DOM 是大量 HTML 文件长期维护的关键）
- TD-D4-07 = P2（影响 drift 监控准确性，但不阻塞功能）
- TD-D4-04, 05, 06 = P2/P3

## 更新日志

- 2026-03-09：创建文档，记录 4 项技术债务
- 2026-05-04：追加 D4 Phase D 显式延后项（6 条 TD-D4-*）
- 2026-05-04：Phase E + F P1 周期完成 — TD-D4-01 RESOLVED；TD-D4-02 / TD-D4-03 标记 PARTIAL；新增 TD-D4-07（audit script slider parser gap）
