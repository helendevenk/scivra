# Homepage Rollback Runbook

> Phase 2 观察期内，任一 guardrail 触发告警且 72h 持续 → 执行此 runbook 回滚。
> 关联 plan：`docs/plans/2026-04-22-homepage-visual-overhaul.md`

---

## 触发条件（任一 + 72h 持续）

| 信号 | 阈值（较 baseline）| Baseline 位置 |
|---|---|---|
| LCP 中位数增加 | > 30% | `docs/baselines/homepage-2026-04-22-mobile.json`（1697ms）|
| Hero CTA CTR | 跌 > 15% | Vercel Analytics `hero_cta_click` |
| Bounce rate | 涨 > 15% | Vercel Analytics 默认指标 |
| Sentry error rate | 首页相关 > 1% | Sentry 项目 → filter `url contains scivra.com/` |
| Lighthouse performance | 跌 > 10 分 | mobile baseline 88 → < 78 触发 |

**所有阈值均为人工 review trigger，不是自动 revert**——K12 SaaS 14 天流量跑不出显著性，需要人工甄别样本波动 vs 真实回退。

---

## 回滚流程

### 0. 再次确认（5 分钟）

告警触发后**不要立即 revert**，先做 3 项确认：

```bash
# 1. 重跑 lighthouse 看是否仍旧偏离
cd /Users/smith/Desktop/scivra
pnpm lighthouse:baseline https://scivra.com --device=mobile

# 2. 对比 baseline
diff docs/baselines/homepage-2026-04-22-mobile.json \
     docs/baselines/homepage-$(date +%F)-mobile.json

# 3. 检查 Sentry 最近 7 天 error rate 是否有突增
#    (手动看 https://sentry.io 项目首页)
```

如果 3 项都确认回退真实，继续。

### 1. 找到 Phase 1 的合并 commits

```bash
# Phase 1 开始于 Task 12，tag: phase-1-complete
git log --oneline phase-0-complete..phase-1-complete
```

### 2. Revert（选一种）

**A. 单个 revert commit（推荐，可追溯）**：
```bash
git revert phase-0-complete..phase-1-complete --no-edit
git push origin main
```
这会创建一个 revert commit，把 Phase 1 的所有改动撤销，git 历史保留。

**B. Vercel 平台层回滚（紧急 SEV1 / 白屏 / 500 率 > 5%）**：
```bash
vercel rollback
```
选择 Phase 1 部署之前的最后一个 preview。绕过 git，30 秒内生效。之后再做 git revert 保持一致性。

### 3. 验证回滚生效

- 等 Vercel 部署完成（≈ 3 min）
- 浏览器访问 scivra.com：hero 应回到 FreePik 卡通插画（视觉确认）
- 跑 `pnpm seo:audit https://scivra.com` —— 应保持 Phase 0 baseline 4/5
- 跑 `pnpm lighthouse:baseline https://scivra.com` —— 指标应回到 Phase 0 水平

### 4. 记录 revert 决策

在 `docs/decisions/` 创建 `YYYY-MM-DD-homepage-revert.md`：

```markdown
---
created: <ISO datetime>
decision: homepage-visual-overhaul · phase-1 revert
---

## 触发的 guardrail
<哪一项 / 数据对比 / 触发时间>

## 确认过程
<72h 观察 / baseline 对比 / Sentry 检查结果>

## 假设原因
- 性能：<LCP 回退 / 字体阻塞 / canvas 未生效>
- UX：<CTA 不清晰 / 视觉识别度反而下降 / 文案改动>
- 技术：<埋点错误导致假数据 / Sentry 报错归类错误>

## 下一步
- [ ] 修复假设原因
- [ ] 重新立 Phase 1.1 plan
- [ ] 或：维持 FreePik 首页，Phase F 重新决定
```

### 5. 通知（如有团队）

- GitHub issue：`homepage v3 reverted on YYYY-MM-DD`
- Link 到 decision 文档 + 数据对比

---

## 常见误判（不要 revert 的情况）

| 信号 | 可能原因 | 正确动作 |
|---|---|---|
| CTR 跌 20% 仅 1 天 | 假期 / 节假日流量异常 | 等 3 天观察趋势 |
| 新 Sentry error 但 rate < 0.1% | 老浏览器/爬虫 / 非真实用户 | 判定 error 来源后加 filter |
| LCP 涨 50ms | 网络抖动 / lighthouse 采样差 | 多跑几次 3-run 中位数 |
| Bounce rate 涨 5% | 流量构成变化（SEO 新词吸引尝鲜用户）| 看 per-source 细分 |

**原则**：72h 持续 + 多维交叉验证才执行 revert。单点数据不作为依据。

---

## 不回滚的后续路径

如果确认是真实回退但决定不 revert（已上线一周 + SEO 已重新 crawl）：
1. 立即创建 Phase 1.1 修复 plan（`docs/plans/YYYY-MM-DD-homepage-phase-1.1-fix.md`）
2. 优先级：根据触发的 guardrail 决定
3. 时间盒：3 天内上线修复，否则执行上述 revert
