#!/bin/bash
# 每次对话注入环境信息
BRANCH=$(git branch --show-current 2>/dev/null || echo "detached")
NODE_VER=$(node -v 2>/dev/null || echo "N/A")
PNPM_VER=$(pnpm -v 2>/dev/null || echo "N/A")
TEST_COUNT=$(grep -r "it\b\|test\b" src --include="*.test.ts" -l 2>/dev/null | wc -l | tr -d ' ')
SCHEMA_TABLES=$(grep -c "export const" src/config/db/schema.ts 2>/dev/null || echo "?")

echo "[ENV] branch=$BRANCH | node=$NODE_VER | pnpm=$PNPM_VER | test_files=$TEST_COUNT | db_tables=$SCHEMA_TABLES"
