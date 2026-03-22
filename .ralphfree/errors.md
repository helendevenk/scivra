# 错误追踪日志

> 遵循 Never Hide Failures 规则

---

## 错误记录

### 2026-03-22 — BG6 PoC friction-lab
- **错误**: zenmux 代理返回 402 quota_exceeded
- **影响**: 无法跑通 PoC 生成，但脚本本身（连接/请求/错误处理）验证通过
- **解法**: 需要充值 zenmux 配额，或配置 `ANTHROPIC_API_KEY` 直连
- **状态**: 非 BLOCKING — 脚本代码完成，等待 API 配额恢复
