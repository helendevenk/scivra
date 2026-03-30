---
name: master-work-plan
status: in-progress
created: 2026-03-28T14:08:39Z
updated: 2026-03-28T14:08:39Z
---

# Scivra 主工作计划
**版本**：v1.0 · 2026-03-28 · 基于全面项目分析

## 战略前提

**当前最大风险**：产品功能存在但不可用（UPG 端到端未跑通），支付未经生产验证，测试覆盖率 15%。在这个状态下继续扩充内容（Wave 9-12）是错误的优先级——在没有地基的建筑上加楼层。

**正确顺序**：夯实可用性 → 验证变现 → 测试保障 → 内容扩张 → 获客增长

---

## Phase 0：基础可用性（P0，本周，~20h）

**目标**：让核心功能真实可用，消除 blocking bug。

### 0-A：UPG 端到端联调（~8h）

**问题**：generate → view → my 主链路未完整跑通。UPG 是 Scivra 唯一差异化功能，不跑通 = 产品不存在。

**任务清单**：
- [ ] 用真实 Claude API（claude-sonnet-4-6）跑完整 generate 流程，记录实际 latency 和 token 消耗
- [ ] 验证 Redis 限流在 generate 路径上是否正确触发
- [ ] 验证积分先扣 AI 再扣余额流程（CTO 决策：先调 AI → 成功后扣积分）
- [ ] 验证 html-sanitizer 对生成结果的过滤不误杀正常 3D 内容
- [ ] 验证 generate → view 页面完整渲染（iframe sandbox 正确加载 Three.js r134 CDN）
- [ ] 验证 my 页面正确展示历史生成记录
- [ ] 截图留证：生成成功 + 渲染成功 + 积分扣减日志

**验收标准**：从点击生成到看到可交互 3D 效果，全程截图可回放，积分日志无异常。

### 0-B：OrbitControls 预编译落地（~6h）

**问题**：19 个 3D 实验依赖 CDN OrbitControls，在网络不稳定的课堂环境容易崩溃，直接影响教师留存。

**方案**（已设计，未落地）：
- [ ] 将 OrbitControls.js 下载到 `public/lib/three/` 目录
- [ ] 修改 `src/config/lib-versions.ts` 中 CDN 路径指向本地
- [ ] 更新受影响的 19 个 HTML 实验文件的 script src
- [ ] 验证：断网环境下 3D 实验正常加载
- [ ] 验收：`pnpm test:e2e` 跑 3D 实验相关 Playwright tests

**验收标准**：禁用网络后，OrbitControls 相关实验仍可正常渲染。

### 0-C：single-slit-diffraction 渲染 bug（~2h）

- [ ] 读报错，定位根因（不猜，不试）
- [ ] 修复，跑 `pnpm test`
- [ ] QA 截图验证渲染结果

### 0-D：Stripe 支付沙箱验收（~4h）

**问题**：付费系统已接入但未经生产路径验证，这是商业存活的前提。

- [ ] Stripe 测试卡走完 Free → Pro 升级完整流程
- [ ] 验证 webhook 触发 → subscription 表更新 → 用户权限变更
- [ ] 验证 Pro → Max 升级路径
- [ ] 验证取消订阅 → 权限降级
- [ ] 验证积分充值（Max 套餐 UPG 积分）
- [ ] 记录每个步骤的数据库状态截图

**验收标准**：Stripe Dashboard + DB subscription 表状态一致，权限变更即时生效。

---

## Phase 1：测试覆盖率基线（P1，第 1-2 周，~30h）

**目标**：关键路径覆盖率 15% → 60%，消除静默崩溃风险。

**优先级排序**（按风险从高到低）：

### 1-A：支付 + 积分核心路径（~10h）

```
tests/unit/services/payment.test.ts
tests/unit/services/credit.test.ts
tests/integration/payment-flow.test.ts
```

必须覆盖：
- [ ] `handleCheckoutSuccess` happy path + 失败回滚
- [ ] webhook 签名验证
- [ ] 订阅续期/取消
- [ ] 积分扣减原子性（AI 失败不扣积分）
- [ ] 并发双扣（Redis 分布式锁保护）

### 1-B：UPG 生成管线（~8h）

```
tests/unit/lib/upg/generate-core.test.ts
tests/unit/lib/upg/html-sanitizer.test.ts
tests/unit/lib/upg/quality-checker.test.ts
```

必须覆盖：
- [ ] 正常生成 happy path
- [ ] CDN 白名单验证（允许/拒绝各一套用例）
- [ ] XSS 注入被过滤（script/onclick/iframe src 各类攻击向量）
- [ ] 质量检查不误杀正常 Three.js 内容

### 1-C：权限控制（~6h）

```
tests/unit/lib/experiments/access-control.test.ts
tests/unit/services/rbac.test.ts
```

必须覆盖：
- [ ] `canAccessExperiment` Free/Pro/Max 三档边界
- [ ] `getAccessibleExperiments` 返回正确过滤结果
- [ ] Progress API 未登录 401 / 越权 403

### 1-D：API 路由层（~6h）

```
tests/unit/routes/upg/generate.test.ts
tests/unit/routes/experiments/progress.test.ts
tests/unit/routes/payment/checkout.test.ts
```

每个路由至少：1 happy path + 1 未认证 + 1 参数非法

**Phase 1 验收标准**：
```bash
pnpm test:coverage
# 目标：
# shared/lib/upg/: >= 80%
# shared/services/payment.ts: >= 90%
# shared/lib/experiments/: >= 85%
# api/routes: >= 60%
```

---

## Phase 2：Wave 9-12 内容扩张（P2，第 2-6 周，~120h）

**前置条件**：Phase 0 完成（UPG 可用 + 支付验证）

**目标**：114 → 183 个实验，Chemistry 补齐（10→20）+ Earth Science 从零建立（0→13）+ Biology/Physics 扩展

**执行策略**：严格按 CTO 评审文档 `docs/plans/2026-03-26-curriculum-wave9-12-cto-review.md` 的 7 步 SOP 执行，每实验缺一不可。

### Sprint 9（第 2-3 周，~40h）：Chemistry Core

**准备工作（先做，~4h）**：
- [ ] 变更 A：Wave 类型扩展到 12（`src/shared/types/experiment.ts`）
- [ ] 变更 B：Earth Science HTML 目录创建（`public/experiments/earth-science/`）
- [ ] 变更 C：PR 模板创建（`.github/PULL_REQUEST_TEMPLATE.md`）
- [ ] 变更 F：确认缩略图规范统一

**实验开发（~36h）**：

| 实验 ID | 名称 | 3D | 预估 |
|---------|------|-----|------|
| C-08 | Balancing Chemical Equations | 否 | 3h |
| C-09 | Electron Configuration | 否 | 3h |
| C-10 | Lewis Structures | 否 | 3h |
| C-11 | Intermolecular Forces | 否 | 3h |
| C-12 | Acid-Base Equilibrium | 是 | 5h |
| C-13 | Electrochemistry | 是 | 5h |
| C-14 | Gas Laws Simulator | 否 | 3h |
| C-15 | Thermodynamics Cycles | 是 | 5h |
| C-16 | Nuclear Decay | 否 | 3h |
| C-17 | Reaction Kinetics | 否 | 3h |

**Sprint 9 验收**：
- [ ] 10 个 Chemistry 实验全部 QA 截图
- [ ] html-map.ts 新增 10 个 entries
- [ ] 10 张 Gemini 生成学术蓝风格缩略图
- [ ] Vercel Preview 环境验证

### Sprint 10（第 3-4 周，~40h）：Earth Science

| 实验 ID | 名称 | 3D | 预估 |
|---------|------|-----|------|
| E-01 | Greenhouse Effect | 否 | 3h |
| E-02 | Radiometric Dating | 否 | 3h |
| E-03 | Plate Tectonics | 是 | 5h |
| E-04 | Rock Cycle | 否 | 3h |
| E-05 | Weather Patterns | 是 | 5h |
| E-06 | Ocean Currents | 是 | 5h |
| E-07 | Earthquake Waves | 是 | 5h |
| E-08 | Volcanic Activity | 是 | 5h |
| E-09 | Soil Formation | 否 | 3h |
| E-10 | Water Cycle | 否 | 2h |
| E-11 | Atmosphere Layers | 否 | 2h |
| E-12 | Moon Phases | 是 | 4h |
| E-13 | Solar System Scale | 是 | 4h |

### Sprint 11（第 5 周，~20h）：Biology + Physics 扩展

- [ ] B-11～B-16：AP Bio 补齐 6 个（CRISPR/Gene Expression/神经传导等）
- [ ] P-AP-C-01～P-AP-C-08：AP Physics C 扩展（Circuits/EM Fields 等）

### Sprint 12（第 6 周，~20h）：缩略图 + QA 全量验证

- [ ] 补齐剩余 48 张存量缩略图（Gemini API 批量生成）
- [ ] Wave 9-12 新增 69 个实验全量 Playwright E2E 截图验证
- [ ] 更新实验注册表 `src/shared/lib/experiments/registry.ts`

---

## Phase 3：上线就绪（P2，第 6-8 周，~40h）

**目标**：产品可以被真实用户发现和使用。

### 3-A：移动端优化（~12h）

北美课堂 iPad 使用率高，不优化丢失 50% 场景。

- [ ] 实验 iframe 在 768px 以下的响应式处理
- [ ] 实验控制 UI 触摸友好（按钮最小 44px tap target）
- [ ] UPG 生成表单移动端可用性
- [ ] Playwright mobile viewport 测试

### 3-B：SEO 基础建设（~10h）

现在 SEO 为零，有产品没流量等于零。

- [ ] 每个实验页面的 `generateMetadata`（title/description/og:image）
- [ ] 实验列表页 sitemap.xml 自动生成（`/api/sitemap`）
- [ ] landing 页面 JSON-LD structured data（教育机构/课程）
- [ ] robots.txt 配置
- [ ] 核心页面 ISR 静态化（landing/pricing/experiments-listing）

### 3-C：Stripe 生产对接（~8h）

- [ ] 生产环境 webhook endpoint 配置（Vercel 环境变量）
- [ ] Stripe Dashboard 生产价格 ID 与代码同步
- [ ] 首次真实付款测试（自己买一个 Pro）
- [ ] 付款成功邮件（Resend 触发）

### 3-D：Sentry 监控（~6h）

- [ ] Sentry Next.js SDK 集成（`src/extensions/monitoring/`）
- [ ] UPG 生成失败告警规则
- [ ] 支付 webhook 失败告警规则
- [ ] Error boundary 配置

### 3-E：Vercel Cron 配置（~4h）

- [ ] `vercel.json` 中 cron 配置 `/api/cron/data-retention`（每天 03:00 UTC）
- [ ] 验证 GDPR 数据删除请求自动处理

---

## Phase 4：增长引擎（P3，第 8-12 周，~60h）

**前置条件**：Phase 3 完成，有真实付费用户

### 4-A：UGC 社区飞轮（~20h）

飞轮模型：学生用 UPG 创作 → 画廊分享 → 教师发现推荐 → 更多学生注册

- [ ] 评论系统（upgGeneration 评论）
- [ ] 收藏功能（与 like 分离）
- [ ] 画廊精选编辑（管理员置顶优质 UGC）
- [ ] 用户主页（我的创作 / 我的收藏）
- [ ] 分享卡片生成（og:image 动态生成）

### 4-B：内容营销（~16h）

- [ ] 博客系统（Fumadocs MDX，已有基础设施）
- [ ] 第一批 5 篇文章（AP Physics 考前攻略 / NGSS 对照 / 教师使用指南）
- [ ] 教师资源页面（课程计划 PDF 下载，引流）

### 4-C：AP 备考功能完善（~16h）

- [ ] AP Prep Mode：题库与实验关联（已有设计文档）
- [ ] 学习路径进度持久化优化
- [ ] 错题本（Lab Notebook AI 辅助分析）

### 4-D：社交增长（~8h）

- [ ] 邀请好友机制（推荐积分）
- [ ] 班级/小组功能（教师管理学生进度）

---

## 风险登记

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| UPG 生成质量不稳定，用户第一次就失败 | 中 | 极高 | Phase 0 完成后建立质量基准测试，不达标不上线 |
| OrbitControls CDN 在课堂崩溃 | 高 | 高 | Phase 0-B 预编译，本地化解决 |
| Stripe 生产 webhook 漏单 | 中 | 极高 | Phase 1-A 测试 + Phase 3-C 双重保障 |
| COPPA 合规漏洞（<13岁数据） | 低 | 极高 | 已有基础设施，Phase 0 验证 age-gate 流程 |
| Google/大厂复制 UPG 功能 | 中 | 高 | 通过 UGC 飞轮建立内容护城河，不只靠功能 |
| 覆盖率不足导致静默崩溃 | 高 | 中 | Phase 1 专项补测，CI 覆盖率门控 |

---

## 里程碑总览

| 里程碑 | 预计完成 | 验收标准 |
|--------|----------|---------|
| M0：基础可用 | 本周末 | UPG 截图可跑通 + 支付沙箱验证 + OrbitControls 本地化 |
| M1：测试保障 | 第 2 周末 | 关键路径覆盖率 ≥ 60% |
| M2：Wave 9 上线 | 第 4 周 | +10 Chemistry 实验，Vercel 生产可访问 |
| M3：Earth Science 上线 | 第 5 周 | +13 Earth Science 实验，实验总数 ≥ 137 |
| M4：全量 183 上线 | 第 6 周 | 实验总数 183，超越 PhET 169 |
| M5：上线就绪 | 第 8 周 | SEO 覆盖 + 移动端通过 + 生产支付跑通 |
| M6：首个付费用户 | 第 9 周 | 至少 1 笔真实 Stripe 收款 |
| M7：增长飞轮 | 第 12 周 | UGC 画廊有 10+ 用户创作，博客有 5 篇内容 |

---

## 每周工作节奏

```
周一：计划确认（本周 Sprint 目标）
周二～周四：主要开发
周五：QA + 测试 + 提交 PR
周末：Code Review + 下周准备
```

**强制检查点**（每周五）：
1. `pnpm test:coverage` — 覆盖率不能下降
2. `pnpm build` — 构建必须通过
3. `pnpm test:e2e` — E2E 截图留证
4. 更新本文档 `updated` 时间戳 + 完成项打勾

---

## 执行原则

1. **Phase 0 不完成，不启动 Wave 9-12** — UPG 跑不通，扩充内容没有意义
2. **支付逻辑修改必须先写测试** — 积分 / webhook 是最高风险区
3. **每个实验交付必须有 QA 截图** — 没有截图等于没有验证
4. **覆盖率只升不降** — CI ratchet 机制，构建失败直接 block
5. **一次只做一件事** — 不要在修 OrbitControls 的同时开始写新实验
