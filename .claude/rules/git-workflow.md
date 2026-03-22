# Git 工作流

## 提交格式

从 git log 推断的风格：

```
feat(scope): description
fix(scope): description
docs: description
```

常用 scope：`upg`、`auth`、`i18n`、`db`、`ui`

## 分支

- `main` — 生产分支，不直接提交
- `epic/{name}` — 功能分支，从 main 创建
- 合并回 main 后清理分支

## 规则

- commit 要原子化，一个 commit 做一件事
- 不用 `--force`、`--no-verify`
- push 前先 `pnpm build` 确认构建通过
- 冲突不自动解决，报告给用户
