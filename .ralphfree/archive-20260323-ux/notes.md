# UX 重设计 Notes

## 2026-03-23 — 初始化

- 设计文档：`docs/plans/2026-03-23-experiment-ux-redesign.md`
- 对标：Save My Exams（SEO）、Mathigon（体验）、Pocket Prep（节奏）
- 111 个实验：64 registry 数据文件 + 111 HTML 文件
- 现有组件可复用：ParameterSlider, DataPanel, FormulaDisplay, PlaybackControls, StandardsBadge, SceneContainer, PaywallGate
- shadcn 组件可复用：Accordion → LearningCard, RadioGroup → ChallengeCard, Progress → StageProgress, Toast → EasterEgg, Breadcrumb → BreadcrumbNav
- theme token：--np-gold（答错）, --np-green（答对/Free 标签）, --primary（当前阶段/Pro 标签）
