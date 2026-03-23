---
name: 2026-03-23-sprint-retrospective
status: complete
created: 2026-03-23T02:30:00Z
updated: 2026-03-23T02:30:00Z
---

# Sprint 复盘 — 2026-03-22 ~ 2026-03-23

## 1. 数字总览

| 指标 | 开始 | 结束 | 变化 |
|------|------|------|------|
| Commits | 0 | 16 | +16 |
| 测试文件 | 13 | 33 | +20 |
| 测试用例 | 175 | 406 | **+231 (+132%)** |
| 覆盖率（行） | 4.68% | ~15% (est.) | **+10%** |
| 实验缩略图 | 5 | 66 | +61（全部 Gemini API 统一风格） |
| 代码行数 | ~76,000 | ~76,500 | +500 |
| 改动文件 | - | 365 | 17,148 行新增 |

## 2. 完成事项

### 2.1 功能开发（Session 1, 03-22）

| 阶段 | 内容 | 产出 |
|------|------|------|
| Phase 0.5 | 学科解耦 | 5 学科 Subject 类型 + GradeLevel + 104 tests |
| Phase BG | 批量生成 | 111 个实验 HTML（73 AP Physics + 10 Bio + 7 Chem + 11 K5 + 9 MS），PhET 66 对标 100% |
| Phase 3.5 | 验证修正 | 验证框架 5 条物理规则 + DB 6 字段 + UI Verified |
| Phase F1 | AP Prep | 5 model + 11 API + 5 页面 + seed 30 题 |
| Phase F2 | Quest | 5 model + 7 API + 4 页面 + scoring + seed |
| Phase F3 | Notebook | 3 model + AI engine + 9 API + editor + drawer |
| 集成 | 三模块合并 | build ✅ + worktree 清理 |

### 2.2 质量 & 基础设施（Session 2, 03-23）

| 任务 | 内容 | 产出 |
|------|------|------|
| Access Control | TDD subject/gradeLevel | 37 tests RED→GREEN + 64 文件 |
| 权限矩阵 | Free/Pro 验证 | 34 tests + Progress API hardening |
| 性能审计 | DevOps 工程师分析 | next.config 优化 + AVIF/WebP |
| 图片生成 | 66 张缩略图（111 个实验中的前 66 张） | Gemini API 统一学术蓝风格 |
| 死资源清理 | jimeng/zimg | -15MB |
| payment 重构 | 消除 80% 重复 | 559→501 行 + 修复 string→Date bug |
| T1 纯函数测试 | 9 个测试文件 | resp, moderator, quality, validators, physics, quest, hash, time, perf |
| T2 Model 测试 | 6 个测试文件 | credit, order, subscription, upg_generation, quota, user |
| Mock 基础设施 | tests/helpers/mock-db.ts | 可复用 Drizzle chainable mock |
| 测试计划 | 100% 覆盖率计划 | 1684 行详细规格 + CTO 评审 8 决策 |
| 实验修复 | 19 个 HTML 实验 | OrbitControls CDN + CapsuleGeometry + 语法 |

## 3. CTO 评审关键决策

| # | 决策 | 选择 |
|---|------|------|
| 1 | DB Mock 策略 | `vi.mock` for T2-T4，真实 Postgres for T5 |
| 2 | API Route 测试 | 直接导入 handler + 构造 NextRequest |
| 3 | 覆盖率目标 | 90% shared / 80% api（ratchet 机制） |
| 4 | CI 流水线 | GitHub Actions + coverage ratchet gate |
| 5 | payment.ts | 重构消除重复后再写 T3（已完成） |
| 6 | extensions/ | 新增 T3-07 测试 Stripe/PayPal SDK mock |
| 7 | 覆盖率配置 | include shared + api + core，exclude pages/CSS |
| 8 | Mock 类型安全 | 所有 mock factory 必须类型化 |

## 4. 技术债务变化

### 消除的债务

- ~~payment.ts handleCheckoutSuccess/handlePaymentSuccess 重复代码~~ → 提取 4 个共享函数
- ~~60 张实验缩略图缺失~~ → 全部 Gemini 生成
- ~~Progress API planName: null TODO~~ → 真实 subscription 解析
- ~~Progress API 无 access check~~ → 加 canAccessExperiment 校验
- ~~next.config 无 AVIF/WebP~~ → 已加 formats
- ~~shiki 未安装导致 build warning~~ → 已安装
- ~~data* gitignore 误杀实验数据~~ → 已修复排除规则
- ~~19 个 HTML 实验渲染错误~~ → CDN 修复 + 语法修复

### 新增/仍存在的债务

- 测试覆盖率 ~15%（目标 90%），T3-T6 未开始
- redis-rate-limit 测试依赖真实 Redis（CI 会失败）
- UPG 端到端联调未完成（generate → view → my 主链路）
- OrbitControls 不稳定（方案设计未落地）
- single-slit-diffraction.html 仍有渲染 bug
- 无 GitHub Actions CI 配置

## 5. 做得好的

1. **并行 agent 策略**：4 路 worktree 并行写测试，单轮产出 132 个 tests
2. **TDD 纪律**：access control 先 RED 后 GREEN，权限矩阵测试发现了 simple-harmonic-motion 不是 beginner 的数据问题
3. **CTO 评审前置**：避免了 "写 500 个测试然后发现 mock 策略错误" 的浪费
4. **Gemini 图片批量生成**：59/59 一次性成功，统一视觉风格

## 6. 做得不好的

1. **worktree 文件丢失**：3 个 agent 的 worktree 被过早清理，需要 resume agent 拉回文件内容——浪费了 ~10 分钟
2. **Shell heredoc 坑**：Python heredoc 里 `$variable` 不展开，导致图片写到 `.png` 空文件
3. **Context 膨胀**：session 跨度太大，上下文压缩了多次，丢失了一些早期决策细节
4. **覆盖率数字未实测**：估算 ~15% 但没跑 `pnpm test:coverage` 验证

## 7. 风险评估

| 风险 | 等级 | 应对 |
|------|------|------|
| payment.ts 0% 测试覆盖 | HIGH | T3 优先写 payment service 测试 |
| 无 CI，PR 可能破坏测试 | MEDIUM | 下一步配置 GitHub Actions |
| UPG 生成端到端未联调 | HIGH | 需要启动 dev 实际测试 |
| 实验 HTML 渲染依赖 CDN | MEDIUM | 考虑预编译到 public/lib/ |

---

# 下一步工作计划

## Week 18 剩余（本周）

### P0: 必须完成

| 任务 | 估时 | 依赖 |
|------|------|------|
| **T3: Service Layer 测试** | 1.5d | mock-db.ts 已就绪 |
| - payment.ts (18 tests) | | 重构已完成 |
| - rbac.ts (20 tests) | | |
| - generate-core.ts (12 tests) | | mock LLM client |
| - progress-service.ts (8 tests) | | |
| **GitHub Actions CI** | 0.5d | |
| - pnpm test on PR | | |
| - coverage ratchet gate | | |
| - 分离 unit / integration job | | |

### P1: 强烈建议

| 任务 | 估时 | 依赖 |
|------|------|------|
| **T4: API Route 测试**（P1 路由） | 2d | T3 完成 |
| - payment webhooks (10 tests) | | |
| - UPG generate (12 tests) | | |
| - compliance age-gate/consent (11 tests) | | |
| - privacy export/delete (10 tests) | | |
| **UPG 端到端联调** | 1d | dev 环境 |
| - generate → view → my 主链路跑通 | | |
| - Redis 限流真实测试 | | |

## Week 19

### P1: 强烈建议

| 任务 | 估时 |
|------|------|
| **T5: Integration Tests** | 1.5d |
| - Docker Postgres 测试 DB | |
| - credit lifecycle (create → consume → refund) | |
| - subscription lifecycle (active → cancel → expire) | |
| - UPG pipeline (generate → validate → store) | |
| **T6: E2E Tests** | 2d |
| - Auth flow (signup → login → logout) | |
| - Experiment access (free vs pro) | |
| - UPG happy path | |
| - COPPA age gate | |

### P2: 锦上添花

| 任务 | 估时 |
|------|------|
| T2 剩余 Model 测试 (achievement, learning_path, lab_notebook 等) | 1d |
| T4 剩余 API 路由 (admin, quest, notebooks, chat) | 1.5d |
| OrbitControls 预编译到 public/lib/ | 0.5d |
| 性能优化：ISR for landing/pricing/listing | 0.5d |
| single-slit-diffraction.html 渲染修复 | 0.5d |

## Week 20

| 任务 | 估时 |
|------|------|
| SEO 增强（sitemap 优化 + 博客内容） | 1d |
| 付费系统对接（Stripe webhook 生产测试） | 1d |
| Vercel 部署 + Cron 配置 | 0.5d |
| 监控增强（Sentry 集成 + Analytics Bridge） | 1d |
| **发布 v2.0 Beta** | 0.5d |

## 覆盖率里程碑

| 节点 | 预期覆盖率 | 测试数 |
|------|-----------|--------|
| 当前 | ~15% | 406 |
| T3 完成 | ~35% | ~465 |
| T4 完成 | ~55% | ~555 |
| T5 完成 | ~70% | ~605 |
| T6 完成 | ~80% | ~660 |
| T2 剩余 | ~90% | ~710 |
| **目标** | **90%+ shared, 80%+ api** | **~710** |
