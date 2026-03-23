---
name: experiment-qa-full-audit
status: in-progress
created: 2026-03-23T00:00:00Z
updated: 2026-03-23T00:00:00Z
---

# 全量实验 QA 检查计划

## 目标

逐个检查全部 111 个 HTML 实验文件，截图 + 验证 + 生成报告。

## 检查维度（每个实验 7 项）

| # | 检查项 | 方法 | 通过标准 |
|---|--------|------|---------|
| C1 | **加载成功** | 浏览器打开，无黑屏 | canvas 或 SVG 可见，非空白 |
| C2 | **无 JS 错误** | console.error 数量 | 0 个 critical error |
| C3 | **3D 场景** | 检查 canvas 元素存在 | canvas width > 0 |
| C4 | **公式面板** | 检查 KaTeX .katex 元素 | ≥1 个 .katex 元素（2D 实验可豁免） |
| C5 | **交互控件** | 检查 input[type=range] 或 slider | ≥1 个滑块或交互按钮 |
| C6 | **Play/Reset** | 检查 button 元素 | 有播放/暂停/重置类按钮 |
| C7 | **视觉质量** | 截图人工复查 | 不是纯黑/纯白/明显broken |

## 执行策略

### 分批执行（11 批，每批 ~10 个）

| 批次 | 范围 | 数量 |
|------|------|------|
| B01 | ap-biology (1-10) | 10 |
| B02 | ap-chemistry (11-17) | 7 |
| B03 | ap-physics 1 (18-30) | 13 |
| B04 | ap-physics 2 (31-43) | 13 |
| B05 | ap-physics 3 (44-56) | 13 |
| B06 | ap-physics 4 (57-69) | 13 |
| B07 | ap-physics 5 (70-82) | 13 |
| B08 | ap-physics 6 (83-90) | 8 |
| B09 | elementary (91-101) | 11 |
| B10 | middle (102-110) | 9 |
| B11 | test (111) | 1 |

### 自动化检查脚本

对每个实验：
1. 用 Playwright 打开 `file:///path/to/experiment.html`
2. 等待 3 秒（让 Three.js 加载 + 渲染）
3. 收集 console messages（errors/warnings）
4. 查询 DOM：canvas 数量、.katex 数量、input[range] 数量、button 数量
5. 截图保存到 `test-screenshots/qa-{category}-{name}.png`
6. 记录结果到 JSON

### 输出

- `docs/reports/2026-03-23-experiment-qa-report.md` — 完整报告
- `test-screenshots/qa-*.png` — 每个实验截图
- 分级：✅ PASS / ⚠️ WARNING / ❌ FAIL
  - PASS: C1-C3 全过 + C4-C6 至少 2/3
  - WARNING: C1 过但 C4-C6 有缺失
  - FAIL: C1 失败（黑屏/白屏）或 C2 有 critical error

## RalphFree 配置

- 每批一个迭代
- 质量门：每批完成后统计 PASS/WARN/FAIL
- 失败计数 > 30% → 暂停分析根因
- 全部完成后生成汇总报告
