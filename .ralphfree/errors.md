# 错误追踪日志

> 遵循 Never Hide Failures 规则
> 所有错误必须立即记录

## 已记录错误

### ERR-001: 首批文件覆盖了原始 experiments/
- 时间: 2026-03-28
- 类型: 路径错误
- 描述: 首次执行 P0-A 时写入了 `public/experiments/ap-physics/` 而非 `public/experiments-v2/`
- 影响: 13 个原始文件被覆盖
- 修复: 用 `git restore public/experiments/ap-physics/*.html` 恢复，新文件复制到 experiments-v2/
- 预防: TASK.md 明确标注输出路径，每批执行前检查目标目录

### ERR-002: 部分 P0-A 文件行数低于 500 行
- 时间: 2026-03-28
- 类型: 质量门控失败
- 描述: kinematics-graphs(446L), circular-motion(421L), rotational-motion(434L), balancing-act(437L) 行数低于 500
- 影响: 4/13 文件不满足 ≥500 行要求
- 修复: 后续批次生成时确保包含更丰富的内容（更详细的 Codex 注释、更完整的 Quiz）
- 同类计数: 2/2 → **换方案**：下一批明确要求更丰富内容（详细 Codex 注释区块 + 扩展左面板说明 + 更多 KaTeX 公式展示）
- 受影响文件（需修复）: forces-motion-basics(486L), gravity-force-lab-basics(487L), circular-motion(445L), balancing-act(469L)
