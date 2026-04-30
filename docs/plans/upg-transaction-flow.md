---
name: upg-transaction-flow
status: historical-plan
snapshot_date: '2026-03-09'
---

> **Historical document — not current SSOT.**
> This file is a point-in-time plan from 2026-03-09. It may describe goals, intermediate counts, or decisions that no longer match the current repository. Verify anything you rely on against `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, or the source tree.

# UPG Generation Transaction Flow

## 问题
当前流程：检查积分 → AI 生成 → 扣除积分 → 创建记录

风险：
- AI 调用成功但积分扣除失败 → 用户免费使用
- 并发请求可能绕过积分检查
- 数据库操作失败时无法回滚

## 新流程（事务保护）

```
1. 获取分布式锁（Redis）
2. 开始数据库事务
   a. 创建 pending 状态的 generation 记录
   b. 扣除积分（如果是登录用户）
   c. 提交事务
3. 调用 AI 生成（事务外）
4. 更新 generation 状态：
   - 成功 → completed
   - 失败 → failed + 回滚积分
5. 释放分布式锁
```

## 优势
- 积分扣除和记录创建原子化
- AI 调用失败时自动回滚积分
- 分布式锁防止并发竞态
- 所有状态变更可追溯

## 实现要点
- 使用 Drizzle `db().transaction()`
- AI 调用在事务外（避免长事务）
- 失败时需要手动回滚积分（创建反向 credit 记录）
