#!/usr/bin/env bash
# NeonPhysics v2 — RalphFree 结构化验证脚本
# 每轮迭代结束后自动运行。exit 0 = 验证通过（任务完成），exit 1 = 继续循环。

ITERATION="${1:-0}"
TASK_FILE=".ralphfree/TASK.md"
STATUS_FILE=".ralphfree/STATUS.md"
ERRORS_FILE=".ralphfree/errors.md"
PROJECT_DIR="/Users/sky/Desktop/sciwangzhan/neonphysics-v2"

cd "$PROJECT_DIR" || exit 1

# 检查 1: STATUS.md 是否标记 COMPLETED
if grep -q "COMPLETED" "$STATUS_FILE" 2>/dev/null; then
  echo "✅ STATUS.md 已标记 COMPLETED"
else
  echo "❌ STATUS.md 未标记 COMPLETED"
  exit 1
fi

# 检查 2: 没有 BLOCKING 级别的错误
if grep -q "BLOCKING" "$ERRORS_FILE" 2>/dev/null; then
  echo "❌ 存在 BLOCKING 错误"
  exit 1
fi

# 检查 3: TypeScript 编译
if npx tsc --noEmit 2>/dev/null; then
  echo "✅ TypeScript 编译通过"
else
  echo "❌ TypeScript 编译失败"
  exit 1
fi

# 检查 4: Vitest 测试
if pnpm test --run 2>/dev/null; then
  echo "✅ Vitest 测试通过"
else
  echo "❌ Vitest 测试失败"
  exit 1
fi

# 检查 5: Criteria 区块中的 checkbox 是否全部勾选
if [[ -f "$TASK_FILE" ]]; then
  CRITERIA_BLOCK=$(awk '/^## Criteria/{found=1; next} /^## [^C]/{found=0} found' "$TASK_FILE")
  UNCHECKED=$(echo "$CRITERIA_BLOCK" | grep -c '\- \[ \]' || true)
  if [[ "$UNCHECKED" -gt 0 ]]; then
    echo "❌ Criteria 中有 $UNCHECKED 条未勾选"
    echo "$CRITERIA_BLOCK" | grep '\- \[ \]'
    exit 1
  fi
  echo "✅ Criteria 全部勾选"
fi

echo "✅ 所有验证通过（迭代 $ITERATION）"
exit 0
