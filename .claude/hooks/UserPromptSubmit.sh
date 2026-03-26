#!/bin/bash
# 每次对话注入环境信息
BRANCH=$(git branch --show-current 2>/dev/null || echo "detached")
NODE_VER=$(node -v 2>/dev/null || echo "N/A")
PNPM_VER=$(pnpm -v 2>/dev/null || echo "N/A")
TEST_COUNT=$(grep -r "it\b\|test\b" src --include="*.test.ts" -l 2>/dev/null | wc -l | tr -d ' ')
SCHEMA_TABLES=$(grep -c "export const" src/config/db/schema.ts 2>/dev/null || echo "?")
GIT_DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
LAST_COMMIT=$(git log --oneline -1 2>/dev/null || echo "no commits")
CWD_REL=$(python3 -c "import os; print(os.path.relpath('$(pwd)', '$(git rev-parse --show-toplevel 2>/dev/null || echo .)'))" 2>/dev/null || echo ".")

echo "[ENV] branch=$BRANCH | node=$NODE_VER | pnpm=$PNPM_VER | test_files=$TEST_COUNT | db_tables=$SCHEMA_TABLES | dirty=$GIT_DIRTY | last_commit=$LAST_COMMIT | cwd=$CWD_REL"
